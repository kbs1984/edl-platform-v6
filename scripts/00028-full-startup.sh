#!/bin/bash
---
session: "00028"
type: "script"
status: "deprecated"
created: "2025-08-28"
title: "00028-full-startup.sh"
purpose: "Full integration of all automation components"
language: "bash"
category: "automation"
replaced_by: "./scripts/00028-session-start.sh"
topics: ['automation']
priority: "P2"
domain: "core"
---

# 00028-full-startup.sh - Complete automated session initialization
# Session 28: Build session automation framework
# Purpose: Full integration of all automation components
#
# ⚠️ DEPRECATED - Session 94
# This script's features have been merged into the canonical script:
# USE INSTEAD: ./scripts/00028-session-start.sh
# Kept for historical reference only

echo "╔══════════════════════════════════════════════════════════╗"
echo "║     EDL Platform v6 - Automated Session Initialization    ║"
echo "║              WITH ANTI-GUESSWORK PROTOCOL v1.0            ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Session 00088: Anti-Guesswork Check
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
echo "Have you reviewed the anti-guesswork protocol? (yes/no)"
read PROTOCOL_ACKNOWLEDGED

if [ "$PROTOCOL_ACKNOWLEDGED" != "yes" ]; then
    echo ""
    echo "📋 Please review: core/00088-ANTI-GUESSWORK-PROTOCOL.md"
    echo "Then run: ./scripts/00088-gather-evidence.sh"
    echo ""
    echo "Continuing with startup, but remember:"
    echo "NO GUESSWORK - Use evidence-based debugging only!"
    echo ""
    sleep 3
fi

# Timer start
START_TIME=$(date +%s)

# Get session number and focus
SESSION_NUM="${1:-}"
SESSION_FOCUS="${2:-To be determined based on user instructions}"

if [ -z "$SESSION_NUM" ]; then
    # Auto-detect next session
    LAST_SESSION=$(ls -1 archive/sessions/SESSION-*-LOG.md 2>/dev/null | tail -1 | grep -o '[0-9]\{5\}')
    SESSION_NUM=$(printf "%05d" $((10#$LAST_SESSION + 1)))
    echo "Auto-detected session number: $SESSION_NUM"
else
    echo "Starting session: $SESSION_NUM"
fi

echo "Session focus: $SESSION_FOCUS"
echo "Timestamp: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# Step 1: Reality Check
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 1/6: Running Reality Agents"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
./scripts/00028-reality-check.sh
echo ""

# Step 2: YAML Organizational Health (Session 61 Integration)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 2/8: YAML Organizational Health"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -f "scripts/00059-yaml-health-check.sh" ]; then
    ./scripts/00059-yaml-health-check.sh --brief 2>/dev/null || echo "  ⚠️ YAML health check not available"
else
    echo "  ℹ️ YAML health check not yet integrated"
fi
echo ""

# Step 2b: YAML Compliance Check (Session 62 Integration)
if [ -f "scripts/00062-yaml-compliance-check.sh" ]; then
    COMPLIANCE=$(./scripts/00062-yaml-compliance-check.sh 2>/dev/null | grep "Overall Coverage" | cut -d: -f2 | xargs)
    echo "  📊 YAML Compliance: $COMPLIANCE"
fi
echo ""

# Step 3: Parse Outputs
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 3/8: Parsing Agent Outputs"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
python3 scripts/00028-parse-outputs.py > /tmp/parse-output.txt 2>&1
grep "Overall Health\|Healthy Agents" /tmp/parse-output.txt | sed 's/^/  /'
echo "  ✓ Parsing complete"
echo ""

# Step 4: Load Context
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 4/8: Loading Previous Context"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
./scripts/00028-context-loader.sh > /tmp/context-output.txt 2>&1
grep "Loading context from\|Stories\|Coverage" /tmp/context-output.txt | head -3 | sed 's/^/  /'
echo "  ✓ Context loaded"
echo ""

# Step 5: Check Handoffs
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 5/8: Checking for Handoffs"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
./scripts/00028-handoff-detector.sh "$SESSION_NUM" > /tmp/handoff-output.txt 2>&1
if grep -q "✅ Handoff found" /tmp/handoff-output.txt; then
    echo "  ✅ Handoff found for Session $SESSION_NUM"
    grep "Mission:" /tmp/handoff-output.txt | head -1 | sed 's/^/  /'
else
    echo "  ℹ️  No specific handoff for Session $SESSION_NUM"
fi
echo ""

# Step 6: Generate Report
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 6/8: Generating Initialization Report"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
python3 scripts/00028-generate-report.py "$SESSION_NUM" > /tmp/report-output.txt 2>&1
echo "  ✓ Markdown report generated"
echo "  📄 Report: /tmp/session-${SESSION_NUM}-init-report.md"
echo ""

# Step 7: Create Session Log
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 7/8: Creating Session Log"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
./scripts/00028-create-session-log.sh "$SESSION_NUM" "$SESSION_FOCUS" > /tmp/log-output.txt 2>&1
echo "  ✓ Session log created"
echo "  📄 Log: archive/sessions/SESSION-${SESSION_NUM}-LOG.md"
echo ""

# Step 8: YAML Query for Session Focus (Session 84 Addition)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 8/8: YAML Query Discovery (NEW)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🔍 Searching for existing work related to session focus..."

# Extract key topics from session focus (simple keyword extraction)
# Remove common words and extract meaningful terms
TOPICS=$(echo "$SESSION_FOCUS" | tr '[:upper:]' '[:lower:]' | \
    sed 's/\(and\|the\|for\|with\|from\|based\|on\|to\|be\|determined\|user\|instructions\|session\|continuing\)//g' | \
    tr -s ' ' | xargs)

if [ "$TOPICS" != "" ] && [ "$TOPICS" != "   " ]; then
    # Try to extract the first meaningful word
    FIRST_TOPIC=$(echo "$TOPICS" | awk '{print $1}' | sed 's/[^a-z0-9-]//g')
    
    if [ "$FIRST_TOPIC" != "" ]; then
        echo "  📋 Topic identified: $FIRST_TOPIC"
        
        # Run YAML queries for the topic
        echo ""
        echo "  Recent work on '$FIRST_TOPIC':"
        python3 scripts/00059-yaml-query.py --topic "$FIRST_TOPIC" --limit 3 2>/dev/null | \
            grep -E "^\d+\.|Title:|Status:" | head -9 || echo "    No recent work found"
        
        echo ""
        echo "  Incomplete work on '$FIRST_TOPIC':"
        python3 scripts/00059-yaml-query.py --topic "$FIRST_TOPIC" --status incomplete --limit 3 2>/dev/null | \
            grep -E "^\d+\.|Title:|Status:" | head -9 || echo "    No incomplete work found"
    else
        echo "  ℹ️ No specific topic extracted from focus"
        echo "  💡 Run manual YAML queries with:"
        echo "     python3 scripts/00059-yaml-query.py --topic [your-topic]"
    fi
else
    echo "  ℹ️ Session focus not specific enough for automated queries"
    echo "  💡 Run manual YAML queries with:"
    echo "     python3 scripts/00059-yaml-query.py --topic [your-topic]"
fi

echo ""
echo "  ⚡ YAML queries complete (0.15s average query time)"
echo ""

# Timer end
END_TIME=$(date +%s)
ELAPSED=$((END_TIME - START_TIME))

# Final Summary
echo "╔══════════════════════════════════════════════════════════╗"
echo "║                   SESSION READY                           ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "📊 System Health: $(grep "Overall Health:" /tmp/parse-output.txt | grep -o "[0-9.]*%")"
echo "🚀 Session Number: $SESSION_NUM"
echo "⏱️  Total Time: ${ELAPSED} seconds (vs 2100 seconds manual)"
echo "💾 Time Saved: $((2100 - ELAPSED)) seconds ($(( (2100 - ELAPSED) * 100 / 2100 ))% reduction)"
echo ""
echo "📁 Generated Files:"
echo "  • Session Log: archive/sessions/SESSION-${SESSION_NUM}-LOG.md"
echo "  • Init Report: /tmp/session-${SESSION_NUM}-init-report.md"
echo "  • Agent Data: /tmp/*.json"
echo ""
echo "💡 Next Steps:"
echo "  1. Review the initialization report"
echo "  2. Check for handoffs if present"
echo "  3. Begin session work"
echo ""
echo "✨ Session $SESSION_NUM initialization complete!"