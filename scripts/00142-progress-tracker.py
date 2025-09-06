#!/usr/bin/env python3

"""
Progress Tracker Utility
Session 142: Automatically tracks progress during workflow phases
Integrates with DEFINITIVE BUILD WORKFLOW from Session 141
"""

import json
import os
import sys

class ProgressTracker:
    """Automatically tracks progress during workflow phases"""
    
    def __init__(self, session_id):
        self.session_id = str(session_id)
        print(f"📊 Progress Tracker initialized for Session {self.session_id}")
    
    def start_feature(self, feature_name):
        """Called at Phase 5 (BUILD) start"""
        
        query = f"""
            UPDATE platform_progress_matrix
            SET 
                status = 'in_progress',
                modified_by = array_append(COALESCE(modified_by, ARRAY[]::text[]), '{self.session_id}')
            WHERE feature_name = '{feature_name}'
            RETURNING id, canvas_id, priority;
        """
        
        print(f"📊 Progress: {feature_name} now IN PROGRESS")
        print(f"   SQL: {query}")
        return {"status": "in_progress", "feature": feature_name}
    
    def track_implementation(self, feature_name, tables=None, components=None, endpoints=None):
        """Called during Phase 5 (BUILD) as items are created"""
        
        updates = []
        
        if tables:
            tables_json = json.dumps(tables).replace("'", "''")
            updates.append(f"database_tables = database_tables || '{tables_json}'::jsonb")
        
        if components:
            components_json = json.dumps(components).replace("'", "''")
            updates.append(f"ui_components = ui_components || '{components_json}'::jsonb")
        
        if endpoints:
            endpoints_json = json.dumps(endpoints).replace("'", "''")
            updates.append(f"api_endpoints = api_endpoints || '{endpoints_json}'::jsonb")
        
        if updates:
            query = f"""
                UPDATE platform_progress_matrix
                SET {', '.join(updates)}
                WHERE feature_name = '{feature_name}';
            """
            print(f"📊 Progress: Updated {feature_name} implementation details")
            print(f"   - Tables: {tables}")
            print(f"   - Components: {components}")
            print(f"   - Endpoints: {endpoints}")
    
    def validate_feature(self, feature_name, health_score, validation_notes=""):
        """Called at Phase 6 (VALIDATE)"""
        
        status = 'validated' if health_score >= 95 else 'implemented'
        has_syndrome = health_score >= 95 and health_score < 100
        
        query = f"""
            UPDATE platform_progress_matrix
            SET 
                status = '{status}',
                reality_health = {health_score},
                ninety_five_syndrome = {str(has_syndrome).lower()},
                validation_notes = '{validation_notes}',
                last_validated = NOW()
            WHERE feature_name = '{feature_name}';
        """
        
        print(f"📊 Progress: {feature_name} validated at {health_score}% health")
        
        if has_syndrome:
            print(f"   ⚠️  95% Syndrome detected - feature is near perfect but not 100%")
    
    def complete_feature(self, feature_name, pr_number=None, documentation=None):
        """Called at Phase 7-8 (PR & CLOSE)"""
        
        updates = []
        
        if pr_number:
            updates.append(f"pr_numbers = array_append(COALESCE(pr_numbers, ARRAY[]::text[]), '{pr_number}')")
        
        if documentation:
            doc_path = documentation.replace("'", "''")
            updates.append(f"documentation = array_append(COALESCE(documentation, ARRAY[]::text[]), '{doc_path}')")
        
        if updates:
            query = f"""
                UPDATE platform_progress_matrix
                SET {', '.join(updates)}
                WHERE feature_name = '{feature_name}';
            """
            print(f"📊 Progress: {feature_name} COMPLETE")
            
            if pr_number:
                print(f"   - PR: #{pr_number}")
            if documentation:
                print(f"   - Docs: {documentation}")
    
    def get_next_priority(self):
        """Get the next priority feature to work on"""
        
        query = """
            SELECT feature_name, canvas_id, priority, feature_category
            FROM platform_progress_matrix
            WHERE status = 'not_started'
            ORDER BY 
                CASE priority 
                    WHEN 'P0' THEN 1 
                    WHEN 'P1' THEN 2 
                    WHEN 'P2' THEN 3 
                END,
                created_at
            LIMIT 1;
        """
        
        print("📊 Getting next priority feature...")
        print(f"   SQL: {query}")
        return {"query": query}
    
    def get_progress_summary(self):
        """Get overall progress summary"""
        
        query = """
            SELECT 
                priority,
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE status = 'not_started') as not_started,
                COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress,
                COUNT(*) FILTER (WHERE status = 'implemented') as implemented,
                COUNT(*) FILTER (WHERE status = 'validated') as validated
            FROM platform_progress_matrix
            GROUP BY priority
            ORDER BY priority;
        """
        
        print("📊 Progress Summary:")
        print(f"   SQL: {query}")
        return {"query": query}


# CLI Usage
if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 00142-progress-tracker.py <session_id> <command> [args...]")
        print("Commands:")
        print("  start <feature_name>")
        print("  track <feature_name> --tables table1,table2 --components comp1,comp2")
        print("  validate <feature_name> <health_score> [notes]")
        print("  complete <feature_name> --pr PR123 --doc path/to/doc.md")
        print("  next")
        print("  summary")
        sys.exit(1)
    
    session_id = sys.argv[1]
    command = sys.argv[2]
    
    tracker = ProgressTracker(session_id)
    
    if command == "start" and len(sys.argv) > 3:
        tracker.start_feature(sys.argv[3])
    
    elif command == "track" and len(sys.argv) > 3:
        feature_name = sys.argv[3]
        tables = None
        components = None
        endpoints = None
        
        # Parse optional arguments
        for i in range(4, len(sys.argv)):
            if sys.argv[i] == "--tables" and i+1 < len(sys.argv):
                tables = sys.argv[i+1].split(',')
            elif sys.argv[i] == "--components" and i+1 < len(sys.argv):
                components = sys.argv[i+1].split(',')
            elif sys.argv[i] == "--endpoints" and i+1 < len(sys.argv):
                endpoints = sys.argv[i+1].split(',')
        
        tracker.track_implementation(feature_name, tables, components, endpoints)
    
    elif command == "validate" and len(sys.argv) > 4:
        feature_name = sys.argv[3]
        health_score = float(sys.argv[4])
        notes = sys.argv[5] if len(sys.argv) > 5 else ""
        tracker.validate_feature(feature_name, health_score, notes)
    
    elif command == "complete" and len(sys.argv) > 3:
        feature_name = sys.argv[3]
        pr_number = None
        documentation = None
        
        # Parse optional arguments
        for i in range(4, len(sys.argv)):
            if sys.argv[i] == "--pr" and i+1 < len(sys.argv):
                pr_number = sys.argv[i+1]
            elif sys.argv[i] == "--doc" and i+1 < len(sys.argv):
                documentation = sys.argv[i+1]
        
        tracker.complete_feature(feature_name, pr_number, documentation)
    
    elif command == "next":
        tracker.get_next_priority()
    
    elif command == "summary":
        tracker.get_progress_summary()
    
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)