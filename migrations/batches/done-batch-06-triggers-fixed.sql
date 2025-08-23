-- =============================================
-- Batch 06: Triggers (Fixed)
-- Session 00052
-- Purpose: Create all triggers for automated behaviors
-- Dependencies: Batch 05 (functions must exist first)
-- Total Triggers: 17 (application triggers only)
-- =============================================

BEGIN;

-- =============================================
-- AUTH SCHEMA TRIGGERS (1 trigger)
-- =============================================

-- Trigger: Handle new user creation
CREATE TRIGGER on_auth_user_created 
    AFTER INSERT ON auth.users 
    FOR EACH ROW 
    EXECUTE FUNCTION public.add_new_user();

-- =============================================
-- CHAT SCHEMA TRIGGERS (2 triggers)
-- =============================================

-- Trigger: Update message timestamp
CREATE TRIGGER trg_message_updated_at 
    BEFORE UPDATE ON chat.message 
    FOR EACH ROW 
    EXECUTE FUNCTION chat.set_timestamp();

-- Trigger: Update room timestamp
CREATE TRIGGER trg_room_updated_at 
    BEFORE UPDATE ON chat.room 
    FOR EACH ROW 
    EXECUTE FUNCTION chat.set_timestamp();

-- =============================================
-- PUBLIC SCHEMA TRIGGERS (14 triggers)
-- =============================================

-- Friendship triggers
CREATE TRIGGER check_friendship_update_allowed_columns_trigger 
    BEFORE UPDATE ON public.friendship 
    FOR EACH ROW 
    EXECUTE FUNCTION public.check_friendship_update_allowed_columns();

CREATE TRIGGER trg_cleanup_friendship_status 
    AFTER INSERT OR UPDATE ON public.friendship 
    FOR EACH ROW 
    EXECUTE FUNCTION public.delete_invalid_friendship();

-- Student triggers
CREATE TRIGGER check_insert_allowed_columns_trigger 
    BEFORE INSERT ON public.student 
    FOR EACH ROW 
    EXECUTE FUNCTION public.check_insert_allowed_columns();

CREATE TRIGGER check_update_allowed_columns_trigger 
    BEFORE UPDATE ON public.student 
    FOR EACH ROW 
    EXECUTE FUNCTION public.check_update_allowed_columns();

CREATE TRIGGER trg_set_division 
    BEFORE INSERT OR UPDATE ON public.student 
    FOR EACH ROW 
    EXECUTE FUNCTION public.set_division();

-- Team triggers
CREATE TRIGGER trg_before_update_team 
    BEFORE UPDATE ON public.team 
    FOR EACH ROW 
    EXECUTE FUNCTION public.check_team_update_leader();

CREATE TRIGGER trg_team_create_room 
    AFTER INSERT ON public.team 
    FOR EACH ROW 
    EXECUTE FUNCTION chat.fn_create_team_room();

CREATE TRIGGER trg_team_update_room_title 
    AFTER UPDATE OF name ON public.team 
    FOR EACH ROW 
    WHEN (old.name IS DISTINCT FROM new.name) 
    EXECUTE FUNCTION chat.fn_sync_team_room_title();

-- Team member triggers
CREATE TRIGGER trg_after_delete_team_member 
    AFTER DELETE ON public.team_member 
    FOR EACH ROW 
    EXECUTE FUNCTION public.delete_empty_team_after_member_delete();

CREATE TRIGGER trg_before_delete_team_member 
    BEFORE DELETE ON public.team_member 
    FOR EACH ROW 
    EXECUTE FUNCTION public.check_team_member_delete();

CREATE TRIGGER trg_team_member_add_participant 
    AFTER INSERT OR UPDATE ON public.team_member 
    FOR EACH ROW 
    EXECUTE FUNCTION chat.fn_add_team_member_to_room();

-- Guild triggers
CREATE TRIGGER trg_guild_create_room 
    AFTER INSERT ON public.guild 
    FOR EACH ROW 
    EXECUTE FUNCTION chat.fn_create_guild_room();

CREATE TRIGGER trg_guild_update_room_title 
    AFTER UPDATE OF name ON public.guild 
    FOR EACH ROW 
    WHEN (old.name IS DISTINCT FROM new.name) 
    EXECUTE FUNCTION chat.fn_sync_guild_room_title();

-- Guild member triggers
CREATE TRIGGER trg_guild_member_add_participant 
    AFTER INSERT OR UPDATE ON public.guild_member 
    FOR EACH ROW 
    EXECUTE FUNCTION chat.fn_add_guild_member_to_room();

-- =============================================
-- VERIFICATION QUERIES
-- =============================================
-- After execution, verify with:
-- SELECT COUNT(*) FROM information_schema.triggers
-- WHERE trigger_schema IN ('public', 'chat', 'auth')
-- AND trigger_name NOT LIKE 'tr_%'
-- AND trigger_name NOT LIKE 'enforce_%'
-- AND trigger_name NOT LIKE 'objects_%'
-- AND trigger_name NOT LIKE 'prefixes_%'
-- AND trigger_name NOT LIKE 'update_objects_%';
-- Expected: 17

COMMIT;

-- =============================================
-- NOTES:
-- 1. Fixed syntax errors from original Batch 06:
--    - Removed duplicate AFTER/BEFORE keywords in compound triggers
--    - Removed duplicate trigger definition
-- 2. Added column-specific triggers with WHEN clauses for efficiency
-- 3. Excluded system triggers (realtime.*, storage.*)
-- 4. All trigger functions must exist (Batch 05) before this executes
-- =============================================