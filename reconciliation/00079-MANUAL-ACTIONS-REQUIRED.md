---
session: 00079
type: guide
status: current
created: '2025-08-26'
title: Manual Actions Required for Auth Testing
purpose: Clear instructions for what needs manual intervention
topics:
- auth
- deployment
- testing
priority: P0
domain: reconciliation
implements:
- requirement-to-be-specified
modified: '2025-08-27'
---

# 🔧 MANUAL ACTIONS REQUIRED - Session 00079

## ✅ COMPLETED BY SESSION 79
1. **Supabase configuration verified** - You updated redirect URLs
2. **Environment files configured** - Both apps have .env.local
3. **Middleware deployed** - Session 76's files already exist
4. **Startup script created** - `scripts/00079-start-local-dev.sh`

## 🚨 ISSUES DISCOVERED

### 1. Auth App Missing Dependencies
The auth app has partial node_modules but missing the `next` binary.

**FIX REQUIRED**:
```bash
cd truth-seed/emdash-auth-main
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### 2. Domain Resolution Issue
Dashboard tries to bind to `dashboard.edl.emdash.one` IP (66.33.60.35) which doesn't exist locally.

**FIX OPTIONS**:

**Option A: Use Simple Localhost** (RECOMMENDED)
```bash
# Start auth on port 3000
cd truth-seed/emdash-auth-main
npx next dev -p 3000

# In another terminal, start dashboard on port 3001
cd truth-seed/emdash-dashboard-main
npx next dev -p 3001
```

**Option B: Update /etc/hosts**
```bash
# Add to /etc/hosts:
127.0.0.1 auth.localhost.localdomain
127.0.0.1 dashboard.localhost.localdomain
127.0.0.1 dashboard.edl.emdash.one
```

## 📋 COMPLETE MANUAL TEST FLOW

### Step 1: Complete Session 77's Dependency Work
Session 77 already analyzed this and determined `--legacy-peer-deps` is LOW RISK and safe. They successfully installed the dashboard. Now we just need to complete the auth app:

```bash
cd /home/b4sho/edl-projects-with-claude/edl-platform-v6
cd truth-seed/emdash-auth-main
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps  # Session 77's validated solution
```

### Step 2: Start Both Apps
```bash
# Terminal 1 - Auth
cd truth-seed/emdash-auth-main
npx next dev -p 3000

# Terminal 2 - Dashboard  
cd truth-seed/emdash-dashboard-main
npx next dev -p 3001
```

### Step 3: Test Auth Flow
1. Open browser to http://localhost:3000
2. Click "Sign Up"
3. Enter email and password
4. Submit form
5. Check email for verification link
6. Click verification link
7. Should redirect to dashboard

### Step 4: Verify Database Records
```sql
-- In Supabase SQL Editor
SELECT 
  u.email, 
  u.email_confirmed_at,
  p.id as profile_exists,
  s.user_id as student_exists
FROM auth.users u
LEFT JOIN profile p ON p.id = u.id
LEFT JOIN student s ON s.user_id = u.id
WHERE u.email = 'your-test@email.com';
```

## 🔍 WHAT TO CHECK

### ✅ SUCCESS Indicators:
- Auth app loads on http://localhost:3000
- Dashboard loads on http://localhost:3001
- Sign up form submits without errors
- Email arrives with confirmation link
- Clicking link redirects properly
- Dashboard shows onboarding for new user
- Database has profile and student records

### ❌ FAILURE Indicators:
- "Cannot find module 'next'" → Dependencies issue
- "EADDRNOTAVAIL" → Domain resolution issue
- "PGRST205" errors → Normal (RLS working)
- No email arrives → Check Supabase email settings
- No profile created → Check database trigger

## 🚀 IF EVERYTHING WORKS

Once local testing succeeds:

### 1. Commit the Working State
```bash
git add -A
git commit -m "Auth flow working locally with middleware

- Session 76's middleware deployed
- Environment configured for localhost
- Dependencies resolved with --legacy-peer-deps
- Ready for Vercel deployment

Co-authored-by: Session 79 <reconciliation@edl>"
```

### 2. Next: Vercel Deployment
```bash
vercel login
vercel link
vercel deploy
```

## 📊 CURRENT STATUS SUMMARY

| Component | Status | Action Needed |
|-----------|--------|---------------|
| Supabase Config | ✅ DONE | None |
| Middleware Files | ✅ EXIST | None |  
| Environment Files | ✅ CONFIGURED | None |
| Auth Dependencies | ❌ INCOMPLETE | npm install |
| Dashboard Dependencies | ✅ INSTALLED | None |
| Local Testing | ⏳ READY | Run servers |
| Vercel Deployment | ⏳ PENDING | After local works |

---

*Session 00079 - Reconciliation Domain*
*Building on Sessions 74-76 discoveries and Session 77's capability audit*