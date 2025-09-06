#!/usr/bin/env python3
"""
Session 00076: Reconcile Auth Reality
Purpose: Understand the TRUE state of auth by testing actual behavior, not assumptions
"""

import os
import sys
from supabase import create_client, Client
from datetime import datetime
import json
import random

# Known credentials
SUPABASE_URL = "https://bbrheacetxlnqbibjwsz.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE"

def reconcile_auth_reality():
    """Test actual auth behavior, not theoretical function existence"""
    
    print("🔄 Session 00076: Auth Reality Reconciliation")
    print("=" * 60)
    print(f"Timestamp: {datetime.now().isoformat()}")
    print()
    
    print("📊 Current Evidence from Brian's Query:")
    print("-" * 40)
    print("✅ 5 users exist with profiles AND students")
    print("✅ All IDs match across tables (auth.users = profile = student)")
    print("✅ All have division 'UPPER' and level 0")
    print()
    
    # Create Supabase client
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
    
    print("🧪 Testing NEW User Creation (The Real Test):")
    print("-" * 40)
    
    # Generate unique test email
    random_num = random.randint(10000, 99999)
    test_email = f"reconcile-{random_num}@example.com"
    test_password = "TestPassword123!"
    
    print(f"Creating new user: {test_email}")
    
    try:
        # Attempt signup
        auth_result = supabase.auth.sign_up({
            'email': test_email,
            'password': test_password,
            'options': {
                'data': {
                    'test_session': '00076',
                    'purpose': 'reconciliation'
                }
            }
        })
        
        if auth_result and auth_result.user:
            user_id = auth_result.user.id
            print(f"✅ User created successfully: {user_id}")
            print(f"   Email confirmed: {auth_result.user.email_confirmed_at is not None}")
            
            # The REAL reconciliation question
            print()
            print("🔍 The Reconciliation Questions:")
            print("-" * 40)
            print("1. Did profile get created automatically? (Check Dashboard)")
            print("2. Did student record get created? (Check Dashboard)")
            print("3. Can user access dashboard after email confirmation?")
            print()
            print("📋 Manual Verification Needed:")
            print(f"SELECT * FROM auth.users WHERE email = '{test_email}';")
            print(f"SELECT * FROM profile WHERE id = '{user_id}';")
            print(f"SELECT * FROM student WHERE user_id = '{user_id}';")
            
            return True
            
        else:
            print("⚠️ Signup returned no user - possible email already exists")
            return False
            
    except Exception as e:
        error_str = str(e)
        print(f"❌ Signup failed: {error_str}")
        
        # Analyze the error
        if 'already registered' in error_str.lower():
            print("   → User already exists")
        elif 'database error' in error_str.lower():
            print("   → Database constraint or trigger issue")
        elif 'rate limit' in error_str.lower():
            print("   → Too many attempts, wait and retry")
        else:
            print(f"   → Unknown error type")
        
        return False
    
    print()
    print("🎯 Reconciliation Strategy:")
    print("=" * 60)
    print()
    print("FACT 1: Existing users HAVE profiles/students (proven by data)")
    print("FACT 2: New signups might still fail (needs testing)")
    print()
    print("RECONCILIATION APPROACH:")
    print("1. Stop relying on function detection (it's misleading)")
    print("2. Test with ACTUAL signups and check results")
    print("3. Trust DATA over detection scripts")
    print("4. If new users work → Auth is FULLY functional")
    print("5. If new users fail → Need to debug the specific failure")
    print()
    print("THE TRUTH:")
    print("- Auth WAS working (5 users prove it)")
    print("- Brian just re-ran 00060 fix (might have fixed any gap)")
    print("- Only way to know: Create user and check Dashboard")

if __name__ == "__main__":
    try:
        success = reconcile_auth_reality()
        print()
        print("✅ Reconciliation complete - check Dashboard for results")
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"❌ Fatal error: {e}")
        sys.exit(1)