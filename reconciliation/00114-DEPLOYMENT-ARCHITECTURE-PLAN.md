---
session: "00114"
type: "plan"
status: "current"
created: "2025-08-30"
title: "Multi-Genre Platform Deployment Architecture Plan"
purpose: "Define deployment strategy for emdash platform with auth gateway and genre-specific dashboards"
topics: ["deployment", "architecture", "vercel", "github", "platform", "multi-genre"]
priority: "P0"
domain: "reconciliation"
implements: ["00110-VERCEL-DEPLOYMENT-ASSESSMENT.md", "00111-github-workflow-guide.md"]
related_to: ["00089-GITHUB-VERCEL-FOUNDATION.md"]
---

# Multi-Genre Platform Deployment Architecture Plan

**Session**: 114
**Date**: 2025-08-30
**Decision**: Separate deployments for auth gateway and genre dashboards
**Target Implementation**: Session 115

---

## 🎯 Executive Summary

Deploy the emdash platform as **separate, independent services** rather than a monorepo, based on the multi-genre platform vision where:
- **Auth Gateway**: Universal authentication for ALL genres (debate, art, music)
- **Genre Dashboards**: Independent applications for each community

This architecture supports the platform's growth from debate (current) to art and music (future).

---

## 📊 Platform Architecture

### Conceptual Structure
```
emdash Platform
│
├── 🔐 Infrastructure Services (Shared)
│   └── auth-gateway/
│       ├── Universal login/signup
│       ├── Profile management
│       ├── SSO for all genres
│       └── Permission management
│
├── 🎭 Genre Applications (Independent)
│   ├── debate-dashboard/    [CURRENT FOCUS]
│   │   ├── Tournament management
│   │   ├── Judge assignments
│   │   └── Debate-specific features
│   │
│   ├── art-dashboard/        [FUTURE]
│   │   ├── Portfolio management
│   │   ├── Gallery features
│   │   └── Art competitions
│   │
│   └── music-dashboard/      [FUTURE]
│       ├── Track management
│       ├── Playlist features
│       └── Music competitions
│
└── 📦 Shared Resources
    ├── Database (Supabase)
    ├── Types/Interfaces
    └── UI Components (future)
```

### Why Separation Makes Sense
1. **Scale Independence**: Auth handles all users; genres handle their subset
2. **Development Velocity**: Teams can iterate on genres without touching auth
3. **Deployment Safety**: Fix debate bugs without auth downtime
4. **Team Autonomy**: Future genre teams work independently

---

## 🚀 Implementation Plan for Session 115

### Phase 1: Vercel Project Setup (Hour 1)

#### Step 1.1: Create Vercel Projects
```bash
# Using Vercel CLI (already installed)
cd reconciliation/active-work/auth-gateway
vercel link --yes
# Project name: emdash-auth

cd ../dashboard
vercel link --yes  
# Project name: emdash-debate
```

#### Step 1.2: Configure Environment Variables
```bash
# Both projects need (via Vercel Dashboard or CLI)
NEXT_PUBLIC_SUPABASE_URL=https://bbrheacetxlnqbibjwsz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Auth Gateway specific
NEXT_PUBLIC_APP_URL=https://auth.emdash.com
NEXT_PUBLIC_REDIRECT_URLS=https://debate.emdash.com,https://art.emdash.com

# Debate Dashboard specific
NEXT_PUBLIC_APP_URL=https://debate.emdash.com
NEXT_PUBLIC_AUTH_URL=https://auth.emdash.com
```

#### Step 1.3: Create Deployment Configurations
```bash
# reconciliation/active-work/auth-gateway/vercel.json
cat > reconciliation/active-work/auth-gateway/vercel.json << 'EOF'
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_APP_TYPE": "auth-gateway"
  }
}
EOF

# reconciliation/active-work/dashboard/vercel.json
cat > reconciliation/active-work/dashboard/vercel.json << 'EOF'
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_APP_TYPE": "debate-dashboard"
  }
}
EOF
```

---

### Phase 2: GitHub CI/CD Setup (Hour 2)

#### Step 2.1: Create GitHub Actions Workflow
```yaml
# .github/workflows/deploy-auth.yml
name: Deploy Auth Gateway
on:
  push:
    branches: [main]
    paths:
      - 'reconciliation/active-work/auth-gateway/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_AUTH_PROJECT_ID }}
          working-directory: ./reconciliation/active-work/auth-gateway
```

```yaml
# .github/workflows/deploy-debate.yml
name: Deploy Debate Dashboard
on:
  push:
    branches: [main]
    paths:
      - 'reconciliation/active-work/dashboard/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_DEBATE_PROJECT_ID }}
          working-directory: ./reconciliation/active-work/dashboard
```

#### Step 2.2: Configure GitHub Secrets
```bash
# Add via GitHub UI or CLI
gh secret set VERCEL_TOKEN
gh secret set VERCEL_ORG_ID
gh secret set VERCEL_AUTH_PROJECT_ID
gh secret set VERCEL_DEBATE_PROJECT_ID
```

---

### Phase 3: Domain Configuration (Hour 3)

#### Step 3.1: Domain Structure Options

**Option A: Subdomains (Recommended)**
```
auth.emdash.com     → Auth Gateway
debate.emdash.com   → Debate Dashboard
art.emdash.com      → Art Dashboard (future)
music.emdash.com    → Music Dashboard (future)
```

**Option B: Path-based**
```
emdash.com/auth     → Auth Gateway
emdash.com/debate   → Debate Dashboard
emdash.com/art      → Art Dashboard (future)
emdash.com/music    → Music Dashboard (future)
```

#### Step 3.2: Configure in Vercel
```bash
# Via Vercel Dashboard
# 1. Go to Project Settings → Domains
# 2. Add custom domain
# 3. Configure DNS records

# Or via CLI
vercel domains add auth.emdash.com --project emdash-auth
vercel domains add debate.emdash.com --project emdash-debate
```

---

### Phase 4: Testing & Validation (Hour 4)

#### Step 4.1: Local Testing Script
```bash
# scripts/00115-test-deployments.sh
#!/bin/bash

echo "🧪 Testing Deployment Configuration"

# Test auth build
cd reconciliation/active-work/auth-gateway
npm run build || exit 1
echo "✅ Auth gateway builds successfully"

# Test dashboard build
cd ../dashboard
npm run build || exit 1
echo "✅ Debate dashboard builds successfully"

# Test environment variables
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
  echo "❌ Missing NEXT_PUBLIC_SUPABASE_URL"
  exit 1
fi

echo "✅ All pre-deployment checks passed"
```

#### Step 4.2: Deployment Verification
```bash
# scripts/00115-verify-deployment.sh
#!/bin/bash

# Check auth deployment
AUTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://auth.emdash.com)
if [ $AUTH_STATUS -eq 200 ]; then
  echo "✅ Auth gateway is live"
else
  echo "❌ Auth gateway returned $AUTH_STATUS"
fi

# Check debate deployment
DEBATE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://debate.emdash.com)
if [ $DEBATE_STATUS -eq 200 ]; then
  echo "✅ Debate dashboard is live"
else
  echo "❌ Debate dashboard returned $DEBATE_STATUS"
fi
```

---

### Phase 5: Reality Agent Updates (Hour 5)

#### Step 5.1: Complete Vercel Agent
```python
# reality/agent-reality-auditor/vercel-connector/connector.py
# Add deployment trigger capability
def trigger_deployment(project_name):
    """Trigger Vercel deployment for specific project"""
    if project_name == "auth":
        os.system("cd reconciliation/active-work/auth-gateway && vercel --prod")
    elif project_name == "debate":
        os.system("cd reconciliation/active-work/dashboard && vercel --prod")
```

#### Step 5.2: Create Deployment Monitor
```python
# scripts/00115-monitor-deployments.py
import requests
import json

def check_deployment_status():
    """Check status of all platform deployments"""
    deployments = {
        "auth": "https://auth.emdash.com/api/health",
        "debate": "https://debate.emdash.com/api/health"
    }
    
    results = {}
    for name, url in deployments.items():
        try:
            response = requests.get(url, timeout=5)
            results[name] = {
                "status": "healthy" if response.status_code == 200 else "unhealthy",
                "code": response.status_code
            }
        except:
            results[name] = {"status": "unreachable", "code": 0}
    
    return results
```

---

## 📋 Critical Path Checklist for Session 115

### Pre-Flight Checks
- [ ] Verify Vercel CLI is installed (`vercel --version`)
- [ ] Confirm both apps build locally
- [ ] Check Supabase connection from both apps
- [ ] Verify environment variables are set

### Deployment Sequence
1. [ ] Deploy auth-gateway to staging first
2. [ ] Test auth flow completely
3. [ ] Deploy auth-gateway to production
4. [ ] Deploy debate-dashboard to staging
5. [ ] Test debate features with auth
6. [ ] Deploy debate-dashboard to production
7. [ ] Configure custom domains
8. [ ] Update DNS records

### Post-Deployment
- [ ] Verify both deployments are healthy
- [ ] Test complete user flow (signup → login → debate)
- [ ] Monitor for errors in Vercel dashboard
- [ ] Document any issues for next session

---

## 🚨 Potential Issues & Solutions

### Issue 1: CORS Between Domains
**Problem**: Auth at auth.emdash.com, Dashboard at debate.emdash.com
**Solution**: Configure CORS headers in auth-gateway:
```javascript
// auth-gateway/next.config.js
headers: async () => [
  {
    source: "/api/:path*",
    headers: [
      { key: "Access-Control-Allow-Origin", value: "https://debate.emdash.com" },
    ]
  }
]
```

### Issue 2: Shared Session Management
**Problem**: User logs in at auth, needs session at debate
**Solution**: Implement JWT tokens or Supabase session sharing

### Issue 3: Environment Variable Sync
**Problem**: Same Supabase keys needed in multiple projects
**Solution**: Use Vercel environment variable groups or GitHub secrets

---

## 🎯 Success Criteria

1. **Auth Gateway**
   - [ ] Accessible at auth.emdash.com (or designated URL)
   - [ ] Users can sign up and log in
   - [ ] Redirects work to debate dashboard

2. **Debate Dashboard**
   - [ ] Accessible at debate.emdash.com (or designated URL)
   - [ ] Requires authentication from auth gateway
   - [ ] All debate features functional

3. **CI/CD Pipeline**
   - [ ] Push to main auto-deploys
   - [ ] Deployment completes in < 5 minutes
   - [ ] No manual intervention required

4. **Monitoring**
   - [ ] Reality agents can check deployment status
   - [ ] Health endpoints return 200
   - [ ] Errors are logged and visible

---

## 📚 Resources for Session 115

### Key Files to Review
- `reality/00110-VERCEL-DEPLOYMENT-ASSESSMENT.md` - Current state analysis
- `scripts/00111-github-workflow-guide.md` - GitHub best practices
- `core/00089-GITHUB-VERCEL-FOUNDATION.md` - Foundation principles

### External Documentation
- [Vercel CLI Docs](https://vercel.com/docs/cli)
- [GitHub Actions for Vercel](https://github.com/marketplace/actions/vercel-action)
- [Next.js Multi-Zone](https://nextjs.org/docs/advanced-features/multi-zones)

### Environment Variables Needed
```env
# Both Projects
NEXT_PUBLIC_SUPABASE_URL=https://bbrheacetxlnqbibjwsz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE

# Deployment Tokens (get from Vercel dashboard)
VERCEL_TOKEN=xxx
VERCEL_ORG_ID=xxx
VERCEL_AUTH_PROJECT_ID=xxx
VERCEL_DEBATE_PROJECT_ID=xxx
```

---

## 🔄 Future Considerations

### When Adding Art/Music Genres
1. Create new Vercel project
2. Add GitHub Action workflow
3. Configure subdomain
4. Share auth gateway
5. Independent deployment

### Potential Shared Package (Future)
```
packages/
├── @emdash/ui          # Shared components
├── @emdash/types       # TypeScript interfaces
└── @emdash/auth-client # Auth integration
```

---

## 📝 Session 115 Handoff Notes

**Primary Goal**: Get auth-gateway and debate-dashboard deployed to production

**Priority Order**:
1. Set up Vercel projects
2. Configure environment variables
3. Deploy to staging
4. Test thoroughly
5. Deploy to production
6. Set up CI/CD (if time permits)

**Questions to Resolve**:
1. Domain name and structure preference
2. Whether to implement CI/CD immediately or manual deploy first
3. Any specific features that must work before going live

**Time Estimate**: 4-5 hours for complete implementation

---

**Session 114 Sign-off**: Architecture validated, detailed plan created, ready for Session 115 implementation.