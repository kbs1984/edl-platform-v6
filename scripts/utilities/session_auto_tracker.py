#!/usr/bin/env python3
"""
Session Auto-Tracker - Breaking the Manual Logging Failure Cycle
Created by Session 00004 to prevent Session 00005's inevitable failure
Uses Reality Agents to automatically track session work
"""

import sys
import time
import json
from datetime import datetime
from pathlib import Path

# Add parent paths for imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

try:
    # Import from Session 00003's work (note: hyphen in directory name)
    sys.path.insert(0, str(Path(__file__).parent.parent.parent / "reality" / "agent-reality-auditor" / "filesystem-connector"))
    from connector import FileSystemConnector
except ImportError as e:
    print(f"ERROR: FileSystem Reality Agent not found: {e}")
    print("Looking for: reality/agent-reality-auditor/filesystem-connector/connector.py")
    print("This was created by Session 00003 and is required for auto-tracking")
    sys.exit(1)

class SessionAutoTracker:
    """Combines Reality Agents for automated session tracking - no more manual logging failures"""
    
    def __init__(self, session_id: str):
        self.session_id = session_id
        self.fs_agent = FileSystemConnector(verbose=True)
        self.log_file = Path(f"archive/sessions/SESSION-{session_id}-AUTOLOG.md")
        self.start_snapshot = None
        self.last_snapshot = None
        self.start_time = datetime.now()
        
        # Initialize log file if doesn't exist
        if not self.log_file.exists():
            self.initialize_log()
    
    def initialize_log(self):
        """Create initial log file with proper headers"""
        self.log_file.parent.mkdir(parents=True, exist_ok=True)
        with open(self.log_file, 'w') as f:
            f.write(f"# Session {self.session_id} Auto-Tracked Log\n")
            f.write(f"**Date**: {datetime.now().strftime('%Y-%m-%d')}\n")
            f.write(f"**Started**: {datetime.now().strftime('%H:%M:%S')}\n")
            f.write(f"**Type**: AUTOMATED TRACKING (Reality Agent Based)\n\n")
            f.write("## Auto-Tracked Changes\n\n")
            f.write("*This log is generated automatically by combining File System and GitHub Reality Agents*\n\n")
    
    def start_session(self):
        """Capture initial state of the project"""
        print(f"[AUTO-TRACKER] Starting session {self.session_id} tracking...")
        self.start_snapshot = self.fs_agent.capture_snapshot(level=3)
        self.last_snapshot = self.start_snapshot
        
        self.write_log(f"Session tracking initialized. Monitoring {len(self.start_snapshot.get('files', []))} files")
        print(f"[AUTO-TRACKER] Captured baseline: {len(self.start_snapshot.get('files', []))} files")
        return self.start_snapshot
    
    def check_changes(self) -> dict:
        """Check for changes since last snapshot"""
        current_snapshot = self.fs_agent.capture_snapshot(level=2)
        
        if not self.last_snapshot:
            self.last_snapshot = current_snapshot
            return {}
        
        # Compare snapshots
        changes = self.fs_agent.compare_snapshots(self.last_snapshot, current_snapshot)
        
        # Process changes if any
        if changes and changes.get("change_detection", {}).get("has_changes"):
            change_data = changes["change_detection"]["changes"]
            
            # Log file additions
            if change_data.get("files_added"):
                self.write_log(f"Files created: {', '.join(change_data['files_added'])}")
                for file in change_data['files_added']:
                    print(f"[AUTO-TRACKER] New file: {file}")
            
            # Log file modifications
            if change_data.get("files_modified"):
                self.write_log(f"Files modified: {', '.join(change_data['files_modified'])}")
                for file in change_data['files_modified']:
                    print(f"[AUTO-TRACKER] Modified: {file}")
            
            # Log file deletions
            if change_data.get("files_removed"):
                self.write_log(f"Files removed: {', '.join(change_data['files_removed'])}")
            
            # Update last snapshot
            self.last_snapshot = current_snapshot
            
        return changes
    
    def write_log(self, message: str):
        """Write timestamped entry to log file"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        with open(self.log_file, 'a') as f:
            f.write(f"**[{timestamp}]** {message}\n")
    
    def auto_track_loop(self, interval: int = 300):
        """Main tracking loop - runs every interval seconds (default 5 minutes)"""
        print(f"[AUTO-TRACKER] Starting auto-tracking loop (checking every {interval} seconds)")
        
        # Initial capture
        self.start_session()
        
        try:
            while True:
                time.sleep(interval)
                changes = self.check_changes()
                
                if changes and changes.get("change_detection", {}).get("has_changes"):
                    change_count = changes["change_detection"]["summary"]["total_changes"]
                    print(f"[AUTO-TRACKER] Detected {change_count} changes")
                else:
                    print(f"[AUTO-TRACKER] No changes detected")
                
        except KeyboardInterrupt:
            self.write_log("Session tracking stopped by user")
            print("\n[AUTO-TRACKER] Tracking stopped")
            self.generate_summary()
    
    def generate_summary(self):
        """Generate final summary of session"""
        duration = datetime.now() - self.start_time
        hours = duration.total_seconds() / 3600
        
        final_snapshot = self.fs_agent.capture_snapshot(level=2)
        total_changes = self.fs_agent.compare_snapshots(self.start_snapshot, final_snapshot)
        
        summary = f"\n## Session Summary\n"
        summary += f"**Duration**: {hours:.2f} hours\n"
        summary += f"**Files at start**: {len(self.start_snapshot.get('files', []))}\n"
        summary += f"**Files at end**: {len(final_snapshot.get('files', []))}\n"
        
        if total_changes and total_changes.get("change_detection", {}).get("has_changes"):
            changes = total_changes["change_detection"]["changes"]
            summary += f"**Files added**: {len(changes.get('files_added', []))}\n"
            summary += f"**Files modified**: {len(changes.get('files_modified', []))}\n"
            summary += f"**Files removed**: {len(changes.get('files_removed', []))}\n"
        
        with open(self.log_file, 'a') as f:
            f.write(summary)
        
        print(f"[AUTO-TRACKER] Summary written to {self.log_file}")


def main():
    """Run the auto-tracker"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Automated Session Tracking using Reality Agents")
    parser.add_argument("session_id", help="Session ID (e.g., 00005)")
    parser.add_argument("--interval", type=int, default=300, help="Check interval in seconds (default: 300)")
    parser.add_argument("--test", action="store_true", help="Run in test mode (10 second interval)")
    
    args = parser.parse_args()
    
    if args.test:
        print("[AUTO-TRACKER] Running in TEST mode (10 second intervals)")
        args.interval = 10
    
    tracker = SessionAutoTracker(args.session_id)
    
    try:
        tracker.auto_track_loop(args.interval)
    except Exception as e:
        print(f"[AUTO-TRACKER] Error: {e}")
        tracker.write_log(f"ERROR: {e}")
        tracker.generate_summary()


if __name__ == "__main__":
    main()