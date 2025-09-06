---
session: "00097"
type: "decision"
status: "current"
created: "2025-08-28"
title: "Script Status Decisions - Answering Key Questions"
purpose: "Make clear decisions about TOS dashboard, YAML tools, Session 87, and test scripts"
topics: ["scripts", "decisions", "dashboard", "yaml-tools"]
priority: "P0"
domain: "core"
---

# Script Status Decisions - Session 00097

## 1. ❓ TOS Dashboard - Which is Canonical?

### Found 10 Dashboard Scripts:
```
00029-tos-orchestrator.sh          # Early version
00032-tos-dashboard.sh              # Shell wrapper ← LIKELY CANONICAL
00032-tos-dashboard.py              # Python implementation (called by .sh)
00034-tos-dashboard-enhanced.sh     # Enhanced version
00036-dashboard.sh                  # Generic dashboard
00036-tos-dashboard-enhanced.py     # Another enhanced
00036-tos-dashboard-truth.py        # Truth variant
00036-tos-dashboard-truth.sh        # Truth shell wrapper
00063-project-health-dashboard.py   # Different purpose
00081-fix-dashboard-redirect.sh     # One-time fix
```

### DECISION: 00032-tos-dashboard.sh is CANONICAL
**Evidence**: 
- CLAUDE.md references it in available tools
- It's a wrapper that calls the .py version
- Session 32 established the Constitutional OS system

**Action**:
- Mark 00032-tos-dashboard.sh as ACTIVE
- Mark 00032-tos-dashboard.py as ACTIVE (dependency)
- Mark others as DEPRECATED or EXPERIMENTAL

## 2. ❓ YAML Tools - Which Do We Use?

### Found 16 YAML-related Scripts:
```
ACTIVE (Keep):
✅ 00059-yaml-query.py              # PRIMARY query tool (P0)
✅ 00059-yaml-health-check.sh       # Health reporting (used in startup)
✅ 00061-add-yaml-frontmatter.py    # Add YAML to files (P0)
✅ 00069-yaml-pre-commit-hook.sh    # Git hooks (active)

LIKELY ACTIVE (Verify):
? 00059-yaml-indexer.py             # Builds index (needed?)
? 00059-yaml-maintenance.py         # Maintenance tasks
? 00068-fix-yaml-validation.py      # Fixes validation errors

DEPRECATED (Archive):
❌ 00058-yaml-query-demo.py         # Demo version
❌ 00059-add-yaml-batch.py          # Replaced by 00063
❌ 00063-batch-yaml-add.sh          # Old batch tool
❌ 00069-install-yaml-hooks.sh      # One-time installer
❌ 00085-add-yaml-to-reality-files.py # Completed task
❌ verify-yaml-work.sh               # Temporary verification
```

### DECISION:
- 4 scripts definitely ACTIVE (core tools)
- 3 scripts need investigation
- 6 scripts can be deprecated/archived

## 3. ❓ Session 87 Scripts - Still Needed?

### Found 7 Files (Mix of Scripts and Docs):
```
Scripts:
00087-test-auth-fixes.py           # Test script - KEEP for regression testing

Documentation (not scripts):
00087-AUTH-SUCCESS-SUMMARY.md      # Documentation
00087-fix-file-constructor.tsx     # Code snippet, not script
00087-fix-middleware-header.ts     # Code snippet, not script  
00087-onboarding-fixes-summary.md  # Documentation
00087-step-3-school-fix.md         # Documentation
00087-test-auth-flow.md            # Documentation
```

### DECISION:
- Only 1 actual script: `00087-test-auth-fixes.py` - KEEP as test tool
- Others are documentation/code snippets, not executable scripts

## 4. ❓ Test Scripts - Ongoing vs One-Time?

### Analysis Pattern:
```
ONGOING (Keep):
- Tests that verify core functionality
- Tests we'd run after changes
- Example: 00087-test-auth-fixes.py

ONE-TIME (Archive):
- Debugging scripts for specific issues
- Scripts that tested migration success
- Scripts from auth confusion period
```

### DECISION:
Mark test scripts by era:
- Migration era tests (40-55): OBSOLETE
- Auth confusion tests (75-82): OBSOLETE  
- Recent tests (87+): ACTIVE (regression testing)

## 📋 Summary Decisions

### Canonical Scripts Identified:
1. **TOS Dashboard**: `00032-tos-dashboard.sh` (with .py)
2. **YAML Query**: `00059-yaml-query.py`
3. **YAML Add**: `00061-add-yaml-frontmatter.py`
4. **Session Startup**: `00028-session-start.sh` (already known)

### Scripts to Mark ACTIVE (High Priority):
- 00032-tos-dashboard.sh/py (Constitutional OS dashboard)
- 00059-yaml-query.py (Query tool)
- 00059-yaml-health-check.sh (Health reporting)
- 00061-add-yaml-frontmatter.py (YAML adding)
- 00069-yaml-pre-commit-hook.sh (Git hooks)
- 00087-test-auth-fixes.py (Auth regression testing)

### Scripts to Mark DEPRECATED:
- All other TOS dashboard variants (replaced by 00032)
- 00058-yaml-query-demo.py (demo version)
- Duplicate YAML batch tools

### Scripts Needing Investigation:
- 00059-yaml-indexer.py (builds index - still needed?)
- 00059-yaml-maintenance.py (what maintenance?)
- 00068-fix-yaml-validation.py (one-time or ongoing?)

## 🎯 Next Step

Run the batch YAMLization with these decisions incorporated:
```bash
python3 scripts/00097-yamlize-remaining.py
```

This will apply intelligent status detection based on these decisions.