#!/usr/bin/env python3

"""
Canvas Requirements Population Script
Session 142: Populates progress matrix with all Canvas requirements
"""

import json
import subprocess

def get_canvas_requirements():
    """Load Canvas requirements from mapper script"""
    
    # Run the mapper to get the data
    result = subprocess.run(['node', 'scripts/00142-canvas-requirements-mapper.js'], 
                          capture_output=True, text=True)
    
    # Parse the output to extract the data
    # For now, we'll hardcode it to ensure accuracy
    return {
        "001-1": {
            "name": "Onboarding & Directory",
            "features": [
                {"feature_name": "Student Onboarding Flow", "user_story": "US-001", "priority": "P0", "category": "onboarding"},
                {"feature_name": "Guardian Onboarding Flow", "user_story": "US-002", "priority": "P0", "category": "onboarding"},
                {"feature_name": "School Directory Search", "user_story": "US-003", "priority": "P1", "category": "directory"},
                {"feature_name": "Profile Creation Wizard", "user_story": "US-004", "priority": "P0", "category": "onboarding"}
            ]
        },
        "001-2": {
            "name": "Communication, Messages and Invitations",
            "features": [
                {"feature_name": "Friend Request System", "user_story": "US-050", "priority": "P0", "category": "communication"},
                {"feature_name": "Team Chat Interface", "user_story": "US-051", "priority": "P1", "category": "communication"},
                {"feature_name": "Direct Messaging", "user_story": "US-052", "priority": "P1", "category": "communication"},
                {"feature_name": "Guild Invitations", "user_story": "US-053", "priority": "P1", "category": "communication"}
            ]
        },
        "001-3": {
            "name": "Contact Us Box",
            "features": [
                {"feature_name": "Contact Form", "user_story": "US-200", "priority": "P2", "category": "support"},
                {"feature_name": "Support Ticket System", "user_story": "US-201", "priority": "P2", "category": "support"}
            ]
        },
        "001-4": {
            "name": "Activity & Registrar Box",
            "features": [
                {"feature_name": "Activity Runtime Engine", "user_story": "US-155", "priority": "P0", "category": "activities"},
                {"feature_name": "Activity Registration", "user_story": "US-170", "priority": "P1", "category": "activities"},
                {"feature_name": "Activity Discovery", "user_story": "US-171", "priority": "P1", "category": "activities"}
            ]
        },
        "001-5": {
            "name": "Activity Instance",
            "features": [
                {"feature_name": "Activity Session Tracking", "user_story": "US-156", "priority": "P0", "category": "activities"},
                {"feature_name": "Progress Persistence", "user_story": "US-157", "priority": "P0", "category": "activities"},
                {"feature_name": "Assignment Submission", "user_story": "US-158", "priority": "P0", "category": "activities"},
                {"feature_name": "Activity Auto-Save", "user_story": "US-159", "priority": "P0", "category": "activities"}
            ]
        },
        "002-1": {
            "name": "PlayerID Profile Box",
            "features": [
                {"feature_name": "Player Profile Display", "user_story": "US-080", "priority": "P0", "category": "profile"},
                {"feature_name": "Profile Customization", "user_story": "US-081", "priority": "P1", "category": "profile"},
                {"feature_name": "Achievement Display", "user_story": "US-082", "priority": "P1", "category": "profile"}
            ]
        },
        "002-2": {
            "name": "Associated Teams Box",
            "features": [
                {"feature_name": "Team Creation", "user_story": "US-100", "priority": "P0", "category": "teams"},
                {"feature_name": "Team Management", "user_story": "US-101", "priority": "P0", "category": "teams"},
                {"feature_name": "Team Member Roles", "user_story": "US-102", "priority": "P1", "category": "teams"},
                {"feature_name": "Team Activity Tracking", "user_story": "US-103", "priority": "P1", "category": "teams"}
            ]
        },
        "002-3": {
            "name": "Badges Box",
            "features": [
                {"feature_name": "Badge System Core", "user_story": "US-120", "priority": "P1", "category": "gamification"},
                {"feature_name": "Badge Achievement Engine", "user_story": "US-121", "priority": "P1", "category": "gamification"},
                {"feature_name": "Badge Display Gallery", "user_story": "US-122", "priority": "P1", "category": "gamification"}
            ]
        },
        "002-4": {
            "name": "HoG Box (Hall of Greats)",
            "features": [
                {"feature_name": "Hall of Greats Leaderboard", "user_story": "US-130", "priority": "P2", "category": "gamification"},
                {"feature_name": "Historical Achievements", "user_story": "US-131", "priority": "P2", "category": "gamification"}
            ]
        },
        "002-5": {
            "name": "Resources Box",
            "features": [
                {"feature_name": "Resource Library", "user_story": "US-140", "priority": "P2", "category": "resources"},
                {"feature_name": "Resource Upload System", "user_story": "US-141", "priority": "P2", "category": "resources"},
                {"feature_name": "Resource Categorization", "user_story": "US-142", "priority": "P2", "category": "resources"}
            ]
        },
        "003-2": {
            "name": "emCoin Transactions Box",
            "features": [
                {"feature_name": "EmCoin Backend Foundation", "user_story": "US-180", "priority": "P1", "category": "emcoin"},
                {"feature_name": "EmCoin Transaction Engine", "user_story": "US-181", "priority": "P1", "category": "emcoin"},
                {"feature_name": "EmCoin Balance Display", "user_story": "US-182", "priority": "P1", "category": "emcoin"},
                {"feature_name": "EmCoin Reward System", "user_story": "US-183", "priority": "P1", "category": "emcoin"}
            ]
        }
    }

def populate_canvas_requirements():
    """Populate progress matrix with all Canvas requirements"""
    
    canvas_data = get_canvas_requirements()
    
    print("Populating Canvas Requirements into Progress Matrix")
    print("=" * 50)
    
    total_inserted = 0
    
    for canvas_id, canvas_info in canvas_data.items():
        print(f"\nProcessing {canvas_id}: {canvas_info['name']}")
        
        for feature in canvas_info['features']:
            # Build the INSERT query
            query = f"""
                INSERT INTO platform_progress_matrix (
                    canvas_id,
                    feature_name,
                    user_story,
                    priority,
                    feature_category,
                    status,
                    notes
                ) VALUES (
                    '{canvas_id}',
                    '{feature['feature_name']}',
                    '{feature.get('user_story', '')}',
                    '{feature['priority']}',
                    '{feature.get('category', 'general')}',
                    'not_started',
                    'Auto-populated from Canvas requirements - Session 142'
                ) ON CONFLICT (feature_name) DO NOTHING
                RETURNING id;
            """
            
            # Since we can't directly call MCP from Python, we'll print the SQL
            # and use it via MCP in the next step
            print(f"  ✓ {feature['feature_name']} ({feature['priority']})")
            total_inserted += 1
    
    print(f"\n{'=' * 50}")
    print(f"Total features to insert: {total_inserted}")
    
    # Generate a single combined query for MCP
    combined_query = "-- Populating all Canvas requirements\n"
    
    for canvas_id, canvas_info in canvas_data.items():
        for feature in canvas_info['features']:
            combined_query += f"""
INSERT INTO platform_progress_matrix (
    canvas_id, feature_name, user_story, priority, feature_category, status, notes
) VALUES (
    '{canvas_id}',
    '{feature['feature_name'].replace("'", "''")}',
    '{feature.get('user_story', '')}',
    '{feature['priority']}',
    '{feature.get('category', 'general')}',
    'not_started',
    'Auto-populated from Canvas requirements - Session 142'
) ON CONFLICT (feature_name) DO NOTHING;
"""
    
    # Save the combined query for execution
    with open('/tmp/populate_canvas_requirements.sql', 'w') as f:
        f.write(combined_query)
    
    print("\nSQL saved to /tmp/populate_canvas_requirements.sql")
    print("Execute via MCP to populate the database")

if __name__ == "__main__":
    populate_canvas_requirements()