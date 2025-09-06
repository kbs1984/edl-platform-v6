---
session: "00118"
type: "design"
status: "in-progress"
created: "2025-08-30"
modified: "2025-08-30"
title: "Admin Dashboard for Platform Instrumentation"
purpose: "Design and implement admin monitoring dashboard for EDL platform telemetry"
topics: ["admin", "dashboard", "monitoring", "instrumentation", "telemetry"]
priority: "P1"
domain: "reconciliation"
implements: ["platform-monitoring"]
---

# Admin Dashboard for Platform Instrumentation

## Overview
Building a comprehensive admin dashboard to monitor all platform usage and telemetry data for the EDL Platform v6.

## Architecture

### 1. Data Collection Layer
- **Event Tracking**: Capture all user interactions
- **API Telemetry**: Monitor all API calls via Supabase Edge Functions
- **Database Activity**: Track queries, mutations, and performance
- **Auth Events**: Monitor login/logout, signup, password resets
- **Error Tracking**: Capture and categorize all errors

### 2. Storage Strategy
```sql
-- Telemetry tables to create
CREATE TABLE IF NOT EXISTS telemetry.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type TEXT NOT NULL,
    event_name TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    session_id TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    path TEXT,
    duration_ms INTEGER
);

CREATE TABLE IF NOT EXISTS telemetry.api_calls (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    endpoint TEXT NOT NULL,
    method TEXT NOT NULL,
    status_code INTEGER,
    user_id UUID REFERENCES auth.users(id),
    request_body JSONB,
    response_time_ms INTEGER,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS telemetry.errors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    error_type TEXT NOT NULL,
    error_message TEXT,
    stack_trace TEXT,
    user_id UUID REFERENCES auth.users(id),
    context JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS telemetry.performance_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    metric_type TEXT NOT NULL,
    metric_value NUMERIC,
    unit TEXT,
    context JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3. Admin Dashboard Structure
```
reconciliation/active-work/admin-dashboard/
├── src/
│   ├── app/
│   │   ├── (admin-pages)/
│   │   │   ├── layout.tsx          # Admin layout with auth check
│   │   │   ├── page.tsx            # Dashboard overview
│   │   │   ├── users/              # User management
│   │   │   ├── telemetry/          # Event tracking view
│   │   │   ├── api-monitor/        # API monitoring
│   │   │   ├── errors/             # Error tracking
│   │   │   ├── performance/        # Performance metrics
│   │   │   └── reports/            # Analytics reports
│   │   └── api/
│   │       ├── telemetry/          # Telemetry endpoints
│   │       └── admin/              # Admin-only endpoints
│   ├── components/
│   │   ├── charts/                 # Data visualization
│   │   ├── metrics/                # Metric cards
│   │   └── tables/                 # Data tables
│   └── lib/
│       ├── telemetry/              # Telemetry utilities
│       └── admin/                  # Admin utilities
```

## Key Features

### 1. Real-Time Monitoring
- Live user activity feed
- Active session tracking
- Current API load
- Error rate monitoring
- Performance alerts

### 2. User Analytics
- User growth trends
- Retention metrics
- Engagement patterns
- Feature adoption
- User journey mapping

### 3. System Health
- Database performance
- API response times
- Error rates by type
- Resource utilization
- Uptime monitoring

### 4. Business Metrics
- Registration funnel
- Feature usage
- User segments
- Platform adoption

### 5. Admin Tools
- User management
- Content moderation
- System configuration
- Alert management
- Report generation

## Implementation Plan

### Phase 1: Core Infrastructure (Session 118)
1. Set up admin dashboard Next.js app
2. Create telemetry database schema
3. Implement basic event tracking
4. Build authentication for admin access

### Phase 2: Data Collection
1. Add telemetry hooks to existing apps
2. Create Edge Functions for data collection
3. Implement error tracking
4. Add performance monitoring

### Phase 3: Dashboard UI
1. Build overview dashboard
2. Create user analytics views
3. Add API monitoring interface
4. Implement error tracking UI
5. Build performance metrics views

### Phase 4: Advanced Features
1. Add real-time updates via websockets
2. Implement alerting system
3. Create custom reports
4. Add data export capabilities

## Security Considerations

1. **Admin Authentication**: Separate admin role with strict access control
2. **Data Privacy**: PII handling and compliance
3. **Rate Limiting**: Prevent telemetry spam
4. **Data Retention**: Configurable retention policies
5. **Audit Logging**: Track all admin actions

## Technology Stack

- **Frontend**: Next.js 14 App Router
- **UI Components**: shadcn/ui + Tailwind CSS
- **Charts**: Recharts or Chart.js
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime
- **Authentication**: Supabase Auth with admin role
- **Deployment**: Vercel

## Success Metrics

1. Complete visibility into platform usage
2. < 100ms telemetry event processing
3. Real-time dashboard updates
4. Comprehensive error tracking
5. Actionable performance insights

## Next Steps

1. Create admin dashboard Next.js app structure
2. Set up telemetry database schema
3. Implement basic authentication
4. Build dashboard overview page
5. Add first telemetry collection endpoint