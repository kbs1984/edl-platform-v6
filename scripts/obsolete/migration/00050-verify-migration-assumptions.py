#!/usr/bin/env python3
"""
Session 00050: Verify Desktop's migration SQL assumptions against truth-seed JSON files
"""

import json
import os
import re
from pathlib import Path
from collections import defaultdict
from typing import Dict, List, Set, Tuple

def extract_tables_from_json_files(json_dir: Path) -> Dict[str, Set[str]]:
    """Extract all tables and their columns from JSON migration files."""
    tables = defaultdict(set)
    
    for json_file in sorted(json_dir.glob("*.json")):
        print(f"Reading {json_file.name}...")
        try:
            with open(json_file, 'r') as f:
                content = f.read()
                
                # Try to find JSON array in the content
                json_start = content.find('[')
                json_end = content.rfind(']')
                
                if json_start != -1 and json_end != -1:
                    json_str = content[json_start:json_end+1]
                    try:
                        data = json.loads(json_str)
                        
                        for item in data:
                            # Handle different JSON structures
                            if 'table_name' in item and 'column_name' in item:
                                # Format from file 01.json
                                table = item['table_name']
                                column = item['column_name']
                                tables[table].add(column)
                            elif '?column?' in item:
                                # Format from file 02.json - parse CREATE TABLE statements
                                create_stmt = item['?column?']
                                if 'CREATE TABLE' in create_stmt:
                                    # Extract table name
                                    match = re.search(r'CREATE TABLE\s+(?:public\.)?(\w+)', create_stmt)
                                    if match:
                                        table = match.group(1)
                                        # Extract columns (simplified parsing)
                                        cols_match = re.search(r'\((.*?)\);?$', create_stmt, re.DOTALL)
                                        if cols_match:
                                            cols_str = cols_match.group(1)
                                            # Basic column extraction (not perfect but gives us an idea)
                                            for col_def in cols_str.split(','):
                                                col_match = re.match(r'\s*(\w+)\s+', col_def)
                                                if col_match:
                                                    tables[table].add(col_match.group(1))
                    except json.JSONDecodeError as e:
                        print(f"  Warning: Could not parse JSON in {json_file.name}: {e}")
        except Exception as e:
            print(f"  Error reading {json_file.name}: {e}")
    
    return dict(tables)

def extract_tables_from_sql(sql_file: Path) -> Dict[str, Set[str]]:
    """Extract tables and columns from Desktop's draft SQL file."""
    tables = defaultdict(set)
    
    with open(sql_file, 'r') as f:
        content = f.read()
    
    # Find all CREATE TABLE statements
    create_table_pattern = r'CREATE TABLE\s+(?:IF NOT EXISTS\s+)?(?:(\w+)\.)?(\w+)\s*\((.*?)\);'
    
    for match in re.finditer(create_table_pattern, content, re.DOTALL | re.IGNORECASE):
        schema = match.group(1) or 'public'
        table = match.group(2)
        columns_str = match.group(3)
        
        # Extract column names
        for line in columns_str.split('\n'):
            line = line.strip()
            if line and not line.startswith('--'):
                # Basic column extraction
                col_match = re.match(r'(\w+)\s+', line)
                if col_match:
                    col_name = col_match.group(1)
                    # Skip constraint keywords
                    if col_name.upper() not in ['PRIMARY', 'FOREIGN', 'UNIQUE', 'CHECK', 'CONSTRAINT']:
                        tables[f"{schema}.{table}" if schema != 'public' else table].add(col_name)
    
    return dict(tables)

def compare_schemas(json_tables: Dict[str, Set[str]], sql_tables: Dict[str, Set[str]]) -> Dict[str, any]:
    """Compare tables from JSON files with Desktop's SQL draft."""
    
    # Normalize table names (remove schema prefix for comparison)
    def normalize_table(name: str) -> str:
        return name.split('.')[-1]
    
    json_normalized = {normalize_table(k): v for k, v in json_tables.items()}
    sql_normalized = {normalize_table(k): v for k, v in sql_tables.items()}
    
    json_table_names = set(json_normalized.keys())
    sql_table_names = set(sql_normalized.keys())
    
    comparison = {
        'tables_in_json_only': json_table_names - sql_table_names,
        'tables_in_sql_only': sql_table_names - json_table_names,
        'tables_in_both': json_table_names & sql_table_names,
        'column_differences': {},
        'missing_columns': {},
        'extra_columns': {}
    }
    
    # Compare columns for tables that exist in both
    for table in comparison['tables_in_both']:
        json_cols = json_normalized.get(table, set())
        sql_cols = sql_normalized.get(table, set())
        
        missing = json_cols - sql_cols
        extra = sql_cols - json_cols
        
        if missing:
            comparison['missing_columns'][table] = missing
        if extra:
            comparison['extra_columns'][table] = extra
    
    return comparison

def check_call_sign_column(tables: Dict[str, Set[str]]) -> bool:
    """Check if call_sign column exists in student table."""
    student_cols = tables.get('student', set())
    return 'call_sign' in student_cols

def main():
    print("=" * 80)
    print("SESSION 00050: MIGRATION VERIFICATION REPORT")
    print("=" * 80)
    print()
    
    # Paths
    json_dir = Path('/home/b4sho/edl-projects-with-claude/edl-platform-v6/truth-seed/supabase-migration')
    sql_file = Path('/home/b4sho/edl-projects-with-claude/edl-platform-v6/migrations/desktop-edl-complete-migration-draft.sql')
    
    # Extract schemas
    print("📁 Analyzing JSON migration files...")
    json_tables = extract_tables_from_json_files(json_dir)
    print(f"  Found {len(json_tables)} tables in JSON files")
    print()
    
    print("📄 Analyzing Desktop's SQL draft...")
    sql_tables = extract_tables_from_sql(sql_file)
    print(f"  Found {len(sql_tables)} tables in SQL draft")
    print()
    
    # Compare schemas
    print("🔍 Comparing schemas...")
    comparison = compare_schemas(json_tables, sql_tables)
    
    print()
    print("=" * 80)
    print("COMPARISON RESULTS")
    print("=" * 80)
    
    # Tables comparison
    print(f"\n✅ Tables in both JSON and SQL: {len(comparison['tables_in_both'])}")
    if comparison['tables_in_both']:
        for table in sorted(comparison['tables_in_both']):
            print(f"   - {table}")
    
    print(f"\n❌ Tables in JSON but MISSING from SQL: {len(comparison['tables_in_json_only'])}")
    if comparison['tables_in_json_only']:
        for table in sorted(comparison['tables_in_json_only']):
            print(f"   - {table}")
    
    print(f"\n⚠️  Tables in SQL but NOT in JSON: {len(comparison['tables_in_sql_only'])}")
    if comparison['tables_in_sql_only']:
        for table in sorted(comparison['tables_in_sql_only']):
            print(f"   - {table}")
    
    # Column differences
    if comparison['missing_columns']:
        print(f"\n❌ MISSING COLUMNS (in JSON but not in SQL):")
        for table, cols in sorted(comparison['missing_columns'].items()):
            print(f"   {table}:")
            for col in sorted(cols):
                print(f"      - {col}")
    
    if comparison['extra_columns']:
        print(f"\n⚠️  EXTRA COLUMNS (in SQL but not in JSON):")
        for table, cols in sorted(comparison['extra_columns'].items()):
            print(f"   {table}:")
            for col in sorted(cols):
                print(f"      - {col}")
    
    # Check for call_sign column
    print()
    print("=" * 80)
    print("SPECIAL CHECKS")
    print("=" * 80)
    
    has_call_sign_json = check_call_sign_column(json_tables)
    has_call_sign_sql = check_call_sign_column(sql_tables)
    
    print(f"\n🎯 Call sign column in student table:")
    print(f"   JSON files: {'✅ EXISTS' if has_call_sign_json else '❌ MISSING - needs to be added'}")
    print(f"   SQL draft:  {'✅ EXISTS' if has_call_sign_sql else '❌ MISSING - needs to be added'}")
    
    # Summary
    print()
    print("=" * 80)
    print("ASSUMPTIONS TO VERIFY")
    print("=" * 80)
    
    assumptions = [
        ("uuid_generate_v4() → gen_random_uuid()", "Desktop converted correctly"),
        ("_int2[] → smallint[]", "Array type conversion"),
        ("Schema separation (chat, debate, public)", "Matches truth-seed structure"),
        ("Custom types defined", "All enums present"),
        ("Default values preserved", "auth.uid(), timestamps, etc."),
    ]
    
    print()
    for assumption, note in assumptions:
        print(f"📌 {assumption}")
        print(f"   {note}")
    
    # Action items
    print()
    print("=" * 80)
    print("ACTION ITEMS")
    print("=" * 80)
    
    action_items = []
    
    if comparison['tables_in_json_only']:
        action_items.append(f"Add {len(comparison['tables_in_json_only'])} missing tables to SQL draft")
    
    if comparison['missing_columns']:
        action_items.append(f"Add missing columns to {len(comparison['missing_columns'])} tables")
    
    if not has_call_sign_sql:
        action_items.append("Add call_sign column to student table")
    
    if comparison['extra_columns']:
        action_items.append(f"Review {len(comparison['extra_columns'])} tables with extra columns")
    
    if action_items:
        print("\n🔧 Required fixes:")
        for i, item in enumerate(action_items, 1):
            print(f"   {i}. {item}")
    else:
        print("\n✅ No major issues found!")
    
    print()
    print("=" * 80)
    print("Report complete!")

if __name__ == "__main__":
    main()