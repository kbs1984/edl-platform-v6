---
session: "00096"
type: "guide"
status: "current"
created: "2025-08-28"
modified: "2025-08-28"
title: "EDL v6 Workstation Setup Guide - Ground Truth"
purpose: "Document the correct workstation setup after Session 96 clarifications"
topics: ["workstation", "setup", "development", "ports", "configuration"]
priority: "P0"
domain: "reality"
audience: "developer"
complexity: "simple"
validation_method: "manual"
review_date: "2025-09-28"
estimated_shelf_life: "indefinite"
related_to: ["00096-TRUTH-SEED-DIRECTORY-PROTOCOL.md", "00042-TRUTH-SEED-ADOPTION-DECISION.md"]
implements: ["workstation-setup", "development-environment"]
fixes: ["port-confusion", "directory-confusion", "sessions-75-82-misdirection"]
breakthrough: "Resolved workstation confusion and established correct setup"
---

# EDL v6 Workstation Setup Guide

**Version**: AUTHORITATIVE  
**Created**: Session 00096  
**Status**: ✅ VERIFIED WORKING

---

## 🎯 Quick Start (TL;DR)

```bash
# Terminal 1 - Auth Gateway (Port 3000)
cd reconciliation/active-work/auth-gateway
npm install
npm run dev

# Terminal 2 - Dashboard (Port 3001) 
cd reconciliation/active-work/dashboard
npm install
npm run dev

# Access URLs
Auth: http://localhost:3000/login
Dashboard: http://localhost:3001
```

**DO NOT** run from `truth-seed/` - that's reference only!

---

## 📁 Directory Structure (After Session 96)

```
edl-platform-v6/
├── truth-seed/                           # 🔒 READ-ONLY REFERENCE
│   ├── emdash-auth-main/                # Original auth (DON'T RUN)
│   ├── emdash-dashboard-main/           # Original dashboard (DON'T RUN)
│   └── complete-migration.sql           # Database schema
│
└── reconciliation/active-work/          # ✅ YOUR WORKSTATION
    ├── auth-gateway/                    # Run this on :3000
    ├── dashboard/                       # Run this on :3001
    └── auth/                           # Old HTML files (ignore)
```

---

## 🔧 Environment Configuration

### Auth Gateway (.env.local)
```bash
# reconciliation/active-work/auth-gateway/.env.local
NEXT_PUBLIC_SUPABASE_URL=https://bbrheacetxlnqbibjwsz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE

# Ports (Session 96 corrected)
AUTH_URL=localhost:3000
DASHBOARD_URL=localhost:3001    # NOT 3002!
ROOT_URL=localhost
PROTOCOL=http://
```

### Dashboard (.env.local)
```bash
# reconciliation/active-work/dashboard/.env.local
NEXT_PUBLIC_SUPABASE_URL=https://bbrheacetxlnqbibjwsz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE

# Ports (Session 96 corrected)
DASHBOARD_URL=localhost:3001    # NOT 3002!
AUTH_URL=localhost:3000
ROOT_URL=localhost
PROTOCOL=http://
```

---

## 🚀 Starting Services

### Step 1: Start Auth Gateway
```bash
cd reconciliation/active-work/auth-gateway
npm install  # First time only
npm run dev
```
- Runs on: `http://localhost:3000`
- Routes: `/login`, `/sign-up`, `/forgot-password`

### Step 2: Start Dashboard
```bash
cd reconciliation/active-work/dashboard
npm install  # First time only
npm run dev
```
- Runs on: `http://localhost:3001`
- Routes: `/`, `/onboarding/*`, `/dashboard`

### Step 3: Access Points
- **New User**: `http://localhost:3000/sign-up`
- **Existing User**: `http://localhost:3000/login`
- **Dashboard Direct**: `http://localhost:3001`

---

## 🔍 Authentication Flow

### For New Users
1. Visit `http://localhost:3000/sign-up`
2. Register with email/password
3. Check email for verification
4. Click verification link
5. Redirected to `http://localhost:3001/onboarding`

### For Existing Users
1. Visit `http://localhost:3000/login`
2. Enter credentials
3. If profile incomplete → `http://localhost:3001/onboarding/step-2`
4. If profile complete → `http://localhost:3001/dashboard`

### Already Authenticated?
- Auth pages will auto-redirect to dashboard
- Clear session: Browser DevTools → Application → Clear Storage
- Or use incognito/private window

---

## 🐛 Known Issues & Fixes

### Issue: Can't connect to localhost:3000
**Fix**: Check if port is in use
```bash
lsof -i :3000
kill -9 $(lsof -t -i:3000)  # If needed
```

### Issue: Redirected to :3002 (wrong port)
**Fix**: Update .env.local files (Session 96 fix)
- Change `DASHBOARD_URL=localhost:3002` → `localhost:3001`
- Restart both services

### Issue: School Registration Dialog
**Status**: Fixed in Session 96
- Uses `DialogClose asChild` with `onClick`
- No `onPointerDown` workaround needed
- Minor bug but doesn't block onboarding

### Issue: Authentication redirect loop
**Fix**: Clear browser storage or use incognito mode

---

## ❌ Common Mistakes to Avoid

1. **DON'T** run from `truth-seed/` directories
2. **DON'T** use port 3002 (was misconfigured)
3. **DON'T** edit truth-seed files (reference only)
4. **DON'T** mix instructions from Sessions 75-82

---

## ✅ Verification Checklist

- [ ] Auth gateway runs on :3000
- [ ] Dashboard runs on :3001
- [ ] Can access `/login` in incognito
- [ ] Can access `/sign-up` in incognito
- [ ] Successful login redirects to :3001
- [ ] Onboarding loads at :3001/onboarding

---

## 📚 Reference Documentation

- **Directory Protocol**: `core/00096-TRUTH-SEED-DIRECTORY-PROTOCOL.md`
- **Adoption Decision**: `reconciliation/00042-TRUTH-SEED-ADOPTION-DECISION.md`
- **Session 96 Log**: `archive/sessions/SESSION-00096-LOG.md`

---

## 🎯 Summary

**The Ground Truth**:
- Work in: `reconciliation/active-work/`
- Reference: `truth-seed/` (never edit)
- Auth: Port 3000
- Dashboard: Port 3001
- Port 3002: NOT USED (was misconfigured)

This setup has been verified working in Session 96 with successful auth flow and onboarding access.