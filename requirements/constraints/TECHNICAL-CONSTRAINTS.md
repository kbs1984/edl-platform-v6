---
session: "unknown"
type: "requirements"
status: "current"
created: "2025-08-23"
title: "Technical Constraints & Requirements"
purpose: "Document technical constraints & requirements"
topics: ['auth', 'database', 'requirements']
priority: "P1"
domain: "requirements"
---

# Technical Constraints & Requirements

**Session**: 00018  
**Purpose**: Document technical, security, and compliance constraints  
**Sources**: Extracted from Sessions 01-17 and platform requirements

---

## Database Constraints (Supabase)

### Row Level Security (RLS) Requirements
**Source**: Session 12 - SUPABASE-SQL-PROTOCOL.md

1. **Mandatory RLS on All Tables**
   - Every table MUST have RLS enabled
   - No public tables without access control
   - Default deny policy (explicit allow required)

2. **RLS Pattern Requirements**
   ```sql
   -- Correct pattern (Session 12)
   CREATE POLICY "policy_name" ON table_name
   TO authenticated  -- Use TO clause for roles
   USING (auth.uid() = user_id)  -- Read access
   WITH CHECK (auth.uid() = user_id);  -- Write access
   ```

3. **Authentication Context**
   - Use `auth.uid()` not `current_user`
   - Use `auth.jwt()` for additional claims
   - Role checking via `auth.jwt()->>'role'`

4. **Policy Types Required**
   - SELECT policies (data visibility)
   - INSERT policies (creation rights)
   - UPDATE policies (modification rights)
   - DELETE policies (removal rights)

5. **Common Patterns**
   - Users see own data: `auth.uid() = user_id`
   - Team members see team data: `EXISTS (SELECT 1 FROM team_members...)`
   - Public profiles: `true` for SELECT only
   - Supervisors see supervised users: Complex JOIN

### Database Design Constraints

1. **Schema Requirements**
   - Use `profiles` not `profile` (Session 11 lesson)
   - UUID primary keys for all tables
   - Timestamps (created_at, updated_at) on all tables
   - Soft deletes preferred (deleted_at column)

2. **Referential Integrity**
   - Foreign keys with CASCADE or RESTRICT
   - No orphaned records allowed
   - Proper indexes on foreign keys

3. **Performance Constraints**
   - Indexes on all WHERE clause columns
   - Composite indexes for multi-column queries
   - EXPLAIN ANALYZE before production
   - Query timeout: 5 seconds default

---

## Security Constraints

### Authentication & Authorization

1. **Password Requirements**
   - Minimum 8 characters
   - At least 1 uppercase, 1 lowercase, 1 number
   - Special characters encouraged
   - No common passwords (top 10,000 list)
   - Password history (last 5 cannot reuse)

2. **Session Management**
   - Default session: 24 hours
   - Remember me: 30 days maximum
   - Refresh tokens required
   - Logout must invalidate all tokens
   - Concurrent session limit: 5 devices

3. **Two-Factor Authentication**
   - Required for Supervisors
   - Optional for Players
   - SMS or authenticator app
   - Backup codes provided
   - Recovery process defined

### Data Protection

1. **Encryption Requirements**
   - TLS 1.3 for all connections
   - Database encryption at rest
   - Sensitive fields encrypted (SSN, payment)
   - No credentials in logs
   - Environment variables for secrets

2. **API Security**
   - Rate limiting: 100 requests/minute default
   - API keys rotatable
   - CORS properly configured
   - Input validation on all endpoints
   - SQL injection prevention (prepared statements)

3. **File Upload Constraints**
   - Maximum file size: 10MB (images), 25MB (documents)
   - Allowed types: JPG, PNG, PDF, DOCX
   - Virus scanning required
   - Stored in secure cloud storage
   - Pre-signed URLs for access

---

## Child Safety Requirements

### 100% Coverage Mandate
**Critical**: Platform serves grades 4-12 (ages 9-18)

1. **Content Moderation**
   - All user-generated content moderated
   - Automated flagging for inappropriate content
   - Human review within 24 hours
   - Immediate blocking of detected threats

2. **Communication Controls**
   - No private messaging between adults and minors
   - Team communications visible to supervisors
   - Parent/guardian notification options
   - Report button on all content

3. **Data Privacy (COPPA/FERPA)**
   - Parental consent for under 13
   - Educational records protection
   - Limited data collection from minors
   - No behavioral advertising
   - Data deletion upon request

4. **Supervisor Verification**
   - Background check required
   - Institution verification
   - Reference checks
   - Annual recertification
   - Immediate revocation capability

5. **Age-Appropriate Features**
   - Grade-level content filtering
   - Age-appropriate imagery only
   - No external links without verification
   - Safe search enforced

---

## Performance Constraints

### Response Time Requirements

1. **Page Load Times**
   - Homepage: < 2 seconds
   - Dashboard: < 3 seconds
   - API responses: < 1 second
   - Search results: < 2 seconds
   - File uploads: Progress indicator required

2. **Scalability Requirements**
   - Support 10,000 concurrent users minimum
   - Auto-scaling for traffic spikes
   - Database connection pooling
   - CDN for static assets
   - Queue system for heavy operations

3. **Availability Requirements**
   - 99.9% uptime SLA
   - Planned maintenance windows only
   - Graceful degradation
   - Disaster recovery plan
   - Data backup every 6 hours

### Resource Constraints

1. **Browser Support**
   - Chrome 90+ 
   - Firefox 88+
   - Safari 14+
   - Edge 90+
   - Mobile browsers (iOS Safari, Chrome Mobile)

2. **Device Requirements**
   - Responsive design (mobile-first)
   - Minimum screen: 320px width
   - Touch-friendly interfaces
   - Offline capability for mobile app
   - Progressive Web App support

3. **Bandwidth Considerations**
   - Image optimization required
   - Lazy loading for content
   - Pagination for large lists
   - Video streaming adaptive bitrate
   - Minimal initial bundle size (<500KB)

---

## Platform-Specific Constraints

### Supabase Limitations

1. **Free Tier Limits** (if applicable)
   - 500MB database
   - 2GB bandwidth
   - 50,000 monthly active users
   - 1GB file storage

2. **Technical Limitations**
   - No stored procedures in JavaScript
   - RLS performance impact
   - Realtime subscriptions limit
   - Connection pool maximum

### Vercel Constraints

1. **Deployment Limits**
   - Function timeout: 10 seconds (hobby), 60 seconds (pro)
   - API response size: 4.5MB
   - Static file: 100MB maximum
   - Build time: 45 minutes maximum

2. **Edge Function Constraints**
   - No native Node.js APIs
   - 1MB code size limit
   - 128MB memory limit
   - Regional deployment only

---

## Integration Constraints

### Third-Party Services

1. **Email Service**
   - SendGrid/Postmark required
   - Transactional emails only
   - Rate limits apply
   - Template management needed
   - Bounce handling required

2. **Payment Processing**
   - Stripe/PayPal integration
   - PCI compliance required
   - Webhook handling needed
   - Reconciliation process
   - Refund capability

3. **Analytics & Monitoring**
   - GDPR-compliant analytics only
   - No tracking without consent
   - Error monitoring (Sentry)
   - Performance monitoring (DataDog)
   - Custom events limited

### API Rate Limits

1. **External API Calls**
   - OpenAI: 60 requests/minute
   - Google OAuth: 10,000/day
   - Email service: 100/second
   - SMS service: 1/second
   - Weather/location: 1000/day

---

## Compliance Constraints

### Legal Requirements

1. **Data Residency**
   - US data stays in US
   - EU data stays in EU (GDPR)
   - Canada data requirements
   - No data in restricted countries

2. **Accessibility (WCAG 2.1 AA)**
   - Color contrast ratios: 4.5:1 minimum
   - Keyboard navigation complete
   - Screen reader compatible
   - Captions for video
   - Alternative text for images

3. **Educational Compliance**
   - FERPA compliance for records
   - State education regulations
   - Homeschool support needed
   - Grade-level standards alignment

### Audit Requirements

1. **Logging Requirements**
   - All authentication attempts
   - Data modifications
   - Permission changes
   - File access
   - API calls
   - 90-day retention minimum

2. **Reporting Requirements**
   - Monthly security reports
   - Incident reporting within 72 hours
   - Compliance audits quarterly
   - User activity reports
   - Performance metrics dashboard

---

## Development Constraints

### Code Quality Requirements

1. **Testing Coverage**
   - Unit tests: 80% minimum
   - Integration tests: Critical paths
   - E2E tests: User journeys
   - Performance tests: Load scenarios
   - Security tests: Penetration testing

2. **Code Standards**
   - ESLint/Prettier configured
   - TypeScript strict mode
   - No any types
   - Comments for complex logic
   - API documentation required

3. **Version Control**
   - Git flow branching
   - Pull request reviews required
   - No direct commits to main
   - Semantic versioning
   - Changelog maintenance

### Deployment Constraints

1. **Environment Requirements**
   - Development, staging, production
   - Environment parity required
   - Secrets management (Vault/AWS Secrets)
   - Infrastructure as code
   - Rollback capability

2. **CI/CD Requirements**
   - Automated testing on PR
   - Build must pass before merge
   - Automated deployment to staging
   - Manual approval for production
   - Deployment notifications

---

## Known Limitations to Address

### From Previous Sessions

1. **Session 11 Discovery**
   - Canvas has 7,023 nodes (complexity)
   - Profile vs profiles naming issue
   - Schema evolution needed

2. **Session 12-15 Issues**
   - RLS policies initially broken
   - auth.uid() vs current_user confusion
   - Massive uncommitted work accumulation

3. **Architecture Decisions**
   - Three-domain architecture (constitutional)
   - Reality Agents for verification
   - No premature optimization (Lightning Stack)

---

## Migration Constraints

### From v5 (When Located)

1. **Data Migration**
   - Preserve user accounts
   - Maintain team relationships
   - Convert emCoin balances
   - Archive old activities
   - Map deprecated features

2. **Feature Parity**
   - Core features must work
   - Performance must improve
   - UX must be simplified
   - Mobile must be prioritized
   - Security must be enhanced

---

## Summary of Critical Constraints

### Non-Negotiable Requirements
1. ✅ Child safety (100% coverage)
2. ✅ RLS on all database tables
3. ✅ WCAG 2.1 AA accessibility
4. ✅ 99.9% uptime
5. ✅ < 3 second page loads
6. ✅ Data encryption
7. ✅ Supervisor verification
8. ✅ COPPA/FERPA compliance
9. ✅ Password security
10. ✅ Audit logging

### Performance Targets
- 10,000 concurrent users
- 100 requests/minute rate limit
- 5 second query timeout
- 500KB initial bundle
- 90-day log retention

### Technical Decisions
- Supabase for backend
- Vercel for hosting
- React/Next.js for frontend
- TypeScript throughout
- PostgreSQL database

---

**Document Status**: Complete
**Next Steps**: Search for v5 codebase if time permits