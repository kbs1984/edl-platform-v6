#!/usr/bin/env python3
"""
Add YAML frontmatter to markdown files that lack it
Session 00061 - Making dark documentation visible
"""

import sys
import re
from pathlib import Path
from datetime import datetime
import argparse

def extract_session_number(filepath: str) -> str:
    """Extract session number from filename"""
    match = re.search(r'(\d{5})', filepath)
    if match:
        return match.group(1)
    # Try SESSION-XXXXX pattern
    match = re.search(r'SESSION-(\d{5})', filepath)
    if match:
        return match.group(1)
    return "unknown"

def detect_file_type(filepath: Path) -> str:
    """Detect file type from path and name"""
    name = filepath.name.lower()
    path_str = str(filepath).lower()
    
    if 'session' in path_str and 'log' in name:
        return "log"
    elif 'handoff' in name:
        return "handoff"
    elif 'masterplan' in name:
        return "architecture"
    elif 'index' in name:
        return "index"
    elif 'requirements' in path_str:
        return "requirements"
    elif 'script' in name or 'scripts' in path_str:
        return "script"
    elif 'protocol' in name:
        return "protocol"
    elif 'guide' in name or 'readme' in name:
        return "guide"
    else:
        return "documentation"

def extract_title(filepath: Path, content: str) -> str:
    """Extract title from first heading or filename"""
    # Try to find first # heading
    for line in content.split('\n')[:10]:
        if line.startswith('# '):
            return line[2:].strip()
    
    # Fall back to filename
    name = filepath.stem.replace('-', ' ').replace('_', ' ')
    # Remove session numbers
    name = re.sub(r'^\d{5}\s*', '', name)
    name = re.sub(r'^SESSION\s*\d{5}\s*', '', name)
    return name.title()

def extract_topics(filepath: Path, content: str) -> list:
    """Extract likely topics from content"""
    topics = []
    name_lower = filepath.name.lower()
    
    # Common keywords to look for
    if 'auth' in name_lower or 'auth' in content[:1000].lower():
        topics.append('auth')
    if 'database' in name_lower or 'database' in content[:1000].lower():
        topics.append('database')
    if 'yaml' in name_lower or 'yaml' in content[:1000].lower():
        topics.append('yaml')
    if 'migration' in name_lower:
        topics.append('migration')
    if 'test' in name_lower:
        topics.append('testing')
    if 'session' in name_lower:
        topics.append('session-log')
    
    # Add file type as topic (but avoid duplication)
    file_type = detect_file_type(filepath)
    
    # Don't add "log" if "session-log" is already present
    if file_type == "log" and "session-log" in topics:
        pass  # Skip adding redundant "log"
    elif file_type not in topics:
        topics.append(file_type)
    
    return topics if topics else ['documentation']

def create_yaml_frontmatter(filepath: Path, content: str) -> str:
    """Create YAML frontmatter for a file"""
    session = extract_session_number(str(filepath))
    file_type = detect_file_type(filepath)
    title = extract_title(filepath, content)
    topics = extract_topics(filepath, content)
    
    # Determine status
    if 'deprecated' in str(filepath).lower():
        status = 'deprecated'
    elif 'draft' in content[:500].lower():
        status = 'draft'
    else:
        status = 'current'
    
    # Determine priority
    if 'p0' in str(filepath).lower() or 'critical' in title.lower():
        priority = 'P0'
    elif 'p2' in str(filepath).lower():
        priority = 'P2'
    else:
        priority = 'P1'
    
    # Determine domain
    if 'requirements' in str(filepath).lower():
        domain = 'requirements'
    elif 'reality' in str(filepath).lower():
        domain = 'reality'
    elif 'reconciliation' in str(filepath).lower():
        domain = 'reconciliation'
    else:
        domain = 'core'
    
    yaml = f'''---
session: "{session}"
type: "{file_type}"
status: "{status}"
created: "{datetime.now().strftime('%Y-%m-%d')}"
title: "{title}"
purpose: "Document {title.lower()}"
topics: {topics}
priority: "{priority}"
domain: "{domain}"
---

'''
    return yaml

def add_yaml_to_file(filepath: Path, dry_run: bool = False) -> bool:
    """Add YAML frontmatter to a single file"""
    try:
        content = filepath.read_text(encoding='utf-8')
        
        # Skip if already has YAML
        if content.startswith('---'):
            print(f"  ✓ Already has YAML: {filepath}")
            return False
        
        # Create frontmatter
        yaml = create_yaml_frontmatter(filepath, content)
        
        if dry_run:
            print(f"  Would add to {filepath}:")
            print("  " + yaml.replace('\n', '\n  '))
            return True
        
        # Write back with frontmatter
        new_content = yaml + content
        filepath.write_text(new_content, encoding='utf-8')
        print(f"  ✅ Added YAML to: {filepath}")
        return True
        
    except Exception as e:
        print(f"  ❌ Error processing {filepath}: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description='Add YAML frontmatter to markdown files')
    parser.add_argument('pattern', help='File pattern to process (e.g., "SESSION-*-LOG.md")')
    parser.add_argument('--dir', default='archive/sessions', help='Directory to search in')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be done without making changes')
    parser.add_argument('--all', action='store_true', help='Process all matching files')
    
    args = parser.parse_args()
    
    # Find matching files
    search_dir = Path(args.dir)
    if not search_dir.exists():
        print(f"Error: Directory {search_dir} does not exist")
        return 1
    
    files = list(search_dir.glob(args.pattern))
    
    if not files:
        print(f"No files matching '{args.pattern}' in {search_dir}")
        return 1
    
    print(f"Found {len(files)} files matching '{args.pattern}'")
    
    if not args.all:
        # Show first few and ask for confirmation
        print("\nFirst 5 files:")
        for f in files[:5]:
            print(f"  - {f.name}")
        if len(files) > 5:
            print(f"  ... and {len(files)-5} more")
        
        if not args.dry_run:
            response = input("\nProceed with adding YAML? (y/n): ")
            if response.lower() != 'y':
                print("Aborted")
                return 0
    
    # Process files
    updated = 0
    for filepath in files:
        if add_yaml_to_file(filepath, args.dry_run):
            updated += 1
    
    print(f"\n{'Would update' if args.dry_run else 'Updated'} {updated} files")
    
    if args.dry_run:
        print("\nRun without --dry-run to apply changes")

if __name__ == '__main__':
    sys.exit(main())