---
session: "00051"
type: "migration-deployed"
status: "applied"
created: "2025-08-27"
title: "Deployed Migration: batch-03c-unique-constraints"
purpose: "Applied database migration - unique constraints"
topics: ["database", "migration", "reality", "deployed"]
priority: "P0"
domain: "reality"
reality_type: "deployed-migration"
deployment_status: "production"
verified: true
---

-- =============================================
-- Batch 03c: Unique Constraints
-- Session 00051
-- Purpose: Add UNIQUE constraints required for foreign keys
-- Dependencies: Batch 03b (primary keys must exist)
-- NOTE: Must run BEFORE Batch 04 (foreign keys)
-- =============================================

BEGIN;

-- =============================================
-- CHAT SCHEMA UNIQUE CONSTRAINTS
-- =============================================

ALTER TABLE ONLY chat.participant
    ADD CONSTRAINT participant_unique UNIQUE (room_id, student_id);

-- =============================================
-- DEBATE SCHEMA UNIQUE CONSTRAINTS
-- =============================================

ALTER TABLE ONLY debate.ballots
    ADD CONSTRAINT ballots_debate_id_judge_id_key UNIQUE (debate_id, judge_id);

ALTER TABLE ONLY debate.debate_formats
    ADD CONSTRAINT debate_formats_name_key UNIQUE (name);

ALTER TABLE ONLY debate.format_rounds
    ADD CONSTRAINT format_rounds_format_sequence_unique UNIQUE (debate_format_id, sequence);

ALTER TABLE ONLY debate.round_templates
    ADD CONSTRAINT round_templates_code_key UNIQUE (code);

ALTER TABLE ONLY debate.sides
    ADD CONSTRAINT sides_title_key UNIQUE (title);

-- =============================================
-- PUBLIC SCHEMA UNIQUE CONSTRAINTS
-- =============================================

ALTER TABLE ONLY public.profile
    ADD CONSTRAINT "User_username_key1" UNIQUE (username);

ALTER TABLE ONLY public.friendship
    ADD CONSTRAINT friend_unique UNIQUE (user_id, friend_id);

ALTER TABLE ONLY public.guardian
    ADD CONSTRAINT guardian_user_id_key UNIQUE (user_id);

ALTER TABLE ONLY public.school
    ADD CONSTRAINT school_name_key UNIQUE (name);

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_user_id_key UNIQUE (user_id);

ALTER TABLE ONLY public.team_member
    ADD CONSTRAINT team_member_student_team_unique UNIQUE (student_id, team_id);

-- =============================================
-- VERIFICATION QUERY
-- =============================================
-- SELECT COUNT(*) as unique_count, table_schema
-- FROM information_schema.table_constraints
-- WHERE constraint_type = 'UNIQUE'
-- AND table_schema IN ('public', 'chat', 'debate')
-- GROUP BY table_schema
-- ORDER BY table_schema;
--
-- Expected: 12 total unique constraints
-- chat: 1, debate: 5, public: 6

COMMIT;