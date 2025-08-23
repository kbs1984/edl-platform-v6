---
session: "00031"
type: "guide"
status: "current"
created: "2025-08-23"
title: "🌾 HARVEST Phase Guide - Constitutional OS"
purpose: "Document 🌾 harvest phase guide - constitutional os"
topics: ['guide']
priority: "P1"
domain: "core"
---

# 🌾 HARVEST Phase Guide - Constitutional OS
**Validation & Documentation Phase** | **Version 1.0** | **Session 31**

## You Are Here: HARVEST Phase

Welcome to the refinement phase! HARVEST is about **extracting maximum value** from what you've built. The Constitutional OS enforces strict discipline to ensure quality.

## Phase Mindset

> "In HARVEST phase, we validate everything, document thoroughly, and extract lessons. This is where good becomes great."

## HARVEST Phase Enforcement Settings

```javascript
{
  "enforcement": "STRICT",
  "file_naming": "mandatory",       // All files must be prefixed
  "documentation": "comprehensive", // Everything documented
  "testing": "exhaustive",         // 100% coverage target
  "manual_work": "after_autonomous", // Full auto verification first
  "agent_checks": "continuous"      // Constant verification
}
```

## What You MUST Do

### ✅ Full Autonomous Verification First
Following `00031-WORKFLOW-BOUNDARIES.md` strictly:

```bash
# 1. ALWAYS run autonomous verification first
python3 scripts/00031-auth-autonomous-verification.py

# 2. Fix any autonomous issues
# 3. ONLY THEN do manual testing
# Follow 00031-MANUAL-TESTING-CHECKLIST.md exactly
```

### ✅ Exhaustive Testing
```javascript
// Test EVERYTHING in HARVEST
describe('Comprehensive Test Suite', () => {
  describe('Happy Paths', () => {
    // All success scenarios
  });
  
  describe('Error Conditions', () => {
    // All failure modes
  });
  
  describe('Edge Cases', () => {
    // Boundary conditions
  });
  
  describe('Integration', () => {
    // Component interactions
  });
});
```

### ✅ Complete Documentation
```markdown
# Every file needs:
- Purpose documentation
- API documentation  
- Usage examples
- Error handling notes
- Performance considerations
- Future improvements
```

### ✅ Refactoring & Optimization
```javascript
// HARVEST is THE time for refactoring
// Before (GROW phase - worked but messy)
function processData(d) {
  // Quick implementation
  return d.map(x => x * 2).filter(x => x > 10);
}

// After (HARVEST phase - clean and optimized)
/**
 * Processes data by doubling values and filtering
 * @param {number[]} data - Input array
 * @returns {number[]} Processed values > 10
 */
function processData(data) {
  if (!Array.isArray(data)) {
    throw new TypeError('Data must be an array');
  }
  
  return data
    .map(value => value * 2)
    .filter(value => value > 10);
}
```

### ✅ Lesson Extraction
```markdown
# 00032-lessons-learned.md

## What Worked
- Supabase integration was smooth
- Phase-based development reduced stress

## What Didn't
- Initial auth approach was too complex
- Skipped tests in GROW created debt

## Improvements for Next Cycle
- Start with simpler auth
- Write test skeletons in GROW
```

## What You MUST NOT Do

### ❌ Manual Testing Before Autonomous
- NEVER skip autonomous verification
- NEVER test in browser before running scripts
- NEVER claim "it works" without verification

### ❌ Leaving Debt
- NO uncommitted code
- NO missing prefixes
- NO outdated INDEX files
- NO undocumented decisions

### ❌ Rushing Through
- HARVEST is not about speed
- Quality over velocity
- Completeness over features

## HARVEST Phase Tools

### Mandatory Tool Sequence
```bash
# 1. Full autonomous verification
python3 scripts/00031-auth-autonomous-verification.py

# 2. Documentation check
./scripts/00031-doc-maintenance-check.sh

# 3. Full reality sweep
./scripts/00029-tos-orchestrator.sh

# 4. Dashboard review
./scripts/00032-tos-dashboard.sh --phase HARVEST

# 5. ONLY THEN: Manual testing
# Follow 00031-MANUAL-TESTING-CHECKLIST.md
```

### Session 31 Boundaries in HARVEST
From `00031-WORKFLOW-BOUNDARIES.md`:
- **Autonomous**: EVERYTHING possible must be verified
- **Manual**: ONLY after full autonomous pass
- **Documentation**: Complete and comprehensive

### Violation Handling in HARVEST
```
Violation: Missing file prefix
HARVEST Response: "❌ BLOCKING: File must be prefixed. Auto-fixing now..."
(Automatic fix, no choice)

Violation: Missing tests
HARVEST Response: "❌ BLOCKING: Tests required. Generating test skeleton..."
(Creates test file, you must implement)

Violation: Outdated INDEX
HARVEST Response: "❌ BLOCKING: Updating INDEX files now..."
(Auto-updates with session changes)
```

## HARVEST Phase Dashboard View

```
╔══════════════════════════════════════════════════════════════╗
║                    🌾 HARVEST PHASE ACTIVE                    ║
╚══════════════════════════════════════════════════════════════╝

Constitutional Health: 96% (Target: 95%)  ✅ READY
Enforcement Level: STRICT
Phase Progress: █████████░ 90%

🔒 Strict Enforcement Active:
- All files must be prefixed
- All tests must pass
- All documentation current
- All INDEX files updated

❌ BLOCKING ISSUES (Must Fix):
- 1 file missing prefix [AUTO-FIXING...]
- 2 components lack tests [Skeletons created]

✅ Validation Status:
- Autonomous: 100% complete
- Manual: Ready to begin
- Documentation: 95% complete
- Lesson Extraction: In progress

📋 Remaining Tasks:
1. Complete test implementation (2)
2. Run manual testing checklist
3. Extract lessons learned
4. Prepare for next SEED
```

## HARVEST Workflows

### The "Validation Pyramid"
```
        Manual Testing
           (Last)
      ═══════════════
    Integration Testing
        ═══════════
    Autonomous Testing
      ═══════════
   Documentation Review
     ═══════════
   Reality Agent Sweep
      (First)
```

### The "Debt Payment Sprint"
```bash
# Monday: List all debt
find . -name "*.js" | grep -v "00032-" > debt.txt

# Tuesday-Thursday: Systematic fixing
while read file; do
  ./scripts/00032-auto-fix.sh "$file"
done < debt.txt

# Friday: Verification
./scripts/00029-tos-orchestrator.sh --strict
```

### The "Documentation Blitz"
```markdown
# For each component:
1. Purpose (why it exists)
2. Interface (how to use it)
3. Implementation (how it works)
4. Testing (how to verify)
5. Future (what's next)
```

## HARVEST Checklists

### Code Quality Checklist
- [ ] All files prefixed with session number
- [ ] No console.log statements in production code
- [ ] Error handling comprehensive
- [ ] Performance optimized
- [ ] Security reviewed

### Testing Checklist
- [ ] Unit tests >90% coverage
- [ ] Integration tests complete
- [ ] Edge cases covered
- [ ] Error paths tested
- [ ] Performance benchmarked

### Documentation Checklist
- [ ] README updated
- [ ] API documented
- [ ] Architecture decisions recorded
- [ ] Lessons learned extracted
- [ ] INDEX files current

### Manual Testing Checklist
Use `00031-MANUAL-TESTING-CHECKLIST.md`:
- [ ] Browser testing complete
- [ ] Cross-browser verified
- [ ] Mobile responsive
- [ ] Accessibility checked
- [ ] User flows validated

## Transition: HARVEST → Next SEED

### Completion Ceremony
```bash
# Run the completion ceremony
./scripts/00032-harvest-ceremony.sh

# This will:
# 1. Archive current implementation
# 2. Extract metrics and lessons
# 3. Generate next SEED template
# 4. Celebrate achievements!
# 5. Reset to SEED phase
```

### What to Extract
```markdown
# 00032-harvest-extraction.md

## Metrics
- Features delivered: 12
- Test coverage: 94%
- Documentation: Complete
- Technical debt: Paid

## Patterns Discovered
- Authentication pattern works well
- Need better state management
- Testing in GROW saves HARVEST time

## Next SEED Questions
- Should we refactor to microservices?
- Do we need a mobile app?
- Is performance optimization needed?
```

## Common HARVEST Questions

**Q: Can I add new features in HARVEST?**
A: No. Note them for next SEED phase.

**Q: How long should HARVEST take?**
A: 20-30% of total cycle time.

**Q: What if manual testing finds issues?**
A: Fix them, but question why autonomous testing missed them.

**Q: Should I refactor everything?**
A: Only what improves quality or performance significantly.

**Q: When is HARVEST complete?**
A: When you can confidently deploy to production.

## HARVEST Success Metrics

You're succeeding in HARVEST if:
- ✅ All tests passing
- ✅ Documentation complete
- ✅ No technical debt
- ✅ Lessons extracted
- ✅ Ready for production

## Anti-Patterns to Avoid

### ❌ "Feature Creep"
Adding new features in HARVEST. Save for next SEED.

### ❌ "Perfection Paralysis"
Endless refactoring. Good enough is good enough.

### ❌ "Documentation Novel"
Over-documenting. Focus on what matters.

### ❌ "Test Obsession"
Testing impossible scenarios. Be practical.

### ❌ "Manual First"
Testing manually before autonomous. Follow the protocol!

## Exit Criteria

You know you're done with HARVEST when:
> "I would confidently deploy this to production, the documentation would help a new developer, and I've learned what to do differently next time."

Ready for next SEED? The cycle continues with new wisdom!

---

**Remember**: HARVEST phase is about **extracting value**, not just checking boxes. The Constitutional OS ensures nothing important is missed while maintaining focus on what matters.