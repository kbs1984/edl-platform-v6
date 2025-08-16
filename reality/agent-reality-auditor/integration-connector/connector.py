#!/usr/bin/env python3
"""
Integration Reality Agent - Meta-Reality Discovery
Discovers how individual reality domains relate, conflict, and drift
Implements SPEC-004: Integration Reality with Deception Detection
"""

import json
import os
import sys
import hashlib
import subprocess
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional, Dict, Any, List, Set, Tuple
import re

# Import our Reality Agents - proper imports
parent_dir = Path(__file__).parent.parent
sys.path.insert(0, str(parent_dir))

# Import with full module paths to avoid conflicts
import importlib.util

# Import AssumptionDetector (Session 00005 enhancement)
from assumption_detector import AssumptionDetector, AssumptionRealityAgent

# Load SupabaseConnector
spec = importlib.util.spec_from_file_location(
    "supabase_connector", 
    parent_dir / "supabase-connector" / "connector.py"
)
supabase_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(supabase_module)
SupabaseConnector = supabase_module.SupabaseConnector

# Load FileSystemConnector
spec = importlib.util.spec_from_file_location(
    "filesystem_connector",
    parent_dir / "filesystem-connector" / "connector.py"
)
filesystem_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(filesystem_module)
FileSystemConnector = filesystem_module.FileSystemConnector

# Load GitHubRealityAgent
spec = importlib.util.spec_from_file_location(
    "github_connector",
    parent_dir / "github-connector" / "connector.py"  
)
github_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(github_module)
GitHubRealityAgent = github_module.GitHubRealityAgent


class IntegrationRealityAgent:
    """Reality Agent for Reality Agents - recursive truth discovery"""
    
    def __init__(self, root_path: Optional[str] = None):
        """Initialize the Integration Reality Agent"""
        if root_path:
            self.root_path = Path(root_path).resolve()
        else:
            self.root_path = Path.cwd()
            
        # Initialize cache
        self.cache_dir = Path(__file__).parent / ".cache"
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        
        self.session_id = self._generate_session_id()
        self.timestamp = datetime.now()
        
        # Initialize individual agents
        self.fs_agent = None
        self.gh_agent = None
        self.db_agent = None
        self.vercel_agent = None  # Session 00008
        self.static_agent = None  # Session 00008
        
        # Session log paths
        self.session_logs_dir = self.root_path / "archive" / "sessions"
        if not self.session_logs_dir.exists():
            self.session_logs_dir = self.root_path / "session-logs"
        
        # Integration health metrics
        self.health_scores = {
            "synchronization": 0.0,
            "completeness": 0.0,
            "consistency": 0.0,
            "transparency": 0.0,
            "overall": 0.0
        }
        
        # Integration debt tracking
        self.integration_debt = {
            "uncommitted_files": 0,
            "untracked_files": 0,
            "unpushed_commits": 0,
            "undocumented_features": 0,
            "missing_tests": 0,
            "total_debt_score": 0.0
        }
        
        # Assumption detection (Session 00005 enhancement)
        self.assumption_detector = AssumptionDetector()
        self.assumption_agent = AssumptionRealityAgent()
        
    def _generate_session_id(self) -> str:
        """Generate unique session ID"""
        timestamp = datetime.now().isoformat()
        unique_str = f"integration-{timestamp}-{os.getpid()}"
        return hashlib.md5(unique_str.encode()).hexdigest()[:8]
    
    def _init_agents(self) -> Dict[str, Any]:
        """Initialize and health check all agents"""
        results = {
            "fs_agent": {"status": "unknown", "error": None},
            "gh_agent": {"status": "unknown", "error": None},
            "db_agent": {"status": "unknown", "error": None},
            "partial_capability": True
        }
        
        # Initialize FileSystem agent
        try:
            self.fs_agent = FileSystemConnector(self.root_path)
            fs_health = self.fs_agent.discover_level_1()
            if fs_health.get("connection", {}).get("status") == "connected":
                results["fs_agent"]["status"] = "healthy"
            else:
                results["fs_agent"]["status"] = "limited"
        except Exception as e:
            results["fs_agent"]["status"] = "failed"
            results["fs_agent"]["error"] = str(e)
        
        # Initialize GitHub agent
        try:
            self.gh_agent = GitHubRealityAgent(self.root_path)
            gh_health = self.gh_agent.level_1_github_cli_access()
            if gh_health.get("authenticated"):
                results["gh_agent"]["status"] = "healthy"
            elif gh_health.get("gh_installed"):
                results["gh_agent"]["status"] = "limited"
            else:
                results["gh_agent"]["status"] = "failed"
        except Exception as e:
            results["gh_agent"]["status"] = "failed"
            results["gh_agent"]["error"] = str(e)
        
        # Initialize Supabase agent (optional)
        try:
            if os.getenv("SUPABASE_URL") and os.getenv("SUPABASE_ANON_KEY"):
                self.db_agent = SupabaseConnector()
                db_health = self.db_agent.discover_level_1()
                if db_health.get("connection", {}).get("status") == "connected":
                    results["db_agent"]["status"] = "healthy"
                else:
                    results["db_agent"]["status"] = "limited"
            else:
                results["db_agent"]["status"] = "unavailable"
                results["db_agent"]["error"] = "No Supabase credentials"
        except Exception as e:
            results["db_agent"]["status"] = "failed"
            results["db_agent"]["error"] = str(e)
        
        # Initialize Vercel Agent (Session 00008)
        vercel_connector_path = parent_dir / "vercel-connector" / "connector.py"
        if vercel_connector_path.exists():
            try:
                spec = importlib.util.spec_from_file_location("vercel_connector", vercel_connector_path)
                vercel_module = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(vercel_module)
                self.vercel_agent = vercel_module.VercelRealityAgent()
                # Test connection
                vercel_health = self.vercel_agent.discover_level_1()
                if vercel_health.get('connected'):
                    results["vercel_agent"] = {"status": "healthy", "error": None}
                else:
                    results["vercel_agent"] = {"status": "limited", "error": "Not connected"}
            except Exception as e:
                results["vercel_agent"] = {"status": "failed", "error": str(e)}
                self.vercel_agent = None
        else:
            results["vercel_agent"] = {"status": "unavailable", "error": "Agent not found"}
        
        # Initialize Static Asset Agent (Session 00008)
        static_connector_path = parent_dir / "static-asset-connector" / "connector.py"
        if static_connector_path.exists():
            try:
                spec = importlib.util.spec_from_file_location("static_connector", static_connector_path)
                static_module = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(static_module)
                self.static_agent = static_module.StaticAssetRealityAgent(str(self.root_path))
                # Test access
                static_health = self.static_agent.discover_level_1()
                if static_health.get('accessible'):
                    results["static_agent"] = {"status": "healthy", "error": None}
                else:
                    results["static_agent"] = {"status": "limited", "error": "Not accessible"}
            except Exception as e:
                results["static_agent"] = {"status": "failed", "error": str(e)}
                self.static_agent = None
        else:
            results["static_agent"] = {"status": "unavailable", "error": "Agent not found"}
        
        # Determine if we can work with partial capability
        healthy_count = sum(1 for agent in results.values() 
                          if isinstance(agent, dict) and agent.get("status") == "healthy")
        results["partial_capability"] = healthy_count >= 2
        
        return results
    
    def discover_session_reality_gaps(self) -> Dict[str, Any]:
        """Phase 1: Deception Detection Engine - Compare session claims vs reality"""
        result = {
            "timestamp": datetime.now().isoformat(),
            "session_id": self.session_id,
            "claimed_work": [],
            "actual_changes": [],
            "actual_commits": [],
            "truth_score": 0.0,
            "deception_instances": []
        }
        
        # Extract claims from session logs
        result["claimed_work"] = self._extract_from_session_logs()
        
        # Get actual filesystem changes
        if self.fs_agent:
            try:
                fs_discovery = self.fs_agent.discover_level_2()
                result["actual_changes"] = self._extract_fs_changes(fs_discovery)
            except:
                result["actual_changes"] = []
        
        # Get actual commits
        if self.gh_agent:
            try:
                # Get recent commits
                returncode, stdout, stderr = subprocess.run(
                    ["git", "log", "--oneline", "-20", "--since=7.days.ago"],
                    capture_output=True,
                    text=True,
                    cwd=self.root_path
                )
                if returncode == 0:
                    result["actual_commits"] = stdout.strip().split('\n') if stdout.strip() else []
            except:
                result["actual_commits"] = []
        
        # Calculate truth score and find deceptions
        result["truth_score"], result["deception_instances"] = self._calculate_claim_accuracy(
            result["claimed_work"],
            result["actual_changes"],
            result["actual_commits"]
        )
        
        return result
    
    def _extract_from_session_logs(self) -> List[Dict[str, Any]]:
        """Extract claimed work from session logs"""
        claims = []
        
        if not self.session_logs_dir.exists():
            return claims
        
        # Look for session log files
        session_files = list(self.session_logs_dir.glob("SESSION-*-LOG.md"))
        session_files.extend(list(self.session_logs_dir.glob("SESSION-*.md")))
        
        for session_file in session_files[-5:]:  # Check last 5 sessions
            try:
                content = session_file.read_text()
                
                # Extract session number
                session_num = re.search(r'SESSION[- ](\d+)', session_file.name)
                if session_num:
                    session_id = session_num.group(1)
                else:
                    session_id = "unknown"
                
                # Look for completion claims
                completion_patterns = [
                    r"✅\s*(.+)",  # Checkmarks
                    r"COMPLETED:\s*(.+)",
                    r"Built:\s*(.+)",
                    r"Implemented:\s*(.+)",
                    r"Created:\s*(.+)",
                    r"Fixed:\s*(.+)"
                ]
                
                for pattern in completion_patterns:
                    matches = re.findall(pattern, content, re.MULTILINE | re.IGNORECASE)
                    for match in matches:
                        claims.append({
                            "session": session_id,
                            "claim": match.strip(),
                            "file": session_file.name,
                            "type": "completion_claim"
                        })
                
                # Look for file creation claims
                file_patterns = [
                    r"(?:Created|Built|Wrote)\s+(?:file\s+)?([/\w\-\.]+\.(?:py|js|ts|md|json))",
                    r"File:\s*([/\w\-\.]+\.(?:py|js|ts|md|json))"
                ]
                
                for pattern in file_patterns:
                    matches = re.findall(pattern, content, re.IGNORECASE)
                    for match in matches:
                        claims.append({
                            "session": session_id,
                            "claim": f"Created file: {match}",
                            "file": session_file.name,
                            "type": "file_claim",
                            "claimed_file": match
                        })
                
            except Exception as e:
                claims.append({
                    "session": "error",
                    "claim": f"Error reading {session_file.name}: {str(e)}",
                    "type": "read_error"
                })
        
        return claims
    
    def _extract_fs_changes(self, fs_discovery: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Extract actual filesystem changes"""
        changes = []
        
        if not fs_discovery:
            return changes
        
        # Get file statistics from discovery
        stats = fs_discovery.get("discoveries", {}).get("details", {}).get("statistics", {})
        if stats:
            changes.append({
                "type": "summary",
                "total_files": stats.get("total_files", 0),
                "total_dirs": stats.get("total_directories", 0)
            })
        
        # Get recent modifications
        recent_files = fs_discovery.get("discoveries", {}).get("details", {}).get("recent_changes", [])
        for file_info in recent_files:
            changes.append({
                "type": "file_change",
                "path": file_info.get("path"),
                "modified": file_info.get("modified"),
                "size": file_info.get("size")
            })
        
        return changes
    
    def _calculate_claim_accuracy(self, claims: List[Dict], 
                                 actual_changes: List[Dict], 
                                 actual_commits: List[str]) -> Tuple[float, List[Dict]]:
        """Calculate truth score and identify deceptions"""
        if not claims:
            return 1.0, []  # No claims = no lies
        
        deceptions = []
        verified_claims = 0
        total_claims = len(claims)
        
        for claim in claims:
            verified = False
            
            # Check file claims against actual filesystem
            if claim.get("type") == "file_claim" and claim.get("claimed_file"):
                claimed_file_name = claim["claimed_file"].lstrip("/")
                
                # Check multiple possible locations for session files
                possible_paths = [
                    Path(self.root_path) / claimed_file_name,
                    Path(self.root_path) / "archive" / "sessions" / claimed_file_name,
                    Path(self.root_path) / "archive" / "sessions" / Path(claimed_file_name).name,
                ]
                
                file_found = any(p.exists() for p in possible_paths)
                
                if file_found:
                    verified = True
                else:
                    deceptions.append({
                        "type": "false_file_claim",
                        "session": claim.get("session"),
                        "claim": claim.get("claim"),
                        "reason": f"File does not exist: {claim['claimed_file']}"
                    })
            
            # Check completion claims against commits
            elif claim.get("type") == "completion_claim":
                claim_text = claim.get("claim", "").lower()
                
                # Check if mentioned in any commit
                for commit in actual_commits:
                    if any(word in commit.lower() for word in claim_text.split()[:3]):
                        verified = True
                        break
                
                if not verified:
                    # Check for retroactive logging (claim made after the fact)
                    session_num = claim.get("session", "0")
                    try:
                        session_int = int(re.sub(r'\D', '', str(session_num)))
                        # If claiming work from much earlier sessions, it's suspicious
                        if session_int < 3:  # Old session claims in new logs
                            deceptions.append({
                                "type": "retroactive_logging",
                                "session": claim.get("session"),
                                "claim": claim.get("claim"),
                                "reason": "Claim appears to be retroactive (old work claimed recently)"
                            })
                    except:
                        pass
            
            if verified:
                verified_claims += 1
        
        truth_score = verified_claims / total_claims if total_claims > 0 else 1.0
        
        return truth_score, deceptions
    
    def check_assumption_reality(self) -> List[Dict[str, Any]]:
        """Check for assumption-based reality gaps - Session 00005 enhancement"""
        assumption_gaps = []
        
        # Check current session assumptions
        if self.session_logs_dir.exists():
            session_files = sorted(self.session_logs_dir.glob("SESSION-*"))
            
            for session_file in session_files[-5:]:  # Check last 5 sessions
                try:
                    content = session_file.read_text()
                    session_num_match = re.search(r'SESSION[- ](\d+)', session_file.name)
                    
                    if session_num_match:
                        session_num = int(session_num_match.group(1))
                        
                        # Analyze session for assumptions
                        analysis = self.assumption_agent.analyze_session(content, session_num)
                        
                        if analysis['assumption_clarity_score'] < 0.8:
                            assumption_gaps.append({
                                "session": session_num,
                                "clarity": analysis['assumption_clarity_score'],
                                "ghosts": analysis['ghost_sessions'],
                                "forks": analysis['reality_forks'],
                                "severity": "CRITICAL" if analysis['ghost_sessions'] > 0 else "HIGH",
                                "details": analysis.get('details', {})
                            })
                except Exception as e:
                    assumption_gaps.append({
                        "session": "error",
                        "error": str(e),
                        "severity": "UNKNOWN"
                    })
        
        return assumption_gaps
    
    def find_retroactive_logging(self) -> List[Dict[str, Any]]:
        """Detect instances of retroactive logging in session logs"""
        retroactive_instances = []
        
        if not self.session_logs_dir.exists():
            return retroactive_instances
        
        session_files = sorted(self.session_logs_dir.glob("SESSION-*"))
        
        for i, session_file in enumerate(session_files):
            try:
                content = session_file.read_text()
                file_stat = session_file.stat()
                file_modified = datetime.fromtimestamp(file_stat.st_mtime)
                
                # Look for timestamps in the content
                timestamp_pattern = r"(\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2})"
                timestamps = re.findall(timestamp_pattern, content)
                
                for timestamp_str in timestamps:
                    try:
                        content_time = datetime.fromisoformat(timestamp_str.replace(" ", "T"))
                        
                        # If content timestamp is significantly before file modification
                        time_diff = file_modified - content_time
                        if time_diff.days > 1:  # Content claims to be from >1 day before file was created
                            retroactive_instances.append({
                                "file": session_file.name,
                                "file_modified": file_modified.isoformat(),
                                "content_timestamp": content_time.isoformat(),
                                "days_difference": time_diff.days,
                                "type": "backdated_content",
                                "severity": "HIGH" if time_diff.days > 7 else "MEDIUM"
                            })
                    except:
                        continue
                
                # Check for references to future sessions
                session_num_match = re.search(r'SESSION[- ](\d+)', session_file.name)
                if session_num_match:
                    current_session = int(session_num_match.group(1))
                    
                    # Look for references to higher session numbers
                    future_refs = re.findall(r'SESSION[- ](\d+)', content)
                    for ref in future_refs:
                        ref_num = int(ref)
                        if ref_num > current_session:
                            retroactive_instances.append({
                                "file": session_file.name,
                                "current_session": current_session,
                                "references_session": ref_num,
                                "type": "future_reference",
                                "severity": "CRITICAL"
                            })
                
            except Exception as e:
                retroactive_instances.append({
                    "file": session_file.name,
                    "error": str(e),
                    "type": "analysis_error"
                })
        
        return retroactive_instances
    
    def level_1_health_check(self) -> Dict[str, Any]:
        """Level 1: Agent Health Check (Confidence: 1.0)"""
        result = {
            "level": 1,
            "timestamp": datetime.now().isoformat(),
            "confidence": 1.0,
            "agents": self._init_agents()
        }
        
        # Calculate overall health
        statuses = [v.get("status") for k, v in result["agents"].items() 
                   if k != "partial_capability" and isinstance(v, dict)]
        
        healthy = statuses.count("healthy")
        limited = statuses.count("limited")
        failed = statuses.count("failed")
        
        result["summary"] = {
            "healthy_agents": healthy,
            "limited_agents": limited,
            "failed_agents": failed,
            "can_proceed": result["agents"]["partial_capability"]
        }
        
        return result
    
    def level_2_binary_correlation(self) -> Dict[str, Any]:
        """Level 2: Binary Correlation - FS + Git (Confidence: 0.8)"""
        result = {
            "level": 2,
            "timestamp": datetime.now().isoformat(),
            "confidence": 0.8,
            "fs_git_sync": {},
            "uncommitted": [],
            "untracked": [],
            "unpushed": []
        }
        
        if not self.fs_agent or not self.gh_agent:
            result["error"] = "Missing required agents for binary correlation"
            result["confidence"] = 0.0
            return result
        
        # Get git status
        try:
            # Uncommitted changes
            returncode, stdout, _ = subprocess.run(
                ["git", "diff", "--name-only"],
                capture_output=True,
                text=True,
                cwd=self.root_path
            )
            if returncode == 0 and stdout.strip():
                result["uncommitted"] = stdout.strip().split('\n')
            
            # Untracked files
            returncode, stdout, _ = subprocess.run(
                ["git", "ls-files", "--others", "--exclude-standard"],
                capture_output=True,
                text=True,
                cwd=self.root_path
            )
            if returncode == 0 and stdout.strip():
                result["untracked"] = stdout.strip().split('\n')
            
            # Unpushed commits
            returncode, stdout, _ = subprocess.run(
                ["git", "log", "@{upstream}..HEAD", "--oneline"],
                capture_output=True,
                text=True,
                cwd=self.root_path
            )
            if returncode == 0 and stdout.strip():
                result["unpushed"] = stdout.strip().split('\n')
        except Exception as e:
            result["error"] = f"Git command failed: {str(e)}"
            result["confidence"] = 0.4
        
        # Calculate sync score
        total_issues = len(result["uncommitted"]) + len(result["untracked"]) + len(result["unpushed"])
        result["fs_git_sync"] = {
            "total_sync_issues": total_issues,
            "sync_score": 1.0 - min(total_issues / 20, 1.0)  # Normalized score
        }
        
        return result
    
    def calculate_health_score(self) -> Dict[str, float]:
        """Calculate comprehensive health scores"""
        # Get data from all levels
        level1 = self.level_1_health_check()
        level2 = self.level_2_binary_correlation()
        gaps = self.discover_session_reality_gaps()
        
        # Synchronization score (how well agents agree)
        sync_score = level2.get("fs_git_sync", {}).get("sync_score", 0.0)
        self.health_scores["synchronization"] = sync_score
        
        # Completeness score (how much is tracked)
        tracked_files = len(level2.get("uncommitted", [])) + len(level2.get("untracked", []))
        self.health_scores["completeness"] = max(0.0, 1.0 - (tracked_files / 50))
        
        # Consistency score (do agents agree) - Updated for 5 agents (Session 00008)
        healthy_agents = level1.get("summary", {}).get("healthy_agents", 0)
        total_agents = 5  # fs, gh, db, vercel, static
        self.health_scores["consistency"] = healthy_agents / total_agents
        
        # Transparency score (truth vs claims)
        self.health_scores["transparency"] = gaps.get("truth_score", 0.0)
        
        # Assumption clarity score (Session 00005 enhancement)
        clarity_score, _ = self.assumption_detector.calculate_assumption_clarity_score()
        self.health_scores["assumption_clarity"] = clarity_score
        
        # Overall score (weighted average)
        weights = {
            "synchronization": 0.25,
            "completeness": 0.15,
            "consistency": 0.15,
            "transparency": 0.25,
            "assumption_clarity": 0.20  # Session 00005: Critical for preventing ghost realities
        }
        
        self.health_scores["overall"] = sum(
            self.health_scores.get(key, 0) * weight 
            for key, weight in weights.items()
        )
        
        return self.health_scores
    
    def generate_health_bar(self, score: float, width: int = 20) -> str:
        """Generate ASCII health bar visualization"""
        filled = int(score * width)
        empty = width - filled
        return f"[{'█' * filled}{'░' * empty}] {score:.1%}"
    
    def track_integration_debt(self) -> Dict[str, Any]:
        """Track and quantify integration debt across the system"""
        debt = self.integration_debt.copy()
        
        # Get uncommitted and untracked files from Level 2
        level2 = self.level_2_binary_correlation()
        debt["uncommitted_files"] = len(level2.get("uncommitted", []))
        debt["untracked_files"] = len(level2.get("untracked", []))
        debt["unpushed_commits"] = len(level2.get("unpushed", []))
        
        # Check for undocumented features
        debt["undocumented_features"] = self._find_undocumented_features()
        
        # Check for missing tests
        debt["missing_tests"] = self._find_missing_tests()
        
        # Calculate total debt score (0-100, higher is worse)
        weights = {
            "uncommitted_files": 2,      # 2 points per file
            "untracked_files": 1,        # 1 point per file
            "unpushed_commits": 3,       # 3 points per commit
            "undocumented_features": 5,  # 5 points per feature
            "missing_tests": 4           # 4 points per missing test
        }
        
        total_points = sum(
            debt[key] * weight 
            for key, weight in weights.items()
        )
        
        # Normalize to 0-100 scale (100 points = maximum debt)
        debt["total_debt_score"] = min(total_points, 100)
        
        # Add human-readable debt level
        if debt["total_debt_score"] < 20:
            debt["debt_level"] = "LOW"
        elif debt["total_debt_score"] < 50:
            debt["debt_level"] = "MEDIUM"
        elif debt["total_debt_score"] < 80:
            debt["debt_level"] = "HIGH"
        else:
            debt["debt_level"] = "CRITICAL"
        
        self.integration_debt = debt
        return debt
    
    def _find_undocumented_features(self) -> int:
        """Find features that lack documentation"""
        undocumented = 0
        
        # Check for Python files without docstrings
        if self.fs_agent:
            try:
                # Look for Python files
                py_files = list(self.root_path.glob("**/*.py"))
                for py_file in py_files[:10]:  # Sample first 10 files
                    try:
                        content = py_file.read_text()
                        # Simple heuristic: check for classes without docstrings
                        if "class " in content and '"""' not in content:
                            undocumented += 1
                    except:
                        pass
            except:
                pass
        
        return undocumented
    
    def _find_missing_tests(self) -> int:
        """Find components without corresponding tests"""
        missing = 0
        
        # Check for test coverage
        test_dirs = ["tests", "test", "__tests__", "spec"]
        has_tests = False
        
        for test_dir in test_dirs:
            test_path = self.root_path / test_dir
            if test_path.exists() and test_path.is_dir():
                has_tests = True
                break
        
        if not has_tests:
            # No test directory at all
            missing = 10  # Arbitrary high number for no tests
        else:
            # Check for test files
            test_files = list(self.root_path.glob("**/test_*.py"))
            test_files.extend(list(self.root_path.glob("**/*_test.py")))
            
            # Compare against source files
            src_files = list(self.root_path.glob("**/*.py"))
            src_files = [f for f in src_files if "test" not in f.name.lower()]
            
            # Simple heuristic: should have at least 1 test file per 5 source files
            expected_tests = len(src_files) // 5
            actual_tests = len(test_files)
            
            if actual_tests < expected_tests:
                missing = expected_tests - actual_tests
        
        return missing
    
    def generate_debt_report(self) -> str:
        """Generate a visual debt report"""
        debt = self.track_integration_debt()
        
        report = []
        report.append("\n💰 Integration Debt Analysis:")
        report.append("-" * 40)
        
        # Debt score visualization
        debt_bar = self.generate_health_bar(1.0 - debt["total_debt_score"] / 100)
        report.append(f"  Debt Score: {debt_bar}")
        report.append(f"  Debt Level: {debt['debt_level']}")
        report.append("")
        
        # Detailed breakdown
        report.append("  Debt Breakdown:")
        if debt["uncommitted_files"] > 0:
            report.append(f"  • {debt['uncommitted_files']} uncommitted files")
        if debt["untracked_files"] > 0:
            report.append(f"  • {debt['untracked_files']} untracked files")
        if debt["unpushed_commits"] > 0:
            report.append(f"  • {debt['unpushed_commits']} unpushed commits")
        if debt["undocumented_features"] > 0:
            report.append(f"  • {debt['undocumented_features']} undocumented features")
        if debt["missing_tests"] > 0:
            report.append(f"  • {debt['missing_tests']} missing tests")
        
        if debt["total_debt_score"] == 0:
            report.append("  ✅ No integration debt!")
        
        # Recommendations
        if debt["debt_level"] in ["HIGH", "CRITICAL"]:
            report.append("")
            report.append("  ⚠️  Recommended Actions:")
            if debt["uncommitted_files"] > 5:
                report.append("  1. Commit pending changes immediately")
            if debt["unpushed_commits"] > 3:
                report.append("  2. Push commits to remote repository")
            if debt["undocumented_features"] > 2:
                report.append("  3. Add documentation to new features")
            if debt["missing_tests"] > 5:
                report.append("  4. Write tests for untested components")
        
        return "\n".join(report)
    
    def generate_visual_report(self) -> str:
        """Generate comprehensive visual health report"""
        # Calculate all scores
        health = self.calculate_health_score()
        level1 = self.level_1_health_check()
        level2 = self.level_2_binary_correlation()
        gaps = self.discover_session_reality_gaps()
        retroactive = self.find_retroactive_logging()
        assumption_gaps = self.check_assumption_reality()
        
        report = []
        report.append("=" * 60)
        report.append("                 INTEGRATION REALITY REPORT")
        report.append("=" * 60)
        report.append("")
        
        # Health Scores
        report.append("📊 Health Scores:")
        report.append(f"  Synchronization  {self.generate_health_bar(health['synchronization'])}")
        report.append(f"  Completeness     {self.generate_health_bar(health['completeness'])}")
        report.append(f"  Consistency      {self.generate_health_bar(health['consistency'])}")
        report.append(f"  Transparency     {self.generate_health_bar(health['transparency'])}")
        report.append(f"  Assumption Clear {self.generate_health_bar(health.get('assumption_clarity', 1.0))}")
        report.append("")
        report.append(f"  OVERALL HEALTH   {self.generate_health_bar(health['overall'])}")
        report.append("")
        
        # Critical Gaps
        report.append("⚠️  Critical Gaps Found:")
        gap_count = 1
        
        if level2.get("uncommitted"):
            report.append(f"  {gap_count}. [HIGH] {len(level2['uncommitted'])} files changed but not committed")
            report.append(f"     → Action: git add -A && git commit")
            gap_count += 1
        
        if level2.get("untracked"):
            report.append(f"  {gap_count}. [MEDIUM] {len(level2['untracked'])} untracked files")
            report.append(f"     → Action: Review and add to git or .gitignore")
            gap_count += 1
        
        if gaps.get("deception_instances"):
            report.append(f"  {gap_count}. [CRITICAL] {len(gaps['deception_instances'])} deception instances found")
            report.append(f"     → Action: Review session logs for accuracy")
            gap_count += 1
        
        if retroactive:
            report.append(f"  {gap_count}. [CRITICAL] {len(retroactive)} retroactive logging instances")
            report.append(f"     → Action: Audit session timestamps")
            gap_count += 1
        
        if assumption_gaps:
            critical_assumptions = [g for g in assumption_gaps if g.get("severity") == "CRITICAL"]
            if critical_assumptions:
                report.append(f"  {gap_count}. [CRITICAL] {len(critical_assumptions)} assumption-based reality gaps")
                report.append(f"     → Action: Review session assumptions and ghost references")
                gap_count += 1
        
        if gap_count == 1:
            report.append("  ✅ No critical gaps detected!")
        
        report.append("")
        
        # Agent Consensus (Updated for 5 agents - Session 00008)
        report.append("🔄 Agent Consensus:")
        agent_summary = level1.get("summary", {})
        report.append(f"  Healthy Agents: {agent_summary.get('healthy_agents', 0)}/5")
        report.append(f"  Limited Agents: {agent_summary.get('limited_agents', 0)}/5")
        report.append(f"  Failed Agents: {agent_summary.get('failed_agents', 0)}/5")
        
        # Add specific agent status
        for agent_name, status in level1.get("agents", {}).items():
            if agent_name != "partial_capability" and isinstance(status, dict):
                report.append(f"  {agent_name}: {status.get('status', 'unknown')}")
        
        report.append("")
        
        # Project Structure Overview (Updated Session 00008)
        report.append("📁 Reality Domain Structure:")
        report.append("  reality/")
        report.append("  ├── agent-reality-auditor/")
        report.append("  │   ├── filesystem-connector/    [FileSystem Agent]")
        report.append("  │   ├── github-connector/        [GitHub Agent]")
        report.append("  │   ├── supabase-connector/      [Supabase Agent]")
        report.append("  │   ├── vercel-connector/        [Vercel Agent - Session 00008]")
        report.append("  │   ├── static-asset-connector/  [Static Asset Agent - Session 00008]")
        report.append("  │   └── integration-connector/   [Integration Agent]")
        report.append("  ├── dashboard/                    [Reality Dashboard]")
        report.append("  └── inventory/                    [System Inventory]")
        report.append("")
        report.append("  📊 For complete structure: see PROJECT-STRUCTURE.md")
        report.append("")
        
        # Historical Trend (mock for now)
        report.append("📈 Historical Trend:")
        report.append(f"  Current: {health['overall']:.0%} integrated")
        report.append(f"  Trend: {'↑ Improving' if health['overall'] > 0.5 else '↓ Declining'}")
        report.append("")
        
        # Add Integration Debt Analysis
        debt_report = self.generate_debt_report()
        for line in debt_report.split('\n'):
            report.append(line)
        
        report.append("")
        
        # Truth Summary
        report.append("💡 Truth:")
        truth_summary = (
            f"System is {health['overall']:.0%} integrated. "
            f"Reality agents agree on {health['consistency']:.0%} of facts. "
            f"Main gap: {'uncommitted work' if level2.get('uncommitted') else 'session claim discrepancies'}."
        )
        report.append(f'  "{truth_summary}"')
        report.append("=" * 60)
        
        return "\n".join(report)
    
    def output_results(self, output_file: Optional[str] = None) -> None:
        """Output results to file or stdout"""
        report = self.generate_visual_report()
        
        if output_file:
            Path(output_file).write_text(report)
            print(f"Report saved to: {output_file}")
        else:
            print(report)
        
        # Also save JSON data
        json_data = {
            "timestamp": datetime.now().isoformat(),
            "session_id": self.session_id,
            "health_scores": self.health_scores,
            "level_1": self.level_1_health_check(),
            "level_2": self.level_2_binary_correlation(),
            "session_gaps": self.discover_session_reality_gaps(),
            "retroactive_logging": self.find_retroactive_logging()
        }
        
        json_file = self.cache_dir / f"integration_report_{self.session_id}.json"
        json_file.write_text(json.dumps(json_data, indent=2))


def main():
    """Command line interface"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description="Integration Reality Agent - Meta-Reality Discovery"
    )
    parser.add_argument(
        "--root",
        type=str,
        default=".",
        help="Root path for discovery (default: current directory)"
    )
    parser.add_argument(
        "--output",
        type=str,
        help="Output file path (default: stdout)"
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Output JSON instead of visual report"
    )
    
    args = parser.parse_args()
    
    try:
        agent = IntegrationRealityAgent(args.root)
        
        if args.json:
            # Output JSON data
            data = {
                "timestamp": datetime.now().isoformat(),
                "health_scores": agent.calculate_health_score(),
                "level_1": agent.level_1_health_check(),
                "level_2": agent.level_2_binary_correlation(),
                "session_gaps": agent.discover_session_reality_gaps(),
                "retroactive_logging": agent.find_retroactive_logging()
            }
            
            json_output = json.dumps(data, indent=2)
            if args.output:
                Path(args.output).write_text(json_output)
            else:
                print(json_output)
        else:
            # Output visual report
            agent.output_results(args.output)
        
        sys.exit(0)
        
    except Exception as e:
        error_result = {
            "error": f"Integration agent failed: {str(e)}",
            "timestamp": datetime.now().isoformat()
        }
        print(json.dumps(error_result, indent=2))
        sys.exit(1)


if __name__ == "__main__":
    main()