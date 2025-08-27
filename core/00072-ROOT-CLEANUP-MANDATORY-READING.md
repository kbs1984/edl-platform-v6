---
session: "00072"
type: "guide"
status: "current"
created: "2025-08-25"
title: "Root Directory Cleanup - Mandatory Reading for Session 73"
purpose: "Provide essential context and warnings for completing root directory consolidation"
topics: ["root-cleanup", "directory-consolidation", "file-organization", "safety"]
priority: "P0"
domain: "core"
lifecycle: "ON"
audience: "developer"
complexity: "intermediate"
related_to: ["00065-FILE-ORGANIZATION-PROTOCOL.md", "00066-DESKTOP-CRITICAL-ANALYSIS.md", "00069-UNIFIED-FILE-SYSTEM-PROTOCOL.md"]
---

# Root Directory Cleanup - Mandatory Reading for Session 73

**Created by**: Session 00072  
**Purpose**: Ensure Session 73 has complete context for root cleanup  
**Critical**: Read this ENTIRELY before moving ANY directories  

## The Original Vision (Session 65)

The file organization protocol intended a **minimal root directory** with only essential items:

### What Should Be in Root
1. **Critical System Files** (no prefix needed):
   - `CLAUDE.md` - Session protocol
   - `PROJECT-STRUCTURE.md` - Directory map
   - `SYSTEM-INDEX.md` - System registry
   - `.gitignore`, `package.json`, etc. - Config files

2. **Domain Directories**:
   - `core/` - System infrastructure
   - `reality/` - Reality agents
   - `requirements/` - User stories
   - `reconciliation/` - Integration

3. **Special Directories**:
   - `archive/` - Historical records
   - `scripts/` - Tools
   - `pending/` - Unclassified
   - `truth-seed/` - External code

**Target**: 8-10 directories maximum in root

## Current State (Session 72)

We have **17 directories** in root - almost double the target:

```
archive/    auth/       core/       docs/       logs/
migrations/ pending/    reality/    reconciliation/
requirements/ schemas/  scripts/    shared/     supabase/
templates/  tests/      truth-seed/
```

## Why This Matters

1. **Cognitive Load**: 17 directories is overwhelming
2. **Navigation**: Hard to find the right domain
3. **Clarity**: Unclear what belongs where
4. **Original Intent**: Sessions 65-70 never finished this

## The Session 66 Safety Pivot

### Desktop's Critical Warning
Session 66 received a warning that naive reorganization would:
- Break 73% of references
- Lose git history
- Create irreversible damage

### Safety Infrastructure Built
As a result, Session 66 built THREE critical tools:

1. **Reference Mapper** (`scripts/00066-reference-mapper.py`)
   - Finds all cross-references
   - Predicts what breaks
   - Must run BEFORE moves

2. **Rollback Manager** (`scripts/00066-create-rollback.py`)
   - Creates restoration points
   - Generates undo scripts
   - Your safety net

3. **Migration Readiness** (`scripts/00066-migration-readiness.py`)
   - Scores safety from 0-100%
   - Blocks if <80% ready
   - Run before ANY moves

## Critical Lessons from Sessions 67-72

### Session 67: Auto-Organization Works
- Successfully moved 24 files
- Zero broken references
- Git history preserved with `git mv`

### Session 68: Root Files Can Move
- Moved 10 critical root files to core/
- System continued functioning
- Path updates were manageable

### Session 71: Test Everything
- Found critical bugs through testing
- "Implementation reveals truth"
- Test moves with single directory first

### Session 72: YAML is Clean
- Fixed last validation errors
- System ready for moves
- Created single-file validator

## Specific Directory Analysis

### Must Move (9 directories)
| Directory | Why It Exists | Where It Goes | Complexity |
|-----------|---------------|---------------|------------|
| `auth/` | Auth implementation | `reconciliation/active-work/auth/` | Medium - check imports |
| `docs/` | Documentation | `core/docs/` | Easy - few references |
| `logs/` | System logs | `archive/logs/` | Easy - historical |
| `migrations/` | DB migrations | `reconciliation/migrations/` | Medium - SQL paths |
| `schemas/` | DB schemas | `requirements/schemas/` | Easy - few refs |
| `shared/` | Shared code | `reconciliation/active-work/shared/` | High - many imports |
| `supabase/` | Config | `core/config/supabase/` | Medium - config paths |
| `templates/` | Templates | `core/templates/` | Easy - rarely used |
| `tests/` | Test files | Split by domain | High - test runners |

### Must NOT Move
- `truth-seed/` - External code, not ours
- `.next/`, `node_modules/` - Generated
- Hidden files (`.git/`, `.gitignore`, etc.)

## Hardcoded Path Risks

### Known Paths to Check
```bash
# Search for hardcoded paths before moving
grep -r "auth/" scripts/
grep -r "docs/" *.md
grep -r "migrations/" scripts/
grep -r "supabase/" reconciliation/
```

### Update These Files After Moves
- `PROJECT-STRUCTURE.md` - Directory documentation
- `SYSTEM-INDEX.md` - System registry
- `package.json` - If it has path references
- Any scripts with hardcoded paths

## Step-by-Step Safety Protocol

### Before Moving ANYTHING
1. Run readiness check: `python3 scripts/00066-migration-readiness.py`
2. Score must be >90% (was 96% in Session 66)
3. Create rollback: `python3 scripts/00066-create-rollback.py`
4. Map references: `python3 scripts/00066-reference-mapper.py`

### For Each Directory Move
1. Check content: `ls -la [directory]`
2. Search for references: `grep -r "[directory]/" .`
3. Use git mv: `git mv [old] [new]`
4. Test immediately: Verify nothing broke
5. Update references: Fix any broken paths

### After All Moves
1. Run validation: `./scripts/00059-yaml-health-check.sh`
2. Check references: `python3 scripts/00066-reference-mapper.py`
3. Update documentation: PROJECT-STRUCTURE.md
4. Commit with clear message

## The "Auto-Compact" Incident

The user mentioned attempting "auto-compact" but stopping (ESC) to preserve context. This was wise because:

1. **Context Loss**: Automated moves without understanding = disaster
2. **Safety First**: Session 66's lesson about infrastructure
3. **Human Judgment**: Some decisions need understanding

Session 73 now has full context to complete this safely.

## Success Checklist

- [ ] Read all mandatory documents
- [ ] Understand which directories move where
- [ ] Run safety tools before moves
- [ ] Use git mv exclusively
- [ ] Test after each move
- [ ] Update documentation
- [ ] Create comprehensive commit

## Final Wisdom

> "The best reorganization is one you can undo" - Session 66

> "Test reveals truth, assumptions hide bugs" - Session 71

> "Complete the vision, minimize the root" - Session 72

---

*This document ensures Session 73 starts with complete context.*  
*Read it fully. The safety infrastructure exists. Use it.*