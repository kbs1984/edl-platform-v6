#!/bin/bash
# 00028-context-loader.sh - Load previous session context
# Session 28: Build session automation framework
# Purpose: Extract key information from previous session for continuity

echo "=== Context Loader v0.1 ==="

# Find the most recent session log
LATEST_SESSION=$(ls -1 archive/sessions/SESSION-*-LOG.md 2>/dev/null | tail -1)

if [ -z "$LATEST_SESSION" ]; then
    echo "No previous session found"
    exit 1
fi

SESSION_NUM=$(basename "$LATEST_SESSION" | grep -o '[0-9]\{5\}')
echo "Loading context from Session $SESSION_NUM..."
echo ""

# Extract key sections from previous session
echo "📋 Previous Session Summary:"
echo "----------------------------"

# Get session focus
grep -A1 "Session Focus" "$LATEST_SESSION" | tail -1 | sed 's/^/  /'

# Get key metrics
echo ""
echo "📊 System State:"
sed -n '/System State at Session Start/,/^##/p' "$LATEST_SESSION" | \
    grep -E "System Health:|User Stories:|Canvas Coverage:" | \
    head -3 | sed 's/^/  /'

# Get handoff if exists
echo ""
echo "📝 Handoff Notes:"
HANDOFF_FILE="archive/sessions/SESSION-${SESSION_NUM}-HANDOFF.md"
if [ -f "$HANDOFF_FILE" ]; then
    grep -A3 "Mission\|Priority\|Critical" "$HANDOFF_FILE" | head -5 | sed 's/^/  /'
else
    echo "  No handoff found"
fi

# Get work completed
echo ""
echo "✅ Previous Work Completed:"
grep -A5 "Work Completed" "$LATEST_SESSION" | grep "^-" | head -3 | sed 's/^/  /'

echo ""
echo "Context loaded from: $LATEST_SESSION"