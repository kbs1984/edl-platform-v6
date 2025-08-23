-- =============================================
-- Batch 01b: pg_trgm Extension
-- Session 00052
-- Purpose: Add missing pg_trgm extension for similarity() function
-- Dependencies: None
-- Required by: Batch 05 (public.search_school function)
-- =============================================

BEGIN;

-- Enable pg_trgm extension for fuzzy text search
CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA extensions;

-- Verify extension is available
-- SELECT * FROM pg_extension WHERE extname = 'pg_trgm';

COMMIT;

-- =============================================
-- NOTES:
-- This extension provides the similarity() function used by
-- public.search_school() in Batch 05
-- Must be executed before Batch 05
-- =============================================