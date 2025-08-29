#!/usr/bin/env python3
"""
Session 00052: Extract RLS policies and enablement from backup
"""

import re
from pathlib import Path

def main():
    backup_file = Path('migrations/supabase-project.backup')
    
    # Read the backup file
    with open(backup_file, 'r') as f:
        lines = f.readlines()
    
    # Find RLS enablement statements
    rls_enable = []
    for i, line in enumerate(lines):
        if re.match(r'^ALTER TABLE (public|chat|debate)\..*ENABLE ROW LEVEL SECURITY', line):
            rls_enable.append((i+1, line.strip()))
    
    # Find RLS policies
    policies = []
    for i, line in enumerate(lines):
        if re.match(r'^CREATE POLICY.*ON (public|chat|debate)\.', line):
            # Extract the full policy (can be multiline)
            policy_lines = [line]
            j = i + 1
            while j < len(lines) and not lines[j].strip().endswith(';'):
                policy_lines.append(lines[j])
                j += 1
            if j < len(lines):
                policy_lines.append(lines[j])
            policies.append((i+1, ''.join(policy_lines)))
    
    # Group by schema
    enable_by_schema = {'public': [], 'chat': [], 'debate': []}
    policies_by_schema = {'public': [], 'chat': [], 'debate': []}
    
    for line_num, stmt in rls_enable:
        for schema in ['public', 'chat', 'debate']:
            if f'{schema}.' in stmt:
                table = re.search(f'{schema}\\.(\w+)', stmt).group(1)
                enable_by_schema[schema].append((table, stmt))
                break
    
    for line_num, policy in policies:
        for schema in ['public', 'chat', 'debate']:
            if f'ON {schema}.' in policy:
                policies_by_schema[schema].append((line_num, policy))
                break
    
    # Print summary
    print("RLS Summary:")
    print("=" * 50)
    for schema in ['public', 'chat', 'debate']:
        print(f"\n{schema} schema:")
        print(f"  Tables with RLS enabled: {len(enable_by_schema[schema])}")
        print(f"  Policies: {len(policies_by_schema[schema])}")
        if enable_by_schema[schema]:
            print(f"  Tables: {', '.join([t for t, _ in enable_by_schema[schema]])}")
    
    print(f"\nTotal tables with RLS: {sum(len(e) for e in enable_by_schema.values())}")
    print(f"Total policies: {sum(len(p) for p in policies_by_schema.values())}")
    
    # Write to file
    output_file = Path('migrations/batches/batch-08-rls.sql')
    with open(output_file, 'w') as f:
        f.write("-- =============================================\n")
        f.write("-- Batch 08: Row Level Security (RLS)\n")
        f.write("-- Session 00052\n")
        f.write("-- Purpose: Enable RLS and create security policies\n")
        f.write("-- Dependencies: Batches 03-05 (tables and functions)\n")
        f.write(f"-- Total: {sum(len(e) for e in enable_by_schema.values())} tables, ")
        f.write(f"{sum(len(p) for p in policies_by_schema.values())} policies\n")
        f.write("-- =============================================\n\n")
        f.write("BEGIN;\n\n")
        
        # Write RLS enablement
        f.write("-- =============================================\n")
        f.write("-- ENABLE ROW LEVEL SECURITY\n")
        f.write("-- =============================================\n\n")
        
        for schema in ['public', 'chat', 'debate']:
            if enable_by_schema[schema]:
                f.write(f"-- {schema.upper()} schema tables\n")
                for table, stmt in enable_by_schema[schema]:
                    f.write(f"{stmt}\n")
                f.write("\n")
        
        # Write policies
        f.write("-- =============================================\n")
        f.write("-- SECURITY POLICIES\n")
        f.write("-- =============================================\n\n")
        
        for schema in ['public', 'chat', 'debate']:
            if policies_by_schema[schema]:
                f.write(f"-- {schema.upper()} schema policies ({len(policies_by_schema[schema])} policies)\n")
                f.write("-- =============================================\n\n")
                for line_num, policy in policies_by_schema[schema]:
                    f.write(f"-- Policy from line {line_num}\n")
                    f.write(f"{policy}\n")
        
        f.write("-- =============================================\n")
        f.write("-- VERIFICATION QUERIES\n")
        f.write("-- =============================================\n")
        f.write("-- Check RLS enabled:\n")
        f.write("-- SELECT schemaname, tablename, rowsecurity \n")
        f.write("-- FROM pg_tables \n")
        f.write("-- WHERE schemaname IN ('public', 'chat', 'debate')\n")
        f.write("-- AND rowsecurity = true;\n")
        f.write(f"-- Expected: {sum(len(e) for e in enable_by_schema.values())} tables\n\n")
        
        f.write("-- Check policies:\n")
        f.write("-- SELECT schemaname, tablename, COUNT(*) as policy_count\n")
        f.write("-- FROM pg_policies\n")
        f.write("-- WHERE schemaname IN ('public', 'chat', 'debate')\n")
        f.write("-- GROUP BY schemaname, tablename\n")
        f.write("-- ORDER BY schemaname, tablename;\n")
        f.write(f"-- Expected: {sum(len(p) for p in policies_by_schema.values())} total policies\n\n")
        
        f.write("COMMIT;\n")
    
    print(f"\nOutput written to: {output_file}")

if __name__ == "__main__":
    main()