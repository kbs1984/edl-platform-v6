---
audience: developer
complexity: beginner
created: '2025-08-21'
domain: core
estimated_shelf_life: 3 months
modified: '2025-08-23'
priority: P0
purpose: Rapid onboarding guide for truth seed implementation
session: '00042'
status: current
title: Quick Start Guide - Session 42
topics:
- quickstart
- guide
- onboarding
- truth-seed
type: guide
validation_method: manual
---

# QUICK-START-00042.md

## Where Things Are Now (Post-Pivot)

### Need the Plan?
→ `requirements/masterplans/AUTH-MASTERPLAN.md`  
→ `requirements/masterplans/DASHBOARD-MASTERPLAN.md`

### Need the Code?
→ `truth-seed/emdash-auth-main/` (auth gateway)  
→ `truth-seed/emdash-dashboard-main/` (dashboard)

### Need Credentials?
```bash
SUPABASE_URL="https://bbrheacetxlnqbibjwsz.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE"
```

### Working on Something?
→ Put WIP in `reconciliation/active-work/`  
→ Run Reality Agents to verify  
→ Move to `reality/` when complete

### Quick Commands

#### Start Session
```bash
./scripts/00028-session-start.sh [session-number]
```

#### Check Reality
```bash
# With credentials already included
./scripts/00042-reality-check-with-creds.sh --quick
```

#### Add Call Sign to Database (CRITICAL)
```sql
ALTER TABLE public.student
ADD COLUMN call_sign TEXT UNIQUE;
CREATE INDEX idx_student_call_sign ON public.student(call_sign);
```

### Three-Domain Flow
1. **Requirements** → Plans live here (masterplans)
2. **Reconciliation** → Active work happens here  
3. **Reality** → Completed work moves here

### Current Status
- **Auth Gateway**: Ready to deploy (see AUTH-MASTERPLAN.md)
- **Dashboard**: Needs call_sign added (see DASHBOARD-MASTERPLAN.md)
- **Database**: Missing call_sign column (add immediately)

### Session 42 Priority Actions
1. ✅ Domain reorganization complete
2. 🔄 Add call_sign column to Supabase
3. 🔄 Test auth gateway locally
4. 🔄 Deploy if testing succeeds

### Key Files to Review
- `/archive/sessions/SESSION-00041-HANDOFF.md` (detailed instructions)
- `requirements/masterplans/AUTH-MASTERPLAN.md` (implementation guide)
- `requirements/masterplans/DASHBOARD-MASTERPLAN.md` (dashboard completion)
- `DOMAIN-ORGANIZATION-00041.md` (where things belong)

### Reality Agent Verification
Before and after any work:
```bash
SUPABASE_URL="https://bbrheacetxlnqbibjwsz.supabase.co" \
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE" \
./scripts/00028-reality-check.sh --quick
```

---

*Created by Session 00042 as a quick reference for the post-pivot structure*