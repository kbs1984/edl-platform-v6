#!/usr/bin/env python3
"""
Session 00029: Action Planner for Truth Operating System
Generates prioritized implementation plans based on gap analysis
"""

import json
import os
from typing import Dict, List, Any
from datetime import datetime, timedelta

class ActionPlanner:
    """Generates actionable implementation plans from gap analysis"""
    
    def __init__(self):
        self.gaps = self.load_gaps()
        self.action_plan = {
            "immediate": [],  # Can start now
            "next": [],       # After immediate
            "future": [],     # After dependencies
            "blocked": []     # Need resolution
        }
        
    def load_gaps(self) -> Dict:
        """Load gap analysis results"""
        try:
            with open('/tmp/reconciliation/gaps.json', 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            print("⚠️ Gap analysis not found. Run 00029-gap-analyzer.py first")
            return {}
    
    def estimate_effort(self, feature: str, story_count: int) -> Dict:
        """Estimate effort for implementing a feature"""
        # Base estimates per story (in hours)
        complexity_map = {
            "authentication": 2,     # Well-understood
            "teams": 3,              # Moderate complexity
            "profiles": 2.5,         # UI + backend
            "runtime_engine": 4,     # Complex state management
            "emcoin": 3.5           # Payment logic
        }
        
        base_hours = complexity_map.get(feature, 3) * story_count
        
        # Adjust for current state
        adjustments = {
            "not_started": 1.2,  # Extra setup time
            "partial": 0.8,      # Some work done
            "complete": 0.1      # Just verification
        }
        
        return {
            "hours": round(base_hours * adjustments.get("not_started", 1), 1),
            "days": round((base_hours * adjustments.get("not_started", 1)) / 8, 1),
            "sessions": round((base_hours * adjustments.get("not_started", 1)) / 5, 0)  # 5 hours per session
        }
    
    def identify_dependencies(self, feature: str) -> List[str]:
        """Identify dependencies for a feature"""
        dependency_map = {
            "teams": ["authentication"],
            "profiles": ["authentication"],
            "runtime_engine": ["authentication", "teams", "profiles"],
            "emcoin": ["authentication", "profiles"],
        }
        
        return dependency_map.get(feature, [])
    
    def check_dependencies_met(self, feature: str) -> bool:
        """Check if all dependencies are met for a feature"""
        deps = self.identify_dependencies(feature)
        if not deps:
            return True
        
        # Check if dependencies are complete or partial
        complete_features = [g["feature"] for g in self.gaps.get("gaps", {}).get("complete", [])]
        partial_features = [g["feature"] for g in self.gaps.get("gaps", {}).get("partial", [])]
        
        return all(dep in complete_features or dep in partial_features for dep in deps)
    
    def prioritize_actions(self):
        """Generate prioritized action plan"""
        
        # Process ready-to-build features
        for gap in self.gaps.get("gaps", {}).get("ready_to_build", []):
            effort = self.estimate_effort(gap["feature"], gap["story_count"])
            deps = self.identify_dependencies(gap["feature"])
            
            action = {
                "feature": gap["feature"],
                "priority": gap["priority"],
                "story_count": gap["story_count"],
                "effort": effort,
                "dependencies": deps,
                "rationale": self.get_rationale(gap["feature"]),
                "next_steps": self.get_next_steps(gap["feature"])
            }
            
            # Categorize by urgency
            if gap["priority"] == "P0" and not deps:
                self.action_plan["immediate"].append(action)
            elif gap["priority"] == "P0":
                self.action_plan["next"].append(action)
            else:
                self.action_plan["future"].append(action)
        
        # Process partial implementations
        for gap in self.gaps.get("gaps", {}).get("partial", []):
            effort = self.estimate_effort(gap["feature"], gap["story_count"])
            
            action = {
                "feature": gap["feature"],
                "priority": gap["priority"],
                "story_count": gap["story_count"],
                "effort": effort,
                "status": "partial",
                "rationale": f"Complete existing {gap['feature']} implementation",
                "next_steps": [f"Review existing {gap['feature']} code", 
                             "Identify missing components",
                             "Complete implementation"]
            }
            
            # Partial P0s are immediate priority
            if gap["priority"] == "P0":
                self.action_plan["immediate"].insert(0, action)  # Prepend
            else:
                self.action_plan["next"].append(action)
    
    def get_rationale(self, feature: str) -> str:
        """Get implementation rationale for a feature"""
        rationales = {
            "authentication": "Foundation for all user-specific features",
            "teams": "Core social structure for educational collaboration",
            "profiles": "Student identity building - key to engagement",
            "runtime_engine": "CRITICAL: Enables actual activity execution",
            "emcoin": "Virtual economy drives platform engagement"
        }
        
        return rationales.get(feature, f"Implement {feature} per requirements")
    
    def get_next_steps(self, feature: str) -> List[str]:
        """Get concrete next steps for a feature"""
        steps_map = {
            "authentication": [
                "Review Supabase auth setup",
                "Implement signup/login UI",
                "Create profile creation flow",
                "Add RLS policies"
            ],
            "teams": [
                "Create teams database schema",
                "Implement team creation API",
                "Build team management UI",
                "Add member invitation system"
            ],
            "profiles": [
                "Design profile schema",
                "Create profile dashboard UI",
                "Implement achievement tracking",
                "Add customization options"
            ],
            "runtime_engine": [
                "Analyze Canvas 001-5 requirements",
                "Design activity state machine",
                "Implement session management",
                "Create execution pipeline"
            ],
            "emcoin": [
                "Design transaction schema",
                "Implement wallet system",
                "Create payment processing",
                "Add transaction history"
            ]
        }
        
        return steps_map.get(feature, [f"Review requirements for {feature}",
                                       f"Design {feature} architecture",
                                       f"Implement {feature}",
                                       f"Test {feature}"])
    
    def generate_timeline(self) -> Dict:
        """Generate implementation timeline"""
        timeline = {
            "phase_a_prototype": {
                "duration": "5 sessions (25 hours)",
                "features": ["authentication", "teams", "profiles"],
                "outcome": "Working educational identity platform"
            },
            "phase_b_production": {
                "duration": "10 sessions (50 hours)",
                "features": ["runtime_engine", "emcoin", "full_integration"],
                "outcome": "Complete Cyworld of Education"
            }
        }
        
        return timeline
    
    def calculate_metrics(self) -> Dict:
        """Calculate action plan metrics"""
        total_immediate = len(self.action_plan["immediate"])
        total_next = len(self.action_plan["next"])
        total_future = len(self.action_plan["future"])
        total_blocked = len(self.action_plan["blocked"])
        
        # Calculate total effort
        total_hours = 0
        for category in ["immediate", "next", "future"]:
            for action in self.action_plan[category]:
                total_hours += action["effort"]["hours"]
        
        return {
            "actions_immediate": total_immediate,
            "actions_next": total_next,
            "actions_future": total_future,
            "actions_blocked": total_blocked,
            "total_effort_hours": round(total_hours, 1),
            "total_effort_days": round(total_hours / 8, 1),
            "total_sessions_needed": round(total_hours / 5, 0)
        }
    
    def generate_plan(self) -> Dict:
        """Generate complete action plan"""
        self.prioritize_actions()
        
        plan = {
            "timestamp": datetime.now().isoformat(),
            "action_plan": self.action_plan,
            "timeline": self.generate_timeline(),
            "metrics": self.calculate_metrics(),
            "critical_path": self.identify_critical_path(),
            "risk_factors": self.identify_risks()
        }
        
        return plan
    
    def identify_critical_path(self) -> List[str]:
        """Identify the critical path for implementation"""
        return [
            "1. Complete authentication (foundation)",
            "2. Implement teams (social structure)",
            "3. Build profiles (identity system)",
            "4. Develop runtime engine (activity execution)",
            "5. Add emCoin (economic layer)"
        ]
    
    def identify_risks(self) -> List[Dict]:
        """Identify implementation risks"""
        return [
            {
                "risk": "Runtime Engine complexity",
                "impact": "High",
                "mitigation": "Start with minimal viable engine, iterate"
            },
            {
                "risk": "Authentication incomplete",
                "impact": "High",
                "mitigation": "Prioritize auth completion before other features"
            },
            {
                "risk": "Scope creep in P1/P2 features",
                "impact": "Medium",
                "mitigation": "Strict P0-first implementation"
            }
        ]

def main():
    """Main execution"""
    print("=== Action Planning v1.0 ===")
    print("Generating implementation plan from gap analysis...\n")
    
    planner = ActionPlanner()
    
    if not planner.gaps:
        print("❌ Cannot proceed without gap analysis")
        print("   Run: ./scripts/00029-gap-analyzer.py")
        return
    
    plan = planner.generate_plan()
    
    # Save plan
    with open('/tmp/reconciliation/action-plan.json', 'w') as f:
        json.dump(plan, f, indent=2)
    
    # Display summary
    print(f"📋 Action Plan Generated:")
    print(f"   Immediate: {plan['metrics']['actions_immediate']} actions")
    print(f"   Next: {plan['metrics']['actions_next']} actions")
    print(f"   Future: {plan['metrics']['actions_future']} actions")
    
    print(f"\n⏱️ Effort Estimate:")
    print(f"   Total: {plan['metrics']['total_effort_hours']} hours")
    print(f"   Days: {plan['metrics']['total_effort_days']} days")
    print(f"   Sessions: {plan['metrics']['total_sessions_needed']} sessions")
    
    print(f"\n🎯 Critical Path:")
    for step in plan['critical_path']:
        print(f"   {step}")
    
    print(f"\n📅 Timeline:")
    for phase, details in plan['timeline'].items():
        print(f"   {phase}: {details['duration']}")
        print(f"      Features: {', '.join(details['features'])}")
    
    print(f"\n✅ Action plan saved to /tmp/reconciliation/action-plan.json")

if __name__ == "__main__":
    main()