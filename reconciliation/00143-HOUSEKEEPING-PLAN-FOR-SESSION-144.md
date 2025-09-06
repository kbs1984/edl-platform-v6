---
session: "00143"
type: "implementation-plan"
status: "ready-for-144"
created: "2025-09-02"
title: "Comprehensive Housekeeping Plan for Session 144 - Keep House Tidy Before Building"
purpose: "Provide Session 144 with a detailed, actionable plan to clean up obsolete content before serious Cyworld building"
topics: ["housekeeping", "cleanup", "organization", "obsolete", "maintenance"]
priority: "P0"
domain: "reconciliation"
estimated_hours: 2
---

# Comprehensive Housekeeping Plan for Session 144

## Executive Summary
Session 143 discovered 175 scripts and numerous outdated documents that need classification before serious Cyworld building begins. This plan provides Session 144 with a systematic approach to clean the house, preventing future confusion and ensuring all development aligns with our new identity-driven philosophy.

## The Housekeeping Mission

> **"A clean codebase is a fast codebase. A clear philosophy is a focused team."**

Before building the Cyworld of education, we must:
1. Remove obsolete patterns that promote functional-first thinking
2. Classify all tools as ON/OFF/OBSOLETE
3. Update canonical documents with corrections
4. Create clear "ignore lists" for future sessions
5. Establish ongoing maintenance protocols

---

## Phase 1: Script Audit & Classification (45 minutes)

### The ON/OFF/OBSOLETE System

```yaml
ON: Currently active and needed for daily work
OFF: Temporarily disabled but may be useful later
OBSOLETE: No longer relevant after Cyworld pivot
```

### Step 1.1: Create Classification Infrastructure (5 min)

```bash
# Create directories for organization
mkdir -p archive/obsolete/scripts/{functional,performance,admin}
mkdir -p archive/off/scripts
mkdir -p scripts/active

# Create classification tracker
cat > scripts/SCRIPT-CLASSIFICATION.md << 'EOF'
# Script Classification Status
Last Updated: Session 144
Total Scripts: 175
- ON: [to be counted]
- OFF: [to be counted]  
- OBSOLETE: [to be counted]

## Classification Rules
1. MCP-related → ON
2. Reality Agents → ON
3. Session starters → ON
4. YAML queries → ON
5. Progress tracking → ON
6. Performance optimization → OFF
7. Admin tools → OFF
8. Pre-Session 100 fixes → OBSOLETE
9. Functional-first builders → OBSOLETE
EOF
```

### Step 1.2: Quick Classification by Pattern (10 min)

```bash
# Find and classify by session number
# Sessions 1-50: Likely OBSOLETE (early exploration)
find scripts -name "000[0-4][0-9]-*" -type f | while read script; do
  echo "$script → OBSOLETE (early session)"
done > classification-batch1.txt

# Sessions 51-100: Need review (mixed)
find scripts -name "000[5-9][0-9]-*" -type f > needs-review.txt

# Sessions 101-143: Likely ON (recent work)
find scripts -name "00[1][0-4][0-9]-*" -type f | while read script; do
  echo "$script → ON (recent session)"
done > classification-batch2.txt

# MCP-related: Definitely ON
grep -l "mcp" scripts/*.* | while read script; do
  echo "$script → ON (MCP integration)"
done > classification-mcp.txt
```

### Step 1.3: Detailed Review List (20 min)

**Scripts to Keep ON (High Priority)**:
```bash
# Session starters
00140-mcp-integrated-session-start.sh → ON
00136-enhanced-session-start.sh → ON
00028-session-start.sh → ON (fallback)

# MCP tools
00136-create-informed-test.py → ON
00136-auto-pr.py → ON

# Progress tracking
00142-progress-tracker.py → ON
00142-populate-progress-matrix.py → ON
00142-canvas-requirements-mapper.js → ON

# YAML query system
00059-yaml-query.py → ON (CRITICAL)
00062-project-insights.py → ON
00067-auto-organize-files.py → ON

# Reality validation
All reality/agent-reality-auditor/* → ON
```

**Scripts to Mark OFF (May need later)**:
```bash
# Performance tools (P2 priority now)
*performance*.py → OFF
*optimize*.sh → OFF
*benchmark*.py → OFF

# Admin tools (P2 priority)
*admin*.py → OFF
*report*.py → OFF
```

**Scripts to Mark OBSOLETE**:
```bash
# Old fixes for resolved issues
*-fix-*.sh where session < 100 → OBSOLETE
*-patch-*.py → OBSOLETE
*-hotfix-*.sh → OBSOLETE

# Functional-first builders
*-crud-generator.py → OBSOLETE
*-admin-builder.py → OBSOLETE
```

### Step 1.4: Execute Classification (10 min)

```bash
# Move OBSOLETE scripts
while read line; do
  script=$(echo $line | cut -d' ' -f1)
  mv "$script" archive/obsolete/scripts/
done < obsolete-list.txt

# Move OFF scripts  
while read line; do
  script=$(echo $line | cut -d' ' -f1)
  mv "$script" archive/off/scripts/
done < off-list.txt

# Mark ON scripts with header comment
for script in scripts/*; do
  if grep -q "STATUS: ON" "$script"; then
    continue
  fi
  # Add status header
  echo "# STATUS: ON - Active and needed" | cat - "$script" > temp && mv temp "$script"
done
```

---

## Phase 2: Document Corrections (30 minutes)

### Step 2.1: Fix Recovery Canon (10 min)

**File**: `core/RECOVERY-CANON.md`

**Current Wrong Section**:
```markdown
### 1. Guardian Empty Insert Bug (BLOCKING ECONOMIC MODEL)
**Root Cause**: Line 17 in `guardian-actions.ts` - empty object insertion
```

**Replace With**:
```markdown
### 1. Guardian Duplicate Prevention Bug (FIXED Session 143)
**Symptoms**: 
- Guardian form submission fails on retry
- UNIQUE constraint violation errors
- Parents stuck in onboarding

**Root Cause**: Missing check for existing guardian record before insert

**Solution Applied (Session 143)**:
```typescript
// Check for existing record first
const { data: existingGuardian } = await supabase
  .from("guardian")
  .select("id")
  .eq("user_id", user.id)
  .single();

// Only insert if not exists
if (!existingGuardian) {
  // Insert guardian record
}
```

**Testing**: Submit form multiple times - should succeed without error
**Impact**: Unblocks entire economic model
```

### Step 2.2: Update Progress Matrix Priorities (10 min)

```sql
-- Run this SQL to reorder priorities based on Cyworld principles

-- First, set all current P0 functional items to P2
UPDATE platform_progress_matrix 
SET priority = 'P2',
    notes = 'Deprioritized after Cyworld pivot - functional feature'
WHERE priority = 'P0' 
  AND feature_name NOT IN (
    'Authentication', 
    'Guardian Onboarding Fix',
    'EmCoin Backend Foundation',
    'Visitor Tracking System'
  );

-- Elevate Cyworld features to P0
UPDATE platform_progress_matrix
SET priority = 'P0',
    notes = 'Elevated after Cyworld pivot - identity/engagement feature'
WHERE feature_name IN (
  'Profile Customization',
  'EmCoin Display', 
  'EmCoin Balance Display',
  'Achievement Gallery',
  'Daily Bonus System',
  'Friend Activity Feed',
  'Visitor Counter Display'
);

-- Mark admin features as P2
UPDATE platform_progress_matrix
SET priority = 'P2',
    notes = 'Admin feature - not student-facing'
WHERE feature_name LIKE '%Admin%' 
   OR feature_name LIKE '%Report%'
   OR feature_name LIKE '%Moderation%';
```

### Step 2.3: Add Warning Headers to Outdated Docs (10 min)

Create a script to add warnings:
```bash
#!/bin/bash
# add-obsolete-warnings.sh

docs_to_warn=(
  "requirements/early-specs/*.md"
  "reconciliation/pre-session-100/*.md"
  "docs/functional-first/*.md"
)

warning_header='---
⚠️ PRE-CYWORLD WARNING ⚠️
This document was created before the Session 141 Cyworld revelation.
Priorities and approaches may be outdated.

Current Guidance:
- Philosophy: core/PHILOSOPHY-CANON.md
- Priorities: core/PRIORITY-REORDER-CANON.md
- Vision: core/SEED-LOG-V6-EVOLUTION.md

Read with caution - functional thinking ahead!
---

'

for pattern in "${docs_to_warn[@]}"; do
  for file in $pattern; do
    if [ -f "$file" ]; then
      echo "$warning_header" | cat - "$file" > temp && mv temp "$file"
      echo "✓ Added warning to $file"
    fi
  done
done
```

---

## Phase 3: Create "What to Ignore" Guide (20 minutes)

### Step 3.1: Create the Guide Document

**File**: `core/WHAT-TO-IGNORE-GUIDE.md`

```markdown
---
session: "00144"
type: "guide"
status: "authoritative"
title: "What to Ignore Guide - Don't Build on Deprecated Foundations"
purpose: "Prevent future sessions from using obsolete patterns"
---

# What to Ignore Guide

## Obsolete Patterns (DO NOT USE)

### 1. Functional-First Development
❌ **Old Way**: Build complete CRUD, then add UI
✅ **Cyworld Way**: Build identity expression, functionality follows

### 2. Admin Tools as Priority
❌ **Old Way**: Admin dashboard before student features
✅ **Cyworld Way**: Student engagement before admin tools

### 3. Performance Over Engagement
❌ **Old Way**: Optimize for speed
✅ **Cyworld Way**: Optimize for daily visits

### 4. Private User Data
❌ **Old Way**: Hide user activity for privacy
✅ **Cyworld Way**: Public achievements for social validation

## Deprecated Scripts (ARCHIVED)

Located in `archive/obsolete/scripts/`:
- Pre-session 100 fixes
- Performance optimizers
- Admin generators
- Functional CRUD builders

## Outdated Documents (MARKED)

Look for ⚠️ PRE-CYWORLD WARNING ⚠️ headers:
- Early requirement specs
- Functional-first designs
- Performance optimization guides
- Privacy-first architectures

## Superseded Approaches

| Old Approach | New Approach | Why Changed |
|--------------|--------------|-------------|
| Tests first | Identity first | Engagement > Correctness |
| Private profiles | Public achievements | Social validation |
| Complex features | Simple + customizable | Expression > Function |
| Admin priority | Student priority | Users > Administrators |

## Still Valid (DO USE)

✅ Reality Agents - Still need validation
✅ YAML queries - Still prevent duplicates
✅ MCP integration - Still accelerates development
✅ Session logs - Still track progress
✅ Constitutional compliance - Still required
```

---

## Phase 4: Component Audit (25 minutes)

### Step 4.1: Identify Components Needing Cyworld Retrofit

```typescript
// Create component audit file
// reconciliation/active-work/dashboard/COMPONENT-AUDIT.md

# Component Cyworld Audit

## Needs Immediate Retrofit (P0)

### ProfilePage.tsx
Current: Displays basic info
Needed: 
- [ ] Visitor counter display
- [ ] Theme customization
- [ ] Achievement showcase
- [ ] EmCoin balance
- [ ] Status message/emoji

### Dashboard.tsx
Current: Functional overview
Needed:
- [ ] Today's visitors widget
- [ ] EmCoin balance prominent
- [ ] Daily bonus claim button
- [ ] Friend activity feed
- [ ] Achievement notifications

### FriendsList.tsx
Current: Simple list
Needed:
- [ ] Online status indicators
- [ ] Recent activity
- [ ] Visitor counts per friend
- [ ] EmCoin transfer buttons

## Can Wait (P1)

### TeamPage.tsx
- Add team achievements
- Team EmCoin pool
- Collective customization

## Deprioritized (P2)

### AdminDashboard.tsx
### ReportsPage.tsx
### ModerationTools.tsx
```

### Step 4.2: Create Retrofit Template

```typescript
// templates/cyworld-component-template.tsx

import { VisitorTracker } from '@/hooks/use-visitor-tracking'
import { EmCoinDisplay } from '@/components/emcoin/display'
import { CustomizationProvider } from '@/contexts/customization'

export function CyworldComponent({ children }) {
  // Every component should track visitors
  useVisitorTracking()
  
  // Every component should check customization
  const { theme, customCSS } = useCustomization()
  
  // Every component should consider EmCoin
  const { balance, canAfford } = useEmCoin()
  
  return (
    <div className={theme.classes} style={customCSS}>
      {/* Identity elements first */}
      <VisitorCounter />
      <EmCoinBalance />
      
      {/* Functional content second */}
      {children}
      
      {/* Social validation last */}
      <AchievementToast />
    </div>
  )
}
```

---

## Phase 5: Establish Ongoing Maintenance (20 minutes)

### Step 5.1: Create Housekeeping Checklist

**File**: `scripts/housekeeping-checklist.sh`

```bash
#!/bin/bash
# Weekly housekeeping checklist

echo "🧹 EDL Platform Housekeeping Checklist"
echo "======================================"

# 1. Check for new unclassified scripts
echo "📝 Checking for unclassified scripts..."
unclassified=$(find scripts -type f ! -exec grep -q "STATUS:" {} \; -print | wc -l)
if [ $unclassified -gt 0 ]; then
  echo "⚠️  Found $unclassified unclassified scripts"
else
  echo "✅ All scripts classified"
fi

# 2. Check for components without Cyworld features
echo "🎨 Checking for components missing identity features..."
missing_visitor=$(grep -L "useVisitorTracking" src/components/*.tsx | wc -l)
if [ $missing_visitor -gt 0 ]; then
  echo "⚠️  $missing_visitor components missing visitor tracking"
fi

# 3. Check Progress Matrix alignment
echo "📊 Checking Progress Matrix priorities..."
p0_functional=$(psql -c "SELECT COUNT(*) FROM platform_progress_matrix 
  WHERE priority='P0' AND feature_name LIKE '%Admin%'" | grep -o '[0-9]\+')
if [ $p0_functional -gt 0 ]; then
  echo "⚠️  Found $p0_functional admin features marked as P0"
fi

# 4. Check for outdated patterns
echo "🚫 Checking for deprecated patterns..."
grep -r "CRUD" --include="*.tsx" --include="*.ts" src/ | wc -l

echo ""
echo "Run weekly to keep house tidy!"
```

### Step 5.2: Add to Session Start Protocol

Add to `scripts/00140-mcp-integrated-session-start.sh`:

```bash
# Add after Reality Agent check
echo "🧹 Running housekeeping check..."
if [ -f "scripts/housekeeping-checklist.sh" ]; then
  ./scripts/housekeeping-checklist.sh | head -10
  echo "Full report: ./scripts/housekeeping-checklist.sh"
fi
```

---

## Success Metrics

Housekeeping is successful when:

- [ ] All 175 scripts classified as ON/OFF/OBSOLETE
- [ ] Recovery Canon updated with correct Guardian bug
- [ ] Progress Matrix priorities reflect Cyworld order
- [ ] "What to Ignore" guide created and prominent
- [ ] Component audit complete with retrofit plan
- [ ] Obsolete files moved to archive/obsolete/
- [ ] Warning headers added to outdated docs
- [ ] Housekeeping checklist added to session start
- [ ] No P0 admin features in Progress Matrix
- [ ] All ON scripts have STATUS header

---

## Time Estimate

**Total: 2 hours**

| Phase | Time | Priority |
|-------|------|----------|
| Script Classification | 45 min | CRITICAL |
| Document Corrections | 30 min | HIGH |
| "What to Ignore" Guide | 20 min | HIGH |
| Component Audit | 25 min | MEDIUM |
| Ongoing Maintenance | 20 min | MEDIUM |

---

## Quick Start for Session 144

```bash
# 1. Create infrastructure
mkdir -p archive/obsolete/{scripts,components,docs}
mkdir -p archive/off/scripts

# 2. Run quick classification
find scripts -name "000[0-4][0-9]-*" -type f -exec mv {} archive/obsolete/scripts/ \;

# 3. Fix Recovery Canon
vim core/RECOVERY-CANON.md
# Update Guardian bug section

# 4. Update Progress Matrix
psql $DATABASE_URL < update-priorities.sql

# 5. Create ignore guide
cat > core/WHAT-TO-IGNORE-GUIDE.md << 'EOF'
[Guide content from above]
EOF

echo "✅ Basic housekeeping complete!"
```

---

## Long-term Benefits

This housekeeping will:

1. **Prevent confusion** - Clear what's current vs obsolete
2. **Speed development** - No time wasted on wrong patterns
3. **Maintain focus** - Cyworld principles stay front-of-mind
4. **Enable scaling** - New developers know what to ignore
5. **Preserve history** - Obsolete work archived, not deleted

---

## Final Words to Session 144

This housekeeping isn't busywork—it's foundation work. A clean, well-organized codebase with clear classifications will:

- Save hours of confusion
- Prevent building on wrong patterns
- Keep focus on identity over function
- Make the Cyworld vision achievable

**Take the 2 hours. Future sessions will thank you.**

*"A clean house is a happy house. A clear vision is a successful platform."*

---

**Handoff complete. The house is ready to be cleaned.**