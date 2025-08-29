---
session: "00104"
type: "database-tracking"
status: "critical"
created: "2025-08-29"
title: "Database Change Log - Manual SQL Tracking"
purpose: "Track all manual database changes to prevent drift and enable recovery"
topics: ["database", "supabase", "change-tracking", "manual-sql", "recovery"]
priority: "P0"
domain: "reality"
---

# Database Change Log - Manual SQL Tracking

**Created**: Session 00104
**Purpose**: Single source of truth for all manual database changes
**Critical**: This document tracks changes that CANNOT be verified programmatically

## ⚠️ CRITICAL ISSUE IDENTIFIED

We have lost track of database changes made manually through Sessions 99-103. This creates:
1. **State Drift**: Database doesn't match our SQL files
2. **Missing Rollback**: Can't undo changes we didn't document
3. **Lost Work**: Policies dropped in Session 103 never restored
4. **Manual Burden**: Trying to sync v6 directory manually is unsustainable

---

## 📊 Database Change Categories

### 1. Tracked Changes (Have SQL Files)
- ✅ Session 99: `scripts/00099-complete-database-foundation.sql`
- ✅ Session 99: `scripts/00099-REVISED-trigger-only.sql`
- ✅ Session 101: `scripts/00101-FIX-school-search-final.sql`
- ✅ Session 101: `scripts/00101-diagnose-school-rls.sql`

### 2. Untracked Manual Changes (LOST)
- ❌ Session 103: Dropped policies (unknown which ones)
- ❌ Session 103: Fresh policy insertions (partial set)
- ❌ Session 103: SECURITY DEFINER changes
- ❌ Session 101-103: Various RLS modifications
- ❌ Unknown number of ad-hoc fixes

### 3. Data Changes (Not Versioned)
- Test schools inserted
- Test users created
- Profile records modified

---

## 🔴 Session 103 Lost Changes

### Policies Dropped (UNRECOVERED)
**Action**: Session 103 asked to drop policies for fresh start
**Problem**: We don't know which policies were dropped
**Impact**: Database may be missing critical security policies

### What We Know Was Changed:
```sql
-- CONFIRMED: Applied to search_school function
ALTER FUNCTION search_school(text) SECURITY DEFINER;
ALTER FUNCTION search_school(text) SET search_path = public;

-- CONFIRMED: Student table has only 3 policies now
-- (Down from 10, but we don't know which 7 were dropped)
student_insert_own: WITH CHECK ((user_id = auth.uid()) OR (user_id = (SELECT auth.uid())))
student_select_own: USING (user_id = auth.uid())
student_update_own: USING/WITH CHECK (user_id = auth.uid())
```

### What We DON'T Know:
- Which exact policies were dropped
- If any triggers were modified
- If any constraints were changed
- If any indexes were affected

---

## 🔧 Immediate Actions Needed

### 1. Database State Snapshot
We need to capture CURRENT database state:
```sql
-- Get all current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Get all functions with security settings
SELECT proname, prosecdef, proconfig
FROM pg_proc
WHERE pronamespace = 'public'::regnamespace
AND (prosecdef = true OR proconfig IS NOT NULL);

-- Get all triggers
SELECT tgname, tgtype, tgrelid::regclass, proname
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE tgrelid::regclass::text NOT LIKE 'pg_%';
```

### 2. Recovery Strategy
Without knowing what was dropped, we have two options:

**Option A: Full Reset**
- Drop ALL policies
- Reapply from known-good SQL files
- Risk: Losing any manual fixes that worked

**Option B: Incremental Discovery**
- Run integration tests
- Document each failure
- Add missing pieces one by one
- Risk: Time-consuming, may miss security holes

---

## 📝 Change Tracking Protocol (Going Forward)

### For Every Manual SQL Change:

1. **BEFORE Executing**:
   ```sql
   -- Capture current state
   SELECT * FROM pg_policies WHERE tablename = 'target_table';
   ```

2. **Document the Change**:
   ```sql
   -- Session: 00XXX
   -- Date: YYYY-MM-DD
   -- Purpose: [Why this change]
   -- Previous State: [What existed before]
   
   [YOUR SQL HERE]
   
   -- Rollback: [How to undo this]
   ```

3. **AFTER Executing**:
   - Add to this log immediately
   - Create rollback script
   - Update relevant SQL files

---

## 🚨 Current Database State Unknown

**As of Session 104**, we have:
- Unknown number of policies (some dropped, some added)
- Modified functions (SECURITY DEFINER applied selectively)
- Test data mixed with structure changes
- No clear rollback path

**Next Steps**:
1. Run database state snapshot queries
2. Compare with expected state from SQL files
3. Document all differences
4. Create recovery plan
5. Establish proper change tracking

---

## 📊 Change Log (Start Fresh from 104)

### Session 104 Changes
_To be documented as changes are made_

| Date | Session | Table/Object | Change Type | SQL | Rollback | Verified |
|------|---------|--------------|-------------|-----|----------|----------|
| | | | | | | |

---

**CRITICAL**: No more undocumented manual SQL changes. Every change MUST be logged here.