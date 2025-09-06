---
session: "00117"
type: "context-guide"
status: "ready"
created: "2025-08-30"
title: "Session 117 Context Loading Checklist - Evidence-Based Friends Debug"
purpose: "Provide Session 117 with complete context to debug friends error without guesswork"
topics: ["context-loading", "friends", "debugging", "evidence-based"]
priority: "P0"
domain: "reconciliation"
related_to: ["00116-FRIENDS-SYSTEM-SCHEMA-ALIGNMENT-REPORT.md", "00117-request-source-friendship.md"]
replaces: ["ad-hoc-debugging", "guesswork-approach"]
---

# Session 117 Context Loading Checklist

**Purpose**: Ensure Session 117 has complete evidence base to debug friends system without ad hoc changes

## MANDATORY: Read These Files First

### 1. **Session 116 Work Summary**
```bash
# Read Session 116's complete work log
Read: archive/sessions/SESSION-00116-LOG.md

# Read detailed implementation report  
Read: reconciliation/00116-FRIENDS-SYSTEM-SCHEMA-ALIGNMENT-REPORT.md
```
**Key Points**: 
- Database schema perfectly aligned with source
- 5 migrations successfully applied
- Error persists despite schema alignment
- Root cause likely authentication or frontend

### 2. **Source Project Evidence (Critical)**
```bash
# The working source project schema - AUTHORITATIVE
Read: reality/00117-request-source-friendship.md

# Visual schema overview
Read: reality/00117-request-source-supabase-schema-niyrthumgjmtkjgtlbnq.png

# Original Session 81 source discovery
Read: reality/00081-request-source-project-functions.md
Read: reality/00081-request-source-project-triggers.md
Read: reality/00081-request-source-project-enums.md
```
**Why Critical**: These contain the EXACT working schema that Session 116 replicated

### 3. **Original Implementation Plans**
```bash
# Session 109's evidence-based plan
Read: reconciliation/00109-FRIEND-SYSTEM-IMPLEMENTATION-PLAN.md

# Previous session work
Read: archive/sessions/SESSION-00112-LOG.md  # Teams success story
Read: archive/sessions/SESSION-00113-LOG.md  # CSS diagnosis approach
```

## MANDATORY: YAML Query for Current State

### Before Any Work - Query Existing Evidence
```bash
# Find all friends-related work
python3 scripts/00059-yaml-query.py --topic friends

# Check for any fixes or debugging attempts
python3 scripts/00059-yaml-query.py --topic friends --type fix

# See what's been tried before
python3 scripts/00059-yaml-query.py --session "0011*" --topic friends
```

## MANDATORY: Database State Verification

### Confirm Session 116's Database Changes
```bash
# Verify current database state with MCP
mcp__supabase-dev__execute_sql: "
SELECT 
  schemaname, tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename = 'friendship';"

# Confirm functions exist
mcp__supabase-dev__execute_sql: "
SELECT proname, proargnames, prosrc 
FROM pg_proc 
WHERE proname LIKE '%friend%';"

# Check triggers
mcp__supabase-dev__execute_sql: "
SELECT tgname, tgrelid::regclass 
FROM pg_trigger 
WHERE tgrelid = 'public.friendship'::regclass;"
```

## DEBUGGING METHODOLOGY (Evidence-Based)

### Phase 1: Reproduce and Isolate (15 min)
1. **Reproduce Error Exactly**
   - Load dashboard at localhost:3001
   - Screenshot exact error message
   - Note browser dev tools network errors
   - Check console for detailed error messages

2. **Isolate Error Location** 
   ```bash
   # Find the exact component causing error
   grep -r "getFriendRequestListAction" reconciliation/active-work/
   
   # Trace the error path
   Read: reconciliation/active-work/dashboard/src/hooks/use-friends.ts
   Read: reconciliation/active-work/dashboard/src/lib/actions/student-actions.ts
   ```

### Phase 2: Authentication Context Debug (20 min)
1. **Test Authentication State**
   ```javascript
   // In browser console
   const { data: { user } } = await supabase.auth.getUser();
   console.log('Auth user:', user);
   ```

2. **Test Direct Database Access**
   ```bash
   # Via MCP server (working context)
   mcp__supabase-dev__execute_sql: "SELECT auth.uid(), current_user;"
   
   # Test friendship table access
   mcp__supabase-dev__execute_sql: "SELECT * FROM friendship LIMIT 1;"
   ```

3. **Compare Contexts**
   - Does MCP server work but browser fail?
   - Is user properly authenticated in browser?
   - Are RLS policies applying differently?

### Phase 3: Function Call Analysis (20 min)
1. **Trace Exact Function Path**
   ```bash
   # Check what getFriendRequestListAction actually calls
   Read: reconciliation/active-work/dashboard/src/lib/actions/student-actions.ts:88-97
   
   # Compare with source project approach
   # Does source use RPC calls or direct selects?
   ```

2. **Test Function Isolation**
   ```bash
   # Test the specific failing query
   mcp__supabase-dev__execute_sql: "
   SELECT * FROM friendship 
   WHERE friend_id = auth.uid() AND status = 'PENDING';"
   ```

### Phase 4: Frontend vs Backend Comparison (15 min)
1. **Browser Network Tab Analysis**
   - What actual SQL is being sent?
   - What's the exact error response?
   - Compare with MCP server successful queries

2. **Supabase Client Configuration**
   ```bash
   # Check client setup
   Read: reconciliation/active-work/dashboard/src/utils/supabase/client.ts
   Read: reconciliation/active-work/dashboard/src/utils/supabase/server.ts
   ```

## EVIDENCE-BASED DECISION TREE

### IF: Auth context is different between browser/server
**THEN**: Fix auth context passing, not database

### IF: Browser network shows different SQL than expected  
**THEN**: Fix frontend function calls, not database

### IF: MCP works but browser fails with same query
**THEN**: Fix Supabase client config, not database  

### IF: All contexts fail with same error
**THEN**: Missing database object or dependency

### IF: Error message shows "frienship" (typo)
**THEN**: Frontend code has hardcoded table name typo

## ANTI-GUESSWORK PROTOCOLS

### ❌ DO NOT:
- Make random RLS policy changes
- Modify database schema without evidence
- Try different function implementations
- Add new tables/columns speculatively
- Change frontend code without understanding root cause

### ✅ DO:
- Test each hypothesis with specific evidence
- Compare working (MCP) vs broken (browser) contexts
- Document each test result before proceeding
- Use browser dev tools for actual error messages
- Follow the evidence chain systematically

## SUCCESS CRITERIA

Session 117 should be able to answer these questions with evidence:

1. **Where exactly does the error occur?** (Component → Function → Query)
2. **What's different between working and failing contexts?** (Auth, Client, SQL)
3. **What's the actual SQL being executed?** (Browser network tab)
4. **Does the fix require database OR frontend changes?** (Evidence-based decision)

## TIME BOXING

- **Context Loading**: 30 minutes (this checklist)
- **Error Reproduction**: 15 minutes  
- **Authentication Debug**: 20 minutes
- **Function Analysis**: 20 minutes
- **Frontend Comparison**: 15 minutes
- **Fix Implementation**: 30 minutes
- **Total**: 2 hours maximum

## KEY FILES TO HAVE OPEN

### Primary Context
- `00116-FRIENDS-SYSTEM-SCHEMA-ALIGNMENT-REPORT.md`
- `00117-request-source-friendship.md` 
- `reconciliation/active-work/dashboard/src/hooks/use-friends.ts`
- `reconciliation/active-work/dashboard/src/lib/actions/student-actions.ts`

### Browser Dev Tools
- Console for auth.uid() testing
- Network tab for actual SQL requests
- Application tab for Supabase client state

---

**Session 117 Mandate**: Follow this evidence-based approach. No ad hoc changes until root cause is isolated with specific evidence. Session 116 proved database schema is correct - focus on authentication and frontend debugging.