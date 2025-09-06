---
session: "00116"
type: "implementation-roadmap"
status: "ready"
created: "2025-08-30"
title: "Friends System Implementation Roadmap for Session 117"
purpose: "Provide exact implementation steps with code locations and patterns"
topics: ["friends", "implementation", "roadmap", "accept-reject"]
priority: "P0"
domain: "reconciliation"
implements: ["friend-accept-reject"]
related_to: ["00109-FRIEND-SYSTEM-IMPLEMENTATION-PLAN.md", "SESSION-00117-HANDOFF.md"]
---

# Friends System Implementation Roadmap for Session 117

**Prepared by**: Session 116
**Purpose**: Exact locations and code for implementing accept/reject functionality

## Current State Analysis

### ✅ What's Already Working
1. **UI Exists and Is Wired** (`friend-request-dialog.tsx:54`)
   - Accept button submits "ACCEPTED" 
   - Reject button submits "REJECTED"
   - Calls `updateFriendRequestAction(friendshipId, action)`

2. **Basic Update Function Exists** (`student-actions.ts:131-143`)
   - Updates friendship status
   - BUT missing bidirectional friendship creation

3. **Database Ready**
   - Tables accessible
   - Functions working
   - Permissions fixed

### ❌ What's Missing
- Bidirectional friendship creation on accept
- Proper validation of who can accept/reject
- `accepted_at` timestamp update

## Implementation Steps (2-3 hours total)

## Step 1: Enhance updateFriendRequestAction (1 hour)

### Location: `reconciliation/active-work/dashboard/src/lib/actions/student-actions.ts`

### Current Code (Lines 131-143):
```typescript
export const updateFriendRequestAction = async (requestId: string, status: "ACCEPTED" | "REJECTED") => {
  const supabase = await createServerClient();
  const { error } = await supabase
    .from("friendship")
    .update({ 
      status: status,
      updated_at: new Date().toISOString()
    })
    .eq("id", requestId);

  if (error) return { status: "error", message: `Failed to update friend request: ${error.message}`};
  return { status: "success", message: "Friend request updated successfully"};
}
```

### REPLACE WITH This Complete Implementation:
```typescript
export const updateFriendRequestAction = async (requestId: string, status: "ACCEPTED" | "REJECTED") => {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { status: "error", message: "Not authenticated" };
  }

  // First, get the original friendship request to know who sent it
  const { data: originalRequest, error: fetchError } = await supabase
    .from("friendship")
    .select("user_id, friend_id")
    .eq("id", requestId)
    .single();

  if (fetchError || !originalRequest) {
    return { status: "error", message: "Friend request not found" };
  }

  // Verify the current user is the recipient of the request
  if (originalRequest.friend_id !== user.id) {
    return { status: "error", message: "You can only respond to requests sent to you" };
  }

  // Update the original request
  const updateData: any = {
    status: status,
    updated_at: new Date().toISOString()
  };

  // Add accepted_at timestamp if accepting
  if (status === "ACCEPTED") {
    updateData.accepted_at = new Date().toISOString();
  }

  const { error: updateError } = await supabase
    .from("friendship")
    .update(updateData)
    .eq("id", requestId);

  if (updateError) {
    return { status: "error", message: `Failed to update friend request: ${updateError.message}` };
  }

  // If accepted, create the reciprocal friendship
  if (status === "ACCEPTED") {
    // Check if reciprocal already exists (defensive programming)
    const { data: existingReciprocal } = await supabase
      .from("friendship")
      .select("id")
      .eq("user_id", originalRequest.friend_id)
      .eq("friend_id", originalRequest.user_id)
      .single();

    if (!existingReciprocal) {
      const { error: reciprocalError } = await supabase
        .from("friendship")
        .insert({
          user_id: originalRequest.friend_id,  // Current user (who accepted)
          friend_id: originalRequest.user_id,  // Person who sent request
          status: "ACCEPTED",
          accepted_at: new Date().toISOString()
        });

      if (reciprocalError) {
        console.error("Failed to create reciprocal friendship:", reciprocalError);
        // Note: We don't fail the whole operation if reciprocal fails
        // The original acceptance already succeeded
      }
    }
  }

  return { 
    status: "success", 
    message: status === "ACCEPTED" 
      ? "Friend request accepted! You are now friends." 
      : "Friend request declined."
  };
}
```

## Step 2: Add Separate Accept/Reject Actions (Optional but Cleaner) (30 min)

If you prefer separate functions for clarity, ADD these after updateFriendRequestAction:

```typescript
export const acceptFriendRequestAction = async (requestId: string) => {
  return updateFriendRequestAction(requestId, "ACCEPTED");
}

export const rejectFriendRequestAction = async (requestId: string) => {
  return updateFriendRequestAction(requestId, "REJECTED");
}
```

## Step 3: Test the Implementation (1 hour)

### Testing Setup Required
You need **TWO browser sessions** with different users:

1. **Browser 1 (User A)**:
   - Login as test user A
   - Navigate to dashboard
   - Send friend request to User B

2. **Browser 2 (User B)**:
   - Login as test user B  
   - Navigate to dashboard
   - Should see friend request notification
   - Click friend request dialog
   - Accept or Reject

### What to Verify

#### Test 1: Accept Flow
1. User B accepts User A's request
2. Check database for TWO friendship records:
   ```sql
   SELECT * FROM friendship 
   WHERE (user_id = 'USER_A_ID' AND friend_id = 'USER_B_ID')
      OR (user_id = 'USER_B_ID' AND friend_id = 'USER_A_ID');
   -- Should return 2 records, both with status = 'ACCEPTED'
   ```
3. Both users should see each other in friend lists

#### Test 2: Reject Flow
1. User B rejects User A's request
2. Check database:
   ```sql
   SELECT * FROM friendship WHERE id = 'REQUEST_ID';
   -- Should show status = 'REJECTED'
   -- Should NOT create reciprocal record
   ```

#### Test 3: Permission Check
1. Try to accept a request not sent to you
2. Should get error: "You can only respond to requests sent to you"

## Step 4: UI Feedback Enhancement (30 min optional)

### Current Issue
The dialog doesn't refresh after accept/reject. The toast shows but request stays visible.

### Fix Location: `friend-request-dialog.tsx`

### Add State Management (around line 25):
```typescript
const [profiles, setProfiles] = useState<Array<FriendshipWithProfile>>([]);
const [processing, setProcessing] = useState<string | null>(null); // Add this
```

### Update handleSubmit (replace lines 46-62):
```typescript
const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  
  const button = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement;
  const action = button.value as "ACCEPTED" | "REJECTED";
  const friendshipId = (event.target as HTMLFormElement).friendship_id.value;
  
  setProcessing(friendshipId); // Show loading state
  
  const res = await updateFriendRequestAction(friendshipId, action);
  
  if (res.status === "error") {
    toast({
      title: "Error",
      description: res.message,
      variant: "destructive",
    });
    setProcessing(null);
  } else {
    toast({
      title: "Success",
      description: res.message,
    });
    // Remove the processed request from the list
    setProfiles(prev => prev.filter(p => p.friendship.id !== friendshipId));
    setProcessing(null);
  }
};
```

### Update Buttons (lines 100-105) to show loading:
```typescript
<button 
  type="submit" 
  name="action" 
  value="REJECTED" 
  disabled={processing === req.friendship.id}
  className="bg-red-500 text-white px-2 py-2 rounded-md cursor-pointer disabled:opacity-50"
>
  <XIcon />
</button>
<button 
  type="submit" 
  name="action" 
  value="ACCEPTED" 
  disabled={processing === req.friendship.id}
  className="bg-green-500 text-white px-2 py-2 rounded-md cursor-pointer disabled:opacity-50"
>
  <Check />
</button>
```

## Database Verification Queries

Use these to verify your implementation:

```sql
-- Check all friendships for a user
SELECT 
  f.*,
  p.username as friend_username
FROM friendship f
JOIN profile p ON p.id = CASE 
  WHEN f.user_id = 'YOUR_USER_ID' THEN f.friend_id
  ELSE f.user_id
END
WHERE f.user_id = 'YOUR_USER_ID' OR f.friend_id = 'YOUR_USER_ID';

-- Check for orphaned friendships (should be none)
SELECT * FROM friendship f1
WHERE f1.status = 'ACCEPTED'
AND NOT EXISTS (
  SELECT 1 FROM friendship f2
  WHERE f2.user_id = f1.friend_id
  AND f2.friend_id = f1.user_id
  AND f2.status = 'ACCEPTED'
);
```

## Common Issues & Solutions

### Issue 1: "permission denied for table friendship"
**Solution**: Session 117 already fixed this with GRANT permissions

### Issue 2: Reciprocal friendship not created
**Check**: 
- Is `originalRequest.user_id` correctly captured?
- Is the insert statement executing?
- Check console for reciprocal error logs

### Issue 3: Can accept own sent requests
**Solution**: The validation `originalRequest.friend_id !== user.id` prevents this

### Issue 4: Dialog doesn't update after action
**Solution**: Implement the UI feedback enhancement in Step 4

## Success Criteria

✅ **MVP Complete When**:
1. User can accept friend request → Creates 2 ACCEPTED records
2. User can reject friend request → Updates to REJECTED, no reciprocal
3. Can't accept/reject requests not sent to you
4. UI updates after action (removes processed request)
5. Both users see each other in friend lists after acceptance

## Time Breakdown

- **Step 1**: 45-60 minutes (implement enhanced updateFriendRequestAction)
- **Step 2**: 15-30 minutes (optional separate functions)
- **Step 3**: 45-60 minutes (testing with two users)
- **Step 4**: 30 minutes (optional UI enhancements)
- **Total**: 2-3 hours for complete implementation

## Key Files Summary

1. **PRIMARY CHANGE**: 
   - `src/lib/actions/student-actions.ts` → Replace updateFriendRequestAction

2. **OPTIONAL UI FIX**:
   - `src/components/student/friend-request-dialog.tsx` → Add state management

3. **NO CHANGES NEEDED**:
   - Database (already fixed by Session 117)
   - `use-friends.ts` (already fixed by Session 117)

---

**Ready to Implement**: This roadmap provides exact code and locations. No investigation needed - just copy, paste, and test.