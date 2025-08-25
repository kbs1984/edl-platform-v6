---
session: '00044'
type: guide
status: current
created: '2025-08-23'
title: "\U0001F50D Business Logic Investigation Plan"
purpose: "Document \U0001F50D business logic investigation plan"
topics:
- auth
- database
- documentation
priority: P1
domain: core
lifecycle: OBSOLETE
obsolete_reason: Session 44-55 database confusion period
---

# 🔍 Business Logic Investigation Plan
**Created**: Session 00046  
**Purpose**: Systematically discover ALL missing database components required by the Next.js apps  
**Priority**: 🔴 CRITICAL - Without this, we're flying blind

---

## The Core Problem

We adopted the emdash platform thinking "36 tables = complete database" but actually:
- **What we have**: Database schema (tables, columns, relationships)
- **What we need**: Complete business logic layer (triggers, functions, policies, defaults)
- **The gap**: Unknown number of missing components

**Current Discovery Method**: "Try it and see what breaks" ❌  
**Needed Method**: Systematic analysis of codebase expectations ✅

---

## Investigation Strategy

### Phase 1: Code Analysis (What Does the App Expect?)

#### 1.1 Auth Gateway Expectations
Search for patterns in `reconciliation/active-work/auth-gateway/`:
```bash
# Find all Supabase queries
grep -r "supabase\." --include="*.ts" --include="*.tsx" | grep -E "from\(|rpc\(|auth\."

# Find expected RPC functions
grep -r "\.rpc\(" --include="*.ts" --include="*.tsx"

# Find expected triggers/functions referenced
grep -r "handle_\|create_\|update_\|delete_" --include="*.ts" --include="*.tsx"
```

#### 1.2 Dashboard Expectations
Search for patterns in `reconciliation/active-work/dashboard/`:
```bash
# Find all table queries
grep -r "\.from\(" --include="*.ts" --include="*.tsx" | cut -d'"' -f2 | sort -u

# Find expected relationships (joins)
grep -r "\.select\(" --include="*.ts" --include="*.tsx" | grep -E "\*,|,\*"

# Find expected computed fields
grep -r "\.select\(" --include="*.ts" --include="*.tsx" | grep -v "select('*')"
```

#### 1.3 Expected Database Behaviors
Look for code that assumes:
- Auto-created records (like profile on signup)
- Cascade deletions
- Default values
- Computed columns
- View dependencies

---

## Specific Areas to Investigate

### 🔴 Critical Path Components

#### User Lifecycle
```typescript
// What should happen automatically?
signup → ? → ? → dashboard access

// Current understanding:
signup → auth.users → ❌ STOPS HERE

// Likely full flow:
signup → auth.users → trigger → profile → trigger? → student/judge/guardian → ready
```

#### Team Creation
```typescript
// What happens when creating a team?
createTeam() → ? → ? → team exists with what?

// Possible auto-creations:
- Team chat room?
- Default team settings?
- Founder as first member?
- Initial permissions?
```

#### Chat System
```typescript
// What creates chat rooms?
// When do messages get cleaned?
// How are notifications triggered?
```

### 🟡 Important But Not Blocking

#### Performance Optimizations
- Materialized views for leaderboards?
- Indexes beyond basic ones?
- Partitioning for large tables?

#### Audit/History
- Change tracking triggers?
- Audit log tables?
- Soft delete mechanisms?

#### Scheduled Jobs
- Cleanup functions?
- Rank recalculation?
- Session expiry?

---

## Discovery Checklist

### From Auth Gateway Code
- [ ] List all `.from()` queries → tables expected
- [ ] List all `.rpc()` calls → functions expected  
- [ ] List all `.auth` methods → auth flow expected
- [ ] Find error handling → what errors are expected?
- [ ] Check signup flow → what gets created?
- [ ] Check login flow → what gets updated?
- [ ] Check logout flow → what gets cleaned?

### From Dashboard Code
- [ ] Map all table dependencies
- [ ] Find all expected relationships
- [ ] Identify computed/virtual fields
- [ ] Look for background tasks
- [ ] Check role-specific logic
- [ ] Find team/guild operations
- [ ] Analyze chat implementation

### From Database Itself
- [ ] Check if original emdash has accessible documentation
- [ ] Look for SQL files in the repos
- [ ] Search for migration files
- [ ] Check for seed data that reveals structure

---

## Expected Discoveries (Based on Pattern)

### Likely Missing Triggers
```sql
-- User management
on_auth_user_created → create_profile
on_profile_created → create_role_record (student/judge/guardian)
on_user_deleted → cleanup_user_data

-- Team management
on_team_created → create_team_chat_room
on_team_member_added → update_team_stats
on_team_deleted → cleanup_team_data

-- Chat management
on_channel_created → set_default_permissions
on_message_sent → notify_recipients
on_message_deleted → soft_delete_only

-- Competition/Debate
on_debate_created → initialize_debate_state
on_score_submitted → calculate_results
on_tournament_ended → finalize_rankings
```

### Likely Missing Functions
```sql
-- RPC functions the app might call
get_user_stats(user_id)
get_team_members_with_roles(team_id)
calculate_user_ranking()
search_users_for_invite(query)
get_debate_history(user_id)
get_available_tournaments()
submit_debate_results(debate_id, scores)
```

### Likely Missing Policies
```sql
-- Cross-table RLS policies
"Team members can view team chat"
"Judges can view assigned debates"
"Guardians can view student profiles"
"Students can view public tournaments"
```

---

## Action Plan

### Immediate (Today)
1. ✅ Fix profile creation trigger (already identified)
2. 🔍 Scan auth gateway for next breaking point
3. 📝 Document each discovered dependency

### Short-term (Next Session)
1. Complete full codebase analysis
2. Create comprehensive trigger/function list
3. Build missing components systematically
4. Test each user journey end-to-end

### Long-term (Before Production)
1. Verify ALL business logic implemented
2. Create seed data for testing
3. Document for future maintenance
4. Consider creating a "business logic test suite"

---

## Key Questions to Answer

1. **What triggers exist in original emdash?**
   - Can we access their database documentation?
   - Are there SQL dumps available?
   - Can we infer from the codebase?

2. **What's the complete user journey?**
   - Signup → ? → Active user
   - Each step needs verification

3. **What are the cascade effects?**
   - Delete user → what else gets deleted?
   - Remove team member → what updates?
   - End tournament → what finalizes?

4. **What are the default values?**
   - New user defaults
   - New team defaults
   - Initial permissions

5. **What computed fields exist?**
   - Rankings
   - Statistics  
   - Aggregations
   - Derived values

---

## Investigation Output Format

For each discovered dependency:
```markdown
### Component: [Name]
**Type**: Trigger/Function/Policy/View
**Table**: [Affected table]
**Triggered by**: [Event or call]
**Expected behavior**: [What should happen]
**Current state**: Missing/Partial/Complete
**Code reference**: [File:line where expected]
**SQL to implement**: [Implementation]
**Priority**: Critical/High/Medium/Low
```

---

## Success Criteria

We'll know the investigation is complete when:
1. ✅ Can create user and access dashboard without errors
2. ✅ Can create and join teams successfully
3. ✅ Can use chat functionality
4. ✅ All user roles work correctly
5. ✅ No "undefined" or "null" errors in UI
6. ✅ All RPC calls have corresponding functions
7. ✅ All expected tables have appropriate triggers

---

## The Meta-Learning

**This investigation reveals a critical lesson:**
> "Adopting a codebase without its database business logic is like getting a recipe without knowing the cooking techniques - you have the ingredients but not the process."

Future sessions must understand: **The schema is just the beginning.**

---

*This investigation plan created after discovering the profile trigger gap - there are likely many more such gaps to find.*