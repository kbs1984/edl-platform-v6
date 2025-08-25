#!/usr/bin/env python3
"""
Session 00068 - Path Resolver Service
Maps old file locations to new ones after Session 67's reorganization
"""

import os
from pathlib import Path
from typing import Optional, Dict, List

class PathResolver:
    """Resolves paths for files moved during Sessions 67-68 reorganization"""
    
    # Files moved from archive/session-deliverables/phase-1/ to core/
    PHASE_1_MOVES = {
        "archive/session-deliverables/phase-1/00021-system-understanding-report.md": "core/00021-system-understanding-report.md",
        "archive/session-deliverables/phase-1/00022-scripts-inventory.md": "core/00022-scripts-inventory.md",
        "archive/session-deliverables/phase-1/00024-CRITICAL-DISCOVERY-SUCCESS.md": "core/00024-CRITICAL-DISCOVERY-SUCCESS.md",
        "archive/session-deliverables/phase-1/00027-constitutional-remediation-plan.md": "core/00027-constitutional-remediation-plan.md",
        "archive/session-deliverables/phase-1/00027-session-28-reading-list.md": "core/00027-session-28-reading-list.md",
        "archive/session-deliverables/phase-1/00030-TOS-ARCHITECTURE.md": "core/00030-TOS-ARCHITECTURE.md",
    }
    
    # Files moved from archive/session-deliverables/phase-2/ to core/
    PHASE_2_MOVES = {
        "archive/session-deliverables/phase-2/00031-MANUAL-INTERVENTION-PROTOCOL.md": "core/00031-MANUAL-INTERVENTION-PROTOCOL.md",
        "archive/session-deliverables/phase-2/00031-MANUAL-TESTING-CHECKLIST.md": "core/00031-MANUAL-TESTING-CHECKLIST.md",
        "archive/session-deliverables/phase-2/00031-PHASE-GROW-GUIDE.md": "core/00031-PHASE-GROW-GUIDE.md",
        "archive/session-deliverables/phase-2/00031-PHASE-HARVEST-GUIDE.md": "core/00031-PHASE-HARVEST-GUIDE.md",
        "archive/session-deliverables/phase-2/00031-PHASE-SEED-GUIDE.md": "core/00031-PHASE-SEED-GUIDE.md",
        "archive/session-deliverables/phase-2/00032-DASHBOARD-USAGE.md": "core/00032-DASHBOARD-USAGE.md",
        "archive/session-deliverables/phase-2/00033-CONSTITUTIONAL-ADHERENCE-CHECKLIST.md": "core/00033-CONSTITUTIONAL-ADHERENCE-CHECKLIST.md",
        "archive/session-deliverables/phase-2/00033-CONSTITUTIONAL-GUARDIAN-LOG.md": "core/00033-CONSTITUTIONAL-GUARDIAN-LOG.md",
        "archive/session-deliverables/phase-2/00034-00035-TRUTH-API-SPECIFICATION.md": "core/00034-00035-TRUTH-API-SPECIFICATION.md",
        "archive/session-deliverables/phase-2/00034-00035-TRUTH-LAYER-SETUP.md": "core/00034-00035-TRUTH-LAYER-SETUP.md",
        "archive/session-deliverables/phase-2/00036-ENHANCED-DASHBOARD-GUIDE.md": "core/00036-ENHANCED-DASHBOARD-GUIDE.md",
        "archive/session-deliverables/phase-2/00036-auth-integration-test.md": "core/00036-auth-integration-test.md",
        "archive/session-deliverables/phase-2/00044-BUSINESS-LOGIC-INVESTIGATION-PLAN.md": "core/00044-BUSINESS-LOGIC-INVESTIGATION-PLAN.md",
        "archive/session-deliverables/phase-2/00044-CRITICAL-MIGRATION-GAP-REPORT.md": "core/00044-CRITICAL-MIGRATION-GAP-REPORT.md",
        "archive/session-deliverables/phase-2/00044-CURRENT-TEST-STATUS.md": "core/00044-CURRENT-TEST-STATUS.md",
        "archive/session-deliverables/phase-2/00044-PROFILE-FIX-SUCCESS-REPORT.md": "core/00044-PROFILE-FIX-SUCCESS-REPORT.md",
        "archive/session-deliverables/phase-2/00044-TEST-AUTH-FLOW-GUIDE.md": "core/00044-TEST-AUTH-FLOW-GUIDE.md",
        "archive/session-deliverables/phase-2/00046-MIGRATION-STATUS-GUIDE.md": "core/00046-MIGRATION-STATUS-GUIDE.md",
    }
    
    # Files that should move from root to core (pending)
    PENDING_ROOT_MOVES = {
        "00031-CONSTITUTIONAL-OS-GUIDE.md": "core/00031-CONSTITUTIONAL-OS-GUIDE.md",
        "00031-WORKFLOW-BOUNDARIES.md": "core/00031-WORKFLOW-BOUNDARIES.md",
        "00042-TRUTH-SEED-ADOPTION-DECISION.md": "core/00042-TRUTH-SEED-ADOPTION-DECISION.md",
        "00065-FILE-ORGANIZATION-PROTOCOL.md": "core/00065-FILE-ORGANIZATION-PROTOCOL.md",
        "00065-DESKTOP-INTEGRATION-RESPONSE.md": "core/00065-DESKTOP-INTEGRATION-RESPONSE.md",
        "00065-LIFECYCLE-ADDENDUM.md": "core/00065-LIFECYCLE-ADDENDUM.md",
    }
    
    def __init__(self):
        """Initialize with all known moves"""
        self.migrations = {}
        self.migrations.update(self.PHASE_1_MOVES)
        self.migrations.update(self.PHASE_2_MOVES)
        # Note: Root moves are pending, not yet executed
        
    def resolve(self, path: str) -> str:
        """
        Resolve a path to its new location if moved, else return original
        
        Args:
            path: Original file path (relative or absolute)
            
        Returns:
            New path if file was moved, else original path
        """
        # Normalize path for comparison
        normalized = str(Path(path))
        
        # Check if this exact path was moved
        if normalized in self.migrations:
            return self.migrations[normalized]
        
        # Check if just the filename matches a moved file
        filename = Path(path).name
        for old_path, new_path in self.migrations.items():
            if Path(old_path).name == filename:
                return new_path
        
        # No move found, return original
        return path
    
    def is_moved(self, path: str) -> bool:
        """Check if a file was moved"""
        normalized = str(Path(path))
        return normalized in self.migrations
    
    def get_old_location(self, new_path: str) -> Optional[str]:
        """Get the old location of a moved file"""
        for old_path, moved_to in self.migrations.items():
            if moved_to == new_path:
                return old_path
        return None
    
    def list_all_moves(self) -> Dict[str, str]:
        """Get all known file moves"""
        return self.migrations.copy()
    
    def check_script_references(self, script_path: str) -> List[Dict[str, str]]:
        """
        Check a script for references to moved files
        
        Returns:
            List of dicts with 'line', 'old_path', 'new_path'
        """
        outdated_refs = []
        
        try:
            with open(script_path, 'r') as f:
                lines = f.readlines()
                
            for i, line in enumerate(lines, 1):
                for old_path in self.migrations.keys():
                    if old_path in line:
                        outdated_refs.append({
                            'line': i,
                            'old_path': old_path,
                            'new_path': self.migrations[old_path],
                            'content': line.strip()
                        })
        except Exception as e:
            print(f"Error checking script: {e}")
            
        return outdated_refs
    
    def update_script_references(self, script_path: str, dry_run: bool = True) -> int:
        """
        Update references in a script to use new paths
        
        Args:
            script_path: Path to script to update
            dry_run: If True, only show what would change
            
        Returns:
            Number of references updated
        """
        outdated_refs = self.check_script_references(script_path)
        
        if not outdated_refs:
            print(f"✅ No outdated references in {script_path}")
            return 0
        
        if dry_run:
            print(f"Would update {len(outdated_refs)} references in {script_path}:")
            for ref in outdated_refs:
                print(f"  Line {ref['line']}: {ref['old_path']} → {ref['new_path']}")
            return len(outdated_refs)
        
        # Actually update the file
        with open(script_path, 'r') as f:
            content = f.read()
        
        for old_path, new_path in self.migrations.items():
            content = content.replace(old_path, new_path)
        
        with open(script_path, 'w') as f:
            f.write(content)
        
        print(f"✅ Updated {len(outdated_refs)} references in {script_path}")
        return len(outdated_refs)


def main():
    """Command line interface"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Resolve paths for moved files')
    parser.add_argument('path', nargs='?', help='Path to resolve or script to check')
    parser.add_argument('--check', action='store_true', help='Check script for outdated references')
    parser.add_argument('--update', action='store_true', help='Update script references (use with --check)')
    parser.add_argument('--list', action='store_true', help='List all known moves')
    parser.add_argument('--reverse', action='store_true', help='Find old location of moved file')
    
    args = parser.parse_args()
    
    resolver = PathResolver()
    
    if args.list:
        print("📋 All Known File Moves (Session 67):")
        print("=" * 60)
        for old, new in resolver.list_all_moves().items():
            print(f"{old}\n  → {new}\n")
        return
    
    if args.path:
        if args.check:
            # Check script for outdated references
            refs = resolver.check_script_references(args.path)
            if refs:
                print(f"⚠️  Found {len(refs)} outdated references in {args.path}:")
                for ref in refs:
                    print(f"  Line {ref['line']}: {ref['old_path']}")
                    print(f"    → Should be: {ref['new_path']}")
                    
                if args.update:
                    resolver.update_script_references(args.path, dry_run=False)
            else:
                print(f"✅ No outdated references in {args.path}")
        
        elif args.reverse:
            # Find old location
            old = resolver.get_old_location(args.path)
            if old:
                print(f"📍 Old location: {old}")
            else:
                print(f"❓ No known old location for {args.path}")
        
        else:
            # Resolve path
            new_path = resolver.resolve(args.path)
            if new_path != args.path:
                print(f"📍 Moved to: {new_path}")
            else:
                print(f"✅ Not moved: {args.path}")
    else:
        parser.print_help()


if __name__ == "__main__":
    main()