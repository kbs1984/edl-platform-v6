# Test Admin Dashboard Telemetry

Comprehensive testing of the Admin Dashboard telemetry system:

## 1. Telemetry Collection
- Navigate to http://localhost:3002
- Open browser DevTools Network tab
- Perform actions in dashboard
- Verify telemetry events are sent to `/api/telemetry/event`
- Check event payloads contain correct data

## 2. Event Types Testing
- **Page Views**
  - Navigate between pages
  - Verify page_view events fire
  - Check path and metadata accuracy

- **User Actions**
  - Click buttons and links
  - Verify action events captured
  - Check custom metadata included

- **Errors**
  - Trigger deliberate errors
  - Verify error events sent
  - Check stack traces included

- **Performance**
  - Check performance metrics collected
  - Verify timing data accuracy
  - Test metric aggregation

## 3. Dashboard Metrics
- Verify user count matches database
- Check active users calculation (24h)
- Validate event counts
- Test error rate calculation
- Monitor real-time updates (30s intervals)

## 4. Chart Functionality
- Verify charts update every 5 seconds
- Check data accuracy
- Test chart interactions (hover, click)
- Verify no hydration errors

## 5. Database Verification
```sql
-- Check telemetry tables
SELECT COUNT(*) FROM telemetry.events;
SELECT COUNT(*) FROM telemetry.api_calls;
SELECT COUNT(*) FROM telemetry.errors;
SELECT COUNT(*) FROM telemetry.sessions;

-- Verify RLS policies
-- Should fail (insert-only for users)
SELECT * FROM telemetry.events LIMIT 10;
```

## 6. Session Management
- Check session ID persistence
- Verify session tracking across refreshes
- Test session timeout handling
- Monitor session storage

## 7. Performance Testing
- Measure dashboard load time
- Check telemetry endpoint response time
- Monitor memory usage over time
- Test with high event volume

## 8. Integration Testing
- Add telemetry to auth-gateway
- Verify events from other apps appear
- Test cross-app session tracking
- Check data consistency

Generate detailed report with:
- Telemetry coverage gaps
- Performance metrics
- Data accuracy verification
- Security recommendations