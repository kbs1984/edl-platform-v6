#!/bin/bash

# Session 00088: Evidence Gathering Script
# Enforces evidence-based debugging to prevent guesswork
# Run this BEFORE making any code changes

set -e

echo "==========================================="
echo "   EVIDENCE GATHERING - Anti-Guesswork"
echo "   Session 00088 Protocol Enforcement"
echo "==========================================="
echo ""

# Function to pause and wait for user
pause_for_review() {
    echo ""
    echo "Press ENTER to continue..."
    read
}

echo "📊 Step 1: Current Git State"
echo "-----------------------------"
echo "Checking what's actually changed..."
git status --short
echo ""
echo "Detailed diff of changes:"
git diff --stat
pause_for_review

echo "🔍 Step 2: Check Recent Session Work"
echo "-------------------------------------"
echo "Last 5 session logs:"
ls -la archive/sessions/SESSION-*-LOG.md | tail -5
echo ""
echo "Last 5 handoffs:"
ls -la archive/sessions/SESSION-*-HANDOFF.md | tail -5
pause_for_review

echo "📚 Step 3: Query YAML for Existing Solutions"
echo "--------------------------------------------"
echo "Enter the topic to search (e.g., 'auth', 'onboarding', 'middleware'):"
read SEARCH_TOPIC

if [ ! -z "$SEARCH_TOPIC" ]; then
    python3 scripts/00059-yaml-query.py --topic "$SEARCH_TOPIC" | head -20
fi
pause_for_review

echo "🔬 Step 4: Check Reality (Database State)"
echo "-----------------------------------------"
echo "Running reality agent checks..."

# Check if services are running
echo "Services running on ports:"
lsof -i :3000,3001,3002,3003 2>/dev/null | grep LISTEN || echo "No services found on standard ports"
echo ""

# Check environment variables
echo "Environment variables status:"
if [ -f truth-seed/emdash-dashboard-main/.env.local ]; then
    echo "Dashboard env vars:"
    grep -E "PROTOCOL|AUTH_URL|DASHBOARD_URL" truth-seed/emdash-dashboard-main/.env.local || echo "Key vars not found"
fi
echo ""
if [ -f truth-seed/emdash-auth-main/.env.local ]; then
    echo "Auth env vars:"
    grep -E "DASHBOARD_URL|AUTH_URL" truth-seed/emdash-auth-main/.env.local || echo "Key vars not found"
fi
pause_for_review

echo "📋 Step 5: Check for Known Issues"
echo "---------------------------------"
echo "Common issues from Sessions 83, 87, 88:"
echo ""
echo "1. File constructor (Node 18 issue):"
grep -r "new File" truth-seed --include="*.tsx" --include="*.ts" 2>/dev/null | head -5 || echo "No File constructor usage found"
echo ""
echo "2. Missing middleware.ts:"
ls -la truth-seed/*/src/middleware.ts 2>/dev/null || echo "No root middleware.ts files found"
echo ""
echo "3. Undefined env vars:"
grep -r "process.env.PROTOCOL\|process.env.AUTH_URL" truth-seed --include="*.tsx" --include="*.ts" 2>/dev/null | head -5 || echo "No PROTOCOL/AUTH_URL usage found"
pause_for_review

echo "📊 Step 6: Generate Evidence Report"
echo "-----------------------------------"

EVIDENCE_FILE="/tmp/evidence-report-$(date +%H%M%S).md"
cat > "$EVIDENCE_FILE" << EOF
# Evidence Report - $(date)

## Git Status
\`\`\`
$(git status --short)
\`\`\`

## Recent Sessions
$(ls -la archive/sessions/SESSION-*-LOG.md | tail -3)

## Running Services
$(lsof -i :3000,3001,3002,3003 2>/dev/null | grep LISTEN || echo "None on standard ports")

## Next Steps
1. Review the evidence above
2. Check if issue already fixed in previous sessions
3. Make ONE targeted change based on evidence
4. Test that single change
5. Only then make next change

## Anti-Guesswork Reminder
- Session 83: Guesswork created mess
- Session 87: Evidence-based = success  
- Session 88: Guesswork made it worse

Don't guess. Use evidence.
EOF

echo "Evidence report saved to: $EVIDENCE_FILE"
echo ""

echo "✅ Evidence Gathering Complete"
echo "=============================="
echo ""
echo "DECISION POINT:"
echo "1. If you found an existing fix -> Apply it"
echo "2. If you found the real cause -> Fix that specific issue"
echo "3. If still unclear -> Gather more evidence"
echo ""
echo "Remember: ONE change at a time, test after EACH change"
echo ""
echo "Ready to proceed with evidence-based debugging!"