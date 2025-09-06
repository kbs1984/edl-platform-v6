#!/bin/bash
---
session: "00114"
type: "script"
status: "current"
created: "2025-08-30"
title: "Environment Configuration Validator"
purpose: "Validate environment variables and configuration across local and production"
language: "bash"
category: "validation"
topics: ["environment", "validation", "configuration", "troubleshooting"]
priority: "P1"
domain: "reconciliation"
---

# Environment Configuration Validator

echo "✅ EDL Platform Environment Validation"
echo "======================================"
echo ""

# Store original directory
ORIGINAL_DIR=$(pwd)

echo "📋 LOCAL ENVIRONMENT VALIDATION"
echo "-------------------------------"

# Check local .env files
echo "Local Environment Files:"
if [ -f "reconciliation/active-work/auth-gateway/.env.local" ]; then
    echo "  ✅ Auth Gateway .env.local exists"
    # Check if it has required variables
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" reconciliation/active-work/auth-gateway/.env.local; then
        echo "     ✅ Contains Supabase URL"
    else
        echo "     ❌ Missing NEXT_PUBLIC_SUPABASE_URL"
    fi
    
    if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" reconciliation/active-work/auth-gateway/.env.local; then
        echo "     ✅ Contains Supabase Anon Key"
    else
        echo "     ❌ Missing NEXT_PUBLIC_SUPABASE_ANON_KEY"
    fi
else
    echo "  ❌ Auth Gateway .env.local missing"
    echo "     Create: reconciliation/active-work/auth-gateway/.env.local"
fi

if [ -f "reconciliation/active-work/dashboard/.env.local" ]; then
    echo "  ✅ Dashboard .env.local exists"
    # Check if it has required variables
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" reconciliation/active-work/dashboard/.env.local; then
        echo "     ✅ Contains Supabase URL"
    else
        echo "     ❌ Missing NEXT_PUBLIC_SUPABASE_URL"
    fi
    
    if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" reconciliation/active-work/dashboard/.env.local; then
        echo "     ✅ Contains Supabase Anon Key"
    else
        echo "     ❌ Missing NEXT_PUBLIC_SUPABASE_ANON_KEY"
    fi
else
    echo "  ❌ Dashboard .env.local missing"
    echo "     Create: reconciliation/active-work/dashboard/.env.local"
fi

echo ""
echo "🌐 VERCEL ENVIRONMENT VALIDATION"
echo "--------------------------------"

echo "Auth Gateway Vercel Environment:"
cd reconciliation/active-work/auth-gateway
if vercel env ls >/dev/null 2>&1; then
    VERCEL_ENVS=$(vercel env ls 2>/dev/null | grep -E "(NEXT_PUBLIC_SUPABASE|Production|Preview)" | wc -l)
    if [ "$VERCEL_ENVS" -gt 0 ]; then
        echo "  ✅ Vercel environment variables configured ($VERCEL_ENVS found)"
        vercel env ls | head -10
    else
        echo "  ❌ No Vercel environment variables found"
        echo "     Run: vercel env add NEXT_PUBLIC_SUPABASE_URL"
        echo "     Run: vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY"
    fi
else
    echo "  ❌ Not linked to Vercel project"
    echo "     Run: vercel link"
fi

echo ""
echo "Dashboard Vercel Environment:"
cd ../dashboard
if vercel env ls >/dev/null 2>&1; then
    VERCEL_ENVS=$(vercel env ls 2>/dev/null | grep -E "(NEXT_PUBLIC_SUPABASE|Production|Preview)" | wc -l)
    if [ "$VERCEL_ENVS" -gt 0 ]; then
        echo "  ✅ Vercel environment variables configured ($VERCEL_ENVS found)"
        vercel env ls | head -10
    else
        echo "  ❌ No Vercel environment variables found"
        echo "     Run: vercel env add NEXT_PUBLIC_SUPABASE_URL"
        echo "     Run: vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY"
    fi
else
    echo "  ❌ Not linked to Vercel project"
    echo "     Run: vercel link"
fi

cd "$ORIGINAL_DIR"

echo ""
echo "🔧 BUILD VALIDATION"
echo "-------------------"

echo "Testing local builds..."

echo "Auth Gateway Build Test:"
cd reconciliation/active-work/auth-gateway
if npm run build >/dev/null 2>&1; then
    echo "  ✅ Auth gateway builds successfully"
else
    echo "  ❌ Auth gateway build fails"
    echo "     Run: npm run build (check for TypeScript errors)"
fi

echo "Dashboard Build Test:"
cd ../dashboard
if npm run build >/dev/null 2>&1; then
    echo "  ✅ Dashboard builds successfully"
else
    echo "  ❌ Dashboard build fails"
    echo "     Run: npm run build (check for TypeScript errors)"
fi

cd "$ORIGINAL_DIR"

echo ""
echo "🌐 SUPABASE CONNECTION TEST"
echo "---------------------------"

# Test Supabase connection
cd reconciliation/active-work/auth-gateway
echo "Testing Supabase connectivity..."

# Create temporary test file
cat > temp_supabase_test.js << 'EOF'
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Environment variables missing');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection with a simple query
supabase.from('profiles').select('count').limit(1)
    .then(({ data, error }) => {
        if (error) {
            console.log('❌ Supabase connection failed:', error.message);
        } else {
            console.log('✅ Supabase connection successful');
        }
        process.exit(0);
    })
    .catch(err => {
        console.log('❌ Connection error:', err.message);
        process.exit(1);
    });
EOF

if command -v node >/dev/null 2>&1 && [ -f "node_modules/@supabase/supabase-js/package.json" ]; then
    node temp_supabase_test.js
else
    echo "⚠️  Cannot test Supabase connection (missing Node.js or dependencies)"
    echo "   Run: npm install"
fi

# Clean up
rm -f temp_supabase_test.js

cd "$ORIGINAL_DIR"

echo ""
echo "📊 VALIDATION SUMMARY"
echo "====================="
echo ""
echo "🔧 If you see any ❌ errors above:"
echo "  1. Fix local .env.local files first"
echo "  2. Configure Vercel environment variables"
echo "  3. Ensure builds pass locally"
echo "  4. Test Supabase connection"
echo ""
echo "✅ When all checks pass:"
echo "  • Local development: npm run dev"
echo "  • Deploy to production: ./scripts/00114-deploy-both.sh"
echo "  • Check live status: ./scripts/00114-check-environment.sh"