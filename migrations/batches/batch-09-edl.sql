-- =============================================
-- Batch 09: EDL-Specific Additions
-- Session 00051
-- Purpose: Add call_sign column and other EDL requirements
-- Dependencies: Batch 03 (tables must exist)
-- =============================================

BEGIN;

-- Add call_sign column to student table
-- This is a critical EDL requirement not in the source database
ALTER TABLE public.student 
ADD COLUMN IF NOT EXISTS call_sign text;

-- Optional: Add a comment explaining this column
COMMENT ON COLUMN public.student.call_sign IS 'EDL Platform specific: Student identifier/nickname for platform interactions';

-- Optional: Add index for performance if searching by call_sign
CREATE INDEX IF NOT EXISTS idx_student_call_sign ON public.student(call_sign);

COMMIT;

-- =============================================
-- VERIFICATION QUERY
-- =============================================
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'student' 
-- AND column_name = 'call_sign';
--
-- Expected: 1 row showing call_sign column exists