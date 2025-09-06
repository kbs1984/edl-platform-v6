---
type: housekeeping-plan
session: 166
date: 2025-09-04
status: proposed
---

# Session 166: Root Directory Housekeeping Plan

## Evidence Gathered

### Current State Analysis
- **72 loose files** at root level (unorganized)
- **19 main directories** with clear purposes
- **Existing infrastructure:**
  - `archive/` - Historical records, immutable storage
  - `archive/sessions/` - Session logs and handoffs
  - `reconciliation/` - Technical reports and implementation docs
  - `test-results/` - Test outputs
  - `tests/` - Test scripts

### File Categories at Root

#### 1. Session Reports (19 files)
**Pattern:** `SESSION-[151-165]-*.md`
- Final reports, evidence, accomplishments
- Strategy proposals and investigations
- Currently loose at root

#### 2. Test Scripts (30+ files)
**Pattern:** `*.js`, `test-*.js`, `session-153-*.js`
- Browser automation scripts
- Login tests, dashboard inspections
- Debug and exploration scripts

#### 3. Test Outputs (10+ files)
**Pattern:** `*.log`, `*.png`
- Test execution logs
- Screenshot evidence
- Navigation diagnostics

#### 4. Dashboard Mockups (5 files)
**Pattern:** `*dashboard*.html`
- UI mockups and prototypes
- Progress tracking visualizations

#### 5. Configuration Files (Should stay at root)
- `package.json`, `package-lock.json`
- `vercel.json`, `playwright.config.js`
- `Makefile`

#### 6. Legacy/Orphan Files (3 files)
- `00074-VERIFY-00060-DEPLOYMENT.sql`
- `v5-extraction-250903.md`
- `YAML-STATUS.md`

## Proposed Organization Structure

### Phase 1: Session Reports → Archive
**Destination:** `archive/sessions/`
```
SESSION-151-*.md → archive/sessions/
SESSION-153-*.md → archive/sessions/
SESSION-154-*.md → archive/sessions/
SESSION-156-*.md → archive/sessions/
SESSION-160-*.md → archive/sessions/
SESSION-162-*.md → archive/sessions/
SESSION-163-*.md → archive/sessions/
SESSION-164-*.md → archive/sessions/
SESSION-165-*.md → archive/sessions/
```
**Rationale:** Aligns with archive's purpose of preserving session records

### Phase 2: Test Scripts → Tests Directory
**Destination:** `tests/browser-automation/`
```
Create: tests/browser-automation/
Move all *.js test files (except config)
Organize by session:
  tests/browser-automation/session-153/
  tests/browser-automation/dashboard-inspection/
  tests/browser-automation/login-tests/
```
**Rationale:** Centralizes test scripts for better discovery and reuse

### Phase 3: Test Outputs → Test Results
**Destination:** `test-results/`
```
*.log → test-results/logs/
*.png → test-results/screenshots/
test-evidence-*.txt → test-results/evidence/
```
**Rationale:** Separates test artifacts from source code

### Phase 4: Dashboard Mockups → Reconciliation
**Destination:** `reconciliation/ui-mockups/`
```
Create: reconciliation/ui-mockups/
*dashboard*.html → reconciliation/ui-mockups/
```
**Rationale:** Groups UI planning documents with other technical specs

### Phase 5: Legacy Files → Archive
**Destination:** `archive/legacy-work/`
```
00074-VERIFY-00060-DEPLOYMENT.sql → archive/legacy-work/
v5-extraction-250903.md → reconciliation/
YAML-STATUS.md → reconciliation/
```
**Rationale:** Preserves historical context while clearing root

## Implementation Safety Checks

### Pre-Implementation Verification
1. ✅ No active processes using these files
2. ✅ Git status shows files are tracked
3. ✅ Destinations exist or will be created
4. ✅ No naming conflicts at destinations

### Rollback Strategy
- All moves will be done via `git mv`
- Single commit for easy reversion
- Backup script creation before execution

## Expected Outcomes

### Before: 72 loose files at root
### After: ~8 files at root (only configs)

### Benefits:
1. **Improved Navigation** - Clear, logical structure
2. **Better Discovery** - Related files grouped together
3. **Preserved History** - Git tracks all moves
4. **Archive Integrity** - Follows established patterns
5. **Test Organization** - Easier to find and run tests

## Execution Commands Preview

```bash
# Phase 1: Session Reports
git mv SESSION-151-*.md archive/sessions/
git mv SESSION-153-*.md archive/sessions/
# ... etc

# Phase 2: Test Scripts
mkdir -p tests/browser-automation/session-153
git mv session-153-*.js tests/browser-automation/session-153/
# ... etc

# Phase 3: Test Outputs
mkdir -p test-results/{logs,screenshots,evidence}
git mv *.log test-results/logs/
# ... etc
```

## Request for Approval

This plan will:
- ✅ Preserve all files and history
- ✅ Follow existing organizational patterns
- ✅ Improve project structure
- ✅ Be fully reversible

**Ready to proceed with implementation?**

---
*Note: Will create a detailed log of all moves for audit trail*