#!/usr/bin/env python3
"""
Session 00040: Verify current RLS policies after fixes
Tests if profile creation works with current policies
"""

import os
from supabase import create_client, Client
from datetime import datetime
import json
import uuid

# Initialize Supabase client
url = os.environ.get("SUPABASE_URL", "https://bbrheacetxlnqbibjwsz.supabase.co")
key = os.environ.get("SUPABASE_ANON_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE")

supabase: Client = create_client(url, key)

def test_auth_and_profile_creation():
    """Test complete auth and profile creation flow"""
    
    print("=" * 60)
    print("RLS POLICY VERIFICATION - Session 00040")
    print("=" * 60)
    print()
    
    # Step 1: Test authentication
    print("Step 1: Testing authentication...")
    # Use gmail.com as it's commonly accepted
    timestamp = datetime.now().strftime('%H%M%S')
    test_email = f"edltest{timestamp}@gmail.com"
    test_password = "TestPassword123!"
    
    try:
        # Sign up a test user
        auth_response = supabase.auth.sign_up({
            "email": test_email,
            "password": test_password
        })
        
        if auth_response.user:
            print(f"✅ User created: {auth_response.user.email}")
            print(f"   User ID: {auth_response.user.id}")
            user_id = auth_response.user.id
        else:
            print("❌ Failed to create user")
            return
            
    except Exception as e:
        print(f"❌ Auth error: {str(e)}")
        return
    
    # Step 2: Test profile creation
    print("\nStep 2: Testing profile creation...")
    test_call_sign = f"TEST_{datetime.now().strftime('%H%M%S')}"
    
    try:
        profile_data = {
            "user_id": user_id,
            "call_sign": test_call_sign,
            "role": "player",
            "grade_level": 7
        }
        
        result = supabase.table('profiles').insert(profile_data).execute()
        
        if result.data:
            print(f"✅ Profile created successfully!")
            print(f"   Call Sign: {result.data[0]['call_sign']}")
            print(f"   Role: {result.data[0]['role']}")
            print(f"   Grade Level: {result.data[0]['grade_level']}")
            print("\n🎉 RLS POLICIES ARE WORKING!")
        else:
            print("❌ Profile creation returned no data")
            
    except Exception as e:
        error_msg = str(e)
        if "row-level security" in error_msg.lower():
            print(f"❌ RLS POLICY ERROR: Profile creation blocked")
            print(f"   Error: {error_msg}")
            print("\n⚠️  RLS policies need fixing. Run this SQL in Supabase:")
            print("""
            DROP POLICY IF EXISTS "Users create own profile" ON profiles;
            CREATE POLICY "Users create own profile" ON profiles
              FOR INSERT TO authenticated
              WITH CHECK (auth.uid() = user_id);
            """)
        else:
            print(f"❌ Profile creation error: {error_msg}")
    
    # Step 3: Test profile retrieval
    print("\nStep 3: Testing profile retrieval...")
    try:
        profile = supabase.table('profiles').select("*").eq('user_id', user_id).execute()
        
        if profile.data:
            print(f"✅ Profile retrieved successfully!")
            print(f"   Data: {json.dumps(profile.data[0], indent=2)}")
        else:
            print("❌ Could not retrieve profile")
            
    except Exception as e:
        print(f"❌ Retrieval error: {str(e)}")
    
    # Step 4: Test profile update
    print("\nStep 4: Testing profile update...")
    try:
        update_result = supabase.table('profiles').update({
            "grade_level": 8
        }).eq('user_id', user_id).execute()
        
        if update_result.data:
            print(f"✅ Profile updated successfully!")
            print(f"   New grade level: {update_result.data[0]['grade_level']}")
        else:
            print("❌ Could not update profile")
            
    except Exception as e:
        print(f"❌ Update error: {str(e)}")
    
    # Step 5: Check all profiles to verify data persistence
    print("\nStep 5: Checking all test profiles...")
    try:
        all_profiles = supabase.table('profiles').select("call_sign, role, grade_level, created_at").like('call_sign', 'TEST_%').execute()
        
        if all_profiles.data:
            print(f"✅ Found {len(all_profiles.data)} test profiles in database:")
            for p in all_profiles.data[-3:]:  # Show last 3
                print(f"   - {p['call_sign']} ({p['role']}, grade {p['grade_level']})")
        else:
            print("ℹ️  No test profiles found")
            
    except Exception as e:
        print(f"❌ Query error: {str(e)}")
    
    print("\n" + "=" * 60)
    print("VERIFICATION COMPLETE")
    print("=" * 60)

if __name__ == "__main__":
    test_auth_and_profile_creation()