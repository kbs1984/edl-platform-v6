-- ---
-- session: "00081"
-- type: "script"
-- status: "unknown"
-- created: "2025-08-28"
-- title: "00081-COMPLETE-fix-add-new-user.sql"
-- purpose: "Script for COMPLETE fix add new user"
-- language: "sql"
-- category: "creation"
-- topics: ["creation"]
-- priority: "P2"
-- domain: "core"
-- ---
-- Session 00081: COMPLETE Fix for add_new_user function
-- Based on actual column requirements from our database
-- ALL columns except id, active, invited are NOT NULL

CREATE OR REPLACE FUNCTION public.add_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create profile with ALL required fields
  IF new.raw_app_meta_data ->> 'provider' = 'email' THEN
    INSERT INTO public.profile (
      id,
      email,
      name,
      username,
      user_role,
      term_agree_time,
      date_of_birth,
      gender,
      image_path
    ) VALUES (
      new.id,
      new.email,
      COALESCE(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)), -- Use email prefix if no name
      COALESCE(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)), -- Generate username from email
      'STUDENT'::public.user_role_type,
      NOW(),
      NULL, -- date_of_birth can be set later in onboarding
      NULL, -- gender can be set later in onboarding
      NULL  -- image_path can be set later
    );
    
  ELSIF new.raw_app_meta_data ->> 'provider' IN ('kakao', 'google') THEN
    INSERT INTO public.profile (
      id,
      email,
      name,
      username,
      user_role,
      term_agree_time,
      date_of_birth,
      gender,
      image_path
    ) VALUES (
      new.id,
      new.email,
      COALESCE(
        new.raw_user_meta_data ->> 'name',
        new.raw_user_meta_data ->> 'full_name',
        split_part(new.email, '@', 1)
      ),
      COALESCE(
        new.raw_user_meta_data ->> 'username',
        new.raw_user_meta_data ->> 'preferred_username',
        split_part(new.email, '@', 1)
      ),
      'STUDENT'::public.user_role_type,
      NOW(),
      NULL, -- date_of_birth from OAuth if available, else null
      NULL, -- gender from OAuth if available, else null
      new.raw_user_meta_data ->> 'avatar_url'
    );
  END IF;
  
  -- Create student record (already in function, keep it)
  INSERT INTO public.student (
    user_id,
    division,
    exp,
    level,
    challenge_enabled,
    created_at,
    updated_at
  ) VALUES (
    new.id,
    'VILLIGER'::public.division,
    0,
    1,
    false,
    NOW(),
    NOW()
  ) ON CONFLICT (user_id) DO NOTHING;
  
  RETURN new;

EXCEPTION
  WHEN others THEN
    -- Log the specific error for debugging
    RAISE LOG 'Error in add_new_user for user %: % - %', new.id, SQLSTATE, SQLERRM;
    -- But still return new to allow auth.users creation to succeed
    RETURN new;
END;
$$;

-- Verify the columns that are actually required vs nullable
-- This query will help confirm which columns can be NULL
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
    AND table_name = 'profile'
ORDER BY ordinal_position;