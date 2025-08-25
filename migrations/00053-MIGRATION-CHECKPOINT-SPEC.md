---
created: '2025-08-23'
domain: core
priority: P1
purpose: Document migration checkpoint specification
session: '00053'
status: current
title: Migration Checkpoint Specification
topics:
- database
- migration
- documentation
type: guide
---

# Migration Checkpoint Specification
**Session**: 00053  
**Date**: 2025-08-22  
**Purpose**: Define the immutable baseline for truth-seed database migration  

---

## Overview

This specification defines how we capture, verify, and lock the completed migration state to prevent drift and ensure all future development starts from the same verified truth.

---

## Checkpoint Components

### 1. Database State Snapshot
Captures the complete post-migration database structure:

```json
{
  "timestamp": "2025-08-22T16:30:00",
  "session": "00052",
  "migration_source": "migrations/supabase-project.backup",
  "database_state": {
    "schemas": ["public", "chat", "debate"],
    "tables": 36,
    "functions": 27,
    "triggers": 17,
    "types": 12,
    "constraints": {
      "primary_keys": 36,
      "foreign_keys": 52,
      "unique": 13,
      "check": 0
    },
    "indexes": 15,
    "rls_policies": 40,
    "rls_enabled_tables": 19,
    "extensions": ["uuid-ossp", "pg_trgm"],
    "edl_additions": ["call_sign column on public.student"]
  }
}
```

### 2. Immutable vs Modifiable Classification

#### Protected (Immutable) - Cannot be modified without constitutional amendment:
- **Core Tables** (36): Structure and relationships
  - public: student, guardian, judge, admin, team, guild, etc.
  - chat: message, participant, room
  - debate: debates, ballots, motions, etc.
- **Trigger Functions** (16): Core automation logic
- **Business Logic Functions**: add_new_user, search_school, etc.
- **Custom Types** (12): ENUMs defining system constants
- **Foreign Key Relationships** (52): Data integrity constraints

#### Modifiable with Tracking - Can evolve with Reality Agent verification:
- **RLS Policies**: Can be refined for security improvements
- **Performance Indexes**: Can add more for optimization
- **New Functions**: Additions allowed, modifications require review
- **call_sign Column**: EDL addition, can be enhanced
- **New Columns**: Can extend tables with backward compatibility

### 3. Verification Hash Generation

Using the existing Session 38-39 snapshot system for consistency:

```python
from scripts.00039_check_schema import SchemaChecker
from hashlib import sha256
import json

def generate_migration_checkpoint_hash():
    """Generate deterministic hash of migration state"""
    checker = SchemaChecker()
    
    # Gather all components in alphabetical order
    checkpoint_data = {
        "constraints": sorted(get_constraints()),
        "functions": sorted(get_functions()),
        "indexes": sorted(get_indexes()),
        "policies": sorted(get_policies()),
        "schemas": sorted(["public", "chat", "debate"]),
        "tables": sorted(get_tables()),
        "triggers": sorted(get_triggers()),
        "types": sorted(get_types())
    }
    
    # Create deterministic JSON string
    json_str = json.dumps(checkpoint_data, sort_keys=True, indent=2)
    
    # Generate SHA256 hash
    return sha256(json_str.encode()).hexdigest()
```

---

## Lock File Structure

### Location: `reality/truth-seed-manifest-lock.json`

```json
{
  "version": "1.0.0",
  "locked_at": "2025-08-22T17:00:00",
  "locked_by_session": "00053",
  "migration_completed": "2025-08-22T16:30:00",
  "migration_session": "00052",
  "total_batches_applied": 13,
  "migration_batches": [
    "01-foundation",
    "01b-pg-trgm",
    "02-types",
    "03-tables",
    "03b-primary-keys",
    "03c-unique-constraints",
    "03d-additional-unique",
    "04-foreign-keys",
    "05-functions",
    "06-triggers",
    "07-indexes",
    "08-rls-policies",
    "09-edl-additions"
  ],
  "database_checksum": "[sha256 hash will be generated]",
  "checksum_algorithm": "sha256",
  "immutable_objects": [...],
  "modifiable_with_tracking": [...],
  "override_requires": "constitutional_amendment",
  "verification_script": "scripts/00053-verify-migration-integrity.sh"
}
```

---

## Reality Agent Integration

### Migration-Aware Reality Agent Pattern

```python
# reality/agent-reality-auditor/migration-lock-validator.py

class MigrationLockValidator:
    """Ensures database matches locked migration state"""
    
    def __init__(self):
        self.lock = self.load_migration_lock()
        self.snapshot_system = SchemaChecker()  # Reuse Session 38-39
        
    def validate_no_drift(self):
        """Check if database has drifted from baseline"""
        current = self.snapshot_system.get_complete_snapshot()
        expected_hash = self.lock['database_checksum']
        
        # Fast check via hash
        current_hash = self.generate_checksum(current)
        if current_hash == expected_hash:
            return {"valid": True, "drift": None}
            
        # Detailed drift analysis if hashes don't match
        return self.detailed_drift_analysis(current)
        
    def detailed_drift_analysis(self, current):
        """Identify specific drift points"""
        drift_report = {
            "tables": self.compare_tables(current),
            "functions": self.compare_functions(current),
            "policies": self.compare_policies(current),
            "summary": None
        }
        
        # Classify drift severity
        if self.has_immutable_drift(drift_report):
            drift_report["severity"] = "CRITICAL"
            drift_report["action"] = "Restore from backup or amend constitution"
        elif self.has_trackable_drift(drift_report):
            drift_report["severity"] = "WARNING"
            drift_report["action"] = "Document changes in Reality manifest"
        else:
            drift_report["severity"] = "INFO"
            drift_report["action"] = "No action needed"
            
        return {"valid": False, "drift": drift_report}
```

---

## Session Startup Integration

Add to `scripts/00028-session-start.sh`:

```bash
# After Reality Agent checks
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 2.5/6: Verifying Migration Integrity"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "reality/truth-seed-manifest-lock.json" ]; then
    ./scripts/00053-verify-migration-integrity.sh || {
        echo "⚠️  WARNING: Migration integrity check failed!"
        echo "   Possible causes:"
        echo "   1. Database modified outside tracked migrations"
        echo "   2. Migration not completed properly"
        echo "   3. Reality Agents out of sync"
        echo ""
        read -p "Continue anyway? (y/N): " confirm
        [ "$confirm" != "y" ] && exit 1
    }
    echo "  ✓ Migration integrity verified"
else
    echo "  ℹ️  No migration lock file (pre-Session 53)"
fi
```

---

## Verification Script

### `scripts/00053-verify-migration-integrity.sh`

```bash
#!/bin/bash
# Verify migration hasn't drifted from locked baseline

echo "🔍 Verifying Migration Integrity..."

# 1. Check lock file exists
if [ ! -f "reality/truth-seed-manifest-lock.json" ]; then
    echo "❌ CRITICAL: No migration lock file found!"
    echo "   Run: python3 scripts/00053-create-migration-lock.py"
    exit 1
fi

# 2. Extract expected checksum
EXPECTED=$(jq -r '.database_checksum' reality/truth-seed-manifest-lock.json)

# 3. Generate current checksum
ACTUAL=$(python3 scripts/00053-generate-schema-checksum.py)

# 4. Compare
if [ "$EXPECTED" != "$ACTUAL" ]; then
    echo "❌ Schema has drifted from migration baseline!"
    echo "   Expected: $EXPECTED"
    echo "   Actual:   $ACTUAL"
    echo ""
    echo "   Run drift analysis:"
    echo "   python3 reality/agent-reality-auditor/migration-lock-validator.py"
    exit 1
fi

echo "✅ Migration integrity verified - no drift detected"
echo "   Checksum: ${EXPECTED:0:16}..."
```

---

## Key Implementation Commands

```bash
# Create initial lock file
python3 scripts/00053-create-migration-lock.py

# Generate current schema checksum
python3 scripts/00053-generate-schema-checksum.py

# Verify integrity
./scripts/00053-verify-migration-integrity.sh

# Check for drift
python3 reality/agent-reality-auditor/migration-lock-validator.py

# View lock status
cat reality/truth-seed-manifest-lock.json | jq .
```

---

## Success Criteria

1. **Checkpoint Created**: Complete snapshot of migration state captured
2. **Hash Generated**: Deterministic checksum of database structure
3. **Lock File Written**: Immutable baseline documented
4. **Verification Works**: Script can detect drift
5. **Session Integration**: Startup checks migration integrity
6. **Reality Agents Updated**: Understand locked baseline

---

## Why This Matters

Without this checkpoint:
- Sessions won't know the true database state
- Changes could break carefully crafted relationships
- Reality Agents can't detect unauthorized modifications
- The migration work becomes meaningless over time

With this checkpoint:
- Every session starts from verified truth
- Drift is immediately detected
- Protected objects remain stable
- Evolution is tracked and intentional

---

*This specification ensures the truth-seed migration becomes the immutable foundation for all future development.*