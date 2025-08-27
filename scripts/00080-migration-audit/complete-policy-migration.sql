-- ============================================
-- Session 00080 - RLS Policy Migration Script
-- Generated: 2025-08-26T16:26:21.480430
-- Purpose: Reconcile database policies with backup
-- ============================================

-- PHASE 1: Drop all existing policies
-- This ensures we start clean

-- Drop policies for chat.participant
DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON chat.participant;
DROP POLICY IF EXISTS "Enable users to view their own data only" ON chat.participant;

-- Drop policies for debate.ballots
DROP POLICY IF EXISTS "Judges can manage their own ballots" ON debate.ballots;
DROP POLICY IF EXISTS "Participants can view ballots for their debates" ON debate.ballots;

-- Drop policies for debate.criteria
DROP POLICY IF EXISTS "Enable read access for all users" ON debate.criteria;

-- Drop policies for debate.debate_formats
DROP POLICY IF EXISTS "Enable read access for all users" ON debate.debate_formats;

-- Drop policies for debate.format_rounds
DROP POLICY IF EXISTS "Enable read access for all users" ON debate.format_rounds;

-- Drop policies for debate.genres
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON debate.genres;
DROP POLICY IF EXISTS "Enable read access for all users" ON debate.genres;

-- Drop policies for debate.round_templates
DROP POLICY IF EXISTS "Enable read access for all users" ON debate.round_templates;

-- Drop policies for debate.sides
DROP POLICY IF EXISTS "Enable read access for all users" ON debate.sides;

-- Drop policies for public.friendship
DROP POLICY IF EXISTS "Allow insert on friendship" ON public.friendship;
DROP POLICY IF EXISTS "Allow select on friendship" ON public.friendship;
DROP POLICY IF EXISTS "Allow update on friendship" ON public.friendship;

-- Drop policies for public.guardian
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.guardian;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.guardian;

-- Drop policies for public.judge
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.judge;

-- Drop policies for public.profile
DROP POLICY IF EXISTS "Allow users to select their own profile" ON public.profile;
DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.profile;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profile;

-- Drop policies for public.school
DROP POLICY IF EXISTS "Allow authenticated users to insert school" ON public.school;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.school;

-- Drop policies for public.student
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.student;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.student;

-- Drop policies for public.team
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.team;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.team;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.team;
DROP POLICY IF EXISTS "Policy with table joins" ON public.team;

-- Drop policies for public.team_member
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.team_member;
DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON public.team_member;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.team_member;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.team_member;

-- Drop policies for storage.objects
DROP POLICY IF EXISTS "Give anon users access to JPG images in folder g2sb1v_0" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to delete their own file vejz8c_0" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to own folder g2sb1v_0" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to own folder g2sb1v_1" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to own folder g2sb1v_2" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to own folder vejz8c_0" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to own folder vejz8c_1" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to their own folder vejz8c_0" ON storage.objects;


-- PHASE 2: Enable RLS on tables
-- Must be done before creating policies

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat.message ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat.participant ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat.room ENABLE ROW LEVEL SECURITY;
ALTER TABLE debate.ballots ENABLE ROW LEVEL SECURITY;
ALTER TABLE debate.criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE debate.debate_formats ENABLE ROW LEVEL SECURITY;
ALTER TABLE debate.format_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE debate.genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE debate.round_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE debate.sides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friendship ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guardian ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guardian_request ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.judge ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_member ENABLE ROW LEVEL SECURITY;
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.buckets_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.prefixes ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

-- PHASE 3: Create policies from backup
-- These are the authoritative policies


-- Policies for chat.participant
-- Total: 2 policies

-- SELECT policies
CREATE POLICY "Enable users to view their own data only" ON chat.participant FOR SELECT TO authenticated USING (true);


-- INSERT policies
CREATE POLICY "Enable insert for users based on user_id" ON chat.participant FOR INSERT WITH CHECK ((( SELECT auth.uid() AS uid) = student_id));


-- Policies for debate.ballots
-- Total: 2 policies

-- SELECT policies
CREATE POLICY "Participants can view ballots for their debates" ON debate.ballots FOR SELECT USING ((debate_id IN ( SELECT dt.debate_id
   FROM ((debate.debate_teams dt
     JOIN debate.debate_participants dp ON ((dp.debate_team_id = dt.id)))
     JOIN public.student s ON ((dp.user_id = s.user_id)))
  WHERE (s.user_id = auth.uid()))));


-- ALL policies
CREATE POLICY "Judges can manage their own ballots" ON debate.ballots USING ((judge_id IN ( SELECT judge.id
   FROM public.judge
  WHERE (judge.user_id = auth.uid()))));


-- Policies for debate.criteria
-- Total: 1 policies

-- SELECT policies
CREATE POLICY "Enable read access for all users" ON debate.criteria FOR SELECT USING (true);


-- Policies for debate.debate_formats
-- Total: 1 policies

-- SELECT policies
CREATE POLICY "Enable read access for all users" ON debate.debate_formats FOR SELECT USING (true);


-- Policies for debate.format_rounds
-- Total: 1 policies

-- SELECT policies
CREATE POLICY "Enable read access for all users" ON debate.format_rounds FOR SELECT USING (true);


-- Policies for debate.genres
-- Total: 2 policies

-- SELECT policies
CREATE POLICY "Enable read access for all users" ON debate.genres FOR SELECT USING (true);


-- INSERT policies
CREATE POLICY "Enable insert for authenticated users only" ON debate.genres FOR INSERT TO authenticated WITH CHECK (true);


-- Policies for debate.round_templates
-- Total: 1 policies

-- SELECT policies
CREATE POLICY "Enable read access for all users" ON debate.round_templates FOR SELECT USING (true);


-- Policies for debate.sides
-- Total: 1 policies

-- SELECT policies
CREATE POLICY "Enable read access for all users" ON debate.sides FOR SELECT USING (true);


-- Policies for public.friendship
-- Total: 3 policies

-- SELECT policies
CREATE POLICY "Allow select on friendship" ON public.friendship FOR SELECT TO authenticated USING (((user_id = auth.uid()) OR (friend_id = auth.uid())));


-- INSERT policies
CREATE POLICY "Allow insert on friendship" ON public.friendship FOR INSERT TO authenticated WITH CHECK (true);


-- UPDATE policies
CREATE POLICY "Allow update on friendship" ON public.friendship FOR UPDATE TO authenticated USING (((user_id = auth.uid()) OR (friend_id = auth.uid()))) WITH CHECK (((user_id = auth.uid()) OR ((friend_id = auth.uid()) AND (status = ANY (ARRAY['ACCEPTED'::public.status, 'REJECTED'::public.status])))));


-- Policies for public.guardian
-- Total: 2 policies

-- SELECT policies
CREATE POLICY "Enable read access for all users" ON public.guardian FOR SELECT USING (true);


-- INSERT policies
CREATE POLICY "Enable insert for authenticated users only" ON public.guardian FOR INSERT TO authenticated WITH CHECK (true);


-- Policies for public.judge
-- Total: 1 policies

-- INSERT policies
CREATE POLICY "Enable insert for authenticated users only" ON public.judge FOR INSERT TO authenticated WITH CHECK (true);


-- Policies for public.profile
-- Total: 3 policies

-- SELECT policies
CREATE POLICY "Allow users to select their own profile" ON public.profile FOR SELECT TO authenticated USING ((( SELECT auth.uid() AS uid) = id));

CREATE POLICY "Enable read access for all users" ON public.profile FOR SELECT TO authenticated USING (true);


-- UPDATE policies
CREATE POLICY "Allow users to update their own profile" ON public.profile FOR UPDATE TO authenticated USING ((( SELECT auth.uid() AS uid) = id)) WITH CHECK ((( SELECT auth.uid() AS uid) = id));


-- Policies for public.school
-- Total: 2 policies

-- SELECT policies
CREATE POLICY "Enable read access for all users" ON public.school FOR SELECT TO authenticated USING (true);


-- INSERT policies
CREATE POLICY "Allow authenticated users to insert school" ON public.school FOR INSERT TO authenticated WITH CHECK (true);


-- Policies for public.student
-- Total: 2 policies

-- SELECT policies
CREATE POLICY "Enable read access for all users" ON public.student FOR SELECT TO authenticated USING (true);


-- INSERT policies
CREATE POLICY "Enable insert for authenticated users only" ON public.student FOR INSERT TO authenticated WITH CHECK (true);


-- Policies for public.team
-- Total: 4 policies

-- SELECT policies
CREATE POLICY "Enable read access for all users" ON public.team FOR SELECT TO authenticated USING (true);


-- INSERT policies
CREATE POLICY "Enable insert for authenticated users only" ON public.team FOR INSERT TO authenticated WITH CHECK (true);


-- UPDATE policies
CREATE POLICY "Policy with table joins" ON public.team FOR UPDATE USING (true);


-- DELETE policies
CREATE POLICY "Enable delete for users based on user_id" ON public.team FOR DELETE TO authenticated USING (true);


-- Policies for public.team_member
-- Total: 4 policies

-- SELECT policies
CREATE POLICY "Enable read access for all users" ON public.team_member FOR SELECT TO authenticated USING (true);


-- INSERT policies
CREATE POLICY "Enable insert for users based on user_id" ON public.team_member FOR INSERT WITH CHECK (((status = 'PENDING'::public.status) OR (( SELECT auth.uid() AS uid) = student_id)));


-- UPDATE policies
CREATE POLICY "Enable update for users based on email" ON public.team_member FOR UPDATE USING (true);


-- DELETE policies
CREATE POLICY "Enable delete for users based on user_id" ON public.team_member FOR DELETE USING (true);


-- Policies for storage.objects
-- Total: 8 policies

-- SELECT policies
CREATE POLICY "Give anon users access to JPG images in folder g2sb1v_0" ON storage.objects FOR SELECT USING (((bucket_id = 'team-assets'::text) AND (lower((storage.foldername(name))[1]) = 'public'::text) AND (auth.role() = 'anon'::text)));

CREATE POLICY "Give users access to their own folder vejz8c_0" ON storage.objects FOR SELECT USING (((bucket_id = 'profile-images'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));


-- INSERT policies
CREATE POLICY "Give users access to own folder g2sb1v_1" ON storage.objects FOR INSERT WITH CHECK (((bucket_id = 'team-assets'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));

CREATE POLICY "Give users access to own folder vejz8c_0" ON storage.objects FOR INSERT WITH CHECK (((bucket_id = 'profile-images'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));


-- UPDATE policies
CREATE POLICY "Give users access to own folder g2sb1v_0" ON storage.objects FOR UPDATE USING (((bucket_id = 'team-assets'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));

CREATE POLICY "Give users access to own folder vejz8c_1" ON storage.objects FOR UPDATE USING (((bucket_id = 'profile-images'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));


-- DELETE policies
CREATE POLICY "Give users access to delete their own file vejz8c_0" ON storage.objects FOR DELETE USING (((bucket_id = 'profile-images'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));

CREATE POLICY "Give users access to own folder g2sb1v_2" ON storage.objects FOR DELETE USING (((bucket_id = 'team-assets'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));
