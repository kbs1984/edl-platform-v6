-- Session 00055: Critical Business Logic Implementation
-- Based on discovery audit of auth gateway and dashboard expectations
-- Run this AFTER FIX-PROFILE-CREATION.sql

-- ============================================
-- SECTION 1: CRITICAL RPC FUNCTIONS
-- ============================================

-- Function: get_friend_profiles (expected by student-actions.ts)
CREATE OR REPLACE FUNCTION public.get_friend_profiles()
RETURNS TABLE (
  id uuid,
  email text,
  username text,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.email,
    p.username,
    p.created_at
  FROM profile p
  JOIN friendship f ON (
    (f.user_id = auth.uid() AND f.friend_id = p.id) OR
    (f.friend_id = auth.uid() AND f.user_id = p.id)
  )
  WHERE f.status = 'accepted';
END;
$$;

-- Function: get_profile_uuid (expected by student-actions.ts)
CREATE OR REPLACE FUNCTION public.get_profile_uuid(input text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result_uuid uuid;
BEGIN
  -- Try to find by username first
  SELECT id INTO result_uuid
  FROM profile
  WHERE username = input
  LIMIT 1;
  
  -- If not found, try by email
  IF result_uuid IS NULL THEN
    SELECT id INTO result_uuid
    FROM profile
    WHERE email = input
    LIMIT 1;
  END IF;
  
  RETURN result_uuid;
END;
$$;

-- Function: set_team_leader (expected by team-actions.ts)
CREATE OR REPLACE FUNCTION public.set_team_leader(
  p_team_id uuid,
  p_user_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verify caller is current team leader or team creator
  IF NOT EXISTS (
    SELECT 1 FROM team_member
    WHERE team_id = p_team_id
    AND user_id = auth.uid()
    AND role IN ('leader', 'creator')
  ) THEN
    RAISE EXCEPTION 'Only team leader can transfer leadership';
  END IF;
  
  -- Remove leader role from current leader
  UPDATE team_member
  SET role = 'member'
  WHERE team_id = p_team_id
  AND role = 'leader';
  
  -- Set new leader
  UPDATE team_member
  SET role = 'leader'
  WHERE team_id = p_team_id
  AND user_id = p_user_id;
END;
$$;

-- Function: search_school (expected by school-actions.ts)
CREATE OR REPLACE FUNCTION public.search_school(search_query text)
RETURNS TABLE (
  id uuid,
  name text,
  address text,
  city text,
  state text,
  country text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.name,
    s.address,
    s.city,
    s.state,
    s.country
  FROM school s
  WHERE 
    s.name ILIKE '%' || search_query || '%' OR
    s.city ILIKE '%' || search_query || '%' OR
    s.state ILIKE '%' || search_query || '%'
  ORDER BY 
    CASE 
      WHEN s.name ILIKE search_query || '%' THEN 1
      WHEN s.name ILIKE '%' || search_query || '%' THEN 2
      ELSE 3
    END,
    s.name
  LIMIT 20;
END;
$$;

-- Function: get_room_messages (expected by chat-actions.ts)
CREATE OR REPLACE FUNCTION public.get_room_messages(p_room_id uuid)
RETURNS TABLE (
  id uuid,
  room_id uuid,
  user_id uuid,
  content text,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verify user is participant in room
  IF NOT EXISTS (
    SELECT 1 FROM chat.participant
    WHERE room_id = p_room_id
    AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Not a participant in this room';
  END IF;
  
  RETURN QUERY
  SELECT 
    m.id,
    m.room_id,
    m.user_id,
    m.content,
    m.created_at,
    m.updated_at
  FROM chat.message m
  WHERE m.room_id = p_room_id
  ORDER BY m.created_at DESC
  LIMIT 100;
END;
$$;

-- Function: get_friend_room (expected by chat-actions.ts)
CREATE OR REPLACE FUNCTION public.get_friend_room(
  p_friend_id uuid
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_room_id uuid;
BEGIN
  -- Check if room already exists between these users
  SELECT r.id INTO v_room_id
  FROM chat.room r
  WHERE r.room_type = 'direct'
  AND EXISTS (
    SELECT 1 FROM chat.participant p1
    WHERE p1.room_id = r.id
    AND p1.user_id = auth.uid()
  )
  AND EXISTS (
    SELECT 1 FROM chat.participant p2
    WHERE p2.room_id = r.id
    AND p2.user_id = p_friend_id
  )
  LIMIT 1;
  
  -- If no room exists, create one
  IF v_room_id IS NULL THEN
    INSERT INTO chat.room (room_type, created_by)
    VALUES ('direct', auth.uid())
    RETURNING id INTO v_room_id;
    
    -- Add both participants
    INSERT INTO chat.participant (room_id, user_id)
    VALUES 
      (v_room_id, auth.uid()),
      (v_room_id, p_friend_id);
  END IF;
  
  RETURN v_room_id;
END;
$$;

-- ============================================
-- SECTION 2: CRITICAL TRIGGERS
-- ============================================

-- Trigger: When student is created, link to profile
CREATE OR REPLACE FUNCTION public.handle_student_creation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update profile with student role
  UPDATE profile
  SET role = 'student'
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_student_created
  AFTER INSERT ON public.student
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_student_creation();

-- Trigger: When team is created, add creator as leader
CREATE OR REPLACE FUNCTION public.handle_team_creation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Add creator as team leader
  INSERT INTO public.team_member (
    team_id,
    user_id,
    role,
    joined_at
  ) VALUES (
    NEW.id,
    NEW.created_by,
    'leader',
    NOW()
  );
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_team_created
  AFTER INSERT ON public.team
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_team_creation();

-- Trigger: Update team member count
CREATE OR REPLACE FUNCTION public.update_team_member_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE team
    SET member_count = member_count + 1
    WHERE id = NEW.team_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE team
    SET member_count = GREATEST(member_count - 1, 0)
    WHERE id = OLD.team_id;
  END IF;
  
  RETURN NULL;
END;
$$;

CREATE TRIGGER on_team_member_change
  AFTER INSERT OR DELETE ON public.team_member
  FOR EACH ROW
  EXECUTE FUNCTION public.update_team_member_count();

-- ============================================
-- SECTION 3: GRANT PERMISSIONS
-- ============================================

-- Grant execute permissions on all functions
GRANT EXECUTE ON FUNCTION public.get_friend_profiles() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_profile_uuid(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.set_team_leader(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_school(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_room_messages(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_friend_room(uuid) TO authenticated;

-- ============================================
-- SECTION 4: VERIFICATION QUERIES
-- ============================================

-- List all functions we just created
SELECT 
  proname as function_name,
  pronargs as arg_count
FROM pg_proc
WHERE pronamespace = 'public'::regnamespace
AND proname IN (
  'get_friend_profiles',
  'get_profile_uuid',
  'set_team_leader',
  'search_school',
  'get_room_messages',
  'get_friend_room'
);

-- List all triggers we just created
SELECT 
  tgname as trigger_name,
  tgrelid::regclass as table_name
FROM pg_trigger
WHERE tgname IN (
  'on_auth_user_created',
  'on_student_created',
  'on_team_created',
  'on_team_member_change'
);