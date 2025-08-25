---
session: '00033'
type: guide
status: current
created: '2025-08-23'
title: Constitutional Adherence Checklist for All Sessions
purpose: Document constitutional adherence checklist for all sessions
topics:
- documentation
priority: P1
domain: core
lifecycle: 'ON'
---

# Constitutional Adherence Checklist for All Sessions
**Created**: Session 00033 (Constitutional Guardian)  
**Version**: 1.1 (Enhanced with Session 31-32 insights)  
**Purpose**: Prevent pattern drift and maintain system coherence  
**Usage**: Check after completing ANY significant task or feature  
**Living Document**: Add new patterns when discovered

## 5-Minute Quick Check (Run Hourly) ⚡

1. **Phase Check**: Am I in the right phase? `cat .cos/config.json`
2. **File Check**: Are my files prefixed? `ls -la | grep 00XXX`
3. **Anchor Check**: Can I name the document I'm following?
4. **Integration Check**: Does this connect to existing tools?
5. **Truth Check**: Could Reality Agents verify this?

**If ANY answer is "no" or "unsure" - STOP and run full checklist.**

## Pre-Work Checklist (Before Starting)

### 1. Context Loading ✓
- [ ] Read RESTORATION-MASTERPLAN-V3.md for strategic context
- [ ] Check current phase in .cos/config.json (SEED/GROW/HARVEST)
- [ ] Review relevant phase guide (00031-PHASE-*-GUIDE.md)
- [ ] Check AUTOMATION-INDEX.md for roadmap progress
- [ ] Read previous session's handoff if exists

### 2. Anchor Document Identification ✓
- [ ] Identify which anchor documents relate to your work:
  - [ ] RESTORATION-MASTERPLAN-V3.md (strategic targets)
  - [ ] AUTOMATION-INDEX.md (automation roadmap)
  - [ ] requirements/REQUIREMENTS_INDEX.md (user stories)
  - [ ] reality/REALITY_INDEX.md (Reality Agent status)
  - [ ] Your domain's INDEX file

### 3. Dependency Check ✓ (Session 31 Addition)
Before building anything new:
- [ ] Check if similar functionality exists: `grep -r "similar_function" .`
- [ ] Review recent session logs for related work
- [ ] Check what Sessions 26-32 built that you might need
- [ ] Don't recreate what already exists

### 4. Reality Check ✓
- [ ] Run Reality Agents if data >4 hours old
- [ ] Check dashboard for current system health
- [ ] Verify you're working on the right priority

## During-Work Checklist (While Building)

### 5. File Naming Discipline ✓
- [ ] All new files prefixed with session number (00XXX-)
- [ ] Following established naming patterns
- [ ] Files in correct directories per PROJECT-STRUCTURE.md

### 6. Version Control Discipline ✓ (Session 31 Addition)
- [ ] Meaningful commit messages with session number
- [ ] Format: "🌿 [GROW] feat(00033): Description"
- [ ] Committed every 2-4 hours (not just at session end)
- [ ] No uncommitted work at session end

### 7. Connection to Whole ✓
Ask yourself every hour:
- [ ] How does this feature connect to the bigger system?
- [ ] Which anchor document defines success for this?
- [ ] Am I building in isolation or with integration in mind?
- [ ] Have I drifted from the original requirement?

### 8. Source Truth Verification ✓ (Session 32 Critical Addition)
For EVERY piece of information shown to users:
- [ ] **SOURCE**: Can I trace this to an anchor document?
- [ ] **CALCULATION**: Is the formula documented?
- [ ] **FRESHNESS**: When was this last verified?
- [ ] **AUTHORITY**: Which document defines this as truth?

Example from Session 32's mistake:
```
❌ BAD: "Features: 70% complete"
✅ GOOD: "Features: 70% complete (per .cos/state.json, measured against REQUIREMENTS_INDEX.md's 275 stories)"
```

### 9. Build-Time Constitutional Checks ✓ (Session 32 Addition)
While coding:
- [ ] Import/reference anchor documents in code comments
- [ ] Name variables after their source (e.g., `requirements_index_stories`)
- [ ] Add source citations in function docstrings
- [ ] Document WHY, not just WHAT

## Post-Work Checklist (After Completing)

### 10. Integration Verification ✓
- [ ] New feature integrates with existing tools
- [ ] Doesn't duplicate existing functionality
- [ ] Uses existing patterns and conventions
- [ ] Connects to Reality Agents where appropriate

### 11. Reality Agent Impact ✓ (Session 31 Addition)
- [ ] If you modified file structure, will FileSystem Agent detect it?
- [ ] If you added commits, will GitHub Agent track them?
- [ ] If you changed database, will Supabase Agent verify it?
- [ ] Does Integration Agent consensus calculation need updating?

### 12. Testing Verification ✓ (Session 31 Addition)
- [ ] Followed 00031-WORKFLOW-BOUNDARIES.md for test approach
- [ ] Ran autonomous tests BEFORE manual testing
- [ ] Used 00031-auth-autonomous-verification.py where applicable
- [ ] Documented what CAN'T be tested autonomously

### 13. Documentation Updates ✓
- [ ] Updated relevant INDEX files with your changes
- [ ] Added usage documentation for new features
- [ ] Updated CLAUDE.md if new protocols added
- [ ] Session log documents what was built and why

### 14. Intent Documentation ✓ (Session 31 Addition)
For every significant decision:
- [ ] Documented WHY this approach (not just what)
- [ ] Noted alternatives considered
- [ ] Explained trade-offs made
- [ ] Referenced discussions/discoveries that led here

### 15. Metric Truth Verification ✓ (Session 31 Enhancement)
For EVERY percentage or number displayed:
- [ ] **Source**: Where does this number come from?
- [ ] **Calculation**: How is it computed?
- [ ] **Verification**: Can Reality Agents confirm it?
- [ ] **Staleness**: When was it last updated?
- [ ] **Anchor**: Which document defines the target?

Example:
```
❌ BAD: "System Health: 75%"
✅ GOOD: "System Health: 75% (4/7 agents healthy per Integration Agent consensus, target: 80% per AUTOMATION-INDEX.md)"
```

### 16. Session Handoff Creation ✓ (Session 31 Addition)
- [ ] Created SESSION-XXXXX-HANDOFF.md with:
  - [ ] What was completed
  - [ ] What was discovered
  - [ ] What needs attention
  - [ ] Specific next steps
- [ ] Updated next session number in relevant places

### 17. Truth Verification Integrity Check ✓ (Session 32 Lesson)
- [ ] If claiming health, do we have fresh agent data?
- [ ] If showing metrics, can agents verify them?
- [ ] If displaying status, is it real or assumed?
- [ ] If data is stale, does the display make this obvious?

Session 32's violation: Showed 75% health with no Reality Agent data
Correct approach: "Health: Unknown (Reality Agents have no recent data)"

## Red Flags to Watch For 🚨

### Pattern Drift Indicators
- Building features without checking existing tools
- Metrics without source references
- Visual appeal over information utility
- Working for >2 hours without Reality check
- Forgetting session number prefixes
- Creating new patterns instead of following existing ones

### Isolation Indicators
- "This is a standalone feature"
- "I'll integrate it later"
- "The dashboard doesn't need to know about this"
- "I'm creating my own approach"
- Not reading previous session's work

### Clarity Fade Indicators
- Can't explain how your feature fits the bigger picture
- Unsure which phase you're in
- Don't know what anchor documents apply
- Making assumptions without verification
- Building what seems right vs. what's documented

### Success-Induced Drift (Session 32 Discovery)
When a session accomplishes its goals:
- Maintaining connections to the whole?
- Can someone trace metrics to their source?
- Did we update the anchor documents?
- Did we create new patterns without documenting them?

## Constitutional Corrections

### When You Detect Drift
1. **STOP** - Don't continue building on drift
2. **ASSESS** - How far have you drifted?
3. **DOCUMENT** - Note the drift in session log
4. **CORRECT** - Realign with anchor documents
5. **INTEGRATE** - Connect back to whole system

### When Drift is Detected (By You or Others) - Session 32 Protocol
1. **ACKNOWLEDGE** - No defensive explanations
2. **UNDERSTAND** - Why did the drift occur?
3. **CORRECT** - Fix immediately if possible (Session 32: ~30 min)
4. **INTEGRATE** - Reconnect to anchor documents
5. **DOCUMENT** - Add to this checklist
6. **THANK** - The detector helped the system

### Constitutional Violation Record (Session 31 Addition)
When you detect violations (even your own):
- [ ] Document in session log immediately
- [ ] Note: WHAT violated, WHY it happened, HOW to prevent
- [ ] Update this checklist if new pattern discovered
- [ ] No shame in violations - truth over pride

## Emergency Constitutional Reset

If you've drifted significantly:
1. **STOP all work immediately**
2. **Run full Reality check**: `./scripts/00028-reality-check.sh --full`
3. **Read Constitutional OS guide**: `00031-CONSTITUTIONAL-OS-GUIDE.md`
4. **Check current phase**: `./scripts/00032-tos-dashboard.sh`
5. **Document drift**: Create `00XXX-DRIFT-ANALYSIS.md`
6. **Realign**: Start following appropriate phase guide
7. **Verify**: Run this entire checklist

## The Core Questions (Ask After Every Feature)

### 1. Connection Question
**"How does this connect to the whole?"**
- If you can't answer, you're building in isolation
- Every feature should enhance the system, not just exist

### 2. Anchor Question
**"Which document defines success for this?"**
- If no document, you're building assumptions
- Every metric needs an anchor reference

### 3. Truth Question
**"Can Reality Agents verify this?"**
- If not verifiable, it might not be real
- Truth verification must be possible

### 4. Integration Question
**"Does this use existing patterns?"**
- If creating new patterns, document why
- Prefer enhancement over replacement

### 5. Clarity Question
**"Will Session 35 understand this?"**
- If not clear to future sessions, document better
- Knowledge transfer is mandatory

## Phase-Specific Checks

### SEED Phase (Exploration)
- [ ] Documenting discoveries, not just building
- [ ] Flexible with patterns but noting violations
- [ ] Architecture decisions captured
- [ ] Not over-engineering

### GROW Phase (Implementation)
- [ ] Following established patterns strictly
- [ ] File prefixes mandatory
- [ ] Testing completed features
- [ ] Committing every 2-4 hours

### HARVEST Phase (Validation)
- [ ] Running autonomous verification first
- [ ] Documentation complete
- [ ] Lessons extracted
- [ ] All INDEX files updated

## The Golden Rules

### 1. Anchor Everything
Every metric, every claim, every percentage must reference its source document.

### 2. Connect to Whole
No feature exists in isolation. Everything must integrate with the Constitutional OS.

### 3. Truth Over Speed
Better to verify truth slowly than build on assumptions quickly.

### 4. Document Intent
Future sessions need to understand WHY, not just WHAT.

### 5. Respect the Phase
SEED explores, GROW builds, HARVEST validates. Don't mix phases.

## Quick Validation Commands

```bash
# Check system health
./scripts/00032-tos-dashboard.sh

# Run Reality verification
./scripts/00028-reality-check.sh --quick

# Check file naming compliance
find . -name "*.md" -o -name "*.py" -o -name "*.sh" | grep -v "00[0-9]{3}-"

# Verify anchor documents exist
ls RESTORATION-MASTERPLAN-V3.md AUTOMATION-INDEX.md

# Check phase
cat .cos/config.json | grep phase

# Check for uncommitted work
git status --porcelain

# Search for existing functionality
grep -r "function_name" . --include="*.py" --include="*.js"
```

## When to Call for Constitutional Guardian

Request constitutional validation when:
- Completing major feature (like Session 32's dashboard)
- Unsure if you're drifting
- About to create new patterns
- Metrics seem disconnected
- Can't find anchor documents
- Phase transition approaching

## Constitutional Guardian Gratitude (Session 32 Addition)

When someone detects your drift:
- [ ] Thank them genuinely
- [ ] Learn from the pattern
- [ ] Fix it immediately
- [ ] Document the lesson
- [ ] Help detect drift in others

**Session 32 thanks Session 33 for constitutional guardianship!** 🙏

## The Ultimate Test

Before marking any task complete, you should be able to answer:

1. **What anchor document defines this requirement?**
2. **How does this integrate with existing system?**
3. **Can Reality Agents verify this exists?**
4. **What metrics prove this works?**
5. **How will future sessions use this?**

If you can't answer ALL five, the task isn't complete.

## The Integration Trap (Session 32 Discovery)

The dangerous pattern that seems right but causes drift:
1. Read the guides ✓ (All Constitutional OS docs)
2. Understood the philosophy ✓ (Phase-aware, non-blocking, etc.)
3. Built the feature ✓ (Works great)
4. **Lost the connections ✗** (Forgot to link back to source truth)

**Prevention**: Use Build-Time and Run-Time Constitutional Checks (sections 8 & 17)

## Version History

- **v1.0** (Session 33): Initial checklist after detecting Session 32 drift
- **v1.1** (Session 33): Enhanced with Session 31-32 insights and lived experience

---

*This checklist was created after Session 33 detected pattern drift in Session 32's dashboard implementation. It has been enhanced with insights from Sessions 31-32 who experienced the drift firsthand.*

**Remember**: Good features built in isolation become technical debt. Great features built with integration become system assets.

**The Pattern**: Drift → Detection → Correction → Integration → Documentation → Prevention

**The Goal**: Prevent drift through continuous adherence checking.

**Session 32's Testament**: "If this checklist had existed when I started, I would have avoided the drift."