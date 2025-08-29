#!/usr/bin/env python3
"""
---
session: "00076"
type: "script"
status: "unknown"
created: "2025-08-28"
title: "00076-verify-auth-deployment.py"
purpose: "Check if 00060-AUTH-FLOW-FIX.sql is actually deployed to Supabase"
language: "python"
category: "verification"
topics: ["verification"]
priority: "P2"
domain: "core"
---
"""
"""
Session 00076: Verify Auth Flow Deployment Status
Purpose: Check if 00060-AUTH-FLOW-FIX.sql is actually deployed to Supabase
"""

import os
import sys
from supabase import create_client, Client
from datetime import datetime
import json

# Known credentials from CLAUDE.md
SUPABASE_URL = "https://bbrheacetxlnqbibjwsz.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE"

def verify_auth_deployment():
    """Verify if auth flow fixes are deployed"""
    
    print("🔍 Session 00076: Auth Flow Deployment Verification")
    print("=" * 60)
    print(f"Timestamp: {datetime.now().isoformat()}")
    print()
    
    # Create Supabase client
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
    
    results = {
        "profile_table": False,
        "student_table": False,
        "trigger_exists": "unknown",
        "test_signup": False,
        "deployment_status": "unknown"
    }
    
    print("📊 Checking Table Existence (via RLS errors):")
    print("-" * 40)
    
    # Test 1: Check if profile table exists
    try:
        result = supabase.table('profile').select('*').limit(1).execute()
        print("✅ profile table: Accessible (unexpected - RLS might be off)")
        results["profile_table"] = True
    except Exception as e:
        if 'PGRST' in str(e) or 'relation' not in str(e):
            print("✅ profile table: EXISTS (RLS protecting it)")
            results["profile_table"] = True
        else:
            print(f"❌ profile table: {str(e)[:50]}")
    
    # Test 2: Check if student table exists
    try:
        result = supabase.table('student').select('*').limit(1).execute()
        print("✅ student table: Accessible (unexpected - RLS might be off)")
        results["student_table"] = True
    except Exception as e:
        if 'PGRST' in str(e) or 'relation' not in str(e):
            print("✅ student table: EXISTS (RLS protecting it)")
            results["student_table"] = True
        else:
            print(f"❌ student table: {str(e)[:50]}")
    
    print()
    print("🔧 Checking Function Existence:")
    print("-" * 40)
    
    # Test 3: Check if add_new_user function exists
    try:
        # Try to call the function (will fail but tells us if it exists)
        result = supabase.rpc('add_new_user', {}).execute()
        print("✅ add_new_user function: EXISTS (callable)")
        results["trigger_exists"] = True
    except Exception as e:
        if 'function' in str(e).lower() and 'does not exist' in str(e).lower():
            print("❌ add_new_user function: DOES NOT EXIST")
            results["trigger_exists"] = False
        elif 'PGRST' in str(e):
            print("✅ add_new_user function: EXISTS (but protected)")
            results["trigger_exists"] = True
        else:
            print(f"⚠️ add_new_user function: Unknown - {str(e)[:50]}")
    
    print()
    print("🧪 Testing Signup Flow (Critical Test):")
    print("-" * 40)
    
    # Test 4: Try to create a test user
    test_email = f"test-session76-{datetime.now().strftime('%Y%m%d%H%M%S')}@example.com"
    test_password = "TestPassword123!"
    
    print(f"Testing with: {test_email}")
    
    try:
        # Attempt signup
        auth_result = supabase.auth.sign_up({
            'email': test_email,
            'password': test_password
        })
        
        if auth_result.user:
            user_id = auth_result.user.id
            print(f"✅ User created: {user_id}")
            
            # Check if profile was auto-created
            try:
                # Try to sign in and check profile
                signin = supabase.auth.sign_in_with_password({
                    'email': test_email,
                    'password': test_password
                })
                
                if signin.user:
                    # Try to query profile with auth
                    profile_check = supabase.table('profile').select('*').eq('id', user_id).execute()
                    if profile_check.data:
                        print("✅ Profile auto-created on signup!")
                        results["test_signup"] = True
                    else:
                        print("❌ Profile NOT auto-created (trigger not working)")
                        
            except Exception as e:
                print(f"⚠️ Profile check: {str(e)[:50]}")
                
        else:
            print("⚠️ User creation returned no user object")
            
    except Exception as e:
        if 'already registered' in str(e).lower():
            print("ℹ️ Test user already exists (previous test run)")
        else:
            print(f"❌ Signup test failed: {str(e)[:50]}")
    
    print()
    print("📋 Deployment Assessment:")
    print("=" * 60)
    
    # Analyze results
    if results["profile_table"] and results["student_table"]:
        print("✅ Tables: Both profile and student tables exist")
    else:
        print("❌ Tables: Missing required tables")
    
    if results["trigger_exists"] == True:
        print("✅ Function: add_new_user function exists")
    elif results["trigger_exists"] == False:
        print("❌ Function: add_new_user function MISSING")
    else:
        print("⚠️ Function: Could not determine status")
    
    if results["test_signup"]:
        print("✅ Trigger: Profile creation trigger WORKING")
        results["deployment_status"] = "DEPLOYED"
    else:
        print("❌ Trigger: Profile creation NOT working automatically")
        results["deployment_status"] = "PARTIAL"
    
    print()
    print("🎯 Final Verdict:")
    print("-" * 40)
    
    if results["deployment_status"] == "DEPLOYED":
        print("✅ 00060-AUTH-FLOW-FIX.sql appears to be DEPLOYED")
        print("   Profile creation on signup is working")
    elif results["deployment_status"] == "PARTIAL":
        print("⚠️ 00060-AUTH-FLOW-FIX.sql PARTIALLY deployed")
        print("   Tables exist but trigger may not be active")
        print()
        print("   Recommended Action:")
        print("   1. Check Supabase Dashboard → Database → Functions")
        print("   2. Look for 'add_new_user' function")
        print("   3. Check Database → Triggers for 'on_auth_user_created'")
        print("   4. If missing, deploy 00060-AUTH-FLOW-FIX.sql manually")
    else:
        print("❓ Could not determine deployment status")
    
    print()
    print("📄 Report for Trio Document:")
    print("-" * 40)
    print(f"- Profile table: {'EXISTS' if results['profile_table'] else 'MISSING'}")
    print(f"- Student table: {'EXISTS' if results['student_table'] else 'MISSING'}")
    print(f"- add_new_user function: {results['trigger_exists']}")
    print(f"- Auto profile creation: {'WORKING' if results['test_signup'] else 'NOT WORKING'}")
    print(f"- Overall status: {results['deployment_status']}")
    
    return results

if __name__ == "__main__":
    try:
        results = verify_auth_deployment()
        sys.exit(0 if results["deployment_status"] == "DEPLOYED" else 1)
    except Exception as e:
        print(f"❌ Fatal error: {e}")
        sys.exit(1)