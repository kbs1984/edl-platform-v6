---
session: "00142"  
type: "canon"
status: "authoritative"
created: "2025-09-02"
title: "API Contracts Canon - Server Action Specifications"
purpose: "Define all server actions, their contracts, and expected behaviors"
topics: ["api", "contracts", "server-actions", "specifications", "interfaces"]
priority: "P0"
domain: "core"
canonical: true
immutable: true
---

# 📜 API Contracts Canon - Server Action Specifications

## Purpose
This canon defines the contracts for all server actions in the EDL Platform. Every server action must be documented here with its parameters, return types, error cases, and examples.

---

## 🔐 Authentication Actions

### signUp
**File**: `reconciliation/active-work/auth-gateway/src/lib/action/auth-actions.ts`
**Status**: ✅ IMPLEMENTED
```typescript
async function signUp(
  email: string,
  password: string,
  role: 'STUDENT' | 'GUARDIAN' | 'JUDGE',
  additionalData?: {
    name?: string
    dateOfBirth?: string
    gender?: string
  }
): Promise<{
  success: boolean
  error?: string
  user?: User
}>

// Example Usage
const result = await signUp(
  'student@example.com',
  'SecurePass123!',
  'STUDENT',
  { name: 'John Doe', dateOfBirth: '2010-01-01' }
)

// Error Cases
- Email already exists
- Weak password
- Invalid role
- Database connection failure
```

### signIn
**File**: `reconciliation/active-work/auth-gateway/src/lib/action/auth-actions.ts`
**Status**: ✅ IMPLEMENTED
```typescript
async function signIn(
  email: string,
  password: string
): Promise<{
  success: boolean
  error?: string
  user?: User
  redirectUrl?: string
}>

// Redirect Logic
- Students → /dashboard
- Guardians → /guardian/dashboard
- Judges → /judge/portal
- Unfinished profiles → /onboarding
```

### signOut
**File**: `reconciliation/active-work/dashboard/src/lib/actions/auth-actions.ts`
**Status**: ✅ IMPLEMENTED
```typescript
async function signOut(): Promise<{
  success: boolean
  error?: string
}>

// Behavior
- Clears session
- Revokes tokens
- Redirects to /login
```

---

## 👤 Profile Actions

### createProfile
**File**: `reconciliation/active-work/dashboard/src/lib/actions/profile-actions.ts`
**Status**: ✅ IMPLEMENTED
```typescript
async function createProfile(data: {
  userId: string
  name: string
  username?: string
  imageUrl?: string
  dateOfBirth?: Date
  gender?: 'MALE' | 'FEMALE' | 'do not wish to specify'
  userRole: 'STUDENT' | 'GUARDIAN' | 'JUDGE'
}): Promise<{
  success: boolean
  error?: string
  profile?: Profile
}>

// Validation Rules
- Username must be unique
- Name required
- Role must match auth record
- Auto-generates call_sign for students
```

### updateProfile
**File**: `reconciliation/active-work/dashboard/src/lib/actions/profile-actions.ts`
**Status**: ✅ IMPLEMENTED
```typescript
async function updateProfile(
  profileId: string,
  updates: Partial<Profile>
): Promise<{
  success: boolean
  error?: string
  profile?: Profile
}>

// Restrictions
- Cannot change userId
- Cannot change role
- Username uniqueness enforced
```

### getProfile
**File**: `reconciliation/active-work/dashboard/src/utils/get-user-info.ts`
**Status**: ✅ IMPLEMENTED
```typescript
async function getProfile(userId?: string): Promise<{
  profile: Profile | null
  student?: Student
  guardian?: Guardian
  judge?: Judge
}>

// Behavior
- Uses auth.uid() if no userId provided
- Joins role-specific tables
- Returns null if not found
```

---

## 👥 Guardian Actions

### createGuardian
**File**: `reconciliation/active-work/dashboard/src/lib/actions/guardian-actions.ts`
**Status**: ❌ BROKEN (Empty insert bug)
```typescript
async function createGuardian(data: {
  userId: string
  paymentMethod?: string
  billingAddress?: string
}): Promise<{
  success: boolean
  error?: string
  guardian?: Guardian
}>

// CRITICAL BUG
// Line 17: Empty object insertion
// See RECOVERY-CANON.md for fix
```

### linkStudentToGuardian
**File**: `reconciliation/active-work/dashboard/src/lib/actions/link-student-actions.ts`
**Status**: ⚠️ PARTIAL
```typescript
async function linkStudentToGuardian(
  guardianId: string,
  studentCode: string
): Promise<{
  success: boolean
  error?: string
  student?: Student
}>

// Process
1. Validate student code exists
2. Check student not already linked
3. Update student.guardian_id
4. Send confirmation email
```

---

## 🎓 Student Actions

### createStudent
**File**: `reconciliation/active-work/dashboard/src/lib/actions/student-actions.ts`
**Status**: ✅ IMPLEMENTED
```typescript
async function createStudent(data: {
  userId: string
  schoolId?: string
  division?: 'VILLIGER' | 'LOWER' | 'UPPER' | 'SENIOR' | 'OPEN'
  graduationYear?: number
  callSign?: string
}): Promise<{
  success: boolean
  error?: string
  student?: Student
}>

// Auto-generates
- call_sign if not provided
- exp starts at 0
- level starts at 0
```

### updateStudentProgress
**File**: `reconciliation/active-work/dashboard/src/lib/actions/student-actions.ts`
**Status**: ✅ IMPLEMENTED
```typescript
async function updateStudentProgress(
  studentId: string,
  expGained: number
): Promise<{
  success: boolean
  error?: string
  newLevel?: number
  newExp?: number
}>

// Level Calculation
- Every 1000 exp = 1 level
- Triggers achievement check
- Updates ranking
```

---

## 🤝 Friend System Actions

### sendFriendRequest
**File**: `reconciliation/active-work/dashboard/src/lib/actions/friend-actions.ts`
**Status**: ✅ IMPLEMENTED (No real-time)
```typescript
async function sendFriendRequest(
  fromUserId: string,
  toUserId: string
): Promise<{
  success: boolean
  error?: string
  request?: Friendship
}>

// Validation
- Cannot friend yourself
- Cannot duplicate request
- Checks if already friends
```

### acceptFriendRequest
**File**: `reconciliation/active-work/dashboard/src/lib/actions/friend-actions.ts`
**Status**: ✅ IMPLEMENTED
```typescript
async function acceptFriendRequest(
  requestId: string
): Promise<{
  success: boolean
  error?: string
}>

// Behavior
- Updates status to 'ACCEPTED'
- Sets accepted_at timestamp
- Should trigger WebSocket (MISSING)
```

### getFriends
**File**: `reconciliation/active-work/dashboard/src/hooks/use-friends.ts`
**Status**: ✅ IMPLEMENTED
```typescript
async function getFriends(userId: string): Promise<{
  friends: Friend[]
  pending: FriendRequest[]
  error?: string
}>

// Returns
- Accepted friends with profiles
- Pending requests (sent & received)
- Sorted by most recent
```

---

## 🏃 Activity Runtime Actions

### createActivity
**File**: `reconciliation/active-work/dashboard/src/lib/actions/activity-actions.ts`
**Status**: ✅ IMPLEMENTED
```typescript
async function createActivity(data: {
  title: string
  description?: string
  totalSessions: number
  createdBy: string
}): Promise<{
  success: boolean
  error?: string
  activity?: Activity
}>
```

### startActivityInstance
**File**: `reconciliation/active-work/dashboard/src/lib/actions/activity-actions.ts`
**Status**: ✅ IMPLEMENTED
```typescript
async function startActivityInstance(
  activityId: string,
  userId: string
): Promise<{
  success: boolean
  error?: string
  instance?: ActivityInstance
}>

// Creates
- activity_instance record
- Initial session_progress
- Sets current_session to 1
```

### saveProgress
**File**: `reconciliation/active-work/dashboard/src/lib/actions/activity-actions.ts`
**Status**: ✅ IMPLEMENTED
```typescript
async function saveProgress(
  instanceId: string,
  sessionId: string,
  progressData: any
): Promise<{
  success: boolean
  error?: string
  autoSaveCount?: number
}>

// Auto-save
- Increments auto_save_count
- Updates last_save_at
- Stores in JSONB
```

### submitAssignment
**File**: `reconciliation/active-work/dashboard/src/lib/actions/activity-actions.ts`
**Status**: ✅ IMPLEMENTED
```typescript
async function submitAssignment(
  assignmentId: string,
  instanceId: string,
  content: string,
  fileUrls?: string[]
): Promise<{
  success: boolean
  error?: string
  submission?: AssignmentSubmission
}>
```

---

## 💰 EmCoin Actions (TO BE BUILT)

### createTransaction
**Status**: 🔴 NOT IMPLEMENTED
```typescript
async function createTransaction(data: {
  fromUserId: string
  toUserId: string
  amount: number
  type: 'EARN' | 'SPEND' | 'TRANSFER' | 'REWARD'
  reason: string
  metadata?: any
}): Promise<{
  success: boolean
  error?: string
  transaction?: EmCoinTransaction
  newBalance?: number
}>

// Validation Rules
- Check sufficient balance
- Validate positive amount
- Prevent self-transfer
- Log for audit trail
```

### awardAchievement
**Status**: 🔴 NOT IMPLEMENTED
```typescript
async function awardAchievement(
  userId: string,
  achievementId: string
): Promise<{
  success: boolean
  error?: string
  emCoinsAwarded?: number
  achievement?: Achievement
}>

// Process
1. Check not already awarded
2. Create user_achievement record
3. Award EmCoins based on rarity
4. Trigger notification
5. Update profile showcase
```

### checkMilestone
**Status**: 🔴 NOT IMPLEMENTED
```typescript
async function checkMilestone(
  userId: string,
  metric: 'debates' | 'friends' | 'activities' | 'login_streak'
): Promise<{
  milestonesAchieved: Milestone[]
  emCoinsEarned: number
}>

// Milestones
- First debate: 100 EmCoins
- 10 friends: 200 EmCoins
- 30-day streak: 500 EmCoins
- Level 10: 1000 EmCoins
```

### getWallet
**Status**: 🔴 NOT IMPLEMENTED
```typescript
async function getWallet(userId: string): Promise<{
  balance: number
  transactions: EmCoinTransaction[]
  pendingRewards: number
}>
```

---

## 📊 Admin Actions

### getSystemMetrics
**Status**: ⚠️ PARTIAL
```typescript
async function getSystemMetrics(): Promise<{
  totalUsers: number
  activeToday: number
  totalEmCoins: number
  totalDebates: number
  systemHealth: number
}>
```

### moderateContent
**Status**: 🔴 NOT IMPLEMENTED
```typescript
async function moderateContent(
  contentId: string,
  contentType: 'profile' | 'chat' | 'submission',
  action: 'approve' | 'flag' | 'remove',
  reason?: string
): Promise<{
  success: boolean
  error?: string
}>
```

---

## 🔄 Real-time Subscriptions (TO BE BUILT)

### Friend Request Subscription
**Status**: 🔴 NOT IMPLEMENTED
```typescript
const friendChannel = supabase
  .channel('friend-requests')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'friendship',
    filter: `user_id=eq.${userId},friend_id=eq.${userId}`
  }, handleFriendUpdate)
  .subscribe()
```

### Team Chat Subscription
**Status**: 🔴 NOT IMPLEMENTED
```typescript
const chatChannel = supabase
  .channel('team-chat')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'chat',
    table: 'message',
    filter: `room_id=eq.${roomId}`
  }, handleNewMessage)
  .subscribe()
```

### Visitor Count Subscription
**Status**: 🔴 NOT IMPLEMENTED (Cyworld Critical)
```typescript
const visitorChannel = supabase
  .channel('profile-visitors')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'profile_visitors'
  }, handleNewVisitor)
  .subscribe()
```

---

## 🔒 Security Patterns

### All Actions Must:
1. **Validate input** with Zod schemas
2. **Check authentication** via getUser()
3. **Verify authorization** via RLS
4. **Handle errors** gracefully
5. **Log attempts** for audit
6. **Return typed** responses

### Example Pattern:
```typescript
'use server'

import { z } from 'zod'
import { createClient } from '@/utils/supabase/server'
import { getUser } from '@/utils/get-user'

const schema = z.object({
  // Define schema
})

export async function serverAction(data: unknown) {
  // 1. Validate
  const parsed = schema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: 'Invalid input' }
  }
  
  // 2. Authenticate
  const user = await getUser()
  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }
  
  // 3. Execute with RLS
  const supabase = createClient()
  const { data: result, error } = await supabase
    .from('table')
    .insert(parsed.data)
  
  // 4. Handle errors
  if (error) {
    console.error('Action failed:', error)
    return { success: false, error: error.message }
  }
  
  // 5. Return typed
  return { success: true, data: result }
}
```

---

## 📈 Performance Requirements

### Response Times
- Authentication: < 500ms
- Data fetch: < 200ms
- Mutations: < 300ms
- Real-time: < 100ms latency
- Auto-save: < 100ms

### Rate Limits
- Auth attempts: 5 per minute
- API calls: 100 per minute
- EmCoin transactions: 10 per minute
- Friend requests: 20 per hour

---

## 🎯 Testing Contracts

Every action must have:
1. **Unit test** for business logic
2. **Integration test** with database
3. **E2E test** for critical paths
4. **Load test** for performance
5. **Security test** for auth/authz

---

*This canon defines the contract between frontend and backend. All server actions must be documented here before implementation.*

**Session 142 Implementation** - API Contracts Canon established for system interfaces.