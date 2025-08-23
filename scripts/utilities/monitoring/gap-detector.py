#!/usr/bin/env python3
"""
Gap Detector
Automatically identifies differences between Requirements and Reality
"""

import os
import sys
import json
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Tuple
import subprocess

class GapDetector:
    """Reconciliation engine - finds and prioritizes gaps"""
    
    def __init__(self, root_path: str):
        self.root_path = Path(root_path)
        self.requirements_path = self.root_path / "requirements"
        self.reality_path = self.root_path / "reality"
        self.reconciliation_path = self.root_path / "reconciliation"
        
    def scan_for_gaps(self, session: str = "GAP_SCAN") -> Dict[str, Any]:
        """Comprehensive gap detection scan"""
        gaps = {
            "session": session,
            "timestamp": datetime.now().isoformat(),
            "gaps_found": [],
            "summary": {
                "critical": 0,
                "high": 0,
                "medium": 0,
                "low": 0
            }
        }
        
        # Structural gaps
        structural_gaps = self._detect_structural_gaps()
        gaps["gaps_found"].extend(structural_gaps)
        
        # Documentation gaps
        doc_gaps = self._detect_documentation_gaps()
        gaps["gaps_found"].extend(doc_gaps)
        
        # Capability gaps
        capability_gaps = self._detect_capability_gaps()
        gaps["gaps_found"].extend(capability_gaps)
        
        # Process gaps
        process_gaps = self._detect_process_gaps()
        gaps["gaps_found"].extend(process_gaps)
        
        # Calculate summary
        for gap in gaps["gaps_found"]:
            severity = gap.get("severity", "low")
            gaps["summary"][severity] += 1
        
        # Save gaps for reconciliation planning
        self._save_gaps(gaps)
        
        return gaps
    
    def _detect_structural_gaps(self) -> List[Dict[str, Any]]:
        """Find gaps in directory structure"""
        gaps = []
        
        # Check if all required directories exist
        required_structure = {
            "requirements": ["goals", "specifications", "constraints"],
            "reality": ["inventory", "capabilities", "limitations"],
            "reconciliation": ["gap-analysis", "action-plans", "progress-tracking"]
        }
        
        for domain, required_subdirs in required_structure.items():
            domain_path = self.root_path / domain
            
            if not domain_path.exists():
                gaps.append({
                    "type": "structural",
                    "category": "missing_domain",
                    "description": f"Domain directory missing: {domain}",
                    "impact": "System cannot function without core domains",
                    "severity": "critical",
                    "target_state": f"Directory {domain}/ exists",
                    "current_state": f"Directory {domain}/ missing",
                    "suggested_action": f"mkdir {domain}"
                })
                continue
            
            # Check subdirectories
            for subdir in required_subdirs:
                subdir_path = domain_path / subdir
                if not subdir_path.exists():
                    gaps.append({
                        "type": "structural",
                        "category": "missing_subdirectory",
                        "description": f"Required subdirectory missing: {domain}/{subdir}",
                        "impact": f"Domain {domain} incomplete",
                        "severity": "high",
                        "target_state": f"Directory {domain}/{subdir}/ exists",
                        "current_state": f"Directory {domain}/{subdir}/ missing",
                        "suggested_action": f"mkdir {domain}/{subdir}"
                    })
        
        return gaps
    
    def _detect_documentation_gaps(self) -> List[Dict[str, Any]]:
        """Find gaps in documentation"""
        gaps = []
        
        # Essential documentation files
        essential_docs = [
            ("DIRECTORY-MAP-CONSTITUTION.md", "critical", "System governance"),
            ("SYSTEM-INDEX.md", "high", "Navigation and status"),
            ("SESSION-PROTOCOL.md", "high", "Session management"),
            ("requirements/PURPOSE.md", "high", "Requirements domain mission"),
            ("reality/PURPOSE.md", "high", "Reality domain mission"),
            ("reconciliation/PURPOSE.md", "high", "Reconciliation domain mission")
        ]
        
        for doc_path, severity, purpose in essential_docs:
            file_path = self.root_path / doc_path
            
            if not file_path.exists():
                gaps.append({
                    "type": "documentation",
                    "category": "missing_essential_doc",
                    "description": f"Essential documentation missing: {doc_path}",
                    "impact": f"Cannot perform {purpose}",
                    "severity": severity,
                    "target_state": f"File {doc_path} exists and is properly formatted",
                    "current_state": f"File {doc_path} missing",
                    "suggested_action": f"Create {doc_path} using appropriate template"
                })
            else:
                # Check if file is empty or malformed
                try:
                    content = file_path.read_text()
                    if len(content.strip()) < 100:  # Arbitrary minimum length
                        gaps.append({
                            "type": "documentation",
                            "category": "incomplete_doc",
                            "description": f"Documentation appears incomplete: {doc_path}",
                            "impact": f"Reduced effectiveness of {purpose}",
                            "severity": "medium",
                            "target_state": f"File {doc_path} is comprehensive",
                            "current_state": f"File {doc_path} is too brief",
                            "suggested_action": f"Expand content in {doc_path}"
                        })
                except Exception:
                    gaps.append({
                        "type": "documentation",
                        "category": "unreadable_doc",
                        "description": f"Cannot read documentation: {doc_path}",
                        "impact": f"Cannot access {purpose}",
                        "severity": "high",
                        "target_state": f"File {doc_path} is readable",
                        "current_state": f"File {doc_path} has read errors",
                        "suggested_action": f"Fix file permissions or encoding for {doc_path}"
                    })
        
        return gaps
    
    def _detect_capability_gaps(self) -> List[Dict[str, Any]]:
        """Find gaps in system capabilities"""
        gaps = []
        
        # Check if automation tools exist
        automation_tools = [
            ("shared/tools/enforcement/constitution-enforcer.py", "Constitution enforcement"),
            ("shared/tools/auditing/reality-auditor.py", "Reality auditing"),
            ("shared/tools/monitoring/gap-detector.py", "Gap detection")
        ]
        
        for tool_path, capability in automation_tools:
            file_path = self.root_path / tool_path
            
            if not file_path.exists():
                gaps.append({
                    "type": "capability",
                    "category": "missing_automation",
                    "description": f"Automation tool missing: {tool_path}",
                    "impact": f"Cannot automate {capability}",
                    "severity": "high",
                    "target_state": f"Tool {tool_path} exists and is executable",
                    "current_state": f"Tool {tool_path} missing",
                    "suggested_action": f"Create {tool_path}"
                })
            elif not os.access(file_path, os.X_OK):
                gaps.append({
                    "type": "capability",
                    "category": "non_executable_tool",
                    "description": f"Tool not executable: {tool_path}",
                    "impact": f"Cannot run {capability}",
                    "severity": "medium",
                    "target_state": f"Tool {tool_path} is executable",
                    "current_state": f"Tool {tool_path} lacks execute permission",
                    "suggested_action": f"chmod +x {tool_path}"
                })
        
        return gaps
    
    def _detect_process_gaps(self) -> List[Dict[str, Any]]:
        """Find gaps in processes and workflows"""
        gaps = []
        
        # Check if initial reality inventory exists
        current_state_file = self.reality_path / "inventory" / "CURRENT-STATE.md"
        if not current_state_file.exists():
            gaps.append({
                "type": "process",
                "category": "missing_reality_baseline",
                "description": "No current state baseline established",
                "impact": "Cannot measure progress or detect changes",
                "severity": "critical",
                "target_state": "Reality domain has current state inventory",
                "current_state": "No baseline reality documented",
                "suggested_action": "Run reality audit to establish baseline"
            })
        
        # Check if any requirements are defined
        requirements_defined = False
        goals_dir = self.requirements_path / "goals"
        if goals_dir.exists():
            requirements_defined = len(list(goals_dir.glob("*.md"))) > 0
        
        if not requirements_defined:
            gaps.append({
                "type": "process",
                "category": "no_requirements",
                "description": "No requirements or goals defined",
                "impact": "System has no direction or target state",
                "severity": "high",
                "target_state": "At least one requirement or goal defined",
                "current_state": "No requirements documented",
                "suggested_action": "Define first requirement in requirements/goals/"
            })
        
        # Check if reconciliation plans exist
        action_plans_dir = self.reconciliation_path / "action-plans"
        if action_plans_dir.exists():
            plans_exist = len(list(action_plans_dir.glob("*.md"))) > 0
            if not plans_exist and requirements_defined:
                gaps.append({
                    "type": "process",
                    "category": "no_action_plans",
                    "description": "Requirements exist but no action plans",
                    "impact": "No path from current state to target state",
                    "severity": "medium",
                    "target_state": "Action plans exist for defined requirements",
                    "current_state": "Requirements without reconciliation plans",
                    "suggested_action": "Create action plans for defined requirements"
                })
        
        return gaps
    
    def _save_gaps(self, gaps: Dict[str, Any]):
        """Save detected gaps for reconciliation planning"""
        # Ensure gap-analysis directory exists
        gap_dir = self.reconciliation_path / "gap-analysis"
        gap_dir.mkdir(parents=True, exist_ok=True)
        
        # Save gaps with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        gap_file = gap_dir / f"GAPS-{timestamp}.json"
        
        with open(gap_file, "w") as f:
            json.dump(gaps, f, indent=2)
        
        # Create/update current gaps pointer
        current_gaps_file = gap_dir / "CURRENT-GAPS.json"
        with open(current_gaps_file, "w") as f:
            json.dump(gaps, f, indent=2)
    
    def prioritize_gaps(self, gaps: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Sort gaps by priority for reconciliation"""
        severity_order = {"critical": 0, "high": 1, "medium": 2, "low": 3}
        
        return sorted(gaps, key=lambda g: (
            severity_order.get(g.get("severity", "low"), 3),
            g.get("type", "unknown")
        ))
    
    def generate_reconciliation_suggestions(self, gaps: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Generate suggested actions for closing gaps"""
        suggestions = []
        
        for gap in gaps:
            suggestion = {
                "gap_id": f"{gap['type']}_{gap['category']}_{hash(gap['description']) % 10000}",
                "gap": gap,
                "recommended_action": gap.get("suggested_action", "Manual review required"),
                "automation_possible": self._can_automate_fix(gap),
                "estimated_effort": self._estimate_effort(gap),
                "dependencies": self._find_dependencies(gap, gaps)
            }
            suggestions.append(suggestion)
        
        return suggestions
    
    def _can_automate_fix(self, gap: Dict[str, Any]) -> bool:
        """Determine if gap can be automatically fixed"""
        automatable_categories = {
            "missing_subdirectory": True,
            "non_executable_tool": True,
            "missing_domain": True
        }
        
        return automatable_categories.get(gap.get("category"), False)
    
    def _estimate_effort(self, gap: Dict[str, Any]) -> str:
        """Estimate effort required to fix gap"""
        effort_map = {
            "missing_subdirectory": "5 minutes",
            "non_executable_tool": "1 minute",
            "missing_domain": "10 minutes",
            "missing_essential_doc": "30 minutes",
            "incomplete_doc": "20 minutes",
            "missing_automation": "2 hours",
            "missing_reality_baseline": "15 minutes",
            "no_requirements": "1 hour",
            "no_action_plans": "1 hour"
        }
        
        return effort_map.get(gap.get("category"), "Unknown")
    
    def _find_dependencies(self, gap: Dict[str, Any], all_gaps: List[Dict[str, Any]]) -> List[str]:
        """Find dependencies between gaps"""
        dependencies = []
        
        # Simple dependency logic - missing domains block subdirectories
        if gap.get("category") == "missing_subdirectory":
            domain = gap.get("description", "").split("/")[0].split(":")[-1].strip()
            for other_gap in all_gaps:
                if (other_gap.get("category") == "missing_domain" and 
                    domain in other_gap.get("description", "")):
                    dependencies.append(f"Requires: {other_gap['description']}")
        
        return dependencies


def main():
    """Command line interface for gap detector"""
    if len(sys.argv) < 2:
        print("Usage: gap-detector.py <command> [session]")
        print("Commands: scan, prioritize, suggest")
        sys.exit(1)
    
    command = sys.argv[1]
    session = sys.argv[2] if len(sys.argv) > 2 else "CLI_SCAN"
    root_path = os.getcwd()
    
    detector = GapDetector(root_path)
    
    if command == "scan":
        print(f"Scanning for gaps - Session {session}")
        gaps = detector.scan_for_gaps(session)
        
        print(f"\n📊 Gap Analysis Results:")
        print(f"  🔴 Critical: {gaps['summary']['critical']}")
        print(f"  🟠 High: {gaps['summary']['high']}")
        print(f"  🟡 Medium: {gaps['summary']['medium']}")
        print(f"  🟢 Low: {gaps['summary']['low']}")
        print(f"  📋 Total: {len(gaps['gaps_found'])}")
        
        if gaps['gaps_found']:
            print(f"\nTop 5 gaps:")
            prioritized = detector.prioritize_gaps(gaps['gaps_found'])
            for i, gap in enumerate(prioritized[:5], 1):
                print(f"  {i}. [{gap['severity'].upper()}] {gap['description']}")
    
    elif command == "prioritize":
        # Load current gaps and prioritize
        gap_file = Path(root_path) / "reconciliation" / "gap-analysis" / "CURRENT-GAPS.json"
        if gap_file.exists():
            with open(gap_file) as f:
                gap_data = json.load(f)
            
            prioritized = detector.prioritize_gaps(gap_data['gaps_found'])
            print("Prioritized gaps (highest to lowest):")
            for i, gap in enumerate(prioritized, 1):
                print(f"{i:2d}. [{gap['severity'].upper():8s}] {gap['description']}")
        else:
            print("No gaps found. Run 'scan' first.")
    
    elif command == "suggest":
        # Load current gaps and generate suggestions
        gap_file = Path(root_path) / "reconciliation" / "gap-analysis" / "CURRENT-GAPS.json"
        if gap_file.exists():
            with open(gap_file) as f:
                gap_data = json.load(f)
            
            suggestions = detector.generate_reconciliation_suggestions(gap_data['gaps_found'])
            print("Reconciliation suggestions:")
            for suggestion in suggestions[:10]:  # Top 10
                gap = suggestion['gap']
                print(f"\n🎯 {gap['description']}")
                print(f"   Action: {suggestion['recommended_action']}")
                print(f"   Effort: {suggestion['estimated_effort']}")
                print(f"   Auto-fix: {'Yes' if suggestion['automation_possible'] else 'No'}")
        else:
            print("No gaps found. Run 'scan' first.")
    
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)


if __name__ == "__main__":
    main()