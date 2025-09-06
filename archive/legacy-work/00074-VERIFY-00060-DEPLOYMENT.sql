-- ============================================================================
-- Session 74 Reality Check: Verify 00060-AUTH-FLOW-FIX.sql Deployment
-- ============================================================================
-- Purpose: Confirm whether the 00060 SQL fixes have been deployed to production
-- Context: Brian said "pretty sure" but we need TRUTH not assumptions
-- Created: 2025-08-26 by Session 74 (Reality Domain)
-- ============================================================================

-- RATIONALE:
-- The 00060-AUTH-FLOW-FIX.sql file made several critical changes:
-- 1. Created/modified the handle_new_user() function
-- 2. Added student record creation on signup
-- 3. Set up proper role assignments
-- 4. Fixed the auth flow from signup → profile → student → dashboard
-- 
-- We need to verify these components exist and work correctly.

-- ============================================================================
-- TEST 1: Check if handle_new_user() function exists and has correct signature
-- ============================================================================
-- Expected: Function should exist and create both profile and student records

SELECT 
    p.proname as function_name,
    pg_get_function_identity_arguments(p.oid) as arguments,
    pg_get_functiondef(p.oid) as function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
    AND p.proname = 'handle_new_user';

-- If NO ROWS returned: 00060 is NOT deployed
-- If function exists: Check the definition includes student creation

-- ============================================================================
-- TEST 2: Check for auth.users trigger that calls handle_new_user
-- ============================================================================
-- Expected: Trigger should exist on auth.users table

SELECT 
    tg.tgname as trigger_name,
    pg_get_triggerdef(tg.oid) as trigger_definition
FROM pg_trigger tg
JOIN pg_class c ON tg.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'auth' 
    AND c.relname = 'users'
    AND tg.tgname LIKE '%new_user%';

-- If NO TRIGGER: Profile/student creation won't happen automatically

-- ============================================================================
-- TEST 3: Check if student table has required columns
-- ============================================================================
-- Expected: Should have user_id column linking to auth.users

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
    AND table_name = 'student'
    AND column_name IN ('user_id', 'call_sign', 'grade_level')
ORDER BY ordinal_position;

-- Should see: user_id (uuid), call_sign (text), grade_level (text or enum)

-- ============================================================================
-- TEST 4: Check for presence of specific 00060 improvements
-- ============================================================================
-- The 00060 fix added specific logic for student creation. Let's check:

SELECT EXISTS (
    SELECT 1 
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' 
        AND p.proname = 'handle_new_user'
        AND pg_get_functiondef(p.oid) LIKE '%student%'
) as has_student_creation;

-- Should return TRUE if 00060 is deployed

-- ============================================================================
-- TEST 5: Check recent test data (if any exists)
-- ============================================================================
-- If users have signed up recently, they should have profile AND student records

WITH recent_users AS (
    SELECT id, email, created_at
    FROM auth.users
    WHERE created_at > NOW() - INTERVAL '7 days'
    LIMIT 5
)
SELECT 
    u.email,
    u.created_at as user_created,
    p.id as has_profile,
    s.id as has_student
FROM recent_users u
LEFT JOIN public.profile p ON p.id = u.id
LEFT JOIN public.student s ON s.user_id = u.id;

-- If users have profile but NO student, 00060 is NOT working
-- If users have BOTH profile and student, 00060 IS working

-- ============================================================================
-- TEST 6: Verify the complete auth flow chain
-- ============================================================================
-- Check all components needed for auth → profile → student → dashboard

SELECT 
    'handle_new_user function' as component,
    EXISTS (
        SELECT 1 FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public' AND p.proname = 'handle_new_user'
    ) as exists
UNION ALL
SELECT 
    'on_auth_user_created trigger' as component,
    EXISTS (
        SELECT 1 FROM pg_trigger tg
        JOIN pg_class c ON tg.tgrelid = c.oid
        JOIN pg_namespace n ON c.relnamespace = n.oid
        WHERE n.nspname = 'auth' AND c.relname = 'users'
        AND tg.tgname LIKE '%auth_user_created%'
    ) as exists
UNION ALL
SELECT 
    'profile table' as component,
    EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'profile'
    ) as exists
UNION ALL
SELECT 
    'student table' as component,
    EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'student'
    ) as exists
UNION ALL
SELECT 
    'student.user_id column' as component,
    EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' 
        AND table_name = 'student'
        AND column_name = 'user_id'
    ) as exists;

-- ALL should be TRUE for complete auth flow to work

-- ============================================================================
-- SUMMARY QUERY: One query to rule them all
-- ============================================================================
-- Run this for quick verification:

SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_proc p
            JOIN pg_namespace n ON p.pronamespace = n.oid
            WHERE n.nspname = 'public' 
            AND p.proname = 'handle_new_user'
            AND pg_get_functiondef(p.oid) LIKE '%student%'
        ) THEN '✅ 00060 DEPLOYED - Student creation in handle_new_user'
        WHEN EXISTS (
            SELECT 1 FROM pg_proc p
            JOIN pg_namespace n ON p.pronamespace = n.oid
            WHERE n.nspname = 'public' 
            AND p.proname = 'handle_new_user'
        ) THEN '⚠️ PARTIAL - handle_new_user exists but may not create student'
        ELSE '❌ NOT DEPLOYED - handle_new_user function missing'
    END as deployment_status;

-- ============================================================================
-- INTERPRETATION GUIDE:
-- ============================================================================
-- ✅ If handle_new_user exists WITH student creation logic = 00060 DEPLOYED
-- ⚠️ If handle_new_user exists WITHOUT student logic = 00044 only (partial)
-- ❌ If handle_new_user missing = Neither 00044 nor 00060 deployed
--
-- Brian needs to run these queries in Supabase SQL Editor and report back
-- which components exist. This gives us TRUTH not assumptions.
-- ============================================================================