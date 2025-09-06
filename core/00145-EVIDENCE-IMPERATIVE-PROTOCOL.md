---
session: "00145"
type: "protocol"
status: "authoritative"
created: "2025-09-03"
title: "Evidence Imperative Protocol - Anti-Guesswork Enforcement"
purpose: "Mandatory protocol preventing assumption-based decisions that have repeatedly caused damage"
topics: ["protocol", "evidence", "anti-guesswork", "verification", "enforcement"]
priority: "P0"
domain: "core"
canonical: true
enforced_by: ["session-start-scripts", "CLAUDE.md", "workflow-enforcer"]
---

# 🛑 EVIDENCE IMPERATIVE PROTOCOL - Anti-Guesswork Enforcement

## ⚠️ MANDATORY - VIOLATIONS HAVE CAUSED CRITICAL FAILURES

### Recent Violations and Their Damage:
- **Session 144**: Moved scripts based on number patterns → Nearly destroyed session infrastructure
- **Session 145**: Restored scripts based on CLAUDE.md references → Restored obsolete tools
- **Sessions 80-83**: Rediscovered existing solutions → Wasted 12+ hours
- **Sessions 44-55**: Assumed database state → 11 sessions of confusion

## 🔴 THE IMPERATIVE: Evidence Over Assumptions

**Before ANY file operation, code change, or architectural decision:**

### 1. STOP - Before Moving/Deleting/Modifying Files
```bash
# ❌ NEVER DO THIS:
mv scripts/00*.py obsolete/  # Pattern-based assumption

# ✅ ALWAYS DO THIS:
1. Read the file's purpose
2. Check if it's referenced: grep -r "filename" .
3. Verify if newer tools replace it
4. Document why it's being moved
5. Get confirmation if uncertain
```

### 2. VERIFY - Before Building Anything
```bash
# The 5-Step Verification Protocol:

# Step 1: Query existing work (15 seconds)
python3 scripts/00059-yaml-query.py --topic "[FEATURE]"

# Step 2: Check for similar implementations
grep -r "[FEATURE]" reconciliation/ --include="*.md"

# Step 3: Verify in database if relevant
mcp__supabase-dev__list_tables()

# Step 4: Read recent session logs
cat archive/sessions/SESSION-*-LOG.md | tail -500 | grep -i "[FEATURE]"

# Step 5: Only build if nothing exists
```

### 3. TEST - Before Claiming Completion
```typescript
// ❌ NEVER:
"I've created the components" // Without testing

// ✅ ALWAYS:
1. Run the actual code
2. Check TypeScript compilation
3. Verify database queries work
4. Test user interactions
5. Document what actually works vs what doesn't
```

## 🚨 Common Anti-Patterns That Violate This Protocol

### Pattern Matching Fallacy
```
❌ "Files numbered 00-49 must be old"
❌ "Referenced in docs means it's critical"
❌ "Similar name means same purpose"
✅ Read each file's actual purpose and current usage
```

### Assumption Cascade
```
❌ One script moved → Move all similar scripts
❌ One table has issue → All tables have issues
❌ One fix worked → Apply everywhere
✅ Verify each case individually
```

### Retroactive Justification
```
❌ "It seemed logical at the time"
❌ "The pattern suggested..."
❌ "I assumed based on..."
✅ Evidence first, patterns second
```

## 📋 Enforcement Checklist (Print & Follow)

Before file operations:
- [ ] Read file header/purpose
- [ ] Check references with grep
- [ ] Verify replacement tools exist
- [ ] Document rationale
- [ ] Get confirmation if >5 files

Before building features:
- [ ] Query YAML for existing work
- [ ] Check database for tables
- [ ] Read recent sessions
- [ ] Test similar components
- [ ] Verify nothing exists

Before claiming success:
- [ ] Code runs without errors
- [ ] TypeScript compiles
- [ ] Database queries work
- [ ] User can use feature
- [ ] Document limitations

## 🔧 Tools for Evidence Gathering

### Quick Verification Commands
```bash
# Find what references a file
grep -r "filename" . --exclude-dir=node_modules

# Check file purpose
head -30 [file] | grep -i "purpose\|description"

# Query existing work
python3 scripts/00059-yaml-query.py --topic [topic]

# Verify database state
mcp__supabase-dev__list_tables()
mcp__supabase-dev__execute_sql("SELECT * FROM [table] LIMIT 1")

# Check recent work
ls -la archive/sessions/SESSION-14*-LOG.md
```

## 💡 Why This Protocol Exists

**Assumptions compound exponentially:**
- 1 wrong assumption → 2 wrong actions
- 2 wrong actions → 4 wrong outcomes  
- 4 wrong outcomes → 8 sessions to fix

**Evidence compounds linearly:**
- 1 verification → 1 correct action
- 1 correct action → 1 working feature
- 1 working feature → 0 sessions to fix

## 🎯 The Test

Before any action, ask:
1. **"What evidence do I have?"** - Not patterns, actual proof
2. **"What am I assuming?"** - List them explicitly
3. **"How can I verify?"** - Before acting
4. **"What if I'm wrong?"** - Consider damage

## 📝 Session Integration

This protocol is:
- Loaded at session start
- Referenced in CLAUDE.md
- Enforced by workflow scripts
- Checked by Reality Agents
- Part of handoff requirements

## Remember

**The best code is code you don't write because you verified it already exists.**

**The worst damage is from assumptions that seemed logical at the time.**

**Evidence is Emperor. Assumptions are Assassins.**

---

*Session 145: Created after violating our own protocol while investigating another violation*