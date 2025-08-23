-- =============================================
-- Batch 07: Performance Indexes
-- Session 00052
-- Purpose: Create indexes for query optimization
-- Dependencies: Batch 03 (tables must exist)
-- Total Indexes: 15 (4 chat, 5 debate, 6 public)
-- =============================================

BEGIN;

-- =============================================
-- CHAT SCHEMA INDEXES (4 indexes)
-- =============================================

-- Message indexes for efficient querying
CREATE INDEX idx_message_room 
    ON chat.message USING btree (room_id, created_at DESC);

CREATE INDEX idx_message_sender 
    ON chat.message USING btree (sender_id);

-- Participant indexes for room membership queries
CREATE INDEX idx_participant_room 
    ON chat.participant USING btree (room_id);

CREATE INDEX idx_participant_student 
    ON chat.participant USING btree (student_id);

-- =============================================
-- DEBATE SCHEMA INDEXES (5 indexes)
-- =============================================

-- Ballot indexes for debate queries
CREATE INDEX idx_ballots_debate_id 
    ON debate.ballots USING btree (debate_id);

CREATE INDEX idx_ballots_judge_id 
    ON debate.ballots USING btree (judge_id);

CREATE INDEX idx_ballots_status 
    ON debate.ballots USING btree (status);

-- Criteria indexes for format queries
CREATE INDEX idx_criteria_format_id 
    ON debate.criteria USING btree (format_id);

CREATE INDEX idx_criteria_group 
    ON debate.criteria USING btree ("group");

-- =============================================
-- PUBLIC SCHEMA INDEXES (6 indexes)
-- =============================================

-- User relationship indexes
CREATE INDEX "Guardian_userId_idx" 
    ON public.guardian USING btree (user_id);

CREATE INDEX "Judge_userId_idx" 
    ON public.judge USING btree (user_id);

CREATE INDEX "Student_userId_idx" 
    ON public.student USING btree (user_id);

-- Invitation indexes for social features
CREATE INDEX "Invitation_inviteeId_idx" 
    ON public.invitation USING btree (invitee_id);

CREATE INDEX "Invitation_inviterId_idx" 
    ON public.invitation USING btree (inviter_id);

-- Activity log index
CREATE INDEX "Log_studentId_idx" 
    ON public.log USING btree (student_id);

-- =============================================
-- VERIFICATION QUERIES
-- =============================================
-- After execution, verify with:
-- SELECT schemaname, tablename, indexname 
-- FROM pg_indexes 
-- WHERE schemaname IN ('public', 'chat', 'debate')
-- AND indexname NOT LIKE '%_pkey'
-- AND indexname NOT LIKE '%_key'
-- ORDER BY schemaname, tablename;
-- Expected: 15 performance indexes

COMMIT;

-- =============================================
-- NOTES:
-- 1. These are performance indexes, not constraint indexes
-- 2. Primary key and unique constraint indexes already exist
-- 3. Indexes use btree for efficient range and equality queries
-- 4. Message index includes created_at DESC for chronological queries
-- 5. Some indexes have quoted names (preserved from original)
-- =============================================