#!/usr/bin/env python3
"""
Supabase Reality Agent - Connector Module
Progressive discovery of Supabase database reality with no assumptions
"""

import subprocess
import json
import os
import sys
import re
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional, Dict, Any, List
import hashlib
import time

class SupabaseConnector:
    """Reality-based Supabase connector with progressive discovery"""
    
    # Cache TTL in seconds
    CACHE_TTL = {
        "connection": 60,      # 1 minute for connection status
        "tables": 300,         # 5 minutes for table list  
        "schema": 300,         # 5 minutes for schema details
        "row_counts": 60,      # 1 minute for counts (changes frequently)
    }
    
    def __init__(self):
        """Initialize connector with environment credentials"""
        self.url = os.getenv("SUPABASE_URL")
        self.key = os.getenv("SUPABASE_ANON_KEY")
        self.service_key = os.getenv("SUPABASE_SERVICE_KEY")
        
        if not self.url or not self.key:
            raise ValueError("REALITY_001: Missing credentials (SUPABASE_URL and SUPABASE_ANON_KEY required)")
        
        self.project_root = Path(__file__).parent.parent.parent.parent
        self.cache_dir = Path(__file__).parent / ".cache"
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        
        self.session_id = self._generate_session_id()
        self.discovery_level = 0
        
    def _generate_session_id(self) -> str:
        """Generate unique session ID for this connection"""
        timestamp = datetime.now().isoformat()
        unique_str = f"{self.url}-{timestamp}-{os.getpid()}"
        return hashlib.md5(unique_str.encode()).hexdigest()[:8]
    
    def _get_cache_path(self, cache_type: str) -> Path:
        """Get cache file path for given type"""
        return self.cache_dir / f"{cache_type}_{self.session_id}.json"
    
    def _is_cache_valid(self, cache_type: str) -> bool:
        """Check if cache is still valid based on TTL"""
        cache_path = self._get_cache_path(cache_type)
        
        if not cache_path.exists():
            return False
        
        try:
            cache_data = json.loads(cache_path.read_text())
            cached_time = datetime.fromisoformat(cache_data.get("timestamp", ""))
            ttl_seconds = self.CACHE_TTL.get(cache_type, 300)
            
            if datetime.now() - cached_time < timedelta(seconds=ttl_seconds):
                return True
                
        except (json.JSONDecodeError, ValueError):
            pass
        
        return False
    
    def _get_cached_data(self, cache_type: str) -> Optional[Dict[str, Any]]:
        """Retrieve cached data if valid"""
        if self._is_cache_valid(cache_type):
            try:
                return json.loads(self._get_cache_path(cache_type).read_text())
            except Exception:
                pass
        return None
    
    def _save_cache(self, cache_type: str, data: Dict[str, Any]) -> None:
        """Save data to cache with timestamp"""
        data["timestamp"] = datetime.now().isoformat()
        cache_path = self._get_cache_path(cache_type)
        cache_path.write_text(json.dumps(data, indent=2))
    
    def _make_api_call(self, endpoint: str, headers: Optional[Dict] = None) -> Dict[str, Any]:
        """Make API call to Supabase REST API"""
        if headers is None:
            headers = {}
        
        headers.update({
            "apikey": self.service_key if self.service_key else self.key,
            "Content-Type": "application/json"
        })
        
        full_url = f"{self.url}/rest/v1{endpoint}"
        
        # Build curl command
        curl_cmd = ["curl", "-s", "-X", "GET", full_url]
        for key, value in headers.items():
            curl_cmd.extend(["-H", f"{key}: {value}"])
        
        try:
            result = subprocess.run(
                curl_cmd,
                capture_output=True,
                text=True,
                timeout=10
            )
            
            if result.returncode == 0:
                try:
                    return json.loads(result.stdout)
                except json.JSONDecodeError:
                    return {"raw_response": result.stdout, "error": "Invalid JSON response"}
            else:
                return {"error": f"API call failed: {result.stderr}"}
                
        except subprocess.TimeoutExpired:
            return {"error": "REALITY_002: Request timeout"}
        except Exception as e:
            return {"error": f"REALITY_001: {str(e)}"}
    
    def discover_level_01_backup_reality(self) -> Dict[str, Any]:
        """Level 0.1: Parse backup file as ultimate source of truth (Session 57 Backup-Centric)"""
        
        result = {
            "metadata": {
                "timestamp": datetime.now().isoformat(),
                "agent": "supabase-reality",
                "check_type": "level_01_backup_reality",
                "session_id": self.session_id,
                "confidence_score": 1.0  # Backup file is ultimate truth
            },
            "ultimate_truth": {
                "backup_file_exists": False,
                "tables": [],
                "functions": [],
                "schemas": [],
                "roles": [],
                "file_size_mb": 0,
                "line_count": 0
            },
            "authority": "backup_file"
        }
        
        # Find backup file
        backup_file = self.project_root / "migrations" / "supabase-project.backup"
        if not backup_file.exists():
            result["error"] = "REALITY_CRITICAL: Ultimate source of truth (backup file) missing"
            result["metadata"]["confidence_score"] = 0.0
            result["critical_warning"] = "Cannot assess true completeness without backup file"
            return result
        
        try:
            # Parse backup file
            backup_content = backup_file.read_text(encoding='utf-8', errors='ignore')
            result["ultimate_truth"]["backup_file_exists"] = True
            result["ultimate_truth"]["file_size_mb"] = backup_file.stat().st_size / (1024 * 1024)
            result["ultimate_truth"]["line_count"] = len(backup_content.splitlines())
            
            # Extract comprehensive schema information
            tables, functions, schemas, roles = self._parse_backup_file(backup_content)
            
            result["ultimate_truth"]["tables"] = sorted(list(tables))
            result["ultimate_truth"]["functions"] = sorted(list(functions))
            result["ultimate_truth"]["schemas"] = sorted(list(schemas))
            result["ultimate_truth"]["roles"] = sorted(list(roles))
            
            result["summary"] = {
                "total_tables": len(tables),
                "total_functions": len(functions),
                "total_schemas": len(schemas),
                "total_roles": len(roles)
            }
            
        except Exception as e:
            result["error"] = f"REALITY_006: Failed to parse backup file: {str(e)}"
            result["metadata"]["confidence_score"] = 0.0
        
        return result
    
    def _parse_backup_file(self, content: str) -> tuple[set, set, set, set]:
        """Parse PostgreSQL backup file for complete schema inventory"""
        
        tables = set()
        functions = set()
        schemas = set()
        roles = set()
        
        lines = content.splitlines()
        
        for line in lines:
            line_stripped = line.strip()
            
            # Skip comments and empty lines
            if not line_stripped or line_stripped.startswith('--'):
                continue
            
            # Extract CREATE TABLE statements (more comprehensive patterns)
            table_patterns = [
                r"CREATE TABLE\s+(?:IF NOT EXISTS\s+)?(?:(\w+)\.)?(\w+)\s*\(",
                r"CREATE TABLE\s+(?:public\.)?(\w+)\s*\(",
                r"CREATE UNLOGGED TABLE\s+(?:(\w+)\.)?(\w+)\s*\("
            ]
            
            for pattern in table_patterns:
                matches = re.findall(pattern, line_stripped, re.IGNORECASE)
                for match in matches:
                    if isinstance(match, tuple):
                        # Handle schema.table format
                        schema, table = match if len(match) == 2 else (None, match[0])
                        if schema and schema not in ['information_schema', 'pg_catalog']:
                            schemas.add(schema)
                        if table and not table.startswith('pg_'):
                            tables.add(table)
                    else:
                        # Handle simple table name
                        if match and not match.startswith('pg_'):
                            tables.add(match)
            
            # Extract CREATE FUNCTION statements
            function_patterns = [
                r"CREATE\s+(?:OR\s+REPLACE\s+)?FUNCTION\s+(?:(\w+)\.)?(\w+)\s*\(",
                r"CREATE\s+FUNCTION\s+(\w+)\s*\("
            ]
            
            for pattern in function_patterns:
                matches = re.findall(pattern, line_stripped, re.IGNORECASE)
                for match in matches:
                    if isinstance(match, tuple):
                        schema, func = match if len(match) == 2 else (None, match[0])
                        if schema and schema not in ['information_schema', 'pg_catalog']:
                            schemas.add(schema)
                        if func:
                            functions.add(func)
                    else:
                        if match:
                            functions.add(match)
            
            # Extract CREATE SCHEMA statements
            schema_patterns = [
                r"CREATE SCHEMA\s+(?:IF NOT EXISTS\s+)?(\w+)",
                r"CREATE SCHEMA\s+(\w+)"
            ]
            
            for pattern in schema_patterns:
                matches = re.findall(pattern, line_stripped, re.IGNORECASE)
                for match in matches:
                    if match not in ['information_schema', 'pg_catalog']:
                        schemas.add(match)
            
            # Extract CREATE ROLE statements
            role_patterns = [
                r"CREATE ROLE\s+(\w+)",
                r"CREATE USER\s+(\w+)"
            ]
            
            for pattern in role_patterns:
                matches = re.findall(pattern, line_stripped, re.IGNORECASE)
                for match in matches:
                    if not match.startswith('pg_') and match not in ['postgres']:
                        roles.add(match)
        
        return tables, functions, schemas, roles
    
    def discover_level_05_migration_reality(self) -> Dict[str, Any]:
        """Level 0.5: Compare migration extraction vs backup file completeness (Session 57 Backup-Centric)"""
        
        # Get ultimate truth from backup file first
        backup_reality = self.discover_level_01_backup_reality()
        
        result = {
            "metadata": {
                "timestamp": datetime.now().isoformat(),
                "agent": "supabase-reality",
                "check_type": "level_05_extraction_completeness",
                "session_id": self.session_id,
                "confidence_score": 0.0  # Will be calculated based on extraction completeness
            },
            "backup_authority": backup_reality.get("authority", "unknown"),
            "extraction_analysis": {
                "batches_completed": 0,
                "extracted_tables": [],
                "extracted_functions": [],
                "completeness_pct": 0.0,
                "missing_from_extraction": {
                    "tables": [],
                    "functions": []
                }
            },
            "session_fixes": {}
        }
        
        # If backup file analysis failed, we can't assess completeness
        if "error" in backup_reality:
            result["error"] = "REALITY_CRITICAL: Cannot assess extraction completeness without backup file"
            result["metadata"]["confidence_score"] = 0.0
            result["critical_warning"] = "Working blind without backup file truth"
            return result
        
        # Get backup truth data
        backup_tables = set(backup_reality.get("ultimate_truth", {}).get("tables", []))
        backup_functions = set(backup_reality.get("ultimate_truth", {}).get("functions", []))
        
        # Parse migration batches
        migrations_dir = self.project_root / "migrations" / "batches"
        if not migrations_dir.exists():
            result["error"] = "REALITY_005: No migrations/batches directory found"
            result["metadata"]["confidence_score"] = 0.0
            return result
        
        completed_files = sorted(migrations_dir.glob("done-batch-*.sql"))
        result["extraction_analysis"]["batches_completed"] = len(completed_files)
        
        extracted_tables = set()
        extracted_functions = set()
        
        for batch_file in completed_files:
            try:
                tables, functions = self._parse_migration_batch(batch_file)
                extracted_tables.update(tables)
                extracted_functions.update(functions)
            except Exception as e:
                # Continue parsing other files even if one fails
                pass
        
        result["extraction_analysis"]["extracted_tables"] = sorted(list(extracted_tables))
        result["extraction_analysis"]["extracted_functions"] = sorted(list(extracted_functions))
        
        # Calculate extraction completeness
        if backup_tables or backup_functions:
            table_completeness = len(extracted_tables & backup_tables) / len(backup_tables) if backup_tables else 1.0
            function_completeness = len(extracted_functions & backup_functions) / len(backup_functions) if backup_functions else 1.0
            
            # Overall completeness (weighted average)
            overall_completeness = (table_completeness * 0.6 + function_completeness * 0.4) * 100
            result["extraction_analysis"]["completeness_pct"] = round(overall_completeness, 1)
        else:
            result["extraction_analysis"]["completeness_pct"] = 0.0
        
        # Identify what's missing from extraction
        result["extraction_analysis"]["missing_from_extraction"]["tables"] = sorted(list(backup_tables - extracted_tables))
        result["extraction_analysis"]["missing_from_extraction"]["functions"] = sorted(list(backup_functions - extracted_functions))
        
        # Set confidence based on extraction completeness
        completeness = result["extraction_analysis"]["completeness_pct"]
        if completeness >= 95:
            result["metadata"]["confidence_score"] = 0.95
        elif completeness >= 80:
            result["metadata"]["confidence_score"] = 0.8
        elif completeness >= 50:
            result["metadata"]["confidence_score"] = 0.6
        else:
            result["metadata"]["confidence_score"] = 0.3
        
        # Check for session fixes
        result["session_fixes"] = self._check_session_fixes()
        
        # Add extraction quality assessment
        result["extraction_quality"] = self._assess_extraction_quality(
            backup_reality, extracted_tables, extracted_functions
        )
        
        return result
    
    def _assess_extraction_quality(self, backup_reality: Dict, extracted_tables: set, extracted_functions: set) -> Dict:
        """Assess the quality and completeness of the extraction"""
        
        backup_summary = backup_reality.get("summary", {})
        backup_tables = set(backup_reality.get("ultimate_truth", {}).get("tables", []))
        backup_functions = set(backup_reality.get("ultimate_truth", {}).get("functions", []))
        
        quality = {
            "extraction_status": "unknown",
            "critical_gaps": [],
            "recommended_action": "unknown"
        }
        
        tables_extracted = len(extracted_tables & backup_tables)
        functions_extracted = len(extracted_functions & backup_functions)
        
        table_pct = (tables_extracted / len(backup_tables)) * 100 if backup_tables else 100
        function_pct = (functions_extracted / len(backup_functions)) * 100 if backup_functions else 100
        
        # Check for critical auth tables
        critical_auth_tables = {'profile', 'student', 'guardian', 'team', 'judge'}
        missing_critical_tables = critical_auth_tables - extracted_tables
        
        if table_pct >= 95 and function_pct >= 90:
            quality["extraction_status"] = "complete"
            quality["recommended_action"] = "proceed_with_confidence"
        elif table_pct >= 80 and function_pct >= 70:
            quality["extraction_status"] = "mostly_complete"
            quality["recommended_action"] = "proceed_with_caution"
        elif missing_critical_tables:
            quality["extraction_status"] = "critically_incomplete"
            quality["critical_gaps"].append(f"Missing critical auth tables: {missing_critical_tables}")
            quality["recommended_action"] = "complete_extraction_first"
        else:
            quality["extraction_status"] = "incomplete"
            quality["recommended_action"] = "significant_extraction_work_needed"
        
        # Add specific gaps
        if table_pct < 90:
            quality["critical_gaps"].append(f"Only {table_pct:.1f}% of tables extracted")
        if function_pct < 80:
            quality["critical_gaps"].append(f"Only {function_pct:.1f}% of functions extracted")
            
        return quality
    
    def _parse_migration_batch(self, batch_file: Path) -> tuple[set, set]:
        """Parse SQL batch file to extract expected schema elements"""
        
        sql_content = batch_file.read_text()
        
        # Extract CREATE TABLE statements
        tables = set()
        create_table_patterns = [
            r"CREATE TABLE\s+(?:IF NOT EXISTS\s+)?(?:public\.)?(\w+)\s*\(",
            r"CREATE TABLE\s+(?:IF NOT EXISTS\s+)?(\w+)\s*\("
        ]
        
        for pattern in create_table_patterns:
            matches = re.findall(pattern, sql_content, re.IGNORECASE | re.MULTILINE)
            for match in matches:
                table_name = match.strip()
                if table_name and not table_name.lower().startswith('pg_'):
                    tables.add(table_name)
        
        # Extract CREATE FUNCTION statements
        functions = set()
        create_function_patterns = [
            r"CREATE\s+(?:OR\s+REPLACE\s+)?FUNCTION\s+(?:public\.)?(\w+)\s*\(",
            r"CREATE\s+FUNCTION\s+(\w+)\s*\("
        ]
        
        for pattern in create_function_patterns:
            matches = re.findall(pattern, sql_content, re.IGNORECASE | re.MULTILINE)
            for match in matches:
                function_name = match.strip()
                if function_name:
                    functions.add(function_name)
        
        return tables, functions
    
    def _check_session_fixes(self) -> Dict[str, Any]:
        """Check for known fixes from previous sessions (Session 57 Enhancement)"""
        
        fixes = {}
        
        # Session 44: Profile creation fix
        profile_fix = self.project_root / "FIX-PROFILE-CREATION.sql"
        if profile_fix.exists():
            fixes["profile_creation_fix"] = {
                "file": "FIX-PROFILE-CREATION.sql",
                "session": 44,
                "status": "available_for_deployment",
                "last_modified": profile_fix.stat().st_mtime,
                "purpose": "Fixes profile creation after auth signup"
            }
        
        # Session 55: Function fixes
        function_fixes = [
            "00055-COMPLETE-FUNCTION-FIXES.sql",
            "00055-CRITICAL-BUSINESS-LOGIC.sql"
        ]
        
        for fix_file in function_fixes:
            fix_path = self.project_root / fix_file
            if fix_path.exists():
                fixes[f"function_fix_{fix_file.replace('.sql', '').replace('00055-', '')}"] = {
                    "file": fix_file,
                    "session": 55,
                    "status": "available_for_deployment",
                    "last_modified": fix_path.stat().st_mtime,
                    "purpose": "Database function completeness fixes"
                }
        
        return fixes
    
    def _generate_masterplan_guidance(self, analysis: Dict, migration_reality: Dict) -> List[str]:
        """Generate backup-aware masterplan guidance (Session 57 Backup-Centric)"""
        
        guidance = []
        security_analysis = analysis.get("security_analysis", {})
        expected_vs_actual = analysis.get("expected_vs_actual", {})
        
        # NEW: Get extraction analysis from Level 0.5
        extraction_analysis = migration_reality.get("extraction_analysis", {})
        extraction_quality = migration_reality.get("extraction_quality", {})
        completeness_pct = extraction_analysis.get("completeness_pct", 0)
        
        # 1. FIRST PRIORITY: Check backup file extraction completeness
        guidance.append("🔍 EXTRACTION COMPLETENESS vs BACKUP FILE:")
        guidance.append(f"   Completeness: {completeness_pct:.1f}% of backup file extracted")
        
        if completeness_pct < 80:
            guidance.append(f"❌ CRITICAL BLOCKER: Only {completeness_pct:.1f}% of backup file extracted")
            guidance.append("   → RISK: Unknown features/logic will break in production")
            guidance.append("   → ACTION: Complete backup extraction before ANY deployment")
            guidance.append("   → CHECK: migrations/supabase-project.backup for missing elements")
            
            missing_tables = extraction_analysis.get("missing_from_extraction", {}).get("tables", [])
            missing_functions = extraction_analysis.get("missing_from_extraction", {}).get("functions", [])
            
            if missing_tables:
                guidance.append(f"   → MISSING TABLES: {missing_tables[:5]}{'...' if len(missing_tables) > 5 else ''}")
            if missing_functions:
                guidance.append(f"   → MISSING FUNCTIONS: {missing_functions[:3]}{'...' if len(missing_functions) > 3 else ''}")
                
            guidance.append("")
            guidance.append("🎯 AUTH MASTERPLAN READINESS: ❌ NOT READY - EXTRACTION INCOMPLETE")
            guidance.append("   → Must reach 80%+ extraction before proceeding")
            return guidance  # Stop here - can't proceed with incomplete extraction
        
        elif completeness_pct < 95:
            guidance.append(f"⚠️ CAUTION: {completeness_pct:.1f}% extracted - some features may be missing")
            guidance.append("   → RECOMMEND: Verify missing elements before production")
            guidance.append("   → ACCEPTABLE: Can proceed with heightened caution")
        else:
            guidance.append(f"✅ EXTRACTION EXCELLENT: {completeness_pct:.1f}% - comprehensive coverage")
        
        # 2. Check deployed vs extracted (security analysis)
        security_score = security_analysis.get("security_score", 0)
        
        guidance.append("")
        guidance.append("🔒 DEPLOYMENT SECURITY vs EXTRACTED SCHEMA:")
        
        # Check critical auth tables
        critical_auth_tables = ['profile', 'student', 'team', 'guardian', 'judge']
        missing_critical = []
        insecure_critical = []
        protected_critical = []
        
        for table in critical_auth_tables:
            if table in expected_vs_actual:
                table_info = expected_vs_actual[table]
                security_status = table_info.get("security_status", "")
                
                if "TABLE MISSING" in security_status:
                    missing_critical.append(table)
                elif "RLS NOT WORKING" in security_status:
                    insecure_critical.append(table)
                elif "RLS PROTECTING" in security_status:
                    protected_critical.append(table)
        
        if missing_critical:
            guidance.append(f"❌ DEPLOYMENT BLOCKER: Critical tables missing: {missing_critical}")
            guidance.append("   → ACTION: Run remaining migration batches")
            guidance.append("   → CHECK: migrations/batches/ for done-batch-*.sql files")
            return guidance  # Can't proceed without basic tables
        
        if insecure_critical:
            guidance.append(f"❌ SECURITY BLOCKER: Unprotected tables: {insecure_critical}")
            guidance.append("   → ACTION: Deploy RLS policies immediately")
            guidance.append("   → CHECK: migrations/batches/done-batch-08-rls-corrected.sql")
        
        if protected_critical:
            guidance.append(f"✅ SECURITY GOOD: {len(protected_critical)} critical tables properly protected")
        
        # 3. Overall readiness assessment (backup-aware)
        guidance.append("")
        
        if completeness_pct >= 95 and security_score >= 90:
            guidance.append("🎯 AUTH MASTERPLAN READINESS: ✅ READY FOR PRODUCTION")
            guidance.append("   → Backup extraction: Comprehensive")
            guidance.append("   → Security deployment: Excellent") 
            guidance.append("   → Next: Deploy auth gateway to Vercel")
            guidance.append("   → Reference: requirements/masterplans/AUTH-MASTERPLAN.md Phase 1")
            
            guidance.append("")
            guidance.append("📋 RECOMMENDED NEXT STEPS:")
            guidance.append("   1. Deploy auth gateway: cp -r truth-seed/emdash-auth-main/ new-auth-gateway/")
            guidance.append("   2. Configure environment variables for edl-platform.vercel.app")
            guidance.append("   3. Test cookie propagation between subdomains")
            guidance.append("   4. Verify profile creation flow")
            
        elif completeness_pct >= 80 and security_score >= 70:
            guidance.append("🎯 AUTH MASTERPLAN READINESS: ⚠️ PROCEED WITH CAUTION")
            guidance.append(f"   → Extraction: {completeness_pct:.1f}% (some features may be missing)")
            guidance.append(f"   → Security: {security_score:.0f}% (fix gaps first)")
            guidance.append("   → RECOMMEND: Test thoroughly in staging environment")
            
        else:
            guidance.append("🎯 AUTH MASTERPLAN READINESS: ❌ NOT READY")
            if completeness_pct < 80:
                guidance.append("   → PRIMARY ISSUE: Incomplete backup extraction")
            if security_score < 70:
                guidance.append("   → SECONDARY ISSUE: Security gaps")
        
        # 4. Session fixes and context
        session_fixes = migration_reality.get("session_fixes", {})
        if session_fixes:
            guidance.append("")
            guidance.append("📋 AVAILABLE FIXES:")
            for fix_key, fix_info in session_fixes.items():
                guidance.append(f"   • {fix_info['file']} (Session {fix_info['session']}) - {fix_info['purpose']}")
        
        guidance.append("")
        guidance.append("💡 BACKUP-CENTRIC TRUTH APPROACH (Session 57):")
        guidance.append("   • Backup file = Ultimate truth (what we're replicating)")
        guidance.append("   • Migration batches = Quick reference (extracted subset)")
        guidance.append("   • When problems arise = Go back to backup for analysis")
        
        return guidance
    
    def discover_level_1(self) -> Dict[str, Any]:
        """Level 1: Connection test and basic permissions check"""
        
        # Check cache first
        cached = self._get_cached_data("connection")
        if cached:
            cached["from_cache"] = True
            return cached
        
        result = {
            "metadata": {
                "timestamp": datetime.now().isoformat(),
                "agent": "supabase-reality",
                "check_type": "level_1_discovery",
                "session_id": self.session_id,
                "confidence_score": 0.0
            },
            "connection": {
                "status": "unknown",
                "permission_level": "unknown",
                "rate_limit_remaining": -1
            },
            "discoveries": {
                "level": 1,
                "summary": {}
            }
        }
        
        # Test basic connection
        try:
            # Simple health check
            curl_cmd = [
                "curl", "-s", "-I",
                f"{self.url}/rest/v1/",
                "-H", f"apikey: {self.key}"
            ]
            
            response = subprocess.run(
                curl_cmd,
                capture_output=True,
                text=True,
                timeout=10
            )
            
            if "HTTP" in response.stdout:
                # Parse HTTP status
                for line in response.stdout.split("\n"):
                    if "HTTP" in line:
                        if "200" in line or "204" in line:
                            result["connection"]["status"] = "connected"
                            result["metadata"]["confidence_score"] = 1.0
                        elif "401" in line or "403" in line:
                            result["connection"]["status"] = "limited"
                            result["connection"]["permission_level"] = "insufficient"
                            result["metadata"]["confidence_score"] = 0.5
                        else:
                            result["connection"]["status"] = "failed"
                            result["metadata"]["confidence_score"] = 0.0
                        break
                    
                    # Check for rate limit headers
                    if "x-ratelimit-remaining" in line.lower():
                        try:
                            remaining = int(line.split(":")[1].strip())
                            result["connection"]["rate_limit_remaining"] = remaining
                        except:
                            pass
                
                # Determine permission level based on key type
                if self.service_key:
                    result["connection"]["permission_level"] = "service"
                else:
                    result["connection"]["permission_level"] = "anon"
                    
            else:
                result["connection"]["status"] = "failed"
                result["error"] = "REALITY_001: No response from server"
                
        except subprocess.TimeoutExpired:
            result["connection"]["status"] = "failed"
            result["error"] = "REALITY_002: Connection timeout"
        except Exception as e:
            result["connection"]["status"] = "failed"
            result["error"] = f"REALITY_001: {str(e)}"
        
        # Cache successful connections
        if result["connection"]["status"] in ["connected", "limited"]:
            self._save_cache("connection", result)
            self.discovery_level = 1
        
        return result
    
    def discover_level_2(self) -> Dict[str, Any]:
        """Level 2: Migration-aware table discovery with RLS interpretation (Session 57 Enhanced)"""
        
        # Ensure Level 1 has passed
        level_1 = self.discover_level_1()
        if level_1["connection"]["status"] != "connected":
            return {
                "error": "REALITY_003: Cannot perform Level 2 discovery without Level 1 connection",
                "level_1_status": level_1["connection"]["status"]
            }
        
        # Get migration reality as source of truth (Level 0.5)
        migration_reality = self.discover_level_05_migration_reality()
        expected_tables = migration_reality.get("migration_state", {}).get("expected_tables", [])
        
        result = {
            "metadata": {
                "timestamp": datetime.now().isoformat(),
                "agent": "supabase-reality",
                "check_type": "level_2_enhanced_discovery",
                "session_id": self.session_id,
                "confidence_score": 0.0
            },
            "connection": level_1["connection"],
            "migration_authority": migration_reality["authority"],
            "expected_vs_actual": {},
            "security_analysis": {},
            "masterplan_guidance": []
        }
        
        # If no migration files found, fall back to old behavior
        if not expected_tables:
            result["error"] = "REALITY_005: No migration files found - cannot determine expected schema"
            result["fallback_note"] = "Run migration batches first or check migrations/batches directory"
            result["metadata"]["confidence_score"] = 0.1
            return result
        
        # Test each expected table with RLS intelligence
        tables_tested = 0
        rls_protected_count = 0
        accessible_count = 0
        missing_count = 0
        
        for table in expected_tables:
            tables_tested += 1
            table_analysis = {
                "expected": True,
                "api_accessible": False,
                "security_status": "unknown",
                "interpretation": "unknown"
            }
            
            try:
                # Test API access to table
                response = self._make_api_call(f"/{table}?limit=1")
                
                # Check if response is an error dict (PGRST format)
                if isinstance(response, dict) and "code" in response:
                    # Handle API error responses (this is the common case)
                    error_code = response.get("code", "")
                    error_message = response.get("message", "")
                    
                    if error_code == "PGRST205" or "Could not find" in error_message:
                        # This is GOOD - RLS is working correctly
                        table_analysis["api_accessible"] = False
                        table_analysis["security_status"] = "✅ RLS PROTECTING TABLE"
                        table_analysis["interpretation"] = "Security working correctly - table exists but RLS blocks access"
                        rls_protected_count += 1
                    elif error_code == "42P01" or "does not exist" in error_message:
                        # Table doesn't exist
                        table_analysis["api_accessible"] = False
                        table_analysis["security_status"] = "❌ TABLE MISSING FROM DATABASE"
                        table_analysis["interpretation"] = "Migration may not have been applied"
                        missing_count += 1
                    else:
                        # Other API error
                        table_analysis["security_status"] = f"⚠️ API ERROR: {error_code} - {error_message[:50]}"
                        table_analysis["interpretation"] = f"API returned error: {response}"
                
                elif isinstance(response, list):
                    # If we can access the table data, RLS is NOT working properly
                    table_analysis["api_accessible"] = True
                    table_analysis["security_status"] = "❌ RLS NOT WORKING - SECURITY GAP!"
                    table_analysis["interpretation"] = "Table accessible without auth - RLS policies missing/broken"
                    accessible_count += 1
                else:
                    # Unexpected response format
                    table_analysis["security_status"] = "⚠️ Unexpected response format"
                    table_analysis["interpretation"] = f"Unexpected response type: {type(response)}, content: {str(response)[:100]}"
                
            except Exception as e:
                error_str = str(e)
                
                if 'PGRST205' in error_str or 'Could not find' in error_str:
                    # This is GOOD - RLS is working correctly
                    table_analysis["api_accessible"] = False
                    table_analysis["security_status"] = "✅ RLS PROTECTING TABLE"
                    table_analysis["interpretation"] = "Security working correctly - table exists but RLS blocks access"
                    rls_protected_count += 1
                elif '42P01' in error_str or 'does not exist' in error_str:
                    # Table doesn't exist in database
                    table_analysis["api_accessible"] = False
                    table_analysis["security_status"] = "❌ TABLE MISSING FROM DATABASE"
                    table_analysis["interpretation"] = "Migration may not have been applied"
                    missing_count += 1
                else:
                    # Other error
                    table_analysis["security_status"] = f"⚠️ UNKNOWN ERROR: {error_str[:50]}"
                    table_analysis["interpretation"] = "Unexpected database error"
            
            result["expected_vs_actual"][table] = table_analysis
        
        # Generate security analysis summary
        result["security_analysis"] = {
            "total_tables_tested": tables_tested,
            "rls_protected_correctly": rls_protected_count,
            "accessible_without_auth": accessible_count,
            "missing_from_database": missing_count,
            "security_score": rls_protected_count / max(tables_tested, 1) * 100 if tables_tested > 0 else 0
        }
        
        # Generate masterplan guidance
        result["masterplan_guidance"] = self._generate_masterplan_guidance(result, migration_reality)
        
        # Set confidence score based on analysis quality
        if tables_tested > 0:
            result["metadata"]["confidence_score"] = 0.95  # High confidence with migration file authority
        else:
            result["metadata"]["confidence_score"] = 0.1
        
        # Cache results
        if result["metadata"]["confidence_score"] > 0.5:
            self._save_cache("tables", result)
            self.discovery_level = 2
        
        return result
    
    def discover_level_3(self) -> Dict[str, Any]:
        """Level 3: Full schema discovery with column details"""
        
        # Ensure Level 2 has passed
        level_2 = self.discover_level_2()
        if level_2.get("error") or level_2["metadata"]["confidence_score"] == 0:
            return {
                "error": "REALITY_003: Cannot perform Level 3 discovery without Level 2 tables",
                "level_2_status": level_2.get("error", "No tables discovered")
            }
        
        # Check cache
        cached = self._get_cached_data("schema")
        if cached:
            cached["from_cache"] = True
            return cached
        
        result = {
            "metadata": {
                "timestamp": datetime.now().isoformat(),
                "agent": "supabase-reality",
                "check_type": "level_3_discovery",
                "session_id": self.session_id,
                "confidence_score": 0.0
            },
            "connection": level_2["connection"],
            "discoveries": {
                "level": 3,
                "summary": {
                    "total_tables": level_2["discoveries"]["summary"]["total_tables"],
                    "total_columns": 0,
                    "total_constraints": 0,
                    "total_indexes": 0
                },
                "details": {
                    "schemas": {},
                    "relationships": [],
                    "rls_policies": {}
                }
            }
        }
        
        # Since we're limited by anon permissions, attempt to discover what we can
        # Try to get column information for public tables
        accessible_tables = level_2["discoveries"]["summary"].get("accessible_tables", [])
        
        if not accessible_tables:
            # Try a different approach - query for any public schema info
            # This would work if there are any public views or functions
            info_response = self._make_api_call("/", {
                "Prefer": "params=single-object"
            })
            
            if isinstance(info_response, dict) and "definitions" in info_response:
                # OpenAPI spec might give us schema hints
                definitions = info_response.get("definitions", {})
                for table_name, table_def in definitions.items():
                    if "properties" in table_def:
                        result["discoveries"]["details"]["schemas"][table_name] = {
                            "columns": list(table_def["properties"].keys()),
                            "column_count": len(table_def["properties"]),
                            "source": "openapi_definitions"
                        }
                        result["discoveries"]["summary"]["total_columns"] += len(table_def["properties"])
                
                if result["discoveries"]["details"]["schemas"]:
                    result["metadata"]["confidence_score"] = 0.6
                    result["notes"] = "Schema derived from OpenAPI definitions"
            else:
                result["error"] = "REALITY_003: Cannot discover schema details with current permissions"
                result["metadata"]["confidence_score"] = 0.0
                result["notes"] = "Level 3 requires authenticated or service role access"
        else:
            # We have table names, try to get their schemas
            for table_name in accessible_tables[:5]:  # Limit to first 5 tables to avoid rate limits
                # Try OPTIONS request to get column info
                table_response = self._make_api_call(f"/{table_name}?limit=0", {
                    "Prefer": "count=exact"
                })
                
                if isinstance(table_response, list) and len(table_response) == 0:
                    # Empty result but successful - table exists
                    result["discoveries"]["details"]["schemas"][table_name] = {
                        "accessible": True,
                        "row_count": 0,
                        "columns": "unknown - requires higher permissions"
                    }
                elif isinstance(table_response, dict) and "message" not in table_response:
                    # Got some structure info
                    result["discoveries"]["details"]["schemas"][table_name] = table_response
            
            if result["discoveries"]["details"]["schemas"]:
                result["metadata"]["confidence_score"] = 0.5
                result["notes"] = "Limited schema discovery - full details require service role"
        
        # Cache if we got some data
        if result["metadata"]["confidence_score"] > 0:
            self._save_cache("schema", result)
            self.discovery_level = 3
        
        return result
    
    def capture_snapshot(self, discovery_level: int = 3) -> Dict[str, Any]:
        """Capture current state snapshot for change tracking"""
        snapshot = {
            "snapshot_id": hashlib.md5(f"{self.session_id}-{datetime.now().isoformat()}".encode()).hexdigest()[:8],
            "timestamp": datetime.now().isoformat(),
            "session_id": self.session_id,
            "discovery_level": discovery_level,
            "state": {}
        }
        
        # Capture state based on discovery level
        if discovery_level >= 1:
            snapshot["state"]["connection"] = self.discover_level_1()
        
        if discovery_level >= 2:
            snapshot["state"]["tables"] = self.discover_level_2()
        
        if discovery_level >= 3:
            snapshot["state"]["schema"] = self.discover_level_3()
        
        # Save snapshot to history
        snapshot_path = self.cache_dir / "snapshots" / f"snapshot_{snapshot['snapshot_id']}.json"
        snapshot_path.parent.mkdir(parents=True, exist_ok=True)
        snapshot_path.write_text(json.dumps(snapshot, indent=2))
        
        # Update latest snapshot reference
        latest_path = self.cache_dir / "snapshots" / "latest.json"
        latest_path.write_text(json.dumps({"snapshot_id": snapshot["snapshot_id"], "timestamp": snapshot["timestamp"]}, indent=2))
        
        return snapshot
    
    def get_previous_snapshot(self) -> Optional[Dict[str, Any]]:
        """Get the most recent snapshot if it exists"""
        latest_path = self.cache_dir / "snapshots" / "latest.json"
        
        if not latest_path.exists():
            return None
        
        try:
            latest_info = json.loads(latest_path.read_text())
            snapshot_path = self.cache_dir / "snapshots" / f"snapshot_{latest_info['snapshot_id']}.json"
            
            if snapshot_path.exists():
                return json.loads(snapshot_path.read_text())
        except Exception:
            pass
        
        return None
    
    def compare_snapshots(self, old_snapshot: Dict[str, Any], new_snapshot: Dict[str, Any]) -> Dict[str, Any]:
        """Compare two snapshots to detect changes"""
        changes = {
            "comparison_id": hashlib.md5(f"{old_snapshot['snapshot_id']}-{new_snapshot['snapshot_id']}".encode()).hexdigest()[:8],
            "old_snapshot": old_snapshot["snapshot_id"],
            "new_snapshot": new_snapshot["snapshot_id"],
            "old_timestamp": old_snapshot["timestamp"],
            "new_timestamp": new_snapshot["timestamp"],
            "changes_detected": False,
            "changes": {
                "connection": {},
                "tables": {},
                "schema": {}
            }
        }
        
        # Compare connection state
        if "connection" in old_snapshot["state"] and "connection" in new_snapshot["state"]:
            old_conn = old_snapshot["state"]["connection"]["connection"]
            new_conn = new_snapshot["state"]["connection"]["connection"]
            
            if old_conn != new_conn:
                changes["changes"]["connection"] = {
                    "status_changed": old_conn.get("status") != new_conn.get("status"),
                    "permission_changed": old_conn.get("permission_level") != new_conn.get("permission_level"),
                    "old": old_conn,
                    "new": new_conn
                }
                changes["changes_detected"] = True
        
        # Compare table lists
        if "tables" in old_snapshot["state"] and "tables" in new_snapshot["state"]:
            old_tables = old_snapshot["state"]["tables"]["discoveries"]["summary"].get("accessible_tables", [])
            new_tables = new_snapshot["state"]["tables"]["discoveries"]["summary"].get("accessible_tables", [])
            
            tables_added = set(new_tables) - set(old_tables)
            tables_removed = set(old_tables) - set(new_tables)
            
            if tables_added or tables_removed:
                changes["changes"]["tables"] = {
                    "added": list(tables_added),
                    "removed": list(tables_removed),
                    "count_before": len(old_tables),
                    "count_after": len(new_tables)
                }
                changes["changes_detected"] = True
        
        # Compare schemas
        if "schema" in old_snapshot["state"] and "schema" in new_snapshot["state"]:
            old_schemas = old_snapshot["state"]["schema"]["discoveries"]["details"]["schemas"]
            new_schemas = new_snapshot["state"]["schema"]["discoveries"]["details"]["schemas"]
            
            schema_changes = []
            
            # Check for added/removed tables
            old_table_names = set(old_schemas.keys())
            new_table_names = set(new_schemas.keys())
            
            for table in new_table_names - old_table_names:
                schema_changes.append({
                    "table": table,
                    "change_type": "table_added",
                    "details": new_schemas[table]
                })
            
            for table in old_table_names - new_table_names:
                schema_changes.append({
                    "table": table,
                    "change_type": "table_removed",
                    "details": old_schemas[table]
                })
            
            # Check for column changes in existing tables
            for table in old_table_names & new_table_names:
                old_cols = set(old_schemas[table].get("columns", []))
                new_cols = set(new_schemas[table].get("columns", []))
                
                if old_cols != new_cols:
                    schema_changes.append({
                        "table": table,
                        "change_type": "columns_modified",
                        "columns_added": list(new_cols - old_cols),
                        "columns_removed": list(old_cols - new_cols)
                    })
            
            if schema_changes:
                changes["changes"]["schema"] = schema_changes
                changes["changes_detected"] = True
        
        return changes
    
    def discover_level_4(self) -> Dict[str, Any]:
        """Level 4: Change detection and advanced analysis"""
        
        # Ensure Level 3 has passed
        level_3 = self.discover_level_3()
        if level_3.get("error") or level_3["metadata"]["confidence_score"] == 0:
            return {
                "error": "REALITY_004: Cannot perform Level 4 discovery without Level 3 schema",
                "level_3_status": level_3.get("error", "No schema discovered")
            }
        
        result = {
            "metadata": {
                "timestamp": datetime.now().isoformat(),
                "agent": "supabase-reality",
                "check_type": "level_4_discovery",
                "session_id": self.session_id,
                "confidence_score": 0.0
            },
            "discoveries": {
                "level": 4,
                "change_detection": {
                    "enabled": True,
                    "previous_snapshot": None,
                    "current_snapshot": None,
                    "changes": None
                }
            }
        }
        
        # Capture current snapshot
        current_snapshot = self.capture_snapshot(discovery_level=3)
        result["discoveries"]["change_detection"]["current_snapshot"] = current_snapshot["snapshot_id"]
        
        # Get previous snapshot if exists
        previous_snapshot = self.get_previous_snapshot()
        
        if previous_snapshot and previous_snapshot["snapshot_id"] != current_snapshot["snapshot_id"]:
            result["discoveries"]["change_detection"]["previous_snapshot"] = previous_snapshot["snapshot_id"]
            
            # Compare snapshots
            comparison = self.compare_snapshots(previous_snapshot, current_snapshot)
            result["discoveries"]["change_detection"]["changes"] = comparison
            
            if comparison["changes_detected"]:
                result["metadata"]["confidence_score"] = 0.9
                result["notes"] = "Changes detected since last snapshot"
            else:
                result["metadata"]["confidence_score"] = 0.8
                result["notes"] = "No changes detected since last snapshot"
        else:
            result["metadata"]["confidence_score"] = 0.7
            result["notes"] = "First snapshot captured - no previous state for comparison"
            result["discoveries"]["change_detection"]["snapshot_count"] = len(list((self.cache_dir / "snapshots").glob("snapshot_*.json"))) if (self.cache_dir / "snapshots").exists() else 1
        
        self.discovery_level = 4
        return result
    
    def discover(self, max_level: int = 2) -> Dict[str, Any]:
        """Progressive discovery up to specified level"""
        results = {
            "metadata": {
                "timestamp": datetime.now().isoformat(),
                "agent": "supabase-reality",
                "check_type": "progressive_discovery",
                "session_id": self.session_id,
                "max_level_requested": max_level
            },
            "levels": {}
        }
        
        # Progressive discovery (Session 57: Backup-Centric Truth Hierarchy)
        # Level 0.1: Ultimate truth from backup file
        results["levels"][0.1] = self.discover_level_01_backup_reality()
        
        # Level 0.5: Extraction completeness vs backup
        results["levels"][0.5] = self.discover_level_05_migration_reality()
        
        # Handle integer levels (1, 2, 3, 4)
        max_int_level = int(max_level) if max_level >= 1 else 0
        for level in range(1, min(max_int_level + 1, 5)):
            if level == 1:
                results["levels"][1] = self.discover_level_1()
            elif level == 2:
                results["levels"][2] = self.discover_level_2()
            elif level == 3:
                results["levels"][3] = self.discover_level_3()
            elif level == 4:
                results["levels"][4] = self.discover_level_4()
            
            # Stop if we hit an error
            if "error" in results["levels"][level]:
                results["max_level_achieved"] = level - 1
                break
        else:
            results["max_level_achieved"] = min(max_level, self.discovery_level)
        
        return results
    
    def output_results(self, results: Dict[str, Any], output_file: Optional[str] = None) -> Dict[str, Any]:
        """Output results to stdout or file"""
        json_output = json.dumps(results, indent=2)
        
        if output_file:
            Path(output_file).write_text(json_output)
        else:
            print(json_output)
        
        return results
    
    def clear_cache(self) -> None:
        """Clear all cached data for this session"""
        for cache_file in self.cache_dir.glob(f"*_{self.session_id}.json"):
            cache_file.unlink()


def main():
    """Command line interface"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Supabase Reality Agent - Progressive Discovery")
    parser.add_argument(
        "--level",
        type=float,
        default=2,
        help="Maximum discovery level (default: 2) - supports 0.1, 0.5, 1, 2, 3, 4"
    )
    parser.add_argument(
        "--output",
        type=str,
        help="Output file path (default: stdout)"
    )
    parser.add_argument(
        "--clear-cache",
        action="store_true",
        help="Clear cache before discovery"
    )
    
    args = parser.parse_args()
    
    try:
        connector = SupabaseConnector()
        
        if args.clear_cache:
            connector.clear_cache()
        
        results = connector.discover(max_level=args.level)
        connector.output_results(results, args.output)
        
        # Exit code based on success
        if results.get("max_level_achieved", 0) >= 1:
            sys.exit(0)
        else:
            sys.exit(1)
            
    except ValueError as e:
        # Missing credentials
        error_result = {
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }
        print(json.dumps(error_result, indent=2))
        sys.exit(1)
    except Exception as e:
        # Other errors
        error_result = {
            "error": f"Unexpected error: {str(e)}",
            "timestamp": datetime.now().isoformat()
        }
        print(json.dumps(error_result, indent=2))
        sys.exit(1)


if __name__ == "__main__":
    main()