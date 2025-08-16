-- Session 00012: Teams-First EDL MVP Database Schema (v2 - Supabase Best Practices)
-- Created: 2025-08-16
-- Purpose: Minimal viable schema for team formation (the 4% core)
-- Attribution: Following Stack Truth SC #001 - Teams mentioned 423 times in Canvas
-- v2: Fixed RLS policies per Supabase-specific patterns (TO clause, USING/WITH CHECK)

-- Users and profiles (minimal viable structure)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users UNIQUE NOT NULL,
  call_sign VARCHAR(50) UNIQUE NOT NULL,
  role VARCHAR(20) CHECK (role IN ('player', 'supervisor', 'enabler')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  _why_exists TEXT DEFAULT 'Core user identity from Canvas 001-1 onboarding flow',
  _canvas_source TEXT DEFAULT '001-1.seed.Authentication.canvas'
);

-- Teams (the CORE feature - mentioned 423 times!)
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  founder_id UUID REFERENCES profiles(id),
  max_members INTEGER DEFAULT 4,
  status VARCHAR(20) DEFAULT 'recruiting' CHECK (status IN ('recruiting', 'full', 'active', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  _why_exists TEXT DEFAULT 'Primary social unit - Cyworld minihompy equivalent',
  _canvas_source TEXT DEFAULT '002-2.seed.Associated Teams Box.canvas'
);

-- Team members with unique roles
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  player_id UUID REFERENCES profiles(id),
  role VARCHAR(20) CHECK (role IN ('founder', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, player_id),
  _why_exists TEXT DEFAULT 'Team composition tracking from Canvas team formation flows',
  _canvas_source TEXT DEFAULT '002-2 Scenario I: Player requests to join Team'
);

-- Join requests (for async team joining)
CREATE TABLE IF NOT EXISTS team_join_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  player_id UUID REFERENCES profiles(id),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ,
  UNIQUE(team_id, player_id),
  _why_exists TEXT DEFAULT 'Async join flow from Canvas Scenario I',
  _canvas_source TEXT DEFAULT '002-2 Scenario I: Player requests to join Team'
);

-- Enable RLS for child safety from Day 1
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_join_requests ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- RLS POLICIES (Following Supabase Best Practices)
-- ==============================================

-- PROFILES POLICIES
-- SELECT: Anyone can view profiles (public)
CREATE POLICY "Anyone can view profiles" ON profiles 
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- INSERT: Users can only create their own profile
CREATE POLICY "Users create own profile" ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can only update their own profile
CREATE POLICY "Users update own profile" ON profiles 
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- TEAMS POLICIES
-- SELECT: Anyone can view teams (public discovery)
CREATE POLICY "Anyone can view teams" ON teams 
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- INSERT: Only authenticated users can create teams
CREATE POLICY "Authenticated users create teams" ON teams
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Ensure creator has a profile
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid())
  );

-- UPDATE: Only founders can update their teams
CREATE POLICY "Founders update their teams" ON teams 
  FOR UPDATE
  TO authenticated
  USING (
    founder_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  )
  WITH CHECK (
    founder_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- DELETE: Only founders can delete their teams
CREATE POLICY "Founders delete their teams" ON teams
  FOR DELETE
  TO authenticated
  USING (
    founder_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- TEAM MEMBERS POLICIES  
-- SELECT: Anyone can see team members (public)
CREATE POLICY "Anyone can view team members" ON team_members 
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- INSERT: Only team founders can add members
CREATE POLICY "Founders add team members" ON team_members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    team_id IN (
      SELECT id FROM teams 
      WHERE founder_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    )
  );

-- DELETE: Founders can remove members, members can leave
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
    -- Members can remove themselves
    player_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- JOIN REQUESTS POLICIES
-- SELECT: Players see their requests, founders see requests to their teams
CREATE POLICY "View relevant join requests" ON team_join_requests 
  FOR SELECT
  TO authenticated
  USING (
    -- Player sees their own requests
    player_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    OR
    -- Founder sees requests to their teams
    team_id IN (
      SELECT id FROM teams 
      WHERE founder_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    )
  );

-- INSERT: Players can create join requests
CREATE POLICY "Players create join requests" ON team_join_requests 
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Must be the player making the request
    player_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    AND
    -- Can't request to join if already a member
    NOT EXISTS (
      SELECT 1 FROM team_members 
      WHERE team_id = team_join_requests.team_id 
      AND player_id = team_join_requests.player_id
    )
  );

-- UPDATE: Only founders can approve/reject requests
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

-- DELETE: Players can cancel their requests, founders can remove them
CREATE POLICY "Manage join requests" ON team_join_requests
  FOR DELETE
  TO authenticated
  USING (
    -- Player can cancel their own request
    player_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    OR
    -- Founder can remove any request to their team
    team_id IN (
      SELECT id FROM teams 
      WHERE founder_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    )
  );

-- ==============================================
-- PERFORMANCE INDEXES
-- ==============================================
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_teams_founder ON teams(founder_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_player ON team_members(player_id);
CREATE INDEX IF NOT EXISTS idx_join_requests_team ON team_join_requests(team_id);
CREATE INDEX IF NOT EXISTS idx_join_requests_player ON team_join_requests(player_id);
CREATE INDEX IF NOT EXISTS idx_join_requests_status ON team_join_requests(status);

-- ==============================================
-- HELPER FUNCTION FOR TEAM MEMBER COUNT
-- ==============================================
CREATE OR REPLACE FUNCTION get_team_member_count(team_uuid UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER 
  FROM team_members 
  WHERE team_id = team_uuid;
$$ LANGUAGE SQL STABLE;

-- Success message
SELECT 
  '✅ Teams-first schema created with Supabase best practices!' as status,
  'RLS policies use proper TO clause and USING/WITH CHECK patterns' as improvement,
  'Next: Create users through Supabase Auth UI or API' as next_step;