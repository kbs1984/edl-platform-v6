-- =============================================
-- Supabase Schema Migration - CLEAN VERSION
-- Generated: 2024-08-22
-- Session: 00049
-- Project: EDL Platform Database Adoption
-- Source: truth-seed project (niyrthumgjmtkjgtlbnq) 
-- Target: edl-platform project (bbrheacetxlnqbibjwsz)
-- =============================================

-- Note: This migration assumes Supabase auth schema already exists
-- We only create our custom schemas and tables

BEGIN;  -- Start transaction for safety

-- =============================================
-- STEP 0: Enable Required Extensions
-- =============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- Public Tables
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
-- STEP 5: Unique Constraints
-- =============================================
-- These were missing from the original migration!
ALTER TABLE public.student ADD CONSTRAINT student_user_id_key UNIQUE (user_id);
ALTER TABLE public.guardian ADD CONSTRAINT guardian_user_id_key UNIQUE (user_id);
ALTER TABLE public.judge ADD CONSTRAINT Judge_userId_key UNIQUE (user_id);
ALTER TABLE public.friendship ADD CONSTRAINT friend_unique UNIQUE (user_id, friend_id);
ALTER TABLE public.school ADD CONSTRAINT school_name_key UNIQUE (name);
ALTER TABLE public.profile ADD CONSTRAINT User_username_key UNIQUE (username);
ALTER TABLE public.team_member ADD CONSTRAINT team_member_student_team_unique UNIQUE (student_id, team_id);
ALTER TABLE chat.participant ADD CONSTRAINT participant_unique UNIQUE (room_id, student_id);
ALTER TABLE debate.ballots ADD CONSTRAINT ballots_debate_id_judge_id_key UNIQUE (debate_id, judge_id);

-- =============================================
-- STEP 6: Foreign Keys
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
-- STEP 7: Create Functions
-- =============================================
-- Note: Functions with Korean text have been cleaned
CREATE OR REPLACE FUNCTION chat.approve_friendship(p_friendship_id uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  f RECORD;
  room_id UUID;
BEGIN
  -- 1) Check friendship exists and is PENDING
  SELECT * INTO f
    FROM public.friendship
   WHERE id = p_friendship_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Friendship % not found', p_friendship_id;
  END IF;
  IF f.status = 'ACCEPTED' THEN
    -- Already approved, return existing room if exists
    SELECT r.id INTO room_id
      FROM chat.room r
      JOIN chat.participant p1 ON p1.room_id = r.id AND p1.student_id = f.user_id
      JOIN chat.participant p2 ON p2.room_id = r.id AND p2.student_id = f.friend_id
     WHERE r.type = 'FRIEND'
     LIMIT 1;
    IF room_id IS NOT NULL THEN
      RETURN room_id;
    END IF;
  END IF;

  -- 2) Update status
  UPDATE public.friendship
     SET status = 'ACCEPTED', accpted_at = NOW(), updated_at = NOW()
   WHERE id = p_friendship_id;

  -- 3) Create chat room
  INSERT INTO chat.room(type)
  VALUES ('FRIEND')
  RETURNING id INTO room_id;

  -- 4) Add participants
  INSERT INTO chat.participant(room_id, student_id)
  VALUES (room_id, f.user_id), (room_id, f.friend_id)
  ON CONFLICT DO NOTHING;

  RETURN room_id;
END;
$function$;

CREATE OR REPLACE FUNCTION chat.fn_add_guild_member_to_room()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  rid UUID;
BEGIN
  IF (TG_OP = 'INSERT' AND NEW.status = 'ACCEPTED')
   OR (TG_OP = 'UPDATE' AND NEW.status = 'ACCEPTED' AND OLD.status <> 'ACCEPTED')
  THEN
    SELECT id INTO rid
      FROM chat.room
     WHERE type = 'GUILD' AND guild_id = NEW.guild_id
     LIMIT 1;
    IF rid IS NOT NULL THEN
      INSERT INTO chat.participant(room_id, student_id)
      VALUES (rid, NEW.student_id)
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION chat.fn_add_team_member_to_room()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  rid UUID;
BEGIN
  IF (TG_OP = 'INSERT' AND NEW.status = 'ACCEPTED')
   OR (TG_OP = 'UPDATE' AND NEW.status = 'ACCEPTED' AND OLD.status <> 'ACCEPTED')
  THEN
    SELECT id INTO rid
      FROM chat.room
     WHERE type = 'TEAM' AND team_id = NEW.team_id
     LIMIT 1;
    IF rid IS NOT NULL THEN
      INSERT INTO chat.participant(room_id, student_id)
      VALUES (rid, NEW.student_id)
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION chat.fn_create_guild_room()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO chat.room(type, title, guild_id)
  VALUES ('GUILD', NEW.name, NEW.id);
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION chat.fn_create_team_room()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO chat.room(type, title, team_id)
  VALUES ('TEAM', NEW.name, NEW.id);
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION chat.fn_sync_guild_room_title()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  UPDATE chat.room
    SET title = NEW.name, updated_at = NOW()
  WHERE type = 'GUILD' AND guild_id = NEW.id;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION chat.fn_sync_team_room_title()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  UPDATE chat.room
    SET title = NEW.name, updated_at = NOW()
  WHERE type = 'TEAM' AND team_id = NEW.id;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION chat.get_friend_room(p_user uuid, p_friend uuid)
 RETURNS chat.room
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
  SELECT r.*
  FROM chat.room r
  JOIN chat.participant p1 ON p1.room_id = r.id AND p1.student_id = p_user
  JOIN chat.participant p2 ON p2.room_id = r.id AND p2.student_id = p_friend
  WHERE r.type = 'FRIEND'
  LIMIT 1
$function$;

CREATE OR REPLACE FUNCTION chat.get_room_messages(p_room_id uuid)
 RETURNS TABLE(id uuid, room_id uuid, sender_id uuid, content text, is_system boolean, created_at timestamp with time zone, updated_at timestamp with time zone, sender_name text, image_path text)
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
  SELECT
    m.id,
    m.room_id,
    m.sender_id,
    m.content,
    m.is_system,
    m.created_at,
    m.updated_at,
    p.name        AS sender_name,
    p.image_path
  FROM chat.message AS m
  JOIN public.profile AS p
    ON p.id = m.sender_id
  WHERE m.room_id = p_room_id
  ORDER BY m.created_at ASC;
$function$;

CREATE OR REPLACE FUNCTION chat.is_room_member(p_room_id uuid, p_user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  _t   TEXT;
  _tid UUID;
  _gid UUID;
BEGIN
  SELECT type, team_id, guild_id
    INTO _t, _tid, _gid
    FROM chat.room
   WHERE id = p_room_id;

  IF _t = 'FRIEND' THEN
    RETURN EXISTS(
      SELECT 1 FROM chat.participant p
       WHERE p.room_id    = p_room_id
         AND p.student_id = p_user_id
    );
  ELSIF _t = 'TEAM' THEN
    RETURN EXISTS(
      SELECT 1 FROM public.team_member tm
       WHERE tm.team_id    = _tid
         AND tm.student_id = p_user_id
         AND tm.status     = 'ACCEPTED'::public.status
    );
  ELSIF _t = 'GUILD' THEN
    RETURN EXISTS(
      SELECT 1 FROM public.guild_member gm
       WHERE gm.guild_id    = _gid
         AND gm.student_id  = p_user_id
         AND gm.status      = 'ACCEPTED'::public.status
    );
  ELSE
    RETURN FALSE;
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION chat.set_timestamp()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.add_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  if new.raw_app_meta_data ->> 'provider' = 'email' then
    insert into public.profile (id)
    values (new.id);
    
  elsif new.raw_app_meta_data ->> 'provider' = 'kakao'
        or new.raw_app_meta_data ->> 'provider' = 'google' then
    insert into public.profile (id, email, name, image_path)
    values (
      new.id,
      new.email,
      new.raw_user_meta_data ->> 'name',
      new.raw_user_meta_data ->> 'avatar_url'
    );
  end if;
  
  return new;
end;
$function$;

CREATE OR REPLACE FUNCTION public.check_friendship_update_allowed_columns()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW.user_id IS DISTINCT FROM OLD.user_id THEN
    RAISE EXCEPTION 'user_id cannot be updated';
  END IF;
  
  IF NEW.friend_id IS DISTINCT FROM OLD.friend_id THEN
    RAISE EXCEPTION 'friend_id cannot be updated';
  END IF;
  
  IF NEW.created_at IS DISTINCT FROM OLD.created_at THEN
    RAISE EXCEPTION 'created_at cannot be updated';
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_insert_allowed_columns()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- division cannot be inserted
  IF NEW.division IS NOT NULL THEN
    RAISE EXCEPTION 'division cannot be inserted';
  END IF;

  IF NEW.level != 0 THEN
    RAISE EXCEPTION 'level cannot be inserted';
  END IF;

  IF NEW.exp != 0 THEN
    RAISE EXCEPTION 'exp cannot be inserted';
  END IF;

  IF NEW.ranking != '0'::smallint THEN
    RAISE EXCEPTION 'ranking cannot be inserted';
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_team_member_delete()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Check if deleter is self (student_id)
  IF auth.uid()::uuid <> OLD.student_id THEN
    -- If not self, check if they are team leader
    IF NOT EXISTS (
      SELECT 1
      FROM public.team_member tm
      WHERE tm.team_id = OLD.team_id
        AND tm.student_id = auth.uid()::uuid
        AND tm.is_leader = TRUE
    ) THEN
      RAISE EXCEPTION 'No delete permission. Only self or team leader can delete';
    END IF;
  END IF;
  RETURN OLD;
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_team_update_leader()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Authenticated users only
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Unauthorized: Only logged in users can access';
  END IF;

  -- Check if user is team leader
  IF NOT EXISTS (
    SELECT 1
    FROM public.team_member tm
    WHERE tm.team_id   = OLD.id
      AND tm.student_id = auth.uid()::uuid
      AND tm.is_leader  = TRUE
  ) THEN
    RAISE EXCEPTION 'Permission denied: Only team leader can modify team info';
  END IF;

  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_update_allowed_columns()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- division cannot be changed
  IF NEW.division IS DISTINCT FROM OLD.division THEN
    RAISE EXCEPTION 'division cannot be changed';
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.delete_empty_team_after_member_delete()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Check remaining members count for deleted member's team_id
  IF NOT EXISTS (
    SELECT 1
    FROM public.team_member
    WHERE team_id = OLD.team_id
  ) THEN
    -- Delete team if no remaining members
    DELETE FROM public.team
    WHERE id = OLD.team_id;
  END IF;
  RETURN NULL;
END;
$function$;

CREATE OR REPLACE FUNCTION public.delete_invalid_friendship()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  -- If status is not in allowed values
  if new.status not in ('PENDING', 'ACCEPTED') then
    -- Delete the just inserted/updated row
    delete from public.friendship
      where id = new.id;
  end if;
  -- AFTER trigger so return value is ignored, but convention is to return null
  return null;
end;
$function$;

CREATE OR REPLACE FUNCTION public.get_friend_list()
 RETURNS TABLE(id uuid, friend_id uuid, created_at timestamp with time zone, updated_at timestamp with time zone, status status)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    f.id AS id,
    CASE 
      WHEN f.user_id = auth.uid() THEN f.friend_id
      ELSE f.user_id
    END AS friend_id,
    f.created_at,
    f.updated_at,
    f.status
  FROM public.friendship f
  WHERE (f.user_id = auth.uid() OR f.friend_id = auth.uid());
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_friend_profiles()
 RETURNS TABLE(id uuid, friend_id uuid, image_path text, username text, exp integer)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
AS $function$
DECLARE
  current_user uuid;
BEGIN  
  RETURN QUERY
  SELECT 
    f.id AS friendship_id,
    CASE 
      WHEN f.user_id = auth.uid() THEN f.friend_id 
      ELSE f.user_id 
    END AS friend_id,
    p.image_path,
    p.username,
    s.exp
  FROM public.friendship f
  JOIN public.profile p
    ON p.id = (
         CASE 
           WHEN f.user_id = auth.uid() THEN f.friend_id 
           ELSE f.user_id 
         END
       )
  JOIN public.student s
    ON s.user_id = p.id
  WHERE (f.user_id = auth.uid() OR f.friend_id = auth.uid())
    AND f.status = 'ACCEPTED';
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_profile_and_student(_user_id uuid)
 RETURNS TABLE(id uuid, name text, username text, image_path text, date_of_birth date, gender gender, user_role user_role_type, active boolean, term_agree_time timestamp with time zone, email text, invited boolean, student_id uuid, guardian_id uuid, school_id uuid, division division, location text, exp integer, ranking smallint, challenge_enabled boolean, graduation_year bigint, relationship_with_guardian text, level integer)
 LANGUAGE plpgsql
 STABLE
AS $function$
begin
  -- 1) Check Profile exists
  if not exists (
    select 1 from public.profile where id = _user_id
  ) then
    raise exception 'Profile not found' using errcode = 'P0001';
  end if;

  -- 2) Check Student exists
  if not exists (
    select 1 from public.student where user_id = _user_id
  ) then
    raise exception 'Student not found' using errcode = 'P0002';
  end if;

  -- 3) Return actual data
  return query
    select
      p.id, p.name, p.username, p.image_path, p.date_of_birth,
      p.gender, p.user_role, p.active, p.term_agree_time, p.email, p.invited,
      s.id           as student_id,
      s.guardian_id,
      s.school_id,
      s.division,
      s.location,
      s.exp,
      s.ranking,
      s.challenge_enabled,
      s.graduation_year,
      s.relationship_with_guardian,
      s.level
    from public.profile p
    left join public.student s on s.user_id = p.id
    where p.id = _user_id;
end;
$function$;

CREATE OR REPLACE FUNCTION public.get_profile_uuid(input text)
 RETURNS uuid
 LANGUAGE plpgsql
 STABLE
AS $function$
DECLARE
    id uuid;
BEGIN
    SELECT p.id
      INTO id
      FROM public.profile p
     WHERE p.email = input OR p.username = input
     LIMIT 1;

    RETURN id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_table_ddl(p_schema_name character varying, p_table_name character varying)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_table_ddl text;
  column_record record;
  constraint_record record;
  index_record record;
BEGIN
  -- Start the create table statement
  v_table_ddl := 'CREATE TABLE ' || p_schema_name || '.' || p_table_name || ' (' || chr(10);
  
  -- Get columns
  FOR column_record IN 
    SELECT 
      column_name,
      data_type,
      coalesce(character_maximum_length::text, '') as character_maximum_length,
      is_nullable,
      column_default
    FROM 
      information_schema.columns
    WHERE 
      table_schema = p_schema_name
      AND table_name = p_table_name
    ORDER BY 
      ordinal_position 
  LOOP
    v_table_ddl := v_table_ddl || '  ' || column_record.column_name || ' ' || column_record.data_type;
    
    -- Add length for varchar
    IF column_record.character_maximum_length <> '' THEN
      v_table_ddl := v_table_ddl || '(' || column_record.character_maximum_length || ')';
    END IF;
    
    -- Add nullable
    IF column_record.is_nullable = 'NO' THEN
      v_table_ddl := v_table_ddl || ' NOT NULL';
    END IF;
    
    -- Add default
    IF column_record.column_default IS NOT NULL THEN
      v_table_ddl := v_table_ddl || ' DEFAULT ' || column_record.column_default;
    END IF;
    
    v_table_ddl := v_table_ddl || ',' || chr(10);
  END LOOP;

  -- Remove the last comma and newline
  v_table_ddl := substring(v_table_ddl, 1, length(v_table_ddl) - 2) || chr(10) || ');';
  
  -- Add primary key constraint
  FOR constraint_record IN
    SELECT 
      tc.constraint_name,
      string_agg(kcu.column_name, ', ') as columns
    FROM 
      information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_catalog = kcu.constraint_catalog
        AND tc.constraint_schema = kcu.constraint_schema
        AND tc.constraint_name = kcu.constraint_name
    WHERE 
      tc.constraint_type = 'PRIMARY KEY'
      AND tc.table_schema = p_schema_name
      AND tc.table_name = p_table_name
    GROUP BY
      tc.constraint_name
  LOOP
    v_table_ddl := v_table_ddl || chr(10) || 'ALTER TABLE ' || p_schema_name || '.' || p_table_name || 
                  ' ADD CONSTRAINT ' || constraint_record.constraint_name || 
                  ' PRIMARY KEY (' || constraint_record.columns || ');';
  END LOOP;
  
  RETURN v_table_ddl;
END;
$function$;

CREATE OR REPLACE FUNCTION public.search_school(search_query text)
 RETURNS TABLE(id uuid, name text)
 LANGUAGE sql
 STABLE
AS $function$
with preprocessed as (
  select 
    id, 
    name,
    translate(lower(name), ' ', '') as name_nospace,
    translate(lower(search_query), ' ', '') as query_nospace
  from school
)
select id, name
from (
  select 
    id, 
    name,
    case 
      when name_nospace ilike '%' || query_nospace || '%' then 1.0
      else similarity(name_nospace, query_nospace)
    end as score
  from preprocessed
) t
where score > 0.1
order by score desc;
$function$;

CREATE OR REPLACE FUNCTION public.set_division()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
  current_year INT := EXTRACT(YEAR FROM CURRENT_DATE)::INT;
  adjusted_year INT;
  current_grade INT;
BEGIN
  -- Adjust school year based on July 1
  IF CURRENT_DATE >= make_date(current_year, 7, 1) THEN
    adjusted_year := current_year + 1;
  ELSE
    adjusted_year := current_year;
  END IF;

  -- Calculate current grade (students start from grade 4, total 9 year course assumed)
  -- If graduationYear is the graduation year, current grade = adjusted_year - graduationYear + 12
  current_grade := adjusted_year - NEW.graduation_year + 12;

  -- Set division based on grade
  IF current_grade BETWEEN 4 AND 5 THEN
    NEW.division := 'VILLIGER';
  ELSIF current_grade BETWEEN 6 AND 7 THEN
    NEW.division := 'LOWER';
  ELSIF current_grade BETWEEN 8 AND 9 THEN
    NEW.division := 'UPPER';
  ELSIF current_grade BETWEEN 10 AND 12 THEN
    NEW.division := 'SENIOR';
  ELSE
    NEW.division := 'OPEN';
  END IF;

  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.set_team_leader(p_team_id uuid, p_student_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- 1. Check authentication
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Unauthorized: Only logged in users can call';
  END IF;

  -- 2. Check if caller is team member
  IF NOT EXISTS (
    SELECT 1
      FROM public.team_member
     WHERE team_id    = p_team_id
       AND student_id = auth.uid()::uuid
  ) THEN
    RAISE EXCEPTION 'Permission denied: Caller is not a team member';
  END IF;

  -- 3. Check if caller is current team leader
  IF NOT EXISTS (
    SELECT 1
      FROM public.team_member
     WHERE team_id    = p_team_id
       AND student_id = auth.uid()::uuid
       AND is_leader  = TRUE
  ) THEN
    RAISE EXCEPTION 'Permission denied: Only current team leader can change leader';
  END IF;

  -- 4. Check if new leader is team member
  IF NOT EXISTS (
    SELECT 1
      FROM public.team_member
     WHERE team_id    = p_team_id
       AND student_id = p_student_id
  ) THEN
    RAISE EXCEPTION 'Cannot set leader: Target user is not a team member';
  END IF;

  -- 5. Remove existing leaders
  UPDATE public.team_member
     SET is_leader = FALSE
   WHERE team_id   = p_team_id
     AND is_leader = TRUE;

  -- 6. Set new leader
  UPDATE public.team_member
     SET is_leader = TRUE
   WHERE team_id    = p_team_id
     AND student_id = p_student_id;
END;
$function$;

-- =============================================
-- STEP 8: Create Triggers
-- =============================================
CREATE TRIGGER trg_message_updated_at BEFORE UPDATE ON chat.message FOR EACH ROW EXECUTE FUNCTION chat.set_timestamp();
CREATE TRIGGER trg_room_updated_at BEFORE UPDATE ON chat.room FOR EACH ROW EXECUTE FUNCTION chat.set_timestamp();
CREATE TRIGGER check_friendship_update_allowed_columns_trigger BEFORE UPDATE ON public.friendship FOR EACH ROW EXECUTE FUNCTION public.check_friendship_update_allowed_columns();
CREATE TRIGGER trg_cleanup_friendship_status AFTER INSERT OR AFTER UPDATE ON public.friendship FOR EACH ROW EXECUTE FUNCTION public.delete_invalid_friendship();
CREATE TRIGGER trg_guild_create_room AFTER INSERT ON public.guild FOR EACH ROW EXECUTE FUNCTION chat.fn_create_guild_room();
CREATE TRIGGER trg_guild_update_room_title AFTER UPDATE ON public.guild FOR EACH ROW EXECUTE FUNCTION chat.fn_sync_guild_room_title();
CREATE TRIGGER trg_guild_member_add_participant AFTER INSERT OR AFTER UPDATE ON public.guild_member FOR EACH ROW EXECUTE FUNCTION chat.fn_add_guild_member_to_room();
CREATE TRIGGER check_insert_allowed_columns_trigger BEFORE INSERT ON public.student FOR EACH ROW EXECUTE FUNCTION public.check_insert_allowed_columns();
CREATE TRIGGER check_update_allowed_columns_trigger BEFORE UPDATE ON public.student FOR EACH ROW EXECUTE FUNCTION public.check_update_allowed_columns();
CREATE TRIGGER trg_set_division BEFORE INSERT OR BEFORE UPDATE ON public.student FOR EACH ROW EXECUTE FUNCTION public.set_division();
CREATE TRIGGER trg_before_update_team BEFORE UPDATE ON public.team FOR EACH ROW EXECUTE FUNCTION public.check_team_update_leader();
CREATE TRIGGER trg_team_create_room AFTER INSERT ON public.team FOR EACH ROW EXECUTE FUNCTION chat.fn_create_team_room();
CREATE TRIGGER trg_team_update_room_title AFTER UPDATE ON public.team FOR EACH ROW EXECUTE FUNCTION chat.fn_sync_team_room_title();
CREATE TRIGGER trg_after_delete_team_member AFTER DELETE ON public.team_member FOR EACH ROW EXECUTE FUNCTION public.delete_empty_team_after_member_delete();
CREATE TRIGGER trg_before_delete_team_member BEFORE DELETE ON public.team_member FOR EACH ROW EXECUTE FUNCTION public.check_team_member_delete();
CREATE TRIGGER trg_team_member_add_participant AFTER INSERT OR AFTER UPDATE ON public.team_member FOR EACH ROW EXECUTE FUNCTION chat.fn_add_team_member_to_room();

-- Note: Add trigger for auth.users if needed
-- CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.add_new_user();

-- =============================================
-- STEP 9: Enable Row Level Security
-- =============================================
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

-- =============================================
-- STEP 10: Create RLS Policies
-- =============================================
CREATE POLICY delete_message ON chat.message AS PERMISSIVE FOR DELETE TO authenticated
    USING (((sender_id = auth.uid()) OR (auth.role() = 'admin'::text)));

CREATE POLICY insert_message ON chat.message AS PERMISSIVE FOR INSERT TO authenticated
    WITH CHECK ((EXISTS ( SELECT 1
   FROM chat.participant p
  WHERE ((p.room_id = message.room_id) AND (p.student_id = auth.uid())))));

CREATE POLICY select_message ON chat.message AS PERMISSIVE FOR SELECT TO authenticated
    USING ((EXISTS ( SELECT 1
   FROM chat.participant p
  WHERE ((p.room_id = message.room_id) AND (p.student_id = auth.uid())))));

CREATE POLICY update_message ON chat.message AS PERMISSIVE FOR UPDATE TO authenticated
    USING (((sender_id = auth.uid()) OR (auth.role() = 'admin'::text)));

CREATE POLICY "Enable insert for users based on user_id" ON chat.participant AS PERMISSIVE FOR INSERT TO authenticated
    WITH CHECK ((( SELECT auth.uid() AS uid) = student_id));

CREATE POLICY "Enable users to view their own data only" ON chat.participant AS PERMISSIVE FOR SELECT TO authenticated
    USING (true);

CREATE POLICY delete_participant ON chat.participant AS PERMISSIVE FOR DELETE TO authenticated
    USING ((student_id = auth.uid()));

CREATE POLICY update_participant ON chat.participant AS PERMISSIVE FOR UPDATE TO authenticated
    USING ((student_id = auth.uid()));

CREATE POLICY delete_room ON chat.room AS PERMISSIVE FOR DELETE TO authenticated
    USING ((EXISTS ( SELECT 1
   FROM chat.participant p
  WHERE ((p.room_id = room.id) AND (p.student_id = auth.uid())))));

CREATE POLICY select_room ON chat.room AS PERMISSIVE FOR SELECT TO authenticated
    USING (chat.is_room_member(id, auth.uid()));

CREATE POLICY update_room ON chat.room AS PERMISSIVE FOR UPDATE TO authenticated
    USING ((EXISTS ( SELECT 1
   FROM chat.participant p
  WHERE ((p.room_id = room.id) AND (p.student_id = auth.uid())))));

CREATE POLICY "Judges can manage their own ballots" ON debate.ballots AS PERMISSIVE FOR ALL TO authenticated
    USING ((judge_id IN ( SELECT judge.id
   FROM judge
  WHERE (judge.user_id = auth.uid()))));

CREATE POLICY "Participants can view ballots for their debates" ON debate.ballots AS PERMISSIVE FOR SELECT TO authenticated
    USING ((debate_id IN ( SELECT dt.debate_id
   FROM ((debate.debate_teams dt
     JOIN debate.debate_participants dp ON ((dp.debate_team_id = dt.id)))
     JOIN student s ON ((dp.user_id = s.user_id)))
  WHERE (s.user_id = auth.uid()))));

CREATE POLICY "Enable read access for all users" ON debate.criteria AS PERMISSIVE FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Enable read access for all users" ON debate.debate_formats AS PERMISSIVE FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Enable read access for all users" ON debate.format_rounds AS PERMISSIVE FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON debate.genres AS PERMISSIVE FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON debate.genres AS PERMISSIVE FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Enable read access for all users" ON debate.round_templates AS PERMISSIVE FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Enable read access for all users" ON debate.sides AS PERMISSIVE FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Allow insert on friendship" ON public.friendship AS PERMISSIVE FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow select on friendship" ON public.friendship AS PERMISSIVE FOR SELECT TO authenticated
    USING (((user_id = auth.uid()) OR (friend_id = auth.uid())));

CREATE POLICY "Allow update on friendship" ON public.friendship AS PERMISSIVE FOR UPDATE TO authenticated
    USING (((user_id = auth.uid()) OR (friend_id = auth.uid())))
    WITH CHECK (((user_id = auth.uid()) OR ((friend_id = auth.uid()) AND (status = ANY (ARRAY['ACCEPTED'::status, 'REJECTED'::status])))));

CREATE POLICY "Enable insert for authenticated users only" ON public.guardian AS PERMISSIVE FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON public.guardian AS PERMISSIVE FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.guardian_request AS PERMISSIVE FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.judge AS PERMISSIVE FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow users to select their own profile" ON public.profile AS PERMISSIVE FOR SELECT TO authenticated
    USING ((( SELECT auth.uid() AS uid) = id));

CREATE POLICY "Allow users to update their own profile" ON public.profile AS PERMISSIVE FOR UPDATE TO authenticated
    USING ((( SELECT auth.uid() AS uid) = id))
    WITH CHECK ((( SELECT auth.uid() AS uid) = id));

CREATE POLICY "Enable read access for all users" ON public.profile AS PERMISSIVE FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to insert school" ON public.school AS PERMISSIVE FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON public.school AS PERMISSIVE FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.student AS PERMISSIVE FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON public.student AS PERMISSIVE FOR SELECT TO authenticated
    USING (true);

CREATE POLICY update_student_policy ON public.student AS PERMISSIVE FOR UPDATE TO authenticated
    USING ((user_id = auth.uid()));

CREATE POLICY "Enable delete for users based on user_id" ON public.team AS PERMISSIVE FOR DELETE TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.team AS PERMISSIVE FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON public.team AS PERMISSIVE FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Policy with table joins" ON public.team AS PERMISSIVE FOR UPDATE TO authenticated
    USING (true);

CREATE POLICY "Enable delete for users based on user_id" ON public.team_member AS PERMISSIVE FOR DELETE TO authenticated
    USING (true);

CREATE POLICY "Enable insert for users based on user_id" ON public.team_member AS PERMISSIVE FOR INSERT TO authenticated
    WITH CHECK (((status = 'PENDING'::status) OR (( SELECT auth.uid() AS uid) = student_id)));

CREATE POLICY "Enable read access for all users" ON public.team_member AS PERMISSIVE FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Enable update for users based on email" ON public.team_member AS PERMISSIVE FOR UPDATE TO authenticated
    USING (true);

-- =============================================
-- STEP 11: Create Indexes
-- =============================================
CREATE INDEX IF NOT EXISTS idx_student_call_sign ON public.student(call_sign);
CREATE INDEX IF NOT EXISTS idx_student_school_id ON public.student(school_id);
CREATE INDEX IF NOT EXISTS idx_team_member_student_id ON public.team_member(student_id);
CREATE INDEX IF NOT EXISTS idx_team_member_team_id ON public.team_member(team_id);
CREATE INDEX IF NOT EXISTS "Guardian_userId_idx" ON public.guardian(user_id);
CREATE INDEX IF NOT EXISTS "Student_userId_idx" ON public.student(user_id);
CREATE INDEX IF NOT EXISTS "Judge_userId_idx" ON public.judge(user_id);
CREATE INDEX IF NOT EXISTS "Invitation_inviteeId_idx" ON public.invitation(invitee_id);
CREATE INDEX IF NOT EXISTS "Invitation_inviterId_idx" ON public.invitation(inviter_id);
CREATE INDEX IF NOT EXISTS "Log_studentId_idx" ON public.log(student_id);

-- =============================================
-- STEP 12: Validation
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
   
   -- Check if student.user_id has unique constraint
   IF NOT EXISTS (
       SELECT 1 FROM information_schema.table_constraints tc
       JOIN information_schema.constraint_column_usage ccu 
           ON tc.constraint_name = ccu.constraint_name
       WHERE tc.table_schema = 'public' 
       AND tc.table_name = 'student'
       AND ccu.column_name = 'user_id'
       AND tc.constraint_type = 'UNIQUE'
   ) THEN
       v_errors := array_append(v_errors, 'Missing: student.user_id unique constraint');
   END IF;
   
   -- Check core tables exist
   IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profile') THEN
       v_errors := array_append(v_errors, 'Missing: public.profile table');
   END IF;
   
   IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'chat' AND table_name = 'room') THEN
       v_errors := array_append(v_errors, 'Missing: chat.room table');
   END IF;
   
   IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'debate' AND table_name = 'debates') THEN
       v_errors := array_append(v_errors, 'Missing: debate.debates table');
   END IF;
   
   IF array_length(v_errors, 1) > 0 THEN
       RAISE EXCEPTION 'Migration validation failed: %', array_to_string(v_errors, ', ');
   ELSE
       RAISE NOTICE 'Migration validation passed!';
   END IF;
END $$;

COMMIT;  -- Commit the transaction

-- =============================================
-- Post-Migration Notes
-- =============================================
-- 1. Update existing students with proper call signs:
--    UPDATE public.student SET call_sign = 'ALPHA_' || row_number() OVER (ORDER BY created_at)
--    WHERE call_sign LIKE 'TEMP_%' OR call_sign IS NULL;
--
-- 2. Create trigger on auth.users table (if not exists):
--    CREATE TRIGGER on_auth_user_created 
--    AFTER INSERT ON auth.users 
--    FOR EACH ROW EXECUTE FUNCTION public.add_new_user();
--
-- 3. Enable required extensions in Supabase Dashboard:
--    - pg_trgm (for search_school function)
--
-- 4. Configure storage buckets in Supabase Dashboard
-- 5. Set up Auth providers in Supabase Dashboard
-- 6. Create any necessary Edge Functions

-- =============================================
-- Post-Migration Verification Queries
-- =============================================
/*
-- Run these after migration to verify:

-- 1. Check table counts
SELECT 
   table_schema,
   COUNT(*) as table_count
FROM information_schema.tables
WHERE table_schema IN ('public', 'debate', 'chat')
AND table_type = 'BASE TABLE'
GROUP BY table_schema
ORDER BY table_schema;

-- Expected:
-- chat: 3 tables
-- debate: 10 tables
-- public: 17 tables

-- 2. Check unique constraints
SELECT 
   tc.table_schema,
   tc.table_name,
   tc.constraint_name,
   tc.constraint_type
FROM information_schema.table_constraints tc
WHERE tc.table_schema IN ('public', 'debate', 'chat')
AND tc.constraint_type = 'UNIQUE'
ORDER BY tc.table_schema, tc.table_name;

-- 3. Check call_sign column
SELECT 
   column_name, 
   data_type, 
   is_nullable,
   column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'student'
AND column_name = 'call_sign';

-- 4. Check functions count
SELECT 
   n.nspname as schema,
   COUNT(*) as function_count
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname IN ('public', 'chat', 'debate')
GROUP BY n.nspname
ORDER BY n.nspname;

-- 5. Check triggers count
SELECT 
   schemaname,
   COUNT(*) as trigger_count
FROM pg_trigger t
JOIN pg_class c ON c.oid = t.tgrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname IN ('public', 'chat', 'debate')
AND NOT t.tgisinternal
GROUP BY n.nspname
ORDER BY n.nspname;
*/