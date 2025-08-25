---
attribution:
  created_at: 2025-08-15 12:00:53.975536
  created_by: Session 00009
  intent: Complete workflow documentation for Session 00010 seed planting
  session: 00009
  task_description: No task context set
  task_id: unknown
created: '2025-08-25'
session: legacy
status: active
---
# Seed Reception Protocol v1.0
**Session 00009 Implementation**

## Overview

This protocol defines how Session 00010 and future sessions receive, parse, and plant complex seed documents. The infrastructure built in Session 00009 ensures that **intricate task dependencies are never lost** and every change is properly attributed.

## Critical Infrastructure Components

### 1. Task Reality Agent
**Location**: `reality/agent-reality-auditor/task-connector/connector.py`

**Capabilities**:
- Tracks WHO created each task and WHEN
- Maps task dependencies (X requires Y)
- Verifies actual completion vs claims
- Detects orphaned tasks and blockers
- Generates execution roadmaps with critical path analysis

**Key Methods**:
```python
agent.track_task(task_id, session_id, depends_on=[], description="", acceptance_criteria=[])
agent.verify_completion(task_id) -> Dict[str, Any]
agent.get_execution_order() -> List[str]
agent.find_blockers() -> Dict[str, Dict]
agent.generate_roadmap() -> Dict[str, Any]
```

### 2. Seed Parser Tools
**Location**: `tools/seed-parser.py`

**Obsidian Canvas Parser**:
- Extracts tasks from Canvas JSON nodes
- Maps dependencies from Canvas edges
- Parses metadata: `[P0]`, `(2h)`, `@session10`, `#backend`
- Generates acceptance criteria from structured text
- Identifies issues: circular dependencies, orphaned tasks

**Database Schema Parser**:
- Converts SQL CREATE statements to implementation tasks
- Maps foreign key dependencies
- Generates table, index, and seeding tasks
- Supports PostgreSQL dialect (Supabase-ready)

### 3. Session Attribution System
**Location**: `tools/session-attribution.py`

**Features**:
- Adds attribution headers to all created/modified files
- Tracks session ownership in `.attribution/attribution.json`
- Integrates with git for commit tracking
- Supports Python, JS, TypeScript, Markdown, SQL, HTML
- Generates comprehensive ownership reports

## Seed Reception Workflow

### Phase 1: Preparation (Start of Session)

1. **Initialize Task Context**:
   ```bash
   cd tools
   python3 session-attribution.py --session 00010 set-task \
     --task-id "seed-planting-phase1" \
     --description "Parse and validate seed documents"
   ```

2. **Validate Infrastructure**:
   ```bash
   cd reality/agent-reality-auditor/task-connector
   python3 quickstart.py  # Verify Task Reality Agent works
   ```

3. **Check System Health**:
   ```bash
   ./scripts/structure-check.sh  # Should show 6 Reality Agents
   ```

### Phase 2: Seed Document Reception

1. **Receive Obsidian Canvas JSON**:
   - User provides Canvas file(s) with task graph
   - Contains wireframes, task dependencies, metadata
   - May include multiple connected canvases

2. **Receive Database Schema**:
   - User provides SQL schema file(s)
   - Contains table definitions, relationships, constraints
   - Represents the symbiotic ecosystem design

### Phase 3: Seed Parsing

1. **Parse Canvas Documents**:
   ```bash
   cd tools
   python3 seed-parser.py --canvas path/to/canvas.json --output json > canvas_parsed.json
   ```

   **Extract**:
   - Task nodes with metadata (priority, time, assignee, tags)
   - Dependency edges (depends_on, blocks, related_to)
   - Acceptance criteria from structured text
   - Visual layout information (for parallel execution hints)

2. **Parse Database Schema**:
   ```bash
   python3 seed-parser.py --schema path/to/schema.sql --tasks --output json > schema_tasks.json
   ```

   **Generate**:
   - Table creation tasks with proper dependencies
   - Index creation tasks (dependent on tables)
   - Data seeding tasks (dependent on table+index)
   - Foreign key constraint validation

### Phase 4: Task Graph Construction

1. **Load Parsed Data into Task Reality Agent**:
   ```python
   from task_connector.connector import TaskRealityAgent
   
   agent = TaskRealityAgent()
   
   # Load canvas tasks
   for task in canvas_data['tasks'].values():
       agent.track_task(
           task_id=task['id'],
           session_id='00010',
           description=task['description'],
           depends_on=task['depends_on'],
           priority=task['priority'],
           estimated_hours=task['estimated_hours'],
           acceptance_criteria=task['acceptance_criteria'],
           intent=task.get('intent', '')
       )
   
   # Load schema tasks  
   for task in schema_tasks:
       agent.track_task(
           task_id=task['id'],
           session_id='00010', 
           description=task['description'],
           depends_on=task['depends_on'],
           acceptance_criteria=task['acceptance_criteria']
       )
   ```

2. **Validate Task Graph**:
   ```python
   # Check for issues
   roadmap = agent.generate_roadmap()
   blockers = agent.find_blockers()
   
   # Verify execution order is possible
   execution_order = agent.get_execution_order()
   ```

### Phase 5: Implementation Planning

1. **Generate Execution Roadmap**:
   ```python
   roadmap = agent.generate_roadmap()
   
   print(f"Total phases: {len(roadmap['phases'])}")
   print(f"Parallel opportunities: {len(roadmap['parallel_opportunities'])}")
   print(f"Critical path: {roadmap['critical_path']['total_hours']} hours")
   print(f"Estimated sessions: {roadmap['estimated_sessions']}")
   ```

2. **Identify Session Boundaries**:
   - Group tasks by phases (dependencies allow parallel execution)
   - Consider complexity and estimated hours per session
   - Assign task ownership to specific sessions

3. **Create Implementation Plan**:
   ```python
   handoff = agent.create_session_handoff("00010", "00011")
   
   # Generate SESSION-00011-IMPLEMENTATION-PLAN.md
   with open("SESSION-00011-IMPLEMENTATION-PLAN.md", "w") as f:
       f.write(generate_implementation_plan(handoff, roadmap))
   ```

## Session Ownership Assignment Rules

### Automatic Assignment
1. **P0 Tasks**: Assign to earliest possible session (critical path)
2. **Dependency Clusters**: Keep related tasks in same session when possible
3. **Estimated Hours**: Target 6-8 hours of work per session
4. **Skill Alignment**: Consider task type and session capabilities

### Manual Override
- Session can explicitly claim tasks: `agent.assign_task(task_id, session_id, reason)`
- Session can transfer tasks: `agent.transfer_task(task_id, from_session, to_session, reason)`
- Critical blockers get priority assignment

## Metadata Extraction Standards

### Obsidian Canvas Text Patterns

**Priority**: `[P0]` `[P1]` `[P2]` `[URGENT]` `[HIGH]` `[MEDIUM]` `[LOW]`

**Time Estimates**: `(2h)` `(30m)` `(1.5h)` `(2d)` `(1w)`

**Assignment**: `@session10` `@backend` `@frontend` `@database`

**Tags**: `#api` `#ui` `#database` `#testing` `#deployment`

**Complexity**: `{easy}` `{medium}` `{hard}` `{complex}`

**Intent**: `intent:"Create user authentication system"`

**Acceptance Criteria**: `criteria:"User can log in" criteria:"Session persists"`

### Database Schema Patterns

**Table Dependencies**: Foreign keys determine task order
```sql
CREATE TABLE users (id PRIMARY KEY);
CREATE TABLE posts (user_id REFERENCES users(id));  -- Depends on users table
```

**Index Dependencies**: Indexes depend on their tables
```sql
CREATE INDEX idx_posts_user ON posts(user_id);  -- Depends on posts table
```

**Constraint Dependencies**: Complex constraints depend on tables and indexes

## Validation Requirements

### Pre-Implementation Validation

1. **Task Graph Integrity**:
   - No circular dependencies
   - All dependencies reference existing tasks
   - Execution order is deterministic

2. **Resource Estimation**:
   - All tasks have time estimates or defaults
   - Total estimated hours are reasonable
   - Critical path is identified

3. **Acceptance Criteria Coverage**:
   - All P0/P1 tasks have acceptance criteria
   - Criteria are verifiable with Reality Agents
   - Evidence sources are identified

### During Implementation Validation

1. **Completion Verification**:
   ```python
   verification = agent.verify_completion(task_id)
   if verification['confidence'] < 80:
       # Requires manual validation
   ```

2. **Dependency Satisfaction**:
   ```python
   ready_tasks = [
       tid for tid, task in agent.task_graph.items()
       if all(agent.task_graph[dep]['status'] == 'completed' 
              for dep in task['depends_on'])
   ]
   ```

3. **Attribution Tracking**:
   ```bash
   python3 session-attribution.py --session 00010 attribute \
     --file path/to/created/file.py \
     --action created \
     --intent "Implement user authentication endpoint"
   ```

## Error Handling and Recovery

### Common Issues and Solutions

1. **Circular Dependencies**:
   - Detected by seed parser during validation
   - Resolution: Break cycles by identifying optional dependencies
   - Document in task intent why dependency was removed

2. **Missing Dependencies**:
   - Task references non-existent dependency
   - Resolution: Create placeholder task or remove dependency
   - Attribute correction to session that fixes it

3. **Impossible Time Estimates**:
   - Total estimated hours exceed reasonable session capacity
   - Resolution: Break large tasks into smaller ones
   - Update task graph with new dependencies

4. **Orphaned Tasks**:
   - Tasks with no dependencies and no dependents
   - Resolution: Identify where they fit or mark as standalone
   - Document rationale in task intent

### Recovery Procedures

1. **Task Graph Corruption**:
   ```python
   # Backup current state
   agent._save_tasks()
   
   # Reset and reload from source
   agent.task_graph = {}
   # Re-parse seeds and rebuild
   ```

2. **Attribution Loss**:
   ```bash
   # Find unattributed files
   python3 session-attribution.py --session 00010 unattributed
   
   # Mass attribute directory
   python3 session-attribution.py --session 00010 attribute-dir \
     --directory ./src --intent "Retroactive attribution after loss"
   ```

3. **Session Context Loss**:
   ```bash
   # Restore from git history
   git log --oneline --grep="Session 00010"
   
   # Rebuild attribution from commits
   python3 tools/rebuild-attribution-from-git.py --session 00010
   ```

## Integration with Reality Agents

### Task Reality Agent as 6th Reality Agent

The Task Reality Agent integrates with existing Reality Agents:

1. **FileSystem Agent**: Verifies file existence for completion evidence
2. **GitHub Agent**: Checks commit history for task completion
3. **Supabase Agent**: Validates database table/schema tasks
4. **Vercel Agent**: Confirms deployment tasks
5. **Static Asset Agent**: Verifies frontend asset tasks
6. **Integration Agent**: Monitors overall health including task completion rates

### Health Metrics Integration

```python
# Task Reality Agent contributes to Integration Agent health score
task_health = {
    'completion_rate': completed_tasks / total_tasks,
    'attribution_coverage': attributed_files / total_files,
    'dependency_satisfaction': satisfied_deps / total_deps,
    'evidence_confidence': avg_completion_confidence
}
```

## Session Handoff Protocol

### End of Session Checklist

1. **Mark Completed Tasks**:
   ```python
   agent.mark_completed(
       task_id="create_users_table",
       session_id="00010",
       evidence=["Table created in Supabase", "Migration file added"],
       actual_hours=1.5
   )
   ```

2. **Update Attribution**:
   ```bash
   python3 session-attribution.py --session 00010 commit \
     --message "Session 00010: Completed user authentication tasks"
   ```

3. **Generate Handoff**:
   ```python
   handoff = agent.create_session_handoff("00010", "00011")
   
   # Save to SESSION-00011-SEED-PLAN.md
   ```

4. **Validate System State**:
   ```bash
   python3 connector.py --action roadmap --output text
   ./scripts/structure-check.sh
   ```

### Handoff Document Contents

```markdown
# SESSION-00011-SEED-PLAN.md

## Work Completed in Session 00010
- [List of completed tasks with evidence]
- [Files created/modified with attribution]
- [Issues encountered and resolved]

## Ready to Start (Priority Order)
1. task_id: description (estimated 2h)
2. task_id: description (estimated 1.5h)

## Blocked Tasks (Waiting for Dependencies)
- task_id: waiting for [dependency_task]

## Critical Path Items
- [Tasks that block the most other tasks]

## Session 00011 Recommendations
- Focus on [specific area]
- Watch out for [potential issues]
- Consider [optimization opportunities]
```

## Success Criteria

### Session 00010 Success Metrics

1. **Seed Parsing**: 100% of seed documents successfully parsed
2. **Task Tracking**: All tasks tracked with proper attribution
3. **Dependency Mapping**: Complete dependency graph with no orphans
4. **Evidence Framework**: Completion verification system operational
5. **Attribution System**: All created files properly attributed
6. **Roadmap Generation**: Clear implementation plan for future sessions

### Long-term Success Metrics

1. **Nothing Lost**: Zero tasks forgotten or dropped
2. **Clear Ownership**: Every file attributed to creating session
3. **Dependency Respect**: No implementation out of order
4. **Evidence-Based**: All completions verified with concrete evidence
5. **Session Continuity**: Seamless handoffs between sessions

## Tools Quick Reference

### Task Reality Agent Commands
```bash
cd reality/agent-reality-auditor/task-connector
python3 connector.py --action discover --level 4    # Full discovery
python3 connector.py --action roadmap               # Implementation plan
python3 connector.py --action blockers              # Find blocking tasks
python3 connector.py --action graph                 # ASCII dependency graph
python3 quickstart.py                               # Full validation test
```

### Seed Parser Commands
```bash
cd tools
python3 seed-parser.py --canvas file.json --output json
python3 seed-parser.py --schema schema.sql --tasks --output text
```

### Attribution Commands
```bash
cd tools
python3 session-attribution.py --session 00010 set-task --task-id "..." --description "..."
python3 session-attribution.py --session 00010 attribute --file "..." --intent "..."
python3 session-attribution.py --session 00010 report
python3 session-attribution.py --session 00010 commit
```

---

**This protocol ensures that the intricate web of dependencies in the seed documents is preserved, tracked, and implemented without loss. Session 00010 has everything needed to begin planting the seeds successfully.**