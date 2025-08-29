#!/usr/bin/env python3
"""
---
session: "00097"
type: "script"
status: "active"
created: "2025-08-28"
title: "Comprehensive Script Analysis Tool"
purpose: "Analyze all 135 scripts to determine which serve us and which don't"
language: "python"
category: "analysis"
topics: ["scripts", "analysis", "cleanup"]
priority: "P0"
domain: "core"
---
Analyze all scripts to categorize them as active/deprecated/obsolete
"""

import os
import re
from pathlib import Path
from datetime import datetime
from collections import defaultdict

def has_yaml(filepath):
    """Check if script already has YAML"""
    content = Path(filepath).read_text(errors='ignore')
    return '---\nsession:' in content or '---\ntype:' in content

def analyze_script_purpose(filepath):
    """Deep analysis of what a script does"""
    filename = os.path.basename(filepath)
    content = Path(filepath).read_text(errors='ignore')[:2000]  # First 2000 chars
    
    analysis = {
        'filename': filename,
        'session': 'unknown',
        'category': 'unknown',
        'likely_status': 'unknown',
        'purpose': 'Unknown',
        'evidence': [],
        'references': []
    }
    
    # Extract session number
    if match := re.match(r'000(\d+)-', filename):
        analysis['session'] = int(match.group(1))
    
    # Check for explicit deprecation
    if 'DEPRECATED' in content.upper():
        analysis['likely_status'] = 'deprecated'
        analysis['evidence'].append('Contains DEPRECATED marker')
    elif 'OBSOLETE' in content.upper():
        analysis['likely_status'] = 'obsolete'
        analysis['evidence'].append('Contains OBSOLETE marker')
    
    # Categorize by filename patterns
    name_lower = filename.lower()
    
    # Migration era (Sessions 40-55)
    if isinstance(analysis['session'], int) and 40 <= analysis['session'] <= 55:
        if 'migration' in name_lower or 'verify' in name_lower or 'batch' in name_lower:
            analysis['category'] = 'migration-era'
            analysis['likely_status'] = 'obsolete'
            analysis['evidence'].append('Migration era script (Sessions 40-55)')
    
    # Auth/Profile debugging era (Sessions 44-47, 75-82)
    if isinstance(analysis['session'], int) and (analysis['session'] in range(44, 48) or analysis['session'] in range(75, 83)):
        if 'profile' in name_lower or 'auth' in name_lower:
            analysis['category'] = 'auth-debugging'
            analysis['likely_status'] = 'obsolete'
            analysis['evidence'].append('Auth confusion era script')
    
    # Categorize by patterns
    if 'test' in name_lower:
        analysis['category'] = 'testing'
    elif 'verify' in name_lower or 'check' in name_lower:
        analysis['category'] = 'verification'
    elif 'migration' in name_lower or 'batch' in name_lower:
        analysis['category'] = 'migration'
    elif 'yaml' in name_lower:
        analysis['category'] = 'yaml'
    elif 'session' in name_lower or 'start' in name_lower:
        analysis['category'] = 'session-management'
    elif 'reality' in name_lower or 'agent' in name_lower:
        analysis['category'] = 'reality'
    elif 'create' in name_lower or 'add' in name_lower:
        analysis['category'] = 'creation'
    elif 'dashboard' in name_lower or 'tos' in name_lower:
        analysis['category'] = 'dashboard'
    
    # Extract purpose from comments
    for line in content.split('\n')[:30]:
        if 'Purpose:' in line or 'PURPOSE:' in line:
            analysis['purpose'] = line.split(':')[1].strip()
            break
    
    # Check for references to other scripts
    for match in re.findall(r'(000\d+-[\w-]+\.(?:sh|py))', content):
        if match != filename:
            analysis['references'].append(match)
    
    return analysis

def main():
    print("=" * 80)
    print("COMPREHENSIVE SCRIPT ANALYSIS - Session 00097")
    print("=" * 80)
    print()
    
    scripts_dir = 'scripts'
    all_files = sorted([f for f in os.listdir(scripts_dir) 
                       if f.endswith(('.sh', '.py', '.sql'))])
    
    # Separate YAMLized vs un-YAMLized
    yamlized = []
    unprocessed = []
    
    for f in all_files:
        filepath = os.path.join(scripts_dir, f)
        if has_yaml(filepath):
            yamlized.append(f)
        else:
            unprocessed.append(f)
    
    print(f"📊 Total Scripts: {len(all_files)}")
    print(f"✅ YAMLized: {len(yamlized)}")
    print(f"❌ Un-YAMLized: {len(unprocessed)}")
    print()
    
    # Analyze unprocessed scripts
    categories = defaultdict(list)
    by_session = defaultdict(list)
    by_status = defaultdict(list)
    
    for script in unprocessed:
        filepath = os.path.join(scripts_dir, script)
        analysis = analyze_script_purpose(filepath)
        
        categories[analysis['category']].append(analysis)
        by_status[analysis['likely_status']].append(analysis)
        if analysis['session'] != 'unknown':
            by_session[analysis['session']].append(analysis)
    
    # Print analysis by likely status
    print("=" * 80)
    print("SCRIPTS BY LIKELY STATUS")
    print("=" * 80)
    
    print("\n🔴 LIKELY OBSOLETE (Safe to Archive)")
    print("-" * 40)
    obsolete = by_status.get('obsolete', [])
    for script in sorted(obsolete, key=lambda x: x['filename']):
        print(f"  {script['filename']}")
        for evidence in script['evidence']:
            print(f"    → {evidence}")
    print(f"\nTotal: {len(obsolete)} scripts")
    
    print("\n⚠️ LIKELY DEPRECATED (Check for Replacements)")
    print("-" * 40)
    deprecated = by_status.get('deprecated', [])
    for script in sorted(deprecated, key=lambda x: x['filename']):
        print(f"  {script['filename']}")
        for evidence in script['evidence']:
            print(f"    → {evidence}")
    print(f"\nTotal: {len(deprecated)} scripts")
    
    print("\n❓ UNKNOWN STATUS (Need Investigation)")
    print("-" * 40)
    unknown = by_status.get('unknown', [])
    
    # Group unknown by category for better analysis
    unknown_by_cat = defaultdict(list)
    for script in unknown:
        unknown_by_cat[script['category']].append(script)
    
    for category, scripts in sorted(unknown_by_cat.items()):
        print(f"\n  Category: {category.upper()} ({len(scripts)} scripts)")
        for script in sorted(scripts, key=lambda x: x['filename'])[:5]:  # Show first 5
            print(f"    • {script['filename']}")
        if len(scripts) > 5:
            print(f"    ... and {len(scripts) - 5} more")
    
    # Migration era analysis
    print("\n" + "=" * 80)
    print("MIGRATION ERA ANALYSIS (Sessions 40-55)")
    print("=" * 80)
    
    migration_scripts = []
    for session in range(40, 56):
        if session in by_session:
            migration_scripts.extend(by_session[session])
    
    print(f"\n📦 Found {len(migration_scripts)} migration-era scripts")
    print("These are likely ALL OBSOLETE since migration completed in Session 53:")
    
    for script in sorted(migration_scripts, key=lambda x: x['filename'])[:10]:
        print(f"  • {script['filename']} (Session {script['session']})")
    if len(migration_scripts) > 10:
        print(f"  ... and {len(migration_scripts) - 10} more")
    
    # Recommendations
    print("\n" + "=" * 80)
    print("RECOMMENDATIONS")
    print("=" * 80)
    
    print("\n🎯 IMMEDIATE ACTIONS:")
    print("1. Archive all migration-era scripts (Sessions 40-55)")
    print(f"   → {len(migration_scripts)} scripts to move to scripts/obsolete/migration/")
    print()
    print("2. Archive auth-debugging scripts (Sessions 44-47, 75-82)")
    auth_debug_count = len([s for s in unprocessed if '44' <= s[:5] <= '47' or '75' <= s[:5] <= '82'])
    print(f"   → ~{auth_debug_count} scripts from the auth confusion period")
    print()
    print("3. Review and consolidate verification scripts")
    verify_count = len(categories.get('verification', []))
    print(f"   → {verify_count} verification scripts with unclear purposes")
    
    print("\n📊 CATEGORIES NEEDING CONSOLIDATION:")
    for category, scripts in sorted(categories.items(), key=lambda x: -len(x[1]))[:5]:
        if len(scripts) > 3:
            print(f"  • {category}: {len(scripts)} scripts (potential duplication)")
    
    print("\n💾 PROPOSED DIRECTORY STRUCTURE:")
    print("""
scripts/
  ├── SCRIPTS-INDEX.md          # Registry (already created)
  ├── 00028-session-start.sh    # Canonical scripts
  ├── 00059-yaml-query.py       # Active tools
  ├── ...
  └── obsolete/                  # Archive
      ├── migration/             # Sessions 40-55
      ├── auth-debugging/        # Sessions 44-47, 75-82
      ├── deprecated/            # Replaced scripts
      └── experimental/          # Failed experiments
    """)
    
    # Generate archival commands
    print("\n🔧 ARCHIVAL COMMANDS (Review before running):")
    print("```bash")
    print("# Create archive structure")
    print("mkdir -p scripts/obsolete/{migration,auth-debugging,deprecated,experimental}")
    print()
    print("# Archive migration scripts")
    for session in range(40, 56):
        print(f"mv scripts/000{session}-*.* scripts/obsolete/migration/ 2>/dev/null")
    print("```")

if __name__ == '__main__':
    main()