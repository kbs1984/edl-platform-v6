# Session 00040: Update Schema Snapshot After RLS Fix

## Quick Instructions

### Step 1: Run Capture SQL in Supabase
Copy this entire SQL block and run in Supabase SQL Editor:

```sql
-- 1. RLS POLICIES (MOST CRITICAL - Shows the fix)
SELECT json_build_object(
    'policies', json_agg(
        json_build_object(
            'schemaname', schemaname,
            'tablename', tablename,
            'policyname', policyname,
            'permissive', permissive,
            'roles', roles,
            'cmd', cmd,
            'qual', qual,
            'with_check', with_check
        ) ORDER BY tablename, policyname
    )
) AS policies_snapshot
FROM pg_policies
WHERE schemaname = 'public';

-- 2. TABLE STRUCTURE
SELECT json_build_object(
    'tables', json_agg(
        json_build_object(
            'table_name', table_name,
            'column_name', column_name,
            'data_type', data_type,
            'is_nullable', is_nullable,
            'column_default', column_default,
            'character_maximum_length', character_maximum_length
        ) ORDER BY table_name, ordinal_position
    )
) AS tables_snapshot
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- 3. CONSTRAINTS
SELECT json_build_object(
    'constraints', json_agg(
        json_build_object(
            'table_name', tc.table_name,
            'constraint_name', tc.constraint_name,
            'constraint_type', tc.constraint_type,
            'column_name', kcu.column_name,
            'foreign_table_name', ccu.table_name,
            'foreign_column_name', ccu.column_name,
            'check_clause', cc.check_clause
        ) ORDER BY tc.table_name, tc.constraint_name
    )
) AS constraints_snapshot
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
LEFT JOIN information_schema.constraint_column_usage ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
LEFT JOIN information_schema.check_constraints cc
    ON cc.constraint_name = tc.constraint_name
    AND cc.constraint_schema = tc.table_schema
WHERE tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_name;

-- 4. INDEXES
SELECT json_build_object(
    'indexes', json_agg(
        json_build_object(
            'schemaname', schemaname,
            'tablename', tablename,
            'indexname', indexname,
            'indexdef', indexdef
        ) ORDER BY tablename, indexname
    )
) AS indexes_snapshot
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- 5. ROW COUNTS (Should show test profiles if created)
SELECT json_build_object(
    'row_counts', json_build_object(
        'profiles', (SELECT COUNT(*) FROM profiles),
        'teams', (SELECT COUNT(*) FROM teams),
        'team_members', (SELECT COUNT(*) FROM team_members),
        'team_join_requests', (SELECT COUNT(*) FROM team_join_requests)
    )
) AS counts_snapshot;

-- 6. RLS STATUS PER TABLE
SELECT json_build_object(
    'rls_enabled', json_agg(
        json_build_object(
            'tablename', tablename,
            'rowsecurity', rowsecurity,
            'forcerowsecurity', forcerowsecurity
        ) ORDER BY tablename
    )
) AS rls_status_snapshot
FROM pg_tables
WHERE schemaname = 'public';
```

### Step 2: Save Results
You'll get 6 JSON results. Copy each one.

### Step 3: Update Snapshot
Run in terminal:
```bash
python3 scripts/00039-parse-snapshot.py
```

Paste each JSON result when prompted.

### Step 4: Verify Update
Check the updated policies:
```bash
python3 scripts/00039-check-schema.py --table profiles --policies
```

Should show the fixed "Users create own profile" policy with:
- FOR INSERT 
- TO authenticated
- WITH CHECK (auth.uid() = user_id)

### What We're Looking For
The key change after your RLS fix should be:
- Old: Multiple conflicting INSERT policies or missing INSERT policy
- New: Single clean "Users create own profile" INSERT policy

This will confirm the fix is applied and captured in our snapshot.