---
session: "00109"
type: "implementation-plan"
status: "ready"
created: "2025-08-29"
title: "Friend System Implementation Plan - P0 Social Foundation"
purpose: "Provide detailed plan for implementing the friend/social system from truth-seed"
topics: ["friends", "social", "implementation", "p0-features"]
priority: "P0"
domain: "reconciliation"
related_to: ["00109-TEAM-SYSTEM-IMPLEMENTATION-PLAN.md"]
---

# Friend System Implementation Plan

## Executive Summary
The Friend System is partially implemented in truth-seed and provides the social foundation for EDL. It enables peer connections, study partnerships, and social learning dynamics critical for K-12 engagement.

## Current State Analysis

### What Truth-Seed Provides

#### Backend Logic (`student-actions.ts`)
```typescript
// Available friend functions:
- getFriendListAction()         // Get user's friends
- getFriendRequestListAction()  // Pending requests
- sendFriendRequestAction()     // Send request
- (Missing: accept/reject - needs implementation)
```

#### Frontend Components
```
truth-seed/emdash-dashboard-main/src/components/student/
├── add-friend-dialog.tsx       // Send friend request modal
├── friend-request-dialog.tsx   // Manage requests
├── friend-sidebar.tsx          // Friends list sidebar
└── sidebar.tsx                 // Integration point

truth-seed/emdash-dashboard-main/src/components/ui/
└── friend-sidebar.tsx          // UI component
```

#### Database Schema
```sql
-- Friendship table structure
friendship (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES student(user_id),  -- Requester
  friend_id uuid REFERENCES student(user_id), -- Recipient
  status status DEFAULT 'PENDING',  -- PENDING, ACCEPTED, REJECTED
  created_at timestamp,
  updated_at timestamp
)

-- Supporting functions
get_friend_list()       -- Returns accepted friendships
get_friend_profiles()   -- Returns friend profile data
get_profile_uuid()      -- Lookup by username/email
approve_friendship()    -- Chat schema function
```

### What's Missing/Broken

1. **Accept/Reject Actions**: Backend functions not implemented
2. **Real-time Updates**: No subscription for friend changes
3. **RLS Policies**: Friendship table needs security
4. **Bidirectional Logic**: Friendship needs two-way confirmation
5. **UI Polish**: Components exist but need integration
6. **Chat Integration**: Friend chat initialization incomplete

## Implementation Steps

### Phase 1: Core Friend Logic (Session 110 or parallel)

#### Step 1.1: Verify Database Structure
```sql
-- Check friendship table and functions
SELECT * FROM friendship LIMIT 1;
SELECT * FROM pg_proc WHERE proname LIKE '%friend%';

-- Test existing functions
SELECT * FROM get_friend_profiles();
```

#### Step 1.2: Implement Missing Backend Actions
```typescript
// In student-actions.ts, add:

export const acceptFriendRequestAction = async (requestId: string) => {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { status: "error", message: "Not authenticated" };

  // Update friendship status
  const { error } = await supabase
    .from("friendship")
    .update({ status: "ACCEPTED" })
    .eq("id", requestId)
    .eq("friend_id", user.id); // Ensure user is recipient

  if (error) return { status: "error", message: error.message };

  // Create reciprocal friendship
  const { error: reciprocalError } = await supabase
    .from("friendship")
    .insert({
      user_id: user.id,
      friend_id: /* get from original request */,
      status: "ACCEPTED"
    });

  return { status: "success", message: "Friend request accepted" };
}

export const rejectFriendRequestAction = async (requestId: string) => {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { error } = await supabase
    .from("friendship")
    .update({ status: "REJECTED" })
    .eq("id", requestId)
    .eq("friend_id", user.id);

  if (error) return { status: "error", message: error.message };
  return { status: "success", message: "Friend request rejected" };
}
```

#### Step 1.3: Implement RLS Policies
```sql
-- Friendship table RLS
ALTER TABLE friendship ENABLE ROW LEVEL SECURITY;

-- Users can view their friendships
CREATE POLICY "Users view own friendships"
ON friendship FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() OR 
  friend_id = auth.uid()
);

-- Users can send friend requests
CREATE POLICY "Users send friend requests"
ON friendship FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid() AND
  status = 'PENDING'
);

-- Users can update requests sent to them
CREATE POLICY "Users manage received requests"
ON friendship FOR UPDATE
TO authenticated
USING (friend_id = auth.uid())
WITH CHECK (friend_id = auth.uid());
```

### Phase 2: UI Integration (Session 111 or parallel)

#### Step 2.1: Copy and Wire Components
```bash
# Copy friend components to active-work
cp truth-seed/emdash-dashboard-main/src/components/student/add-friend-dialog.tsx \
   reconciliation/active-work/dashboard/src/components/student/

cp truth-seed/emdash-dashboard-main/src/components/student/friend-* \
   reconciliation/active-work/dashboard/src/components/student/
```

#### Step 2.2: Integrate Friend Sidebar
```typescript
// In main layout or dashboard page:
import { FriendSidebar } from "@/components/student/friend-sidebar"

export default function DashboardLayout({ children }) {
  return (
    <div className="flex">
      <MainSidebar />
      {children}
      <FriendSidebar /> {/* Shows online friends */}
    </div>
  )
}
```

#### Step 2.3: Friend Request Flow
1. **Send Request**:
   - Search by username/email
   - Call `sendFriendRequestAction()`
   - Show pending state

2. **Receive Request**:
   - Display notification badge
   - Show request dialog
   - Accept/Reject buttons

3. **Manage Friends**:
   - List all friends
   - Show online status
   - Remove friend option

### Phase 3: Social Features (Session 112)

#### Step 3.1: Real-time Friend Status
```typescript
// Subscribe to friend online status
const friendStatusChannel = supabase
  .channel('friend-status')
  .on('presence', { event: 'sync' }, () => {
    const state = friendStatusChannel.presenceState()
    updateFriendStatuses(state)
  })
  .subscribe()

// Broadcast own status
friendStatusChannel.track({ 
  user_id: user.id,
  online_at: new Date().toISOString() 
})
```

#### Step 3.2: Friend Activity Feed
```typescript
// Show friend activities (optional enhancement)
- Friend joined a team
- Friend completed a challenge
- Friend is in a debate
```

#### Step 3.3: Friend Chat Integration
```typescript
// Initialize chat between friends
export const startFriendChatAction = async (friendId: string) => {
  const supabase = await createServerClient();
  
  // Check if chat room exists
  const { data: room } = await supabase
    .rpc('get_friend_room', { friend_id: friendId });
    
  if (!room) {
    // Create new friend chat room
    const { data: newRoom } = await supabase
      .from('chat.room')
      .insert({ 
        type: 'FRIEND',
        title: null // Friend chats don't need titles
      })
      .select()
      .single();
      
    // Add both participants
    await supabase.from('chat.participant').insert([
      { room_id: newRoom.id, student_id: user.id },
      { room_id: newRoom.id, student_id: friendId }
    ]);
    
    return newRoom.id;
  }
  
  return room.id;
}
```

## Success Metrics

### Core Functionality
- [ ] Users can send friend requests
- [ ] Users can accept/reject requests
- [ ] Friend list displays correctly
- [ ] Bidirectional friendships work
- [ ] RLS prevents unauthorized access

### Enhanced Features
- [ ] Real-time online status
- [ ] Friend sidebar integration
- [ ] Request notifications
- [ ] Friend search works
- [ ] Chat initialization ready

## Implementation Order Options

### Option A: Parallel with Teams
- **Pros**: Both social features ready together
- **Cons**: More complex testing, potential conflicts

### Option B: After Teams
- **Pros**: Simpler testing, teams provide social context
- **Cons**: Delays social features

### Option C: Before Teams  
- **Pros**: Simpler 1-to-1 relationships first
- **Cons**: Less immediate value than teams

**Recommendation**: Option A (parallel) if you have two developers, Option B if solo.

## Database Considerations

### Friendship Model
```
User A sends request to User B:
- friendship(user_id: A, friend_id: B, status: PENDING)

User B accepts:
- Update to ACCEPTED
- Create reciprocal: friendship(user_id: B, friend_id: A, status: ACCEPTED)

This creates bidirectional lookup capability.
```

### Edge Cases to Handle
1. **Duplicate Requests**: Check existing before creating
2. **Self-Friending**: Validate user_id != friend_id
3. **Blocking**: Future feature (status: BLOCKED)
4. **Unfriending**: Soft delete or status change

## Testing Checklist

### Unit Tests
- [ ] Send request to valid user
- [ ] Send request to invalid user
- [ ] Accept valid request
- [ ] Reject request
- [ ] Try to accept others' requests

### Integration Tests
- [ ] User A sends to User B
- [ ] User B sees request
- [ ] User B accepts
- [ ] Both see each other as friends
- [ ] Chat initialization works

### RLS Tests
- [ ] Can't see others' friendships
- [ ] Can't accept requests not sent to you
- [ ] Can't modify existing friendships

## Risk Mitigation

### Potential Issues
1. **Spam Requests**: Add rate limiting
2. **Privacy Concerns**: Add privacy settings later
3. **Scale Issues**: Index on user_id and friend_id
4. **RLS Complexity**: Start simple, enhance gradually

### Rollback Plan
- Friendship table is isolated
- Can disable feature without breaking auth/teams
- Keep friend UI components modular

## Time Estimate

- **Phase 1**: 2-3 hours (backend + RLS)
- **Phase 2**: 3-4 hours (UI integration)
- **Phase 3**: 2-3 hours (real-time + chat)
- **Total**: 7-10 hours

## Notes for Implementation

1. **Check truth-seed patterns** - Some logic might be in unexpected places
2. **Test with 3+ users** - Friendship networks get complex
3. **Consider friend limits** - Prevent spam/abuse
4. **Plan for unfriending** - Users change their minds
5. **Think about groups** - Friends might form teams together

---

**Priority Note**: While Teams enable group collaboration, Friends provide the social glue that keeps users engaged. Both are P0 for different reasons.