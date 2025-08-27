---
session: "00081"
type: "reality-snapshot"
status: "current"
created: "2025-08-27"
title: "Current Database Triggers Snapshot"
purpose: "Document actual triggers in our Supabase project"
topics: ["database", "triggers", "reality", "supabase-state"]
priority: "P0"
domain: "reality"
reality_type: "current-state"
source: "supabase-dashboard"
verified_date: "2025-08-27"
---
Database Triggers
Execute a set of actions automatically on specified table events
Docs

schema

public

Search for a trigger

New trigger

Name	Table	Function	Events	Orientation	Enabled	
check_friendship_update_allowed_columns_trigger	
friendship

check_friendship_update_allowed_columns

BEFORE UPDATE
ROW


check_insert_allowed_columns_trigger	
student

check_insert_allowed_columns

BEFORE INSERT
ROW


check_update_allowed_columns_trigger	
student

check_update_allowed_columns

BEFORE UPDATE
ROW


trg_after_delete_team_member	
team_member

delete_empty_team_after_member_delete

AFTER DELETE
ROW


trg_before_delete_team_member	
team_member

check_team_member_delete

BEFORE DELETE
ROW


trg_before_update_team	
team

check_team_update_leader

BEFORE UPDATE
ROW


trg_cleanup_friendship_status	
friendship

delete_invalid_friendship

AFTER UPDATE
AFTER INSERT
ROW


trg_guild_create_room	
guild

fn_create_guild_room

AFTER INSERT
ROW


trg_guild_member_add_participant	
guild_member

fn_add_guild_member_to_room

AFTER UPDATE
AFTER INSERT
ROW


trg_guild_update_room_title	
guild

fn_sync_guild_room_title

AFTER UPDATE
ROW


trg_set_division	
student

set_division

BEFORE UPDATE
BEFORE INSERT
ROW


trg_team_create_room	
team

fn_create_team_room

AFTER INSERT
ROW


trg_team_member_add_participant	
team_member

fn_add_team_member_to_room

AFTER UPDATE
AFTER INSERT
ROW


trg_team_update_room_title	
team

fn_sync_team_room_title

AFTER UPDATE
ROW


