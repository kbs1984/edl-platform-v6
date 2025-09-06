#!/usr/bin/env python3
"""
---
session: "00039"
type: "script"
status: "unknown"
created: "2025-08-28"
title: "00039-save-snapshot.py"
purpose: "Script for save snapshot"
language: "python"
category: "utility"
topics: ["utility"]
priority: "P2"
domain: "core"
---
"""
"""
00039-save-snapshot.py - Save snapshot data directly
Session 38: Quick save for known snapshot data
"""

import json
from datetime import datetime
from pathlib import Path

SNAPSHOT_DIR = Path("supabase/schema-snapshot")
SNAPSHOT_DIR.mkdir(parents=True, exist_ok=True)

# The actual data from your Supabase queries
snapshot_data = {
    "metadata": {
        "timestamp": datetime.now().isoformat(),
        "session": "00038",
        "purpose": "Schema visibility for debugging RLS and constraints",
        "method": "Manual capture from Supabase Dashboard with Desktop assistance"
    },
    "snapshot": {
        "policies": {
            # Empty for now - the query returned null which means no policies exist yet
            # This is actually valuable information!
        },
        "tables": {
            # We'll need to run query 2 to get this
        },
        "constraints": {
            # We'll need to run query 3 to get this
        },
        "indexes": {
            # We'll need to run query 4 to get this
        },
        "row_counts": {
            # We'll need to run query 5 to get this
        },
        "rls_status": {
            "rls_enabled": [
                {
                    "tablename": "profiles",
                    "rowsecurity": True,
                    "forcerowsecurity": False
                },
                {
                    "tablename": "team_join_requests",
                    "rowsecurity": True,
                    "forcerowsecurity": False
                },
                {
                    "tablename": "team_members",
                    "rowsecurity": True,
                    "forcerowsecurity": False
                },
                {
                    "tablename": "teams",
                    "rowsecurity": True,
                    "forcerowsecurity": False
                },
                {
                    "tablename": "users",
                    "rowsecurity": True,
                    "forcerowsecurity": False
                }
            ]
        }
    }
}

# Save the files
def save_json(data, filename):
    filepath = SNAPSHOT_DIR / filename
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2)
    print(f"✅ Saved: {filepath}")

# Save individual files
save_json(snapshot_data["metadata"], "snapshot-metadata.json")
save_json(snapshot_data["snapshot"].get("policies", {}), "policies.json")
save_json(snapshot_data["snapshot"].get("tables", {}), "tables.json")
save_json(snapshot_data["snapshot"].get("constraints", {}), "constraints.json")
save_json(snapshot_data["snapshot"].get("indexes", {}), "indexes.json")
save_json(snapshot_data["snapshot"].get("row_counts", {}), "row-counts.json")
save_json(snapshot_data["snapshot"].get("rls_status", {}), "rls-status.json")
save_json(snapshot_data, "complete-snapshot.json")

print("\n" + "=" * 60)
print("CRITICAL FINDING: NO RLS POLICIES EXIST!")
print("=" * 60)
print()
print("The snapshot reveals that while RLS is ENABLED on all tables,")
print("there are NO POLICIES defined. This means:")
print()
print("❌ Tables have RLS enabled but no policies")
print("❌ This blocks ALL operations (even SELECT)")
print("❌ No one can read or write any data")
print()
print("This explains why authentication might be failing!")
print()
print("To fix, you need to create policies in Supabase Dashboard.")
print("Example for profiles table:")
print()
print("CREATE POLICY \"Enable read access for all users\" ON profiles")
print("FOR SELECT USING (true);")
print()
print("CREATE POLICY \"Enable insert for authenticated users only\" ON profiles")
print("FOR INSERT WITH CHECK (auth.uid() = user_id);")
print()
print("Run: python3 scripts/00039-check-schema.py --summary")
print("to verify the snapshot was saved.")