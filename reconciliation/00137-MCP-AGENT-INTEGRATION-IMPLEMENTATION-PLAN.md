---
session: "00137"
type: "implementation-plan"
status: "proposed"
created: "2025-09-02"
title: "MCP-Agent Integration Implementation Plan - Hybrid Approach"
purpose: "Practical plan to integrate Reality Agents with MCP infrastructure"
topics: ["mcp", "reality-agents", "integration", "orchestration", "hybrid-architecture"]
priority: "P0"
domain: "reconciliation"
fixes: ["mcp-agent-gap", "orchestration-failures", "tool-integration"]
time_estimate: "8-12 hours total"
---

# MCP-Agent Integration Implementation Plan - Hybrid Approach

## Executive Summary

Instead of wrapping each of the 7 Reality Agents as individual MCP servers, create a **single MCP Reality Server** that acts as a gateway to all agents. This reduces complexity while achieving the automation benefits.

---

## Current State Analysis

### What We Have Now
```yaml
MCP Servers (Working):
- mcp__supabase-dev ✅
- mcp__github-server ✅
- mcp__brave-search ✅
- mcp__puppeteer-mcp ⚠️ (problematic)
- mcp__sequential-thinking ✅

Reality Agents (Python):
- filesystem-connector ✅
- supabase-connector ✅ (but uses MCP internally)
- github-connector ❌ (not loading)
- integration-connector ❌ (missing assumption_detector)
- static-asset-connector ❌ (not loading)
- task-connector ❌ (not loading)
- vercel-connector ❌ (not loading)

Current Flow:
1. Python orchestrator.py imports agents
2. Agents run as Python modules
3. Some agents call MCP functions internally
4. No unified interface
```

### Problems with Current Architecture
1. **Two parallel systems** - MCP and Python agents
2. **Manual orchestration** - Can't call agents as tools
3. **5/7 agents broken** - Dependencies and imports failing
4. **No automation** - Can't leverage from Claude directly

---

## Proposed Hybrid Architecture

### Design Philosophy
**"One Gateway, Many Agents"**

Instead of 7 MCP servers, create 1 MCP server that wraps all agents:

```
Claude Code
    ↓
mcp__reality-server (single MCP server)
    ↓
Reality Gateway (Python)
    ├── filesystem-connector
    ├── supabase-connector
    ├── github-connector
    ├── integration-connector
    ├── static-asset-connector
    ├── task-connector
    └── vercel-connector
```

### Key Benefits
1. **Single configuration point** - One entry in ~/.claude.json
2. **Unified interface** - All agents through one gateway
3. **Easier maintenance** - Fix agents without touching MCP
4. **Progressive enhancement** - Add agents incrementally
5. **Tool aggregation** - One tool with subcommands

---

## Implementation Plan

### Phase 1: Create MCP Reality Server (4 hours)

#### Step 1.1: Create Server Structure
```bash
mkdir -p /home/b4sho/mcp-servers/reality-server
cd /home/b4sho/mcp-servers/reality-server
```

#### Step 1.2: Create package.json
```json
{
  "name": "mcp-reality-server",
  "version": "1.0.0",
  "description": "MCP server wrapping EDL Reality Agents",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "latest",
    "python-shell": "^3.0.0"
  }
}
```

#### Step 1.3: Create index.js
```javascript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { PythonShell } from 'python-shell';

const server = new Server({
  name: 'reality-server',
  version: '1.0.0',
});

// Tool: Run Reality Agent
server.setRequestHandler('tools/call', async (request) => {
  if (request.params.name === 'mcp__reality-server__run_agent') {
    const { agent, operation, params } = request.params.arguments;
    
    // Call Python gateway
    const options = {
      mode: 'json',
      pythonPath: 'python3',
      scriptPath: '/home/b4sho/edl-projects-with-claude/edl-platform-v6/reality',
      args: [agent, operation, JSON.stringify(params)]
    };
    
    return new Promise((resolve, reject) => {
      PythonShell.run('agent_gateway.py', options, (err, results) => {
        if (err) reject(err);
        else resolve({ content: results });
      });
    });
  }
});

// Tool: Orchestrate All Agents
server.setRequestHandler('tools/call', async (request) => {
  if (request.params.name === 'mcp__reality-server__orchestrate') {
    // Run orchestrator.py
    const options = {
      mode: 'json',
      pythonPath: 'python3',
      scriptPath: '/home/b4sho/edl-projects-with-claude/edl-platform-v6/reality/agent-reality-auditor'
    };
    
    return new Promise((resolve, reject) => {
      PythonShell.run('orchestrator.py', options, (err, results) => {
        if (err) reject(err);
        else resolve({ content: results });
      });
    });
  }
});

// List available tools
server.setRequestHandler('tools/list', async () => {
  return {
    tools: [
      {
        name: 'mcp__reality-server__run_agent',
        description: 'Run a specific Reality Agent operation',
        inputSchema: {
          type: 'object',
          properties: {
            agent: {
              type: 'string',
              enum: ['filesystem', 'supabase', 'github', 'integration', 'static-asset', 'task', 'vercel']
            },
            operation: { type: 'string' },
            params: { type: 'object' }
          },
          required: ['agent', 'operation']
        }
      },
      {
        name: 'mcp__reality-server__orchestrate',
        description: 'Run full Reality Agent orchestration with health checks',
        inputSchema: {
          type: 'object',
          properties: {
            check_syndrome: { type: 'boolean', default: true },
            check_performance: { type: 'boolean', default: true }
          }
        }
      }
    ]
  };
});

const transport = new StdioServerTransport();
server.connect(transport);
```

#### Step 1.4: Create Python Gateway
```python
# reality/agent_gateway.py
"""
Gateway for MCP to Reality Agent communication
Session 137: Unified interface for all agents
"""

import sys
import json
import importlib.util
from pathlib import Path

class AgentGateway:
    def __init__(self):
        self.agents_dir = Path(__file__).parent / 'agent-reality-auditor'
        self.agents = {}
        
    def load_agent(self, agent_name):
        """Load a specific agent dynamically"""
        if agent_name in self.agents:
            return self.agents[agent_name]
            
        agent_path = self.agents_dir / f"{agent_name}-connector" / "connector.py"
        if not agent_path.exists():
            raise FileNotFoundError(f"Agent {agent_name} not found")
            
        # Dynamic import
        spec = importlib.util.spec_from_file_location(f"{agent_name}_connector", agent_path)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        
        # Find connector class
        for item_name in dir(module):
            if 'Connector' in item_name:
                connector_class = getattr(module, item_name)
                self.agents[agent_name] = connector_class()
                return self.agents[agent_name]
                
    def run_operation(self, agent_name, operation, params):
        """Run an operation on an agent"""
        agent = self.load_agent(agent_name)
        
        if hasattr(agent, operation):
            method = getattr(agent, operation)
            result = method(**params) if params else method()
            return {"success": True, "result": result}
        else:
            return {"success": False, "error": f"Operation {operation} not found"}

if __name__ == "__main__":
    gateway = AgentGateway()
    
    # Parse command line arguments
    agent = sys.argv[1]
    operation = sys.argv[2]
    params = json.loads(sys.argv[3]) if len(sys.argv) > 3 else {}
    
    # Run and return result
    result = gateway.run_operation(agent, operation, params)
    print(json.dumps(result))
```

### Phase 2: Fix Broken Agents (2 hours)

#### Step 2.1: Fix integration-connector
```bash
# Install missing dependency
pip install assumption-detector
# OR stub the module if it's custom
```

#### Step 2.2: Fix import issues in other connectors
- Review each connector's imports
- Install missing dependencies
- Fix relative import paths

#### Step 2.3: Create health check for each agent
```python
# Add to each connector.py
def health_check(self):
    """Verify agent is operational"""
    return {"status": "healthy", "version": "1.0"}
```

### Phase 3: Update Claude Configuration (1 hour)

#### Step 3.1: Add to ~/.claude.json
```json
{
  "mcpServers": {
    "reality-server": {
      "command": "node",
      "args": ["/home/b4sho/mcp-servers/reality-server/index.js"],
      "description": "Reality Agents unified gateway"
    }
  }
}
```

#### Step 3.2: Test from Claude
```python
# Should be able to call:
mcp__reality-server__orchestrate()
mcp__reality-server__run_agent(agent="filesystem", operation="health_check")
```

### Phase 4: Enhance Orchestrator (2 hours)

#### Step 4.1: Add JSON output mode
```python
# orchestrator.py modifications
def run(self, output_format='json'):
    """Run orchestration with configurable output"""
    if output_format == 'json':
        return json.dumps(self.results)
    else:
        # Current print format
```

#### Step 4.2: Add specific operations
```python
def check_95_syndrome(self, feature):
    """Check specific feature for 95% syndrome"""
    # Returns structured result
    
def check_migration_status(self):
    """Check truth-seed to active-work migration"""
    # Returns comparison result
```

### Phase 5: Create Test Suite (1 hour)

#### Step 5.1: Integration tests
```python
# test_mcp_reality_integration.py
def test_orchestration_via_mcp():
    """Test that orchestration works through MCP"""
    result = mcp__reality-server__orchestrate()
    assert result['health'] > 60
    
def test_individual_agent_call():
    """Test individual agent operations"""
    result = mcp__reality-server__run_agent(
        agent="supabase",
        operation="list_tables"
    )
    assert result['success']
```

---

## Migration Strategy

### Step 1: Parallel Running (Safe)
- Keep existing Python orchestrator working
- Add MCP server alongside
- Test both paths work

### Step 2: Gradual Migration
- Start using MCP for new operations
- Keep Python for critical paths
- Monitor performance differences

### Step 3: Full Cutover
- Once stable, use MCP exclusively
- Python remains as fallback
- Document lessons learned

---

## Success Metrics

### Immediate (Phase 1-2)
- [ ] MCP Reality Server responds to calls
- [ ] All 7 agents load successfully
- [ ] Health check returns >60%

### Short Term (Phase 3-4)
- [ ] Can orchestrate from Claude directly
- [ ] 95% syndrome detection automated
- [ ] Performance metrics tracked

### Long Term (Phase 5+)
- [ ] 3.2x speed improvement verified
- [ ] All 275 user stories buildable via MCP
- [ ] Full automation achieved

---

## Risk Mitigation

### Risk 1: Breaking existing functionality
**Mitigation**: Parallel implementation, don't remove Python path

### Risk 2: Performance overhead
**Mitigation**: Benchmark before/after, optimize hot paths

### Risk 3: Complex debugging
**Mitigation**: Comprehensive logging at gateway level

### Risk 4: Agent failures cascade
**Mitigation**: Graceful degradation, partial results OK

---

## Alternative Approach (If Hybrid Fails)

If the hybrid approach proves too complex, fall back to:

### Direct MCP Enhancement
Instead of wrapping agents, enhance the existing MCP servers:

1. **Extend mcp__supabase-dev**
   - Add Reality Agent operations
   - Include health checks
   - Add 95% syndrome detection

2. **Create mcp__edl-platform**
   - Platform-specific operations
   - Orchestration commands
   - Migration validation

3. **Keep agents as utilities**
   - Called by MCP servers
   - Not exposed directly
   - Internal implementation detail

---

## Recommended Next Steps

1. **Validate approach** with stakeholder (you)
2. **Start with Phase 1** - Create basic MCP server
3. **Fix one agent** as proof of concept
4. **Test integration** before proceeding
5. **Document thoroughly** for future sessions

## Time Estimate

- Phase 1: 4 hours (MCP server creation)
- Phase 2: 2 hours (fix broken agents)
- Phase 3: 1 hour (configuration)
- Phase 4: 2 hours (enhance orchestrator)
- Phase 5: 1 hour (testing)
- Buffer: 2 hours

**Total: 12 hours** (6 sessions at 2 hours each)

---

## Conclusion

The hybrid "One Gateway, Many Agents" approach balances the benefits of MCP integration with practical implementation concerns. It provides a path to full automation while maintaining the existing Python infrastructure as a fallback.

This plan turns the Reality Agents from isolated Python scripts into a unified, tool-accessible service that can accelerate building the remaining 70% of the platform.

---

*Implementation Plan Ready - Awaiting Approval*