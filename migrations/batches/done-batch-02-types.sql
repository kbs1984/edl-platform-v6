-- =============================================
-- Batch 02: Custom Types
-- Session 00050
-- Purpose: Create all custom ENUM types
-- Dependencies: Batch 01 (schemas must exist)
-- =============================================

-- Start transaction for safety
BEGIN;

-- =============================================
-- DEBATE SCHEMA TYPES
-- =============================================

-- Criteria grouping for debate evaluation
CREATE TYPE debate.criteria_group AS ENUM (
    'STYLE',
    'RESPECT', 
    'ANALYSIS'
);

-- Speech delivery mode
CREATE TYPE debate.speech_mode AS ENUM (
    'SYNC',
    'ASYNC'
);

-- =============================================
-- PUBLIC SCHEMA TYPES
-- =============================================

-- Debate ballot status tracking
CREATE TYPE public.debate_ballot_status_enum AS ENUM (
    'PENDING',
    'IN_PROGRESS',
    'COMPLETE'
);

-- Debate session status
CREATE TYPE public.debate_session_status AS ENUM (
    'SCHEDULED',
    'ONGOING',
    'COMPLETED',
    'CANCELLED'
);

-- Student division/grade categories
CREATE TYPE public.division AS ENUM (
    'VILLIGER',
    'LOWER',
    'UPPER',
    'SENIOR',
    'OPEN'
);

-- Gender options
CREATE TYPE public.gender AS ENUM (
    'MALE',
    'FEMALE',
    'do not wish to specify'
);

-- Group type for teams/guilds
CREATE TYPE public.group_type AS ENUM (
    'GUILD',
    'TEAM'
);

-- Activity log types
CREATE TYPE public.log_type AS ENUM (
    'REQUEST_JOIN',
    'JOINED',
    'LEFT',
    'INVITED',
    'KICKED',
    'UPDATED',
    'DELETED',
    'CREATED'
);

-- Payment provider options
CREATE TYPE public.payment_provider AS ENUM (
    'TOSS',
    'NAVER_PAY',
    'KAKAO_PAY'
);

-- Payment transaction states
CREATE TYPE public.payment_state AS ENUM (
    'REQUESTED',
    'PENDING',
    'FAILED',
    'COMPLETED',
    'AUTHORIZED',
    'ABANDONED',
    'REFUNDED',
    'PREAPPROVED'
);

-- General status enum
CREATE TYPE public.status AS ENUM (
    'PENDING',
    'ACCEPTED',
    'REJECTED',
    'EXPIRED',
    'CANCELLED'
);

-- User role types
CREATE TYPE public.user_role_type AS ENUM (
    'STUDENT',
    'JUDGE',
    'GUARDIAN'
);

-- =============================================
-- VERIFICATION QUERIES (Run these after commit)
-- =============================================
-- SELECT n.nspname as schema, t.typname as type_name 
-- FROM pg_type t 
-- JOIN pg_namespace n ON n.oid = t.typnamespace 
-- WHERE t.typtype = 'e' 
-- AND n.nspname IN ('public', 'debate', 'chat')
-- ORDER BY n.nspname, t.typname;
--
-- Expected: 12 custom types

COMMIT;

-- =============================================
-- Expected Results:
-- - 2 types in debate schema
-- - 10 types in public schema
-- - Total: 12 custom ENUM types
-- =============================================