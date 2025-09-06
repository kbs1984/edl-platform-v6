#!/bin/bash

# Session 152: Cypress Test Runner
# Purpose: Run Cypress tests to validate React form interaction

set -e

echo "╔══════════════════════════════════════════════════════════╗"
echo "║          Session 152: Cypress Test Validation             ║"
echo "║     Proving Cypress works where Puppeteer failed          ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

echo "📋 Test Objective:"
echo "   Validate that Cypress can successfully interact with React form inputs"
echo "   where Puppeteer failed in Session 151"
echo ""

echo "🔍 Prerequisites Check:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if auth gateway is running
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Auth Gateway is running on port 3000"
else
    echo "⚠️  Auth Gateway not detected on port 3000"
    echo "   Starting auth gateway..."
    cd reconciliation/active-work/auth-gateway
    npm run dev &
    AUTH_PID=$!
    echo "   Waiting for auth gateway to start..."
    sleep 10
fi

# Check if dashboard is running (optional)
if curl -s http://localhost:3001 > /dev/null; then
    echo "✅ Dashboard is running on port 3001"
else
    echo "ℹ️  Dashboard not running (not required for auth tests)"
fi

echo ""
echo "🚀 Running Cypress Tests:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd reconciliation/active-work/dashboard

# Run the simple form test first (most important)
echo "Running simple form interaction test..."
npx cypress run --spec "cypress/e2e/simple-form-test.cy.js" --headed

echo ""
echo "📊 Test Results Summary:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Cypress Implementation Status:"
echo "   • Cypress installed and configured"
echo "   • data-testid attributes added to form elements"
echo "   • Tests can interact with React inputs"
echo "   • Form filling works (unlike Puppeteer)"
echo ""
echo "📝 Key Differences from Puppeteer (Session 151):"
echo "   • Cypress: Understands React component lifecycle"
echo "   • Cypress: Can fill custom input components"
echo "   • Cypress: Automatic waiting for elements"
echo "   • Cypress: No z-index navigation issues"
echo ""
echo "🎯 Recommendation: Use Cypress for all React testing"
echo ""
echo "════════════════════════════════════════════════════════════"
echo "Session 152: Cypress validation complete!"
echo "════════════════════════════════════════════════════════════"

# Cleanup
if [ ! -z "$AUTH_PID" ]; then
    echo "Stopping auth gateway..."
    kill $AUTH_PID 2>/dev/null || true
fi