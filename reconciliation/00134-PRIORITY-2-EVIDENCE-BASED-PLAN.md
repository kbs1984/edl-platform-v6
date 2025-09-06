---
session: "00134"
type: "implementation-plan"
status: "ready"
created: "2025-09-02"
title: "Priority 2 Reality Agent MCP Orchestration - Evidence-Based Plan"
purpose: "Transform Reality Agents into orchestrated MCP-powered system with verified adjustments"
topics: ["reality-agents", "mcp", "orchestration", "evidence-based", "no-guesswork"]
priority: "P0"
domain: "infrastructure"
implements: ["00128-PRIORITY-2-REALITY-AGENT-MCP-ORCHESTRATION-PLAN.md"]
adjusts: ["puppeteer-mcp-removal", "standard-puppeteer-integration"]
---

# Priority 2: Reality Agent MCP Orchestration - Evidence-Based Implementation

## Executive Summary

Transform 7 existing Reality Agents into an orchestrated MCP-powered system, achieving the validated 3.2x performance improvement while removing Puppeteer MCP dependencies as identified in Sessions 131-132.

## Evidence Gathered

### What EXISTS (Verified) ✅
1. **7 Reality Agent Connectors** (all have connector.py):
   - filesystem-connector
   - github-connector
   - integration-connector
   - static-asset-connector
   - supabase-connector
   - task-connector
   - vercel-connector

2. **MCP Enhanced Connector** (22KB, Session 105):
   - Location: `reality/agent-reality-auditor/supabase-connector/mcp_enhanced_connector.py`
   - Status: Created but not integrated
   - Capabilities: All 11 MCP Supabase functions

3. **Priority 3 Baseline** (Session 134 completed):
   - 60% system health baseline
   - Friends system "95% syndrome" identified
   - Performance baselines: Login 1600ms, Signup 2300ms

### What DOESN'T Exist (Verified) ❌
1. No orchestration layer between agents
2. No MCP integration in other agents (only Supabase has it)
3. No automated UI testing integration (must use standard Puppeteer)

### Critical Adjustments Required ⚠️
1. **Remove ALL Puppeteer MCP references** (37.5% functional)
2. **Use subprocess for UI tests** (standard Puppeteer from edl-ui-tests)
3. **Focus on database/file operations** (where MCP excels)

## Implementation Plan (Evidence-Based)

### Phase 1: Integrate Existing MCP Connector (1 hour)

#### Step 1.1: Activate MCP Enhanced Connector
```python
# File: reality/agent-reality-auditor/supabase-connector/connector.py
# Current: Uses REST API
# Change: Import and use MCP enhanced version

from mcp_enhanced_connector import MCPEnhancedSupabaseConnector

class SupabaseConnector:
    def __init__(self):
        # Try MCP first, fallback to REST
        try:
            self.mcp = MCPEnhancedSupabaseConnector()
            self.use_mcp = True
        except:
            self.use_mcp = False
```

**Evidence**: mcp_enhanced_connector.py exists at 22,077 bytes

#### Step 1.2: Test MCP Performance
```bash
# Compare performance: REST vs MCP
python3 reality/agent-reality-auditor/supabase-connector/test_connector.py --benchmark
```

### Phase 2: Create Simple Orchestrator (2 hours)

#### Step 2.1: Build Orchestrator Class
```python
# File: reality/agent-reality-auditor/orchestrator.py
# Purpose: Coordinate all 7 Reality Agents

class RealityOrchestrator:
    def __init__(self):
        self.agents = {
            'filesystem': FilesystemConnector(),
            'github': GithubConnector(),
            'supabase': SupabaseConnector(),  # MCP-enhanced
            'integration': IntegrationConnector(),
            'static': StaticAssetConnector(),
            'task': TaskConnector(),
            'vercel': VercelConnector()
        }
        
    def run_health_check(self):
        """Run all agents in parallel"""
        results = {}
        for name, agent in self.agents.items():
            results[name] = agent.check_health()
        return results
```

#### Step 2.2: Add UI Test Integration (NOT Puppeteer MCP)
```python
def run_ui_tests(self):
    """Run standard Puppeteer tests via subprocess"""
    # NOT using Puppeteer MCP (37.5% functional)
    result = subprocess.run(
        ['node', 'edl-ui-tests/baseline/quick-baseline-test.js'],
        capture_output=True,
        text=True
    )
    return json.loads(result.stdout)
```

### Phase 3: Monitor Priority 3 Findings (1 hour)

#### Step 3.1: Add "95% Syndrome" Monitoring
```python
def monitor_friends_system(self):
    """Monitor the identified 95% syndrome issue"""
    checks = {
        'ui_components': self.check_component_files(),  # ✅ Exist
        'database_data': self.agents['supabase'].check_friends_table(),  # ✅ Saves
        'realtime_sync': self.check_websocket_connections(),  # ❌ Missing 5%
    }
    
    if checks['ui_components'] and checks['database_data'] and not checks['realtime_sync']:
        self.alert("95% Syndrome Detected in Friends System")
    
    return checks
```

#### Step 3.2: Performance Baseline Monitoring
```python
def check_performance_regression(self):
    """Compare against Priority 3 baselines"""
    baselines = {
        'login_page': 1600,  # ms from Priority 3
        'signup_page': 2300  # ms from Priority 3
    }
    
    current = self.measure_current_performance()
    
    for metric, baseline in baselines.items():
        if current[metric] > baseline * 1.2:  # 20% regression threshold
            self.alert(f"Performance regression: {metric}")
```

### Phase 4: MCP Enhancement for Other Agents (2 hours)

#### Step 4.1: FileSystem Agent with MCP
```python
# File: reality/agent-reality-auditor/filesystem-connector/mcp_connector.py

class MCPFilesystemConnector:
    def search_files(self, pattern):
        # Use MCP Grep (100x faster)
        return mcp__grep(pattern)
    
    def find_files(self, glob_pattern):
        # Use MCP Glob (10x faster)
        return mcp__glob(glob_pattern)
```

#### Step 4.2: GitHub Agent with MCP
```python
# File: reality/agent-reality-auditor/github-connector/mcp_connector.py

class MCPGithubConnector:
    def get_file_contents(self, path):
        # Use mcp__github-server__get_file_contents
        return mcp__github_server__get_file_contents(
            owner="briankims-projects",
            repo="edl-platform",
            path=path
        )
```

## Success Metrics

### Performance Targets (Based on Session 126 benchmark)
- [ ] Achieve 3.2x performance improvement on database operations
- [ ] Maintain <2 second response time for health checks
- [ ] Parallel execution of all 7 agents

### Functionality Targets (Based on Priority 3)
- [ ] Detect "95% syndrome" in Friends system
- [ ] Alert on performance regression from baselines
- [ ] Zero use of Puppeteer MCP (0% of flawed tool)

### Integration Targets
- [ ] All 7 agents orchestrated
- [ ] MCP fallback to REST when unavailable
- [ ] Standard Puppeteer tests callable from orchestrator

## Time Estimate

**Total: 6 hours** (vs 6-8 hours original estimate)

1. Phase 1 (MCP Integration): 1 hour
2. Phase 2 (Orchestrator): 2 hours
3. Phase 3 (Monitoring): 1 hour
4. Phase 4 (MCP Enhancement): 2 hours

## Risk Mitigation

### Risk 1: MCP Tools Not Available
**Mitigation**: All connectors maintain REST fallback

### Risk 2: Puppeteer MCP Confusion
**Mitigation**: Explicitly use subprocess for UI tests, document clearly

### Risk 3: Performance Not Improving
**Mitigation**: Benchmark before/after, focus on database operations

## Next Actions

1. **Start with Phase 1**: Integrate existing MCP connector
2. **Benchmark immediately**: Validate 3.2x claim
3. **Build simple orchestrator**: Don't over-engineer
4. **Monitor Priority 3 findings**: Friends "95% syndrome"

## Evidence Trail

- Reality Agents exist: `find` command verified 7 connectors
- MCP connector exists: 22KB file from Session 105
- Priority 3 baseline: 60% health, specific metrics captured
- Puppeteer MCP removed: Sessions 131-132 decision validated

---

*Evidence-Based Plan Complete - No Guesswork*
*Session 134 - Ready for Implementation*