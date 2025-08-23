---
session: "unknown"
type: "documentation"
status: "current"
created: "2025-08-23"
title: "Schema Export From Supabase Instructions"
purpose: "Document schema export from supabase instructions"
topics: ['documentation']
priority: "P1"
domain: "core"
---

Schema Export From Supabase 

Step-by-Step SQL Editor Extraction

Run these queries **one at a time** in the SQL Editor and save the results:

### 1. Extract All Custom Types
```sql
-- Query 1: Get all custom enum types
SELECT format('CREATE TYPE %I.%I AS ENUM (%s);',
    n.nspname,
    t.typname,
    string_agg(quote_literal(e.enumlabel), ', ' ORDER BY e.enumsortorder)
)
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
JOIN pg_namespace n ON n.oid = t.typnamespace
WHERE n.nspname IN ('public', 'debate', 'chat')
GROUP BY n.nspname, t.typname
ORDER BY n.nspname, t.typname;
```

### 2. Extract All Tables with Columns
```sql
-- Query 2: Get CREATE TABLE statements (FIXED)
WITH columns AS (
    SELECT 
        table_schema,
        table_name,
        string_agg(
            format('    %I %s%s%s',
                column_name,
                CASE 
                    WHEN data_type = 'USER-DEFINED' THEN udt_schema || '.' || udt_name
                    WHEN data_type = 'ARRAY' THEN 
                        CASE 
                            WHEN udt_name IS NOT NULL THEN udt_name || '[]'
                            ELSE 'text[]'  -- fallback for arrays
                        END
                    ELSE data_type || CASE 
                        WHEN character_maximum_length IS NOT NULL 
                        THEN '(' || character_maximum_length || ')'
                        ELSE ''
                    END
                END,
                CASE WHEN is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END,
                CASE WHEN column_default IS NOT NULL THEN ' DEFAULT ' || column_default ELSE '' END
            ),
            E',\n' ORDER BY ordinal_position
        ) as column_list
    FROM information_schema.columns
    WHERE table_schema IN ('public', 'chat', 'debate')
    GROUP BY table_schema, table_name
)
SELECT format(E'CREATE TABLE %I.%I (\n%s\n);',
    table_schema,
    table_name,
    column_list
)
FROM columns
ORDER BY table_schema, table_name;
```

### 3. Extract All Primary Keys
```sql
-- Query 3: Get PRIMARY KEY constraints
SELECT format('ALTER TABLE %I.%I ADD CONSTRAINT %I PRIMARY KEY (%s);',
    n.nspname,
    c.relname,
    con.conname,
    string_agg(a.attname, ', ' ORDER BY a.attnum)
)
FROM pg_constraint con
JOIN pg_class c ON c.oid = con.conrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
JOIN pg_attribute a ON a.attrelid = c.oid AND a.attnum = ANY(con.conkey)
WHERE n.nspname IN ('public', 'debate', 'chat')
AND con.contype = 'p'
GROUP BY n.nspname, c.relname, con.conname;
```

### 4. Extract All Foreign Keys
```sql
-- Query 4: Get FOREIGN KEY constraints
SELECT format('ALTER TABLE %I.%I ADD CONSTRAINT %I FOREIGN KEY (%s) REFERENCES %I.%I(%s);',
    n1.nspname,
    c1.relname,
    con.conname,
    string_agg(a1.attname, ', ' ORDER BY a1.attnum),
    n2.nspname,
    c2.relname,
    string_agg(a2.attname, ', ' ORDER BY a2.attnum)
)
FROM pg_constraint con
JOIN pg_class c1 ON c1.oid = con.conrelid
JOIN pg_namespace n1 ON n1.oid = c1.relnamespace
JOIN pg_class c2 ON c2.oid = con.confrelid
JOIN pg_namespace n2 ON n2.oid = c2.relnamespace
JOIN pg_attribute a1 ON a1.attrelid = c1.oid AND a1.attnum = ANY(con.conkey)
JOIN pg_attribute a2 ON a2.attrelid = c2.oid AND a2.attnum = ANY(con.confkey)
WHERE n1.nspname IN ('public', 'debate', 'chat')
AND con.contype = 'f'
GROUP BY n1.nspname, c1.relname, con.conname, n2.nspname, c2.relname;
```

### 5. Extract Functions
```sql
-- Query 5: Get all custom functions
SELECT pg_get_functiondef(p.oid) || ';'
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname IN ('public', 'debate', 'chat')
ORDER BY n.nspname, p.proname;
```

### 6. Extract Triggers
```sql
-- Query 6: Get all triggers
SELECT format('CREATE TRIGGER %I %s %s ON %I.%I FOR EACH %s EXECUTE FUNCTION %s;',
    t.tgname,
    CASE 
        WHEN t.tgtype & 2 = 2 THEN 'BEFORE'
        ELSE 'AFTER'
    END,
    CASE 
        WHEN t.tgtype & 4 = 4 THEN 'INSERT'
        WHEN t.tgtype & 8 = 8 THEN 'DELETE'
        WHEN t.tgtype & 16 = 16 THEN 'UPDATE'
    END,
    n.nspname,
    c.relname,
    CASE 
        WHEN t.tgtype & 1 = 1 THEN 'ROW'
        ELSE 'STATEMENT'
    END,
    p.proname || '()'
)
FROM pg_trigger t
JOIN pg_class c ON c.oid = t.tgrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
JOIN pg_proc p ON p.oid = t.tgfoid
WHERE n.nspname IN ('public', 'debate', 'chat')
AND NOT t.tgisinternal
ORDER BY n.nspname, c.relname, t.tgname;
```

### 7. Extract RLS Policies
```sql
-- Query 7: Get RLS policies
SELECT format('CREATE POLICY %I ON %I.%I AS %s FOR %s TO %s%s%s;',
    pol.polname,
    n.nspname,
    c.relname,
    CASE pol.polpermissive WHEN true THEN 'PERMISSIVE' ELSE 'RESTRICTIVE' END,
    CASE pol.polcmd 
        WHEN 'r' THEN 'SELECT'
        WHEN 'a' THEN 'INSERT'
        WHEN 'w' THEN 'UPDATE'
        WHEN 'd' THEN 'DELETE'
        WHEN '*' THEN 'ALL'
    END,
    array_to_string(pol.polroles::name[], ', '),
    CASE WHEN pol.polqual IS NOT NULL THEN E'\n    USING (' || pg_get_expr(pol.polqual, pol.polrelid) || ')' ELSE '' END,
    CASE WHEN pol.polwithcheck IS NOT NULL THEN E'\n    WITH CHECK (' || pg_get_expr(pol.polwithcheck, pol.polrelid) || ')' ELSE '' END
)
FROM pg_policy pol
JOIN pg_class c ON c.oid = pol.polrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname IN ('public', 'debate', 'chat')
ORDER BY n.nspname, c.relname, pol.polname;
```

### 8. Check for RLS Enabled Tables
```sql
-- Query 8: See which tables have RLS enabled
SELECT format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY;',
    n.nspname,
    c.relname
)
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname IN ('public', 'debate', 'chat')
AND c.relrowsecurity = true
ORDER BY n.nspname, c.relname;
```

## How to Use:

1. Run each query separately in SQL Editor
2. Copy the results to a text file
3. Combine them in this order:
   ```sql
   -- Schema Export from Supabase
   -- Generated: [DATE]
   
   -- 1. Types
   [Results from Query 1]
   
   -- 2. Tables
   [Results from Query 2]
   
   -- 3. Primary Keys
   [Results from Query 3]
   
   -- 4. Foreign Keys
   [Results from Query 4]
   
   -- 5. Functions
   [Results from Query 5]
   
   -- 6. Triggers
   [Results from Query 6]
   
   -- 7. RLS Policies
   [Results from Query 7]
   
   -- 8. Enable RLS
   [Results from Query 8]
   
   -- 9. EDL Customization
   ALTER TABLE public.student 
   ADD COLUMN IF NOT EXISTS call_sign text UNIQUE NOT NULL;
   COMMENT ON COLUMN public.student.call_sign IS 'EDL: Unique identifier for radio communications';
   ```

This approach works perfectly in the SQL Editor without any nested aggregation errors!