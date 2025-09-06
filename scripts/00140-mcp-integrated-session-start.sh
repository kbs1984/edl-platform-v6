#!/bin/bash
# MCP-Integrated Session Start Script
# Session 140 - Uses unified edl-v6-session MCP server for session management
# This script should be used AFTER Claude Code restart to leverage MCP

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     EDL Platform v6 - MCP-Integrated Session Start        ║${NC}"
echo -e "${BLUE}║            Using Unified edl-v6-session Server            ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Get session number
SESSION_ID=${1:-"140"}
SESSION_FOCUS=${2:-"To be determined based on user instructions"}

echo -e "${GREEN}Starting Session $SESSION_ID${NC}"
echo -e "Focus: $SESSION_FOCUS"
echo ""

# Step 1: Run traditional session start for Reality Agents and context
echo -e "${YELLOW}Step 1/3: Traditional Session Initialization${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
./scripts/00028-session-start.sh "$SESSION_ID" "$SESSION_FOCUS"

# Step 2: Create MCP session tracking instructions
echo ""
echo -e "${YELLOW}Step 2/3: MCP Session Management Setup${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cat > /tmp/mcp-session-init.md << EOF
## MCP Session Management Ready

After Claude Code restart, initialize session tracking:

\`\`\`javascript
// Start session tracking
mcp__edl-v6-session__start_session({
  sessionId: "$SESSION_ID",
  focus: "$SESSION_FOCUS",
  estimatedHours: 2
})

// Throughout development, track work:
mcp__edl-v6-session__add_task({
  title: "Your first task",
  priority: "high"
})

mcp__edl-v6-session__track_deliverable({
  path: "file/path.ext",
  type: "component"
})

// End session with:
mcp__edl-v6-session__end_session({
  summary: "What was accomplished",
  accomplishments: ["item1", "item2"],
  nextPriorities: ["next1", "next2"]
})
\`\`\`
EOF

echo -e "${GREEN}✅ MCP session commands prepared${NC}"
echo ""

# Step 3: Check if MCP server is available
echo -e "${YELLOW}Step 3/3: MCP Server Status${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if the MCP server exists
if [ -f "/home/b4sho/mcp-servers/edl-v6-session/index.js" ]; then
    echo -e "${GREEN}✅ edl-v6-session server installed${NC}"
    echo "   Location: /home/b4sho/mcp-servers/edl-v6-session/"
    
    # Check if Claude config has the server
    if grep -q "edl-v6-session" ~/.claude.json 2>/dev/null; then
        echo -e "${GREEN}✅ Server configured in Claude${NC}"
    else
        echo -e "${RED}⚠️  Server not in Claude config - run update script${NC}"
    fi
else
    echo -e "${RED}❌ MCP server not found${NC}"
    echo "   Run: npm install in /home/b4sho/mcp-servers/edl-v6-session/"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Step 4: Show Progress Matrix Status
echo ""
echo -e "${YELLOW}Step 4/4: Progress Matrix Status${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Use Python to query progress matrix
python3 << 'EOF'
import subprocess
import json

# Get progress summary using progress tracker
result = subprocess.run(['python3', 'scripts/00142-progress-tracker.py', '142', 'summary'], 
                       capture_output=True, text=True)

print("📊 Platform Progress Summary:")
print("  Use mcp__supabase-dev__execute_sql with the printed SQL")
print("  to get live progress data")
print("")
print("🎯 Next Priority Feature:")
result2 = subprocess.run(['python3', 'scripts/00142-progress-tracker.py', '142', 'next'], 
                        capture_output=True, text=True)
EOF

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}Session $SESSION_ID Initialization Complete!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${YELLOW}📋 Quick Reference:${NC}"
echo "  • Session Log: archive/sessions/SESSION-${SESSION_ID}-LOG.md"
echo "  • MCP Commands: See /tmp/mcp-session-init.md"
echo ""
echo -e "${YELLOW}🔧 Available MCP Functions:${NC}"
echo "  • start_session    - Initialize session"
echo "  • add_task        - Add tasks to track"
echo "  • update_task     - Update task status"
echo "  • track_deliverable - Track created files"
echo "  • log_failure     - Document failures (Truth Over Speed)"
echo "  • end_session     - End with handoff generation"
echo ""

# If Claude has been restarted, remind to use MCP
if [ -n "$CLAUDE_RESTARTED" ] || [ "$3" == "--mcp-ready" ]; then
    echo -e "${GREEN}🚀 MCP Ready - Use mcp__edl-v6-session__* functions${NC}"
else
    echo -e "${YELLOW}⚠️  Remember to restart Claude Code to activate MCP server${NC}"
    echo "   After restart, run with: $0 $SESSION_ID \"$SESSION_FOCUS\" --mcp-ready"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}📋 DEFINITIVE BUILD WORKFLOW LOADED${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${YELLOW}MANDATORY: Follow the 8-phase workflow:${NC}"
echo "  📖 core/00141-DEFINITIVE-BUILD-WORKFLOW.md"
echo ""
echo -e "${CYAN}Phase Checklist:${NC}"
echo "  ✓ Phase 0: Pre-flight (environment loaded)"
echo "  ✓ Phase 1: Session started"
echo "  → Phase 2: Review status - Run: ./scripts/00138-dynamic-context-loader.sh"
echo "  → Phase 3: Plan feature - Use: Sequential Thinking MCP"
echo "  → Phase 4: Research - Run: python3 scripts/00136-create-informed-test.py"
echo "  → Phase 5: Build with tests"
echo "  → Phase 6: Validate - Run: python3 reality/agent-reality-auditor/orchestrator.py"
echo "  → Phase 7: Auto-PR - Run: python3 scripts/00136-auto-pr.py"
echo "  → Phase 8: Close session - Use: mcp__edl-v6-session__end_session"
echo ""
echo -e "${GREEN}Workflow Enforcer:${NC} ./scripts/00141-workflow-enforcer.sh"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"