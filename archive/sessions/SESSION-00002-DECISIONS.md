# Session #00002 Key Decisions
**Date**: 2025-08-14  
**Session Type**: CLI  

## Decisions Made

### 13:45 - Credential Management Strategy
**Decision**: Use environment variables (SUPABASE_URL, SUPABASE_ANON_KEY)  
**Rationale**: Simple, secure, already validated in quickstart. Future sessions can enhance if needed.

### 13:46 - Cache TTL Configuration  
**Decision**: 5 minutes for schema, 1 minute for connection status  
**Rationale**: Balance between API load and data freshness. Schema changes rarely in production.

### 13:47 - Error Recovery Approach
**Decision**: Report immediately, no automatic retry for rate limits  
**Rationale**: Reality Domain reports truth, doesn't hide delays. Caller decides retry strategy.

### 13:52 - Schema Discovery Strategy
**Decision**: Use OpenAPI definitions when direct table access denied  
**Rationale**: Creative discovery within permission constraints. Better to report limited truth than nothing.

### 13:58 - Change Detection Implementation
**Decision**: Snapshot-based comparison with SHA-256 hashing  
**Rationale**: File-based snapshots are simple, reliable, and easy to debug.

### 14:05 - File System Agent Architecture
**Decision**: Reuse 60%+ of Supabase agent patterns  
**Rationale**: Proven patterns reduce risk and development time.

### 14:10 - File Hashing Algorithm
**Decision**: SHA-256 for all file change detection  
**Rationale**: Balance between collision resistance and performance.

### 14:15 - Session Tracking Gap
**Decision**: Create retroactive session logs and tracking tool  
**Rationale**: Reality Domain requires accurate work tracking. Can't improve what we don't measure.

---

*These decisions shaped the implementation and will guide future work*
### [19:38:59] Make session tracking constitutionally mandatory
**Rationale**: Reality Domain requires truth about work performed
