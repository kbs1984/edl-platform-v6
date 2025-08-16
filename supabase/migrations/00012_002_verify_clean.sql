-- Session 00012: Clean Slate Verification
-- Purpose: Verify database is clean before applying teams-first migration
-- Created: 2025-08-16
-- Run this AFTER 00012_000_clean_slate.sql to confirm clean state

-- Check for any remaining tables in public schema
SELECT 
    'Public Tables' as check_type,
    COUNT(*) as count,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ CLEAN' 
        ELSE '❌ Found ' || COUNT(*) || ' tables - run clean_slate.sql first'
    END as status
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename NOT LIKE 'pg_%'
AND tablename NOT IN ('schema_migrations', 'supabase_migrations');

-- Check for any remaining functions
SELECT 
    'Public Functions' as check_type,
    COUNT(*) as count,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ CLEAN' 
        ELSE '⚠️ Found ' || COUNT(*) || ' functions'
    END as status
FROM information_schema.routines 
WHERE routine_schema = 'public';

-- Check for any remaining views
SELECT 
    'Public Views' as check_type,
    COUNT(*) as count,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ CLEAN' 
        ELSE '⚠️ Found ' || COUNT(*) || ' views'
    END as status
FROM information_schema.views 
WHERE table_schema = 'public';

-- Check for any remaining policies
SELECT 
    'RLS Policies' as check_type,
    COUNT(*) as count,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ CLEAN' 
        ELSE '⚠️ Found ' || COUNT(*) || ' policies'
    END as status
FROM pg_policies 
WHERE schemaname = 'public';

-- List any tables that still exist (for debugging)
SELECT 
    '⚠️ Remaining table: ' || tablename as warning
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename NOT LIKE 'pg_%'
AND tablename NOT IN ('schema_migrations', 'supabase_migrations')
LIMIT 10;

-- Final verdict
SELECT 
    CASE 
        WHEN (
            SELECT COUNT(*) FROM pg_tables 
            WHERE schemaname = 'public' 
            AND tablename NOT LIKE 'pg_%'
            AND tablename NOT IN ('schema_migrations', 'supabase_migrations')
        ) = 0 
        THEN '🎯 DATABASE IS CLEAN - Ready for 00012_001_teams_first.sql' 
        ELSE '❌ DATABASE NOT CLEAN - Run 00012_000_clean_slate.sql first'
    END as final_status;