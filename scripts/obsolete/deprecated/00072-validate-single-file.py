#!/usr/bin/env python3
"""
Single-file YAML validator for the unified file system.
Created by Session 00072 to address Session 71's discovery that validation is batch-only.

Usage:
    python3 scripts/00072-validate-single-file.py <file.md>
    python3 scripts/00072-validate-single-file.py --help
"""

import argparse
import sys
import yaml
from pathlib import Path
from typing import Dict, List, Tuple, Optional
import json

# YAML Schema based on Session 61 requirements
REQUIRED_FIELDS = ['session', 'type', 'status', 'created', 'domain']

VALID_TYPES = [
    'specification', 'guide', 'report', 'analysis', 'log', 
    'script', 'config', 'template', 'handoff', 'unknown'
]

VALID_STATUS = ['current', 'draft', 'archived', 'superseded']

VALID_DOMAINS = [
    'core', 'reality', 'requirements', 'reconciliation', 'archive'
]

VALID_PRIORITIES = ['P0', 'P1', 'P2', 'P3']

VALID_COMPLEXITY = ['beginner', 'intermediate', 'advanced']

VALID_VALIDATION_METHODS = ['automated', 'manual', 'reality-agent', 'none']

VALID_LIFECYCLE = ['ON', 'OFF', 'OBSOLETE', 'UNKNOWN']

# Files/directories to skip validation
SKIP_PATTERNS = [
    'truth-seed/',
    'node_modules/',
    '.git/',
    '.roo/rules/',
    '.next/',
    'build/',
    'dist/'
]

def should_skip_file(filepath: Path) -> bool:
    """Check if file should be skipped based on patterns."""
    filepath_str = str(filepath)
    for pattern in SKIP_PATTERNS:
        if pattern in filepath_str:
            return True
    return False

def extract_yaml_frontmatter(content: str) -> Tuple[Optional[str], int]:
    """Extract YAML frontmatter from markdown content."""
    lines = content.split('\n')
    
    # Check if file starts with ---
    if not lines or lines[0].strip() != '---':
        return None, 0
    
    # Find the closing ---
    for i, line in enumerate(lines[1:], 1):
        if line.strip() == '---':
            # Return YAML content between markers
            yaml_content = '\n'.join(lines[1:i])
            return yaml_content, i + 1
    
    return None, 0

def validate_yaml_content(yaml_content: str, filepath: Path) -> List[str]:
    """Validate YAML content against schema."""
    errors = []
    
    try:
        data = yaml.safe_load(yaml_content)
        
        if not isinstance(data, dict):
            errors.append("YAML frontmatter is not a valid dictionary")
            return errors
        
        # Check required fields
        for field in REQUIRED_FIELDS:
            if field not in data:
                # Special case: 'purpose' is required for most files
                if field == 'domain' and '.claude/commands' in str(filepath):
                    continue  # Commands might not need domain
                errors.append(f"Missing required field: '{field}'")
        
        # Check if 'purpose' is present (Session 61 requirement)
        if 'purpose' not in data and not str(filepath).endswith('-LOG.md'):
            errors.append("Missing required field: 'purpose'")
        
        # Validate field values
        if 'type' in data and data['type'] not in VALID_TYPES:
            errors.append(f"Invalid type: '{data['type']}' (must be one of: {', '.join(VALID_TYPES)})")
        
        if 'status' in data and data['status'] not in VALID_STATUS:
            errors.append(f"Invalid status: '{data['status']}' (must be one of: {', '.join(VALID_STATUS)})")
        
        if 'domain' in data and data['domain'] not in VALID_DOMAINS:
            errors.append(f"Invalid domain: '{data['domain']}' (must be one of: {', '.join(VALID_DOMAINS)})")
        
        if 'priority' in data and data['priority'] not in VALID_PRIORITIES:
            errors.append(f"Invalid priority: '{data['priority']}' (must be one of: {', '.join(VALID_PRIORITIES)})")
        
        if 'complexity' in data and data['complexity'] not in VALID_COMPLEXITY:
            errors.append(f"Invalid complexity: '{data['complexity']}' (must be one of: {', '.join(VALID_COMPLEXITY)})")
        
        if 'validation_method' in data and data['validation_method'] not in VALID_VALIDATION_METHODS:
            errors.append(f"Invalid validation_method: '{data['validation_method']}' (must be one of: {', '.join(VALID_VALIDATION_METHODS)})")
        
        if 'lifecycle' in data and data['lifecycle'] not in VALID_LIFECYCLE:
            errors.append(f"Invalid lifecycle: '{data['lifecycle']}' (must be one of: {', '.join(VALID_LIFECYCLE)})")
        
        # Validate session format
        if 'session' in data:
            session = str(data['session'])
            if session not in ['legacy', 'multiple', 'unknown']:
                # Should be 5-digit number
                if not (session.isdigit() and len(session) == 5):
                    errors.append(f"Invalid session format: '{session}' (must be 5-digit number, 'legacy', 'multiple', or 'unknown')")
        
        # Validate date format (ISO)
        if 'created' in data:
            created = str(data['created'])
            # Simple check for YYYY-MM-DD format
            if len(created) != 10 or created[4] != '-' or created[7] != '-':
                errors.append(f"Invalid date format for 'created': '{created}' (must be YYYY-MM-DD)")
        
    except yaml.YAMLError as e:
        errors.append(f"YAML parsing error: {str(e)}")
    except Exception as e:
        errors.append(f"Validation error: {str(e)}")
    
    return errors

def validate_file(filepath: Path, verbose: bool = False) -> Tuple[bool, List[str]]:
    """Validate a single markdown file with YAML frontmatter."""
    
    # Check if file exists
    if not filepath.exists():
        return False, [f"File not found: {filepath}"]
    
    # Check if it's a markdown file
    if not str(filepath).endswith('.md'):
        return False, [f"Not a markdown file: {filepath}"]
    
    # Check if we should skip this file
    if should_skip_file(filepath):
        if verbose:
            print(f"⏭️  Skipping {filepath} (external/generated file)")
        return True, []
    
    # Read file content
    try:
        content = filepath.read_text(encoding='utf-8')
    except Exception as e:
        return False, [f"Error reading file: {e}"]
    
    # Extract YAML frontmatter
    yaml_content, line_count = extract_yaml_frontmatter(content)
    
    if yaml_content is None:
        return False, ["No YAML frontmatter found (file must start with ---)"]
    
    # Validate YAML content
    errors = validate_yaml_content(yaml_content, filepath)
    
    if errors:
        return False, errors
    
    return True, []

def main():
    parser = argparse.ArgumentParser(
        description='Validate YAML frontmatter in a single markdown file',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s myfile.md                    # Validate a single file
  %(prog)s core/00072-MY-DOC.md        # Validate with path
  %(prog)s --verbose myfile.md         # Show detailed output
  %(prog)s --json myfile.md            # Output as JSON
  
Exit codes:
  0 - File is valid
  1 - Validation errors found
  2 - File error (not found, not readable, etc.)
        """
    )
    
    parser.add_argument('file', help='Path to the markdown file to validate')
    parser.add_argument('-v', '--verbose', action='store_true', 
                       help='Show detailed validation information')
    parser.add_argument('-j', '--json', action='store_true',
                       help='Output results as JSON')
    
    args = parser.parse_args()
    
    filepath = Path(args.file)
    
    # Validate the file
    is_valid, errors = validate_file(filepath, args.verbose)
    
    if args.json:
        # JSON output
        result = {
            'file': str(filepath),
            'valid': is_valid,
            'errors': errors
        }
        print(json.dumps(result, indent=2))
    else:
        # Human-readable output
        if is_valid:
            print(f"✅ {filepath}: Valid YAML frontmatter")
            if args.verbose:
                print("  All required fields present")
                print("  All field values valid")
        else:
            print(f"❌ {filepath}: Invalid YAML frontmatter")
            print(f"  Found {len(errors)} error(s):")
            for error in errors:
                print(f"  • {error}")
    
    # Exit with appropriate code
    if is_valid:
        sys.exit(0)
    elif errors and 'not found' not in errors[0].lower():
        sys.exit(1)  # Validation errors
    else:
        sys.exit(2)  # File errors

if __name__ == '__main__':
    main()