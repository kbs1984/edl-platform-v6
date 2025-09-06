#!/bin/bash
# MCP Add-on for Session Start
# To be sourced or called after main session start
# Provides MCP session management integration

# This script can be called after 00028-session-start.sh to add MCP tracking

SESSION_ID=${1:-$(ls -1 archive/sessions/SESSION-*-LOG.md 2>/dev/null | tail -1 | grep -o '[0-9]\{5\}')}
SESSION_FOCUS=${2:-"Continuing platform development"}

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "MCP Session Management Integration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Create a helper script that can be executed in Claude
cat > /tmp/start-mcp-session-${SESSION_ID}.js << EOF
// MCP Session Start Commands for Session ${SESSION_ID}
// Copy and execute these in Claude after restart:

// 1. Start the session
mcp__edl-v6-session__start_session({
  sessionId: "${SESSION_ID}",
  focus: "${SESSION_FOCUS}",
  estimatedHours: 2
})

// 2. Add initial tasks based on priorities
mcp__edl-v6-session__add_task({
  title: "Review current status and handoff",
  priority: "high",
  status: "in-progress"
})

mcp__edl-v6-session__add_task({
  title: "Implement priority feature",
  priority: "high",
  status: "pending"
})

// 3. Track progress throughout session
// Example: After creating a file
mcp__edl-v6-session__track_deliverable({
  path: "path/to/new/file.ext",
  type: "component", // or "test", "documentation", "migration"
  linesOfCode: 100
})

// 4. Log any failures (Truth Over Speed)
mcp__edl-v6-session__log_failure({
  what: "Description of what failed",
  impact: "Minor/Major/Critical",
  lesson: "What was learned"
})

// 5. End session when complete
mcp__edl-v6-session__end_session({
  summary: "Summary of what was accomplished",
  accomplishments: [
    "Task 1 completed",
    "Task 2 completed"
  ],
  nextPriorities: [
    "Next priority 1",
    "Next priority 2"
  ],
  honestAssessment: "Honest assessment of the session"
})
EOF

echo "✅ MCP session commands prepared"
echo "   Commands saved to: /tmp/start-mcp-session-${SESSION_ID}.js"
echo ""
echo "After Claude restart, the following MCP functions are available:"
echo "  • mcp__edl-v6-session__start_session"
echo "  • mcp__edl-v6-session__add_task"
echo "  • mcp__edl-v6-session__update_task"
echo "  • mcp__edl-v6-session__log_progress"
echo "  • mcp__edl-v6-session__track_deliverable"
echo "  • mcp__edl-v6-session__log_failure"
echo "  • mcp__edl-v6-session__check_session_integrity"
echo "  • mcp__edl-v6-session__end_session"
echo ""

# Check if MCP server is configured
if grep -q "edl-v6-session" ~/.claude.json 2>/dev/null; then
    echo "✅ MCP server 'edl-v6-session' is configured"
    echo "   Restart Claude Code to activate"
else
    if grep -q "edl-program-session\|edl-session-management" ~/.claude.json 2>/dev/null; then
        echo "⚠️  Old session servers detected - update needed"
        echo "   Run: python3 /home/b4sho/mcp-servers/update-claude-config.py"
    else
        echo "❌ MCP server not configured"
        echo "   Run: python3 /home/b4sho/mcp-servers/update-claude-config.py"
    fi
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"