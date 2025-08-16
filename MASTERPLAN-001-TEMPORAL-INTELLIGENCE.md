# MASTERPLAN-001: Temporal Intelligence System
**Version**: 1.0.0  
**Created**: Session 00014  
**Date**: 2025-08-16  
**Domain**: Time-based analysis and drift detection  
**Priority**: HIGH - Foundation for predictive capabilities

---

## Executive Summary

### Problem Statement
Current reality checks are stateless snapshots. We cannot detect gradual degradation, identify patterns, or predict future issues. A 97% health score today tells us nothing about whether it was 99% yesterday or 80% last week.

### Solution Approach
Build a temporal intelligence layer that tracks all metrics over time, detects drift patterns, identifies anomalies, and predicts future states. This transforms reactive monitoring into proactive system management.

### Expected Outcomes
- Drift detection within 5 minutes of occurrence
- Pattern recognition for recurring issues
- Predictive alerts 30 minutes before problems
- Trend-based optimization recommendations
- Historical insight for root cause analysis

---

## Current State Analysis

### What Exists Today
- Point-in-time reality checks via agents
- Manual comparison possible via git history
- Some caching in .cache/ directories
- Session logs with timestamps
- No automatic historical tracking

### What's Working
- Agents provide consistent output format
- Timestamps exist in various logs
- Git provides some historical capability
- Sessions document changes over time

### What's Failing
- No automatic trend analysis
- Cannot detect slow degradation
- No baseline establishment
- Missing seasonal patterns
- No predictive capabilities

### Gap Analysis
| Capability | Current | Target | Impact |
|------------|---------|--------|--------|
| Historical Storage | None | 30 days | Can't see patterns |
| Drift Detection | Manual | Automatic | Miss slow failures |
| Anomaly Detection | None | ML-based | Can't predict issues |
| Baseline Comparison | None | Automatic | No normal reference |
| Pattern Recognition | None | Algorithmic | Repeat mistakes |

---

## Target Architecture

### System Design
```
┌─────────────────────────────────────────────────────┐
│                  Temporal Engine                     │
├──────────────┬───────────────┬──────────────────────┤
│   Collector  │   Analyzer    │     Predictor        │
├──────────────┼───────────────┼──────────────────────┤
│              │               │                      │
│  Snapshot    │  Drift Calc   │  Trend Analysis     │
│  Storage     │  Anomaly Det  │  Pattern Match      │
│  Rotation    │  Baseline Comp│  Future Projection  │
└──────────────┴───────────────┴──────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
   Historical DB   Alert System   Dashboard
```

### Data Model
```python
@dataclass
class TemporalSnapshot:
    timestamp: datetime
    session_id: str
    metrics: Dict[str, float]
    
@dataclass  
class DriftAnalysis:
    metric: str
    baseline: float
    current: float
    drift_percentage: float
    drift_rate: float  # per hour
    confidence: float
    
@dataclass
class Pattern:
    name: str
    occurrences: List[datetime]
    trigger_conditions: Dict
    predicted_next: Optional[datetime]
```

### Storage Strategy
- **Hot Storage** (1 hour): In-memory for real-time
- **Warm Storage** (24 hours): SQLite for queries
- **Cold Storage** (30 days): Compressed JSON archives
- **Retention**: Automatic rotation and cleanup

---

## Implementation Phases

### Phase 1: Historical Storage System (Session 15)
- [ ] Create temporal database schema (`temporal/schema.sql`)
- [ ] Build snapshot collector (`temporal/collector.py`)
- [ ] Implement storage rotation (`temporal/rotation.py`)
- [ ] Create retrieval API (`temporal/query.py`)
- [ ] Add backup/restore capability
- **Success Criteria**: 24 hours of data retained and queryable

### Phase 2: Drift Detection Engine (Session 16)
- [ ] Implement baseline calculation (`temporal/baseline.py`)
- [ ] Build drift detector (`temporal/drift.py`)
- [ ] Create anomaly detection (`temporal/anomaly.py`)
- [ ] Add configurable thresholds
- [ ] Generate drift reports
- **Success Criteria**: Drift detected within 5 minutes

### Phase 3: Pattern Recognition (Session 17)
- [ ] Build pattern matcher (`temporal/patterns.py`)
- [ ] Implement trend analysis (`temporal/trends.py`)
- [ ] Create prediction engine (`temporal/predict.py`)
- [ ] Add seasonal adjustments
- [ ] Generate insights report
- **Success Criteria**: 80% accuracy on predictions

---

## Temporal Analysis Specifications

### Drift Detection Algorithm
```python
def calculate_drift(baseline: float, current: float, 
                   sensitivity: float = 0.05) -> DriftAnalysis:
    """
    Detect meaningful drift from baseline
    
    Sensitivity levels:
    - 0.01: Extreme (1% triggers)
    - 0.05: High (5% triggers) [default]
    - 0.10: Medium (10% triggers)
    - 0.20: Low (20% triggers)
    """
    drift_pct = (current - baseline) / baseline
    
    # Calculate rate of change
    time_delta = now - baseline_time
    drift_rate = drift_pct / time_delta.hours
    
    # Confidence based on sample size
    confidence = min(sample_count / 10, 1.0)
    
    return DriftAnalysis(
        metric=metric_name,
        baseline=baseline,
        current=current,
        drift_percentage=drift_pct,
        drift_rate=drift_rate,
        confidence=confidence
    )
```

### Pattern Recognition Rules

#### Degradation Pattern
```
IF metric decreases >2% for 3 consecutive checks
THEN flag "gradual_degradation"
ACTION: Investigate root cause
```

#### Oscillation Pattern  
```
IF metric alternates ±10% more than 5 times in 1 hour
THEN flag "unstable_oscillation"
ACTION: Check for competing processes
```

#### Cliff Pattern
```
IF metric drops >20% in single check
THEN flag "cliff_drop"
ACTION: Immediate investigation required
```

#### Recovery Pattern
```
IF metric improves >5% after intervention
THEN flag "successful_recovery"
ACTION: Document fix for automation
```

---

## Metrics & Baselines

### Core Metrics to Track
| Metric | Collection Frequency | Baseline Period | Drift Threshold |
|--------|---------------------|-----------------|-----------------|
| Consensus Score | 5 minutes | 24 hours | ±5% |
| Agent Health | 5 minutes | 1 hour | ±10% |
| Response Time | Every check | 1 hour | +20% |
| Error Rate | 1 minute | 24 hours | +100% |
| Memory Usage | 5 minutes | 1 hour | +30% |
| Disk I/O | 5 minutes | 1 hour | +50% |
| Git Operations | Per operation | Session | +100% |
| Task Velocity | Hourly | Week | ±20% |

### Baseline Calculation Methods

#### Simple Moving Average
```python
baseline = sum(last_n_values) / n
# Good for: Stable metrics with low variance
```

#### Exponential Weighted Average
```python
baseline = alpha * current + (1 - alpha) * previous_baseline
# Good for: Adapting to gradual changes
```

#### Percentile Based
```python
baseline = percentile(historical_values, 50)  # median
# Good for: Metrics with outliers
```

#### Seasonal Decomposition
```python
baseline = trend + seasonal + residual
# Good for: Metrics with time-of-day patterns
```

---

## Alert Generation

### Alert Triggers
```yaml
alerts:
  - name: "Consensus Degrading"
    condition: "drift('consensus_score') < -5% over 1 hour"
    severity: "WARNING"
    action: "Run full reality check"
    
  - name: "Agent Failure Pattern"
    condition: "pattern('agent_failure') detected 3 times"
    severity: "CRITICAL"
    action: "Check credentials and connectivity"
    
  - name: "Performance Cliff"
    condition: "metric('response_time') > baseline * 2"
    severity: "WARNING"  
    action: "Clear caches and check resources"
    
  - name: "Positive Trend"
    condition: "trend('task_velocity') > 20% improvement"
    severity: "INFO"
    action: "Document successful practices"
```

### Alert Suppression Rules
- Same alert within 5 minutes: Suppress
- During known maintenance: Suppress
- Outside session hours: Queue for review
- After manual override: Suppress for 1 hour

---

## Predictive Capabilities

### Time Series Forecasting
```python
def predict_next_value(historical: List[float], 
                       horizon: int = 6) -> List[float]:
    """
    Predict next N values using ARIMA model
    
    Returns predictions with confidence intervals
    """
    model = ARIMA(historical, order=(1,1,1))
    forecast = model.forecast(steps=horizon)
    return forecast
```

### Failure Prediction
```python
def predict_failure_probability(metrics: Dict, 
                               patterns: List[Pattern]) -> float:
    """
    Calculate probability of failure in next hour
    
    Based on:
    - Current drift rate
    - Historical patterns
    - System load
    - Time since last issue
    """
    risk_score = 0.0
    
    # Drift contribution (40%)
    risk_score += calculate_drift_risk() * 0.4
    
    # Pattern match contribution (30%)
    risk_score += pattern_match_risk() * 0.3
    
    # Load contribution (20%)
    risk_score += system_load_risk() * 0.2
    
    # Time decay (10%)
    risk_score += time_decay_risk() * 0.1
    
    return min(risk_score, 1.0)
```

---

## Success Metrics

### Detection Metrics
- **Drift Detection Latency**: <5 minutes
- **Pattern Recognition Accuracy**: >80%
- **Prediction Accuracy**: >70%
- **False Positive Rate**: <10%

### Performance Metrics
- **Query Response Time**: <100ms
- **Storage Overhead**: <5% of system
- **CPU Usage**: <2% continuous
- **Memory Usage**: <100MB active

### Business Metrics
- **Issues Prevented**: >5 per week
- **MTTR Improvement**: >30% reduction
- **Session Productivity**: >15% increase
- **Surprise Incidents**: <1 per month

---

## Risk Mitigation

### Risk: Storage Overflow
- **Mitigation**: Automatic rotation, compression
- **Monitoring**: Disk usage alerts at 80%
- **Fallback**: Reduce retention to 7 days

### Risk: Analysis Performance Impact
- **Mitigation**: Async processing, sampling
- **Monitoring**: CPU usage tracking
- **Fallback**: Reduce analysis frequency

### Risk: Alert Fatigue
- **Mitigation**: Smart suppression, tunable thresholds
- **Monitoring**: Alert acknowledgment rate
- **Fallback**: Increase thresholds gradually

---

## Integration Requirements

### Data Sources
- Reality Agents (every 5 minutes)
- Git hooks (on operations)
- System metrics (continuous)
- Session events (start/end)
- User actions (on demand)

### Data Consumers  
- Unified Dashboard (real-time)
- Alert System (event-driven)
- Session Handoffs (on close)
- Recovery Scripts (on trigger)
- Reports (scheduled)

### API Endpoints
```python
# Temporal API
GET  /api/temporal/snapshot/{timestamp}
GET  /api/temporal/range/{start}/{end}
GET  /api/temporal/drift/{metric}
GET  /api/temporal/baseline/{metric}
GET  /api/temporal/predict/{metric}/{horizon}
POST /api/temporal/snapshot
```

---

## Maintenance & Evolution

### Daily Tasks
- Verify rotation occurred
- Review drift reports
- Tune alert thresholds
- Update baselines

### Weekly Tasks
- Pattern analysis review
- Prediction accuracy check
- Storage optimization
- Performance tuning

### Monthly Tasks
- Baseline recalibration
- Pattern library update
- Algorithm improvements
- Capacity planning

---

## Dependencies

### Requires
- Unified Monitoring (MASTERPLAN-000) for data aggregation
- Reality Agents operational
- Python with pandas, scipy
- SQLite with time-series extension

### Enables  
- Self-Healing (MASTERPLAN-002) via predictive triggers
- Lifecycle (MASTERPLAN-003) via productivity trends
- Commands (MASTERPLAN-004) via performance data

### Conflicts
- None identified

---

## Example Outputs

### Drift Report
```
Temporal Intelligence Report - Session 00014
============================================
Period: 2025-08-16 12:00 - 14:00

DRIFT ANALYSIS
--------------
Consensus Score: -2.3% (ACCEPTABLE)
  Baseline: 98.2% (24h average)
  Current: 95.9%
  Trend: Gradual decline
  
GitHub Agent: +5.1% (IMPROVING)
  Baseline: 91.0%
  Current: 96.1%
  Trend: Recovery after fix

PATTERNS DETECTED
----------------
1. Daily Dip: Consensus drops 3-5% at 14:00
   Next Expected: 2025-08-17 14:00
   
2. Post-Commit Spike: Response time +40% after commits
   Occurrences: 12 in last 24h
   
PREDICTIONS
-----------
Next Hour Consensus: 96.5% ± 2%
Failure Probability: 12% (LOW)
Recommended Action: Monitor only

ANOMALIES
---------
None detected in reporting period
```

---

*This masterplan transforms point-in-time monitoring into intelligent temporal analysis.*