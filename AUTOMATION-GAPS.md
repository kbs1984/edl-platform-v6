# Automation & API Gaps Documentation
Created: Session 00008
Purpose: Track what Reality Agents we're NOT building yet

## Not Implemented (By Design)

### API Contract Reality Agent
- **Why Not**: No API server exists
- **Current Reality**: Static HTML files only
- **Trigger for Implementation**: When dashboard.html starts making real API calls
- **Detected Pattern**: Static Asset Agent found fetch() calls in dashboard.html (INFO level)

### n8n Workflow Reality Agent
- **Why Not**: No n8n instance exists
- **Current Reality**: No automation workflows
- **Trigger for Implementation**: When n8n is installed and first workflow created
- **Future Use Cases**:
  - Automated deployments on git push
  - Scheduled dashboard data updates
  - Integration health monitoring alerts

### Frontend Build Reality Agent
- **Why Not**: No build system (webpack, vite, etc.)
- **Current Reality**: Static files served directly
- **Trigger for Implementation**: When build tools are added

## Evolution Triggers

The Static Asset Agent will detect when these agents are needed:
- API patterns in HTML → Need API Contract Agent
- Build artifacts appearing → Need Frontend Build Agent
- Workflow files detected → Need n8n Agent

## Current Coverage

What IS monitored:
- ✅ Files (FileSystem Agent)
- ✅ Git (GitHub Agent)
- ✅ Database (Supabase Agent - needs credentials)
- ✅ Deployments (Vercel Agent)
- ✅ Static Assets (Static Asset Agent)

What's NOT monitored (intentionally):
- ❌ API Contracts (no API)
- ❌ Workflows (no n8n)
- ❌ Build Process (no build system)
- ❌ Docker (no containers)
- ❌ CI/CD (using Vercel auto-deploy)

## Reality-Driven Development

This document embodies the principle: "Build on truth, not assumptions"

Each agent NOT built represents a conscious decision based on current reality:
1. **No API Server** = No API Contract Agent
2. **No Build System** = No Frontend Build Agent
3. **No Workflow Engine** = No n8n Agent

When reality changes (e.g., an API server is added), the corresponding agent should be built.

## Future Evolution Path

```
Current State (Session 00008):
├── Static HTML files
├── Python Reality Agents
└── Vercel deployment

↓ When API is added:
├── API Contract Agent activated
├── Frontend starts calling /api/*
└── Contract gaps monitored

↓ When build system added:
├── Frontend Build Agent activated
├── Bundle sizes tracked
└── Build failures detected

↓ When n8n added:
├── Workflow Agent activated
├── Automation flows monitored
└── Integration triggers tracked
```

## Session 00008 Decision Log

- **Built**: Vercel Reality Agent (deployment exists)
- **Built**: Static Asset Reality Agent (static files exist)
- **Skipped**: API Contract Agent (no API exists)
- **Skipped**: n8n Agent (no workflows exist)

This aligns with Reality Agent philosophy:
> "Monitor what IS, not what SHOULD BE"