#!/usr/bin/env python3
"""
YAML Maintenance Tools - Automated Cleanup and Suggestions
Session: 00059
Purpose: Automated tools for YAML frontmatter maintenance

Features:
- Auto-suggest frontmatter for files missing it
- Fix common validation errors
- Update review dates
- Clean up broken references
"""

import frontmatter
import json
from pathlib import Path
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import argparse
import sys

sys.path.append(str(Path(__file__).parent))
from importlib import import_module

# Import our indexer
indexer_module = import_module('00059-yaml-indexer')
YAMLIndexer = indexer_module.YAMLIndexer


class YAMLMaintenance:
    """Automated maintenance tools for YAML frontmatter"""
    
    def __init__(self, root_path: str = "."):
        self.root_path = Path(root_path)
        self.indexer = YAMLIndexer(str(self.root_path))
        self.fixes_applied = 0
        self.suggestions_made = 0
        
    def auto_suggest_frontmatter(self, dry_run: bool = True) -> List[Dict]:
        """Auto-suggest YAML frontmatter for files missing it"""
        suggestions = []
        
        # Scan all files
        self.indexer.scan_files()
        
        # Find markdown files without frontmatter
        all_md_files = list(self.root_path.glob("**/*.md"))
        indexed_files = set(self.indexer.metadata_index.keys())
        
        for filepath in all_md_files:
            rel_path = str(filepath.relative_to(self.root_path))
            
            # Skip if already has frontmatter
            if rel_path in indexed_files:
                file_data = self.indexer.metadata_index[rel_path]
                if file_data.get('has_frontmatter'):
                    continue
            
            # Generate suggestions
            suggestion = self._generate_frontmatter(filepath)
            suggestions.append({
                'file': rel_path,
                'suggestion': suggestion,
                'applied': False
            })
            
            if not dry_run:
                # Apply the suggestion
                self._apply_frontmatter(filepath, suggestion)
                suggestions[-1]['applied'] = True
                self.suggestions_made += 1
        
        return suggestions
    
    def _generate_frontmatter(self, filepath: Path) -> Dict[str, Any]:
        """Generate suggested frontmatter based on file characteristics"""
        filename = filepath.name
        parts = filename.replace('.md', '').split('-')
        
        # Extract session number if present
        session = "legacy"
        if parts[0].isdigit() and len(parts[0]) == 5:
            session = parts[0]
        
        # Guess document type
        doc_type = "unknown"
        if 'SESSION' in filename and 'LOG' in filename:
            doc_type = "log"
        elif 'HANDOFF' in filename:
            doc_type = "handoff"
        elif 'SPEC' in filename or 'specification' in str(filepath):
            doc_type = "specification"
        elif 'GUIDE' in filename or 'guide' in str(filepath):
            doc_type = "guide"
        elif 'REPORT' in filename or 'report' in str(filepath):
            doc_type = "report"
        elif 'ANALYSIS' in filename:
            doc_type = "analysis"
        elif '.github/workflows' in str(filepath):
            doc_type = "config"
        
        # Generate title
        title = filename.replace('.md', '').replace('-', ' ').replace('_', ' ')
        if session != "legacy":
            title = title[6:]  # Remove session number
        title = title.strip().title()
        
        # Guess domain
        domain = "core"
        if 'requirements' in str(filepath):
            domain = "requirements"
        elif 'reality' in str(filepath):
            domain = "reality"
        elif 'reconciliation' in str(filepath):
            domain = "reconciliation"
        
        # Build frontmatter
        frontmatter_data = {
            'session': session,
            'type': doc_type,
            'status': 'current',
            'created': datetime.now().strftime('%Y-%m-%d'),
            'title': title,
            'purpose': 'TODO: Add purpose statement'
        }
        
        # Add optional fields based on context
        if domain != "core":
            frontmatter_data['domain'] = domain
        
        # Add review date for important files
        if doc_type in ['specification', 'guide']:
            review_date = datetime.now() + timedelta(days=90)
            frontmatter_data['review_date'] = review_date.strftime('%Y-%m-%d')
        
        return frontmatter_data
    
    def _apply_frontmatter(self, filepath: Path, frontmatter_data: Dict):
        """Apply frontmatter to a file"""
        try:
            # Read existing content
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Check if already has frontmatter
            if content.startswith('---\n'):
                print(f"⚠️ {filepath} already has frontmatter, skipping")
                return
            
            # Create post with frontmatter
            post = frontmatter.Post(content)
            for key, value in frontmatter_data.items():
                post[key] = value
            
            # Write back with frontmatter
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(frontmatter.dumps(post))
            
            print(f"✅ Added frontmatter to {filepath}")
            
        except Exception as e:
            print(f"❌ Error adding frontmatter to {filepath}: {e}")
    
    def fix_validation_errors(self, dry_run: bool = True) -> List[Dict]:
        """Fix common validation errors"""
        fixes = []
        
        # Scan files
        self.indexer.scan_files()
        
        for filepath, file_data in self.indexer.metadata_index.items():
            if not file_data.get('has_frontmatter'):
                continue
            
            metadata = file_data.get('metadata', {})
            file_fixes = []
            
            # Check for missing required fields
            required = ['session', 'type', 'status', 'created', 'title', 'purpose']
            for field in required:
                if field not in metadata:
                    if field == 'session':
                        # Try to extract from filename
                        parts = Path(filepath).name.split('-')
                        if parts[0].isdigit():
                            file_fixes.append(('session', parts[0]))
                    elif field == 'type':
                        file_fixes.append(('type', 'unknown'))
                    elif field == 'status':
                        file_fixes.append(('status', 'current'))
                    elif field == 'created':
                        file_fixes.append(('created', datetime.now().strftime('%Y-%m-%d')))
                    elif field == 'title':
                        title = Path(filepath).stem.replace('-', ' ').title()
                        file_fixes.append(('title', title))
                    elif field == 'purpose':
                        file_fixes.append(('purpose', 'TODO: Add purpose statement'))
            
            if file_fixes:
                fixes.append({
                    'file': filepath,
                    'fixes': file_fixes,
                    'applied': False
                })
                
                if not dry_run:
                    self._apply_fixes(self.root_path / filepath, file_fixes)
                    fixes[-1]['applied'] = True
                    self.fixes_applied += 1
        
        return fixes
    
    def _apply_fixes(self, filepath: Path, fixes: List[tuple]):
        """Apply fixes to a file's frontmatter"""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                post = frontmatter.load(f)
            
            for field, value in fixes:
                post[field] = value
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(frontmatter.dumps(post))
            
            print(f"✅ Fixed {len(fixes)} issues in {filepath}")
            
        except Exception as e:
            print(f"❌ Error fixing {filepath}: {e}")
    
    def update_review_dates(self, days_ahead: int = 30, dry_run: bool = True) -> List[Dict]:
        """Update review dates for files needing review soon"""
        updates = []
        today = datetime.now().date()
        threshold_date = today + timedelta(days=days_ahead)
        
        # Scan files
        self.indexer.scan_files()
        
        for filepath, file_data in self.indexer.metadata_index.items():
            if not file_data.get('has_frontmatter'):
                continue
            
            metadata = file_data.get('metadata', {})
            
            if 'review_date' in metadata:
                try:
                    review_date = datetime.strptime(metadata['review_date'], '%Y-%m-%d').date()
                    if review_date <= threshold_date:
                        new_date = today + timedelta(days=90)
                        updates.append({
                            'file': filepath,
                            'old_date': metadata['review_date'],
                            'new_date': new_date.strftime('%Y-%m-%d'),
                            'applied': False
                        })
                        
                        if not dry_run:
                            self._update_review_date(
                                self.root_path / filepath,
                                new_date.strftime('%Y-%m-%d')
                            )
                            updates[-1]['applied'] = True
                except:
                    pass
        
        return updates
    
    def _update_review_date(self, filepath: Path, new_date: str):
        """Update review date in a file"""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                post = frontmatter.load(f)
            
            post['review_date'] = new_date
            post['modified'] = datetime.now().strftime('%Y-%m-%d')
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(frontmatter.dumps(post))
            
            print(f"✅ Updated review date for {filepath}")
            
        except Exception as e:
            print(f"❌ Error updating {filepath}: {e}")
    
    def fix_broken_references(self, dry_run: bool = True) -> List[Dict]:
        """Identify and optionally fix broken references"""
        broken = []
        
        # Use query tool to find broken references
        from importlib import import_module
        query_module = import_module('00059-yaml-query')
        query = query_module.YAMLQuery(str(self.root_path))
        query.load_index()
        
        broken_refs = query.find_broken_references()
        
        for ref in broken_refs:
            # Try to find correct path
            suggested_fix = self._suggest_reference_fix(ref['broken_reference'])
            
            broken.append({
                'file': ref['file'],
                'field': ref['field'],
                'broken': ref['broken_reference'],
                'suggested': suggested_fix,
                'applied': False
            })
            
            if not dry_run and suggested_fix:
                self._fix_reference(
                    self.root_path / ref['file'],
                    ref['field'],
                    ref['broken_reference'],
                    suggested_fix
                )
                broken[-1]['applied'] = True
        
        return broken
    
    def _suggest_reference_fix(self, broken_ref: str) -> Optional[str]:
        """Suggest a fix for a broken reference"""
        broken_path = Path(broken_ref)
        
        # Try common fixes
        candidates = [
            # Check if file exists in archive
            self.root_path / 'archive' / broken_path.name,
            # Check if session number is wrong
            self.root_path / broken_path.name,
            # Check docs directory
            self.root_path / 'docs' / broken_path.name,
        ]
        
        for candidate in candidates:
            if candidate.exists():
                return str(candidate.relative_to(self.root_path))
        
        return None
    
    def _fix_reference(self, filepath: Path, field: str, old_ref: str, new_ref: str):
        """Fix a broken reference in a file"""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                post = frontmatter.load(f)
            
            if field in post:
                if isinstance(post[field], list):
                    post[field] = [new_ref if r == old_ref else r for r in post[field]]
                elif post[field] == old_ref:
                    post[field] = new_ref
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(frontmatter.dumps(post))
            
            print(f"✅ Fixed reference in {filepath}: {old_ref} → {new_ref}")
            
        except Exception as e:
            print(f"❌ Error fixing reference in {filepath}: {e}")
    
    def generate_report(self) -> str:
        """Generate maintenance report"""
        report = []
        report.append("📊 YAML Maintenance Report")
        report.append("=" * 60)
        report.append(f"Timestamp: {datetime.now().isoformat()}")
        report.append("")
        
        # Scan current state
        self.indexer.scan_files()
        stats = self.indexer.get_statistics()
        
        report.append("📈 Current State:")
        report.append(f"  • Total files: {stats['files_processed']}")
        report.append(f"  • Files with YAML: {stats['total_indexed']}")
        report.append(f"  • Validation errors: {stats['validation_errors']}")
        report.append("")
        
        # Files needing attention
        all_md = len(list(self.root_path.glob("**/*.md")))
        missing = all_md - stats['total_indexed']
        
        report.append("🔧 Maintenance Needed:")
        report.append(f"  • Files without YAML: {missing}")
        report.append(f"  • Validation errors to fix: {stats['validation_errors']}")
        
        # Check for files needing review
        review_soon = 0
        today = datetime.now().date()
        for file_data in self.indexer.metadata_index.values():
            metadata = file_data.get('metadata', {})
            if 'review_date' in metadata:
                try:
                    review_date = datetime.strptime(metadata['review_date'], '%Y-%m-%d').date()
                    if review_date <= today + timedelta(days=30):
                        review_soon += 1
                except:
                    pass
        
        report.append(f"  • Files needing review (30 days): {review_soon}")
        
        if self.fixes_applied > 0 or self.suggestions_made > 0:
            report.append("")
            report.append("✅ Maintenance Applied:")
            report.append(f"  • Frontmatter added: {self.suggestions_made}")
            report.append(f"  • Validation fixes: {self.fixes_applied}")
        
        return '\n'.join(report)


def main():
    """Command-line interface for maintenance tools"""
    parser = argparse.ArgumentParser(
        description='YAML frontmatter maintenance tools'
    )
    
    parser.add_argument('--suggest', action='store_true',
                       help='Suggest frontmatter for files missing it')
    parser.add_argument('--fix-validation', action='store_true',
                       help='Fix validation errors')
    parser.add_argument('--update-reviews', action='store_true',
                       help='Update review dates')
    parser.add_argument('--fix-references', action='store_true',
                       help='Fix broken references')
    parser.add_argument('--apply', action='store_true',
                       help='Actually apply changes (default is dry run)')
    parser.add_argument('--report', action='store_true',
                       help='Generate maintenance report')
    
    args = parser.parse_args()
    
    # Initialize maintenance
    maintenance = YAMLMaintenance()
    
    print("🔧 YAML Maintenance Tools")
    print("=" * 60)
    
    dry_run = not args.apply
    if dry_run:
        print("🔍 DRY RUN MODE - No changes will be made")
        print("   Use --apply to actually make changes")
    else:
        print("⚠️ APPLY MODE - Changes will be made!")
    print("")
    
    # Execute requested operations
    if args.suggest:
        print("📝 Suggesting frontmatter for files...")
        suggestions = maintenance.auto_suggest_frontmatter(dry_run)
        print(f"Found {len(suggestions)} files needing frontmatter")
        for s in suggestions[:10]:  # Show first 10
            print(f"  • {s['file']}")
    
    if args.fix_validation:
        print("\n🔧 Fixing validation errors...")
        fixes = maintenance.fix_validation_errors(dry_run)
        print(f"Found {len(fixes)} files with validation errors")
        for f in fixes[:10]:
            print(f"  • {f['file']}: {len(f['fixes'])} fixes")
    
    if args.update_reviews:
        print("\n📅 Updating review dates...")
        updates = maintenance.update_review_dates(dry_run=dry_run)
        print(f"Found {len(updates)} files needing review date updates")
        for u in updates[:10]:
            print(f"  • {u['file']}: {u['old_date']} → {u['new_date']}")
    
    if args.fix_references:
        print("\n🔗 Fixing broken references...")
        broken = maintenance.fix_broken_references(dry_run)
        print(f"Found {len(broken)} broken references")
        for b in broken[:10]:
            if b['suggested']:
                print(f"  • {b['file']}: {b['broken']} → {b['suggested']}")
            else:
                print(f"  • {b['file']}: {b['broken']} (no fix found)")
    
    if args.report or not any([args.suggest, args.fix_validation, 
                               args.update_reviews, args.fix_references]):
        print("\n" + maintenance.generate_report())


if __name__ == "__main__":
    main()