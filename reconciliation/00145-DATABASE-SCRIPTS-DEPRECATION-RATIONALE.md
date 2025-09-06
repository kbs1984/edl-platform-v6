---
session: "00145"
type: "decision"
status: "complete"
created: "2025-09-03"
title: "Database Verification Scripts Deprecation - MCP Replacement"
purpose: "Document why database verification scripts are obsolete and should remain in archive"
topics: ["database", "mcp", "deprecation", "verification"]
priority: "P0"
domain: "reconciliation"
---

# Database Verification Scripts Deprecation Rationale

## Scripts Affected
- `00038-save-complete-snapshot.py` - Schema snapshot saver
- `00039-check-schema.py` - Static snapshot reader
- `00039-save-snapshot.py` - Snapshot creation tool
- `00040-verify-rls-policies.py` - RLS policy tester
- `00044-dual-verification-protocol.py` - Dual existence/access checker
- `00046-database-verification.py` - Database state verifier
- `00053-verify-migration-integrity.sh` - Migration integrity checker

## Why These Are Obsolete

### Old Approach (Scripts)
```python
# Complex Python scripts with:
- Manual credential management
- Static snapshot files that go stale
- Complex error parsing logic
- Workarounds for Supabase client limitations
- Multiple scripts for different checks
```

### New Approach (Supabase MCP)
```python
# Direct, live access via MCP:
mcp__supabase-dev__list_tables()         # Live schema with RLS status
mcp__supabase-dev__execute_sql()         # Any SQL query directly
mcp__supabase-dev__apply_migration()     # Direct migration application
mcp__supabase-dev__get_logs()           # Debug logs
```

## Specific Replacements

| Old Script | Purpose | MCP Replacement |
|------------|---------|-----------------|
| 00039-check-schema.py | Read static snapshots | `list_tables()` - live data |
| 00044-dual-verification | Check existence vs access | `list_tables()` shows RLS, `execute_sql()` for details |
| 00040-verify-rls | Test RLS policies | `execute_sql("SELECT * FROM pg_policies")` |
| 00053-verify-migration | Check migrations | `apply_migration()` with verification |
| 00038/39-save-snapshot | Create snapshots | No need - live queries anytime |

## Key Advantages of MCP

1. **Live Data**: Always current, no stale snapshots
2. **No Credentials**: Built into MCP configuration
3. **Direct SQL**: Run any query without client limitations
4. **Simpler**: One tool instead of 7 different scripts
5. **Faster**: No connection setup overhead
6. **Complete**: Can check triggers, functions, policies, etc.

## Lesson Learned

Both Session 144 and Session 145 made the same error:
- **Session 144**: Moved scripts based on number patterns (00-49 = old)
- **Session 145**: Restored scripts based on CLAUDE.md references (referenced = critical)

**Both violated the no-guesswork protocol** by not checking:
1. What each script actually does
2. Whether newer tools (MCP) replaced them
3. If they're still needed in current workflow

## Correct Decision

These database verification scripts should remain obsolete/archived because:
1. Supabase MCP completely replaces their functionality
2. MCP provides superior live access vs static snapshots
3. Maintaining parallel tools creates confusion
4. CLAUDE.md has been updated to reference MCP methods

## Note on Session 144

Session 144 was accidentally correct about these specific scripts being obsolete, but:
- Used wrong methodology (number patterns)
- Caught critical infrastructure in the same sweep
- Violated no-guesswork protocol

The right result for wrong reasons still caused damage by moving actually critical scripts like 00028 (session starter).