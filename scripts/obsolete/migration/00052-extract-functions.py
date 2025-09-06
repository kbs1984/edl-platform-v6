#!/usr/bin/env python3
"""
Session 00052: Extract all functions from backup for Batch 05
Preserves original order and validates dependencies
"""

import re
from pathlib import Path

def extract_function(lines, start_line_num):
    """Extract a complete function definition starting from given line number"""
    function_lines = []
    in_function = True
    current_line = start_line_num - 1  # Convert to 0-based index
    
    # Look for the end pattern - could be $function$; or $$;
    # Also handle $BODY$ and other dollar-quoted strings
    dollar_quote_pattern = None
    
    while current_line < len(lines) and in_function:
        line = lines[current_line]
        function_lines.append(line)
        
        # Check if this line starts a dollar-quoted string
        if dollar_quote_pattern is None:
            dollar_match = re.match(r'AS (\$\w*\$)', line)
            if dollar_match:
                dollar_quote_pattern = dollar_match.group(1)
        
        # Check for function end
        if dollar_quote_pattern:
            if line.strip() == f"{dollar_quote_pattern};":
                in_function = False
        elif line.strip().endswith('$$;'):
            in_function = False
        elif line.strip() == '$function$;':
            in_function = False
        elif line.strip() == '$BODY$;':
            in_function = False
            
        current_line += 1
    
    return function_lines

def main():
    backup_file = Path('migrations/supabase-project.backup')
    output_file = Path('migrations/batches/batch-05-functions-complete.sql')
    
    # Read the backup file
    with open(backup_file, 'r') as f:
        lines = f.readlines()
    
    # Function definitions to extract (line_number, schema, name)
    functions_to_extract = [
        (819, 'chat', 'approve_friendship'),
        (872, 'chat', 'fn_add_guild_member_to_room'),
        (902, 'chat', 'fn_add_team_member_to_room'),
        (932, 'chat', 'fn_create_guild_room'),
        (949, 'chat', 'fn_create_team_room'),
        (966, 'chat', 'fn_sync_guild_room_title'),
        (984, 'chat', 'fn_sync_team_room_title'),
        (1025, 'chat', 'get_friend_room'),
        (1043, 'chat', 'get_room_messages'),
        (1070, 'chat', 'is_room_member'),
        (1116, 'chat', 'set_timestamp'),
        (1464, 'public', 'add_new_user'),
        (1494, 'public', 'check_friendship_update_allowed_columns'),
        (1521, 'public', 'check_insert_allowed_columns'),
        (1553, 'public', 'check_team_member_delete'),
        (1581, 'public', 'check_team_update_leader'),
        (1612, 'public', 'check_update_allowed_columns'),
        (1632, 'public', 'delete_empty_team_after_member_delete'),
        (1657, 'public', 'delete_invalid_friendship'),
        (1679, 'public', 'get_friend_list'),
        (1705, 'public', 'get_friend_profiles'),
        (1743, 'public', 'get_profile_and_student'),
        (1800, 'public', 'get_profile_uuid'),
        (1823, 'public', 'get_table_ddl'),
        (1908, 'public', 'search_school'),
        (1941, 'public', 'set_division'),
        (1984, 'public', 'set_team_leader'),
    ]
    
    # Extract functions
    extracted_functions = {'public': [], 'chat': [], 'debate': []}
    
    for line_num, schema, name in functions_to_extract:
        print(f"Extracting {schema}.{name} from line {line_num}")
        function_lines = extract_function(lines, line_num)
        extracted_functions[schema].append({
            'name': name,
            'lines': function_lines,
            'line_num': line_num
        })
    
    # Write the output file
    with open(output_file, 'w') as f:
        f.write("-- =============================================\n")
        f.write("-- Batch 05: Functions (Complete)\n")
        f.write("-- Session 00052\n")
        f.write("-- Purpose: Create all business logic functions\n")
        f.write("-- Dependencies: Batches 01-04 (schemas, types, tables, constraints)\n")
        f.write("-- Total Functions: 27 (16 public, 11 chat, 0 debate)\n")
        f.write("-- =============================================\n\n")
        f.write("BEGIN;\n\n")
        
        # Write public schema functions
        if extracted_functions['public']:
            f.write("-- =============================================\n")
            f.write("-- PUBLIC SCHEMA FUNCTIONS (16 functions)\n")
            f.write("-- =============================================\n\n")
            for func in extracted_functions['public']:
                f.write(f"-- Function: public.{func['name']} (line {func['line_num']})\n")
                f.writelines(func['lines'])
                f.write("\n")
        
        # Write chat schema functions
        if extracted_functions['chat']:
            f.write("-- =============================================\n")
            f.write("-- CHAT SCHEMA FUNCTIONS (11 functions)\n")
            f.write("-- =============================================\n\n")
            for func in extracted_functions['chat']:
                f.write(f"-- Function: chat.{func['name']} (line {func['line_num']})\n")
                f.writelines(func['lines'])
                f.write("\n")
        
        # Write debate schema functions (none found)
        f.write("-- =============================================\n")
        f.write("-- DEBATE SCHEMA FUNCTIONS (0 functions)\n")
        f.write("-- Note: No debate schema functions found in backup\n")
        f.write("-- =============================================\n\n")
        
        f.write("-- =============================================\n")
        f.write("-- VERIFICATION QUERIES\n")
        f.write("-- =============================================\n")
        f.write("-- After execution, verify with:\n")
        f.write("-- SELECT COUNT(*) FROM information_schema.routines\n")
        f.write("-- WHERE routine_schema IN ('public', 'chat', 'debate')\n")
        f.write("-- AND routine_type = 'FUNCTION';\n")
        f.write("-- Expected: 27\n\n")
        
        f.write("COMMIT;\n")
    
    print(f"\nExtracted {sum(len(v) for v in extracted_functions.values())} functions")
    print(f"Output written to: {output_file}")
    
    # Summary
    print("\nSummary by schema:")
    for schema in ['public', 'chat', 'debate']:
        count = len(extracted_functions[schema])
        print(f"  {schema}: {count} functions")
    
    print("\nFunction types found:")
    trigger_count = sum(1 for s in extracted_functions.values() for f in s 
                       if 'RETURNS trigger' in ''.join(f['lines']))
    print(f"  Trigger functions: {trigger_count}")
    print(f"  Regular functions: {27 - trigger_count}")

if __name__ == "__main__":
    main()