#!/bin/bash
---
session: "00114"
type: "script"
status: "current"
created: "2025-08-30"
title: "Safe Deployment Protocol with Automated Safeguards"
purpose: "Deploy to Vercel with comprehensive safety checks and rollback capability"
language: "bash"
category: "deployment"
topics: ["deployment", "safety", "automation", "vercel", "protocol"]
priority: "P0"
domain: "reconciliation"
---

# Safe Deployment Protocol with Automated Safeguards
# Can be run by either human or Claude Code with confidence

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
MAX_BUILD_TIME=180  # 3 minutes max
HEALTH_CHECK_RETRIES=5
HEALTH_CHECK_DELAY=10

echo -e "${BLUE}🛡️  SAFE DEPLOYMENT PROTOCOL v1.0${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# Function to check prerequisites
check_prerequisites() {
    echo -e "${YELLOW}📋 Phase 1: Prerequisites Check${NC}"
    
    # Check Vercel CLI
    if ! command -v vercel &> /dev/null; then
        echo -e "${RED}❌ Vercel CLI not installed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Vercel CLI found$(NC)"
    
    # Check Node version
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 20 ]; then
        echo -e "${RED}❌ Node version must be 20 or higher${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Node version acceptable (v$(node --version))${NC}"
    
    # Check git status
    UNCOMMITTED=$(git status --porcelain | wc -l)
    if [ "$UNCOMMITTED" -gt 0 ]; then
        echo -e "${YELLOW}⚠️  Warning: $UNCOMMITTED uncommitted changes${NC}"
        echo "   Consider committing before deployment"
    fi
    
    echo ""
}

# Function to validate environment variables
validate_environment() {
    local PROJECT_DIR=$1
    local PROJECT_NAME=$2
    
    echo -e "${YELLOW}📋 Phase 2: Environment Validation for $PROJECT_NAME${NC}"
    
    cd "$PROJECT_DIR"
    
    # Pull production environment variables
    vercel env pull .env.validate --environment production > /dev/null 2>&1
    
    # Check for Supabase variables
    if ! grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.validate; then
        echo -e "${RED}❌ Missing NEXT_PUBLIC_SUPABASE_URL${NC}"
        rm -f .env.validate
        return 1
    fi
    
    if ! grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.validate; then
        echo -e "${RED}❌ Missing NEXT_PUBLIC_SUPABASE_ANON_KEY${NC}"
        rm -f .env.validate
        return 1
    fi
    
    # Check for newline contamination
    if grep -E "\\\\n\"$" .env.validate > /dev/null; then
        echo -e "${RED}❌ Environment variables contain newline characters${NC}"
        echo "   Run: vercel env rm NEXT_PUBLIC_SUPABASE_URL"
        echo "   Run: vercel env rm NEXT_PUBLIC_SUPABASE_ANON_KEY"
        echo "   Then re-add them without newlines"
        rm -f .env.validate
        return 1
    fi
    
    echo -e "${GREEN}✅ Environment variables validated${NC}"
    rm -f .env.validate
    echo ""
}

# Function to test local build
test_local_build() {
    local PROJECT_DIR=$1
    local PROJECT_NAME=$2
    
    echo -e "${YELLOW}📋 Phase 3: Local Build Test for $PROJECT_NAME${NC}"
    
    cd "$PROJECT_DIR"
    
    # Test build locally
    echo "   Testing build locally..."
    if npm run build > /tmp/build-output.log 2>&1; then
        echo -e "${GREEN}✅ Local build successful${NC}"
    else
        echo -e "${RED}❌ Local build failed${NC}"
        echo "   Check /tmp/build-output.log for details"
        tail -20 /tmp/build-output.log
        return 1
    fi
    echo ""
}

# Function to deploy with monitoring
deploy_with_monitoring() {
    local PROJECT_DIR=$1
    local PROJECT_NAME=$2
    local FORCE_FLAG=$3
    
    echo -e "${YELLOW}📋 Phase 4: Deploying $PROJECT_NAME${NC}"
    
    cd "$PROJECT_DIR"
    
    # Get current production URL before deployment
    CURRENT_URL=$(vercel ls --prod 2>/dev/null | grep "Production" | awk '{print $2}' | head -1)
    
    # Deploy with optional force flag
    if [ "$FORCE_FLAG" == "--force" ]; then
        echo "   Deploying with cache bypass..."
        DEPLOY_OUTPUT=$(vercel --prod --force 2>&1)
    else
        echo "   Deploying..."
        DEPLOY_OUTPUT=$(vercel --prod 2>&1)
    fi
    
    # Extract new deployment URL
    NEW_URL=$(echo "$DEPLOY_OUTPUT" | grep "Production:" | awk '{print $2}')
    
    if [ -z "$NEW_URL" ]; then
        echo -e "${RED}❌ Deployment failed - no URL returned${NC}"
        echo "$DEPLOY_OUTPUT"
        return 1
    fi
    
    echo -e "${GREEN}✅ Deployed to: $NEW_URL${NC}"
    echo ""
}

# Function to perform health check
health_check() {
    local URL=$1
    local PROJECT_NAME=$2
    
    echo -e "${YELLOW}📋 Phase 5: Health Check for $PROJECT_NAME${NC}"
    
    # Wait for deployment to stabilize
    echo "   Waiting for deployment to stabilize..."
    sleep 5
    
    # Perform health checks
    for i in $(seq 1 $HEALTH_CHECK_RETRIES); do
        echo "   Health check attempt $i/$HEALTH_CHECK_RETRIES..."
        
        HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$URL" 2>/dev/null || echo "000")
        
        if [ "$HTTP_STATUS" == "200" ] || [ "$HTTP_STATUS" == "307" ] || [ "$HTTP_STATUS" == "401" ]; then
            echo -e "${GREEN}✅ Health check passed (HTTP $HTTP_STATUS)${NC}"
            return 0
        fi
        
        if [ $i -lt $HEALTH_CHECK_RETRIES ]; then
            echo "   Got HTTP $HTTP_STATUS, retrying in ${HEALTH_CHECK_DELAY}s..."
            sleep $HEALTH_CHECK_DELAY
        fi
    done
    
    echo -e "${RED}❌ Health check failed after $HEALTH_CHECK_RETRIES attempts${NC}"
    return 1
}

# Function to create rollback script
create_rollback_script() {
    local PROJECT_NAME=$1
    local PREVIOUS_DEPLOYMENT=$2
    
    cat > /tmp/rollback-$PROJECT_NAME.sh << EOF
#!/bin/bash
echo "Rolling back $PROJECT_NAME to $PREVIOUS_DEPLOYMENT"
vercel alias set $PREVIOUS_DEPLOYMENT $PROJECT_NAME.vercel.app
echo "Rollback complete"
EOF
    chmod +x /tmp/rollback-$PROJECT_NAME.sh
    
    echo -e "${BLUE}ℹ️  Rollback script created: /tmp/rollback-$PROJECT_NAME.sh${NC}"
}

# Main deployment function
deploy_project() {
    local PROJECT_DIR=$1
    local PROJECT_NAME=$2
    local FORCE_FLAG=$3
    
    echo -e "${BLUE}🚀 Deploying $PROJECT_NAME${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    # Run all phases
    if ! validate_environment "$PROJECT_DIR" "$PROJECT_NAME"; then
        echo -e "${RED}❌ Environment validation failed for $PROJECT_NAME${NC}"
        return 1
    fi
    
    if ! test_local_build "$PROJECT_DIR" "$PROJECT_NAME"; then
        echo -e "${RED}❌ Local build test failed for $PROJECT_NAME${NC}"
        return 1
    fi
    
    if ! deploy_with_monitoring "$PROJECT_DIR" "$PROJECT_NAME" "$FORCE_FLAG"; then
        echo -e "${RED}❌ Deployment failed for $PROJECT_NAME${NC}"
        return 1
    fi
    
    # Get the production URL
    cd "$PROJECT_DIR"
    PROD_URL=$(vercel ls --prod 2>/dev/null | grep "https://" | head -1 | awk '{print $NF}')
    
    if ! health_check "$PROD_URL" "$PROJECT_NAME"; then
        echo -e "${RED}❌ Health check failed for $PROJECT_NAME${NC}"
        create_rollback_script "$PROJECT_NAME" "$CURRENT_URL"
        return 1
    fi
    
    echo -e "${GREEN}✅ $PROJECT_NAME deployment successful!${NC}"
    echo ""
    return 0
}

# Parse arguments
FORCE_FLAG=""
if [ "$1" == "--force" ]; then
    FORCE_FLAG="--force"
    echo -e "${YELLOW}⚠️  Force flag enabled - cache will be bypassed${NC}"
fi

# Store original directory
ORIGINAL_DIR=$(pwd)

# Run prerequisites check
check_prerequisites

# Deployment decision
echo -e "${BLUE}📦 Projects to Deploy:${NC}"
echo "  1. Auth Gateway"
echo "  2. Dashboard"
echo "  3. Both (recommended)"
echo ""
read -p "Select option (1/2/3): " DEPLOY_CHOICE

case $DEPLOY_CHOICE in
    1)
        deploy_project "$ORIGINAL_DIR/reconciliation/active-work/auth-gateway" "auth-gateway" "$FORCE_FLAG"
        ;;
    2)
        deploy_project "$ORIGINAL_DIR/reconciliation/active-work/dashboard" "dashboard" "$FORCE_FLAG"
        ;;
    3)
        AUTH_SUCCESS=false
        DASH_SUCCESS=false
        
        if deploy_project "$ORIGINAL_DIR/reconciliation/active-work/auth-gateway" "auth-gateway" "$FORCE_FLAG"; then
            AUTH_SUCCESS=true
        fi
        
        if deploy_project "$ORIGINAL_DIR/reconciliation/active-work/dashboard" "dashboard" "$FORCE_FLAG"; then
            DASH_SUCCESS=true
        fi
        
        # Summary
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${BLUE}📊 DEPLOYMENT SUMMARY${NC}"
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        
        if [ "$AUTH_SUCCESS" == true ]; then
            echo -e "${GREEN}✅ Auth Gateway: Deployed successfully${NC}"
        else
            echo -e "${RED}❌ Auth Gateway: Deployment failed${NC}"
        fi
        
        if [ "$DASH_SUCCESS" == true ]; then
            echo -e "${GREEN}✅ Dashboard: Deployed successfully${NC}"
        else
            echo -e "${RED}❌ Dashboard: Deployment failed${NC}"
        fi
        ;;
    *)
        echo -e "${RED}Invalid option${NC}"
        exit 1
        ;;
esac

# Return to original directory
cd "$ORIGINAL_DIR"

echo ""
echo -e "${BLUE}🔍 Next Steps:${NC}"
echo "  1. Test auth flow at production URLs"
echo "  2. Monitor Vercel dashboard for errors"
echo "  3. Run health checks: ./scripts/00114-check-environment.sh"
echo ""
echo -e "${GREEN}✨ Safe deployment protocol complete!${NC}"