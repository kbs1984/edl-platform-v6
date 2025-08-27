---
session: "00088"
type: "guide"
status: "current"
created: "2025-08-27"
title: "Session 91 Recovery Guide - Evidence-Based Path"
purpose: "Provide clear evidence-based recovery without transcript review"
topics: ["recovery", "evidence-based", "anti-guesswork", "onboarding"]
priority: "P0"
domain: "core"
implements: ["00088-ANTI-GUESSWORK-PROTOCOL.md"]
---

# Session 91 Recovery Guide - Evidence-Based Path

## Quick Start for Session 91

### 1. Run Updated Startup (Includes Anti-Guesswork Check)
```bash
./scripts/00028-full-startup.sh 00091
```

### 2. Review Session 88's Log (Key Section)
```bash
# Read the Recovery Path section specifically
grep -A20 "Recovery Path for Session 91" archive/sessions/SESSION-00088-LOG.md
```

### 3. Gather Evidence BEFORE Any Changes
```bash
./scripts/00088-gather-evidence.sh
```

## Evidence Commands That Replace Transcript Review

### Find What Works (Session 87's Fixes)
```bash
# All Session 87's successful fixes
python3 scripts/00059-yaml-query.py --session "00087"

# Specific working fixes
cat scripts/00087-fix-middleware-header.ts      # Auth redirect fix
cat scripts/00087-fix-file-constructor.tsx      # Step 2 fix
cat scripts/00087-onboarding-fixes-summary.md   # All onboarding fixes
```

### Find What Broke (Session 88's Mistakes)
```bash
# See current changes that need review
git diff truth-seed/emdash-dashboard-main/src/

# Check specific problem files
git diff truth-seed/emdash-dashboard-main/src/utils/get-user-info.ts
git diff truth-seed/emdash-dashboard-main/src/app/layout.tsx
```

### Check Reality (Current State)
```bash
# What's running
lsof -i :3000,3001,3002,3003

# Environment variables
grep "PROTOCOL\|AUTH_URL\|DASHBOARD_URL" truth-seed/*/.env.local

# Database reality
ls -la reality/00081-request-*.md
```

## The ONE Remaining Issue (Clear Focus)

**School Registration Not Returning ID**
```bash
# Find the exact problem
grep -A10 -B10 "registerSchoolAction" \
  truth-seed/emdash-dashboard-main/src/lib/actions/school-actions.ts

# The issue: Function doesn't return {id, name} properly
# Fix: Make sure it returns the created school's ID
```

## Recovery Steps (Evidence-Based)

### Step 1: Revert Session 88's Bad Changes
```bash
# IF these files were changed by Session 88 (check git diff first!)
git checkout -- truth-seed/emdash-dashboard-main/src/utils/get-user-info.ts
git checkout -- truth-seed/emdash-dashboard-main/src/app/layout.tsx
```

### Step 2: Verify Session 87's Good Fixes Are Still There
```bash
# Check middleware header fix is present
grep "x-user-authenticated" \
  truth-seed/emdash-dashboard-main/src/utils/supabase/middleware.ts

# Check File constructor workaround
grep "SESSION 00087 FIX" \
  truth-seed/emdash-dashboard-main/src/components/onboarding-step-2-form.tsx

# Check null safety in school search
grep "schoolSearchResults ||" \
  truth-seed/emdash-dashboard-main/src/components/onboarding/school-search.tsx
```

### Step 3: Fix the School Registration Issue
Look at `registerSchoolAction` in `school-actions.ts`:
- It needs to return `{id: string, name: string}`
- Currently might return null or incomplete data
- Fix: Ensure `.select('id, name').single()` pattern

## Quick Reference Card

### ✅ KEEP These (Session 87's Working Fixes)
1. Middleware header setting `x-user-authenticated`
2. File constructor workaround (no `new File()` for existing)
3. Null safety checks in school search
4. Environment variables (PROTOCOL, AUTH_URL)

### ❌ REVERT These (Session 88's Guesswork)
1. get-user-info.ts throwing errors
2. layout.tsx redirect modifications
3. Any hardcoded URLs

### 🔧 FIX This (Outstanding Issue)
1. School registration not returning ID

## Success Verification

After fixes, test:
1. Login at http://localhost:3000/login
2. Should redirect to http://localhost:3003/onboarding
3. Step 1: Select user type ✅
4. Step 2: Fill profile (no File error) ✅
5. Step 3: Register school (gets ID properly) ✅
6. Complete onboarding successfully

## Anti-Guesswork Reminders

**Before ANY change**:
1. Is there evidence this is the problem?
2. Has this been fixed before? (Query YAML)
3. What does git diff show?
4. Make ONE change, test it

**If you see an error**: Your first instinct is wrong. Check reality first.

**Reference**: 
- Quick card: `core/00088-QUICK-REFERENCE-ANTI-GUESSWORK.md`
- Full protocol: `core/00088-ANTI-GUESSWORK-PROTOCOL.md`
- Pattern analysis: `core/00088-GUESSWORK-PATTERN-ANALYSIS.md`

## No Transcript Needed!

This guide provides everything Session 91 needs to:
1. Understand what works (Session 87's fixes)
2. Know what broke (Session 88's mistakes)
3. Fix the remaining issue (school registration)
4. Avoid the guesswork trap

The evidence-based tools make transcript review unnecessary.