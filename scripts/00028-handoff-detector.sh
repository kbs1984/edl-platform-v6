#!/bin/bash
# 00028-handoff-detector.sh - Check for session handoffs
# Session 28: Build session automation framework
# Purpose: Detect and display any handoffs for current session

echo "=== Handoff Detector v0.1 ==="

# Determine current session number (could be passed as parameter)
CURRENT_SESSION=${1:-00028}
echo "Checking for handoffs to Session $CURRENT_SESSION..."

# Check for specific handoff file
HANDOFF_FILE="archive/sessions/SESSION-${CURRENT_SESSION}-HANDOFF.md"

if [ -f "$HANDOFF_FILE" ]; then
    echo "✅ Handoff found!"
    echo ""
    echo "📋 Mission:"
    grep -A2 "Mission\|MISSION" "$HANDOFF_FILE" | head -3 | sed 's/^/  /'
    
    echo ""
    echo "⏰ Time Estimate:"
    grep -i "hour\|time" "$HANDOFF_FILE" | grep -i "estimate\|total" | head -1 | sed 's/^/  /'
    
    echo ""
    echo "🎯 Priority Tasks:"
    grep -A5 "Priority\|Hour 1" "$HANDOFF_FILE" | grep "^[1-9]\.\|^-" | head -5 | sed 's/^/  /'
    
    echo ""
    echo "Full handoff: $HANDOFF_FILE"
else
    echo "No specific handoff found for Session $CURRENT_SESSION"
    
    # Check for general handoffs in recent sessions
    echo "Checking recent sessions for relevant handoffs..."
    RECENT_HANDOFFS=$(ls -1t archive/sessions/*HANDOFF*.md 2>/dev/null | head -3)
    
    if [ -n "$RECENT_HANDOFFS" ]; then
        echo "Recent handoffs found:"
        echo "$RECENT_HANDOFFS" | sed 's/^/  - /'
    fi
fi