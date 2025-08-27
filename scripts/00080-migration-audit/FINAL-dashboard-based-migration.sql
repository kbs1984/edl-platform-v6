-- ============================================
-- Session 00080 - FINAL RLS Migration from Source Dashboard
-- Generated: 2025-08-26
-- Source: Actual Supabase Dashboard (not backup file)
-- Purpose: Ensure our project matches source project exactly
-- ============================================

-- CRITICAL DIFFERENCES FOUND:
-- 1. Many tables show "Disable RLS" button = RLS is ENABLED
-- 2. Student table has UPDATE policy not in backup
-- 3. Some tables have RLS disabled (warnings about public access)

-- ============================================
-- PHASE 1: Drop ALL existing policies to start clean
-- ============================================

-- Profile table (critical for auth)
DROP POLICY IF EXISTS "Allow users to select their own profile" ON public.profile CASCADE;
DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.profile CASCADE;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profile CASCADE;
DROP POLICY IF EXISTS "profile_insert_authenticated" ON public.profile CASCADE; -- The problematic one

-- Student table
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.student CASCADE;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.student CASCADE;
DROP POLICY IF EXISTS "update_student_policy" ON public.student CASCADE;

-- Guardian table
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.guardian CASCADE;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.guardian CASCADE;

-- Judge table  
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.judge CASCADE;

-- School table
DROP POLICY IF EXISTS "Allow authenticated users to insert school" ON public.school CASCADE;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.school CASCADE;

-- Team table
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.team CASCADE;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.team CASCADE;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.team CASCADE;
DROP POLICY IF EXISTS "Policy with table joins" ON public.team CASCADE;

-- Team member table
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.team_member CASCADE;
DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON public.team_member CASCADE;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.team_member CASCADE;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.team_member CASCADE;

-- Friendship table
DROP POLICY IF EXISTS "Allow insert on friendship" ON public.friendship CASCADE;
DROP POLICY IF EXISTS "Allow select on friendship" ON public.friendship CASCADE;
DROP POLICY IF EXISTS "Allow update on friendship" ON public.friendship CASCADE;

-- Storage objects (if we can modify)
DROP POLICY IF EXISTS "Give anon users access to JPG images in folder g2sb1v_0" ON storage.objects CASCADE;
DROP POLICY IF EXISTS "Give users access to delete their own file vejz8c_0" ON storage.objects CASCADE;
DROP POLICY IF EXISTS "Give users access to own folder g2sb1v_0" ON storage.objects CASCADE;
DROP POLICY IF EXISTS "Give users access to own folder g2sb1v_1" ON storage.objects CASCADE;
DROP POLICY IF EXISTS "Give users access to own folder g2sb1v_2" ON storage.objects CASCADE;
DROP POLICY IF EXISTS "Give users access to own folder vejz8c_0" ON storage.objects CASCADE;
DROP POLICY IF EXISTS "Give users access to own folder vejz8c_1" ON storage.objects CASCADE;
DROP POLICY IF EXISTS "Give users access to their own folder vejz8c_0" ON storage.objects CASCADE;

-- ============================================
-- PHASE 2: Set RLS status to match source
-- ============================================

-- Tables with RLS ENABLED (shows "Disable RLS" in dashboard)
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guardian ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.judge ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_member ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friendship ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guardian_request ENABLE ROW LEVEL SECURITY;

-- Tables with RLS DISABLED (shows warning in dashboard)
ALTER TABLE public.admin DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_account DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.guild DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.guild_member DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitation DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.log DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.rating DISABLE ROW LEVEL SECURITY;

-- ============================================
-- PHASE 3: Create policies exactly as shown in dashboard
-- ============================================

-- PROFILE TABLE (3 policies, NO INSERT!)
CREATE POLICY "Allow users to select their own profile" 
ON public.profile 
FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

CREATE POLICY "Allow users to update their own profile" 
ON public.profile 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable read access for all users" 
ON public.profile 
FOR SELECT 
TO authenticated 
USING (true);

-- STUDENT TABLE (3 policies including UPDATE)
CREATE POLICY "Enable insert for authenticated users only" 
ON public.student 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Enable read access for all users" 
ON public.student 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "update_student_policy" 
ON public.student 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- GUARDIAN TABLE (2 policies)
CREATE POLICY "Enable insert for authenticated users only" 
ON public.guardian 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Enable read access for all users" 
ON public.guardian 
FOR SELECT 
TO public 
USING (true);

-- JUDGE TABLE (1 policy)
CREATE POLICY "Enable insert for authenticated users only" 
ON public.judge 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- SCHOOL TABLE (2 policies)
CREATE POLICY "Allow authenticated users to insert school" 
ON public.school 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Enable read access for all users" 
ON public.school 
FOR SELECT 
TO authenticated 
USING (true);

-- TEAM TABLE (4 policies)
CREATE POLICY "Enable delete for users based on user_id" 
ON public.team 
FOR DELETE 
TO authenticated 
USING (true);

CREATE POLICY "Enable insert for authenticated users only" 
ON public.team 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Enable read access for all users" 
ON public.team 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Policy with table joins" 
ON public.team 
FOR UPDATE 
TO public 
USING (true)
WITH CHECK (true);

-- TEAM_MEMBER TABLE (4 policies)
CREATE POLICY "Enable delete for users based on user_id" 
ON public.team_member 
FOR DELETE 
TO public 
USING (true);

CREATE POLICY "Enable insert for users based on user_id" 
ON public.team_member 
FOR INSERT 
TO public 
WITH CHECK ((status = 'PENDING'::public.status) OR (auth.uid() = student_id));

CREATE POLICY "Enable read access for all users" 
ON public.team_member 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Enable update for users based on email" 
ON public.team_member 
FOR UPDATE 
TO public 
USING (true)
WITH CHECK (true);

-- FRIENDSHIP TABLE (3 policies)
CREATE POLICY "Allow insert on friendship" 
ON public.friendship 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow select on friendship" 
ON public.friendship 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow update on friendship" 
ON public.friendship 
FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

-- ============================================
-- STORAGE OBJECTS (if accessible)
-- ============================================
-- Note: These might fail if storage schema is locked

CREATE POLICY "Give anon users access to JPG images in folder g2sb1v_0" 
ON storage.objects 
FOR SELECT 
TO public 
USING ((bucket_id = 'debate_materials') AND (storage.extension(name) = 'jpg'));

CREATE POLICY "Give users access to delete their own file vejz8c_0" 
ON storage.objects 
FOR DELETE 
TO public 
USING ((bucket_id = 'profile-images') AND (auth.uid()::text = (storage.foldername(name))[1]));

CREATE POLICY "Give users access to own folder g2sb1v_0" 
ON storage.objects 
FOR UPDATE 
TO public 
USING (bucket_id = 'debate_materials');

CREATE POLICY "Give users access to own folder g2sb1v_1" 
ON storage.objects 
FOR INSERT 
TO public 
WITH CHECK (bucket_id = 'debate_materials');

CREATE POLICY "Give users access to own folder g2sb1v_2" 
ON storage.objects 
FOR DELETE 
TO public 
USING (bucket_id = 'debate_materials');

CREATE POLICY "Give users access to own folder vejz8c_0" 
ON storage.objects 
FOR INSERT 
TO public 
WITH CHECK ((bucket_id = 'profile-images') AND (auth.uid()::text = (storage.foldername(name))[1]));

CREATE POLICY "Give users access to own folder vejz8c_1" 
ON storage.objects 
FOR UPDATE 
TO public 
USING ((bucket_id = 'profile-images') AND (auth.uid()::text = (storage.foldername(name))[1]));

CREATE POLICY "Give users access to their own folder vejz8c_0" 
ON storage.objects 
FOR SELECT 
TO public 
USING ((bucket_id = 'profile-images') AND (auth.uid()::text = (storage.foldername(name))[1]));

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- After running this, verify in your project dashboard:
-- 1. Profile table: Should have 3 policies (2 SELECT, 1 UPDATE, 0 INSERT)
-- 2. Student table: Should have 3 policies (SELECT, INSERT, UPDATE)
-- 3. Guardian request: Should have RLS enabled but no policies
-- 4. Admin, guild, etc: Should have RLS DISABLED (publicly accessible)

-- Test query to verify profile policies:
-- SELECT * FROM pg_policies WHERE tablename = 'profile';

-- Test auth flow:
-- 1. Sign up new user at http://localhost:3000/sign-up
-- 2. Profile should be created by trigger
-- 3. User should be able to access dashboard