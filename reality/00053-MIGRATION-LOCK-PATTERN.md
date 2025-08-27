---
created: '2025-08-23'
domain: reality
priority: P1
purpose: Document reality agent migration lock integration pattern
session: '00053'
status: current
title: Reality Agent Migration Lock Integration Pattern
topics:
- migration
- documentation
type: guide
---

# Reality Agent Migration Lock Integration Pattern
**Session**: 00053  
**Purpose**: Enable Reality Agents to understand and enforce the migration baseline  

---

## Overview

This pattern shows how Reality Agents should be updated to understand the locked migration baseline and detect drift from it.

---

## Implementation Pattern

### 1. Base Migration-Aware Agent Class

```python
# reality/agent-reality-auditor/base_migration_aware.py

import json
from pathlib import Path
from abc import ABC, abstractmethod

class MigrationAwareAgent(ABC):
    """Base class for all migration-aware Reality Agents"""
    
    def __init__(self):
        self.lock_file = Path("reality/truth-seed-manifest-lock.json")
        self.migration_lock = self.load_migration_lock()
        self.is_locked = self.migration_lock is not None
        
    def load_migration_lock(self):
        """Load the migration lock file if it exists"""
        if self.lock_file.exists():
            with open(self.lock_file, 'r') as f:
                return json.load(f)
        return None
    
    def is_immutable_object(self, object_type, object_name):
        """Check if an object is protected by the migration lock"""
        if not self.is_locked:
            return False
            
        immutable = self.migration_lock.get("immutable_objects", {})
        
        # Check if this specific object is immutable
        if object_type in immutable:
            if isinstance(immutable[object_type], list):
                return object_name in immutable[object_type]
            elif isinstance(immutable[object_type], int):
                # For counts (like foreign_keys: 52)
                return True
        return False
    
    def is_modifiable_with_tracking(self, object_type):
        """Check if an object type can be modified but needs tracking"""
        if not self.is_locked:
            return False
            
        modifiable = self.migration_lock.get("modifiable_with_tracking", {})
        return object_type in modifiable
    
    @abstractmethod
    def detect_drift(self):
        """Each agent implements its own drift detection"""
        pass
```

---

## 2. Supabase Agent Integration

```python
# reality/agent-reality-auditor/supabase-connector/migration_aware_connector.py

from base_migration_aware import MigrationAwareAgent
from supabase import create_client
import os

class MigrationAwareSupabaseAgent(MigrationAwareAgent):
    """Supabase agent that understands migration lock"""
    
    def __init__(self):
        super().__init__()
        self.client = create_client(
            os.environ['SUPABASE_URL'],
            os.environ['SUPABASE_ANON_KEY']
        )
        
    def detect_drift(self):
        """Detect if database has drifted from locked baseline"""
        if not self.is_locked:
            return {"status": "no_lock", "message": "No migration lock to compare against"}
        
        drift_report = {
            "timestamp": datetime.now().isoformat(),
            "drift_detected": False,
            "critical_drift": [],
            "warning_drift": [],
            "info_drift": []
        }
        
        # Check table count
        current_tables = self.count_tables()
        expected_tables = self.migration_lock["database_state"]["tables_count"]
        
        if current_tables != expected_tables:
            drift_report["drift_detected"] = True
            if current_tables < expected_tables:
                # Tables missing - CRITICAL
                drift_report["critical_drift"].append({
                    "type": "missing_tables",
                    "expected": expected_tables,
                    "actual": current_tables,
                    "severity": "CRITICAL"
                })
            else:
                # Extra tables - WARNING
                drift_report["warning_drift"].append({
                    "type": "extra_tables",
                    "expected": expected_tables,
                    "actual": current_tables,
                    "severity": "WARNING"
                })
        
        # Check RLS policies
        current_policies = self.count_rls_policies()
        expected_policies = self.migration_lock["database_state"]["rls_policies"]
        
        if current_policies != expected_policies:
            drift_report["drift_detected"] = True
            # RLS is modifiable with tracking
            drift_report["info_drift"].append({
                "type": "rls_policy_change",
                "expected": expected_policies,
                "actual": current_policies,
                "severity": "INFO",
                "note": "RLS policies can be modified with tracking"
            })
        
        return drift_report
    
    def enforce_baseline(self, action):
        """Prevent modifications to immutable objects"""
        
        if action["type"] == "ALTER_TABLE":
            if self.is_immutable_object("tables", action["table"]):
                return {
                    "allowed": False,
                    "reason": f"Table {action['table']} is immutable per migration lock",
                    "suggestion": "Create new table or column instead of altering structure"
                }
        
        if action["type"] == "DROP_FUNCTION":
            if self.is_immutable_object("business_functions", action["function"]):
                return {
                    "allowed": False,
                    "reason": f"Function {action['function']} is core business logic",
                    "suggestion": "Deprecate and create new function instead"
                }
        
        if action["type"] == "CREATE_INDEX":
            # Indexes are modifiable with tracking
            return {
                "allowed": True,
                "requires_tracking": True,
                "update_manifest": "reality/truth-seed-manifest.json"
            }
        
        return {"allowed": True}
```

---

## 3. Integration Agent Enhancement

```python
# reality/agent-reality-auditor/integration-connector/migration_validator.py

class MigrationValidator:
    """Validates all agents against migration baseline"""
    
    def __init__(self):
        self.agents = {
            "supabase": MigrationAwareSupabaseAgent(),
            "filesystem": MigrationAwareFileSystemAgent(),
            # ... other agents
        }
        
    def validate_system_integrity(self):
        """Run all agents to check for drift"""
        
        results = {
            "timestamp": datetime.now().isoformat(),
            "system_valid": True,
            "agent_reports": {}
        }
        
        for name, agent in self.agents.items():
            try:
                drift = agent.detect_drift()
                results["agent_reports"][name] = drift
                
                if drift.get("drift_detected"):
                    # Check severity
                    if drift.get("critical_drift"):
                        results["system_valid"] = False
                        results["action_required"] = "IMMEDIATE"
                    elif drift.get("warning_drift"):
                        results["action_required"] = "REVIEW"
                        
            except Exception as e:
                results["agent_reports"][name] = {
                    "error": str(e),
                    "status": "failed"
                }
        
        return results
    
    def generate_drift_summary(self):
        """Create human-readable drift report"""
        
        validation = self.validate_system_integrity()
        
        summary = []
        summary.append("=" * 60)
        summary.append("MIGRATION BASELINE DRIFT REPORT")
        summary.append("=" * 60)
        summary.append(f"Timestamp: {validation['timestamp']}")
        summary.append(f"System Valid: {'✅ YES' if validation['system_valid'] else '❌ NO'}")
        
        if not validation["system_valid"]:
            summary.append("\n⚠️  CRITICAL ISSUES DETECTED:")
            for agent, report in validation["agent_reports"].items():
                if report.get("critical_drift"):
                    for issue in report["critical_drift"]:
                        summary.append(f"  • {agent}: {issue['type']}")
                        summary.append(f"    Expected: {issue['expected']}")
                        summary.append(f"    Actual: {issue['actual']}")
        
        return "\n".join(summary)
```

---

## 4. Session Integration

Add to session startup to use the new pattern:

```python
# scripts/00053-check-migration-drift.py

from reality.agent_reality_auditor.integration_connector.migration_validator import MigrationValidator

def check_migration_drift():
    """Quick check for migration drift at session start"""
    
    validator = MigrationValidator()
    results = validator.validate_system_integrity()
    
    if not results["system_valid"]:
        print("⚠️  WARNING: Migration drift detected!")
        print(validator.generate_drift_summary())
        
        response = input("\nContinue with session anyway? (y/N): ")
        if response.lower() != 'y':
            print("Exiting. Please resolve drift before continuing.")
            exit(1)
    else:
        print("✅ No migration drift detected")
    
    return results

if __name__ == "__main__":
    check_migration_drift()
```

---

## 5. Usage Examples

### Check for Drift
```bash
# Quick drift check
python3 reality/agent-reality-auditor/check-drift.py

# Detailed validation
python3 reality/agent-reality-auditor/integration-connector/migration_validator.py
```

### Enforce Baseline
```python
# In application code
agent = MigrationAwareSupabaseAgent()

# Before making changes
action = {
    "type": "ALTER_TABLE",
    "table": "public.student",
    "change": "DROP COLUMN user_id"
}

permission = agent.enforce_baseline(action)
if not permission["allowed"]:
    print(f"❌ {permission['reason']}")
    print(f"💡 {permission['suggestion']}")
```

### Track Allowed Changes
```python
# For modifiable objects
action = {
    "type": "CREATE_INDEX",
    "table": "public.student",
    "index": "idx_student_call_sign"
}

permission = agent.enforce_baseline(action)
if permission["allowed"] and permission.get("requires_tracking"):
    # Update the manifest
    update_reality_manifest(action)
    print(f"✅ Change allowed and tracked in {permission['update_manifest']}")
```

---

## Key Principles

1. **Immutable Objects Cannot Change**
   - Core tables, trigger functions, business logic
   - Attempts to modify return explicit denial

2. **Modifiable Objects Require Tracking**
   - RLS policies, indexes, new functions
   - Changes allowed but must update manifest

3. **Drift Detection is Continuous**
   - Every session start checks integrity
   - Agents validate their domain against lock

4. **Severity Levels Guide Response**
   - CRITICAL: Stop and fix immediately
   - WARNING: Review and document
   - INFO: Track for awareness

5. **Reality Agents are Truth Guardians**
   - They protect the migration baseline
   - They detect unauthorized changes
   - They guide proper evolution

---

## Implementation Timeline

### Phase 1: Pattern Documentation (Session 53) ✅
- Document the pattern
- Show example implementations
- Create base classes

### Phase 2: Agent Updates (Session 54+)
- Update each Reality Agent
- Add drift detection methods
- Test enforcement logic

### Phase 3: Full Integration (Session 55+)
- Integrate with session startup
- Add continuous monitoring
- Create drift dashboards

---

*This pattern ensures Reality Agents become active guardians of the migration baseline, detecting drift and enforcing immutability where needed.*