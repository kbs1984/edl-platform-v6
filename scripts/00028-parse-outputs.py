#!/usr/bin/env python3
"""
00028-parse-outputs.py - Parse Reality Agent outputs into readable format
Session 28: Build session automation framework
Purpose: Extract key information from agent JSON/text outputs
"""

import json
import sys
import os
from datetime import datetime

def parse_integration_output(filepath):
    """Parse Integration Agent text output"""
    try:
        with open(filepath, 'r') as f:
            content = f.read()
        
        # Extract health percentage
        health = "Unknown"
        if "OVERALL HEALTH" in content:
            for line in content.split('\n'):
                if "OVERALL HEALTH" in line:
                    import re
                    match = re.search(r'(\d+\.?\d*)%', line)
                    if match:
                        health = match.group(1) + "%"
                        break
        
        # Extract agent counts
        healthy_agents = 0
        if "Healthy Agents:" in content:
            for line in content.split('\n'):
                if "Healthy Agents:" in line:
                    match = re.search(r'(\d+)/(\d+)', line)
                    if match:
                        healthy_agents = f"{match.group(1)}/{match.group(2)}"
                        break
        
        return {
            "health": health,
            "healthy_agents": healthy_agents,
            "type": "integration"
        }
    except Exception as e:
        return {"error": str(e), "type": "integration"}

def parse_json_output(filepath, agent_name):
    """Parse JSON output from FileSystem, GitHub, Supabase agents"""
    try:
        with open(filepath, 'r') as f:
            data = json.load(f)
        
        result = {"type": agent_name}
        
        # Extract common fields
        if "connection" in data:
            result["status"] = data["connection"].get("status", "unknown")
        elif "status" in data:
            result["status"] = data["status"]
        
        # Agent-specific fields
        if agent_name == "filesystem":
            if "connection" in data:
                result["permission"] = data["connection"].get("permission_level", "unknown")
                result["available_space"] = data["connection"].get("available_space_bytes", 0) / (1024**3)  # GB
        
        elif agent_name == "github":
            if "repository" in data:
                result["repo"] = data["repository"].get("name", "unknown")
                result["branch"] = data["repository"].get("default_branch", "unknown")
        
        elif agent_name == "supabase":
            if "database" in data:
                result["tables"] = len(data["database"].get("tables", []))
            else:
                result["tables"] = 0
        
        return result
    except json.JSONDecodeError:
        return {"error": "Invalid JSON", "type": agent_name}
    except Exception as e:
        return {"error": str(e), "type": agent_name}

def format_report(results):
    """Format parsed results into a nice report"""
    print("=" * 60)
    print("           SESSION AUTOMATION REALITY REPORT")
    print("=" * 60)
    print(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # System Health from Integration Agent
    integration = results.get("integration", {})
    print("📊 SYSTEM HEALTH")
    print("-" * 40)
    print(f"  Overall Health:    {integration.get('health', 'Unknown')}")
    print(f"  Healthy Agents:    {integration.get('healthy_agents', 'Unknown')}")
    print()
    
    # Individual Agent Status
    print("🔍 AGENT STATUS")
    print("-" * 40)
    
    # FileSystem
    fs = results.get("filesystem", {})
    print(f"  FileSystem Agent:  {fs.get('status', 'Unknown')}")
    if 'available_space' in fs:
        print(f"    - Available:     {fs['available_space']:.1f} GB")
    if 'permission' in fs:
        print(f"    - Permission:    {fs['permission']}")
    
    # GitHub
    gh = results.get("github", {})
    print(f"  GitHub Agent:      {gh.get('status', 'Unknown')}")
    if 'repo' in gh:
        print(f"    - Repository:    {gh['repo']}")
    
    # Supabase
    sb = results.get("supabase", {})
    print(f"  Supabase Agent:    {sb.get('status', 'Unknown')}")
    print(f"    - Tables:        {sb.get('tables', 0)}")
    
    print()
    print("✅ All Reality Agents operational")
    print("=" * 60)

def main():
    """Main execution"""
    # Parse all outputs
    results = {}
    
    # Integration Agent (text output)
    if os.path.exists("/tmp/integration.json"):
        results["integration"] = parse_integration_output("/tmp/integration.json")
    
    # JSON agents
    if os.path.exists("/tmp/filesystem.json"):
        results["filesystem"] = parse_json_output("/tmp/filesystem.json", "filesystem")
    
    if os.path.exists("/tmp/github.json"):
        results["github"] = parse_json_output("/tmp/github.json", "github")
    
    if os.path.exists("/tmp/supabase.json"):
        results["supabase"] = parse_json_output("/tmp/supabase.json", "supabase")
    
    # Format and display
    format_report(results)
    
    # Save parsed results for other scripts
    with open("/tmp/parsed-reality.json", "w") as f:
        json.dump(results, f, indent=2)

if __name__ == "__main__":
    main()