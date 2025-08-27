---
session: "00081"
type: "reality-snapshot"
status: "current"
created: "2025-08-27"
title: "Current Database Functions Snapshot"
purpose: "Document actual functions in our Supabase project"
topics: ["database", "functions", "reality", "supabase-state"]
priority: "P0"
domain: "reality"
reality_type: "current-state"
source: "supabase-dashboard"
verified_date: "2025-08-27"
---
Database Functions
Docs

schema

public

Search for a function

Create a new function

Name	Arguments	Return type	Security	

add_new_user
-

trigger

Definer	


check_friendship_update_allowed_columns
-

trigger

Invoker	


check_insert_allowed_columns
-

trigger

Invoker	


check_team_member_delete
-

trigger

Invoker	


check_team_update_leader
-

trigger

Invoker	


check_update_allowed_columns
-

trigger

Invoker	


delete_empty_team_after_member_delete
-

trigger

Invoker	


delete_invalid_friendship
-

trigger

Invoker	


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


get_profile_uuid
input text

uuid

Invoker	


get_table_ddl
p_schema_name character varying, p_table_name character varying

text

Invoker	


search_school
search_query text

TABLE(id uuid, name text)

Invoker	


set_division
-

trigger

Invoker	


set_team_leader
p_team_id uuid, p_student_id uuid

void

Definer	


uuid_generate_v1
-

uuid

Invoker	


uuid_generate_v1mc
-

uuid

Invoker	


uuid_generate_v3
namespace uuid, name text

uuid

Invoker	


uuid_generate_v4
-

uuid

Invoker	


uuid_generate_v5
namespace uuid, name text

uuid

Invoker	


uuid_nil
-

uuid

Invoker	


uuid_ns_dns
-

uuid

Invoker	


uuid_ns_oid
-

uuid

Invoker	


uuid_ns_url
-

uuid

Invoker	


uuid_ns_x500
-

uuid

Invoker	

