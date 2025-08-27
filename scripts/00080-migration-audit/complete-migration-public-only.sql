-- ============================================
-- Session 00080 - RLS Policy Migration Script (Public Schema Focus)
-- Generated: 2025-08-26
-- Purpose: Reconcile policies we have permissions to modify
-- ============================================
--
-- NOTE: This excludes auth.* and realtime.* schemas which require superuser
-- Those are managed by Supabase and shouldn't need manual intervention
--
-- WHAT THIS SCRIPT DOES:
-- 1. Drops all policies on public, chat, debate, and storage schemas
-- 2. Recreates them exactly as they appear in the backup file
-- 3. Ensures RLS is enabled on all tables that have it in backup

-- ============================================
-- PHASE 1: Drop existing policies (public schema)
-- ============================================

-- Drop policies for public.profile (THE CRITICAL ONE)
DROP POLICY IF EXISTS "Allow users to select their own profile" ON public.profile;
DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.profile;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profile;
DROP POLICY IF EXISTS "profile_insert_authenticated" ON public.profile; -- The problematic one

-- Drop policies for public.student
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.student;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.student;

-- Drop policies for public.guardian
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.guardian;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.guardian;

-- Drop policies for public.judge
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.judge;

-- Drop policies for public.school
DROP POLICY IF EXISTS "Allow authenticated users to insert school" ON public.school;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.school;

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

-- Drop policies for public.friendship
DROP POLICY IF EXISTS "Allow insert on friendship" ON public.friendship;
DROP POLICY IF EXISTS "Allow select on friendship" ON public.friendship;
DROP POLICY IF EXISTS "Allow update on friendship" ON public.friendship;

-- ============================================
-- PHASE 2: Drop existing policies (chat schema)
-- ============================================

DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON chat.participant;
DROP POLICY IF EXISTS "Enable users to view their own data only" ON chat.participant;

-- ============================================
-- PHASE 3: Drop existing policies (debate schema)
-- ============================================

DROP POLICY IF EXISTS "Judges can manage their own ballots" ON debate.ballots;
DROP POLICY IF EXISTS "Participants can view ballots for their debates" ON debate.ballots;
DROP POLICY IF EXISTS "Enable read access for all users" ON debate.criteria;
DROP POLICY IF EXISTS "Enable read access for all users" ON debate.debate_formats;
DROP POLICY IF EXISTS "Enable read access for all users" ON debate.format_rounds;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON debate.genres;
DROP POLICY IF EXISTS "Enable read access for all users" ON debate.genres;
DROP POLICY IF EXISTS "Enable read access for all users" ON debate.round_templates;
DROP POLICY IF EXISTS "Enable read access for all users" ON debate.sides;

-- ============================================
-- PHASE 4: Drop existing policies (storage schema)
-- ============================================

DROP POLICY IF EXISTS "Give anon users access to JPG images in folder g2sb1v_0" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to delete their own file vejz8c_0" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to own folder g2sb1v_0" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to own folder g2sb1v_1" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to own folder g2sb1v_2" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to own folder vejz8c_0" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to own folder vejz8c_1" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to their own folder vejz8c_0" ON storage.objects;

-- ============================================
-- PHASE 5: Enable RLS on tables we control
-- ============================================

-- Public schema
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guardian ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guardian_request ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.judge ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_member ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friendship ENABLE ROW LEVEL SECURITY;

-- Chat schema
ALTER TABLE chat.message ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat.participant ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat.room ENABLE ROW LEVEL SECURITY;

-- Debate schema  
ALTER TABLE debate.ballots ENABLE ROW LEVEL SECURITY;
ALTER TABLE debate.criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE debate.debate_formats ENABLE ROW LEVEL SECURITY;
ALTER TABLE debate.format_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE debate.genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE debate.round_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE debate.sides ENABLE ROW LEVEL SECURITY;

-- Storage schema
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PHASE 6: Create policies from backup (public.profile FIRST)
-- ============================================

-- CRITICAL: Profile table gets ONLY these 3 policies (NO INSERT!)
CREATE POLICY "Allow users to select their own profile" 
ON public.profile 
FOR SELECT TO authenticated 
USING ((( SELECT auth.uid() AS uid) = id));

CREATE POLICY "Enable read access for all users" 
ON public.profile 
FOR SELECT TO authenticated 
USING (true);

CREATE POLICY "Allow users to update their own profile" 
ON public.profile 
FOR UPDATE TO authenticated 
USING ((( SELECT auth.uid() AS uid) = id)) 
WITH CHECK ((( SELECT auth.uid() AS uid) = id));

-- ============================================
-- PHASE 7: Create remaining public schema policies
-- ============================================

-- Student policies
CREATE POLICY "Enable read access for all users" 
ON public.student 
FOR SELECT TO authenticated 
USING (true);

CREATE POLICY "Enable insert for authenticated users only" 
ON public.student 
FOR INSERT TO authenticated 
WITH CHECK (true);

-- Guardian policies
CREATE POLICY "Enable read access for all users" 
ON public.guardian 
FOR SELECT TO authenticated 
USING (true);

CREATE POLICY "Enable insert for authenticated users only" 
ON public.guardian 
FOR INSERT TO authenticated 
WITH CHECK (true);

-- Judge policies
CREATE POLICY "Enable insert for authenticated users only" 
ON public.judge 
FOR INSERT TO authenticated 
WITH CHECK (true);

-- School policies
CREATE POLICY "Enable read access for all users" 
ON public.school 
FOR SELECT TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated users to insert school" 
ON public.school 
FOR INSERT TO authenticated 
WITH CHECK (true);

-- Team policies
CREATE POLICY "Enable read access for all users" 
ON public.team 
FOR SELECT TO authenticated 
USING (true);

CREATE POLICY "Enable insert for authenticated users only" 
ON public.team 
FOR INSERT TO authenticated 
WITH CHECK (true);

CREATE POLICY "Enable delete for users based on user_id" 
ON public.team 
FOR DELETE TO authenticated 
USING ((( SELECT auth.uid() AS uid) = created_by));

CREATE POLICY "Policy with table joins" 
ON public.team 
FOR UPDATE TO authenticated 
USING ((EXISTS ( SELECT 1
   FROM public.team_member tm
  WHERE ((tm.team_id = team.id) AND (tm.user_id = ( SELECT auth.uid() AS uid)) AND ((tm.role = 'owner'::text) OR (tm.role = 'admin'::text)))))) 
WITH CHECK ((EXISTS ( SELECT 1
   FROM public.team_member tm
  WHERE ((tm.team_id = team.id) AND (tm.user_id = ( SELECT auth.uid() AS uid)) AND ((tm.role = 'owner'::text) OR (tm.role = 'admin'::text))))));

-- Team member policies
CREATE POLICY "Enable read access for all users" 
ON public.team_member 
FOR SELECT TO authenticated 
USING (true);

CREATE POLICY "Enable insert for users based on user_id" 
ON public.team_member 
FOR INSERT TO authenticated 
WITH CHECK ((( SELECT auth.uid() AS uid) = user_id));

CREATE POLICY "Enable delete for users based on user_id" 
ON public.team_member 
FOR DELETE TO authenticated 
USING ((( SELECT auth.uid() AS uid) = user_id));

CREATE POLICY "Enable update for users based on email" 
ON public.team_member 
FOR UPDATE TO authenticated 
USING (true) 
WITH CHECK (true);

-- Friendship policies
CREATE POLICY "Allow select on friendship" 
ON public.friendship 
FOR SELECT TO authenticated 
USING (true);

CREATE POLICY "Allow insert on friendship" 
ON public.friendship 
FOR INSERT TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow update on friendship" 
ON public.friendship 
FOR UPDATE TO authenticated 
USING (true) 
WITH CHECK (true);

-- ============================================
-- PHASE 8: Create chat schema policies
-- ============================================

CREATE POLICY "Enable users to view their own data only" 
ON chat.participant 
FOR SELECT TO authenticated 
USING ((( SELECT auth.uid() AS uid) = user_id));

CREATE POLICY "Enable insert for users based on user_id" 
ON chat.participant 
FOR INSERT TO authenticated 
WITH CHECK ((( SELECT auth.uid() AS uid) = user_id));

-- ============================================
-- PHASE 9: Create debate schema policies
-- ============================================

CREATE POLICY "Enable read access for all users" 
ON debate.criteria 
FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" 
ON debate.debate_formats 
FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" 
ON debate.format_rounds 
FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" 
ON debate.genres 
FOR SELECT TO authenticated 
USING (true);

CREATE POLICY "Enable insert for authenticated users only" 
ON debate.genres 
FOR INSERT TO authenticated 
WITH CHECK (true);

CREATE POLICY "Enable read access for all users" 
ON debate.round_templates 
FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" 
ON debate.sides 
FOR SELECT USING (true);

CREATE POLICY "Participants can view ballots for their debates" 
ON debate.ballots 
FOR SELECT USING (true);

CREATE POLICY "Judges can manage their own ballots" 
ON debate.ballots USING ((( SELECT auth.uid() AS uid) = judge_id)) 
WITH CHECK ((( SELECT auth.uid() AS uid) = judge_id));

-- ============================================
-- PHASE 10: Create storage policies
-- ============================================

CREATE POLICY "Give anon users access to JPG images in folder g2sb1v_0" 
ON storage.objects 
FOR SELECT TO anon 
USING (((bucket_id = 'debate_materials'::text) AND ((storage.extension(name))::text = 'jpg'::text)));

CREATE POLICY "Give users access to own folder g2sb1v_0" 
ON storage.objects 
FOR SELECT TO authenticated 
USING ((bucket_id = 'debate_materials'::text));

CREATE POLICY "Give users access to own folder g2sb1v_1" 
ON storage.objects 
FOR INSERT TO authenticated 
WITH CHECK ((bucket_id = 'debate_materials'::text));

CREATE POLICY "Give users access to own folder g2sb1v_2" 
ON storage.objects 
FOR UPDATE TO authenticated 
USING ((bucket_id = 'debate_materials'::text));

CREATE POLICY "Give users access to their own folder vejz8c_0" 
ON storage.objects 
FOR SELECT 
USING (((bucket_id = 'profile-images'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));

CREATE POLICY "Give users access to own folder vejz8c_0" 
ON storage.objects 
FOR INSERT 
WITH CHECK (((bucket_id = 'profile-images'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));

CREATE POLICY "Give users access to own folder vejz8c_1" 
ON storage.objects 
FOR UPDATE 
USING (((bucket_id = 'profile-images'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));

CREATE POLICY "Give users access to delete their own file vejz8c_0" 
ON storage.objects 
FOR DELETE 
USING (((bucket_id = 'profile-images'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- After running this script, verify with:
--
-- 1. Check profile policies:
-- SELECT * FROM pg_policies WHERE tablename = 'profile';
--
-- 2. Test signup flow at http://localhost:3000/sign-up
--
-- 3. Verify no INSERT policy on profile:
-- SELECT COUNT(*) FROM pg_policies 
-- WHERE tablename = 'profile' AND cmd = 'INSERT';
-- Should return 0
--
-- ============================================