-- Session 00055: Complete Function Fixes
-- Collaboration between Session 44 (testing) and Session 55 (systematic analysis)
-- Fixes incomplete functions + adds missing RPC functions

-- ============================================
-- SECTION 1: FIX SESSION 44'S CONFIRMED INCOMPLETE FUNCTIONS
-- ============================================

-- Fix 1: Complete add_new_user() function (Session 44's critical discovery)
CREATE OR REPLACE FUNCTION public.add_new_user()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create complete profile (not just id!)
  INSERT INTO public.profile (
    id, 
    email, 
    user_role, 
    active,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    'STUDENT',  -- Default role
    true,       -- Active by default
    NOW(),
    NOW()
  );
  
  -- Create student record for students (complete the cascade)
  INSERT INTO public.student (
    user_id, 
    location, 
    graduation_year, 
    level, 
    exp, 
    ranking,
    challenge_enabled
  ) VALUES (
    NEW.id,
    'Unknown',  -- Default location
    EXTRACT(YEAR FROM CURRENT_DATE) + 4,  -- 4 years from now
    0,  -- Starting level
    0,  -- Starting exp
    0,  -- Starting ranking
    false  -- Challenge disabled by default
  );
  
  -- Log the complete creation
  RAISE LOG 'Complete user setup created for %: profile + student record', NEW.id;
  
  RETURN NEW;
END;
$$;

-- ============================================
-- SECTION 2: ADD SESSION 55'S MISSING RPC FUNCTIONS
-- ============================================

-- Function: get_friend_profiles (dashboard expects this)
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

-- Function: get_profile_uuid (dashboard expects this)
CREATE OR REPLACE FUNCTION public.get_profile_uuid(input text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result_uuid uuid;
BEGIN
  -- Try username first
  SELECT id INTO result_uuid
  FROM profile
  WHERE username = input
  LIMIT 1;
  
  -- Fallback to email
  IF result_uuid IS NULL THEN
    SELECT id INTO result_uuid
    FROM profile
    WHERE email = input
    LIMIT 1;
  END IF;
  
  RETURN result_uuid;
END;
$$;

-- Function: search_school (dashboard expects this)
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
      ELSE 2
    END,
    s.name
  LIMIT 20;
END;
$$;

-- ============================================
-- SECTION 3: IMPROVE SUSPECTED INCOMPLETE FUNCTIONS
-- ============================================

-- Improve: set_team_leader (add complete permission transfer)
CREATE OR REPLACE FUNCTION public.set_team_leader(
  p_team_id uuid,
  p_user_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verify caller is current leader or creator
  IF NOT EXISTS (
    SELECT 1 FROM team_member
    WHERE team_id = p_team_id
    AND user_id = auth.uid()
    AND role IN ('leader', 'creator')
  ) THEN
    RAISE EXCEPTION 'Only team leader can transfer leadership';
  END IF;
  
  -- Verify target user is team member
  IF NOT EXISTS (
    SELECT 1 FROM team_member
    WHERE team_id = p_team_id
    AND user_id = p_user_id
  ) THEN
    RAISE EXCEPTION 'User must be team member to become leader';
  END IF;
  
  -- Remove leader role from current leader(s)
  UPDATE team_member
  SET role = 'member', updated_at = NOW()
  WHERE team_id = p_team_id
  AND role = 'leader';
  
  -- Set new leader
  UPDATE team_member
  SET role = 'leader', updated_at = NOW()
  WHERE team_id = p_team_id
  AND user_id = p_user_id;
  
  -- Update team metadata
  UPDATE team
  SET updated_at = NOW()
  WHERE id = p_team_id;
  
  -- Log the leadership change
  RAISE LOG 'Team leadership transferred: % to %', p_team_id, p_user_id;
END;
$$;

-- Add: Chat room functions (likely missing)
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
  -- Verify user can access this room
  IF NOT EXISTS (
    SELECT 1 FROM chat.participant
    WHERE room_id = p_room_id
    AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Access denied: not a participant in room';
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

CREATE OR REPLACE FUNCTION public.get_friend_room(p_friend_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_room_id uuid;
BEGIN
  -- Look for existing direct room between users
  SELECT r.id INTO v_room_id
  FROM chat.room r
  WHERE r.room_type = 'direct'
  AND EXISTS (
    SELECT 1 FROM chat.participant p1
    WHERE p1.room_id = r.id AND p1.user_id = auth.uid()
  )
  AND EXISTS (
    SELECT 1 FROM chat.participant p2  
    WHERE p2.room_id = r.id AND p2.user_id = p_friend_id
  )
  LIMIT 1;
  
  -- Create room if none exists
  IF v_room_id IS NULL THEN
    INSERT INTO chat.room (room_type, created_by, created_at)
    VALUES ('direct', auth.uid(), NOW())
    RETURNING id INTO v_room_id;
    
    -- Add both participants
    INSERT INTO chat.participant (room_id, user_id, joined_at)
    VALUES 
      (v_room_id, auth.uid(), NOW()),
      (v_room_id, p_friend_id, NOW());
  END IF;
  
  RETURN v_room_id;
END;
$$;

-- ============================================
-- SECTION 4: ENHANCED TRIGGERS FOR COMPLETE AUTOMATION
-- ============================================

-- Enhanced: Team creation with complete setup
CREATE OR REPLACE FUNCTION public.handle_team_creation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Add creator as team leader (not just member)
  INSERT INTO public.team_member (
    team_id,
    user_id,
    role,
    joined_at
  ) VALUES (
    NEW.id,
    NEW.created_by,
    'leader',  -- Creator is leader
    NOW()
  );
  
  -- Initialize team member count
  UPDATE team
  SET member_count = 1, updated_at = NOW()
  WHERE id = NEW.id;
  
  -- Log team creation
  RAISE LOG 'Team created with leader: % by %', NEW.id, NEW.created_by;
  
  RETURN NEW;
END;
$$;

-- Ensure trigger exists
DROP TRIGGER IF EXISTS on_team_created ON public.team;
CREATE TRIGGER on_team_created
  AFTER INSERT ON public.team
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_team_creation();

-- ============================================
-- SECTION 5: GRANT PERMISSIONS
-- ============================================

-- Grant permissions for all RPC functions
GRANT EXECUTE ON FUNCTION public.get_friend_profiles() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_profile_uuid(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.search_school(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.set_team_leader(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_room_messages(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_friend_room(uuid) TO authenticated;

-- ============================================
-- SECTION 6: VALIDATION QUERIES
-- ============================================

-- Verify the add_new_user function exists and is complete
SELECT 
  proname as function_name,
  prosrc as function_body
FROM pg_proc
WHERE proname = 'add_new_user'
AND pronamespace = 'public'::regnamespace;

-- Verify all RPC functions are accessible
SELECT 
  proname as rpc_function,
  pronargs as parameter_count,
  CASE 
    WHEN proacl IS NULL THEN 'No explicit permissions'
    ELSE 'Has permissions set'
  END as permission_status
FROM pg_proc
WHERE pronamespace = 'public'::regnamespace
AND proname IN (
  'get_friend_profiles',
  'get_profile_uuid', 
  'search_school',
  'set_team_leader',
  'get_room_messages',
  'get_friend_room'
);

-- Test profile creation completeness
-- This shows what fields the fixed add_new_user() will populate
SELECT 
  column_name,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profile'
ORDER BY ordinal_position;