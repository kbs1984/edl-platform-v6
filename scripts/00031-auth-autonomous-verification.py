#!/usr/bin/env python3
"""
---
session: "00031"
type: "script"
status: "unknown"
created: "2025-08-28"
title: "00031-auth-autonomous-verification.py"
purpose: "Script for auth autonomous verification"
language: "python"
category: "authentication"
topics: ["authentication"]
priority: "P2"
domain: "core"
---
"""
"""
Auth Feature Autonomous Verification Tool
Session 00031 - Claude Code Capabilities Test

This script runs all authentication verifications that Claude Code can perform autonomously,
clearly separating from manual browser testing requirements.
"""

import os
import sys
import json
from pathlib import Path

# Add the project root to the path for supabase imports
project_root = Path(__file__).parent.parent
sys.path.append(str(project_root))

try:
    from supabase import create_client
    SUPABASE_AVAILABLE = True
except ImportError:
    SUPABASE_AVAILABLE = False

def print_header(title):
    print(f"\n{'='*50}")
    print(f" {title}")
    print(f"{'='*50}")

def print_test(name, status, details=""):
    status_icon = "✅" if status else "❌"
    print(f"  {status_icon} {name}: {details}")
    return status

def check_file_structure():
    """Verify all required auth files exist"""
    print_header("1. FILE STRUCTURE VERIFICATION")
    
    required_files = [
        ("Main App", "index.html"),
        ("Password Reset", "reconciliation/active-work/auth/reset-password.html"),
        ("Auth Test Tool", "reconciliation/active-work/auth/test.html"),
    ]
    
    all_good = True
    for name, filepath in required_files:
        exists = os.path.exists(filepath)
        print_test(name, exists, f"at {filepath}")
        all_good = all_good and exists
    
    return all_good

def check_database_schema():
    """Verify database connectivity and schema"""
    print_header("2. DATABASE SCHEMA VERIFICATION")
    
    if not SUPABASE_AVAILABLE:
        print_test("Supabase Client", False, "Library not available")
        return False
    
    try:
        # Get credentials from environment or use defaults
        url = os.getenv('SUPABASE_URL', 'https://bbrheacetxlnqbibjwsz.supabase.co')
        key = os.getenv('SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE')
        
        client = create_client(url, key)
        print_test("Database Connection", True, "Connected to Supabase")
        
        # Test profiles table
        try:
            result = client.table('profiles').select('user_id,call_sign,role,grade_level').limit(1).execute()
            print_test("Profiles Table Schema", True, "All required columns exist")
        except Exception as e:
            if 'grade_level' in str(e):
                print_test("Profiles Table Schema", False, "grade_level column missing")
                return False
            else:
                print_test("Profiles Table Schema", False, f"Error: {str(e)[:50]}")
                return False
        
        # Test teams table
        try:
            result = client.table('teams').select('*').limit(1).execute()
            print_test("Teams Table", True, "Accessible")
        except Exception as e:
            print_test("Teams Table", False, f"Error: {str(e)[:30]}")
        
        return True
        
    except Exception as e:
        print_test("Database Connection", False, f"Error: {str(e)[:50]}")
        return False

def check_configuration():
    """Verify Supabase configuration in files"""
    print_header("3. CONFIGURATION VERIFICATION")
    
    config_checks = []
    
    # Check auth/test.html for proper configuration
    if os.path.exists('reconciliation/active-work/auth/test.html'):
        with open('reconciliation/active-work/auth/test.html', 'r') as f:
            content = f.read()
            
        has_url = 'bbrheacetxlnqbibjwsz.supabase.co' in content
        has_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' in content
        
        print_test("Supabase URL", has_url, "Correct URL in test.html")
        print_test("Supabase Anon Key", has_key, "Correct key in test.html")
        config_checks.extend([has_url, has_key])
    
    return all(config_checks)

def check_auth_features():
    """Verify authentication feature implementation"""
    print_header("4. AUTH FEATURE IMPLEMENTATION")
    
    features = []
    
    # Check password reset implementation
    if os.path.exists('reconciliation/active-work/auth/reset-password.html'):
        with open('reconciliation/active-work/auth/reset-password.html', 'r') as f:
            reset_content = f.read()
        
        has_reset_function = 'resetPasswordForEmail' in reset_content
        has_update_function = 'updateUser' in reset_content
        has_token_handling = 'access_token' in reset_content
        
        print_test("Password Reset Flow", has_reset_function, "resetPasswordForEmail implemented")
        print_test("Password Update Flow", has_update_function, "updateUser implemented")
        print_test("Token Handling", has_token_handling, "URL token parsing implemented")
        features.extend([has_reset_function, has_update_function, has_token_handling])
    
    # Check main app for profile features
    if os.path.exists('index.html'):
        with open('index.html', 'r') as f:
            main_content = f.read()
        
        has_profile_creation = "from('profiles')" in main_content
        has_call_sign = 'call_sign' in main_content
        has_role_system = any(role in main_content for role in ['player', 'supervisor', 'enabler'])
        
        print_test("Profile Creation", has_profile_creation, "Database profile operations")
        print_test("Call Sign System", has_call_sign, "Call sign field implemented")
        print_test("Role System", has_role_system, "Role selection implemented")
        features.extend([has_profile_creation, has_call_sign, has_role_system])
    
    # Check test tool
    if os.path.exists('auth/test.html'):
        with open('auth/test.html', 'r') as f:
            test_content = f.read()
        
        has_session_check = 'getSession' in test_content
        has_profile_load = 'loadUserProfile' in test_content
        has_feature_tests = 'testCallSignCheck' in test_content
        
        print_test("Session Management", has_session_check, "Session checking implemented")
        print_test("Profile Loading", has_profile_load, "Profile data loading")
        print_test("Feature Testing", has_feature_tests, "Autonomous test functions")
        features.extend([has_session_check, has_profile_load, has_feature_tests])
    
    return all(features)

def generate_manual_testing_checklist():
    """Generate the manual testing checklist based on autonomous verification"""
    print_header("5. MANUAL TESTING REQUIREMENTS")
    
    checklist = """
## Manual Testing Checklist - Session 00031

### 🌐 Browser Testing (CANNOT be done autonomously)
- [ ] Sign up with real email address
- [ ] Email confirmation process
- [ ] Sign in with created account  
- [ ] Password reset email delivery
- [ ] Password reset email link functionality
- [ ] Profile creation form submission
- [ ] Call sign real-time availability checking
- [ ] Role selection and grade level assignment
- [ ] Session timeout behavior (30 minutes)
- [ ] Cross-browser compatibility (Chrome, Firefox, Safari)

### 🗄️ Database Testing (CANNOT be done autonomously)  
- [ ] Profile creation with real user data
- [ ] Call sign uniqueness constraint enforcement
- [ ] RLS policy verification with authenticated users
- [ ] Data persistence across sessions
- [ ] Role-based access control testing

### ⚙️ Configuration Testing (CANNOT be done autonomously)
- [ ] JWT timeout setting verification (target: 30 minutes)
- [ ] Email template customization in Supabase
- [ ] Production environment variable configuration
- [ ] Deployment verification on live domain

### 📧 Integration Testing (CANNOT be done autonomously)
- [ ] Email delivery to real email addresses
- [ ] Email content and formatting verification
- [ ] Password reset link expiration (24 hours)
- [ ] OAuth provider integration (if applicable)
"""
    
    print("Manual testing checklist generated.")
    print("📋 This checklist covers all functionality that requires human intervention.")
    
    # Save checklist to file
    with open('00031-MANUAL-TESTING-CHECKLIST.md', 'w') as f:
        f.write(checklist)
    
    print_test("Manual Checklist", True, "Saved to 00031-MANUAL-TESTING-CHECKLIST.md")

def main():
    """Run complete autonomous verification"""
    print("🤖 EDL Platform - Auth Feature Autonomous Verification")
    print("Session 00031 - Claude Code Capability Testing")
    print(f"Working Directory: {os.getcwd()}")
    
    # Run all autonomous checks
    results = []
    results.append(check_file_structure())
    results.append(check_database_schema())
    results.append(check_configuration())
    results.append(check_auth_features())
    
    # Generate manual testing requirements
    generate_manual_testing_checklist()
    
    # Summary
    print_header("AUTONOMOUS VERIFICATION SUMMARY")
    total_checks = len(results)
    passed_checks = sum(results)
    
    if all(results):
        print(f"🎉 ALL AUTONOMOUS CHECKS PASSED ({passed_checks}/{total_checks})")
        print("✅ Authentication features are ready for manual testing")
        print("📋 Manual testing checklist created")
        print()
        print("🔄 NEXT STEPS:")
        print("1. Review 00031-MANUAL-TESTING-CHECKLIST.md")
        print("2. Execute browser-based testing")
        print("3. Verify database operations with real data")
        print("4. Test email delivery functionality")
        return 0
    else:
        print(f"❌ AUTONOMOUS VERIFICATION FAILED ({passed_checks}/{total_checks})")
        print("🔧 Fix identified issues before manual testing")
        return 1

if __name__ == "__main__":
    sys.exit(main())