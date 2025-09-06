#!/usr/bin/env python3
"""
---
session: "00085"
type: "script"
status: "unknown"
created: "2025-08-28"
title: "00085-add-yaml-to-reality-files.py"
purpose: "Script for add yaml to reality files"
language: "python"
category: "yaml"
topics: ["yaml"]
priority: "P2"
domain: "core"
---
"""
"""
Session 00085: Add YAML frontmatter to reality files for discoverability
Makes ground truth easily queryable via YAML system
"""

import os
import re
from datetime import datetime
from pathlib import Path

def add_yaml_to_file(filepath, yaml_content):
    """Add YAML frontmatter to a file if it doesn't already have it."""
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Check if file already has YAML
    if content.startswith('---\n'):
        print(f"  ⏩ Skipping {filepath} (already has YAML)")
        return False
    
    # Add YAML frontmatter
    with open(filepath, 'w') as f:
        f.write(yaml_content)
        f.write('\n')
        f.write(content)
    
    print(f"  ✅ Added YAML to {filepath}")
    return True

def process_reality_files():
    """Add YAML to reality request files."""
    print("\n📊 Processing Reality Request Files...")
    print("=" * 50)
    
    reality_files = [
        {
            'path': 'reality/00081-request-triggers.md',
            'yaml': '''---
session: "00081"
type: "reality-snapshot"
status: "current"
created: "2025-08-27"
title: "Current Database Triggers Snapshot"
purpose: "Document actual triggers in our Supabase project"
topics: ["database", "triggers", "reality", "supabase-state"]
priority: "P0"
domain: "reality"
reality_type: "current-state"
source: "supabase-dashboard"
verified_date: "2025-08-27"
---'''
        },
        {
            'path': 'reality/00081-request-functions.md',
            'yaml': '''---
session: "00081"
type: "reality-snapshot"
status: "current"
created: "2025-08-27"
title: "Current Database Functions Snapshot"
purpose: "Document actual functions in our Supabase project"
topics: ["database", "functions", "reality", "supabase-state"]
priority: "P0"
domain: "reality"
reality_type: "current-state"
source: "supabase-dashboard"
verified_date: "2025-08-27"
---'''
        },
        {
            'path': 'reality/00081-request-source-project-triggers.md',
            'yaml': '''---
session: "00081"
type: "reality-snapshot"
status: "reference"
created: "2025-08-27"
title: "Source Project Triggers Reference"
purpose: "Document triggers in the source project we're replicating"
topics: ["database", "triggers", "reality", "source-project"]
priority: "P0"
domain: "reality"
reality_type: "source-reference"
source: "sean2474-emdash-debate"
---'''
        },
        {
            'path': 'reality/00081-request-source-project-functions.md',
            'yaml': '''---
session: "00081"
type: "reality-snapshot"
status: "reference"
created: "2025-08-27"
title: "Source Project Functions Reference"
purpose: "Document functions in the source project we're replicating"
topics: ["database", "functions", "reality", "source-project"]
priority: "P0"
domain: "reality"
reality_type: "source-reference"
source: "sean2474-emdash-debate"
---'''
        },
        {
            'path': 'reality/00081-request-source-project-enums.md',
            'yaml': '''---
session: "00081"
type: "reality-snapshot"
status: "reference"
created: "2025-08-27"
title: "Source Project Enums Reference"
purpose: "Document enum types in the source project we're replicating"
topics: ["database", "enums", "reality", "source-project", "types"]
priority: "P0"
domain: "reality"
reality_type: "source-reference"
source: "sean2474-emdash-debate"
---'''
        }
    ]
    
    count = 0
    for file_info in reality_files:
        if os.path.exists(file_info['path']):
            if add_yaml_to_file(file_info['path'], file_info['yaml']):
                count += 1
        else:
            print(f"  ⚠️ File not found: {file_info['path']}")
    
    return count

def process_done_migrations():
    """Add YAML to done- migration files."""
    print("\n📊 Processing Done Migration Files...")
    print("=" * 50)
    
    done_files = [
        ('reconciliation/migrations/batches/done-batch-01-foundation.sql', '00050', 'schemas, uuid-ossp'),
        ('reconciliation/migrations/batches/done-batch-01b-pg-trgm-extension.sql', '00051', 'pg_trgm extension'),
        ('reconciliation/migrations/batches/done-batch-02-types.sql', '00051', '12 ENUM types'),
        ('reconciliation/migrations/batches/done-batch-03-tables.sql', '00051', '36 tables'),
        ('reconciliation/migrations/batches/done-batch-03b-primary-keys.sql', '00051', 'primary keys'),
        ('reconciliation/migrations/batches/done-batch-03c-unique-constraints.sql', '00051', 'unique constraints'),
        ('reconciliation/migrations/batches/done-batch-03d-additional-unique.sql', '00051', 'additional constraints'),
        ('reconciliation/migrations/batches/done-batch-04-constraints-fixed.sql', '00051', 'foreign keys'),
        ('reconciliation/migrations/batches/done-batch-05-functions-complete.sql', '00053', '27 functions'),
        ('reconciliation/migrations/batches/done-batch-06-triggers-fixed.sql', '00053', 'triggers'),
        ('reconciliation/migrations/batches/done-batch-07-indexes.sql', '00053', 'indexes'),
        ('reconciliation/migrations/batches/done-batch-08-rls-corrected.sql', '00053', 'RLS policies'),
    ]
    
    count = 0
    for filepath, session, description in done_files:
        if os.path.exists(filepath):
            batch_name = os.path.basename(filepath).replace('done-', '').replace('.sql', '')
            yaml = f'''---
session: "{session}"
type: "migration-deployed"
status: "applied"
created: "2025-08-27"
title: "Deployed Migration: {batch_name}"
purpose: "Applied database migration - {description}"
topics: ["database", "migration", "reality", "deployed"]
priority: "P0"
domain: "reality"
reality_type: "deployed-migration"
deployment_status: "production"
verified: true
---
'''
            if add_yaml_to_file(filepath, yaml):
                count += 1
        else:
            print(f"  ⚠️ File not found: {filepath}")
    
    return count

def create_reality_index():
    """Create a comprehensive reality index."""
    print("\n📊 Creating Reality Index...")
    print("=" * 50)
    
    content = '''---
session: "00085"
type: "index"
status: "current"
created: "2025-08-27"
title: "Reality Index - Ground Truth Documentation"
purpose: "Central index for all reality vs theoretical documentation"
topics: ["reality", "index", "ground-truth", "database-state"]
priority: "P0"
domain: "reality"
---

# Reality Index - Ground Truth Documentation

**Created**: Session 00085  
**Purpose**: Make reality easily discoverable to prevent assumptions

## 🎯 Why Reality Matters

Session 85 proved that reality files can solve 37-session mysteries in minutes. The source project reality files revealed that `add_new_user` function existed but wasn't triggered - something code inspection couldn't find.

## 📊 Reality vs Theoretical

### What is Reality?
- **Reality**: Actual state in Supabase Dashboard
- **Theoretical**: Planned state in migration files
- **Ground Truth**: What's actually deployed and running

### Key Principle
**Always check reality before making assumptions!**

## 🔍 Quick Reality Queries

```bash
# Find all reality snapshots
python3 scripts/00059-yaml-query.py --type reality-snapshot

# Find deployed migrations
python3 scripts/00059-yaml-query.py --type migration-deployed

# Find source project references
python3 scripts/00059-yaml-query.py --topic source-project

# Check current database state
python3 scripts/00059-yaml-query.py --reality_type current-state
```

## 📁 Reality Files Directory

### Current Database State (Our Project)
- `reality/00081-request-triggers.md` - Active triggers
- `reality/00081-request-functions.md` - Active functions
- `reality/00081-request-profile-table-columns.png` - Profile table structure
- `reality/00081-request-logs-api-gateway.png` - API gateway logs

### Source Project Reference
- `reality/00081-request-source-project-triggers.md` - Source triggers
- `reality/00081-request-source-project-functions.md` - Source functions
- `reality/00081-request-source-project-enums.md` - Source enums
- `reality/00081-request-source-project-profile-table-columns.png` - Source profile

### Deployed Migrations (Ground Truth)
All files with `done-` prefix represent successfully deployed migrations:
- `reconciliation/migrations/batches/done-batch-01-foundation.sql`
- `reconciliation/migrations/batches/done-batch-02-types.sql`
- `reconciliation/migrations/batches/done-batch-03-tables.sql`
- ... (12 total deployed batches)

### Schema Snapshots
- `core/config/supabase/schema-snapshot/*.json` - Point-in-time snapshots
- `reconciliation/migrations/supabase-project.backup` - Full backup file

## 🚨 Critical Lessons

### Session 85 Discovery
- **Assumption**: Profile creation was a code issue
- **Reality Check**: Function existed but trigger wasn't attached
- **Solution Time**: 37 sessions vs 5 minutes with reality files

### Common Reality Gaps
1. **Functions without triggers** (Session 85)
2. **RLS policies not matching code** (Session 38)
3. **Table names plural vs singular** (Session 44)
4. **Cache not refreshed after migrations** (Session 85)

## 📋 Reality Verification Checklist

Before debugging any database issue:
1. [ ] Check reality request files for current state
2. [ ] Compare with source project files
3. [ ] Verify done- migrations match expectations
4. [ ] Test with actual API calls, not assumptions
5. [ ] Check PostgREST cache status

## 🔧 How to Update Reality Files

### After Dashboard Changes
1. Screenshot or export current state
2. Save to `reality/` with session prefix
3. Add YAML frontmatter with `reality_type`
4. Update this index

### Example YAML for Reality Files
```yaml
---
session: "00085"
type: "reality-snapshot"
status: "current"
reality_type: "current-state"  # or "source-reference" or "deployed-migration"
source: "supabase-dashboard"
verified_date: "2025-08-27"
---
```

## 🎯 Quick Reference

### Reality Types
- `current-state` - What's in our Supabase now
- `source-reference` - What the source project has
- `deployed-migration` - What we've successfully applied
- `point-in-time` - Historical snapshots

### File Naming Convention
- `00XXX-request-*.md` - Current database state
- `00XXX-request-source-*.md` - Source project state
- `done-*.sql` - Successfully deployed migrations
- `error-*.sql` - Failed migration attempts

## 💡 Pro Tips

1. **Reality > Code**: Database state trumps source code
2. **Screenshots Help**: Visual proof prevents debates
3. **Version Everything**: Include session numbers
4. **Query First**: Use YAML queries before manual searching
5. **Trust Verification**: "Trust but verify" - always check

---

**Remember**: The 37-session auth mystery was solved in 5 minutes by checking reality files. Always check ground truth first!
'''
    
    filepath = 'reality/REALITY-INDEX.md'
    with open(filepath, 'w') as f:
        f.write(content)
    
    print(f"  ✅ Created {filepath}")
    return 1

def main():
    """Main execution."""
    print("=" * 60)
    print("  REALITY FILES YAML ENHANCEMENT")
    print("  Session 00085 - Making Ground Truth Discoverable")
    print("=" * 60)
    
    # Process files
    reality_count = process_reality_files()
    migration_count = process_done_migrations()
    index_count = create_reality_index()
    
    # Summary
    total = reality_count + migration_count + index_count
    print("\n" + "=" * 60)
    print(f"✅ YAML ENHANCEMENT COMPLETE")
    print(f"  Reality files updated: {reality_count}")
    print(f"  Migration files updated: {migration_count}")
    print(f"  Index files created: {index_count}")
    print(f"  Total files processed: {total}")
    print("=" * 60)
    
    print("\n🔍 Test the enhancement:")
    print("python3 scripts/00059-yaml-query.py --type reality-snapshot")
    print("python3 scripts/00059-yaml-query.py --type migration-deployed")
    print("python3 scripts/00059-yaml-query.py --domain reality")

if __name__ == "__main__":
    main()