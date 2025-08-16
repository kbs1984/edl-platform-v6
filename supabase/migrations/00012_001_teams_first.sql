-- Session 00012: Teams-First EDL MVP Database Schema
-- Created: 2025-08-16
-- Purpose: Minimal viable schema for team formation (the 4% core)
-- Attribution: Following Stack Truth SC #001 - Teams mentioned 423 times in Canvas

-- Users and profiles (minimal viable structure)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users UNIQUE NOT NULL,
  call_sign VARCHAR(50) UNIQUE NOT NULL,
  role VARCHAR(20) CHECK (role IN ('player', 'supervisor', 'enabler')),
  created_at TIMESTAMP DEFAULT NOW(),
  _why_exists TEXT DEFAULT 'Core user identity from Canvas 001-1 onboarding flow',
  _canvas_source TEXT DEFAULT '001-1.seed.Authentication.canvas'
);

-- Teams (the CORE feature - mentioned 423 times!)
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  founder_id UUID REFERENCES profiles(id),
  max_members INTEGER DEFAULT 4,
  status VARCHAR(20) DEFAULT 'recruiting' CHECK (status IN ('recruiting', 'full', 'active', 'archived')),
  created_at TIMESTAMP DEFAULT NOW(),
  _why_exists TEXT DEFAULT 'Primary social unit - Cyworld minihompy equivalent',
  _canvas_source TEXT DEFAULT '002-2.seed.Associated Teams Box.canvas'
);

-- Team members with unique roles
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  player_id UUID REFERENCES profiles(id),
  role VARCHAR(20) CHECK (role IN ('founder', 'member')),
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(team_id, player_id),
  _why_exists TEXT DEFAULT 'Team composition tracking from Canvas team formation flows',
  _canvas_source TEXT DEFAULT '002-2 Scenario I: Player requests to join Team'
);

-- Join requests (for async team joining)
CREATE TABLE team_join_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  player_id UUID REFERENCES profiles(id),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  requested_at TIMESTAMP DEFAULT NOW(),
  responded_at TIMESTAMP,
  UNIQUE(team_id, player_id),
  _why_exists TEXT DEFAULT 'Async join flow from Canvas Scenario I',
  _canvas_source TEXT DEFAULT '002-2 Scenario I: Player requests to join Team'
);

-- Enable RLS for child safety from Day 1
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_join_requests ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (child-safe by default)
CREATE POLICY "Public profiles are viewable" ON profiles 
  FOR SELECT USING (true);

CREATE POLICY "Users update own profile" ON profiles 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Teams are publicly viewable" ON teams 
  FOR SELECT USING (true);

CREATE POLICY "Founders can update their teams" ON teams 
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE id = teams.founder_id
    )
  );

CREATE POLICY "Members can view their team members" ON team_members 
  FOR SELECT USING (true);

CREATE POLICY "Founders can manage team members" ON team_members 
  FOR ALL USING (
    auth.uid() IN (
      SELECT p.user_id 
      FROM teams t 
      JOIN profiles p ON t.founder_id = p.id 
      WHERE t.id = team_members.team_id
    )
  );

CREATE POLICY "Players can view join requests" ON team_join_requests 
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE id = team_join_requests.player_id
    ) OR
    auth.uid() IN (
      SELECT p.user_id 
      FROM teams t 
      JOIN profiles p ON t.founder_id = p.id 
      WHERE t.id = team_join_requests.team_id
    )
  );

CREATE POLICY "Players can create join requests" ON team_join_requests 
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE id = team_join_requests.player_id
    )
  );

CREATE POLICY "Founders can respond to join requests" ON team_join_requests 
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT p.user_id 
      FROM teams t 
      JOIN profiles p ON t.founder_id = p.id 
      WHERE t.id = team_join_requests.team_id
    )
  );

-- Indexes for performance
CREATE INDEX idx_team_members_team ON team_members(team_id);
CREATE INDEX idx_team_members_player ON team_members(player_id);
CREATE INDEX idx_join_requests_team ON team_join_requests(team_id);
CREATE INDEX idx_join_requests_player ON team_join_requests(player_id);
CREATE INDEX idx_teams_founder ON teams(founder_id);

-- Initial seed data for testing
INSERT INTO auth.users (id, email) VALUES 
  ('11111111-1111-1111-1111-111111111111', 'founder@test.com'),
  ('22222222-2222-2222-2222-222222222222', 'player1@test.com'),
  ('33333333-3333-3333-3333-333333333333', 'player2@test.com')
ON CONFLICT DO NOTHING;

INSERT INTO profiles (user_id, call_sign, role) VALUES
  ('11111111-1111-1111-1111-111111111111', 'TeamBuilder', 'player'),
  ('22222222-2222-2222-2222-222222222222', 'Joiner1', 'player'),
  ('33333333-3333-3333-3333-333333333333', 'Joiner2', 'player')
ON CONFLICT DO NOTHING;