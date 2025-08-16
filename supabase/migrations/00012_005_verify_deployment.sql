-- Session 00012: Verify Teams-First Deployment
-- Purpose: Confirm our schema was successfully created
-- Created: 2025-08-16

-- List all our created tables
SELECT 
    'TABLES CREATED:' as section,
    tablename,
    'Session 00012' as created_by
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'teams', 'team_members', 'team_join_requests')
ORDER BY tablename;

-- Count RLS policies
SELECT 
    'RLS POLICIES:' as section,
    tablename,
    COUNT(*) as policy_count
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'teams', 'team_members', 'team_join_requests')
GROUP BY tablename
ORDER BY tablename;

-- List indexes created
SELECT 
    'INDEXES:' as section,
    indexname,
    tablename
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'teams', 'team_members', 'team_join_requests')
AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- Check helper function
SELECT 
    'HELPER FUNCTIONS:' as section,
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public'
AND routine_name = 'get_team_member_count';

-- Final summary
SELECT 
    'DEPLOYMENT SUMMARY:' as section,
    '✅ Session 00012 Teams-First Schema Active' as status,
    COUNT(DISTINCT tablename)::text || ' tables' as tables,
    COUNT(DISTINCT policyname)::text || ' policies' as policies
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'teams', 'team_members', 'team_join_requests');