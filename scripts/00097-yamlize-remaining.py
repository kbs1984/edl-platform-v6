#!/usr/bin/env python3
"""
---
session: "00097"
type: "script"
status: "active"
created: "2025-08-28"
title: "Batch YAMLize Remaining Scripts"
purpose: "Intelligently add YAML to remaining 96 scripts with smart categorization"
language: "python"
category: "yaml"
topics: ["scripts", "yaml", "batch-processing"]
priority: "P0"
domain: "core"
---
Batch YAMLize remaining scripts with intelligent status detection
"""

import os
import re
from pathlib import Path
from datetime import datetime

def has_yaml(filepath):
    """Check if script already has YAML"""
    try:
        content = Path(filepath).read_text(errors='ignore')
        return '---\n' in content[:500] and ('session:' in content[:500] or 'type:' in content[:500])
    except:
        return False

def determine_status(filename, content):
    """Intelligently determine script status"""
    
    # Check for explicit markers
    if 'DEPRECATED' in content[:1000].upper():
        return 'deprecated'
    if 'OBSOLETE' in content[:1000].upper():
        return 'obsolete'
    if 'DO NOT USE' in content[:1000].upper():
        return 'deprecated'
    
    # Extract session number
    session_num = None
    if match := re.match(r'000(\d+)-', filename):
        session_num = int(match.group(1))
    
    # Recent sessions (87-96) are likely active
    if session_num and session_num >= 87:
        return 'active'
    
    # Session 28-36 core tools likely active
    if session_num and 28 <= session_num <= 36:
        if any(x in filename for x in ['context', 'handoff', 'generate', 'requirements', 'tos']):
            return 'active'
    
    # Session 59-69 YAML tools likely active
    if session_num and 59 <= session_num <= 69:
        if 'yaml' in filename.lower():
            return 'active'
    
    # Default to unknown for manual review
    return 'unknown'

def determine_category(filename, content):
    """Categorize script by purpose"""
    name_lower = filename.lower()
    
    if 'yaml' in name_lower:
        return 'yaml'
    elif 'test' in name_lower:
        return 'testing'
    elif 'verify' in name_lower or 'check' in name_lower:
        return 'verification'
    elif 'dashboard' in name_lower or 'tos' in name_lower:
        return 'dashboard'
    elif 'session' in name_lower or 'start' in name_lower:
        return 'session-management'
    elif 'reality' in name_lower or 'agent' in name_lower:
        return 'reality'
    elif 'auth' in name_lower or 'profile' in name_lower:
        return 'authentication'
    elif 'create' in name_lower or 'add' in name_lower or 'generate' in name_lower:
        return 'creation'
    elif 'fix' in name_lower:
        return 'fixes'
    else:
        return 'utility'

def extract_purpose(filename, content):
    """Extract or generate purpose"""
    
    # Look for explicit purpose in comments
    for line in content.split('\n')[:30]:
        if 'Purpose:' in line or 'PURPOSE:' in line:
            return line.split(':')[1].strip()
    
    # Generate based on filename
    name = filename.replace('.sh', '').replace('.py', '').replace('.sql', '')
    name = re.sub(r'^\d+-', '', name)  # Remove session number
    name = name.replace('-', ' ').replace('_', ' ')
    
    return f"Script for {name}"

def generate_yaml(filepath):
    """Generate YAML frontmatter for a script"""
    
    filename = os.path.basename(filepath)
    try:
        content = Path(filepath).read_text(errors='ignore')
    except:
        return None
    
    # Extract session
    session = 'legacy'
    if match := re.match(r'(000\d+)-', filename):
        session = match.group(1)
    
    # Determine metadata
    status = determine_status(filename, content)
    category = determine_category(filename, content)
    purpose = extract_purpose(filename, content)
    
    # Detect language
    if filepath.endswith('.py'):
        language = 'python'
    elif filepath.endswith('.sh'):
        language = 'bash'
    elif filepath.endswith('.sql'):
        language = 'sql'
    else:
        language = 'unknown'
    
    # Build YAML
    yaml = f'''---
session: "{session}"
type: "script"
status: "{status}"
created: "{datetime.now().strftime('%Y-%m-%d')}"
title: "{filename}"
purpose: "{purpose}"
language: "{language}"
category: "{category}"
topics: ["{category}"]
priority: "P2"
domain: "core"
---'''
    
    return yaml

def add_yaml_to_script(filepath):
    """Add YAML to a script file"""
    
    if has_yaml(filepath):
        return 'already_has_yaml'
    
    try:
        content = Path(filepath).read_text()
    except:
        return 'read_error'
    
    yaml = generate_yaml(filepath)
    if not yaml:
        return 'generation_error'
    
    # Handle different file types
    filename = os.path.basename(filepath)
    
    if filepath.endswith('.py'):
        # Python: YAML in docstring
        if content.startswith('#!/'):
            lines = content.split('\n', 1)
            new_content = lines[0] + '\n"""\n' + yaml + '\n"""\n' + (lines[1] if len(lines) > 1 else '')
        else:
            new_content = '"""\n' + yaml + '\n"""\n' + content
    
    elif filepath.endswith('.sh'):
        # Bash: YAML as comments
        if content.startswith('#!/'):
            lines = content.split('\n', 1)
            yaml_commented = '\n'.join('# ' + line if line else '#' for line in yaml.split('\n'))
            new_content = lines[0] + '\n' + yaml_commented + '\n' + (lines[1] if len(lines) > 1 else '')
        else:
            yaml_commented = '\n'.join('# ' + line if line else '#' for line in yaml.split('\n'))
            new_content = yaml_commented + '\n' + content
    
    elif filepath.endswith('.sql'):
        # SQL: YAML as comments
        yaml_commented = '\n'.join('-- ' + line if line else '--' for line in yaml.split('\n'))
        new_content = yaml_commented + '\n' + content
    
    else:
        return 'unknown_type'
    
    try:
        Path(filepath).write_text(new_content)
        return 'success'
    except:
        return 'write_error'

def main():
    print("=" * 80)
    print("BATCH YAMLIZATION OF REMAINING SCRIPTS")
    print("=" * 80)
    print()
    
    scripts_dir = 'scripts'
    all_scripts = [f for f in os.listdir(scripts_dir) 
                   if f.endswith(('.sh', '.py', '.sql'))]
    
    # Statistics
    already_yaml = 0
    successful = 0
    failed = 0
    by_status = {'active': 0, 'deprecated': 0, 'obsolete': 0, 'unknown': 0}
    
    print(f"📊 Found {len(all_scripts)} total scripts")
    print("Starting batch YAMLization...\n")
    
    for script in sorted(all_scripts):
        filepath = os.path.join(scripts_dir, script)
        result = add_yaml_to_script(filepath)
        
        if result == 'already_has_yaml':
            already_yaml += 1
            print(f"  ⚪ {script} - already has YAML")
        elif result == 'success':
            successful += 1
            # Check what status was assigned
            content = Path(filepath).read_text(errors='ignore')
            if 'status: "active"' in content:
                by_status['active'] += 1
                print(f"  ✅ {script} - YAMLized (active)")
            elif 'status: "deprecated"' in content:
                by_status['deprecated'] += 1
                print(f"  🔴 {script} - YAMLized (deprecated)")
            elif 'status: "unknown"' in content:
                by_status['unknown'] += 1
                print(f"  🟡 {script} - YAMLized (unknown)")
            else:
                print(f"  ✅ {script} - YAMLized")
        else:
            failed += 1
            print(f"  ❌ {script} - failed ({result})")
    
    # Summary
    print("\n" + "=" * 80)
    print("SUMMARY")
    print("=" * 80)
    print(f"\n📊 Results:")
    print(f"  Already had YAML: {already_yaml}")
    print(f"  Successfully YAMLized: {successful}")
    print(f"  Failed: {failed}")
    print(f"\n📈 Status Distribution of New YAMLs:")
    print(f"  Active: {by_status['active']}")
    print(f"  Deprecated: {by_status['deprecated']}")
    print(f"  Unknown (need review): {by_status['unknown']}")
    print(f"\n✅ Total scripts with YAML: {already_yaml + successful}/{len(all_scripts)}")
    print(f"   Coverage: {((already_yaml + successful) / len(all_scripts) * 100):.1f}%")
    
    if by_status['unknown'] > 0:
        print(f"\n⚠️  {by_status['unknown']} scripts marked 'unknown' need manual status review")
        print("   Run: python3 scripts/00059-yaml-query.py --type script --status unknown")

if __name__ == '__main__':
    main()