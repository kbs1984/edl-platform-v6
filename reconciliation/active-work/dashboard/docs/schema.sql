--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 15.13 (Debian 15.13-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA auth;


--
-- Name: chat; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA chat;


--
-- Name: debate; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA debate;


--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA extensions;


--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA graphql;


--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA graphql_public;


--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA pgbouncer;


--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA realtime;


--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA storage;


--
-- Name: supabase_migrations; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA supabase_migrations;


--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA vault;


--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;


--
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: pgjwt; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgjwt WITH SCHEMA extensions;


--
-- Name: EXTENSION pgjwt; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgjwt IS 'JSON Web Token API for Postgresql';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


--
-- Name: criteria_group; Type: TYPE; Schema: debate; Owner: -
--

CREATE TYPE debate.criteria_group AS ENUM (
    'STYLE',
    'RESPECT',
    'ANALYSIS'
);


--
-- Name: speech_mode; Type: TYPE; Schema: debate; Owner: -
--

CREATE TYPE debate.speech_mode AS ENUM (
    'SYNC',
    'ASYNC'
);


--
-- Name: debate_ballot_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.debate_ballot_status_enum AS ENUM (
    'PENDING',
    'IN_PROGRESS',
    'COMPLETE'
);


--
-- Name: debate_session_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.debate_session_status AS ENUM (
    'SCHEDULED',
    'ONGOING',
    'COMPLETED',
    'CANCELLED'
);


--
-- Name: division; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.division AS ENUM (
    'VILLIGER',
    'LOWER',
    'UPPER',
    'SENIOR',
    'OPEN'
);


--
-- Name: TYPE division; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TYPE public.division IS 'Villiger 4~5, Lower 6~7, Upper 8~9, Senior 10~12, Open adults';


--
-- Name: gender; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.gender AS ENUM (
    'MALE',
    'FEMALE',
    'do not wish to specify'
);


--
-- Name: group_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.group_type AS ENUM (
    'GUILD',
    'TEAM'
);


--
-- Name: log_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.log_type AS ENUM (
    'REQUEST_JOIN',
    'JOINED',
    'LEFT',
    'INVITED',
    'KICKED',
    'UPDATED',
    'DELETED',
    'CREATED'
);


--
-- Name: payment_provider; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.payment_provider AS ENUM (
    'TOSS',
    'NAVER_PAY',
    'KAKAO_PAY'
);


--
-- Name: payment_state; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.payment_state AS ENUM (
    'REQUESTED',
    'PENDING',
    'FAILED',
    'COMPLETED',
    'AUTHORIZED',
    'ABANDONED',
    'REFUNDED',
    'PREAPPROVED'
);


--
-- Name: status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.status AS ENUM (
    'PENDING',
    'ACCEPTED',
    'REJECTED',
    'EXPIRED',
    'CANCELLED'
);


--
-- Name: user_role_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.user_role_type AS ENUM (
    'STUDENT',
    'JUDGE',
    'GUARDIAN'
);


--
-- Name: action; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: approve_friendship(uuid); Type: FUNCTION; Schema: chat; Owner: -
--

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


--
-- Name: fn_add_guild_member_to_room(); Type: FUNCTION; Schema: chat; Owner: -
--

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


--
-- Name: fn_add_team_member_to_room(); Type: FUNCTION; Schema: chat; Owner: -
--

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


--
-- Name: fn_create_guild_room(); Type: FUNCTION; Schema: chat; Owner: -
--

CREATE FUNCTION chat.fn_create_guild_room() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO chat.room(type, title, guild_id)
  VALUES ('GUILD', NEW.name, NEW.id);
  RETURN NEW;
END;
$$;


--
-- Name: fn_create_team_room(); Type: FUNCTION; Schema: chat; Owner: -
--

CREATE FUNCTION chat.fn_create_team_room() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO chat.room(type, title, team_id)
  VALUES ('TEAM', NEW.name, NEW.id);
  RETURN NEW;
END;
$$;


--
-- Name: fn_sync_guild_room_title(); Type: FUNCTION; Schema: chat; Owner: -
--

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


--
-- Name: fn_sync_team_room_title(); Type: FUNCTION; Schema: chat; Owner: -
--

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


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: room; Type: TABLE; Schema: chat; Owner: -
--

CREATE TABLE chat.room (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    type text NOT NULL,
    title text,
    team_id uuid,
    guild_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT room_type_assoc CHECK ((((type = 'FRIEND'::text) AND (team_id IS NULL) AND (guild_id IS NULL)) OR ((type = 'TEAM'::text) AND (team_id IS NOT NULL) AND (guild_id IS NULL)) OR ((type = 'GUILD'::text) AND (guild_id IS NOT NULL) AND (team_id IS NULL)))),
    CONSTRAINT room_type_check CHECK ((type = ANY (ARRAY['FRIEND'::text, 'TEAM'::text, 'GUILD'::text])))
);


--
-- Name: get_friend_room(uuid, uuid); Type: FUNCTION; Schema: chat; Owner: -
--

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


--
-- Name: get_room_messages(uuid); Type: FUNCTION; Schema: chat; Owner: -
--

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


--
-- Name: is_room_member(uuid, uuid); Type: FUNCTION; Schema: chat; Owner: -
--

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


--
-- Name: set_timestamp(); Type: FUNCTION; Schema: chat; Owner: -
--

CREATE FUNCTION chat.set_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: -
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
  BEGIN
      RAISE DEBUG 'PgBouncer auth request: %', p_usename;

      RETURN QUERY
      SELECT
          rolname::text,
          CASE WHEN rolvaliduntil < now()
              THEN null
              ELSE rolpassword::text
          END
      FROM pg_authid
      WHERE rolname=$1 and rolcanlogin;
  END;
  $_$;


--
-- Name: add_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

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


--
-- Name: check_friendship_update_allowed_columns(); Type: FUNCTION; Schema: public; Owner: -
--

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


--
-- Name: check_insert_allowed_columns(); Type: FUNCTION; Schema: public; Owner: -
--

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


--
-- Name: check_team_member_delete(); Type: FUNCTION; Schema: public; Owner: -
--

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


--
-- Name: check_team_update_leader(); Type: FUNCTION; Schema: public; Owner: -
--

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


--
-- Name: check_update_allowed_columns(); Type: FUNCTION; Schema: public; Owner: -
--

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


--
-- Name: delete_empty_team_after_member_delete(); Type: FUNCTION; Schema: public; Owner: -
--

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


--
-- Name: delete_invalid_friendship(); Type: FUNCTION; Schema: public; Owner: -
--

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


--
-- Name: get_friend_list(); Type: FUNCTION; Schema: public; Owner: -
--

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


--
-- Name: get_friend_profiles(); Type: FUNCTION; Schema: public; Owner: -
--

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


--
-- Name: get_profile_and_student(uuid); Type: FUNCTION; Schema: public; Owner: -
--

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


--
-- Name: FUNCTION get_profile_and_student(_user_id uuid); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.get_profile_and_student(_user_id uuid) IS '@graphql(
  { "name": "getProfileAndStudent", 
    "description": "Fetch profile + student by user_id; error if missing" }
)';


--
-- Name: get_profile_uuid(text); Type: FUNCTION; Schema: public; Owner: -
--

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


--
-- Name: get_table_ddl(character varying, character varying); Type: FUNCTION; Schema: public; Owner: -
--

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


--
-- Name: search_school(text); Type: FUNCTION; Schema: public; Owner: -
--

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


--
-- Name: set_division(); Type: FUNCTION; Schema: public; Owner: -
--

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


--
-- Name: set_team_leader(uuid, uuid); Type: FUNCTION; Schema: public; Owner: -
--

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


--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_;

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $$;


--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


--
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS SETOF realtime.wal_rls
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


--
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  BEGIN
    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (payload, event, topic, private, extension)
    VALUES (payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      PERFORM pg_notify(
          'realtime:system',
          jsonb_build_object(
              'error', SQLERRM,
              'function', 'realtime.send',
              'event', event,
              'topic', topic,
              'private', private
          )::text
      );
  END;
END;
$$;


--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


--
-- Name: add_prefixes(text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.add_prefixes(_bucket_id text, _name text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    prefixes text[];
BEGIN
    prefixes := "storage"."get_prefixes"("_name");

    IF array_length(prefixes, 1) > 0 THEN
        INSERT INTO storage.prefixes (name, bucket_id)
        SELECT UNNEST(prefixes) as name, "_bucket_id" ON CONFLICT DO NOTHING;
    END IF;
END;
$$;


--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


--
-- Name: delete_prefix(text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.delete_prefix(_bucket_id text, _name text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    -- Check if we can delete the prefix
    IF EXISTS(
        SELECT FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name") + 1
          AND "prefixes"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    )
    OR EXISTS(
        SELECT FROM "storage"."objects"
        WHERE "objects"."bucket_id" = "_bucket_id"
          AND "storage"."get_level"("objects"."name") = "storage"."get_level"("_name") + 1
          AND "objects"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    ) THEN
    -- There are sub-objects, skip deletion
    RETURN false;
    ELSE
        DELETE FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name")
          AND "prefixes"."name" = "_name";
        RETURN true;
    END IF;
END;
$$;


--
-- Name: delete_prefix_hierarchy_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.delete_prefix_hierarchy_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    prefix text;
BEGIN
    prefix := "storage"."get_prefix"(OLD."name");

    IF coalesce(prefix, '') != '' THEN
        PERFORM "storage"."delete_prefix"(OLD."bucket_id", prefix);
    END IF;

    RETURN OLD;
END;
$$;


--
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.enforce_bucket_name_length() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    SELECT string_to_array(name, '/') INTO _parts;
    SELECT _parts[array_length(_parts,1)] INTO _filename;
    RETURN reverse(split_part(reverse(_filename), '.', 1));
END
$$;


--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$$;


--
-- Name: get_level(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_level(name text) RETURNS integer
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
SELECT array_length(string_to_array("name", '/'), 1);
$$;


--
-- Name: get_prefix(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_prefix(name text) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $_$
SELECT
    CASE WHEN strpos("name", '/') > 0 THEN
             regexp_replace("name", '[\/]{1}[^\/]+\/?$', '')
         ELSE
             ''
        END;
$_$;


--
-- Name: get_prefixes(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_prefixes(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
DECLARE
    parts text[];
    prefixes text[];
    prefix text;
BEGIN
    -- Split the name into parts by '/'
    parts := string_to_array("name", '/');
    prefixes := '{}';

    -- Construct the prefixes, stopping one level below the last part
    FOR i IN 1..array_length(parts, 1) - 1 LOOP
            prefix := array_to_string(parts[1:i], '/');
            prefixes := array_append(prefixes, prefix);
    END LOOP;

    RETURN prefixes;
END;
$$;


--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::bigint) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;


--
-- Name: objects_insert_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.objects_insert_prefix_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    NEW.level := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


--
-- Name: objects_update_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.objects_update_prefix_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    old_prefixes TEXT[];
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Retrieve old prefixes
        old_prefixes := "storage"."get_prefixes"(OLD."name");

        -- Remove old prefixes that are only used by this object
        WITH all_prefixes as (
            SELECT unnest(old_prefixes) as prefix
        ),
        can_delete_prefixes as (
             SELECT prefix
             FROM all_prefixes
             WHERE NOT EXISTS (
                 SELECT 1 FROM "storage"."objects"
                 WHERE "bucket_id" = OLD."bucket_id"
                   AND "name" <> OLD."name"
                   AND "name" LIKE (prefix || '%')
             )
         )
        DELETE FROM "storage"."prefixes" WHERE name IN (SELECT prefix FROM can_delete_prefixes);

        -- Add new prefixes
        PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    END IF;
    -- Set the new level
    NEW."level" := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


--
-- Name: prefixes_insert_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.prefixes_insert_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    RETURN NEW;
END;
$$;


--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql
    AS $$
declare
    can_bypass_rls BOOLEAN;
begin
    SELECT rolbypassrls
    INTO can_bypass_rls
    FROM pg_roles
    WHERE rolname = coalesce(nullif(current_setting('role', true), 'none'), current_user);

    IF can_bypass_rls THEN
        RETURN QUERY SELECT * FROM storage.search_v1_optimised(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    ELSE
        RETURN QUERY SELECT * FROM storage.search_legacy_v1(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    END IF;
end;
$$;


--
-- Name: search_legacy_v1(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search_legacy_v1(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select path_tokens[$1] as folder
           from storage.objects
             where objects.name ilike $2 || $3 || ''%''
               and bucket_id = $4
               and array_length(objects.path_tokens, 1) <> $1
           group by folder
           order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


--
-- Name: search_v1_optimised(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search_v1_optimised(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select (string_to_array(name, ''/''))[level] as name
           from storage.prefixes
             where lower(prefixes.name) like lower($2 || $3) || ''%''
               and bucket_id = $4
               and level = $1
           order by name ' || v_sort_order || '
     )
     (select name,
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[level] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where lower(objects.name) like lower($2 || $3) || ''%''
       and bucket_id = $4
       and level = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


--
-- Name: search_v2(text, text, integer, integer, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
BEGIN
    RETURN query EXECUTE
        $sql$
        SELECT * FROM (
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name || '/' AS name,
                    NULL::uuid AS id,
                    NULL::timestamptz AS updated_at,
                    NULL::timestamptz AS created_at,
                    NULL::jsonb AS metadata
                FROM storage.prefixes
                WHERE name COLLATE "C" LIKE $1 || '%'
                AND bucket_id = $2
                AND level = $4
                AND name COLLATE "C" > $5
                ORDER BY prefixes.name COLLATE "C" LIMIT $3
            )
            UNION ALL
            (SELECT split_part(name, '/', $4) AS key,
                name,
                id,
                updated_at,
                created_at,
                metadata
            FROM storage.objects
            WHERE name COLLATE "C" LIKE $1 || '%'
                AND bucket_id = $2
                AND level = $4
                AND name COLLATE "C" > $5
            ORDER BY name COLLATE "C" LIMIT $3)
        ) obj
        ORDER BY name COLLATE "C" LIMIT $3;
        $sql$
        USING prefix, bucket_name, limits, levels, start_after;
END;
$_$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text NOT NULL,
    code_challenge_method auth.code_challenge_method NOT NULL,
    code_challenge text NOT NULL,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone
);


--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.flow_state IS 'stores metadata for pkce logins';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid
);


--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: -
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: -
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text
);


--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: message; Type: TABLE; Schema: chat; Owner: -
--

CREATE TABLE chat.message (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    room_id uuid NOT NULL,
    sender_id uuid NOT NULL,
    content text NOT NULL,
    is_system boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: participant; Type: TABLE; Schema: chat; Owner: -
--

CREATE TABLE chat.participant (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    room_id uuid NOT NULL,
    student_id uuid NOT NULL,
    joined_at timestamp with time zone DEFAULT now() NOT NULL,
    last_read_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: ballots; Type: TABLE; Schema: debate; Owner: -
--

CREATE TABLE debate.ballots (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    debate_id uuid NOT NULL,
    judge_id uuid NOT NULL,
    status public.debate_ballot_status_enum DEFAULT 'PENDING'::public.debate_ballot_status_enum,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    submitted_at timestamp with time zone,
    format_id uuid NOT NULL,
    version integer DEFAULT 1
);


--
-- Name: criteria; Type: TABLE; Schema: debate; Owner: -
--

CREATE TABLE debate.criteria (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "group" debate.criteria_group NOT NULL,
    name text NOT NULL,
    criteria text NOT NULL,
    label text NOT NULL,
    format_id uuid
);


--
-- Name: debate_formats; Type: TABLE; Schema: debate; Owner: -
--

CREATE TABLE debate.debate_formats (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text
);


--
-- Name: debate_participants; Type: TABLE; Schema: debate; Owner: -
--

CREATE TABLE debate.debate_participants (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    debate_team_id uuid NOT NULL,
    user_id uuid NOT NULL,
    invite_status public.status DEFAULT 'PENDING'::public.status,
    speaker_position smallint NOT NULL
);


--
-- Name: debate_teams; Type: TABLE; Schema: debate; Owner: -
--

CREATE TABLE debate.debate_teams (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    debate_id uuid NOT NULL,
    side_id uuid NOT NULL
);


--
-- Name: debates; Type: TABLE; Schema: debate; Owner: -
--

CREATE TABLE debate.debates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    debate_format_id uuid NOT NULL,
    motion_id uuid NOT NULL,
    scheduled_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    mode debate.speech_mode NOT NULL
);


--
-- Name: format_rounds; Type: TABLE; Schema: debate; Owner: -
--

CREATE TABLE debate.format_rounds (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    debate_format_id uuid NOT NULL,
    round_template_id uuid NOT NULL,
    sequence integer NOT NULL,
    side_id uuid NOT NULL,
    speaker_positions smallint[] NOT NULL,
    number_of_speakers smallint NOT NULL
);


--
-- Name: genres; Type: TABLE; Schema: debate; Owner: -
--

CREATE TABLE debate.genres (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    title text NOT NULL,
    description text,
    proposer_id uuid NOT NULL
);


--
-- Name: judge_comments; Type: TABLE; Schema: debate; Owner: -
--

CREATE TABLE debate.judge_comments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    video_id uuid NOT NULL,
    judge_id uuid NOT NULL,
    criteria_id uuid NOT NULL,
    at_seconds integer NOT NULL,
    comment text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: judge_scores; Type: TABLE; Schema: debate; Owner: -
--

CREATE TABLE debate.judge_scores (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    debate_id uuid NOT NULL,
    judge_id uuid NOT NULL,
    criteria_id uuid NOT NULL,
    score numeric NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: matchmaking_queue_entries; Type: TABLE; Schema: debate; Owner: -
--

CREATE TABLE debate.matchmaking_queue_entries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    team_id uuid NOT NULL,
    debate_format_id uuid NOT NULL,
    league_id public.division NOT NULL,
    team_rank integer NOT NULL,
    challenge_mode_active boolean DEFAULT false NOT NULL,
    status public.debate_session_status NOT NULL,
    queued_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    debate_id uuid,
    opponent_id uuid
);


--
-- Name: motions; Type: TABLE; Schema: debate; Owner: -
--

CREATE TABLE debate.motions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    topic text NOT NULL,
    genre_id uuid NOT NULL,
    details text,
    proposer_id uuid NOT NULL
);


--
-- Name: round_templates; Type: TABLE; Schema: debate; Owner: -
--

CREATE TABLE debate.round_templates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    default_time integer,
    description text NOT NULL
);


--
-- Name: sides; Type: TABLE; Schema: debate; Owner: -
--

CREATE TABLE debate.sides (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL
);


--
-- Name: speeches; Type: TABLE; Schema: debate; Owner: -
--

CREATE TABLE debate.speeches (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    debate_id uuid NOT NULL,
    format_round_id uuid NOT NULL,
    participant_id uuid NOT NULL,
    content text,
    delivered_at timestamp with time zone DEFAULT now(),
    duration_seconds integer
);


--
-- Name: videos; Type: TABLE; Schema: debate; Owner: -
--

CREATE TABLE debate.videos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    debate_id uuid NOT NULL,
    storage_path text NOT NULL,
    url text NOT NULL,
    uploaded_by uuid NOT NULL,
    uploaded_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: admin; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: bank_account; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bank_account (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    active boolean NOT NULL,
    guardian_id uuid NOT NULL,
    name text NOT NULL,
    routing text NOT NULL,
    swift_code text NOT NULL,
    i_b_a_n text NOT NULL
);


--
-- Name: friendship; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.friendship (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now(),
    user_id uuid DEFAULT auth.uid() NOT NULL,
    friend_id uuid NOT NULL,
    status public.status DEFAULT 'PENDING'::public.status NOT NULL,
    accpted_at timestamp with time zone
);


--
-- Name: guardian; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.guardian (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid DEFAULT auth.uid() NOT NULL,
    payment_method text,
    billing_address text
);


--
-- Name: guardian_request; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.guardian_request (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    status public.status DEFAULT 'PENDING'::public.status,
    updated_at timestamp without time zone NOT NULL,
    sender uuid,
    reciever uuid
);


--
-- Name: TABLE guardian_request; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.guardian_request IS 'guardian or student sending request to guardian or student to be their guardian';


--
-- Name: guild; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.guild (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    school_id uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    name text NOT NULL,
    requirement text NOT NULL,
    division public.division NOT NULL,
    image_path text NOT NULL,
    description text NOT NULL
);


--
-- Name: guild_member; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.guild_member (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    student_id uuid NOT NULL,
    guild_id uuid NOT NULL,
    join_date timestamp(3) without time zone,
    is_leader boolean DEFAULT false NOT NULL,
    status public.status DEFAULT 'PENDING'::public.status NOT NULL
);


--
-- Name: invitation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.invitation (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    accepted_at timestamp(3) without time zone,
    inviter_id uuid NOT NULL,
    invitee_id uuid NOT NULL,
    team_id uuid,
    guild_id uuid,
    status public.status DEFAULT 'PENDING'::public.status NOT NULL,
    expires_at timestamp(3) without time zone,
    type public.group_type NOT NULL
);


--
-- Name: judge; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.judge (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid DEFAULT auth.uid() NOT NULL,
    job_title text NOT NULL,
    biography text NOT NULL,
    bank_account_info text,
    referral_user_id uuid
);


--
-- Name: log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    log_type public.log_type NOT NULL,
    description text NOT NULL,
    guild_id uuid,
    team_id uuid,
    student_id uuid NOT NULL,
    type public.group_type NOT NULL
);


--
-- Name: payment_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payment_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    guardian_id uuid NOT NULL,
    amount integer NOT NULL,
    currency_code text NOT NULL,
    payment_provider public.payment_provider NOT NULL,
    payment_date timestamp(3) without time zone NOT NULL,
    payment_state public.payment_state NOT NULL
);


--
-- Name: profile; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profile (
    id uuid DEFAULT auth.uid() NOT NULL,
    name text DEFAULT ''::text,
    username text,
    image_path text,
    date_of_birth date,
    gender public.gender,
    user_role public.user_role_type,
    active boolean DEFAULT false NOT NULL,
    term_agree_time timestamp with time zone,
    email text DEFAULT ''::text,
    invited boolean DEFAULT false NOT NULL
);


--
-- Name: COLUMN profile.term_agree_time; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.profile.term_agree_time IS 'Records when the user agreed the terms and conditions';


--
-- Name: COLUMN profile.invited; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.profile.invited IS 'check if guardian invited the user. if invited, role is going to be fixed as student';


--
-- Name: rating; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rating (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    rate integer NOT NULL,
    judge_id uuid NOT NULL,
    rater_id uuid NOT NULL
);


--
-- Name: school; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.school (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT now() NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT now() NOT NULL,
    created_by uuid DEFAULT auth.uid() NOT NULL
);


--
-- Name: COLUMN school.created_by; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.school.created_by IS 'user uuid who created';


--
-- Name: student; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid DEFAULT auth.uid() NOT NULL,
    guardian_id uuid,
    school_id uuid,
    division public.division,
    location text NOT NULL,
    exp integer DEFAULT 0 NOT NULL,
    ranking smallint DEFAULT '0'::smallint NOT NULL,
    challenge_enabled boolean DEFAULT false NOT NULL,
    graduation_year bigint NOT NULL,
    relationship_with_guardian text,
    level integer DEFAULT 0 NOT NULL,
    CONSTRAINT "Student_graduationYear_check" CHECK ((graduation_year <= ((EXTRACT(year FROM CURRENT_DATE))::integer + 10))),
    CONSTRAINT chk_graduation_year CHECK ((graduation_year <= ((EXTRACT(year FROM CURRENT_DATE))::integer + 10)))
);


--
-- Name: COLUMN student.challenge_enabled; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.student.challenge_enabled IS '상위 division이랑도 매칭 잡히는거 활성화 여부';


--
-- Name: COLUMN student.graduation_year; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.student.graduation_year IS 'Graduation year of the graduated student will be stored as 2000';


--
-- Name: team; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.team (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    division public.division NOT NULL,
    image_path text NOT NULL
);


--
-- Name: team_member; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.team_member (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    student_id uuid NOT NULL,
    team_id uuid NOT NULL,
    join_date timestamp(3) without time zone,
    is_leader boolean DEFAULT false NOT NULL,
    status public.status DEFAULT 'PENDING'::public.status NOT NULL
);


--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


--
-- Name: messages_2025_05_14; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2025_05_14 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: messages_2025_05_15; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2025_05_15 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: messages_2025_05_16; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2025_05_16 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: messages_2025_05_17; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2025_05_17 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: messages_2025_05_18; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2025_05_18 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: messages_2025_05_19; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2025_05_19 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: messages_2025_05_20; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2025_05_20 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: messages_2025_05_21; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2025_05_21 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: messages_2025_05_22; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2025_05_22 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: messages_2025_05_23; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2025_05_23 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: -
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text
);


--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: objects; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb,
    level integer
);


--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: prefixes; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.prefixes (
    bucket_id text NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    level integer GENERATED ALWAYS AS (storage.get_level(name)) STORED NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);


--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: schema_migrations; Type: TABLE; Schema: supabase_migrations; Owner: -
--

CREATE TABLE supabase_migrations.schema_migrations (
    version text NOT NULL,
    statements text[],
    name text
);


--
-- Name: seed_files; Type: TABLE; Schema: supabase_migrations; Owner: -
--

CREATE TABLE supabase_migrations.seed_files (
    path text NOT NULL,
    hash text NOT NULL
);


--
-- Name: messages_2025_05_14; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_05_14 FOR VALUES FROM ('2025-05-14 00:00:00') TO ('2025-05-15 00:00:00');


--
-- Name: messages_2025_05_15; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_05_15 FOR VALUES FROM ('2025-05-15 00:00:00') TO ('2025-05-16 00:00:00');


--
-- Name: messages_2025_05_16; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_05_16 FOR VALUES FROM ('2025-05-16 00:00:00') TO ('2025-05-17 00:00:00');


--
-- Name: messages_2025_05_17; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_05_17 FOR VALUES FROM ('2025-05-17 00:00:00') TO ('2025-05-18 00:00:00');


--
-- Name: messages_2025_05_18; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_05_18 FOR VALUES FROM ('2025-05-18 00:00:00') TO ('2025-05-19 00:00:00');


--
-- Name: messages_2025_05_19; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_05_19 FOR VALUES FROM ('2025-05-19 00:00:00') TO ('2025-05-20 00:00:00');


--
-- Name: messages_2025_05_20; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_05_20 FOR VALUES FROM ('2025-05-20 00:00:00') TO ('2025-05-21 00:00:00');


--
-- Name: messages_2025_05_21; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_05_21 FOR VALUES FROM ('2025-05-21 00:00:00') TO ('2025-05-22 00:00:00');


--
-- Name: messages_2025_05_22; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_05_22 FOR VALUES FROM ('2025-05-22 00:00:00') TO ('2025-05-23 00:00:00');


--
-- Name: messages_2025_05_23; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_05_23 FOR VALUES FROM ('2025-05-23 00:00:00') TO ('2025-05-24 00:00:00');


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: message message_pkey; Type: CONSTRAINT; Schema: chat; Owner: -
--

ALTER TABLE ONLY chat.message
    ADD CONSTRAINT message_pkey PRIMARY KEY (id);


--
-- Name: participant participant_pkey; Type: CONSTRAINT; Schema: chat; Owner: -
--

ALTER TABLE ONLY chat.participant
    ADD CONSTRAINT participant_pkey PRIMARY KEY (id);


--
-- Name: participant participant_unique; Type: CONSTRAINT; Schema: chat; Owner: -
--

ALTER TABLE ONLY chat.participant
    ADD CONSTRAINT participant_unique UNIQUE (room_id, student_id);


--
-- Name: room room_pkey; Type: CONSTRAINT; Schema: chat; Owner: -
--

ALTER TABLE ONLY chat.room
    ADD CONSTRAINT room_pkey PRIMARY KEY (id);


--
-- Name: ballots ballots_debate_id_judge_id_key; Type: CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.ballots
    ADD CONSTRAINT ballots_debate_id_judge_id_key UNIQUE (debate_id, judge_id);


--
-- Name: ballots ballots_pkey; Type: CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.ballots
    ADD CONSTRAINT ballots_pkey PRIMARY KEY (id);


--
-- Name: criteria criteria_pkey; Type: CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.criteria
    ADD CONSTRAINT criteria_pkey PRIMARY KEY (id);


--
-- Name: debate_formats debate_formats_name_key; Type: CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.debate_formats
    ADD CONSTRAINT debate_formats_name_key UNIQUE (name);


--
-- Name: debate_formats debate_formats_pkey; Type: CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.debate_formats
    ADD CONSTRAINT debate_formats_pkey PRIMARY KEY (id);


--
-- Name: debate_participants debate_participants_pkey; Type: CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.debate_participants
    ADD CONSTRAINT debate_participants_pkey PRIMARY KEY (id);


--
-- Name: debate_teams debate_teams_pkey; Type: CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.debate_teams
    ADD CONSTRAINT debate_teams_pkey PRIMARY KEY (id);


--
-- Name: debates debates_pkey; Type: CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.debates
    ADD CONSTRAINT debates_pkey PRIMARY KEY (id);


--
-- Name: format_rounds format_rounds_format_sequence_unique; Type: CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.format_rounds
    ADD CONSTRAINT format_rounds_format_sequence_unique UNIQUE (debate_format_id, sequence);


--
-- Name: format_rounds format_rounds_pkey; Type: CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.format_rounds
    ADD CONSTRAINT format_rounds_pkey PRIMARY KEY (id);


--
-- Name: genres genres_pkey; Type: CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.genres
    ADD CONSTRAINT genres_pkey PRIMARY KEY (id);


--
-- Name: judge_comments judge_comments_pkey; Type: CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.judge_comments
    ADD CONSTRAINT judge_comments_pkey PRIMARY KEY (id);


--
-- Name: judge_scores judge_scores_pkey; Type: CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.judge_scores
    ADD CONSTRAINT judge_scores_pkey PRIMARY KEY (id);


--
-- Name: matchmaking_queue_entries matchmaking_queue_entries_pkey; Type: CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.matchmaking_queue_entries
    ADD CONSTRAINT matchmaking_queue_entries_pkey PRIMARY KEY (id);


--
-- Name: motions motions_pkey; Type: CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.motions
    ADD CONSTRAINT motions_pkey PRIMARY KEY (id);


--
-- Name: round_templates round_templates_code_key; Type: CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.round_templates
    ADD CONSTRAINT round_templates_code_key UNIQUE (code);


--
-- Name: round_templates round_templates_pkey; Type: CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.round_templates
    ADD CONSTRAINT round_templates_pkey PRIMARY KEY (id);


--
-- Name: sides sides_pkey; Type: CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.sides
    ADD CONSTRAINT sides_pkey PRIMARY KEY (id);


--
-- Name: sides sides_title_key; Type: CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.sides
    ADD CONSTRAINT sides_title_key UNIQUE (title);


--
-- Name: speeches speeches_pkey; Type: CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.speeches
    ADD CONSTRAINT speeches_pkey PRIMARY KEY (id);


--
-- Name: videos videos_pkey; Type: CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.videos
    ADD CONSTRAINT videos_pkey PRIMARY KEY (id);


--
-- Name: bank_account BankAccount_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bank_account
    ADD CONSTRAINT "BankAccount_pkey" PRIMARY KEY (id);


--
-- Name: guardian Guardian_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guardian
    ADD CONSTRAINT "Guardian_pkey" PRIMARY KEY (id);


--
-- Name: guild_member GuildMember_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guild_member
    ADD CONSTRAINT "GuildMember_pkey" PRIMARY KEY (id);


--
-- Name: guild Guild_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guild
    ADD CONSTRAINT "Guild_pkey" PRIMARY KEY (id);


--
-- Name: invitation Invitation_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invitation
    ADD CONSTRAINT "Invitation_pkey" PRIMARY KEY (id);


--
-- Name: judge Judge_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.judge
    ADD CONSTRAINT "Judge_pkey" PRIMARY KEY (id);


--
-- Name: log Log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.log
    ADD CONSTRAINT "Log_pkey" PRIMARY KEY (id);


--
-- Name: payment_history PaymentHistory_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_history
    ADD CONSTRAINT "PaymentHistory_pkey" PRIMARY KEY (id);


--
-- Name: rating Rating_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rating
    ADD CONSTRAINT "Rating_pkey" PRIMARY KEY (id);


--
-- Name: school School_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.school
    ADD CONSTRAINT "School_pkey" PRIMARY KEY (id);


--
-- Name: student Student_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT "Student_pkey" PRIMARY KEY (id);


--
-- Name: team_member TeamMember_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_member
    ADD CONSTRAINT "TeamMember_pkey" PRIMARY KEY (id);


--
-- Name: team Team_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team
    ADD CONSTRAINT "Team_pkey" PRIMARY KEY (id);


--
-- Name: profile User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profile
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: profile User_username_key1; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profile
    ADD CONSTRAINT "User_username_key1" UNIQUE (username);


--
-- Name: admin admin_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_pkey PRIMARY KEY (id);


--
-- Name: friendship friend_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.friendship
    ADD CONSTRAINT friend_unique UNIQUE (user_id, friend_id);


--
-- Name: friendship friendship_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.friendship
    ADD CONSTRAINT friendship_pkey PRIMARY KEY (id);


--
-- Name: guardian_request guardian_request_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guardian_request
    ADD CONSTRAINT guardian_request_pkey PRIMARY KEY (id);


--
-- Name: guardian guardian_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guardian
    ADD CONSTRAINT guardian_user_id_key UNIQUE (user_id);


--
-- Name: school school_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.school
    ADD CONSTRAINT school_name_key UNIQUE (name);


--
-- Name: student student_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_user_id_key UNIQUE (user_id);


--
-- Name: team_member team_member_student_team_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_member
    ADD CONSTRAINT team_member_student_team_unique UNIQUE (student_id, team_id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2025_05_14 messages_2025_05_14_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2025_05_14
    ADD CONSTRAINT messages_2025_05_14_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2025_05_15 messages_2025_05_15_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2025_05_15
    ADD CONSTRAINT messages_2025_05_15_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2025_05_16 messages_2025_05_16_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2025_05_16
    ADD CONSTRAINT messages_2025_05_16_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2025_05_17 messages_2025_05_17_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2025_05_17
    ADD CONSTRAINT messages_2025_05_17_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2025_05_18 messages_2025_05_18_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2025_05_18
    ADD CONSTRAINT messages_2025_05_18_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2025_05_19 messages_2025_05_19_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2025_05_19
    ADD CONSTRAINT messages_2025_05_19_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2025_05_20 messages_2025_05_20_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2025_05_20
    ADD CONSTRAINT messages_2025_05_20_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2025_05_21 messages_2025_05_21_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2025_05_21
    ADD CONSTRAINT messages_2025_05_21_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2025_05_22 messages_2025_05_22_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2025_05_22
    ADD CONSTRAINT messages_2025_05_22_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2025_05_23 messages_2025_05_23_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2025_05_23
    ADD CONSTRAINT messages_2025_05_23_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: prefixes prefixes_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.prefixes
    ADD CONSTRAINT prefixes_pkey PRIMARY KEY (bucket_id, level, name);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: -
--

ALTER TABLE ONLY supabase_migrations.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: seed_files seed_files_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: -
--

ALTER TABLE ONLY supabase_migrations.seed_files
    ADD CONSTRAINT seed_files_pkey PRIMARY KEY (path);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: idx_message_room; Type: INDEX; Schema: chat; Owner: -
--

CREATE INDEX idx_message_room ON chat.message USING btree (room_id, created_at DESC);


--
-- Name: idx_message_sender; Type: INDEX; Schema: chat; Owner: -
--

CREATE INDEX idx_message_sender ON chat.message USING btree (sender_id);


--
-- Name: idx_participant_room; Type: INDEX; Schema: chat; Owner: -
--

CREATE INDEX idx_participant_room ON chat.participant USING btree (room_id);


--
-- Name: idx_participant_student; Type: INDEX; Schema: chat; Owner: -
--

CREATE INDEX idx_participant_student ON chat.participant USING btree (student_id);


--
-- Name: idx_ballots_debate_id; Type: INDEX; Schema: debate; Owner: -
--

CREATE INDEX idx_ballots_debate_id ON debate.ballots USING btree (debate_id);


--
-- Name: idx_ballots_judge_id; Type: INDEX; Schema: debate; Owner: -
--

CREATE INDEX idx_ballots_judge_id ON debate.ballots USING btree (judge_id);


--
-- Name: idx_ballots_status; Type: INDEX; Schema: debate; Owner: -
--

CREATE INDEX idx_ballots_status ON debate.ballots USING btree (status);


--
-- Name: idx_criteria_format_id; Type: INDEX; Schema: debate; Owner: -
--

CREATE INDEX idx_criteria_format_id ON debate.criteria USING btree (format_id);


--
-- Name: idx_criteria_group; Type: INDEX; Schema: debate; Owner: -
--

CREATE INDEX idx_criteria_group ON debate.criteria USING btree ("group");


--
-- Name: Guardian_userId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Guardian_userId_idx" ON public.guardian USING btree (user_id);


--
-- Name: Guardian_userId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Guardian_userId_key" ON public.guardian USING btree (user_id);


--
-- Name: Invitation_inviteeId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Invitation_inviteeId_idx" ON public.invitation USING btree (invitee_id);


--
-- Name: Invitation_inviterId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Invitation_inviterId_idx" ON public.invitation USING btree (inviter_id);


--
-- Name: Judge_userId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Judge_userId_idx" ON public.judge USING btree (user_id);


--
-- Name: Judge_userId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Judge_userId_key" ON public.judge USING btree (user_id);


--
-- Name: Log_studentId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Log_studentId_idx" ON public.log USING btree (student_id);


--
-- Name: Student_userId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Student_userId_idx" ON public.student USING btree (user_id);


--
-- Name: Student_userId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Student_userId_key" ON public.student USING btree (user_id);


--
-- Name: User_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_id_key" ON public.profile USING btree (id);


--
-- Name: User_username_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_username_key" ON public.profile USING btree (username);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: subscription_subscription_id_entity_filters_key; Type: INDEX; Schema: realtime; Owner: -
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_key ON realtime.subscription USING btree (subscription_id, entity, filters);


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_name_bucket_unique; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX idx_name_bucket_unique ON storage.objects USING btree (name COLLATE "C", bucket_id);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: idx_objects_lower_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_objects_lower_name ON storage.objects USING btree ((path_tokens[level]), lower(name) text_pattern_ops, bucket_id, level);


--
-- Name: idx_prefixes_lower_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_prefixes_lower_name ON storage.prefixes USING btree (bucket_id, level, ((string_to_array(name, '/'::text))[level]), lower(name) text_pattern_ops);


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: objects_bucket_id_level_idx; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX objects_bucket_id_level_idx ON storage.objects USING btree (bucket_id, level, name COLLATE "C");


--
-- Name: messages_2025_05_14_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_05_14_pkey;


--
-- Name: messages_2025_05_15_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_05_15_pkey;


--
-- Name: messages_2025_05_16_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_05_16_pkey;


--
-- Name: messages_2025_05_17_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_05_17_pkey;


--
-- Name: messages_2025_05_18_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_05_18_pkey;


--
-- Name: messages_2025_05_19_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_05_19_pkey;


--
-- Name: messages_2025_05_20_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_05_20_pkey;


--
-- Name: messages_2025_05_21_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_05_21_pkey;


--
-- Name: messages_2025_05_22_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_05_22_pkey;


--
-- Name: messages_2025_05_23_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_05_23_pkey;


--
-- Name: users on_auth_user_created; Type: TRIGGER; Schema: auth; Owner: -
--

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.add_new_user();


--
-- Name: message trg_message_updated_at; Type: TRIGGER; Schema: chat; Owner: -
--

CREATE TRIGGER trg_message_updated_at BEFORE UPDATE ON chat.message FOR EACH ROW EXECUTE FUNCTION chat.set_timestamp();


--
-- Name: room trg_room_updated_at; Type: TRIGGER; Schema: chat; Owner: -
--

CREATE TRIGGER trg_room_updated_at BEFORE UPDATE ON chat.room FOR EACH ROW EXECUTE FUNCTION chat.set_timestamp();


--
-- Name: friendship check_friendship_update_allowed_columns_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER check_friendship_update_allowed_columns_trigger BEFORE UPDATE ON public.friendship FOR EACH ROW EXECUTE FUNCTION public.check_friendship_update_allowed_columns();


--
-- Name: student check_insert_allowed_columns_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER check_insert_allowed_columns_trigger BEFORE INSERT ON public.student FOR EACH ROW EXECUTE FUNCTION public.check_insert_allowed_columns();


--
-- Name: student check_update_allowed_columns_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER check_update_allowed_columns_trigger BEFORE UPDATE ON public.student FOR EACH ROW EXECUTE FUNCTION public.check_update_allowed_columns();


--
-- Name: team_member trg_after_delete_team_member; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_after_delete_team_member AFTER DELETE ON public.team_member FOR EACH ROW EXECUTE FUNCTION public.delete_empty_team_after_member_delete();


--
-- Name: team_member trg_before_delete_team_member; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_before_delete_team_member BEFORE DELETE ON public.team_member FOR EACH ROW EXECUTE FUNCTION public.check_team_member_delete();


--
-- Name: team trg_before_update_team; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_before_update_team BEFORE UPDATE ON public.team FOR EACH ROW EXECUTE FUNCTION public.check_team_update_leader();


--
-- Name: friendship trg_cleanup_friendship_status; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_cleanup_friendship_status AFTER INSERT OR UPDATE ON public.friendship FOR EACH ROW EXECUTE FUNCTION public.delete_invalid_friendship();


--
-- Name: guild trg_guild_create_room; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_guild_create_room AFTER INSERT ON public.guild FOR EACH ROW EXECUTE FUNCTION chat.fn_create_guild_room();


--
-- Name: guild_member trg_guild_member_add_participant; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_guild_member_add_participant AFTER INSERT OR UPDATE ON public.guild_member FOR EACH ROW EXECUTE FUNCTION chat.fn_add_guild_member_to_room();


--
-- Name: guild trg_guild_update_room_title; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_guild_update_room_title AFTER UPDATE OF name ON public.guild FOR EACH ROW WHEN ((old.name IS DISTINCT FROM new.name)) EXECUTE FUNCTION chat.fn_sync_guild_room_title();


--
-- Name: student trg_set_division; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_set_division BEFORE INSERT OR UPDATE ON public.student FOR EACH ROW EXECUTE FUNCTION public.set_division();


--
-- Name: team trg_team_create_room; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_team_create_room AFTER INSERT ON public.team FOR EACH ROW EXECUTE FUNCTION chat.fn_create_team_room();


--
-- Name: team_member trg_team_member_add_participant; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_team_member_add_participant AFTER INSERT OR UPDATE ON public.team_member FOR EACH ROW EXECUTE FUNCTION chat.fn_add_team_member_to_room();


--
-- Name: team trg_team_update_room_title; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_team_update_room_title AFTER UPDATE OF name ON public.team FOR EACH ROW WHEN ((old.name IS DISTINCT FROM new.name)) EXECUTE FUNCTION chat.fn_sync_team_room_title();


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: -
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();


--
-- Name: objects objects_delete_delete_prefix; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER objects_delete_delete_prefix AFTER DELETE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


--
-- Name: objects objects_insert_create_prefix; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER objects_insert_create_prefix BEFORE INSERT ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.objects_insert_prefix_trigger();


--
-- Name: objects objects_update_create_prefix; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER objects_update_create_prefix BEFORE UPDATE ON storage.objects FOR EACH ROW WHEN (((new.name <> old.name) OR (new.bucket_id <> old.bucket_id))) EXECUTE FUNCTION storage.objects_update_prefix_trigger();


--
-- Name: prefixes prefixes_create_hierarchy; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER prefixes_create_hierarchy BEFORE INSERT ON storage.prefixes FOR EACH ROW WHEN ((pg_trigger_depth() < 1)) EXECUTE FUNCTION storage.prefixes_insert_trigger();


--
-- Name: prefixes prefixes_delete_hierarchy; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER prefixes_delete_hierarchy AFTER DELETE ON storage.prefixes FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: message message_room_id_fkey; Type: FK CONSTRAINT; Schema: chat; Owner: -
--

ALTER TABLE ONLY chat.message
    ADD CONSTRAINT message_room_id_fkey FOREIGN KEY (room_id) REFERENCES chat.room(id) ON DELETE CASCADE;


--
-- Name: message message_sender_id_fkey; Type: FK CONSTRAINT; Schema: chat; Owner: -
--

ALTER TABLE ONLY chat.message
    ADD CONSTRAINT message_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.profile(id);


--
-- Name: participant participant_room_id_fkey; Type: FK CONSTRAINT; Schema: chat; Owner: -
--

ALTER TABLE ONLY chat.participant
    ADD CONSTRAINT participant_room_id_fkey FOREIGN KEY (room_id) REFERENCES chat.room(id) ON DELETE CASCADE;


--
-- Name: participant participant_student_id_fkey; Type: FK CONSTRAINT; Schema: chat; Owner: -
--

ALTER TABLE ONLY chat.participant
    ADD CONSTRAINT participant_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.profile(id);


--
-- Name: room room_guild_id_fkey; Type: FK CONSTRAINT; Schema: chat; Owner: -
--

ALTER TABLE ONLY chat.room
    ADD CONSTRAINT room_guild_id_fkey FOREIGN KEY (guild_id) REFERENCES public.guild(id);


--
-- Name: room room_team_id_fkey; Type: FK CONSTRAINT; Schema: chat; Owner: -
--

ALTER TABLE ONLY chat.room
    ADD CONSTRAINT room_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.team(id);


--
-- Name: ballots ballots_debate_id_fkey; Type: FK CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.ballots
    ADD CONSTRAINT ballots_debate_id_fkey FOREIGN KEY (debate_id) REFERENCES debate.debates(id);


--
-- Name: ballots ballots_format_id_fkey; Type: FK CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.ballots
    ADD CONSTRAINT ballots_format_id_fkey FOREIGN KEY (format_id) REFERENCES debate.debate_formats(id);


--
-- Name: ballots ballots_judge_id_fkey; Type: FK CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.ballots
    ADD CONSTRAINT ballots_judge_id_fkey FOREIGN KEY (judge_id) REFERENCES public.judge(id);


--
-- Name: criteria criteria_format_id_fkey; Type: FK CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.criteria
    ADD CONSTRAINT criteria_format_id_fkey FOREIGN KEY (format_id) REFERENCES debate.debate_formats(id);


--
-- Name: debate_participants debate_participants_debate_team_id_fkey; Type: FK CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.debate_participants
    ADD CONSTRAINT debate_participants_debate_team_id_fkey FOREIGN KEY (debate_team_id) REFERENCES debate.debate_teams(id) ON DELETE CASCADE;


--
-- Name: debate_participants debate_participants_user_id_fkey; Type: FK CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.debate_participants
    ADD CONSTRAINT debate_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.student(user_id);


--
-- Name: debate_teams debate_teams_debate_id_fkey; Type: FK CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.debate_teams
    ADD CONSTRAINT debate_teams_debate_id_fkey FOREIGN KEY (debate_id) REFERENCES debate.debates(id) ON DELETE CASCADE;


--
-- Name: debate_teams debate_teams_side_id_fkey; Type: FK CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.debate_teams
    ADD CONSTRAINT debate_teams_side_id_fkey FOREIGN KEY (side_id) REFERENCES debate.sides(id);


--
-- Name: debates debates_debate_format_id_fkey; Type: FK CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.debates
    ADD CONSTRAINT debates_debate_format_id_fkey FOREIGN KEY (debate_format_id) REFERENCES debate.debate_formats(id);


--
-- Name: debates debates_motion_id_fkey; Type: FK CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.debates
    ADD CONSTRAINT debates_motion_id_fkey FOREIGN KEY (motion_id) REFERENCES debate.motions(id);


--
-- Name: format_rounds format_rounds_debate_format_id_fkey; Type: FK CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.format_rounds
    ADD CONSTRAINT format_rounds_debate_format_id_fkey FOREIGN KEY (debate_format_id) REFERENCES debate.debate_formats(id) ON DELETE CASCADE;


--
-- Name: format_rounds format_rounds_round_template_id_fkey; Type: FK CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.format_rounds
    ADD CONSTRAINT format_rounds_round_template_id_fkey FOREIGN KEY (round_template_id) REFERENCES debate.round_templates(id);


--
-- Name: format_rounds format_rounds_side_id_fkey; Type: FK CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.format_rounds
    ADD CONSTRAINT format_rounds_side_id_fkey FOREIGN KEY (side_id) REFERENCES debate.sides(id);


--
-- Name: genres genres_proposer_id_fkey; Type: FK CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.genres
    ADD CONSTRAINT genres_proposer_id_fkey FOREIGN KEY (proposer_id) REFERENCES public.profile(id);


--
-- Name: judge_comments judge_comments_criteria_id_fkey; Type: FK CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.judge_comments
    ADD CONSTRAINT judge_comments_criteria_id_fkey FOREIGN KEY (criteria_id) REFERENCES debate.criteria(id);


--
-- Name: judge_comments judge_comments_judge_id_fkey; Type: FK CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.judge_comments
    ADD CONSTRAINT judge_comments_judge_id_fkey FOREIGN KEY (judge_id) REFERENCES public.judge(user_id);


--
-- Name: judge_comments judge_comments_video_id_fkey; Type: FK CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.judge_comments
    ADD CONSTRAINT judge_comments_video_id_fkey FOREIGN KEY (video_id) REFERENCES debate.videos(id) ON DELETE CASCADE;


--
-- Name: judge_scores judge_scores_criteria_id_fkey; Type: FK CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.judge_scores
    ADD CONSTRAINT judge_scores_criteria_id_fkey FOREIGN KEY (criteria_id) REFERENCES debate.criteria(id);


--
-- Name: judge_scores judge_scores_debate_id_fkey; Type: FK CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.judge_scores
    ADD CONSTRAINT judge_scores_debate_id_fkey FOREIGN KEY (debate_id) REFERENCES debate.debates(id) ON DELETE CASCADE;


--
-- Name: judge_scores judge_scores_judge_id_fkey; Type: FK CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.judge_scores
    ADD CONSTRAINT judge_scores_judge_id_fkey FOREIGN KEY (judge_id) REFERENCES public.judge(user_id);


--
-- Name: matchmaking_queue_entries matchmaking_queue_entries_debate_format_id_fkey; Type: FK CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.matchmaking_queue_entries
    ADD CONSTRAINT matchmaking_queue_entries_debate_format_id_fkey FOREIGN KEY (debate_format_id) REFERENCES debate.debate_formats(id) ON DELETE RESTRICT;


--
-- Name: matchmaking_queue_entries matchmaking_queue_entries_debate_id_fkey; Type: FK CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.matchmaking_queue_entries
    ADD CONSTRAINT matchmaking_queue_entries_debate_id_fkey FOREIGN KEY (debate_id) REFERENCES debate.debates(id) ON DELETE SET NULL;


--
-- Name: matchmaking_queue_entries matchmaking_queue_entries_opponent_id_fkey; Type: FK CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.matchmaking_queue_entries
    ADD CONSTRAINT matchmaking_queue_entries_opponent_id_fkey FOREIGN KEY (opponent_id) REFERENCES public.team(id);


--
-- Name: matchmaking_queue_entries matchmaking_queue_entries_team_id_fkey; Type: FK CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.matchmaking_queue_entries
    ADD CONSTRAINT matchmaking_queue_entries_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.team(id) ON DELETE CASCADE;


--
-- Name: motions motions_genre_id_fkey; Type: FK CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.motions
    ADD CONSTRAINT motions_genre_id_fkey FOREIGN KEY (genre_id) REFERENCES debate.genres(id);


--
-- Name: motions motions_proposer_id_fkey; Type: FK CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.motions
    ADD CONSTRAINT motions_proposer_id_fkey FOREIGN KEY (proposer_id) REFERENCES public.profile(id);


--
-- Name: speeches speeches_debate_id_fkey; Type: FK CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.speeches
    ADD CONSTRAINT speeches_debate_id_fkey FOREIGN KEY (debate_id) REFERENCES debate.debates(id) ON DELETE CASCADE;


--
-- Name: speeches speeches_format_round_id_fkey; Type: FK CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.speeches
    ADD CONSTRAINT speeches_format_round_id_fkey FOREIGN KEY (format_round_id) REFERENCES debate.format_rounds(id);


--
-- Name: speeches speeches_participant_id_fkey; Type: FK CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.speeches
    ADD CONSTRAINT speeches_participant_id_fkey FOREIGN KEY (participant_id) REFERENCES debate.debate_participants(id);


--
-- Name: videos videos_debate_id_fkey; Type: FK CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.videos
    ADD CONSTRAINT videos_debate_id_fkey FOREIGN KEY (debate_id) REFERENCES debate.debates(id) ON DELETE CASCADE;


--
-- Name: videos videos_uploaded_by_fkey; Type: FK CONSTRAINT; Schema: debate; Owner: -
--

ALTER TABLE ONLY debate.videos
    ADD CONSTRAINT videos_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.profile(id);


--
-- Name: bank_account BankAccount_guardianId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bank_account
    ADD CONSTRAINT "BankAccount_guardianId_fkey" FOREIGN KEY (guardian_id) REFERENCES public.guardian(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: guardian Guardian_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guardian
    ADD CONSTRAINT "Guardian_userId_fkey" FOREIGN KEY (user_id) REFERENCES public.profile(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: guild_member GuildMember_guildId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guild_member
    ADD CONSTRAINT "GuildMember_guildId_fkey" FOREIGN KEY (guild_id) REFERENCES public.guild(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: guild_member GuildMember_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guild_member
    ADD CONSTRAINT "GuildMember_studentId_fkey" FOREIGN KEY (student_id) REFERENCES public.student(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: guild Guild_schoolId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guild
    ADD CONSTRAINT "Guild_schoolId_fkey" FOREIGN KEY (school_id) REFERENCES public.school(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: invitation Invitation_guildId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invitation
    ADD CONSTRAINT "Invitation_guildId_fkey" FOREIGN KEY (guild_id) REFERENCES public.guild(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: invitation Invitation_inviteeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invitation
    ADD CONSTRAINT "Invitation_inviteeId_fkey" FOREIGN KEY (invitee_id) REFERENCES public.profile(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: invitation Invitation_inviterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invitation
    ADD CONSTRAINT "Invitation_inviterId_fkey" FOREIGN KEY (inviter_id) REFERENCES public.profile(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: invitation Invitation_teamId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invitation
    ADD CONSTRAINT "Invitation_teamId_fkey" FOREIGN KEY (team_id) REFERENCES public.team(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: judge Judge_referralUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.judge
    ADD CONSTRAINT "Judge_referralUserId_fkey" FOREIGN KEY (referral_user_id) REFERENCES public.profile(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: judge Judge_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.judge
    ADD CONSTRAINT "Judge_userId_fkey" FOREIGN KEY (user_id) REFERENCES public.profile(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: log Log_guildId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.log
    ADD CONSTRAINT "Log_guildId_fkey" FOREIGN KEY (guild_id) REFERENCES public.guild(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: log Log_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.log
    ADD CONSTRAINT "Log_studentId_fkey" FOREIGN KEY (student_id) REFERENCES public.student(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: log Log_teamId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.log
    ADD CONSTRAINT "Log_teamId_fkey" FOREIGN KEY (team_id) REFERENCES public.team(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: payment_history PaymentHistory_guardianId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_history
    ADD CONSTRAINT "PaymentHistory_guardianId_fkey" FOREIGN KEY (guardian_id) REFERENCES public.guardian(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: rating Rating_judgeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rating
    ADD CONSTRAINT "Rating_judgeId_fkey" FOREIGN KEY (judge_id) REFERENCES public.judge(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: rating Rating_raterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rating
    ADD CONSTRAINT "Rating_raterId_fkey" FOREIGN KEY (rater_id) REFERENCES public.student(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student Student_guardianId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT "Student_guardianId_fkey" FOREIGN KEY (guardian_id) REFERENCES public.guardian(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: student Student_schoolId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT "Student_schoolId_fkey" FOREIGN KEY (school_id) REFERENCES public.school(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: team_member TeamMember_teamId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_member
    ADD CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY (team_id) REFERENCES public.team(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: profile User_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profile
    ADD CONSTRAINT "User_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: admin admin_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: friendship friendship_friend_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.friendship
    ADD CONSTRAINT friendship_friend_id_fkey FOREIGN KEY (friend_id) REFERENCES public.student(user_id) ON UPDATE CASCADE;


--
-- Name: friendship friendship_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.friendship
    ADD CONSTRAINT friendship_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.student(user_id) ON UPDATE CASCADE;


--
-- Name: guardian_request guardian_request_reciever_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guardian_request
    ADD CONSTRAINT guardian_request_reciever_fkey FOREIGN KEY (reciever) REFERENCES public.profile(id);


--
-- Name: guardian_request guardian_request_sender_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guardian_request
    ADD CONSTRAINT guardian_request_sender_fkey FOREIGN KEY (sender) REFERENCES public.profile(id);


--
-- Name: student student_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profile(id);


--
-- Name: team_member team_member_student_id_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_member
    ADD CONSTRAINT team_member_student_id_fkey1 FOREIGN KEY (student_id) REFERENCES public.profile(id);


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: prefixes prefixes_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.prefixes
    ADD CONSTRAINT "prefixes_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: participant Enable insert for users based on user_id; Type: POLICY; Schema: chat; Owner: -
--

CREATE POLICY "Enable insert for users based on user_id" ON chat.participant FOR INSERT WITH CHECK ((( SELECT auth.uid() AS uid) = student_id));


--
-- Name: participant Enable users to view their own data only; Type: POLICY; Schema: chat; Owner: -
--

CREATE POLICY "Enable users to view their own data only" ON chat.participant FOR SELECT TO authenticated USING (true);


--
-- Name: message delete_message; Type: POLICY; Schema: chat; Owner: -
--

CREATE POLICY delete_message ON chat.message FOR DELETE USING (((sender_id = auth.uid()) OR (auth.role() = 'admin'::text)));


--
-- Name: participant delete_participant; Type: POLICY; Schema: chat; Owner: -
--

CREATE POLICY delete_participant ON chat.participant FOR DELETE USING ((student_id = auth.uid()));


--
-- Name: room delete_room; Type: POLICY; Schema: chat; Owner: -
--

CREATE POLICY delete_room ON chat.room FOR DELETE USING ((EXISTS ( SELECT 1
   FROM chat.participant p
  WHERE ((p.room_id = room.id) AND (p.student_id = auth.uid())))));


--
-- Name: message insert_message; Type: POLICY; Schema: chat; Owner: -
--

CREATE POLICY insert_message ON chat.message FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM chat.participant p
  WHERE ((p.room_id = message.room_id) AND (p.student_id = auth.uid())))));


--
-- Name: message; Type: ROW SECURITY; Schema: chat; Owner: -
--

ALTER TABLE chat.message ENABLE ROW LEVEL SECURITY;

--
-- Name: participant; Type: ROW SECURITY; Schema: chat; Owner: -
--

ALTER TABLE chat.participant ENABLE ROW LEVEL SECURITY;

--
-- Name: room; Type: ROW SECURITY; Schema: chat; Owner: -
--

ALTER TABLE chat.room ENABLE ROW LEVEL SECURITY;

--
-- Name: message select_message; Type: POLICY; Schema: chat; Owner: -
--

CREATE POLICY select_message ON chat.message FOR SELECT USING ((EXISTS ( SELECT 1
   FROM chat.participant p
  WHERE ((p.room_id = message.room_id) AND (p.student_id = auth.uid())))));


--
-- Name: room select_room; Type: POLICY; Schema: chat; Owner: -
--

CREATE POLICY select_room ON chat.room FOR SELECT USING (chat.is_room_member(id, auth.uid()));


--
-- Name: message update_message; Type: POLICY; Schema: chat; Owner: -
--

CREATE POLICY update_message ON chat.message FOR UPDATE USING (((sender_id = auth.uid()) OR (auth.role() = 'admin'::text)));


--
-- Name: participant update_participant; Type: POLICY; Schema: chat; Owner: -
--

CREATE POLICY update_participant ON chat.participant FOR UPDATE USING ((student_id = auth.uid()));


--
-- Name: room update_room; Type: POLICY; Schema: chat; Owner: -
--

CREATE POLICY update_room ON chat.room FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM chat.participant p
  WHERE ((p.room_id = room.id) AND (p.student_id = auth.uid())))));


--
-- Name: genres Enable insert for authenticated users only; Type: POLICY; Schema: debate; Owner: -
--

CREATE POLICY "Enable insert for authenticated users only" ON debate.genres FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: criteria Enable read access for all users; Type: POLICY; Schema: debate; Owner: -
--

CREATE POLICY "Enable read access for all users" ON debate.criteria FOR SELECT USING (true);


--
-- Name: debate_formats Enable read access for all users; Type: POLICY; Schema: debate; Owner: -
--

CREATE POLICY "Enable read access for all users" ON debate.debate_formats FOR SELECT USING (true);


--
-- Name: format_rounds Enable read access for all users; Type: POLICY; Schema: debate; Owner: -
--

CREATE POLICY "Enable read access for all users" ON debate.format_rounds FOR SELECT USING (true);


--
-- Name: genres Enable read access for all users; Type: POLICY; Schema: debate; Owner: -
--

CREATE POLICY "Enable read access for all users" ON debate.genres FOR SELECT USING (true);


--
-- Name: round_templates Enable read access for all users; Type: POLICY; Schema: debate; Owner: -
--

CREATE POLICY "Enable read access for all users" ON debate.round_templates FOR SELECT USING (true);


--
-- Name: sides Enable read access for all users; Type: POLICY; Schema: debate; Owner: -
--

CREATE POLICY "Enable read access for all users" ON debate.sides FOR SELECT USING (true);


--
-- Name: ballots Judges can manage their own ballots; Type: POLICY; Schema: debate; Owner: -
--

CREATE POLICY "Judges can manage their own ballots" ON debate.ballots USING ((judge_id IN ( SELECT judge.id
   FROM public.judge
  WHERE (judge.user_id = auth.uid()))));


--
-- Name: ballots Participants can view ballots for their debates; Type: POLICY; Schema: debate; Owner: -
--

CREATE POLICY "Participants can view ballots for their debates" ON debate.ballots FOR SELECT USING ((debate_id IN ( SELECT dt.debate_id
   FROM ((debate.debate_teams dt
     JOIN debate.debate_participants dp ON ((dp.debate_team_id = dt.id)))
     JOIN public.student s ON ((dp.user_id = s.user_id)))
  WHERE (s.user_id = auth.uid()))));


--
-- Name: ballots; Type: ROW SECURITY; Schema: debate; Owner: -
--

ALTER TABLE debate.ballots ENABLE ROW LEVEL SECURITY;

--
-- Name: criteria; Type: ROW SECURITY; Schema: debate; Owner: -
--

ALTER TABLE debate.criteria ENABLE ROW LEVEL SECURITY;

--
-- Name: debate_formats; Type: ROW SECURITY; Schema: debate; Owner: -
--

ALTER TABLE debate.debate_formats ENABLE ROW LEVEL SECURITY;

--
-- Name: format_rounds; Type: ROW SECURITY; Schema: debate; Owner: -
--

ALTER TABLE debate.format_rounds ENABLE ROW LEVEL SECURITY;

--
-- Name: genres; Type: ROW SECURITY; Schema: debate; Owner: -
--

ALTER TABLE debate.genres ENABLE ROW LEVEL SECURITY;

--
-- Name: round_templates; Type: ROW SECURITY; Schema: debate; Owner: -
--

ALTER TABLE debate.round_templates ENABLE ROW LEVEL SECURITY;

--
-- Name: sides; Type: ROW SECURITY; Schema: debate; Owner: -
--

ALTER TABLE debate.sides ENABLE ROW LEVEL SECURITY;

--
-- Name: school Allow authenticated users to insert school; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow authenticated users to insert school" ON public.school FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: friendship Allow insert on friendship; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow insert on friendship" ON public.friendship FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: friendship Allow select on friendship; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow select on friendship" ON public.friendship FOR SELECT TO authenticated USING (((user_id = auth.uid()) OR (friend_id = auth.uid())));


--
-- Name: friendship Allow update on friendship; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow update on friendship" ON public.friendship FOR UPDATE TO authenticated USING (((user_id = auth.uid()) OR (friend_id = auth.uid()))) WITH CHECK (((user_id = auth.uid()) OR ((friend_id = auth.uid()) AND (status = ANY (ARRAY['ACCEPTED'::public.status, 'REJECTED'::public.status])))));


--
-- Name: profile Allow users to select their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow users to select their own profile" ON public.profile FOR SELECT TO authenticated USING ((( SELECT auth.uid() AS uid) = id));


--
-- Name: profile Allow users to update their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow users to update their own profile" ON public.profile FOR UPDATE TO authenticated USING ((( SELECT auth.uid() AS uid) = id)) WITH CHECK ((( SELECT auth.uid() AS uid) = id));


--
-- Name: team Enable delete for users based on user_id; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable delete for users based on user_id" ON public.team FOR DELETE TO authenticated USING (true);


--
-- Name: team_member Enable delete for users based on user_id; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable delete for users based on user_id" ON public.team_member FOR DELETE USING (true);


--
-- Name: guardian Enable insert for authenticated users only; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable insert for authenticated users only" ON public.guardian FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: judge Enable insert for authenticated users only; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable insert for authenticated users only" ON public.judge FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: student Enable insert for authenticated users only; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable insert for authenticated users only" ON public.student FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: team Enable insert for authenticated users only; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable insert for authenticated users only" ON public.team FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: team_member Enable insert for users based on user_id; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable insert for users based on user_id" ON public.team_member FOR INSERT WITH CHECK (((status = 'PENDING'::public.status) OR (( SELECT auth.uid() AS uid) = student_id)));


--
-- Name: guardian Enable read access for all users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable read access for all users" ON public.guardian FOR SELECT USING (true);


--
-- Name: profile Enable read access for all users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable read access for all users" ON public.profile FOR SELECT TO authenticated USING (true);


--
-- Name: school Enable read access for all users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable read access for all users" ON public.school FOR SELECT TO authenticated USING (true);


--
-- Name: student Enable read access for all users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable read access for all users" ON public.student FOR SELECT TO authenticated USING (true);


--
-- Name: team Enable read access for all users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable read access for all users" ON public.team FOR SELECT TO authenticated USING (true);


--
-- Name: team_member Enable read access for all users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable read access for all users" ON public.team_member FOR SELECT TO authenticated USING (true);


--
-- Name: team_member Enable update for users based on email; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable update for users based on email" ON public.team_member FOR UPDATE USING (true);


--
-- Name: team Policy with table joins; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Policy with table joins" ON public.team FOR UPDATE USING (true);


--
-- Name: friendship; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.friendship ENABLE ROW LEVEL SECURITY;

--
-- Name: guardian; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.guardian ENABLE ROW LEVEL SECURITY;

--
-- Name: guardian_request; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.guardian_request ENABLE ROW LEVEL SECURITY;

--
-- Name: judge; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.judge ENABLE ROW LEVEL SECURITY;

--
-- Name: profile; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;

--
-- Name: school; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.school ENABLE ROW LEVEL SECURITY;

--
-- Name: student; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.student ENABLE ROW LEVEL SECURITY;

--
-- Name: team; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.team ENABLE ROW LEVEL SECURITY;

--
-- Name: team_member; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.team_member ENABLE ROW LEVEL SECURITY;

--
-- Name: student update_student_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY update_student_policy ON public.student FOR UPDATE TO authenticated USING ((user_id = auth.uid()));


--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: -
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: objects Give anon users access to JPG images in folder g2sb1v_0; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Give anon users access to JPG images in folder g2sb1v_0" ON storage.objects FOR SELECT USING (((bucket_id = 'team-assets'::text) AND (lower((storage.foldername(name))[1]) = 'public'::text) AND (auth.role() = 'anon'::text)));


--
-- Name: objects Give users access to delete their own file vejz8c_0; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Give users access to delete their own file vejz8c_0" ON storage.objects FOR DELETE USING (((bucket_id = 'profile-images'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));


--
-- Name: objects Give users access to own folder g2sb1v_0; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Give users access to own folder g2sb1v_0" ON storage.objects FOR UPDATE USING (((bucket_id = 'team-assets'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));


--
-- Name: objects Give users access to own folder g2sb1v_1; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Give users access to own folder g2sb1v_1" ON storage.objects FOR INSERT WITH CHECK (((bucket_id = 'team-assets'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));


--
-- Name: objects Give users access to own folder g2sb1v_2; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Give users access to own folder g2sb1v_2" ON storage.objects FOR DELETE USING (((bucket_id = 'team-assets'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));


--
-- Name: objects Give users access to own folder vejz8c_0; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Give users access to own folder vejz8c_0" ON storage.objects FOR INSERT WITH CHECK (((bucket_id = 'profile-images'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));


--
-- Name: objects Give users access to own folder vejz8c_1; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Give users access to own folder vejz8c_1" ON storage.objects FOR UPDATE USING (((bucket_id = 'profile-images'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));


--
-- Name: objects Give users access to their own folder vejz8c_0; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Give users access to their own folder vejz8c_0" ON storage.objects FOR SELECT USING (((bucket_id = 'profile-images'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));


--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: prefixes; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.prefixes ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: -
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


--
-- Name: supabase_realtime_messages_publication; Type: PUBLICATION; Schema: -; Owner: -
--

CREATE PUBLICATION supabase_realtime_messages_publication WITH (publish = 'insert, update, delete, truncate');


--
-- Name: supabase_realtime message; Type: PUBLICATION TABLE; Schema: chat; Owner: -
--

ALTER PUBLICATION supabase_realtime ADD TABLE ONLY chat.message;


--
-- Name: supabase_realtime room; Type: PUBLICATION TABLE; Schema: chat; Owner: -
--

ALTER PUBLICATION supabase_realtime ADD TABLE ONLY chat.room;


--
-- Name: supabase_realtime matchmaking_queue_entries; Type: PUBLICATION TABLE; Schema: debate; Owner: -
--

ALTER PUBLICATION supabase_realtime ADD TABLE ONLY debate.matchmaking_queue_entries;


--
-- Name: supabase_realtime friendship; Type: PUBLICATION TABLE; Schema: public; Owner: -
--

ALTER PUBLICATION supabase_realtime ADD TABLE ONLY public.friendship;


--
-- Name: supabase_realtime team_member; Type: PUBLICATION TABLE; Schema: public; Owner: -
--

ALTER PUBLICATION supabase_realtime ADD TABLE ONLY public.team_member;


--
-- Name: supabase_realtime_messages_publication messages; Type: PUBLICATION TABLE; Schema: realtime; Owner: -
--

ALTER PUBLICATION supabase_realtime_messages_publication ADD TABLE ONLY realtime.messages;


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


--
-- PostgreSQL database dump complete
--

