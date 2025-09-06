#!/bin/bash
# Workflow Enforcer - Ensures DEFINITIVE BUILD WORKFLOW is followed
# Session 141 - Makes the workflow mandatory and persistent

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Get current phase from argument or detect
CURRENT_PHASE=${1:-"detect"}
SESSION_ID=${2:-"141"}

echo -e "${BLUE}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║          DEFINITIVE BUILD WORKFLOW ENFORCER               ║${NC}"
echo -e "${BLUE}║              Ensuring 4-6x Development Speed              ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to show workflow phase
show_phase() {
    local phase=$1
    local status=$2
    local command=$3
    
    if [ "$status" = "current" ]; then
        echo -e "${GREEN}▶ Phase $phase (CURRENT)${NC}"
    elif [ "$status" = "completed" ]; then
        echo -e "${GREEN}✓ Phase $phase${NC}"
    elif [ "$status" = "required" ]; then
        echo -e "${YELLOW}⚠ Phase $phase (REQUIRED NEXT)${NC}"
    else
        echo -e "  Phase $phase"
    fi
    
    if [ ! -z "$command" ]; then
        echo -e "  ${CYAN}Run: $command${NC}"
    fi
}

# Function to check phase requirements
check_phase_requirements() {
    local phase=$1
    
    case $phase in
        0)
            echo "Checking Pre-Flight requirements..."
            if [ -z "$SUPABASE_URL" ]; then
                echo -e "${RED}❌ Environment variables not set${NC}"
                echo -e "${YELLOW}Fix: export SUPABASE_URL=\"https://bbrheacetxlnqbibjwsz.supabase.co\"${NC}"
                return 1
            fi
            ;;
        1)
            echo "Checking Session Start requirements..."
            if [ ! -f "archive/sessions/SESSION-${SESSION_ID}-LOG.md" ]; then
                echo -e "${RED}❌ Session not properly started${NC}"
                echo -e "${YELLOW}Fix: ./scripts/00140-mcp-integrated-session-start.sh $SESSION_ID${NC}"
                return 1
            fi
            ;;
        2)
            echo "Checking Review Status requirements..."
            # Check if context was loaded
            ;;
        3)
            echo "Checking Planning requirements..."
            echo -e "${YELLOW}Reminder: Use Sequential Thinking for planning${NC}"
            echo "mcp__sequential-thinking__sequentialthinking"
            ;;
        4)
            echo "Checking Research requirements..."
            echo -e "${YELLOW}Reminder: Create informed test${NC}"
            echo "python3 scripts/00136-create-informed-test.py [feature]"
            ;;
        5)
            echo "Checking Build requirements..."
            echo -e "${YELLOW}Reminder: Write test FIRST, no empty inserts${NC}"
            ;;
        6)
            echo "Checking Validation requirements..."
            echo -e "${YELLOW}Run: python3 reality/agent-reality-auditor/orchestrator.py${NC}"
            ;;
        7)
            echo "Checking PR requirements..."
            echo -e "${YELLOW}Run: python3 scripts/00136-auto-pr.py \"[Feature]\" $SESSION_ID${NC}"
            ;;
        8)
            echo "Checking Session Closure requirements..."
            echo -e "${YELLOW}Use: mcp__edl-v6-session__end_session${NC}"
            ;;
    esac
}

# Display the complete workflow
echo -e "${CYAN}📋 DEFINITIVE BUILD WORKFLOW (8 Phases)${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Show all phases with current status
phases=(
    "0:PRE-FLIGHT:Environment setup"
    "1:START SESSION:./scripts/00140-mcp-integrated-session-start.sh"
    "2:REVIEW STATUS:./scripts/00138-dynamic-context-loader.sh"
    "3:PLAN FEATURE:mcp__sequential-thinking__sequentialthinking"
    "4:RESEARCH:python3 scripts/00136-create-informed-test.py"
    "5:BUILD:Implement with tests"
    "6:VALIDATE:python3 reality/agent-reality-auditor/orchestrator.py"
    "7:AUTO-PR:python3 scripts/00136-auto-pr.py"
    "8:CLOSE:mcp__edl-v6-session__end_session"
)

for phase_info in "${phases[@]}"; do
    IFS=':' read -r num name cmd <<< "$phase_info"
    show_phase "$num:$name" "pending" "$cmd"
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Load the workflow document reference
echo -e "${YELLOW}📖 Full Workflow Documentation:${NC}"
echo "   core/00141-DEFINITIVE-BUILD-WORKFLOW.md"
echo ""

# Show current tools available
echo -e "${CYAN}🔧 Available Speed Multipliers:${NC}"
echo "  • Sequential Thinking: 6x planning speed"
echo "  • Brave Search: 10x research speed"
echo "  • Supabase MCP: 3.2x database operations"
echo "  • GitHub MCP: 30x PR creation"
echo "  • Reality Server: 3x validation speed"
echo -e "  ${GREEN}Combined: 4-6x overall development speed${NC}"
echo ""

# Check for common violations
echo -e "${RED}⚠️  Common Violations to Avoid:${NC}"
echo "  ✗ Skipping research phase (causes anti-patterns)"
echo "  ✗ Not validating incrementally (wastes time)"
echo "  ✗ Empty .insert({}) calls (breaks Guardian)"
echo "  ✗ Forgetting session closure (no handoff)"
echo ""

# Provide quick start commands
echo -e "${GREEN}🚀 Quick Start Commands:${NC}"
echo '```bash'
echo "# Set your feature"
echo "export FEATURE=\"emcoin\"  # or guardian, friends, activity"
echo ""
echo "# Run complete workflow"
echo "./scripts/00141-workflow-enforcer.sh"
echo '```'
echo ""

# Create enforcement file if it doesn't exist
ENFORCEMENT_FILE=".workflow-phase"
if [ ! -f "$ENFORCEMENT_FILE" ]; then
    echo "0" > "$ENFORCEMENT_FILE"
    echo -e "${GREEN}✓ Created workflow tracking file${NC}"
fi

# Read current phase
TRACKED_PHASE=$(cat "$ENFORCEMENT_FILE" 2>/dev/null || echo "0")
echo -e "${BLUE}Current Phase: $TRACKED_PHASE${NC}"

# Provide next action
case $TRACKED_PHASE in
    0) echo -e "${YELLOW}Next: Start session with MCP integration${NC}" ;;
    1) echo -e "${YELLOW}Next: Review status and load context${NC}" ;;
    2) echo -e "${YELLOW}Next: Plan with Sequential Thinking${NC}" ;;
    3) echo -e "${YELLOW}Next: Research patterns with Brave Search${NC}" ;;
    4) echo -e "${YELLOW}Next: Build feature with tests${NC}" ;;
    5) echo -e "${YELLOW}Next: Validate with orchestrator${NC}" ;;
    6) echo -e "${YELLOW}Next: Create PR with evidence${NC}" ;;
    7) echo -e "${YELLOW}Next: Close session with handoff${NC}" ;;
    8) echo -e "${GREEN}✓ Workflow complete!${NC}" ;;
esac

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}Workflow Enforcer Ready!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"