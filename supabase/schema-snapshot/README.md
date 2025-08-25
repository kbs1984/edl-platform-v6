---
created: '2025-08-23'
domain: core
priority: P1
purpose: Document supabase schema snapshot system
session: legacy
status: current
title: Supabase Schema Snapshot System
topics:
- database
- guide
type: guide
---

# Supabase Schema Snapshot System

**Created**: Session 38 (2025-08-20)
**Purpose**: Provide visibility into actual database schema that Claude Code cannot access directly
**Status**: Implementation complete, awaiting first snapshot

## The Problem This Solves

Claude Code CLI cannot access Supabase system tables (pg_policies, information_schema, etc.), making it impossible to:
- See actual RLS policy definitions
- Verify what constraints exist
- Debug "violates RLS policy" errors
- Know what's really in the database vs what migrations claim

Per `00031-WORKFLOW-BOUNDARIES.md`, this is a fundamental limitation of Claude Code's autonomous capabilities.

## The Solution

This snapshot system captures the current Supabase schema state from the Dashboard and stores it locally, providing:
- **Visibility**: See actual RLS policies, not guesses
- **Diagnostics**: Debug errors with real policy text
- **Documentation**: Track schema evolution over time
- **Precision**: Generate exact SQL for manual fixes

## How It Works

### Three-Layer Verification (Per Session 37)

1. **Migration Files** (Intent) - What we wrote in SQL files
2. **Schema Snapshot** (Reality) - What actually exists in database
3. **Functional Tests** (Proof) - What actually works

This snapshot provides Layer 2 - the actual database state.

## Workflow

### Creating Initial Snapshot

```bash
# 1. Generate SQL queries
python3 scripts/00039-generate-snapshot-sql.py

# 2. Copy the SQL output
# 3. Go to Supabase Dashboard → SQL Editor
# 4. Paste and run each query
# 5. Copy the JSON results

# 6. Parse the results
python3 scripts/00039-parse-snapshot.py
# Paste each result when prompted

# 7. Verify snapshot created
python3 scripts/00039-check-schema.py --summary
```

### Using the Snapshot

```bash
# View all tables
python3 scripts/00039-check-schema.py --tables

# Check specific table details
python3 scripts/00039-check-schema.py --table profiles --all

# View RLS policies
python3 scripts/00039-check-schema.py --table profiles --policies

# Diagnose an error
python3 scripts/00039-check-schema.py --diagnose "violates row-level security policy"

# Get snapshot summary
python3 scripts/00039-check-schema.py --summary
```

### Updating After Changes

When schema changes are made in Supabase Dashboard:

1. Apply changes in Dashboard
2. Re-run the capture process (steps 1-6 above)
3. Commit updated snapshot files with clear message:
   ```
   git commit -m "snapshot: Updated after adding grade_level column
   
   Changes:
   - Added grade_level INTEGER to profiles table
   - No policy changes"
   ```

## Files in This Directory

- `README.md` - This documentation
- `snapshot-metadata.json` - When/how snapshot was taken
- `policies.json` - RLS policies (MOST CRITICAL)
- `tables.json` - Table and column definitions
- `constraints.json` - Primary keys, foreign keys, checks
- `indexes.json` - Database indexes
- `row-counts.json` - Current row counts
- `rls-status.json` - RLS enabled status per table
- `complete-snapshot.json` - Combined snapshot for easy access

## Important Limitations

Per `00031-WORKFLOW-BOUNDARIES.md`, this system is **READ-ONLY**:

✅ **CAN DO**:
- View actual RLS policies
- See table structure and constraints
- Diagnose errors with real data
- Generate fix instructions

❌ **CANNOT DO**:
- Apply fixes automatically
- Modify database schema
- Test INSERT/UPDATE/DELETE
- Change RLS policies

## Example Usage

### Diagnosing RLS Error

```bash
$ python3 scripts/00039-check-schema.py --table profiles --policies

📋 TABLE: profiles
==================================================

🔐 RLS POLICIES:

   INSERT - "Users create own profile"
      Roles: authenticated
      Check: auth.uid() = user_id

   SELECT - "Anyone can view profiles"
      Roles: authenticated, anon
      Using: true

⚠️  No UPDATE policy found!

💡 MANUAL FIX REQUIRED:
1. Go to Supabase Dashboard → SQL Editor
2. Run:
   CREATE POLICY "Users update own profile"
   ON profiles FOR UPDATE
   TO authenticated
   USING (auth.uid() = user_id)
   WITH CHECK (auth.uid() = user_id);
3. Update snapshot after applying fix
```

## Version Control

Snapshot files should be committed to git to track schema evolution:
- Shows what changed when
- Provides audit trail
- Enables rollback reference

## Privacy & Security

- Never capture actual user data (emails, IDs)
- Only structure and metadata
- Sample data only if non-sensitive
- Safe to commit to repository

## Integration with Other Tools

The snapshot can be imported by other scripts:

```python
from pathlib import Path
import json

# Load snapshot in other scripts
snapshot_path = Path("supabase/schema-snapshot/complete-snapshot.json")
if snapshot_path.exists():
    with open(snapshot_path) as f:
        snapshot = json.load(f)
        policies = snapshot['snapshot']['policies']
        # Now you can see actual policies!
```

## Maintenance

- Update snapshot when schema changes
- Check age with `--summary` flag
- Warning shown if >7 days old
- Keep snapshots after major changes for reference

---

*This snapshot system bridges the visibility gap identified in Session 39, enabling precise debugging without violating Claude Code's workflow boundaries.*