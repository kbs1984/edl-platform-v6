---
session: "00124"
type: "quick-reference"
status: "ready"
created: "2025-08-31"
title: "Builder Quick Context - Just What You Need to Build"
purpose: "Minimal context for sessions implementing features"
topics: ["builder", "quick-reference", "implementation"]
priority: "P0"
domain: "reconciliation"
---

# Builder Quick Context - Start Building in 5 Minutes

## Your Current State (21 Tables Exist)

**You have these tables:**
```
public: profile, student, team, guardian, judge, guild, 
        bank_account, friendship, invitation, log, 
        payment_history, rating, school, team_member, ddl_audit_log
chat: room, message, participant
debate: (multiple tables for debate system)
```

**You DON'T have these (need to build):**
```
activity, activity_session, activity_instance, session_progress,
activity_assignment, assignment_submission, emcoin_transaction,
badge, badge_earned, achievement, resource, resource_access
```

## Your Tools

```python
# DDL Operations (create tables)
mcp__supabase_dev__apply_migration(name="feature_name", query="CREATE TABLE...")

# SQL Queries (check data)
mcp__supabase_dev__execute_sql(query="SELECT...")

# List current tables
mcp__supabase_dev__list_tables(schemas=["public", "chat"])

# Security check
mcp__supabase_dev__get_advisors(type="security")
```

## Build Process (5-Story Batches)

1. **Pick your batch** (5 stories max)
2. **Create migration** with rollback:
```python
sql_up = "CREATE TABLE activity..."
sql_down = "DROP TABLE activity CASCADE"
```
3. **Apply via MCP** (not manual SQL editor)
4. **Test immediately**
5. **Move to next batch** only when 100% done

## Where to Build

- **Read reference**: `truth-seed/emdash-dashboard-main/`
- **Build here**: `reconciliation/active-work/dashboard/`
- **Never edit**: truth-seed directory

## Definition of "Complete"

Story is ONLY done when:
- ✅ Tables created
- ✅ Code works
- ✅ Tests pass
- ✅ Can rollback

## Quick Commands

```bash
# Check what stories to build
grep "US-155\|US-156\|US-157" requirements/P0-ACTIVITY-RUNTIME-STORIES.md

# See current tables
mcp__supabase_dev__list_tables | grep activity  # Should be empty

# Test your feature
cd reconciliation/active-work/dashboard && npm run dev
```

---
*Skip everything else. Start building.*