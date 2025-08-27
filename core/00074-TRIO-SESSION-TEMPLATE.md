---
session: "template"
type: "template"
status: "current"
created: "2025-08-26"
title: "Trio Session Template"
purpose: "Template for creating shared documents for parallel session coordination"
topics: ["trio-session", "template", "coordination"]
priority: "P0"
domain: "core"
lifecycle: "ON"
---

# TRIO SESSION TEMPLATE
**Active Sessions**: XX (Reality), YY (Requirements), ZZ (Reconciliation)  
**Date**: YYYY-MM-DD  
**Purpose**: Coordinate domain work across three parallel sessions

## 📋 SECTION OWNERSHIP PROTOCOL

### Rules
1. **Section Ownership**: Only the session that creates a section can edit it
2. **Section Naming**: All sections MUST start with [SESSION-XX] prefix
3. **Review Rights**: All sessions can READ and COMMENT but not EDIT others' sections
4. **Synchronization Points**: Mark with [SYNC-NEEDED] when cross-domain alignment required
5. **Truth Priority**: Reality domain findings override assumptions in other domains

### Section Format
```markdown
## [SESSION-XX] Section Title
**Owner**: Session XX  
**Domain**: [Reality|Requirements|Reconciliation]  
**Created**: YYYY-MM-DD HH:MM  
**Last Updated**: YYYY-MM-DD HH:MM  

### Content
[Section content here]

### Cross-Domain Notes
[Notes for other sessions to consider]
```

---

## 🔴 [SESSION-XX] REALITY DOMAIN STATUS
**Owner**: Session XX  
**Domain**: Reality  
**Created**: YYYY-MM-DD HH:MM  
**Last Updated**: YYYY-MM-DD HH:MM  

### Content
[Session XX to add Reality findings here]

### Cross-Domain Notes
[Session XX to add notes for Requirements and Reconciliation]

---

## 🟡 [SESSION-YY] REQUIREMENTS DOMAIN STATUS
**Owner**: Session YY  
**Domain**: Requirements  
**Created**: YYYY-MM-DD HH:MM  
**Last Updated**: YYYY-MM-DD HH:MM  

### Content
[Session YY to add Requirements findings here]

### Cross-Domain Notes
[Session YY to add notes for Reality and Reconciliation]

---

## 🟢 [SESSION-ZZ] RECONCILIATION DOMAIN STATUS
**Owner**: Session ZZ  
**Domain**: Reconciliation  
**Created**: YYYY-MM-DD HH:MM  
**Last Updated**: YYYY-MM-DD HH:MM  

### Content
[Session ZZ to add Reconciliation findings here]

### Cross-Domain Notes
[Session ZZ to add notes for Reality and Requirements]

---

## 🔄 SYNCHRONIZATION POINTS

### [SYNC-NEEDED] Auth Flow Verification
**Raised By**: User concern about foundation assumptions  
**Status**: Pending investigation  
**Required Actions**:
1. Reality: Verify actual database triggers/functions
2. Requirements: Document auth flow expectations
3. Reconciliation: Map gaps between reality and requirements

### [SYNC-NEEDED] Tool Awareness
**Raised By**: User concern about repetitive work  
**Status**: Active  
**Required Actions**:
1. Reality: Maintain tool inventory
2. Requirements: Check existing specs before creating
3. Reconciliation: Use existing tools before building new

---

## 📊 SHARED DISCOVERIES

### Existing Tools Inventory
[To be populated collaboratively]

### Known Working Components
[To be populated collaboratively]

### Confirmed Assumptions
[To be populated collaboratively]

### Invalidated Assumptions
[To be populated collaboratively]

---

## 📝 SESSION LOGS

### Session XX Activity Log
[To be filled by Session XX]

### Session YY Activity Log
[To be filled by Session YY]

### Session ZZ Activity Log
[To be filled by Session ZZ]

---

## 🎯 COORDINATION PROTOCOL

### How to Use This Document
1. **On Session Start**: Read ALL sections to understand current state
2. **Before Work**: Check if relevant work already documented
3. **During Work**: Update your section with findings
4. **On Discovery**: Add to shared discoveries if cross-domain
5. **On Conflict**: Mark [SYNC-NEEDED] and describe issue
6. **On Session End**: Update your section's "Last Updated" timestamp

### Communication Patterns
- **Reality → Requirements**: "This exists/doesn't exist"
- **Requirements → Reconciliation**: "This is needed"
- **Reconciliation → Reality**: "Verify this implementation"
- **All → All**: "Found existing tool/work at [location]"

---

*This document enables three parallel Claude sessions to work efficiently without context overload.*
*Each session owns its section but all benefit from shared knowledge.*