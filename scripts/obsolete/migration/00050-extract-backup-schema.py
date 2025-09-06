#!/usr/bin/env python3
"""
Session 00050: Extract and analyze schema from Supabase backup file
"""

import re
from pathlib import Path
from collections import defaultdict
from typing import Dict, List, Set, Tuple

def extract_tables_from_backup(backup_file: Path) -> Tuple[Dict[str, List[str]], Dict[str, str], Set[str]]:
    """Extract tables, types, and functions from Supabase backup."""
    
    tables = defaultdict(list)
    types = {}
    functions = set()
    
    with open(backup_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract CREATE TABLE statements
    table_pattern = r'CREATE TABLE\s+(?:IF NOT EXISTS\s+)?(?:ONLY\s+)?(\w+)\.(\w+)\s*\((.*?)\)(?:\s+PARTITION BY.*?)?;'
    
    for match in re.finditer(table_pattern, content, re.DOTALL | re.IGNORECASE):
        schema = match.group(1)
        table_name = match.group(2)
        columns_def = match.group(3)
        
        full_table = f"{schema}.{table_name}"
        
        # Parse columns
        columns = []
        for line in columns_def.split('\n'):
            line = line.strip()
            if line and not line.startswith('--'):
                # Extract column name
                col_match = re.match(r'^"?(\w+)"?\s+', line)
                if col_match:
                    col_name = col_match.group(1)
                    if col_name.upper() not in ['CONSTRAINT', 'PRIMARY', 'FOREIGN', 'UNIQUE', 'CHECK', 'PARTITION']:
                        columns.append(col_name)
        
        tables[full_table] = columns
    
    # Extract CREATE TYPE statements
    type_pattern = r'CREATE TYPE\s+(?:IF NOT EXISTS\s+)?(\w+)\.(\w+)\s+AS\s+(ENUM\s*\([^)]+\)|[^;]+);'
    
    for match in re.finditer(type_pattern, content, re.DOTALL | re.IGNORECASE):
        schema = match.group(1)
        type_name = match.group(2)
        type_def = match.group(3)
        
        full_type = f"{schema}.{type_name}"
        types[full_type] = type_def
    
    # Extract CREATE FUNCTION statements
    function_pattern = r'CREATE\s+(?:OR\s+REPLACE\s+)?FUNCTION\s+(\w+)\.(\w+)\s*\([^)]*\)'
    
    for match in re.finditer(function_pattern, content, re.IGNORECASE):
        schema = match.group(1)
        func_name = match.group(2)
        functions.add(f"{schema}.{func_name}")
    
    return dict(tables), types, functions

def categorize_tables(tables: Dict[str, List[str]]) -> Dict[str, List[str]]:
    """Categorize tables by schema and type."""
    
    categories = {
        'application': [],
        'auth_system': [],
        'storage_system': [],
        'realtime_system': [],
        'other_system': []
    }
    
    for table_name in sorted(tables.keys()):
        schema = table_name.split('.')[0]
        
        if schema in ['public', 'chat', 'debate']:
            categories['application'].append(table_name)
        elif schema == 'auth':
            categories['auth_system'].append(table_name)
        elif schema == 'storage':
            categories['storage_system'].append(table_name)
        elif schema == 'realtime':
            categories['realtime_system'].append(table_name)
        else:
            categories['other_system'].append(table_name)
    
    return categories

def check_for_call_sign(tables: Dict[str, List[str]]) -> bool:
    """Check if call_sign column exists in student table."""
    
    student_tables = [t for t in tables.keys() if 'student' in t.lower()]
    
    for table in student_tables:
        if 'call_sign' in tables[table]:
            return True
    
    return False

def compare_with_desktop(backup_tables: Dict[str, List[str]], desktop_file: Path) -> Dict:
    """Compare backup schema with Desktop's migration."""
    
    # Read Desktop's migration
    with open(desktop_file, 'r') as f:
        desktop_content = f.read()
    
    # Extract Desktop tables (simplified)
    desktop_tables = set()
    table_pattern = r'CREATE TABLE\s+(?:IF NOT EXISTS\s+)?(?:(\w+)\.)?(\w+)'
    
    for match in re.finditer(table_pattern, desktop_content, re.IGNORECASE):
        schema = match.group(1) or 'public'
        table = match.group(2)
        desktop_tables.add(f"{schema}.{table}")
    
    # Get application tables from backup
    categories = categorize_tables(backup_tables)
    backup_app_tables = set(categories['application'])
    
    comparison = {
        'in_both': backup_app_tables & desktop_tables,
        'backup_only': backup_app_tables - desktop_tables,
        'desktop_only': desktop_tables - backup_app_tables
    }
    
    return comparison

def main():
    print("=" * 80)
    print("SESSION 00050: SUPABASE BACKUP SCHEMA EXTRACTION")
    print("=" * 80)
    print()
    
    # File paths
    backup_file = Path('/home/b4sho/edl-projects-with-claude/edl-platform-v6/migrations/supabase-project.backup')
    desktop_file = Path('/home/b4sho/edl-projects-with-claude/edl-platform-v6/migrations/desktop-edl-complete-migration-draft.sql')
    
    # Extract from backup
    print("📦 Extracting schema from Supabase backup...")
    tables, types, functions = extract_tables_from_backup(backup_file)
    print(f"  Found {len(tables)} tables, {len(types)} types, {len(functions)} functions")
    
    # Categorize tables
    print("\n📊 Categorizing tables...")
    categories = categorize_tables(tables)
    
    print("\n" + "=" * 80)
    print("BACKUP SCHEMA ANALYSIS")
    print("=" * 80)
    
    # Show table counts by category
    print(f"\n📁 Application Tables: {len(categories['application'])}")
    for table in sorted(categories['application']):
        columns = tables[table]
        print(f"   - {table} ({len(columns)} columns)")
        if 'student' in table.lower():
            if 'call_sign' in columns:
                print(f"     ✅ Has call_sign column")
            else:
                print(f"     ❌ Missing call_sign column")
    
    print(f"\n🔒 Auth System Tables: {len(categories['auth_system'])}")
    
    print(f"\n💾 Storage System Tables: {len(categories['storage_system'])}")
    
    print(f"\n📡 Realtime System Tables: {len(categories['realtime_system'])}")
    
    # Show types
    print(f"\n🔧 Custom Types: {len(types)}")
    app_types = [t for t in types.keys() if t.startswith(('public.', 'debate.', 'chat.'))]
    for type_name in sorted(app_types):
        print(f"   - {type_name}")
    
    # Check for call_sign
    print("\n" + "=" * 80)
    print("SPECIAL CHECKS")
    print("=" * 80)
    
    has_call_sign = check_for_call_sign(tables)
    print(f"\n🎯 Call sign column in backup: {'✅ EXISTS' if has_call_sign else '❌ MISSING (needs to be added)'}")
    
    # Compare with Desktop
    print("\n" + "=" * 80)
    print("COMPARISON WITH DESKTOP MIGRATION")
    print("=" * 80)
    
    comparison = compare_with_desktop(tables, desktop_file)
    
    print(f"\n✅ Tables in both: {len(comparison['in_both'])}")
    
    if comparison['backup_only']:
        print(f"\n⚠️  In backup but not Desktop: {len(comparison['backup_only'])}")
        for table in sorted(comparison['backup_only']):
            print(f"   - {table}")
    
    if comparison['desktop_only']:
        print(f"\n⚠️  In Desktop but not backup: {len(comparison['desktop_only'])}")
        for table in sorted(comparison['desktop_only']):
            print(f"   - {table}")
    
    # Save extraction
    print("\n" + "=" * 80)
    print("SAVING EXTRACTION")
    print("=" * 80)
    
    output_file = Path('/home/b4sho/edl-projects-with-claude/edl-platform-v6/migrations/00050-backup-extraction.sql')
    
    with open(output_file, 'w') as f:
        f.write("-- Extracted Application Tables from Supabase Backup\n")
        f.write("-- Session 00050\n")
        f.write("-- " + "=" * 50 + "\n\n")
        
        # Extract just the application table definitions
        with open(backup_file, 'r') as backup:
            content = backup.read()
            
            for table_name in sorted(categories['application']):
                schema, table = table_name.split('.')
                
                # Find the CREATE TABLE statement
                pattern = rf'CREATE TABLE\s+(?:ONLY\s+)?{re.escape(schema)}\.{re.escape(table)}\s*\([^;]+\);'
                match = re.search(pattern, content, re.DOTALL | re.IGNORECASE)
                
                if match:
                    f.write(f"-- {table_name}\n")
                    f.write(match.group(0))
                    f.write("\n\n")
    
    print(f"\n✅ Extracted application tables saved to: {output_file}")
    
    print("\n" + "=" * 80)
    print("SUMMARY")
    print("=" * 80)
    
    print(f"""
📊 Backup Analysis Complete:
   - Application tables: {len(categories['application'])}
   - System tables: {len(categories['auth_system']) + len(categories['storage_system']) + len(categories['realtime_system'])}
   - Call sign column: {'EXISTS' if has_call_sign else 'MISSING - needs to be added'}
   - Desktop compatibility: {len(comparison['in_both'])} matching tables
   
🔍 Key Finding:
   This backup represents the ACTUAL current state of the truth-seed database.
   Use this to verify Desktop's migration will work correctly.
""")

if __name__ == "__main__":
    main()