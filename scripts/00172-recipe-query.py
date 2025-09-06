#!/usr/bin/env python3
"""
Recipe Query System - Integrates with YAML metadata for recipe-based development
Session: 172
Created: 2025-09-05
Purpose: Query and validate recipe citations in implementation files
"""

import os
import sys
import yaml
import json
import argparse
from pathlib import Path
from typing import Dict, List, Optional, Any
from collections import defaultdict

# Recipe catalog definitions
CANVAS_RECIPES = {
    "CANVAS-001-1": {"name": "Onboarding & Directory", "file": "001-1. num.label.Onboarding&Directory.canvas"},
    "CANVAS-001-2": {"name": "Communication, Messages and Invitations", "file": "001-2. label.Communication, messages and Invitations.canvas"},
    "CANVAS-001-3": {"name": "Contact Us Box", "file": "001-3. seed.Contact Us Box.canvas"},
    "CANVAS-001-4": {"name": "Activity & Registrar Box", "file": "001-4. needlabel.Activity & Registrar Box.canvas"},
    "CANVAS-001-5": {"name": "Activity Instance", "file": "001-5. seed.Activity Instance.canvas"},
    "CANVAS-002-1": {"name": "PlayerID Profile Box", "file": "002-1. seed.PlayerID Profile Box.canvas"},
    "CANVAS-002-2": {"name": "Associated Teams Box", "file": "002-2. needlabel.Associated Teams Box.canvas"},
    "CANVAS-002-3": {"name": "Badges Box", "file": "002-3. seed.Badges Box.canvas"},
    "CANVAS-002-4": {"name": "HoG Box", "file": "002-4. seed.HoG Box.canvas"},
    "CANVAS-002-5": {"name": "Resources Box", "file": "002-5. seed.Resources Box.canvas"},
    "CANVAS-003-2": {"name": "EmCoin Transactions Box", "file": "003-2 seed.emCoin Transactions Box.canvas"}
}

V5_RECIPES = {
    "V5-RECIPE-001": {"name": "Addiction Mechanics Bar", "source": "player-dashboard.html:303-334", "detailed": "v5-recipies-canvas-aligned/addiction-bar-recipe.md"},
    "V5-RECIPE-002": {"name": "Streak System", "source": "state-machines.js:830-838"},
    "V5-RECIPE-003": {"name": "EmCoin Economy", "source": "supabase-edl.js:386-484"},
    "V5-RECIPE-004": {"name": "Achievement System", "source": "supabase-edl.js:553-643"},
    "V5-RECIPE-005": {"name": "State Machines", "source": "state-machines.js:104-134"},
    "V5-RECIPE-006": {"name": "Profile Card", "source": "v5-recipies-canvas-aligned/profile-card-recipe.md"},
    "V5-RECIPE-007": {"name": "UI Recipe Extraction Strategy", "source": "v5-recipies-canvas-aligned/UI-RECIPE-EXTRACTION-STRATEGY.md"}
}

BRIAN_RECIPES = {
    "BRIAN-RECIPE-001": {"name": "User System", "tables": ["Users", "AC_Players", "SE_Supervisors", "ED_Enablers"]},
    "BRIAN-RECIPE-002": {"name": "Team System", "tables": ["Teams", "TeamMembers", "TeamCommunications"]},
    "BRIAN-RECIPE-003": {"name": "Activity System", "tables": ["Activities", "ActivityRegistration", "ActivityCompletion"]},
    "BRIAN-RECIPE-004": {"name": "Division System", "tables": ["Divisions", "DivisionRankings"]},
    "BRIAN-RECIPE-005": {"name": "Communication System", "tables": ["Communications", "Messages", "Invitations"]}
}

class RecipeQuery:
    def __init__(self, root_dir: str = "."):
        self.root_dir = Path(root_dir)
        self.implementations = []
        self.missing_recipes = []
        self.recipe_usage = defaultdict(list)
        
    def scan_implementations(self, directory: str = "reconciliation/active-work"):
        """Scan implementation files for recipe citations"""
        search_dir = self.root_dir / directory
        
        for file_path in search_dir.rglob("*.tsx"):
            self._check_file_recipes(file_path)
        for file_path in search_dir.rglob("*.ts"):
            self._check_file_recipes(file_path)
        for file_path in search_dir.rglob("*.md"):
            self._check_markdown_recipes(file_path)
            
    def _check_file_recipes(self, file_path: Path):
        """Check TypeScript/TSX files for recipe citations"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Look for recipe citations in comments
            has_canvas = "CANVAS-" in content
            has_v5 = "V5-RECIPE-" in content
            has_brian = "BRIAN-RECIPE-" in content
            
            # Extract specific recipes
            recipes = {
                "canvas": self._extract_recipe_ids(content, "CANVAS-"),
                "v5": self._extract_recipe_ids(content, "V5-RECIPE-"),
                "brian": self._extract_recipe_ids(content, "BRIAN-RECIPE-")
            }
            
            # Check if component has ANY recipe
            if not (has_canvas or has_v5 or has_brian):
                if self._is_significant_component(content):
                    self.missing_recipes.append({
                        "file": str(file_path.relative_to(self.root_dir)),
                        "type": "no_recipes"
                    })
            
            # Track recipe usage
            for recipe_type, recipe_ids in recipes.items():
                for recipe_id in recipe_ids:
                    self.recipe_usage[recipe_id].append(str(file_path.relative_to(self.root_dir)))
                    
            if any(recipes.values()):
                self.implementations.append({
                    "file": str(file_path.relative_to(self.root_dir)),
                    "recipes": recipes
                })
                
        except Exception as e:
            print(f"Error reading {file_path}: {e}", file=sys.stderr)
            
    def _check_markdown_recipes(self, file_path: Path):
        """Check Markdown files for recipe citations in YAML frontmatter"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Extract YAML frontmatter
            if content.startswith('---'):
                parts = content.split('---', 2)
                if len(parts) >= 3:
                    try:
                        metadata = yaml.safe_load(parts[1])
                        if metadata and 'recipes' in metadata:
                            self.implementations.append({
                                "file": str(file_path.relative_to(self.root_dir)),
                                "recipes": metadata['recipes']
                            })
                            
                            # Track usage
                            for recipe_type, recipe_id in metadata['recipes'].items():
                                if recipe_id:
                                    self.recipe_usage[recipe_id].append(str(file_path.relative_to(self.root_dir)))
                    except yaml.YAMLError:
                        pass
                        
        except Exception as e:
            print(f"Error reading {file_path}: {e}", file=sys.stderr)
            
    def _extract_recipe_ids(self, content: str, prefix: str) -> List[str]:
        """Extract recipe IDs from content"""
        import re
        pattern = rf"{prefix}[\w-]+"
        matches = re.findall(pattern, content)
        return list(set(matches))
        
    def _is_significant_component(self, content: str) -> bool:
        """Check if file is a significant component that needs recipes"""
        # Skip test files, utilities, types
        if any(x in content for x in ['describe(', 'test(', 'interface ', 'type ', 'enum ']):
            return False
        
        # Check for actual component
        if 'export default function' in content or 'export function' in content:
            # Check if it's more than 50 lines (significant)
            if len(content.split('\n')) > 50:
                return True
                
        return False
        
    def find_recipe(self, recipe_id: str) -> Optional[Dict]:
        """Find details about a specific recipe"""
        if recipe_id in CANVAS_RECIPES:
            return {"type": "canvas", "details": CANVAS_RECIPES[recipe_id]}
        elif recipe_id in V5_RECIPES:
            return {"type": "v5", "details": V5_RECIPES[recipe_id]}
        elif recipe_id in BRIAN_RECIPES:
            return {"type": "brian", "details": BRIAN_RECIPES[recipe_id]}
        return None
        
    def list_all_recipes(self):
        """List all available recipes"""
        print("\n📚 AVAILABLE RECIPES CATALOG")
        print("=" * 60)
        
        print("\n🎨 Canvas Wireframe Recipes:")
        for recipe_id, details in CANVAS_RECIPES.items():
            print(f"  {recipe_id}: {details['name']}")
            
        print("\n🎮 V5 Pattern Recipes:")
        for recipe_id, details in V5_RECIPES.items():
            print(f"  {recipe_id}: {details['name']}")
            
        print("\n📊 Brian Architecture Recipes:")
        for recipe_id, details in BRIAN_RECIPES.items():
            print(f"  {recipe_id}: {details['name']}")
            
    def validate_recipes(self):
        """Validate all recipe citations are valid"""
        invalid = []
        
        for impl in self.implementations:
            for recipe_type, recipe_ids in impl['recipes'].items():
                if isinstance(recipe_ids, list):
                    for recipe_id in recipe_ids:
                        if not self.find_recipe(recipe_id):
                            invalid.append({
                                "file": impl['file'],
                                "invalid_recipe": recipe_id
                            })
                elif isinstance(recipe_ids, str) and recipe_ids:
                    if not self.find_recipe(recipe_ids):
                        invalid.append({
                            "file": impl['file'],
                            "invalid_recipe": recipe_ids
                        })
                        
        return invalid
        
    def generate_report(self):
        """Generate recipe usage report"""
        print("\n📊 RECIPE USAGE REPORT")
        print("=" * 60)
        
        # Files with recipes
        print(f"\n✅ Files with recipe citations: {len(self.implementations)}")
        for impl in self.implementations[:5]:  # Show first 5
            print(f"  • {impl['file']}")
            for recipe_type, recipes in impl['recipes'].items():
                if recipes:
                    print(f"    └─ {recipe_type}: {recipes}")
                    
        if len(self.implementations) > 5:
            print(f"  ... and {len(self.implementations) - 5} more")
            
        # Files missing recipes
        print(f"\n⚠️  Files missing recipe citations: {len(self.missing_recipes)}")
        for missing in self.missing_recipes[:5]:
            print(f"  • {missing['file']}")
            
        if len(self.missing_recipes) > 5:
            print(f"  ... and {len(self.missing_recipes) - 5} more")
            
        # Most used recipes
        print("\n📈 Most used recipes:")
        sorted_usage = sorted(self.recipe_usage.items(), key=lambda x: len(x[1]), reverse=True)
        for recipe_id, files in sorted_usage[:5]:
            recipe_info = self.find_recipe(recipe_id)
            if recipe_info:
                print(f"  • {recipe_id} ({recipe_info['details'].get('name', 'Unknown')}): {len(files)} files")
                
        # Invalid recipes
        invalid = self.validate_recipes()
        if invalid:
            print(f"\n❌ Invalid recipe citations: {len(invalid)}")
            for inv in invalid[:3]:
                print(f"  • {inv['file']}: {inv['invalid_recipe']}")
                
def main():
    parser = argparse.ArgumentParser(description="Recipe Query System for EDL Platform v6")
    parser.add_argument("--scan", action="store_true", help="Scan implementations for recipes")
    parser.add_argument("--list", action="store_true", help="List all available recipes")
    parser.add_argument("--find", help="Find details about a specific recipe ID")
    parser.add_argument("--validate", action="store_true", help="Validate all recipe citations")
    parser.add_argument("--missing", action="store_true", help="Show files missing recipes")
    parser.add_argument("--usage", help="Show usage of a specific recipe")
    parser.add_argument("--feature", help="Suggest recipes for a feature")
    
    args = parser.parse_args()
    
    query = RecipeQuery()
    
    if args.list:
        query.list_all_recipes()
        
    elif args.find:
        recipe = query.find_recipe(args.find)
        if recipe:
            print(f"\n📖 Recipe: {args.find}")
            print(f"Type: {recipe['type']}")
            print(f"Details: {json.dumps(recipe['details'], indent=2)}")
        else:
            print(f"❌ Recipe '{args.find}' not found")
            
    elif args.scan:
        print("🔍 Scanning implementations for recipe citations...")
        query.scan_implementations()
        query.generate_report()
        
    elif args.validate:
        print("🔍 Validating recipe citations...")
        query.scan_implementations()
        invalid = query.validate_recipes()
        if invalid:
            print(f"❌ Found {len(invalid)} invalid recipe citations")
            for inv in invalid:
                print(f"  • {inv['file']}: {inv['invalid_recipe']}")
        else:
            print("✅ All recipe citations are valid!")
            
    elif args.missing:
        print("🔍 Finding files missing recipe citations...")
        query.scan_implementations()
        if query.missing_recipes:
            print(f"\n⚠️  {len(query.missing_recipes)} files need recipes:")
            for missing in query.missing_recipes:
                print(f"  • {missing['file']}")
        else:
            print("✅ All significant files have recipe citations!")
            
    elif args.usage:
        print(f"🔍 Finding usage of recipe {args.usage}...")
        query.scan_implementations()
        if args.usage in query.recipe_usage:
            files = query.recipe_usage[args.usage]
            print(f"\n📊 Recipe {args.usage} is used in {len(files)} files:")
            for file in files:
                print(f"  • {file}")
        else:
            print(f"Recipe {args.usage} is not currently used")
            
    elif args.feature:
        print(f"\n🎯 Suggested recipes for feature: {args.feature}")
        suggestions = suggest_recipes_for_feature(args.feature)
        for recipe_type, recipe_id in suggestions.items():
            recipe = query.find_recipe(recipe_id)
            if recipe:
                print(f"  {recipe_type}: {recipe_id} - {recipe['details'].get('name', '')}")
                
    else:
        parser.print_help()
        
def suggest_recipes_for_feature(feature: str) -> Dict[str, str]:
    """Suggest recipes based on feature name"""
    feature_lower = feature.lower()
    suggestions = {}
    
    # Canvas suggestions
    if "onboard" in feature_lower:
        suggestions["canvas"] = "CANVAS-001-1"
    elif "message" in feature_lower or "communication" in feature_lower:
        suggestions["canvas"] = "CANVAS-001-2"
    elif "activity" in feature_lower:
        suggestions["canvas"] = "CANVAS-001-4"
    elif "profile" in feature_lower:
        suggestions["canvas"] = "CANVAS-002-1"
    elif "team" in feature_lower:
        suggestions["canvas"] = "CANVAS-002-2"
    elif "badge" in feature_lower or "achievement" in feature_lower:
        suggestions["canvas"] = "CANVAS-002-3"
    elif "emcoin" in feature_lower or "coin" in feature_lower:
        suggestions["canvas"] = "CANVAS-003-2"
        
    # V5 suggestions
    if "streak" in feature_lower:
        suggestions["v5"] = "V5-RECIPE-002"
    elif "emcoin" in feature_lower or "economy" in feature_lower:
        suggestions["v5"] = "V5-RECIPE-003"
    elif "achievement" in feature_lower or "badge" in feature_lower:
        suggestions["v5"] = "V5-RECIPE-004"
    elif "addiction" in feature_lower or "engagement" in feature_lower:
        suggestions["v5"] = "V5-RECIPE-001"
        
    # Brian suggestions
    if "user" in feature_lower or "player" in feature_lower:
        suggestions["brian"] = "BRIAN-RECIPE-001"
    elif "team" in feature_lower:
        suggestions["brian"] = "BRIAN-RECIPE-002"
    elif "activity" in feature_lower:
        suggestions["brian"] = "BRIAN-RECIPE-003"
    elif "division" in feature_lower:
        suggestions["brian"] = "BRIAN-RECIPE-004"
    elif "message" in feature_lower or "communication" in feature_lower:
        suggestions["brian"] = "BRIAN-RECIPE-005"
        
    return suggestions

if __name__ == "__main__":
    main()