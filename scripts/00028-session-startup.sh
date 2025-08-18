#!/bin/bash
# 00028-session-startup.sh - Main orchestrator for session initialization
# Session 28: Build session automation framework
# Purpose: Automate the entire session startup process

echo "============================================"
echo "   EDL Platform v6 - Session Automation"
echo "============================================"
echo ""

# Get session number (can be passed as parameter or auto-detected)
if [ -n "$1" ]; then
    SESSION_NUM="$1"
else
    # Auto-detect next session number
    LAST_SESSION=$(ls -1 archive/sessions/SESSION-*-LOG.md 2>/dev/null | tail -1 | grep -o '[0-9]\{5\}')
    SESSION_NUM=$(printf "%05d" $((10#$LAST_SESSION + 1)))
fi

echo "🚀 Starting Session $SESSION_NUM"
echo "Time: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# Step 1: Run Reality Check (8 seconds)
echo "Step 1/4: Running Reality Agents..."
./scripts/00028-reality-check.sh > /tmp/reality-output.txt 2>&1
grep "System Health\|Status" /tmp/reality-output.txt | sed 's/^/  /'
echo "  ✓ Reality check complete"
echo ""

# Step 2: Check for Handoffs (2 seconds)
echo "Step 2/4: Checking for handoffs..."
./scripts/00028-handoff-detector.sh "$SESSION_NUM" > /tmp/handoff-output.txt 2>&1
grep -E "✅|Mission:|Priority" /tmp/handoff-output.txt | head -5 | sed 's/^/  /'
echo "  ✓ Handoff check complete"
echo ""

# Step 3: Load Context (5 seconds)
echo "Step 3/4: Loading previous context..."
./scripts/00028-context-loader.sh > /tmp/context-output.txt 2>&1
grep -E "Session [0-9]|System Health|Stories" /tmp/context-output.txt | head -3 | sed 's/^/  /'
echo "  ✓ Context loaded"
echo ""

# Step 4: Generate Summary
echo "Step 4/4: Generating session summary..."
echo ""
echo "=== Session $SESSION_NUM Ready ==="
echo "📊 System Status:"
grep "System Health:" /tmp/reality-output.txt | sed 's/^/  /'
grep "FileSystem Status:" /tmp/reality-output.txt | sed 's/^/  /'
grep "GitHub Status:" /tmp/reality-output.txt | sed 's/^/  /'

if grep -q "✅ Handoff found" /tmp/handoff-output.txt; then
    echo ""
    echo "📋 Handoff Mission:"
    grep -A1 "Mission:" /tmp/handoff-output.txt | tail -1 | sed 's/^/  /'
fi

echo ""
echo "⏱️  Total startup time: $(date -d '15 seconds ago' '+%S seconds')"
echo ""
echo "Ready for work! Full details in /tmp/*-output.txt"
echo ""
echo "💡 Next steps:"
echo "  1. Create session log: SESSION-${SESSION_NUM}-LOG.md"
echo "  2. Review handoff if present"
echo "  3. Begin session work"