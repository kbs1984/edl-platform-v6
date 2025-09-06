#!/usr/bin/env python3
"""
---
session: "00066"
type: "script"
status: "unknown"
created: "2025-08-28"
title: "00066-create-rollback.py"
purpose: "Create rollback scripts and manifests BEFORE any file moves"
language: "python"
category: "creation"
topics: ["creation"]
priority: "P2"
domain: "core"
---
"""
"""
Session 00066 - Rollback Mechanism Creator
Purpose: Create rollback scripts and manifests BEFORE any file moves
Created: 2025-08-25
Status: Phase 0 Safety Infrastructure

This tool creates a rollback manifest and executable scripts that can
undo any file reorganization if something goes wrong.
"""

import os
import json
import subprocess
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional
import argparse
import hashlib

class RollbackManager:
    """Manages rollback capabilities for file reorganization"""
    
    def __init__(self, manifest_file: str = "rollback-manifest-00066.json"):
        self.manifest_file = manifest_file
        self.manifest = self._load_or_create_manifest()
        self.rollback_script = "rollback-00066.sh"
        
    def _load_or_create_manifest(self) -> Dict:
        """Load existing manifest or create new one"""
        if Path(self.manifest_file).exists():
            with open(self.manifest_file, 'r') as f:
                return json.load(f)
        else:
            return {
                "session": "00066",
                "created": datetime.now().isoformat(),
                "moves": [],
                "reference_updates": [],
                "backup_branch": None,
                "status": "prepared"
            }
    
    def prepare_rollback(self) -> str:
        """Prepare rollback infrastructure"""
        print("🛡️ Preparing rollback infrastructure...")
        
        # 1. Record current git branch
        current_branch = subprocess.run(
            ["git", "branch", "--show-current"],
            capture_output=True,
            text=True
        ).stdout.strip()
        
        self.manifest["backup_branch"] = current_branch
        
        # 2. Create file checksums for verification
        print("📊 Creating file checksums...")
        self.manifest["checksums"] = self._create_checksums()
        
        # 3. Create rollback script header
        self._create_rollback_script()
        
        # 4. Save manifest
        self._save_manifest()
        
        print(f"✅ Rollback prepared. Manifest: {self.manifest_file}")
        print(f"✅ Rollback script: {self.rollback_script}")
        
        return self.manifest_file
    
    def _create_checksums(self) -> Dict[str, str]:
        """Create checksums of all markdown files"""
        checksums = {}
        md_files = Path(".").rglob("*.md")
        
        for file_path in md_files:
            if "node_modules" not in str(file_path) and ".git" not in str(file_path):
                try:
                    content = file_path.read_bytes()
                    checksums[str(file_path)] = hashlib.sha256(content).hexdigest()
                except Exception as e:
                    print(f"Warning: Could not checksum {file_path}: {e}")
        
        return checksums
    
    def record_move(self, from_path: str, to_path: str, 
                    references_updated: List[str] = None):
        """Record a file move for potential rollback"""
        move_record = {
            "from": from_path,
            "to": to_path,
            "timestamp": datetime.now().isoformat(),
            "references_updated": references_updated or [],
            "git_commit": self._get_current_commit()
        }
        
        self.manifest["moves"].append(move_record)
        self._save_manifest()
        self._append_to_rollback_script(from_path, to_path)
        
        print(f"📝 Recorded move: {from_path} → {to_path}")
    
    def _get_current_commit(self) -> str:
        """Get current git commit hash"""
        try:
            result = subprocess.run(
                ["git", "rev-parse", "HEAD"],
                capture_output=True,
                text=True
            )
            return result.stdout.strip()[:8]
        except:
            return "unknown"
    
    def _create_rollback_script(self):
        """Create the rollback shell script"""
        script_content = f"""#!/bin/bash
# Rollback Script for Session 00066
# Generated: {datetime.now().isoformat()}
# 
# This script will undo all file moves performed during reorganization

set -e  # Exit on error

echo "🔄 Starting rollback for Session 00066..."
echo "⚠️  This will undo all file reorganization. Continue? (y/n)"
read -r response
if [[ "$response" != "y" ]]; then
    echo "Rollback cancelled."
    exit 0
fi

# Rollback commands will be appended here
"""
        
        with open(self.rollback_script, 'w') as f:
            f.write(script_content)
        
        os.chmod(self.rollback_script, 0o755)
    
    def _append_to_rollback_script(self, from_path: str, to_path: str):
        """Append a rollback command to the script"""
        with open(self.rollback_script, 'a') as f:
            f.write(f"\n# Rollback: {to_path} → {from_path}\n")
            f.write(f'if [ -f "{to_path}" ]; then\n')
            f.write(f'    git mv "{to_path}" "{from_path}"\n')
            f.write(f'    echo "✅ Rolled back: {to_path} → {from_path}"\n')
            f.write(f'else\n')
            f.write(f'    echo "⚠️  File not found: {to_path}"\n')
            f.write(f'fi\n')
    
    def _save_manifest(self):
        """Save the manifest to disk"""
        with open(self.manifest_file, 'w') as f:
            json.dump(self.manifest, f, indent=2)
    
    def calculate_rollback_confidence(self) -> float:
        """How confident are we that rollback will work?"""
        confidence = 100.0
        
        # Check for uncommitted changes (reduces confidence)
        git_status = subprocess.run(
            ["git", "status", "--porcelain"],
            capture_output=True,
            text=True
        ).stdout
        
        if git_status:
            uncommitted = len(git_status.strip().split('\n'))
            # Each uncommitted file reduces confidence by 1%, max 30% reduction
            confidence -= min(uncommitted, 30)
        
        # Check if rollback script exists
        if not Path(self.rollback_script).exists():
            confidence -= 40  # Major issue
        
        # Check if manifest is valid
        if not self.manifest.get("checksums"):
            confidence -= 20  # Can't verify file integrity
        
        # Check if backup branch exists
        if not self.manifest.get("backup_branch"):
            confidence -= 20
        
        # Check for restore point
        if not self.manifest.get("restore_point"):
            confidence -= 10  # Minor issue, still have branch
        
        # Verify checksums match current files (sample check)
        if self.manifest.get("checksums"):
            sample_files = list(self.manifest["checksums"].items())[:5]
            mismatches = 0
            for filepath, expected_hash in sample_files:
                if Path(filepath).exists():
                    current_hash = hashlib.sha256(Path(filepath).read_bytes()).hexdigest()
                    if current_hash != expected_hash:
                        mismatches += 1
            
            # Each mismatch reduces confidence
            confidence -= mismatches * 5
        
        return max(0, confidence)  # Never go below 0
    
    def verify_rollback_capability(self) -> Dict:
        """Verify that rollback is possible"""
        issues = []
        
        # Check git status
        git_status = subprocess.run(
            ["git", "status", "--porcelain"],
            capture_output=True,
            text=True
        ).stdout
        
        if git_status:
            uncommitted = len(git_status.strip().split('\n'))
            issues.append(f"Uncommitted changes: {uncommitted} files")
        
        # Check if rollback script exists
        if not Path(self.rollback_script).exists():
            issues.append("Rollback script not found")
        
        # Check if manifest is valid
        if not self.manifest.get("checksums"):
            issues.append("No file checksums recorded")
        
        confidence = self.calculate_rollback_confidence()
        
        return {
            "can_rollback": len(issues) == 0,
            "issues": issues,
            "moves_recorded": len(self.manifest.get("moves", [])),
            "backup_branch": self.manifest.get("backup_branch"),
            "confidence": confidence
        }
    
    def execute_rollback(self, dry_run: bool = True):
        """Execute the rollback"""
        if dry_run:
            print("🔍 DRY RUN - Showing what would be rolled back:")
            for move in reversed(self.manifest.get("moves", [])):
                print(f"  Would restore: {move['to']} → {move['from']}")
        else:
            print("🔄 Executing rollback...")
            result = subprocess.run(
                [f"./{self.rollback_script}"],
                capture_output=True,
                text=True
            )
            print(result.stdout)
            if result.returncode != 0:
                print(f"❌ Rollback failed: {result.stderr}")
                return False
            
            print("✅ Rollback completed successfully!")
            
            # Reset manifest
            self.manifest["status"] = "rolled_back"
            self.manifest["rollback_time"] = datetime.now().isoformat()
            self._save_manifest()
        
        return True
    
    def create_restore_point(self, name: str = "before_reorg"):
        """Create a git tag as restore point"""
        tag_name = f"restore_point_{name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        subprocess.run(
            ["git", "tag", "-a", tag_name, "-m", f"Restore point before reorganization - Session 00066"],
            capture_output=True
        )
        
        print(f"🏷️ Created restore point: {tag_name}")
        self.manifest["restore_point"] = tag_name
        self._save_manifest()
        
        return tag_name


def main():
    parser = argparse.ArgumentParser(description='Manage rollback for file reorganization')
    parser.add_argument('--prepare', action='store_true', 
                       help='Prepare rollback infrastructure')
    parser.add_argument('--verify', action='store_true',
                       help='Verify rollback capability')
    parser.add_argument('--record-move', nargs=2, metavar=('FROM', 'TO'),
                       help='Record a file move')
    parser.add_argument('--execute', action='store_true',
                       help='Execute rollback')
    parser.add_argument('--dry-run', action='store_true',
                       help='Show what would be rolled back')
    parser.add_argument('--create-restore-point', action='store_true',
                       help='Create git restore point')
    
    args = parser.parse_args()
    
    manager = RollbackManager()
    
    if args.prepare or not any(vars(args).values()):
        manager.prepare_rollback()
        manager.create_restore_point()
        
        # Verify it worked
        status = manager.verify_rollback_capability()
        print(f"\n📊 Rollback Status:")
        print(f"  - Can rollback: {'✅ Yes' if status['can_rollback'] else '❌ No'}")
        print(f"  - Confidence: {status.get('confidence', 0):.1f}%")
        print(f"  - Backup branch: {status['backup_branch']}")
        if status['issues']:
            print("  - Issues:")
            for issue in status['issues']:
                print(f"    • {issue}")
    
    if args.verify:
        status = manager.verify_rollback_capability()
        print("📊 Rollback Capability Check:")
        print(f"  - Can rollback: {'✅ Yes' if status['can_rollback'] else '❌ No'}")
        print(f"  - Confidence: {status.get('confidence', 0):.1f}%")
        print(f"  - Moves recorded: {status['moves_recorded']}")
        print(f"  - Backup branch: {status['backup_branch']}")
        if status['issues']:
            print("  - Issues to resolve:")
            for issue in status['issues']:
                print(f"    • {issue}")
    
    if args.record_move:
        from_path, to_path = args.record_move
        manager.record_move(from_path, to_path)
    
    if args.dry_run:
        manager.execute_rollback(dry_run=True)
    
    if args.execute:
        print("⚠️  WARNING: This will undo all file reorganization!")
        response = input("Are you sure? (type 'yes' to confirm): ")
        if response.lower() == 'yes':
            manager.execute_rollback(dry_run=False)
        else:
            print("Rollback cancelled.")
    
    if args.create_restore_point:
        manager.create_restore_point()


if __name__ == "__main__":
    main()