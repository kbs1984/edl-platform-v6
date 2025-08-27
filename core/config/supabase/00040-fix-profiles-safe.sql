-- Session 00040: Safe Profile Table Fix
-- This migration safely updates the existing profiles table

-- ============================================
-- STEP 1: Add missing columns if they don't exist
-- ============================================

-- Add display_name column if missing
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS display_name VARCHAR(100);

-- Add avatar_url column if missing
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Add bio column if missing
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Add email column if missing (for quick access)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS email VARCHAR(255);

-- Add onboarding_completed flag
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Add updated_at timestamp
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ============================================
-- STEP 2: Update grade_level constraint to allow grade 3
-- ============================================

-- Drop old constraint if exists
ALTER TABLE profiles 
DROP CONSTRAINT IF EXISTS profiles_grade_level_check;

-- Add new constraint allowing grades 3-12
ALTER TABLE profiles 
ADD CONSTRAINT profiles_grade_level_check 
CHECK (grade_level >= 3 AND grade_level <= 12);

-- ============================================
-- STEP 3: Fix RLS Policies (CRITICAL!)
-- ============================================

-- Enable RLS (safe to run multiple times)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles;
DROP POLICY IF EXISTS "Profiles viewable by authenticated users" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users create own profile" ON profiles;
DROP POLICY IF EXISTS "Users delete own profile" ON profiles;
DROP POLICY IF EXISTS "Users update own profile" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON profiles;

-- Create SINGLE, CLEAN policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
    FOR SELECT
    TO authenticated, anon
    USING (true);

CREATE POLICY "Users can create their own profile" ON profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile" ON profiles
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- ============================================
-- STEP 4: Create helper function for profile creation
-- ============================================

-- Function to check if user has a profile
CREATE OR REPLACE FUNCTION public.user_has_profile(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (SELECT 1 FROM profiles WHERE user_id = user_uuid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to safely create profile
CREATE OR REPLACE FUNCTION public.create_profile_for_user(
    user_uuid UUID,
    user_email TEXT,
    user_call_sign TEXT,
    user_role TEXT DEFAULT 'player',
    user_grade INTEGER DEFAULT NULL
)
RETURNS profiles AS $$
DECLARE
    new_profile profiles;
BEGIN
    -- Check if profile already exists
    IF EXISTS (SELECT 1 FROM profiles WHERE user_id = user_uuid) THEN
        SELECT * INTO new_profile FROM profiles WHERE user_id = user_uuid;
        RETURN new_profile;
    END IF;
    
    -- Create new profile
    INSERT INTO profiles (
        user_id,
        email,
        call_sign,
        role,
        grade_level
    ) VALUES (
        user_uuid,
        user_email,
        user_call_sign,
        user_role,
        user_grade
    )
    RETURNING * INTO new_profile;
    
    RETURN new_profile;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- STEP 5: Verification Queries
-- ============================================

-- Check the table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- Check RLS policies
SELECT 
    policyname,
    cmd,
    roles,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public' 
AND tablename = 'profiles'
ORDER BY cmd, policyname;

-- Count existing profiles
SELECT COUNT(*) as profile_count FROM profiles;

-- ============================================
-- MANUAL TEST
-- ============================================

-- After running this migration, test with:
-- 1. Sign up a new user at https://edl-platform-v6.vercel.app/auth.html
-- 2. Check if profile was created:
--    SELECT * FROM profiles ORDER BY created_at DESC LIMIT 1;

-- If signup still fails, we need to deploy emdash-auth instead