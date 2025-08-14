#!/usr/bin/env python3
"""
File System Reality Agent - Connector Module
Progressive discovery of file system reality with no assumptions
Based on proven patterns from Supabase Reality Agent
"""

import json
import os
import sys
import hashlib
import time
import mimetypes
import subprocess
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional, Dict, Any, List, Set
import platform

class FileSystemConnector:
    """Reality-based file system connector with progressive discovery"""
    
    # Constants from SPEC-002
    MAX_DEPTH = 10
    MAX_FILES_PER_DIR = 1000
    MAX_FILE_SIZE_FULL_READ = 1_000_000  # 1MB
    
    # Enhanced privacy patterns - NEVER read these
    NEVER_READ_CONTENT = [
        # Original patterns
        "*.env*", "*.key", "*.pem", "*_rsa", "credentials*", "secrets*",
        "*.keystore", "*.p12", "*.pfx", "*.cert", "*.crt",
        # Desktop's additions
        "*_ecdsa", "*_dsa", "id_rsa*", "id_dsa*", "id_ecdsa*",
        "*.kdbx", "*.1password", "*.keychain",
        # Additional security patterns
        "*.jks", "*.truststore", "*.bks",  # Java keystores
        "*password*", "*passwd*", "*token*",
        "*.asc", "*.gpg", "*.pgp"  # Encrypted files
    ]
    
    # Files we should never hash (might contain secrets)
    NEVER_HASH = [
        "*.sqlite", "*.db", "*.sqlite3",  # Databases might contain secrets
        "*.keychain", "*.keystore",
        "*.kdbx"  # Password manager databases
    ]
    
    # Cache TTL in seconds (reused from Supabase agent)
    CACHE_TTL = {
        "structure": 60,      # Directory structure
        "metadata": 30,       # File metadata  
        "content": 300,       # File contents
        "snapshot": 3600      # Full snapshots
    }
    
    def __init__(self, root_path: Optional[str] = None):
        """Initialize connector with optional root path"""
        if root_path:
            self.root_path = Path(root_path).resolve()
        else:
            self.root_path = Path.cwd()
            
        # Verify root path exists and is accessible
        if not self.root_path.exists():
            raise ValueError(f"REALITY_FS_001: Root path does not exist: {self.root_path}")
        if not self.root_path.is_dir():
            raise ValueError(f"REALITY_FS_002: Root path is not a directory: {self.root_path}")
            
        # Set up cache directory (reusing pattern from Supabase)
        self.cache_dir = Path(__file__).parent / ".cache"
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        self.snapshots_dir = self.cache_dir / "snapshots"
        self.snapshots_dir.mkdir(exist_ok=True)
        self.discoveries_dir = self.cache_dir / "discoveries"
        self.discoveries_dir.mkdir(exist_ok=True)
        
        self.session_id = self._generate_session_id()
        self.discovery_level = 0
        
        # Platform-specific settings
        self.platform = platform.system()
        self.case_sensitive = self._check_case_sensitivity()
        
    def _generate_session_id(self) -> str:
        """Generate unique session ID for this connection (reused from Supabase)"""
        timestamp = datetime.now().isoformat()
        unique_str = f"{self.root_path}-{timestamp}-{os.getpid()}"
        return hashlib.md5(unique_str.encode()).hexdigest()[:8]
    
    def _check_case_sensitivity(self) -> bool:
        """Check if the file system is case-sensitive"""
        test_file = self.cache_dir / "TeSt_CaSe.tmp"
        test_file_lower = self.cache_dir / "test_case.tmp"
        
        try:
            test_file.touch()
            case_sensitive = not test_file_lower.exists()
            test_file.unlink()
            return case_sensitive
        except:
            return True  # Assume case-sensitive if test fails
    
    def _get_cache_path(self, cache_type: str) -> Path:
        """Get cache file path for given type (reused from Supabase)"""
        return self.cache_dir / f"{cache_type}_{self.session_id}.json"
    
    def _is_cache_valid(self, cache_type: str) -> bool:
        """Check if cache is still valid based on TTL (reused from Supabase)"""
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
        """Retrieve cached data if valid (reused from Supabase)"""
        if self._is_cache_valid(cache_type):
            try:
                return json.loads(self._get_cache_path(cache_type).read_text())
            except Exception:
                pass
        return None
    
    def _save_cache(self, cache_type: str, data: Dict[str, Any]) -> None:
        """Save data to cache with timestamp (reused from Supabase)"""
        data["timestamp"] = datetime.now().isoformat()
        cache_path = self._get_cache_path(cache_type)
        cache_path.write_text(json.dumps(data, indent=2))
    
    def _should_read_content(self, file_path: Path) -> bool:
        """Check if file content should be read based on privacy patterns"""
        file_name = file_path.name.lower()
        
        # Check against privacy patterns
        for pattern in self.NEVER_READ_CONTENT:
            # Simple pattern matching (can be enhanced with fnmatch)
            pattern_lower = pattern.lower().replace("*", "")
            if pattern_lower in file_name:
                return False
        
        # Check file size
        try:
            if file_path.stat().st_size > self.MAX_FILE_SIZE_FULL_READ:
                return False
        except:
            return False
            
        return True
    
    def _detect_file_type(self, file_path: Path) -> str:
        """Detect MIME type of file"""
        mime_type, _ = mimetypes.guess_type(str(file_path))
        if mime_type:
            return mime_type
            
        # Check if text file by trying to read first few bytes
        try:
            with open(file_path, 'rb') as f:
                chunk = f.read(512)
                if b'\x00' in chunk:
                    return "application/octet-stream"  # Binary file
                else:
                    return "text/plain"  # Likely text file
        except:
            return "unknown"
    
    def _calculate_file_hash(self, file_path: Path) -> str:
        """Calculate SHA-256 hash of file for change detection"""
        # Check if we should hash this file
        file_name = file_path.name.lower()
        for pattern in self.NEVER_HASH:
            pattern_clean = pattern.lower().replace("*", "")
            if pattern_clean in file_name:
                return "skipped:privacy"
        
        # Also check against NEVER_READ_CONTENT patterns for consistency
        for pattern in self.NEVER_READ_CONTENT:
            if pattern.startswith("id_") and file_name.startswith(pattern.replace("*", "").lower()):
                return "skipped:privacy"
            pattern_clean = pattern.lower().replace("*", "")
            if pattern_clean and pattern_clean in file_name:
                return "skipped:privacy"
        
        sha256_hash = hashlib.sha256()
        
        try:
            with open(file_path, "rb") as f:
                # Read in chunks to handle large files
                for byte_block in iter(lambda: f.read(65536), b""):
                    sha256_hash.update(byte_block)
            return sha256_hash.hexdigest()
        except Exception as e:
            return f"error:{str(e)}"
    
    def _respect_ignore_patterns(self, path: Path) -> bool:
        """Check if path should be ignored based on .gitignore and .fs-agent-ignore"""
        # Simple implementation - can be enhanced with gitignore parser
        ignore_files = [".gitignore", ".fs-agent-ignore"]
        
        for ignore_file in ignore_files:
            ignore_path = self.root_path / ignore_file
            if ignore_path.exists():
                try:
                    patterns = ignore_path.read_text().splitlines()
                    for pattern in patterns:
                        pattern = pattern.strip()
                        if not pattern or pattern.startswith("#"):
                            continue
                        # Simple pattern matching
                        if pattern in str(path.relative_to(self.root_path)):
                            return True
                except:
                    pass
        
        # Default ignore patterns
        default_ignores = ["node_modules", ".git", "__pycache__", ".cache", "venv", ".env"]
        path_str = str(path.relative_to(self.root_path))
        for ignore in default_ignores:
            if ignore in path_str:
                return True
                
        return False
    
    def _sample_large_file(self, file_path: Path, lines: int = 100) -> Dict[str, Any]:
        """Read first and last N lines of large files"""
        result = {
            "sampled": True,
            "total_lines": 0,
            "first_lines": [],
            "last_lines": []
        }
        
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                # Read first N lines
                for i in range(lines):
                    line = f.readline()
                    if not line:
                        break
                    result["first_lines"].append(line.rstrip())
                
                # Count total lines and get last N
                f.seek(0)
                all_lines = f.readlines()
                result["total_lines"] = len(all_lines)
                result["last_lines"] = [line.rstrip() for line in all_lines[-lines:]]
                
        except Exception as e:
            result["error"] = str(e)
            
        return result
    
    def _check_git_available(self) -> bool:
        """Check if git is available and we're in a git repository"""
        try:
            result = subprocess.run(
                ["git", "rev-parse", "--show-toplevel"],
                capture_output=True,
                text=True,
                cwd=self.root_path,
                timeout=2
            )
            self.git_root = Path(result.stdout.strip()) if result.returncode == 0 else None
            return result.returncode == 0
        except:
            self.git_root = None
            return False
    
    def _get_git_status(self, file_path: Path) -> str:
        """Get git status for a file (M=modified, A=added, D=deleted, ??=untracked)"""
        if not hasattr(self, 'git_available'):
            self.git_available = self._check_git_available()
        
        if not self.git_available:
            return "no_git"
        
        try:
            # Get relative path from git root
            if self.git_root:
                try:
                    rel_path = file_path.relative_to(self.git_root)
                except ValueError:
                    return "outside_git"
            else:
                rel_path = file_path
            
            result = subprocess.run(
                ["git", "status", "--porcelain", str(rel_path)],
                capture_output=True,
                text=True,
                cwd=self.git_root or self.root_path,
                timeout=1
            )
            
            if result.returncode == 0:
                output = result.stdout.strip()
                if not output:
                    return "clean"  # Tracked and unmodified
                else:
                    # Return the git status code (first 2 chars)
                    return output[:2].strip() or "clean"
            else:
                return "error"
        except:
            return "error"
    
    def _is_git_ignored(self, file_path: Path) -> bool:
        """Check if file is ignored by git"""
        if not hasattr(self, 'git_available'):
            self.git_available = self._check_git_available()
        
        if not self.git_available:
            return False
        
        try:
            result = subprocess.run(
                ["git", "check-ignore", str(file_path)],
                capture_output=True,
                cwd=self.git_root or self.root_path,
                timeout=1
            )
            return result.returncode == 0  # Returns 0 if file is ignored
        except:
            return False
    
    def discover_level_1(self) -> Dict[str, Any]:
        """Level 1: File system availability and permissions check"""
        
        # Check cache first
        cached = self._get_cached_data("fs_level_1")
        if cached:
            cached["from_cache"] = True
            return cached
        
        result = {
            "metadata": {
                "timestamp": datetime.now().isoformat(),
                "agent": "filesystem-reality",
                "check_type": "level_1_discovery",
                "session_id": self.session_id,
                "confidence_score": 0.0,
                "root_path": str(self.root_path),
                "limitations": []
            },
            "connection": {
                "status": "unknown",
                "permission_level": "unknown",
                "root_path": str(self.root_path),
                "fs_type": self.platform,
                "case_sensitive": self.case_sensitive,
                "available_space_bytes": -1
            },
            "discoveries": {
                "level": 1,
                "summary": {}
            }
        }
        
        # Test file system access
        try:
            # Check if we can read the root directory
            if os.access(self.root_path, os.R_OK):
                result["connection"]["permission_level"] = "read"
                result["connection"]["status"] = "connected"
                result["metadata"]["confidence_score"] = 1.0
            else:
                result["connection"]["permission_level"] = "none"
                result["connection"]["status"] = "limited"
                result["metadata"]["confidence_score"] = 0.5
                result["metadata"]["limitations"].append("Limited read access to root path")
            
            # Check if we can write (but don't actually write)
            if os.access(self.root_path, os.W_OK):
                result["connection"]["permission_level"] = "read_write"
            
            # Get available disk space
            try:
                stat = os.statvfs(self.root_path)
                result["connection"]["available_space_bytes"] = stat.f_bavail * stat.f_frsize
            except AttributeError:
                # Windows doesn't have statvfs
                if self.platform == "Windows":
                    import shutil
                    total, used, free = shutil.disk_usage(self.root_path)
                    result["connection"]["available_space_bytes"] = free
            except:
                result["metadata"]["limitations"].append("Cannot determine available disk space")
            
            # Test ability to list directory contents
            try:
                list(self.root_path.iterdir())
                result["discoveries"]["summary"]["can_list_contents"] = True
            except PermissionError:
                result["discoveries"]["summary"]["can_list_contents"] = False
                result["connection"]["status"] = "failed"
                result["metadata"]["confidence_score"] = 0.0
                result["error"] = "REALITY_FS_003: Cannot list directory contents"
                
        except Exception as e:
            result["connection"]["status"] = "failed"
            result["error"] = f"REALITY_FS_001: {str(e)}"
            result["metadata"]["confidence_score"] = 0.0
        
        # Cache successful connections
        if result["connection"]["status"] in ["connected", "limited"]:
            self._save_cache("fs_level_1", result)
            self.discovery_level = 1
        
        return result
    
    def discover_level_2(self) -> Dict[str, Any]:
        """Level 2: Directory structure and file counts"""
        
        # Ensure Level 1 has passed
        level_1 = self.discover_level_1()
        if level_1["connection"]["status"] != "connected":
            return {
                "error": "REALITY_FS_003: Cannot perform Level 2 discovery without Level 1 connection",
                "level_1_status": level_1["connection"]["status"]
            }
        
        # Check cache
        cached = self._get_cached_data("fs_level_2")
        if cached:
            cached["from_cache"] = True
            return cached
        
        # Check git availability once at the start
        self.git_available = self._check_git_available()
        
        result = {
            "metadata": {
                "timestamp": datetime.now().isoformat(),
                "agent": "filesystem-reality",
                "check_type": "level_2_discovery",
                "session_id": self.session_id,
                "confidence_score": 0.0,
                "root_path": str(self.root_path),
                "limitations": []
            },
            "connection": level_1["connection"],
            "discoveries": {
                "level": 2,
                "summary": {
                    "total_directories": 0,
                    "total_files": 0,
                    "max_depth_reached": 0,
                    "directories_skipped": [],
                    "symlinks_found": 0,
                    "git_repository": self.git_available,
                    "git_root": str(self.git_root) if hasattr(self, 'git_root') and self.git_root else None
                },
                "details": {
                    "tree": {}
                }
            }
        }
        
        # Traverse directory structure
        directories_visited = set()
        files_counted = 0
        dirs_counted = 0
        max_depth = 0
        symlinks = 0
        skipped_dirs = []
        
        def traverse_directory(path: Path, depth: int = 0) -> Dict[str, Any]:
            nonlocal files_counted, dirs_counted, max_depth, symlinks, skipped_dirs
            
            if depth > self.MAX_DEPTH:
                skipped_dirs.append(f"{path} (max depth)")
                return {"skipped": "max_depth"}
            
            if path in directories_visited:
                return {"skipped": "already_visited"}
            
            directories_visited.add(path)
            max_depth = max(max_depth, depth)
            
            dir_info = {
                "file_count": 0,
                "dir_count": 0,
                "size_bytes": 0,
                "subdirs": {}
            }
            
            try:
                entries = list(path.iterdir())
                
                # Check if we should skip this directory
                if self._respect_ignore_patterns(path):
                    skipped_dirs.append(str(path.relative_to(self.root_path)))
                    return {"skipped": "ignored"}
                
                # Limit files per directory
                if len(entries) > self.MAX_FILES_PER_DIR:
                    result["metadata"]["limitations"].append(f"Directory {path} has {len(entries)} entries, limited to {self.MAX_FILES_PER_DIR}")
                    entries = entries[:self.MAX_FILES_PER_DIR]
                
                for entry in entries:
                    try:
                        if entry.is_symlink():
                            symlinks += 1
                            continue  # Never follow symlinks
                        
                        if entry.is_file():
                            dir_info["file_count"] += 1
                            files_counted += 1
                            try:
                                dir_info["size_bytes"] += entry.stat().st_size
                            except:
                                pass
                        elif entry.is_dir():
                            dir_info["dir_count"] += 1
                            dirs_counted += 1
                            # Recursive traversal
                            subdir_info = traverse_directory(entry, depth + 1)
                            if not subdir_info.get("skipped"):
                                dir_info["subdirs"][entry.name] = subdir_info
                    except PermissionError:
                        result["metadata"]["limitations"].append(f"Permission denied: {entry}")
                    except Exception as e:
                        result["metadata"]["limitations"].append(f"Error accessing {entry}: {str(e)}")
                        
            except PermissionError:
                skipped_dirs.append(f"{path} (permission denied)")
                return {"skipped": "permission_denied"}
            except Exception as e:
                return {"error": str(e)}
            
            return dir_info
        
        # Start traversal
        try:
            tree_info = traverse_directory(self.root_path)
            result["discoveries"]["details"]["tree"] = tree_info
            result["discoveries"]["summary"]["total_files"] = files_counted
            result["discoveries"]["summary"]["total_directories"] = dirs_counted
            result["discoveries"]["summary"]["max_depth_reached"] = max_depth
            result["discoveries"]["summary"]["directories_skipped"] = skipped_dirs
            result["discoveries"]["summary"]["symlinks_found"] = symlinks
            
            # Calculate confidence score
            if not skipped_dirs and not result["metadata"]["limitations"]:
                result["metadata"]["confidence_score"] = 0.9
            elif len(skipped_dirs) < 5:
                result["metadata"]["confidence_score"] = 0.7
            else:
                result["metadata"]["confidence_score"] = 0.5
                
        except Exception as e:
            result["error"] = f"REALITY_FS_004: Directory traversal failed: {str(e)}"
            result["metadata"]["confidence_score"] = 0.3
        
        # Cache if we got some data
        if result["metadata"]["confidence_score"] > 0:
            self._save_cache("fs_level_2", result)
            self.discovery_level = 2
        
        return result
    
    def discover_level_3(self) -> Dict[str, Any]:
        """Level 3: File metadata and content sampling"""
        
        # Ensure Level 2 has passed
        level_2 = self.discover_level_2()
        if level_2.get("error") or level_2["metadata"]["confidence_score"] < 0.3:
            return {
                "error": "REALITY_FS_005: Cannot perform Level 3 discovery without Level 2 structure",
                "level_2_status": level_2.get("error", "Insufficient Level 2 discovery")
            }
        
        # Check cache
        cached = self._get_cached_data("fs_level_3")
        if cached:
            cached["from_cache"] = True
            return cached
        
        result = {
            "metadata": {
                "timestamp": datetime.now().isoformat(),
                "agent": "filesystem-reality",
                "check_type": "level_3_discovery",
                "session_id": self.session_id,
                "confidence_score": 0.0,
                "root_path": str(self.root_path),
                "limitations": []
            },
            "connection": level_2["connection"],
            "discoveries": {
                "level": 3,
                "summary": {
                    "total_size_bytes": 0,
                    "file_types": {},
                    "largest_files": [],
                    "newest_files": [],
                    "files_analyzed": 0,
                    "files_hashed": 0,
                    "content_sampled": 0
                },
                "details": {
                    "files": {}
                }
            }
        }
        
        # Collect detailed file information
        all_files = []
        files_analyzed = 0
        files_hashed = 0
        content_sampled = 0
        total_size = 0
        file_types = {}
        
        def analyze_files(path: Path, depth: int = 0):
            nonlocal files_analyzed, files_hashed, content_sampled, total_size
            
            if depth > self.MAX_DEPTH:
                return
            
            try:
                for entry in path.iterdir():
                    if entry.is_symlink():
                        continue
                    
                    if entry.is_file() and not self._respect_ignore_patterns(entry):
                        try:
                            stat = entry.stat()
                            file_info = {
                                "size_bytes": stat.st_size,
                                "permissions": oct(stat.st_mode),
                                "modified": datetime.fromtimestamp(stat.st_mtime).isoformat(),
                                "type": self._detect_file_type(entry),
                                "git_status": self._get_git_status(entry)  # Add git status
                            }
                            
                            # Track file types
                            ext = entry.suffix.lower()
                            file_types[ext] = file_types.get(ext, 0) + 1
                            
                            # Calculate hash for smaller files (but respect privacy)
                            if stat.st_size < self.MAX_FILE_SIZE_FULL_READ:
                                hash_result = self._calculate_file_hash(entry)
                                file_info["hash"] = hash_result
                                if hash_result != "skipped:privacy":
                                    files_hashed += 1
                            
                            # Sample content if appropriate
                            if self._should_read_content(entry) and file_info["type"].startswith("text/"):
                                if stat.st_size > self.MAX_FILE_SIZE_FULL_READ:
                                    file_info["content_sample"] = self._sample_large_file(entry)
                                else:
                                    try:
                                        content = entry.read_text(encoding='utf-8', errors='ignore')
                                        file_info["content_preview"] = content[:500]
                                    except:
                                        pass
                                content_sampled += 1
                            
                            # Store file info
                            rel_path = str(entry.relative_to(self.root_path))
                            result["discoveries"]["details"]["files"][rel_path] = file_info
                            
                            # Track for summary
                            all_files.append({
                                "path": rel_path,
                                "size": stat.st_size,
                                "modified": stat.st_mtime
                            })
                            
                            files_analyzed += 1
                            total_size += stat.st_size
                            
                            # Limit detailed analysis
                            if files_analyzed >= 1000:
                                result["metadata"]["limitations"].append("Limited to analyzing first 1000 files")
                                return
                                
                        except Exception as e:
                            result["metadata"]["limitations"].append(f"Error analyzing {entry}: {str(e)}")
                    
                    elif entry.is_dir() and not self._respect_ignore_patterns(entry):
                        analyze_files(entry, depth + 1)
                        
            except PermissionError:
                result["metadata"]["limitations"].append(f"Permission denied: {path}")
            except Exception as e:
                result["metadata"]["limitations"].append(f"Error in {path}: {str(e)}")
        
        # Start analysis
        try:
            analyze_files(self.root_path)
            
            # Sort for largest and newest files
            all_files.sort(key=lambda x: x["size"], reverse=True)
            result["discoveries"]["summary"]["largest_files"] = [f["path"] for f in all_files[:10]]
            
            all_files.sort(key=lambda x: x["modified"], reverse=True)
            result["discoveries"]["summary"]["newest_files"] = [f["path"] for f in all_files[:10]]
            
            # Update summary
            result["discoveries"]["summary"]["total_size_bytes"] = total_size
            result["discoveries"]["summary"]["file_types"] = file_types
            result["discoveries"]["summary"]["files_analyzed"] = files_analyzed
            result["discoveries"]["summary"]["files_hashed"] = files_hashed
            result["discoveries"]["summary"]["content_sampled"] = content_sampled
            
            # Calculate confidence
            if files_analyzed > 0:
                if not result["metadata"]["limitations"]:
                    result["metadata"]["confidence_score"] = 0.95
                elif len(result["metadata"]["limitations"]) < 5:
                    result["metadata"]["confidence_score"] = 0.8
                else:
                    result["metadata"]["confidence_score"] = 0.6
            else:
                result["metadata"]["confidence_score"] = 0.4
                
        except Exception as e:
            result["error"] = f"REALITY_FS_006: File analysis failed: {str(e)}"
            result["metadata"]["confidence_score"] = 0.4
        
        # Cache if we got some data
        if result["metadata"]["confidence_score"] > 0:
            self._save_cache("fs_level_3", result)
            self.discovery_level = 3
        
        return result
    
    def capture_snapshot(self, discovery_level: int = 3) -> Dict[str, Any]:
        """Capture a snapshot at the specified discovery level (adapted from Supabase)"""
        snapshot = {
            "snapshot_id": hashlib.md5(f"{self.session_id}-{datetime.now().isoformat()}".encode()).hexdigest()[:8],
            "timestamp": datetime.now().isoformat(),
            "root_path": str(self.root_path),
            "discovery_level": discovery_level,
            "state": {},
            "statistics": {}
        }
        
        # Capture based on discovery level
        if discovery_level >= 1:
            level_1 = self.discover_level_1()
            snapshot["state"]["connection"] = level_1.get("connection", {})
            
        if discovery_level >= 2:
            level_2 = self.discover_level_2()
            snapshot["state"]["structure"] = level_2.get("discoveries", {}).get("details", {}).get("tree", {})
            snapshot["statistics"]["files_scanned"] = level_2.get("discoveries", {}).get("summary", {}).get("total_files", 0)
            snapshot["statistics"]["directories_scanned"] = level_2.get("discoveries", {}).get("summary", {}).get("total_directories", 0)
            
        if discovery_level >= 3:
            level_3 = self.discover_level_3()
            snapshot["state"]["metadata"] = level_3.get("discoveries", {}).get("details", {}).get("files", {})
            snapshot["state"]["hashes"] = {}
            for file_path, file_info in snapshot["state"]["metadata"].items():
                if "hash" in file_info:
                    snapshot["state"]["hashes"][file_path] = file_info["hash"]
        
        # Save snapshot
        snapshot_path = self.snapshots_dir / f"fs_snapshot_{snapshot['snapshot_id']}.json"
        snapshot_path.write_text(json.dumps(snapshot, indent=2))
        
        return snapshot
    
    def compare_snapshots(self, old_snapshot: Dict, new_snapshot: Dict) -> Dict[str, Any]:
        """Compare two snapshots to detect changes (adapted from Supabase)"""
        result = {
            "change_detection": {
                "enabled": True,
                "previous_snapshot": old_snapshot.get("snapshot_id", "unknown"),
                "current_snapshot": new_snapshot.get("snapshot_id", "unknown"),
                "changes": {
                    "files_added": [],
                    "files_removed": [],
                    "files_modified": [],
                    "directories_added": [],
                    "directories_removed": [],
                    "permission_changes": [],
                    "total_size_change_bytes": 0
                }
            }
        }
        
        # Compare file hashes
        old_hashes = old_snapshot.get("state", {}).get("hashes", {})
        new_hashes = new_snapshot.get("state", {}).get("hashes", {})
        
        old_paths = set(old_hashes.keys())
        new_paths = set(new_hashes.keys())
        
        # Files added/removed
        result["change_detection"]["changes"]["files_added"] = list(new_paths - old_paths)
        result["change_detection"]["changes"]["files_removed"] = list(old_paths - new_paths)
        
        # Files modified
        for path in old_paths & new_paths:
            if old_hashes[path] != new_hashes[path]:
                result["change_detection"]["changes"]["files_modified"].append(path)
        
        # Calculate size changes
        old_metadata = old_snapshot.get("state", {}).get("metadata", {})
        new_metadata = new_snapshot.get("state", {}).get("metadata", {})
        
        old_size = sum(f.get("size_bytes", 0) for f in old_metadata.values())
        new_size = sum(f.get("size_bytes", 0) for f in new_metadata.values())
        result["change_detection"]["changes"]["total_size_change_bytes"] = new_size - old_size
        
        return result
    
    def discover(self, level: int = 1) -> Dict[str, Any]:
        """Main discovery method - progressive by level"""
        if level == 1:
            return self.discover_level_1()
        elif level == 2:
            return self.discover_level_2()
        elif level == 3:
            return self.discover_level_3()
        else:
            return {"error": f"Invalid discovery level: {level}. Must be 1-3"}


def main():
    """CLI interface for the File System Reality Agent"""
    import argparse
    
    parser = argparse.ArgumentParser(description="File System Reality Agent - Progressive Discovery")
    parser.add_argument("--level", type=int, choices=[1, 2, 3], default=1,
                       help="Discovery level (1: Access, 2: Structure, 3: Metadata)")
    parser.add_argument("--root", type=str, default=None,
                       help="Root path to analyze (default: current directory)")
    parser.add_argument("--snapshot", action="store_true",
                       help="Capture a snapshot at the specified level")
    parser.add_argument("--no-cache", action="store_true",
                       help="Bypass cache and force fresh discovery")
    
    args = parser.parse_args()
    
    try:
        connector = FileSystemConnector(root_path=args.root)
        
        if args.no_cache:
            # Clear cache for this session
            for cache_type in ["fs_level_1", "fs_level_2", "fs_level_3"]:
                cache_path = connector._get_cache_path(cache_type)
                if cache_path.exists():
                    cache_path.unlink()
        
        if args.snapshot:
            result = connector.capture_snapshot(discovery_level=args.level)
            print(f"Snapshot captured: {result['snapshot_id']}")
        else:
            result = connector.discover(level=args.level)
        
        print(json.dumps(result, indent=2))
        
    except Exception as e:
        print(json.dumps({
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }, indent=2))
        sys.exit(1)


if __name__ == "__main__":
    main()