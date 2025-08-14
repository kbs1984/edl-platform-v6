# Reality Auditor Agent Brigade Purpose

## Mission
To discover, verify, and report the actual state of all external systems that Reality Domain must track.

## Core Principle
**"We report what IS, never what SHOULD BE or COULD BE."**

## Agent Brigade Structure

### Current Agents
1. **Supabase Connector** - Database reality auditing
   - Status: In Development
   - Purpose: Truth about database state

### Planned Agents
2. **File System Auditor** - Local reality verification
3. **Git Repository Auditor** - Version control reality
4. **API Endpoint Auditor** - External service reality
5. **Infrastructure Auditor** - Cloud/server reality

## Operating Principles

### 1. Read-Only Operations
No agent in this brigade may modify external state. We observe, we don't interfere.

### 2. Progressive Discovery
Start with minimal checks, expand based on permissions and need.

### 3. Before/After Verification
Every significant operation must be bracketed by reality checks.

### 4. Truth Over Speed
Better to be accurate than fast. Cache when safe, but verify when critical.

### 5. Transparent Limitations
Always report what we cannot see or verify. Unknown is better than assumed.

## Integration Protocol

### Input from Reality Domain
```python
{
    "request": "audit",
    "target": "system-name",
    "depth": 1-4,  # Discovery level
    "cache_ok": true|false
}
```

### Output to Reality Domain
```python
{
    "agent": "agent-name",
    "timestamp": "ISO-8601",
    "discoveries": {...},
    "limitations": [...],
    "confidence": 0.0-1.0
}
```

## Change Management

### Adding New Agents
1. Must serve Reality Domain's truth-seeking mission
2. Must be read-only in operation
3. Must follow progressive discovery pattern
4. Must integrate with existing error codes
5. Must provide before/after check capability

### Modifying Existing Agents
1. Changes must not break Reality Domain integration
2. Output format changes require version increment
3. New discovery levels should be additive, not breaking
4. Error handling must remain consistent

## Success Metrics

- **Coverage**: Percentage of external systems with agents
- **Accuracy**: Truth verification success rate
- **Reliability**: Uptime and error recovery rate
- **Performance**: Time to complete reality checks
- **Change Detection**: Drift identification accuracy

## Coordination

All agents in this brigade:
- Share error code namespace (REALITY_XXX)
- Use common output format
- Respect rate limits and performance boundaries
- Log to unified audit trail
- Cache with same TTL strategy

---

*"The brigade that sees all, changes nothing, and reports only truth."*