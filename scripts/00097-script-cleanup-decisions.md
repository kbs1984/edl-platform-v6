---
session: "00097"
type: "decision"
status: "current"
created: "2025-08-28"
title: "Script Cleanup Decisions - What Serves Us"
purpose: "Make clear decisions about which scripts to keep, deprecate, or archive"
topics: ["scripts", "cleanup", "decisions", "technical-debt"]
priority: "P0"
domain: "core"
---

# Script Cleanup Decisions - Session 00097

## 📊 Analysis Summary
- **Total Scripts**: 121
- **Already YAMLized**: 23 (including 14 we just did)
- **Need Decisions**: 98 scripts

## 🎯 Clear Decisions

### 🗑️ ARCHIVE IMMEDIATELY (Obsolete)

#### Migration Era (Sessions 40-55) - 21 scripts
**Decision**: ARCHIVE ALL - Migration completed in Session 53
```bash
00040-*.* (4 scripts) - Early migration attempts
00042-*.* (1 script)  - Reality check variant
00044-*.* (4 scripts) - Dual verification era
00046-*.* (1 script)  - Database verification
00047-*.* (1 script)  - Auth testing
00050-*.* (5 scripts) - Batch creation/extraction
00053-*.* (4 scripts) - Migration integrity
00054-*.* (1 script)  - Late migration
```

#### Explicitly Obsolete (2 scripts)
```bash
00068-classify-scripts-lifecycle.py  # Contains OBSOLETE marker
00072-validate-single-file.py        # Contains OBSOLETE marker
```

#### Auth Confusion Era (3 scripts)
```bash
00076-auth-implementation.sh
00076-reconcile-auth-reality.py
00076-verify-auth-deployment.py
```

**Total to Archive**: 26 scripts

### ⚠️ NEED INVESTIGATION (Potentially Active)

#### Dashboard/TOS Scripts (9 scripts)
```bash
00029-tos-orchestrator.sh        # Check if still needed
00032-tos-dashboard.py           # Python version - active?
00034-tos-dashboard-enhanced.sh  # Enhanced version
00036-dashboard.sh                # Generic dashboard
00036-tos-dashboard-*.py/sh      # Multiple variants
```
**Action**: Check which TOS dashboard is canonical

#### YAML Management (Need Consolidation)
```bash
00058-yaml-query-demo.py         # Demo version
00059-add-yaml-batch.py          # Batch adding
00059-yaml-indexer.py            # Indexing tool
00059-yaml-maintenance.py        # Maintenance tool
00063-batch-yaml-add.sh          # Another batch tool
00068-fix-yaml-validation.py    # Validation fixer
00069-install-yaml-hooks.sh     # Git hooks
```
**Action**: Determine which YAML tools are still needed

#### Recent Session Scripts (87-91)
```bash
00087-*.* (7 scripts)  # Session 87 had heavy work
00091-*.* (5 scripts)  # Recent session work
```
**Action**: Review recent work for active tools

### ✅ KEEP (Likely Active)

#### Core Session Management
```bash
00028-context-loader.sh       # Used by startup
00028-handoff-detector.sh     # Used by startup
00028-generate-report.py      # Report generation
00029-requirements-check.sh   # Requirements validation
```

#### Testing Infrastructure
```bash
00087-test-auth-fixes.py      # Recent auth testing
00091-test-school-registration.sh  # Recent feature testing
```

## 🏗️ Proposed Actions

### Phase 1: Create Archive Structure
```bash
mkdir -p scripts/obsolete/{migration,auth-confusion,deprecated,experimental}
mkdir -p scripts/active/{session,yaml,testing,dashboard}
```

### Phase 2: Archive Obsolete (26 scripts)
```bash
# Migration era (21 scripts)
for session in {40..55}; do
  mv scripts/000${session}-*.* scripts/obsolete/migration/ 2>/dev/null
done

# Auth confusion (3 scripts)
mv scripts/00076-auth-*.* scripts/obsolete/auth-confusion/
mv scripts/00076-reconcile-*.* scripts/obsolete/auth-confusion/

# Explicitly obsolete (2 scripts)
mv scripts/00068-classify-scripts-lifecycle.py scripts/obsolete/deprecated/
mv scripts/00072-validate-single-file.py scripts/obsolete/deprecated/
```

### Phase 3: YAMLize and Categorize Remaining

#### High Priority to YAMLize (Core Tools)
1. `00028-context-loader.sh` - Session infrastructure
2. `00028-handoff-detector.sh` - Session infrastructure
3. `00032-tos-dashboard.py` - If still active
4. `00087-test-auth-fixes.py` - Recent testing
5. `00059-yaml-maintenance.py` - YAML management

#### Medium Priority (Session 87-91 work)
- Review what Session 87 and 91 created
- Determine if tools are one-time or ongoing

## 📈 Expected Outcome

### Before
- 121 scripts in flat directory
- No way to know what's active
- Constant confusion

### After
- ~26 scripts archived (obsolete)
- ~20-30 active scripts with YAML
- ~40-50 scripts needing review
- Clear registry showing status

## ❓ Questions for Decision

1. **TOS Dashboard**: Which variant is the canonical one?
   - `00032-tos-dashboard.sh` (bash - we use this?)
   - `00032-tos-dashboard.py` (python variant)
   - `00034-tos-dashboard-enhanced.sh`
   - Others?

2. **YAML Tools**: Which do we actively use?
   - `00059-yaml-query.py` ✅ (we know this is active)
   - `00059-yaml-maintenance.py` ?
   - `00059-yaml-indexer.py` ?
   - Others?

3. **Session 87 Scripts**: This session created 7 scripts - are they still needed?

4. **Testing Scripts**: Which test scripts are for ongoing use vs one-time debugging?

## 🚀 Next Step

**Execute Phase 2 archival of the 26 clearly obsolete scripts?**

This will immediately reduce clutter by 21% and remove confusion from migration-era scripts.