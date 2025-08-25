---
created: '2025-08-23'
domain: reconciliation
priority: P1
purpose: Document secure supabase connectivity foundation
session: legacy
status: current
title: Secure Supabase Connectivity Foundation
topics:
- guide
type: guide
---

# Secure Supabase Connectivity Foundation

**Session 00053** | **Created**: 2025-08-22  
**Purpose**: Security-first connectivity patterns for the EDL Platform

## 🎯 Overview

This foundation provides secure, scalable Supabase connectivity with proper client separation and RLS awareness. Future features can build on this without worrying about security vulnerabilities.

## 🔐 Core Security Principles

1. **Three-Client Pattern**: Separate clients for different security contexts
2. **RLS Awareness**: PGRST205 errors mean security is working, not broken
3. **No Service Keys in Frontend**: Service role never exposed to browser
4. **Fail Secure**: Default to denying access when uncertain

## 📁 File Structure

```
lib/supabase/
├── client-factory.ts      # Multi-client management
├── safe-query.ts          # RLS-aware query wrapper
├── usage-examples.ts      # Practical implementation patterns
├── README.md             # This file
└── .env.example          # Environment configuration
```

## 🚀 Quick Start

### 1. Set Up Environment

```bash
# Copy example environment
cp .env.example .env.local

# Add your service role key (backend only!)
# Get from Supabase Dashboard > Settings > API
```

### 2. Basic Usage

```typescript
import { ClientType } from '@/lib/supabase/client-factory';
import { SafeQuery } from '@/lib/supabase/safe-query';

// Create a query wrapper
const query = new SafeQuery(ClientType.AUTH);

// Execute RLS-aware query
const result = await query.queryWithRLSCheck('student',
  (client) => client.from('student').select('*')
);

if (result.rlsBlocked) {
  console.log('User lacks permission (RLS working!)');
} else if (result.data) {
  console.log('Data retrieved:', result.data);
}
```

## 🔍 Understanding PGRST Errors

### The Critical Insight

**PGRST205 "table not found" usually means RLS is protecting the table, NOT that it doesn't exist!**

```typescript
// ❌ WRONG interpretation
if (error.code === 'PGRST205') {
  panic('Database not deployed!');
}

// ✅ CORRECT interpretation  
if (error.code === 'PGRST205') {
  console.log('RLS is protecting data - user needs auth');
}
```

### Error Code Reference

| Code | Meaning | Common Cause | Action |
|------|---------|--------------|--------|
| PGRST205 | Table not in API | RLS blocking | ✅ Security working |
| 42501 | Insufficient privilege | User lacks permission | Check policies |
| 42P01 | Table doesn't exist | Migration issue | ❌ Check migration |
| PGRST301 | JWT error | Token expired | Re-authenticate |

## 🏗️ Architecture Patterns

### Pattern 1: Anonymous Operations

```typescript
// For public data, health checks
const query = new SafeQuery(ClientType.ANON);
const health = await query.testAccess('public_data');
```

### Pattern 2: User Operations

```typescript
// For authenticated user data
const query = new SafeQuery(ClientType.AUTH);
const profile = await query.queryWithRLSCheck('profile', /*...*/);
```

### Pattern 3: Admin Operations (Server Only)

```typescript
// NEVER in browser code!
if (typeof window === 'undefined') {
  const client = supabaseFactory.getClient(ClientType.SERVICE);
  // Bypasses RLS - use carefully
}
```

## 🧪 Testing

### Test RLS is Working

```bash
# Run connectivity test
python3 scripts/00053-test-secure-connectivity.py

# Expected output:
# ✅ student: RLS working correctly (PGRST205)
# ✅ guardian: RLS working correctly (PGRST205)
```

### Test Table Existence

```typescript
// Server-side only
const exists = await query.verifyTableExists('student');
console.log('Table exists:', exists); // true

const fake = await query.verifyTableExists('fake_table');
console.log('Fake exists:', fake); // false
```

## 🔒 Migration Lock Integration

The connectivity foundation respects the migration lock from Session 53:

```typescript
// Before any operations
const lockFile = require('./reality/truth-seed-manifest-lock.json');
const expectedChecksum = lockFile.database_checksum;

// Verify integrity
if (currentChecksum !== expectedChecksum) {
  throw new Error('Database drift detected!');
}
```

## 📊 Guaranteed Tables (From Migration Lock)

These 36 tables are guaranteed to exist:

### Public Schema (17 tables)
- student (with call_sign column!)
- guardian, judge, admin, profile
- team, team_member, guild, guild_member
- invitation, friendship, school
- guardian_request (note: has "reciever" typo)

### Chat Schema (3 tables)
- message, participant, room

### Debate Schema (16 tables)
- debates, ballots, motions, participants, etc.

## 🚦 Building New Features

New features should follow this pattern:

```typescript
// feature/my-feature.ts
import { SafeQuery, ClientType } from '@/lib/supabase';

export class MyFeature {
  private query: SafeQuery;
  
  constructor() {
    // Choose appropriate client type
    this.query = new SafeQuery(ClientType.AUTH);
  }
  
  async doSomething() {
    const result = await this.query.queryWithRLSCheck(
      'table_name',
      (client) => client.from('table_name').select('*')
    );
    
    // Handle RLS blocks gracefully
    if (result.rlsBlocked) {
      return { error: 'Permission denied' };
    }
    
    return result.data;
  }
}
```

## ⚠️ Common Pitfalls to Avoid

1. **Don't panic on PGRST205** - It means security is working
2. **Don't use service client in frontend** - It bypasses all security
3. **Don't share clients between contexts** - Each context needs its own
4. **Don't skip RLS checks** - Always use SafeQuery wrapper
5. **Don't forget the "reciever" typo** - It's locked in the migration

## 📚 Further Reading

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [Session 44 Database Verification Protocol](../../CLAUDE.md#database-verification-protocol)
- [Migration Lock System](../../MIGRATION-COMPLETION-CERTIFICATE.md)
- [Truth Seed Adoption Decision](../../TRUTH-SEED-ADOPTION-DECISION.md)

## 🎉 Success Indicators

You know the foundation is working when:
- ✅ Anonymous queries get PGRST205 errors
- ✅ Authenticated users can access their own data
- ✅ Service client only works server-side
- ✅ Tables match migration lock checksum
- ✅ New features can be built without auth confusion

---

*Built with security by default. RLS errors are features, not bugs.*