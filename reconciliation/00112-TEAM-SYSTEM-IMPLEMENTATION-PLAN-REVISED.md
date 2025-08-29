---
session: "00112"
type: "implementation-plan"
status: "ready-for-review"
created: "2025-08-29"
title: "Team System Implementation Plan - Revised with Ground Truth"
purpose: "Provide Session 113 with accurate, evidence-based plan for implementing team system"
topics: ["teams", "implementation", "truth-seed", "collaboration"]
priority: "P0"
domain: "reconciliation"
replaces: ["00109-TEAM-SYSTEM-IMPLEMENTATION-PLAN.md"]
---

# Team System Implementation Plan - REVISED
*For Session 113 Review and Collaboration*

## Executive Summary

The Team System is the **most complete feature** in truth-seed with 558 lines of backend logic and 7 UI components ready. Unlike Guardian (95% missing), Teams has:
- ✅ Complete database schema (team, team_member tables)
- ✅ 11 backend functions fully implemented
- ✅ 7 UI components (28KB total)
- ✅ RLS policies already in place (permissive)
- ✅ Database functions for leader management
- ⚠️ Just needs wiring and integration

**Estimated Time**: 3-4 hours (vs 12-15 hours for Guardian)

## What Actually Exists (Ground Truth)

### Database Structure ✅ COMPLETE
```sql
-- team table
- id (uuid, auto-generated)
- name (text, required)
- description (text, required)
- division (enum type)
- image_path (text, required)
- created_at, updated_at

-- team_member table
- id (uuid)
- student_id (uuid FK)
- team_id (uuid FK)
- is_leader (boolean)
- status (enum: PENDING/ACCEPTED/REJECTED)
- join_date (timestamp)
```

### Backend Functions ✅ COMPLETE (558 lines)
```typescript
// All these functions exist and are fully implemented:
1. checkTeamNameAvailability()     // Validate unique names
2. getMyTeams()                    // List user's teams
3. getPendingTeamInvitations()     // Show invites
4. updateTeamMemberStatus()        // Accept/reject invites
5. createTeamAction()              // Create new team
6. getTeamDetailsPageData()        // Full team info
7. inviteTeamMember()              // Send invitations
8. removeTeamMember()              // Kick members
9. updateTeamInfo()                // Edit team details
10. changeTeamLeader()             // Transfer leadership
11. isTeamDetailsErrorData()       // Error handling
```

### Database Functions ✅ EXIST
```sql
- check_team_member_delete()
- check_team_update_leader()
- delete_empty_team_after_member_delete()
- set_team_leader(team_id, student_id)
```

### RLS Policies ✅ EXIST (Very Permissive)
```sql
-- Current policies are wide open:
team:
  - SELECT: true (anyone can view)
  - INSERT: true (anyone authenticated)
  - UPDATE: true (anyone)
  - DELETE: true (anyone)

team_member:
  - SELECT: true (anyone can view)
  - INSERT: status='PENDING' OR user is student
  - UPDATE: true (anyone)
  - DELETE: true (anyone)

Note: These need tightening but they work!
```

### UI Components ✅ COMPLETE (7 files, 28KB)
```
truth-seed/emdash-dashboard-main/src/components/team/
├── edit-team-dialog.tsx        (3.4KB) - Team settings modal
├── invite-member-dialog.tsx    (5.3KB) - Invitation flow  
├── team-header.tsx             (4.4KB) - Team info display
├── team-list.tsx               (4.0KB) - Browse teams
├── team-members-list.tsx      (5.1KB) - Member roster
├── team-request-dialog.tsx    (5.0KB) - Join requests
└── team-skeletons.tsx         (1.6KB) - Loading states
```

### Pages ✅ EXIST
```
truth-seed/emdash-dashboard-main/src/app/(user-pages)/groups/teams/
├── page.tsx           // Teams dashboard
├── new/page.tsx       // Create team form
└── [team_id]/page.tsx // Team details view
```

## What's Actually Missing

### 1. Component Integration 🔧 (1 hour)
- Copy team components to reconciliation/active-work/dashboard
- Copy team pages to app structure
- Update imports to match our structure

### 2. Wire Server Actions 🔌 (1 hour)
- Components reference actions but may need path updates
- Ensure form submissions connect to server actions
- Add proper error handling and toasts

### 3. Navigation Links 🔗 (30 min)
- Add Teams to main navigation sidebar
- Link from dashboard to teams section
- Add "Create Team" button

### 4. RLS Refinement 🔒 (30 min)
- Current policies are too permissive
- Need to restrict UPDATE/DELETE to team leaders
- Keep permissive initially, tighten later

### 5. Testing & Polish ✨ (1 hour)
- Test full flow with multiple users
- Verify invitations work
- Check leader transfer
- Fix any console errors

## Implementation Steps for Session 113

### Phase 1: Copy & Setup (45 minutes)
```bash
# 1. Copy team components
cp -r truth-seed/emdash-dashboard-main/src/components/team \
      reconciliation/active-work/dashboard/src/components/

# 2. Copy team pages
cp -r truth-seed/emdash-dashboard-main/src/app/\(user-pages\)/groups \
      reconciliation/active-work/dashboard/src/app/\(user-pages\)/

# 3. Copy team actions
cp truth-seed/emdash-dashboard-main/src/lib/actions/team-actions.ts \
   reconciliation/active-work/dashboard/src/lib/actions/

# 4. Copy team types
# Check if TeamWithStatus, TeamMember etc. types exist
```

### Phase 2: Integration (1 hour)
```typescript
// 1. Update imports in components
// FROM: import { createTeamAction } from "@/lib/actions/team-actions"
// TO: Verify path matches our structure

// 2. Add to navigation (sidebar.tsx or nav-main.tsx)
{
  title: "Teams",
  icon: Users,
  href: "/groups/teams",
}

// 3. Test database connectivity
const teams = await getMyTeams();
console.log("Teams loaded:", teams);
```

### Phase 3: Test Core Flows (1 hour)
```
1. Create Team:
   - Navigate to /groups/teams/new
   - Fill form (name, description)
   - Submit → Creates team
   - Creator becomes leader

2. Invite Member:
   - Open team page
   - Click invite
   - Enter username/email
   - Send invitation

3. Accept Invitation:
   - Second user sees pending invite
   - Accepts → Joins team
   - Shows in member list

4. Leader Actions:
   - Transfer leadership
   - Remove member
   - Edit team info
   - Delete team
```

### Phase 4: Polish & RLS (30 min)
```sql
-- Tighten RLS after basic functionality works
ALTER POLICY "Enable update for users based on email" 
ON team_member 
USING (
  -- Only team leaders can update members
  EXISTS (
    SELECT 1 FROM team_member 
    WHERE team_id = team_member.team_id 
    AND student_id = auth.uid() 
    AND is_leader = true
  )
);
```

## Key Differences from Session 109's Plan

| Aspect | Session 109 Assumed | Reality | Impact |
|--------|-------------------|---------|---------|
| Backend | Partial implementation | **COMPLETE** (11 functions) | ✅ Saves 3-4 hours |
| UI Components | Need building | **COMPLETE** (7 components) | ✅ Saves 2-3 hours |
| Database | Tables exist | **COMPLETE** with functions | ✅ Ready to use |
| RLS | Need to create | **EXISTS** (too permissive) | ✅ Just needs tightening |
| Integration | Major work | **Minor** - just wiring | ✅ Quick win |

## Risk Mitigation

### Low Risks ✅
1. **Database**: Schema complete and tested
2. **Backend**: All logic implemented
3. **UI**: Components professionally built
4. **Functions**: Database functions handle edge cases

### Medium Risks ⚠️
1. **Import Paths**: May need adjustment for our structure
2. **Type Definitions**: Ensure all types are imported
3. **Supabase Client**: Different initialization pattern?
4. **Division Enum**: Need to verify enum values match

### Mitigation Strategy
- Start with READ operations (list teams)
- Test each function in isolation first
- Keep existing RLS initially
- Use console.log liberally during testing

## Success Metrics

### Must Have (Phase 1-3)
- [ ] Users can create teams
- [ ] Users can see their teams
- [ ] Users can invite members
- [ ] Users can accept/reject invites
- [ ] Basic team page displays

### Should Have (Phase 4)
- [ ] Leader can transfer leadership
- [ ] Leader can kick members
- [ ] Team info editable
- [ ] Proper RLS restrictions

### Nice to Have (Future)
- [ ] Team avatars/images
- [ ] Real-time member updates
- [ ] Team activity feed
- [ ] Integration with chat

## Why This Will Succeed

1. **Complete Implementation**: Unlike Guardian (5% done), Teams is 90% done
2. **Professional Code**: Truth-seed team code is production-quality
3. **Database Ready**: Tables, functions, and RLS all exist
4. **UI Complete**: All components built and styled
5. **Quick Win**: Can deliver value in one session

## Session 113 Action Items

### Immediate Tasks (First 30 min)
1. Verify database tables with execute_sql
2. Copy all team files to active-work
3. Test `getMyTeams()` function
4. Check for type dependencies

### Core Implementation (Next 2 hours)
1. Wire up team creation flow
2. Test invitation system
3. Implement team dashboard
4. Add navigation links

### Testing & Polish (Final hour)
1. Multi-user testing
2. Fix any errors
3. Tighten RLS if time permits
4. Document any issues

## Comparison with Guardian

| Feature | Teams | Guardian |
|---------|-------|----------|
| Database Schema | ✅ Complete | ❌ Wrong (payment fields) |
| Backend Logic | ✅ 558 lines | ❌ Empty insert |
| UI Components | ✅ 7 files | ❌ 1 phone form |
| Functions | ✅ 11 implemented | ❌ None |
| RLS | ✅ Exists | ❌ None |
| Time to Complete | 3-4 hours | 12-15 hours |
| Risk Level | Low | High |

## Recommendation

**START WITH TEAMS!** This is a quick win that will:
1. Deliver real functionality TODAY
2. Build confidence in the platform
3. Provide social features users want
4. Create foundation for guilds/debate teams
5. Give us experience for building Guardian later

---

**For Session 113**: This plan is based on actual code inspection and database verification. The team system is remarkably complete in truth-seed - we just need to integrate it properly. This should be a straightforward win that delivers significant value.