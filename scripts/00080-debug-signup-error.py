#!/usr/bin/env python3
"""
Session 00080 - Debug persistent signup error
Purpose: Diagnose why "Database error saving new user" persists after migration
Created: 2025-08-26
"""

import os
from datetime import datetime
from supabase import create_client

# Known credentials
SUPABASE_URL = "https://bbrheacetxlnqbibjwsz.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE"

def check_profile_table_exists():
    """Verify profile table exists and is accessible"""
    client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
    
    print("🔍 Checking profile table existence...")
    print("=" * 50)
    
    # Try different table names
    tables_to_check = ['profile', 'profiles']
    
    for table_name in tables_to_check:
        print(f"\nTesting table: {table_name}")
        try:
            result = client.table(table_name).select('*').limit(0).execute()
            print(f"  ✅ Table '{table_name}' exists and returned empty result")
            return table_name
        except Exception as e:
            error_str = str(e)
            if 'PGRST205' in error_str:
                print(f"  🔒 Table '{table_name}' exists but RLS blocking (PGRST205)")
                return table_name
            elif '42P01' in error_str:
                print(f"  ❌ Table '{table_name}' does not exist (42P01)")
            else:
                print(f"  ⚠️ Unexpected error: {error_str[:100]}")
    
    return None

def test_profile_policies():
    """Test what operations are allowed on profile table"""
    client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
    
    print("\n🔐 Testing profile table policies...")
    print("=" * 50)
    
    # Determine correct table name
    table_name = check_profile_table_exists()
    if not table_name:
        print("❌ CRITICAL: No profile/profiles table found!")
        return
    
    print(f"\nUsing table: {table_name}")
    
    # Test INSERT (should fail for anon)
    print("\n1. Testing INSERT as anonymous:")
    try:
        test_profile = {
            'id': '00000000-0000-0000-0000-000000000001',
            'username': 'test_debug',
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        }
        result = client.table(table_name).insert(test_profile).execute()
        print("  ⚠️ INSERT succeeded (unexpected for anon)")
    except Exception as e:
        if 'new row violates row-level security' in str(e):
            print("  ✅ INSERT blocked by RLS (expected)")
        elif 'null value in column "id"' in str(e):
            print("  ❌ INSERT failed on null ID (table expects ID)")
        else:
            print(f"  🔍 INSERT error: {str(e)[:150]}")

def check_auth_functions():
    """Check if profile creation trigger/function exists"""
    print("\n🔧 Checking auth functions/triggers...")
    print("=" * 50)
    
    print("\nNOTE: We can't directly query functions, but we can infer:")
    print("1. If signup creates auth.users record → auth working")
    print("2. If profile not created → trigger missing/broken")
    print("3. If 'Database error' → likely trigger failing")
    
    print("\nPossible causes of persistent error:")
    print("- ❌ Profile creation trigger missing")
    print("- ❌ Trigger exists but references wrong table (profile vs profiles)")
    print("- ❌ Trigger exists but has permission issues")
    print("- ❌ Function has syntax/logic errors")
    print("- ❌ Function tries to insert with wrong columns")

def check_signup_flow():
    """Analyze the complete signup flow"""
    print("\n📋 Complete Signup Flow Analysis...")
    print("=" * 50)
    
    print("\n1. User submits signup form")
    print("2. Supabase Auth creates user in auth.users ✅")
    print("3. Trigger 'on_auth_user_created' should fire")
    print("4. Trigger function should INSERT into public.profile")
    print("5. If INSERT fails → 'Database error saving new user'")
    
    print("\n🎯 Most likely issue:")
    print("The trigger/function that creates profiles is:")
    print("  a) Missing entirely")
    print("  b) Referencing wrong table name")
    print("  c) Using wrong column names")
    print("  d) Failing due to constraints")
    
    print("\n💡 SOLUTION:")
    print("Need to check/create the profile creation trigger!")

def suggest_fix():
    """Suggest SQL to fix the issue"""
    print("\n🛠️ Suggested Fix...")
    print("=" * 50)
    
    print("\nRun this in Supabase Dashboard SQL Editor:")
    print("""
-- First, check if trigger exists
SELECT * FROM pg_trigger 
WHERE tgname LIKE '%user%' OR tgname LIKE '%profile%';

-- If missing, create the trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profile (id, created_at, updated_at)
  VALUES (new.id, now(), now());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
""")
    
    print("\n⚠️ IMPORTANT: The function must:")
    print("1. Use SECURITY DEFINER to bypass RLS")
    print("2. Reference correct table (profile not profiles)")
    print("3. Include all required columns")

def main():
    print("=" * 60)
    print("SESSION 00080 - Signup Error Diagnosis")
    print(f"Time: {datetime.now().isoformat()}")
    print("=" * 60)
    
    # Run all checks
    check_profile_table_exists()
    test_profile_policies()
    check_auth_functions()
    check_signup_flow()
    suggest_fix()
    
    print("\n" + "=" * 60)
    print("🔍 DIAGNOSIS COMPLETE")
    print("=" * 60)
    print("\nMost likely: Profile creation trigger is missing or broken")
    print("Check the SQL Editor for trigger/function status")
    
    return 0

if __name__ == "__main__":
    exit(main())