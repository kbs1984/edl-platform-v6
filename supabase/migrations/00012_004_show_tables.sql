-- Session 00012: Show Exact Table Names
-- Purpose: Simple list of what needs to be dropped
-- Created: 2025-08-16

SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename NOT LIKE 'pg_%'
AND tablename NOT LIKE '_prisma%'
AND tablename NOT IN (
    'schema_migrations', 
    'supabase_migrations',
    'supabase_functions',
    'supabase_migrations_lock',
    'seed_files'
)
ORDER BY tablename;