#!/usr/bin/env python3
"""
Terminal Dashboard for Deep System Analysis
Provides detailed, text-based view of system state for thorough examination
"""

import json
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, List
import subprocess
import time

class TerminalDashboard:
    """Deep analysis terminal dashboard for POS"""
    
    def __init__(self, root_path: str = None):
        self.root_path = Path(root_path) if root_path else Path.cwd()
        self.data = {}
        
    def clear_screen(self):
        """Clear terminal screen"""
        os.system('clear' if os.name == 'posix' else 'cls')
    
    def print_header(self):
        """Print dashboard header"""
        print("=" * 80)
        print(" PERSONAL OPERATING SYSTEM - DEEP ANALYSIS DASHBOARD ".center(80))
        print(" Reality-First Architecture | Three-Domain System ".center(80))
        print("=" * 80)
        print(f" Session: #00001 | Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} ".center(80))
        print("=" * 80)
        print()
    
    def load_system_health(self) -> Dict[str, Any]:
        """Load system health data"""
        health_file = self.root_path / "reconciliation" / "progress-tracking" / "CURRENT-SYSTEM-HEALTH.json"
        if health_file.exists():
            try:
                with open(health_file) as f:
                    return json.load(f)
            except:
                pass
        return {"overall_health": "unknown", "checks": {}}
    
    def load_gaps(self) -> Dict[str, Any]:
        """Load current gaps"""
        gaps_file = self.root_path / "reconciliation" / "gap-analysis" / "CURRENT-GAPS.json"
        if gaps_file.exists():
            try:
                with open(gaps_file) as f:
                    return json.load(f)
            except:
                pass
        return {"gaps_found": [], "summary": {}}
    
    def load_supabase_status(self) -> Dict[str, Any]:
        """Load Supabase agent status"""
        quickstart_file = self.root_path / "reality" / "agent-reality-auditor" / "quickstart-results.json"
        if quickstart_file.exists():
            try:
                with open(quickstart_file) as f:
                    return json.load(f)
            except:
                pass
        return {}
    
    def display_constitution_status(self):
        """Display constitutional governance status"""
        print("📜 CONSTITUTIONAL GOVERNANCE")
        print("-" * 40)
        print(f"  Version:     1.1.0")
        print(f"  Authority:   Reality Domain Leadership")
        print(f"  Enforcement: Active")
        
        # Check for violations
        violations_log = self.root_path / "CONSTITUTION-VIOLATIONS.log"
        if violations_log.exists():
            lines = violations_log.read_text().strip().split('\n')
            print(f"  Violations:  {len(lines)} logged")
        else:
            print(f"  Violations:  None")
        print()
    
    def display_domain_status(self):
        """Display three-domain architecture status"""
        print("🏛️ THREE-DOMAIN ARCHITECTURE")
        print("-" * 40)
        
        # Requirements Domain
        req_goals = len(list((self.root_path / "requirements" / "goals").glob("*.md"))) if (self.root_path / "requirements" / "goals").exists() else 0
        print(f"  📋 Requirements Domain:")
        print(f"     Active Goals:        {req_goals}")
        print(f"     Specifications:      0")
        print(f"     Constraints:         0")
        
        # Reality Domain  
        print(f"\n  🔍 Reality Domain [LEADER]:")
        health = self.load_system_health()
        reality_health = health.get("checks", {}).get("reality", {}).get("health_score", 0)
        print(f"     Health Score:        {reality_health:.1f}/100")
        print(f"     Veto Authority:      Active")
        print(f"     Chief Truth Officer: Active")
        
        # Reconciliation Domain
        gaps = self.load_gaps()
        gap_summary = gaps.get("summary", {})
        total_gaps = sum(gap_summary.values())
        print(f"\n  🔄 Reconciliation Domain:")
        print(f"     Total Gaps:          {total_gaps}")
        print(f"     Critical:            {gap_summary.get('critical', 0)}")
        print(f"     High:                {gap_summary.get('high', 0)}")
        print(f"     Medium:              {gap_summary.get('medium', 0)}")
        print(f"     Low:                 {gap_summary.get('low', 0)}")
        print()
    
    def display_agent_brigade(self):
        """Display agent brigade status"""
        print("🤖 AGENT BRIGADE STATUS")
        print("-" * 40)
        
        # Supabase Agent
        supabase_status = self.load_supabase_status()
        if supabase_status:
            ready = supabase_status.get("summary", {}).get("ready_for_production", False)
            print(f"  Supabase Reality Agent:")
            print(f"     Status:     {'✅ Production Ready' if ready else '⚠️ Development Mode'}")
            print(f"     Level:      4 (Full discovery + change tracking)")
            
            # Show test results
            tests = supabase_status.get("tests", {})
            for test_name, test_result in tests.items():
                status = test_result.get("status", "unknown")
                symbol = "✓" if status == "pass" else "✗" if status == "fail" else "?"
                print(f"     {symbol} {test_name}: {status}")
        else:
            print(f"  Supabase Reality Agent: Not initialized")
        
        # Other agents (planned)
        print(f"\n  File System Agent:      ⚫ Not started")
        print(f"  Git Repository Agent:   ⚫ Not started")
        print(f"  API Endpoint Agent:     ⚫ Not started")
        print()
    
    def display_gaps_detail(self):
        """Display detailed gap analysis"""
        gaps_data = self.load_gaps()
        gaps = gaps_data.get("gaps_found", [])
        
        print("🎯 GAP ANALYSIS (Requirements - Reality)")
        print("-" * 40)
        
        if not gaps:
            print("  ✅ No gaps detected - System aligned")
        else:
            for i, gap in enumerate(gaps[:5], 1):  # Show top 5
                severity = gap.get("severity", "unknown").upper()
                symbol = {"CRITICAL": "🔴", "HIGH": "🟠", "MEDIUM": "🟡", "LOW": "🟢"}.get(severity, "⚪")
                
                print(f"  {i}. {symbol} [{severity}]")
                print(f"     {gap.get('description', 'Unknown gap')}")
                if gap.get("suggested_action"):
                    print(f"     → Action: {gap['suggested_action']}")
                print()
        
        if len(gaps) > 5:
            print(f"  ... and {len(gaps) - 5} more gaps")
        print()
    
    def display_automation_status(self):
        """Display automation framework status"""
        print("⚙️ AUTOMATION FRAMEWORK")
        print("-" * 40)
        
        tools = [
            ("constitution-enforcer.py", "Constitutional compliance"),
            ("reality-auditor.py", "Reality state discovery"),
            ("gap-detector.py", "Gap identification"),
            ("system-guardian.py", "System orchestration"),
            ("session-guardian.sh", "Session management")
        ]
        
        for tool, purpose in tools:
            tool_path = self.root_path / "shared" / "tools" / "enforcement" / tool
            if not tool_path.exists():
                tool_path = self.root_path / "shared" / "tools" / "auditing" / tool
            if not tool_path.exists():
                tool_path = self.root_path / "shared" / "tools" / "monitoring" / tool
            if not tool_path.exists():
                tool_path = self.root_path / "shared" / "tools" / tool
            
            exists = "✓" if tool_path.exists() else "✗"
            print(f"  {exists} {tool:<30} {purpose}")
        print()
    
    def display_recent_changes(self):
        """Display recent system changes"""
        print("📡 RECENT SYSTEM ACTIVITY")
        print("-" * 40)
        
        # Check for Supabase snapshots
        snapshot_dir = self.root_path / "reality" / "agent-reality-auditor" / "supabase-connector" / ".cache" / "snapshots"
        if snapshot_dir.exists():
            snapshots = list(snapshot_dir.glob("snapshot_*.json"))
            print(f"  Supabase snapshots captured: {len(snapshots)}")
            
            if snapshots:
                latest = max(snapshots, key=lambda p: p.stat().st_mtime)
                mod_time = datetime.fromtimestamp(latest.stat().st_mtime)
                print(f"  Latest snapshot: {mod_time.strftime('%Y-%m-%d %H:%M:%S')}")
        
        # Session logs
        session_logs = list((self.root_path / "archive" / "sessions").glob("SESSION-*.md")) if (self.root_path / "archive" / "sessions").exists() else []
        print(f"  Session logs archived: {len(session_logs)}")
        
        print()
    
    def display_quick_commands(self):
        """Display useful commands"""
        print("⚡ QUICK COMMANDS")
        print("-" * 40)
        print("  System Health:")
        print("    make check         # Full system check")
        print("    make audit         # Constitution compliance")
        print("    make gaps          # Gap detection")
        print()
        print("  Supabase Agent:")
        print("    cd reality/agent-reality-auditor/supabase-connector")
        print("    python3 connector.py --level 4")
        print()
        print("  Session Management:")
        print("    make start-session SESSION=00002")
        print("    make end-session SESSION=00001")
        print()
    
    def run_interactive(self):
        """Run dashboard in interactive mode"""
        while True:
            self.clear_screen()
            self.print_header()
            
            # Display all sections
            self.display_constitution_status()
            self.display_domain_status()
            self.display_agent_brigade()
            self.display_gaps_detail()
            self.display_automation_status()
            self.display_recent_changes()
            self.display_quick_commands()
            
            # Footer
            print("=" * 80)
            print(" Press 'r' to refresh, 'q' to quit ".center(80))
            print("=" * 80)
            
            # Wait for input
            try:
                import select
                import termios
                import tty
                
                # Set terminal to raw mode for single key press
                old_settings = termios.tcgetattr(sys.stdin)
                try:
                    tty.setraw(sys.stdin.fileno())
                    
                    # Wait for input with timeout
                    rlist, _, _ = select.select([sys.stdin], [], [], 30)
                    
                    if rlist:
                        char = sys.stdin.read(1)
                        if char.lower() == 'q':
                            break
                        elif char.lower() == 'r':
                            continue  # Refresh immediately
                    else:
                        continue  # Auto-refresh after 30 seconds
                        
                finally:
                    termios.tcsetattr(sys.stdin, termios.TCSADRAIN, old_settings)
                    
            except (ImportError, AttributeError):
                # Fallback for non-Unix systems
                user_input = input("\nPress Enter to refresh, 'q' to quit: ").strip().lower()
                if user_input == 'q':
                    break
    
    def run_once(self):
        """Run dashboard once (non-interactive)"""
        self.print_header()
        self.display_constitution_status()
        self.display_domain_status()
        self.display_agent_brigade()
        self.display_gaps_detail()
        self.display_automation_status()
        self.display_recent_changes()
        self.display_quick_commands()
        print("=" * 80)


def main():
    """Main entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(description="POS Terminal Dashboard for Deep Analysis")
    parser.add_argument(
        "--once",
        action="store_true",
        help="Run once and exit (default: interactive mode)"
    )
    parser.add_argument(
        "--path",
        type=str,
        default=".",
        help="Path to POS root directory"
    )
    
    args = parser.parse_args()
    
    dashboard = TerminalDashboard(args.path)
    
    if args.once:
        dashboard.run_once()
    else:
        try:
            dashboard.run_interactive()
        except KeyboardInterrupt:
            print("\n\nDashboard terminated.")


if __name__ == "__main__":
    main()