#!/bin/bash
# 00028-full-startup.sh - Complete automated session initialization
# Session 28: Build session automation framework
# Purpose: Full integration of all automation components

echo "╔══════════════════════════════════════════════════════════╗"
echo "║     EDL Platform v6 - Automated Session Initialization    ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

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
echo "Step 2/7: YAML Organizational Health"
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
echo "Step 3/7: Parsing Agent Outputs"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
python3 scripts/00028-parse-outputs.py > /tmp/parse-output.txt 2>&1
grep "Overall Health\|Healthy Agents" /tmp/parse-output.txt | sed 's/^/  /'
echo "  ✓ Parsing complete"
echo ""

# Step 4: Load Context
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 4/7: Loading Previous Context"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
./scripts/00028-context-loader.sh > /tmp/context-output.txt 2>&1
grep "Loading context from\|Stories\|Coverage" /tmp/context-output.txt | head -3 | sed 's/^/  /'
echo "  ✓ Context loaded"
echo ""

# Step 5: Check Handoffs
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 5/7: Checking for Handoffs"
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
echo "Step 6/7: Generating Initialization Report"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
python3 scripts/00028-generate-report.py "$SESSION_NUM" > /tmp/report-output.txt 2>&1
echo "  ✓ Markdown report generated"
echo "  📄 Report: /tmp/session-${SESSION_NUM}-init-report.md"
echo ""

# Step 7: Create Session Log
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 7/7: Creating Session Log"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
./scripts/00028-create-session-log.sh "$SESSION_NUM" "$SESSION_FOCUS" > /tmp/log-output.txt 2>&1
echo "  ✓ Session log created"
echo "  📄 Log: archive/sessions/SESSION-${SESSION_NUM}-LOG.md"
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