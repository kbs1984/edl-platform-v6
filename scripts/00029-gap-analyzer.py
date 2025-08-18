#!/usr/bin/env python3
"""
Session 00029: Gap Analyzer for Truth Operating System
Compares Requirements Domain vs Reality Domain to find implementation gaps
"""

import json
import os
import sys
from typing import Dict, List, Any
from datetime import datetime

class GapAnalyzer:
    """Analyzes gaps between Requirements and Reality domains"""
    
    def __init__(self):
        self.requirements = self.load_requirements()
        self.reality = self.load_reality()
        self.gaps = {
            "not_started": [],
            "partial": [],
            "complete": [],
            "ready_to_build": [],
            "blocked": []
        }
        
    def load_requirements(self) -> Dict:
        """Load Requirements Domain state"""
        try:
            with open('/tmp/requirements/state.json', 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            print("⚠️ Requirements state not found. Run 00029-requirements-check.sh first")
            return {}
            
    def load_reality(self) -> Dict:
        """Load Reality Domain state from Session 28's output"""
        try:
            with open('/tmp/parsed-reality.json', 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            print("⚠️ Reality state not found. Run 00028-reality-check.sh first")
            return {}
    
    def analyze_authentication(self) -> str:
        """Check authentication implementation status"""
        # Check Supabase tables for auth
        if self.reality.get('supabase', {}).get('status') == 'connected':
            # Check for profiles table (indicates auth setup)
            tables = self.reality.get('supabase', {}).get('tables', [])
            if 'profiles' in tables:
                return "complete"
            elif tables:
                return "partial"
        return "not_started"
    
    def analyze_teams(self) -> str:
        """Check teams implementation status"""
        # Check for teams-related tables
        if self.reality.get('supabase', {}).get('status') == 'connected':
            tables = self.reality.get('supabase', {}).get('tables', [])
            team_tables = ['teams', 'team_members', 'team_join_requests']
            found = [t for t in team_tables if t in tables]
            
            if len(found) == len(team_tables):
                return "complete"
            elif found:
                return "partial"
        return "not_started"
    
    def analyze_profiles(self) -> str:
        """Check profiles implementation status"""
        # Check for profiles table and UI
        if self.reality.get('supabase', {}).get('status') == 'connected':
            tables = self.reality.get('supabase', {}).get('tables', [])
            if 'profiles' in tables:
                # Check for UI implementation
                if self.reality.get('filesystem', {}).get('ui_files'):
                    return "complete"
                return "partial"
        return "not_started"
    
    def analyze_runtime_engine(self) -> str:
        """Check runtime engine implementation status"""
        # Runtime engine is P0 but not yet implemented
        # This would check for Canvas 001-5 implementation
        return "not_started"
    
    def analyze_emcoin(self) -> str:
        """Check emCoin implementation status"""
        # Check for payment-related infrastructure
        return "not_started"
    
    def categorize_gaps(self):
        """Categorize all gaps by implementation status"""
        
        # Map features to analysis functions
        feature_checks = {
            "authentication": self.analyze_authentication(),
            "teams": self.analyze_teams(),
            "profiles": self.analyze_profiles(),
            "runtime_engine": self.analyze_runtime_engine(),
            "emcoin": self.analyze_emcoin()
        }
        
        # Get story counts from requirements
        p0_count = self.requirements.get('stories', {}).get('P0', 0)
        p1_count = self.requirements.get('stories', {}).get('P1', 0)
        p2_count = self.requirements.get('stories', {}).get('P2', 0)
        
        # Categorize P0 features (highest priority)
        p0_features = {
            "authentication": 15,  # Estimated stories
            "teams": 12,
            "profiles": 21,
            "runtime_engine": 50,
            "emcoin": 7
        }
        
        for feature, story_count in p0_features.items():
            status = feature_checks.get(feature, "not_started")
            gap_entry = {
                "feature": feature,
                "priority": "P0",
                "story_count": story_count,
                "status": status,
                "reality_state": self.get_reality_details(feature)
            }
            
            if status == "not_started":
                self.gaps["not_started"].append(gap_entry)
                if self.is_ready_to_build(feature):
                    self.gaps["ready_to_build"].append(gap_entry)
            elif status == "partial":
                self.gaps["partial"].append(gap_entry)
            elif status == "complete":
                self.gaps["complete"].append(gap_entry)
    
    def get_reality_details(self, feature: str) -> Dict:
        """Get detailed Reality state for a feature"""
        details = {
            "database_ready": 'supabase' in self.reality and self.reality['supabase'].get('tables', 0) >= 0,
            "filesystem_ready": self.reality.get('filesystem', {}).get('status') == 'connected',
            "github_ready": 'github' in self.reality and 'error' not in self.reality['github']
        }
        
        # Add feature-specific details
        if feature in ["authentication", "teams", "profiles"]:
            details["tables_exist"] = bool(self.reality.get('supabase', {}).get('tables'))
        
        return details
    
    def is_ready_to_build(self, feature: str) -> bool:
        """Determine if a feature is ready to build"""
        # Check if infrastructure is ready
        health = float(self.reality.get('integration', {}).get('health', '0').replace('%', '')) if self.reality.get('integration') else 0
        infra_ready = (
            health > 90 and
            'supabase' in self.reality
        )
        
        # Check dependencies
        dependencies = {
            "teams": ["authentication"],
            "profiles": ["authentication"],
            "runtime_engine": ["authentication", "teams"],
            "emcoin": ["authentication", "profiles"]
        }
        
        deps = dependencies.get(feature, [])
        deps_ready = all(
            self.gaps.get(dep, {}).get('status') in ['complete', 'partial']
            for dep in deps
        )
        
        return infra_ready and (not deps or deps_ready)
    
    def calculate_metrics(self) -> Dict:
        """Calculate gap analysis metrics"""
        total_features = len(self.gaps["not_started"]) + len(self.gaps["partial"]) + len(self.gaps["complete"])
        
        metrics = {
            "total_features": total_features,
            "complete": len(self.gaps["complete"]),
            "partial": len(self.gaps["partial"]),
            "not_started": len(self.gaps["not_started"]),
            "ready_to_build": len(self.gaps["ready_to_build"]),
            "blocked": len(self.gaps["blocked"]),
            "completion_percentage": 0
        }
        
        if total_features > 0:
            complete_weight = metrics["complete"] * 1.0
            partial_weight = metrics["partial"] * 0.5
            metrics["completion_percentage"] = round(
                ((complete_weight + partial_weight) / total_features) * 100, 1
            )
        
        return metrics
    
    def generate_report(self) -> Dict:
        """Generate comprehensive gap analysis report"""
        self.categorize_gaps()
        metrics = self.calculate_metrics()
        
        report = {
            "timestamp": datetime.now().isoformat(),
            "domain_analysis": {
                "requirements": {
                    "completeness": self.requirements.get('completeness', 0),
                    "story_count": self.requirements.get('stories', {}).get('total', 0)
                },
                "reality": {
                    "health": float(self.reality.get('integration', {}).get('health', '0').replace('%', '')) if self.reality.get('integration') else 0,
                    "agents_operational": self.reality.get('healthy_agents', '0')
                }
            },
            "gaps": self.gaps,
            "metrics": metrics,
            "recommendations": self.generate_recommendations()
        }
        
        return report
    
    def generate_recommendations(self) -> List[str]:
        """Generate actionable recommendations"""
        recommendations = []
        
        # Priority 1: Complete partial implementations
        if self.gaps["partial"]:
            recommendations.append(f"Complete {len(self.gaps['partial'])} partial implementations first")
        
        # Priority 2: Start ready-to-build features
        if self.gaps["ready_to_build"]:
            recommendations.append(f"Start {len(self.gaps['ready_to_build'])} features that are ready to build")
        
        # Priority 3: Unblock blocked features
        if self.gaps["blocked"]:
            recommendations.append(f"Resolve blockers for {len(self.gaps['blocked'])} features")
        
        # Add specific recommendations
        if "runtime_engine" in [g["feature"] for g in self.gaps["not_started"]]:
            recommendations.append("CRITICAL: Runtime Engine (50 stories) is P0 but not started")
        
        if "authentication" in [g["feature"] for g in self.gaps["partial"]]:
            recommendations.append("Complete authentication before starting dependent features")
        
        return recommendations

def main():
    """Main execution"""
    print("=== Gap Analysis v1.0 ===")
    print("Analyzing gaps between Requirements and Reality...\n")
    
    analyzer = GapAnalyzer()
    
    if not analyzer.requirements or not analyzer.reality:
        print("❌ Cannot proceed without both domain states")
        print("   Run: ./scripts/00029-requirements-check.sh")
        print("   Run: ./scripts/00028-reality-check.sh")
        sys.exit(1)
    
    report = analyzer.generate_report()
    
    # Save report
    os.makedirs('/tmp/reconciliation', exist_ok=True)
    with open('/tmp/reconciliation/gaps.json', 'w') as f:
        json.dump(report, f, indent=2)
    
    # Display summary
    print(f"📊 Domain Health:")
    print(f"   Requirements: {report['domain_analysis']['requirements']['completeness']}% complete")
    print(f"   Reality: {report['domain_analysis']['reality']['health']}% healthy")
    
    print(f"\n🔍 Gap Analysis:")
    print(f"   Complete: {report['metrics']['complete']} features")
    print(f"   Partial: {report['metrics']['partial']} features")
    print(f"   Not Started: {report['metrics']['not_started']} features")
    print(f"   Ready to Build: {report['metrics']['ready_to_build']} features")
    
    print(f"\n📈 Overall Completion: {report['metrics']['completion_percentage']}%")
    
    print(f"\n💡 Recommendations:")
    for i, rec in enumerate(report['recommendations'], 1):
        print(f"   {i}. {rec}")
    
    print(f"\n✅ Gap analysis saved to /tmp/reconciliation/gaps.json")

if __name__ == "__main__":
    main()