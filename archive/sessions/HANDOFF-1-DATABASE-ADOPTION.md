---
created: '2025-08-23'
domain: core
priority: P1
purpose: 'Document handoff 1: database adoption - the clean slate protocol'
session: legacy
status: current
title: 'HANDOFF 1: Database Adoption - The Clean Slate Protocol'
topics:
- database
- handoff
type: handoff
---

# HANDOFF 1: Database Adoption - The Clean Slate Protocol
**Session**: 00043  
**Priority**: 🔴 CRITICAL - DO THIS FIRST  
**Time Required**: 30-45 minutes  
**Human Action Required**: YES (Supabase SQL Editor)

---

## The Situation You're Inheriting

**Current State**: 4-table broken system (profiles, teams, team_members, team_join_requests)  
**Target State**: 36-table emdash platform (complete debate system)  
**Decision**: FULL ADOPTION per Session 42's TRUTH-SEED-ADOPTION-DECISION.md

---

## What Claude Discovered (Session 43 Analysis)

After analyzing all SQL return files in `/truth-seed/supabase-migration/`:
- The emdash database is **production-ready** with proper triggers, enums, and relationships
- The `student` table EXISTS but lacks `call_sign` column
- Current database has 21 test users, 6 students, 0 debates
- Payment system uses Korean providers (TOSS, NAVER_PAY, KAKAO_PAY)

---

## Step-by-Step Database Adoption

### Step 1: Verify Current State (2 minutes)
Run in Supabase SQL Editor to see what you're replacing:
```sql
-- Check current tables (should show 4 tables)
SELECT table_name, 
       (SELECT COUNT(*) FROM information_schema.columns c 
        WHERE c.table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

### RETURN
```json
[
  {
    "table_name": "profiles",
    "column_count": 17
  },
  {
    "table_name": "team_join_requests",
    "column_count": 8
  },
  {
    "table_name": "team_members",
    "column_count": 8
  },
  {
    "table_name": "teams",
    "column_count": 8
  },
  {
    "table_name": "users",
    "column_count": 45
  }
]
```


### Step 2: Create Backup (Optional but Recommended) (2 minutes)
```sql
-- Quick backup of any test data you want to keep
SELECT * FROM profiles;  -- Copy results if needed
SELECT * FROM teams;     -- Copy results if needed
```

### Step 3: THE NUCLEAR OPTION - Clean Slate (5 minutes)
```sql
-- ⚠️ WARNING: This deletes EVERYTHING. No going back.
-- Disable foreign key checks temporarily
SET session_replication_role = 'replica';

-- Drop all schemas completely
DROP SCHEMA IF EXISTS public CASCADE;
DROP SCHEMA IF EXISTS debate CASCADE;
DROP SCHEMA IF EXISTS chat CASCADE;
DROP SCHEMA IF EXISTS extensions CASCADE;

-- Recreate schemas
CREATE SCHEMA public;
CREATE SCHEMA debate;
CREATE SCHEMA chat;
CREATE SCHEMA extensions;

-- Re-enable foreign key checks
SET session_replication_role = 'origin';

-- Grant permissions
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO anon;
GRANT ALL ON SCHEMA public TO authenticated;
GRANT ALL ON SCHEMA public TO service_role;

GRANT ALL ON SCHEMA debate TO postgres;
GRANT ALL ON SCHEMA debate TO anon;
GRANT ALL ON SCHEMA debate TO authenticated;
GRANT ALL ON SCHEMA debate TO service_role;

GRANT ALL ON SCHEMA chat TO postgres;
GRANT ALL ON SCHEMA chat TO anon;
GRANT ALL ON SCHEMA chat TO authenticated;
GRANT ALL ON SCHEMA chat TO service_role;
```

### Step 4: Run Full emdash Schema (20 minutes)

**IMPORTANT**: The schema file is 7304 lines. You need to:

1. Open `/truth-seed/emdash-dashboard-main/docs/schema.sql` in your editor
2. Copy ALL contents (Cmd+A, Cmd+C)
3. Paste into Supabase SQL Editor
4. Click "Run"
5. **EXPECT**: Some warnings about "already exists" for auth schema - this is NORMAL
6. **WAIT**: This will take 2-3 minutes to complete

### Step 5: Verify Adoption Success (2 minutes)
```sql
-- Should show 36+ tables across schemas
SELECT 
    table_schema,
    COUNT(*) as table_count
FROM information_schema.tables
WHERE table_type = 'BASE TABLE'
AND table_schema IN ('public', 'debate', 'chat')
GROUP BY table_schema
ORDER BY table_schema;

-- Verify key tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profile', 'student', 'judge', 'guardian', 'team')
ORDER BY table_name;

-- Check student table columns (should NOT have call_sign yet)
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'student'
AND table_schema = 'public'
ORDER BY ordinal_position;
```

### Step 6: Add EDL Identity - call_sign Column (2 minutes)
```sql
-- This is our ONLY modification to emdash schema
ALTER TABLE public.student 
ADD COLUMN call_sign TEXT UNIQUE;

-- Create index for performance
CREATE INDEX idx_student_call_sign ON public.student(call_sign);

-- Verify it worked
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'student' AND column_name = 'call_sign';
```

### Step 7: Enable RLS (CRITICAL) (2 minutes)
```sql
-- Enable RLS on key tables
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.judge ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guardian ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_member ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (auth gateway will handle most security)
CREATE POLICY "Users can view own profile" ON public.profile
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profile
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own student record" ON public.student
FOR SELECT USING (auth.uid() = user_id);
```

---

## Verification with Claude

After completing database adoption, tell Claude to verify:
```bash
SUPABASE_URL="https://bbrheacetxlnqbibjwsz.supabase.co" \
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE" \
python3 reality/agent-reality-auditor/supabase-connector/quickstart.py
```

Claude should see:
- ✅ 36 tables exist
- ✅ student table has call_sign column
- ✅ RLS policies active

---

## Success Criteria

✅ Old 4-table system completely removed  
✅ 36 emdash tables created  
✅ call_sign column added to student table  
✅ RLS enabled on key tables  
✅ Reality Agent confirms healthy database  

---

## If Something Goes Wrong

1. **"Permission denied" errors**: Check you're using the right Supabase project
2. **"Already exists" errors**: You didn't drop everything first - go back to Step 3
3. **Schema file won't run**: Make sure you copied ALL 7304 lines
4. **RLS blocking access**: The policies above are basic - auth gateway handles real security

---

## Next Steps

Once database adoption is complete:
1. Move to **HANDOFF-2-AUTH-GATEWAY.md**
2. The auth gateway can now connect to proper tables
3. No more "student table not found" errors

---

**Time Estimate**: 30-45 minutes including waiting for SQL execution  
**Risk Level**: HIGH (complete database replacement)  
**Rollback**: Would need to restore from Supabase backup  

---

*This handoff created by Session 00043 after deep analysis of emdash structure*