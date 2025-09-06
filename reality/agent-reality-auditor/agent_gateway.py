#!/usr/bin/env python3
"""
Reality Agent Gateway - Session 139
MCP-to-Python bridge for critical Reality Agents

Usage: python3 agent_gateway.py <agent> <operation> [params_json]
"""

import sys
import json
import importlib.util
import traceback
from pathlib import Path
from datetime import datetime

class RealityAgentGateway:
    """Gateway for MCP to Reality Agent communication"""
    
    def __init__(self):
        self.agents_dir = Path(__file__).parent
        self.loaded_agents = {}
        
        # Critical agents only (per Session 139 scope reduction)
        self.critical_agents = {
            'supabase': 'supabase-connector',
            'filesystem': 'filesystem-connector'
        }
        
    def load_agent(self, agent_name):
        """Dynamically load a critical agent"""
        if agent_name in self.loaded_agents:
            return self.loaded_agents[agent_name]
            
        if agent_name not in self.critical_agents:
            raise ValueError(f"Agent '{agent_name}' not in critical agents: {list(self.critical_agents.keys())}")
            
        connector_dir = self.critical_agents[agent_name]
        agent_path = self.agents_dir / connector_dir / "connector.py"
        
        if not agent_path.exists():
            raise FileNotFoundError(f"Connector not found: {agent_path}")
            
        try:
            # Dynamic import
            spec = importlib.util.spec_from_file_location(
                f"{agent_name}_connector", 
                agent_path
            )
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)
            
            # Find connector class (should contain 'Connector' in name)
            connector_class = None
            for item_name in dir(module):
                if 'Connector' in item_name and not item_name.startswith('_'):
                    connector_class = getattr(module, item_name)
                    break
                    
            if not connector_class:
                raise ImportError(f"No Connector class found in {agent_path}")
                
            # Initialize and cache
            agent_instance = connector_class()
            self.loaded_agents[agent_name] = agent_instance
            
            return agent_instance
            
        except Exception as e:
            raise ImportError(f"Failed to load {agent_name} connector: {e}")
    
    def run_operation(self, agent_name, operation, params=None):
        """Run an operation on a specific agent"""
        result = {
            "timestamp": datetime.now().isoformat(),
            "agent": agent_name,
            "operation": operation,
            "success": False,
            "session_id": "00139"
        }
        
        try:
            # Load the agent
            agent = self.load_agent(agent_name)
            
            # Check if operation exists
            if not hasattr(agent, operation):
                available_ops = [method for method in dir(agent) 
                               if not method.startswith('_') and callable(getattr(agent, method))]
                result["error"] = f"Operation '{operation}' not found"
                result["available_operations"] = available_ops[:10]  # Limit output
                return result
                
            # Execute operation
            method = getattr(agent, operation)
            
            if params:
                if isinstance(params, dict):
                    operation_result = method(**params)
                else:
                    operation_result = method(params)
            else:
                operation_result = method()
                
            result["success"] = True
            result["result"] = operation_result
            
        except Exception as e:
            result["error"] = str(e)
            result["traceback"] = traceback.format_exc()
            
        return result

def main():
    """Main entry point for MCP calls"""
    if len(sys.argv) < 3:
        print(json.dumps({
            "error": "Usage: python3 agent_gateway.py <agent> <operation> [params_json]",
            "critical_agents": ["supabase", "filesystem"],
            "session_id": "00139"
        }))
        sys.exit(1)
        
    agent_name = sys.argv[1]
    operation = sys.argv[2]
    
    # Parse params if provided
    params = None
    if len(sys.argv) > 3:
        try:
            params = json.loads(sys.argv[3])
        except json.JSONDecodeError as e:
            print(json.dumps({
                "error": f"Invalid JSON params: {e}",
                "session_id": "00139"
            }))
            sys.exit(1)
    
    # Run through gateway
    gateway = RealityAgentGateway()
    result = gateway.run_operation(agent_name, operation, params)
    
    # Output JSON result
    print(json.dumps(result, default=str, indent=2))

if __name__ == "__main__":
    main()