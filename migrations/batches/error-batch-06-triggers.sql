-- =============================================
-- Batch 06: Triggers
-- Session 00050
-- Purpose: Create all triggers
-- Dependencies: Batch 05 (functions)
-- =============================================

BEGIN;

-- =============================================
-- TRIGGERS
-- =============================================

CREATE TRIGGER trg_message_updated_at BEFORE UPDATE ON chat.message FOR EACH ROW EXECUTE FUNCTION chat.set_timestamp();
CREATE TRIGGER trg_room_updated_at BEFORE UPDATE ON chat.room FOR EACH ROW EXECUTE FUNCTION chat.set_timestamp();
CREATE TRIGGER check_friendship_update_allowed_columns_trigger BEFORE UPDATE ON public.friendship FOR EACH ROW EXECUTE FUNCTION public.check_friendship_update_allowed_columns();
CREATE TRIGGER trg_cleanup_friendship_status AFTER INSERT OR AFTER UPDATE ON public.friendship FOR EACH ROW EXECUTE FUNCTION public.delete_invalid_friendship();
CREATE TRIGGER trg_guild_create_room AFTER INSERT ON public.guild FOR EACH ROW EXECUTE FUNCTION chat.fn_create_guild_room();
CREATE TRIGGER trg_guild_update_room_title AFTER UPDATE ON public.guild FOR EACH ROW EXECUTE FUNCTION chat.fn_sync_guild_room_title();
CREATE TRIGGER trg_guild_member_add_participant AFTER INSERT OR AFTER UPDATE ON public.guild_member FOR EACH ROW EXECUTE FUNCTION chat.fn_add_guild_member_to_room();
CREATE TRIGGER check_insert_allowed_columns_trigger BEFORE INSERT ON public.student FOR EACH ROW EXECUTE FUNCTION public.check_insert_allowed_columns();
CREATE TRIGGER check_update_allowed_columns_trigger BEFORE UPDATE ON public.student FOR EACH ROW EXECUTE FUNCTION public.check_update_allowed_columns();
CREATE TRIGGER trg_set_division BEFORE INSERT OR BEFORE UPDATE ON public.student FOR EACH ROW EXECUTE FUNCTION public.set_division();
CREATE TRIGGER trg_before_update_team BEFORE UPDATE ON public.team FOR EACH ROW EXECUTE FUNCTION public.check_team_update_leader();
CREATE TRIGGER trg_team_create_room AFTER INSERT ON public.team FOR EACH ROW EXECUTE FUNCTION chat.fn_create_team_room();
CREATE TRIGGER trg_team_update_room_title AFTER UPDATE ON public.team FOR EACH ROW EXECUTE FUNCTION chat.fn_sync_team_room_title();
CREATE TRIGGER trg_after_delete_team_member AFTER DELETE ON public.team_member FOR EACH ROW EXECUTE FUNCTION public.delete_empty_team_after_member_delete();
CREATE TRIGGER trg_before_delete_team_member BEFORE DELETE ON public.team_member FOR EACH ROW EXECUTE FUNCTION public.check_team_member_delete();
CREATE TRIGGER trg_team_member_add_participant AFTER INSERT OR AFTER UPDATE ON public.team_member FOR EACH ROW EXECUTE FUNCTION chat.fn_add_team_member_to_room();
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.add_new_user();
CREATE TRIGGER on_auth_user_created 
--    AFTER INSERT ON auth.users 
--    FOR EACH ROW EXECUTE FUNCTION public.add_new_user();

-- =============================================
-- VERIFICATION QUERIES
-- =============================================
-- SELECT COUNT(*) FROM information_schema.triggers
-- WHERE trigger_schema IN ('public', 'chat', 'debate');

COMMIT;
