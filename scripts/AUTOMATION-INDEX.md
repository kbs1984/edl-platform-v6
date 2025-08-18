# Automation Scripts Index
**Created**: Session 00030  
**Last Updated**: 2025-08-18  
**Status**: TOS v1.0 Complete and Operational

---

## Overview

This index documents all automation scripts in the EDL Platform v6, organized by session and purpose. The Truth Operating System (TOS) provides complete session automation and truth verification.

---

## Truth Operating System (TOS) Scripts

### Session 28 - Operating Layer (Session Management)
**Purpose**: Automated session initialization (35min → 6sec)

| Script | Purpose | Status | Usage |
|--------|---------|--------|-------|
| `00028-session-start.sh` | Main entry point | ✅ Working | `./scripts/00028-session-start.sh [session] ["focus"]` |
| `00028-reality-check.sh` | Run Reality Agents | ✅ Working | Called by session-start |
| `00028-parse-outputs.py` | Parse agent outputs | ✅ Working | Processes JSON/text |
| `00028-context-loader.sh` | Load previous context | ✅ Working | Extracts handoff info |
| `00028-handoff-detector.sh` | Check for handoffs | ✅ Working | Finds handoff files |
| `00028-generate-report.py` | Create markdown reports | ✅ Working | Generates init report |
| `00028-create-session-log.sh` | Generate session logs | ✅ Working | Constitutional logs |
| `00028-session-startup.sh` | Orchestrator | ✅ Working | Coordinates all |
| `00028-full-startup.sh` | Wrapper script | ✅ Working | Alternative entry |

**Documentation**: `00028-AUTOMATION-README.md`

### Session 29 - Integration Layer (Reconciliation)
**Purpose**: Automated gap analysis and action planning

| Script | Purpose | Status | Usage |
|--------|---------|--------|-------|
| `00029-tos-orchestrator.sh` | Full TOS cycle | ✅ Working | `./scripts/00029-tos-orchestrator.sh` |
| `00029-reconciliation-bridge.sh` | Bridge domains | ✅ Working | Requirements ↔ Reality |
| `00029-requirements-check.sh` | Extract requirements | ⚠️ Counts files | Shows 13 not 275 |
| `00029-requirements-check-simple.sh` | Simple extraction | ⚠️ Counts files | Simplified version |
| `00029-gap-analyzer.py` | Analyze gaps | ✅ Working | Compares domains |
| `00029-action-planner.py` | Plan actions | ✅ Working | Prioritized plans |

**Known Issues**:
- Requirements checkers count files (13) not stories (275)
- Need to parse story content within files

---

## Legacy Scripts (Pre-TOS)

### Session 12-13 Scripts
| Script | Purpose | Status |
|--------|---------|--------|
| `00012_reality-check.sh` | Early Reality check | 🔄 Superseded |
| `00013_deploy-with-verification.sh` | Deploy helper | ❓ Unknown |
| `00013_reality-check.sh` | Reality check v2 | 🔄 Superseded |
| `00013_resolve-conflicts.sh` | Git conflict helper | ✅ Working |
| `00013_setup-reality-aliases.sh` | Shell aliases | ✅ Working |
| `00013_verify-credentials.sh` | Check credentials | ✅ Working |

### Core Scripts
| Script | Purpose | Status |
|--------|---------|--------|
| `create-session-log.sh` | Manual log creation | ✅ Working |
| `session-guard.sh` | Constitutional check | ✅ Working |
| `structure-check.sh` | System overview | ✅ Working |

---

## Quick Commands

### Daily Use
```bash
# Start new session (6 seconds)
./scripts/00028-session-start.sh

# Full truth check (30 seconds)
./scripts/00029-tos-orchestrator.sh

# Quick reality check (8 seconds)
./scripts/00028-reality-check.sh
```

### Troubleshooting
```bash
# Manual session log
./scripts/create-session-log.sh 00031 "Focus area"

# Check constitutional compliance
./scripts/session-guard.sh

# System structure overview
./scripts/structure-check.sh
```

### Development
```bash
# Run reconciliation only
./scripts/00029-reconciliation-bridge.sh

# Check gaps
cat /tmp/reconciliation/gaps.json | python3 -m json.tool

# View action plan
cat /tmp/reconciliation/action-plan.json | python3 -m json.tool
```

---

## Performance Metrics

### Session 28 Automation
- **Before**: 35 minutes manual
- **After**: 6 seconds automated
- **Improvement**: 99.7%

### Session 29 TOS
- **Full Cycle**: 30 seconds
- **Reality Check**: 8 seconds
- **Gap Analysis**: 5 seconds
- **Action Planning**: 3 seconds

---

## Future Enhancements

### Needed Scripts
1. **Script Reality Agent** - Monitor scripts themselves
2. **Documentation Reality Agent** - Verify INDEX files
3. **TOS Self-Check** - Meta-verification
4. **Requirements Parser Fix** - Count stories not files

### Optimizations
1. Parallel agent execution (8s → 4s)
2. Caching for recent results
3. Incremental updates
4. Real-time monitoring

---

## Related Documentation

- [00030-TOS-ARCHITECTURE.md](/00030-TOS-ARCHITECTURE.md) - Complete TOS documentation
- [00028-AUTOMATION-README.md](00028-AUTOMATION-README.md) - Session automation guide
- [SYSTEM-INDEX.md](/SYSTEM-INDEX.md) - Master system index
- [CLAUDE.md](/CLAUDE.md) - Session protocols

---

*Automation Index - Where Scripts Enable Truth*