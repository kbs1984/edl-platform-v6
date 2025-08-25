---
session: "00062"
type: "guide"
status: "current"
created: "2025-08-23"
title: "Root Directory Organization Strategy"
purpose: "Plan for organizing root files and improving YAML coverage"
topics: ["organization", "yaml", "file-structure", "cleanup"]
priority: "P1"
domain: "core"
related_to: ["00058-DIRECTORY-CONSOLIDATION-LOG.md", "00058-YAML-FILE-ORGANIZATION-SYSTEM.md"]
---

# Root Directory Organization Strategy

## Current State
- **57 session deliverable files** in root (00XXX-*.md)
- **8 core system files** in root (appropriate location)
- Mixed organization making navigation difficult

## Proposed Organization

### 1. Files to KEEP in Root (Core System Files)
These should stay in root but need YAML:

| File | Current YAML | Priority | Proposed Type |
|------|-------------|----------|---------------|
| CLAUDE.md | ❌ | P0 | guide |
| SYSTEM-INDEX.md | ✅ | P0 | index |
| RESTORATION-MASTERPLAN-V3.md | ✅ | P0 | architecture |
| PROJECT-STRUCTURE.md | ❌ | P1 | specification |
| QUICK-START-00042.md | ❌ | P1 | guide |
| DOMAIN-ORGANIZATION-00041.md | ❌ | P1 | architecture |

### 2. Files to MOVE to archive/session-deliverables/
All 00XXX-*.md files except critical guides:

**Keep in root (critical active guides):**
- 00031-CONSTITUTIONAL-OS-GUIDE.md
- 00031-WORKFLOW-BOUNDARIES.md
- 00042-TRUTH-SEED-ADOPTION-DECISION.md (authoritative)

**Move to archive/session-deliverables/:**
- All other 00XXX-*.md files (54 files)
- These are historical session outputs

### 3. Organization Plan

```bash
# Create directory structure
mkdir -p archive/session-deliverables/phase-1  # Sessions 01-30
mkdir -p archive/session-deliverables/phase-2  # Sessions 31-50
mkdir -p archive/session-deliverables/phase-3  # Sessions 51+

# Move files (examples)
mv 0000[1-9]-*.md 000[12][0-9]-*.md archive/session-deliverables/phase-1/
mv 003[1-9]-*.md 004[0-9]-*.md 00050-*.md archive/session-deliverables/phase-2/
mv 005[1-9]-*.md 006[0-9]-*.md archive/session-deliverables/phase-3/
```

## YAML Addition Priority

### Priority 1: Core System Files (Immediate)
```yaml
---
session: "multiple"  # For files spanning multiple sessions
type: "guide"       # or "index", "architecture", "specification"
status: "current"
created: "2025-XX-XX"
modified: "2025-08-23"
title: "Descriptive Title"
purpose: "One-line purpose"
topics: ["relevant", "topics"]
priority: "P0"
domain: "core"
estimated_shelf_life: "indefinite"
---
```

Files to update NOW:
1. CLAUDE.md - Your instructions (P0)
2. PROJECT-STRUCTURE.md - System structure (P1)
3. QUICK-START-00042.md - Navigation guide (P1)
4. DOMAIN-ORGANIZATION-00041.md - Domain structure (P1)

### Priority 2: Critical Guides in Root
1. 00031-CONSTITUTIONAL-OS-GUIDE.md
2. 00031-WORKFLOW-BOUNDARIES.md
3. 00031-PHASE-*.md guides

### Priority 3: Session Deliverables (Before Moving)
Add YAML to all 00XXX-*.md files before archiving them

## Expected Impact on Insights Dashboard

### Before:
- 11.5% coverage (110/949 files)
- Cluttered root directory
- Hard to find core docs

### After Adding YAML to Core Files:
- ~12-13% coverage
- Better type distribution
- Core docs discoverable

### After Full Organization:
- ~15-20% coverage
- Clean root (only 10-12 files)
- Clear navigation structure
- Better insights on doc types

## Quick Implementation Commands

```bash
# Step 1: Add YAML to core root files
python3 scripts/00061-add-yaml-frontmatter.py "CLAUDE.md" --all
python3 scripts/00061-add-yaml-frontmatter.py "PROJECT-STRUCTURE.md" --all
python3 scripts/00061-add-yaml-frontmatter.py "QUICK-START-00042.md" --all

# Step 2: Add YAML to critical guides
python3 scripts/00061-add-yaml-frontmatter.py "00031-*.md" --all

# Step 3: Check impact
./scripts/00062-yaml-compliance-check.sh
python3 scripts/00062-project-insights.py

# Step 4: Create archive structure (if approved)
mkdir -p archive/session-deliverables/{phase-1,phase-2,phase-3}

# Step 5: Move files (after adding YAML)
# [Commands to move files by session range]
```

## Benefits
1. **Cleaner root**: Only essential files remain
2. **Better navigation**: Clear where to find things
3. **Improved insights**: YAML on core files
4. **Historical preservation**: Session work archived properly
5. **Reduced clutter**: 57 → ~10 files in root

## Next Steps
1. Get approval for organization plan
2. Add YAML to core files first
3. Run insights to see impact
4. Then organize/move files if approved