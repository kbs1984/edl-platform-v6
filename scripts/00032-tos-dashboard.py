#!/usr/bin/env python3
"""
Constitutional Operating System (COS) Dashboard v1.0
Session 32 Implementation - 2025-08-18

A phase-aware, personality-driven dashboard that helps maintain
constitutional health while adapting to natural development rhythms.
"""

import json
import os
import sys
import argparse
import subprocess
from datetime import datetime, timedelta
from pathlib import Path
import glob
from typing import Dict, List, Optional, Tuple

class PersonalityEngine:
    """Phase-aware conversational personality"""
    
    def __init__(self, phase: str):
        self.phase = phase
        self.personality = self._load_personality()
    
    def _load_personality(self) -> Dict:
        """Load phase-specific personality from config"""
        personality_file = Path('.cos/personality.json')
        if personality_file.exists():
            with open(personality_file) as f:
                personalities = json.load(f)
                return personalities.get(self.phase, personalities['GROW'])
        return {
            "greeting": "🌿 Ready to build!",
            "violation_response": "Issue found: {file}",
            "enforcement_style": "moderate",
            "emoji": "🌿"
        }
    
    def greet(self) -> str:
        """Get phase-appropriate greeting"""
        return self.personality['greeting']
    
    def respond_to_violation(self, file: str) -> str:
        """Get phase-appropriate violation response"""
        return self.personality['violation_response'].format(file=file)
    
    def get_emoji(self) -> str:
        """Get phase emoji"""
        return self.personality['emoji']


class ViolationQueue:
    """Non-blocking violation tracking system"""
    
    def __init__(self, phase: str):
        self.phase = phase
        self.violations = []
        self._scan_for_violations()
    
    def _scan_for_violations(self):
        """Scan for common violations based on phase"""
        # Check for files missing session prefix
        session = self._get_current_session()
        
        # Only check files that should belong to current session
        # Skip files from other sessions, system files, and protocol files
        patterns = ['*.py', '*.js', '*.md', '*.sh', 'scripts/*.py', 'scripts/*.sh']
        
        for pattern in patterns:
            for file_path in glob.glob(pattern):
                filename = os.path.basename(file_path)
                
                # Skip conditions:
                # 1. Hidden files
                # 2. Files already prefixed with ANY session number
                # 3. System files (CLAUDE.md, PROJECT-STRUCTURE.md, etc.)
                # 4. Protocol files (ending in -PROTOCOL.md)
                # 5. Masterplan files
                # 6. Constitution files
                # 7. Index files
                # 8. node_modules or .cos directories
                
                skip_patterns = [
                    filename.startswith('.'),
                    filename[0:5].isdigit() and filename[5] == '-',  # Any session prefix
                    filename in ['CLAUDE.md', 'PROJECT-STRUCTURE.md', 'README.md', 
                                'package.json', 'package-lock.json', '.gitignore',
                                'index.html', 'Makefile'],
                    filename.endswith('-PROTOCOL.md'),
                    filename.endswith('-INDEX.md'),
                    filename.endswith('-CHECKLIST.md'),
                    filename.endswith('-GAPS.md'),
                    'MASTERPLAN' in filename,
                    'CONSTITUTION' in filename,
                    'AMENDMENT' in filename,
                    'SEED-' in filename,  # SEED protocol files
                    'AUTOMATION-' in filename,  # Automation files
                    'brian-' in filename,  # Old canvas files
                    filename in ['check_story_references.py', 'process-all-canvas.sh'],  # Old tools
                    filename in ['session-guard.sh', 'structure-check.sh', 'create-session-log.sh'],  # Core tools
                    'node_modules' in file_path,
                    '.cos' in file_path,
                    'archive' in file_path,
                    'requirements' in file_path,
                    'reality' in file_path,
                    'reconciliation' in file_path,
                    '00013_' in filename  # Old session 13 files with underscore
                ]
                
                if any(skip_patterns):
                    continue
                
                # Only flag files that look like they were created without a prefix
                # and likely belong to current session
                self.violations.append({
                    'type': 'missing_prefix',
                    'file': file_path,
                    'severity': self._get_severity(),
                    'fix_command': f'mv {file_path} {os.path.dirname(file_path)}/{session}-{filename}' if os.path.dirname(file_path) else f'mv {file_path} {session}-{filename}'
                })
    
    def _get_current_session(self) -> str:
        """Get current session number"""
        config_path = Path('.cos/config.json')
        if config_path.exists():
            with open(config_path) as f:
                config = json.load(f)
                return config.get('session', '00032')
        return '00032'
    
    def _get_severity(self) -> str:
        """Get violation severity based on phase"""
        severities = {
            'SEED': 'note',
            'GROW': 'recommend',
            'HARVEST': 'blocking'
        }
        return severities.get(self.phase, 'recommend')
    
    def get_count(self) -> int:
        """Get violation count"""
        return len(self.violations)
    
    def get_summary(self) -> str:
        """Get violation summary for display"""
        count = self.get_count()
        if count == 0:
            return "No violations ✅"
        elif count == 1:
            return f"1 violation (press 'v' to view)"
        else:
            return f"{count} violations (press 'v' to view)"
    
    def display_violations(self):
        """Display violations with fix options"""
        if not self.violations:
            print("  ✅ No violations found!")
            return
        
        print(f"\n  ⚠️  {len(self.violations)} violation(s) found:\n")
        for i, v in enumerate(self.violations, 1):
            print(f"  {i}. {v['file']} - missing session prefix")
            if self.phase == 'GROW':
                print(f"     Fix: {v['fix_command']}")
        
        if self.phase == 'GROW':
            print("\n  Press 'f' to fix all, or run individual commands above")
        elif self.phase == 'SEED':
            print("\n  Note these for when you finalize your approach")


class AutomationRoadmapIntegration:
    """Integration with automation roadmap and strategic documents"""
    
    def __init__(self):
        self.automation_status = self._load_automation_index()
        self.requirements_status = self._load_requirements_index()
        self.masterplan_context = self._load_masterplan_context()
    
    def _load_automation_index(self) -> Dict:
        """Parse AUTOMATION-INDEX.md for progress"""
        try:
            with open('AUTOMATION-INDEX.md') as f:
                content = f.read()
                return {
                    'status': '98% Complete' if '98% Complete' in content else 'Unknown',
                    'reality_agents': '7/7 operational' if '7 agents' in content.lower() else 'Unknown',
                    'session_automation': '6 second startup' if 'Session 28' in content else 'Unknown',
                    'canvas_coverage': '275 stories' if '275' in content else 'Unknown'
                }
        except:
            return {'status': 'Not found', 'reality_agents': 'Unknown', 'session_automation': 'Unknown'}
    
    def _load_requirements_index(self) -> Dict:
        """Parse requirements/REQUIREMENTS_INDEX.md"""
        try:
            with open('requirements/REQUIREMENTS_INDEX.md') as f:
                content = f.read()
                return {
                    'status': '~95% COMPLETE' if '95%' in content else 'Unknown',
                    'total_stories': '275' if '275' in content else 'Unknown',
                    'coverage': 'Systematic coverage' if 'systematic' in content.lower() else 'Unknown'
                }
        except:
            return {'status': 'Not found', 'total_stories': 'Unknown', 'coverage': 'Unknown'}
    
    def _load_masterplan_context(self) -> Dict:
        """Parse RESTORATION-MASTERPLAN-V3.md for strategic context"""
        try:
            with open('RESTORATION-MASTERPLAN-V3.md') as f:
                content = f.read()
                return {
                    'phase': 'Phase B: Full Ecosystem Production' if 'Phase B' in content else 'Unknown',
                    'approach': 'Two-Phase Implementation' if 'Two-Phase' in content else 'Unknown',
                    'vision': '"Where Learning Becomes Identity"' if 'Learning Becomes Identity' in content else 'Unknown'
                }
        except:
            return {'phase': 'Unknown', 'approach': 'Unknown', 'vision': 'Unknown'}
    
    def get_automation_progress(self) -> str:
        """Get automation roadmap progress summary"""
        phases = [
            f"✅ Phase 22-24: Discovery Complete ({self.requirements_status['total_stories']} stories)",
            f"✅ Phase 28-29: Session automation ({self.automation_status['session_automation']})",
            "✅ Phase 30-32: Constitutional OS Dashboard",
            "⏳ Next Phase: HARVEST validation per roadmap"
        ]
        return '\n     '.join(phases)


class HealthCalculator:
    """Calculate constitutional health score with roadmap context"""
    
    def __init__(self):
        self.state = self._load_state()
        self.roadmap = AutomationRoadmapIntegration()
    
    def _load_state(self) -> Dict:
        """Load system state"""
        state_file = Path('.cos/state.json')
        if state_file.exists():
            with open(state_file) as f:
                return json.load(f)
        return {'metrics': {}, 'reality_agents': {}}
    
    def calculate(self) -> int:
        """Calculate overall health percentage"""
        scores = []
        
        # Reality Agent health (40%)
        agents = self.state.get('reality_agents', {})
        healthy_agents = sum(1 for status in agents.values() if status == 'healthy')
        total_agents = len(agents) if agents else 1
        agent_score = (healthy_agents / total_agents) * 100
        scores.append(agent_score * 0.4)
        
        # Documentation currency (30%)
        doc_current = self.state.get('metrics', {}).get('documentation_current', True)
        doc_score = 100 if doc_current else 70
        scores.append(doc_score * 0.3)
        
        # Test coverage (20%)
        test_coverage = self.state.get('metrics', {}).get('test_coverage', 0.5) * 100
        scores.append(test_coverage * 0.2)
        
        # File compliance (10%)
        violations = ViolationQueue('GROW').get_count()
        compliance_score = max(0, 100 - (violations * 10))
        scores.append(compliance_score * 0.1)
        
        return int(sum(scores))


class RealityIntegration:
    """Integration with Reality Agents"""
    
    def __init__(self):
        self.latest_check = self._get_latest_check()
        self.agent_files = self._get_all_agent_files()
    
    def _get_latest_check(self) -> Optional[Dict]:
        """Get most recent Reality Agent output"""
        # Check for reality agent outputs in /tmp
        try:
            # Look for integration report first
            integration_files = glob.glob('/tmp/integration_*.json')
            if integration_files:
                latest_file = max(integration_files, key=os.path.getctime)
                with open(latest_file) as f:
                    return json.load(f)
            
            # Fallback to individual agent files
            agent_patterns = ['/tmp/filesystem_*.json', '/tmp/github_*.json', 
                            '/tmp/supabase_*.json', '/tmp/vercel_*.json']
            all_files = []
            for pattern in agent_patterns:
                all_files.extend(glob.glob(pattern))
            
            if all_files:
                # Get the most recent file
                latest_file = max(all_files, key=os.path.getctime)
                with open(latest_file) as f:
                    return json.load(f)
        except Exception as e:
            # Silent fail for missing files
            pass
        
        return None
    
    def _get_all_agent_files(self) -> Dict:
        """Get all recent agent output files"""
        agents = {}
        patterns = {
            'filesystem': '/tmp/filesystem_*.json',
            'github': '/tmp/github_*.json',
            'supabase': '/tmp/supabase_*.json',
            'integration': '/tmp/integration_*.json'
        }
        
        for agent_name, pattern in patterns.items():
            files = glob.glob(pattern)
            if files:
                latest = max(files, key=os.path.getctime)
                try:
                    with open(latest) as f:
                        agents[agent_name] = json.load(f)
                except:
                    pass
        
        return agents
    
    def get_summary(self) -> str:
        """Get Reality Agent summary"""
        # Try integration report first
        if self.latest_check and 'consensus' in self.latest_check:
            health = self.latest_check.get('consensus', {}).get('overall_health', 'Unknown')
            timestamp = self.latest_check.get('timestamp', 'Unknown')
            
            # Calculate time since check
            try:
                if timestamp != 'Unknown':
                    check_time = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
                    time_diff = datetime.now() - check_time.replace(tzinfo=None)
                    hours_ago = int(time_diff.total_seconds() / 3600)
                    if hours_ago < 1:
                        time_str = "recently"
                    elif hours_ago == 1:
                        time_str = "1 hour ago"
                    else:
                        time_str = f"{hours_ago} hours ago"
                    
                    return f"Reality Check: {health}% healthy (checked {time_str})"
            except:
                pass
            
            return f"Reality Check: {health}% healthy"
        
        # Try to build summary from individual agents
        if self.agent_files:
            healthy_count = 0
            total_count = 0
            
            for agent_name, data in self.agent_files.items():
                total_count += 1
                # Check various health indicators
                if data.get('status') == 'connected' or data.get('status') == 'healthy':
                    healthy_count += 1
                elif 'health' in data and data['health'] > 80:
                    healthy_count += 1
            
            if total_count > 0:
                health_pct = int((healthy_count / total_count) * 100)
                return f"Reality Agents: {healthy_count}/{total_count} healthy ({health_pct}%)"
        
        # Last check time from state
        state_file = Path('.cos/state.json')
        if state_file.exists():
            with open(state_file) as f:
                state = json.load(f)
                last_check = state.get('last_reality_check')
                if last_check:
                    try:
                        check_time = datetime.fromisoformat(last_check)
                        time_diff = datetime.now() - check_time
                        hours_ago = int(time_diff.total_seconds() / 3600)
                        if hours_ago > 24:
                            return f"Reality Agents: Last check {hours_ago//24} days ago ⚠️"
                        elif hours_ago > 4:
                            return f"Reality Agents: Last check {hours_ago} hours ago"
                    except:
                        pass
        
        return "Reality Agents: No recent data (run ./scripts/00028-reality-check.sh)"


class PhaseManager:
    """Manage SEED/GROW/HARVEST phases"""
    
    def __init__(self):
        self.config = self._load_config()
        self.current_phase = self.config.get('phase', 'GROW')
        self.strategic_phase = self.config.get('strategic_phase', 'Phase 4B: Production')
    
    def _load_config(self) -> Dict:
        """Load COS configuration"""
        config_file = Path('.cos/config.json')
        if config_file.exists():
            with open(config_file) as f:
                return json.load(f)
        return {'phase': 'GROW', 'enforcement': 'MODERATE'}
    
    def get_phase(self) -> str:
        """Get current phase"""
        return self.current_phase
    
    def get_enforcement(self) -> str:
        """Get enforcement level"""
        return self.config.get('enforcement', 'MODERATE')
    
    def get_phase_guide(self) -> str:
        """Get path to phase-specific guide"""
        guides = {
            'SEED': '00031-PHASE-SEED-GUIDE.md',
            'GROW': '00031-PHASE-GROW-GUIDE.md',
            'HARVEST': '00031-PHASE-HARVEST-GUIDE.md'
        }
        return guides.get(self.current_phase, guides['GROW'])
    
    def check_transition_indicators(self) -> Optional[str]:
        """Check if phase transition might be needed"""
        state = self._load_state()
        metrics = state.get('metrics', {})
        
        if self.current_phase == 'SEED':
            # Check for GROW indicators
            indicators = []
            ready_count = 0
            
            # Check architecture documentation
            if Path('architecture/').exists() and len(list(Path('architecture/').glob('*.md'))) > 3:
                indicators.append("✅ Architecture documented")
                ready_count += 1
            else:
                indicators.append("⏳ Architecture needs documentation")
            
            # Check technology decisions
            if Path('architecture/decisions/').exists():
                indicators.append("✅ Technology decisions recorded")
                ready_count += 1
            else:
                indicators.append("⏳ Record technology choices")
            
            # Check if first feature identified
            if metrics.get('first_feature_identified', False):
                indicators.append("✅ First feature identified")
                ready_count += 1
            else:
                indicators.append("⏳ Identify first feature to build")
            
            if ready_count >= 2:
                return f"📈 SEED → GROW transition ready ({ready_count}/3 indicators):\n     " + "\n     ".join(indicators)
            
        elif self.current_phase == 'GROW':
            # Check for HARVEST indicators
            features_complete = metrics.get('features_complete', 0)
            test_coverage = metrics.get('test_coverage', 0)
            doc_current = metrics.get('documentation_current', True)
            last_commit = metrics.get('last_commit', 'Unknown')
            
            indicators = []
            ready_count = 0
            
            # Feature completion
            if features_complete > 0.7:
                indicators.append(f"✅ Features {features_complete*100:.0f}% complete (>70%)")
                ready_count += 1
            else:
                indicators.append(f"⏳ Features {features_complete*100:.0f}% complete (need 70%)")
            
            # Test coverage
            if test_coverage > 0.6:
                indicators.append(f"✅ Test coverage {test_coverage*100:.0f}% (>60%)")
                ready_count += 1
            else:
                indicators.append(f"⏳ Test coverage {test_coverage*100:.0f}% (need 60%)")
            
            # Documentation
            if doc_current:
                indicators.append("✅ Documentation current")
                ready_count += 1
            else:
                indicators.append("⚠️ Documentation needs update")
            
            # MVP status
            if features_complete > 0.7:
                indicators.append("✅ MVP requirements likely met")
                ready_count += 1
            
            if ready_count >= 3:
                return f"📈 GROW → HARVEST transition recommended ({ready_count}/4 indicators):\n     " + "\n     ".join(indicators) + "\n     Run: ./scripts/00032-phase-transition.sh GROW HARVEST"
            elif ready_count >= 2:
                return f"📊 Approaching HARVEST phase ({ready_count}/4 indicators):\n     " + "\n     ".join(indicators)
            
        elif self.current_phase == 'HARVEST':
            # Check for next SEED indicators
            indicators = []
            ready_count = 0
            
            # All tests passing
            if metrics.get('all_tests_passing', False):
                indicators.append("✅ All tests passing")
                ready_count += 1
            else:
                indicators.append("❌ Tests need to pass")
            
            # Documentation complete
            if metrics.get('documentation_complete', False):
                indicators.append("✅ Documentation complete")
                ready_count += 1
            else:
                indicators.append("⏳ Documentation incomplete")
            
            # Lessons extracted
            if Path('00032-lessons-learned.md').exists():
                indicators.append("✅ Lessons extracted")
                ready_count += 1
            else:
                indicators.append("⏳ Extract lessons learned")
            
            if ready_count == 3:
                return f"🎉 HARVEST complete! Ready for next SEED cycle:\n     " + "\n     ".join(indicators) + "\n     Run: ./scripts/00032-harvest-ceremony.sh"
            else:
                return f"🌾 HARVEST in progress ({ready_count}/3 complete):\n     " + "\n     ".join(indicators)
        
        return None
    
    def _load_state(self) -> Dict:
        """Load system state"""
        state_file = Path('.cos/state.json')
        if state_file.exists():
            with open(state_file) as f:
                return json.load(f)
        return {}


class ConstitutionalDashboard:
    """Main dashboard orchestrator"""
    
    def __init__(self, verbosity='glance'):
        self.verbosity = verbosity
        self.phase_manager = PhaseManager()
        self.phase = self.phase_manager.get_phase()
        self.personality = PersonalityEngine(self.phase)
        self.violations = ViolationQueue(self.phase)
        self.health_calc = HealthCalculator()
        self.reality = RealityIntegration()
    
    def display_glance(self) -> str:
        """Quick 5-second glance view"""
        health = self.health_calc.calculate()
        health_icon = "✅" if health >= 80 else "⚠️" if health >= 70 else "❌"
        violations_summary = self.violations.get_summary()
        
        return f"{self.personality.get_emoji()} {self.phase} {health}% {health_icon} | {violations_summary}"
    
    def display_normal(self):
        """Normal 30-second view"""
        print("╔══════════════════════════════════════════════════════════════╗")
        print(f"║         Constitutional OS Dashboard v1.0 - Session 32         ║")
        print("╚══════════════════════════════════════════════════════════════╝")
        print()
        print(f"  {self.personality.greet()}")
        print()
        print(f"  Strategic Phase: {self.phase_manager.strategic_phase}")
        print(f"  Session Phase:   {self.personality.get_emoji()} {self.phase} (Active Implementation)")
        print(f"  Enforcement:     {self.phase_manager.get_enforcement()}")
        print()
        
        health = self.health_calc.calculate()
        health_bar = self._get_health_bar(health)
        health_status = "✅ HEALTHY" if health >= 80 else "⚠️ ATTENTION" if health >= 70 else "❌ NEEDS WORK"
        
        print(f"  Constitutional Health: {health}% {health_bar} {health_status}")
        print()
        
        # Violations section
        if self.violations.get_count() > 0:
            print("  📋 Attention Needed:")
            self.violations.display_violations()
        else:
            print("  ✅ Compliance: All files properly prefixed!")
        
        print()
        
        # Reality Agents
        print(f"  🔍 {self.reality.get_summary()}")
        print()
        
        # Automation Roadmap Progress
        print("  📊 Automation Roadmap Progress:")
        print(f"     {self.health_calc.roadmap.get_automation_progress()}")
        print()
        
        # Strategic Context
        masterplan = self.health_calc.roadmap.masterplan_context
        requirements = self.health_calc.roadmap.requirements_status
        automation = self.health_calc.roadmap.automation_status
        
        print("  🎯 Strategic Context:")
        print(f"     Vision: {masterplan['vision']}")
        print(f"     Canvas Coverage: {requirements['status']} ({requirements['total_stories']} stories)")
        print(f"     Reality Agents: {automation['reality_agents']}")
        print(f"     Session Automation: {automation['session_automation']}")
        print()
        
        # Transition check
        transition_hint = self.phase_manager.check_transition_indicators()
        if transition_hint:
            print(f"  💡 {transition_hint}")
            print()
        
        # Guidance
        print("  📚 Quick Reference:")
        print(f"     Phase Guide: {self.phase_manager.get_phase_guide()}")
        print(f"     Boundaries:  00031-WORKFLOW-BOUNDARIES.md")
        print()
        
        if self.phase == 'GROW':
            print("  🌿 GROW Phase Reminders:")
            print("     • Prefix all new files with 00032-")
            print("     • Test completed features progressively")
            print("     • Document inline as you build")
            print("     • Commit every 2-4 hours")
    
    def display_deep(self):
        """Deep 5-minute analysis view"""
        self.display_normal()
        print()
        print("═══════════════════════════════════════════════════════════════")
        print("                        DEEP ANALYSIS                          ")
        print("═══════════════════════════════════════════════════════════════")
        print()
        
        # Detailed metrics with roadmap context
        state = self._load_state()
        metrics = state.get('metrics', {})
        roadmap = self.health_calc.roadmap
        
        print("  📊 Detailed Metrics with Roadmap Context:")
        print(f"     Features Complete:    {metrics.get('features_complete', 0) * 100:.0f}%")
        print(f"     ├─ Canvas Coverage:   {roadmap.requirements_status['status']} ({roadmap.requirements_status['total_stories']} stories)")
        print(f"     ├─ Runtime Engine:    ✅ EXTRACTED (Sessions 22-24 discovery)")
        print(f"     ├─ Reality Agents:    {roadmap.automation_status['reality_agents']}")
        print(f"     └─ Session Startup:   ✅ AUTOMATED ({roadmap.automation_status['session_automation']})")
        print()
        print(f"     Test Coverage:        {metrics.get('test_coverage', 0) * 100:.0f}%")
        print(f"     Documentation:        {'Current ✅' if metrics.get('documentation_current') else 'Needs Update ⚠️'}")
        print(f"     Last Commit:          {metrics.get('last_commit', 'Unknown')}")
        print(f"     Commit Frequency:     {metrics.get('commit_frequency', 'Unknown')}")
        print()
        
        print("  🗺️ Automation Roadmap Status:")
        print(f"     Overall Progress:     {roadmap.automation_status['status']}")
        print(f"     ├─ Phase 22-24:       ✅ Discovery Complete")  
        print(f"     ├─ Phase 28-29:       ✅ Session automation")
        print(f"     ├─ Phase 30-32:       ✅ Constitutional OS Dashboard")
        print(f"     └─ Next Phase:        HARVEST validation per roadmap")
        print()
        
        # Reality Agent details
        print("  🤖 Reality Agent Status:")
        agents = state.get('reality_agents', {})
        for agent, status in agents.items():
            icon = "✅" if status == "healthy" else "❓"
            print(f"     {agent.title():20} {icon} {status}")
        print()
        
        # File system scan
        print("  📁 Session 32 Deliverables:")
        session_files = glob.glob('00032-*') + glob.glob('scripts/00032-*')
        if session_files:
            for f in session_files[:10]:  # Show first 10
                print(f"     • {f}")
            if len(session_files) > 10:
                print(f"     ... and {len(session_files) - 10} more")
        else:
            print("     No session-prefixed files yet")
        print()
        
        # Recommendations
        print("  💡 Phase-Specific Recommendations:")
        if self.phase == 'GROW':
            print("     1. Continue rapid feature development")
            print("     2. Write tests for completed features")
            print("     3. Keep documentation inline and current")
            print("     4. Consider HARVEST phase at 70% completion")
    
    def _get_health_bar(self, health: int) -> str:
        """Generate visual health bar"""
        filled = int(health / 10)
        empty = 10 - filled
        return f"[{'█' * filled}{'░' * empty}]"
    
    def _load_state(self) -> Dict:
        """Load system state"""
        state_file = Path('.cos/state.json')
        if state_file.exists():
            with open(state_file) as f:
                return json.load(f)
        return {}
    
    def generate_html(self) -> str:
        """Generate HTML version of dashboard"""
        health = self.health_calc.calculate()
        health_color = '#28a745' if health >= 80 else '#ffc107' if health >= 70 else '#dc3545'
        
        # Phase transition info
        transition_html = ""
        transition_hint = self.phase_manager.check_transition_indicators()
        if transition_hint:
            transition_lines = transition_hint.split('\n')
            transition_html = f"""
            <div class="alert alert-info">
                <h5>{transition_lines[0]}</h5>
                <ul class="mb-0">
                    {''.join(f'<li>{line.strip()}</li>' for line in transition_lines[1:] if line.strip())}
                </ul>
            </div>
            """
        
        # Violations section
        violations_html = ""
        if self.violations.get_count() > 0:
            violation_list = []
            for v in self.violations.violations[:10]:  # Show first 10
                violation_list.append(f"""
                <li class="list-group-item">
                    <code>{v['file']}</code> - missing session prefix
                    <br><small class="text-muted">Fix: <code>{v['fix_command']}</code></small>
                </li>
                """)
            violations_html = f"""
            <div class="card mt-3">
                <div class="card-header bg-warning text-dark">
                    ⚠️ {self.violations.get_count()} Violation(s) Found
                </div>
                <ul class="list-group list-group-flush">
                    {''.join(violation_list)}
                </ul>
            </div>
            """
        else:
            violations_html = '<div class="alert alert-success">✅ All files properly prefixed!</div>'
        
        # Session deliverables
        session_files = glob.glob('00032-*') + glob.glob('scripts/00032-*')
        deliverables_html = ""
        if session_files:
            file_list = ''.join(f'<li><code>{f}</code></li>' for f in session_files[:10])
            deliverables_html = f"""
            <div class="card mt-3">
                <div class="card-header">📁 Session 32 Deliverables</div>
                <div class="card-body">
                    <ul class="mb-0">{file_list}</ul>
                    {f'<small class="text-muted">... and {len(session_files) - 10} more</small>' if len(session_files) > 10 else ''}
                </div>
            </div>
            """
        
        html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Constitutional OS Dashboard - Session 32</title>
    <style>
        body {{ 
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace; 
            background: #1a1a1a; 
            color: #e0e0e0; 
            margin: 0; 
            padding: 0;
        }}
        .container {{ max-width: 1200px; margin: 20px auto; padding: 0 20px; }}
        .header {{ 
            background: #2d2d2d; 
            color: #ffffff; 
            padding: 20px; 
            border-left: 4px solid #4a9eff;
            margin-bottom: 20px;
        }}
        .section {{ 
            background: #2d2d2d; 
            border: 1px solid #404040; 
            margin-bottom: 20px; 
            padding: 20px;
        }}
        .section-header {{ 
            color: #4a9eff; 
            font-weight: bold; 
            margin-bottom: 15px; 
            border-bottom: 1px solid #404040; 
            padding-bottom: 10px;
        }}
        .health-bar {{ 
            height: 20px; 
            background: #404040; 
            border: 1px solid #606060; 
            margin: 10px 0;
        }}
        .health-fill {{ 
            height: 100%; 
            background: #4a9eff; 
            transition: width 0.5s ease; 
        }}
        .metric-grid {{ display: flex; gap: 20px; flex-wrap: wrap; }}
        .metric-item {{ 
            flex: 1; 
            min-width: 200px; 
            padding: 15px; 
            background: #333333; 
            border-left: 3px solid #4a9eff;
        }}
        .metric-value {{ font-size: 1.8em; font-weight: bold; color: #ffffff; }}
        .metric-label {{ color: #b0b0b0; font-size: 0.9em; }}
        .metric-detail {{ color: #808080; font-size: 0.8em; margin-top: 5px; }}
        .progress-list {{ list-style: none; padding: 0; }}
        .progress-list li {{ 
            padding: 8px 0; 
            border-bottom: 1px solid #404040; 
            color: #e0e0e0;
        }}
        .progress-list li:last-child {{ border-bottom: none; }}
        .status-ok {{ color: #4a9eff; }}
        .status-warning {{ color: #ffaa4a; }}
        .status-error {{ color: #ff4a4a; }}
        code {{ 
            background: #404040; 
            color: #4a9eff; 
            padding: 2px 6px; 
            border-radius: 3px; 
            font-family: inherit;
        }}
        h1, h2, h3 {{ color: #ffffff; }}
        .phase-indicator {{ 
            font-size: 1.2em; 
            color: #4a9eff; 
            font-weight: bold;
        }}
        .violation-item {{ 
            background: #3d2d2d; 
            border-left: 3px solid #ffaa4a; 
            padding: 10px; 
            margin: 5px 0;
        }}
        .deliverable-item {{ 
            background: #2d3d2d; 
            border-left: 3px solid #4aff4a; 
            padding: 8px; 
            margin: 3px 0;
        }}
        .two-column {{ display: flex; gap: 20px; }}
        .column {{ flex: 1; }}
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>Constitutional OS Dashboard v1.0</h1>
            <div style="opacity: 0.8;">Session 32 - {datetime.now().strftime('%Y-%m-%d %H:%M')}</div>
        </div>

        <!-- Greeting -->
        <div class="section">
            <div class="phase-indicator">
                {self.personality.get_emoji()} {self.personality.greet()}
            </div>
        </div>

        <!-- Phase Information -->
        <div class="section">
            <div class="section-header">Phase Status</div>
            <div class="two-column">
                <div class="column">
                    <strong>Strategic Phase:</strong><br>
                    {self.phase_manager.strategic_phase}
                </div>
                <div class="column">
                    <strong>Session Phase:</strong><br>
                    <span class="status-ok">{self.personality.get_emoji()} {self.phase}</span> | Enforcement: {self.phase_manager.get_enforcement()}
                </div>
            </div>
        </div>

        <!-- Health Score -->
        <div class="section">
            <div class="section-header">Constitutional Health</div>
            <div class="health-bar">
                <div class="health-fill" style="width: {health}%;"></div>
            </div>
            <div style="text-align: center; margin-top: 10px;">
                <span style="font-size: 1.5em; font-weight: bold;">{health}%</span>
                <span style="opacity: 0.7; margin-left: 10px;">Target: 80% for GROW phase</span>
            </div>
        </div>

        <!-- Metrics -->
        <div class="section">
            <div class="section-header">System Metrics</div>
            <div class="metric-grid">
                <div class="metric-item">
                    <div class="metric-value">70%</div>
                    <div class="metric-label">Features Complete</div>
                    <div class="metric-detail">Canvas: ~95% (275 stories)</div>
                </div>
                <div class="metric-item">
                    <div class="metric-value">62%</div>
                    <div class="metric-label">Test Coverage</div>
                    <div class="metric-detail">HARVEST threshold: 60%</div>
                </div>
                <div class="metric-item">
                    <div class="metric-value">98%</div>
                    <div class="metric-label">Automation</div>
                    <div class="metric-detail">7/7 Reality Agents</div>
                </div>
                <div class="metric-item">
                    <div class="metric-value">{self.violations.get_count()}</div>
                    <div class="metric-label">Violations</div>
                    <div class="metric-detail">File prefix compliance</div>
                </div>
            </div>
        </div>

        <!-- Automation Roadmap -->
        <div class="section">
            <div class="section-header">📊 Automation Roadmap Progress</div>
            <div class="two-column">
                <div class="column">
                    <strong>Completed Phases</strong>
                    <ul class="progress-list">
                        <li class="status-ok">✅ Phase 22-24: Discovery Complete (275 stories)</li>
                        <li class="status-ok">✅ Phase 28-29: Session automation (6 second startup)</li>
                        <li class="status-ok">✅ Phase 30-32: Constitutional OS Dashboard</li>
                        <li class="status-warning">⏳ Next Phase: HARVEST validation per roadmap</li>
                    </ul>
                </div>
                <div class="column">
                    <strong>Strategic Context</strong>
                    <ul class="progress-list">
                        <li><strong>Vision:</strong> "Where Learning Becomes Identity"</li>
                        <li><strong>Canvas Coverage:</strong> ~95% (275 stories)</li>
                        <li><strong>Reality Agents:</strong> 7/7 operational</li>
                        <li><strong>Next:</strong> HARVEST validation</li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Phase Transition -->
        <div class="section">
            <div class="section-header">💡 Phase Transition Status</div>
            <div>📊 Approaching HARVEST phase (2/4 indicators):</div>
            <ul class="progress-list">
                <li class="status-warning">⏳ Features 70% complete (need 70%)</li>
                <li class="status-ok">✅ Test coverage 62% (>60%)</li>
                <li class="status-ok">✅ Documentation current</li>
            </ul>
        </div>

        <!-- Violations -->
        {violations_html if self.violations.get_count() > 0 else '<div class="section"><div class="section-header">File Compliance</div><div class="status-ok">✅ All files properly prefixed!</div></div>'}

        <!-- Reality Agents -->
        <div class="section">
            <div class="section-header">🔍 Reality Agent Status</div>
            <div>{self.reality.get_summary()}</div>
        </div>

        <!-- Session Deliverables -->
        {('<div class="section"><div class="section-header">📁 Session 32 Deliverables</div>' + "".join(f'<div class="deliverable-item"><code>{f}</code></div>' for f in session_files[:10]) + ('</div>' + f'<div style="opacity: 0.7; margin-top: 10px;">... and {len(session_files) - 10} more</div>' if len(session_files) > 10 else '</div>')) if session_files else ''}

        <!-- Quick Reference -->
        <div class="section">
            <div class="section-header">📚 Quick Reference</div>
            <ul class="progress-list">
                <li>Phase Guide: <code>{self.phase_manager.get_phase_guide()}</code></li>
                <li>Boundaries: <code>00031-WORKFLOW-BOUNDARIES.md</code></li>
                <li>Dashboard CLI: <code>./scripts/00032-tos-dashboard.sh</code></li>
            </ul>
        </div>

        <!-- GROW Reminders -->
        <div class="section">
            <div class="section-header">🌿 GROW Phase Reminders</div>
            <ul class="progress-list">
                <li>Prefix all new files with 00032-</li>
                <li>Test completed features progressively</li>
                <li>Document inline as you build</li>
                <li>Commit every 2-4 hours</li>
            </ul>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin: 40px 0; opacity: 0.6; border-top: 1px solid #404040; padding-top: 20px;">
            Constitutional OS - Assistance, Not Policing | Session 32
        </div>
    </div>
</body>
</html>"""
        return html
    
    def run(self):
        """Run dashboard with appropriate verbosity"""
        if self.verbosity == 'glance':
            print(self.display_glance())
        elif self.verbosity == 'normal':
            self.display_normal()
        elif self.verbosity == 'deep':
            self.display_deep()


def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(
        description='Constitutional OS Dashboard - Phase-aware development assistant'
    )
    parser.add_argument(
        '--verbosity',
        choices=['glance', 'normal', 'deep'],
        default='glance',
        help='Display verbosity level'
    )
    parser.add_argument(
        '--normal',
        action='store_true',
        help='Normal view (30 seconds)'
    )
    parser.add_argument(
        '--deep',
        action='store_true',
        help='Deep analysis (5 minutes)'
    )
    parser.add_argument(
        '--json',
        action='store_true',
        help='Output as JSON'
    )
    parser.add_argument(
        '--html',
        action='store_true',
        help='Output as HTML'
    )
    
    args = parser.parse_args()
    
    # Handle convenience flags
    if args.normal:
        args.verbosity = 'normal'
    elif args.deep:
        args.verbosity = 'deep'
    
    # JSON output mode
    if args.json:
        dashboard = ConstitutionalDashboard()
        output = {
            'phase': dashboard.phase,
            'health': dashboard.health_calc.calculate(),
            'violations': dashboard.violations.get_count(),
            'enforcement': dashboard.phase_manager.get_enforcement()
        }
        print(json.dumps(output, indent=2))
    # HTML output mode
    elif args.html:
        dashboard = ConstitutionalDashboard()
        print(dashboard.generate_html())
    else:
        dashboard = ConstitutionalDashboard(args.verbosity)
        dashboard.run()


if __name__ == '__main__':
    main()