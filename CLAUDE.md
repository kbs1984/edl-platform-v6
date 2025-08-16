# Claude Code Session Protocol v2.0

## Session Logging Requirements (Constitutional)

### First Action Protocol v3.0 (Claude Custom Commands)
**EVERY SESSION MUST START WITH:**
```
/project:session-start [session-number]
```

This command will:
1. Run reality baseline check
2. Verify system readiness (>80% consensus required)
3. Check for session log
4. Alert to uncommitted work

**If check fails**: Run `/project:reality-check` for detailed diagnosis

**Quick Commands Available**:
- `/project:reality-status` - Show current truth
- `/project:reality-check` - Run all agents  
- `/project:commit-work` - Intelligent git commit
- `/project:update-reality` - Update status file
- `/project:session:handoff` - Generate handoff

**THEN CONTINUE WITH:**
1. Check if session log exists: `ls archive/sessions/SESSION-00XXX-LOG.md`
3. If missing, create immediately: `./scripts/create-session-log.sh 00XXX "Session Focus"`
4. Check system structure: `./scripts/structure-check.sh`
5. Document system state in log (Reality Agents, Health, Domains)
6. Validate protocol compliance: `./scripts/session-guard.sh`

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

## Available Tools (Protocol v2.0)
- `scripts/create-session-log.sh` - v2.0 Template with System State section
- `scripts/session-guard.sh` - Validates v2.0 compliance (System State required)
- `scripts/structure-check.sh` - Quick system structure overview (NEW!)

## System State Documentation (NEW in v2.0)
Every session log MUST include a "System State at Session Start" section with:
- Reality Agents operational status (4 agents)
- Overall System Health percentage
- Domains completion status
- Key metrics (test coverage, debt, etc.)
- Reference to PROJECT-STRUCTURE.md

This prevents sessions from wasting time "rediscovering" existing components.

## MCP Session Tools Limitation
⚠️ **IMPORTANT**: The MCP session management tools track metadata but DO NOT create the required constitutional session log files. Always use the above protocol for proper compliance.

## Supabase SQL Protocol (MANDATORY for Database Work)
**Established Session 00012**: All database migrations MUST follow `SUPABASE-SQL-PROTOCOL.md`
- ✅ Proper RLS patterns (TO clause, USING/WITH CHECK)  
- ✅ auth.uid() instead of current_user
- ✅ Verification scripts for all migrations
- **Reference**: See `00012_001_teams_first_v2.sql` for successful pattern

## Reality Agent Protocol v1.1 (MANDATORY for Truth Verification)
**Enhanced Session 00013**: Systematic agent usage is now ENFORCED
- ✅ **Morning baseline**: `./scripts/00013_reality-check.sh` (CANNOT SKIP)
- ✅ **After database changes**: Run Supabase Agent immediately
- ✅ **Before deployment**: `./scripts/00013_deploy-with-verification.sh`
- ✅ **Conflict resolution**: `./scripts/00013_resolve-conflicts.sh`
- ✅ **Evening handoff**: `./scripts/00013_reality-check.sh --quick`

**Available Reality Check Modes**:
- `--emergency` (10 seconds) - Bare minimum when critical
- `--quick` (30 seconds) - Default, essential agents only
- `--full` (3-5 minutes) - Comprehensive, all 7 agents

**Anti-patterns to AVOID**:
- Using agents only when problems occur
- Skipping morning baseline "to save time"
- Deploying without verification
- Ignoring agent conflicts