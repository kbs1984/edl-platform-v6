---
session: "00109"
type: "implementation-plan"
status: "ready"
created: "2025-08-29"
title: "Guardian System Implementation Plan - P0 K-12 Compliance"
purpose: "Provide detailed plan for implementing the guardian/supervisor system from truth-seed"
topics: ["guardian", "supervisor", "parental-control", "k-12", "implementation"]
priority: "P0"
domain: "reconciliation"
implements: ["US-006", "US-007"]
related_to: ["00109-TEAM-SYSTEM-IMPLEMENTATION-PLAN.md", "00109-FRIEND-SYSTEM-IMPLEMENTATION-PLAN.md"]
---

# Guardian System Implementation Plan

## Executive Summary
The Guardian System is **legally and ethically required** for a K-12 platform. It provides parental oversight, consent management, and safety controls. Unlike Teams/Friends which enhance engagement, Guardians enable platform operation.

## Current State Analysis

### What Truth-Seed Provides

#### Backend Logic (`guardian-actions.ts` - 1.1KB)
```typescript
// Limited implementation in truth-seed:
export const guardianAction = async (formData: GuardianData) => {
  // Basic guardian profile creation
  // Email invitation system
  // Link to student
}
```

#### Frontend Components
```
truth-seed/emdash-dashboard-main/src/components/onboarding/
└── guardian-form.tsx    // Basic guardian info collection

// Notable: Very minimal UI compared to teams/friends
```

#### Database Schema
```sql
-- Guardian table
guardian (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users,
  email text UNIQUE,
  name text,
  phone text,
  relationship text,  -- parent, teacher, etc.
  verified boolean DEFAULT false,
  created_at timestamp,
  updated_at timestamp
)

-- Student table has guardian_id reference
student (
  ...
  guardian_id uuid REFERENCES guardian(id),
  relationship_with_guardian text
)
```

### What's Missing (Critical Gaps)

1. **Separate Auth Flow**: Guardians need different registration
2. **Consent System**: No consent tracking/management
3. **Dashboard View**: No guardian-specific interface
4. **Monitoring Tools**: Can't view student activity
5. **Multi-Student**: Can't link multiple students (requirement: up to 6)
6. **Verification**: No email/identity verification
7. **Permissions**: No granular control system
8. **Notifications**: No alerts for concerning activity

## Implementation Strategy

### Phase 1: Foundation & Compliance (Session 110 - CRITICAL)

#### Step 1.1: Guardian Registration Flow
```typescript
// Separate registration path at /auth/guardian-signup
export const guardianSignupAction = async (formData: {
  email: string;
  password: string;
  name: string;
  phone?: string;
  relationship: 'parent' | 'teacher' | 'school_admin';
}) => {
  const supabase = await createServerClient();
  
  // 1. Create auth user with metadata
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        role: 'guardian',
        name: formData.name
      }
    }
  });
  
  // 2. Create guardian profile
  const { error: guardianError } = await supabase
    .from('guardian')
    .insert({
      user_id: authData.user.id,
      email: formData.email,
      name: formData.name,
      phone: formData.phone,
      relationship: formData.relationship
    });
    
  // 3. Send verification email with special guardian template
  // 4. Redirect to guardian onboarding
}
```

#### Step 1.2: Student Linking System
```sql
-- Create junction table for multiple students per guardian
CREATE TABLE guardian_student (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  guardian_id uuid REFERENCES guardian(id),
  student_id uuid REFERENCES student(id),
  relationship text, -- 'parent', 'teacher', etc.
  consent_given boolean DEFAULT false,
  consent_date timestamp,
  permissions jsonb, -- Granular controls
  created_at timestamp DEFAULT now(),
  UNIQUE(guardian_id, student_id)
);

-- Update student table to support multiple guardians
ALTER TABLE student 
ADD COLUMN primary_guardian_id uuid REFERENCES guardian(id);
```

#### Step 1.3: Consent Management
```typescript
// Critical for COPPA/GDPR compliance
export const grantConsentAction = async (
  studentId: string,
  consentType: 'data_collection' | 'third_party_sharing' | 'marketing',
  granted: boolean
) => {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Verify guardian relationship
  const { data: relationship } = await supabase
    .from('guardian_student')
    .select('*')
    .eq('guardian_id', user.id)
    .eq('student_id', studentId)
    .single();
    
  if (!relationship) {
    return { error: 'Not authorized for this student' };
  }
  
  // Record consent with timestamp
  const { error } = await supabase
    .from('consent_log')
    .insert({
      guardian_id: user.id,
      student_id: studentId,
      consent_type: consentType,
      granted: granted,
      ip_address: request.ip, // For legal records
      timestamp: new Date().toISOString()
    });
}
```

### Phase 2: Guardian Dashboard (Session 111)

#### Step 2.1: Guardian-Specific UI
```
/dashboard/guardian/
├── overview/           // Multi-student overview
├── student/[id]/       // Individual student view
├── activity/           // Activity logs
├── settings/           // Permissions & preferences
└── consent/            // Manage consents
```

#### Step 2.2: Activity Monitoring
```typescript
// Guardian can view student activities
export const getStudentActivityAction = async (studentId: string) => {
  const supabase = await createServerClient();
  
  // Verify guardian relationship first
  const authorized = await verifyGuardianship(user.id, studentId);
  if (!authorized) return { error: 'Unauthorized' };
  
  // Fetch activity data
  const activities = await supabase
    .from('activity_log')
    .select(`
      *,
      debate_participation,
      team_membership,
      challenge_attempts,
      chat_messages_count
    `)
    .eq('student_id', studentId)
    .order('created_at', { ascending: false });
    
  return activities;
}
```

#### Step 2.3: Multi-Student Management
```typescript
// Guardian dashboard shows all linked students
export const getLinkedStudentsAction = async () => {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: students } = await supabase
    .from('guardian_student')
    .select(`
      student_id,
      relationship,
      permissions,
      student (
        id,
        user_id,
        profile (
          name,
          username,
          image_path
        ),
        school (name),
        grade_level,
        exp,
        challenge_enabled
      )
    `)
    .eq('guardian_id', user.id);
    
  return students;
}
```

### Phase 3: Advanced Controls (Session 112)

#### Step 3.1: Permission System
```typescript
// Granular controls per student
interface GuardianPermissions {
  // Content Controls
  canJoinTeams: boolean;
  canAddFriends: boolean;
  canUseChat: boolean;
  canJoinDebates: boolean;
  
  // Time Controls
  allowedHours: {
    start: string; // "09:00"
    end: string;   // "21:00"
  };
  weekendLimits?: number; // minutes per day
  
  // Privacy Controls
  shareProgress: boolean;
  allowDataCollection: boolean;
  
  // Notification Preferences
  alertOnNewFriend: boolean;
  alertOnTeamJoin: boolean;
  dailyReport: boolean;
}
```

#### Step 3.2: Emergency Controls
```typescript
// Guardian can immediately disable student access
export const emergencyDisableAction = async (studentId: string) => {
  // Suspend student account
  // Notify admin
  // Log incident
  // Send confirmation to guardian
}
```

#### Step 3.3: Communication Channel
```typescript
// Guardian-Student messaging
export const sendGuardianMessageAction = async (
  studentId: string, 
  message: string
) => {
  // In-app message system
  // Not regular chat - special channel
  // Archived for compliance
}
```

## RLS Security Model

```sql
-- Guardian can only see their linked students
CREATE POLICY "Guardians view linked students"
ON student FOR SELECT
TO authenticated
USING (
  id IN (
    SELECT student_id 
    FROM guardian_student 
    WHERE guardian_id = auth.uid()
  )
);

-- Guardians can view student activities
CREATE POLICY "Guardians monitor activities"
ON activity_log FOR SELECT
TO authenticated
USING (
  student_id IN (
    SELECT student_id 
    FROM guardian_student 
    WHERE guardian_id = auth.uid()
  )
);

-- Students can see their guardians
CREATE POLICY "Students view their guardians"
ON guardian FOR SELECT
TO authenticated
USING (
  id IN (
    SELECT guardian_id 
    FROM guardian_student 
    WHERE student_id = auth.uid()
  )
);
```

## Legal & Compliance Requirements

### COPPA (Children's Online Privacy Protection Act)
- **Under 13**: Requires verifiable parental consent
- **Data Collection**: Must disclose what's collected
- **Right to Delete**: Parents can request data deletion
- **No Behavioral Advertising**: Cannot target ads to children

### FERPA (Educational Records)
- **Educational Records**: Grades, progress must be protected
- **Parental Access**: Parents have right to view records
- **Consent for Sharing**: Required for third-party access

### GDPR (If applicable)
- **Explicit Consent**: Clear opt-in required
- **Data Portability**: Export student data
- **Right to be Forgotten**: Complete deletion capability

## Implementation Priority

### Why Guardian System is P0+
1. **Legal Requirement**: Cannot operate without it
2. **Trust Factor**: Parents need confidence
3. **School Adoption**: Schools require parental controls
4. **Risk Mitigation**: Protects platform from liability

### Recommended Sequencing
```
Week 1: Guardian registration + basic linking
Week 2: Consent system + compliance features  
Week 3: Guardian dashboard + monitoring
Week 4: Advanced controls + permissions
```

## Success Metrics

### Compliance Requirements
- [ ] Verifiable parental consent system
- [ ] Age-appropriate registration flow
- [ ] Consent logging with timestamps
- [ ] Data access controls
- [ ] Account suspension capability

### Functional Requirements
- [ ] Guardian registration separate from student
- [ ] Link up to 6 students per guardian
- [ ] View student activity/progress
- [ ] Manage permissions per student
- [ ] Emergency disable capability

### User Experience
- [ ] Clear onboarding for guardians
- [ ] Easy student linking process
- [ ] Intuitive dashboard
- [ ] Mobile-responsive (parents use phones)
- [ ] Email notifications working

## Testing Requirements

### Compliance Testing
- [ ] Under-13 cannot register without guardian
- [ ] Consent properly recorded
- [ ] Data access restricted appropriately
- [ ] Audit trail complete

### Functional Testing
- [ ] Guardian can link student via email
- [ ] Guardian can view but not modify student work
- [ ] Permissions affect student capabilities
- [ ] Multiple guardians per student work

### Security Testing
- [ ] Guardian cannot access other students
- [ ] Students cannot modify guardian settings
- [ ] Consent cannot be forged
- [ ] Session isolation between accounts

## Risk Analysis

### High-Risk Areas
1. **Consent Forgery**: Students pretending to be guardians
2. **Data Leakage**: Guardian seeing wrong student data
3. **Missing Consent**: Operating without proper authorization
4. **Account Confusion**: Guardian/student role mixing

### Mitigation Strategies
1. **Email Verification**: Separate domain validation
2. **Age Verification**: Birthday + school grade matching
3. **Audit Everything**: Log all guardian actions
4. **Clear Separation**: Different auth flows, different UIs

## Time Estimate

- **Phase 1**: 4-5 hours (Foundation & Compliance)
- **Phase 2**: 5-6 hours (Dashboard & Monitoring)
- **Phase 3**: 3-4 hours (Advanced Controls)
- **Total**: 12-15 hours (higher than teams/friends due to compliance)

## Critical Implementation Notes

1. **Cannot Skip**: This is not optional for K-12
2. **Test with Lawyers**: Have legal review the consent flow
3. **Document Everything**: Compliance requires proof
4. **No Shortcuts**: Don't compromise on security
5. **Parents First**: Their trust enables everything else

---

**CRITICAL**: Unlike Teams/Friends which enhance the platform, the Guardian System is a **legal requirement** for operating a K-12 educational platform. It should be implemented in parallel or even before other social features.