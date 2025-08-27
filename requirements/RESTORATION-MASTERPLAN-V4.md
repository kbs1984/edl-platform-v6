---
created: '2025-08-23'
domain: requirements
priority: P1
purpose: 'Document restoration-masterplan-v4: truth seed architecture'
session: legacy
status: current
title: 'RESTORATION-MASTERPLAN-V4: Truth Seed Architecture'
topics:
- auth
- architecture
type: specification
based_on:
- reality/snapshot-legacy.md
modified: '2025-08-27'
---

# RESTORATION-MASTERPLAN-V4: Truth Seed Architecture
## The Pivot to Production-Ready Foundation
**Created**: Session 00041  
**Date**: 2025-08-21  
**Status**: ACTIVE - This is the current strategic framework  
**Supersedes**: RESTORATION-MASTERPLAN-V3.md (deprecated)

---

## Executive Summary

Version 4 represents a fundamental pivot in our approach. Instead of building from scratch, we adopt the complete emdash debate platform as our "Truth Seed" - a working foundation upon which we build the EDL ecosystem. This gives us months of battle-tested code instantly.

**Core Insight**: The debate platform IS an educational platform. Debates are learning exercises, teams are classrooms, judges are teachers, and scorecards are gradebooks.

---

## The Architecture Evolution

### V1-V2: Discovery Phase (Sessions 1-15)
- Built basic 4-table system
- Learned authentication patterns
- Discovered complexity of requirements

### V3: Two-Phase Approach (Sessions 16-40)
- Planned prototype → production strategy
- Built Truth Operating System infrastructure
- Hit limitations of building from scratch

### V4: Truth Seed Architecture (Session 41+)
- Adopt complete working platform
- Build ON TOP, not from scratch
- Leverage existing battle-tested code

---

## The New Three-Layer Stack

```
┌─────────────────────────────────────────────────────────┐
│                   TRUTH SEED LAYER                       │
│                  (What Already Exists)                   │
├─────────────────────────────────────────────────────────┤
│ • emdash-auth: Production authentication gateway         │
│ • emdash-dashboard: Partial dashboard implementation     │
│ • Supabase: 25+ tables across 3 schemas                 │
│ • Features: Auth, teams, chat, debates, judging         │
└─────────────────────────────────────────────────────────┘
                           ↕️
┌─────────────────────────────────────────────────────────┐
│              TRUTH OPERATING SYSTEM LAYER                │
│                  (What We Built)                         │
├─────────────────────────────────────────────────────────┤
│ • Reality Agents: Monitor system state                   │
│ • Truth API: Validate and verify                        │
│ • Dashboards: Visualize health and metrics              │
│ • Constitutional OS: Phase-aware development            │
└─────────────────────────────────────────────────────────┘
                           ↕️
┌─────────────────────────────────────────────────────────┐
│                 FAT CLIENT LAYER                         │
│                  (What We'll Build)                      │
├─────────────────────────────────────────────────────────┤
│ • Vanilla HTML/JS: Fast, simple, maintainable           │
│ • EDL Features: Call signs, emCoin, achievements        │
│ • Educational Tools: Curriculum, progress tracking       │
│ • Student Identity: "Cyworld of Education" vision       │
└─────────────────────────────────────────────────────────┘
```

---

## Implementation Strategy

### Phase A: Foundation Integration (Sessions 41-45)
**Goal**: Get Truth Seed operational

1. **Auth Gateway Deployment**
   - Fork emdash-auth
   - Configure environment variables
   - Deploy to Vercel subdomains
   - Test cookie propagation

2. **Database Migration**
   - Use existing 25+ table structure
   - Add EDL-specific columns (call_sign)
   - Configure RLS policies
   - Seed initial data

3. **Dashboard Completion**
   - Assess what's working/broken
   - Complete critical features
   - Implement onboarding flow
   - Add call sign selection

### Phase B: TOS Integration (Sessions 46-50)
**Goal**: Connect monitoring infrastructure

1. **Reality Agent Updates**
   - Reconfigure for new schema
   - Monitor 25+ tables
   - Track debate activity
   - Validate data integrity

2. **Truth API Enhancement**
   - Consume new data model
   - Expose debate metrics
   - Track educational progress
   - Monitor system health

3. **Dashboard Updates**
   - Visualize debate data
   - Show team activity
   - Display judge feedback
   - Track student progress

### Phase C: Fat Client Development (Sessions 51+)
**Goal**: Build EDL-specific features

1. **Vanilla JS Framework**
   - Simple, fast, maintainable
   - No build complexity
   - Direct Supabase integration
   - Cookie-based auth

2. **EDL Features**
   - Call sign system
   - EmCoin economy
   - Achievement badges
   - Learning paths

3. **Educational Tools**
   - Curriculum management
   - Progress tracking
   - Peer evaluation
   - Resource library

---

## Key Documents

### Primary References (Read First)
1. **AUTH-MASTERPLAN.md** - Complete auth implementation guide
2. **DASHBOARD-MASTERPLAN.md** - Dashboard completion strategy
3. **PIVOT-NOTICE-00041.md** - Why and how we pivoted

### Truth Seed Code
- `/truth-seed/emdash-auth-main/` - Auth gateway
- `/truth-seed/emdash-dashboard-main/` - Dashboard app
- `/truth-seed/supabase-migration/` - Database schema

### TOS Infrastructure
- `/reality/` - Reality Agents
- `/scripts/` - Truth API and tools
- `/archive/sessions/` - Historical context

---

## Success Metrics

### Immediate (Sessions 41-45)
- [ ] Auth gateway deployed and working
- [ ] Users can sign up and login
- [ ] Sessions persist across subdomains
- [ ] Dashboard displays user data

### Short-term (Sessions 46-50)
- [ ] Reality Agents monitoring new schema
- [ ] Truth API serving debate metrics
- [ ] Onboarding flow complete
- [ ] Call signs implemented

### Long-term (Sessions 51+)
- [ ] Fat Client operational
- [ ] EmCoin economy active
- [ ] 100+ active students
- [ ] Full curriculum integrated

---

## Why This Approach Works

### 1. **Instant Infrastructure**
Instead of months building auth, we have it TODAY. Instead of weeks on teams, we have it NOW. This acceleration is transformative.

### 2. **Perfect Domain Fit**
Debate IS education. The platform already models:
- Students competing (learning)
- Judges evaluating (teaching)
- Teams collaborating (classrooms)
- Scores tracking (grades)

### 3. **Production Tested**
The emdash platform has real users, real data, real battles fought and won. We inherit that stability.

### 4. **Extensibility**
The foundation is solid enough to build upon. We can add EDL features without breaking core functionality.

### 5. **Maintain TOS Value**
Our Reality Agents, Truth API, and monitoring infrastructure remain valuable - they ensure the Truth Seed stays healthy.

---

## Migration Checklist

### ✅ Completed (Session 41)
- [x] Analyzed complete emdash platform
- [x] Created AUTH-MASTERPLAN.md
- [x] Updated core documentation
- [x] Made pivot decision official

### 🔄 In Progress
- [ ] Deploy auth gateway
- [ ] Configure environment variables
- [ ] Test complete auth flow
- [ ] Create DASHBOARD-MASTERPLAN.md

### 📅 Next Steps
- [ ] Complete dashboard features
- [ ] Implement call sign system
- [ ] Build Fat Client prototype
- [ ] Add EmCoin economy

---

## The Vision Remains

Despite the architectural pivot, our vision remains unchanged:

**"The Cyworld of Education"** - Where students build academic identities like Koreans built digital personas. The debate platform provides the perfect foundation for this vision:

- **Minihompy** → Student Dashboard
- **Dotori** → EmCoin
- **Ilchon** → Teams & Friends
- **Backgrounds** → Achievements & Badges
- **Music** → Learning Paths
- **Guestbook** → Peer Feedback

---

## Conclusion

V4 represents maturity in our approach. We recognize that the best code is code we don't have to write. By adopting the emdash platform as our Truth Seed, we accelerate development by months while maintaining our vision and values.

The Truth Operating System we built remains valuable as the monitoring and validation layer. The Fat Client approach gives us flexibility to innovate. Together, these three layers create a robust, scalable, and maintainable architecture.

**This is not a retreat - it's an advance with better intelligence.**

---

**Document Status**: ACTIVE - This is the current strategic framework  
**Created**: Session 00041  
**Next Review**: After auth gateway deployment  
**Success Criteria**: Working authentication across subdomains