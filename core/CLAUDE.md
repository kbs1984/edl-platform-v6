---
session: "multiple"
type: "guide"
status: "current"
created: "2025-01-01"
modified: "2025-09-02"
title: "Claude Code Session Protocol v3.0"
purpose: "Define mandatory protocols and guidelines for all Claude Code sessions"
topics: ["protocol", "session", "guidelines", "constitution", "workflow"]
priority: "P0"
domain: "core"
audience: "developer"
complexity: "intermediate"
validation_method: "manual"
review_date: "2025-09-23"
estimated_shelf_life: "indefinite"
related_to: ["SYSTEM-INDEX.md", "00031-CONSTITUTIONAL-OS-GUIDE.md", "00031-WORKFLOW-BOUNDARIES.md", "PROJECT-STRUCTURE.md"]
implements: ["SESSION-PROTOCOL.md"]
---

# Claude Code Session Protocol v3.0 (MCP-Enhanced)
## THREE CURRENTS MODEL - SESSION 73 INSIGHT (SIMPLIFIED)

🌊 **IMPORTANT CONCEPT**: The three domains (Requirements/Reality/Reconciliation) should be treated as continuous currents, not sequential phases.

⚠️ **WARNING**: Session 73 created complex parallel scripts that Desktop identified as over-engineered. See `core/00073-DESKTOP-REALITY-CHECK.md` for why NOT to use them.

**SIMPLIFIED APPROACH** (Recommended):
```bash
# One Claude, natural flow between domains
When stuck → Check Reality (run agents)
When clear → Reconcile (implement solutions)
When done → Discover Requirements (next needs)
```

**If you want time-boxed domains**:
- 09:00-10:00: Requirements focus
- 10:00-11:00: Reality checks
- 11:00-12:00: Reconciliation work

The key insight: Domains are CURRENTS (continuous) not STEPS (sequential).

## CRITICAL ARCHITECTURAL PIVOT - SESSION 41

🚨 **MANDATORY READING BEFORE ANY WORK** 🚨
1. **TRUTH-SEED-ADOPTION-DECISION.md** - 🔴 AUTHORITATIVE - NO DEBATE
2. **00096-TRUTH-SEED-DIRECTORY-PROTOCOL.md** - 🔒 LOCKED directory usage rules
3. **requirements/masterplans/AUTH-MASTERPLAN.md** - Auth gateway implementation
4. **requirements/masterplans/DASHBOARD-MASTERPLAN.md** - Dashboard completion
5. **QUICK-START-00042.md** - Quick navigation reference

**DECISION IS FINAL**: Full adoption of ALL 36 tables. No hybrids. No partial adoption.

**Directory Protocol (Session 96 LOCKED)**:
- **truth-seed/**: READ-ONLY reference (NEVER edit or deploy from)
- **reconciliation/active-work/**: ALL development and deployment
- See `core/00096-TRUTH-SEED-DIRECTORY-PROTOCOL.md` for enforcement

**Strategic Framework**: requirements/masterplans/AUTH-MASTERPLAN.md + DASHBOARD-MASTERPLAN.md
**Active Work**: reconciliation/active-work/ (ONLY place to edit/deploy)
**Old Framework**: RESTORATION-MASTERPLAN-V3.md (DEPRECATED - historical reference only)

## Session Logging Requirements (Constitutional)

### First Action Protocol v4.0 (Session 84 YAML Query Mandate)
**EVERY SESSION MUST START WITH:**

#### Step 1: Automated Startup (v3.0 - MCP Enhanced)
```bash
# MCP-Integrated session startup (Session 140 upgrade)
./scripts/00140-mcp-integrated-session-start.sh [session-number] "[focus]"

# Examples:
./scripts/00140-mcp-integrated-session-start.sh              # Auto-detect next session
./scripts/00140-mcp-integrated-session-start.sh 141          # Specific session number
./scripts/00140-mcp-integrated-session-start.sh 141 "EmCoin UI"  # With focus

# Legacy (if MCP not available):
./scripts/00028-session-start.sh [session-number] "[focus]"
```

This automation will:
1. Run all Reality Agents (8 seconds)
2. Parse outputs and generate reports
3. Load context from previous session
4. Check for handoffs
5. Create constitutional session log
6. Display system health summary
7. Run YAML queries for session focus topic
8. **NEW (Session 140)**: Initialize MCP session tracking with edl-v6-session server

**After startup, use MCP functions throughout session:**
```javascript
mcp__edl-v6-session__start_session({sessionId: "141", focus: "Your focus"})
mcp__edl-v6-session__add_task({title: "Task name", priority: "high"})
mcp__edl-v6-session__track_deliverable({path: "file.ext", type: "component"})
mcp__edl-v6-session__end_session({summary: "Done", accomplishments: [...]})
```

#### Step 2: MANDATORY YAML Query Discovery (NEW - Session 84)
🚨 **BEFORE ANY WORK - ALWAYS QUERY EXISTING SOLUTIONS** 🚨
```bash
# 1. Find all existing work on your topic (0.15s query time)
python3 scripts/00059-yaml-query.py --topic "[your-topic]"

# 2. Check for incomplete related work that needs finishing
python3 scripts/00059-yaml-query.py --topic "[your-topic]" --status incomplete

# 3. Find recent work on this topic from last 10 sessions
python3 scripts/00059-yaml-query.py --session "0007*" --topic "[your-topic]"
python3 scripts/00059-yaml-query.py --session "0008*" --topic "[your-topic]"

# 4. Check what implements relevant masterplans
python3 scripts/00059-yaml-query.py --implements AUTH-MASTERPLAN.md
python3 scripts/00059-yaml-query.py --implements DASHBOARD-MASTERPLAN.md

# 5. Find all fixes related to your area
python3 scripts/00059-yaml-query.py --type fix --topic "[your-topic]"
```

**Why This is MANDATORY** (Session 84 Discovery):
- Queries take 0.15s vs 2-5s for manual searching
- 99.6% cache hit rate - instant results
- Prevents duplicate work (Sessions 80-83 rediscovered existing solutions)
- Finds cross-references and implementations instantly
- 96% of files have searchable metadata

**Manual fallback if automation fails**:
- Run `./scripts/00028-reality-check.sh` for Reality Agents
- Create log with `./scripts/00028-create-session-log.sh`
- Still run YAML queries manually before starting work
- See `scripts/00028-AUTOMATION-README.md` for details

#### Step 3: Context Loading
**THEN CONTINUE WITH:**
1. **MANDATORY**: Read RESTORATION-MASTERPLAN-V3.md completely
2. **MANDATORY**: Read relevant INDEX files for current domain focus
3. Check if session log exists: `ls archive/sessions/SESSION-00XXX-LOG.md`
4. If missing, create immediately: `./scripts/create-session-log.sh 00XXX "Session Focus"`
5. Check system structure: `./scripts/structure-check.sh`
6. Document system state in log (Reality Agents, Health, Domains)
7. Validate protocol compliance: `./scripts/session-guard.sh`
8. **CONFIRM**: Understanding of current phase (Prototype vs Production)
9. **VERIFY**: Work assignments match V3 masterplan phase structure

### During Session
- Update session log with major milestones
- Document deliverables when created
- Track system health changes
- Note issues discovered/resolved

### Before Session End
- Ensure log has >50 lines for substantial work
- Include handoff information for next session
- **UPDATE INDEX FILES** (MANDATORY): System-INDEX.md, domain INDEX files, CLAUDE.md if tools/protocols added
- **MAINTAIN LIVING DOCS**: Update 00031-WORKFLOW-BOUNDARIES.md or other protocol docs if enhanced
- Verify constitutional compliance (retroactive disclosure if needed)
- Run final validation: `./scripts/session-guard.sh`

## 🛑 EVIDENCE IMPERATIVE PROTOCOL (Session 145 - MANDATORY)
**CRITICAL**: Evidence-based decision making is NOT OPTIONAL but IMPERATIVE.

### The Protocol That Prevents Disasters
**Read this first**: `core/00145-EVIDENCE-IMPERATIVE-PROTOCOL.md`

### Before ANY Action:
1. **STOP** - Don't move/delete/modify based on patterns
2. **VERIFY** - Check actual purpose and usage with evidence
3. **TEST** - Validate claims before declaring success

### Quick Evidence Gathering:
```bash
# Before touching any file
grep -r "filename" . --exclude-dir=node_modules  # Who uses it?
head -30 [file] | grep -i "purpose"              # What's it for?

# Before building anything  
python3 scripts/00059-yaml-query.py --topic "[feature]"  # Already exists?
mcp__supabase-dev__list_tables()                        # Tables exist?

# Before claiming completion
npm run build  # Does it compile?
npm test      # Does it work?
```

**Recent Violations**: Sessions 144 & 145 both violated this, causing infrastructure damage.
**The best code is code you don't write because you verified it already exists.**

See: `core/00145-EVIDENCE-IMPERATIVE-PROTOCOL.md` for full enforcement.

## Constitutional Compliance
Per Constitution v1.3.0 Article VII:
- Retroactive logging is acceptable if disclosed
- Truth priority over timing
- All session work must be documented
- **V3 Addition**: Work must align with two-phase implementation strategy

## Available Tools (Protocol v2.0)
- `scripts/create-session-log.sh` - v2.0 Template with System State section
- `scripts/session-guard.sh` - Validates v2.0 compliance (System State required)
- `scripts/structure-check.sh` - Quick system structure overview

## File Naming Convention (Session 31 Established)
**MANDATORY**: All deliverable files must be prefixed with session number for tracking
- Format: `00XXX-filename.md` or `00XXX-scriptname.sh`
- Example: `00031-WORKFLOW-BOUNDARIES.md`, `scripts/00031-auth-autonomous-verification.py`
- Purpose: Visual tracking of session contributions for macro analysis

## Constitutional Operating System (Session 31-32)
**MANDATORY READING**: Phase-aware development philosophy adapting to natural rhythms
- **Master Guide**: `00031-CONSTITUTIONAL-OS-GUIDE.md` - Overview of phase-based system (in root)
- **Phase Guides**: Read the guide for your current phase (in core/):
  - `core/00031-PHASE-SEED-GUIDE.md` - Exploration & architecture (FLEXIBLE enforcement)
  - `core/00031-PHASE-GROW-GUIDE.md` - Active implementation (MODERATE enforcement)
  - `core/00031-PHASE-HARVEST-GUIDE.md` - Validation & documentation (STRICT enforcement)
- **Dashboard** (Session 32): Check phase and health with `./scripts/00032-tos-dashboard.sh`

## Workflow Boundaries Protocol (Session 31 Addition)
**MANDATORY READING**: `00031-WORKFLOW-BOUNDARIES.md` - Defines Claude Code autonomous capabilities vs manual intervention requirements (in root)
- **Autonomous Testing**: `scripts/00031-auth-autonomous-verification.py` - Database, file structure, configuration validation
- **Manual Protocol**: `core/00031-MANUAL-INTERVENTION-PROTOCOL.md` - When and how to transition to human testing
- **Testing Checklist**: `core/00031-MANUAL-TESTING-CHECKLIST.md` - Systematic manual verification requirements
- **Key Principle**: NEVER claim testing is complete without following autonomous → manual protocol

## Unified File System & Metadata Protocol (Session 69 CRITICAL UPDATE)

**MANDATORY**: Read `core/00069-UNIFIED-FILE-SYSTEM-PROTOCOL.md` - This is the AUTHORITATIVE protocol for all file organization and metadata.

### Core Principle
**Every file has YAML frontmatter that determines both its metadata AND its physical location.**

### Quick Reference
```yaml
---
# REQUIRED FIELDS (determine file placement)
session: "00069"        # Session number or "legacy"
type: "protocol"        # Determines subdirectory
status: "current"       # Lifecycle state
created: "2025-08-25"   # ISO date
domain: "core"          # DETERMINES PRIMARY LOCATION
---
```

### File Placement Rules
| Domain | Location | Description |
|--------|----------|-------------|
| `core` | `core/` | Infrastructure, protocols, guides |
| `reality` | `reality/` | Reality agents, monitoring |
| `requirements` | `requirements/` | User stories, specs |
| `reconciliation` | `reconciliation/` | Integration work |

**Special Cases**: `type: log` → `archive/sessions/`, `type: script` → `scripts/`

### Essential Tools
- **Add YAML**: `scripts/00061-add-yaml-frontmatter.py [file]`
- **Fix Validation**: `python3 scripts/00068-fix-yaml-validation.py`
- **Auto-Organize**: `python3 scripts/00067-auto-organize-files.py --execute [file]`
- **Query Files**: `python3 scripts/00059-yaml-query.py --domain core --type protocol`

### Current Status (Session 69)
- **YAML Coverage**: 97.7% (462/473 files)
- **Validation Pass**: 96.8%
- **Organization Score**: 91.2/100
- **Pre-commit hooks**: INSTALLED

### File Organization Structure (Sessions 67-69 Evolution)
- **core/**: Essential platform documentation (67+ files)
  - Unified protocol, Constitutional OS guides, critical specs
- **archive/**: Historical records (logs, handoffs, legacy work)
- **scripts/**: Tools with lifecycle metadata (ON/OFF/OBSOLETE)

## System State Documentation (V3 Enhanced)
Every session log MUST include a "System State at Session Start" section with:
- Reality Agents operational status (7 agents total)
- Overall System Health percentage  
- Domains completion status (Requirements: 100%, Reality: 97%, Reconciliation: TBD)
- Key metrics (stories: 154, tests: 55, constraints documented)
- **V3 Addition**: Current phase status (Prototype vs Production)
- Reference to RESTORATION-MASTERPLAN-V3.md

This prevents sessions from wasting time "rediscovering" existing components and ensures alignment with strategic framework.

## MCP Session Tools Limitation
⚠️ **IMPORTANT**: The MCP session management tools track metadata but DO NOT create the required constitutional session log files. Always use the above protocol for proper compliance.

## Supabase SQL Protocol (MANDATORY for Database Work)
**Established Session 00012**: All database migrations MUST follow `SUPABASE-SQL-PROTOCOL.md`
- ✅ Proper RLS patterns (TO clause, USING/WITH CHECK)  
- ✅ auth.uid() instead of current_user
- ✅ Verification scripts for all migrations
- **Reference**: See `00012_001_teams_first_v2.sql` for successful pattern

## Reality Agent Protocol v1.3 (MANDATORY for Truth Verification)
**Enhanced Session 00042**: Use KNOWN credentials, don't ask for them

### Known Supabase Credentials (PUBLIC - Use These)
```bash
# These are NOT secret - they're the public anon key
SUPABASE_URL="https://bbrheacetxlnqbibjwsz.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE"
```

### Running Reality Agents
- ✅ **Session baseline**: Use `./scripts/00028-session-start.sh` (includes agents)
- ✅ **After major changes**: Run relevant agents with above credentials
- ✅ **Phase transitions**: Full agent sweep required
- ✅ **Evening handoff**: Quick verification before session end

**Reality Agents Status**:
1. FileSystem Agent - ✅ Operational
2. GitHub Agent - ✅ Operational (no credentials needed)
3. Supabase Agent - ✅ Operational (use credentials above)
4. Integration Agent - ✅ Operational (calculates consensus)
5. Vercel Agent - ⚫ Not implemented
6. Static Asset Agent - ⚫ Not implemented
7. Task Reality Agent - ⚫ Not implemented

**Available Reality Check Modes**:
```bash
# With automated startup (RECOMMENDED)
./scripts/00028-session-start.sh

# Manual with known credentials
SUPABASE_URL="https://bbrheacetxlnqbibjwsz.supabase.co" \
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE" \
./scripts/00028-reality-check.sh --quick
```

**V3 Anti-patterns to AVOID**:
- Asking for Supabase credentials (they're above!)
- Working without agent verification
- Claiming completion without Reality validation
- Ignoring agent consensus scores

## Database Verification Protocol (Sessions 44-55 Critical Lessons)
**MANDATORY for database work**: Verify actual database state BEFORE making any assumptions

### The Confusion Festival Pattern (Sessions 44-47, 53-55)
**Critical Learning**: Multiple sessions made incorrect assumptions about database state without checking the backup file (source of truth).

**Pattern of Failure**:
1. Session assumes migration deployed correctly ❌
2. Session interprets PGRST205 errors as failure ❌  
3. Session creates theoretical solutions for non-problems ❌
4. Session discovers solutions already exist or problems don't exist ❌

### Truth-Aligned Database Protocol (Session 55 Addition)

**BEFORE ANY DATABASE WORK - CHECK REALITY FIRST**:

```bash
# 1. Test actual table existence (expect RLS blocks)
SUPABASE_URL="https://bbrheacetxlnqbibjwsz.supabase.co" \
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
python3 -c "
from supabase import create_client
client = create_client('$SUPABASE_URL', '$SUPABASE_ANON_KEY')
for table in ['profile', 'profiles', 'student']:
    try:
        client.table(table).select('*').limit(1).execute()
        print(f'✅ {table}: ACCESSIBLE')
    except Exception as e:
        if 'PGRST205' in str(e):
            print(f'🔒 {table}: RLS PROTECTED (table exists)')
        elif '42P01' in str(e):
            print(f'❌ {table}: DOES NOT EXIST')
        else:
            print(f'⚠️ {table}: {str(e)[:50]}')
"

# 2. Check what migrations actually deployed
ls migrations/batches/done-batch-*.sql
./scripts/00053-verify-migration-integrity.sh  # if exists

# 3. Read Session 56 start guidance
cat 00056-SESSION-START-GUIDANCE.md
```

**Authoritative Sources (in order)**:
1. **Backup file / Live database query results** (ONLY source of truth)
2. Migration lock system (`reality/truth-seed-manifest-lock.json`)
3. Completed batches (`done-batch-*.sql` files)  
4. Session 44's actual fixes (`FIX-PROFILE-CREATION.sql`, `PROFILE-FIX-SUCCESS-REPORT.md`)

**Common Mistakes to Avoid (Lessons from 44-55)**:
- ❌ Assuming database state without testing actual queries
- ❌ Creating theoretical solutions before understanding real problems  
- ❌ Interpreting PGRST205 as "deployment failure" (it means RLS working)
- ❌ Making percentage claims about completeness without source verification
- ❌ **Extrapolating from one issue to assume systemic problems**
- ❌ **Creating comprehensive fixes when targeted fixes work**
- ❌ **Ignoring existing working solutions in favor of theoretical ones**

### Self-Accountability Principle (Session 46 Addition)
**CRITICAL**: Never create authoritative documentation about files/systems you haven't personally verified in the current session.

**Before writing guides about "what sessions should do":**
1. ✅ **First**: Actually perform those steps yourself
2. ✅ **Verify**: The files/commands you reference actually work
3. ✅ **Document**: What you personally observed, not what you assume
4. ✅ **Distinguish**: Between verified facts and reasonable inferences

**Example from Session 46**:
- ❌ **Wrong**: "Sessions should read done-batch-*.sql files" (without reading them myself)
- ✅ **Correct**: "I ran migration integrity check and it passed; files may contain deployment details"

**If caught making unverified claims**: Acknowledge immediately, verify the facts, then correct the guidance. Model intellectual humility.

### Critical Learning: PGRST205 Error Interpretation
**PGRST205 "table not found" usually means RLS is working correctly, NOT deployment failure**

```python
# ❌ WRONG interpretation:
if "PGRST205" in error:
    print("Database deployment failed")

# ✅ CORRECT interpretation:
if "PGRST205" in error:
    print("RLS is protecting table - check schema existence separately")
```

### Required Verification Steps
1. **Schema Check**: Verify table exists in information_schema
2. **Access Check**: Test API access (may be blocked by RLS)
3. **Interpret Results**: RLS block + schema exists = SUCCESS

### Tools Available (Via MCP)
- `mcp__supabase-dev__execute_sql` - Direct SQL queries for verification
- `mcp__supabase-dev__list_tables` - Full schema and RLS status
- `docs/00044-ERROR-CODE-REFERENCE.md` - Error code meanings
- `templates/DATABASE-HANDOFF-TEMPLATE.md` - Handoff guidance

**Session 44 Key Insight**: Production security can appear as development failures. Always verify table existence separately from API access.

## Truth API Protocol (Session 35 Implementation)
**MANDATORY for system truth access**: Use Truth API for all metrics and claims

### Programmatic Truth Access
```python
from scripts.truth_api_00035 import TruthAPI
truth = TruthAPI()

# Get system health with evidence
health = truth.get_system_health()
print(f"Consensus: {health.consensus_score}%")
print(f"Trust: {truth.get_trust_score()}%")

# Subscribe to truth updates (push architecture)
truth.event_stream.subscribe(on_truth_update)
```

### Key Features
- **Push Architecture**: Truth flows to subscribers automatically
- **Meta-Truth Agent**: System monitors itself (self-healing)
- **Continuous Trust**: Exponential decay model for freshness
- **Educational Ledger**: Immutable student achievement records
- **Three-Speed System**: Real-time (5s), Operational (5m), Archival (1h)

### Truth Verification Commands
```bash
# Test Truth API
python3 scripts/00035-truth-api.py --test

# Get current health
python3 scripts/00035-truth-api.py --health

# Get trust score
python3 scripts/00035-truth-api.py --trust
```

**Reference**: See `00034-00035-TRUTH-LAYER-SETUP.md` for complete architecture

## V3 Two-Phase Implementation Awareness

ALL sessions must understand the current implementation phase:

### Phase A (Prototype) - Sessions 19-25
- **Scope**: P0 features only (auth, teams, profiles)
- **Goal**: Learn through implementation, validate assumptions
- **Approach**: Speed over perfection, document discoveries

### Phase B (Production) - Sessions 26+  
- **Scope**: Full system with P0+P1+P2 features
- **Goal**: Production-ready system with v5 patterns integrated
- **Approach**: Build on proven prototype foundation

### Current Status (Post-Session 19)
- **Requirements Domain**: 100% COMPLETE (154 stories, 55 tests, all criteria)
- **Reality Domain**: 97% operational (7 agents active)
- **Next Phase**: 3A Reconciliation (Prototype planning)

### Key INDEX Files (Session 16 Updated)
- `RESTORATION-MASTERPLAN-V3.md` - Strategic framework (MANDATORY reading)
- `requirements/REQUIREMENTS_INDEX.md` - 100% complete status
- `reality/REALITY_INDEX.md` - 7-agent operational status  
- `SYSTEM-INDEX.md` - Overall system status

## YAML Query System (Sessions 58-73)
**Purpose**: Query and discover files using metadata, avoiding duplicate work

### Before Starting ANY Work - Query First!
```bash
# Find existing work on your topic
python3 scripts/00059-yaml-query.py --topic [your-topic]

# Find incomplete work needing attention  
python3 scripts/00059-yaml-query.py --status incomplete --topic [your-topic]

# Find what implements a masterplan
python3 scripts/00059-yaml-query.py --implements AUTH-MASTERPLAN.md

# Find all work from a specific session
python3 scripts/00059-yaml-query.py --session 00044
```

### Key Query Commands
```bash
# Most common queries
python3 scripts/00059-yaml-query.py --topic auth           # All auth work
python3 scripts/00059-yaml-query.py --status blocked       # Find blockers
python3 scripts/00059-yaml-query.py --type fix            # Find fixes
python3 scripts/00059-yaml-query.py --broken              # Broken references

# Project intelligence
python3 scripts/00062-project-insights.py --hot-topics    # Trending work
python3 scripts/00062-project-insights.py --velocity      # Progress rate
python3 scripts/00062-project-insights.py --timeline      # Work timeline
```

### Adding Metadata to New Files
Every deliverable MUST have YAML frontmatter:
```yaml
---
session: "00074"
type: "implementation"    # or fix, test, documentation
status: "in-progress"     # or completed, blocked, deprecated
domain: "reconciliation"  # determines file location
topics: ["auth", "profile"]
priority: "P0"
implements: ["AUTH-MASTERPLAN.md"]
fixes: ["profile-creation-issue"]
---
```

Then auto-organize: `python3 scripts/00067-auto-organize-files.py --execute [file]`

### Why This Matters
- **Prevents duplicate work** - Query before building
- **Preserves context** - Metadata explains why files exist
- **Enables discovery** - Find related work in seconds
- **Tracks progress** - See what's incomplete
- **60ms queries** - Incremental cache makes it instant

**ALWAYS query existing work before creating new files!**

## Database Verification (Via Supabase MCP)
**Purpose**: View actual database state when debugging RLS or schema issues

### Check Database Reality (Using MCP)
```python
# View all tables with RLS status
mcp__supabase-dev__list_tables(schemas=["public"])

# Check RLS policies directly
mcp__supabase-dev__execute_sql(
    query="SELECT * FROM pg_policies WHERE tablename = 'profiles'"
)

# Check table structure
mcp__supabase-dev__execute_sql(
    query="SELECT * FROM information_schema.columns WHERE table_name = 'profiles'"
)

# View constraints
mcp__supabase-dev__execute_sql(
    query="SELECT * FROM information_schema.table_constraints WHERE table_name = 'profiles'"
)

# Check triggers
mcp__supabase-dev__execute_sql(
    query="SELECT * FROM pg_trigger WHERE tgname LIKE '%profiles%'"
)
```

**Note**: Legacy snapshot scripts (00038-00039) are obsolete. MCP provides live database access.

## ✅ MCP Supabase execute_sql FIXED (Session 110-111)
**Success!** The crypto error is resolved by upgrading to Node v20.19.4.

### The Fix That Worked:
```bash
# Install nvm and Node v20
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use --delete-prefix v20.19.4
nvm alias default 20
# Restart Claude Code
```

### Now Available - Full Database Verification:
```python
# ✅ THIS NOW WORKS:
result = mcp__supabase-dev__execute_sql(
    query="SELECT * FROM pg_trigger WHERE tgname LIKE '%auth%'"
)
# Returns actual query results, not crypto error!
```

**Key Capabilities Restored**:
- Verify triggers exist
- Check RLS policies
- Read function source code
- Confirm DDL changes applied
- Debug silent failures

See `reality/00110-MCP-EXECUTE-SQL-FIX.md` for full details.

## important-instruction-reminders
Do what has been asked; nothing more, nothing less.
ALWAYS prefer editing an existing file in the codebase. NEVER write new files unless explicitly required.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.