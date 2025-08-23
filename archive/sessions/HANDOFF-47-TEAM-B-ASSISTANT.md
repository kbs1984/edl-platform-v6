---
session: "unknown"
type: "handoff"
status: "current"
created: "2025-08-23"
title: "Team B Assistant Handoff: Session 47"
purpose: "Document team b assistant handoff: session 47"
topics: ['auth', 'database', 'handoff']
priority: "P1"
domain: "core"
---

# Team B Assistant Handoff: Session 47
**Team Lead**: Session 00045  
**Assistant**: Session 00047  
**Team Focus**: Application Code (Auth Gateway + Dashboard)  
**Date**: 2025-08-21

---

## Welcome to Team B!

You're my assistant for Phase 1 implementation. While Team A (Sessions 44 & 46) handles database adoption, we're responsible for preparing all application code with the necessary modifications.

---

## Team B Structure & Responsibilities

### My Role (Session 45 - Team Lead)
- Own auth gateway modifications
- Coordinate with Team A lead (Session 44)
- Review your dashboard work
- Handle deployment preparation
- Make architectural decisions

### Your Role (Session 47 - Assistant)
- Execute dashboard modifications under my guidance
- Test integration between auth and dashboard
- Document findings
- Report blockers to me immediately
- Follow the specific implementation I've prepared

---

## Current Situation Brief

1. **Team A Status**: Currently executing database adoption (4 tables → 36 tables)
2. **Our Blocker**: We need database ready before full testing
3. **What We CAN Do Now**: Prepare all code modifications

---

## Your Primary Assignment: Dashboard Call Sign System

### Task 1: Set Up Working Directory
```bash
# Copy dashboard to our team's work area
cp -r truth-seed/emdash-dashboard-main reconciliation/active-work/dashboard
cd reconciliation/active-work/dashboard

# Report back when complete
echo "Dashboard copied to active-work"
```

### Task 2: Apply Call Sign Validation Fix
**File**: `src/app/(user-pages)/page.tsx`  
**Instructions**: 
1. Open the file
2. Find line 14 (where it checks `if (!profile.active)`)
3. After line 14, before line 16, insert EXACTLY this code:

```typescript
  // EDL Platform: Check if student needs call sign
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

**Report back with**: "Call sign validation added to page.tsx line [X]"

### Task 3: Create Call Sign Selection Page
**New File Path**: `src/app/(init-pages)/onboarding/call-sign/page.tsx`

Create this file with the EXACT content from:
`/reconciliation/active-work/00044-00045-coordination/critical-fixes.md`
(Look for the section "Call Sign Selection Page" - it's a complete 100+ line implementation)

**Key features you're implementing**:
- Form with pattern validation
- Auto-suggestions generator
- Availability checking
- Clean Tailwind UI

**Report back with**: "Call sign page created with [X] lines"

### Task 4: Set Up Environment Configuration
Create `.env.local` with these EXACT values:
```env
# Supabase credentials (known from previous sessions)
NEXT_PUBLIC_SUPABASE_URL=https://bbrheacetxlnqbibjwsz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE

# Dashboard-specific URLs
DASHBOARD_URL=dashboard.localhost.localdomain
AUTH_URL=auth.localhost.localdomain:3000
ROOT_URL=localhost.localdomain
PROTOCOL=http://
```

**Report back with**: "Environment configured for dashboard"

### Task 5: Prepare for Testing (Don't Execute Yet)
```bash
# Install dependencies
npm install

# DO NOT start the server yet - we need database first
# When ready, we'll run: npm run dev -- -p 3001
```

**Report back with**: "Dependencies installed, ready for testing command"

---

## Integration Points to Watch

While I handle the auth gateway, be aware of these integration points:

1. **Cookie Domain**: Auth sets cookies with `.localhost.localdomain` domain
2. **Redirect URLs**: Auth redirects to `dashboard.localhost.localdomain:3001/onboarding`
3. **Session Sharing**: Both apps use same Supabase instance = same session
4. **Call Sign Flow**: No call_sign → redirect to your new page → save → redirect back

---

## Testing Checklist (We'll Do Together)

Once Team A confirms database is ready:

1. I'll start auth gateway on port 3000
2. You start dashboard on port 3001
3. We test together:
   - [ ] New user signup flow
   - [ ] Call sign selection
   - [ ] Cookie propagation
   - [ ] Complete journey

---

## Communication Protocol

### Reporting to Me
Use this format for updates:
```
TASK [number] STATUS: [Completed/Blocked/In Progress]
DETAILS: [specific information]
NEXT: [what you're doing next]
```

### When to Escalate
- Any error you can't resolve in 5 minutes
- Any deviation from the specified implementation
- Any discovery that affects auth gateway
- Any file that doesn't exist where expected

### Documentation You'll Create
1. Update `/reconciliation/active-work/00044-00045-coordination/shared-checklist.md` with ✅ as you complete items
2. Add any issues to the "Gotchas" section
3. Keep notes for your session log

---

## What I'm Doing (So You Know)

1. **Auth Gateway Fixes**:
   - Fixing hardcoded project ID (line 21)
   - Fixing protocol hardcoding (line 68)
   - Setting up environment files
   - Testing cookie propagation

2. **Coordination**:
   - Monitoring Team A's database progress
   - Preparing deployment scripts
   - Creating production environment configs

---

## Your Success Criteria

✅ Dashboard code modified correctly (I'll review)  
✅ Call sign page works in testing  
✅ Environment properly configured  
✅ Clear communication throughout  
✅ Documentation updated  

---

## Questions You Should Ask Me

- "Should I modify any other files while I'm in there?"
- "What if the student table query fails?"
- "How should call signs be formatted?"
- "What about error handling?"

**Answers**: 
- No, only the specified files
- We'll handle errors after basic flow works
- Lowercase, numbers, hyphens only (pattern in the code)
- Basic validation for now, enhance later

---

## Ready to Start?

Begin with Task 1 and report back. I'll be working on auth gateway in parallel. Remember:
- Follow the implementation exactly as specified
- Report progress frequently
- Ask if anything is unclear
- We're Team B - we make the application work!

Let's build something great together!

---

*Team B Lead: Session 00045*  
*Your first report should be: "Ready to begin Task 1: Setting up working directory"*