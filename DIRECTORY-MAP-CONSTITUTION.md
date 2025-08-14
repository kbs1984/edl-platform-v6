# Directory Map Constitution
## The Sacred Source of Truth for System Architecture

### Preamble
This Directory Map serves as the immutable backbone of our Personal Operating System. It defines the organizational principles, governance rules, and structural integrity of our three-domain architecture.

### Article I: The Three Domains and Leadership Hierarchy

#### 1.1 Reality Domain [LEADERSHIP DOMAIN]
**Purpose**: Documents what exists, what works, and what constraints we face
**Governor**: Reality Domain Manager (Chief Truth Officer)
**Principle**: "Truth over comfort"
**Authority**: Ultimate veto power over all requirements and reconciliation plans based on objective reality

#### 1.2 Requirements Domain [ADVISORY DOMAIN]
**Purpose**: Captures what we need, want, and aspire to achieve
**Governor**: Requirements Domain Manager
**Principle**: "Intention precedes implementation"
**Subordinate to**: Reality Domain (all requirements must pass reality review)

#### 1.3 Reconciliation Domain [EXECUTION DOMAIN]
**Purpose**: Bridges the gap between Requirements and Reality through actionable plans
**Governor**: Reconciliation Domain Manager  
**Principle**: "Progress through pragmatism"
**Subordinate to**: Both Reality (for feasibility) and Requirements (for direction)

### Article II: Governance Rules

#### 2.1 Directory Modification Protocol
1. **No Unilateral Changes**: No directory may be added, removed, or renamed without domain manager approval
2. **Change Request Process**:
   - Submit proposal with justification
   - Impact assessment on all three domains
   - 24-hour consideration period
   - Documented decision with rationale

#### 2.2 Domain Manager Responsibilities
- Maintain domain integrity
- Review and approve structural changes
- Ensure cross-domain compatibility
- Document all decisions in domain log

### Article III: Structural Principles

#### 3.1 Hierarchy Rules
- Maximum depth: 4 levels (root/domain/category/specific)
- Each directory must have a clear owner
- Each directory must have a PURPOSE.md file
- No orphan directories (must belong to a domain)

#### 3.2 Naming Conventions
- All directories: lowercase with hyphens (e.g., `domain-name`)
- Index files: UPPERCASE with underscores (e.g., `DOMAIN_INDEX.md`)
- Agent directories: prefixed with `agent-` 
- Archive directories: suffixed with `-archive`

### Article IV: The Sacred Map

```
/edl-platform-v6/
│
├── DIRECTORY-MAP-CONSTITUTION.md (this file)
├── SYSTEM-INDEX.md                (master navigation)
├── SESSION-LOG.md                  (Brian's session #00001)
│
├── requirements/
│   ├── PURPOSE.md
│   ├── REQUIREMENTS_INDEX.md
│   ├── goals/
│   ├── specifications/
│   ├── constraints/
│   └── agent-requirements-manager/
│
├── reality/
│   ├── PURPOSE.md
│   ├── REALITY_INDEX.md
│   ├── inventory/
│   ├── capabilities/
│   ├── limitations/
│   ├── project-registry/
│   └── agent-reality-auditor/
│
├── reconciliation/
│   ├── PURPOSE.md
│   ├── RECONCILIATION_INDEX.md
│   ├── gap-analysis/
│   ├── action-plans/
│   ├── progress-tracking/
│   └── agent-reconciliation-orchestrator/
│
├── shared/
│   ├── PURPOSE.md
│   ├── templates/
│   ├── tools/
│   └── protocols/
│
└── archive/
    ├── PURPOSE.md
    └── sessions/
```

### Article V: Amendment Process

This constitution may only be amended through:
1. Unanimous agreement of all three domain managers
2. Documentation of the need for change
3. Trial period of proposed change (7 days)
4. Formal ratification with version increment

### Article VI: Enforcement

#### 6.1 Violations
- Unauthorized directory changes will be reverted
- Violations logged in `CONSTITUTION-VIOLATIONS.log`
- Repeated violations trigger system review

#### 6.2 Regular Audits
- Weekly: Structure compliance check
- Monthly: Full system alignment review
- Quarterly: Constitution effectiveness assessment

### Article VII: Session Tracking Requirements

#### 7.1 Mandatory Session Initialization
Every CLI session MUST:
- Initialize tracking using `shared/tools/session-tracker.py` before any work begins
- Use sequential session numbers (00001, 00002, etc.)
- Create session log in `archive/sessions/SESSION-XXXXX-LOG.md`
- Document session purpose and inherited context

#### 7.2 Required Tracking Events
Sessions MUST log:
- All major implementation steps with timestamps
- All decisions with rationales (stored in SESSION-XXXXX-DECISIONS.md)
- All test results and validation outcomes
- All blockers, failures, or deviations from plan
- All files created/modified (tracked in SESSION-XXXXX-FILES.txt)

#### 7.3 Session Completion Requirements
Before ending, sessions MUST:
- Generate final summary using session-tracker
- List all changed files via git diff
- Create handoff document for next session
- Mark session as COMPLETE in log file

#### 7.4 Enforcement and Compliance
- The `constitution-enforcer.py` SHALL verify session logs exist for all changes
- Commits without associated session tracking SHALL be rejected
- Session logs SHALL be treated as immutable once session is COMPLETE
- Retroactive session creation is permitted ONLY for sessions before this amendment

#### 7.5 Reality Domain Authority
- Session logs are Reality Domain artifacts (they record what IS)
- False or misleading session logs violate core principles
- Session tracking ensures truth about system evolution

### Ratification

**Date**: 2025-08-14
**Session**: #00001 (CLI)
**Ratified by**: Brian Kim (System Owner)
**Version**: 1.2.0

### Amendment Log

**Version 1.2.0** (2025-08-14, Session #00002)
- Added Article VII: Mandatory session tracking requirements
- Established session logs as Reality Domain artifacts
- Required decisions to have documented rationales
- Made session tracking constitutionally enforceable

**Version 1.1.0** (2025-08-14, Session #00001)
- Established Reality Domain as Leadership Domain with veto authority
- Clarified domain hierarchy: Reality → Requirements → Reconciliation
- Added session type tracking (CLI vs Desktop)

---

*"Order is not rigidity; it is the foundation for creative freedom."*