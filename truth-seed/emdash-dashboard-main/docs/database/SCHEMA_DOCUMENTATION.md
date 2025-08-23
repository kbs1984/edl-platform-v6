---
session: "unknown"
type: "documentation"
status: "current"
created: "2025-08-23"
title: "Database Schema Documentation"
purpose: "Document database schema documentation"
topics: ['auth', 'database', 'documentation']
priority: "P1"
domain: "core"
---

# Database Schema Documentation

## Table of Contents
1. [Chat Schema](#chat-schema)
2. [Public Schema](#public-schema)
3. [Debate Schema](#debate-schema)

## Chat Schema

### Tables

1. **chat.room**
   ```sql
   CREATE TABLE chat.room (
     id uuid DEFAULT gen_random_uuid() NOT NULL,
     type text NOT NULL,  -- 'TEAM', 'GUILD', 'FRIEND'
     title text,
     team_id uuid REFERENCES public.team(id),
     guild_id uuid REFERENCES public.guild(id),
     created_at timestamptz DEFAULT now() NOT NULL,
     updated_at timestamptz DEFAULT now() NOT NULL,
     CONSTRAINT type_check CHECK (type IN ('TEAM', 'GUILD', 'FRIEND'))
   );
   ```

2. **chat.message**
   ```sql
   CREATE TABLE chat.message (
     id uuid DEFAULT gen_random_uuid() NOT NULL,
     room_id uuid REFERENCES chat.room(id) ON DELETE CASCADE NOT NULL,
     sender_id uuid REFERENCES auth.users(id) NOT NULL,
     content text NOT NULL,
     is_system boolean DEFAULT false NOT NULL,
     created_at timestamptz DEFAULT now() NOT NULL,
     updated_at timestamptz DEFAULT now() NOT NULL
   );
   ```

3. **chat.participant**
   ```sql
   CREATE TABLE chat.participant (
     room_id uuid REFERENCES chat.room(id) ON DELETE CASCADE NOT NULL,
     student_id uuid REFERENCES auth.users(id) NOT NULL,
     created_at timestamptz DEFAULT now() NOT NULL,
     PRIMARY KEY (room_id, student_id)
   );
   ```

### Triggers

1. **Team Chat Room Creation**
   ```sql
   CREATE TRIGGER trg_team_create_room
   AFTER INSERT ON public.team
   FOR EACH ROW
   EXECUTE FUNCTION chat.fn_create_team_room();
   ```

2. **Guild Chat Room Creation**
   ```sql
   CREATE TRIGGER trg_guild_create_room
   AFTER INSERT ON public.guild
   FOR EACH ROW
   EXECUTE FUNCTION chat.fn_create_guild_room();
   ```

3. **Team Member Chat Participant**
   ```sql
   CREATE TRIGGER trg_team_member_add_participant
   AFTER INSERT OR UPDATE ON public.team_member
   FOR EACH ROW
   EXECUTE FUNCTION chat.fn_add_team_member_to_room();
   ```

4. **Guild Member Chat Participant**
   ```sql
   CREATE TRIGGER trg_guild_member_add_participant
   AFTER INSERT OR UPDATE ON public.guild_member
   FOR EACH ROW
   EXECUTE FUNCTION chat.fn_add_guild_member_to_room();
   ```

5. **Room Title Sync**
   ```sql
   CREATE TRIGGER trg_team_update_room_title
   AFTER UPDATE OF name ON public.team
   FOR EACH ROW
   WHEN (old.name IS DISTINCT FROM new.name)
   EXECUTE FUNCTION chat.fn_sync_team_room_title();

   CREATE TRIGGER trg_guild_update_room_title
   AFTER UPDATE OF name ON public.guild
   FOR EACH ROW
   WHEN (old.name IS DISTINCT FROM new.name)
   EXECUTE FUNCTION chat.fn_sync_guild_room_title();
   ```

### Functions

1. **Room Creation**
   ```sql
   CREATE FUNCTION chat.fn_create_team_room()
   RETURNS trigger
   LANGUAGE plpgsql
   SECURITY DEFINER
   AS $$
   BEGIN
     INSERT INTO chat.room (type, title, team_id)
     VALUES ('TEAM', NEW.name, NEW.id);
     RETURN NEW;
   END;
   $$;

   CREATE FUNCTION chat.fn_create_guild_room()
   RETURNS trigger
   LANGUAGE plpgsql
   SECURITY DEFINER
   AS $$
   BEGIN
     INSERT INTO chat.room (type, title, guild_id)
     VALUES ('GUILD', NEW.name, NEW.id);
     RETURN NEW;
   END;
   $$;
   ```

2. **Member Management**
   ```sql
   CREATE FUNCTION chat.fn_add_team_member_to_room()
   RETURNS trigger
   LANGUAGE plpgsql
   SECURITY DEFINER
   AS $$
   BEGIN
     IF NEW.status = 'ACCEPTED' THEN
       INSERT INTO chat.participant (room_id, student_id)
       SELECT r.id, NEW.student_id
       FROM chat.room r
       WHERE r.team_id = NEW.team_id
       ON CONFLICT DO NOTHING;
     END IF;
     RETURN NEW;
   END;
   $$;

   CREATE FUNCTION chat.fn_add_guild_member_to_room()
   RETURNS trigger
   LANGUAGE plpgsql
   SECURITY DEFINER
   AS $$
   BEGIN
     IF NEW.status = 'ACCEPTED' THEN
       INSERT INTO chat.participant (room_id, student_id)
       SELECT r.id, NEW.student_id
       FROM chat.room r
       WHERE r.guild_id = NEW.guild_id
       ON CONFLICT DO NOTHING;
     END IF;
     RETURN NEW;
   END;
   $$;
   ```

3. **Message Operations**
   ```sql
   CREATE FUNCTION chat.get_room_messages(p_room_id uuid)
   RETURNS TABLE (
     id uuid,
     content text,
     created_at timestamptz,
     sender_id uuid,
     sender_name text,
     sender_avatar_url text
   )
   LANGUAGE sql
   SECURITY DEFINER
   AS $$
     SELECT 
       m.id,
       m.content,
       m.created_at,
       m.sender_id,
       p.display_name as sender_name,
       p.avatar_url as sender_avatar_url
     FROM chat.message m
     JOIN public.profile p ON p.id = m.sender_id
     WHERE m.room_id = p_room_id
     ORDER BY m.created_at DESC;
   $$;
   ```

## Public Schema

### Tables

1. **public.team**
   ```sql
   CREATE TABLE public.team (
     id uuid DEFAULT gen_random_uuid() NOT NULL,
     name text NOT NULL,
     description text,
     leader_id uuid REFERENCES auth.users(id) NOT NULL,
     created_at timestamptz DEFAULT now() NOT NULL,
     updated_at timestamptz DEFAULT now() NOT NULL,
     CONSTRAINT unique_team_name UNIQUE (name)
   );
   ```

2. **public.team_member**
   ```sql
   CREATE TABLE public.team_member (
     id uuid DEFAULT gen_random_uuid() NOT NULL,
     team_id uuid REFERENCES public.team(id) ON DELETE CASCADE NOT NULL,
     student_id uuid REFERENCES auth.users(id) NOT NULL,
     status text DEFAULT 'PENDING'::text NOT NULL,
     created_at timestamptz DEFAULT now() NOT NULL,
     updated_at timestamptz DEFAULT now() NOT NULL,
     CONSTRAINT status_check CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED')),
     CONSTRAINT unique_team_member UNIQUE (team_id, student_id)
   );
   ```

### Triggers

1. **Team Member Count Check**
   ```sql
   CREATE TRIGGER trg_check_team_member_count
   BEFORE INSERT OR UPDATE ON public.team_member
   FOR EACH ROW
   EXECUTE FUNCTION public.fn_check_team_member_count();
   ```

2. **Team Leader Assignment**
   ```sql
   CREATE TRIGGER trg_assign_team_leader
   AFTER INSERT ON public.team
   FOR EACH ROW
   EXECUTE FUNCTION public.fn_assign_team_leader();
   ```

### Functions

1. **Team Management**
   ```sql
   CREATE FUNCTION public.create_team(
     p_name text,
     p_description text
   ) RETURNS uuid
   LANGUAGE plpgsql
   SECURITY DEFINER
   AS $$
   DECLARE
     v_team_id uuid;
   BEGIN
     INSERT INTO public.team (name, description, leader_id)
     VALUES (p_name, p_description, auth.uid())
     RETURNING id INTO v_team_id;
     RETURN v_team_id;
   END;
   $$;

   CREATE FUNCTION public.update_team_member_status(
     p_team_member_id uuid,
     p_status text
   ) RETURNS void
   LANGUAGE plpgsql
   SECURITY DEFINER
   AS $$
   BEGIN
     UPDATE public.team_member
     SET status = p_status,
         updated_at = now()
     WHERE id = p_team_member_id;
   END;
   $$;
   ```

## Debate Schema

### Tables

1. **debate.match**
   ```sql
   CREATE TABLE debate.match (
     id uuid DEFAULT gen_random_uuid() NOT NULL,
     format text NOT NULL,
     status text DEFAULT 'PENDING'::text NOT NULL,
     team1_id uuid REFERENCES public.team(id) NOT NULL,
     team2_id uuid REFERENCES public.team(id) NOT NULL,
     winner_id uuid REFERENCES public.team(id),
     created_at timestamptz DEFAULT now() NOT NULL,
     updated_at timestamptz DEFAULT now() NOT NULL,
     CONSTRAINT format_check CHECK (format IN ('Lincoln-Douglas', 'Public-Forum', 'EDL_ASYNC', 'World-Schools', 'EMD DEBATE', 'EDL')),
     CONSTRAINT status_check CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
     CONSTRAINT different_teams CHECK (team1_id != team2_id)
   );
   ```

2. **debate.round**
   ```sql
   CREATE TABLE debate.round (
     id uuid DEFAULT gen_random_uuid() NOT NULL,
     match_id uuid REFERENCES debate.match(id) ON DELETE CASCADE NOT NULL,
     round_number integer NOT NULL,
     speaker_id uuid REFERENCES auth.users(id) NOT NULL,
     speech_type text NOT NULL,
     status text DEFAULT 'PENDING'::text NOT NULL,
     video_url text,
     created_at timestamptz DEFAULT now() NOT NULL,
     updated_at timestamptz DEFAULT now() NOT NULL,
     CONSTRAINT speech_type_check CHECK (speech_type IN ('CONSTRUCTIVE', 'REBUTTAL', 'SUMMARY', 'FINAL_FOCUS')),
     CONSTRAINT status_check CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED'))
   );
   ```

### Triggers

1. **Match Round Creation**
   ```sql
   CREATE TRIGGER trg_create_debate_rounds
   AFTER INSERT ON debate.match
   FOR EACH ROW
   EXECUTE FUNCTION debate.fn_create_debate_rounds();
   ```

2. **Match Status Update**
   ```sql
   CREATE TRIGGER trg_update_match_status
   AFTER UPDATE ON debate.round
   FOR EACH ROW
   EXECUTE FUNCTION debate.fn_update_match_status();
   ```

### Functions

1. **Match Management**
   ```sql
   CREATE FUNCTION debate.create_match(
     p_format text,
     p_team1_id uuid,
     p_team2_id uuid
   ) RETURNS uuid
   LANGUAGE plpgsql
   SECURITY DEFINER
   AS $$
   DECLARE
     v_match_id uuid;
   BEGIN
     INSERT INTO debate.match (format, team1_id, team2_id)
     VALUES (p_format, p_team1_id, p_team2_id)
     RETURNING id INTO v_match_id;
     RETURN v_match_id;
   END;
   $$;

   CREATE FUNCTION debate.update_match_status(
     p_match_id uuid,
     p_status text
   ) RETURNS void
   LANGUAGE plpgsql
   SECURITY DEFINER
   AS $$
   BEGIN
     UPDATE debate.match
     SET status = p_status,
         updated_at = now()
     WHERE id = p_match_id;
   END;
   $$;
   ```

2. **Round Management**
   ```sql
   CREATE FUNCTION debate.submit_round(
     p_round_id uuid,
     p_video_url text
   ) RETURNS void
   LANGUAGE plpgsql
   SECURITY DEFINER
   AS $$
   BEGIN
     UPDATE debate.round
     SET 
       video_url = p_video_url,
       status = 'COMPLETED',
       updated_at = now()
     WHERE id = p_round_id;
   END;
   $$;
   ```

## Common Security Policies

### Chat Schema
```sql
ALTER TABLE chat.room ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat.message ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat.participant ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view rooms they are part of" ON chat.room
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM chat.participant p
    WHERE p.room_id = id
    AND p.student_id = auth.uid()
  )
);

CREATE POLICY "Users can send messages to rooms they are part of" ON chat.message
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM chat.participant p
    WHERE p.room_id = room_id
    AND p.student_id = auth.uid()
  )
);
```

### Public Schema
```sql
ALTER TABLE public.team ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_member ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view teams" ON public.team
FOR SELECT USING (true);

CREATE POLICY "Team members can view team details" ON public.team_member
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.team_member tm
    WHERE tm.team_id = team_id
    AND tm.student_id = auth.uid()
    AND tm.status = 'ACCEPTED'
  )
);
```

### Debate Schema
```sql
ALTER TABLE debate.match ENABLE ROW LEVEL SECURITY;
ALTER TABLE debate.round ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Match participants can view matches" ON debate.match
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.team_member tm
    WHERE (tm.team_id = team1_id OR tm.team_id = team2_id)
    AND tm.student_id = auth.uid()
    AND tm.status = 'ACCEPTED'
  )
);

CREATE POLICY "Match participants can view rounds" ON debate.round
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM debate.match m
    JOIN public.team_member tm ON (tm.team_id = m.team1_id OR tm.team_id = m.team2_id)
    WHERE m.id = match_id
    AND tm.student_id = auth.uid()
    AND tm.status = 'ACCEPTED'
  )
);
```
