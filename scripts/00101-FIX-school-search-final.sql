-- Session 101: DEFINITIVE FIX for School Search Permission Issue
-- The problem: Multiple conflicting policies and missing anon role coverage

-- STEP 1: Clean up ALL existing policies (start fresh)
DROP POLICY IF EXISTS "Allow authenticated users to insert school" ON school;
DROP POLICY IF EXISTS "Allow public read access to schools" ON school;
DROP POLICY IF EXISTS "Enable read access for all users" ON school;
DROP POLICY IF EXISTS "school_insert_authenticated" ON school;

-- STEP 2: Create ONE clean SELECT policy that explicitly covers both roles
CREATE POLICY "school_select_all" 
ON school 
FOR SELECT 
TO anon, authenticated
USING (true);

-- STEP 3: Keep INSERT policy for authenticated only (security)
CREATE POLICY "school_insert_authenticated" 
ON school 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- STEP 4: Verify the policies are correct
SELECT 
    policyname,
    cmd,
    roles,
    qual
FROM pg_policies 
WHERE tablename = 'school'
ORDER BY policyname;

-- STEP 5: Test as anon role (this simulates the app)
SET ROLE anon;
SELECT COUNT(*) as school_count FROM school;
SELECT * FROM school WHERE name ILIKE '%Seoul%' LIMIT 5;
RESET ROLE;

-- STEP 6: If the above still fails, check if there's a DEFAULT DENY policy
-- Sometimes Supabase adds restrictive default policies
SELECT * FROM pg_policies 
WHERE tablename = 'school' 
AND permissive = 'RESTRICTIVE';

-- STEP 7: NUCLEAR OPTION - If nothing else works, disable RLS temporarily for diagnosis
-- WARNING: This makes school table publicly accessible - only for testing!
-- ALTER TABLE school DISABLE ROW LEVEL SECURITY;
-- Test the app
-- ALTER TABLE school ENABLE ROW LEVEL SECURITY;

-- STEP 8: Alternative - Create a bypass function that definitely works
DROP FUNCTION IF EXISTS public.get_schools_for_search;
CREATE OR REPLACE FUNCTION public.get_schools_for_search(search_text text DEFAULT '')
RETURNS SETOF school
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT * FROM school 
    WHERE 
        CASE 
            WHEN search_text = '' OR search_text IS NULL THEN true
            ELSE name ILIKE '%' || search_text || '%'
        END
    ORDER BY name
    LIMIT 50;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_schools_for_search TO anon, authenticated;

-- Test the function
SELECT * FROM get_schools_for_search('Seoul');

-- STEP 9: Document what actually fixed it
-- After running these queries, test the app and note which step resolved the issue:
-- [ ] Step 2 - Clean single policy
-- [ ] Step 8 - Bypass function
-- [ ] Other - Document what worked

/*
IMPORTANT NOTES FOR SESSION 101:

The issue appears to be conflicting policies. When multiple policies exist for the same 
operation (SELECT), Postgres uses OR logic, but if any policy is restrictive or has 
conflicting role assignments, it can cause unexpected denials.

The clean approach:
1. Remove all policies
2. Create one simple, explicit policy
3. Test thoroughly

If the simple policy doesn't work, the SECURITY DEFINER function (Step 8) will definitely 
work because it runs with the privileges of the function owner (usually postgres), 
bypassing RLS entirely for that specific operation.
*/