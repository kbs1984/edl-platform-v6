---
created: '2025-08-23'
domain: core
priority: P1
purpose: Document select
session: legacy
status: current
title: Select
topics:
- documentation
type: guide
---

Sean2474 emdash-dabate

===
# Select

## 01

SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public';

[
  {
    "table_name": "admin",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone"
  },
  {
    "table_name": "guild",
    "column_name": "school_id",
    "data_type": "uuid"
  },
  {
    "table_name": "guild",
    "column_name": "created_at",
    "data_type": "timestamp without time zone"
  },
  {
    "table_name": "guild",
    "column_name": "updated_at",
    "data_type": "timestamp without time zone"
  },
  {
    "table_name": "student",
    "column_name": "ranking",
    "data_type": "smallint"
  },
  {
    "table_name": "student",
    "column_name": "challenge_enabled",
    "data_type": "boolean"
  },
  {
    "table_name": "student",
    "column_name": "graduation_year",
    "data_type": "bigint"
  },
  {
    "table_name": "student",
    "column_name": "level",
    "data_type": "integer"
  },
  {
    "table_name": "school",
    "column_name": "id",
    "data_type": "uuid"
  },
  {
    "table_name": "school",
    "column_name": "created_at",
    "data_type": "timestamp without time zone"
  },
  {
    "table_name": "school",
    "column_name": "updated_at",
    "data_type": "timestamp without time zone"
  },
  {
    "table_name": "school",
    "column_name": "created_by",
    "data_type": "uuid"
  },
  {
    "table_name": "guardian_request",
    "column_name": "id",
    "data_type": "uuid"
  },
  {
    "table_name": "guardian_request",
    "column_name": "created_at",
    "data_type": "timestamp with time zone"
  },
  {
    "table_name": "guardian_request",
    "column_name": "status",
    "data_type": "USER-DEFINED"
  },
  {
    "table_name": "guardian_request",
    "column_name": "updated_at",
    "data_type": "timestamp without time zone"
  },
  {
    "table_name": "guardian_request",
    "column_name": "sender",
    "data_type": "uuid"
  },
  {
    "table_name": "guardian_request",
    "column_name": "reciever",
    "data_type": "uuid"
  },
  {
    "table_name": "friendship",
    "column_name": "id",
    "data_type": "uuid"
  },
  {
    "table_name": "friendship",
    "column_name": "created_at",
    "data_type": "timestamp with time zone"
  },
  {
    "table_name": "friendship",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone"
  },
  {
    "table_name": "friendship",
    "column_name": "user_id",
    "data_type": "uuid"
  },
  {
    "table_name": "friendship",
    "column_name": "friend_id",
    "data_type": "uuid"
  },
  {
    "table_name": "friendship",
    "column_name": "status",
    "data_type": "USER-DEFINED"
  },
  {
    "table_name": "friendship",
    "column_name": "accpted_at",
    "data_type": "timestamp with time zone"
  },
  {
    "table_name": "admin",
    "column_name": "id",
    "data_type": "uuid"
  },
  {
    "table_name": "admin",
    "column_name": "user_id",
    "data_type": "uuid"
  },
  {
    "table_name": "admin",
    "column_name": "created_at",
    "data_type": "timestamp with time zone"
  },
  {
    "table_name": "guild",
    "column_name": "id",
    "data_type": "uuid"
  },
  {
    "table_name": "guild",
    "column_name": "division",
    "data_type": "USER-DEFINED"
  },
  {
    "table_name": "team_member",
    "column_name": "id",
    "data_type": "uuid"
  },
  {
    "table_name": "team_member",
    "column_name": "created_at",
    "data_type": "timestamp without time zone"
  },
  {
    "table_name": "team_member",
    "column_name": "updated_at",
    "data_type": "timestamp without time zone"
  },
  {
    "table_name": "team_member",
    "column_name": "student_id",
    "data_type": "uuid"
  },
  {
    "table_name": "team_member",
    "column_name": "team_id",
    "data_type": "uuid"
  },
  {
    "table_name": "team_member",
    "column_name": "join_date",
    "data_type": "timestamp without time zone"
  },
  {
    "table_name": "team_member",
    "column_name": "is_leader",
    "data_type": "boolean"
  },
  {
    "table_name": "team_member",
    "column_name": "status",
    "data_type": "USER-DEFINED"
  },
  {
    "table_name": "guild_member",
    "column_name": "id",
    "data_type": "uuid"
  },
  {
    "table_name": "guild_member",
    "column_name": "created_at",
    "data_type": "timestamp without time zone"
  },
  {
    "table_name": "guild_member",
    "column_name": "updated_at",
    "data_type": "timestamp without time zone"
  },
  {
    "table_name": "guild_member",
    "column_name": "student_id",
    "data_type": "uuid"
  },
  {
    "table_name": "guild_member",
    "column_name": "guild_id",
    "data_type": "uuid"
  },
  {
    "table_name": "guild_member",
    "column_name": "join_date",
    "data_type": "timestamp without time zone"
  },
  {
    "table_name": "guild_member",
    "column_name": "is_leader",
    "data_type": "boolean"
  },
  {
    "table_name": "guild_member",
    "column_name": "status",
    "data_type": "USER-DEFINED"
  },
  {
    "table_name": "rating",
    "column_name": "id",
    "data_type": "uuid"
  },
  {
    "table_name": "rating",
    "column_name": "created_at",
    "data_type": "timestamp without time zone"
  },
  {
    "table_name": "rating",
    "column_name": "rate",
    "data_type": "integer"
  },
  {
    "table_name": "rating",
    "column_name": "judge_id",
    "data_type": "uuid"
  },
  {
    "table_name": "rating",
    "column_name": "rater_id",
    "data_type": "uuid"
  },
  {
    "table_name": "bank_account",
    "column_name": "id",
    "data_type": "uuid"
  },
  {
    "table_name": "bank_account",
    "column_name": "active",
    "data_type": "boolean"
  },
  {
    "table_name": "bank_account",
    "column_name": "guardian_id",
    "data_type": "uuid"
  },
  {
    "table_name": "payment_history",
    "column_name": "id",
    "data_type": "uuid"
  },
  {
    "table_name": "payment_history",
    "column_name": "guardian_id",
    "data_type": "uuid"
  },
  {
    "table_name": "payment_history",
    "column_name": "amount",
    "data_type": "integer"
  },
  {
    "table_name": "payment_history",
    "column_name": "payment_provider",
    "data_type": "USER-DEFINED"
  },
  {
    "table_name": "payment_history",
    "column_name": "payment_date",
    "data_type": "timestamp without time zone"
  },
  {
    "table_name": "payment_history",
    "column_name": "payment_state",
    "data_type": "USER-DEFINED"
  },
  {
    "table_name": "invitation",
    "column_name": "id",
    "data_type": "uuid"
  },
  {
    "table_name": "invitation",
    "column_name": "created_at",
    "data_type": "timestamp without time zone"
  },
  {
    "table_name": "invitation",
    "column_name": "updated_at",
    "data_type": "timestamp without time zone"
  },
  {
    "table_name": "invitation",
    "column_name": "accepted_at",
    "data_type": "timestamp without time zone"
  },
  {
    "table_name": "invitation",
    "column_name": "inviter_id",
    "data_type": "uuid"
  },
  {
    "table_name": "invitation",
    "column_name": "invitee_id",
    "data_type": "uuid"
  },
  {
    "table_name": "invitation",
    "column_name": "team_id",
    "data_type": "uuid"
  },
  {
    "table_name": "invitation",
    "column_name": "guild_id",
    "data_type": "uuid"
  },
  {
    "table_name": "invitation",
    "column_name": "status",
    "data_type": "USER-DEFINED"
  },
  {
    "table_name": "invitation",
    "column_name": "expires_at",
    "data_type": "timestamp without time zone"
  },
  {
    "table_name": "invitation",
    "column_name": "type",
    "data_type": "USER-DEFINED"
  },
  {
    "table_name": "log",
    "column_name": "id",
    "data_type": "uuid"
  },
  {
    "table_name": "log",
    "column_name": "created_at",
    "data_type": "timestamp without time zone"
  },
  {
    "table_name": "log",
    "column_name": "log_type",
    "data_type": "USER-DEFINED"
  },
  {
    "table_name": "log",
    "column_name": "guild_id",
    "data_type": "uuid"
  },
  {
    "table_name": "log",
    "column_name": "team_id",
    "data_type": "uuid"
  },
  {
    "table_name": "log",
    "column_name": "student_id",
    "data_type": "uuid"
  },
  {
    "table_name": "log",
    "column_name": "type",
    "data_type": "USER-DEFINED"
  },
  {
    "table_name": "team",
    "column_name": "id",
    "data_type": "uuid"
  },
  {
    "table_name": "team",
    "column_name": "created_at",
    "data_type": "timestamp without time zone"
  },
  {
    "table_name": "team",
    "column_name": "updated_at",
    "data_type": "timestamp without time zone"
  },
  {
    "table_name": "team",
    "column_name": "division",
    "data_type": "USER-DEFINED"
  },
  {
    "table_name": "profile",
    "column_name": "id",
    "data_type": "uuid"
  },
  {
    "table_name": "profile",
    "column_name": "date_of_birth",
    "data_type": "date"
  },
  {
    "table_name": "profile",
    "column_name": "gender",
    "data_type": "USER-DEFINED"
  },
  {
    "table_name": "profile",
    "column_name": "user_role",
    "data_type": "USER-DEFINED"
  },
  {
    "table_name": "profile",
    "column_name": "active",
    "data_type": "boolean"
  },
  {
    "table_name": "profile",
    "column_name": "term_agree_time",
    "data_type": "timestamp with time zone"
  },
  {
    "table_name": "profile",
    "column_name": "invited",
    "data_type": "boolean"
  },
  {
    "table_name": "guardian",
    "column_name": "id",
    "data_type": "uuid"
  },
  {
    "table_name": "guardian",
    "column_name": "user_id",
    "data_type": "uuid"
  },
  {
    "table_name": "judge",
    "column_name": "id",
    "data_type": "uuid"
  },
  {
    "table_name": "judge",
    "column_name": "user_id",
    "data_type": "uuid"
  },
  {
    "table_name": "judge",
    "column_name": "referral_user_id",
    "data_type": "uuid"
  },
  {
    "table_name": "student",
    "column_name": "id",
    "data_type": "uuid"
  },
  {
    "table_name": "student",
    "column_name": "user_id",
    "data_type": "uuid"
  },
  {
    "table_name": "student",
    "column_name": "guardian_id",
    "data_type": "uuid"
  },
  {
    "table_name": "student",
    "column_name": "school_id",
    "data_type": "uuid"
  },
  {
    "table_name": "student",
    "column_name": "division",
    "data_type": "USER-DEFINED"
  },
  {
    "table_name": "student",
    "column_name": "exp",
    "data_type": "integer"
  }
]


## 02

-- In your source project SQL Editor:
SELECT
  'DROP TABLE IF EXISTS ' || tablename || ' CASCADE;'
FROM
  pg_tables
WHERE
  schemaname = 'public';

SELECT
  'CREATE TABLE ' || schemaname || '.' || tablename || ' (' ||
  string_agg(column_info, ', ' ORDER BY ordinal_position) || ');'
FROM (
  SELECT
    t.schemaname,
    t.tablename,
    c.ordinal_position,
    c.column_name || ' ' ||
    c.data_type ||
    CASE WHEN c.character_maximum_length IS NOT NULL THEN '(' || c.character_maximum_length || ')' ELSE '' END ||
    CASE WHEN c.is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END ||
    CASE WHEN c.column_default IS NOT NULL THEN ' DEFAULT ' || c.column_default ELSE '' END
    AS column_info
  FROM
    pg_tables t
  JOIN
    information_schema.columns c
    ON t.schemaname = c.table_schema AND t.tablename = c.table_name
  WHERE
    t.schemaname = 'public'
) subquery
GROUP BY
  schemaname, tablename;

[
  {
    "?column?": "CREATE TABLE public.admin (id uuid NOT NULL DEFAULT uuid_generate_v4(), user_id uuid NOT NULL, created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP, updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP);"
  },
  {
    "?column?": "CREATE TABLE public.bank_account (id uuid NOT NULL DEFAULT gen_random_uuid(), active boolean NOT NULL, guardian_id uuid NOT NULL, name text NOT NULL, routing text NOT NULL, swift_code text NOT NULL, i_b_a_n text NOT NULL);"
  },
  {
    "?column?": "CREATE TABLE public.friendship (id uuid NOT NULL DEFAULT gen_random_uuid(), created_at timestamp with time zone NOT NULL DEFAULT now(), updated_at timestamp with time zone DEFAULT now(), user_id uuid NOT NULL DEFAULT auth.uid(), friend_id uuid NOT NULL, status USER-DEFINED NOT NULL DEFAULT 'PENDING'::status, accpted_at timestamp with time zone);"
  },
  {
    "?column?": "CREATE TABLE public.guardian (id uuid NOT NULL DEFAULT gen_random_uuid(), user_id uuid NOT NULL DEFAULT auth.uid(), payment_method text, billing_address text);"
  },
  {
    "?column?": "CREATE TABLE public.guardian_request (id uuid NOT NULL DEFAULT gen_random_uuid(), created_at timestamp with time zone NOT NULL DEFAULT now(), status USER-DEFINED DEFAULT 'PENDING'::status, updated_at timestamp without time zone NOT NULL, sender uuid, reciever uuid);"
  },
  {
    "?column?": "CREATE TABLE public.guild (id uuid NOT NULL DEFAULT gen_random_uuid(), school_id uuid NOT NULL, created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at timestamp without time zone NOT NULL, name text NOT NULL, requirement text NOT NULL, division USER-DEFINED NOT NULL, image_path text NOT NULL, description text NOT NULL);"
  },
  {
    "?column?": "CREATE TABLE public.guild_member (id uuid NOT NULL DEFAULT gen_random_uuid(), created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at timestamp without time zone NOT NULL, student_id uuid NOT NULL, guild_id uuid NOT NULL, join_date timestamp without time zone, is_leader boolean NOT NULL DEFAULT false, status USER-DEFINED NOT NULL DEFAULT 'PENDING'::status);"
  },
  {
    "?column?": "CREATE TABLE public.invitation (id uuid NOT NULL DEFAULT gen_random_uuid(), created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at timestamp without time zone NOT NULL, accepted_at timestamp without time zone, inviter_id uuid NOT NULL, invitee_id uuid NOT NULL, team_id uuid, guild_id uuid, status USER-DEFINED NOT NULL DEFAULT 'PENDING'::status, expires_at timestamp without time zone, type USER-DEFINED NOT NULL);"
  },
  {
    "?column?": "CREATE TABLE public.judge (id uuid NOT NULL DEFAULT gen_random_uuid(), user_id uuid NOT NULL DEFAULT auth.uid(), job_title text NOT NULL, biography text NOT NULL, bank_account_info text, referral_user_id uuid);"
  },
  {
    "?column?": "CREATE TABLE public.log (id uuid NOT NULL DEFAULT gen_random_uuid(), created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP, log_type USER-DEFINED NOT NULL, description text NOT NULL, guild_id uuid, team_id uuid, student_id uuid NOT NULL, type USER-DEFINED NOT NULL);"
  },
  {
    "?column?": "CREATE TABLE public.payment_history (id uuid NOT NULL DEFAULT gen_random_uuid(), guardian_id uuid NOT NULL, amount integer NOT NULL, currency_code text NOT NULL, payment_provider USER-DEFINED NOT NULL, payment_date timestamp without time zone NOT NULL, payment_state USER-DEFINED NOT NULL);"
  },
  {
    "?column?": "CREATE TABLE public.profile (id uuid NOT NULL DEFAULT auth.uid(), name text DEFAULT ''::text, username text, image_path text, date_of_birth date, gender USER-DEFINED, user_role USER-DEFINED, active boolean NOT NULL DEFAULT false, term_agree_time timestamp with time zone, email text DEFAULT ''::text, invited boolean NOT NULL DEFAULT false);"
  },
  {
    "?column?": "CREATE TABLE public.rating (id uuid NOT NULL DEFAULT gen_random_uuid(), created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP, rate integer NOT NULL, judge_id uuid NOT NULL, rater_id uuid NOT NULL);"
  },
  {
    "?column?": "CREATE TABLE public.school (id uuid NOT NULL DEFAULT gen_random_uuid(), name text NOT NULL, created_at timestamp without time zone NOT NULL DEFAULT now(), updated_at timestamp without time zone NOT NULL DEFAULT now(), created_by uuid NOT NULL DEFAULT auth.uid());"
  },
  {
    "?column?": "CREATE TABLE public.student (id uuid NOT NULL DEFAULT gen_random_uuid(), user_id uuid NOT NULL DEFAULT auth.uid(), guardian_id uuid, school_id uuid, division USER-DEFINED, location text NOT NULL, exp integer NOT NULL DEFAULT 0, ranking smallint NOT NULL DEFAULT '0'::smallint, challenge_enabled boolean NOT NULL DEFAULT false, graduation_year bigint NOT NULL, relationship_with_guardian text, level integer NOT NULL DEFAULT 0);"
  },
  {
    "?column?": "CREATE TABLE public.team (id uuid NOT NULL DEFAULT gen_random_uuid(), created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at timestamp without time zone NOT NULL, name text NOT NULL, description text NOT NULL, division USER-DEFINED NOT NULL, image_path text NOT NULL);"
  },
  {
    "?column?": "CREATE TABLE public.team_member (id uuid NOT NULL DEFAULT gen_random_uuid(), created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at timestamp without time zone NOT NULL, student_id uuid NOT NULL, team_id uuid NOT NULL, join_date timestamp without time zone, is_leader boolean NOT NULL DEFAULT false, status USER-DEFINED NOT NULL DEFAULT 'PENDING'::status);"
  }
]

## 03

-- Get foreign key constraints:
SELECT
  'ALTER TABLE ' || tc.table_schema || '.' || tc.table_name || 
  ' ADD CONSTRAINT ' || tc.constraint_name || 
  ' FOREIGN KEY (' || kcu.column_name || ')' ||
  ' REFERENCES ' || ccu.table_schema || '.' || ccu.table_name || 
  ' (' || ccu.column_name || ');'
FROM
  information_schema.table_constraints tc
JOIN
  information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN
  information_schema.constraint_column_usage ccu
  ON tc.constraint_name = ccu.constraint_name
WHERE
  tc.constraint_type = 'FOREIGN KEY' AND
  tc.table_schema = 'public';

[
  {
    "?column?": "ALTER TABLE public.admin ADD CONSTRAINT admin_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id);"
  },
  {
    "?column?": "ALTER TABLE public.guardian_request ADD CONSTRAINT guardian_request_sender_fkey FOREIGN KEY (sender) REFERENCES public.profile (id);"
  },
  {
    "?column?": "ALTER TABLE public.guardian_request ADD CONSTRAINT guardian_request_reciever_fkey FOREIGN KEY (reciever) REFERENCES public.profile (id);"
  },
  {
    "?column?": "ALTER TABLE public.student ADD CONSTRAINT Student_guardianId_fkey FOREIGN KEY (guardian_id) REFERENCES public.guardian (id);"
  },
  {
    "?column?": "ALTER TABLE public.student ADD CONSTRAINT Student_schoolId_fkey FOREIGN KEY (school_id) REFERENCES public.school (id);"
  },
  {
    "?column?": "ALTER TABLE public.judge ADD CONSTRAINT Judge_referralUserId_fkey FOREIGN KEY (referral_user_id) REFERENCES public.profile (id);"
  },
  {
    "?column?": "ALTER TABLE public.judge ADD CONSTRAINT Judge_userId_fkey FOREIGN KEY (user_id) REFERENCES public.profile (id);"
  },
  {
    "?column?": "ALTER TABLE public.rating ADD CONSTRAINT Rating_judgeId_fkey FOREIGN KEY (judge_id) REFERENCES public.judge (id);"
  },
  {
    "?column?": "ALTER TABLE public.rating ADD CONSTRAINT Rating_raterId_fkey FOREIGN KEY (rater_id) REFERENCES public.student (id);"
  },
  {
    "?column?": "ALTER TABLE public.guardian ADD CONSTRAINT Guardian_userId_fkey FOREIGN KEY (user_id) REFERENCES public.profile (id);"
  },
  {
    "?column?": "ALTER TABLE public.bank_account ADD CONSTRAINT BankAccount_guardianId_fkey FOREIGN KEY (guardian_id) REFERENCES public.guardian (id);"
  },
  {
    "?column?": "ALTER TABLE public.payment_history ADD CONSTRAINT PaymentHistory_guardianId_fkey FOREIGN KEY (guardian_id) REFERENCES public.guardian (id);"
  },
  {
    "?column?": "ALTER TABLE public.guild ADD CONSTRAINT Guild_schoolId_fkey FOREIGN KEY (school_id) REFERENCES public.school (id);"
  },
  {
    "?column?": "ALTER TABLE public.guild_member ADD CONSTRAINT GuildMember_guildId_fkey FOREIGN KEY (guild_id) REFERENCES public.guild (id);"
  },
  {
    "?column?": "ALTER TABLE public.guild_member ADD CONSTRAINT GuildMember_studentId_fkey FOREIGN KEY (student_id) REFERENCES public.student (id);"
  },
  {
    "?column?": "ALTER TABLE public.team_member ADD CONSTRAINT TeamMember_teamId_fkey FOREIGN KEY (team_id) REFERENCES public.team (id);"
  },
  {
    "?column?": "ALTER TABLE public.invitation ADD CONSTRAINT Invitation_guildId_fkey FOREIGN KEY (guild_id) REFERENCES public.guild (id);"
  },
  {
    "?column?": "ALTER TABLE public.invitation ADD CONSTRAINT Invitation_inviteeId_fkey FOREIGN KEY (invitee_id) REFERENCES public.profile (id);"
  },
  {
    "?column?": "ALTER TABLE public.invitation ADD CONSTRAINT Invitation_inviterId_fkey FOREIGN KEY (inviter_id) REFERENCES public.profile (id);"
  },
  {
    "?column?": "ALTER TABLE public.invitation ADD CONSTRAINT Invitation_teamId_fkey FOREIGN KEY (team_id) REFERENCES public.team (id);"
  },
  {
    "?column?": "ALTER TABLE public.log ADD CONSTRAINT Log_guildId_fkey FOREIGN KEY (guild_id) REFERENCES public.guild (id);"
  },
  {
    "?column?": "ALTER TABLE public.log ADD CONSTRAINT Log_studentId_fkey FOREIGN KEY (student_id) REFERENCES public.student (id);"
  },
  {
    "?column?": "ALTER TABLE public.log ADD CONSTRAINT Log_teamId_fkey FOREIGN KEY (team_id) REFERENCES public.team (id);"
  },
  {
    "?column?": "ALTER TABLE public.student ADD CONSTRAINT student_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profile (id);"
  },
  {
    "?column?": "ALTER TABLE public.profile ADD CONSTRAINT User_id_fkey FOREIGN KEY (id) REFERENCES auth.users (id);"
  },
  {
    "?column?": "ALTER TABLE public.team_member ADD CONSTRAINT team_member_student_id_fkey1 FOREIGN KEY (student_id) REFERENCES public.profile (id);"
  },
  {
    "?column?": "ALTER TABLE public.friendship ADD CONSTRAINT friendship_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.student (user_id);"
  },
  {
    "?column?": "ALTER TABLE public.friendship ADD CONSTRAINT friendship_friend_id_fkey FOREIGN KEY (friend_id) REFERENCES public.student (user_id);"
  }
]

## 04

SELECT 
  table_schema,
  table_name,
  json_agg(
    json_build_object(
      'column_name', column_name,
      'data_type', data_type,
      'is_nullable', is_nullable,
      'column_default', column_default
    )
  ) AS columns
FROM 
  information_schema.columns
WHERE 
  table_schema = 'public'
GROUP BY 
  table_schema, table_name
ORDER BY 
  table_name;

[
  {
    "table_schema": "public",
    "table_name": "admin",
    "columns": [
      {
        "column_name": "created_at",
        "data_type": "timestamp with time zone",
        "is_nullable": "YES",
        "column_default": "CURRENT_TIMESTAMP"
      },
      {
        "column_name": "user_id",
        "data_type": "uuid",
        "is_nullable": "NO",
        "column_default": null
      },
      {
        "column_name": "id",
        "data_type": "uuid",
        "is_nullable": "NO",
        "column_default": "uuid_generate_v4()"
      },
      {
        "column_name": "updated_at",
        "data_type": "timestamp with time zone",
        "is_nullable": "YES",
        "column_default": "CURRENT_TIMESTAMP"
      }
    ]
  },
  {
    "table_schema": "public",
    "table_name": "bank_account",
    "columns": [
      {
        "column_name": "id",
        "data_type": "uuid",
        "is_nullable": "NO",
        "column_default": "gen_random_uuid()"
      },
      {
        "column_name": "routing",
        "data_type": "text",
        "is_nullable": "NO",
        "column_default": null
      },
      {
        "column_name": "name",
        "data_type": "text",
        "is_nullable": "NO",
        "column_default": null
      },
      {
        "column_name": "guardian_id",
        "data_type": "uuid",
        "is_nullable": "NO",
        "column_default": null
      },
      {
        "column_name": "i_b_a_n",
        "data_type": "text",
        "is_nullable": "NO",
        "column_default": null
      },
      {
        "column_name": "swift_code",
        "data_type": "text",
        "is_nullable": "NO",
        "column_default": null
      },
      {
        "column_name": "active",
        "data_type": "boolean",
        "is_nullable": "NO",
        "column_default": null
      }
    ]
  },
  {
    "table_schema": "public",
    "table_name": "friendship",
    "columns": [
      {
        "column_name": "id",
        "data_type": "uuid",
        "is_nullable": "NO",
        "column_default": "gen_random_uuid()"
      },
      {
        "column_name": "accpted_at",
        "data_type": "timestamp with time zone",
        "is_nullable": "YES",
        "column_default": null
      },
      {
        "column_name": "status",
        "data_type": "USER-DEFINED",
        "is_nullable": "NO",
        "column_default": "'PENDING'::status"
      },
      {
        "column_name": "friend_id",
        "data_type": "uuid",
        "is_nullable": "NO",
        "column_default": null
      },
      {
        "column_name": "user_id",
        "data_type": "uuid",
        "is_nullable": "NO",
        "column_default": "auth.uid()"
      },
      {
        "column_name": "updated_at",
        "data_type": "timestamp with time zone",
        "is_nullable": "YES",
        "column_default": "now()"
      },
      {
        "column_name": "created_at",
        "data_type": "timestamp with time zone",
        "is_nullable": "NO",
        "column_default": "now()"
      }
    ]
  },
  {
    "table_schema": "public",
    "table_name": "guardian",
    "columns": [
      {
        "column_name": "billing_address",
        "data_type": "text",
        "is_nullable": "YES",
        "column_default": null
      },
      {
        "column_name": "user_id",
        "data_type": "uuid",
        "is_nullable": "NO",
        "column_default": "auth.uid()"
      },
      {
        "column_name": "payment_method",
        "data_type": "text",
        "is_nullable": "YES",
        "column_default": null
      },
      {
        "column_name": "id",
        "data_type": "uuid",
        "is_nullable": "NO",
        "column_default": "gen_random_uuid()"
      }
    ]
  },
  {
    "table_schema": "public",
    "table_name": "guardian_request",
    "columns": [
      {
        "column_name": "status",
        "data_type": "USER-DEFINED",
        "is_nullable": "YES",
        "column_default": "'PENDING'::status"
      },
      {
        "column_name": "created_at",
        "data_type": "timestamp with time zone",
        "is_nullable": "NO",
        "column_default": "now()"
      },
      {
        "column_name": "id",
        "data_type": "uuid",
        "is_nullable": "NO",
        "column_default": "gen_random_uuid()"
      },
      {
        "column_name": "reciever",
        "data_type": "uuid",
        "is_nullable": "YES",
        "column_default": null
      },
      {
        "column_name": "sender",
        "data_type": "uuid",
        "is_nullable": "YES",
        "column_default": null
      },
      {
        "column_name": "updated_at",
        "data_type": "timestamp without time zone",
        "is_nullable": "NO",
        "column_default": null
      }
    ]
  },
  {
    "table_schema": "public",
    "table_name": "guild",
    "columns": [
      {
        "column_name": "id",
        "data_type": "uuid",
        "is_nullable": "NO",
        "column_default": "gen_random_uuid()"
      },
      {
        "column_name": "school_id",
        "data_type": "uuid",
        "is_nullable": "NO",
        "column_default": null
      },
      {
        "column_name": "created_at",
        "data_type": "timestamp without time zone",
        "is_nullable": "NO",
        "column_default": "CURRENT_TIMESTAMP"
      },
      {
        "column_name": "updated_at",
        "data_type": "timestamp without time zone",
        "is_nullable": "NO",
        "column_default": null
      },
      {
        "column_name": "description",
        "data_type": "text",
        "is_nullable": "NO",
        "column_default": null
      },
      {
        "column_name": "division",
        "data_type": "USER-DEFINED",
        "is_nullable": "NO",
        "column_default": null
      },
      {
        "column_name": "image_path",
        "data_type": "text",
        "is_nullable": "NO",
        "column_default": null
      },
      {
        "column_name": "requirement",
        "data_type": "text",
        "is_nullable": "NO",
        "column_default": null
      },
      {
        "column_name": "name",
        "data_type": "text",
        "is_nullable": "NO",
        "column_default": null
      }
    ]
  },
  {
    "table_schema": "public",
    "table_name": "guild_member",
    "columns": [
      {
        "column_name": "updated_at",
        "data_type": "timestamp without time zone",
        "is_nullable": "NO",
        "column_default": null
      },
      {
        "column_name": "student_id",
        "data_type": "uuid",
        "is_nullable": "NO",
        "column_default": null
      },
      {
        "column_name": "guild_id",
        "data_type": "uuid",
        "is_nullable": "NO",
        "column_default": null
      },
      {
        "column_name": "join_date",
        "data_type": "timestamp without time zone",
        "is_nullable": "YES",
        "column_default": null
      },
      {
        "column_name": "is_leader",
        "data_type": "boolean",
        "is_nullable": "NO",
        "column_default": "false"
      },
      {
        "column_name": "status",
        "data_type": "USER-DEFINED",
        "is_nullable": "NO",
        "column_default": "'PENDING'::status"
      },
      {
        "column_name": "id",
        "data_type": "uuid",
        "is_nullable": "NO",
        "column_default": "gen_random_uuid()"
      },
      {
        "column_name": "created_at",
        "data_type": "timestamp without time zone",
        "is_nullable": "NO",
        "column_default": "CURRENT_TIMESTAMP"
      }
    ]
  },
  {
    "table_schema": "public",
    "table_name": "invitation",
    "columns": [
      {
        "column_name": "id",
        "data_type": "uuid",
        "is_nullable": "NO",
        "column_default": "gen_random_uuid()"
      },
      {
        "column_name": "updated_at",
        "data_type": "timestamp without time zone",
        "is_nullable": "NO",
        "column_default": null
      },
      {
        "column_name": "status",
        "data_type": "USER-DEFINED",
        "is_nullable": "NO",
        "column_default": "'PENDING'::status"
      },
      {
        "column_name": "created_at",
        "data_type": "timestamp without time zone",
        "is_nullable": "NO",
        "column_default": "CURRENT_TIMESTAMP"
      },
      {
        "column_name": "guild_id",
        "data_type": "uuid",
        "is_nullable": "YES",
        "column_default": null
      },
      {
        "column_name": "team_id",
        "data_type": "uuid",
        "is_nullable": "YES",
        "column_default": null
      },
      {
        "column_name": "invitee_id",
        "data_type": "uuid",
        "is_nullable": "NO",
        "column_default": null
      },
      {
        "column_name": "inviter_id",
        "data_type": "uuid",
        "is_nullable": "NO",
        "column_default": null
      },
      {
        "column_name": "accepted_at",
        "data_type": "timestamp without time zone",
        "is_nullable": "YES",
        "column_default": null
      },
      {
        "column_name": "expires_at",
        "data_type": "timestamp without time zone",
        "is_nullable": "YES",
        "column_default": null
      },
      {
        "column_name": "type",
        "data_type": "USER-DEFINED",
        "is_nullable": "NO",
        "column_default": null
      }
    ]
  },
  {
    "table_schema": "public",
    "table_name": "judge",
    "columns": [
      {
        "column_name": "biography",
        "data_type": "text",
        "is_nullable": "NO",
        "column_default": null
      },
      {
        "column_name": "id",
        "data_type": "uuid",
        "is_nullable": "NO",
        "column_default": "gen_random_uuid()"
      },
      {
        "column_name": "user_id",
        "data_type": "uuid",
        "is_nullable": "NO",
        "column_default": "auth.uid()"
      },
      {
        "column_name": "referral_user_id",
        "data_type": "uuid",
        "is_nullable": "YES",
        "column_default": null
      },
      {
        "column_name": "bank_account_info",
        "data_type": "text",
        "is_nullable": "YES",
        "column_default": null
      },
      {
        "column_name": "job_title",
        "data_type": "text",
        "is_nullable": "NO",
        "column_default": null
      }
    ]
  },
  {
    "table_schema": "public",
    "table_name": "log",
    "columns": [
      {
        "column_name": "id",
        "data_type": "uuid",
        "is_nullable": "NO",
        "column_default": "gen_random_uuid()"
      },
      {
        "column_name": "description",
        "data_type": "text",
        "is_nullable": "NO",
        "column_default": null
      },
      {
        "column_name": "type",
        "data_type": "USER-DEFINED",
        "is_nullable": "NO",
        "column_default": null
      },
      {
        "column_name": "student_id",
        "data_type": "uuid",
        "is_nullable": "NO",
        "column_default": null
      },
      {
        "column_name": "team_id",
        "data_type": "uuid",
        "is_nullable": "YES",
        "column_default": null
      },
      {
        "column_name": "guild_id",
        "data_type": "uuid",
        "is_nullable": "YES",
        "column_default": null
      },
      {
        "column_name": "log_type",
        "data_type": "USER-DEFINED",
        "is_nullable": "NO",
        "column_default": null
      },
      {
        "column_name": "created_at",
        "data_type": "timestamp without time zone",
        "is_nullable": "NO",
        "column_default": "CURRENT_TIMESTAMP"
      }
    ]
  },
  {
    "table_schema": "public",
    "table_name": "payment_history",
    "columns": [
      {
        "column_name": "id",
        "data_type": "uuid",
        "is_nullable": "NO",
        "column_default": "gen_random_uuid()"
      },
      {
        "column_name": "currency_code",
        "data_type": "text",
        "is_nullable": "NO",
        "column_default": null
      },
      {
        "column_name": "payment_provider",
        "data_type": "USER-DEFINED",
        "is_nullable": "NO",
        "column_default": null
      },
      {
        "column_name": "payment_date",
        "data_type": "timestamp without time zone",
        "is_nullable": "NO",
        "column_default": null
      },
      {
        "column_name": "payment_state",
        "data_type": "USER-DEFINED",
        "is_nullable": "NO",
        "column_default": null
      },
      {
        "column_name": "amount",
        "data_type": "integer",
        "is_nullable": "NO",
        "column_default": null
      },
      {
        "column_name": "guardian_id",
        "data_type": "uuid",
        "is_nullable": "NO",
        "column_default": null
      }
    ]
  },
  {
    "table_schema": "public",
    "table_name": "profile",
    "columns": [
      {
        "column_name": "date_of_birth",
        "data_type": "date",
        "is_nullable": "YES",
        "column_default": null
      },
      {
        "column_name": "user_role",
        "data_type": "USER-DEFINED",
        "is_nullable": "YES",
        "column_default": null
      },
      {
        "column_name": "username",
        "data_type": "text",
        "is_nullable": "YES",
        "column_default": null
      },
      {
        "column_name": "name",
        "data_type": "text",
        "is_nullable": "YES",
        "column_default": "''::text"
      },
      {
        "column_name": "email",
        "data_type": "text",
        "is_nullable": "YES",
        "column_default": "''::text"
      },
      {
        "column_name": "active",
        "data_type": "boolean",
        "is_nullable": "NO",
        "column_default": "false"
      },
      {
        "column_name": "term_agree_time",
        "data_type": "timestamp with time zone",
        "is_nullable": "YES",
        "column_default": null
      },
      {
        "column_name": "invited",
        "data_type": "boolean",
        "is_nullable": "NO",
        "column_default": "false"
      },
      {
        "column_name": "image_path",
        "data_type": "text",
        "is_nullable": "YES",
        "column_default": null
      },
      {
        "column_name": "id",
        "data_type": "uuid",
        "is_nullable": "NO",
        "column_default": "auth.uid()"
      },
      {
        "column_name": "gender",
        "data_type": "USER-DEFINED",
        "is_nullable": "YES",
        "column_default": null
      }
    ]
  },
  {
    "table_schema": "public",
    "table_name": "rating",
    "columns": [
      {
        "column_name": "id",
        "data_type": "uuid",
        "is_nullable": "NO",
        "column_default": "gen_random_uuid()"
      },
      {
        "column_name": "rater_id",
        "data_type": "uuid",
        "is_nullable": "NO",
        "column_default": null
      },
      {
        "column_name": "judge_id",
        "data_type": "uuid",
        "is_nullable": "NO",
        "column_default": null
      },
      {
        "column_name": "rate",
        "data_type": "integer",
        "is_nullable": "NO",
        "column_default": null
      },
      {
        "column_name": "created_at",
        "data_type": "timestamp without time zone",
        "is_nullable": "NO",
        "column_default": "CURRENT_TIMESTAMP"
      }
    ]
  },
  {
    "table_schema": "public",
    "table_name": "school",
    "columns": [
      {
        "column_name": "created_by",
        "data_type": "uuid",
        "is_nullable": "NO",
        "column_default": "auth.uid()"
      },
      {
        "column_name": "updated_at",
        "data_type": "timestamp without time zone",
        "is_nullable": "NO",
        "column_default": "now()"
      },
      {
        "column_name": "name",
        "data_type": "text",
        "is_nullable": "NO",
        "column_default": null
      },
      {
        "column_name": "id",
        "data_type": "uuid",
        "is_nullable": "NO",
        "column_default": "gen_random_uuid()"
      },
      {
        "column_name": "created_at",
        "data_type": "timestamp without time zone",
        "is_nullable": "NO",
        "column_default": "now()"
      }
    ]
  },
  {
    "table_schema": "public",
    "table_name": "student",
    "columns": [
      {
        "column_name": "graduation_year",
        "data_type": "bigint",
        "is_nullable": "NO",
        "column_default": null
      },
      {
        "column_name": "relationship_with_guardian",
        "data_type": "text",
        "is_nullable": "YES",
        "column_default": null
      },
      {
        "column_name": "ranking",
        "data_type": "smallint",
        "is_nullable": "NO",
        "column_default": "'0'::smallint"
      },
      {
        "column_name": "id",
        "data_type": "uuid",
        "is_nullable": "NO",
        "column_default": "gen_random_uuid()"
      },
      {
        "column_name": "user_id",
        "data_type": "uuid",
        "is_nullable": "NO",
        "column_default": "auth.uid()"
      },
      {
        "column_name": "guardian_id",
        "data_type": "uuid",
        "is_nullable": "YES",
        "column_default": null
      },
      {
        "column_name": "school_id",
        "data_type": "uuid",
        "is_nullable": "YES",
        "column_default": null
      },
      {
        "column_name": "division",
        "data_type": "USER-DEFINED",
        "is_nullable": "YES",
        "column_default": null
      },
      {
        "column_name": "exp",
        "data_type": "integer",
        "is_nullable": "NO",
        "column_default": "0"
      },
      {
        "column_name": "level",
        "data_type": "integer",
        "is_nullable": "NO",
        "column_default": "0"
      },
      {
        "column_name": "location",
        "data_type": "text",
        "is_nullable": "NO",
        "column_default": null
      },
      {
        "column_name": "challenge_enabled",
        "data_type": "boolean",
        "is_nullable": "NO",
        "column_default": "false"
      }
    ]
  },
  {
    "table_schema": "public",
    "table_name": "team",
    "columns": [
      {
        "column_name": "division",
        "data_type": "USER-DEFINED",
        "is_nullable": "NO",
        "column_default": null
      },
      {
        "column_name": "id",
        "data_type": "uuid",
        "is_nullable": "NO",
        "column_default": "gen_random_uuid()"
      },
      {
        "column_name": "updated_at",
        "data_type": "timestamp without time zone",
        "is_nullable": "NO",
        "column_default": null
      },
      {
        "column_name": "created_at",
        "data_type": "timestamp without time zone",
        "is_nullable": "NO",
        "column_default": "CURRENT_TIMESTAMP"
      },
      {
        "column_name": "image_path",
        "data_type": "text",
        "is_nullable": "NO",
        "column_default": null
      },
      {
        "column_name": "description",
        "data_type": "text",
        "is_nullable": "NO",
        "column_default": null
      },
      {
        "column_name": "name",
        "data_type": "text",
        "is_nullable": "NO",
        "column_default": null
      }
    ]
  },
  {
    "table_schema": "public",
    "table_name": "team_member",
    "columns": [
      {
        "column_name": "status",
        "data_type": "USER-DEFINED",
        "is_nullable": "NO",
        "column_default": "'PENDING'::status"
      },
      {
        "column_name": "id",
        "data_type": "uuid",
        "is_nullable": "NO",
        "column_default": "gen_random_uuid()"
      },
      {
        "column_name": "created_at",
        "data_type": "timestamp without time zone",
        "is_nullable": "NO",
        "column_default": "CURRENT_TIMESTAMP"
      },
      {
        "column_name": "updated_at",
        "data_type": "timestamp without time zone",
        "is_nullable": "NO",
        "column_default": null
      },
      {
        "column_name": "student_id",
        "data_type": "uuid",
        "is_nullable": "NO",
        "column_default": null
      },
      {
        "column_name": "team_id",
        "data_type": "uuid",
        "is_nullable": "NO",
        "column_default": null
      },
      {
        "column_name": "join_date",
        "data_type": "timestamp without time zone",
        "is_nullable": "YES",
        "column_default": null
      },
      {
        "column_name": "is_leader",
        "data_type": "boolean",
        "is_nullable": "NO",
        "column_default": "false"
      }
    ]
  }
]

## 05

SELECT 
  n.nspname AS schema,
  t.typname AS type_name,
  array_agg(e.enumlabel ORDER BY e.enumsortorder) AS enum_values
FROM 
  pg_type t
  JOIN pg_enum e ON t.oid = e.enumtypid
  JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
WHERE 
  n.nspname = 'public'
GROUP BY 
  schema, type_name
ORDER BY 
  schema, type_name;

[
  {
    "schema": "public",
    "type_name": "debate_ballot_status_enum",
    "enum_values": "{PENDING,IN_PROGRESS,COMPLETE}"
  },
  {
    "schema": "public",
    "type_name": "debate_session_status",
    "enum_values": "{SCHEDULED,ONGOING,COMPLETED,CANCELLED}"
  },
  {
    "schema": "public",
    "type_name": "division",
    "enum_values": "{VILLIGER,LOWER,UPPER,SENIOR,OPEN}"
  },
  {
    "schema": "public",
    "type_name": "gender",
    "enum_values": "{MALE,FEMALE,\"do not wish to specify\"}"
  },
  {
    "schema": "public",
    "type_name": "group_type",
    "enum_values": "{GUILD,TEAM}"
  },
  {
    "schema": "public",
    "type_name": "log_type",
    "enum_values": "{REQUEST_JOIN,JOINED,LEFT,INVITED,KICKED,UPDATED,DELETED,CREATED}"
  },
  {
    "schema": "public",
    "type_name": "payment_provider",
    "enum_values": "{TOSS,NAVER_PAY,KAKAO_PAY}"
  },
  {
    "schema": "public",
    "type_name": "payment_state",
    "enum_values": "{REQUESTED,PENDING,FAILED,COMPLETED,AUTHORIZED,ABANDONED,REFUNDED,PREAPPROVED}"
  },
  {
    "schema": "public",
    "type_name": "status",
    "enum_values": "{PENDING,ACCEPTED,REJECTED,EXPIRED,CANCELLED}"
  },
  {
    "schema": "public",
    "type_name": "user_role_type",
    "enum_values": "{STUDENT,JUDGE,GUARDIAN}"
  }
]

## 06

SELECT
  tc.table_schema, 
  tc.constraint_name, 
  tc.table_name, 
  kcu.column_name, 
  ccu.table_schema AS foreign_table_schema,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM 
  information_schema.table_constraints AS tc 
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
  JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE 
  tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_schema = 'public'
ORDER BY 
  tc.table_name;

[
  {
    "table_schema": "public",
    "constraint_name": "BankAccount_guardianId_fkey",
    "table_name": "bank_account",
    "column_name": "guardian_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "guardian",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "friendship_user_id_fkey",
    "table_name": "friendship",
    "column_name": "user_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "student",
    "foreign_column_name": "user_id"
  },
  {
    "table_schema": "public",
    "constraint_name": "friendship_friend_id_fkey",
    "table_name": "friendship",
    "column_name": "friend_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "student",
    "foreign_column_name": "user_id"
  },
  {
    "table_schema": "public",
    "constraint_name": "Guardian_userId_fkey",
    "table_name": "guardian",
    "column_name": "user_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "profile",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "guardian_request_sender_fkey",
    "table_name": "guardian_request",
    "column_name": "sender",
    "foreign_table_schema": "public",
    "foreign_table_name": "profile",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "guardian_request_reciever_fkey",
    "table_name": "guardian_request",
    "column_name": "reciever",
    "foreign_table_schema": "public",
    "foreign_table_name": "profile",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "Guild_schoolId_fkey",
    "table_name": "guild",
    "column_name": "school_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "school",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "GuildMember_guildId_fkey",
    "table_name": "guild_member",
    "column_name": "guild_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "guild",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "GuildMember_studentId_fkey",
    "table_name": "guild_member",
    "column_name": "student_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "student",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "Invitation_guildId_fkey",
    "table_name": "invitation",
    "column_name": "guild_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "guild",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "Invitation_inviteeId_fkey",
    "table_name": "invitation",
    "column_name": "invitee_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "profile",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "Invitation_inviterId_fkey",
    "table_name": "invitation",
    "column_name": "inviter_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "profile",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "Invitation_teamId_fkey",
    "table_name": "invitation",
    "column_name": "team_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "team",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "Judge_userId_fkey",
    "table_name": "judge",
    "column_name": "user_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "profile",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "Judge_referralUserId_fkey",
    "table_name": "judge",
    "column_name": "referral_user_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "profile",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "Log_teamId_fkey",
    "table_name": "log",
    "column_name": "team_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "team",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "Log_guildId_fkey",
    "table_name": "log",
    "column_name": "guild_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "guild",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "Log_studentId_fkey",
    "table_name": "log",
    "column_name": "student_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "student",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "PaymentHistory_guardianId_fkey",
    "table_name": "payment_history",
    "column_name": "guardian_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "guardian",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "Rating_raterId_fkey",
    "table_name": "rating",
    "column_name": "rater_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "student",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "Rating_judgeId_fkey",
    "table_name": "rating",
    "column_name": "judge_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "judge",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "student_user_id_fkey",
    "table_name": "student",
    "column_name": "user_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "profile",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "Student_schoolId_fkey",
    "table_name": "student",
    "column_name": "school_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "school",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "Student_guardianId_fkey",
    "table_name": "student",
    "column_name": "guardian_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "guardian",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "team_member_student_id_fkey1",
    "table_name": "team_member",
    "column_name": "student_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "profile",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "TeamMember_teamId_fkey",
    "table_name": "team_member",
    "column_name": "team_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "team",
    "foreign_column_name": "id"
  }
]

## 07

SELECT
  tablename,
  indexname,
  indexdef
FROM
  pg_indexes
WHERE
  schemaname = 'public'
ORDER BY
  tablename, indexname;

[
  {
    "tablename": "admin",
    "indexname": "admin_pkey",
    "indexdef": "CREATE UNIQUE INDEX admin_pkey ON public.admin USING btree (id)"
  },
  {
    "tablename": "bank_account",
    "indexname": "BankAccount_pkey",
    "indexdef": "CREATE UNIQUE INDEX \"BankAccount_pkey\" ON public.bank_account USING btree (id)"
  },
  {
    "tablename": "friendship",
    "indexname": "friend_unique",
    "indexdef": "CREATE UNIQUE INDEX friend_unique ON public.friendship USING btree (user_id, friend_id)"
  },
  {
    "tablename": "friendship",
    "indexname": "friendship_pkey",
    "indexdef": "CREATE UNIQUE INDEX friendship_pkey ON public.friendship USING btree (id)"
  },
  {
    "tablename": "guardian",
    "indexname": "Guardian_pkey",
    "indexdef": "CREATE UNIQUE INDEX \"Guardian_pkey\" ON public.guardian USING btree (id)"
  },
  {
    "tablename": "guardian",
    "indexname": "Guardian_userId_idx",
    "indexdef": "CREATE INDEX \"Guardian_userId_idx\" ON public.guardian USING btree (user_id)"
  },
  {
    "tablename": "guardian",
    "indexname": "Guardian_userId_key",
    "indexdef": "CREATE UNIQUE INDEX \"Guardian_userId_key\" ON public.guardian USING btree (user_id)"
  },
  {
    "tablename": "guardian",
    "indexname": "guardian_user_id_key",
    "indexdef": "CREATE UNIQUE INDEX guardian_user_id_key ON public.guardian USING btree (user_id)"
  },
  {
    "tablename": "guardian_request",
    "indexname": "guardian_request_pkey",
    "indexdef": "CREATE UNIQUE INDEX guardian_request_pkey ON public.guardian_request USING btree (id)"
  },
  {
    "tablename": "guild",
    "indexname": "Guild_pkey",
    "indexdef": "CREATE UNIQUE INDEX \"Guild_pkey\" ON public.guild USING btree (id)"
  },
  {
    "tablename": "guild_member",
    "indexname": "GuildMember_pkey",
    "indexdef": "CREATE UNIQUE INDEX \"GuildMember_pkey\" ON public.guild_member USING btree (id)"
  },
  {
    "tablename": "invitation",
    "indexname": "Invitation_inviteeId_idx",
    "indexdef": "CREATE INDEX \"Invitation_inviteeId_idx\" ON public.invitation USING btree (invitee_id)"
  },
  {
    "tablename": "invitation",
    "indexname": "Invitation_inviterId_idx",
    "indexdef": "CREATE INDEX \"Invitation_inviterId_idx\" ON public.invitation USING btree (inviter_id)"
  },
  {
    "tablename": "invitation",
    "indexname": "Invitation_pkey",
    "indexdef": "CREATE UNIQUE INDEX \"Invitation_pkey\" ON public.invitation USING btree (id)"
  },
  {
    "tablename": "judge",
    "indexname": "Judge_pkey",
    "indexdef": "CREATE UNIQUE INDEX \"Judge_pkey\" ON public.judge USING btree (id)"
  },
  {
    "tablename": "judge",
    "indexname": "Judge_userId_idx",
    "indexdef": "CREATE INDEX \"Judge_userId_idx\" ON public.judge USING btree (user_id)"
  },
  {
    "tablename": "judge",
    "indexname": "Judge_userId_key",
    "indexdef": "CREATE UNIQUE INDEX \"Judge_userId_key\" ON public.judge USING btree (user_id)"
  },
  {
    "tablename": "log",
    "indexname": "Log_pkey",
    "indexdef": "CREATE UNIQUE INDEX \"Log_pkey\" ON public.log USING btree (id)"
  },
  {
    "tablename": "log",
    "indexname": "Log_studentId_idx",
    "indexdef": "CREATE INDEX \"Log_studentId_idx\" ON public.log USING btree (student_id)"
  },
  {
    "tablename": "payment_history",
    "indexname": "PaymentHistory_pkey",
    "indexdef": "CREATE UNIQUE INDEX \"PaymentHistory_pkey\" ON public.payment_history USING btree (id)"
  },
  {
    "tablename": "profile",
    "indexname": "User_id_key",
    "indexdef": "CREATE UNIQUE INDEX \"User_id_key\" ON public.profile USING btree (id)"
  },
  {
    "tablename": "profile",
    "indexname": "User_pkey",
    "indexdef": "CREATE UNIQUE INDEX \"User_pkey\" ON public.profile USING btree (id)"
  },
  {
    "tablename": "profile",
    "indexname": "User_username_key",
    "indexdef": "CREATE UNIQUE INDEX \"User_username_key\" ON public.profile USING btree (username)"
  },
  {
    "tablename": "profile",
    "indexname": "User_username_key1",
    "indexdef": "CREATE UNIQUE INDEX \"User_username_key1\" ON public.profile USING btree (username)"
  },
  {
    "tablename": "rating",
    "indexname": "Rating_pkey",
    "indexdef": "CREATE UNIQUE INDEX \"Rating_pkey\" ON public.rating USING btree (id)"
  },
  {
    "tablename": "school",
    "indexname": "School_pkey",
    "indexdef": "CREATE UNIQUE INDEX \"School_pkey\" ON public.school USING btree (id)"
  },
  {
    "tablename": "school",
    "indexname": "school_name_key",
    "indexdef": "CREATE UNIQUE INDEX school_name_key ON public.school USING btree (name)"
  },
  {
    "tablename": "student",
    "indexname": "Student_pkey",
    "indexdef": "CREATE UNIQUE INDEX \"Student_pkey\" ON public.student USING btree (id)"
  },
  {
    "tablename": "student",
    "indexname": "Student_userId_idx",
    "indexdef": "CREATE INDEX \"Student_userId_idx\" ON public.student USING btree (user_id)"
  },
  {
    "tablename": "student",
    "indexname": "Student_userId_key",
    "indexdef": "CREATE UNIQUE INDEX \"Student_userId_key\" ON public.student USING btree (user_id)"
  },
  {
    "tablename": "student",
    "indexname": "student_user_id_key",
    "indexdef": "CREATE UNIQUE INDEX student_user_id_key ON public.student USING btree (user_id)"
  },
  {
    "tablename": "team",
    "indexname": "Team_pkey",
    "indexdef": "CREATE UNIQUE INDEX \"Team_pkey\" ON public.team USING btree (id)"
  },
  {
    "tablename": "team_member",
    "indexname": "TeamMember_pkey",
    "indexdef": "CREATE UNIQUE INDEX \"TeamMember_pkey\" ON public.team_member USING btree (id)"
  },
  {
    "tablename": "team_member",
    "indexname": "team_member_student_team_unique",
    "indexdef": "CREATE UNIQUE INDEX team_member_student_team_unique ON public.team_member USING btree (student_id, team_id)"
  }
]

## 08

SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM
  pg_policies
WHERE
  schemaname = 'public'
ORDER BY
  tablename, policyname;


[
  {
    "schemaname": "public",
    "tablename": "friendship",
    "policyname": "Allow insert on friendship",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "true"
  },
  {
    "schemaname": "public",
    "tablename": "friendship",
    "policyname": "Allow select on friendship",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "SELECT",
    "qual": "((user_id = auth.uid()) OR (friend_id = auth.uid()))",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "friendship",
    "policyname": "Allow update on friendship",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "UPDATE",
    "qual": "((user_id = auth.uid()) OR (friend_id = auth.uid()))",
    "with_check": "((user_id = auth.uid()) OR ((friend_id = auth.uid()) AND (status = ANY (ARRAY['ACCEPTED'::status, 'REJECTED'::status]))))"
  },
  {
    "schemaname": "public",
    "tablename": "guardian",
    "policyname": "Enable insert for authenticated users only",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "true"
  },
  {
    "schemaname": "public",
    "tablename": "guardian",
    "policyname": "Enable read access for all users",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "true",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "judge",
    "policyname": "Enable insert for authenticated users only",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "true"
  },
  {
    "schemaname": "public",
    "tablename": "profile",
    "policyname": "Allow users to select their own profile",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "SELECT",
    "qual": "(( SELECT auth.uid() AS uid) = id)",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "profile",
    "policyname": "Allow users to update their own profile",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "UPDATE",
    "qual": "(( SELECT auth.uid() AS uid) = id)",
    "with_check": "(( SELECT auth.uid() AS uid) = id)"
  },
  {
    "schemaname": "public",
    "tablename": "profile",
    "policyname": "Enable read access for all users",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "SELECT",
    "qual": "true",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "school",
    "policyname": "Allow authenticated users to insert school",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "true"
  },
  {
    "schemaname": "public",
    "tablename": "school",
    "policyname": "Enable read access for all users",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "SELECT",
    "qual": "true",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "student",
    "policyname": "Enable insert for authenticated users only",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "true"
  },
  {
    "schemaname": "public",
    "tablename": "student",
    "policyname": "Enable read access for all users",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "SELECT",
    "qual": "true",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "student",
    "policyname": "update_student_policy",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "UPDATE",
    "qual": "(user_id = auth.uid())",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "team",
    "policyname": "Enable delete for users based on user_id",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "DELETE",
    "qual": "true",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "team",
    "policyname": "Enable insert for authenticated users only",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "true"
  },
  {
    "schemaname": "public",
    "tablename": "team",
    "policyname": "Enable read access for all users",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "SELECT",
    "qual": "true",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "team",
    "policyname": "Policy with table joins",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "UPDATE",
    "qual": "true",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "team_member",
    "policyname": "Enable delete for users based on user_id",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "DELETE",
    "qual": "true",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "team_member",
    "policyname": "Enable insert for users based on user_id",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "((status = 'PENDING'::status) OR (( SELECT auth.uid() AS uid) = student_id))"
  },
  {
    "schemaname": "public",
    "tablename": "team_member",
    "policyname": "Enable read access for all users",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "SELECT",
    "qual": "true",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "team_member",
    "policyname": "Enable update for users based on email",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "UPDATE",
    "qual": "true",
    "with_check": null
  }
]

## 09

SELECT * FROM storage.buckets;

[
  {
    "id": "logo",
    "name": "logo",
    "owner": null,
    "created_at": "2025-04-05 02:15:45.864681+00",
    "updated_at": "2025-04-05 02:15:45.864681+00",
    "public": true,
    "avif_autodetection": false,
    "file_size_limit": null,
    "allowed_mime_types": null,
    "owner_id": null,
    "type": "STANDARD"
  },
  {
    "id": "profile-images",
    "name": "profile-images",
    "owner": null,
    "created_at": "2025-04-06 13:36:52.681039+00",
    "updated_at": "2025-04-06 13:36:52.681039+00",
    "public": true,
    "avif_autodetection": false,
    "file_size_limit": 102400,
    "allowed_mime_types": null,
    "owner_id": null,
    "type": "STANDARD"
  },
  {
    "id": "team-assets",
    "name": "team-assets",
    "owner": null,
    "created_at": "2025-05-12 15:57:17.462742+00",
    "updated_at": "2025-05-12 15:57:17.462742+00",
    "public": true,
    "avif_autodetection": false,
    "file_size_limit": null,
    "allowed_mime_types": null,
    "owner_id": null,
    "type": "STANDARD"
  }
]

## 10


SELECT 
  n.nspname AS schema_name,
  p.proname AS function_name,
  pg_get_function_arguments(p.oid) AS arguments,
  CASE WHEN p.prokind = 'f' THEN 'function' ELSE 'procedure' END AS type,
  pg_get_functiondef(p.oid) AS definition
FROM 
  pg_proc p
  JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE 
  n.nspname = 'public'
ORDER BY 
  schema_name, function_name;


[
  {
    "schema_name": "public",
    "function_name": "add_new_user",
    "arguments": "",
    "type": "function",
    "definition": "CREATE OR REPLACE FUNCTION public.add_new_user()\n RETURNS trigger\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\nbegin\n  if new.raw_app_meta_data ->> 'provider' = 'email' then\n    insert into public.profile (id)\n    values (new.id);\n    \n  elsif new.raw_app_meta_data ->> 'provider' = 'kakao'\n        or new.raw_app_meta_data ->> 'provider' = 'google' then\n    insert into public.profile (id, email, name, image_path)\n    values (\n      new.id,\n      new.email,\n      new.raw_user_meta_data ->> 'name',\n      new.raw_user_meta_data ->> 'avatar_url'\n    );\n  end if;\n  \n  return new;\nend;\n$function$\n"
  },
  {
    "schema_name": "public",
    "function_name": "check_friendship_update_allowed_columns",
    "arguments": "",
    "type": "function",
    "definition": "CREATE OR REPLACE FUNCTION public.check_friendship_update_allowed_columns()\n RETURNS trigger\n LANGUAGE plpgsql\nAS $function$\nBEGIN\n  IF NEW.user_id IS DISTINCT FROM OLD.user_id THEN\n    RAISE EXCEPTION 'user_id는 업데이트할 수 없습니다.';\n  END IF;\n  \n  IF NEW.friend_id IS DISTINCT FROM OLD.friend_id THEN\n    RAISE EXCEPTION 'friend_id는 업데이트할 수 없습니다.';\n  END IF;\n  \n  IF NEW.created_at IS DISTINCT FROM OLD.created_at THEN\n    RAISE EXCEPTION 'created_at은 업데이트할 수 없습니다.';\n  END IF;\n  \n  RETURN NEW;\nEND;\n$function$\n"
  },
  {
    "schema_name": "public",
    "function_name": "check_insert_allowed_columns",
    "arguments": "",
    "type": "function",
    "definition": "CREATE OR REPLACE FUNCTION public.check_insert_allowed_columns()\n RETURNS trigger\n LANGUAGE plpgsql\nAS $function$\nBEGIN\n  -- division는 삽입할 수 없음\n  IF NEW.division IS NOT NULL THEN\n    RAISE EXCEPTION 'division은 삽입할 수 없습니다.';\n  END IF;\n\n  IF NEW.level != 0 THEN\n    RAISE EXCEPTION 'level은 삽입할 수 없습니다.';\n  END IF;\n\n  IF NEW.exp != 0 THEN\n    RAISE EXCEPTION 'exp는 삽입할 수 없습니다.';\n  END IF;\n\n  IF NEW.ranking != '0'::smallint THEN\n    RAISE EXCEPTION 'ranking은 삽입할 수 없습니다.';\n  END IF;\n  \n  RETURN NEW;\nEND;\n$function$\n"
  },
  {
    "schema_name": "public",
    "function_name": "check_team_member_delete",
    "arguments": "",
    "type": "function",
    "definition": "CREATE OR REPLACE FUNCTION public.check_team_member_delete()\n RETURNS trigger\n LANGUAGE plpgsql\nAS $function$\nBEGIN\n  -- 삭제 요청자가 본인(student_id)인지 확인\n  IF auth.uid()::uuid <> OLD.student_id THEN\n    -- 본인이 아니면 같은 팀에서 is_leader = true 인지 확인\n    IF NOT EXISTS (\n      SELECT 1\n      FROM public.team_member tm\n      WHERE tm.team_id = OLD.team_id\n        AND tm.student_id = auth.uid()::uuid\n        AND tm.is_leader = TRUE\n    ) THEN\n      RAISE EXCEPTION '삭제 권한이 없습니다. 본인이거나 팀 리더만 삭제할 수 있습니다.';\n    END IF;\n  END IF;\n  RETURN OLD;\nEND;\n$function$\n"
  },
  {
    "schema_name": "public",
    "function_name": "check_team_update_leader",
    "arguments": "",
    "type": "function",
    "definition": "CREATE OR REPLACE FUNCTION public.check_team_update_leader()\n RETURNS trigger\n LANGUAGE plpgsql\nAS $function$\nBEGIN\n  -- 인증된 사용자만\n  IF auth.uid() IS NULL THEN\n    RAISE EXCEPTION 'Unauthorized: 로그인한 사용자만 접근할 수 있습니다.';\n  END IF;\n\n  -- 해당 팀의 리더인지 확인\n  IF NOT EXISTS (\n    SELECT 1\n    FROM public.team_member tm\n    WHERE tm.team_id   = OLD.id\n      AND tm.student_id = auth.uid()::uuid\n      AND tm.is_leader  = TRUE\n  ) THEN\n    RAISE EXCEPTION 'Permission denied: 오직 팀 리더만 팀 정보를 수정할 수 있습니다.';\n  END IF;\n\n  RETURN NEW;\nEND;\n$function$\n"
  },
  {
    "schema_name": "public",
    "function_name": "check_update_allowed_columns",
    "arguments": "",
    "type": "function",
    "definition": "CREATE OR REPLACE FUNCTION public.check_update_allowed_columns()\n RETURNS trigger\n LANGUAGE plpgsql\nAS $function$\nBEGIN\n  -- division는 변경할 수 없음\n  IF NEW.division IS DISTINCT FROM OLD.division THEN\n    RAISE EXCEPTION 'division는 변경할 수 없습니다.';\n  END IF;\n  \n  RETURN NEW;\nEND;\n$function$\n"
  },
  {
    "schema_name": "public",
    "function_name": "delete_empty_team_after_member_delete",
    "arguments": "",
    "type": "function",
    "definition": "CREATE OR REPLACE FUNCTION public.delete_empty_team_after_member_delete()\n RETURNS trigger\n LANGUAGE plpgsql\nAS $function$\nBEGIN\n  -- 삭제된 멤버의 team_id에 해당하는 남은 멤버 수 조회\n  IF NOT EXISTS (\n    SELECT 1\n    FROM public.team_member\n    WHERE team_id = OLD.team_id\n  ) THEN\n    -- 남은 멤버가 없으면 team 삭제\n    DELETE FROM public.team\n    WHERE id = OLD.team_id;\n  END IF;\n  RETURN NULL;\nEND;\n$function$\n"
  },
  {
    "schema_name": "public",
    "function_name": "delete_invalid_friendship",
    "arguments": "",
    "type": "function",
    "definition": "CREATE OR REPLACE FUNCTION public.delete_invalid_friendship()\n RETURNS trigger\n LANGUAGE plpgsql\nAS $function$\nbegin\n  -- 상태가 허용된 값에 없다면\n  if new.status not in ('PENDING', 'ACCEPTED') then\n    -- 방금 삽입/수정된 행을 삭제\n    delete from public.friendship\n      where id = new.id;\n  end if;\n  -- AFTER 트리거이므로 반환값은 무시되지만, convention 상 null을 반환\n  return null;\nend;\n$function$\n"
  },
  {
    "schema_name": "public",
    "function_name": "get_friend_list",
    "arguments": "",
    "type": "function",
    "definition": "CREATE OR REPLACE FUNCTION public.get_friend_list()\n RETURNS TABLE(id uuid, friend_id uuid, created_at timestamp with time zone, updated_at timestamp with time zone, status status)\n LANGUAGE plpgsql\n STABLE SECURITY DEFINER\nAS $function$\nBEGIN\n  RETURN QUERY\n  SELECT\n    f.id AS id,\n    CASE \n      WHEN f.user_id = auth.uid() THEN f.friend_id\n      ELSE f.user_id\n    END AS friend_id,\n    f.created_at,\n    f.updated_at,\n    f.status\n  FROM public.friendship f\n  WHERE (f.user_id = auth.uid() OR f.friend_id = auth.uid());\nEND;\n$function$\n"
  },
  {
    "schema_name": "public",
    "function_name": "get_friend_profiles",
    "arguments": "",
    "type": "function",
    "definition": "CREATE OR REPLACE FUNCTION public.get_friend_profiles()\n RETURNS TABLE(id uuid, friend_id uuid, image_path text, username text, exp integer)\n LANGUAGE plpgsql\n STABLE SECURITY DEFINER\nAS $function$\nDECLARE\n  current_user uuid;\nBEGIN  \n  RETURN QUERY\n  SELECT \n    f.id AS friendship_id,\n    CASE \n      WHEN f.user_id = auth.uid() THEN f.friend_id \n      ELSE f.user_id \n    END AS friend_id,\n    p.image_path,\n    p.username,\n    s.exp\n  FROM public.friendship f\n  JOIN public.profile p\n    ON p.id = (\n         CASE \n           WHEN f.user_id = auth.uid() THEN f.friend_id \n           ELSE f.user_id \n         END\n       )\n  JOIN public.student s\n    ON s.user_id = p.id\n  WHERE (f.user_id = auth.uid() OR f.friend_id = auth.uid())\n    AND f.status = 'ACCEPTED';\nEND;\n$function$\n"
  },
  {
    "schema_name": "public",
    "function_name": "get_profile_and_student",
    "arguments": "_user_id uuid",
    "type": "function",
    "definition": "CREATE OR REPLACE FUNCTION public.get_profile_and_student(_user_id uuid)\n RETURNS TABLE(id uuid, name text, username text, image_path text, date_of_birth date, gender gender, user_role user_role_type, active boolean, term_agree_time timestamp with time zone, email text, invited boolean, student_id uuid, guardian_id uuid, school_id uuid, division division, location text, exp integer, ranking smallint, challenge_enabled boolean, graduation_year bigint, relationship_with_guardian text, level integer)\n LANGUAGE plpgsql\n STABLE\nAS $function$\nbegin\n  -- 1) Profile 존재 체크\n  if not exists (\n    select 1 from public.profile where id = _user_id\n  ) then\n    raise exception 'Profile not found' using errcode = 'P0001';\n  end if;\n\n  -- 2) Student 존재 체크\n  if not exists (\n    select 1 from public.student where user_id = _user_id\n  ) then\n    raise exception 'Student not found' using errcode = 'P0002';\n  end if;\n\n  -- 3) 실제 데이터 리턴\n  return query\n    select\n      p.id, p.name, p.username, p.image_path, p.date_of_birth,\n      p.gender, p.user_role, p.active, p.term_agree_time, p.email, p.invited,\n      s.id           as student_id,\n      s.guardian_id,\n      s.school_id,\n      s.division,\n      s.location,\n      s.exp,\n      s.ranking,\n      s.challenge_enabled,\n      s.graduation_year,\n      s.relationship_with_guardian,\n      s.level\n    from public.profile p\n    left join public.student s on s.user_id = p.id\n    where p.id = _user_id;\nend;\n$function$\n"
  },
  {
    "schema_name": "public",
    "function_name": "get_profile_uuid",
    "arguments": "input text",
    "type": "function",
    "definition": "CREATE OR REPLACE FUNCTION public.get_profile_uuid(input text)\n RETURNS uuid\n LANGUAGE plpgsql\n STABLE\nAS $function$\nDECLARE\n    id uuid;\nBEGIN\n    SELECT p.id\n      INTO id\n      FROM public.profile p\n     WHERE p.email = input OR p.username = input\n     LIMIT 1;\n\n    RETURN id;\nEND;\n$function$\n"
  },
  {
    "schema_name": "public",
    "function_name": "get_table_ddl",
    "arguments": "p_schema_name character varying, p_table_name character varying",
    "type": "function",
    "definition": "CREATE OR REPLACE FUNCTION public.get_table_ddl(p_schema_name character varying, p_table_name character varying)\n RETURNS text\n LANGUAGE plpgsql\nAS $function$\r\nDECLARE\r\n  v_table_ddl text;\r\n  column_record record;\r\n  constraint_record record;\r\n  index_record record;\r\nBEGIN\r\n  -- Start the create table statement\r\n  v_table_ddl := 'CREATE TABLE ' || p_schema_name || '.' || p_table_name || ' (' || chr(10);\r\n  \r\n  -- Get columns\r\n  FOR column_record IN \r\n    SELECT \r\n      column_name,\r\n      data_type,\r\n      coalesce(character_maximum_length::text, '') as character_maximum_length,\r\n      is_nullable,\r\n      column_default\r\n    FROM \r\n      information_schema.columns\r\n    WHERE \r\n      table_schema = p_schema_name\r\n      AND table_name = p_table_name\r\n    ORDER BY \r\n      ordinal_position \r\n  LOOP\r\n    v_table_ddl := v_table_ddl || '  ' || column_record.column_name || ' ' || column_record.data_type;\r\n    \r\n    -- Add length for varchar\r\n    IF column_record.character_maximum_length <> '' THEN\r\n      v_table_ddl := v_table_ddl || '(' || column_record.character_maximum_length || ')';\r\n    END IF;\r\n    \r\n    -- Add nullable\r\n    IF column_record.is_nullable = 'NO' THEN\r\n      v_table_ddl := v_table_ddl || ' NOT NULL';\r\n    END IF;\r\n    \r\n    -- Add default\r\n    IF column_record.column_default IS NOT NULL THEN\r\n      v_table_ddl := v_table_ddl || ' DEFAULT ' || column_record.column_default;\r\n    END IF;\r\n    \r\n    v_table_ddl := v_table_ddl || ',' || chr(10);\r\n  END LOOP;\r\n\r\n  -- Remove the last comma and newline\r\n  v_table_ddl := substring(v_table_ddl, 1, length(v_table_ddl) - 2) || chr(10) || ');';\r\n  \r\n  -- Add primary key constraint\r\n  FOR constraint_record IN\r\n    SELECT \r\n      tc.constraint_name,\r\n      string_agg(kcu.column_name, ', ') as columns\r\n    FROM \r\n      information_schema.table_constraints tc\r\n      JOIN information_schema.key_column_usage kcu\r\n        ON tc.constraint_catalog = kcu.constraint_catalog\r\n        AND tc.constraint_schema = kcu.constraint_schema\r\n        AND tc.constraint_name = kcu.constraint_name\r\n    WHERE \r\n      tc.constraint_type = 'PRIMARY KEY'\r\n      AND tc.table_schema = p_schema_name\r\n      AND tc.table_name = p_table_name\r\n    GROUP BY\r\n      tc.constraint_name\r\n  LOOP\r\n    v_table_ddl := v_table_ddl || chr(10) || 'ALTER TABLE ' || p_schema_name || '.' || p_table_name || \r\n                  ' ADD CONSTRAINT ' || constraint_record.constraint_name || \r\n                  ' PRIMARY KEY (' || constraint_record.columns || ');';\r\n  END LOOP;\r\n  \r\n  RETURN v_table_ddl;\r\nEND;\r\n$function$\n"
  },
  {
    "schema_name": "public",
    "function_name": "search_school",
    "arguments": "search_query text",
    "type": "function",
    "definition": "CREATE OR REPLACE FUNCTION public.search_school(search_query text)\n RETURNS TABLE(id uuid, name text)\n LANGUAGE sql\n STABLE\nAS $function$\nwith preprocessed as (\n  select \n    id, \n    name,\n    translate(lower(name), ' ', '') as name_nospace,\n    translate(lower(search_query), ' ', '') as query_nospace\n  from school\n)\nselect id, name\nfrom (\n  select \n    id, \n    name,\n    case \n      when name_nospace ilike '%' || query_nospace || '%' then 1.0\n      else similarity(name_nospace, query_nospace)\n    end as score\n  from preprocessed\n) t\nwhere score > 0.1\norder by score desc;\n$function$\n"
  },
  {
    "schema_name": "public",
    "function_name": "set_division",
    "arguments": "",
    "type": "function",
    "definition": "CREATE OR REPLACE FUNCTION public.set_division()\n RETURNS trigger\n LANGUAGE plpgsql\nAS $function$\nDECLARE\n  current_year INT := EXTRACT(YEAR FROM CURRENT_DATE)::INT;\n  adjusted_year INT;\n  current_grade INT;\nBEGIN\n  -- 7월 1일 기준으로 학년도 조정\n  IF CURRENT_DATE >= make_date(current_year, 7, 1) THEN\n    adjusted_year := current_year + 1;\n  ELSE\n    adjusted_year := current_year;\n  END IF;\n\n  -- 현재 학년 계산 (학생은 4학년부터 시작, 총 9년 과정으로 가정)\n  -- graduationYear가 졸업하는 해라면, 현재 학년 = adjusted_year - graduationYear + 12\n  current_grade := adjusted_year - NEW.graduation_year + 12;\n\n  -- 학년에 따른 division 설정\n  IF current_grade BETWEEN 4 AND 5 THEN\n    NEW.division := 'VILLIGER';\n  ELSIF current_grade BETWEEN 6 AND 7 THEN\n    NEW.division := 'LOWER';\n  ELSIF current_grade BETWEEN 8 AND 9 THEN\n    NEW.division := 'UPPER';\n  ELSIF current_grade BETWEEN 10 AND 12 THEN\n    NEW.division := 'SENIOR';\n  ELSE\n    NEW.division := 'OPEN';\n  END IF;\n\n  RETURN NEW;\nEND;\n$function$\n"
  },
  {
    "schema_name": "public",
    "function_name": "set_team_leader",
    "arguments": "p_team_id uuid, p_student_id uuid",
    "type": "function",
    "definition": "CREATE OR REPLACE FUNCTION public.set_team_leader(p_team_id uuid, p_student_id uuid)\n RETURNS void\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\nBEGIN\n  -- 1. 인증 여부 확인\n  IF auth.uid() IS NULL THEN\n    RAISE EXCEPTION 'Unauthorized: 로그인된 사용자만 호출할 수 있습니다.';\n  END IF;\n\n  -- 2. 호출자가 해당 팀의 멤버인지 확인\n  IF NOT EXISTS (\n    SELECT 1\n      FROM public.team_member\n     WHERE team_id    = p_team_id\n       AND student_id = auth.uid()::uuid\n  ) THEN\n    RAISE EXCEPTION 'Permission denied: 호출자가 팀의 멤버가 아닙니다.';\n  END IF;\n\n  -- 3. 호출자가 현재 팀 리더인지 확인\n  IF NOT EXISTS (\n    SELECT 1\n      FROM public.team_member\n     WHERE team_id    = p_team_id\n       AND student_id = auth.uid()::uuid\n       AND is_leader  = TRUE\n  ) THEN\n    RAISE EXCEPTION 'Permission denied: 오직 현재 팀 리더만 리더를 변경할 수 있습니다.';\n  END IF;\n\n  -- 4. 새 리더가 같은 팀의 멤버인지 확인\n  IF NOT EXISTS (\n    SELECT 1\n      FROM public.team_member\n     WHERE team_id    = p_team_id\n       AND student_id = p_student_id\n  ) THEN\n    RAISE EXCEPTION 'Cannot set leader: 대상 사용자가 해당 팀의 멤버가 아닙니다.';\n  END IF;\n\n  -- 5. 기존 리더들 해제\n  UPDATE public.team_member\n     SET is_leader = FALSE\n   WHERE team_id   = p_team_id\n     AND is_leader = TRUE;\n\n  -- 6. 새로운 리더 지정\n  UPDATE public.team_member\n     SET is_leader = TRUE\n   WHERE team_id    = p_team_id\n     AND student_id = p_student_id;\nEND;\n$function$\n"
  }
]

## 11


SELECT 
  nspname AS schema_name
FROM 
  pg_namespace 
WHERE 
  nspname NOT LIKE 'pg_%' 
  AND nspname NOT IN ('information_schema', 'extensions')
ORDER BY 
  schema_name;


[
  {
    "schema_name": "auth"
  },
  {
    "schema_name": "chat"
  },
  {
    "schema_name": "debate"
  },
  {
    "schema_name": "graphql"
  },
  {
    "schema_name": "graphql_public"
  },
  {
    "schema_name": "public"
  },
  {
    "schema_name": "realtime"
  },
  {
    "schema_name": "storage"
  },
  {
    "schema_name": "supabase_migrations"
  },
  {
    "schema_name": "vault"
  }
]

## 12

SELECT
  n.nspname AS schema_name,
  c.relname AS table_name,
  CASE c.relkind
    WHEN 'r' THEN 'table'
    WHEN 'v' THEN 'view'
    WHEN 'm' THEN 'materialized view'
    WHEN 'f' THEN 'foreign table'
    ELSE c.relkind::text
  END AS type
FROM
  pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE
  n.nspname NOT IN ('pg_catalog', 'information_schema')
  AND n.nspname NOT LIKE 'pg_toast%'
  AND c.relkind IN ('r', 'v', 'm', 'f')
ORDER BY
  schema_name, table_name;

[
  {
    "schema_name": "auth",
    "table_name": "audit_log_entries",
    "type": "table"
  },
  {
    "schema_name": "auth",
    "table_name": "flow_state",
    "type": "table"
  },
  {
    "schema_name": "auth",
    "table_name": "identities",
    "type": "table"
  },
  {
    "schema_name": "auth",
    "table_name": "instances",
    "type": "table"
  },
  {
    "schema_name": "auth",
    "table_name": "mfa_amr_claims",
    "type": "table"
  },
  {
    "schema_name": "auth",
    "table_name": "mfa_challenges",
    "type": "table"
  },
  {
    "schema_name": "auth",
    "table_name": "mfa_factors",
    "type": "table"
  },
  {
    "schema_name": "auth",
    "table_name": "one_time_tokens",
    "type": "table"
  },
  {
    "schema_name": "auth",
    "table_name": "refresh_tokens",
    "type": "table"
  },
  {
    "schema_name": "auth",
    "table_name": "saml_providers",
    "type": "table"
  },
  {
    "schema_name": "auth",
    "table_name": "saml_relay_states",
    "type": "table"
  },
  {
    "schema_name": "auth",
    "table_name": "schema_migrations",
    "type": "table"
  },
  {
    "schema_name": "auth",
    "table_name": "sessions",
    "type": "table"
  },
  {
    "schema_name": "auth",
    "table_name": "sso_domains",
    "type": "table"
  },
  {
    "schema_name": "auth",
    "table_name": "sso_providers",
    "type": "table"
  },
  {
    "schema_name": "auth",
    "table_name": "users",
    "type": "table"
  },
  {
    "schema_name": "chat",
    "table_name": "message",
    "type": "table"
  },
  {
    "schema_name": "chat",
    "table_name": "participant",
    "type": "table"
  },
  {
    "schema_name": "chat",
    "table_name": "room",
    "type": "table"
  },
  {
    "schema_name": "debate",
    "table_name": "ballots",
    "type": "table"
  },
  {
    "schema_name": "debate",
    "table_name": "criteria",
    "type": "table"
  },
  {
    "schema_name": "debate",
    "table_name": "debate_formats",
    "type": "table"
  },
  {
    "schema_name": "debate",
    "table_name": "debate_participants",
    "type": "table"
  },
  {
    "schema_name": "debate",
    "table_name": "debate_teams",
    "type": "table"
  },
  {
    "schema_name": "debate",
    "table_name": "debates",
    "type": "table"
  },
  {
    "schema_name": "debate",
    "table_name": "format_rounds",
    "type": "table"
  },
  {
    "schema_name": "debate",
    "table_name": "genres",
    "type": "table"
  },
  {
    "schema_name": "debate",
    "table_name": "judge_comments",
    "type": "table"
  },
  {
    "schema_name": "debate",
    "table_name": "judge_scores",
    "type": "table"
  },
  {
    "schema_name": "debate",
    "table_name": "matchmaking_queue_entries",
    "type": "table"
  },
  {
    "schema_name": "debate",
    "table_name": "motions",
    "type": "table"
  },
  {
    "schema_name": "debate",
    "table_name": "round_templates",
    "type": "table"
  },
  {
    "schema_name": "debate",
    "table_name": "sides",
    "type": "table"
  },
  {
    "schema_name": "debate",
    "table_name": "speeches",
    "type": "table"
  },
  {
    "schema_name": "debate",
    "table_name": "videos",
    "type": "table"
  },
  {
    "schema_name": "extensions",
    "table_name": "pg_stat_statements",
    "type": "view"
  },
  {
    "schema_name": "extensions",
    "table_name": "pg_stat_statements_info",
    "type": "view"
  },
  {
    "schema_name": "public",
    "table_name": "admin",
    "type": "table"
  },
  {
    "schema_name": "public",
    "table_name": "bank_account",
    "type": "table"
  },
  {
    "schema_name": "public",
    "table_name": "friendship",
    "type": "table"
  },
  {
    "schema_name": "public",
    "table_name": "guardian",
    "type": "table"
  },
  {
    "schema_name": "public",
    "table_name": "guardian_request",
    "type": "table"
  },
  {
    "schema_name": "public",
    "table_name": "guild",
    "type": "table"
  },
  {
    "schema_name": "public",
    "table_name": "guild_member",
    "type": "table"
  },
  {
    "schema_name": "public",
    "table_name": "invitation",
    "type": "table"
  },
  {
    "schema_name": "public",
    "table_name": "judge",
    "type": "table"
  },
  {
    "schema_name": "public",
    "table_name": "log",
    "type": "table"
  },
  {
    "schema_name": "public",
    "table_name": "payment_history",
    "type": "table"
  },
  {
    "schema_name": "public",
    "table_name": "profile",
    "type": "table"
  },
  {
    "schema_name": "public",
    "table_name": "rating",
    "type": "table"
  },
  {
    "schema_name": "public",
    "table_name": "school",
    "type": "table"
  },
  {
    "schema_name": "public",
    "table_name": "student",
    "type": "table"
  },
  {
    "schema_name": "public",
    "table_name": "team",
    "type": "table"
  },
  {
    "schema_name": "public",
    "table_name": "team_member",
    "type": "table"
  },
  {
    "schema_name": "realtime",
    "table_name": "messages_2025_08_18",
    "type": "table"
  },
  {
    "schema_name": "realtime",
    "table_name": "messages_2025_08_19",
    "type": "table"
  },
  {
    "schema_name": "realtime",
    "table_name": "messages_2025_08_20",
    "type": "table"
  },
  {
    "schema_name": "realtime",
    "table_name": "messages_2025_08_21",
    "type": "table"
  },
  {
    "schema_name": "realtime",
    "table_name": "messages_2025_08_22",
    "type": "table"
  },
  {
    "schema_name": "realtime",
    "table_name": "schema_migrations",
    "type": "table"
  },
  {
    "schema_name": "realtime",
    "table_name": "subscription",
    "type": "table"
  },
  {
    "schema_name": "storage",
    "table_name": "buckets",
    "type": "table"
  },
  {
    "schema_name": "storage",
    "table_name": "buckets_analytics",
    "type": "table"
  },
  {
    "schema_name": "storage",
    "table_name": "migrations",
    "type": "table"
  },
  {
    "schema_name": "storage",
    "table_name": "objects",
    "type": "table"
  },
  {
    "schema_name": "storage",
    "table_name": "prefixes",
    "type": "table"
  },
  {
    "schema_name": "storage",
    "table_name": "s3_multipart_uploads",
    "type": "table"
  },
  {
    "schema_name": "storage",
    "table_name": "s3_multipart_uploads_parts",
    "type": "table"
  },
  {
    "schema_name": "supabase_migrations",
    "table_name": "schema_migrations",
    "type": "table"
  },
  {
    "schema_name": "supabase_migrations",
    "table_name": "seed_files",
    "type": "table"
  },
  {
    "schema_name": "vault",
    "table_name": "decrypted_secrets",
    "type": "view"
  },
  {
    "schema_name": "vault",
    "table_name": "secrets",
    "type": "table"
  }
]


## 13

SELECT
  format(
    'CREATE TYPE %I.%I AS ENUM (%s);',
    n.nspname,
    t.typname,
    string_agg(
      quote_literal(e.enumlabel),
      ', ' 
      ORDER BY e.enumsortorder
    )
  ) AS enum_ddl
FROM
  pg_type t
  JOIN pg_enum e ON t.oid = e.enumtypid
  JOIN pg_namespace n ON n.oid = t.typnamespace
WHERE
  n.nspname IN ('public', 'debate')
GROUP BY
  n.nspname, t.typname;


[
  {
    "enum_ddl": "CREATE TYPE debate.criteria_group AS ENUM ('STYLE', 'RESPECT', 'ANALYSIS');"
  },
  {
    "enum_ddl": "CREATE TYPE debate.speech_mode AS ENUM ('SYNC', 'ASYNC');"
  },
  {
    "enum_ddl": "CREATE TYPE public.debate_ballot_status_enum AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETE');"
  },
  {
    "enum_ddl": "CREATE TYPE public.debate_session_status AS ENUM ('SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED');"
  },
  {
    "enum_ddl": "CREATE TYPE public.division AS ENUM ('VILLIGER', 'LOWER', 'UPPER', 'SENIOR', 'OPEN');"
  },
  {
    "enum_ddl": "CREATE TYPE public.gender AS ENUM ('MALE', 'FEMALE', 'do not wish to specify');"
  },
  {
    "enum_ddl": "CREATE TYPE public.group_type AS ENUM ('GUILD', 'TEAM');"
  },
  {
    "enum_ddl": "CREATE TYPE public.log_type AS ENUM ('REQUEST_JOIN', 'JOINED', 'LEFT', 'INVITED', 'KICKED', 'UPDATED', 'DELETED', 'CREATED');"
  },
  {
    "enum_ddl": "CREATE TYPE public.payment_provider AS ENUM ('TOSS', 'NAVER_PAY', 'KAKAO_PAY');"
  },
  {
    "enum_ddl": "CREATE TYPE public.payment_state AS ENUM ('REQUESTED', 'PENDING', 'FAILED', 'COMPLETED', 'AUTHORIZED', 'ABANDONED', 'REFUNDED', 'PREAPPROVED');"
  },
  {
    "enum_ddl": "CREATE TYPE public.status AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'CANCELLED');"
  },
  {
    "enum_ddl": "CREATE TYPE public.user_role_type AS ENUM ('STUDENT', 'JUDGE', 'GUARDIAN');"
  }
]


## 14

SELECT 
   table_schema,
   table_name, 
   column_name, 
   data_type, 
   is_nullable, 
   column_default,
   character_maximum_length
FROM 
   information_schema.columns 
WHERE 
   table_schema IN ('public', 'debate')
ORDER BY 
   table_schema, 
   table_name, 
   ordinal_position;

[
  {
    "table_schema": "debate",
    "table_name": "ballots",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "uuid_generate_v4()",
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "ballots",
    "column_name": "debate_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "ballots",
    "column_name": "judge_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "ballots",
    "column_name": "status",
    "data_type": "USER-DEFINED",
    "is_nullable": "YES",
    "column_default": "'PENDING'::debate_ballot_status_enum",
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "ballots",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "CURRENT_TIMESTAMP",
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "ballots",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "CURRENT_TIMESTAMP",
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "ballots",
    "column_name": "submitted_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "ballots",
    "column_name": "format_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "ballots",
    "column_name": "version",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": "1",
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "criteria",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "criteria",
    "column_name": "group",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "criteria",
    "column_name": "name",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "criteria",
    "column_name": "criteria",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "criteria",
    "column_name": "label",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "criteria",
    "column_name": "format_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "debate_formats",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "debate_formats",
    "column_name": "name",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "debate_formats",
    "column_name": "description",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "debate_formats",
    "column_name": "type",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO",
    "column_default": "'SYNC'::debate.speech_mode",
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "debate_participants",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "debate_participants",
    "column_name": "debate_team_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "debate_participants",
    "column_name": "user_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "debate_participants",
    "column_name": "invite_status",
    "data_type": "USER-DEFINED",
    "is_nullable": "YES",
    "column_default": "'PENDING'::status",
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "debate_participants",
    "column_name": "speaker_position",
    "data_type": "smallint",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "debate_teams",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "debate_teams",
    "column_name": "debate_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "debate_teams",
    "column_name": "side_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "debates",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "debates",
    "column_name": "debate_format_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "debates",
    "column_name": "motion_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "debates",
    "column_name": "scheduled_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "debates",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "debates",
    "column_name": "mode",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "format_rounds",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "format_rounds",
    "column_name": "debate_format_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "format_rounds",
    "column_name": "round_template_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "format_rounds",
    "column_name": "sequence",
    "data_type": "integer",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "format_rounds",
    "column_name": "side_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "format_rounds",
    "column_name": "speaker_positions",
    "data_type": "ARRAY",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "format_rounds",
    "column_name": "number_of_speakers",
    "data_type": "smallint",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "genres",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "genres",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "CURRENT_TIMESTAMP",
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "genres",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "CURRENT_TIMESTAMP",
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "genres",
    "column_name": "title",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "genres",
    "column_name": "description",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "genres",
    "column_name": "proposer_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "judge_comments",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "judge_comments",
    "column_name": "video_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "judge_comments",
    "column_name": "judge_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "judge_comments",
    "column_name": "criteria_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "judge_comments",
    "column_name": "at_seconds",
    "data_type": "integer",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "judge_comments",
    "column_name": "comment",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "judge_comments",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "judge_scores",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "judge_scores",
    "column_name": "debate_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "judge_scores",
    "column_name": "judge_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "judge_scores",
    "column_name": "criteria_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "judge_scores",
    "column_name": "score",
    "data_type": "numeric",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "judge_scores",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "matchmaking_queue_entries",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "matchmaking_queue_entries",
    "column_name": "team_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "matchmaking_queue_entries",
    "column_name": "debate_format_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "matchmaking_queue_entries",
    "column_name": "league_id",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "matchmaking_queue_entries",
    "column_name": "team_rank",
    "data_type": "integer",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "matchmaking_queue_entries",
    "column_name": "challenge_mode_active",
    "data_type": "boolean",
    "is_nullable": "NO",
    "column_default": "false",
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "matchmaking_queue_entries",
    "column_name": "status",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "matchmaking_queue_entries",
    "column_name": "queued_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "CURRENT_TIMESTAMP",
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "matchmaking_queue_entries",
    "column_name": "debate_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "matchmaking_queue_entries",
    "column_name": "opponent_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "motions",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "motions",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "CURRENT_TIMESTAMP",
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "motions",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "CURRENT_TIMESTAMP",
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "motions",
    "column_name": "topic",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "motions",
    "column_name": "genre_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "motions",
    "column_name": "details",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "motions",
    "column_name": "proposer_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "round_templates",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "round_templates",
    "column_name": "code",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "round_templates",
    "column_name": "name",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "round_templates",
    "column_name": "default_time",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "round_templates",
    "column_name": "description",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "sides",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "sides",
    "column_name": "title",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "speeches",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "speeches",
    "column_name": "debate_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "speeches",
    "column_name": "format_round_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "speeches",
    "column_name": "participant_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "speeches",
    "column_name": "content",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "speeches",
    "column_name": "delivered_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "speeches",
    "column_name": "duration_seconds",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "videos",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "videos",
    "column_name": "debate_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "videos",
    "column_name": "storage_path",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "videos",
    "column_name": "url",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "videos",
    "column_name": "uploaded_by",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "debate",
    "table_name": "videos",
    "column_name": "uploaded_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "admin",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "uuid_generate_v4()",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "admin",
    "column_name": "user_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "admin",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "CURRENT_TIMESTAMP",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "admin",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "CURRENT_TIMESTAMP",
    "character_maximum_length": null
  }
]


## 15

SELECT 
   event_object_schema,
   event_object_table,
   trigger_name,
   action_timing,
   event_manipulation,
   action_statement
FROM 
   information_schema.triggers
WHERE 
   event_object_schema IN ('public', 'debate')
ORDER BY 
   event_object_schema,
   event_object_table;

[
  {
    "event_object_schema": "public",
    "event_object_table": "friendship",
    "trigger_name": "trg_cleanup_friendship_status",
    "action_timing": "AFTER",
    "event_manipulation": "INSERT",
    "action_statement": "EXECUTE FUNCTION delete_invalid_friendship()"
  },
  {
    "event_object_schema": "public",
    "event_object_table": "friendship",
    "trigger_name": "check_friendship_update_allowed_columns_trigger",
    "action_timing": "BEFORE",
    "event_manipulation": "UPDATE",
    "action_statement": "EXECUTE FUNCTION check_friendship_update_allowed_columns()"
  },
  {
    "event_object_schema": "public",
    "event_object_table": "friendship",
    "trigger_name": "trg_cleanup_friendship_status",
    "action_timing": "AFTER",
    "event_manipulation": "UPDATE",
    "action_statement": "EXECUTE FUNCTION delete_invalid_friendship()"
  },
  {
    "event_object_schema": "public",
    "event_object_table": "guild",
    "trigger_name": "trg_guild_create_room",
    "action_timing": "AFTER",
    "event_manipulation": "INSERT",
    "action_statement": "EXECUTE FUNCTION chat.fn_create_guild_room()"
  },
  {
    "event_object_schema": "public",
    "event_object_table": "guild",
    "trigger_name": "trg_guild_update_room_title",
    "action_timing": "AFTER",
    "event_manipulation": "UPDATE",
    "action_statement": "EXECUTE FUNCTION chat.fn_sync_guild_room_title()"
  },
  {
    "event_object_schema": "public",
    "event_object_table": "guild_member",
    "trigger_name": "trg_guild_member_add_participant",
    "action_timing": "AFTER",
    "event_manipulation": "UPDATE",
    "action_statement": "EXECUTE FUNCTION chat.fn_add_guild_member_to_room()"
  },
  {
    "event_object_schema": "public",
    "event_object_table": "guild_member",
    "trigger_name": "trg_guild_member_add_participant",
    "action_timing": "AFTER",
    "event_manipulation": "INSERT",
    "action_statement": "EXECUTE FUNCTION chat.fn_add_guild_member_to_room()"
  },
  {
    "event_object_schema": "public",
    "event_object_table": "student",
    "trigger_name": "check_insert_allowed_columns_trigger",
    "action_timing": "BEFORE",
    "event_manipulation": "INSERT",
    "action_statement": "EXECUTE FUNCTION check_insert_allowed_columns()"
  },
  {
    "event_object_schema": "public",
    "event_object_table": "student",
    "trigger_name": "trg_set_division",
    "action_timing": "BEFORE",
    "event_manipulation": "INSERT",
    "action_statement": "EXECUTE FUNCTION set_division()"
  },
  {
    "event_object_schema": "public",
    "event_object_table": "student",
    "trigger_name": "trg_set_division",
    "action_timing": "BEFORE",
    "event_manipulation": "UPDATE",
    "action_statement": "EXECUTE FUNCTION set_division()"
  },
  {
    "event_object_schema": "public",
    "event_object_table": "student",
    "trigger_name": "check_update_allowed_columns_trigger",
    "action_timing": "BEFORE",
    "event_manipulation": "UPDATE",
    "action_statement": "EXECUTE FUNCTION check_update_allowed_columns()"
  },
  {
    "event_object_schema": "public",
    "event_object_table": "team",
    "trigger_name": "trg_team_create_room",
    "action_timing": "AFTER",
    "event_manipulation": "INSERT",
    "action_statement": "EXECUTE FUNCTION chat.fn_create_team_room()"
  },
  {
    "event_object_schema": "public",
    "event_object_table": "team",
    "trigger_name": "trg_before_update_team",
    "action_timing": "BEFORE",
    "event_manipulation": "UPDATE",
    "action_statement": "EXECUTE FUNCTION check_team_update_leader()"
  },
  {
    "event_object_schema": "public",
    "event_object_table": "team",
    "trigger_name": "trg_team_update_room_title",
    "action_timing": "AFTER",
    "event_manipulation": "UPDATE",
    "action_statement": "EXECUTE FUNCTION chat.fn_sync_team_room_title()"
  },
  {
    "event_object_schema": "public",
    "event_object_table": "team_member",
    "trigger_name": "trg_team_member_add_participant",
    "action_timing": "AFTER",
    "event_manipulation": "UPDATE",
    "action_statement": "EXECUTE FUNCTION chat.fn_add_team_member_to_room()"
  },
  {
    "event_object_schema": "public",
    "event_object_table": "team_member",
    "trigger_name": "trg_before_delete_team_member",
    "action_timing": "BEFORE",
    "event_manipulation": "DELETE",
    "action_statement": "EXECUTE FUNCTION check_team_member_delete()"
  },
  {
    "event_object_schema": "public",
    "event_object_table": "team_member",
    "trigger_name": "trg_after_delete_team_member",
    "action_timing": "AFTER",
    "event_manipulation": "DELETE",
    "action_statement": "EXECUTE FUNCTION delete_empty_team_after_member_delete()"
  },
  {
    "event_object_schema": "public",
    "event_object_table": "team_member",
    "trigger_name": "trg_team_member_add_participant",
    "action_timing": "AFTER",
    "event_manipulation": "INSERT",
    "action_statement": "EXECUTE FUNCTION chat.fn_add_team_member_to_room()"
  }
]

## 16

SELECT 
  t.table_name,
  c.column_name, 
  c.data_type,
  c.is_nullable,
  c.column_default
FROM 
  information_schema.tables t
JOIN 
  information_schema.columns c ON t.table_name = c.table_name
WHERE 
  t.table_schema = 'public'
ORDER BY 
  t.table_name, 
  c.ordinal_position;

[
  {
    "table_name": "admin",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "uuid_generate_v4()"
  },
  {
    "table_name": "admin",
    "column_name": "user_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "admin",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "CURRENT_TIMESTAMP"
  },
  {
    "table_name": "admin",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "CURRENT_TIMESTAMP"
  },
  {
    "table_name": "bank_account",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_name": "bank_account",
    "column_name": "active",
    "data_type": "boolean",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "bank_account",
    "column_name": "guardian_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "bank_account",
    "column_name": "name",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "bank_account",
    "column_name": "routing",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "bank_account",
    "column_name": "swift_code",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "bank_account",
    "column_name": "i_b_a_n",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "friendship",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_name": "friendship",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_name": "friendship",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "table_name": "friendship",
    "column_name": "user_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "auth.uid()"
  },
  {
    "table_name": "friendship",
    "column_name": "friend_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "friendship",
    "column_name": "status",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO",
    "column_default": "'PENDING'::status"
  },
  {
    "table_name": "friendship",
    "column_name": "accpted_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "guardian",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_name": "guardian",
    "column_name": "user_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "auth.uid()"
  },
  {
    "table_name": "guardian",
    "column_name": "payment_method",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "guardian",
    "column_name": "billing_address",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "guardian_request",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_name": "guardian_request",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_name": "guardian_request",
    "column_name": "status",
    "data_type": "USER-DEFINED",
    "is_nullable": "YES",
    "column_default": "'PENDING'::status"
  },
  {
    "table_name": "guardian_request",
    "column_name": "updated_at",
    "data_type": "timestamp without time zone",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "guardian_request",
    "column_name": "sender",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "guardian_request",
    "column_name": "reciever",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "guild",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_name": "guild",
    "column_name": "school_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "guild",
    "column_name": "created_at",
    "data_type": "timestamp without time zone",
    "is_nullable": "NO",
    "column_default": "CURRENT_TIMESTAMP"
  },
  {
    "table_name": "guild",
    "column_name": "updated_at",
    "data_type": "timestamp without time zone",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "guild",
    "column_name": "name",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "guild",
    "column_name": "requirement",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "guild",
    "column_name": "division",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "guild",
    "column_name": "image_path",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "guild",
    "column_name": "description",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "guild_member",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_name": "guild_member",
    "column_name": "created_at",
    "data_type": "timestamp without time zone",
    "is_nullable": "NO",
    "column_default": "CURRENT_TIMESTAMP"
  },
  {
    "table_name": "guild_member",
    "column_name": "updated_at",
    "data_type": "timestamp without time zone",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "guild_member",
    "column_name": "student_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "guild_member",
    "column_name": "guild_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "guild_member",
    "column_name": "join_date",
    "data_type": "timestamp without time zone",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "guild_member",
    "column_name": "is_leader",
    "data_type": "boolean",
    "is_nullable": "NO",
    "column_default": "false"
  },
  {
    "table_name": "guild_member",
    "column_name": "status",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO",
    "column_default": "'PENDING'::status"
  },
  {
    "table_name": "invitation",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_name": "invitation",
    "column_name": "created_at",
    "data_type": "timestamp without time zone",
    "is_nullable": "NO",
    "column_default": "CURRENT_TIMESTAMP"
  },
  {
    "table_name": "invitation",
    "column_name": "updated_at",
    "data_type": "timestamp without time zone",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "invitation",
    "column_name": "accepted_at",
    "data_type": "timestamp without time zone",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "invitation",
    "column_name": "inviter_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "invitation",
    "column_name": "invitee_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "invitation",
    "column_name": "team_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "invitation",
    "column_name": "guild_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "invitation",
    "column_name": "status",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO",
    "column_default": "'PENDING'::status"
  },
  {
    "table_name": "invitation",
    "column_name": "expires_at",
    "data_type": "timestamp without time zone",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "invitation",
    "column_name": "type",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "judge",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_name": "judge",
    "column_name": "user_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "auth.uid()"
  },
  {
    "table_name": "judge",
    "column_name": "job_title",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "judge",
    "column_name": "biography",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "judge",
    "column_name": "bank_account_info",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "judge",
    "column_name": "referral_user_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "log",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_name": "log",
    "column_name": "created_at",
    "data_type": "timestamp without time zone",
    "is_nullable": "NO",
    "column_default": "CURRENT_TIMESTAMP"
  },
  {
    "table_name": "log",
    "column_name": "log_type",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "log",
    "column_name": "description",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "log",
    "column_name": "guild_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "log",
    "column_name": "team_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "log",
    "column_name": "student_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "log",
    "column_name": "type",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "payment_history",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_name": "payment_history",
    "column_name": "guardian_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "payment_history",
    "column_name": "amount",
    "data_type": "integer",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "payment_history",
    "column_name": "currency_code",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "payment_history",
    "column_name": "payment_provider",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "payment_history",
    "column_name": "payment_date",
    "data_type": "timestamp without time zone",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "payment_history",
    "column_name": "payment_state",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "profile",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "auth.uid()"
  },
  {
    "table_name": "profile",
    "column_name": "name",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": "''::text"
  },
  {
    "table_name": "profile",
    "column_name": "username",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "profile",
    "column_name": "image_path",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "profile",
    "column_name": "date_of_birth",
    "data_type": "date",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "profile",
    "column_name": "gender",
    "data_type": "USER-DEFINED",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "profile",
    "column_name": "user_role",
    "data_type": "USER-DEFINED",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "profile",
    "column_name": "active",
    "data_type": "boolean",
    "is_nullable": "NO",
    "column_default": "false"
  },
  {
    "table_name": "profile",
    "column_name": "term_agree_time",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "profile",
    "column_name": "email",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": "''::text"
  },
  {
    "table_name": "profile",
    "column_name": "invited",
    "data_type": "boolean",
    "is_nullable": "NO",
    "column_default": "false"
  },
  {
    "table_name": "rating",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_name": "rating",
    "column_name": "created_at",
    "data_type": "timestamp without time zone",
    "is_nullable": "NO",
    "column_default": "CURRENT_TIMESTAMP"
  },
  {
    "table_name": "rating",
    "column_name": "rate",
    "data_type": "integer",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "rating",
    "column_name": "judge_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "rating",
    "column_name": "rater_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "school",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_name": "school",
    "column_name": "name",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "school",
    "column_name": "created_at",
    "data_type": "timestamp without time zone",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_name": "school",
    "column_name": "updated_at",
    "data_type": "timestamp without time zone",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_name": "school",
    "column_name": "created_by",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "auth.uid()"
  },
  {
    "table_name": "student",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_name": "student",
    "column_name": "user_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "auth.uid()"
  }
]


## 17

SELECT
    tc.table_schema, 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
JOIN 
    information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN 
    information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE 
    tc.constraint_type = 'FOREIGN KEY';

[
  {
    "table_schema": "storage",
    "constraint_name": "objects_bucketId_fkey",
    "table_name": "objects",
    "column_name": "bucket_id",
    "foreign_table_schema": "storage",
    "foreign_table_name": "buckets",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "matchmaking_queue_entries_debate_format_id_fkey",
    "table_name": "matchmaking_queue_entries",
    "column_name": "debate_format_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "debate_formats",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "matchmaking_queue_entries_debate_id_fkey",
    "table_name": "matchmaking_queue_entries",
    "column_name": "debate_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "debates",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "criteria_format_id_fkey",
    "table_name": "criteria",
    "column_name": "format_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "debate_formats",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "guardian_request_sender_fkey",
    "table_name": "guardian_request",
    "column_name": "sender",
    "foreign_table_schema": "public",
    "foreign_table_name": "profile",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "guardian_request_reciever_fkey",
    "table_name": "guardian_request",
    "column_name": "reciever",
    "foreign_table_schema": "public",
    "foreign_table_name": "profile",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "motions_genre_id_fkey",
    "table_name": "motions",
    "column_name": "genre_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "genres",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "Student_guardianId_fkey",
    "table_name": "student",
    "column_name": "guardian_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "guardian",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "Student_schoolId_fkey",
    "table_name": "student",
    "column_name": "school_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "school",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "Judge_referralUserId_fkey",
    "table_name": "judge",
    "column_name": "referral_user_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "profile",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "Judge_userId_fkey",
    "table_name": "judge",
    "column_name": "user_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "profile",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "Rating_judgeId_fkey",
    "table_name": "rating",
    "column_name": "judge_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "judge",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "Rating_raterId_fkey",
    "table_name": "rating",
    "column_name": "rater_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "student",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "Guardian_userId_fkey",
    "table_name": "guardian",
    "column_name": "user_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "profile",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "BankAccount_guardianId_fkey",
    "table_name": "bank_account",
    "column_name": "guardian_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "guardian",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "PaymentHistory_guardianId_fkey",
    "table_name": "payment_history",
    "column_name": "guardian_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "guardian",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "Guild_schoolId_fkey",
    "table_name": "guild",
    "column_name": "school_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "school",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "GuildMember_guildId_fkey",
    "table_name": "guild_member",
    "column_name": "guild_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "guild",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "GuildMember_studentId_fkey",
    "table_name": "guild_member",
    "column_name": "student_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "student",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "TeamMember_teamId_fkey",
    "table_name": "team_member",
    "column_name": "team_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "team",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "Invitation_guildId_fkey",
    "table_name": "invitation",
    "column_name": "guild_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "guild",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "Invitation_inviteeId_fkey",
    "table_name": "invitation",
    "column_name": "invitee_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "profile",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "Invitation_inviterId_fkey",
    "table_name": "invitation",
    "column_name": "inviter_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "profile",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "Invitation_teamId_fkey",
    "table_name": "invitation",
    "column_name": "team_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "team",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "Log_guildId_fkey",
    "table_name": "log",
    "column_name": "guild_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "guild",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "Log_studentId_fkey",
    "table_name": "log",
    "column_name": "student_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "student",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "Log_teamId_fkey",
    "table_name": "log",
    "column_name": "team_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "team",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "format_rounds_debate_format_id_fkey",
    "table_name": "format_rounds",
    "column_name": "debate_format_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "debate_formats",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "format_rounds_round_template_id_fkey",
    "table_name": "format_rounds",
    "column_name": "round_template_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "round_templates",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "format_rounds_side_id_fkey",
    "table_name": "format_rounds",
    "column_name": "side_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "sides",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "debates_debate_format_id_fkey",
    "table_name": "debates",
    "column_name": "debate_format_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "debate_formats",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "debates_motion_id_fkey",
    "table_name": "debates",
    "column_name": "motion_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "motions",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "debate_teams_debate_id_fkey",
    "table_name": "debate_teams",
    "column_name": "debate_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "debates",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "student_user_id_fkey",
    "table_name": "student",
    "column_name": "user_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "profile",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "debate_teams_side_id_fkey",
    "table_name": "debate_teams",
    "column_name": "side_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "sides",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "debate_participants_debate_team_id_fkey",
    "table_name": "debate_participants",
    "column_name": "debate_team_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "debate_teams",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "speeches_debate_id_fkey",
    "table_name": "speeches",
    "column_name": "debate_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "debates",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "speeches_format_round_id_fkey",
    "table_name": "speeches",
    "column_name": "format_round_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "format_rounds",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "speeches_participant_id_fkey",
    "table_name": "speeches",
    "column_name": "participant_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "debate_participants",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "videos_debate_id_fkey",
    "table_name": "videos",
    "column_name": "debate_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "debates",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "judge_comments_video_id_fkey",
    "table_name": "judge_comments",
    "column_name": "video_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "videos",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "judge_comments_criteria_id_fkey",
    "table_name": "judge_comments",
    "column_name": "criteria_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "criteria",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "judge_scores_debate_id_fkey",
    "table_name": "judge_scores",
    "column_name": "debate_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "debates",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "judge_scores_criteria_id_fkey",
    "table_name": "judge_scores",
    "column_name": "criteria_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "criteria",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "ballots_debate_id_fkey",
    "table_name": "ballots",
    "column_name": "debate_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "debates",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "ballots_format_id_fkey",
    "table_name": "ballots",
    "column_name": "format_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "debate_formats",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "team_member_student_id_fkey1",
    "table_name": "team_member",
    "column_name": "student_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "profile",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "public",
    "constraint_name": "friendship_user_id_fkey",
    "table_name": "friendship",
    "column_name": "user_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "student",
    "foreign_column_name": "user_id"
  },
  {
    "table_schema": "public",
    "constraint_name": "friendship_friend_id_fkey",
    "table_name": "friendship",
    "column_name": "friend_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "student",
    "foreign_column_name": "user_id"
  },
  {
    "table_schema": "auth",
    "constraint_name": "identities_user_id_fkey",
    "table_name": "identities",
    "column_name": "user_id",
    "foreign_table_schema": "auth",
    "foreign_table_name": "users",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "chat",
    "constraint_name": "participant_room_id_fkey",
    "table_name": "participant",
    "column_name": "room_id",
    "foreign_table_schema": "chat",
    "foreign_table_name": "room",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "auth",
    "constraint_name": "sessions_user_id_fkey",
    "table_name": "sessions",
    "column_name": "user_id",
    "foreign_table_schema": "auth",
    "foreign_table_name": "users",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "auth",
    "constraint_name": "refresh_tokens_session_id_fkey",
    "table_name": "refresh_tokens",
    "column_name": "session_id",
    "foreign_table_schema": "auth",
    "foreign_table_name": "sessions",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "auth",
    "constraint_name": "mfa_factors_user_id_fkey",
    "table_name": "mfa_factors",
    "column_name": "user_id",
    "foreign_table_schema": "auth",
    "foreign_table_name": "users",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "auth",
    "constraint_name": "mfa_challenges_auth_factor_id_fkey",
    "table_name": "mfa_challenges",
    "column_name": "factor_id",
    "foreign_table_schema": "auth",
    "foreign_table_name": "mfa_factors",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "auth",
    "constraint_name": "mfa_amr_claims_session_id_fkey",
    "table_name": "mfa_amr_claims",
    "column_name": "session_id",
    "foreign_table_schema": "auth",
    "foreign_table_name": "sessions",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "auth",
    "constraint_name": "sso_domains_sso_provider_id_fkey",
    "table_name": "sso_domains",
    "column_name": "sso_provider_id",
    "foreign_table_schema": "auth",
    "foreign_table_name": "sso_providers",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "auth",
    "constraint_name": "saml_providers_sso_provider_id_fkey",
    "table_name": "saml_providers",
    "column_name": "sso_provider_id",
    "foreign_table_schema": "auth",
    "foreign_table_name": "sso_providers",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "auth",
    "constraint_name": "saml_relay_states_sso_provider_id_fkey",
    "table_name": "saml_relay_states",
    "column_name": "sso_provider_id",
    "foreign_table_schema": "auth",
    "foreign_table_name": "sso_providers",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "chat",
    "constraint_name": "message_room_id_fkey",
    "table_name": "message",
    "column_name": "room_id",
    "foreign_table_schema": "chat",
    "foreign_table_name": "room",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "auth",
    "constraint_name": "saml_relay_states_flow_state_id_fkey",
    "table_name": "saml_relay_states",
    "column_name": "flow_state_id",
    "foreign_table_schema": "auth",
    "foreign_table_name": "flow_state",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "auth",
    "constraint_name": "one_time_tokens_user_id_fkey",
    "table_name": "one_time_tokens",
    "column_name": "user_id",
    "foreign_table_schema": "auth",
    "foreign_table_name": "users",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "storage",
    "constraint_name": "s3_multipart_uploads_bucket_id_fkey",
    "table_name": "s3_multipart_uploads",
    "column_name": "bucket_id",
    "foreign_table_schema": "storage",
    "foreign_table_name": "buckets",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "storage",
    "constraint_name": "s3_multipart_uploads_parts_upload_id_fkey",
    "table_name": "s3_multipart_uploads_parts",
    "column_name": "upload_id",
    "foreign_table_schema": "storage",
    "foreign_table_name": "s3_multipart_uploads",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "storage",
    "constraint_name": "s3_multipart_uploads_parts_bucket_id_fkey",
    "table_name": "s3_multipart_uploads_parts",
    "column_name": "bucket_id",
    "foreign_table_schema": "storage",
    "foreign_table_name": "buckets",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "storage",
    "constraint_name": "prefixes_bucketId_fkey",
    "table_name": "prefixes",
    "column_name": "bucket_id",
    "foreign_table_schema": "storage",
    "foreign_table_name": "buckets",
    "foreign_column_name": "id"
  }
]


## 18

SELECT * FROM pg_tables 
WHERE schemaname = 'auth' 
LIMIT 30;

[
  {
    "schemaname": "auth",
    "tablename": "schema_migrations",
    "tableowner": "supabase_auth_admin",
    "tablespace": null,
    "hasindexes": true,
    "hasrules": false,
    "hastriggers": false,
    "rowsecurity": true
  },
  {
    "schemaname": "auth",
    "tablename": "instances",
    "tableowner": "supabase_auth_admin",
    "tablespace": null,
    "hasindexes": true,
    "hasrules": false,
    "hastriggers": false,
    "rowsecurity": true
  },
  {
    "schemaname": "auth",
    "tablename": "users",
    "tableowner": "supabase_auth_admin",
    "tablespace": null,
    "hasindexes": true,
    "hasrules": false,
    "hastriggers": true,
    "rowsecurity": true
  },
  {
    "schemaname": "auth",
    "tablename": "refresh_tokens",
    "tableowner": "supabase_auth_admin",
    "tablespace": null,
    "hasindexes": true,
    "hasrules": false,
    "hastriggers": true,
    "rowsecurity": true
  },
  {
    "schemaname": "auth",
    "tablename": "mfa_factors",
    "tableowner": "supabase_auth_admin",
    "tablespace": null,
    "hasindexes": true,
    "hasrules": false,
    "hastriggers": true,
    "rowsecurity": true
  },
  {
    "schemaname": "auth",
    "tablename": "mfa_challenges",
    "tableowner": "supabase_auth_admin",
    "tablespace": null,
    "hasindexes": true,
    "hasrules": false,
    "hastriggers": true,
    "rowsecurity": true
  },
  {
    "schemaname": "auth",
    "tablename": "audit_log_entries",
    "tableowner": "supabase_auth_admin",
    "tablespace": null,
    "hasindexes": true,
    "hasrules": false,
    "hastriggers": false,
    "rowsecurity": true
  },
  {
    "schemaname": "auth",
    "tablename": "sessions",
    "tableowner": "supabase_auth_admin",
    "tablespace": null,
    "hasindexes": true,
    "hasrules": false,
    "hastriggers": true,
    "rowsecurity": true
  },
  {
    "schemaname": "auth",
    "tablename": "identities",
    "tableowner": "supabase_auth_admin",
    "tablespace": null,
    "hasindexes": true,
    "hasrules": false,
    "hastriggers": true,
    "rowsecurity": true
  },
  {
    "schemaname": "auth",
    "tablename": "sso_providers",
    "tableowner": "supabase_auth_admin",
    "tablespace": null,
    "hasindexes": true,
    "hasrules": false,
    "hastriggers": true,
    "rowsecurity": true
  },
  {
    "schemaname": "auth",
    "tablename": "sso_domains",
    "tableowner": "supabase_auth_admin",
    "tablespace": null,
    "hasindexes": true,
    "hasrules": false,
    "hastriggers": true,
    "rowsecurity": true
  },
  {
    "schemaname": "auth",
    "tablename": "saml_relay_states",
    "tableowner": "supabase_auth_admin",
    "tablespace": null,
    "hasindexes": true,
    "hasrules": false,
    "hastriggers": true,
    "rowsecurity": true
  },
  {
    "schemaname": "auth",
    "tablename": "mfa_amr_claims",
    "tableowner": "supabase_auth_admin",
    "tablespace": null,
    "hasindexes": true,
    "hasrules": false,
    "hastriggers": true,
    "rowsecurity": true
  },
  {
    "schemaname": "auth",
    "tablename": "saml_providers",
    "tableowner": "supabase_auth_admin",
    "tablespace": null,
    "hasindexes": true,
    "hasrules": false,
    "hastriggers": true,
    "rowsecurity": true
  },
  {
    "schemaname": "auth",
    "tablename": "flow_state",
    "tableowner": "supabase_auth_admin",
    "tablespace": null,
    "hasindexes": true,
    "hasrules": false,
    "hastriggers": true,
    "rowsecurity": true
  },
  {
    "schemaname": "auth",
    "tablename": "one_time_tokens",
    "tableowner": "supabase_auth_admin",
    "tablespace": null,
    "hasindexes": true,
    "hasrules": false,
    "hastriggers": true,
    "rowsecurity": true
  }
]


## 19


SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

[
  {
    "table_name": "admin"
  },
  {
    "table_name": "bank_account"
  },
  {
    "table_name": "friendship"
  },
  {
    "table_name": "guardian"
  },
  {
    "table_name": "guardian_request"
  },
  {
    "table_name": "guild"
  },
  {
    "table_name": "guild_member"
  },
  {
    "table_name": "invitation"
  },
  {
    "table_name": "judge"
  },
  {
    "table_name": "log"
  },
  {
    "table_name": "payment_history"
  },
  {
    "table_name": "profile"
  },
  {
    "table_name": "rating"
  },
  {
    "table_name": "school"
  },
  {
    "table_name": "student"
  },
  {
    "table_name": "team"
  },
  {
    "table_name": "team_member"
  }
]


## 20

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'friendship'  -- Or other relevant tables
ORDER BY ordinal_position;


[
  {
    "column_name": "id",
    "data_type": "uuid"
  },
  {
    "column_name": "created_at",
    "data_type": "timestamp with time zone"
  },
  {
    "column_name": "updated_at",
    "data_type": "timestamp with time zone"
  },
  {
    "column_name": "user_id",
    "data_type": "uuid"
  },
  {
    "column_name": "friend_id",
    "data_type": "uuid"
  },
  {
    "column_name": "status",
    "data_type": "USER-DEFINED"
  },
  {
    "column_name": "accpted_at",
    "data_type": "timestamp with time zone"
  }
]

## 21

SELECT schema_name 
FROM information_schema.schemata;

[
  {
    "schema_name": "pg_toast"
  },
  {
    "schema_name": "pg_catalog"
  },
  {
    "schema_name": "pg_temp_25"
  },
  {
    "schema_name": "information_schema"
  },
  {
    "schema_name": "pg_toast_temp_25"
  },
  {
    "schema_name": "pgbouncer"
  },
  {
    "schema_name": "pg_temp_28"
  },
  {
    "schema_name": "realtime"
  },
  {
    "schema_name": "extensions"
  },
  {
    "schema_name": "storage"
  },
  {
    "schema_name": "auth"
  },
  {
    "schema_name": "pg_toast_temp_28"
  },
  {
    "schema_name": "pg_temp_9"
  },
  {
    "schema_name": "vault"
  },
  {
    "schema_name": "pg_toast_temp_9"
  },
  {
    "schema_name": "graphql_public"
  },
  {
    "schema_name": "graphql"
  },
  {
    "schema_name": "pg_temp_11"
  },
  {
    "schema_name": "pg_toast_temp_11"
  },
  {
    "schema_name": "pg_temp_8"
  },
  {
    "schema_name": "pg_toast_temp_8"
  },
  {
    "schema_name": "pg_temp_14"
  },
  {
    "schema_name": "pg_temp_24"
  },
  {
    "schema_name": "pg_toast_temp_14"
  },
  {
    "schema_name": "public"
  },
  {
    "schema_name": "pg_temp_10"
  },
  {
    "schema_name": "pg_toast_temp_10"
  },
  {
    "schema_name": "pg_temp_15"
  },
  {
    "schema_name": "pg_toast_temp_15"
  },
  {
    "schema_name": "pg_temp_16"
  },
  {
    "schema_name": "pg_toast_temp_16"
  },
  {
    "schema_name": "pg_temp_17"
  },
  {
    "schema_name": "pg_toast_temp_17"
  },
  {
    "schema_name": "pg_temp_13"
  },
  {
    "schema_name": "pg_toast_temp_13"
  },
  {
    "schema_name": "pg_temp_20"
  },
  {
    "schema_name": "pg_toast_temp_20"
  },
  {
    "schema_name": "pg_temp_19"
  },
  {
    "schema_name": "pg_toast_temp_19"
  },
  {
    "schema_name": "pg_temp_18"
  },
  {
    "schema_name": "pg_toast_temp_18"
  },
  {
    "schema_name": "pg_temp_22"
  },
  {
    "schema_name": "pg_toast_temp_22"
  },
  {
    "schema_name": "pg_temp_21"
  },
  {
    "schema_name": "pg_toast_temp_21"
  },
  {
    "schema_name": "pg_temp_23"
  },
  {
    "schema_name": "pg_toast_temp_23"
  },
  {
    "schema_name": "pg_toast_temp_24"
  },
  {
    "schema_name": "pg_temp_31"
  },
  {
    "schema_name": "pg_toast_temp_31"
  },
  {
    "schema_name": "pg_temp_30"
  },
  {
    "schema_name": "pg_toast_temp_30"
  },
  {
    "schema_name": "pg_temp_27"
  },
  {
    "schema_name": "pg_toast_temp_27"
  },
  {
    "schema_name": "pg_temp_29"
  },
  {
    "schema_name": "pg_toast_temp_29"
  },
  {
    "schema_name": "pg_temp_34"
  },
  {
    "schema_name": "pg_toast_temp_34"
  },
  {
    "schema_name": "pg_temp_26"
  },
  {
    "schema_name": "pg_toast_temp_26"
  },
  {
    "schema_name": "pg_temp_33"
  },
  {
    "schema_name": "pg_toast_temp_33"
  },
  {
    "schema_name": "pg_temp_7"
  },
  {
    "schema_name": "pg_toast_temp_7"
  },
  {
    "schema_name": "pg_temp_32"
  },
  {
    "schema_name": "pg_toast_temp_32"
  },
  {
    "schema_name": "pg_temp_35"
  },
  {
    "schema_name": "pg_toast_temp_35"
  },
  {
    "schema_name": "pg_temp_37"
  },
  {
    "schema_name": "pg_toast_temp_37"
  },
  {
    "schema_name": "pg_temp_12"
  },
  {
    "schema_name": "pg_toast_temp_12"
  },
  {
    "schema_name": "supabase_migrations"
  },
  {
    "schema_name": "pg_temp_36"
  },
  {
    "schema_name": "pg_toast_temp_36"
  },
  {
    "schema_name": "pg_temp_38"
  },
  {
    "schema_name": "pg_toast_temp_38"
  },
  {
    "schema_name": "debate"
  },
  {
    "schema_name": "chat"
  }
]


## 22

SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'debate';

[
  {
    "table_name": "genres"
  },
  {
    "table_name": "motions"
  },
  {
    "table_name": "sides"
  },
  {
    "table_name": "format_rounds"
  },
  {
    "table_name": "debate_formats"
  },
  {
    "table_name": "round_templates"
  },
  {
    "table_name": "debates"
  },
  {
    "table_name": "debate_teams"
  },
  {
    "table_name": "videos"
  },
  {
    "table_name": "judge_comments"
  },
  {
    "table_name": "criteria"
  },
  {
    "table_name": "judge_scores"
  },
  {
    "table_name": "ballots"
  },
  {
    "table_name": "matchmaking_queue_entries"
  },
  {
    "table_name": "debate_participants"
  },
  {
    "table_name": "speeches"
  }
]


## 23

SELECT 
  table_name,
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM 
  information_schema.columns 
WHERE 
  table_schema = 'debate'
ORDER BY 
  table_name, 
  ordinal_position;


[
  {
    "table_name": "ballots",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "uuid_generate_v4()"
  },
  {
    "table_name": "ballots",
    "column_name": "debate_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "ballots",
    "column_name": "judge_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "ballots",
    "column_name": "status",
    "data_type": "USER-DEFINED",
    "is_nullable": "YES",
    "column_default": "'PENDING'::debate_ballot_status_enum"
  },
  {
    "table_name": "ballots",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "CURRENT_TIMESTAMP"
  },
  {
    "table_name": "ballots",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "CURRENT_TIMESTAMP"
  },
  {
    "table_name": "ballots",
    "column_name": "submitted_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "ballots",
    "column_name": "format_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "ballots",
    "column_name": "version",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": "1"
  },
  {
    "table_name": "criteria",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_name": "criteria",
    "column_name": "group",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "criteria",
    "column_name": "name",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "criteria",
    "column_name": "criteria",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "criteria",
    "column_name": "label",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "criteria",
    "column_name": "format_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "debate_formats",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_name": "debate_formats",
    "column_name": "name",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "debate_formats",
    "column_name": "description",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "debate_formats",
    "column_name": "type",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO",
    "column_default": "'SYNC'::debate.speech_mode"
  },
  {
    "table_name": "debate_participants",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_name": "debate_participants",
    "column_name": "debate_team_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "debate_participants",
    "column_name": "user_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "debate_participants",
    "column_name": "invite_status",
    "data_type": "USER-DEFINED",
    "is_nullable": "YES",
    "column_default": "'PENDING'::status"
  },
  {
    "table_name": "debate_participants",
    "column_name": "speaker_position",
    "data_type": "smallint",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "debate_teams",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_name": "debate_teams",
    "column_name": "debate_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "debate_teams",
    "column_name": "side_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "debates",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_name": "debates",
    "column_name": "debate_format_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "debates",
    "column_name": "motion_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "debates",
    "column_name": "scheduled_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "debates",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_name": "debates",
    "column_name": "mode",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "format_rounds",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_name": "format_rounds",
    "column_name": "debate_format_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "format_rounds",
    "column_name": "round_template_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "format_rounds",
    "column_name": "sequence",
    "data_type": "integer",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "format_rounds",
    "column_name": "side_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "format_rounds",
    "column_name": "speaker_positions",
    "data_type": "ARRAY",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "format_rounds",
    "column_name": "number_of_speakers",
    "data_type": "smallint",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "genres",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_name": "genres",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "CURRENT_TIMESTAMP"
  },
  {
    "table_name": "genres",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "CURRENT_TIMESTAMP"
  },
  {
    "table_name": "genres",
    "column_name": "title",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "genres",
    "column_name": "description",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "genres",
    "column_name": "proposer_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "judge_comments",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_name": "judge_comments",
    "column_name": "video_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "judge_comments",
    "column_name": "judge_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "judge_comments",
    "column_name": "criteria_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "judge_comments",
    "column_name": "at_seconds",
    "data_type": "integer",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "judge_comments",
    "column_name": "comment",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "judge_comments",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_name": "judge_scores",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_name": "judge_scores",
    "column_name": "debate_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "judge_scores",
    "column_name": "judge_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "judge_scores",
    "column_name": "criteria_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "judge_scores",
    "column_name": "score",
    "data_type": "numeric",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "judge_scores",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_name": "matchmaking_queue_entries",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_name": "matchmaking_queue_entries",
    "column_name": "team_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "matchmaking_queue_entries",
    "column_name": "debate_format_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "matchmaking_queue_entries",
    "column_name": "league_id",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "matchmaking_queue_entries",
    "column_name": "team_rank",
    "data_type": "integer",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "matchmaking_queue_entries",
    "column_name": "challenge_mode_active",
    "data_type": "boolean",
    "is_nullable": "NO",
    "column_default": "false"
  },
  {
    "table_name": "matchmaking_queue_entries",
    "column_name": "status",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "matchmaking_queue_entries",
    "column_name": "queued_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "CURRENT_TIMESTAMP"
  },
  {
    "table_name": "matchmaking_queue_entries",
    "column_name": "debate_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "matchmaking_queue_entries",
    "column_name": "opponent_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "motions",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_name": "motions",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "CURRENT_TIMESTAMP"
  },
  {
    "table_name": "motions",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "CURRENT_TIMESTAMP"
  },
  {
    "table_name": "motions",
    "column_name": "topic",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "motions",
    "column_name": "genre_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "motions",
    "column_name": "details",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "motions",
    "column_name": "proposer_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "round_templates",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_name": "round_templates",
    "column_name": "code",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "round_templates",
    "column_name": "name",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "round_templates",
    "column_name": "default_time",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "round_templates",
    "column_name": "description",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "sides",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_name": "sides",
    "column_name": "title",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "speeches",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_name": "speeches",
    "column_name": "debate_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "speeches",
    "column_name": "format_round_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "speeches",
    "column_name": "participant_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "speeches",
    "column_name": "content",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "speeches",
    "column_name": "delivered_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "table_name": "speeches",
    "column_name": "duration_seconds",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "videos",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_name": "videos",
    "column_name": "debate_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "videos",
    "column_name": "storage_path",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "videos",
    "column_name": "url",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "videos",
    "column_name": "uploaded_by",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "videos",
    "column_name": "uploaded_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()"
  }
]


## 24

SELECT
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
JOIN 
    information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN 
    information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE 
    tc.constraint_type = 'FOREIGN KEY' AND
    tc.table_schema = 'debate';

[
  {
    "constraint_name": "genres_proposer_id_fkey",
    "table_name": "genres",
    "column_name": "proposer_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "profile",
    "foreign_column_name": "id"
  },
  {
    "constraint_name": "motions_genre_id_fkey",
    "table_name": "motions",
    "column_name": "genre_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "genres",
    "foreign_column_name": "id"
  },
  {
    "constraint_name": "motions_proposer_id_fkey",
    "table_name": "motions",
    "column_name": "proposer_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "profile",
    "foreign_column_name": "id"
  },
  {
    "constraint_name": "debates_debate_format_id_fkey",
    "table_name": "debates",
    "column_name": "debate_format_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "debate_formats",
    "foreign_column_name": "id"
  },
  {
    "constraint_name": "debates_motion_id_fkey",
    "table_name": "debates",
    "column_name": "motion_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "motions",
    "foreign_column_name": "id"
  },
  {
    "constraint_name": "format_rounds_debate_format_id_fkey",
    "table_name": "format_rounds",
    "column_name": "debate_format_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "debate_formats",
    "foreign_column_name": "id"
  },
  {
    "constraint_name": "format_rounds_round_template_id_fkey",
    "table_name": "format_rounds",
    "column_name": "round_template_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "round_templates",
    "foreign_column_name": "id"
  },
  {
    "constraint_name": "format_rounds_side_id_fkey",
    "table_name": "format_rounds",
    "column_name": "side_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "sides",
    "foreign_column_name": "id"
  },
  {
    "constraint_name": "debate_teams_debate_id_fkey",
    "table_name": "debate_teams",
    "column_name": "debate_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "debates",
    "foreign_column_name": "id"
  },
  {
    "constraint_name": "debate_teams_side_id_fkey",
    "table_name": "debate_teams",
    "column_name": "side_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "sides",
    "foreign_column_name": "id"
  },
  {
    "constraint_name": "videos_debate_id_fkey",
    "table_name": "videos",
    "column_name": "debate_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "debates",
    "foreign_column_name": "id"
  },
  {
    "constraint_name": "videos_uploaded_by_fkey",
    "table_name": "videos",
    "column_name": "uploaded_by",
    "foreign_table_schema": "public",
    "foreign_table_name": "profile",
    "foreign_column_name": "id"
  },
  {
    "constraint_name": "judge_comments_criteria_id_fkey",
    "table_name": "judge_comments",
    "column_name": "criteria_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "criteria",
    "foreign_column_name": "id"
  },
  {
    "constraint_name": "judge_comments_judge_id_fkey",
    "table_name": "judge_comments",
    "column_name": "judge_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "judge",
    "foreign_column_name": "user_id"
  },
  {
    "constraint_name": "judge_comments_video_id_fkey",
    "table_name": "judge_comments",
    "column_name": "video_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "videos",
    "foreign_column_name": "id"
  },
  {
    "constraint_name": "judge_scores_criteria_id_fkey",
    "table_name": "judge_scores",
    "column_name": "criteria_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "criteria",
    "foreign_column_name": "id"
  },
  {
    "constraint_name": "judge_scores_debate_id_fkey",
    "table_name": "judge_scores",
    "column_name": "debate_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "debates",
    "foreign_column_name": "id"
  },
  {
    "constraint_name": "judge_scores_judge_id_fkey",
    "table_name": "judge_scores",
    "column_name": "judge_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "judge",
    "foreign_column_name": "user_id"
  },
  {
    "constraint_name": "criteria_format_id_fkey",
    "table_name": "criteria",
    "column_name": "format_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "debate_formats",
    "foreign_column_name": "id"
  },
  {
    "constraint_name": "matchmaking_queue_entries_debate_format_id_fkey",
    "table_name": "matchmaking_queue_entries",
    "column_name": "debate_format_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "debate_formats",
    "foreign_column_name": "id"
  },
  {
    "constraint_name": "matchmaking_queue_entries_debate_id_fkey",
    "table_name": "matchmaking_queue_entries",
    "column_name": "debate_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "debates",
    "foreign_column_name": "id"
  },
  {
    "constraint_name": "matchmaking_queue_entries_opponent_id_fkey",
    "table_name": "matchmaking_queue_entries",
    "column_name": "opponent_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "team",
    "foreign_column_name": "id"
  },
  {
    "constraint_name": "matchmaking_queue_entries_team_id_fkey",
    "table_name": "matchmaking_queue_entries",
    "column_name": "team_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "team",
    "foreign_column_name": "id"
  },
  {
    "constraint_name": "ballots_debate_id_fkey",
    "table_name": "ballots",
    "column_name": "debate_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "debates",
    "foreign_column_name": "id"
  },
  {
    "constraint_name": "ballots_format_id_fkey",
    "table_name": "ballots",
    "column_name": "format_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "debate_formats",
    "foreign_column_name": "id"
  },
  {
    "constraint_name": "ballots_judge_id_fkey",
    "table_name": "ballots",
    "column_name": "judge_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "judge",
    "foreign_column_name": "id"
  },
  {
    "constraint_name": "debate_participants_debate_team_id_fkey",
    "table_name": "debate_participants",
    "column_name": "debate_team_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "debate_teams",
    "foreign_column_name": "id"
  },
  {
    "constraint_name": "debate_participants_user_id_fkey",
    "table_name": "debate_participants",
    "column_name": "user_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "student",
    "foreign_column_name": "user_id"
  },
  {
    "constraint_name": "speeches_debate_id_fkey",
    "table_name": "speeches",
    "column_name": "debate_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "debates",
    "foreign_column_name": "id"
  },
  {
    "constraint_name": "speeches_format_round_id_fkey",
    "table_name": "speeches",
    "column_name": "format_round_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "format_rounds",
    "foreign_column_name": "id"
  },
  {
    "constraint_name": "speeches_participant_id_fkey",
    "table_name": "speeches",
    "column_name": "participant_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "debate_participants",
    "foreign_column_name": "id"
  }
]

## 25

SELECT 
    n.nspname AS enum_schema,
    t.typname AS enum_name,
    e.enumlabel AS enum_value
FROM 
    pg_type t
JOIN 
    pg_enum e ON t.oid = e.enumtypid
JOIN 
    pg_catalog.pg_namespace n ON n.oid = t.typnamespace
WHERE 
    n.nspname = 'debate'
ORDER BY 
    enum_schema, enum_name, e.enumsortorder;

[
  {
    "enum_schema": "debate",
    "enum_name": "criteria_group",
    "enum_value": "STYLE"
  },
  {
    "enum_schema": "debate",
    "enum_name": "criteria_group",
    "enum_value": "RESPECT"
  },
  {
    "enum_schema": "debate",
    "enum_name": "criteria_group",
    "enum_value": "ANALYSIS"
  },
  {
    "enum_schema": "debate",
    "enum_name": "speech_mode",
    "enum_value": "SYNC"
  },
  {
    "enum_schema": "debate",
    "enum_name": "speech_mode",
    "enum_value": "ASYNC"
  }
]


## 26

SELECT
    tablename,
    indexname,
    indexdef
FROM
    pg_indexes
WHERE
    schemaname = 'debate'
ORDER BY
    tablename, indexname;

[
  {
    "tablename": "ballots",
    "indexname": "ballots_debate_id_judge_id_key",
    "indexdef": "CREATE UNIQUE INDEX ballots_debate_id_judge_id_key ON debate.ballots USING btree (debate_id, judge_id)"
  },
  {
    "tablename": "ballots",
    "indexname": "ballots_pkey",
    "indexdef": "CREATE UNIQUE INDEX ballots_pkey ON debate.ballots USING btree (id)"
  },
  {
    "tablename": "ballots",
    "indexname": "idx_ballots_debate_id",
    "indexdef": "CREATE INDEX idx_ballots_debate_id ON debate.ballots USING btree (debate_id)"
  },
  {
    "tablename": "ballots",
    "indexname": "idx_ballots_judge_id",
    "indexdef": "CREATE INDEX idx_ballots_judge_id ON debate.ballots USING btree (judge_id)"
  },
  {
    "tablename": "ballots",
    "indexname": "idx_ballots_status",
    "indexdef": "CREATE INDEX idx_ballots_status ON debate.ballots USING btree (status)"
  },
  {
    "tablename": "criteria",
    "indexname": "criteria_pkey",
    "indexdef": "CREATE UNIQUE INDEX criteria_pkey ON debate.criteria USING btree (id)"
  },
  {
    "tablename": "criteria",
    "indexname": "idx_criteria_format_id",
    "indexdef": "CREATE INDEX idx_criteria_format_id ON debate.criteria USING btree (format_id)"
  },
  {
    "tablename": "criteria",
    "indexname": "idx_criteria_group",
    "indexdef": "CREATE INDEX idx_criteria_group ON debate.criteria USING btree (\"group\")"
  },
  {
    "tablename": "debate_formats",
    "indexname": "debate_formats_name_key",
    "indexdef": "CREATE UNIQUE INDEX debate_formats_name_key ON debate.debate_formats USING btree (name)"
  },
  {
    "tablename": "debate_formats",
    "indexname": "debate_formats_pkey",
    "indexdef": "CREATE UNIQUE INDEX debate_formats_pkey ON debate.debate_formats USING btree (id)"
  },
  {
    "tablename": "debate_participants",
    "indexname": "debate_participants_pkey",
    "indexdef": "CREATE UNIQUE INDEX debate_participants_pkey ON debate.debate_participants USING btree (id)"
  },
  {
    "tablename": "debate_teams",
    "indexname": "debate_teams_pkey",
    "indexdef": "CREATE UNIQUE INDEX debate_teams_pkey ON debate.debate_teams USING btree (id)"
  },
  {
    "tablename": "debates",
    "indexname": "debates_pkey",
    "indexdef": "CREATE UNIQUE INDEX debates_pkey ON debate.debates USING btree (id)"
  },
  {
    "tablename": "format_rounds",
    "indexname": "format_rounds_format_sequence_unique",
    "indexdef": "CREATE UNIQUE INDEX format_rounds_format_sequence_unique ON debate.format_rounds USING btree (debate_format_id, sequence)"
  },
  {
    "tablename": "format_rounds",
    "indexname": "format_rounds_pkey",
    "indexdef": "CREATE UNIQUE INDEX format_rounds_pkey ON debate.format_rounds USING btree (id)"
  },
  {
    "tablename": "genres",
    "indexname": "genres_pkey",
    "indexdef": "CREATE UNIQUE INDEX genres_pkey ON debate.genres USING btree (id)"
  },
  {
    "tablename": "judge_comments",
    "indexname": "judge_comments_pkey",
    "indexdef": "CREATE UNIQUE INDEX judge_comments_pkey ON debate.judge_comments USING btree (id)"
  },
  {
    "tablename": "judge_scores",
    "indexname": "judge_scores_pkey",
    "indexdef": "CREATE UNIQUE INDEX judge_scores_pkey ON debate.judge_scores USING btree (id)"
  },
  {
    "tablename": "matchmaking_queue_entries",
    "indexname": "matchmaking_queue_entries_pkey",
    "indexdef": "CREATE UNIQUE INDEX matchmaking_queue_entries_pkey ON debate.matchmaking_queue_entries USING btree (id)"
  },
  {
    "tablename": "motions",
    "indexname": "motions_pkey",
    "indexdef": "CREATE UNIQUE INDEX motions_pkey ON debate.motions USING btree (id)"
  },
  {
    "tablename": "round_templates",
    "indexname": "round_templates_code_key",
    "indexdef": "CREATE UNIQUE INDEX round_templates_code_key ON debate.round_templates USING btree (code)"
  },
  {
    "tablename": "round_templates",
    "indexname": "round_templates_pkey",
    "indexdef": "CREATE UNIQUE INDEX round_templates_pkey ON debate.round_templates USING btree (id)"
  },
  {
    "tablename": "sides",
    "indexname": "sides_pkey",
    "indexdef": "CREATE UNIQUE INDEX sides_pkey ON debate.sides USING btree (id)"
  },
  {
    "tablename": "sides",
    "indexname": "sides_title_key",
    "indexdef": "CREATE UNIQUE INDEX sides_title_key ON debate.sides USING btree (title)"
  },
  {
    "tablename": "speeches",
    "indexname": "speeches_pkey",
    "indexdef": "CREATE UNIQUE INDEX speeches_pkey ON debate.speeches USING btree (id)"
  },
  {
    "tablename": "videos",
    "indexname": "videos_pkey",
    "indexdef": "CREATE UNIQUE INDEX videos_pkey ON debate.videos USING btree (id)"
  }
]

## 27

-- Get all tables in the debate schema with column details
SELECT 
  table_name,
  column_name, 
  data_type,
  is_nullable,
  column_default,
  character_maximum_length,
  numeric_precision,
  numeric_scale
FROM 
  information_schema.columns
WHERE 
  table_schema = 'debate'
ORDER BY 
  table_name, 
  ordinal_position;

[
  {
    "table_name": "ballots",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "uuid_generate_v4()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "ballots",
    "column_name": "debate_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "ballots",
    "column_name": "judge_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "ballots",
    "column_name": "status",
    "data_type": "USER-DEFINED",
    "is_nullable": "YES",
    "column_default": "'PENDING'::debate_ballot_status_enum",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "ballots",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "CURRENT_TIMESTAMP",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "ballots",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "CURRENT_TIMESTAMP",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "ballots",
    "column_name": "submitted_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "ballots",
    "column_name": "format_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "ballots",
    "column_name": "version",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": "1",
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "table_name": "criteria",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "criteria",
    "column_name": "group",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "criteria",
    "column_name": "name",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "criteria",
    "column_name": "criteria",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "criteria",
    "column_name": "label",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "criteria",
    "column_name": "format_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "debate_formats",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "debate_formats",
    "column_name": "name",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "debate_formats",
    "column_name": "description",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "debate_formats",
    "column_name": "type",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO",
    "column_default": "'SYNC'::debate.speech_mode",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "debate_participants",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "debate_participants",
    "column_name": "debate_team_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "debate_participants",
    "column_name": "user_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "debate_participants",
    "column_name": "invite_status",
    "data_type": "USER-DEFINED",
    "is_nullable": "YES",
    "column_default": "'PENDING'::status",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "debate_participants",
    "column_name": "speaker_position",
    "data_type": "smallint",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 16,
    "numeric_scale": 0
  },
  {
    "table_name": "debate_teams",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "debate_teams",
    "column_name": "debate_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "debate_teams",
    "column_name": "side_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "debates",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "debates",
    "column_name": "debate_format_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "debates",
    "column_name": "motion_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "debates",
    "column_name": "scheduled_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "debates",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "debates",
    "column_name": "mode",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "format_rounds",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "format_rounds",
    "column_name": "debate_format_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "format_rounds",
    "column_name": "round_template_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "format_rounds",
    "column_name": "sequence",
    "data_type": "integer",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "table_name": "format_rounds",
    "column_name": "side_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "format_rounds",
    "column_name": "speaker_positions",
    "data_type": "ARRAY",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "format_rounds",
    "column_name": "number_of_speakers",
    "data_type": "smallint",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 16,
    "numeric_scale": 0
  },
  {
    "table_name": "genres",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "genres",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "CURRENT_TIMESTAMP",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "genres",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "CURRENT_TIMESTAMP",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "genres",
    "column_name": "title",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "genres",
    "column_name": "description",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "genres",
    "column_name": "proposer_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "judge_comments",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "judge_comments",
    "column_name": "video_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "judge_comments",
    "column_name": "judge_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "judge_comments",
    "column_name": "criteria_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "judge_comments",
    "column_name": "at_seconds",
    "data_type": "integer",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "table_name": "judge_comments",
    "column_name": "comment",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "judge_comments",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "judge_scores",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "judge_scores",
    "column_name": "debate_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "judge_scores",
    "column_name": "judge_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "judge_scores",
    "column_name": "criteria_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "judge_scores",
    "column_name": "score",
    "data_type": "numeric",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "judge_scores",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "matchmaking_queue_entries",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "matchmaking_queue_entries",
    "column_name": "team_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "matchmaking_queue_entries",
    "column_name": "debate_format_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "matchmaking_queue_entries",
    "column_name": "league_id",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "matchmaking_queue_entries",
    "column_name": "team_rank",
    "data_type": "integer",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "table_name": "matchmaking_queue_entries",
    "column_name": "challenge_mode_active",
    "data_type": "boolean",
    "is_nullable": "NO",
    "column_default": "false",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "matchmaking_queue_entries",
    "column_name": "status",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "matchmaking_queue_entries",
    "column_name": "queued_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "CURRENT_TIMESTAMP",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "matchmaking_queue_entries",
    "column_name": "debate_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "matchmaking_queue_entries",
    "column_name": "opponent_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "motions",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "motions",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "CURRENT_TIMESTAMP",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "motions",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "CURRENT_TIMESTAMP",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "motions",
    "column_name": "topic",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "motions",
    "column_name": "genre_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "motions",
    "column_name": "details",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "motions",
    "column_name": "proposer_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "round_templates",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "round_templates",
    "column_name": "code",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "round_templates",
    "column_name": "name",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "round_templates",
    "column_name": "default_time",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "table_name": "round_templates",
    "column_name": "description",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "sides",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "sides",
    "column_name": "title",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "speeches",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "speeches",
    "column_name": "debate_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "speeches",
    "column_name": "format_round_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "speeches",
    "column_name": "participant_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "speeches",
    "column_name": "content",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "speeches",
    "column_name": "delivered_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "speeches",
    "column_name": "duration_seconds",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": 32,
    "numeric_scale": 0
  },
  {
    "table_name": "videos",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "videos",
    "column_name": "debate_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "videos",
    "column_name": "storage_path",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "videos",
    "column_name": "url",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "videos",
    "column_name": "uploaded_by",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  },
  {
    "table_name": "videos",
    "column_name": "uploaded_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null,
    "numeric_precision": null,
    "numeric_scale": null
  }
]

## 28

-- Get all constraints (primary keys, foreign keys, etc.)
SELECT
    tc.table_schema, 
    tc.constraint_name, 
    tc.table_name, 
    tc.constraint_type,
    kcu.column_name, 
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
JOIN 
    information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
LEFT JOIN 
    information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE 
    tc.table_schema = 'debate'
ORDER BY
    tc.table_name, tc.constraint_type;


[
  {
    "table_schema": "debate",
    "constraint_name": "ballots_format_id_fkey",
    "table_name": "ballots",
    "constraint_type": "FOREIGN KEY",
    "column_name": "format_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "debate_formats",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "ballots_debate_id_fkey",
    "table_name": "ballots",
    "constraint_type": "FOREIGN KEY",
    "column_name": "debate_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "debates",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "ballots_judge_id_fkey",
    "table_name": "ballots",
    "constraint_type": "FOREIGN KEY",
    "column_name": "judge_id",
    "foreign_table_schema": null,
    "foreign_table_name": null,
    "foreign_column_name": null
  },
  {
    "table_schema": "debate",
    "constraint_name": "ballots_pkey",
    "table_name": "ballots",
    "constraint_type": "PRIMARY KEY",
    "column_name": "id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "ballots",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "ballots_debate_id_judge_id_key",
    "table_name": "ballots",
    "constraint_type": "UNIQUE",
    "column_name": "debate_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "ballots",
    "foreign_column_name": "judge_id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "ballots_debate_id_judge_id_key",
    "table_name": "ballots",
    "constraint_type": "UNIQUE",
    "column_name": "judge_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "ballots",
    "foreign_column_name": "debate_id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "ballots_debate_id_judge_id_key",
    "table_name": "ballots",
    "constraint_type": "UNIQUE",
    "column_name": "judge_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "ballots",
    "foreign_column_name": "judge_id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "ballots_debate_id_judge_id_key",
    "table_name": "ballots",
    "constraint_type": "UNIQUE",
    "column_name": "debate_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "ballots",
    "foreign_column_name": "debate_id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "criteria_format_id_fkey",
    "table_name": "criteria",
    "constraint_type": "FOREIGN KEY",
    "column_name": "format_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "debate_formats",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "criteria_pkey",
    "table_name": "criteria",
    "constraint_type": "PRIMARY KEY",
    "column_name": "id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "criteria",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "debate_formats_pkey",
    "table_name": "debate_formats",
    "constraint_type": "PRIMARY KEY",
    "column_name": "id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "debate_formats",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "debate_formats_name_key",
    "table_name": "debate_formats",
    "constraint_type": "UNIQUE",
    "column_name": "name",
    "foreign_table_schema": "debate",
    "foreign_table_name": "debate_formats",
    "foreign_column_name": "name"
  },
  {
    "table_schema": "debate",
    "constraint_name": "debate_participants_debate_team_id_fkey",
    "table_name": "debate_participants",
    "constraint_type": "FOREIGN KEY",
    "column_name": "debate_team_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "debate_teams",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "debate_participants_user_id_fkey",
    "table_name": "debate_participants",
    "constraint_type": "FOREIGN KEY",
    "column_name": "user_id",
    "foreign_table_schema": null,
    "foreign_table_name": null,
    "foreign_column_name": null
  },
  {
    "table_schema": "debate",
    "constraint_name": "debate_participants_pkey",
    "table_name": "debate_participants",
    "constraint_type": "PRIMARY KEY",
    "column_name": "id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "debate_participants",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "debate_teams_debate_id_fkey",
    "table_name": "debate_teams",
    "constraint_type": "FOREIGN KEY",
    "column_name": "debate_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "debates",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "debate_teams_side_id_fkey",
    "table_name": "debate_teams",
    "constraint_type": "FOREIGN KEY",
    "column_name": "side_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "sides",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "debate_teams_pkey",
    "table_name": "debate_teams",
    "constraint_type": "PRIMARY KEY",
    "column_name": "id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "debate_teams",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "debates_motion_id_fkey",
    "table_name": "debates",
    "constraint_type": "FOREIGN KEY",
    "column_name": "motion_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "motions",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "debates_debate_format_id_fkey",
    "table_name": "debates",
    "constraint_type": "FOREIGN KEY",
    "column_name": "debate_format_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "debate_formats",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "debates_pkey",
    "table_name": "debates",
    "constraint_type": "PRIMARY KEY",
    "column_name": "id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "debates",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "format_rounds_debate_format_id_fkey",
    "table_name": "format_rounds",
    "constraint_type": "FOREIGN KEY",
    "column_name": "debate_format_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "debate_formats",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "format_rounds_side_id_fkey",
    "table_name": "format_rounds",
    "constraint_type": "FOREIGN KEY",
    "column_name": "side_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "sides",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "format_rounds_round_template_id_fkey",
    "table_name": "format_rounds",
    "constraint_type": "FOREIGN KEY",
    "column_name": "round_template_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "round_templates",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "format_rounds_pkey",
    "table_name": "format_rounds",
    "constraint_type": "PRIMARY KEY",
    "column_name": "id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "format_rounds",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "format_rounds_format_sequence_unique",
    "table_name": "format_rounds",
    "constraint_type": "UNIQUE",
    "column_name": "sequence",
    "foreign_table_schema": "debate",
    "foreign_table_name": "format_rounds",
    "foreign_column_name": "debate_format_id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "format_rounds_format_sequence_unique",
    "table_name": "format_rounds",
    "constraint_type": "UNIQUE",
    "column_name": "debate_format_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "format_rounds",
    "foreign_column_name": "sequence"
  },
  {
    "table_schema": "debate",
    "constraint_name": "format_rounds_format_sequence_unique",
    "table_name": "format_rounds",
    "constraint_type": "UNIQUE",
    "column_name": "debate_format_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "format_rounds",
    "foreign_column_name": "debate_format_id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "format_rounds_format_sequence_unique",
    "table_name": "format_rounds",
    "constraint_type": "UNIQUE",
    "column_name": "sequence",
    "foreign_table_schema": "debate",
    "foreign_table_name": "format_rounds",
    "foreign_column_name": "sequence"
  },
  {
    "table_schema": "debate",
    "constraint_name": "genres_proposer_id_fkey",
    "table_name": "genres",
    "constraint_type": "FOREIGN KEY",
    "column_name": "proposer_id",
    "foreign_table_schema": null,
    "foreign_table_name": null,
    "foreign_column_name": null
  },
  {
    "table_schema": "debate",
    "constraint_name": "genres_pkey",
    "table_name": "genres",
    "constraint_type": "PRIMARY KEY",
    "column_name": "id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "genres",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "judge_comments_video_id_fkey",
    "table_name": "judge_comments",
    "constraint_type": "FOREIGN KEY",
    "column_name": "video_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "videos",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "judge_comments_judge_id_fkey",
    "table_name": "judge_comments",
    "constraint_type": "FOREIGN KEY",
    "column_name": "judge_id",
    "foreign_table_schema": null,
    "foreign_table_name": null,
    "foreign_column_name": null
  },
  {
    "table_schema": "debate",
    "constraint_name": "judge_comments_criteria_id_fkey",
    "table_name": "judge_comments",
    "constraint_type": "FOREIGN KEY",
    "column_name": "criteria_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "criteria",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "judge_comments_pkey",
    "table_name": "judge_comments",
    "constraint_type": "PRIMARY KEY",
    "column_name": "id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "judge_comments",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "judge_scores_criteria_id_fkey",
    "table_name": "judge_scores",
    "constraint_type": "FOREIGN KEY",
    "column_name": "criteria_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "criteria",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "judge_scores_debate_id_fkey",
    "table_name": "judge_scores",
    "constraint_type": "FOREIGN KEY",
    "column_name": "debate_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "debates",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "judge_scores_judge_id_fkey",
    "table_name": "judge_scores",
    "constraint_type": "FOREIGN KEY",
    "column_name": "judge_id",
    "foreign_table_schema": null,
    "foreign_table_name": null,
    "foreign_column_name": null
  },
  {
    "table_schema": "debate",
    "constraint_name": "judge_scores_pkey",
    "table_name": "judge_scores",
    "constraint_type": "PRIMARY KEY",
    "column_name": "id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "judge_scores",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "matchmaking_queue_entries_debate_id_fkey",
    "table_name": "matchmaking_queue_entries",
    "constraint_type": "FOREIGN KEY",
    "column_name": "debate_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "debates",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "matchmaking_queue_entries_debate_format_id_fkey",
    "table_name": "matchmaking_queue_entries",
    "constraint_type": "FOREIGN KEY",
    "column_name": "debate_format_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "debate_formats",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "matchmaking_queue_entries_opponent_id_fkey",
    "table_name": "matchmaking_queue_entries",
    "constraint_type": "FOREIGN KEY",
    "column_name": "opponent_id",
    "foreign_table_schema": null,
    "foreign_table_name": null,
    "foreign_column_name": null
  },
  {
    "table_schema": "debate",
    "constraint_name": "matchmaking_queue_entries_team_id_fkey",
    "table_name": "matchmaking_queue_entries",
    "constraint_type": "FOREIGN KEY",
    "column_name": "team_id",
    "foreign_table_schema": null,
    "foreign_table_name": null,
    "foreign_column_name": null
  },
  {
    "table_schema": "debate",
    "constraint_name": "matchmaking_queue_entries_pkey",
    "table_name": "matchmaking_queue_entries",
    "constraint_type": "PRIMARY KEY",
    "column_name": "id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "matchmaking_queue_entries",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "motions_proposer_id_fkey",
    "table_name": "motions",
    "constraint_type": "FOREIGN KEY",
    "column_name": "proposer_id",
    "foreign_table_schema": null,
    "foreign_table_name": null,
    "foreign_column_name": null
  },
  {
    "table_schema": "debate",
    "constraint_name": "motions_genre_id_fkey",
    "table_name": "motions",
    "constraint_type": "FOREIGN KEY",
    "column_name": "genre_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "genres",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "motions_pkey",
    "table_name": "motions",
    "constraint_type": "PRIMARY KEY",
    "column_name": "id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "motions",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "round_templates_pkey",
    "table_name": "round_templates",
    "constraint_type": "PRIMARY KEY",
    "column_name": "id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "round_templates",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "round_templates_code_key",
    "table_name": "round_templates",
    "constraint_type": "UNIQUE",
    "column_name": "code",
    "foreign_table_schema": "debate",
    "foreign_table_name": "round_templates",
    "foreign_column_name": "code"
  },
  {
    "table_schema": "debate",
    "constraint_name": "sides_pkey",
    "table_name": "sides",
    "constraint_type": "PRIMARY KEY",
    "column_name": "id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "sides",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "sides_title_key",
    "table_name": "sides",
    "constraint_type": "UNIQUE",
    "column_name": "title",
    "foreign_table_schema": "debate",
    "foreign_table_name": "sides",
    "foreign_column_name": "title"
  },
  {
    "table_schema": "debate",
    "constraint_name": "speeches_debate_id_fkey",
    "table_name": "speeches",
    "constraint_type": "FOREIGN KEY",
    "column_name": "debate_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "debates",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "speeches_format_round_id_fkey",
    "table_name": "speeches",
    "constraint_type": "FOREIGN KEY",
    "column_name": "format_round_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "format_rounds",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "speeches_participant_id_fkey",
    "table_name": "speeches",
    "constraint_type": "FOREIGN KEY",
    "column_name": "participant_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "debate_participants",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "speeches_pkey",
    "table_name": "speeches",
    "constraint_type": "PRIMARY KEY",
    "column_name": "id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "speeches",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "videos_uploaded_by_fkey",
    "table_name": "videos",
    "constraint_type": "FOREIGN KEY",
    "column_name": "uploaded_by",
    "foreign_table_schema": null,
    "foreign_table_name": null,
    "foreign_column_name": null
  },
  {
    "table_schema": "debate",
    "constraint_name": "videos_debate_id_fkey",
    "table_name": "videos",
    "constraint_type": "FOREIGN KEY",
    "column_name": "debate_id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "debates",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "debate",
    "constraint_name": "videos_pkey",
    "table_name": "videos",
    "constraint_type": "PRIMARY KEY",
    "column_name": "id",
    "foreign_table_schema": "debate",
    "foreign_table_name": "videos",
    "foreign_column_name": "id"
  }
]


## 29

-- Get all indexes for the debate schema
SELECT
    tablename,
    indexname,
    indexdef
FROM
    pg_indexes
WHERE
    schemaname = 'debate'
ORDER BY
    tablename, indexname;

[
  {
    "tablename": "ballots",
    "indexname": "ballots_debate_id_judge_id_key",
    "indexdef": "CREATE UNIQUE INDEX ballots_debate_id_judge_id_key ON debate.ballots USING btree (debate_id, judge_id)"
  },
  {
    "tablename": "ballots",
    "indexname": "ballots_pkey",
    "indexdef": "CREATE UNIQUE INDEX ballots_pkey ON debate.ballots USING btree (id)"
  },
  {
    "tablename": "ballots",
    "indexname": "idx_ballots_debate_id",
    "indexdef": "CREATE INDEX idx_ballots_debate_id ON debate.ballots USING btree (debate_id)"
  },
  {
    "tablename": "ballots",
    "indexname": "idx_ballots_judge_id",
    "indexdef": "CREATE INDEX idx_ballots_judge_id ON debate.ballots USING btree (judge_id)"
  },
  {
    "tablename": "ballots",
    "indexname": "idx_ballots_status",
    "indexdef": "CREATE INDEX idx_ballots_status ON debate.ballots USING btree (status)"
  },
  {
    "tablename": "criteria",
    "indexname": "criteria_pkey",
    "indexdef": "CREATE UNIQUE INDEX criteria_pkey ON debate.criteria USING btree (id)"
  },
  {
    "tablename": "criteria",
    "indexname": "idx_criteria_format_id",
    "indexdef": "CREATE INDEX idx_criteria_format_id ON debate.criteria USING btree (format_id)"
  },
  {
    "tablename": "criteria",
    "indexname": "idx_criteria_group",
    "indexdef": "CREATE INDEX idx_criteria_group ON debate.criteria USING btree (\"group\")"
  },
  {
    "tablename": "debate_formats",
    "indexname": "debate_formats_name_key",
    "indexdef": "CREATE UNIQUE INDEX debate_formats_name_key ON debate.debate_formats USING btree (name)"
  },
  {
    "tablename": "debate_formats",
    "indexname": "debate_formats_pkey",
    "indexdef": "CREATE UNIQUE INDEX debate_formats_pkey ON debate.debate_formats USING btree (id)"
  },
  {
    "tablename": "debate_participants",
    "indexname": "debate_participants_pkey",
    "indexdef": "CREATE UNIQUE INDEX debate_participants_pkey ON debate.debate_participants USING btree (id)"
  },
  {
    "tablename": "debate_teams",
    "indexname": "debate_teams_pkey",
    "indexdef": "CREATE UNIQUE INDEX debate_teams_pkey ON debate.debate_teams USING btree (id)"
  },
  {
    "tablename": "debates",
    "indexname": "debates_pkey",
    "indexdef": "CREATE UNIQUE INDEX debates_pkey ON debate.debates USING btree (id)"
  },
  {
    "tablename": "format_rounds",
    "indexname": "format_rounds_format_sequence_unique",
    "indexdef": "CREATE UNIQUE INDEX format_rounds_format_sequence_unique ON debate.format_rounds USING btree (debate_format_id, sequence)"
  },
  {
    "tablename": "format_rounds",
    "indexname": "format_rounds_pkey",
    "indexdef": "CREATE UNIQUE INDEX format_rounds_pkey ON debate.format_rounds USING btree (id)"
  },
  {
    "tablename": "genres",
    "indexname": "genres_pkey",
    "indexdef": "CREATE UNIQUE INDEX genres_pkey ON debate.genres USING btree (id)"
  },
  {
    "tablename": "judge_comments",
    "indexname": "judge_comments_pkey",
    "indexdef": "CREATE UNIQUE INDEX judge_comments_pkey ON debate.judge_comments USING btree (id)"
  },
  {
    "tablename": "judge_scores",
    "indexname": "judge_scores_pkey",
    "indexdef": "CREATE UNIQUE INDEX judge_scores_pkey ON debate.judge_scores USING btree (id)"
  },
  {
    "tablename": "matchmaking_queue_entries",
    "indexname": "matchmaking_queue_entries_pkey",
    "indexdef": "CREATE UNIQUE INDEX matchmaking_queue_entries_pkey ON debate.matchmaking_queue_entries USING btree (id)"
  },
  {
    "tablename": "motions",
    "indexname": "motions_pkey",
    "indexdef": "CREATE UNIQUE INDEX motions_pkey ON debate.motions USING btree (id)"
  },
  {
    "tablename": "round_templates",
    "indexname": "round_templates_code_key",
    "indexdef": "CREATE UNIQUE INDEX round_templates_code_key ON debate.round_templates USING btree (code)"
  },
  {
    "tablename": "round_templates",
    "indexname": "round_templates_pkey",
    "indexdef": "CREATE UNIQUE INDEX round_templates_pkey ON debate.round_templates USING btree (id)"
  },
  {
    "tablename": "sides",
    "indexname": "sides_pkey",
    "indexdef": "CREATE UNIQUE INDEX sides_pkey ON debate.sides USING btree (id)"
  },
  {
    "tablename": "sides",
    "indexname": "sides_title_key",
    "indexdef": "CREATE UNIQUE INDEX sides_title_key ON debate.sides USING btree (title)"
  },
  {
    "tablename": "speeches",
    "indexname": "speeches_pkey",
    "indexdef": "CREATE UNIQUE INDEX speeches_pkey ON debate.speeches USING btree (id)"
  },
  {
    "tablename": "videos",
    "indexname": "videos_pkey",
    "indexdef": "CREATE UNIQUE INDEX videos_pkey ON debate.videos USING btree (id)"
  }
]


## 30

-- Get enum values for all enums in the debate schema
SELECT
    n.nspname AS enum_schema,
    t.typname AS enum_name,
    e.enumlabel AS enum_value
FROM
    pg_type t
JOIN
    pg_enum e ON t.oid = e.enumtypid
JOIN
    pg_catalog.pg_namespace n ON n.oid = t.typnamespace
WHERE
    n.nspname = 'debate'
ORDER BY
    enum_schema, enum_name, e.enumsortorder;


[
  {
    "enum_schema": "debate",
    "enum_name": "criteria_group",
    "enum_value": "STYLE"
  },
  {
    "enum_schema": "debate",
    "enum_name": "criteria_group",
    "enum_value": "RESPECT"
  },
  {
    "enum_schema": "debate",
    "enum_name": "criteria_group",
    "enum_value": "ANALYSIS"
  },
  {
    "enum_schema": "debate",
    "enum_name": "speech_mode",
    "enum_value": "SYNC"
  },
  {
    "enum_schema": "debate",
    "enum_name": "speech_mode",
    "enum_value": "ASYNC"
  }
]

## 31

-- Query to help create a text-based schema diagram
WITH fkeys AS (
    SELECT
        tc.table_schema, 
        tc.table_name,
        kcu.column_name,
        ccu.table_schema AS target_table_schema,
        ccu.table_name AS target_table_name,
        ccu.column_name AS target_column_name
    FROM 
        information_schema.table_constraints tc
    JOIN 
        information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
    JOIN 
        information_schema.constraint_column_usage ccu 
        ON ccu.constraint_name = tc.constraint_name
    WHERE 
        tc.constraint_type = 'FOREIGN KEY' AND
        tc.table_schema = 'debate'
)
SELECT
    t.table_schema,
    t.table_name,
    string_agg(c.column_name || ' ' || c.data_type, ', ') AS columns,
    string_agg(
        CASE WHEN fk.target_table_name IS NOT NULL 
        THEN c.column_name || ' → ' || fk.target_table_schema || '.' || fk.target_table_name || '.' || fk.target_column_name
        ELSE NULL END, 
        E'\n'
    ) AS foreign_keys
FROM
    information_schema.tables t
JOIN
    information_schema.columns c ON t.table_schema = c.table_schema AND t.table_name = c.table_name
LEFT JOIN
    fkeys fk ON t.table_schema = fk.table_schema AND t.table_name = fk.table_name AND c.column_name = fk.column_name
WHERE
    t.table_schema = 'debate' AND
    t.table_type = 'BASE TABLE'
GROUP BY
    t.table_schema, t.table_name
ORDER BY
    t.table_name;

[
  {
    "table_schema": "debate",
    "table_name": "ballots",
    "columns": "status USER-DEFINED, created_at timestamp with time zone, version integer, format_id uuid, updated_at timestamp with time zone, submitted_at timestamp with time zone, id uuid, debate_id uuid, judge_id uuid",
    "foreign_keys": "format_id → debate.debate_formats.id\ndebate_id → debate.debates.id\njudge_id → public.judge.id"
  },
  {
    "table_schema": "debate",
    "table_name": "criteria",
    "columns": "format_id uuid, label text, criteria text, name text, group USER-DEFINED, id uuid",
    "foreign_keys": "format_id → debate.debate_formats.id"
  },
  {
    "table_schema": "debate",
    "table_name": "debate_formats",
    "columns": "description text, type USER-DEFINED, name text, id uuid",
    "foreign_keys": null
  },
  {
    "table_schema": "debate",
    "table_name": "debate_participants",
    "columns": "id uuid, debate_team_id uuid, user_id uuid, invite_status USER-DEFINED, speaker_position smallint",
    "foreign_keys": "debate_team_id → debate.debate_teams.id\nuser_id → public.student.user_id"
  },
  {
    "table_schema": "debate",
    "table_name": "debate_teams",
    "columns": "side_id uuid, id uuid, debate_id uuid",
    "foreign_keys": "side_id → debate.sides.id\ndebate_id → debate.debates.id"
  },
  {
    "table_schema": "debate",
    "table_name": "debates",
    "columns": "scheduled_at timestamp with time zone, created_at timestamp with time zone, mode USER-DEFINED, id uuid, debate_format_id uuid, motion_id uuid",
    "foreign_keys": "debate_format_id → debate.debate_formats.id\nmotion_id → debate.motions.id"
  },
  {
    "table_schema": "debate",
    "table_name": "format_rounds",
    "columns": "sequence integer, side_id uuid, speaker_positions ARRAY, number_of_speakers smallint, id uuid, debate_format_id uuid, round_template_id uuid",
    "foreign_keys": "side_id → debate.sides.id\ndebate_format_id → debate.debate_formats.id\nround_template_id → debate.round_templates.id"
  },
  {
    "table_schema": "debate",
    "table_name": "genres",
    "columns": "id uuid, created_at timestamp with time zone, updated_at timestamp with time zone, title text, description text, proposer_id uuid",
    "foreign_keys": "proposer_id → public.profile.id"
  },
  {
    "table_schema": "debate",
    "table_name": "judge_comments",
    "columns": "id uuid, video_id uuid, judge_id uuid, criteria_id uuid, at_seconds integer, comment text, created_at timestamp with time zone",
    "foreign_keys": "video_id → debate.videos.id\njudge_id → public.judge.user_id\ncriteria_id → debate.criteria.id"
  },
  {
    "table_schema": "debate",
    "table_name": "judge_scores",
    "columns": "id uuid, debate_id uuid, judge_id uuid, criteria_id uuid, score numeric, created_at timestamp with time zone",
    "foreign_keys": "debate_id → debate.debates.id\njudge_id → public.judge.user_id\ncriteria_id → debate.criteria.id"
  },
  {
    "table_schema": "debate",
    "table_name": "matchmaking_queue_entries",
    "columns": "id uuid, team_id uuid, debate_format_id uuid, league_id USER-DEFINED, team_rank integer, challenge_mode_active boolean, status USER-DEFINED, queued_at timestamp with time zone, debate_id uuid, opponent_id uuid",
    "foreign_keys": "team_id → public.team.id\ndebate_format_id → debate.debate_formats.id\ndebate_id → debate.debates.id\nopponent_id → public.team.id"
  },
  {
    "table_schema": "debate",
    "table_name": "motions",
    "columns": "details text, genre_id uuid, topic text, updated_at timestamp with time zone, id uuid, created_at timestamp with time zone, proposer_id uuid",
    "foreign_keys": "genre_id → debate.genres.id\nproposer_id → public.profile.id"
  },
  {
    "table_schema": "debate",
    "table_name": "round_templates",
    "columns": "id uuid, name text, code text, default_time integer, description text",
    "foreign_keys": null
  },
  {
    "table_schema": "debate",
    "table_name": "sides",
    "columns": "id uuid, title text",
    "foreign_keys": null
  },
  {
    "table_schema": "debate",
    "table_name": "speeches",
    "columns": "id uuid, format_round_id uuid, participant_id uuid, content text, delivered_at timestamp with time zone, duration_seconds integer, debate_id uuid",
    "foreign_keys": "format_round_id → debate.format_rounds.id\nparticipant_id → debate.debate_participants.id\ndebate_id → debate.debates.id"
  },
  {
    "table_schema": "debate",
    "table_name": "videos",
    "columns": "debate_id uuid, id uuid, uploaded_at timestamp with time zone, url text, uploaded_by uuid, storage_path text",
    "foreign_keys": "debate_id → debate.debates.id\nuploaded_by → public.profile.id"
  }
]


## 32

SELECT tablename FROM pg_tables WHERE schemaname = 'debate';

[
  {
    "tablename": "genres"
  },
  {
    "tablename": "motions"
  },
  {
    "tablename": "debate_formats"
  },
  {
    "tablename": "sides"
  },
  {
    "tablename": "round_templates"
  },
  {
    "tablename": "debates"
  },
  {
    "tablename": "format_rounds"
  },
  {
    "tablename": "debate_teams"
  },
  {
    "tablename": "videos"
  },
  {
    "tablename": "judge_comments"
  },
  {
    "tablename": "judge_scores"
  },
  {
    "tablename": "criteria"
  },
  {
    "tablename": "matchmaking_queue_entries"
  },
  {
    "tablename": "ballots"
  },
  {
    "tablename": "debate_participants"
  },
  {
    "tablename": "speeches"
  }
]


## 33

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'debate' AND table_name = 'criteria';

[
  {
    "column_name": "id",
    "data_type": "uuid"
  },
  {
    "column_name": "group",
    "data_type": "USER-DEFINED"
  },
  {
    "column_name": "name",
    "data_type": "text"
  },
  {
    "column_name": "criteria",
    "data_type": "text"
  },
  {
    "column_name": "label",
    "data_type": "text"
  },
  {
    "column_name": "format_id",
    "data_type": "uuid"
  }
]


## 34 (didn't know to do them separately)

-- Get schema information
SELECT schema_name FROM information_schema.schemata ORDER BY schema_name;

-- Get tables from relevant schemas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema IN ('public', 'debate')
ORDER BY table_schema, table_name;

-- Get detailed table columns
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM 
    information_schema.columns
WHERE 
    table_schema IN ('public', 'debate')
ORDER BY 
    table_name, ordinal_position;

-- Get foreign key relationships
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM
    information_schema.table_constraints AS tc
JOIN
    information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN
    information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE
    tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema IN ('public', 'debate');

-- Get custom enum types
SELECT 
    n.nspname AS enum_schema,
    t.typname AS enum_name,
    e.enumlabel AS enum_value
FROM 
    pg_type t
JOIN 
    pg_enum e ON t.oid = e.enumtypid
JOIN 
    pg_catalog.pg_namespace n ON n.oid = t.typnamespace
WHERE 
    n.nspname IN ('public', 'debate')
ORDER BY 
    enum_schema, enum_name, e.enumsortorder;

-- Get indexes
SELECT
    tablename,
    indexname,
    indexdef
FROM
    pg_indexes
WHERE
    schemaname IN ('public', 'debate')
ORDER BY
    tablename, indexname;

-- Get number of rows in key tables (optional)
SELECT 'profile' as table_name, COUNT(*) as row_count FROM public.profile
UNION ALL 
SELECT 'student', COUNT(*) FROM public.student
UNION ALL
SELECT 'debates', COUNT(*) FROM debate.debates
UNION ALL
SELECT 'debate_formats', COUNT(*) FROM debate.debate_formats
ORDER BY table_name;

[
  {
    "table_name": "debate_formats",
    "row_count": 5
  },
  {
    "table_name": "debates",
    "row_count": 0
  },
  {
    "table_name": "profile",
    "row_count": 14
  },
  {
    "table_name": "student",
    "row_count": 6
  }
]


## 35


-- Get schema information
SELECT schema_name FROM information_schema.schemata ORDER BY schema_name;

-- Get tables from relevant schemas
SELECT table_schema, table_name 
FROM information_schema.tables 
WHERE table_schema IN ('public', 'debate')
ORDER BY table_schema, table_name;

-- Get detailed table columns
SELECT 
    table_schema,
    table_name, 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM 
    information_schema.columns
WHERE 
    table_schema IN ('public', 'debate')
ORDER BY 
    table_schema, table_name, ordinal_position;

-- Get foreign key relationships
SELECT
    tc.constraint_name,
    tc.table_schema,
    tc.table_name,
    kcu.column_name,
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM
    information_schema.table_constraints AS tc
JOIN
    information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN
    information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE
    tc.constraint_type = 'FOREIGN KEY'
    AND (tc.table_schema IN ('public', 'debate') OR ccu.table_schema IN ('public', 'debate'));

-- Get custom enum types
SELECT 
    n.nspname AS enum_schema,
    t.typname AS enum_name,
    e.enumlabel AS enum_value
FROM 
    pg_type t
JOIN 
    pg_enum e ON t.oid = e.enumtypid
JOIN 
    pg_catalog.pg_namespace n ON n.oid = t.typnamespace
WHERE 
    n.nspname IN ('public', 'debate')
ORDER BY 
    enum_schema, enum_name, e.enumsortorder;

-- Get number of rows in key tables (checking if tables exist first)
SELECT 'profile' as table_name, COUNT(*) as row_count FROM public.profile
UNION ALL 
SELECT 'student', COUNT(*) FROM public.student
UNION ALL
SELECT 'friendship', COUNT(*) FROM public.friendship WHERE EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'friendship'
)
UNION ALL
SELECT 'team', COUNT(*) FROM public.team
UNION ALL
SELECT 'team_member', COUNT(*) FROM public.team_member
UNION ALL
SELECT 'debate_formats', COUNT(*) FROM debate.debate_formats
UNION ALL
SELECT 'debates', COUNT(*) FROM debate.debates
UNION ALL
SELECT 'debate_participants', COUNT(*) FROM debate.debate_participants WHERE EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'debate' AND table_name = 'debate_participants'
)
ORDER BY table_name;

-- Check which tables related to presence and realtime features exist
SELECT table_schema, table_name 
FROM information_schema.tables 
WHERE table_name LIKE '%presence%' OR table_name LIKE '%online%' OR table_name LIKE '%realtime%'
ORDER BY table_schema, table_name;

-- Get table and index sizes for existing tables
SELECT
    table_schema,
    table_name,
    pg_size_pretty(pg_total_relation_size(quote_ident(table_schema) || '.' || quote_ident(table_name))) as total_size
FROM
    information_schema.tables
WHERE
    table_schema IN ('public', 'debate')
    AND table_type = 'BASE TABLE'
ORDER BY
    pg_total_relation_size(quote_ident(table_schema) || '.' || quote_ident(table_name)) DESC;

[
  {
    "table_schema": "public",
    "table_name": "profile",
    "total_size": "80 kB"
  },
  {
    "table_schema": "debate",
    "table_name": "format_rounds",
    "total_size": "80 kB"
  },
  {
    "table_schema": "public",
    "table_name": "student",
    "total_size": "80 kB"
  },
  {
    "table_schema": "public",
    "table_name": "guardian",
    "total_size": "80 kB"
  },
  {
    "table_schema": "public",
    "table_name": "team_member",
    "total_size": "72 kB"
  },
  {
    "table_schema": "public",
    "table_name": "friendship",
    "total_size": "72 kB"
  },
  {
    "table_schema": "debate",
    "table_name": "criteria",
    "total_size": "64 kB"
  },
  {
    "table_schema": "public",
    "table_name": "judge",
    "total_size": "64 kB"
  },
  {
    "table_schema": "debate",
    "table_name": "motions",
    "total_size": "64 kB"
  },
  {
    "table_schema": "debate",
    "table_name": "debate_formats",
    "total_size": "48 kB"
  },
  {
    "table_schema": "public",
    "table_name": "school",
    "total_size": "48 kB"
  },
  {
    "table_schema": "debate",
    "table_name": "sides",
    "total_size": "48 kB"
  },
  {
    "table_schema": "debate",
    "table_name": "round_templates",
    "total_size": "48 kB"
  },
  {
    "table_schema": "debate",
    "table_name": "ballots",
    "total_size": "40 kB"
  },
  {
    "table_schema": "debate",
    "table_name": "debates",
    "total_size": "32 kB"
  },
  {
    "table_schema": "debate",
    "table_name": "genres",
    "total_size": "32 kB"
  },
  {
    "table_schema": "public",
    "table_name": "team",
    "total_size": "32 kB"
  },
  {
    "table_schema": "public",
    "table_name": "invitation",
    "total_size": "24 kB"
  },
  {
    "table_schema": "debate",
    "table_name": "debate_teams",
    "total_size": "24 kB"
  },
  {
    "table_schema": "public",
    "table_name": "log",
    "total_size": "24 kB"
  },
  {
    "table_schema": "debate",
    "table_name": "debate_participants",
    "total_size": "24 kB"
  },
  {
    "table_schema": "public",
    "table_name": "admin",
    "total_size": "24 kB"
  },
  {
    "table_schema": "debate",
    "table_name": "speeches",
    "total_size": "16 kB"
  },
  {
    "table_schema": "public",
    "table_name": "bank_account",
    "total_size": "16 kB"
  },
  {
    "table_schema": "public",
    "table_name": "payment_history",
    "total_size": "16 kB"
  },
  {
    "table_schema": "debate",
    "table_name": "videos",
    "total_size": "16 kB"
  },
  {
    "table_schema": "debate",
    "table_name": "judge_comments",
    "total_size": "16 kB"
  },
  {
    "table_schema": "debate",
    "table_name": "judge_scores",
    "total_size": "16 kB"
  },
  {
    "table_schema": "public",
    "table_name": "guild",
    "total_size": "16 kB"
  },
  {
    "table_schema": "public",
    "table_name": "rating",
    "total_size": "8192 bytes"
  },
  {
    "table_schema": "debate",
    "table_name": "matchmaking_queue_entries",
    "total_size": "8192 bytes"
  },
  {
    "table_schema": "public",
    "table_name": "guardian_request",
    "total_size": "8192 bytes"
  },
  {
    "table_schema": "public",
    "table_name": "guild_member",
    "total_size": "8192 bytes"
  }
]

## 36

-- Simplified schema information query
-- 1. List all tables in public and debate schemas
SELECT 
    table_schema,
    table_name,
    pg_catalog.obj_description(
        pg_catalog.pg_class.oid, 'pg_class'
    ) as table_comment
FROM 
    information_schema.tables 
JOIN 
    pg_catalog.pg_class ON tables.table_name = pg_class.relname
WHERE 
    table_schema IN ('public', 'debate')
    AND table_type = 'BASE TABLE'
ORDER BY 
    table_schema, 
    table_name;

-- 2. List all columns of these tables
SELECT 
    c.table_schema,
    c.table_name,
    c.column_name, 
    c.data_type,
    c.is_nullable,
    c.column_default,
    col_description(format('%s.%s', c.table_schema, c.table_name)::regclass::oid, c.ordinal_position) as column_comment
FROM 
    information_schema.columns c
JOIN 
    information_schema.tables t 
    ON c.table_schema = t.table_schema 
    AND c.table_name = t.table_name
WHERE 
    c.table_schema IN ('public', 'debate')
    AND t.table_type = 'BASE TABLE'
ORDER BY 
    c.table_schema,
    c.table_name, 
    c.ordinal_position;

-- 3. List all foreign keys
SELECT
    tc.table_schema, 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
JOIN 
    information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN 
    information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE 
    tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema IN ('public', 'debate');

-- 4. List custom enum types
SELECT 
    n.nspname AS enum_schema,
    t.typname AS enum_name,
    e.enumlabel AS enum_value,
    e.enumsortorder
FROM 
    pg_type t
JOIN 
    pg_enum e ON t.oid = e.enumtypid
JOIN 
    pg_catalog.pg_namespace n ON n.oid = t.typnamespace
WHERE 
    n.nspname IN ('public', 'debate')
ORDER BY 
    enum_schema, enum_name, e.enumsortorder;

-- 5. List RLS policies (simplified)
SELECT
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    cmd, 
    qual
FROM 
    pg_policies
WHERE 
    schemaname IN ('public', 'debate')
ORDER BY 
    schemaname, 
    tablename;

[
  {
    "schemaname": "debate",
    "tablename": "ballots",
    "policyname": "Participants can view ballots for their debates",
    "permissive": "PERMISSIVE",
    "cmd": "SELECT",
    "qual": "(debate_id IN ( SELECT dt.debate_id\n   FROM ((debate.debate_teams dt\n     JOIN debate.debate_participants dp ON ((dp.debate_team_id = dt.id)))\n     JOIN student s ON ((dp.user_id = s.user_id)))\n  WHERE (s.user_id = auth.uid())))"
  },
  {
    "schemaname": "debate",
    "tablename": "ballots",
    "policyname": "Judges can manage their own ballots",
    "permissive": "PERMISSIVE",
    "cmd": "ALL",
    "qual": "(judge_id IN ( SELECT judge.id\n   FROM judge\n  WHERE (judge.user_id = auth.uid())))"
  },
  {
    "schemaname": "debate",
    "tablename": "criteria",
    "policyname": "Enable read access for all users",
    "permissive": "PERMISSIVE",
    "cmd": "SELECT",
    "qual": "true"
  },
  {
    "schemaname": "debate",
    "tablename": "debate_formats",
    "policyname": "Enable read access for all users",
    "permissive": "PERMISSIVE",
    "cmd": "SELECT",
    "qual": "true"
  },
  {
    "schemaname": "debate",
    "tablename": "format_rounds",
    "policyname": "Enable read access for all users",
    "permissive": "PERMISSIVE",
    "cmd": "SELECT",
    "qual": "true"
  },
  {
    "schemaname": "debate",
    "tablename": "genres",
    "policyname": "Enable insert for authenticated users only",
    "permissive": "PERMISSIVE",
    "cmd": "INSERT",
    "qual": null
  },
  {
    "schemaname": "debate",
    "tablename": "genres",
    "policyname": "Enable read access for all users",
    "permissive": "PERMISSIVE",
    "cmd": "SELECT",
    "qual": "true"
  },
  {
    "schemaname": "debate",
    "tablename": "round_templates",
    "policyname": "Enable read access for all users",
    "permissive": "PERMISSIVE",
    "cmd": "SELECT",
    "qual": "true"
  },
  {
    "schemaname": "debate",
    "tablename": "sides",
    "policyname": "Enable read access for all users",
    "permissive": "PERMISSIVE",
    "cmd": "SELECT",
    "qual": "true"
  },
  {
    "schemaname": "public",
    "tablename": "friendship",
    "policyname": "Allow update on friendship",
    "permissive": "PERMISSIVE",
    "cmd": "UPDATE",
    "qual": "((user_id = auth.uid()) OR (friend_id = auth.uid()))"
  },
  {
    "schemaname": "public",
    "tablename": "friendship",
    "policyname": "Allow insert on friendship",
    "permissive": "PERMISSIVE",
    "cmd": "INSERT",
    "qual": null
  },
  {
    "schemaname": "public",
    "tablename": "friendship",
    "policyname": "Allow select on friendship",
    "permissive": "PERMISSIVE",
    "cmd": "SELECT",
    "qual": "((user_id = auth.uid()) OR (friend_id = auth.uid()))"
  },
  {
    "schemaname": "public",
    "tablename": "guardian",
    "policyname": "Enable read access for all users",
    "permissive": "PERMISSIVE",
    "cmd": "SELECT",
    "qual": "true"
  },
  {
    "schemaname": "public",
    "tablename": "guardian",
    "policyname": "Enable insert for authenticated users only",
    "permissive": "PERMISSIVE",
    "cmd": "INSERT",
    "qual": null
  },
  {
    "schemaname": "public",
    "tablename": "judge",
    "policyname": "Enable insert for authenticated users only",
    "permissive": "PERMISSIVE",
    "cmd": "INSERT",
    "qual": null
  },
  {
    "schemaname": "public",
    "tablename": "profile",
    "policyname": "Enable read access for all users",
    "permissive": "PERMISSIVE",
    "cmd": "SELECT",
    "qual": "true"
  },
  {
    "schemaname": "public",
    "tablename": "profile",
    "policyname": "Allow users to select their own profile",
    "permissive": "PERMISSIVE",
    "cmd": "SELECT",
    "qual": "(( SELECT auth.uid() AS uid) = id)"
  },
  {
    "schemaname": "public",
    "tablename": "profile",
    "policyname": "Allow users to update their own profile",
    "permissive": "PERMISSIVE",
    "cmd": "UPDATE",
    "qual": "(( SELECT auth.uid() AS uid) = id)"
  },
  {
    "schemaname": "public",
    "tablename": "school",
    "policyname": "Enable read access for all users",
    "permissive": "PERMISSIVE",
    "cmd": "SELECT",
    "qual": "true"
  },
  {
    "schemaname": "public",
    "tablename": "school",
    "policyname": "Allow authenticated users to insert school",
    "permissive": "PERMISSIVE",
    "cmd": "INSERT",
    "qual": null
  },
  {
    "schemaname": "public",
    "tablename": "student",
    "policyname": "Enable insert for authenticated users only",
    "permissive": "PERMISSIVE",
    "cmd": "INSERT",
    "qual": null
  },
  {
    "schemaname": "public",
    "tablename": "student",
    "policyname": "update_student_policy",
    "permissive": "PERMISSIVE",
    "cmd": "UPDATE",
    "qual": "(user_id = auth.uid())"
  },
  {
    "schemaname": "public",
    "tablename": "student",
    "policyname": "Enable read access for all users",
    "permissive": "PERMISSIVE",
    "cmd": "SELECT",
    "qual": "true"
  },
  {
    "schemaname": "public",
    "tablename": "team",
    "policyname": "Enable delete for users based on user_id",
    "permissive": "PERMISSIVE",
    "cmd": "DELETE",
    "qual": "true"
  },
  {
    "schemaname": "public",
    "tablename": "team",
    "policyname": "Enable read access for all users",
    "permissive": "PERMISSIVE",
    "cmd": "SELECT",
    "qual": "true"
  },
  {
    "schemaname": "public",
    "tablename": "team",
    "policyname": "Policy with table joins",
    "permissive": "PERMISSIVE",
    "cmd": "UPDATE",
    "qual": "true"
  },
  {
    "schemaname": "public",
    "tablename": "team",
    "policyname": "Enable insert for authenticated users only",
    "permissive": "PERMISSIVE",
    "cmd": "INSERT",
    "qual": null
  },
  {
    "schemaname": "public",
    "tablename": "team_member",
    "policyname": "Enable read access for all users",
    "permissive": "PERMISSIVE",
    "cmd": "SELECT",
    "qual": "true"
  },
  {
    "schemaname": "public",
    "tablename": "team_member",
    "policyname": "Enable delete for users based on user_id",
    "permissive": "PERMISSIVE",
    "cmd": "DELETE",
    "qual": "true"
  },
  {
    "schemaname": "public",
    "tablename": "team_member",
    "policyname": "Enable update for users based on email",
    "permissive": "PERMISSIVE",
    "cmd": "UPDATE",
    "qual": "true"
  },
  {
    "schemaname": "public",
    "tablename": "team_member",
    "policyname": "Enable insert for users based on user_id",
    "permissive": "PERMISSIVE",
    "cmd": "INSERT",
    "qual": null
  }
]

## 37 desktop suggestion

-- Get complete structure for all tables we haven't fully examined
SELECT 
    c.table_schema,
    c.table_name,
    c.column_name,
    c.data_type,
    c.is_nullable,
    c.column_default,
    c.character_maximum_length,
    pgd.description as column_comment
FROM information_schema.columns c
LEFT JOIN pg_catalog.pg_statio_all_tables st 
    ON c.table_schema = st.schemaname 
    AND c.table_name = st.relname
LEFT JOIN pg_catalog.pg_description pgd 
    ON pgd.objoid = st.relid 
    AND pgd.objsubid = c.ordinal_position
WHERE c.table_schema IN ('public', 'debate', 'chat')
AND c.table_name IN (
    'profile', 'school', 'guild', 'guild_member',
    'speeches', 'motions', 'motion_categories',
    'ballots', 'scorecards', 'scores', 'feedback',
    'ballot_templates', 'round_templates',
    'message', 'room', 'participant'
)
ORDER BY c.table_schema, c.table_name, c.ordinal_position;

[
  {
    "table_schema": "chat",
    "table_name": "message",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "chat",
    "table_name": "message",
    "column_name": "room_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "chat",
    "table_name": "message",
    "column_name": "sender_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "chat",
    "table_name": "message",
    "column_name": "content",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "chat",
    "table_name": "message",
    "column_name": "is_system",
    "data_type": "boolean",
    "is_nullable": "NO",
    "column_default": "false",
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "chat",
    "table_name": "message",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "chat",
    "table_name": "message",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "chat",
    "table_name": "participant",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "chat",
    "table_name": "participant",
    "column_name": "room_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "chat",
    "table_name": "participant",
    "column_name": "student_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "chat",
    "table_name": "participant",
    "column_name": "joined_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "chat",
    "table_name": "participant",
    "column_name": "last_read_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "chat",
    "table_name": "room",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "chat",
    "table_name": "room",
    "column_name": "type",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "chat",
    "table_name": "room",
    "column_name": "title",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "chat",
    "table_name": "room",
    "column_name": "team_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "chat",
    "table_name": "room",
    "column_name": "guild_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "chat",
    "table_name": "room",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "chat",
    "table_name": "room",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "debate",
    "table_name": "ballots",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "uuid_generate_v4()",
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "debate",
    "table_name": "ballots",
    "column_name": "debate_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "debate",
    "table_name": "ballots",
    "column_name": "judge_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "debate",
    "table_name": "ballots",
    "column_name": "status",
    "data_type": "USER-DEFINED",
    "is_nullable": "YES",
    "column_default": "'PENDING'::debate_ballot_status_enum",
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "debate",
    "table_name": "ballots",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "CURRENT_TIMESTAMP",
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "debate",
    "table_name": "ballots",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "CURRENT_TIMESTAMP",
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "debate",
    "table_name": "ballots",
    "column_name": "submitted_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "debate",
    "table_name": "ballots",
    "column_name": "format_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "debate",
    "table_name": "ballots",
    "column_name": "version",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": "1",
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "debate",
    "table_name": "motions",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "debate",
    "table_name": "motions",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "CURRENT_TIMESTAMP",
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "debate",
    "table_name": "motions",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "CURRENT_TIMESTAMP",
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "debate",
    "table_name": "motions",
    "column_name": "topic",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "debate",
    "table_name": "motions",
    "column_name": "genre_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "debate",
    "table_name": "motions",
    "column_name": "details",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "debate",
    "table_name": "motions",
    "column_name": "proposer_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "debate",
    "table_name": "round_templates",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "debate",
    "table_name": "round_templates",
    "column_name": "code",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "debate",
    "table_name": "round_templates",
    "column_name": "name",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "debate",
    "table_name": "round_templates",
    "column_name": "default_time",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "debate",
    "table_name": "round_templates",
    "column_name": "description",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "debate",
    "table_name": "speeches",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "debate",
    "table_name": "speeches",
    "column_name": "debate_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "debate",
    "table_name": "speeches",
    "column_name": "format_round_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "debate",
    "table_name": "speeches",
    "column_name": "participant_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "debate",
    "table_name": "speeches",
    "column_name": "content",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "debate",
    "table_name": "speeches",
    "column_name": "delivered_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "debate",
    "table_name": "speeches",
    "column_name": "duration_seconds",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "public",
    "table_name": "guild",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "public",
    "table_name": "guild",
    "column_name": "school_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "public",
    "table_name": "guild",
    "column_name": "created_at",
    "data_type": "timestamp without time zone",
    "is_nullable": "NO",
    "column_default": "CURRENT_TIMESTAMP",
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "public",
    "table_name": "guild",
    "column_name": "updated_at",
    "data_type": "timestamp without time zone",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "public",
    "table_name": "guild",
    "column_name": "name",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "public",
    "table_name": "guild",
    "column_name": "requirement",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "public",
    "table_name": "guild",
    "column_name": "division",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "public",
    "table_name": "guild",
    "column_name": "image_path",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "public",
    "table_name": "guild",
    "column_name": "description",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "public",
    "table_name": "guild_member",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "public",
    "table_name": "guild_member",
    "column_name": "created_at",
    "data_type": "timestamp without time zone",
    "is_nullable": "NO",
    "column_default": "CURRENT_TIMESTAMP",
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "public",
    "table_name": "guild_member",
    "column_name": "updated_at",
    "data_type": "timestamp without time zone",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "public",
    "table_name": "guild_member",
    "column_name": "student_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "public",
    "table_name": "guild_member",
    "column_name": "guild_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "public",
    "table_name": "guild_member",
    "column_name": "join_date",
    "data_type": "timestamp without time zone",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "public",
    "table_name": "guild_member",
    "column_name": "is_leader",
    "data_type": "boolean",
    "is_nullable": "NO",
    "column_default": "false",
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "public",
    "table_name": "guild_member",
    "column_name": "status",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO",
    "column_default": "'PENDING'::status",
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "public",
    "table_name": "profile",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "auth.uid()",
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "public",
    "table_name": "profile",
    "column_name": "name",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": "''::text",
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "public",
    "table_name": "profile",
    "column_name": "username",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "public",
    "table_name": "profile",
    "column_name": "image_path",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "public",
    "table_name": "profile",
    "column_name": "date_of_birth",
    "data_type": "date",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "public",
    "table_name": "profile",
    "column_name": "gender",
    "data_type": "USER-DEFINED",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "public",
    "table_name": "profile",
    "column_name": "user_role",
    "data_type": "USER-DEFINED",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "public",
    "table_name": "profile",
    "column_name": "active",
    "data_type": "boolean",
    "is_nullable": "NO",
    "column_default": "false",
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "public",
    "table_name": "profile",
    "column_name": "term_agree_time",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "character_maximum_length": null,
    "column_comment": "Records when the user agreed the terms and conditions"
  },
  {
    "table_schema": "public",
    "table_name": "profile",
    "column_name": "email",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": "''::text",
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "public",
    "table_name": "profile",
    "column_name": "invited",
    "data_type": "boolean",
    "is_nullable": "NO",
    "column_default": "false",
    "character_maximum_length": null,
    "column_comment": "check if guardian invited the user. if invited, role is going to be fixed as student"
  },
  {
    "table_schema": "public",
    "table_name": "school",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "public",
    "table_name": "school",
    "column_name": "name",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "public",
    "table_name": "school",
    "column_name": "created_at",
    "data_type": "timestamp without time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "public",
    "table_name": "school",
    "column_name": "updated_at",
    "data_type": "timestamp without time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "character_maximum_length": null,
    "column_comment": null
  },
  {
    "table_schema": "public",
    "table_name": "school",
    "column_name": "created_by",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "auth.uid()",
    "character_maximum_length": null,
    "column_comment": "user uuid who created"
  }
]

## 38 desktop suggestion

-- Examine chat system structure and relationships
SELECT 
    tc.table_schema,
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
LEFT JOIN information_schema.constraint_column_usage ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.table_schema = 'chat'
ORDER BY tc.table_name, tc.constraint_type;

[
  {
    "table_schema": "chat",
    "table_name": "message",
    "constraint_name": "message_room_id_fkey",
    "constraint_type": "FOREIGN KEY",
    "column_name": "room_id",
    "foreign_table_schema": "chat",
    "foreign_table_name": "room",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "chat",
    "table_name": "message",
    "constraint_name": "message_sender_id_fkey",
    "constraint_type": "FOREIGN KEY",
    "column_name": "sender_id",
    "foreign_table_schema": null,
    "foreign_table_name": null,
    "foreign_column_name": null
  },
  {
    "table_schema": "chat",
    "table_name": "message",
    "constraint_name": "message_pkey",
    "constraint_type": "PRIMARY KEY",
    "column_name": "id",
    "foreign_table_schema": "chat",
    "foreign_table_name": "message",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "chat",
    "table_name": "participant",
    "constraint_name": "participant_student_id_fkey",
    "constraint_type": "FOREIGN KEY",
    "column_name": "student_id",
    "foreign_table_schema": null,
    "foreign_table_name": null,
    "foreign_column_name": null
  },
  {
    "table_schema": "chat",
    "table_name": "participant",
    "constraint_name": "participant_room_id_fkey",
    "constraint_type": "FOREIGN KEY",
    "column_name": "room_id",
    "foreign_table_schema": "chat",
    "foreign_table_name": "room",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "chat",
    "table_name": "participant",
    "constraint_name": "participant_pkey",
    "constraint_type": "PRIMARY KEY",
    "column_name": "id",
    "foreign_table_schema": "chat",
    "foreign_table_name": "participant",
    "foreign_column_name": "id"
  },
  {
    "table_schema": "chat",
    "table_name": "participant",
    "constraint_name": "participant_unique",
    "constraint_type": "UNIQUE",
    "column_name": "student_id",
    "foreign_table_schema": "chat",
    "foreign_table_name": "participant",
    "foreign_column_name": "student_id"
  },
  {
    "table_schema": "chat",
    "table_name": "participant",
    "constraint_name": "participant_unique",
    "constraint_type": "UNIQUE",
    "column_name": "room_id",
    "foreign_table_schema": "chat",
    "foreign_table_name": "participant",
    "foreign_column_name": "room_id"
  },
  {
    "table_schema": "chat",
    "table_name": "participant",
    "constraint_name": "participant_unique",
    "constraint_type": "UNIQUE",
    "column_name": "room_id",
    "foreign_table_schema": "chat",
    "foreign_table_name": "participant",
    "foreign_column_name": "student_id"
  },
  {
    "table_schema": "chat",
    "table_name": "participant",
    "constraint_name": "participant_unique",
    "constraint_type": "UNIQUE",
    "column_name": "student_id",
    "foreign_table_schema": "chat",
    "foreign_table_name": "participant",
    "foreign_column_name": "room_id"
  },
  {
    "table_schema": "chat",
    "table_name": "room",
    "constraint_name": "room_team_id_fkey",
    "constraint_type": "FOREIGN KEY",
    "column_name": "team_id",
    "foreign_table_schema": null,
    "foreign_table_name": null,
    "foreign_column_name": null
  },
  {
    "table_schema": "chat",
    "table_name": "room",
    "constraint_name": "room_guild_id_fkey",
    "constraint_type": "FOREIGN KEY",
    "column_name": "guild_id",
    "foreign_table_schema": null,
    "foreign_table_name": null,
    "foreign_column_name": null
  },
  {
    "table_schema": "chat",
    "table_name": "room",
    "constraint_name": "room_pkey",
    "constraint_type": "PRIMARY KEY",
    "column_name": "id",
    "foreign_table_schema": "chat",
    "foreign_table_name": "room",
    "foreign_column_name": "id"
  }
]

## 39 desktop suggestion

-- Get all enum types and their values
SELECT 
    n.nspname AS schema_name,
    t.typname AS enum_name,
    string_agg(e.enumlabel, ', ' ORDER BY e.enumsortorder) AS enum_values
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
WHERE n.nspname IN ('public', 'debate', 'chat')
GROUP BY n.nspname, t.typname
ORDER BY n.nspname, t.typname;

[
  {
    "schema_name": "debate",
    "enum_name": "criteria_group",
    "enum_values": "STYLE, RESPECT, ANALYSIS"
  },
  {
    "schema_name": "debate",
    "enum_name": "speech_mode",
    "enum_values": "SYNC, ASYNC"
  },
  {
    "schema_name": "public",
    "enum_name": "debate_ballot_status_enum",
    "enum_values": "PENDING, IN_PROGRESS, COMPLETE"
  },
  {
    "schema_name": "public",
    "enum_name": "debate_session_status",
    "enum_values": "SCHEDULED, ONGOING, COMPLETED, CANCELLED"
  },
  {
    "schema_name": "public",
    "enum_name": "division",
    "enum_values": "VILLIGER, LOWER, UPPER, SENIOR, OPEN"
  },
  {
    "schema_name": "public",
    "enum_name": "gender",
    "enum_values": "MALE, FEMALE, do not wish to specify"
  },
  {
    "schema_name": "public",
    "enum_name": "group_type",
    "enum_values": "GUILD, TEAM"
  },
  {
    "schema_name": "public",
    "enum_name": "log_type",
    "enum_values": "REQUEST_JOIN, JOINED, LEFT, INVITED, KICKED, UPDATED, DELETED, CREATED"
  },
  {
    "schema_name": "public",
    "enum_name": "payment_provider",
    "enum_values": "TOSS, NAVER_PAY, KAKAO_PAY"
  },
  {
    "schema_name": "public",
    "enum_name": "payment_state",
    "enum_values": "REQUESTED, PENDING, FAILED, COMPLETED, AUTHORIZED, ABANDONED, REFUNDED, PREAPPROVED"
  },
  {
    "schema_name": "public",
    "enum_name": "status",
    "enum_values": "PENDING, ACCEPTED, REJECTED, EXPIRED, CANCELLED"
  },
  {
    "schema_name": "public",
    "enum_name": "user_role_type",
    "enum_values": "STUDENT, JUDGE, GUARDIAN"
  }
]

## 40 desktop suggestion

-- Get function definitions for chat automation
SELECT 
    n.nspname AS schema_name,
    p.proname AS function_name,
    pg_get_function_arguments(p.oid) AS arguments,
    pg_get_functiondef(p.oid) AS definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'chat'
OR p.proname LIKE '%chat%'
OR p.proname LIKE '%room%'
OR p.proname LIKE '%message%'
ORDER BY n.nspname, p.proname;

[
  {
    "schema_name": "chat",
    "function_name": "approve_friendship",
    "arguments": "p_friendship_id uuid",
    "definition": "CREATE OR REPLACE FUNCTION chat.approve_friendship(p_friendship_id uuid)\n RETURNS uuid\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\nDECLARE\n  f RECORD;\n  room_id UUID;\nBEGIN\n  -- 1) friendship 존재 및 PENDING 확인\n  SELECT * INTO f\n    FROM public.friendship\n   WHERE id = p_friendship_id;\n  IF NOT FOUND THEN\n    RAISE EXCEPTION 'Friendship % not found', p_friendship_id;\n  END IF;\n  IF f.status = 'ACCEPTED' THEN\n    -- 이미 승인된 경우, 기존 방 있으면 리턴\n    SELECT r.id INTO room_id\n      FROM chat.room r\n      JOIN chat.participant p1 ON p1.room_id = r.id AND p1.student_id = f.user_id\n      JOIN chat.participant p2 ON p2.room_id = r.id AND p2.student_id = f.friend_id\n     WHERE r.type = 'FRIEND'\n     LIMIT 1;\n    IF room_id IS NOT NULL THEN\n      RETURN room_id;\n    END IF;\n  END IF;\n\n  -- 2) 상태 업데이트\n  UPDATE public.friendship\n     SET status = 'ACCEPTED', accpted_at = NOW(), updated_at = NOW()\n   WHERE id = p_friendship_id;\n\n  -- 3) 채팅방 생성\n  INSERT INTO chat.room(type)\n  VALUES ('FRIEND')\n  RETURNING id INTO room_id;\n\n  -- 4) participant 추가\n  INSERT INTO chat.participant(room_id, student_id)\n  VALUES (room_id, f.user_id), (room_id, f.friend_id)\n  ON CONFLICT DO NOTHING;\n\n  RETURN room_id;\nEND;\n$function$\n"
  },
  {
    "schema_name": "chat",
    "function_name": "fn_add_guild_member_to_room",
    "arguments": "",
    "definition": "CREATE OR REPLACE FUNCTION chat.fn_add_guild_member_to_room()\n RETURNS trigger\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\nDECLARE\n  rid UUID;\nBEGIN\n  IF (TG_OP = 'INSERT' AND NEW.status = 'ACCEPTED')\n   OR (TG_OP = 'UPDATE' AND NEW.status = 'ACCEPTED' AND OLD.status <> 'ACCEPTED')\n  THEN\n    SELECT id INTO rid\n      FROM chat.room\n     WHERE type = 'GUILD' AND guild_id = NEW.guild_id\n     LIMIT 1;\n    IF rid IS NOT NULL THEN\n      INSERT INTO chat.participant(room_id, student_id)\n      VALUES (rid, NEW.student_id)\n      ON CONFLICT DO NOTHING;\n    END IF;\n  END IF;\n  RETURN NEW;\nEND;\n$function$\n"
  },
  {
    "schema_name": "chat",
    "function_name": "fn_add_team_member_to_room",
    "arguments": "",
    "definition": "CREATE OR REPLACE FUNCTION chat.fn_add_team_member_to_room()\n RETURNS trigger\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\nDECLARE\n  rid UUID;\nBEGIN\n  IF (TG_OP = 'INSERT' AND NEW.status = 'ACCEPTED')\n   OR (TG_OP = 'UPDATE' AND NEW.status = 'ACCEPTED' AND OLD.status <> 'ACCEPTED')\n  THEN\n    SELECT id INTO rid\n      FROM chat.room\n     WHERE type = 'TEAM' AND team_id = NEW.team_id\n     LIMIT 1;\n    IF rid IS NOT NULL THEN\n      INSERT INTO chat.participant(room_id, student_id)\n      VALUES (rid, NEW.student_id)\n      ON CONFLICT DO NOTHING;\n    END IF;\n  END IF;\n  RETURN NEW;\nEND;\n$function$\n"
  },
  {
    "schema_name": "chat",
    "function_name": "fn_create_guild_room",
    "arguments": "",
    "definition": "CREATE OR REPLACE FUNCTION chat.fn_create_guild_room()\n RETURNS trigger\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\nBEGIN\n  INSERT INTO chat.room(type, title, guild_id)\n  VALUES ('GUILD', NEW.name, NEW.id);\n  RETURN NEW;\nEND;\n$function$\n"
  },
  {
    "schema_name": "chat",
    "function_name": "fn_create_team_room",
    "arguments": "",
    "definition": "CREATE OR REPLACE FUNCTION chat.fn_create_team_room()\n RETURNS trigger\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\nBEGIN\n  INSERT INTO chat.room(type, title, team_id)\n  VALUES ('TEAM', NEW.name, NEW.id);\n  RETURN NEW;\nEND;\n$function$\n"
  },
  {
    "schema_name": "chat",
    "function_name": "fn_sync_guild_room_title",
    "arguments": "",
    "definition": "CREATE OR REPLACE FUNCTION chat.fn_sync_guild_room_title()\n RETURNS trigger\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\nBEGIN\n  UPDATE chat.room\n    SET title = NEW.name, updated_at = NOW()\n  WHERE type = 'GUILD' AND guild_id = NEW.id;\n  RETURN NEW;\nEND;\n$function$\n"
  },
  {
    "schema_name": "chat",
    "function_name": "fn_sync_team_room_title",
    "arguments": "",
    "definition": "CREATE OR REPLACE FUNCTION chat.fn_sync_team_room_title()\n RETURNS trigger\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\nBEGIN\n  UPDATE chat.room\n    SET title = NEW.name, updated_at = NOW()\n  WHERE type = 'TEAM' AND team_id = NEW.id;\n  RETURN NEW;\nEND;\n$function$\n"
  },
  {
    "schema_name": "chat",
    "function_name": "get_friend_room",
    "arguments": "p_user uuid, p_friend uuid",
    "definition": "CREATE OR REPLACE FUNCTION chat.get_friend_room(p_user uuid, p_friend uuid)\n RETURNS chat.room\n LANGUAGE sql\n SECURITY DEFINER\nAS $function$\n  SELECT r.*\n  FROM chat.room r\n  JOIN chat.participant p1 ON p1.room_id = r.id AND p1.student_id = p_user\n  JOIN chat.participant p2 ON p2.room_id = r.id AND p2.student_id = p_friend\n  WHERE r.type = 'FRIEND'\n  LIMIT 1\n$function$\n"
  },
  {
    "schema_name": "chat",
    "function_name": "get_room_messages",
    "arguments": "p_room_id uuid",
    "definition": "CREATE OR REPLACE FUNCTION chat.get_room_messages(p_room_id uuid)\n RETURNS TABLE(id uuid, room_id uuid, sender_id uuid, content text, is_system boolean, created_at timestamp with time zone, updated_at timestamp with time zone, sender_name text, image_path text)\n LANGUAGE sql\n SECURITY DEFINER\nAS $function$\n  SELECT\n    m.id,\n    m.room_id,\n    m.sender_id,\n    m.content,\n    m.is_system,\n    m.created_at,\n    m.updated_at,\n    p.name        AS sender_name,\n    p.image_path\n  FROM chat.message AS m\n  JOIN public.profile AS p\n    ON p.id = m.sender_id\n  WHERE m.room_id = p_room_id\n  ORDER BY m.created_at ASC;\n$function$\n"
  },
  {
    "schema_name": "chat",
    "function_name": "is_room_member",
    "arguments": "p_room_id uuid, p_user_id uuid",
    "definition": "CREATE OR REPLACE FUNCTION chat.is_room_member(p_room_id uuid, p_user_id uuid)\n RETURNS boolean\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\nDECLARE\n  _t   TEXT;\n  _tid UUID;\n  _gid UUID;\nBEGIN\n  SELECT type, team_id, guild_id\n    INTO _t, _tid, _gid\n    FROM chat.room\n   WHERE id = p_room_id;\n\n  IF _t = 'FRIEND' THEN\n    RETURN EXISTS(\n      SELECT 1 FROM chat.participant p\n       WHERE p.room_id    = p_room_id\n         AND p.student_id = p_user_id\n    );\n  ELSIF _t = 'TEAM' THEN\n    RETURN EXISTS(\n      SELECT 1 FROM public.team_member tm\n       WHERE tm.team_id    = _tid\n         AND tm.student_id = p_user_id\n         AND tm.status     = 'ACCEPTED'::public.status\n    );\n  ELSIF _t = 'GUILD' THEN\n    RETURN EXISTS(\n      SELECT 1 FROM public.guild_member gm\n       WHERE gm.guild_id    = _gid\n         AND gm.student_id  = p_user_id\n         AND gm.status      = 'ACCEPTED'::public.status\n    );\n  ELSE\n    RETURN FALSE;\n  END IF;\nEND;\n$function$\n"
  },
  {
    "schema_name": "chat",
    "function_name": "set_timestamp",
    "arguments": "",
    "definition": "CREATE OR REPLACE FUNCTION chat.set_timestamp()\n RETURNS trigger\n LANGUAGE plpgsql\nAS $function$\nBEGIN\n  NEW.updated_at := NOW();\n  RETURN NEW;\nEND;\n$function$\n"
  },
  {
    "schema_name": "pg_catalog",
    "function_name": "pg_logical_emit_message",
    "arguments": "boolean, text, bytea",
    "definition": "CREATE OR REPLACE FUNCTION pg_catalog.pg_logical_emit_message(boolean, text, bytea)\n RETURNS pg_lsn\n LANGUAGE internal\n STRICT\nAS $function$pg_logical_emit_message_bytea$function$\n"
  },
  {
    "schema_name": "pg_catalog",
    "function_name": "pg_logical_emit_message",
    "arguments": "boolean, text, text",
    "definition": "CREATE OR REPLACE FUNCTION pg_catalog.pg_logical_emit_message(boolean, text, text)\n RETURNS pg_lsn\n LANGUAGE internal\n STRICT\nAS $function$pg_logical_emit_message_text$function$\n"
  }
]

## 41 desktop suggestion

-- Check storage configuration
SELECT 
    id,
    name,
    owner,
    created_at,
    updated_at,
    public,
    avif_autodetection,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets
ORDER BY name;

[
  {
    "id": "logo",
    "name": "logo",
    "owner": null,
    "created_at": "2025-04-05 02:15:45.864681+00",
    "updated_at": "2025-04-05 02:15:45.864681+00",
    "public": true,
    "avif_autodetection": false,
    "file_size_limit": null,
    "allowed_mime_types": null
  },
  {
    "id": "profile-images",
    "name": "profile-images",
    "owner": null,
    "created_at": "2025-04-06 13:36:52.681039+00",
    "updated_at": "2025-04-06 13:36:52.681039+00",
    "public": true,
    "avif_autodetection": false,
    "file_size_limit": 102400,
    "allowed_mime_types": null
  },
  {
    "id": "team-assets",
    "name": "team-assets",
    "owner": null,
    "created_at": "2025-05-12 15:57:17.462742+00",
    "updated_at": "2025-05-12 15:57:17.462742+00",
    "public": true,
    "avif_autodetection": false,
    "file_size_limit": null,
    "allowed_mime_types": null
  }
]

## 42 desktop suggestion 

error 
ERROR:  42703: column "status" does not exist
LINE 35:     WHERE status != 'COMPLETED'


-- Get system usage statistics
WITH user_stats AS (
    SELECT 
        'Total Users' as metric,
        COUNT(*) as count
    FROM auth.users
    
    UNION ALL
    
    SELECT 
        'Students',
        COUNT(*)
    FROM public.student
    
    UNION ALL
    
    SELECT 
        'Judges',
        COUNT(*)
    FROM public.judge
    
    UNION ALL
    
    SELECT 
        'Teams',
        COUNT(*)
    FROM public.team
    
    UNION ALL
    
    SELECT 
        'Active Debates',
        COUNT(*)
    FROM debate.debates
    WHERE status != 'COMPLETED'
)
SELECT * FROM user_stats
ORDER BY metric;


SEE ERROR 

## 43 desktop suggestion error

ERROR:  42P01: relation "debate.scorecards" does not exist
LINE 18: LEFT JOIN debate.scorecards s ON b.id = s.ballot_id

-- Examine debate workflow relationships
SELECT 
    'debates_to_ballots' as relationship,
    COUNT(DISTINCT d.id) as debates_count,
    COUNT(DISTINCT b.id) as ballots_count,
    COUNT(DISTINCT b.id)::float / NULLIF(COUNT(DISTINCT d.id), 0) as ballots_per_debate
FROM debate.debates d
LEFT JOIN debate.ballots b ON d.id = b.debate_id

UNION ALL

SELECT 
    'ballots_to_scorecards',
    COUNT(DISTINCT b.id),
    COUNT(DISTINCT s.id),
    COUNT(DISTINCT s.id)::float / NULLIF(COUNT(DISTINCT b.id), 0)
FROM debate.ballots b
LEFT JOIN debate.scorecards s ON b.id = s.ballot_id

UNION ALL

SELECT 
    'scorecards_to_scores',
    COUNT(DISTINCT s.id),
    COUNT(DISTINCT sc.id),
    COUNT(DISTINCT sc.id)::float / NULLIF(COUNT(DISTINCT s.id), 0)
FROM debate.scorecards s
LEFT JOIN debate.scores sc ON s.id = sc.scorecard_id;

SEE ERROR


## 44 desktop suggestion

-- Check what debate-related tables exist and their relationships
SELECT DISTINCT
    tc.table_schema,
    tc.table_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_schema AS ref_schema,
    ccu.table_name AS ref_table,
    ccu.column_name AS ref_column
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
LEFT JOIN information_schema.constraint_column_usage ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_schema = 'debate'
    AND tc.constraint_type = 'FOREIGN KEY'
ORDER BY tc.table_name, kcu.column_name;

[
  {
    "table_schema": "debate",
    "table_name": "ballots",
    "constraint_type": "FOREIGN KEY",
    "column_name": "debate_id",
    "ref_schema": "debate",
    "ref_table": "debates",
    "ref_column": "id"
  },
  {
    "table_schema": "debate",
    "table_name": "ballots",
    "constraint_type": "FOREIGN KEY",
    "column_name": "format_id",
    "ref_schema": "debate",
    "ref_table": "debate_formats",
    "ref_column": "id"
  },
  {
    "table_schema": "debate",
    "table_name": "ballots",
    "constraint_type": "FOREIGN KEY",
    "column_name": "judge_id",
    "ref_schema": "public",
    "ref_table": "judge",
    "ref_column": "id"
  },
  {
    "table_schema": "debate",
    "table_name": "criteria",
    "constraint_type": "FOREIGN KEY",
    "column_name": "format_id",
    "ref_schema": "debate",
    "ref_table": "debate_formats",
    "ref_column": "id"
  },
  {
    "table_schema": "debate",
    "table_name": "debate_participants",
    "constraint_type": "FOREIGN KEY",
    "column_name": "debate_team_id",
    "ref_schema": "debate",
    "ref_table": "debate_teams",
    "ref_column": "id"
  },
  {
    "table_schema": "debate",
    "table_name": "debate_participants",
    "constraint_type": "FOREIGN KEY",
    "column_name": "user_id",
    "ref_schema": "public",
    "ref_table": "student",
    "ref_column": "user_id"
  },
  {
    "table_schema": "debate",
    "table_name": "debate_teams",
    "constraint_type": "FOREIGN KEY",
    "column_name": "debate_id",
    "ref_schema": "debate",
    "ref_table": "debates",
    "ref_column": "id"
  },
  {
    "table_schema": "debate",
    "table_name": "debate_teams",
    "constraint_type": "FOREIGN KEY",
    "column_name": "side_id",
    "ref_schema": "debate",
    "ref_table": "sides",
    "ref_column": "id"
  },
  {
    "table_schema": "debate",
    "table_name": "debates",
    "constraint_type": "FOREIGN KEY",
    "column_name": "debate_format_id",
    "ref_schema": "debate",
    "ref_table": "debate_formats",
    "ref_column": "id"
  },
  {
    "table_schema": "debate",
    "table_name": "debates",
    "constraint_type": "FOREIGN KEY",
    "column_name": "motion_id",
    "ref_schema": "debate",
    "ref_table": "motions",
    "ref_column": "id"
  },
  {
    "table_schema": "debate",
    "table_name": "format_rounds",
    "constraint_type": "FOREIGN KEY",
    "column_name": "debate_format_id",
    "ref_schema": "debate",
    "ref_table": "debate_formats",
    "ref_column": "id"
  },
  {
    "table_schema": "debate",
    "table_name": "format_rounds",
    "constraint_type": "FOREIGN KEY",
    "column_name": "round_template_id",
    "ref_schema": "debate",
    "ref_table": "round_templates",
    "ref_column": "id"
  },
  {
    "table_schema": "debate",
    "table_name": "format_rounds",
    "constraint_type": "FOREIGN KEY",
    "column_name": "side_id",
    "ref_schema": "debate",
    "ref_table": "sides",
    "ref_column": "id"
  },
  {
    "table_schema": "debate",
    "table_name": "genres",
    "constraint_type": "FOREIGN KEY",
    "column_name": "proposer_id",
    "ref_schema": "public",
    "ref_table": "profile",
    "ref_column": "id"
  },
  {
    "table_schema": "debate",
    "table_name": "judge_comments",
    "constraint_type": "FOREIGN KEY",
    "column_name": "criteria_id",
    "ref_schema": "debate",
    "ref_table": "criteria",
    "ref_column": "id"
  },
  {
    "table_schema": "debate",
    "table_name": "judge_comments",
    "constraint_type": "FOREIGN KEY",
    "column_name": "judge_id",
    "ref_schema": "public",
    "ref_table": "judge",
    "ref_column": "user_id"
  },
  {
    "table_schema": "debate",
    "table_name": "judge_comments",
    "constraint_type": "FOREIGN KEY",
    "column_name": "video_id",
    "ref_schema": "debate",
    "ref_table": "videos",
    "ref_column": "id"
  },
  {
    "table_schema": "debate",
    "table_name": "judge_scores",
    "constraint_type": "FOREIGN KEY",
    "column_name": "criteria_id",
    "ref_schema": "debate",
    "ref_table": "criteria",
    "ref_column": "id"
  },
  {
    "table_schema": "debate",
    "table_name": "judge_scores",
    "constraint_type": "FOREIGN KEY",
    "column_name": "debate_id",
    "ref_schema": "debate",
    "ref_table": "debates",
    "ref_column": "id"
  },
  {
    "table_schema": "debate",
    "table_name": "judge_scores",
    "constraint_type": "FOREIGN KEY",
    "column_name": "judge_id",
    "ref_schema": "public",
    "ref_table": "judge",
    "ref_column": "user_id"
  },
  {
    "table_schema": "debate",
    "table_name": "matchmaking_queue_entries",
    "constraint_type": "FOREIGN KEY",
    "column_name": "debate_format_id",
    "ref_schema": "debate",
    "ref_table": "debate_formats",
    "ref_column": "id"
  },
  {
    "table_schema": "debate",
    "table_name": "matchmaking_queue_entries",
    "constraint_type": "FOREIGN KEY",
    "column_name": "debate_id",
    "ref_schema": "debate",
    "ref_table": "debates",
    "ref_column": "id"
  },
  {
    "table_schema": "debate",
    "table_name": "matchmaking_queue_entries",
    "constraint_type": "FOREIGN KEY",
    "column_name": "opponent_id",
    "ref_schema": "public",
    "ref_table": "team",
    "ref_column": "id"
  },
  {
    "table_schema": "debate",
    "table_name": "matchmaking_queue_entries",
    "constraint_type": "FOREIGN KEY",
    "column_name": "team_id",
    "ref_schema": "public",
    "ref_table": "team",
    "ref_column": "id"
  },
  {
    "table_schema": "debate",
    "table_name": "motions",
    "constraint_type": "FOREIGN KEY",
    "column_name": "genre_id",
    "ref_schema": "debate",
    "ref_table": "genres",
    "ref_column": "id"
  },
  {
    "table_schema": "debate",
    "table_name": "motions",
    "constraint_type": "FOREIGN KEY",
    "column_name": "proposer_id",
    "ref_schema": "public",
    "ref_table": "profile",
    "ref_column": "id"
  },
  {
    "table_schema": "debate",
    "table_name": "speeches",
    "constraint_type": "FOREIGN KEY",
    "column_name": "debate_id",
    "ref_schema": "debate",
    "ref_table": "debates",
    "ref_column": "id"
  },
  {
    "table_schema": "debate",
    "table_name": "speeches",
    "constraint_type": "FOREIGN KEY",
    "column_name": "format_round_id",
    "ref_schema": "debate",
    "ref_table": "format_rounds",
    "ref_column": "id"
  },
  {
    "table_schema": "debate",
    "table_name": "speeches",
    "constraint_type": "FOREIGN KEY",
    "column_name": "participant_id",
    "ref_schema": "debate",
    "ref_table": "debate_participants",
    "ref_column": "id"
  },
  {
    "table_schema": "debate",
    "table_name": "videos",
    "constraint_type": "FOREIGN KEY",
    "column_name": "debate_id",
    "ref_schema": "debate",
    "ref_table": "debates",
    "ref_column": "id"
  },
  {
    "table_schema": "debate",
    "table_name": "videos",
    "constraint_type": "FOREIGN KEY",
    "column_name": "uploaded_by",
    "ref_schema": "public",
    "ref_table": "profile",
    "ref_column": "id"
  }
]

## 45 desktop suggestion

-- Look for any computed columns or generated data
SELECT 
    c.table_schema,
    c.table_name,
    c.column_name,
    c.data_type,
    c.is_generated,
    c.generation_expression,
    c.column_default
FROM information_schema.columns c
WHERE c.table_schema IN ('public', 'debate', 'chat')
    AND (c.is_generated = 'ALWAYS' 
         OR c.column_default LIKE '%nextval%'
         OR c.column_default LIKE '%gen_random_uuid%'
         OR c.column_default LIKE '%CURRENT%'
         OR c.column_default LIKE '%now()%')
ORDER BY c.table_schema, c.table_name, c.column_name;


[
  {
    "table_schema": "chat",
    "table_name": "message",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "now()"
  },
  {
    "table_schema": "chat",
    "table_name": "message",
    "column_name": "id",
    "data_type": "uuid",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "chat",
    "table_name": "message",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "now()"
  },
  {
    "table_schema": "chat",
    "table_name": "participant",
    "column_name": "id",
    "data_type": "uuid",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "chat",
    "table_name": "participant",
    "column_name": "joined_at",
    "data_type": "timestamp with time zone",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "now()"
  },
  {
    "table_schema": "chat",
    "table_name": "participant",
    "column_name": "last_read_at",
    "data_type": "timestamp with time zone",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "now()"
  },
  {
    "table_schema": "chat",
    "table_name": "room",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "now()"
  },
  {
    "table_schema": "chat",
    "table_name": "room",
    "column_name": "id",
    "data_type": "uuid",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "chat",
    "table_name": "room",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "now()"
  },
  {
    "table_schema": "debate",
    "table_name": "ballots",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "CURRENT_TIMESTAMP"
  },
  {
    "table_schema": "debate",
    "table_name": "ballots",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "CURRENT_TIMESTAMP"
  },
  {
    "table_schema": "debate",
    "table_name": "criteria",
    "column_name": "id",
    "data_type": "uuid",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "debate",
    "table_name": "debate_formats",
    "column_name": "id",
    "data_type": "uuid",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "debate",
    "table_name": "debate_participants",
    "column_name": "id",
    "data_type": "uuid",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "debate",
    "table_name": "debate_teams",
    "column_name": "id",
    "data_type": "uuid",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "debate",
    "table_name": "debates",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "now()"
  },
  {
    "table_schema": "debate",
    "table_name": "debates",
    "column_name": "id",
    "data_type": "uuid",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "debate",
    "table_name": "format_rounds",
    "column_name": "id",
    "data_type": "uuid",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "debate",
    "table_name": "genres",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "CURRENT_TIMESTAMP"
  },
  {
    "table_schema": "debate",
    "table_name": "genres",
    "column_name": "id",
    "data_type": "uuid",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "debate",
    "table_name": "genres",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "CURRENT_TIMESTAMP"
  },
  {
    "table_schema": "debate",
    "table_name": "judge_comments",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "now()"
  },
  {
    "table_schema": "debate",
    "table_name": "judge_comments",
    "column_name": "id",
    "data_type": "uuid",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "debate",
    "table_name": "judge_scores",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "now()"
  },
  {
    "table_schema": "debate",
    "table_name": "judge_scores",
    "column_name": "id",
    "data_type": "uuid",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "debate",
    "table_name": "matchmaking_queue_entries",
    "column_name": "id",
    "data_type": "uuid",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "debate",
    "table_name": "matchmaking_queue_entries",
    "column_name": "queued_at",
    "data_type": "timestamp with time zone",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "CURRENT_TIMESTAMP"
  },
  {
    "table_schema": "debate",
    "table_name": "motions",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "CURRENT_TIMESTAMP"
  },
  {
    "table_schema": "debate",
    "table_name": "motions",
    "column_name": "id",
    "data_type": "uuid",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "debate",
    "table_name": "motions",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "CURRENT_TIMESTAMP"
  },
  {
    "table_schema": "debate",
    "table_name": "round_templates",
    "column_name": "id",
    "data_type": "uuid",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "debate",
    "table_name": "sides",
    "column_name": "id",
    "data_type": "uuid",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "debate",
    "table_name": "speeches",
    "column_name": "delivered_at",
    "data_type": "timestamp with time zone",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "now()"
  },
  {
    "table_schema": "debate",
    "table_name": "speeches",
    "column_name": "id",
    "data_type": "uuid",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "debate",
    "table_name": "videos",
    "column_name": "id",
    "data_type": "uuid",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "debate",
    "table_name": "videos",
    "column_name": "uploaded_at",
    "data_type": "timestamp with time zone",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "admin",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "CURRENT_TIMESTAMP"
  },
  {
    "table_schema": "public",
    "table_name": "admin",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "CURRENT_TIMESTAMP"
  },
  {
    "table_schema": "public",
    "table_name": "bank_account",
    "column_name": "id",
    "data_type": "uuid",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "public",
    "table_name": "friendship",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "friendship",
    "column_name": "id",
    "data_type": "uuid",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "public",
    "table_name": "friendship",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "guardian",
    "column_name": "id",
    "data_type": "uuid",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "public",
    "table_name": "guardian_request",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "guardian_request",
    "column_name": "id",
    "data_type": "uuid",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "public",
    "table_name": "guild",
    "column_name": "created_at",
    "data_type": "timestamp without time zone",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "CURRENT_TIMESTAMP"
  },
  {
    "table_schema": "public",
    "table_name": "guild",
    "column_name": "id",
    "data_type": "uuid",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "public",
    "table_name": "guild_member",
    "column_name": "created_at",
    "data_type": "timestamp without time zone",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "CURRENT_TIMESTAMP"
  },
  {
    "table_schema": "public",
    "table_name": "guild_member",
    "column_name": "id",
    "data_type": "uuid",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "public",
    "table_name": "invitation",
    "column_name": "created_at",
    "data_type": "timestamp without time zone",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "CURRENT_TIMESTAMP"
  },
  {
    "table_schema": "public",
    "table_name": "invitation",
    "column_name": "id",
    "data_type": "uuid",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "public",
    "table_name": "judge",
    "column_name": "id",
    "data_type": "uuid",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "public",
    "table_name": "log",
    "column_name": "created_at",
    "data_type": "timestamp without time zone",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "CURRENT_TIMESTAMP"
  },
  {
    "table_schema": "public",
    "table_name": "log",
    "column_name": "id",
    "data_type": "uuid",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "public",
    "table_name": "payment_history",
    "column_name": "id",
    "data_type": "uuid",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "public",
    "table_name": "rating",
    "column_name": "created_at",
    "data_type": "timestamp without time zone",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "CURRENT_TIMESTAMP"
  },
  {
    "table_schema": "public",
    "table_name": "rating",
    "column_name": "id",
    "data_type": "uuid",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "public",
    "table_name": "school",
    "column_name": "created_at",
    "data_type": "timestamp without time zone",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "school",
    "column_name": "id",
    "data_type": "uuid",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "public",
    "table_name": "school",
    "column_name": "updated_at",
    "data_type": "timestamp without time zone",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "student",
    "column_name": "id",
    "data_type": "uuid",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "public",
    "table_name": "team",
    "column_name": "created_at",
    "data_type": "timestamp without time zone",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "CURRENT_TIMESTAMP"
  },
  {
    "table_schema": "public",
    "table_name": "team",
    "column_name": "id",
    "data_type": "uuid",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "public",
    "table_name": "team_member",
    "column_name": "created_at",
    "data_type": "timestamp without time zone",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "CURRENT_TIMESTAMP"
  },
  {
    "table_schema": "public",
    "table_name": "team_member",
    "column_name": "id",
    "data_type": "uuid",
    "is_generated": "NEVER",
    "generation_expression": null,
    "column_default": "gen_random_uuid()"
  }
]

## 46 desktop suggestion

-- Get the actual structure of the debates table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'debate' 
    AND table_name = 'debates'
ORDER BY ordinal_position;

[
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "column_name": "debate_format_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "column_name": "motion_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "column_name": "scheduled_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "column_name": "mode",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO",
    "column_default": null
  }
]

## 47 desktop suggestion

-- Check if video recording system exists
SELECT 
    table_schema,
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'debate' 
    AND table_name = 'videos'
ORDER BY ordinal_position;

-- If no videos table, check if recordings are stored elsewhere
SELECT 
    table_schema,
    table_name,
    column_name
FROM information_schema.columns
WHERE column_name LIKE '%video%' 
    OR column_name LIKE '%recording%'
    OR column_name LIKE '%media%'
ORDER BY table_schema, table_name;

[
  {
    "table_schema": "debate",
    "table_name": "judge_comments",
    "column_name": "video_id"
  },
  {
    "table_schema": "pg_catalog",
    "table_name": "pg_index",
    "column_name": "indimmediate"
  }
]

## 48 desktop suggestion

-- Find payment-related tables
SELECT 
    table_schema,
    table_name
FROM information_schema.tables
WHERE table_name LIKE '%payment%' 
    OR table_name LIKE '%subscription%'
    OR table_name LIKE '%billing%'
ORDER BY table_schema, table_name;

-- Get payment structure if exists
SELECT 
    column_name,
    data_type,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
    AND table_name LIKE '%payment%'
ORDER BY ordinal_position;

[
  {
    "column_name": "id",
    "data_type": "uuid",
    "column_default": "gen_random_uuid()"
  },
  {
    "column_name": "guardian_id",
    "data_type": "uuid",
    "column_default": null
  },
  {
    "column_name": "amount",
    "data_type": "integer",
    "column_default": null
  },
  {
    "column_name": "currency_code",
    "data_type": "text",
    "column_default": null
  },
  {
    "column_name": "payment_provider",
    "data_type": "USER-DEFINED",
    "column_default": null
  },
  {
    "column_name": "payment_date",
    "data_type": "timestamp without time zone",
    "column_default": null
  },
  {
    "column_name": "payment_state",
    "data_type": "USER-DEFINED",
    "column_default": null
  }
]

## 49 desktop suggestion

-- Check for user activity tracking
SELECT 
    table_schema,
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public' 
    AND table_name IN ('student', 'profile')
    AND (column_name LIKE '%exp%' 
         OR column_name LIKE '%level%' 
         OR column_name LIKE '%ranking%'
         OR column_name LIKE '%division%')
ORDER BY table_name, ordinal_position;

[
  {
    "table_schema": "public",
    "table_name": "student",
    "column_name": "division",
    "data_type": "USER-DEFINED"
  },
  {
    "table_schema": "public",
    "table_name": "student",
    "column_name": "exp",
    "data_type": "integer"
  },
  {
    "table_schema": "public",
    "table_name": "student",
    "column_name": "ranking",
    "data_type": "smallint"
  },
  {
    "table_schema": "public",
    "table_name": "student",
    "column_name": "level",
    "data_type": "integer"
  }
]

## 50 desktop suggestion

-- Check for notification infrastructure
SELECT 
    table_schema,
    table_name
FROM information_schema.tables
WHERE table_name LIKE '%notif%' 
    OR table_name LIKE '%alert%'
    OR table_name LIKE '%announcement%'
ORDER BY table_schema, table_name;

"Success. No row returned."



## 51 desktop suggestion

-- Understanding the complete debate workflow
SELECT 
    column_name,
    data_type,
    column_default
FROM information_schema.columns
WHERE table_schema = 'debate' 
    AND table_name = 'debates'
ORDER BY ordinal_position;

-- Check for session or schedule management
SELECT 
    table_schema,
    table_name
FROM information_schema.tables
WHERE table_name LIKE '%session%' 
    OR table_name LIKE '%schedule%'
ORDER BY table_schema, table_name;

[
  {
    "table_schema": "auth",
    "table_name": "sessions"
  }
]

## 52 desktop suggestion

-- Find league-related structures
SELECT DISTINCT
    data_type,
    udt_schema,
    udt_name
FROM information_schema.columns
WHERE column_name = 'league_id'
    AND table_schema = 'debate';

-- Get league enum values or table
SELECT 
    n.nspname AS schema_name,
    t.typname AS type_name,
    string_agg(e.enumlabel, ', ' ORDER BY e.enumsortorder) AS values
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
WHERE t.typname LIKE '%league%'
GROUP BY n.nspname, t.typname;

[
  {
    "data_type": "USER-DEFINED",
    "udt_schema": "public",
    "udt_name": "division"
  }
]

## 53 desktop suggestion 

-- Corrected query for actual system usage
WITH user_stats AS (
    SELECT 'Total Users' as metric, COUNT(*) as count FROM auth.users
    UNION ALL
    SELECT 'Students', COUNT(*) FROM public.student
    UNION ALL
    SELECT 'Judges', COUNT(*) FROM public.judge
    UNION ALL
    SELECT 'Teams', COUNT(*) FROM public.team
    UNION ALL
    SELECT 'Total Debates', COUNT(*) FROM debate.debates
    UNION ALL
    SELECT 'Debates with SYNC mode', COUNT(*) FROM debate.debates WHERE mode = 'SYNC'
    UNION ALL
    SELECT 'Debates with ASYNC mode', COUNT(*) FROM debate.debates WHERE mode = 'ASYNC'
)
SELECT * FROM user_stats
ORDER BY count DESC;

[
  {
    "metric": "Total Users",
    "count": 21
  },
  {
    "metric": "Students",
    "count": 6
  },
  {
    "metric": "Judges",
    "count": 2
  },
  {
    "metric": "Teams",
    "count": 2
  },
  {
    "metric": "Total Debates",
    "count": 0
  },
  {
    "metric": "Debates with SYNC mode",
    "count": 0
  },
  {
    "metric": "Debates with ASYNC mode",
    "count": 0
  }
]









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

