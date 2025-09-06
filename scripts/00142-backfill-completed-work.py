#!/usr/bin/env python3

"""
Backfill Completed Work Script
Session 142: Updates progress matrix with work already completed
Based on evidence from Sessions 135 and 137
"""

import json

# Based on actual evidence from reconciliation reports
COMPLETED_WORK = [
    {
        "session": "135",
        "features": [
            {
                "name": "Guardian Onboarding Flow",
                "status": "implemented",  # Has empty insert bug per Session 141 blueprint
                "tables": ["guardian", "guardian_request"],
                "components": ["GuardianForm.tsx", "guardian-actions.ts"],
                "issues": [{"type": "empty_insert", "line": 17, "severity": "blocking", "description": "Empty insert bug in guardian form"}],
                "health": 85.0,
                "notes": "Implemented with bug - empty guardian insert issue"
            },
            {
                "name": "Friend Request System",
                "status": "implemented",  # Missing real-time per Session 141 blueprint
                "tables": ["friendship"],
                "components": ["FriendSidebar.tsx", "friend-request-dialog.tsx", "use-friends.ts"],
                "issues": [{"type": "no_realtime", "severity": "minor", "description": "Missing real-time updates"}],
                "health": 92.0,
                "notes": "Implemented without real-time subscription"
            }
        ]
    },
    {
        "session": "137",
        "features": [
            {
                "name": "Activity Runtime Engine",
                "status": "validated",  # Batch 1 complete
                "tables": ["activity", "activity_session", "activity_instance", "session_progress"],
                "components": ["activities/page.tsx", "[instance_id]/page.tsx"],
                "health": 97.0,
                "notes": "Activity Runtime Batch 1 (US-155-159) complete and validated"
            },
            {
                "name": "Activity Session Tracking",
                "status": "validated",
                "tables": ["activity_session", "session_progress"],
                "components": ["[instance_id]/page.tsx"],
                "health": 97.0,
                "notes": "Part of Activity Runtime Batch 1"
            },
            {
                "name": "Progress Persistence",
                "status": "validated",
                "tables": ["session_progress"],
                "components": ["[instance_id]/page.tsx"],
                "health": 97.0,
                "notes": "Part of Activity Runtime Batch 1"
            },
            {
                "name": "Assignment Submission",
                "status": "validated",
                "tables": ["activity_assignment", "assignment_submission"],
                "components": ["[instance_id]/page.tsx"],
                "health": 97.0,
                "notes": "Part of Activity Runtime Batch 1"
            },
            {
                "name": "Activity Auto-Save",
                "status": "validated",
                "tables": ["session_progress"],
                "components": ["[instance_id]/page.tsx"],
                "health": 97.0,
                "notes": "Part of Activity Runtime Batch 1 - auto-save implemented"
            }
        ]
    }
]

def generate_backfill_sql():
    """Generate SQL to update progress matrix with completed work"""
    
    print("Generating Backfill SQL for Completed Work")
    print("=" * 50)
    
    sql_statements = []
    
    for session_work in COMPLETED_WORK:
        session_id = session_work["session"]
        print(f"\nSession {session_id}:")
        
        for feature in session_work["features"]:
            print(f"  - {feature['name']} ({feature['status']})")
            
            # Build the UPDATE statement
            sql = f"""
UPDATE platform_progress_matrix
SET 
    status = '{feature["status"]}',
    database_tables = '{json.dumps(feature.get("tables", []))}' ::jsonb,
    ui_components = '{json.dumps(feature.get("components", []))}' ::jsonb,
    known_issues = '{json.dumps(feature.get("issues", []))}' ::jsonb,
    reality_health = {feature.get("health", 0)},
    implemented_by = ARRAY['{session_id}'],
    last_validated = NOW(),
    validation_notes = '{feature.get("notes", "")}',
    ninety_five_syndrome = {str(feature.get("health", 0) >= 95 and feature.get("health", 0) < 100).lower()}
WHERE feature_name = '{feature["name"]}';"""
            
            sql_statements.append(sql)
    
    # Combine all statements
    combined_sql = "-- Backfilling completed work from Sessions 135 and 137\n"
    combined_sql += "\n".join(sql_statements)
    
    # Save for execution
    with open('/tmp/backfill_completed_work.sql', 'w') as f:
        f.write(combined_sql)
    
    print(f"\n{'=' * 50}")
    print(f"Total features to update: {len(sql_statements)}")
    print("SQL saved to /tmp/backfill_completed_work.sql")
    
    return combined_sql

if __name__ == "__main__":
    sql = generate_backfill_sql()
    print("\nExecute via MCP to update the database")