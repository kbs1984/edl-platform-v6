#!/bin/bash
# 00175-cleanup-react-violations.sh
# Session 175: Activity Runtime Engine - React Violations Cleanup

echo "╔══════════════════════════════════════════════════════════╗"
echo "║     Session 175: Activity Runtime Cleanup                 ║"
echo "║     Archiving React violations for recipe implementation  ║"
echo "╚══════════════════════════════════════════════════════════╝"

# Set archive directory for Session 169-170 violations
ARCHIVE_DIR="archive/legacy-react-work/session-169-170-activity-violations"
mkdir -p $ARCHIVE_DIR

echo ""
echo "📊 Pre-cleanup Analysis:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Count violations before cleanup
VIOLATIONS_BEFORE=$(grep -r "use client\|useState\|useEffect" reconciliation/active-work/dashboard/src/components/activities/ 2>/dev/null | grep -v node_modules | wc -l)
echo "  Violations found: $VIOLATIONS_BEFORE React hooks/client directives"

# List files to be archived
echo ""
echo "🗂️  Files to archive:"
find reconciliation/active-work/dashboard/src/components/activities/ -name "*.tsx" -o -name "*.jsx" | \
    grep -v node_modules | \
    while read file; do
        echo "  • $(basename $file)"
    done

echo ""
echo "🚀 Starting cleanup..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Archive activity-related components
echo "  Moving activity components..."
find reconciliation/active-work/dashboard/src/components/activities/ -name "*.tsx" -o -name "*.jsx" | \
    grep -v node_modules | \
    xargs -I {} mv {} $ARCHIVE_DIR/

# Also check for any activity-related files in other locations
echo "  Checking for additional activity files..."
find reconciliation/active-work/admin-dashboard/components/ -name "*session*.tsx" -o -name "*activity*.tsx" 2>/dev/null | \
    grep -v node_modules | \
    xargs -I {} mv {} $ARCHIVE_DIR/ 2>/dev/null

# Archive activity actions if they exist
if [ -d "reconciliation/active-work/dashboard/src/lib/actions" ]; then
    find reconciliation/active-work/dashboard/src/lib/actions/ -name "*activity*.ts" | \
        xargs -I {} mv {} $ARCHIVE_DIR/ 2>/dev/null
fi

# Document what was removed
echo ""
echo "📝 Creating cleanup log..."
cat > $ARCHIVE_DIR/CLEANUP-LOG.md << EOF
# Session 175 - Activity Runtime Cleanup Log
Date: $(date)

## Files Archived from Activity Components

The following files were moved from reconciliation/active-work/ to this archive:

### Activity Components
$(ls -la $ARCHIVE_DIR/*.tsx 2>/dev/null | awk '{print "- " $9}')

### Activity Actions
$(ls -la $ARCHIVE_DIR/*.ts 2>/dev/null | grep -v .tsx | awk '{print "- " $9}')

## Reason for Cleanup
These files contained React client-side violations (useState, useEffect, 'use client').
They will be replaced with recipe-based Server Component implementations.

## Recipes to Use
- session-flow
- assignment-submission  
- deadline-timer
- question-submission

## Session Information
- Session: 175
- Focus: Activity Runtime Engine
- Strategy: Recipe-based implementation without client-side React
EOF

echo "  ✓ Cleanup log created: $ARCHIVE_DIR/CLEANUP-LOG.md"

# Verify cleanup
echo ""
echo "✅ Cleanup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Post-cleanup Verification:"

# Check remaining violations in activities area
VIOLATIONS_AFTER=$(grep -r "use client\|useState\|useEffect" reconciliation/active-work/dashboard/src/components/activities/ 2>/dev/null | \
    grep -v node_modules | wc -l)

echo "  Remaining violations in activities/: $VIOLATIONS_AFTER"

# List archived files
ARCHIVED_COUNT=$(ls -1 $ARCHIVE_DIR/*.tsx $ARCHIVE_DIR/*.ts 2>/dev/null | wc -l)
echo "  Files archived: $ARCHIVED_COUNT"

# Success metrics
echo ""
echo "🎯 Success Metrics:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  1. Violations Found: $VIOLATIONS_BEFORE React files in activities area"
echo "  2. Cleanup Complete: Moved $ARCHIVED_COUNT files to $ARCHIVE_DIR"
echo "  3. Recipe Implementation: Ready to use [session-flow, assignment-submission, deadline-timer, question-submission]"
echo "  4. Validation: grep -r 'use client' activities/ returns $VIOLATIONS_AFTER"

if [ $VIOLATIONS_AFTER -eq 0 ]; then
    echo ""
    echo "  ✅ CLEANUP SUCCESSFUL - Ready for recipe-based implementation!"
else
    echo ""
    echo "  ⚠️  WARNING: Some violations remain. Manual review needed."
fi

echo ""
echo "📁 Archive location: $ARCHIVE_DIR"
echo ""