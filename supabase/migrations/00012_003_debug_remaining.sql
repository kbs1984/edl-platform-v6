-- Session 00012: Debug What's Still in Database
-- Purpose: Find exactly what tables/objects are preventing clean slate
-- Created: 2025-08-16

-- List ALL tables in public schema (including system tables we should ignore)
SELECT 
    'ALL PUBLIC TABLES:' as section,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- List only non-system tables
SELECT 
    'NON-SYSTEM TABLES:' as section,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename NOT LIKE 'pg_%'
AND tablename NOT LIKE '_prisma%'
AND tablename NOT IN (
    'schema_migrations', 
    'supabase_migrations',
    'supabase_functions',
    'supabase_migrations_lock'
)
ORDER BY tablename;

-- Check if these are Supabase internal tables
SELECT 
    'MIGRATION TABLES:' as section,
    tablename
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN ('schema_migrations', 'supabase_migrations')
ORDER BY tablename;

-- Check auth schema tables (these are OK to keep)
SELECT 
    'AUTH SCHEMA TABLES:' as section,
    COUNT(*) as count
FROM pg_tables 
WHERE schemaname = 'auth';

-- Check storage schema tables (these are OK to keep)
SELECT 
    'STORAGE SCHEMA TABLES:' as section,
    COUNT(*) as count
FROM pg_tables 
WHERE schemaname = 'storage';

-- Final count of actual user tables (what we care about)
SELECT 
    'USER TABLES COUNT:' as section,
    COUNT(*) as count,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ No user tables - database is clean for our purposes'
        ELSE '❌ Found ' || COUNT(*) || ' user tables that need removal'
    END as status
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
);