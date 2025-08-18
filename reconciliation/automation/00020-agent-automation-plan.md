# Reality Agent Automation & Validation Plan

**Session**: 00020  
**Date**: 2025-08-17  
**Purpose**: Automate Reality Agents for Requirements validation and Reconciliation automation  
**Critical Insight**: Manual extraction may have errors; automation reveals truth

---

## Executive Summary

Before proceeding with Phase 4A implementation, we must:
1. **Validate** the 154 manually extracted requirements against Canvas source files
2. **Automate** Reality Agent reconciliation to discover true gaps
3. **Establish** continuous verification pipeline
4. **Generate** task dependencies programmatically

This plan transforms our system from manual/assumed to automated/verified.

---

## Phase 1: Requirements Validation Pipeline

### 1.1 Canvas-to-Requirements Validator

```python
# reconciliation/validators/canvas_requirements_validator.py

import json
import re
from pathlib import Path

class CanvasRequirementsValidator:
    """Validate that manual requirements extraction matches Canvas source"""
    
    def __init__(self):
        self.canvas_dir = Path("requirements/canvas-requirements")
        self.stories_dir = Path("requirements/user-stories")
        self.discrepancies = []
    
    def validate_canvas_coverage(self):
        """Ensure all Canvas nodes are represented in requirements"""
        
        canvas_files = [
            "001-1. num.label.Onboarding&Directory.json",
            "002-1. seed.PlayerID Profile Box.json",
            "002-2. needlabel.Associated Teams Box.json",
            # ... all 14 files
        ]
        
        for canvas_file in canvas_files:
            canvas_data = self.load_canvas(canvas_file)
            story_coverage = self.check_story_coverage(canvas_data)
            
            if story_coverage < 0.9:  # 90% threshold
                self.discrepancies.append({
                    "canvas": canvas_file,
                    "coverage": story_coverage,
                    "missing_nodes": self.find_missing_nodes(canvas_data)
                })
    
    def validate_requirement_accuracy(self):
        """Check if user stories accurately reflect Canvas intent"""
        
        # Pattern matching for common misinterpretations
        patterns = {
            "authentication": ["login", "signup", "password", "email"],
            "teams": ["team", "group", "member", "role"],
            "profile": ["call_sign", "avatar", "motto", "theme"],
            "achievements": ["badge", "award", "milestone", "progress"]
        }
        
        for story_file in self.stories_dir.glob("*.md"):
            story_content = story_file.read_text()
            canvas_source = self.trace_to_canvas(story_file)
            
            if not self.verify_semantic_match(story_content, canvas_source):
                self.discrepancies.append({
                    "story": story_file.name,
                    "issue": "Semantic mismatch with Canvas source",
                    "details": self.get_mismatch_details(story_content, canvas_source)
                })
    
    def generate_validation_report(self):
        """Create comprehensive validation report"""
        
        return {
            "validation_date": "2025-08-17",
            "total_canvas_nodes": 7023,
            "total_requirements": 154,
            "coverage_percentage": self.calculate_overall_coverage(),
            "discrepancies": self.discrepancies,
            "recommendations": self.generate_recommendations()
        }
```

### 1.2 Automated Canvas Extraction Pipeline

```python
# reconciliation/extractors/canvas_extractor.py

class CanvasExtractor:
    """Automated extraction of requirements from Canvas JSON"""
    
    def extract_requirements(self, canvas_file):
        """Extract user stories directly from Canvas nodes"""
        
        with open(canvas_file) as f:
            canvas = json.load(f)
        
        requirements = []
        for node in canvas.get("nodes", []):
            if self.is_requirement_node(node):
                requirement = {
                    "id": self.generate_story_id(node),
                    "type": self.classify_node_type(node),
                    "priority": self.determine_priority(node),
                    "story": self.generate_user_story(node),
                    "acceptance_criteria": self.extract_criteria(node),
                    "canvas_source": {
                        "file": canvas_file,
                        "node_id": node.get("id"),
                        "node_text": node.get("text")
                    }
                }
                requirements.append(requirement)
        
        return requirements
    
    def generate_user_story(self, node):
        """Convert Canvas node to user story format"""
        
        # AI-assisted pattern recognition
        text = node.get("text", "")
        
        # Identify actor
        actor = self.identify_actor(text)  # Player, Supervisor, Enabler
        
        # Extract action
        action = self.extract_action(text)
        
        # Determine benefit
        benefit = self.infer_benefit(text)
        
        return f"As a {actor}, I want to {action}, so that {benefit}"
    
    def compare_with_manual(self, automated_reqs, manual_reqs):
        """Compare automated extraction with manual work"""
        
        comparison = {
            "manual_only": [],  # In manual but not automated
            "automated_only": [],  # In automated but not manual
            "both_different": [],  # In both but different
            "both_same": []  # Matching perfectly
        }
        
        # Detailed comparison logic
        return comparison
```

---

## Phase 2: Reality Agent Automation Framework

### 2.1 Reality Agent Orchestrator

```python
# reality/agent-orchestrator/orchestrator.py

class RealityAgentOrchestrator:
    """Coordinate all 7 Reality Agents for automated reconciliation"""
    
    def __init__(self):
        self.agents = {
            "filesystem": FileSystemAgent(),
            "github": GitHubAgent(),
            "supabase": SupabaseAgent(),
            "integration": IntegrationAgent(),
            "vercel": VercelAgent(),
            "static": StaticAssetAgent(),
            "task": TaskRealityAgent()
        }
        self.results = {}
    
    def run_full_reconciliation(self, requirements_path):
        """Execute complete reconciliation pipeline"""
        
        # 1. Load requirements
        requirements = self.load_requirements(requirements_path)
        
        # 2. Run each agent
        for name, agent in self.agents.items():
            print(f"Running {name} agent...")
            self.results[name] = agent.reconcile(requirements)
        
        # 3. Integration synthesis
        self.results["synthesis"] = self.agents["integration"].synthesize(
            self.results
        )
        
        # 4. Generate task graph
        self.results["tasks"] = self.agents["task"].create_dependency_graph(
            requirements,
            self.results["synthesis"]
        )
        
        return self.results
    
    def generate_gap_report(self):
        """Create unified gap analysis from all agents"""
        
        gaps = {
            "critical": [],  # Blocks everything
            "high": [],      # Blocks major features
            "medium": [],    # Blocks some features
            "low": []        # Nice to have
        }
        
        # Filesystem gaps
        for missing_file in self.results["filesystem"]["missing"]:
            priority = self.determine_priority(missing_file)
            gaps[priority].append({
                "type": "file",
                "item": missing_file,
                "requirement": self.trace_to_requirement(missing_file)
            })
        
        # Database gaps
        for missing_table in self.results["supabase"]["missing_tables"]:
            gaps["critical"].append({
                "type": "database",
                "item": missing_table,
                "requirement": self.trace_to_requirement(missing_table)
            })
        
        return gaps
    
    def generate_implementation_tasks(self):
        """Convert gaps to actionable tasks"""
        
        tasks = []
        gaps = self.generate_gap_report()
        dependencies = self.results["tasks"]
        
        for priority in ["critical", "high", "medium", "low"]:
            for gap in gaps[priority]:
                task = {
                    "id": self.generate_task_id(gap),
                    "title": self.generate_task_title(gap),
                    "description": self.generate_task_description(gap),
                    "priority": priority,
                    "dependencies": dependencies.get(gap["requirement"], []),
                    "verification": self.generate_verification_steps(gap),
                    "estimated_hours": self.estimate_effort(gap)
                }
                tasks.append(task)
        
        return tasks
```

### 2.2 Individual Agent Enhancements

```python
# reality/agent-reality-auditor/filesystem-connector/reconciliation_mode.py

class FileSystemReconciliation:
    """Enhanced FileSystem Agent for reconciliation"""
    
    def reconcile_requirements(self, requirements):
        """Map requirements to expected files"""
        
        expected_files = {
            # From US-001: Player Registration
            "auth/signup.html": "US-001",
            "auth/signup.js": "US-001",
            
            # From US-003: Profile Creation
            "js/profile.js": "US-003",
            "js/callsign-validator.js": "US-003",
            
            # From US-028: Dashboard
            "dashboard.html": "US-028",
            "js/dashboard.js": "US-028",
            "css/dashboard.css": "US-028",
            
            # From US-029: Achievements
            "js/achievements.js": "US-029",
            "assets/badges/": "US-029",
            
            # ... map all 154 requirements
        }
        
        missing = []
        for expected_path, requirement_id in expected_files.items():
            if not Path(expected_path).exists():
                missing.append({
                    "path": expected_path,
                    "requirement": requirement_id,
                    "type": self.determine_file_type(expected_path)
                })
        
        return {
            "expected": len(expected_files),
            "found": len(expected_files) - len(missing),
            "missing": missing,
            "coverage": (len(expected_files) - len(missing)) / len(expected_files)
        }
```

```python
# reality/agent-reality-auditor/supabase-connector/reconciliation_mode.py

class SupabaseReconciliation:
    """Enhanced Supabase Agent for schema reconciliation"""
    
    def reconcile_schema(self, requirements):
        """Compare required schema with actual database"""
        
        required_schema = {
            "profiles": {
                "fields": [
                    "id", "user_id", "call_sign", "grade_level",
                    "theme_color", "emcoin_balance", "experience_points",
                    "level", "motto", "avatar_url", "today_count",
                    "total_views", "created_at", "updated_at"
                ],
                "requirements": ["US-003", "US-028", "US-030", "US-033"]
            },
            "teams": {
                "fields": [
                    "id", "name", "logo_url", "theme_color", "motto",
                    "genre", "division", "status", "founder_id",
                    "created_at", "updated_at"
                ],
                "requirements": ["US-016", "US-017"]
            },
            "achievements": {
                "fields": [
                    "id", "player_id", "achievement_type", "achievement_name",
                    "earned_date", "emcoin_reward", "experience_reward"
                ],
                "requirements": ["US-029", "US-073", "US-074"]
            },
            # ... all required tables
        }
        
        actual_schema = self.fetch_current_schema()
        
        gaps = {
            "missing_tables": [],
            "missing_fields": {},
            "type_mismatches": {}
        }
        
        for table_name, table_spec in required_schema.items():
            if table_name not in actual_schema:
                gaps["missing_tables"].append({
                    "table": table_name,
                    "requirements": table_spec["requirements"]
                })
            else:
                # Check fields
                actual_fields = actual_schema[table_name]["fields"]
                for required_field in table_spec["fields"]:
                    if required_field not in actual_fields:
                        if table_name not in gaps["missing_fields"]:
                            gaps["missing_fields"][table_name] = []
                        gaps["missing_fields"][table_name].append(required_field)
        
        return gaps
```

### 2.3 Task Reality Agent Enhancement

```python
# reality/agent-reality-auditor/task-reality-agent/dependency_mapper.py

class TaskDependencyMapper:
    """Create implementation dependency graph from requirements"""
    
    def create_dependency_graph(self, requirements, gaps):
        """Build directed acyclic graph of implementation tasks"""
        
        graph = nx.DiGraph()
        
        # Add nodes for each requirement
        for req in requirements:
            graph.add_node(req["id"], **req)
        
        # Add edges based on dependencies
        dependencies = {
            "US-001": [],  # Authentication has no deps
            "US-003": ["US-001"],  # Profile needs auth
            "US-028": ["US-003"],  # Dashboard needs profile
            "US-016": ["US-003"],  # Teams need profile
            "US-029": ["US-028"],  # Achievements need dashboard
            "US-030": ["US-028"],  # Today counter needs dashboard
            # ... all 154 dependencies
        }
        
        for req_id, deps in dependencies.items():
            for dep in deps:
                graph.add_edge(dep, req_id)
        
        # Calculate critical path
        critical_path = nx.dag_longest_path(graph)
        
        # Generate implementation order
        implementation_order = list(nx.topological_sort(graph))
        
        # Identify parallel work opportunities
        parallel_groups = self.identify_parallel_work(graph)
        
        return {
            "graph": graph,
            "critical_path": critical_path,
            "implementation_order": implementation_order,
            "parallel_groups": parallel_groups,
            "estimated_duration": self.estimate_total_duration(graph)
        }
    
    def generate_gantt_chart(self, graph):
        """Create Gantt chart from dependency graph"""
        
        gantt_data = []
        for node in nx.topological_sort(graph):
            task = {
                "id": node,
                "name": graph.nodes[node]["title"],
                "start": self.calculate_start_date(node, graph),
                "duration": graph.nodes[node]["estimated_hours"],
                "dependencies": list(graph.predecessors(node))
            }
            gantt_data.append(task)
        
        return gantt_data
```

---

## Phase 3: Continuous Integration Pipeline

### 3.1 Automated Verification Pipeline

```bash
#!/bin/bash
# reconciliation/scripts/continuous-reconciliation.sh

# Run every time code changes
while true; do
    echo "Starting reconciliation cycle..."
    
    # 1. Validate requirements haven't drifted
    python3 reconciliation/validators/canvas_requirements_validator.py \
        --output reconciliation/reports/requirements-validation.json
    
    # 2. Run Reality Agent reconciliation
    python3 reality/agent-orchestrator/orchestrator.py \
        --requirements requirements/user-stories/*.md \
        --output reconciliation/reports/reality-gaps.json
    
    # 3. Generate implementation tasks
    python3 reconciliation/generators/task_generator.py \
        --gaps reconciliation/reports/reality-gaps.json \
        --output reconciliation/tasks/current-tasks.md
    
    # 4. Update TodoWrite
    python3 reconciliation/integrations/todo_updater.py \
        --tasks reconciliation/tasks/current-tasks.md
    
    # 5. Check for changes
    if git diff --quiet reconciliation/reports/; then
        echo "No changes detected"
    else
        echo "Changes detected - updating reports"
        git add reconciliation/reports/
        git commit -m "Automated reconciliation update $(date)"
    fi
    
    # Wait for changes
    inotifywait -r -e modify requirements/ reality/ 2>/dev/null || sleep 300
done
```

### 3.2 GitHub Actions Integration

```yaml
# .github/workflows/reconciliation.yml

name: Continuous Reconciliation

on:
  push:
    paths:
      - 'requirements/**'
      - 'reality/**'
      - '**.html'
      - '**.js'
      - '**.css'
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours

jobs:
  reconcile:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Python
      uses: actions/setup-python@v2
      with:
        python-version: '3.9'
    
    - name: Install dependencies
      run: |
        pip install -r requirements.txt
        pip install networkx pandas
    
    - name: Validate Requirements
      run: |
        python3 reconciliation/validators/canvas_requirements_validator.py
    
    - name: Run Reality Agents
      env:
        SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
        SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
      run: |
        python3 reality/agent-orchestrator/orchestrator.py
    
    - name: Generate Gap Report
      run: |
        python3 reconciliation/generators/gap_report_generator.py
    
    - name: Create Implementation Tasks
      run: |
        python3 reconciliation/generators/task_generator.py
    
    - name: Update Progress Dashboard
      run: |
        python3 reconciliation/dashboard/update_dashboard.py
    
    - name: Commit Changes
      run: |
        git config --local user.email "action@github.com"
        git config --local user.name "GitHub Action"
        git add reconciliation/reports/
        git commit -m "Automated reconciliation $(date)" || echo "No changes"
        git push
```

---

## Phase 4: Implementation Verification

### 4.1 Automated Testing Against Requirements

```python
# reconciliation/verifiers/implementation_verifier.py

class ImplementationVerifier:
    """Verify implementation matches requirements"""
    
    def verify_user_story(self, story_id):
        """Check if user story is properly implemented"""
        
        story = self.load_story(story_id)
        
        # Run acceptance tests
        test_results = self.run_acceptance_tests(story["acceptance_tests"])
        
        # Check with Reality Agents
        reality_check = self.run_reality_verification(story)
        
        # Verify success criteria
        criteria_check = self.verify_success_criteria(story["success_criteria"])
        
        return {
            "story_id": story_id,
            "implemented": all([test_results, reality_check, criteria_check]),
            "test_results": test_results,
            "reality_verification": reality_check,
            "criteria_verification": criteria_check,
            "gaps": self.identify_remaining_gaps(story)
        }
    
    def run_acceptance_tests(self, tests):
        """Execute automated acceptance tests"""
        
        results = []
        for test in tests:
            if test.get("automated", False):
                result = self.execute_test(test)
            else:
                result = self.prompt_manual_test(test)
            results.append(result)
        
        return all(results)
    
    def continuous_verification(self):
        """Run verification on every change"""
        
        while True:
            for story_id in self.get_implemented_stories():
                result = self.verify_user_story(story_id)
                if not result["implemented"]:
                    self.alert_regression(story_id, result)
            
            time.sleep(60)  # Check every minute
```

---

## Phase 5: Dashboard & Monitoring

### 5.1 Reconciliation Dashboard

```python
# reconciliation/dashboard/dashboard.py

from flask import Flask, render_template, jsonify
import json

app = Flask(__name__)

@app.route('/')
def dashboard():
    """Main reconciliation dashboard"""
    
    data = {
        "requirements_validation": load_validation_results(),
        "reality_gaps": load_gap_analysis(),
        "implementation_progress": calculate_progress(),
        "dependency_graph": load_dependency_graph(),
        "critical_path": load_critical_path(),
        "agent_status": get_agent_status()
    }
    
    return render_template('dashboard.html', data=data)

@app.route('/api/gaps')
def get_gaps():
    """API endpoint for current gaps"""
    
    orchestrator = RealityAgentOrchestrator()
    gaps = orchestrator.run_full_reconciliation("requirements/")
    
    return jsonify(gaps)

@app.route('/api/progress')
def get_progress():
    """API endpoint for implementation progress"""
    
    progress = {
        "total_requirements": 154,
        "implemented": count_implemented(),
        "in_progress": count_in_progress(),
        "blocked": count_blocked(),
        "not_started": count_not_started()
    }
    
    return jsonify(progress)

@app.route('/api/verify/<story_id>')
def verify_story(story_id):
    """Verify specific user story implementation"""
    
    verifier = ImplementationVerifier()
    result = verifier.verify_user_story(story_id)
    
    return jsonify(result)
```

---

## Implementation Timeline

### Week 1: Validation & Setup
- **Day 1-2**: Implement Requirements validation pipeline
- **Day 3-4**: Enhance Reality Agents with reconciliation mode
- **Day 5**: Set up orchestrator and integration

### Week 2: Automation
- **Day 6-7**: Build continuous reconciliation pipeline
- **Day 8-9**: Create task generation system
- **Day 10**: Integrate with TodoWrite and MCP tools

### Week 3: Monitoring
- **Day 11-12**: Build reconciliation dashboard
- **Day 13-14**: Set up GitHub Actions
- **Day 15**: Full system testing and documentation

---

## Expected Outcomes

### 1. Requirements Validation
- **Finding**: ~10-15% of manual extraction may have errors
- **Resolution**: Automated extraction provides ground truth
- **Benefit**: Building on verified requirements

### 2. Gap Discovery
- **Finding**: Many gaps not visible in manual analysis
- **Resolution**: Reality Agents discover all gaps
- **Benefit**: Complete implementation roadmap

### 3. Task Automation
- **Finding**: Manual task creation misses dependencies
- **Resolution**: Automated dependency graphing
- **Benefit**: Optimal implementation order

### 4. Continuous Verification
- **Finding**: Implementation drift from requirements
- **Resolution**: Continuous verification catches drift
- **Benefit**: Requirements always met

---

## Risk Mitigation

### Risk 1: Agent Complexity
- **Mitigation**: Start with simple reconciliation, enhance gradually

### Risk 2: False Positives
- **Mitigation**: Human review of critical gaps before action

### Risk 3: Performance Impact
- **Mitigation**: Run intensive checks asynchronously

### Risk 4: Integration Challenges
- **Mitigation**: Modular design, each agent independent

---

## Success Criteria

1. **All 154 requirements validated** against Canvas source
2. **100% gap coverage** from Reality Agents
3. **Automated task generation** with dependencies
4. **Continuous verification** running every commit
5. **Dashboard showing** real-time reconciliation status

---

## Conclusion

This automation plan transforms reconciliation from a manual, error-prone process to an automated, continuously verified system. By validating our Requirements work and automating gap discovery, we ensure we're building on truth, not assumptions.

**The key insight**: We have powerful Reality Agents that should be actively driving reconciliation, not just passively validating. This plan makes them the engine of our development process.

---

*Next Step: Implement Phase 1 validation before any further implementation work*