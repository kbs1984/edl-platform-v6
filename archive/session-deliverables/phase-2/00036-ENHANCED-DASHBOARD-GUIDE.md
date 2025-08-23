---
session: "00036"
type: "guide"
status: "current"
created: "2025-08-23"
title: "Enhanced Truth Dashboard Guide - Session 36"
purpose: "Document enhanced truth dashboard guide - session 36"
topics: ['guide']
priority: "P1"
domain: "core"
---

# Enhanced Truth Dashboard Guide - Session 36

## Overview

Session 36 has created two versions of the Truth-integrated dashboard:

1. **Basic Integration** (`scripts/00036-tos-dashboard-truth.py`) - Connects Truth API to dashboard
2. **Enhanced Details** (`scripts/00036-tos-dashboard-enhanced.py`) - Rich detailed views of all sections

## Quick Start

```bash
# Basic view - see system health at a glance
./scripts/00036-dashboard.sh

# Normal view - standard dashboard
./scripts/00036-dashboard.sh --normal

# See everything in detail
./scripts/00036-dashboard.sh --verbose

# Focus on specific sections
./scripts/00036-dashboard.sh --detail health --detail agents
```

## What's New in v2.1

### 1. Health Breakdown
Instead of just "95% healthy", you now see WHY:
```
Health Breakdown:
├─ Synchronization      100.0% ▮▮▮▮▮  (agents in sync)
├─ Completeness         100.0% ▮▮▮▮▮  (all data present)
├─ Consistency           80.0% ▮▮▮▮▯  (minor variations)
├─ Transparency         100.0% ▮▮▮▮▮  (sources clear)
├─ Assumption Clarity   100.0% ▮▮▮▮▮  (no hidden assumptions)
└─ Historical Trend: 95% → 94% → 95%
```

### 2. Agent Details
See when each agent last ran and what it processed:
```
Individual Agent Details:
├─ filesystem   ✅ Last run: 12m ago    | 1,847 files tracked
├─ github       ✅ Last run: 12m ago    | 577 commits analyzed
├─ supabase     ✅ Last run: 12m ago    | 4 tables verified
├─ integration  ✅ Last run: 12m ago    | Consensus: 95%
```

### 3. Meta-Truth Monitoring
The system monitoring itself:
```
Self-Monitoring Report:
├─ Agents Responsive:     57.1% (4/7 agents active)
├─ Data Freshness:        99.1% (last update: 2m ago)
├─ Cache Efficiency:      85.0% (17/20 hits)
├─ Event Stream Health:   100% (1 subscriber active)
└─ Self-Check Status:     ✅ Passed (no recursion)
```

### 4. Meaningful Events
Events now have context:
```
Live Truth Updates:
[10:14:41] 🔄 Consensus changed 94% → 95%
[10:14:41] 📝 Block #42 added to ledger
[10:14:38] 🤖 filesystem scan (1.2s)
[10:14:37] 🔍 No conflicts, unanimous consensus

Event Rate: 12 events/minute | Stream Latency: <100ms
```

## Command Reference

### Basic Commands
- `./scripts/00036-dashboard.sh` - Quick glance
- `./scripts/00036-dashboard.sh --normal` - Standard view
- `./scripts/00036-dashboard.sh --verbose` - All details

### Detail Sections
- `--detail health` - Health breakdown with 5 dimensions
- `--detail agents` - Agent run times and data volumes
- `--detail meta` - Meta-Truth self-monitoring
- `--detail events` - Enhanced event stream
- `--detail all` - Everything (same as --verbose)

### Truth Options
- `--speed real_time` - 5-second cache (freshest)
- `--speed operational` - 5-minute cache (default)
- `--speed archival` - 1-hour cache (historical)
- `--refresh` - Refresh Reality Agents first
- `--test` - Test Truth API connection

## Use Cases

### Morning Check-in
```bash
# See overall health and any issues
./scripts/00036-dashboard.sh --normal --detail health
```

### Debugging Agent Issues
```bash
# See which agents are failing and when they last ran
./scripts/00036-dashboard.sh --detail agents --detail meta
```

### System Monitoring
```bash
# Watch live events and system changes
./scripts/00036-dashboard.sh --verbose --speed real_time
```

### Before Commits
```bash
# Refresh and check everything
./scripts/00036-dashboard.sh --refresh --verbose
```

## Architecture

```
Reality Agents → Truth API → Enhanced Dashboard → User
       ↑                            ↓
       └──── Meta-Truth Agent ──────┘
```

The Enhanced Dashboard pulls from:
- **Truth API**: Real-time health metrics
- **Reality Agents**: System state verification
- **Meta-Truth Agent**: Self-monitoring data
- **Event Stream**: Push-based updates
- **Cache System**: Three-speed data access

## Next Enhancements

Potential future additions:
1. **Reconciliation History**: Show how conflicts were resolved
2. **Cache Performance**: Hit rates and response times
3. **Educational Ledger**: Student achievement details
4. **Trend Graphs**: ASCII charts of health over time
5. **Alert Thresholds**: Highlight when metrics drop

## Technical Details

- **Lines of Code**: 700+ (enhanced version)
- **Data Sources**: 4 Reality Agents + Meta-Truth
- **Update Rate**: Real-time push events
- **Cache Levels**: 3 (5s, 5m, 1h)
- **Trust Score**: 85.1% current

The dashboard now shows the rich data that was always available but previously hidden behind simple summaries.