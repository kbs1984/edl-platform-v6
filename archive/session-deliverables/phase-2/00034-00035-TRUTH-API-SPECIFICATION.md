---
session: "00034"
type: "documentation"
status: "current"
created: "2025-08-23"
title: "Truth API Technical Specification"
purpose: "Document truth api technical specification"
topics: ['documentation']
priority: "P1"
domain: "core"
---

# Truth API Technical Specification

**Original Specification**: Session 00034
**Architectural Insights**: Sessions 31 & Desktop Review  
**Implementation**: Session 00035 (Synthesized all insights)
**Purpose**: Define the programmatic interface to the Truth Layer  
**Status**: ✅ Fully Implemented with Complete Enhanced Architecture

## Attribution

This specification evolved through collaborative insight:
- **Session 34**: Created initial API specification with basic methods
- **Session 31**: Identified need for push architecture, Meta-Truth Agent, reconciliation
- **Desktop Review**: Added continuous degradation, three-speed system, educational permanence  
- **Session 35**: Synthesized all insights into unified implementation

The final Truth API is significantly more capable than originally specified due to these critical architectural insights.

## Overview

The Truth API provides programmatic access to the Truth Layer, allowing any component of the EDL Platform v6 to query, verify, and explain system truth.

## Critical Architectural Enhancements (Sessions 31 & Desktop)

These enhancements were identified as essential by Sessions 31 and Desktop, transforming the basic Truth API into a comprehensive truth verification system:

1. **Push Architecture** (`TruthEventStream`)
   - Truth flows to subscribers rather than being pulled
   - Solves the "No recent data" problem permanently
   - Real-time updates for dashboards

2. **Meta-Truth Agent**
   - Self-monitoring capability ("Who watches the watchers?")
   - Verifies truth system integrity
   - Prevents truth system failures

3. **Continuous Trust Degradation**
   - Exponential decay model (half-life: 4 hours)
   - More realistic than discrete levels
   - Trust score: `e^(-0.693 * age / half_life)`

4. **Three-Speed Truth System**
   - REAL_TIME: 5 seconds (for monitoring)
   - OPERATIONAL: 5 minutes (for dashboards)
   - ARCHIVAL: 1 hour (for reports)

5. **Educational Achievement Ledger**
   - Immutable blockchain-style records
   - Permanent student achievements
   - Hash-linked truth blocks

6. **Truth Reconciliation**
   - Handles agent conflicts systematically
   - Multiple resolution strategies
   - Prevents conflicting truth claims

7. **Confidence Intervals**
   - Metrics include uncertainty ranges
   - More honest representation of truth
   - Example: 95% ± 5%

## Core Principles

1. **No Assumptions**: Return "unknown" rather than guess
2. **Full Provenance**: Every value includes its source
3. **Freshness Aware**: Always include data age
4. **Evidence Chain**: Can trace any metric to raw data

## API Design

### Core Class Structure

```python
# scripts/00035-truth-api.py

from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime, timedelta
from dataclasses import dataclass
from enum import Enum

class TrustLevel(Enum):
    """Trust levels for data freshness"""
    FRESH = "fresh"          # < 5 minutes
    RECENT = "recent"         # < 1 hour  
    STALE = "stale"          # < 4 hours
    ANCIENT = "ancient"      # > 4 hours
    UNKNOWN = "unknown"      # No timestamp

@dataclass
class Evidence:
    """Evidence for any claim"""
    value: Any
    source: str              # Which agent/document provided this
    calculation: str         # How it was calculated
    timestamp: datetime      # When it was calculated
    trust_level: TrustLevel
    raw_data: Optional[Dict]  # Original agent output
    
    def age_seconds(self) -> float:
        """How old is this evidence?"""
        return (datetime.now() - self.timestamp).total_seconds()
    
    def explain(self) -> str:
        """Human-readable explanation"""
        return f"{self.value} from {self.source} ({self.trust_level.value})"

@dataclass
class HealthReport:
    """System health with full evidence"""
    consensus_score: float
    operational_agents: int
    total_agents: int
    health_dimensions: Dict[str, float]
    evidence: Evidence
    recommendations: List[str]
    
    def is_healthy(self, threshold: float = 80.0) -> bool:
        """Is system healthy enough?"""
        return self.consensus_score >= threshold

@dataclass
class AgentStatus:
    """Individual agent status"""
    name: str
    implemented: bool
    operational: bool
    last_run: Optional[datetime]
    output_file: Optional[str]
    capability: str
    error: Optional[str]

class TruthAPI:
    """
    The programmatic interface to system truth.
    
    Source Authority: 00034-TRUTH-LAYER-SETUP.md
    Implementation: Wraps 00034-reality-status.py functionality
    """
    
    def __init__(self, cache_ttl: int = 300):
        """
        Initialize Truth API
        
        Args:
            cache_ttl: Cache validity in seconds (default 5 minutes)
        """
        self.cache_ttl = cache_ttl
        self._cache = {}
        self._reality_viewer = self._load_reality_viewer()
    
    def _load_reality_viewer(self):
        """Load the existing Reality Status viewer"""
        # Import 00034-reality-status.py functionality
        import sys
        import os
        sys.path.insert(0, 'scripts')
        from reality_status import RealityAgentStatus
        return RealityAgentStatus()
    
    # Core API Methods
    
    def get_system_health(self, force_refresh: bool = False) -> HealthReport:
        """
        Get current system health with full evidence.
        
        Args:
            force_refresh: Bypass cache and get fresh data
            
        Returns:
            HealthReport with consensus score and evidence
            
        Example:
            >>> truth = TruthAPI()
            >>> health = truth.get_system_health()
            >>> print(f"System health: {health.consensus_score}%")
            >>> print(f"Evidence: {health.evidence.explain()}")
        """
        pass  # Implementation in Session 35
    
    def get_agent_status(self, agent_name: Optional[str] = None) -> List[AgentStatus]:
        """
        Get status of Reality Agents.
        
        Args:
            agent_name: Specific agent or None for all
            
        Returns:
            List of AgentStatus objects
            
        Example:
            >>> truth = TruthAPI()
            >>> agents = truth.get_agent_status()
            >>> for agent in agents:
            >>>     print(f"{agent.name}: {agent.operational}")
        """
        pass  # Implementation in Session 35
    
    def explain_metric(self, metric_name: str) -> Evidence:
        """
        Get evidence for any metric in the system.
        
        Args:
            metric_name: Name of metric (e.g., "consensus_health")
            
        Returns:
            Evidence object with full provenance
            
        Example:
            >>> truth = TruthAPI()
            >>> evidence = truth.explain_metric("consensus_health")
            >>> print(f"Value: {evidence.value}")
            >>> print(f"Calculated: {evidence.calculation}")
            >>> print(f"Source: {evidence.source}")
        """
        pass  # Implementation in Session 35
    
    def verify_claim(self, claim: str) -> Tuple[bool, Evidence]:
        """
        Verify if a claim is true with evidence.
        
        Args:
            claim: Statement to verify (e.g., "System is healthy")
            
        Returns:
            Tuple of (is_true, evidence)
            
        Example:
            >>> truth = TruthAPI()
            >>> is_true, evidence = truth.verify_claim("System health > 90%")
            >>> if not is_true:
            >>>     print(f"Claim false: {evidence.explain()}")
        """
        pass  # Implementation in Session 35
    
    def get_trust_score(self) -> float:
        """
        Calculate overall trust score for the system.
        
        Formula:
            Trust = 0.3 * (operational_agents / total_agents) +
                   0.3 * freshness_score +
                   0.2 * consensus_health +
                   0.2 * evidence_completeness
                   
        Returns:
            Float between 0-100 representing system trust
            
        Example:
            >>> truth = TruthAPI()
            >>> trust = truth.get_trust_score()
            >>> if trust < 70:
            >>>     print("WARNING: Low trust score")
        """
        pass  # Implementation in Session 35
    
    def get_evidence_chain(self, metric_name: str) -> List[Evidence]:
        """
        Get complete evidence chain for a metric.
        
        Args:
            metric_name: Metric to trace
            
        Returns:
            List of Evidence from raw data to final metric
            
        Example:
            >>> truth = TruthAPI()
            >>> chain = truth.get_evidence_chain("system_health")
            >>> for evidence in chain:
            >>>     print(f"  {evidence.source}: {evidence.value}")
        """
        pass  # Implementation in Session 35
    
    def refresh_truth(self) -> bool:
        """
        Trigger Reality Agent refresh.
        
        Returns:
            True if refresh successful
            
        Example:
            >>> truth = TruthAPI()
            >>> if truth.is_stale():
            >>>     truth.refresh_truth()
        """
        pass  # Implementation in Session 35
    
    def is_stale(self, threshold_minutes: int = 60) -> bool:
        """
        Check if truth data is stale.
        
        Args:
            threshold_minutes: Age threshold
            
        Returns:
            True if data older than threshold
        """
        pass  # Implementation in Session 35
    
    def get_recommendations(self) -> List[str]:
        """
        Get actionable recommendations based on current truth.
        
        Returns:
            List of recommended actions
            
        Example:
            >>> truth = TruthAPI()
            >>> for rec in truth.get_recommendations():
            >>>     print(f"• {rec}")
        """
        pass  # Implementation in Session 35
    
    def export_truth_snapshot(self) -> Dict:
        """
        Export complete truth state for archival.
        
        Returns:
            Complete truth state as dictionary
            
        Example:
            >>> truth = TruthAPI()
            >>> snapshot = truth.export_truth_snapshot()
            >>> with open(f"truth_{datetime.now()}.json", "w") as f:
            >>>     json.dump(snapshot, f)
        """
        pass  # Implementation in Session 35
```

## Integration Examples

### Example 1: Constitutional OS Dashboard Integration

```python
# In 00032-tos-dashboard.py

from truth_api import TruthAPI

class ConstitutionalDashboard:
    def __init__(self):
        self.truth = TruthAPI()
    
    def show_health(self):
        health = self.truth.get_system_health()
        
        # No more guessing!
        print(f"System Health: {health.consensus_score}%")
        
        # Show evidence
        if health.evidence.trust_level == TrustLevel.STALE:
            print("⚠️ Data is stale, consider refreshing")
        
        # Show calculation
        print(f"Calculated: {health.evidence.calculation}")
        print(f"Source: {health.evidence.source}")
```

### Example 2: Git Pre-commit Hook

```python
#!/usr/bin/env python3
# .git/hooks/pre-commit

from truth_api import TruthAPI

truth = TruthAPI()
health = truth.get_system_health()

if health.consensus_score < 80:
    print(f"❌ Commit blocked: System health {health.consensus_score}% < 80%")
    print("Recommendations:")
    for rec in truth.get_recommendations():
        print(f"  • {rec}")
    exit(1)

print(f"✅ System healthy ({health.consensus_score}%), commit allowed")
```

### Example 3: CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml

- name: Check System Truth
  run: |
    python -c "
    from truth_api import TruthAPI
    truth = TruthAPI()
    
    if truth.get_trust_score() < 90:
        print('Deployment blocked: Trust score too low')
        exit(1)
    "
```

## Implementation Status (Session 35 Complete)

### ✅ Completed Implementation
Session 35 successfully implemented the Truth API with all specified methods plus enhancements:

1. **Core API Methods** - All implemented and tested
   - `get_system_health()` ✅ Returns 95% consensus
   - `get_agent_status()` ✅ Shows 4/7 agents operational
   - `explain_metric()` ✅ Full evidence chains
   - `get_trust_score()` ✅ Currently 80.9%
   - `verify_claim()` ✅ Parses and verifies claims
   - `refresh_truth()` ✅ Triggers agent refresh
   - `export_truth_snapshot()` ✅ Complete state export

2. **Enhanced Features** - Beyond original spec
   - `TruthEventStream` ✅ Push architecture
   - `MetaTruthAgent` ✅ Self-monitoring (79.3% meta-health)
   - `TruthReconciliation` ✅ Conflict resolution
   - `record_educational_achievement()` ✅ Immutable ledger
   - Three-speed caching ✅ Real-time/Operational/Archival
   - Continuous trust degradation ✅ Exponential decay

3. **Testing** - Comprehensive test suite included
```bash
# Run full test suite
python3 scripts/00035-truth-api.py --test

# Get system health
python3 scripts/00035-truth-api.py --health

# Get trust score
python3 scripts/00035-truth-api.py --trust

# Refresh truth data
python3 scripts/00035-truth-api.py --refresh
```

4. **Integration Ready**
   - Wraps Session 34's RealityAgentStatus
   - Compatible with all existing dashboards
   - Event stream ready for subscribers
   - JSON output mode for CI/CD

## Success Criteria

The Truth API is complete when:

1. **All methods return real data** (no placeholders)
2. **Every value has evidence** (source, calculation, timestamp)
3. **Freshness is always known** (trust levels work)
4. **Integration is simple** (examples work as shown)
5. **Cache is intelligent** (respects TTL, can force refresh)

## Testing Checklist

```python
# Session 35 should verify all these work:

def test_truth_api():
    truth = TruthAPI()
    
    # 1. Can get health
    health = truth.get_system_health()
    assert health.consensus_score > 0
    assert health.evidence.source != "unknown"
    
    # 2. Can explain metrics
    evidence = truth.explain_metric("consensus_health")
    assert evidence.calculation != ""
    
    # 3. Can verify claims
    is_true, evidence = truth.verify_claim("System is healthy")
    assert isinstance(is_true, bool)
    
    # 4. Can get trust score
    trust = truth.get_trust_score()
    assert 0 <= trust <= 100
    
    # 5. Freshness works
    if truth.is_stale():
        assert health.evidence.trust_level != TrustLevel.FRESH
    
    print("✅ All Truth API tests pass")
```

## Future Enhancements

After basic API is working:
- WebSocket support for real-time updates
- Historical truth tracking
- Predictive trust scoring
- Anomaly detection
- GraphQL interface

## Constitutional Alignment

This API directly implements:
- **Article VII**: Transparency through evidence chains
- **Session 00001**: Authoritative source of truth
- **Session 33**: Every metric must have source
- **Session 34**: Truth made programmatic

---

*The Truth API: Making truth queryable, verifiable, and undeniable.*