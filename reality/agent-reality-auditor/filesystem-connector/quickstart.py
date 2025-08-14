#!/usr/bin/env python3
"""
File System Reality Agent - Quick Start Validation
Validates environment and provides estimates before full discovery
"""

import os
import sys
import time
import subprocess
from pathlib import Path
from typing import Dict, Any, List, Optional

class FileSystemQuickStart:
    """Quick validation and estimation for File System Agent"""
    
    def __init__(self, root_path: Optional[str] = None):
        """Initialize quickstart with optional root path"""
        if root_path:
            self.root_path = Path(root_path).resolve()
        else:
            self.root_path = Path.cwd()
    
    def check_basic_access(self) -> Dict[str, Any]:
        """Test basic file system access"""
        result = {
            "root_exists": False,
            "can_read": False,
            "can_list": False,
            "is_directory": False,
            "absolute_path": str(self.root_path)
        }
        
        try:
            result["root_exists"] = self.root_path.exists()
            result["is_directory"] = self.root_path.is_dir()
            
            if result["root_exists"] and result["is_directory"]:
                result["can_read"] = os.access(self.root_path, os.R_OK)
                
                # Try to list contents
                try:
                    list(self.root_path.iterdir())
                    result["can_list"] = True
                except PermissionError:
                    result["can_list"] = False
        except Exception as e:
            result["error"] = str(e)
        
        return result
    
    def estimate_scope(self) -> Dict[str, Any]:
        """Estimate the scope of discovery"""
        result = {
            "estimated_files": 0,
            "estimated_directories": 0,
            "large_directories": [],
            "problematic_patterns": [],
            "estimated_time_seconds": 0,
            "recommended_level": 1
        }
        
        file_count = 0
        dir_count = 0
        large_dirs = []
        problems = []
        
        # Quick sample of top-level directories
        try:
            for entry in self.root_path.iterdir():
                if entry.is_symlink():
                    continue
                    
                if entry.is_dir():
                    dir_count += 1
                    dir_name = entry.name
                    
                    # Check for known problematic patterns
                    if dir_name in ["node_modules", ".git", "venv", ".env", "__pycache__"]:
                        problems.append(f"{dir_name} (will be skipped)")
                        continue
                    
                    # Quick count of subdirectory
                    try:
                        subentries = list(entry.iterdir())
                        if len(subentries) > 100:
                            large_dirs.append(f"{dir_name} ({len(subentries)} items)")
                        file_count += sum(1 for e in subentries if e.is_file())
                        dir_count += sum(1 for e in subentries if e.is_dir())
                    except PermissionError:
                        problems.append(f"{dir_name} (permission denied)")
                    except:
                        pass
                        
                elif entry.is_file():
                    file_count += 1
            
            # Rough estimates (multiply by depth factor)
            depth_factor = 3  # Assume average depth of 3
            result["estimated_files"] = file_count * depth_factor
            result["estimated_directories"] = dir_count * depth_factor
            result["large_directories"] = large_dirs
            result["problematic_patterns"] = problems
            
            # Time estimation (roughly 1000 files per second)
            result["estimated_time_seconds"] = max(1, result["estimated_files"] / 1000)
            
            # Recommend discovery level based on size
            if result["estimated_files"] < 100:
                result["recommended_level"] = 3  # Full discovery for small projects
            elif result["estimated_files"] < 1000:
                result["recommended_level"] = 2  # Structure and basic metadata
            else:
                result["recommended_level"] = 1  # Start with basic access check
                
        except Exception as e:
            result["error"] = str(e)
        
        return result
    
    def check_git_availability(self) -> Dict[str, bool]:
        """Check if git is available and this is a git repository"""
        result = {
            "git_installed": False,
            "is_git_repo": False,
            "git_root": None
        }
        
        # Check if git is installed
        try:
            subprocess.run(["git", "--version"], capture_output=True, check=True)
            result["git_installed"] = True
        except:
            return result
        
        # Check if we're in a git repository
        try:
            git_result = subprocess.run(
                ["git", "rev-parse", "--show-toplevel"],
                capture_output=True,
                text=True,
                cwd=self.root_path,
                check=True
            )
            result["is_git_repo"] = True
            result["git_root"] = git_result.stdout.strip()
        except:
            pass
        
        return result
    
    def check_disk_space(self) -> Dict[str, Any]:
        """Check available disk space"""
        result = {
            "available_gb": 0,
            "total_gb": 0,
            "used_percent": 0,
            "sufficient_space": False
        }
        
        try:
            if hasattr(os, 'statvfs'):
                # Unix/Linux
                stat = os.statvfs(self.root_path)
                result["available_gb"] = (stat.f_bavail * stat.f_frsize) / (1024**3)
                result["total_gb"] = (stat.f_blocks * stat.f_frsize) / (1024**3)
            else:
                # Windows
                import shutil
                total, used, free = shutil.disk_usage(self.root_path)
                result["available_gb"] = free / (1024**3)
                result["total_gb"] = total / (1024**3)
            
            result["used_percent"] = ((result["total_gb"] - result["available_gb"]) / result["total_gb"]) * 100
            result["sufficient_space"] = result["available_gb"] > 0.1  # Need at least 100MB for cache
            
        except Exception as e:
            result["error"] = str(e)
        
        return result
    
    def detect_privacy_risks(self) -> Dict[str, Any]:
        """Quick scan for files that should never be read"""
        result = {
            "sensitive_files_found": [],
            "warnings": [],
            "safe_to_proceed": True
        }
        
        sensitive_patterns = [
            ".env", ".env.local", ".env.production",
            "id_rsa", "id_dsa", "id_ecdsa",
            ".key", ".pem", ".p12",
            "credentials", "secrets",
            ".keychain", ".keystore"
        ]
        
        try:
            # Only check top-level for quick scan
            for entry in self.root_path.iterdir():
                if entry.is_file():
                    name_lower = entry.name.lower()
                    for pattern in sensitive_patterns:
                        if pattern in name_lower:
                            result["sensitive_files_found"].append(entry.name)
                            result["warnings"].append(f"Found sensitive file: {entry.name} (will not read content)")
                            break
            
            # Still safe to proceed, we just won't read these files
            result["safe_to_proceed"] = True
            
        except Exception as e:
            result["error"] = str(e)
            result["safe_to_proceed"] = False
        
        return result
    
    def generate_recommendations(self, checks: Dict[str, Any]) -> List[str]:
        """Generate recommendations based on checks"""
        recommendations = []
        
        # Based on scope
        scope = checks.get("scope", {})
        if scope.get("estimated_files", 0) > 10000:
            recommendations.append("⚠️  Large project detected. Consider starting with Level 1 discovery")
        
        if scope.get("large_directories"):
            recommendations.append("📁 Large directories found. These will be limited to 1000 files each")
        
        if scope.get("problematic_patterns"):
            recommendations.append(f"🚫 Will skip: {', '.join(scope['problematic_patterns'])}")
        
        # Based on git
        git = checks.get("git", {})
        if git.get("is_git_repo"):
            recommendations.append("✅ Git repository detected. Will add git status to metadata")
        
        # Based on disk space
        disk = checks.get("disk_space", {})
        if not disk.get("sufficient_space"):
            recommendations.append("⚠️  Low disk space. Cache may be limited")
        
        # Based on privacy
        privacy = checks.get("privacy", {})
        if privacy.get("sensitive_files_found"):
            recommendations.append(f"🔒 {len(privacy['sensitive_files_found'])} sensitive files detected. Content will not be read")
        
        # Time estimate
        time_est = scope.get("estimated_time_seconds", 0)
        if time_est < 5:
            recommendations.append(f"⚡ Quick discovery expected (~{time_est:.1f} seconds)")
        elif time_est < 30:
            recommendations.append(f"⏱️  Moderate discovery expected (~{time_est:.0f} seconds)")
        else:
            recommendations.append(f"⏳ Large discovery expected (~{time_est/60:.1f} minutes)")
        
        return recommendations
    
    def run(self) -> Dict[str, Any]:
        """Run all quickstart checks"""
        print("🔍 File System Reality Agent - Quick Start Validation")
        print(f"📂 Root path: {self.root_path}")
        print("-" * 60)
        
        result = {
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "root_path": str(self.root_path),
            "checks": {},
            "ready": False,
            "recommendations": []
        }
        
        # Run all checks
        print("1. Checking basic access...")
        result["checks"]["access"] = self.check_basic_access()
        
        if not result["checks"]["access"]["can_list"]:
            result["ready"] = False
            result["error"] = "Cannot list directory contents"
            return result
        
        print("2. Estimating discovery scope...")
        result["checks"]["scope"] = self.estimate_scope()
        
        print("3. Checking git availability...")
        result["checks"]["git"] = self.check_git_availability()
        
        print("4. Checking disk space...")
        result["checks"]["disk_space"] = self.check_disk_space()
        
        print("5. Detecting privacy risks...")
        result["checks"]["privacy"] = self.detect_privacy_risks()
        
        # Generate recommendations
        result["recommendations"] = self.generate_recommendations(result["checks"])
        
        # Determine if ready
        result["ready"] = (
            result["checks"]["access"]["can_list"] and
            result["checks"]["privacy"]["safe_to_proceed"] and
            result["checks"]["disk_space"].get("sufficient_space", True)
        )
        
        return result
    
    def print_summary(self, result: Dict[str, Any]) -> None:
        """Print a nice summary of the quickstart results"""
        print("\n" + "=" * 60)
        print("📊 QUICKSTART SUMMARY")
        print("=" * 60)
        
        # Access status
        access = result["checks"]["access"]
        print(f"\n✅ Basic Access: {'OK' if access['can_list'] else 'FAILED'}")
        print(f"   Root: {access['absolute_path']}")
        
        # Scope estimate
        scope = result["checks"]["scope"]
        print(f"\n📈 Estimated Scope:")
        print(f"   Files: ~{scope['estimated_files']}")
        print(f"   Directories: ~{scope['estimated_directories']}")
        print(f"   Time: ~{scope['estimated_time_seconds']:.1f} seconds")
        print(f"   Recommended Level: {scope['recommended_level']}")
        
        # Git status
        git = result["checks"]["git"]
        if git["git_installed"]:
            print(f"\n🔧 Git: {'Repository detected' if git['is_git_repo'] else 'Not a repository'}")
        
        # Disk space
        disk = result["checks"]["disk_space"]
        print(f"\n💾 Disk Space: {disk['available_gb']:.1f} GB available")
        
        # Privacy
        privacy = result["checks"]["privacy"]
        if privacy["sensitive_files_found"]:
            print(f"\n🔒 Privacy: {len(privacy['sensitive_files_found'])} sensitive files found (will skip)")
        
        # Recommendations
        if result["recommendations"]:
            print("\n💡 Recommendations:")
            for rec in result["recommendations"]:
                print(f"   {rec}")
        
        # Final status
        print("\n" + "=" * 60)
        if result["ready"]:
            print("✅ READY TO START DISCOVERY")
            print(f"Run: python3 connector.py --level {scope['recommended_level']}")
        else:
            print("❌ NOT READY")
            if "error" in result:
                print(f"Error: {result['error']}")
        print("=" * 60)


def main():
    """Run quickstart validation"""
    import argparse
    import json
    
    parser = argparse.ArgumentParser(description="File System Reality Agent - Quick Start")
    parser.add_argument("--root", type=str, default=None,
                       help="Root path to analyze (default: current directory)")
    parser.add_argument("--json", action="store_true",
                       help="Output as JSON instead of summary")
    
    args = parser.parse_args()
    
    quickstart = FileSystemQuickStart(root_path=args.root)
    result = quickstart.run()
    
    if args.json:
        print(json.dumps(result, indent=2))
    else:
        quickstart.print_summary(result)
    
    # Exit code based on readiness
    sys.exit(0 if result["ready"] else 1)


if __name__ == "__main__":
    main()