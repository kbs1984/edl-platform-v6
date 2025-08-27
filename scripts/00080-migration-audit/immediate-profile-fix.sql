-- IMMEDIATE FIX FOR AUTH SIGNUP
-- Run this NOW to unblock user registration

-- Remove the policy that's not in backup
DROP POLICY IF EXISTS "profile_insert_authenticated" ON public.profile;

-- Ensure RLS is still enabled
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;

-- The profile table should only have SELECT and UPDATE policies
-- Profile creation is handled by trigger after auth.users insert