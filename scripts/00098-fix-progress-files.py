#!/usr/bin/env python3
"""
---
session: "00098"
type: "script"
status: "active"
created: "2025-08-28"
title: "Fix Session 97 Progress Files"
purpose: "Reorganize progress files with proper naming, domains, and complete YAML"
language: "python"
category: "maintenance"
topics: ["organization", "yaml", "fixes", "progress"]
priority: "P0"
domain: "core"
fixes: ["session-97-organization"]
---
Fix Session 97's Progress Files
- Add session numbers to filenames
- Fix incomplete YAML metadata
- Move to correct domains
"""

import os
import shutil
from pathlib import Path
import yaml
import frontmatter

def fix_progress_files():
    """Fix all progress files from Session 97"""
    
    fixes_needed = [
        {
            'old_path': 'progress/PROGRESS-INDEX.md',
            'new_name': '00097-PROGRESS-INDEX.md',
            'domain': 'core',
            'add_session': False,  # Already has session: "00097"
            'add_fields': {}
        },
        {
            'old_path': 'progress/FEATURE-BREAKDOWN-TEMPLATE.md',
            'new_name': '00097-FEATURE-BREAKDOWN-TEMPLATE.md',
            'domain': 'core',
            'add_session': False,  # Check if has session
            'add_fields': {}
        },
        {
            'old_path': 'progress/features/auth/AUTH-TIMELINE.md',
            'new_name': '00097-AUTH-TIMELINE.md',
            'domain': 'reconciliation',
            'add_session': True,  # Missing session field
            'add_fields': {
                'session': '00097',
                'title': 'Auth Feature Evolution Timeline',
                'purpose': 'Track authentication implementation across 37+ sessions'
            }
        },
        {
            'old_path': 'progress/features/auth/AUTH-DETAILED-BREAKDOWN.md',
            'new_name': '00097-AUTH-DETAILED-BREAKDOWN.md',
            'domain': 'reconciliation',
            'add_session': True,
            'add_fields': {
                'session': '00097'
            }
        },
        {
            'old_path': 'progress/state/current/DEPLOYMENT-STATE.md',
            'new_name': '00097-DEPLOYMENT-STATE.md',
            'domain': 'reality',  # Current state belongs in reality
            'add_session': False,
            'add_fields': {}
        },
        {
            'old_path': 'progress/state/current/TESTING-PRIORITIES.md',
            'new_name': '00097-TESTING-PRIORITIES.md',
            'domain': 'requirements',  # Testing priorities are requirements
            'add_session': False,
            'add_fields': {}
        },
        {
            'old_path': 'progress/knowledge/discoveries/KEY-DISCOVERIES.md',
            'new_name': '00097-KEY-DISCOVERIES.md',
            'domain': 'core',  # Core knowledge
            'add_session': False,
            'add_fields': {}
        },
        {
            'old_path': 'progress/tools/progress-dashboard.sh',
            'new_name': '00097-progress-dashboard.sh',
            'domain': 'scripts',  # Scripts go to scripts/
            'add_session': True,
            'add_fields': {
                'session': '00097'
            }
        }
    ]
    
    print("🔧 Fixing Session 97's Progress Files")
    print("=" * 50)
    
    for fix in fixes_needed:
        old_file = Path(fix['old_path'])
        
        if not old_file.exists():
            print(f"⚠️  Skipping {old_file} - doesn't exist")
            continue
            
        print(f"\n📁 Processing: {old_file}")
        
        # Read the file
        if old_file.suffix == '.md':
            with open(old_file, 'r') as f:
                post = frontmatter.load(f)
            
            # Fix YAML metadata if needed
            if fix['add_session'] or fix['add_fields']:
                for field, value in fix['add_fields'].items():
                    if field not in post.metadata or not post.metadata[field]:
                        post.metadata[field] = value
                        print(f"  ✅ Added {field}: {value}")
            
            # Update domain if different from what's in file
            if 'domain' in post.metadata and post.metadata['domain'] != fix['domain']:
                print(f"  ⚠️  Domain mismatch: file says '{post.metadata['domain']}', fixing to '{fix['domain']}'")
            post.metadata['domain'] = fix['domain']
            
            # Determine new path
            new_path = Path(fix['domain']) / fix['new_name']
            
            # Create directory if needed
            new_path.parent.mkdir(parents=True, exist_ok=True)
            
            # Write fixed file to new location
            with open(new_path, 'w') as f:
                f.write(frontmatter.dumps(post))
            
            print(f"  ✅ Moved to: {new_path}")
            
        elif old_file.suffix == '.sh':
            # Handle bash script
            with open(old_file, 'r') as f:
                content = f.read()
            
            # Check if it has YAML
            if '---' in content:
                # It's YAMLized, we need to fix it
                lines = content.split('\n')
                yaml_start = -1
                yaml_end = -1
                
                for i, line in enumerate(lines):
                    if line.strip() == '---':
                        if yaml_start == -1:
                            yaml_start = i
                        else:
                            yaml_end = i
                            break
                
                if yaml_start >= 0 and yaml_end > yaml_start:
                    # Extract and fix YAML
                    yaml_lines = lines[yaml_start+1:yaml_end]
                    yaml_text = '\n'.join(yaml_lines)
                    
                    try:
                        metadata = yaml.safe_load(yaml_text)
                        if not metadata:
                            metadata = {}
                        
                        # Add missing fields
                        for field, value in fix['add_fields'].items():
                            if field not in metadata:
                                metadata[field] = value
                        
                        metadata['domain'] = 'core'  # Scripts have domain: core
                        
                        # Rebuild the file
                        new_yaml = yaml.dump(metadata, default_flow_style=False)
                        new_content = '\n'.join(lines[:yaml_start+1]) + '\n'
                        new_content += new_yaml
                        new_content += '---\n'
                        new_content += '\n'.join(lines[yaml_end+1:])
                        
                        # Write to new location
                        new_path = Path('scripts') / fix['new_name']
                        with open(new_path, 'w') as f:
                            f.write(new_content)
                        
                        # Make executable
                        os.chmod(new_path, 0o755)
                        
                        print(f"  ✅ Moved script to: {new_path}")
                        
                    except Exception as e:
                        print(f"  ❌ Error processing script YAML: {e}")
                        # Just copy as-is
                        new_path = Path('scripts') / fix['new_name']
                        shutil.copy2(old_file, new_path)
                else:
                    # No YAML, just copy
                    new_path = Path('scripts') / fix['new_name']
                    shutil.copy2(old_file, new_path)
                    print(f"  ✅ Copied script to: {new_path}")
            else:
                # No YAML at all, just copy
                new_path = Path('scripts') / fix['new_name']
                shutil.copy2(old_file, new_path)
                print(f"  ✅ Copied script to: {new_path}")
        
        # Remove old file
        old_file.unlink()
        print(f"  🗑️  Deleted original: {old_file}")
    
    # Clean up empty directories
    print("\n🧹 Cleaning up empty directories...")
    progress_dir = Path('progress')
    if progress_dir.exists():
        # Remove empty subdirectories
        for root, dirs, files in os.walk(progress_dir, topdown=False):
            for d in dirs:
                dir_path = Path(root) / d
                if not any(dir_path.iterdir()):
                    dir_path.rmdir()
                    print(f"  🗑️  Removed empty: {dir_path}")
        
        # Remove progress directory if empty
        if not any(progress_dir.iterdir()):
            progress_dir.rmdir()
            print(f"  🗑️  Removed empty: progress/")
    
    print("\n✅ Session 97 files reorganized successfully!")
    print("\nNew locations:")
    print("  • core/00097-*.md - System documentation")
    print("  • reconciliation/00097-AUTH-*.md - Auth implementation")
    print("  • reality/00097-DEPLOYMENT-STATE.md - Current state")
    print("  • requirements/00097-TESTING-PRIORITIES.md - Test requirements")
    print("  • scripts/00097-progress-dashboard.sh - Progress tool")

if __name__ == '__main__':
    fix_progress_files()