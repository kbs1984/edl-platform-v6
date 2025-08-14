# Session Tracking Guide
**Purpose**: Mandatory tracking of all work performed during CLI sessions  
**Tool**: `shared/tools/session-tracker.py`  
**Constitutional Requirement**: YES (proposed)

## Why Session Tracking is Mandatory

Per Reality Domain principles:
- **Truth Over Assumptions**: We must know what actually happened
- **Accountability**: Every change must be traceable to a session
- **Handoff Quality**: Next session needs complete context
- **Learning**: We can only improve what we measure

## Quick Start

### 1. Starting a Session
```bash
# First thing after "This is session #XXXXX"
python3 shared/tools/session-tracker.py init --session XXXXX

# Or using make (recommended)
make track-init SESSION=XXXXX
```

### 2. During Work
```bash
# Log significant events
python3 shared/tools/session-tracker.py log --session XXXXX --message "Implemented Level 3 discovery" --category implementation

# Log decisions with rationale
python3 shared/tools/session-tracker.py decision --session XXXXX --message "Use SHA-256 for hashing" --rationale "Security/performance balance"

# Categories available: implementation, testing, planning, bugfix, refactor, documentation
```

### 3. Checking Progress
```bash
# Get current summary
python3 shared/tools/session-tracker.py summary --session XXXXX

# Or using make
make track-summary SESSION=XXXXX
```

### 4. Ending a Session
```bash
# Before creating handoff
python3 shared/tools/session-tracker.py end --session XXXXX

# Or using make
make track-end SESSION=XXXXX
```

## What Gets Tracked

### Automatically Tracked
- All files created/modified (via git diff)
- Timestamps for all events
- Session duration

### Manually Tracked (Required)
- Major implementation milestones
- Key decisions with rationales
- Test results
- Blockers encountered
- Handoff items

## Output Files

Each session generates:
```
archive/sessions/
├── SESSION-XXXXX-LOG.md       # Living work log
├── SESSION-XXXXX-FILES.txt    # All files touched
├── SESSION-XXXXX-DECISIONS.md # Decisions with rationales
└── SESSION-XXXXX-HANDOFF.md   # Created at session end
```

## Integration with Workflow

### Correct Session Flow
```bash
# 1. User declares session
"This is session #00003"

# 2. Initialize tracking (MANDATORY)
make track-init SESSION=00003

# 3. Do work, logging as you go
make track-log SESSION=00003 MSG="Created filesystem connector"

# 4. Log decisions when made
make track-decision SESSION=00003 MSG="Use pathlib over os module" RATIONALE="Better cross-platform support"

# 5. Before ending, generate summary
make track-summary SESSION=00003

# 6. End session officially
make track-end SESSION=00003

# 7. Create handoff for next session
```

## Makefile Integration

Add to Makefile:
```makefile
# Session tracking commands
track-init:
	@python3 shared/tools/session-tracker.py init --session $(SESSION)
	@echo "✅ Session $(SESSION) tracking initialized"

track-log:
	@python3 shared/tools/session-tracker.py log --session $(SESSION) --message "$(MSG)" --category $(CATEGORY)

track-decision:
	@python3 shared/tools/session-tracker.py decision --session $(SESSION) --message "$(MSG)" --rationale "$(RATIONALE)"

track-summary:
	@python3 shared/tools/session-tracker.py summary --session $(SESSION)

track-end:
	@python3 shared/tools/session-tracker.py end --session $(SESSION)
	@echo "✅ Session $(SESSION) tracking complete"

# Convenience: Start new session
new-session:
	@read -p "Enter session number (e.g., 00003): " SESSION; \
	python3 shared/tools/session-tracker.py init --session $$SESSION; \
	echo "export CURRENT_SESSION=$$SESSION" > .session.env; \
	echo "✅ Session $$SESSION started. Source .session.env to set environment"
```

## Environment Variable Support

For convenience, set current session:
```bash
export CURRENT_SESSION=00003

# Then commands can omit --session
python3 shared/tools/session-tracker.py log --message "Did something"
```

## Constitutional Amendment (Proposed)

### Addition to DIRECTORY-MAP-CONSTITUTION.md

```markdown
## 7. SESSION TRACKING REQUIREMENTS

### 7.1 Mandatory Session Initialization
Every CLI session MUST:
- Initialize tracking before any work begins
- Use sequential session numbers (00001, 00002, etc.)
- Create session log in archive/sessions/

### 7.2 Required Tracking Events
Sessions MUST log:
- All major implementation steps
- All decisions with rationales
- All test results
- All blockers or failures
- All files created/modified

### 7.3 Session Completion
Before ending, sessions MUST:
- Generate final summary
- List all changed files
- Create handoff document
- Mark session as COMPLETE

### 7.4 Enforcement
The constitution-enforcer.py SHALL:
- Reject commits without session tracking
- Verify session logs are updated
- Ensure decisions have rationales
```

## Examples from Real Sessions

### Good Tracking Example (Session #00002)
```bash
# Logged decision with clear rationale
python3 shared/tools/session-tracker.py decision \
  --session 00002 \
  --message "Use OpenAPI definitions for schema discovery" \
  --rationale "Works within anon permission constraints while still providing value"

# Logged implementation milestone
python3 shared/tools/session-tracker.py log \
  --session 00002 \
  --message "Completed Level 4 change tracking implementation" \
  --category implementation
```

### Poor Tracking (What to Avoid)
```bash
# ❌ No rationale for decision
"Decided to use SHA-256"

# ❌ Vague event logging
"Did some work on the connector"

# ❌ No category specification
"Fixed the bug"
```

## Retroactive Tracking

For sessions that already started without tracking:
```bash
# Create retroactive log
python3 shared/tools/session-tracker.py init --session XXXXX

# Manually add key events with timestamps
python3 shared/tools/session-tracker.py log \
  --session XXXXX \
  --message "Retroactive: Created connector.py at 13:45" \
  --category implementation
```

## Troubleshooting

### Session Already Exists
- Check if work is continuation of existing session
- If new work, increment session number

### Git Not Available
- Session tracker requires git for file tracking
- Ensure you're in a git repository

### Files Not Being Tracked
- Check git status - tracker only sees git-tracked changes
- Stage files with `git add` to include in tracking

## Benefits of Proper Tracking

1. **Complete Handoffs**: Next session knows exactly what was done
2. **Decision History**: Can revisit why choices were made
3. **Work Attribution**: Know who did what and when
4. **Progress Visibility**: See accomplishments clearly
5. **Constitutional Compliance**: Meets Reality Domain requirements

---

**Remember**: Session tracking isn't bureaucracy - it's how we maintain truth about our work.

*"What isn't tracked, didn't happen."* - Reality Domain Principle