-- Session 00015: Fix Schema Discrepancy
-- Created: 2025-08-16
-- Purpose: Align database with SESSION-00011-UNIFIED-DATABASE-DESIGN.md
-- Problem: Session 00012 created incomplete schema without users table

-- ============================================================
-- PART 1: Create Missing Users Table
-- ============================================================
-- This should have been created first per unified design
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    
    -- Attribution
    _canvas_evidence TEXT DEFAULT 'All 12 Canvas files show user authentication',
    _frequency INTEGER DEFAULT 5805, -- Every task needs a user
    _session VARCHAR(10) DEFAULT '00015',
    _fixed_from VARCHAR(10) DEFAULT '00012' -- Which session's mistake we're fixing
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON users(auth_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================================
-- PART 2: Migrate Existing Auth Users to Users Table
-- ============================================================
-- For any existing auth.users, create corresponding users records
INSERT INTO users (email, auth_id, created_at)
SELECT 
    au.email,
    au.id,
    au.created_at
FROM auth.users au
LEFT JOIN public.users u ON u.auth_id = au.id
WHERE u.id IS NULL;

-- ============================================================
-- PART 3: Fix Profiles Table Structure
-- ============================================================
-- Add missing columns to match unified design
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS personality_type VARCHAR(20),
ADD COLUMN IF NOT EXISTS ocean_scores JSONB,
ADD COLUMN IF NOT EXISTS school_id UUID,
ADD COLUMN IF NOT EXISTS grade INTEGER CHECK (grade BETWEEN 4 AND 12),
ADD COLUMN IF NOT EXISTS division VARCHAR(20),
ADD COLUMN IF NOT EXISTS _canvas_evidence TEXT DEFAULT '230 player + 49 supervisor + 105 enabler mentions',
ADD COLUMN IF NOT EXISTS _frequency INTEGER DEFAULT 384;

-- Add proper user reference (keep user_id for backward compatibility temporarily)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS proper_user_id UUID REFERENCES users(id);

-- Migrate existing profiles to reference the new users table
UPDATE profiles 
SET proper_user_id = u.id
FROM public.users u
WHERE profiles.user_id = u.auth_id;

-- ============================================================
-- PART 4: Create Trigger for Auto User Creation
-- ============================================================
-- Automatically create users record when auth.users is created
CREATE OR REPLACE FUNCTION create_user_on_signup()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO users (email, auth_id, created_at)
    VALUES (NEW.email, NEW.id, NOW())
    ON CONFLICT (auth_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_user_on_signup();

-- ============================================================
-- PART 5: Fix RLS Policies (Following SUPABASE-SQL-PROTOCOL.md)
-- ============================================================
-- Users table policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own record" ON users
    FOR SELECT
    TO authenticated
    USING (auth_id = auth.uid());

CREATE POLICY "Users can update own record" ON users
    FOR UPDATE
    TO authenticated
    USING (auth_id = auth.uid())
    WITH CHECK (auth_id = auth.uid());

-- Update profiles policies to work with proper structure
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

CREATE POLICY "Profiles viewable by authenticated users" ON profiles
    FOR SELECT
    TO authenticated, anon
    USING (true);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE
    TO authenticated
    USING (
        user_id = auth.uid() OR 
        proper_user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid())
    )
    WITH CHECK (
        user_id = auth.uid() OR
        proper_user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid())
    );

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (
        user_id = auth.uid() OR
        proper_user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid())
    );

-- ============================================================
-- PART 6: Documentation Comments
-- ============================================================
COMMENT ON TABLE users IS 'Central user authentication record - separates auth from identity';
COMMENT ON COLUMN users.auth_id IS 'References Supabase auth.users for authentication';
COMMENT ON COLUMN users.email IS 'User email for display and communication';

COMMENT ON TABLE profiles IS 'User display identity - gamertag, avatar, personality';
COMMENT ON COLUMN profiles.call_sign IS 'Display name/gamertag from Canvas wireframes - NOT a mistake';
COMMENT ON COLUMN profiles.proper_user_id IS 'Correct reference to users table (fixing Session 00012 error)';
COMMENT ON COLUMN profiles.user_id IS 'DEPRECATED - references auth.users directly (Session 00012 mistake)';

-- ============================================================
-- VERIFICATION QUERIES (Run these to confirm migration worked)
-- ============================================================
-- Check users were created:
-- SELECT COUNT(*) as user_count FROM users;

-- Check profiles have proper references:
-- SELECT COUNT(*) as profiles_with_proper_ref FROM profiles WHERE proper_user_id IS NOT NULL;

-- Check trigger works (create a test auth user):
-- This will be tested when new users sign up