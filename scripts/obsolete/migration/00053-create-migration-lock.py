#!/usr/bin/env python3
"""
00053-create-migration-lock.py - Create the immutable migration checkpoint
Session 53: Lock the completed migration as our baseline truth
"""

import json
import hashlib
from datetime import datetime
from pathlib import Path

# Load the migration manifest to get current state
MANIFEST_PATH = Path("migrations/batches/migration-manifest.json")
LOCK_PATH = Path("reality/truth-seed-manifest-lock.json")

def load_migration_manifest():
    """Load the current migration manifest"""
    with open(MANIFEST_PATH, 'r') as f:
        return json.load(f)

def generate_database_checksum(manifest):
    """
    Generate a deterministic checksum of the database state.
    This uses the manifest data to create a reproducible hash.
    """
    # Extract key components in sorted order for determinism
    checkpoint_data = {
        "constraints": {
            "foreign_keys": manifest["database_state"]["foreign_keys"],
            "primary_keys": manifest["database_state"]["primary_keys"],
            "unique_constraints": manifest["database_state"]["unique_constraints"]
        },
        "extensions": sorted(manifest["database_state"]["extensions"]),
        "functions_count": manifest["database_state"]["functions_count"],
        "indexes_count": manifest["database_state"]["indexes_count"],
        "rls_policies": manifest["database_state"]["rls_policies"],
        "schemas": sorted(manifest["database_state"]["schemas"]),
        "tables_count": manifest["database_state"]["tables_count"],
        "triggers_count": manifest["database_state"]["triggers_count"],
        "types_count": manifest["database_state"]["types_count"]
    }
    
    # Create deterministic JSON string
    json_str = json.dumps(checkpoint_data, sort_keys=True, indent=2)
    
    # Generate SHA256 hash
    return hashlib.sha256(json_str.encode()).hexdigest()

def create_migration_lock():
    """Create the migration lock file"""
    
    print("🔒 Creating Migration Lock File")
    print("=" * 60)
    
    # Load current manifest
    manifest = load_migration_manifest()
    
    # Verify migration is complete
    if manifest.get("migration_status") != "COMPLETE":
        print("❌ ERROR: Migration is not complete!")
        print(f"   Current status: {manifest.get('migration_status', 'UNKNOWN')}")
        print(f"   Batches completed: {manifest['current_batch']}/{manifest['total_batches']}")
        return False
    
    # Generate checksum
    checksum = generate_database_checksum(manifest)
    print(f"✅ Generated checksum: {checksum[:16]}...")
    
    # Define immutable objects
    immutable_objects = {
        "tables": [
            "public.student", "public.guardian", "public.judge", "public.admin",
            "public.team", "public.guild", "public.team_member", "public.guild_member",
            "public.invitation", "public.friendship", "public.school", "public.profile",
            "chat.message", "chat.participant", "chat.room",
            "debate.debates", "debate.ballots", "debate.motions", "debate.participants",
            # ... (all 36 tables)
        ],
        "trigger_functions": [
            "public.handle_new_user",
            "public.update_updated_at_column",
            # ... (16 trigger functions from manifest)
        ],
        "business_functions": [
            "public.add_new_user",
            "public.search_school",
            "chat.create_room",
            # ... (key business logic functions)
        ],
        "types": manifest["batches"]["02"]["verification"]["types_created"],
        "foreign_keys": 52
    }
    
    # Define modifiable objects
    modifiable_with_tracking = {
        "rls_policies": "Can be refined for security",
        "indexes": "Can add more for performance",
        "new_functions": "Additions allowed with review",
        "new_columns": "Can extend tables with compatibility",
        "call_sign": "EDL addition, can be enhanced"
    }
    
    # Create lock file
    lock_data = {
        "version": "1.0.0",
        "locked_at": datetime.now().isoformat(),
        "locked_by_session": "00053",
        "migration_completed": manifest["batches"]["09"]["executed_at"],
        "migration_session": manifest["migration_session"],
        "total_batches_applied": manifest["total_batches"],
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
        "database_state": manifest["database_state"],
        "database_checksum": checksum,
        "checksum_algorithm": "sha256",
        "immutable_objects": immutable_objects,
        "modifiable_with_tracking": modifiable_with_tracking,
        "override_requires": "constitutional_amendment",
        "verification_script": "scripts/00053-verify-migration-integrity.sh",
        "notes": [
            "This lock file represents the immutable baseline for the EDL platform database",
            "Any drift from this baseline will be detected by Reality Agents",
            "Modifications to immutable objects require constitutional amendment",
            "Modifiable objects can evolve but must be tracked in Reality manifest"
        ]
    }
    
    # Ensure reality directory exists
    LOCK_PATH.parent.mkdir(parents=True, exist_ok=True)
    
    # Write lock file
    with open(LOCK_PATH, 'w') as f:
        json.dump(lock_data, f, indent=2)
    
    print(f"✅ Lock file created: {LOCK_PATH}")
    print()
    print("📊 Migration Summary:")
    print(f"   Tables: {manifest['database_state']['tables_count']}")
    print(f"   Functions: {manifest['database_state']['functions_count']}")
    print(f"   Triggers: {manifest['database_state']['triggers_count']}")
    print(f"   RLS Policies: {manifest['database_state']['rls_policies']}")
    print(f"   Checksum: {checksum[:32]}...")
    print()
    print("🔐 The migration is now LOCKED")
    print("   Future changes must be tracked through Reality Agents")
    
    return True

if __name__ == "__main__":
    success = create_migration_lock()
    if success:
        print("\n✨ Migration checkpoint created successfully!")
        print("   Run ./scripts/00053-verify-migration-integrity.sh to test")
    else:
        print("\n❌ Failed to create migration lock")
        exit(1)