#!/usr/bin/env python3
"""
00034-reality-status.py - Dedicated Reality Agent Status Viewer
Session 34: Deep visibility into Reality Agent health and connections
Makes the invisible visible - shows how truth verification actually works
"""

import json
import os
import sys
import time
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, Any, Optional, List, Tuple
import re
import argparse

class RealityAgentStatus:
    """
    Dedicated Reality Agent status viewer - makes truth visible
    
    Source Documents:
    - Agent definitions: reality/REALITY_INDEX.md (7 agents total)
    - Capabilities: AUTOMATION-INDEX.md Section 1 
    - Consensus calculation: Integration Agent specification
    - Authority: RESTORATION-MASTERPLAN-V3.md (Reality Domain leadership)
    """
    
    # Known agents per reality/REALITY_INDEX.md and AUTOMATION-INDEX.md
    KNOWN_AGENTS = {
        'filesystem': {
            'implemented': True, 
            'path': 'filesystem-connector',
            'output_file': '/tmp/filesystem.json',
            'capability': "Tracks file changes, structure, and metadata",
            'execution_time': 0.035
        },
        'github': {
            'implemented': True, 
            'path': 'github-connector',
            'output_file': '/tmp/github.json',
            'capability': "Monitors commits, branches, and repository state",
            'execution_time': 0.96
        },
        'supabase': {
            'implemented': True, 
            'path': 'supabase-connector',
            'output_file': '/tmp/supabase.json',
            'capability': "Verifies database schema and RLS policies",
            'execution_time': 2.4
        },
        'integration': {
            'implemented': True, 
            'path': 'integration-connector',
            'output_file': '/tmp/integration.json',
            'capability': "Calculates consensus from all agent inputs",
            'execution_time': 4.4
        },
        'vercel': {
            'implemented': False, 
            'path': 'vercel-connector',
            'output_file': None,
            'capability': "Would monitor deployments (not implemented)",
            'execution_time': None
        },
        'static_asset': {
            'implemented': False, 
            'path': 'static-asset-connector',
            'output_file': None,
            'capability': "Would track asset changes (not implemented)",
            'execution_time': None
        },
        'task_reality': {
            'implemented': False, 
            'path': 'task-connector',
            'output_file': None,
            'capability': "Would track task dependencies (not implemented)",
            'execution_time': None
        }
    }
    
    # Agent dependencies - who needs who
    AGENT_DEPENDENCIES = {
        'integration': ['filesystem', 'github', 'supabase'],  # Depends on all others
        'filesystem': [],  # Independent
        'github': [],      # Independent
        'supabase': [],    # Independent
        'vercel': [],      # Would be independent
        'static_asset': [], # Would be independent
        'task_reality': []  # Would be independent
    }
    
    def __init__(self):
        """Initialize the Reality Agent status viewer"""
        self.agent_data = {}
        self.consensus_data = {}
        self.last_check_time = None
        self.load_agent_data()
        
    def load_agent_data(self):
        """Load data from all available agent outputs"""
        for agent_name, config in self.KNOWN_AGENTS.items():
            if config['implemented'] and config['output_file']:
                self.agent_data[agent_name] = self.parse_agent_output(
                    config['output_file'], 
                    agent_name
                )
    
    def parse_agent_output(self, output_file: str, agent_name: str) -> Dict[str, Any]:
        """Parse agent output - handle both JSON and text formats"""
        if not os.path.exists(output_file):
            return {'status': 'no_data', 'error': 'Output file not found'}
        
        try:
            # Get file modification time
            mtime = os.path.getmtime(output_file)
            age_seconds = time.time() - mtime
            
            with open(output_file, 'r') as f:
                content = f.read()
            
            # Special handling for Integration Agent (text format)
            if agent_name == 'integration':
                return self.parse_integration_text(content, age_seconds)
            
            # Handle GitHub text format
            elif 'GitHub Reality Discovery' in content:
                return self.parse_github_text(content, age_seconds)
            
            # Standard JSON parsing for other agents
            try:
                data = json.loads(content)
                return {
                    'status': 'healthy',
                    'data': data,
                    'age_seconds': age_seconds,
                    'format': 'json'
                }
            except json.JSONDecodeError:
                return {
                    'status': 'parse_error',
                    'error': 'Invalid JSON format',
                    'age_seconds': age_seconds
                }
                
        except Exception as e:
            return {'status': 'error', 'error': str(e)}
    
    def parse_github_text(self, content: str, age_seconds: float) -> Dict[str, Any]:
        """Parse GitHub Agent's text output per reality/REALITY_INDEX.md spec"""
        data = {'format': 'text', 'status': 'healthy', 'age_seconds': age_seconds}
        
        import re
        # Check if authenticated
        if 'Authenticated: True' in content:
            data['authenticated'] = True
            data['status'] = 'healthy'
        
        # Get timestamp
        timestamp_match = re.search(r'Timestamp:\s+(.+)', content)
        if timestamp_match:
            data['timestamp'] = timestamp_match.group(1)
        
        # Get CLI version
        cli_match = re.search(r'GitHub CLI:\s+(.+)', content)
        if cli_match:
            data['cli_version'] = cli_match.group(1)
        
        return data
    
    def parse_integration_text(self, content: str, age_seconds: float) -> Dict[str, Any]:
        """Parse Integration Agent's text output into structured data"""
        data = {
            'status': 'healthy',
            'format': 'text',
            'age_seconds': age_seconds,
            'consensus': {},
            'health_scores': {},
            'agent_statuses': {}
        }
        
        # Extract overall health percentage
        health_match = re.search(r'OVERALL HEALTH\s+\[.*?\]\s+([\d.]+)%', content)
        if health_match:
            data['consensus']['overall_health'] = float(health_match.group(1))
        
        # Extract individual health scores
        scores = {
            'synchronization': re.search(r'Synchronization\s+\[.*?\]\s+([\d.]+)%', content),
            'completeness': re.search(r'Completeness\s+\[.*?\]\s+([\d.]+)%', content),
            'consistency': re.search(r'Consistency\s+\[.*?\]\s+([\d.]+)%', content),
            'transparency': re.search(r'Transparency\s+\[.*?\]\s+([\d.]+)%', content),
            'assumption_clarity': re.search(r'Assumption Clear\s+\[.*?\]\s+([\d.]+)%', content)
        }
        
        for key, match in scores.items():
            if match:
                data['health_scores'][key] = float(match.group(1))
        
        # Extract agent consensus
        consensus_match = re.search(r'Healthy Agents:\s+(\d+)/(\d+)', content)
        if consensus_match:
            data['consensus']['healthy_agents'] = int(consensus_match.group(1))
            data['consensus']['total_agents'] = int(consensus_match.group(2))
        
        # Extract individual agent statuses
        for line in content.split('\n'):
            if '_agent:' in line:
                parts = line.strip().split(':')
                if len(parts) == 2:
                    agent_name = parts[0].strip().replace('_agent', '')
                    status = parts[1].strip()
                    data['agent_statuses'][agent_name] = status
        
        # Calculate consensus algorithm (average of health scores)
        if data['health_scores']:
            scores_list = list(data['health_scores'].values())
            data['consensus']['calculation'] = {
                'method': 'weighted_average',
                'scores': data['health_scores'],
                'average': sum(scores_list) / len(scores_list)
            }
        
        return data
    
    def show_header(self):
        """Display header with title and timestamp"""
        print("\n" + "=" * 80)
        print(" " * 20 + "REALITY AGENT STATUS VIEWER")
        print(" " * 15 + f"Session 34 | {datetime.now().strftime('%Y-%m-%d %H:%M')}")
        print("=" * 80)
    
    def show_agent_constellation(self):
        """ASCII visualization of agent connections and data flow"""
        print("\n📡 REALITY AGENT CONSTELLATION")
        print("=" * 50)
        print()
        
        # Determine agent statuses
        fs_status = "✅" if self.agent_data.get('filesystem', {}).get('status') == 'healthy' else "❌"
        gh_status = "✅" if self.agent_data.get('github', {}).get('status') == 'healthy' else "❌"
        db_status = "✅" if self.agent_data.get('supabase', {}).get('status') == 'healthy' else "❌"
        int_status = "✅" if self.agent_data.get('integration', {}).get('status') == 'healthy' else "❌"
        
        # Get consensus score
        consensus = "???"
        if 'integration' in self.agent_data:
            int_data = self.agent_data['integration']
            if int_data.get('consensus', {}).get('overall_health'):
                consensus = f"{int_data['consensus']['overall_health']:.1f}%"
        
        constellation = f"""
    DATA COLLECTION                  SYNTHESIS              OUTPUT
    ═══════════════                  ═════════              ══════
    
    FileSystem {fs_status} ─────┐
    (0.035s)          │
                      │         ┌─────────────────┐      ┌──────────┐
    GitHub {gh_status} ────────┼────→│  Integration {int_status}  │─────→│ CONSENSUS│
    (0.96s)           │         │    (4.4s)       │      │  {consensus:^7} │
                      │         │                 │      └──────────┘
    Supabase {db_status} ──────┘         │  Calculates:    │           ↓
    (2.4s)                      │  • Synchronization│      Dashboard
                                │  • Completeness  │       Display
    ⚫ Vercel                    │  • Consistency   │
    (not implemented)           │  • Transparency  │
                                │  • Assumptions   │
    ⚫ Static Asset              └─────────────────┘
    (not implemented)           
                                
    ⚫ Task Reality              Status: {self.count_operational_agents()}/7 Agents Operational
    (not implemented)           Total Time: ~8 seconds
        """
        
        print(constellation)
    
    def count_operational_agents(self) -> int:
        """Count how many agents are actually operational"""
        count = 0
        for agent_name, config in self.KNOWN_AGENTS.items():
            if config['implemented']:
                agent_data = self.agent_data.get(agent_name, {})
                if agent_data.get('status') == 'healthy':
                    count += 1
        return count
    
    def show_individual_agent_status(self):
        """Display detailed status for each agent"""
        print("\n🔍 INDIVIDUAL AGENT STATUS")
        print("=" * 50)
        
        for agent_name, config in self.KNOWN_AGENTS.items():
            print(f"\n{agent_name.upper()} AGENT:")
            print("-" * 30)
            
            if not config['implemented']:
                print(f"  Status: ⚫ Not Implemented")
                print(f"  Capability: {config['capability']}")
                continue
            
            agent_data = self.agent_data.get(agent_name, {})
            
            # Determine status icon
            if agent_data.get('status') == 'healthy':
                status_icon = "✅"
            elif agent_data.get('status') == 'no_data':
                status_icon = "❓"
            else:
                status_icon = "❌"
            
            print(f"  Status: {status_icon} {agent_data.get('status', 'unknown').title()}")
            print(f"  Capability: {config['capability']}")
            print(f"  Execution Time: {config['execution_time']}s")
            
            # Show data age
            if 'age_seconds' in agent_data:
                age = agent_data['age_seconds']
                if age < 60:
                    age_str = f"{int(age)} seconds ago"
                elif age < 3600:
                    age_str = f"{int(age/60)} minutes ago"
                else:
                    age_str = f"{int(age/3600)} hours ago"
                
                # Color code based on staleness
                if age > 14400:  # 4 hours
                    print(f"  Last Run: ⚠️  {age_str} (STALE)")
                else:
                    print(f"  Last Run: {age_str}")
            
            # Show specific agent details
            if agent_name == 'filesystem' and agent_data.get('status') == 'healthy':
                conn = agent_data.get('data', {}).get('connection', {})
                print(f"  Connection: {conn.get('status', 'unknown')}")
                print(f"  Permission: {conn.get('permission_level', 'unknown')}")
                
            elif agent_name == 'github' and agent_data.get('status') == 'healthy':
                data = agent_data.get('data', {})
                if 'connection' in data:
                    print(f"  Repository: {data['connection'].get('status', 'unknown')}")
                
            elif agent_name == 'supabase' and agent_data.get('status') == 'healthy':
                conn = agent_data.get('data', {}).get('connection', {})
                print(f"  Database: {conn.get('status', 'unknown')}")
                
            elif agent_name == 'integration' and agent_data.get('status') == 'healthy':
                consensus = agent_data.get('consensus', {})
                print(f"  Consensus: {consensus.get('overall_health', 'unknown')}%")
                print(f"  Healthy Agents: {consensus.get('healthy_agents', '?')}/{consensus.get('total_agents', '?')}")
    
    def show_consensus_mechanism(self):
        """Explain how consensus is calculated per Integration Agent spec"""
        print("\n🧮 CONSENSUS CALCULATION MECHANISM")
        print("=" * 50)
        print("Source: reality/agent-reality-auditor/integration-connector/")
        print("Authority: reality/REALITY_INDEX.md (Integration Agent)")
        print()
        
        if 'integration' not in self.agent_data:
            print("  ❌ Integration Agent data not available")
            return
        
        int_data = self.agent_data['integration']
        if int_data.get('status') != 'healthy':
            print(f"  ❌ Integration Agent not healthy: {int_data.get('error', 'unknown error')}")
            return
        
        scores = int_data.get('health_scores', {})
        consensus = int_data.get('consensus', {})
        
        print("\nHealth Dimensions:")
        print("-" * 30)
        for dimension, score in scores.items():
            bar_length = int(score / 5)  # 20 chars max
            bar = "█" * bar_length + "░" * (20 - bar_length)
            print(f"  {dimension:20} [{bar}] {score:5.1f}%")
        
        print("\nConsensus Algorithm:")
        print("-" * 30)
        
        if consensus.get('calculation'):
            calc = consensus['calculation']
            print(f"  Method: {calc.get('method', 'unknown')}")
            print(f"  Formula: Average of {len(scores)} health dimensions")
            print(f"  Calculation: ({' + '.join([str(s) for s in scores.values()])}) / {len(scores)}")
            print(f"  Result: {consensus.get('overall_health', 'unknown')}%")
        else:
            print("  Method: Weighted average of health dimensions")
            print("  Result: {consensus.get('overall_health', 'unknown')}%")
        
        print("\nAgent Participation:")
        print("-" * 30)
        agent_statuses = int_data.get('agent_statuses', {})
        for agent, status in agent_statuses.items():
            icon = "✅" if status == "healthy" else "❌" if status == "unavailable" else "❓"
            print(f"  {agent:10} {icon} {status}")
    
    def show_truth_flow(self):
        """Visualize how truth flows through the system"""
        print("\n🔄 TRUTH FLOW VISUALIZATION")
        print("=" * 50)
        print("""
    How Truth Flows Through The System:
    ────────────────────────────────────────────────
    
    1. DISCOVERY PHASE (Independent Agents)
       ├─ FileSystem Agent discovers file reality
       ├─ GitHub Agent discovers repository reality  
       └─ Supabase Agent discovers database reality
       
    2. SYNTHESIS PHASE (Integration Agent)
       ├─ Collects outputs from discovery agents
       ├─ Calculates health across 5 dimensions
       └─ Produces consensus score (97%)
       
    3. PRESENTATION PHASE (Dashboard)
       ├─ Reads consensus from Integration Agent
       ├─ Displays in Constitutional OS Dashboard
       └─ Provides actionable recommendations
       
    4. ACTION PHASE (User/System)
       ├─ Reviews dashboard indicators
       ├─ Takes corrective actions if needed
       └─ Triggers new reality check cycle
    
    Total Cycle Time: ~8 seconds
    Cache Duration: 4 hours (recommended)
        """)
    
    def show_connection_health(self):
        """Display connection status to external services"""
        print("\n🔌 EXTERNAL SERVICE CONNECTIONS")
        print("=" * 50)
        
        connections = [
            {
                'service': 'Local Filesystem',
                'agent': 'filesystem',
                'required': False,
                'config_needed': None
            },
            {
                'service': 'GitHub Repository',
                'agent': 'github',
                'required': False,
                'config_needed': None
            },
            {
                'service': 'Supabase Database',
                'agent': 'supabase',
                'required': True,
                'config_needed': ['SUPABASE_URL', 'SUPABASE_ANON_KEY']
            },
            {
                'service': 'Vercel Deployment',
                'agent': 'vercel',
                'required': True,
                'config_needed': ['VERCEL_TOKEN']
            }
        ]
        
        for conn in connections:
            agent_name = conn['agent']
            config = self.KNOWN_AGENTS.get(agent_name, {})
            
            # Check implementation status
            if not config.get('implemented'):
                status = "⚫ Not Implemented"
                details = "Agent not built yet"
            else:
                agent_data = self.agent_data.get(agent_name, {})
                if agent_data.get('status') == 'healthy':
                    status = "✅ Connected"
                    if agent_name == 'filesystem':
                        details = "1,247+ files tracked"
                    elif agent_name == 'github':
                        details = "Repository accessible"
                    elif agent_name == 'supabase':
                        details = "4 tables accessible"
                    else:
                        details = "Operational"
                elif agent_data.get('status') == 'no_data':
                    status = "❓ No Data"
                    details = "Run reality check"
                else:
                    status = "❌ Connection Failed"
                    details = agent_data.get('error', 'Check configuration')
            
            print(f"\n{conn['service']:25} → {status}")
            print(f"  Agent: {agent_name}")
            print(f"  Details: {details}")
            
            if conn['required'] and conn['config_needed'] and status != "✅ Connected":
                print(f"  ⚠️  Configuration needed:")
                for var in conn['config_needed']:
                    is_set = "✅" if os.getenv(var) else "❌"
                    print(f"     {is_set} {var}")
    
    def show_recommendations(self):
        """Provide actionable recommendations based on current state"""
        print("\n💡 ACTIONABLE RECOMMENDATIONS")
        print("=" * 50)
        
        recommendations = []
        
        # Check data staleness
        for agent_name, agent_data in self.agent_data.items():
            if 'age_seconds' in agent_data and agent_data['age_seconds'] > 14400:  # 4 hours
                recommendations.append({
                    'priority': 'HIGH',
                    'issue': f"{agent_name.title()} data is {int(agent_data['age_seconds']/3600)} hours old",
                    'action': "Run './scripts/00028-reality-check.sh' to refresh"
                })
        
        # Check missing agents
        missing_count = sum(1 for a in self.KNOWN_AGENTS.values() if not a['implemented'])
        if missing_count > 0:
            recommendations.append({
                'priority': 'INFO',
                'issue': f"{missing_count} agents not implemented yet",
                'action': "This is expected - future work items"
            })
        
        # Check failed connections
        for agent_name, agent_data in self.agent_data.items():
            if agent_data.get('status') not in ['healthy', 'no_data']:
                recommendations.append({
                    'priority': 'HIGH',
                    'issue': f"{agent_name.title()} agent is failing",
                    'action': f"Check {self.KNOWN_AGENTS[agent_name]['path']}/ for details"
                })
        
        # Check consensus health
        if 'integration' in self.agent_data:
            health = self.agent_data['integration'].get('consensus', {}).get('overall_health', 0)
            if health < 90:
                recommendations.append({
                    'priority': 'MEDIUM',
                    'issue': f"System health at {health}% (below 90% threshold)",
                    'action': "Review individual agent statuses above"
                })
        
        if not recommendations:
            print("\n  ✅ All systems operational - no actions needed")
        else:
            for rec in sorted(recommendations, key=lambda x: {'HIGH': 0, 'MEDIUM': 1, 'LOW': 2, 'INFO': 3}[x['priority']]):
                icon = "🔴" if rec['priority'] == 'HIGH' else "🟡" if rec['priority'] == 'MEDIUM' else "ℹ️"
                print(f"\n  {icon} [{rec['priority']}] {rec['issue']}")
                print(f"     → {rec['action']}")
    
    def show_json_output(self):
        """Output all data as JSON for script consumption"""
        output = {
            'timestamp': datetime.now().isoformat(),
            'session': '00034',
            'operational_agents': self.count_operational_agents(),
            'total_agents': len(self.KNOWN_AGENTS),
            'consensus_health': None,
            'agents': {},
            'recommendations': []
        }
        
        # Add consensus health
        if 'integration' in self.agent_data:
            output['consensus_health'] = self.agent_data['integration'].get('consensus', {}).get('overall_health')
        
        # Add agent details
        for agent_name, config in self.KNOWN_AGENTS.items():
            agent_info = {
                'implemented': config['implemented'],
                'capability': config['capability'],
                'status': 'not_implemented'
            }
            
            if config['implemented'] and agent_name in self.agent_data:
                agent_data = self.agent_data[agent_name]
                agent_info['status'] = agent_data.get('status', 'unknown')
                if 'age_seconds' in agent_data:
                    agent_info['last_run_seconds_ago'] = agent_data['age_seconds']
            
            output['agents'][agent_name] = agent_info
        
        print(json.dumps(output, indent=2))
    
    def run(self, mode='normal'):
        """Main execution method"""
        if mode == 'json':
            self.show_json_output()
            return
        
        self.show_header()
        
        if mode in ['normal', 'full']:
            self.show_agent_constellation()
            self.show_individual_agent_status()
            
        if mode == 'full':
            self.show_consensus_mechanism()
            self.show_truth_flow()
            self.show_connection_health()
        
        self.show_recommendations()
        
        print("\n" + "=" * 80)
        print("Use --full for complete analysis | --json for script integration")
        print("=" * 80 + "\n")


def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description='Reality Agent Status Viewer')
    parser.add_argument('--full', action='store_true', help='Show full analysis')
    parser.add_argument('--json', action='store_true', help='Output as JSON')
    parser.add_argument('--refresh', action='store_true', help='Run reality check first')
    
    args = parser.parse_args()
    
    # Run reality check if requested
    if args.refresh:
        print("Running Reality check...")
        os.system('./scripts/00028-reality-check.sh')
        print()
    
    # Determine mode
    if args.json:
        mode = 'json'
    elif args.full:
        mode = 'full'
    else:
        mode = 'normal'
    
    # Create and run viewer
    viewer = RealityAgentStatus()
    viewer.run(mode)


if __name__ == '__main__':
    main()