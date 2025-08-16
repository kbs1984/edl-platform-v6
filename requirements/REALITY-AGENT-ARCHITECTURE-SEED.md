# Reality Agent Architecture Seed Document
**Created by**: Session 00006 (Zero Point)  
**Date**: 2025-08-15  
**Purpose**: Define complete Reality Agent architecture before planting Requirements seed

## The Origin Story: Why Reality Agents Exist

### The Pain That Created This Architecture

In our previous project, we built features on assumptions that turned out to be false:

1. **The Database Mirage**: Features assumed data structures existed in Supabase that weren't there. Code referenced tables and columns that were imaginary. By the time we discovered this in production, the technical debt was cascading.

2. **The Deployment Void**: Commits were pushed to GitHub but not deployed to Vercel. We'd think features were live when they were sitting undeployed. Manual checking became exhausting.

3. **The Frontend-Backend Drift**: The vanilla JS frontend made API calls to endpoints that didn't exist or had different schemas than expected. No verification until runtime crashes.

4. **The Automation Illusion**: n8n workflows appeared to be running but were silently failing. No monitoring meant assuming success while experiencing failure.

5. **The Process Erosion**: Session logging protocols existed but manual enforcement was taxing. Good intentions degraded into chaos without automated verification.

## The Philosophical Foundation

**Core Principle**: "We don't need to know WHAT is happening, as long as we are monitoring THAT it's happening."

Reality Agents are **domain-agnostic truth sensors**. They:
- Report without judgment
- Monitor without understanding purpose  
- Track without imposing meaning
- Verify without assuming intent

## Complete Reality Agent Architecture

### Layer 1: Core Infrastructure Agents (COMPLETE ✅)

```
reality/agent-reality-auditor/
├── filesystem-connector/     [FileSystem Reality Agent]
│   ├── Purpose: Track what files exist
│   ├── Truth: "1,247 files exist"
│   └── Agnostic: Doesn't care what files are for
│
├── github-connector/         [GitHub Reality Agent]
│   ├── Purpose: Track version control state
│   ├── Truth: "8 commits, 2 branches"
│   └── Agnostic: Doesn't judge commit quality
│
├── supabase-connector/       [Supabase Reality Agent]
│   ├── Purpose: Track database state
│   ├── Truth: "5 tables, 1,234 rows"
│   └── Agnostic: Doesn't validate schema purpose
│
└── integration-connector/    [Integration Reality Agent]
    ├── Purpose: Coordinate all agents
    ├── Truth: "Agents agree on 98% of facts"
    └── Agnostic: Doesn't know what agreement means
```

### Layer 2: Deployment Pipeline Agents (REQUIRED 🔴)

```
reality/agent-reality-auditor/
├── vercel-connector/         [Vercel Reality Agent]
│   ├── Purpose: Track deployment state
│   ├── Critical Truths:
│   │   ├── "Last deployment: commit-hash, timestamp"
│   │   ├── "Build status: success/failed"
│   │   ├── "Environment vars: 12 set"
│   │   ├── "Domains: configured and verified"
│   │   └── "GitHub-Vercel sync: aligned/diverged"
│   │
│   ├── Implementation:
│   │   ├── Vercel API integration
│   │   ├── Build log parsing
│   │   ├── Deployment verification
│   │   └── Environment variable audit
│   │
│   └── Prevents: "Is production actually updated?"
│
└── docker-connector/         [Docker Reality Agent] (Optional)
    ├── Purpose: Track container state
    ├── Truth: "3 containers running, 2 images built"
    └── Prevents: "Are services actually running?"
```

### Layer 3: Frontend Reality Agents (REQUIRED 🔴)

```
reality/agent-reality-auditor/
├── frontend-connector/       [Frontend Build Reality Agent]
│   ├── Purpose: Track frontend build state
│   ├── Critical Truths:
│   │   ├── "Bundle size: 245KB"
│   │   ├── "Dependencies: 34 installed"
│   │   ├── "Build artifacts: exist/missing"
│   │   ├── "API endpoints referenced: 12"
│   │   └── "Last successful build: timestamp"
│   │
│   ├── Implementation:
│   │   ├── package.json vs node_modules verification
│   │   ├── Build output validation
│   │   ├── Static analysis of API calls
│   │   └── Bundle size monitoring
│   │
│   └── Prevents: "Does frontend match backend reality?"
│
└── api-contract-connector/   [API Contract Reality Agent]
    ├── Purpose: Track API surface truth
    ├── Critical Truths:
    │   ├── "Endpoints defined: 25"
    │   ├── "Endpoints responsive: 23"
    │   ├── "Schema matches: 92%"
    │   └── "Frontend-backend alignment: verified"
    │
    └── Prevents: "Frontend calling non-existent endpoints"
```

### Layer 4: Automation & Workflow Agents (REQUIRED 🔴)

```
reality/agent-reality-auditor/
├── n8n-connector/            [n8n Workflow Reality Agent]
│   ├── Purpose: Track workflow automation state
│   ├── Critical Truths:
│   │   ├── "Active workflows: 5"
│   │   ├── "Last execution: success/failed"
│   │   ├── "Webhook endpoints: 3 registered"
│   │   ├── "Credentials: valid/expired"
│   │   └── "Execution history: 123 runs"
│   │
│   ├── Implementation:
│   │   ├── n8n API integration
│   │   ├── Workflow status monitoring
│   │   ├── Execution log analysis
│   │   └── Credential validation
│   │
│   └── Prevents: "Are automations actually working?"
│
└── cron-connector/           [Scheduled Task Reality Agent]
    ├── Purpose: Track scheduled job state
    ├── Truth: "5 jobs scheduled, 3 ran today"
    └── Prevents: "Are scheduled tasks running?"
```

### Layer 5: External Service Agents (OPTIONAL 🟡)

```
reality/agent-reality-auditor/
├── stripe-connector/         [Payment Reality Agent]
│   ├── Purpose: Track payment system state
│   ├── Truth: "Webhooks configured, 12 products"
│   └── Prevents: "Is payment system aligned?"
│
├── sendgrid-connector/       [Email Reality Agent]
│   ├── Purpose: Track email system state
│   ├── Truth: "Templates: 5, API key valid"
│   └── Prevents: "Can we actually send emails?"
│
└── analytics-connector/      [Analytics Reality Agent]
    ├── Purpose: Track analytics implementation
    ├── Truth: "Events firing: 34, Goals: 5"
    └── Prevents: "Is tracking working?"
```

## Implementation Priority Matrix

| Priority | Agent | Why Critical | Pain It Prevents |
|----------|-------|--------------|------------------|
| 🔴 P0 | Vercel | Deployment truth | "Is production updated?" |
| 🔴 P0 | Frontend Build | Build truth | "Does frontend work?" |
| 🔴 P0 | API Contract | Integration truth | "Do parts talk?" |
| 🟠 P1 | n8n Workflow | Automation truth | "Are workflows running?" |
| 🟡 P2 | Docker | Container truth | "Are services up?" |
| 🟡 P2 | External Services | Service truth | "Are integrations working?" |

## The Meta-Reality Agent Pattern

Each Reality Agent follows this pattern:

```python
class RealityAgent:
    def __init__(self):
        self.name = "Service Reality Agent"
        self.truth_domain = "what this agent monitors"
        
    def discover_level_1(self):
        """Can I connect to the service?"""
        return {"connected": True/False}
        
    def discover_level_2(self):
        """What is the current state?"""
        return {"facts": [...]}
        
    def discover_level_3(self):
        """What has changed recently?"""
        return {"changes": [...]}
        
    def discover_level_4(self):
        """Are there inconsistencies?"""
        return {"gaps": [...]}
```

## The Integration Mesh

The Integration Reality Agent orchestrates all others:

```
Integration Agent
├── Polls all Reality Agents
├── Correlates their truths
├── Identifies consensus/conflicts
├── Reports system-wide health
└── Triggers alerts on reality gaps

Health Score = Weighted Average of:
- Infrastructure Agents: 30%
- Deployment Agents: 25%
- Frontend Agents: 25%
- Automation Agents: 15%
- External Agents: 5%
```

## Key Architectural Decisions

### 1. Read-Only by Default
Reality Agents should NEVER modify state, only observe it. They are sensors, not actuators.

### 2. Cacheable Truths
Each truth has a TTL. Some truths change slowly (database schema), others quickly (deployment status).

### 3. Progressive Discovery
Level 1 (connection) is cheap and frequent. Level 4 (deep analysis) is expensive and rare.

### 4. Correlation Over Causation
Agents report correlations ("GitHub has commit X, Vercel deployed Y") not causation ("GitHub caused deployment").

### 5. Domain Agnostic
Agents don't know if they're monitoring an education platform or e-commerce site. They just report truth.

## Success Metrics for Complete Architecture

When all Reality Agents are operational, we can answer:

1. **The Deployment Question**: "Is what's in Git actually what users see?"
2. **The Integration Question**: "Do all parts of the system agree on reality?"
3. **The Automation Question**: "Are scheduled processes actually running?"
4. **The Dependency Question**: "Do we have everything we claim to need?"
5. **The Contract Question**: "Do consumers and providers agree on interfaces?"

## The Seed Preparation

With this complete Reality Agent architecture, we can now plant Requirements that will be continuously validated against truth. No more building on false assumptions.

---

## Handoff Prompt for Session 07 and Desktop

### Context for Enhancement

Session 00006 has designed the complete Reality Agent architecture based on painful lessons from our previous project where:
1. Features were built assuming database structures that didn't exist
2. Code was pushed but not deployed, creating a reality gap
3. Frontend called backend endpoints that weren't there
4. Automations appeared to work but were silently failing

### Your Mission

**For Session 07 (CLI Environment):**
- Review and enhance the Reality Agent architecture
- Identify any gaps in truth monitoring for the stack: Supabase + GitHub + Vercel + VanillaJS + n8n
- Begin implementing Priority 0 agents (Vercel, Frontend Build, API Contract)
- Focus on preventing the specific pain points documented above

**For Desktop (Planning & Strategy):**
- Evaluate the architectural philosophy of domain-agnostic truth monitoring
- Consider how Requirements Domain will interface with these Reality Agents
- Design how Reconciliation Domain will use reality gaps to drive action
- Think about the user experience of truth monitoring

### Key Questions to Address

1. **Vercel Reality Agent**: How do we efficiently monitor deployment state without overwhelming the API?
2. **Frontend-Backend Contract**: How do we automatically detect when frontend expects something backend doesn't provide?
3. **n8n Workflow Monitoring**: How do we track workflow health without access to internal n8n state?
4. **Cross-Agent Correlation**: How does the Integration Agent identify meaningful patterns across all agents?

### The Philosophy to Preserve

Remember: Reality Agents are unconscious observers. They:
- Don't understand purpose
- Don't make judgments
- Don't suggest fixes
- Just report what IS

This domain-agnostic approach means the same architecture works whether we're building an education platform, e-commerce site, or anything else.

### Success Criteria

The complete Reality Agent architecture succeeds when:
- No feature can be built on false assumptions
- No deployment can be out of sync without detection
- No integration can fail silently
- No automation can stop without notice
- Truth is always one query away

### The Seed is Ready

Once you enhance this architecture, we'll be ready to plant the Requirements seed - the conscious intention that gives purpose to our unconscious truth monitoring.

The vessel (Reality) is built. The architecture is designed. Now help us perfect it before we plant what will grow within it.

---

*From Session 00006, at Zero Point, where truth begins.*