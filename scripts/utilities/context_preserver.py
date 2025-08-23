#!/usr/bin/env python3
"""
Context Preserver - Maintain perfect session context across any time gap
Created in response to Session 00003B's Time Reality Discovery
"""

import json
import os
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, Any, Optional

class ContextPreserver:
    """
    Preserve session context across time gaps.
    Time stops between interactions, but context remains perfect.
    """
    
    def __init__(self, session_id: str):
        self.session_id = session_id
        self.context_dir = Path("archive/sessions/.context")
        self.context_dir.mkdir(parents=True, exist_ok=True)
        self.context_file = self.context_dir / f"SESSION-{session_id}-CONTEXT.json"
        
    def save_context(self, 
                    mission: str,
                    progress: Dict[str, Any],
                    next_steps: list,
                    key_decisions: list,
                    custom_data: Optional[Dict] = None) -> bool:
        """
        Freeze session context at current moment.
        Can be restored perfectly after any time gap.
        """
        context = {
            "session_id": self.session_id,
            "mission": mission,
            "progress": progress,
            "next_steps": next_steps,
            "key_decisions": key_decisions,
            "frozen_at": datetime.now().isoformat(),
            "custom_data": custom_data or {}
        }
        
        try:
            with open(self.context_file, 'w') as f:
                json.dump(context, f, indent=2, default=str)
            
            print(f"✅ Context saved for Session {self.session_id}")
            print(f"   Mission: {mission}")
            print(f"   Progress: {progress.get('percentage', 'unknown')}%")
            return True
            
        except Exception as e:
            print(f"❌ Failed to save context: {e}")
            return False
    
    def restore_context(self) -> Optional[Dict[str, Any]]:
        """
        Restore session context after any time gap.
        Time may have passed, but context remains perfect.
        """
        if not self.context_file.exists():
            print(f"⚠️  No saved context for Session {self.session_id}")
            return None
        
        try:
            with open(self.context_file, 'r') as f:
                context = json.load(f)
            
            # Calculate gap (for awareness, not judgment)
            frozen_time = datetime.fromisoformat(context['frozen_at'])
            gap = datetime.now() - frozen_time
            
            # Acknowledge the gap without making it problematic
            self._acknowledge_gap(gap)
            
            # Display restored context
            print(f"\n{'='*60}")
            print(f"SESSION {self.session_id} CONTEXT RESTORED")
            print(f"{'='*60}")
            print(f"Mission: {context['mission']}")
            print(f"Progress: {context['progress']}")
            print(f"\nNext Steps:")
            for i, step in enumerate(context['next_steps'], 1):
                print(f"  {i}. {step}")
            
            print(f"\nKey Decisions Made:")
            for decision in context['key_decisions']:
                print(f"  • {decision}")
            
            print(f"{'='*60}\n")
            
            return context
            
        except Exception as e:
            print(f"❌ Failed to restore context: {e}")
            return None
    
    def _acknowledge_gap(self, gap: timedelta):
        """
        Acknowledge time gap without treating it as failure.
        Gaps are natural in human-AI collaboration.
        """
        if gap.total_seconds() < 300:  # Less than 5 minutes
            print(f"📍 Resuming after brief {int(gap.total_seconds())} second pause")
        elif gap.total_seconds() < 3600:  # Less than 1 hour
            minutes = int(gap.total_seconds() / 60)
            print(f"📍 Resuming after {minutes} minute break")
        elif gap.total_seconds() < 86400:  # Less than 1 day
            hours = int(gap.total_seconds() / 3600)
            print(f"📍 Resuming after {hours} hour gap (natural break)")
        else:  # More than a day
            days = int(gap.total_seconds() / 86400)
            print(f"📍 Resuming after {days} day gap (life happened)")
        
        print("   Context preserved perfectly across the gap ✓")
    
    def update_progress(self, progress_update: Dict[str, Any]):
        """Update progress without losing context"""
        context = self.restore_context()
        if context:
            context['progress'].update(progress_update)
            context['last_updated'] = datetime.now().isoformat()
            
            with open(self.context_file, 'w') as f:
                json.dump(context, f, indent=2, default=str)
            
            print(f"✅ Progress updated for Session {self.session_id}")
    
    def add_decision(self, decision: str, rationale: str):
        """Add key decision to context"""
        context = self.restore_context()
        if context:
            decision_entry = f"{decision} - Rationale: {rationale}"
            context['key_decisions'].append(decision_entry)
            
            with open(self.context_file, 'w') as f:
                json.dump(context, f, indent=2, default=str)
            
            print(f"✅ Decision logged: {decision}")
    
    def get_mission_status(self) -> str:
        """Get current mission status regardless of time gaps"""
        context = self.restore_context()
        if not context:
            return "No mission defined"
        
        return f"Mission: {context['mission']} | Progress: {context['progress']}"


class InteractionLogger:
    """
    Log interactions when they happen, not fake continuous time.
    Acknowledges gaps naturally.
    """
    
    def __init__(self, session_id: str):
        self.session_id = session_id
        self.log_file = Path(f"archive/sessions/SESSION-{session_id}-INTERACTIONS.md")
        self.last_interaction_file = Path(f"archive/sessions/.last/SESSION-{session_id}-LAST")
        self.last_interaction_file.parent.mkdir(parents=True, exist_ok=True)
        
        # Initialize log if new
        if not self.log_file.exists():
            self._initialize_log()
    
    def _initialize_log(self):
        """Create interaction log with reality-based header"""
        with open(self.log_file, 'w') as f:
            f.write(f"# Session {self.session_id} Interaction Log\n")
            f.write(f"**Started**: {datetime.now().strftime('%Y-%m-%d %H:%M')}\n")
            f.write(f"**Type**: INTERACTION-BASED (Time gaps are natural)\n\n")
            f.write("## Interactions\n\n")
            f.write("*Time only advances during interactions. Gaps are invisible pauses.*\n\n")
    
    def log_interaction(self, work_done: str, category: str = "work"):
        """Log an interaction, acknowledging any gap since last"""
        now = datetime.now()
        
        # Check for gap since last interaction
        last_time = self._get_last_interaction_time()
        if last_time:
            gap = now - last_time
            if gap.total_seconds() > 7200:  # More than 2 hours
                self._acknowledge_gap(gap)
        
        # Log the interaction
        timestamp = now.strftime("%H:%M:%S")
        with open(self.log_file, 'a') as f:
            f.write(f"**[{timestamp}]** [{category}] {work_done}\n")
        
        # Update last interaction time
        self._save_last_interaction_time(now)
        
        print(f"📝 Logged: [{category}] {work_done}")
    
    def _acknowledge_gap(self, gap: timedelta):
        """Note gaps in log without treating them as problems"""
        with open(self.log_file, 'a') as f:
            if gap.total_seconds() < 86400:  # Less than a day
                hours = int(gap.total_seconds() / 3600)
                f.write(f"\n*[Session resumed after {hours}h break - context preserved]*\n\n")
            else:
                days = int(gap.total_seconds() / 86400)
                f.write(f"\n*[Session resumed after {days} day gap - mission continues]*\n\n")
    
    def _get_last_interaction_time(self) -> Optional[datetime]:
        """Get timestamp of last interaction"""
        if self.last_interaction_file.exists():
            with open(self.last_interaction_file, 'r') as f:
                timestamp_str = f.read().strip()
                return datetime.fromisoformat(timestamp_str)
        return None
    
    def _save_last_interaction_time(self, timestamp: datetime):
        """Save timestamp of current interaction"""
        with open(self.last_interaction_file, 'w') as f:
            f.write(timestamp.isoformat())


def main():
    """Demo: Show how context preservation works across gaps"""
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python3 context_preserver.py <session_id> [save|restore|demo]")
        sys.exit(1)
    
    session_id = sys.argv[1]
    action = sys.argv[2] if len(sys.argv) > 2 else "demo"
    
    cp = ContextPreserver(session_id)
    logger = InteractionLogger(session_id)
    
    if action == "save":
        # Save current context
        cp.save_context(
            mission="Implement Reality-Based Session Management",
            progress={"percentage": 60, "components": ["spec", "tools"], "remaining": ["testing"]},
            next_steps=["Test context preservation", "Update Constitution", "Deploy tools"],
            key_decisions=["Sessions are context containers", "Time gaps are natural"],
            custom_data={"reality_discovered": True}
        )
        logger.log_interaction("Saved session context for later resumption", "meta")
        
    elif action == "restore":
        # Restore saved context
        context = cp.restore_context()
        if context:
            logger.log_interaction("Resumed session with perfect context", "meta")
            
    elif action == "demo":
        # Demonstrate the concept
        print("\n" + "="*60)
        print("CONTEXT PRESERVATION DEMONSTRATION")
        print("="*60)
        print("\nSaving context before gap...")
        cp.save_context(
            mission="Complete Reality Agents Implementation",
            progress={"percentage": 75, "agents": 3, "remaining": 1},
            next_steps=["Implement monitoring agent", "Test integration", "Deploy"],
            key_decisions=["Use progressive discovery", "Pattern reuse across agents"]
        )
        
        print("\n[Simulating 8 hour gap - you sleep, eat, live life]")
        print("[Time stops in our interaction model]")
        print("[Context remains perfectly preserved]")
        
        print("\nRestoring context after gap...")
        context = cp.restore_context()
        
        logger.log_interaction("Demonstrated context preservation across time gap", "demo")


if __name__ == "__main__":
    main()