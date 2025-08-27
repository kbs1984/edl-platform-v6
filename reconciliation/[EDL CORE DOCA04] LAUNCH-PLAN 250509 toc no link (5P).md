---
created: '2025-08-23'
domain: reconciliation
priority: P1
purpose: Document a05_launch-plan
session: '25050'
status: current
title: A05_LAUNCH-PLAN
topics:
- auth
- database
- documentation
type: guide
implements:
- requirement-to-be-specified
modified: '2025-08-27'
---

EDL APPENDICES/

# A05_LAUNCH-PLAN

## 0. A05 Table of Contents

1. Objectives
2. MVP Schedule
3. Next Steps Recommendation
4. Implementation Approach
- 4.1 Component-First Supabase Implementation
- 4.2 Connecting Supabase Auth to Noodl
5. Database Schema Versioning
- 5.1 Supabase Schema Management
- 5.2 Database Schema Versioning Strategy
6. Technical Implementation Requirements
- 6.1 Database Structure
- 6.2 Row-Level Security Implementation
- 6.3 Key Implementation Strategies
7. Implementation Resources
- 7.1 Database Schema Creation Scripts
- 7.2 Noodl Component Templates
- 7.3 n8n Workflow Templates

## 1. Objectives

**IMPORTANT**
Flow: Activities → Registrations → Ballots → Scorecards → Feedback
Status Tracking: PENDING → COMPLETE → RENDERED 
Role Assignments: A1FE, A2BE, A3QB, B1FE, B2BE, and B3QB
Default Values: Setting scores to 1.5 (user-friendly for enablers)
Flowtype: Synchronous and asynchronous debating options to remove time-zone and scheduling limitations
Debating Formats: EMD DEBATE, WSDC, LINCOLN-DOUGLAS, MODEL UN, & HAVRUTA

1. Sign up with verification and log in
   1.1 Sign up via email and password
   1.2 Sign up via Google, Kakao
   1.3 Sign up via email and SMS (for guardians)
   1.4 Log in and reach dashboard
   1.5 Landing and About Us pages

2. Team creation, teammate onboarding, and availability/preferences 
   2.1 View Team Membership
   2.2 Create a New Team
   2.3 View Team Details
   2.4 Edit Team Details
   2.5 Manage Team Invitations
   2.6 Track Declined Invitations
   2.7 Browse Team Directory: see profiles and availability of potential other teams
   2.8 Handle Division Mismatches
   2.9 Set Team Availability: days & time slots
   2.10 Specify Motion Preferences: from the motion catalog
   2.11 View Rules and Roles
   2.12 Browse Ballot Examples
   2.13 Search for Match Pairings
   2.14 Access Postbox Communication
   2.15 Request Matches
   2.16 Review Team Availability (Guardians/Enablers)
   2.17 Oversee Match Arrangements (Guardians/Enablers)
   2.18 Access Communication History (Guardians/Enablers)
   2.19 Configure Debate Flow Type (synchronous/asynchronous)
   2.20 Select Debate Format (EMD, WSDC, LD, PF, etc.)

3. Activities (Debate Chamber) and registrations
   3.1 Browse Available Activities: add "flow type" filter to distinguish synchronous vs. asynchronous debates
   3.2 Register for Activities: synch (mutual availability) and asynch (agreed response timeframe)
   3.3 View My Registrations: "flow type indicators" and progress tracking for asynch
   3.4 Cancel Registration: "flow type" specific cancellation policies
   3.5 Create Activities: for other teams to join
   3.6 Create Activities (Admin): [1] debating format-specific configuration options, [2] flow type with parameters, [3] format template system for quick config)
   3.7 Manage Activity Details (Admin)
   3.8 View Registrations (Admin)
   3.9 Assign Roles (Admin)
   3.10 Configure Format-Specific Parameters
   3.11 Implement Asynchronous Turn Management
   3.12 Develop Turn Notification System
   3.13 Create Debate Progress Tracker
   3.14 Implement Cross-Examination Features

4. Judging ballots and feedback
   4.1 Generate Ballots: automatically create six scorecards (A1FE, A2BE, A3QB, B1FE, B2BE, B3QB), debating format-specific ballot templates, evaluation criteria on selected format, scorecard structure to match format requirements, progressive ballot structure for asynchronous debates, implement ballot state tracking for multi-stage completion
   4.2 Fill Out Scorecards: assign scores across 14 criteria (R01-R06, A07-A10, S11-S14), start with 1.5 pts as default, partial scorecard completion for async debates, scorecard versioning for updates as speeches are added
   4.3 Provide Feedback: assigns timestamp, feedback and ballot category, progressive feedback capability for asynch debates, cumulative feedback view that combines all stages
   4.4 Submit Complete Ballot
   4.5 Review Previous Ballots
   4.6 View Received Ballots (Students/Players): includes associated Scorecards and Feedbacks 
   4.7 Track Performance Over Time
   4.8 Monitor Ballot Completion (Admin)
   4.9 Generate Analytics (Admin)
   4.10 Implement Format-Specific Ballot Templates
   4.11 Create Format-Specific Chamber Interfaces
   4.12 Develop Format Analytics

5. Connecting to Toss Payments API
   5.1 Collect Toss Payments API keys
   5.2 Create Payment UI in Noodl
   5.3 Implement SDK in Noodl
   5.4 Create the Payment Flow with a JavaScript Function Node
   5.5 Create Success and Failure Pages in Noodl
   5.6 Set Up n8n Workflow for Payment Confirmation 
   5.7 Create the Server-Side Confirmation Endpoint
   5.8 Connect to Your Supabase Database
   5.9 Handle Webhooks for Asynchronous Updates
   5.10 Implement Testing Mode Toggle
   5.11 Add Security Measures
   5.12 Create User Payment Dashboard

## 2. MVP Schedule
[Weeks 1-2] 1.1 Sign up via email and password
[Weeks 1-2] 1.2 Sign up via Google, Kakao	
[Weeks 1-2] 1.3 Sign up via email and SMS (for guardians)
[Weeks 1-2] 1.4 Log in and reach dashboard
[Weeks 1-2] 1.5 Landing and About Us pages
[Weeks 1-2] 2.1 View Team Membership
[Weeks 1-2] 2.2 Create a New Team
[Weeks 1-2] 2.3 View Team Details
[Weeks 1-2] 2.4 Edit Team Details

[Weeks 3-4] 3.1 Browse Available Activities
[Weeks 3-4] 3.2 Register for Activities	
[Weeks 3-4] 3.3 View My Registrations	
[Weeks 3-4] 3.4 Cancel Registration	
[Weeks 3-4] 3.6 Create Activities (admin)
[Weeks 3-4] 3.10 Configure Format-Specific Parameters
[Weeks 3-4] 4.1 Generate Ballots	
[Weeks 3-4] 4.2 Fill Out Scorecards	
[Weeks 3-4] 4.3 Provide Feedback
[Weeks 3-4] 4.10 Implement Format-Specific Ballot Templates	

[Weeks 5-6] 5.1 Collect Toss Payments API keys
[Weeks 5-6] 5.2 Create Payment UI in Noodl
[Weeks 5-6] 5.3 Implement SDK in Noodl	
[Weeks 5-6] 5.4 Create the Payment Flow with JavaScript Function Node
[Weeks 5-6] 5.5 Create Success and Failure Pages in Noodl
[Weeks 5-6] 3.11 Implement Asynchronous Turn Management	
[Weeks 5-6] 3.12 Develop Turn Notification System
[Weeks 5-6] 3.13 Create Debate Progress Tracker
[Weeks 5-6] 4.11 Create Format-Specific Chamber Interfaces
[Weeks 5-6] - Conduct testing with a small group of users	
[Weeks 5-6] - Create essential documentation and onboarding materials	
[Weeks 5-6] - Launch MVP with limited features but solid core functionality

## 3. Next Steps Recommendation

Based on your feedback, here's what I recommend we focus on first:

1. **Confirm Supabase Schema Structure**: Run the SQL queries provided to snapshot the current database state
2. **Test Supabase Auth Integration**: Create a simple login component in Noodl to verify Supabase auth works
3. **Build Ballot Tables in Supabase**: Implement the `debate.ballots`, `debate.scorecards`, and related tables
4. **Create POC for Flow Types**: Implement a minimal version of the synchronous vs asynchronous flow leveraging Supabase real-time features
5. **Set up GitHub Branching Strategy**: Establish proper versioning for Supabase schema changes
6. **Implement Row-Level Security (RLS)**: Define proper security policies for all tables

## 4. Implementation Approach

### 4.1 Component-First Supabase Implementation

Our implementation approach is centered on Supabase as the foundational database technology for EDL. All database interactions will be designed specifically for Supabase's capabilities:

1. **Supabase-First Development**: Build reusable Noodl components that leverage Supabase's native features:
   - Real-time subscriptions for live debate updates
   - Row-Level Security (RLS) for access control
   - Supabase Storage for video management
   - PostgreSQL schema design best practices

2. **Full Schema Utilization**: Implement the multi-schema architecture with:
   - `public` schema for user management and general platform functionality
   - `debate` schema for debate-specific entities and relationships

3. **Backend-Frontend Integration**: Develop using proper Supabase client patterns:
   - Implement proper schema prefixing in queries (e.g., `debate.debates`)
   - Use nested selects for cross-schema relationships
   - Leverage JWT authentication with Supabase Auth

4. **n8n Integration Planning**: Define clear workflows that use Supabase service roles:
   - Implement server-side operations with appropriate permissions
   - Use Supabase's PostgreSQL-specific features in workflow operations
   - Connect to Supabase webhooks for event-driven architecture

5. **Iterative Testing**: Test each component with real users as it's built:
   - Verify Supabase real-time features work as expected
   - Confirm RLS policies provide proper access control
   - Test cross-schema queries for performance

### 4.2 Connecting Supabase Auth to Noodl

To test the Supabase authentication integration with Noodl:

1. Create a simple login page using the Supabase client:

```javascript
// In a Noodl JavaScript Function Node
const supabase = Noodl.Variables.supabase;

async function signIn(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });
    
    if (error) throw error;
    
    // Store user data
    Noodl.Variables.Set('currentUser', {
      auth: data.user,
      session: data.session
    });
    
    // Fetch user profile data
    const { data: profile, error: profileError } = await supabase
      .from('profile')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    if (profileError && profileError.code !== 'PGRST116') throw profileError;
    
    if (profile) {
      Noodl.Variables.Set('currentUser', {
        auth: data.user,
        session: data.session,
        profile: profile
      });
    }
    
    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

// Execute function with inputs
try {
  const data = await signIn(Inputs.email, Inputs.password);
  Outputs.user = data.user;
  Outputs.Success();
} catch (error) {
  Outputs.error = error.message;
  Outputs.Failure();
}
```

2. Add logging in the onAuthStateChange handler to confirm tokens:

```javascript
// In a Noodl JavaScript Function Node
const supabase = Noodl.Variables.supabase;

// Set up auth state listener
const setupAuthListener = () => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    console.log("Auth state changed:", event);
    
    if (session) {
      console.log("User authenticated:", session.user.id);
      Noodl.Variables.Set('authStatus', 'authenticated');
      Noodl.Variables.Set('currentUser', {
        auth: session.user,
        session: session
      });
      
      // Fetch user profile
      fetchUserProfile(session.user.id);
    } else {
      console.log("User signed out");
      Noodl.Variables.Set('authStatus', 'unauthenticated');
      Noodl.Variables.Set('currentUser', null);
    }
  });
  
  // Return cleanup function
  return () => {
    subscription.unsubscribe();
  };
};

// Fetch user profile from Supabase
async function fetchUserProfile(userId) {
  try {
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error("Profile fetch error:", error);
      return;
    }
    
    if (data) {
      const currentUser = Noodl.Variables.Get('currentUser') || {};
      Noodl.Variables.Set('currentUser', {
        ...currentUser,
        profile: data
      });
    }
  } catch (error) {
    console.error("Profile fetch error:", error);
  }
}

// Set up the auth listener
const cleanup = setupAuthListener();

// Check current auth state
checkCurrentSession();

// Function to check current session
async function checkCurrentSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Session check error:", error);
      return;
    }
    
    if (data.session) {
      console.log("User already authenticated:", data.session.user.id);
      Noodl.Variables.Set('authStatus', 'authenticated');
      Noodl.Variables.Set('currentUser', {
        auth: data.session.user,
        session: data.session
      });
      
      // Fetch user profile
      fetchUserProfile(data.session.user.id);
    } else {
      console.log("No active session");
      Noodl.Variables.Set('authStatus', 'unauthenticated');
    }
  } catch (error) {
    console.error("Session check error:", error);
  }
}

// Expose cleanup function
Outputs.cleanup = cleanup;
```

3. Test redirection to dashboard after successful authentication:

```javascript
// In a Noodl JavaScript Function Node
const authStatus = Noodl.Variables.Get('authStatus');
const currentUser = Noodl.Variables.Get('currentUser');

// Check auth status for redirection
if (authStatus === 'authenticated' && currentUser) {
  // Determine which dashboard to show based on user role
  if (currentUser.profile) {
    const userRoles = [];
    
    // Check if user has student role
    const { data: student } = await supabase
      .from('student')
      .select('id')
      .eq('user_id', currentUser.auth.id)
      .maybeSingle();
    
    if (student) userRoles.push('student');
    
    // Check if user has guardian role
    const { data: guardian } = await supabase
      .from('guardian')
      .select('id')
      .eq('user_id', currentUser.auth.id)
      .maybeSingle();
    
    if (guardian) userRoles.push('guardian');
    
    // Check if user has judge role
    const { data: judge } = await supabase
      .from('judge')
      .select('id')
      .eq('user_id', currentUser.auth.id)
      .maybeSingle();
    
    if (judge) userRoles.push('judge');
    
    // Set user roles and redirect to appropriate dashboard
    Noodl.Variables.Set('userRoles', userRoles);
    
    if (userRoles.includes('student')) {
      Outputs.redirectToStudentDashboard();
    } else if (userRoles.includes('guardian')) {
      Outputs.redirectToGuardianDashboard();
    } else if (userRoles.includes('judge')) {
      Outputs.redirectToJudgeDashboard();
    } else {
      Outputs.redirectToOnboarding();
    }
  } else {
    // Profile not yet set up
    Outputs.redirectToProfileSetup();
  }
} else {
  // Not authenticated, stay on login page
  Outputs.stayOnLogin();
}
```

## 5. Database Schema Versioning

### 5.1 Supabase Schema Management

To ensure proper tracking and versioning of the Supabase schema, we'll implement a systematic approach to schema documentation and management:

#### Periodical Schema Snapshot

Run the following SQL query in the Supabase SQL Editor to capture the current schema state:

```sql
SELECT 
  t.table_schema,
  t.table_name,
  c.column_name, 
  c.data_type,
  c.is_nullable,
  c.column_default
FROM 
  information_schema.tables t
JOIN 
  information_schema.columns c ON t.table_name = c.table_name AND t.table_schema = c.table_schema
WHERE 
  t.table_schema IN ('public', 'debate')
ORDER BY 
  t.table_schema,
  t.table_name, 
  c.ordinal_position;
```

#### Foreign Key Relationship Tracking

Capture relationship definitions with:

```sql
SELECT
    tc.table_schema, 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
JOIN 
    information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN 
    information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE 
    tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema IN ('public', 'debate');
```

#### Row-Level Security Policy Tracking

Document all RLS policies with:

```sql
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual, 
    with_check
FROM 
    pg_policies
WHERE 
    schemaname IN ('public', 'debate')
ORDER BY 
    schemaname, 
    tablename;
```

#### Schema Change Management Process

1. **Before Changes**: Run and save schema snapshots
2. **Change Implementation**: 
   - Create SQL migration scripts for schema modifications
   - Implement scripts in a development environment first
   - Test impact on existing data and functionality
3. **Post-Change Validation**:
   - Run schema snapshots again to document new state
   - Verify foreign key relationships remain intact
   - Confirm RLS policies are properly updated

### 5.2 Database Schema Versioning Strategy

Each version will be documented with:

1. **Version Number**: Following semver pattern (MAJOR.MINOR.PATCH)
2. **Schema Snapshot**: Full SQL representation of tables and columns
3. **Relationship Diagram**: Visual representation of table relationships
4. **RLS Policy Documentation**: Security policies for each table
5. **Enum Values**: Documentation of all enum types and values

For migrations between versions:

1. Create SQL migration scripts for each version change
2. Include both "up" (apply changes) and "down" (revert changes) scripts
3. Test migrations on development environment before production
4. Document any data transformation required during migration

## 6. Technical Implementation Requirements

### 6.1 Database Structure

#### 1. Core Schema Organization

The EDL platform uses Supabase's multi-schema capabilities with:

- **public schema**: User management, authentication, team structure
  - `profile`: Core user information linked to Supabase Auth
  - `student`/`guardian`/`judge`: Role-specific data
  - `team`/`team_member`: Team management structures

- **debate schema**: Debate-specific functionality
  - `debate_formats`/`format_rounds`/`round_templates`: Format system
  - `debates`/`debate_teams`/`debate_participants`: Debate execution
  - `speeches`/`videos`: Content capture
  - `ballots`/`scorecards`/`criteria`: Evaluation system

#### 2. Auth Schema Integration

The authentication system uses Supabase Auth with custom profile integration:

```sql
-- After user creation in Supabase Auth, create profile record
CREATE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profile (id, email, name, created_at, updated_at)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name', now(), now());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

#### 3. Key Table Structures

**Debate System Tables**:

```sql
-- Debate format system
CREATE TABLE debate.debate_formats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Round templates
CREATE TABLE debate.round_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  default_time INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Format-specific rounds
CREATE TABLE debate.format_rounds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  debate_format_id UUID NOT NULL REFERENCES debate.debate_formats(id),
  round_template_id UUID NOT NULL REFERENCES debate.round_templates(id),
  sequence INTEGER NOT NULL,
  side_id UUID NOT NULL REFERENCES debate.sides(id),
  speaker_positions INTEGER[] NOT NULL,
  number_of_speakers SMALLINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(debate_format_id, sequence)
);

-- Debate custom type for flow mode
CREATE TYPE debate_mode_enum AS ENUM ('SYNC', 'ASYNC');

-- Debate instance table
CREATE TABLE debate.debates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  debate_format_id UUID NOT NULL REFERENCES debate.debate_formats(id),
  motion_id UUID NOT NULL REFERENCES debate.motions(id),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  mode debate_mode_enum NOT NULL DEFAULT 'SYNC',
  current_turn_participant_id UUID,
  turn_deadline TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'PENDING'
);
```

**Ballot System Tables**:

```sql
-- Master ballot record
CREATE TABLE debate.ballots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  debate_id UUID NOT NULL REFERENCES debate.debates(id),
  judge_id UUID NOT NULL REFERENCES public.judge(id),
  status TEXT NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  submitted_at TIMESTAMP WITH TIME ZONE,
  format_id UUID NOT NULL REFERENCES debate.debate_formats(id),
  version INTEGER NOT NULL DEFAULT 1
);

-- Individual scorecards within a ballot
CREATE TABLE debate.scorecards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ballot_id UUID NOT NULL REFERENCES debate.ballots(id),
  participant_id UUID NOT NULL REFERENCES debate.debate_participants(id),
  role_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Individual criteria scores
CREATE TABLE debate.scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scorecard_id UUID NOT NULL REFERENCES debate.scorecards(id),
  criteria_id UUID NOT NULL REFERENCES debate.criteria(id),
  score DECIMAL NOT NULL DEFAULT 1.5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(scorecard_id, criteria_id)
);
```

### 6.2 Row-Level Security Implementation

Properly secure all tables with RLS policies:

```sql
-- Enable RLS on all tables
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team ENABLE ROW LEVEL SECURITY;
ALTER TABLE debate.debates ENABLE ROW LEVEL SECURITY;
ALTER TABLE debate.ballots ENABLE ROW LEVEL SECURITY;

-- Example policies for debate tables
CREATE POLICY "Users can view their own profile"
ON public.profile
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Team members can view teams"
ON public.team
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.team_member
    WHERE team_id = id AND student_id IN (
      SELECT id FROM public.student WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Participants can view debates"
ON debate.debates
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM debate.debate_participants dp
    JOIN debate.debate_teams dt ON dp.debate_team_id = dt.id
    WHERE dt.debate_id = id AND dp.user_id = auth.uid()
  )
);

CREATE POLICY "Judges can manage their own ballots"
ON debate.ballots
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.judge
    WHERE user_id = auth.uid() AND id = judge_id
  )
);
```

### 6.3 Key Implementation Strategies

#### 1. Flow Type Implementation (Synchronous vs. Asynchronous)

1. **Supabase Database Approach**
   - Leverage Supabase's PostgreSQL custom types with `debate_mode_enum` ('SYNC', 'ASYNC')
   - Implement Supabase real-time subscriptions for synchronous debate updates
   - Utilize Supabase's transaction capabilities for turn management in asynchronous debates

2. **UI/UX Strategy**
   - Clear visual distinction between flow types in activity listings
   - Progress indicators for asynchronous debates showing completion percentage
   - Real-time presence indicators for synchronous debates using Supabase Presence

3. **Technical Implementation**
   - Implement state machine for debate progression using Supabase client
   - Use Supabase's real-time channels for state synchronization
   - Implement proper schema prefixing in all queries

#### 2. Debate Format Implementation

1. **Format Template System**
   - Store format definitions in the `debate.debate_formats` and related tables
   - Implement a configuration-driven approach using Supabase for format retrieval
   - Use Supabase's nested query capabilities for efficient format data loading

2. **Common Infrastructure**
   - Build core components that work across formats:
     - Configurable speech timers
     - Flexible ballot generation
     - Adaptive chamber interfaces

3. **Format-Specific Extensions**
   - Custom ballot criteria and evaluation metrics
   - Format-appropriate UI components based on format specifications from Supabase
   - Format-specific analytics leveraging Supabase's PostgreSQL functions

#### 3. Integration Architecture

1. **Component Modularity**
   - Build format and flow type logic as pluggable Noodl modules
   - Use dependency injection to minimize coupling between components
   - Ensure all components properly handle schema prefixing when querying Supabase

2. **Data Flow Architecture**
   - Implement proper schema prefixing in all Supabase queries:
     ```javascript
     // Correct usage with schema prefix
     const { data, error } = await supabase
       .from('debate.debates')
       .select('*');
     ```
   - Use joins for cross-schema relationships:
     ```javascript
     // Cross-schema join example
     .select(`
       id,
       participant:participant_id (
         id,
         student:user_id (
           user_id,
           profile:user_id (
             name
           )
         )
       )
     `)
     ```
   - Leverage Supabase's real-time capabilities:
     ```javascript
     // Subscribe to changes in debate participants
     const subscription = supabase
       .channel('public:debate_participants')
       .on(
         'postgres_changes',
         {
           event: '*',
           schema: 'debate',
           table: 'debate_participants',
           filter: `debate_team_id=eq.${teamId}`
         },
         (payload) => {
           console.log('Change received:', payload);
           // Update UI accordingly
         }
       )
       .subscribe();
     ```

3. **Testing Strategy**
   - Create automated test cases for each format and flow type combination
   - Test RLS policies thoroughly to ensure proper access control
   - Verify real-time updates work correctly for synchronous debates

#### 4. Scaling Considerations

1. **Performance Optimization**
   - Use Supabase's query optimization features:
     - Proper indexing on frequently queried columns
     - Limit query responses to necessary fields
     - Use count() with head:true for pagination

2. **International Support**
   - Leverage Supabase's PostgreSQL capabilities for multilingual content
   - Implement proper time zone handling for global participants

3. **Analytics Implementation**
   - Use Supabase's PostgreSQL analytic functions for performance metrics
   - Create materialized views for complex analytic queries

## 7. Implementation Resources

### 7.1 Database Schema Creation Scripts

Complete SQL scripts for creating the database schema will include:

1. Schema definition (public and debate schemas)
2. Table creation scripts with proper relationships
3. Enum type definitions
4. RLS policy implementation
5. Trigger functions for Supabase Auth integration
6. Index creation for performance optimization

### 7.2 Noodl Component Templates

We'll develop reusable Noodl components that follow the Supabase-first approach:

1. **Authentication Components**: Login, signup, password reset using Supabase Auth
2. **Debate Chamber Components**: Video recording/playback with Supabase Storage integration
3. **Ballot System Components**: Scorecard UI with real-time updates via Supabase

### 7.3 n8n Workflow Templates

Key n8n workflows will be designed with Supabase's capabilities in mind:

1. **Ballot Generation Workflow**: Creates complete ballot structure in Supabase
2. **Turn Management Workflow**: Handles asynchronous debate turn progression
3. **Notification Workflow**: Sends notifications based on Supabase database changes

These implementations will ensure that the EDL platform leverages Supabase's full capabilities while providing a robust and scalable solution for online debate management.