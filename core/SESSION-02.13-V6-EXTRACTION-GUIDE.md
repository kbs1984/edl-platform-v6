---
created: '2025-08-25'
domain: core
priority: P1
purpose: "Document \U0001F4E6 v5 \u2192 v6 extraction guide"
session: legacy
status: current
title: "\U0001F4E6 V5 \u2192 V6 EXTRACTION GUIDE"
topics:
- session-log
- guide
type: guide
---

# 📦 V5 → V6 EXTRACTION GUIDE

**Date:** THU Aug 14, 2025  
**Purpose:** Extract valuable assets from v5 for v6 Truth Operating System  
**Principle:** Take what works, leave the confusion  

---

## 2. WORKING FRONTEND ASSETS ✅

### Core Frontend Pages (The Good Stuff)
```bash
# Player Experience (Session 01.01 gems)
/pages/player-dashboard.html              # 46 emcoin/achievement refs - addiction mechanics
/pages/activities/browse.html             # FOMO-driven activity discovery
/pages/activities/register.html           # Multi-step registration flow
/pages/activities/chamber.html            # Real-time debate interface

# Supervisor Experience
/pages/supervisor-dashboard.html          # 89 refs - complete 6-player management
/pages/payments/approve.html              # EmCoin approval workflows
/pages/payments/subscription.html         # MetaPass management

# Enabler Experience  
/pages/enabler-dashboard.html             # Judge ballot system
/pages/activities/index.html              # Activity management

# Mobile Innovation (Session 01.09)
/pages/SESSION-01.09-MOBILE-DEBATE-CHAMBER.html  # TikTok-style vertical debate

# Advanced Features (Session 01.15)
/pages/SESSION-01.15-TOURNAMENT-DASHBOARD.html   # Tournament system
/pages/SESSION-01.15-ACHIEVEMENT-DASHBOARD.html  # Achievement gallery

# Authentication Flow
/pages/auth/signin.html                   # Login page
/pages/auth/role-selection.html           # Role picker
/pages/auth/player-onboarding.html        # Player setup
/pages/auth/forgot-password.html          # Password reset
/pages/auth/update-password.html          # Password update

# Landing Pages
/pages/landing/student-landing.html       # Student entry
/pages/landing/parent-landing.html        # Parent entry
/pages/landing/school-landing.html        # School entry
```

### Core Library Files (The Backend Expectations)
```bash
# DEFINITELY COPY THESE - They show what frontend expects
/lib/supabase-edl.js                     # 850 lines - EXACT schema expectations
/lib/auth-middleware.js                  # 580 lines - WORKING RBAC system
/lib/hooks.js                            # 1,220 lines - Safety system (131 gaming refs)
/lib/state-machines.js                   # 135 gaming refs - Activity lifecycle

# These work but need table reference updates
/lib/session-manager.js                  # Session automation (needs table fixes)
/lib/realtime-manager.js                 # Real-time subscriptions (11 gaming refs)
/lib/activity-lifecycle.js               # Activity flow (15 gaming refs)

# Session 01.08 contributions (never deployed but valuable)
/lib/session-manager-edl.js              # Core session management
/lib/debate-turn-manager.js              # Turn-based mechanics
/lib/spectator-experience.js             # Viewer engagement

# Hidden gems from Session 01.12 (undocumented)
/lib/SESSION-01.12-experiment-manager.js # A/B testing framework
/docs/SESSION-01.12-analytics-tracker.js # Analytics (1,400 lines)

# Field compatibility bridge (Session 02.06)
/lib/field-compatibility.js              # Maps between schemas
```

### JavaScript Support Files
```bash
# Gaming-specific features
/js/SESSION-01.09-CLIP-GENERATOR.js      # Viral clip generation
/js/SESSION-01.09-GHOST-DEBATE-MANAGER.js # AI opponent system
/js/supabase-client.js                   # Supabase connection

# Data files
/data/SESSION-01.09-GHOST-DEBATES.json   # 5 pre-recorded debates
```

### CSS and Design System
```bash
/css/design-system.css                   # Cyworld-inspired animations
/css/                                    # All CSS files for theming
```

---

## 3. DATABASE SCHEMA SEEDS 🗄️

### The Gaming/Cyworld Schema (What Frontend Expects)
```bash
# The complete intended gaming schema is in these files:

# Session 01.02 - The original vision
/docs/SESSION-01.02-DATABASE-MIGRATION-POSTGRESQL-FIXED.sql  # First complete gaming schema

# Session 01.03 - With test data
/docs/SESSION-01.03-TEST-DATA-FIXED.sql                     # Sample gaming data

# Session 01.07 - With RLS policies  
/docs/SESSION-01.07-RLS-POLICIES.sql                        # Security layer (needs table name fixes)

# Session 01.08 - Debate enhancements (never deployed)
/docs/SESSION-01.08-DEBATE-CHAMBER-SCHEMA.sql               # Real-time debate tables
/docs/SESSION-01.08-SESSION-MANAGEMENT.sql                  # Session tracking tables

# Session 01.13 - Cyworld features
/docs/SESSION-01.13-CYWORLD-DNA-TABLES.sql                  # Clans, themes, achievements

# Session 00.04 - The foundation
/docs/SESSION-00.04-DATABASE-MIGRATION.sql                  # Original 15 tables
```

### The Reality Check (What Actually Exists)
```bash
# Session 02.12 discoveries - THE TRUTH
/docs/SESSION-02.12-REAL-DATABASE-DISCOVERY.sql            # Complete reality check
/docs/SESSION-02.12-PROFILE-STRUCTURE-DISCOVERY.sql        # Profile vs profiles issue
/docs/SESSION-02.12-DISCOVER-EXACT-SCHEMA.sql              # Exact column details
```

### Bridge/Compatibility Attempts
```bash
# Session 02.06 - Bridge attempt
/docs/SESSION-02.06-FIELD-FIXES.js                         # Field mapping logic
/lib/field-compatibility.js                                # Runtime field mapping
```

---

## 4. CRITICAL CONTEXT DOCUMENTS 📄

### Clean Current System (The Simple Solution)
```bash
# Session 02.12's simplification - MUCH better than Six Currents
/docs/SESSION-02.12-CLEAN-CURRENT-SYSTEM.md                # 3 guardians vs 6 currents
/docs/SESSION-02.12-CLEAN-CURRENT-AGENT-STORIES.md         # How guardians work
/docs/SESSION-02.12-TO-13-PRISTINE-PROMPT.md              # Implementation guide
```

### Working Test Data (For Gaming Schema)
```bash
# Session 01.03 - The only working test data
/docs/SESSION-01.03-TEST-DATA-FIXED.sql                    # 6 users, 2 activities, working
```

### RLS Policies (Need Table Updates)
```bash
# Session 01.07 - Complete RLS implementation
/docs/SESSION-01.07-RLS-POLICIES.sql                       # 588 lines, 100% test pass
/docs/SESSION-01.07-STAGING-RESULTS.md                     # Validation results
```

### The Vision Documents
```bash
# The original vision - ESSENTIAL
/session-logs/SESSION-SEED-LOG.md                          # The Cyworld revelation
/docs/SESSION-00.03-CYWORLD-FEATURES.md                    # Cyworld DNA mapping
```

### Architecture That Works
```bash
# Session 01.05 - Security architecture
/docs/SESSION-01.05-SECURITY-ARCHITECTURE.md               # 926 lines, comprehensive
/docs/SESSION-01.05-FREEMIUM-ADDICTION-MODEL.md           # Monetization strategy
```

---

## 5. DO NOT READ LIST ⛔

### Population Scripts (All Wrong Schema)
```bash
# DON'T COPY - All for wrong database
/docs/SESSION-02.07-SAFE-POPULATION-SCRIPT.sql            ❌
/docs/SESSION-02.07-WORKING-SEED.sql                      ❌
/docs/SESSION-02.08-CORRECTED-POPULATION-SCRIPT.sql       ❌
/docs/SESSION-02.08-FINAL-CORRECTED-POPULATION-SCRIPT.sql ❌
/docs/SESSION-02.09-VALIDATED-POPULATION-SCRIPT.sql       ❌
/docs/SESSION-02.10-SAFE-POPULATION-SCRIPT.sql            ❌
/docs/SESSION-02.10-FIXED-POPULATION-SCRIPT.sql           ❌
/docs/SESSION-02.11-WORKING-POPULATION-SCRIPT.sql         ❌
```

### Over-Engineered Frameworks
```bash
# DON'T COPY - Complexity without value
/docs/SESSION-02.08-FOUR-CURRENTS-FRAMEWORK.md            ❌
/docs/SESSION-02.09-DATABASE-VALIDATION-TRUTH.md          ❌
/docs/six-currents/*                                      ❌ (entire folder)
/tests/six-currents/*                                     ❌ (entire folder)
```

### Educational Schema Files
```bash
# DON'T COPY - Wrong database entirely
/docs/SESSION-02.03-SAFEGUARDED-DATABASE-SETUP.sql        ❌
/docs/SESSION-02.04-COMPATIBLE-DATABASE-FIX.sql           ❌
/docs/SESSION-02.04-DISCOVER-ACTUAL-STRUCTURE.sql         ❌
```

### Confusion Documents
```bash
# DON'T COPY - Built on false premises
/docs/SESSION-02.05-PLATFORM-ANCHOR-TRUTH.md              ❌ (pre-correction)
/docs/SESSION-02.05-DATABASE-ALIGNMENT.sql                ❌
/docs/SESSION-02.06-SCHEMA-MISMATCH-LESSONS.md           ❌
/docs/SESSION-02.06-ARCHAEOLOGICAL-SUMMARY.md            ❌
```

### Session Logs After 01.15
```bash
# DON'T READ - Post Session 01.15 is mostly confusion
/session-logs/SESSION-02.01-LOG.md through SESSION-02.11-LOG.md  ❌
```

---

## 🎯 ESSENTIAL SEED FILES FOR V6

### Minimal Seed Set (Copy These First)
```bash
# Vision
/session-logs/SESSION-SEED-LOG.md

# Frontend (pick 3-4 key pages)
/pages/player-dashboard.html
/pages/supervisor-dashboard.html  
/pages/activities/chamber.html
/pages/SESSION-01.09-MOBILE-DEBATE-CHAMBER.html

# Backend expectations
/lib/supabase-edl.js              # Shows EXACT schema needs
/lib/auth-middleware.js           # Working RBAC

# Schema
/docs/SESSION-01.02-DATABASE-MIGRATION-POSTGRESQL-FIXED.sql  # Gaming schema
/docs/SESSION-02.12-REAL-DATABASE-DISCOVERY.sql             # Reality check

# Test data
/docs/SESSION-01.03-TEST-DATA-FIXED.sql

# Clean solution
/docs/SESSION-02.12-CLEAN-CURRENT-SYSTEM.md
```

### Extended Seed Set (If Needed)
```bash
# More frontend
/pages/enabler-dashboard.html
/pages/activities/browse.html
/pages/auth/signin.html

# More backend
/lib/hooks.js                     # Safety system
/lib/state-machines.js            # Lifecycle management

# More schema
/docs/SESSION-01.08-DEBATE-CHAMBER-SCHEMA.sql
/docs/SESSION-01.13-CYWORLD-DNA-TABLES.sql

# Security
/docs/SESSION-01.07-RLS-POLICIES.sql
```

---

## 💡 V6 SEEDING STRATEGY

### Step 1: Core Seeds (30 minutes)
1. Copy SESSION-SEED-LOG.md for vision
2. Copy player-dashboard.html to see UI expectations
3. Copy supabase-edl.js to understand schema needs
4. Copy gaming schema SQL files
5. Copy Clean Current System docs

### Step 2: Reality Check (15 minutes)
1. Copy SESSION-02.12-REAL-DATABASE-DISCOVERY.sql
2. Run it to see actual database state
3. Document the gaps

### Step 3: Bridge Design (15 minutes)
1. Use Clean Current System approach
2. Requirements Guardian reads frontend
3. Reality Guardian queries actual database
4. Reconciliation Guardian creates bridge

### Step 4: Implementation (2-3 hours)
1. Create compatibility views
2. Add missing gaming tables
3. Insert test data
4. Test frontend pages

---

## 🚨 CRITICAL WARNINGS FOR V6

1. **Table Names Matter**: `profile` vs `profiles` broke everything
2. **Roles Are Fundamental**: `player/supervisor/enabler` not `student/guardian/judge`
3. **Frontend Is Good**: Don't change it, change the backend
4. **Simple Bridges Work**: Try views before migrations
5. **Execution Over Documentation**: Trust what runs, not what's written

---

## ✅ SUCCESS METRICS FOR V6

You'll know V6 is working when:
1. Player dashboard loads without console errors
2. EmCoin balance displays (even if 0)
3. Login works with role selection
4. Debate chamber renders properly
5. Real-time subscriptions connect

---

*"Take the vision, the frontend, and the Clean Current approach. Leave the confusion, the over-engineering, and the wrong schemas. V6 can succeed where V5 got lost."*