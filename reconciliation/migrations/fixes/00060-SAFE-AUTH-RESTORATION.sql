-- =====================================================
-- Session 00060: SAFE Auth Flow Restoration
-- =====================================================
-- Context: Session 44's fixes replaced original backup logic
-- Goal: Restore backup functionality WITHOUT breaking existing users
-- =====================================================

-- PART 1: CHECK CURRENT STATE (Run this first to see what we have)
-- =====================================================
SELECT 
    'Current Functions' as check_type,
    proname as function_name,
    prosrc as function_source
FROM pg_proc 
WHERE proname IN ('add_new_user', 'handle_new_user');

SELECT 
    'Current Triggers' as check_type,
    trigger_name,
    event_object_table,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'users'
   OR trigger_name LIKE '%auth%';

SELECT 
    'Recent Users' as check_type,
    u.id,
    u.email,
    u.created_at,
    CASE WHEN p.id IS NOT NULL THEN 'Has Profile' ELSE 'NO PROFILE' END as profile_status,
    CASE WHEN s.user_id IS NOT NULL THEN 'Has Student' ELSE 'NO STUDENT' END as student_status
FROM auth.users u
LEFT JOIN public.profile p ON p.id = u.id
LEFT JOIN public.student s ON s.user_id = u.id
ORDER BY u.created_at DESC
LIMIT 10;

-- =====================================================
-- PART 2: RESTORE ORIGINAL BACKUP LOGIC
-- =====================================================

-- Step 1: Drop Session 44's incorrect trigger/function names
DROP TRIGGER IF EXISTS handle_new_user ON auth.users;  -- Session 44's wrong name
DROP FUNCTION IF EXISTS public.handle_new_user();      -- Session 44's function

-- Step 2: Ensure correct trigger is dropped
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Step 3: Restore EXACT backup version with CRITICAL ADDITION
CREATE OR REPLACE FUNCTION public.add_new_user() 
RETURNS trigger
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
BEGIN
  -- ORIGINAL BACKUP LOGIC: Provider-specific profile creation
  IF new.raw_app_meta_data ->> 'provider' = 'email' THEN
    -- Email signups: Create minimal profile (original backup behavior)
    INSERT INTO public.profile (id, email, user_role, active)
    VALUES (new.id, new.email, 'STUDENT', true)
    ON CONFLICT (id) DO UPDATE 
    SET email = EXCLUDED.email,
        user_role = COALESCE(public.profile.user_role, 'STUDENT'),
        active = true;
    
  ELSIF new.raw_app_meta_data ->> 'provider' IN ('kakao', 'google') THEN
    -- OAuth signups: Create full profile (original backup behavior)
    INSERT INTO public.profile (id, email, name, image_path, user_role, active)
    VALUES (
      new.id,
      new.email,
      new.raw_user_meta_data ->> 'name',
      new.raw_user_meta_data ->> 'avatar_url',
      'STUDENT',
      true
    )
    ON CONFLICT (id) DO UPDATE 
    SET email = EXCLUDED.email,
        name = COALESCE(public.profile.name, EXCLUDED.name),
        image_path = COALESCE(public.profile.image_path, EXCLUDED.image_path),
        user_role = COALESCE(public.profile.user_role, 'STUDENT'),
        active = true;
  END IF;
  
  -- CRITICAL ADDITION: Student record (missing from both backup AND Session 44)
  -- This is what makes the dashboard work!
  INSERT INTO public.student (
    user_id,
    location,
    graduation_year,
    level,
    exp,
    ranking,
    challenge_enabled,
    created_at,
    updated_at
  ) VALUES (
    new.id,
    'Unknown',
    EXTRACT(YEAR FROM CURRENT_DATE) + 4,
    0,
    0,
    0,
    false,
    NOW(),
    NOW()
  ) ON CONFLICT (user_id) DO NOTHING;  -- Don't break existing students
  
  RETURN new;
END;
$$;

-- Step 4: Create the CORRECT trigger name from backup
CREATE TRIGGER on_auth_user_created 
  AFTER INSERT ON auth.users 
  FOR EACH ROW 
  EXECUTE FUNCTION public.add_new_user();

-- Step 5: Fix any existing users missing student records
INSERT INTO public.student (
    user_id,
    location,
    graduation_year,
    level,
    exp,
    ranking,
    challenge_enabled,
    created_at,
    updated_at
)
SELECT 
    p.id as user_id,
    'Unknown' as location,
    EXTRACT(YEAR FROM CURRENT_DATE) + 4 as graduation_year,
    0 as level,
    0 as exp,
    0 as ranking,
    false as challenge_enabled,
    NOW() as created_at,
    NOW() as updated_at
FROM public.profile p
LEFT JOIN public.student s ON s.user_id = p.id
WHERE s.user_id IS NULL;

-- =====================================================
-- PART 3: VERIFY THE FIX
-- =====================================================

-- Check that all users now have both profile and student records
SELECT 
    'Final Check' as status,
    COUNT(DISTINCT u.id) as total_users,
    COUNT(DISTINCT p.id) as users_with_profile,
    COUNT(DISTINCT s.user_id) as users_with_student,
    COUNT(DISTINCT u.id) - COUNT(DISTINCT p.id) as missing_profiles,
    COUNT(DISTINCT u.id) - COUNT(DISTINCT s.user_id) as missing_students
FROM auth.users u
LEFT JOIN public.profile p ON p.id = u.id
LEFT JOIN public.student s ON s.user_id = u.id;

-- List any problematic users
SELECT 
    u.id,
    u.email,
    u.created_at,
    p.id IS NOT NULL as has_profile,
    s.user_id IS NOT NULL as has_student
FROM auth.users u
LEFT JOIN public.profile p ON p.id = u.id
LEFT JOIN public.student s ON s.user_id = u.id
WHERE p.id IS NULL OR s.user_id IS NULL
ORDER BY u.created_at DESC;

-- =====================================================
-- REDIRECT URLs TO RESTORE IN SUPABASE DASHBOARD
-- =====================================================
-- After running this SQL, go to Supabase Dashboard:
-- Authentication → URL Configuration
-- 
-- Remove these (Session 44 additions):
-- - http://localhost:3002
-- - Any dashboard.localhost.localdomain entries
--
-- Keep/Add these (for your current setup):
-- - Your Vercel URLs (if using Vercel deployment)
-- - http://auth.localhost.localdomain:3000 (if using subdomains)
-- - http://dashboard.localhost.localdomain:3001 (if using subdomains)
-- 
-- OR for simple localhost:
-- - http://localhost:3000
-- - http://localhost:3001
-- =====================================================