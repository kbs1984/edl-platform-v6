---
created: '2025-08-23'
domain: core
priority: P1
purpose: Document reality agent capabilities summary
session: '00022'
status: current
title: Reality Agent Capabilities Summary
topics:
- database
- documentation
type: guide
---

# Reality Agent Capabilities Summary

## Discovered Agent Capabilities

### FileSystem Agent
- Levels 1-3: Access, structure, metadata
- **Snapshot mode**: Can capture state for comparison
- **compare_snapshots()**: Can detect changes

### GitHub Agent  
- Levels 1-5: Repository analysis
- **--create-pr**: Can create pull requests
- **--create-issue**: Can create issues
- Level 5: Workflow/CI state (not tested)

### Supabase Agent (Session 21's discovery)
- Level 1-3: Connection, tables, schema
- **Level 4**: Change detection with snapshots ⭐
- **compare_snapshots()**: Database change tracking

### Integration Agent
- Meta-coordination of all agents
- Consensus scoring
- Gap detection
- JSON output for processing

### Task Reality Agent
- Actions: discover, status, roadmap, graph, blockers
- Dependency tracking
- Could be used for Canvas→Story dependency mapping

## Untapped Potential
1. Agents have comparison capabilities NOT used for Requirements
2. Task Agent could map dependencies between Canvas and Stories
3. Integration Agent could orchestrate validation
4. Snapshot comparison could track Requirements changes

## Recommendation
Use existing Reality Agent infrastructure to validate Requirements:
1. FileSystem Agent to track story file changes
2. Task Agent to map Canvas→Story dependencies
3. Integration Agent to orchestrate validation
4. Supabase Agent Level 4 for change tracking
