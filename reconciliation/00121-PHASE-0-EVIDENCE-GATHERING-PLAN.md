---
session: "00121"
type: "plan"
status: "proposed"
created: "2025-08-31"
modified: "2025-08-31"
title: "Phase 0: Evidence Gathering Plan - MCP-Agent Integration"
purpose: "Systematic evidence collection before any implementation to avoid assumption-based development"
topics: ["evidence-gathering", "mcp", "reality-agents", "baseline-measurement", "verification"]
priority: "P0"
domain: "reconciliation"
for_sessions: ["00121", "00122"]
requires_approval: ["00122"]
anti_guesswork: true
---

# Phase 0: Evidence Gathering Plan - MCP-Agent Integration

## Executive Summary

After Session 122's critical review exposed major assumptions in the original implementation plan, this Phase 0 plan focuses on systematic evidence collection. We must verify current reality before making any changes to avoid the guesswork trap that affected Sessions 83, 87, and 88.

## Constitutional Compliance

This plan follows the anti-guesswork protocol:
- No assumptions about system state
- Direct measurement of current performance
- Verification of all claimed capabilities
- Documentation of actual vs theoretical benefits

## Evidence Collection Objectives

### Primary Questions to Answer
1. What MCP integration already exists and how well does it work?
2. What are the actual performance characteristics of current Reality Agents?
3. Which MCP servers are operational and what tools do they provide?
4. Where are the real bottlenecks that need optimization?
5. What gaps exist that justify new development?

## Phase 0 Tasks

### Task 1: Current State Audit (45 minutes)

#### 1.1 Directory Structure Reality Check (10 min)
**Objective**: Map actual Reality Agent file system structure

**Session 121 Actions:**
```bash
# Find all Reality Agent related directories
find . -name "*reality*" -type d 2>/dev/null
find . -name "*agent*" -type d 2>/dev/null
find . -path "*reality*" -name "*.py" | head -20

# Document current location and structure
pwd
ls -la
find . -name "connector.py" -type f | head -10
```

**Evidence to Collect:**
- Actual directory paths
- Which connectors exist where
- File naming patterns
- Project structure reality vs assumptions

**Session 122 Validation:**
- [ ] Directory structure documented accurately
- [ ] All connector locations identified
- [ ] No assumptions about missing directories
- [ ] Clear map of existing vs expected structure

#### 1.2 Existing MCP Integration Audit (20 min)
**Objective**: Catalog all existing MCP integration work

**Session 121 Actions:**
```bash
# Find all MCP-related files
find . -name "*mcp*" -type f 2>/dev/null
grep -r "mcp" . --include="*.py" | head -20
grep -r "MCP" . --include="*.py" | head -20

# Check Session 105's MCP integration
find . -name "*105*" -type f | grep -i mcp
```

**Evidence to Collect:**
- Complete list of existing MCP integration files
- Session 105's actual implementation status
- Other sessions' MCP work
- Integration patterns already established

**Session 122 Validation:**
- [ ] All MCP integration work identified
- [ ] Session 105 work status confirmed
- [ ] No duplicate work proposed
- [ ] Existing patterns documented

#### 1.3 Reality Agent Functionality Test (15 min)
**Objective**: Test current Reality Agent functionality and measure performance

**Session 121 Actions:**
```bash
# Test current GitHub connector (we know this exists)
pwd # Confirm we're in github-connector
time python3 connector.py --level 1 --verbose 2>&1 | head -30
time python3 connector.py --level 2 --verbose 2>&1 | head -30
time python3 connector.py --level 3 --verbose 2>&1 | head -30

# Test individual operations for baseline
time gh pr list --limit 10
time gh issue list --limit 10
time gh repo view --json name,description
```

**Evidence to Collect:**
- Actual performance times for each operation
- Success/failure rates of current operations
- Error patterns and limitations
- Quality of data returned

**Session 122 Validation:**
- [ ] Performance measurements are real, not estimated
- [ ] Multiple operations tested for baseline
- [ ] Error cases documented
- [ ] Current functionality confirmed working

### Task 2: MCP Server Status Verification (30 minutes)

#### 2.1 MCP Server Discovery (15 min)
**Objective**: Determine which MCP servers are actually available

**Session 121 Actions:**
```bash
# Try to determine MCP server availability
# Note: We cannot run "claude mcp list" in this environment
# We need to test indirect methods

# Check if MCP server files exist
find ~/ -name "*mcp*" -type d 2>/dev/null | grep -v ".cache"
ls -la ~/.claude* 2>/dev/null
find /home/b4sho/mcp-servers/ -name "*.js" 2>/dev/null | head -10

# Look for MCP configuration evidence
find . -name "*.json" | xargs grep -l "mcp" 2>/dev/null
find . -name "*.md" | xargs grep -l "MCP" 2>/dev/null | head -10
```

**Evidence to Collect:**
- MCP server installation locations
- Configuration files present
- Documentation mentioning operational status
- Last session reports on MCP functionality

**Session 122 Validation:**
- [ ] MCP server locations documented
- [ ] Configuration files identified
- [ ] Operational status evidence collected
- [ ] No assumptions about server availability

#### 2.2 Test Existing MCP Integration (15 min)
**Objective**: Test Session 105's existing MCP integration

**Session 121 Actions:**
```bash
# Find and test Session 105's MCP connector
# We found this exists: mcp_enhanced_connector.py

# Navigate to correct location if found
find . -name "mcp_enhanced_connector.py" -type f
if [ $? -eq 0 ]; then
    # Test the existing MCP integration
    python3 -c "
    import sys
    sys.path.append('.')
    try:
        from mcp_enhanced_connector import MCPEnhancedSupabaseConnector
        connector = MCPEnhancedSupabaseConnector()
        print('MCP Enhanced Connector loads successfully')
        print(f'MCP Available: {connector.mcp_available}')
        print(f'Capabilities: {connector.mcp_capabilities}')
    except Exception as e:
        print(f'Error loading MCP connector: {e}')
    "
fi
```

**Evidence to Collect:**
- Whether Session 105's MCP connector loads
- Current MCP availability status
- Actual capabilities vs theoretical
- Any error messages or limitations

**Session 122 Validation:**
- [ ] Existing MCP integration tested, not assumed
- [ ] Actual capabilities documented
- [ ] Error cases identified
- [ ] Integration readiness assessed

### Task 3: Performance Baseline Establishment (45 minutes)

#### 3.1 Current Operation Benchmarks (25 min)
**Objective**: Establish actual performance baselines for improvement targeting

**Session 121 Actions:**
```bash
# Create comprehensive performance benchmark
cat > benchmark_current_operations.sh << 'EOF'
#!/bin/bash

echo "=== GITHUB OPERATIONS BENCHMARK ==="
echo "Date: $(date)"
echo "Location: $(pwd)"

# Test multiple GitHub operations with timing
echo -e "\n1. PR List Operations:"
for i in {1..3}; do
    echo "Run $i:"
    time gh pr list --limit 10 2>&1 | head -5
done

echo -e "\n2. Issue List Operations:"
for i in {1..3}; do
    echo "Run $i:"
    time gh issue list --limit 10 2>&1 | head -5
done

echo -e "\n3. Repository View Operations:"
for i in {1..3}; do
    echo "Run $i:"
    time gh repo view --json name,description 2>&1
done

echo -e "\n4. Full Reality Agent Discovery:"
for i in {1..2}; do
    echo "Run $i (Level 3):"
    time python3 connector.py --level 3 --verbose 2>&1 | tail -5
done
EOF

chmod +x benchmark_current_operations.sh
./benchmark_current_operations.sh
```

**Evidence to Collect:**
- Multiple runs of each operation for statistical validity
- Variance in timing across runs
- Identification of slowest operations
- Baseline data for improvement measurement

**Session 122 Validation:**
- [ ] Multiple measurements taken, not single samples
- [ ] Statistical validity in timing data
- [ ] Slowest operations identified with evidence
- [ ] Baseline clearly established for comparison

#### 3.2 Bottleneck Identification (20 min)
**Objective**: Identify specific operations that would benefit most from MCP acceleration

**Session 121 Actions:**
```bash
# Profile the Reality Agent discovery process
python3 -c "
import time
import subprocess
import json

def time_operation(name, command):
    print(f'\n=== Timing: {name} ===')
    start = time.time()
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        end = time.time()
        duration = end - start
        print(f'Duration: {duration:.3f}s')
        print(f'Success: {result.returncode == 0}')
        return duration, result.returncode == 0
    except Exception as e:
        print(f'Error: {e}')
        return None, False

# Time individual GitHub operations
operations = [
    ('GitHub Auth Check', 'gh auth status'),
    ('Repository Info', 'gh repo view --json name,description'),
    ('PR List (5)', 'gh pr list --limit 5'),
    ('PR List (20)', 'gh pr list --limit 20'),
    ('Issue List (5)', 'gh issue list --limit 5'),
    ('Issue List (20)', 'gh issue list --limit 20'),
    ('Branch List', 'gh api repos/:owner/:repo/branches'),
    ('Workflow Status', 'gh run list --limit 5')
]

results = {}
for name, command in operations:
    duration, success = time_operation(name, command)
    results[name] = {'duration': duration, 'success': success}

print('\n=== BOTTLENECK ANALYSIS ===')
sorted_ops = sorted([(k, v) for k, v in results.items() if v['duration']], 
                   key=lambda x: x[1]['duration'], reverse=True)

for i, (op, data) in enumerate(sorted_ops[:5]):
    print(f'{i+1}. {op}: {data[\"duration\"]:.3f}s')
"
```

**Evidence to Collect:**
- Ranked list of slowest operations
- Operations that consistently fail
- Operations with high variance
- Clear targets for MCP acceleration

**Session 122 Validation:**
- [ ] Bottlenecks identified with measurement data
- [ ] Operations ranked by actual impact potential
- [ ] Failure patterns documented
- [ ] Clear optimization targets established

### Task 4: Gap Analysis (30 minutes)

#### 4.1 Current vs Required Capability Mapping (20 min)
**Objective**: Identify actual gaps between current Reality Agents and project needs

**Session 121 Actions:**
```bash
# Query YAML for recent sessions' agent usage patterns
python3 scripts/00059-yaml-query.py --topic "github" --limit 10
python3 scripts/00059-yaml-query.py --topic "supabase" --limit 10
python3 scripts/00059-yaml-query.py --topic "agent" --limit 10

# Look for evidence of agent limitations in recent sessions
python3 scripts/00059-yaml-query.py --topic "performance" --limit 10
python3 scripts/00059-yaml-query.py --topic "slow" --limit 5
python3 scripts/00059-yaml-query.py --topic "timeout" --limit 5
```

**Evidence to Collect:**
- Recent sessions' complaints about agent performance
- Missing capabilities that forced workarounds
- Operations that required manual intervention
- Documented requests for agent improvements

**Session 122 Validation:**
- [ ] Gap analysis based on documented need, not assumption
- [ ] Evidence of limitations from session logs
- [ ] Workarounds that suggest missing capabilities
- [ ] Clear justification for proposed improvements

#### 4.2 Session 105 MCP Integration Status Assessment (10 min)
**Objective**: Determine what Session 105 actually delivered vs what still needs work

**Session 121 Actions:**
```bash
# Read Session 105 documentation
find . -name "*105*" -type f | xargs grep -l "MCP\|mcp" | head -5

# Check if Session 105's integration is production-ready
if [ -f "mcp_enhanced_connector.py" ]; then
    echo "Testing Session 105 integration completeness..."
    python3 -c "
    import ast
    import inspect
    
    # Read the MCP enhanced connector
    with open('mcp_enhanced_connector.py', 'r') as f:
        content = f.read()
    
    # Look for placeholder code vs real implementation
    placeholder_indicators = [
        'pass',
        'TODO',
        'placeholder',
        'would be:',
        'implementation here'
    ]
    
    print('=== Session 105 Integration Status ===')
    for indicator in placeholder_indicators:
        count = content.lower().count(indicator.lower())
        if count > 0:
            print(f'{indicator}: {count} occurrences')
    
    # Check for actual MCP calls vs pseudocode
    mcp_call_patterns = [
        'mcp__supabase-dev__',
        'actual MCP calls',
        'real implementation'
    ]
    
    print('\n=== Implementation Completeness ===')
    for pattern in mcp_call_patterns:
        count = content.count(pattern)
        print(f'{pattern}: {count} occurrences')
    "
fi
```

**Evidence to Collect:**
- Session 105's actual implementation completeness
- Placeholder vs production code ratio
- Missing pieces that need completion
- Integration readiness assessment

**Session 122 Validation:**
- [ ] Session 105 work status accurately assessed
- [ ] Placeholder vs real code identified
- [ ] Missing pieces documented
- [ ] Clear understanding of what needs completion

## Success Criteria for Phase 0

### Evidence Collection Completeness
- [ ] All existing MCP integration work catalogued
- [ ] Performance baselines established with measurements
- [ ] MCP server availability determined factually
- [ ] Reality Agent structure mapped accurately
- [ ] Bottlenecks identified with data
- [ ] Gap analysis based on documented needs

### Quality Standards
- [ ] No assumptions in evidence collection
- [ ] All measurements taken multiple times
- [ ] Error cases documented thoroughly
- [ ] Evidence collection methods reproducible
- [ ] Results presented with confidence intervals

### Documentation Requirements
- [ ] All findings documented with timestamps
- [ ] Source of each piece of evidence noted
- [ ] Limitations of evidence collection acknowledged
- [ ] Contradictory evidence highlighted

## Phase 0 Deliverables

### 1. Reality State Report
- Current directory structure and file locations
- Existing MCP integration status and functionality
- Performance baseline measurements
- Bottleneck identification with data

### 2. MCP Infrastructure Assessment
- Available MCP servers and their operational status
- Session 105 integration completeness analysis
- Current vs theoretical capabilities comparison

### 3. Gap Analysis Document
- Evidence-based capability gaps
- Performance improvement opportunities with quantified impact
- Missing features that require development

### 4. Evidence-Based Implementation Recommendations
- What needs to be built vs what needs to be enhanced
- Priority ranking based on measured impact potential
- Risk assessment for proposed changes

## Buddy System Protocol for Phase 0

### Session 121 Responsibilities
- Execute all evidence collection tasks
- Document findings without interpretation
- Provide raw data and measurements
- Acknowledge limitations and uncertainties

### Session 122 Validation Checkpoints
- **After Task 1**: Verify current state audit is complete and accurate
- **After Task 2**: Confirm MCP server status assessment is evidence-based
- **After Task 3**: Validate performance baselines are statistically sound
- **After Task 4**: Ensure gap analysis is based on documented need

### Approval Criteria
Session 122 must confirm:
- All evidence is based on direct observation, not assumption
- Measurements are reproducible and statistically valid
- No gaps in critical evidence collection
- Findings ready to support implementation decisions

## Time Estimate

**Total Phase 0 Time: 2.5 hours**
- Task 1 (Current State Audit): 45 minutes
- Task 2 (MCP Server Verification): 30 minutes  
- Task 3 (Performance Baseline): 45 minutes
- Task 4 (Gap Analysis): 30 minutes
- Documentation: 20 minutes

## Risk Mitigation

### Risk 1: Evidence Collection Incomplete
**Mitigation**: Session 122 validates completeness at each checkpoint

### Risk 2: Measurements Unreliable
**Mitigation**: Multiple measurements, statistical validation

### Risk 3: Existing Work Overlooked
**Mitigation**: Comprehensive file system search and YAML queries

### Risk 4: Assumptions Creeping In
**Mitigation**: Buddy system validation focused on evidence vs assumption

## Constitutional Compliance Statement

This Phase 0 plan adheres to:
- **Article VII**: Transparency through complete evidence documentation
- **Anti-Guesswork Protocol**: No implementation decisions without evidence
- **Buddy System**: Validation at every step
- **Truth Over Speed**: Thorough evidence gathering before action

---

## Next Steps After Phase 0

Once Session 122 approves Phase 0 completion:
1. Create evidence-based implementation plan
2. Focus on gaps identified through measurement
3. Build on existing work rather than recreating
4. Set quantified improvement targets based on baselines

---

*Session 121 - Phase 0 Evidence Gathering Plan*  
*Ready for Session 122 Review and Approval*