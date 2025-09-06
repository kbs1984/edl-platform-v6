---
session: "00124"
type: "quick-reference"
status: "ready"
created: "2025-08-31"
title: "Quick Table Reference - What Exists vs What to Build"
purpose: "Instant reference for database state"
topics: ["tables", "database", "quick-reference"]
priority: "P0"
domain: "reconciliation"
---

# Quick Table Reference

## ✅ Tables That EXIST (21 total)

### Public Schema (18 tables)
```sql
profile         -- User profiles (20 rows)
student         -- Student records (7 rows)  
team            -- Team groups (0 rows)
guardian        -- Guardian accounts (0 rows)
judge           -- Judge accounts (0 rows)
guild           -- Guild groups (0 rows)
friendship      -- Friend connections (2 rows)
invitation      -- Team/guild invites (0 rows)
school          -- School records (5 rows)
team_member     -- Team memberships (0 rows)
guild_member    -- Guild memberships (0 rows)
bank_account    -- Payment info (0 rows)
payment_history -- Transaction log (0 rows)
rating          -- Judge ratings (0 rows)
log             -- Activity log (0 rows)
guardian_request-- Guardian links (0 rows)
admin           -- Admin users (0 rows)
ddl_audit_log   -- DDL tracking (8 rows)
```

### Chat Schema (3 tables)
```sql
room            -- Chat rooms (1 row)
message         -- Chat messages (1 row)
participant     -- Room members (2 rows)
```

## ❌ Tables to BUILD (Activity Runtime)

### Batch 1: Core Structure
```sql
activity        -- Activity definitions
activity_session-- Multi-session support
```

### Batch 2: Player Progress
```sql
activity_instance -- Player participation
session_progress  -- Save/resume capability
```

### Batch 3: Assignments
```sql
activity_assignment   -- Assignment definitions
assignment_submission -- Student submissions
```

## ❌ Tables to BUILD (Other Features)

### EmCoin Economy
```sql
emcoin_wallet
emcoin_transaction
emcoin_ledger
```

### Badge System
```sql
badge
badge_earned
achievement
```

### Resource System
```sql
resource
resource_access
resource_category
```

## Quick Check Commands

```bash
# Count activity tables (should be 0)
mcp__supabase_dev__list_tables | grep -c activity

# Check if profile table has data
mcp__supabase_dev__execute_sql(query="SELECT COUNT(*) FROM profile")
# Result: 20 profiles exist

# See empty tables that need data
mcp__supabase_dev__execute_sql(query="
  SELECT table_name, 0 as row_count 
  FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name IN ('team', 'guardian', 'judge', 'guild')
")
```

---
*21 tables exist. Activity tables don't. Build them.*