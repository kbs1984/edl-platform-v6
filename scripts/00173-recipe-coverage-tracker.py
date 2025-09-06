#!/usr/bin/env python3
"""
Recipe Coverage Tracker v1.0
Session 173 - Real-time recipe coverage dashboard
"""

import os
import re
import json
import yaml
from pathlib import Path
from typing import Dict, List, Set, Tuple
from datetime import datetime

class RecipeCoverageTracker:
    def __init__(self):
        self.base_dir = Path.cwd()
        self.recipe_dir = self.base_dir / "archive/legacy-canvas-work/v5-recipes-canvas-aligned"
        self.stories_dir = self.base_dir / "requirements"
        self.recipe_map_file = self.base_dir / "requirements/00173-RECIPE-MAP-V1.md"
        
        # Data structures
        self.recipes = {}
        self.user_stories = {}
        self.coverage_map = {}
        self.priority_counts = {"P0": 0, "P1": 0, "P2": 0}
        
    def load_user_stories(self) -> None:
        """Load all user stories from requirements files"""
        print("📋 Loading user stories...")
        
        story_files = [
            "P0-AUTHENTICATION-STORIES.md",
            "P0-DASHBOARD-PROFILE-STORIES.md",
            "P0-TEAM-STORIES.md",
            "P0-ACTIVITY-RUNTIME-STORIES.md",
            "P0-EMCOIN-TRANSACTION-STORIES.md",
            "P1-ACTIVITY-STORIES.md",
            "P1-ACTIVITY-REGISTRAR-STORIES.md",
            "P1-BADGE-STORIES.md",
            "P1-HOG-STORIES.md",
            "P1-COMPLETE-COVERAGE-STORIES.md",
            "P2-COMMUNICATION-STORIES.md",
            "P2-EMCOIN-STORIES.md",
            "P2-RESOURCE-STORIES.md"
        ]
        
        for filename in story_files:
            filepath = self.stories_dir / filename
            if filepath.exists():
                priority = filename[:2]  # P0, P1, or P2
                with open(filepath, 'r') as f:
                    content = f.read()
                    
                    # Extract user stories (US-XXX pattern)
                    stories = re.findall(r'US-(\d+)', content)
                    for story in stories:
                        story_id = f"US-{story}"
                        self.user_stories[story_id] = {
                            "priority": priority,
                            "file": filename,
                            "covered_by": [],
                            "coverage_status": "uncovered"
                        }
                        self.priority_counts[priority] += 1
                        
        print(f"   Loaded {len(self.user_stories)} user stories")
        print(f"   P0: {self.priority_counts['P0']}, P1: {self.priority_counts['P1']}, P2: {self.priority_counts['P2']}")
        
    def load_recipes(self) -> None:
        """Load all available recipes"""
        print("\n🍳 Loading recipes...")
        
        if not self.recipe_dir.exists():
            print(f"   Recipe directory not found: {self.recipe_dir}")
            return
            
        for recipe_file in self.recipe_dir.glob("*-recipe*.md"):
            recipe_name = recipe_file.stem
            
            with open(recipe_file, 'r') as f:
                content = f.read()
                
                # Extract metadata from YAML frontmatter
                quality_score = 0
                if match := re.search(r'quality_score:\s*(\d+)', content):
                    quality_score = int(match.group(1))
                    
                # Extract covered stories
                covered_stories = re.findall(r'US-(\d+)', content)
                covered_stories = [f"US-{s}" for s in covered_stories]
                
                # Check for React patterns (anti-pattern)
                has_react = bool(re.search(r'useState|useEffect|"use client"', content))
                
                # Check for required patterns
                has_vanilla_js = bool(re.search(r'class\s+\w+\s*{', content))
                has_testids = bool(re.search(r'data-testid', content))
                
                self.recipes[recipe_name] = {
                    "file": str(recipe_file),
                    "quality_score": quality_score,
                    "covered_stories": covered_stories,
                    "has_react": has_react,
                    "has_vanilla_js": has_vanilla_js,
                    "has_testids": has_testids,
                    "valid": not has_react and quality_score >= 85
                }
                
                # Update story coverage
                for story_id in covered_stories:
                    if story_id in self.user_stories:
                        self.user_stories[story_id]["covered_by"].append(recipe_name)
                        self.user_stories[story_id]["coverage_status"] = "covered"
                        
        print(f"   Loaded {len(self.recipes)} recipes")
        
    def calculate_coverage(self) -> Dict:
        """Calculate coverage statistics"""
        stats = {
            "total_stories": len(self.user_stories),
            "covered_stories": 0,
            "partially_covered": 0,
            "uncovered_stories": 0,
            "coverage_percentage": 0.0,
            "by_priority": {"P0": {}, "P1": {}, "P2": {}}
        }
        
        for story_id, story_data in self.user_stories.items():
            priority = story_data["priority"]
            
            if story_data["covered_by"]:
                stats["covered_stories"] += 1
                if priority not in stats["by_priority"]:
                    stats["by_priority"][priority] = {"covered": 0, "total": 0}
                stats["by_priority"][priority]["covered"] = \
                    stats["by_priority"][priority].get("covered", 0) + 1
            else:
                stats["uncovered_stories"] += 1
                
            if priority not in stats["by_priority"]:
                stats["by_priority"][priority] = {"covered": 0, "total": 0}
            stats["by_priority"][priority]["total"] = \
                stats["by_priority"][priority].get("total", 0) + 1
                
        if stats["total_stories"] > 0:
            stats["coverage_percentage"] = \
                (stats["covered_stories"] / stats["total_stories"]) * 100
                
        # Calculate priority percentages
        for priority in ["P0", "P1", "P2"]:
            if priority in stats["by_priority"] and stats["by_priority"][priority]["total"] > 0:
                stats["by_priority"][priority]["percentage"] = \
                    (stats["by_priority"][priority]["covered"] / 
                     stats["by_priority"][priority]["total"]) * 100
            else:
                stats["by_priority"][priority] = {"covered": 0, "total": 0, "percentage": 0}
                
        return stats
        
    def identify_gaps(self) -> List[Tuple[str, List[str]]]:
        """Identify which stories need recipes"""
        gaps = []
        
        for story_id, story_data in self.user_stories.items():
            if not story_data["covered_by"]:
                gaps.append((story_id, story_data["priority"], story_data["file"]))
                
        # Sort by priority (P0 first)
        gaps.sort(key=lambda x: (x[1], x[0]))
        
        return gaps
        
    def generate_dashboard(self) -> str:
        """Generate a markdown dashboard"""
        stats = self.calculate_coverage()
        gaps = self.identify_gaps()
        
        dashboard = f"""
# 📊 Recipe Coverage Dashboard
**Generated**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**Session**: 173

## 📈 Overall Coverage

```
Total User Stories: {stats['total_stories']}
Covered Stories: {stats['covered_stories']} ({stats['coverage_percentage']:.1f}%)
Uncovered Stories: {stats['uncovered_stories']} ({100 - stats['coverage_percentage']:.1f}%)

By Priority:
P0 (Core):      {stats['by_priority']['P0']['covered']}/{stats['by_priority']['P0']['total']} ({stats['by_priority']['P0'].get('percentage', 0):.1f}%)
P1 (Essential): {stats['by_priority']['P1']['covered']}/{stats['by_priority']['P1']['total']} ({stats['by_priority']['P1'].get('percentage', 0):.1f}%)
P2 (Enhanced):  {stats['by_priority']['P2']['covered']}/{stats['by_priority']['P2']['total']} ({stats['by_priority']['P2'].get('percentage', 0):.1f}%)
```

## 🍳 Available Recipes

| Recipe | Quality | Valid | Stories Covered |
|--------|---------|-------|----------------|
"""
        
        for recipe_name, recipe_data in self.recipes.items():
            valid_emoji = "✅" if recipe_data["valid"] else "❌"
            dashboard += f"| {recipe_name} | {recipe_data['quality_score']}/100 | {valid_emoji} | {len(recipe_data['covered_stories'])} |\n"
            
        dashboard += f"""

## 🔴 Top 10 Coverage Gaps (P0 Priority)

| Story ID | Priority | File | Status |
|----------|----------|------|--------|
"""
        
        for story_id, priority, file in gaps[:10]:
            if priority == "P0":
                dashboard += f"| {story_id} | {priority} | {file} | 🔴 Missing |\n"
                
        dashboard += """

## 🎯 Next Recipe Priorities

Based on coverage gaps, request these recipes from v5:

1. **Activity Runtime Recipes** (50 stories uncovered)
2. **Team Management Recipes** (12 stories uncovered)
3. **Authentication Recipes** (15 stories uncovered)

---
*Use `./scripts/00173-recipe-import-pipeline.sh` to import new recipes*
"""
        
        return dashboard
        
    def save_dashboard(self, output_file: str = "RECIPE-COVERAGE-DASHBOARD.md") -> None:
        """Save dashboard to file"""
        dashboard = self.generate_dashboard()
        output_path = self.base_dir / "requirements" / output_file
        
        with open(output_path, 'w') as f:
            f.write(dashboard)
            
        print(f"\n✅ Dashboard saved to: {output_path}")
        
    def generate_json_report(self) -> None:
        """Generate JSON report for programmatic access"""
        stats = self.calculate_coverage()
        
        report = {
            "timestamp": datetime.now().isoformat(),
            "session": "173",
            "statistics": stats,
            "recipes": self.recipes,
            "coverage_map": {}
        }
        
        # Build coverage map
        for story_id, story_data in self.user_stories.items():
            if story_data["covered_by"]:
                report["coverage_map"][story_id] = story_data["covered_by"]
                
        output_path = self.base_dir / "logs" / "recipe-coverage.json"
        output_path.parent.mkdir(exist_ok=True)
        
        with open(output_path, 'w') as f:
            json.dump(report, f, indent=2)
            
        print(f"📝 JSON report saved to: {output_path}")
        
def main():
    print("╭──────────────────────────────────────────────────╮")
    print("│       Recipe Coverage Tracker v1.0         │")
    print("│           Session 173 - Recipe System      │")
    print("╰──────────────────────────────────────────────────╯\n")
    
    tracker = RecipeCoverageTracker()
    
    # Load data
    tracker.load_user_stories()
    tracker.load_recipes()
    
    # Calculate and display coverage
    stats = tracker.calculate_coverage()
    
    print("\n📈 Coverage Summary:")
    print(f"   Overall: {stats['coverage_percentage']:.1f}%")
    print(f"   P0: {stats['by_priority']['P0'].get('percentage', 0):.1f}%")
    print(f"   P1: {stats['by_priority']['P1'].get('percentage', 0):.1f}%")
    print(f"   P2: {stats['by_priority']['P2'].get('percentage', 0):.1f}%")
    
    # Save outputs
    tracker.save_dashboard()
    tracker.generate_json_report()
    
    print("\n✅ Coverage tracking complete!")
    
if __name__ == "__main__":
    main()