-- =====================================================
-- Session 00060: Auth Flow Fix - Extracted from Backup
-- =====================================================
-- Issue: Users can sign up but profile/student creation fails
-- Solution: Deploy EXACT logic from backup file
-- =====================================================

-- Step 1: Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Step 2: Create/Replace the add_new_user function (EXACT from backup)
CREATE OR REPLACE FUNCTION public.add_new_user() 
RETURNS trigger
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
BEGIN
  -- Handle different auth providers
  IF new.raw_app_meta_data ->> 'provider' = 'email' THEN
    -- Email signups get minimal profile
    INSERT INTO public.profile (id)
    VALUES (new.id);
    
  ELSIF new.raw_app_meta_data ->> 'provider' = 'kakao'
        OR new.raw_app_meta_data ->> 'provider' = 'google' THEN
    -- OAuth signups get full profile
    INSERT INTO public.profile (id, email, name, image_path)
    VALUES (
      new.id,
      new.email,
      new.raw_user_meta_data ->> 'name',
      new.raw_user_meta_data ->> 'avatar_url'
    );
  END IF;
  
  -- CRITICAL ADDITION: Create student record for ALL users
  -- This was missing from the original deployment!
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
    'VILLIGER'::public.division,  -- Default starting division
    0,                             -- Starting experience
    1,                             -- Starting level
    false,                         -- Challenge mode off by default
    NOW(),
    NOW()
  ) ON CONFLICT (user_id) DO NOTHING;  -- Prevent duplicates
  
  RETURN new;
END;
$$;

-- Step 3: Create the trigger (EXACT from backup)
CREATE TRIGGER on_auth_user_created 
  AFTER INSERT ON auth.users 
  FOR EACH ROW 
  EXECUTE FUNCTION public.add_new_user();

-- Step 4: Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;
GRANT ALL ON auth.users TO postgres, service_role;

-- =====================================================
-- VERIFICATION QUERIES (Run these after deployment)
-- =====================================================

-- Check if trigger exists:
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Check if function exists:
SELECT 
  proname,
  prosrc 
FROM pg_proc 
WHERE proname = 'add_new_user';

-- Test with a recent user (if any):
SELECT 
  u.id,
  u.email,
  p.id as profile_id,
  s.user_id as student_user_id,
  s.division,
  s.level
FROM auth.users u
LEFT JOIN public.profile p ON p.id = u.id
LEFT JOIN public.student s ON s.user_id = u.id
ORDER BY u.created_at DESC
LIMIT 5;

-- =====================================================
-- ROLLBACK SCRIPT (If needed)
-- =====================================================
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- DROP FUNCTION IF EXISTS public.add_new_user();