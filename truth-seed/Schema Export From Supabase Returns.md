---
created: '2025-08-23'
domain: core
priority: P1
purpose: Document schema export from supabase returns
session: legacy
status: current
title: Schema Export From Supabase Returns
topics:
- documentation
type: guide
---

Schema Export From Supabase 

Step-by-Step SQL Editor Extraction

Run these queries **one at a time** in the SQL Editor and save the results:

### 1. Extract All Custom Types
```json
[
  {
    "format": "CREATE TYPE debate.criteria_group AS ENUM ('STYLE', 'RESPECT', 'ANALYSIS');"
  },
  {
    "format": "CREATE TYPE debate.speech_mode AS ENUM ('SYNC', 'ASYNC');"
  },
  {
    "format": "CREATE TYPE public.debate_ballot_status_enum AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETE');"
  },
  {
    "format": "CREATE TYPE public.debate_session_status AS ENUM ('SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED');"
  },
  {
    "format": "CREATE TYPE public.division AS ENUM ('VILLIGER', 'LOWER', 'UPPER', 'SENIOR', 'OPEN');"
  },
  {
    "format": "CREATE TYPE public.gender AS ENUM ('MALE', 'FEMALE', 'do not wish to specify');"
  },
  {
    "format": "CREATE TYPE public.group_type AS ENUM ('GUILD', 'TEAM');"
  },
  {
    "format": "CREATE TYPE public.log_type AS ENUM ('REQUEST_JOIN', 'JOINED', 'LEFT', 'INVITED', 'KICKED', 'UPDATED', 'DELETED', 'CREATED');"
  },
  {
    "format": "CREATE TYPE public.payment_provider AS ENUM ('TOSS', 'NAVER_PAY', 'KAKAO_PAY');"
  },
  {
    "format": "CREATE TYPE public.payment_state AS ENUM ('REQUESTED', 'PENDING', 'FAILED', 'COMPLETED', 'AUTHORIZED', 'ABANDONED', 'REFUNDED', 'PREAPPROVED');"
  },
  {
    "format": "CREATE TYPE public.status AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'CANCELLED');"
  },
  {
    "format": "CREATE TYPE public.user_role_type AS ENUM ('STUDENT', 'JUDGE', 'GUARDIAN');"
  }
]
```

### 2. Extract All Tables with Columns
```json
[
  {
    "format": "CREATE TABLE chat.message (\n    id uuid NOT NULL DEFAULT gen_random_uuid(),\n    room_id uuid NOT NULL,\n    sender_id uuid NOT NULL,\n    content text NOT NULL,\n    is_system boolean NOT NULL DEFAULT false,\n    created_at timestamp with time zone NOT NULL DEFAULT now(),\n    updated_at timestamp with time zone NOT NULL DEFAULT now()\n);"
  },
  {
    "format": "CREATE TABLE chat.participant (\n    id uuid NOT NULL DEFAULT gen_random_uuid(),\n    room_id uuid NOT NULL,\n    student_id uuid NOT NULL,\n    joined_at timestamp with time zone NOT NULL DEFAULT now(),\n    last_read_at timestamp with time zone NOT NULL DEFAULT now()\n);"
  },
  {
    "format": "CREATE TABLE chat.room (\n    id uuid NOT NULL DEFAULT gen_random_uuid(),\n    type text NOT NULL,\n    title text,\n    team_id uuid,\n    guild_id uuid,\n    created_at timestamp with time zone NOT NULL DEFAULT now(),\n    updated_at timestamp with time zone NOT NULL DEFAULT now()\n);"
  },
  {
    "format": "CREATE TABLE debate.ballots (\n    id uuid NOT NULL DEFAULT uuid_generate_v4(),\n    debate_id uuid NOT NULL,\n    judge_id uuid NOT NULL,\n    status public.debate_ballot_status_enum DEFAULT 'PENDING'::debate_ballot_status_enum,\n    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,\n    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,\n    submitted_at timestamp with time zone,\n    format_id uuid NOT NULL,\n    version integer DEFAULT 1\n);"
  },
  {
    "format": "CREATE TABLE debate.criteria (\n    id uuid NOT NULL DEFAULT gen_random_uuid(),\n    \"group\" debate.criteria_group NOT NULL,\n    name text NOT NULL,\n    criteria text NOT NULL,\n    label text NOT NULL,\n    format_id uuid\n);"
  },
  {
    "format": "CREATE TABLE debate.debate_formats (\n    id uuid NOT NULL DEFAULT gen_random_uuid(),\n    name text NOT NULL,\n    description text,\n    type debate.speech_mode NOT NULL DEFAULT 'SYNC'::debate.speech_mode\n);"
  },
  {
    "format": "CREATE TABLE debate.debate_participants (\n    id uuid NOT NULL DEFAULT gen_random_uuid(),\n    debate_team_id uuid NOT NULL,\n    user_id uuid NOT NULL,\n    invite_status public.status DEFAULT 'PENDING'::status,\n    speaker_position smallint NOT NULL\n);"
  },
  {
    "format": "CREATE TABLE debate.debate_teams (\n    id uuid NOT NULL DEFAULT gen_random_uuid(),\n    debate_id uuid NOT NULL,\n    side_id uuid NOT NULL\n);"
  },
  {
    "format": "CREATE TABLE debate.debates (\n    id uuid NOT NULL DEFAULT gen_random_uuid(),\n    debate_format_id uuid NOT NULL,\n    motion_id uuid NOT NULL,\n    scheduled_at timestamp with time zone,\n    created_at timestamp with time zone NOT NULL DEFAULT now(),\n    mode debate.speech_mode NOT NULL\n);"
  },
  {
    "format": "CREATE TABLE debate.format_rounds (\n    id uuid NOT NULL DEFAULT gen_random_uuid(),\n    debate_format_id uuid NOT NULL,\n    round_template_id uuid NOT NULL,\n    sequence integer NOT NULL,\n    side_id uuid NOT NULL,\n    speaker_positions _int2[] NOT NULL,\n    number_of_speakers smallint NOT NULL\n);"
  },
  {
    "format": "CREATE TABLE debate.genres (\n    id uuid NOT NULL DEFAULT gen_random_uuid(),\n    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    title text NOT NULL,\n    description text,\n    proposer_id uuid NOT NULL\n);"
  },
  {
    "format": "CREATE TABLE debate.judge_comments (\n    id uuid NOT NULL DEFAULT gen_random_uuid(),\n    video_id uuid NOT NULL,\n    judge_id uuid NOT NULL,\n    criteria_id uuid NOT NULL,\n    at_seconds integer NOT NULL,\n    comment text NOT NULL,\n    created_at timestamp with time zone NOT NULL DEFAULT now()\n);"
  },
  {
    "format": "CREATE TABLE debate.judge_scores (\n    id uuid NOT NULL DEFAULT gen_random_uuid(),\n    debate_id uuid NOT NULL,\n    judge_id uuid NOT NULL,\n    criteria_id uuid NOT NULL,\n    score numeric NOT NULL,\n    created_at timestamp with time zone NOT NULL DEFAULT now()\n);"
  },
  {
    "format": "CREATE TABLE debate.matchmaking_queue_entries (\n    id uuid NOT NULL DEFAULT gen_random_uuid(),\n    team_id uuid NOT NULL,\n    debate_format_id uuid NOT NULL,\n    league_id public.division NOT NULL,\n    team_rank integer NOT NULL,\n    challenge_mode_active boolean NOT NULL DEFAULT false,\n    status public.debate_session_status NOT NULL,\n    queued_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    debate_id uuid,\n    opponent_id uuid\n);"
  },
  {
    "format": "CREATE TABLE debate.motions (\n    id uuid NOT NULL DEFAULT gen_random_uuid(),\n    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    topic text NOT NULL,\n    genre_id uuid NOT NULL,\n    details text,\n    proposer_id uuid NOT NULL\n);"
  },
  {
    "format": "CREATE TABLE debate.round_templates (\n    id uuid NOT NULL DEFAULT gen_random_uuid(),\n    code text NOT NULL,\n    name text NOT NULL,\n    default_time integer,\n    description text NOT NULL\n);"
  },
  {
    "format": "CREATE TABLE debate.sides (\n    id uuid NOT NULL DEFAULT gen_random_uuid(),\n    title text NOT NULL\n);"
  },
  {
    "format": "CREATE TABLE debate.speeches (\n    id uuid NOT NULL DEFAULT gen_random_uuid(),\n    debate_id uuid NOT NULL,\n    format_round_id uuid NOT NULL,\n    participant_id uuid NOT NULL,\n    content text,\n    delivered_at timestamp with time zone DEFAULT now(),\n    duration_seconds integer\n);"
  },
  {
    "format": "CREATE TABLE debate.videos (\n    id uuid NOT NULL DEFAULT gen_random_uuid(),\n    debate_id uuid NOT NULL,\n    storage_path text NOT NULL,\n    url text NOT NULL,\n    uploaded_by uuid NOT NULL,\n    uploaded_at timestamp with time zone NOT NULL DEFAULT now()\n);"
  },
  {
    "format": "CREATE TABLE public.admin (\n    id uuid NOT NULL DEFAULT uuid_generate_v4(),\n    user_id uuid NOT NULL,\n    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,\n    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP\n);"
  },
  {
    "format": "CREATE TABLE public.bank_account (\n    id uuid NOT NULL DEFAULT gen_random_uuid(),\n    active boolean NOT NULL,\n    guardian_id uuid NOT NULL,\n    name text NOT NULL,\n    routing text NOT NULL,\n    swift_code text NOT NULL,\n    i_b_a_n text NOT NULL\n);"
  },
  {
    "format": "CREATE TABLE public.friendship (\n    id uuid NOT NULL DEFAULT gen_random_uuid(),\n    created_at timestamp with time zone NOT NULL DEFAULT now(),\n    updated_at timestamp with time zone DEFAULT now(),\n    user_id uuid NOT NULL DEFAULT auth.uid(),\n    friend_id uuid NOT NULL,\n    status public.status NOT NULL DEFAULT 'PENDING'::status,\n    accpted_at timestamp with time zone\n);"
  },
  {
    "format": "CREATE TABLE public.guardian (\n    id uuid NOT NULL DEFAULT gen_random_uuid(),\n    user_id uuid NOT NULL DEFAULT auth.uid(),\n    payment_method text,\n    billing_address text\n);"
  },
  {
    "format": "CREATE TABLE public.guardian_request (\n    id uuid NOT NULL DEFAULT gen_random_uuid(),\n    created_at timestamp with time zone NOT NULL DEFAULT now(),\n    status public.status DEFAULT 'PENDING'::status,\n    updated_at timestamp without time zone NOT NULL,\n    sender uuid,\n    reciever uuid\n);"
  },
  {
    "format": "CREATE TABLE public.guild (\n    id uuid NOT NULL DEFAULT gen_random_uuid(),\n    school_id uuid NOT NULL,\n    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    updated_at timestamp without time zone NOT NULL,\n    name text NOT NULL,\n    requirement text NOT NULL,\n    division public.division NOT NULL,\n    image_path text NOT NULL,\n    description text NOT NULL\n);"
  },
  {
    "format": "CREATE TABLE public.guild_member (\n    id uuid NOT NULL DEFAULT gen_random_uuid(),\n    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    updated_at timestamp without time zone NOT NULL,\n    student_id uuid NOT NULL,\n    guild_id uuid NOT NULL,\n    join_date timestamp without time zone,\n    is_leader boolean NOT NULL DEFAULT false,\n    status public.status NOT NULL DEFAULT 'PENDING'::status\n);"
  },
  {
    "format": "CREATE TABLE public.invitation (\n    id uuid NOT NULL DEFAULT gen_random_uuid(),\n    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    updated_at timestamp without time zone NOT NULL,\n    accepted_at timestamp without time zone,\n    inviter_id uuid NOT NULL,\n    invitee_id uuid NOT NULL,\n    team_id uuid,\n    guild_id uuid,\n    status public.status NOT NULL DEFAULT 'PENDING'::status,\n    expires_at timestamp without time zone,\n    type public.group_type NOT NULL\n);"
  },
  {
    "format": "CREATE TABLE public.judge (\n    id uuid NOT NULL DEFAULT gen_random_uuid(),\n    user_id uuid NOT NULL DEFAULT auth.uid(),\n    job_title text NOT NULL,\n    biography text NOT NULL,\n    bank_account_info text,\n    referral_user_id uuid\n);"
  },
  {
    "format": "CREATE TABLE public.log (\n    id uuid NOT NULL DEFAULT gen_random_uuid(),\n    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    log_type public.log_type NOT NULL,\n    description text NOT NULL,\n    guild_id uuid,\n    team_id uuid,\n    student_id uuid NOT NULL,\n    type public.group_type NOT NULL\n);"
  },
  {
    "format": "CREATE TABLE public.payment_history (\n    id uuid NOT NULL DEFAULT gen_random_uuid(),\n    guardian_id uuid NOT NULL,\n    amount integer NOT NULL,\n    currency_code text NOT NULL,\n    payment_provider public.payment_provider NOT NULL,\n    payment_date timestamp without time zone NOT NULL,\n    payment_state public.payment_state NOT NULL\n);"
  },
  {
    "format": "CREATE TABLE public.profile (\n    id uuid NOT NULL DEFAULT auth.uid(),\n    name text DEFAULT ''::text,\n    username text,\n    image_path text,\n    date_of_birth date,\n    gender public.gender,\n    user_role public.user_role_type,\n    active boolean NOT NULL DEFAULT false,\n    term_agree_time timestamp with time zone,\n    email text DEFAULT ''::text,\n    invited boolean NOT NULL DEFAULT false\n);"
  },
  {
    "format": "CREATE TABLE public.rating (\n    id uuid NOT NULL DEFAULT gen_random_uuid(),\n    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    rate integer NOT NULL,\n    judge_id uuid NOT NULL,\n    rater_id uuid NOT NULL\n);"
  },
  {
    "format": "CREATE TABLE public.school (\n    id uuid NOT NULL DEFAULT gen_random_uuid(),\n    name text NOT NULL,\n    created_at timestamp without time zone NOT NULL DEFAULT now(),\n    updated_at timestamp without time zone NOT NULL DEFAULT now(),\n    created_by uuid NOT NULL DEFAULT auth.uid()\n);"
  },
  {
    "format": "CREATE TABLE public.student (\n    id uuid NOT NULL DEFAULT gen_random_uuid(),\n    user_id uuid NOT NULL DEFAULT auth.uid(),\n    guardian_id uuid,\n    school_id uuid,\n    division public.division,\n    location text NOT NULL,\n    exp integer NOT NULL DEFAULT 0,\n    ranking smallint NOT NULL DEFAULT '0'::smallint,\n    challenge_enabled boolean NOT NULL DEFAULT false,\n    graduation_year bigint NOT NULL,\n    relationship_with_guardian text,\n    level integer NOT NULL DEFAULT 0\n);"
  },
  {
    "format": "CREATE TABLE public.team (\n    id uuid NOT NULL DEFAULT gen_random_uuid(),\n    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    updated_at timestamp without time zone NOT NULL,\n    name text NOT NULL,\n    description text NOT NULL,\n    division public.division NOT NULL,\n    image_path text NOT NULL\n);"
  },
  {
    "format": "CREATE TABLE public.team_member (\n    id uuid NOT NULL DEFAULT gen_random_uuid(),\n    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    updated_at timestamp without time zone NOT NULL,\n    student_id uuid NOT NULL,\n    team_id uuid NOT NULL,\n    join_date timestamp without time zone,\n    is_leader boolean NOT NULL DEFAULT false,\n    status public.status NOT NULL DEFAULT 'PENDING'::status\n);"
  }
]
```

### 3. Extract All Primary Keys
```json
[
  {
    "format": "ALTER TABLE chat.message ADD CONSTRAINT message_pkey PRIMARY KEY (id);"
  },
  {
    "format": "ALTER TABLE chat.participant ADD CONSTRAINT participant_pkey PRIMARY KEY (id);"
  },
  {
    "format": "ALTER TABLE chat.room ADD CONSTRAINT room_pkey PRIMARY KEY (id);"
  },
  {
    "format": "ALTER TABLE debate.ballots ADD CONSTRAINT ballots_pkey PRIMARY KEY (id);"
  },
  {
    "format": "ALTER TABLE debate.criteria ADD CONSTRAINT criteria_pkey PRIMARY KEY (id);"
  },
  {
    "format": "ALTER TABLE debate.debate_formats ADD CONSTRAINT debate_formats_pkey PRIMARY KEY (id);"
  },
  {
    "format": "ALTER TABLE debate.debate_participants ADD CONSTRAINT debate_participants_pkey PRIMARY KEY (id);"
  },
  {
    "format": "ALTER TABLE debate.debate_teams ADD CONSTRAINT debate_teams_pkey PRIMARY KEY (id);"
  },
  {
    "format": "ALTER TABLE debate.debates ADD CONSTRAINT debates_pkey PRIMARY KEY (id);"
  },
  {
    "format": "ALTER TABLE debate.format_rounds ADD CONSTRAINT format_rounds_pkey PRIMARY KEY (id);"
  },
  {
    "format": "ALTER TABLE debate.genres ADD CONSTRAINT genres_pkey PRIMARY KEY (id);"
  },
  {
    "format": "ALTER TABLE debate.judge_comments ADD CONSTRAINT judge_comments_pkey PRIMARY KEY (id);"
  },
  {
    "format": "ALTER TABLE debate.judge_scores ADD CONSTRAINT judge_scores_pkey PRIMARY KEY (id);"
  },
  {
    "format": "ALTER TABLE debate.matchmaking_queue_entries ADD CONSTRAINT matchmaking_queue_entries_pkey PRIMARY KEY (id);"
  },
  {
    "format": "ALTER TABLE debate.motions ADD CONSTRAINT motions_pkey PRIMARY KEY (id);"
  },
  {
    "format": "ALTER TABLE debate.round_templates ADD CONSTRAINT round_templates_pkey PRIMARY KEY (id);"
  },
  {
    "format": "ALTER TABLE debate.sides ADD CONSTRAINT sides_pkey PRIMARY KEY (id);"
  },
  {
    "format": "ALTER TABLE debate.speeches ADD CONSTRAINT speeches_pkey PRIMARY KEY (id);"
  },
  {
    "format": "ALTER TABLE debate.videos ADD CONSTRAINT videos_pkey PRIMARY KEY (id);"
  },
  {
    "format": "ALTER TABLE public.admin ADD CONSTRAINT admin_pkey PRIMARY KEY (id);"
  },
  {
    "format": "ALTER TABLE public.bank_account ADD CONSTRAINT \"BankAccount_pkey\" PRIMARY KEY (id);"
  },
  {
    "format": "ALTER TABLE public.friendship ADD CONSTRAINT friendship_pkey PRIMARY KEY (id);"
  },
  {
    "format": "ALTER TABLE public.guardian ADD CONSTRAINT \"Guardian_pkey\" PRIMARY KEY (id);"
  },
  {
    "format": "ALTER TABLE public.guardian_request ADD CONSTRAINT guardian_request_pkey PRIMARY KEY (id);"
  },
  {
    "format": "ALTER TABLE public.guild ADD CONSTRAINT \"Guild_pkey\" PRIMARY KEY (id);"
  },
  {
    "format": "ALTER TABLE public.guild_member ADD CONSTRAINT \"GuildMember_pkey\" PRIMARY KEY (id);"
  },
  {
    "format": "ALTER TABLE public.invitation ADD CONSTRAINT \"Invitation_pkey\" PRIMARY KEY (id);"
  },
  {
    "format": "ALTER TABLE public.judge ADD CONSTRAINT \"Judge_pkey\" PRIMARY KEY (id);"
  },
  {
    "format": "ALTER TABLE public.log ADD CONSTRAINT \"Log_pkey\" PRIMARY KEY (id);"
  },
  {
    "format": "ALTER TABLE public.payment_history ADD CONSTRAINT \"PaymentHistory_pkey\" PRIMARY KEY (id);"
  },
  {
    "format": "ALTER TABLE public.profile ADD CONSTRAINT \"User_pkey\" PRIMARY KEY (id);"
  },
  {
    "format": "ALTER TABLE public.rating ADD CONSTRAINT \"Rating_pkey\" PRIMARY KEY (id);"
  },
  {
    "format": "ALTER TABLE public.school ADD CONSTRAINT \"School_pkey\" PRIMARY KEY (id);"
  },
  {
    "format": "ALTER TABLE public.student ADD CONSTRAINT \"Student_pkey\" PRIMARY KEY (id);"
  },
  {
    "format": "ALTER TABLE public.team ADD CONSTRAINT \"Team_pkey\" PRIMARY KEY (id);"
  },
  {
    "format": "ALTER TABLE public.team_member ADD CONSTRAINT \"TeamMember_pkey\" PRIMARY KEY (id);"
  }
]
```

### 4. Extract All Foreign Keys
```json
[
  {
    "format": "ALTER TABLE chat.message ADD CONSTRAINT message_room_id_fkey FOREIGN KEY (room_id) REFERENCES chat.room(id);"
  },
  {
    "format": "ALTER TABLE chat.message ADD CONSTRAINT message_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.profile(id);"
  },
  {
    "format": "ALTER TABLE chat.participant ADD CONSTRAINT participant_room_id_fkey FOREIGN KEY (room_id) REFERENCES chat.room(id);"
  },
  {
    "format": "ALTER TABLE chat.participant ADD CONSTRAINT participant_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.profile(id);"
  },
  {
    "format": "ALTER TABLE chat.room ADD CONSTRAINT room_guild_id_fkey FOREIGN KEY (guild_id) REFERENCES public.guild(id);"
  },
  {
    "format": "ALTER TABLE chat.room ADD CONSTRAINT room_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.team(id);"
  },
  {
    "format": "ALTER TABLE debate.ballots ADD CONSTRAINT ballots_debate_id_fkey FOREIGN KEY (debate_id) REFERENCES debate.debates(id);"
  },
  {
    "format": "ALTER TABLE debate.ballots ADD CONSTRAINT ballots_format_id_fkey FOREIGN KEY (format_id) REFERENCES debate.debate_formats(id);"
  },
  {
    "format": "ALTER TABLE debate.ballots ADD CONSTRAINT ballots_judge_id_fkey FOREIGN KEY (judge_id) REFERENCES public.judge(id);"
  },
  {
    "format": "ALTER TABLE debate.criteria ADD CONSTRAINT criteria_format_id_fkey FOREIGN KEY (format_id) REFERENCES debate.debate_formats(id);"
  },
  {
    "format": "ALTER TABLE debate.debate_participants ADD CONSTRAINT debate_participants_debate_team_id_fkey FOREIGN KEY (debate_team_id) REFERENCES debate.debate_teams(id);"
  },
  {
    "format": "ALTER TABLE debate.debate_participants ADD CONSTRAINT debate_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.student(user_id);"
  },
  {
    "format": "ALTER TABLE debate.debate_teams ADD CONSTRAINT debate_teams_debate_id_fkey FOREIGN KEY (debate_id) REFERENCES debate.debates(id);"
  },
  {
    "format": "ALTER TABLE debate.debate_teams ADD CONSTRAINT debate_teams_side_id_fkey FOREIGN KEY (side_id) REFERENCES debate.sides(id);"
  },
  {
    "format": "ALTER TABLE debate.debates ADD CONSTRAINT debates_debate_format_id_fkey FOREIGN KEY (debate_format_id) REFERENCES debate.debate_formats(id);"
  },
  {
    "format": "ALTER TABLE debate.debates ADD CONSTRAINT debates_motion_id_fkey FOREIGN KEY (motion_id) REFERENCES debate.motions(id);"
  },
  {
    "format": "ALTER TABLE debate.format_rounds ADD CONSTRAINT format_rounds_debate_format_id_fkey FOREIGN KEY (debate_format_id) REFERENCES debate.debate_formats(id);"
  },
  {
    "format": "ALTER TABLE debate.format_rounds ADD CONSTRAINT format_rounds_round_template_id_fkey FOREIGN KEY (round_template_id) REFERENCES debate.round_templates(id);"
  },
  {
    "format": "ALTER TABLE debate.format_rounds ADD CONSTRAINT format_rounds_side_id_fkey FOREIGN KEY (side_id) REFERENCES debate.sides(id);"
  },
  {
    "format": "ALTER TABLE debate.genres ADD CONSTRAINT genres_proposer_id_fkey FOREIGN KEY (proposer_id) REFERENCES public.profile(id);"
  },
  {
    "format": "ALTER TABLE debate.judge_comments ADD CONSTRAINT judge_comments_criteria_id_fkey FOREIGN KEY (criteria_id) REFERENCES debate.criteria(id);"
  },
  {
    "format": "ALTER TABLE debate.judge_comments ADD CONSTRAINT judge_comments_judge_id_fkey FOREIGN KEY (judge_id) REFERENCES public.judge(user_id);"
  },
  {
    "format": "ALTER TABLE debate.judge_comments ADD CONSTRAINT judge_comments_video_id_fkey FOREIGN KEY (video_id) REFERENCES debate.videos(id);"
  },
  {
    "format": "ALTER TABLE debate.judge_scores ADD CONSTRAINT judge_scores_criteria_id_fkey FOREIGN KEY (criteria_id) REFERENCES debate.criteria(id);"
  },
  {
    "format": "ALTER TABLE debate.judge_scores ADD CONSTRAINT judge_scores_debate_id_fkey FOREIGN KEY (debate_id) REFERENCES debate.debates(id);"
  },
  {
    "format": "ALTER TABLE debate.judge_scores ADD CONSTRAINT judge_scores_judge_id_fkey FOREIGN KEY (judge_id) REFERENCES public.judge(user_id);"
  },
  {
    "format": "ALTER TABLE debate.matchmaking_queue_entries ADD CONSTRAINT matchmaking_queue_entries_debate_format_id_fkey FOREIGN KEY (debate_format_id) REFERENCES debate.debate_formats(id);"
  },
  {
    "format": "ALTER TABLE debate.matchmaking_queue_entries ADD CONSTRAINT matchmaking_queue_entries_debate_id_fkey FOREIGN KEY (debate_id) REFERENCES debate.debates(id);"
  },
  {
    "format": "ALTER TABLE debate.matchmaking_queue_entries ADD CONSTRAINT matchmaking_queue_entries_opponent_id_fkey FOREIGN KEY (opponent_id) REFERENCES public.team(id);"
  },
  {
    "format": "ALTER TABLE debate.matchmaking_queue_entries ADD CONSTRAINT matchmaking_queue_entries_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.team(id);"
  },
  {
    "format": "ALTER TABLE debate.motions ADD CONSTRAINT motions_genre_id_fkey FOREIGN KEY (genre_id) REFERENCES debate.genres(id);"
  },
  {
    "format": "ALTER TABLE debate.motions ADD CONSTRAINT motions_proposer_id_fkey FOREIGN KEY (proposer_id) REFERENCES public.profile(id);"
  },
  {
    "format": "ALTER TABLE debate.speeches ADD CONSTRAINT speeches_debate_id_fkey FOREIGN KEY (debate_id) REFERENCES debate.debates(id);"
  },
  {
    "format": "ALTER TABLE debate.speeches ADD CONSTRAINT speeches_format_round_id_fkey FOREIGN KEY (format_round_id) REFERENCES debate.format_rounds(id);"
  },
  {
    "format": "ALTER TABLE debate.speeches ADD CONSTRAINT speeches_participant_id_fkey FOREIGN KEY (participant_id) REFERENCES debate.debate_participants(id);"
  },
  {
    "format": "ALTER TABLE debate.videos ADD CONSTRAINT videos_debate_id_fkey FOREIGN KEY (debate_id) REFERENCES debate.debates(id);"
  },
  {
    "format": "ALTER TABLE debate.videos ADD CONSTRAINT videos_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.profile(id);"
  },
  {
    "format": "ALTER TABLE public.admin ADD CONSTRAINT admin_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);"
  },
  {
    "format": "ALTER TABLE public.bank_account ADD CONSTRAINT \"BankAccount_guardianId_fkey\" FOREIGN KEY (guardian_id) REFERENCES public.guardian(id);"
  },
  {
    "format": "ALTER TABLE public.friendship ADD CONSTRAINT friendship_friend_id_fkey FOREIGN KEY (friend_id) REFERENCES public.student(user_id);"
  },
  {
    "format": "ALTER TABLE public.friendship ADD CONSTRAINT friendship_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.student(user_id);"
  },
  {
    "format": "ALTER TABLE public.guardian ADD CONSTRAINT \"Guardian_userId_fkey\" FOREIGN KEY (user_id) REFERENCES public.profile(id);"
  },
  {
    "format": "ALTER TABLE public.guardian_request ADD CONSTRAINT guardian_request_reciever_fkey FOREIGN KEY (reciever) REFERENCES public.profile(id);"
  },
  {
    "format": "ALTER TABLE public.guardian_request ADD CONSTRAINT guardian_request_sender_fkey FOREIGN KEY (sender) REFERENCES public.profile(id);"
  },
  {
    "format": "ALTER TABLE public.guild ADD CONSTRAINT \"Guild_schoolId_fkey\" FOREIGN KEY (school_id) REFERENCES public.school(id);"
  },
  {
    "format": "ALTER TABLE public.guild_member ADD CONSTRAINT \"GuildMember_guildId_fkey\" FOREIGN KEY (guild_id) REFERENCES public.guild(id);"
  },
  {
    "format": "ALTER TABLE public.guild_member ADD CONSTRAINT \"GuildMember_studentId_fkey\" FOREIGN KEY (student_id) REFERENCES public.student(id);"
  },
  {
    "format": "ALTER TABLE public.invitation ADD CONSTRAINT \"Invitation_guildId_fkey\" FOREIGN KEY (guild_id) REFERENCES public.guild(id);"
  },
  {
    "format": "ALTER TABLE public.invitation ADD CONSTRAINT \"Invitation_inviteeId_fkey\" FOREIGN KEY (invitee_id) REFERENCES public.profile(id);"
  },
  {
    "format": "ALTER TABLE public.invitation ADD CONSTRAINT \"Invitation_inviterId_fkey\" FOREIGN KEY (inviter_id) REFERENCES public.profile(id);"
  },
  {
    "format": "ALTER TABLE public.invitation ADD CONSTRAINT \"Invitation_teamId_fkey\" FOREIGN KEY (team_id) REFERENCES public.team(id);"
  },
  {
    "format": "ALTER TABLE public.judge ADD CONSTRAINT \"Judge_referralUserId_fkey\" FOREIGN KEY (referral_user_id) REFERENCES public.profile(id);"
  },
  {
    "format": "ALTER TABLE public.judge ADD CONSTRAINT \"Judge_userId_fkey\" FOREIGN KEY (user_id) REFERENCES public.profile(id);"
  },
  {
    "format": "ALTER TABLE public.log ADD CONSTRAINT \"Log_guildId_fkey\" FOREIGN KEY (guild_id) REFERENCES public.guild(id);"
  },
  {
    "format": "ALTER TABLE public.log ADD CONSTRAINT \"Log_studentId_fkey\" FOREIGN KEY (student_id) REFERENCES public.student(id);"
  },
  {
    "format": "ALTER TABLE public.log ADD CONSTRAINT \"Log_teamId_fkey\" FOREIGN KEY (team_id) REFERENCES public.team(id);"
  },
  {
    "format": "ALTER TABLE public.payment_history ADD CONSTRAINT \"PaymentHistory_guardianId_fkey\" FOREIGN KEY (guardian_id) REFERENCES public.guardian(id);"
  },
  {
    "format": "ALTER TABLE public.profile ADD CONSTRAINT \"User_id_fkey\" FOREIGN KEY (id) REFERENCES auth.users(id);"
  },
  {
    "format": "ALTER TABLE public.rating ADD CONSTRAINT \"Rating_judgeId_fkey\" FOREIGN KEY (judge_id) REFERENCES public.judge(id);"
  },
  {
    "format": "ALTER TABLE public.rating ADD CONSTRAINT \"Rating_raterId_fkey\" FOREIGN KEY (rater_id) REFERENCES public.student(id);"
  },
  {
    "format": "ALTER TABLE public.student ADD CONSTRAINT \"Student_guardianId_fkey\" FOREIGN KEY (guardian_id) REFERENCES public.guardian(id);"
  },
  {
    "format": "ALTER TABLE public.student ADD CONSTRAINT \"Student_schoolId_fkey\" FOREIGN KEY (school_id) REFERENCES public.school(id);"
  },
  {
    "format": "ALTER TABLE public.student ADD CONSTRAINT student_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profile(id);"
  },
  {
    "format": "ALTER TABLE public.team_member ADD CONSTRAINT \"TeamMember_teamId_fkey\" FOREIGN KEY (team_id) REFERENCES public.team(id);"
  },
  {
    "format": "ALTER TABLE public.team_member ADD CONSTRAINT team_member_student_id_fkey1 FOREIGN KEY (student_id) REFERENCES public.profile(id);"
  }
]
```

### 5. Extract Functions
```json
[
  {
    "?column?": "CREATE OR REPLACE FUNCTION chat.approve_friendship(p_friendship_id uuid)\n RETURNS uuid\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\nDECLARE\n  f RECORD;\n  room_id UUID;\nBEGIN\n  -- 1) friendship 존재 및 PENDING 확인\n  SELECT * INTO f\n    FROM public.friendship\n   WHERE id = p_friendship_id;\n  IF NOT FOUND THEN\n    RAISE EXCEPTION 'Friendship % not found', p_friendship_id;\n  END IF;\n  IF f.status = 'ACCEPTED' THEN\n    -- 이미 승인된 경우, 기존 방 있으면 리턴\n    SELECT r.id INTO room_id\n      FROM chat.room r\n      JOIN chat.participant p1 ON p1.room_id = r.id AND p1.student_id = f.user_id\n      JOIN chat.participant p2 ON p2.room_id = r.id AND p2.student_id = f.friend_id\n     WHERE r.type = 'FRIEND'\n     LIMIT 1;\n    IF room_id IS NOT NULL THEN\n      RETURN room_id;\n    END IF;\n  END IF;\n\n  -- 2) 상태 업데이트\n  UPDATE public.friendship\n     SET status = 'ACCEPTED', accpted_at = NOW(), updated_at = NOW()\n   WHERE id = p_friendship_id;\n\n  -- 3) 채팅방 생성\n  INSERT INTO chat.room(type)\n  VALUES ('FRIEND')\n  RETURNING id INTO room_id;\n\n  -- 4) participant 추가\n  INSERT INTO chat.participant(room_id, student_id)\n  VALUES (room_id, f.user_id), (room_id, f.friend_id)\n  ON CONFLICT DO NOTHING;\n\n  RETURN room_id;\nEND;\n$function$\n;"
  },
  {
    "?column?": "CREATE OR REPLACE FUNCTION chat.fn_add_guild_member_to_room()\n RETURNS trigger\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\nDECLARE\n  rid UUID;\nBEGIN\n  IF (TG_OP = 'INSERT' AND NEW.status = 'ACCEPTED')\n   OR (TG_OP = 'UPDATE' AND NEW.status = 'ACCEPTED' AND OLD.status <> 'ACCEPTED')\n  THEN\n    SELECT id INTO rid\n      FROM chat.room\n     WHERE type = 'GUILD' AND guild_id = NEW.guild_id\n     LIMIT 1;\n    IF rid IS NOT NULL THEN\n      INSERT INTO chat.participant(room_id, student_id)\n      VALUES (rid, NEW.student_id)\n      ON CONFLICT DO NOTHING;\n    END IF;\n  END IF;\n  RETURN NEW;\nEND;\n$function$\n;"
  },
  {
    "?column?": "CREATE OR REPLACE FUNCTION chat.fn_add_team_member_to_room()\n RETURNS trigger\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\nDECLARE\n  rid UUID;\nBEGIN\n  IF (TG_OP = 'INSERT' AND NEW.status = 'ACCEPTED')\n   OR (TG_OP = 'UPDATE' AND NEW.status = 'ACCEPTED' AND OLD.status <> 'ACCEPTED')\n  THEN\n    SELECT id INTO rid\n      FROM chat.room\n     WHERE type = 'TEAM' AND team_id = NEW.team_id\n     LIMIT 1;\n    IF rid IS NOT NULL THEN\n      INSERT INTO chat.participant(room_id, student_id)\n      VALUES (rid, NEW.student_id)\n      ON CONFLICT DO NOTHING;\n    END IF;\n  END IF;\n  RETURN NEW;\nEND;\n$function$\n;"
  },
  {
    "?column?": "CREATE OR REPLACE FUNCTION chat.fn_create_guild_room()\n RETURNS trigger\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\nBEGIN\n  INSERT INTO chat.room(type, title, guild_id)\n  VALUES ('GUILD', NEW.name, NEW.id);\n  RETURN NEW;\nEND;\n$function$\n;"
  },
  {
    "?column?": "CREATE OR REPLACE FUNCTION chat.fn_create_team_room()\n RETURNS trigger\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\nBEGIN\n  INSERT INTO chat.room(type, title, team_id)\n  VALUES ('TEAM', NEW.name, NEW.id);\n  RETURN NEW;\nEND;\n$function$\n;"
  },
  {
    "?column?": "CREATE OR REPLACE FUNCTION chat.fn_sync_guild_room_title()\n RETURNS trigger\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\nBEGIN\n  UPDATE chat.room\n    SET title = NEW.name, updated_at = NOW()\n  WHERE type = 'GUILD' AND guild_id = NEW.id;\n  RETURN NEW;\nEND;\n$function$\n;"
  },
  {
    "?column?": "CREATE OR REPLACE FUNCTION chat.fn_sync_team_room_title()\n RETURNS trigger\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\nBEGIN\n  UPDATE chat.room\n    SET title = NEW.name, updated_at = NOW()\n  WHERE type = 'TEAM' AND team_id = NEW.id;\n  RETURN NEW;\nEND;\n$function$\n;"
  },
  {
    "?column?": "CREATE OR REPLACE FUNCTION chat.get_friend_room(p_user uuid, p_friend uuid)\n RETURNS chat.room\n LANGUAGE sql\n SECURITY DEFINER\nAS $function$\n  SELECT r.*\n  FROM chat.room r\n  JOIN chat.participant p1 ON p1.room_id = r.id AND p1.student_id = p_user\n  JOIN chat.participant p2 ON p2.room_id = r.id AND p2.student_id = p_friend\n  WHERE r.type = 'FRIEND'\n  LIMIT 1\n$function$\n;"
  },
  {
    "?column?": "CREATE OR REPLACE FUNCTION chat.get_room_messages(p_room_id uuid)\n RETURNS TABLE(id uuid, room_id uuid, sender_id uuid, content text, is_system boolean, created_at timestamp with time zone, updated_at timestamp with time zone, sender_name text, image_path text)\n LANGUAGE sql\n SECURITY DEFINER\nAS $function$\n  SELECT\n    m.id,\n    m.room_id,\n    m.sender_id,\n    m.content,\n    m.is_system,\n    m.created_at,\n    m.updated_at,\n    p.name        AS sender_name,\n    p.image_path\n  FROM chat.message AS m\n  JOIN public.profile AS p\n    ON p.id = m.sender_id\n  WHERE m.room_id = p_room_id\n  ORDER BY m.created_at ASC;\n$function$\n;"
  },
  {
    "?column?": "CREATE OR REPLACE FUNCTION chat.is_room_member(p_room_id uuid, p_user_id uuid)\n RETURNS boolean\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\nDECLARE\n  _t   TEXT;\n  _tid UUID;\n  _gid UUID;\nBEGIN\n  SELECT type, team_id, guild_id\n    INTO _t, _tid, _gid\n    FROM chat.room\n   WHERE id = p_room_id;\n\n  IF _t = 'FRIEND' THEN\n    RETURN EXISTS(\n      SELECT 1 FROM chat.participant p\n       WHERE p.room_id    = p_room_id\n         AND p.student_id = p_user_id\n    );\n  ELSIF _t = 'TEAM' THEN\n    RETURN EXISTS(\n      SELECT 1 FROM public.team_member tm\n       WHERE tm.team_id    = _tid\n         AND tm.student_id = p_user_id\n         AND tm.status     = 'ACCEPTED'::public.status\n    );\n  ELSIF _t = 'GUILD' THEN\n    RETURN EXISTS(\n      SELECT 1 FROM public.guild_member gm\n       WHERE gm.guild_id    = _gid\n         AND gm.student_id  = p_user_id\n         AND gm.status      = 'ACCEPTED'::public.status\n    );\n  ELSE\n    RETURN FALSE;\n  END IF;\nEND;\n$function$\n;"
  },
  {
    "?column?": "CREATE OR REPLACE FUNCTION chat.set_timestamp()\n RETURNS trigger\n LANGUAGE plpgsql\nAS $function$\nBEGIN\n  NEW.updated_at := NOW();\n  RETURN NEW;\nEND;\n$function$\n;"
  },
  {
    "?column?": "CREATE OR REPLACE FUNCTION public.add_new_user()\n RETURNS trigger\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\nbegin\n  if new.raw_app_meta_data ->> 'provider' = 'email' then\n    insert into public.profile (id)\n    values (new.id);\n    \n  elsif new.raw_app_meta_data ->> 'provider' = 'kakao'\n        or new.raw_app_meta_data ->> 'provider' = 'google' then\n    insert into public.profile (id, email, name, image_path)\n    values (\n      new.id,\n      new.email,\n      new.raw_user_meta_data ->> 'name',\n      new.raw_user_meta_data ->> 'avatar_url'\n    );\n  end if;\n  \n  return new;\nend;\n$function$\n;"
  },
  {
    "?column?": "CREATE OR REPLACE FUNCTION public.check_friendship_update_allowed_columns()\n RETURNS trigger\n LANGUAGE plpgsql\nAS $function$\nBEGIN\n  IF NEW.user_id IS DISTINCT FROM OLD.user_id THEN\n    RAISE EXCEPTION 'user_id는 업데이트할 수 없습니다.';\n  END IF;\n  \n  IF NEW.friend_id IS DISTINCT FROM OLD.friend_id THEN\n    RAISE EXCEPTION 'friend_id는 업데이트할 수 없습니다.';\n  END IF;\n  \n  IF NEW.created_at IS DISTINCT FROM OLD.created_at THEN\n    RAISE EXCEPTION 'created_at은 업데이트할 수 없습니다.';\n  END IF;\n  \n  RETURN NEW;\nEND;\n$function$\n;"
  },
  {
    "?column?": "CREATE OR REPLACE FUNCTION public.check_insert_allowed_columns()\n RETURNS trigger\n LANGUAGE plpgsql\nAS $function$\nBEGIN\n  -- division는 삽입할 수 없음\n  IF NEW.division IS NOT NULL THEN\n    RAISE EXCEPTION 'division은 삽입할 수 없습니다.';\n  END IF;\n\n  IF NEW.level != 0 THEN\n    RAISE EXCEPTION 'level은 삽입할 수 없습니다.';\n  END IF;\n\n  IF NEW.exp != 0 THEN\n    RAISE EXCEPTION 'exp는 삽입할 수 없습니다.';\n  END IF;\n\n  IF NEW.ranking != '0'::smallint THEN\n    RAISE EXCEPTION 'ranking은 삽입할 수 없습니다.';\n  END IF;\n  \n  RETURN NEW;\nEND;\n$function$\n;"
  },
  {
    "?column?": "CREATE OR REPLACE FUNCTION public.check_team_member_delete()\n RETURNS trigger\n LANGUAGE plpgsql\nAS $function$\nBEGIN\n  -- 삭제 요청자가 본인(student_id)인지 확인\n  IF auth.uid()::uuid <> OLD.student_id THEN\n    -- 본인이 아니면 같은 팀에서 is_leader = true 인지 확인\n    IF NOT EXISTS (\n      SELECT 1\n      FROM public.team_member tm\n      WHERE tm.team_id = OLD.team_id\n        AND tm.student_id = auth.uid()::uuid\n        AND tm.is_leader = TRUE\n    ) THEN\n      RAISE EXCEPTION '삭제 권한이 없습니다. 본인이거나 팀 리더만 삭제할 수 있습니다.';\n    END IF;\n  END IF;\n  RETURN OLD;\nEND;\n$function$\n;"
  },
  {
    "?column?": "CREATE OR REPLACE FUNCTION public.check_team_update_leader()\n RETURNS trigger\n LANGUAGE plpgsql\nAS $function$\nBEGIN\n  -- 인증된 사용자만\n  IF auth.uid() IS NULL THEN\n    RAISE EXCEPTION 'Unauthorized: 로그인한 사용자만 접근할 수 있습니다.';\n  END IF;\n\n  -- 해당 팀의 리더인지 확인\n  IF NOT EXISTS (\n    SELECT 1\n    FROM public.team_member tm\n    WHERE tm.team_id   = OLD.id\n      AND tm.student_id = auth.uid()::uuid\n      AND tm.is_leader  = TRUE\n  ) THEN\n    RAISE EXCEPTION 'Permission denied: 오직 팀 리더만 팀 정보를 수정할 수 있습니다.';\n  END IF;\n\n  RETURN NEW;\nEND;\n$function$\n;"
  },
  {
    "?column?": "CREATE OR REPLACE FUNCTION public.check_update_allowed_columns()\n RETURNS trigger\n LANGUAGE plpgsql\nAS $function$\nBEGIN\n  -- division는 변경할 수 없음\n  IF NEW.division IS DISTINCT FROM OLD.division THEN\n    RAISE EXCEPTION 'division는 변경할 수 없습니다.';\n  END IF;\n  \n  RETURN NEW;\nEND;\n$function$\n;"
  },
  {
    "?column?": "CREATE OR REPLACE FUNCTION public.delete_empty_team_after_member_delete()\n RETURNS trigger\n LANGUAGE plpgsql\nAS $function$\nBEGIN\n  -- 삭제된 멤버의 team_id에 해당하는 남은 멤버 수 조회\n  IF NOT EXISTS (\n    SELECT 1\n    FROM public.team_member\n    WHERE team_id = OLD.team_id\n  ) THEN\n    -- 남은 멤버가 없으면 team 삭제\n    DELETE FROM public.team\n    WHERE id = OLD.team_id;\n  END IF;\n  RETURN NULL;\nEND;\n$function$\n;"
  },
  {
    "?column?": "CREATE OR REPLACE FUNCTION public.delete_invalid_friendship()\n RETURNS trigger\n LANGUAGE plpgsql\nAS $function$\nbegin\n  -- 상태가 허용된 값에 없다면\n  if new.status not in ('PENDING', 'ACCEPTED') then\n    -- 방금 삽입/수정된 행을 삭제\n    delete from public.friendship\n      where id = new.id;\n  end if;\n  -- AFTER 트리거이므로 반환값은 무시되지만, convention 상 null을 반환\n  return null;\nend;\n$function$\n;"
  },
  {
    "?column?": "CREATE OR REPLACE FUNCTION public.get_friend_list()\n RETURNS TABLE(id uuid, friend_id uuid, created_at timestamp with time zone, updated_at timestamp with time zone, status status)\n LANGUAGE plpgsql\n STABLE SECURITY DEFINER\nAS $function$\nBEGIN\n  RETURN QUERY\n  SELECT\n    f.id AS id,\n    CASE \n      WHEN f.user_id = auth.uid() THEN f.friend_id\n      ELSE f.user_id\n    END AS friend_id,\n    f.created_at,\n    f.updated_at,\n    f.status\n  FROM public.friendship f\n  WHERE (f.user_id = auth.uid() OR f.friend_id = auth.uid());\nEND;\n$function$\n;"
  },
  {
    "?column?": "CREATE OR REPLACE FUNCTION public.get_friend_profiles()\n RETURNS TABLE(id uuid, friend_id uuid, image_path text, username text, exp integer)\n LANGUAGE plpgsql\n STABLE SECURITY DEFINER\nAS $function$\nDECLARE\n  current_user uuid;\nBEGIN  \n  RETURN QUERY\n  SELECT \n    f.id AS friendship_id,\n    CASE \n      WHEN f.user_id = auth.uid() THEN f.friend_id \n      ELSE f.user_id \n    END AS friend_id,\n    p.image_path,\n    p.username,\n    s.exp\n  FROM public.friendship f\n  JOIN public.profile p\n    ON p.id = (\n         CASE \n           WHEN f.user_id = auth.uid() THEN f.friend_id \n           ELSE f.user_id \n         END\n       )\n  JOIN public.student s\n    ON s.user_id = p.id\n  WHERE (f.user_id = auth.uid() OR f.friend_id = auth.uid())\n    AND f.status = 'ACCEPTED';\nEND;\n$function$\n;"
  },
  {
    "?column?": "CREATE OR REPLACE FUNCTION public.get_profile_and_student(_user_id uuid)\n RETURNS TABLE(id uuid, name text, username text, image_path text, date_of_birth date, gender gender, user_role user_role_type, active boolean, term_agree_time timestamp with time zone, email text, invited boolean, student_id uuid, guardian_id uuid, school_id uuid, division division, location text, exp integer, ranking smallint, challenge_enabled boolean, graduation_year bigint, relationship_with_guardian text, level integer)\n LANGUAGE plpgsql\n STABLE\nAS $function$\nbegin\n  -- 1) Profile 존재 체크\n  if not exists (\n    select 1 from public.profile where id = _user_id\n  ) then\n    raise exception 'Profile not found' using errcode = 'P0001';\n  end if;\n\n  -- 2) Student 존재 체크\n  if not exists (\n    select 1 from public.student where user_id = _user_id\n  ) then\n    raise exception 'Student not found' using errcode = 'P0002';\n  end if;\n\n  -- 3) 실제 데이터 리턴\n  return query\n    select\n      p.id, p.name, p.username, p.image_path, p.date_of_birth,\n      p.gender, p.user_role, p.active, p.term_agree_time, p.email, p.invited,\n      s.id           as student_id,\n      s.guardian_id,\n      s.school_id,\n      s.division,\n      s.location,\n      s.exp,\n      s.ranking,\n      s.challenge_enabled,\n      s.graduation_year,\n      s.relationship_with_guardian,\n      s.level\n    from public.profile p\n    left join public.student s on s.user_id = p.id\n    where p.id = _user_id;\nend;\n$function$\n;"
  },
  {
    "?column?": "CREATE OR REPLACE FUNCTION public.get_profile_uuid(input text)\n RETURNS uuid\n LANGUAGE plpgsql\n STABLE\nAS $function$\nDECLARE\n    id uuid;\nBEGIN\n    SELECT p.id\n      INTO id\n      FROM public.profile p\n     WHERE p.email = input OR p.username = input\n     LIMIT 1;\n\n    RETURN id;\nEND;\n$function$\n;"
  },
  {
    "?column?": "CREATE OR REPLACE FUNCTION public.get_table_ddl(p_schema_name character varying, p_table_name character varying)\n RETURNS text\n LANGUAGE plpgsql\nAS $function$\r\nDECLARE\r\n  v_table_ddl text;\r\n  column_record record;\r\n  constraint_record record;\r\n  index_record record;\r\nBEGIN\r\n  -- Start the create table statement\r\n  v_table_ddl := 'CREATE TABLE ' || p_schema_name || '.' || p_table_name || ' (' || chr(10);\r\n  \r\n  -- Get columns\r\n  FOR column_record IN \r\n    SELECT \r\n      column_name,\r\n      data_type,\r\n      coalesce(character_maximum_length::text, '') as character_maximum_length,\r\n      is_nullable,\r\n      column_default\r\n    FROM \r\n      information_schema.columns\r\n    WHERE \r\n      table_schema = p_schema_name\r\n      AND table_name = p_table_name\r\n    ORDER BY \r\n      ordinal_position \r\n  LOOP\r\n    v_table_ddl := v_table_ddl || '  ' || column_record.column_name || ' ' || column_record.data_type;\r\n    \r\n    -- Add length for varchar\r\n    IF column_record.character_maximum_length <> '' THEN\r\n      v_table_ddl := v_table_ddl || '(' || column_record.character_maximum_length || ')';\r\n    END IF;\r\n    \r\n    -- Add nullable\r\n    IF column_record.is_nullable = 'NO' THEN\r\n      v_table_ddl := v_table_ddl || ' NOT NULL';\r\n    END IF;\r\n    \r\n    -- Add default\r\n    IF column_record.column_default IS NOT NULL THEN\r\n      v_table_ddl := v_table_ddl || ' DEFAULT ' || column_record.column_default;\r\n    END IF;\r\n    \r\n    v_table_ddl := v_table_ddl || ',' || chr(10);\r\n  END LOOP;\r\n\r\n  -- Remove the last comma and newline\r\n  v_table_ddl := substring(v_table_ddl, 1, length(v_table_ddl) - 2) || chr(10) || ');';\r\n  \r\n  -- Add primary key constraint\r\n  FOR constraint_record IN\r\n    SELECT \r\n      tc.constraint_name,\r\n      string_agg(kcu.column_name, ', ') as columns\r\n    FROM \r\n      information_schema.table_constraints tc\r\n      JOIN information_schema.key_column_usage kcu\r\n        ON tc.constraint_catalog = kcu.constraint_catalog\r\n        AND tc.constraint_schema = kcu.constraint_schema\r\n        AND tc.constraint_name = kcu.constraint_name\r\n    WHERE \r\n      tc.constraint_type = 'PRIMARY KEY'\r\n      AND tc.table_schema = p_schema_name\r\n      AND tc.table_name = p_table_name\r\n    GROUP BY\r\n      tc.constraint_name\r\n  LOOP\r\n    v_table_ddl := v_table_ddl || chr(10) || 'ALTER TABLE ' || p_schema_name || '.' || p_table_name || \r\n                  ' ADD CONSTRAINT ' || constraint_record.constraint_name || \r\n                  ' PRIMARY KEY (' || constraint_record.columns || ');';\r\n  END LOOP;\r\n  \r\n  RETURN v_table_ddl;\r\nEND;\r\n$function$\n;"
  },
  {
    "?column?": "CREATE OR REPLACE FUNCTION public.search_school(search_query text)\n RETURNS TABLE(id uuid, name text)\n LANGUAGE sql\n STABLE\nAS $function$\nwith preprocessed as (\n  select \n    id, \n    name,\n    translate(lower(name), ' ', '') as name_nospace,\n    translate(lower(search_query), ' ', '') as query_nospace\n  from school\n)\nselect id, name\nfrom (\n  select \n    id, \n    name,\n    case \n      when name_nospace ilike '%' || query_nospace || '%' then 1.0\n      else similarity(name_nospace, query_nospace)\n    end as score\n  from preprocessed\n) t\nwhere score > 0.1\norder by score desc;\n$function$\n;"
  },
  {
    "?column?": "CREATE OR REPLACE FUNCTION public.set_division()\n RETURNS trigger\n LANGUAGE plpgsql\nAS $function$\nDECLARE\n  current_year INT := EXTRACT(YEAR FROM CURRENT_DATE)::INT;\n  adjusted_year INT;\n  current_grade INT;\nBEGIN\n  -- 7월 1일 기준으로 학년도 조정\n  IF CURRENT_DATE >= make_date(current_year, 7, 1) THEN\n    adjusted_year := current_year + 1;\n  ELSE\n    adjusted_year := current_year;\n  END IF;\n\n  -- 현재 학년 계산 (학생은 4학년부터 시작, 총 9년 과정으로 가정)\n  -- graduationYear가 졸업하는 해라면, 현재 학년 = adjusted_year - graduationYear + 12\n  current_grade := adjusted_year - NEW.graduation_year + 12;\n\n  -- 학년에 따른 division 설정\n  IF current_grade BETWEEN 4 AND 5 THEN\n    NEW.division := 'VILLIGER';\n  ELSIF current_grade BETWEEN 6 AND 7 THEN\n    NEW.division := 'LOWER';\n  ELSIF current_grade BETWEEN 8 AND 9 THEN\n    NEW.division := 'UPPER';\n  ELSIF current_grade BETWEEN 10 AND 12 THEN\n    NEW.division := 'SENIOR';\n  ELSE\n    NEW.division := 'OPEN';\n  END IF;\n\n  RETURN NEW;\nEND;\n$function$\n;"
  },
  {
    "?column?": "CREATE OR REPLACE FUNCTION public.set_team_leader(p_team_id uuid, p_student_id uuid)\n RETURNS void\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\nBEGIN\n  -- 1. 인증 여부 확인\n  IF auth.uid() IS NULL THEN\n    RAISE EXCEPTION 'Unauthorized: 로그인된 사용자만 호출할 수 있습니다.';\n  END IF;\n\n  -- 2. 호출자가 해당 팀의 멤버인지 확인\n  IF NOT EXISTS (\n    SELECT 1\n      FROM public.team_member\n     WHERE team_id    = p_team_id\n       AND student_id = auth.uid()::uuid\n  ) THEN\n    RAISE EXCEPTION 'Permission denied: 호출자가 팀의 멤버가 아닙니다.';\n  END IF;\n\n  -- 3. 호출자가 현재 팀 리더인지 확인\n  IF NOT EXISTS (\n    SELECT 1\n      FROM public.team_member\n     WHERE team_id    = p_team_id\n       AND student_id = auth.uid()::uuid\n       AND is_leader  = TRUE\n  ) THEN\n    RAISE EXCEPTION 'Permission denied: 오직 현재 팀 리더만 리더를 변경할 수 있습니다.';\n  END IF;\n\n  -- 4. 새 리더가 같은 팀의 멤버인지 확인\n  IF NOT EXISTS (\n    SELECT 1\n      FROM public.team_member\n     WHERE team_id    = p_team_id\n       AND student_id = p_student_id\n  ) THEN\n    RAISE EXCEPTION 'Cannot set leader: 대상 사용자가 해당 팀의 멤버가 아닙니다.';\n  END IF;\n\n  -- 5. 기존 리더들 해제\n  UPDATE public.team_member\n     SET is_leader = FALSE\n   WHERE team_id   = p_team_id\n     AND is_leader = TRUE;\n\n  -- 6. 새로운 리더 지정\n  UPDATE public.team_member\n     SET is_leader = TRUE\n   WHERE team_id    = p_team_id\n     AND student_id = p_student_id;\nEND;\n$function$\n;"
  }
]
```

### 6. Extract Triggers
```json
[
  {
    "format": "CREATE TRIGGER trg_message_updated_at BEFORE UPDATE ON chat.message FOR EACH ROW EXECUTE FUNCTION set_timestamp();"
  },
  {
    "format": "CREATE TRIGGER trg_room_updated_at BEFORE UPDATE ON chat.room FOR EACH ROW EXECUTE FUNCTION set_timestamp();"
  },
  {
    "format": "CREATE TRIGGER check_friendship_update_allowed_columns_trigger BEFORE UPDATE ON public.friendship FOR EACH ROW EXECUTE FUNCTION check_friendship_update_allowed_columns();"
  },
  {
    "format": "CREATE TRIGGER trg_cleanup_friendship_status AFTER INSERT ON public.friendship FOR EACH ROW EXECUTE FUNCTION delete_invalid_friendship();"
  },
  {
    "format": "CREATE TRIGGER trg_guild_create_room AFTER INSERT ON public.guild FOR EACH ROW EXECUTE FUNCTION fn_create_guild_room();"
  },
  {
    "format": "CREATE TRIGGER trg_guild_update_room_title AFTER UPDATE ON public.guild FOR EACH ROW EXECUTE FUNCTION fn_sync_guild_room_title();"
  },
  {
    "format": "CREATE TRIGGER trg_guild_member_add_participant AFTER INSERT ON public.guild_member FOR EACH ROW EXECUTE FUNCTION fn_add_guild_member_to_room();"
  },
  {
    "format": "CREATE TRIGGER check_insert_allowed_columns_trigger BEFORE INSERT ON public.student FOR EACH ROW EXECUTE FUNCTION check_insert_allowed_columns();"
  },
  {
    "format": "CREATE TRIGGER check_update_allowed_columns_trigger BEFORE UPDATE ON public.student FOR EACH ROW EXECUTE FUNCTION check_update_allowed_columns();"
  },
  {
    "format": "CREATE TRIGGER trg_set_division BEFORE INSERT ON public.student FOR EACH ROW EXECUTE FUNCTION set_division();"
  },
  {
    "format": "CREATE TRIGGER trg_before_update_team BEFORE UPDATE ON public.team FOR EACH ROW EXECUTE FUNCTION check_team_update_leader();"
  },
  {
    "format": "CREATE TRIGGER trg_team_create_room AFTER INSERT ON public.team FOR EACH ROW EXECUTE FUNCTION fn_create_team_room();"
  },
  {
    "format": "CREATE TRIGGER trg_team_update_room_title AFTER UPDATE ON public.team FOR EACH ROW EXECUTE FUNCTION fn_sync_team_room_title();"
  },
  {
    "format": "CREATE TRIGGER trg_after_delete_team_member AFTER DELETE ON public.team_member FOR EACH ROW EXECUTE FUNCTION delete_empty_team_after_member_delete();"
  },
  {
    "format": "CREATE TRIGGER trg_before_delete_team_member BEFORE DELETE ON public.team_member FOR EACH ROW EXECUTE FUNCTION check_team_member_delete();"
  },
  {
    "format": "CREATE TRIGGER trg_team_member_add_participant AFTER INSERT ON public.team_member FOR EACH ROW EXECUTE FUNCTION fn_add_team_member_to_room();"
  }
]
```

### 7. Extract RLS Policies
```json
[
  {
    "format": "CREATE POLICY delete_message ON chat.message AS PERMISSIVE FOR DELETE TO 0\n    USING (((sender_id = auth.uid()) OR (auth.role() = 'admin'::text)));"
  },
  {
    "format": "CREATE POLICY insert_message ON chat.message AS PERMISSIVE FOR INSERT TO 0\n    WITH CHECK ((EXISTS ( SELECT 1\n   FROM chat.participant p\n  WHERE ((p.room_id = message.room_id) AND (p.student_id = auth.uid())))));"
  },
  {
    "format": "CREATE POLICY select_message ON chat.message AS PERMISSIVE FOR SELECT TO 0\n    USING ((EXISTS ( SELECT 1\n   FROM chat.participant p\n  WHERE ((p.room_id = message.room_id) AND (p.student_id = auth.uid())))));"
  },
  {
    "format": "CREATE POLICY update_message ON chat.message AS PERMISSIVE FOR UPDATE TO 0\n    USING (((sender_id = auth.uid()) OR (auth.role() = 'admin'::text)));"
  },
  {
    "format": "CREATE POLICY \"Enable insert for users based on user_id\" ON chat.participant AS PERMISSIVE FOR INSERT TO 0\n    WITH CHECK ((( SELECT auth.uid() AS uid) = student_id));"
  },
  {
    "format": "CREATE POLICY \"Enable users to view their own data only\" ON chat.participant AS PERMISSIVE FOR SELECT TO 16479\n    USING (true);"
  },
  {
    "format": "CREATE POLICY delete_participant ON chat.participant AS PERMISSIVE FOR DELETE TO 0\n    USING ((student_id = auth.uid()));"
  },
  {
    "format": "CREATE POLICY update_participant ON chat.participant AS PERMISSIVE FOR UPDATE TO 0\n    USING ((student_id = auth.uid()));"
  },
  {
    "format": "CREATE POLICY delete_room ON chat.room AS PERMISSIVE FOR DELETE TO 0\n    USING ((EXISTS ( SELECT 1\n   FROM chat.participant p\n  WHERE ((p.room_id = room.id) AND (p.student_id = auth.uid())))));"
  },
  {
    "format": "CREATE POLICY select_room ON chat.room AS PERMISSIVE FOR SELECT TO 0\n    USING (chat.is_room_member(id, auth.uid()));"
  },
  {
    "format": "CREATE POLICY update_room ON chat.room AS PERMISSIVE FOR UPDATE TO 0\n    USING ((EXISTS ( SELECT 1\n   FROM chat.participant p\n  WHERE ((p.room_id = room.id) AND (p.student_id = auth.uid())))));"
  },
  {
    "format": "CREATE POLICY \"Judges can manage their own ballots\" ON debate.ballots AS PERMISSIVE FOR ALL TO 0\n    USING ((judge_id IN ( SELECT judge.id\n   FROM judge\n  WHERE (judge.user_id = auth.uid()))));"
  },
  {
    "format": "CREATE POLICY \"Participants can view ballots for their debates\" ON debate.ballots AS PERMISSIVE FOR SELECT TO 0\n    USING ((debate_id IN ( SELECT dt.debate_id\n   FROM ((debate.debate_teams dt\n     JOIN debate.debate_participants dp ON ((dp.debate_team_id = dt.id)))\n     JOIN student s ON ((dp.user_id = s.user_id)))\n  WHERE (s.user_id = auth.uid()))));"
  },
  {
    "format": "CREATE POLICY \"Enable read access for all users\" ON debate.criteria AS PERMISSIVE FOR SELECT TO 0\n    USING (true);"
  },
  {
    "format": "CREATE POLICY \"Enable read access for all users\" ON debate.debate_formats AS PERMISSIVE FOR SELECT TO 0\n    USING (true);"
  },
  {
    "format": "CREATE POLICY \"Enable read access for all users\" ON debate.format_rounds AS PERMISSIVE FOR SELECT TO 0\n    USING (true);"
  },
  {
    "format": "CREATE POLICY \"Enable insert for authenticated users only\" ON debate.genres AS PERMISSIVE FOR INSERT TO 16479\n    WITH CHECK (true);"
  },
  {
    "format": "CREATE POLICY \"Enable read access for all users\" ON debate.genres AS PERMISSIVE FOR SELECT TO 0\n    USING (true);"
  },
  {
    "format": "CREATE POLICY \"Enable read access for all users\" ON debate.round_templates AS PERMISSIVE FOR SELECT TO 0\n    USING (true);"
  },
  {
    "format": "CREATE POLICY \"Enable read access for all users\" ON debate.sides AS PERMISSIVE FOR SELECT TO 0\n    USING (true);"
  },
  {
    "format": "CREATE POLICY \"Allow insert on friendship\" ON public.friendship AS PERMISSIVE FOR INSERT TO 16479\n    WITH CHECK (true);"
  },
  {
    "format": "CREATE POLICY \"Allow select on friendship\" ON public.friendship AS PERMISSIVE FOR SELECT TO 16479\n    USING (((user_id = auth.uid()) OR (friend_id = auth.uid())));"
  },
  {
    "format": "CREATE POLICY \"Allow update on friendship\" ON public.friendship AS PERMISSIVE FOR UPDATE TO 16479\n    USING (((user_id = auth.uid()) OR (friend_id = auth.uid())))\n    WITH CHECK (((user_id = auth.uid()) OR ((friend_id = auth.uid()) AND (status = ANY (ARRAY['ACCEPTED'::status, 'REJECTED'::status])))));"
  },
  {
    "format": "CREATE POLICY \"Enable insert for authenticated users only\" ON public.guardian AS PERMISSIVE FOR INSERT TO 16479\n    WITH CHECK (true);"
  },
  {
    "format": "CREATE POLICY \"Enable read access for all users\" ON public.guardian AS PERMISSIVE FOR SELECT TO 0\n    USING (true);"
  },
  {
    "format": "CREATE POLICY \"Enable insert for authenticated users only\" ON public.judge AS PERMISSIVE FOR INSERT TO 16479\n    WITH CHECK (true);"
  },
  {
    "format": "CREATE POLICY \"Allow users to select their own profile\" ON public.profile AS PERMISSIVE FOR SELECT TO 16479\n    USING ((( SELECT auth.uid() AS uid) = id));"
  },
  {
    "format": "CREATE POLICY \"Allow users to update their own profile\" ON public.profile AS PERMISSIVE FOR UPDATE TO 16479\n    USING ((( SELECT auth.uid() AS uid) = id))\n    WITH CHECK ((( SELECT auth.uid() AS uid) = id));"
  },
  {
    "format": "CREATE POLICY \"Enable read access for all users\" ON public.profile AS PERMISSIVE FOR SELECT TO 16479\n    USING (true);"
  },
  {
    "format": "CREATE POLICY \"Allow authenticated users to insert school\" ON public.school AS PERMISSIVE FOR INSERT TO 16479\n    WITH CHECK (true);"
  },
  {
    "format": "CREATE POLICY \"Enable read access for all users\" ON public.school AS PERMISSIVE FOR SELECT TO 16479\n    USING (true);"
  },
  {
    "format": "CREATE POLICY \"Enable insert for authenticated users only\" ON public.student AS PERMISSIVE FOR INSERT TO 16479\n    WITH CHECK (true);"
  },
  {
    "format": "CREATE POLICY \"Enable read access for all users\" ON public.student AS PERMISSIVE FOR SELECT TO 16479\n    USING (true);"
  },
  {
    "format": "CREATE POLICY update_student_policy ON public.student AS PERMISSIVE FOR UPDATE TO 16479\n    USING ((user_id = auth.uid()));"
  },
  {
    "format": "CREATE POLICY \"Enable delete for users based on user_id\" ON public.team AS PERMISSIVE FOR DELETE TO 16479\n    USING (true);"
  },
  {
    "format": "CREATE POLICY \"Enable insert for authenticated users only\" ON public.team AS PERMISSIVE FOR INSERT TO 16479\n    WITH CHECK (true);"
  },
  {
    "format": "CREATE POLICY \"Enable read access for all users\" ON public.team AS PERMISSIVE FOR SELECT TO 16479\n    USING (true);"
  },
  {
    "format": "CREATE POLICY \"Policy with table joins\" ON public.team AS PERMISSIVE FOR UPDATE TO 0\n    USING (true);"
  },
  {
    "format": "CREATE POLICY \"Enable delete for users based on user_id\" ON public.team_member AS PERMISSIVE FOR DELETE TO 0\n    USING (true);"
  },
  {
    "format": "CREATE POLICY \"Enable insert for users based on user_id\" ON public.team_member AS PERMISSIVE FOR INSERT TO 0\n    WITH CHECK (((status = 'PENDING'::status) OR (( SELECT auth.uid() AS uid) = student_id)));"
  },
  {
    "format": "CREATE POLICY \"Enable read access for all users\" ON public.team_member AS PERMISSIVE FOR SELECT TO 16479\n    USING (true);"
  },
  {
    "format": "CREATE POLICY \"Enable update for users based on email\" ON public.team_member AS PERMISSIVE FOR UPDATE TO 0\n    USING (true);"
  }
]
```

### 8. Check for RLS Enabled Tables
```json
[
  {
    "format": "ALTER TABLE chat.message ENABLE ROW LEVEL SECURITY;"
  },
  {
    "format": "ALTER TABLE chat.participant ENABLE ROW LEVEL SECURITY;"
  },
  {
    "format": "ALTER TABLE chat.room ENABLE ROW LEVEL SECURITY;"
  },
  {
    "format": "ALTER TABLE debate.ballots ENABLE ROW LEVEL SECURITY;"
  },
  {
    "format": "ALTER TABLE debate.criteria ENABLE ROW LEVEL SECURITY;"
  },
  {
    "format": "ALTER TABLE debate.debate_formats ENABLE ROW LEVEL SECURITY;"
  },
  {
    "format": "ALTER TABLE debate.format_rounds ENABLE ROW LEVEL SECURITY;"
  },
  {
    "format": "ALTER TABLE debate.genres ENABLE ROW LEVEL SECURITY;"
  },
  {
    "format": "ALTER TABLE debate.round_templates ENABLE ROW LEVEL SECURITY;"
  },
  {
    "format": "ALTER TABLE debate.sides ENABLE ROW LEVEL SECURITY;"
  },
  {
    "format": "ALTER TABLE public.friendship ENABLE ROW LEVEL SECURITY;"
  },
  {
    "format": "ALTER TABLE public.guardian ENABLE ROW LEVEL SECURITY;"
  },
  {
    "format": "ALTER TABLE public.guardian_request ENABLE ROW LEVEL SECURITY;"
  },
  {
    "format": "ALTER TABLE public.judge ENABLE ROW LEVEL SECURITY;"
  },
  {
    "format": "ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;"
  },
  {
    "format": "ALTER TABLE public.school ENABLE ROW LEVEL SECURITY;"
  },
  {
    "format": "ALTER TABLE public.student ENABLE ROW LEVEL SECURITY;"
  },
  {
    "format": "ALTER TABLE public.team ENABLE ROW LEVEL SECURITY;"
  },
  {
    "format": "ALTER TABLE public.team_member ENABLE ROW LEVEL SECURITY;"
  }
]
```

## How to Use:

1. Run each query separately in SQL Editor
2. Copy the results to a text file
3. Combine them in this order:
   ```sql
   -- Schema Export from Supabase
   -- Generated: [DATE]
   
   -- 1. Types
   [Results from Query 1]
   
   -- 2. Tables
   [Results from Query 2]
   
   -- 3. Primary Keys
   [Results from Query 3]
   
   -- 4. Foreign Keys
   [Results from Query 4]
   
   -- 5. Functions
   [Results from Query 5]
   
   -- 6. Triggers
   [Results from Query 6]
   
   -- 7. RLS Policies
   [Results from Query 7]
   
   -- 8. Enable RLS
   [Results from Query 8]
   
   -- 9. EDL Customization
   ALTER TABLE public.student 
   ADD COLUMN IF NOT EXISTS call_sign text UNIQUE NOT NULL;
   COMMENT ON COLUMN public.student.call_sign IS 'EDL: Unique identifier for radio communications';
   ```

This approach works perfectly in the SQL Editor without any nested aggregation errors!