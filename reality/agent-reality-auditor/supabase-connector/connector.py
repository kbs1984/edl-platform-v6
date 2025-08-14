#!/usr/bin/env python3
"""
Supabase Reality Agent - Connector Module
Progressive discovery of Supabase database reality with no assumptions
"""

import subprocess
import json
import os
import sys
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
        """Level 2: Table listing and basic structure discovery"""
        
        # Ensure Level 1 has passed
        level_1 = self.discover_level_1()
        if level_1["connection"]["status"] != "connected":
            return {
                "error": "REALITY_003: Cannot perform Level 2 discovery without Level 1 connection",
                "level_1_status": level_1["connection"]["status"]
            }
        
        # Check cache
        cached = self._get_cached_data("tables")
        if cached:
            cached["from_cache"] = True
            return cached
        
        result = {
            "metadata": {
                "timestamp": datetime.now().isoformat(),
                "agent": "supabase-reality",
                "check_type": "level_2_discovery",
                "session_id": self.session_id,
                "confidence_score": 0.0
            },
            "connection": level_1["connection"],
            "discoveries": {
                "level": 2,
                "summary": {
                    "total_tables": 0,
                    "total_rows": 0,
                    "accessible_tables": []
                },
                "details": {
                    "tables": []
                }
            }
        }
        
        # Try to get table information
        # First, attempt to query the information_schema
        schema_response = self._make_api_call("/rpc/get_tables", {
            "Prefer": "params=single-object"
        })
        
        # If RPC doesn't exist, try direct table access
        if "error" in schema_response or schema_response == {}:
            # Fallback: Try to list tables via a different method
            # We'll attempt to query a common Supabase system view
            tables_response = self._make_api_call("/")
            
            if isinstance(tables_response, dict) and "error" not in tables_response:
                # Parse available endpoints as potential tables
                # This is a heuristic approach when we can't access metadata
                result["discoveries"]["summary"]["total_tables"] = 0
                result["discoveries"]["details"]["tables"] = []
                result["metadata"]["confidence_score"] = 0.3
                result["notes"] = "Limited discovery - cannot access table metadata directly"
            else:
                result["error"] = "REALITY_003: Cannot discover tables with current permissions"
                result["metadata"]["confidence_score"] = 0.0
        else:
            # Successfully got table information
            if isinstance(schema_response, list):
                result["discoveries"]["summary"]["total_tables"] = len(schema_response)
                result["discoveries"]["summary"]["accessible_tables"] = [
                    t.get("table_name", "unknown") for t in schema_response
                ]
                result["discoveries"]["details"]["tables"] = schema_response
                result["metadata"]["confidence_score"] = 0.9
            else:
                result["metadata"]["confidence_score"] = 0.5
        
        # Cache if we got some data
        if result["metadata"]["confidence_score"] > 0:
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
        
        # Progressive discovery
        for level in range(1, min(max_level + 1, 5)):
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
        type=int,
        default=2,
        choices=[1, 2, 3, 4],
        help="Maximum discovery level (default: 2)"
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