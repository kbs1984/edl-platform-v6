-- =====================================================
-- Session 00060: PART 2 CORRECTED - Handle Dependencies
-- =====================================================
-- Good news: All users have profiles and students!
-- Issue: Session 44 named the function wrong (handle_new_user)
-- Fix: Drop trigger first, then fix function name
-- =====================================================

-- Step 1: Drop the trigger FIRST (it depends on the function)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Step 2: Now we can safely drop Session 44's wrongly-named function
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Step 3: Also drop the correctly-named one if it exists
DROP FUNCTION IF EXISTS public.add_new_user() CASCADE;

-- Step 4: Create the CORRECT function with BACKUP logic + improvements
CREATE OR REPLACE FUNCTION public.add_new_user() 
RETURNS trigger
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
BEGIN
  -- Provider-specific profile creation (from backup)
  IF new.raw_app_meta_data ->> 'provider' = 'email' THEN
    -- Email signups: Create complete profile (improved from backup)
    INSERT INTO public.profile (id, email, user_role, active)
    VALUES (new.id, new.email, 'STUDENT', true)
    ON CONFLICT (id) DO UPDATE 
    SET email = EXCLUDED.email,
        user_role = COALESCE(public.profile.user_role, 'STUDENT'),
        active = true;
    
  ELSIF new.raw_app_meta_data ->> 'provider' IN ('kakao', 'google') THEN
    -- OAuth signups: Create full profile with metadata
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
  ELSE
    -- Fallback for any other providers
    INSERT INTO public.profile (id, email, user_role, active)
    VALUES (new.id, new.email, 'STUDENT', true)
    ON CONFLICT (id) DO UPDATE 
    SET email = EXCLUDED.email,
        user_role = COALESCE(public.profile.user_role, 'STUDENT'),
        active = true;
  END IF;
  
  -- Always create student record (critical for dashboard)
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
  ) ON CONFLICT (user_id) DO NOTHING;
  
  RETURN new;
END;
$$;

-- Step 5: Create trigger with CORRECT function name
CREATE TRIGGER on_auth_user_created 
  AFTER INSERT ON auth.users 
  FOR EACH ROW 
  EXECUTE FUNCTION public.add_new_user();

-- Step 6: Verify the fix worked
SELECT 
    'Trigger Check' as status,
    trigger_name,
    action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Step 7: Test with a simple query
SELECT 
    'Function exists' as check,
    proname as function_name
FROM pg_proc 
WHERE proname = 'add_new_user';

-- Success message
SELECT 'Auth flow restored! Function renamed from handle_new_user to add_new_user' as result;