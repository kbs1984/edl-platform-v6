---
session: "00027"
type: "documentation"
status: "current"
created: "2025-08-23"
title: "Session 00027: Constitutional Remediation Plan"
purpose: "Document session 00027: constitutional remediation plan"
topics: ['documentation']
priority: "P1"
domain: "core"
---

# Session 00027: Constitutional Remediation Plan
**Created**: 2025-08-18 | Hour 5
**Purpose**: Systematic plan to fix Article VII violations WITHOUT breaking system

## Current Constitutional Violations

### Summary Statistics
- **15 files** violating attribution requirements
- **1 directory** in wrong location
- **73% violation rate** for recent files
- **4+ sessions** worth of accumulated violations

## Remediation Strategy: Two-Phase Approach

### Phase 1: Document and Prepare (Session 27 - COMPLETE)
✅ Create comprehensive inventory of violations
✅ Map each file to its creating session
✅ Define correct names and locations
✅ Build remediation script (not execute)

### Phase 2: Execute and Prevent (Session 28)
- Execute remediation script in controlled manner
- Implement prevention mechanisms
- Verify all fixes successful
- Establish ongoing compliance monitoring

## Detailed Remediation Plan

### Step 1: Pre-Remediation Backup (Session 28 Start)
```bash
#!/bin/bash
# Create backup before any changes
tar -czf pre-remediation-backup-00028.tar.gz \
  CRITICAL-DISCOVERY-SUCCESS.md \
  UI-TEST-RESULTS-SESSION-17.md \
  investigation-00022/ \
  *.txt \
  SEED-*.md \
  AUTOMATION-GAPS.md
```

### Step 2: File Attribution Fixes
```bash
#!/bin/bash
# 00028-fix-attribution.sh

echo "=== Constitutional Remediation Script ==="
echo "Fixing Article VII violations from Sessions 17-26"

# Category 1: Recent files needing prefixes
echo "Fixing recent unprefixed files..."
mv CRITICAL-DISCOVERY-SUCCESS.md 00024-CRITICAL-DISCOVERY-SUCCESS.md
mv UI-TEST-RESULTS-SESSION-17.md archive/sessions/00017-UI-TEST-RESULTS.md
mv AUTOMATION-GAPS.md 00008-AUTOMATION-GAPS.md

# Category 2: Test results needing prefixes and relocation
echo "Moving test results to session archives..."
mv integration-check-session-17.txt archive/sessions/00017-integration-check.txt
mv reality-check-session-17.txt archive/sessions/00017-reality-check.txt
mv reality-check-session-17-full.txt archive/sessions/00017-reality-check-full.txt

# Category 3: Investigation directory relocation
echo "Moving investigation directory to archives..."
mv investigation-00022/ archive/sessions/00022-investigation/

# Category 4: Protocol documents to shared
echo "Organizing protocol documents..."
mkdir -p shared/protocols
mv SUPABASE-SQL-PROTOCOL.md shared/protocols/00012-SUPABASE-SQL-PROTOCOL.md
mv SEED-PROTOCOL-ENHANCEMENT-PROPOSAL.md shared/protocols/
mv SEED-READINESS-CHECKLIST.md shared/protocols/
mv SEED-RECEPTION-PROTOCOL.md shared/protocols/

# Leave these in root (they're system-wide or already prefixed)
# - RESTORATION-MASTERPLAN*.md (system-wide)
# - All INDEX files (system-wide)
# - Files already with 000XX- prefixes
# - CONSTITUTIONAL-AMENDMENT-PROPOSAL-00001.md (has number)

echo "Remediation complete!"
```

### Step 3: Verification Script
```bash
#!/bin/bash
# 00028-verify-remediation.sh

echo "=== Verifying Constitutional Compliance ==="

# Check for remaining violations
echo "Checking for unprefixed files in root..."
VIOLATIONS=$(find . -maxdepth 1 -name "*.md" -o -name "*.txt" | \
  grep -v "^\./[0-9]" | \
  grep -v "CLAUDE\|PROJECT-STRUCTURE\|INDEX\|RESTORATION-MASTERPLAN\|README\|DIRECTORY-MAP")

if [ -z "$VIOLATIONS" ]; then
  echo "✅ No violations found!"
else
  echo "❌ Remaining violations:"
  echo "$VIOLATIONS"
fi

# Verify moves successful
echo "Verifying relocations..."
[ -f "archive/sessions/00017-UI-TEST-RESULTS.md" ] && echo "✅ Session 17 test results moved"
[ -d "archive/sessions/00022-investigation" ] && echo "✅ Investigation directory moved"
[ -f "shared/protocols/00012-SUPABASE-SQL-PROTOCOL.md" ] && echo "✅ Protocols organized"
```

### Step 4: Prevention Mechanisms

#### A. Pre-commit Hook
```python
#!/usr/bin/env python3
# .git/hooks/pre-commit
"""Enforce session attribution for new files"""

import subprocess
import sys
import re

def check_files():
    # Get staged files
    result = subprocess.run(['git', 'diff', '--cached', '--name-only'], 
                          capture_output=True, text=True)
    files = result.stdout.strip().split('\n')
    
    # Exempt patterns
    exempt = ['README', 'CLAUDE', 'PROJECT-STRUCTURE', 'INDEX', 
              'RESTORATION-MASTERPLAN', 'DIRECTORY-MAP', '.git']
    
    violations = []
    for file in files:
        # Skip exempted files
        if any(pattern in file for pattern in exempt):
            continue
            
        # Check if file has session prefix
        if file.endswith(('.md', '.txt')):
            filename = file.split('/')[-1]
            if not re.match(r'^\d{5}-', filename):
                violations.append(file)
    
    if violations:
        print("❌ Constitutional Violation - Missing session prefixes:")
        for v in violations:
            print(f"  - {v}")
        print("\nAdd session prefix (00XXX-) or move to appropriate directory")
        return 1
    
    return 0

if __name__ == '__main__':
    sys.exit(check_files())
```

#### B. File Creation Wrapper
```bash
#!/bin/bash
# scripts/00028-create-file.sh
# Usage: ./create-file.sh filename.md "Content"

SESSION=$(cat .current-session 2>/dev/null || echo "00028")
FILENAME="$SESSION-$1"

echo "$2" > "$FILENAME"
echo "✅ Created: $FILENAME (with session prefix)"
```

### Step 5: Ongoing Compliance Monitoring
```bash
#!/bin/bash
# scripts/00028-monitor-compliance.sh
# Run at session start/end

echo "=== Constitutional Compliance Check ==="
echo "Session: $(date +%Y-%m-%d)"

# Count violations
VIOLATIONS=$(find . -maxdepth 1 \( -name "*.md" -o -name "*.txt" \) | \
  grep -v "^\./[0-9]" | \
  grep -cv "CLAUDE\|INDEX\|MASTERPLAN\|README\|DIRECTORY")

# Calculate compliance
TOTAL=$(find . -maxdepth 1 \( -name "*.md" -o -name "*.txt" \) | wc -l)
COMPLIANT=$((TOTAL - VIOLATIONS))
PERCENTAGE=$((COMPLIANT * 100 / TOTAL))

echo "Files checked: $TOTAL"
echo "Compliant: $COMPLIANT"
echo "Violations: $VIOLATIONS"
echo "Compliance rate: $PERCENTAGE%"

if [ $PERCENTAGE -lt 100 ]; then
  echo "⚠️ Action required: Run remediation script"
fi
```

## Execution Timeline

### Session 28 Execution Order:
1. **Backup first** (5 minutes)
2. **Run remediation script** (2 minutes)
3. **Verify success** (1 minute)
4. **Install prevention mechanisms** (10 minutes)
5. **Test prevention works** (5 minutes)
6. **Document completion** (2 minutes)

**Total time: 25 minutes to 100% compliance**

## Risk Mitigation

### Potential Risks:
1. **Broken references** - Other files might link to old names
2. **Git history confusion** - Moves look like deletions
3. **Script errors** - Might partially execute

### Mitigation Strategies:
1. **Search for references first**: `grep -r "CRITICAL-DISCOVERY"`
2. **Use git mv**: Preserves history better than mv
3. **Run in test mode first**: Add --dry-run option

## Success Criteria

### Constitutional Compliance Achieved When:
- ✅ Zero unprefixed files in root (except exempt)
- ✅ All session deliverables in archive/sessions/
- ✅ All protocols in shared/protocols/
- ✅ Pre-commit hook preventing new violations
- ✅ 100% compliance rate on monitoring

## Long-term Sustainability

### Automated Enforcement:
1. Pre-commit hooks catch violations
2. Session startup checks compliance
3. Weekly compliance reports
4. Automated remediation for common cases

### Cultural Change:
1. Attribution becomes automatic
2. Compliance built into workflow
3. Violations impossible, not just discouraged

## Return on Investment

### Current Cost:
- 15+ files violating × 5 min to fix manually = 75 minutes
- Confusion and misfiled documents = unmeasurable
- Constitutional non-compliance = system integrity risk

### After Remediation:
- 25 minutes one-time fix
- 0 minutes ongoing (automated)
- 100% constitutional compliance
- System integrity preserved

**ROI: 3x immediate, ∞ long-term**

---

*This plan fixes all Article VII violations systematically while preventing future violations through automation*