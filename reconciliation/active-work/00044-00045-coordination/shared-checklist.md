---
session: "00044"
type: "documentation"
status: "current"
created: "2025-08-23"
title: "Sessions 44-45 Shared Implementation Checklist"
purpose: "Document sessions 44-45 shared implementation checklist"
topics: ['auth', 'database', 'documentation']
priority: "P1"
domain: "reconciliation"
---

# Sessions 44-45 Shared Implementation Checklist
**Created**: Session 00044  
**Date**: 2025-08-21  
**Purpose**: Coordinate parallel implementation of truth-seed adoption

---

## 🚨 Critical Fixes Required (BOTH SESSIONS TRACK)

### Database Layer
- [ ] **Drop old 4-table system** completely (Session 44)
  - Tables: profiles, teams, team_members, team_join_requests
  - Method: DROP SCHEMA public CASCADE; CREATE SCHEMA public;
  
- [ ] **Deploy full emdash schema** (Session 44)
  - Source: `truth-seed/emdash-dashboard-main/docs/schema.sql` (7,304 lines)
  - Expected: 36+ tables across public, debate, chat schemas
  - Note: "already exists" warnings for auth schema are NORMAL
  
- [ ] **Add call_sign column** (Session 44)
  ```sql
  ALTER TABLE public.student ADD COLUMN call_sign TEXT UNIQUE;
  CREATE INDEX idx_student_call_sign ON public.student(call_sign);
  ```

- [ ] **Enable minimal RLS** (Session 44)
  - Just enough to not block auth gateway
  - Profile: view/update own
  - Student: view own

### Auth Gateway Code Fixes
- [ ] **Fix hardcoded project ID** (Session 45)
  - File: `src/app/auth/callback/route.ts`
  - Line: 21
  - Change: `"niyrthumgjmtkjgtlbnq"` → `"bbrheacetxlnqbibjwsz"`
  - Impact: CRITICAL - cookies won't propagate without this

- [ ] **Verify environment variables** (Session 45)
  ```env
  ROOT_URL=localhost.localdomain  # NO protocol, NO subdomain
  AUTH_URL=auth.localhost.localdomain
  DASHBOARD_URL=dashboard.localhost.localdomain
  ```

### Dashboard Code Fixes
- [x] **Add call_sign validation** (Session 47 - COMPLETED)
  - File: `src/app/(user-pages)/page.tsx` - DONE
  - Location: Between lines 14-16 (after profile fetch, before role redirects) - DONE  
  - Code added at lines 16-27
  ```typescript
  if (profile.user_role === 'STUDENT') {
    const { data: student } = await supabase
      .from('student')
      .select('call_sign')
      .eq('user_id', profile.id)
      .single();
      
    if (!student?.call_sign) {
      redirect('/onboarding/call-sign');
    }
  }
  ```

- [x] **Create call-sign selection page** (Session 47 - COMPLETED)
  - Path: `src/app/(init-pages)/onboarding/call-sign/page.tsx` - DONE (112 lines)
  - Purpose: Let students choose their EDL identity - IMPLEMENTED
  - Features: Form validation, suggestions, availability checking

### Additional Auth Gateway Fixes (Session 45 Addition)
- [ ] **Fix loginAction redirect** 
  - File: `src/lib/action/auth-actions.ts`
  - Line: 68
  - Current: `return redirect(\`http://${process.env.DASHBOARD_URL}\`);`
  - Fix: Should use PROTOCOL env var: `return redirect(\`${process.env.PROTOCOL}${process.env.DASHBOARD_URL}\`);`
  
- [ ] **Update /etc/hosts for local testing** (Both Sessions)
  ```bash
  127.0.0.1 auth.localhost.localdomain
  127.0.0.1 dashboard.localhost.localdomain
  127.0.0.1 localhost.localdomain
  ```

---

## 📋 Verification Checklist

### Database Verification (Session 44)
- [ ] Run table count query:
  ```sql
  SELECT table_schema, COUNT(*) as table_count
  FROM information_schema.tables
  WHERE table_type = 'BASE TABLE'
  GROUP BY table_schema;
  -- Expected: public (20+), debate (6+), chat (3+)
  ```

- [ ] Verify call_sign column exists:
  ```sql
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'student' 
    AND column_name = 'call_sign'
  ) as call_sign_exists;
  ```

- [ ] Reality Agent confirms healthy:
  ```bash
  SUPABASE_URL="https://bbrheacetxlnqbibjwsz.supabase.co" \
  SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE" \
  python3 reality/agent-reality-auditor/supabase-connector/quickstart.py
  ```

### Auth Gateway Verification (Session 45)
- [ ] Local test at `http://auth.localhost.localdomain:3000`
- [ ] Cookie domain starts with `.` (check DevTools)
- [ ] Project ID filter matches our Supabase instance
- [ ] Sign up → Email verify → Login flow works

### Dashboard Verification (Session 45/47)
- [x] Dashboard code prepared and ready for testing (Session 47)
- [x] Environment configured (.env.local created) (Session 47)
- [x] Dependencies installed (npm install --legacy-peer-deps) (Session 47)
- [ ] Local test at `http://dashboard.localhost.localdomain:3001` (Waiting for Team A database)
- [ ] Redirects to auth when not logged in (Pending testing)
- [ ] Call sign onboarding appears for new students (Pending testing)
- [ ] Cookies shared between subdomains (Pending testing)

---

## 🎯 Division of Labor

### Session 44 Focus
1. Database adoption (Phase 1 complete)
2. Reality Agent verification
3. Document in `reconciliation/deployment-records/00044-database-adoption.md`
4. Signal completion to Session 45

### Session 45 Focus
1. Code fixes (auth + dashboard)
2. Local testing of full flow
3. Prepare for production deployment
4. Document in `reconciliation/deployment-records/00045-code-modifications.md`

---

## ⚠️ Known Gotchas

1. **Supabase SQL Editor limit**: Schema file might be too large
   - Solution: Use Migrations panel or split into chunks

2. **Cookie not sharing**: Must have exact domain setup
   - Auth cookies need `.` prefix for subdomain sharing
   - ROOT_URL must have NO protocol

3. **RLS blocking access**: Keep policies minimal
   - Auth gateway handles real security
   - Just need basic "own data" policies

4. **"Already exists" errors**: Expected for auth schema
   - This is NORMAL, don't panic
   - Supabase pre-creates auth schema

---

## 📝 Communication Protocol

- Update this checklist with ✅ as items complete
- Add discovered issues in "Gotchas" section
- Document any deviations in respective session logs
- Use `reconciliation/active-work/` for shared artifacts

---

## 🚀 Success Criteria

### Phase 1 Complete When:
- [ ] 36 tables deployed and verified
- [ ] call_sign column added to student table
- [ ] RLS enabled with minimal policies
- [ ] Reality Agents show healthy database

### Phase 2 Complete When:
- [ ] Auth gateway runs locally with fixed project ID
- [ ] Dashboard runs locally with call_sign check
- [ ] Full flow works: signup → verify → login → onboarding → dashboard
- [ ] Cookies properly shared between subdomains

### Phase 3 Complete When:
- [ ] Auth deployed to auth.edl-platform.vercel.app
- [ ] Dashboard deployed to dashboard.edl-platform.vercel.app
- [ ] Production flow tested end-to-end
- [ ] Reality Agents confirm production health

---

**Note**: Session 45, please review and add any items I've missed!