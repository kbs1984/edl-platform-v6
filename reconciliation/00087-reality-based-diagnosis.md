---
created: '2025-08-27'
domain: reconciliation
fixes:
- redirect-loop
- profile-creation-trigger
- middleware-header
implements:
- AUTH-MASTERPLAN.md
- DASHBOARD-MASTERPLAN.md
priority: P0
purpose: Diagnose auth issues using reality files to eliminate guesswork
session: 00087
status: current
title: Reality-Based Auth Diagnosis - Two Critical Issues Found
topics:
- auth
- redirect-loop
- profile-trigger
- middleware
- reality-files
type: diagnosis
---

# Session 00087: Reality-Based Auth Diagnosis

## 🔍 Executive Summary

Using reality files from Session 85, I've identified **TWO critical issues**:
1. **Profile creation trigger NOT attached** (despite Session 85's fix)
2. **Middleware header NEVER set** (`x-user-authenticated` check always fails)

## 📊 Reality File Analysis

### 1. Trigger Comparison (CRITICAL FINDING #1)

**Our Project (`reality/00081-request-triggers.md`)**:
- 14 triggers total
- ❌ NO `on_auth_user_created` trigger

**Source Project (`reality/00081-request-source-project-triggers.md`)**:
- 14 triggers total
- ❌ NO `on_auth_user_created` trigger

**Conclusion**: BOTH projects missing the auth trigger! Session 85's fix was NOT applied to database.

### 2. Function Comparison

**Our Project (`reality/00081-request-functions.md`)**:
- ✅ HAS `add_new_user` function

**Source Project (`reality/00081-request-source-project-functions.md`)**:
- ✅ HAS `add_new_user` function

**Conclusion**: Function exists but NOT triggered (orphaned function).

### 3. Middleware Analysis (CRITICAL FINDING #2)

**Dashboard Middleware (`truth-seed/emdash-dashboard-main/src/middleware.ts`)**:
```typescript
// Line 47: Checks for header that NEVER gets set
if (isProtectedRoute && !response.headers.get('x-user-authenticated')) {
  // This ALWAYS evaluates to true because header is never set
  return NextResponse.redirect(redirectUrl)
}
```

**Update Session Function (`src/utils/supabase/middleware.ts`)**:
```typescript
const user = await supabase.auth.getUser();
// Gets user but NEVER sets x-user-authenticated header!
return response; // Returns without setting header
```

**The Bug**: The middleware checks for a header that the updateSession function never sets!

## 🚨 Root Causes Identified

### Issue #1: Profile Creation Not Working
- **Expected**: Session 85's trigger attachment should be in database
- **Reality**: No trigger attached (check reality files)
- **Impact**: New users created without profiles

### Issue #2: Redirect Loop
- **Expected**: `updateSession` sets `x-user-authenticated` header when user exists
- **Reality**: Header never set, so middleware always redirects
- **Impact**: Authenticated users can't access dashboard

## ✅ Required Fixes

### Fix #1: Apply Session 85's Trigger (MUST DO FIRST)
```sql
-- Run this in Supabase Dashboard SQL Editor
-- File: scripts/00085-fix-profile-creation-trigger.sql

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.add_new_user();
```

### Fix #2: Set Authentication Header
```typescript
// In truth-seed/emdash-dashboard-main/src/utils/supabase/middleware.ts
// After line 40, add:

const user = await supabase.auth.getUser();

// ADD THIS:
if (!user.error && user.data?.user) {
  response.headers.set('x-user-authenticated', 'true');
}
```

## 🔄 Why the Redirect Loop Happens

1. User authenticated (has valid session)
2. Tries to access `/onboarding`
3. Middleware checks for `x-user-authenticated` header
4. Header not found (never set by updateSession)
5. Redirects to `/auth/login?redirectTo=/onboarding`
6. Login page sees user is authenticated
7. Tries to redirect back to `/onboarding`
8. **GOTO STEP 2** (infinite loop)

## 📋 Verification Steps

### Step 1: Check Trigger Status
```sql
-- Run in Supabase Dashboard
SELECT trigger_name 
FROM information_schema.triggers 
WHERE event_object_table = 'users' 
AND trigger_schema = 'auth';

-- Should return: on_auth_user_created
-- Currently returns: EMPTY
```

### Step 2: Test Header Setting
```javascript
// Add console.log to middleware
console.log('Headers:', response.headers.get('x-user-authenticated'));
// Currently: null
// After fix: 'true'
```

## 🎯 Action Plan

1. **IMMEDIATE**: Apply trigger fix in Supabase Dashboard
2. **IMMEDIATE**: Fix middleware header setting
3. **TEST**: New user signup → profile creation
4. **TEST**: Login → dashboard access (no loop)
5. **VERIFY**: Both reality files and code match expectations

## 💡 Key Insight

**Reality files revealed what code couldn't**: 
- 37 sessions assumed trigger was attached
- Reality showed it wasn't
- Simple SQL fix solves profile issue
- Simple header addition fixes redirect loop

## 🚀 Expected Results After Fixes

1. ✅ New signups create profiles automatically
2. ✅ No redirect loops
3. ✅ Dashboard accessible to authenticated users
4. ✅ Complete auth flow working end-to-end

## 📚 Files Referenced

- `reality/00081-request-triggers.md` - Our triggers (missing auth)
- `reality/00081-request-source-project-triggers.md` - Source triggers (also missing)
- `truth-seed/emdash-dashboard-main/src/middleware.ts` - Checks missing header
- `truth-seed/emdash-dashboard-main/src/utils/supabase/middleware.ts` - Never sets header
- `scripts/00085-fix-profile-creation-trigger.sql` - The fix to apply

---

**Bottom Line**: Two simple fixes - attach trigger, set header. Reality files proved it.