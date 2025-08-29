---
session: "00101"
type: "test-checklist"
status: "current"
created: "2025-08-28"
title: "Integration Test Checklist - End-to-End Onboarding Flow"
purpose: "Systematic testing guide for complete auth → onboarding → dashboard flow"
topics: ["testing", "integration", "onboarding", "auth", "verification", "manual-testing"]
priority: "P0"
domain: "requirements"
audience: "developer"
complexity: "intermediate"
validation_method: "manual"
review_date: "2025-09-28"
estimated_shelf_life: "3-months"
related_to: ["00097-TESTING-PRIORITIES.md", "REALITY-FILES-INDEX.md", "00099-request-post-migration-changes.md"]
implements: ["anti-guesswork-protocol", "progress-tracking"]
breakthrough: "First systematic integration test documentation"
---

# Integration Test Checklist - End-to-End Onboarding Flow

**Purpose**: Document systematic testing approach to verify complete user journey from signup to dashboard access

**Created**: Session 101 based on Session 99's homework assignment

**Critical**: This prevents future sessions from guessing about what works vs what's broken

---

## 📋 Prerequisites

### Environment Setup Required
```bash
# Auth Gateway needs .env.local (create if missing)
cd reconciliation/active-work/auth/
cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=https://bbrheacetxlnqbibjwsz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE
DASHBOARD_URL=http://localhost:3001
EOF

# Dashboard already configured (verify)
cd reconciliation/active-work/dashboard/
cat .env.local  # Should show ports 3000/3001 configured
```

---

## 🚀 Step 1: Start Both Applications

```bash
# Terminal 1 - Auth Gateway (port 3000)
cd reconciliation/active-work/auth/
npm install  # If first time
npm run dev

# Terminal 2 - Dashboard (port 3001)
cd reconciliation/active-work/dashboard/
npm install  # If first time
npm run dev
```

**Expected Output**:
- Auth: `Ready on http://localhost:3000`
- Dashboard: `Ready on http://localhost:3001`

**Status**: [ ] Not tested | [ ] Working | [ ] Failed

---

## 🔐 Step 2: Test Sign Up Flow

**Navigate to**: http://localhost:3000

**Actions**:
1. Click "Sign Up" button
2. Enter test email: `test-session101@example.com`
3. Enter password: `TestPassword123!`
4. Submit form

**Expected Results**:
- ✅ Profile created automatically in database
- ✅ Email verification sent (check Supabase Dashboard)
- ✅ Success message or redirect shown

**Actual Result**: _______________

**Common Issues**:
- "File constructor" error → Check Session 87 middleware fix
- No profile created → Check trigger attachment (Session 99 findings)
- Network error → Verify .env.local loaded

---

## ✉️ Step 3: Email Verification

**Navigate to**: Supabase Dashboard → Auth → Users

**Actions**:
1. Find your test user
2. Check "Email Confirmed At" column
3. For testing: Click user → "Confirm Email" manually

**Expected Results**:
- ✅ User appears in list
- ✅ Email status shows confirmed (after manual action)

**Actual Result**: _______________

**Note**: In production, user clicks email link. For testing, manual confirmation is acceptable.

---

## 🔑 Step 4: Test Login & Redirect

**Navigate to**: http://localhost:3000/login

**Actions**:
1. Enter test credentials
2. Click "Sign In"

**Expected Results**:
- ✅ Authentication successful
- ✅ Redirect to http://localhost:3001
- ✅ x-user-authenticated header set (Session 87 fix)

**Actual Result**: _______________

**Debug Checks**:
```javascript
// Browser console
localStorage.getItem('supabase.auth.token')  // Should exist
```

---

## 👤 Step 5: Onboarding Step 1 (Role Selection)

**URL Should Be**: http://localhost:3001/onboarding

**Actions**:
1. Select "Student" role
2. Click "Continue"

**Expected Results**:
- ✅ Student record created in database
- ✅ Proceeds to Step 2 (/onboarding/step-2)

**Actual Result**: _______________

**Database Check**:
```sql
-- Run in Supabase SQL Editor
SELECT * FROM student WHERE user_id = '[your-user-id]';
```

---

## 📝 Step 6: Onboarding Step 2 (Profile Completion)

**URL Should Be**: http://localhost:3001/onboarding/step-2

**Actions**:
1. Fill profile information:
   - Name: Test User
   - Call Sign: ALPHA-1 (EDL field)
   - Grade Level: 10 (EDL field)
2. Submit form

**Expected Results**:
- ✅ Profile/Student updated with EDL fields
- ✅ Proceeds to Step 3

**Actual Result**: _______________

**Known Issues**:
- Missing grade_level column → Fixed in Session 101
- Call sign validation → Should accept alphanumeric + dash

---

## 🏫 Step 7: Onboarding Step 3 (School Registration)

**URL Should Be**: http://localhost:3001/onboarding/step-3

**Actions**:
1. Type "Seoul" in school search
2. Wait for results
3. Select any school
4. Click "Complete Onboarding"

**Expected Results**:
- ✅ School search returns results (RLS policy fixed)
- ✅ School selection saved
- ✅ Redirect to main dashboard

**Actual Result**: _______________

**Debug Check**:
```sql
-- Verify school search function
SELECT * FROM search_school('Seoul');
```

---

## 🎯 Step 8: Dashboard Access

**Final URL**: http://localhost:3001 (main dashboard)

**Actions**:
1. Verify user data displayed
2. Check navigation menu works
3. Try accessing features

**Expected Results**:
- ✅ User profile loaded
- ✅ Navigation functional
- ✅ No errors in console

**Actual Result**: _______________

---

## 🔧 Helper Script

**Run at any point during testing**:
```bash
python3 scripts/00101-test-integration.py --email test-session101@example.com
```

This script will check:
- Profile creation status
- Student record existence
- School search functionality
- Database consistency

---

## 📊 Test Results Summary

| Step | Component | Status | Blocker | Fixed By |
|------|-----------|--------|---------|----------|
| 1 | App Startup | [✅] | None | Session 101 .env.local |
| 2 | Sign Up | [⚠️] | Duplicate user bug | Needs fix |
| 3 | Email Verification | [✅] | None | Working |
| 4 | Login & Redirect | [✅] | None | Session 87 middleware |
| 5 | Role Selection | [✅] | None | Working |
| 6 | Profile Completion | [✅] | File constructor error | Session 101 fix |
| 7 | School Registration | [❌] | Permission denied despite RLS | **BLOCKING** |
| 8 | Dashboard Access | [ ] | Blocked by Step 7 | Pending |

---

## 🚨 Common Issues & Quick Fixes

### Sign Up Fails
```bash
# Check browser console for errors
# Verify auth/.env.local exists and loaded
# Restart auth gateway after creating .env.local
```

### No Profile Created
```sql
-- Check if trigger exists
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
-- If missing, run Session 99's trigger attachment SQL
```

### School Search Returns Empty
```sql
-- Verify RLS policy
SELECT * FROM pg_policies WHERE tablename = 'school';
-- If missing, apply Session 101's school RLS fix
```

### Redirect Fails After Login
```bash
# Check DASHBOARD_URL in auth/.env.local
# Verify middleware.ts has x-user-authenticated header (Session 87)
# Check browser network tab for redirect response
```

---

## 📝 Documentation Protocol

**After Testing**: Update this file with results in the Test Results Summary table

**For Blockers Found**: 
1. Document the exact error
2. Create fix in appropriate session
3. Update reality/00099-request-post-migration-changes.md if database-related

**For Success**: Mark as working and note which session's fix made it work

---

## 🔄 Future Testing Protocol

**Frequency**: Run this checklist after any:
- Auth flow changes
- Onboarding modifications
- Database schema updates
- Middleware adjustments

**Automation Goal**: Convert this to automated E2E tests using Playwright or Cypress

---

This checklist ensures we have ground truth about what actually works vs what needs fixing. No more guesswork!