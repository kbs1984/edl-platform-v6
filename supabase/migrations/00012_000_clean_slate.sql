-- Session 00012: Clean Slate Migration
-- Purpose: Remove ALL v5 tables and start fresh per handoff requirement
-- Created: 2025-08-16
-- WARNING: This will DELETE all existing data!

-- First, disable RLS on all tables (to ensure we can drop them)
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') 
    LOOP
        EXECUTE 'ALTER TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' DISABLE ROW LEVEL SECURITY';
    END LOOP;
END $$;

-- Drop all policies first (they prevent table drops)
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
    ) 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON ' || 
                quote_ident(r.schemaname) || '.' || quote_ident(r.tablename);
    END LOOP;
END $$;

-- Drop all tables in public schema
DROP TABLE IF EXISTS public.team_join_requests CASCADE;
DROP TABLE IF EXISTS public.team_members CASCADE;
DROP TABLE IF EXISTS public.teams CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.activities CASCADE;
DROP TABLE IF EXISTS public.activity_registrations CASCADE;
DROP TABLE IF EXISTS public.badges CASCADE;
DROP TABLE IF EXISTS public.badge_awards CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.subscriptions CASCADE;
DROP TABLE IF EXISTS public.sessions CASCADE;
DROP TABLE IF EXISTS public.debate_topics CASCADE;
DROP TABLE IF EXISTS public.debate_submissions CASCADE;
DROP TABLE IF EXISTS public.evaluations CASCADE;
DROP TABLE IF EXISTS public.performance_metrics CASCADE;

-- Drop any other v5 tables that might exist
DROP TABLE IF EXISTS public.user_profiles CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.team_invites CASCADE;
DROP TABLE IF EXISTS public.activity_sessions CASCADE;
DROP TABLE IF EXISTS public.emcoin_transactions CASCADE;
DROP TABLE IF EXISTS public.emcoin_wallets CASCADE;
DROP TABLE IF EXISTS public.achievement_progress CASCADE;
DROP TABLE IF EXISTS public.division_rankings CASCADE;

-- Drop all functions in public schema (v5 might have created some)
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (
        SELECT routine_name, routine_type 
        FROM information_schema.routines 
        WHERE routine_schema = 'public'
    ) 
    LOOP
        EXECUTE 'DROP ' || r.routine_type || ' IF EXISTS public.' || 
                quote_ident(r.routine_name) || ' CASCADE';
    END LOOP;
END $$;

-- Drop all triggers in public schema
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (
        SELECT trigger_name, event_object_table 
        FROM information_schema.triggers 
        WHERE trigger_schema = 'public'
    ) 
    LOOP
        EXECUTE 'DROP TRIGGER IF EXISTS ' || quote_ident(r.trigger_name) || 
                ' ON public.' || quote_ident(r.event_object_table) || ' CASCADE';
    END LOOP;
END $$;

-- Drop all views in public schema
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (
        SELECT table_name 
        FROM information_schema.views 
        WHERE table_schema = 'public'
    ) 
    LOOP
        EXECUTE 'DROP VIEW IF EXISTS public.' || quote_ident(r.table_name) || ' CASCADE';
    END LOOP;
END $$;

-- Clean up any sequences
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (
        SELECT sequence_name 
        FROM information_schema.sequences 
        WHERE sequence_schema = 'public'
    ) 
    LOOP
        EXECUTE 'DROP SEQUENCE IF EXISTS public.' || quote_ident(r.sequence_name) || ' CASCADE';
    END LOOP;
END $$;

-- Verification: List what remains (should be empty)
SELECT 'Tables remaining: ' || COUNT(*)::text as status
FROM pg_tables 
WHERE schemaname = 'public';

SELECT 'Functions remaining: ' || COUNT(*)::text as status
FROM information_schema.routines 
WHERE routine_schema = 'public';

SELECT 'Views remaining: ' || COUNT(*)::text as status
FROM information_schema.views 
WHERE table_schema = 'public';

-- Final confirmation
SELECT '✅ CLEAN SLATE ACHIEVED - Ready for fresh migration' as message;