# GOAL-002: Supabase Reality Agent
**Priority**: High  
**Created**: 2025-08-14 | Session #00001  
**Status**: Defined  
**Domain Owner**: Reality Domain  

## Objective
Create a Reality Domain agent that provides truth about ANY Supabase database state, with no assumptions about existing projects or schemas.

## Core Principle
**"This agent only observes and reports reality. It never modifies, assumes, or wishes."**

## Success Criteria
1. **Universal Connection**: Can connect to any Supabase instance with provided credentials
2. **Progressive Discovery**: Starts minimal, expands based on permissions
3. **Schema Change Tracking**: Detects and logs all schema evolution
4. **Before/After Verification**: Reality checks bookend every operation
5. **Zero Assumptions**: Works with any schema, any project, any state

## Reality Domain Constraints
- **Read-Only Operations**: This agent MUST NOT modify any data
- **Credential Isolation**: Credentials never stored in code, only environment
- **Performance Impact**: Queries must not degrade production performance  
- **Audit Trail**: All discoveries logged with timestamps
- **Cache Respect**: Never bypass Supabase rate limits
- **Truth Only**: Report what IS, not what SHOULD BE

## Progressive Discovery Pattern

### Level 1: Minimal (Connection Test)
- Can I connect?
- What's my permission level?
- Basic health check

### Level 2: Basic (Structure Discovery)  
- What tables exist?
- How many rows in each?
- What are the column names?

### Level 3: Complete (Schema Discovery)
- Full column definitions
- Constraints and relationships
- Indexes and keys
- RLS policies

### Level 4: Advanced (Change Detection)
- Schema differences from last check
- Data volume changes
- Performance indicators
- Unused/bloated tables

## Schema Change Tracking Requirements

### Tracking System
```python
class SchemaEvolution:
    def capture_snapshot():
        """Store current schema state"""
    
    def compare_snapshots(old, new):
        """Identify all changes"""
    
    def generate_migration_report():
        """Document what changed, when, and impact"""
```

### Change Categories
- **Structure Changes**: Tables/columns added/removed/modified
- **Constraint Changes**: Keys, indexes, RLS policies
- **Volume Changes**: Significant row count variations
- **Performance Changes**: New bloat, missing indexes

## Before/After Reality Check Pattern

### Before Task
1. Capture current reality snapshot
2. Verify connection and permissions
3. Check last known state validity
4. Log pre-task state

### After Task
1. Capture new reality snapshot
2. Compare with before state
3. Document any changes detected
4. Update Reality Domain inventory

## Output Specification

```json
{
  "metadata": {
    "timestamp": "ISO-8601",
    "agent": "supabase-reality",
    "check_type": "before|after|periodic",
    "connection_id": "unique-session-id",
    "confidence_score": 0.0-1.0
  },
  "connection": {
    "status": "connected|failed|limited",
    "permission_level": "anon|authenticated|service",
    "rate_limit_remaining": 100
  },
  "discoveries": {
    "level": 1-4,
    "summary": {
      "total_tables": 0,
      "total_rows": 0,
      "database_size_mb": 0
    },
    "details": {
      "tables": [],
      "schemas": {},
      "relationships": [],
      "rls_policies": {}
    }
  },
  "changes": {
    "detected": true|false,
    "schema_changes": [],
    "volume_changes": [],
    "performance_indicators": []
  },
  "health": {
    "issues": [],
    "warnings": [],
    "recommendations": []
  },
  "next_check": "ISO-8601"
}
```

## Error Handling

### Error Codes
- `REALITY_001`: Connection failed
- `REALITY_002`: Rate limited
- `REALITY_003`: Permission denied
- `REALITY_004`: Schema drift detected
- `REALITY_005`: Cache invalid

### Recovery Strategy
1. Log error with full context
2. Attempt graceful degradation
3. Use cached data if available
4. Report limitations to Reality Domain
5. Schedule retry if appropriate

## Implementation Phases

### Phase 1: Foundation (1 hour)
- [ ] Agent directory structure
- [ ] PURPOSE.md for agent
- [ ] Credential management (env only)
- [ ] Quick connection test

### Phase 2: Progressive Discovery (2 hours)
- [ ] Level 1: Connection test
- [ ] Level 2: Table listing
- [ ] Level 3: Schema discovery
- [ ] Cache implementation

### Phase 3: Change Tracking (2 hours)
- [ ] Snapshot system
- [ ] Comparison engine
- [ ] Change categorization
- [ ] History storage

### Phase 4: Integration (1 hour)
- [ ] Before/after check automation
- [ ] Reality Domain integration
- [ ] Output formatting
- [ ] Error handling

## Testing Requirements

### Unit Tests
- Connection with various credential types
- Discovery at each level
- Change detection accuracy
- Cache expiration
- Error recovery

### Integration Tests
- Full before/after cycle
- Reality Domain consumption
- Rate limit respect
- Network failure handling
- Schema drift scenarios

## Open Questions
1. Credential source: Environment variables or secure vault?
2. Cache duration: How long before refetch?
3. History retention: How many snapshots to keep?
4. Alert triggers: What changes warrant immediate notification?

---

**Requirements Domain Approval**: ✅ Defined  
**Reality Domain Review**: Pending  
**Reconciliation Plan**: Pending  

*This agent serves Reality Domain's need for truth about external database state*