---
created: '2025-08-23'
domain: core
priority: P1
purpose: 'Document future session workflow: auth/dashboard completion'
session: '00057'
status: current
title: 'Future Session Workflow: Auth/Dashboard Completion'
topics:
- auth
- session-log
- documentation
type: guide
---

# Future Session Workflow: Auth/Dashboard Completion
**Created**: Session 00057  
**Context**: Backup-centric truth hierarchy established  
**Current Issue**: Signup works, but no profile creation → no dashboard redirect  

## Current State Diagnosis (Session 57 Analysis)

### 🚨 Auth Flow Blockage
```
WORKING:    User signup + email verification (port :3000)
BROKEN:     Profile auto-creation after auth
MISSING:    Dashboard redirect (port :3001) 
ROOT CAUSE: Missing auth trigger `on_auth_user_created` + `public.add_new_user()`
```

### 📊 Backup Analysis Results
```
ULTIMATE TRUTH (Backup File):
- 66 tables, 73 functions, 12 schemas
- Contains: on_auth_user_created TRIGGER
- Contains: public.add_new_user() FUNCTION  
- Contains: Complete auth → profile → dashboard logic

CURRENT EXTRACTION (Migration Batches):
- 17 tables (25.4%), 16 functions (21.9%) 
- 24.0% completeness vs backup
- MISSING: Auth triggers, business logic, complete flow
```

## Future Session Workflow (Backup-Driven Approach)

### Phase 1: Start Every Session with Backup-Centric Analysis (5 minutes)

```bash
# MANDATORY first step for all auth/dashboard work
SUPABASE_URL="https://bbrheacetxlnqbibjwsz.supabase.co" \
SUPABASE_ANON_KEY="eyJh..." \
python3 reality/agent-reality-auditor/supabase-connector/connector.py --level 0.5

# This will show:
# - Current extraction completeness % 
# - Missing tables/functions for auth flow
# - Specific guidance: "Extract X before proceeding"
```

**Expected Output Pattern**:
```json
{
  "extraction_analysis": {
    "completeness_pct": 24.0,
    "missing_from_extraction": {
      "tables": ["sessions", "refresh_tokens", "mfa_factors", ...],
      "functions": ["add_new_user", "handle_auth_user_created", ...]
    }
  },
  "masterplan_guidance": [
    "❌ BLOCKER: Only 24.0% of backup file extracted",
    "→ ACTION: Extract auth triggers before testing signup flow",
    "→ MISSING CRITICAL: on_auth_user_created, public.add_new_user()"
  ]
}
```

### Phase 2: Targeted Auth Flow Extraction (Priority Order)

#### Step 2A: Extract Auth Triggers (HIGHEST PRIORITY)
```bash
# Create new migration batch focused on auth triggers
cat > migrations/batches/batch-13-auth-triggers.sql << 'EOF'
-- Extract from backup: on_auth_user_created trigger
CREATE OR REPLACE FUNCTION public.add_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profile (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.email
  );
  
  INSERT INTO public.student (user_id, division, exp, level)
  VALUES (
    NEW.id,
    'VILLIGER'::public.division,
    0,
    1
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.add_new_user();
EOF

# Deploy immediately
psql $DATABASE_URL < migrations/batches/batch-13-auth-triggers.sql
```

#### Step 2B: Extract Auth Session Tables (MEDIUM PRIORITY)  
```bash
# Extract missing auth-related tables from backup
grep -A 20 "CREATE TABLE.*sessions" migrations/supabase-project.backup > batch-14-auth-sessions.sql
grep -A 20 "CREATE TABLE.*refresh_tokens" migrations/supabase-project.backup >> batch-14-auth-sessions.sql
```

#### Step 2C: Extract Dashboard Tables (LOWER PRIORITY)
```bash  
# Extract remaining UI/UX tables for full dashboard functionality
# These can wait until core auth flow works
```

### Phase 3: Test-Driven Verification (After Each Extraction)

#### Step 3A: Verify Auth Trigger Deployment
```bash
# Test the specific broken flow
SUPABASE_URL="https://bbrheacetxlnqbibjwsz.supabase.co" \
SUPABASE_ANON_KEY="eyJh..." \
python3 -c "
from supabase import create_client
client = create_client('https://...', 'eyJh...')

# Test signup → profile creation
try:
    # This should now work after trigger deployment
    result = client.auth.sign_up({
        'email': 'test-session58@example.com',
        'password': 'TestPassword123!'
    })
    
    if result.user:
        user_id = result.user.id
        print(f'✅ User created: {user_id}')
        
        # Check if profile auto-created
        profile = client.table('profile').select('*').eq('id', user_id).execute()
        if profile.data:
            print('✅ Profile auto-created by trigger')
        else:
            print('❌ Profile not created - trigger still missing')
    
except Exception as e:
    print(f'Auth flow test: {e}')
"
```

#### Step 3B: Verify Dashboard Flow  
```bash
# Test complete signup → dashboard flow
# 1. Signup on :3000
# 2. Email verify 
# 3. Auto-redirect to :3001
# 4. Dashboard loads profile data
```

### Phase 4: Incremental Completion Strategy

#### Completion Targets (Based on Backup Analysis)
```
Current:    24.0% extracted
Target 1:   40.0% (Auth flow working) 
Target 2:   60.0% (Basic dashboard working)
Target 3:   80.0% (Full feature parity)
Target 4:   95.0+ (Production ready)
```

#### Session-by-Session Roadmap
```
Session 58: Extract auth triggers → Test signup flow → Target 35%
Session 59: Extract auth sessions → Test persistent login → Target 45%  
Session 60: Extract chat tables → Test basic chat → Target 55%
Session 61: Extract debate tables → Test debate system → Target 70%
Session 62: Extract storage → Test file uploads → Target 85%
Session 63: Polish + testing → Production readiness → Target 95%
```

## Specific Guidance for Current Signup Issue

### Immediate Fix (Next Session Priority)

1. **Run Backup Analysis First** (confirms 24% completeness)
2. **Extract Missing Auth Trigger** from backup file:
   ```sql
   -- This exact code is IN the backup file
   CREATE TRIGGER on_auth_user_created
     AFTER INSERT ON auth.users  
     FOR EACH ROW EXECUTE FUNCTION public.add_new_user();
   ```
3. **Deploy Trigger** to database
4. **Test Flow**: Signup should now create profile automatically
5. **Verify Dashboard Redirect** works

### Success Criteria
- ✅ New user signup creates profile automatically  
- ✅ Dashboard :3001 can load user data
- ✅ Complete flow: signup → verify → profile → dashboard
- ✅ Backup analysis shows 35%+ extraction completeness

## Pattern for All Future Auth/Dashboard Work

### The New Session Start Protocol
```bash
# 1. Reality check with backup analysis (MANDATORY)
./scripts/00028-session-start.sh

# 2. Check extraction completeness 
python3 reality/agent-reality-auditor/supabase-connector/connector.py --level 0.5

# 3. Get specific guidance from enhanced agent
# Agent will say: "Extract X, Y, Z before proceeding with auth work"

# 4. Follow agent guidance (backup-driven priorities)
# 5. Deploy extraction
# 6. Test specific flow 
# 7. Verify with backup analysis again (should show increased %)
```

### No More "Blind Development"
- ❌ OLD: Build features without knowing what's missing
- ✅ NEW: Extract from backup → Deploy → Test → Measure completeness

### Quality Gates
- **30%+ extraction**: Basic auth flow can work
- **50%+ extraction**: Dashboard functionality possible  
- **80%+ extraction**: Full feature parity
- **95%+ extraction**: Production deployment ready

## Critical Success Factors

### 1. Always Start with Backup Reality
- Never assume what's deployed without checking backup completeness
- Use enhanced Supabase Agent for authoritative guidance
- Let backup analysis drive extraction priorities

### 2. Test Early and Often
- After each batch extraction, test specific user flows
- Verify triggers, functions, business logic work end-to-end
- Don't extract blindly - validate each addition

### 3. Incremental Progress Tracking
- Each session should increase completeness percentage
- Document what specific functionality each extraction unlocks
- Maintain feature-to-extraction mapping

## Expected Outcome

Following this workflow, future sessions will:

1. **Know exactly what's missing** (backup analysis)
2. **Extract systematically** (priority-driven)  
3. **Test immediately** (validate each step)
4. **Track progress accurately** (completeness %)
5. **Reach production readiness** (95%+ extraction)

**Result**: No more "it worked before but broke" - sustainable, backup-driven development that builds toward complete feature parity.