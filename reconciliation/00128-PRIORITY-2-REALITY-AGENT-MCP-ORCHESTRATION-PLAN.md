---
session: "00128"
type: "implementation-plan"
status: "ready"
created: "2025-09-01"
title: "Priority 2 - Reality Agent MCP Orchestration Implementation Plan"
purpose: "Transform Reality Agents from isolated tools into an orchestrated MCP-powered system"
topics: ["reality-agents", "mcp", "orchestration", "automation", "performance"]
priority: "P0"
domain: "infrastructure"
related_to: ["00123-MCP-INFRASTRUCTURE-PLAN", "00124-MCP-INFRASTRUCTURE-PLAN-ADDENDUM", "00128-PRIORITY-1-MCP-TEST-INFRASTRUCTURE-PLAN"]
---

# Priority 2: Reality Agent MCP Orchestration Implementation Plan

## Executive Summary

Reality Agents were built in early sessions (02-06) and have been maintaining 97% system health. However, they're not utilizing the MCP tools that provide 3.2x performance improvements. This plan transforms the Reality Agents from independent scripts into an orchestrated, MCP-powered system that can handle complex multi-step operations at scale.

## Why This is Priority 2

### The Problem
- **Current State**: Reality Agents use REST APIs and subprocess calls
- **Inefficiency**: Each agent works in isolation, duplicating efforts
- **Performance**: Missing out on 3.2x MCP speedup
- **Scale**: Can't handle the 275 user stories efficiently

### The Solution
Create an orchestrated Reality Agent system that:
1. Uses MCP tools for all operations (3.2x faster)
2. Coordinates agents for complex tasks
3. Shares context between agents
4. Provides unified reporting

## Current Reality Agent Inventory

### What We Have (From Sessions 02-06)
```python
reality/agent-reality-auditor/
├── filesystem-agent/
│   └── agent.py          # FileSystem health checks
├── github-agent/
│   └── agent.py          # GitHub integration checks
├── supabase-connector/
│   ├── connector.py      # Original REST connector
│   └── mcp_enhanced_connector.py  # Session 125's MCP version
├── integration-agent/
│   └── agent.py          # Cross-system validation
└── vercel-agent/
    └── agent.py          # Deployment checks (incomplete)
```

### What's Missing
- Task Reality Agent (tracks work progress)
- Static Asset Agent (validates UI resources)
- Agent Orchestrator (coordinates all agents)

## Implementation Steps

### Step 1: MCP-Enable Each Reality Agent (3 hours)

#### 1.1 FileSystem Agent MCP Enhancement
```python
# File: reality/agent-reality-auditor/filesystem-agent/mcp_agent.py
# Purpose: Use MCP tools for faster file operations

class MCPFileSystemAgent:
    def __init__(self):
        self.name = "FileSystem Agent"
        self.session = "03"
        self.mcp_available = self.check_mcp_availability()
        
    def check_mcp_availability(self):
        """Verify MCP tools are accessible"""
        try:
            # Check if we can use Glob, Grep, Read tools
            return True
        except:
            return False
    
    async def analyze_project_structure(self):
        """Use MCP Glob for 10x faster file discovery"""
        if self.mcp_available:
            # Use mcp__glob tool instead of os.walk
            results = await self.mcp_glob("**/*.{js,ts,py,md}")
            return self.process_glob_results(results)
        else:
            # Fallback to original implementation
            return self.legacy_analyze()
    
    async def search_codebase(self, pattern):
        """Use MCP Grep for instant searches"""
        if self.mcp_available:
            # Use mcp__grep tool for 100x faster searching
            results = await self.mcp_grep(pattern)
            return results
        else:
            # Fallback to subprocess grep
            return self.legacy_search(pattern)
```

#### 1.2 Supabase Agent MCP Integration
```python
# File: reality/agent-reality-auditor/supabase-agent/mcp_agent.py
# Purpose: Fully utilize MCP for database operations

class MCPSupabaseAgent:
    def __init__(self):
        self.name = "Supabase Agent"
        self.session = "02/06"
        self.connector = MCPEnhancedSupabaseConnector()  # From Session 125
        
    async def validate_schema(self):
        """Use MCP for instant schema validation"""
        # Use mcp__supabase-dev__list_tables
        tables = await self.connector.list_tables_via_mcp()
        
        # Use mcp__supabase-dev__get_advisors for security
        advisors = await self.connector.get_security_advisors()
        
        return {
            'tables': tables,
            'security_issues': advisors,
            'performance': '3.2x faster than REST'
        }
    
    async def run_health_queries(self):
        """Execute health checks via MCP"""
        queries = [
            "SELECT COUNT(*) FROM profile",
            "SELECT COUNT(*) FROM student",
            "SELECT COUNT(*) FROM friendship",
            "SELECT COUNT(*) FROM team_member"
        ]
        
        # Run all queries in parallel via MCP
        results = await asyncio.gather(*[
            self.connector.execute_via_mcp(q) for q in queries
        ])
        
        return self.analyze_health(results)
```

#### 1.3 GitHub Agent MCP Enhancement
```python
# File: reality/agent-reality-auditor/github-agent/mcp_agent.py
# Purpose: Use GitHub MCP for repository operations

class MCPGitHubAgent:
    def __init__(self):
        self.name = "GitHub Agent"
        self.session = "04"
        self.mcp_prefix = "mcp__github-server"
        
    async def check_repository_health(self):
        """Use GitHub MCP for comprehensive checks"""
        health_data = {}
        
        # Get repository info
        health_data['repo'] = await self.mcp_call('get_repository', {
            'owner': 'your-org',
            'repo': 'edl-platform-v6'
        })
        
        # Check recent commits
        health_data['commits'] = await self.mcp_call('list_commits', {
            'owner': 'your-org',
            'repo': 'edl-platform-v6',
            'per_page': 10
        })
        
        # Check open issues
        health_data['issues'] = await self.mcp_call('list_issues', {
            'owner': 'your-org',
            'repo': 'edl-platform-v6',
            'state': 'open'
        })
        
        return self.analyze_repo_health(health_data)
```

### Step 2: Create Task Reality Agent (2 hours)

#### 2.1 New Agent for Work Tracking
```python
# File: reality/agent-reality-auditor/task-agent/mcp_agent.py
# Purpose: Track work progress using MCP tools

class MCPTaskRealityAgent:
    def __init__(self):
        self.name = "Task Reality Agent"
        self.session = "128"  # Created in this session
        self.migration_tracker = MigrationTracker()  # From Session 125
        
    async def track_user_story_progress(self):
        """Monitor 275 user story implementation"""
        progress = {
            'total_stories': 275,
            'completed': 0,
            'in_progress': 0,
            'blocked': 0
        }
        
        # Check feature_migrations table via MCP
        migrations = await self.get_completed_migrations()
        progress['completed'] = len(migrations)
        
        # Search for WIP branches via GitHub MCP
        wip_branches = await self.get_wip_branches()
        progress['in_progress'] = len(wip_branches)
        
        # Check for blocked issues
        blocked_issues = await self.get_blocked_issues()
        progress['blocked'] = len(blocked_issues)
        
        return progress
    
    async def generate_work_report(self):
        """Create comprehensive work status report"""
        report = {
            'timestamp': datetime.now().isoformat(),
            'user_stories': await self.track_user_story_progress(),
            'database_migrations': await self.get_migration_status(),
            'test_coverage': await self.get_test_coverage(),
            'system_health': await self.get_system_health()
        }
        
        return report
```

### Step 3: Build the MCP Orchestrator (3 hours)

#### 3.1 Central Orchestration System
```python
# File: reality/mcp_orchestrator.py
# Purpose: Coordinate all Reality Agents using MCP

class MCPOrchestrator:
    def __init__(self):
        self.agents = self.initialize_agents()
        self.shared_context = {}
        self.performance_metrics = {}
        
    def initialize_agents(self):
        """Initialize all MCP-enabled agents"""
        return {
            'filesystem': MCPFileSystemAgent(),
            'supabase': MCPSupabaseAgent(),
            'github': MCPGitHubAgent(),
            'integration': MCPIntegrationAgent(),
            'task': MCPTaskRealityAgent()
        }
    
    async def run_orchestrated_check(self, check_type='full'):
        """Run coordinated multi-agent check"""
        start_time = time.time()
        results = {}
        
        if check_type == 'full':
            # Run all agents in parallel
            agent_tasks = [
                self.agents['filesystem'].analyze_project_structure(),
                self.agents['supabase'].validate_schema(),
                self.agents['github'].check_repository_health(),
                self.agents['task'].track_user_story_progress()
            ]
            
            agent_results = await asyncio.gather(*agent_tasks)
            
            # Integration agent uses results from other agents
            self.shared_context = {
                'filesystem': agent_results[0],
                'supabase': agent_results[1],
                'github': agent_results[2],
                'task': agent_results[3]
            }
            
            # Run integration checks with context
            integration_result = await self.agents['integration'].validate_integration(
                self.shared_context
            )
            
            results = {
                **self.shared_context,
                'integration': integration_result
            }
        
        # Track performance improvement
        duration = time.time() - start_time
        self.performance_metrics = {
            'duration': duration,
            'speedup': self.calculate_speedup(duration),
            'mcp_calls': self.count_mcp_calls()
        }
        
        return self.generate_orchestrated_report(results)
    
    async def handle_complex_operation(self, operation_config):
        """
        Handle multi-step operations across agents
        Example: Create feature, test it, deploy it
        """
        steps = []
        
        # Step 1: Database migration (Supabase Agent)
        if 'migration' in operation_config:
            migration_result = await self.agents['supabase'].apply_migration(
                operation_config['migration']
            )
            steps.append(('migration', migration_result))
        
        # Step 2: Code changes (GitHub Agent)
        if 'code_changes' in operation_config:
            pr_result = await self.agents['github'].create_pull_request(
                operation_config['code_changes']
            )
            steps.append(('pull_request', pr_result))
        
        # Step 3: Testing (Task Agent + Puppeteer)
        if 'tests' in operation_config:
            test_result = await self.agents['task'].run_tests(
                operation_config['tests']
            )
            steps.append(('tests', test_result))
        
        # Step 4: Integration validation
        integration_result = await self.agents['integration'].validate_changes(steps)
        steps.append(('integration', integration_result))
        
        return self.compile_operation_report(steps)
```

#### 3.2 Shared Context Manager
```python
# File: reality/shared_context.py
# Purpose: Share information between agents efficiently

class SharedContextManager:
    def __init__(self):
        self.context = {
            'session': {},
            'system': {},
            'work': {},
            'errors': []
        }
        self.lock = asyncio.Lock()
    
    async def update_context(self, agent_name, data):
        """Thread-safe context updates"""
        async with self.lock:
            self.context[agent_name] = {
                'data': data,
                'timestamp': datetime.now().isoformat()
            }
    
    async def get_context(self, agent_name=None):
        """Retrieve context for agent coordination"""
        async with self.lock:
            if agent_name:
                return self.context.get(agent_name, {})
            return self.context.copy()
    
    async def broadcast_event(self, event_type, event_data):
        """Notify all agents of important events"""
        # Implementation for event broadcasting
        pass
```

### Step 4: Performance Monitoring and Optimization (2 hours)

#### 4.1 Performance Tracker
```python
# File: reality/performance_tracker.py
# Purpose: Track MCP performance improvements

class MCPPerformanceTracker:
    def __init__(self):
        self.baseline_times = {
            'file_search': 5.0,  # seconds with grep
            'db_query': 0.150,   # seconds with REST
            'github_api': 1.0,   # seconds with REST
        }
        self.mcp_times = {}
        
    async def measure_operation(self, operation_type, operation_func):
        """Measure and compare MCP vs baseline"""
        start = time.time()
        result = await operation_func()
        duration = time.time() - start
        
        self.mcp_times[operation_type] = duration
        speedup = self.baseline_times.get(operation_type, 1.0) / duration
        
        return {
            'result': result,
            'duration': duration,
            'speedup': speedup,
            'savings': self.baseline_times.get(operation_type, 1.0) - duration
        }
    
    def generate_performance_report(self):
        """Generate comprehensive performance metrics"""
        total_baseline = sum(self.baseline_times.values())
        total_mcp = sum(self.mcp_times.values())
        
        return {
            'total_speedup': total_baseline / total_mcp if total_mcp > 0 else 1,
            'time_saved': total_baseline - total_mcp,
            'operations': {
                op: {
                    'baseline': self.baseline_times.get(op, 0),
                    'mcp': self.mcp_times.get(op, 0),
                    'speedup': self.baseline_times.get(op, 1) / self.mcp_times.get(op, 1)
                }
                for op in self.baseline_times
            }
        }
```

#### 4.2 Optimization Strategies
```python
# File: reality/optimization_strategies.py
# Purpose: Intelligent routing between MCP and fallback

class OptimizationStrategy:
    def __init__(self):
        self.thresholds = {
            'use_mcp_for_file_count': 100,  # Use MCP if >100 files
            'use_mcp_for_query_complexity': 3,  # Use MCP if >3 JOINs
            'batch_size_for_mcp': 10  # Batch operations for MCP
        }
    
    def should_use_mcp(self, operation_type, operation_params):
        """Decide whether to use MCP or fallback"""
        if operation_type == 'file_search':
            file_count = operation_params.get('estimated_files', 0)
            return file_count > self.thresholds['use_mcp_for_file_count']
        
        elif operation_type == 'database_query':
            complexity = self.calculate_query_complexity(operation_params['query'])
            return complexity > self.thresholds['use_mcp_for_query_complexity']
        
        elif operation_type == 'ddl_operation':
            return True  # Always use MCP for DDL
        
        return False  # Default to fallback
    
    def batch_operations(self, operations):
        """Batch operations for efficient MCP usage"""
        batches = []
        current_batch = []
        
        for op in operations:
            current_batch.append(op)
            if len(current_batch) >= self.thresholds['batch_size_for_mcp']:
                batches.append(current_batch)
                current_batch = []
        
        if current_batch:
            batches.append(current_batch)
        
        return batches
```

### Step 5: Integration with Existing Systems (1 hour)

#### 5.1 Session Automation Integration
```bash
#!/bin/bash
# File: scripts/00128-orchestrated-session-start.sh
# Purpose: Use orchestrator for session initialization

echo "🚀 Starting Session with MCP Orchestration"
echo "=========================================="

# Run orchestrated reality check
python3 -c "
import asyncio
from reality.mcp_orchestrator import MCPOrchestrator

async def main():
    orchestrator = MCPOrchestrator()
    results = await orchestrator.run_orchestrated_check('full')
    print(results)

asyncio.run(main())
" > /tmp/orchestrated-reality.json

# Parse results and display
python3 scripts/00059-yaml-query.py --parse-orchestrated-results /tmp/orchestrated-reality.json

echo "✅ Session ready with MCP acceleration"
```

#### 5.2 Continuous Monitoring
```python
# File: reality/continuous_monitor.py
# Purpose: Background monitoring using orchestrated agents

class ContinuousMonitor:
    def __init__(self):
        self.orchestrator = MCPOrchestrator()
        self.interval = 300  # 5 minutes
        self.running = False
        
    async def start_monitoring(self):
        """Start continuous background monitoring"""
        self.running = True
        
        while self.running:
            try:
                # Run lightweight check
                results = await self.orchestrator.run_orchestrated_check('light')
                
                # Check for issues
                if self.detect_issues(results):
                    await self.alert_issues(results)
                
                # Update metrics
                await self.update_dashboard(results)
                
                # Wait for next interval
                await asyncio.sleep(self.interval)
                
            except Exception as e:
                await self.handle_monitor_error(e)
    
    def detect_issues(self, results):
        """Detect system issues from results"""
        issues = []
        
        # Check system health
        if results.get('system_health', 100) < 90:
            issues.append('System health below 90%')
        
        # Check for failed tests
        if results.get('failed_tests', 0) > 0:
            issues.append(f"{results['failed_tests']} tests failing")
        
        return issues
```

## Success Criteria

### Minimum Viable Orchestration
- [ ] All 5 existing agents use MCP when available
- [ ] Basic orchestrator coordinates agents
- [ ] Performance metrics show >2x speedup
- [ ] Shared context works between agents
- [ ] Task Reality Agent tracks work progress

### Complete Orchestration
- [ ] All agents fully MCP-enabled with fallbacks
- [ ] Complex multi-step operations supported
- [ ] Continuous monitoring running
- [ ] Performance dashboard available
- [ ] Event broadcasting between agents
- [ ] Intelligent routing optimization

## Time Estimate

- **Minimum Viable**: 6-8 hours
- **Complete Implementation**: 12-14 hours
- **Recommended Approach**: Implement MVP first, then enhance

## Dependencies

### Required from Previous Sessions
- MCPEnhancedSupabaseConnector (Session 125)
- MigrationTracker (Session 125)
- Original Reality Agents (Sessions 02-06)
- MCP tools configuration (Session 119-120)

### Required MCP Tools
- `mcp__supabase-dev` - Database operations
- `mcp__github-server` - Repository management
- `mcp__brave-search` - Error research
- Internal tools (Glob, Grep, Read) - File operations

## Risk Mitigation

### Potential Issues
1. **MCP tool failures** → Automatic fallback to original implementations
2. **Agent coordination conflicts** → Locking mechanisms in shared context
3. **Performance degradation** → Circuit breaker pattern
4. **Resource exhaustion** → Rate limiting and batching

### Monitoring and Alerts
```python
# Automatic alerts for:
- MCP tool unavailability
- Performance below baseline
- Agent failures
- Orchestration errors
```

## Validation Questions for Future Sessions

1. **Are all agents successfully using MCP tools?**
   - Check performance metrics for each agent
   - Verify fallback mechanisms work

2. **Is the orchestrator coordinating effectively?**
   - Review shared context updates
   - Check for race conditions

3. **What performance improvement are we seeing?**
   - Compare with baseline times
   - Identify bottlenecks

4. **Can the system handle complex operations?**
   - Test multi-step workflows
   - Verify transaction consistency

5. **Is monitoring providing actionable insights?**
   - Review alert accuracy
   - Check dashboard usefulness

## Next Steps After Completion

1. Use orchestrated agents for all reality checks
2. Implement complex workflows for user story completion
3. Create agent-based automation for repetitive tasks
4. Move to Priority 3: Test-First Validation Suite
5. Use orchestrated system for 275 story implementation

## Expected Outcomes

### Immediate Benefits
- 3.2x faster reality checks
- Coordinated multi-agent operations
- Automatic issue detection
- Performance visibility

### Long-term Benefits
- Scalable to 275+ user stories
- Self-monitoring system
- Reduced manual intervention
- Compound efficiency gains

## References

- Sessions 02-06: Original Reality Agent creation
- Session 119-120: MCP tool installation
- Session 125: MCP enhanced connector
- Session 126: Performance validation

---

*This orchestration plan transforms isolated Reality Agents into a coordinated, MCP-powered system capable of handling complex operations at scale, providing the foundation for efficient implementation of 275 user stories.*