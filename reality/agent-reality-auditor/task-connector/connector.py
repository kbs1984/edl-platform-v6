# Attribution: created by Session 00009 on 2025-08-15 12:00:30 UTC
# Intent: Core Task Reality Agent for dependency tracking
# Task: unknown - No task context set
# Session: 00009
#!/usr/bin/env python3
"""
Task Reality Agent - The Memory and Attribution Guardian
Tracks WHO did WHAT, WHEN, WHY, and HOW tasks connect
Session 00009 Implementation
"""

import json
import sys
import os
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any, Optional, Tuple
import argparse
import re

class TaskRealityAgent:
    """
    The sixth Reality Agent - completes temporal and causal reality
    Tracks task dependencies, session attribution, and completion evidence
    """
    
    def __init__(self):
        self.name = "Task Reality Agent"
        self.version = "1.0.0"
        self.session_id = "00009"
        
        # Task storage
        self.task_db = Path(".tasks/task_graph.json")
        self.task_db.parent.mkdir(exist_ok=True)
        
        # Load existing tasks
        self.task_graph = self._load_tasks()
        
        # Integration with other agents (lazy loaded)
        self.filesystem_agent = None
        self.github_agent = None
        self.supabase_agent = None
        
    def _load_tasks(self) -> Dict[str, Any]:
        """Load task graph from persistent storage"""
        if self.task_db.exists():
            try:
                with open(self.task_db, 'r') as f:
                    return json.load(f)
            except json.JSONDecodeError:
                print(f"⚠️ Warning: Could not parse {self.task_db}, starting fresh")
                return {}
        return {}
    
    def _save_tasks(self):
        """Persist task graph to storage"""
        with open(self.task_db, 'w') as f:
            json.dump(self.task_graph, f, indent=2, default=str)
    
    def track_task(self, task_id: str, session_id: str, 
                   depends_on: List[str] = None,
                   description: str = "",
                   acceptance_criteria: List[str] = None,
                   priority: Optional[int] = None,
                   estimated_hours: Optional[float] = None,
                   intent: str = "") -> Dict[str, Any]:
        """Track a task with full attribution and dependencies"""
        
        # Calculate automatic priority if not provided
        if priority is None:
            priority = self._calculate_priority(task_id, depends_on)
        
        task = {
            "id": task_id,
            "created_by": session_id,
            "created_at": datetime.utcnow().isoformat(),
            "modified_by": [session_id],
            "modified_at": [datetime.utcnow().isoformat()],
            "description": description,
            "depends_on": depends_on or [],
            "blocks": [],  # Tasks that depend on this
            "status": "pending",
            "acceptance_criteria": acceptance_criteria or [],
            "evidence": [],
            "intent": intent,
            "priority": priority,
            "estimated_hours": estimated_hours,
            "actual_hours": None,
            "completion_confidence": 0
        }
        
        self.task_graph[task_id] = task
        
        # Update reverse dependencies
        for dep_id in depends_on or []:
            if dep_id in self.task_graph:
                if task_id not in self.task_graph[dep_id]["blocks"]:
                    self.task_graph[dep_id]["blocks"].append(task_id)
        
        self._save_tasks()
        return task
    
    def _calculate_priority(self, task_id: str, depends_on: List[str]) -> int:
        """Calculate automatic priority based on blocking count"""
        # Check how many tasks this will block
        blocking_count = 0
        for tid, task in self.task_graph.items():
            if task_id in task.get("depends_on", []):
                blocking_count += 1
        
        if blocking_count >= 3:
            return 0  # P0: Critical blocker
        elif blocking_count >= 1:
            return 1  # P1: Blocks other tasks
        else:
            return 2  # P2: No dependencies
    
    def verify_completion(self, task_id: str) -> Dict[str, Any]:
        """Verify task completion with evidence"""
        task = self.task_graph.get(task_id)
        if not task:
            return {
                "completed": False,
                "reason": "Task not found",
                "confidence": 0
            }
        
        # Check acceptance criteria
        evidence_map = {}
        for criterion in task.get("acceptance_criteria", []):
            evidence = self._find_evidence(task_id, criterion)
            evidence_map[criterion] = evidence
        
        # Calculate completion
        if not evidence_map:
            # No criteria means manual verification needed
            return {
                "completed": task["status"] == "completed",
                "evidence": {},
                "missing": [],
                "confidence": 50 if task["status"] == "completed" else 0,
                "note": "No acceptance criteria defined - manual verification required"
            }
        
        met_count = sum(1 for e in evidence_map.values() if e.get("found"))
        total_count = len(evidence_map)
        all_met = met_count == total_count
        
        return {
            "completed": all_met,
            "evidence": evidence_map,
            "missing": [c for c, e in evidence_map.items() if not e.get("found")],
            "confidence": (met_count / total_count * 100) if total_count > 0 else 0,
            "criteria_met": f"{met_count}/{total_count}"
        }
    
    def _find_evidence(self, task_id: str, criterion: str) -> Dict[str, Any]:
        """Find evidence that criterion is met"""
        criterion_lower = criterion.lower()
        
        # File existence checks
        if "file exists" in criterion_lower or "created" in criterion_lower:
            # Extract file path from criterion
            path_match = re.search(r'[\'"`]([^\'"`]+)[\'"`]', criterion)
            if path_match:
                file_path = Path(path_match.group(1))
                exists = file_path.exists()
                return {
                    "found": exists,
                    "type": "file_exists",
                    "path": str(file_path),
                    "verified_at": datetime.utcnow().isoformat()
                }
        
        # Table existence checks
        if "table exists" in criterion_lower or "table" in criterion_lower:
            table_match = re.search(r'table\s+(\w+)', criterion_lower)
            if table_match:
                table_name = table_match.group(1)
                # Would check with Supabase agent if available
                return {
                    "found": False,
                    "type": "table_exists",
                    "table": table_name,
                    "reason": "Supabase agent not available for verification"
                }
        
        # Test passing checks
        if "test" in criterion_lower and ("pass" in criterion_lower or "passes" in criterion_lower):
            return {
                "found": False,
                "type": "test_passes",
                "reason": "Test runner not configured"
            }
        
        # Documentation checks
        if "document" in criterion_lower or "readme" in criterion_lower:
            doc_patterns = ["README.md", "*.md", "docs/"]
            for pattern in doc_patterns:
                if pattern in criterion:
                    path = Path(pattern)
                    return {
                        "found": path.exists(),
                        "type": "documentation",
                        "path": str(path)
                    }
        
        # Default: No automated check available
        return {
            "found": False,
            "type": "manual",
            "reason": "No automated verification available for this criterion"
        }
    
    def get_execution_order(self) -> List[str]:
        """Topological sort to determine execution order"""
        if not self.task_graph:
            return []
        
        visited = set()
        stack = []
        
        def dfs(task_id):
            if task_id in visited:
                return
            visited.add(task_id)
            
            task = self.task_graph.get(task_id, {})
            for dep in task.get("depends_on", []):
                if dep in self.task_graph:  # Only visit existing tasks
                    dfs(dep)
            stack.append(task_id)
        
        # Visit all tasks
        for task_id in self.task_graph:
            if task_id not in visited:
                dfs(task_id)
        
        return stack
    
    def find_blockers(self) -> Dict[str, Dict[str, Any]]:
        """Find tasks that are blocking others"""
        blockers = {}
        
        for task_id, task in self.task_graph.items():
            if task.get("status") != "completed" and task.get("blocks"):
                blocked_tasks = task.get("blocks", [])
                blockers[task_id] = {
                    "blocks": blocked_tasks,
                    "blocked_count": len(blocked_tasks),
                    "priority": task.get("priority", 2),
                    "description": task.get("description", ""),
                    "status": task.get("status", "pending")
                }
        
        # Sort by number of blocked tasks (descending)
        return dict(sorted(blockers.items(), 
                          key=lambda x: (x[1]["blocked_count"], -x[1]["priority"]), 
                          reverse=True))
    
    def generate_roadmap(self) -> Dict[str, Any]:
        """Generate implementation roadmap with parallel execution paths"""
        if not self.task_graph:
            return {
                "phases": [],
                "total_tasks": 0,
                "status": "No tasks tracked"
            }
        
        execution_order = self.get_execution_order()
        phases = []
        completed_tasks = set()
        
        # Group tasks into phases based on dependencies
        remaining_tasks = set(execution_order)
        
        while remaining_tasks:
            current_phase = []
            
            for task_id in list(remaining_tasks):
                task = self.task_graph.get(task_id, {})
                deps = set(task.get("depends_on", []))
                
                # Can execute if all dependencies are completed
                if deps.issubset(completed_tasks):
                    current_phase.append(task_id)
            
            if not current_phase:
                # Circular dependency or missing tasks
                break
            
            phases.append(current_phase)
            completed_tasks.update(current_phase)
            remaining_tasks.difference_update(current_phase)
        
        # Calculate metrics
        total_estimated_hours = sum(
            self.task_graph[tid].get("estimated_hours", 4)  # Default 4 hours
            for tid in execution_order
        )
        
        critical_path = self._find_critical_path()
        
        return {
            "phases": phases,
            "total_tasks": len(self.task_graph),
            "completed_tasks": len([t for t in self.task_graph.values() if t.get("status") == "completed"]),
            "parallel_opportunities": [p for p in phases if len(p) > 1],
            "critical_path": critical_path,
            "estimated_sessions": len(phases),
            "total_estimated_hours": total_estimated_hours,
            "phase_details": [
                {
                    "phase": i + 1,
                    "tasks": phase,
                    "parallel_count": len(phase),
                    "estimated_hours": sum(
                        self.task_graph[tid].get("estimated_hours", 4)
                        for tid in phase
                    )
                }
                for i, phase in enumerate(phases)
            ]
        }
    
    def _find_critical_path(self) -> Dict[str, Any]:
        """Find the longest path through the task graph"""
        if not self.task_graph:
            return {"path": [], "total_hours": 0, "bottlenecks": []}
        
        # Build adjacency list for path finding
        memo = {}
        
        def find_longest_path(task_id: str) -> Tuple[List[str], float]:
            if task_id in memo:
                return memo[task_id]
            
            task = self.task_graph.get(task_id, {})
            blocks = task.get("blocks", [])
            
            if not blocks:
                # Leaf node
                hours = task.get("estimated_hours", 4)
                memo[task_id] = ([task_id], hours)
                return ([task_id], hours)
            
            # Find longest path through children
            max_path = []
            max_hours = 0
            
            for child_id in blocks:
                if child_id in self.task_graph:
                    child_path, child_hours = find_longest_path(child_id)
                    if child_hours > max_hours:
                        max_hours = child_hours
                        max_path = child_path
            
            current_hours = task.get("estimated_hours", 4)
            path = [task_id] + max_path
            total_hours = current_hours + max_hours
            
            memo[task_id] = (path, total_hours)
            return (path, total_hours)
        
        # Find all root tasks (no dependencies)
        root_tasks = [
            tid for tid, task in self.task_graph.items()
            if not task.get("depends_on")
        ]
        
        if not root_tasks:
            # All tasks have dependencies - might be circular
            root_tasks = list(self.task_graph.keys())[:1]
        
        # Find longest path from any root
        longest_path = []
        longest_hours = 0
        
        for root in root_tasks:
            path, hours = find_longest_path(root)
            if hours > longest_hours:
                longest_hours = hours
                longest_path = path
        
        # Find bottlenecks (tasks that block many others)
        bottlenecks = [
            tid for tid, task in self.task_graph.items()
            if len(task.get("blocks", [])) >= 2
        ]
        
        return {
            "path": longest_path,
            "total_hours": longest_hours,
            "minimum_sessions": max(1, len(longest_path) // 3),  # Assume 3 tasks per session
            "bottlenecks": bottlenecks
        }
    
    def mark_completed(self, task_id: str, session_id: str, 
                       evidence: List[str] = None,
                       actual_hours: Optional[float] = None) -> Dict[str, Any]:
        """Mark a task as completed with evidence"""
        if task_id not in self.task_graph:
            return {"error": f"Task {task_id} not found"}
        
        task = self.task_graph[task_id]
        
        # Update task status
        task["status"] = "completed"
        task["completed_by"] = session_id
        task["completed_at"] = datetime.utcnow().isoformat()
        task["evidence"] = evidence or []
        
        if actual_hours is not None:
            task["actual_hours"] = actual_hours
        
        # Add to modified history
        if session_id not in task.get("modified_by", []):
            task["modified_by"].append(session_id)
        task["modified_at"].append(datetime.utcnow().isoformat())
        
        # Verify completion
        verification = self.verify_completion(task_id)
        task["completion_confidence"] = verification.get("confidence", 0)
        
        self._save_tasks()
        
        return {
            "task_id": task_id,
            "status": "completed",
            "verification": verification,
            "unblocked_tasks": task.get("blocks", [])
        }
    
    def get_task_status(self, task_id: str) -> Dict[str, Any]:
        """Get detailed status of a task"""
        if task_id not in self.task_graph:
            return {"error": f"Task {task_id} not found"}
        
        task = self.task_graph[task_id]
        
        # Check if dependencies are met
        deps_met = all(
            self.task_graph.get(dep, {}).get("status") == "completed"
            for dep in task.get("depends_on", [])
        )
        
        return {
            "task_id": task_id,
            "status": task.get("status", "unknown"),
            "description": task.get("description", ""),
            "created_by": task.get("created_by", "unknown"),
            "priority": task.get("priority", 2),
            "dependencies_met": deps_met,
            "blocks": task.get("blocks", []),
            "completion_confidence": task.get("completion_confidence", 0),
            "can_start": deps_met and task.get("status") != "completed"
        }
    
    def generate_ascii_graph(self) -> str:
        """Generate ASCII visualization of task dependencies"""
        if not self.task_graph:
            return "No tasks tracked yet"
        
        lines = ["Task Dependency Graph", "=" * 40]
        
        # Get execution order
        execution_order = self.get_execution_order()
        
        # Group by status
        completed = []
        in_progress = []
        pending = []
        blocked = []
        
        for task_id in execution_order:
            task = self.task_graph.get(task_id, {})
            status = task.get("status", "pending")
            
            if status == "completed":
                completed.append(task_id)
            elif status == "in_progress":
                in_progress.append(task_id)
            else:
                # Check if blocked
                deps = task.get("depends_on", [])
                if deps and not all(
                    self.task_graph.get(d, {}).get("status") == "completed" 
                    for d in deps
                ):
                    blocked.append(task_id)
                else:
                    pending.append(task_id)
        
        # Display tasks by status
        if completed:
            lines.append("\n✅ Completed:")
            for tid in completed:
                task = self.task_graph[tid]
                lines.append(f"   {tid} [{task.get('priority', '?')}]")
        
        if in_progress:
            lines.append("\n🔄 In Progress:")
            for tid in in_progress:
                task = self.task_graph[tid]
                lines.append(f"   {tid} [{task.get('priority', '?')}]")
        
        if pending:
            lines.append("\n⏳ Ready to Start:")
            for tid in pending:
                task = self.task_graph[tid]
                deps = task.get("depends_on", [])
                if deps:
                    lines.append(f"   {tid} [{task.get('priority', '?')}] <- {', '.join(deps)}")
                else:
                    lines.append(f"   {tid} [{task.get('priority', '?')}] (no deps)")
        
        if blocked:
            lines.append("\n🚫 Blocked:")
            for tid in blocked:
                task = self.task_graph[tid]
                deps = task.get("depends_on", [])
                incomplete_deps = [
                    d for d in deps 
                    if self.task_graph.get(d, {}).get("status") != "completed"
                ]
                lines.append(f"   {tid} [{task.get('priority', '?')}] waiting for: {', '.join(incomplete_deps)}")
        
        # Show critical path
        critical_path = self._find_critical_path()
        if critical_path["path"]:
            lines.append(f"\n🎯 Critical Path ({critical_path['total_hours']:.1f} hours):")
            lines.append("   " + " -> ".join(critical_path["path"]))
        
        return "\n".join(lines)
    
    def create_session_handoff(self, current_session: str, next_session: str) -> Dict[str, Any]:
        """Create handoff package for next session"""
        # Find tasks by status
        completed_in_session = [
            tid for tid, task in self.task_graph.items()
            if task.get("completed_by") == current_session
        ]
        
        in_progress = [
            tid for tid, task in self.task_graph.items()
            if task.get("status") == "in_progress"
        ]
        
        # Find ready tasks (dependencies met)
        ready_tasks = []
        for tid, task in self.task_graph.items():
            if task.get("status") != "completed":
                deps = task.get("depends_on", [])
                if all(self.task_graph.get(d, {}).get("status") == "completed" for d in deps):
                    ready_tasks.append(tid)
        
        # Get blockers
        blockers = self.find_blockers()
        
        # Generate roadmap
        roadmap = self.generate_roadmap()
        
        handoff = {
            "from_session": current_session,
            "to_session": next_session,
            "timestamp": datetime.utcnow().isoformat(),
            "completed_this_session": completed_in_session,
            "in_progress_tasks": in_progress,
            "ready_to_start": ready_tasks[:5],  # Top 5 ready tasks
            "blocked_tasks": list(blockers.keys()),
            "next_phase_tasks": roadmap["phases"][0] if roadmap["phases"] else [],
            "critical_blockers": [
                tid for tid, info in blockers.items() 
                if info["blocked_count"] >= 3
            ],
            "estimated_work_remaining": sum(
                task.get("estimated_hours", 4)
                for task in self.task_graph.values()
                if task.get("status") != "completed"
            ),
            "completion_percentage": (
                len([t for t in self.task_graph.values() if t.get("status") == "completed"]) /
                len(self.task_graph) * 100
            ) if self.task_graph else 0
        }
        
        return handoff
    
    def run_discovery(self, level: int = 1) -> Dict[str, Any]:
        """Standard discovery interface for Reality Agents"""
        discoveries = {
            "agent": self.name,
            "version": self.version,
            "timestamp": datetime.utcnow().isoformat(),
            "level": level
        }
        
        if level >= 1:
            # Level 1: Basic connectivity and stats
            discoveries["connection"] = {
                "storage": str(self.task_db),
                "exists": self.task_db.exists(),
                "task_count": len(self.task_graph),
                "status": "operational"
            }
            discoveries["stats"] = {
                "total_tasks": len(self.task_graph),
                "completed": len([t for t in self.task_graph.values() if t.get("status") == "completed"]),
                "in_progress": len([t for t in self.task_graph.values() if t.get("status") == "in_progress"]),
                "pending": len([t for t in self.task_graph.values() if t.get("status") == "pending"])
            }
        
        if level >= 2:
            # Level 2: Task relationships and dependencies
            discoveries["dependencies"] = {
                "total_dependencies": sum(len(t.get("depends_on", [])) for t in self.task_graph.values()),
                "max_dependency_depth": len(self._find_critical_path()["path"]),
                "orphaned_tasks": len([
                    tid for tid, task in self.task_graph.items()
                    if not task.get("depends_on") and not task.get("blocks")
                ])
            }
            discoveries["roadmap"] = self.generate_roadmap()
        
        if level >= 3:
            # Level 3: Session attribution and evidence
            sessions = {}
            for task in self.task_graph.values():
                creator = task.get("created_by", "unknown")
                if creator not in sessions:
                    sessions[creator] = {"created": 0, "completed": 0}
                sessions[creator]["created"] += 1
                
                if task.get("status") == "completed":
                    completer = task.get("completed_by", creator)
                    if completer not in sessions:
                        sessions[completer] = {"created": 0, "completed": 0}
                    sessions[completer]["completed"] += 1
            
            discoveries["attribution"] = sessions
            discoveries["verification"] = {
                "tasks_with_criteria": len([
                    t for t in self.task_graph.values() 
                    if t.get("acceptance_criteria")
                ]),
                "average_confidence": sum(
                    t.get("completion_confidence", 0) 
                    for t in self.task_graph.values()
                ) / len(self.task_graph) if self.task_graph else 0
            }
        
        if level >= 4:
            # Level 4: Critical insights and gaps
            blockers = self.find_blockers()
            discoveries["critical_insights"] = {
                "top_blockers": list(blockers.keys())[:3],
                "critical_path": self._find_critical_path(),
                "estimated_sessions_remaining": len(self.generate_roadmap()["phases"]),
                "tasks_without_estimates": len([
                    t for t in self.task_graph.values() 
                    if not t.get("estimated_hours")
                ]),
                "tasks_without_criteria": len([
                    t for t in self.task_graph.values() 
                    if not t.get("acceptance_criteria")
                ])
            }
            
            # Identify gaps
            gaps = []
            if len([t for t in self.task_graph.values() if not t.get("acceptance_criteria")]) > 0:
                gaps.append("Tasks exist without acceptance criteria")
            if len([t for t in self.task_graph.values() if not t.get("estimated_hours")]) > 0:
                gaps.append("Tasks exist without time estimates")
            if len([t for t in self.task_graph.values() if not t.get("intent")]) > 0:
                gaps.append("Tasks exist without documented intent")
            
            discoveries["gaps"] = gaps
        
        return discoveries


def main():
    parser = argparse.ArgumentParser(description='Task Reality Agent - Dependency and Attribution Tracker')
    parser.add_argument('--level', type=int, default=1, choices=[1, 2, 3, 4],
                       help='Discovery level (1-4)')
    parser.add_argument('--action', choices=['discover', 'status', 'roadmap', 'graph', 'blockers'],
                       default='discover', help='Action to perform')
    parser.add_argument('--task', help='Task ID for specific operations')
    parser.add_argument('--output', choices=['json', 'text'], default='text',
                       help='Output format')
    
    args = parser.parse_args()
    
    agent = TaskRealityAgent()
    
    if args.action == 'discover':
        result = agent.run_discovery(args.level)
    elif args.action == 'status':
        if args.task:
            result = agent.get_task_status(args.task)
        else:
            result = agent.run_discovery(1)  # Basic stats
    elif args.action == 'roadmap':
        result = agent.generate_roadmap()
    elif args.action == 'graph':
        print(agent.generate_ascii_graph())
        return
    elif args.action == 'blockers':
        result = agent.find_blockers()
    else:
        result = {"error": f"Unknown action: {args.action}"}
    
    if args.output == 'json':
        print(json.dumps(result, indent=2, default=str))
    else:
        # Pretty print for text output
        print(f"\n{agent.name} - {args.action.title()}")
        print("=" * 50)
        
        if isinstance(result, dict):
            for key, value in result.items():
                if isinstance(value, dict):
                    print(f"\n{key}:")
                    for k, v in value.items():
                        print(f"  {k}: {v}")
                elif isinstance(value, list):
                    print(f"\n{key}: ({len(value)} items)")
                    for item in value[:5]:  # Show first 5
                        print(f"  - {item}")
                    if len(value) > 5:
                        print(f"  ... and {len(value) - 5} more")
                else:
                    print(f"{key}: {value}")


if __name__ == "__main__":
    main()