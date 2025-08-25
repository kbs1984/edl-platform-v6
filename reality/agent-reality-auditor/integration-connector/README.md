---
created: '2025-08-23'
domain: reality
priority: P1
purpose: Document integration reality agent
session: legacy
status: current
title: Integration Reality Agent
topics:
- guide
type: guide
---

# Integration Reality Agent

**Meta-Reality Discovery for Reality Agents**

## Overview

The Integration Reality Agent is a meta-agent that discovers how individual Reality Agents relate, conflict, and drift. It implements SPEC-004 with enhanced deception detection and integration debt tracking capabilities.

## Core Features

### 1. Deception Detection Engine
- Analyzes session logs for claimed work
- Compares claims against actual filesystem changes
- Identifies retroactive logging instances
- Calculates truth scores for transparency

### 2. Integration Debt Tracking
- Quantifies technical debt across domains
- Tracks uncommitted files, untracked files, unpushed commits
- Identifies undocumented features and missing tests
- Provides actionable remediation recommendations

### 3. Visual Health Scores
- ASCII bar visualizations for all metrics
- Multi-dimensional health assessment
- Real-time integration status
- Historical trend analysis

### 4. Progressive Discovery Levels

#### Level 1: Agent Health Check (Confidence: 1.0)
```python
{
    "fs_agent": "healthy",
    "gh_agent": "healthy", 
    "db_agent": "unavailable",
    "partial_capability": True
}
```

#### Level 2: Binary Correlation (Confidence: 0.8)
```python
{
    "fs_git_sync": 0.95,
    "uncommitted": ["file1.py", "file2.js"],
    "untracked": ["new_file.md"],
    "unpushed": ["abc123 Fix bug"]
}
```

#### Level 3: Triadic Integration (Confidence: 0.6)
- Full correlation matrix across all agents
- Schema drift detection
- Orphaned data discovery

#### Level 4: Meta-Reality Analysis (Confidence: 0.4)
- Session truth verification
- Time gap impact analysis
- Recursive truth discovery

## Installation

No additional dependencies required beyond the base Reality Agents.

## Usage

### Quick Start
```bash
python3 quickstart.py
```

### Command Line Interface
```bash
# Generate visual report
python3 connector.py

# Save report to file
python3 connector.py --output report.txt

# Output JSON data
python3 connector.py --json

# Specify root directory
python3 connector.py --root /path/to/project
```

### Python API
```python
from connector import IntegrationRealityAgent

# Initialize agent
agent = IntegrationRealityAgent()

# Run health check
health = agent.level_1_health_check()

# Detect deceptions
gaps = agent.discover_session_reality_gaps()

# Track integration debt
debt = agent.track_integration_debt()

# Generate visual report
report = agent.generate_visual_report()
print(report)
```

## Output Example

```
============================================================
                 INTEGRATION REALITY REPORT
============================================================

📊 Health Scores:
  Synchronization  [████████████░░░░░░░░] 60%
  Completeness     [████████████████░░░░] 80%
  Consistency      [██████░░░░░░░░░░░░░░] 30%
  Transparency     [██████████████████░░] 90%
  
  OVERALL HEALTH   [████████████░░░░░░░░] 65%

⚠️  Critical Gaps Found:
  1. [HIGH] 12 files changed but not committed
     → Action: git add -A && git commit
     
  2. [CRITICAL] Database table 'users' doesn't match User model
     → Action: Generate and run migration
     
  3. [MEDIUM] Session 00002 claimed work not found in codebase
     → Action: Verify session log accuracy

🔄 Agent Consensus:
  FS Agent says: 142 files
  Git Agent says: 130 tracked files
  Consensus: 91.5% agreement

💰 Integration Debt Analysis:
  Debt Score: [████████░░░░░░░░░░░░] 40%
  Debt Level: MEDIUM
  
  Debt Breakdown:
  • 12 uncommitted files
  • 5 untracked files
  • 3 undocumented features
  • 8 missing tests

📈 Historical Trend:
  Yesterday: 45% integrated
  Today: 65% integrated
  Trend: ↑ Improving

💡 Truth: "System is 65% integrated. Reality agents agree on 91.5% of facts.
         Main gap: uncommitted work and session claim discrepancies."
============================================================
```

## Key Innovations

### Deception Detection
The agent can identify:
- **False file claims**: Files claimed to exist but don't
- **Retroactive logging**: Logs written after the fact
- **Backdated content**: Timestamps that don't match file creation
- **Future references**: Sessions referencing future work

### Integration Debt Scoring
Weighted scoring system:
- Uncommitted files: 2 points each
- Untracked files: 1 point each
- Unpushed commits: 3 points each
- Undocumented features: 5 points each
- Missing tests: 4 points each

Total score normalized to 0-100 scale.

### Truth Score Calculation
```python
truth_score = verified_claims / total_claims
```

Measures how accurately session logs reflect actual work done.

## Testing

Run comprehensive test suite:
```bash
python3 test_integration.py
```

Tests cover:
- Agent health checks
- Binary correlation
- Deception detection
- Retroactive logging detection
- Integration debt tracking
- Health score calculations

## Architecture

```
IntegrationRealityAgent
├── FileSystemConnector (FS Agent)
├── GitHubRealityAgent (GitHub Agent)
├── SupabaseConnector (Database Agent)
└── Session Log Analyzer
    ├── Claim Extractor
    ├── Deception Detector
    └── Retroactive Logger
```

## Session Reality Protocol

The agent supports the Session Reality Protocol by:
1. Preserving context across session gaps
2. Detecting drift during breaks
3. Quantifying integration health over time
4. Providing actionable reconciliation plans

## Truth Principles

Following the "Truth Over Speed" principle:
- Reports actual state, not desired state
- Documents failures as data points
- Quantifies technical debt honestly
- Reveals discrepancies without judgment

## Future Enhancements

- [ ] Level 3: Full triadic integration with database
- [ ] Level 4: Recursive meta-reality analysis
- [ ] Time-series integration health tracking
- [ ] Automated reconciliation execution
- [ ] Integration with CI/CD pipelines

## Contributing

The Integration Reality Agent is part of the EDL Platform Reality Auditor system. Contributions should follow the reality-first principles and maintain backward compatibility with existing Reality Agents.

---

*"In the correlation of truths, the meta-truth emerges."*