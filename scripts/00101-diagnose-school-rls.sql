-- Session 101: Diagnostic queries for school search permission issue
-- Run these in Supabase Dashboard SQL Editor

-- 1. CHECK IF RLS IS ACTUALLY ENABLED (Most likely issue!)
SELECT 
    schemaname,
    tablename,
    rowsecurity 
FROM pg_tables 
WHERE tablename = 'school';

-- If rowsecurity is FALSE, that's the problem! Fix with:
-- ALTER TABLE school ENABLE ROW LEVEL SECURITY;

-- 2. CHECK EXISTING POLICIES
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'school'
ORDER BY policyname;

-- 3. CHECK TABLE OWNER AND PERMISSIONS
SELECT 
    n.nspname as schema,
    c.relname as table,
    pg_get_userbyid(c.relowner) as owner,
    c.relrowsecurity as rls_enabled,
    c.relforcerowsecurity as rls_forced
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE c.relname = 'school';

-- 4. TEST AS ANON ROLE (simulates app access)
SET ROLE anon;
SELECT * FROM school LIMIT 1;
RESET ROLE;

-- 5. CHECK IF FUNCTION BYPASS WORKS
-- The search_school function might bypass RLS
SELECT * FROM search_school('Seoul');

-- 6. THE FIX (if RLS is disabled):
ALTER TABLE school ENABLE ROW LEVEL SECURITY;

-- Then ensure this policy exists:
DROP POLICY IF EXISTS "Enable read access for all users" ON school;
CREATE POLICY "Enable read access for all users" 
ON school FOR SELECT 
USING (true);

-- 7. ALTERNATIVE FIX - Create a SECURITY DEFINER function
-- This bypasses RLS completely for school search
CREATE OR REPLACE FUNCTION public.search_schools_bypass(search_query text)
RETURNS TABLE(
    id uuid,
    name text,
    country text,
    division text
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.name,
        s.country,
        s.division::text
    FROM school s
    WHERE s.name ILIKE '%' || search_query || '%'
    LIMIT 20;
END;
$$;

-- Grant execute to anon and authenticated
GRANT EXECUTE ON FUNCTION public.search_schools_bypass TO anon, authenticated;