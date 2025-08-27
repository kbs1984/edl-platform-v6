---
created: '2025-08-23'
domain: reconciliation
priority: P0
purpose: Document critical code fixes for truth seed adoption
session: '00044'
status: current
title: Critical Code Fixes for Truth Seed Adoption
topics:
- auth
- documentation
type: guide
implements:
- requirement-to-be-specified
modified: '2025-08-27'
---

# Critical Code Fixes for Truth Seed Adoption
**Sessions**: 00044 & 00045  
**Date**: 2025-08-21  
**Status**: MUST FIX before deployment

---

## 🔴 CRITICAL: Cookie Propagation Fix

### File: `auth-gateway/src/app/auth/callback/route.ts`
**Line**: 21  
**Issue**: Hardcoded project ID from original emdash  
**Current Code**:
```typescript
if (token.name.includes("niyrthumgjmtkjgtlbnq")) // 프로젝트 이름
```
**Fixed Code**:
```typescript
if (token.name.includes("bbrheacetxlnqbibjwsz")) // EDL Platform project
```
**Impact**: WITHOUT THIS FIX, COOKIES WON'T SHARE BETWEEN SUBDOMAINS

---

## 🔴 CRITICAL: Protocol Hardcoding Fix

### File: `auth-gateway/src/lib/action/auth-actions.ts`
**Line**: 68  
**Issue**: Hardcoded http:// breaks production HTTPS  
**Current Code**:
```typescript
return redirect(`http://${process.env.DASHBOARD_URL}`);
```
**Fixed Code**:
```typescript
return redirect(`${process.env.PROTOCOL}${process.env.DASHBOARD_URL}`);
```
**Impact**: Production will redirect to HTTP instead of HTTPS

---

## 🟡 IMPORTANT: Call Sign Validation

### File: `dashboard/src/app/(user-pages)/page.tsx`
**Line**: After line 14 (before line 16)  
**Issue**: No call_sign check exists  
**Code to Insert**:
```typescript
// Check if student needs call sign (EDL identity)
if (profile.user_role === 'STUDENT') {
  const { data: student } = await supabase
    .from('student')
    .select('call_sign')
    .eq('user_id', profile.id)
    .single();
    
  if (!student?.call_sign) {
    redirect('/onboarding/call-sign');
  }
}
```

---

## 🟡 IMPORTANT: Call Sign Selection Page

### New File: `dashboard/src/app/(init-pages)/onboarding/call-sign/page.tsx`
**Full Implementation**:
```typescript
import { createServerClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function CallSignPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) redirect('/');

  // Server action to save call sign
  async function saveCallSign(formData: FormData) {
    'use server';
    const callSign = formData.get('call_sign') as string;
    
    // Validate format
    if (!/^[a-z0-9-]+$/.test(callSign)) {
      return { error: 'Invalid format. Use lowercase letters, numbers, and hyphens only.' };
    }
    
    const supabase = await createServerClient();
    
    // Check availability
    const { data: existing } = await supabase
      .from('student')
      .select('call_sign')
      .eq('call_sign', callSign)
      .single();
      
    if (existing) {
      return { error: 'Call sign already taken. Please choose another.' };
    }
    
    // Save to database
    const { error } = await supabase
      .from('student')
      .update({ call_sign: callSign })
      .eq('user_id', user.id);
      
    if (!error) {
      redirect('/');
    }
    
    return { error: 'Failed to save call sign. Please try again.' };
  }

  // Generate suggestions
  const adjectives = ['swift', 'brave', 'wise', 'bold', 'keen'];
  const nouns = ['eagle', 'wolf', 'owl', 'hawk', 'fox'];
  const number = Math.floor(Math.random() * 99) + 1;
  const suggestions = adjectives.map(adj => 
    `${adj}-${nouns[Math.floor(Math.random() * nouns.length)]}-${number}`
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Choose Your Call Sign</h2>
          <p className="mt-2 text-gray-600">
            Your unique identity in the EDL Platform
          </p>
        </div>
        
        <form action={saveCallSign} className="mt-8 space-y-6">
          <div>
            <label htmlFor="call_sign" className="block text-sm font-medium text-gray-700">
              Call Sign
            </label>
            <input
              id="call_sign"
              name="call_sign"
              type="text"
              required
              pattern="[a-z0-9-]+"
              maxLength={30}
              placeholder="swift-eagle-42"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
            <p className="mt-2 text-sm text-gray-500">
              Use lowercase letters, numbers, and hyphens only
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Need inspiration?</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map(suggestion => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={(e) => {
                    const input = document.getElementById('call_sign') as HTMLInputElement;
                    input.value = suggestion;
                  }}
                  className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700 hover:bg-blue-100"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 py-2 px-4 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Set Call Sign
          </button>
        </form>
      </div>
    </div>
  );
}
```

---

## 🟢 Database: SQL for call_sign Column

### Execute in Supabase SQL Editor (After full schema deployment)
```sql
-- Add call_sign to student table
ALTER TABLE public.student 
ADD COLUMN IF NOT EXISTS call_sign TEXT UNIQUE;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_student_call_sign 
ON public.student(call_sign);

-- Verify it worked
SELECT 
  column_name, 
  data_type,
  is_nullable 
FROM information_schema.columns 
WHERE table_name = 'student' 
AND column_name = 'call_sign';
```

---

## Environment Variable Templates

### Local Development (.env.local)
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://bbrheacetxlnqbibjwsz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE

# URLs for Auth Gateway
AUTH_URL=auth.localhost.localdomain
DASHBOARD_URL=dashboard.localhost.localdomain:3001
ROOT_URL=localhost.localdomain
PROTOCOL=http://

# URLs for Dashboard
DASHBOARD_URL=dashboard.localhost.localdomain
AUTH_URL=auth.localhost.localdomain:3000
ROOT_URL=localhost.localdomain
PROTOCOL=http://
```

### Production (.env.production)
```env
# Supabase (same)
NEXT_PUBLIC_SUPABASE_URL=https://bbrheacetxlnqbibjwsz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE

# Production URLs
AUTH_URL=auth.edl-platform.vercel.app
DASHBOARD_URL=dashboard.edl-platform.vercel.app
ROOT_URL=edl-platform.vercel.app
PROTOCOL=https://
```

---

## Verification Commands

### After Database Deployment
```bash
# Run Reality Agent with known credentials
SUPABASE_URL="https://bbrheacetxlnqbibjwsz.supabase.co" \
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE" \
python3 reality/agent-reality-auditor/supabase-connector/quickstart.py
```

### After Local Code Setup
```bash
# Test auth gateway
curl -I http://auth.localhost.localdomain:3000

# Test dashboard
curl -I http://dashboard.localhost.localdomain:3001
```

---

**IMPORTANT**: These fixes are the MINIMUM required for the platform to work. Without them, authentication will fail completely.