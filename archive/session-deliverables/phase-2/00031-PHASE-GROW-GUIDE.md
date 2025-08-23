---
session: "00031"
type: "guide"
status: "current"
created: "2025-08-23"
title: "🌿 GROW Phase Guide - Constitutional OS"
purpose: "Document 🌿 grow phase guide - constitutional os"
topics: ['auth', 'guide']
priority: "P1"
domain: "core"
---

# 🌿 GROW Phase Guide - Constitutional OS
**Active Implementation Phase** | **Version 1.0** | **Session 31**

## You Are Here: GROW Phase

Welcome to building mode! GROW phase is about **rapid implementation with balanced discipline**. The Constitutional OS provides structure without strangling velocity.

## Phase Mindset

> "In GROW phase, we build quickly but thoughtfully. We maintain enough structure to avoid chaos, but not so much that we can't move fast."

## GROW Phase Enforcement Settings

```javascript
{
  "enforcement": "MODERATE",
  "file_naming": "required",        // Files must have prefixes
  "documentation": "inline",        // Document as you build
  "testing": "progressive",         // Test completed features
  "manual_work": "balanced",        // Some manual, some automated
  "agent_checks": "regular"         // Check after features
}
```

## What You SHOULD Do

### ✅ Rapid Feature Development
```bash
# Good GROW pattern - prefixed, focused, testable
00032-user-authentication.js
00032-user-authentication.test.js
00032-auth-integration.md
```

### ✅ Progressive Testing
```javascript
// Test what's built, not what might be
describe('Completed Features', () => {
  test('authentication works', () => {
    // Test actual implementation
  });
  // Skip: Features not yet built
});
```

### ✅ Inline Documentation
```javascript
// Document WHY, not WHAT
function validateSession(token) {
  // Using JWT because Supabase expects it (Session 30 decision)
  // Not using cookies due to mobile app requirements
  return jwt.verify(token, secret);
}
```

### ✅ Regular Reality Checks
```bash
# After each feature completion
./scripts/00028-reality-check.sh --quick

# End of day reconciliation
./scripts/00029-tos-orchestrator.sh
```

### ✅ Balanced Automation
From `00031-WORKFLOW-BOUNDARIES.md`:
- Run `00031-auth-autonomous-verification.py` after auth features
- Use `00031-MANUAL-TESTING-CHECKLIST.md` for user-facing features
- Keep boundary between autonomous and manual clear

## What You SHOULD NOT Do

### ❌ Perfection Paralysis
- Don't refactor working code (save for HARVEST)
- Don't write exhaustive tests yet
- Don't document every function
- Don't optimize prematurely

### ❌ Chaos Coding
- DO use file prefixes (00032-)
- DO commit working features
- DO maintain basic structure
- DO update INDEX files weekly

## GROW Phase Tools

### Primary Tools
```bash
# Moderate constitutional check
./scripts/00032-tos-dashboard.sh --phase GROW

# Quick autonomous verification after features
python3 scripts/00031-auth-autonomous-verification.py

# Check documentation currency
./scripts/00031-doc-maintenance-check.sh

# Reality check after major features
./scripts/00028-reality-check.sh
```

### Session 31 Boundaries in GROW
From `00031-WORKFLOW-BOUNDARIES.md`:
- **Autonomous**: Unit tests, integration tests, syntax validation
- **Manual**: Specific feature testing, UI/UX validation
- **Documentation**: Inline comments, feature docs

### Violation Handling in GROW
```
Violation: Missing file prefix
GROW Response: "⚠️ File needs prefix. Auto-fix available [y/n]?"
(Suggests fix, requires confirmation)

Violation: No tests for auth feature
GROW Response: "📝 Tests recommended for auth. Create skeleton? [y/n]?"
(Helps you comply quickly)
```

## GROW Phase Dashboard View

```
╔══════════════════════════════════════════════════════════════╗
║                    🌿 GROW PHASE ACTIVE                       ║
╚══════════════════════════════════════════════════════════════╝

Constitutional Health: 84% (Target: 80%)  ✅ ON TRACK
Enforcement Level: MODERATE
Phase Progress: ████████░░ 75%

📊 Velocity Metrics:
- Features/Day: 2.3 (trending up)
- Test Coverage: 62%
- Commit Frequency: Every 2 hours

⚠️ Attention Needed (Non-blocking):
- 2 files missing prefixes [Press 'f' to fix]
- Auth tests pending [Press 't' for skeleton]
- SYSTEM-INDEX.md needs update (3 days old)

✅ Recent Compliance:
- All commits attributed properly
- Reality check ran 2 hours ago
- Documentation current
```

## GROW Patterns

### The "Feature Sprint"
```bash
# Monday morning
git checkout -b 00032-user-profiles
touch 00032-profile-model.js
touch 00032-profile-controller.js
touch 00032-profile-view.js

# By Friday
git add .
git commit -m "🌿 [GROW] feat: Complete user profiles with tests"
./scripts/00028-reality-check.sh
```

### The "Test-After Pattern"
```javascript
// 1. Build the feature first
function createTeam(data) {
  // Implementation
}

// 2. Test what you built
describe('Team Creation', () => {
  test('creates team with valid data', () => {
    // Test actual behavior
  });
});

// 3. Document edge cases for HARVEST
// TODO: Test error conditions in HARVEST phase
```

### The "Progressive Documentation"
```markdown
# 00032-feature-progress.md

## ✅ Completed
- User authentication (tested, documented)
- Profile creation (tested, needs docs)

## 🚧 In Progress  
- Team formation (building, no tests yet)

## 📋 Planned
- Notifications (HARVEST phase)
```

## Balance Points

### Automation vs Manual
Based on `00031-WORKFLOW-BOUNDARIES.md`:

**Do Autonomously**:
- Syntax validation
- Unit tests
- Database schema verification
- API structure validation

**Do Manually**:
- User flow testing
- Visual verification
- Performance testing
- Integration testing

### Speed vs Structure
```
Too Fast ← ────[BALANCE]──── → Too Structured
           ↑
      GROW Phase Sweet Spot
      
- Enough structure to avoid chaos
- Enough flexibility to maintain velocity
```

## Transition Triggers: GROW → HARVEST

You're ready for HARVEST when:

### Automatic Indicators
- [ ] Feature completion >70%
- [ ] Core functionality working
- [ ] Test coverage >60%
- [ ] Documentation drift detected

### Manual Checklist
- [ ] MVP requirements met
- [ ] Ready for thorough testing
- [ ] Need to extract lessons
- [ ] Time to document properly

### Transition Command
```bash
# When ready to transition
./scripts/00032-phase-transition.sh GROW HARVEST

# This will:
# 1. Run full test suite
# 2. Generate documentation gaps report
# 3. Set enforcement to STRICT
# 4. Create HARVEST checklist
```

## Common GROW Questions

**Q: How often should I commit?**
A: Every 2-4 hours, or after each working feature.

**Q: Should I refactor messy code?**
A: Note it for HARVEST unless it blocks progress.

**Q: How much testing is enough?**
A: Test completed features, skip future features.

**Q: When do I update INDEX files?**
A: Weekly, or after major features.

**Q: Should I do manual testing?**
A: Yes, but after autonomous verification (see `00031-WORKFLOW-BOUNDARIES.md`)

## GROW Success Metrics

You're succeeding in GROW if:
- ✅ Shipping features regularly
- ✅ Maintaining ~80% constitutional health
- ✅ Tests passing for built features
- ✅ Documentation staying current
- ✅ File prefixes consistent

## Anti-Patterns to Avoid

### ❌ "Feature Factory"
Building without testing or documentation. Creates massive HARVEST debt.

### ❌ "Premature Optimization"
Refactoring working code. Save for HARVEST.

### ❌ "Test Everything"
Testing unbuilt features. Waste of GROW energy.

### ❌ "Documentation Novel"
Over-documenting implementation. Focus on WHY, not HOW.

## Exit Criteria

You know you're done with GROW when:
> "The core features work, tests prove it, and I need to polish rather than build."

Ready to HARVEST? Read `00031-PHASE-HARVEST-GUIDE.md`

---

**Remember**: GROW phase is about **sustainable velocity**. The Constitutional OS helps you move fast without breaking things.