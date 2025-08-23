---
session: "00055"
type: "script"
status: "current"
created: "2025-08-23"
title: "Security Warning Integration Instructions"
purpose: "Document security warning integration instructions"
topics: ['database', 'script']
priority: "P1"
domain: "core"
---

# Security Warning Integration Instructions
**Created**: Session 00045 (Prevention Protocol)  
**Purpose**: Integrate RLS security warnings into session startup

---

## Quick Integration (2 minutes)

To add security warnings to session startup, add this line to any session startup script:

```bash
# Add this line after session initialization but before main work
./scripts/00055-add-security-warning.sh --check-and-warn "$SESSION_FOCUS"
```

### Example Integration in `00028-session-start.sh`:

```bash
# Around line 50, after session log creation, add:
echo "Checking for database security requirements..."
./scripts/00055-add-security-warning.sh --check-and-warn "$SESSION_FOCUS"
```

---

## How It Works

The security warning script:
1. **Detects database work** by checking for:
   - `truth-seed/` directory exists
   - `TRUTH-SEED-ADOPTION-DECISION.md` exists  
   - `reconciliation/active-work/` directory exists
   - Session focus contains database-related keywords

2. **Shows appropriate warning** with:
   - Explanation of PGRST205 errors as success
   - Links to prevention documentation
   - Testing guidance
   - Mental model correction

3. **Optional acknowledgment** for critical database sessions requiring:
   - User to type "I understand RLS security"
   - Prevents accidental database panic

---

## Testing the Integration

```bash
# Test the warning display
./scripts/00055-add-security-warning.sh --force-show

# Test detection logic
./scripts/00055-add-security-warning.sh --check-and-warn "database migration work"
```

---

## Integration Locations

### Immediate (High Priority):
- `scripts/00028-session-start.sh` - Main session startup
- Any database handoff scripts
- Team coordination scripts

### Future (Nice to Have):
- Git pre-commit hooks for database changes
- CI/CD pipeline for database deployment
- Project README as general warning

---

## Benefits

1. **Prevents Panic**: Sessions see warning BEFORE encountering PGRST205
2. **Sets Expectations**: Explains that security blocks are normal
3. **Provides Tools**: Links to correct testing scripts
4. **Educational**: Teaches proper security mindset
5. **Saves Time**: Prevents crisis escalations and confusion

---

## Customization Options

### Minimal Warning (Less Intrusive):
```bash
echo "⚠️  Database security active - PGRST205 errors expected (see PRE-SESSION-CHECKLIST.md)"
```

### Full Warning (Comprehensive):
Use the complete `00055-add-security-warning.sh --check-and-warn` approach

### Critical Sessions Only:
Add acknowledgment requirement for sessions with "database", "migration", "schema", "RLS", or "auth" in focus

---

**Recommendation**: Start with full warning integration in main session startup, then customize based on team feedback.