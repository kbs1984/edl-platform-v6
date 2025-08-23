#!/usr/bin/env python3
"""
Reality Domain Auditor
Automatically discovers and validates actual system state
"""

import os
import sys
import json
import hashlib
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional
import subprocess

class RealityAuditor:
    """Chief Truth Officer - automatically audits actual reality"""
    
    def __init__(self, root_path: str):
        self.root_path = Path(root_path)
        self.reality_path = self.root_path / "reality"
        self.last_audit_file = self.reality_path / "inventory" / "LAST-AUDIT.json"
        
    def discover_file_system_reality(self) -> Dict[str, Any]:
        """Discover actual file system state"""
        reality = {
            "timestamp": datetime.now().isoformat(),
            "audit_type": "file_system",
            "discoveries": {
                "directories": {},
                "files": {},
                "metrics": {}
            }
        }
        
        # Count directories by domain
        for domain_dir in self.root_path.iterdir():
            if domain_dir.is_dir() and not self._is_system_dir(domain_dir.name):
                reality["discoveries"]["directories"][domain_dir.name] = {
                    "exists": True,
                    "subdirectories": [d.name for d in domain_dir.iterdir() if d.is_dir()],
                    "file_count": len([f for f in domain_dir.rglob("*") if f.is_file()])
                }
        
        # Important files inventory
        important_files = [
            "DIRECTORY-MAP-CONSTITUTION.md",
            "SYSTEM-INDEX.md", 
            "SESSION-PROTOCOL.md"
        ]
        
        for file_name in important_files:
            file_path = self.root_path / file_name
            reality["discoveries"]["files"][file_name] = {
                "exists": file_path.exists(),
                "size": file_path.stat().st_size if file_path.exists() else 0,
                "modified": datetime.fromtimestamp(file_path.stat().st_mtime).isoformat() if file_path.exists() else None
            }
        
        # Calculate metrics
        total_files = sum(len(list(p.rglob("*"))) for p in self.root_path.iterdir() if p.is_dir() and not self._is_system_dir(p.name))
        total_dirs = len([d for d in self.root_path.iterdir() if d.is_dir() and not self._is_system_dir(d.name)])
        
        reality["discoveries"]["metrics"] = {
            "total_files": total_files,
            "total_directories": total_dirs,
            "constitution_compliant": self._check_constitution_compliance()
        }
        
        return reality
    
    def discover_project_reality(self) -> Dict[str, Any]:
        """Discover actual project state from parent directory"""
        reality = {
            "timestamp": datetime.now().isoformat(),
            "audit_type": "project_inventory",
            "discoveries": {
                "past_projects": {},
                "available_resources": {},
                "integration_points": {}
            }
        }
        
        # Scan parent directory for other projects
        parent_path = self.root_path.parent
        if parent_path.exists():
            for project_dir in parent_path.iterdir():
                if project_dir.is_dir() and project_dir.name != self.root_path.name:
                    reality["discoveries"]["past_projects"][project_dir.name] = {
                        "path": str(project_dir),
                        "size": self._get_directory_size(project_dir),
                        "file_count": len(list(project_dir.rglob("*"))),
                        "has_readme": (project_dir / "README.md").exists(),
                        "has_docs": (project_dir / "docs").exists(),
                        "last_modified": self._get_last_modified(project_dir)
                    }
        
        return reality
    
    def discover_capabilities_reality(self) -> Dict[str, Any]:
        """Discover actual system capabilities"""
        reality = {
            "timestamp": datetime.now().isoformat(),
            "audit_type": "capabilities",
            "discoveries": {
                "technical": {},
                "tools": {},
                "environment": {}
            }
        }
        
        # Check technical capabilities
        reality["discoveries"]["technical"] = {
            "python_available": self._check_command_exists("python3"),
            "git_available": self._check_command_exists("git"),
            "node_available": self._check_command_exists("node"),
            "bash_available": self._check_command_exists("bash")
        }
        
        # Check environment
        reality["discoveries"]["environment"] = {
            "working_directory": str(os.getcwd()),
            "platform": os.name,
            "path_separator": os.sep,
            "user": os.environ.get("USER", "unknown")
        }
        
        return reality
    
    def audit_reality_vs_documentation(self) -> Dict[str, Any]:
        """Compare documented reality vs actual reality"""
        audit = {
            "timestamp": datetime.now().isoformat(),
            "audit_type": "truth_verification",
            "discrepancies": []
        }
        
        # Check if documented state matches actual state
        current_state_file = self.reality_path / "inventory" / "CURRENT-STATE.md"
        
        if current_state_file.exists():
            documented_state = self._parse_documented_state(current_state_file)
            actual_state = self.discover_file_system_reality()
            
            # Compare and find discrepancies
            discrepancies = self._compare_states(documented_state, actual_state)
            audit["discrepancies"] = discrepancies
        
        return audit
    
    def _check_constitution_compliance(self) -> bool:
        """Quick check if system is constitution compliant"""
        try:
            # Use the constitution enforcer for this
            enforcer_path = self.root_path / "shared" / "tools" / "enforcement" / "constitution-enforcer.py"
            if enforcer_path.exists():
                result = subprocess.run([
                    "python3", str(enforcer_path), "validate"
                ], capture_output=True, text=True, cwd=str(self.root_path))
                return result.returncode == 0
        except Exception:
            pass
        return False
    
    def _is_system_dir(self, dir_name: str) -> bool:
        """Check if directory is a system directory"""
        system_dirs = {".git", "__pycache__", ".vscode", "node_modules"}
        return dir_name in system_dirs
    
    def _get_directory_size(self, path: Path) -> int:
        """Get total size of directory in bytes"""
        try:
            total_size = sum(f.stat().st_size for f in path.rglob("*") if f.is_file())
            return total_size
        except Exception:
            return 0
    
    def _get_last_modified(self, path: Path) -> str:
        """Get last modification time of directory"""
        try:
            latest_time = max(f.stat().st_mtime for f in path.rglob("*") if f.is_file())
            return datetime.fromtimestamp(latest_time).isoformat()
        except Exception:
            return datetime.now().isoformat()
    
    def _check_command_exists(self, command: str) -> bool:
        """Check if a command exists in the system"""
        try:
            subprocess.run([command, "--version"], capture_output=True, check=True)
            return True
        except (subprocess.CalledProcessError, FileNotFoundError):
            return False
    
    def _parse_documented_state(self, file_path: Path) -> Dict:
        """Parse documented state from markdown file"""
        # This would parse the CURRENT-STATE.md file
        # For now, return empty dict - implement markdown parsing as needed
        return {}
    
    def _compare_states(self, documented: Dict, actual: Dict) -> List[str]:
        """Compare documented vs actual state and return discrepancies"""
        discrepancies = []
        
        # This would implement detailed comparison logic
        # For now, placeholder implementation
        
        return discrepancies
    
    def comprehensive_reality_audit(self, session: str = "REALITY_AUDIT") -> Dict[str, Any]:
        """Run comprehensive reality audit"""
        audit_results = {
            "session": session,
            "timestamp": datetime.now().isoformat(),
            "audits": {}
        }
        
        # Run all audit types
        audit_results["audits"]["file_system"] = self.discover_file_system_reality()
        audit_results["audits"]["projects"] = self.discover_project_reality()
        audit_results["audits"]["capabilities"] = self.discover_capabilities_reality()
        audit_results["audits"]["truth_verification"] = self.audit_reality_vs_documentation()
        
        # Save audit results
        self._save_audit_results(audit_results)
        
        return audit_results
    
    def _save_audit_results(self, results: Dict[str, Any]):
        """Save audit results to reality domain"""
        # Ensure inventory directory exists
        inventory_dir = self.reality_path / "inventory"
        inventory_dir.mkdir(parents=True, exist_ok=True)
        
        # Save to timestamped file
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        audit_file = inventory_dir / f"AUDIT-{timestamp}.json"
        
        with open(audit_file, "w") as f:
            json.dump(results, f, indent=2)
        
        # Update last audit pointer
        with open(self.last_audit_file, "w") as f:
            json.dump({
                "last_audit": timestamp,
                "file": str(audit_file),
                "session": results["session"]
            }, f, indent=2)
    
    def get_reality_health_score(self) -> float:
        """Calculate reality domain health score (0-100)"""
        score = 100.0
        
        # Deduct points for missing essential components
        essential_files = [
            self.reality_path / "PURPOSE.md",
            self.reality_path / "inventory" / "CURRENT-STATE.md"
        ]
        
        for file_path in essential_files:
            if not file_path.exists():
                score -= 20
        
        # Deduct points for constitution violations
        if not self._check_constitution_compliance():
            score -= 30
        
        # Deduct points for stale data
        if self.last_audit_file.exists():
            try:
                with open(self.last_audit_file) as f:
                    last_audit = json.load(f)
                    # Check if audit is older than 24 hours
                    # Implementation would go here
            except Exception:
                score -= 10
        else:
            score -= 15  # No audit history
        
        return max(0.0, score)


def main():
    """Command line interface for reality auditor"""
    if len(sys.argv) < 2:
        print("Usage: reality-auditor.py <command> [session]")
        print("Commands: audit, health, verify, discover")
        sys.exit(1)
    
    command = sys.argv[1]
    session = sys.argv[2] if len(sys.argv) > 2 else "CLI_AUDIT"
    root_path = os.getcwd()
    
    auditor = RealityAuditor(root_path)
    
    if command == "audit":
        print(f"Running comprehensive reality audit - Session {session}")
        results = auditor.comprehensive_reality_audit(session)
        
        print(f"✅ Reality audit complete")
        print(f"📊 File system: {results['audits']['file_system']['discoveries']['metrics']['total_files']} files")
        print(f"📁 Projects discovered: {len(results['audits']['projects']['discoveries']['past_projects'])}")
        print(f"🔧 Capabilities verified: {len(results['audits']['capabilities']['discoveries']['technical'])}")
        
    elif command == "health":
        score = auditor.get_reality_health_score()
        print(f"Reality Domain Health Score: {score:.1f}/100")
        
        if score >= 90:
            print("🟢 Excellent - Reality domain is healthy")
        elif score >= 70:
            print("🟡 Good - Minor issues detected")
        elif score >= 50:
            print("🟠 Warning - Significant issues detected")
        else:
            print("🔴 Critical - Reality domain needs attention")
    
    elif command == "verify":
        audit = auditor.audit_reality_vs_documentation()
        discrepancies = audit.get("discrepancies", [])
        
        if not discrepancies:
            print("✅ Reality verification passed - documentation matches actual state")
        else:
            print(f"❌ Reality verification failed - {len(discrepancies)} discrepancies found")
            for discrepancy in discrepancies:
                print(f"  - {discrepancy}")
    
    elif command == "discover":
        print("Discovering current reality...")
        fs_reality = auditor.discover_file_system_reality()
        project_reality = auditor.discover_project_reality()
        
        print(f"📁 Directories: {len(fs_reality['discoveries']['directories'])}")
        print(f"📄 Files: {fs_reality['discoveries']['metrics']['total_files']}")
        print(f"🏗️ Past projects: {len(project_reality['discoveries']['past_projects'])}")
        
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)


if __name__ == "__main__":
    main()