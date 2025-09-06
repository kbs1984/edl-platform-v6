#!/bin/bash
---
session: "00114"
type: "script"
status: "current"
created: "2025-08-30"
title: "Diagnose Authentication Failure on Live Deployment"
purpose: "Debug why users can't sign up despite reaching thank-you page"
language: "bash"
category: "debugging"
topics: ["auth", "deployment", "supabase", "troubleshooting"]
priority: "P0"
domain: "reconciliation"
---

# Diagnose Authentication Failure on Live Deployment

echo "🔍 DEBUGGING AUTH FAILURE - Session 114"
echo "Issue: User reaches thank-you page but not created in Supabase"
echo "Deployed URLs:"
echo "  Auth: https://auth-gateway-7kke6yhrm-briankims-projects.vercel.app"
echo "  Dashboard: https://dashboard-562yhrmup-briankims-projects.vercel.app"
echo ""

# 1. Check Vercel Environment Variables
echo "1️⃣ Checking Vercel Environment Variables..."
echo ""

# Check auth-gateway env vars
echo "📋 Auth Gateway Environment Variables:"
cd reconciliation/active-work/auth-gateway
vercel env ls

echo ""
echo "📋 Dashboard Environment Variables:"
cd ../dashboard
vercel env ls

cd ../../..

echo ""
echo "2️⃣ Testing Supabase Connection from Local..."

# Test local Supabase connection
cd reconciliation/active-work/auth-gateway
node -e "
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

console.log('🔗 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('🔑 Anon Key (first 20 chars):', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...');

// Test connection
supabase.from('profiles').select('count').limit(1)
  .then(({ data, error }) => {
    if (error) {
      console.log('❌ Connection failed:', error.message);
    } else {
      console.log('✅ Connection successful');
    }
  })
  .catch(err => console.log('❌ Connection error:', err.message));
"

cd ../../..

echo ""
echo "3️⃣ Checking Supabase Auth Configuration..."

# Check recent auth activity
python3 << 'EOF'
import os
import sys
sys.path.append('.')

# Use the MCP execute_sql via subprocess to check auth logs
import subprocess
import json

print("📊 Recent User Creation Activity (last 24 hours):")
try:
    result = subprocess.run([
        'python3', '-c', 
        """
from mcp__supabase_dev__execute_sql import mcp__supabase_dev__execute_sql
result = mcp__supabase_dev__execute_sql(
    query="SELECT email, created_at FROM auth.users WHERE created_at > NOW() - INTERVAL '24 hours' ORDER BY created_at DESC;"
)
print(result)
        """
    ], capture_output=True, text=True)
    print("Result:", result.stdout)
    if result.stderr:
        print("Error:", result.stderr)
except Exception as e:
    print("Failed to check recent users:", str(e))

EOF

echo ""
echo "4️⃣ Testing Live Deployment Endpoints..."

# Test auth gateway health
echo "🌐 Testing Auth Gateway Health:"
AUTH_URL="https://auth-gateway-7kke6yhrm-briankims-projects.vercel.app"
curl -I "$AUTH_URL" 2>/dev/null || echo "❌ Auth gateway unreachable"

# Test specific auth endpoints
echo ""
echo "🔐 Testing Auth API Endpoints:"
curl -X POST "$AUTH_URL/api/auth/signup" \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com"}' \
     -v 2>&1 | grep -E "HTTP|Content-Type|Location" || echo "❌ Signup endpoint test failed"

echo ""
echo "5️⃣ Recommendations Based on Diagnosis:"
echo ""
echo "🔧 POTENTIAL FIXES:"
echo ""
echo "1. Supabase Site URL Configuration:"
echo "   - Go to Supabase Dashboard > Settings > API"
echo "   - Add to 'Site URL': $AUTH_URL"
echo "   - Add to 'Redirect URLs': $AUTH_URL/thank-you"
echo ""
echo "2. Environment Variable Sync:"
echo "   - Run: vercel env pull"
echo "   - Verify NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo ""
echo "3. Email Provider Configuration:"
echo "   - Check Supabase Dashboard > Authentication > Settings"
echo "   - Verify email templates have correct redirect URLs"
echo ""
echo "4. Enable Email Confirmation:"
echo "   - Supabase Dashboard > Authentication > Settings"
echo "   - Check 'Enable email confirmations' setting"
echo ""
echo "📝 Next Steps:"
echo "   1. Run this script to gather data"
echo "   2. Check Supabase dashboard settings"
echo "   3. Update Site URL and Redirect URLs"
echo "   4. Test signup flow again"
echo ""
echo "🚀 Script complete. Review output above for specific issues."