---
session: "00104"
type: "integration-guide"
status: "proposed"
created: "2025-08-29"
title: "MCP Server Integration with Reality Agents"
purpose: "Define how Supabase MCP server enhances Reality Agent capabilities"
topics: ["mcp-integration", "reality-agents", "supabase", "ddl-operations"]
priority: "P1"
domain: "reality"
---

# MCP Server Integration with Reality Agents

**Created**: Session 104
**Purpose**: Enhance Reality Agent's Supabase capabilities with MCP server
**Status**: MCP server operational, integration proposed

---

## 📊 Current Reality Agent Limitations

### Existing Supabase Agent (`scripts/00028-reality-check.sh`)
```python
# Current implementation uses anon key:
- Can query data (respecting RLS)
- Can check basic connectivity
- Cannot execute DDL
- Cannot see full schema
- Cannot verify RLS policies
```

### Pain Points:
1. Cannot verify database state changes
2. Cannot apply fixes autonomously
3. Limited to read operations
4. No visibility into RLS configuration

---

## 🚀 Enhanced Reality Agent with MCP

### Architecture Overview
```
┌─────────────────────────────────────┐
│         Reality Agent System         │
├─────────────────────────────────────┤
│  FileSystem │ GitHub │ Integration  │
├─────────────────────────────────────┤
│        Enhanced Supabase Agent       │
│  ┌─────────────┬─────────────────┐  │
│  │  Data Ops   │    DDL Ops      │  │
│  │ (Anon Key)  │  (MCP Server)   │  │
│  └─────────────┴─────────────────┘  │
└─────────────────────────────────────┘
```

---

## 🔧 Implementation Options

### Option 1: Augment Existing Agent (Recommended)

**File**: `reality/agent-reality-auditor/supabase-connector/enhanced-connector.py`

```python
#!/usr/bin/env python3
"""
Enhanced Supabase Reality Agent with MCP Integration
Combines existing anon key access with MCP DDL capabilities
"""

import os
import json
import subprocess
from datetime import datetime
from supabase import create_client

class EnhancedSupabaseAgent:
    def __init__(self):
        # Existing anon key client for data operations
        self.url = os.getenv('SUPABASE_URL')
        self.anon_key = os.getenv('SUPABASE_ANON_KEY')
        self.client = create_client(self.url, self.anon_key)
        
        # MCP server name
        self.mcp_server = "supabase-dev"
    
    def execute_mcp_tool(self, tool_name, params=None):
        """Execute MCP tool through Claude CLI"""
        cmd = ["claude", "mcp", "call", self.mcp_server, tool_name]
        if params:
            cmd.extend(["--params", json.dumps(params)])
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        return json.loads(result.stdout) if result.returncode == 0 else None
    
    # ===== SCHEMA OPERATIONS (MCP) =====
    
    def get_full_schema(self):
        """Get complete schema information using MCP"""
        return self.execute_mcp_tool("list_tables", {"schemas": ["public"]})
    
    def check_rls_status(self):
        """Check RLS status for all tables"""
        tables = self.get_full_schema()
        return {
            table['name']: table['rls_enabled'] 
            for table in tables
        }
    
    def verify_columns(self, table_name):
        """Verify columns and types for a specific table"""
        schema = self.get_full_schema()
        for table in schema:
            if table['name'] == table_name:
                return {
                    'columns': table['columns'],
                    'primary_keys': table['primary_keys'],
                    'foreign_keys': table['foreign_key_constraints']
                }
        return None
    
    # ===== DDL OPERATIONS (MCP) =====
    
    def apply_ddl(self, name, sql):
        """Execute DDL operation through MCP"""
        return self.execute_mcp_tool("apply_migration", {
            "name": name,
            "query": sql
        })
    
    def fix_security_definer(self, function_name):
        """Apply SECURITY DEFINER to a function"""
        sql = f"""
        ALTER FUNCTION {function_name} SECURITY DEFINER;
        ALTER FUNCTION {function_name} SET search_path = public;
        """
        return self.apply_ddl(f"fix_security_{function_name}", sql)
    
    def create_policy(self, table, policy_name, operation, check):
        """Create an RLS policy"""
        sql = f"""
        CREATE POLICY {policy_name} 
        ON {table} 
        FOR {operation} 
        {check};
        """
        return self.apply_ddl(f"create_policy_{policy_name}", sql)
    
    # ===== DATA OPERATIONS (Anon Key) =====
    
    def test_insert(self, table, data):
        """Test insert operation (respects RLS)"""
        try:
            result = self.client.table(table).insert(data).execute()
            return {"success": True, "data": result.data}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def test_select(self, table, filters=None):
        """Test select operation (respects RLS)"""
        try:
            query = self.client.table(table).select("*")
            if filters:
                for key, value in filters.items():
                    query = query.eq(key, value)
            result = query.execute()
            return {"success": True, "count": len(result.data)}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    # ===== COMPREHENSIVE HEALTH CHECK =====
    
    def comprehensive_health_check(self):
        """Full system health check using both MCP and anon key"""
        report = {
            "timestamp": datetime.now().isoformat(),
            "schema_health": {},
            "rls_health": {},
            "data_health": {},
            "issues": []
        }
        
        # Schema check via MCP
        schema = self.get_full_schema()
        report["schema_health"]["table_count"] = len(schema)
        report["schema_health"]["tables"] = [t['name'] for t in schema]
        
        # RLS check via MCP
        rls_status = self.check_rls_status()
        report["rls_health"]["enabled_count"] = sum(1 for v in rls_status.values() if v)
        report["rls_health"]["disabled_tables"] = [k for k, v in rls_status.items() if not v]
        
        # Data access check via anon key
        critical_tables = ['profile', 'student', 'school']
        for table in critical_tables:
            test = self.test_select(table)
            report["data_health"][table] = test
            if not test["success"] and "PGRST205" not in test.get("error", ""):
                report["issues"].append(f"Cannot access {table}: {test.get('error')}")
        
        # Check for Session 103 issues
        if 'student' in [t['name'] for t in schema]:
            student_schema = self.verify_columns('student')
            if student_schema:
                columns = [c['name'] for c in student_schema['columns']]
                if 'call_sign' not in columns:
                    report["issues"].append("Missing call_sign column in student table")
                if 'grade_level' not in columns:
                    report["issues"].append("Missing grade_level column in student table")
        
        return report
```

---

### Option 2: Standalone MCP Reality Module

**File**: `reality/mcp-reality-module.py`

```python
#!/usr/bin/env python3
"""
MCP-based Reality Module for DDL Operations
Runs independently or integrates with main Reality Agent
"""

class MCPRealityModule:
    def __init__(self):
        self.migrations_applied = []
    
    def diagnose_session_103_issues(self):
        """Diagnose and fix issues from Session 103"""
        fixes_needed = []
        
        # Check school search function
        # Note: Can't directly query pg_proc, but can test function
        test_search = self.test_rpc_function("search_school", {"query": "test"})
        if not test_search["success"]:
            fixes_needed.append({
                "issue": "School search not working",
                "fix": "ALTER FUNCTION search_school(text) SECURITY DEFINER"
            })
        
        # Check student insert policies
        schema = self.get_table_info("student")
        if schema and schema["rls_enabled"]:
            # We know RLS is on but can't see specific policies
            # Test with actual insert attempt
            test_insert = self.test_student_insert()
            if not test_insert["success"]:
                fixes_needed.append({
                    "issue": "Student insert blocked",
                    "fix": "CREATE POLICY for INSERT on student table"
                })
        
        return fixes_needed
    
    def apply_session_103_fixes(self):
        """Apply all fixes identified from Session 103"""
        fixes = self.diagnose_session_103_issues()
        
        for fix in fixes:
            if "school search" in fix["issue"]:
                self.apply_migration(
                    "fix_school_search_security",
                    fix["fix"]
                )
            elif "Student insert" in fix["issue"]:
                self.apply_migration(
                    "fix_student_insert_policy",
                    """
                    DROP POLICY IF EXISTS student_insert_own ON student;
                    CREATE POLICY student_insert_authenticated 
                    ON student FOR INSERT TO authenticated 
                    WITH CHECK (user_id = auth.uid());
                    """
                )
        
        return {"fixes_applied": len(fixes), "details": fixes}
```

---

## 📊 Integration with Session Startup

### Enhanced `00028-reality-check.sh`

```bash
#!/bin/bash
# Enhanced Reality Check with MCP Integration

echo "=== Reality Check with MCP Enhancement ==="

# Original reality checks
python3 reality/agent-reality-auditor/filesystem.py
python3 reality/agent-reality-auditor/github.py

# Enhanced Supabase check with MCP
echo "Running enhanced Supabase check with MCP..."
python3 -c "
from enhanced_connector import EnhancedSupabaseAgent
agent = EnhancedSupabaseAgent()
report = agent.comprehensive_health_check()

print('📊 Database State:')
print(f'  Tables: {report[\"schema_health\"][\"table_count\"]}')
print(f'  RLS Enabled: {report[\"rls_health\"][\"enabled_count\"]}')
print(f'  Issues: {len(report[\"issues\"])}')

if report['issues']:
    print('\\n⚠️ Issues Found:')
    for issue in report['issues']:
        print(f'  - {issue}')
"

# Check if MCP server is connected
claude mcp list | grep -q "supabase-dev.*Connected" && {
    echo "✅ MCP Server: Connected"
} || {
    echo "❌ MCP Server: Not connected"
    echo "Run: claude mcp add supabase-dev ..."
}
```

---

## 🎯 Use Cases

### 1. **Automatic Issue Detection & Fixing**
```python
# In session startup:
agent = EnhancedSupabaseAgent()
issues = agent.diagnose_session_103_issues()
if issues:
    print(f"Found {len(issues)} issues from previous sessions")
    if confirm("Apply fixes?"):
        agent.apply_session_103_fixes()
```

### 2. **Schema Verification**
```python
# Verify expected schema matches reality:
expected_tables = ['profile', 'student', 'guardian', 'school', 'team']
actual = agent.get_full_schema()
actual_names = [t['name'] for t in actual]

missing = set(expected_tables) - set(actual_names)
if missing:
    print(f"Missing tables: {missing}")
```

### 3. **RLS Policy Validation**
```python
# Ensure critical tables have RLS enabled:
rls_status = agent.check_rls_status()
critical_tables = ['profile', 'student', 'guardian']

for table in critical_tables:
    if not rls_status.get(table, False):
        print(f"⚠️ {table} has RLS DISABLED!")
        agent.apply_ddl(
            f"enable_rls_{table}",
            f"ALTER TABLE {table} ENABLE ROW LEVEL SECURITY;"
        )
```

---

## 📈 Benefits of Integration

### Before (Reality Agent alone):
- ❌ Cannot verify actual database state
- ❌ Cannot apply fixes
- ❌ Limited to connectivity checks
- ❌ No DDL capabilities

### After (Reality Agent + MCP):
- ✅ Full schema introspection
- ✅ Apply DDL fixes automatically
- ✅ Track all changes
- ✅ Verify RLS configuration
- ✅ Test and fix in same session

---

## 🚀 Next Steps

1. **Implement Enhanced Connector**
   - Create `enhanced-connector.py`
   - Test with Session 103 issues

2. **Update Startup Scripts**
   - Modify `00028-reality-check.sh`
   - Add MCP status check

3. **Create Fix Library**
   - Common DDL fixes
   - RLS policy templates
   - Security definer applications

4. **Document Patterns**
   - When to use MCP vs anon key
   - Safety checks before DDL
   - Rollback procedures

---

**Integration Status**: MCP server ready, integration patterns defined, awaiting implementation.