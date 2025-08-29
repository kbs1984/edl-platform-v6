#!/usr/bin/env python3
"""
---
session: "00068"
type: "script"
status: "active"
created: "2025-08-28"
title: "00068-fix-yaml-validation.py"
purpose: "Script for fix yaml validation"
language: "python"
category: "yaml"
topics: ["yaml"]
priority: "P2"
domain: "core"
---
"""
"""
Session 00068/69 - Fix YAML Validation Errors (Enhanced)
Systematically fix common YAML frontmatter validation issues
Enhanced in Session 69 to handle more error types
"""

import os
import re
import yaml
from pathlib import Path
from typing import Dict, List, Tuple

# Valid type values per schema
VALID_TYPES = [
    'specification', 'guide', 'report', 'analysis', 'log', 
    'script', 'config', 'template', 'handoff', 'unknown',
    'protocol', 'command'  # Added in Session 69
]

# Valid status values per schema (Session 69 addition)
VALID_STATUS = ['current', 'draft', 'archived', 'superseded']

# Status mappings for invalid values (Session 69 addition)
STATUS_MAPPINGS = {
    'complete': 'current',
    'completed': 'current', 
    'active': 'current',
    'in-progress': 'draft',
    'pending': 'draft'
}

# Type mappings for invalid values
TYPE_MAPPINGS = {
    'documentation': 'guide',
    'architecture': 'specification',
    'index': 'guide',
    # 'protocol': 'specification',  # Now valid on its own
    # 'command': 'script',  # Now valid on its own
    'requirements': 'specification'
}

# Valid validation_method values (Session 69 addition)
VALID_VALIDATION_METHODS = ['automated', 'manual', 'reality-agent', 'none']

# Validation method mappings (Session 69 addition)
VALIDATION_METHOD_MAPPINGS = {
    'implemented': 'manual',
    'metrics': 'reality-agent',
    'tested': 'manual'  # Session 69 - common variant
}

# Files to skip (binary, generated, etc)
SKIP_PATTERNS = [
    '*.pyc', '*.pkl', '*.json', '*.sql', '*.sh', '*.py',
    '*.js', '*.ts', '*.jsx', '*.tsx', '*.css', '*.html',
    '.git/*', 'node_modules/*', '.next/*'
]

def should_skip(path: Path) -> bool:
    """Check if file should be skipped"""
    str_path = str(path)
    for pattern in SKIP_PATTERNS:
        if pattern.endswith('/*'):
            if pattern[:-2] in str_path:
                return True
        elif path.suffix == pattern[1:]:
            return True
    return False

def extract_yaml_frontmatter(content: str) -> Tuple[Dict, str]:
    """Extract YAML frontmatter and remaining content"""
    if not content.startswith('---\n'):
        return {}, content
    
    try:
        end_index = content.index('\n---\n', 4)
        yaml_str = content[4:end_index]
        remaining = content[end_index + 5:]
        
        data = yaml.safe_load(yaml_str)
        return data if data else {}, remaining
    except (ValueError, yaml.YAMLError):
        return {}, content

def fix_yaml_issues(data: Dict, file_path: Path) -> Tuple[Dict, List[str]]:
    """Fix common YAML validation issues"""
    fixes = []
    
    # Fix invalid status values (Session 69 enhancement)
    if 'status' in data and data['status'] not in VALID_STATUS:
        if data['status'] in STATUS_MAPPINGS:
            old_status = data['status']
            data['status'] = STATUS_MAPPINGS[old_status]
            fixes.append(f"status: {old_status} → {data['status']}")
    
    # Fix invalid type values
    if 'type' in data and data['type'] not in VALID_TYPES:
        if data['type'] in TYPE_MAPPINGS:
            old_type = data['type']
            data['type'] = TYPE_MAPPINGS[old_type]
            fixes.append(f"type: {old_type} → {data['type']}")
    
    # Fix invalid validation_method values (Session 69 enhancement)
    if 'validation_method' in data and data['validation_method'] not in VALID_VALIDATION_METHODS:
        if data['validation_method'] in VALIDATION_METHOD_MAPPINGS:
            old_method = data['validation_method']
            data['validation_method'] = VALIDATION_METHOD_MAPPINGS[old_method]
            fixes.append(f"validation_method: {old_method} → {data['validation_method']}")
    
    # Add missing type field for protocol files (Session 69 enhancement)
    if 'type' not in data:
        file_str = str(file_path)
        if 'protocols/' in file_str or 'PROTOCOL' in file_path.name:
            data['type'] = 'protocol'
            fixes.append("Added type: protocol")
        elif '.claude/commands' in file_str:
            data['type'] = 'command'
            fixes.append("Added type: command")
        elif 'SESSION-' in file_path.name and '-LOG' in file_path.name:
            data['type'] = 'log'
            fixes.append("Added type: log")
        elif 'SESSION-' in file_path.name and '-HANDOFF' in file_path.name:
            data['type'] = 'handoff'
            fixes.append("Added type: handoff")
    
    # Fix missing session for files that need it (Enhanced Session 69)
    if 'session' not in data:
        # Extract session number from filename if present
        match = re.match(r'^(\d{5})-', file_path.name)
        if match:
            data['session'] = match.group(1)
            fixes.append(f"Added session: {data['session']}")
        elif 'SESSION-' in file_path.name:
            match = re.search(r'SESSION-(\d{5})', file_path.name)
            if match:
                data['session'] = match.group(1)
                fixes.append(f"Added session: {data['session']}")
        else:
            # For all other files, add 'legacy' session
            # This includes .claude/commands, docs, truth-seed, etc.
            data['session'] = 'legacy'
            fixes.append("Added session: legacy")
    
    # Fix invalid session values
    if data.get('session') == 'unknown':
        match = re.match(r'^(\d{5})-', file_path.name)
        if match:
            data['session'] = match.group(1)
            fixes.append(f"session: unknown → {data['session']}")
        else:
            data['session'] = 'legacy'
            fixes.append("session: unknown → legacy")
    
    # Ensure required fields exist
    if 'status' not in data:
        data['status'] = 'current'  # Changed from 'active' to valid value
        fixes.append("Added status: current")
    
    # Add missing title field (Session 69 enhancement)
    if 'title' not in data:
        # Try to generate title from filename or first heading
        title = None
        if 'PROTOCOL' in file_path.name:
            title = file_path.stem.replace('-', ' ').replace('_', ' ').title()
        elif 'commands' in str(file_path):
            title = file_path.stem.replace('-', ' ').title() + ' Command'
        elif file_path.stem:
            title = file_path.stem.replace('-', ' ').replace('_', ' ').title()
        
        if title:
            data['title'] = title
            fixes.append(f"Added title: {title}")
    
    if 'created' not in data:
        data['created'] = '2025-08-25'
        fixes.append("Added created date")
    
    return data, fixes

def process_file(file_path: Path, dry_run: bool = False) -> List[str]:
    """Process a single file and fix YAML issues"""
    try:
        content = file_path.read_text(encoding='utf-8')
        yaml_data, remaining = extract_yaml_frontmatter(content)
        
        if not yaml_data:
            return []
        
        fixed_data, fixes = fix_yaml_issues(yaml_data, file_path)
        
        if not fixes:
            return []
        
        if not dry_run:
            # Write back the fixed YAML
            new_content = "---\n" + yaml.dump(fixed_data, default_flow_style=False) + "---\n" + remaining
            file_path.write_text(new_content, encoding='utf-8')
        
        return fixes
        
    except Exception as e:
        return [f"ERROR: {e}"]

def main():
    """Main execution"""
    import argparse
    parser = argparse.ArgumentParser(description='Fix YAML validation errors')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be fixed without making changes')
    parser.add_argument('--path', default='.', help='Path to process (default: current directory)')
    parser.add_argument('--verbose', action='store_true', help='Show all files processed')
    args = parser.parse_args()
    
    root = Path(args.path)
    
    print("🔧 YAML Validation Fixer - Session 00068")
    print("=" * 50)
    
    total_files = 0
    fixed_files = 0
    all_fixes = []
    
    # Find all markdown files
    for md_file in root.rglob('*.md'):
        if should_skip(md_file):
            continue
        
        total_files += 1
        fixes = process_file(md_file, args.dry_run)
        
        if fixes:
            fixed_files += 1
            all_fixes.append((md_file, fixes))
            if args.verbose or len(all_fixes) <= 20:
                print(f"\n📝 {md_file.relative_to(root)}")
                for fix in fixes:
                    print(f"  ✅ {fix}")
    
    # Summary
    print(f"\n{'=' * 50}")
    print(f"📊 Summary:")
    print(f"  • Files scanned: {total_files}")
    print(f"  • Files {'would be' if args.dry_run else ''} fixed: {fixed_files}")
    
    if args.dry_run:
        print(f"\n⚠️  DRY RUN - No changes made")
        print(f"Run without --dry-run to apply fixes")
    else:
        print(f"\n✅ Fixes applied successfully")
    
    # Show sample of fixes if too many
    if not args.verbose and len(all_fixes) > 20:
        print(f"\n📌 Showing first 20 files (use --verbose for all):")
        for path, fixes in all_fixes[:20]:
            print(f"  • {path.relative_to(root)}: {len(fixes)} fixes")

if __name__ == "__main__":
    main()