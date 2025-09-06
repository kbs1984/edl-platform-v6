#!/usr/bin/env python3

"""
Canvas Mapping Verification Script
Validates that UI recipes correctly map to Obsidian canvas nodes
Ensures visual fidelity between design and implementation
"""

import json
import re
import sys
import argparse
from pathlib import Path
from typing import Dict, List, Tuple, Optional

class CanvasMapper:
    def __init__(self):
        self.canvas_data = {}
        self.recipe_data = {}
        self.errors = []
        self.warnings = []
        
    def load_canvas(self, canvas_path: str) -> bool:
        """Load and parse Obsidian canvas file"""
        try:
            with open(canvas_path, 'r', encoding='utf-8') as f:
                self.canvas_data = json.load(f)
                print(f"✅ Loaded canvas: {canvas_path}")
                print(f"   Found {len(self.canvas_data.get('nodes', []))} nodes")
                return True
        except Exception as e:
            self.errors.append(f"Failed to load canvas: {e}")
            return False
    
    def load_recipe(self, recipe_path: str) -> bool:
        """Load and parse recipe markdown file"""
        try:
            with open(recipe_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
                # Extract canvas references from recipe
                self.recipe_data = {
                    'content': content,
                    'node_ids': self.extract_node_ids(content),
                    'position': self.extract_position(content),
                    'color': self.extract_color(content),
                    'box_type': self.extract_box_type(content)
                }
                
                print(f"✅ Loaded recipe: {recipe_path}")
                if self.recipe_data['node_ids']:
                    print(f"   Referenced nodes: {', '.join(self.recipe_data['node_ids'])}")
                return True
        except Exception as e:
            self.errors.append(f"Failed to load recipe: {e}")
            return False
    
    def extract_node_ids(self, content: str) -> List[str]:
        """Extract canvas node IDs from recipe"""
        # Look for patterns like "Canvas Node ID: 152f5f791b5529a7"
        pattern = r'Canvas Node ID:\s*([a-f0-9]{16})'
        matches = re.findall(pattern, content)
        
        # Also look for comma-separated lists
        pattern2 = r'Canvas Node ID:\s*([a-f0-9]{16}(?:,\s*[a-f0-9]{16})*)'
        matches2 = re.findall(pattern2, content)
        
        all_ids = set(matches)
        for match in matches2:
            all_ids.update([id.strip() for id in match.split(',')])
        
        return list(all_ids)
    
    def extract_position(self, content: str) -> Optional[Dict]:
        """Extract position data from recipe"""
        pattern = r'Canvas Position:\s*\{([^}]+)\}'
        match = re.search(pattern, content)
        if match:
            try:
                # Parse position string like "x: -942, y: -589, width: 325, height: 50"
                pos_str = match.group(1)
                pos_dict = {}
                for part in pos_str.split(','):
                    key, value = part.split(':')
                    pos_dict[key.strip()] = int(value.strip())
                return pos_dict
            except:
                pass
        return None
    
    def extract_color(self, content: str) -> Optional[str]:
        """Extract color code from recipe"""
        pattern = r'Canvas Color Code:\s*([#\w]+)'
        match = re.search(pattern, content)
        return match.group(1) if match else None
    
    def extract_box_type(self, content: str) -> Optional[str]:
        """Extract box type from recipe"""
        pattern = r'Canvas Box Type:\s*([^\n]+)'
        match = re.search(pattern, content)
        return match.group(1).strip() if match else None
    
    def verify_mapping(self) -> Tuple[bool, Dict]:
        """Verify that recipe correctly maps to canvas nodes"""
        results = {
            'nodes_found': 0,
            'nodes_missing': 0,
            'position_matches': 0,
            'color_matches': 0,
            'validation_score': 0
        }
        
        if not self.canvas_data or not self.recipe_data:
            self.errors.append("Canvas or recipe data not loaded")
            return False, results
        
        canvas_nodes = {node['id']: node for node in self.canvas_data.get('nodes', [])}
        
        # Check each referenced node
        for node_id in self.recipe_data['node_ids']:
            if node_id in canvas_nodes:
                results['nodes_found'] += 1
                node = canvas_nodes[node_id]
                
                # Verify position if specified
                if self.recipe_data['position']:
                    pos = self.recipe_data['position']
                    if (node.get('x') == pos.get('x') and 
                        node.get('y') == pos.get('y')):
                        results['position_matches'] += 1
                    else:
                        self.warnings.append(
                            f"Position mismatch for node {node_id[:8]}... "
                            f"Canvas: ({node.get('x')}, {node.get('y')}) "
                            f"Recipe: ({pos.get('x')}, {pos.get('y')})"
                        )
                
                # Verify color if specified
                if self.recipe_data['color'] and node.get('color'):
                    if node['color'] == self.recipe_data['color']:
                        results['color_matches'] += 1
                    else:
                        self.warnings.append(
                            f"Color mismatch for node {node_id[:8]}... "
                            f"Canvas: {node.get('color')} "
                            f"Recipe: {self.recipe_data['color']}"
                        )
            else:
                results['nodes_missing'] += 1
                self.errors.append(f"Node {node_id} not found in canvas")
        
        # Calculate validation score
        total_checks = len(self.recipe_data['node_ids']) * 3  # node, position, color
        if total_checks > 0:
            successful_checks = (results['nodes_found'] + 
                               results['position_matches'] + 
                               results['color_matches'])
            results['validation_score'] = int((successful_checks / total_checks) * 100)
        
        # Check for visual components in canvas
        self.verify_visual_components(canvas_nodes)
        
        return len(self.errors) == 0, results
    
    def verify_visual_components(self, canvas_nodes: Dict):
        """Verify that visual components match expected patterns"""
        # Look for common UI patterns in canvas
        ui_patterns = {
            'profile': ['profile', 'avatar', 'callsign'],
            'dashboard': ['dashboard', 'header', 'metrics'],
            'activity': ['activity', 'activities', 'register'],
            'badge': ['badge', 'badges', 'earned'],
            'team': ['team', 'clan', 'group']
        }
        
        for pattern_name, keywords in ui_patterns.items():
            found = False
            for node in canvas_nodes.values():
                node_text = node.get('text', '').lower()
                if any(keyword in node_text for keyword in keywords):
                    found = True
                    break
            
            if found and pattern_name in self.recipe_data['content'].lower():
                print(f"  ✅ Pattern '{pattern_name}' found in both canvas and recipe")
    
    def suggest_improvements(self):
        """Suggest improvements for better canvas alignment"""
        suggestions = []
        
        if not self.recipe_data['node_ids']:
            suggestions.append("Add Canvas Node ID reference to recipe")
        
        if not self.recipe_data['position']:
            suggestions.append("Add Canvas Position coordinates to recipe")
        
        if not self.recipe_data['color']:
            suggestions.append("Add Canvas Color Code to recipe")
        
        if not self.recipe_data['box_type']:
            suggestions.append("Add Canvas Box Type description to recipe")
        
        # Check for visual mockup reference
        if 'mockup' not in self.recipe_data['content'].lower():
            suggestions.append("Consider adding visual mockup reference or screenshot")
        
        return suggestions
    
    def generate_report(self, results: Dict):
        """Generate verification report"""
        print("\n" + "="*60)
        print("CANVAS MAPPING VERIFICATION REPORT")
        print("="*60)
        
        if self.errors:
            print("\n🔴 ERRORS:")
            for error in self.errors:
                print(f"  ❌ {error}")
        
        if self.warnings:
            print("\n🟡 WARNINGS:")
            for warning in self.warnings:
                print(f"  ⚠️ {warning}")
        
        print("\n📊 VERIFICATION RESULTS:")
        print(f"  Nodes Found: {results['nodes_found']}")
        print(f"  Nodes Missing: {results['nodes_missing']}")
        print(f"  Position Matches: {results['position_matches']}")
        print(f"  Color Matches: {results['color_matches']}")
        print(f"  Validation Score: {results['validation_score']}%")
        
        suggestions = self.suggest_improvements()
        if suggestions:
            print("\n💡 SUGGESTIONS:")
            for suggestion in suggestions:
                print(f"  • {suggestion}")
        
        print("\n✅ STATUS:")
        if len(self.errors) == 0 and results['validation_score'] >= 80:
            print("  ✅ Recipe successfully maps to canvas")
        elif len(self.errors) == 0:
            print("  ⚠️ Recipe partially maps to canvas")
        else:
            print("  ❌ Recipe does not correctly map to canvas")
        
        print("\n" + "="*60)

def main():
    parser = argparse.ArgumentParser(description='Verify UI recipe canvas mapping')
    parser.add_argument('--recipe', required=True, help='Path to recipe markdown file')
    parser.add_argument('--canvas', required=True, help='Path to Obsidian canvas file')
    parser.add_argument('--verbose', action='store_true', help='Enable verbose output')
    
    args = parser.parse_args()
    
    mapper = CanvasMapper()
    
    # Load files
    if not mapper.load_canvas(args.canvas):
        print("❌ Failed to load canvas file")
        sys.exit(1)
    
    if not mapper.load_recipe(args.recipe):
        print("❌ Failed to load recipe file")
        sys.exit(1)
    
    # Verify mapping
    success, results = mapper.verify_mapping()
    
    # Generate report
    mapper.generate_report(results)
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()