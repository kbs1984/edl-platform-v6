-- Session 00040: Fix Profile Creation RLS Policy
-- Run this in Supabase SQL Editor to enable profile creation

-- First, check what policies currently exist
SELECT 
    tablename,
    policyname,
    cmd,
    roles,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename = 'profiles'
ORDER BY cmd;

-- Drop ALL existing INSERT policies on profiles table
-- (There may be duplicates causing conflicts)
DROP POLICY IF EXISTS "Users create own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users insert own profile" ON profiles;

-- Create a single, clear INSERT policy
CREATE POLICY "Users create own profile" ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Verify the new policy exists
SELECT 
    'After Fix' as status,
    tablename,
    policyname,
    cmd,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename = 'profiles'
  AND cmd = 'INSERT';

-- Test: This should return the authenticated user's ID
SELECT auth.uid() as "Your User ID";

-- If you see a UUID above, profile creation should now work!