# 🌱 SEED Phase Guide - Constitutional OS
**Exploration & Architecture Phase** | **Version 1.0** | **Session 31**

## You Are Here: SEED Phase

Welcome to the beginning! SEED phase is about **exploration, planning, and architecture**. The Constitutional OS understands you need flexibility to explore options.

## Phase Mindset

> "In SEED phase, we plant ideas and see what might grow. Not everything needs to be perfect - we're discovering what perfect means."

## SEED Phase Enforcement Settings

```javascript
{
  "enforcement": "FLEXIBLE",
  "file_naming": "recommended",      // Gentle reminders only
  "documentation": "encouraged",     // Focus on architecture
  "testing": "optional",            // Too early for tests
  "manual_work": "encouraged",      // Explore freely
  "agent_checks": "light"           // Basic verification only
}
```

## What You SHOULD Do

### ✅ Heavy Manual Exploration
- Browse competitors
- Sketch UI concepts  
- Test third-party services
- Experiment with approaches
- Try different architectures

### ✅ Architecture Documentation
```markdown
# Focus your documentation on:
- System architecture decisions
- Technology choices with rationale  
- Data model exploration
- User journey mapping
- Risk assessment
```

### ✅ Rapid Prototyping
- Create throwaway code
- Test concepts quickly
- Don't worry about prefixes yet
- Ignore minor violations
- Focus on learning

### ✅ Ask "What If?" Questions
- What if we used GraphQL instead?
- What if this was serverless?
- What if we targeted mobile first?

## What You SHOULD NOT Do

### ❌ Premature Structure
- Don't create elaborate test suites
- Don't worry about 100% compliance
- Don't prefix experimental files
- Don't over-engineer

### ❌ Skipping Documentation
- DO document WHY you chose something
- DO capture decisions made
- DO note rejected approaches
- DO explain trade-offs

## SEED Phase Tools

### Primary Tools
```bash
# Light constitutional check
./scripts/00032-tos-dashboard.sh --phase SEED

# Document architecture decisions  
echo "Decision: Chose PostgreSQL because..." >> architecture/decisions/001-database.md

# Reality check (optional, for major decisions)
./scripts/00028-reality-check.sh --quick
```

### Session 31 Boundaries in SEED
From `00031-WORKFLOW-BOUNDARIES.md`:
- **Autonomous**: Minimal - just syntax checking
- **Manual**: Maximum - explore everything
- **Documentation**: Architecture focus

### Violation Handling in SEED
```
Violation: Missing file prefix
SEED Response: "📝 Note: Remember to prefix files when you finalize this approach"
(No enforcement, just tracking)
```

## SEED Phase Dashboard View

```
╔══════════════════════════════════════════════════════════════╗
║                    🌱 SEED PHASE ACTIVE                       ║
╚══════════════════════════════════════════════════════════════╝

Constitutional Health: 72% (Target: 70%)  ✅ HEALTHY
Enforcement Level: FLEXIBLE
Phase Progress: ████░░░░░░ 40%

📋 Recommendations:
- Continue exploring authentication options
- Document database schema decisions
- No pressing violations

⚠️ Gentle Reminders (Non-blocking):
- 3 files could use prefixes (when ready)
- Architecture doc last updated 2 days ago
```

## Transition Triggers: SEED → GROW

You're ready for GROW when:

### Automatic Indicators
- [ ] Core architecture documented (>80%)
- [ ] Technology stack decided
- [ ] Data model stabilized
- [ ] First feature identified

### Manual Checklist
- [ ] Comfortable with chosen approach
- [ ] Major risks identified
- [ ] Ready to start building
- [ ] Team aligned (if applicable)

### Transition Command
```bash
# When ready to transition
./scripts/00032-phase-transition.sh SEED GROW

# This will:
# 1. Archive exploration code
# 2. Finalize architecture docs
# 3. Set up GROW phase structure
# 4. Adjust enforcement to MODERATE
```

## SEED Phase Patterns

### The "Exploration Spike"
```bash
# OK in SEED phase:
touch test-graphql-approach.js
touch try-rest-api.js
touch websocket-experiment.js

# System response: "Exploring options? Take your time."
```

### The "Decision Document"
```markdown
# architecture/decisions/002-state-management.md
## Options Considered
1. Redux - Too complex for our needs
2. Context API - Perfect for our scale
3. MobX - Unfamiliar to team

## Decision: Context API
## Rationale: Simple, built-in, sufficient
```

### The "Pivot Freedom"
In SEED, you can completely change direction:
- Monday: "Let's use React"
- Wednesday: "Actually, Vue is better"
- Friday: "Wait, maybe vanilla JS?"
- **COS Response**: "Still exploring? That's fine."

## Common SEED Questions

**Q: Should I write tests in SEED?**
A: Only if they help you explore. Don't write tests for test coverage.

**Q: Should I use file prefixes?**
A: Only for files you're keeping. Experiments don't need prefixes.

**Q: How much documentation?**
A: Document decisions and reasoning. Skip implementation details.

**Q: Can I ignore Reality Agents?**
A: Run them for major decisions, skip for exploration.

## SEED Success Metrics

You're succeeding in SEED if:
- ✅ Exploring multiple approaches
- ✅ Documenting key decisions
- ✅ Not feeling constrained
- ✅ Learning rapidly
- ✅ Building clarity

## Anti-Patterns to Avoid

### ❌ "Analysis Paralysis"
Exploring forever without deciding. Set a time box.

### ❌ "Premature Implementation"  
Jumping to GROW before architecture is clear.

### ❌ "Documentation Debt"
Exploring without capturing decisions.

### ❌ "Solo Exploration"
Not sharing findings with team/future sessions.

## Exit Criteria

You know you're done with SEED when:
> "I know what I'm building, how I'm building it, and why I chose this approach."

Ready to GROW? Read `00031-PHASE-GROW-GUIDE.md`

---

**Remember**: SEED phase is about **smart exploration**, not random wandering. The Constitutional OS gives you freedom with gentle guidance.