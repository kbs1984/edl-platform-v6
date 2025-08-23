---
session: "unknown"
type: "guide"
status: "current"
created: "2025-08-23"
title: "Migration Batch System - Session 00050"
purpose: "Document migration batch system - session 00050"
topics: ['database', 'guide']
priority: "P1"
domain: "core"
---

# Migration Batch System - Session 00050

## Overview

This directory contains the complete migration split into 9 testable batches. Each batch can be executed and verified independently.

---

## Quick Start

```bash
# 1. Execute a batch
psql -d your_database -f batch-01-foundation.sql

# OR via Supabase Dashboard:
# Copy contents of batch-XX file and run in SQL Editor

# 2. Verify the batch
SUPABASE_URL="your_url" SUPABASE_ANON_KEY="your_key" \
python3 verify-batch.py 1

# 3. Check manifest for status
cat migration-manifest.json | jq '.batches."01"'
```

---

## Batch Order (MUST FOLLOW)

| Batch | Name | Dependencies | Components | Lines |
|-------|------|--------------|------------|-------|
| 01 | Foundation | None | Extensions, Schemas | 51 |
| 02 | Types | Batch 01 | 12 ENUM types | 135 |
| 03 | Tables | Batch 01, 02 | 36 tables (no FKs) | 449 |
| 04 | Constraints | Batch 03 | Foreign keys | 24 |
| 05 | Functions | Batch 03 | 44 functions | 35 |
| 06 | Triggers | Batch 05 | 16 triggers | 42 |
| 07 | Indexes | Batch 03 | 20 indexes | TBD |
| 08 | RLS | Batch 03 | Policies | TBD |
| 09 | EDL | Batch 03 | call_sign column | TBD |

---

## Files

### SQL Batches
- `batch-01-foundation.sql` - Extensions and schemas
- `batch-02-types.sql` - Custom ENUM types
- `batch-03-tables.sql` - Table structures
- `batch-04-constraints.sql` - Foreign keys
- `batch-05-functions.sql` - Business logic
- `batch-06-triggers.sql` - Event triggers
- `batch-07-indexes.sql` - Performance indexes (TBD)
- `batch-08-rls.sql` - Security policies (TBD)
- `batch-09-edl.sql` - EDL-specific additions (TBD)

### Support Files
- `migration-manifest.json` - Tracks migration state
- `verify-batch.py` - Verification script
- `00050-BATCH-PLAN.md` - Detailed strategy

---

## Why Batches?

1. **Testable**: Each batch can be verified before proceeding
2. **Debuggable**: Problems isolated to specific batch
3. **Trackable**: Reality domain knows exact state
4. **Resumable**: Can stop and continue later
5. **Rollback-able**: Can revert to any batch

---

## Verification

Each batch includes verification queries. After execution:

```sql
-- Example for Batch 03 (Tables)
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema IN ('public', 'chat', 'debate')
AND table_type = 'BASE TABLE';
-- Expected: 36
```

---

## Troubleshooting

### If a batch fails:

1. **Check the error message**
   - Missing dependency? Run prerequisite batches first
   - Syntax error? Check against backup file
   - Already exists? May need to drop and recreate

2. **Consult the backup**
   ```bash
   grep -A 10 "problematic_item" ../../supabase-project.backup
   ```

3. **Check manifest status**
   ```bash
   cat migration-manifest.json | jq '.batches'
   ```

4. **Verify with Reality Agent**
   ```bash
   python3 ../../reality/agent-reality-auditor/supabase-connector/quickstart.py
   ```

---

## Current Status

- ✅ Batches 01-06 created from Desktop's migration
- ⏳ Batches 07-09 need to be created from backup
- ⏳ No batches executed yet
- ⏳ Manifest ready for tracking

---

## Next Steps

1. Create remaining batches (07-09) from backup
2. Test Batch 01 in development environment
3. Proceed through batches sequentially
4. Update Reality domain with results

---

*Batch system created Session 00050 for systematic migration*