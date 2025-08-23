/**
 * Supabase Connectivity Usage Examples - Session 00053
 * Practical patterns for building features on the secure foundation
 */

import { ClientType, supabaseFactory } from './client-factory';
import { SafeQuery, PGRSTErrorInterpreter } from './safe-query';

// ============================================
// Example 1: User Authentication Flow
// ============================================

export class AuthService {
  private query: SafeQuery;
  
  constructor() {
    // Auth operations use the AUTH client
    this.query = new SafeQuery(ClientType.AUTH);
  }
  
  async signUp(email: string, password: string) {
    const client = supabaseFactory.getClient(ClientType.AUTH);
    
    // Sign up user
    const { data: authData, error: authError } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          // Custom metadata
          signup_date: new Date().toISOString()
        }
      }
    });
    
    if (authError) {
      const interpretation = PGRSTErrorInterpreter.interpret(authError);
      throw new Error(interpretation.userMessage);
    }
    
    // The handle_new_user trigger will auto-create profile
    // But we can verify it worked:
    if (authData.user) {
      const profileCheck = await this.query.queryWithRLSCheck('profile',
        (client) => client
          .from('profile')
          .select('*')
          .eq('id', authData.user.id)
          .single()
      );
      
      if (profileCheck.rlsBlocked) {
        console.log('Profile created but RLS preventing immediate access (normal)');
      }
    }
    
    return authData;
  }
  
  async signIn(email: string, password: string) {
    const client = supabaseFactory.getClient(ClientType.AUTH);
    
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      const interpretation = PGRSTErrorInterpreter.interpret(error);
      throw new Error(interpretation.userMessage);
    }
    
    return data;
  }
  
  async signOut() {
    return supabaseFactory.signOut();
  }
}

// ============================================
// Example 2: Student Dashboard
// ============================================

export class StudentDashboard {
  private query: SafeQuery;
  
  constructor() {
    this.query = new SafeQuery(ClientType.AUTH);
  }
  
  async loadDashboard(userId: string) {
    // Check what tables we can access
    const accessCheck = await this.query.checkMultipleTableAccess([
      'student',
      'team',
      'team_member',
      'guardian'
    ]);
    
    console.log('Access check:', accessCheck);
    
    // Load student profile
    const studentResult = await this.query.queryWithRLSCheck('student',
      (client) => client
        .from('student')
        .select(`
          *,
          guardian:guardian_id(*),
          school:school_id(*)
        `)
        .eq('user_id', userId)
        .single()
    );
    
    if (studentResult.rlsBlocked) {
      throw new Error('Not authorized to view this student profile');
    }
    
    // Load team memberships
    const teamsResult = await this.query.queryWithRLSCheck('team_member',
      (client) => client
        .from('team_member')
        .select(`
          *,
          team:team_id(*)
        `)
        .eq('student_id', userId)
    );
    
    return {
      student: studentResult.data,
      teams: teamsResult.data || [],
      accessStatus: accessCheck
    };
  }
}

// ============================================
// Example 3: Public Health Check
// ============================================

export class HealthCheck {
  private query: SafeQuery;
  
  constructor() {
    // Health checks use anonymous client
    this.query = new SafeQuery(ClientType.ANON);
  }
  
  async checkSystemHealth() {
    const results = {
      timestamp: new Date().toISOString(),
      database: {
        connected: false,
        rlsActive: false,
        tablesExist: false
      },
      security: {
        rlsBlocking: false,
        publicTablesAccessible: false
      }
    };
    
    // Try to query a protected table
    const protectedCheck = await this.query.queryWithRLSCheck('student',
      (client) => client.from('student').select('count').limit(0)
    );
    
    if (protectedCheck.rlsBlocked) {
      results.database.connected = true;
      results.database.rlsActive = true;
      results.security.rlsBlocking = true;
      console.log('✅ RLS is protecting data correctly');
    }
    
    // Try to query a potentially public table
    const publicCheck = await this.query.queryWithRLSCheck('school',
      (client) => client.from('school').select('*').limit(1)
    );
    
    if (!publicCheck.rlsBlocked && publicCheck.data) {
      results.security.publicTablesAccessible = true;
    }
    
    return results;
  }
}

// ============================================
// Example 4: Admin Operations (Server-Only)
// ============================================

export class AdminService {
  async getAllUsers() {
    // This MUST run server-side only
    if (typeof window !== 'undefined') {
      throw new Error('Admin operations cannot run in browser');
    }
    
    const serviceClient = supabaseFactory.getClient(ClientType.SERVICE);
    
    // Service role bypasses RLS - use carefully!
    const { data, error } = await serviceClient
      .from('student')
      .select(`
        *,
        profile:user_id(
          email,
          created_at
        )
      `);
    
    if (error) {
      console.error('Admin query failed:', error);
      throw error;
    }
    
    return data;
  }
  
  async runMigration(sql: string) {
    if (typeof window !== 'undefined') {
      throw new Error('Migrations cannot run in browser');
    }
    
    const serviceClient = supabaseFactory.getClient(ClientType.SERVICE);
    
    // Execute raw SQL
    const { data, error } = await serviceClient.rpc('exec_sql', {
      query: sql
    });
    
    return { data, error };
  }
}

// ============================================
// Example 5: Team Creation with Proper Error Handling
// ============================================

export class TeamService {
  private query: SafeQuery;
  
  constructor() {
    this.query = new SafeQuery(ClientType.AUTH);
  }
  
  async createTeam(name: string, founderId: string) {
    const result = await this.query.queryWithRLSCheck('team',
      (client) => client
        .from('team')
        .insert({
          name,
          founder_id: founderId,
          created_at: new Date().toISOString()
        })
        .select()
        .single()
    );
    
    // Handle different scenarios
    if (result.rlsBlocked) {
      throw new Error('You do not have permission to create teams');
    }
    
    if (result.error) {
      const interpretation = PGRSTErrorInterpreter.interpret(result.error);
      
      if (result.error.code === '23505') {
        throw new Error('A team with this name already exists');
      }
      
      throw new Error(interpretation.userMessage);
    }
    
    // Team created successfully
    // The trigger will auto-create chat room
    console.log('Team created:', result.data);
    
    // Verify chat room was created
    const chatCheck = await this.query.queryWithRLSCheck('chat.room',
      (client) => client
        .from('room')
        .select('*')
        .eq('team_id', result.data.id)
        .single()
    );
    
    if (!chatCheck.rlsBlocked && chatCheck.data) {
      console.log('Chat room auto-created:', chatCheck.data);
    }
    
    return result.data;
  }
}

// ============================================
// Example 6: Proper RLS Testing Pattern
// ============================================

export async function testRLSPolicies() {
  console.log('Testing RLS Policies...');
  
  // Test as anonymous user
  const anonQuery = new SafeQuery(ClientType.ANON);
  const anonResult = await anonQuery.testAccess('student');
  console.log('Anonymous access to student:', anonResult);
  // Expected: { hasAccess: false, isBlocked: true }
  
  // Test as authenticated user (would need actual auth)
  const authQuery = new SafeQuery(ClientType.AUTH);
  const authResult = await authQuery.testAccess('student');
  console.log('Authenticated access to student:', authResult);
  // Expected: { hasAccess: true/false depending on user }
  
  // Batch test multiple tables
  const tables = ['student', 'guardian', 'team', 'profile'];
  const accessMap = await authQuery.checkMultipleTableAccess(tables);
  
  console.log('Access map:', accessMap);
  // Shows which tables are accessible vs RLS-protected
}

// ============================================
// Export for use in other files
// ============================================

export const services = {
  auth: new AuthService(),
  student: new StudentDashboard(),
  health: new HealthCheck(),
  team: new TeamService()
  // admin: new AdminService() // Only instantiate server-side
};

// Type exports for TypeScript projects
export type { QueryResult } from './safe-query';
export { ClientType } from './client-factory';