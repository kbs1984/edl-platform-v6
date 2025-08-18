# MASTERPLAN-004: Command Intelligence System
**Version**: 1.0.0  
**Created**: Session 00014  
**Date**: 2025-08-16  
**Domain**: Intelligent command enhancement and automation  
**Priority**: HIGH - Transforms manual commands into intelligent agents

---

## Executive Summary

### Problem Statement
Current Claude commands are static scripts with basic logic. They don't learn from usage, can't handle complex scenarios, lack retry intelligence, and require manual parameter tuning. Commands execute but don't think.

### Solution Approach  
Transform commands from simple scripts into intelligent agents with learning capabilities, adaptive behavior, performance optimization, and context awareness. This creates a command system that improves with use.

### Expected Outcomes
- Commands that learn from patterns
- Auto-optimization of parameters
- Intelligent retry and recovery
- Context-aware execution
- 50% reduction in command failures

---

## Current State Analysis

### What Exists Today
- 8 Claude custom commands created in Session 00013
- Basic bash execution with static logic
- Some error handling with fallbacks
- Manual parameter specification
- No learning or adaptation

### What's Working
- Commands enforce protocol
- Reality checks integrated
- Namespace organization started
- Allowed-tools security model

### What's Failing
- No retry intelligence
- Static thresholds
- No performance tracking
- Cannot handle edge cases
- No cross-command coordination

### Gap Analysis
| Current | Target | Impact |
|---------|--------|--------|
| Static execution | Adaptive behavior | Repeated failures |
| Fixed parameters | Auto-tuning | Suboptimal performance |
| Single attempts | Smart retries | Unnecessary failures |
| Isolated commands | Coordinated system | Duplicate work |
| No memory | Learning system | Repeat mistakes |

---

## Target Architecture

### Intelligent Command System
```
┌─────────────────────────────────────────────────────┐
│              Command Intelligence Layer              │
├─────────┬──────────┬──────────┬────────────────────┤
│ Context │ Learning │ Execution│   Coordination     │
│ Engine  │  System  │  Engine  │     Manager        │
├─────────┼──────────┼──────────┼────────────────────┤
│         │          │          │                    │
│ Gather  │ Pattern  │ Retry    │ Dependency         │
│ Enrich  │ Optimize │ Adapt    │ Orchestrate        │
│ Cache   │ Evolve   │ Recover  │ Parallelize        │
└─────────┴──────────┴──────────┴────────────────────┘
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
     Command DB    Execution Log   Learning DB
```

### Enhanced Command Structure
```yaml
command:
  metadata:
    name: "reality-check"
    version: "2.0.0"
    namespace: "reality"
    dependencies: ["agents", "monitoring"]
    
  intelligence:
    learning_enabled: true
    performance_tracking: true
    auto_optimization: true
    retry_strategy: "exponential_backoff"
    
  context:
    requires:
      - session_active: true
      - consensus_minimum: 0.6
    enrichment:
      - load_previous_results
      - check_system_load
      - estimate_duration
      
  execution:
    parallel_capable: true
    timeout_ms: 30000
    cache_ttl: 300
    fallback_command: "reality-check-emergency"
    
  coordination:
    blocks: ["deploy", "commit"]
    triggers: ["monitoring-update", "alert-check"]
    notifies: ["dashboard", "handoff"]
```

---

## Implementation Phases

### Phase 1: Context & Performance (Session 15)
- [ ] Build context engine (`commands/context.py`)
- [ ] Add performance tracking (`commands/performance.py`)
- [ ] Implement execution cache (`commands/cache.py`)
- [ ] Create timing analysis (`commands/timing.py`)
- [ ] Update existing commands with context
- **Success Criteria**: All commands tracked with timing

### Phase 2: Intelligence Layer (Session 16)
- [ ] Implement retry strategies (`commands/retry.py`)
- [ ] Build parameter optimization (`commands/optimize.py`)
- [ ] Add pattern learning (`commands/learning.py`)
- [ ] Create adaptation engine (`commands/adapt.py`)
- [ ] Generate intelligence reports
- **Success Criteria**: Commands self-optimize parameters

### Phase 3: Coordination System (Session 17)
- [ ] Build dependency manager (`commands/dependencies.py`)
- [ ] Implement parallel execution (`commands/parallel.py`)
- [ ] Create command chains (`commands/chains.py`)
- [ ] Add workflow orchestration (`commands/workflow.py`)
- [ ] Integrate with lifecycle
- **Success Criteria**: Complex workflows automated

---

## Command Enhancements

### Enhanced Reality Check Command
```markdown
---
allowed-tools: Bash(./scripts/00013_reality-check.sh:*), Bash(python3:*), Bash(jq:*)
description: Intelligent reality check with learning and optimization
intelligence:
  retry_strategy: exponential_backoff
  max_retries: 3
  cache_ttl: 300
  performance_target: 30000ms
---

# Intelligent Reality Check v2.0

## Context Gathering
!`python3 -c "
import json
import time
from datetime import datetime, timedelta

# Load historical performance
with open('.commands/performance/reality-check.json', 'r') as f:
    history = json.load(f)
    
# Calculate optimal parameters
avg_duration = sum(h['duration'] for h in history[-10:]) / 10
optimal_mode = '--quick' if avg_duration > 30000 else '--full'
system_load = get_system_load()
parallel_agents = system_load < 0.7

print(f'Historical avg: {avg_duration/1000:.1f}s')
print(f'Optimal mode: {optimal_mode}')
print(f'Parallel execution: {parallel_agents}')
"`

## Cached Check (if recent)
!`python3 -c "
import json
import os
from datetime import datetime, timedelta

cache_file = '.commands/cache/reality-check-latest.json'
if os.path.exists(cache_file):
    with open(cache_file, 'r') as f:
        cached = json.load(f)
    age = datetime.now() - datetime.fromisoformat(cached['timestamp'])
    if age < timedelta(minutes=5):
        print('Using cached result (age: {age.seconds}s)')
        print(json.dumps(cached['result'], indent=2))
        exit(0)
"`

## Intelligent Execution with Retry
!`python3 -c "
import subprocess
import time
import json

def run_with_retry(command, max_retries=3):
    for attempt in range(max_retries):
        try:
            start = time.time()
            result = subprocess.run(
                command, 
                shell=True, 
                capture_output=True, 
                text=True,
                timeout=30
            )
            duration = (time.time() - start) * 1000
            
            # Track performance
            track_performance('reality-check', duration, attempt)
            
            if result.returncode == 0:
                # Cache successful result
                cache_result(result.stdout)
                return result.stdout
                
            # Intelligent retry decision
            if should_retry(result.stderr, attempt):
                wait_time = 2 ** attempt  # Exponential backoff
                print(f'Retry {attempt+1} in {wait_time}s...')
                time.sleep(wait_time)
                
                # Adapt command for retry
                command = adapt_command(command, result.stderr)
            else:
                break
                
        except subprocess.TimeoutExpired:
            print('Timeout - switching to emergency mode')
            command = './scripts/00013_reality-check.sh --emergency'
            
    return None

# Execute with intelligence
result = run_with_retry('./scripts/00013_reality-check.sh --full')
if result:
    print(result)
else:
    print('ERROR: Reality check failed after retries')
"`

## Learning from Execution
!`python3 -c "
import json
from datetime import datetime

# Record execution pattern
pattern = {
    'timestamp': datetime.now().isoformat(),
    'session': '$ARGUMENTS',
    'duration': get_last_duration(),
    'success': was_successful(),
    'retry_count': get_retry_count(),
    'parameters': get_used_parameters()
}

# Update learning database
with open('.commands/learning/reality-check.json', 'a') as f:
    json.dump(pattern, f)
    f.write('\n')

# Optimize for next time
if pattern['duration'] > 30000:
    suggest_optimization('Use --quick mode or increase cache TTL')
elif pattern['retry_count'] > 1:
    suggest_optimization('Investigate failure pattern')
"`

## Task
Based on intelligent execution:
1. Use cached results when fresh (<5 min)
2. Adapt parameters based on history
3. Retry intelligently with backoff
4. Learn from patterns
5. Optimize for next execution
```

### Enhanced Session Start Command
```markdown
---
allowed-tools: Bash(*), Write, Read
description: Intelligent session initialization with predictive setup
intelligence:
  learning_enabled: true
  context_aware: true
  predictive_setup: true
---

# Intelligent Session Start v2.0

## Predict Session Needs
!`python3 -c "
import json
from datetime import datetime, timedelta

# Analyze previous sessions
def predict_session_needs(session_num):
    # Load session history
    with open('.lifecycle/session-history.json', 'r') as f:
        history = json.load(f)
    
    # Identify patterns
    patterns = {
        'avg_duration': calculate_avg_duration(history),
        'common_tasks': find_common_tasks(history),
        'typical_files': find_frequently_edited(history),
        'usual_branch': most_common_branch(history),
        'peak_hours': identify_peak_productivity(history)
    }
    
    # Generate predictions
    predictions = {
        'estimated_duration': patterns['avg_duration'],
        'likely_tasks': patterns['common_tasks'][:3],
        'prep_files': patterns['typical_files'][:5],
        'suggested_branch': patterns['usual_branch'],
        'optimal_time': is_peak_hour(datetime.now(), patterns['peak_hours'])
    }
    
    return predictions

predictions = predict_session_needs('$ARGUMENTS')
print(json.dumps(predictions, indent=2))
"`

## Intelligent Environment Setup
!`python3 -c "
import subprocess
import concurrent.futures

def parallel_setup():
    tasks = [
        ('reality_check', './scripts/00013_reality-check.sh --quick'),
        ('git_status', 'git status --short'),
        ('load_tasks', 'cat .tasks/task_graph.json'),
        ('check_deps', 'pip list --outdated'),
        ('cache_warm', 'find . -name "*.py" -exec cat {} \; > /dev/null')
    ]
    
    results = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        futures = {executor.submit(run_task, cmd): name 
                  for name, cmd in tasks}
        
        for future in concurrent.futures.as_completed(futures):
            name = futures[future]
            results[name] = future.result()
    
    return results

# Run parallel setup
setup_results = parallel_setup()
print('Environment ready in {elapsed}s')
"`

## Adaptive Workflow Selection
!`python3 -c "
# Determine optimal workflow based on context
workflow = determine_workflow(
    reality_score=get_consensus_score(),
    uncommitted=count_uncommitted_files(),
    time_available=estimate_session_duration(),
    blockers=check_blockers()
)

if workflow == 'recovery':
    print('🔧 Recovery workflow needed - running healing')
    run_command('/project:recovery')
elif workflow == 'continuation':
    print('📚 Continuing previous work')
    restore_context()
elif workflow == 'fresh':
    print('🚀 Starting fresh development')
    prepare_clean_slate()
"`

## Pre-emptive Problem Solving
!`python3 -c "
# Predict and prevent common issues
potential_issues = predict_issues()

for issue in potential_issues:
    if issue['probability'] > 0.7:
        print(f'Preventing: {issue["description"]}')
        run_preventive_action(issue['prevention'])
"`
```

### New Command: Intelligent Workflow
```markdown
---
allowed-tools: Bash(*), Write, Read
description: Execute complete workflows with intelligence
namespace: workflow
---

# Intelligent Workflow Executor

## Workflow Definition
Workflow: $ARGUMENTS

## Load Workflow
!`python3 -c "
import yaml

with open(f'.workflows/{workflow_name}.yaml', 'r') as f:
    workflow = yaml.safe_load(f)

print(f'Workflow: {workflow["name"]}')
print(f'Steps: {len(workflow["steps"])}')
print(f'Estimated duration: {workflow["estimated_duration"]}min')
"`

## Dependency Resolution
!`python3 -c "
# Build execution graph
graph = build_dependency_graph(workflow['steps'])
execution_order = topological_sort(graph)

# Identify parallelizable steps
parallel_groups = identify_parallel_groups(execution_order)

print(f'Execution groups: {len(parallel_groups)}')
print(f'Parallel optimization: {calculate_time_saved(parallel_groups)}min saved')
"`

## Intelligent Execution
!`python3 -c "
def execute_workflow(workflow, groups):
    results = {}
    
    for group in groups:
        if len(group) == 1:
            # Sequential execution
            step = group[0]
            results[step] = execute_step(step)
        else:
            # Parallel execution
            with concurrent.futures.ThreadPoolExecutor() as executor:
                futures = {executor.submit(execute_step, step): step 
                          for step in group}
                for future in concurrent.futures.as_completed(futures):
                    step = futures[future]
                    results[step] = future.result()
        
        # Checkpoint after each group
        checkpoint_progress(results)
        
        # Adaptive optimization
        if should_optimize(results):
            optimize_remaining_steps(groups, results)
    
    return results

results = execute_workflow(workflow, parallel_groups)
generate_workflow_report(results)
"`
```

---

## Intelligence Features

### Pattern Learning
```python
class CommandLearner:
    """Learn from command execution patterns"""
    
    def __init__(self, command_name: str):
        self.command = command_name
        self.patterns = []
        self.optimizations = []
    
    def record_execution(self, context: dict, result: dict):
        """Record execution pattern"""
        pattern = {
            'timestamp': datetime.now(),
            'context': context,
            'parameters': result['parameters'],
            'duration': result['duration'],
            'success': result['success'],
            'retries': result['retries']
        }
        self.patterns.append(pattern)
        
        # Learn from pattern
        self.identify_optimizations(pattern)
    
    def identify_optimizations(self, pattern: dict):
        """Identify optimization opportunities"""
        
        # Duration optimization
        if pattern['duration'] > self.target_duration:
            if pattern['context']['system_load'] > 0.8:
                self.suggest('Run during low load periods')
            elif pattern['parameters']['mode'] == '--full':
                self.suggest('Use --quick mode when possible')
        
        # Retry optimization
        if pattern['retries'] > 0:
            self.analyze_failure_pattern(pattern)
        
        # Success optimization
        if pattern['success']:
            self.record_successful_config(pattern)
    
    def predict_optimal_parameters(self, context: dict) -> dict:
        """Predict optimal parameters for context"""
        
        # Find similar contexts
        similar = self.find_similar_contexts(context)
        
        # Extract successful configurations
        successful = [p for p in similar if p['success']]
        
        # Return most successful configuration
        if successful:
            return self.aggregate_parameters(successful)
        
        return self.default_parameters()
```

### Adaptive Retry Logic
```python
class AdaptiveRetry:
    """Intelligent retry with adaptation"""
    
    def __init__(self, base_strategy: str = "exponential"):
        self.strategy = base_strategy
        self.history = []
    
    def should_retry(self, error: str, attempt: int) -> bool:
        """Determine if retry is worthwhile"""
        
        # Check error recoverability
        if self.is_permanent_error(error):
            return False
        
        # Check retry history
        if self.has_failed_repeatedly(error):
            return False
        
        # Check resource availability
        if not self.resources_available():
            return False
        
        return attempt < self.max_attempts
    
    def adapt_command(self, command: str, error: str) -> str:
        """Adapt command based on error"""
        
        adaptations = {
            'timeout': self.increase_timeout,
            'memory': self.reduce_memory_usage,
            'permission': self.try_elevated,
            'network': self.add_retry_header,
            'rate_limit': self.add_delay
        }
        
        error_type = self.classify_error(error)
        if error_type in adaptations:
            return adaptations[error_type](command)
        
        return command
    
    def calculate_backoff(self, attempt: int) -> float:
        """Calculate intelligent backoff"""
        
        if self.strategy == "exponential":
            base = 2 ** attempt
        elif self.strategy == "linear":
            base = attempt * 2
        elif self.strategy == "fibonacci":
            base = self.fibonacci(attempt)
        
        # Add jitter to prevent thundering herd
        jitter = random.uniform(0, 1)
        
        # Cap at maximum
        return min(base + jitter, self.max_backoff)
```

### Performance Optimization
```python
class CommandOptimizer:
    """Optimize command performance"""
    
    def __init__(self):
        self.metrics = defaultdict(list)
        self.cache = TTLCache(maxsize=100, ttl=300)
    
    def optimize_execution(self, command: str, context: dict) -> str:
        """Optimize command for current context"""
        
        # Check cache first
        cache_key = self.generate_cache_key(command, context)
        if cache_key in self.cache:
            return self.cache[cache_key]
        
        # Parallel execution opportunity
        if self.can_parallelize(command):
            command = self.parallelize(command)
        
        # Parameter tuning
        command = self.tune_parameters(command, context)
        
        # Resource optimization
        command = self.optimize_resources(command, context)
        
        return command
    
    def track_performance(self, command: str, duration: float):
        """Track command performance"""
        
        self.metrics[command].append({
            'timestamp': datetime.now(),
            'duration': duration,
            'context': self.capture_context()
        })
        
        # Detect degradation
        if self.is_degrading(command):
            self.trigger_optimization(command)
    
    def generate_optimization_report(self) -> dict:
        """Generate optimization recommendations"""
        
        report = {}
        
        for command, metrics in self.metrics.items():
            avg_duration = sum(m['duration'] for m in metrics) / len(metrics)
            
            report[command] = {
                'average_duration': avg_duration,
                'trend': self.calculate_trend(metrics),
                'recommendations': self.get_recommendations(command, metrics)
            }
        
        return report
```

---

## Success Metrics

### Intelligence Metrics
- **Learning Effectiveness**: >20% improvement
- **Retry Success Rate**: >80% on retry
- **Parameter Optimization**: >30% faster
- **Cache Hit Rate**: >60%

### Performance Metrics
- **Command Duration**: <50% of v1
- **Failure Rate**: <10%
- **Recovery Time**: <30 seconds
- **Parallel Speedup**: >2x

### User Experience Metrics
- **Command Success**: >95% first try
- **Wait Time**: <2 seconds perceived
- **Predictive Accuracy**: >70%
- **Automation Level**: >80% hands-free

---

## Risk Mitigation

### Risk: Over-Optimization
- **Mitigation**: Maintain baseline performance
- **Monitoring**: Track optimization effectiveness
- **Fallback**: Revert to simple execution

### Risk: Cache Staleness
- **Mitigation**: TTL-based expiration
- **Monitoring**: Cache hit/miss ratio
- **Fallback**: Force refresh option

### Risk: Learning Drift
- **Mitigation**: Periodic retraining
- **Monitoring**: Prediction accuracy
- **Fallback**: Reset learning data

---

## Dependencies

### Requires
- All previous masterplans for data
- Python with ML libraries
- Command execution history
- System metrics access

### Enables
- Full automation potential
- Self-improving system
- Minimal human intervention

### Conflicts
- None identified

---

## Example Intelligence Report

```
Command Intelligence Report - Session 00014
===========================================

PERFORMANCE SUMMARY
------------------
Total Executions: 47
Average Duration: 2.3s (-34% vs baseline)
Success Rate: 94% (+12% vs v1)
Cache Utilization: 62%

TOP OPTIMIZATIONS APPLIED
-------------------------
1. reality-check: Switched to --quick mode (saved 18s/execution)
2. git-commit: Parallel staging (saved 5s/execution)
3. session-start: Predictive setup (saved 2min/session)

LEARNING INSIGHTS
----------------
Pattern: Reality checks fail most often at 14:00
Action: Pre-emptive cache warming at 13:55
Result: 0 failures in last 7 days

Pattern: Commits with >10 files take 3x longer
Action: Auto-split into logical groups
Result: 67% faster average commit time

PREDICTIONS FOR NEXT SESSION
----------------------------
Likely Duration: 2.5 hours
Probable Tasks: Command enhancement, testing
Suggested Setup: Load command context, warm caches
Risk Factors: Low disk space (87% full)

RECOMMENDATIONS
--------------
1. Enable parallel execution for all capable commands
2. Increase cache TTL to 10 minutes (stable period)
3. Implement predictive reality checks
4. Add workflow automation for common patterns
```

---

*This masterplan transforms static commands into an intelligent, self-improving system.*