---
session: "00046"
type: "documentation"
status: "current"
created: "2025-08-23"
title: "Verification Queries for Session 44"
purpose: "Document verification queries for session 44"
topics: ['database', 'documentation']
priority: "P1"
domain: "reconciliation"
---

# Verification Queries for Session 44
**Purpose**: SQL queries for Session 44 to verify deployment success  
**Session**: 00046 (Database Team Assistant)  
**Date**: 2025-08-21

---

## 🚨 CRITICAL VERIFICATION SEQUENCE

### Step 1: Check Table Count by Schema
**Run this IMMEDIATELY after schema.sql deployment**

```sql
-- Should show ~36 total tables across schemas
SELECT 
    table_schema,
    COUNT(*) as table_count
FROM information_schema.tables
WHERE table_type = 'BASE TABLE'
AND table_schema IN ('public', 'debate', 'chat')
GROUP BY table_schema
ORDER BY table_schema;

-- Expected results:
-- public    | 20+
-- debate    | 6+  
-- chat      | 3+
```

### Step 2: Verify Critical Tables Exist
```sql
-- Check for core EDL tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profile', 'student', 'judge', 'guardian', 'team', 'team_member')
ORDER BY table_name;

-- Should return all 6 tables
```

### Step 3: Check student Table Structure
```sql
-- Verify student table exists and has expected columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'student'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Should show: user_id, guardian_id, school_id, division, location, exp, etc.
-- Should NOT show call_sign yet (we add that next)
```

### Step 4: Verify call_sign Column AFTER Adding It
```sql
-- Run AFTER: ALTER TABLE public.student ADD COLUMN call_sign TEXT UNIQUE;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'student' 
AND column_name = 'call_sign'
AND table_schema = 'public';

-- Should return: call_sign | text | YES
```

### Step 5: Check RLS Status
```sql
-- Verify RLS is enabled on key tables
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN ('profile', 'student', 'judge', 'guardian', 'team')
ORDER BY tablename;

-- All should show: rls_enabled = true
```

---

## 🔍 DEBUGGING QUERIES (If Issues Arise)

### If Tables Missing
```sql
-- See ALL tables that were created
SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_type = 'BASE TABLE'
ORDER BY table_schema, table_name;
```

### If Schema Issues
```sql
-- Check what schemas exist
SELECT schema_name
FROM information_schema.schemata
WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
ORDER BY schema_name;
```

### If RLS Problems
```sql
-- Check existing policies
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd as policy_type
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

---

## 📊 SUCCESS CRITERIA CHECKLIST

- [ ] **Table Count**: 36+ total across public/debate/chat schemas
- [ ] **Core Tables**: profile, student, judge, guardian, team, team_member exist
- [ ] **Student Structure**: Contains user_id, guardian_id, school_id, etc.
- [ ] **call_sign Column**: Added and has UNIQUE constraint
- [ ] **RLS Enabled**: All core tables have row security enabled
- [ ] **No Errors**: All queries run without permission errors

---

## 🚀 QUICK VERIFICATION COMMANDS

### For Session 44 to Run
```bash
# After deployment, run our verification script
python3 scripts/00046-database-verification.py --quick

# Should show:
# Tables Found: 36+/36
# Profile Table: ✅
# Student Table: ✅  
# call_sign Column: ✅
# 🎉 DEPLOYMENT SUCCESSFUL!
```

### Reality Agent Verification
```bash
# Final verification with Reality Agents
SUPABASE_URL="https://bbrheacetxlnqbibjwsz.supabase.co" \
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE" \
python3 reality/agent-reality-auditor/supabase-connector/quickstart.py
```

---

## ⚠️ COMMUNICATION PROTOCOL

### When Session 44 Should Update Me

1. **Before dropping tables**: "Starting DROP commands..."
2. **Before schema deployment**: "Running schema.sql now..."  
3. **After schema deployment**: "Schema complete! Please verify."
4. **After call_sign added**: "call_sign column added. Final check?"
5. **If errors occur**: "ISSUE: [specific problem]"

### My Response Pattern

1. **Pre-deployment**: "Pre-deployment snapshot saved. 4 tables confirmed."
2. **During deployment**: "Standing by with verification queries."
3. **Post-deployment**: "Running verification... [results]"
4. **Issues found**: "ISSUE: [specific problem found]"
5. **Success**: "✅ Verified: 36 tables, call_sign added, RLS enabled"

---

**Ready to support the deployment!**