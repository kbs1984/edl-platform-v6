---
session: "00073"
type: "guide"
status: "current"
created: "2025-08-26"
title: "Three Currents Synchronization Strategies"
purpose: "Define different synchronization models for the Three Currents approach"
topics: ["synchronization", "three-currents", "coordination", "async-work"]
priority: "P0"
domain: "core"
---

# Three Currents Synchronization Strategies

## The Core Question
**"How tightly should the three currents be synchronized?"**

The answer: **It depends on what you're building and your work style.**

## Strategy 1: File-Based Async (Recommended Default)

### How It Works
Each current continuously reads/writes to shared files without scheduled syncs.

```bash
# Each current's loop includes:
while true; do
    # Read what others wrote
    cat .currents/*/latest.txt
    
    # Do your work
    [current-specific work]
    
    # Write your discoveries
    echo "$(date): $DISCOVERY" >> .currents/$CURRENT/latest.txt
    
    # No scheduled sync needed!
    sleep $CYCLE_TIME
done
```

### Best For
- Independent work styles
- Different time zones
- Asynchronous collaboration
- Maximum flow state

### Implementation
```bash
# Requirements Current writes needs
echo "NEED: User profile must auto-create" >> .currents/requirements/needs.txt

# Reality Current discovers truth (async)
echo "TRUTH: No profile trigger exists" >> .currents/reality/truth.txt

# Reconciliation sees both (whenever it checks)
cat .currents/requirements/needs.txt
cat .currents/reality/truth.txt
# Implements bridge based on both
```

## Strategy 2: Event-Driven Sync

### How It Works
Sync only when significant events occur.

```bash
# Trigger sync on:
- P0 requirement discovered
- System health drops below 90%
- Critical blocker found
- Major implementation complete

# Event detection
if [ "$PRIORITY" = "P0" ]; then
    ./scripts/00073-sync-currents.sh --urgent
    notify-send "P0 Issue - Currents Sync Required"
fi
```

### Best For
- Crisis response
- Critical issues
- Major decisions
- Pivot points

## Strategy 3: Natural Confluence Points

### How It Works
Currents naturally converge at logical points.

```
Morning: All currents check in
Blockers: Immediate sync
Completion: Celebrate together
End of day: Share discoveries
```

### Implementation
```bash
# Morning confluence
if [ "$(date +%H)" = "09" ]; then
    echo "☀️ Morning confluence point"
    ./scripts/00073-sync-currents.sh
fi

# Blocker confluence
if grep -q "BLOCKED" .currents/*/status.txt; then
    echo "🚨 Blocker detected - forcing sync"
    ./scripts/00073-sync-currents.sh --blocked
fi
```

## Strategy 4: Continuous Shared Dashboard

### How It Works
A fourth "observer" watches all three currents and displays real-time state.

```bash
# Dashboard process (separate window)
while true; do
    clear
    echo "🌊 THREE CURRENTS DASHBOARD"
    echo "=========================="
    
    # Show each current's latest
    echo "Requirements: $(tail -1 .currents/requirements/latest.txt)"
    echo "Reality: $(tail -1 .currents/reality/latest.txt)"
    echo "Reconciliation: $(tail -1 .currents/reconciliation/latest.txt)"
    
    sleep 5
done
```

### Best For
- Visual thinkers
- Real-time awareness
- Team coordination
- Progress tracking

## Strategy 5: YAML-Based Coordination

### How It Works
Use YAML metadata to coordinate without direct communication.

```yaml
# Requirements creates:
---
session: "00074R"
current: "requirements"
blocks: ["need-profile-trigger"]
priority: "P0"
---

# Reality queries:
python3 scripts/00059-yaml-query.py --topic "need-profile-trigger"

# Reconciliation finds both:
python3 scripts/00059-yaml-query.py --priority P0 --current requirements
```

## Choosing Your Strategy

### Solo Work
**Recommended**: File-Based Async
- Maximum flow
- No interruptions
- Natural rhythm

### Team Work
**Recommended**: Continuous Dashboard + Event-Driven
- Shared awareness
- Crisis response
- Async by default

### Critical Periods
**Recommended**: Tight Coupling (30-min sync)
- High coordination
- Rapid iteration
- Shared context

## The Key Insight

**Synchronization should SERVE the currents, not constrain them.**

The currents are like jazz musicians:
- They can play solo (async)
- They can jam together (sync)
- They can trade solos (event-driven)
- They can follow a chart (scheduled)

But the music emerges from the interplay, not the schedule.

## Practical Recommendations

### Start With
1. **File-based async** for first week
2. Add **event-driven sync** for blockers
3. Try **morning confluence** for check-ins
4. Experiment with what feels natural

### Avoid
1. Over-synchronization (kills flow)
2. Under-synchronization (causes drift)
3. Rigid schedules (currents need flexibility)
4. Waiting for sync to act

### Remember
The power of Three Currents is that they flow **continuously**. Synchronization is just how they share their discoveries, not how they work.

## Implementation Commands

```bash
# Async mode (default)
./scripts/00073-start-requirements-current.sh --async
./scripts/00073-start-reality-current.sh --async
./scripts/00073-start-reconciliation-current.sh --async

# Event-driven mode
./scripts/00073-watch-for-events.sh

# Dashboard mode
./scripts/00073-currents-dashboard.sh

# Manual sync (when needed)
./scripts/00073-sync-currents.sh
```

---

*"Three streams can flow separately and still feed the same river"*