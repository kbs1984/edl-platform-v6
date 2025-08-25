---
created: '2025-08-23'
domain: reconciliation
priority: P1
purpose: Document truth seed adoption - deployment status
session: legacy
status: current
title: Truth Seed Adoption - Deployment Status
topics:
- auth
- database
- documentation
type: guide
---

# Truth Seed Adoption - Deployment Status
**Last Updated**: Session 00044 - 2025-08-21  
**Overall Status**: 🟡 IN PROGRESS

---

## Phase 1: Database Adoption
**Owner**: Session 00044  
**Status**: ⏳ NOT STARTED  
**Target**: Complete emdash schema (36 tables) + call_sign column

### Checklist
- [ ] Drop old 4-table system
- [ ] Deploy schema.sql (7,304 lines)
- [ ] Add call_sign column to student table
- [ ] Enable minimal RLS policies
- [ ] Verify with Reality Agents

---

## Phase 2: Auth Gateway Deployment
**Owner**: Session 00045  
**Status**: ⏳ NOT STARTED  
**Target**: auth.edl-platform.vercel.app with cookie magic

### Checklist
- [ ] Fix hardcoded project ID (line 21)
- [ ] Fix loginAction redirect (line 68)
- [ ] Configure environment variables
- [ ] Test local subdomain cookies
- [ ] Deploy to Vercel

---

## Phase 3: Dashboard Integration
**Owner**: Session 00045  
**Status**: ⏳ NOT STARTED  
**Target**: dashboard.edl-platform.vercel.app with call_sign flow

### Checklist
- [ ] Add call_sign validation
- [ ] Create call-sign selection page
- [ ] Test onboarding flow
- [ ] Verify cookie sharing
- [ ] Deploy to Vercel

---

## Critical Discoveries
1. **Hardcoded project ID** in auth/callback/route.ts must change
2. **Missing call_sign** validation in dashboard
3. **Schema.sql** is production-ready, just needs call_sign column

---

## Next Actions
- Session 44: Begin Phase 1 database adoption
- Session 45: Prepare code fixes while waiting for database