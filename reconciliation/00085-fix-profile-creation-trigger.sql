---
session: "00085"
type: "fix"
status: "completed"
created: "2025-08-27"
title: "Fix Profile Creation Trigger Attachment"
purpose: "Attach missing trigger to create profile stubs on user signup"
topics: ["auth", "profile", "trigger", "database"]
priority: "P0"
domain: "reconciliation"
implements: ["AUTH-MASTERPLAN.md"]
fixes: ["profile-creation-not-triggered"]
validated: true
deployment_status: "applied"
---

-- Session 00085: Fix Profile Creation Based on Reality Files
-- The source project DOES have add_new_user but NOT attached to a trigger!
-- This is the missing piece - we need to attach the trigger

-- Step 1: Update the function to match source project's minimal approach
-- The source only creates a stub profile with id, letting onboarding fill details
CREATE OR REPLACE FUNCTION public.add_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
begin
  -- For email signups, create minimal profile stub
  if new.raw_app_meta_data ->> 'provider' = 'email' then
    insert into public.profile (id, email)
    values (new.id, new.email)
    ON CONFLICT (id) DO NOTHING;  -- Prevent duplicates
    
  -- For OAuth providers, include name and avatar
  elsif new.raw_app_meta_data ->> 'provider' IN ('kakao', 'google') then
    insert into public.profile (id, email, name, image_path)
    values (
      new.id,
      new.email,
      new.raw_user_meta_data ->> 'name',
      new.raw_user_meta_data ->> 'avatar_url'
    )
    ON CONFLICT (id) DO NOTHING;  -- Prevent duplicates
  end if;
  
  return new;
end;
$$;

-- Step 2: CREATE THE MISSING TRIGGER ATTACHMENT!
-- This is what's missing - the function exists but isn't triggered
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.add_new_user();

-- Step 3: Fix existing users who don't have profiles
-- This includes the test users from sessions 80-81
INSERT INTO public.profile (id, email)
SELECT 
  au.id,
  au.email
FROM auth.users au
LEFT JOIN public.profile p ON p.id = au.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Step 4: Verify the trigger is now attached
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'users'
  AND trigger_schema = 'auth';

-- Step 5: Check if profiles were created for existing users
SELECT 
    COUNT(*) as users_without_profiles
FROM auth.users au
LEFT JOIN public.profile p ON p.id = au.id
WHERE p.id IS NULL;

-- Expected result: 0 users without profiles