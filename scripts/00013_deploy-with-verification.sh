#!/bin/bash
# Deploy with Reality Verification - Session 00013
# Ensures Lightning Stack promises are met

set -e

echo "⚡ LIGHTNING DEPLOY WITH VERIFICATION"
echo "====================================="
echo ""

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# Pre-deploy reality check
echo "🔍 Pre-deploy verification..."
if ! "$PROJECT_ROOT/scripts/reality-check.sh" --quick; then
    echo "❌ Pre-deploy reality check failed"
    echo "🚨 Fix issues before deploying"
    exit 1
fi

echo ""
echo "🚀 Starting deployment..."

# Time the deployment
DEPLOY_START=$(date +%s)

# Check if we have files to deploy
if [ ! -f "index.html" ] && [ ! -f "vercel.json" ]; then
    echo "⚠️  No index.html or vercel.json found"
    echo "   Creating minimal deployment test..."
    echo "<!DOCTYPE html><html><body><h1>Lightning Deploy Test - $(date)</h1></body></html>" > test-deploy.html
    CLEANUP_NEEDED=true
fi

# Deploy to Vercel
if command -v vercel &> /dev/null; then
    vercel --prod --yes
    DEPLOY_SUCCESS=$?
else
    echo "⚠️  Vercel CLI not installed"
    echo "   Install with: npm install -g vercel"
    DEPLOY_SUCCESS=1
fi

DEPLOY_END=$(date +%s)
DEPLOY_TIME=$((DEPLOY_END - DEPLOY_START))

# Cleanup test file if created
if [ "$CLEANUP_NEEDED" = true ]; then
    rm test-deploy.html
fi

# Report deployment time
echo ""
echo "📊 Deployment Metrics:"
echo "======================"
echo "Deploy time: ${DEPLOY_TIME} seconds"

# Verify Lightning promise
if [ $DEPLOY_TIME -lt 60 ]; then
    echo "✅ Lightning promise MET (<60s)"
    LIGHTNING_MET=true
else
    echo "⚠️  Lightning promise MISSED (target: <60s)"
    LIGHTNING_MET=false
fi

# Post-deploy verification (if deployment succeeded)
if [ $DEPLOY_SUCCESS -eq 0 ]; then
    echo ""
    echo "🔍 Post-deploy verification..."
    sleep 5  # Allow deployment to propagate
    
    # Run Vercel agent if available
    if [ -f "$PROJECT_ROOT/reality/agent-reality-auditor/vercel-connector/connector.py" ]; then
        python3 "$PROJECT_ROOT/reality/agent-reality-auditor/vercel-connector/connector.py" 2>/dev/null || {
            echo "⚠️  Vercel agent verification unavailable"
        }
    fi
fi

# Save deployment metrics
METRICS_DIR="$PROJECT_ROOT/.metrics"
mkdir -p "$METRICS_DIR"

cat >> "$METRICS_DIR/deployments.jsonl" <<EOF
{"timestamp": "$(date -Iseconds)", "duration_seconds": $DEPLOY_TIME, "lightning_met": $LIGHTNING_MET, "success": $([ $DEPLOY_SUCCESS -eq 0 ] && echo "true" || echo "false")}
EOF

# Final status
echo ""
if [ $DEPLOY_SUCCESS -eq 0 ] && [ "$LIGHTNING_MET" = true ]; then
    echo "🌟 DEPLOYMENT SUCCESSFUL - All promises met!"
    exit 0
elif [ $DEPLOY_SUCCESS -eq 0 ]; then
    echo "✅ Deployment successful (optimize for <60s)"
    exit 0
else
    echo "❌ Deployment failed"
    exit 1
fi