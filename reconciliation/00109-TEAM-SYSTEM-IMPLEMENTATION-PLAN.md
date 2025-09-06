---
session: "00109"
type: "implementation-plan"
status: "ready"
created: "2025-08-29"
title: "Team System Implementation Plan - P0 Foundation Feature"
purpose: "Provide detailed plan for implementing the team management system from truth-seed"
topics: ["teams", "implementation", "p0-features", "collaboration"]
priority: "P0"
domain: "reconciliation"
implements: ["US-004", "US-005"]
---

# Team System Implementation Plan

## Executive Summary
The Team Management System is the most complete feature in truth-seed (16KB of logic) and fundamental for EDL's collaborative learning model. With auth flow working, teams are the logical next step.

## Current State Analysis

### What Truth-Seed Provides

#### Backend Logic (`team-actions.ts` - 16KB)
```typescript
// Available functions in truth-seed:
- createTeamAction()           // Create new team
- joinTeamAction()             // Join via code
- getTeamMembersAction()       // List members
- getTeamAction()              // Get team details
- updateTeamAction()           // Edit team info
- deleteTeamAction()           // Remove team
- leaveTeamAction()            // Member leaves
- promoteToLeaderAction()      // Change leadership
- kickMemberAction()           // Remove member
- generateInviteCodeAction()   // Create join code
- getTeamRequestsAction()      // Pending requests
- approveJoinRequestAction()   // Accept member
- rejectJoinRequestAction()    // Deny member
```

#### Frontend Components
```
truth-seed/emdash-dashboard-main/src/components/team/
├── edit-team-dialog.tsx       // Team settings modal
├── invite-member-dialog.tsx   // Invitation flow
├── team-header.tsx            // Team info display
├── team-list.tsx              // Browse teams
├── team-members-list.tsx      // Member roster
├── team-request-dialog.tsx    // Join requests
└── team-skeletons.tsx         // Loading states
```

#### Pages Structure
```
(user-pages)/groups/teams/
├── page.tsx           // Teams dashboard
├── new/page.tsx       // Create team
└── [team_id]/page.tsx // Team details
```

#### Database Schema
- `team` table with name, description, leader_id
- `team_member` junction table
- `team_join_requests` for pending members
- RLS policies need implementation

### What's Missing/Broken

1. **RLS Policies**: Tables exist but lack proper security
2. **Wire-up**: Components exist but aren't connected to actions
3. **Navigation**: Routes defined but not linked
4. **Validation**: No checks for team size limits
5. **Real-time**: No subscription for team updates

## Implementation Steps

### Phase 1: Foundation (Session 110)

#### Step 1.1: Verify Database Structure
```sql
-- Check existing tables and triggers
SELECT * FROM team LIMIT 1;
SELECT * FROM team_member LIMIT 1;
SELECT * FROM pg_trigger WHERE tgname LIKE '%team%';
```

#### Step 1.2: Implement RLS Policies
```sql
-- Team table policies
CREATE POLICY "Users can view teams they belong to"
ON team FOR SELECT
TO authenticated
USING (
  id IN (
    SELECT team_id FROM team_member 
    WHERE student_id = auth.uid()
  )
);

CREATE POLICY "Team leaders can update their teams"
ON team FOR UPDATE
TO authenticated
USING (leader_id = auth.uid());

-- Team member policies
CREATE POLICY "Team members can view roster"
ON team_member FOR SELECT
TO authenticated
USING (
  team_id IN (
    SELECT team_id FROM team_member
    WHERE student_id = auth.uid()
  )
);
```

#### Step 1.3: Copy Truth-Seed Components
```bash
# Copy team components to active-work
cp -r truth-seed/emdash-dashboard-main/src/components/team \
      reconciliation/active-work/dashboard/src/components/

# Copy team pages
cp -r truth-seed/emdash-dashboard-main/src/app/\(user-pages\)/groups \
      reconciliation/active-work/dashboard/src/app/\(user-pages\)/
```

#### Step 1.4: Wire Actions to Components
- Import team-actions in components
- Connect forms to server actions
- Add error handling
- Test with console.log first

### Phase 2: Core Features (Session 111)

#### Step 2.1: Team Creation Flow
1. Navigate to `/groups/teams/new`
2. Fill team details form
3. Call `createTeamAction()`
4. Redirect to team page
5. Creator becomes leader

#### Step 2.2: Join Team Flow
1. Enter team code
2. Call `joinTeamAction()`
3. Create join request
4. Leader approves/rejects
5. Update member roster

#### Step 2.3: Team Dashboard
- Display team info
- Show member list
- Leader actions (kick, promote)
- Generate invite codes
- Manage join requests

### Phase 3: Polish & Testing (Session 112)

#### Step 3.1: Validation Rules
- Max team size (from requirements)
- Unique team names
- Valid invite codes
- Role permissions

#### Step 3.2: Real-time Updates
```typescript
// Subscribe to team changes
const teamSubscription = supabase
  .channel('team-changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'team_member',
    filter: `team_id=eq.${teamId}`
  }, handleTeamUpdate)
  .subscribe();
```

#### Step 3.3: Integration Testing
- Create team as user A
- Join team as user B
- Promote user B to leader
- User B kicks user A
- Verify all state updates

## Success Metrics

### Functional Requirements
- [ ] Users can create teams
- [ ] Users can join teams via code
- [ ] Leaders can manage members
- [ ] Team rosters update in real-time
- [ ] RLS prevents unauthorized access

### Technical Requirements
- [ ] All truth-seed components integrated
- [ ] Server actions properly wired
- [ ] RLS policies tested
- [ ] No console errors
- [ ] Smooth navigation flow

## Risk Mitigation

### Potential Issues
1. **RLS Complexity**: Start permissive, tighten gradually
2. **Real-time Sync**: Implement after basic CRUD works
3. **Team Limits**: Add validation in Phase 3
4. **Migration**: Test with fresh users first

### Rollback Plan
- Keep Session 109's working auth flow isolated
- Test teams in separate branch initially
- Document all database changes for reversal

## Time Estimate

- **Phase 1**: 2-3 hours (foundation setup)
- **Phase 2**: 3-4 hours (core features)
- **Phase 3**: 2-3 hours (polish & testing)
- **Total**: 7-10 hours across 3 sessions

## Dependencies

### Required Before Starting
- ✅ Auth flow working (Sessions 107-109)
- ✅ Student records created
- ✅ Database access via MCP
- ✅ Truth-seed reference available

### Will Enable After Completion
- Guild system (larger groups)
- Team chat rooms
- Debate team formation
- Challenge competitions

## Notes for Future Sessions

1. **Start with READ operations** - Get team display working before create/join
2. **Use truth-seed patterns** - Don't reinvent what's already solved
3. **Test with multiple users** - Teams require 2+ people
4. **Document RLS policies** - They're complex and easy to break
5. **Keep it simple** - Get basic team CRUD before real-time features

---

**Ready for Implementation**: This plan provides everything needed for the next session to begin building the Team System.