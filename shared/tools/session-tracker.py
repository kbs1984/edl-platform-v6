#!/usr/bin/env python3
"""
Session Tracker - Automatically track work done in each session
Maintains a living log of all changes during a CLI session
"""

import os
import sys
import json
import subprocess
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any

class SessionTracker:
    """Track all work done in a session"""
    
    def __init__(self, session_number: str = None):
        self.root_path = Path.cwd()
        self.session_number = session_number or os.getenv("CURRENT_SESSION", "UNKNOWN")
        self.session_dir = self.root_path / "archive" / "sessions"
        self.session_dir.mkdir(parents=True, exist_ok=True)
        
        self.log_file = self.session_dir / f"SESSION-{self.session_number}-LOG.md"
        self.files_file = self.session_dir / f"SESSION-{self.session_number}-FILES.txt"
        self.decisions_file = self.session_dir / f"SESSION-{self.session_number}-DECISIONS.md"
        
    def init_session(self):
        """Initialize session tracking files"""
        if not self.log_file.exists():
            self.log_file.write_text(f"""# Session #{self.session_number} Log
**Date**: {datetime.now().strftime('%Y-%m-%d')}  
**Type**: CLI Session  
**Started**: {datetime.now().isoformat()}  

## Work in Progress

""")
        
        if not self.decisions_file.exists():
            self.decisions_file.write_text(f"""# Session #{self.session_number} Decisions
**Date**: {datetime.now().strftime('%Y-%m-%d')}

## Key Decisions

""")
        
        print(f"✅ Session #{self.session_number} tracking initialized")
        return True
    
    def track_file_changes(self) -> List[str]:
        """Track all file changes in current session using git"""
        try:
            # Get list of modified files
            result = subprocess.run(
                ["git", "diff", "--name-only"],
                capture_output=True,
                text=True,
                cwd=self.root_path
            )
            
            modified = result.stdout.strip().split('\n') if result.stdout.strip() else []
            
            # Get list of new files
            result = subprocess.run(
                ["git", "ls-files", "--others", "--exclude-standard"],
                capture_output=True,
                text=True,
                cwd=self.root_path
            )
            
            new_files = result.stdout.strip().split('\n') if result.stdout.strip() else []
            
            all_files = modified + new_files
            all_files = [f for f in all_files if f]  # Remove empty strings
            
            # Save to files list
            if all_files:
                self.files_file.write_text('\n'.join(all_files))
                
            return all_files
            
        except subprocess.CalledProcessError:
            return []
    
    def log_work(self, description: str, category: str = "general"):
        """Add work item to session log"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        
        with open(self.log_file, 'a') as f:
            f.write(f"\n**[{timestamp}]** [{category}] {description}\n")
        
        print(f"📝 Logged: {description}")
    
    def log_decision(self, decision: str, rationale: str = ""):
        """Log a key decision made during the session"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        
        with open(self.decisions_file, 'a') as f:
            f.write(f"\n### [{timestamp}] {decision}\n")
            if rationale:
                f.write(f"**Rationale**: {rationale}\n")
        
        print(f"📋 Decision logged: {decision}")
    
    def generate_summary(self) -> Dict[str, Any]:
        """Generate session summary"""
        files = self.track_file_changes()
        
        summary = {
            "session": self.session_number,
            "date": datetime.now().strftime('%Y-%m-%d'),
            "files_changed": len(files),
            "files": files[:10],  # First 10 files
            "log_file": str(self.log_file),
            "status": "active"
        }
        
        # Append summary to log
        with open(self.log_file, 'a') as f:
            f.write(f"\n## Summary (as of {datetime.now().strftime('%H:%M:%S')})\n")
            f.write(f"- Files changed: {len(files)}\n")
            f.write(f"- Key decisions made: Check {self.decisions_file.name}\n")
            
        return summary
    
    def end_session(self):
        """Finalize session tracking"""
        summary = self.generate_summary()
        
        # Mark session as complete
        with open(self.log_file, 'a') as f:
            f.write(f"\n---\n*Session ended: {datetime.now().isoformat()}*\n")
        
        print(f"✅ Session #{self.session_number} tracking complete")
        print(f"📁 Files changed: {summary['files_changed']}")
        print(f"📝 Log saved to: {self.log_file}")
        
        return summary


def main():
    """CLI interface for session tracking"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Session work tracker")
    parser.add_argument("command", choices=["init", "log", "decision", "summary", "end"])
    parser.add_argument("--session", help="Session number (e.g., 00002)")
    parser.add_argument("--message", help="Log message or decision")
    parser.add_argument("--rationale", help="Rationale for decision")
    parser.add_argument("--category", default="general", help="Log category")
    
    args = parser.parse_args()
    
    tracker = SessionTracker(args.session)
    
    if args.command == "init":
        tracker.init_session()
    
    elif args.command == "log":
        if not args.message:
            print("Error: --message required for logging")
            sys.exit(1)
        tracker.log_work(args.message, args.category)
    
    elif args.command == "decision":
        if not args.message:
            print("Error: --message required for decision")
            sys.exit(1)
        tracker.log_decision(args.message, args.rationale or "")
    
    elif args.command == "summary":
        summary = tracker.generate_summary()
        print(json.dumps(summary, indent=2))
    
    elif args.command == "end":
        tracker.end_session()


if __name__ == "__main__":
    main()