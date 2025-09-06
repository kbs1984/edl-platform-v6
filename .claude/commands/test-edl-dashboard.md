# Test EDL Dashboard Application

Run comprehensive tests on the EDL Dashboard application:

## 1. User Authentication Flow
- Navigate to http://localhost:3001
- Test signup with new email
- Verify email confirmation (if enabled)
- Test login with credentials
- Check session persistence
- Test logout functionality

## 2. Student Dashboard Features
- **Onboarding Flow**
  - Complete student profile
  - Select school
  - Add guardian connection
  - Verify data saves to Supabase

- **Friend System**
  - Send friend request
  - Accept/reject requests
  - View friends list
  - Test chat functionality

- **Team Management**
  - Create a new team
  - Invite team members
  - Join existing team
  - View team dashboard

## 3. Guardian Features
- Switch to guardian view
- View student profiles
- Check payment methods
- Review activity logs

## 4. Admin Dashboard (http://localhost:3002)
- View telemetry data
- Check user metrics
- Monitor API performance
- Review error logs
- Verify real-time updates

## 5. Database Integration
- Verify all CRUD operations
- Test RLS policies
- Check data consistency
- Monitor query performance

## 6. Performance Checks
- Measure page load times
- Check bundle sizes
- Test lazy loading
- Verify image optimization
- Monitor memory usage

## 7. Error Scenarios
- Test with network offline
- Invalid data submission
- Session timeout handling
- API error responses
- Rate limiting (if implemented)

Generate a comprehensive report with:
- Screenshots of each major flow
- Performance metrics
- Console errors/warnings
- Network request analysis
- Recommendations for improvements