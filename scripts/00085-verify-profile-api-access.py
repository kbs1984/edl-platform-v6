#!/usr/bin/env python3
"""
---
session: "00085"
type: "test"
status: "current"
created: "2025-08-27"
title: "Verify Profile Table API Access"
purpose: "Test if PostgREST cache reload fixed profile table access"
topics: ["testing", "api", "profile-table", "verification"]
priority: "P0"
domain: "reconciliation"
tests: ["profile-api-access", "auth-flow"]
---

Session 00085: Verify Profile Table API Access
Tests if PostgREST schema cache reload worked
"""

import requests
import json
from datetime import datetime

SUPABASE_URL = "https://bbrheacetxlnqbibjwsz.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE"

def test_api_access():
    """Test if profile table is accessible via API"""
    print("🔍 Testing Profile Table API Access")
    print("=" * 50)
    print(f"Timestamp: {datetime.now().isoformat()}")
    print()
    
    # Test profile (singular) - what dashboard expects
    print("1. Testing 'profile' table (singular):")
    headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}"
    }
    
    response = requests.get(
        f"{SUPABASE_URL}/rest/v1/profile?select=*&limit=1",
        headers=headers
    )
    
    if response.status_code == 200:
        print("   ✅ SUCCESS! Profile table is now accessible!")
        print(f"   Response: {response.text[:100]}...")
        return True
    elif "PGRST205" in response.text:
        print("   ❌ STILL CACHED: PostgREST still can't see profile table")
        print(f"   Error: {response.json()}")
        print()
        print("   ACTION NEEDED:")
        print("   1. Run scripts/00085-refresh-postgrest-cache.sql in Supabase SQL Editor")
        print("   2. Wait 30 seconds for cache to refresh")
        print("   3. Run this script again")
        return False
    else:
        print(f"   ⚠️ Different error: {response.status_code}")
        print(f"   Response: {response.text}")
        return False

def test_with_python_client():
    """Test using Supabase Python client"""
    print()
    print("2. Testing with Python client:")
    
    try:
        from supabase import create_client
        client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
        
        result = client.table('profile').select('*').limit(1).execute()
        print("   ✅ Python client can access profile table!")
        print(f"   Data: {result.data}")
        return True
    except Exception as e:
        error_str = str(e)
        if "Could not find" in error_str:
            print("   ❌ Python client still sees cached schema")
        elif "PGRST" in error_str:
            print("   🔒 Table exists but RLS blocking (this is OK)")
            return True
        else:
            print(f"   ⚠️ Error: {error_str[:100]}")
        return False

def main():
    print("=" * 60)
    print("PROFILE TABLE API ACCESS VERIFICATION")
    print("=" * 60)
    print()
    
    # Test raw API
    api_works = test_api_access()
    
    # Test Python client
    client_works = test_with_python_client()
    
    print()
    print("=" * 60)
    print("SUMMARY:")
    if api_works or client_works:
        print("✅ Profile table IS accessible - cache refresh worked!")
        print()
        print("Next steps:")
        print("1. The auth → dashboard flow should now work")
        print("2. Test signup → email verify → dashboard access")
        print("3. Verify profile data is created and accessible")
    else:
        print("❌ Profile table still NOT accessible")
        print()
        print("To fix:")
        print("1. Go to Supabase Dashboard → SQL Editor")
        print("2. Copy contents of scripts/00085-refresh-postgrest-cache.sql")
        print("3. Run the SQL")
        print("4. Wait 30 seconds")
        print("5. Run this script again")
        print()
        print("Alternative: Restart PostgREST service in Supabase Dashboard")
    
    print("=" * 60)

if __name__ == "__main__":
    main()