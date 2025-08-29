#!/usr/bin/env python3
"""
Session 00068 - Scripts Lifecycle Classification
Analyzes scripts directory and generates lifecycle report
"""

import os
import re
from pathlib import Path
from typing import Dict, List
import json
from datetime import datetime

class ScriptsLifecycleClassifier:
    """Classify scripts by lifecycle status"""
    
    # Classification rules
    CLASSIFICATIONS = {
        "OBSOLETE": {
            "sessions": list(range(44, 56)),  # Sessions 44-55
            "reason": "Session 44-55 database confusion period",
            "patterns": ["migration", "profile-fix", "db-fix"]
        },
        "ON": {
            "sessions": [28, 63, 66, 67, 68],  # Currently active
            "patterns": ["session-start", "yaml", "reference-mapper", "migration-readiness", 
                        "auto-organize", "path-resolver", "fix-yaml", "classify-scripts"],
            "reason": "Currently active tools"
        },
        "OFF": {
            "default": True,
            "reason": "Dormant but contains useful patterns"
        }
    }
    
    def __init__(self, scripts_dir: str = "scripts"):
        self.scripts_dir = Path(scripts_dir)
        self.report = {
            "ON": [],
            "OFF": [],
            "OBSOLETE": [],
            "UNKNOWN": []
        }
        
    def extract_session_number(self, filename: str) -> int:
        """Extract session number from filename"""
        match = re.match(r'00(\d+)-', filename)
        if match:
            return int(match.group(1))
        return -1
    
    def classify_script(self, script_path: Path) -> tuple:
        """
        Classify a single script
        Returns: (lifecycle, reason)
        """
        filename = script_path.name
        session = self.extract_session_number(filename)
        
        # Check for OBSOLETE sessions
        if session in self.CLASSIFICATIONS["OBSOLETE"]["sessions"]:
            return "OBSOLETE", self.CLASSIFICATIONS["OBSOLETE"]["reason"]
        
        # Check for OBSOLETE patterns
        for pattern in self.CLASSIFICATIONS["OBSOLETE"]["patterns"]:
            if pattern in filename.lower() and session in range(44, 56):
                return "OBSOLETE", f"Session {session} + pattern '{pattern}'"
        
        # Check for ON sessions
        if session in self.CLASSIFICATIONS["ON"]["sessions"]:
            return "ON", self.CLASSIFICATIONS["ON"]["reason"]
        
        # Check for ON patterns
        for pattern in self.CLASSIFICATIONS["ON"]["patterns"]:
            if pattern in filename.lower():
                return "ON", f"Active pattern: '{pattern}'"
        
        # Default to OFF for known session scripts
        if session > 0:
            return "OFF", self.CLASSIFICATIONS["OFF"]["reason"]
        
        # Unknown (non-session scripts)
        return "UNKNOWN", "Non-session script"
    
    def analyze_directory(self) -> Dict:
        """Analyze all scripts in directory"""
        py_files = list(self.scripts_dir.glob("00*.py"))
        sh_files = list(self.scripts_dir.glob("00*.sh"))
        all_scripts = py_files + sh_files
        
        for script in all_scripts:
            lifecycle, reason = self.classify_script(script)
            
            script_info = {
                "file": script.name,
                "session": self.extract_session_number(script.name),
                "reason": reason,
                "type": script.suffix[1:]  # py or sh
            }
            
            if lifecycle == "OBSOLETE":
                self.report["OBSOLETE"].append(script_info)
            elif lifecycle == "ON":
                self.report["ON"].append(script_info)
            elif lifecycle == "OFF":
                self.report["OFF"].append(script_info)
            else:
                self.report["UNKNOWN"].append(script_info)
        
        # Sort by session number
        for category in self.report:
            self.report[category].sort(key=lambda x: x["session"])
        
        return self.report
    
    def generate_report(self) -> str:
        """Generate human-readable report"""
        lines = []
        lines.append("=" * 60)
        lines.append("SCRIPTS LIFECYCLE CLASSIFICATION REPORT")
        lines.append(f"Generated: {datetime.now().isoformat()}")
        lines.append("=" * 60)
        lines.append("")
        
        # Summary
        lines.append("📊 SUMMARY")
        lines.append("-" * 40)
        total = sum(len(self.report[cat]) for cat in self.report)
        lines.append(f"Total scripts analyzed: {total}")
        lines.append(f"  ON (Active):        {len(self.report['ON'])} scripts")
        lines.append(f"  OFF (Dormant):      {len(self.report['OFF'])} scripts")
        lines.append(f"  OBSOLETE:           {len(self.report['OBSOLETE'])} scripts")
        lines.append(f"  UNKNOWN:            {len(self.report['UNKNOWN'])} scripts")
        lines.append("")
        
        # Details by category
        categories = [
            ("🟢 ON - CURRENTLY ACTIVE", "ON"),
            ("🟡 OFF - DORMANT BUT USEFUL", "OFF"),
            ("🔴 OBSOLETE - DATABASE CONFUSION PERIOD", "OBSOLETE"),
            ("⚪ UNKNOWN - NON-SESSION SCRIPTS", "UNKNOWN")
        ]
        
        for title, key in categories:
            if self.report[key]:
                lines.append(title)
                lines.append("-" * 40)
                
                # Group by session
                by_session = {}
                for script in self.report[key]:
                    session = script['session']
                    if session not in by_session:
                        by_session[session] = []
                    by_session[session].append(script)
                
                for session in sorted(by_session.keys()):
                    if session > 0:
                        lines.append(f"\nSession {session:02d}:")
                    else:
                        lines.append(f"\nNon-session scripts:")
                    
                    for script in by_session[session]:
                        lines.append(f"  • {script['file']}")
                        if script['reason'] and script['reason'] != self.CLASSIFICATIONS.get(key, {}).get('reason'):
                            lines.append(f"    Reason: {script['reason']}")
                lines.append("")
        
        # Recommendations
        lines.append("📋 RECOMMENDATIONS")
        lines.append("-" * 40)
        lines.append("1. OBSOLETE scripts can be moved to archive/legacy-scripts/")
        lines.append(f"   Found {len(self.report['OBSOLETE'])} obsolete scripts from Sessions 44-55")
        lines.append("")
        lines.append("2. ON scripts should have clear documentation")
        lines.append(f"   {len(self.report['ON'])} active scripts need maintenance")
        lines.append("")
        lines.append("3. OFF scripts could be reviewed for reactivation")
        lines.append(f"   {len(self.report['OFF'])} dormant scripts may have value")
        lines.append("")
        
        return "\n".join(lines)
    
    def save_report(self, output_dir: str = ".") -> tuple:
        """Save report as both JSON and text"""
        timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
        
        # Save JSON
        json_file = Path(output_dir) / f"scripts-lifecycle-{timestamp}.json"
        with open(json_file, 'w') as f:
            json.dump({
                "timestamp": datetime.now().isoformat(),
                "report": self.report,
                "summary": {
                    "total": sum(len(self.report[cat]) for cat in self.report),
                    "on": len(self.report["ON"]),
                    "off": len(self.report["OFF"]),
                    "obsolete": len(self.report["OBSOLETE"]),
                    "unknown": len(self.report["UNKNOWN"])
                }
            }, f, indent=2)
        
        # Save text report
        text_file = Path(output_dir) / f"scripts-lifecycle-{timestamp}.txt"
        with open(text_file, 'w') as f:
            f.write(self.generate_report())
        
        return json_file, text_file


def main():
    """Main execution"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Classify scripts by lifecycle')
    parser.add_argument('--dir', default='scripts', help='Scripts directory to analyze')
    parser.add_argument('--save', action='store_true', help='Save report to files')
    parser.add_argument('--json', action='store_true', help='Output JSON instead of text')
    
    args = parser.parse_args()
    
    classifier = ScriptsLifecycleClassifier(args.dir)
    report = classifier.analyze_directory()
    
    if args.json:
        print(json.dumps(report, indent=2))
    elif args.save:
        json_file, text_file = classifier.save_report()
        print(f"✅ Reports saved:")
        print(f"   JSON: {json_file}")
        print(f"   Text: {text_file}")
    else:
        print(classifier.generate_report())


if __name__ == "__main__":
    main()