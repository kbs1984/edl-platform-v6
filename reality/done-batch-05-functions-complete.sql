---
session: "00053"
type: "migration-deployed"
status: "applied"
created: "2025-08-27"
title: "Deployed Migration: batch-05-functions-complete"
purpose: "Applied database migration - 27 functions"
topics: ["database", "migration", "reality", "deployed", "functions"]
priority: "P0"
domain: "reality"
reality_type: "deployed-migration"
deployment_status: "production"
verified: true
---

-- =============================================
-- Batch 05: Functions (Complete)
-- Session 00052
-- Purpose: Create all business logic functions
-- Dependencies: Batches 01-04 (schemas, types, tables, constraints)
-- Total Functions: 27 (16 public, 11 chat, 0 debate)
-- =============================================

BEGIN;

-- =============================================
-- PUBLIC SCHEMA FUNCTIONS (16 functions)
-- =============================================

-- Function: public.add_new_user (line 1464)
CREATE FUNCTION public.add_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
begin
  if new.raw_app_meta_data ->> 'provider' = 'email' then
    insert into public.profile (id)
    values (new.id);
    
  elsif new.raw_app_meta_data ->> 'provider' = 'kakao'
        or new.raw_app_meta_data ->> 'provider' = 'google' then
    insert into public.profile (id, email, name, image_path)
    values (
      new.id,
      new.email,
      new.raw_user_meta_data ->> 'name',
      new.raw_user_meta_data ->> 'avatar_url'
    );
  end if;
  
  return new;
end;
$$;

-- Function: public.check_friendship_update_allowed_columns (line 1494)
CREATE FUNCTION public.check_friendship_update_allowed_columns() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.user_id IS DISTINCT FROM OLD.user_id THEN
    RAISE EXCEPTION 'user_id는 업데이트할 수 없습니다.';
  END IF;
  
  IF NEW.friend_id IS DISTINCT FROM OLD.friend_id THEN
    RAISE EXCEPTION 'friend_id는 업데이트할 수 없습니다.';
  END IF;
  
  IF NEW.created_at IS DISTINCT FROM OLD.created_at THEN
    RAISE EXCEPTION 'created_at은 업데이트할 수 없습니다.';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Function: public.check_insert_allowed_columns (line 1521)
CREATE FUNCTION public.check_insert_allowed_columns() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  -- division는 삽입할 수 없음
  IF NEW.division IS NOT NULL THEN
    RAISE EXCEPTION 'division은 삽입할 수 없습니다.';
  END IF;

  IF NEW.level != 0 THEN
    RAISE EXCEPTION 'level은 삽입할 수 없습니다.';
  END IF;

  IF NEW.exp != 0 THEN
    RAISE EXCEPTION 'exp는 삽입할 수 없습니다.';
  END IF;

  IF NEW.ranking != '0'::smallint THEN
    RAISE EXCEPTION 'ranking은 삽입할 수 없습니다.';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Function: public.check_team_member_delete (line 1553)
CREATE FUNCTION public.check_team_member_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  -- 삭제 요청자가 본인(student_id)인지 확인
  IF auth.uid()::uuid <> OLD.student_id THEN
    -- 본인이 아니면 같은 팀에서 is_leader = true 인지 확인
    IF NOT EXISTS (
      SELECT 1
      FROM public.team_member tm
      WHERE tm.team_id = OLD.team_id
        AND tm.student_id = auth.uid()::uuid
        AND tm.is_leader = TRUE
    ) THEN
      RAISE EXCEPTION '삭제 권한이 없습니다. 본인이거나 팀 리더만 삭제할 수 있습니다.';
    END IF;
  END IF;
  RETURN OLD;
END;
$$;

-- Function: public.check_team_update_leader (line 1581)
CREATE FUNCTION public.check_team_update_leader() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  -- 인증된 사용자만
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Unauthorized: 로그인한 사용자만 접근할 수 있습니다.';
  END IF;

  -- 해당 팀의 리더인지 확인
  IF NOT EXISTS (
    SELECT 1
    FROM public.team_member tm
    WHERE tm.team_id   = OLD.id
      AND tm.student_id = auth.uid()::uuid
      AND tm.is_leader  = TRUE
  ) THEN
    RAISE EXCEPTION 'Permission denied: 오직 팀 리더만 팀 정보를 수정할 수 있습니다.';
  END IF;

  RETURN NEW;
END;
$$;

-- Function: public.check_update_allowed_columns (line 1612)
CREATE FUNCTION public.check_update_allowed_columns() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  -- division는 변경할 수 없음
  IF NEW.division IS DISTINCT FROM OLD.division THEN
    RAISE EXCEPTION 'division는 변경할 수 없습니다.';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Function: public.delete_empty_team_after_member_delete (line 1632)
CREATE FUNCTION public.delete_empty_team_after_member_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  -- 삭제된 멤버의 team_id에 해당하는 남은 멤버 수 조회
  IF NOT EXISTS (
    SELECT 1
    FROM public.team_member
    WHERE team_id = OLD.team_id
  ) THEN
    -- 남은 멤버가 없으면 team 삭제
    DELETE FROM public.team
    WHERE id = OLD.team_id;
  END IF;
  RETURN NULL;
END;
$$;

-- Function: public.delete_invalid_friendship (line 1657)
CREATE FUNCTION public.delete_invalid_friendship() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  -- 상태가 허용된 값에 없다면
  if new.status not in ('PENDING', 'ACCEPTED') then
    -- 방금 삽입/수정된 행을 삭제
    delete from public.friendship
      where id = new.id;
  end if;
  -- AFTER 트리거이므로 반환값은 무시되지만, convention 상 null을 반환
  return null;
end;
$$;

-- Function: public.get_friend_list (line 1679)
CREATE FUNCTION public.get_friend_list() RETURNS TABLE(id uuid, friend_id uuid, created_at timestamp with time zone, updated_at timestamp with time zone, status public.status)
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    f.id AS id,
    CASE 
      WHEN f.user_id = auth.uid() THEN f.friend_id
      ELSE f.user_id
    END AS friend_id,
    f.created_at,
    f.updated_at,
    f.status
  FROM public.friendship f
  WHERE (f.user_id = auth.uid() OR f.friend_id = auth.uid());
END;
$$;

-- Function: public.get_friend_profiles (line 1705)
CREATE FUNCTION public.get_friend_profiles() RETURNS TABLE(id uuid, friend_id uuid, image_path text, username text, exp integer)
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    AS $$
DECLARE
  current_user uuid;
BEGIN  
  RETURN QUERY
  SELECT 
    f.id AS friendship_id,
    CASE 
      WHEN f.user_id = auth.uid() THEN f.friend_id 
      ELSE f.user_id 
    END AS friend_id,
    p.image_path,
    p.username,
    s.exp
  FROM public.friendship f
  JOIN public.profile p
    ON p.id = (
         CASE 
           WHEN f.user_id = auth.uid() THEN f.friend_id 
           ELSE f.user_id 
         END
       )
  JOIN public.student s
    ON s.user_id = p.id
  WHERE (f.user_id = auth.uid() OR f.friend_id = auth.uid())
    AND f.status = 'ACCEPTED';
END;
$$;

-- Function: public.get_profile_and_student (line 1743)
CREATE FUNCTION public.get_profile_and_student(_user_id uuid) RETURNS TABLE(id uuid, name text, username text, image_path text, date_of_birth date, gender public.gender, user_role public.user_role_type, active boolean, term_agree_time timestamp with time zone, email text, invited boolean, student_id uuid, guardian_id uuid, school_id uuid, division public.division, location text, exp integer, ranking smallint, challenge_enabled boolean, graduation_year bigint, relationship_with_guardian text, level integer)
    LANGUAGE plpgsql STABLE
    AS $$
begin
  -- 1) Profile 존재 체크
  if not exists (
    select 1 from public.profile where id = _user_id
  ) then
    raise exception 'Profile not found' using errcode = 'P0001';
  end if;

  -- 2) Student 존재 체크
  if not exists (
    select 1 from public.student where user_id = _user_id
  ) then
    raise exception 'Student not found' using errcode = 'P0002';
  end if;

  -- 3) 실제 데이터 리턴
  return query
    select
      p.id, p.name, p.username, p.image_path, p.date_of_birth,
      p.gender, p.user_role, p.active, p.term_agree_time, p.email, p.invited,
      s.id           as student_id,
      s.guardian_id,
      s.school_id,
      s.division,
      s.location,
      s.exp,
      s.ranking,
      s.challenge_enabled,
      s.graduation_year,
      s.relationship_with_guardian,
      s.level
    from public.profile p
    left join public.student s on s.user_id = p.id
    where p.id = _user_id;
end;
$$;

-- Function: public.get_profile_uuid (line 1800)
CREATE FUNCTION public.get_profile_uuid(input text) RETURNS uuid
    LANGUAGE plpgsql STABLE
    AS $$
DECLARE
    id uuid;
BEGIN
    SELECT p.id
      INTO id
      FROM public.profile p
     WHERE p.email = input OR p.username = input
     LIMIT 1;

    RETURN id;
END;
$$;

-- Function: public.get_table_ddl (line 1823)
CREATE FUNCTION public.get_table_ddl(p_schema_name character varying, p_table_name character varying) RETURNS text
    LANGUAGE plpgsql
    AS $$
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
$$;

-- Function: public.search_school (line 1908)
CREATE FUNCTION public.search_school(search_query text) RETURNS TABLE(id uuid, name text)
    LANGUAGE sql STABLE
    AS $$
with preprocessed as (
  select 
    id, 
    name,
    translate(lower(name), ' ', '') as name_nospace,
    translate(lower(search_query), ' ', '') as query_nospace
  from school
)
select id, name
from (
  select 
    id, 
    name,
    case 
      when name_nospace ilike '%' || query_nospace || '%' then 1.0
      else similarity(name_nospace, query_nospace)
    end as score
  from preprocessed
) t
where score > 0.1
order by score desc;
$$;

-- Function: public.set_division (line 1941)
CREATE FUNCTION public.set_division() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  current_year INT := EXTRACT(YEAR FROM CURRENT_DATE)::INT;
  adjusted_year INT;
  current_grade INT;
BEGIN
  -- 7월 1일 기준으로 학년도 조정
  IF CURRENT_DATE >= make_date(current_year, 7, 1) THEN
    adjusted_year := current_year + 1;
  ELSE
    adjusted_year := current_year;
  END IF;

  -- 현재 학년 계산 (학생은 4학년부터 시작, 총 9년 과정으로 가정)
  -- graduationYear가 졸업하는 해라면, 현재 학년 = adjusted_year - graduationYear + 12
  current_grade := adjusted_year - NEW.graduation_year + 12;

  -- 학년에 따른 division 설정
  IF current_grade BETWEEN 4 AND 5 THEN
    NEW.division := 'VILLIGER';
  ELSIF current_grade BETWEEN 6 AND 7 THEN
    NEW.division := 'LOWER';
  ELSIF current_grade BETWEEN 8 AND 9 THEN
    NEW.division := 'UPPER';
  ELSIF current_grade BETWEEN 10 AND 12 THEN
    NEW.division := 'SENIOR';
  ELSE
    NEW.division := 'OPEN';
  END IF;

  RETURN NEW;
END;
$$;

-- Function: public.set_team_leader (line 1984)
CREATE FUNCTION public.set_team_leader(p_team_id uuid, p_student_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  -- 1. 인증 여부 확인
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Unauthorized: 로그인된 사용자만 호출할 수 있습니다.';
  END IF;

  -- 2. 호출자가 해당 팀의 멤버인지 확인
  IF NOT EXISTS (
    SELECT 1
      FROM public.team_member
     WHERE team_id    = p_team_id
       AND student_id = auth.uid()::uuid
  ) THEN
    RAISE EXCEPTION 'Permission denied: 호출자가 팀의 멤버가 아닙니다.';
  END IF;

  -- 3. 호출자가 현재 팀 리더인지 확인
  IF NOT EXISTS (
    SELECT 1
      FROM public.team_member
     WHERE team_id    = p_team_id
       AND student_id = auth.uid()::uuid
       AND is_leader  = TRUE
  ) THEN
    RAISE EXCEPTION 'Permission denied: 오직 현재 팀 리더만 리더를 변경할 수 있습니다.';
  END IF;

  -- 4. 새 리더가 같은 팀의 멤버인지 확인
  IF NOT EXISTS (
    SELECT 1
      FROM public.team_member
     WHERE team_id    = p_team_id
       AND student_id = p_student_id
  ) THEN
    RAISE EXCEPTION 'Cannot set leader: 대상 사용자가 해당 팀의 멤버가 아닙니다.';
  END IF;

  -- 5. 기존 리더들 해제
  UPDATE public.team_member
     SET is_leader = FALSE
   WHERE team_id   = p_team_id
     AND is_leader = TRUE;

  -- 6. 새로운 리더 지정
  UPDATE public.team_member
     SET is_leader = TRUE
   WHERE team_id    = p_team_id
     AND student_id = p_student_id;
END;
$$;

-- =============================================
-- CHAT SCHEMA FUNCTIONS (11 functions)
-- =============================================

-- Function: chat.approve_friendship (line 819)
CREATE FUNCTION chat.approve_friendship(p_friendship_id uuid) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  f RECORD;
  room_id UUID;
BEGIN
  -- 1) friendship 존재 및 PENDING 확인
  SELECT * INTO f
    FROM public.friendship
   WHERE id = p_friendship_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Friendship % not found', p_friendship_id;
  END IF;
  IF f.status = 'ACCEPTED' THEN
    -- 이미 승인된 경우, 기존 방 있으면 리턴
    SELECT r.id INTO room_id
      FROM chat.room r
      JOIN chat.participant p1 ON p1.room_id = r.id AND p1.student_id = f.user_id
      JOIN chat.participant p2 ON p2.room_id = r.id AND p2.student_id = f.friend_id
     WHERE r.type = 'FRIEND'
     LIMIT 1;
    IF room_id IS NOT NULL THEN
      RETURN room_id;
    END IF;
  END IF;

  -- 2) 상태 업데이트
  UPDATE public.friendship
     SET status = 'ACCEPTED', accpted_at = NOW(), updated_at = NOW()
   WHERE id = p_friendship_id;

  -- 3) 채팅방 생성
  INSERT INTO chat.room(type)
  VALUES ('FRIEND')
  RETURNING id INTO room_id;

  -- 4) participant 추가
  INSERT INTO chat.participant(room_id, student_id)
  VALUES (room_id, f.user_id), (room_id, f.friend_id)
  ON CONFLICT DO NOTHING;

  RETURN room_id;
END;
$$;

-- Function: chat.fn_add_guild_member_to_room (line 872)
CREATE FUNCTION chat.fn_add_guild_member_to_room() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  rid UUID;
BEGIN
  IF (TG_OP = 'INSERT' AND NEW.status = 'ACCEPTED')
   OR (TG_OP = 'UPDATE' AND NEW.status = 'ACCEPTED' AND OLD.status <> 'ACCEPTED')
  THEN
    SELECT id INTO rid
      FROM chat.room
     WHERE type = 'GUILD' AND guild_id = NEW.guild_id
     LIMIT 1;
    IF rid IS NOT NULL THEN
      INSERT INTO chat.participant(room_id, student_id)
      VALUES (rid, NEW.student_id)
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Function: chat.fn_add_team_member_to_room (line 902)
CREATE FUNCTION chat.fn_add_team_member_to_room() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  rid UUID;
BEGIN
  IF (TG_OP = 'INSERT' AND NEW.status = 'ACCEPTED')
   OR (TG_OP = 'UPDATE' AND NEW.status = 'ACCEPTED' AND OLD.status <> 'ACCEPTED')
  THEN
    SELECT id INTO rid
      FROM chat.room
     WHERE type = 'TEAM' AND team_id = NEW.team_id
     LIMIT 1;
    IF rid IS NOT NULL THEN
      INSERT INTO chat.participant(room_id, student_id)
      VALUES (rid, NEW.student_id)
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Function: chat.fn_create_guild_room (line 932)
CREATE FUNCTION chat.fn_create_guild_room() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO chat.room(type, title, guild_id)
  VALUES ('GUILD', NEW.name, NEW.id);
  RETURN NEW;
END;
$$;

-- Function: chat.fn_create_team_room (line 949)
CREATE FUNCTION chat.fn_create_team_room() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO chat.room(type, title, team_id)
  VALUES ('TEAM', NEW.name, NEW.id);
  RETURN NEW;
END;
$$;

-- Function: chat.fn_sync_guild_room_title (line 966)
CREATE FUNCTION chat.fn_sync_guild_room_title() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  UPDATE chat.room
    SET title = NEW.name, updated_at = NOW()
  WHERE type = 'GUILD' AND guild_id = NEW.id;
  RETURN NEW;
END;
$$;

-- Function: chat.fn_sync_team_room_title (line 984)
CREATE FUNCTION chat.fn_sync_team_room_title() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  UPDATE chat.room
    SET title = NEW.name, updated_at = NOW()
  WHERE type = 'TEAM' AND team_id = NEW.id;
  RETURN NEW;
END;
$$;

-- Function: chat.get_friend_room (line 1025)
CREATE FUNCTION chat.get_friend_room(p_user uuid, p_friend uuid) RETURNS chat.room
    LANGUAGE sql SECURITY DEFINER
    AS $$
  SELECT r.*
  FROM chat.room r
  JOIN chat.participant p1 ON p1.room_id = r.id AND p1.student_id = p_user
  JOIN chat.participant p2 ON p2.room_id = r.id AND p2.student_id = p_friend
  WHERE r.type = 'FRIEND'
  LIMIT 1
$$;

-- Function: chat.get_room_messages (line 1043)
CREATE FUNCTION chat.get_room_messages(p_room_id uuid) RETURNS TABLE(id uuid, room_id uuid, sender_id uuid, content text, is_system boolean, created_at timestamp with time zone, updated_at timestamp with time zone, sender_name text, image_path text)
    LANGUAGE sql SECURITY DEFINER
    AS $$
  SELECT
    m.id,
    m.room_id,
    m.sender_id,
    m.content,
    m.is_system,
    m.created_at,
    m.updated_at,
    p.name        AS sender_name,
    p.image_path
  FROM chat.message AS m
  JOIN public.profile AS p
    ON p.id = m.sender_id
  WHERE m.room_id = p_room_id
  ORDER BY m.created_at ASC;
$$;

-- Function: chat.is_room_member (line 1070)
CREATE FUNCTION chat.is_room_member(p_room_id uuid, p_user_id uuid) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _t   TEXT;
  _tid UUID;
  _gid UUID;
BEGIN
  SELECT type, team_id, guild_id
    INTO _t, _tid, _gid
    FROM chat.room
   WHERE id = p_room_id;

  IF _t = 'FRIEND' THEN
    RETURN EXISTS(
      SELECT 1 FROM chat.participant p
       WHERE p.room_id    = p_room_id
         AND p.student_id = p_user_id
    );
  ELSIF _t = 'TEAM' THEN
    RETURN EXISTS(
      SELECT 1 FROM public.team_member tm
       WHERE tm.team_id    = _tid
         AND tm.student_id = p_user_id
         AND tm.status     = 'ACCEPTED'::public.status
    );
  ELSIF _t = 'GUILD' THEN
    RETURN EXISTS(
      SELECT 1 FROM public.guild_member gm
       WHERE gm.guild_id    = _gid
         AND gm.student_id  = p_user_id
         AND gm.status      = 'ACCEPTED'::public.status
    );
  ELSE
    RETURN FALSE;
  END IF;
END;
$$;

-- Function: chat.set_timestamp (line 1116)
CREATE FUNCTION chat.set_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

-- =============================================
-- DEBATE SCHEMA FUNCTIONS (0 functions)
-- Note: No debate schema functions found in backup
-- =============================================

-- =============================================
-- VERIFICATION QUERIES
-- =============================================
-- After execution, verify with:
-- SELECT COUNT(*) FROM information_schema.routines
-- WHERE routine_schema IN ('public', 'chat', 'debate')
-- AND routine_type = 'FUNCTION';
-- Expected: 27

COMMIT;
