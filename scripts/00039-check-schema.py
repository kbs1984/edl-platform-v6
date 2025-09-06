#!/usr/bin/env python3
"""
---
session: "00039"
type: "script"
status: "unknown"
created: "2025-08-28"
title: "00039-check-schema.py"
purpose: "Script for check schema"
language: "python"
category: "verification"
topics: ["verification"]
priority: "P2"
domain: "core"
---
"""
"""
Schema Snapshot Reader - Session 00039
Reads the schema snapshot created by Session 38 and provides useful queries.
This replaces direct Supabase access for schema information.
"""

import json
import argparse
import os
from datetime import datetime
from pathlib import Path

SNAPSHOT_DIR = Path(__file__).parent.parent / 'supabase' / 'schema-snapshot'

def load_snapshot_file(filename):
    """Load a JSON file from the snapshot directory."""
    filepath = SNAPSHOT_DIR / filename
    if not filepath.exists():
        print(f"⚠️  Snapshot file not found: {filename}")
        return None
    
    with open(filepath, 'r') as f:
        return json.load(f)

def check_snapshot_age():
    """Check how old the snapshot is and warn if stale."""
    metadata_file = SNAPSHOT_DIR / 'snapshot-metadata.json'
    if metadata_file.exists():
        metadata = load_snapshot_file('snapshot-metadata.json')
        if metadata and 'timestamp' in metadata:
            snapshot_time = datetime.fromisoformat(metadata['timestamp'].replace('Z', '+00:00'))
            age_days = (datetime.now(snapshot_time.tzinfo) - snapshot_time).days
            if age_days > 7:
                print(f"⚠️  Snapshot is {age_days} days old, consider updating")
            return metadata
    return None

def show_policies(table_name=None):
    """Display RLS policies for a table or all tables."""
    policies = load_snapshot_file('policies.json')
    if not policies:
        return
    
    print("\n" + "=" * 60)
    print("RLS POLICIES FROM SNAPSHOT")
    print("=" * 60)
    
    tables_to_show = [table_name] if table_name else sorted(policies.keys())
    
    for table in tables_to_show:
        if table not in policies:
            print(f"\n❌ No policies found for table: {table}")
            continue
            
        table_policies = policies[table]
        print(f"\n📋 {table.upper()} TABLE ({len(table_policies)} policies)")
        print("-" * 50)
        
        for policy in table_policies:
            cmd = policy.get('cmd', 'UNKNOWN')
            name = policy.get('policyname', 'unnamed')
            roles = policy.get('roles', [])
            
            print(f"\n  {cmd} - \"{name}\"")
            print(f"    Roles: {', '.join(roles) if roles else 'none'}")
            
            if policy.get('qual'):
                print(f"    Using: {policy['qual']}")
            if policy.get('with_check'):
                print(f"    Check: {policy['with_check']}")
    
    # Check for missing operations
    if table_name:
        check_missing_operations(table_name, policies.get(table_name, []))

def check_missing_operations(table, policies):
    """Check which CRUD operations are missing policies."""
    operations = {'SELECT', 'INSERT', 'UPDATE', 'DELETE'}
    existing_ops = {p.get('cmd') for p in policies}
    missing = operations - existing_ops
    
    if missing:
        print(f"\n⚠️  Missing policies for operations: {', '.join(sorted(missing))}")

def show_columns(table_name=None):
    """Display table columns and their types."""
    tables = load_snapshot_file('tables.json')
    if not tables:
        return
    
    print("\n" + "=" * 60)
    print("TABLE STRUCTURE FROM SNAPSHOT")
    print("=" * 60)
    
    tables_to_show = [table_name] if table_name else sorted(tables.keys())
    
    for table in tables_to_show:
        if table not in tables:
            print(f"\n❌ No structure found for table: {table}")
            continue
            
        columns = tables[table]
        print(f"\n📊 {table.upper()} TABLE ({len(columns)} columns)")
        print("-" * 50)
        
        for col in columns:
            name = col.get('column_name', 'unknown')
            dtype = col.get('data_type', 'unknown')
            nullable = "NULL" if col.get('is_nullable') == 'YES' else "NOT NULL"
            default = col.get('column_default', '')
            
            print(f"  {name:20} {dtype:15} {nullable:10}", end="")
            if default:
                print(f" DEFAULT: {default[:30]}", end="")
            print()

def show_constraints(table_name=None):
    """Display table constraints."""
    constraints = load_snapshot_file('constraints.json')
    if not constraints:
        return
    
    print("\n" + "=" * 60)
    print("CONSTRAINTS FROM SNAPSHOT")
    print("=" * 60)
    
    # Constraints are already grouped by table in the JSON
    tables_to_show = [table_name] if table_name else sorted(constraints.keys())
    
    for table in tables_to_show:
        if table not in constraints:
            print(f"\n❌ No constraints found for table: {table}")
            continue
            
        table_constraints = constraints[table]
        print(f"\n🔒 {table.upper()} TABLE CONSTRAINTS")
        print("-" * 50)
        
        for c in table_constraints:
            ctype = c.get('constraint_type', 'UNKNOWN')
            name = c.get('constraint_name', 'unnamed')
            column = c.get('column_name', '')
            
            print(f"  {ctype:15} {name:30}")
            if column:
                print(f"    Column: {column}")
            if c.get('foreign_table_name'):
                print(f"    References: {c['foreign_table_name']}.{c.get('foreign_column_name', '?')}")
            if c.get('check_clause'):
                print(f"    Check: {c['check_clause']}")

def show_rls_status():
    """Show which tables have RLS enabled."""
    rls_status = load_snapshot_file('rls-status.json')
    if not rls_status:
        return
    
    print("\n" + "=" * 60)
    print("RLS STATUS FROM SNAPSHOT")
    print("=" * 60)
    
    for table in rls_status:
        name = table.get('tablename', 'unknown')
        enabled = table.get('rowsecurity', False)
        status = "✅ ENABLED" if enabled else "❌ DISABLED"
        print(f"  {name:30} {status}")

def show_all(table_name):
    """Show everything about a specific table."""
    print(f"\n{'=' * 60}")
    print(f"COMPLETE INFORMATION FOR: {table_name}")
    print(f"{'=' * 60}")
    
    show_columns(table_name)
    show_constraints(table_name)
    show_policies(table_name)
    
    # Check RLS status
    rls_status = load_snapshot_file('rls-status.json')
    if rls_status:
        for table in rls_status:
            if table.get('tablename') == table_name:
                enabled = "✅ ENABLED" if table.get('rowsecurity') else "❌ DISABLED"
                print(f"\n🔐 RLS Status: {enabled}")
                break

def main():
    parser = argparse.ArgumentParser(
        description='Query the Supabase schema snapshot',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python3 scripts/00039-check-schema.py --table profiles --policies
  python3 scripts/00039-check-schema.py --table profiles --all
  python3 scripts/00039-check-schema.py --policies  # Show all tables
  python3 scripts/00039-check-schema.py --rls-status
        """
    )
    
    parser.add_argument('--table', help='Specific table to query')
    parser.add_argument('--policies', action='store_true', help='Show RLS policies')
    parser.add_argument('--columns', action='store_true', help='Show table columns')
    parser.add_argument('--constraints', action='store_true', help='Show constraints')
    parser.add_argument('--rls-status', action='store_true', help='Show RLS enable status')
    parser.add_argument('--all', action='store_true', help='Show everything for a table')
    
    args = parser.parse_args()
    
    # Check snapshot age
    metadata = check_snapshot_age()
    if metadata:
        print(f"📅 Snapshot from: {metadata.get('timestamp', 'unknown')}")
        print(f"📝 Session: {metadata.get('session', 'unknown')}")
    
    # If no specific flag, show help
    if not any([args.policies, args.columns, args.constraints, args.rls_status, args.all]):
        parser.print_help()
        return
    
    # Execute requested queries
    if args.all:
        if not args.table:
            print("❌ --all requires --table to be specified")
            return
        show_all(args.table)
    else:
        if args.policies:
            show_policies(args.table)
        if args.columns:
            show_columns(args.table)
        if args.constraints:
            show_constraints(args.table)
        if args.rls_status:
            show_rls_status()
    
    print("\n" + "=" * 60)
    print("💡 TIP: Use --all with --table for complete information")
    print("=" * 60)

if __name__ == '__main__':
    main()