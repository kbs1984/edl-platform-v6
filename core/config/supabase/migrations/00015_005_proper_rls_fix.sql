-- Session 00015: Proper RLS Fix Following Protocol
-- Created: 2025-08-16
-- Purpose: Fix users table RLS policies following 00012_001_teams_first_v2.sql pattern
-- Reference: SUPABASE-SQL-PROTOCOL.md

-- ==============================================
-- USERS TABLE RLS POLICIES (Following Session 00012 Pattern)
-- ==============================================

-- DROP existing broken policies first
DROP POLICY IF EXISTS "Users can view own record" ON users;
DROP POLICY IF EXISTS "Users can update own record" ON users;
DROP POLICY IF EXISTS "Allow trigger to insert users" ON users;

-- USERS POLICIES (Following exact pattern from Session 00012)
-- SELECT: Anyone can view users (following "Anyone can view profiles" pattern)
CREATE POLICY "Anyone can view users" ON users 
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- INSERT: Special policy for auth signup flow
-- Allow inserts during signup process (trigger context)
CREATE POLICY "Allow signup process" ON users
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- UPDATE: Users can only update their own record
CREATE POLICY "Users update own record" ON users 
  FOR UPDATE
  TO authenticated
  USING (auth_id = auth.uid())
  WITH CHECK (auth_id = auth.uid());

-- ==============================================
-- SIMPLIFIED TRIGGER (Following Success Pattern)
-- ==============================================

-- Remove the complex trigger and use simple approach
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS create_user_on_signup();

-- Create simple, reliable function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (auth_id, email, created_at)
  VALUES (NEW.id, NEW.email, NEW.created_at);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- ==============================================
-- VERIFICATION (Following Protocol)
-- ==============================================

-- Check RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity,
  '✅ RLS enabled' as status
FROM pg_tables 
WHERE tablename = 'users' AND rowsecurity = true;

-- Check policies exist
SELECT 
  policyname,
  cmd,
  roles,
  '✅ Policy created' as status
FROM pg_policies 
WHERE tablename = 'users';

-- Check trigger exists
SELECT 
  trigger_name,
  event_object_table,
  '✅ Trigger created' as status
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

SELECT '✅ Users table RLS fixed following Session 00012 pattern' as final_status;