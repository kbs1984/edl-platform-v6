#!/bin/bash
# Session 115: Test Authentication Flow
# Tests the deployed auth-gateway and dashboard integration

echo "======================================"
echo "Session 115: Authentication Flow Test"
echo "======================================"
echo ""

AUTH_URL="https://auth-gateway-e5hxot2wm-briankims-projects.vercel.app"
DASHBOARD_URL="https://dashboard-c9507elln-briankims-projects.vercel.app"

echo "1. Testing Auth Gateway Login Page..."
LOGIN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$AUTH_URL/login")
echo "   Login page status: $LOGIN_STATUS"
if [ "$LOGIN_STATUS" == "200" ]; then
    echo "   ✅ Login page accessible"
else
    echo "   ⚠️  Unexpected status: $LOGIN_STATUS"
fi

echo ""
echo "2. Testing Auth Gateway Sign-up Page..."
SIGNUP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$AUTH_URL/sign-up")
echo "   Sign-up page status: $SIGNUP_STATUS"
if [ "$SIGNUP_STATUS" == "200" ]; then
    echo "   ✅ Sign-up page accessible"
else
    echo "   ⚠️  Unexpected status: $SIGNUP_STATUS"
fi

echo ""
echo "3. Testing Dashboard (requires auth)..."
DASHBOARD_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DASHBOARD_URL")
echo "   Dashboard status: $DASHBOARD_STATUS"
if [ "$DASHBOARD_STATUS" == "401" ]; then
    echo "   ✅ Dashboard correctly requires authentication"
else
    echo "   ⚠️  Unexpected status: $DASHBOARD_STATUS"
fi

echo ""
echo "4. Testing Dashboard Onboarding Route..."
ONBOARDING_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DASHBOARD_URL/onboarding")
echo "   Onboarding status: $ONBOARDING_STATUS"
if [ "$ONBOARDING_STATUS" == "401" ]; then
    echo "   ✅ Onboarding correctly requires authentication"
else
    echo "   ⚠️  Unexpected status: $ONBOARDING_STATUS"
fi

echo ""
echo "======================================"
echo "Test Summary:"
echo "- Auth Gateway: $AUTH_URL"
echo "- Dashboard: $DASHBOARD_URL"
echo ""
echo "Authentication flow structure:"
echo "1. User visits auth-gateway login"
echo "2. Successful login redirects to dashboard"
echo "3. New users without profile redirect to /onboarding"
echo "4. Both dashboard routes require authentication"
echo "======================================"