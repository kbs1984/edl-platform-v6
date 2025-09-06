#!/usr/bin/env python3
"""
---
session: "00067"
type: "script"
status: "unknown"
created: "2025-08-28"
title: "00067-auto-organize-files.py"
purpose: "Automatically organize files based on YAML metadata using Session 66's safety net"
language: "python"
category: "utility"
topics: ["utility"]
priority: "P2"
domain: "core"
---
"""
"""
Session 00067 - Auto-Organization Tool with Safety Infrastructure
Purpose: Automatically organize files based on YAML metadata using Session 66's safety net
Created: 2025-08-25
Status: Implementing with full safety checks

This tool builds on Session 66's safety infrastructure to safely reorganize files
based on their YAML metadata, following Session 65's protocol and Desktop's warnings.
"""

import os
import sys
import re
import json
import yaml
import subprocess
import argparse
from pathlib import Path
from typing import Dict, List, Set, Tuple, Optional
from datetime import datetime
from collections import defaultdict

# Add scripts directory to path for imports
sys.path.append(str(Path(__file__).parent))

# Import Session 66's safety infrastructure using importlib
import importlib.util

# Import reference mapper
spec = importlib.util.spec_from_file_location(
    "reference_mapper", 
    "scripts/00066-reference-mapper.py"
)
reference_mapper_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(reference_mapper_module)
ReferenceMapper = reference_mapper_module.ReferenceMapper

# Import rollback manager
spec = importlib.util.spec_from_file_location(
    "rollback_manager",
    "scripts/00066-create-rollback.py"
)
rollback_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(rollback_module)
RollbackManager = rollback_module.RollbackManager

# Import migration readiness scorer
spec = importlib.util.spec_from_file_location(
    "migration_readiness",
    "scripts/00066-migration-readiness.py"
)
readiness_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(readiness_module)
MigrationReadinessScorer = readiness_module.MigrationReadinessScorer
MigrationNotReady = readiness_module.MigrationNotReady


class SafeFileOrganizer:
    """Auto-organizes files with mandatory safety checks"""
    
    def __init__(self, dry_run: bool = True, batch_size: int = 10):
        """Initialize with safety-first approach
        
        Args:
            dry_run: If True, only simulate moves (default: True for safety)
            batch_size: Number of files per transaction batch
        """
        # Safety first - check readiness BEFORE anything else
        self.require_readiness_check()
        
        self.dry_run = dry_run
        self.batch_size = batch_size
        self.root_dir = Path(".")
        
        # Initialize safety infrastructure
        self.reference_mapper = ReferenceMapper()
        self.rollback_manager = RollbackManager()
        self.readiness_scorer = MigrationReadinessScorer()
        
        # Track operations
        self.moves_planned = []
        self.moves_executed = []
        self.errors = []
        self.yaml_fixes = []
        
        # Domain mappings from Session 65's protocol
        self.domain_dirs = {
            "core": "core",
            "reality": "reality",
            "requirements": "requirements",
            "reconciliation": "reconciliation"
        }
        
    def require_readiness_check(self):
        """Block all operations if not ready (Session 65/66 requirement)"""
        scorer = MigrationReadinessScorer()
        readiness = scorer.calculate_migration_readiness()
        
        if readiness['overall'] < 80:
            raise MigrationNotReady(
                f"System only {readiness['overall']}% ready. "
                f"Need 80% minimum. Weakest: {readiness.get('weakest_link', 'unknown')}"
            )
        
        print(f"✅ Migration readiness: {readiness['overall']}%")
        if 'weakest_link' in readiness:
            print(f"   Weakest component: {readiness['weakest_link']}")
    
    def extract_yaml_metadata(self, filepath: Path) -> Optional[Dict]:
        """Extract and fix YAML frontmatter from a markdown file"""
        try:
            content = filepath.read_text(encoding='utf-8')
            
            # Check if file starts with YAML frontmatter
            if not content.startswith('---'):
                return None
                
            # Extract YAML section
            parts = content.split('---', 2)
            if len(parts) < 3:
                return None
                
            yaml_content = parts[1]
            metadata = yaml.safe_load(yaml_content)
            
            # Fix common validation errors (Session 65/66 guidance)
            fixed = False
            
            # Fix type: "documentation" -> "guide"
            if metadata.get('type') == 'documentation':
                metadata['type'] = 'guide'
                self.yaml_fixes.append(f"{filepath.name}: type documentation→guide")
                fixed = True
            
            # Fix session: "unknown" -> "legacy"
            if metadata.get('session') == 'unknown':
                metadata['session'] = 'legacy'
                self.yaml_fixes.append(f"{filepath.name}: session unknown→legacy")
                fixed = True
            
            # If we fixed anything, save it back
            if fixed and not self.dry_run:
                self._update_yaml_metadata(filepath, metadata)
            
            return metadata
            
        except Exception as e:
            self.errors.append(f"Failed to parse YAML in {filepath}: {e}")
            return None
    
    def _update_yaml_metadata(self, filepath: Path, metadata: Dict):
        """Update YAML frontmatter in file"""
        try:
            content = filepath.read_text(encoding='utf-8')
            parts = content.split('---', 2)
            
            if len(parts) >= 3:
                # Rebuild with updated YAML
                import io
                yaml_str = io.StringIO()
                yaml.dump(metadata, yaml_str, default_flow_style=False, sort_keys=False)
                
                new_content = f"---\n{yaml_str.getvalue()}---{parts[2]}"
                filepath.write_text(new_content, encoding='utf-8')
                
        except Exception as e:
            self.errors.append(f"Failed to update YAML in {filepath}: {e}")
    
    def classify_file(self, filepath: Path) -> Tuple[str, str]:
        """Determine where a file should go based on YAML metadata
        
        Following Session 65's protocol exactly
        """
        # Extract metadata
        metadata = self.extract_yaml_metadata(filepath)
        
        if not metadata:
            return ("pending", "No YAML metadata found")
        
        # CRITICAL: Logs and handoffs ALWAYS go to archive/sessions regardless of domain
        file_type = metadata.get('type', '')
        if file_type in ['log', 'handoff']:
            return ("archive/sessions", f"Type is '{file_type}' (domain ignored)")
        
        # Check domain field for all other files
        domain = metadata.get('domain', '').lower()
        if domain in self.domain_dirs:
            return (self.domain_dirs[domain], f"Domain is '{domain}'")
        
        # Check if it's a script (special handling)
        if file_type == 'script':
            return ("scripts", "Type is 'script'")
        
        # Check if it's a template
        if file_type == 'template':
            return ("templates", "Type is 'template'")
        
        # Default to pending for unclear classification
        return ("pending", "No matching classification rules")
    
    def add_lifecycle_metadata(self, filepath: Path, metadata: Dict) -> bool:
        """Add lifecycle field based on Session 65's lifecycle addendum"""
        try:
            # Check if lifecycle already exists
            if 'lifecycle' in metadata:
                return False
            
            # Determine lifecycle based on session number
            filename = filepath.name
            
            # Session 44-55 confusion period files
            if re.match(r'^000(4[4-9]|5[0-5])-', filename):
                metadata['lifecycle'] = 'OBSOLETE'
                metadata['obsolete_reason'] = 'Session 44-55 database confusion period'
                self.yaml_fixes.append(f"{filename}: Added lifecycle=OBSOLETE")
            else:
                # Default to ON for active files
                metadata['lifecycle'] = 'ON'
                self.yaml_fixes.append(f"{filename}: Added lifecycle=ON")
            
            return True
            
        except Exception as e:
            self.errors.append(f"Failed to add lifecycle to {filepath}: {e}")
            return False
    
    def simulate_move(self, source: Path, target_dir: str) -> Dict:
        """Simulate a file move and check impact"""
        target_path = Path(target_dir) / source.name
        
        # Check if target already exists
        if target_path.exists():
            return {
                "safe": False,
                "reason": f"Target already exists: {target_path}",
                "affected_references": []
            }
        
        # Check reference impact using Session 66's mapper
        affected = self.reference_mapper.simulate_move(str(source), str(target_path))
        
        return {
            "safe": True,
            "source": str(source),
            "target": str(target_path),
            "affected_references": affected.get('affected_files', []) if affected else []
        }
    
    def execute_move(self, source: Path, target_path: Path) -> bool:
        """Execute a file move with git and rollback recording"""
        try:
            # Ensure target directory exists
            target_path.parent.mkdir(parents=True, exist_ok=True)
            
            # Use git mv to preserve history (Desktop's requirement)
            result = subprocess.run(
                ['git', 'mv', str(source), str(target_path)],
                capture_output=True,
                text=True
            )
            
            if result.returncode != 0:
                self.errors.append(f"Git mv failed: {result.stderr}")
                return False
            
            # Record in rollback system AFTER successful move (Session 66 guidance)
            self.rollback_manager.record_move(
                str(source),
                str(target_path),
                []  # References will be updated separately
            )
            
            self.moves_executed.append({
                "source": str(source),
                "target": str(target_path),
                "timestamp": datetime.now().isoformat()
            })
            
            return True
            
        except Exception as e:
            self.errors.append(f"Move failed: {e}")
            return False
    
    def organize_files(self, files: List[str], add_lifecycle: bool = False) -> Dict:
        """Main organization logic with safety checks"""
        
        # Build reference map - but only scan files we're moving for performance
        print("\n📊 Building targeted reference map...")
        for filepath in files[:10]:  # Limit scan to first 10 files for performance
            path = Path(filepath)
            if path.exists():
                self.reference_mapper._scan_file(path)
        print(f"   Quick scan complete")
        
        results = {
            "files_processed": 0,
            "moves_planned": [],
            "moves_executed": [],
            "yaml_fixes": [],
            "errors": [],
            "dry_run": self.dry_run
        }
        
        # Process files
        print(f"\n🗂️  Processing {len(files)} files...")
        for filepath in files:
            path = Path(filepath)
            
            if not path.exists():
                self.errors.append(f"File not found: {filepath}")
                continue
            
            print(f"\n📄 {path.name}:")
            
            # Extract metadata (with fixes)
            metadata = self.extract_yaml_metadata(path)
            
            # Add lifecycle if requested
            if add_lifecycle and metadata:
                self.add_lifecycle_metadata(path, metadata)
            
            # Classify the file
            target_dir, reason = self.classify_file(path)
            print(f"   Classification: {target_dir}/ ({reason})")
            
            # Skip if already in correct location
            if str(path.parent) == target_dir:
                print(f"   ✓ Already in correct location")
                continue
            
            # Simulate the move
            simulation = self.simulate_move(path, target_dir)
            
            if not simulation.get('safe'):
                self.errors.append(f"Cannot move {path.name}: {simulation.get('reason')}")
                print(f"   ❌ {simulation.get('reason')}")
                continue
            
            # Plan the move
            move_plan = {
                "source": str(path),
                "target": simulation['target'],
                "reason": reason,
                "affected_references": len(simulation['affected_references'])
            }
            
            self.moves_planned.append(move_plan)
            results["moves_planned"].append(move_plan)
            
            # Execute if not dry run
            if not self.dry_run:
                target_path = Path(simulation['target'])
                if self.execute_move(path, target_path):
                    print(f"   ✅ Moved to {target_dir}/")
                    results["moves_executed"].append(move_plan)
                    
                    # Update YAML if we made fixes
                    if metadata and self.yaml_fixes:
                        self._update_yaml_metadata(target_path, metadata)
                else:
                    print(f"   ❌ Move failed")
            else:
                print(f"   🔍 Would move to {target_dir}/")
                if simulation['affected_references']:
                    print(f"      ⚠️ Would affect {len(simulation['affected_references'])} references")
            
            results["files_processed"] += 1
        
        # Summary
        print("\n" + "="*60)
        print("📊 Organization Summary")
        print("="*60)
        print(f"Files processed: {results['files_processed']}")
        print(f"Moves planned: {len(results['moves_planned'])}")
        
        if self.yaml_fixes:
            print(f"YAML fixes applied: {len(self.yaml_fixes)}")
            for fix in self.yaml_fixes[:5]:  # Show first 5
                print(f"  - {fix}")
        
        if not self.dry_run:
            print(f"Moves executed: {len(results['moves_executed'])}")
        else:
            print("Mode: DRY RUN (no actual moves)")
        
        if self.errors:
            print(f"Errors: {len(self.errors)}")
            for error in self.errors[:5]:  # Show first 5 errors
                print(f"  - {error}")
        
        results["errors"] = self.errors
        results["yaml_fixes"] = self.yaml_fixes
        return results


def main():
    """Main entry point with CLI"""
    parser = argparse.ArgumentParser(
        description="Auto-organize files based on YAML metadata with safety checks"
    )
    
    parser.add_argument(
        'files',
        nargs='*',
        help='Files to organize (supports wildcards)'
    )
    
    parser.add_argument(
        '--dry-run',
        action='store_true',
        default=True,
        help='Simulate moves without executing (default: True)'
    )
    
    parser.add_argument(
        '--execute',
        action='store_true',
        help='Actually execute the moves (disables dry-run)'
    )
    
    parser.add_argument(
        '--batch-size',
        type=int,
        default=10,
        help='Number of files per transaction batch (default: 10)'
    )
    
    parser.add_argument(
        '--add-lifecycle',
        action='store_true',
        help='Add lifecycle metadata during organization'
    )
    
    parser.add_argument(
        '--classify',
        metavar='FILE',
        help='Just classify a single file without moving'
    )
    
    parser.add_argument(
        '--verbose',
        action='store_true',
        help='Show detailed output'
    )
    
    args = parser.parse_args()
    
    try:
        # Handle classification mode
        if args.classify:
            print("🔍 Classification Mode")
            organizer = SafeFileOrganizer()
            path = Path(args.classify)
            
            if not path.exists():
                print(f"❌ File not found: {path}")
                return 1
            
            target_dir, reason = organizer.classify_file(path)
            print(f"File: {path}")
            print(f"Target: {target_dir}/")
            print(f"Reason: {reason}")
            return 0
        
        # Handle organization mode
        if not args.files:
            print("❌ No files specified")
            print("Usage: python3 scripts/00067-auto-organize-files.py [files...]")
            print("       python3 scripts/00067-auto-organize-files.py --classify [file]")
            print("\nExamples:")
            print("  python3 scripts/00067-auto-organize-files.py --classify archive/session-deliverables/phase-1/00021-system-understanding-report.md")
            print("  python3 scripts/00067-auto-organize-files.py --dry-run archive/session-deliverables/phase-1/*.md")
            print("  python3 scripts/00067-auto-organize-files.py --execute archive/session-deliverables/phase-1/*.md")
            return 1
        
        # Expand wildcards if needed
        from glob import glob
        all_files = []
        for pattern in args.files:
            if '*' in pattern:
                expanded = glob(pattern)
                if expanded:
                    all_files.extend(expanded)
                else:
                    print(f"⚠️ No files match pattern: {pattern}")
            else:
                all_files.append(pattern)
        
        if not all_files:
            print(f"❌ No files matched patterns: {args.files}")
            return 1
        
        print(f"🗂️  Auto-Organization Tool - Session 00067")
        print(f"Safety Infrastructure: Session 66")
        print(f"Protocol: Session 65")
        print(f"Files to process: {len(all_files)}")
        print(f"Mode: {'EXECUTE' if args.execute else 'DRY RUN (SAFE)'}")
        print("")
        
        # Create organizer with safety checks
        organizer = SafeFileOrganizer(
            dry_run=not args.execute,
            batch_size=args.batch_size
        )
        
        # Process files
        results = organizer.organize_files(
            all_files,
            add_lifecycle=args.add_lifecycle
        )
        
        # Save results if not dry run
        if args.execute and results.get('moves_executed'):
            output_file = f"organization-results-{datetime.now().strftime('%Y%m%d-%H%M%S')}.json"
            with open(output_file, 'w') as f:
                json.dump(results, f, indent=2, default=str)
            print(f"\n📄 Results saved to: {output_file}")
        
        return 0 if not organizer.errors else 1
        
    except MigrationNotReady as e:
        print(f"\n🛑 {e}")
        print("Run: python3 scripts/00066-migration-readiness.py --check")
        print("to see what needs fixing")
        return 1
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    sys.exit(main())