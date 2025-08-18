
## Manual Testing Checklist - Session 00031

### 🌐 Browser Testing (CANNOT be done autonomously)
- [ ] Sign up with real email address
- [ ] Email confirmation process
- [ ] Sign in with created account  
- [ ] Password reset email delivery
- [ ] Password reset email link functionality
- [ ] Profile creation form submission
- [ ] Call sign real-time availability checking
- [ ] Role selection and grade level assignment
- [ ] Session timeout behavior (30 minutes)
- [ ] Cross-browser compatibility (Chrome, Firefox, Safari)

### 🗄️ Database Testing (CANNOT be done autonomously)  
- [ ] Profile creation with real user data
- [ ] Call sign uniqueness constraint enforcement
- [ ] RLS policy verification with authenticated users
- [ ] Data persistence across sessions
- [ ] Role-based access control testing

### ⚙️ Configuration Testing (CANNOT be done autonomously)
- [ ] JWT timeout setting verification (target: 30 minutes)
- [ ] Email template customization in Supabase
- [ ] Production environment variable configuration
- [ ] Deployment verification on live domain

### 📧 Integration Testing (CANNOT be done autonomously)
- [ ] Email delivery to real email addresses
- [ ] Email content and formatting verification
- [ ] Password reset link expiration (24 hours)
- [ ] OAuth provider integration (if applicable)
