---
session: "00103"
type: "fix"
status: "testing"
created: "2025-08-29"
title: "School Search Permission Fix - Missing Middleware"
purpose: "Document root cause and solution for school search blocker"
topics: ["school-search", "middleware", "auth", "server-actions", "fix"]
priority: "P0"
domain: "reconciliation"
fixes: ["school-search-blocker"]
implements: ["AUTH-MASTERPLAN.md"]
---

# School Search Permission Fix - Missing Middleware

**Date**: 2025-08-29
**Session**: 00103
**Critical Blocker**: Resolved root cause of school search permission denied

## 🎯 Root Cause Identified

### The Problem
School search was failing with "permission denied for table school" (Error 42501) despite:
- User being fully authenticated in Supabase
- SQL queries working perfectly in Dashboard
- RLS policies being correctly configured

### The Discovery
**Missing Next.js middleware file!** The project had NO `/middleware.ts` file in the root directory.

### Why This Matters
Without middleware.ts:
1. Next.js doesn't run auth session refresh on requests
2. Server actions get no auth context attached
3. Supabase client in server actions has undefined/null user
4. RLS sees no valid role → Permission denied

## 🔍 Evidence Trail

### What We Found
```
✅ User authenticated in Supabase (role: "authenticated", email verified)
❌ No /middleware.ts file existed (only helper function in utils)
❌ Both RPC and direct queries failed from app
✅ Same queries worked in Supabase Dashboard
❌ Server actions had no auth context
```

### The Auth Context Break
```typescript
// In server action WITHOUT middleware:
const { data: { user } } = await supabase.auth.getUser();
// user = null (no auth context attached by middleware)

// In Supabase Dashboard:
// user = authenticated (you're logged in there)
```

## ✅ The Solution

### 1. Created Missing Middleware File
**File**: `/reconciliation/active-work/dashboard/middleware.ts`
```typescript
import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  // This middleware runs on every request and ensures the Supabase session
  // is properly attached to server actions and server components
  return await updateSession(request)
}

export const config = {
  matcher: [
    // Match all paths except static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

### 2. Added Diagnostic Logging
Enhanced `searchSchoolAction` with comprehensive diagnostics to verify auth context:
- Session existence check
- User authentication status
- Direct table query test
- RPC function test

## 📊 Testing Instructions

### Step 1: Restart Development Server
```bash
# The middleware only loads on server start
cd reconciliation/active-work/dashboard
npm run dev
```

### Step 2: Test School Search
1. Navigate to onboarding Step 3
2. Type "edl" or any school name
3. Check terminal output for diagnostic logs

### Expected Console Output (Success)
```
=== SCHOOL SEARCH DIAGNOSTIC ===
1. Search query: edl
2. Session exists: true
3. Session user: brian.bumsik.kim+05test@gmail.com
4. Session access token: eyJhbGciOiJIUzI1NiIsIn...
5. User exists: true
6. User ID: d6d1fb98-f20e-43ae-b4c0-f61b835633db
7. User role: authenticated
8. User aud: authenticated
9. Direct table query: { success: true, error: undefined }
10. RPC query: { success: true, error: undefined }
=== END DIAGNOSTIC ===
```

### Previous Output (Failure)
```
2. Session exists: false
5. User exists: false
9. Direct table query: { success: false, error: "permission denied for table school", code: "42501" }
```

## 🚨 Important Notes

### Why This Wasn't Obvious
1. The helper function `updateSession` existed in utils/supabase/middleware.ts
2. But Next.js only automatically runs middleware from root `/middleware.ts`
3. Without the root file, the helper was never called
4. This is a common Next.js + Supabase integration gotcha

### Impact on Other Features
This fix should also resolve any other auth-related issues in server actions:
- Profile updates
- Team operations
- Any authenticated server actions

### Verification After Fix
Once middleware is working:
1. Remove diagnostic logging (keep for now during testing)
2. Verify all onboarding steps 1-8 complete successfully
3. Check that dashboard loads with proper user data

## 📋 Files Modified

1. **Created**: `/reconciliation/active-work/dashboard/middleware.ts`
   - Root middleware file for Next.js

2. **Modified**: `/reconciliation/active-work/dashboard/src/lib/actions/school-actions.ts`
   - Added diagnostic logging (temporary)

## 🎉 Expected Result

With middleware properly configured:
- School search will work immediately
- No more permission denied errors
- Auth context properly attached to all server actions
- Complete onboarding flow unblocked

---

**Status**: Solution implemented, awaiting test confirmation