/**
 * Safe Query Wrapper - Session 00053
 * RLS-aware query patterns that distinguish between security blocks and actual errors
 * 
 * Key Insight: PGRST205 "table not found" usually means RLS is working, not that deployment failed
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { ClientType, SupabaseClientFactory } from './client-factory';

export interface QueryResult<T> {
  data: T | null;
  error: any;
  rlsBlocked: boolean;
  securityWorking: boolean;
}

export class SafeQuery {
  private client: SupabaseClient;
  private clientType: ClientType;
  
  constructor(clientType: ClientType = ClientType.AUTH) {
    this.clientType = clientType;
    this.client = SupabaseClientFactory.getInstance().getClient(clientType);
  }
  
  /**
   * Execute a query with RLS awareness
   * Distinguishes between:
   * - Successful query
   * - RLS block (security working correctly)
   * - Actual errors (network, malformed query, etc.)
   */
  async queryWithRLSCheck<T>(
    table: string,
    queryFn: (client: SupabaseClient) => Promise<any>,
    options?: { expectRLSBlock?: boolean }
  ): Promise<QueryResult<T>> {
    try {
      const result = await queryFn(this.client);
      
      // Check for RLS block
      if (result.error?.code === 'PGRST205') {
        // This is actually SUCCESS - security is working!
        return {
          data: null,
          error: result.error,
          rlsBlocked: true,
          securityWorking: true
        };
      }
      
      // Check for other permission errors
      if (result.error?.code === '42501') {
        // PostgreSQL insufficient privilege
        return {
          data: null,
          error: result.error,
          rlsBlocked: true,
          securityWorking: true
        };
      }
      
      // Handle actual errors
      if (result.error) {
        return {
          data: null,
          error: result.error,
          rlsBlocked: false,
          securityWorking: false
        };
      }
      
      // Success case
      return {
        data: result.data,
        error: null,
        rlsBlocked: false,
        securityWorking: true
      };
      
    } catch (error) {
      // Network or other unexpected errors
      return {
        data: null,
        error,
        rlsBlocked: false,
        securityWorking: false
      };
    }
  }
  
  /**
   * Helper to verify a table exists in the schema
   * This bypasses RLS to check actual table existence
   * MUST run server-side with service role client
   */
  async verifyTableExists(
    table: string,
    schema: string = 'public'
  ): Promise<boolean> {
    if (typeof window !== 'undefined') {
      throw new Error('Table verification must run server-side');
    }
    
    try {
      const serviceClient = SupabaseClientFactory.getInstance()
        .getClient(ClientType.SERVICE);
      
      // Query information_schema to check table existence
      const { data, error } = await serviceClient
        .rpc('table_exists', { 
          schema_name: schema, 
          table_name: table 
        });
      
      if (error) {
        // Fallback: try direct query
        const { error: directError } = await serviceClient
          .from(table)
          .select('*')
          .limit(0);
        
        // If no error or PGRST205, table exists
        return !directError || directError.code === 'PGRST205';
      }
      
      return !!data;
    } catch (error) {
      console.error('Error verifying table existence:', error);
      return false;
    }
  }
  
  /**
   * Test if current user has access to a table
   * Useful for checking permissions without fetching data
   */
  async testAccess(table: string): Promise<{
    hasAccess: boolean;
    isBlocked: boolean;
    error?: any;
  }> {
    const result = await this.queryWithRLSCheck(
      table,
      (client) => client.from(table).select('*').limit(0)
    );
    
    return {
      hasAccess: !result.rlsBlocked && !result.error,
      isBlocked: result.rlsBlocked,
      error: result.error
    };
  }
  
  /**
   * Get a user-friendly message for query results
   */
  getResultMessage<T>(result: QueryResult<T>): string {
    if (result.rlsBlocked) {
      if (this.clientType === ClientType.ANON) {
        return 'Authentication required to access this data';
      }
      return 'You do not have permission to access this data';
    }
    
    if (result.error) {
      if (result.error.message?.includes('network')) {
        return 'Network error - please check your connection';
      }
      if (result.error.message?.includes('JWT')) {
        return 'Session expired - please sign in again';
      }
      return `Error: ${result.error.message || 'Unknown error occurred'}`;
    }
    
    if (!result.data) {
      return 'No data found';
    }
    
    return 'Success';
  }
  
  /**
   * Batch permission check for multiple tables
   * Useful for dashboard initialization
   */
  async checkMultipleTableAccess(tables: string[]): Promise<{
    [table: string]: {
      accessible: boolean;
      rlsProtected: boolean;
    }
  }> {
    const results: any = {};
    
    for (const table of tables) {
      const access = await this.testAccess(table);
      results[table] = {
        accessible: access.hasAccess,
        rlsProtected: access.isBlocked
      };
    }
    
    return results;
  }
}

/**
 * Utility to interpret PGRST errors correctly
 */
export class PGRSTErrorInterpreter {
  static interpret(error: any): {
    isSecurityBlock: boolean;
    isDeploymentIssue: boolean;
    userMessage: string;
    developerMessage: string;
  } {
    if (!error) {
      return {
        isSecurityBlock: false,
        isDeploymentIssue: false,
        userMessage: 'No error',
        developerMessage: 'No error provided'
      };
    }
    
    // PGRST205 - PostgREST v13.0.0+ DEFINITIVELY means table doesn't exist
    if (error.code === 'PGRST205') {
      return {
        isSecurityBlock: false,
        isDeploymentIssue: true,
        userMessage: 'System configuration error',
        developerMessage: 'Table does NOT exist (PGRST205 in v13.0.0+ is definitive). Check migration.'
      };
    }
    
    // 42501 - PostgreSQL insufficient privilege
    if (error.code === '42501') {
      return {
        isSecurityBlock: true,
        isDeploymentIssue: false,
        userMessage: 'Insufficient permissions',
        developerMessage: 'User lacks required database privileges'
      };
    }
    
    // 42P01 - Table actually doesn't exist
    if (error.code === '42P01') {
      return {
        isSecurityBlock: false,
        isDeploymentIssue: true,
        userMessage: 'System configuration error',
        developerMessage: 'Table does not exist in database - check migration'
      };
    }
    
    // PGRST301 - JWT error
    if (error.code === 'PGRST301') {
      return {
        isSecurityBlock: true,
        isDeploymentIssue: false,
        userMessage: 'Authentication error - please sign in again',
        developerMessage: 'JWT token issue - expired or malformed'
      };
    }
    
    // Default interpretation
    return {
      isSecurityBlock: false,
      isDeploymentIssue: false,
      userMessage: error.message || 'An error occurred',
      developerMessage: `Unhandled error code: ${error.code} - ${error.message}`
    };
  }
}