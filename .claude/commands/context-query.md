# Session Context Query Commands

## Quick Context Check
```bash
./scripts/context
```
Shows current priorities, v5→v6 integration status, Canvas wireframes, and next steps.

## Full Dynamic Context
```bash  
./scripts/00138-dynamic-context-loader.sh
```
Complete context with real-time status analysis.

## Context Alignment Check
When starting a session, you can ask:
- "What's our current context?"
- "Are we aligned on priorities?"
- "Show me the latest context"

Claude will run the context loader and confirm alignment.

## Use Cases
- ✅ Start of session: Automatic via session start script
- ✅ Mid-session check: `./scripts/context`
- ✅ Priority confirmation: Ask Claude to show context
- ✅ Before major decisions: Verify we're aligned

No more manual YAML review needed - context is automatically loaded!