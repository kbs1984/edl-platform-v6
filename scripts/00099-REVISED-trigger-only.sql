-- ---
-- session: "00099"
-- type: "script" 
-- status: "active"
-- created: "2025-08-28"
-- title: "REVISED: Just Attach Profile Creation Trigger"
-- purpose: "Based on reality files - function exists, just need trigger attachment"
-- language: "sql"
-- category: "trigger"
-- topics: ["reality-based", "trigger", "profile"]
-- priority: "P0"
-- domain: "reconciliation"
-- ---

-- Session 00099 REVISED: Reality-Based Fix
-- 
-- REALITY CHECK from 00081-request-* files:
-- ✅ add_new_user function EXISTS
-- ✅ search_school function EXISTS  
-- ❌ NO trigger on auth.users (missing critical link!)
--
-- This script ONLY adds what's missing based on reality

-- ============================================
-- PART 1: Check Current Function (Optional)
-- ============================================

-- View the existing add_new_user function
-- SELECT routine_definition FROM information_schema.routines 
-- WHERE routine_schema = 'public' AND routine_name = 'add_new_user';

-- ============================================
-- PART 2: Attach Missing Trigger (CRITICAL)
-- ============================================

-- Drop trigger if it somehow exists (safety)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Attach the trigger - this is the missing piece!
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.add_new_user();

-- ============================================
-- PART 3: Fix Existing Users Without Profiles  
-- ============================================

-- Create profiles for any existing users who don't have them
INSERT INTO public.profile (
  id,
  email,
  name,
  username,
  user_role,
  term_agree_time
)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1)),
  COALESCE(raw_user_meta_data->>'username', split_part(email, '@', 1)),
  'STUDENT'::public.user_role_type,
  NOW()
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profile)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- PART 4: Add EDL Columns if Missing
-- ============================================

-- Add call_sign column to student table
ALTER TABLE public.student 
ADD COLUMN IF NOT EXISTS call_sign VARCHAR(50);

-- Add grade_level column to student table  
ALTER TABLE public.student 
ADD COLUMN IF NOT EXISTS grade_level VARCHAR(20);

-- ============================================
-- PART 5: Verification Queries
-- ============================================

-- Verify trigger now exists on auth.users
SELECT 
    'AUTH TRIGGER STATUS' as check_type,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.triggers 
            WHERE event_object_schema = 'auth'
            AND event_object_table = 'users'
            AND trigger_name = 'on_auth_user_created'
        ) THEN '✅ TRIGGER ATTACHED'
        ELSE '❌ TRIGGER MISSING'
    END as status;

-- Check existing functions (should show our functions)
SELECT 
    'FUNCTIONS CHECK' as check_type,
    COUNT(*) || ' functions including add_new_user and search_school' as status
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('add_new_user', 'search_school');

-- Check for EDL columns
SELECT 
    'EDL COLUMNS' as check_type,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'student'
            AND column_name IN ('call_sign', 'grade_level')
            HAVING COUNT(*) = 2
        ) THEN '✅ CALL_SIGN & GRADE_LEVEL EXIST'
        ELSE '❌ EDL COLUMNS MISSING'
    END as status;

-- Check users vs profiles
SELECT 
    'PROFILE COVERAGE' as check_type,
    COUNT(u.id) as total_users,
    COUNT(p.id) as users_with_profiles,
    COUNT(u.id) - COUNT(p.id) as missing_profiles
FROM auth.users u
LEFT JOIN public.profile p ON u.id = p.id;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
SELECT '🎉 REALITY-BASED FIX COMPLETE! The missing trigger is now attached.' as message;