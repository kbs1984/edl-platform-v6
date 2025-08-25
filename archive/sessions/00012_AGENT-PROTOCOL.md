---
created: '2025-08-23'
domain: core
priority: P1
purpose: Document reality agent protocol
session: '00012'
status: current
title: Reality Agent Protocol
topics:
- database
- protocol
type: specification
---

# Reality Agent Protocol
## Session 00012 Established - Systematic Agent Usage Framework
*Based on Strategic Communications 001-A/B/C*

---

## 🎯 Core Principle: Truth Through Systematic Verification

**The Tragedy We're Preventing**: Building powerful Reality Agents then using them sporadically or reactively. This protocol ensures systematic, triggered usage at every critical point.

---

## 📋 Mandatory Agent Checkpoints

### 1. Session Start Protocol
```bash
# EVERY session MUST begin with reality baseline
./scripts/reality-check.sh  # Runs all agents in sequence
```

### 2. After Database Changes
```bash
# After ANY migration or schema change
python3 reality/agent-reality-auditor/supabase-connector/connector.py --level 2
# Verify tables exist and RLS policies are active
```

### 3. After File Creation/Modification  
```bash
# After creating/modifying files
python3 reality/agent-reality-auditor/filesystem-connector/connector.py
# Verify files exist and match intent
```

### 4. Before Deployment
```bash
# Before EVERY deployment
python3 reality/agent-reality-auditor/integration-connector/connector.py
# Ensure all agents agree on system state
```

### 5. After Deployment
```bash
# After deployment completes
python3 reality/agent-reality-auditor/vercel-connector/connector.py
# Verify deployment success and performance
```

### 6. Session End Protocol
```bash
# EVERY session MUST end with handoff snapshot
python3 reality/agent-reality-auditor/task-connector/connector.py --generate-handoff
```

---

## 🔄 Agent Trigger Matrix

| Event | Primary Agent | Secondary Agent | Validation |
|-------|--------------|-----------------|------------|
| `CREATE TABLE` | Supabase | Task | Tables exist, dependencies tracked |
| `CREATE FILE` | FileSystem | Task | File exists, attribution recorded |
| `GIT COMMIT` | GitHub | Integration | Commit accurate, no retro edits |
| `DEPLOY` | Vercel | Static Asset | <60s verified, assets match |
| `CREATE TASK` | Task | Integration | Dependencies mapped, no orphans |
| `SESSION START` | Integration | All | Baseline established |
| `SESSION END` | Task | Integration | Handoff complete |

---

## 🤖 Agent Capabilities Reference

### Supabase Reality Agent
- **Can**: Verify table existence (with proper credentials)
- **Cannot**: See RLS-protected data with anon key
- **Use When**: After migrations, schema changes

### FileSystem Reality Agent  
- **Can**: Track all files, verify structure
- **Cannot**: Modify files (read-only)
- **Use When**: After file operations, structure changes

### GitHub Reality Agent
- **Can**: Verify commits, track history
- **Cannot**: Make commits (read-only)
- **Use When**: After commits, checking for retro edits

### Vercel Reality Agent
- **Can**: Check deployment status, performance
- **Cannot**: Deploy (read-only)
- **Use When**: After deployments, performance checks

### Static Asset Reality Agent
- **Can**: Verify HTML/CSS/JS files
- **Cannot**: Check dynamic content
- **Use When**: After UI changes

### Task Reality Agent
- **Can**: Track dependencies, attribution
- **Cannot**: Execute tasks
- **Use When**: Planning work, handoffs

### Integration Reality Agent
- **Can**: Orchestrate all agents, detect conflicts
- **Cannot**: Resolve conflicts automatically
- **Use When**: System health checks, major milestones

---

## 📊 Truth Consensus Algorithm

When agents disagree, trust hierarchy:
1. **GitHub** (immutable history) 
2. **FileSystem** (actual files)
3. **Supabase** (database state)
4. **Vercel** (deployment state)
5. **Static Asset** (UI state)

---

## 🚀 Automation Scripts

### reality-check.sh (Full System Check)
```bash
#!/bin/bash
echo "🔍 REALITY CHECK PROTOCOL"
echo "========================"

# Run all agents in sequence
echo "📁 FileSystem Reality..."
python3 reality/agent-reality-auditor/filesystem-connector/connector.py

echo "🗄️ Supabase Reality..."
SUPABASE_URL=$SUPABASE_URL SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY \
  python3 reality/agent-reality-auditor/supabase-connector/connector.py --level 2

echo "🐙 GitHub Reality..."
python3 reality/agent-reality-auditor/github-connector/connector.py

echo "🚀 Vercel Reality..."
python3 reality/agent-reality-auditor/vercel-connector/connector.py

echo "🔗 Integration Check..."
python3 reality/agent-reality-auditor/integration-connector/connector.py

echo "✅ Reality Check Complete"
```

### deploy-with-verification.sh
```bash
#!/bin/bash
# Never deploy without verification

echo "⚡ Lightning Deploy with Verification"

# Pre-deploy reality check
python3 reality/agent-reality-auditor/integration-connector/connector.py

# Deploy
vercel --prod

# Post-deploy verification  
sleep 5  # Allow deployment to propagate
python3 reality/agent-reality-auditor/vercel-connector/connector.py

echo "✅ Deployment verified by Reality Agents"
```

---

## 📈 Success Metrics

### Daily Minimums
- Morning reality check: 100% compliance
- Post-change verifications: >90% compliance  
- Evening handoff: 100% compliance

### Weekly Targets
- Agent consensus score: >95%
- Truth conflicts resolved: <5
- Deployment verifications: 100%

---

## 🚨 Anti-Patterns to Avoid

### ❌ DON'T
- Skip morning reality check "to save time"
- Deploy without agent verification
- Make assumptions about system state
- Ignore agent conflicts
- Use agents only when problems occur

### ✅ DO
- Run agents systematically at triggers
- Trust agent reports over assumptions
- Resolve conflicts before proceeding
- Document agent findings in session logs
- Automate agent chains

---

## 🔗 Integration with Other Protocols

### With SUPABASE-SQL-PROTOCOL.md
- After migrations: Supabase Agent validates schema
- RLS verification: Agent confirms policies active

### With Session Protocol (CLAUDE.md)
- Session start: Integration Agent baseline
- Session end: Task Agent handoff

### With Lightning Stack (SC #001)
- <60 second verification: Vercel Agent
- Zero build artifacts: FileSystem Agent
- Direct database: Supabase Agent

---

## 📝 Session Log Integration

Every session log MUST include:
```markdown
### Reality Agent Checks
- Morning baseline: ✅ [Integration Agent score]
- Database state: ✅ [Supabase Agent: X tables]
- File system: ✅ [FileSystem Agent: X files]
- Deployment: ✅ [Vercel Agent: Xs deploy time]
- Evening handoff: ✅ [Task Agent: X tasks tracked]
```

---

## 🏁 Quick Start Checklist

For immediate implementation:
- [ ] Add reality-check.sh to scripts/
- [ ] Update CLAUDE.md with agent protocol reference
- [ ] Create deploy-with-verification.sh
- [ ] Add agent checks to session template
- [ ] Test all agents work with current credentials

---

*This protocol ensures Reality Agents are used systematically, preventing the tragedy of powerful tools sitting idle while assumptions cascade into failure.*

**Established by Session 00012 after recognizing the critical need for systematic truth verification**