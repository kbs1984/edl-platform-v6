# Session Protocol Automation Framework

**Session**: 00020  
**Date**: 2025-08-17  
**Purpose**: Automate session protocol compliance to prevent future violations  
**Problem**: Sessions aren't consistently following protocol (including Session 20)

---

## Identified Protocol Violations to Automate

### 1. Handoff Discovery Automation

```python
# reconciliation/automation/handoff_finder.py

import os
import glob
from pathlib import Path

class HandoffFinder:
    """Automatically find and read handoff documents"""
    
    def __init__(self, session_number):
        self.session_number = session_number
        self.handoff_patterns = [
            f"SESSION-{session_number:05d}-*-HANDOFF.md",
            f"SESSION-*-TO-{session_number:05d}-HANDOFF.md",
            f"*{session_number:05d}*HANDOFF*.md",
            f"archive/sessions/*{session_number}*HANDOFF*.md"
        ]
    
    def find_handoff(self):
        """Search for handoff document in multiple locations"""
        
        search_locations = [
            ".",  # Root
            "archive/sessions/",
            "reconciliation/",
            "requirements/",
            "reality/"
        ]
        
        for location in search_locations:
            for pattern in self.handoff_patterns:
                matches = glob.glob(os.path.join(location, pattern))
                if matches:
                    return matches[0]
        
        return None
    
    def validate_handoff_read(self, session_log):
        """Check if session log references reading handoff"""
        
        handoff_file = self.find_handoff()
        if not handoff_file:
            return {"status": "warning", "message": "No handoff found"}
        
        with open(session_log) as f:
            log_content = f.read()
        
        if os.path.basename(handoff_file) in log_content:
            return {"status": "success", "message": "Handoff referenced in log"}
        else:
            return {"status": "error", "message": f"Handoff {handoff_file} not mentioned in log"}
```

### 2. File Naming Enforcement

```python
# reconciliation/automation/naming_enforcer.py

class NamingEnforcer:
    """Enforce session number prefixes on all deliverables"""
    
    def __init__(self, session_number):
        self.session_number = session_number
        self.prefix = f"{session_number:05d}-"
    
    def check_created_files(self, start_time):
        """Find all files created since session start"""
        
        import subprocess
        
        # Find files created after start_time
        cmd = f"find . -type f -newer {start_time} -name '*.md' -o -name '*.py' -o -name '*.json'"
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        
        files = result.stdout.strip().split('\n')
        violations = []
        
        for file in files:
            filename = os.path.basename(file)
            # Skip system files
            if filename.startswith('.') or 'node_modules' in file:
                continue
            
            # Check if it's a deliverable that should have prefix
            if self.is_deliverable(file) and not filename.startswith(self.prefix):
                violations.append(file)
        
        return violations
    
    def is_deliverable(self, filepath):
        """Determine if file is a deliverable requiring prefix"""
        
        deliverable_indicators = [
            'reconciliation/',
            'requirements/user-stories/',
            'reality/reports/',
            'gap-analysis/',
            'prototype-plan/',
            'progress-tracking/'
        ]
        
        return any(indicator in filepath for indicator in deliverable_indicators)
    
    def auto_rename_files(self, violations):
        """Automatically rename files with proper prefix"""
        
        renamed = []
        for file in violations:
            dir_path = os.path.dirname(file)
            old_name = os.path.basename(file)
            new_name = self.prefix + old_name
            new_path = os.path.join(dir_path, new_name)
            
            os.rename(file, new_path)
            renamed.append((file, new_path))
        
        return renamed
```

### 3. Session Start Protocol Automation

```python
# reconciliation/automation/session_starter.py

class SessionStarter:
    """Automate proper session initialization"""
    
    def __init__(self, session_number):
        self.session_number = session_number
        self.checks = []
    
    def start_session(self):
        """Execute complete session start protocol"""
        
        print(f"Starting Session {self.session_number:05d} with protocol compliance...")
        
        # 1. Check for handoff
        self.check_handoff()
        
        # 2. Create session log
        self.create_session_log()
        
        # 3. Read masterplan
        self.read_masterplan()
        
        # 4. Run reality baseline
        self.run_reality_baseline()
        
        # 5. Check system structure
        self.check_system_structure()
        
        # 6. Update session state
        self.update_session_state()
        
        return self.checks
    
    def check_handoff(self):
        """Find and display handoff from previous session"""
        
        finder = HandoffFinder(self.session_number)
        handoff = finder.find_handoff()
        
        if handoff:
            print(f"✅ Found handoff: {handoff}")
            print("📄 Reading handoff...")
            with open(handoff) as f:
                print(f.read()[:500] + "...")
            self.checks.append({"handoff": "found"})
        else:
            print("⚠️ No handoff found from previous session")
            self.checks.append({"handoff": "missing"})
    
    def create_session_log(self):
        """Create session log with proper template"""
        
        import subprocess
        
        result = subprocess.run(
            f"./scripts/create-session-log.sh {self.session_number:05d} 'Session Focus'",
            shell=True,
            capture_output=True
        )
        
        if result.returncode == 0:
            print(f"✅ Session log created")
            self.checks.append({"log": "created"})
        else:
            print("❌ Failed to create session log")
            self.checks.append({"log": "failed"})
    
    def read_masterplan(self):
        """Display masterplan for required reading"""
        
        masterplan = "RESTORATION-MASTERPLAN-V3.md"
        if os.path.exists(masterplan):
            print(f"📖 MANDATORY: Read {masterplan}")
            self.checks.append({"masterplan": "available"})
        else:
            print(f"❌ Masterplan not found")
            self.checks.append({"masterplan": "missing"})
    
    def run_reality_baseline(self):
        """Execute reality baseline check"""
        
        print("🔍 Running Reality baseline check...")
        import subprocess
        
        result = subprocess.run(
            "./scripts/structure-check.sh",
            shell=True,
            capture_output=True,
            text=True
        )
        
        print(result.stdout)
        self.checks.append({"reality_baseline": "complete"})
    
    def check_system_structure(self):
        """Verify system structure integrity"""
        
        required_dirs = [
            "requirements/",
            "reality/",
            "reconciliation/",
            "archive/sessions/",
            "shared/"
        ]
        
        missing = []
        for dir in required_dirs:
            if not os.path.exists(dir):
                missing.append(dir)
        
        if missing:
            print(f"❌ Missing directories: {missing}")
            self.checks.append({"structure": "incomplete"})
        else:
            print("✅ System structure intact")
            self.checks.append({"structure": "complete"})
```

### 4. Index File Auto-Updater

```python
# reconciliation/automation/index_updater.py

class IndexUpdater:
    """Automatically update INDEX files with session work"""
    
    def __init__(self, session_number):
        self.session_number = session_number
        self.index_files = [
            "SYSTEM-INDEX.md",
            "requirements/REQUIREMENTS_INDEX.md",
            "reality/REALITY_INDEX.md",
            "reconciliation/RECONCILIATION_INDEX.md"
        ]
    
    def update_all_indexes(self, work_completed):
        """Update all relevant INDEX files"""
        
        updates = []
        
        for index_file in self.index_files:
            if os.path.exists(index_file):
                updated = self.update_index(index_file, work_completed)
                if updated:
                    updates.append(index_file)
        
        return updates
    
    def update_index(self, index_file, work_completed):
        """Update specific INDEX file with session work"""
        
        with open(index_file) as f:
            content = f.read()
        
        # Determine what to update based on file
        if "SYSTEM-INDEX" in index_file:
            updates = self.get_system_updates(work_completed)
        elif "REQUIREMENTS" in index_file:
            updates = self.get_requirements_updates(work_completed)
        elif "REALITY" in index_file:
            updates = self.get_reality_updates(work_completed)
        elif "RECONCILIATION" in index_file:
            updates = self.get_reconciliation_updates(work_completed)
        else:
            return False
        
        # Apply updates
        new_content = self.apply_updates(content, updates)
        
        if new_content != content:
            with open(index_file, 'w') as f:
                f.write(new_content)
            return True
        
        return False
    
    def get_reconciliation_updates(self, work_completed):
        """Generate updates for Reconciliation INDEX"""
        
        return {
            "session": self.session_number,
            "date": "2025-08-17",
            "deliverables": work_completed.get("deliverables", []),
            "status": work_completed.get("status", ""),
            "metrics": work_completed.get("metrics", {})
        }
```

### 5. Handoff Generator

```python
# reconciliation/automation/handoff_generator.py

class HandoffGenerator:
    """Automatically generate handoff for next session"""
    
    def __init__(self, session_number):
        self.session_number = session_number
        self.next_session = session_number + 1
    
    def generate_handoff(self, work_completed, next_priorities):
        """Create comprehensive handoff document"""
        
        template = f"""# Session {self.next_session:05d} Handoff

**From**: Session {self.session_number:05d}  
**Date**: {self.get_date()}  
**Purpose**: {next_priorities.get('purpose', 'Continue constitutional restoration')}  
**Phase**: {next_priorities.get('phase', 'TBD')}

---

## 🎯 Mission for Session {self.next_session}

{next_priorities.get('mission', 'Mission to be determined based on progress')}

---

## 📊 Current State

### Work Completed by Session {self.session_number}
{self.format_work_completed(work_completed)}

### System Status
{self.get_system_status()}

---

## 📋 Specific Tasks

{self.format_tasks(next_priorities.get('tasks', []))}

---

## 📚 Required Reading

1. RESTORATION-MASTERPLAN-V3.md
2. This handoff document
3. {self.get_relevant_docs(next_priorities)}

---

## ⚠️ Important Notes

{next_priorities.get('notes', '')}

---

## 🎯 Success Metrics

You will be successful if you:
{self.format_success_metrics(next_priorities.get('metrics', []))}

---

*Session {self.session_number} - {work_completed.get('summary', 'Work completed')}*
"""
        
        filename = f"SESSION-{self.next_session:05d}-HANDOFF.md"
        with open(filename, 'w') as f:
            f.write(template)
        
        return filename
```

---

## Integration Script

```bash
#!/bin/bash
# reconciliation/automation/00020-enforce-protocol.sh

SESSION_NUMBER=$1

echo "=== Session Protocol Enforcement System ==="
echo "Session: $SESSION_NUMBER"

# 1. Start session properly
python3 reconciliation/automation/session_starter.py --session $SESSION_NUMBER

# 2. Monitor file creation
python3 reconciliation/automation/naming_enforcer.py --session $SESSION_NUMBER --watch &

# 3. Track work for indexes
python3 reconciliation/automation/work_tracker.py --session $SESSION_NUMBER &

# 4. Periodic protocol checks
while true; do
    python3 reconciliation/automation/protocol_checker.py --session $SESSION_NUMBER
    sleep 300  # Check every 5 minutes
done &

echo "Protocol enforcement active. Press Ctrl+C to stop."
wait
```

---

## Why This Matters

### Current Problems
1. Sessions don't read handoffs (Session 20 missed its handoff)
2. Files aren't properly prefixed (Session 20 created unprefixed files)
3. INDEX files aren't updated (inconsistent tracking)
4. Session logs incomplete (missing system state)
5. No handoff generation (manual process prone to omission)

### Solution Benefits
1. **Automatic handoff discovery** - Never miss a handoff again
2. **Enforced naming** - All files properly prefixed
3. **Automated INDEX updates** - Always current
4. **Protocol compliance** - Consistent session starts
5. **Generated handoffs** - Never forget to prepare for next session

---

## Implementation Priority for Session 21

1. **First**: Handoff finder (so they find this document!)
2. **Second**: Session starter (proper initialization)
3. **Third**: Naming enforcer (prevent violations)
4. **Fourth**: Index updater (maintain consistency)
5. **Fifth**: Handoff generator (prepare for Session 22)

---

*This automation ensures future sessions follow protocol consistently*