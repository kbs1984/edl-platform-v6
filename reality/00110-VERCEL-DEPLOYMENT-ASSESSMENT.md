---
session: "00110"
type: "assessment"
status: "current"
created: "2025-08-29"
title: "Vercel Deployment Assessment and MCP Server Recommendation"
purpose: "Assess current Vercel workflow and recommend deployment strategy"
topics: ["vercel", "deployment", "mcp-server", "auth", "dashboard"]
priority: "P1"
domain: "reality"
---

# Vercel Deployment Assessment and MCP Server Recommendation

**Session**: 110
**Date**: 2025-08-29
**Focus**: Evaluating Vercel deployment readiness as we approach auth/dashboard completion

---

## 📊 Current Vercel Setup Status

### What We Have:

#### 1. **Vercel Reality Agent** (Session 8 - Partial Implementation)
```python
# Location: reality/agent-reality-auditor/vercel-connector/connector.py
- Basic structure created in Session 8
- Has API token hardcoded: 'vSwBtmN7Em4UyvUYIfKpie7h'
- Project ID: 'prj_ssLAwCWAujrODuMzgoAgwtb3MPxq'
- Can check connection (Level 1)
- Can check deployments (Level 2)
- NOT integrated into reality check scripts
- Status: **SKELETON ONLY - Not Operational**
```

#### 2. **Vercel CLI** (Installed)
```bash
Version: 44.7.3
Location: /home/b4sho/.npm-global/bin/vercel
Status: ✅ Ready to use
```

#### 3. **Vercel Configuration** 
```json
// vercel.json - Points to truth-seed auth
{
  "buildCommand": "cd truth-seed/emdash-auth-main && npm install && npm run build",
  "outputDirectory": "truth-seed/emdash-auth-main/.next",
  "installCommand": "cd truth-seed/emdash-auth-main && npm install",
  "framework": "nextjs"
}
```
**Issue**: Configuration points to truth-seed, not reconciliation/active-work

---

## 🚨 Critical Gaps

### 1. **No Vercel MCP Server Available**
- Checked Claude MCP registry - no Vercel server exists
- Would need to build custom MCP server or use CLI directly

### 2. **Deployment Configuration Mismatch**
- `vercel.json` points to `truth-seed/emdash-auth-main`
- Active development in `reconciliation/active-work/`
- Need to update configuration for proper deployment

### 3. **Two Separate Apps Need Deployment**
- **Auth Gateway**: Port 3000 (reconciliation/active-work/auth-gateway or truth-seed/emdash-auth-main)
- **Dashboard**: Port 3001 (reconciliation/active-work/dashboard or truth-seed/emdash-dashboard-main)
- Need separate Vercel projects or monorepo setup

### 4. **Domain Configuration Unknown**
- You mentioned "using my domain" but domain details not in codebase
- Need to configure custom domain in Vercel

---

## 🎯 Deployment Readiness Assessment

### Auth Gateway Status:
- **reconciliation/active-work/auth-gateway**: Modified truth-seed version
- **truth-seed/emdash-auth-main**: Original reference
- **Ready**: ✅ Can deploy, but need to choose which version

### Dashboard Status:
- **reconciliation/active-work/dashboard**: Active development version
- **truth-seed/emdash-dashboard-main**: Original reference
- **Ready**: ⚠️ Depends on database state and RLS policies

### Database Requirements:
- Supabase project: ✅ Connected and operational
- Migrations: ✅ Applied via MCP
- RLS Policies: ⚠️ Recently modified (Session 109)
- Functions: ⚠️ Need verification with execute_sql

---

## 💡 Recommendations

### Option 1: Direct Vercel CLI Deployment (Recommended)
```bash
# For Auth Gateway
cd reconciliation/active-work/auth-gateway
vercel --prod

# For Dashboard  
cd reconciliation/active-work/dashboard
vercel --prod
```

**Pros**:
- Simple, immediate deployment
- Vercel CLI already installed
- Can configure domains directly

**Cons**:
- Manual process
- No programmatic verification

### Option 2: Build Custom Vercel MCP Server
Create a minimal MCP server that wraps Vercel CLI:

```javascript
// Conceptual structure
const vercelMCP = {
  deploy: async (projectPath, options) => {
    // Execute: vercel --prod --cwd projectPath
  },
  getDomains: async () => {
    // Execute: vercel domains ls
  },
  getLogs: async (deploymentId) => {
    // Execute: vercel logs deploymentId
  }
}
```

**Pros**:
- Programmatic control
- Can verify deployments
- Integrates with Claude Code

**Cons**:
- Development time required
- Another component to maintain

### Option 3: Enhance Existing Vercel Agent
Complete the Session 8 skeleton:
1. Integrate into reality check scripts
2. Add deployment triggering capability
3. Add domain management
4. Add environment variable management

---

## 📋 Immediate Action Plan

### Step 1: Update vercel.json
Create two configurations:
```json
// vercel-auth.json
{
  "buildCommand": "npm install && npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs",
  "root": "reconciliation/active-work/auth-gateway"
}

// vercel-dashboard.json
{
  "buildCommand": "npm install && npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs",
  "root": "reconciliation/active-work/dashboard"
}
```

### Step 2: Environment Variables
Both apps need:
```env
NEXT_PUBLIC_SUPABASE_URL=https://bbrheacetxlnqbibjwsz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### Step 3: Deploy Sequence
1. Deploy auth gateway first (users need to sign up)
2. Test auth flow completely
3. Deploy dashboard (requires authenticated users)
4. Configure custom domain

---

## 🚀 MCP Server Decision

**Recommendation**: **DON'T build Vercel MCP server yet**

**Reasoning**:
1. Vercel CLI is sufficient for current needs
2. Only 2 apps to deploy (not frequent)
3. Development effort better spent on features
4. Can revisit if deployment becomes frequent

**Alternative**: Use bash scripts for deployment automation:
```bash
#!/bin/bash
# deploy-all.sh
echo "Deploying Auth Gateway..."
cd reconciliation/active-work/auth-gateway && vercel --prod

echo "Deploying Dashboard..."
cd reconciliation/active-work/dashboard && vercel --prod
```

---

## ✅ Next Steps

1. **Clarify which version to deploy**:
   - truth-seed (original) 
   - reconciliation/active-work (modified)

2. **Provide domain details** for configuration

3. **Run test deployment** to staging first

4. **Complete Vercel Agent** if programmatic monitoring needed

5. **Consider monorepo setup** for easier management

---

## Summary

**Vercel Workflow Status**: Partially ready, needs configuration updates
**MCP Server Need**: Not critical - CLI sufficient
**Deployment Readiness**: 70% - Need to resolve version choice and domain config
**Recommended Path**: Direct CLI deployment with script automation