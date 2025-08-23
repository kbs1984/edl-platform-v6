/**
 * Supabase Client Factory - Session 00053
 * Secure multi-client pattern for proper separation of concerns
 * 
 * Security Principles:
 * - Anonymous client for public operations only
 * - Authenticated client for user-specific operations
 * - Service role client NEVER exposed to frontend
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

export enum ClientType {
  ANON = 'anon',      // Public operations, no auth
  AUTH = 'auth',      // User operations, requires auth
  SERVICE = 'service' // Admin operations, server-only
}

export class SupabaseClientFactory {
  private static instance: SupabaseClientFactory;
  private clients: Map<ClientType, SupabaseClient> = new Map();
  
  private constructor() {
    this.validateEnvironment();
    this.initializeClients();
  }
  
  static getInstance(): SupabaseClientFactory {
    if (!this.instance) {
      this.instance = new SupabaseClientFactory();
    }
    return this.instance;
  }
  
  private validateEnvironment() {
    // Frontend validation
    if (typeof window !== 'undefined') {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
      }
      if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
      }
      // CRITICAL: Service key should NEVER be in browser
      if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error('🚨 SECURITY VIOLATION: Service role key exposed to browser!');
      }
    } else {
      // Server-side validation
      if (!process.env.SUPABASE_URL) {
        throw new Error('Missing SUPABASE_URL for server operations');
      }
      if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.warn('Missing SUPABASE_SERVICE_ROLE_KEY - admin operations unavailable');
      }
    }
  }
  
  private initializeClients() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!url || !anonKey) {
      throw new Error('Missing required Supabase configuration');
    }
    
    // Anonymous client - minimal permissions
    this.clients.set(ClientType.ANON, createClient(url, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      },
      global: {
        headers: {
          'x-client-type': 'anonymous'
        }
      }
    }));
    
    // Authenticated client - user sessions
    this.clients.set(ClientType.AUTH, createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        storageKey: 'edl-auth-token'
      },
      global: {
        headers: {
          'x-client-type': 'authenticated'
        }
      }
    }));
    
    // Service role client - server only, bypasses RLS
    if (typeof window === 'undefined' && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      this.clients.set(ClientType.SERVICE, createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false
          },
          global: {
            headers: {
              'x-client-type': 'service-role',
              'x-warning': 'bypasses-rls'
            }
          }
        }
      ));
    }
  }
  
  getClient(type: ClientType): SupabaseClient {
    // Runtime security check
    if (type === ClientType.SERVICE && typeof window !== 'undefined') {
      throw new Error('🚨 SECURITY: Service client cannot be used in browser context');
    }
    
    const client = this.clients.get(type);
    if (!client) {
      throw new Error(`Client type ${type} not available in this context`);
    }
    
    return client;
  }
  
  // Helper to check if service client is available
  hasServiceClient(): boolean {
    return this.clients.has(ClientType.SERVICE);
  }
  
  // Get current user from auth client
  async getCurrentUser() {
    const authClient = this.getClient(ClientType.AUTH);
    const { data: { user }, error } = await authClient.auth.getUser();
    return { user, error };
  }
  
  // Sign out from auth client
  async signOut() {
    const authClient = this.getClient(ClientType.AUTH);
    return authClient.auth.signOut();
  }
}

// Export singleton instance for convenience
export const supabaseFactory = SupabaseClientFactory.getInstance();