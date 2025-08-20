#!/usr/bin/env python3
"""
00039-parse-snapshot.py - Parse Supabase schema query results
Session 38: Creating schema snapshot from Dashboard results

Usage:
1. Run 00039-generate-snapshot-sql.py to get SQL
2. Execute SQL in Supabase Dashboard
3. Run this script
4. Paste results when prompted
"""

import json
import os
import sys
from datetime import datetime
from pathlib import Path

SNAPSHOT_DIR = Path("supabase/schema-snapshot")

def ensure_snapshot_dir():
    """Ensure snapshot directory exists"""
    SNAPSHOT_DIR.mkdir(parents=True, exist_ok=True)

def parse_json_result(raw_input, name):
    """Parse a single JSON result from Supabase"""
    try:
        # Try to parse as JSON directly
        if raw_input.strip().startswith('{'):
            return json.loads(raw_input)
        
        # Sometimes results have extra formatting
        # Look for JSON object in the input
        import re
        json_match = re.search(r'\{.*\}', raw_input, re.DOTALL)
        if json_match:
            return json.loads(json_match.group())
        
        print(f"Warning: Could not parse {name}, saving raw")
        return {"raw": raw_input}
    except json.JSONDecodeError as e:
        print(f"Warning: JSON decode error for {name}: {e}")
        return {"raw": raw_input, "error": str(e)}

def save_snapshot_file(data, filename):
    """Save data to snapshot file"""
    filepath = SNAPSHOT_DIR / filename
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2, default=str)
    print(f"✅ Saved: {filepath}")

def create_metadata():
    """Create metadata file for snapshot"""
    metadata = {
        "timestamp": datetime.now().isoformat(),
        "session": "00038",
        "purpose": "Schema visibility for debugging RLS and constraints",
        "method": "Manual capture from Supabase Dashboard",
        "files": [
            "policies.json",
            "tables.json", 
            "constraints.json",
            "indexes.json",
            "row-counts.json",
            "rls-status.json"
        ]
    }
    save_snapshot_file(metadata, "snapshot-metadata.json")

def process_policies(data):
    """Process and organize policies by table"""
    if 'policies' not in data:
        return {}
    
    policies_by_table = {}
    for policy in data['policies'] or []:
        table = policy.get('tablename', 'unknown')
        if table not in policies_by_table:
            policies_by_table[table] = []
        policies_by_table[table].append(policy)
    
    return policies_by_table

def process_tables(data):
    """Process and organize table structure"""
    if 'tables' not in data:
        return {}
    
    tables_by_name = {}
    for col in data['tables'] or []:
        table = col.get('table_name', 'unknown')
        if table not in tables_by_name:
            tables_by_name[table] = []
        tables_by_name[table].append(col)
    
    return tables_by_name

def main():
    """Main parser workflow"""
    print("=" * 80)
    print("SUPABASE SCHEMA SNAPSHOT PARSER")
    print("Session 38 - Creating visibility into actual database state")
    print("=" * 80)
    print()
    
    ensure_snapshot_dir()
    
    print("Instructions:")
    print("1. Paste each JSON result when prompted")
    print("2. Press Enter twice when done with each result")
    print("3. Type 'DONE' when all results are pasted")
    print()
    
    results = {}
    result_types = [
        ("policies", "RLS Policies JSON"),
        ("tables", "Tables Structure JSON"),
        ("constraints", "Constraints JSON"),
        ("indexes", "Indexes JSON"),
        ("row_counts", "Row Counts JSON"),
        ("rls_status", "RLS Status JSON")
    ]
    
    for key, prompt in result_types:
        print(f"\n📋 Paste {prompt} (or 'SKIP' to skip):")
        print("(Press Enter twice when done)")
        
        lines = []
        empty_count = 0
        
        while True:
            try:
                line = input()
                if line.upper() == 'SKIP':
                    print(f"⏭️  Skipping {key}")
                    results[key] = {}
                    break
                if line.upper() == 'DONE':
                    break
                if line == "":
                    empty_count += 1
                    if empty_count >= 2:
                        break
                else:
                    empty_count = 0
                    lines.append(line)
            except EOFError:
                break
        
        if lines and line.upper() != 'SKIP':
            raw_input = '\n'.join(lines)
            parsed = parse_json_result(raw_input, key)
            
            # Process specific types
            if key == "policies" and 'policies' in parsed:
                results[key] = process_policies(parsed)
            elif key == "tables" and 'tables' in parsed:
                results[key] = process_tables(parsed)
            else:
                results[key] = parsed
            
            print(f"✅ Parsed {key}")
    
    # Save all results
    print("\n" + "=" * 80)
    print("SAVING SNAPSHOT FILES")
    print("=" * 80)
    
    # Save individual files
    for key in results:
        if results[key]:
            save_snapshot_file(results[key], f"{key}.json")
    
    # Create metadata
    create_metadata()
    
    # Create combined snapshot for easy access
    combined = {
        "metadata": {
            "timestamp": datetime.now().isoformat(),
            "session": "00038"
        },
        "snapshot": results
    }
    save_snapshot_file(combined, "complete-snapshot.json")
    
    print("\n" + "=" * 80)
    print("SNAPSHOT COMPLETE!")
    print("=" * 80)
    print()
    print("Files created in: supabase/schema-snapshot/")
    print()
    print("Next steps:")
    print("1. Run: python3 scripts/00039-check-schema.py --help")
    print("2. Example: python3 scripts/00039-check-schema.py --table profiles --policies")
    print()
    print("Per 00031-WORKFLOW-BOUNDARIES.md:")
    print("- This snapshot provides READ-ONLY visibility")
    print("- To fix issues, use Supabase Dashboard")
    print("- After fixes, re-run snapshot to update")

if __name__ == "__main__":
    main()