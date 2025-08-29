---
session: "00110"
type: "guide"
status: "draft"
created: "2025-08-29"
title: "Monorepo Migration Plan for Vercel Deployment"
purpose: "Define step-by-step plan to restructure auth/dashboard into monorepo for deployment"
topics: ["monorepo", "vercel", "deployment", "turborepo", "architecture"]
priority: "P1"
domain: "reconciliation"
---

# Monorepo Migration Plan for Vercel Deployment

**Session**: 110
**Decision Date**: 2025-08-29
**Target Implementation**: Session 111+
**Architecture Decision**: Monorepo using Turborepo

---

## 🎯 Executive Summary

Restructure `reconciliation/active-work/` from separate projects into a monorepo for simplified deployment, shared code, and better maintainability.

---

## 📊 Current Structure

```
reconciliation/active-work/
├── auth-gateway/          # Separate Next.js app
│   ├── package.json
│   ├── src/
│   └── .env.local
├── dashboard/             # Separate Next.js app
│   ├── package.json
│   ├── src/
│   └── .env.local
└── lib/                   # Shared code (informal)
```

**Problems**:
- Duplicate dependencies
- Separate environment files
- No formal code sharing
- Complex deployment coordination

---

## 🎯 Target Structure

```
reconciliation/active-work/
├── apps/
│   ├── auth/              # Auth gateway (port 3000)
│   │   ├── package.json
│   │   ├── next.config.js
│   │   └── src/
│   └── dashboard/         # Dashboard app (port 3001)
│       ├── package.json
│       ├── next.config.js
│       └── src/
├── packages/
│   ├── database/          # Supabase types & client
│   │   ├── package.json
│   │   ├── types.ts
│   │   └── client.ts
│   ├── ui/                # Shared UI components
│   │   ├── package.json
│   │   └── components/
│   └── config/            # Shared configs
│       ├── package.json
│       └── eslint/
├── .env                   # Single environment file
├── turbo.json            # Turborepo config
├── package.json          # Workspace root
└── vercel.json           # Monorepo deployment config
```

---

## 📋 Step-by-Step Migration Plan

### Phase 1: Preparation (Session 111)

#### Step 1.1: Create Workspace Root
```bash
cd reconciliation/active-work
npm init -y
```

#### Step 1.2: Configure Workspace Package.json
```json
{
  "name": "edl-platform-monorepo",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "start": "turbo run start",
    "lint": "turbo run lint",
    "deploy": "turbo run deploy"
  },
  "devDependencies": {
    "turbo": "latest",
    "prettier": "latest",
    "eslint": "latest"
  }
}
```

#### Step 1.3: Install Turborepo
```bash
npm install turbo -D
```

#### Step 1.4: Create Directory Structure
```bash
mkdir -p apps packages/database packages/ui packages/config
```

---

### Phase 2: Migration (Session 111)

#### Step 2.1: Move Auth Gateway
```bash
# Backup current state
cp -r auth-gateway auth-gateway.backup

# Move to apps directory
mv auth-gateway apps/auth

# Update package.json name
sed -i 's/"name": ".*"/"name": "@edl/auth"/' apps/auth/package.json
```

#### Step 2.2: Move Dashboard
```bash
# Backup current state
cp -r dashboard dashboard.backup

# Move to apps directory
mv dashboard apps/dashboard

# Update package.json name
sed -i 's/"name": ".*"/"name": "@edl/dashboard"/' apps/dashboard/package.json
```

#### Step 2.3: Extract Shared Database Code
```bash
# Create database package
cat > packages/database/package.json << 'EOF'
{
  "name": "@edl/database",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "dependencies": {
    "@supabase/supabase-js": "^2.43.5"
  }
}
EOF

# Move shared Supabase config
mv apps/auth/src/utils/supabase packages/database/src/
```

#### Step 2.4: Create Shared UI Package
```bash
cat > packages/ui/package.json << 'EOF'
{
  "name": "@edl/ui",
  "version": "1.0.0",
  "main": "./src/index.tsx",
  "types": "./src/index.tsx",
  "dependencies": {
    "react": "^18.2.0",
    "@radix-ui/react-dialog": "^1.0.5"
  }
}
EOF
```

---

### Phase 3: Configuration (Session 111)

#### Step 3.1: Configure Turborepo
```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local", ".env"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "deploy": {
      "dependsOn": ["build"],
      "env": ["VERCEL_URL", "NEXT_PUBLIC_SUPABASE_URL"]
    }
  }
}
```

#### Step 3.2: Configure Vercel Deployment
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "framework": null,
  "projects": [
    {
      "name": "edl-auth",
      "root": "apps/auth",
      "framework": "nextjs"
    },
    {
      "name": "edl-dashboard",
      "root": "apps/dashboard",
      "framework": "nextjs"
    }
  ]
}
```

#### Step 3.3: Consolidate Environment Variables
```bash
# Move to root .env
cat apps/auth/.env.local > .env
echo "" >> .env
cat apps/dashboard/.env.local >> .env

# Remove duplicates and organize
sort -u .env > .env.tmp && mv .env.tmp .env
```

---

### Phase 4: Update Import Paths (Session 111)

#### Step 4.1: Update Auth Imports
```typescript
// Before: apps/auth/src/app/page.tsx
import { createClient } from '../utils/supabase/client'

// After:
import { createClient } from '@edl/database'
```

#### Step 4.2: Update Dashboard Imports
```typescript
// Before: apps/dashboard/src/app/page.tsx
import { Button } from '../components/ui/button'

// After:
import { Button } from '@edl/ui'
```

---

### Phase 5: Testing & Deployment (Session 112)

#### Step 5.1: Test Local Development
```bash
# From root
npm install
npm run dev

# Should start both apps:
# Auth: http://localhost:3000
# Dashboard: http://localhost:3001
```

#### Step 5.2: Test Build
```bash
npm run build
# Should build all packages and apps in dependency order
```

#### Step 5.3: Deploy to Vercel
```bash
vercel --prod
# Should deploy both apps with single command
```

#### Step 5.4: Configure Custom Domain
```bash
# In Vercel Dashboard:
# edl-auth.vercel.app → auth.yourdomain.com
# edl-dashboard.vercel.app → app.yourdomain.com
```

---

## 🚀 Benefits After Migration

1. **Single `npm install`** - All dependencies managed centrally
2. **Shared types** - Database types used by both apps
3. **Atomic deployments** - Related changes deploy together
4. **Shared UI components** - Consistent design system
5. **Single environment file** - No sync issues
6. **Vercel preview URLs** - Both apps get preview per PR
7. **Build caching** - Turborepo caches unchanged packages
8. **Simplified CI/CD** - One pipeline for everything

---

## ⚠️ Rollback Plan

If migration fails:
```bash
# Restore backups
mv auth-gateway.backup auth-gateway
mv dashboard.backup dashboard
rm -rf apps packages turbo.json
```

---

## 📊 Success Criteria

- [ ] Both apps run locally with `npm run dev`
- [ ] Shared database package works in both apps
- [ ] Single `vercel --prod` deploys both apps
- [ ] Environment variables shared correctly
- [ ] Build time reduced by 30%+ (caching)
- [ ] Preview deployments work for both apps

---

## 🎯 Next Session Focus

**Session 111 should**:
1. Execute Phase 1-4 of this plan
2. Test local development
3. Prepare for Vercel deployment
4. Document any issues encountered

---

## References

- [Turborepo Docs](https://turbo.build/repo/docs)
- [Vercel Monorepo Guide](https://vercel.com/docs/monorepos)
- [Next.js Monorepo Example](https://github.com/vercel/turbo/tree/main/examples/basic)