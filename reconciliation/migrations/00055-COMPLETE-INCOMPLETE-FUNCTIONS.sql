-- Session 00055: Complete Existing Incomplete Functions
-- Based on actual deployed functions from done-batch-05-functions-complete.sql
-- Completes Session 44's discovered incomplete implementations

-- ============================================
-- SECTION 1: COMPLETE INCOMPLETE add_new_user() FUNCTION
-- ============================================

-- Current function only sets profile.id, missing critical fields
-- Session 44 discovered this causes dashboard 500 errors

CREATE OR REPLACE FUNCTION public.add_new_user() 
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
AS $$
begin
  -- Handle email provider signup (most common)
  if new.raw_app_meta_data ->> 'provider' = 'email' then
    insert into public.profile (
      id, 
      email, 
      user_role, 
      active,
      created_at,
      updated_at
    )
    values (
      new.id,
      new.email,           -- Missing in original!
      'STUDENT',           -- Missing in original!
      true,                -- Missing in original!
      NOW(),
      NOW()
    );
    
    -- Also create student record (missing cascade in original!)
    insert into public.student (
      user_id, 
      location, 
      graduation_year, 
      level, 
      exp, 
      ranking,
      challenge_enabled
    )
    values (
      new.id,
      'Unknown',
      EXTRACT(YEAR FROM CURRENT_DATE) + 4,
      0, 0, 0,
      false
    );
    
  -- Handle OAuth providers (kakao, google)
  elsif new.raw_app_meta_data ->> 'provider' = 'kakao'
        or new.raw_app_meta_data ->> 'provider' = 'google' then
    insert into public.profile (
      id, 
      email, 
      name, 
      image_path,
      user_role,           -- Missing in original!
      active,              -- Missing in original!
      created_at,
      updated_at
    )
    values (
      new.id,
      new.email,
      new.raw_user_meta_data ->> 'name',
      new.raw_user_meta_data ->> 'avatar_url',
      'STUDENT',           -- Missing in original!
      true,                -- Missing in original!
      NOW(),
      NOW()
    );
    
    -- Also create student record for OAuth users (missing in original!)
    insert into public.student (
      user_id, 
      location, 
      graduation_year, 
      level, 
      exp, 
      ranking,
      challenge_enabled
    )
    values (
      new.id,
      'Unknown',
      EXTRACT(YEAR FROM CURRENT_DATE) + 4,
      0, 0, 0,
      false
    );
  end if;
  
  return new;
end;
$$;

-- ============================================
-- SECTION 2: ADD MISSING FUNCTIONS DASHBOARD EXPECTS
-- ============================================
-- Note: Some functions exist but may be incomplete, others are missing entirely

-- Add missing chat functions (these don't exist in batch-05)
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
  -- Look for existing direct room
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
  
  -- Create if doesn't exist
  IF v_room_id IS NULL THEN
    INSERT INTO chat.room (room_type, created_by, created_at)
    VALUES ('direct', auth.uid(), NOW())
    RETURNING id INTO v_room_id;
    
    -- Add participants
    INSERT INTO chat.participant (room_id, user_id, joined_at)
    VALUES 
      (v_room_id, auth.uid(), NOW()),
      (v_room_id, p_friend_id, NOW());
  END IF;
  
  RETURN v_room_id;
END;
$$;

-- ============================================
-- SECTION 3: ENHANCE INCOMPLETE FUNCTIONS
-- ============================================

-- The existing set_team_leader function may need enhancement
-- Let's check if it handles all cases properly
CREATE OR REPLACE FUNCTION public.set_team_leader(p_team_id uuid, p_student_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verify caller has permission (existing logic enhanced)
  IF NOT EXISTS (
    SELECT 1 FROM public.team_member tm
    WHERE tm.team_id = p_team_id
      AND tm.student_id = auth.uid()::uuid
      AND tm.is_leader = TRUE
  ) THEN
    RAISE EXCEPTION 'Only team leader can transfer leadership';
  END IF;

  -- Verify target is team member
  IF NOT EXISTS (
    SELECT 1 FROM public.team_member tm
    WHERE tm.team_id = p_team_id
      AND tm.student_id = p_student_id
  ) THEN
    RAISE EXCEPTION 'User must be team member to become leader';
  END IF;

  -- Remove current leader status
  UPDATE public.team_member
  SET is_leader = FALSE, updated_at = NOW()
  WHERE team_id = p_team_id
    AND is_leader = TRUE;

  -- Set new leader
  UPDATE public.team_member
  SET is_leader = TRUE, updated_at = NOW()
  WHERE team_id = p_team_id
    AND student_id = p_student_id;

  -- Update team record
  UPDATE public.team
  SET updated_at = NOW()
  WHERE id = p_team_id;
END;
$$;

-- ============================================
-- SECTION 4: GRANT PERMISSIONS
-- ============================================

-- Grant permissions for new functions
GRANT EXECUTE ON FUNCTION public.get_room_messages(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_friend_room(uuid) TO authenticated;

-- ============================================
-- SECTION 5: VERIFICATION
-- ============================================

-- Test the completed add_new_user function
SELECT 
  'add_new_user function updated' as status,
  proname as function_name,
  pronargs as arg_count
FROM pg_proc
WHERE proname = 'add_new_user'
  AND pronamespace = 'public'::regnamespace;

-- Show existing functions we're working with
SELECT 
  proname as existing_function,
  pronargs as parameters
FROM pg_proc
WHERE pronamespace = 'public'::regnamespace
  AND proname IN (
    'get_friend_profiles',
    'get_profile_uuid', 
    'search_school',
    'set_team_leader'
  )
ORDER BY proname;