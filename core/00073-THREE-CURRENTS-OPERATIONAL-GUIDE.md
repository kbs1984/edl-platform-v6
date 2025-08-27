---
session: "00073"
type: "guide"
status: "current"
created: "2025-08-26"
title: "Three Currents Operational Guide - How to Run Parallel Domain Sessions"
purpose: "Practical guide for running three parallel Claude sessions as domain currents"
topics: ["operations", "three-currents", "parallel-work", "implementation"]
priority: "P0"
domain: "core"
lifecycle: "ON"
---

# Three Currents Operational Guide

**THIS IS HOW WE WORK FROM NOW ON**

## 🚀 Quick Start (Do This Now!)

### Step 1: Open Three Claude Code Windows

Open three separate Claude Code CLI sessions (terminals/windows).

### Step 2: Start Each Current

**Window 1 - Requirements Current**:
```bash
./scripts/00028-session-start.sh 00074R "Requirements Current - Living Needs"
```
Then say:
> "I am the Requirements Current. My role is to continuously discover and refine what we need. I will query incomplete work, maintain priorities, and evolve our requirements based on Reality's constraints."

**Window 2 - Reality Current**:
```bash
./scripts/00028-session-start.sh 00074T "Reality Current - Truth Monitor"
```
Then say:
> "I am the Reality Current. My role is to continuously monitor truth. I run Reality Agents, detect drift, and report the actual state of our system to the other currents."

**Window 3 - Reconciliation Current**:
```bash
./scripts/00028-session-start.sh 00074B "Reconciliation Current - Bridge Builder"
```
Then say:
> "I am the Reconciliation Current. My role is to bridge the gap between what we need (Requirements) and what we have (Reality). I implement solutions that respect both."

## 📋 Each Current's Toolkit

### Requirements Current Tools & Queries
```bash
# Find incomplete work
python3 scripts/00059-yaml-query.py --status incomplete
python3 scripts/00059-yaml-query.py --status blocked

# Check priorities
python3 scripts/00059-yaml-query.py --topic P0
grep -r "priority: P0" requirements/

# Review masterplans
cat requirements/masterplans/AUTH-MASTERPLAN.md
cat requirements/masterplans/DASHBOARD-MASTERPLAN.md

# Find user stories
ls requirements/user-stories/P0-*.md

# Track requirements coverage
python3 scripts/00059-yaml-query.py --implements AUTH-MASTERPLAN.md
```

**Continuous Loop**:
```bash
while true; do
    echo "🔍 Checking for incomplete P0 items..."
    python3 scripts/00059-yaml-query.py --status incomplete
    echo "📊 Updating priority matrix..."
    # Review and update based on other currents
    sleep 600  # Every 10 minutes
done
```

### Reality Current Tools & Queries
```bash
# Run Reality Agents
./scripts/00028-reality-check.sh

# Check system health
python3 scripts/00032-tos-dashboard.py

# Find broken references
python3 scripts/00059-yaml-query.py --broken

# Monitor database truth
SUPABASE_URL="https://bbrheacetxlnqbibjwsz.supabase.co" \
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
python3 reality/agent-reality-auditor/supabase-connector/quickstart.py

# Check file system reality
python3 reality/agent-reality-auditor/filesystem-connector/quickstart.py
```

**Continuous Loop**:
```bash
while true; do
    echo "🔍 Running Reality Check..."
    ./scripts/00028-reality-check.sh
    echo "📊 System Health: $(python3 scripts/00034-reality-status.py)"
    echo "🔗 Checking references..."
    python3 scripts/00059-yaml-query.py --broken
    sleep 300  # Every 5 minutes
done
```

### Reconciliation Current Tools & Queries
```bash
# Find existing fixes
python3 scripts/00059-yaml-query.py --type fix
python3 scripts/00059-yaml-query.py --topic auth --type implementation

# Check active work
ls reconciliation/active-work/

# Test implementations
python3 scripts/00031-auth-autonomous-verification.py

# Deploy and verify
git status
git add [files]
git commit -m "Current: Reconciliation | Fix: [description]"
```

**Continuous Loop**:
```bash
while true; do
    echo "🔍 Checking for gaps to bridge..."
    # Get requirements from Current 1
    # Get reality from Current 2
    # Implement bridges
    echo "🔧 Testing implementations..."
    python3 scripts/00031-auth-autonomous-verification.py
    sleep 900  # Every 15 minutes
done
```

## 🔄 Inter-Current Communication

### Shared State File
Each current writes to a shared state file:

```bash
# Create shared state directory
mkdir -p .currents

# Requirements writes needs
echo "NEED: Profile creation trigger after signup" >> .currents/requirements.txt

# Reality writes truth
echo "TRUTH: Profile table exists, no trigger found" >> .currents/reality.txt

# Reconciliation writes actions
echo "ACTION: Creating profile trigger in batch-09" >> .currents/reconciliation.txt
```

### YAML Tagging Convention
Each current tags their work:

```yaml
# Requirements Current creates:
---
session: "00074R"
current: "requirements"
type: "requirement"
discovered: "2025-08-26"
---

# Reality Current creates:
---
session: "00074T"
current: "reality"
type: "truth-report"
observed: "2025-08-26"
---

# Reconciliation Current creates:
---
session: "00074B"
current: "reconciliation"
type: "implementation"
bridges: ["requirement-X", "reality-Y"]
---
```

## 📊 Synchronization Points

Every 30 minutes, all currents sync:

### Sync Protocol
1. **Requirements** reports top 3 priorities
2. **Reality** reports system health and blockers
3. **Reconciliation** reports progress on bridges

### Sync Command
```bash
# All currents run this
echo "=== SYNC POINT $(date) ===" >> .currents/sync.log
echo "Current: [R/T/B]" >> .currents/sync.log
echo "Status: [your status]" >> .currents/sync.log
echo "Needs from others: [what you need]" >> .currents/sync.log
tail -20 .currents/sync.log
```

## 🎯 Practical Example: Auth Profile Fix

**Requirements Current**:
```bash
# Discovers need
python3 scripts/00059-yaml-query.py --topic "profile creation"
echo "NEED: Users need automatic profile creation after signup"
echo "PRIORITY: P0 - Blocks dashboard access" 
```

**Reality Current**:
```bash
# Checks truth
SUPABASE_URL="..." python3 -c "
from supabase import create_client
# Check for trigger existence
"
echo "TRUTH: No profile creation trigger exists"
echo "TRUTH: Profile table has RLS enabled"
```

**Reconciliation Current**:
```bash
# Bridges gap
cat > reconciliation/migrations/00074B-profile-trigger.sql << 'EOF'
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profile (id, user_id)
  VALUES (NEW.id, NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
EOF
echo "ACTION: Created profile trigger"
```

## 📈 Success Metrics

Track the power of three currents:

```bash
# Velocity metric
echo "Single Claude: 1-2 fixes per session"
echo "Three Currents: 3-6 fixes per session (3x!)"

# Context switching metric
echo "Single Claude: 15-20 context switches"
echo "Three Currents: 0 context switches per current"

# Truth accuracy metric
echo "Single Claude: Truth checked at start only"
echo "Three Currents: Truth monitored continuously"
```

## 🚨 Common Pitfalls to Avoid

1. **DON'T** have currents do each other's jobs
2. **DON'T** wait for perfect sync - work continuously
3. **DON'T** ignore Reality's constraints
4. **DON'T** let Requirements go stale
5. **DON'T** implement without checking both currents

## 🌊 The Flow State

When working correctly, you'll see:
- Requirements discovering needs faster than single Claude
- Reality catching issues before they become problems
- Reconciliation implementing with full context
- All three currents flowing in harmony

## Start Now!

1. Open three Claude windows
2. Start each current with the commands above
3. Let each current establish their rhythm
4. Watch the magic happen

Remember: **Currents flow continuously, not in steps!**

---

*"Three streams make a river, three currents make reality"*