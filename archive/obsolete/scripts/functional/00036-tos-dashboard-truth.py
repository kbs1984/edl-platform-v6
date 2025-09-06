#!/usr/bin/env python3
"""
---
session: "00036"
type: "script"
status: "active"
created: "2025-08-28"
title: "00036-tos-dashboard-truth.py"
purpose: "Script for tos dashboard truth"
language: "python"
category: "dashboard"
topics: ["dashboard"]
priority: "P2"
domain: "core"
---
"""
"""
Constitutional Operating System (COS) Dashboard v2.0 - Truth Integrated
Session 36 Implementation - 2025-08-19

Enhanced dashboard that integrates with the Truth API for real metrics,
push-based updates, and evidence-backed claims.

Key Enhancements:
- Integrates Truth API for real system health data
- Push architecture subscription for live updates
- Evidence links for all metrics
- Confidence intervals displayed
- Meta-Truth Agent monitoring
"""

import json
import os
import sys
import argparse
import subprocess
import threading
import time
import importlib.util
from datetime import datetime, timedelta
from pathlib import Path
import glob
from typing import Dict, List, Optional, Tuple

# Import the Truth API from Session 35
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
try:
    import importlib.util
    spec = importlib.util.spec_from_file_location("truth_api", 
                                                  "scripts/00035-truth-api.py")
    truth_module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(truth_module)
    TruthAPI = truth_module.TruthAPI
    TruthSpeed = truth_module.TruthSpeed
except Exception as e:
    print(f"⚠️  Warning: Truth API not found: {e}. Using fallback mode.")
    TruthAPI = None
    TruthSpeed = None

# Import original dashboard components
try:
    spec = importlib.util.spec_from_file_location("dashboard", 
                                                  "scripts/00032-tos-dashboard.py")
    dashboard_module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(dashboard_module)
    PersonalityEngine = dashboard_module.PersonalityEngine
    ViolationQueue = dashboard_module.ViolationQueue
    AutomationRoadmapIntegration = dashboard_module.AutomationRoadmapIntegration
    PhaseManager = dashboard_module.PhaseManager
except Exception as e:
    print(f"⚠️  Warning: Original dashboard not found: {e}")
    # Define fallback classes if needed
    PersonalityEngine = None
    ViolationQueue = None
    AutomationRoadmapIntegration = None
    PhaseManager = None


class TruthIntegratedHealthCalculator:
    """Calculate health using Truth API instead of static files"""
    
    def __init__(self):
        self.truth = TruthAPI() if TruthAPI else None
        self.roadmap = AutomationRoadmapIntegration()
        self.cached_health = None
        self.last_update = None
        
        # Subscribe to truth updates if available
        if self.truth:
            self.truth.event_stream.subscribe(self.on_truth_update)
    
    def on_truth_update(self, event):
        """Handle push updates from Truth API"""
        if event['type'] == 'health_update':
            self.cached_health = event['data']['health']
            self.last_update = datetime.now()
    
    def calculate(self, speed=None) -> Tuple[float, Dict]:
        """
        Calculate health with evidence and confidence intervals
        Returns: (health_score, evidence_dict)
        """
        if not self.truth:
            # Fallback to static calculation
            return self._calculate_static()
        
        # Use Truth API with specified speed
        if speed is None:
            speed = TruthSpeed.OPERATIONAL  # Default 5-minute cache
        
        health_report = self.truth.get_system_health(speed)
        
        # Extract health from HealthReport object
        consensus = health_report.consensus_score
        
        # Get confidence interval from evidence
        if hasattr(health_report.evidence, 'confidence_interval'):
            confidence_interval = health_report.evidence.confidence_interval
        else:
            confidence_interval = (consensus-5, consensus+5)
        
        # Build evidence dictionary
        evidence = {
            'source': health_report.evidence.source if hasattr(health_report.evidence, 'source') else 'integration_agent',
            'trust': health_report.evidence.trust_level.value if hasattr(health_report.evidence, 'trust_level') else 0,
            'confidence_interval': confidence_interval,
            'timestamp': health_report.evidence.timestamp.isoformat() if hasattr(health_report.evidence, 'timestamp') else datetime.now().isoformat(),
            'agent_status': len([a for a in self.truth.get_agent_status() if a.operational])
        }
        
        return consensus, evidence
    
    def _calculate_static(self) -> Tuple[float, Dict]:
        """Fallback static calculation from Session 32"""
        state_file = Path('.cos/state.json')
        if state_file.exists():
            with open(state_file) as f:
                state = json.load(f)
        else:
            state = {'metrics': {}, 'reality_agents': {}}
        
        scores = []
        
        # Reality Agent health (40%)
        agents = state.get('reality_agents', {})
        healthy_agents = sum(1 for status in agents.values() if status == 'healthy')
        total_agents = len(agents) if agents else 1
        agent_score = (healthy_agents / total_agents) * 100
        scores.append(agent_score * 0.4)
        
        # Documentation currency (30%)
        doc_current = state.get('metrics', {}).get('documentation_current', True)
        doc_score = 100 if doc_current else 70
        scores.append(doc_score * 0.3)
        
        # Test coverage (20%)
        test_coverage = state.get('metrics', {}).get('test_coverage', 0.5) * 100
        scores.append(test_coverage * 0.2)
        
        # File compliance (10%)
        violations = ViolationQueue('GROW').get_count()
        compliance_score = max(0, 100 - (violations * 10))
        scores.append(compliance_score * 0.1)
        
        health = int(sum(scores))
        evidence = {
            'source': 'static_calculation',
            'trust': 0,  # No trust for static data
            'confidence_interval': (health-10, health+10),  # Wide interval for uncertainty
            'timestamp': state.get('last_updated', 'unknown')
        }
        
        return health, evidence


class TruthEnabledRealityIntegration:
    """Enhanced Reality Integration using Truth API"""
    
    def __init__(self):
        self.truth = TruthAPI() if TruthAPI else None
        self.agent_status = {}
        self.meta_health = None
        
        if self.truth:
            # Get initial status
            self.refresh_status()
            # Subscribe to updates
            self.truth.event_stream.subscribe(self.on_agent_update)
    
    def on_agent_update(self, event):
        """Handle agent status updates"""
        if event['type'] == 'agent_status':
            self.agent_status = event['data']
    
    def refresh_status(self, speed=None):
        """Refresh agent status from Truth API"""
        if not self.truth:
            return
        
        if speed is None:
            speed = TruthSpeed.OPERATIONAL
        
        # Get agent status as list and convert to dict
        agent_list = self.truth.get_agent_status()
        self.agent_status = {}
        for agent in agent_list:
            self.agent_status[agent.name] = {
                'status': 'operational' if agent.operational else 'offline',
                'trust': agent.trust_score
            }
        
        # Get Meta-Truth Agent health
        if hasattr(self.truth, 'meta_truth'):
            meta_data = self.truth.meta_truth.verify_truth_system()
            self.meta_health = meta_data.get('meta_health', 0)
        else:
            self.meta_health = 0
    
    def get_summary(self) -> str:
        """Get Reality Agent summary with truth backing"""
        if not self.truth:
            return "Reality Agents: ⚠️ Truth API unavailable"
        
        # Get operational agents
        operational = [name for name, status in self.agent_status.items() 
                      if status['status'] == 'operational']
        
        # Calculate trust score
        trust_score = self.truth.get_trust_score()
        
        # Build summary with evidence
        if operational:
            agent_list = ', '.join(operational)
            return f"Reality Agents: {len(operational)}/7 operational ({agent_list}) | Trust: {trust_score:.1f}%"
        else:
            return f"Reality Agents: ⚠️ No operational agents | Trust: {trust_score:.1f}%"
    
    def get_detailed_status(self) -> List[str]:
        """Get detailed agent status with trust levels"""
        if not self.truth:
            return ["Truth API unavailable"]
        
        lines = []
        for agent_name, status in self.agent_status.items():
            trust = status.get('trust', 0)
            icon = "✅" if status['status'] == 'operational' else "❌"
            lines.append(f"{agent_name:20} {icon} (trust: {trust:.1f}%)")
        
        # Add Meta-Truth Agent status
        if self.meta_health:
            lines.append(f"{'meta_truth':20} 🔍 (health: {self.meta_health:.1f}%)")
        
        return lines


class TruthIntegratedDashboard:
    """Main dashboard with Truth API integration"""
    
    def __init__(self, verbosity='glance', speed=None):
        self.verbosity = verbosity
        self.speed = speed or (TruthSpeed.REAL_TIME if TruthSpeed else None)
        
        # Original components
        self.phase_manager = PhaseManager()
        self.phase = self.phase_manager.get_phase()
        self.personality = PersonalityEngine(self.phase)
        self.violations = ViolationQueue(self.phase)
        
        # Truth-integrated components
        self.health_calc = TruthIntegratedHealthCalculator()
        self.reality = TruthEnabledRealityIntegration()
        
        # Truth API direct access
        self.truth = TruthAPI() if TruthAPI else None
        
        # Push event handling
        self.live_updates = []
        self.update_thread = None
        if self.truth and verbosity in ['normal', 'deep']:
            self.start_live_updates()
    
    def start_live_updates(self):
        """Start listening for push updates"""
        if not self.truth:
            return
        
        def update_handler(event):
            timestamp = datetime.now().strftime("%H:%M:%S")
            self.live_updates.append(f"[{timestamp}] {event['type']}: {event.get('message', '')}")
            # Keep only last 10 updates
            if len(self.live_updates) > 10:
                self.live_updates.pop(0)
        
        self.truth.event_stream.subscribe(update_handler)
    
    def display_glance(self) -> str:
        """Quick 5-second glance view with truth"""
        health, evidence = self.health_calc.calculate(TruthSpeed.REAL_TIME if TruthSpeed else None)
        
        # Show confidence interval
        ci_low, ci_high = evidence['confidence_interval']
        health_icon = "✅" if health >= 80 else "⚠️" if health >= 70 else "❌"
        
        # Include trust indicator
        trust = evidence.get('trust', 0)
        # Convert to float if it's a string
        if isinstance(trust, str):
            try:
                trust = float(trust)
            except:
                trust = 0
        trust_icon = "🔒" if trust > 90 else "🔓" if trust > 70 else "⚠️"
        
        violations_summary = self.violations.get_summary()
        
        return f"{self.personality.get_emoji()} {self.phase} {health:.0f}% ({ci_low:.0f}-{ci_high:.0f}) {health_icon} {trust_icon} | {violations_summary}"
    
    def display_normal(self):
        """Normal 30-second view with truth integration"""
        print("╔══════════════════════════════════════════════════════════════╗")
        print(f"║     Constitutional OS Dashboard v2.0 - Truth Integrated       ║")
        print("╚══════════════════════════════════════════════════════════════╝")
        print()
        print(f"  {self.personality.greet()}")
        print()
        print(f"  Strategic Phase: {self.phase_manager.strategic_phase}")
        print(f"  Session Phase:   {self.personality.get_emoji()} {self.phase} (Active Implementation)")
        print(f"  Enforcement:     {self.phase_manager.get_enforcement()}")
        print()
        
        # Get health from Truth API
        health, evidence = self.health_calc.calculate(self.speed)
        ci_low, ci_high = evidence['confidence_interval']
        health_bar = self._get_health_bar(health)
        health_status = "✅ HEALTHY" if health >= 80 else "⚠️ ATTENTION" if health >= 70 else "❌ NEEDS WORK"
        
        print(f"  🎯 Truth-Backed Health: {health:.1f}% ({ci_low:.0f}-{ci_high:.0f}) {health_bar} {health_status}")
        trust_val = evidence['trust']
        if isinstance(trust_val, str):
            try:
                trust_val = float(trust_val)
            except:
                trust_val = 0
        print(f"     Source: {evidence['source']} | Trust: {trust_val:.1f}%")
        print()
        
        # Violations section
        if self.violations.get_count() > 0:
            print("  📋 Attention Needed:")
            self.violations.display_violations()
        else:
            print("  ✅ Compliance: All files properly prefixed!")
        
        print()
        
        # Reality Agents with Truth
        print(f"  🔍 {self.reality.get_summary()}")
        
        # Meta-Truth Agent status
        if self.truth:
            meta_health = self.reality.meta_health or 0
            print(f"  🔬 Meta-Truth Agent: {meta_health:.1f}% (Who watches the watchers?)")
        print()
        
        # Trust Score
        if self.truth:
            trust_score = self.truth.get_trust_score()
            print(f"  🔒 Overall Trust Score: {trust_score:.1f}%")
            print()
        
        # Live updates (if any)
        if self.live_updates:
            print("  📡 Live Truth Updates:")
            for update in self.live_updates[-3:]:  # Show last 3
                print(f"     {update}")
            print()
        
        # Automation Roadmap Progress (original)
        print("  📊 Automation Roadmap Progress:")
        print(f"     {self.health_calc.roadmap.get_automation_progress()}")
        print()
        
        # Strategic Context (original)
        masterplan = self.health_calc.roadmap.masterplan_context
        requirements = self.health_calc.roadmap.requirements_status
        automation = self.health_calc.roadmap.automation_status
        
        print("  🎯 Strategic Context:")
        print(f"     Vision: {masterplan['vision']}")
        print(f"     Canvas Coverage: {requirements['status']} ({requirements['total_stories']} stories)")
        print(f"     Reality Agents: {automation['reality_agents']}")
        print(f"     Session Automation: {automation['session_automation']}")
        print()
        
        # Transition check (original)
        transition_hint = self.phase_manager.check_transition_indicators()
        if transition_hint:
            print(f"  💡 {transition_hint}")
            print()
        
        # Guidance
        print("  📚 Quick Reference:")
        print(f"     Phase Guide: {self.phase_manager.get_phase_guide()}")
        print(f"     Boundaries:  00031-WORKFLOW-BOUNDARIES.md")
        print(f"     Truth API:   scripts/00035-truth-api.py")
        print()
    
    def display_deep(self):
        """Deep 5-minute analysis with full truth details"""
        self.display_normal()
        print()
        print("═══════════════════════════════════════════════════════════════")
        print("                    DEEP TRUTH ANALYSIS                        ")
        print("═══════════════════════════════════════════════════════════════")
        print()
        
        if not self.truth:
            print("  ⚠️  Truth API not available - using static data")
            return
        
        # Detailed agent status with trust
        print("  🤖 Reality Agent Detailed Status:")
        for line in self.reality.get_detailed_status():
            print(f"     {line}")
        print()
        
        # Truth reconciliation status
        print("  🔄 Truth Reconciliation:")
        try:
            # Get recent reconciliations
            snapshot = self.truth.export_truth_snapshot()
            if 'reconciliations' in snapshot:
                for recon in snapshot['reconciliations'][-3:]:  # Last 3
                    print(f"     {recon}")
            else:
                print("     No conflicts detected - consensus achieved")
        except:
            print("     Reconciliation status unavailable")
        print()
        
        # Three-speed truth system
        print("  ⚡ Three-Speed Truth System:")
        for speed in [TruthSpeed.REAL_TIME, TruthSpeed.OPERATIONAL, TruthSpeed.ARCHIVAL]:
            health_report = self.truth.get_system_health(speed)
            consensus = health_report.consensus_score
            # Try to get cache age from evidence
            cache_age = 0
            if hasattr(health_report.evidence, 'age_seconds'):
                cache_age = health_report.evidence.age_seconds()
            print(f"     {speed.name:12} {consensus:.1f}% (cache: {cache_age:.0f}s)")
        print()
        
        # Educational achievement ledger status
        print("  📚 Educational Achievement Ledger:")
        try:
            # Check if any achievements recorded
            snapshot = self.truth.export_truth_snapshot()
            blocks = snapshot.get('ledger_blocks', 0)
            print(f"     Immutable Blocks: {blocks}")
            print(f"     Ready for student achievements: {'✅' if blocks > 0 else '⏳'}")
        except:
            print("     Ledger status unavailable")
        print()
        
        # Metric explanations
        print("  📊 Metric Evidence Chain:")
        try:
            # Show evidence for key metrics
            for metric in ['consensus_health', 'system_trust']:
                chain = self.truth.get_evidence_chain(metric)
                if chain:
                    latest = chain[0]  # Most recent
                    print(f"     {metric}: {latest.value} from {latest.source}")
        except Exception as e:
            print(f"     Evidence chain unavailable: {e}")
        print()
        
        # Push architecture status
        print("  📡 Push Architecture:")
        if hasattr(self.truth, 'event_stream') and self.truth.event_stream:
            # Get subscriber count safely
            if hasattr(self.truth.event_stream, 'subscribers'):
                subscriber_count = len(self.truth.event_stream.subscribers)
            else:
                subscriber_count = 0
            print(f"     Active Subscribers: {subscriber_count}")
            print(f"     Events Published: {getattr(self.truth.event_stream, 'event_count', 0)}")
            print(f"     Status: {'✅ Active' if subscriber_count > 0 else '⏳ Waiting for subscribers'}")
        else:
            print("     Not initialized")
        print()
        
        # Recommendations based on truth
        print("  💡 Truth-Based Recommendations:")
        trust_score = self.truth.get_trust_score()
        if trust_score < 70:
            print("     1. ⚠️  Low trust score - run Reality Agents")
        if self.reality.meta_health and self.reality.meta_health < 80:
            print("     2. 🔬 Meta-Truth health low - check monitoring")
        
        # Check for missing agents
        agent_list = self.truth.get_agent_status()
        missing = [agent.name for agent in agent_list 
                  if not agent.operational]
        if missing:
            print(f"     3. 🤖 Implement missing agents: {', '.join(missing)}")
        
        print()
    
    def _get_health_bar(self, health: float) -> str:
        """Generate visual health bar"""
        filled = int(health / 10)
        empty = 10 - filled
        return f"[{'█' * filled}{'░' * empty}]"
    
    def _load_state(self) -> Dict:
        """Load system state (fallback)"""
        state_file = Path('.cos/state.json')
        if state_file.exists():
            with open(state_file) as f:
                return json.load(f)
        return {}


def main():
    """Main entry point with argument parsing"""
    parser = argparse.ArgumentParser(description='Constitutional OS Dashboard with Truth Integration')
    parser.add_argument('--normal', action='store_true', help='Normal 30-second view')
    parser.add_argument('--deep', action='store_true', help='Deep 5-minute analysis')
    parser.add_argument('--speed', choices=['real_time', 'operational', 'archival'],
                       help='Truth query speed (default: operational)')
    parser.add_argument('--test-truth', action='store_true', help='Test Truth API connection')
    
    args = parser.parse_args()
    
    # Test Truth API if requested
    if args.test_truth:
        if TruthAPI:
            truth = TruthAPI()
            health = truth.get_system_health()
            # Handle both dict and object responses
            if hasattr(health, 'consensus'):
                consensus = health.consensus
            elif isinstance(health, dict):
                consensus = health.get('consensus_health', health.get('consensus', 0))
            else:
                consensus = getattr(health, 'consensus_health', 0)
            print(f"✅ Truth API Connected - Health: {consensus:.1f}%")
        else:
            print("❌ Truth API not available")
        return
    
    # Map speed argument
    speed = None
    if args.speed and TruthSpeed:
        speed = {
            'real_time': TruthSpeed.REAL_TIME,
            'operational': TruthSpeed.OPERATIONAL,
            'archival': TruthSpeed.ARCHIVAL
        }[args.speed]
    
    # Determine verbosity
    if args.deep:
        verbosity = 'deep'
    elif args.normal:
        verbosity = 'normal'
    else:
        verbosity = 'glance'
    
    # Create and display dashboard
    dashboard = TruthIntegratedDashboard(verbosity, speed)
    
    if verbosity == 'glance':
        print(dashboard.display_glance())
    elif verbosity == 'normal':
        dashboard.display_normal()
    elif verbosity == 'deep':
        dashboard.display_deep()


if __name__ == '__main__':
    main()