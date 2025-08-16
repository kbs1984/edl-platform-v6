-- Session 00015: Verify Schema Fix Migration
-- Run this after applying 00015_001_fix_schema_discrepancy.sql

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

-- 1. Check if users table exists and has data
SELECT 
    'Users Table' as check_name,
    COUNT(*) as record_count,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ Users migrated from auth.users'
        ELSE '⚠️ No users found - may need manual migration'
    END as status
FROM users;

-- 2. Check if all auth.users have corresponding users records
SELECT 
    'Auth to Users Mapping' as check_name,
    COUNT(auth.users.id) as auth_users,
    COUNT(users.id) as user_records,
    CASE
        WHEN COUNT(auth.users.id) = COUNT(users.id) THEN '✅ All auth users mapped'
        ELSE '❌ Missing user records for some auth users'
    END as status
FROM auth.users
LEFT JOIN users ON users.auth_id = auth.users.id;

-- 3. Check profiles table has new columns
SELECT 
    'Profiles Schema' as check_name,
    COUNT(*) FILTER (WHERE column_name = 'avatar_url') as has_avatar,
    COUNT(*) FILTER (WHERE column_name = 'personality_type') as has_personality,
    COUNT(*) FILTER (WHERE column_name = 'proper_user_id') as has_proper_ref,
    CASE
        WHEN COUNT(*) FILTER (WHERE column_name IN ('avatar_url', 'personality_type', 'proper_user_id')) = 3 
        THEN '✅ All new columns added'
        ELSE '❌ Missing columns in profiles'
    END as status
FROM information_schema.columns
WHERE table_name = 'profiles' 
AND table_schema = 'public';

-- 4. Check if profiles are properly linked
SELECT 
    'Profile References' as check_name,
    COUNT(*) as total_profiles,
    COUNT(proper_user_id) as with_proper_ref,
    COUNT(user_id) as with_old_ref,
    CASE
        WHEN COUNT(*) = COUNT(proper_user_id) THEN '✅ All profiles properly linked'
        WHEN COUNT(proper_user_id) > 0 THEN '⚠️ Partial migration - some profiles linked'
        ELSE '❌ No profiles linked to users table'
    END as status
FROM profiles;

-- 5. Check RLS policies
SELECT 
    'RLS Policies' as check_name,
    schemaname,
    tablename,
    COUNT(policyname) as policy_count,
    STRING_AGG(policyname, ', ') as policies
FROM pg_policies
WHERE tablename IN ('users', 'profiles')
GROUP BY schemaname, tablename;

-- 6. Check trigger exists
SELECT 
    'Auto-creation Trigger' as check_name,
    trigger_name,
    event_object_table,
    action_timing,
    CASE
        WHEN trigger_name = 'on_auth_user_created' THEN '✅ Trigger installed'
        ELSE '❌ Trigger not found'
    END as status
FROM information_schema.triggers
WHERE trigger_schema = 'public'
AND trigger_name = 'on_auth_user_created';

-- 7. Summary
SELECT 
    '=== MIGRATION SUMMARY ===' as report,
    CURRENT_TIMESTAMP as checked_at,
    current_database() as database_name;