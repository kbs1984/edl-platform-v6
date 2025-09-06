#!/bin/bash
# Quick Context Loader for Future Sessions
# Created by Session 136 to help future sessions understand the mission

set -e

echo "📚 EDL Platform v6 - Quick Context Loader"
echo "=========================================="
echo ""

# Show mission
echo "🎯 MISSION: Build the remaining 80% of EDL Platform v6"
echo "   Status: 20% complete (foundation from truth-seed)"
echo "   Remaining: 275 user stories across 3 priority levels"
echo ""

# Show current priorities
echo "🔥 CURRENT PRIORITIES (Work on these in order):"
echo "----------------------------------------"
echo "P0.1 - Guardian System     🔴 Fix empty .insert({}) at line 17"
echo "P0.2 - Friends Real-Time   🟡 Add WebSocket sync (partial exists)"
echo "P0.3 - Activity Runtime    🔴 50 stories, no infrastructure yet"
echo ""

# Show enhanced workflow availability
echo "⚡ MCP ENHANCED WORKFLOW (4-6x faster):"
echo "----------------------------------------"
echo "✅ AI Planning:      ./scripts/00136-enhanced-session-start.sh [SESSION]"
echo "✅ Pattern Research: python3 scripts/00136-create-informed-test.py [feature]"
echo "✅ Auto PR:         python3 scripts/00136-auto-pr.py '[Feature]' [SESSION]"
echo ""

# Show key files
echo "📋 ESSENTIAL DOCUMENTS:"
echo "----------------------------------------"
echo "1. Mission & Priorities: reconciliation/00136-MISSION-AND-PRIORITIES.md"
echo "2. MCP Workflow:        reconciliation/00136-MCP-ENHANCED-WORKFLOW-INTEGRATION.md"
echo "3. Quick Commands:      .claude/commands/use-mcp-enhanced-workflow.md"
echo "4. Previous Handoff:    archive/sessions/SESSION-*-HANDOFF.md"
echo ""

# Show running services
echo "🚀 SERVICE STATUS:"
echo "----------------------------------------"
if lsof -i:3000 > /dev/null 2>&1; then
    echo "✅ Auth Gateway running on port 3000"
else
    echo "🔴 Auth Gateway NOT running (cd reconciliation/active-work/auth-gateway && npm run dev)"
fi

if lsof -i:3001 > /dev/null 2>&1; then
    echo "✅ Dashboard running on port 3001"
else
    echo "🔴 Dashboard NOT running (cd reconciliation/active-work/dashboard && npm run dev)"
fi
echo ""

# Show orchestrator health
echo "🏥 SYSTEM HEALTH:"
echo "----------------------------------------"
if [ -f "/tmp/orchestrator-report.json" ]; then
    HEALTH=$(python3 -c "import json; data = json.load(open('/tmp/orchestrator-report.json')); print(data.get('results', {}).get('health_check', {}).get('overall_health', 'Unknown'))")
    echo "Overall Health: ${HEALTH}%"
else
    echo "No recent orchestrator report. Run: python3 reality/agent-reality-auditor/orchestrator.py"
fi
echo ""

# Quick start guide
echo "🎮 QUICK START FOR YOUR SESSION:"
echo "----------------------------------------"
echo "1. Run enhanced session start (creates AI plan):"
echo "   ./scripts/00136-enhanced-session-start.sh $(date +%j)"
echo ""
echo "2. Review the mission document:"
echo "   cat reconciliation/00136-MISSION-AND-PRIORITIES.md"
echo ""
echo "3. Start with P0.1 (Guardian System) unless completed"
echo ""
echo "4. Use MCP Enhanced Workflow for 4-6x speed"
echo ""

# Show git status summary
echo "📊 GIT STATUS:"
echo "----------------------------------------"
BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
CHANGES=$(git status --porcelain 2>/dev/null | wc -l)
echo "Current branch: $BRANCH"
echo "Uncommitted changes: $CHANGES files"
echo ""

echo "=========================================="
echo "✅ Context loaded! You know:"
echo "   - What we're building (80% of platform)"
echo "   - Current priorities (Guardian → Friends → Activity)"
echo "   - Enhanced workflow available (4-6x faster)"
echo "   - Where to find documentation"
echo ""
echo "💡 TIP: Always start with the enhanced session script for AI planning!"
echo "=========================================="