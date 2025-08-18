-- Session 00030: Add grade_level to profiles table
-- Created: 2025-08-18
-- Purpose: Support player grade level selection (US-003: Player Profile Creation)
-- Attribution: Part of P0 Authentication completion

-- Add grade_level column for players
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS grade_level INTEGER CHECK (grade_level >= 4 AND grade_level <= 12);

-- Add comment for future reference
COMMENT ON COLUMN profiles.grade_level IS 'Grade level for players (4-12), null for supervisors/enablers';

-- No RLS changes needed - existing policies cover new column