#!/usr/bin/env python3
"""
System Guardian
Master automation coordinator for the Personal Operating System
Orchestrates constitution enforcement, reality auditing, and gap detection
"""

import os
import sys
import json
import subprocess
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any

class SystemGuardian:
    """Master controller for all automated systems"""
    
    def __init__(self, root_path: str):
        self.root_path = Path(root_path)
        self.tools_path = self.root_path / "shared" / "tools"
        self.constitution_enforcer = self.tools_path / "enforcement" / "constitution-enforcer.py"
        self.reality_auditor = self.tools_path / "auditing" / "reality-auditor.py"
        self.gap_detector = self.tools_path / "monitoring" / "gap-detector.py"
        
    def full_system_check(self, session: str = "SYSTEM_CHECK") -> Dict[str, Any]:
        """Run comprehensive system health check"""
        report = {
            "session": session,
            "timestamp": datetime.now().isoformat(),
            "checks": {},
            "overall_health": "unknown",
            "critical_issues": [],
            "recommendations": []
        }
        
        print(f"🔍 Running full system check - Session {session}")
        
        # 1. Constitution compliance check
        print("  📜 Checking constitutional compliance...")
        constitution_result = self._run_constitution_check(session)
        report["checks"]["constitution"] = constitution_result
        
        # 2. Reality audit
        print("  🔍 Auditing reality state...")
        reality_result = self._run_reality_audit(session)
        report["checks"]["reality"] = reality_result
        
        # 3. Gap detection
        print("  📊 Detecting gaps...")
        gap_result = self._run_gap_detection(session)
        report["checks"]["gaps"] = gap_result
        
        # 4. Calculate overall health
        report["overall_health"] = self._calculate_overall_health(report["checks"])
        
        # 5. Generate recommendations
        report["recommendations"] = self._generate_recommendations(report["checks"])
        
        # 6. Identify critical issues
        report["critical_issues"] = self._identify_critical_issues(report["checks"])
        
        # Save report
        self._save_system_report(report)
        
        return report
    
    def _run_constitution_check(self, session: str) -> Dict[str, Any]:
        """Run constitution compliance check"""
        try:
            result = subprocess.run([
                "python3", str(self.constitution_enforcer), "audit", session
            ], capture_output=True, text=True, cwd=str(self.root_path))
            
            return {
                "success": result.returncode == 0,
                "violations": self._parse_constitution_output(result.stderr),
                "compliant": result.returncode == 0,
                "output": result.stderr
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "compliant": False
            }
    
    def _run_reality_audit(self, session: str) -> Dict[str, Any]:
        """Run reality domain audit"""
        try:
            result = subprocess.run([
                "python3", str(self.reality_auditor), "audit", session
            ], capture_output=True, text=True, cwd=str(self.root_path))
            
            # Get health score
            health_result = subprocess.run([
                "python3", str(self.reality_auditor), "health"
            ], capture_output=True, text=True, cwd=str(self.root_path))
            
            return {
                "success": result.returncode == 0,
                "health_score": self._parse_health_score(health_result.stdout),
                "output": result.stdout,
                "audit_completed": True
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "audit_completed": False
            }
    
    def _run_gap_detection(self, session: str) -> Dict[str, Any]:
        """Run gap detection scan"""
        try:
            result = subprocess.run([
                "python3", str(self.gap_detector), "scan", session
            ], capture_output=True, text=True, cwd=str(self.root_path))
            
            # Parse gap summary from output
            gap_summary = self._parse_gap_output(result.stdout)
            
            return {
                "success": result.returncode == 0,
                "gaps_found": gap_summary,
                "output": result.stdout
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "gaps_found": {}
            }
    
    def _parse_constitution_output(self, output: str) -> List[str]:
        """Parse constitution violations from output"""
        violations = []
        lines = output.split('\n')
        in_violations = False
        
        for line in lines:
            if "Violations Found:" in line:
                in_violations = True
                continue
            elif in_violations and line.strip().startswith("- "):
                violations.append(line.strip()[2:])
        
        return violations
    
    def _parse_health_score(self, output: str) -> float:
        """Parse health score from reality auditor output"""
        for line in output.split('\n'):
            if "Health Score:" in line:
                try:
                    score_str = line.split(':')[1].split('/')[0].strip()
                    return float(score_str)
                except:
                    pass
        return 0.0
    
    def _parse_gap_output(self, output: str) -> Dict[str, int]:
        """Parse gap summary from output"""
        summary = {"critical": 0, "high": 0, "medium": 0, "low": 0}
        
        for line in output.split('\n'):
            for severity in summary.keys():
                if f"{severity.title()}:" in line:
                    try:
                        count = int(line.split(':')[1].strip())
                        summary[severity] = count
                    except:
                        pass
        
        return summary
    
    def _calculate_overall_health(self, checks: Dict[str, Any]) -> str:
        """Calculate overall system health"""
        score = 100
        
        # Constitution compliance (40% weight)
        if not checks.get("constitution", {}).get("compliant", False):
            violations = len(checks.get("constitution", {}).get("violations", []))
            score -= min(40, violations * 8)  # 8 points per violation, max 40
        
        # Reality health (30% weight)
        reality_score = checks.get("reality", {}).get("health_score", 0)
        score -= (100 - reality_score) * 0.3
        
        # Gap severity (30% weight)
        gaps = checks.get("gaps", {}).get("gaps_found", {})
        gap_penalty = (gaps.get("critical", 0) * 15 + 
                      gaps.get("high", 0) * 8 + 
                      gaps.get("medium", 0) * 3 + 
                      gaps.get("low", 0) * 1)
        score -= min(30, gap_penalty)
        
        score = max(0, score)
        
        if score >= 90:
            return "excellent"
        elif score >= 75:
            return "good"
        elif score >= 50:
            return "fair"
        elif score >= 25:
            return "poor"
        else:
            return "critical"
    
    def _generate_recommendations(self, checks: Dict[str, Any]) -> List[str]:
        """Generate actionable recommendations"""
        recommendations = []
        
        # Constitution violations
        violations = checks.get("constitution", {}).get("violations", [])
        if violations:
            recommendations.append(f"Fix {len(violations)} constitutional violations")
            recommendations.append("Run: python3 shared/tools/enforcement/constitution-enforcer.py audit")
        
        # Reality health
        health_score = checks.get("reality", {}).get("health_score", 100)
        if health_score < 80:
            recommendations.append("Improve reality domain health")
            recommendations.append("Run: python3 shared/tools/auditing/reality-auditor.py health")
        
        # Critical gaps
        gaps = checks.get("gaps", {}).get("gaps_found", {})
        if gaps.get("critical", 0) > 0:
            recommendations.append(f"Address {gaps['critical']} critical gaps immediately")
        if gaps.get("high", 0) > 0:
            recommendations.append(f"Plan resolution for {gaps['high']} high-priority gaps")
        
        if not recommendations:
            recommendations.append("System is healthy - continue regular monitoring")
        
        return recommendations
    
    def _identify_critical_issues(self, checks: Dict[str, Any]) -> List[str]:
        """Identify issues that prevent system operation"""
        critical_issues = []
        
        # Critical constitutional violations
        violations = checks.get("constitution", {}).get("violations", [])
        for violation in violations:
            if "MISSING_DOMAIN" in violation or "UNAUTHORIZED_DIRECTORY" in violation:
                critical_issues.append(f"Constitutional: {violation}")
        
        # Critical gaps
        gaps = checks.get("gaps", {}).get("gaps_found", {})
        if gaps.get("critical", 0) > 0:
            critical_issues.append(f"Critical gaps detected: {gaps['critical']}")
        
        # Very low reality health
        health_score = checks.get("reality", {}).get("health_score", 100)
        if health_score < 30:
            critical_issues.append(f"Reality domain critically unhealthy: {health_score}/100")
        
        return critical_issues
    
    def _save_system_report(self, report: Dict[str, Any]):
        """Save system health report"""
        # Ensure monitoring directory exists
        monitoring_dir = self.root_path / "reconciliation" / "progress-tracking"
        monitoring_dir.mkdir(parents=True, exist_ok=True)
        
        # Save timestamped report
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        report_file = monitoring_dir / f"SYSTEM-HEALTH-{timestamp}.json"
        
        with open(report_file, "w") as f:
            json.dump(report, f, indent=2)
        
        # Update current health pointer
        current_health_file = monitoring_dir / "CURRENT-SYSTEM-HEALTH.json"
        with open(current_health_file, "w") as f:
            json.dump(report, f, indent=2)
    
    def auto_fix_safe_issues(self, session: str = "AUTO_FIX") -> Dict[str, Any]:
        """Automatically fix issues that are safe to auto-resolve"""
        results = {
            "session": session,
            "timestamp": datetime.now().isoformat(),
            "fixes_attempted": [],
            "fixes_successful": [],
            "fixes_failed": []
        }
        
        print(f"🔧 Attempting auto-fixes - Session {session}")
        
        # Get current gaps that can be auto-fixed
        gap_file = self.root_path / "reconciliation" / "gap-analysis" / "CURRENT-GAPS.json"
        if gap_file.exists():
            with open(gap_file) as f:
                gap_data = json.load(f)
            
            for gap in gap_data.get("gaps_found", []):
                if self._is_safe_to_auto_fix(gap):
                    fix_command = self._get_auto_fix_command(gap)
                    if fix_command:
                        results["fixes_attempted"].append({
                            "gap": gap["description"],
                            "command": fix_command
                        })
                        
                        success = self._execute_auto_fix(fix_command)
                        if success:
                            results["fixes_successful"].append(gap["description"])
                        else:
                            results["fixes_failed"].append(gap["description"])
        
        print(f"  ✅ Fixed: {len(results['fixes_successful'])}")
        print(f"  ❌ Failed: {len(results['fixes_failed'])}")
        
        return results
    
    def _is_safe_to_auto_fix(self, gap: Dict[str, Any]) -> bool:
        """Determine if gap is safe to automatically fix"""
        safe_categories = {
            "missing_subdirectory",
            "non_executable_tool"
        }
        return gap.get("category") in safe_categories
    
    def _get_auto_fix_command(self, gap: Dict[str, Any]) -> str:
        """Get command to auto-fix a gap"""
        category = gap.get("category")
        description = gap.get("description", "")
        
        if category == "missing_subdirectory":
            # Extract directory path from description
            if "/" in description:
                path = description.split(":")[-1].strip()
                return f"mkdir -p {path}"
        
        elif category == "non_executable_tool":
            # Extract file path from description
            if ":" in description:
                path = description.split(":")[-1].strip()
                return f"chmod +x {path}"
        
        return ""
    
    def _execute_auto_fix(self, command: str) -> bool:
        """Execute auto-fix command safely"""
        try:
            result = subprocess.run(
                command.split(),
                cwd=str(self.root_path),
                capture_output=True,
                text=True
            )
            return result.returncode == 0
        except Exception:
            return False


def main():
    """Command line interface for system guardian"""
    if len(sys.argv) < 2:
        print("Usage: system-guardian.py <command> [session]")
        print("Commands:")
        print("  check    - Run full system health check")
        print("  autofix  - Automatically fix safe issues")
        print("  status   - Show current system status")
        sys.exit(1)
    
    command = sys.argv[1]
    session = sys.argv[2] if len(sys.argv) > 2 else "CLI"
    root_path = os.getcwd()
    
    guardian = SystemGuardian(root_path)
    
    if command == "check":
        report = guardian.full_system_check(session)
        
        print(f"\n🏥 System Health Report - Session {session}")
        print(f"  Overall Health: {report['overall_health'].upper()}")
        
        if report['critical_issues']:
            print(f"\n🚨 Critical Issues ({len(report['critical_issues'])}):")
            for issue in report['critical_issues']:
                print(f"    - {issue}")
        
        print(f"\n💡 Recommendations:")
        for rec in report['recommendations'][:5]:
            print(f"    - {rec}")
        
        # Set exit code based on health
        if report['overall_health'] in ['excellent', 'good']:
            sys.exit(0)
        elif report['overall_health'] in ['fair']:
            sys.exit(1)
        else:
            sys.exit(2)
    
    elif command == "autofix":
        results = guardian.auto_fix_safe_issues(session)
        
        if results['fixes_successful']:
            print("\n✅ Successfully fixed:")
            for fix in results['fixes_successful']:
                print(f"    - {fix}")
        
        if results['fixes_failed']:
            print("\n❌ Failed to fix:")
            for fix in results['fixes_failed']:
                print(f"    - {fix}")
        
        if not results['fixes_attempted']:
            print("No safe auto-fixes available")
    
    elif command == "status":
        # Quick status check
        health_file = Path(root_path) / "reconciliation" / "progress-tracking" / "CURRENT-SYSTEM-HEALTH.json"
        if health_file.exists():
            with open(health_file) as f:
                report = json.load(f)
            
            print(f"Last Check: {report['timestamp']}")
            print(f"Health: {report['overall_health'].upper()}")
            print(f"Critical Issues: {len(report['critical_issues'])}")
        else:
            print("No system health data available. Run 'check' first.")
    
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)


if __name__ == "__main__":
    main()