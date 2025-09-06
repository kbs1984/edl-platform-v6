#!/usr/bin/env python3
"""
---
session: "00039"
type: "script"
status: "unknown"
created: "2025-08-28"
title: "00039-debug-profile-creation.py"
purpose: "Script for debug profile creation"
language: "python"
category: "authentication"
topics: ["authentication"]
priority: "P2"
domain: "core"
---
"""
"""
Session 00039: Debug profile creation RLS issue
Tests what's causing the "violates row-level security policy" error
"""

import os
from supabase import create_client

# Get credentials
url = os.environ.get('SUPABASE_URL', 'https://bbrheacetxlnqbibjwsz.supabase.co')
key = os.environ.get('SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE')

client = create_client(url, key)

print("=" * 60)
print("Profile Creation Debug Script (Session 00039)")
print("=" * 60)

# 1. Check if grade_level column exists
print("\n1. Checking profiles table structure...")
try:
    # Try to select grade_level column
    result = client.table('profiles').select('user_id, call_sign, role, grade_level').limit(1).execute()
    print("✅ grade_level column EXISTS")
    if result.data:
        print(f"   Sample row columns: {list(result.data[0].keys())}")
except Exception as e:
    if 'column' in str(e).lower() and 'grade_level' in str(e).lower():
        print("❌ grade_level column MISSING - Run migration 00030_001_add_grade_level.sql")
        print(f"   Error: {e}")
    else:
        print(f"⚠️  Query error: {e}")

# 2. Check RLS policies
print("\n2. Testing RLS policies...")
print("   Note: We can't directly test INSERT without auth")
print("   But we can check if SELECT works for anonymous users")

try:
    # Try to read profiles (should work per "Anyone can view profiles" policy)
    result = client.table('profiles').select('call_sign').limit(5).execute()
    print(f"✅ Can READ profiles: {len(result.data)} rows found")
    
    # Check for TEST_ prefixed call_signs
    test_profiles = [p for p in result.data if p.get('call_sign', '').startswith('TEST_')]
    if test_profiles:
        print(f"   Found {len(test_profiles)} TEST_ profiles")
        for p in test_profiles[:3]:
            print(f"   - {p.get('call_sign')}")
except Exception as e:
    print(f"❌ Cannot read profiles: {e}")

# 3. Migration recommendations
print("\n3. Migration Status Check...")
print("   Required migrations:")
print("   ✓ 00012_001_teams_first_v2.sql (base tables)")
print("   ✓ 00015_* (fixes)")
print("   ? 00030_001_add_grade_level.sql (adds grade_level column)")
print("   ? 00039_fix_profile_insert_policy.sql (fixes INSERT policy)")

# 4. Manual SQL to run in Supabase Dashboard
print("\n4. To fix in Supabase SQL Editor, run:")
print("-" * 50)
print("""
-- First, check if grade_level exists
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'grade_level';

-- If missing, add it:
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS grade_level INTEGER 
CHECK (grade_level >= 4 AND grade_level <= 12);

-- Check current RLS policies
SELECT policyname, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- Fix INSERT policy if needed
DROP POLICY IF EXISTS "Users create own profile" ON profiles;

CREATE POLICY "Users create own profile" ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
""")
print("-" * 50)

# 5. Test data recommendation
print("\n5. Testing Recommendation:")
print("   When testing, use call_signs with TEST_ prefix:")
print("   - TEST_PIONEER")
print("   - TEST_EXPLORER")
print("   - TEST_CHAMPION")
print("   These can be safely deleted later with:")
print("   DELETE FROM profiles WHERE call_sign LIKE 'TEST_%';")

print("\n" + "=" * 60)
print("Debug complete. Check Supabase Dashboard SQL Editor for fixes.")
print("=" * 60)