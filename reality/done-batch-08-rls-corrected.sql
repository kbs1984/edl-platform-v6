---
session: "00053"
type: "migration-deployed"
status: "applied"
created: "2025-08-27"
title: "Deployed Migration: batch-08-rls-corrected"
purpose: "Applied database migration - RLS policies"
topics: ["database", "migration", "reality", "deployed"]
priority: "P0"
domain: "reality"
reality_type: "deployed-migration"
deployment_status: "production"
verified: true
---

-- =============================================
-- Batch 08: Row Level Security (RLS) - Corrected Column Names
-- Session 00052
-- Purpose: Enable RLS and create security policies with correct column names
-- Dependencies: Batches 03-05 (tables and functions)
-- Total: 19 tables, ~40 policies
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

DO $$
DECLARE
    r RECORD;
BEGIN
    -- Drop all existing policies on our tables
    FOR r IN 
        SELECT DISTINCT policyname, tablename, schemaname
        FROM pg_policies 
        WHERE schemaname IN ('public', 'chat', 'debate')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
                      r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;

-- =============================================
-- CREATE SECURITY POLICIES
-- =============================================

-- =============================================
-- PUBLIC SCHEMA POLICIES
-- =============================================

-- SCHOOL policies
CREATE POLICY "school_insert_authenticated" 
    ON public.school FOR INSERT TO authenticated 
    WITH CHECK (true);

-- FRIENDSHIP policies
CREATE POLICY "friendship_insert" 
    ON public.friendship FOR INSERT TO authenticated 
    WITH CHECK (true);

CREATE POLICY "friendship_select" 
    ON public.friendship FOR SELECT TO authenticated 
    USING ((user_id = auth.uid()) OR (friend_id = auth.uid()));

CREATE POLICY "friendship_update" 
    ON public.friendship FOR UPDATE TO authenticated 
    USING ((user_id = auth.uid()) OR (friend_id = auth.uid())) 
    WITH CHECK ((user_id = auth.uid()) OR (friend_id = auth.uid()));

-- GUARDIAN policies
CREATE POLICY "guardian_delete" 
    ON public.guardian FOR DELETE TO authenticated 
    USING ((user_id = auth.uid()));

CREATE POLICY "guardian_insert" 
    ON public.guardian FOR INSERT TO authenticated 
    WITH CHECK ((user_id = auth.uid()));

CREATE POLICY "guardian_select" 
    ON public.guardian FOR SELECT TO authenticated 
    USING (true);

CREATE POLICY "guardian_update" 
    ON public.guardian FOR UPDATE TO authenticated 
    USING ((user_id = auth.uid())) 
    WITH CHECK ((user_id = auth.uid()));

-- GUARDIAN_REQUEST policies (using sender/reciever columns)
CREATE POLICY "guardian_request_delete" 
    ON public.guardian_request FOR DELETE TO authenticated 
    USING ((sender = auth.uid()));

CREATE POLICY "guardian_request_insert" 
    ON public.guardian_request FOR INSERT TO authenticated 
    WITH CHECK ((sender = auth.uid()));

CREATE POLICY "guardian_request_select" 
    ON public.guardian_request FOR SELECT TO authenticated 
    USING ((sender = auth.uid()) OR (reciever = auth.uid()));

CREATE POLICY "guardian_request_update" 
    ON public.guardian_request FOR UPDATE TO authenticated 
    USING ((sender = auth.uid()) OR (reciever = auth.uid())) 
    WITH CHECK ((sender = auth.uid()) OR (reciever = auth.uid()));

-- JUDGE policies  
CREATE POLICY "judge_insert" 
    ON public.judge FOR INSERT TO authenticated 
    WITH CHECK ((user_id = auth.uid()));

CREATE POLICY "judge_select" 
    ON public.judge FOR SELECT TO authenticated 
    USING (true);

CREATE POLICY "judge_update" 
    ON public.judge FOR UPDATE TO authenticated 
    USING ((user_id = auth.uid())) 
    WITH CHECK ((user_id = auth.uid()));

-- PROFILE policies
CREATE POLICY "profile_insert_authenticated" 
    ON public.profile FOR INSERT TO authenticated 
    WITH CHECK (true);

CREATE POLICY "profile_select_all" 
    ON public.profile FOR SELECT 
    USING (true);

CREATE POLICY "profile_update_own" 
    ON public.profile FOR UPDATE TO authenticated 
    USING ((auth.uid() = id)) 
    WITH CHECK ((auth.uid() = id));

-- STUDENT policies
CREATE POLICY "student_delete" 
    ON public.student FOR DELETE TO authenticated 
    USING ((user_id = auth.uid()));

CREATE POLICY "student_insert" 
    ON public.student FOR INSERT TO authenticated 
    WITH CHECK ((user_id = auth.uid()));

CREATE POLICY "student_select" 
    ON public.student FOR SELECT TO authenticated 
    USING (true);

CREATE POLICY "student_update" 
    ON public.student FOR UPDATE TO authenticated 
    USING ((user_id = auth.uid())) 
    WITH CHECK ((user_id = auth.uid()));

-- TEAM policies
CREATE POLICY "team_select_all" 
    ON public.team FOR SELECT TO authenticated 
    USING (true);

-- TEAM_MEMBER policies
CREATE POLICY "team_member_select_all" 
    ON public.team_member FOR SELECT TO authenticated 
    USING (true);

-- =============================================
-- CHAT SCHEMA POLICIES
-- =============================================

-- MESSAGE policies
CREATE POLICY "message_delete_own" 
    ON chat.message FOR DELETE TO authenticated 
    USING ((sender_id = auth.uid()));

CREATE POLICY "message_insert_own" 
    ON chat.message FOR INSERT TO authenticated 
    WITH CHECK ((sender_id = auth.uid()));

CREATE POLICY "message_select_participant" 
    ON chat.message FOR SELECT TO authenticated 
    USING ((EXISTS ( 
        SELECT 1 FROM chat.participant p 
        WHERE ((p.room_id = message.room_id) AND (p.student_id = auth.uid()))
    )));

CREATE POLICY "message_update_own_recent" 
    ON chat.message FOR UPDATE TO authenticated 
    USING (((sender_id = auth.uid()) AND ((created_at + '00:05:00'::interval) > now()))) 
    WITH CHECK (((sender_id = auth.uid()) AND ((created_at + '00:05:00'::interval) > now())));

-- PARTICIPANT policies
CREATE POLICY "participant_delete_own" 
    ON chat.participant FOR DELETE TO authenticated 
    USING ((student_id = auth.uid()));

CREATE POLICY "participant_insert_own" 
    ON chat.participant FOR INSERT TO authenticated 
    WITH CHECK ((student_id = auth.uid()));

CREATE POLICY "participant_select_own" 
    ON chat.participant FOR SELECT TO authenticated 
    USING ((student_id = auth.uid()));

CREATE POLICY "participant_update_own" 
    ON chat.participant FOR UPDATE TO authenticated 
    USING ((student_id = auth.uid())) 
    WITH CHECK ((student_id = auth.uid()));

-- ROOM policies
CREATE POLICY "room_select_participant" 
    ON chat.room FOR SELECT TO authenticated 
    USING ((EXISTS ( 
        SELECT 1 FROM chat.participant p 
        WHERE ((p.room_id = room.id) AND (p.student_id = auth.uid()))
    )));

CREATE POLICY "room_update_participant" 
    ON chat.room FOR UPDATE TO authenticated 
    USING ((EXISTS ( 
        SELECT 1 FROM chat.participant p 
        WHERE ((p.room_id = room.id) AND (p.student_id = auth.uid()))
    ))) 
    WITH CHECK ((EXISTS ( 
        SELECT 1 FROM chat.participant p 
        WHERE ((p.room_id = room.id) AND (p.student_id = auth.uid()))
    )));

-- =============================================
-- DEBATE SCHEMA POLICIES
-- =============================================

CREATE POLICY "genres_select_authenticated" 
    ON debate.genres FOR SELECT TO authenticated 
    USING (true);

CREATE POLICY "sides_select_authenticated" 
    ON debate.sides FOR SELECT TO authenticated 
    USING (true);

CREATE POLICY "debate_formats_select_authenticated" 
    ON debate.debate_formats FOR SELECT TO authenticated 
    USING (true);

CREATE POLICY "criteria_select_all" 
    ON debate.criteria FOR SELECT 
    USING (true);

CREATE POLICY "format_rounds_select_all" 
    ON debate.format_rounds FOR SELECT 
    USING (true);

CREATE POLICY "round_templates_select_all" 
    ON debate.round_templates FOR SELECT 
    USING (true);

CREATE POLICY "ballots_select_authenticated" 
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

-- Check policies count:
-- SELECT schemaname, tablename, COUNT(*) as policy_count
-- FROM pg_policies
-- WHERE schemaname IN ('public', 'chat', 'debate')
-- GROUP BY schemaname, tablename
-- ORDER BY schemaname, tablename;

-- Check specific table columns (for debugging):
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_schema = 'public' 
-- AND table_name = 'guardian_request'
-- ORDER BY ordinal_position;

COMMIT;

-- =============================================
-- NOTES:
-- 1. Fixed column name mismatches:
--    - guardian_request uses 'sender' and 'reciever' (with typo)
--    - Not 'student_id' and 'guardian_id'
-- 2. Simplified policy names to avoid conflicts
-- 3. Drops all existing policies first
-- 4. All policies use actual column names from tables
-- =============================================