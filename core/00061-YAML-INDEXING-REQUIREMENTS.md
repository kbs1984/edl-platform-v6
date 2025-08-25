---
created: '2025-08-23'
domain: core
estimated_shelf_life: indefinite
implements:
- organizational-health
- discoverability
priority: P0
purpose: Establish mandatory YAML frontmatter requirements for all session deliverables
related_to:
- 00059-yaml-indexer.py
- CLAUDE.md
review_date: '2025-09-23'
session: '00061'
status: current
title: YAML Frontmatter Requirements for Future Sessions
topics:
- yaml
- requirements
- indexing
- metadata
- organization
type: specification
validation_method: automated
---

# YAML Frontmatter Requirements for Future Sessions

**Session**: 00061  
**Date**: 2025-08-23  
**Status**: MANDATORY REQUIREMENT

## 🚨 Critical Discovery

**Only 39 out of 941 markdown files (4.1%) have YAML frontmatter**, making 95.9% of our documentation invisible to:
- The YAML indexer
- FileSystem Agent Level 3
- Organizational health metrics
- Cross-reference validation
- Automated discovery tools

## 📊 Current State Analysis

### Files WITHOUT YAML Frontmatter (902 files)
- **ALL 61 session logs** (0% coverage)
- **34 of 36 session handoffs** (5.6% coverage)
- **Most critical docs** (MASTERPLANS, INDEX files, guides)
- **All requirements domain files**
- **All scripts documentation**
- **897 truth-seed files**

### Files WITH YAML Frontmatter (39 files)
- Recent Session 58-59 deliverables
- Some root-level strategic docs
- .claude command files
- Roo rules files

## 🎯 MANDATORY REQUIREMENTS - Effective Session 00062

### 1. All Session Deliverables MUST Include YAML Frontmatter

**Required Fields**:
```yaml
---
session: "00XXX"              # Session number (required)
type: "log|handoff|documentation|script|requirements|architecture"
status: "draft|current|completed|deprecated"
created: "YYYY-MM-DD"          # Creation date
title: "Descriptive Title"     # Clear, searchable title
purpose: "One-line purpose"    # Why this exists
topics: ["keyword1", "keyword2"] # For discovery
priority: "P0|P1|P2"           # Priority level
domain: "core|reality|requirements|reconciliation"
---
```

**Optional But Recommended Fields**:
```yaml
implements: ["feature1", "protocol2"]  # What this implements
fixes: ["issue1", "bug2"]              # What this fixes
related_to: ["file1.md", "file2.py"]   # Related files
depends_on: ["dependency1"]            # Dependencies
validation_method: "manual|automated|tested"
review_date: "YYYY-MM-DD"             # When to review
estimated_shelf_life: "30d|90d|indefinite"
breakthrough: "Key innovation"         # Major discoveries
```

### 2. Session Logs MUST Be Updated

The session log template (`scripts/create-session-log.sh`) must be updated to include YAML frontmatter:

```yaml
---
session: "00XXX"
type: "log"
status: "current"
created: "YYYY-MM-DD"
title: "Session #00XXX Log"
purpose: "Document work completed in Session 00XXX"
topics: ["session-log", "work-tracking"]
priority: "P0"
domain: "core"
---
# Session #00XXX Log
```

### 3. Retroactive Application

**Immediate Priority** (Session 62-65):
- Update all Session 50+ logs with YAML
- Update all handoff documents
- Update all P0 documentation

**Medium Priority** (Session 66-70):
- Update MASTERPLAN documents
- Update INDEX files
- Update protocol documents

**Long-term** (Ongoing):
- Gradually update historical sessions
- Update truth-seed documentation as needed

## 📋 Implementation Checklist

### For Every New File Created:
- [ ] Starts with `---` YAML delimiter
- [ ] Contains all required fields
- [ ] `session` field matches creating session
- [ ] `type` accurately describes content
- [ ] `topics` includes relevant keywords
- [ ] Ends with `---` YAML delimiter
- [ ] Has blank line after closing delimiter

### For Session Startup:
- [ ] Check YAML coverage percentage
- [ ] Identify files needing metadata
- [ ] Report organizational health score
- [ ] Flag validation errors

## 🔍 Validation Commands

```bash
# Check if file has YAML frontmatter
head -1 filename.md | grep -q "^---$"

# Validate YAML structure
python3 scripts/00059-yaml-indexer.py --validate filename.md

# Check organizational health
python3 scripts/00059-yaml-health-check.sh

# Find files without YAML
find . -name "*.md" -exec sh -c 'head -1 "$1" | grep -q "^---$" || echo "$1"' _ {} \;
```

## 📈 Success Metrics

### Immediate Goals (by Session 65):
- Session logs: 100% YAML coverage
- New deliverables: 100% YAML coverage
- Organizational score: >85/100

### 30-Day Goals (by Session 75):
- Overall coverage: >25% (from current 4.1%)
- All P0 docs: 100% YAML coverage
- Cross-reference integrity: >95%

### 90-Day Goals (by Session 100):
- Overall coverage: >50%
- All active docs: 100% YAML coverage
- Full indexing capability operational

## 🚀 Benefits of Compliance

1. **Discoverability**: Files become searchable by topic, session, type
2. **Cross-referencing**: Automatic relationship mapping
3. **Health Monitoring**: Real-time organizational metrics
4. **Validation**: Automatic detection of issues
5. **Navigation**: Quick access to related content
6. **Maintenance**: Easy identification of stale content
7. **Integration**: Reality Agents can understand file purposes

## ⚠️ Non-Compliance Impact

Files without YAML frontmatter:
- Are invisible to organizational health metrics
- Cannot be indexed or searched efficiently
- Break cross-reference validation
- Reduce system discoverability score
- Create "dark documentation" that's hard to find
- Cannot be automatically validated or maintained

## 📝 Template for Quick Application

Copy and adapt this template for any markdown file:

```yaml
---
session: "000XX"
type: "documentation"
status: "current"
created: "2025-08-23"
title: "Your Title Here"
purpose: "Brief purpose statement"
topics: ["relevant", "keywords"]
priority: "P1"
domain: "core"
---

[Your content starts here]
```

## 🎯 Action Items for Session 00062+

1. **Update session log creation script** to include YAML template
2. **Create bulk update script** for retroactive application
3. **Add YAML check to session-guard.sh** validation
4. **Update CLAUDE.md** with this requirement
5. **Monitor compliance** in session startup metrics

---

*This requirement is MANDATORY for all future sessions to ensure our documentation remains discoverable, maintainable, and integrated with our organizational health system.*