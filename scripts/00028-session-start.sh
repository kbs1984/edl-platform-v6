#!/bin/bash
: '
---
session: "00028"
type: "script"
status: "active"
created: "2025-08-28"
modified: "2025-08-28"
title: "Canonical Session Startup Script"
purpose: "Single entry point for session initialization with all best features"
language: "bash"
category: "automation"
topics: ["session", "startup", "setup", "initialization", "automation", "workstation"]
priority: "P0"
domain: "core"
canonical: true
replaces: ["00028-full-startup.sh", "00028-session-startup.sh", "00059-session-start-enhanced.sh"]
---
'

# 00028-session-start.sh - UNIFIED session automation (canonical version)
# Created: Session 28
# Updated: Session 94 - Merged anti-guesswork (88) and YAML health (59)
# Version: 2.0.0
# Status: ACTIVE (canonical per CLAUDE.md)
# Purpose: Single entry point for session initialization with all best features

echo "╔══════════════════════════════════════════════════════════╗"
echo "║     EDL Platform v6 - Session Automation v2.0             ║"
echo "║         Unified with Anti-Guesswork & YAML Health         ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Session 88 Feature: Anti-Guesswork Protocol Check
if [ "$1" != "--skip-protocol" ]; then
    echo "🛑 ANTI-GUESSWORK PROTOCOL CHECK"
    echo "================================="
    echo "Sessions 83, 87, 88 all fell into the guesswork trap."
    echo "This protocol prevents that pattern."
    echo ""
    echo "Before making ANY code changes today, you MUST:"
    echo "  1. Check git diff for current changes"
    echo "  2. Query YAML for existing solutions"
    echo "  3. Read recent session logs"
    echo "  4. Verify reality with agents"
    echo ""
    echo "📋 Review: core/00088-ANTI-GUESSWORK-PROTOCOL.md"
    echo ""
    # Give user 3 seconds to see this important message
    sleep 3
fi

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
    # Better auto-detection: find actual last session (excluding test sessions < 10)
    LAST_GOOD_SESSION=$(ls archive/sessions/SESSION-*-LOG.md 2>/dev/null | \
        grep -o 'SESSION-[0-9]\{5\}-LOG' | \
        grep -o '[0-9]\{5\}' | \
        sort -n | \
        awk '$1 >= 10 {last=$1} END {print last}')
    
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

# Step 1: Reality Check
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 1/6: Running Reality Agents"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
./scripts/00028-reality-check.sh
echo ""

# Step 2: YAML Health (Session 59 feature - now integrated)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 2/6: YAML Organizational Health"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -f "scripts/00059-yaml-health-check.sh" ]; then
    ./scripts/00059-yaml-health-check.sh --brief 2>/dev/null || echo "  ⚠️ YAML health check not available"
elif [ -f "scripts/00062-yaml-compliance-check.sh" ]; then
    COMPLIANCE=$(./scripts/00062-yaml-compliance-check.sh 2>/dev/null | grep "Overall Coverage" | cut -d: -f2 | xargs)
    echo "  📊 YAML Compliance: $COMPLIANCE"
else
    echo "  ℹ️ YAML health check pending installation"
fi
echo ""

# Step 3: Parse Outputs
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 3/6: Parsing Agent Outputs"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
python3 scripts/00028-parse-outputs.py > /tmp/parse-output.txt 2>&1
grep "Overall Health\|Healthy Agents" /tmp/parse-output.txt | sed 's/^/  /'
echo "  ✓ Parsing complete"
echo ""

# Step 4: Check Handoffs
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 4/6: Checking for Handoffs"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
./scripts/00028-handoff-detector.sh "$SESSION_NUM" > /tmp/handoff-output.txt 2>&1
if grep -q "✅ Handoff found" /tmp/handoff-output.txt; then
    echo "  ✅ Handoff found for Session $SESSION_NUM"
else
    echo "  ℹ️  No specific handoff for Session $SESSION_NUM"
fi
echo ""

# Step 5: Create Session Log
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 5/6: Creating Session Log"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
./scripts/00028-create-session-log.sh "$SESSION_NUM" "$SESSION_FOCUS" > /tmp/log-output.txt 2>&1
echo "  ✓ Session log created: archive/sessions/SESSION-${SESSION_NUM}-LOG.md"
echo ""

# Step 6: YAML Query Discovery (Session 84 mandate)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 6/7: YAML Query Discovery"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🔍 Querying for existing work..."
# Quick queries for common concerns
python3 scripts/00059-yaml-query.py --status incomplete --limit 3 2>/dev/null | grep -E "^[0-9]|No results" | head -5
echo ""

# Step 7: Dynamic Context Loading (Session 138 enhancement)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 7/7: Dynamic Context Loading"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
./scripts/00138-dynamic-context-loader.sh 2>/dev/null || echo "  ⚠️ Dynamic context loader unavailable"
echo ""

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
echo ""
echo "🆕 Session 138 Dynamic Context & MCP Enhanced Workflow:"
echo "  • Dynamic Context: ./scripts/00138-dynamic-context-loader.sh"
echo "  • Enhanced Start: ./scripts/00136-enhanced-session-start.sh $SESSION_NUM"
echo "  • Mission & Priorities: reconciliation/00136-MISSION-AND-PRIORITIES.md"
echo "  • Research Tests: python3 scripts/00136-create-informed-test.py [feature]"
echo "  • Auto PR: python3 scripts/00136-auto-pr.py '[Feature]' $SESSION_NUM"
echo "═══════════════════════════════════════════════════════════"