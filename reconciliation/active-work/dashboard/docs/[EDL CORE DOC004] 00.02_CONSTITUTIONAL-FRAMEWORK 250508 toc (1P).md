---
session: "25050"
type: "documentation"
status: "current"
created: "2025-08-23"
title: "00.02_CONSTITUTIONAL-FRAMEWORK"
purpose: "Document 00.02_constitutional-framework"
topics: ['auth', 'database', 'documentation']
priority: "P1"
domain: "reconciliation"
---

EDL 00_PROJECT-OVERVIEW/

# 00.02_CONSTITUTIONAL-FRAMEWORK 
EDL Constitutional Framework: Supabase-First Architecture

## 0. 00.02 Table of Contents

1. Core Principles
2. Implementation Standards
3. Documentation Requirements
4. Terminology Alignment

## 1. Core Principles

1. **Supabase as Primary Database**: Supabase is the exclusive database technology for the EDL platform. All database interactions must be designed specifically for Supabase's capabilities and patterns.

2. **No Migration Context**: There is no migration from Parse or any other database system. Any references to Parse or other database technologies are purely conceptual and for design inspiration only.

3. **Leverage Supabase Native Features**: Implementation must prioritize and fully utilize Supabase's native capabilities:
   - Row-Level Security (RLS) for access control
   - Real-time subscriptions for live updates
   - Supabase Auth for all authentication
   - Supabase Storage for file management
   - PostgreSQL schema design best practices

4. **Schema Organization**: The database uses a multi-schema architecture with:
   - `public` schema for user management and general platform functionality
   - `debate` schema for debate-specific entities
   - Cross-schema operations follow Supabase's PostgreSQL implementation

5. **Security Implementation**: Security is exclusively implemented through:
   - Supabase RLS policies at the database level
   - JWT validation for authentication
   - Service roles for administrative operations only

## 2. Implementation Standards

1. **Code Patterns**:
   - All database access must use the Supabase client
   - Authentication must use Supabase Auth patterns
   - Error handling must align with Supabase's error patterns
   - File storage must use Supabase Storage API

2. **Noodl Integration**:
   - Noodl components must connect to Supabase via the Supabase client
   - State management should leverage Supabase's real-time capabilities where appropriate
   - Authentication flows must align with Supabase Auth

3. **n8n Integration**:
   - n8n workflows must use Supabase nodes for database operations
   - Authentication in n8n must use Supabase tokens or service role keys
   - Webhooks should leverage Supabase's capabilities where possible

## 3. Documentation Requirements

All documentation must:

1. Present Supabase as the foundation, not a migration target
2. Provide Supabase-specific examples for all database operations
3. Highlight Supabase-specific optimizations and features
4. Avoid comparisons to other database technologies except for conceptual explanation
5. Include proper schema references (public vs. debate) in all code examples

## 4. Terminology Alignment

To maintain consistency across documentation:

1. Use "tables" not "classes" when referring to data structures
2. Use "RLS policies" not "ACLs" when referring to access control
3. Use "JWT" not "session tokens" when referring to authentication
4. Use "schemas" not "namespaces" when referring to database organization
5. Use "Supabase client" not "database client" when referring to database access

This constitutional document should serve as the foundation for all EDL development and documentation. Any deviation from these principles must be explicitly justified and approved.
