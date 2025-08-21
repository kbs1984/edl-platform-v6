# Create

## 01

-- Create a function to generate DDL (only need to run this once)
CREATE OR REPLACE FUNCTION get_table_ddl(p_schema_name varchar, p_table_name varchar)
RETURNS text AS
$$
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
$$ LANGUAGE plpgsql;


## 02

CREATE TYPE debate_ballot_status_enum AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETE');

## 03

CREATE TABLE debate.ballots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    debate_id UUID REFERENCES debate.debates(id) NOT NULL,
    judge_id UUID REFERENCES public.judge(id) NOT NULL,
    status debate_ballot_status_enum DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMP WITH TIME ZONE,
    format_id UUID REFERENCES debate.debate_formats(id) NOT NULL,
    version INTEGER DEFAULT 1,
    UNIQUE(debate_id, judge_id)
);

## 04

CREATE TABLE debate.scorecards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ballot_id UUID REFERENCES debate.ballots(id) NOT NULL,
    participant_id UUID REFERENCES debate.debate_participants(id) NOT NULL,
    role_code TEXT NOT NULL,
    status debate_ballot_status_enum DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(ballot_id, participant_id)
);

## 05

CREATE TABLE debate.scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scorecard_id UUID REFERENCES debate.scorecards(id) NOT NULL,
    criteria_id UUID REFERENCES debate.criteria(id) NOT NULL,
    score DECIMAL(3,1) DEFAULT 1.5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(scorecard_id, criteria_id),
    CHECK (score >= 0 AND score <= 3)
);

## 06

CREATE TABLE debate.feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scorecard_id UUID REFERENCES debate.scorecards(id) NOT NULL,
    content TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    category TEXT NOT NULL,
    video_timestamp INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

## 07

CREATE TABLE IF NOT EXISTS debate.criteria (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    group TEXT NOT NULL CHECK (group IN ('RESPECT', 'ANALYSIS', 'STYLE')),
    format_id UUID REFERENCES debate.debate_formats(id),
    weight DECIMAL(3,2) DEFAULT 1.0,
    ordering INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

## 08

CREATE TABLE debate.ballot_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    format_id UUID REFERENCES debate.debate_formats(id) NOT NULL,
    name TEXT NOT NULL,
    structure JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(format_id, name)
);

## 09

CREATE TABLE IF NOT EXISTS debate.criteria (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    "group" TEXT NOT NULL CHECK ("group" IN ('RESPECT', 'ANALYSIS', 'STYLE')),
    format_id UUID REFERENCES debate.debate_formats(id),
    weight DECIMAL(3,2) DEFAULT 1.0,
    ordering INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

## 10

CREATE INDEX idx_ballots_debate_id ON debate.ballots(debate_id);

## 11

CREATE INDEX idx_ballots_judge_id ON debate.ballots(judge_id);

## 12

CREATE INDEX idx_ballots_status ON debate.ballots(status);

## 13

CREATE INDEX idx_scorecards_ballot_id ON debate.scorecards(ballot_id);
CREATE INDEX idx_scorecards_participant_id ON debate.scorecards(participant_id);

## 14

CREATE INDEX idx_scores_scorecard_id ON debate.scores(scorecard_id);
CREATE INDEX idx_scores_criteria_id ON debate.scores(criteria_id);

## 15

CREATE INDEX idx_feedback_scorecard_id ON debate.feedback(scorecard_id);

## 16

CREATE INDEX idx_criteria_group ON debate.criteria("group");

## 17

CREATE INDEX idx_criteria_format_id ON debate.criteria(format_id);

## 18

CREATE INDEX idx_ballot_templates_format_id ON debate.ballot_templates(format_id);

## 19

ALTER TABLE debate.ballots ENABLE ROW LEVEL SECURITY;
ALTER TABLE debate.scorecards ENABLE ROW LEVEL SECURITY;
ALTER TABLE debate.scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE debate.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE debate.ballot_templates ENABLE ROW LEVEL SECURITY;

## 20

CREATE POLICY "Judges can manage their own ballots" 
ON debate.ballots
FOR ALL 
USING (
  judge_id IN (
    SELECT id FROM public.judge WHERE user_id = auth.uid()
  )
);

## 21

CREATE POLICY "Participants can view ballots for their debates" 
ON debate.ballots
FOR SELECT 
USING (
  debate_id IN (
    SELECT dt.debate_id 
    FROM debate.debate_teams dt
    JOIN debate.debate_participants dp ON dp.debate_team_id = dt.id
    JOIN public.student s ON dp.user_id = s.user_id
    WHERE s.user_id = auth.uid()
  )
);

## 22

CREATE POLICY "Judges can manage scorecards for their ballots" 
ON debate.scorecards
FOR ALL 
USING (
  ballot_id IN (
    SELECT id FROM debate.ballots 
    WHERE judge_id IN (
      SELECT id FROM public.judge WHERE user_id = auth.uid()
    )
  )
);

## 23

CREATE POLICY "Participants can view their scorecards" 
ON debate.scorecards
FOR SELECT
USING (
  participant_id IN (
    SELECT dp.id
    FROM debate.debate_participants dp
    JOIN public.student s ON dp.user_id = s.user_id
    WHERE s.user_id = auth.uid()
  )
);

## 24

CREATE POLICY "Judges can manage scores for their scorecards" 
ON debate.scores
FOR ALL 
USING (
  scorecard_id IN (
    SELECT id FROM debate.scorecards 
    WHERE ballot_id IN (
      SELECT id FROM debate.ballots 
      WHERE judge_id IN (
        SELECT id FROM public.judge WHERE user_id = auth.uid()
      )
    )
  )
);

## 25

CREATE POLICY "Participants can view their scores" 
ON debate.scores
FOR SELECT
USING (
  scorecard_id IN (
    SELECT id
    FROM debate.scorecards
    WHERE participant_id IN (
      SELECT dp.id
      FROM debate.debate_participants dp
      JOIN public.student s ON dp.user_id = s.user_id
      WHERE s.user_id = auth.uid()
    )
  )
);

## 26

CREATE POLICY "Judges can manage feedback for their scorecards" 
ON debate.feedback
FOR ALL 
USING (
  scorecard_id IN (
    SELECT id FROM debate.scorecards 
    WHERE ballot_id IN (
      SELECT id FROM debate.ballots 
      WHERE judge_id IN (
        SELECT id FROM public.judge WHERE user_id = auth.uid()
      )
    )
  )
);

## 27

CREATE POLICY "Participants can view their feedback" 
ON debate.feedback
FOR SELECT
USING (
  scorecard_id IN (
    SELECT id
    FROM debate.scorecards
    WHERE participant_id IN (
      SELECT dp.id
      FROM debate.debate_participants dp
      JOIN public.student s ON dp.user_id = s.user_id
      WHERE s.user_id = auth.uid()
    )
  )
);

## 28

CREATE POLICY "Admins can manage ballot templates" 
ON debate.ballot_templates
FOR ALL 
USING (
  auth.uid() IN (
    SELECT user_id FROM public.admin
  )
);

## 29

CREATE POLICY "Everyone can view ballot templates" 
ON debate.ballot_templates
FOR SELECT 
USING (true);

-- Modify the criteria table to add format_id
ALTER TABLE debate.criteria 
ADD COLUMN format_id UUID REFERENCES debate.debate_formats(id);

-- Create admin table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.admin (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert criteria based on the Judge Manual
INSERT INTO debate.criteria (name, description, "group", ordering, label) VALUES
-- RESPECT criteria (R01-R06)
('Equanimous', 'Are you cool?', 'RESPECT', 1, 'R01'),
('Empathetic', 'And their needs?', 'RESPECT', 2, 'R02'),
('Just', 'Balanced & objective?', 'RESPECT', 3, 'R03'),
('Acceptance', 'Conceding much?', 'RESPECT', 4, 'R04'),
('Diligent', 'Addressing clashes?', 'RESPECT', 5, 'R05'),
('Self-Evident', 'Think or know?', 'RESPECT', 6, 'R06'),

-- ANALYSIS criteria (A07-A10)
('Strategy', 'Includes framework & burden?', 'ANALYSIS', 7, 'A07'),
('Issues', 'Identify & address issues/clashes?', 'ANALYSIS', 8, 'A08'),
('Warrant', 'Logical reasoning & evidence?', 'ANALYSIS', 9, 'A09'),
('Organized', 'Effective org. & time management?', 'ANALYSIS', 10, 'A10'),

-- STYLE criteria (S11-S14)
('Non-verbal', 'Body lang, facial exp, & eye contact?', 'STYLE', 11, 'S11'),
('Verbal', 'Volume, pitch, pace, & intonation?', 'STYLE', 12, 'S12'),
('Clarity', 'Enunciation, conditionals, & signposting?', 'STYLE', 13, 'S13'),
('Confidence', 'Conviction & capture attention?', 'STYLE', 14, 'S14');

-- First, make sure we have at least one debate format
INSERT INTO debate.debate_formats (name, description)
VALUES ('EMD DEBATE', 'Emdash Debate Format')
ON CONFLICT (name) DO NOTHING;

-- Insert a sample ballot template for EMD format
INSERT INTO debate.ballot_templates (format_id, name, structure)
SELECT 
  id, 
  'Standard EMD Ballot', 
  '{
    "roles": [
      {"code": "A1FE", "description": "Team A First Essay"},
      {"code": "A2BE", "description": "Team A Backup Essay"},
      {"code": "A3QB", "description": "Team A Rebuttal"},
      {"code": "B1FE", "description": "Team B First Essay"},
      {"code": "B2BE", "description": "Team B Backup Essay"},
      {"code": "B3QB", "description": "Team B Rebuttal"}
    ],
    "criteriaGroups": ["RESPECT", "ANALYSIS", "STYLE"],
    "defaultScore": 1.5,
    "scoringScale": {
      "min": 0,
      "max": 3,
      "step": 0.5,
      "descriptions": {
        "0": "Unsatisfactory",
        "1": "Developing",
        "1.5": "Basic Competence",
        "2": "Proficient",
        "2.5": "Advanced",
        "3": "Exceptional"
      }
    }
  }'::JSONB
FROM debate.debate_formats
WHERE name = 'EMD DEBATE'
LIMIT 1;

## 30

CREATE INDEX idx_criteria_format_id ON debate.criteria(format_id);

-- Insert criteria based on the Judge Manual
INSERT INTO debate.criteria (name, description, "group", ordering, label) VALUES
-- RESPECT criteria (R01-R06)
('Equanimous', 'Are you cool?', 'RESPECT', 1, 'R01'),
('Empathetic', 'And their needs?', 'RESPECT', 2, 'R02'),
('Just', 'Balanced & objective?', 'RESPECT', 3, 'R03'),
('Acceptance', 'Conceding much?', 'RESPECT', 4, 'R04'),
('Diligent', 'Addressing clashes?', 'RESPECT', 5, 'R05'),
('Self-Evident', 'Think or know?', 'RESPECT', 6, 'R06'),

-- ANALYSIS criteria (A07-A10)
('Strategy', 'Includes framework & burden?', 'ANALYSIS', 7, 'A07'),
('Issues', 'Identify & address issues/clashes?', 'ANALYSIS', 8, 'A08'),
('Warrant', 'Logical reasoning & evidence?', 'ANALYSIS', 9, 'A09'),
('Organized', 'Effective org. & time management?', 'ANALYSIS', 10, 'A10'),

-- STYLE criteria (S11-S14)
('Non-verbal', 'Body lang, facial exp, & eye contact?', 'STYLE', 11, 'S11'),
('Verbal', 'Volume, pitch, pace, & intonation?', 'STYLE', 12, 'S12'),
('Clarity', 'Enunciation, conditionals, & signposting?', 'STYLE', 13, 'S13'),
('Confidence', 'Conviction & capture attention?', 'STYLE', 14, 'S14');

-- Insert criteria based on the Judge Manual with the correct column names
INSERT INTO debate.criteria (name, criteria, "group", label) VALUES
-- RESPECT criteria (R01-R06)
('Equanimous', 'Are you cool?', 'RESPECT', 'R01'),
('Empathetic', 'And their needs?', 'RESPECT', 'R02'),
('Just', 'Balanced & objective?', 'RESPECT', 'R03'),
('Acceptance', 'Conceding much?', 'RESPECT', 'R04'),
('Diligent', 'Addressing clashes?', 'RESPECT', 'R05'),
('Self-Evident', 'Think or know?', 'RESPECT', 'R06'),

-- ANALYSIS criteria (A07-A10)
('Strategy', 'Includes framework & burden?', 'ANALYSIS', 'A07'),
('Issues', 'Identify & address issues/clashes?', 'ANALYSIS', 'A08'),
('Warrant', 'Logical reasoning & evidence?', 'ANALYSIS', 'A09'),
('Organized', 'Effective org. & time management?', 'ANALYSIS', 'A10'),

-- STYLE criteria (S11-S14)
('Non-verbal', 'Body lang, facial exp, & eye contact?', 'STYLE', 'S11'),
('Verbal', 'Volume, pitch, pace, & intonation?', 'STYLE', 'S12'),
('Clarity', 'Enunciation, conditionals, & signposting?', 'STYLE', 'S13'),
('Confidence', 'Conviction & capture attention?', 'STYLE', 'S14');

-- Example of ballot creation
INSERT INTO debate.ballots (debate_id, judge_id, format_id) 
VALUES ('debate-uuid', 'judge-uuid', 'format-uuid');

## 31

INSERT INTO auth.users (id, email)
VALUES 
  ('d1c363c3-8598-4d16-a302-7c665c6338a3', 'judge1@example.com'),
  ('78e5d47a-c3a2-4993-b8d7-0625ce5695fe', 'judge2@example.com'),
  ('3f50c3e5-f086-4943-a139-bc4dd77134b7', 'student1@example.com'),
  ('e647f237-b789-4a1e-a69b-8e0cda0047c1', 'student2@example.com'),
  ('9c6d0ac4-feb5-4cee-ae1d-cea14f736de7', 'student3@example.com'),
  ('19b25bd2-e6f0-4d31-a9c7-beea83a3e412', 'student4@example.com'),
  ('b07f5d88-ad39-4e90-bda6-92f3528d2e32', 'admin1@example.com')
ON CONFLICT (id) DO NOTHING;

## 32

INSERT INTO public.profile (id, name, email, image_path, created_at)
VALUES 
  ('d1c363c3-8598-4d16-a302-7c665c6338a3', 'Judge Smith', 'judge1@example.com', 'https://i.pravatar.cc/150?u=judge1', CURRENT_TIMESTAMP),
  ('78e5d47a-c3a2-4993-b8d7-0625ce5695fe', 'Judge Johnson', 'judge2@example.com', 'https://i.pravatar.cc/150?u=judge2', CURRENT_TIMESTAMP),
  ('3f50c3e5-f086-4943-a139-bc4dd77134b7', 'Alice Student', 'student1@example.com', 'https://i.pravatar.cc/150?u=student1', CURRENT_TIMESTAMP),
  ('e647f237-b789-4a1e-a69b-8e0cda0047c1', 'Bob Student', 'student2@example.com', 'https://i.pravatar.cc/150?u=student2', CURRENT_TIMESTAMP),
  ('9c6d0ac4-feb5-4cee-ae1d-cea14f736de7', 'Charlie Student', 'student3@example.com', 'https://i.pravatar.cc/150?u=student3', CURRENT_TIMESTAMP),
  ('19b25bd2-e6f0-4d31-a9c7-beea83a3e412', 'Diana Student', 'student4@example.com', 'https://i.pravatar.cc/150?u=student4', CURRENT_TIMESTAMP),
  ('b07f5d88-ad39-4e90-bda6-92f3528d2e32', 'Admin User', 'admin1@example.com', 'https://i.pravatar.cc/150?u=admin1', CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

## 33

INSERT INTO public.judge (id, user_id)
VALUES 
  ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'd1c363c3-8598-4d16-a302-7c665c6338a3'),
  ('6cbc0680-7b54-4201-97a7-f8f27f65f013', '78e5d47a-c3a2-4993-b8d7-0625ce5695fe')
ON CONFLICT (id) DO NOTHING;

## 34

INSERT INTO public.student (id, user_id)
VALUES 
  ('1da6e434-cd74-4114-8440-9eb3a08ebbd3', '3f50c3e5-f086-4943-a139-bc4dd77134b7'),
  ('f6a0aa59-d98d-48f2-b005-01a531d52c75', 'e647f237-b789-4a1e-a69b-8e0cda0047c1'),
  ('3d1deb14-c3bf-4af4-90a7-b3b357c5fe69', '9c6d0ac4-feb5-4cee-ae1d-cea14f736de7'),
  ('cb4c7ca7-79c5-4697-8a87-27feec023f13', '19b25bd2-e6f0-4d31-a9c7-beea83a3e412')
ON CONFLICT (id) DO NOTHING;

## 35

INSERT INTO public.admin (id, user_id)
VALUES 
  ('9de8f7ac-a259-4384-9c3b-9c1c6a9a69c5', 'b07f5d88-ad39-4e90-bda6-92f3528d2e32')
ON CONFLICT (id) DO NOTHING;


## 36

INSERT INTO debate.debate_formats (id, name, description)
VALUES 
  ('6b31a17d-89e3-4320-9c68-d69d5728b1a2', 'EMD DEBATE', 'Emdash standard debate format with 2 speakers per team'),
  ('0ad46d72-d217-4f33-acce-c2aae0291274', 'WSDC', 'World Schools Debate Championship format'),
  ('e2106c87-1904-4aa6-93f1-141cd6735b97', 'LINCOLN-DOUGLAS', 'One-on-one debate format focused on ethical values')
ON CONFLICT (id) DO NOTHING;

## 37

INSERT INTO debate.sides (id, title)
VALUES 
  ('9a7a1fe3-5adf-484a-a560-97f053534156', 'Affirmative'),
  ('e5c5e6dc-c6a1-475a-9c1a-97bd72b5874c', 'Negative')
ON CONFLICT (id) DO NOTHING;

## 38

INSERT INTO debate.motion_categories (id, name)
VALUES 
  ('15e68db0-9a54-4f93-b5c9-68a6c81a2e04', 'Education')
ON CONFLICT (id) DO NOTHING;

## 39

INSERT INTO debate.genres (id, title, proposer_id)
VALUES 
  ('37c8efe7-bdd5-4de5-bc72-a9c7b5f1eb56', 'Social Policy', 'b07f5d88-ad39-4e90-bda6-92f3528d2e32')
ON CONFLICT (id) DO NOTHING;

## 40

INSERT INTO debate.motions (id, topic, genre_id, category_id, proposer_id)
VALUES 
  ('c8758b57-34a0-4e1e-9947-61d4fbfca7e2', 'This house believes that standardized testing should be abolished', 
   '37c8efe7-bdd5-4de5-bc72-a9c7b5f1eb56', '15e68db0-9a54-4f93-b5c9-68a6c81a2e04', 'b07f5d88-ad39-4e90-bda6-92f3528d2e32')
ON CONFLICT (id) DO NOTHING;

## 41

INSERT INTO debate.genres (id, title, proposer_id)
VALUES 
  ('37c8efe7-bdd5-4de5-bc72-a9c7b5f1eb56', 'Social Policy', 'b07f5d88-ad39-4e90-bda6-92f3528d2e32')
ON CONFLICT (id) DO NOTHING;

## 42

INSERT INTO debate.motions (id, topic, genre_id, category_id, proposer_id)
VALUES 
  ('c8758b57-34a0-4e1e-9947-61d4fbfca7e2', 'This house believes that standardized testing should be abolished', 
   '37c8efe7-bdd5-4de5-bc72-a9c7b5f1eb56', '15e68db0-9a54-4f93-b5c9-68a6c81a2e04', 'b07f5d88-ad39-4e90-bda6-92f3528d2e32')
ON CONFLICT (id) DO NOTHING;

## 43

INSERT INTO debate.debates (id, debate_format_id, motion_id, scheduled_at, mode)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', '6b31a17d-89e3-4320-9c68-d69d5728b1a2', 
   'c8758b57-34a0-4e1e-9947-61d4fbfca7e2', CURRENT_TIMESTAMP - INTERVAL '2 days', 'SYNC'),
  ('7483fe4b-4008-4c7c-a4d3-7dd8d2b31128', '6b31a17d-89e3-4320-9c68-d69d5728b1a2', 
   'c8758b57-34a0-4e1e-9947-61d4fbfca7e2', CURRENT_TIMESTAMP - INTERVAL '1 day', 'ASYNC')
ON CONFLICT (id) DO NOTHING;

## 44

INSERT INTO debate.debate_teams (id, debate_id, side_id)
VALUES 
  -- Teams for first debate
  ('e1ad5a3b-55c2-4259-930d-2f963d5a5c44', '550e8400-e29b-41d4-a716-446655440000', '9a7a1fe3-5adf-484a-a560-97f053534156'),
  ('f04d6dce-1c6f-4a20-b388-5a3e8a68ccb7', '550e8400-e29b-41d4-a716-446655440000', 'e5c5e6dc-c6a1-475a-9c1a-97bd72b5874c'),
  -- Teams for second debate
  ('754743f9-bac3-42f1-9c85-f924a8e2bda1', '7483fe4b-4008-4c7c-a4d3-7dd8d2b31128', '9a7a1fe3-5adf-484a-a560-97f053534156'),
  ('3d8d51a4-eb12-4a10-a82c-5e9490bd86c7', '7483fe4b-4008-4c7c-a4d3-7dd8d2b31128', 'e5c5e6dc-c6a1-475a-9c1a-97bd72b5874c')
ON CONFLICT (id) DO NOTHING;

## 45

INSERT INTO debate.debate_participants (id, debate_team_id, user_id, speaker_position)
VALUES 
  -- Participants for first debate, team 1 (Affirmative)
  ('6218b493-4572-409b-81d2-a1876ad534d0', 'e1ad5a3b-55c2-4259-930d-2f963d5a5c44', '3f50c3e5-f086-4943-a139-bc4dd77134b7', 1),
  ('2ec47c6d-ff9a-4f27-9925-e77521d9ff35', 'e1ad5a3b-55c2-4259-930d-2f963d5a5c44', 'e647f237-b789-4a1e-a69b-8e0cda0047c1', 2),
  
  -- Participants for first debate, team 2 (Negative)
  ('d290f1ee-6c54-4b01-90e6-d701748f0851', 'f04d6dce-1c6f-4a20-b388-5a3e8a68ccb7', '9c6d0ac4-feb5-4cee-ae1d-cea14f736de7', 1),
  ('044a3d49-63be-4e58-9940-8a060e98e0a1', 'f04d6dce-1c6f-4a20-b388-5a3e8a68ccb7', '19b25bd2-e6f0-4d31-a9c7-beea83a3e412', 2),
  
  -- Participants for second debate, team 1 (Affirmative)
  ('8d50a205-1c89-49c2-a7bc-debd0a8901c6', '754743f9-bac3-42f1-9c85-f924a8e2bda1', '3f50c3e5-f086-4943-a139-bc4dd77134b7', 1),
  ('d6560ba8-2f2a-4a5d-91f7-62c64c3c735f', '754743f9-bac3-42f1-9c85-f924a8e2bda1', 'e647f237-b789-4a1e-a69b-8e0cda0047c1', 2),
  
  -- Participants for second debate, team 2 (Negative)
  ('fdb43c59-944f-4bae-b3f6-3e0c25094387', '3d8d51a4-eb12-4a10-a82c-5e9490bd86c7', '9c6d0ac4-feb5-4cee-ae1d-cea14f736de7', 1),
  ('c02f9f56-562c-4289-ba6c-7d71234c1aeb', '3d8d51a4-eb12-4a10-a82c-5e9490bd86c7', '19b25bd2-e6f0-4d31-a9c7-beea83a3e412', 2)
ON CONFLICT (id) DO NOTHING;

