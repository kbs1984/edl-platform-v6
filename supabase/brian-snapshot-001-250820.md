# RLS Policies

[
  {
    "policies_snapshot": {
      "policies": [
        {
          "schemaname": "public",
          "tablename": "profiles",
          "policyname": "Anyone can view profiles",
          "permissive": "PERMISSIVE",
          "roles": [
            "anon",
            "authenticated"
          ],
          "cmd": "SELECT",
          "qual": "true",
          "with_check": null
        },
        {
          "schemaname": "public",
          "tablename": "profiles",
          "policyname": "Profiles viewable by authenticated users",
          "permissive": "PERMISSIVE",
          "roles": [
            "anon",
            "authenticated"
          ],
          "cmd": "SELECT",
          "qual": "true",
          "with_check": null
        },
        {
          "schemaname": "public",
          "tablename": "profiles",
          "policyname": "Users can insert own profile",
          "permissive": "PERMISSIVE",
          "roles": [
            "authenticated"
          ],
          "cmd": "INSERT",
          "qual": null,
          "with_check": "((user_id = auth.uid()) OR (proper_user_id IN ( SELECT users.id\n   FROM users\n  WHERE (users.auth_id = auth.uid()))))"
        },
        {
          "schemaname": "public",
          "tablename": "profiles",
          "policyname": "Users can update own profile",
          "permissive": "PERMISSIVE",
          "roles": [
            "authenticated"
          ],
          "cmd": "UPDATE",
          "qual": "((user_id = auth.uid()) OR (proper_user_id IN ( SELECT users.id\n   FROM users\n  WHERE (users.auth_id = auth.uid()))))",
          "with_check": "((user_id = auth.uid()) OR (proper_user_id IN ( SELECT users.id\n   FROM users\n  WHERE (users.auth_id = auth.uid()))))"
        },
        {
          "schemaname": "public",
          "tablename": "profiles",
          "policyname": "Users create own profile",
          "permissive": "PERMISSIVE",
          "roles": [
            "authenticated"
          ],
          "cmd": "INSERT",
          "qual": null,
          "with_check": "(auth.uid() = user_id)"
        },
        {
          "schemaname": "public",
          "tablename": "profiles",
          "policyname": "Users delete own profile",
          "permissive": "PERMISSIVE",
          "roles": [
            "authenticated"
          ],
          "cmd": "DELETE",
          "qual": "(auth.uid() = user_id)",
          "with_check": null
        },
        {
          "schemaname": "public",
          "tablename": "profiles",
          "policyname": "Users update own profile",
          "permissive": "PERMISSIVE",
          "roles": [
            "authenticated"
          ],
          "cmd": "UPDATE",
          "qual": "(auth.uid() = user_id)",
          "with_check": "(auth.uid() = user_id)"
        },
        {
          "schemaname": "public",
          "tablename": "team_join_requests",
          "policyname": "Founders respond to join requests",
          "permissive": "PERMISSIVE",
          "roles": [
            "authenticated"
          ],
          "cmd": "UPDATE",
          "qual": "(team_id IN ( SELECT teams.id\n   FROM teams\n  WHERE (teams.founder_id IN ( SELECT profiles.id\n           FROM profiles\n          WHERE (profiles.user_id = auth.uid())))))",
          "with_check": "(team_id IN ( SELECT teams.id\n   FROM teams\n  WHERE (teams.founder_id IN ( SELECT profiles.id\n           FROM profiles\n          WHERE (profiles.user_id = auth.uid())))))"
        },
        {
          "schemaname": "public",
          "tablename": "team_join_requests",
          "policyname": "Manage join requests",
          "permissive": "PERMISSIVE",
          "roles": [
            "authenticated"
          ],
          "cmd": "DELETE",
          "qual": "((player_id IN ( SELECT profiles.id\n   FROM profiles\n  WHERE (profiles.user_id = auth.uid()))) OR (team_id IN ( SELECT teams.id\n   FROM teams\n  WHERE (teams.founder_id IN ( SELECT profiles.id\n           FROM profiles\n          WHERE (profiles.user_id = auth.uid()))))))",
          "with_check": null
        },
        {
          "schemaname": "public",
          "tablename": "team_join_requests",
          "policyname": "Players create join requests",
          "permissive": "PERMISSIVE",
          "roles": [
            "authenticated"
          ],
          "cmd": "INSERT",
          "qual": null,
          "with_check": "(player_id IN ( SELECT profiles.id\n   FROM profiles\n  WHERE (profiles.user_id = auth.uid())))"
        },
        {
          "schemaname": "public",
          "tablename": "team_join_requests",
          "policyname": "View relevant join requests",
          "permissive": "PERMISSIVE",
          "roles": [
            "authenticated"
          ],
          "cmd": "SELECT",
          "qual": "((player_id IN ( SELECT profiles.id\n   FROM profiles\n  WHERE (profiles.user_id = auth.uid()))) OR (team_id IN ( SELECT teams.id\n   FROM teams\n  WHERE (teams.founder_id IN ( SELECT profiles.id\n           FROM profiles\n          WHERE (profiles.user_id = auth.uid()))))))",
          "with_check": null
        },
        {
          "schemaname": "public",
          "tablename": "team_members",
          "policyname": "Anyone can view team members",
          "permissive": "PERMISSIVE",
          "roles": [
            "anon",
            "authenticated"
          ],
          "cmd": "SELECT",
          "qual": "true",
          "with_check": null
        },
        {
          "schemaname": "public",
          "tablename": "team_members",
          "policyname": "Founders add team members",
          "permissive": "PERMISSIVE",
          "roles": [
            "authenticated"
          ],
          "cmd": "INSERT",
          "qual": null,
          "with_check": "(team_id IN ( SELECT teams.id\n   FROM teams\n  WHERE (teams.founder_id IN ( SELECT profiles.id\n           FROM profiles\n          WHERE (profiles.user_id = auth.uid())))))"
        },
        {
          "schemaname": "public",
          "tablename": "team_members",
          "policyname": "Manage team membership",
          "permissive": "PERMISSIVE",
          "roles": [
            "authenticated"
          ],
          "cmd": "DELETE",
          "qual": "((team_id IN ( SELECT teams.id\n   FROM teams\n  WHERE (teams.founder_id IN ( SELECT profiles.id\n           FROM profiles\n          WHERE (profiles.user_id = auth.uid()))))) OR (player_id IN ( SELECT profiles.id\n   FROM profiles\n  WHERE (profiles.user_id = auth.uid()))))",
          "with_check": null
        },
        {
          "schemaname": "public",
          "tablename": "teams",
          "policyname": "Anyone can view teams",
          "permissive": "PERMISSIVE",
          "roles": [
            "anon",
            "authenticated"
          ],
          "cmd": "SELECT",
          "qual": "true",
          "with_check": null
        },
        {
          "schemaname": "public",
          "tablename": "teams",
          "policyname": "Authenticated users create teams",
          "permissive": "PERMISSIVE",
          "roles": [
            "authenticated"
          ],
          "cmd": "INSERT",
          "qual": null,
          "with_check": "(EXISTS ( SELECT 1\n   FROM profiles\n  WHERE (profiles.user_id = auth.uid())))"
        },
        {
          "schemaname": "public",
          "tablename": "teams",
          "policyname": "Founders delete their teams",
          "permissive": "PERMISSIVE",
          "roles": [
            "authenticated"
          ],
          "cmd": "DELETE",
          "qual": "(founder_id IN ( SELECT profiles.id\n   FROM profiles\n  WHERE (profiles.user_id = auth.uid())))",
          "with_check": null
        },
        {
          "schemaname": "public",
          "tablename": "teams",
          "policyname": "Founders update their teams",
          "permissive": "PERMISSIVE",
          "roles": [
            "authenticated"
          ],
          "cmd": "UPDATE",
          "qual": "(founder_id IN ( SELECT profiles.id\n   FROM profiles\n  WHERE (profiles.user_id = auth.uid())))",
          "with_check": "(founder_id IN ( SELECT profiles.id\n   FROM profiles\n  WHERE (profiles.user_id = auth.uid())))"
        },
        {
          "schemaname": "public",
          "tablename": "users",
          "policyname": "Allow signup process",
          "permissive": "PERMISSIVE",
          "roles": [
            "anon",
            "authenticated"
          ],
          "cmd": "INSERT",
          "qual": null,
          "with_check": "true"
        },
        {
          "schemaname": "public",
          "tablename": "users",
          "policyname": "Anyone can view users",
          "permissive": "PERMISSIVE",
          "roles": [
            "anon",
            "authenticated"
          ],
          "cmd": "SELECT",
          "qual": "true",
          "with_check": null
        },
        {
          "schemaname": "public",
          "tablename": "users",
          "policyname": "Users update own record",
          "permissive": "PERMISSIVE",
          "roles": [
            "authenticated"
          ],
          "cmd": "UPDATE",
          "qual": "(auth_id = auth.uid())",
          "with_check": "(auth_id = auth.uid())"
        }
      ]
    }
  }
]

# Table Structure

[
  {
    "tables_snapshot": {
      "tables": [
        {
          "table_name": "profiles",
          "column_name": "id",
          "data_type": "uuid",
          "is_nullable": "NO",
          "column_default": "gen_random_uuid()",
          "character_maximum_length": null
        },
        {
          "table_name": "profiles",
          "column_name": "user_id",
          "data_type": "uuid",
          "is_nullable": "NO",
          "column_default": null,
          "character_maximum_length": null
        },
        {
          "table_name": "profiles",
          "column_name": "call_sign",
          "data_type": "character varying",
          "is_nullable": "NO",
          "column_default": null,
          "character_maximum_length": 50
        },
        {
          "table_name": "profiles",
          "column_name": "role",
          "data_type": "character varying",
          "is_nullable": "YES",
          "column_default": null,
          "character_maximum_length": 20
        },
        {
          "table_name": "profiles",
          "column_name": "created_at",
          "data_type": "timestamp with time zone",
          "is_nullable": "YES",
          "column_default": "now()",
          "character_maximum_length": null
        },
        {
          "table_name": "profiles",
          "column_name": "_why_exists",
          "data_type": "text",
          "is_nullable": "YES",
          "column_default": "'Core user identity from Canvas 001-1 onboarding flow'::text",
          "character_maximum_length": null
        },
        {
          "table_name": "profiles",
          "column_name": "_canvas_source",
          "data_type": "text",
          "is_nullable": "YES",
          "column_default": "'001-1.seed.Authentication.canvas'::text",
          "character_maximum_length": null
        },
        {
          "table_name": "profiles",
          "column_name": "avatar_url",
          "data_type": "text",
          "is_nullable": "YES",
          "column_default": null,
          "character_maximum_length": null
        },
        {
          "table_name": "profiles",
          "column_name": "personality_type",
          "data_type": "character varying",
          "is_nullable": "YES",
          "column_default": null,
          "character_maximum_length": 20
        },
        {
          "table_name": "profiles",
          "column_name": "ocean_scores",
          "data_type": "jsonb",
          "is_nullable": "YES",
          "column_default": null,
          "character_maximum_length": null
        },
        {
          "table_name": "profiles",
          "column_name": "school_id",
          "data_type": "uuid",
          "is_nullable": "YES",
          "column_default": null,
          "character_maximum_length": null
        },
        {
          "table_name": "profiles",
          "column_name": "grade",
          "data_type": "integer",
          "is_nullable": "YES",
          "column_default": null,
          "character_maximum_length": null
        },
        {
          "table_name": "profiles",
          "column_name": "division",
          "data_type": "character varying",
          "is_nullable": "YES",
          "column_default": null,
          "character_maximum_length": 20
        },
        {
          "table_name": "profiles",
          "column_name": "_canvas_evidence",
          "data_type": "text",
          "is_nullable": "YES",
          "column_default": "'230 player + 49 supervisor + 105 enabler mentions'::text",
          "character_maximum_length": null
        },
        {
          "table_name": "profiles",
          "column_name": "_frequency",
          "data_type": "integer",
          "is_nullable": "YES",
          "column_default": "384",
          "character_maximum_length": null
        },
        {
          "table_name": "profiles",
          "column_name": "proper_user_id",
          "data_type": "uuid",
          "is_nullable": "YES",
          "column_default": null,
          "character_maximum_length": null
        },
        {
          "table_name": "profiles",
          "column_name": "grade_level",
          "data_type": "integer",
          "is_nullable": "YES",
          "column_default": null,
          "character_maximum_length": null
        },
        {
          "table_name": "team_join_requests",
          "column_name": "id",
          "data_type": "uuid",
          "is_nullable": "NO",
          "column_default": "gen_random_uuid()",
          "character_maximum_length": null
        },
        {
          "table_name": "team_join_requests",
          "column_name": "team_id",
          "data_type": "uuid",
          "is_nullable": "YES",
          "column_default": null,
          "character_maximum_length": null
        },
        {
          "table_name": "team_join_requests",
          "column_name": "player_id",
          "data_type": "uuid",
          "is_nullable": "YES",
          "column_default": null,
          "character_maximum_length": null
        },
        {
          "table_name": "team_join_requests",
          "column_name": "status",
          "data_type": "character varying",
          "is_nullable": "YES",
          "column_default": "'pending'::character varying",
          "character_maximum_length": 20
        },
        {
          "table_name": "team_join_requests",
          "column_name": "requested_at",
          "data_type": "timestamp with time zone",
          "is_nullable": "YES",
          "column_default": "now()",
          "character_maximum_length": null
        },
        {
          "table_name": "team_join_requests",
          "column_name": "responded_at",
          "data_type": "timestamp with time zone",
          "is_nullable": "YES",
          "column_default": null,
          "character_maximum_length": null
        },
        {
          "table_name": "team_join_requests",
          "column_name": "_why_exists",
          "data_type": "text",
          "is_nullable": "YES",
          "column_default": "'Async join flow from Canvas Scenario I'::text",
          "character_maximum_length": null
        },
        {
          "table_name": "team_join_requests",
          "column_name": "_canvas_source",
          "data_type": "text",
          "is_nullable": "YES",
          "column_default": "'002-2 Scenario I: Player requests to join Team'::text",
          "character_maximum_length": null
        },
        {
          "table_name": "team_members",
          "column_name": "id",
          "data_type": "uuid",
          "is_nullable": "NO",
          "column_default": "gen_random_uuid()",
          "character_maximum_length": null
        },
        {
          "table_name": "team_members",
          "column_name": "team_id",
          "data_type": "uuid",
          "is_nullable": "YES",
          "column_default": null,
          "character_maximum_length": null
        },
        {
          "table_name": "team_members",
          "column_name": "player_id",
          "data_type": "uuid",
          "is_nullable": "YES",
          "column_default": null,
          "character_maximum_length": null
        },
        {
          "table_name": "team_members",
          "column_name": "role",
          "data_type": "character varying",
          "is_nullable": "YES",
          "column_default": null,
          "character_maximum_length": 20
        },
        {
          "table_name": "team_members",
          "column_name": "joined_at",
          "data_type": "timestamp with time zone",
          "is_nullable": "YES",
          "column_default": "now()",
          "character_maximum_length": null
        },
        {
          "table_name": "team_members",
          "column_name": "_why_exists",
          "data_type": "text",
          "is_nullable": "YES",
          "column_default": "'Team composition tracking from Canvas team formation flows'::text",
          "character_maximum_length": null
        },
        {
          "table_name": "team_members",
          "column_name": "_canvas_source",
          "data_type": "text",
          "is_nullable": "YES",
          "column_default": "'002-2 Scenario I: Player requests to join Team'::text",
          "character_maximum_length": null
        },
        {
          "table_name": "team_members",
          "column_name": "status",
          "data_type": "character varying",
          "is_nullable": "YES",
          "column_default": "'active'::character varying",
          "character_maximum_length": 20
        },
        {
          "table_name": "teams",
          "column_name": "id",
          "data_type": "uuid",
          "is_nullable": "NO",
          "column_default": "gen_random_uuid()",
          "character_maximum_length": null
        },
        {
          "table_name": "teams",
          "column_name": "name",
          "data_type": "character varying",
          "is_nullable": "NO",
          "column_default": null,
          "character_maximum_length": 100
        },
        {
          "table_name": "teams",
          "column_name": "founder_id",
          "data_type": "uuid",
          "is_nullable": "YES",
          "column_default": null,
          "character_maximum_length": null
        },
        {
          "table_name": "teams",
          "column_name": "max_members",
          "data_type": "integer",
          "is_nullable": "YES",
          "column_default": "4",
          "character_maximum_length": null
        },
        {
          "table_name": "teams",
          "column_name": "status",
          "data_type": "character varying",
          "is_nullable": "YES",
          "column_default": "'recruiting'::character varying",
          "character_maximum_length": 20
        },
        {
          "table_name": "teams",
          "column_name": "created_at",
          "data_type": "timestamp with time zone",
          "is_nullable": "YES",
          "column_default": "now()",
          "character_maximum_length": null
        },
        {
          "table_name": "teams",
          "column_name": "_why_exists",
          "data_type": "text",
          "is_nullable": "YES",
          "column_default": "'Primary social unit - Cyworld minihompy equivalent'::text",
          "character_maximum_length": null
        },
        {
          "table_name": "teams",
          "column_name": "_canvas_source",
          "data_type": "text",
          "is_nullable": "YES",
          "column_default": "'002-2.seed.Associated Teams Box.canvas'::text",
          "character_maximum_length": null
        },
        {
          "table_name": "users",
          "column_name": "id",
          "data_type": "uuid",
          "is_nullable": "NO",
          "column_default": "gen_random_uuid()",
          "character_maximum_length": null
        },
        {
          "table_name": "users",
          "column_name": "email",
          "data_type": "character varying",
          "is_nullable": "NO",
          "column_default": null,
          "character_maximum_length": 255
        },
        {
          "table_name": "users",
          "column_name": "auth_id",
          "data_type": "uuid",
          "is_nullable": "YES",
          "column_default": null,
          "character_maximum_length": null
        },
        {
          "table_name": "users",
          "column_name": "created_at",
          "data_type": "timestamp with time zone",
          "is_nullable": "YES",
          "column_default": "now()",
          "character_maximum_length": null
        },
        {
          "table_name": "users",
          "column_name": "last_login",
          "data_type": "timestamp with time zone",
          "is_nullable": "YES",
          "column_default": null,
          "character_maximum_length": null
        },
        {
          "table_name": "users",
          "column_name": "is_active",
          "data_type": "boolean",
          "is_nullable": "YES",
          "column_default": "true",
          "character_maximum_length": null
        },
        {
          "table_name": "users",
          "column_name": "_canvas_evidence",
          "data_type": "text",
          "is_nullable": "YES",
          "column_default": "'All 12 Canvas files show user authentication'::text",
          "character_maximum_length": null
        },
        {
          "table_name": "users",
          "column_name": "_frequency",
          "data_type": "integer",
          "is_nullable": "YES",
          "column_default": "5805",
          "character_maximum_length": null
        },
        {
          "table_name": "users",
          "column_name": "_session",
          "data_type": "character varying",
          "is_nullable": "YES",
          "column_default": "'00015'::character varying",
          "character_maximum_length": 10
        },
        {
          "table_name": "users",
          "column_name": "_fixed_from",
          "data_type": "character varying",
          "is_nullable": "YES",
          "column_default": "'00012'::character varying",
          "character_maximum_length": 10
        }
      ]
    }
  }
]

# Constraints

[
  {
    "constraints_snapshot": {
      "constraints": [
        {
          "table_name": "profiles",
          "constraint_name": "2200_27698_1_not_null",
          "constraint_type": "CHECK",
          "column_name": null,
          "foreign_table_name": null,
          "foreign_column_name": null,
          "check_clause": "id IS NOT NULL"
        },
        {
          "table_name": "profiles",
          "constraint_name": "2200_27698_2_not_null",
          "constraint_type": "CHECK",
          "column_name": null,
          "foreign_table_name": null,
          "foreign_column_name": null,
          "check_clause": "user_id IS NOT NULL"
        },
        {
          "table_name": "profiles",
          "constraint_name": "2200_27698_3_not_null",
          "constraint_type": "CHECK",
          "column_name": null,
          "foreign_table_name": null,
          "foreign_column_name": null,
          "check_clause": "call_sign IS NOT NULL"
        },
        {
          "table_name": "profiles",
          "constraint_name": "profiles_call_sign_key",
          "constraint_type": "UNIQUE",
          "column_name": "call_sign",
          "foreign_table_name": "profiles",
          "foreign_column_name": "call_sign",
          "check_clause": null
        },
        {
          "table_name": "profiles",
          "constraint_name": "profiles_grade_check",
          "constraint_type": "CHECK",
          "column_name": null,
          "foreign_table_name": "profiles",
          "foreign_column_name": "grade",
          "check_clause": "((grade >= 4) AND (grade <= 12))"
        },
        {
          "table_name": "profiles",
          "constraint_name": "profiles_grade_level_check",
          "constraint_type": "CHECK",
          "column_name": null,
          "foreign_table_name": "profiles",
          "foreign_column_name": "grade_level",
          "check_clause": "((grade_level >= 4) AND (grade_level <= 12))"
        },
        {
          "table_name": "profiles",
          "constraint_name": "profiles_pkey",
          "constraint_type": "PRIMARY KEY",
          "column_name": "id",
          "foreign_table_name": "profiles",
          "foreign_column_name": "id",
          "check_clause": null
        },
        {
          "table_name": "profiles",
          "constraint_name": "profiles_proper_user_id_fkey",
          "constraint_type": "FOREIGN KEY",
          "column_name": "proper_user_id",
          "foreign_table_name": "users",
          "foreign_column_name": "id",
          "check_clause": null
        },
        {
          "table_name": "profiles",
          "constraint_name": "profiles_role_check",
          "constraint_type": "CHECK",
          "column_name": null,
          "foreign_table_name": "profiles",
          "foreign_column_name": "role",
          "check_clause": "((role)::text = ANY ((ARRAY['player'::character varying, 'supervisor'::character varying, 'enabler'::character varying])::text[]))"
        },
        {
          "table_name": "profiles",
          "constraint_name": "profiles_user_id_fkey",
          "constraint_type": "FOREIGN KEY",
          "column_name": "user_id",
          "foreign_table_name": null,
          "foreign_column_name": null,
          "check_clause": null
        },
        {
          "table_name": "profiles",
          "constraint_name": "profiles_user_id_key",
          "constraint_type": "UNIQUE",
          "column_name": "user_id",
          "foreign_table_name": "profiles",
          "foreign_column_name": "user_id",
          "check_clause": null
        },
        {
          "table_name": "team_join_requests",
          "constraint_name": "2200_27762_1_not_null",
          "constraint_type": "CHECK",
          "column_name": null,
          "foreign_table_name": null,
          "foreign_column_name": null,
          "check_clause": "id IS NOT NULL"
        },
        {
          "table_name": "team_join_requests",
          "constraint_name": "team_join_requests_pkey",
          "constraint_type": "PRIMARY KEY",
          "column_name": "id",
          "foreign_table_name": "team_join_requests",
          "foreign_column_name": "id",
          "check_clause": null
        },
        {
          "table_name": "team_join_requests",
          "constraint_name": "team_join_requests_player_id_fkey",
          "constraint_type": "FOREIGN KEY",
          "column_name": "player_id",
          "foreign_table_name": "profiles",
          "foreign_column_name": "id",
          "check_clause": null
        },
        {
          "table_name": "team_join_requests",
          "constraint_name": "team_join_requests_status_check",
          "constraint_type": "CHECK",
          "column_name": null,
          "foreign_table_name": "team_join_requests",
          "foreign_column_name": "status",
          "check_clause": "((status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying])::text[]))"
        },
        {
          "table_name": "team_join_requests",
          "constraint_name": "team_join_requests_team_id_fkey",
          "constraint_type": "FOREIGN KEY",
          "column_name": "team_id",
          "foreign_table_name": "teams",
          "foreign_column_name": "id",
          "check_clause": null
        },
        {
          "table_name": "team_join_requests",
          "constraint_name": "team_join_requests_team_id_player_id_key",
          "constraint_type": "UNIQUE",
          "column_name": "team_id",
          "foreign_table_name": "team_join_requests",
          "foreign_column_name": "team_id",
          "check_clause": null
        },
        {
          "table_name": "team_join_requests",
          "constraint_name": "team_join_requests_team_id_player_id_key",
          "constraint_type": "UNIQUE",
          "column_name": "player_id",
          "foreign_table_name": "team_join_requests",
          "foreign_column_name": "player_id",
          "check_clause": null
        },
        {
          "table_name": "team_join_requests",
          "constraint_name": "team_join_requests_team_id_player_id_key",
          "constraint_type": "UNIQUE",
          "column_name": "team_id",
          "foreign_table_name": "team_join_requests",
          "foreign_column_name": "player_id",
          "check_clause": null
        },
        {
          "table_name": "team_join_requests",
          "constraint_name": "team_join_requests_team_id_player_id_key",
          "constraint_type": "UNIQUE",
          "column_name": "player_id",
          "foreign_table_name": "team_join_requests",
          "foreign_column_name": "team_id",
          "check_clause": null
        },
        {
          "table_name": "team_members",
          "constraint_name": "2200_27738_1_not_null",
          "constraint_type": "CHECK",
          "column_name": null,
          "foreign_table_name": null,
          "foreign_column_name": null,
          "check_clause": "id IS NOT NULL"
        },
        {
          "table_name": "team_members",
          "constraint_name": "team_members_pkey",
          "constraint_type": "PRIMARY KEY",
          "column_name": "id",
          "foreign_table_name": "team_members",
          "foreign_column_name": "id",
          "check_clause": null
        },
        {
          "table_name": "team_members",
          "constraint_name": "team_members_player_id_fkey",
          "constraint_type": "FOREIGN KEY",
          "column_name": "player_id",
          "foreign_table_name": "profiles",
          "foreign_column_name": "id",
          "check_clause": null
        },
        {
          "table_name": "team_members",
          "constraint_name": "team_members_role_check",
          "constraint_type": "CHECK",
          "column_name": null,
          "foreign_table_name": "team_members",
          "foreign_column_name": "role",
          "check_clause": "((role)::text = ANY ((ARRAY['founder'::character varying, 'member'::character varying])::text[]))"
        },
        {
          "table_name": "team_members",
          "constraint_name": "team_members_team_id_fkey",
          "constraint_type": "FOREIGN KEY",
          "column_name": "team_id",
          "foreign_table_name": "teams",
          "foreign_column_name": "id",
          "check_clause": null
        },
        {
          "table_name": "team_members",
          "constraint_name": "team_members_team_id_player_id_key",
          "constraint_type": "UNIQUE",
          "column_name": "player_id",
          "foreign_table_name": "team_members",
          "foreign_column_name": "team_id",
          "check_clause": null
        },
        {
          "table_name": "team_members",
          "constraint_name": "team_members_team_id_player_id_key",
          "constraint_type": "UNIQUE",
          "column_name": "player_id",
          "foreign_table_name": "team_members",
          "foreign_column_name": "player_id",
          "check_clause": null
        },
        {
          "table_name": "team_members",
          "constraint_name": "team_members_team_id_player_id_key",
          "constraint_type": "UNIQUE",
          "column_name": "team_id",
          "foreign_table_name": "team_members",
          "foreign_column_name": "team_id",
          "check_clause": null
        },
        {
          "table_name": "team_members",
          "constraint_name": "team_members_team_id_player_id_key",
          "constraint_type": "UNIQUE",
          "column_name": "team_id",
          "foreign_table_name": "team_members",
          "foreign_column_name": "player_id",
          "check_clause": null
        },
        {
          "table_name": "teams",
          "constraint_name": "2200_27719_1_not_null",
          "constraint_type": "CHECK",
          "column_name": null,
          "foreign_table_name": null,
          "foreign_column_name": null,
          "check_clause": "id IS NOT NULL"
        },
        {
          "table_name": "teams",
          "constraint_name": "2200_27719_2_not_null",
          "constraint_type": "CHECK",
          "column_name": null,
          "foreign_table_name": null,
          "foreign_column_name": null,
          "check_clause": "name IS NOT NULL"
        },
        {
          "table_name": "teams",
          "constraint_name": "teams_founder_id_fkey",
          "constraint_type": "FOREIGN KEY",
          "column_name": "founder_id",
          "foreign_table_name": "profiles",
          "foreign_column_name": "id",
          "check_clause": null
        },
        {
          "table_name": "teams",
          "constraint_name": "teams_pkey",
          "constraint_type": "PRIMARY KEY",
          "column_name": "id",
          "foreign_table_name": "teams",
          "foreign_column_name": "id",
          "check_clause": null
        },
        {
          "table_name": "teams",
          "constraint_name": "teams_status_check",
          "constraint_type": "CHECK",
          "column_name": null,
          "foreign_table_name": "teams",
          "foreign_column_name": "status",
          "check_clause": "((status)::text = ANY ((ARRAY['recruiting'::character varying, 'full'::character varying, 'active'::character varying, 'archived'::character varying])::text[]))"
        },
        {
          "table_name": "users",
          "constraint_name": "2200_28982_1_not_null",
          "constraint_type": "CHECK",
          "column_name": null,
          "foreign_table_name": null,
          "foreign_column_name": null,
          "check_clause": "id IS NOT NULL"
        },
        {
          "table_name": "users",
          "constraint_name": "2200_28982_2_not_null",
          "constraint_type": "CHECK",
          "column_name": null,
          "foreign_table_name": null,
          "foreign_column_name": null,
          "check_clause": "email IS NOT NULL"
        },
        {
          "table_name": "users",
          "constraint_name": "users_auth_id_fkey",
          "constraint_type": "FOREIGN KEY",
          "column_name": "auth_id",
          "foreign_table_name": null,
          "foreign_column_name": null,
          "check_clause": null
        },
        {
          "table_name": "users",
          "constraint_name": "users_auth_id_key",
          "constraint_type": "UNIQUE",
          "column_name": "auth_id",
          "foreign_table_name": "users",
          "foreign_column_name": "auth_id",
          "check_clause": null
        },
        {
          "table_name": "users",
          "constraint_name": "users_email_key",
          "constraint_type": "UNIQUE",
          "column_name": "email",
          "foreign_table_name": "users",
          "foreign_column_name": "email",
          "check_clause": null
        },
        {
          "table_name": "users",
          "constraint_name": "users_pkey",
          "constraint_type": "PRIMARY KEY",
          "column_name": "id",
          "foreign_table_name": "users",
          "foreign_column_name": "id",
          "check_clause": null
        }
      ]
    }
  }
]

# Indexes

[
  {
    "indexes_snapshot": {
      "indexes": [
        {
          "schemaname": "public",
          "tablename": "profiles",
          "indexname": "idx_profiles_user_id",
          "indexdef": "CREATE INDEX idx_profiles_user_id ON public.profiles USING btree (user_id)"
        },
        {
          "schemaname": "public",
          "tablename": "profiles",
          "indexname": "profiles_call_sign_key",
          "indexdef": "CREATE UNIQUE INDEX profiles_call_sign_key ON public.profiles USING btree (call_sign)"
        },
        {
          "schemaname": "public",
          "tablename": "profiles",
          "indexname": "profiles_pkey",
          "indexdef": "CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id)"
        },
        {
          "schemaname": "public",
          "tablename": "profiles",
          "indexname": "profiles_user_id_key",
          "indexdef": "CREATE UNIQUE INDEX profiles_user_id_key ON public.profiles USING btree (user_id)"
        },
        {
          "schemaname": "public",
          "tablename": "team_join_requests",
          "indexname": "idx_join_requests_player",
          "indexdef": "CREATE INDEX idx_join_requests_player ON public.team_join_requests USING btree (player_id)"
        },
        {
          "schemaname": "public",
          "tablename": "team_join_requests",
          "indexname": "idx_join_requests_status",
          "indexdef": "CREATE INDEX idx_join_requests_status ON public.team_join_requests USING btree (status)"
        },
        {
          "schemaname": "public",
          "tablename": "team_join_requests",
          "indexname": "idx_join_requests_team",
          "indexdef": "CREATE INDEX idx_join_requests_team ON public.team_join_requests USING btree (team_id)"
        },
        {
          "schemaname": "public",
          "tablename": "team_join_requests",
          "indexname": "team_join_requests_pkey",
          "indexdef": "CREATE UNIQUE INDEX team_join_requests_pkey ON public.team_join_requests USING btree (id)"
        },
        {
          "schemaname": "public",
          "tablename": "team_join_requests",
          "indexname": "team_join_requests_team_id_player_id_key",
          "indexdef": "CREATE UNIQUE INDEX team_join_requests_team_id_player_id_key ON public.team_join_requests USING btree (team_id, player_id)"
        },
        {
          "schemaname": "public",
          "tablename": "team_members",
          "indexname": "idx_team_members_player",
          "indexdef": "CREATE INDEX idx_team_members_player ON public.team_members USING btree (player_id)"
        },
        {
          "schemaname": "public",
          "tablename": "team_members",
          "indexname": "idx_team_members_team",
          "indexdef": "CREATE INDEX idx_team_members_team ON public.team_members USING btree (team_id)"
        },
        {
          "schemaname": "public",
          "tablename": "team_members",
          "indexname": "team_members_pkey",
          "indexdef": "CREATE UNIQUE INDEX team_members_pkey ON public.team_members USING btree (id)"
        },
        {
          "schemaname": "public",
          "tablename": "team_members",
          "indexname": "team_members_team_id_player_id_key",
          "indexdef": "CREATE UNIQUE INDEX team_members_team_id_player_id_key ON public.team_members USING btree (team_id, player_id)"
        },
        {
          "schemaname": "public",
          "tablename": "teams",
          "indexname": "idx_teams_founder",
          "indexdef": "CREATE INDEX idx_teams_founder ON public.teams USING btree (founder_id)"
        },
        {
          "schemaname": "public",
          "tablename": "teams",
          "indexname": "teams_pkey",
          "indexdef": "CREATE UNIQUE INDEX teams_pkey ON public.teams USING btree (id)"
        },
        {
          "schemaname": "public",
          "tablename": "users",
          "indexname": "idx_users_auth_id",
          "indexdef": "CREATE INDEX idx_users_auth_id ON public.users USING btree (auth_id)"
        },
        {
          "schemaname": "public",
          "tablename": "users",
          "indexname": "idx_users_email",
          "indexdef": "CREATE INDEX idx_users_email ON public.users USING btree (email)"
        },
        {
          "schemaname": "public",
          "tablename": "users",
          "indexname": "users_auth_id_key",
          "indexdef": "CREATE UNIQUE INDEX users_auth_id_key ON public.users USING btree (auth_id)"
        },
        {
          "schemaname": "public",
          "tablename": "users",
          "indexname": "users_email_key",
          "indexdef": "CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email)"
        },
        {
          "schemaname": "public",
          "tablename": "users",
          "indexname": "users_pkey",
          "indexdef": "CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id)"
        }
      ]
    }
  }
]

# Row Count

[
  {
    "counts_snapshot": {
      "row_counts": {
        "profiles": 0,
        "teams": 0,
        "team_members": 0,
        "team_join_requests": 0
      }
    }
  }
]

# RLS Status Per Table

[
  {
    "rls_status_snapshot": {
      "rls_enabled": [
        {
          "tablename": "profiles",
          "rowsecurity": true
        },
        {
          "tablename": "team_join_requests",
          "rowsecurity": true
        },
        {
          "tablename": "team_members",
          "rowsecurity": true
        },
        {
          "tablename": "teams",
          "rowsecurity": true
        },
        {
          "tablename": "users",
          "rowsecurity": true
        }
      ]
    }
  }
]