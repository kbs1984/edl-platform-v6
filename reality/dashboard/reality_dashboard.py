#!/usr/bin/env python3
"""
Reality Domain Dashboard - Evolution of Session 01's Vision
A living dashboard that shows real integration health and truth metrics
"""

import json
import sys
import os
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, Any, List
import subprocess
import hashlib

# Add parent directories to path
sys.path.append(str(Path(__file__).parent.parent))
sys.path.append(str(Path(__file__).parent.parent / "agent-reality-auditor" / "integration-connector"))

from connector import IntegrationRealityAgent


class RealityDashboard:
    """Single pane of glass for all truth - Evolution of Session 01's vision"""
    
    def __init__(self):
        self.session_id = self._get_current_session()
        # Pass project root to Integration Agent so it finds tests directory
        project_root = Path(__file__).parent.parent.parent
        self.agent = IntegrationRealityAgent(str(project_root))
        self.timestamp = datetime.now()
        self.cache_dir = Path(__file__).parent / ".cache"
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        
        # Historical data for trends
        self.history_file = self.cache_dir / "dashboard_history.json"
        self.history = self._load_history()
        
    def _get_current_session(self) -> str:
        """Detect current session from environment or default"""
        # Look for session logs to determine current session
        session_logs = Path.cwd() / "session-logs"
        if session_logs.exists():
            sessions = list(session_logs.glob("SESSION-*"))
            if sessions:
                # Extract session numbers and get the latest
                numbers = []
                for s in sessions:
                    try:
                        num = int(s.name.split('-')[1].split('.')[0])
                        numbers.append(num)
                    except:
                        pass
                if numbers:
                    return f"00{max(numbers) + 1:03d}"
        return "00006"  # Default to next session
    
    def _load_history(self) -> List[Dict]:
        """Load historical dashboard data"""
        if self.history_file.exists():
            try:
                return json.loads(self.history_file.read_text())
            except:
                return []
        return []
    
    def _save_history(self, data: Dict) -> None:
        """Save current data to history"""
        self.history.append(data)
        # Keep last 100 entries
        if len(self.history) > 100:
            self.history = self.history[-100:]
        self.history_file.write_text(json.dumps(self.history, indent=2))
    
    def _get_session_gap(self) -> timedelta:
        """Calculate time since last session"""
        if self.history:
            last_timestamp = datetime.fromisoformat(self.history[-1]['timestamp'])
            return datetime.now() - last_timestamp
        return timedelta(hours=0)
    
    def _calculate_trend(self, metric: str) -> str:
        """Calculate trend for a metric"""
        if len(self.history) < 2:
            return "→"
        
        current = self.history[-1].get(metric, 0)
        previous = self.history[-2].get(metric, 0)
        
        if current > previous:
            return "↑"
        elif current < previous:
            return "↓"
        else:
            return "→"
    
    def generate_master_view(self) -> str:
        """Generate the complete dashboard view"""
        # Gather all data
        health_data = self.agent.calculate_health_score()
        level1 = self.agent.level_1_health_check()
        level2 = self.agent.level_2_binary_correlation()
        debt = self.agent.track_integration_debt()
        gaps = self.agent.discover_session_reality_gaps()
        retroactive = self.agent.find_retroactive_logging()
        
        # Calculate additional metrics
        session_gap = self._get_session_gap()
        
        # Count actual files and commits
        try:
            # Count Python files
            py_files = len(list(Path.cwd().glob("**/*.py")))
            
            # Count commits in last 7 days
            result = subprocess.run(
                ["git", "log", "--oneline", "--since=7.days.ago"],
                capture_output=True,
                text=True,
                cwd=Path.cwd()
            )
            recent_commits = len(result.stdout.strip().split('\n')) if result.stdout.strip() else 0
        except:
            py_files = 0
            recent_commits = 0
        
        # Build the dashboard
        dashboard = []
        dashboard.append("╔" + "═" * 66 + "╗")
        dashboard.append("║" + " " * 14 + "REALITY DOMAIN MASTER DASHBOARD" + " " * 21 + "║")
        dashboard.append("║" + " " * 20 + f"Session: {self.session_id}" + " " * 27 + "║")
        dashboard.append("║" + " " * 16 + f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}" + " " * 19 + "║")
        dashboard.append("╚" + "═" * 66 + "╝")
        dashboard.append("")
        
        # Agent Status Section
        dashboard.append("📊 AGENT STATUS")
        
        # FileSystem Agent
        fs_status = level1['agents'].get('fs_agent', {})
        fs_icon = "✅" if fs_status.get('status') == 'healthy' else "⚠️" if fs_status.get('status') == 'limited' else "❌"
        dashboard.append(f"├─ FileSystem Agent:  {fs_icon} {fs_status.get('status', 'unknown').capitalize()} | {py_files} files tracked")
        
        # GitHub Agent  
        gh_status = level1['agents'].get('gh_agent', {})
        gh_icon = "✅" if gh_status.get('status') == 'healthy' else "⚠️" if gh_status.get('status') == 'limited' else "❌"
        dashboard.append(f"├─ GitHub Agent:      {gh_icon} {gh_status.get('status', 'unknown').capitalize()} | {recent_commits} recent commits")
        
        # Supabase Agent
        db_status = level1['agents'].get('db_agent', {})
        db_icon = "✅" if db_status.get('status') == 'healthy' else "⚠️" if db_status.get('status') == 'limited' else "❌"
        db_info = "No credentials" if db_status.get('status') == 'unavailable' else f"{db_status.get('status', 'unknown')}"
        dashboard.append(f"├─ Supabase Agent:    {db_icon} {db_info}")
        
        # Integration Agent
        dashboard.append(f"└─ Integration Agent: ✅ Operational | {health_data['overall']:.0%} health score")
        dashboard.append("")
        
        # Truth Metrics Section
        dashboard.append("🔍 TRUTH METRICS")
        
        # Deception Score
        deception_count = len(gaps.get('deception_instances', []))
        deception_percent = (1.0 - gaps.get('truth_score', 1.0)) * 100
        dashboard.append(f"├─ Deception Score:      {deception_percent:.0f}% ({deception_count} instances detected)")
        
        # Integration Debt
        debt_score = debt.get('total_debt_score', 0)
        debt_trend = "↑" if debt_score > 50 else "↓" if debt_score < 30 else "→"
        dashboard.append(f"├─ Integration Debt:     ${debt_score} (trending {debt_trend})")
        
        # Session Gap
        gap_hours = session_gap.total_seconds() / 3600
        gap_impact = "High" if gap_hours > 24 else "Medium" if gap_hours > 12 else "Low"
        dashboard.append(f"├─ Session Gap Impact:   {gap_impact} ({gap_hours:.1f} hours since last session)")
        
        # Agent Consensus
        consensus = health_data['consistency'] * 100
        dashboard.append(f"└─ Agent Consensus:      {consensus:.0f}% (minor disagreements expected)")
        dashboard.append("")
        
        # Active Issues Section
        dashboard.append("⚠️  ACTIVE ISSUES")
        issue_count = 1
        
        if level2.get('uncommitted'):
            count = len(level2['uncommitted'])
            dashboard.append(f"{issue_count}. [HIGH] {count} uncommitted files")
            issue_count += 1
        
        if level2.get('untracked'):
            count = len(level2['untracked'])
            dashboard.append(f"{issue_count}. [MEDIUM] {count} untracked files")
            issue_count += 1
        
        if retroactive:
            dashboard.append(f"{issue_count}. [CRITICAL] {len(retroactive)} retroactive logging instances")
            issue_count += 1
        
        if debt.get('missing_tests', 0) > 5:
            dashboard.append(f"{issue_count}. [MEDIUM] {debt['missing_tests']} components without tests")
            issue_count += 1
        
        if issue_count == 1:
            dashboard.append("✅ No critical issues detected!")
        
        dashboard.append("")
        
        # Prescribed Actions Section
        dashboard.append("💊 PRESCRIBED ACTIONS")
        
        action_count = 1
        if level2.get('uncommitted'):
            dashboard.append(f"{action_count}. Run: git add -A && git commit -m \"Session {self.session_id} work\"")
            action_count += 1
        
        if level2.get('unpushed'):
            dashboard.append(f"{action_count}. Run: git push origin main")
            action_count += 1
        
        if debt.get('missing_tests', 0) > 5:
            dashboard.append(f"{action_count}. Create test files for untested components")
            action_count += 1
        
        if action_count == 1:
            dashboard.append("✅ No immediate actions required")
        
        dashboard.append("")
        
        # Protocol v2.0 Status Section (NEW!)
        dashboard.append("📝 SESSION LOG PROTOCOL v2.0 STATUS")
        
        # Check if v2.0 is implemented
        # Navigate to project root first
        project_root = Path(__file__).parent.parent.parent
        create_log_script = project_root / "scripts" / "create-session-log.sh"
        v2_implemented = False
        if create_log_script.exists():
            content = create_log_script.read_text()
            if "System State at Session Start" in content:
                v2_implemented = True
        
        if v2_implemented:
            dashboard.append("✅ Protocol v2.0 IMPLEMENTED (Session 00007)")
            dashboard.append("   - System State section in templates")
            dashboard.append("   - Reality Agent status tracking")
            dashboard.append("   - Structural awareness enabled")
        else:
            dashboard.append("⚠️  Protocol v1.0 (awaiting v2.0 upgrade)")
            dashboard.append("   - See SESSION-00007-HANDOFF.md")
        
        dashboard.append("")
        
        # Historical Trend Section  
        dashboard.append("📈 HISTORICAL TREND")
        dashboard.append("Session 00001: No agents (0% visibility)")
        dashboard.append("Session 00002: 1 agent (25% visibility)")
        dashboard.append("Session 00003: 2 agents (50% visibility)")
        dashboard.append("Session 00004: 3 agents (75% visibility)")
        dashboard.append("Session 00005: 4 agents + Integration (100% visibility)")
        dashboard.append("Session 00006: 100% health + structural docs")
        dashboard.append("Session 00007: Protocol v2.0 implementation ← YOU ARE HERE")
        dashboard.append("")
        
        # Next Milestone
        dashboard.append("🎯 NEXT MILESTONE: Requirements Domain Integration")
        dashboard.append("   - Connect Requirements to Reality Agents")
        dashboard.append("   - Enable automatic gap detection")
        dashboard.append("   - Create reconciliation playbooks")
        dashboard.append("")
        
        # Footer with health bars
        dashboard.append("─" * 68)
        dashboard.append("HEALTH SCORES:")
        dashboard.append(f"Sync  {self.agent.generate_health_bar(health_data['synchronization'], 40)}")
        dashboard.append(f"Cmpl  {self.agent.generate_health_bar(health_data['completeness'], 40)}")
        dashboard.append(f"Cons  {self.agent.generate_health_bar(health_data['consistency'], 40)}")
        dashboard.append(f"Trns  {self.agent.generate_health_bar(health_data['transparency'], 40)}")
        dashboard.append(f"TOTAL {self.agent.generate_health_bar(health_data['overall'], 40)}")
        dashboard.append("─" * 68)
        
        # Save to history
        history_entry = {
            'timestamp': datetime.now().isoformat(),
            'session': self.session_id,
            'health_overall': health_data['overall'],
            'debt_score': debt_score,
            'deception_count': deception_count,
            'uncommitted': len(level2.get('uncommitted', [])),
            'untracked': len(level2.get('untracked', []))
        }
        self._save_history(history_entry)
        
        return "\n".join(dashboard)
    
    def generate_html_dashboard(self) -> str:
        """Generate an HTML version honoring Session 01's design"""
        # Gather data
        health_data = self.agent.calculate_health_score()
        level1 = self.agent.level_1_health_check()
        level2 = self.agent.level_2_binary_correlation()
        debt = self.agent.track_integration_debt()
        gaps = self.agent.discover_session_reality_gaps()
        
        # Generate JSON data for the HTML
        dashboard_data = {
            'timestamp': datetime.now().isoformat(),
            'session': self.session_id,
            'health': {
                'overall': health_data['overall'],
                'synchronization': health_data['synchronization'],
                'completeness': health_data['completeness'],
                'consistency': health_data['consistency'],
                'transparency': health_data['transparency']
            },
            'agents': level1['agents'],
            'debt': debt,
            'gaps': {
                'uncommitted': len(level2.get('uncommitted', [])),
                'untracked': len(level2.get('untracked', [])),
                'deceptions': len(gaps.get('deception_instances', []))
            },
            'truth_score': gaps.get('truth_score', 1.0)
        }
        
        # Save data for HTML to load
        data_file = Path(__file__).parent / "dashboard_data.json"
        data_file.write_text(json.dumps(dashboard_data, indent=2))
        
        return f"Dashboard data saved to: {data_file}"
    
    def run_continuous(self, interval: int = 30):
        """Run dashboard continuously with updates"""
        import time
        
        while True:
            try:
                # Clear screen (works on Unix-like systems)
                os.system('clear' if os.name == 'posix' else 'cls')
                
                # Generate and print dashboard
                print(self.generate_master_view())
                
                # Show update time
                print(f"\nLast updated: {datetime.now().strftime('%H:%M:%S')}")
                print(f"Next update in {interval} seconds... (Press Ctrl+C to exit)")
                
                # Wait for next update
                time.sleep(interval)
                
                # Reinitialize agent for fresh data
                self.agent = IntegrationRealityAgent()
                
            except KeyboardInterrupt:
                print("\n\nDashboard stopped.")
                break
            except Exception as e:
                print(f"\nError updating dashboard: {e}")
                print(f"Retrying in {interval} seconds...")
                time.sleep(interval)


def main():
    """Command line interface for Reality Dashboard"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description="Reality Domain Dashboard - Live view of system truth"
    )
    parser.add_argument(
        "--continuous",
        action="store_true",
        help="Run dashboard continuously with auto-refresh"
    )
    parser.add_argument(
        "--interval",
        type=int,
        default=30,
        help="Refresh interval in seconds (default: 30)"
    )
    parser.add_argument(
        "--html",
        action="store_true",
        help="Generate data for HTML dashboard"
    )
    parser.add_argument(
        "--output",
        type=str,
        help="Save dashboard to file"
    )
    
    args = parser.parse_args()
    
    dashboard = RealityDashboard()
    
    if args.html:
        result = dashboard.generate_html_dashboard()
        print(result)
    elif args.continuous:
        dashboard.run_continuous(args.interval)
    else:
        output = dashboard.generate_master_view()
        if args.output:
            Path(args.output).write_text(output)
            print(f"Dashboard saved to: {args.output}")
        else:
            print(output)


if __name__ == "__main__":
    main()