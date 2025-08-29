---
session: "00096"
type: "protocol"
status: "current"
created: "2025-08-28"
modified: "2025-08-28"
title: "Truth-Seed Directory Protocol - AUTHORITATIVE"
purpose: "Define the immutable protocol for truth-seed vs active-work directory usage"
topics: ["truth-seed", "directory-structure", "development-protocol", "reference"]
priority: "P0"
domain: "core"
audience: "developer"
complexity: "simple"
validation_method: "manual"
review_date: "2025-09-28"
estimated_shelf_life: "indefinite"
related_to: ["00042-TRUTH-SEED-ADOPTION-DECISION.md", "CLAUDE.md"]
implements: ["directory-management", "source-protection"]
breakthrough: "Resolved Sessions 75-82 directory confusion"
---

# Truth-Seed Directory Protocol

**Version**: AUTHORITATIVE  
**Created**: Session 00096  
**Status**: 🔒 LOCKED - NO DEBATE

---

## 🎯 THE PROTOCOL: Clear Separation of Concerns

After Sessions 75-96 of confusion and truth-seed contamination, this protocol is **FINAL**.

---

## Directory Responsibilities

### 📚 truth-seed/ - REFERENCE ONLY
```bash
truth-seed/
├── emdash-dashboard-main/    # PRISTINE source - NEVER EDIT
├── emdash-auth-main/         # PRISTINE source - NEVER EDIT
└── complete-migration.sql    # Database schema reference
```

**Rules**:
- ✅ **READ** for reference and patterns
- ✅ **COMPARE** when debugging issues
- ❌ **NEVER EDIT** any files
- ❌ **NEVER DEPLOY** from here
- ❌ **NEVER RUN** npm dev from here

### 🔨 reconciliation/active-work/ - DEVELOPMENT
```bash
reconciliation/active-work/
├── dashboard/                # Edit here, deploy from here (:3001)
└── auth/                     # Edit here, deploy from here (:3000)
```

**Rules**:
- ✅ **EDIT** all modifications here
- ✅ **DEPLOY** always from here
- ✅ **RUN** npm dev from here
- ✅ **TEST** features here
- ✅ **ADD** EDL features here

---

## Development Workflow

### The Correct Flow
```mermaid
graph LR
    A[Need to implement] --> B[Check truth-seed/]
    B --> C[Understand pattern]
    C --> D[Edit active-work/]
    D --> E[Test from active-work/]
    E --> F[Deploy active-work/]
```

### The WRONG Flow (Sessions 75-82)
```mermaid
graph LR
    A[Need to implement] --> B[Edit truth-seed/]
    B --> C[Confusion!]
    C --> D[Contamination!]
    D --> E[Lost reference!]
```

---

## Why This Matters

### Session 96 Discovery
1. truth-seed was contaminated with debug code
2. Lost our pristine reference implementation
3. Created confusion about which version was "truth"
4. Mixed instructions across sessions

### The Solution
- User renamed contaminated version
- Uploaded fresh pristine truth-seed
- This protocol prevents future contamination

---

## Quick Commands

### ✅ CORRECT - Development
```bash
# Dashboard development
cd reconciliation/active-work/dashboard
npm install
npm run dev  # Runs on :3001

# Auth development
cd reconciliation/active-work/auth
npm install  
npm run dev  # Runs on :3000
```

### ❌ WRONG - Don't do this
```bash
# NEVER DO THIS
cd truth-seed/emdash-dashboard-main
npm run dev  # NO! This contaminates reference
```

### ✅ CORRECT - Reference checking
```bash
# Compare implementations (read-only)
diff truth-seed/emdash-dashboard-main/src/components/X.tsx \
     reconciliation/active-work/dashboard/src/components/X.tsx

# Check original pattern (read-only)
cat truth-seed/emdash-dashboard-main/src/components/Y.tsx
```

---

## Minimal Modifications Principle

When working in `active-work/`, only add what's necessary:

1. **call_sign** field for students
2. **grade_level** for debate divisions
3. **EDL branding** (logo, colors, text)
4. **Bug fixes** (like school registration async/await)
5. **Environment variables** for your Supabase

Everything else: **KEEP AS-IS from truth-seed**

---

## Enforcement

### Git Protection (Recommended)
```bash
# Add to .gitignore
truth-seed/**
!truth-seed/complete-migration.sql
```

### Session Protocol
Every session MUST:
1. Verify truth-seed unchanged: `git status truth-seed/`
2. Work only in `active-work/`
3. Document any reference checks from truth-seed

---

## This Resolves

- ✅ Sessions 75-82 confusion about which directory to use
- ✅ Contamination of reference implementation
- ✅ Mixed instructions in handoffs
- ✅ "Which version is truth?" questions
- ✅ Debugging nightmares from lost baseline

---

## Remember

> "The truth-seed is like a museum artifact - look but don't touch"

**truth-seed = READ ONLY**  
**active-work = READ/WRITE**

No exceptions. No debates. This is the way.