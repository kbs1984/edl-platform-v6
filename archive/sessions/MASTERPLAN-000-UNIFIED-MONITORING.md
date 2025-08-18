# MASTERPLAN-000: Unified Monitoring Dashboard
**Version**: 1.0.0  
**Created**: Session 00014  
**Date**: 2025-08-16  
**Domain**: System-wide observability and control  
**Priority**: CRITICAL - This enables all other masterplans

---

## Executive Summary

### Problem Statement
Currently, system health is fragmented across multiple agents, files, and scripts. Sessions operate in partial blindness, discovering issues reactively. There's no unified view of system evolution, session productivity, or strategic progress.

### Solution Approach
Build a real-time unified monitoring dashboard that aggregates all system intelligence into a single source of truth. This dashboard will provide temporal views (real-time, trending, historical), operational insights, and strategic progress tracking.

### Expected Outcomes
- Single pane of glass for system health
- Predictive issue detection via trend analysis
- Session productivity metrics and optimization
- Strategic progress visibility
- Reduced time to issue resolution (<5 minutes)

---

## Current State Analysis

### What Exists Today
- Individual Reality Agents reporting independently
- Static files (REALITY-STATUS.md) manually updated
- Session logs with retroactive documentation
- Fragmented metrics in .metrics/ directory
- No trend analysis or historical comparison

### What's Working
- Reality Agents provide accurate point-in-time data
- Session logs maintain constitutional compliance
- Integration Agent calculates consensus scores
- Scripts automate some checks

### What's Failing
- No unified view across all agents
- Cannot see trends or patterns
- Session productivity not measured
- No predictive capabilities
- Manual correlation required

### Gap Analysis
| Current | Target | Gap |
|---------|--------|-----|
| Point-in-time checks | Continuous monitoring | No streaming |
| Manual correlation | Automated analysis | No intelligence |
| Reactive detection | Predictive alerts | No trends |
| File-based state | Real-time dashboard | No UI |
| Session-scoped view | Cross-session insights | No persistence |

---

## Target Architecture

### Component Architecture
```
┌─────────────────────────────────────────────────────┐
│                 Unified Dashboard UI                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐│
│  │Real-time │ │Trending  │ │Historical│ │Strategy││
│  └──────────┘ └──────────┘ └──────────┘ └────────┘│
└─────────────────────────────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │ Aggregation  │
                    │    Layer     │
                    └──────┬──────┘
                           │
     ┌─────────────────────┼─────────────────────┐
     │                     │                     │
┌────▼────┐ ┌─────────────▼──────┐ ┌───────────▼──────┐
│ Reality │ │     Performance    │ │    Session       │
│ Agents  │ │      Metrics       │ │    Tracking      │
└─────────┘ └────────────────────┘ └──────────────────┘
```

### Data Flow
1. **Collection**: Agents → Metrics files → Time-series DB
2. **Aggregation**: Stream processing → Calculated KPIs
3. **Storage**: Hot (1h) → Warm (24h) → Cold (30d)
4. **Visualization**: WebSocket → Dashboard → User

### Technology Stack
- **Frontend**: Vanilla JS + Web Components (align with Lightning Stack)
- **Backend**: Python FastAPI (lightweight, async)
- **Storage**: SQLite for metrics + JSON for configs
- **Streaming**: Server-Sent Events (SSE)
- **Deployment**: Single HTML file + embedded API

---

## Implementation Phases

### Phase 1: Data Collection Infrastructure (Session 15)
- [ ] Create unified metrics collector (`monitoring/collector.py`)
- [ ] Implement time-series storage (`monitoring/database.py`)
- [ ] Build agent adapters for standardized output
- [ ] Create performance tracking decorators
- [ ] Set up automatic metric rotation (hourly/daily)
- **Success Criteria**: All agents writing to unified store

### Phase 2: Real-time Dashboard (Session 16)
- [ ] Build dashboard HTML with Web Components
- [ ] Implement SSE endpoint for live updates
- [ ] Create health status grid component
- [ ] Add consensus score gauge
- [ ] Implement alert notification system
- **Success Criteria**: Live dashboard showing current state

### Phase 3: Intelligence Layer (Session 17)
- [ ] Add trend analysis for drift detection
- [ ] Implement pattern recognition for failures
- [ ] Create predictive alerting system
- [ ] Build session productivity scoring
- [ ] Add strategic progress tracking
- **Success Criteria**: Predictive alerts working

---

## Dashboard Specification

### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│                    EDL Truth Operating System               │
│                  Session: 00014 | 2025-08-16 14:30          │
├─────────────────────────┬───────────────────────────────────┤
│   REAL-TIME HEALTH      │      TEMPORAL INTELLIGENCE        │
│ ┌─────────────────────┐ │ ┌───────────────────────────────┐│
│ │ Consensus: 97%      │ │ │ 24hr Drift: -2.3%            ││
│ │ ████████████████░░  │ │ │ ▁▂▃▄▅▆▇█▇▆▅▄▃▂▁              ││
│ └─────────────────────┘ │ └───────────────────────────────┘│
│ ┌─────────────────────┐ │ ┌───────────────────────────────┐│
│ │ FileSystem    ✅ 98%│ │ │ Performance Trends           ││
│ │ GitHub        ✅ 96%│ │ │ Reality Check: 18s → 22s     ││
│ │ Supabase      ⚠️ 71%│ │ │ Git Commits: 12 → 8          ││
│ │ Integration   ✅ 97%│ │ │ Task Velocity: 3.2 → 4.1     ││
│ └─────────────────────┘ │ └───────────────────────────────┘│
├─────────────────────────┼───────────────────────────────────┤
│  SESSION PRODUCTIVITY   │      STRATEGIC PROGRESS           │
│ ┌─────────────────────┐ │ ┌───────────────────────────────┐│
│ │ Current Session:    │ │ │ Masterplan Implementation    ││
│ │ • Commits: 3        │ │ │ ■■■■■□□□□□ 50% Temporal      ││
│ │ • Tasks: 5/8        │ │ │ ■■□□□□□□□□ 20% Healing       ││
│ │ • Duration: 2.3h    │ │ │ ■■■■■■■□□□ 70% Lifecycle     ││
│ │ • Health Δ: +2%     │ │ │ ■□□□□□□□□□ 10% Commands      ││
│ └─────────────────────┘ │ └───────────────────────────────┘│
└─────────────────────────┴───────────────────────────────────┘
```

### Key Performance Indicators

#### System Health KPIs
- **Consensus Score**: Weighted average of all agents
- **Agent Health**: Individual agent confidence scores
- **Drift Rate**: Change in consensus over time
- **Alert Count**: Active issues requiring attention

#### Productivity KPIs
- **Commit Velocity**: Commits per session
- **Task Completion**: Tasks closed vs opened
- **Session Efficiency**: Productive time vs total time
- **Health Delta**: System health change during session

#### Strategic KPIs
- **Masterplan Progress**: Implementation percentage
- **Protocol Compliance**: Violations per session
- **Technical Debt**: Growing/shrinking trend
- **Documentation Coverage**: Docs vs code ratio

---

## Integration Points

### Inputs (Data Sources)
1. **Reality Agents**: Health scores, confidence metrics
2. **Git Hooks**: Commit events, file changes
3. **Session Logs**: Start/end times, work completed
4. **Task System**: Task status, dependencies
5. **Performance Monitors**: Execution times, resource usage

### Outputs (Consumers)
1. **Claude Commands**: Reality status checks
2. **Session Handoffs**: Productivity summaries
3. **Alert System**: Threshold violations
4. **Report Generator**: Daily/weekly summaries
5. **Strategic Planning**: Progress tracking

### API Specification
```python
# Core endpoints
GET  /api/health          # Current system health
GET  /api/metrics         # Time-series metrics
GET  /api/alerts          # Active alerts
POST /api/metrics         # Submit new metric
GET  /api/stream          # SSE for real-time updates

# Dashboard endpoints  
GET  /                    # Dashboard HTML
GET  /api/dashboard       # Dashboard data
GET  /api/config          # Dashboard configuration
```

---

## Success Metrics

### Technical Metrics
- **Query Performance**: <100ms for current state
- **Update Latency**: <1s for dashboard refresh  
- **Storage Efficiency**: <100MB for 30 days
- **Availability**: >99.9% uptime

### Business Metrics
- **Time to Detection**: <1 minute for issues
- **Time to Resolution**: <10 minutes for P0
- **Session Productivity**: >20% improvement
- **False Positive Rate**: <5% of alerts

### User Experience Metrics
- **Dashboard Load Time**: <2 seconds
- **Interaction Response**: <200ms
- **Information Density**: All KPIs visible without scroll
- **Actionability**: Every alert has clear next step

---

## Risk Mitigation

### Risk: Performance Impact
- **Mitigation**: Async collection, caching, sampling
- **Monitoring**: Track collection overhead
- **Fallback**: Reduce collection frequency

### Risk: Storage Growth
- **Mitigation**: Automatic rotation, compression
- **Monitoring**: Disk usage alerts
- **Fallback**: Shorter retention periods

### Risk: Dashboard Complexity
- **Mitigation**: Progressive disclosure, presets
- **Monitoring**: User interaction tracking
- **Fallback**: Simplified view mode

---

## Alerting Strategy

### Alert Levels
1. **CRITICAL**: System consensus <60%
2. **WARNING**: Agent health <70%
3. **INFO**: Drift >10% in 1 hour
4. **DEBUG**: Performance degradation >20%

### Alert Channels
- Dashboard notification (toast)
- Session log entry
- Terminal output (if active)
- Handoff document flag

### Alert Response Matrix
| Alert | Auto-Response | Human Action |
|-------|--------------|--------------|
| Consensus <60% | Run recovery script | Review agent failures |
| Agent failure | Retry with verbose | Check credentials |
| Drift >20% | Snapshot state | Investigate cause |
| Perf degradation | Clear caches | Optimize queries |

---

## Maintenance & Evolution

### Daily Operations
- Metric rotation at midnight
- Cache clearing every 6 hours
- Alert acknowledgment tracking
- Performance baseline updates

### Weekly Maintenance
- Trend analysis recalibration
- Alert threshold tuning
- Storage optimization
- Dashboard layout review

### Monthly Evolution
- New metric integration
- Dashboard feature additions
- Performance optimizations
- User feedback incorporation

---

## Dependencies

### Requires
- Reality Agents operational (Sessions 02-09)
- Python environment with FastAPI
- SQLite database support
- Web browser with ES6 support

### Enables
- MASTERPLAN-001: Temporal Intelligence (needs historical data)
- MASTERPLAN-002: Self-Healing (needs alert triggers)
- MASTERPLAN-003: Lifecycle (needs productivity metrics)
- MASTERPLAN-004: Commands (needs performance data)

### Conflicts
- None identified

---

## Post-Implementation

### Success Indicators
- All sessions start with dashboard check
- Issues detected before they impact work
- Session productivity measurably improved
- Strategic progress visible and tracked

### Handoff Criteria
- Dashboard running for 3+ sessions
- All agents integrated
- Alert thresholds tuned
- Documentation complete

### Evolution Path
- Machine learning for anomaly detection
- Multi-user support with roles
- Mobile responsive design
- Export/reporting capabilities

---

## Appendix: Mock Data Structure

```json
{
  "timestamp": "2025-08-16T14:30:00Z",
  "session": "00014",
  "system": {
    "consensus": 0.97,
    "health": "operational",
    "alerts": []
  },
  "agents": {
    "filesystem": {"health": 0.98, "confidence": 1.0},
    "github": {"health": 0.96, "confidence": 0.95},
    "supabase": {"health": 0.71, "confidence": 0.7},
    "integration": {"health": 0.97, "confidence": 0.9}
  },
  "productivity": {
    "commits": 3,
    "tasks_completed": 5,
    "tasks_total": 8,
    "duration_hours": 2.3
  },
  "trends": {
    "consensus_24h": [-0.02, -0.01, 0, 0.01, 0.02],
    "performance": {"reality_check_ms": [18000, 19000, 22000]}
  }
}
```

---

*This masterplan serves as the observability foundation for all other system improvements.*