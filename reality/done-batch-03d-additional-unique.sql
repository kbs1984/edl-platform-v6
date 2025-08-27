---
session: "00051"
type: "migration-deployed"
status: "applied"
created: "2025-08-27"
title: "Deployed Migration: batch-03d-additional-unique"
purpose: "Applied database migration - additional constraints"
topics: ["database", "migration", "reality", "deployed"]
priority: "P0"
domain: "reality"
reality_type: "deployed-migration"
deployment_status: "production"
verified: true
---

-- =============================================
-- Batch 03d: Additional Unique Constraints
-- Session 00051
-- Purpose: Add missing UNIQUE constraint on judge.user_id
-- Dependencies: Batch 03c (other unique constraints)
-- NOTE: Must run BEFORE Batch 04 (foreign keys)
-- =============================================

BEGIN;

-- =============================================
-- ADDITIONAL UNIQUE CONSTRAINT
-- =============================================

-- Judge table needs unique constraint on user_id
-- This is referenced by judge_comments and judge_scores tables
-- This constraint was NOT in the original backup but is required
-- by the foreign key references
ALTER TABLE ONLY public.judge
    ADD CONSTRAINT judge_user_id_key UNIQUE (user_id);

-- =============================================
-- VERIFICATION QUERY
-- =============================================
-- SELECT constraint_name, column_name
-- FROM information_schema.constraint_column_usage
-- WHERE table_name = 'judge'
-- AND constraint_name LIKE '%user_id%';
--
-- Expected: judge_user_id_key constraint exists

COMMIT;