---
session: '00076'
type: plan
status: current
created: '2025-08-26'
title: Auth Deployment Reconciliation Plan
purpose: Get auth working again - locally first, then Vercel
topics:
- auth
- deployment
- reconciliation
priority: P0
domain: reconciliation
lifecycle: 'ON'
implements:
- requirement-to-be-specified
modified: '2025-08-27'
---

# Auth Deployment Reconciliation Plan

## The Reconciliation Discovery

### What We Now Know:
1. **Database layer**: ✅ Working (trigger creates profiles/students)
2. **Auth logic**: ✅ Working (when pages existed, signups succeeded)
3. **Pages/Deployment**: ❌ BROKEN (lost in localhost → Vercel transition)

### Timeline of What Worked:
- **Phase 1**: Pre-pivot HTML pages → Some signups worked
- **Phase 2**: Early Next.js pivot → Brief working period
- **Phase 3**: Localhost (ports 3000/3002) → Was working
- **Phase 4**: Vercel deployment → Everything broke
- **Current**: No working signup OR dashboard

## Reconciliation Strategy: Get Pages Working Again

### Option A: Local Development First (RECOMMENDED)
Get it working locally, THEN deploy to Vercel

#### Step 1: Restore Local Auth (Port 3000)
```bash
cd truth-seed/emdash-auth-main
npm install
npm run dev
# Should run on http://localhost:3000
```

#### Step 2: Restore Local Dashboard (Port 3002)
```bash
cd truth-seed/emdash-dashboard-main
npm install
npm run dev
# Should run on http://localhost:3002
```

#### Step 3: Test Complete Flow Locally
1. Visit localhost:3000 → Sign up
2. Confirm email (check Supabase dashboard)
3. Should redirect to localhost:3002
4. Complete onboarding (3 steps)
5. Access dashboard

#### Step 4: Verify Database Records
```sql
-- Check if new user has all records
SELECT u.email, p.id as profile, s.user_id as student
FROM auth.users u
LEFT JOIN profile p ON p.id = u.id
LEFT JOIN student s ON s.user_id = u.id
WHERE u.email = 'your-test@email.com';
```

### Option B: Fix Vercel Deployment Directly
Jump straight to production fix

#### Required Vercel Projects:
1. `edl-auth` → deploys to `auth.edl-platform.vercel.app`
2. `edl-dashboard` → deploys to `dashboard.edl-platform.vercel.app`
3. `edl-landing` → deploys to `edl-platform.vercel.app`

#### Environment Variables Needed (Vercel Dashboard):
```bash
# For Auth Project
NEXT_PUBLIC_SUPABASE_URL=https://bbrheacetxlnqbibjwsz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon key]
AUTH_URL=auth.edl-platform.vercel.app
DASHBOARD_URL=dashboard.edl-platform.vercel.app

# For Dashboard Project
[Same as above plus any dashboard-specific vars]
```

#### Supabase Configuration:
1. Update Redirect URLs in Supabase Dashboard:
   - `https://auth.edl-platform.vercel.app/auth/callback`
   - `http://localhost:3000/auth/callback` (for local dev)

## The Real Reconciliation Work

### It's NOT about:
- ❌ Writing more SQL fixes (database works)
- ❌ Creating new auth logic (logic works)
- ❌ Building new pages (pages exist in truth-seed)

### It IS about:
- ✅ Getting existing Next.js apps deployed properly
- ✅ Configuring environment variables correctly
- ✅ Setting up subdomain routing on Vercel
- ✅ Ensuring auth cookies work cross-subdomain

## Quick Test Commands

### Test if auth pages load:
```bash
# Local
curl http://localhost:3000/login

# Production
curl https://auth.edl-platform.vercel.app/login
```

### Test if dashboard loads:
```bash
# Local
curl http://localhost:3002

# Production  
curl https://dashboard.edl-platform.vercel.app
```

## Success Criteria

We know reconciliation is complete when:
1. User can sign up at auth subdomain
2. Email verification works
3. Redirect to dashboard works
4. Onboarding flow completes
5. Dashboard displays user data

## Next Actions

1. **Immediate**: Try Option A (local first)
2. **Document**: What specific error occurs at each step
3. **Fix**: One issue at a time
4. **Test**: Full flow after each fix
5. **Deploy**: Only after local works perfectly

---

*The database was never broken. We just lost our frontend in deployment.*