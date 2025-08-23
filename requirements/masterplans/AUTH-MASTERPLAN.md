---
session: "unknown"
type: "architecture"
status: "current"
created: "2025-08-23"
title: "AUTH-MASTERPLAN: Truth Seed Authentication Gateway"
purpose: "Document auth-masterplan: truth seed authentication gateway"
topics: ['auth', 'architecture']
priority: "P1"
domain: "requirements"
---

# AUTH-MASTERPLAN: Truth Seed Authentication Gateway
**Version**: 1.0  
**Created**: Session 00041  
**Date**: 2025-08-21  
**Status**: READY FOR IMMEDIATE DEPLOYMENT  
**Replaces**: RESTORATION-MASTERPLAN-V3.md (outdated)

---

## 🚨 CRITICAL PIVOT NOTICE

**🔴 MANDATORY**: Read `TRUTH-SEED-ADOPTION-DECISION.md` FIRST for authoritative adoption strategy.

**THIS IS THE NEW ANCHOR DOCUMENT**. The project has pivoted from building auth from scratch to adopting the complete emdash-auth/dashboard platform as our Truth Seed.

**DECISION IS FINAL**: FULL ADOPTION - All 36 tables, auth AS-IS, no hybrids, no debate.

---

## Executive Summary

The Auth Gateway is a **production-ready** Next.js authentication service that handles all security-critical operations. It acts as the gatekeeper ensuring only authenticated users reach the dashboard. The existing codebase in `/truth-seed/emdash-auth-main/` is **fully functional** and can be deployed immediately with only environment variable updates.

**Key Decision**: We adopt the existing emdash-auth AS-IS rather than rebuilding. This gives us months of battle-tested code instantly.

---

## Required Reading List by Task

### For ALL Sessions (Start Here)
1. **TRUTH-SEED-ADOPTION-DECISION.md** - AUTHORITATIVE adoption strategy
2. **This document** - AUTH-MASTERPLAN.md
3. `/truth-seed/Sean2474-emdash-dabate-sql-returns.md` - Actual database state
4. `/archive/sessions/SESSION-00040-HANDOFF.md` - The pivot decision context

### For Authentication Work
```bash
# Core auth flow files
/truth-seed/emdash-auth-main/src/app/auth/callback/route.ts      # OAuth callback handler
/truth-seed/emdash-auth-main/src/lib/action/auth-actions.ts       # Signup/login actions
/truth-seed/emdash-auth-main/src/utils/supabase/server.ts         # Server-side Supabase
/truth-seed/emdash-auth-main/src/utils/supabase/client.ts         # Client-side Supabase
/truth-seed/emdash-auth-main/.env.development                     # Subdomain config
```

### For Database Work
```bash
# Migration files showing full schema
/truth-seed/supabase-migration/16.json    # Core table structures
/truth-seed/supabase-migration/39*.json   # Enum types (user roles, divisions)
/truth-seed/supabase-migration/53*.json   # Current usage statistics
```

### For UI/UX Work
```bash
# Auth page components
/truth-seed/emdash-auth-main/src/app/(auth-pages)/login/page.tsx
/truth-seed/emdash-auth-main/src/app/(auth-pages)/sign-up/page.tsx
/truth-seed/emdash-auth-main/src/components/ui/social-login-button.tsx
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     TRUTH SEED ARCHITECTURE                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  User Journey:                                               │
│  ============                                                │
│                                                               │
│  1. Visit: edl-platform.vercel.app                          │
│       ↓                                                      │
│  2. No Session → Redirect to auth.edl-platform.vercel.app   │
│       ↓                                                      │
│  3. Login/Signup (Email or Google/Kakao OAuth)              │
│       ↓                                                      │
│  4. Cookie set with domain=".edl-platform.vercel.app"       │
│       ↓                                                      │
│  5. Redirect to dashboard.edl-platform.vercel.app           │
│       ↓                                                      │
│  6. Check call_sign → Onboarding or Dashboard               │
│                                                               │
│  Cookie Architecture:                                        │
│  ===================                                         │
│                                                               │
│  auth.edl-platform.vercel.app                               │
│       ↓                                                      │
│  Sets cookie with domain=".edl-platform.vercel.app"         │
│       ↓                                                      │
│  Available to ALL subdomains automatically                   │
│       ↓                                                      │
│  Both auth & dashboard use same Supabase = same session      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## What's Already Working (No Changes Needed)

### ✅ Complete Features
1. **Email/Password Authentication**
   - Signup with strict validation (10+ chars, letters, numbers, special chars)
   - Login with session management
   - Email verification flow with thank you page
   - Password reset functionality

2. **Social OAuth**
   - Google OAuth configured
   - Kakao OAuth configured (Korean market)
   - Automatic redirect after authentication

3. **Cookie Management**
   - Subdomain sharing implemented
   - HTTP-only secure cookies
   - Automatic propagation to root domain

4. **Session Handling**
   - Supabase SSR integration
   - Automatic session refresh
   - Protected route middleware

5. **Multi-Subdomain Architecture**
   ```
   Development:
   - auth.localhost.localdomain:3000
   - dashboard.localhost.localdomain:3001
   
   Production:
   - auth.edl-platform.vercel.app
   - dashboard.edl-platform.vercel.app
   ```

---

## Database Structure (Current State)

### User Hierarchy
```sql
auth.users (Supabase managed)
    ↓
public.profile (id = auth.uid())
    ↓
public.student (user_id → profile.id)
    ↓
public.team_member (student_id → student.id)
```

### Key Tables
- **profile**: Core user data (name, email, username, image_path)
- **student**: Student-specific (division, exp, level, challenge_enabled)
- **judge**: Judge profiles (job_title, biography)
- **guardian**: Parent accounts (payment_method, billing_address)
- **team**: Team management
- **friendship**: Social connections

### User Roles (Enum)
- STUDENT
- JUDGE  
- GUARDIAN

### Divisions (Progression)
- VILLIGER (Starting)
- LOWER
- UPPER
- SENIOR
- OPEN (Top tier)

---

## Implementation Plan

### ⚠️ PRE-FLIGHT CHECKLIST (DO THIS FIRST!)

```markdown
[ ] Brian has Vercel account access
[ ] Supabase project created
[ ] Domain availability confirmed
[ ] Read Session 40 discoveries completely
[ ] Understand cookie propagation logic
[ ] Rollback plan documented
[ ] Local testing environment ready
```

### Phase 0.5: Reality Agent Baseline (CRITICAL)

```bash
# BEFORE ANY WORK - Establish current reality
cd /home/b4sho/edl-projects-with-claude/edl-platform-v6

# Option A: Use automated session startup (RECOMMENDED)
./scripts/00028-session-start.sh [session-number]
# This runs all Reality Agents automatically

# Option B: Run manually with KNOWN credentials
# These credentials are PUBLIC (anon key) and already in the codebase:
SUPABASE_URL="https://bbrheacetxlnqbibjwsz.supabase.co" \
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE" \
./scripts/00028-reality-check.sh --quick

# Individual agents:
# 1. GitHub (no credentials needed)
python3 reality/agent-reality-auditor/github-connector/quickstart.py

# 2. Supabase (use known credentials)
SUPABASE_URL="https://bbrheacetxlnqbibjwsz.supabase.co" \
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE" \
python3 reality/agent-reality-auditor/supabase-connector/quickstart.py

# 3. Vercel (if implemented)
python3 reality/agent-reality-auditor/vercel-connector/quickstart.py

# 4. Integration (aggregates all agents)
python3 reality/agent-reality-auditor/integration-connector/quickstart.py
# Should show: 97%+ health before proceeding
```

### Phase 1: Local Testing First (CRITICAL)

```bash
# 1. Setup local hosts file
echo "127.0.0.1 auth.localhost.localdomain
127.0.0.1 dashboard.localhost.localdomain" | sudo tee -a /etc/hosts

# 2. Fork and configure locally
cp -r /truth-seed/emdash-auth-main /new-repo/edl-auth-gateway
cd /new-repo/edl-auth-gateway

# 3. Create environment variables (EXACT format matters!)
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
AUTH_URL=auth.localhost.localdomain
DASHBOARD_URL=dashboard.localhost.localdomain:3001
ROOT_URL=localhost.localdomain  # NO protocol, NO subdomain!
PROTOCOL=http://
EOF

# 4. Test locally BEFORE deploying
npm run dev  # Runs on port 3000
# Test complete flow locally first!
```

### Phase 1.5: Supabase Configuration (MANDATORY)

```sql
-- 1. IMMEDIATELY add call_sign (prevents Session 36 bug)
ALTER TABLE public.student 
ADD COLUMN call_sign TEXT UNIQUE;
CREATE INDEX idx_student_call_sign ON public.student(call_sign);

-- 2. In Supabase Dashboard, add redirect URLs:
-- https://auth.edl-platform.vercel.app/auth/callback
-- http://auth.localhost.localdomain:3000/auth/callback

-- 3. Set JWT expiry: 604800 (7 days)

-- 4. Enable providers (in order):
-- ✅ Email/password first
-- ✅ Google OAuth second
-- ⚠️ Kakao OAuth only if needed
```

### Phase 2: Production Deploy (After Local Success)

```bash
# Environment Variables Checklist (COPY EXACTLY)
NEXT_PUBLIC_SUPABASE_URL=      # From Supabase dashboard
NEXT_PUBLIC_SUPABASE_ANON_KEY= # From Supabase dashboard  
AUTH_URL=auth.edl-platform.vercel.app          # Must match deployment
DASHBOARD_URL=dashboard.edl-platform.vercel.app # Must match deployment
ROOT_URL=edl-platform.vercel.app   # ⚠️ NO protocol, NO subdomain!
PROTOCOL=https://                   # Production uses https

# Deploy to Vercel
vercel deploy --prod
```

### Phase 2.5: Reality Agent Verification (POST-DEPLOYMENT)

```bash
# VERIFY deployment with Reality Agents
cd /home/b4sho/edl-projects-with-claude/edl-platform-v6

# Use the automated check with known credentials:
SUPABASE_URL="https://bbrheacetxlnqbibjwsz.supabase.co" \
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE" \
./scripts/00028-reality-check.sh --full

# Or check individual agents:
# 1. Verify Vercel deployment
python3 reality/agent-reality-auditor/vercel-connector/quickstart.py
# Should show: New deployment ready, env vars set

# 2. Verify Supabase tables (with known credentials)
SUPABASE_URL="https://bbrheacetxlnqbibjwsz.supabase.co" \
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE" \
python3 reality/agent-reality-auditor/supabase-connector/quickstart.py
# Should show: call_sign column exists, RLS policies active

# 3. Verify GitHub commit
python3 reality/agent-reality-auditor/github-connector/quickstart.py
# Should show: Latest deployment commit

# 4. Verify overall health
python3 reality/agent-reality-auditor/integration-connector/quickstart.py
# Should show: 97%+ health, all agents agree
```

### Phase 2: Add EDL Identity (Day 2)

```sql
-- Add call_sign to student table
ALTER TABLE public.student 
ADD COLUMN call_sign TEXT UNIQUE;

-- Create index for fast lookups
CREATE INDEX idx_student_call_sign ON public.student(call_sign);
```

### Phase 3: Customize Redirect Logic (Day 2)

```typescript
// In /auth/callback/route.ts
const { data: student } = await supabase
  .from('student')
  .select('call_sign')
  .eq('user_id', user.id)
  .single();

if (!student?.call_sign) {
  return NextResponse.redirect(`${DASHBOARD_URL}/onboarding`);
}
return NextResponse.redirect(`${DASHBOARD_URL}/dashboard`);
```

### Phase 4: Test Complete Flow (Day 3)

1. Sign up with email → Verify email works
2. Login with password → Session created
3. OAuth with Google → Profile created
4. Cookie sharing → Dashboard can read session
5. Call sign check → Redirect to onboarding

---

## Migration Decision: USE AS-IS

After thorough analysis, the decision is to **USE THE EXISTING AUTH GATEWAY AS-IS** with minimal configuration changes:

### Why This Works:
1. **Production Ready**: Battle-tested code with proper security
2. **Feature Complete**: All auth features we need already exist
3. **Cookie Magic**: Subdomain sharing already implemented
4. **Clean Architecture**: Well-structured Next.js 15 app
5. **Time Savings**: Months of development work already done

### What We Change:
1. Environment variables (Supabase credentials)
2. Domain settings (edl-platform.vercel.app)
3. Add call_sign column to database
4. Update redirect logic for onboarding

---

## Success Metrics

### MVP Requirements (All Already Met)
- [x] User can sign up with email/password
- [x] User can login with Google OAuth
- [x] Session persists across subdomains
- [x] Redirect to dashboard works
- [x] Profile created in Supabase

### EDL Additions (To Be Added)
- [ ] Call sign selection during onboarding
- [ ] Division assignment (start at VILLIGER)
- [ ] Experience points initialization
- [ ] Team creation capability

---

## Critical Files Reference

### Environment Configuration
```bash
# Development
AUTH_URL="auth.localhost.localdomain"
DASHBOARD_URL="dashboard.localhost.localdomain:3001"
ROOT_URL="localhost.localdomain"

# Production
AUTH_URL="auth.edl-platform.vercel.app"
DASHBOARD_URL="dashboard.edl-platform.vercel.app"
ROOT_URL="edl-platform.vercel.app"
```

### Cookie Propagation Code
```typescript
// Already implemented in callback/route.ts
cookieStore.set(token.name, token.value, {
  httpOnly: true,
  path: "/",
  domain: `.${process.env.ROOT_URL}`,
  sameSite: "lax",
  secure: true
});
```

### Supabase Connection
```typescript
// Server-side (already configured)
createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { cookies: {...} }
);
```

---

## ⚠️ Critical Implementation Warnings

### 1. **Cookie Domain MUST Start with Dot**
```javascript
// CORRECT ✅
domain: ".edl-platform.vercel.app"

// WRONG ❌ (will break subdomain sharing)
domain: "edl-platform.vercel.app"
```

### 2. **Environment Variable Format is STRICT**
```bash
ROOT_URL=edl-platform.vercel.app  # ✅ NO protocol, NO subdomain
ROOT_URL=https://edl-platform.vercel.app  # ❌ WRONG
ROOT_URL=.edl-platform.vercel.app  # ❌ WRONG
```

### 3. **Password Validation is Security Feature**
The existing validation in `auth-actions.ts` is sophisticated:
- 10+ characters minimum
- Must contain letters
- Must contain numbers
- Must contain special characters
**DO NOT REMOVE THIS** - it's intentional security

### 4. **Thank You Page is Required**
After signup → `/sign-up/thank-you` for email verification
This is NOT optional - email verification prevents spam

### 5. **OAuth Order Matters**
1. Get email/password working FIRST
2. Add Google OAuth SECOND
3. Kakao OAuth LAST (only if needed)
Each provider adds complexity - start simple!

---

## Troubleshooting Guide

### Common Issues & Solutions

1. **Cookies not sharing across subdomains**
   - Check ROOT_URL has NO protocol or subdomain
   - Ensure cookie domain starts with "."
   - Verify all apps use same Supabase instance

2. **OAuth redirect fails**
   - Update Supabase Dashboard redirect URLs
   - Add auth.edl-platform.vercel.app to allowed URLs
   - Check callback URL in OAuth config

3. **Session not persisting**
   - Verify cookie settings in middleware
   - Check Supabase JWT expiry settings
   - Ensure server/client use same Supabase instance

4. **Profile not created after signup**
   - Check database triggers
   - Verify RLS policies on profile table
   - Ensure auth.uid() matches profile.id

---

## 🔄 Rollback Plan

If deployment fails, execute immediately:

```bash
# Quick rollback procedure
1. Revert Vercel deployment to previous
   vercel rollback [deployment-id]

2. Keep database changes (they're additive, won't break)

3. Check Supabase logs for specific errors
   - Auth logs
   - Database logs
   - Check RLS policies

4. Verify environment variables AGAIN
   - Most failures are typos in env vars
   - Check ROOT_URL format specifically

5. Test locally with exact production env vars
```

---

## 📊 Metrics to Track

Future sessions should monitor these KPIs:

### Authentication Metrics
- **Signup Success Rate**: How many start vs complete?
- **OAuth Usage Split**: Email vs Google vs Kakao
- **Email Verification Rate**: How many verify within 24h?
- **Session Duration**: Are 7-day sessions optimal?

### User Journey Metrics  
- **Onboarding Drop-off**: Where do users abandon?
- **Call Sign Selection**: How long to choose?
- **Time to First Action**: Post-auth engagement
- **Cookie Failures**: Cross-domain issues

### Technical Metrics
- **Auth Response Time**: Should be <500ms
- **Cookie Propagation**: Should be instant
- **Error Rate**: Track by error type
- **Rollback Frequency**: How often do we revert?

---

## Next Steps for Future Sessions

### Immediate Priority (Session 42)
1. Deploy auth gateway to Vercel
2. Configure environment variables
3. Test complete auth flow
4. Document any issues found

### Secondary Priority (Session 43)
1. Read DASHBOARD-MASTERPLAN.md (to be created)
2. Implement call_sign selection in dashboard
3. Build onboarding flow
4. Test cookie sharing with dashboard

### Long-term Vision
1. Fat Client development using Vanilla JS
2. Integration with Truth Operating System
3. Reality Agents monitoring auth metrics
4. Full EDL ecosystem deployment

---

## Appendix: Database Migration Files

For complete database understanding, review these files in order:

1. `/truth-seed/supabase-migration/11.json` - Schema list
2. `/truth-seed/supabase-migration/12.json` - Table inventory
3. `/truth-seed/supabase-migration/16.json` - Column details
4. `/truth-seed/supabase-migration/39*.json` - Enum types
5. `/truth-seed/supabase-migration/53*.json` - Usage stats

---

## Document Control

- **Created By**: Claude (Session 00041)
- **Reviewed By**: Brian (Human)
- **Last Updated**: 2025-08-21
- **Next Review**: After auth gateway deployment
- **Status**: APPROVED FOR IMPLEMENTATION

---

**IMPORTANT**: This document supersedes RESTORATION-MASTERPLAN-V3.md. All future sessions should reference this document for authentication work. The old "build from scratch" approach is deprecated in favor of adopting the existing, production-ready emdash-auth gateway.