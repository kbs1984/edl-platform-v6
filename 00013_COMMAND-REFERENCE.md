# Claude Custom Commands Reference
**Created**: Session 00013  
**Purpose**: Systematic truth verification through Claude commands

---

## 🚀 Quick Start

**Every session MUST start with:**
```
/project:session-start 00014
```

This enforces the protocol automatically.

---

## 📋 Core Commands

### Session Management
- `/project:session-start [number]` - Initialize session with reality check
- `/project:session:handoff [number]` - Generate handoff for next session
- `/project:verify-protocol` - Check protocol compliance

### Reality Verification  
- `/project:reality-status` - Show current system truth
- `/project:reality-check` - Run comprehensive agent verification
- `/project:update-reality` - Update reality status file

### Work Management
- `/project:commit-work` - Intelligent commit with attribution
- `/project:agent:run-all` - Execute all Reality Agents

---

## 🎯 Command Workflows

### Starting a Session (Mandatory)
```
1. /project:session-start 00014
   ↓ (If fails)
2. /project:reality-check
   ↓ (Fix issues)
3. /project:session-start 00014
   ↓ (Must succeed to continue)
```

### During Development
```
After database changes:
  /project:agent:run-all
  
After creating files:
  /project:commit-work
  
If confused about state:
  /project:reality-status
```

### Ending a Session
```
1. /project:update-reality
2. /project:commit-work  
3. /project:session:handoff 00014
```

---

## 🔧 How Commands Work

Commands are Markdown files in `.claude/commands/` that:
1. Execute bash commands via `!` prefix
2. Include file contents via `@` prefix  
3. Accept arguments via `$ARGUMENTS`
4. Have full access to Claude's tools

### Example Command Structure
```markdown
---
allowed-tools: Bash(git status:*), Write
description: What this command does
---

# Command Title

## Dynamic Content
!`bash command here`

## Task
What Claude should do with the information

$ARGUMENTS
```

---

## 🚨 Protocol Enforcement

The commands enforce protocol by:
1. **Mandatory checks** - Can't skip reality baseline
2. **Automatic verification** - Agents run systematically
3. **Clear failure states** - Can't proceed if broken
4. **Audit trails** - Everything logged

### Anti-Patterns Prevented
- ❌ Starting work without reality check
- ❌ Assuming previous session's state
- ❌ Committing without attribution
- ❌ Ending without handoff

---

## 📊 Success Metrics

A properly functioning session will:
- Start with consensus >80%
- Commit work at least hourly
- Update reality status regularly
- Generate clear handoff

---

## 🔍 Troubleshooting

### "Command not found"
- Ensure you're in project root
- Commands only work in Claude Code CLI
- Check `.claude/commands/` exists

### "Reality check fails"
- Run `/project:verify-protocol` for diagnosis
- Check credentials with `./scripts/00013_verify-credentials.sh`
- Fix issues before proceeding

### "Can't commit"
- Check git status first
- Ensure no merge conflicts
- Use `/project:commit-work` for intelligent grouping

---

## 💡 Key Innovation

These commands make protocol compliance **automatic and unavoidable**:
- Can't forget to run reality check (session-start does it)
- Can't ignore failures (blocks continuation)
- Can't skip handoff (generates systematically)
- Can't lose truth (continuously tracked)

**The protocol runs itself through commands!**