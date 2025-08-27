-- Session 00081: MINIMAL Fix - Focus on what's actually broken
-- Since most columns are nullable, the issue might be simpler

CREATE OR REPLACE FUNCTION public.add_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Debug logging to see what's happening
  RAISE LOG 'add_new_user triggered for user % with provider %', 
    new.id, 
    new.raw_app_meta_data ->> 'provider';

  -- Handle different auth providers
  IF new.raw_app_meta_data ->> 'provider' = 'email' THEN
    -- Email signups - minimal insert (rely on defaults)
    INSERT INTO public.profile (id)
    VALUES (new.id);
    
    RAISE LOG 'Profile created for email user %', new.id;
    
  ELSIF new.raw_app_meta_data ->> 'provider' IN ('kakao', 'google') THEN
    -- OAuth signups - include OAuth data
    INSERT INTO public.profile (id, email, name, image_path)
    VALUES (
      new.id,
      new.email,
      new.raw_user_meta_data ->> 'name',
      new.raw_user_meta_data ->> 'avatar_url'
    );
    
    RAISE LOG 'Profile created for OAuth user %', new.id;
  END IF;
  
  -- Create student record
  -- Use explicit schema qualification to avoid issues
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
  
  RAISE LOG 'Student record created for user %', new.id;
  
  RETURN new;
  
EXCEPTION
  WHEN unique_violation THEN
    -- Profile might already exist, log and continue
    RAISE LOG 'Unique violation for user %: %', new.id, SQLERRM;
    RETURN new;
  WHEN foreign_key_violation THEN
    -- Foreign key issue
    RAISE LOG 'Foreign key violation for user %: %', new.id, SQLERRM;
    RETURN new;
  WHEN OTHERS THEN
    -- Log detailed error information
    RAISE LOG 'Error in add_new_user for user %: SQLSTATE=% SQLERRM=%', 
      new.id, SQLSTATE, SQLERRM;
    -- Important: Still return new to not block auth.users creation
    RETURN new;
END;
$$;

-- Check if there are any check constraints that might be failing
SELECT 
    con.conname AS constraint_name,
    con.contype AS constraint_type,
    pg_get_constraintdef(con.oid) AS definition
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
WHERE rel.relname = 'profile' 
    AND nsp.nspname = 'public'
    AND con.contype = 'c';  -- Check constraints

-- Also verify the student table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
    AND table_name = 'student'
ORDER BY ordinal_position;