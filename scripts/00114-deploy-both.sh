#!/bin/bash
---
session: "00114"
type: "script"
status: "current"
created: "2025-08-30"
title: "Deploy Both Applications to Production"
purpose: "One-command deployment of auth-gateway and dashboard to Vercel"
language: "bash"
category: "deployment"
topics: ["deployment", "vercel", "automation"]
priority: "P1"
domain: "reconciliation"
---

# Deploy Both Applications to Production

echo "🚀 EDL Platform Production Deployment"
echo "====================================="
echo ""

# Store original directory
ORIGINAL_DIR=$(pwd)

echo "📦 DEPLOYING AUTH GATEWAY"
echo "-------------------------"
cd reconciliation/active-work/auth-gateway

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in auth-gateway directory"
    cd "$ORIGINAL_DIR"
    exit 1
fi

echo "Building and deploying auth gateway..."
vercel --prod --confirm

if [ $? -eq 0 ]; then
    echo "✅ Auth gateway deployment successful"
    AUTH_SUCCESS=true
else
    echo "❌ Auth gateway deployment failed"
    AUTH_SUCCESS=false
fi

echo ""
echo "📦 DEPLOYING DASHBOARD"
echo "----------------------"
cd ../dashboard

# Check if we're in the right directory  
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in dashboard directory"
    cd "$ORIGINAL_DIR"
    exit 1
fi

echo "Building and deploying dashboard..."
vercel --prod --confirm

if [ $? -eq 0 ]; then
    echo "✅ Dashboard deployment successful"
    DASH_SUCCESS=true
else
    echo "❌ Dashboard deployment failed"
    DASH_SUCCESS=false
fi

# Return to original directory
cd "$ORIGINAL_DIR"

echo ""
echo "📊 DEPLOYMENT SUMMARY"
echo "====================="

if [ "$AUTH_SUCCESS" = true ] && [ "$DASH_SUCCESS" = true ]; then
    echo "🎉 Both deployments successful!"
    echo ""
    echo "🌐 Live URLs:"
    echo "  Auth Gateway: https://auth-gateway-7kke6yhrm-briankims-projects.vercel.app"
    echo "  Dashboard:    https://dashboard-562yhrmup-briankims-projects.vercel.app"
    echo ""
    echo "✅ Next Steps:"
    echo "  1. Test auth flow on live URLs"
    echo "  2. Verify all features work in production"
    echo "  3. Share URLs with stakeholders if ready"
    
elif [ "$AUTH_SUCCESS" = true ] && [ "$DASH_SUCCESS" = false ]; then
    echo "⚠️  Mixed results: Auth deployed, Dashboard failed"
    echo "   Check dashboard build errors and retry"
    
elif [ "$AUTH_SUCCESS" = false ] && [ "$DASH_SUCCESS" = true ]; then
    echo "⚠️  Mixed results: Dashboard deployed, Auth failed" 
    echo "   Check auth gateway build errors and retry"
    
else
    echo "❌ Both deployments failed"
    echo "   Check build errors and fix before retrying"
    exit 1
fi

echo ""
echo "🔍 Verify deployments:"
echo "  ./scripts/00114-check-environment.sh"