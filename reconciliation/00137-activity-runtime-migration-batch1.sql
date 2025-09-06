-- Session 137: Activity Runtime ENGINE - Batch 1 (US-155 to US-159)
-- Tables for Multi-Session Activity Structure and Assignment Submission
-- Created: 2025-09-02

-- UP Migration
-- ============

-- 1. Core activity table (minimal for session management)
CREATE TABLE IF NOT EXISTS activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    total_sessions INTEGER DEFAULT 1 CHECK (total_sessions > 0),
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS with simple policy
ALTER TABLE activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all activities" ON activity
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create activities" ON activity
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = created_by);

-- 2. Activity sessions (content for each session)
CREATE TABLE IF NOT EXISTS activity_session (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id UUID NOT NULL REFERENCES activity(id) ON DELETE CASCADE,
    session_number INTEGER NOT NULL CHECK (session_number > 0),
    title TEXT NOT NULL,
    content JSONB, -- Flexible content structure
    objectives TEXT[], -- Learning objectives for this session
    duration_minutes INTEGER DEFAULT 60,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(activity_id, session_number)
);

ALTER TABLE activity_session ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all sessions" ON activity_session
    FOR SELECT USING (true);

-- 3. Activity instance (player's participation in an activity)
CREATE TABLE IF NOT EXISTS activity_instance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id UUID NOT NULL REFERENCES activity(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    current_session INTEGER DEFAULT 1,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'abandoned')),
    UNIQUE(activity_id, user_id)
);

ALTER TABLE activity_instance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own instances" ON activity_instance
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own instances" ON activity_instance
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own instances" ON activity_instance
    FOR UPDATE USING (auth.uid() = user_id);

-- 4. Session progress (tracking within each session)
CREATE TABLE IF NOT EXISTS session_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instance_id UUID NOT NULL REFERENCES activity_instance(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES activity_session(id),
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    last_save_at TIMESTAMPTZ DEFAULT NOW(),
    progress_data JSONB, -- Flexible storage for draft responses, etc.
    is_complete BOOLEAN DEFAULT FALSE,
    auto_save_count INTEGER DEFAULT 0,
    UNIQUE(instance_id, session_id)
);

ALTER TABLE session_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress" ON session_progress
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM activity_instance 
            WHERE activity_instance.id = session_progress.instance_id 
            AND activity_instance.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage own progress" ON session_progress
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM activity_instance 
            WHERE activity_instance.id = session_progress.instance_id 
            AND activity_instance.user_id = auth.uid()
        )
    );

-- 5. Activity assignments (embedded in activities)
CREATE TABLE IF NOT EXISTS activity_assignment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES activity_session(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    requirements JSONB, -- e.g., {"min_words": 500, "citations_required": true}
    rubric JSONB, -- Evaluation criteria
    due_offset_hours INTEGER, -- Hours from session start
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE activity_assignment ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view assignments" ON activity_assignment
    FOR SELECT USING (true);

-- 6. Assignment submissions
CREATE TABLE IF NOT EXISTS assignment_submission (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES activity_assignment(id) ON DELETE CASCADE,
    instance_id UUID NOT NULL REFERENCES activity_instance(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    content TEXT, -- Text submission
    file_urls TEXT[], -- Uploaded files
    citations JSONB, -- Structured citations
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'graded')),
    grade JSONB, -- Grade and feedback
    -- TODO: Add supervisor_notified boolean when integrating with Guardian
    UNIQUE(assignment_id, instance_id)
);

ALTER TABLE assignment_submission ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own submissions" ON assignment_submission
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own submissions" ON assignment_submission
    FOR ALL USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_activity_instance_user ON activity_instance(user_id);
CREATE INDEX idx_activity_instance_status ON activity_instance(status);
CREATE INDEX idx_session_progress_instance ON session_progress(instance_id);
CREATE INDEX idx_assignment_submission_user ON assignment_submission(user_id);
CREATE INDEX idx_assignment_submission_status ON assignment_submission(status);

-- DOWN Migration (Rollback)
-- =========================
/*
DROP TABLE IF EXISTS assignment_submission CASCADE;
DROP TABLE IF EXISTS activity_assignment CASCADE;
DROP TABLE IF EXISTS session_progress CASCADE;
DROP TABLE IF EXISTS activity_instance CASCADE;
DROP TABLE IF EXISTS activity_session CASCADE;
DROP TABLE IF EXISTS activity CASCADE;
*/