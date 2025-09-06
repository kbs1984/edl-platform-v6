-- ---
-- session: "00099"
-- type: "script"
-- status: "active"
-- created: "2025-08-28"
-- title: "Complete Database Foundation for Onboarding"
-- purpose: "Apply all database fixes needed for auth → onboarding → dashboard flow"
-- language: "sql"
-- category: "foundation"
-- topics: ["database", "profile", "trigger", "school", "edl"]
-- priority: "P0"
-- domain: "reconciliation"
-- ---

-- Session 00099: COMPLETE Database Foundation Script
-- Run this entire script in Supabase Dashboard SQL Editor
-- This combines fixes from Sessions 81, 85, 87, 88, and 91

-- ============================================
-- PART 1: Profile Creation Function & Trigger
-- ============================================

-- Drop existing trigger if it exists (to avoid conflicts)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the complete add_new_user function
CREATE OR REPLACE FUNCTION public.add_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create profile with ALL required fields
  IF new.raw_app_meta_data ->> 'provider' = 'email' THEN
    INSERT INTO public.profile (
      id,
      email,
      name,
      username,
      user_role,
      term_agree_time,
      date_of_birth,
      gender,
      image_path
    ) VALUES (
      new.id,
      new.email,
      COALESCE(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
      COALESCE(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)),
      'STUDENT'::public.user_role_type,
      NOW(),
      NULL, -- date_of_birth set in onboarding
      NULL, -- gender set in onboarding
      NULL  -- image_path set in onboarding
    );
    
  ELSIF new.raw_app_meta_data ->> 'provider' IN ('kakao', 'google') THEN
    INSERT INTO public.profile (
      id,
      email,
      name,
      username,
      user_role,
      term_agree_time,
      date_of_birth,
      gender,
      image_path
    ) VALUES (
      new.id,
      new.email,
      COALESCE(
        new.raw_user_meta_data ->> 'name',
        new.raw_user_meta_data ->> 'full_name',
        split_part(new.email, '@', 1)
      ),
      COALESCE(
        new.raw_user_meta_data ->> 'username',
        new.raw_user_meta_data ->> 'preferred_username',
        split_part(new.email, '@', 1)
      ),
      'STUDENT'::public.user_role_type,
      NOW(),
      NULL,
      NULL,
      new.raw_user_meta_data ->> 'avatar_url'
    );
  END IF;
  
  -- Create student record by default
  INSERT INTO public.student (
    user_id,
    division,
    exp,
    level,
    challenge_enabled,
    created_at,
    updated_at
  ) VALUES (
    new.id,
    'VILLIGER'::public.division,
    0,
    1,
    false,
    NOW(),
    NOW()
  ) ON CONFLICT (user_id) DO NOTHING;
  
  RETURN new;

EXCEPTION
  WHEN others THEN
    RAISE LOG 'Error in add_new_user for user %: % - %', new.id, SQLSTATE, SQLERRM;
    RETURN new;
END;
$$;

-- CRITICAL: Attach the trigger to auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.add_new_user();

-- Fix any existing users without profiles
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
-- PART 2: School Search Function (No pg_trgm)
-- ============================================

DROP FUNCTION IF EXISTS public.search_school(text);

CREATE OR REPLACE FUNCTION public.search_school(search_query text)
RETURNS TABLE(id uuid, name text)
LANGUAGE sql
STABLE
AS $$
  SELECT id, name
  FROM school
  WHERE 
    LOWER(name) ILIKE '%' || LOWER(search_query) || '%'
    OR LOWER(name) ILIKE LOWER(search_query) || '%'
  ORDER BY 
    CASE 
      WHEN LOWER(name) = LOWER(search_query) THEN 0
      WHEN LOWER(name) ILIKE LOWER(search_query) || '%' THEN 1
      ELSE 2
    END,
    name ASC
  LIMIT 20;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.search_school(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_school(text) TO anon;

-- ============================================
-- PART 3: EDL-Specific Columns
-- ============================================

-- Add call_sign column to student table
ALTER TABLE public.student 
ADD COLUMN IF NOT EXISTS call_sign VARCHAR(50);

-- Add grade_level column to student table  
ALTER TABLE public.student 
ADD COLUMN IF NOT EXISTS grade_level VARCHAR(20);

-- ============================================
-- PART 4: Verification Queries
-- ============================================

-- Verify trigger exists
SELECT 
    'Trigger Status:' as check_name,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.triggers 
            WHERE trigger_schema = 'auth' 
            AND trigger_name = 'on_auth_user_created'
        ) THEN '✅ Trigger attached'
        ELSE '❌ Trigger MISSING'
    END as status;

-- Verify function exists
SELECT 
    'Function Status:' as check_name,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.routines 
            WHERE routine_schema = 'public' 
            AND routine_name = 'add_new_user'
        ) THEN '✅ Function exists'
        ELSE '❌ Function MISSING'
    END as status;

-- Verify school search function
SELECT 
    'School Search Status:' as check_name,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.routines 
            WHERE routine_schema = 'public' 
            AND routine_name = 'search_school'
        ) THEN '✅ School search exists'
        ELSE '❌ School search MISSING'
    END as status;

-- Verify EDL columns
SELECT 
    'EDL Columns Status:' as check_name,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'student'
            AND column_name IN ('call_sign', 'grade_level')
        ) THEN '✅ EDL columns exist'
        ELSE '❌ EDL columns MISSING'
    END as status;

-- Check recent users and their profiles
SELECT 
    'Recent Users Check:' as check_name,
    COUNT(u.id) as total_users,
    COUNT(p.id) as users_with_profiles,
    COUNT(u.id) - COUNT(p.id) as missing_profiles
FROM auth.users u
LEFT JOIN public.profile p ON u.id = p.id
WHERE u.created_at > NOW() - INTERVAL '7 days';

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
SELECT '🎉 Database foundation script complete! Test with a new user signup.' as message;