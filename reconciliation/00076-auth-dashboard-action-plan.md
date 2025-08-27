---
session: "00076"
type: "action-plan"
status: "current"
created: "2025-08-26"
title: "Auth & Dashboard Masterplan Completion - Action Plan"
purpose: "Get auth and dashboard working NOW so we can build on top"
topics: ["auth", "dashboard", "deployment", "action-plan"]
priority: "P0"
domain: "reconciliation"
lifecycle: "ON"
implements: ["AUTH-MASTERPLAN.md", "DASHBOARD-MASTERPLAN.md"]
---

# Auth & Dashboard Masterplan Completion - Action Plan

## The Situation
- **Database**: ✅ Working (triggers create profiles/students)
- **Auth Logic**: ✅ Working (proven by 5 existing users)
- **Frontend**: ❌ Not deployed/accessible
- **Goal**: Get auth gate working so we can build on top

## IMMEDIATE ACTION PLAN (Do This Now)

### Option A: Quick Local Development (1-2 hours)
**Best if you want to test/develop immediately**

#### Step 1: Start Auth App (10 min)
```bash
cd truth-seed/emdash-auth-main

# Install dependencies if needed
npm install

# Create .env.local if missing
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://bbrheacetxlnqbibjwsz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE
NEXT_PUBLIC_REDIRECT_URL=http://localhost:3002
EOF

# Start auth server
npm run dev
```
✅ Visit http://localhost:3000 - Should see login page

#### Step 2: Start Dashboard App (10 min)
```bash
# New terminal
cd truth-seed/emdash-dashboard-main

# Install dependencies if needed
npm install

# Create .env.local if missing
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://bbrheacetxlnqbibjwsz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE
EOF

# Start dashboard server (different port)
PORT=3002 npm run dev
```
✅ Visit http://localhost:3002 - Should redirect to auth if not logged in

#### Step 3: Configure Supabase (5 min)
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add to "Redirect URLs":
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3002`

#### Step 4: Test Complete Flow (10 min)
1. Go to http://localhost:3000/sign-up
2. Create new account
3. Check email for verification
4. Click verification link
5. Should redirect to localhost:3002
6. Complete 3-step onboarding
7. Access dashboard

### Option B: Deploy to Vercel (2-3 hours)
**Best for production-ready solution**

#### Step 1: Deploy Auth to Vercel
```bash
cd truth-seed/emdash-auth-main

# Install Vercel CLI if needed
npm i -g vercel

# Deploy with specific project name
vercel --name edl-auth-gate

# When prompted:
# - Set up and deploy: Y
# - Which scope: (your account)
# - Link to existing project: N
# - Project name: edl-auth-gate
# - Directory: ./
# - Override settings: N
```

#### Step 2: Deploy Dashboard to Vercel
```bash
cd truth-seed/emdash-dashboard-main

vercel --name edl-dashboard

# Same prompts, use name: edl-dashboard
```

#### Step 3: Configure Custom Domains
In Vercel Dashboard:
1. **edl-auth-gate** → Settings → Domains → Add `auth.edl-platform.vercel.app`
2. **edl-dashboard** → Settings → Domains → Add `dashboard.edl-platform.vercel.app`

#### Step 4: Set Environment Variables
In Vercel Dashboard for BOTH projects:
```
NEXT_PUBLIC_SUPABASE_URL=https://bbrheacetxlnqbibjwsz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[the long key]

# For auth project
NEXT_PUBLIC_REDIRECT_URL=https://dashboard.edl-platform.vercel.app

# For dashboard project
NEXT_PUBLIC_AUTH_URL=https://auth.edl-platform.vercel.app
```

#### Step 5: Configure Supabase
Add to Redirect URLs:
- `https://auth.edl-platform.vercel.app/auth/callback`
- `https://dashboard.edl-platform.vercel.app`

## SUCCESS CRITERIA

You'll know it's working when:
1. ✅ Can sign up at auth app
2. ✅ Email verification works
3. ✅ Redirects to dashboard after verification
4. ✅ Onboarding collects call_sign
5. ✅ Dashboard shows user data

## TROUBLESHOOTING

### "Database error saving new user"
- This was a false alarm - database works when frontend exists
- If still occurs, check Supabase logs

### "Cannot find module" errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Port already in use
```bash
# Kill existing process
lsof -ti:3000 | xargs kill -9
lsof -ti:3002 | xargs kill -9
```

### Cookie/CORS issues
- Make sure all apps use same Supabase project
- Check browser console for specific errors

## WHAT TO BUILD ON TOP

Once auth gate works, you can:
1. **Keep Next.js**: Use as-is for auth, build features in dashboard
2. **Hybrid approach**: Next.js auth + vanilla JS features
3. **Full migration**: Port auth to your preferred stack

The key is getting it working FIRST, then optimize.

## NEXT STEPS AFTER SUCCESS

1. Document the working configuration
2. Create deployment scripts
3. Set up CI/CD pipeline
4. Begin building activities on top

---

*Stop debugging what works. Start deploying what exists.*