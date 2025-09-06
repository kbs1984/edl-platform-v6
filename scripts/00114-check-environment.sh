#!/bin/bash
---
session: "00114"
type: "script"
status: "current"
created: "2025-08-30"
title: "Environment Check - Local + Live Status"
purpose: "Quick check of both local development and live production environments"
language: "bash"
category: "environment-management"
topics: ["environment", "status-check", "development", "production"]
priority: "P1"
domain: "reconciliation"
---

# Environment Check - Local + Live Status

echo "🔍 EDL Platform Environment Check"
echo "=================================="
echo ""

echo "📍 LOCAL DEVELOPMENT ENVIRONMENT"
echo "--------------------------------"
echo "  Auth Gateway:     http://localhost:3000"
echo "  Dashboard:        http://localhost:3001"
echo ""

# Check if local dev servers are running
AUTH_LOCAL=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null || echo "000")
DASH_LOCAL=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001 2>/dev/null || echo "000")

if [ "$AUTH_LOCAL" = "200" ] || [ "$AUTH_LOCAL" = "401" ]; then
    echo "  Auth Status:      ✅ Running ($AUTH_LOCAL)"
else
    echo "  Auth Status:      ❌ Not running"
    echo "                    Run: cd reconciliation/active-work/auth-gateway && npm run dev"
fi

if [ "$DASH_LOCAL" = "200" ] || [ "$DASH_LOCAL" = "401" ]; then
    echo "  Dashboard Status: ✅ Running ($DASH_LOCAL)"
else
    echo "  Dashboard Status: ❌ Not running"
    echo "                    Run: cd reconciliation/active-work/dashboard && npm run dev"
fi

echo ""
echo "🌐 LIVE PRODUCTION ENVIRONMENT"
echo "------------------------------"
echo "  Auth Gateway:     https://auth-gateway-7kke6yhrm-briankims-projects.vercel.app"
echo "  Dashboard:        https://dashboard-562yhrmup-briankims-projects.vercel.app"
echo ""

# Check live production status
AUTH_LIVE=$(curl -s -o /dev/null -w "%{http_code}" https://auth-gateway-7kke6yhrm-briankims-projects.vercel.app 2>/dev/null || echo "000")
DASH_LIVE=$(curl -s -o /dev/null -w "%{http_code}" https://dashboard-562yhrmup-briankims-projects.vercel.app 2>/dev/null || echo "000")

if [ "$AUTH_LIVE" = "200" ] || [ "$AUTH_LIVE" = "401" ]; then
    echo "  Auth Status:      ✅ Live ($AUTH_LIVE)"
else
    echo "  Auth Status:      ❌ Unreachable ($AUTH_LIVE)"
fi

if [ "$DASH_LIVE" = "200" ] || [ "$DASH_LIVE" = "401" ]; then
    echo "  Dashboard Status: ✅ Live ($DASH_LIVE)"
else
    echo "  Dashboard Status: ❌ Unreachable ($DASH_LIVE)"
fi

echo ""
echo "📊 ENVIRONMENT SUMMARY"
echo "----------------------"

# Summary recommendations
if [ "$AUTH_LOCAL" != "000" ] && [ "$DASH_LOCAL" != "000" ]; then
    echo "  Local Development: ✅ Ready for development work"
else
    echo "  Local Development: ⚠️  Start dev servers for local work"
fi

if [ "$AUTH_LIVE" != "000" ] && [ "$DASH_LIVE" != "000" ]; then
    echo "  Live Production:   ✅ Ready for user testing"
else
    echo "  Live Production:   ❌ Check Vercel deployments"
fi

echo ""
echo "💡 USAGE RECOMMENDATIONS"
echo "------------------------"
echo "  🏠 Use Local For:     Feature development, debugging, rapid iteration"
echo "  🌐 Use Live For:      Auth testing, user demos, device testing"
echo ""
echo "🔄 Quick Actions:"
echo "  Start Local:      npm run dev (in both app directories)"
echo "  Deploy to Live:   ./scripts/00114-deploy-both.sh"
echo "  Check Status:     ./scripts/00114-check-environment.sh"