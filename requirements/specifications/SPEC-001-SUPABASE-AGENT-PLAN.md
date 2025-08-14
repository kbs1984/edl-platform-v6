# SPEC-001: Supabase CLI Agent Planning Document
**Created**: 2025-08-14 | Session #00001  
**Status**: Planning  
**Domain**: Reality Domain (Primary)  

## Validated Assumptions ✅

### 1. Supabase CLI Availability
- **Tested**: ✅ Supabase CLI v2.34.3 installed at `/usr/local/bin/supabase`
- **Risk**: None - CLI is operational
- **Decision**: Use CLI as primary interface

### 2. Credentials Availability  
- **Tested**: ✅ Found production credentials in `edl-platform-v5/.env.production`
- **Project URL**: `https://bbrheacetxlnqbibjwsz.supabase.co`
- **Anon Key**: Available (public key, safe for read operations)
- **Risk**: Service key not available (but not needed for read-only)
- **Decision**: Use anon key for read operations

### 3. Python Interface Capability
- **Tested**: ✅ Python subprocess can call Supabase CLI successfully
- **Risk**: None - subprocess works as expected
- **Decision**: Build Python wrapper around CLI

### 4. Read-Only Sufficiency
- **Analysis**: Reality Domain only needs to observe, not modify
- **Risk**: Some metadata might require auth
- **Decision**: Implement with anon key, document any access limitations

## Agent Architecture

### Location
```
reality/
└── agent-reality-auditor/
    ├── PURPOSE.md
    ├── supabase-connector/
    │   ├── __init__.py
    │   ├── connector.py        # Main agent code
    │   ├── credentials.py      # Credential management
    │   ├── discovery.py        # Table/schema discovery
    │   ├── verification.py     # Truth verification
    │   └── reporter.py         # Reality reporting
    └── tests/
        └── test_supabase.py
```

### Core Components

#### 1. Credential Manager (`credentials.py`)
```python
class SupabaseCredentials:
    - load_from_env()
    - validate_connection()
    - get_connection_string()
```

#### 2. Discovery Module (`discovery.py`)
```python
class SupabaseDiscovery:
    - list_all_tables()
    - get_table_schema(table_name)
    - get_row_count(table_name)
    - discover_relationships()
```

#### 3. Verification Module (`verification.py`)
```python
class SupabaseVerification:
    - table_exists(table_name)
    - data_exists(table, conditions)
    - rls_active(table_name)
    - migration_applied(migration_id)
```

#### 4. Reality Reporter (`reporter.py`)
```python
class SupabaseReporter:
    - generate_reality_snapshot()
    - compare_with_last_snapshot()
    - detect_schema_drift()
    - export_to_reality_domain()
```

### Integration Points

#### Input (from Reality Domain)
- Request for current database state
- Request for specific table verification
- Request for change detection

#### Output (to Reality Domain)
```json
{
  "timestamp": "2025-08-14T...",
  "source": "supabase",
  "discoveries": {
    "tables": [...],
    "schemas": {...},
    "row_counts": {...},
    "relationships": [...]
  },
  "verifications": {
    "requested_tables": {...},
    "rls_status": {...}
  },
  "changes_detected": [...]
}
```

### Implementation Phases

#### Phase 1: Basic Connection (Quick Win - 1 hour)
- [ ] Create agent directory structure
- [ ] Implement credential loading
- [ ] Test basic connection
- [ ] Verify we can query Supabase

#### Phase 2: Discovery Functions (2-3 hours)
- [ ] Implement table listing
- [ ] Implement schema discovery
- [ ] Implement row counting
- [ ] Test with actual database

#### Phase 3: Verification Functions (2 hours)
- [ ] Implement existence checks
- [ ] Implement RLS verification
- [ ] Create verification report format

#### Phase 4: Integration (1 hour)
- [ ] Connect to Reality Domain auditor
- [ ] Create output format
- [ ] Test full pipeline

### Required Resources

#### From Brian
- ✅ Supabase URL (have it)
- ✅ Anon key (have it)
- ⚠️ Confirmation that read-only is sufficient
- ⚠️ Any specific tables to prioritize

#### From System
- Python 3.x (available)
- Supabase CLI (available)
- File system access (available)

### Success Criteria

1. **Connection Test**: Can connect to Supabase and authenticate
2. **Discovery Test**: Can list all tables and their schemas
3. **Verification Test**: Can verify specific table existence
4. **Integration Test**: Reality Domain can consume agent output
5. **Change Detection**: Can detect schema changes between runs

### Risk Mitigation

| Risk | Mitigation |
|------|------------|
| API rate limits | Implement caching and batch queries |
| Network failures | Graceful degradation with cached data |
| Schema complexity | Start with simple tables, expand gradually |
| Credential exposure | Use environment variables, never commit secrets |

### Questions for Brian

1. **Scope**: Should this agent only work with the EDL Platform database, or be generic for any Supabase project?
2. **Priority Tables**: Which tables are most critical to monitor?
3. **Change Frequency**: How often should we check for changes?
4. **Historical Data**: Should we track schema evolution over time?

---

## Decision Point

**Ready to proceed?** ✅ All critical assumptions validated

**Next Steps**:
1. Get Brian's answers to questions above
2. Create formal requirement document
3. Get Reality Domain feasibility approval
4. Begin Phase 1 implementation

---

*This planning document follows our constitutional process - Requirements before Reality before Reconciliation*