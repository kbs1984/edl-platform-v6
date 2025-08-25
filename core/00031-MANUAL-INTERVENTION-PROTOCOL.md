---
session: '00031'
type: protocol
status: current
created: '2025-08-23'
title: Manual Intervention Protocol v1.0
purpose: Document manual intervention protocol v1.0
topics:
- auth
- database
- protocol
priority: P1
domain: core
lifecycle: 'ON'
---

# Manual Intervention Protocol v1.0

**Session 00031 - Workflow Optimization**  
**Created**: 2025-08-18  
**Purpose**: Establish clear protocol for when manual steps are required in the development workflow

## Protocol Overview

This protocol defines when and how to transition from autonomous Claude Code verification to manual intervention, ensuring efficient development cycles and preventing workflow confusion.

## Trigger Conditions for Manual Intervention

### 🔴 Immediate Manual Required
These conditions require immediate human intervention:

1. **Browser-based functionality testing**
   - User interface interactions (clicks, form submissions)
   - Visual layout verification
   - Cross-browser compatibility
   - JavaScript runtime behavior in browser

2. **External service integration**
   - Email delivery testing
   - OAuth provider configuration
   - Third-party API testing
   - Payment gateway integration

3. **Database mutations with real data**
   - User account creation
   - Profile creation with actual users
   - Production data modifications
   - RLS policy testing with authenticated contexts

4. **Infrastructure configuration**
   - Supabase dashboard settings
   - Environment variable configuration
   - DNS/domain setup
   - SSL certificate management

### 🟡 Manual Preferred
These tasks can be partially automated but benefit from human verification:

1. **Performance testing**
   - Load testing under realistic conditions
   - Mobile device testing
   - Network condition simulation

2. **Security validation**
   - Penetration testing
   - Access control verification
   - Data privacy compliance

3. **User experience validation**
   - Accessibility testing
   - Usability flow verification
   - Error message clarity

## Protocol Execution Steps

### Step 1: Autonomous Verification (Claude Code)
Run the comprehensive autonomous verification:

```bash
# Use the autonomous verification script
SUPABASE_URL="your_url" SUPABASE_ANON_KEY="your_key" python3 scripts/auth-autonomous-verification.py
```

**Verification Scope:**
- File structure and syntax
- Database schema and connectivity
- Configuration validation
- Code logic verification
- API structure testing

### Step 2: Manual Transition Checklist
When autonomous verification passes, generate manual testing requirements:

1. **Review Generated Checklist**
   - Check `MANUAL-TESTING-CHECKLIST.md`
   - Identify critical vs nice-to-have items
   - Estimate testing time required

2. **Prepare Testing Environment**
   - Ensure test accounts are available
   - Verify email access for testing
   - Clear browser cache/cookies
   - Document baseline state

3. **Execute Manual Tests**
   - Follow checklist systematically
   - Document results for each item
   - Record any issues discovered
   - Note configuration changes made

### Step 3: Issue Resolution Protocol

#### For Issues Found During Manual Testing:

**Code Issues** → Return to Claude Code
- Syntax errors, logic bugs, missing features
- Configuration file updates
- Database query improvements
- Frontend validation enhancements

**Configuration Issues** → Manual Resolution Required
- Supabase dashboard settings
- Email provider configuration  
- Environment variables
- DNS/SSL setup

**Integration Issues** → Hybrid Approach
- Claude Code: API structure and logic
- Manual: Actual service testing and configuration

### Step 4: Documentation and Handoff

1. **Update Session Log**
   - Record manual testing results
   - Document configuration changes
   - Note any remaining issues

2. **Update INDEX Files** (MANDATORY)
   - `SYSTEM-INDEX.md` - Update system health, new tools
   - Domain INDEX files - Update completion status
   - `CLAUDE.md` - Add new tools or protocol changes
   - Include session number and brief description

3. **Maintain Living Documentation**
   - Update `WORKFLOW-BOUNDARIES.md` if new capabilities discovered
   - Enhance protocol documents if improvements identified
   - Version bump relevant documents with changes

4. **Create Next Session Handoff**
   - List remaining tasks
   - Specify what was manually verified
   - Reference updated documentation
   - Highlight any blockers or dependencies

## Example Workflow: Session 00031 Auth Testing

### ✅ Autonomous Verification Complete
- File structure: All auth files exist
- Database schema: Profiles and teams tables verified
- Configuration: Supabase credentials correct
- Code logic: All auth flows implemented
- **Result**: Ready for manual testing

### 🔄 Manual Testing Required
Following `MANUAL-TESTING-CHECKLIST.md`:

1. **Browser Testing** (Human Required)
   - Sign up with real email
   - Test password reset email delivery
   - Verify call sign real-time checking
   - Test role selection and profile creation

2. **Configuration** (Human Required)
   - Verify JWT timeout setting in Supabase dashboard
   - Test actual email delivery
   - Confirm session behavior

3. **Results Documentation** (Human Required)
   - Document what works/doesn't work
   - Record specific error messages
   - Note configuration changes made

### 🔄 Issue Resolution Examples

**If browser testing reveals JavaScript error:**
- → Return to Claude Code for fixing
- → Re-run autonomous verification
- → Repeat manual testing

**If email delivery fails:**
- → Manual Supabase email configuration
- → Test with different email providers
- → Document exact settings used

**If JWT timeout is wrong:**
- → Manual dashboard configuration change
- → Test actual timeout behavior
- → Document setting for future reference

## Tools and Scripts

### Claude Code Autonomous Tools
- `scripts/auth-autonomous-verification.py` - Complete autonomous auth testing
- `scripts/00028-reality-check.sh` - System health verification
- `scripts/structure-check.sh` - File structure validation

### Manual Testing Tools
- `auth/test.html` - Browser-based auth testing interface
- `MANUAL-TESTING-CHECKLIST.md` - Systematic manual testing guide
- Browser developer tools for debugging

## Success Criteria

### Autonomous Phase Success
- ✅ All files exist and have correct syntax
- ✅ Database schema matches requirements
- ✅ Configuration values are correct
- ✅ Code logic implements required features
- ✅ No structural or logical errors found

### Manual Phase Success
- ✅ All user-facing functionality works in browser
- ✅ External integrations function correctly
- ✅ Configuration settings produce expected behavior
- ✅ Data operations work with real user accounts
- ✅ Performance and security requirements met

### Overall Workflow Success
- ✅ Clear boundary between autonomous and manual work
- ✅ Efficient transition between phases
- ✅ Complete documentation of both phases
- ✅ No work duplication or gaps
- ✅ Next session has clear starting point

## Version History

- **v1.0** (Session 00031): Initial protocol based on auth testing workflow analysis

---

**Note**: This protocol should be referenced at the start of every session involving feature testing to ensure proper workflow separation and efficiency.