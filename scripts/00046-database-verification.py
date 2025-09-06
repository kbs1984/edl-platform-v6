#!/usr/bin/env python3
"""
Session 00046 - Database Verification Suite
Purpose: Comprehensive verification of emdash database adoption
Created: 2025-08-21
"""

import os
import json
import sys
from datetime import datetime
from supabase import create_client

# Known credentials (PUBLIC - not secret)
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://bbrheacetxlnqbibjwsz.supabase.co")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE")

def verify_deployment():
    """Comprehensive post-deployment checks"""
    
    print("=" * 60)
    print("🔍 SESSION 00046 - DATABASE VERIFICATION SUITE")
    print("=" * 60)
    print(f"Timestamp: {datetime.now().isoformat()}")
    print(f"Supabase URL: {SUPABASE_URL}")
    print()
    
    # Initialize client
    try:
        client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
        print("✅ Connected to Supabase")
    except Exception as e:
        print(f"❌ Failed to connect: {e}")
        return {"success": False, "error": str(e)}
    
    results = {
        "timestamp": datetime.now().isoformat(),
        "checks": {},
        "health_score": 0,
        "success": True
    }
    
    # Check 1: Table Count by Schema
    print("\n📊 CHECK 1: Table Count by Schema")
    print("-" * 40)
    
    expected_schemas = {
        'public': ['profile', 'student', 'judge', 'guardian', 'team', 
                  'team_member', 'school', 'tournament', 'round'],
        'debate': ['debate', 'debate_participant', 'ballot', 'score', 
                  'feedback', 'result'],
        'chat': ['channel', 'message', 'reaction']
    }
    
    schema_health = 0
    for schema, expected_tables in expected_schemas.items():
        print(f"\n  Schema: {schema}")
        found_tables = []
        missing_tables = []
        
        for table in expected_tables:
            try:
                # Try to query the table
                result = client.table(table).select('*', count='exact').execute()
                found_tables.append(table)
                print(f"    ✅ {table}: EXISTS ({result.count} rows)")
            except Exception as e:
                if 'does not exist' in str(e) or 'not found' in str(e).lower():
                    missing_tables.append(table)
                    print(f"    ❌ {table}: MISSING")
                else:
                    print(f"    ⚠️ {table}: ERROR - {str(e)[:50]}")
        
        results["checks"][f"{schema}_tables"] = {
            "found": found_tables,
            "missing": missing_tables,
            "total_expected": len(expected_tables),
            "total_found": len(found_tables)
        }
        
        if len(found_tables) >= len(expected_tables) * 0.8:  # 80% threshold
            schema_health += 25
    
    # Check 2: Critical call_sign Column
    print("\n🎯 CHECK 2: call_sign Column (EDL Critical)")
    print("-" * 40)
    
    try:
        # Try to select call_sign column
        result = client.table('student').select('call_sign').limit(1).execute()
        print("  ✅ student.call_sign column EXISTS")
        results["checks"]["call_sign_column"] = True
        schema_health += 25
    except Exception as e:
        if 'column' in str(e).lower() and 'does not exist' in str(e).lower():
            print("  ❌ student.call_sign column MISSING - CRITICAL!")
            print("  ⚠️  Session 44 must add this column!")
            results["checks"]["call_sign_column"] = False
        elif 'relation' in str(e).lower() and 'does not exist' in str(e).lower():
            print("  ❌ student table does not exist - CRITICAL!")
            results["checks"]["call_sign_column"] = False
        else:
            print(f"  ⚠️ Unexpected error: {str(e)[:100]}")
            results["checks"]["call_sign_column"] = "error"
    
    # Check 3: RLS Status
    print("\n🔒 CHECK 3: Row Level Security (RLS)")
    print("-" * 40)
    
    rls_tables = ['profile', 'student', 'judge', 'guardian', 'team']
    rls_enabled = []
    rls_disabled = []
    
    for table in rls_tables:
        # We can't directly check RLS status via Supabase client
        # But we can test if the table allows anonymous reads
        try:
            result = client.table(table).select('*').limit(1).execute()
            # If we can read without auth, RLS might be disabled or have open policies
            print(f"  ⚠️ {table}: Can read (check RLS policies)")
            rls_disabled.append(table)
        except Exception as e:
            if 'permission' in str(e).lower() or 'policy' in str(e).lower():
                print(f"  ✅ {table}: RLS active (blocked read)")
                rls_enabled.append(table)
            elif 'does not exist' in str(e):
                print(f"  ❌ {table}: Table missing")
            else:
                print(f"  ⚠️ {table}: {str(e)[:50]}")
    
    results["checks"]["rls_status"] = {
        "enabled": rls_enabled,
        "disabled_or_open": rls_disabled
    }
    
    if len(rls_enabled) >= 3:  # At least 3 tables have RLS
        schema_health += 25
    
    # Check 4: Database Functions and Triggers
    print("\n⚡ CHECK 4: Functions and Triggers")
    print("-" * 40)
    
    critical_functions = [
        'handle_new_user',  # Creates profile on signup
        'update_updated_at_column',  # Timestamp trigger
    ]
    
    # We can't directly query functions, but we can test basic operations
    print("  ℹ️ Functions must be verified in Supabase Dashboard")
    print("  Expected functions:")
    for func in critical_functions:
        print(f"    - {func}")
    
    # Check 5: Overall Health Assessment
    print("\n💚 HEALTH ASSESSMENT")
    print("-" * 40)
    
    # Calculate final health score
    results["health_score"] = min(schema_health, 100)
    
    if results["health_score"] >= 75:
        print(f"  ✅ Database Health: {results['health_score']}% - READY FOR PRODUCTION")
        results["status"] = "healthy"
    elif results["health_score"] >= 50:
        print(f"  ⚠️ Database Health: {results['health_score']}% - NEEDS ATTENTION")
        results["status"] = "warning"
    else:
        print(f"  ❌ Database Health: {results['health_score']}% - CRITICAL ISSUES")
        results["status"] = "critical"
    
    # Summary
    print("\n📋 SUMMARY")
    print("-" * 40)
    
    total_tables_found = sum(
        len(check.get("found", [])) 
        for check in results["checks"].values() 
        if isinstance(check, dict) and "found" in check
    )
    
    print(f"  Tables Found: {total_tables_found}")
    print(f"  call_sign Column: {'✅ EXISTS' if results['checks'].get('call_sign_column') else '❌ MISSING'}")
    print(f"  RLS Tables: {len(results['checks'].get('rls_status', {}).get('enabled', []))} protected")
    print(f"  Health Score: {results['health_score']}%")
    
    # Save results
    output_file = f"reconciliation/deployment-records/00046-verification-{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n📁 Results saved to: {output_file}")
    
    return results

def quick_check():
    """Quick check for Session 44 to verify basics"""
    print("\n🚀 QUICK CHECK FOR SESSION 44")
    print("=" * 40)
    
    client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
    
    # Just the essentials
    checks = {
        "profiles_table": False,
        "student_table": False,
        "call_sign_column": False,
        "table_count": 0
    }
    
    # Count tables
    all_tables = ['profile', 'student', 'judge', 'guardian', 'team', 
                  'team_member', 'school', 'tournament', 'round',
                  'debate', 'ballot', 'score', 'feedback', 'result',
                  'channel', 'message', 'reaction']
    
    for table in all_tables:
        try:
            client.table(table).select('*', count='exact').execute()
            checks["table_count"] += 1
            if table == "profile":
                checks["profiles_table"] = True
            elif table == "student":
                checks["student_table"] = True
        except:
            pass
    
    # Check call_sign
    try:
        client.table('student').select('call_sign').limit(1).execute()
        checks["call_sign_column"] = True
    except:
        pass
    
    print(f"  Tables Found: {checks['table_count']}/36")
    print(f"  Profile Table: {'✅' if checks['profiles_table'] else '❌'}")
    print(f"  Student Table: {'✅' if checks['student_table'] else '❌'}")
    print(f"  call_sign Column: {'✅' if checks['call_sign_column'] else '❌'}")
    
    if checks["table_count"] >= 30 and checks["call_sign_column"]:
        print("\n  🎉 DEPLOYMENT SUCCESSFUL!")
    else:
        print("\n  ⚠️ DEPLOYMENT INCOMPLETE")
    
    return checks

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--quick":
        quick_check()
    else:
        verify_deployment()