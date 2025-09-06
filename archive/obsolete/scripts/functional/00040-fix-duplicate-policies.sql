-- Session 00040: Fix Duplicate RLS Policies
-- Your snapshot shows duplicate INSERT and UPDATE policies causing conflicts

-- Step 1: View current problematic policies
SELECT 
    policyname,
    cmd,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename = 'profiles'
ORDER BY cmd, policyname;

-- Step 2: DROP ALL policies on profiles table to start clean
DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles;
DROP POLICY IF EXISTS "Profiles viewable by authenticated users" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users create own profile" ON profiles;
DROP POLICY IF EXISTS "Users delete own profile" ON profiles;
DROP POLICY IF EXISTS "Users update own profile" ON profiles;

-- Step 3: Create SINGLE, CLEAN policies (no duplicates)
-- SELECT: Anyone can view profiles
CREATE POLICY "Anyone can view profiles" ON profiles
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- INSERT: Users create their own profile (simple check)
CREATE POLICY "Users create own profile" ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users update their own profile
CREATE POLICY "Users update own profile" ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users delete their own profile
CREATE POLICY "Users delete own profile" ON profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Step 4: Verify we now have exactly 4 policies (no duplicates)
SELECT 
    'AFTER FIX' as status,
    COUNT(*) as policy_count,
    string_agg(policyname || ' (' || cmd || ')', ', ' ORDER BY cmd) as policies
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename = 'profiles';

-- Expected result: 4 policies total
-- - 1 SELECT policy
-- - 1 INSERT policy  
-- - 1 UPDATE policy
-- - 1 DELETE policy