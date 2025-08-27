---
created: '2025-08-23'
domain: core
priority: P1
purpose: 'Document session 00027: agent output analysis'
session: '00027'
status: current
title: 'Session 00027: Agent Output Analysis'
topics:
- documentation
type: guide
---

# Session 00027: Agent Output Analysis
**Created**: 2025-08-18 | Hour 1-2
**Purpose**: Analyze what data each Reality Agent provides and how to use it

## Output Format Summary

### Common Pattern Across All Agents
```json
{
  "metadata": {
    "timestamp": "ISO-8601",
    "agent": "agent-name",
    "session_id": "unique-id",
    "confidence_score": 0.0-1.0
  },
  "discoveries": {
    // Agent-specific data
  }
}
```

## Agent-Specific Output Analysis

### 1. Integration Agent Output
**Format**: Visual report or JSON
**Key Data Points**:
```
- Health Scores (0-100%):
  - Synchronization
  - Completeness  
  - Consistency
  - Transparency
  - Assumption Clarity
  - OVERALL HEALTH

- Agent Consensus:
  - Which agents healthy/limited/failed
  - Specific agent statuses
  
- Integration Debt:
  - Debt score and level
  - Specific missing items
  
- Critical Gaps:
  - List of system gaps found
```

**Actionable vs Status**:
- **Actionable**: Critical gaps, failed agents, debt items
- **Status**: Health percentages, consensus scores

**Automation Use Case**:
- Session startup health check
- Trigger alerts if health < threshold
- Auto-create issues for critical gaps

### 2. FileSystem Agent Output
**Format**: Clean JSON
**Key Data Points**:
```json
{
  "connection": {
    "status": "connected",
    "permission_level": "read_write",
    "available_space_bytes": number
  },
  "discoveries": {
    "level": 1-3,
    "summary": {
      "can_list_contents": boolean,
      // Level 2 adds: file counts, structure
      // Level 3 adds: metadata, git status
    }
  }
}
```

**Actionable vs Status**:
- **Actionable**: Permission issues, space warnings
- **Status**: File counts, structure info

**Automation Use Case**:
- Verify file access before operations
- Monitor disk space
- Track file changes via snapshots

### 3. GitHub Agent Output
**Format**: JSON or text
**Key Data Points**:
```
Level 1: CLI access status
Level 2: Repository info (branch, remotes)
Level 3: PR state
Level 4: Issue tracking
Level 5: Workflow/CI status

Special capabilities:
- Can create PRs programmatically
- Can create issues programmatically
- Tracks API rate limits
```

**Actionable vs Status**:
- **Actionable**: Failed CI, open PRs, rate limit warnings
- **Status**: Branch info, commit history

**Automation Use Case**:
- Auto-create issues for violations
- Monitor PR status
- Check CI before operations

### 4. Supabase Agent Output
**Format**: JSON
**Key Data Points**:
```
Level 1: Connection status
Level 2: Table list (currently 0 due to RLS)
Level 3: Schema structure
Level 4: Change detection

Note: Currently shows 0 tables but connection verified
```

**Actionable vs Status**:
- **Actionable**: Connection failures, schema changes
- **Status**: Table counts, connection info

**Automation Use Case**:
- Verify database connectivity
- Detect schema drift
- Monitor table changes (once visible)

## Data Processing Requirements

### 1. Parser Needs
- JSON parsing for all agents
- Visual report parsing for Integration Agent
- Error handling for missing fields
- Type validation for numeric scores

### 2. Storage Format
```python
session_state = {
    "timestamp": "2025-08-18T08:00:00",
    "session_id": "00027",
    "system_health": 97.0,  # From Integration Agent
    "agents_status": {
        "filesystem": "healthy",
        "github": "healthy",
        "supabase": "limited",  # 0 tables
        "integration": "healthy"
    },
    "critical_gaps": [],
    "actionable_items": [],
    "metrics": {
        "file_count": 1247,
        "disk_space_gb": 949.9,
        "api_calls_remaining": 4990
    }
}
```

### 3. Threshold Definitions
```python
THRESHOLDS = {
    "system_health_minimum": 80.0,
    "disk_space_minimum_gb": 10.0,
    "api_calls_minimum": 100,
    "integration_debt_maximum": 100
}
```

## Automation Decision Tree

```
Start Session
    ↓
Run Integration Agent
    ↓
Parse Overall Health
    ↓
If Health < 80%:
    → Alert user
    → Run specific agents for details
    → Generate remediation plan
Else:
    → Continue with normal session
    ↓
If Critical Gaps:
    → Document in session log
    → Add to todo list
    → Consider blocking operations
```

## Key Insights

### What Agents Provide Well
1. **System State**: Comprehensive health metrics
2. **Gap Detection**: What's missing or broken
3. **Change Tracking**: Via snapshots and comparison
4. **Metadata**: Timestamps, confidence scores, session IDs

### What's Missing for Full Automation
1. **Unified Orchestration**: Need wrapper to run all agents
2. **State Persistence**: Need to save/compare between sessions
3. **Alert Rules**: Need configurable thresholds
4. **Remediation Actions**: Need automated fixes for common issues

### Data Quality Assessment
- ✅ **Consistent**: All agents use similar JSON structure
- ✅ **Reliable**: No malformed outputs observed
- ✅ **Timestamped**: All outputs include timestamps
- ✅ **Traceable**: Session IDs enable tracking
- ⚠️ **Verbose**: Some outputs very detailed (need filtering)

## Recommendations for Session 28

### Parser Development Priority
1. **Integration Agent parser** (most valuable data)
2. **Threshold checker** (health scores, gaps)
3. **State comparator** (session-to-session changes)
4. **Alert generator** (actionable items)

### Data Flow Architecture
```
Agents → Raw JSON → Parser → Normalized State → Decision Engine → Actions
                       ↓
                  Session State DB
```

### Storage Strategy
- Save raw agent outputs for debugging
- Store normalized state for comparison
- Track metrics over time for trends
- Archive old states after N sessions

---

*This analysis based on actual agent testing in Session 27*