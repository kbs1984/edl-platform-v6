---
session: "00050"
type: "documentation"
status: "current"
created: "2025-08-23"
title: "Migration Batch Plan - Session 00050"
purpose: "Document migration batch plan - session 00050"
topics: ['documentation']
priority: "P1"
domain: "core"
---

# Migration Batch Plan - Session 00050

**Strategy**: Divide the complete migration into testable batches with Reality tracking

---

## Batch Execution Order (Dependency-Aware)

### 🟦 Batch 01: Foundation (MUST RUN FIRST)
**File**: `batch-01-foundation.sql`
- Extensions (uuid-ossp, etc.)
- Schemas (chat, debate)
- **Dependencies**: None
- **Verification**: Check schemas exist

### 🟨 Batch 02: Custom Types
**File**: `batch-02-types.sql`
- All ENUMs and custom types
- debate.criteria_group, public.division, etc.
- **Dependencies**: Batch 01
- **Verification**: List all types

### 🟩 Batch 03: Base Tables (Structure Only)
**File**: `batch-03-tables.sql`
- All 36 tables WITHOUT foreign keys
- Just structure and primary keys
- **Dependencies**: Batch 01, 02
- **Verification**: Count tables = 36

### 🟧 Batch 04: Constraints
**File**: `batch-04-constraints.sql`
- Foreign key constraints
- Check constraints
- Unique constraints
- **Dependencies**: Batch 03
- **Verification**: Check relationships

### 🟪 Batch 05: Functions (Business Logic)
**File**: `batch-05-functions.sql`
- All 44 application functions
- Grouped by schema (public, chat, debate)
- **Dependencies**: Batch 03
- **Verification**: List functions

### 🟥 Batch 06: Triggers
**File**: `batch-06-triggers.sql`
- All 16 triggers
- Links functions to table events
- **Dependencies**: Batch 05
- **Verification**: Check trigger status

### ⬜ Batch 07: Indexes (Performance)
**File**: `batch-07-indexes.sql`
- All 20 performance indexes
- Can run anytime after tables
- **Dependencies**: Batch 03
- **Verification**: Check index usage

### ⬛ Batch 08: RLS (Security)
**File**: `batch-08-rls.sql`
- Enable RLS on tables
- Create policies
- **Dependencies**: Batch 03
- **Verification**: Check RLS status

### 🟦 Batch 09: EDL Additions
**File**: `batch-09-edl-specific.sql`
- Add call_sign column to student
- Any other EDL-specific changes
- **Dependencies**: Batch 03
- **Verification**: Check column exists

---

## Testing Protocol for Each Batch

```bash
# 1. Execute batch
psql -d postgres -f batch-XX-name.sql

# 2. Verify with Reality Agent
python3 reality/agent-reality-auditor/supabase-connector/quickstart.py

# 3. Run batch verification
python3 scripts/verify-batch-XX.py

# 4. Update migration manifest
python3 scripts/update-migration-manifest.py --batch XX --status success
```

---

## Reality Domain Integration

### Migration Manifest Structure
```json
{
  "migration_session": "00050",
  "database_state": {
    "schemas": ["public", "chat", "debate"],
    "tables_count": 36,
    "functions_count": 44,
    "last_batch_applied": 0,
    "batches": {
      "01": {"status": "pending", "tables": 0, "verified": false},
      "02": {"status": "pending", "types": 0, "verified": false},
      // ... etc
    }
  }
}
```

### Reality Agent Checks
- After each batch, Reality Agent updates the manifest
- Tracks what's actually in the database
- Provides rollback points if needed

---

## Rollback Strategy

If a batch fails:
1. Stop immediately
2. Check Reality manifest for last good state
3. Fix the issue in the batch file
4. Re-run from failed batch

---

## Benefits of This Approach

1. **Testable**: Each batch can be verified independently
2. **Trackable**: Reality domain knows exact state
3. **Debuggable**: Problems isolated to specific batch
4. **Reversible**: Can rollback to any batch
5. **Confident**: Know exactly what's in database
6. **Resume-able**: Can stop and continue later

---

## Next Steps

1. Extract each batch from backup/Desktop's migration
2. Create verification script for each batch
3. Create Reality manifest tracker
4. Test Batch 01 first
5. Proceed sequentially through batches

---

*This batched approach ensures we KNOW what's in our database at each step*