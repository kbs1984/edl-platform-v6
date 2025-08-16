#!/bin/bash
# Session Log Guard - Ensures proper session logging protocol
# Usage: ./session-guard.sh [SESSION_NUMBER]

SESSION_NUM=${1:-$(date +%s | tail -c 3)}
# Remove leading zeros to avoid octal interpretation
SESSION_NUM_CLEAN=$(echo $SESSION_NUM | sed 's/^0*//')
SESSION_FILE="/home/b4sho/edl-projects-with-claude/edl-platform-v6/archive/sessions/SESSION-$SESSION_NUM-LOG.md"

echo "🔍 Session Log Guard - Checking Protocol Compliance"
echo "=================================================="

# Check if session log exists
if [ ! -f "$SESSION_FILE" ]; then
    echo "❌ PROTOCOL VIOLATION: Session log missing!"
    echo "📝 Required file: $SESSION_FILE"
    echo ""
    echo "🚨 CONSTITUTIONAL REQUIREMENT:"
    echo "   Create session log IMMEDIATELY before any work"
    echo ""
    echo "💡 Quick fix:"
    echo "   touch '$SESSION_FILE'"
    echo "   # Then add proper session log structure"
    echo ""
    exit 1
else
    echo "✅ Session log exists: $SESSION_FILE"
fi

# Check if session log has content
LINES=$(wc -l < "$SESSION_FILE")
if [ "$LINES" -lt 10 ]; then
    echo "⚠️  WARNING: Session log very sparse ($LINES lines)"
    echo "   Constitutional minimum for substantial work: 50+ lines"
    echo ""
fi

# Protocol v2.0: Check for System State section
echo ""
echo "📊 Protocol v2.0 Validation:"
if grep -q "## System State at Session Start" "$SESSION_FILE"; then
    echo "✅ System State section found"
    
    # Check for Reality Agents status
    if grep -q "Reality Agents" "$SESSION_FILE"; then
        echo "✅ Reality Agents status documented"
    else
        echo "⚠️  Missing Reality Agents operational status"
    fi
    
    # Check for System Health
    if grep -q "System Health" "$SESSION_FILE"; then
        echo "✅ System Health documented"
    else
        echo "⚠️  Missing System Health percentage"
    fi
    
    # Check for Domains Status
    if grep -q "Domains Status" "$SESSION_FILE"; then
        echo "✅ Domains Status documented"
    else
        echo "⚠️  Missing Domains Status"
    fi
else
    echo "⚠️  WARNING: Missing System State section (Protocol v2.0)"
    echo "   Add '## System State at Session Start' with:"
    echo "   - Reality Agents operational status"
    echo "   - System Health percentage"
    echo "   - Domains completion status"
    echo "   - Key metrics"
    echo ""
    echo "   Run: cd reality/agent-reality-auditor/integration-connector"
    echo "        python3 connector.py"
fi

# Check for retroactive disclosure if created recently
FILE_AGE=$(stat -c %Y "$SESSION_FILE")
CURRENT_TIME=$(date +%s)
AGE_MINUTES=$(( (CURRENT_TIME - FILE_AGE) / 60 ))

if [ "$AGE_MINUTES" -gt 30 ]; then
    echo "📋 Session log age: $AGE_MINUTES minutes"
    if ! grep -q "RETROACTIVE DISCLOSURE" "$SESSION_FILE"; then
        echo "⚠️  WARNING: Older session log missing retroactive disclosure"
        echo "   Add constitutional disclosure per Article VII"
    fi
fi

echo "✅ Session Log Protocol Check Complete"
echo "=================================================="