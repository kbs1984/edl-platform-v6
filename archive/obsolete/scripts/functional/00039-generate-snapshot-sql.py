#!/usr/bin/env python3
"""
---
session: "00039"
type: "script"
status: "unknown"
created: "2025-08-28"
title: "00039-generate-snapshot-sql.py"
purpose: "Script for generate snapshot sql"
language: "python"
category: "creation"
topics: ["creation"]
priority: "P2"
domain: "core"
---
"""
"""
00039-generate-snapshot-sql.py - Generate SQL to capture Supabase schema
Session 38: Creating visibility into actual database state
Per 00039-SCHEMA-SNAPSHOT-SPEC.md and 00031-WORKFLOW-BOUNDARIES.md

This generates SQL queries to run in Supabase Dashboard SQL Editor.
Copy the output and paste into Dashboard to capture schema state.
"""

import json
from datetime import datetime

def generate_snapshot_sql():
    """Generate comprehensive SQL to capture schema state"""
    
    print("=" * 80)
    print("SUPABASE SCHEMA SNAPSHOT SQL")
    print("Generated:", datetime.now().isoformat())
    print("Session 38 - Infrastructure Visibility Enhancement")
    print("=" * 80)
    print()
    print("INSTRUCTIONS:")
    print("1. Copy ALL SQL below")
    print("2. Go to Supabase Dashboard → SQL Editor")
    print("3. Paste and run the SQL")
    print("4. Copy the results")
    print("5. Run: python3 scripts/00039-parse-snapshot.py")
    print("6. Paste results when prompted")
    print()
    print("=" * 80)
    print("-- BEGIN SQL TO COPY --")
    print()
    
    # Most critical: RLS Policies (we can't see these from CLI)
    print("-- 1. RLS POLICIES (MOST CRITICAL)")
    print("-- This is what we cannot see from CLI")
    print("SELECT json_build_object(")
    print("    'policies', json_agg(")
    print("        json_build_object(")
    print("            'schemaname', schemaname,")
    print("            'tablename', tablename,")
    print("            'policyname', policyname,")
    print("            'permissive', permissive,")
    print("            'roles', roles,")
    print("            'cmd', cmd,")
    print("            'qual', qual,")
    print("            'with_check', with_check")
    print("        ) ORDER BY tablename, policyname")
    print("    )")
    print(") AS policies_snapshot")
    print("FROM pg_policies")
    print("WHERE schemaname = 'public';")
    print()
    
    # Table structure
    print("-- 2. TABLE STRUCTURE")
    print("SELECT json_build_object(")
    print("    'tables', json_agg(")
    print("        json_build_object(")
    print("            'table_name', table_name,")
    print("            'column_name', column_name,")
    print("            'data_type', data_type,")
    print("            'is_nullable', is_nullable,")
    print("            'column_default', column_default,")
    print("            'character_maximum_length', character_maximum_length")
    print("        ) ORDER BY table_name, ordinal_position")
    print("    )")
    print(") AS tables_snapshot")
    print("FROM information_schema.columns")
    print("WHERE table_schema = 'public'")
    print("ORDER BY table_name, ordinal_position;")
    print()
    
    # Constraints
    print("-- 3. CONSTRAINTS")
    print("SELECT json_build_object(")
    print("    'constraints', json_agg(")
    print("        json_build_object(")
    print("            'table_name', tc.table_name,")
    print("            'constraint_name', tc.constraint_name,")
    print("            'constraint_type', tc.constraint_type,")
    print("            'column_name', kcu.column_name,")
    print("            'foreign_table_name', ccu.table_name,")
    print("            'foreign_column_name', ccu.column_name,")
    print("            'check_clause', cc.check_clause")
    print("        ) ORDER BY tc.table_name, tc.constraint_name")
    print("    )")
    print(") AS constraints_snapshot")
    print("FROM information_schema.table_constraints tc")
    print("LEFT JOIN information_schema.key_column_usage kcu")
    print("    ON tc.constraint_name = kcu.constraint_name")
    print("    AND tc.table_schema = kcu.table_schema")
    print("LEFT JOIN information_schema.constraint_column_usage ccu")
    print("    ON ccu.constraint_name = tc.constraint_name")
    print("    AND ccu.table_schema = tc.table_schema")
    print("LEFT JOIN information_schema.check_constraints cc")
    print("    ON cc.constraint_name = tc.constraint_name")
    print("    AND cc.constraint_schema = tc.table_schema")
    print("WHERE tc.table_schema = 'public'")
    print("ORDER BY tc.table_name, tc.constraint_name;")
    print()
    
    # Indexes
    print("-- 4. INDEXES")
    print("SELECT json_build_object(")
    print("    'indexes', json_agg(")
    print("        json_build_object(")
    print("            'schemaname', schemaname,")
    print("            'tablename', tablename,")
    print("            'indexname', indexname,")
    print("            'indexdef', indexdef")
    print("        ) ORDER BY tablename, indexname")
    print("    )")
    print(") AS indexes_snapshot")
    print("FROM pg_indexes")
    print("WHERE schemaname = 'public'")
    print("ORDER BY tablename, indexname;")
    print()
    
    # Row counts (for verification)
    print("-- 5. ROW COUNTS")
    print("SELECT json_build_object(")
    print("    'row_counts', json_build_object(")
    print("        'profiles', (SELECT COUNT(*) FROM profiles),")
    print("        'teams', (SELECT COUNT(*) FROM teams),")
    print("        'team_members', (SELECT COUNT(*) FROM team_members),")
    print("        'team_join_requests', (SELECT COUNT(*) FROM team_join_requests)")
    print("    )")
    print(") AS counts_snapshot;")
    print()
    
    # RLS Status
    print("-- 6. RLS STATUS PER TABLE")
    print("SELECT json_build_object(")
    print("    'rls_enabled', json_agg(")
    print("        json_build_object(")
    print("            'tablename', tablename,")
    print("            'rowsecurity', rowsecurity,")
    print("            'forcerowsecurity', forcerowsecurity")
    print("        ) ORDER BY tablename")
    print("    )")
    print(") AS rls_status_snapshot")
    print("FROM pg_tables")
    print("WHERE schemaname = 'public';")
    print()
    
    print("-- END SQL TO COPY --")
    print("=" * 80)
    print()
    print("After running these queries:")
    print("1. You'll see 6 result sets")
    print("2. Copy each JSON result")
    print("3. Run: python3 scripts/00039-parse-snapshot.py")
    print("4. Paste all results when prompted")
    print()
    print("This snapshot will provide visibility into:")
    print("- Actual RLS policies (not just guesses)")
    print("- Table structure and constraints")
    print("- What's really in the database")

if __name__ == "__main__":
    generate_snapshot_sql()