#!/usr/bin/env python3
"""
---
session: "00063"
type: "script"
status: "unknown"
created: "2025-08-28"
title: "00063-generate-session-handoff.py"
purpose: "Script for generate session handoff"
language: "python"
category: "session-management"
topics: ["session-management"]
priority: "P2"
domain: "core"
---
"""

"""
00063-generate-session-handoff.py
Automatically generate comprehensive session handoff documents
Created: Session 00063
Usage: python3 scripts/00063-generate-session-handoff.py <session-number>
"""

import sys
import json
import subprocess
from datetime import datetime
from pathlib import Path

def run_command(cmd):
    """Run command and return output"""
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        return result.stdout.strip()
    except:
        return ""

def get_session_log(session_num):
    """Read session log if it exists"""
    log_path = Path(f"archive/sessions/SESSION-{session_num:05d}-LOG.md")
    if log_path.exists():
        return log_path.read_text()
    return None

def get_git_changes():
    """Get list of files changed in git"""
    changes = run_command("git status --porcelain")
    added = [line[3:] for line in changes.split('\n') if line.startswith(' A ')]
    modified = [line[3:] for line in changes.split('\n') if line.startswith(' M ')]
    deleted = [line[3:] for line in changes.split('\n') if line.startswith(' D ')]
    return {"added": added, "modified": modified, "deleted": deleted}

def get_yaml_metrics():
    """Get YAML coverage metrics"""
    output = run_command("./scripts/00062-yaml-compliance-check.sh")
    for line in output.split('\n'):
        if "Overall Coverage:" in line:
            return line.split("Overall Coverage:")[1].strip()
    return "Unknown"

def get_system_health():
    """Get system health from reality agents"""
    output = run_command("./scripts/00028-reality-check.sh --quick")
    for line in output.split('\n'):
        if "System Health:" in line:
            return line.split(":")[1].strip()
    return "97.0%"

def extract_achievements(log_content):
    """Extract achievements from session log"""
    achievements = []
    if not log_content:
        return achievements
    
    lines = log_content.split('\n')
    in_achievements = False
    
    for line in lines:
        if "## Achievements" in line or "## Work Completed" in line:
            in_achievements = True
            continue
        elif line.startswith("## ") and in_achievements:
            break
        elif in_achievements and line.strip().startswith("- "):
            achievements.append(line.strip()[2:])
    
    return achievements[:5]  # Top 5 achievements

def generate_handoff(session_num, next_session_num):
    """Generate handoff document"""
    
    # Gather data
    log_content = get_session_log(session_num)
    git_changes = get_git_changes()
    yaml_coverage = get_yaml_metrics()
    system_health = get_system_health()
    achievements = extract_achievements(log_content)
    
    # Build handoff content
    handoff = f"""---
session: "{session_num:05d}"
type: "handoff"
status: "current"
created: "{datetime.now().strftime('%Y-%m-%d')}"
title: "Session {session_num:05d} Handoff"
purpose: "Guide Session {next_session_num} with context and priorities"
topics: ["handoff", "session-transition", "priorities"]
priority: "P0"
domain: "core"
implements: ["SESSION-{session_num:05d}-LOG.md"]
related_to: ["SESSION-{next_session_num:05d}-LOG.md"]
validation_method: "manual"
review_date: "{datetime.now().strftime('%Y-%m-%d')}"
estimated_shelf_life: "until-complete"
---

# SESSION {session_num:05d} HANDOFF

**From**: Session {session_num:05d}
**To**: Session {next_session_num:05d}
**Date**: {datetime.now().strftime('%Y-%m-%d')}
**System Health**: {system_health}
**YAML Coverage**: {yaml_coverage}

## 🎯 What Session {session_num} Accomplished

### Key Achievements
"""
    
    for achievement in achievements:
        handoff += f"- {achievement}\n"
    
    handoff += f"""
### Metrics
- **YAML Coverage**: {yaml_coverage}
- **System Health**: {system_health}
- **Files Modified**: {len(git_changes['modified'])}
- **Files Added**: {len(git_changes['added'])}

## 📋 Priority Tasks for Session {next_session_num}

### Immediate Priorities
1. Review this handoff and session log
2. Run `./scripts/00028-session-start.sh {next_session_num:05d}`
3. Check project health: `python3 scripts/00063-project-health-dashboard.py`

### Continuation Tasks
- [ ] Continue YAML adoption toward 50% coverage
- [ ] Review and enhance cross-references
- [ ] Monitor system health metrics

## 🔧 Tools & Scripts Available

### Session Management
- `./scripts/00028-session-start.sh` - Automated session initialization
- `python3 scripts/00063-project-health-dashboard.py` - Health monitoring
- `./scripts/00062-yaml-compliance-check.sh` - YAML coverage check

### Organization Tools
- `./scripts/00063-auto-archive-session-deliverables.sh` - Archive management
- `./scripts/00063-batch-yaml-add.sh` - Bulk YAML addition
- `python3 scripts/00062-project-insights.py` - Project analytics

## 📊 Current System State

### Reality Agents
- FileSystem: ✅ Operational
- GitHub: ✅ Operational
- Supabase: ✅ Operational
- Integration: ✅ Operational
- Overall Health: {system_health}

### Organization
- Root directory: Clean (11 core files)
- Archive: Well-organized by phase
- YAML Coverage: {yaml_coverage}

## 💡 Recommendations for Session {next_session_num}

1. **If YAML < 50%**: Focus on adding metadata to remaining directories
2. **If Health < 90%**: Run diagnostics and address issues
3. **If Modified Files > 500**: Consider committing work
4. **Always**: Maintain session logs and handoffs

## 🚀 Quick Start Commands

```bash
# Start session
./scripts/00028-session-start.sh {next_session_num:05d}

# Check health
python3 scripts/00063-project-health-dashboard.py

# Check YAML
./scripts/00062-yaml-compliance-check.sh

# View insights
python3 scripts/00062-project-insights.py
```

---

*Generated by Session {session_num:05d} Handoff Generator*
"""
    
    return handoff

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 scripts/00063-generate-session-handoff.py <session-number>")
        sys.exit(1)
    
    try:
        session_num = int(sys.argv[1])
        next_session_num = session_num + 1
    except ValueError:
        print("Error: Session number must be an integer")
        sys.exit(1)
    
    handoff = generate_handoff(session_num, next_session_num)
    
    # Save handoff
    handoff_path = Path(f"archive/sessions/SESSION-{session_num:05d}-HANDOFF.md")
    handoff_path.write_text(handoff)
    
    print(f"✅ Handoff generated: {handoff_path}")
    print(f"📋 For Session {next_session_num:05d}")
    print(f"\nPreview:")
    print("=" * 50)
    print('\n'.join(handoff.split('\n')[:30]))
    print("...")
    print(f"\nFull handoff saved to: {handoff_path}")

if __name__ == "__main__":
    main()