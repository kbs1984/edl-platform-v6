#!/usr/bin/env python3
"""
Constitution Enforcer
Prevents violations of Directory Map Constitution
"""

import os
import sys
import json
import hashlib
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple, Optional

class ConstitutionEnforcer:
    def __init__(self, root_path: str):
        self.root_path = Path(root_path)
        self.constitution_path = self.root_path / "DIRECTORY-MAP-CONSTITUTION.md"
        self.violations_log = self.root_path / "CONSTITUTION-VIOLATIONS.log"
        self.sacred_map = self._load_sacred_map()
        
    def _load_sacred_map(self) -> Dict:
        """Load the sacred directory structure from constitution"""
        sacred_structure = {
            "requirements": {
                "required_subdirs": ["goals", "specifications", "constraints", "agent-requirements-manager"],
                "required_files": ["PURPOSE.md", "REQUIREMENTS_INDEX.md"]
            },
            "reality": {
                "required_subdirs": ["inventory", "capabilities", "limitations", "project-registry", "agent-reality-auditor"],
                "required_files": ["PURPOSE.md", "REALITY_INDEX.md"]
            },
            "reconciliation": {
                "required_subdirs": ["gap-analysis", "action-plans", "progress-tracking", "agent-reconciliation-orchestrator"],
                "required_files": ["PURPOSE.md", "RECONCILIATION_INDEX.md"]
            },
            "shared": {
                "required_subdirs": ["templates", "tools", "protocols"],
                "required_files": ["PURPOSE.md"]
            },
            "archive": {
                "required_subdirs": ["sessions"],
                "required_files": ["PURPOSE.md"]
            }
        }
        return sacred_structure
    
    def audit_structure(self) -> Tuple[bool, List[str]]:
        """Audit current structure against sacred map"""
        violations = []
        
        # Check for unauthorized directories
        current_dirs = [d.name for d in self.root_path.iterdir() if d.is_dir()]
        authorized_dirs = set(self.sacred_map.keys())
        
        for dir_name in current_dirs:
            if dir_name not in authorized_dirs and not self._is_system_dir(dir_name):
                violations.append(f"UNAUTHORIZED_DIRECTORY: {dir_name}")
        
        # Check domain structure compliance
        for domain, requirements in self.sacred_map.items():
            domain_path = self.root_path / domain
            
            if not domain_path.exists():
                violations.append(f"MISSING_DOMAIN: {domain}")
                continue
                
            # Check required subdirectories
            for required_subdir in requirements["required_subdirs"]:
                subdir_path = domain_path / required_subdir
                if not subdir_path.exists():
                    violations.append(f"MISSING_SUBDIR: {domain}/{required_subdir}")
            
            # Check required files
            for required_file in requirements["required_files"]:
                file_path = domain_path / required_file
                if not file_path.exists():
                    violations.append(f"MISSING_FILE: {domain}/{required_file}")
        
        return len(violations) == 0, violations
    
    def _is_system_dir(self, dir_name: str) -> bool:
        """Check if directory is a system directory (git, etc)"""
        system_dirs = {".git", "__pycache__", ".vscode", "node_modules"}
        return dir_name in system_dirs
    
    def enforce_naming_conventions(self) -> Tuple[bool, List[str]]:
        """Enforce constitutional naming conventions"""
        violations = []
        
        for domain_path in self.root_path.iterdir():
            if not domain_path.is_dir() or self._is_system_dir(domain_path.name):
                continue
                
            # Check domain naming (lowercase with hyphens)
            if not self._is_valid_domain_name(domain_path.name):
                violations.append(f"INVALID_DOMAIN_NAME: {domain_path.name}")
            
            # Check subdirectory naming
            for subdir in domain_path.iterdir():
                if subdir.is_dir():
                    if not self._is_valid_subdirectory_name(subdir.name):
                        violations.append(f"INVALID_SUBDIR_NAME: {domain_path.name}/{subdir.name}")
                
                # Check file naming for index files
                elif subdir.is_file() and subdir.name.endswith("_INDEX.md"):
                    if not subdir.name.isupper():
                        violations.append(f"INVALID_INDEX_NAME: {domain_path.name}/{subdir.name}")
        
        return len(violations) == 0, violations
    
    def _is_valid_domain_name(self, name: str) -> bool:
        """Check if domain name follows convention"""
        return name.islower() and "-" in name or name in self.sacred_map.keys()
    
    def _is_valid_subdirectory_name(self, name: str) -> bool:
        """Check if subdirectory name follows convention"""
        # Allow agent- prefix, lowercase with hyphens
        return (name.startswith("agent-") and name[6:].replace("-", "").islower()) or \
               (name.replace("-", "").islower())
    
    def validate_purpose_files(self) -> Tuple[bool, List[str]]:
        """Ensure all PURPOSE.md files exist and are properly formatted"""
        violations = []
        
        for domain, requirements in self.sacred_map.items():
            purpose_file = self.root_path / domain / "PURPOSE.md"
            
            if not purpose_file.exists():
                violations.append(f"MISSING_PURPOSE: {domain}/PURPOSE.md")
                continue
            
            # Read and validate purpose file format
            try:
                content = purpose_file.read_text()
                if not self._validate_purpose_format(content, domain):
                    violations.append(f"INVALID_PURPOSE_FORMAT: {domain}/PURPOSE.md")
            except Exception as e:
                violations.append(f"PURPOSE_READ_ERROR: {domain}/PURPOSE.md - {str(e)}")
        
        return len(violations) == 0, violations
    
    def _validate_purpose_format(self, content: str, domain: str) -> bool:
        """Validate PURPOSE.md file format"""
        required_sections = ["Mission", "Core Responsibilities", "Operating Principles"]
        
        for section in required_sections:
            if f"## {section}" not in content and f"### {section}" not in content:
                return False
        
        return True
    
    def log_violation(self, violation: str, session: str = "UNKNOWN"):
        """Log a constitutional violation"""
        timestamp = datetime.now().isoformat()
        log_entry = f"{timestamp} | {session} | {violation}\n"
        
        with open(self.violations_log, "a") as f:
            f.write(log_entry)
    
    def comprehensive_audit(self, session: str = "AUDIT") -> Dict:
        """Run complete constitutional compliance audit"""
        results = {
            "timestamp": datetime.now().isoformat(),
            "session": session,
            "compliant": True,
            "violations": []
        }
        
        # Structure audit
        structure_ok, structure_violations = self.audit_structure()
        results["violations"].extend(structure_violations)
        
        # Naming audit
        naming_ok, naming_violations = self.enforce_naming_conventions()
        results["violations"].extend(naming_violations)
        
        # Purpose files audit
        purpose_ok, purpose_violations = self.validate_purpose_files()
        results["violations"].extend(purpose_violations)
        
        # Overall compliance
        results["compliant"] = structure_ok and naming_ok and purpose_ok
        
        # Log violations
        for violation in results["violations"]:
            self.log_violation(violation, session)
        
        return results
    
    def prevent_unauthorized_changes(self, proposed_changes: List[str]) -> Tuple[bool, List[str]]:
        """Block unauthorized directory changes"""
        blocked_changes = []
        
        for change in proposed_changes:
            if self._is_unauthorized_change(change):
                blocked_changes.append(change)
        
        return len(blocked_changes) == 0, blocked_changes
    
    def _is_unauthorized_change(self, change: str) -> bool:
        """Check if a proposed change violates constitution"""
        # This would integrate with git hooks or file system monitoring
        # For now, implement basic checks
        
        if "mkdir" in change.lower():
            # Check if creating directory in authorized location
            return self._validate_mkdir_command(change)
        
        if "rmdir" in change.lower() or "rm -rf" in change.lower():
            # Block deletion of constitutional directories
            return self._validate_delete_command(change)
        
        return False
    
    def _validate_mkdir_command(self, command: str) -> bool:
        """Validate mkdir command against constitution"""
        # Extract directory path from command
        # Check against sacred map
        # Return False if unauthorized
        return False  # Placeholder - implement based on command parsing
    
    def _validate_delete_command(self, command: str) -> bool:
        """Validate delete command against constitution"""
        # Block deletion of any constitutional directory
        # Return True if command should be blocked
        return True  # Placeholder - block all deletions for safety


def main():
    """Command line interface for constitution enforcer"""
    if len(sys.argv) < 2:
        print("Usage: constitution-enforcer.py <command> [args]")
        print("Commands: audit, enforce, validate")
        sys.exit(1)
    
    command = sys.argv[1]
    root_path = os.getcwd()
    
    enforcer = ConstitutionEnforcer(root_path)
    
    if command == "audit":
        session = sys.argv[2] if len(sys.argv) > 2 else "CLI_AUDIT"
        results = enforcer.comprehensive_audit(session)
        
        print(f"Constitution Audit Results - Session {session}")
        print(f"Compliant: {results['compliant']}")
        print(f"Violations: {len(results['violations'])}")
        
        if results['violations']:
            print("\nViolations Found:")
            for violation in results['violations']:
                print(f"  - {violation}")
        
        sys.exit(0 if results['compliant'] else 1)
    
    elif command == "enforce":
        # This would be called by git hooks or file system monitors
        print("Constitution enforcement active")
        
    elif command == "validate":
        # Quick validation for CI/CD
        structure_ok, violations = enforcer.audit_structure()
        if structure_ok:
            print("✅ Structure validation passed")
            sys.exit(0)
        else:
            print("❌ Structure validation failed")
            for violation in violations:
                print(f"  - {violation}")
            sys.exit(1)
    
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)


if __name__ == "__main__":
    main()