---
session: "00124"
type: "strategy-guide"
status: "ready"
created: "2025-08-31"
modified: "2025-08-31"
title: "Context Loading Strategy - Managing Cognitive Load for Future Sessions"
purpose: "Break down the massive context into digestible, role-specific chunks to prevent cognitive overload"
topics: ["context-management", "cognitive-load", "session-efficiency", "role-based-loading"]
priority: "P0"
domain: "reconciliation"
---

# Context Loading Strategy - Managing Cognitive Load for Future Sessions

## The Problem

Session 123's V6-VISION-BIG-PICTURE.md is 412 lines of dense information covering:
- Platform history (v5 failure, v6 pivot)
- Current state (21 tables, what exists)
- Future scope (275 stories, 80% to build)
- Technical stack details
- Implementation strategies
- Success metrics
- Reference architecture

**Result**: Information overload that prevents focused execution.

---

## Proposed Solution: Role-Based Context Loading

### Core Principle: "Load Only What You Need"

Instead of loading everything, sessions should load based on their role:

```
ROLE-BASED LOADING MATRIX
├── 🏗️ Builder Role (Feature Implementation)
├── 🧪 Tester Role (Validation & Quality)
├── 🔧 Fixer Role (Bug Resolution)
├── 📊 Analyst Role (Evidence Gathering)
└── 🎯 Strategist Role (Planning & Architecture)
```

---

## Context Breakdown by Role

### 🏗️ BUILDER ROLE CONTEXT (Implementing Features)

**Essential Context (~50 lines):**
```yaml
current_state:
  - 21 tables exist (list them)
  - Truth-seed provides foundation
  - Active-work is where you build
  
what_to_build:
  - Your assigned stories (5-10 max)
  - Required tables for those stories
  - Dependencies on existing features
  
how_to_build:
  - MCP for DDL operations
  - Migration tracking required
  - Test after each batch
  - Reality Agent validation
```

**Skip These Sections:**
- v5 failure history
- Platform philosophy
- Success metrics
- All 275 story summaries

**Load Command:**
```bash
# Builder Quick Load (~5 minutes)
cat reconciliation/00124-BUILDER-CONTEXT.md  # New focused doc
grep "US-XXX" requirements/P0-*.md  # Just your stories
mcp__supabase-dev__list_tables  # Current state
```

---

### 🧪 TESTER ROLE CONTEXT (Validation)

**Essential Context (~40 lines):**
```yaml
existing_features:
  - Auth (Session 42-75)
  - Teams (Session 112)
  - Friends (Session 117, 95% issue)
  - Chat (Session 119 routes)
  
testing_approach:
  - Puppeteer MCP for browser tests
  - Reality Agents for state validation
  - 95% syndrome prevention
  
known_issues:
  - Guardian has no UI
  - Debate is placeholder
  - Some features untested
```

**Skip These Sections:**
- Implementation details
- DDL operations
- Story breakdowns
- v5 patterns

**Load Command:**
```bash
# Tester Quick Load (~5 minutes)
cat reconciliation/00124-TESTER-CONTEXT.md
ls reconciliation/active-work/dashboard/src/app/\(user-pages\)/
grep "95%" archive/sessions/SESSION-0011*
```

---

### 🔧 FIXER ROLE CONTEXT (Bug Resolution)

**Essential Context (~30 lines):**
```yaml
common_problems:
  - Profile vs profiles naming
  - RLS blocking access
  - Missing routes (chat example)
  - Incomplete features (95% syndrome)
  
debugging_tools:
  - mcp__supabase-dev__execute_sql
  - Reality Agents for verification
  - Error patterns from past sessions
```

**Load Command:**
```bash
# Fixer Quick Load (~3 minutes)
cat reconciliation/00124-FIXER-CONTEXT.md
grep "ERROR\|FAILED" archive/sessions/SESSION-*.md | tail -20
```

---

### 📊 ANALYST ROLE CONTEXT (Evidence Gathering)

**Essential Context (~60 lines):**
```yaml
evidence_sources:
  - Session logs (what was done)
  - Reality Agent outputs
  - Database state via MCP
  - Test results
  
key_patterns:
  - Session 121-122 methodology
  - Anti-guesswork protocol
  - Evidence before assumptions
  
metrics_to_track:
  - Stories completed
  - Tests passing
  - Reality consensus
```

**Load Command:**
```bash
# Analyst Quick Load (~7 minutes)
cat reconciliation/00121-PHASE-0-REALITY-STATE-REPORT.md
python3 scripts/00059-yaml-query.py --session "012*"
```

---

### 🎯 STRATEGIST ROLE CONTEXT (Full Picture)

**Essential Context (Full ~400 lines):**
- Everything in V6-VISION-BIG-PICTURE.md
- MCP-INFRASTRUCTURE-PLAN.md
- Evidence reports
- All user story summaries

**This is the only role that needs everything.**

---

## Recommended Context Documents to Create

### 1. Quick Reference Cards (1-page each)

```markdown
# 00124-QUICK-REF-TABLES.md
Current Tables (21):
- public: profile, student, team, guardian...
- chat: room, message, participant

Missing Tables (Activity Runtime):
- activity, activity_session, activity_instance...
```

```markdown
# 00124-QUICK-REF-FEATURES.md
Working Features:
- Auth ✅ (Session 42-75)
- Teams ✅ (Session 112)  
- Friends ⚠️ (95% complete)
- Chat ⚠️ (routes only)

Not Built:
- Activities ❌
- EmCoin ❌
- Badges ❌
```

### 2. Role-Specific Guides

```markdown
# 00124-BUILDER-CONTEXT.md
If you're building features, you need:
1. Your 5 assigned stories
2. Tables they require
3. MCP DDL commands
4. Test requirements
[30-40 lines max]
```

```markdown
# 00124-TESTER-CONTEXT.md
If you're testing, you need:
1. What features exist
2. Known issues
3. Test commands
4. Pass criteria
[30-40 lines max]
```

### 3. Decision Trees

```markdown
# 00124-DECISION-TREE.md
Q: What are you doing today?

Building new feature?
  → Load BUILDER-CONTEXT.md
  → Skip history/philosophy
  
Fixing bugs?
  → Load FIXER-CONTEXT.md
  → Focus on error patterns
  
Testing existing?
  → Load TESTER-CONTEXT.md
  → Check known issues first
  
Planning strategy?
  → Load everything (you're the strategist)
```

---

## Implementation for Session 125

### Recommended Approach

**DON'T** load everything. Session 125 is a BUILDER, so:

```bash
# Session 125 Focused Load (10 minutes max)
# 1. Current state
mcp__supabase-dev__list_tables | grep -c "activity"  # Should be 0

# 2. What to build
head -100 requirements/P0-ACTIVITY-RUNTIME-STORIES.md  # First 5 stories only

# 3. How to build  
cat reconciliation/00124-MCP-INFRASTRUCTURE-PLAN-ADDENDUM.md | grep -A20 "Phase 1"

# 4. Skip everything else!
```

### Context Loading Phases

**Phase 1: Immediate Need (5 minutes)**
- What tables exist now?
- What am I building today?
- What tools do I use?

**Phase 2: Implementation Details (5 minutes)**
- Specific story requirements
- DDL for my tables
- Test criteria

**Phase 3: Only If Blocked (Load as needed)**
- Error patterns
- Past solutions
- Reality Agent help

---

## Benefits of This Approach

### Cognitive Load Reduction
- 50-100 lines instead of 400+
- Role-specific instead of everything
- Progressive loading as needed

### Faster Session Startup
- 10 minutes instead of 60
- Direct to implementation
- Less context switching

### Better Focus
- Clear objectives
- Relevant information only
- Reduced decision paralysis

### Easier Handoffs
- Next session knows their role
- Loads only what they need
- Can dive deeper if required

---

## Metrics for Success

**Current State (Session 123-124 approach):**
- Context load time: 60+ minutes
- Information retained: ~30%
- Time to first action: 90+ minutes

**Target State (Role-based approach):**
- Context load time: 10 minutes
- Information retained: 80%
- Time to first action: 15 minutes

---

## Next Steps

1. Create the role-specific context documents
2. Test with Session 125 (Builder role)
3. Refine based on feedback
4. Create quick reference cards
5. Update session protocol to include role selection

---

*Session 124 - Solving the context overload problem*
*Less is more when it comes to cognitive load*