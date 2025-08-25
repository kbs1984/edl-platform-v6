---
created: '2025-08-23'
domain: reconciliation
priority: P1
purpose: Document 00.01_executive-summary
session: '25050'
status: current
title: 00.01_EXECUTIVE-SUMMARY
topics:
- database
- documentation
type: guide
---

EDL 00_PROJECT-OVERVIEW/

# 00.01_EXECUTIVE-SUMMARY
EDL Project Executive Summary (v3)

## 0. 00.01 Table of Contents

1. Project Overview
2. System Architecture
   2.1 Foundation
   2.2 Frontend
   2.3 Backend Components
   2.4 Architecture Diagram
3. Core User Types
4. Key Feature Areas
5. Database Structure
   5.1 Core Tables
   5.2 Schema Organization
   5.3 Key Relationships
6. Implementation Timeline
7. Integration Points
   7.1 Noodl ↔ Supabase
   7.2 n8n ↔ Supabase
   7.3 NextJS ↔ Supabase
   7.4 Toss Payments ↔ Supabase
8. Supabase-Specific Advantages

## 1. Project Overview

EDL (EMD Debate League) is an online platform that facilitates debate competitions using different formats, both synchronous and asynchronous. The platform enables:
- Team formation and management
- Match arrangement between teams
- Debate activity registration 
- Judging, scoring, and feedback
- Performance analytics and learning insights

## 2. System Architecture

### 2.1 Foundation
- **Supabase**: The cornerstone of EDL's architecture, providing a comprehensive PostgreSQL-based foundation that powers all database operations, authentication, storage, and real-time capabilities

### 2.2 Frontend
- **Primary Framework**: Noodl - A low-code development platform that integrates directly with Supabase
- **Secondary Framework**: NextJS/Tailwind - For specific student/player pages, connecting to the Supabase backend
- **Integration Pattern**: Nextjs/Tailwind for Students/Players; Noodl for Guardians/Enablers - both consuming the same Supabase services

### 2.3 Backend Components
- **Database**: Supabase PostgreSQL with multi-schema architecture (`public` and `debate` schemas)
- **Authentication**: Supabase Auth with JWT-based session management
- **Storage**: Supabase Storage for video and file management
- **Security**: Row-Level Security (RLS) policies implemented directly in Supabase
- **Workflow Automation**: n8n workflows that leverage Supabase APIs
- **Payment Processing**: Toss Payments integrated via n8n and Supabase

### 2.4 Architecture Diagram
```
┌───────────────────────────────────────────┐
│                                           │
│               Client Layer                │
│                                           │
│  ┌─────────────┐        ┌──────────────┐  │
│  │   Noodl     │        │ NextJS/      │  │
│  │ Components  │        │ Tailwind     │  │
│  └─────────────┘        └──────────────┘  │
│                                           │
└───────────────┬───────────────┬───────────┘
                │               │
                ▼               ▼
┌───────────────────────────────────────────┐
│                                           │
│            Supabase Foundation            │
│                                           │
│  ┌─────────────┐        ┌──────────────┐  │
│  │ PostgreSQL  │        │  Supabase    │  │
│  │ Database    │◄──────►│  Auth        │  │
│  └─────────────┘        └──────────────┘  │
│                                           │
│  ┌─────────────┐        ┌──────────────┐  │
│  │ Supabase    │        │  Row-Level   │  │
│  │ Storage     │        │  Security    │  │
│  └─────────────┘        └──────────────┘  │
│                                           │
│  ┌─────────────┐        ┌──────────────┐  │
│  │ Real-time   │        │  Edge        │  │
│  │ Updates     │        │  Functions   │  │
│  └─────────────┘        └──────────────┘  │
│                                           │
└───────────────┬───────────────┬───────────┘
                │               │
                ▼               ▼
┌───────────────────────────────────────────┐
│                                           │
│          Integration Services             │
│                                           │
│  ┌─────────────┐        ┌──────────────┐  │
│  │    n8n      │        │   Toss       │  │
│  │  Workflows  │        │  Payments    │  │
│  └─────────────┘        └──────────────┘  │
│                                           │
└───────────────────────────────────────────┘
```

## 3. Core User Types
1. **Students/Players**: Debate participants
2. **Guardians/Parents**: Oversee student activities and handle payments
3. **Enablers**: Educators who serve as judges, coaches, etc.
4. **Administrators**: Platform managers

## 4. Key Feature Areas

1. **Authentication & User Management**
   - Multi-role authentication via Supabase Auth
   - Profile management with direct database connections
   - Role-based permissions enforced through Row-Level Security

2. **Team Management**
   - Team creation and editing stored in Supabase tables
   - Member recruitment through the platform
   - Team availability and preferences

3. **Activity Management**
   - Debate scheduling (synchronous & asynchronous)
   - Format configuration (EMD, WSDC, etc.)
   - Registration processes

4. **Debate Chamber**
   - Format-specific interfaces
   - Speech recording & playback via Supabase Storage
   - Turn management leveraging Supabase real-time features

5. **Judging System**
   - Ballot generation
   - Scoring criteria
   - Feedback mechanisms with video timestamp integration

6. **Payment & Subscription**
   - Toss Payments integration
   - Subscription management
   - Payment reporting

7. **Analytics & Reporting**
   - Performance analytics
   - Learning insights
   - Operational metrics

## 5. Database Structure

### 5.1 Core Tables
- **profile**: Central user information
- **student/guardian/judge**: Role-specific data
- **team/team_member**: Team management
- **debate_session/debate_participant**: Activity framework
- **debate_speech/debate_ballot**: Performance data

### 5.2 Schema Organization
- **public schema**: User management, team organization, and general platform structures
- **debate schema**: Formats, rounds, motions, evaluation systems, and debate content

### 5.3 Key Relationships
- Users have specific roles (student, guardian, judge) with Supabase RLS protecting role-based access
- Students may belong to multiple teams through foreign key relationships
- Guardians can oversee multiple students with proper RLS policies
- Teams participate in debate sessions with comprehensive audit trails
- Judges evaluate debates through ballots secured by Supabase RLS

## 6. Implementation Timeline
- **Current Phase**: Infrastructure setup, authentication, and team management using Supabase schema
- **Next Phase**: Debate activity management, chamber interfaces, and judging
- **Final Phase**: Payment integration and analytics

## 7. Integration Points

### 7.1 Noodl ↔ Supabase
- **Direct Connection**: Noodl components utilize the Supabase JavaScript client
- **Authentication Flow**: Seamless user authentication via Supabase Auth
- **Data Operations**: All database operations pass through the Supabase client
- **Real-time Features**: Debate state synchronization via Supabase's real-time subscriptions
- **Storage Integration**: Video and file management through Supabase Storage

```javascript
// Example: Noodl component connecting to Supabase
const supabase = Noodl.Variables.supabase;

async function fetchDebateData(debateId) {
  const { data, error } = await supabase
    .from('debate.debates')
    .select(`
      id,
      mode,
      status,
      teams:debate_teams(*)
    `)
    .eq('id', debateId);
  
  if (error) throw error;
  return data;
}
```

### 7.2 n8n ↔ Supabase
- **Service Role Access**: n8n workflows utilize Supabase service roles for administrative operations
- **Webhook Integration**: Workflows triggered by Supabase database events
- **Batch Processing**: Complex operations executed via n8n with direct Supabase connections
- **Security Implementation**: JWT verification and service role separation

```javascript
// Example: n8n Function node connecting to Supabase
const { data, error } = await $supabase
  .from('debate.ballots')
  .update({ status: 'COMPLETE' })
  .eq('id', $input.item.ballotId);
```

### 7.3 NextJS ↔ Supabase
- **API Integration**: NextJS pages connect to Supabase via the JavaScript client
- **Authentication Management**: Shared authentication schema with Supabase Auth
- **SSR Integration**: Server-side rendering with Supabase data
- **Client-Side Features**: Real-time features using Supabase subscriptions

### 7.4 Toss Payments ↔ Supabase
- **Transaction Recording**: Payment data stored directly in Supabase
- **Webhook Processing**: Payment confirmations processed via n8n and stored in Supabase
- **Subscription Management**: Recurring payments tracked in Supabase tables

## 8. Supabase-Specific Advantages

1. **Row-Level Security**: Fine-grained access control at the database level
2. **Real-time Subscriptions**: Live updates for synchronous debates
3. **PostgreSQL Power**: Advanced query capabilities for complex debate operations
4. **Multi-Schema Architecture**: Logical separation of concerns
5. **Built-in Auth**: Seamless authentication with JWT-based sessions
6. **Storage Integration**: Integrated file and video management
7. **Edge Functions**: Serverless functionality for specialized operations

This executive summary highlights Supabase as the foundation of the EDL platform, emphasizing how its features are leveraged throughout the architecture and integration points.