#!/bin/bash
# ---
# session: "00081"
# type: "script"
# status: "unknown"
# created: "2025-08-28"
# title: "00081-setup-local-development.sh"
# purpose: "Set up both auth and dashboard apps for local development"
# language: "bash"
# category: "utility"
# topics: ["utility"]
# priority: "P2"
# domain: "core"
# ---
# Session 00081: Configure for Local Development
# Purpose: Set up both auth and dashboard apps for local development
# Saves Vercel deployment for when we're ready

echo "🔧 Configuring EDL Platform for Local Development"
echo "================================================="
echo ""

# Backup existing production configs
echo "📦 Backing up production configs..."
if [ -f "truth-seed/emdash-auth-main/.env.local" ]; then
    cp truth-seed/emdash-auth-main/.env.local truth-seed/emdash-auth-main/.env.production.local
    echo "✅ Backed up auth production config"
fi

if [ -f "truth-seed/emdash-dashboard-main/.env.local" ]; then
    cp truth-seed/emdash-dashboard-main/.env.local truth-seed/emdash-dashboard-main/.env.production.local
    echo "✅ Backed up dashboard production config"
fi

# Configure Auth App for Local
echo ""
echo "🔐 Configuring Auth App..."
cat > truth-seed/emdash-auth-main/.env.local << 'EOF'
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://bbrheacetxlnqbibjwsz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE

# Local Development Configuration
AUTH_URL=localhost:3000
DASHBOARD_URL=localhost:3001
LANDING_URL=localhost:3000
ROOT_URL=localhost

# Protocol for local
PROTOCOL=http://

# OAuth Redirect URL for local
NEXT_PUBLIC_REDIRECT_URL=http://localhost:3000/auth/callback
EOF
echo "✅ Auth app configured for localhost:3000"

# Configure Dashboard App for Local
echo ""
echo "📊 Configuring Dashboard App..."
cat > truth-seed/emdash-dashboard-main/.env.local << 'EOF'
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://bbrheacetxlnqbibjwsz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE

# Local Development Configuration
NEXT_PUBLIC_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_DASHBOARD_URL=http://localhost:3001
EOF
echo "✅ Dashboard app configured for localhost:3001"

# Update package.json for simpler local startup (optional)
echo ""
echo "📝 Note: The auth app is configured to use auth.localhost.localdomain"
echo "   This may require adding to /etc/hosts:"
echo "   127.0.0.1 auth.localhost.localdomain"
echo "   127.0.0.1 dashboard.localhost.localdomain"
echo ""
echo "   OR you can modify the dev script in package.json to use just localhost"

# Instructions for running
echo ""
echo "🚀 HOW TO RUN LOCALLY:"
echo "====================="
echo ""
echo "1️⃣ Terminal 1 - Auth App (port 3000):"
echo "   cd truth-seed/emdash-auth-main"
echo "   npm run dev"
echo "   → Access at: http://localhost:3000"
echo ""
echo "2️⃣ Terminal 2 - Dashboard App (port 3001):"
echo "   cd truth-seed/emdash-dashboard-main"
echo "   npm run dev -- --port 3001"
echo "   → Access at: http://localhost:3001"
echo ""
echo "📝 IMPORTANT SUPABASE SETTINGS:"
echo "================================"
echo "Add these to Supabase Dashboard → Authentication → URL Configuration:"
echo ""
echo "✅ Site URL:"
echo "   http://localhost:3000"
echo ""
echo "✅ Redirect URLs (add all):"
echo "   http://localhost:3000/auth/callback"
echo "   http://localhost:3001"
echo "   http://localhost:3001/onboarding"
echo "   http://localhost:3001/dashboard"
echo ""
echo "🎯 TESTING THE FLOW:"
echo "===================="
echo "1. Sign up at http://localhost:3000/sign-up"
echo "2. Check email for verification link"
echo "3. Click link (will redirect to localhost:3000/auth/callback)"
echo "4. Should then redirect to http://localhost:3001/onboarding"
echo "5. Complete onboarding"
echo "6. Access dashboard at http://localhost:3001"
echo ""
echo "💾 PRODUCTION DEPLOYMENT:"
echo "========================="
echo "When ready to deploy to Vercel:"
echo "1. Restore production configs:"
echo "   mv truth-seed/emdash-auth-main/.env.production.local truth-seed/emdash-auth-main/.env.local"
echo "   mv truth-seed/emdash-dashboard-main/.env.production.local truth-seed/emdash-dashboard-main/.env.local"
echo "2. Deploy to Vercel"
echo "3. Update Supabase redirect URLs for production domains"
echo ""
echo "✅ Local development setup complete!"