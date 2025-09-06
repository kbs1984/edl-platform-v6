---
session: "00124"
type: "decision-tree"
status: "ready"
created: "2025-08-31"
title: "Role Selector - Load Only What You Need"
purpose: "Help sessions identify their role and load appropriate context"
topics: ["role-selection", "context-management", "efficiency"]
priority: "P0"
domain: "reconciliation"
---

# Role Selector - Find Your Context in 30 Seconds

## STEP 1: What Are You Doing Today?

### 🏗️ "I'm building new features"
**You're a BUILDER**
```bash
# Load this (5 minutes):
cat reconciliation/00124-BUILDER-QUICK-CONTEXT.md
cat reconciliation/00124-QUICK-TABLE-REFERENCE.md

# Skip these:
- V6-VISION-BIG-PICTURE.md (400 lines)
- Platform history
- v5 failure analysis
- All 275 story summaries
```

### 🧪 "I'm testing existing features"  
**You're a TESTER**
```bash
# Load this (5 minutes):
cat reconciliation/00124-QUICK-TABLE-REFERENCE.md
ls reconciliation/active-work/dashboard/src/app/\(user-pages\)/
grep "95%" archive/sessions/SESSION-0011*.md

# Focus on:
- What features exist
- Known incomplete features
- Test commands
```

### 🔧 "I'm fixing bugs"
**You're a FIXER**
```bash
# Load this (3 minutes):
grep "ERROR\|FAILED" archive/sessions/SESSION-*.md | tail -20
mcp__supabase_dev__get_advisors(type="security")

# Focus on:
- Error patterns
- Common fixes
- RLS issues
```

### 📊 "I'm analyzing/investigating"
**You're an ANALYST**
```bash
# Load this (7 minutes):
cat reconciliation/00121-PHASE-0-REALITY-STATE-REPORT.md
python3 scripts/00059-yaml-query.py --topic "[your-topic]"

# Focus on:
- Evidence gathering
- Pattern recognition
- Metrics
```

### 🎯 "I'm planning strategy"
**You're a STRATEGIST**
```bash
# Load everything (60 minutes):
cat reconciliation/00123-V6-VISION-BIG-PICTURE.md
cat reconciliation/00123-MCP-INFRASTRUCTURE-PLAN.md
cat reconciliation/00124-MCP-INFRASTRUCTURE-PLAN-ADDENDUM.md

# You need the full picture
```

---

## STEP 2: Quick State Check (Everyone)

```bash
# 1. How many tables exist? (Should be 21)
mcp__supabase_dev__list_tables | wc -l

# 2. Any activity tables? (Should be 0)
mcp__supabase_dev__list_tables | grep activity

# 3. What features work?
- Auth: ✅
- Teams: ✅  
- Friends: ⚠️ (95% done)
- Chat: ⚠️ (routes only)
- Activities: ❌
- EmCoin: ❌
```

---

## STEP 3: Get Your Assignment

### If BUILDER:
```bash
# Get your 5 stories
head -n 200 requirements/P0-ACTIVITY-RUNTIME-STORIES.md | grep "US-"
# Pick first 5 unimplemented ones
```

### If TESTER:
```bash
# Get test list
cat reconciliation/00124-MCP-INFRASTRUCTURE-PLAN-ADDENDUM.md | grep -A30 "criticalFeatureTests"
```

### If FIXER:
```bash
# Get known issues
mcp__supabase_dev__get_advisors(type="security")
```

### If ANALYST:
```bash
# Pick your investigation
python3 scripts/00059-yaml-query.py --status incomplete
```

### If STRATEGIST:
You already know what to do.

---

## Time Comparison

### Old Way (Load Everything):
- Read 400+ lines of vision doc: 20 minutes
- Read infrastructure plan: 15 minutes
- Read addendum: 10 minutes
- Load all context: 15 minutes
- **Total: 60 minutes before starting**

### New Way (Role-Based):
- Identify role: 30 seconds
- Load role context: 5 minutes
- Quick state check: 2 minutes
- Get assignment: 3 minutes
- **Total: 10 minutes to productive work**

---

## Examples

### Session 125 (BUILDER)
```bash
# Total load time: 5 minutes
cat reconciliation/00124-BUILDER-QUICK-CONTEXT.md
mcp__supabase_dev__list_tables | grep activity
# Start building Activity Runtime Batch 1
```

### Session 126 (TESTER)
```bash
# Total load time: 5 minutes
ls reconciliation/active-work/dashboard/src/app/\(user-pages\)/
# Start testing Friends system
```

### Session 127 (STRATEGIST)
```bash
# Total load time: 60 minutes (needs everything)
cat reconciliation/00123-V6-VISION-BIG-PICTURE.md
# Plan next phase
```

---

*Pick your role. Load your context. Start working.*
*80% of sessions need 20% of context.*