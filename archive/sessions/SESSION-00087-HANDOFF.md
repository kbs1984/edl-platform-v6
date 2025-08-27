---
created: '2025-08-27'
domain: reconciliation
fixes:
- redirect-loop
- auth-persistence
priority: P0
purpose: Debug and fix infinite redirect loop in dashboard authentication
related_to:
- SESSION-00085-LOG.md
- SESSION-00076-HANDOFF.md
session: 00087
status: draft
title: 'Session #00087 Handoff - Fix Auth Redirect Loop'
topics:
- auth
- redirect-loop
- dashboard
- middleware
- cookies
type: handoff
---

# Session #00087 Handoff - Fix Auth Redirect Loop

**Date**: 2025-08-27  
**From**: Session 00085  
**To**: Session 00087  
**Priority**: P0 - User Blocking Issue  
**Mission Type**: Bug Fix - Authentication Flow

---

## 🚨 THE PROBLEM

**User is stuck in infinite redirect loop:**
- URL: `http://localhost:3001/auth/login?redirectTo=%2Fonboarding`
- Behavior: "redirecting to login" message loops forever
- Context: System remembers logged-in user but can't complete flow
- Impact: Cannot access dashboard even when authenticated

---

## 📊 Symptoms & Evidence

### What Was Working (Session 85)
- ✅ Signup creates user
- ✅ Profile trigger creates profile stub
- ✅ Login authenticates successfully
- ✅ Existing users could access dashboard

### What's Broken Now
- ❌ Authenticated user redirected to login
- ❌ Login page redirects back to itself
- ❌ `/onboarding` route inaccessible
- ❌ Cookie or session not properly recognized

### The Loop Pattern
```
1. User authenticated (cookie exists)
2. Try to access /onboarding
3. Middleware redirects to /auth/login?redirectTo=/onboarding
4. Login sees user is authenticated
5. Tries to redirect to /onboarding
6. GOTO step 2 (infinite loop)
```

---

## 🔍 Likely Causes

### 1. Cookie Domain Issue
- Auth server sets cookie on localhost:3000
- Dashboard expects cookie on localhost:3001
- Cookie not shared across ports

### 2. Middleware Misconfiguration
File: `truth-seed/emdash-dashboard-main/src/middleware.ts`
- May not recognize authenticated state
- Protected route pattern might be wrong
- Session refresh might be failing

### 3. Cross-Origin Issue
- Auth on :3000, Dashboard on :3001
- CORS or credential sharing problem
- Supabase client not synced

### 4. Session State Mismatch
- User authenticated in auth app
- Dashboard doesn't see session
- Different Supabase client instances

---

## 🎯 Debugging Steps for Session 87

### Step 1: Verify Current State
```bash
# Check what's in browser
# 1. Open DevTools > Application > Cookies
# 2. Look for sb-* cookies on both :3000 and :3001
# 3. Check localStorage for supabase.auth.token

# Test API directly
python3 scripts/00087-check-auth-state.py
```

### Step 2: Check Middleware
```typescript
// truth-seed/emdash-dashboard-main/src/middleware.ts
// Look for:
// - How it checks authentication
// - What header it looks for (x-user-authenticated)
// - Protected route patterns
```

### Step 3: Test Cookie Sharing
```javascript
// Check cookie domain setting
// Should be .localhost for sharing across ports
// Or use proxy to same domain
```

### Step 4: Verify Supabase Client
- Check both apps use same Supabase URL/key
- Ensure session is properly shared
- Look for client initialization differences

---

## 🛠️ Potential Fixes

### Fix 1: Cookie Domain Configuration
```typescript
// In auth callback or login
cookieStore.set(token.name, token.value, {
  httpOnly: true,
  path: "/",
  domain: ".localhost",  // Share across subdomains/ports
  sameSite: "lax"
});
```

### Fix 2: Middleware Authentication Check
```typescript
// Fix the auth check in middleware
const session = await supabase.auth.getSession();
if (session.data.session) {
  // User is authenticated
  response.headers.set('x-user-authenticated', 'true');
}
```

### Fix 3: Use Proxy Instead of Ports
Configure Next.js to proxy auth routes:
```javascript
// next.config.js
async rewrites() {
  return [
    {
      source: '/auth/:path*',
      destination: 'http://localhost:3000/auth/:path*'
    }
  ];
}
```

### Fix 4: Single Domain Solution
Run both apps on same domain with different paths:
- localhost:3000/auth/* → Auth app
- localhost:3000/dashboard/* → Dashboard app

---

## 📋 Success Criteria

1. [ ] User can complete full flow:
   - Sign up → Email verify → Onboarding → Dashboard
2. [ ] No redirect loops
3. [ ] Session persists across auth and dashboard
4. [ ] Cookies properly shared
5. [ ] Middleware correctly identifies auth state

---

## 🎯 Deliverables for Session 87

1. **Diagnosis Document**: `scripts/00087-redirect-loop-diagnosis.md`
   - Root cause identified
   - Evidence collected
   - Solution validated

2. **Fix Implementation**: `scripts/00087-fix-redirect-loop.ts` or `.sql`
   - Actual fix applied
   - Could be middleware, cookie, or config change

3. **Test Script**: `scripts/00087-test-auth-flow.py`
   - Automated test for the complete flow
   - Prevents regression

---

## 💡 Quick Tests

### Test 1: Direct API Access
```bash
# Can we access profile directly?
curl http://localhost:3001/api/profile \
  -H "Cookie: [copy cookies from browser]"
```

### Test 2: Check Middleware Logs
Add logging to middleware:
```typescript
console.log('Auth check:', {
  path: pathname,
  hasSession: !!session,
  headers: request.headers
});
```

### Test 3: Bypass Middleware
Temporarily comment out protection for /onboarding:
- If it works → middleware issue
- If it doesn't → deeper auth issue

---

## 📚 Reference

### Related Files
- `truth-seed/emdash-dashboard-main/src/middleware.ts` - Protection logic
- `truth-seed/emdash-auth-main/src/app/auth/callback/route.ts` - Cookie setting
- `truth-seed/emdash-dashboard-main/src/utils/supabase/middleware.ts` - Session update

### Similar Issues
- Session 76: Fixed missing middleware
- Session 82: Dashboard configuration
- Session 85: Profile creation fix

---

## 🚨 Priority Note

This is blocking all user testing. The auth flow works but users can't access the dashboard. This needs to be fixed before any production deployment.

---

**Mission: Break the infinite redirect loop and restore dashboard access**

The auth system works, profile creation works, but the dashboard is inaccessible due to this redirect loop. Session 87 needs to identify why the authenticated state isn't being recognized and fix it.