#!/bin/bash

# Session 00076: Complete Auth Implementation Script
# Based on findings from Sessions 74-77
# Purpose: Get auth and dashboard working locally, then production

echo "🚀 EDL Auth & Dashboard Implementation"
echo "======================================"
echo "Session 00076 - Reconciliation Implementation"
echo ""

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -d "truth-seed" ]; then
    echo -e "${RED}❌ Error: Not in edl-platform-v6 directory${NC}"
    echo "Please run from project root"
    exit 1
fi

echo -e "${YELLOW}📋 Phase 1: Local Development Setup${NC}"
echo "--------------------------------------"

# Step 1: Setup Auth App
echo -e "${GREEN}1. Setting up Auth App...${NC}"
cd truth-seed/emdash-auth-main

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "   Installing dependencies..."
    npm install
fi

# Create root middleware if missing
if [ ! -f "src/middleware.ts" ]; then
    echo "   ✨ Creating missing root middleware..."
    cp ../../scripts/00076-middleware-fix.ts src/middleware.ts
    echo "   ✅ Middleware created"
else
    echo "   ✅ Middleware exists"
fi

# Check .env.development
if [ -f ".env.development" ]; then
    echo "   ✅ Using .env.development for local config"
    echo "      Domain: auth.localhost.localdomain"
    echo "      Port: 3000"
else
    echo -e "   ${YELLOW}⚠️  No .env.development found${NC}"
fi

# Step 2: Setup Dashboard App
echo -e "${GREEN}2. Setting up Dashboard App...${NC}"
cd ../emdash-dashboard-main

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "   Installing dependencies..."
    npm install
fi

# Create root middleware if missing
if [ ! -f "src/middleware.ts" ]; then
    echo "   ✨ Creating missing root middleware..."
    cp ../../scripts/00076-middleware-fix.ts src/middleware.ts
    # Adjust for dashboard-specific routes
    sed -i "s|'/login'|'/auth/login'|g" src/middleware.ts
    echo "   ✅ Middleware created"
else
    echo "   ✅ Middleware exists"
fi

# Check .env.development
if [ -f ".env.development" ]; then
    echo "   ✅ Using .env.development for local config"
    echo "      Domain: dashboard.localhost.localdomain"
    echo "      Port: 3001 (from env file)"
else
    echo -e "   ${YELLOW}⚠️  No .env.development found${NC}"
fi

cd ../..

echo ""
echo -e "${YELLOW}📋 Phase 2: Supabase Configuration${NC}"
echo "--------------------------------------"

echo "Please verify in Supabase Dashboard:"
echo "1. Go to: Authentication → URL Configuration"
echo "2. Add these to 'Redirect URLs':"
echo "   - http://auth.localhost.localdomain:3000/auth/callback"
echo "   - http://dashboard.localhost.localdomain:3001"
echo "   - https://auth.edl-platform.vercel.app/auth/callback"
echo "   - https://dashboard.edl-platform.vercel.app"
echo ""
echo "Press Enter when complete..."
read

echo ""
echo -e "${YELLOW}📋 Phase 3: Start Applications${NC}"
echo "--------------------------------------"

echo "To start the applications, run in separate terminals:"
echo ""
echo -e "${GREEN}Terminal 1 - Auth App:${NC}"
echo "cd truth-seed/emdash-auth-main"
echo "npm run dev"
echo ""
echo -e "${GREEN}Terminal 2 - Dashboard App:${NC}"
echo "cd truth-seed/emdash-dashboard-main"
echo "npm run dev"
echo ""
echo "The apps will run on:"
echo "- Auth: http://auth.localhost.localdomain:3000"
echo "- Dashboard: http://dashboard.localhost.localdomain:3001"
echo ""

echo -e "${YELLOW}📋 Testing Instructions${NC}"
echo "--------------------------------------"
echo "1. Visit http://auth.localhost.localdomain:3000/sign-up"
echo "2. Create a new account"
echo "3. Check email for verification"
echo "4. Click verification link"
echo "5. Should redirect to dashboard at :3001"
echo "6. Complete 3-step onboarding"
echo "7. Access dashboard features"
echo ""

echo -e "${YELLOW}📋 Verification Queries${NC}"
echo "--------------------------------------"
echo "Run these in Supabase SQL Editor to verify:"
echo ""
cat << 'EOF'
-- Check if new user was created with profile and student
SELECT 
    u.email,
    u.id as user_id,
    p.id as profile_id,
    s.user_id as student_id,
    p.call_sign,
    s.division,
    s.level
FROM auth.users u
LEFT JOIN profile p ON p.id = u.id
LEFT JOIN student s ON s.user_id = u.id
WHERE u.created_at > NOW() - INTERVAL '1 hour'
ORDER BY u.created_at DESC;
EOF

echo ""
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo "Session 00076 implementation ready for testing"
echo ""
echo "If you encounter issues, check:"
echo "1. scripts/00077-auth-verification-findings.md"
echo "2. scripts/00076-auth-dashboard-action-plan.md"
echo "3. The trio document for latest findings"