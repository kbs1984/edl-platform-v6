# Session 00018 Requirements Handoff

**From**: Session 00017  
**Date**: 2025-08-17  
**Purpose**: Continue Requirements Domain population per RESTORATION-MASTERPLAN  
**Phase**: 2 - Requirements Extraction (Sessions 18-19 assigned)

---

## 🎯 Mission for Session 18

You are tasked with continuing the Requirements Domain population as part of the constitutional restoration. Session 17 has created the foundation - now you need to complete the extraction and documentation.

---

## 📊 Current State

### Requirements Domain Status: ~15% Complete

**✅ What Session 17 Completed:**
```
requirements/
├── REQUIREMENTS_INDEX.md          ✅ Created & initialized
├── canvas-requirements/            ✅ 14 JSON files moved here (7,023 nodes)
├── user-stories/                   ✅ 48 P0 stories extracted
│   ├── P0-AUTHENTICATION-STORIES.md  (15 stories)
│   ├── P0-TEAM-STORIES.md           (12 stories)
│   └── P0-DASHBOARD-PROFILE-STORIES.md (21 stories)
├── priority-matrix/                ✅ Framework defined
│   └── PRIORITY-FRAMEWORK.md
├── v5-extraction/                  ✅ Directory ready
│   └── README.md                   (awaiting v5 codebase)
├── acceptance-tests/               ✅ Created, empty
├── success-criteria/               ✅ Created, empty
├── validation-tests/               ✅ Created, empty
└── constraints/                    ✅ Created, empty
```

### Canvas Files Ready for Processing
All 14 files in `requirements/canvas-requirements/canvas-analysis/`:
1. **P0 Priority** (Session 17 partially processed):
   - ✅ `001-1. num.label.Onboarding&Directory.json` (Auth - DONE)
   - ✅ `002-1. seed.PlayerID Profile Box.json` (Dashboard - DONE)
   - ✅ `002-2. needlabel.Associated Teams Box.json` (Teams - DONE)

2. **P1 Priority** (Need processing):
   - `001-4. needlabel.Activity & Registrar Box.json` (Activities)
   - `001-5. seed.Activity Instance.json` (Activity details)
   - `002-3. seed.Badges Box.json` (Achievements)
   - `002-4. seed.HoG Box.json` (Hall of Game)

3. **P2 Priority** (Need processing):
   - `001-2. label.Communication, messages and Invitations.json`
   - `001-3. seed.Contact Us Box.json`
   - `002-5. seed.Resources Box.json`
   - `003-2 seed.emCoin Transactions Box.json`

---

## 📋 Specific Tasks for Session 18

### Task 1: Complete User Story Extraction (P1 & P2)

**P1 Stories to Extract:**
```markdown
From 001-4 (Activity & Registrar):
- Activity creation by supervisors
- Activity registration by players
- Activity submission workflow
- Activity evaluation by enablers

From 001-5 (Activity Instance):
- Activity instance lifecycle
- Team vs individual activities
- Activity scheduling
- Results tracking

From 002-3 (Badges):
- Badge requirements
- Badge earning criteria
- Badge display
- Badge verification

From 002-4 (HoG):
- Hall of Game nominations
- Selection criteria
- Ceremony management
```

**Format**: Use same structure as Session 17:
```markdown
### US-XXX: [Story Name]
**As a** [Role]
**I want to** [Feature]
**So that** [Benefit]

**Acceptance Criteria:**
- [Specific requirement]
- [Measurable outcome]
```

### Task 2: Define Success Criteria

For EACH of the 48 existing P0 stories, create success criteria documents:

**Location**: `requirements/success-criteria/P0-SUCCESS-CRITERIA.md`

**Format**:
```markdown
## US-001: Player Registration
**Success Criteria:**
1. User can complete registration in <2 minutes
2. Email verification sent within 30 seconds
3. Profile creation prompted immediately after
4. No duplicate emails allowed
5. Password meets security requirements

**Measurement Method:**
- Automated testing for timing
- Email service logs for verification
- Database unique constraint for duplicates
```

### Task 3: Create Acceptance Tests

**Location**: `requirements/acceptance-tests/P0-ACCEPTANCE-TESTS.md`

**Format**:
```markdown
## AT-001: Player Registration Flow
**User Story**: US-001
**Test Type**: Manual/Automated

**Test Steps:**
1. Navigate to registration page
2. Enter valid email
3. Enter password meeting requirements
4. Submit form
5. Check email for verification
6. Click verification link
7. Verify redirect to profile creation

**Expected Results:**
- Form validates in real-time
- Success message displayed
- Email received within 30 seconds
- Profile creation page loads
```

### Task 4: Document Constraints

**Location**: `requirements/constraints/TECHNICAL-CONSTRAINTS.md`

Extract from sessions and document:
- Supabase RLS requirements (from Session 12)
- Child safety requirements (100% coverage)
- Performance requirements (<2 second loads)
- Security requirements (hashed passwords, secure tokens)
- Browser compatibility requirements

### Task 5: Begin v5 Extraction (If Time Permits)

**First**: Locate v5 codebase (check with user or search for references)

**If Found**, document in `requirements/v5-extraction/`:
- Working patterns to keep
- Failed patterns to avoid
- Reusable components
- The `profiles` vs `profile` lesson
- State management approaches

---

## 🔧 Tools & Resources

### Available Scripts
- Canvas files are already in JSON format (Session 11's work)
- Use `grep -i "keyword"` to search Canvas JSONs for specific features
- Reality Agents available for verification

### Reference Documents
- `/RESTORATION-MASTERPLAN.md` - Overall strategy
- `/docs/DATABASE-DESIGN-FROM-CANVAS.md` - Schema reference
- `/docs/EDL-FOUNDATION-PART-*.md` - Vision documents
- Session logs 01-17 for context

### Key Commands
```bash
# Search Canvas for specific content
grep -i "activity" requirements/canvas-requirements/canvas-analysis/*.json

# Check your progress
ls -la requirements/*/

# Run reality check
cd reality/agent-reality-auditor/integration-connector
python3 quickstart.py
```

---

## ⚠️ Important Notes

1. **Two-Seed Strategy**: Remember we need BOTH:
   - Starter Seed (Canvas - what you're processing)
   - Full Seed (v5 extraction - if you can locate it)

2. **Priority Focus**: P0 stories are most important. Ensure they have complete success criteria and acceptance tests before moving to P1.

3. **Coordination**: Session 19 will continue where you leave off. Document clearly what's complete vs pending.

4. **Quality Over Quantity**: Better to have 10 complete user stories with criteria and tests than 50 incomplete ones.

---

## 📈 Success Metrics for Session 18

You'll be successful if you:
- ✅ Extract 20+ additional user stories (P1 priority)
- ✅ Define success criteria for all 48 P0 stories
- ✅ Create acceptance tests for at least 15 P0 stories
- ✅ Document key technical constraints
- ✅ Update REQUIREMENTS_INDEX.md with progress

---

## 🤝 Handoff Protocol

At session end, update:
1. `REQUIREMENTS_INDEX.md` with completion percentages
2. Create `SESSION-00018-LOG.md` with work completed
3. Note any blockers or discoveries
4. Prepare handoff for Session 19

---

## 💡 Quick Start

```bash
# 1. Start with P1 story extraction
cat requirements/canvas-requirements/canvas-analysis/001-4.\ needlabel.Activity\ \&\ Registrar\ Box.json | grep -i "text"

# 2. Create your working files
touch requirements/user-stories/P1-ACTIVITY-STORIES.md
touch requirements/success-criteria/P0-SUCCESS-CRITERIA.md
touch requirements/acceptance-tests/P0-ACCEPTANCE-TESTS.md

# 3. Begin systematic extraction
```

---

**Remember**: You're building the foundation for all future implementation. Every requirement you document saves hours of confusion later.

**The path forward is clear: Extract, Define, Test, Verify.**

Good luck Session 18! 🚀

---

*Session 17 - Requirements Foundation Established*  
*Constitutional Restoration in Progress*