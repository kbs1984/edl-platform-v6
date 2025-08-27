#!/usr/bin/env python3
"""
Session 00080 - Extract and analyze RLS policies from Supabase backup
Purpose: Comprehensive policy extraction and migration script generation
Created: 2025-08-26
"""

import re
import sys
import json
from pathlib import Path
from datetime import datetime

def extract_policies_from_backup(backup_file):
    """Extract all CREATE POLICY statements from backup file"""
    
    with open(backup_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Pattern to match CREATE POLICY statements
    # Captures: policy name, table name, and full policy definition
    policy_pattern = r'CREATE POLICY\s+"([^"]+)"\s+ON\s+(\S+\.)?(\w+)\s+(.*?)(?=;)'
    
    policies_by_table = {}
    all_policies = []
    
    for match in re.finditer(policy_pattern, content, re.DOTALL):
        policy_name = match.group(1)
        schema = match.group(2).rstrip('.') if match.group(2) else 'public'
        table_name = match.group(3)
        policy_def = match.group(4).strip()
        
        full_table = f"{schema}.{table_name}"
        
        policy_info = {
            'name': policy_name,
            'schema': schema,
            'table': table_name,
            'full_table': full_table,
            'definition': policy_def,
            'full_statement': f'CREATE POLICY "{policy_name}" ON {full_table} {policy_def};'
        }
        
        # Parse the policy type (SELECT, INSERT, UPDATE, DELETE)
        if 'FOR SELECT' in policy_def:
            policy_info['type'] = 'SELECT'
        elif 'FOR INSERT' in policy_def:
            policy_info['type'] = 'INSERT'
        elif 'FOR UPDATE' in policy_def:
            policy_info['type'] = 'UPDATE'
        elif 'FOR DELETE' in policy_def:
            policy_info['type'] = 'DELETE'
        else:
            policy_info['type'] = 'ALL'
        
        if full_table not in policies_by_table:
            policies_by_table[full_table] = []
        
        policies_by_table[full_table].append(policy_info)
        all_policies.append(policy_info)
    
    return policies_by_table, all_policies

def check_rls_enabled(backup_content):
    """Extract tables with RLS enabled"""
    rls_pattern = r'ALTER TABLE\s+(\S+\.)?(\w+)\s+ENABLE ROW LEVEL SECURITY;'
    
    rls_tables = set()
    for match in re.finditer(rls_pattern, backup_content):
        schema = match.group(1).rstrip('.') if match.group(1) else 'public'
        table = match.group(2)
        rls_tables.add(f"{schema}.{table}")
    
    return rls_tables

def generate_migration_sql(policies_by_table, rls_tables):
    """Generate SQL migration script to match backup policies"""
    
    sql = []
    sql.append("-- ============================================")
    sql.append("-- Session 00080 - RLS Policy Migration Script")
    sql.append(f"-- Generated: {datetime.now().isoformat()}")
    sql.append("-- Purpose: Reconcile database policies with backup")
    sql.append("-- ============================================\n")
    
    sql.append("-- PHASE 1: Drop all existing policies")
    sql.append("-- This ensures we start clean\n")
    
    for table in sorted(policies_by_table.keys()):
        sql.append(f"-- Drop policies for {table}")
        for policy in policies_by_table[table]:
            sql.append(f'DROP POLICY IF EXISTS "{policy["name"]}" ON {table};')
        sql.append("")
    
    sql.append("\n-- PHASE 2: Enable RLS on tables")
    sql.append("-- Must be done before creating policies\n")
    
    for table in sorted(rls_tables):
        sql.append(f"ALTER TABLE {table} ENABLE ROW LEVEL SECURITY;")
    
    sql.append("\n-- PHASE 3: Create policies from backup")
    sql.append("-- These are the authoritative policies\n")
    
    for table in sorted(policies_by_table.keys()):
        sql.append(f"\n-- Policies for {table}")
        sql.append(f"-- Total: {len(policies_by_table[table])} policies")
        
        # Group by policy type for clarity
        by_type = {}
        for policy in policies_by_table[table]:
            policy_type = policy.get('type', 'ALL')
            if policy_type not in by_type:
                by_type[policy_type] = []
            by_type[policy_type].append(policy)
        
        for policy_type in ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'ALL']:
            if policy_type in by_type:
                sql.append(f"\n-- {policy_type} policies")
                for policy in by_type[policy_type]:
                    sql.append(policy['full_statement'])
                    sql.append("")
    
    return '\n'.join(sql)

def analyze_profile_table(policies_by_table):
    """Special analysis of profile table policies"""
    
    profile_tables = [k for k in policies_by_table.keys() if 'profile' in k.lower()]
    
    analysis = []
    analysis.append("\n=== PROFILE TABLE ANALYSIS ===")
    
    for table in profile_tables:
        analysis.append(f"\nTable: {table}")
        analysis.append(f"Total policies: {len(policies_by_table[table])}")
        
        by_type = {}
        for policy in policies_by_table[table]:
            policy_type = policy.get('type', 'ALL')
            if policy_type not in by_type:
                by_type[policy_type] = []
            by_type[policy_type].append(policy['name'])
        
        for policy_type, names in by_type.items():
            analysis.append(f"  {policy_type}: {len(names)} policies")
            for name in names:
                analysis.append(f"    - {name}")
    
    # Check for INSERT policies
    has_insert = any(p.get('type') == 'INSERT' for p in policies_by_table.get('public.profile', []))
    analysis.append(f"\n🔍 CRITICAL CHECK: Profile table has INSERT policy? {has_insert}")
    
    if not has_insert:
        analysis.append("✅ CONFIRMED: No INSERT policy on profile table in backup")
        analysis.append("⚠️  This means profile_insert_authenticated should be REMOVED")
    
    return '\n'.join(analysis)

def main():
    backup_file = Path('reconciliation/migrations/supabase-project.backup')
    
    if not backup_file.exists():
        print(f"Error: Backup file not found at {backup_file}")
        sys.exit(1)
    
    print("🔍 Analyzing Supabase backup file...")
    
    # Read backup content
    with open(backup_file, 'r', encoding='utf-8') as f:
        backup_content = f.read()
    
    # Extract policies
    policies_by_table, all_policies = extract_policies_from_backup(backup_file)
    
    # Check RLS enabled tables
    rls_tables = check_rls_enabled(backup_content)
    
    # Generate reports
    print(f"\n📊 Summary:")
    print(f"  - Total policies found: {len(all_policies)}")
    print(f"  - Tables with policies: {len(policies_by_table)}")
    print(f"  - Tables with RLS enabled: {len(rls_tables)}")
    
    # Save policy data as JSON
    output_dir = Path('scripts/00080-migration-audit')
    output_dir.mkdir(exist_ok=True)
    
    with open(output_dir / 'backup-policies.json', 'w') as f:
        json.dump({
            'extraction_date': datetime.now().isoformat(),
            'total_policies': len(all_policies),
            'tables_with_policies': len(policies_by_table),
            'rls_enabled_tables': list(rls_tables),
            'policies_by_table': policies_by_table
        }, f, indent=2)
    
    print(f"\n✅ Policy data saved to {output_dir / 'backup-policies.json'}")
    
    # Generate migration SQL
    migration_sql = generate_migration_sql(policies_by_table, rls_tables)
    
    migration_file = output_dir / 'complete-policy-migration.sql'
    with open(migration_file, 'w') as f:
        f.write(migration_sql)
    
    print(f"✅ Migration script saved to {migration_file}")
    
    # Profile table analysis
    profile_analysis = analyze_profile_table(policies_by_table)
    print(profile_analysis)
    
    # Save analysis report
    with open(output_dir / 'profile-table-analysis.txt', 'w') as f:
        f.write(profile_analysis)
    
    # Generate immediate fix for profile table
    immediate_fix = []
    immediate_fix.append("-- IMMEDIATE FIX FOR AUTH SIGNUP")
    immediate_fix.append("-- Run this NOW to unblock user registration\n")
    immediate_fix.append("-- Remove the policy that's not in backup")
    immediate_fix.append('DROP POLICY IF EXISTS "profile_insert_authenticated" ON public.profile;')
    immediate_fix.append("")
    immediate_fix.append("-- Ensure RLS is still enabled")
    immediate_fix.append("ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;")
    immediate_fix.append("")
    immediate_fix.append("-- The profile table should only have SELECT and UPDATE policies")
    immediate_fix.append("-- Profile creation is handled by trigger after auth.users insert")
    
    with open(output_dir / 'immediate-profile-fix.sql', 'w') as f:
        f.write('\n'.join(immediate_fix))
    
    print(f"\n🚨 IMMEDIATE ACTION REQUIRED:")
    print(f"   Run the script at {output_dir / 'immediate-profile-fix.sql'}")
    print(f"   This will remove the blocking INSERT policy\n")
    
    return 0

if __name__ == "__main__":
    sys.exit(main())