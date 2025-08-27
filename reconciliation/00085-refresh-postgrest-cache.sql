---
session: "00085"
type: "fix"
status: "current"
created: "2025-08-27"
title: "Force PostgREST Schema Cache Reload"
purpose: "Fix API schema cache stuck on old 4-table system"
topics: ["postgrest", "schema-cache", "api", "profile-table"]
priority: "P0"
domain: "reconciliation"
fixes: ["profile-table-not-found", "PGRST205-error"]
implements: ["AUTH-MASTERPLAN.md", "DASHBOARD-MASTERPLAN.md"]
---

-- Session 00085: Force PostgREST to Reload Schema Cache
-- Problem: API cache is stuck on old schema (4-table system) and can't see current tables
-- Solution: Force PostgREST to reload its schema cache

-- Method 1: Send reload notification to PostgREST
NOTIFY pgrst, 'reload schema';

-- Method 2: Touch the schema to force cache invalidation
-- This creates a harmless comment change that triggers reload
COMMENT ON TABLE public.profile IS 'User profile information - cache reload triggered Session 85';

-- Method 3: Ensure profile table is in the exposed schema
-- PostgREST only exposes tables/views that are in the exposed schemas
-- Check current exposed schemas
DO $$
BEGIN
  RAISE NOTICE 'Forcing PostgREST schema cache reload for Session 85';
  RAISE NOTICE 'Profile table should now be visible to the API';
END $$;

-- Verify the profile table exists and has proper structure
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'profile'
ORDER BY ordinal_position;

-- Check if RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public' 
  AND tablename = 'profile';

-- List all policies on profile table
SELECT 
  pol.polname as policy_name,
  pol.polcmd as command,
  rol.rolname as role,
  pol.polqual::text as using_expression,
  pol.polwithcheck::text as with_check_expression
FROM pg_policy pol
JOIN pg_class cls ON pol.polrelid = cls.oid
JOIN pg_namespace nsp ON cls.relnamespace = nsp.oid
LEFT JOIN pg_roles rol ON pol.polroles = ARRAY[rol.oid]
WHERE nsp.nspname = 'public' 
  AND cls.relname = 'profile'
ORDER BY pol.polname;

-- Test query to verify profile table is accessible
-- This should work after cache reload
SELECT COUNT(*) as profile_count FROM public.profile;