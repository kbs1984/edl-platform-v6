00117-request-source

please see reality/00117-request-source-supabase-schema-niyrthumgjmtkjgtlbnq

friendship table 

Name	Format	Type	Description
id	
uuid
string	

created_at	
timestamp with time zone
string	

updated_at	
timestamp with time zone
string	

user_id	
uuid
string	

friend_id	
uuid
string	

status	
public.status
string	

accpted_at	
timestamp with time zone
string

===
Database Indexes

Schema	Table	Name	
public

friendship

friend_unique

CREATE UNIQUE INDEX friend_unique ON public.friendship USING btree (user_id, friend_id)

public

friendship

friendship_pkey

CREATE UNIQUE INDEX friendship_pkey ON public.friendship USING btree (id)




===
friendship policies

Name	Command	Applied to	Actions

Allow insert on friendship
INSERT	
authenticated


Allow select on friendship
SELECT	
authenticated


Allow update on friendship
UPDATE	
authenticated

===
friendship Triggers

Name	Table	Function	Events	Orientation	Enabled	
check_friendship_update_allowed_columns_trigger	
friendship

check_friendship_update_allowed_columns

BEFORE UPDATE
ROW


trg_cleanup_friendship_status	
friendship

delete_invalid_friendship

AFTER UPDATE
AFTER INSERT
ROW

===
frienship Functions

Name	Arguments	Return type	Security	

get_friend_list
-

TABLE(id uuid, friend_id uuid, created_at timestamp with time zone, updated_at timestamp with time zone, status status)

Definer	


get_friend_profiles
-

TABLE(id uuid, friend_id uuid, image_path text, username text, exp integer)

Definer	


get_profile_and_student
_user_id uuid

TABLE(id uuid, name text, username text, image_path text, date_of_birth date, gender gender, user_role user_role_type, active boolean, term_agree_time timestamp with time zone, email text, invited boolean, student_id uuid, guardian_id uuid, school_id uuid, division division, location text, exp integer, ranking smallint, challenge_enabled boolean, graduation_year bigint, relationship_with_guardian text, level integer)

Invoker

check_friendship_update_allowed_columns
-

trigger

Invoker	


delete_invalid_friendship
-

trigger

Invoker	




get_friend_list

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

get_friend_profiles

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

get_profile_uuid

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


check_friendship_update_allowed_columns

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


delete_invalid_friendship


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


===
Databse Enumerated Types

Schema	Name	Values	
public

debate_session_status	SCHEDULED, ONGOING, COMPLETED, CANCELLED	

public

status	PENDING, ACCEPTED, REJECTED, EXPIRED, CANCELLED	

public

group_type	GUILD, TEAM	

public

gender	MALE, FEMALE, do not wish to specify	

public

log_type	REQUEST_JOIN, JOINED, LEFT, INVITED, KICKED, UPDATED, DELETED, CREATED	

public

payment_provider	TOSS, NAVER_PAY, KAKAO_PAY	

public

division	VILLIGER, LOWER, UPPER, SENIOR, OPEN	

public

user_role_type	STUDENT, JUDGE, GUARDIAN	

public

payment_state	REQUESTED, PENDING, FAILED, COMPLETED, AUTHORIZED, ABANDONED, REFUNDED, PREAPPROVED	

public

debate_ballot_status_enum	PENDING, IN_PROGRESS, COMPLETE