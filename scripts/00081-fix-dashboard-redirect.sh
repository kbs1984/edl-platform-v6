#!/bin/bash
# Session 00081: Fix dashboard redirect for local development

echo "📝 Updating auth app environment to redirect locally..."

# Update the auth app's environment file
cat > truth-seed/emdash-auth-main/.env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL="https://bbrheacetxlnqbibjwsz.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE"

# For local development - redirect to localhost
AUTH_URL="http://localhost:3000"
DASHBOARD_URL="http://localhost:3001"
NEXT_PUBLIC_REDIRECT_URL="http://localhost:3001"
EOF

echo "✅ Auth environment updated"
echo ""
echo "📝 Setting up dashboard environment..."

# Ensure dashboard has proper environment
cat > truth-seed/emdash-dashboard-main/.env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL="https://bbrheacetxlnqbibjwsz.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE"
EOF

echo "✅ Dashboard environment configured"
echo ""
echo "🚀 Now start both apps:"
echo ""
echo "Terminal 1 (Auth):"
echo "  cd truth-seed/emdash-auth-main"
echo "  npm run dev"
echo ""
echo "Terminal 2 (Dashboard):"
echo "  cd truth-seed/emdash-dashboard-main"
echo "  npm install --legacy-peer-deps  # if needed"
echo "  npm run dev -- --port 3001"
echo ""
echo "Then test the flow again at http://localhost:3000"