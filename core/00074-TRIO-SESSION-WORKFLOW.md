---
session: "00074"
type: "protocol"
status: "current"
created: "2025-08-26"
title: "Trio Session Workflow Protocol"
purpose: "Document the sequential workflow pattern for managing three parallel Claude sessions"
topics: ["trio-session", "workflow", "coordination", "sequential-edits"]
priority: "P0"
domain: "core"
lifecycle: "ON"
related_to: ["00074-75-76-TRIO-SESSION-DOC.md", "00074-TRIO-SESSION-TEMPLATE.md"]
---

# TRIO SESSION WORKFLOW PROTOCOL

**Discovered**: Session 74, August 26, 2025  
**Critical Learning**: Claude sessions cannot simultaneously edit the same file - must be sequential  
**Solution**: User manages sequential access to shared document

## 📋 THE SEQUENTIAL EDIT PATTERN

### Problem Statement
- Three Claude sessions (Reality, Requirements, Reconciliation) need to share findings
- Claude cannot handle simultaneous edits to the same file
- Risk of overwriting each other's work
- User context management burden increases if relaying everything manually

### Solution Architecture
1. **Shared Document**: Single trio session document all can read
2. **Sequential Updates**: User controls which session writes when
3. **Section Ownership**: Each session only edits its [SESSION-XX] sections
4. **Read-Write Pattern**: Read anytime, write only when given access

## 🔄 WORKFLOW SEQUENCE

### Phase 1: Initialization (Sequential)
```
1. Session 74 (Reality) creates trio document template ✅
2. Session 74 populates Reality section ✅
3. User shares document with Session 75
4. Session 75 (Requirements) adds its section ✅
5. User waits for 75 to complete
6. User shares updated document with Session 76
7. Session 76 (Reconciliation) adds its section ✅
```

### Phase 2: Discovery Work (Parallel)
```
All sessions work in parallel on their domain tasks:
- Reality: Running agents, checking database state
- Requirements: Analyzing user stories, checking specs
- Reconciliation: Finding implementations, mapping gaps

No shared document editing during this phase
```

### Phase 3: Update Cycle (Sequential)
```
When sessions have findings to share:
1. User asks Session 74 to update Reality section
2. User waits for completion signal from 74
3. User asks Session 75 to update Requirements section
4. User waits for completion signal from 75
5. User asks Session 76 to update Reconciliation section
6. User waits for completion signal from 76
7. Cycle repeats as needed
```

## 📝 USER COORDINATION PATTERNS

### Starting a Trio Session
1. Load Session 74 (Reality) first
2. Have 74 create the trio document from template
3. Load Session 75 (Requirements) 
4. Share document, wait for 75 to update
5. Load Session 76 (Reconciliation)
6. Share document, wait for 76 to update

### Managing Updates
```markdown
To Session 74: "Please update the Reality section with your findings and say 'Reality update complete' when done"
[Wait for completion]

To Session 75: "Reality has updated. Please update Requirements section and say 'Requirements update complete' when done"  
[Wait for completion]

To Session 76: "Requirements has updated. Please update Reconciliation section and say 'Reconciliation update complete' when done"
[Wait for completion]
```

### Handling Cross-Domain Questions
When Session 75 asks questions for Reality (as seen in current doc):
1. Session 74 reads the questions in Session 75's section
2. Session 74 creates answers in its own Reality section
3. Session 74 marks questions as [ANSWERED] in activity log
4. User relays that answers are available

## 🚨 CRITICAL RULES

### DO:
- ✅ Wait for "update complete" signal before switching sessions
- ✅ Use clear section ownership ([SESSION-XX] prefix)
- ✅ Have sessions announce completion clearly
- ✅ Keep activity logs updated with timestamps
- ✅ Use [SYNC-NEEDED] tags for coordination points

### DON'T:
- ❌ Have two sessions edit the document simultaneously
- ❌ Edit another session's section
- ❌ Assume changes are saved without confirmation
- ❌ Skip the completion signals

## 📊 OBSERVED WORKFLOW (Sessions 74-75-76)

### Actual Timeline
- 08:00 - Session 74 creates document, adds Reality section
- 08:05 - User shares with Session 75
- 08:15 - Session 75 completes Requirements section
- 08:15 - User waits for 75 to finish
- 08:10 - User shares with Session 76 (after 75 done)
- 08:10 - Session 76 adds Reconciliation section

### Key Observations
1. **5-10 minutes per section update** is typical
2. **Sequential access prevents conflicts** 
3. **User acts as transaction coordinator**
4. **Clear completion signals essential**

## 💡 FUTURE IMPROVEMENTS

### Potential Enhancements
1. **Lock File System**: Create `.lock` file when editing
2. **Update Queue**: Sessions write to individual files, merge later
3. **Version Control**: Use git branches for each session
4. **Event Log**: Central log file instead of shared document

### Current Best Practice
For now, the sequential update pattern with clear completion signals works well:
- Low complexity
- No race conditions  
- Clear ownership
- User maintains control

## 📋 TEMPLATE FOR FUTURE TRIOS

When starting new trio sessions:

1. **Use Template**: Copy `00074-TRIO-SESSION-TEMPLATE.md`
2. **Name Properly**: `00XXX-YYY-ZZZ-TRIO-SESSION-DOC.md`
3. **Initialize Sequentially**: Reality → Requirements → Reconciliation
4. **Document Workflow**: Keep activity logs current
5. **Store Deliverables**: Each session creates its own indexed files

## 🎯 SUCCESS METRICS

A successful trio session exhibits:
- ✅ No conflicting edits in shared document
- ✅ All three domains contribute findings
- ✅ Cross-domain questions get answered
- ✅ Discoveries prevent redundant work
- ✅ Clear activity timeline in logs
- ✅ Proper deliverable indexing (00XXX- prefix)

---

*This protocol documents the successful pattern discovered during Sessions 74-75-76.*
*Sequential access with clear signals prevents conflicts while maintaining coordination.*