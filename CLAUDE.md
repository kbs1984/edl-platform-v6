# Claude Code Session Protocol v2.0
## Constitutional Restoration Framework

**Strategic Framework**: RESTORATION-MASTERPLAN-V3.md (Two-Phase Implementation)
**Required Reading**: All sessions must review V3 masterplan before any work

## Session Logging Requirements (Constitutional)

### First Action Protocol v3.1 (Session 28 Automation Update)
**EVERY SESSION MUST START WITH:**
```bash
# Automated session startup (6 seconds, was 35 minutes manual)
./scripts/00028-session-start.sh [session-number] "[focus]"

# Examples:
./scripts/00028-session-start.sh              # Auto-detect next session
./scripts/00028-session-start.sh 00031        # Specific session number
./scripts/00028-session-start.sh 00031 "Building features"  # With focus
./scripts/00028-session-start.sh --help       # Show usage
```

This automation will:
1. Run all Reality Agents (8 seconds)
2. Parse outputs and generate reports
3. Load context from previous session
4. Check for handoffs
5. Create constitutional session log
6. Display system health summary

**Manual fallback if automation fails**:
- Run `./scripts/00028-reality-check.sh` for Reality Agents
- Create log with `./scripts/00028-create-session-log.sh`
- See `scripts/00028-AUTOMATION-README.md` for details

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
- Verify constitutional compliance (retroactive disclosure if needed)
- Run final validation: `./scripts/session-guard.sh`

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

## Reality Agent Protocol v1.2 (MANDATORY for Truth Verification)
**Enhanced Session 00016**: 7-Agent system fully operational for constitutional restoration
- ✅ **Session baseline**: Reality check BEFORE any work begins
- ✅ **After major changes**: Run relevant agents immediately  
- ✅ **Phase transitions**: Full agent sweep required
- ✅ **Evening handoff**: Quick verification before session end

**All 7 Reality Agents Available**:
1. FileSystem Agent - File discovery and tracking
2. GitHub Agent - Repository and commit verification
3. Supabase Agent - Database truth verification
4. Integration Agent - Meta-coordination and consensus
5. Vercel Agent - Deployment monitoring
6. Static Asset Agent - Asset tracking
7. Task Reality Agent - Dependency tracking

**Available Reality Check Modes**:
- `--emergency` (10 seconds) - Critical issues only
- `--quick` (30 seconds) - Essential verification
- `--full` (3-5 minutes) - Comprehensive all-agent sweep

**V3 Anti-patterns to AVOID**:
- Working without agent verification
- Claiming completion without Reality validation
- Proceeding to next phase without baseline
- Ignoring agent consensus scores

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

## important-instruction-reminders
Do what has been asked; nothing more, nothing less.
ALWAYS prefer editing an existing file in the codebase. NEVER write new files unless explicitly required.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.