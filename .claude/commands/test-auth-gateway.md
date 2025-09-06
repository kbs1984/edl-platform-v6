# Test EDL Auth Gateway

Run comprehensive tests on the Auth Gateway application:

## 1. Authentication Pages
- Navigate to http://localhost:3000
- Test `/login` page rendering
- Test `/sign-up` page rendering
- Verify form validation works
- Check error message display

## 2. Signup Flow
- Fill out signup form with valid data
- Submit and verify Supabase user creation
- Check for confirmation email (if enabled)
- Verify redirect to dashboard
- Test with duplicate email (should fail)

## 3. Login Flow
- Test with valid credentials
- Verify JWT token in cookies
- Check redirect to intended page
- Test "Remember me" functionality
- Verify session persistence

## 4. Password Reset
- Navigate to forgot password
- Submit reset request
- Check email delivery
- Test reset link functionality
- Verify new password works

## 5. OAuth Integration (if configured)
- Test Google OAuth
- Test GitHub OAuth
- Verify profile data mapping
- Check first-time vs returning user

## 6. Security Testing
- Test SQL injection attempts
- Verify XSS protection
- Check CSRF tokens
- Test rate limiting
- Verify secure headers

## 7. API Endpoints
- Test `/api/auth/signup`
- Test `/api/auth/login`
- Test `/api/auth/logout`
- Test `/api/auth/refresh`
- Verify proper error codes

## 8. Edge Cases
- Expired tokens
- Invalid tokens
- Concurrent sessions
- Browser back button after logout
- Multiple tabs behavior

Generate report including:
- Security vulnerabilities found
- Performance bottlenecks
- UX improvements needed
- Code quality issues