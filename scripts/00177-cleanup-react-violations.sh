#!/bin/bash
# Session 177 - Cleanup React violations in gamification/achievements
# Part of unified cleanup protocol following Session 174's discovery

set -e

ARCHIVE_DIR="archive/legacy-react-work/session-168-violations"
AREAS="dashboard/src/components/achievements dashboard/src/components/emcoin dashboard/src/components/addiction"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "╔══════════════════════════════════════════════════════════╗"
echo "║     Session 177 - React Violations Cleanup                ║"
echo "║     Target: Gamification & Achievements System            ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Create archive directory
mkdir -p $ARCHIVE_DIR

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 1/5: Scanning for violations..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Count violations before cleanup
TOTAL_VIOLATIONS=0
for area in $AREAS; do
    if [ -d "reconciliation/active-work/$area" ]; then
        COUNT=$(find "reconciliation/active-work/$area" \( -name "*.tsx" -o -name "*.jsx" \) 2>/dev/null | wc -l)
        echo "  • $area: $COUNT React files"
        TOTAL_VIOLATIONS=$((TOTAL_VIOLATIONS + COUNT))
    fi
done

echo ""
echo "Total violations found: $TOTAL_VIOLATIONS React files"
echo ""

if [ $TOTAL_VIOLATIONS -eq 0 ]; then
    echo "✅ No React violations found. Area is clean!"
    exit 0
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 2/5: Archiving violating files..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Archive achievement components
if [ -d "reconciliation/active-work/dashboard/src/components/achievements" ]; then
    echo "  Archiving achievement components..."
    mkdir -p "$ARCHIVE_DIR/achievements"
    find reconciliation/active-work/dashboard/src/components/achievements \( -name "*.tsx" -o -name "*.jsx" \) -exec mv {} "$ARCHIVE_DIR/achievements/" \; 2>/dev/null || true
fi

# Archive emcoin components
if [ -d "reconciliation/active-work/dashboard/src/components/emcoin" ]; then
    echo "  Archiving emcoin components..."
    mkdir -p "$ARCHIVE_DIR/emcoin"
    find reconciliation/active-work/dashboard/src/components/emcoin \( -name "*.tsx" -o -name "*.jsx" \) -exec mv {} "$ARCHIVE_DIR/emcoin/" \; 2>/dev/null || true
fi

# Archive addiction components
if [ -d "reconciliation/active-work/dashboard/src/components/addiction" ]; then
    echo "  Archiving addiction components..."
    mkdir -p "$ARCHIVE_DIR/addiction"
    find reconciliation/active-work/dashboard/src/components/addiction \( -name "*.tsx" -o -name "*.jsx" \) -exec mv {} "$ARCHIVE_DIR/addiction/" \; 2>/dev/null || true
fi

# Also archive the test-addiction app route if it exists
if [ -d "reconciliation/active-work/dashboard/src/app/test-addiction" ]; then
    echo "  Archiving test-addiction route..."
    mkdir -p "$ARCHIVE_DIR/test-routes"
    mv reconciliation/active-work/dashboard/src/app/test-addiction "$ARCHIVE_DIR/test-routes/" 2>/dev/null || true
fi

echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 3/5: Documenting cleanup..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Create cleanup log
cat > "$ARCHIVE_DIR/CLEANUP-LOG-$TIMESTAMP.md" << EOF
# Session 177 - React Violations Cleanup Log
Generated: $(date)

## Summary
- **Session**: 177 (Gamification & Achievements)
- **Focus**: Achievement system built by Session 168
- **Total Violations**: $TOTAL_VIOLATIONS React files
- **Action**: Archived to $ARCHIVE_DIR

## Archived Files
$(ls -la $ARCHIVE_DIR 2>/dev/null | grep -v "^total" | grep -v "CLEANUP-LOG")

## Files by Category

### Achievement Components
$(ls -la $ARCHIVE_DIR/achievements 2>/dev/null | grep -E "\.(tsx|jsx)$" || echo "None found")

### EmCoin Components  
$(ls -la $ARCHIVE_DIR/emcoin 2>/dev/null | grep -E "\.(tsx|jsx)$" || echo "None found")

### Addiction Components
$(ls -la $ARCHIVE_DIR/addiction 2>/dev/null | grep -E "\.(tsx|jsx)$" || echo "None found")

## Next Steps
1. Rebuild using server-side recipes:
   - addiction-bar recipe
   - badge-display recipe
   - achievement-notification recipe
2. Use Server Components only (no 'use client')
3. Follow v5 patterns from reconciliation/00138-V5-INTEGRATION-SPECIFICATIONS.md
EOF

echo "  ✓ Cleanup log created"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 4/5: Verifying cleanup..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Verify no remaining violations
REMAINING_VIOLATIONS=0
for area in $AREAS; do
    if [ -d "reconciliation/active-work/$area" ]; then
        COUNT=$(grep -r "use client\|useState\|useEffect" "reconciliation/active-work/$area" 2>/dev/null | grep -v node_modules | wc -l)
        if [ $COUNT -gt 0 ]; then
            echo "  ⚠️  $area: $COUNT remaining violations"
            REMAINING_VIOLATIONS=$((REMAINING_VIOLATIONS + COUNT))
        else
            echo "  ✓ $area: Clean"
        fi
    fi
done

echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 5/5: Creating recipe implementation stubs..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Create directory structure for new server components
mkdir -p reconciliation/active-work/dashboard/src/components/server/achievements
mkdir -p reconciliation/active-work/dashboard/src/components/server/emcoin
mkdir -p reconciliation/active-work/dashboard/src/components/server/addiction

# Create placeholder for recipe implementation tracking
cat > "reconciliation/active-work/dashboard/src/components/server/RECIPE-IMPLEMENTATION.md" << EOF
# Recipe Implementation Plan - Session 177

## Required Recipes (from recipes/)
1. addiction-bar.tsx - Addiction mechanics display
2. badge-display.tsx - Achievement badges
3. achievement-notification.tsx - Achievement popups

## Implementation Strategy
- Use Server Components only
- Follow v5 patterns from reconciliation/00138-V5-INTEGRATION-SPECIFICATIONS.md
- EmCoin integration per specs
- No client-side state management

## Status
- [ ] addiction-bar implemented
- [ ] badge-display implemented  
- [ ] achievement-notification implemented
- [ ] EmCoin display integrated
- [ ] Database queries via server actions
EOF

echo "  ✓ Recipe implementation structure created"
echo ""

echo "╔══════════════════════════════════════════════════════════╗"
echo "║                   CLEANUP COMPLETE                        ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "📊 Success Metrics:"
echo "  1. Violations Found: $TOTAL_VIOLATIONS React files"
echo "  2. Cleanup Complete: Moved to $ARCHIVE_DIR"
echo "  3. Recipe Implementation: Ready in reconciliation/active-work/dashboard/src/components/server/"
echo "  4. Remaining Violations: $REMAINING_VIOLATIONS"
echo ""

if [ $REMAINING_VIOLATIONS -eq 0 ]; then
    echo "✅ All React violations cleaned successfully!"
else
    echo "⚠️  Some violations remain. Manual review needed."
fi

echo ""
echo "Next: Implement server-side recipes following the plan in:"
echo "reconciliation/active-work/dashboard/src/components/server/RECIPE-IMPLEMENTATION.md"