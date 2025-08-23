---
session: "unknown"
type: "handoff"
status: "current"
created: "2025-08-23"
title: "HANDOFF 2: Auth Gateway Deployment - Cookie Magic Implementation"
purpose: "Document handoff 2: auth gateway deployment - cookie magic implementation"
topics: ['auth', 'database', 'handoff']
priority: "P1"
domain: "core"
---

# HANDOFF 2: Auth Gateway Deployment - Cookie Magic Implementation
**Session**: 00043  
**Priority**: 🟡 HIGH - DO AFTER DATABASE  
**Time Required**: 1-2 hours  
**Prerequisites**: Database adoption complete (36 tables + call_sign)

---

## What You're Building

A **subdomain-based auth gateway** that:
- Lives at `auth.edl-platform.vercel.app`
- Sets cookies readable by ALL subdomains
- Handles email/password + Google OAuth
- Redirects to dashboard after success

---

## Pre-Flight Checklist

Before starting, confirm:
- [ ] Database has 36 tables (not 4)
- [ ] student.call_sign column exists
- [ ] You have Vercel CLI installed (`npm i -g vercel`)
- [ ] You can edit `/etc/hosts` (for local testing)
- [ ] Node.js 18+ installed

---

## Phase 1: Local Development Setup

### Step 1: Prepare Your Hosts File (One-Time)
```bash
# Add these lines to /etc/hosts for local subdomain testing
sudo nano /etc/hosts

# Add:
127.0.0.1 auth.localhost.localdomain
127.0.0.1 dashboard.localhost.localdomain
127.0.0.1 localhost.localdomain
```

### Step 2: Copy Auth Gateway to Work Directory
```bash
# Create working directory
mkdir -p reconciliation/active-work/
cp -r truth-seed/emdash-auth-main reconciliation/active-work/auth-gateway
cd reconciliation/active-work/auth-gateway
```

### Step 3: Environment Configuration (CRITICAL)
```bash
# Create .env.local with EXACT format
cat > .env.local << 'EOF'
# Supabase (from your dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://bbrheacetxlnqbibjwsz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE

# Local Development URLs
AUTH_URL=auth.localhost.localdomain
DASHBOARD_URL=dashboard.localhost.localdomain:3001
ROOT_URL=localhost.localdomain
PROTOCOL=http://
EOF
```

### Step 4: Install and Run Locally
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Should start on http://localhost:3000
# But access via: http://auth.localhost.localdomain:3000
```

---

## Phase 2: Local Testing

### Test 1: Basic Access
1. Open browser to `http://auth.localhost.localdomain:3000`
2. Should see login page
3. Check browser console for errors

### Test 2: Sign Up Flow
1. Click "Sign Up"
2. Enter test email (use a real email you control)
3. Password must be 10+ chars with letters, numbers, special chars
4. Submit → Should redirect to thank you page
5. Check email for verification link

### Test 3: Cookie Verification
1. Open DevTools → Application → Cookies
2. After login, should see cookies with:
   - Domain: `.localhost.localdomain` (note the leading dot!)
   - HttpOnly: true
   - Secure: false (local only)

### Test 4: Database Integration
```sql
-- In Supabase SQL Editor, verify user was created
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 1;

-- Check profile was created
SELECT * FROM public.profile 
ORDER BY id DESC 
LIMIT 1;
```

---

## Phase 3: Supabase Dashboard Configuration

### Step 1: Add Redirect URLs
In Supabase Dashboard → Authentication → URL Configuration:

**Site URL**: `https://auth.edl-platform.vercel.app`

**Redirect URLs** (add ALL of these):
```
http://auth.localhost.localdomain:3000/auth/callback
http://dashboard.localhost.localdomain:3001/auth/callback
https://auth.edl-platform.vercel.app/auth/callback
https://dashboard.edl-platform.vercel.app/auth/callback
```

### Step 2: Email Templates (Optional but Recommended)
Authentication → Email Templates → Confirm signup:
- Change subject to: "Welcome to EDL Platform - Verify Your Email"
- Customize message if desired

### Step 3: Enable Auth Providers
1. **Email**: Already enabled by default
2. **Google OAuth**: 
   - Get credentials from Google Cloud Console
   - Add to Supabase → Authentication → Providers → Google
   - Client ID and Secret required

---

## Phase 4: Production Deployment

### Step 1: Update Production Environment
```bash
# Create production env file
cat > .env.production << 'EOF'
# Same Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=https://bbrheacetxlnqbibjwsz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE

# Production URLs (NO http://, NO leading dots)
AUTH_URL=auth.edl-platform.vercel.app
DASHBOARD_URL=dashboard.edl-platform.vercel.app
ROOT_URL=edl-platform.vercel.app
PROTOCOL=https://
EOF
```

### Step 2: Deploy to Vercel
```bash
# Login to Vercel (first time only)
vercel login

# Deploy (follow prompts)
vercel

# Questions to answer:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name? edl-auth-gateway
# - Directory? ./ 
# - Override settings? N

# After initial deploy, for updates:
vercel --prod
```

### Step 3: Configure Domain in Vercel
1. Go to Vercel Dashboard → Project Settings → Domains
2. Add: `auth.edl-platform.vercel.app`
3. It should auto-configure since you own the parent domain

### Step 4: Add Environment Variables in Vercel
1. Project Settings → Environment Variables
2. Add each from `.env.production`
3. Apply to: Production, Preview, Development

---

## Phase 5: Production Verification

### Test 1: Basic Access
```bash
# Should load without errors
curl -I https://auth.edl-platform.vercel.app
```

### Test 2: Full Auth Flow
1. Visit `https://auth.edl-platform.vercel.app`
2. Sign up with new email
3. Verify email
4. Login
5. Check cookies domain is `.edl-platform.vercel.app`

### Test 3: Verify with Reality Agent
```bash
# Claude can run this to verify deployment
python3 reality/agent-reality-auditor/vercel-connector/quickstart.py
```

---

## Critical Cookie Mechanics

**The Magic**: Cookie domain MUST start with dot for subdomain sharing

```javascript
// This is already in the code, don't change it!
// In src/app/auth/callback/route.ts
cookieStore.set(name, value, {
  domain: `.${process.env.ROOT_URL}`,  // Becomes: .edl-platform.vercel.app
  httpOnly: true,
  sameSite: 'lax',
  secure: true,
  path: '/'
})
```

**Why This Works**:
- Cookie set at `.edl-platform.vercel.app`
- Readable by `auth.edl-platform.vercel.app`
- Readable by `dashboard.edl-platform.vercel.app`
- Readable by `any.edl-platform.vercel.app`

---

## Common Issues & Solutions

### "Invalid redirect URL"
- Check ALL redirect URLs added in Supabase
- Ensure exact match including protocol

### "Cookies not sharing"
- Verify ROOT_URL has NO protocol, NO subdomain
- Check cookie domain starts with dot
- Ensure same Supabase instance

### "Profile not created"
- Check database triggers exist
- Verify RLS policies on profile table
- Ensure student table has user_id column

### "Password too weak"
- Must be 10+ characters
- Must have letters, numbers, special chars
- This is intentional security, don't remove

---

## Success Criteria

✅ Auth gateway accessible at auth.edl-platform.vercel.app  
✅ Can create new accounts  
✅ Email verification works  
✅ Login creates session  
✅ Cookies domain = `.edl-platform.vercel.app`  
✅ Profile created in database  
✅ No console errors  

---

## Next Steps

Once auth gateway is deployed:
1. Move to **HANDOFF-3-DASHBOARD-INTEGRATION.md**
2. Dashboard will read the cookies set by auth
3. Complete end-to-end testing

---

## Files to NOT Modify

These files already work perfectly:
- `/src/app/auth/callback/route.ts` - Cookie magic happens here
- `/src/lib/action/auth-actions.ts` - Password validation is correct
- `/src/utils/supabase/server.ts` - SSR configuration perfect

---

**Time Estimate**: 1-2 hours including deployment  
**Risk Level**: MEDIUM (deploying to production)  
**Rollback**: `vercel rollback` if issues  

---

*This handoff created by Session 00043 based on AUTH-MASTERPLAN.md analysis*