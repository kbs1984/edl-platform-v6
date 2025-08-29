#!/usr/bin/env python3
"""
---
session: "00097"
type: "script"
status: "active"
created: "2025-08-28"
title: "00097-yamlize-scripts.py"
purpose: "Script for yamlize scripts"
language: "python"
category: "yaml"
topics: ["yaml"]
priority: "P2"
domain: "core"
---
"""
"""
Script YAMLization Tool - Session 00097
Adds YAML frontmatter to script files with intelligent defaults
"""

import os
import sys
import re
from datetime import datetime
from pathlib import Path

def detect_script_info(filepath):
    """Analyze script to determine metadata"""
    filename = os.path.basename(filepath)
    content = Path(filepath).read_text(errors='ignore')
    
    info = {
        'session': 'unknown',
        'language': 'unknown',
        'purpose': 'Script purpose not documented',
        'status': 'unknown',
        'category': 'uncategorized'
    }
    
    # Extract session number
    if match := re.match(r'000(\d+)-', filename):
        info['session'] = f"000{match.group(1)}"
    elif filename in ['create-session-log.sh', 'session-guard.sh', 'structure-check.sh']:
        info['session'] = 'legacy'
    
    # Detect language
    if filepath.endswith('.py'):
        info['language'] = 'python'
    elif filepath.endswith('.sh'):
        info['language'] = 'bash'
    elif filepath.endswith('.sql'):
        info['language'] = 'sql'
    
    # Check for deprecation markers
    if 'DEPRECATED' in content[:500]:
        info['status'] = 'deprecated'
        # Try to find what it's replaced by
        if 'USE INSTEAD:' in content:
            if match := re.search(r'USE INSTEAD:\s*(.*?)(?:\n|$)', content):
                info['replaced_by'] = match.group(1).strip()
    elif 'OBSOLETE' in content[:500]:
        info['status'] = 'obsolete'
    
    # Categorize by filename patterns
    if 'yaml' in filename.lower():
        info['category'] = 'yaml'
    elif 'session-start' in filename or 'startup' in filename:
        info['category'] = 'automation'
    elif 'verify' in filename or 'test' in filename or 'check' in filename:
        info['category'] = 'verification'
    elif 'reality' in filename:
        info['category'] = 'reality'
    elif 'migration' in filename or 'batch' in filename:
        info['category'] = 'migration'
    elif 'create' in filename or 'add' in filename:
        info['category'] = 'creation'
    
    # Extract purpose from comments
    for line in content.split('\n')[:20]:
        if 'Purpose:' in line:
            info['purpose'] = line.split('Purpose:')[1].strip()
            break
        elif 'PURPOSE:' in line:
            info['purpose'] = line.split('PURPOSE:')[1].strip()
            break
        elif line.startswith('# ') and len(line) > 10 and 'bin' not in line:
            # Use first substantial comment as purpose
            if info['purpose'] == 'Script purpose not documented':
                info['purpose'] = line[2:].strip()
    
    return info

def generate_yaml_frontmatter(filepath, info):
    """Generate appropriate YAML frontmatter for a script"""
    
    filename = os.path.basename(filepath)
    
    # Build the YAML
    yaml = f"""---
session: "{info['session']}"
type: "script"
status: "{info.get('status', 'active')}"
created: "{datetime.now().strftime('%Y-%m-%d')}"
title: "{filename}"
purpose: "{info['purpose']}"
language: "{info['language']}"
category: "{info['category']}"
"""
    
    # Add replaced_by if applicable
    if 'replaced_by' in info:
        yaml += f'replaced_by: "{info["replaced_by"]}"\n'
    
    # Add topics based on filename
    topics = []
    if 'yaml' in filename.lower():
        topics.append('yaml')
    if 'session' in filename:
        topics.append('session')
    if 'startup' in filename or 'start' in filename:
        topics.append('automation')
    if 'reality' in filename:
        topics.append('reality-agents')
    if 'verify' in filename or 'test' in filename:
        topics.append('verification')
    
    if topics:
        yaml += f'topics: {topics}\n'
    
    yaml += f"""priority: "P2"
domain: "core"
---
"""
    
    return yaml

def add_yaml_to_script(filepath):
    """Add YAML frontmatter to a script file"""
    
    # Read current content
    content = Path(filepath).read_text()
    
    # Check if already has YAML
    if content.startswith('---\n'):
        print(f"  ⚠️  {filepath} already has YAML frontmatter")
        return False
    
    # Skip shebang if present
    lines = content.split('\n')
    insert_pos = 0
    
    if lines[0].startswith('#!'):
        insert_pos = 1
        shebang = lines[0] + '\n'
        remaining = '\n'.join(lines[1:])
    else:
        shebang = ''
        remaining = content
    
    # Analyze script
    info = detect_script_info(filepath)
    
    # Generate YAML
    yaml = generate_yaml_frontmatter(filepath, info)
    
    # Combine
    new_content = shebang + yaml + '\n' + remaining
    
    # Write back
    Path(filepath).write_text(new_content)
    
    status_icon = '🔴' if info.get('status') == 'deprecated' else '✅'
    print(f"  {status_icon} Added YAML to {os.path.basename(filepath)} (status: {info.get('status', 'active')})")
    return True

def main():
    """Main function to YAMLize scripts"""
    
    print("🔧 Script YAMLization Tool - Session 00097")
    print("=" * 50)
    
    # Top 10 critical scripts
    critical_scripts = [
        'scripts/00028-session-start.sh',
        'scripts/00059-yaml-query.py', 
        'scripts/00028-reality-check.sh',
        'scripts/00088-gather-evidence.sh',
        'scripts/create-session-log.sh',
        'scripts/00061-add-yaml-frontmatter.py',
        'scripts/structure-check.sh',
        'scripts/session-guard.sh',
        'scripts/00032-tos-dashboard.sh',
        'scripts/00069-yaml-pre-commit-hook.sh'
    ]
    
    # Add deprecated startup scripts too
    deprecated_scripts = [
        'scripts/00028-full-startup.sh',
        'scripts/00028-session-startup.sh',
        'scripts/00059-session-start-enhanced.sh',
        'scripts/00028-session-start-original.sh'
    ]
    
    all_priority_scripts = critical_scripts + deprecated_scripts
    
    print("\n📋 Adding YAML to priority scripts...")
    added = 0
    skipped = 0
    
    for script in all_priority_scripts:
        if os.path.exists(script):
            if add_yaml_to_script(script):
                added += 1
            else:
                skipped += 1
        else:
            print(f"  ❌ Not found: {script}")
    
    print(f"\n✅ Complete: {added} scripts YAMLized, {skipped} already had YAML")
    
    # Now we can query them!
    print("\n🔍 Testing YAML queries on scripts...")
    print("You can now run:")
    print("  python3 scripts/00059-yaml-query.py --type script --status active")
    print("  python3 scripts/00059-yaml-query.py --type script --status deprecated")
    print("  python3 scripts/00059-yaml-query.py --type script --category automation")

if __name__ == '__main__':
    main()