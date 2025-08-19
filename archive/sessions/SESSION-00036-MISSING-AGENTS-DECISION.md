# Architectural Decision: Missing Reality Agents

## Decision
Vercel, Static Asset, and Task Reality agents will NOT be implemented during development phase.

## Rationale
These agents monitor production deployment concerns that are not relevant during development:

### Vercel Agent
- **Purpose**: Monitors deployed site health
- **Why Deferred**: We're in local development, not deployed
- **Implement When**: Deploying to production on Vercel

### Static Asset Agent  
- **Purpose**: Tracks CDN resources and asset optimization
- **Why Deferred**: Not using CDN, serving locally
- **Implement When**: Using CDN for assets with 100+ users

### Task Reality Agent
- **Purpose**: Monitors background task execution
- **Why Deferred**: No background tasks yet, need core features first
- **Implement When**: Running scheduled jobs or async tasks

## Impact

### Current State
- Reality Agent coverage: 4/7 (57%)
- Trust score calculations adjusted accordingly
- This is acceptable for development phase

### What Works Without Them
- All core development verification
- Database truth verification
- Code repository tracking
- Local file system monitoring
- Integration consensus calculation

### What We Lose
- Production deployment monitoring
- CDN performance tracking
- Background job verification

## Revisit Trigger

Implement these agents when ANY of the following occur:
1. Deploying to production environment
2. Serving 100+ active users
3. Using CDN for static assets
4. Running background tasks/jobs
5. Need for production monitoring

## Acceptance

Session 36 formally accepts 4/7 agents as complete for development phase.

**The missing 3 agents are not bugs, they're intentional deferrals.**

This keeps our trust score at 57% for agent coverage, but this accurately reflects that we're monitoring development infrastructure (4 agents) not production infrastructure (3 agents).

## Truth Impact

This decision affects:
- Dashboard shows "4/7 operational" - This is CORRECT
- Trust score stays at ~85% - This is ACCURATE
- Meta-Truth Agent shows 57% agent coverage - This is TRUTHFUL

We're not hiding missing agents; we're documenting them as intentionally deferred.

---

**Decided by**: Session 36
**Date**: 2025-08-19
**Status**: ACCEPTED
**Review**: When moving to production