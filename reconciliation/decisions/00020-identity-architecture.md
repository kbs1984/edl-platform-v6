# Educational Identity Architecture Decisions

**Session**: 00020  
**Date**: 2025-08-17  
**Purpose**: Key architectural decisions for identity platform

---

## Decision 1: Identity First, Features Second

**Decision**: Build identity features before functional features
**Rationale**: Cyworld succeeded through identity, not functionality
**Implication**: Dashboard before debates, customization before activities
**Alternative Rejected**: Feature-complete platform with profiles added

---

## Decision 2: Vanilla Stack for Transparency

**Decision**: Use HTML/JS/CSS without frameworks
**Rationale**: "Text is Rex" - transparency over magic
**Implication**: No build process, direct manipulation
**Alternative Rejected**: React/Vue/Angular frameworks

---

## Decision 3: Supabase for Complete Backend

**Decision**: Supabase handles auth, database, storage, realtime
**Rationale**: Single source of truth, proven scale
**Implication**: All backend logic in Supabase
**Alternative Rejected**: Custom backend, multiple services

---

## Decision 4: Progressive Enhancement Strategy

**Decision**: Start simple, enhance based on usage
**Rationale**: Learn what students actually want
**Implication**: Basic features first, complexity later
**Alternative Rejected**: Build everything upfront

---

## Decision 5: Cyworld Patterns as Foundation

**Decision**: Map Cyworld features directly to EDL
**Rationale**: Proven engagement patterns
**Implication**: Today counter, minihompy, dotori equivalents
**Alternative Rejected**: Generic EdTech patterns

---

## Decision 6: Mobile-First Responsive

**Decision**: Design for mobile, enhance for desktop
**Rationale**: Students primarily on phones
**Implication**: Touch-friendly, vertical layouts
**Alternative Rejected**: Desktop-first design

---

## Decision 7: Real-time via Polling Initially

**Decision**: Start with polling, upgrade to websockets
**Rationale**: Simpler to implement and debug
**Implication**: 30-second update intervals initially
**Alternative Rejected**: WebSocket complexity upfront

---

## Decision 8: File-Based Configuration

**Decision**: Store config in JSON files
**Rationale**: Visible, versionable, simple
**Implication**: No hidden database config
**Alternative Rejected**: Database configuration tables

---

## Decision 9: Session-Based Development

**Decision**: Each session owns its deliverables
**Rationale**: Clear ownership and tracking
**Implication**: Files prefixed with session numbers
**Alternative Rejected**: Unnamed collaborative editing

---

## Decision 10: Reality Agents as Truth

**Decision**: Reality Agents verify all claims
**Rationale**: Truth over assumptions
**Implication**: Regular Reality Agent checks required
**Alternative Rejected**: Trust without verification

---

## Technical Stack Summary

```
Frontend: Vanilla HTML/JS/CSS
Backend: Supabase (PostgreSQL + Auth + Storage)
Deployment: Vercel
Repository: GitHub
Automation: n8n (future)
Monitoring: Reality Agents
```

---

## Identity Components Architecture

```
User Identity
├── Call_sign (unique identifier)
├── Profile (personal data)
├── Dashboard (personal space)
├── Achievements (journey markers)
└── Customization (personality expression)

Social Identity
├── Teams (group belonging)
├── Roles (specialization)
├── Connections (relationships)
└── Activity (community participation)

Economic Identity
├── emCoin Balance (wealth)
├── Transactions (history)
├── Purchases (investments)
└── Rewards (earnings)
```

---

*Architectural decisions for "Cyworld of Education" platform*