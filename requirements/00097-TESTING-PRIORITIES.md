---
created: '2025-08-28'
domain: requirements
priority: P0
purpose: Clear list of what needs testing to know actual implementation state
session: 00097
status: current
title: Testing Priorities - What Needs Verification
topics:
- testing
- verification
- priorities
type: testing-priorities
---

# Testing Priorities - Session 00097

**Purpose**: We don't actually know what works. These tests will tell us.

## 🔴 P0 - CRITICAL (Test Immediately)

### 1. Onboarding Flow Completion
**Why Critical**: We claim it works but only Step 1 is verified
```bash
TEST STEPS:
1. Create new user account
2. Verify email
3. Complete Step 1 (Personal Info) ✅ Known working
4. Complete Step 2 (School Selection) ❓ NEEDS TESTING
5. Complete Step 3 (Team Setup) ❓ NEEDS TESTING
6. Reach dashboard successfully ❓ NEEDS TESTING

EXPECTED: User can complete all 3 steps and reach dashboard
ACTUAL: Unknown past Step 1
```

### 2. Student Record Auto-Creation
**Why Critical**: Core data model depends on this
```sql
-- After user signup, check:
SELECT * FROM student WHERE user_id = 'new-user-id';

EXPECTED: Record exists with call_sign and grade_level fields
ACTUAL: Unknown
```

### 3. School Selection Persistence
**Why Critical**: Step 2 may not save data
```bash
TEST STEPS:
1. Complete Step 1
2. Search for school (✅ dialog works)
3. Select a school
4. Continue to Step 3
5. Check if school_id saved to student record

EXPECTED: School selection saved
ACTUAL: Unknown
```

## 🟡 P1 - IMPORTANT (Test Soon)

### 4. Password Reset Flow
**Why Important**: Basic auth feature never tested
```bash
TEST STEPS:
1. Click "Forgot Password"
2. Enter email
3. Check email received
4. Click reset link
5. Set new password
6. Login with new password

EXPECTED: Full flow works
ACTUAL: Completely untested
```

### 5. Dashboard Data Display
**Why Important**: Dashboard might be empty shell
```bash
TEST STEPS:
1. Complete onboarding
2. Access dashboard
3. Check if profile data displays
4. Check if school shows
5. Check if team shows (if created)

EXPECTED: User data visible
ACTUAL: Unknown
```

### 6. Onboarding Enforcement
**Why Important**: Users might bypass onboarding
```bash
TEST STEPS:
1. Create account
2. Try to access dashboard WITHOUT onboarding
3. Should redirect to onboarding

EXPECTED: Forces onboarding completion
ACTUAL: Unknown
```

## 🟢 P2 - NICE TO KNOW (Test Eventually)

### 7. Remember Me Functionality
```bash
TEST: Check "Remember Me", close browser, return
EXPECTED: Still logged in
ACTUAL: Unknown
```

### 8. Session Expiration
```bash
TEST: Stay idle for extended period
EXPECTED: Session expires, redirects to login
ACTUAL: Unknown
```

### 9. Concurrent Sessions
```bash
TEST: Login from two browsers
EXPECTED: Both sessions work
ACTUAL: Unknown
```

## 📝 Testing Script Needed

We need an automated test script:
```python
# scripts/00098-test-implementation-state.py
"""
Test what actually works vs what we think works
"""

def test_onboarding_flow():
    # Create user
    # Complete each step
    # Verify data saved
    pass

def test_student_record():
    # Check if auto-created
    # Verify fields exist
    pass

def test_password_reset():
    # Full reset flow
    pass
```

## 🎯 Success Criteria

We can claim a feature works ONLY when:
1. ✅ Manually tested end-to-end
2. ✅ Data persists correctly
3. ✅ No console errors
4. ✅ User flow completes
5. ✅ Session/date noted

## 📊 Current Testing Status

| Feature | Tested | Works | Session | Notes |
|---------|--------|-------|---------|-------|
| Signup | ✅ | ✅ | 87 | Email verification works |
| Login | ✅ | ✅ | 87 | Redirects correctly |
| Onboarding Step 1 | ✅ | ✅ | 96 | Personal info saves |
| Onboarding Step 2 | ❌ | ❓ | - | School selection untested |
| Onboarding Step 3 | ❌ | ❓ | - | Team setup untested |
| Password Reset | ❌ | ❓ | - | Never tested |
| Dashboard Display | ❌ | ❓ | - | Unknown if shows data |
| Student Record | ❌ | ❓ | - | Auto-creation uncertain |

## 🔄 Update After Testing

After each test:
1. Update this file with results
2. Update AUTH-DETAILED-BREAKDOWN.md
3. Update DEPLOYMENT-STATE.md
4. Note in session log

---

*We don't know what we don't know. These tests will reveal the truth.*