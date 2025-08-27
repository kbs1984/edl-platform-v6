-- Session 00039: Fix profile creation RLS policy
-- Issue: Users cannot create their own profile due to RLS violation

-- First, let's check existing policies
DO $$
BEGIN
    RAISE NOTICE 'Checking existing profiles RLS policies...';
END $$;

-- Drop existing INSERT policy if it exists
DROP POLICY IF EXISTS "Users create own profile" ON profiles;

-- Create a more permissive INSERT policy for authenticated users
-- This ensures users can create exactly one profile for themselves
CREATE POLICY "Users create own profile" ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- User must be creating profile for themselves
    auth.uid() = user_id
    AND
    -- User cannot already have a profile (prevent duplicates)
    NOT EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid()
    )
  );

-- Also ensure the UPDATE policy is correct
DROP POLICY IF EXISTS "Users update own profile" ON profiles;

CREATE POLICY "Users update own profile" ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Verify the SELECT policy exists
DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles;

CREATE POLICY "Anyone can view profiles" ON profiles
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Add helpful comment for developers
COMMENT ON POLICY "Users create own profile" ON profiles IS 
  'Allows authenticated users to create exactly one profile for themselves. Session 00039 fix.';

-- Verification query (run manually to test)
-- This should return the policies we just created:
/*
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;
*/