# Secure DDL execution on hosted Supabase for Claude Code CLI

For development workflows requiring direct DDL execution on hosted Supabase PostgreSQL databases, the research reveals that **Supabase doesn't provide intermediate permission levels** between anon keys and service role access. This creates a critical security challenge: you need service-level credentials for DDL operations, but these credentials grant excessive permissions. The solution requires combining multiple approaches to achieve secure DDL execution with proper audit logging and migration tracking.

## Direct connection with service credentials

The most straightforward approach for DDL execution uses Supabase's direct database connection string with the postgres role password. Unlike the anon key, this connection provides full DDL capabilities including CREATE, ALTER, and DROP operations for functions, policies, and tables. Supabase offers three connection formats: direct connections for administrative tasks, transaction poolers for serverless functions, and session poolers for long-lived connections. For DDL operations, you'll need the direct connection format: `postgresql://postgres:password@db.[project-ref].supabase.co:5432/postgres`.

The Supabase CLI doesn't include a dedicated `db execute` command for ad-hoc SQL execution. Instead, it provides migration-based workflows through commands like `supabase db push` and `supabase db diff`. For direct DDL execution during debugging sessions, you'll need to establish a PostgreSQL connection using the database URL with tools like psql or programmatic clients. This approach bypasses Supabase's API layer entirely, operating directly against the PostgreSQL instance.

## Secure credential storage for CLI access

For Claude Code CLI integration, implement **1Password's secret reference pattern** combined with environment variables. This approach allows committing configuration files to version control while keeping credentials secure. Create a `.env` file containing references rather than actual credentials:

```bash
DATABASE_URL="op://Development/Supabase/direct_connection"
SUPABASE_SERVICE_ROLE="op://Development/Supabase/service_role_key"
SUPABASE_DB_PASSWORD="op://Development/Supabase/db_password"
```

Execute commands through 1Password's CLI wrapper to inject credentials at runtime: `op run -- psql $DATABASE_URL`. This pattern provides programmatic access while maintaining security boundaries. For enhanced automation, consider HashiCorp Vault for dynamic, time-limited credentials that automatically rotate, reducing the blast radius of potential credential leaks.

For team scaling, establish project-specific vaults with environment-based access controls. Developers receive read access to development credentials, limited staging access, and no production access. Service accounts handle CI/CD operations with restricted vault permissions.

## Comprehensive audit logging implementation

Since Supabase's hosted environment doesn't provide direct access to pgAudit configuration, implement **PostgreSQL event triggers** for DDL tracking. This native solution captures all DDL operations without requiring extension installation:

```sql
CREATE TABLE ddl_history (
    id SERIAL PRIMARY KEY,
    session_id TEXT DEFAULT pg_backend_pid()::text || '_' || extract(epoch from now()),
    ddl_date TIMESTAMP DEFAULT statement_timestamp(),
    ddl_tag TEXT,
    object_name TEXT,
    command_text TEXT,
    user_name TEXT DEFAULT current_user
);

CREATE OR REPLACE FUNCTION log_ddl() RETURNS event_trigger AS $$
DECLARE
    obj RECORD;
BEGIN
    FOR obj IN SELECT * FROM pg_event_trigger_ddl_commands() LOOP
        INSERT INTO ddl_history (ddl_tag, object_name, command_text)
        VALUES (TG_TAG, obj.object_identity, current_query());
    END LOOP;
END;
$$ LANGUAGE plpgsql;

CREATE EVENT TRIGGER log_ddl_commands ON ddl_command_end 
    EXECUTE PROCEDURE log_ddl();
```

For tracking dropped objects specifically (addressing your lost policies issue), add a complementary trigger:

```sql
CREATE OR REPLACE FUNCTION track_drops() RETURNS event_trigger AS $$
DECLARE
    obj RECORD;
BEGIN
    FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects() LOOP
        INSERT INTO ddl_history (ddl_tag, object_name, command_text)
        VALUES ('DROP_' || obj.object_type, 
                obj.schema_name || '.' || obj.object_name, 
                'DROPPED: ' || current_query());
    END LOOP;
END;
$$ LANGUAGE plpgsql;

CREATE EVENT TRIGGER track_drops ON sql_drop 
    EXECUTE PROCEDURE track_drops();
```

## Migration generation from logged changes

For converting logged DDL operations into migration files, implement a **hybrid workflow** combining event trigger logs with schema diffing tools. The `migra` tool, which Supabase uses internally, provides comprehensive schema comparison capabilities:

```bash
# Capture current state before debugging session
pg_dump --schema-only $DATABASE_URL > schema_before.sql

# After debugging session, generate migration
migra postgresql:///schema_before.sql $DATABASE_URL > generated_migration.sql

# Alternatively, use Supabase CLI's diff command
supabase db diff --db-url $DATABASE_URL -f debugging_changes
```

For automated migration generation, query the ddl_history table to reconstruct executed commands:

```sql
SELECT command_text 
FROM ddl_history 
WHERE session_id = 'current_session_id'
ORDER BY ddl_date;
```

Export these commands as a migration file, then validate using Supabase's migration workflow: `supabase migration new debugging_session` followed by manual review and cleanup.

## Custom PostgreSQL roles with limited DDL

While Supabase doesn't offer built-in intermediate roles, you can create custom roles with specific DDL permissions. However, PostgreSQL's permission model presents limitations: ALTER and DROP privileges are inherent to object ownership, not grantable separately. Create a development role that owns specific schemas:

```sql
-- Create development role with schema ownership
CREATE ROLE dev_ddl_user LOGIN PASSWORD 'secure_password';
CREATE SCHEMA dev_schema AUTHORIZATION dev_ddl_user;

-- Grant creation privileges
GRANT CREATE ON DATABASE postgres TO dev_ddl_user;
GRANT CREATE ON SCHEMA dev_schema TO dev_ddl_user;

-- Set default privileges for new objects
ALTER DEFAULT PRIVILEGES FOR ROLE dev_ddl_user IN SCHEMA dev_schema 
    GRANT ALL ON TABLES TO dev_ddl_user;
ALTER DEFAULT PRIVILEGES FOR ROLE dev_ddl_user IN SCHEMA dev_schema 
    GRANT ALL ON FUNCTIONS TO dev_ddl_user;
```

This approach limits DDL operations to specific schemas while preventing modifications to production tables. Connect using this role's credentials instead of the postgres superuser for reduced privilege scope.

## SECURITY DEFINER functions for controlled DDL

For complex RLS policy changes and SECURITY DEFINER functions, implement wrapper functions that execute with elevated privileges while maintaining audit trails:

```sql
CREATE OR REPLACE FUNCTION execute_ddl_with_logging(
    ddl_command TEXT,
    description TEXT DEFAULT NULL
) RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql
SET search_path = public, pg_catalog
AS $$
BEGIN
    -- Validate DDL command (basic SQL injection prevention)
    IF ddl_command !~* '^(CREATE|ALTER|DROP|GRANT|REVOKE)' THEN
        RAISE EXCEPTION 'Invalid DDL command';
    END IF;
    
    -- Log the operation
    INSERT INTO ddl_history (command_text, object_name)
    VALUES (ddl_command, COALESCE(description, 'Manual DDL execution'));
    
    -- Execute the DDL
    EXECUTE ddl_command;
    
    -- Optional: Send notification for monitoring
    PERFORM pg_notify('ddl_executed', json_build_object(
        'command', ddl_command,
        'user', current_user,
        'timestamp', now()
    )::text);
END;
$$;

-- Restrict execution to specific users
REVOKE EXECUTE ON FUNCTION execute_ddl_with_logging FROM PUBLIC;
GRANT EXECUTE ON FUNCTION execute_ddl_with_logging TO dev_ddl_user;
```

## State verification for development debugging

To verify database state and track changes across debugging sessions, implement a comprehensive state capture system:

```sql
CREATE OR REPLACE FUNCTION capture_schema_state() 
RETURNS TABLE(snapshot_id UUID, captured_at TIMESTAMP) AS $$
DECLARE
    v_snapshot_id UUID := gen_random_uuid();
BEGIN
    -- Store current schema state
    INSERT INTO schema_snapshots (snapshot_id, captured_at, schema_dump)
    VALUES (
        v_snapshot_id,
        now(),
        (SELECT json_agg(row_to_json(t)) FROM (
            SELECT 
                n.nspname as schema_name,
                c.relname as object_name,
                c.relkind as object_type,
                pg_get_viewdef(c.oid, true) as definition
            FROM pg_class c
            JOIN pg_namespace n ON n.oid = c.relnamespace
            WHERE n.nspname NOT IN ('pg_catalog', 'information_schema')
        ) t)
    );
    
    -- Capture RLS policies
    INSERT INTO policy_snapshots (snapshot_id, policy_data)
    VALUES (
        v_snapshot_id,
        (SELECT json_agg(row_to_json(p)) FROM pg_policies p)
    );
    
    RETURN QUERY SELECT v_snapshot_id, now();
END;
$$ LANGUAGE plpgsql;
```

Call this function before and after debugging sessions to track all schema modifications, including dropped policies that previously caused issues.

## Practical implementation workflow

For immediate implementation, combine these approaches into a cohesive workflow. Store credentials securely using 1Password CLI with environment variable references. Establish direct database connections using the postgres role password for DDL operations. Deploy event triggers to capture all DDL commands with session tracking. Use migra or Supabase's diff command to generate migration files from schema changes. 

Create a wrapper script for Claude Code CLI that manages the entire process:

```bash
#!/bin/bash
# supabase-ddl-execute.sh

# Load credentials via 1Password
eval $(op signin)
export DATABASE_URL=$(op read "op://Development/Supabase/direct_connection")

# Start new DDL session
SESSION_ID=$(psql $DATABASE_URL -t -c "SELECT pg_backend_pid()::text || '_' || extract(epoch from now())")

# Execute DDL command
psql $DATABASE_URL -c "$1"

# Generate migration from session
psql $DATABASE_URL -t -c "
    SELECT command_text FROM ddl_history 
    WHERE session_id = '$SESSION_ID' 
    ORDER BY ddl_date
" > "migrations/session_${SESSION_ID}.sql"

echo "DDL executed and logged to session: $SESSION_ID"
```

This approach provides the direct DDL execution capabilities you need while maintaining security through credential isolation, comprehensive audit logging, and automated migration generation. The event trigger system ensures you'll never lose track of dropped policies or other schema changes, while the migration generation capability supports your future scalability requirements.