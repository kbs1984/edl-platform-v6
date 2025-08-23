---
session: "00008"
type: "documentation"
status: "current"
created: "2025-08-23"
title: "Session 00008 Implementation Part 3: Integration Updates"
purpose: "Document session 00008 implementation part 3: integration updates"
topics: ['session-log', 'documentation']
priority: "P1"
domain: "core"
---

# Session 00008 Implementation Part 3: Integration Updates

## Overview
This document contains EXACT modifications needed to integrate the new Reality Agents with the existing Integration Agent.

## File to Modify
```
reality/agent-reality-auditor/integration-connector/connector.py
```

## Step 1: Add Imports

Find the existing import section (around line 10-30) and ADD these lines:

```python
# Import new Reality Agents (Session 00008)
try:
    from ..vercel_connector.connector import VercelRealityAgent
    vercel_available = True
except ImportError:
    vercel_available = False
    print("Warning: Vercel Reality Agent not available")

try:
    from ..api_contract_connector.connector import APIContractRealityAgent
    contract_available = True
except ImportError:
    contract_available = False
    print("Warning: API Contract Reality Agent not available")
```

## Step 2: Update __init__ Method

Find the `__init__` method of `IntegrationRealityAgent` class and ADD these lines after existing agent initialization:

```python
# Initialize new agents (Session 00008)
self.vercel_agent = None
self.contract_agent = None

if vercel_available:
    try:
        self.vercel_agent = VercelRealityAgent()
        print("✅ Vercel Reality Agent initialized")
    except Exception as e:
        print(f"Warning: Could not initialize Vercel Agent: {e}")
        self.vercel_agent = None

if contract_available:
    try:
        self.contract_agent = APIContractRealityAgent(project_root)
        print("✅ API Contract Reality Agent initialized")
    except Exception as e:
        print(f"Warning: Could not initialize Contract Agent: {e}")
        self.contract_agent = None
```

## Step 3: Update check_integration_health Method

Find the `check_integration_health` method and ADD this code BEFORE the health score calculation:

```python
# Check Vercel Agent (Session 00008)
if self.vercel_agent:
    try:
        vercel_health = self.vercel_agent.discover_level_1()
        if vercel_health.get('connected'):
            # Check for deployment gaps
            vercel_gaps = self.vercel_agent.discover_level_4()
            if vercel_gaps.get('gaps'):
                critical_gaps = len([g for g in vercel_gaps['gaps'] if g['severity'] == 'CRITICAL'])
                if critical_gaps > 0:
                    health_scores['deployment'] = 50  # Degraded if critical gaps
                    agent_statuses['vercel_agent'] = 'degraded'
                else:
                    health_scores['deployment'] = 85  # Minor gaps
                    agent_statuses['vercel_agent'] = 'healthy'
            else:
                health_scores['deployment'] = 100  # Perfect
                agent_statuses['vercel_agent'] = 'healthy'
        else:
            health_scores['deployment'] = 0
            agent_statuses['vercel_agent'] = 'failed'
    except Exception as e:
        print(f"Error checking Vercel Agent: {e}")
        agent_statuses['vercel_agent'] = 'error'
else:
    agent_statuses['vercel_agent'] = 'unavailable'

# Check API Contract Agent (Session 00008)
if self.contract_agent:
    try:
        contract_health = self.contract_agent.discover_level_1()
        if contract_health.get('frontend_accessible') or contract_health.get('backend_accessible'):
            # Check for contract gaps
            contract_gaps = self.contract_agent.discover_level_4()
            alignment_score = contract_gaps.get('alignment_score', 0)
            
            health_scores['contracts'] = alignment_score
            
            if alignment_score >= 90:
                agent_statuses['contract_agent'] = 'healthy'
            elif alignment_score >= 70:
                agent_statuses['contract_agent'] = 'degraded'
            else:
                agent_statuses['contract_agent'] = 'critical'
        else:
            health_scores['contracts'] = 0
            agent_statuses['contract_agent'] = 'failed'
    except Exception as e:
        print(f"Error checking Contract Agent: {e}")
        agent_statuses['contract_agent'] = 'error'
else:
    agent_statuses['contract_agent'] = 'unavailable'
```

## Step 4: Update generate_integration_report Method

Find the `generate_integration_report` method and ADD sections for new agents:

```python
# Add Vercel Agent report section
if self.vercel_agent and agent_statuses.get('vercel_agent') not in ['unavailable', 'error']:
    try:
        vercel_report = self.vercel_agent.generate_deployment_report()
        report['agents']['vercel'] = {
            'status': agent_statuses.get('vercel_agent', 'unknown'),
            'health_score': vercel_report.get('health_score', 0),
            'current_deployment': vercel_report.get('levels', {}).get('current_state', {}).get('production_deployment', {}),
            'gaps': vercel_report.get('levels', {}).get('gaps', {}).get('gaps', [])
        }
    except Exception as e:
        report['agents']['vercel'] = {
            'status': 'error',
            'error': str(e)
        }

# Add API Contract Agent report section
if self.contract_agent and agent_statuses.get('contract_agent') not in ['unavailable', 'error']:
    try:
        contract_report = self.contract_agent.generate_contract_report()
        report['agents']['api_contract'] = {
            'status': agent_statuses.get('contract_agent', 'unknown'),
            'health_score': contract_report.get('health_score', 0),
            'alignment_score': contract_report.get('levels', {}).get('gaps', {}).get('alignment_score', 0),
            'orphaned_calls': contract_report.get('levels', {}).get('gaps', {}).get('orphaned_calls', []),
            'unused_endpoints': contract_report.get('levels', {}).get('gaps', {}).get('unused_endpoints', [])
        }
    except Exception as e:
        report['agents']['api_contract'] = {
            'status': 'error',
            'error': str(e)
        }
```

## Step 5: Update Display Output

Find where the report is printed (in the `if __name__ == "__main__"` section) and ADD display for new agents:

```python
# After existing agent status display, add:

# Vercel Agent status
vercel_status = report['agent_status'].get('vercel_agent', 'unavailable')
if vercel_status != 'unavailable':
    icon = '✅' if vercel_status == 'healthy' else '⚠️' if vercel_status == 'degraded' else '❌'
    print(f"  vercel_agent: {icon} {vercel_status}")
    
    # Show deployment info if available
    if 'vercel' in report.get('agents', {}):
        vercel_data = report['agents']['vercel']
        if 'current_deployment' in vercel_data and vercel_data['current_deployment']:
            deploy = vercel_data['current_deployment']
            print(f"    Deployed: {deploy.get('git_commit', 'unknown')[:7]} ({deploy.get('state', 'unknown')})")
        if 'gaps' in vercel_data and vercel_data['gaps']:
            print(f"    Gaps: {len(vercel_data['gaps'])} deployment issues")

# API Contract Agent status
contract_status = report['agent_status'].get('contract_agent', 'unavailable')
if contract_status != 'unavailable':
    icon = '✅' if contract_status == 'healthy' else '⚠️' if contract_status in ['degraded', 'critical'] else '❌'
    print(f"  contract_agent: {icon} {contract_status}")
    
    # Show contract info if available
    if 'api_contract' in report.get('agents', {}):
        contract_data = report['agents']['api_contract']
        print(f"    Alignment: {contract_data.get('alignment_score', 0):.1f}%")
        if contract_data.get('orphaned_calls'):
            print(f"    Orphaned: {len(contract_data['orphaned_calls'])} API calls")
        if contract_data.get('unused_endpoints'):
            print(f"    Unused: {len(contract_data['unused_endpoints'])} endpoints")
```

## Step 6: Update Health Score Weighting

Find where `overall_health` is calculated and UPDATE the weights to include new agents:

```python
# Update weight calculation to include new agents
if health_scores:
    # Dynamic weighting based on available agents
    weights = {}
    
    # Core agents get higher weight
    if 'filesystem' in health_scores:
        weights['filesystem'] = 0.20
    if 'github' in health_scores:
        weights['github'] = 0.20
    if 'database' in health_scores:
        weights['database'] = 0.20
    
    # New agents (Session 00008)
    if 'deployment' in health_scores:
        weights['deployment'] = 0.20
    if 'contracts' in health_scores:
        weights['contracts'] = 0.20
    
    # Normalize weights to sum to 1.0
    total_weight = sum(weights.values())
    if total_weight > 0:
        weights = {k: v/total_weight for k, v in weights.items()}
    
    # Calculate weighted average
    overall_health = sum(health_scores.get(k, 0) * weights.get(k, 0) 
                        for k in weights.keys())
else:
    overall_health = 0
```

## Step 7: Test Integration

After making all changes:

```bash
# Navigate to integration connector
cd reality/agent-reality-auditor/integration-connector/

# Test the integration
python3 connector.py

# Expected output should now show:
# - More agents (5-6 instead of 3-4)
# - Vercel agent status
# - Contract agent status
# - Updated health score including new agents
```

## Expected Output After Integration

```
============================================================
                 INTEGRATION REALITY REPORT
============================================================

📊 Health Scores:
  Synchronization  [████████████████████] 100.0%
  Completeness     [████████████████████] 100.0%
  Consistency      [████████████████████] 100.0%
  Transparency     [████████████████████] 100.0%
  Assumption Clear [████████████████████] 100.0%

  OVERALL HEALTH   [███████████████████░] 95.0%

🔄 Agent Consensus:
  Healthy Agents: 5/6
  Limited Agents: 0/6
  Failed Agents: 0/6
  fs_agent: ✅ healthy
  gh_agent: ✅ healthy
  db_agent: ⚠️ unavailable
  vercel_agent: ✅ healthy
    Deployed: abc1234 (READY)
  contract_agent: ✅ healthy
    Alignment: 92.5%
    Orphaned: 2 API calls
```

## Troubleshooting

### Import Errors
If you get import errors, check:
1. Directory names are exactly `vercel_connector` and `api_contract_connector` (with underscores, not hyphens)
2. Each directory has `__init__.py` file (can be empty)
3. Each directory has `connector.py` file

### Agents Show as Unavailable
This is normal if:
- The agent directories don't exist yet
- The connector.py files aren't created
- There's a syntax error in the agent code

### Health Score Doesn't Change
Make sure:
- The new health scores are being added to the `health_scores` dictionary
- The weight calculation includes the new agents
- The agents are actually returning health data

## Quick Verification Commands

```bash
# Check if new agents are detected
python3 -c "
from integration_connector.connector import IntegrationRealityAgent
agent = IntegrationRealityAgent()
print('Vercel Agent:', 'Available' if agent.vercel_agent else 'Not Available')
print('Contract Agent:', 'Available' if agent.contract_agent else 'Not Available')
"

# Run full integration test
python3 connector.py

# Check JSON output
python3 connector.py --json > integration_test.json
cat integration_test.json | grep -E "(vercel|contract)_agent"
```

## Next Steps

After successful integration:
1. Verify new agents appear in report
2. Check health score reflects all agents
3. Test with various agent states (some failing)
4. Move to Part 4: Full Validation