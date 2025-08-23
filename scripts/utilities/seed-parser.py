# Attribution: created by Session 00009 on 2025-08-15 12:00:44 UTC
# Intent: Parse Obsidian Canvas JSON and Database Schema SQL into task graphs
# Task: unknown - No task context set
# Session: 00009
#!/usr/bin/env python3
"""
Seed Parser - Obsidian Canvas JSON and Database Schema Processor
Converts complex seed documents into trackable task graphs

Session 00009 Implementation
"""

import json
import re
import sys
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any, Optional, Tuple


class ObsidianCanvasParser:
    """Parse Obsidian Canvas JSON into structured task graph"""
    
    def __init__(self):
        self.name = "Obsidian Canvas Parser"
        self.version = "1.0.0"
    
    def parse_canvas(self, canvas_json: str) -> Dict[str, Any]:
        """Extract tasks and dependencies from Obsidian Canvas JSON"""
        try:
            data = json.loads(canvas_json)
        except json.JSONDecodeError as e:
            return {
                "error": f"Invalid JSON: {e}",
                "tasks": {},
                "edges": []
            }
        
        tasks = {}
        edges = []
        
        # Parse nodes as tasks
        for node in data.get("nodes", []):
            task_id = node["id"]
            text = node.get("text", "")
            
            # Extract metadata from node text
            metadata = self._extract_metadata(text)
            
            tasks[task_id] = {
                "id": task_id,
                "text": text,
                "description": metadata.get("clean_text", text),
                "type": node.get("type", "text"),
                "position": {
                    "x": node.get("x", 0),
                    "y": node.get("y", 0),
                    "width": node.get("width", 250),
                    "height": node.get("height", 60)
                },
                "color": node.get("color"),
                "priority": metadata.get("priority", 2),
                "estimated_hours": metadata.get("estimated_hours", 4.0),
                "assignee": metadata.get("assignee"),
                "tags": metadata.get("tags", []),
                "acceptance_criteria": metadata.get("acceptance_criteria", []),
                "depends_on": [],  # Will be populated from edges
                "intent": metadata.get("intent", ""),
                "complexity": metadata.get("complexity", "medium")
            }
        
        # Parse edges as dependencies
        for edge in data.get("edges", []):
            edge_id = edge.get("id", f"edge_{len(edges)}")
            from_node = edge.get("fromNode")
            to_node = edge.get("toNode")
            label = edge.get("label", "depends_on")
            
            if from_node and to_node:
                edges.append({
                    "id": edge_id,
                    "from": from_node,
                    "to": to_node,
                    "label": label,
                    "type": self._classify_edge_type(label)
                })
                
                # Build dependency relationships
                if label in ["depends_on", "requires", "needs", "after"]:
                    # to_node depends on from_node
                    if to_node in tasks:
                        tasks[to_node]["depends_on"].append(from_node)
                elif label in ["blocks", "enables", "before"]:
                    # from_node depends on to_node (reverse)
                    if from_node in tasks:
                        tasks[from_node]["depends_on"].append(to_node)
        
        # Calculate task metrics
        stats = self._calculate_stats(tasks, edges)
        
        # Identify issues
        issues = self._identify_issues(tasks, edges)
        
        return {
            "tasks": tasks,
            "edges": edges,
            "stats": stats,
            "issues": issues,
            "metadata": {
                "parser": self.name,
                "version": self.version,
                "parsed_at": datetime.utcnow().isoformat(),
                "canvas_version": data.get("version", "unknown")
            }
        }
    
    def _extract_metadata(self, text: str) -> Dict[str, Any]:
        """Extract structured metadata from task text"""
        metadata = {
            "clean_text": text,
            "tags": [],
            "acceptance_criteria": []
        }
        
        # Extract priority: [P0], [P1], [P2], [URGENT], [HIGH], [LOW]
        priority_patterns = [
            (r'\[P0\]|\[URGENT\]|\[CRITICAL\]', 0),
            (r'\[P1\]|\[HIGH\]|\[IMPORTANT\]', 1),
            (r'\[P2\]|\[MEDIUM\]|\[NORMAL\]', 2),
            (r'\[P3\]|\[LOW\]|\[MINOR\]', 3)
        ]
        
        priority = 2  # Default medium priority
        for pattern, p in priority_patterns:
            if re.search(pattern, text, re.IGNORECASE):
                priority = p
                break
        metadata["priority"] = priority
        
        # Extract time estimates: (2h), (30m), (1.5h), (2d), (1w)
        time_patterns = [
            (r'\((\d+(?:\.\d+)?)h\)', 1),      # hours
            (r'\((\d+(?:\.\d+)?)m\)', 1/60),   # minutes
            (r'\((\d+(?:\.\d+)?)d\)', 8),      # days (8h each)
            (r'\((\d+(?:\.\d+)?)w\)', 40),     # weeks (40h each)
        ]
        
        estimated_hours = 4.0  # Default 4 hours
        for pattern, multiplier in time_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                estimated_hours = float(match.group(1)) * multiplier
                break
        metadata["estimated_hours"] = estimated_hours
        
        # Extract assignee: @session10, @brian, @team
        assignee_match = re.search(r'@(\w+)', text)
        if assignee_match:
            metadata["assignee"] = assignee_match.group(1)
        
        # Extract tags: #backend, #frontend, #database, #api
        tags = re.findall(r'#(\w+)', text)
        metadata["tags"] = tags
        
        # Extract complexity: {easy}, {medium}, {hard}, {complex}
        complexity_patterns = [
            (r'\{easy\}|\{simple\}|\{trivial\}', 'easy'),
            (r'\{medium\}|\{normal\}|\{standard\}', 'medium'),
            (r'\{hard\}|\{difficult\}|\{challenging\}', 'hard'),
            (r'\{complex\}|\{advanced\}|\{expert\}', 'complex')
        ]
        
        complexity = "medium"  # Default
        for pattern, c in complexity_patterns:
            if re.search(pattern, text, re.IGNORECASE):
                complexity = c
                break
        metadata["complexity"] = complexity
        
        # Extract intent: intent:"reason for this task"
        intent_match = re.search(r'intent:\s*["\']([^"\']+)["\']', text, re.IGNORECASE)
        if intent_match:
            metadata["intent"] = intent_match.group(1)
        
        # Extract acceptance criteria: criteria:"file exists" criteria:"tests pass"
        criteria_matches = re.findall(r'criteria:\s*["\']([^"\']+)["\']', text, re.IGNORECASE)
        if criteria_matches:
            metadata["acceptance_criteria"] = criteria_matches
        
        # Clean text by removing metadata markers
        clean_text = text
        patterns_to_remove = [
            r'\[P\d\]', r'\[URGENT\]', r'\[HIGH\]', r'\[MEDIUM\]', r'\[LOW\]',
            r'\[CRITICAL\]', r'\[IMPORTANT\]', r'\[NORMAL\]', r'\[MINOR\]',
            r'\(\d+(?:\.\d+)?[hmwd]\)', r'@\w+', r'#\w+',
            r'\{\w+\}', r'intent:\s*["\'][^"\']+["\']',
            r'criteria:\s*["\'][^"\']+["\']'
        ]
        
        for pattern in patterns_to_remove:
            clean_text = re.sub(pattern, '', clean_text, flags=re.IGNORECASE)
        
        # Clean up whitespace
        clean_text = re.sub(r'\s+', ' ', clean_text).strip()
        metadata["clean_text"] = clean_text
        
        return metadata
    
    def _classify_edge_type(self, label: str) -> str:
        """Classify edge relationship type"""
        label_lower = label.lower()
        
        if label_lower in ["depends_on", "requires", "needs", "after"]:
            return "dependency"
        elif label_lower in ["blocks", "enables", "before"]:
            return "blocker"
        elif label_lower in ["related_to", "connects_to", "links_to"]:
            return "association"
        elif label_lower in ["implements", "extends", "inherits"]:
            return "implementation"
        else:
            return "unknown"
    
    def _calculate_stats(self, tasks: Dict, edges: List) -> Dict[str, Any]:
        """Calculate canvas statistics"""
        if not tasks:
            return {
                "total_tasks": 0,
                "total_dependencies": 0,
                "independent_tasks": 0,
                "max_depth": 0,
                "total_estimated_hours": 0,
                "priority_distribution": {}
            }
        
        # Basic counts
        total_tasks = len(tasks)
        total_dependencies = sum(len(t.get("depends_on", [])) for t in tasks.values())
        independent_tasks = sum(1 for t in tasks.values() if not t.get("depends_on"))
        
        # Calculate dependency depth
        max_depth = self._calculate_max_depth(tasks)
        
        # Time estimates
        total_estimated_hours = sum(t.get("estimated_hours", 4) for t in tasks.values())
        
        # Priority distribution
        priority_dist = {}
        for task in tasks.values():
            p = task.get("priority", 2)
            priority_dist[f"P{p}"] = priority_dist.get(f"P{p}", 0) + 1
        
        # Tag analysis
        all_tags = []
        for task in tasks.values():
            all_tags.extend(task.get("tags", []))
        tag_counts = {}
        for tag in all_tags:
            tag_counts[tag] = tag_counts.get(tag, 0) + 1
        
        return {
            "total_tasks": total_tasks,
            "total_dependencies": total_dependencies,
            "independent_tasks": independent_tasks,
            "max_dependency_depth": max_depth,
            "total_estimated_hours": total_estimated_hours,
            "average_hours_per_task": total_estimated_hours / total_tasks if total_tasks > 0 else 0,
            "priority_distribution": priority_dist,
            "tag_distribution": tag_counts,
            "complexity_distribution": {
                complexity: sum(1 for t in tasks.values() if t.get("complexity") == complexity)
                for complexity in ["easy", "medium", "hard", "complex"]
            }
        }
    
    def _calculate_max_depth(self, tasks: Dict) -> int:
        """Calculate maximum dependency depth"""
        if not tasks:
            return 0
        
        memo = {}
        
        def get_depth(task_id: str, visited: set = None) -> int:
            if visited is None:
                visited = set()
            
            if task_id in visited:
                return 0  # Circular dependency
            
            if task_id in memo:
                return memo[task_id]
            
            if task_id not in tasks:
                return 0
            
            visited.add(task_id)
            deps = tasks[task_id].get("depends_on", [])
            
            if not deps:
                depth = 1
            else:
                depth = 1 + max(get_depth(dep, visited.copy()) for dep in deps)
            
            memo[task_id] = depth
            return depth
        
        return max(get_depth(task_id) for task_id in tasks.keys())
    
    def _identify_issues(self, tasks: Dict, edges: List) -> List[Dict[str, Any]]:
        """Identify potential issues in the canvas"""
        issues = []
        
        # Check for orphaned tasks
        orphaned = [
            tid for tid, task in tasks.items()
            if not task.get("depends_on") and 
               not any(edge["from"] == tid for edge in edges)
        ]
        if orphaned:
            issues.append({
                "type": "orphaned_tasks",
                "severity": "warning",
                "message": f"{len(orphaned)} tasks have no dependencies or dependents",
                "tasks": orphaned
            })
        
        # Check for circular dependencies
        circular = self._find_circular_dependencies(tasks)
        if circular:
            issues.append({
                "type": "circular_dependencies",
                "severity": "error",
                "message": "Circular dependencies detected",
                "cycles": circular
            })
        
        # Check for missing metadata
        missing_estimates = [
            tid for tid, task in tasks.items()
            if not task.get("estimated_hours") or task.get("estimated_hours") == 4.0
        ]
        if missing_estimates:
            issues.append({
                "type": "missing_estimates",
                "severity": "info",
                "message": f"{len(missing_estimates)} tasks using default time estimates",
                "tasks": missing_estimates
            })
        
        # Check for tasks without acceptance criteria
        missing_criteria = [
            tid for tid, task in tasks.items()
            if not task.get("acceptance_criteria")
        ]
        if missing_criteria:
            issues.append({
                "type": "missing_criteria",
                "severity": "warning",
                "message": f"{len(missing_criteria)} tasks without acceptance criteria",
                "tasks": missing_criteria
            })
        
        return issues
    
    def _find_circular_dependencies(self, tasks: Dict) -> List[List[str]]:
        """Find circular dependency chains"""
        cycles = []
        visited = set()
        rec_stack = set()
        
        def dfs(task_id: str, path: List[str]) -> bool:
            if task_id in rec_stack:
                # Found cycle
                cycle_start = path.index(task_id)
                cycle = path[cycle_start:] + [task_id]
                cycles.append(cycle)
                return True
            
            if task_id in visited:
                return False
            
            visited.add(task_id)
            rec_stack.add(task_id)
            path.append(task_id)
            
            task = tasks.get(task_id, {})
            for dep in task.get("depends_on", []):
                if dep in tasks:
                    dfs(dep, path.copy())
            
            rec_stack.remove(task_id)
            return False
        
        for task_id in tasks:
            if task_id not in visited:
                dfs(task_id, [])
        
        return cycles


class DatabaseSchemaParser:
    """Parse database schema SQL into implementation requirements"""
    
    def __init__(self):
        self.name = "Database Schema Parser"
        self.version = "1.0.0"
    
    def parse_schema(self, schema_sql: str, dialect: str = "postgresql") -> Dict[str, Any]:
        """Extract tables and relationships from SQL schema"""
        
        tables = {}
        relationships = []
        constraints = []
        indexes = []
        
        # Clean up SQL
        sql = self._clean_sql(schema_sql)
        
        # Parse CREATE TABLE statements
        table_matches = re.finditer(
            r'CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(\w+)\s*\((.*?)\)(?:\s*WITH\s*\([^)]*\))?;',
            sql, 
            re.DOTALL | re.IGNORECASE
        )
        
        for match in table_matches:
            table_name = match.group(1).lower()
            columns_text = match.group(2)
            
            # Parse columns and constraints
            table_def = self._parse_table_definition(table_name, columns_text)
            tables[table_name] = table_def
            
            # Extract foreign key relationships
            for fk in table_def.get("foreign_keys", []):
                relationships.append({
                    "from_table": table_name,
                    "from_column": fk["column"],
                    "to_table": fk["references_table"],
                    "to_column": fk["references_column"],
                    "type": "foreign_key",
                    "constraint_name": fk.get("constraint_name")
                })
        
        # Parse CREATE INDEX statements
        index_matches = re.finditer(
            r'CREATE\s+(?:UNIQUE\s+)?INDEX\s+(?:IF\s+NOT\s+EXISTS\s+)?(\w+)\s+ON\s+(\w+)\s*\((.*?)\)',
            sql,
            re.IGNORECASE
        )
        
        for match in index_matches:
            indexes.append({
                "name": match.group(1),
                "table": match.group(2).lower(),
                "columns": [col.strip() for col in match.group(3).split(',')]
            })
        
        # Parse ALTER TABLE statements for additional constraints
        alter_matches = re.finditer(
            r'ALTER\s+TABLE\s+(\w+)\s+ADD\s+CONSTRAINT\s+(\w+)\s+(.*?);',
            sql,
            re.IGNORECASE
        )
        
        for match in alter_matches:
            constraints.append({
                "table": match.group(1).lower(),
                "name": match.group(2),
                "definition": match.group(3)
            })
        
        # Generate statistics
        stats = self._calculate_schema_stats(tables, relationships, indexes)
        
        return {
            "tables": tables,
            "relationships": relationships,
            "indexes": indexes,
            "constraints": constraints,
            "stats": stats,
            "metadata": {
                "parser": self.name,
                "version": self.version,
                "dialect": dialect,
                "parsed_at": datetime.utcnow().isoformat()
            }
        }
    
    def _clean_sql(self, sql: str) -> str:
        """Clean and normalize SQL"""
        # Remove comments
        sql = re.sub(r'--.*?$', '', sql, flags=re.MULTILINE)
        sql = re.sub(r'/\*.*?\*/', '', sql, flags=re.DOTALL)
        
        # Normalize whitespace
        sql = re.sub(r'\s+', ' ', sql)
        
        return sql.strip()
    
    def _parse_table_definition(self, table_name: str, columns_text: str) -> Dict[str, Any]:
        """Parse table column definitions and constraints"""
        
        columns = []
        foreign_keys = []
        constraints = []
        
        # Split by commas, but be careful with nested parentheses
        parts = self._split_table_parts(columns_text)
        
        for part in parts:
            part = part.strip()
            if not part:
                continue
            
            # Check if this is a constraint
            if re.match(r'(CONSTRAINT|PRIMARY\s+KEY|FOREIGN\s+KEY|UNIQUE|CHECK)', part, re.IGNORECASE):
                constraint = self._parse_constraint(part)
                constraints.append(constraint)
                
                # Extract foreign key information
                if constraint.get("type") == "foreign_key":
                    foreign_keys.append(constraint)
            else:
                # This is a column definition
                column = self._parse_column_definition(part)
                if column:
                    columns.append(column)
        
        return {
            "name": table_name,
            "columns": columns,
            "foreign_keys": foreign_keys,
            "constraints": constraints,
            "primary_key": self._find_primary_key(columns, constraints),
            "indexes": []  # Will be populated from CREATE INDEX statements
        }
    
    def _split_table_parts(self, text: str) -> List[str]:
        """Split table definition by commas, respecting parentheses"""
        parts = []
        current = ""
        paren_depth = 0
        
        for char in text:
            if char == '(':
                paren_depth += 1
            elif char == ')':
                paren_depth -= 1
            elif char == ',' and paren_depth == 0:
                parts.append(current)
                current = ""
                continue
            
            current += char
        
        if current.strip():
            parts.append(current)
        
        return parts
    
    def _parse_column_definition(self, definition: str) -> Optional[Dict[str, Any]]:
        """Parse a single column definition"""
        # Basic pattern: column_name data_type [constraints...]
        match = re.match(r'(\w+)\s+([^\s]+)(.*)$', definition.strip(), re.IGNORECASE)
        if not match:
            return None
        
        column_name = match.group(1).lower()
        data_type = match.group(2).upper()
        constraints_text = match.group(3).strip()
        
        # Parse constraints
        constraints = []
        nullable = True
        default_value = None
        
        if re.search(r'\bNOT\s+NULL\b', constraints_text, re.IGNORECASE):
            nullable = False
            constraints.append("NOT NULL")
        
        if re.search(r'\bPRIMARY\s+KEY\b', constraints_text, re.IGNORECASE):
            constraints.append("PRIMARY KEY")
            nullable = False
        
        if re.search(r'\bUNIQUE\b', constraints_text, re.IGNORECASE):
            constraints.append("UNIQUE")
        
        # Extract default value
        default_match = re.search(r'DEFAULT\s+([^,\s]+)', constraints_text, re.IGNORECASE)
        if default_match:
            default_value = default_match.group(1)
        
        return {
            "name": column_name,
            "type": data_type,
            "nullable": nullable,
            "default": default_value,
            "constraints": constraints
        }
    
    def _parse_constraint(self, definition: str) -> Dict[str, Any]:
        """Parse constraint definition"""
        definition = definition.strip()
        
        # FOREIGN KEY constraint
        fk_match = re.search(
            r'(?:CONSTRAINT\s+(\w+)\s+)?FOREIGN\s+KEY\s*\(([^)]+)\)\s+REFERENCES\s+(\w+)\s*\(([^)]+)\)',
            definition,
            re.IGNORECASE
        )
        if fk_match:
            return {
                "type": "foreign_key",
                "constraint_name": fk_match.group(1),
                "column": fk_match.group(2).strip(),
                "references_table": fk_match.group(3).lower(),
                "references_column": fk_match.group(4).strip()
            }
        
        # PRIMARY KEY constraint
        pk_match = re.search(r'PRIMARY\s+KEY\s*\(([^)]+)\)', definition, re.IGNORECASE)
        if pk_match:
            return {
                "type": "primary_key",
                "columns": [col.strip() for col in pk_match.group(1).split(',')]
            }
        
        # UNIQUE constraint
        unique_match = re.search(r'UNIQUE\s*\(([^)]+)\)', definition, re.IGNORECASE)
        if unique_match:
            return {
                "type": "unique",
                "columns": [col.strip() for col in unique_match.group(1).split(',')]
            }
        
        # CHECK constraint
        check_match = re.search(r'CHECK\s*\((.+)\)', definition, re.IGNORECASE)
        if check_match:
            return {
                "type": "check",
                "condition": check_match.group(1)
            }
        
        return {
            "type": "unknown",
            "definition": definition
        }
    
    def _find_primary_key(self, columns: List[Dict], constraints: List[Dict]) -> Optional[List[str]]:
        """Find primary key column(s)"""
        # Check column-level PRIMARY KEY
        pk_columns = [col["name"] for col in columns if "PRIMARY KEY" in col.get("constraints", [])]
        if pk_columns:
            return pk_columns
        
        # Check table-level PRIMARY KEY constraint
        for constraint in constraints:
            if constraint.get("type") == "primary_key":
                return constraint.get("columns", [])
        
        return None
    
    def _calculate_schema_stats(self, tables: Dict, relationships: List, indexes: List) -> Dict[str, Any]:
        """Calculate schema statistics"""
        if not tables:
            return {
                "total_tables": 0,
                "total_columns": 0,
                "total_relationships": 0,
                "total_indexes": 0
            }
        
        total_columns = sum(len(table.get("columns", [])) for table in tables.values())
        
        # Analyze relationships
        relationship_types = {}
        for rel in relationships:
            rel_type = rel.get("type", "unknown")
            relationship_types[rel_type] = relationship_types.get(rel_type, 0) + 1
        
        # Find tables without relationships
        tables_with_fks = set(rel["from_table"] for rel in relationships)
        tables_referenced = set(rel["to_table"] for rel in relationships)
        connected_tables = tables_with_fks | tables_referenced
        isolated_tables = set(tables.keys()) - connected_tables
        
        return {
            "total_tables": len(tables),
            "total_columns": total_columns,
            "average_columns_per_table": total_columns / len(tables) if tables else 0,
            "total_relationships": len(relationships),
            "total_indexes": len(indexes),
            "relationship_types": relationship_types,
            "isolated_tables": len(isolated_tables),
            "connected_tables": len(connected_tables),
            "connectivity_ratio": len(connected_tables) / len(tables) if tables else 0
        }
    
    def generate_implementation_tasks(self, schema: Dict, session_id: str = "00010") -> List[Dict[str, Any]]:
        """Generate implementation tasks from parsed schema"""
        tasks = []
        
        # Migration tasks for each table
        for table_name, table_def in schema.get("tables", {}).items():
            task_id = f"create_table_{table_name}"
            
            # Generate acceptance criteria
            criteria = [
                f"Table {table_name} exists in database",
                f"All {len(table_def.get('columns', []))} columns defined with correct types"
            ]
            
            if table_def.get("primary_key"):
                criteria.append(f"Primary key constraint exists on {', '.join(table_def['primary_key'])}")
            
            if table_def.get("foreign_keys"):
                criteria.append(f"All {len(table_def['foreign_keys'])} foreign key constraints created")
            
            # Estimate time based on complexity
            column_count = len(table_def.get("columns", []))
            fk_count = len(table_def.get("foreign_keys", []))
            estimated_hours = 1 + (column_count * 0.1) + (fk_count * 0.5)
            
            tasks.append({
                "id": task_id,
                "description": f"Create {table_name} table with {column_count} columns",
                "type": "database_migration",
                "priority": 0 if fk_count == 0 else 1,  # Tables without FKs first
                "estimated_hours": round(estimated_hours, 1),
                "acceptance_criteria": criteria,
                "tags": ["database", "migration", "sql"],
                "depends_on": [],  # Will be set based on foreign keys
                "intent": f"Create database table for {table_name} entity storage",
                "session_id": session_id
            })
        
        # Add dependencies based on foreign keys
        for rel in schema.get("relationships", []):
            if rel.get("type") == "foreign_key":
                from_task = f"create_table_{rel['from_table']}"
                to_task = f"create_table_{rel['to_table']}"
                
                # Find the task and add dependency
                for task in tasks:
                    if task["id"] == from_task:
                        if to_task not in task["depends_on"]:
                            task["depends_on"].append(to_task)
        
        # Index creation tasks
        for index in schema.get("indexes", []):
            task_id = f"create_index_{index['name']}"
            table_task = f"create_table_{index['table']}"
            
            tasks.append({
                "id": task_id,
                "description": f"Create index {index['name']} on {index['table']}",
                "type": "database_index",
                "priority": 2,  # Lower priority than tables
                "estimated_hours": 0.5,
                "acceptance_criteria": [
                    f"Index {index['name']} exists on table {index['table']}",
                    f"Query performance improved for columns: {', '.join(index['columns'])}"
                ],
                "tags": ["database", "performance", "index"],
                "depends_on": [table_task] if table_task in [t["id"] for t in tasks] else [],
                "intent": f"Optimize query performance for {index['table']} table",
                "session_id": session_id
            })
        
        # Data seeding tasks (if needed)
        core_tables = ["users", "accounts", "sessions", "roles"]
        for table_name in schema.get("tables", {}).keys():
            if any(core in table_name.lower() for core in core_tables):
                task_id = f"seed_data_{table_name}"
                table_task = f"create_table_{table_name}"
                
                tasks.append({
                    "id": task_id,
                    "description": f"Seed initial data for {table_name}",
                    "type": "database_seeding",
                    "priority": 2,
                    "estimated_hours": 1.0,
                    "acceptance_criteria": [
                        f"Initial data inserted into {table_name}",
                        f"Data validation passes",
                        f"Foreign key constraints satisfied"
                    ],
                    "tags": ["database", "seeding", "data"],
                    "depends_on": [table_task],
                    "intent": f"Provide initial data required for {table_name} functionality",
                    "session_id": session_id
                })
        
        return tasks


def main():
    """Command line interface for seed parsing"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Parse seed documents into task graphs')
    parser.add_argument('--canvas', help='Path to Obsidian Canvas JSON file')
    parser.add_argument('--schema', help='Path to database schema SQL file')
    parser.add_argument('--output', choices=['json', 'text'], default='text', help='Output format')
    parser.add_argument('--tasks', action='store_true', help='Generate implementation tasks')
    
    args = parser.parse_args()
    
    if args.canvas:
        print("Parsing Obsidian Canvas...")
        canvas_parser = ObsidianCanvasParser()
        
        try:
            with open(args.canvas, 'r') as f:
                canvas_json = f.read()
            
            result = canvas_parser.parse_canvas(canvas_json)
            
            if args.output == 'json':
                print(json.dumps(result, indent=2, default=str))
            else:
                print(f"Canvas Analysis: {len(result['tasks'])} tasks, {len(result['edges'])} dependencies")
                print(f"Total estimated hours: {result['stats']['total_estimated_hours']}")
                
                if result.get('issues'):
                    print(f"\nIssues found: {len(result['issues'])}")
                    for issue in result['issues']:
                        print(f"  {issue['severity'].upper()}: {issue['message']}")
                
        except FileNotFoundError:
            print(f"Error: Canvas file not found: {args.canvas}")
            sys.exit(1)
        except Exception as e:
            print(f"Error parsing canvas: {e}")
            sys.exit(1)
    
    if args.schema:
        print("Parsing Database Schema...")
        schema_parser = DatabaseSchemaParser()
        
        try:
            with open(args.schema, 'r') as f:
                schema_sql = f.read()
            
            result = schema_parser.parse_schema(schema_sql)
            
            if args.tasks:
                tasks = schema_parser.generate_implementation_tasks(result)
                result['implementation_tasks'] = tasks
                print(f"Generated {len(tasks)} implementation tasks")
            
            if args.output == 'json':
                print(json.dumps(result, indent=2, default=str))
            else:
                stats = result['stats']
                print(f"Schema Analysis: {stats['total_tables']} tables, {stats['total_relationships']} relationships")
                print(f"Average columns per table: {stats['average_columns_per_table']:.1f}")
                print(f"Connectivity ratio: {stats['connectivity_ratio']:.2f}")
                
        except FileNotFoundError:
            print(f"Error: Schema file not found: {args.schema}")
            sys.exit(1)
        except Exception as e:
            print(f"Error parsing schema: {e}")
            sys.exit(1)


if __name__ == "__main__":
    main()