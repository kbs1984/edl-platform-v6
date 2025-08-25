---
session: "00068"
type: "specification"
status: "current"
created: "2025-08-25"
title: "Safeguarding Integration Plan - File Structure & Workflow Updates"
purpose: "Integrate new file organization into existing workflows and agents"
topics: ["integration", "safeguarding", "workflow", "agents", "file-structure"]
priority: "P0"
domain: "core"
lifecycle: "ON"
---

# Safeguarding Integration Plan - File Structure & Workflow Updates

## Executive Summary

Session 67 reorganized files but didn't update the systems that depend on them. This plan integrates the new structure into our workflows and agents, creating a safeguarding feature that prevents future confusion.

## What Session 67 Left Behind

### ✅ Completed
- 24 files moved from archive to core/
- Auto-organization tool created and tested
- YAML validation fixes applied

### ❌ Not Integrated
1. **Reality Agents** still look for files in old locations
2. **Workflow scripts** have hardcoded paths to moved files
3. **Session startup** references outdated locations
4. **CLAUDE.md** doesn't reflect new structure
5. **Phase-3 files** (32 files) still need organizing
6. **Scripts directory** (200+ files) needs lifecycle classification

## Critical Integration Tasks

### 1. 🔴 Update Reality Agents (PRIORITY P0)

Reality Agents are the foundation of system truth. They MUST know the new structure.

#### FileSystem Agent Updates
```python
# Current: Looks in archive/session-deliverables/
# Needed: Look in core/ for essential docs

# File: reality/agent-reality-auditor/filesystem-connector/quickstart.py
CRITICAL_PATHS = {
    "core_docs": "core/",  # NEW: Primary documentation
    "phase_guides": "core/00031-PHASE-*.md",  # NEW: Constitutional OS
    "protocols": "core/00031-*PROTOCOL*.md",  # NEW: Key protocols
    "archive": "archive/",  # Still exists but secondary
}
```

#### Integration Agent Updates
```python
# Must understand new structure for consensus scoring
STRUCTURE_WEIGHTS = {
    "core/": 1.0,      # Highest weight - active docs
    "scripts/": 0.8,   # Active tools
    "archive/": 0.3,   # Historical reference only
    "pending/": 0.5,   # Needs classification
}
```

### 2. 🔴 Update Session Startup Scripts (PRIORITY P0)

Session startup is how every session begins. It MUST work correctly.

#### Update 00028-session-start.sh
```bash
# Current references to moved files
OLD: archive/session-deliverables/phase-2/00031-CONSTITUTIONAL-OS-GUIDE.md
NEW: core/00031-CONSTITUTIONAL-OS-GUIDE.md

OLD: archive/session-deliverables/phase-2/00031-WORKFLOW-BOUNDARIES.md  
NEW: 00031-WORKFLOW-BOUNDARIES.md  # Still in root!

# Need to update path references in:
- scripts/00028-session-start.sh
- scripts/00028-context-loader.sh
- scripts/00028-handoff-detector.sh
```

### 3. 🟡 Update CLAUDE.md (PRIORITY P1)

CLAUDE.md is the authoritative guide for all sessions. Must reflect new structure.

#### Required Updates
```markdown
## File Organization (Session 67-68 Update)

### Current Structure
- **core/**: Essential platform documentation (60+ files)
  - All P0 protocols and guides
  - Constitutional OS documents
  - Critical implementation specs
  
- **archive/**: Historical reference
  - session-deliverables/ (phases 1-3 now empty or minimal)
  - legacy-scripts/ (obsolete tools)
  
- **scripts/**: Active tools (with lifecycle metadata)
  - ON: Currently active (28, 63, 66, 67)
  - OFF: Dormant but useful
  - OBSOLETE: Session 44-55 confusion period

### Finding Documents
# Old way (DON'T USE)
ls archive/session-deliverables/phase-*/00031-*.md

# New way (USE THIS)
ls core/00031-*.md
ls 00031-*.md  # Some still in root
```

### 4. 🟡 Complete Phase-3 Organization (PRIORITY P1)

32 files in phase-3 need organizing. These are recent work (Sessions 53-57).

#### Execution Plan
```bash
# 1. Check readiness (MANDATORY - HARVEST phase)
python3 scripts/00066-migration-readiness.py --check

# 2. Test on one file first
python3 scripts/00067-auto-organize-files.py --classify \
  archive/session-deliverables/phase-3/00053-MIGRATION-COMPLETION-CERTIFICATE.md

# 3. Dry run on all
find archive/session-deliverables/phase-3 -name "*.md" | \
  xargs python3 scripts/00067-auto-organize-files.py --dry-run

# 4. Execute with verification
find archive/session-deliverables/phase-3 -name "*.md" | \
  xargs python3 scripts/00067-auto-organize-files.py --execute --add-lifecycle

# 5. Verify references still work
python3 scripts/00066-reference-mapper.py --check
```

### 5. 🟢 Scripts Lifecycle Classification (PRIORITY P2)

200+ scripts need lifecycle metadata for clarity.

#### Classification Strategy
```python
# Create scripts/00068-classify-scripts-lifecycle.py

CLASSIFICATIONS = {
    "OBSOLETE": {
        "sessions": range(44, 56),  # Database confusion
        "reason": "Session 44-55 database confusion period"
    },
    "ON": {
        "sessions": [28, 63, 66, 67, 68],  # Active tools
        "patterns": ["session-start", "yaml", "reference-mapper"]
    },
    "OFF": {
        "default": True,  # Everything else
        "reason": "Dormant but contains useful patterns"
    }
}

# Don't move scripts, just add metadata
# Scripts stay in scripts/ regardless of lifecycle
```

### 6. 🟢 Root Directory Organization (PRIORITY P2)

Critical files in root need proper placement.

#### Files to Move to core/
```bash
# Constitutional OS files (HIGH PRIORITY)
00031-CONSTITUTIONAL-OS-GUIDE.md → core/
00031-WORKFLOW-BOUNDARIES.md → core/
00042-TRUTH-SEED-ADOPTION-DECISION.md → core/

# Session 65 critical docs
00065-FILE-ORGANIZATION-PROTOCOL.md → core/  # Already moved?
00065-DESKTOP-INTEGRATION-RESPONSE.md → core/
00065-LIFECYCLE-ADDENDUM.md → core/

# Session 68 deliverables  
00068-DELIVERABLES-READING-GUIDE.md → core/
00068-CONTEXT-IMPACT-ASSESSMENT.md → core/
```

## Safeguarding Features to Implement

### 1. Path Resolution Service
Create a central service that knows where files moved:

```python
# scripts/00068-path-resolver.py
class PathResolver:
    MIGRATIONS = {
        "archive/session-deliverables/phase-1/00031-MANUAL-INTERVENTION-PROTOCOL.md": 
            "core/00031-MANUAL-INTERVENTION-PROTOCOL.md",
        # ... all moved files
    }
    
    def resolve(self, old_path):
        """Return new path if file moved, else return original"""
        return self.MIGRATIONS.get(old_path, old_path)
```

### 2. Update Checker for Scripts
Scripts should check if they're using old paths:

```python
# Add to scripts that reference files
def check_path_updates():
    old_refs = find_old_references()
    if old_refs:
        print("⚠️ This script references moved files:")
        for old, new in old_refs:
            print(f"  {old} → {new}")
        print("Run: python3 scripts/00068-update-script-paths.py")
```

### 3. Reality Agent Self-Check
Agents should detect structure changes:

```python
# Add to Reality Agents
def verify_structure_assumptions(self):
    expected = ["core/", "archive/", "scripts/"]
    actual = [d for d in os.listdir(".") if os.path.isdir(d)]
    
    if "core/" not in actual:
        raise StructureChanged("core/ directory missing - structure changed!")
```

## Implementation Order (Respecting HARVEST Phase)

### Phase 1: Verification First (30 min)
1. ✅ Run all Reality Agents to baseline
2. ✅ Check migration readiness (must be >80%)
3. ✅ Test path resolver on known moves
4. ✅ Document all files that will move

### Phase 2: Critical Updates (1 hour)
1. 🔧 Update Reality Agents with new paths
2. 🔧 Update session startup scripts
3. 🔧 Update CLAUDE.md with new structure
4. 🔧 Test session startup works

### Phase 3: File Organization (1 hour)
1. 📁 Organize phase-3 files (32 files)
2. 📁 Move critical root files to core/
3. 📁 Verify references still work
4. 📁 Commit with clear message

### Phase 4: Scripts Classification (30 min)
1. 🏷️ Add lifecycle metadata to scripts
2. 🏷️ Document obsolete vs active
3. 🏷️ Create usage guide

### Phase 5: Validation (30 min)
1. ✅ Run full Reality Agent sweep
2. ✅ Test session startup
3. ✅ Verify all references work
4. ✅ Check system health >95%

## Success Criteria

### Minimum (Must Have)
- [ ] Reality Agents work with new structure
- [ ] Session startup finds moved files
- [ ] CLAUDE.md reflects new organization
- [ ] Phase-3 files organized

### Target (Should Have)
- [ ] All scripts classified with lifecycle
- [ ] Root directory cleaned
- [ ] Path resolver service created
- [ ] Update checker implemented

### Stretch (Nice to Have)
- [ ] Auto-update script for old references
- [ ] Structure change detector
- [ ] Lifecycle automation for scripts

## Risk Mitigation

### Risk: Breaking Session Startup
**Mitigation**: Test changes in new test script first before modifying production scripts

### Risk: Reality Agents Fail
**Mitigation**: Keep fallback to old paths if new ones don't exist

### Risk: Reference Breakage
**Mitigation**: Use reference mapper before and after each batch

### Risk: Lost Work
**Mitigation**: Commit after each phase, maintain rollback capability

## The Bottom Line

Session 67 moved files but didn't tell the system. Session 68 must:
1. **Tell the system** where files moved (update agents/scripts)
2. **Finish the job** (phase-3 and scripts)
3. **Add safeguards** (path resolver, update checker)

This creates a self-aware system that knows its own structure and can detect when things change - the ultimate safeguarding feature.