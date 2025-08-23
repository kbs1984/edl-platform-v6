#!/usr/bin/env python3
"""
Canvas Processor - Automated parallel processing of Obsidian Canvas files
Session 00011 Implementation
Runs independently for each Canvas file to extract database requirements
"""

import json
import sys
import os
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any, Optional
import argparse
import re

class CanvasProcessor:
    """Process a single Canvas file to extract database requirements"""
    
    def __init__(self, canvas_path: str, session_id: str = "00011"):
        self.canvas_path = Path(canvas_path)
        self.canvas_name = self.canvas_path.name
        self.session_id = session_id
        self.output_dir = Path("docs/canvas-analysis")
        self.output_dir.mkdir(exist_ok=True)
        
    def process(self) -> Dict[str, Any]:
        """Main processing pipeline"""
        print(f"Processing: {self.canvas_name}")
        
        # Load Canvas
        with open(self.canvas_path, 'r') as f:
            canvas_data = json.load(f)
        
        # Extract components
        analysis = {
            'canvas_file': self.canvas_name,
            'processed_at': datetime.utcnow().isoformat(),
            'session_id': self.session_id,
            'statistics': self._get_statistics(canvas_data),
            'ui_sections': self._extract_ui_sections(canvas_data),
            'user_flows': self._extract_user_flows(canvas_data),
            'data_entities': self._extract_data_entities(canvas_data),
            'required_tables': self._derive_tables(canvas_data),
            'implementation_tasks': self._create_tasks(canvas_data)
        }
        
        # Generate report
        self._generate_report(analysis)
        
        # Save to Task Reality Agent format
        self._save_to_task_agent(analysis)
        
        return analysis
    
    def _get_statistics(self, canvas_data: Dict) -> Dict:
        """Basic Canvas statistics"""
        nodes = canvas_data.get('nodes', [])
        edges = canvas_data.get('edges', [])
        
        return {
            'total_nodes': len(nodes),
            'total_edges': len(edges),
            'node_types': self._count_node_types(nodes),
            'complexity': 'simple' if len(nodes) < 50 else 'medium' if len(nodes) < 200 else 'complex'
        }
    
    def _count_node_types(self, nodes: List) -> Dict:
        """Count different types of content"""
        types = {
            'headers': 0,
            'ui_components': 0,
            'scenarios': 0,
            'data_fields': 0,
            'actions': 0
        }
        
        for node in nodes:
            text = node.get('text', '').strip()
            if not text:
                continue
                
            if text.startswith('#'):
                types['headers'] += 1
            elif '|' in text:
                types['ui_components'] += 1
            elif 'Scenario' in text:
                types['scenarios'] += 1
            elif any(keyword in text.lower() for keyword in ['button', 'submit', 'edit', 'create', 'delete']):
                types['actions'] += 1
            else:
                types['data_fields'] += 1
                
        return types
    
    def _extract_ui_sections(self, canvas_data: Dict) -> List[Dict]:
        """Extract UI sections from Canvas"""
        sections = []
        nodes = canvas_data.get('nodes', [])
        
        for node in nodes:
            text = node.get('text', '').strip()
            if text.startswith('###'):
                section_name = text.replace('#', '').strip()
                sections.append({
                    'name': section_name,
                    'node_id': node['id'],
                    'position': {'x': node.get('x', 0), 'y': node.get('y', 0)},
                    'color': node.get('color', ''),
                    'components': self._find_related_components(node, nodes, canvas_data.get('edges', []))
                })
        
        return sections
    
    def _find_related_components(self, section_node: Dict, all_nodes: List, edges: List) -> List[str]:
        """Find components related to a section"""
        components = []
        section_id = section_node['id']
        
        # Find nodes near this section (within 300px)
        sx, sy = section_node.get('x', 0), section_node.get('y', 0)
        
        for node in all_nodes:
            if node['id'] == section_id:
                continue
            nx, ny = node.get('x', 0), node.get('y', 0)
            if abs(nx - sx) < 300 and abs(ny - sy) < 200:
                text = node.get('text', '').strip()
                if text and not text.startswith('#'):
                    components.append(text[:100])  # First 100 chars
        
        return components
    
    def _extract_user_flows(self, canvas_data: Dict) -> List[Dict]:
        """Extract user scenarios and flows"""
        flows = []
        nodes = canvas_data.get('nodes', [])
        
        for node in nodes:
            text = node.get('text', '').strip()
            if 'Scenario' in text or 'Flow' in text or 'Process' in text:
                flows.append({
                    'name': text[:100],
                    'node_id': node['id'],
                    'involves': self._extract_flow_entities(text)
                })
        
        return flows
    
    def _extract_flow_entities(self, text: str) -> List[str]:
        """Extract entities mentioned in a flow"""
        entities = []
        
        # Common entities to look for
        entity_keywords = ['Player', 'Team', 'Supervisor', 'Enabler', 'Activity', 
                          'Badge', 'Resource', 'Message', 'Profile', 'Registration']
        
        for keyword in entity_keywords:
            if keyword.lower() in text.lower():
                entities.append(keyword)
        
        return entities
    
    def _extract_data_entities(self, canvas_data: Dict) -> List[Dict]:
        """Extract data entities from Canvas"""
        entities = {}
        nodes = canvas_data.get('nodes', [])
        
        # Keywords that indicate data fields
        field_indicators = ['name', 'id', 'date', 'time', 'status', 'type', 
                           'description', 'image', 'url', 'count', 'score',
                           'callSign', 'profile', 'team', 'badge', 'role']
        
        for node in nodes:
            text = node.get('text', '').strip().lower()
            for indicator in field_indicators:
                if indicator in text:
                    # Extract entity name from context
                    entity_name = self._guess_entity_from_text(text, indicator)
                    if entity_name not in entities:
                        entities[entity_name] = {
                            'name': entity_name,
                            'fields': [],
                            'references': []
                        }
                    entities[entity_name]['fields'].append(indicator)
        
        return list(entities.values())
    
    def _guess_entity_from_text(self, text: str, field: str) -> str:
        """Guess entity name from context"""
        # Simple heuristic - improve as needed
        if any(x in text for x in ['player', 'profile', 'callsign']):
            return 'profiles'
        elif 'team' in text:
            return 'teams'
        elif 'activity' in text or 'activities' in text:
            return 'activities'
        elif 'badge' in text:
            return 'badges'
        elif 'message' in text or 'comm' in text:
            return 'messages'
        elif 'resource' in text:
            return 'resources'
        else:
            return 'unknown'
    
    def _derive_tables(self, canvas_data: Dict) -> List[Dict]:
        """Derive database tables from Canvas analysis"""
        tables = []
        
        # Analyze all text content
        all_text = ' '.join([node.get('text', '') for node in canvas_data.get('nodes', [])])
        
        # Define table detection patterns
        table_patterns = {
            'profiles': ['profile', 'callsign', 'player id', 'user', 'avatar'],
            'teams': ['team', 'founder', 'mate', 'clan', 'group'],
            'activities': ['activity', 'activities', 'registrar', 'register', 'event'],
            'badges': ['badge', 'achievement', 'earned', 'award'],
            'messages': ['message', 'comm', 'notification', 'invite'],
            'resources': ['resource', 'material', 'attachment', 'document'],
            'performance': ['performance', 'ranking', 'ballot', 'score', 'analytics'],
            'scholarships': ['scholarship', 'hall of game', 'hog', 'honor']
        }
        
        for table_name, keywords in table_patterns.items():
            if any(keyword in all_text.lower() for keyword in keywords):
                tables.append({
                    'name': table_name,
                    'why_needed': f"Canvas contains references to {', '.join(keywords)}",
                    'canvas_evidence': self._find_evidence_nodes(canvas_data, keywords),
                    'priority': self._determine_priority(table_name, all_text)
                })
        
        return tables
    
    def _find_evidence_nodes(self, canvas_data: Dict, keywords: List[str]) -> List[str]:
        """Find node IDs that contain evidence for this table"""
        evidence = []
        for node in canvas_data.get('nodes', []):
            text = node.get('text', '').lower()
            if any(keyword in text for keyword in keywords):
                evidence.append(node['id'])
        return evidence[:5]  # First 5 evidence nodes
    
    def _determine_priority(self, table_name: str, all_text: str) -> str:
        """Determine implementation priority"""
        # Count mentions
        mentions = all_text.lower().count(table_name[:-1])  # Remove 's' for singular
        
        if mentions > 10:
            return 'P0'
        elif mentions > 5:
            return 'P1'
        else:
            return 'P2'
    
    def _create_tasks(self, canvas_data: Dict) -> List[Dict]:
        """Create implementation tasks from Canvas"""
        tasks = []
        
        # Database tasks
        tables = self._derive_tables(canvas_data)
        for i, table in enumerate(tables):
            tasks.append({
                'id': f"{self.canvas_name}_db_{i:03d}",
                'type': 'database',
                'description': f"Create {table['name']} table",
                'priority': table['priority'],
                'estimated_hours': 2.0,
                'why': table['why_needed']
            })
        
        # UI tasks
        sections = self._extract_ui_sections(canvas_data)
        for i, section in enumerate(sections):
            tasks.append({
                'id': f"{self.canvas_name}_ui_{i:03d}",
                'type': 'ui',
                'description': f"Implement {section['name']} section",
                'priority': 'P0' if i < 3 else 'P1',
                'estimated_hours': 6.0,
                'components': len(section['components'])
            })
        
        return tasks
    
    def _generate_report(self, analysis: Dict):
        """Generate markdown report"""
        report_path = self.output_dir / f"{self.canvas_name}.analysis.md"
        
        with open(report_path, 'w') as f:
            f.write(f"# Canvas Analysis: {self.canvas_name}\n")
            f.write(f"**Processed**: {analysis['processed_at']}\n")
            f.write(f"**Session**: {analysis['session_id']}\n\n")
            
            f.write("## Statistics\n")
            stats = analysis['statistics']
            f.write(f"- Nodes: {stats['total_nodes']}\n")
            f.write(f"- Edges: {stats['total_edges']}\n")
            f.write(f"- Complexity: {stats['complexity']}\n\n")
            
            f.write("## UI Sections Found\n")
            for section in analysis['ui_sections']:
                f.write(f"- **{section['name']}**: {len(section['components'])} components\n")
            
            f.write("\n## Required Tables\n")
            for table in analysis['required_tables']:
                f.write(f"- **{table['name']}** ({table['priority']}): {table['why_needed']}\n")
            
            f.write("\n## Implementation Tasks\n")
            db_tasks = [t for t in analysis['implementation_tasks'] if t['type'] == 'database']
            ui_tasks = [t for t in analysis['implementation_tasks'] if t['type'] == 'ui']
            
            f.write(f"- Database tasks: {len(db_tasks)}\n")
            f.write(f"- UI tasks: {len(ui_tasks)}\n")
            f.write(f"- Total effort: {sum(t['estimated_hours'] for t in analysis['implementation_tasks'])} hours\n")
        
        print(f"✅ Report saved: {report_path}")
    
    def _save_to_task_agent(self, analysis: Dict):
        """Save tasks in Task Reality Agent format"""
        task_file = Path(f".tasks/{self.canvas_name}_tasks.json")
        task_file.parent.mkdir(exist_ok=True)
        
        task_graph = {}
        for task in analysis['implementation_tasks']:
            task_graph[task['id']] = {
                'id': task['id'],
                'created_by': self.session_id,
                'created_at': datetime.utcnow().isoformat(),
                'description': task['description'],
                'priority': 0 if task['priority'] == 'P0' else 1 if task['priority'] == 'P1' else 2,
                'estimated_hours': task['estimated_hours'],
                'canvas_source': self.canvas_name,
                'status': 'pending'
            }
        
        with open(task_file, 'w') as f:
            json.dump(task_graph, f, indent=2)
        
        print(f"✅ Tasks saved: {task_file}")


def main():
    parser = argparse.ArgumentParser(description='Process Obsidian Canvas files')
    parser.add_argument('canvas_file', help='Path to Canvas file')
    parser.add_argument('--session', default='00011', help='Session ID')
    args = parser.parse_args()
    
    processor = CanvasProcessor(args.canvas_file, args.session)
    processor.process()


if __name__ == '__main__':
    main()