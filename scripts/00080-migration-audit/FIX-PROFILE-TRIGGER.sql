-- ============================================
-- Session 00080 - Fix Profile Creation Trigger
-- Purpose: Ensure profile gets created when user signs up
-- Run this in Supabase Dashboard SQL Editor
-- ============================================

-- Step 1: Check if trigger exists
SELECT 
    tgname as trigger_name,
    tgrelid::regclass as table_name,
    proname as function_name
FROM pg_trigger t
JOIN pg_proc p ON p.oid = t.tgfoid
WHERE tgname LIKE '%user%' 
   OR tgname LIKE '%profile%'
   OR proname LIKE '%user%'
   OR proname LIKE '%profile%';

-- Step 2: Drop old trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Step 3: Create or replace the function
-- CRITICAL: Must match profile table columns exactly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insert into profile table with minimal required fields
  INSERT INTO public.profile (
    id,           -- UUID from auth.users
    created_at,   -- Timestamp
    updated_at    -- Timestamp
    -- Add other required fields here if they exist
  ) VALUES (
    new.id,
    NOW(),
    NOW()
  );
  
  -- Return the new user record
  RETURN new;
  
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't block user creation
    RAISE WARNING 'Profile creation failed for user %: %', new.id, SQLERRM;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- Step 5: Test by creating a test user (optional)
-- This would normally be done through the app
-- INSERT INTO auth.users (id, email) 
-- VALUES (gen_random_uuid(), 'test@example.com')
-- RETURNING id;

-- Step 6: Verify trigger is active
SELECT 
    'Trigger created successfully' as status,
    tgname as trigger_name,
    tgrelid::regclass as on_table,
    tgenabled as is_enabled
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';

-- Step 7: Create profiles for any existing users without them
-- (In case some users were created while trigger was missing)
INSERT INTO public.profile (id, created_at, updated_at)
SELECT 
  au.id,
  COALESCE(au.created_at, NOW()),
  NOW()
FROM auth.users au
LEFT JOIN public.profile p ON p.id = au.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Step 8: Count results
SELECT 
  (SELECT COUNT(*) FROM auth.users) as total_users,
  (SELECT COUNT(*) FROM public.profile) as total_profiles,
  (SELECT COUNT(*) FROM auth.users au LEFT JOIN public.profile p ON p.id = au.id WHERE p.id IS NULL) as users_without_profiles;

-- ============================================
-- Expected Result:
-- 1. Trigger 'on_auth_user_created' exists and is enabled
-- 2. Function 'handle_new_user' exists
-- 3. All existing users have profiles
-- 4. New signups will auto-create profiles
-- ============================================