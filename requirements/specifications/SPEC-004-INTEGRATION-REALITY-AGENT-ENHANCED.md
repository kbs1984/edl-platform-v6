# SPEC-004: Integration Reality Agent (Enhanced)
**Version**: 2.0  
**Enhanced By**: Session 00004 with Session 00003's insights  
**For**: Session 00005  
**Date**: 2025-08-15  

## Executive Summary

Create a meta-Reality Agent that discovers how individual reality domains relate, conflict, and drift. This agent reveals integration truth by correlating outputs from all Reality Agents and session claims.

## Core Enhancement: Session Reality Correlation

```python
class IntegrationRealityAgent:
    """Reality Agent for Reality Agents - recursive truth discovery"""
    
    def discover_session_reality_gaps(self):
        """Compare what sessions claim vs what actually exists"""
        return {
            "claimed_work": self.extract_from_session_logs(),
            "actual_changes": self.fs_agent.detect_changes(),
            "actual_commits": self.gh_agent.get_commits(),
            "truth_score": self.calculate_claim_accuracy(),
            "deception_instances": self.find_retroactive_logging()
        }
```

## Enhanced Progressive Discovery

### Level 1: Agent Health Check (Confidence: 1.0)
```python
def level_1_health_check(self):
    return {
        "fs_agent": self.check_fs_agent_health(),
        "gh_agent": self.check_gh_agent_health(),  
        "db_agent": self.check_db_agent_health(),
        "partial_capability": self.determine_fallback_mode()
    }
```

### Level 2: Binary Correlation (Confidence: 0.8)
Start with just FS + Git before adding third:
```python
def level_2_binary_correlation(self):
    """Session 00003's advice: Start with 2 agents"""
    return {
        "fs_git_sync": self.correlate_filesystem_git(),
        "uncommitted": self.find_uncommitted_changes(),
        "untracked": self.find_untracked_files(),
        "unpushed": self.find_unpushed_commits()
    }
```

### Level 3: Triadic Integration (Confidence: 0.6)
Add database for full correlation:
```python
def level_3_triadic_integration(self):
    return {
        "fs_git_db_matrix": self.build_truth_matrix(),
        "schema_drift": self.detect_schema_code_mismatch(),
        "orphaned_data": self.find_data_without_code(),
        "consensus_score": self.calculate_agent_agreement()
    }
```

### Level 4: Meta-Reality Analysis (Confidence: 0.4)
Discover the reality of reality discovery:
```python
def level_4_meta_reality(self):
    return {
        "session_truth": self.verify_session_claims(),
        "time_gap_impact": self.analyze_gap_drift(),
        "historical_trend": self.track_integration_health(),
        "recursive_truth": self.verify_agent_self_reporting()
    }
```

## Integration Health Scoring System

```python
class IntegrationHealthScorer:
    """Quantify integration health across dimensions"""
    
    def calculate_health_score(self) -> Dict[str, float]:
        return {
            "synchronization": self.sync_score(),      # 0.0-1.0: How aligned?
            "completeness": self.completeness_score(), # 0.0-1.0: How much tracked?
            "consistency": self.consistency_score(),   # 0.0-1.0: Do agents agree?
            "transparency": self.transparency_score(), # 0.0-1.0: What's hidden?
            "overall": self.weighted_average(),        # 0.0-1.0: System health
        }
    
    def generate_health_bar(self, score: float) -> str:
        """Visual ASCII health bar"""
        filled = int(score * 20)
        empty = 20 - filled
        return f"[{'█' * filled}{'░' * empty}] {score:.1%}"
```

## Time-Aware Integration

Handle session reality gaps:

```python
class TimeAwareIntegration:
    """Track integration across session gaps"""
    
    def __init__(self):
        self.snapshots = {}
        
    def snapshot_before_gap(self, session_id):
        """Capture state before break"""
        self.snapshots[session_id] = {
            "timestamp": datetime.now(),
            "fs_state": self.fs_agent.capture_snapshot(),
            "git_state": self.gh_agent.get_state(),
            "integration_score": self.calculate_current_score()
        }
    
    def detect_gap_drift(self, session_id):
        """What changed during the gap?"""
        before = self.snapshots.get(session_id)
        after = self.capture_current_state()
        
        return {
            "gap_duration": after["timestamp"] - before["timestamp"],
            "files_changed": self.diff_fs_states(before, after),
            "commits_added": self.diff_git_states(before, after),
            "integration_drift": after["score"] - before["score"],
            "context_preserved": self.verify_context_preservation()
        }
```

## Reconciliation Engine

Not just find gaps, but fix them:

```python
class ReconciliationPlanner:
    """Generate actionable fixes for gaps"""
    
    def plan_reconciliation(self, gap):
        plans = []
        
        if gap["type"] == "uncommitted_changes":
            plans.append({
                "gap": f"{gap['count']} uncommitted files",
                "action": "git add -A && git commit -m 'Reconcile uncommitted work'",
                "risk_if_ignored": "Work loss on branch switch",
                "priority": "HIGH",
                "estimated_time": "30 seconds"
            })
        
        if gap["type"] == "schema_drift":
            plans.append({
                "gap": f"Schema mismatch in {gap['tables']}",
                "action": "python manage.py makemigrations && migrate",
                "risk_if_ignored": "Runtime errors on database access",
                "priority": "CRITICAL",
                "estimated_time": "5 minutes"
            })
        
        return self.prioritize_plans(plans)
```

## Caching Strategy

Correlation is expensive, cache intelligently:

```python
class CorrelationCache:
    """Cache expensive correlations"""
    
    def __init__(self):
        self.cache = {}
        self.ttl = {
            "fs_state": 60,      # 1 minute
            "git_state": 300,    # 5 minutes  
            "db_state": 600,     # 10 minutes
            "correlation": 180   # 3 minutes
        }
    
    def get_or_compute(self, key, compute_func):
        if self.is_valid(key):
            return self.cache[key]["value"]
        
        value = compute_func()
        self.cache[key] = {
            "value": value,
            "timestamp": datetime.now()
        }
        return value
```

## Visual Output Format

```
════════════════════════════════════════════════════════════
                 INTEGRATION REALITY REPORT
════════════════════════════════════════════════════════════

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

📈 Historical Trend:
  Yesterday: 45% integrated
  Today: 65% integrated
  Trend: ↑ Improving

💡 Truth: "System is 65% integrated. Reality agents agree on 91.5% of facts.
         Main gap: uncommitted work and session claim discrepancies."
════════════════════════════════════════════════════════════
```

## Expected Discoveries (Session 00003's Predictions)

1. **Massive uncommitted changes** - Our established pattern
2. **Session logs claiming non-existent work** - Retroactive logging issues
3. **Documentation describing unbuilt features** - Aspirational docs
4. **GitHub agent not in PR** - Despite being complete

## Implementation Roadmap for Session 00005

### Phase 1: Binary Foundation (2 hours)
1. Start with FS + Git agents only
2. Build basic correlation
3. Test on our known gaps
4. Verify caching works

### Phase 2: Add Database (1 hour)
1. Integrate Supabase agent
2. Build triadic correlation
3. Create truth matrix
4. Test schema drift detection

### Phase 3: Session Reality (1 hour)
1. Add session log parsing
2. Compare claims vs reality
3. Detect retroactive logging
4. Calculate truth scores

### Phase 4: Visual & Reconciliation (2 hours)
1. Build ASCII health bars
2. Create reconciliation planner
3. Generate actionable fixes
4. Test across session gaps

## The Meta-Truth

As Session 00003 noted: "This is a Reality Agent for Reality Agents - discovering the reality of our reality discovery."

The Integration Agent will reveal:
- How well our agents agree on truth
- Where our session logs diverge from reality
- What gaps exist between claimed and actual work
- How integration health changes over time

## Success Criteria

1. **Detect Our Known Gaps**: Find the uncommitted work we know exists
2. **Reveal Session Deceptions**: Identify retroactive logging instances
3. **Provide Fixes**: Every gap has an actionable remedy
4. **Work Across Gaps**: Test the session reality protocol
5. **Visual Clarity**: ASCII art makes health obvious

---

*"In the correlation of truths, the meta-truth emerges."*