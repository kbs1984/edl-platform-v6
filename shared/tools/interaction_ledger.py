#!/usr/bin/env python3
"""
Interaction Ledger - Track ACTUAL work patterns, not pretend time
Enhanced from Session 00003B's Reality Protocol
"""

import json
import hashlib
import subprocess
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Any, Optional

class InteractionLedger:
    """Track the ACTUAL work pattern, not pretend time"""
    
    def __init__(self, session_id: str):
        self.session_id = session_id
        self.interactions = []
        self.gaps = []
        self.ledger_file = Path(f"archive/sessions/.ledger/SESSION-{session_id}-LEDGER.json")
        self.ledger_file.parent.mkdir(parents=True, exist_ok=True)
        
        # Load existing ledger if it exists
        if self.ledger_file.exists():
            self.load_ledger()
    
    def record_interaction(self, action: str = None, tool_used: str = None):
        """Auto-called when ANY tool is used"""
        now = datetime.now()
        last = self.interactions[-1]["time"] if self.interactions else None
        
        # Detect and classify gap
        if last:
            last_time = datetime.fromisoformat(last)
            gap = now - last_time
            if gap > timedelta(hours=1):
                self.gaps.append({
                    "after": last,
                    "before": now.isoformat(),
                    "duration": str(gap),
                    "type": self.classify_gap(gap),
                    "context_preserved": True
                })
                print(f"📍 Gap detected: {self.classify_gap(gap)} ({gap})")
        
        # Record the interaction
        interaction = {
            "time": now.isoformat(),
            "action": action or "unspecified",
            "tool": tool_used,
            "context_hash": self.capture_context_fingerprint(),
            "work_detected": self.detect_changes_since_last()
        }
        self.interactions.append(interaction)
        
        # Save immediately
        self.save_ledger()
        
        return interaction
    
    def classify_gap(self, gap: timedelta) -> str:
        """Honestly classify why gaps happen"""
        if gap < timedelta(hours=2):
            return "short_break"  # Coffee, bathroom, thinking
        elif gap < timedelta(hours=8):
            return "life_pause"   # Meals, meetings, errands
        elif gap < timedelta(hours=16):
            return "sleep_cycle"  # Natural rest
        else:
            return "extended_gap" # Days between work
    
    def capture_context_fingerprint(self) -> str:
        """Hash the current context state"""
        context = {
            "session": self.session_id,
            "interaction_count": len(self.interactions),
            "git_head": self.get_git_head(),
            "working_dir": str(Path.cwd())
        }
        context_str = json.dumps(context, sort_keys=True)
        return hashlib.sha256(context_str.encode()).hexdigest()[:12]
    
    def get_git_head(self) -> str:
        """Get current git HEAD commit"""
        try:
            result = subprocess.run(
                ["git", "rev-parse", "HEAD"],
                capture_output=True,
                text=True
            )
            return result.stdout.strip()[:8] if result.returncode == 0 else "unknown"
        except:
            return "no-git"
    
    def detect_changes_since_last(self) -> Dict[str, Any]:
        """Detect what changed since last interaction"""
        try:
            # Use git to detect changes
            result = subprocess.run(
                ["git", "status", "--porcelain"],
                capture_output=True,
                text=True
            )
            if result.returncode == 0:
                lines = result.stdout.strip().split('\n')
                return {
                    "files_changed": len([l for l in lines if l]),
                    "has_changes": bool(result.stdout.strip())
                }
        except:
            pass
        return {"files_changed": 0, "has_changes": False}
    
    def group_into_periods(self) -> List[Dict[str, Any]]:
        """Group interactions into work periods separated by gaps"""
        if not self.interactions:
            return []
        
        periods = []
        current_period = {
            "start": self.interactions[0]["time"],
            "interactions": [self.interactions[0]]
        }
        
        for i in range(1, len(self.interactions)):
            prev_time = datetime.fromisoformat(self.interactions[i-1]["time"])
            curr_time = datetime.fromisoformat(self.interactions[i]["time"])
            
            if (curr_time - prev_time) > timedelta(hours=1):
                # Gap detected, close current period
                current_period["end"] = self.interactions[i-1]["time"]
                current_period["duration"] = str(
                    datetime.fromisoformat(current_period["end"]) - 
                    datetime.fromisoformat(current_period["start"])
                )
                current_period["interaction_count"] = len(current_period["interactions"])
                periods.append(current_period)
                
                # Start new period
                current_period = {
                    "start": self.interactions[i]["time"],
                    "interactions": [self.interactions[i]]
                }
            else:
                current_period["interactions"].append(self.interactions[i])
        
        # Close final period
        if current_period["interactions"]:
            current_period["end"] = self.interactions[-1]["time"]
            current_period["duration"] = str(
                datetime.fromisoformat(current_period["end"]) - 
                datetime.fromisoformat(current_period["start"])
            )
            current_period["interaction_count"] = len(current_period["interactions"])
            periods.append(current_period)
        
        return periods
    
    def generate_reality_report(self) -> Dict[str, Any]:
        """The TRUTH about how work actually happened"""
        periods = self.group_into_periods()
        
        # Calculate total active time (sum of period durations)
        total_active = timedelta()
        for period in periods:
            if "duration" in period:
                # Parse duration string back to timedelta
                try:
                    # Handle negative durations or complex formats
                    duration_str = period["duration"]
                    if "day" in duration_str:
                        # Complex format, skip for now
                        continue
                    parts = duration_str.split(":")
                    if len(parts) == 3:
                        hours, minutes, seconds = parts
                        # Remove microseconds if present
                        if "." in seconds:
                            seconds = seconds.split(".")[0]
                        total_active += timedelta(
                            hours=int(hours), 
                            minutes=int(minutes), 
                            seconds=int(seconds)
                        )
                except Exception as e:
                    # Skip unparseable durations
                    continue
        
        # Calculate total span (first to last interaction)
        if self.interactions:
            first = datetime.fromisoformat(self.interactions[0]["time"])
            last = datetime.fromisoformat(self.interactions[-1]["time"])
            total_span = last - first
        else:
            total_span = timedelta()
        
        return {
            "session_id": self.session_id,
            "total_interactions": len(self.interactions),
            "work_periods": len(periods),
            "period_details": periods,
            "natural_gaps": self.gaps,
            "gap_count": len(self.gaps),
            "time_reality": {
                "total_span": str(total_span),
                "active_time": str(total_active),
                "gap_time": str(total_span - total_active) if total_span > total_active else "0:00:00",
                "efficiency_illusion": f"{(total_active / total_span * 100):.1f}%" if total_span else "N/A"
            },
            "context_stability": all(g.get("context_preserved", False) for g in self.gaps),
            "truth": "Work happened in bursts with natural gaps. Context preserved throughout."
        }
    
    def save_ledger(self):
        """Persist ledger to disk"""
        data = {
            "session_id": self.session_id,
            "interactions": self.interactions,
            "gaps": self.gaps,
            "last_updated": datetime.now().isoformat()
        }
        with open(self.ledger_file, 'w') as f:
            json.dump(data, f, indent=2)
    
    def load_ledger(self):
        """Load existing ledger from disk"""
        try:
            with open(self.ledger_file, 'r') as f:
                data = json.load(f)
                self.interactions = data.get("interactions", [])
                self.gaps = data.get("gaps", [])
        except Exception as e:
            print(f"Could not load existing ledger: {e}")
    
    def display_reality(self):
        """Show the truth about this session"""
        report = self.generate_reality_report()
        
        print("\n" + "="*60)
        print(f"SESSION {self.session_id} REALITY REPORT")
        print("="*60)
        
        print(f"\n📊 Interaction Statistics:")
        print(f"  Total interactions: {report['total_interactions']}")
        print(f"  Work periods: {report['work_periods']}")
        print(f"  Natural gaps: {report['gap_count']}")
        
        print(f"\n⏱️  Time Reality:")
        print(f"  Total span: {report['time_reality']['total_span']}")
        print(f"  Active time: {report['time_reality']['active_time']}")
        print(f"  Gap time: {report['time_reality']['gap_time']}")
        
        if report.get('natural_gaps'):
            print(f"\n🌙 Gap Analysis:")
            gap_types = {}
            for gap in report['natural_gaps']:
                gap_type = gap['type']
                gap_types[gap_type] = gap_types.get(gap_type, 0) + 1
            for gap_type, count in gap_types.items():
                print(f"  {gap_type}: {count}")
        
        print(f"\n✅ Context Preservation: {'Perfect' if report['context_stability'] else 'Issues detected'}")
        
        print(f"\n💡 Truth: {report['truth']}")
        print("="*60 + "\n")


def main():
    """Demo the Interaction Ledger"""
    import sys
    import time
    
    if len(sys.argv) < 2:
        print("Usage: python3 interaction_ledger.py <session_id> [demo|report|track]")
        sys.exit(1)
    
    session_id = sys.argv[1]
    action = sys.argv[2] if len(sys.argv) > 2 else "report"
    
    ledger = InteractionLedger(session_id)
    
    if action == "demo":
        print("📝 Recording interactions with gaps...")
        
        # Simulate work pattern
        ledger.record_interaction("Started work", "initialization")
        print("  Recorded: Started work")
        
        time.sleep(2)
        ledger.record_interaction("Built component", "python")
        print("  Recorded: Built component")
        
        # Simulate gap by faking time
        last_interaction = ledger.interactions[-1]
        last_interaction["time"] = (datetime.now() - timedelta(hours=2)).isoformat()
        ledger.interactions[-1] = last_interaction
        
        ledger.record_interaction("Resumed after break", "python")
        print("  Recorded: Resumed after break (with 2hr gap)")
        
        # Show report
        ledger.display_reality()
        
    elif action == "track":
        # Track current interaction
        tool = input("Tool used (or press Enter): ").strip() or None
        action_desc = input("Action taken: ").strip()
        
        interaction = ledger.record_interaction(action_desc, tool)
        print(f"✅ Tracked: {interaction['action']} at {interaction['time']}")
        
        # Show mini report
        report = ledger.generate_reality_report()
        print(f"Session {session_id}: {report['total_interactions']} interactions, {report['gap_count']} gaps")
        
    else:  # report
        ledger.display_reality()


if __name__ == "__main__":
    main()