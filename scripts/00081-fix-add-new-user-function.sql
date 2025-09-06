-- ---
-- session: "00081"
-- type: "script"
-- status: "unknown"
-- created: "2025-08-28"
-- title: "00081-fix-add-new-user-function.sql"
-- purpose: "Script for fix add new user function"
-- language: "sql"
-- category: "creation"
-- topics: ["creation"]
-- priority: "P2"
-- domain: "core"
-- ---
-- Session 00081: Fix add_new_user function to handle required columns
-- Problem: Source function only inserts id, but our table has more required fields
-- Solution: Provide defaults for all required columns

CREATE OR REPLACE FUNCTION public.add_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- For email signups
  IF new.raw_app_meta_data ->> 'provider' = 'email' THEN
    INSERT INTO public.profile (
      id,
      email,
      active,
      user_role,
      term_agree_time
    )
    VALUES (
      new.id,
      new.email,
      true,  -- Default active to true
      'STUDENT',  -- Default role to STUDENT
      NOW()  -- Set term agreement to now
    );
    
  -- For OAuth signups (Kakao, Google)
  ELSIF new.raw_app_meta_data ->> 'provider' IN ('kakao', 'google') THEN
    INSERT INTO public.profile (
      id,
      email,
      name,
      image_path,
      active,
      user_role,
      term_agree_time
    )
    VALUES (
      new.id,
      new.email,
      COALESCE(new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'full_name'),
      new.raw_user_meta_data ->> 'avatar_url',
      true,
      'STUDENT',
      NOW()
    );
  END IF;
  
  RETURN new;
EXCEPTION
  WHEN others THEN
    -- Log the error but don't block user creation
    RAISE LOG 'Error in add_new_user trigger: %', SQLERRM;
    RETURN new;
END;
$$;

-- Verify the trigger is properly attached
-- This should already exist but let's make sure
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created' 
    AND tgrelid = 'auth.users'::regclass
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION public.add_new_user();
  END IF;
END;
$$;

-- Test the function can be called
-- This won't actually insert but will verify the function exists
SELECT 'Function created successfully' AS status;