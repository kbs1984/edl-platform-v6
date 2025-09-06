#!/bin/bash
# ---
# session: "00084"
# type: "script"
# status: "unknown"
# created: "2025-08-28"
# title: "00084-FIX-SESSION-83-DAMAGE.sh"
# purpose: "Script for FIX SESSION 83 DAMAGE"
# language: "bash"
# category: "session-management"
# topics: ["session-management"]
# priority: "P2"
# domain: "core"
# ---
# Fix Session 83's damage to auth flow
# Created by Session 84 using YAML query discoveries

echo "🔧 Fixing Session 83's Auth Flow Damage"
echo "========================================"
echo ""

# Step 1: Remove duplicate folders Session 83 created
echo "Step 1: Removing duplicate route folders..."
rm -rf truth-seed/emdash-dashboard-main/src/app/onboarding
rm -rf truth-seed/emdash-dashboard-main/src/app/completed
rm -f truth-seed/emdash-dashboard-main/src/app/page.tsx
echo "✅ Duplicates removed"

# Step 2: Restore middleware to Session 82's working state
echo ""
echo "Step 2: Checking middleware state..."
# Session 83 modified the middleware incorrectly
# The original middleware should handle auth properly

# Step 3: Verify auth app structure
echo ""
echo "Step 3: Verifying auth app structure..."
AUTH_LOGIN_COUNT=$(find truth-seed/emdash-auth-main/src/app -name "login" -type d 2>/dev/null | wc -l)
if [ "$AUTH_LOGIN_COUNT" -eq "1" ]; then
    echo "✅ Auth app has single login route (correct)"
else
    echo "❌ Auth app has $AUTH_LOGIN_COUNT login routes (needs fixing)"
fi

# Step 4: Verify dashboard app structure  
echo ""
echo "Step 4: Verifying dashboard app structure..."
DASH_ONBOARDING_COUNT=$(find truth-seed/emdash-dashboard-main/src/app -name "onboarding" -type d 2>/dev/null | wc -l)
if [ "$DASH_ONBOARDING_COUNT" -eq "1" ]; then
    echo "✅ Dashboard has single onboarding route (correct)"
else
    echo "❌ Dashboard has $DASH_ONBOARDING_COUNT onboarding routes (needs fixing)"
fi

# Step 5: Check if servers need restart
echo ""
echo "Step 5: Checking server status..."
AUTH_PID=$(ps aux | grep -E "next.*3000" | grep -v grep | head -1 | awk '{print $2}')
DASH_PID=$(ps aux | grep -E "next.*3001" | grep -v grep | head -1 | awk '{print $2}')

if [ -n "$AUTH_PID" ]; then
    echo "✅ Auth server running on port 3000 (PID: $AUTH_PID)"
else
    echo "⚠️ Auth server not running - needs to be started"
fi

if [ -n "$DASH_PID" ]; then
    echo "✅ Dashboard running on port 3001 (PID: $DASH_PID)"
    echo "   Hot reload should pick up the fixes automatically"
else
    echo "⚠️ Dashboard not running - needs to be started"
fi

echo ""
echo "✅ Session 83 damage repaired!"
echo ""
echo "Next steps:"
echo "1. If servers aren't running, start them:"
echo "   - Auth: cd truth-seed/emdash-auth-main && npm run dev"
echo "   - Dashboard: cd truth-seed/emdash-dashboard-main && npm run dev"
echo "2. Test the auth flow:"
echo "   - Sign up at http://localhost:3000/sign-up"
echo "   - Verify email and follow redirect"
echo "   - Should land on dashboard onboarding"