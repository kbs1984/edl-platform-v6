---
session: "00051"
type: "migration-deployed"
status: "applied"
created: "2025-08-27"
title: "Deployed Migration: batch-03-tables"
purpose: "Applied database migration - 36 tables"
topics: ["database", "migration", "reality", "deployed"]
priority: "P0"
domain: "reality"
reality_type: "deployed-migration"
deployment_status: "production"
verified: true
---

-- =============================================
-- Batch 03: Base Tables (Structure Only)
-- Session 00050
-- Purpose: Create all 36 tables without foreign keys
-- Dependencies: Batch 01 (schemas), Batch 02 (types)
-- =============================================

BEGIN;

-- =============================================
-- TABLES WITHOUT FOREIGN KEY CONSTRAINTS
-- These will be added in Batch 04
-- =============================================

CREATE TABLE chat.message (

    id uuid NOT NULL DEFAULT gen_random_uuid(),
    room_id uuid NOT NULL,
    sender_id uuid NOT NULL,
    content text NOT NULL,
    is_system boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()

);

CREATE TABLE chat.participant (

    id uuid NOT NULL DEFAULT gen_random_uuid(),
    room_id uuid NOT NULL,
    student_id uuid NOT NULL,
    joined_at timestamp with time zone NOT NULL DEFAULT now(),
    last_read_at timestamp with time zone NOT NULL DEFAULT now()

);

CREATE TABLE chat.room (

    id uuid NOT NULL DEFAULT gen_random_uuid(),
    type text NOT NULL,
    title text,
    team_id uuid,
    guild_id uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()

);

CREATE TABLE debate.ballots (

    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    debate_id uuid NOT NULL,
    judge_id uuid NOT NULL,
    status public.debate_ballot_status_enum DEFAULT 'PENDING'::debate_ballot_status_enum,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    submitted_at timestamp with time zone,
    format_id uuid NOT NULL,
    version integer DEFAULT 1

);

CREATE TABLE debate.criteria (

    id uuid NOT NULL DEFAULT gen_random_uuid(),
    "group" debate.criteria_group NOT NULL,
    name text NOT NULL,
    criteria text NOT NULL,
    label text NOT NULL,
    format_id uuid

);

CREATE TABLE debate.debate_formats (

    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    type debate.speech_mode NOT NULL DEFAULT 'SYNC'::debate.speech_mode

);

CREATE TABLE debate.debate_participants (

    id uuid NOT NULL DEFAULT gen_random_uuid(),
    debate_team_id uuid NOT NULL,
    user_id uuid NOT NULL,
    invite_status public.status DEFAULT 'PENDING'::status,
    speaker_position smallint NOT NULL

);

CREATE TABLE debate.debate_teams (

    id uuid NOT NULL DEFAULT gen_random_uuid(),
    debate_id uuid NOT NULL,
    side_id uuid NOT NULL

);

CREATE TABLE debate.debates (

    id uuid NOT NULL DEFAULT gen_random_uuid(),
    debate_format_id uuid NOT NULL,
    motion_id uuid NOT NULL,
    scheduled_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    mode debate.speech_mode NOT NULL

);

CREATE TABLE debate.format_rounds (

    id uuid NOT NULL DEFAULT gen_random_uuid(),
    debate_format_id uuid NOT NULL,
    round_template_id uuid NOT NULL,
    sequence integer NOT NULL,
    side_id uuid NOT NULL,
    speaker_positions smallint[] NOT NULL,  -- Fixed from _int2[]
    number_of_speakers smallint NOT NULL

);

CREATE TABLE debate.genres (

    id uuid NOT NULL DEFAULT gen_random_uuid(),
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    title text NOT NULL,
    description text,
    proposer_id uuid NOT NULL

);

CREATE TABLE debate.judge_comments (

    id uuid NOT NULL DEFAULT gen_random_uuid(),
    video_id uuid NOT NULL,
    judge_id uuid NOT NULL,
    criteria_id uuid NOT NULL,
    at_seconds integer NOT NULL,
    comment text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now()

);

CREATE TABLE debate.judge_scores (

    id uuid NOT NULL DEFAULT gen_random_uuid(),
    debate_id uuid NOT NULL,
    judge_id uuid NOT NULL,
    criteria_id uuid NOT NULL,
    score numeric NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now()

);

CREATE TABLE debate.matchmaking_queue_entries (

    id uuid NOT NULL DEFAULT gen_random_uuid(),
    team_id uuid NOT NULL,
    debate_format_id uuid NOT NULL,
    league_id public.division NOT NULL,
    team_rank integer NOT NULL,
    challenge_mode_active boolean NOT NULL DEFAULT false,
    status public.debate_session_status NOT NULL,
    queued_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    debate_id uuid,
    opponent_id uuid

);

CREATE TABLE debate.motions (

    id uuid NOT NULL DEFAULT gen_random_uuid(),
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    topic text NOT NULL,
    genre_id uuid NOT NULL,
    details text,
    proposer_id uuid NOT NULL

);

CREATE TABLE debate.round_templates (

    id uuid NOT NULL DEFAULT gen_random_uuid(),
    code text NOT NULL,
    name text NOT NULL,
    default_time integer,
    description text NOT NULL

);

CREATE TABLE debate.sides (

    id uuid NOT NULL DEFAULT gen_random_uuid(),
    title text NOT NULL

);

CREATE TABLE debate.speeches (

    id uuid NOT NULL DEFAULT gen_random_uuid(),
    debate_id uuid NOT NULL,
    format_round_id uuid NOT NULL,
    participant_id uuid NOT NULL,
    content text,
    delivered_at timestamp with time zone DEFAULT now(),
    duration_seconds integer

);

CREATE TABLE debate.videos (

    id uuid NOT NULL DEFAULT gen_random_uuid(),
    debate_id uuid NOT NULL,
    storage_path text NOT NULL,
    url text NOT NULL,
    uploaded_by uuid NOT NULL,
    uploaded_at timestamp with time zone NOT NULL DEFAULT now()

);

CREATE TABLE public.admin (

    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE public.bank_account (

    id uuid NOT NULL DEFAULT gen_random_uuid(),
    active boolean NOT NULL,
    guardian_id uuid NOT NULL,
    name text NOT NULL,
    routing text NOT NULL,
    swift_code text NOT NULL,
    i_b_a_n text NOT NULL

);

CREATE TABLE public.friendship (

    id uuid NOT NULL DEFAULT gen_random_uuid(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    user_id uuid NOT NULL DEFAULT auth.uid(),
    friend_id uuid NOT NULL,
    status public.status NOT NULL DEFAULT 'PENDING'::status,
    accpted_at timestamp with time zone

);

CREATE TABLE public.guardian (

    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL DEFAULT auth.uid(),
    payment_method text,
    billing_address text

);

CREATE TABLE public.guardian_request (

    id uuid NOT NULL DEFAULT gen_random_uuid(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    status public.status DEFAULT 'PENDING'::status,
    updated_at timestamp without time zone NOT NULL,
    sender uuid,
    reciever uuid

);

CREATE TABLE public.guild (

    id uuid NOT NULL DEFAULT gen_random_uuid(),
    school_id uuid NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone NOT NULL,
    name text NOT NULL,
    requirement text NOT NULL,
    division public.division NOT NULL,
    image_path text NOT NULL,
    description text NOT NULL

);

CREATE TABLE public.guild_member (

    id uuid NOT NULL DEFAULT gen_random_uuid(),
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone NOT NULL,
    student_id uuid NOT NULL,
    guild_id uuid NOT NULL,
    join_date timestamp without time zone,
    is_leader boolean NOT NULL DEFAULT false,
    status public.status NOT NULL DEFAULT 'PENDING'::status

);

CREATE TABLE public.invitation (

    id uuid NOT NULL DEFAULT gen_random_uuid(),
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone NOT NULL,
    accepted_at timestamp without time zone,
    inviter_id uuid NOT NULL,
    invitee_id uuid NOT NULL,
    team_id uuid,
    guild_id uuid,
    status public.status NOT NULL DEFAULT 'PENDING'::status,
    expires_at timestamp without time zone,
    type public.group_type NOT NULL

);

CREATE TABLE public.judge (

    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL DEFAULT auth.uid(),
    job_title text NOT NULL,
    biography text NOT NULL,
    bank_account_info text,
    referral_user_id uuid

);

CREATE TABLE public.log (

    id uuid NOT NULL DEFAULT gen_random_uuid(),
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    log_type public.log_type NOT NULL,
    description text NOT NULL,
    guild_id uuid,
    team_id uuid,
    student_id uuid NOT NULL,
    type public.group_type NOT NULL

);

CREATE TABLE public.payment_history (

    id uuid NOT NULL DEFAULT gen_random_uuid(),
    guardian_id uuid NOT NULL,
    amount integer NOT NULL,
    currency_code text NOT NULL,
    payment_provider public.payment_provider NOT NULL,
    payment_date timestamp without time zone NOT NULL,
    payment_state public.payment_state NOT NULL

);

CREATE TABLE public.profile (

    id uuid NOT NULL DEFAULT auth.uid(),
    name text DEFAULT ''::text,
    username text,
    image_path text,
    date_of_birth date,
    gender public.gender,
    user_role public.user_role_type,
    active boolean NOT NULL DEFAULT false,
    term_agree_time timestamp with time zone,
    email text DEFAULT ''::text,
    invited boolean NOT NULL DEFAULT false

);

CREATE TABLE public.rating (

    id uuid NOT NULL DEFAULT gen_random_uuid(),
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    rate integer NOT NULL,
    judge_id uuid NOT NULL,
    rater_id uuid NOT NULL

);

CREATE TABLE public.school (

    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name text NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    updated_at timestamp without time zone NOT NULL DEFAULT now(),
    created_by uuid NOT NULL DEFAULT auth.uid()

);

CREATE TABLE public.student (

    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL DEFAULT auth.uid(),
    guardian_id uuid,
    school_id uuid,
    division public.division,
    location text NOT NULL,
    exp integer NOT NULL DEFAULT 0,
    ranking smallint NOT NULL DEFAULT '0'::smallint,
    challenge_enabled boolean NOT NULL DEFAULT false,
    graduation_year bigint NOT NULL,
    relationship_with_guardian text,
    level integer NOT NULL DEFAULT 0,
    call_sign text UNIQUE  -- EDL CUSTOMIZATION: Added for radio communication

);

CREATE TABLE public.team (

    id uuid NOT NULL DEFAULT gen_random_uuid(),
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    division public.division NOT NULL,
    image_path text NOT NULL

);

CREATE TABLE public.team_member (

    id uuid NOT NULL DEFAULT gen_random_uuid(),
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone NOT NULL,
    student_id uuid NOT NULL,
    team_id uuid NOT NULL,
    join_date timestamp without time zone,
    is_leader boolean NOT NULL DEFAULT false,
    status public.status NOT NULL DEFAULT 'PENDING'::status

);

-- =============================================
-- VERIFICATION QUERIES
-- =============================================
-- SELECT COUNT(*) FROM information_schema.tables 
-- WHERE table_schema IN ('public', 'chat', 'debate')
-- AND table_type = 'BASE TABLE';
-- Expected: 36 tables

COMMIT;
