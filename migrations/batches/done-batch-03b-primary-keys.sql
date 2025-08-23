-- =============================================
-- Batch 03b: Primary Key Constraints
-- Session 00051
-- Purpose: Add PRIMARY KEY constraints to all tables
-- Dependencies: Batch 03 (tables must exist)
-- NOTE: Must run BEFORE Batch 04 (foreign keys)
-- =============================================

BEGIN;

-- =============================================
-- CHAT SCHEMA PRIMARY KEYS
-- =============================================

ALTER TABLE ONLY chat.message
    ADD CONSTRAINT message_pkey PRIMARY KEY (id);

ALTER TABLE ONLY chat.participant
    ADD CONSTRAINT participant_pkey PRIMARY KEY (id);

ALTER TABLE ONLY chat.room
    ADD CONSTRAINT room_pkey PRIMARY KEY (id);

-- =============================================
-- DEBATE SCHEMA PRIMARY KEYS
-- =============================================

ALTER TABLE ONLY debate.ballots
    ADD CONSTRAINT ballots_pkey PRIMARY KEY (id);

ALTER TABLE ONLY debate.criteria
    ADD CONSTRAINT criteria_pkey PRIMARY KEY (id);

ALTER TABLE ONLY debate.debate_formats
    ADD CONSTRAINT debate_formats_pkey PRIMARY KEY (id);

ALTER TABLE ONLY debate.debate_participants
    ADD CONSTRAINT debate_participants_pkey PRIMARY KEY (id);

ALTER TABLE ONLY debate.debate_teams
    ADD CONSTRAINT debate_teams_pkey PRIMARY KEY (id);

ALTER TABLE ONLY debate.debates
    ADD CONSTRAINT debates_pkey PRIMARY KEY (id);

ALTER TABLE ONLY debate.format_rounds
    ADD CONSTRAINT format_rounds_pkey PRIMARY KEY (id);

ALTER TABLE ONLY debate.genres
    ADD CONSTRAINT genres_pkey PRIMARY KEY (id);

ALTER TABLE ONLY debate.judge_comments
    ADD CONSTRAINT judge_comments_pkey PRIMARY KEY (id);

ALTER TABLE ONLY debate.judge_scores
    ADD CONSTRAINT judge_scores_pkey PRIMARY KEY (id);

ALTER TABLE ONLY debate.matchmaking_queue_entries
    ADD CONSTRAINT matchmaking_queue_entries_pkey PRIMARY KEY (id);

ALTER TABLE ONLY debate.motions
    ADD CONSTRAINT motions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY debate.round_templates
    ADD CONSTRAINT round_templates_pkey PRIMARY KEY (id);

ALTER TABLE ONLY debate.sides
    ADD CONSTRAINT sides_pkey PRIMARY KEY (id);

ALTER TABLE ONLY debate.speeches
    ADD CONSTRAINT speeches_pkey PRIMARY KEY (id);

ALTER TABLE ONLY debate.videos
    ADD CONSTRAINT videos_pkey PRIMARY KEY (id);

-- =============================================
-- PUBLIC SCHEMA PRIMARY KEYS
-- =============================================

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.bank_account
    ADD CONSTRAINT "BankAccount_pkey" PRIMARY KEY (id);

ALTER TABLE ONLY public.friendship
    ADD CONSTRAINT friendship_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.guardian
    ADD CONSTRAINT "Guardian_pkey" PRIMARY KEY (id);

ALTER TABLE ONLY public.guardian_request
    ADD CONSTRAINT guardian_request_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.guild
    ADD CONSTRAINT "Guild_pkey" PRIMARY KEY (id);

ALTER TABLE ONLY public.guild_member
    ADD CONSTRAINT "GuildMember_pkey" PRIMARY KEY (id);

ALTER TABLE ONLY public.invitation
    ADD CONSTRAINT "Invitation_pkey" PRIMARY KEY (id);

ALTER TABLE ONLY public.judge
    ADD CONSTRAINT "Judge_pkey" PRIMARY KEY (id);

ALTER TABLE ONLY public.log
    ADD CONSTRAINT "Log_pkey" PRIMARY KEY (id);

ALTER TABLE ONLY public.payment_history
    ADD CONSTRAINT "PaymentHistory_pkey" PRIMARY KEY (id);

ALTER TABLE ONLY public.profile
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);

ALTER TABLE ONLY public.rating
    ADD CONSTRAINT "Rating_pkey" PRIMARY KEY (id);

ALTER TABLE ONLY public.school
    ADD CONSTRAINT "School_pkey" PRIMARY KEY (id);

ALTER TABLE ONLY public.student
    ADD CONSTRAINT "Student_pkey" PRIMARY KEY (id);

ALTER TABLE ONLY public.team
    ADD CONSTRAINT "Team_pkey" PRIMARY KEY (id);

ALTER TABLE ONLY public.team_member
    ADD CONSTRAINT "TeamMember_pkey" PRIMARY KEY (id);

-- =============================================
-- VERIFICATION QUERY
-- =============================================
-- SELECT COUNT(*) as pk_count, table_schema
-- FROM information_schema.table_constraints
-- WHERE constraint_type = 'PRIMARY KEY'
-- AND table_schema IN ('public', 'chat', 'debate')
-- GROUP BY table_schema
-- ORDER BY table_schema;
--
-- Expected: 36 total primary key constraints

COMMIT;