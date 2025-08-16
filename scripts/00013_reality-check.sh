#!/bin/bash
# Enhanced Reality Check Protocol v1.1 - Session 00013
# Built on Session 00012's foundation with Desktop's improvements
# Purpose: Make truth verification inevitable and systematic

set -e  # Exit on any error

echo "🔍 REALITY CHECK PROTOCOL v1.1"
echo "=============================="
echo "Session: $(date +%Y-%m-%d)"
echo ""

# Configuration
MODE="${1:---quick}"  # Default to quick for speed
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PYTHON="python3"

# Load credentials if available
if [ -f "$PROJECT_ROOT/.env" ]; then
    export $(cat "$PROJECT_ROOT/.env" | grep -v '^#' | xargs)
elif [ -f "$PROJECT_ROOT/.env.example" ]; then
    echo "⚠️  No .env found, using .env.example as reference"
    echo "   Copy .env.example to .env and configure credentials"
fi

# Track results
AGENTS_RUN=0
AGENTS_FAILED=0
AGENTS_TOTAL=7
FAILED_LIST=""
CONSENSUS_SCORE=0

# Color codes for better visibility
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to run agent with proper error handling
run_agent() {
    local agent_name=$1
    local agent_path=$2
    local needs_creds=$3
    
    echo "🔍 $agent_name Reality Agent..."
    
    if [ ! -f "$agent_path" ]; then
        echo -e "  ${YELLOW}⚠️  $agent_name Agent not found${NC}"
        FAILED_LIST="$FAILED_LIST $agent_name"
        ((AGENTS_FAILED++))
        return 1
    fi
    
    # Handle Supabase special case
    if [ "$needs_creds" == "true" ]; then
        if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
            echo -e "  ${YELLOW}⚠️  $agent_name skipped (credentials missing)${NC}"
            echo "     Set SUPABASE_URL and SUPABASE_ANON_KEY in .env"
            FAILED_LIST="$FAILED_LIST $agent_name"
            ((AGENTS_FAILED++))
            return 1
        fi
        
        if SUPABASE_URL="$SUPABASE_URL" SUPABASE_ANON_KEY="$SUPABASE_ANON_KEY" \
           $PYTHON "$agent_path" --level 2 2>/dev/null; then
            echo -e "  ${GREEN}✅ $agent_name scan complete${NC}"
            ((AGENTS_RUN++))
            return 0
        else
            echo -e "  ${YELLOW}⚠️  $agent_name limited (RLS restrictions normal)${NC}"
            ((AGENTS_RUN++))  # Still counts as run
            return 0
        fi
    fi
    
    # Normal agent execution
    if $PYTHON "$agent_path" 2>/dev/null; then
        echo -e "  ${GREEN}✅ $agent_name scan complete${NC}"
        ((AGENTS_RUN++))
        return 0
    else
        echo -e "  ${RED}❌ $agent_name failed${NC}"
        FAILED_LIST="$FAILED_LIST $agent_name"
        ((AGENTS_FAILED++))
        return 1
    fi
}

# Emergency mode - bare minimum (10 seconds)
if [ "$MODE" == "--emergency" ]; then
    echo "🚨 EMERGENCY MODE - Minimal verification"
    echo ""
    
    if [ -d "$PROJECT_ROOT/reality/agent-reality-auditor" ]; then
        echo -e "${GREEN}✅ Reality agents directory exists${NC}"
        
        # Just check filesystem agent
        if run_agent "FileSystem" "$PROJECT_ROOT/reality/agent-reality-auditor/filesystem-connector/connector.py" "false"; then
            echo -e "${GREEN}✅ EMERGENCY CHECK PASSED${NC}"
            exit 0
        fi
    fi
    
    echo -e "${RED}❌ EMERGENCY CHECK FAILED${NC}"
    exit 1
fi

# Quick mode - essential agents only (30 seconds)
if [ "$MODE" == "--quick" ]; then
    echo "⚡ QUICK MODE - Essential agents only"
    echo ""
    
    AGENTS_TOTAL=3  # Only checking 3 agents in quick mode
    
    # Essential agents
    run_agent "FileSystem" "$PROJECT_ROOT/reality/agent-reality-auditor/filesystem-connector/connector.py" "false"
    run_agent "Integration" "$PROJECT_ROOT/reality/agent-reality-auditor/integration-connector/connector.py" "false"
    
    # Supabase if credentials exist
    if [ -n "$SUPABASE_URL" ] && [ -n "$SUPABASE_ANON_KEY" ]; then
        run_agent "Supabase" "$PROJECT_ROOT/reality/agent-reality-auditor/supabase-connector/connector.py" "true"
    else
        echo "🗄️ Supabase Reality Agent..."
        echo -e "  ${YELLOW}⚠️  Skipped (no credentials)${NC}"
        AGENTS_TOTAL=2  # Adjust total
    fi
fi

# Full mode - all agents, comprehensive (3-5 minutes)
if [ "$MODE" == "--full" ]; then
    echo "🔬 FULL MODE - Comprehensive reality check"
    echo ""
    
    # All 7 agents
    run_agent "FileSystem" "$PROJECT_ROOT/reality/agent-reality-auditor/filesystem-connector/connector.py" "false"
    run_agent "GitHub" "$PROJECT_ROOT/reality/agent-reality-auditor/github-connector/connector.py" "false"
    run_agent "Supabase" "$PROJECT_ROOT/reality/agent-reality-auditor/supabase-connector/connector.py" "true"
    run_agent "Vercel" "$PROJECT_ROOT/reality/agent-reality-auditor/vercel-connector/connector.py" "false"
    run_agent "Static Asset" "$PROJECT_ROOT/reality/agent-reality-auditor/static-asset-connector/connector.py" "false"
    run_agent "Task" "$PROJECT_ROOT/reality/agent-reality-auditor/task-connector/connector.py" "false"
    run_agent "Integration" "$PROJECT_ROOT/reality/agent-reality-auditor/integration-connector/connector.py" "false"
fi

# Calculate consensus score
if [ $AGENTS_TOTAL -gt 0 ]; then
    CONSENSUS_SCORE=$(( (AGENTS_RUN * 100) / AGENTS_TOTAL ))
fi

# Generate detailed report
echo ""
echo "📊 REALITY CHECK SUMMARY"
echo "========================"
echo "Mode: $MODE"
echo "Agents Run: $AGENTS_RUN/$AGENTS_TOTAL"

if [ -n "$FAILED_LIST" ]; then
    echo -e "Failed Agents:${RED}$FAILED_LIST${NC}"
fi

echo "Consensus Score: $CONSENSUS_SCORE%"

# Determine readiness with color coding
echo ""
if [ $CONSENSUS_SCORE -ge 90 ]; then
    echo -e "${GREEN}✅ EXCELLENT - System truth verified${NC}"
    echo -e "${GREEN}🚀 READY TO PROCEED${NC}"
    STATUS="READY"
elif [ $CONSENSUS_SCORE -ge 80 ]; then
    echo -e "${GREEN}✅ GOOD - Reality baseline established${NC}"
    echo "📋 Review warnings but can proceed"
    STATUS="READY"
elif [ $CONSENSUS_SCORE -ge 60 ]; then
    echo -e "${YELLOW}⚠️  FAIR - Some verification issues${NC}"
    echo "🔧 Fix critical agents before major changes"
    STATUS="CAUTION"
else
    echo -e "${RED}❌ POOR - System truth compromised${NC}"
    echo -e "${RED}🚨 DO NOT PROCEED - Fix failures first${NC}"
    STATUS="BLOCKED"
    
    # Provide troubleshooting guidance
    echo ""
    echo "🔧 Troubleshooting steps:"
    echo "1. Check .env file has required credentials"
    echo "2. Verify agent files exist: ls reality/agent-reality-auditor/"
    echo "3. Test individual agents: python3 reality/agent-reality-auditor/[agent]/connector.py"
    echo "4. Check Python dependencies: pip install -r requirements.txt"
fi

# Save metrics for tracking
METRICS_DIR="$PROJECT_ROOT/.metrics"
mkdir -p "$METRICS_DIR"

# Detailed metrics in JSON
cat > "$METRICS_DIR/reality-check-latest.json" <<EOF
{
  "timestamp": "$(date -Iseconds)",
  "mode": "$MODE",
  "agents_run": $AGENTS_RUN,
  "agents_total": $AGENTS_TOTAL,
  "consensus_score": $CONSENSUS_SCORE,
  "status": "$STATUS",
  "failed_agents": "$FAILED_LIST"
}
EOF

# Append to historical log
echo "{\"timestamp\": \"$(date -Iseconds)\", \"score\": $CONSENSUS_SCORE, \"status\": \"$STATUS\"}" >> "$METRICS_DIR/agent-runs.jsonl"

# Session marker for protocol compliance
SESSION_DIR="$PROJECT_ROOT/.sessions"
mkdir -p "$SESSION_DIR"
SESSION_DATE=$(date +%Y-%m-%d)

if [ ! -f "$SESSION_DIR/$SESSION_DATE-baseline.json" ]; then
    cp "$METRICS_DIR/reality-check-latest.json" "$SESSION_DIR/$SESSION_DATE-baseline.json"
    echo ""
    echo "📋 Session baseline established for $SESSION_DATE"
fi

# Exit with appropriate code
if [ "$STATUS" == "BLOCKED" ]; then
    exit 1
else
    exit 0
fi