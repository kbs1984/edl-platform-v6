# Session Protocol
## Distinguishing CLI and Desktop Sessions

### Core Distinction

**CLI Sessions** (Claude Code CLI)
- **Identifier**: Numbered sessions (e.g., #00001, #00002, #00003)
- **Location**: This directory (`/edl-platform-v6/`)
- **Assignment**: Brian explicitly starts with "This is session #XXXXX"
- **Documentation**: All work logged locally in this repository
- **Persistence**: Full file system access and modification

**Desktop Sessions** (Claude Desktop App)
- **Identifier**: Unnamed or differently labeled sessions
- **Location**: Brian's account cloud storage
- **Assignment**: No explicit session number assignment
- **Documentation**: Stored in Anthropic's infrastructure
- **Persistence**: Conversation-based, no direct file system access

### The Golden Rule
**If Brian assigns a session number, you are in CLI.**

### Session Numbering Convention

```
#00001 - First CLI session (this session - 2025-08-14)
#00002 - Next CLI session
#00003 - Following CLI session
...
```

Numbers are:
- Sequential
- Zero-padded to 5 digits
- Never reused
- Permanently assigned

### Session Handoff Protocol

When transitioning between sessions:

1. **Ending a CLI Session**:
   - Create `SESSION-#XXXXX-HANDOFF.md` in `/archive/sessions/`
   - Update `SYSTEM-INDEX.md` with final status
   - Commit all pending changes
   - Document any open items for next session

2. **Starting a CLI Session**:
   - Brian declares: "This is session #XXXXX"
   - Check for previous handoff document
   - Update `SYSTEM-INDEX.md` with new session
   - Create `SESSION-#XXXXX-LOG.md`
   - Continue from last checkpoint

### Session Documentation Requirements

Every CLI session must maintain:

1. **Session Log** (`SESSION-#XXXXX-LOG.md`)
   - Session number and date
   - Brian's stated objectives
   - Work completed
   - Decisions made
   - Problems encountered

2. **Handoff Document** (when session ends)
   - Current state summary
   - Pending tasks
   - Blockers or issues
   - Next recommended actions

### Desktop vs CLI Context Isolation

**Important**: Desktop sessions and CLI sessions are isolated contexts.

- Desktop sessions cannot modify this file system
- CLI sessions cannot access Desktop conversation history
- Each environment has its own memory and state
- Cross-reference only through Brian's explicit communication

### Reality Check Protocol

At the start of each CLI session:
1. Verify session number with Brian
2. Check Reality Domain for current state
3. Review previous session's handoff
4. Confirm understanding of objectives

### Session Types and Their Purposes

**CLI Sessions** are for:
- System building and modification
- Code implementation
- File system operations
- Infrastructure work
- Technical implementation

**Desktop Sessions** are for:
- Planning and strategy
- Discussion and exploration
- Documentation review
- Design decisions
- Conceptual work

### The Chain of Truth

```
Reality Domain → Session Protocol → Actual Work
```

Every CLI session must:
1. Start with Reality check
2. Confirm session number
3. Execute within constraints
4. Document truthfully
5. Handoff completely

### Version History

- **v1.0.0** (2025-08-14): Initial protocol established in Session #00001

---

*"A session without a number is a Desktop conversation. A session with a number is CLI work."*