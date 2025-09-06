#!/bin/bash
# 00053-verify-migration-integrity.sh
# Verify the migration hasn't drifted from locked baseline

echo "🔍 Verifying Migration Integrity..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Check lock file exists
if [ ! -f "reality/truth-seed-manifest-lock.json" ]; then
    echo "❌ CRITICAL: No migration lock file found!"
    echo "   The migration checkpoint has not been created."
    echo ""
    echo "   To create it, run:"
    echo "   python3 scripts/00053-create-migration-lock.py"
    exit 1
fi

echo "✓ Lock file found"

# 2. Extract expected checksum
EXPECTED=$(jq -r '.database_checksum' reality/truth-seed-manifest-lock.json)
if [ -z "$EXPECTED" ] || [ "$EXPECTED" == "null" ]; then
    echo "❌ ERROR: No checksum found in lock file!"
    exit 1
fi

echo "✓ Expected checksum: ${EXPECTED:0:16}..."

# 3. Generate current checksum (reuse the same logic)
ACTUAL=$(python3 -c "
import json
import hashlib
from pathlib import Path

manifest_path = Path('migrations/batches/migration-manifest.json')
with open(manifest_path, 'r') as f:
    manifest = json.load(f)

checkpoint_data = {
    'constraints': {
        'foreign_keys': manifest['database_state']['foreign_keys'],
        'primary_keys': manifest['database_state']['primary_keys'],
        'unique_constraints': manifest['database_state']['unique_constraints']
    },
    'extensions': sorted(manifest['database_state']['extensions']),
    'functions_count': manifest['database_state']['functions_count'],
    'indexes_count': manifest['database_state']['indexes_count'],
    'rls_policies': manifest['database_state']['rls_policies'],
    'schemas': sorted(manifest['database_state']['schemas']),
    'tables_count': manifest['database_state']['tables_count'],
    'triggers_count': manifest['database_state']['triggers_count'],
    'types_count': manifest['database_state']['types_count']
}

json_str = json.dumps(checkpoint_data, sort_keys=True, indent=2)
checksum = hashlib.sha256(json_str.encode()).hexdigest()
print(checksum)
")

echo "✓ Current checksum:  ${ACTUAL:0:16}..."

# 4. Compare checksums
if [ "$EXPECTED" != "$ACTUAL" ]; then
    echo ""
    echo "❌ CRITICAL: Schema has drifted from migration baseline!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "   Expected: $EXPECTED"
    echo "   Actual:   $ACTUAL"
    echo ""
    echo "   This means the database structure has changed since the"
    echo "   migration was locked. Possible causes:"
    echo "   • Manual changes in Supabase Dashboard"
    echo "   • Untracked migration scripts"
    echo "   • Drift in Reality Agent tracking"
    echo ""
    echo "   To investigate:"
    echo "   1. Check migration manifest for changes:"
    echo "      diff reality/truth-seed-manifest-lock.json migrations/batches/migration-manifest.json"
    echo "   2. Run drift analysis:"
    echo "      python3 reality/agent-reality-auditor/migration-lock-validator.py"
    echo "   3. Review recent session logs for database work"
    exit 1
fi

# 5. Success!
echo ""
echo "✅ Migration Integrity Verified!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   No drift detected from locked baseline"
echo "   Checksum: ${EXPECTED:0:32}..."
echo ""

# 6. Display lock metadata
LOCKED_AT=$(jq -r '.locked_at' reality/truth-seed-manifest-lock.json)
LOCKED_BY=$(jq -r '.locked_by_session' reality/truth-seed-manifest-lock.json)
MIGRATION_SESSION=$(jq -r '.migration_session' reality/truth-seed-manifest-lock.json)
TOTAL_BATCHES=$(jq -r '.total_batches_applied' reality/truth-seed-manifest-lock.json)

echo "📊 Lock Metadata:"
echo "   Locked at: $LOCKED_AT"
echo "   Locked by: Session $LOCKED_BY"
echo "   Migration: Session $MIGRATION_SESSION"
echo "   Batches:   $TOTAL_BATCHES applied"
echo ""
echo "🔐 Database structure matches immutable baseline"