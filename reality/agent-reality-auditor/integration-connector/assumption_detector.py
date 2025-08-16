#!/usr/bin/env python3
"""
Assumption Reality Detector - Prevents Reality Forks
Session 00005 Enhancement: Based on real incident where Session 00006 was almost created
Implements Desktop's essential recommendations
"""

import json
import re
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Tuple
import hashlib


class AssumptionDetector:
    """Detect when assumptions create false realities"""
    
    def __init__(self):
        self.assumption_patterns = {
            "temporal_displacement": {
                "pattern": r"(?:next|future|later|upcoming)\s+session",
                "example": "Dashboard assumed for Session 00006",
                "reality": "Work was for current session",
                "impact": "Ghost session creation",
                "severity": "CRITICAL"
            },
            "implicit_assignment": {
                "pattern": r"(?:someone|they|another session|eventually)",
                "example": "'Enhancements' assumed to mean 'future'",
                "reality": "Current session should implement",
                "impact": "Work deferral",
                "severity": "HIGH"
            },
            "reality_forking": {
                "pattern": r"(?:probably|might|should|could|maybe|perhaps)",
                "example": "When to implement suggestions",
                "reality": "Need explicit protocol",
                "impact": "Parallel realities emerge",
                "severity": "MEDIUM"
            },
            "ghost_references": {
                "pattern": r"Session\s+\d{3,5}(?!\d)",
                "example": "Session 00006 (doesn't exist)",
                "reality": "Only reference existing sessions",
                "impact": "Ghost session creation",
                "severity": "CRITICAL"
            }
        }
        
        # Track assumptions made
        self.assumption_log = []
        self.ghost_sessions = set()
        self.reality_forks = []
        
    def detect_assumptions(self, text: str, current_session: str) -> List[Dict[str, Any]]:
        """Detect assumptions in text that could create reality forks"""
        assumptions = []
        
        for assumption_type, config in self.assumption_patterns.items():
            matches = re.finditer(config["pattern"], text, re.IGNORECASE)
            for match in matches:
                assumption = {
                    "type": assumption_type,
                    "text": match.group(),
                    "position": match.span(),
                    "pattern": config["pattern"],
                    "example": config["example"],
                    "reality": config["reality"],
                    "impact": config["impact"],
                    "severity": config["severity"],
                    "detected_at": datetime.now().isoformat(),
                    "session": current_session
                }
                assumptions.append(assumption)
                self.assumption_log.append(assumption)
        
        return assumptions
    
    def detect_ghost_sessions(self, text: str, current_session: int) -> List[Dict[str, Any]]:
        """Detect references to non-existent future sessions"""
        ghost_sessions = []
        
        # Find all session references
        session_pattern = r"Session\s+(\d{3,5})"
        matches = re.finditer(session_pattern, text, re.IGNORECASE)
        
        for match in matches:
            session_num = int(match.group(1))
            
            # Check if this is a future session
            if session_num > current_session:
                ghost = {
                    "session_number": session_num,
                    "reference": match.group(),
                    "position": match.span(),
                    "current_session": current_session,
                    "sessions_ahead": session_num - current_session,
                    "severity": "CRITICAL",
                    "risk": "Creating artifacts for non-existent session",
                    "detected_at": datetime.now().isoformat()
                }
                ghost_sessions.append(ghost)
                self.ghost_sessions.add(session_num)
        
        return ghost_sessions
    
    def detect_reality_forks(self, conversation: str) -> List[Dict[str, Any]]:
        """Detect potential reality forks in conversation"""
        fork_risks = []
        
        # High risk phrases that indicate assumption-based forks
        risk_phrases = {
            "probably means": {"risk": "HIGH", "fork_type": "interpretation"},
            "I assume": {"risk": "CRITICAL", "fork_type": "explicit_assumption"},
            "likely for next": {"risk": "HIGH", "fork_type": "temporal"},
            "future session might": {"risk": "CRITICAL", "fork_type": "ghost_session"},
            "someone should": {"risk": "MEDIUM", "fork_type": "ownership"},
            "maybe later": {"risk": "MEDIUM", "fork_type": "deferral"},
            "could be interpreted": {"risk": "HIGH", "fork_type": "ambiguity"}
        }
        
        for phrase, config in risk_phrases.items():
            if phrase.lower() in conversation.lower():
                fork = {
                    "phrase": phrase,
                    "risk_level": config["risk"],
                    "fork_type": config["fork_type"],
                    "prevention": "Require explicit clarification",
                    "found_in": conversation[max(0, conversation.lower().index(phrase) - 50):
                                           conversation.lower().index(phrase) + 50],
                    "detected_at": datetime.now().isoformat()
                }
                fork_risks.append(fork)
                self.reality_forks.append(fork)
        
        return fork_risks
    
    def calculate_assumption_clarity_score(self) -> Tuple[float, Dict[str, Any]]:
        """Calculate how well we avoid assumption-based confusion"""
        
        metrics = {
            "ghost_sessions_created": len(self.ghost_sessions),
            "work_deferrals": sum(1 for a in self.assumption_log 
                                 if a["type"] == "implicit_assignment"),
            "clarifications_needed": sum(1 for a in self.assumption_log 
                                        if "clarif" in a.get("resolution", "").lower()),
            "assumptions_logged": len(self.assumption_log),
            "reality_forks_detected": len(self.reality_forks)
        }
        
        # Perfect score: No ghost sessions, no deferrals, no clarifications needed
        clarity_score = 1.0
        clarity_score -= (metrics["ghost_sessions_created"] * 0.2)
        clarity_score -= (metrics["work_deferrals"] * 0.1)
        clarity_score -= (metrics["clarifications_needed"] * 0.05)
        clarity_score += (metrics["assumptions_logged"] * 0.01)  # Small bonus for logging
        clarity_score -= (metrics["reality_forks_detected"] * 0.1)
        
        # Clamp between 0 and 1
        clarity_score = max(0, min(1, clarity_score))
        
        return clarity_score, metrics
    
    def log_assumption_resolution(self, assumption_id: str, resolution: str) -> None:
        """Log how an assumption was resolved"""
        for assumption in self.assumption_log:
            if assumption.get("id") == assumption_id:
                assumption["resolution"] = resolution
                assumption["resolved_at"] = datetime.now().isoformat()
                break
    
    def generate_assumption_report(self) -> str:
        """Generate a report of all detected assumptions"""
        report = []
        report.append("=" * 60)
        report.append("ASSUMPTION DETECTION REPORT")
        report.append("=" * 60)
        report.append("")
        
        # Calculate clarity score
        clarity_score, metrics = self.calculate_assumption_clarity_score()
        
        report.append(f"Assumption Clarity Score: {clarity_score:.1%}")
        report.append("")
        
        # Metrics breakdown
        report.append("Metrics:")
        report.append(f"  Ghost Sessions Created: {metrics['ghost_sessions_created']}")
        report.append(f"  Work Deferrals: {metrics['work_deferrals']}")
        report.append(f"  Clarifications Needed: {metrics['clarifications_needed']}")
        report.append(f"  Assumptions Logged: {metrics['assumptions_logged']}")
        report.append(f"  Reality Forks Detected: {metrics['reality_forks_detected']}")
        report.append("")
        
        # Ghost sessions
        if self.ghost_sessions:
            report.append("⚠️  Ghost Sessions Detected:")
            for session in sorted(self.ghost_sessions):
                report.append(f"  - Session {session:05d} (does not exist)")
        else:
            report.append("✅ No ghost sessions detected")
        
        report.append("")
        
        # Reality forks
        if self.reality_forks:
            report.append("🔀 Reality Fork Risks:")
            for fork in self.reality_forks[:5]:  # Show first 5
                report.append(f"  - {fork['fork_type']}: \"{fork['phrase']}\" [{fork['risk_level']}]")
        else:
            report.append("✅ No reality fork risks detected")
        
        report.append("")
        
        # Assumptions by severity
        critical = [a for a in self.assumption_log if a.get("severity") == "CRITICAL"]
        high = [a for a in self.assumption_log if a.get("severity") == "HIGH"]
        medium = [a for a in self.assumption_log if a.get("severity") == "MEDIUM"]
        
        if critical:
            report.append(f"🔴 Critical Assumptions: {len(critical)}")
            for assumption in critical[:3]:
                report.append(f"  - {assumption['type']}: {assumption.get('impact', 'Unknown impact')}")
        
        if high:
            report.append(f"🟠 High Risk Assumptions: {len(high)}")
        
        if medium:
            report.append(f"🟡 Medium Risk Assumptions: {len(medium)}")
        
        report.append("")
        report.append("=" * 60)
        
        return "\n".join(report)
    
    def prevent_ghost_session(self, session_number: int, current_session: int) -> Dict[str, Any]:
        """Prevent creation of ghost session artifacts"""
        if session_number > current_session:
            return {
                "prevented": True,
                "session": session_number,
                "current": current_session,
                "action": "BLOCKED",
                "reason": f"Cannot create artifacts for non-existent Session {session_number:05d}",
                "recommendation": f"Use current Session {current_session:05d} instead",
                "severity": "CRITICAL"
            }
        return {
            "prevented": False,
            "session": session_number,
            "action": "ALLOWED",
            "reason": "Session exists"
        }


class AssumptionRealityAgent:
    """Detect assumption-based reality forks in session work"""
    
    def __init__(self):
        self.detector = AssumptionDetector()
        
    def analyze_session(self, session_log: str, session_number: int) -> Dict[str, Any]:
        """Analyze a session for assumption-based issues"""
        
        # Detect assumptions
        assumptions = self.detector.detect_assumptions(session_log, f"{session_number:05d}")
        
        # Detect ghost sessions
        ghosts = self.detector.detect_ghost_sessions(session_log, session_number)
        
        # Detect reality forks
        forks = self.detector.detect_reality_forks(session_log)
        
        # Calculate clarity score
        clarity_score, metrics = self.detector.calculate_assumption_clarity_score()
        
        return {
            "session": session_number,
            "timestamp": datetime.now().isoformat(),
            "assumption_clarity_score": clarity_score,
            "metrics": metrics,
            "assumptions_found": len(assumptions),
            "ghost_sessions": len(ghosts),
            "reality_forks": len(forks),
            "severity_breakdown": {
                "critical": sum(1 for a in assumptions if a.get("severity") == "CRITICAL"),
                "high": sum(1 for a in assumptions if a.get("severity") == "HIGH"),
                "medium": sum(1 for a in assumptions if a.get("severity") == "MEDIUM")
            },
            "details": {
                "assumptions": assumptions[:10],  # First 10
                "ghosts": ghosts,
                "forks": forks[:5]  # First 5
            }
        }


def test_session_00005_incident():
    """Test the actual Session 00005 incident"""
    
    # The actual conversation that created the assumption
    conversation = """
    Desktop offers enhancements for the Reality Dashboard.
    These suggestions include creating a dashboard, alerting system, and playbooks.
    
    Session 00005 response: I'll implement these in Session 00006.
    Creating SESSION-00006-SUMMARY.md for the dashboard work.
    Session 00006 will build the Reality Domain Dashboard.
    """
    
    # Create detector
    agent = AssumptionRealityAgent()
    
    # Analyze
    analysis = agent.analyze_session(conversation, 5)
    
    print("Session 00005 Incident Analysis:")
    print("-" * 40)
    print(f"Assumption Clarity Score: {analysis['assumption_clarity_score']:.1%}")
    print(f"Ghost Sessions Detected: {analysis['ghost_sessions']}")
    print(f"Reality Forks: {analysis['reality_forks']}")
    
    # Generate report
    print("\n" + agent.detector.generate_assumption_report())
    
    # Test prevention
    prevention = agent.detector.prevent_ghost_session(6, 5)
    print("\nGhost Session Prevention Test:")
    print(f"  Action: {prevention['action']}")
    print(f"  Reason: {prevention['reason']}")
    print(f"  Recommendation: {prevention.get('recommendation', 'N/A')}")


if __name__ == "__main__":
    print("ASSUMPTION DETECTOR - Session 00005 Enhancement")
    print("=" * 60)
    print()
    test_session_00005_incident()