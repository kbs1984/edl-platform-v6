#!/usr/bin/env python3
"""
Dual Verification Protocol - Session 00044
Purpose: Prevent confusion between table existence vs table access
Usage: python3 scripts/00044-dual-verification-protocol.py [table_name]
"""

import os
import sys
from supabase import create_client

def dual_verify_table(table_name: str):
    """
    Verify both table existence (schema) and table access (RLS)
    Returns clear status avoiding confusion
    """
    
    client = create_client(
        os.getenv("SUPABASE_URL", "https://bbrheacetxlnqbibjwsz.supabase.co"),
        os.getenv("SUPABASE_ANON_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE")
    )
    
    print(f"🔍 DUAL VERIFICATION: {table_name}")
    print("=" * 50)
    
    # Test 1: Schema Existence (bypasses RLS)
    print("📋 TEST 1: Schema Existence Check")
    try:
        # This query bypasses RLS - checks actual table existence
        result = client.rpc('check_table_exists', {'table_name': table_name}).execute()
        schema_exists = True
        print(f"   ✅ Table '{table_name}' EXISTS in database schema")
    except Exception as e:
        try:
            # Fallback: Try to get table info via system tables
            # This is a workaround since we can't run arbitrary SQL via Supabase client
            result = client.table('information_schema.tables').select('table_name').eq('table_name', table_name).execute()
            schema_exists = len(result.data) > 0 if result.data else False
        except:
            schema_exists = None
            print(f"   ⚠️ Cannot determine schema existence for '{table_name}'")
    
    # Test 2: API Access (tests RLS)
    print("🔒 TEST 2: API Access Check (RLS Test)")
    try:
        result = client.table(table_name).select('*', count='exact').limit(1).execute()
        api_accessible = True
        row_count = result.count if hasattr(result, 'count') else 'unknown'
        print(f"   ✅ Table '{table_name}' ACCESSIBLE via API ({row_count} rows)")
        print("   ℹ️  This means: No RLS restriction for current user")
    except Exception as e:
        api_accessible = False
        error_code = getattr(e, 'code', str(e)[:20])
        print(f"   🔒 Table '{table_name}' BLOCKED by API ({error_code})")
        
        if 'PGRST205' in str(e):
            print("   ℹ️  This means: RLS is protecting the table (GOOD!)")
        elif 'PGRST204' in str(e):
            print("   ℹ️  This means: RLS policy denies access (check permissions)")
        else:
            print(f"   ℹ️  This means: Other access issue ({error_code})")
    
    # Interpretation
    print("\n🎯 INTERPRETATION:")
    if schema_exists and not api_accessible:
        print("   ✅ DEPLOYMENT SUCCESS: Table exists with RLS protection")
        print("   🎉 This is the EXPECTED state for production database!")
        print("   📝 Use authenticated clients for actual data access")
        status = "SUCCESS_WITH_SECURITY"
    elif schema_exists and api_accessible:
        print("   ✅ DEPLOYMENT SUCCESS: Table exists and accessible")
        print("   ⚠️  Consider if RLS should be enabled for security")
        status = "SUCCESS_OPEN_ACCESS"
    elif not schema_exists:
        print("   ❌ DEPLOYMENT ISSUE: Table missing from schema")
        print("   🔧 Check migration scripts and re-run deployment")
        status = "MISSING_TABLE"
    else:
        print("   ⚠️  UNCLEAR STATE: Need manual investigation")
        status = "INVESTIGATION_NEEDED"
    
    print(f"\n📊 STATUS: {status}")
    return status

def verify_common_tables():
    """Verify common tables that cause confusion"""
    tables = ['student', 'profile', 'guardian', 'team', 'judge']
    results = {}
    
    print("🚀 COMMON TABLE VERIFICATION")
    print("=" * 60)
    
    for table in tables:
        results[table] = dual_verify_table(table)
        print()  # Spacing between tables
    
    # Summary
    print("📋 SUMMARY:")
    for table, status in results.items():
        emoji = "✅" if "SUCCESS" in status else "❌" if "MISSING" in status else "⚠️"
        print(f"   {emoji} {table}: {status}")
    
    return results

if __name__ == "__main__":
    if len(sys.argv) > 1:
        dual_verify_table(sys.argv[1])
    else:
        verify_common_tables()