#!/usr/bin/env python3
"""
Session 00050: Validate Desktop's draft against Session 43's schema.sql
"""

import re
from pathlib import Path
from collections import defaultdict
from typing import Dict, Set, List, Tuple

def extract_tables_from_schema_sql(schema_file: Path) -> Dict[str, Dict]:
    """Extract tables, columns, and types from Session 43's schema.sql."""
    tables = defaultdict(lambda: {'columns': set(), 'types': set(), 'constraints': set()})
    custom_types = set()
    
    with open(schema_file, 'r') as f:
        content = f.read()
    
    # Remove JSON-like formatting if present
    content = re.sub(r'^\s*\{.*?\}\s*,?\s*$', '', content, flags=re.MULTILINE)
    content = re.sub(r'^\s*\[.*?\]\s*$', '', content, flags=re.MULTILINE)
    
    # Extract custom types (ENUMs)
    type_pattern = r'CREATE TYPE\s+(?:(\w+)\.)?(\w+)\s+AS\s+ENUM\s*\((.*?)\);'
    for match in re.finditer(type_pattern, content, re.DOTALL | re.IGNORECASE):
        schema = match.group(1) or 'public'
        type_name = match.group(2)
        full_name = f"{schema}.{type_name}" if schema != 'public' else type_name
        custom_types.add(full_name)
    
    # Extract CREATE TABLE statements
    # More robust pattern to handle multi-line definitions
    table_pattern = r'CREATE TABLE\s+(?:IF NOT EXISTS\s+)?(?:(\w+)\.)?(\w+)\s*\((.*?)\)(?:\s+INHERITS\s+\([^)]+\))?;'
    
    for match in re.finditer(table_pattern, content, re.DOTALL | re.IGNORECASE):
        schema = match.group(1) or 'public'
        table_name = match.group(2)
        full_table = f"{schema}.{table_name}" if schema != 'public' else table_name
        columns_str = match.group(3)
        
        # Parse columns from the table definition
        lines = columns_str.split('\n')
        for line in lines:
            line = line.strip()
            if not line or line.startswith('--'):
                continue
                
            # Extract column definitions
            col_match = re.match(r'^(\w+)\s+([A-Za-z_][\w\[\]]*)', line)
            if col_match:
                col_name = col_match.group(1)
                col_type = col_match.group(2)
                
                # Skip constraint keywords
                if col_name.upper() not in ['PRIMARY', 'FOREIGN', 'UNIQUE', 'CHECK', 'CONSTRAINT', 'KEY']:
                    tables[full_table]['columns'].add(col_name)
                    
                    # Track if it uses a custom type
                    if col_type in custom_types or f"public.{col_type}" in custom_types:
                        tables[full_table]['types'].add(col_type)
            
            # Check for constraints
            if 'PRIMARY KEY' in line.upper():
                tables[full_table]['constraints'].add('PRIMARY KEY')
            elif 'FOREIGN KEY' in line.upper():
                tables[full_table]['constraints'].add('FOREIGN KEY')
    
    return dict(tables), custom_types

def extract_tables_from_desktop_sql(sql_file: Path) -> Dict[str, Dict]:
    """Extract tables and columns from Desktop's draft SQL."""
    tables = defaultdict(lambda: {'columns': set(), 'types': set(), 'constraints': set()})
    custom_types = set()
    
    with open(sql_file, 'r') as f:
        content = f.read()
    
    # Extract custom types
    type_pattern = r'CREATE TYPE\s+(?:(\w+)\.)?(\w+)\s+AS\s+ENUM\s*\((.*?)\);'
    for match in re.finditer(type_pattern, content, re.DOTALL | re.IGNORECASE):
        schema = match.group(1) or 'public'
        type_name = match.group(2)
        full_name = f"{schema}.{type_name}" if schema != 'public' else type_name
        custom_types.add(full_name)
    
    # Extract CREATE TABLE statements
    table_pattern = r'CREATE TABLE\s+(?:IF NOT EXISTS\s+)?(?:(\w+)\.)?(\w+)\s*\((.*?)\);'
    
    for match in re.finditer(table_pattern, content, re.DOTALL | re.IGNORECASE):
        schema = match.group(1) or 'public'
        table_name = match.group(2)
        full_table = f"{schema}.{table_name}" if schema != 'public' else table_name
        columns_str = match.group(3)
        
        # Parse columns
        lines = columns_str.split('\n')
        for line in lines:
            line = line.strip()
            if not line or line.startswith('--'):
                continue
                
            # Handle quoted column names like "group"
            col_match = re.match(r'^"?(\w+)"?\s+', line)
            if col_match:
                col_name = col_match.group(1)
                
                # Skip constraint keywords
                if col_name.upper() not in ['PRIMARY', 'FOREIGN', 'UNIQUE', 'CHECK', 'CONSTRAINT', 'KEY']:
                    tables[full_table]['columns'].add(col_name)
    
    return dict(tables), custom_types

def normalize_table_name(name: str) -> str:
    """Normalize table names for comparison."""
    # Remove schema prefix for easier comparison
    return name.split('.')[-1]

def compare_schemas(schema43_tables: Dict, desktop_tables: Dict, schema43_types: Set, desktop_types: Set) -> Dict:
    """Compare the two schemas."""
    
    # Normalize for comparison
    schema43_norm = {normalize_table_name(k): v for k, v in schema43_tables.items()}
    desktop_norm = {normalize_table_name(k): v for k, v in desktop_tables.items()}
    
    schema43_names = set(schema43_norm.keys())
    desktop_names = set(desktop_norm.keys())
    
    comparison = {
        'tables_in_both': schema43_names & desktop_names,
        'tables_in_schema43_only': schema43_names - desktop_names,
        'tables_in_desktop_only': desktop_names - schema43_names,
        'column_differences': {},
        'type_differences': {
            'in_schema43_only': schema43_types - desktop_types,
            'in_desktop_only': desktop_types - schema43_types,
            'in_both': schema43_types & desktop_types
        }
    }
    
    # Compare columns for matching tables
    for table in comparison['tables_in_both']:
        schema43_cols = schema43_norm[table]['columns']
        desktop_cols = desktop_norm[table]['columns']
        
        missing = schema43_cols - desktop_cols
        extra = desktop_cols - schema43_cols
        
        if missing or extra:
            comparison['column_differences'][table] = {
                'missing_from_desktop': missing,
                'extra_in_desktop': extra
            }
    
    return comparison

def check_special_columns(tables: Dict) -> Dict:
    """Check for special EDL columns like call_sign."""
    special = {}
    
    # Check for call_sign in student table
    for table_name, table_info in tables.items():
        if 'student' in table_name.lower():
            special['student_table'] = table_name
            special['has_call_sign'] = 'call_sign' in table_info['columns']
            break
    
    return special

def main():
    print("=" * 80)
    print("SESSION 00050: DESKTOP DRAFT vs SESSION 43 SCHEMA.SQL VALIDATION")
    print("=" * 80)
    print()
    
    # File paths
    schema43_file = Path('/home/b4sho/edl-projects-with-claude/edl-platform-v6/truth-seed/emdash-dashboard-main/docs/schema.sql')
    desktop_file = Path('/home/b4sho/edl-projects-with-claude/edl-platform-v6/migrations/desktop-edl-complete-migration-draft.sql')
    
    # Extract schemas
    print("📄 Analyzing Session 43's schema.sql (7,304 lines)...")
    schema43_tables, schema43_types = extract_tables_from_schema_sql(schema43_file)
    print(f"  Found {len(schema43_tables)} tables, {len(schema43_types)} custom types")
    
    print("\n📄 Analyzing Desktop's draft SQL...")
    desktop_tables, desktop_types = extract_tables_from_desktop_sql(desktop_file)
    print(f"  Found {len(desktop_tables)} tables, {len(desktop_types)} custom types")
    
    # Compare
    print("\n🔍 Comparing schemas...")
    comparison = compare_schemas(schema43_tables, desktop_tables, schema43_types, desktop_types)
    
    print("\n" + "=" * 80)
    print("COMPARISON RESULTS")
    print("=" * 80)
    
    # Tables comparison
    print(f"\n✅ Tables in both: {len(comparison['tables_in_both'])}")
    if len(comparison['tables_in_both']) <= 40:  # Only show if reasonable number
        for table in sorted(comparison['tables_in_both'])[:10]:
            print(f"   - {table}")
        if len(comparison['tables_in_both']) > 10:
            print(f"   ... and {len(comparison['tables_in_both']) - 10} more")
    
    print(f"\n⚠️  Tables in Session 43 schema.sql ONLY: {len(comparison['tables_in_schema43_only'])}")
    if comparison['tables_in_schema43_only']:
        # Check if these are system tables
        system_tables = {'identities', 'sessions', 'refresh_tokens', 'mfa_factors', 'mfa_challenges',
                        'one_time_tokens', 'saml_providers', 'saml_relay_states', 'sso_domains',
                        'objects', 's3_multipart_uploads', 's3_multipart_uploads_parts'}
        
        schema43_only = comparison['tables_in_schema43_only']
        system_found = schema43_only & system_tables
        app_tables = schema43_only - system_tables
        
        if system_found:
            print(f"   System tables (OK to exclude): {len(system_found)}")
        if app_tables:
            print(f"   ❌ APPLICATION TABLES MISSING: {len(app_tables)}")
            for table in sorted(app_tables)[:10]:
                print(f"      - {table}")
    
    print(f"\n⚠️  Tables in Desktop draft ONLY: {len(comparison['tables_in_desktop_only'])}")
    if comparison['tables_in_desktop_only']:
        for table in sorted(comparison['tables_in_desktop_only']):
            print(f"   - {table}")
    
    # Column differences
    if comparison['column_differences']:
        print(f"\n📊 Column differences in {len(comparison['column_differences'])} tables:")
        for table, diffs in sorted(comparison['column_differences'].items())[:5]:
            print(f"\n   {table}:")
            if diffs['missing_from_desktop']:
                print(f"      Missing in Desktop: {', '.join(sorted(diffs['missing_from_desktop']))}")
            if diffs['extra_in_desktop']:
                print(f"      Extra in Desktop: {', '.join(sorted(diffs['extra_in_desktop']))}")
    
    # Type differences
    print(f"\n🔧 Custom Type Comparison:")
    print(f"   Types in both: {len(comparison['type_differences']['in_both'])}")
    if comparison['type_differences']['in_schema43_only']:
        print(f"   Missing from Desktop: {comparison['type_differences']['in_schema43_only']}")
    if comparison['type_differences']['in_desktop_only']:
        print(f"   Extra in Desktop: {comparison['type_differences']['in_desktop_only']}")
    
    # Special checks
    print("\n" + "=" * 80)
    print("SPECIAL CHECKS")
    print("=" * 80)
    
    schema43_special = check_special_columns(schema43_tables)
    desktop_special = check_special_columns(desktop_tables)
    
    print(f"\n🎯 Call sign column:")
    print(f"   Schema 43: {'✅ EXISTS' if schema43_special.get('has_call_sign') else '❌ MISSING'}")
    print(f"   Desktop:   {'✅ EXISTS' if desktop_special.get('has_call_sign') else '❌ MISSING'}")
    
    # Summary
    print("\n" + "=" * 80)
    print("VALIDATION SUMMARY")
    print("=" * 80)
    
    issues = []
    
    # Check for critical missing tables (non-system)
    system_tables = {'identities', 'sessions', 'refresh_tokens', 'mfa_factors', 'mfa_challenges',
                    'one_time_tokens', 'saml_providers', 'saml_relay_states', 'sso_domains',
                    'objects', 's3_multipart_uploads', 's3_multipart_uploads_parts', 'prefixes',
                    'mfa_amr_claims', 'pg_index'}
    
    app_missing = comparison['tables_in_schema43_only'] - system_tables
    if app_missing:
        issues.append(f"❌ {len(app_missing)} application tables missing from Desktop draft")
    
    if comparison['column_differences']:
        issues.append(f"⚠️  {len(comparison['column_differences'])} tables have column differences")
    
    if not desktop_special.get('has_call_sign'):
        issues.append("❌ Call sign column missing from student table")
    elif desktop_special.get('has_call_sign') and not schema43_special.get('has_call_sign'):
        print("\n✅ Desktop correctly adds call_sign column (EDL requirement)")
    
    if issues:
        print("\n🔧 Issues to address:")
        for issue in issues:
            print(f"   {issue}")
    else:
        print("\n✅ Desktop draft is fully compatible with Session 43's schema!")
    
    print("\n" + "=" * 80)
    print("Validation complete!")

if __name__ == "__main__":
    main()