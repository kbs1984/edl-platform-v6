#!/bin/bash
# Final definitive extraction from backup

BACKUP="migrations/supabase-project.backup"
OUTPUT="migrations/00050-FINAL-COMPLETE-extraction.sql"

echo "-- =============================================" > $OUTPUT
echo "-- FINAL DEFINITIVE Application Schema from Backup" >> $OUTPUT
echo "-- Session 00050 - Authoritative Source" >> $OUTPUT
echo "-- =============================================" >> $OUTPUT
echo "" >> $OUTPUT

# Extract everything from line 600 (after system stuff) to line 14000 (before realtime)
# This includes ALL application components

echo "Extracting application components..."

# Filter out only application-related lines, exclude auth/storage/realtime/extensions
sed -n '600,14000p' $BACKUP | \
  grep -v "^CREATE.*SCHEMA auth" | \
  grep -v "^CREATE.*SCHEMA storage" | \
  grep -v "^CREATE.*SCHEMA realtime" | \
  grep -v "^CREATE.*SCHEMA extensions" | \
  grep -v "^ALTER.*SCHEMA auth" | \
  grep -v "^ALTER.*SCHEMA storage" | \
  grep -v "^ALTER.*SCHEMA realtime" | \
  grep -v "^ALTER.*SCHEMA extensions" | \
  grep -v "auth\." | \
  grep -v "storage\." | \
  grep -v "realtime\." | \
  grep -v "extensions\." | \
  grep -v "^--" | \
  grep -v "^SET " | \
  grep -v "^SELECT " | \
  grep -v "^\\\\" >> $OUTPUT

echo "Complete! Checking results..."
echo "Lines extracted:"
wc -l $OUTPUT | awk '{print $1}'

echo ""
echo "Component counts:"
echo "Tables: $(grep -c "^CREATE TABLE" $OUTPUT)"
echo "Functions: $(grep -c "^CREATE.*FUNCTION" $OUTPUT)"
echo "Indexes: $(grep -c "^CREATE.*INDEX" $OUTPUT)"
echo "Triggers: $(grep -c "^CREATE TRIGGER" $OUTPUT)"
echo "Types: $(grep -c "^CREATE TYPE" $OUTPUT)"
echo "Policies: $(grep -c "^CREATE POLICY" $OUTPUT)"
