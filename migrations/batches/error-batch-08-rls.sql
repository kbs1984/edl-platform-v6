-- =============================================
-- Batch 08: Row Level Security (RLS)
-- Session 00052
-- Purpose: Enable RLS and create security policies
-- Dependencies: Batches 03-05 (tables and functions)
-- Total: 19 tables, 42 policies
-- =============================================

BEGIN;

-- =============================================
-- ENABLE ROW LEVEL SECURITY
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
-- SECURITY POLICIES
-- =============================================

-- PUBLIC schema policies (22 policies)
-- =============================================

-- Policy from line 14990
CREATE POLICY "Allow authenticated users to insert school" ON public.school FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: friendship Allow insert on friendship; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow insert on friendship" ON public.friendship FOR INSERT TO authenticated WITH CHECK (true);

-- Policy from line 14997
CREATE POLICY "Allow insert on friendship" ON public.friendship FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: friendship Allow select on friendship; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow select on friendship" ON public.friendship FOR SELECT TO authenticated USING (((user_id = auth.uid()) OR (friend_id = auth.uid())));

-- Policy from line 15004
CREATE POLICY "Allow select on friendship" ON public.friendship FOR SELECT TO authenticated USING (((user_id = auth.uid()) OR (friend_id = auth.uid())));


--
-- Name: friendship Allow update on friendship; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow update on friendship" ON public.friendship FOR UPDATE TO authenticated USING (((user_id = auth.uid()) OR (friend_id = auth.uid()))) WITH CHECK (((user_id = auth.uid()) OR ((friend_id = auth.uid()) AND (status = ANY (ARRAY['ACCEPTED'::public.status, 'REJECTED'::public.status])))));

-- Policy from line 15011
CREATE POLICY "Allow update on friendship" ON public.friendship FOR UPDATE TO authenticated USING (((user_id = auth.uid()) OR (friend_id = auth.uid()))) WITH CHECK (((user_id = auth.uid()) OR ((friend_id = auth.uid()) AND (status = ANY (ARRAY['ACCEPTED'::public.status, 'REJECTED'::public.status])))));


--
-- Name: profile Allow users to select their own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow users to select their own profile" ON public.profile FOR SELECT TO authenticated USING ((( SELECT auth.uid() AS uid) = id));

-- Policy from line 15018
CREATE POLICY "Allow users to select their own profile" ON public.profile FOR SELECT TO authenticated USING ((( SELECT auth.uid() AS uid) = id));


--
-- Name: profile Allow users to update their own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow users to update their own profile" ON public.profile FOR UPDATE TO authenticated USING ((( SELECT auth.uid() AS uid) = id)) WITH CHECK ((( SELECT auth.uid() AS uid) = id));

-- Policy from line 15025
CREATE POLICY "Allow users to update their own profile" ON public.profile FOR UPDATE TO authenticated USING ((( SELECT auth.uid() AS uid) = id)) WITH CHECK ((( SELECT auth.uid() AS uid) = id));


--
-- Name: team Enable delete for users based on user_id; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable delete for users based on user_id" ON public.team FOR DELETE TO authenticated USING (true);

-- Policy from line 15032
CREATE POLICY "Enable delete for users based on user_id" ON public.team FOR DELETE TO authenticated USING (true);


--
-- Name: team_member Enable delete for users based on user_id; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable delete for users based on user_id" ON public.team_member FOR DELETE USING (true);

-- Policy from line 15039
CREATE POLICY "Enable delete for users based on user_id" ON public.team_member FOR DELETE USING (true);


--
-- Name: guardian Enable insert for authenticated users only; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable insert for authenticated users only" ON public.guardian FOR INSERT TO authenticated WITH CHECK (true);

-- Policy from line 15046
CREATE POLICY "Enable insert for authenticated users only" ON public.guardian FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: judge Enable insert for authenticated users only; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable insert for authenticated users only" ON public.judge FOR INSERT TO authenticated WITH CHECK (true);

-- Policy from line 15053
CREATE POLICY "Enable insert for authenticated users only" ON public.judge FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: student Enable insert for authenticated users only; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable insert for authenticated users only" ON public.student FOR INSERT TO authenticated WITH CHECK (true);

-- Policy from line 15060
CREATE POLICY "Enable insert for authenticated users only" ON public.student FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: team Enable insert for authenticated users only; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable insert for authenticated users only" ON public.team FOR INSERT TO authenticated WITH CHECK (true);

-- Policy from line 15067
CREATE POLICY "Enable insert for authenticated users only" ON public.team FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: team_member Enable insert for users based on user_id; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable insert for users based on user_id" ON public.team_member FOR INSERT WITH CHECK (((status = 'PENDING'::public.status) OR (( SELECT auth.uid() AS uid) = student_id)));

-- Policy from line 15074
CREATE POLICY "Enable insert for users based on user_id" ON public.team_member FOR INSERT WITH CHECK (((status = 'PENDING'::public.status) OR (( SELECT auth.uid() AS uid) = student_id)));


--
-- Name: guardian Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON public.guardian FOR SELECT USING (true);

-- Policy from line 15081
CREATE POLICY "Enable read access for all users" ON public.guardian FOR SELECT USING (true);


--
-- Name: profile Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON public.profile FOR SELECT TO authenticated USING (true);

-- Policy from line 15088
CREATE POLICY "Enable read access for all users" ON public.profile FOR SELECT TO authenticated USING (true);


--
-- Name: school Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON public.school FOR SELECT TO authenticated USING (true);

-- Policy from line 15095
CREATE POLICY "Enable read access for all users" ON public.school FOR SELECT TO authenticated USING (true);


--
-- Name: student Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON public.student FOR SELECT TO authenticated USING (true);

-- Policy from line 15102
CREATE POLICY "Enable read access for all users" ON public.student FOR SELECT TO authenticated USING (true);


--
-- Name: team Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON public.team FOR SELECT TO authenticated USING (true);

-- Policy from line 15109
CREATE POLICY "Enable read access for all users" ON public.team FOR SELECT TO authenticated USING (true);


--
-- Name: team_member Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON public.team_member FOR SELECT TO authenticated USING (true);

-- Policy from line 15116
CREATE POLICY "Enable read access for all users" ON public.team_member FOR SELECT TO authenticated USING (true);


--
-- Name: team_member Enable update for users based on email; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable update for users based on email" ON public.team_member FOR UPDATE USING (true);

-- Policy from line 15123
CREATE POLICY "Enable update for users based on email" ON public.team_member FOR UPDATE USING (true);


--
-- Name: team Policy with table joins; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Policy with table joins" ON public.team FOR UPDATE USING (true);

-- Policy from line 15130
CREATE POLICY "Policy with table joins" ON public.team FOR UPDATE USING (true);


--
-- Name: friendship; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.friendship ENABLE ROW LEVEL SECURITY;

-- Policy from line 15191
CREATE POLICY update_student_policy ON public.student FOR UPDATE TO authenticated USING ((user_id = auth.uid()));


--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

-- CHAT schema policies (11 policies)
-- =============================================

-- Policy from line 14776
CREATE POLICY "Enable insert for users based on user_id" ON chat.participant FOR INSERT WITH CHECK ((( SELECT auth.uid() AS uid) = student_id));


--
-- Name: participant Enable users to view their own data only; Type: POLICY; Schema: chat; Owner: postgres
--

CREATE POLICY "Enable users to view their own data only" ON chat.participant FOR SELECT TO authenticated USING (true);

-- Policy from line 14783
CREATE POLICY "Enable users to view their own data only" ON chat.participant FOR SELECT TO authenticated USING (true);


--
-- Name: message delete_message; Type: POLICY; Schema: chat; Owner: postgres
--

CREATE POLICY delete_message ON chat.message FOR DELETE USING (((sender_id = auth.uid()) OR (auth.role() = 'admin'::text)));

-- Policy from line 14790
CREATE POLICY delete_message ON chat.message FOR DELETE USING (((sender_id = auth.uid()) OR (auth.role() = 'admin'::text)));


--
-- Name: participant delete_participant; Type: POLICY; Schema: chat; Owner: postgres
--

CREATE POLICY delete_participant ON chat.participant FOR DELETE USING ((student_id = auth.uid()));

-- Policy from line 14797
CREATE POLICY delete_participant ON chat.participant FOR DELETE USING ((student_id = auth.uid()));


--
-- Name: room delete_room; Type: POLICY; Schema: chat; Owner: postgres
--

CREATE POLICY delete_room ON chat.room FOR DELETE USING ((EXISTS ( SELECT 1
   FROM chat.participant p
  WHERE ((p.room_id = room.id) AND (p.student_id = auth.uid())))));

-- Policy from line 14804
CREATE POLICY delete_room ON chat.room FOR DELETE USING ((EXISTS ( SELECT 1
   FROM chat.participant p
  WHERE ((p.room_id = room.id) AND (p.student_id = auth.uid())))));

-- Policy from line 14813
CREATE POLICY insert_message ON chat.message FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM chat.participant p
  WHERE ((p.room_id = message.room_id) AND (p.student_id = auth.uid())))));

-- Policy from line 14840
CREATE POLICY select_message ON chat.message FOR SELECT USING ((EXISTS ( SELECT 1
   FROM chat.participant p
  WHERE ((p.room_id = message.room_id) AND (p.student_id = auth.uid())))));

-- Policy from line 14849
CREATE POLICY select_room ON chat.room FOR SELECT USING (chat.is_room_member(id, auth.uid()));


--
-- Name: message update_message; Type: POLICY; Schema: chat; Owner: postgres
--

CREATE POLICY update_message ON chat.message FOR UPDATE USING (((sender_id = auth.uid()) OR (auth.role() = 'admin'::text)));

-- Policy from line 14856
CREATE POLICY update_message ON chat.message FOR UPDATE USING (((sender_id = auth.uid()) OR (auth.role() = 'admin'::text)));


--
-- Name: participant update_participant; Type: POLICY; Schema: chat; Owner: postgres
--

CREATE POLICY update_participant ON chat.participant FOR UPDATE USING ((student_id = auth.uid()));

-- Policy from line 14863
CREATE POLICY update_participant ON chat.participant FOR UPDATE USING ((student_id = auth.uid()));


--
-- Name: room update_room; Type: POLICY; Schema: chat; Owner: postgres
--

CREATE POLICY update_room ON chat.room FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM chat.participant p
  WHERE ((p.room_id = room.id) AND (p.student_id = auth.uid())))));

-- Policy from line 14870
CREATE POLICY update_room ON chat.room FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM chat.participant p
  WHERE ((p.room_id = room.id) AND (p.student_id = auth.uid())))));

-- DEBATE schema policies (9 policies)
-- =============================================

-- Policy from line 14879
CREATE POLICY "Enable insert for authenticated users only" ON debate.genres FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: criteria Enable read access for all users; Type: POLICY; Schema: debate; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON debate.criteria FOR SELECT USING (true);

-- Policy from line 14886
CREATE POLICY "Enable read access for all users" ON debate.criteria FOR SELECT USING (true);


--
-- Name: debate_formats Enable read access for all users; Type: POLICY; Schema: debate; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON debate.debate_formats FOR SELECT USING (true);

-- Policy from line 14893
CREATE POLICY "Enable read access for all users" ON debate.debate_formats FOR SELECT USING (true);


--
-- Name: format_rounds Enable read access for all users; Type: POLICY; Schema: debate; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON debate.format_rounds FOR SELECT USING (true);

-- Policy from line 14900
CREATE POLICY "Enable read access for all users" ON debate.format_rounds FOR SELECT USING (true);


--
-- Name: genres Enable read access for all users; Type: POLICY; Schema: debate; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON debate.genres FOR SELECT USING (true);

-- Policy from line 14907
CREATE POLICY "Enable read access for all users" ON debate.genres FOR SELECT USING (true);


--
-- Name: round_templates Enable read access for all users; Type: POLICY; Schema: debate; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON debate.round_templates FOR SELECT USING (true);

-- Policy from line 14914
CREATE POLICY "Enable read access for all users" ON debate.round_templates FOR SELECT USING (true);


--
-- Name: sides Enable read access for all users; Type: POLICY; Schema: debate; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON debate.sides FOR SELECT USING (true);

-- Policy from line 14921
CREATE POLICY "Enable read access for all users" ON debate.sides FOR SELECT USING (true);


--
-- Name: ballots Judges can manage their own ballots; Type: POLICY; Schema: debate; Owner: postgres
--

CREATE POLICY "Judges can manage their own ballots" ON debate.ballots USING ((judge_id IN ( SELECT judge.id
   FROM public.judge
  WHERE (judge.user_id = auth.uid()))));

-- Policy from line 14928
CREATE POLICY "Judges can manage their own ballots" ON debate.ballots USING ((judge_id IN ( SELECT judge.id
   FROM public.judge
  WHERE (judge.user_id = auth.uid()))));

-- Policy from line 14937
CREATE POLICY "Participants can view ballots for their debates" ON debate.ballots FOR SELECT USING ((debate_id IN ( SELECT dt.debate_id
   FROM ((debate.debate_teams dt
     JOIN debate.debate_participants dp ON ((dp.debate_team_id = dt.id)))
     JOIN public.student s ON ((dp.user_id = s.user_id)))
  WHERE (s.user_id = auth.uid()))));

-- =============================================
-- VERIFICATION QUERIES
-- =============================================
-- Check RLS enabled:
-- SELECT schemaname, tablename, rowsecurity 
-- FROM pg_tables 
-- WHERE schemaname IN ('public', 'chat', 'debate')
-- AND rowsecurity = true;
-- Expected: 19 tables

-- Check policies:
-- SELECT schemaname, tablename, COUNT(*) as policy_count
-- FROM pg_policies
-- WHERE schemaname IN ('public', 'chat', 'debate')
-- GROUP BY schemaname, tablename
-- ORDER BY schemaname, tablename;
-- Expected: 42 total policies

COMMIT;
