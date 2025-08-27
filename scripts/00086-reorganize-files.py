#!/usr/bin/env python3
"""
---
session: "00086"
type: "tool"
status: "completed"
created: "2025-08-27"
title: "File Reorganization Script"
purpose: "Analyze and reorganize files based on Reality-First domain structure"
topics: ["file-organization", "automation", "yaml-metadata", "domain-structure"]
priority: "P0"
domain: "core"
lifecycle: "ON"
implements: ["core/00086-REALITY-FIRST-FILE-PROTOCOL.md"]
---

Session 00086: File Reorganization Script
Analyzes file locations and suggests/executes moves based on YAML metadata
Following Reality-First Protocol
"""

import os
import sys
import yaml
import json
import shutil
import argparse
import subprocess
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Tuple, Optional

class FileReorganizer:
    def __init__(self, root_path: str = "."):
        self.root = Path(root_path).resolve()
        self.moves = []
        self.errors = []
        self.stats = {
            'analyzed': 0,
            'needs_move': 0,
            'correct_location': 0,
            'no_metadata': 0,
            'errors': 0
        }
        
        # Domain to directory mapping
        self.domain_map = {
            'reality': 'reality',
            'requirements': 'requirements',
            'reconciliation': 'reconciliation',
            'core': 'core'
        }
        
        # Type to subdirectory mapping
        self.type_map = {
            # Reality types
            'snapshot': 'reality/snapshots',
            'agent-output': 'reality/agents/outputs',
            'capture': 'reality/request-files',
            'reality-dashboard': 'reality/dashboard',
            
            # Requirements types
            'story': 'requirements/user-stories',
            'specification': 'requirements/specifications',
            'masterplan': 'requirements/masterplans',
            'constraint': 'requirements/constraints',
            
            # Reconciliation types
            'implementation': 'reconciliation/active-work',
            'migration': 'reconciliation/migrations',
            'fix': 'reconciliation/fixes',
            
            # Core types
            'protocol': 'core',
            'guide': 'core',
            
            # Archive types
            'log': 'archive/sessions',
            'handoff': 'archive/sessions',
            'legacy': 'archive/legacy-canvas-work',
            
            # Scripts
            'script': 'scripts',
            'tool': 'scripts'
        }
        
    def extract_yaml_metadata(self, filepath: Path) -> Optional[Dict]:
        """Extract YAML frontmatter from file"""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
            if not content.startswith('---'):
                return None
                
            try:
                # Find the closing ---
                end_marker = content.index('\n---\n', 4)
                yaml_content = content[4:end_marker]
                metadata = yaml.safe_load(yaml_content)
                return metadata if isinstance(metadata, dict) else None
            except (ValueError, yaml.YAMLError):
                return None
                
        except Exception as e:
            self.errors.append(f"Error reading {filepath}: {e}")
            return None
    
    def determine_correct_location(self, filepath: Path, metadata: Dict) -> Optional[Path]:
        """Determine where file should be based on metadata"""
        
        # Special case for session logs and handoffs
        if metadata.get('type') in ['log', 'handoff']:
            session = metadata.get('session', '')
            filename = filepath.name
            if session:
                if 'LOG' in filename:
                    return self.root / 'archive' / 'sessions' / f'SESSION-{session}-LOG.md'
                elif 'HANDOFF' in filename:
                    return self.root / 'archive' / 'sessions' / f'SESSION-{session}-HANDOFF.md'
            return self.root / 'archive' / 'sessions' / filename
            
        # Check domain first
        domain = metadata.get('domain', '')
        file_type = metadata.get('type', '')
        
        # Determine base directory
        if domain in self.domain_map:
            base_dir = self.root / self.domain_map[domain]
        elif file_type in self.type_map:
            base_dir = self.root / self.type_map[file_type]
        else:
            return None  # Can't determine location
            
        # Special handling for specific types
        if domain == 'reality' and 'reality_type' in metadata:
            reality_type = metadata['reality_type']
            if reality_type == 'database':
                base_dir = self.root / 'reality' / 'snapshots' / 'database'
            elif reality_type == 'api':
                base_dir = self.root / 'reality' / 'snapshots' / 'api'
            elif reality_type == 'filesystem':
                base_dir = self.root / 'reality' / 'snapshots' / 'filesystem'
            elif reality_type == 'manual':
                base_dir = self.root / 'reality' / 'request-files'
                
        # For reconciliation, check for more specific placement
        elif domain == 'reconciliation':
            if metadata.get('deployment_status') == 'deployed':
                if 'batch' in filepath.name:
                    base_dir = self.root / 'reconciliation' / 'migrations' / 'deployed'
            elif metadata.get('deployment_status') == 'failed':
                base_dir = self.root / 'reconciliation' / 'migrations' / 'failed'
            elif 'fix' in metadata.get('fixes', []):
                base_dir = self.root / 'reconciliation' / 'fixes'
                
        return base_dir / filepath.name
    
    def analyze_file(self, filepath: Path) -> None:
        """Analyze a single file for reorganization"""
        self.stats['analyzed'] += 1
        
        # Skip certain directories
        skip_dirs = ['node_modules', '.git', '.next', '__pycache__', 'dist', 'build']
        if any(skip in str(filepath) for skip in skip_dirs):
            return
            
        # Extract metadata
        metadata = self.extract_yaml_metadata(filepath)
        if not metadata:
            self.stats['no_metadata'] += 1
            return
            
        # Determine correct location
        correct_path = self.determine_correct_location(filepath, metadata)
        if not correct_path:
            return
            
        # Check if already in correct location
        if filepath.resolve() == correct_path.resolve():
            self.stats['correct_location'] += 1
            return
            
        # File needs to be moved
        self.stats['needs_move'] += 1
        self.moves.append({
            'from': str(filepath),
            'to': str(correct_path),
            'domain': metadata.get('domain', 'unknown'),
            'type': metadata.get('type', 'unknown'),
            'session': metadata.get('session', 'unknown')
        })
    
    def scan_directory(self, directory: Path = None) -> None:
        """Scan directory for files needing reorganization"""
        if directory is None:
            directory = self.root
            
        # Common file patterns to check
        patterns = ['*.md', '*.sql', '*.json', '*.yaml', '*.yml', '*.py', '*.sh', '*.ts', '*.tsx']
        
        for pattern in patterns:
            for filepath in directory.rglob(pattern):
                if filepath.is_file():
                    self.analyze_file(filepath)
    
    def print_analysis(self) -> None:
        """Print analysis results"""
        print("\n" + "="*60)
        print("📊 FILE REORGANIZATION ANALYSIS - Session 00086")
        print("="*60)
        
        print(f"\n📈 Statistics:")
        print(f"  • Files analyzed: {self.stats['analyzed']}")
        print(f"  • Correct location: {self.stats['correct_location']}")
        print(f"  • Needs move: {self.stats['needs_move']}")
        print(f"  • No metadata: {self.stats['no_metadata']}")
        
        if self.moves:
            print(f"\n📁 Files needing reorganization: {len(self.moves)}")
            print("-"*60)
            
            # Group by domain
            by_domain = {}
            for move in self.moves:
                domain = move['domain']
                if domain not in by_domain:
                    by_domain[domain] = []
                by_domain[domain].append(move)
            
            for domain, domain_moves in sorted(by_domain.items()):
                print(f"\n🌊 {domain.upper()} Domain ({len(domain_moves)} files):")
                for move in domain_moves[:5]:  # Show first 5
                    print(f"  • {Path(move['from']).name}")
                    print(f"    → {move['to']}")
                if len(domain_moves) > 5:
                    print(f"  ... and {len(domain_moves) - 5} more")
        
        if self.errors:
            print(f"\n⚠️ Errors encountered: {len(self.errors)}")
            for error in self.errors[:3]:
                print(f"  • {error}")
    
    def execute_moves(self, dry_run: bool = True) -> None:
        """Execute the file moves"""
        if not self.moves:
            print("\n✅ No files need to be moved!")
            return
            
        if dry_run:
            print("\n🔍 DRY RUN - No files will be moved")
            print("Use --execute to actually move files")
            return
            
        print(f"\n🚀 Executing {len(self.moves)} file moves...")
        
        moved = 0
        failed = 0
        
        for move in self.moves:
            from_path = Path(move['from'])
            to_path = Path(move['to'])
            
            try:
                # Create target directory if needed
                to_path.parent.mkdir(parents=True, exist_ok=True)
                
                # Use git mv to preserve history
                result = subprocess.run(
                    ['git', 'mv', str(from_path), str(to_path)],
                    capture_output=True,
                    text=True
                )
                
                if result.returncode == 0:
                    moved += 1
                    print(f"  ✅ Moved: {from_path.name} → {to_path.parent}")
                else:
                    # Fallback to regular move if not in git
                    shutil.move(str(from_path), str(to_path))
                    moved += 1
                    print(f"  ✅ Moved: {from_path.name} → {to_path.parent}")
                    
            except Exception as e:
                failed += 1
                print(f"  ❌ Failed to move {from_path.name}: {e}")
        
        print(f"\n📊 Results:")
        print(f"  • Successfully moved: {moved}")
        print(f"  • Failed: {failed}")
        
        if moved > 0:
            print("\n⚠️ Remember to:")
            print("  1. Update any import statements")
            print("  2. Fix broken markdown links")
            print("  3. Run tests to ensure nothing broke")
            print("  4. Commit the changes")
    
    def generate_report(self, output_file: str = None) -> None:
        """Generate detailed reorganization report"""
        report = {
            'timestamp': datetime.now().isoformat(),
            'session': '00086',
            'stats': self.stats,
            'moves': self.moves,
            'errors': self.errors
        }
        
        if output_file:
            with open(output_file, 'w') as f:
                json.dump(report, f, indent=2)
            print(f"\n📄 Report saved to: {output_file}")
        
        return report

def main():
    parser = argparse.ArgumentParser(
        description='Session 00086: Reorganize files based on Reality-First Protocol'
    )
    parser.add_argument(
        '--execute',
        action='store_true',
        help='Actually move files (default is dry run)'
    )
    parser.add_argument(
        '--directory',
        default='.',
        help='Directory to scan (default: current)'
    )
    parser.add_argument(
        '--report',
        help='Save detailed report to file'
    )
    parser.add_argument(
        '--focus',
        choices=['reality', 'requirements', 'reconciliation', 'all'],
        default='all',
        help='Focus on specific domain'
    )
    
    args = parser.parse_args()
    
    # Create reorganizer
    reorganizer = FileReorganizer(args.directory)
    
    print("🔄 Reality-First File Reorganization Tool")
    print("Session 00086 - Following core/00086-REALITY-FIRST-FILE-PROTOCOL.md")
    print("-"*60)
    
    # Scan files
    print("📂 Scanning files...")
    reorganizer.scan_directory()
    
    # Print analysis
    reorganizer.print_analysis()
    
    # Execute moves if requested
    if reorganizer.moves:
        reorganizer.execute_moves(dry_run=not args.execute)
    
    # Generate report if requested
    if args.report:
        reorganizer.generate_report(args.report)
    
    print("\n✨ Analysis complete!")

if __name__ == "__main__":
    main()