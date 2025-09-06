#!/usr/bin/env python3
"""
Session 00050: Create migration batches from Desktop's migration
Split into testable, manageable chunks
"""

import re
from pathlib import Path

def extract_tables_without_fkeys(content: str) -> str:
    """Extract table definitions but remove foreign key constraints."""
    
    tables = []
    
    # Find all CREATE TABLE statements
    table_pattern = r'CREATE TABLE\s+(?:IF NOT EXISTS\s+)?([^(]+)\s*\((.*?)\);'
    
    for match in re.finditer(table_pattern, content, re.DOTALL):
        table_name = match.group(1).strip()
        table_body = match.group(2)
        
        # Split into lines and filter out FOREIGN KEY constraints
        lines = []
        for line in table_body.split('\n'):
            # Skip foreign key constraints
            if 'FOREIGN KEY' in line.upper():
                continue
            # Skip references
            if 'REFERENCES' in line.upper() and 'DEFAULT' not in line.upper():
                continue
            
            # Remove trailing comma if this was before a foreign key
            line = line.rstrip()
            if line.endswith(','):
                # Check if next non-empty line would be foreign key
                lines.append(line)
            else:
                lines.append(line)
        
        # Clean up trailing commas
        cleaned_lines = []
        for i, line in enumerate(lines):
            if i == len(lines) - 1 and line.rstrip().endswith(','):
                cleaned_lines.append(line.rstrip()[:-1])
            else:
                cleaned_lines.append(line)
        
        table_def = f"CREATE TABLE {table_name} (\n{chr(10).join(cleaned_lines)}\n);"
        tables.append(table_def)
    
    return '\n\n'.join(tables)

def extract_foreign_keys(content: str) -> str:
    """Extract foreign key constraints as ALTER TABLE statements."""
    
    constraints = []
    
    # Find tables with foreign keys
    table_pattern = r'CREATE TABLE\s+(?:IF NOT EXISTS\s+)?([^(]+)\s*\((.*?)\);'
    
    for match in re.finditer(table_pattern, content, re.DOTALL):
        table_name = match.group(1).strip()
        table_body = match.group(2)
        
        # Find CONSTRAINT lines with FOREIGN KEY
        for line in table_body.split('\n'):
            if 'FOREIGN KEY' in line.upper():
                # Extract constraint name and definition
                constraint_match = re.search(r'CONSTRAINT\s+(\w+)\s+FOREIGN KEY\s*\(([^)]+)\)\s+REFERENCES\s+([^(]+)\(([^)]+)\)([^,]*)', line)
                if constraint_match:
                    const_name = constraint_match.group(1)
                    fk_cols = constraint_match.group(2)
                    ref_table = constraint_match.group(3)
                    ref_cols = constraint_match.group(4)
                    options = constraint_match.group(5).strip().rstrip(',')
                    
                    alter = f"ALTER TABLE {table_name}\n    ADD CONSTRAINT {const_name}\n    FOREIGN KEY ({fk_cols})\n    REFERENCES {ref_table}({ref_cols})"
                    if options:
                        alter += f" {options}"
                    alter += ";"
                    constraints.append(alter)
    
    return '\n\n'.join(constraints)

def extract_functions(content: str) -> list:
    """Extract all functions."""
    functions = []
    
    # Find all CREATE FUNCTION statements
    pattern = r'(CREATE\s+(?:OR\s+REPLACE\s+)?FUNCTION\s+[^;]+?(?:\$function\$|\$\$);)'
    
    for match in re.finditer(pattern, content, re.DOTALL):
        functions.append(match.group(1))
    
    return functions

def extract_triggers(content: str) -> list:
    """Extract all triggers."""
    triggers = []
    
    # Find all CREATE TRIGGER statements
    pattern = r'(CREATE\s+TRIGGER\s+[^;]+;)'
    
    for match in re.finditer(pattern, content, re.DOTALL):
        triggers.append(match.group(1))
    
    return triggers

def create_batches():
    """Create all batch files from Desktop's migration."""
    
    # Read Desktop's migration
    desktop_file = Path('/home/b4sho/edl-projects-with-claude/edl-platform-v6/reconciliation/migrations/desktop-edl-complete-migration-draft.sql')
    content = desktop_file.read_text()
    
    batch_dir = Path('/home/b4sho/edl-projects-with-claude/edl-platform-v6/reconciliation/migrations/batches')
    batch_dir.mkdir(exist_ok=True)
    
    # Batch 03: Tables without foreign keys
    print("Creating Batch 03: Tables...")
    tables_content = extract_tables_without_fkeys(content)
    
    batch_03 = f"""-- =============================================
-- Batch 03: Base Tables (Structure Only)
-- Session 00050
-- Purpose: Create all 36 tables without foreign keys
-- Dependencies: Batch 01 (schemas), Batch 02 (types)
-- =============================================

BEGIN;

-- =============================================
-- TABLES WITHOUT FOREIGN KEY CONSTRAINTS
-- These will be added in Batch 04
-- =============================================

{tables_content}

-- =============================================
-- VERIFICATION QUERIES
-- =============================================
-- SELECT COUNT(*) FROM information_schema.tables 
-- WHERE table_schema IN ('public', 'chat', 'debate')
-- AND table_type = 'BASE TABLE';
-- Expected: 36 tables

COMMIT;
"""
    
    (batch_dir / 'batch-03-tables.sql').write_text(batch_03)
    
    # Batch 04: Foreign Keys
    print("Creating Batch 04: Constraints...")
    fkeys = extract_foreign_keys(content)
    
    batch_04 = f"""-- =============================================
-- Batch 04: Foreign Key Constraints  
-- Session 00050
-- Purpose: Add all foreign key relationships
-- Dependencies: Batch 03 (all tables must exist)
-- =============================================

BEGIN;

-- =============================================
-- FOREIGN KEY CONSTRAINTS
-- =============================================

{fkeys}

-- =============================================
-- VERIFICATION QUERIES
-- =============================================
-- SELECT COUNT(*) FROM information_schema.table_constraints
-- WHERE constraint_type = 'FOREIGN KEY'
-- AND table_schema IN ('public', 'chat', 'debate');

COMMIT;
"""
    
    (batch_dir / 'batch-04-constraints.sql').write_text(batch_04)
    
    # Batch 05: Functions
    print("Creating Batch 05: Functions...")
    functions = extract_functions(content)
    
    batch_05 = f"""-- =============================================
-- Batch 05: Functions
-- Session 00050
-- Purpose: Create all business logic functions
-- Dependencies: Batch 03 (tables)
-- =============================================

BEGIN;

-- =============================================
-- APPLICATION FUNCTIONS
-- =============================================

{chr(10).join(functions)}

-- =============================================
-- VERIFICATION QUERIES
-- =============================================
-- SELECT COUNT(*) FROM information_schema.routines
-- WHERE routine_schema IN ('public', 'chat', 'debate')
-- AND routine_type = 'FUNCTION';

COMMIT;
"""
    
    (batch_dir / 'batch-05-functions.sql').write_text(batch_05)
    
    # Batch 06: Triggers
    print("Creating Batch 06: Triggers...")
    triggers = extract_triggers(content)
    
    batch_06 = f"""-- =============================================
-- Batch 06: Triggers
-- Session 00050
-- Purpose: Create all triggers
-- Dependencies: Batch 05 (functions)
-- =============================================

BEGIN;

-- =============================================
-- TRIGGERS
-- =============================================

{chr(10).join(triggers)}

-- =============================================
-- VERIFICATION QUERIES
-- =============================================
-- SELECT COUNT(*) FROM information_schema.triggers
-- WHERE trigger_schema IN ('public', 'chat', 'debate');

COMMIT;
"""
    
    (batch_dir / 'batch-06-triggers.sql').write_text(batch_06)
    
    print("\nBatches created successfully!")
    print(f"Location: {batch_dir}")
    
    # List all batch files
    print("\nBatch files:")
    for batch_file in sorted(batch_dir.glob('batch-*.sql')):
        size = len(batch_file.read_text().split('\n'))
        print(f"  - {batch_file.name}: {size} lines")

if __name__ == "__main__":
    create_batches()