-- Session 00040: Essential emdash-auth Schema for EDL Platform
-- Extracted from emdash-auth TypeScript types
-- This provides the foundation for our auth system

-- ============================================
-- CLEAN SLATE (BE CAREFUL IN PRODUCTION!)
-- ============================================

-- Drop existing tables if needed (comment out if keeping existing data)
-- DROP TABLE IF EXISTS profiles CASCADE;
-- DROP TABLE IF EXISTS teams CASCADE;
-- DROP TABLE IF EXISTS team_members CASCADE;
-- DROP TABLE IF EXISTS team_join_requests CASCADE;

-- ============================================
-- CORE USER PROFILE TABLE
-- ============================================

-- This is the essential table for user profiles
-- Simplified from emdash-auth but with our requirements
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    call_sign VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255),
    role VARCHAR(20) CHECK (role IN ('player', 'supervisor', 'enabler')) DEFAULT 'player',
    grade_level INTEGER CHECK (grade_level >= 3 AND grade_level <= 12),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Additional fields from emdash-auth we might want
    display_name VARCHAR(100),
    avatar_url TEXT,
    bio TEXT,
    
    -- Metadata
    onboarding_completed BOOLEAN DEFAULT FALSE,
    email_verified BOOLEAN DEFAULT FALSE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_call_sign ON profiles(call_sign);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- ============================================
-- RLS POLICIES (FIXED VERSION)
-- ============================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to start clean
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON profiles;

-- Policy 1: Anyone can view profiles (public directory)
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
    FOR SELECT
    TO authenticated, anon
    USING (true);

-- Policy 2: Authenticated users can create their own profile
CREATE POLICY "Users can create their own profile" ON profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Policy 3: Users can update their own profile
CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy 4: Users can delete their own profile (GDPR compliance)
CREATE POLICY "Users can delete their own profile" ON profiles
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- ============================================
-- TEAMS TABLE (OPTIONAL - For Later)
-- ============================================

CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    founder_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Team metadata
    avatar_url TEXT,
    max_members INTEGER DEFAULT 10,
    is_active BOOLEAN DEFAULT TRUE
);

-- Enable RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Teams policies
CREATE POLICY "Teams are viewable by everyone" ON teams
    FOR SELECT TO authenticated, anon
    USING (true);

CREATE POLICY "Authenticated users can create teams" ON teams
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (SELECT 1 FROM profiles WHERE id = founder_id AND user_id = auth.uid())
    );

CREATE POLICY "Team founders can update their teams" ON teams
    FOR UPDATE TO authenticated
    USING (
        founder_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    );

-- ============================================
-- TEAM MEMBERS TABLE (OPTIONAL - For Later)
-- ============================================

CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
    player_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    role VARCHAR(20) DEFAULT 'member',
    
    UNIQUE(team_id, player_id)
);

-- Enable RLS
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Team members policies
CREATE POLICY "Team members are viewable by everyone" ON team_members
    FOR SELECT TO authenticated, anon
    USING (true);

CREATE POLICY "Team founders can add members" ON team_members
    FOR INSERT TO authenticated
    WITH CHECK (
        team_id IN (
            SELECT id FROM teams 
            WHERE founder_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
        )
    );

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to automatically create a profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email, call_sign)
    VALUES (
        new.id,
        new.email,
        -- Generate temporary call_sign, user will update it
        'USER_' || substring(new.id::text from 1 for 8)
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile (OPTIONAL - only if you want auto-creation)
-- CREATE TRIGGER on_auth_user_created
--     AFTER INSERT ON auth.users
--     FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Run these to verify the schema is working:

-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'teams', 'team_members');

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'teams', 'team_members');

-- Check policies exist
SELECT schemaname, tablename, policyname, cmd 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, cmd;

-- Test profile creation (replace with actual user_id)
-- INSERT INTO profiles (user_id, call_sign, role, grade_level)
-- VALUES ('YOUR_USER_ID', 'TEST_USER', 'player', 7);

-- ============================================
-- SUCCESS CRITERIA
-- ============================================

-- After running this migration, you should be able to:
-- 1. Sign up a new user
-- 2. Create their profile with call_sign
-- 3. View all profiles
-- 4. Update your own profile
-- 5. No RLS policy violations!

-- Next step: Deploy emdash-auth with this schema