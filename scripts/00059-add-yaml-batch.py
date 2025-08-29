#!/usr/bin/env python3
"""
---
session: "00059"
type: "script"
status: "active"
created: "2025-08-28"
title: "00059-add-yaml-batch.py"
purpose: "Quickly add YAML to files that need it"
language: "python"
category: "yaml"
topics: ["yaml"]
priority: "P2"
domain: "core"
---
"""
"""
Batch add YAML frontmatter to priority files
Session: 00059
Purpose: Quickly add YAML to files that need it
"""

import frontmatter
from pathlib import Path
from datetime import datetime

# Files to add YAML to with their metadata
priority_files = [
    {
        "path": "00056-COMPREHENSIVE-ORGANIZATION-STRATEGY.md",
        "metadata": {
            "session": "00056",
            "type": "specification",
            "status": "current",
            "created": "2025-08-23",
            "title": "Comprehensive Organization Strategy",
            "purpose": "Define systematic approach to file organization and management",
            "topics": ["organization", "strategy", "filesystem", "yaml"],
            "priority": "P0",
            "domain": "core",
            "implements": ["00056-FILESYSTEM-AGENT-ENHANCEMENT-SPEC.md"],
            "validation_method": "manual",
            "estimated_shelf_life": "6 months"
        }
    },
    {
        "path": "00057-INTEGRATION-AGENT-MASTERPLAN-MODULE.md",
        "metadata": {
            "session": "00057",
            "type": "specification",
            "status": "current",
            "created": "2025-08-23",
            "title": "Integration Agent Masterplan Module",
            "purpose": "Define integration agent architecture and implementation",
            "topics": ["integration", "agent", "architecture", "masterplan"],
            "priority": "P0",
            "domain": "reality",
            "validation_method": "automated",
            "estimated_shelf_life": "3 months"
        }
    },
    {
        "path": "QUICK-START-00042.md",
        "metadata": {
            "session": "00042",
            "type": "guide",
            "status": "current",
            "created": "2025-08-21",
            "title": "Quick Start Guide - Session 42",
            "purpose": "Rapid onboarding guide for truth seed implementation",
            "topics": ["quickstart", "guide", "onboarding", "truth-seed"],
            "priority": "P0",
            "domain": "core",
            "audience": "developer",
            "complexity": "beginner",
            "validation_method": "manual",
            "estimated_shelf_life": "3 months"
        }
    },
    {
        "path": "00031-WORKFLOW-BOUNDARIES.md",
        "metadata": {
            "session": "00031",
            "type": "guide",
            "status": "current",
            "created": "2025-08-17",
            "title": "Workflow Boundaries Protocol",
            "purpose": "Define Claude Code autonomous capabilities vs manual intervention requirements",
            "topics": ["workflow", "boundaries", "protocol", "automation"],
            "priority": "P0",
            "domain": "core",
            "related_to": ["00031-MANUAL-INTERVENTION-PROTOCOL.md", "00031-MANUAL-TESTING-CHECKLIST.md"],
            "validation_method": "manual",
            "estimated_shelf_life": "indefinite"
        }
    },
    {
        "path": "00031-CONSTITUTIONAL-OS-GUIDE.md",
        "metadata": {
            "session": "00031",
            "type": "guide",
            "status": "current",
            "created": "2025-08-17",
            "title": "Constitutional Operating System Guide",
            "purpose": "Master guide for phase-aware development philosophy",
            "topics": ["constitution", "os", "phases", "development"],
            "priority": "P0",
            "domain": "core",
            "related_to": ["00031-PHASE-SEED-GUIDE.md", "00031-PHASE-GROW-GUIDE.md", "00031-PHASE-HARVEST-GUIDE.md"],
            "validation_method": "manual",
            "estimated_shelf_life": "indefinite",
            "breakthrough": "Phase-aware development adapting to natural rhythms"
        }
    }
]

def add_yaml_to_file(filepath: Path, metadata: dict) -> bool:
    """Add YAML frontmatter to a file if it doesn't have it"""
    try:
        # Check if file exists
        if not filepath.exists():
            print(f"⚠️ File not found: {filepath}")
            return False
        
        # Read file
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if already has frontmatter
        if content.startswith('---\n'):
            print(f"✓ Already has YAML: {filepath}")
            return True
        
        # Parse with frontmatter (will be empty if none exists)
        post = frontmatter.loads(content)
        
        # Update metadata
        for key, value in metadata.items():
            post[key] = value
        
        # Add modified date if not specified
        if 'modified' not in post:
            post['modified'] = datetime.now().strftime('%Y-%m-%d')
        
        # Write back with frontmatter
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(frontmatter.dumps(post))
        
        print(f"✅ Added YAML to: {filepath}")
        return True
        
    except Exception as e:
        print(f"❌ Error processing {filepath}: {e}")
        return False


def main():
    """Add YAML to priority files"""
    print("🚀 Adding YAML frontmatter to priority files")
    print("="*60)
    
    success = 0
    for file_info in priority_files:
        filepath = Path(file_info['path'])
        if add_yaml_to_file(filepath, file_info['metadata']):
            success += 1
    
    print("\n" + "="*60)
    print(f"✅ Successfully processed {success}/{len(priority_files)} files")


if __name__ == "__main__":
    main()