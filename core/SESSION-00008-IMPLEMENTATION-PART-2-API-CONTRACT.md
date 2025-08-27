---
created: '2025-08-23'
domain: core
priority: P1
purpose: 'Document session 00008 implementation part 2: api contract reality agent'
session: 00008
status: current
title: 'Session 00008 Implementation Part 2: API Contract Reality Agent'
topics:
- session-log
- documentation
type: guide
---

# Session 00008 Implementation Part 2: API Contract Reality Agent

## Overview
This document contains the COMPLETE implementation for the API Contract Reality Agent. This agent finds integration gaps between frontend and backend BEFORE runtime.

## File Structure Required
```bash
reality/agent-reality-auditor/api-contract-connector/
├── connector.py           # Main API Contract Agent (code below)
├── quickstart.py          # Test script (code below)
├── requirements.txt       # Dependencies (if needed)
└── .cache/               # Will be auto-created
```

## Step 1: Create connector.py

```python
#!/usr/bin/env python3
"""
API Contract Reality Agent - Frontend-Backend Truth Monitor
Created: Session 00008
Purpose: Detect integration gaps before runtime
"""

import os
import re
import json
import ast
from pathlib import Path
from typing import Dict, List, Set, Any, Tuple
from datetime import datetime

class APIContractRealityAgent:
    """
    Monitors frontend-backend contract alignment.
    Finds API calls that will fail before they fail.
    Domain-agnostic: doesn't know what APIs are for, just that they exist.
    """
    
    def __init__(self, project_root: str = None):
        self.name = "API Contract Reality Agent"
        self.session_id = "00008"
        
        # Detect project root
        if project_root:
            self.project_root = Path(project_root)
        else:
            # Assume we're in reality/agent-reality-auditor/api-contract-connector/
            self.project_root = Path(__file__).parent.parent.parent.parent
        
        self.cache_dir = Path(__file__).parent / ".cache"
        self.cache_dir.mkdir(exist_ok=True)
        
        # Define where to look for frontend and backend
        # Add your project's specific directories here
        self.frontend_dirs = [
            self.project_root / "frontend",
            self.project_root / "src" / "frontend",
            self.project_root / "client",
            self.project_root / "public",
            self.project_root / "web",
            self.project_root / "app",
            self.project_root / "src" / "client",
            self.project_root / "static"
        ]
        
        self.backend_dirs = [
            self.project_root / "backend",
            self.project_root / "api",
            self.project_root / "server",
            self.project_root / "src" / "api",
            self.project_root / "src" / "server",
            self.project_root / "functions",
            self.project_root / "endpoints"
        ]
        
        # Patterns for finding API calls in frontend (vanilla JS focus)
        self.api_patterns = [
            # Fetch API
            r'fetch\([\'"`]([^\'"`]+)[\'"`]',  # fetch('/api/...')
            r'fetch\(\s*[\'"`]([^\'"`]+)[\'"`]',  # fetch( '/api/...')
            
            # XMLHttpRequest
            r'\.open\([\'"`]\w+[\'"`],\s*[\'"`]([^\'"`]+)[\'"`]',  # xhr.open('GET', '/api/...')
            
            # Axios
            r'axios\.\w+\([\'"`]([^\'"`]+)[\'"`]',  # axios.get('/api/...')
            r'axios\([\'"`]([^\'"`]+)[\'"`]',  # axios('/api/...')
            r'axios\.request\(\{[^}]*url:\s*[\'"`]([^\'"`]+)[\'"`]',  # axios.request({url: '/api/...'})
            
            # jQuery
            r'\$\.\w+\([\'"`]([^\'"`]+)[\'"`]',  # $.get('/api/...')
            r'\$\.ajax\(\{[^}]*url:\s*[\'"`]([^\'"`]+)[\'"`]',  # $.ajax({url: '/api/...'})
            
            # Generic HTTP methods
            r'\.get\([\'"`]([^\'"`]+)[\'"`]',  # http.get('/api/...')
            r'\.post\([\'"`]([^\'"`]+)[\'"`]',  # http.post('/api/...')
            r'\.put\([\'"`]([^\'"`]+)[\'"`]',
            r'\.delete\([\'"`]([^\'"`]+)[\'"`]',
            r'\.patch\([\'"`]([^\'"`]+)[\'"`]',
            
            # API endpoint constants
            r'API_ENDPOINT.*?[\'"`]([^\'"`]+)[\'"`]',  # const API_ENDPOINT = '/api/...'
            r'API_URL.*?[\'"`]([^\'"`]+)[\'"`]',  # const API_URL = '/api/...'
            r'ENDPOINT.*?[\'"`]([^\'"`]+)[\'"`]',  # const ENDPOINT = '/api/...'
            
            # String concatenation patterns
            r'[\'"`](/api/[^\'"`]+)[\'"`]',  # Any '/api/...' string
            r'[\'"`](/v\d+/[^\'"`]+)[\'"`]',  # Version patterns '/v1/...'
        ]
        
        # Patterns for finding endpoints in backend
        self.endpoint_patterns = [
            # Express.js
            r'app\.\w+\([\'"`]([^\'"`]+)[\'"`]',  # app.get('/api/...')
            r'router\.\w+\([\'"`]([^\'"`]+)[\'"`]',  # router.post('/api/...')
            r'route\([\'"`]([^\'"`]+)[\'"`]',  # route('/api/...')
            
            # Flask (Python)
            r'@app\.route\([\'"`]([^\'"`]+)[\'"`]',  # @app.route('/api/...')
            r'@blueprint\.route\([\'"`]([^\'"`]+)[\'"`]',  # @blueprint.route('/api/...')
            
            # FastAPI (Python)
            r'@app\.\w+\([\'"`]([^\'"`]+)[\'"`]',  # @app.get('/api/...')
            r'@router\.\w+\([\'"`]([^\'"`]+)[\'"`]',  # @router.post('/api/...')
            
            # Django (Python)
            r'path\([\'"`]([^\'"`]+)[\'"`]',  # path('api/...')
            r'url\(r?\^?[\'"`]([^\'"`]+)[\'"`]',  # url(r'^api/...')
            
            # Next.js API Routes
            r'export\s+(?:async\s+)?function\s+handler',  # API route handler
            
            # Generic patterns
            r'[\'"`](/api/[^\'"`]+)[\'"`]',  # Any API path string
        ]
    
    def discover_level_1(self) -> Dict[str, Any]:
        """Can I access frontend and backend code?"""
        
        # Find actual frontend directory
        frontend_found = None
        for dir in self.frontend_dirs:
            if dir.exists():
                frontend_found = dir
                break
        
        # Find actual backend directory
        backend_found = None
        for dir in self.backend_dirs:
            if dir.exists():
                backend_found = dir
                break
        
        # Count files
        frontend_files = 0
        backend_files = 0
        
        if frontend_found:
            # Count JavaScript/TypeScript files
            js_files = list(frontend_found.rglob("*.js"))
            jsx_files = list(frontend_found.rglob("*.jsx"))
            ts_files = list(frontend_found.rglob("*.ts"))
            tsx_files = list(frontend_found.rglob("*.tsx"))
            html_files = list(frontend_found.rglob("*.html"))
            
            frontend_files = len(js_files) + len(jsx_files) + len(ts_files) + len(tsx_files) + len(html_files)
        
        if backend_found:
            # Count backend files (Python, JS, TS)
            py_files = list(backend_found.rglob("*.py"))
            js_files = list(backend_found.rglob("*.js"))
            ts_files = list(backend_found.rglob("*.ts"))
            
            backend_files = len(py_files) + len(js_files) + len(ts_files)
        
        return {
            "frontend_accessible": frontend_found is not None,
            "frontend_path": str(frontend_found) if frontend_found else None,
            "frontend_files": frontend_files,
            "backend_accessible": backend_found is not None,
            "backend_path": str(backend_found) if backend_found else None,
            "backend_files": backend_files,
            "timestamp": datetime.utcnow().isoformat()
        }
    
    def discover_level_2(self) -> Dict[str, Any]:
        """What API calls and endpoints exist?"""
        
        # Extract frontend API calls
        frontend_calls = self._extract_frontend_api_calls()
        
        # Extract backend endpoints
        backend_endpoints = self._extract_backend_endpoints()
        
        # Get unique endpoints
        unique_frontend = set([call['endpoint'] for call in frontend_calls])
        unique_backend = set([ep['route'] for ep in backend_endpoints])
        
        return {
            "frontend_api_calls": {
                "total": len(frontend_calls),
                "unique_endpoints": len(unique_frontend),
                "endpoints": sorted(list(unique_frontend))[:20],  # First 20 unique
                "sample_calls": frontend_calls[:10]  # Sample of first 10 calls
            },
            "backend_endpoints": {
                "total": len(backend_endpoints),
                "unique_routes": len(unique_backend),
                "routes": sorted(list(unique_backend))[:20],  # First 20 unique
                "sample_endpoints": backend_endpoints[:10]  # Sample of first 10
            },
            "timestamp": datetime.utcnow().isoformat()
        }
    
    def discover_level_3(self) -> Dict[str, Any]:
        """What changed recently in contracts?"""
        
        # Get current state
        current_state = self.discover_level_2()
        
        # Save current state to cache for future comparison
        cache_file = self.cache_dir / f"contract_state_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.json"
        with open(cache_file, 'w') as f:
            json.dump(current_state, f, indent=2)
        
        # Try to load previous state
        cache_files = sorted(self.cache_dir.glob("contract_state_*.json"))
        if len(cache_files) > 1:
            # Load second to last (previous state)
            with open(cache_files[-2]) as f:
                previous_state = json.load(f)
            
            # Calculate changes
            frontend_change = current_state['frontend_api_calls']['total'] - \
                            previous_state['frontend_api_calls']['total']
            backend_change = current_state['backend_endpoints']['total'] - \
                           previous_state['backend_endpoints']['total']
            
            # Find new endpoints
            current_fe = set(current_state['frontend_api_calls']['endpoints'])
            previous_fe = set(previous_state['frontend_api_calls']['endpoints'])
            new_frontend = current_fe - previous_fe
            removed_frontend = previous_fe - current_fe
            
            current_be = set(current_state['backend_endpoints']['routes'])
            previous_be = set(previous_state['backend_endpoints']['routes'])
            new_backend = current_be - previous_be
            removed_backend = previous_be - current_be
            
            return {
                "frontend_calls_change": frontend_change,
                "backend_endpoints_change": backend_change,
                "contract_drift": abs(frontend_change - backend_change),
                "new_frontend_calls": list(new_frontend),
                "removed_frontend_calls": list(removed_frontend),
                "new_backend_endpoints": list(new_backend),
                "removed_backend_endpoints": list(removed_backend),
                "timestamp": datetime.utcnow().isoformat()
            }
        
        return {
            "message": "No previous state to compare",
            "first_scan": True,
            "timestamp": datetime.utcnow().isoformat()
        }
    
    def discover_level_4(self) -> Dict[str, Any]:
        """What integration bombs exist?"""
        
        gaps = []
        
        # Get all frontend calls and backend endpoints
        frontend_calls = self._extract_frontend_api_calls()
        backend_endpoints = self._extract_backend_endpoints()
        
        # Create normalized sets for comparison
        frontend_paths = {}  # endpoint -> list of files
        for call in frontend_calls:
            normalized = self._normalize_path(call['endpoint'])
            if normalized not in frontend_paths:
                frontend_paths[normalized] = []
            frontend_paths[normalized].append({
                'file': call['file'],
                'line': call['line']
            })
        
        backend_paths = {}  # endpoint -> list of files
        for ep in backend_endpoints:
            normalized = self._normalize_path(ep['route'])
            if normalized not in backend_paths:
                backend_paths[normalized] = []
            backend_paths[normalized].append({
                'file': ep['file'],
                'line': ep['line'],
                'method': ep.get('method', 'GET')
            })
        
        # Find orphaned frontend calls (will 404)
        orphaned = set(frontend_paths.keys()) - set(backend_paths.keys())
        for endpoint in orphaned:
            locations = frontend_paths[endpoint]
            gaps.append({
                "gap_type": "orphaned_api_call",
                "severity": "CRITICAL",
                "endpoint": endpoint,
                "locations": locations[:5],  # First 5 locations
                "truth": f"Frontend calls {endpoint} but backend doesn't provide it",
                "impact": "Runtime 404 error - will fail in production"
            })
        
        # Find unused backend endpoints (dead code)
        unused = set(backend_paths.keys()) - set(frontend_paths.keys())
        for endpoint in unused:
            # Some endpoints might be for external consumption
            if not any(skip in endpoint for skip in ['health', 'metrics', 'admin', 'internal']):
                gaps.append({
                    "gap_type": "unused_endpoint",
                    "severity": "LOW",
                    "endpoint": endpoint,
                    "locations": backend_paths[endpoint][:5],
                    "truth": f"Backend provides {endpoint} but frontend never calls it",
                    "impact": "Unnecessary code/maintenance burden"
                })
        
        # Find potential method mismatches
        matched = set(frontend_paths.keys()) & set(backend_paths.keys())
        for endpoint in matched:
            # This is simplified - real implementation would parse HTTP methods from frontend
            backend_methods = set([loc['method'] for loc in backend_paths[endpoint]])
            if len(backend_methods) > 1:
                gaps.append({
                    "gap_type": "multiple_methods",
                    "severity": "MEDIUM",
                    "endpoint": endpoint,
                    "methods": list(backend_methods),
                    "truth": f"Endpoint {endpoint} has multiple HTTP methods",
                    "impact": "Frontend might use wrong method"
                })
        
        # Calculate alignment score
        total_endpoints = len(set(frontend_paths.keys()) | set(backend_paths.keys()))
        matched_endpoints = len(matched)
        alignment_score = (matched_endpoints / total_endpoints * 100) if total_endpoints > 0 else 100
        
        return {
            "gaps": gaps,
            "total_gaps": len(gaps),
            "critical_gaps": len([g for g in gaps if g['severity'] == 'CRITICAL']),
            "orphaned_calls": list(orphaned),
            "unused_endpoints": list(unused),
            "matched_endpoints": list(matched),
            "alignment_score": alignment_score,
            "summary": {
                "frontend_unique": len(frontend_paths),
                "backend_unique": len(backend_paths),
                "matched": len(matched),
                "orphaned": len(orphaned),
                "unused": len(unused)
            }
        }
    
    def _extract_frontend_api_calls(self) -> List[Dict[str, Any]]:
        """Extract all API calls from frontend code"""
        api_calls = []
        
        # Find frontend directory
        frontend_dir = None
        for dir in self.frontend_dirs:
            if dir.exists():
                frontend_dir = dir
                break
        
        if not frontend_dir:
            return []
        
        # Search all JS/TS/HTML files
        file_extensions = ['.js', '.jsx', '.ts', '.tsx', '.html', '.vue', '.svelte']
        
        for file_path in frontend_dir.rglob("*"):
            # Skip node_modules and other vendor directories
            if 'node_modules' in str(file_path) or '.git' in str(file_path):
                continue
                
            if file_path.suffix in file_extensions:
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                    
                    # Find all API calls using patterns
                    for pattern in self.api_patterns:
                        matches = re.finditer(pattern, content)
                        for match in matches:
                            endpoint = match.group(1)
                            
                            # Filter out non-API URLs
                            if self._is_api_endpoint(endpoint):
                                # Find line number
                                line_num = content[:match.start()].count('\n') + 1
                                
                                api_calls.append({
                                    "file": str(file_path.relative_to(self.project_root)),
                                    "line": line_num,
                                    "endpoint": endpoint,
                                    "pattern": pattern.split('\\')[0]  # Pattern type
                                })
                                
                except Exception as e:
                    # Skip files that can't be read
                    continue
        
        return api_calls
    
    def _extract_backend_endpoints(self) -> List[Dict[str, Any]]:
        """Extract all endpoints from backend code"""
        endpoints = []
        
        # Find backend directory
        backend_dir = None
        for dir in self.backend_dirs:
            if dir.exists():
                backend_dir = dir
                break
        
        if not backend_dir:
            # Also check if API routes are in the main project
            if (self.project_root / "pages" / "api").exists():
                backend_dir = self.project_root / "pages" / "api"  # Next.js structure
            elif (self.project_root / "api").exists():
                backend_dir = self.project_root / "api"
        
        if not backend_dir:
            return []
        
        # Search all backend files
        file_extensions = ['.py', '.js', '.ts', '.mjs', '.cjs']
        
        for file_path in backend_dir.rglob("*"):
            # Skip node_modules and other vendor directories
            if 'node_modules' in str(file_path) or '.git' in str(file_path):
                continue
                
            if file_path.suffix in file_extensions:
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                    
                    # Find all endpoint definitions
                    for pattern in self.endpoint_patterns:
                        matches = re.finditer(pattern, content)
                        for match in matches:
                            route = match.group(1)
                            
                            if self._is_api_endpoint(route):
                                # Find line number
                                line_num = content[:match.start()].count('\n') + 1
                                
                                # Try to detect HTTP method
                                method = self._detect_http_method(content, line_num, pattern)
                                
                                endpoints.append({
                                    "file": str(file_path.relative_to(self.project_root)),
                                    "line": line_num,
                                    "route": route,
                                    "method": method,
                                    "framework": self._detect_framework(pattern)
                                })
                                
                except Exception as e:
                    # Skip files that can't be read
                    continue
        
        # For Next.js API routes, infer from file structure
        if (self.project_root / "pages" / "api").exists():
            api_dir = self.project_root / "pages" / "api"
            for file_path in api_dir.rglob("*.js"):
                if 'node_modules' not in str(file_path):
                    # Convert file path to API route
                    route = "/api" + str(file_path.relative_to(api_dir).with_suffix(''))
                    route = route.replace('\\', '/').replace('/index', '')
                    
                    endpoints.append({
                        "file": str(file_path.relative_to(self.project_root)),
                        "line": 1,
                        "route": route,
                        "method": "ANY",  # Next.js handles all methods
                        "framework": "Next.js"
                    })
        
        return endpoints
    
    def _is_api_endpoint(self, endpoint: str) -> bool:
        """Check if string is likely an API endpoint"""
        # Filter out non-API URLs
        if not endpoint:
            return False
        
        # Skip external URLs
        if endpoint.startswith('http://') or endpoint.startswith('https://'):
            if 'localhost' not in endpoint and '127.0.0.1' not in endpoint:
                return False
        
        # Skip static assets
        static_extensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf']
        if any(endpoint.endswith(ext) for ext in static_extensions):
            return False
        
        # Include API-like paths
        api_indicators = ['/api/', '/v1/', '/v2/', '/graphql', '/rest/', '/_api/']
        if any(indicator in endpoint for indicator in api_indicators):
            return True
        
        # Include root-level endpoints that look like APIs
        if endpoint.startswith('/') and not endpoint.startswith('//'):
            # Simple heuristic: if it has no file extension, might be API
            if '.' not in endpoint.split('/')[-1]:
                return True
        
        return False
    
    def _normalize_path(self, path: str) -> str:
        """Normalize API paths for comparison"""
        if not path:
            return ""
            
        # Remove trailing slashes
        path = path.rstrip('/')
        
        # Remove query parameters
        path = path.split('?')[0]
        
        # Remove anchors
        path = path.split('#')[0]
        
        # Handle relative paths
        if not path.startswith('/'):
            path = '/' + path
        
        # Remove duplicate slashes
        path = re.sub(r'/+', '/', path)
        
        # Remove common parameter patterns (simplified)
        # /api/users/123 -> /api/users/:id
        path = re.sub(r'/\d+', '/:id', path)
        
        # /api/users/{id} -> /api/users/:id
        path = re.sub(r'/\{[^}]+\}', '/:param', path)
        
        # /api/users/:id already normalized
        
        return path
    
    def _detect_http_method(self, content: str, line_num: int, pattern: str) -> str:
        """Try to detect HTTP method from context"""
        lines = content.split('\n')
        if line_num > 0 and line_num <= len(lines):
            line = lines[line_num - 1].lower()
            
            # Check for method indicators
            for method in ['get', 'post', 'put', 'delete', 'patch', 'head', 'options']:
                if method in line:
                    return method.upper()
        
        # Default based on pattern
        if 'get' in pattern.lower():
            return 'GET'
        elif 'post' in pattern.lower():
            return 'POST'
        elif 'put' in pattern.lower():
            return 'PUT'
        elif 'delete' in pattern.lower():
            return 'DELETE'
        
        return 'GET'  # Default
    
    def _detect_framework(self, pattern: str) -> str:
        """Detect which framework based on pattern"""
        pattern_lower = pattern.lower()
        
        if '@app.route' in pattern or 'flask' in pattern_lower:
            return 'Flask'
        elif 'router.' in pattern or 'express' in pattern_lower:
            return 'Express'
        elif '@router.' in pattern or 'fastapi' in pattern_lower:
            return 'FastAPI'
        elif 'django' in pattern_lower or 'path(' in pattern:
            return 'Django'
        elif 'next' in pattern_lower:
            return 'Next.js'
        
        return 'Unknown'
    
    def generate_contract_report(self) -> Dict[str, Any]:
        """Generate comprehensive contract alignment report"""
        report = {
            "agent": self.name,
            "session": self.session_id,
            "timestamp": datetime.utcnow().isoformat(),
            "levels": {}
        }
        
        # Discover all levels
        report["levels"]["access"] = self.discover_level_1()
        
        if report["levels"]["access"]["frontend_accessible"] or \
           report["levels"]["access"]["backend_accessible"]:
            report["levels"]["contracts"] = self.discover_level_2()
            report["levels"]["changes"] = self.discover_level_3()
            report["levels"]["gaps"] = self.discover_level_4()
        
        # Calculate health score
        health = 100
        
        if not (report["levels"]["access"]["frontend_accessible"] or 
                report["levels"]["access"]["backend_accessible"]):
            health = 0
        elif "gaps" in report["levels"]:
            # Reduce health based on gaps
            gaps = report["levels"]["gaps"].get("gaps", [])
            for gap in gaps:
                if gap["severity"] == "CRITICAL":
                    health -= 25
                elif gap["severity"] == "HIGH":
                    health -= 10
                elif gap["severity"] == "MEDIUM":
                    health -= 5
                elif gap["severity"] == "LOW":
                    health -= 2
            
            # Factor in alignment score
            alignment = report["levels"]["gaps"].get("alignment_score", 100)
            health = min(health, alignment)
        
        report["health_score"] = max(0, health)
        report["status"] = "healthy" if health > 70 else "degraded" if health > 30 else "critical"
        
        # Save report
        cache_file = self.cache_dir / f"contract_report_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.json"
        with open(cache_file, 'w') as f:
            json.dump(report, f, indent=2)
        
        return report

# CLI Interface
if __name__ == "__main__":
    import sys
    
    agent = APIContractRealityAgent()
    
    if len(sys.argv) > 1:
        command = sys.argv[1]
        
        if command == "--help":
            print("API Contract Reality Agent - Frontend-Backend Truth Monitor")
            print("\nUsage:")
            print("  python connector.py          # Full report")
            print("  python connector.py --gaps    # Only show gaps")
            print("  python connector.py --level N # Specific level (1-4)")
            print("\nNo configuration required - auto-detects project structure")
            
        elif command == "--gaps":
            # Just show gaps
            gaps = agent.discover_level_4()
            if gaps.get("gaps"):
                print("API CONTRACT GAPS DETECTED:")
                print("=" * 50)
                for gap in gaps["gaps"]:
                    print(f"\n[{gap['severity']}] {gap['gap_type']}")
                    print(f"  Endpoint: {gap['endpoint']}")
                    print(f"  Truth: {gap['truth']}")
                    print(f"  Impact: {gap['impact']}")
                    if 'locations' in gap:
                        print(f"  Found in:")
                        for loc in gap['locations'][:3]:
                            print(f"    - {loc['file']}:{loc['line']}")
                print(f"\nAlignment Score: {gaps.get('alignment_score', 0):.1f}%")
            else:
                print("✅ No API contract gaps detected")
                
        elif command == "--level" and len(sys.argv) > 2:
            level = int(sys.argv[2])
            if level == 1:
                result = agent.discover_level_1()
            elif level == 2:
                result = agent.discover_level_2()
            elif level == 3:
                result = agent.discover_level_3()
            elif level == 4:
                result = agent.discover_level_4()
            else:
                result = {"error": "Invalid level. Use 1-4"}
            print(json.dumps(result, indent=2))
    else:
        # Full report
        report = agent.generate_contract_report()
        
        print("=" * 60)
        print("         API CONTRACT REALITY REPORT")
        print("=" * 60)
        
        if report["health_score"] == 100:
            print("\n✅ API Contract: PERFECT ALIGNMENT")
        elif report["health_score"] > 70:
            print(f"\n⚠️  API Contract: MISALIGNED ({report['health_score']:.0f}%)")
        else:
            print(f"\n❌ API Contract: CRITICAL GAPS ({report['health_score']:.0f}%)")
        
        if "access" in report["levels"]:
            access = report["levels"]["access"]
            print(f"\n📁 Code Access:")
            if access["frontend_accessible"]:
                print(f"  Frontend: ✅ {access['frontend_files']} files in {access['frontend_path']}")
            else:
                print(f"  Frontend: ❌ Not found")
            
            if access["backend_accessible"]:
                print(f"  Backend: ✅ {access['backend_files']} files in {access['backend_path']}")
            else:
                print(f"  Backend: ❌ Not found")
        
        if "contracts" in report["levels"]:
            fe = report["levels"]["contracts"]["frontend_api_calls"]
            be = report["levels"]["contracts"]["backend_endpoints"]
            print(f"\n📊 Contract Summary:")
            print(f"  Frontend API Calls: {fe['total']} ({fe['unique_endpoints']} unique)")
            print(f"  Backend Endpoints: {be['total']} ({be['unique_routes']} unique)")
        
        if "gaps" in report["levels"]:
            gaps = report["levels"]["gaps"]
            
            if gaps.get("orphaned_calls"):
                print(f"\n❌ Orphaned API Calls: {len(gaps['orphaned_calls'])}")
                print("   (Frontend calls these but backend doesn't provide)")
                for call in gaps['orphaned_calls'][:5]:
                    print(f"   - {call}")
                if len(gaps['orphaned_calls']) > 5:
                    print(f"   ... and {len(gaps['orphaned_calls']) - 5} more")
            
            if gaps.get("unused_endpoints"):
                print(f"\n⚠️  Unused Backend Endpoints: {len(gaps['unused_endpoints'])}")
                print("   (Backend provides these but frontend doesn't use)")
                for endpoint in gaps['unused_endpoints'][:5]:
                    print(f"   - {endpoint}")
                if len(gaps['unused_endpoints']) > 5:
                    print(f"   ... and {len(gaps['unused_endpoints']) - 5} more")
            
            print(f"\n📈 Alignment Score: {gaps.get('alignment_score', 0):.1f}%")
            
            summary = gaps.get("summary", {})
            if summary:
                print(f"\n📋 Summary:")
                print(f"   Frontend endpoints: {summary.get('frontend_unique', 0)}")
                print(f"   Backend endpoints: {summary.get('backend_unique', 0)}")
                print(f"   Matched: {summary.get('matched', 0)}")
                print(f"   Orphaned: {summary.get('orphaned', 0)}")
                print(f"   Unused: {summary.get('unused', 0)}")
        
        print("\n" + "=" * 60)
```

## Step 2: Create quickstart.py

```python
#!/usr/bin/env python3
"""
API Contract Reality Agent - Quick Test
Tests all 4 levels of discovery
"""

from connector import APIContractRealityAgent
import json

def test_contract_agent():
    print("Testing API Contract Reality Agent...")
    print("=" * 50)
    
    agent = APIContractRealityAgent()
    
    # Test Level 1: Access
    print("\n1. Testing Code Access...")
    access = agent.discover_level_1()
    
    if access.get('frontend_accessible'):
        print(f"✅ Frontend found: {access['frontend_files']} files")
        print(f"   Path: {access['frontend_path']}")
    else:
        print("❌ Frontend not found")
        print("   Searched in: frontend/, src/frontend/, client/, public/, web/, app/")
    
    if access.get('backend_accessible'):
        print(f"✅ Backend found: {access['backend_files']} files")
        print(f"   Path: {access['backend_path']}")
    else:
        print("❌ Backend not found")
        print("   Searched in: backend/, api/, server/, src/api/, functions/")
    
    if not (access.get('frontend_accessible') or access.get('backend_accessible')):
        print("\n⚠️  No code directories found. Check project structure.")
        return
    
    # Test Level 2: Contracts
    print("\n2. Extracting API Contracts...")
    contracts = agent.discover_level_2()
    
    fe = contracts.get('frontend_api_calls', {})
    be = contracts.get('backend_endpoints', {})
    
    print(f"✅ Frontend: {fe.get('total', 0)} API calls ({fe.get('unique_endpoints', 0)} unique)")
    if fe.get('endpoints'):
        print("   Sample endpoints:")
        for endpoint in fe['endpoints'][:5]:
            print(f"   - {endpoint}")
    
    print(f"✅ Backend: {be.get('total', 0)} endpoints ({be.get('unique_routes', 0)} unique)")
    if be.get('routes'):
        print("   Sample routes:")
        for route in be['routes'][:5]:
            print(f"   - {route}")
    
    # Test Level 3: Changes
    print("\n3. Checking Recent Changes...")
    changes = agent.discover_level_3()
    
    if changes.get('first_scan'):
        print("ℹ️  First scan - no previous state to compare")
    else:
        print(f"✅ Changes detected:")
        print(f"   Frontend: {changes.get('frontend_calls_change', 0):+d} calls")
        print(f"   Backend: {changes.get('backend_endpoints_change', 0):+d} endpoints")
        print(f"   Drift: {changes.get('contract_drift', 0)}")
    
    # Test Level 4: Gaps
    print("\n4. Detecting Integration Gaps...")
    gaps_result = agent.discover_level_4()
    
    gaps = gaps_result.get('gaps', [])
    if gaps:
        print(f"⚠️  Found {len(gaps)} integration gaps:")
        
        critical = [g for g in gaps if g['severity'] == 'CRITICAL']
        if critical:
            print(f"\n   CRITICAL GAPS ({len(critical)}):")
            for gap in critical[:3]:
                print(f"   - {gap['endpoint']}: {gap['truth']}")
        
        high = [g for g in gaps if g['severity'] == 'HIGH']
        if high:
            print(f"\n   HIGH SEVERITY ({len(high)}):")
            for gap in high[:2]:
                print(f"   - {gap['endpoint']}: {gap['truth']}")
    else:
        print("✅ No integration gaps detected")
    
    print(f"\n📈 Alignment Score: {gaps_result.get('alignment_score', 0):.1f}%")
    
    summary = gaps_result.get('summary', {})
    if summary:
        print(f"\n📊 Statistics:")
        print(f"   Matched endpoints: {summary.get('matched', 0)}")
        print(f"   Orphaned calls: {summary.get('orphaned', 0)}")
        print(f"   Unused endpoints: {summary.get('unused', 0)}")
    
    print("\n" + "=" * 50)
    print("Test Complete!")
    
    # Generate full report
    print("\nGenerating full report...")
    report = agent.generate_contract_report()
    print(f"Health Score: {report['health_score']}%")
    print(f"Status: {report['status']}")

if __name__ == "__main__":
    test_contract_agent()
```

## Step 3: Test Commands

```bash
# Navigate to the agent directory
cd reality/agent-reality-auditor/api-contract-connector/

# Run quick test
python3 quickstart.py

# Run full report
python3 connector.py

# Check for gaps only
python3 connector.py --gaps

# Test specific level
python3 connector.py --level 2
```

## Expected Output Examples

### Successful Scan
```
API CONTRACT REALITY REPORT
============================================================

✅ API Contract: PERFECT ALIGNMENT

📁 Code Access:
  Frontend: ✅ 42 files in /project/frontend
  Backend: ✅ 28 files in /project/api

📊 Contract Summary:
  Frontend API Calls: 15 (12 unique)
  Backend Endpoints: 14 (12 unique)

📈 Alignment Score: 100.0%
```

### With Gaps
```
API CONTRACT REALITY REPORT
============================================================

⚠️  API Contract: MISALIGNED (65%)

📁 Code Access:
  Frontend: ✅ 42 files in /project/public
  Backend: ✅ 28 files in /project/server

📊 Contract Summary:
  Frontend API Calls: 25 (18 unique)
  Backend Endpoints: 20 (15 unique)

❌ Orphaned API Calls: 3
   (Frontend calls these but backend doesn't provide)
   - /api/user/profile
   - /api/cart/checkout
   - /api/order/history

⚠️  Unused Backend Endpoints: 2
   (Backend provides these but frontend doesn't use)
   - /api/admin/stats
   - /api/debug/logs

📈 Alignment Score: 65.0%
```

## Customization Points

### Adding Project-Specific Directories

If your project has unique structure, add to the search paths:

```python
# In __init__ method, add your paths:
self.frontend_dirs = [
    self.project_root / "your-frontend-dir",
    # ... existing paths
]

self.backend_dirs = [
    self.project_root / "your-backend-dir",
    # ... existing paths
]
```

### Adding Framework-Specific Patterns

For specific frameworks, add patterns:

```python
# For frontend (e.g., Angular)
self.api_patterns.append(
    r'http\.get<.*?>\([\'"`]([^\'"`]+)[\'"`]'  # Angular HttpClient
)

# For backend (e.g., Koa)
self.endpoint_patterns.append(
    r'router\.get\([\'"`]([^\'"`]+)[\'"`]'  # Koa router
)
```

## Integration Notes

This agent:
- Works WITHOUT any configuration
- Auto-detects project structure
- Handles multiple frameworks
- Reports truth without judgment
- Integrates with Integration Agent automatically

## Troubleshooting

### Problem: No frontend/backend found
**Solution**: Add your actual directory names to the search lists

### Problem: API calls not detected
**Solution**: Add patterns for your specific API call style

### Problem: Too many false positives
**Solution**: Adjust `_is_api_endpoint()` method filters

### Problem: Slow on large projects
**Solution**: Add directory exclusions (vendor, build, dist)

## Next Steps

After successful implementation:
1. Test on your actual codebase
2. Verify gap detection works
3. Move to Part 3: Integration updates
4. Run full system validation (Part 4)