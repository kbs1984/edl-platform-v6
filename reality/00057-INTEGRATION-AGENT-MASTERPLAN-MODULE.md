---
created: '2025-08-23'
domain: reality
estimated_shelf_life: 3 months
modified: '2025-08-23'
priority: P0
purpose: Define integration agent architecture and implementation
session: '00057'
status: current
title: Integration Agent Masterplan Module
topics:
- integration
- agent
- architecture
- masterplan
type: specification
validation_method: automated
---

# Integration Agent Masterplan Module Specification
**Session**: 00057  
**Priority**: MEDIUM  
**Impact**: Provides masterplan-specific orchestration guidance  

## Problem Statement

The Integration Agent provides general health scores but no masterplan-specific guidance. Sessions working on auth/dashboard deployment need specific readiness checks and next-step recommendations.

## Enhancement Requirements

### 1. Masterplan Context Detection

```python
def detect_masterplan_context(self) -> Dict[str, Any]:
    """Detect which masterplan the session is working on"""
    
    context = {
        "active_masterplan": None,
        "phase": None,
        "blockers": [],
        "next_actions": []
    }
    
    # Check for masterplan files
    masterplan_files = {
        "auth": self.root_path / "requirements" / "masterplans" / "AUTH-MASTERPLAN.md",
        "dashboard": self.root_path / "requirements" / "masterplans" / "DASHBOARD-MASTERPLAN.md"
    }
    
    # Detect from session context
    latest_session = self._get_latest_session_log()
    if latest_session:
        content = latest_session.read_text().lower()
        if "auth" in content or "login" in content or "oauth" in content:
            context["active_masterplan"] = "auth"
        elif "dashboard" in content or "onboarding" in content:
            context["active_masterplan"] = "dashboard"
    
    return context

def assess_masterplan_readiness(self, masterplan: str) -> Dict[str, Any]:
    """Assess readiness for specific masterplan execution"""
    
    if masterplan == "auth":
        return self._assess_auth_readiness()
    elif masterplan == "dashboard":
        return self._assess_dashboard_readiness()
    else:
        return {"error": f"Unknown masterplan: {masterplan}"}

def _assess_auth_readiness(self) -> Dict[str, Any]:
    """Check readiness for AUTH-MASTERPLAN.md execution"""
    
    readiness = {
        "overall_ready": False,
        "phase_ready": {},
        "blockers": [],
        "next_actions": []
    }
    
    # Phase 0.5: Reality Agent Baseline
    if self.health_scores.get("overall", 0) < 0.95:
        readiness["blockers"].append("System health below 95% - run Reality Agents first")
    else:
        readiness["phase_ready"]["reality_baseline"] = True
    
    # Phase 1: Database Migration State
    if self.db_agent:
        # Check if truth-seed tables exist
        migration_state = self._check_truth_seed_deployment()
        if not migration_state["deployed"]:
            readiness["blockers"].append("Truth seed tables not deployed - run migration batches")
        else:
            readiness["phase_ready"]["database"] = True
    else:
        readiness["blockers"].append("Supabase Agent not available - check credentials")
    
    # Phase 2: Vercel Deployment Readiness
    if self.vercel_agent:
        vercel_status = self._check_vercel_readiness()
        readiness["phase_ready"]["vercel"] = vercel_status["ready"]
        if not vercel_status["ready"]:
            readiness["blockers"].extend(vercel_status["issues"])
    else:
        readiness["blockers"].append("Vercel Agent not available")
    
    # Phase 3: Truth Seed Code Availability
    truth_seed_path = self.root_path / "truth-seed" / "emdash-auth-main"
    if not truth_seed_path.exists():
        readiness["blockers"].append("Truth seed code not found - check truth-seed/ directory")
    else:
        readiness["phase_ready"]["truth_seed_code"] = True
    
    # Overall assessment
    readiness["overall_ready"] = len(readiness["blockers"]) == 0
    
    if readiness["overall_ready"]:
        readiness["next_actions"] = [
            "Deploy auth gateway to Vercel",
            "Configure environment variables", 
            "Test complete auth flow",
            "Verify cookie propagation"
        ]
    
    return readiness

def _check_truth_seed_deployment(self) -> Dict[str, Any]:
    """Check if truth seed database schema is deployed"""
    
    # Use enhanced Supabase Agent to check migration state
    if hasattr(self.db_agent, 'discover_level_05_migration_reality'):
        migration_reality = self.db_agent.discover_level_05_migration_reality()
        expected_tables = migration_reality.get("expected_tables", [])
        
        critical_tables = ['profile', 'student', 'team', 'guardian']
        deployed_critical = all(table in expected_tables for table in critical_tables)
        
        return {
            "deployed": deployed_critical,
            "expected_tables": len(expected_tables),
            "critical_tables_ready": deployed_critical
        }
    else:
        return {"deployed": False, "error": "Enhanced Supabase Agent not available"}

def _check_vercel_readiness(self) -> Dict[str, Any]:
    """Check Vercel deployment readiness"""
    
    readiness = {
        "ready": True,
        "issues": []
    }
    
    if self.vercel_agent:
        try:
            status = self.vercel_agent.discover_level_1()
            if not status.get('connected'):
                readiness["ready"] = False
                readiness["issues"].append("Vercel CLI not authenticated")
        except:
            readiness["ready"] = False
            readiness["issues"].append("Vercel Agent error")
    
    return readiness
```

### 2. Masterplan Progress Tracking

```python
def track_masterplan_progress(self, masterplan: str) -> Dict[str, Any]:
    """Track progress through masterplan phases"""
    
    progress = {
        "current_phase": None,
        "completed_phases": [],
        "next_phase": None,
        "completion_percentage": 0.0
    }
    
    if masterplan == "auth":
        phases = [
            "reality_baseline",
            "local_testing", 
            "supabase_config",
            "production_deploy",
            "verification",
            "edl_identity",
            "redirect_logic",
            "flow_testing"
        ]
        
        # Check which phases are complete
        completed = self._check_auth_phase_completion()
        progress["completed_phases"] = completed
        progress["completion_percentage"] = len(completed) / len(phases)
        
        # Determine current and next phase
        if len(completed) < len(phases):
            progress["next_phase"] = phases[len(completed)]
        
        if len(completed) > 0:
            progress["current_phase"] = phases[len(completed) - 1]
    
    return progress

def _check_auth_phase_completion(self) -> List[str]:
    """Check which auth masterplan phases are complete"""
    
    completed = []
    
    # Reality baseline (Phase 0.5)
    if self.health_scores.get("overall", 0) >= 0.95:
        completed.append("reality_baseline")
    
    # Supabase config (Phase 1.5)
    if self._check_call_sign_column():
        completed.append("supabase_config")
    
    # Production deploy (Phase 2) - check Vercel
    if self._check_auth_deployment():
        completed.append("production_deploy")
    
    return completed

def _check_call_sign_column(self) -> bool:
    """Check if call_sign column exists in student table"""
    
    if self.db_agent and hasattr(self.db_agent, 'discover_level_2_enhanced'):
        try:
            analysis = self.db_agent.discover_level_2_enhanced()
            student_info = analysis.get("expected_vs_actual", {}).get("student", {})
            # This would need to be enhanced to check specific columns
            return student_info.get("accessible") is not None
        except:
            return False
    return False

def _check_auth_deployment(self) -> bool:
    """Check if auth gateway is deployed to Vercel"""
    
    if self.vercel_agent:
        try:
            status = self.vercel_agent.discover_level_2()  # If implemented
            return status.get("deployment_ready", False)
        except:
            return False
    return False
```

### 3. Integration Enhancement to Integration Agent

Add to `generate_visual_report()` method:

```python
# Add after health scores section
masterplan_context = self.detect_masterplan_context()
if masterplan_context["active_masterplan"]:
    report.append(f"🎯 Active Masterplan: {masterplan_context['active_masterplan'].upper()}")
    
    readiness = self.assess_masterplan_readiness(masterplan_context["active_masterplan"])
    if readiness["overall_ready"]:
        report.append("✅ READY FOR EXECUTION")
    else:
        report.append("⚠️  BLOCKERS DETECTED:")
        for blocker in readiness["blockers"]:
            report.append(f"   • {blocker}")
    
    # Show next actions
    if readiness["next_actions"]:
        report.append("\n📋 Recommended Next Steps:")
        for i, action in enumerate(readiness["next_actions"], 1):
            report.append(f"   {i}. {action}")
```

## Implementation Priority

1. **Phase 1**: Add masterplan context detection
2. **Phase 2**: Implement auth readiness assessment
3. **Phase 3**: Add progress tracking
4. **Phase 4**: Integrate with visual report

## Expected Benefits

- Sessions get specific "You're ready for Phase X" guidance
- Blockers identified before attempting deployment
- Progress tracking prevents repeated work
- Integration with enhanced Supabase Agent for complete picture

---

This module transforms the Integration Agent from "health reporter" to "masterplan execution advisor."