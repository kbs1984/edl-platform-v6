#!/usr/bin/env python3
"""
Session 00077 - Claude Code Capability Manifest
==============================================
Created: 2025-08-26 12:40 PM
Purpose: Document TESTED capabilities to prevent Capability Amnesia

This manifest documents what Claude Code CAN and CANNOT do based on
actual testing, not assumptions. Sessions should check this BEFORE
declaring manual action is needed.
"""

import json
from datetime import datetime
from typing import Dict, Any

# TESTED on 2025-08-26 by Session 00077
CAPABILITY_MANIFEST = {
    "script_execution": {
        "status": "YES",
        "tested": "2025-08-26 12:37",
        "evidence": "./scripts/00076-auth-implementation.sh executes",
        "notes": "Scripts run but may encounter dependency issues"
    },
    
    "npm_available": {
        "status": "YES", 
        "tested": "2025-08-26 12:38",
        "evidence": "npm version 10.8.2 available at /usr/bin/npm",
        "notes": "npm install may fail on dependency conflicts"
    },
    
    "node_available": {
        "status": "YES",
        "tested": "2025-08-26 12:38", 
        "evidence": "node v18.20.6 available",
        "notes": "Node.js scripts can run"
    },
    
    "git_operations": {
        "status": "YES",
        "tested": "2025-08-26 12:39",
        "evidence": "git status, remote, push --dry-run all work",
        "notes": "Can stage, commit, and push (need upstream set)"
    },
    
    "vercel_cli": {
        "status": "YES",
        "tested": "2025-08-26 12:40",
        "evidence": "Vercel CLI 44.7.3 installed at ~/.npm-global/bin/vercel",
        "notes": "Vercel commands available but auth needed for deploy"
    },
    
    "file_creation": {
        "status": "YES",
        "tested": "2025-08-26 12:39",
        "evidence": "Can create/modify files in truth-seed directories",
        "notes": "Middleware files already created by Session 76"
    },
    
    "python_scripts": {
        "status": "YES",
        "tested": "Continuously",
        "evidence": "All Reality Agents run via Python",
        "notes": "Full Python 3 environment available"
    },
    
    "supabase_read": {
        "status": "YES",
        "tested": "Continuously",
        "evidence": "Reality Agents query Supabase successfully",
        "notes": "Read-only access with anon key"
    },
    
    "supabase_write": {
        "status": "NO",
        "tested": "Previous sessions",
        "evidence": "RLS blocks writes with anon key",
        "notes": "This is correct security behavior"
    },
    
    "browser_testing": {
        "status": "NO",
        "tested": "Known limitation",
        "evidence": "No browser automation available",
        "notes": "Manual testing required for UI flows"
    },
    
    "npm_run_dev": {
        "status": "PARTIAL",
        "tested": "2025-08-26 12:37",
        "evidence": "Command runs but dependency conflicts may block",
        "notes": "May need --force or --legacy-peer-deps flags"
    },
    
    "github_agent": {
        "status": "YES",
        "tested": "Reality Agent runs",
        "evidence": "GitHub Agent operational per session startup",
        "notes": "Can query repos, commits, PRs"
    },
    
    "middleware_deployment": {
        "status": "ALREADY_DONE",
        "tested": "2025-08-26 12:39",
        "evidence": "Both middleware.ts files exist in truth-seed apps",
        "notes": "Session 76's work was already executed"
    }
}

def print_manifest():
    """Print human-readable capability manifest"""
    print("=" * 60)
    print("CLAUDE CODE CAPABILITY MANIFEST")
    print(f"Last Updated: {datetime.now().isoformat()}")
    print("=" * 60)
    print()
    
    # Group by status
    can_do = []
    cannot_do = []
    partial = []
    
    for capability, details in CAPABILITY_MANIFEST.items():
        status = details["status"]
        if status == "YES" or status == "ALREADY_DONE":
            can_do.append((capability, details))
        elif status == "NO":
            cannot_do.append((capability, details))
        else:
            partial.append((capability, details))
    
    print("✅ WHAT WE CAN DO:")
    print("-" * 40)
    for cap, details in can_do:
        print(f"• {cap}: {details['evidence']}")
    
    print()
    print("⚠️ PARTIAL CAPABILITIES:")
    print("-" * 40)
    for cap, details in partial:
        print(f"• {cap}: {details['notes']}")
    
    print()
    print("❌ WHAT WE CANNOT DO:")
    print("-" * 40)
    for cap, details in cannot_do:
        print(f"• {cap}: {details['notes']}")
    
    print()
    print("📋 KEY INSIGHT:")
    print("-" * 40)
    print("Sessions should ALWAYS test capabilities before declaring")
    print("manual action is needed. Most operations CAN be attempted!")
    print()
    print("Example workflow:")
    print("1. TRY: npm run dev")
    print("2. IF FAILS: Document specific error")
    print("3. ONLY THEN: Recommend manual action with explanation")

def check_capability(capability: str) -> Dict[str, Any]:
    """Check if a specific capability is available"""
    if capability in CAPABILITY_MANIFEST:
        return CAPABILITY_MANIFEST[capability]
    return {
        "status": "UNKNOWN",
        "notes": "Not tested - try it first before assuming!"
    }

if __name__ == "__main__":
    print_manifest()
    
    # Save as JSON for programmatic access
    with open("scripts/00077-capability-manifest.json", "w") as f:
        json.dump({
            "generated": datetime.now().isoformat(),
            "session": "00077",
            "capabilities": CAPABILITY_MANIFEST
        }, f, indent=2)
    
    print("\n✅ Manifest saved to scripts/00077-capability-manifest.json")