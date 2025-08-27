-- =============================================
-- Supabase Schema Migration - CLEAN VERSION
-- Generated: 2025-08-22
-- Session: 00049
-- Project: EDL Platform Database Adoption
-- Source: truth-seed project (niyrthumgjmtkjgtlbnq) 
-- Target: edl-platform project (bbrheacetxlnqbibjwsz)
-- =============================================

-- Note: This migration assumes Supabase auth schema already exists
-- We only create our custom schemas and tables

BEGIN;  -- Start transaction for safety

-- =============================================
-- STEP 1: Create Custom Schemas
-- =============================================
CREATE SCHEMA IF NOT EXISTS chat;
CREATE SCHEMA IF NOT EXISTS debate;

-- =============================================
-- STEP 2: Custom Types
-- =============================================
CREATE TYPE debate.criteria_group AS ENUM ('STYLE', 'RESPECT', 'ANALYSIS');
CREATE TYPE debate.speech_mode AS ENUM ('SYNC', 'ASYNC');
CREATE TYPE public.debate_ballot_status_enum AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETE');
CREATE TYPE public.debate_session_status AS ENUM ('SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED');
CREATE TYPE public.division AS ENUM ('VILLIGER', 'LOWER', 'UPPER', 'SENIOR', 'OPEN');
CREATE TYPE public.gender AS ENUM ('MALE', 'FEMALE', 'do not wish to specify');
CREATE TYPE public.group_type AS ENUM ('GUILD', 'TEAM');
CREATE TYPE public.log_type AS ENUM ('REQUEST_JOIN', 'JOINED', 'LEFT', 'INVITED', 'KICKED', 'UPDATED', 'DELETED', 'CREATED');
CREATE TYPE public.payment_provider AS ENUM ('TOSS', 'NAVER_PAY', 'KAKAO_PAY');
CREATE TYPE public.payment_state AS ENUM ('REQUESTED', 'PENDING', 'FAILED', 'COMPLETED', 'AUTHORIZED', 'ABANDONED', 'REFUNDED', 'PREAPPROVED');
CREATE TYPE public.status AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'CANCELLED');
CREATE TYPE public.user_role_type AS ENUM ('STUDENT', 'JUDGE', 'GUARDIAN');

-- =============================================
-- STEP 3: Create Tables
-- =============================================

-- Chat Tables
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

-- Debate Tables
CREATE TABLE debate.ballots (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
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
    speaker_positions smallint[] NOT NULL,
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

-- Public Tables
CREATE TABLE public.admin (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
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
-- STEP 4: Primary Keys
-- =============================================
ALTER TABLE chat.message ADD CONSTRAINT message_pkey PRIMARY KEY (id);
ALTER TABLE chat.participant ADD CONSTRAINT participant_pkey PRIMARY KEY (id);
ALTER TABLE chat.room ADD CONSTRAINT room_pkey PRIMARY KEY (id);
ALTER TABLE debate.ballots ADD CONSTRAINT ballots_pkey PRIMARY KEY (id);
ALTER TABLE debate.criteria ADD CONSTRAINT criteria_pkey PRIMARY KEY (id);
ALTER TABLE debate.debate_formats ADD CONSTRAINT debate_formats_pkey PRIMARY KEY (id);
ALTER TABLE debate.debate_participants ADD CONSTRAINT debate_participants_pkey PRIMARY KEY (id);
ALTER TABLE debate.debate_teams ADD CONSTRAINT debate_teams_pkey PRIMARY KEY (id);
ALTER TABLE debate.debates ADD CONSTRAINT debates_pkey PRIMARY KEY (id);
ALTER TABLE debate.format_rounds ADD CONSTRAINT format_rounds_pkey PRIMARY KEY (id);
ALTER TABLE debate.genres ADD CONSTRAINT genres_pkey PRIMARY KEY (id);
ALTER TABLE debate.judge_comments ADD CONSTRAINT judge_comments_pkey PRIMARY KEY (id);
ALTER TABLE debate.judge_scores ADD CONSTRAINT judge_scores_pkey PRIMARY KEY (id);
ALTER TABLE debate.matchmaking_queue_entries ADD CONSTRAINT matchmaking_queue_entries_pkey PRIMARY KEY (id);
ALTER TABLE debate.motions ADD CONSTRAINT motions_pkey PRIMARY KEY (id);
ALTER TABLE debate.round_templates ADD CONSTRAINT round_templates_pkey PRIMARY KEY (id);
ALTER TABLE debate.sides ADD CONSTRAINT sides_pkey PRIMARY KEY (id);
ALTER TABLE debate.speeches ADD CONSTRAINT speeches_pkey PRIMARY KEY (id);
ALTER TABLE debate.videos ADD CONSTRAINT videos_pkey PRIMARY KEY (id);
ALTER TABLE public.admin ADD CONSTRAINT admin_pkey PRIMARY KEY (id);
ALTER TABLE public.bank_account ADD CONSTRAINT "BankAccount_pkey" PRIMARY KEY (id);
ALTER TABLE public.friendship ADD CONSTRAINT friendship_pkey PRIMARY KEY (id);
ALTER TABLE public.guardian ADD CONSTRAINT "Guardian_pkey" PRIMARY KEY (id);
ALTER TABLE public.guardian_request ADD CONSTRAINT guardian_request_pkey PRIMARY KEY (id);
ALTER TABLE public.guild ADD CONSTRAINT "Guild_pkey" PRIMARY KEY (id);
ALTER TABLE public.guild_member ADD CONSTRAINT "GuildMember_pkey" PRIMARY KEY (id);
ALTER TABLE public.invitation ADD CONSTRAINT "Invitation_pkey" PRIMARY KEY (id);
ALTER TABLE public.judge ADD CONSTRAINT "Judge_pkey" PRIMARY KEY (id);
ALTER TABLE public.log ADD CONSTRAINT "Log_pkey" PRIMARY KEY (id);
ALTER TABLE public.payment_history ADD CONSTRAINT "PaymentHistory_pkey" PRIMARY KEY (id);
ALTER TABLE public.profile ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);
ALTER TABLE public.rating ADD CONSTRAINT "Rating_pkey" PRIMARY KEY (id);
ALTER TABLE public.school ADD CONSTRAINT "School_pkey" PRIMARY KEY (id);
ALTER TABLE public.student ADD CONSTRAINT "Student_pkey" PRIMARY KEY (id);
ALTER TABLE public.team ADD CONSTRAINT "Team_pkey" PRIMARY KEY (id);
ALTER TABLE public.team_member ADD CONSTRAINT "TeamMember_pkey" PRIMARY KEY (id);

-- =============================================
-- STEP 5: Foreign Keys
-- =============================================
ALTER TABLE chat.message ADD CONSTRAINT message_room_id_fkey FOREIGN KEY (room_id) REFERENCES chat.room(id);
ALTER TABLE chat.message ADD CONSTRAINT message_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.profile(id);
ALTER TABLE chat.participant ADD CONSTRAINT participant_room_id_fkey FOREIGN KEY (room_id) REFERENCES chat.room(id);
ALTER TABLE chat.participant ADD CONSTRAINT participant_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.profile(id);
ALTER TABLE chat.room ADD CONSTRAINT room_guild_id_fkey FOREIGN KEY (guild_id) REFERENCES public.guild(id);
ALTER TABLE chat.room ADD CONSTRAINT room_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.team(id);
ALTER TABLE debate.ballots ADD CONSTRAINT ballots_debate_id_fkey FOREIGN KEY (debate_id) REFERENCES debate.debates(id);
ALTER TABLE debate.ballots ADD CONSTRAINT ballots_format_id_fkey FOREIGN KEY (format_id) REFERENCES debate.debate_formats(id);
ALTER TABLE debate.ballots ADD CONSTRAINT ballots_judge_id_fkey FOREIGN KEY (judge_id) REFERENCES public.judge(id);
ALTER TABLE debate.criteria ADD CONSTRAINT criteria_format_id_fkey FOREIGN KEY (format_id) REFERENCES debate.debate_formats(id);
ALTER TABLE debate.debate_participants ADD CONSTRAINT debate_participants_debate_team_id_fkey FOREIGN KEY (debate_team_id) REFERENCES debate.debate_teams(id);
ALTER TABLE debate.debate_participants ADD CONSTRAINT debate_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.student(user_id);
ALTER TABLE debate.debate_teams ADD CONSTRAINT debate_teams_debate_id_fkey FOREIGN KEY (debate_id) REFERENCES debate.debates(id);
ALTER TABLE debate.debate_teams ADD CONSTRAINT debate_teams_side_id_fkey FOREIGN KEY (side_id) REFERENCES debate.sides(id);
ALTER TABLE debate.debates ADD CONSTRAINT debates_debate_format_id_fkey FOREIGN KEY (debate_format_id) REFERENCES debate.debate_formats(id);
ALTER TABLE debate.debates ADD CONSTRAINT debates_motion_id_fkey FOREIGN KEY (motion_id) REFERENCES debate.motions(id);
ALTER TABLE debate.format_rounds ADD CONSTRAINT format_rounds_debate_format_id_fkey FOREIGN KEY (debate_format_id) REFERENCES debate.debate_formats(id);
ALTER TABLE debate.format_rounds ADD CONSTRAINT format_rounds_round_template_id_fkey FOREIGN KEY (round_template_id) REFERENCES debate.round_templates(id);
ALTER TABLE debate.format_rounds ADD CONSTRAINT format_rounds_side_id_fkey FOREIGN KEY (side_id) REFERENCES debate.sides(id);
ALTER TABLE debate.genres ADD CONSTRAINT genres_proposer_id_fkey FOREIGN KEY (proposer_id) REFERENCES public.profile(id);
ALTER TABLE debate.judge_comments ADD CONSTRAINT judge_comments_criteria_id_fkey FOREIGN KEY (criteria_id) REFERENCES debate.criteria(id);
ALTER TABLE debate.judge_comments ADD CONSTRAINT judge_comments_judge_id_fkey FOREIGN KEY (judge_id) REFERENCES public.judge(user_id);
ALTER TABLE debate.judge_comments ADD CONSTRAINT judge_comments_video_id_fkey FOREIGN KEY (video_id) REFERENCES debate.videos(id);
ALTER TABLE debate.judge_scores ADD CONSTRAINT judge_scores_criteria_id_fkey FOREIGN KEY (criteria_id) REFERENCES debate.criteria(id);
ALTER TABLE debate.judge_scores ADD CONSTRAINT judge_scores_debate_id_fkey FOREIGN KEY (debate_id) REFERENCES debate.debates(id);
ALTER TABLE debate.judge_scores ADD CONSTRAINT judge_scores_judge_id_fkey FOREIGN KEY (judge_id) REFERENCES public.judge(user_id);
ALTER TABLE debate.matchmaking_queue_entries ADD CONSTRAINT matchmaking_queue_entries_debate_format_id_fkey FOREIGN KEY (debate_format_id) REFERENCES debate.debate_formats(id);
ALTER TABLE debate.matchmaking_queue_entries ADD CONSTRAINT matchmaking_queue_entries_debate_id_fkey FOREIGN KEY (debate_id) REFERENCES debate.debates(id);
ALTER TABLE debate.matchmaking_queue_entries ADD CONSTRAINT matchmaking_queue_entries_opponent_id_fkey FOREIGN KEY (opponent_id) REFERENCES public.team(id);
ALTER TABLE debate.matchmaking_queue_entries ADD CONSTRAINT matchmaking_queue_entries_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.team(id);
ALTER TABLE debate.motions ADD CONSTRAINT motions_genre_id_fkey FOREIGN KEY (genre_id) REFERENCES debate.genres(id);
ALTER TABLE debate.motions ADD CONSTRAINT motions_proposer_id_fkey FOREIGN KEY (proposer_id) REFERENCES public.profile(id);
ALTER TABLE debate.speeches ADD CONSTRAINT speeches_debate_id_fkey FOREIGN KEY (debate_id) REFERENCES debate.debates(id);
ALTER TABLE debate.speeches ADD CONSTRAINT speeches_format_round_id_fkey FOREIGN KEY (format_round_id) REFERENCES debate.format_rounds(id);
ALTER TABLE debate.speeches ADD CONSTRAINT speeches_participant_id_fkey FOREIGN KEY (participant_id) REFERENCES debate.debate_participants(id);
ALTER TABLE debate.videos ADD CONSTRAINT videos_debate_id_fkey FOREIGN KEY (debate_id) REFERENCES debate.debates(id);
ALTER TABLE debate.videos ADD CONSTRAINT videos_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.profile(id);
ALTER TABLE public.admin ADD CONSTRAINT admin_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);
ALTER TABLE public.bank_account ADD CONSTRAINT "BankAccount_guardianId_fkey" FOREIGN KEY (guardian_id) REFERENCES public.guardian(id);
ALTER TABLE public.friendship ADD CONSTRAINT friendship_friend_id_fkey FOREIGN KEY (friend_id) REFERENCES public.student(user_id);
ALTER TABLE public.friendship ADD CONSTRAINT friendship_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.student(user_id);
ALTER TABLE public.guardian ADD CONSTRAINT "Guardian_userId_fkey" FOREIGN KEY (user_id) REFERENCES public.profile(id);
ALTER TABLE public.guardian_request ADD CONSTRAINT guardian_request_reciever_fkey FOREIGN KEY (reciever) REFERENCES public.profile(id);
ALTER TABLE public.guardian_request ADD CONSTRAINT guardian_request_sender_fkey FOREIGN KEY (sender) REFERENCES public.profile(id);
ALTER TABLE public.guild ADD CONSTRAINT "Guild_schoolId_fkey" FOREIGN KEY (school_id) REFERENCES public.school(id);
ALTER TABLE public.guild_member ADD CONSTRAINT "GuildMember_guildId_fkey" FOREIGN KEY (guild_id) REFERENCES public.guild(id);
ALTER TABLE public.guild_member ADD CONSTRAINT "GuildMember_studentId_fkey" FOREIGN KEY (student_id) REFERENCES public.student(id);
ALTER TABLE public.invitation ADD CONSTRAINT "Invitation_guildId_fkey" FOREIGN KEY (guild_id) REFERENCES public.guild(id);
ALTER TABLE public.invitation ADD CONSTRAINT "Invitation_inviteeId_fkey" FOREIGN KEY (invitee_id) REFERENCES public.profile(id);
ALTER TABLE public.invitation ADD CONSTRAINT "Invitation_inviterId_fkey" FOREIGN KEY (inviter_id) REFERENCES public.profile(id);
ALTER TABLE public.invitation ADD CONSTRAINT "Invitation_teamId_fkey" FOREIGN KEY (team_id) REFERENCES public.team(id);
ALTER TABLE public.judge ADD CONSTRAINT "Judge_referralUserId_fkey" FOREIGN KEY (referral_user_id) REFERENCES public.profile(id);
ALTER TABLE public.judge ADD CONSTRAINT "Judge_userId_fkey" FOREIGN KEY (user_id) REFERENCES public.profile(id);
ALTER TABLE public.log ADD CONSTRAINT "Log_guildId_fkey" FOREIGN KEY (guild_id) REFERENCES public.guild(id);
ALTER TABLE public.log ADD CONSTRAINT "Log_studentId_fkey" FOREIGN KEY (student_id) REFERENCES public.student(id);
ALTER TABLE public.log ADD CONSTRAINT "Log_teamId_fkey" FOREIGN KEY (team_id) REFERENCES public.team(id);
ALTER TABLE public.payment_history ADD CONSTRAINT "PaymentHistory_guardianId_fkey" FOREIGN KEY (guardian_id) REFERENCES public.guardian(id);
ALTER TABLE public.profile ADD CONSTRAINT "User_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id);
ALTER TABLE public.rating ADD CONSTRAINT "Rating_judgeId_fkey" FOREIGN KEY (judge_id) REFERENCES public.judge(id);
ALTER TABLE public.rating ADD CONSTRAINT "Rating_raterId_fkey" FOREIGN KEY (rater_id) REFERENCES public.student(id);
ALTER TABLE public.student ADD CONSTRAINT "Student_guardianId_fkey" FOREIGN KEY (guardian_id) REFERENCES public.guardian(id);
ALTER TABLE public.student ADD CONSTRAINT "Student_schoolId_fkey" FOREIGN KEY (school_id) REFERENCES public.school(id);
ALTER TABLE public.student ADD CONSTRAINT student_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profile(id);
ALTER TABLE public.team_member ADD CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY (team_id) REFERENCES public.team(id);
ALTER TABLE public.team_member ADD CONSTRAINT team_member_student_id_fkey1 FOREIGN KEY (student_id) REFERENCES public.profile(id);

-- =============================================
-- STEP 6: Indexes
-- =============================================
CREATE INDEX IF NOT EXISTS idx_student_call_sign ON public.student(call_sign);
CREATE INDEX IF NOT EXISTS idx_student_school_id ON public.student(school_id);
CREATE INDEX IF NOT EXISTS idx_team_member_student_id ON public.team_member(student_id);
CREATE INDEX IF NOT EXISTS idx_team_member_team_id ON public.team_member(team_id);

-- =============================================
-- STEP 7: Validation
-- =============================================
DO $$
DECLARE
    v_errors text[] := ARRAY[]::text[];
BEGIN
    -- Check if student table has call_sign
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'student' 
        AND column_name = 'call_sign'
    ) THEN
        v_errors := array_append(v_errors, 'Missing: student.call_sign column');
    END IF;
    
    -- Check core tables exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profile') THEN
        v_errors := array_append(v_errors, 'Missing: public.profile table');
    END IF;
    
    IF array_length(v_errors, 1) > 0 THEN
        RAISE EXCEPTION 'Migration validation failed: %', array_to_string(v_errors, ', ');
    ELSE
        RAISE NOTICE 'Migration validation passed!';
    END IF;
END $$;

COMMIT;  -- Commit the transaction

-- =============================================
-- Post-Migration Verification Query
-- =============================================
-- Run this after migration to verify:
/*
SELECT 
    table_schema,
    COUNT(*) as table_count
FROM information_schema.tables
WHERE table_schema IN ('public', 'debate', 'chat')
AND table_type = 'BASE TABLE'
GROUP BY table_schema
ORDER BY table_schema;

-- Expected:
-- public: 17+ tables
-- debate: 10+ tables  
-- chat: 3 tables
*/