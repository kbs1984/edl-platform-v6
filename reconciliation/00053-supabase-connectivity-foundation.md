---
created: '2025-08-23'
domain: reconciliation
priority: P1
purpose: Document secure supabase connectivity foundation
session: '00053'
status: current
title: Secure Supabase Connectivity Foundation
topics:
- auth
- documentation
type: guide
implements:
- requirement-to-be-specified
modified: '2025-08-27'
---

# Secure Supabase Connectivity Foundation
**Session**: 00053  
**Purpose**: Establish secure, scalable connectivity patterns for all future features  
**Security First**: Separate clients, proper key management, RLS-aware  

---

## Core Architecture: Three-Client Pattern

### 1. Anonymous Client (Public Operations)
**Use Cases**: Public data, pre-auth operations, health checks  
**Security**: Minimal permissions, rate-limited  
**Key**: Public anon key (safe to expose)

### 2. Authenticated Client (User Operations)  
**Use Cases**: User-specific data, profile management, team operations  
**Security**: RLS-enforced, user-scoped, session-based  
**Key**: Same anon key but with auth session

### 3. Service Role Client (Admin Operations)
**Use Cases**: Migrations, admin tasks, bypasses RLS  
**Security**: NEVER exposed to frontend, server-only  
**Key**: Service role key (SECRET - backend only)

---

## Implementation Pattern

### Base Client Factory

```typescript
// lib/supabase/client-factory.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export enum ClientType {
  ANON = 'anon',
  AUTH = 'auth', 
  SERVICE = 'service'
}

export class SupabaseClientFactory {
  private static instance: SupabaseClientFactory;
  private clients: Map<ClientType, SupabaseClient> = new Map();
  
  private constructor() {
    this.initializeClients();
  }
  
  static getInstance(): SupabaseClientFactory {
    if (!this.instance) {
      this.instance = new SupabaseClientFactory();
    }
    return this.instance;
  }
  
  private initializeClients() {
    // Anonymous client for public operations
    this.clients.set(ClientType.ANON, createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      }
    ));
    
    // Authenticated client for user operations
    this.clients.set(ClientType.AUTH, createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      }
    ));
    
    // Service role client (server-only!)
    if (typeof window === 'undefined') {
      this.clients.set(ClientType.SERVICE, createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false
          }
        }
      ));
    }
  }
  
  getClient(type: ClientType): SupabaseClient {
    const client = this.clients.get(type);
    if (!client) {
      throw new Error(`Client type ${type} not available in this context`);
    }
    return client;
  }
}
```

---

## RLS-Aware Query Patterns

### Safe Query Wrapper

```typescript
// lib/supabase/safe-query.ts
export class SafeQuery {
  private client: SupabaseClient;
  
  constructor(clientType: ClientType = ClientType.AUTH) {
    this.client = SupabaseClientFactory.getInstance().getClient(clientType);
  }
  
  async queryWithRLSCheck<T>(
    table: string,
    query: () => Promise<any>
  ): Promise<{ data: T | null; error: any; rlsBlocked: boolean }> {
    try {
      const result = await query();
      
      if (result.error?.code === 'PGRST205') {
        // Table exists but RLS is blocking - this is GOOD!
        return {
          data: null,
          error: result.error,
          rlsBlocked: true  // Signal that security is working
        };
      }
      
      return {
        data: result.data,
        error: result.error,
        rlsBlocked: false
      };
    } catch (error) {
      return {
        data: null,
        error,
        rlsBlocked: false
      };
    }
  }
  
  // Verify table existence separately from access
  async verifyTableExists(table: string): Promise<boolean> {
    // This requires service role client
    if (typeof window !== 'undefined') {
      throw new Error('Table verification must run server-side');
    }
    
    const serviceClient = SupabaseClientFactory.getInstance()
      .getClient(ClientType.SERVICE);
    
    const { data } = await serviceClient
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', table)
      .single();
    
    return !!data;
  }
}
```

---

## Security Patterns

### 1. Environment Variable Safety

```typescript
// lib/supabase/env-validator.ts
export class EnvValidator {
  static validate() {
    // Frontend can only access NEXT_PUBLIC_ vars
    if (typeof window !== 'undefined') {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        throw new Error('Missing public Supabase URL');
      }
      if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error('Missing public anon key');
      }
      // Service key should NEVER be accessible in browser
      if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error('CRITICAL: Service key exposed to browser!');
      }
    } else {
      // Server-side needs all keys
      if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error('Missing service role key for server operations');
      }
    }
  }
}
```

### 2. Operation Context Manager

```typescript
// lib/supabase/operation-context.ts
export enum OperationContext {
  PUBLIC_READ = 'public_read',
  USER_READ = 'user_read',
  USER_WRITE = 'user_write',
  ADMIN_READ = 'admin_read',
  ADMIN_WRITE = 'admin_write',
  MIGRATION = 'migration'
}

export class ContextManager {
  static getClientForOperation(context: OperationContext): ClientType {
    switch (context) {
      case OperationContext.PUBLIC_READ:
        return ClientType.ANON;
      
      case OperationContext.USER_READ:
      case OperationContext.USER_WRITE:
        return ClientType.AUTH;
      
      case OperationContext.ADMIN_READ:
      case OperationContext.ADMIN_WRITE:
      case OperationContext.MIGRATION:
        if (typeof window !== 'undefined') {
          throw new Error(`Operation ${context} cannot run in browser`);
        }
        return ClientType.SERVICE;
      
      default:
        return ClientType.AUTH;
    }
  }
}
```

---

## Usage Examples

### Public Operation (No Auth Required)

```typescript
// Check if system is healthy
async function checkHealth() {
  const query = new SafeQuery(ClientType.ANON);
  
  // This might fail with RLS, which is fine
  const result = await query.queryWithRLSCheck('profiles', 
    () => query.client.from('profiles').select('count')
  );
  
  if (result.rlsBlocked) {
    console.log('✅ RLS is protecting data correctly');
  }
}
```

### User Operation (Auth Required)

```typescript
// Get current user's profile
async function getUserProfile(userId: string) {
  const query = new SafeQuery(ClientType.AUTH);
  
  const result = await query.queryWithRLSCheck('student',
    () => query.client
      .from('student')
      .select('*')
      .eq('user_id', userId)
      .single()
  );
  
  if (result.rlsBlocked) {
    throw new Error('User not authenticated or lacks permissions');
  }
  
  return result.data;
}
```

### Admin Operation (Server Only)

```typescript
// Server-side API route only
async function adminGetAllUsers() {
  if (typeof window !== 'undefined') {
    throw new Error('Admin operations cannot run in browser');
  }
  
  const serviceClient = SupabaseClientFactory.getInstance()
    .getClient(ClientType.SERVICE);
  
  // Bypasses RLS - use with caution!
  const { data, error } = await serviceClient
    .from('student')
    .select('*');
  
  return { data, error };
}
```

---

## Testing Strategy

### 1. RLS Verification Tests

```typescript
// tests/supabase-connectivity.test.ts
describe('Supabase Connectivity', () => {
  it('should block anonymous access to protected tables', async () => {
    const query = new SafeQuery(ClientType.ANON);
    const result = await query.queryWithRLSCheck('student',
      () => query.client.from('student').select('*')
    );
    
    expect(result.rlsBlocked).toBe(true);
    expect(result.error.code).toBe('PGRST205');
  });
  
  it('should allow authenticated access to own data', async () => {
    const query = new SafeQuery(ClientType.AUTH);
    // Sign in first
    await query.client.auth.signIn({ email, password });
    
    const result = await query.queryWithRLSCheck('student',
      () => query.client.from('student').select('*')
    );
    
    expect(result.rlsBlocked).toBe(false);
    expect(result.data).toBeDefined();
  });
});
```

---

## Security Checklist

- [ ] Service role key NEVER exposed to frontend
- [ ] All keys stored in environment variables
- [ ] RLS enabled on all sensitive tables
- [ ] PGRST205 errors handled as security success
- [ ] Client type appropriate for operation context
- [ ] No client reuse across security boundaries
- [ ] Session management for authenticated clients
- [ ] Rate limiting on anonymous operations

---

## Migration Lock Integration

This connectivity foundation respects the migration lock:

```typescript
// Verify database structure before operations
async function verifyDatabaseIntegrity() {
  const lockFile = require('./reality/truth-seed-manifest-lock.json');
  const expectedChecksum = lockFile.database_checksum;
  
  // Run integrity check
  const currentChecksum = await generateCurrentChecksum();
  
  if (currentChecksum !== expectedChecksum) {
    throw new Error('Database drift detected! Run migration integrity check.');
  }
}
```

---

## Future Feature Integration

New features can build on this foundation:

```typescript
// feature/team-management.ts
import { SafeQuery, ClientType } from '@/lib/supabase';

export class TeamManager {
  private query: SafeQuery;
  
  constructor() {
    // Automatically uses authenticated client
    this.query = new SafeQuery(ClientType.AUTH);
  }
  
  async createTeam(name: string) {
    // Foundation handles RLS, errors, and security
    return this.query.queryWithRLSCheck('teams',
      () => this.query.client.from('teams').insert({ name })
    );
  }
}
```

---

*This foundation provides security by default, making it harder to accidentally expose sensitive data or operations.*