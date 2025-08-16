# Session 00008: Static Asset Reality Agent (Simplified)

## Context
Since v6 has no API server or JavaScript build system, we'll create a Static Asset Reality Agent instead of the full API Contract Agent.

## Implementation

Create `reality/agent-reality-auditor/static-asset-connector/connector.py`:

```python
#!/usr/bin/env python3
"""
Static Asset Reality Agent - HTML/CSS/Asset Truth Monitor
Created: Session 00008
Purpose: Monitor static files without a build system
"""

import os
import re
import json
from pathlib import Path
from typing import Dict, List, Any
from datetime import datetime

class StaticAssetRealityAgent:
    """
    Monitors static HTML/CSS/JS files.
    Adapted for v6's reality: no build system, just static files.
    """
    
    def __init__(self, project_root: str = None):
        self.name = "Static Asset Reality Agent"
        self.session_id = "00008"
        
        if project_root:
            self.project_root = Path(project_root)
        else:
            # Assume we're in reality/agent-reality-auditor/static-asset-connector/
            self.project_root = Path(__file__).parent.parent.parent.parent
        
        self.cache_dir = Path(__file__).parent / ".cache"
        self.cache_dir.mkdir(exist_ok=True)
        
        # Static file patterns to monitor
        self.static_extensions = ['.html', '.css', '.js', '.json', '.md']
        self.asset_extensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico']
    
    def discover_level_1(self) -> Dict[str, Any]:
        """Can I access the static files?"""
        html_files = list(self.project_root.rglob("*.html"))
        css_files = list(self.project_root.rglob("*.css"))
        js_files = list(self.project_root.rglob("*.js"))
        
        # Exclude node_modules and other build directories
        html_files = [f for f in html_files if 'node_modules' not in str(f)]
        js_files = [f for f in js_files if 'node_modules' not in str(f)]
        
        return {
            "accessible": True,
            "html_files": len(html_files),
            "css_files": len(css_files),
            "js_files": len(js_files),
            "total_static": len(html_files) + len(css_files) + len(js_files),
            "timestamp": datetime.utcnow().isoformat()
        }
    
    def discover_level_2(self) -> Dict[str, Any]:
        """What static assets exist?"""
        assets = {
            "html_files": [],
            "css_files": [],
            "js_files": [],
            "python_files": [],
            "assets": []
        }
        
        # Find all HTML files
        for html_file in self.project_root.rglob("*.html"):
            if 'node_modules' not in str(html_file):
                assets["html_files"].append({
                    "path": str(html_file.relative_to(self.project_root)),
                    "size": html_file.stat().st_size,
                    "modified": datetime.fromtimestamp(html_file.stat().st_mtime).isoformat()
                })
        
        # Find Python files (like reality_dashboard.py)
        for py_file in self.project_root.rglob("*.py"):
            if 'dashboard' in str(py_file).lower():
                assets["python_files"].append({
                    "path": str(py_file.relative_to(self.project_root)),
                    "size": py_file.stat().st_size,
                    "type": "dashboard" if 'dashboard' in py_file.name else "other"
                })
        
        # Find CSS files
        for css_file in self.project_root.rglob("*.css"):
            if 'node_modules' not in str(css_file):
                assets["css_files"].append({
                    "path": str(css_file.relative_to(self.project_root)),
                    "size": css_file.stat().st_size
                })
        
        # Find JS files
        for js_file in self.project_root.rglob("*.js"):
            if 'node_modules' not in str(js_file) and '.cache' not in str(js_file):
                assets["js_files"].append({
                    "path": str(js_file.relative_to(self.project_root)),
                    "size": js_file.stat().st_size
                })
        
        return {
            "summary": {
                "html_count": len(assets["html_files"]),
                "css_count": len(assets["css_files"]),
                "js_count": len(assets["js_files"]),
                "python_dashboard_count": len(assets["python_files"])
            },
            "files": assets,
            "timestamp": datetime.utcnow().isoformat()
        }
    
    def discover_level_3(self) -> Dict[str, Any]:
        """What changed recently?"""
        current_state = self.discover_level_2()
        
        # Save current state
        cache_file = self.cache_dir / f"static_state_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.json"
        with open(cache_file, 'w') as f:
            json.dump(current_state, f, indent=2)
        
        # Compare with previous if exists
        cache_files = sorted(self.cache_dir.glob("static_state_*.json"))
        if len(cache_files) > 1:
            with open(cache_files[-2]) as f:
                previous_state = json.load(f)
            
            changes = {
                "html_change": current_state["summary"]["html_count"] - 
                              previous_state["summary"]["html_count"],
                "css_change": current_state["summary"]["css_count"] - 
                             previous_state["summary"]["css_count"],
                "js_change": current_state["summary"]["js_count"] - 
                            previous_state["summary"]["js_count"]
            }
            
            return {
                "changes": changes,
                "new_files": self._find_new_files(previous_state, current_state),
                "timestamp": datetime.utcnow().isoformat()
            }
        
        return {
            "message": "First scan - no previous state",
            "timestamp": datetime.utcnow().isoformat()
        }
    
    def discover_level_4(self) -> Dict[str, Any]:
        """Are there inconsistencies?"""
        gaps = []
        
        # Check for orphaned assets
        html_files = list(self.project_root.rglob("*.html"))
        for html_file in html_files:
            if 'node_modules' not in str(html_file):
                with open(html_file, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                
                # Check for missing linked files
                css_links = re.findall(r'href=["\']([^"\']+\.css)["\']', content)
                js_links = re.findall(r'src=["\']([^"\']+\.js)["\']', content)
                
                for css in css_links:
                    if not css.startswith('http'):
                        css_path = html_file.parent / css
                        if not css_path.exists():
                            gaps.append({
                                "gap_type": "missing_css",
                                "severity": "MEDIUM",
                                "file": str(html_file.relative_to(self.project_root)),
                                "missing": css,
                                "impact": "Broken styling"
                            })
                
                for js in js_links:
                    if not js.startswith('http'):
                        js_path = html_file.parent / js
                        if not js_path.exists():
                            gaps.append({
                                "gap_type": "missing_js",
                                "severity": "HIGH",
                                "file": str(html_file.relative_to(self.project_root)),
                                "missing": js,
                                "impact": "Broken functionality"
                            })
        
        # Check for dashboard consistency
        dashboard_html = self.project_root / "reality" / "dashboard" / "dashboard.html"
        dashboard_py = self.project_root / "reality" / "dashboard" / "reality_dashboard.py"
        
        if dashboard_html.exists() and not dashboard_py.exists():
            gaps.append({
                "gap_type": "missing_dashboard_backend",
                "severity": "HIGH",
                "truth": "dashboard.html exists but reality_dashboard.py missing",
                "impact": "Dashboard may not function"
            })
        
        return {
            "gaps": gaps,
            "total_gaps": len(gaps),
            "critical_gaps": len([g for g in gaps if g["severity"] == "CRITICAL"]),
            "health_score": 100 - (len(gaps) * 10)  # Simple scoring
        }
    
    def _find_new_files(self, previous: Dict, current: Dict) -> List[str]:
        """Find files added since previous scan"""
        prev_files = set()
        curr_files = set()
        
        for category in ['html_files', 'css_files', 'js_files']:
            if category in previous.get('files', {}):
                prev_files.update([f['path'] for f in previous['files'][category]])
            if category in current.get('files', {}):
                curr_files.update([f['path'] for f in current['files'][category]])
        
        return list(curr_files - prev_files)
    
    def generate_static_report(self) -> Dict[str, Any]:
        """Generate comprehensive static asset report"""
        report = {
            "agent": self.name,
            "session": self.session_id,
            "timestamp": datetime.utcnow().isoformat(),
            "levels": {}
        }
        
        # Discover all levels
        report["levels"]["access"] = self.discover_level_1()
        report["levels"]["inventory"] = self.discover_level_2()
        report["levels"]["changes"] = self.discover_level_3()
        report["levels"]["gaps"] = self.discover_level_4()
        
        # Calculate health
        health = report["levels"]["gaps"].get("health_score", 100)
        report["health_score"] = max(0, health)
        report["status"] = "healthy" if health > 70 else "degraded" if health > 30 else "critical"
        
        # Save report
        cache_file = self.cache_dir / f"static_report_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.json"
        with open(cache_file, 'w') as f:
            json.dump(report, f, indent=2)
        
        return report

# CLI Interface
if __name__ == "__main__":
    import sys
    
    agent = StaticAssetRealityAgent()
    
    if len(sys.argv) > 1 and sys.argv[1] == "--help":
        print("Static Asset Reality Agent - Monitor static files")
        print("\nUsage:")
        print("  python connector.py       # Full report")
        print("  python connector.py --gaps # Show gaps only")
    else:
        report = agent.generate_static_report()
        
        print("=" * 60)
        print("         STATIC ASSET REALITY REPORT")
        print("=" * 60)
        
        if report["health_score"] >= 90:
            print("\n✅ Static Assets: HEALTHY")
        elif report["health_score"] >= 70:
            print(f"\n⚠️  Static Assets: DEGRADED ({report['health_score']}%)")
        else:
            print(f"\n❌ Static Assets: ISSUES ({report['health_score']}%)")
        
        if "inventory" in report["levels"]:
            inv = report["levels"]["inventory"]["summary"]
            print(f"\n📁 Asset Inventory:")
            print(f"  HTML files: {inv['html_count']}")
            print(f"  CSS files: {inv['css_count']}")
            print(f"  JS files: {inv['js_count']}")
            print(f"  Python dashboards: {inv['python_dashboard_count']}")
        
        if "gaps" in report["levels"]:
            gaps = report["levels"]["gaps"]["gaps"]
            if gaps:
                print(f"\n⚠️  Gaps Found: {len(gaps)}")
                for gap in gaps[:5]:
                    print(f"  - [{gap['severity']}] {gap.get('truth', gap.get('gap_type'))}")
        
        print("\n" + "=" * 60)
```

## Quick Implementation

```bash
# Create the directory
mkdir -p reality/agent-reality-auditor/static-asset-connector

# Create the connector.py file with above code
cd reality/agent-reality-auditor/static-asset-connector
vim connector.py  # Paste the code above

# Test it
python3 connector.py
```

This simplified agent:
- Monitors static HTML/CSS/JS files
- Tracks Python dashboard files
- Detects missing linked resources
- No API monitoring (since no API exists)
- Fits v6's current reality