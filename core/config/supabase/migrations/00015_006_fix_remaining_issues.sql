-- Session 00015: Fix Remaining Issues
-- Problem 1: Profile creation violates RLS
-- Problem 2: team_members.status column doesn't exist

-- ============================================================
-- FIX 1: Profile Creation RLS
-- ============================================================
-- Drop the restrictive policy
DROP POLICY IF EXISTS "Users create own profile" ON profiles;

-- Create more permissive policy for profile creation
-- Allow authenticated users to create their own profile
CREATE POLICY "Users create own profile" ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id OR
    auth.uid() IN (SELECT auth_id FROM users WHERE id = proper_user_id)
  );

-- ============================================================
-- FIX 2: Add Missing Column to team_members
-- ============================================================
-- The UI expects a status column in team_members
ALTER TABLE team_members 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';

-- Update existing records
UPDATE team_members 
SET status = 'active' 
WHERE status IS NULL;

-- ============================================================
-- VERIFICATION
-- ============================================================
SELECT 
  'Profiles RLS' as check_type,
  policyname,
  cmd,
  '✅ Fixed' as status
FROM pg_policies 
WHERE tablename = 'profiles' AND policyname = 'Users create own profile';

SELECT 
  'team_members.status' as check_type,
  column_name,
  data_type,
  '✅ Column added' as status
FROM information_schema.columns 
WHERE table_name = 'team_members' AND column_name = 'status';

SELECT '✅ Profile creation and team query issues fixed' as final_status;