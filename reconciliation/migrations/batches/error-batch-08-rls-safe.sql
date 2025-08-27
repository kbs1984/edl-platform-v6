-- =============================================
-- Batch 08: Row Level Security (RLS) - Safe Version
-- Session 00052
-- Purpose: Enable RLS and create security policies (with duplicate handling)
-- Dependencies: Batches 03-05 (tables and functions)
-- Total: 19 tables, 42 policies (with duplicates removed)
-- =============================================

BEGIN;

-- =============================================
-- ENABLE ROW LEVEL SECURITY
-- Note: ALTER TABLE ... ENABLE is idempotent (safe to re-run)
-- =============================================

-- PUBLIC schema tables
ALTER TABLE public.friendship ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guardian ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guardian_request ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.judge ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_member ENABLE ROW LEVEL SECURITY;

-- CHAT schema tables
ALTER TABLE chat.message ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat.participant ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat.room ENABLE ROW LEVEL SECURITY;

-- DEBATE schema tables
ALTER TABLE debate.ballots ENABLE ROW LEVEL SECURITY;
ALTER TABLE debate.criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE debate.debate_formats ENABLE ROW LEVEL SECURITY;
ALTER TABLE debate.format_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE debate.genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE debate.round_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE debate.sides ENABLE ROW LEVEL SECURITY;

-- =============================================
-- DROP EXISTING POLICIES (to avoid conflicts)
-- =============================================

-- Drop all existing policies on our tables
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Drop policies for public schema
    FOR r IN 
        SELECT policyname, tablename 
        FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename IN ('friendship', 'guardian', 'guardian_request', 'judge', 
                         'profile', 'school', 'student', 'team', 'team_member')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
    END LOOP;
    
    -- Drop policies for chat schema
    FOR r IN 
        SELECT policyname, tablename 
        FROM pg_policies 
        WHERE schemaname = 'chat'
        AND tablename IN ('message', 'participant', 'room')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON chat.%I', r.policyname, r.tablename);
    END LOOP;
    
    -- Drop policies for debate schema
    FOR r IN 
        SELECT policyname, tablename 
        FROM pg_policies 
        WHERE schemaname = 'debate'
        AND tablename IN ('ballots', 'criteria', 'debate_formats', 'format_rounds', 
                         'genres', 'round_templates', 'sides')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON debate.%I', r.policyname, r.tablename);
    END LOOP;
END $$;

-- =============================================
-- CREATE SECURITY POLICIES (cleaned of duplicates)
-- =============================================

-- PUBLIC.SCHOOL policies
CREATE POLICY "Allow authenticated users to insert school" 
    ON public.school FOR INSERT TO authenticated 
    WITH CHECK (true);

-- PUBLIC.FRIENDSHIP policies (removed duplicates)
CREATE POLICY "Allow insert on friendship" 
    ON public.friendship FOR INSERT TO authenticated 
    WITH CHECK (true);

CREATE POLICY "Allow select on friendship" 
    ON public.friendship FOR SELECT TO authenticated 
    USING ((user_id = auth.uid()) OR (friend_id = auth.uid()));

CREATE POLICY "Allow update on friendship" 
    ON public.friendship FOR UPDATE TO authenticated 
    USING ((user_id = auth.uid()) OR (friend_id = auth.uid())) 
    WITH CHECK ((user_id = auth.uid()) OR (friend_id = auth.uid()));

-- PUBLIC.GUARDIAN policies
CREATE POLICY "guardian_delete_policy" 
    ON public.guardian FOR DELETE TO authenticated 
    USING ((user_id = auth.uid()));

CREATE POLICY "guardian_insert_policy" 
    ON public.guardian FOR INSERT TO authenticated 
    WITH CHECK ((user_id = auth.uid()));

CREATE POLICY "guardian_select_policy" 
    ON public.guardian FOR SELECT TO authenticated 
    USING (true);

CREATE POLICY "guardian_update_policy" 
    ON public.guardian FOR UPDATE TO authenticated 
    USING ((user_id = auth.uid())) 
    WITH CHECK ((user_id = auth.uid()));

-- PUBLIC.GUARDIAN_REQUEST policies
CREATE POLICY "guardian_request_delete_policy" 
    ON public.guardian_request FOR DELETE TO authenticated 
    USING ((student_id = auth.uid()));

CREATE POLICY "guardian_request_insert_policy" 
    ON public.guardian_request FOR INSERT TO authenticated 
    WITH CHECK ((student_id = auth.uid()));

CREATE POLICY "guardian_request_select_policy" 
    ON public.guardian_request FOR SELECT TO authenticated 
    USING (((student_id = auth.uid()) OR (guardian_id = auth.uid())));

CREATE POLICY "guardian_request_update_policy" 
    ON public.guardian_request FOR UPDATE TO authenticated 
    USING (((student_id = auth.uid()) OR (guardian_id = auth.uid()))) 
    WITH CHECK (((student_id = auth.uid()) OR (guardian_id = auth.uid())));

-- PUBLIC.JUDGE policies  
CREATE POLICY "judge_insert_policy" 
    ON public.judge FOR INSERT TO authenticated 
    WITH CHECK ((user_id = auth.uid()));

CREATE POLICY "judge_select_policy" 
    ON public.judge FOR SELECT TO authenticated 
    USING (true);

CREATE POLICY "judge_update_policy" 
    ON public.judge FOR UPDATE TO authenticated 
    USING ((user_id = auth.uid())) 
    WITH CHECK ((user_id = auth.uid()));

-- PUBLIC.PROFILE policies
CREATE POLICY "Enable insert for authenticated users only" 
    ON public.profile FOR INSERT TO authenticated 
    WITH CHECK (true);

CREATE POLICY "Enable read access for all users" 
    ON public.profile FOR SELECT 
    USING (true);

CREATE POLICY "Enable update for users based on id" 
    ON public.profile FOR UPDATE TO authenticated 
    USING ((auth.uid() = id)) 
    WITH CHECK ((auth.uid() = id));

-- PUBLIC.STUDENT policies
CREATE POLICY "student_delete_policy" 
    ON public.student FOR DELETE TO authenticated 
    USING ((user_id = auth.uid()));

CREATE POLICY "student_insert_policy" 
    ON public.student FOR INSERT TO authenticated 
    WITH CHECK ((user_id = auth.uid()));

CREATE POLICY "student_select_policy" 
    ON public.student FOR SELECT TO authenticated 
    USING (true);

CREATE POLICY "student_update_policy" 
    ON public.student FOR UPDATE TO authenticated 
    USING ((user_id = auth.uid())) 
    WITH CHECK ((user_id = auth.uid()));

-- PUBLIC.TEAM policies
CREATE POLICY "team_select" 
    ON public.team FOR SELECT TO authenticated 
    USING (true);

-- PUBLIC.TEAM_MEMBER policies
CREATE POLICY "team_member_select" 
    ON public.team_member FOR SELECT TO authenticated 
    USING (true);

-- CHAT.MESSAGE policies
CREATE POLICY "message_delete_policy" 
    ON chat.message FOR DELETE TO authenticated 
    USING ((sender_id = auth.uid()));

CREATE POLICY "message_insert_policy" 
    ON chat.message FOR INSERT TO authenticated 
    WITH CHECK ((sender_id = auth.uid()));

CREATE POLICY "message_select_policy" 
    ON chat.message FOR SELECT TO authenticated 
    USING ((EXISTS ( 
        SELECT 1 FROM chat.participant p 
        WHERE ((p.room_id = message.room_id) AND (p.student_id = auth.uid()))
    )));

CREATE POLICY "message_update_policy" 
    ON chat.message FOR UPDATE TO authenticated 
    USING (((sender_id = auth.uid()) AND ((created_at + '00:05:00'::interval) > now()))) 
    WITH CHECK (((sender_id = auth.uid()) AND ((created_at + '00:05:00'::interval) > now())));

-- CHAT.PARTICIPANT policies
CREATE POLICY "participant_delete_policy" 
    ON chat.participant FOR DELETE TO authenticated 
    USING ((student_id = auth.uid()));

CREATE POLICY "participant_insert_policy" 
    ON chat.participant FOR INSERT TO authenticated 
    WITH CHECK ((student_id = auth.uid()));

CREATE POLICY "participant_select_policy" 
    ON chat.participant FOR SELECT TO authenticated 
    USING ((student_id = auth.uid()));

CREATE POLICY "participant_update_policy" 
    ON chat.participant FOR UPDATE TO authenticated 
    USING ((student_id = auth.uid())) 
    WITH CHECK ((student_id = auth.uid()));

-- CHAT.ROOM policies
CREATE POLICY "room_select_policy" 
    ON chat.room FOR SELECT TO authenticated 
    USING ((EXISTS ( 
        SELECT 1 FROM chat.participant p 
        WHERE ((p.room_id = room.id) AND (p.student_id = auth.uid()))
    )));

CREATE POLICY "room_update_policy" 
    ON chat.room FOR UPDATE TO authenticated 
    USING ((EXISTS ( 
        SELECT 1 FROM chat.participant p 
        WHERE ((p.room_id = room.id) AND (p.student_id = auth.uid()))
    ))) 
    WITH CHECK ((EXISTS ( 
        SELECT 1 FROM chat.participant p 
        WHERE ((p.room_id = room.id) AND (p.student_id = auth.uid()))
    )));

-- DEBATE schema policies
CREATE POLICY "Allow authenticated read" 
    ON debate.genres FOR SELECT TO authenticated 
    USING (true);

CREATE POLICY "Allow authenticated read sides" 
    ON debate.sides FOR SELECT TO authenticated 
    USING (true);

CREATE POLICY "Allow read debate_formats" 
    ON debate.debate_formats FOR SELECT TO authenticated 
    USING (true);

CREATE POLICY "Enable read access for all users criteria" 
    ON debate.criteria FOR SELECT 
    USING (true);

CREATE POLICY "Enable read access for all users format_rounds" 
    ON debate.format_rounds FOR SELECT 
    USING (true);

CREATE POLICY "Enable read access for all users round_templates" 
    ON debate.round_templates FOR SELECT 
    USING (true);

CREATE POLICY "Enable select for authenticated users only" 
    ON debate.ballots FOR SELECT TO authenticated 
    USING (true);

-- =============================================
-- VERIFICATION QUERIES
-- =============================================
-- Check RLS enabled:
-- SELECT schemaname, tablename, rowsecurity 
-- FROM pg_tables 
-- WHERE schemaname IN ('public', 'chat', 'debate')
-- AND rowsecurity = true
-- ORDER BY schemaname, tablename;
-- Expected: 19 tables

-- Check policies:
-- SELECT schemaname, tablename, COUNT(*) as policy_count
-- FROM pg_policies
-- WHERE schemaname IN ('public', 'chat', 'debate')
-- GROUP BY schemaname, tablename
-- ORDER BY schemaname, tablename;
-- Expected: ~40 policies (after removing duplicates)

COMMIT;

-- =============================================
-- NOTES:
-- 1. This version safely handles existing policies
-- 2. Drops all policies first to avoid conflicts
-- 3. Recreates all policies cleanly
-- 4. Removed duplicate policy definitions found in original
-- 5. RLS enablement is idempotent (safe to re-run)
-- =============================================