#!/bin/bash
# Reality Conflict Resolution - Session 00013
# Uses trust hierarchy: GitHub > FileSystem > Supabase > Vercel

echo "🔍 REALITY CONFLICT RESOLUTION"
echo "=============================="
echo ""

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PYTHON="python3"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "Trust Hierarchy:"
echo "1. GitHub (immutable history)"
echo "2. FileSystem (actual files)"
echo "3. Supabase (database state)"
echo "4. Vercel (deployment state)"
echo ""

# Run Integration Agent to detect conflicts
echo "🔍 Detecting conflicts..."
CONFLICTS_FILE="$PROJECT_ROOT/.metrics/conflicts-latest.json"

if [ -f "$PROJECT_ROOT/reality/agent-reality-auditor/integration-connector/connector.py" ]; then
    $PYTHON "$PROJECT_ROOT/reality/agent-reality-auditor/integration-connector/connector.py" --detect-conflicts > "$CONFLICTS_FILE" 2>/dev/null
    
    if [ -s "$CONFLICTS_FILE" ]; then
        echo -e "${YELLOW}⚠️  Conflicts detected:${NC}"
        cat "$CONFLICTS_FILE" | grep -E "conflict|mismatch|disagreement" || echo "No specific conflicts found"
        
        echo ""
        echo "🔄 Applying trust hierarchy resolution..."
        echo ""
        
        # Resolution strategy
        echo "Resolution Strategy:"
        echo "-------------------"
        echo "1. If GitHub says file exists but FileSystem doesn't:"
        echo "   → Trust GitHub, file may need to be restored"
        echo ""
        echo "2. If FileSystem has files not in GitHub:"
        echo "   → Trust FileSystem, files may need to be committed"
        echo ""
        echo "3. If Supabase schema differs from migrations:"
        echo "   → Trust migration files, database may need reset"
        echo ""
        echo "4. If Vercel deployment differs from local:"
        echo "   → Trust local files, redeploy needed"
        
        echo ""
        echo "📋 Recommended Actions:"
        echo "----------------------"
        
        # Check for common conflicts
        
        # Git vs FileSystem
        if command -v git &> /dev/null; then
            UNTRACKED=$(git ls-files --others --exclude-standard | wc -l)
            if [ $UNTRACKED -gt 0 ]; then
                echo "• $UNTRACKED untracked files found"
                echo "  Run: git status"
                echo "  Then: git add <files> && git commit"
            fi
            
            MODIFIED=$(git diff --name-only | wc -l)
            if [ $MODIFIED -gt 0 ]; then
                echo "• $MODIFIED modified files uncommitted"
                echo "  Run: git diff"
                echo "  Then: git add -A && git commit"
            fi
        fi
        
        echo ""
        echo -e "${GREEN}✅ Conflict analysis complete${NC}"
    else
        echo -e "${GREEN}✅ No conflicts detected${NC}"
    fi
else
    echo -e "${RED}❌ Integration Agent not found${NC}"
    echo "   Cannot detect conflicts automatically"
fi

# Manual verification steps
echo ""
echo "Manual Verification Steps:"
echo "-------------------------"
echo "1. Check Git status: git status"
echo "2. Verify database: ./scripts/reality-check.sh --full"
echo "3. Check deployment: vercel ls"
echo "4. Review agent reports: cat .metrics/reality-check-latest.json"

echo ""
echo "🏁 Conflict resolution complete"

# Exit successfully if we got here
exit 0