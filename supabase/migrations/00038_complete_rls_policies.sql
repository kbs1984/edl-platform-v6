-- Session 00038: Complete RLS Policy Set
-- Created after Schema Snapshot revealed NO policies exist despite RLS being enabled
-- This is why authentication and profile creation were failing!

-- ============================================
-- PROFILES TABLE POLICIES
-- ============================================

-- Drop existing policies first (if they exist)
DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users create own profile" ON profiles;
DROP POLICY IF EXISTS "Users update own profile" ON profiles;
DROP POLICY IF EXISTS "Users delete own profile" ON profiles;

-- Anyone can view profiles (public directory)
CREATE POLICY "Anyone can view profiles" ON profiles
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Users create their own profile (SIMPLIFIED - removed duplicate check)
CREATE POLICY "Users create own profile" ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
-- Note: The UNIQUE constraint on user_id handles duplicates automatically

-- Users update their own profile
CREATE POLICY "Users update own profile" ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own profile (GDPR compliance)
CREATE POLICY "Users delete own profile" ON profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- TEAMS TABLE POLICIES
-- ============================================

-- Drop existing policies first (if they exist)
DROP POLICY IF EXISTS "Anyone can view teams" ON teams;
DROP POLICY IF EXISTS "Authenticated users create teams" ON teams;
DROP POLICY IF EXISTS "Founders update their teams" ON teams;
DROP POLICY IF EXISTS "Founders delete their teams" ON teams;

-- Anyone can view teams (public listing)
CREATE POLICY "Anyone can view teams" ON teams
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Authenticated users with profiles can create teams
CREATE POLICY "Authenticated users create teams" ON teams
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid())
  );

-- Founders can update their teams
CREATE POLICY "Founders update their teams" ON teams
  FOR UPDATE
  TO authenticated
  USING (
    founder_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  )
  WITH CHECK (
    founder_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- Founders can delete their teams
CREATE POLICY "Founders delete their teams" ON teams
  FOR DELETE
  TO authenticated
  USING (
    founder_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- ============================================
-- TEAM_MEMBERS TABLE POLICIES
-- ============================================

-- Drop existing policies first (if they exist)
DROP POLICY IF EXISTS "Anyone can view team members" ON team_members;
DROP POLICY IF EXISTS "Founders add team members" ON team_members;
DROP POLICY IF EXISTS "Manage team membership" ON team_members;

-- Anyone can view team members (public info)
CREATE POLICY "Anyone can view team members" ON team_members
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Only team founders can add members
CREATE POLICY "Founders add team members" ON team_members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    team_id IN (
      SELECT id FROM teams
      WHERE founder_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    )
  );

-- Founders can remove members, members can leave
CREATE POLICY "Manage team membership" ON team_members
  FOR DELETE
  TO authenticated
  USING (
    -- Founder can remove anyone
    team_id IN (
      SELECT id FROM teams
      WHERE founder_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    )
    OR
    -- Member can remove themselves
    player_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- ============================================
-- TEAM_JOIN_REQUESTS TABLE POLICIES
-- ============================================

-- Drop existing policies first (if they exist)
DROP POLICY IF EXISTS "View relevant join requests" ON team_join_requests;
DROP POLICY IF EXISTS "Players create join requests" ON team_join_requests;
DROP POLICY IF EXISTS "Founders respond to join requests" ON team_join_requests;
DROP POLICY IF EXISTS "Manage join requests" ON team_join_requests;

-- View relevant requests only
CREATE POLICY "View relevant join requests" ON team_join_requests
  FOR SELECT
  TO authenticated
  USING (
    -- Player sees their own requests
    player_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    OR
    -- Founder sees requests for their team
    team_id IN (
      SELECT id FROM teams
      WHERE founder_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    )
  );

-- Players create their own join requests
CREATE POLICY "Players create join requests" ON team_join_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (
    player_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- Founders respond to requests
CREATE POLICY "Founders respond to join requests" ON team_join_requests
  FOR UPDATE
  TO authenticated
  USING (
    team_id IN (
      SELECT id FROM teams
      WHERE founder_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    )
  )
  WITH CHECK (
    team_id IN (
      SELECT id FROM teams
      WHERE founder_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    )
  );

-- Players can cancel, founders can delete
CREATE POLICY "Manage join requests" ON team_join_requests
  FOR DELETE
  TO authenticated
  USING (
    -- Player can cancel their own request
    player_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    OR
    -- Founder can delete any request for their team
    team_id IN (
      SELECT id FROM teams
      WHERE founder_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    )
  );

-- ============================================
-- VERIFY RLS IS ENABLED
-- ============================================

-- Ensure RLS is enabled on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_join_requests ENABLE ROW LEVEL SECURITY;

-- ============================================
-- VERIFICATION QUERY
-- ============================================

-- Run this after applying policies to verify they exist:
/*
SELECT 
    tablename,
    policyname,
    cmd,
    roles
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, cmd;

-- Should show:
-- profiles: 4 policies (SELECT, INSERT, UPDATE, DELETE)
-- teams: 4 policies (SELECT, INSERT, UPDATE, DELETE)
-- team_members: 3 policies (SELECT, INSERT, DELETE)
-- team_join_requests: 4 policies (SELECT, INSERT, UPDATE, DELETE)
-- Total: 15 policies
*/