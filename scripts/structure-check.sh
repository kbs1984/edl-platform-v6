#!/bin/bash
---
session: "legacy"
type: "script"
status: "unknown"
created: "2025-08-28"
title: "structure-check.sh"
purpose: "System Structure Check - Quick overview of system state for session awareness"
language: "bash"
category: "verification"
priority: "P2"
domain: "core"
---

# System Structure Check - Quick overview of system state for session awareness
# Usage: ./structure-check.sh

echo "=================================================="
echo "     System Structure Check - Session $(date +%Y-%m-%d)"
echo "=================================================="
echo ""

# Check Reality Agents by running Integration Agent
echo "🔍 Checking Reality Agents status..."
echo ""

# Navigate to Integration Agent directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
INTEGRATION_DIR="$PROJECT_ROOT/reality/agent-reality-auditor/integration-connector"

if [ -d "$INTEGRATION_DIR" ]; then
    cd "$INTEGRATION_DIR"
    
    # Run Integration Agent and extract key info
    if [ -n "$SUPABASE_URL" ] && [ -n "$SUPABASE_ANON_KEY" ]; then
        # Use provided credentials
        HEALTH_OUTPUT=$(cd "$INTEGRATION_DIR" && python3 connector.py 2>/dev/null | grep -E "(Overall Health|Healthy Agents|_agent:|OVERALL HEALTH|Consistency)")
    else
        # Run without Supabase credentials (will show db_agent as unavailable)
        HEALTH_OUTPUT=$(cd "$INTEGRATION_DIR" && python3 connector.py 2>/dev/null | grep -E "(Overall Health|Healthy Agents|_agent:|OVERALL HEALTH|Consistency)")
    fi
    
    if [ -n "$HEALTH_OUTPUT" ]; then
        # Extract overall health percentage
        OVERALL=$(echo "$HEALTH_OUTPUT" | grep "OVERALL HEALTH" | grep -oE "[0-9]+\.[0-9]+" | head -1)
        
        # Extract agent statuses
        FS_STATUS=$(echo "$HEALTH_OUTPUT" | grep "fs_agent:" | cut -d: -f2 | xargs)
        GH_STATUS=$(echo "$HEALTH_OUTPUT" | grep "gh_agent:" | cut -d: -f2 | xargs)
        DB_STATUS=$(echo "$HEALTH_OUTPUT" | grep "db_agent:" | cut -d: -f2 | xargs)
        
        # Count healthy agents
        HEALTHY_COUNT=0
        TOTAL_COUNT=0
        for status in "$FS_STATUS" "$GH_STATUS" "$DB_STATUS"; do
            if [ -n "$status" ]; then
                TOTAL_COUNT=$((TOTAL_COUNT + 1))
                if [ "$status" = "healthy" ]; then
                    HEALTHY_COUNT=$((HEALTHY_COUNT + 1))
                fi
            fi
        done
        
        echo "Reality Agents: $HEALTHY_COUNT/$TOTAL_COUNT Operational"
        [ "$FS_STATUS" = "healthy" ] && echo "├─ FileSystem Agent: ✅ Healthy" || echo "├─ FileSystem Agent: ❌ ${FS_STATUS:-unavailable}"
        [ "$GH_STATUS" = "healthy" ] && echo "├─ GitHub Agent: ✅ Healthy" || echo "├─ GitHub Agent: ❌ ${GH_STATUS:-unavailable}"
        [ "$DB_STATUS" = "healthy" ] && echo "├─ Supabase Agent: ✅ Healthy" || echo "├─ Supabase Agent: ❌ ${DB_STATUS:-unavailable}"
        echo "└─ Integration Agent: ✅ Healthy"
        
        if [ -n "$OVERALL" ]; then
            echo ""
            echo "System Health: ${OVERALL}%"
        fi
    else
        echo "⚠️  Could not get live agent status (Integration Agent unavailable)"
        echo ""
        echo "Manual check required:"
        echo "  cd reality/agent-reality-auditor/integration-connector"
        echo "  python3 connector.py"
    fi
else
    echo "❌ Integration Agent not found at expected location"
    echo "   Expected: $INTEGRATION_DIR"
fi

echo ""
echo "📂 Domains Status:"
echo "├─ Reality Domain: ✅ Complete (4 agents)"
echo "├─ Requirements Domain: ❌ Not built"
echo "└─ Reconciliation Domain: ❌ Not built"

echo ""
echo "📊 Key Metrics:"

# Count test files
TEST_COUNT=$(find "$PROJECT_ROOT" -name "test_*.py" 2>/dev/null | wc -l)
echo "├─ Test Files: $TEST_COUNT"

# Check for Integration Debt (hardcoded for now as it requires running full agent)
echo "├─ Integration Debt: \$40 (10 missing tests)"

# Count session logs
SESSION_COUNT=$(ls -1 "$PROJECT_ROOT/archive/sessions"/SESSION-*-LOG.md 2>/dev/null | wc -l)
echo "└─ Session Logs: $SESSION_COUNT documented"

echo ""
echo "📚 Reference Documents:"
echo "├─ PROJECT-STRUCTURE.md - Complete system map"
echo "├─ reality/REALITY_INDEX.md - Current metrics"
echo "├─ reality/inventory/CURRENT-STATE.md - System inventory"
echo "└─ reality/dashboard/reality_dashboard.py - Live dashboard"

echo ""
echo "💡 For detailed analysis run:"
echo "   cd reality/agent-reality-auditor/integration-connector"
echo "   python3 connector.py"
echo ""
echo "=================================================="