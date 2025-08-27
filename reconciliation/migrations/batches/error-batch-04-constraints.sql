-- =============================================
-- Batch 04: Foreign Key Constraints  
-- Session 00051
-- Purpose: Add all foreign key relationships
-- Dependencies: Batch 03 (all tables must exist)
-- =============================================

BEGIN;

-- =============================================
-- CHAT SCHEMA FOREIGN KEYS
-- =============================================

ALTER TABLE ONLY chat.message
    ADD CONSTRAINT message_room_id_fkey FOREIGN KEY (room_id) REFERENCES chat.room(id) ON DELETE CASCADE;

ALTER TABLE ONLY chat.message
    ADD CONSTRAINT message_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.profile(id);

ALTER TABLE ONLY chat.participant
    ADD CONSTRAINT participant_room_id_fkey FOREIGN KEY (room_id) REFERENCES chat.room(id) ON DELETE CASCADE;

ALTER TABLE ONLY chat.participant
    ADD CONSTRAINT participant_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.profile(id);

ALTER TABLE ONLY chat.room
    ADD CONSTRAINT room_guild_id_fkey FOREIGN KEY (guild_id) REFERENCES public.guild(id);

ALTER TABLE ONLY chat.room
    ADD CONSTRAINT room_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.team(id);

-- =============================================
-- DEBATE SCHEMA FOREIGN KEYS
-- =============================================

ALTER TABLE ONLY debate.ballots
    ADD CONSTRAINT ballots_debate_id_fkey FOREIGN KEY (debate_id) REFERENCES debate.debates(id);

ALTER TABLE ONLY debate.ballots
    ADD CONSTRAINT ballots_format_id_fkey FOREIGN KEY (format_id) REFERENCES debate.debate_formats(id);

ALTER TABLE ONLY debate.ballots
    ADD CONSTRAINT ballots_judge_id_fkey FOREIGN KEY (judge_id) REFERENCES public.judge(id);

ALTER TABLE ONLY debate.criteria
    ADD CONSTRAINT criteria_format_id_fkey FOREIGN KEY (format_id) REFERENCES debate.debate_formats(id);

ALTER TABLE ONLY debate.debate_participants
    ADD CONSTRAINT debate_participants_debate_team_id_fkey FOREIGN KEY (debate_team_id) REFERENCES debate.debate_teams(id) ON DELETE CASCADE;

ALTER TABLE ONLY debate.debate_participants
    ADD CONSTRAINT debate_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.student(user_id);

ALTER TABLE ONLY debate.debate_teams
    ADD CONSTRAINT debate_teams_debate_id_fkey FOREIGN KEY (debate_id) REFERENCES debate.debates(id) ON DELETE CASCADE;

ALTER TABLE ONLY debate.debate_teams
    ADD CONSTRAINT debate_teams_side_id_fkey FOREIGN KEY (side_id) REFERENCES debate.sides(id);

ALTER TABLE ONLY debate.debates
    ADD CONSTRAINT debates_debate_format_id_fkey FOREIGN KEY (debate_format_id) REFERENCES debate.debate_formats(id);

ALTER TABLE ONLY debate.debates
    ADD CONSTRAINT debates_motion_id_fkey FOREIGN KEY (motion_id) REFERENCES debate.motions(id);

ALTER TABLE ONLY debate.format_rounds
    ADD CONSTRAINT format_rounds_debate_format_id_fkey FOREIGN KEY (debate_format_id) REFERENCES debate.debate_formats(id) ON DELETE CASCADE;

ALTER TABLE ONLY debate.format_rounds
    ADD CONSTRAINT format_rounds_round_template_id_fkey FOREIGN KEY (round_template_id) REFERENCES debate.round_templates(id);

ALTER TABLE ONLY debate.format_rounds
    ADD CONSTRAINT format_rounds_side_id_fkey FOREIGN KEY (side_id) REFERENCES debate.sides(id);

ALTER TABLE ONLY debate.genres
    ADD CONSTRAINT genres_proposer_id_fkey FOREIGN KEY (proposer_id) REFERENCES public.profile(id);

ALTER TABLE ONLY debate.judge_comments
    ADD CONSTRAINT judge_comments_criteria_id_fkey FOREIGN KEY (criteria_id) REFERENCES debate.criteria(id);

ALTER TABLE ONLY debate.judge_comments
    ADD CONSTRAINT judge_comments_judge_id_fkey FOREIGN KEY (judge_id) REFERENCES public.judge(user_id);

ALTER TABLE ONLY debate.judge_comments
    ADD CONSTRAINT judge_comments_video_id_fkey FOREIGN KEY (video_id) REFERENCES debate.videos(id) ON DELETE CASCADE;

ALTER TABLE ONLY debate.judge_scores
    ADD CONSTRAINT judge_scores_criteria_id_fkey FOREIGN KEY (criteria_id) REFERENCES debate.criteria(id);

ALTER TABLE ONLY debate.judge_scores
    ADD CONSTRAINT judge_scores_debate_id_fkey FOREIGN KEY (debate_id) REFERENCES debate.debates(id) ON DELETE CASCADE;

ALTER TABLE ONLY debate.judge_scores
    ADD CONSTRAINT judge_scores_judge_id_fkey FOREIGN KEY (judge_id) REFERENCES public.judge(user_id);

ALTER TABLE ONLY debate.matchmaking_queue_entries
    ADD CONSTRAINT matchmaking_queue_entries_debate_format_id_fkey FOREIGN KEY (debate_format_id) REFERENCES debate.debate_formats(id) ON DELETE RESTRICT;

ALTER TABLE ONLY debate.matchmaking_queue_entries
    ADD CONSTRAINT matchmaking_queue_entries_debate_id_fkey FOREIGN KEY (debate_id) REFERENCES debate.debates(id) ON DELETE SET NULL;

ALTER TABLE ONLY debate.matchmaking_queue_entries
    ADD CONSTRAINT matchmaking_queue_entries_opponent_id_fkey FOREIGN KEY (opponent_id) REFERENCES public.team(id);

ALTER TABLE ONLY debate.matchmaking_queue_entries
    ADD CONSTRAINT matchmaking_queue_entries_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.team(id) ON DELETE CASCADE;

ALTER TABLE ONLY debate.motions
    ADD CONSTRAINT motions_genre_id_fkey FOREIGN KEY (genre_id) REFERENCES debate.genres(id);

ALTER TABLE ONLY debate.motions
    ADD CONSTRAINT motions_proposer_id_fkey FOREIGN KEY (proposer_id) REFERENCES public.profile(id);

ALTER TABLE ONLY debate.speeches
    ADD CONSTRAINT speeches_debate_id_fkey FOREIGN KEY (debate_id) REFERENCES debate.debates(id) ON DELETE CASCADE;

ALTER TABLE ONLY debate.speeches
    ADD CONSTRAINT speeches_format_round_id_fkey FOREIGN KEY (format_round_id) REFERENCES debate.format_rounds(id);

ALTER TABLE ONLY debate.speeches
    ADD CONSTRAINT speeches_participant_id_fkey FOREIGN KEY (participant_id) REFERENCES debate.debate_participants(id);

ALTER TABLE ONLY debate.videos
    ADD CONSTRAINT videos_debate_id_fkey FOREIGN KEY (debate_id) REFERENCES debate.debates(id) ON DELETE CASCADE;

ALTER TABLE ONLY debate.videos
    ADD CONSTRAINT videos_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.profile(id);

-- =============================================
-- PUBLIC SCHEMA FOREIGN KEYS
-- =============================================

ALTER TABLE ONLY public.bank_account
    ADD CONSTRAINT "BankAccount_guardianId_fkey" FOREIGN KEY (guardian_id) REFERENCES public.guardian(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY public.guardian
    ADD CONSTRAINT "Guardian_userId_fkey" FOREIGN KEY (user_id) REFERENCES public.profile(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY public.guild_member
    ADD CONSTRAINT "GuildMember_guildId_fkey" FOREIGN KEY (guild_id) REFERENCES public.guild(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY public.guild_member
    ADD CONSTRAINT "GuildMember_studentId_fkey" FOREIGN KEY (student_id) REFERENCES public.student(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY public.guild
    ADD CONSTRAINT "Guild_schoolId_fkey" FOREIGN KEY (school_id) REFERENCES public.school(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.invitation
    ADD CONSTRAINT "Invitation_guildId_fkey" FOREIGN KEY (guild_id) REFERENCES public.guild(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY public.invitation
    ADD CONSTRAINT "Invitation_inviteeId_fkey" FOREIGN KEY (invitee_id) REFERENCES public.profile(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY public.invitation
    ADD CONSTRAINT "Invitation_inviterId_fkey" FOREIGN KEY (inviter_id) REFERENCES public.profile(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY public.invitation
    ADD CONSTRAINT "Invitation_teamId_fkey" FOREIGN KEY (team_id) REFERENCES public.team(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY public.judge
    ADD CONSTRAINT "Judge_referralUserId_fkey" FOREIGN KEY (referral_user_id) REFERENCES public.profile(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY public.judge
    ADD CONSTRAINT "Judge_userId_fkey" FOREIGN KEY (user_id) REFERENCES public.profile(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY public.log
    ADD CONSTRAINT "Log_guildId_fkey" FOREIGN KEY (guild_id) REFERENCES public.guild(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY public.log
    ADD CONSTRAINT "Log_studentId_fkey" FOREIGN KEY (student_id) REFERENCES public.student(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.log
    ADD CONSTRAINT "Log_teamId_fkey" FOREIGN KEY (team_id) REFERENCES public.team(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY public.payment_history
    ADD CONSTRAINT "PaymentHistory_guardianId_fkey" FOREIGN KEY (guardian_id) REFERENCES public.guardian(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.rating
    ADD CONSTRAINT "Rating_judgeId_fkey" FOREIGN KEY (judge_id) REFERENCES public.judge(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.rating
    ADD CONSTRAINT "Rating_raterId_fkey" FOREIGN KEY (rater_id) REFERENCES public.student(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.student
    ADD CONSTRAINT "Student_guardianId_fkey" FOREIGN KEY (guardian_id) REFERENCES public.guardian(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY public.student
    ADD CONSTRAINT "Student_schoolId_fkey" FOREIGN KEY (school_id) REFERENCES public.school(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY public.team_member
    ADD CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY (team_id) REFERENCES public.team(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY public.profile
    ADD CONSTRAINT "User_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);

ALTER TABLE ONLY public.friendship
    ADD CONSTRAINT friendship_friend_id_fkey FOREIGN KEY (friend_id) REFERENCES public.student(user_id) ON UPDATE CASCADE;

ALTER TABLE ONLY public.friendship
    ADD CONSTRAINT friendship_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.student(user_id) ON UPDATE CASCADE;

ALTER TABLE ONLY public.guardian_request
    ADD CONSTRAINT guardian_request_reciever_fkey FOREIGN KEY (reciever) REFERENCES public.profile(id);

ALTER TABLE ONLY public.guardian_request
    ADD CONSTRAINT guardian_request_sender_fkey FOREIGN KEY (sender) REFERENCES public.profile(id);

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profile(id);

ALTER TABLE ONLY public.team_member
    ADD CONSTRAINT team_member_student_id_fkey1 FOREIGN KEY (student_id) REFERENCES public.profile(id);

-- =============================================
-- VERIFICATION QUERIES
-- =============================================
-- SELECT COUNT(*) as fk_count, connamespace::regnamespace as schema
-- FROM pg_constraint
-- WHERE contype = 'f'
-- AND connamespace::regnamespace::text IN ('public', 'chat', 'debate')
-- GROUP BY connamespace
-- ORDER BY connamespace::regnamespace::text;
--
-- Expected: 65 total foreign key constraints

COMMIT;
