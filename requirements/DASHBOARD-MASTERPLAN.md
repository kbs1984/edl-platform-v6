---
created: '2025-08-23'
domain: requirements
priority: P1
purpose: 'Document dashboard-masterplan: truth seed dashboard completion'
session: legacy
status: current
title: 'DASHBOARD-MASTERPLAN: Truth Seed Dashboard Completion'
topics:
- auth
- architecture
type: specification
based_on:
- reality/snapshot-legacy.md
modified: '2025-08-27'
---

# DASHBOARD-MASTERPLAN: Truth Seed Dashboard Completion
**Version**: 1.0  
**Created**: Session 00041  
**Date**: 2025-08-21  
**Status**: PARTIALLY FUNCTIONAL - Requires Completion  
**Complements**: AUTH-MASTERPLAN.md

---

## 🚨 CRITICAL UNDERSTANDING
The dashboard is **partially built** with working foundation but incomplete features. Our strategy: **USE WHAT WORKS**, fix what's broken, add what's missing, then migrate to Fat Client architecture.

---

## Executive Summary

The emdash-dashboard is a Next.js application that provides the user interface after authentication. It has a **solid foundation** with routing, components, and Supabase integration, but many features are **incomplete or stubbed**. The onboarding flow works, team management exists but needs testing, and role-based dashboards are partially implemented.

**Key Decision**: Complete critical features in Next.js first, then gradually migrate to Fat Client (Vanilla JS) for performance and simplicity.

---

## Required Reading List by Task

### For ALL Sessions (Start Here)
1. **This document** - DASHBOARD-MASTERPLAN.md
2. **AUTH-MASTERPLAN.md** - Understand auth gateway integration
3. `/truth-seed/emdash-dashboard-main/src/app/(user-pages)/page.tsx` - Main dashboard entry

### For Onboarding Work
```bash
# Onboarding flow (3-step process)
/truth-seed/emdash-dashboard-main/src/app/(init-pages)/onboarding/page.tsx        # Welcome
/truth-seed/emdash-dashboard-main/src/app/(init-pages)/onboarding/step-1/page.tsx # Role selection
/truth-seed/emdash-dashboard-main/src/app/(init-pages)/onboarding/step-2/page.tsx # Profile info
/truth-seed/emdash-dashboard-main/src/app/(init-pages)/onboarding/step-3/page.tsx # Completion
/truth-seed/emdash-dashboard-main/src/components/onboarding-step-2-form.tsx       # Complex form
```

### For Team Features
```bash
# Team management
/truth-seed/emdash-dashboard-main/src/lib/actions/team-actions.ts           # Server actions
/truth-seed/emdash-dashboard-main/src/components/team/                      # UI components
/truth-seed/emdash-dashboard-main/src/app/(user-pages)/groups/teams/        # Team pages
/truth-seed/emdash-dashboard-main/src/contexts/team-context.tsx             # State management
```

### For Student Features
```bash
# Student-specific functionality
/truth-seed/emdash-dashboard-main/src/components/dashboard/student.tsx      # Student dashboard
/truth-seed/emdash-dashboard-main/src/components/student/                   # Student components
/truth-seed/emdash-dashboard-main/src/lib/actions/student-actions.ts        # Student actions
```

### For Chat System
```bash
# Real-time chat
/truth-seed/emdash-dashboard-main/src/components/chat/                      # Chat UI
/truth-seed/emdash-dashboard-main/src/lib/actions/chat-actions.ts           # Chat actions
/truth-seed/emdash-dashboard-main/src/hooks/use-chat.ts                     # Chat hook
/truth-seed/emdash-dashboard-main/src/contexts/chat-context.tsx             # Chat state
```

---

## Current State Analysis

### ✅ What's Working

1. **Basic Routing Structure**
   - `/onboarding` - 3-step onboarding flow
   - `/(user-pages)` - Protected dashboard routes
   - Role-based redirects (Student/Judge/Guardian)

2. **Onboarding Flow (Mostly Complete)**
   - Step 1: Role selection (Student/Judge/Guardian)
   - Step 2: Profile information collection
   - Step 3: Policy agreement
   - Updates profile table correctly

3. **Component Library**
   - Full shadcn/ui component set
   - Custom components (Steps, SubmitButton)
   - Theme switching capability

4. **Supabase Integration**
   - Server-side client configured
   - Cookie-based authentication
   - Database queries working

5. **Server Actions**
   - Team CRUD operations
   - Student profile management
   - Chat message handling
   - School search functionality

### ⚠️ What's Partially Working

1. **Student Dashboard**
   - Basic layout exists
   - Shows profile data
   - Missing: call sign, achievements, progress

2. **Team Management**
   - Create team action exists
   - Join team functionality
   - Missing: UI testing, invitation flow

3. **Chat System**
   - Components built
   - Context/hooks ready
   - Missing: Real-time subscriptions

### ❌ What's Missing/Broken

1. **Call Sign System** (EDL Critical)
   - No call sign selection UI
   - No availability checking
   - No generation helper

2. **Judge Dashboard**
   - Redirects to external URL (adjud.edl.emdash.one)
   - No local implementation

3. **Guardian Dashboard**
   - Stub only ("Guardian Dashboard" text)
   - No features implemented

4. **Debate Features**
   - Search component exists
   - No debate creation/management
   - No scoring interface

5. **Achievement/Gamification**
   - Division display missing
   - Experience points not shown
   - No badge system

---

## Implementation Strategy

### Phase 1: Critical Fixes (Session 42-43)

#### 1.1 Add Call Sign Selection (PRIORITY 1)
```typescript
// Add to onboarding/step-2 or create step-2.5
interface CallSignSelectorProps {
  suggestions: string[] // Generated adjective-noun-number
  onSelect: (callSign: string) => void
  checkAvailability: (callSign: string) => Promise<boolean>
}

// Pattern: adjective-noun-number
// Examples: swift-eagle-42, brave-wolf-7, wise-owl-23
```

#### 1.2 Fix Profile Completion Check
```typescript
// In page.tsx, add call_sign check
if (!profile.active) {
  if (!student?.call_sign) redirect('/onboarding/call-sign')
  // ... existing checks
}
```

#### 1.3 Complete Student Dashboard
- Display call sign prominently
- Show division badge (VILLIGER → OPEN)
- Display experience points and level
- Add recent activity feed

### Phase 2: Feature Completion (Session 44-45)

#### 2.1 Team Features
```bash
# Test and fix:
- Create team flow
- Join team by code
- Team member list
- Team chat integration
- Guild system (if needed)
```

#### 2.2 Judge Dashboard (Minimal)
```typescript
// Basic judge interface
- View assigned debates
- Submit scores
- View student profiles
- Provide feedback
```

#### 2.3 Guardian Dashboard (Minimal)
```typescript
// Parent interface
- View child profiles
- See progress reports
- Manage payments (stub)
- Communication with teachers
```

### Phase 3: Fat Client Migration (Session 46+)

#### 3.1 Identify Migration Boundary
```
Keep in Next.js:              Migrate to Vanilla JS:
-----------------              ---------------------
✓ Authentication               ✓ Dashboard views
✓ Onboarding flow             ✓ Real-time features
✓ Server actions              ✓ Interactive components
✓ API routes                  ✓ Game-like features
✓ SEO pages                   ✓ Chat interface
```

#### 3.2 Fat Client Architecture
```javascript
// Simple, fast, maintainable
const FatClient = {
  // Direct Supabase connection
  supabase: createClient(SUPABASE_URL, ANON_KEY),
  
  // Read auth cookies from Next.js
  async getSession() {
    const { data: { session } } = await this.supabase.auth.getSession()
    return session
  },
  
  // Mount on specific div
  mount(elementId) {
    const app = document.getElementById(elementId)
    app.innerHTML = this.render()
  },
  
  // Simple rendering
  render() {
    return `<div class="dashboard">...</div>`
  }
}
```

#### 3.3 Gradual Migration Strategy
1. Start with student dashboard (most complex)
2. Build alongside Next.js (not replacement)
3. A/B test performance
4. Migrate feature by feature
5. Keep Next.js for SEO/onboarding

---

## Cookie Integration with Auth Gateway

### How It Works
```javascript
// Auth gateway sets cookie with domain=".edl-platform.vercel.app"
// Dashboard reads same cookie automatically

// In dashboard server component:
const supabase = await createServerClient() // Uses same cookies
const { data: { user } } = await supabase.auth.getUser()

// Cookie is shared because:
1. Same Supabase instance
2. Domain wildcard cookie
3. HTTP-only secure cookie
```

### Testing Cookie Sharing
```bash
# 1. Login at auth.localhost.localdomain:3000
# 2. Check cookie in browser DevTools
# 3. Navigate to dashboard.localhost.localdomain:3001
# 4. Verify session persists
```

---

## Database Schema Utilization

### Key Tables for Dashboard
```sql
-- User hierarchy
profile (name, username, image_path, user_role, active)
  ↓
student (call_sign, division, exp, level, challenge_enabled)
  ↓
team_member (team_id, is_leader, status)

-- Features
team (name, description, division, school_id)
friendship (user_id, friend_id, status)
chat.messages (content, room_id, sender_id)
debate.debates (topic, format, status)
```

### EDL Additions Needed
```sql
-- Add to student table
ALTER TABLE public.student
ADD COLUMN call_sign TEXT UNIQUE,
ADD COLUMN achievements JSONB DEFAULT '[]',
ADD COLUMN learning_path TEXT;

-- Create index for performance
CREATE INDEX idx_student_call_sign ON public.student(call_sign);
```

**Verify with Reality Agents**:
```bash
# After running migration, verify with known credentials:
SUPABASE_URL="https://bbrheacetxlnqbibjwsz.supabase.co" \
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE" \
python3 reality/agent-reality-auditor/supabase-connector/quickstart.py
# Should show call_sign column in student table
```

---

## Testing Strategy

### Local Testing Setup
```bash
# 1. Run auth gateway on port 3000
cd emdash-auth-main && npm run dev

# 2. Run dashboard on port 3001
cd emdash-dashboard-main && npm run dev

# 3. Add to /etc/hosts
127.0.0.1 auth.localhost.localdomain
127.0.0.1 dashboard.localhost.localdomain
```

### Feature Testing Checklist
```markdown
## Onboarding Flow
[ ] User redirected from auth to dashboard/onboarding
[ ] Role selection saves to profile.user_role
[ ] Profile information saves correctly
[ ] Call sign selection works (after adding)
[ ] Policy agreement activates account
[ ] Redirect to dashboard after completion

## Student Features
[ ] Dashboard displays profile data
[ ] Division badge shows correctly
[ ] Experience points visible
[ ] Teams list accessible
[ ] Friends system works

## Team Features
[ ] Create new team
[ ] Join existing team
[ ] View team members
[ ] Team chat functional
[ ] Leave team works
```

### Reality Agent Verification

#### Setting Up Reality Agents (One-Time)
```bash
# Create a central config for Reality Agents
cat > reality/.env << 'EOF'
SUPABASE_URL=https://bbrheacetxlnqbibjwsz.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VERCEL_TOKEN=your-vercel-token  # If available
GITHUB_TOKEN=your-github-token  # If needed
EOF

# Or use the existing credentials from Session 40:
SUPABASE_URL="https://bbrheacetxlnqbibjwsz.supabase.co" \
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE" \
python3 reality/agent-reality-auditor/supabase-connector/quickstart.py
```

#### Running Reality Agents
```bash
# Quick check (all agents)
./scripts/00028-reality-check.sh --quick

# Individual agents with credentials
python3 reality/agent-reality-auditor/github-connector/quickstart.py
python3 reality/agent-reality-auditor/vercel-connector/quickstart.py  # If implemented
python3 reality/agent-reality-auditor/integration-connector/quickstart.py
```

**What Reality Agents Verify**:
- **Supabase Agent**: Database tables, RLS policies, user data
- **GitHub Agent**: Code deployment, commit history  
- **Vercel Agent**: Deployment status, environment variables
- **Integration Agent**: Overall system health consensus

**Note**: Supabase credentials are already known from previous sessions and should be reused.

---

## Success Metrics

### Phase 1 Success (Critical Fixes)
- [ ] Call sign selection implemented
- [ ] Student dashboard shows all data
- [ ] Onboarding flow completes smoothly
- [ ] Cookie sharing verified
- [ ] Reality Agents confirm deployment (97%+ health)
- [ ] Supabase Agent shows call_sign column exists

### Phase 2 Success (Feature Completion)
- [ ] All three role dashboards functional
- [ ] Team features tested and working
- [ ] Basic chat operational
- [ ] No critical errors in console

### Phase 3 Success (Fat Client)
- [ ] Fat Client prototype running
- [ ] Performance improved (measure)
- [ ] User experience enhanced
- [ ] Maintenance simplified

---

## Risk Mitigation

### Potential Issues & Solutions

1. **Cookie sharing fails**
   - Check domain configuration
   - Verify same Supabase instance  
   - Test with exact production URLs
   - Use Reality Agents to verify Vercel env vars

2. **Onboarding infinite loop**
   - Add debug logging to redirects
   - Check profile.active flag
   - Verify database updates

3. **Real-time subscriptions break**
   - Use polling as fallback
   - Implement retry logic
   - Check Supabase quotas

4. **Fat Client complexity grows**
   - Keep it simple (no framework)
   - Use vanilla JS only
   - Component = function returning HTML

---

## Implementation Timeline

### Week 1 (Sessions 42-43)
- **Day 1-2**: Analyze existing code thoroughly
- **Day 3-4**: Implement call sign system
- **Day 5**: Fix critical bugs

### Week 2 (Sessions 44-45)
- **Day 1-2**: Complete team features
- **Day 3-4**: Add minimal judge/guardian dashboards
- **Day 5**: Testing and bug fixes

### Week 3+ (Sessions 46+)
- **Ongoing**: Fat Client development
- **Parallel**: Keep Next.js operational
- **Gradual**: Feature-by-feature migration

---

## Key Decisions

### 1. **Complete Before Migrating**
Don't start Fat Client until Next.js dashboard is functional. This ensures we always have a working system.

### 2. **Call Sign is Priority 1**
This is EDL's unique identity system. Without it, we're just another debate platform.

### 3. **Fat Client is Enhancement, Not Replacement**
Keep Next.js for complex features, use Fat Client for performance-critical real-time features.

### 4. **Test Everything Locally First**
Never deploy broken features. Test complete flows locally before production.

---

## Next Steps for Session 42

### Immediate Actions
1. **Run Reality Agents** to establish baseline
   ```bash
   # Option A: Use automated session startup (includes Reality Agents)
   ./scripts/00028-session-start.sh 42
   
   # Option B: Run Reality Agents directly with known credentials
   SUPABASE_URL="https://bbrheacetxlnqbibjwsz.supabase.co" \
   SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE" \
   ./scripts/00028-reality-check.sh --quick
   ```
2. **Deep dive** into dashboard codebase
3. **Create** call sign selection component
4. **Test** complete onboarding flow
5. **Fix** any blocking bugs
6. **Run Reality Agents** again to verify changes
7. **Document** findings for Session 43

### Preparation for Session 43
- Ensure auth gateway deployed (verify with Vercel Agent)
- Verify cookie sharing works
- Database has call_sign column (verify with Supabase Agent)
- Local testing environment ready
- Reality Agents show 97%+ health

---

## Appendix: File Structure Reference

```
emdash-dashboard-main/
├── src/
│   ├── app/
│   │   ├── (init-pages)/     # Onboarding
│   │   ├── (user-pages)/     # Dashboard
│   │   └── layout.tsx         # Root layout
│   ├── components/
│   │   ├── dashboard/         # Role dashboards
│   │   ├── team/             # Team components
│   │   ├── student/          # Student components
│   │   ├── chat/             # Chat UI
│   │   └── ui/               # shadcn components
│   ├── lib/
│   │   └── actions/          # Server actions
│   ├── hooks/                # Custom hooks
│   ├── contexts/             # React contexts
│   └── utils/                # Utilities
├── public/                   # Static assets
└── package.json             # Dependencies
```

---

## Document Control

- **Created By**: Claude (Session 00041)
- **Status**: READY FOR IMPLEMENTATION
- **Next Review**: After call sign implementation
- **Dependencies**: AUTH-MASTERPLAN.md must be executed first

---

**IMPORTANT**: The dashboard is the user's first experience after authentication. It must work smoothly, guide them through onboarding, and showcase EDL's unique identity system (call signs). Focus on making it functional before making it perfect.