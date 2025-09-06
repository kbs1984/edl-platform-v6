---
session: "00146"
type: "strategic-addendum"
status: "mandatory"
created: "2025-09-03"
title: "Strategic Addendum to Session 147's Mandatory Context - Evidence & Automation Timing"
purpose: "Provide critical additions to the mandatory reading list including Evidence Protocol and strategic automation timing"
topics: ["evidence-protocol", "automation-timing", "build-strategy", "context-addendum"]
priority: "P0"
domain: "reconciliation"
augments: ["00147-MANDATORY-CONTEXT-FOR-BUILD-SESSIONS.md"]
---

# Strategic Addendum to Session 147's Mandatory Context

## 🚨 CRITICAL ADDITIONS - Read BEFORE Session 147's List

### 0️⃣ Evidence Imperative Protocol (ABSOLUTELY FIRST)

**This prevented Session 144's disaster. Read it or risk repeating it.**

```bash
# MANDATORY - Before writing ANY code
cat core/00145-EVIDENCE-IMPERATIVE-PROTOCOL.md

# Quick Evidence Checks (memorize these):
grep -r "filename" . --exclude-dir=node_modules   # Before deleting ANYTHING
npm run build                                      # Before claiming "complete"
npm test                                          # Before marking "validated"
git status                                        # Before moving files

# The Session 144 Lesson:
# They moved critical scripts without checking usage
# Result: Nearly broke primary infrastructure
# Prevention: ALWAYS gather evidence before action
```

### 0.5️⃣ Working Directory Verification

**Session 96 established this. Violations cause truth-seed contamination.**

```bash
# CRITICAL: Verify your location BEFORE any edits
pwd  # MUST be: /home/b4sho/edl-projects-with-claude/edl-platform-v6

# ALL development happens here:
cd reconciliation/active-work/dashboard  # Frontend work
cd reconciliation/active-work/auth-gateway  # Auth work

# NEVER edit these (READ-ONLY):
truth-seed/*  # Reference only - Session 42 decision is FINAL
archive/*     # Historical record - don't modify

# Quick check before starting:
ls -la | grep reconciliation  # Should see the directory
cd reconciliation/active-work/dashboard && pwd  # Confirm location
```

---

## 📊 Progress Matrix Updates (After Each Feature)

**Don't let progress tracking go stale. Update immediately after completion.**

```sql
-- After creating safety tables (Session 148)
mcp__supabase-dev__execute_sql(query="
  UPDATE platform_progress_matrix 
  SET status = 'implemented',
      implemented_by = array_append(implemented_by, '148'),
      database_tables = jsonb_build_array('linked_players', 'user_states'),
      updated_at = NOW(),
      notes = 'Safety architecture: 6-player limit and grey state system'
  WHERE feature_name = 'Safety Tables'
  OR feature_name = 'User State Management'
")

-- After addiction bar is working (Session 148)
mcp__supabase-dev__execute_sql(query="
  UPDATE platform_progress_matrix 
  SET status = 'validated',
      implemented_by = array_append(implemented_by, '148'),
      ui_components = jsonb_build_array('addiction-bar.js', 'animations.js'),
      reality_health = 95.0,
      updated_at = NOW()
  WHERE feature_name = 'Addiction Bar'
")
```

---

## 🧪 Validation Commands (Before Claiming Success)

**A feature isn't complete until it's validated. No exceptions.**

```bash
# Technical Validation
npm run build          # Must succeed without errors
npm run typecheck      # TypeScript happy?
npm run lint          # Code quality pass?

# Local Testing
npm run dev           # Start dev server
# Then manually verify:
# 1. Navigate between 3+ pages
# 2. Addiction bar stays visible?
# 3. Animations trigger < 2 seconds?
# 4. LocalStorage has correct keys?
# 5. Console has no errors?

# Reality Validation (if configured)
python3 reality/agent-reality-auditor/orchestrator.py
# Look for consensus > 90%

# Psychology Validation (THE REAL TEST)
# Ask yourself:
# - Do I want to refresh to see the animation again?
# - Am I curious about my streak?
# - Does the EmCoin count feel satisfying?
# If NO to any → Feature is BROKEN regardless of technical success
```

---

## 🤖 n8n Automation Timing Strategy

### Why NOT Session 148-149

**Core Principle**: Automation needs something to automate.

```yaml
What we DON'T have yet:
- No PR workflow (building locally)
- No completed features (just starting)  
- No daily mechanics (not built yet)
- No users generating data

What n8n would be doing:
- Waiting for webhooks that won't come
- Automating empty workflows
- Adding complexity without value
```

### Why Session 150+ is PERFECT for n8n

```yaml
What we'll have by then:
- ✅ Addiction bar working (something to track)
- ✅ Daily mechanics running (something to automate)
- ✅ 5-10 features complete (progress to monitor)
- ✅ Real workflow patterns (evidence for automation)

What n8n can actually do:
- Auto-update progress matrix on commits
- Reset daily counters at midnight
- Process achievement unlocks
- Monitor streak continuity
```

### The Strategic Sequence

```mermaid
Session 148-149: BUILD CORE
    ↓
  [Addiction mechanics working]
    ↓
Session 150: AUTOMATE
    ↓
  [n8n Part 1: Progress tracking]
  [n8n Part 2: Daily mechanics]
    ↓
Session 151+: SCALE
    ↓
  [Build features with automation running]
```

### Manual Updates Are OK (Temporarily)

```bash
# Sessions 148-149 will update maybe 10 features manually
# Time per update: 30 seconds
# Total overhead: 5 minutes
# Delay to implement n8n first: 4 hours
# ROI calculation: Not worth it YET

# Quick manual update template:
mcp__supabase-dev__execute_sql(query="
  UPDATE platform_progress_matrix 
  SET status = 'implemented', 
      implemented_by = array_append(implemented_by, 'SESSION_NUMBER')
  WHERE feature_name = 'FEATURE_NAME'
")
```

---

## 🎯 The Build Priority Stack

### Focus Hierarchy for Sessions 148-149

```
1. ADDICTION MECHANICS (P0.0)
   ├── Safety tables (grey state, 6-player)
   ├── Global addiction bar  
   ├── < 2 second dopamine
   └── Exact v5 timings

2. AUTOMATION (P1 - Session 150+)
   ├── n8n Part 1 (progress tracking)
   ├── n8n Part 2 (daily mechanics)
   └── n8n Part 3 (evidence enforcement)

3. FUTURE FEATURES (P2 - Session 151+)
   ├── Continue Activity Runtime
   ├── Guardian portal
   └── Remaining 250+ user stories
```

### The Core Insight

**Build the product first, automate the process second.**

Users get addicted to products, not processes. Every hour spent on automation before the addiction loop works is an hour not spent hooking users.

---

## 📝 Final Checklist Before Starting

```bash
□ Read Evidence Imperative Protocol
□ Verify working directory (reconciliation/active-work/*)
□ Understand addiction mechanics > automation
□ Know the validation commands
□ Have progress matrix update ready
□ Accept manual updates for now
□ Focus on psychological success, not just technical
```

---

## 💡 The Strategic Wisdom

From Session 146's experience reviewing 25+ sessions:

> "Perfect automation of nothing is still nothing.  
> Imperfect delivery of addiction mechanics hooks users.  
> Build what matters first, automate what works second."

The preparation wasn't excessive - it was insurance against Session 144-type disasters. But now it's time to BUILD. Sessions 148-149 should measure success in dopamine delivered, not processes automated.

---

*Addendum by Session 146 - The strategic oversight session*