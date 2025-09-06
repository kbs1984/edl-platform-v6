---
session: "00143"
type: "checklist"
status: "active"
created: "2025-09-02"
title: "Pre-Build Housekeeping Checklist - Clean Foundation for Cyworld Development"
purpose: "Identify and address outdated content before serious identity-driven building begins"
topics: ["housekeeping", "obsolete", "cleanup", "preparation", "cyworld"]
priority: "P0"
domain: "reconciliation"
---

# Pre-Build Housekeeping Checklist

## Critical Issues to Address Before Building

### 1. Script Classification (175 files!) 🚨

**Current State**: 175 scripts in scripts/ directory, many obsolete after Cyworld pivot

**Action Needed**:
```bash
# Classification system from early sessions:
# ON = Currently active and useful
# OFF = Temporarily disabled but may be useful
# OBSOLETE = No longer relevant, can be archived
```

**Priority Scripts to Review**:
- [ ] Session 1-50 scripts (likely OBSOLETE - functional focus)
- [ ] Session 51-100 scripts (mixed - some useful)
- [ ] Session 101-143 scripts (likely ON - recent work)
- [ ] MCP-related scripts (definitely ON)
- [ ] Reality Agent scripts (ON - still needed)

**Key Scripts to Keep ON**:
- `00140-mcp-integrated-session-start.sh` - Current session starter
- `00142-progress-tracker.py` - Progress Matrix tracking
- `00136-enhanced-session-start.sh` - MCP workflow
- `00059-yaml-query.py` - Essential for finding work
- Reality Agent scripts - Validation still needed

### 2. Recovery Canon Correction 📝

**Issue**: Claims Guardian bug was empty insert at line 17
**Reality**: Was actually missing duplicate check

**Fix Required**:
```markdown
<!-- In core/RECOVERY-CANON.md -->
<!-- Replace the Guardian Empty Insert Bug section with: -->
### 1. Guardian Duplicate Prevention Bug (FIXED Session 143)
**Root Cause**: Missing check for existing guardian record
**Solution**: Check before insert, prevent UNIQUE constraint violations
```

### 3. Progress Matrix Priority Update 🎯

**Current**: Still shows functional priorities
**Needed**: Cyworld-based priorities

**SQL to Run**:
```sql
-- Reclassify based on Cyworld principles
UPDATE platform_progress_matrix SET priority = 'P0' 
WHERE feature_name IN ('Profile Customization', 'Visitor Tracking', 
                       'EmCoin Display', 'Achievement Gallery');

UPDATE platform_progress_matrix SET priority = 'P2'
WHERE feature_name LIKE '%Admin%' OR feature_name LIKE '%Report%';
```

### 4. Obsolete Components in active-work 🗑️

**Components Built with Functional Mindset**:
- [ ] Admin components (P2 now)
- [ ] Report generators (P2 now)
- [ ] Complex forms without identity hooks
- [ ] Pages without visitor tracking

**Components Needing Cyworld Retrofit**:
- [ ] Profile page (needs customization)
- [ ] Dashboard (needs EmCoin display)
- [ ] Friends list (needs visitor counts)
- [ ] Student sidebar (needs achievements)

### 5. Documentation Conflicts 📚

**Outdated Docs to Mark**:
- Early requirement docs (functional focus)
- Original masterplans (pre-Cyworld)
- Technical specs without identity consideration

**Add Warning Headers**:
```yaml
---
WARNING: PRE-CYWORLD DOCUMENT
This document predates the Session 141 Cyworld revelation.
Priorities and approaches may be outdated.
See: core/PHILOSOPHY-CANON.md for current approach
---
```

### 6. Test Suite Relevance ✅

**Tests to Review**:
- Functional tests (still needed but P2)
- Identity tests (don't exist yet - P0!)
- Performance tests (deprioritized)
- Engagement tests (need to create)

### 7. Database Migrations 💾

**Check for Conflicts**:
- Old migrations assuming functional priority
- Missing indexes for Cyworld queries
- Unused tables from abandoned features

### 8. UI Component Library 🎨

**Current Issue**: Components built for function, not expression

**Needed Refactors**:
- Add customization props to all components
- Include visitor tracking hooks
- Display EmCoin costs/rewards
- Show achievement requirements

## Quick Wins (Do These First)

### 1. Create OBSOLETE Directory
```bash
mkdir -p archive/obsolete/{scripts,components,docs}
```

### 2. Script Quick Audit
```bash
# Find scripts not modified in 30+ days
find scripts -type f -mtime +30 -name "*.sh" | head -20
```

### 3. Update CLAUDE.md
Add section about Cyworld pivot and what to ignore

### 4. Create "What to Ignore" List
Document for future sessions listing obsolete patterns

## Critical Questions Before Building

1. **Does this component help express identity?**
   - If no → Deprioritize or redesign

2. **Will students check this daily?**
   - If no → Add engagement hooks

3. **Can this be customized/personalized?**
   - If no → Add customization options

4. **Does this create social validation?**
   - If no → Add public/social elements

5. **Is there an EmCoin integration?**
   - If no → Consider adding rewards/costs

## Files Definitely Obsolete

### Scripts (move to archive/obsolete/scripts/):
- Early "fix" scripts for problems that no longer exist
- Performance optimization scripts (P2 now)
- Admin tool generators (P2 now)

### Docs (mark with warning header):
- Pre-Session 141 requirement docs
- Original functional specifications
- Performance optimization guides

### Components (mark for refactor):
- Pure functional components without identity
- Admin interfaces (P2)
- Report generators (P2)

## Files Definitely Keep Active

### Scripts:
- MCP integration scripts
- Reality Agent validators
- YAML query tools
- Progress tracking
- Session starters

### Docs:
- All Canons
- SEED LOGs
- Recent session logs/handoffs
- Cyworld implementation guides

### Components:
- Profile customization
- EmCoin displays
- Visitor tracking
- Achievement galleries
- Friend systems

## The Build-Ready Checklist

Before starting ANY new component:

- [ ] Reviewed Philosophy Canon principles
- [ ] Checked Priority Reorder Canon ranking
- [ ] Scored feature with Cyworld Test (>30/50)
- [ ] Queried existing work with YAML
- [ ] Verified not duplicating obsolete patterns
- [ ] Confirmed adds identity/engagement value
- [ ] Planned EmCoin integration
- [ ] Designed for customization
- [ ] Included social validation elements
- [ ] Added visitor tracking hooks

## Recommended Execution Order

1. **Immediate** (10 minutes):
   - Create obsolete directories
   - Update Recovery Canon
   - Mark 10 most obviously obsolete scripts

2. **Soon** (30 minutes):
   - Full script audit with ON/OFF/OBSOLETE
   - Update Progress Matrix priorities
   - Create "What to Ignore" document

3. **Before Next Major Build**:
   - Review all UI components for Cyworld alignment
   - Plan retrofits for existing components
   - Create identity-first component templates

## Success Criteria

Housekeeping is complete when:
- [ ] All scripts classified as ON/OFF/OBSOLETE
- [ ] Recovery Canon updated with correct info
- [ ] Progress Matrix reflects Cyworld priorities
- [ ] Obsolete files moved to archive
- [ ] "What to Ignore" list created
- [ ] Pre-build checklist in daily use

## Conclusion

This housekeeping is essential to prevent:
- Building on wrong foundations
- Following obsolete patterns
- Prioritizing functional over identity
- Confusing future sessions
- Wasting time on deprecated approaches

**Clean foundation → Clear building → Cyworld success**