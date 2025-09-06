---
session: "00114"
type: "guide"
status: "current"
created: "2025-08-30"
title: "Session 115 Context Loading Guide for Deployment Implementation"
purpose: "Provide comprehensive context loading instructions for Session 115 to implement deployment"
topics: ["deployment", "context-loading", "session-handoff", "vercel", "github"]
priority: "P0"
domain: "reconciliation"
related_to: ["00114-DEPLOYMENT-ARCHITECTURE-PLAN.md", "SESSION-00114-HANDOFF.md"]
---

# Session 115 Context Loading Guide for Deployment Implementation

**Purpose**: Ensure Session 115 has complete context to implement the deployment architecture

---

## 🚀 Quick Start for Session 115

```bash
# 1. Start your session
./scripts/00028-full-startup.sh 00115 "Implement deployment architecture"

# 2. Run these YAML queries IN ORDER
python3 scripts/00059-yaml-query.py --session "00114"     # This session's work
python3 scripts/00059-yaml-query.py --session "00110"     # Vercel assessment
python3 scripts/00059-yaml-query.py --session "00111"     # GitHub workflow
python3 scripts/00059-yaml-query.py --topic "deployment"  # All deployment work
python3 scripts/00059-yaml-query.py --topic "vercel"      # Vercel specific
python3 scripts/00059-yaml-query.py --topic "architecture" # Architecture decisions
```

---

## 📚 Essential Reading List (Priority Order)

### Phase 1: Core Understanding (Read First)
1. **`reconciliation/00114-DEPLOYMENT-ARCHITECTURE-PLAN.md`** 
   - THE PRIMARY DOCUMENT - Your implementation blueprint
   - Contains 5-phase plan with exact commands

2. **`archive/sessions/SESSION-00114-HANDOFF.md`**
   - Quick summary and checklist
   - Critical decisions that need user input

3. **`reality/00110-VERCEL-DEPLOYMENT-ASSESSMENT.md`**
   - Current state of Vercel setup
   - What exists vs what needs building

### Phase 2: Technical Context
4. **`scripts/00111-github-workflow-guide.md`**
   - Proven GitHub patterns from 474-file commit
   - How to handle large deployments

5. **`core/00089-GITHUB-VERCEL-FOUNDATION.md`**
   - Foundation principles
   - Anti-patterns to avoid

6. **`reconciliation/00110-MONOREPO-MIGRATION-PLAN.md`**
   - WHY we rejected this approach
   - Understanding the architecture decision

### Phase 3: Current State
7. **Check active work directories:**
   ```bash
   ls -la reconciliation/active-work/auth-gateway/
   ls -la reconciliation/active-work/dashboard/
   cat reconciliation/active-work/auth-gateway/package.json | grep '"name"'
   cat reconciliation/active-work/dashboard/package.json | grep '"name"'
   ```

8. **Verify Vercel CLI:**
   ```bash
   vercel --version  # Should be 44.7.3
   which vercel      # Should be /home/b4sho/.npm-global/bin/vercel
   ```

---

## 🔍 Context Verification Queries

Run these to understand the deployment landscape:

```bash
# Check what deployment work has been done
python3 scripts/00059-yaml-query.py --topic "deployment" --status current

# Check for incomplete deployment work
python3 scripts/00059-yaml-query.py --topic "deployment" --status incomplete

# Find all Vercel-related documentation
python3 scripts/00059-yaml-query.py --topic "vercel"

# Check for CI/CD related work
python3 scripts/00059-yaml-query.py --topic "ci-cd"

# Look for environment variable documentation
grep -r "NEXT_PUBLIC_SUPABASE" --include="*.md" .
```

---

## ❓ Informed Questions Session 115 Should Ask

After reading the context, Session 115 should ask:

### Architecture Questions
1. "I see we're deploying as separate services. Have we decided on the domain structure (subdomains vs paths)?"
2. "The plan mentions 'emdash.com' - what's the actual domain we're using?"
3. "Are we deploying to Vercel's free tier or do we have a Pro/Enterprise account?"

### Technical Questions
4. "Should I create new Vercel projects or are they already created?"
5. "Do we have the Vercel org ID and project IDs, or do I need to get them?"
6. "Are the environment variables already in Vercel, or do I need to add them?"

### Implementation Questions
7. "Should I deploy to staging/preview first, or straight to production?"
8. "Do we want GitHub Actions CI/CD immediately, or manual deployment first?"
9. "The current vercel.json points to truth-seed/ - should I update or create new ones?"

### State Questions
10. "What's the current deployment state? Are there failed deployments to clean up?"
11. "Session 112-113 made UI changes - are those ready for deployment?"
12. "Is the database (Supabase) ready with all migrations applied?"

### Risk Questions
13. "What features MUST work before we go live?"
14. "Are there any known blockers that would prevent deployment?"
15. "How should we handle the CORS configuration between domains?"

---

## 🔧 Pre-Implementation Checklist

Session 115 should verify:

### Local Environment
```bash
# Node version (should be v20+)
node --version

# Vercel CLI
vercel --version

# GitHub CLI
gh --version

# Check current git status
git status
git branch --show-current
```

### Project State
```bash
# Can both projects build?
cd reconciliation/active-work/auth-gateway && npm run build
cd ../dashboard && npm run build

# Are dependencies installed?
cd reconciliation/active-work/auth-gateway && npm list @supabase/supabase-js
cd ../dashboard && npm list @supabase/supabase-js
```

### Environment Variables
```bash
# Check if .env files exist
ls -la reconciliation/active-work/*/.env*

# Verify Supabase connection
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

---

## 🚨 Critical Context from Recent Sessions

### From Session 112-113: UI Changes
- TeamProvider was added to dashboard
- CSS compilation issues with Tailwind v4
- Fix script available: `./scripts/00112-fix-css-compilation.sh`
- **Impact**: Dashboard UI might need verification before deployment

### From Session 110-111: Infrastructure
- MCP execute_sql now working (Node v20 fix)
- GitHub workflow proven with large commits
- Vercel Reality Agent exists but not operational

### From Session 114: Architecture Decision
- **REVERSED** monorepo recommendation
- Multi-genre platform vision validated separation
- Auth = infrastructure, Dashboards = genre-specific

---

## 📊 Success Validation

Session 115 implementation is successful when:

1. **Both apps accessible publicly:**
   ```bash
   curl -I https://[auth-url]     # Returns 200
   curl -I https://[debate-url]   # Returns 200
   ```

2. **Complete user flow works:**
   - User can sign up at auth
   - User can log in at auth
   - User is redirected to debate dashboard
   - User can access debate features

3. **Deployments are stable:**
   - No build errors in Vercel dashboard
   - Environment variables properly set
   - Logs show successful requests

---

## 💡 Key Implementation Tips

1. **Start Simple**: Deploy manually first, automate later
2. **Test Locally**: Ensure both apps build before deploying
3. **Stage First**: Use preview/staging URLs before production
4. **Document Issues**: Any problems become guides for future sessions
5. **Commit Frequently**: Following Session 111's pattern

---

## 🔄 If Session 115 Gets Stuck

### Common Issues and Solutions

**Issue**: "vercel: command not found"
```bash
export PATH="$HOME/.npm-global/bin:$PATH"
```

**Issue**: Build fails with module errors
```bash
cd [project] && rm -rf node_modules package-lock.json && npm install
```

**Issue**: Environment variables not working
```bash
vercel env pull  # Pull from Vercel
vercel env add   # Add new ones
```

**Issue**: CORS errors between apps
- Add CORS headers to auth-gateway's next.config.js
- See plan document section on CORS

---

## 📝 Final Note for Session 115

You have everything needed to implement the deployment. The plan is comprehensive, tested patterns are documented, and the architecture is validated. 

**Your mission**: Get auth.emdash.com and debate.emdash.com (or chosen domains) live and accessible.

Good luck! 🚀

---

**Session 114 Preparation Complete** - Context guide ready for Session 115.