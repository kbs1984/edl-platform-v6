-- Fix Profile Creation Issue
-- Run this in Supabase SQL Editor

-- Step 1: Create profile for existing auth users who don't have one
INSERT INTO public.profile (id, email, user_role, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  'STUDENT' as user_role,  -- Default to STUDENT, change if needed
  NOW() as created_at,
  NOW() as updated_at
FROM auth.users au
LEFT JOIN public.profile p ON p.id = au.id
WHERE p.id IS NULL
  AND au.email IS NOT NULL;

-- Step 2: Create trigger function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profile (id, email, user_role, created_at, updated_at)
  VALUES (
    new.id,
    new.email,
    'STUDENT',  -- Default role
    NOW(),
    NOW()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 4: Verify your user has a profile now
SELECT 
  au.id,
  au.email,
  p.id as profile_id,
  p.user_role,
  p.created_at
FROM auth.users au
LEFT JOIN public.profile p ON p.id = au.id
WHERE au.email = 'your-test-email@test.com';  -- Replace with your test email

-- Step 5: Grant necessary permissions for the profile table
GRANT ALL ON public.profile TO authenticated;
GRANT SELECT ON public.profile TO anon;

-- Step 6: Create RLS policy for users to read their own profile
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profile;
CREATE POLICY "Users can view own profile" ON public.profile
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profile;
CREATE POLICY "Users can update own profile" ON public.profile
  FOR UPDATE USING (auth.uid() = id);

-- Step 7: If user is a student, create student record too
INSERT INTO public.student (user_id, location, graduation_year, level, exp, ranking, challenge_enabled)
SELECT 
  au.id as user_id,
  'Unknown' as location,
  EXTRACT(YEAR FROM CURRENT_DATE) + 4 as graduation_year,  -- Default 4 years from now
  0 as level,
  0 as exp,
  0 as ranking,
  false as challenge_enabled
FROM auth.users au
LEFT JOIN public.student s ON s.user_id = au.id
WHERE s.user_id IS NULL
  AND au.email IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.profile p 
    WHERE p.id = au.id 
    AND p.user_role = 'STUDENT'
  );

-- Step 8: Test that profile access works
-- This should return your profile after running the above
SELECT * FROM public.profile WHERE id = auth.uid();