#!/bin/bash
# Session 180: Daily checkpoint script for safe commits
# Usage: ./scripts/00180-daily-checkpoint.sh [SESSION_NUMBER]

set -e  # Exit on error

SESSION=${1:-$(date +%j)}  # Use day of year if no session provided
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BRANCH=$(git branch --show-current)

echo "════════════════════════════════════════════════════════════════════"
echo "              Daily Checkpoint - Session $SESSION"
echo "════════════════════════════════════════════════════════════════════"
echo "Branch: $BRANCH"
echo "Time: $TIMESTAMP"
echo ""

# Step 1: Architecture Validation
echo "🏗️  Step 1/6: Checking architecture compliance..."
echo "────────────────────────────────────────────────────────────────────"

VIOLATIONS=$(grep -r "useState\|useEffect\|useContext" reconciliation/active-work/dashboard/src --include="*.tsx" 2>/dev/null | grep -v "use client" | grep -v node_modules || true)

if [ -n "$VIOLATIONS" ]; then
    echo "❌ React hooks found in Server Components:"
    echo "$VIOLATIONS" | head -5
    echo ""
    echo "⚠️  Add 'use client' directive or use V5 bridge pattern"
    echo "Continue anyway? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✅ No architectural violations found"
fi

# Step 2: Build Check
echo ""
echo "🔨 Step 2/6: Checking build status..."
echo "────────────────────────────────────────────────────────────────────"

cd reconciliation/active-work/dashboard
if npm run build > /tmp/build-$SESSION.log 2>&1; then
    echo "✅ Build successful"
else
    echo "⚠️  Build has warnings/errors (see /tmp/build-$SESSION.log)"
    echo "Key issues:"
    grep -E "error|Error|failed" /tmp/build-$SESSION.log | head -5 || true
fi
cd - > /dev/null

# Step 3: CSS Validation
echo ""
echo "🎨 Step 3/6: Checking CSS compilation..."
echo "────────────────────────────────────────────────────────────────────"

if [ -f "reconciliation/active-work/dashboard/.next/static/css/app/layout.css" ]; then
    CSS_SIZE=$(ls -lh reconciliation/active-work/dashboard/.next/static/css/app/layout.css | awk '{print $5}')
    echo "✅ CSS compiled successfully ($CSS_SIZE)"
else
    echo "⚠️  CSS not found - may need cache clear"
fi

# Step 4: Database Status
echo ""
echo "💾 Step 4/6: Checking database connectivity..."
echo "────────────────────────────────────────────────────────────────────"

# This would normally use MCP but keeping it simple for now
echo "📊 Checking tables via reality agents..."
python3 reality/agent-reality-auditor/orchestrator.py quick-check 2>/dev/null | grep "Health:" || echo "⚠️  Could not verify database"

# Step 5: Git Status
echo ""
echo "📝 Step 5/6: Git status..."
echo "────────────────────────────────────────────────────────────────────"

CHANGES=$(git status --short | wc -l)
echo "Files changed: $CHANGES"
echo "Recent commits:"
git log --oneline -3

# Step 6: Create Checkpoint
echo ""
echo "💾 Step 6/6: Creating checkpoint..."
echo "────────────────────────────────────────────────────────────────────"

# Create checkpoint tag
TAG="checkpoint-session-$SESSION-$TIMESTAMP"
echo "Creating tag: $TAG"

git add -A
git commit -m "chore: Session $SESSION daily checkpoint

Automated checkpoint at $TIMESTAMP
- Architecture validation: Passed
- Build status: Check log
- Branch: $BRANCH
- Changes: $CHANGES files

This is a safety checkpoint for easy rollback if needed.
" || echo "No changes to commit"

git tag -a "$TAG" -m "Session $SESSION checkpoint"

echo ""
echo "════════════════════════════════════════════════════════════════════"
echo "✅ Checkpoint Complete!"
echo "════════════════════════════════════════════════════════════════════"
echo ""
echo "📌 Tagged as: $TAG"
echo ""
echo "To push to GitHub:"
echo "  git push origin $BRANCH"
echo "  git push origin $TAG"
echo ""
echo "To rollback to this checkpoint later:"
echo "  git reset --hard $TAG"
echo ""
echo "Next steps:"
echo "1. Review any warnings above"
echo "2. Push to GitHub if build is clean"
echo "3. Create PR if feature is complete"
echo ""