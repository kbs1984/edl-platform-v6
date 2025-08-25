---
created: '2025-08-23'
domain: core
priority: P1
purpose: Document supabase agent enhancement specification
session: '00057'
status: current
title: Supabase Agent Enhancement Specification
topics:
- documentation
type: guide
---

# Supabase Agent Enhancement Specification
**Session**: 00057  
**Priority**: CRITICAL  
**Impact**: Enables accurate masterplan execution guidance  

## Problem Statement

The current Supabase Agent interprets RLS-protected tables as "access failures" instead of "security working correctly." This leads to incorrect masterplan guidance and wasted session time.

## Enhancement Requirements

### 1. Migration File Parsing (Level 0.5 - New)

```python
def discover_level_05_migration_reality(self) -> Dict[str, Any]:
    """Level 0.5: Parse migration files as source of truth"""
    
    # Read completed migration batches
    migrations_dir = self.project_root / "migrations" / "batches"
    completed_files = list(migrations_dir.glob("done-batch-*.sql"))
    
    expected_schema = {}
    for batch_file in completed_files:
        expected_schema.update(self._parse_migration_batch(batch_file))
    
    return {
        "expected_tables": list(expected_schema.keys()),
        "migration_batches_completed": len(completed_files),
        "source_authority": "migration_files",
        "confidence": 1.0  # Migration files are authoritative
    }

def _parse_migration_batch(self, batch_file: Path) -> Dict[str, Dict]:
    """Parse SQL batch file to extract expected schema"""
    sql_content = batch_file.read_text()
    
    # Extract CREATE TABLE statements
    tables = {}
    create_patterns = [
        r"CREATE TABLE\s+(\w+\.\w+|\w+)\s*\(",
        r"CREATE TABLE IF NOT EXISTS\s+(\w+\.\w+|\w+)\s*\("
    ]
    
    for pattern in create_patterns:
        matches = re.findall(pattern, sql_content, re.IGNORECASE)
        for match in matches:
            table_name = match.split('.')[-1]  # Remove schema prefix
            tables[table_name] = {"source": batch_file.name}
    
    return tables
```

### 2. RLS-Intelligent Analysis (Level 2 Enhancement)

```python
def discover_level_2_enhanced(self) -> Dict[str, Any]:
    """Level 2: Migration-aware table discovery with RLS interpretation"""
    
    # Get expected schema from migration files
    level_05 = self.discover_level_05_migration_reality()
    expected_tables = level_05["expected_tables"]
    
    result = {
        "expected_vs_actual": {},
        "security_status": {},
        "masterplan_guidance": []
    }
    
    for table in expected_tables:
        try:
            # Test API access
            response = self._make_api_call(f"/{table}?limit=1")
            result["expected_vs_actual"][table] = {
                "expected": True,
                "accessible": True,
                "security_status": "❌ RLS NOT WORKING - SECURITY GAP"
            }
            
        except Exception as e:
            if 'PGRST205' in str(e) or 'Could not find' in str(e):
                result["expected_vs_actual"][table] = {
                    "expected": True,
                    "accessible": False,
                    "security_status": "✅ RLS WORKING - Security protecting table"
                }
            else:
                result["expected_vs_actual"][table] = {
                    "expected": True,
                    "accessible": False,
                    "security_status": f"❌ TABLE MISSING - {str(e)[:50]}"
                }
    
    # Generate masterplan-specific guidance
    result["masterplan_guidance"] = self._generate_masterplan_guidance(result)
    
    return result

def _generate_masterplan_guidance(self, analysis: Dict) -> List[str]:
    """Generate specific guidance for auth/dashboard masterplan"""
    guidance = []
    
    # Check critical auth tables
    critical_tables = ['profile', 'student', 'team', 'guardian']
    missing_tables = []
    
    for table in critical_tables:
        if table in analysis["expected_vs_actual"]:
            status = analysis["expected_vs_actual"][table]["security_status"]
            if "TABLE MISSING" in status:
                missing_tables.append(table)
    
    if missing_tables:
        guidance.append(f"❌ BLOCKER: Run remaining migration batches for tables: {missing_tables}")
    else:
        guidance.append("✅ Core auth tables deployed - proceed with Phase 1")
    
    # Check if profile creation fix is needed
    if 'profile' in analysis["expected_vs_actual"]:
        guidance.append("⚠️ VERIFY: Profile creation trigger (FIX-PROFILE-CREATION.sql may be needed)")
    
    return guidance
```

### 3. Session Context Integration

```python
def check_session_fixes(self) -> Dict[str, Any]:
    """Check for known fixes from previous sessions"""
    
    fixes_applied = {}
    
    # Check for Session 44's profile fix
    fix_files = [
        "FIX-PROFILE-CREATION.sql",
        "PROFILE-FIX-SUCCESS-REPORT.md"
    ]
    
    for fix_file in fix_files:
        fix_path = self.project_root / fix_file
        if fix_path.exists():
            fixes_applied[fix_file] = {
                "exists": True,
                "last_modified": fix_path.stat().st_mtime,
                "status": "Available for deployment"
            }
        else:
            fixes_applied[fix_file] = {
                "exists": False,
                "status": "Missing - may need to be recreated"
            }
    
    return fixes_applied
```

## Implementation Priority

1. **Phase 1** (This Session): Create the spec file (this document)
2. **Phase 2** (Next Session): Implement Level 0.5 migration parsing  
3. **Phase 3**: Enhance Level 2 with RLS intelligence
4. **Phase 4**: Add session context integration

## Expected Benefits

1. **Accurate Guidance**: "Deploy FIX-PROFILE-CREATION.sql" instead of "Database unreachable"
2. **Time Savings**: No more sessions wasted on "rediscovering" existing solutions
3. **Masterplan Alignment**: Specific guidance for auth gateway deployment
4. **Truth Alignment**: Migration files are authoritative source of truth

## Testing Protocol

```bash
# Test enhanced agent
SUPABASE_URL="https://bbrheacetxlnqbibjwsz.supabase.co" \
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
python3 reality/agent-reality-auditor/supabase-connector/connector.py --level 2

# Expected output:
# ✅ profile: RLS PROTECTED (table exists, security working)
# ✅ student: RLS PROTECTED (table exists, security working)  
# ⚠️ VERIFY: Profile creation trigger may need FIX-PROFILE-CREATION.sql
# ✅ GUIDANCE: Proceed with auth gateway Phase 1 deployment
```

## Success Criteria

- [ ] Agent correctly interprets PGRST205 as "security working"
- [ ] Agent reads migration files as authoritative source
- [ ] Agent provides specific masterplan guidance
- [ ] Agent references Session 44 fixes when relevant
- [ ] Integration Agent shows 98%+ health with enhanced Supabase Agent

---

This enhancement transforms the Supabase Agent from "connection tester" to "masterplan execution advisor."