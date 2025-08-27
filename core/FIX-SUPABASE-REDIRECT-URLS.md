---
created: '2025-08-23'
domain: core
priority: P1
purpose: "Document \U0001F527 fix supabase redirect urls"
session: legacy
status: current
title: "\U0001F527 Fix Supabase Redirect URLs"
topics:
- auth
- documentation
type: guide
---

# 🔧 Fix Supabase Redirect URLs

**Problem**: Email confirmation links are redirecting to `dashboard.localhost.localdomain` which doesn't resolve.  
**Solution**: Update Supabase to use plain `localhost` URLs.

---

## 📋 IMMEDIATE FIX - Update Supabase Dashboard

### Step 1: Go to Supabase Dashboard
1. Visit: https://supabase.com/dashboard
2. Select your project: `bbrheacetxlnqbibjwsz`

### Step 2: Update Redirect URLs
1. Go to **Authentication** → **URL Configuration**
2. Update these settings:

**Site URL**:
```
http://localhost:3002
```

**Redirect URLs** (add all of these):
```
http://localhost:3000/auth/callback
http://localhost:3002/auth/callback
http://localhost:3002/onboarding
http://localhost:3002
http://localhost:3000
```

3. Click **Save**

### Step 3: Update Email Templates (Optional)
1. Go to **Authentication** → **Email Templates**
2. For "Confirm signup" template, ensure the URL uses:
```
{{ .ConfirmationURL }}
```
Not a hardcoded domain.

---

## 🧪 TEST THE FIXED FLOW

### Option 1: Resend Confirmation Email
1. Go to Supabase Dashboard → Authentication → Users
2. Find your test user
3. Click the "..." menu → "Send confirmation email"
4. Check your email - the link should now go to `localhost`

### Option 2: Create New Test User
1. Visit: http://localhost:3000
2. Sign up with new email (e.g., test-002@test.com)
3. Check email - confirmation should work

### Option 3: Manual Verification (Quick)
1. In Supabase Dashboard → Authentication → Users
2. Find your test user
3. Click "..." → "Confirm email" manually
4. Now try logging in at http://localhost:3000

---

## ✅ EXPECTED FLOW AFTER FIX

1. **Sign up** at http://localhost:3000
2. **Email arrives** with confirmation link
3. **Click link** → Goes to http://localhost:3000/auth/callback
4. **Auth processes** → Redirects to http://localhost:3002
5. **Dashboard checks** → If new student, shows call sign onboarding
6. **After onboarding** → Full dashboard access

---

## 🔍 VERIFY IT'S WORKING

### Check Auth Flow:
```bash
# In browser console at http://localhost:3000
const { createClient } = await import('@supabase/supabase-js');
const client = createClient(
  'https://bbrheacetxlnqbibjwsz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE'
);

const { data: { user } } = await client.auth.getUser();
console.log('Current user:', user);
```

### Check Dashboard Access:
After login, visiting http://localhost:3002 should:
- Show dashboard if call sign exists
- Redirect to `/onboarding/call-sign` if new student
- NOT redirect to `localhost.localdomain` anymore

---

## 🎯 CURRENT STATUS

✅ **Auth Gateway**: Running at http://localhost:3000  
✅ **Dashboard**: Running at http://localhost:3002  
✅ **Environment**: Fixed to use plain localhost  
⚠️ **Supabase**: Needs redirect URL update in dashboard  

Once you update the Supabase redirect URLs, the entire flow will work!

---

## 💡 ALTERNATIVE: Skip Email Verification

For quick testing, you can manually verify users:
1. Sign up at http://localhost:3000
2. Go to Supabase Dashboard → Authentication → Users
3. Find your user
4. Click "..." → "Confirm email"
5. Now login works immediately

---

*Both services are running with corrected localhost URLs. Just need to update Supabase redirect URLs to complete the fix!*