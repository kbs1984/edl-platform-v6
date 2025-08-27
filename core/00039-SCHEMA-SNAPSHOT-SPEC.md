---
created: '2025-08-23'
domain: core
priority: P1
purpose: Document supabase schema snapshot specification
session: 00039
status: current
title: Supabase Schema Snapshot Specification
topics:
- database
- documentation
type: guide
---

# Supabase Schema Snapshot Specification
## For Session 38 Implementation

### Problem Statement
Claude Code CLI cannot access Supabase system tables (pg_policies, information_schema, etc.) which makes it impossible to verify the actual database state. We can only see the effects of policies, not their definitions. This leads to guesswork when debugging RLS errors or schema issues.

### Solution Overview
Create a snapshot system that captures the current Supabase schema state and stores it in the codebase as our "source of truth". When schema changes are made via Supabase Dashboard, we update the snapshot.

## Detailed Requirements

### 1. Snapshot Data to Capture

Create a comprehensive snapshot that includes:

```sql
-- A. Table Definitions
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- B. RLS Policies (CRITICAL for debugging)
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- C. Constraints (Primary Keys, Foreign Keys, Unique, Check)
SELECT 
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    cc.check_clause
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
LEFT JOIN information_schema.constraint_column_usage ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
LEFT JOIN information_schema.check_constraints cc
    ON cc.constraint_name = tc.constraint_name
    AND cc.constraint_schema = tc.table_schema
WHERE tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_name;

-- D. Indexes
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- E. Row Counts (for basic data verification)
SELECT 'profiles' as table_name, COUNT(*) as row_count FROM profiles
UNION ALL
SELECT 'teams', COUNT(*) FROM teams
UNION ALL
SELECT 'team_members', COUNT(*) FROM team_members
UNION ALL
SELECT 'team_join_requests', COUNT(*) FROM team_join_requests;

-- F. Sample Data (first 3 rows of each table, sanitized)
-- Only include non-sensitive columns like call_sign, role, created_at
-- Exclude user_id, email, etc.
```

### 2. Snapshot File Structure

Create these files in a new directory `supabase/schema-snapshot/`:

```
supabase/schema-snapshot/
├── README.md                    # Explains snapshot system
├── snapshot-metadata.json       # When taken, by whom, version
├── tables.json                  # Table and column definitions
├── policies.json               # RLS policies (MOST IMPORTANT)
├── constraints.json            # All constraints
├── indexes.json                # Index definitions
├── row-counts.json             # Current row counts
└── capture-snapshot.sql        # SQL to run in Supabase Dashboard
```

### 3. Implementation Files

#### A. Create Capture Script: `scripts/00039-generate-snapshot-sql.py`
```python
#!/usr/bin/env python3
"""
Generates SQL queries to capture Supabase schema snapshot.
Copy the output and run in Supabase SQL Editor.
"""

def generate_snapshot_sql():
    # Generate all SQL queries formatted for easy copying
    # Output should be ready to paste into Supabase SQL Editor
    # Results should be formatted as JSON for easy parsing
    pass
```

#### B. Create Parser Script: `scripts/00039-parse-snapshot.py`
```python
#!/usr/bin/env python3
"""
Parses the results from Supabase SQL Editor and creates snapshot files.
Usage: 
1. Run capture SQL in Supabase Dashboard
2. Copy results to clipboard
3. Run: python3 scripts/00039-parse-snapshot.py
4. Paste results when prompted
"""

def parse_and_save_snapshot():
    # Parse pasted results
    # Create JSON files in supabase/schema-snapshot/
    # Update metadata with timestamp
    pass
```

#### C. Create Reader Script: `scripts/00039-check-schema.py`
```python
#!/usr/bin/env python3
"""
Reads the schema snapshot and provides useful information.
Can answer questions like:
- What RLS policies exist for profiles table?
- What columns does profiles table have?
- What constraints are on call_sign column?
"""

def check_schema(table_name=None, policy_type=None):
    # Read from snapshot files
    # Provide formatted output
    # This replaces direct Supabase queries
    pass
```

### 4. Workflow Process

#### Initial Snapshot Capture:
1. Run `python3 scripts/00039-generate-snapshot-sql.py`
2. Copy the generated SQL
3. Go to Supabase Dashboard → SQL Editor
4. Paste and run the SQL
5. Copy all results
6. Run `python3 scripts/00039-parse-snapshot.py`
7. Paste results when prompted
8. Snapshot files are created

#### Using the Snapshot:
```bash
# Check what policies exist
python3 scripts/00039-check-schema.py --table profiles --policies

# Check table structure
python3 scripts/00039-check-schema.py --table profiles --columns

# Check everything about a table
python3 scripts/00039-check-schema.py --table profiles --all
```

#### Updating After Schema Changes:
1. Make changes in Supabase Dashboard
2. Re-run the capture process
3. Commit the updated snapshot files
4. Document what changed in the commit message

### 5. Example Snapshot Content

`supabase/schema-snapshot/policies.json`:
```json
{
  "profiles": [
    {
      "policyname": "Users create own profile",
      "cmd": "INSERT",
      "roles": ["authenticated"],
      "with_check": "auth.uid() = user_id",
      "permissive": "PERMISSIVE"
    },
    {
      "policyname": "Anyone can view profiles",
      "cmd": "SELECT",
      "roles": ["authenticated", "anon"],
      "qual": "true",
      "permissive": "PERMISSIVE"
    }
  ]
}
```

### 6. Critical Implementation Notes

1. **Privacy**: Never capture actual user data (emails, IDs). Only structure and sample non-sensitive data.

2. **Version Control**: Always commit snapshot changes with clear messages:
   ```
   git commit -m "snapshot: Update after adding grade_level column
   
   Changes:
   - Added grade_level INTEGER column to profiles
   - No policy changes
   - No constraint changes"
   ```

3. **Validation**: The checker script should validate snapshot age and warn if stale:
   ```python
   if snapshot_age_days > 7:
       print("⚠️ Snapshot is {} days old, consider updating".format(snapshot_age_days))
   ```

4. **Integration**: Modify existing debug scripts to use snapshot:
   ```python
   # Instead of guessing at policies:
   from scripts.check_schema import get_policies
   policies = get_policies('profiles')
   print(f"Actual policies: {policies}")
   ```

### 7. Success Criteria

- [ ] Can capture complete schema from Supabase Dashboard
- [ ] Snapshot includes all RLS policies with their exact definitions
- [ ] Can query snapshot from CLI instead of Supabase
- [ ] Updates are easy (re-run capture process)
- [ ] Other sessions can use this to understand schema

### 7.1 Workflow Boundaries Compliance

Per `00031-WORKFLOW-BOUNDARIES.md`, this snapshot system respects:

**✅ Within Claude Code Boundaries:**
- Read-only operations on snapshot data
- Schema verification and analysis
- Documentation generation
- Creating manual intervention checklists

**❌ Still Requires Manual Intervention:**
- Running SQL in Supabase Dashboard to capture snapshot
- Applying any schema changes or fixes
- Testing INSERT/UPDATE/DELETE operations
- Modifying RLS policies

The snapshot system ENHANCES autonomous capabilities by providing visibility into the actual schema, but does NOT bypass the manual intervention requirements for database mutations.

### 8. Questions for Session 38

Please consider and provide answers to:

1. **Format Preference**: JSON (shown above) or SQL format for snapshots?
2. **Automation**: Should we create a GitHub Action that reminds to update snapshot?
3. **Diff Tool**: Should we create a tool to show differences between snapshots?
4. **Migration Sync**: Should snapshot reference which migrations have been applied?
5. **Partial Updates**: Allow updating just policies or just one table?

### 9. Benefits This Provides

1. **No More Guessing**: See actual RLS policies, not assumed ones
2. **Debugging**: Can diagnose "violates RLS policy" with actual policy text
3. **Documentation**: Snapshot serves as documentation of current state
4. **Audit Trail**: Git history shows schema evolution
5. **Offline Work**: Can work on schema-dependent code without Supabase access

### 10. Example Usage After Implementation

```bash
# Session 39 debugging profile creation error:
$ python3 scripts/00039-check-schema.py --table profiles --policies

Profiles Table RLS Policies (from snapshot 2024-08-19):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INSERT - "Users create own profile"
  Roles: authenticated
  Check: auth.uid() = user_id
  
SELECT - "Anyone can view profiles"  
  Roles: authenticated, anon
  Qual: true

⚠️ No UPDATE policy found - users cannot update their profiles!

MANUAL INTERVENTION REQUIRED:
Per 00031-WORKFLOW-BOUNDARIES.md, to fix this issue:
1. Go to Supabase Dashboard → SQL Editor
2. Run: CREATE POLICY "Users update own profile" ...
3. Test manually with real user account
4. Update snapshot after fix is applied
```

This would have immediately shown us the actual policies instead of guessing, AND provided clear manual intervention instructions per workflow boundaries.

## Prompt for Session 38

"Please implement the Supabase Schema Snapshot system as specified in `00039-SCHEMA-SNAPSHOT-SPEC.md`. This system will capture the current database schema from Supabase Dashboard and store it in the codebase, allowing future sessions to see actual RLS policies, constraints, and table structures without dashboard access. 

Start by creating the three scripts (generate, parse, check) and test the workflow with a simple capture of just the profiles table policies. Once working, expand to capture all specified data.

The most critical data to capture is RLS policies, as these cannot be accessed from CLI and cause the most debugging issues."

---
*Specification created by Session 00039 after discovering CLI limitations during profile creation debugging*