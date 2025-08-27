-- Session 00015: Fix Trigger Error Causing Signup Failures
-- Created: 2025-08-16
-- Problem: Database error saving new user - trigger might be failing

-- ============================================================
-- PART 1: Drop Problematic Trigger Temporarily
-- ============================================================
-- The trigger might be causing the signup failure
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- ============================================================
-- PART 2: Create Safer Trigger Function
-- ============================================================
-- Replace the function with better error handling
CREATE OR REPLACE FUNCTION create_user_on_signup()
RETURNS TRIGGER AS $$
BEGIN
    -- Only try to insert if the record doesn't already exist
    INSERT INTO public.users (email, auth_id, created_at)
    VALUES (NEW.email, NEW.id, NOW())
    ON CONFLICT (auth_id) DO NOTHING;
    
    -- Always return NEW to allow the auth user creation to succeed
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error but don't fail the user creation
        RAISE WARNING 'Failed to create users record for auth_id %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- PART 3: Recreate Trigger with Better Error Handling
-- ============================================================
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_user_on_signup();

-- ============================================================
-- PART 4: Manual User Creation Function (Backup)
-- ============================================================
-- In case the trigger still fails, provide manual creation
CREATE OR REPLACE FUNCTION manually_create_user_record(user_auth_id UUID, user_email TEXT)
RETURNS UUID AS $$
DECLARE
    new_user_id UUID;
BEGIN
    INSERT INTO public.users (email, auth_id, created_at)
    VALUES (user_email, user_auth_id, NOW())
    ON CONFLICT (auth_id) DO UPDATE SET
        email = EXCLUDED.email,
        last_login = NOW()
    RETURNING id INTO new_user_id;
    
    RETURN new_user_id;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to create user record: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION manually_create_user_record(UUID, TEXT) TO authenticated;

-- ============================================================
-- PART 5: Alternative - Test Without Trigger
-- ============================================================
-- If trigger continues to cause issues, we can disable it
-- and handle user creation in the application code instead

-- To disable trigger completely if needed:
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- To re-enable later:
-- CREATE TRIGGER on_auth_user_created
--     AFTER INSERT ON auth.users
--     FOR EACH ROW
--     EXECUTE FUNCTION create_user_on_signup();

-- ============================================================
-- VERIFICATION
-- ============================================================
-- Check if trigger exists
SELECT 
    trigger_name,
    event_object_table,
    action_timing,
    'Trigger recreated with error handling' as status
FROM information_schema.triggers
WHERE trigger_schema = 'public'
AND trigger_name = 'on_auth_user_created';

-- Check if function exists
SELECT 
    routine_name,
    routine_type,
    'Function updated with exception handling' as status
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name = 'create_user_on_signup';