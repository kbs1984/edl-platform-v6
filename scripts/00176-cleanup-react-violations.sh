#!/bin/bash
# 00176-cleanup-react-violations.sh
# Session 176 - Teams & Social Features Cleanup

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Session 176 - Teams & Social Features Cleanup"
echo "Removing React violations and archiving legacy code"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

ARCHIVE_DIR="archive/legacy-react-work/session-176-violations"
TEAMS_AREA="reconciliation/active-work/dashboard/src/components/team"
PROFILE_AREA="reconciliation/active-work/dashboard/src/components/profile"
HOOKS_AREA="reconciliation/active-work/dashboard/src/hooks"
CONTEXTS_AREA="reconciliation/active-work/dashboard/src/contexts"

# Create archive directory
mkdir -p $ARCHIVE_DIR/{components,hooks,contexts,pages}

echo ""
echo "📊 Pre-cleanup Analysis:"
echo "========================"

# Count violations before cleanup
TOTAL_VIOLATIONS=$(grep -r "use client\|useState\|useEffect\|useContext" \
  $TEAMS_AREA $PROFILE_AREA $HOOKS_AREA/*team* $HOOKS_AREA/*profile* $CONTEXTS_AREA/*team* 2>/dev/null | \
  grep -v node_modules | wc -l || echo 0)

echo "Found $TOTAL_VIOLATIONS React violations in Teams & Social areas"

echo ""
echo "📁 Files to Archive:"
echo "===================="

# List files that will be archived
echo "Team Components:"
ls -1 $TEAMS_AREA/*.tsx 2>/dev/null || echo "  No team components found"

echo ""
echo "Profile Components:"
ls -1 $PROFILE_AREA/*.tsx 2>/dev/null || echo "  No profile components found"

echo ""
echo "Related Hooks:"
ls -1 $HOOKS_AREA/*team* $HOOKS_AREA/*profile* 2>/dev/null || echo "  No related hooks found"

echo ""
echo "Related Contexts:"
ls -1 $CONTEXTS_AREA/*team* 2>/dev/null || echo "  No related contexts found"

echo ""
echo "🚀 Starting Cleanup:"
echo "===================="

# Archive team components
if [ -d "$TEAMS_AREA" ]; then
  echo "Archiving team components..."
  for file in $TEAMS_AREA/*.tsx; do
    if [ -f "$file" ]; then
      filename=$(basename "$file")
      mv "$file" "$ARCHIVE_DIR/components/team-$filename"
      echo "  ✓ Archived: $filename"
    fi
  done
fi

# Archive profile components
if [ -d "$PROFILE_AREA" ]; then
  echo "Archiving profile components..."
  for file in $PROFILE_AREA/*.tsx; do
    if [ -f "$file" ]; then
      filename=$(basename "$file")
      mv "$file" "$ARCHIVE_DIR/components/profile-$filename"
      echo "  ✓ Archived: $filename"
    fi
  done
fi

# Archive related hooks
echo "Archiving related hooks..."
for pattern in "team" "profile"; do
  for file in $HOOKS_AREA/*$pattern*; do
    if [ -f "$file" ]; then
      filename=$(basename "$file")
      mv "$file" "$ARCHIVE_DIR/hooks/$filename"
      echo "  ✓ Archived: $filename"
    fi
  done
done

# Archive team context
if [ -f "$CONTEXTS_AREA/team-context.tsx" ]; then
  echo "Archiving team context..."
  mv "$CONTEXTS_AREA/team-context.tsx" "$ARCHIVE_DIR/contexts/team-context.tsx"
  echo "  ✓ Archived: team-context.tsx"
fi

# Archive team actions (if they have violations)
ACTIONS_FILE="reconciliation/active-work/dashboard/src/lib/actions/team-actions.ts"
if [ -f "$ACTIONS_FILE" ]; then
  if grep -q "use server" "$ACTIONS_FILE"; then
    echo "  ℹ️  team-actions.ts uses 'use server' - keeping in place"
  else
    echo "Archiving team actions..."
    mv "$ACTIONS_FILE" "$ARCHIVE_DIR/team-actions.ts"
    echo "  ✓ Archived: team-actions.ts"
  fi
fi

# Clean up empty directories
rmdir $TEAMS_AREA 2>/dev/null || true
rmdir $PROFILE_AREA 2>/dev/null || true

echo ""
echo "📋 Creating Cleanup Log:"
echo "========================"

# Document what was removed
cat > $ARCHIVE_DIR/CLEANUP-LOG.md << EOF
# Session 176 - Teams & Social Features Cleanup Log
Date: $(date)

## Summary
- Total React violations found: $TOTAL_VIOLATIONS
- Archive location: $ARCHIVE_DIR

## Archived Files

### Team Components
$(ls -la $ARCHIVE_DIR/components/team-* 2>/dev/null | awk '{print "- " $9 " (" $5 " bytes)"}' || echo "None")

### Profile Components
$(ls -la $ARCHIVE_DIR/components/profile-* 2>/dev/null | awk '{print "- " $9 " (" $5 " bytes)"}' || echo "None")

### Hooks
$(ls -la $ARCHIVE_DIR/hooks/ 2>/dev/null | grep -v "^total" | awk 'NR>1 {print "- " $9 " (" $5 " bytes)"}' || echo "None")

### Contexts
$(ls -la $ARCHIVE_DIR/contexts/ 2>/dev/null | grep -v "^total" | awk 'NR>1 {print "- " $9 " (" $5 " bytes)"}' || echo "None")

## Verification
Post-cleanup React violations in Teams & Social areas: 
EOF

echo "  ✓ Cleanup log created: $ARCHIVE_DIR/CLEANUP-LOG.md"

echo ""
echo "✅ Verification:"
echo "==============="

# Verify cleanup
REMAINING_VIOLATIONS=$(grep -r "use client\|useState\|useEffect\|useContext" \
  reconciliation/active-work/dashboard/src/components/*team* \
  reconciliation/active-work/dashboard/src/components/*profile* 2>/dev/null | \
  grep -v node_modules | grep -v ".next" | wc -l || echo 0)

echo "Remaining violations in Teams & Social areas: $REMAINING_VIOLATIONS"

# Append to cleanup log
echo "$REMAINING_VIOLATIONS" >> $ARCHIVE_DIR/CLEANUP-LOG.md

if [ "$REMAINING_VIOLATIONS" -eq 0 ]; then
  echo ""
  echo "✅ SUCCESS: All React violations cleaned from Teams & Social areas!"
  echo ""
  echo "Next steps:"
  echo "1. Implement team-card recipe with Server Components"
  echo "2. Implement team-invite recipe with Server Components"
  echo "3. Implement profile-card recipe with Server Components"
else
  echo ""
  echo "⚠️  WARNING: Some violations remain. Please investigate:"
  grep -r "use client\|useState\|useEffect\|useContext" \
    reconciliation/active-work/dashboard/src/components/*team* \
    reconciliation/active-work/dashboard/src/components/*profile* 2>/dev/null | \
    grep -v node_modules | grep -v ".next" | head -5
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Cleanup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"