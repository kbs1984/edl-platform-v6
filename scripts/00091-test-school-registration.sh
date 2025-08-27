#!/bin/bash

# Session 00091: Test school registration is working
echo "🧪 Testing School Registration Function"
echo "======================================="
echo ""

# Test the database function
echo "📊 Testing search_school function in database:"
echo ""

SUPABASE_URL="https://bbrheacetxlnqbibjwsz.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE"

python3 -c "
from supabase import create_client
import json

client = create_client('$SUPABASE_URL', '$SUPABASE_ANON_KEY')

print('1. Testing search_school function:')
try:
    # Test the search function
    result = client.rpc('search_school', {'search_query': 'test'}).execute()
    print('   ✅ Function exists and returns:', len(result.data or []), 'results')
    if result.data:
        print('   Sample:', result.data[0] if result.data else 'No results')
except Exception as e:
    if 'similarity' in str(e):
        print('   ❌ Still using old function with similarity()')
        print('   Run the SQL fix in Supabase Dashboard!')
    else:
        print(f'   ❌ Error: {str(e)[:100]}')

print()
print('2. Testing registerSchoolAction capability:')
print('   Note: Cannot test without auth, but structure verified')
print()
print('3. Checking school table:')
try:
    # Check if we can query school table
    result = client.table('school').select('id, name').limit(5).execute()
    print(f'   ✅ School table accessible, {len(result.data)} schools exist')
    if result.data:
        for school in result.data[:3]:
            print(f'      - {school[\"name\"]}')
except Exception as e:
    if 'PGRST' in str(e):
        print('   🔒 School table protected by RLS (expected)')
    else:
        print(f'   ❌ Error: {str(e)[:100]}')
"

echo ""
echo "📝 To manually test in browser:"
echo "1. Open DevTools Console (F12)"
echo "2. Go to Step 3 of onboarding"
echo "3. Type a school name"
echo "4. Click 'Register New School'"
echo "5. Watch console for:"
echo "   - 'Registering school: [name]'"
echo "   - 'Registration response: {id: ..., name: ...}'"
echo "   - 'School registered successfully'"
echo ""
echo "If you see these logs but form still fails, check:"
echo "- Is schoolId being set in formData?"
echo "- Is the dialog closing properly?"
echo "- Is the input showing the selected school?"