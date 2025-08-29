#!/bin/bash
---
session: "00028"
type: "script"
status: "deprecated"
created: "2025-08-28"
title: "00028-session-start-original.sh"
purpose: "Original implementation before v2.0 unification"
language: "bash"
category: "automation"
replaced_by: "./scripts/00028-session-start.sh (v2.0 unified version)"
topics: ['session', 'automation']
priority: "P2"
domain: "core"
---

# 00028-session-start-original.sh - ORIGINAL session automation (preserved for reference)
# Created: Session 28, Updated: Session 28 (based on Session 29 feedback)
# Purpose: Original implementation before v2.0 unification
#
# ⚠️ DEPRECATED - Session 95
# This is the original version preserved for historical reference
# USE INSTEAD: ./scripts/00028-session-start.sh (v2.0 unified version)
# This version lacks anti-guesswork protocol and YAML health features

echo "╔══════════════════════════════════════════════════════════╗"
echo "║     EDL Platform v6 - Session Automation v1.1             ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Parse command line arguments
SESSION_NUM=""
SESSION_FOCUS=""

# Handle different argument formats
if [ "$1" == "--help" ] || [ "$1" == "-h" ]; then
    echo "Usage: ./scripts/00028-session-start.sh [session-number] [focus]"
    echo ""
    echo "Examples:"
    echo "  ./scripts/00028-session-start.sh              # Auto-detect next session"
    echo "  ./scripts/00028-session-start.sh 00029        # Specific session number"
    echo "  ./scripts/00028-session-start.sh 00029 'Building features'  # With focus"
    echo ""
    echo "Options:"
    echo "  --help, -h    Show this help message"
    echo "  --git         Include git status in report"
    echo ""
    exit 0
fi

# Check for git status flag
INCLUDE_GIT=false
for arg in "$@"; do
    if [ "$arg" == "--git" ]; then
        INCLUDE_GIT=true
    fi
done

# Get session number
if [ -n "$1" ] && [ "$1" != "--git" ]; then
    SESSION_NUM="$1"
    echo "Using specified session: $SESSION_NUM"
else
    # Better auto-detection: find actual last session (excluding outliers)
    LAST_GOOD_SESSION=$(ls archive/sessions/SESSION-*-LOG.md 2>/dev/null | \
        grep -o 'SESSION-[0-9]\{5\}-LOG' | \
        grep -o '[0-9]\{5\}' | \
        sort -n | \
        awk '$1 < 90 {last=$1} END {print last}')
    
    if [ -n "$LAST_GOOD_SESSION" ]; then
        SESSION_NUM=$(printf "%05d" $((10#$LAST_GOOD_SESSION + 1)))
        echo "Auto-detected next session: $SESSION_NUM (after $LAST_GOOD_SESSION)"
    else
        SESSION_NUM="00001"
        echo "Starting fresh: Session $SESSION_NUM"
    fi
fi

# Get session focus
if [ -n "$2" ] && [ "$2" != "--git" ]; then
    SESSION_FOCUS="$2"
else
    SESSION_FOCUS="To be determined based on user instructions"
fi

echo "Session focus: $SESSION_FOCUS"
echo "Timestamp: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# Timer start
START_TIME=$(date +%s)

# Add git status if requested
if [ "$INCLUDE_GIT" = true ]; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Git Status"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    git status --short | head -10
    echo ""
fi

# Run the full startup sequence
echo "Starting automated initialization..."
echo ""

# Call the existing full-startup script with our validated session number
./scripts/00028-full-startup.sh "$SESSION_NUM" "$SESSION_FOCUS"

# Timer end
END_TIME=$(date +%s)
ELAPSED=$((END_TIME - START_TIME))

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "Session $SESSION_NUM ready in ${ELAPSED} seconds!"
echo ""
echo "📚 Quick Reference:"
echo "  • Session Log: archive/sessions/SESSION-${SESSION_NUM}-LOG.md"
echo "  • Previous Handoff: archive/sessions/SESSION-${SESSION_NUM}-HANDOFF.md"
echo "  • Automation README: scripts/00028-AUTOMATION-README.md"
echo "═══════════════════════════════════════════════════════════"