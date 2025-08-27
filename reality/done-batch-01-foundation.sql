---
session: "00050"
type: "migration-deployed"
status: "applied"
created: "2025-08-27"
title: "Deployed Migration: batch-01-foundation"
purpose: "Applied database migration - schemas, uuid-ossp"
topics: ["database", "migration", "reality", "deployed"]
priority: "P0"
domain: "reality"
reality_type: "deployed-migration"
deployment_status: "production"
verified: true
---

-- =============================================
-- Batch 01: Foundation
-- Session 00050
-- Purpose: Create extensions and schemas
-- Dependencies: None (runs first)
-- =============================================

-- Start transaction for safety
BEGIN;

-- =============================================
-- STEP 1: Enable Required Extensions
-- =============================================

-- UUID generation (critical for all tables)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Note: Other extensions like pgcrypto, pgjwt might be needed
-- but Supabase typically has these pre-installed

-- =============================================
-- STEP 2: Create Application Schemas
-- =============================================

-- Chat schema for messaging functionality
CREATE SCHEMA IF NOT EXISTS chat;
COMMENT ON SCHEMA chat IS 'Chat and messaging functionality';

-- Debate schema for debate-specific tables
CREATE SCHEMA IF NOT EXISTS debate;
COMMENT ON SCHEMA debate IS 'Debate competition and judging functionality';

-- Note: public schema already exists by default

-- =============================================
-- VERIFICATION QUERIES (Run these after commit)
-- =============================================
-- SELECT schema_name FROM information_schema.schemata 
-- WHERE schema_name IN ('public', 'chat', 'debate');
-- 
-- SELECT extname FROM pg_extension 
-- WHERE extname = 'uuid-ossp';

-- Commit the transaction
COMMIT;

-- =============================================
-- Expected Results:
-- - 3 schemas should exist: public, chat, debate
-- - uuid-ossp extension should be installed
-- =============================================

[
  {
    "extname": "uuid-ossp"
  }
]