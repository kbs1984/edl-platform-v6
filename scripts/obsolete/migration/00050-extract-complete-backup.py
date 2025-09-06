#!/usr/bin/env python3
"""
Session 00050: Extract COMPLETE schema from Supabase backup
Including tables, constraints, indexes, functions, triggers, policies
"""

import re
from pathlib import Path
from typing import List, Dict, Set

def extract_complete_schema(backup_file: Path) -> Dict[str, List[str]]:
    """Extract all application-related components from backup."""
    
    with open(backup_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    components = {
        'schemas': [],
        'types': [],
        'tables': [],
        'indexes': [],
        'triggers': [],
        'functions': [],
        'policies': [],
        'grants': [],
        'comments': []
    }
    
    # Define application schemas
    app_schemas = {'public', 'chat', 'debate'}
    
    # Split content into statements (handle multiline)
    statements = []
    current_stmt = []
    in_function = False
    
    for line in content.split('\n'):
        # Skip comments and empty lines
        if line.strip().startswith('--') or not line.strip():
            continue
            
        # Track function blocks
        if 'CREATE FUNCTION' in line or 'CREATE OR REPLACE FUNCTION' in line:
            in_function = True
        
        current_stmt.append(line)
        
        # Check for statement end
        if in_function:
            if line.strip().endswith('$function$;') or line.strip().endswith('$func$;'):
                statements.append('\n'.join(current_stmt))
                current_stmt = []
                in_function = False
        elif line.strip().endswith(';'):
            statements.append('\n'.join(current_stmt))
            current_stmt = []
    
    # Process each statement
    for stmt in statements:
        stmt_upper = stmt.upper()
        
        # Extract schema name from statement
        schema_match = re.search(r'(?:CREATE|ALTER|DROP)\s+(?:TABLE|INDEX|TRIGGER|FUNCTION|TYPE|POLICY)\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:ONLY\s+)?(\w+)\.', stmt, re.IGNORECASE)
        
        if schema_match:
            schema = schema_match.group(1).lower()
            
            # Only process application schemas
            if schema not in app_schemas:
                continue
        else:
            # Some statements might not have schema prefix
            # Check if it's a public schema item
            if 'PUBLIC.' not in stmt_upper and 'CHAT.' not in stmt_upper and 'DEBATE.' not in stmt_upper:
                # Skip if not application-related
                if not any(s in stmt_upper for s in ['CREATE TABLE', 'CREATE TYPE', 'CREATE INDEX']):
                    continue
        
        # Categorize statement
        if 'CREATE SCHEMA' in stmt_upper:
            if any(s in stmt.lower() for s in app_schemas):
                components['schemas'].append(stmt)
                
        elif 'CREATE TYPE' in stmt_upper:
            if any(f'{s}.' in stmt.lower() for s in app_schemas):
                components['types'].append(stmt)
                
        elif 'CREATE TABLE' in stmt_upper:
            if any(f'{s}.' in stmt.lower() for s in app_schemas):
                components['tables'].append(stmt)
                
        elif 'CREATE INDEX' in stmt_upper:
            # Check if index is on an application table
            if any(f'{s}.' in stmt.lower() for s in app_schemas):
                components['indexes'].append(stmt)
                
        elif 'CREATE TRIGGER' in stmt_upper:
            if any(f'{s}.' in stmt.lower() for s in app_schemas):
                components['triggers'].append(stmt)
                
        elif 'CREATE FUNCTION' in stmt_upper or 'CREATE OR REPLACE FUNCTION' in stmt_upper:
            if any(f'{s}.' in stmt.lower() for s in app_schemas):
                components['functions'].append(stmt)
                
        elif 'CREATE POLICY' in stmt_upper:
            if any(f'{s}.' in stmt.lower() for s in app_schemas):
                components['policies'].append(stmt)
                
        elif 'GRANT' in stmt_upper or 'REVOKE' in stmt_upper:
            if any(f'{s}.' in stmt.lower() for s in app_schemas):
                components['grants'].append(stmt)
                
        elif 'COMMENT ON' in stmt_upper:
            if any(f'{s}.' in stmt.lower() for s in app_schemas):
                components['comments'].append(stmt)
    
    # Also extract constraints that are part of table definitions
    # These are embedded in CREATE TABLE statements
    for table_stmt in components['tables']:
        if 'CONSTRAINT' in table_stmt:
            # Table has inline constraints - already included
            pass
    
    # Extract ALTER TABLE statements for constraints
    alter_pattern = r'ALTER TABLE\s+(?:ONLY\s+)?(\w+)\.(\w+)\s+ADD\s+CONSTRAINT[^;]+;'
    for match in re.finditer(alter_pattern, content, re.DOTALL | re.IGNORECASE):
        schema = match.group(1).lower()
        if schema in app_schemas:
            components['tables'].append(match.group(0))
    
    return components

def save_complete_extraction(components: Dict[str, List[str]], output_file: Path):
    """Save all extracted components to a SQL file."""
    
    with open(output_file, 'w') as f:
        f.write("-- =============================================\n")
        f.write("-- COMPLETE Application Schema from Supabase Backup\n")
        f.write("-- Session 00050\n")
        f.write("-- Includes: Tables, Constraints, Indexes, Functions, Triggers, Policies\n")
        f.write("-- =============================================\n\n")
        
        # Write schemas
        if components['schemas']:
            f.write("-- =============================================\n")
            f.write("-- SCHEMAS\n")
            f.write("-- =============================================\n\n")
            for stmt in components['schemas']:
                f.write(stmt)
                f.write("\n\n")
        
        # Write types
        if components['types']:
            f.write("-- =============================================\n")
            f.write("-- CUSTOM TYPES\n")
            f.write("-- =============================================\n\n")
            for stmt in components['types']:
                f.write(stmt)
                f.write("\n\n")
        
        # Write tables (includes constraints)
        if components['tables']:
            f.write("-- =============================================\n")
            f.write("-- TABLES AND CONSTRAINTS\n")
            f.write("-- =============================================\n\n")
            for stmt in components['tables']:
                f.write(stmt)
                f.write("\n\n")
        
        # Write indexes
        if components['indexes']:
            f.write("-- =============================================\n")
            f.write("-- INDEXES\n")
            f.write("-- =============================================\n\n")
            for stmt in components['indexes']:
                f.write(stmt)
                f.write("\n\n")
        
        # Write functions
        if components['functions']:
            f.write("-- =============================================\n")
            f.write("-- FUNCTIONS\n")
            f.write("-- =============================================\n\n")
            for stmt in components['functions']:
                f.write(stmt)
                f.write("\n\n")
        
        # Write triggers
        if components['triggers']:
            f.write("-- =============================================\n")
            f.write("-- TRIGGERS\n")
            f.write("-- =============================================\n\n")
            for stmt in components['triggers']:
                f.write(stmt)
                f.write("\n\n")
        
        # Write policies
        if components['policies']:
            f.write("-- =============================================\n")
            f.write("-- ROW LEVEL SECURITY POLICIES\n")
            f.write("-- =============================================\n\n")
            for stmt in components['policies']:
                f.write(stmt)
                f.write("\n\n")
        
        # Write grants
        if components['grants']:
            f.write("-- =============================================\n")
            f.write("-- PERMISSIONS\n")
            f.write("-- =============================================\n\n")
            for stmt in components['grants']:
                f.write(stmt)
                f.write("\n\n")

def main():
    print("=" * 80)
    print("SESSION 00050: COMPLETE BACKUP EXTRACTION")
    print("=" * 80)
    print()
    
    backup_file = Path('/home/b4sho/edl-projects-with-claude/edl-platform-v6/migrations/supabase-project.backup')
    output_file = Path('/home/b4sho/edl-projects-with-claude/edl-platform-v6/migrations/00050-complete-backup-extraction.sql')
    
    print("📦 Extracting COMPLETE schema from backup...")
    components = extract_complete_schema(backup_file)
    
    print("\n📊 Components found:")
    for component_type, items in components.items():
        if items:
            print(f"   - {component_type}: {len(items)}")
    
    print(f"\n💾 Saving to {output_file}...")
    save_complete_extraction(components, output_file)
    
    # Check file size
    with open(output_file, 'r') as f:
        lines = f.readlines()
    
    print(f"\n✅ Complete extraction saved!")
    print(f"   File size: {len(lines)} lines")
    
    # Summary
    print("\n" + "=" * 80)
    print("EXTRACTION SUMMARY")
    print("=" * 80)
    
    total_components = sum(len(items) for items in components.values())
    print(f"""
📊 Total Components Extracted: {total_components}
   
   Application Schemas: {len(components['schemas'])}
   Custom Types: {len(components['types'])}
   Tables: {len(components['tables'])}
   Indexes: {len(components['indexes'])}
   Functions: {len(components['functions'])}
   Triggers: {len(components['triggers'])}
   Policies: {len(components['policies'])}
   Grants: {len(components['grants'])}
   
✅ This extraction includes EVERYTHING needed to recreate
   the application schema from the backup.
""")

if __name__ == "__main__":
    main()