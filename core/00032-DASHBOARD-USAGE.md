---
session: '00032'
type: guide
status: current
created: '2025-08-23'
title: Constitutional OS Dashboard - Usage Guide
purpose: Document constitutional os dashboard - usage guide
topics:
- documentation
priority: P1
domain: core
lifecycle: 'ON'
---

# Constitutional OS Dashboard - Usage Guide
**Session 32** | **Version 1.0** | **2025-08-18**

## Quick Start

```bash
# Quick glance (5 seconds)
./scripts/00032-tos-dashboard.sh
# Output: 🌿 GROW 75% ⚠️ | No violations ✅

# Normal view (30 seconds)
./scripts/00032-tos-dashboard.sh --normal

# Deep analysis (5 minutes)
./scripts/00032-tos-dashboard.sh --deep

# JSON output for scripts
./scripts/00032-tos-dashboard.sh --json

# Reality Agent status (Session 34 enhancement)
./scripts/00034-tos-dashboard-enhanced.sh --agents

# Full agent analysis with consensus details
./scripts/00034-tos-dashboard-enhanced.sh --agents-full

# Refresh agents and show full analysis
./scripts/00034-tos-dashboard-enhanced.sh --refresh-agents
```

## What the Dashboard Shows

### Glance View (Default)
- Current phase emoji and name (🌿 GROW)
- Constitutional health percentage and status icon
- Violation count or "No violations ✅"

### Normal View
- Phase-aware greeting from PersonalityEngine
- Strategic phase (V3 Masterplan) and tactical phase (SEED/GROW/HARVEST)
- Enforcement level
- Constitutional health with visual bar
- Violations with fix commands (if any)
- Reality Agent status
- Phase transition hints
- Quick reference to guides
- Phase-specific reminders

### Deep View
- Everything from normal view, plus:
- Detailed metrics (features complete, test coverage, etc.)
- Individual Reality Agent statuses
- Session 32 deliverables list
- Phase-specific recommendations

## Configuration

The dashboard reads from `.cos/` directory:
- `config.json` - Phase settings, enforcement level
- `state.json` - Current metrics, health scores
- `personality.json` - Phase-aware responses
- `violations/` - Violation queue (future enhancement)

## Phase-Aware Behavior

### GROW Phase (Current)
- **Enforcement**: MODERATE
- **Violations**: Suggested fixes, not blocking
- **Personality**: Helpful and encouraging
- **Focus**: Rapid development with structure

### SEED Phase
- **Enforcement**: FLEXIBLE
- **Violations**: Gentle reminders only
- **Personality**: Relaxed and exploratory
- **Focus**: Architecture and planning

### HARVEST Phase
- **Enforcement**: STRICT
- **Violations**: Auto-fixed when possible
- **Personality**: Thorough and systematic
- **Focus**: Validation and documentation

## Health Calculation

Constitutional health is calculated from:
- Reality Agent health (40%)
- Documentation currency (30%)
- Test coverage (20%)
- File compliance (10%)

Target health scores:
- SEED: 70% acceptable
- GROW: 80% target
- HARVEST: 95% required

## Integration with Session 31 Tools

The dashboard integrates with:
- `00031-WORKFLOW-BOUNDARIES.md` - References for autonomous vs manual work
- `00031-PHASE-*-GUIDE.md` - Phase-specific guidance
- `00031-auth-autonomous-verification.py` - Can trigger verification

## Common Usage Patterns

### Morning Check-in
```bash
# Quick health check
./scripts/00032-tos-dashboard.sh

# If violations exist
./scripts/00032-tos-dashboard.sh --normal
# Review and fix violations
```

### After Feature Completion
```bash
# Check phase transition indicators
./scripts/00032-tos-dashboard.sh --normal

# Run Reality check if needed
./scripts/00028-reality-check.sh --quick
```

### End of Day Review
```bash
# Deep analysis
./scripts/00032-tos-dashboard.sh --deep

# Update state if needed
vim .cos/state.json
```

## Troubleshooting

### Dashboard shows wrong phase
Edit `.cos/config.json` and update the `phase` field.

### Health score seems incorrect
Check `.cos/state.json` for outdated metrics.

### Violations not detected
The dashboard only flags files that should have session prefixes but don't. System files, protocol files, and files from other sessions are intentionally ignored.

## Reality Agent View (Session 34 Enhancement)

### Agent Status Visualization
The enhanced dashboard now provides deep visibility into Reality Agent operations:

```bash
# View agent constellation and status
./scripts/00034-tos-dashboard-enhanced.sh --agents

# Shows:
- ASCII constellation of agent connections
- Individual agent health status
- Connection to external services
- Consensus calculation mechanism
- Actionable recommendations
```

### Understanding Consensus
The Integration Agent calculates system health through:
1. **Synchronization** - Are agents in sync?
2. **Completeness** - Is data complete?
3. **Consistency** - Are there conflicts?
4. **Transparency** - Is truth visible?
5. **Assumption Clarity** - Are assumptions documented?

The final consensus (97%) is a weighted average of these dimensions.

### Truth Flow
```
FileSystem ─┐
GitHub ─────┼─→ Integration → Consensus → Dashboard
Supabase ───┘     (97%)        Score      Display
```

## Future Enhancements

Planned for future sessions:
- Automatic phase transition detection and confirmation
- Violation auto-fix with confirmation
- Historical trend tracking
- Integration with git commit hooks
- Web-based dashboard view
- Session memory integration
- Real-time agent monitoring
- Automatic agent orchestration

---

The Constitutional OS Dashboard embodies the philosophy: **assistance, not policing**. It helps you maintain constitutional health while adapting to your natural development rhythm.