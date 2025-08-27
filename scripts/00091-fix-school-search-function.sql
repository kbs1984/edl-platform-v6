-- Session 00091: Fix school search function to work without pg_trgm extension
-- The original function uses similarity() which requires pg_trgm
-- This simplified version uses basic ILIKE pattern matching

-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS public.search_school(text);

-- Create a simpler version that doesn't require pg_trgm
CREATE OR REPLACE FUNCTION public.search_school(search_query text)
RETURNS TABLE(id uuid, name text)
LANGUAGE sql
STABLE
AS $$
  SELECT id, name
  FROM school
  WHERE 
    -- Case-insensitive partial match
    LOWER(name) ILIKE '%' || LOWER(search_query) || '%'
    -- Also match if query is at the start
    OR LOWER(name) ILIKE LOWER(search_query) || '%'
  ORDER BY 
    -- Prioritize exact matches first
    CASE 
      WHEN LOWER(name) = LOWER(search_query) THEN 0
      WHEN LOWER(name) ILIKE LOWER(search_query) || '%' THEN 1
      ELSE 2
    END,
    name ASC
  LIMIT 20;  -- Limit results for performance
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.search_school(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_school(text) TO anon;

-- Test the function (you can run this to verify it works)
-- SELECT * FROM search_school('test');