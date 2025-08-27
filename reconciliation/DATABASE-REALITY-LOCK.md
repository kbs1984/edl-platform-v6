---
session: 00080
type: lock
status: authoritative
created: '2025-08-26'
title: Database Reality Lock - Post Session 80 Migration
purpose: Authoritative source of current database state after successful migration
topics:
- database
- rls-policies
- migration
- source-of-truth
priority: P0
domain: reconciliation
implements:
- requirement-to-be-specified
modified: '2025-08-27'
---

# 🔒 DATABASE REALITY LOCK - SESSION 00080

**THIS FILE IS THE AUTHORITATIVE SOURCE OF DATABASE TRUTH**
**All future sessions MUST read this before making database changes**

## Current Database State (As of 2025-08-26 17:15)

### ✅ Successful Migrations Applied

1. **`immediate-profile-fix.sql`** - Removed blocking INSERT policy
2. **`FINAL-dashboard-based-migration.sql`** - Complete policy reconciliation

### 🎯 Profile Table - CRITICAL FOR AUTH

**Current Policies** (3 total, NO INSERT):
```sql
-- SELECT: Users can see their own profile
"Allow users to select their own profile" 
FOR SELECT TO authenticated USING (auth.uid() = id)

-- SELECT: All authenticated users can read all profiles
"Enable read access for all users"
FOR SELECT TO authenticated USING (true)

-- UPDATE: Users can update their own profile
"Allow users to update their own profile"
FOR UPDATE TO authenticated 
USING (auth.uid() = id) 
WITH CHECK (auth.uid() = id)
```

**⚠️ CRITICAL**: NO INSERT POLICY - Profiles created by trigger with service role

### 📊 Complete Policy Inventory

**Total Policies**: 40 across 17 tables

**Tables WITH RLS Enabled**:
- public.profile (3 policies)
- public.student (3 policies - includes UPDATE not in backup)
- public.guardian (2 policies)
- public.judge (1 policy)
- public.school (2 policies)
- public.team (4 policies - simplified logic)
- public.team_member (4 policies)
- public.friendship (3 policies)
- public.guardian_request (0 policies - lockdown)

**Tables WITHOUT RLS** (intentionally public):
- public.admin
- public.bank_account
- public.guild
- public.guild_member
- public.invitation
- public.log
- public.payment_history
- public.rating

### 🔑 Key Technical Details

1. **Profile Creation Flow**:
   - User signs up → INSERT into auth.users
   - Trigger `on_auth_user_created` fires
   - Trigger INSERTs profile with service role (bypasses RLS)
   - NO INSERT policy needed or wanted

2. **Team Table Quirk**:
   - No `created_by` column (policies use `true`)
   - No `user_id` column (simplified policies)
   - UPDATE policy named "Policy with table joins" but uses simple `true`

3. **Student Table Discovery**:
   - Has UPDATE policy not in backup
   - Named `update_student_policy`
   - Allows users to update own student record

### 📁 Reference Files

**Migration Scripts**:
- `scripts/00080-migration-audit/immediate-profile-fix.sql` ✅
- `scripts/00080-migration-audit/FINAL-dashboard-based-migration.sql` ✅

**Analysis Tools**:
- `scripts/00080-extract-backup-policies.py` - Extract from backup
- `scripts/00080-verify-current-policies.py` - Verify current state

**Dashboard Captures**:
- `scripts/00080-migration-audit/public-schema-policies.md`
- `scripts/00080-migration-audit/storage-schema-policies.md`
- (All other schema policy files from dashboard)

**Schema Snapshot**:
- `core/config/supabase/schema-snapshot/policies-00080.json`

### ⚠️ DO NOT

1. **DO NOT** add INSERT policy to profile table
2. **DO NOT** modify auth schema tables (no permissions)
3. **DO NOT** trust backup file over dashboard
4. **DO NOT** assume columns exist (check first)

### ✅ DO

1. **DO** check this file before database work
2. **DO** verify column existence before writing policies
3. **DO** trust dashboard as source of truth
4. **DO** test auth flow after any policy changes

### 🔐 Auth Flow Status

**Current State**: UNBLOCKED
- Profile creation trigger can execute
- No restrictive policies blocking signup
- All P0 requirements (US-001 to US-015) testable

**Next Test**: Complete signup → email verify → profile creation → dashboard access

---

**Lock Created**: Session 00080, 2025-08-26 17:15
**Last Verified**: Desktop confirmation of successful migration
**Authoritative Source**: Supabase Dashboard (not backup file)