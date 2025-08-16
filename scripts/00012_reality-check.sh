#!/bin/bash
# Session 00012: Reality Check Protocol
# Purpose: Establish reality baseline for every session
# Usage: ./reality-check.sh [--quick|--full]

set -e  # Exit on any error

echo "🔍 REALITY CHECK PROTOCOL v1.0"
echo "=============================="
echo "Session: $(date +%Y-%m-%d)"
echo ""

MODE="${1:---full}"
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PYTHON="python3"

# Load credentials if available
if [ -f "$PROJECT_ROOT/.env" ]; then
    export $(cat "$PROJECT_ROOT/.env" | grep -v '^#' | xargs)
fi

# Quick mode - essential agents only
if [ "$MODE" == "--quick" ]; then
    echo "⚡ QUICK MODE - Essential agents only"
    echo ""
    
    echo "📁 FileSystem Reality Agent..."
    $PYTHON "$PROJECT_ROOT/reality/agent-reality-auditor/filesystem-connector/connector.py" 2>/dev/null || echo "  ⚠️ FileSystem Agent unavailable"
    
    echo "🔗 Integration Reality Agent..."
    $PYTHON "$PROJECT_ROOT/reality/agent-reality-auditor/integration-connector/connector.py" 2>/dev/null || echo "  ⚠️ Integration Agent unavailable"
    
    echo ""
    echo "✅ Quick reality check complete"
    exit 0
fi

# Full mode - all agents, all checks
echo "🔬 FULL MODE - Comprehensive reality check"
echo ""

# Track results
AGENTS_RUN=0
AGENTS_FAILED=0
CONSENSUS_SCORE=0

# 1. FileSystem Reality Agent
echo "📁 FileSystem Reality Agent..."
if $PYTHON "$PROJECT_ROOT/reality/agent-reality-auditor/filesystem-connector/connector.py" 2>/dev/null; then
    echo "  ✅ FileSystem scan complete"
    ((AGENTS_RUN++))
else
    echo "  ❌ FileSystem Agent failed"
    ((AGENTS_FAILED++))
fi

# 2. GitHub Reality Agent  
echo "🐙 GitHub Reality Agent..."
if $PYTHON "$PROJECT_ROOT/reality/agent-reality-auditor/github-connector/connector.py" 2>/dev/null; then
    echo "  ✅ Repository scan complete"
    ((AGENTS_RUN++))
else
    echo "  ❌ GitHub Agent failed"
    ((AGENTS_FAILED++))
fi

# 3. Supabase Reality Agent
echo "🗄️ Supabase Reality Agent..."
if [ -n "$SUPABASE_URL" ] && [ -n "$SUPABASE_ANON_KEY" ]; then
    if SUPABASE_URL="$SUPABASE_URL" SUPABASE_ANON_KEY="$SUPABASE_ANON_KEY" \
       $PYTHON "$PROJECT_ROOT/reality/agent-reality-auditor/supabase-connector/connector.py" --level 2 2>/dev/null; then
        echo "  ✅ Database scan complete"
        ((AGENTS_RUN++))
    else
        echo "  ⚠️ Supabase Agent failed (check credentials)"
        ((AGENTS_FAILED++))
    fi
else
    echo "  ⚠️ Supabase credentials not found in environment"
    echo "     Set SUPABASE_URL and SUPABASE_ANON_KEY"
fi

# 4. Vercel Reality Agent
echo "🚀 Vercel Reality Agent..."
if [ -f "$PROJECT_ROOT/reality/agent-reality-auditor/vercel-connector/connector.py" ]; then
    if $PYTHON "$PROJECT_ROOT/reality/agent-reality-auditor/vercel-connector/connector.py" 2>/dev/null; then
        echo "  ✅ Deployment scan complete"
        ((AGENTS_RUN++))
    else
        echo "  ⚠️ Vercel Agent unavailable"
    fi
else
    echo "  ⚠️ Vercel Agent not found"
fi

# 5. Static Asset Reality Agent
echo "🎨 Static Asset Reality Agent..."
if [ -f "$PROJECT_ROOT/reality/agent-reality-auditor/static-asset-connector/connector.py" ]; then
    if $PYTHON "$PROJECT_ROOT/reality/agent-reality-auditor/static-asset-connector/connector.py" 2>/dev/null; then
        echo "  ✅ Asset scan complete"
        ((AGENTS_RUN++))
    else
        echo "  ⚠️ Static Asset Agent unavailable"
    fi
else
    echo "  ⚠️ Static Asset Agent not found"
fi

# 6. Task Reality Agent
echo "📋 Task Reality Agent..."
if [ -f "$PROJECT_ROOT/reality/agent-reality-auditor/task-connector/connector.py" ]; then
    if $PYTHON "$PROJECT_ROOT/reality/agent-reality-auditor/task-connector/connector.py" 2>/dev/null; then
        echo "  ✅ Task tracking complete"
        ((AGENTS_RUN++))
    else
        echo "  ⚠️ Task Agent unavailable"
    fi
else
    echo "  ⚠️ Task Agent not found"
fi

# 7. Integration Reality Agent (runs last, needs others)
echo "🔗 Integration Reality Agent..."
if $PYTHON "$PROJECT_ROOT/reality/agent-reality-auditor/integration-connector/connector.py" 2>/dev/null; then
    echo "  ✅ System integration verified"
    ((AGENTS_RUN++))
else
    echo "  ❌ Integration Agent failed"
    ((AGENTS_FAILED++))
fi

# Calculate consensus score
if [ $AGENTS_RUN -gt 0 ]; then
    CONSENSUS_SCORE=$((AGENTS_RUN * 100 / 7))
fi

# Summary
echo ""
echo "📊 REALITY CHECK SUMMARY"
echo "========================"
echo "Agents Run: $AGENTS_RUN/7"
echo "Agents Failed: $AGENTS_FAILED"
echo "Consensus Score: $CONSENSUS_SCORE%"

# Save metrics
METRICS_DIR="$PROJECT_ROOT/.metrics"
mkdir -p "$METRICS_DIR"
echo "{\"timestamp\": \"$(date -Iseconds)\", \"agents_run\": $AGENTS_RUN, \"consensus_score\": $CONSENSUS_SCORE}" >> "$METRICS_DIR/agent-runs.jsonl"

# Exit status based on consensus
if [ $CONSENSUS_SCORE -ge 80 ]; then
    echo "✅ Reality baseline established"
    exit 0
else
    echo "⚠️ Low consensus score - investigate failures"
    exit 1
fi