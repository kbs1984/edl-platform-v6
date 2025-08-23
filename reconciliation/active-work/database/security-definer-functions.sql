-- Security Definer Functions for Schema Introspection
-- Session 00053 - Based on community best practices
-- These functions run with elevated privileges without exposing service keys

-- Function to check if a table exists (bypasses RLS)
CREATE OR REPLACE FUNCTION check_table_exists(table_name_param text, schema_name_param text DEFAULT 'public')
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = schema_name_param 
    AND table_name = table_name_param
  );
END;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION check_table_exists TO authenticated;
GRANT EXECUTE ON FUNCTION check_table_exists TO anon;

-- Function to list all tables in a schema
CREATE OR REPLACE FUNCTION list_schema_tables(schema_name_param text DEFAULT 'public')
RETURNS TABLE(table_name text, table_type text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.table_name::text,
    t.table_type::text
  FROM information_schema.tables t
  WHERE t.table_schema = schema_name_param
  ORDER BY t.table_name;
END;
$$;

GRANT EXECUTE ON FUNCTION list_schema_tables TO authenticated;

-- Function to check if RLS is enabled on a table
CREATE OR REPLACE FUNCTION check_rls_enabled(table_name_param text, schema_name_param text DEFAULT 'public')
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rls_enabled boolean;
BEGIN
  SELECT relrowsecurity INTO rls_enabled
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = schema_name_param
  AND c.relname = table_name_param;
  
  RETURN COALESCE(rls_enabled, false);
END;
$$;

GRANT EXECUTE ON FUNCTION check_rls_enabled TO authenticated;

-- Function to diagnose access issues
CREATE OR REPLACE FUNCTION diagnose_table_access(
  table_name_param text, 
  schema_name_param text DEFAULT 'public'
)
RETURNS TABLE(
  table_exists boolean,
  rls_enabled boolean,
  policy_count integer,
  diagnosis text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_table_exists boolean;
  v_rls_enabled boolean;
  v_policy_count integer;
  v_diagnosis text;
BEGIN
  -- Check if table exists
  v_table_exists := check_table_exists(table_name_param, schema_name_param);
  
  IF NOT v_table_exists THEN
    RETURN QUERY SELECT 
      false,
      false,
      0,
      'Table does not exist - check migration'::text;
    RETURN;
  END IF;
  
  -- Check RLS status
  v_rls_enabled := check_rls_enabled(table_name_param, schema_name_param);
  
  -- Count policies
  SELECT COUNT(*)::integer INTO v_policy_count
  FROM pg_policies
  WHERE schemaname = schema_name_param
  AND tablename = table_name_param;
  
  -- Generate diagnosis
  IF NOT v_rls_enabled THEN
    v_diagnosis := 'RLS is disabled - table is accessible';
  ELSIF v_policy_count = 0 THEN
    v_diagnosis := 'RLS enabled but no policies - table is locked';
  ELSE
    v_diagnosis := format('RLS enabled with %s policies - check user permissions', v_policy_count);
  END IF;
  
  RETURN QUERY SELECT 
    v_table_exists,
    v_rls_enabled,
    v_policy_count,
    v_diagnosis;
END;
$$;

GRANT EXECUTE ON FUNCTION diagnose_table_access TO authenticated;

-- Function to get table column information
CREATE OR REPLACE FUNCTION get_table_columns(
  table_name_param text,
  schema_name_param text DEFAULT 'public'
)
RETURNS TABLE(
  column_name text,
  data_type text,
  is_nullable boolean,
  column_default text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.column_name::text,
    c.data_type::text,
    (c.is_nullable = 'YES')::boolean,
    c.column_default::text
  FROM information_schema.columns c
  WHERE c.table_schema = schema_name_param
  AND c.table_name = table_name_param
  ORDER BY c.ordinal_position;
END;
$$;

GRANT EXECUTE ON FUNCTION get_table_columns TO authenticated;

-- Usage examples:
-- SELECT check_table_exists('student');
-- SELECT * FROM list_schema_tables('public');
-- SELECT check_rls_enabled('student');
-- SELECT * FROM diagnose_table_access('student');
-- SELECT * FROM get_table_columns('student');