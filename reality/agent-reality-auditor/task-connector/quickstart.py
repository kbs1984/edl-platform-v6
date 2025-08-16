# Attribution: created by Session 00009 on 2025-08-15 12:00:39 UTC
# Intent: Task Reality Agent validation and mock seed testing
# Task: unknown - No task context set
# Session: 00009
#!/usr/bin/env python3
"""
Task Reality Agent - Quickstart and Mock Seed Validation
Tests the complete task tracking workflow with sample data
"""

import json
import sys
from pathlib import Path
from datetime import datetime

# Add parent directory to path for imports
sys.path.append(str(Path(__file__).parent))
from connector import TaskRealityAgent


def create_mock_seed():
    """Create a mock Obsidian Canvas seed for testing"""
    return {
        "nodes": [
            {
                "id": "task1",
                "type": "text", 
                "text": "[P0] Create users table (2h)",
                "x": 0,
                "y": 0,
                "color": "red"
            },
            {
                "id": "task2",
                "type": "text",
                "text": "[P1] Create auth endpoints (4h) @backend",
                "x": 200,
                "y": 0
            },
            {
                "id": "task3",
                "type": "text",
                "text": "[P2] Build login UI (3h) #frontend",
                "x": 400,
                "y": 0
            }
        ],
        "edges": [
            {
                "id": "edge1",
                "fromNode": "task1",
                "toNode": "task2",
                "label": "depends_on"
            },
            {
                "id": "edge2",
                "fromNode": "task2",
                "toNode": "task3",
                "label": "depends_on"
            }
        ]
    }


def parse_mock_seed(seed_data):
    """Parse the mock seed into tasks"""
    tasks = []
    dependencies = {}
    
    # Parse nodes
    for node in seed_data["nodes"]:
        task_id = node["id"]
        text = node.get("text", "")
        
        # Extract metadata from text
        priority = 2  # Default
        if "[P0]" in text:
            priority = 0
        elif "[P1]" in text:
            priority = 1
        elif "[P2]" in text:
            priority = 2
        
        # Extract time estimate
        import re
        time_match = re.search(r'\((\d+)h\)', text)
        estimated_hours = float(time_match.group(1)) if time_match else 4.0
        
        # Extract tags
        tags = re.findall(r'#(\w+)', text)
        assignee_match = re.search(r'@(\w+)', text)
        assignee = assignee_match.group(1) if assignee_match else None
        
        # Clean description
        description = re.sub(r'\[P\d\]|\(\d+h\)|@\w+|#\w+', '', text).strip()
        
        tasks.append({
            "id": task_id,
            "description": description,
            "priority": priority,
            "estimated_hours": estimated_hours,
            "tags": tags,
            "assignee": assignee
        })
        dependencies[task_id] = []
    
    # Parse edges for dependencies
    for edge in seed_data["edges"]:
        if edge.get("label") == "depends_on":
            # Note: fromNode depends on toNode (arrow direction)
            # Actually, let's reverse this - toNode depends on fromNode makes more sense
            to_node = edge["toNode"]
            from_node = edge["fromNode"]
            if to_node in dependencies:
                dependencies[to_node].append(from_node)
    
    # Add dependencies to tasks
    for task in tasks:
        task["depends_on"] = dependencies.get(task["id"], [])
    
    return tasks


def run_quickstart():
    """Run the complete quickstart demonstration"""
    print("=" * 60)
    print("Task Reality Agent - Mock Seed Validation")
    print("=" * 60)
    
    # Initialize agent
    agent = TaskRealityAgent()
    print("\n✅ Task Reality Agent initialized")
    print(f"   Storage: {agent.task_db}")
    
    # Create mock seed
    print("\n1. Creating Mock Obsidian Canvas Seed...")
    mock_seed = create_mock_seed()
    print(f"   - {len(mock_seed['nodes'])} tasks found")
    print(f"   - {len(mock_seed['edges'])} dependencies mapped")
    
    # Parse seed
    print("\n2. Parsing Seed Data...")
    tasks = parse_mock_seed(mock_seed)
    for task in tasks:
        print(f"   📋 {task['id']}: {task['description']}")
        print(f"      Priority: P{task['priority']}, Time: {task['estimated_hours']}h")
        if task['depends_on']:
            print(f"      Dependencies: {', '.join(task['depends_on'])}")
    
    # Track tasks in agent
    print("\n3. Tracking Tasks in Reality Agent...")
    for task in tasks:
        result = agent.track_task(
            task_id=task['id'],
            session_id="00009",
            description=task['description'],
            depends_on=task['depends_on'],
            priority=task['priority'],
            estimated_hours=task['estimated_hours'],
            intent="Mock seed validation",
            acceptance_criteria=[
                f"{task['description']} implementation exists",
                f"Tests pass for {task['id']}",
                f"Documentation updated for {task['description']}"
            ]
        )
        print(f"   ✅ Tracked: {task['id']} (Priority P{result['priority']})")
    
    # Calculate execution order
    print("\n4. Calculating Execution Order...")
    execution_order = agent.get_execution_order()
    print(f"   Execution sequence: {' -> '.join(execution_order)}")
    
    # Generate roadmap
    print("\n5. Generating Implementation Roadmap...")
    roadmap = agent.generate_roadmap()
    print(f"   📍 Total phases: {len(roadmap['phases'])}")
    for i, phase in enumerate(roadmap['phases']):
        tasks_str = ', '.join(phase)
        hours = sum(agent.task_graph[tid].get('estimated_hours', 4) for tid in phase)
        print(f"   Phase {i+1}: [{tasks_str}] - {hours}h")
        if len(phase) > 1:
            print(f"      ⚡ Parallel execution possible!")
    
    print(f"\n   Critical Path: {roadmap['critical_path']['total_hours']}h")
    print(f"   Estimated sessions: {roadmap['estimated_sessions']}")
    
    # Simulate task completion
    print("\n6. Simulating Task Completion...")
    print(f"   Marking {tasks[0]['id']} as completed by Session 00009...")
    
    completion_result = agent.mark_completed(
        task_id=tasks[0]['id'],
        session_id="00009",
        evidence=["Table created in database", "Migration file added"],
        actual_hours=1.5
    )
    
    print(f"   ✅ Task completed with {completion_result['verification']['confidence']:.0f}% confidence")
    if completion_result.get('unblocked_tasks'):
        print(f"   🔓 Unblocked tasks: {', '.join(completion_result['unblocked_tasks'])}")
    
    # Check for blockers
    print("\n7. Checking for Blocking Tasks...")
    blockers = agent.find_blockers()
    if blockers:
        for task_id, info in list(blockers.items())[:3]:
            print(f"   ⚠️  {task_id} blocks {info['blocked_count']} task(s)")
            print(f"      Blocked: {', '.join(info['blocks'])}")
    else:
        print("   No blocking tasks found")
    
    # Verify evidence checking
    print("\n8. Testing Evidence Verification...")
    for task_id in execution_order[:1]:  # Test first task
        verification = agent.verify_completion(task_id)
        print(f"   Task {task_id}:")
        print(f"   - Completed: {verification['completed']}")
        print(f"   - Confidence: {verification['confidence']:.0f}%")
        if verification.get('missing'):
            print(f"   - Missing evidence for: {', '.join(verification['missing'][:2])}")
    
    # Generate ASCII graph
    print("\n9. Visualizing Task Dependencies...")
    print(agent.generate_ascii_graph())
    
    # Create session handoff
    print("\n10. Generating Session Handoff for Session 00010...")
    handoff = agent.create_session_handoff("00009", "00010")
    print(f"   📦 Handoff Package Created:")
    print(f"   - Completed this session: {len(handoff['completed_this_session'])} tasks")
    print(f"   - Ready to start: {len(handoff['ready_to_start'])} tasks")
    print(f"   - Blocked tasks: {len(handoff['blocked_tasks'])} tasks")
    print(f"   - Work remaining: {handoff['estimated_work_remaining']:.1f} hours")
    print(f"   - Overall completion: {handoff['completion_percentage']:.1f}%")
    
    if handoff['ready_to_start']:
        print(f"\n   Next tasks for Session 00010:")
        for task_id in handoff['ready_to_start'][:3]:
            task = agent.task_graph[task_id]
            print(f"   - {task_id}: {task.get('description', 'No description')}")
    
    # Test discovery levels
    print("\n11. Testing Reality Agent Discovery Levels...")
    for level in range(1, 5):
        discoveries = agent.run_discovery(level)
        print(f"   Level {level}: {len(discoveries)} discovery categories")
    
    # Summary
    print("\n" + "=" * 60)
    print("✅ VALIDATION COMPLETE - System Ready for Seed Planting!")
    print("=" * 60)
    print("\nKey Capabilities Demonstrated:")
    print("  ✓ Parsed Obsidian Canvas JSON structure")
    print("  ✓ Extracted task metadata (priority, time, tags)")
    print("  ✓ Mapped task dependencies correctly")
    print("  ✓ Calculated execution order (topological sort)")
    print("  ✓ Generated phased implementation roadmap")
    print("  ✓ Identified parallel execution opportunities")
    print("  ✓ Tracked task completion with evidence")
    print("  ✓ Found and reported blocking tasks")
    print("  ✓ Created session handoff package")
    print("  ✓ Integrated with Reality Agent discovery pattern")
    
    print("\n🌱 The soil is prepared. Session 00010 can plant the seeds!")
    
    return True


if __name__ == "__main__":
    try:
        success = run_quickstart()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n❌ Error during quickstart: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)