#!/usr/bin/env python3
"""
---
session: "00086"
type: "tool"
status: "completed"
created: "2025-08-27"
title: "Workflow Metadata Fixer Script"
purpose: "Fix YAML metadata to comply with Reality-First workflow principles"
topics: ["workflow-compliance", "metadata-fixes", "automation", "yaml"]
priority: "P0"
domain: "core"
lifecycle: "ON"
implements: ["core/00086-REALITY-FIRST-FILE-PROTOCOL.md"]
fixes: ["workflow-metadata-compliance"]
---

Session 00086: Fix Reality-First Workflow Metadata
Updates YAML metadata to follow Reality-First workflow principles
"""

import os
import yaml
import argparse
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional

class WorkflowFixer:
    def __init__(self):
        self.fixes = []
        self.stats = {
            'analyzed': 0,
            'needs_fix': 0,
            'fixed': 0,
            'skipped': 0
        }
        
    def analyze_workflow_compliance(self, filepath: Path) -> Optional[Dict]:
        """Analyze a file for workflow compliance issues"""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
            if not content.startswith('---'):
                return None
                
            # Extract YAML
            end_marker = content.index('\n---\n', 4)
            yaml_content = content[4:end_marker]
            metadata = yaml.safe_load(yaml_content)
            
            if not isinstance(metadata, dict):
                return None
                
            self.stats['analyzed'] += 1
            
            domain = metadata.get('domain', '')
            file_type = metadata.get('type', '')
            based_on = metadata.get('based_on', [])
            implements = metadata.get('implements', [])
            fixes = metadata.get('fixes', [])
            session = metadata.get('session', '')
            
            issues = []
            suggestions = {}
            
            # Reality domain checks
            if domain == 'reality':
                if implements:
                    issues.append('Reality file should not have implements')
                    suggestions['implements'] = None  # Remove it
                if fixes:
                    issues.append('Reality file should not have fixes')
                    suggestions['fixes'] = None  # Remove it
                if 'solution' in file_type or 'fix' in file_type:
                    issues.append('Reality should capture state, not solutions')
                    suggestions['type'] = 'snapshot'
                    
            # Requirements domain checks
            elif domain == 'requirements':
                # User stories and specs should reference reality
                if file_type in ['story', 'specification'] and not based_on:
                    issues.append('Requirements should reference reality files')
                    # Suggest adding based_on
                    suggestions['based_on'] = [f'reality/snapshot-{session}.md']
                    
            # Reconciliation domain checks
            elif domain == 'reconciliation':
                if not implements and not fixes:
                    issues.append('Reconciliation should implement or fix something')
                    # Suggest adding implements
                    if 'migration' in file_type or 'fix' in file_type:
                        suggestions['fixes'] = ['issue-to-be-specified']
                    else:
                        suggestions['implements'] = ['requirement-to-be-specified']
                        
            # Check for misplaced content types
            if 'snapshot' in file_type and domain != 'reality':
                issues.append('Snapshots belong in reality domain')
                suggestions['domain'] = 'reality'
                
            if 'implementation' in file_type and domain != 'reconciliation':
                issues.append('Implementations belong in reconciliation domain')
                suggestions['domain'] = 'reconciliation'
                
            if issues:
                self.stats['needs_fix'] += 1
                return {
                    'filepath': filepath,
                    'issues': issues,
                    'suggestions': suggestions,
                    'metadata': metadata,
                    'content': content
                }
                
        except Exception as e:
            print(f"Error analyzing {filepath}: {e}")
            
        return None
    
    def fix_metadata(self, fix_data: Dict, dry_run: bool = True) -> bool:
        """Apply suggested fixes to file metadata"""
        filepath = fix_data['filepath']
        metadata = fix_data['metadata'].copy()
        suggestions = fix_data['suggestions']
        content = fix_data['content']
        
        # Apply suggestions
        for key, value in suggestions.items():
            if value is None:
                # Remove the key
                if key in metadata:
                    del metadata[key]
            else:
                # Update the value
                metadata[key] = value
                
        # Add modified date
        metadata['modified'] = datetime.now().strftime('%Y-%m-%d')
        
        if dry_run:
            print(f"\n📝 Would fix: {filepath.name}")
            print(f"   Issues: {', '.join(fix_data['issues'])}")
            print(f"   Changes: {suggestions}")
            return False
            
        try:
            # Reconstruct file with new metadata
            yaml_str = yaml.dump(metadata, default_flow_style=False, sort_keys=False)
            
            # Find where the YAML ends in original content
            end_marker = content.index('\n---\n', 4)
            body = content[end_marker + 5:]  # Everything after the YAML
            
            # Write updated file
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write('---\n')
                f.write(yaml_str)
                f.write('---\n')
                f.write(body)
                
            self.stats['fixed'] += 1
            print(f"✅ Fixed: {filepath.name}")
            return True
            
        except Exception as e:
            print(f"❌ Error fixing {filepath}: {e}")
            return False
    
    def scan_directory(self, directory: Path = Path('.')) -> List[Dict]:
        """Scan for files needing workflow fixes"""
        issues_found = []
        
        # Focus on key directories
        for domain_dir in ['reality', 'requirements', 'reconciliation']:
            domain_path = directory / domain_dir
            if domain_path.exists():
                for filepath in domain_path.rglob('*.md'):
                    fix_data = self.analyze_workflow_compliance(filepath)
                    if fix_data:
                        issues_found.append(fix_data)
                        
        return issues_found
    
    def print_analysis(self, issues: List[Dict]) -> None:
        """Print analysis results"""
        print("\n" + "="*60)
        print("📊 REALITY-FIRST WORKFLOW COMPLIANCE ANALYSIS")
        print("="*60)
        
        print(f"\n📈 Statistics:")
        print(f"  • Files analyzed: {self.stats['analyzed']}")
        print(f"  • Need workflow fixes: {self.stats['needs_fix']}")
        print(f"  • Can be auto-fixed: {len(issues)}")
        
        if issues:
            print(f"\n⚠️ Workflow Issues Found:")
            
            # Group by issue type
            by_issue = {}
            for item in issues:
                for issue in item['issues']:
                    if issue not in by_issue:
                        by_issue[issue] = []
                    by_issue[issue].append(item['filepath'].name)
                    
            for issue_type, files in sorted(by_issue.items()):
                print(f"\n❌ {issue_type} ({len(files)} files):")
                for filename in files[:3]:
                    print(f"  • {filename}")
                if len(files) > 3:
                    print(f"  ... and {len(files) - 3} more")
                    
    def generate_fix_report(self, issues: List[Dict]) -> None:
        """Generate a report of suggested fixes"""
        print("\n" + "="*60)
        print("📋 SUGGESTED FIXES")
        print("="*60)
        
        # Group by domain
        by_domain = {}
        for item in issues:
            domain = item['metadata'].get('domain', 'unknown')
            if domain not in by_domain:
                by_domain[domain] = []
            by_domain[domain].append(item)
            
        for domain, domain_issues in sorted(by_domain.items()):
            print(f"\n🌊 {domain.upper()} Domain ({len(domain_issues)} files):")
            
            for item in domain_issues[:5]:
                filepath = item['filepath']
                print(f"\n  📁 {filepath.name}")
                print(f"     Issues: {', '.join(item['issues'])}")
                
                if item['suggestions']:
                    print("     Fixes:")
                    for key, value in item['suggestions'].items():
                        if value is None:
                            print(f"       - Remove '{key}'")
                        else:
                            print(f"       - Set {key}: {value}")

def main():
    parser = argparse.ArgumentParser(
        description='Fix Reality-First workflow metadata issues'
    )
    parser.add_argument(
        '--execute',
        action='store_true',
        help='Actually fix files (default is dry run)'
    )
    parser.add_argument(
        '--directory',
        default='.',
        help='Directory to scan (default: current)'
    )
    parser.add_argument(
        '--focus',
        choices=['reality', 'requirements', 'reconciliation'],
        help='Focus on specific domain'
    )
    
    args = parser.parse_args()
    
    fixer = WorkflowFixer()
    
    print("🔄 Reality-First Workflow Metadata Fixer")
    print("Session 00086 - Ensuring proper workflow compliance")
    print("-"*60)
    
    # Scan for issues
    print("📂 Scanning for workflow compliance issues...")
    issues = fixer.scan_directory(Path(args.directory))
    
    # Print analysis
    fixer.print_analysis(issues)
    
    if issues:
        # Generate fix report
        fixer.generate_fix_report(issues)
        
        if args.execute:
            print("\n" + "="*60)
            print("🚀 APPLYING FIXES")
            print("="*60)
            
            for item in issues:
                fixer.fix_metadata(item, dry_run=False)
                
            print(f"\n✅ Fixed {fixer.stats['fixed']} files")
        else:
            print("\n" + "="*60)
            print("🔍 DRY RUN - No changes made")
            print("Use --execute to apply fixes")
            print("="*60)
    else:
        print("\n✅ All files comply with Reality-First workflow!")

if __name__ == "__main__":
    main()