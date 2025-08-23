#!/bin/bash
# Extract all application components from backup

BACKUP="migrations/supabase-project.backup"
OUTPUT="migrations/00050-COMPLETE-extraction.sql"

echo "-- =============================================" > $OUTPUT
echo "-- COMPLETE Application Schema from Backup" >> $OUTPUT
echo "-- Session 00050 - All Components" >> $OUTPUT
echo "-- =============================================" >> $OUTPUT
echo "" >> $OUTPUT

# Extract Types
echo "-- TYPES" >> $OUTPUT
grep -A 10 "CREATE TYPE public\.\|CREATE TYPE chat\.\|CREATE TYPE debate\." $BACKUP >> $OUTPUT
echo "" >> $OUTPUT

# Extract Tables  
echo "-- TABLES" >> $OUTPUT
sed -n '/^CREATE TABLE public\./,/^);$/p' $BACKUP >> $OUTPUT
sed -n '/^CREATE TABLE chat\./,/^);$/p' $BACKUP >> $OUTPUT
sed -n '/^CREATE TABLE debate\./,/^);$/p' $BACKUP >> $OUTPUT
echo "" >> $OUTPUT

# Extract Indexes
echo "-- INDEXES" >> $OUTPUT
grep "CREATE.*INDEX.*public\.\|CREATE.*INDEX.*chat\.\|CREATE.*INDEX.*debate\." $BACKUP >> $OUTPUT
echo "" >> $OUTPUT

# Extract Functions (multiline)
echo "-- FUNCTIONS" >> $OUTPUT
sed -n '/^CREATE.*FUNCTION public\./,/\$function\$;$/p' $BACKUP >> $OUTPUT
sed -n '/^CREATE.*FUNCTION chat\./,/\$function\$;$/p' $BACKUP >> $OUTPUT
sed -n '/^CREATE.*FUNCTION debate\./,/\$function\$;$/p' $BACKUP >> $OUTPUT
echo "" >> $OUTPUT

# Extract Triggers
echo "-- TRIGGERS" >> $OUTPUT
grep "CREATE TRIGGER" $BACKUP | grep -E "public\.|chat\.|debate\." >> $OUTPUT

echo "Extraction complete!"
wc -l $OUTPUT
