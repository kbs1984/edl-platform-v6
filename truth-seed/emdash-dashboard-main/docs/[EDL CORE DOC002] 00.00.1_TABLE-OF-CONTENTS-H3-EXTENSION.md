EDL 00_PROJECT-OVERVIEW/

00.00.1_TABLE-OF-CONTENTS-EXTENSION
Grand Total: 710P

# 00_PROJECT-OVERVIEW/
| 9P | Project foundation & architecture principles

## | 2P | [003] 00.01_EXECUTIVE-SUMMARY
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

## | 1P | [004] 00.02_CONSTITUTIONAL-FRAMEWORK
1. Core Principles
2. Implementation Standards
3. Documentation Requirements
4. Terminology Alignment

## | 1P | [005] 00.03_ARCHITECTURE-PRINCIPLE
1. Overview
2. Core Architectural Principles
   2.1 Supabase-First Architecture
   2.2 Separation of Concerns
   2.3 Dependency Inversion
   2.4 Simplicity and Minimalism
   2.5 Schema Organization and Cross-Schema Relationships
3. Security Principles
   3.1 Row-Level Security (RLS)
   3.2 Authentication and Authorization
4. Data Management Principles
   4.1 Data as an Asset
   4.2 Real-time Data Synchronization
5. Development Principles
   5.1 Iterative Development
   5.2 Performance by Design
6. Integration Principles
   6.1 Component-Based Architecture
   6.2 Technology Integration
7. Conclusion

## | 3P | [006] 00.04_USER-TYPES-AND-ROLES
1. Overview
2. Core User Types
   2.1 Students/Players
   2.2 Guardians/Parents
   2.3 Enablers/Judges
   2.4 Administrators
3. Role-Based Access Control
   3.1 Authentication and Role Assignment
   3.2 Row-Level Security Implementation
4. User Registration and Role Assignment
   4.1 Registration Flow
   4.2 Role-Specific Onboarding
5. UI Customization by Role
   5.1 Role-Based Navigation
   5.2 Feature Access Control
6. Role-Specific Workflows
   6.1 Student Workflows
   6.2 Guardian Workflows
   6.3 Judge Workflows
   6.4 Administrator Workflows
7. Implementation Guidelines
   7.1 User Type Identification
   7.2 Role-Based Route Protection
8. Conclusion

## | 2P | [007] 00.05_SYSTEM-INTEGRATION-UPDATE
1. Introduction
   1.1 Purpose
   1.2 Scope
   1.3 Document Status
2. Current Implementation Status
   2.1 Feature Development Progress
   2.2 Database Structure Verification
   2.3 Integration Points
3. Multi-Schema Architecture
   3.1 Public Schema Overview
   3.2 Debate Schema Overview
   3.3 Cross-Schema Relationships
   3.4 Schema Naming in Queries
4. Implementation Action Plan
   4.1 Critical Changes
   4.2 Assigned Responsibilities
   4.3 Timeline
5. Integration Patterns
   5.1 Cross-Schema Query Patterns
   5.2 Noodl Implementation Examples
   5.3 n8n Workflow Considerations
6. Testing Protocol
   6.1 Integration Test Cases
   6.2 Validation Procedures
   6.3 Success Criteria
7. Next Steps
   7.1 Component Development Priorities
   7.2 Future Integration Milestones
   7.3 Next Review Date


# 01_DATABASE-ARCHITECTURE/
| 20P | Supabase database

## | 9P | [008] 01.01_SCHEMA-DOCUMENTATION
1. Introduction
   1.1 Purpose of this document
   1.2 Schema organization overview
   1.3 How to use this reference
2. Schema Architecture
   2.1 Public Schema (user data, teams, etc.)
   2.2 Debate Schema (formats, rounds, judging)
   2.3 Cross-Schema Relationships
   2.4 Authentication Schema Integration
3. Debate Format System
   3.1 Core Components
        Formats (debate_formats)
        Round Templates (round_templates)
        Format Rounds (format_rounds)
        Sides (sides)
   3.2 Implementation Guidelines
        Creating a new debate format
        Configuring round sequences
        Managing format-specific rules
   3.3 Code Examples
        Querying available formats
        Format detail retrieval with rounds
        Round sequence management
4. Debate Management
   4.1 Core Components
        Debates (debates)
        Debate Teams (debate_teams)
        Debate Participants (debate_participants)
   4.2 Implementation Guidelines
        Creating synchronous vs. asynchronous debates
        Managing team assignments
        Participant invitations and confirmations
   4.3 Code Examples
        Creating a new debate
        Adding teams and participants
        Handling invitations
5. Speech and Content Management
   5.1 Core Components
        Speeches (speeches)
        Videos (videos)
   5.2 Implementation Guidelines
        Managing speech content
        Video storage and retrieval
        Synchronous vs. asynchronous speech handling
   5.3 Code Examples
        Recording speeches
        Uploading videos
        Retrieving speech content
6. Judging and Evaluation System
   6.1 Core Components
        Criteria (criteria)
        Judge Comments (judge_comments)
        Judge Scores (judge_scores)
   6.2 Implementation Guidelines
        Implementing the three criteria groups
        Managing score submissions
        Video timestamp-linked feedback
   6.3 Code Examples
        Submitting scores
        Adding timestamped comments
        Retrieving judging results
7. Content Management
   7.1 Core Components
        Genres (genres)
        Motion Categories (motion_categories)
        Motions (motions)
   7.2 Implementation Guidelines
        Managing debate topics
        Genre and category organization
   7.3 Code Examples
        Creating and retrieving motions
        Topic filtering
        Genre-based organization
8. Cross-Schema Operations
   8.1 User Integration
        Linking debate participants to students
        Judge authorization and access
        Content ownership and attribution
   8.2 Implementation Guidelines
        Proper cross-schema joins
        Performance considerations
        Data consistency requirements
   8.3 Code Examples
        Cross-schema queries in Noodl
        Cross-schema operations in n8n
        Error handling for cross-schema operations
9. Performance Considerations
   9.1 Indexing Strategy
        Existing indexes and their purpose
        When to use which index
        Potential performance bottlenecks
   9.2 Query Optimization
        Best practices for Noodl queries
        Best practices for n8n workflows
        Handling large result sets
10. Development Workflows
   10.1 Schema Change Management
        Process for introducing schema changes
        Testing impact on existing components
        Migration planning
   10.2 Supabase-Specific Development Practices
        Leveraging Supabase features
        Client-side optimizations
        Server-side optimizations
11. Appendices
   11.1 Complete Schema Reference
        Detailed table definitions, relationships, and constraints
   11.2 Common Query Templates
        Standard operations
        Join patterns
        Full examples
12. Schema Diagrams
   12.1 Entity Relationship Diagrams
        Public Schema Overview
        Debate Schema Overview
        Cross-Schema Relationships
   12.2 Table Relationship Maps
        Format System Relationships
        Judging System Relationships
   12.3 Schema Generation Commands
13. Supabase-Specific Features
   13.1 Row-Level Security (RLS)
   13.2 Real-time Subscriptions
   13.3 Storage Integration
   13.4 Edge Functions
14. Conclusion

## | 4P | [009] 01.02_DATABASE-FOUNDATION
1. Overview
   1.1 Architecture Goals
   1.2 Architecture Components
2. Schema Structure Patterns
   2.1 User Management
   2.2 Team Management
   2.3 Activity Management
   2.4 Schema Organization Principles
3. Query Pattern Examples
   3.1 Basic Record Retrieval
   3.2 Including Related Objects
   3.3 Relationship Queries
   3.4 n8n Workflow Patterns
4. Authentication Implementation
   4.1 User Creation
   4.2 Session Management
   4.3 Role-Based Access
   4.4 Password Reset Flow
5. Implementation Timeline
   5.1 Phase 1: Foundation (2 weeks)
   5.2 Phase 2: Auth & Core Tables (3 weeks)
   5.3 Phase 3: Team & Activity Tables (4 weeks)
   5.4 Phase 4: Content & Evaluation (3 weeks)
6. n8n Workflow Examples
   6.1 User Management Workflow
   6.2 Team Management Workflow
   6.3 Debate Activity Workflow
7. Testing & Quality Assurance
   7.1 Data Integrity Validation
   7.2 Functional Testing
   7.3 Performance Testing
   7.4 Security Testing
8. Operational Procedures
   8.1 Backup Procedures
   8.2 Recovery Procedures
   8.3 Incident Response Plan
   8.4 Response Testing
9. User Experience Considerations
   9.1 Performance Perception
   9.2 Support Planning
10. Conclusion
   10.1 Success Criteria
   10.2 Long-term Optimization

## | 3P | [010] 01.03.CROSS-SCHEMA-INTEGRATION
1. Overview
2. Schema Organization
   2.1 Public Schema
   2.2 Debate Schema
3. Cross-Schema Query Patterns
   3.1 User Participation Query
   3.2 Judge Evaluation Query
4. Common Integration Challenges
   4.1 Schema Prefix Requirements
   4.2 Foreign Key Navigation
   4.3 Performance Considerations
5. Leveraging Supabase-Specific Features for Cross-Schema Operations
   5.1 Real-time Subscriptions for Cross-Schema Data
   5.2 Using RLS Policies for Cross-Schema Security
   5.3 Optimized Cross-Schema Queries in Noodl
6. Advanced Patterns for Cross-Schema Integration
   6.1 Using PostgreSQL Views for Complex Cross-Schema Queries
   6.2 Transaction Management Across Schemas
   6.3 Performance Optimization for Cross-Schema Queries
7. Error Handling for Cross-Schema Operations
8. Conclusion

## | 3P | [011] 01.04_ROW-LEVEL-SECURITY
1. Overview
2. Core Security Principles
3. RLS Policy Examples
   3.1 User Profile Security
   3.2 Team Security
   3.3 Debate Participation Security
   3.4 Judge Evaluation Security
4. Application Security Patterns
   4.1 Service Roles vs. User JWT
   4.2 Implementing JWT Verification in n8n
   4.3 Role-Based Access Control
5. Common Security Pitfalls
   5.1  Security Best Practices
6. Implementing RLS in Noodl
7. Advanced RLS Scenarios
   7.1  Schema-Level Permissions
   7.2 Time-Based Access
   7.3 Dynamic Access Control
8. Testing RLS Policies
   8.1 Policy Verification in Supabase
   8.2 Automated Testing with n8n
9. Conclusion

## | 1P | [012] 01.05_TEXT-BASED-SCHEMA-VISUALS
1. Table Relationship Diagrams
   1.1 Format System
   1.2 Evaluation System
   1.3 User Management
2. Cross-Schema Relationships
3. Critical Path Diagrams
   2.1 Debate Creation Flow
   2.2 Judging Flow


# 02_IMPLEMENTATION-PATTERNS/
| 23P | Core implementations across the platform

## | 8P | [013] 02.01_NOODL-COMPONENT-LIBRARY
1. Overview
2. Component Organization
3. Core UI Components
   3.1 Button Component
   3.2 Input Component
   3.3 Card Component
4. Integration with Supabase Backend
   4.1 Supabase Client Setup
   4.2 Data Query Component
   4.3 Data Mutation Component
   4.4 Real-time Subscription Component
5. Authentication Components
   5.1 Sign Up Component
   5.2 Sign In Component
   5.3 User Session Component
   5.4 Role-Based Access Control Component
6. Data Components
   6.1 Cross-Schema Query Component
   6.2 Storage Component
   6.3 Debate Data Component
   6.4 User Profile Component
7. Layout Components
   7.1 Responsive Container Component
   7.2 Grid Layout Component
8. Navigation Components
   8.1 Navigation Bar Component
   8.2 Tab Navigation Component
9. Debate-Specific Components
   9.1 Debate Format Selector Component
   9.2 Motion Selector Component
   9.3 Debate Timer Component
10. Using the Component Library
   10.1 Component Import Pattern
   10.2 Authentication Flow Example
   10.3 Data Management Example
   10.4 Component Composition Guidelines
11. Performance Best Practices
   11.1 Data Fetching Optimization
   11.2 Real-time Subscription Guidelines
12. Troubleshooting
   12.1 Common Issues
   12.2 Error Handling Pattern
13. Conclusion

## | 4P | [014] 02.02_NOODL-N8N-INTEGRATION
1. Overview
2. Noodl Supabase Integration
   2.1 Setting Up Supabase Client
   2.2 Noodl Query Patterns
   2.3 Cross-Schema Access Pattern
   2.4 Real-time Subscriptions
3. n8n Integration Patterns
   3.1 n8n Webhook Node Setup
   3.2 Noodl to n8n Connection
   3.3 n8n Supabase Integration
   3.4 Security Patterns
4. Advanced Noodl-n8n Integration Patterns
   4.1 Robust Webhook Handling in Noodl
   4.2 State Synchronization with Supabase
   4.3 Critical Operation Patterns
5. Supabase Authentication Integration
   5.1 Noodl Authentication Components
   5.2 Authentication Session Management
6. Best Practices and Guidelines

## | 7P | [015] 02.03_AUTH-AND-USER-FLOW 
1. Overview
   1.1 Purpose
   1.2 Architecture Integration
2. Authentication Architecture
   2.1 Authentication Components
   2.2 Role-Based Authentication
   2.3 Supabase Auth Integration
3. Authentication Flow Implementation
   3.1 Supabase Client Setup
   3.2 User Registration Flow
   3.3 User Authentication Flow
   3.4 Session Management
   3.5 Role-Based Access Control
4. User Onboarding Journeys
   4.1 Registration Journey Maps
        Student/Player Path
        Guardian Path
        Enabler Path
   4.2 First-time Experience Design
5. Progressive User Experience
   5.1 Feature Discovery Patterns
   5.2 Contextual Help Implementation
   5.3 Feature Unlocking Strategy
   5.4 Complexity Introduction
6. User Engagement Strategy
   6.1 Activation Metrics
   6.2 Engagement Tracking
   6.3 Retention Triggers
   6.4 Milestone Celebrations
7. Integration Points
   7.1 Integration with Row-Level Security (RLS)
   7.2 Integration with Noodl Navigation
   7.3 Integration with n8n Workflows
8. Error Handling and Security
   8.1 Common Authentication Errors
   8.2 Error Handling Pattern
   8.3 Session Token Security
   8.4 Password Security
9. Best Practices
   9.1 Authentication Component Usage
   9.2 User Experience Considerations
10. Conclusion

## | 4P | [016] 2.04_REAL-TIME-FEATURES
1. Overview
2. Supabase Real-time Foundation
    2.1 Supabase Channels and Subscriptions
    2.2 Core Real-time Components
3. Real-time Data Subscriptions
    3.1 Basic Subscription Pattern
    3.2 Filtered Subscriptions
    3.3 Cross-Schema Subscriptions
4. Presence Tracking
    4.1 Basic Presence Implementation
    4.2 Processing Presence State
5. State Synchronization
    5.1 Synchronous Debate State
    5.2 Timer Synchronization for Live Debates
    5.3 Asynchronous Debate State
6. Notification System
    6.1 Real-time Notifications with Supabase
    6.2 Turn Notifications for Asynchronous Debates
7. Synchronous vs. Asynchronous Mode Features
    7.1 Synchronous Mode Real-time Features
    7.2 Asynchronous Mode Real-time Features
8. Real-time UI Considerations
    8.1 Presence Visualization
    8.2 State Change Indicators
    8.3 Connection Status Management
9. Performance Considerations
    9.1 Subscription Optimization
    9.2 Debouncing UI Updates
10. Testing Real-time Features
    10.1 Subscription Testing Strategy
    10.2 Testing Tools
11. Conclusion

# 03_CORE-FEATURES/ 
| 8P | Key functionality implemenation guide

## | 4P | [017] 03.01_DEBATE-FORMAT-SYSTEM.md
1. Overview
2. System Components
   2.1 Debate Formats (`debate_formats`)
   2.2 Round Templates (`round_templates`)
   2.3 Format Rounds (`format_rounds`)
   2.4 Sides (`sides`)
3. Implementation Patterns
   3.1 Creating a Debate Format
   3.2 Retrieving Format Structure
   3.3 Managing Round Sequences
4. Format-Specific Rules Implementation
   4.1 EMD (Emdash Debate) Format
   4.2 WSDC (World Schools Debate Championship) Format
5. Integration with Debate Chamber
   5.1 Format-Based Chamber Configuration
   5.2 Format-Specific UI Adaptations
6. Format-Specific Judging Configuration
   6.1 Ballot Templates
   6.2 Format-Specific Criteria
7. Creating Format-Specific Analytics
   7.1 Format Performance Analysis
   7.2 Comparing Format Performance
8. Maintaining Format System
   8.1 Adding New Formats
   8.2 Modifying Existing Formats
9. Best Practices
10. Conclusion

## | 4P | [018] 03.02_SYNC-VS-ASYC-DEBATES
1. Overview
2. Database Structure
   2.1 Debate Mode Configuration
   2.2 Asynchronous Debate Tracking
   2.3 Speech Management
3. Implementation Patterns
   3.1 Debate Creation
   3.2 Synchronous Debate Management
   3.3 Asynchronous Turn Management
   3.4 UI Differentiation
      3.4.1 Synchronous Debate UI
      3.4.2 Asynchronous Debate UI
4. Real-Time Features with Supabase
   4.1 Synchronous Debate Real-Time Updates
   4.2 Asynchronous Notification System
5. Submission and Playback
   5.1 Asynchronous Speech Submission
   5.2 Synchronous vs. Asynchronous Playback
6. Conclusion


# 03.03_DEBATE-CHAMBER/ .1_ARCHITECTURE/ 
| 9P | Chamber implementation foundation

## | 2P | [019] 03.03.1.1_CHAMBER-OVERVIEW
1. Introduction
2. Chamber Purpose and Scope
3. High-Level Component Structure
    3.1 Chamber Interface
    3.2 Format Controller
    3.3 Video Manager
    3.4 Participation Manager
    3.5 Evaluation Interface
4. Component Relationships and Interactions
    4.1 State-Driven Interactions
    4.2 Event-Based Communication
    4.3 Data Flow
5. Mode-Specific Architecture
    5.1 Synchronous Mode Architecture
    5.2 Asynchronous Mode Architecture
6. Integration Points
    6.1 Format System Integration
    6.2 Evaluation System Integration
    6.3 User Management Integration
    6.4 Analytics System Integration
7. Conclusion

## | 3P | [020] 03.03.1.2_SUPABASE-INTEGRATION
1. Introduction
2. Core Supabase Features Utilized
   2.1 Supabase Database Operations
   2.2 Real-Time Subscriptions
   2.3 Supabase Storage Integration
   2.4 Row-Level Security (RLS)
3. Database Integration Patterns
   3.1 Debate State Management
   3.2 Participant Presence System
   3.3 Video Storage Integration
   3.4 Cross-Schema Query Patterns
4. Key Data Objects and Relationships
   4.1 Primary Data Structures
   4.2 Database Relationships
5. State Synchronization Patterns
   5.1 Initial State Loading
   5.2 Real-Time State Updates
   5.3 Optimized Data Access Patterns
6. Chamber Mode-Specific Integration
   6.1 Synchronous Debate Integration
   6.2 Asynchronous Debate Integration
7. Security Implementation
   7.1 Row-Level Security Policies
   7.2 Client-Side Security Implementation
8. Performance Optimization
   8.1 Query Optimization
   8.2 Real-Time Optimization
   8.3 Storage Optimization
9. Integration with Other Systems
   9.1 Evaluation System Integration
   9.2 n8n Workflow Integration
10. Conclusion

## | 4P | [021] 03.03.1.3_COMPONENT-ARCHITECTURE
1. Introduction
2. Component Hierarchy
   2.1 Core Component Types
3. Responsibility Separation
   3.1 ChamberRoot
   3.2 SynchronousChamber / AsynchronousChamber
   3.3 EvaluationPanel
   3.4 Video Management Components
4. Component Interaction Patterns
   4.1 Event-Based Communication
   4.2 Shared State Management
   4.3 Parent-Child Prop Passing
   4.4 Controller-Based Interaction
5. Role-Based Component Rendering
   5.1 Participant View
   5.2 Judge View
   5.3 Spectator View
6. Format-Specific Component Adaptations
   6.1 Format Component Factory
   6.2 Format Controller Integration
7. Cross-Device Component Considerations
   7.1 Responsive Layout Components
   7.2 Device Capability Adaptation
8. Error Handling and Recovery
   8.1 Component-Level Error Boundaries
   8.2 Supabase Connection Recovery
9. Performance Optimization Strategies
   9.1 Selective Rendering
   9.2 Lazy Loading
   9.3 Optimized Data Fetching
10. Testing and Quality Assurance
   10.1 Component Testing
   10.2 Integration Testing
11. Conclusion


# 03.03_DEBATE-CHAMBER/ .2_STATE-MANAGEMENT/
| 15P | Debate states across participants

## | 3P | [022] 03.03.2.1_SUPABASE-DRIVEN-STATE
1. Overview
2. Core Principles
3. Implementation Pattern
   3.1 State Initialization and Synchronization
   3.2 Initial State Fetching
   3.3 Mode-Specific State Setup
4. Component Lifecycle Management
   4.1 Setup and Cleanup
   4.2 Component Integration
5. Schema-Aware State Management
   5.1 Cross-Schema Queries
   5.2 State Normalization
6. State Change Handlers
   6.1 Debate State Changes
   6.2 Speech Updates
7. Performance Considerations
   7.1 Optimizing Real-time Subscriptions
   7.2 State Caching
8. Error Handling
   8.1 Subscription Error Handling
   8.2 State Recovery
9. Best Practices
10. Integration with Other Components

## | 4P | [023] 03.03.2.2_PRESENCE-USER-STATE
1. Overview
2. Core Principles
3. Implementation Pattern
   3.1 Setting Up Presence Tracking
   3.2 User Role Determination
   3.3 Presence State Management
   3.4 User Status Updates
4. Role-Based UI Customization
5. Participant Activity Indicators
6. Connection Management and Recovery
7. Optimization for Multiple Devices
8. Privacy and Security Considerations
9. Integration with the UI
   9.1 Participant Roster Component
   9.2 Judge Roster Component
10. Best Practices
11. Integration with Other Components

## | 8P | [024] 03.03.2.3_STATE-CHANGE-HANDLERS
1. Overview
2. Core Principles
3. Implementation Pattern
   3.1 Setting Up State Change Handlers
   3.2 Debate State Change Handler
   3.3 Speech Updates Handler
   3.4 Presence Change Handler
   3.5 UI State Change Handler
4. Mode-Specific Handlers
   4.1 Synchronous Mode Handlers
   4.2 Asynchronous Mode Handlers
5. Component Lifecycle Management
   5.1 Setup and Cleanup 
   5.2 Handler Error Handling
6. Performance Considerations
   6.1 Debouncing State Change Handlers
   6.2 Batch Processing
   6.3 Minimizing Supabase Queries
7. Integration with Event Buses
   7.1 Debate Chamber Event Bus 
   7.2 Supabase Real-time Updates Integration
8. Role-Based State Handling
   8.1 Judge-Specific State Handlers
   8.2 Participant-Specific State Handlers
9. State Change Testing and Debugging
   9.1 Event Logging
   9.2 State Verification Utilities
10. Documentation and Best Practices
   10.1 State Change Handler Documentation
   10.2 Best Practices Summary


# 03.03_DEBATE-CHAMBER/ .3_MEDIA-COMPONENTS/
| 29P | Video & audio for speeches

## | **10P** | [025] 03.03.3.1_STORAGE-INTEGRATION
1. Overview
2. Core Principles
3. Storage Structure
   3.1 Bucket Organization
   3.2 File Naming Conventions
4. Implementation Patterns
   4.1 Video Upload Implementation
   4.2 Speech Submission with Video Upload
   4.3 Database Schema for Video Storage
5. Access Control and Security
   5.1 Row-Level Security for Videos
   5.2 Storage Bucket Policies
6. Video Retrieval
   6.1 Video Playback Integration
   6.2 Speech Timeline Integration
7. Error Handling
   7.1 Storage Operation Error Handling
   7.2 Media Format Validation
8. Performance Optimization
   8.1 Video Encoding Optimization
   8.2 Progressive Loading
9. Cross-Device Compatibility
   9.1 Adaptive Storage Strategy
   9.2 Fallback Mechanisms
10. Integration with Debate Chamber Components
   10.1 Video Storage Component Integration
   10.2 Synchronous Debate Integration
   10.3 Asynchronous Debate Integration
11. Security Considerations
   11.1 Content Validation
   11.2 Access Token Refresh
12. Conclusion

## | **12P** | [026] 03.03.3.2_VIDEO-RECORDING
1. Overview
2. Core Principles
3. Implementation
   3.1 Recording Component Architecture
   3.2 Core Implementation
4. Integration with Supabase Storage
5. Mode-Specific Implementations
   5.1 Synchronous Debate Recording
   5.2 Asynchronous Debate Recording
6. User Interface Integration
   6.1 Video Preview Component
   6.2 Recording Timer Component
7. Error Handling
   7.1 Permission Errors
   7.2 Recording Errors
   7.3 Upload Errors
8. Cross-Device Optimization
   8.1 Device-Specific Implementations
   8.2 Bandwidth Adaptation
9. Integration with Debate Modes
   9.1 Synchronous Mode Integration
   9.2 Asynchronous Mode Integration
10. Performance Considerations
   10.1 Memory Management
   10.2 Battery Optimization
11. Accessibility Considerations
   11.1 Keyboard Controls
   11.2 Audio Indicators
12. Testing and Verification
   12.1 Browser Compatibility
   12.2 Camera and Microphone Testing
13. Conclusion

## | 7P | [027] 03.03.3.3_VIDEO-PLAYBACK
1. Overview
2. Architecture Principles
3. Component Structure
   3.1 Core Functionality
   3.2 Implementation Dependencies
4. Implementation Pattern
   4.1 Core Video Playback Implementation
   4.2 Feedback Integration
   4.3 Playback UI Integration
5. Custom Features
   5.1 Feedback Markers UI
   5.2 Feedback Popup Display
6. Integration with Debate Chamber
   6.1 Video Loading from Supabase
   6.2 Playback in Synchronous vs. Asynchronous Debates
   6.3 Judge Evaluation Integration
7. Performance Optimization
   7.1 Video Loading Strategies
   7.2 Adaptive Playback Quality
8. Error Handling and Recovery
   8.1 Robust Error Handling
   8.2 Recovery Strategies
9. Cross-Device Compatibility
   9.1 Device-Specific Optimizations
   9.2 Responsive Interface
10. Integration Examples
   10.1 Basic Video Playback Integration
   10.2 Judge Feedback Integration
11. Testing and Quality Assurance
   11.1 Testing Protocols
   11.2 Quality Metrics
12. Conclusion


# 03.03_DEBATE-CHAMBER/ .4_DATA-PATTERNS/
| 20P | Data access patterns for chamber

## | 5P | [028] 03.03.4.1_SUPABASE-QUERY-PATTERNS
1. Overview
2. Core Principles
3. Basic Query Structure
   3.1 Standard Query Format
   3.2 Single Record Queries
   3.3 Maybe Single Record Queries
4. Relationship Queries
   4.1 Parent-to-Child Relationships
   4.2 Cross-Schema Relationships
   4.3 Multi-Level Relationships
5. Filtering and Constraints
   5.1 Basic Filtering
   5.2 Multiple Conditions
   5.3 Complex Filtering with `.filter()`
   5.4 Range Filtering
6. Result Processing
   6.1 Ordering Results
   6.2 Pagination
   6.3 Result Counting
7. Data Modification
   7.1 Inserting Records
   7.2 Updating Records
   7.3 Upserting Records
   7.4 Deleting Records
8. Advanced Query Patterns
   8.1 Parallel Requests
   8.2 Data Caching
   8.3 Lazy Loading
9. Storage Operations
   9.1 File Upload
   9.2 File Retrieval
10. Real-time Data Subscriptions
   10.1 Table Subscriptions
   10.2 Multiple Channel Subscriptions
   10.3 Handling Different Event Types
11. Best Practices and Optimization
   11.1 Field Selection
   11.2 Batch Operations
   11.3 Error Handling Patterns
12. Schema-Specific Patterns
   12.1 Public Schema Queries
   12.2 Debate Schema Queries
   12.3 Cross-Schema Query Examples
13. Supabase-Specific Features
   13.1 Foreign Key Navigations
   13.2 JSON Operations
14. Common Pitfalls and Solutions
   14.1 Missing Schema Prefixes
   14.2 Over-fetching Data
   14.3 Inadequate Error Handling
15. Conclusion

## | 7P | [029] 03.03.4.2_REALTIME-SUBSCRIPTIONS
1. Overview
2. Core Principles
3. Implementation Pattern
   3.1 Setting Up Real-Time Subscriptions
   3.2 Domain-Specific Channel Handlers
   3.3 Role-Specific Subscriptions
   3.4 Presence Tracking
4. Mode-Specific Subscription Patterns
   4.1 Synchronous Debate Subscriptions
   4.2 Broadcasting Updates in Synchronous Debates
   4.3 Asynchronous Debate Subscriptions
5. Component Integration
   5.1 Initialization in Components
   5.2 Event-Driven UI Updates
6. Error Handling and Recovery
   6.1 Connection Status Management
   6.2 Error Recovery Strategies
7. Performance Considerations
   7.1 Subscription Optimization
   7.2 Selective Subscription
8. Conclusion

## | 8P | [030] 03.03.4.3_OPTIMIZED-DATA-ACCESS
1. Overview
2. Core Principles
3. Parallel Request Patterns
   3.1 Initial Data Loading
   3.2 Complex Cross-Schema Data
4. Lazy Loading Patterns
   4.1 Speech Data Lazy Loading
   4.2 Participant Detail Loading
   4.3 Trigger-Based Loading
5. Caching Strategies
   5.1 Format Data Caching
   5.2 User Profile Caching
   5.3 Motion and Topic Caching
6. Pagination Strategies
   6.1 Standard Pagination
   6.2 Cursor-Based Pagination
   6.3 Virtual Scrolling Support
7. Query Optimization Techniques
   7.1 Targeted Selection
   7.2 Batched Operations
   7.3 Conditional Loading
   7.4 Efficient Cross-Schema Queries
8. Data Management for Different Debate Modes
   8.1 Synchronous Debate Data Management
   8.2 Asynchronous Debate Data Management
9. Performance Monitoring
   9.1 Query Performance Tracking
   9.2 Optimizing Based on Usage Patterns
10. Cross-Device Optimization
   10.1 Device-Adaptive Loading
   10.2 Batch Prefetching for Offline Support
11. Best Practices Summary


# 03.03_DEBATE-CHAMBER/ .5_CONTROLLERS/
| 15P | Debate flow logic controllers 

## | 7P | [031] 03.03.5.1_SYNCHRONOUS-CONTROLLER
1. Overview
2. Core Principles
3. Controller Initialization
   3.1 Basic Initialization Flow
   3.2 Fetching Format Details
   3.3 Participant Verification
4. Debate State Management
   4.1 Starting the Debate
   4.2 Round Management
5. Timer Management
   5.1 Core Timer Functions
   5.2 Time Notifications
6. Speech Management
   6.1 Current Speaker Tracking
   6.2 Speech Recording
7. Moderator Controls
   7.1 Debate Flow Control
   7.2 Participant Management
8. Controller Integration
   8.1 Initialization and Cleanup
9. Format-Specific Considerations
   9.1 EMD Format
   9.2 WSDC Format
10. Performance Considerations
   10.1 Optimizing Timer Updates
   10.2 State Update Batching
11. Error Handling and Recovery
   11.1 Robust Error Handling
   11.2 State Recovery
12. Integration with the Evaluation System
13. Conclusion and Best Practices
   13.1 Summary
   13.2 Best Practices
   13.3 Next Steps

## | 8P | [032] 03.03.5.2_ASYNCHRONOUS-CONTROLLER
1. Overview
2. Core Principles
3. Initialization
4. State Management
   4.1 Debate State Tracking
   4.2 Turn Management
   4.3 Deadline Tracking
5. Speech Submission
   5.1 Video Recording Integration
   5.2 Submission Process
   5.3 Error Handling
6. Turn Advancement
   6.1 Turn Progression Logic
   6.2 Participant Notification
   6.3 Completion Detection
7. User Interface Integration
   7.1 Turn Status Display
   7.2 Recording Controls
   7.3 Timeline Visualization
8. Supabase Integration
   8.1 Real-time Updates
   8.2 Storage Operations
   8.3 Cross-Schema Queries
9. n8n Workflow Integration
   9.1 Turn Management Workflow
   9.2 Notification Workflow
10. Error Recovery
11. Testing Guidelines


# 03.03_DEBATE-CHAMBER/ .6_SYSTEM-INTEGRATION/
| 28P | Integration between various subsystems

## | 9P | [033] 03.03.6.1_EVALUATION-INTEGRATION
1. Overview
2. Core Integration Principles
3. Database Relationship Structure
4. Integration Implementation Patterns
   4.1 Judge Scoring Interface
   4.2 Connecting Video Content to Feedback
   4.3 Score Synchronization
5. Real-time Evaluation Updates
6. Cross-Component Communication
7. Practical Implementation Examples
8. Best Practices and Optimization

## | **10P** | [034] 03.03.6.2_BALLOT-INTEGRATION
1. Overview
2. Core Integration Principles
3. Chamber-Ballot Data Flow
   3.1 Data Exchange Patterns
   3.2 State Synchronization
   3.3 Real-time Updates
4. Component Integration
   4.1 Judge Interface Integration
   4.2 Video Playback Integration
   4.3 Feedback Marker Integration
5. Implementation Patterns
   5.1 Synchronous Debate Integration
   5.2 Asynchronous Debate Integration
6. API Integration Points
   6.1 n8n Webhook Endpoints
   6.2 Data Format Specifications
7. Security Considerations
   7.1 Access Control Patterns
   7.2 Cross-Component Security
8. Performance Optimization
   8.1 Efficient Data Loading
   8.2 Resource Management

## | 9P | [035] 03.03.6.3_ANALYTICS-INTEGRATION
1. Overview
   1.1 Purpose of analytics integration in the Debate Chamber
   1.2 Key analytics objectives
2. Supabase-First Analytics Architecture
   2.1 Core principles for analytics integration
   2.2 Analytics data sources in Supabase schema
3. Data Collection Patterns
   3.1 Speech performance metrics collection
   3.2 Judge evaluation metrics collection
   3.3 Participation metrics collection
4. Integration with Debate Chamber
   4.1 Real-time analytics updates
   4.2 Cross-schema analytics queries
   4.3 Performance dashboard components
5. Implementation Patterns
   5.1 Noodl components for analytics visualization
   5.2 Integration with evaluation systems
   5.3 n8n workflows for analytics processing
6. User-Specific Analytics Views
   6.1 Participant performance analytics
   6.2 Judge analytics interfaces
   6.3 Admin analytics dashboards
7. Technical Considerations
   7.1 Performance optimization for analytics queries
   7.2 Data privacy and access controls
   7.3 Cross-device analytics support


# 03.03_DEBATE-CHAMBER/ .7.1_FORMAT-ARCHITECTURE/
| 12P | Format specific core architecture 

## | 5P | [036] 03.03.7.1.1_FORMAT-FACTORY
1. Overview
   1.1 Purpose and role in the EDL platform
   1.2 Relationship to other components
2. Architecture Principles
   2.1 Supabase-First Design
   2.2 Factory Pattern Implementation
3. Factory Pattern Implementation
   3.1 Core Factory Structure
   3.2 Format Registration
   3.3 Format Instance Creation
4. Format Interface
   4.1 Standard Format Contract
   4.2 Required Methods and Properties
   4.3 Extension Points
5. Creating Format-Specific Components
   5.1 Component Generation Process
   5.2 Component Configuration
   5.3 Lifecycle Management
6. Integration with Debate Chamber
   6.1 Chamber Component Selection
   6.2 State Management Integration
   6.3 Controller Integration
7. Format-Specific Data Handling
   7.1 Database Queries
   7.2 Real-time Subscriptions
   7.3 State Transformations
8. Testing and Validation
   8.1 Format Validation Strategy
   8.2 Component Testing
   8.3 Integration Testing

## | 7P | [037] 03.03.7.1.2_FORMAT-REGISTRY
1. Overview
2. Registry Architecture
   2.1 Core Components
   2.2 Implementation Pattern
   2.3 Integration with Format Factory
3. Format Registration Process
   3.1 Format Definition Structure
   3.2 Registration Function
   3.3 Format Validation
4. Format Retrieval Patterns
   4.1 Getting Format by ID
   4.2 Format-Specific Component Resolution
   4.3 Performance Considerations
5. Supabase Integration
   5.1 Format Storage and Retrieval
   5.2 Format Cache Management
   5.3 Real-time Format Updates
6. Implementation Examples
   6.1 Basic Format Registry Setup
   6.2 Format Registration
   6.3 Format Component Resolution
7. Integration with Debate Chamber
   7.1 Format-Specific UI Generation
   7.2 Role and Turn Management
   7.3 Format-Specific Settings


# 03.03_DEBATE-CHAMBER/ .7.2_RESPONSIVE-DESIGN/
| 12P | Format specific responsive design

## | 2P | [038] 03.03.7.2.1_LAYOUT-STRATEGY
1. Overview
   1.1 Purpose and scope of format-specific layouts 
   1.2 Integration with Supabase-first architecture
2. Core Layout Principles
   2.1 Responsive design foundation
   2.2 Format-specific adaptation strategy
   2.3 User role considerations in layouts
3. Layout Structure Components
   3.1 Common layout elements across formats
   3.2 Format-specific containers
   3.3 State-responsive layout changes
4. Synchronous vs. Asynchronous Layouts
   4.1 Key differences in layout approaches
   4.2 Mode-specific layout components
   4.3 Transitioning between modes
5. Format-Specific Implementation
   5.1 EMD format layout strategy
   5.2 WSDC format layout strategy
   5.3 Adapting layouts to other formats
6. Device Adaptation
   6.1 Mobile-first considerations
   6.2 Tablet and desktop optimizations
   6.3 Handling device capabilities and limitations
7. Integration with State Management
   7.1 Layout responses to state changes
   7.2 Using Supabase real-time for layout updates
   7.3 Presence-aware layout adjustments

## | **10P** | [039] 03.03.7.2.2_FORMAT-RESPONSIVE-COMPONENTS
1. Overview
2. Core Principles
3. Format-Specific Adaptations
   3.1 EMD Format Responsive Components
   3.2 WSDC Format Responsive Components
   3.3 Other Format Adaptations
4. Implementation Patterns
   4.1 Component Structure
   4.2 Media and Layout Breakpoints
   4.3 Format-Specific Style Application
5. Cross-Device Optimization
   5.1 Mobile Optimization Strategies
   5.2 Desktop Layout Optimization
   5.3 Tablet Considerations
6. State Handling
   6.1 Format-Specific State Management
   6.2 Device-Responsive State Transitions
7. Integration with Chamber Controller
8. Testing and Validation
9. Best Practices


# 03.03_DEBATE-CHAMBER/ .7.3_FORMAT-DATA-MANAGEMENT/
| 20P | Format specific data handling

## | **11P** | [040] 03.03.7.3.1_FORMAT-DATA-FETCHING
1. Overview
2. Core Principles for Format-Specific Data Retrieval
3. Format-Specific Data Models
4. Implementation Patterns
   4.1 Format Configuration Retrieval
   4.2 Format-Specific Query Structures
   4.3 Round Sequence Management
5. Optimized Data Access
   5.1 Caching Strategies for Format Data
   5.2 Lazy Loading Patterns
   5.3 Cross-Format Data Sharing
6. Role-Based Data Access
   6.1 Participant-Specific Data
   6.2 Judge-Specific Data
7. Real-Time Subscriptions for Format Data
8. Best Practices
   8.1 Error Handling
   8.2 Performance Optimization
   8.3 Code Organization

## | 4P | [041] 03.03.7.3.2_FORMAT-VIDEO-STORAGE
1. Overview
   1.1 Purpose of format-specific video storage
   1.2 Relationship to Supabase Storage architecture
2. Format-Specific Storage Requirements
   2.1 Storage patterns by debate format
   2.2 Format-specific metadata requirements
   2.3 Cross-format video compatibility
3. Implementation Patterns
   3.1 Storage path conventions
   3.2 Format-specific file naming
   3.3 Metadata structure
4. Format-Specific Video Processing
   4.1 EMD format video processing
   4.2 WSDC format video processing
   4.3 Other formats processing
5. Integration with Supabase Storage
   5.1 Bucket organization
   5.2 RLS policies for format-specific access
   5.3 Format-specific CDN configuration
6. Best Practices and Optimization
   6.1 Performance considerations
   6.2 Bandwidth optimization strategies
   6.3 Device-specific considerations

## | 5P | [042] 03.03.7.3.3_FORMAT-STATE-MANAGEMENT
1. Overview
2. Core Principles
3. Format-Specific State Structure
   3.1 Common State Properties
   3.2 Format-Specific Extensions
4. State Management Patterns
   4.1 Initialization
   4.2 State Updates
   4.3 Format-Specific Handlers
5. Supabase Integration
   5.1 Format Data Retrieval
   5.2 Real-time State Synchronization
6. Format-Specific UI Adaptation
   6.1 Component Selection
   6.2 Layout Adaptation
7. Performance Considerations
   7.1 State Optimization
   7.2 Selective Updates
8. Best Practices


# 03.03_DEBATE-CHAMBER/ .7.4_FORMAT-IMPLMENTATIONS/
| 20P | Format specific implementation details

## | 7P | [043] 03.03.7.4.1_EMD-FORMAT
1. Format Overview
   1.1 Overview of EMD (Emdash) debate format
   1.2 Key characteristics 
   1.3 Role in the EDL platform
2. Format Structure
   2.1 Format rounds and sequence
   2.2 Speaker roles and positions
   2.3 Time allocations
   2.4 Side configurations
3. Implementing EMD in Debate Chamber
   3.1 Chamber interface components
   3.2 Synchronous vs. asynchronous support
   3.3 Format-specific UI elements
   3.4 Role indicators and user flow
4. Video Management for EMD
   4.1 Recording requirements
   4.2 Playback considerations
   4.3 Storage approach
   4.4 Speech-specific markers
5. Scoring and Evaluation
   5.1 EMD-specific scoring criteria
   5.2 Ballot structure
   5.3 Judge interface modifications
   5.4 Feedback implementation
6. State Management
   6.1 Format-specific state variables
   6.2 Round progression logic
   6.3 Turn management for asynchronous debates
   6.4 Presence indicators
7. Integration Points
   7.1 Connection to ballot system
   7.2 Format conversion capabilities
   7.3 Analytics integration
   7.4 Format extension options

## | 7P | [044] 03.03.7.4.2_WSDC-FORMAT
1. Overview
   1.1 Format Definition
   1.2 Key Characteristics
   1.3 Implementation Goals
2. Database Structure
   2.1 Format Configuration
   2.2 Round Structure
   2.3 Speaker Roles and Positions
   2.4 Scoring and Evaluation Criteria
3. Chamber Interface
   3.1 Synchronous Debate Flow
   3.2 Role-Based Views
   3.3 Timer and Round Management
   3.4 Team Information Display
4. Video Management
   4.1 Recording Configuration
   4.2 Playback Integration
   4.3 Feedback Markers
5. Special Considerations
   5.1 Points of Information
   5.2 Reply Speeches
   5.3 Team Coordination
6. Integration with Evaluation System
   6.1 Ballot Structure
   6.2 Scoring Mechanism
   6.3 Feedback Implementation
7. Performance Consideration
   7.1 Optimized Data Loading
   7.2 Speech Transcript Management
8. Mobile Responsive Design
9. Conclusion

## | 6P | [045] 03.03.7.4.3_OTHER-FORMATS
1. Overview
2. British Parliamentary (BP) Format
   2.1 Format Structure
   2.2 Role Management
   2.3 Implementation Considerations
3. Public Forum (PF) Format
   3.1 Format Structure
   3.2 Turn Management
   3.3 Implementation Considerations
4. Custom Format Implementation
   4.1 Format Factory Pattern
   4.2 Component Inheritance
   4.3 Format Registration
5. Cross-Format Compatibility
   5.1 Common Interface
   5.2 Format-Specific Extensions
   5.3 Performance Considerations
6. Conclusion


# 03.04_BALLOT-SYSTEM/ .1_OVERVIEW/
| 11P | Ballot system architecture

## | 3P | [046] 03.04.1.1_IMPLEMENTATION-PLAN
1. Introduction
   1.1 Purpose and Scope
   1.2 Key User Stories Addressed
2. Database Architecture
   2.1 Core Tables Structure
   2.2 Schema Organization
   2.3 Relationships and Constraints
3. Implementation Phases
   3.1 Phase 1: Core Infrastructure
   3.2 Phase 2: Enhanced Features
   3.3 Phase 3: Advanced Features
4. Component Architecture
   4.1 Ballot Generation Component
   4.2 Scorecard Editor Component
   4.3 Feedback Component
   4.4 Ballot Review and Submission Component
5. Workflow Integration
   5.1 Ballot Generation Workflow
   5.2 Ballot Processing Workflow
   5.3 Analytics Generation Workflow
6. User Flows
   6.1 Judge Ballot Completion Flow
   6.2 Student Review Flow
   6.3 Admin Management Flow
7. Integration Points
   7.1 Debate Chamber Integration
   7.2 Notification System Integration
   7.3 User Dashboard Integration
8. Technical Considerations
   8.1 Performance Optimization
   8.2 Security Implementation
   8.3 Scalability Approach

## | 4P | [047] 03.04.1.2_USER-FLOWS
1. Overview
   1.1 Purpose of User Flows
   1.2 Key User Types
2. Judge/Enabler Ballot Completion Flow
   2.1 Flow Diagram
   2.2 Step-by-Step Process
   2.3 Interface Requirements
   2.4 Edge Cases and Error Handling
3. Student/Player Ballot Review Flow
   3.1 Flow Diagram
   3.2 Step-by-Step Process
   3.3 Interface Requirements
   3.4 Performance Data Visualization
4. Admin Ballot Management Flow
   4.1 Flow Diagram
   4.2 Step-by-Step Process
   4.3 Monitoring and Oversight Tools
   4.4 Intervention Capabilities
5. Cross-Flow Interactions
   5.1 Notification System Integration
   5.2 Real-time Updates
   5.3 State Management
6. Implementation Guidelines
   6.1 Supabase Data Patterns
   6.2 Noodl Component Structure
   6.3 n8n Workflow Integration

## | 4P | [048] 03.04.1.3_TECHNICAL-CONSIDERATIONS
1. Performance Optimization
   1.1 Query Efficiency
   1.2 Batch Operations
   1.3 Caching Strategies
2. Security Implementation
   2.1 Row-Level Security Policies
   2.2 Authentication Integration
   2.3 Input Validation
3. Scalability Planning
   3.1 Data Volume Handling
   3.2 Historical Data Management
   3.3 Concurrent Access Optimization
4. Cross-Device Compatibility
   4.1 Mobile Optimization
   4.2 Responsive Interface Design
   4.3 Offline Capabilities
5. Integration Considerations
   5.1 Chamber-Ballot Integration
   5.2 Notification System
   5.3 Analytics Pipeline


# 03.04_BALLOT-SYSTEM/ .2_DATABASE/
| 47P | Ballot system database

## | 5P | [049] 03.04.2.1_SCHEMA-DESIGN
1. Overview
2. Schema Organization
   2.1 Debate Schema Integration
   2.2 Public Schema Relationships
3. Core Tables Structure
   3.1 Ballots Table
   3.2 Scorecards Table
   3.3 Scores Table
   3.4 Feedback Table
   3.5 Criteria Table
   3.6 Ballot Templates Table
4. Relationship Patterns
   4.1 Judge-Ballot Relationship
   4.2 Participant-Scorecard Relationship
   4.3 Cross-Schema Relationships
5. Indexing Strategy
   5.1 Primary Indexes
   5.2 Foreign Key Indexes
   5.3 Performance Optimization Indexes
6. Row-Level Security Implementation
   6.1 Judge Access Policies
   6.2 Participant Access Policies
   6.3 Administrator Access Policies
7. Data Population Patterns
   7.1 Criteria Initialization
   7.2 Template Creation
   7.3 Default Score Values
8. Real-time Features Configuration
   8.1 Publication Setup
   8.2 Channel Configuration
9. Query Patterns
   9.1 Ballot Creation and Initialization
   9.2 Score Updates and Submission
   9.3 Performance Analytics Queries
10. Schema Extensions
   10.1 PostgreSQL Extensions
   10.2 Custom Functions
11. Verification and Testing
   11.1 Data Integrity Tests
   11.2 Relationship Validation
   11.3 Security Policy Tests

## | 4P | [050] 03.04.2.2_SECURITY-POLICIES
1. Overview
2. Row-Level Security Fundamentals
3. Ballot System RLS Policies
   3.1 Ballot Table Policies
   3.2 Scorecard Table Policies
   3.3 Score Table Policies
   3.4 Feedback Table Policies
   3.5 Ballot Template Policies
4. Role-Based Access Implementation
   4.1 Judge-Specific Access
   4.2 Student/Participant Access
   4.3 Administrator Access
5. Cross-Schema Security Considerations
   5.1 Public-to-Debate Schema Policies
   5.2 Authentication Integration
6. Audit and Compliance
   6.1 Access Tracking
   6.2 Policy Verification
7. Testing and Verification Procedures
   7.1 Policy Test Queries
   7.2 Common Scenarios

## | **27P** | [051] 03.04.2.3_PERFORMANCE-TUNING
1. Overview and Objectives
2. Database Optimization
   2.1 Index Strategy
   2.2 Query Performance Optimization
   2.3 Data Volume Management
3. Client-Side Performance
   3.1 Component Loading Strategies
   3.2 Data Retrieval Patterns
   3.3 Caching Mechanisms
4. n8n Workflow Optimization
   4.1 Batch Processing
   4.2 Webhook Response Time
   4.3 Service Role Operations
5. Cross-System Integration Performance
   5.1 Chamber-Ballot Integration Optimization
   5.2 Real-time Update Optimization
   5.3 Dashboard Data Loading
6. Scaling Considerations
   6.1 High-Volume Event Handling
   6.2 Historical Data Management
   6.3 Multi-Format Support Optimization
7. Monitoring and Testing
   7.1 Performance Monitoring
   7.2 Performance Testing Workflows
8. Conclusion and Best Practices
   8.1 Performance Optimization Summary
   8.2 Key Performance Metrics
   8.3 Ongoing Optimization Process

## | **11P** | [052] 03.04.2.4_REALTIME-FEATURES
1. Supabase Real-time Architecture
   1.1 Channel Configuration
   1.2 Subscription Management
   1.3 Event Types
2. Ballot Status Monitoring
   2.1 Judge Interface Updates
   2.2 Participant Notifications
   2.3 Admin Monitoring Dashboard
3. Score Synchronization
   3.1 Collaborative Judging
   3.2 Cross-Device Consistency
   3.3 Data Integrity Safeguards
4. Video Integration
   4.1 Timestamped Feedback Synchronization
   4.2 Video Playback Coordination
   4.3 Multi-view Synchronization
5. Performance Dashboard Updates
   5.1 Live Performance Metrics
   5.2 Historical Data Comparison
   5.3 Real-time Analytics
6. Implementation Patterns
   6.1 Connection Management
   6.2 Error Handling and Recovery
   6.3 Offline Support Strategy
7. Security Considerations
   7.1 Authentication Integration
   7.2 Channel Access Control
   7.3 Data Validation
8. Testing and Quality Assurance
   8.1 Real-time Testing Approaches
   8.2 Performance Benchmarks
   8.3 Common Failure Modes
9. Integration with n8n Workflows
   9.1 Event-Triggered Workflows
   9.2 Status Synchronization
   9.3 Notification Delivery


# 03.04_BALLOT-SYSTEM/ .3.1_SCORECARD-EDITOR/
| 9P | Scorecard editor components for scoring debate across criteria (also R01 to S14 categories?) 

## | 2P | [053] 03.04.3.1.1_STRUCTURE
1. Overview
2. Component Architecture
3. Data Flow Models
4. Subcomponent Structure
5. State Management
6. Integration Points
7. Responsive Design Considerations
8. Accessibility Features

## | 2P | [054] 03.04.3.1.2-IMPLEMENTATION
1. Overview
2. Component Structure
3. Data Flow
4. Supabase Integration
5. State Management
6. Event Handling
7. UI Structure
8. Error Handling
9. Performance Considerations

## | 2P | [055] 03.04.3.1.3-CRITERIA-TABS
1. Component Purpose
2. Tab Navigation Implementation
3. Criteria Group Organization
4. Tab State Management
5. UI Structure
6. Event Handlers
7. Integration with Parent Component

## | 3P | [056] 03.04.3.1.4_SCORE-SLIDER
1. Component Purpose
2. Slider Implementation
3. Score Calculation
4. Visual Feedback
5. Interaction Events
6. State Management
7. Integration with Parent Component


# 03.04_BALLOT-SYSTEM/ .3.2_FEEDBACK/
| 7P | Feedback Component

## | 1P | [057] 03.04.3.2.1-STRUCTURE
1. Overview
2. Component Architecture
3. Component Hierarchy
4. State Management
5. Data Flow
6. Event Handling
7. Integration Points
8. Responsive Design Considerations
9. Accessibility Requirements

## | 6P | [058] 03.04.3.2.2-IMPLEMENTATION
1. Overview
2. Component Implementation
3. Supabase Integration
4. Video Integration
5. Form Implementation
6. State Management Implementation
7. Event Handling Implementation
8. Testing and Validation
9. Performance Optimization

# 03.04_BALLOT-SYSTEM/ .3.3_BALLOT-REVIEW/
| 14P | Ballot Review Component

## | 2P | [059] 03.04.3.3.1_STRUCTURE
1. Overview
2. Component Architecture
   2.1 Component Hierarchy
   2.2 Data Flow
   2.3 State Management
3. Supabase Integration
   3.1 Data Schema Dependencies
   3.2 Query Patterns
   3.3 Real-time Features
4. UI Structure
   4.1 Layout Organization
   4.2 Responsive Design Considerations
   4.3 Accessibility Features

## | 5P | [060] 03.04.3.3.2_IMPLEMENTATION
1. Overview
2. Component Implementation
   2.1 Main Component Setup
   2.2 Data Fetching
   2.3 Validation Logic
   2.4 Submission Handler
3. Sub-Components
   3.1 CompletionChecklist Implementation
   3.2 BallotSummary Implementation 
   3.3 Feedback Display Implementation
4. Supabase Integration Code
   4.1 Query Implementation
   4.2 Update Operations
   4.3 Real-time Subscription Setup
5. Event Handling
   5.1 User Interaction Events
   5.2 System Events

## | 3P | [061] 03.04.3.3.3_CHECKLIST
1. Overview
2. Component Structure
3. Implementation Details
4. Validation Logic
5. Integration with Ballot Review
6. User Interface Elements
7. State Management
8. Usage Examples

## | 4P | [062] 03.04.3.3.4_SUMMARY
1. Overview
2. Component Structure
3. Data Aggregation
4. Visual Representation
5. Integration with Ballot Review
6. User Interface Elements
7. Interactive Features
8. Usage Examples


# 03.04_BALLOT-SYSTEM/ .3.4_PERFORMANCE-DASHBOARD/
| 33P | Results Display Component

## | 2P | [063] 03.04.3.4.1_STRUCTURE
1. Overview
2. Component Hierarchy
3. Data Flow Architecture
4. Supabase Integration Points
5. Key Interfaces and Props
6. State Management
7. Core Subcomponents
   7.1 PerformanceSummary Component
   7.2 BallotHistory Component
   7.3 FeedbackCollection Component
   7.4 PerformanceCharts Component
8. Responsive Considerations

## | 7P | [064] 03.04.3.4.2_IMPLEMENTATION
1. Main Component Implementation
2. Supabase Query Implementation
3. Data Processing Functions
4. Event Handling
5. Subcomponent Implementations
   5.1 PerformanceSummary Implementation
   5.2 BallotHistory Implementation
   5.3 FeedbackCollection Implementation
   5.4 PerformanceCharts Implementation
6. Real-time Updates
7. Error Handling
8. Performance Optimizations

## | 4P | [065] 03.04.3.4.3_SUMMARY
1. Introduction
   1.1 Purpose of the Performance Summary Component
   1.2 Role within the Performance Dashboard
2. Component Architecture
   2.1 Structure and Organization
   2.2 Key Subcomponents
   2.3 Dependency Relationship with Other Components
3. Data Model Integration
   3.1 Supabase Schema Usage
   3.2 Cross-Schema Data Retrieval Patterns
   3.3 Optimized Query Strategies
4. Core Functionality
   4.1 Summary Calculation Logic
   4.2 Performance Metric Aggregation
   4.3 Score Categorization (RESPECT, ANALYSIS, STYLE)
   4.4 Performance Scoring Model
5. Visualization Implementation
   5.1 Score Representation
   5.2 Category Breakdown
   5.3 Trend Indicators
   5.4 Accessibility Considerations
6. Real-time Updates
   6.1 Supabase Subscription Integration
   6.2 State Synchronization Pattern
   6.3 Update Triggers
7. Implementation Examples
   7.1 Noodl Component Code
   7.2 Supabase Query Patterns
   7.3 Performance Optimization Techniques
8. Best Practices
   8.1 Data Refresh Strategies
   8.2 Error Handling
   8.3 Edge Cases
   8.4 Responsive Design Approaches
9. User Experience Considerations
   9.1 Information Priority
   9.2 Progressive Disclosure Pattern
   9.3 Context-Sensitive Display
10. Testing and Validation
   10.1 Performance Testing
   10.2 Data Consistency Checks
   10.3 Expected User Interactions

## | **12P** | [066] 03.04.3.4.4_HISTORY
1. Introduction
   1.1 Purpose of the History Component
   1.2 Relationship to Performance Dashboard
   1.3 User Value Proposition
2. Component Architecture
   2.1 Structure and Dependencies
   2.2 Key Subcomponents
   2.3 Integration Points
3. Data Retrieval Strategy
   3.1 Historical Data Query Pattern
   3.2 Schema Integration
   3.3 Pagination Implementation
   3.4 Data Filtering and Sorting
4. Timeline Visualization
   4.1 Chronological Display
   4.2 Event Grouping Logic
   4.3 Detail Expansion Mechanics
5. Performance Trend Analysis
   5.1 Trend Calculation Algorithms
   5.2 Progress Visualization
   5.3 Comparative Analysis Features
6. Interaction Patterns
   6.1 Filtering Controls
   6.2 Time Range Selection
   6.3 Detail Expansion
   6.4 Drill-Down Functionality
7. Implementation Examples
   7.1 Noodl Component Code
   7.2 Supabase Query Optimization
   7.3 State Management Approach
8. Export and Sharing
   8.1 Data Export Options
   8.2 Report Generation
   8.3 Share Functionality
9. Storage and Retention
   9.1 Data Lifecycle Management
   9.2 Archive Strategy
   9.3 Performance Optimization for Large Histories
10. Integration with Other Components
   10.1 Cross-Component Communication
   10.2 Context Sharing
   10.3 Synchronized Views
11. Best Practices
   11.1 Performance Optimization
   11.2 Error Handling
   11.3 Empty State Management
12. Testing and Validation
   12.1 Performance Testing with Large Datasets
   12.2 Edge Case Handling
   12.3 User Experience Validation

## | 4P | [067] 03.04.3.4.5_FEEDBACK
1. Overview
2. Component Architecture
3. Core Functionality
4. Supabase Integration
5. Real-time Features
6. Technical Implementation
7. Best Practices
8. Integration Examples


## | 4P | [068] 03.04.3.4.6_CHARTS
1. Overview
2. Chart Types and Purpose
   2.1 Trend Chart
   2.2 Category Comparison Chart
   2.3 Strengths and Weaknesses Chart
3. Implementation with Noodl
   3.1 Chart Component Structure
   3.2 Data Processing Functions
   3.3 Styling and Theming
4. Integration with Supabase
   4.1 Data Flow from Supabase
   4.2 Real-time Updates
5. Accessibility Considerations
6. Performance Optimization
7. Code Examples

# 03.04_BALLOT-SYSTEM/ .4.1_BALLOT-GENERATION/
| 9P | n8n Workflows for creating new ballots for debates

## | 2P | [069] 03.04.4.1.1-CONFIGURATION
1. Overview
2. Webhook Configuration
   2.1 Endpoint Structure
   2.2 Request Format
3. Authentication Setup   
   3.1 Service Role Authentication
   3.2 Security Considerations
4. Input Parameters
   4.1 Required Parameters
   4.2 Optional Parameters
   4.3 Parameter Validation
5. Output Format
   5.1 Success Response Format
   5.2 Error Response Format
6. Error Handling
7. Integration with Supabase
   7.1 Supabase Database Operations
   7.2 Cross-Schema Considerations
8. Testing and Validation
   8.1 Test Cases
   8.2 Validation Procedure

## | 3P | [070] 03.04.4.1.2_NODE-DETAILS
1. Webhook Trigger Node
2. Function: Validate Input
3. Supabase: Get Debate Info
4. Function: Process Debate Format
5. Supabase: Get Template
6. Function: Generate Ballot Structure
7. Supabase: Create Ballot
8. Supabase: Create Scorecards
9. Supabase: Initialize Scores
10. Function: Prepare Notifications
11. Webhook: Send Notifications
12. Function: Prepare Response

## | 3P | [071] 03.04.4.1.3_TESTING
1. Overview
   1.1 Purpose of Testing
   1.2 Testing Approach
   1.3 Testing Environment
2. Unit Testing
   2.1 Scorecard Component Tests
   2.2 Feedback Component Tests 
   2.3 Ballot Review Component Tests
3. Integration Testing
   3.1 Chamber-Ballot Integration Tests
   3.2 Notification Integration Tests
   3.3 Dashboard Integration Tests
4. End-to-End Testing
   4.1 Judge Workflow Tests
   4.2 Student Workflow Tests
   4.3 Admin Workflow Tests
5. Performance Testing
   5.1 Load Testing
   5.2 Concurrency Testing
   5.3 Response Time Testing
6. Security Testing
   6.1 RLS Policy Verification
   6.2 Authentication Testing
   6.3 Authorization Testing
7. Automated Testing Setup
   7.1 Test Data Generation
   7.2 CI/CD Integration
8. Testing Checklists
   8.1 Pre-Release Testing Checklist
   8.2 Post-Release Validation Checklist

# 03.04_BALLOT-SYSTEM/ .4.2_BALLOT-PROCESSING/
| 14P | n8n Workflows for handling completed ballot submissions

## | 3P | [072] 03.04.4.2.1_CONFIGURATION
1. Introduction
2. Ballot Generation Workflow
   2.1 Workflow Configuration
   2.2 Workflow Structure
   2.3 Node Configurations
3. Ballot Processing Workflow
   3.1 Workflow Configuration 
   3.2 Workflow Structure
   3.3 Node Configurations
4. Analytics Generation Workflow
   4.1 Workflow Configuration
   4.2 Workflow Structure
   4.3 Key Functions with Supabase Integration

## | 5P | [073] 03.04.4.2.2_NODE-DETAILS
1. Overview
2. Webhook Trigger Node
   2.1 Configuration Details
   2.2 Input Handling
3. Function: Validate Input
   3.1 Input Parameters
   3.2 Validation Process
   3.3 Error Handling
   3.4 Output Format
4. Supabase: Verify Ballot Ownership
   4.1 Query Structure
   4.2 Schema Integration
   4.3 RLS Considerations
5. Function: Validate Completeness
   5.1 Validation Criteria
   5.2 Error Cases
   5.3 Status Verification
6. Supabase: Update Ballot Status
   6.1 Data Operations
   6.2 Timestamp Management
   6.3 Return Fields
7. Supabase: Update Scorecard Status
   7.1 Batch Update Pattern
   7.2 Status Synchronization
8. Function: Calculate Performance Metrics
   8.1 Data Collection
   8.2 Metrics Calculation
   8.3 Output Structure
9. Supabase: Store Performance Metrics
   9.1 Database Schema Integration
   9.2 JSON Storage Pattern
10. Function: Prepare Notifications
   10.1 Notification Types
   10.2 Recipient Determination
   10.3 Message Formatting
11. HTTP Request: Send Notifications
   11.1 API Integration
   11.2 Authentication Method
   11.3 Payload Structure
12. Function: Prepare Response
   12.1 Success Response Format
   12.2 Error Handling
   12.3 Client Feedback
13. Testing Requirements
   13.1 Validation Test Cases
   13.2 Integration Test Patterns
   13.3 Error Simulation

## | 6P | [074] 03.04.4.2.3_TESTING
1. Overview
2. Testing Objectives
3. Testing Environment Setup
   3.1 Supabase Test Environment
   3.2 Test Data Generation
   3.3 Test User Accounts
4. Component Testing
   4.1 Scorecard Editor Testing
   4.2 Feedback Component Testing
   4.3 Ballot Review Testing
   4.4 Performance Dashboard Testing
5. Integration Testing
   5.1 n8n Workflow Testing
   5.2 Chamber-Ballot Integration Testing
   5.3 Notification System Testing
6. End-to-End Testing
   6.1 Judge Workflow Testing
   6.2 Student Feedback Review Testing
   6.3 Admin Oversight Testing
7. Performance Testing
   7.1 Load Testing
   7.2 Responsiveness Testing
8. Security Testing
   8.1 RLS Policy Validation
   8.2 Permission Boundary Testing
9. Test Case Documentation
10. Continuous Integration Testing
11. Regression Testing Approach

# 03.04_BALLOT-SYSTEM/ .4.3_ANALYTICS-GENERATION/
| 12P | n8n Workflows for creating performance analytics from ballots

## | 2P | [075] 03.04.4.3.1_CONFIGURATION
1. Overview
   1.1 Purpose and functionality of the PerformanceSummary component
   1.2 Position within Performance Dashboard architecture
2. Component Configuration
   2.1 Input parameters
   2.2 Default values
   2.3 Data dependencies
3. Display Configuration
   3.1 Score formatting and presentation
   3.2 Category grouping and labeling
   3.3 Visual styling parameters
4. Category Configuration
   4.1 Criteria group definitions
   4.2 Visual representation settings
   4.3 Color scheme configuration
5. Strength/Weakness Analysis Configuration
   5.1 Analysis parameters
   5.2 Display thresholds
   5.3 Data processing settings
6. Integration with Parent Components
   6.1 Data flow from Performance Dashboard
   6.2 Event handling configuration
   6.3 State management

## | 7P | [076] 03.04.4.3.2_KEY-FUNCTIONS
1. Overview
2. Analytics Function Architecture
3. Core Data Processing Functions
   3.1 Data Retrieval and Preparation
   3.2 Score Aggregation Functions
   3.3 Performance Metrics Calculation
   3.4 Trend Analysis Functions
4. Data Transformation Functions
   4.1 Participant Performance Metrics
   4.2 Criteria Group Analysis
   4.3 Temporal Analysis
5. Output Generation Functions
   5.1 Structured Analytics Output
   5.2 JSON Response Formatting
   5.3 Error Handling
6. Integration Points
   6.1 Database Connection Functions
   6.2 Webhook Interface Functions
   6.3 Notification Integration
7. Implementation Best Practices

## | 3P | [077] 03.04.4.3.3_WEBHOOK-REFERENCE
1. Overview
   1.1 Purpose and Scope
   1.2 Authentication Requirements
2. Webhook Endpoints
   2.1 Ballot Generation Endpoint
   2.2 Ballot Submission Endpoint
   2.3 Analytics Generation Endpoint
3. Request Formats
   3.1 Ballot Generation Request
   3.2 Ballot Submission Request
   3.3 Analytics Generation Request
4. Response Formats
   4.1 Success Responses
   4.2 Error Responses
   4.3 Status Codes
5. Security Considerations
   5.1 Authentication Best Practices
   5.2 Input Validation
   5.3 Error Handling
6. Integration Examples
   6.1 Noodl Integration
   6.2 External System Integration
7. Troubleshooting
   7.1 Common Issues
   7.2 Debugging Tips


# 03.04_BALLOT-SYSTEM/ .5_INTEGRATION/
| 25P | Integration with other EDL systems

## | 3P | [078] 03.04.5.1_CHAMBER-INTEGRATION
1. Overview
2. Integration Architecture
   2.1 Supabase as Integration Foundation
   2.2 Cross-Schema Communication
   2.3 Real-time Updates
3. Ballot Initialization from Chamber
   3.1 Judge Assignment Process
   3.2 Ballot Generation During Debate
   3.3 Video Content Association
4. Video Timestamp Integration
   4.1 Recording Timestamp References
   4.2 Feedback Timestamp Association
   4.3 Playback with Feedback Markers
5. Chamber-to-Ballot Data Flow
   5.1 Participant Role Mapping
   5.2 Format-Specific Considerations
   5.3 State Synchronization
6. Implementation Examples
   6.1 Noodl Component Integration
   6.2 n8n Workflow Touchpoints
7. Testing and Verification
8. Best Practices and Guidelines

## | 8P | [079] 03.04.5.2_NOTIFICATION-INTEGRATION
1. Overview
   1.1 Purpose of Notification Integration
   1.2 Key Integration Points
   1.3 Notification Types
2. Notification Architecture
   2.1 Database Structure
   2.2 Real-Time Event Handling
   2.3 Delivery Mechanisms
3. Notification Events
   3.1 Ballot Creation Events
   3.2 Ballot Submission Events
   3.3 Feedback and Comment Events
   3.4 Status Change Events
4. Implementation with n8n
   4.1 Workflow Configuration
   4.2 Event Triggers
   4.3 User Targeting
   4.4 Delivery Channels
5. Supabase Integration
   5.1 Real-Time Channels
   5.2 Database Triggers
   5.3 Event Processing
6. User Experience Considerations
   6.1 Notification UI Components
   6.2 Read/Unread Status Management
   6.3 User Preferences
7. Best Practices
   7.1 Performance Optimization
   7.2 Error Handling
   7.3 Testing Approaches
8. Implementation Examples
   8.1 Judge Notification Workflow
   8.2 Student Feedback Alerts
   8.3 Admin Monitoring Alerts

## | **14P** | [080] 03.04.5.3_DASHBOARD-INTEGRATION
1. Overview
   1.1 Purpose and Scope
   1.2 Integration Architecture
2. Student Dashboard Integration
   2.1 Performance Metrics Queries
   2.2 Historical Performance Visualization
   2.3 Feedback Aggregation Components
3. Judge Dashboard Integration
   3.1 Pending Ballots Management
   3.2 Completed Evaluation History
   3.3 Judging Analytics
4. Real-time Updates Integration
   4.1 Supabase Subscription Setup
   4.2 Notification Components
   4.3 Live Status Indicators
5. Implementation Patterns
   5.1 Optimized Query Strategies
   5.2 Component Reusability
   5.3 Performance Optimizations
6. Cross-device Considerations
   6.1 Responsive Dashboard Elements
   6.2 Mobile-specific Adaptations


# 03.04_BALLOT-SYSTEM/ .6_BEST-PRACTICES/
| 13P | Guidelines for ballot system implementation

## | 5P | [081] 03.04.6.1_COMPONENT-ORGANIZATION
1. Component Architecture Overview
   1.1 Component Hierarchy
   1.2 Relationship to Supabase Data Model
   1.3 Cross-Component Communication Patterns
2. Core Components Organization
   2.1 Ballot Components
   2.2 Scorecard Components
   2.3 Feedback Components
   2.4 Analytics Components
3. Component State Management
   3.1 Local vs. Supabase-Driven State
   3.2 Real-time Updates Integration
   3.3 Cross-Component State Synchronization
4. Role-Based Component Access
   4.1 Judge/Enabler Components
   4.2 Student/Player Components
   4.3 Admin Components
5. Format-Specific Component Variations
   5.1 Component Extension Pattern
   5.2 Format Template Integration
   5.3 Dynamic Component Loading
6. Maintainability Patterns
   6.1 Component Reusability Strategies
   6.2 Version Management
   6.3 Testing Component Interactions

## | 5P | [082] 03.04.6.2_SUPABASE-INTEGRATION
1. Core Integration Principles
   1.1 Schema Organization and Naming
   1.2 Explicit Schema References
   1.3 Cross-Schema Query Patterns
2. Data Access Patterns
   2.1 Optimized Query Structures
   2.2 Batch Operations
   2.3 Transaction Management
3. Real-time Features
   3.1 Subscription Configuration
   3.2 Real-time State Management
   3.3 Channel Management
4. Security Implementation
   4.1 Row-Level Security Policies
   4.2 Service Role Usage
   4.3 JWT Authentication Flow
5. Performance Optimization
   5.1 Query Optimization Techniques
   5.2 Caching Strategies
   5.3 Pagination Implementation
6. Error Handling
   6.1 Supabase-Specific Error Codes
   6.2 Error Recovery Patterns
   6.3 Validation Approaches
7. Component Integration
   7.1 Noodl Component Patterns
   7.2 n8n Workflow Patterns
   7.3 Cross-Component State Synchronization

## | 3P | [083] 03.04.6.3_PERFORMANCE-CONSIDERATIONS
1. Query Optimization Strategies
   1.1 Efficient Data Fetching Patterns
   1.2 Pagination Implementation
   1.3 Selective Field Retrieval
2. Real-time Performance Optimization
   2.1 Subscription Management
   2.2 Event Filtering Techniques
   2.3 Client-Side State Handling
3. Database Performance Tuning
   3.1 Index Utilization
   3.2 Query Execution Planning
   3.3 Schema Design Considerations
4. Component-Level Optimizations
   4.1 Data Caching Strategies
   4.2 Lazy Loading Implementation
   4.3 Rendering Performance
5. Scalability Considerations
   5.1 High-Volume Ballot Processing
   5.2 Analytics Computation Optimization
   5.3 Database Sharding Strategies
6. Cross-Device Performance
   6.1 Mobile Optimization Techniques
   6.2 Network Efficiency Strategies
   6.3 Progressive Enhancement Approaches


# 03.05_CONTENT-MANAGEMENT/
| 3P | Debate motion and content management

## | 3P | [084] 03.05_CONTENT-MANAGEMENT
1. Overview
2. Database Structure
   2.1 Core Content Tables
   2.2 Relationships and Cross-Schema References
3. Implementation Guidelines
   3.1 Managing Debate Topics
   3.2 Genre and Category Organization
4. Query Patterns
   4.1 Creating and Retrieving Motions
   4.2 Topic Filtering
   4.3 Genre-based Organization
5. UI Components
   5.1 Motion Selector Component
   5.2 Motion Creation Component
6. Access Control and Security
   6.1 Motion Access Policy
   6.2 Genre Access Policy
7. n8n Workflow Integration
   7.1 Motion Import Workflow
   7.2 Content Recommendations Workflow
8. Best Practices
   8.1 Content Organization
   8.2 Query Optimization
   8.3 Content Moderation
9. Conclusion


# 03.06_JUDGING-SYSTEM/
| 4P | Judge assignment and management

## | 4P | [085] 03.06_JUDGING-SYSTEM
1. Overview
2. Judging System Architecture
   2.1 Core Components
   2.2 Database Structure
   2.3 Criteria Groups and Evaluation Framework
3. Ballot System Workflow
   3.1 Ballot Generation
   3.2 Judging Process
   3.3 Score Calculation
4. Implementation Patterns
   4.1 Ballot Generation Component
   4.2 Scorecard Editor Component
   4.3 Feedback Component
   4.4 Ballot Submission Component
5. n8n Workflow Integration
   5.1 Ballot Processing Workflow
   5.2 Analytics Generation Workflow
6. User Interfaces
   6.1 Judge Ballot Interface
   6.2 Video Feedback Integration
   6.3 Performance Dashboard
7. Security and Access Control
   7.1 Row-Level Security Policies
   7.2 Role-Based Access
8. Best Practices
   8.1 Ballot Creation
   8.2 Score Management
   8.3 Feedback Collection
   8.4 Performance Optimization
9. Troubleshooting
   9.1 Common Issues
   9.2 Debugging Patterns
10. Future Enhancements
11. Conclusion

441

# 04_DEVELOPER-GUIDES/
| 17P | Practical guides for EDL developers

## | 4P | [086] 04.01_GETTING-STARTED
1. Introduction
2. Platform Overview
   2.1 Purpose and Goals
   2.2 Architecture Foundation
   2.3 Core User Types
3. Development Environment Setup
   3.1 Required Tools
   3.2 Repository Access
   3.3 Supabase Project Setup
   3.4 Noodl Project Configuration
   3.5 n8n Workflow Setup
4. Understanding the Database Schema
   4.1 Schema Organization
   4.2 Cross-Schema Relationships
   4.3 Supabase Schema Access Pattern
5. Security Implementation
   5.1 Row-Level Security (RLS)
   5.2 Authentication Flow
6. Core Components
   6.1 Noodl Components
   6.2 n8n Workflows
7. Development Patterns
   7.1 Supabase Query Pattern
   7.2 Real-time Subscription Pattern
   7.3 n8n Integration Pattern
8. Common Tasks
   8.1 Creating a New User
   8.2 Creating a New Debate
   8.3 Submitting a Ballot
9. Testing Your Changes
   9.1 Data Integrity Testing
   9.2 RLS Policy Testing
10. Troubleshooting Common Issues
   10.1 Supabase Connection Issues
   10.2 Noodl Component Errors
   10.3 n8n Workflow Issues
11. Best Practices
   11.1 Coding Standards
   11.2 Performance Optimization
   11.3 Documentation
12. Getting Help and Resources
   12.1 Team Communication
   12.2 Documentation Resources
   12.3 External Resources
13. Conclusion

## | 4P | [087] 04.02_SUPABASE-DEVELOPMENT-PRACTICES
1. Overview
2. Database Access Patterns
   2.1 Supabase Client Setup
   2.2 Schema Prefixing
   2.3 Query Optimization
3. Row-Level Security (RLS)
   3.1 RLS Policy Creation
   3.2 Policy Testing
   3.3 Administrative Access
4. Authentication Implementation
   4.1 User Registration
   4.2 Session Management
   4.3 Role-Based Access
5. Real-time Features
   5.1 Subscription Setup
   5.2 Presence Tracking
6. Storage Integration
   6.1 File Upload
   6.2 File Retrieval
7. Error Handling Patterns
   7.1 Supabase Error Types
   7.2 Transaction Management
8. Service Role Usage Guidelines
   8.1 When to Use Service Roles
   8.2 Service Role Security
9. Performance Optimization
   9.1 Query Caching
   9.2 Parallel Requests
10. Testing and Quality Assurance
   10.1 Data Integrity Testing
   10.2 RLS Policy Validation
11. Best Practices for n8n Integration
   11.1 Handling Credentials
   11.2 Workflow Error Handling
12. Conclusion

## | 3P | [088] 04.03_TESTING-AND-QA
1. Overview
2. Data Integrity Validation
   2.1 Record Validation Scripts
   2.2 Relationship Integrity Testing
   2.3 Migration Validation
3. Functional Testing
   3.1 Authentication Testing
   3.2 Debate Flow Testing
   3.3 Component Testing in Noodl
   3.4 n8n Workflow Testing
4. Performance Testing
   4.1 Query Performance Baseline
   4.2 Load Testing
   4.3 Optimization Iterations
5. Security Testing
   5.1 RLS Policy Validation
   5.2 Authentication Security Testing
   5.3 API Security Testing
6. Integration Testing
   6.1 Cross-Component Integration
   6.2 End-to-End User Flows
7. Automated Testing Framework
   7.1 n8n Automated Testing Workflows
   7.2 Testing in Continuous Integration
8. Quality Assurance Process
   8.1 Test Case Management
   8.2 Defect Management
   8.3 QA Environment
9. Error Handling and Monitoring
   9.1 Error Classification and Handling
   9.2 Error Monitoring and Alerting
10. Release Validation
   10.1 Pre-Release Checklist
   10.2 Post-Release Validation
11. Conclusion

## | 6P | [089] 04.04_COMMON-QUERY-PATTERNS
1. Overview
2. Basic Query Patterns
   2.1 Single-Schema Queries
   2.2 Cross-Schema Relationship Queries
   2.3 Filtering and Pagination
3. Data Mutation Patterns
   3.1 Basic Insert Operations
   3.2 Update Operations
   3.3 Delete Operations
4. Transaction Patterns
   4.1 n8n-based Transactions
5. Real-time Subscription Patterns
   5.1 Basic Subscription Setup
   5.2 Presence Tracking
6. Cross-Schema Dashboard Queries
   6.1 Student Dashboard Queries
   6.2 Judge Dashboard Queries
7. Performance Optimization Patterns
   7.1 Parallel Queries
   7.2 Query Caching
   7.3 Pagination and Lazy Loading
8. Error Handling Patterns
   8.1 Robust Error Handling
   8.2 Schema Prefix Validation
9. Conclusion

# 04.05_UI-UX-GUIDELINES/ .1_DESIGN-FOUNDATION/
| 15P | Core design principles and standards 

## | 2P | [090] 04.05.1.1_BRAND-IDENTITY
1. Introduction
2. Core Brand Elements
   2.1 Logo Usage and Variations
   2.2 Colors
   2.3 Typography
   2.4 Spacing System
   2.5 Iconography
3. Voice and Tone
4. Application Examples
5. Implementation Guidelines

## | 7P | [091] 04.05.1.2_COMPONENT-STANDARDS
1. Overview
2. Button Components
   2.1 Primary Button
   2.2 Secondary Button
   2.3 Tertiary Button
   2.4 Button States
3. Form Elements
   3.1 Text Inputs
   3.2 Selects
   3.3 Checkboxes & Radio Buttons
   3.4 Form Layout
4. Card Components
   4.1 Standard Card
   4.2 Interactive Cards
5. Navigation Components
   5.1 Main Navigation
   5.2 Sidebar Navigation
   5.3 Tab Navigation
6. Data Visualization
   6.1 Charts and Graphs
   6.2 Tables

## | 6P | [092] 04.05.1.3_ACCESSIBILITY-STANDARDS
1. Introduction
2. Core Accessibility Requirements
   2.1 Keyboard Navigation
   2.2 Screen Reader Compatibility
   2.3 Color and Contrast
   2.4 Focus Management
   2.5 Form Accessibility
   2.6 Error Handling
3. Implementation Guidelines
   3.1 HTML Structure and Semantics
   3.2 ARIA Attributes
   3.3 Interactive Components
   3.4 Content Formatting
   3.5 Responsive Accessibility
4. Testing and Validation
   4.1 Automated Testing Approaches
   4.2 Manual Testing Checklist
   4.3 User Testing Protocols
5. Accessibility in Supabase Integration
6. Role-Specific Considerations
7. Conclusion



# 04.05_UI-UX-GUIDELINES/ .2_IMPLEMENTATION-PATTERNS/
| 28P | Patterns for implementing UI design

## | 4P | [093] 04.05.2.1_NOODL-IMPLEMENTATION
1. Introduction to Noodl Implementation
2. Setting Up Supabase Integration
   2.1 Initializing the Supabase Client
   2.2 Managing Sessions and Authentication
   2.3 Environment Configuration
3. Component Organization
   3.1 Core Component Structure
   3.2 Composite Component Patterns
   3.3 Separation of Visual and Logic Components
4. Data Binding Patterns
   4.1 Basic Data Fetching
   4.2 Nested Select Queries
   4.3 Cross-Schema Data Access
5. State Management
   5.1 Real-Time State with Supabase
   5.2 Local State Management
   5.3 Optimistic UI Updates
6. Error Handling
   6.1 Supabase Error Patterns
   6.2 Error Display Components
   6.3 Form Validation Errors

## | **18P** | [094] 04.05.2.2_NEXTJS-IMPLEMENTATION
1. Introduction
2. Setting Up Supabase Integration with NextJS
   2.1 Client-Side Integration
   2.2 Server-Side Integration
   2.3 Authentication Setup
3. Tailwind Configuration for EDL Design System
   3.1 Color Configuration
   3.2 Typography Configuration
   3.3 Spacing and Layout
   3.4 Component-Specific Styles
4. Component Organization
   4.1 Directory Structure
   4.2 Component Hierarchy
   4.3 Shared Components
   4.4 Page-Specific Components
5. Data Fetching Patterns
   5.1 Client-Side Data Fetching
   5.1 Server-Side Rendering (SSR)
   5.2 Static Site Generation (SSG)
   5.3 Incremental Static Regeneration (ISR)
   5.4 Real-Time Subscriptions
6. Authentication Patterns
   6.1 Login/Registration Components
   6.2 Protected Routes
   6.3 Role-Based Access Control
   6.4 Session Management
7. Real-Time Updates
   7.1 Subscription Setup
   7.2 UI State Synchronization
   7.3 Optimistic Updates
   7.4 Error Handling for Real-Time Operations
8. Cross-Schema Implementation
   8.1 Schema-Aware Components
   8.2 Cross-Schema Queries
   8.3 Performance Optimization
9. Best Practices and Guidelines
   9.1 Performance Optimization
   9.2 Accessibility Implementation
   9.3 Error Handling
   9.4 Code Organization
10. Conclusion

## | 6P | [095] 04.05.2.3_CROSS-PLATFORM-CONSISTENCY 
1. Introduction
2. Shared Design System Foundation
   2.1 Design Tokens
   2.2 Component Specifications
   2.3 Platform-Specific Adaptations
3. Asset Management with Supabase Storage
   3.1 Centralized Asset Repository
   3.2 Version Control for Assets
   3.3 Access Patterns
4. Authentication Flow Consistency
   4.1 Unified Authentication Experience
   4.2 Session Management
   4.3 Role-Based UI Adaptation
5. Data Access Patterns
   5.1 Schema-Aware Components
   5.2 Shared Query Patterns
   5.3 Cross-Platform State Management
6. Implementation Guidelines
   6.1 Noodl Implementation
   6.2 NextJS Implementation
   6.3 Testing Cross-Platform Consistency


# 04.05_UI-UX-GUIDELINES/ .3_INTERACTION-PATTERNS/
| 22P | Standard user interaction models

## | 7P | [096] 04.05.3.1_AUTHENTICATION-PATTERNS
1. Introduction
   1.1 Purpose
   1.2 Supabase Authentication Integration
2. Sign-Up Workflow
   2.1 Email Verification Flow
   2.2 Profile Creation Process
   2.3 Role Assignment
3. Sign-In Patterns
   3.1 Standard Sign-In Flow
   3.2 Remember Me Functionality
   3.3 Error Handling
4. Session Management
   4.1 Token-Based Authentication
   4.2 Session Validation and Refresh
   4.3 Secure Session Storage
5. Role-Based UI Adaptation
   5.1 Role Detection Approach
   5.2 Component Visibility Control
   5.3 Permission Boundaries
6. Implementation Examples
   6.1 Noodl Components
   6.2 Integration with n8n Workflows

## | 8P | [097] 04.05.3.2_DATA-SUBMISSION-PATTERNS
1. Introduction
2. Form Submission with Supabase
3. Multi-Stage Form Submission
4. Real-Time Collaborative Forms
5. File Upload Pattern
6. Best Practices

## | 4P | [098] 04.05.3.3_DATA-RETRIEVAL-PATTERNS
1. Introduction
   1.1 Purpose of data retrieval patterns
   1.2 Importance in Supabase-first architecture
   1.3 Overview of pattern categories
2. Real-Time Subscription Pattern
   2.1 Implementation with Supabase channels
   2.2 Data synchronization approach
   2.3 UI integration considerations 
   2.4 Performance optimization techniques
3. Paginated Data Retrieval Pattern
   3.1 Implementation strategy
   3.2 Page navigation controls
   3.3 Loading state management
   3.4 Error handling for pagination
4. Filtered Search Pattern
   4.1 Search implementation
   4.2 Filter mechanism
   4.3 Debouncing and optimization
   4.4 Combining with pagination
5. Cross-Schema Query Patterns
   5.1 Handling queries across public and debate schemas
   5.2 Performance considerations
   5.3 Error handling
6. Best Practices
   6.1 Query optimization techniques
   6.2 State management integration
   6.3 Loading states and indicators
   6.4 Error handling strategies
7. Implementation Examples
   7.1 Noodl component examples
   7.2 Integration with UI components
   7.3 Code patterns to follow
8. Conclusion
   8.1 Summary of key patterns
   8.2 Selection criteria for different scenarios

## | 3P | [099] 04.05.3.4_NAVIGATION-PATTERNS
1. Overview
2. Role-Based Navigation
   2.1 User Role Detection
   2.2 Dynamic Navigation Generation
   2.3 Role-Specific Navigation Implementation
3. Deep Linking Pattern
   3.1 Path Parsing and Parameter Extraction
   3.2 Authentication Integration
   3.3 Authorization and Access Control
4. State Preservation
   4.1 URL Parameter Management
   4.2 Navigation History
5. Responsive Navigation Considerations
   5.1 Mobile Navigation Patterns
   5.2 Device-Specific Adaptations
6. Best Practices
   6.1 Performance Optimization
   6.2 Accessibility Considerations


# 04.05_UI-UX-GUIDELINES/ .4_STATE-MANAGEMENT
| 17P | Managing UI state across components

## | 4P | [100] 04.05.4.1_REAL-TIME-STATE
1. Introduction to Real-Time State Management
2. Supabase Real-Time Capabilities
3. Real-Time State Manager Implementation
   3.1 Core Structure and Configuration
   3.2 Channel and Subscription Management
   3.3 Event Handling
   3.4 Error Handling and Recovery
4. Integration with Noodl Components
   4.1 Component Lifecycle Management
   4.2 UI Synchronization Patterns
5. Optimizing Real-Time Performance
   5.1 Subscription Filtering
   5.2 Data Batching and Throttling
6. Best Practices
   6.1 Security Considerations
   6.2 Cross-Schema Subscriptions

## | 3P | [101] 04.05.4.2_USER-PRESENCE-SYSTEM
1. Overview
2. Core Implementation
3. Room-Based Presence
4. Presence Indicators
5. Heartbeat Mechanism
6. Integration with Supabase
7. Presence State Management
8. Real-Time Updates
9. Best Practices

## | **10P** | [102] 04.05.4.3_STATE-SYNCHRONIZATION
1. Introduction to State Synchronization
2. Supabase-Driven State Management
   2.1 Core Principles
   2.2 Benefits of Server-Driven State
3. Optimized State Synchronization Pattern
   3.1 Pattern Implementation
   3.2 Change Detection and Batching
   3.3 Error Handling and Recovery
4. Cross-Schema State Synchronization
   4.1 Handling State Across Schemas
   4.2 Performance Considerations
5. Real-Time State Updates
   5.1 Supabase Channel Integration
   5.2 Handling Concurrent Edits
6. Local vs. Remote State
   6.1 Caching Strategies
   6.2 Offline Support
7. Implementation Examples
   7.1 Simple State Sync
   7.2 Complex Multi-Entity Sync
8. Best Practices
   8.1 Performance Optimization
   8.2 Security Considerations


# 04.05_UI-UX-GUIDELINES/ .5_ERROR-HANDLING/
| 14P | Error handling and validation approaches

## | **11P** | [103] 04.05.5.1_SUPABASE-ERROR-HANDLING
1. Introduction to Supabase Error Handling
   1.1 Common Supabase Error Types
   1.2 Error Handling Principles
2. The Supabase Error Handler Pattern
   2.1 Implementation Overview
   2.2 Error Mapping and Classification
   2.3 User-Friendly Error Messages
3. Database Operation Error Handling
   3.1 Query and Mutation Errors
   3.2 Cross-Schema Error Handling
   3.3 Row-Level Security Errors
4. Authentication Error Handling
   4.1 Sign-up and Sign-in Errors
   4.2 Session Management Errors
   4.3 Permission-Based Errors
5. Real-time Subscription Error Handling
   5.1 Connection Errors
   5.2 Subscription Failures
   5.3 Recovery Strategies
6. Storage Error Handling
   6.1 Upload Errors
   6.2 Download Errors
   6.3 Permission Errors
7. Error Logging and Monitoring
   7.1 Implementing Error Logging
   7.2 Error Analysis and Reporting
8. Best Practices
   8.1 Defensive Coding Techniques
   8.2 Error Prevention Strategies
   8.3 Testing Error Scenarios

## | 3P | [104] 04.05.5.2_FORM-VALIDATION
1. Introduction to Form Validation
2. Supabase Integration for Validation
3. Client-Side Validation Patterns
   3.1 Core Validation Rules
   3.2 Custom Validation Rules
   3.3 Asynchronous Validation (Unique Checks)
4. Error Handling & Display
   4.1 Supabase Error Transformation
   4.2 User Feedback Patterns
5. Validation Implementation
   5.1 FormValidator Class
   5.2 Integration with Noodl Components
6. Multi-Stage Form Validation
7. Accessibility Considerations
8. Best Practices

# 04.05_UI-UX-GUIDELINES/ .6_PERFORMANCE/
| 26P | UI performance optimization strategies

## | 4P | [105] 04.05.6.1_IMAGE-OPTIMIZATION
1. Introduction
   1.1 Purpose of Image Optimization
   1.2 Impact on Performance
2. Supabase Storage Integration
   2.1 Storage Configuration
   2.2 Bucket Organization
   2.3 Access Controls through RLS
3. Image Upload Best Practices
   3.1 Client-Side Optimization
   3.2 Format Selection
   3.3 Progressive Loading
4. Responsive Image Patterns
   4.1 Image Sizing Strategy
   4.2 Resolution Switching
   4.3 Art Direction
5. Implementation in Noodl
   5.1 Image Component Configuration
   5.2 Upload Component Integration
   5.3 Lazy Loading
6. Implementation in NextJS/Tailwind
   6.1 Next/Image Component
   6.2 Tailwind Responsive Classes
   6.3 Loading Strategies
7. Performance Measurement
   7.1 Core Web Vitals
   7.2 Optimization Metrics
   7.3 Monitoring Tools

## | **18P** | [106] 04.05.6.2_DATA-LOADING-OPTIMIZATION
1. Introduction
2. Supabase Data Loading Principles
3. Query Optimization Techniques
   3.1 Selective Field Retrieval
   3.2 Efficient Join Patterns
   3.3 Pagination Implementation
4. Caching Strategies
   4.1 Client-Side Caching
   4.2 Component-Level Caching
   4.3 Cross-Schema Caching Considerations
5. Real-time Data Loading
   5.1 Subscription Optimization
   5.2 Efficient State Updates
6. Mobile and Low-Bandwidth Optimizations
   6.1 Progressive Loading
   6.2 Data Compression Techniques
7. Loading State Management
   7.1 Skeleton UI Patterns
   7.2 Progressive Disclosure
8. Implementation Examples
   8.1 Optimized Noodl Components
   8.2 Common Data Loading Patterns
9. Performance Monitoring
   9.1 Measuring Loading Performance
   9.2 Identifying Bottlenecks
10. Best Practices

## | 4P | [107] 04.05.6.3_BUNDLE-OPTIMIZATION
1. Introduction to Bundle Optimization
   1.1 Purpose and Importance
   1.2 Impact on Performance
2. Core Bundle Optimization Techniques
   2.1 Code Splitting
   2.2 Lazy Loading
   2.3 Tree Shaking
   2.4 Asset Optimization
3. Supabase-Specific Optimizations
   3.1 Client Initialization
   3.2 Query Optimization
   3.3 Schema-Aware Imports
4. Implementation in Noodl
   4.1 Component Organization
   4.2 Lazy Component Loading
   4.3 Asset Management
5. Implementation in NextJS
   5.1 Next.js Built-in Optimizations
   5.2 Custom Optimizations
   5.3 Integration with Supabase
6. Monitoring and Performance Metrics
   6.1 Key Performance Indicators
   6.2 Measuring Bundle Size
   6.3 Performance Benchmarks
7. Best Practices and Guidelines
   7.1 Development Workflow
   7.2 Deployment Considerations
   7.3 Continuous Optimization


# 04.05.7_FORMAT-SPECIFIC-COMPONENTS/ .1_EMD-FORMAT/
| 33P | Components for WSDC debate format

## | **14P** | [108] 04.05.7.1.1_EMD-CHAMBER-COMPONENTS
1. Introduction
   1.1 Purpose and scope
   1.2 Relationship to format-specific architecture
2. EMD Format Overview
   2.1 Key characteristics
   2.2 Speech structure and requirements
   2.3 UI/UX implications
3. Core Chamber Components
   3.1 Component hierarchy
   3.2 Component relationships
   3.3 Supabase integration points
4. Speech Management Components
   4.1 Timer components
   4.2 Recording components
   4.3 Playback components
5. Participant Interface Components
   5.1 Speaker view components
   5.2 Audience view components
   5.3 Judge view components
6. EMD-Specific UI Elements
   6.1 Format-specific controls
   6.2 Navigation patterns
   6.3 Status indicators
7. Implementation Examples
   7.1 Component code samples
   7.2 Integration patterns
   7.3 State management
8. Best Practices
   8.1 Performance considerations
   8.2 Accessibility requirements
   8.3 Cross-device compatibility

## | 6P | 04.05.7.1.2_EMD-JUDGING-COMPONENTS
1. Overview
   1.1 Purpose and Scope
   1.2 Integration with EDL Platform
2. Component Architecture
   2.1 Supabase Integration Pattern
   2.2 Component Hierarchy
   2.3 State Management
3. Core Judging Components
   3.1 Ballot Interface
   3.2 Criteria Scoring
   3.3 Feedback Input
   3.4 Video Annotation
4. EMD-Specific Implementation
   4.1 EMD Format Requirements
   4.2 Three-Category Scoring
   4.3 Speech Timestamp Navigation
5. Real-time Features
   5.1 Collaborative Judging
   5.2 Live Scoring Updates
   5.3 Presence Indicators
6. Integration Examples
   6.1 Chamber Integration
   6.2 Dashboard Integration
7. Best Practices
   7.1 Performance Optimization
   7.2 Accessibility Considerations

## | **13P** | [110] 04.05.7.1.3_EMD-ANALYTICS-COMPONENTS
1. Overview
   1.1 Purpose of EMD Analytics
   1.2 Integration with Supabase
2. Core Analytics Components
   2.1 Performance Dashboard
   2.2 Scoring Visualization
   2.3 Speech Analysis
3. Implementation Patterns
   3.1 Data Retrieval
   3.2 Real-time Updates
   3.3 Cross-Schema Operations
4. Debate-Specific Analytics
   4.1 Round Performance Metrics
   4.2 Criteria Group Analysis
   4.3 Historical Trends
5. User Experience Considerations
   5.1 Component Accessibility
   5.2 Responsive Design
   5.3 Performance Optimization

# 04.05.7_FORMAT-SPECIFIC-COMPONENTS/ .2_WSDC-FORMAT/
| 35P | Components for WSDC debate format

## | **22P** | [111] 04.05.7.2.1_WSDC-CHAMBER-COMPONENTS
1. WSDC Format Overview
   1.1 Format Structure and Rules
   1.2 Key UI Requirements
2. Core Chamber Components
   2.1 Debate Stage Layout
   2.2 Speech Timer Implementation
   2.3 Point of Information Manager
3. Speaker Management
   3.1 Team Structure Implementation
   3.2 Speaker Role Components
   3.3 Speech Order Controller
4. Judging Integration
   4.1 Ballot Components
   4.2 Real-time Feedback System
   4.3 Scoring Visualization
5. Audience View
   5.1 Spectator Components
   5.2 Public Voting System
6. Supabase Integration
   6.1 Real-time State Management
   6.2 Cross-Schema Data Flow
   6.3 Debate Persistence Pattern
7. Responsive Design
   7.1 Mobile-Optimized Components
   7.2 Adaptive Layout Strategy

## | 9P | [112] 04.05.7.2.2_WSDC-JUDGING-COMPONENTS
1. Overview of WSDC Judging Requirements
   1.1 WSDC Format Specifics
   1.2 Judging Criteria Integration
2. Core Judging Components
   2.1 Ballot Component Architecture
   2.2 Score Input Components
   2.3 Feedback Input Components
3. WSDC-Specific UI Elements
   3.1 Reply Speech Handling
   3.2 POI Tracking Components
   3.3 Role-Based Evaluation
4. Implementation with Supabase
   4.1 WSDC Schema Integration
   4.2 Real-Time Collaborative Judging
   4.3 Ballot Submission Flow
5. Responsive Considerations
   5.1 Mobile Judging Interface
   5.2 Tablet Optimization
   5.3 Desktop Full View
6. Accessibility Features
   6.1 Keyboard Navigation for Scoring
   6.2 Screen Reader Compatibility
7. Component Composition Guide
   7.1 Component Hierarchy
   7.2 Data Flow Architecture

## | 4P | [113] 04.05.7.2.3_WSDC-ANALYTICS-COMPONENTS
1. Overview
2. WSDC-Specific Analytics Requirements
3. Component Architecture
   3.1 Data Sources and Integration
   3.2 Component Hierarchy
4. Core Analytics Components
   4.1 Performance Dashboard
   4.2 Score Breakdown
   4.3 Speaker Position Analysis
5. Implementation with Supabase
   5.1 Data Fetching Patterns
   5.2 Real-time Updates
6. Accessibility Considerations
7. Best Practices and Guidelines

# 04.05.7_FORMAT-SPECIFIC-COMPONENTS/ .3_OTHER-FORMAT/
| 25P | Components for additional debate formats

## | **10P** | [114] 04.05.7.3.1_BP-FORMAT-COMPONENTS
1. Introduction
   1.1 British Parliamentary Debate Format Overview
   1.2 Integration with EDL Platform
2. Component Architecture
   2.1 BP Format Factory Implementation
   2.2 Component Hierarchy
   2.3 Schema Integration
3. UI Components
   3.1 BP Chamber Interface
   3.2 Speaker Role Components
   3.3 Time Management Components
   3.4 Chamber Control Panel
4. Data Management
   4.1 BP-Specific Data Structures
   4.2 Supabase Integration
   4.3 Real-time State Management
5. Responsive Implementation
   5.1 Mobile Adaptations
   5.2 Desktop Optimizations
   5.3 Cross-Device Consistency
6. Format-Specific Judging
   6.1 BP Ballot Components
   6.2 Team Ranking System
   6.3 Speaker Score Components
7. Implementation Guidelines
   7.1 Code Examples
   7.2 Best Practices
   7.3 Integration with Core Components

## | **15P** | [115] 04.05.7.3.2_CUSTOM-FORMAT-COMPONENTS
1. Introduction
2. Custom Format Architecture
   2.1 Format Registry System
   2.2 Component Configuration
3. Implementation Pattern
   3.1 Format Definition Structure
   3.2 Component Integration with Supabase
4. State Management for Custom Formats
   4.1 Format-Specific State Patterns
   4.2 Real-time Data Synchronization
5. User Interface Components
   5.1 Component Composition Strategy
   5.2 Responsive Considerations
6. Dynamic Content Management
   6.1 Speech and Timing Controls
   6.2 Scoring and Feedback Elements
7. Testing and Validation
   7.1 Format Simulation
   7.2 Performance Verification
8. Best Practices and Guidelines


# 05_CROSS-DEVICE-COMPATIBILITY/ 01_PRINCIPLES/
| 4P | Core principles for cross-device optimization

## | 4P | [116] 05.01.1_SUPABASE-OPTIMIZATION-PRINCIPLES
1. Introduction
2. Leveraging Supabase's Architecture
   2.1 PostgreSQL Efficiency
   2.2 Real-time Subscriptions
   2.3 Edge Functions
   2.4 Storage CDN
   2.5 Row-Level Security
3. Core Optimization Areas
   3.1 Resource Loading Strategy
      - Progressive loading patterns
      - Adaptive field selection
      - Request batching
      - Initial render prioritization   
   3.2 Caching Strategy
      - Client-side caching
      - Component-level caching
      - Offline data persistence
      - Selective cache invalidation
   3.3 Video Optimization
      - Adaptive video quality
      - Device-specific recording mechanisms
      - Optimized playback
      - Supabase Storage integration
4. Implementation Guidelines
   4.1 Cross-device testing methodology
   4.2 Performance monitoring
   4.3 Optimization metrics and benchmarks
   4.4 Continuous improvement process
5. Conclusion
   5.1 Summary of key principles
   5.2 Future optimization roadmap


# 05_CROSS-DEVICE-COMPATIBILITY/ 02_DATA-STRATEGIES/
| 3P | Data handling strategies for various devices

## | 1P | [117] 05.02.1_PROGRESSIVE-LOADING
1. Implementation Pattern
2. Key Benefits

## | 1P | [118] 05.02.2_DEVICE-OPTIMIZATION
1. Device Profile Detection
2. Optimized Query Selection
3. Implementation Example
4. Key Benefits

## | 1P | [119] 05.02.3_PAGINATION-STRATEGY
1. Standard Pagination Implementation
2. Infinite Scroll Implementation
3. Key Features and Benefits


# 05_CROSS-DEVICE-COMPATIBILITY/ 03_CACHING/
| 4P | Caching for improved performance

## | 2P | [120] 05.03.1_SUPABASE-CACHING
1. Cache Implementation
2. Cached Fetch Implementation
3. Dynamic TTL and Cache Invalidation
4. Key Features and Benefits

## | 1P | [121] 05.03.2_COMPONENT-CACHING
1. Component Cache Implementation
2. Cached Function Creation
3. Example: Cached Formatters
4. Key Features and Benefits

## | 1P | [122] 05.03.3_OFFLINE-SUPPORT
1. Service Worker Registration
2. Offline Operation Support
3. IndexedDB Integration
4. Operation Execution
5. Key Features and Benefits


# 05_CROSS-DEVICE-COMPATIBILITY/ 04_MEDIA-OPTIMIZATION/
| 5P | Optimizing media for various devices

## | 1P | [123] 05.04.1_ADAPTIVE-VIDEO
1. Video Quality Management
2. Video Upload with Multiple Qualities
3. Video Playback Preparation
4. Usage Example
5. Key Features and Benefits

## | 2P | [124] 05.04.2_RECORDING-OPTIMIZATION
1. Device-Optimized Recording Configuration
2. Recording Initialization
3. Recording Control Functions
4. Noodl Integration
5. Key Features and Benefits

## | 2P | [125] 05.04.3_PLAYBACK-OPTIMIZATION
1. Playback Initialization
2. Video Loading with Quality Adaptation
3. Timestamped Feedback Integration
4. Playback Controls
5. Status Monitoring and Resource Management
6. Noodl Integration
7. Key Features and Benefits


# 05_CROSS-DEVICE-COMPATIBILITY/ 05_DEVICE-SPECIFIC/
| 4P | Device specific implementation

## | 2P | [126] 05.05.1_MOBILE-OPTIMIZATION
1. Device Detection and Configuration
2. Applying Optimizations to the DOM
3. Mobile-Specific Event Handling
4. Mobile Storage Optimization
5. Usage in Noodl
6. Key Features and Benefits

## | 2P | [127] 05.05.2_CROSS-BROWSER
1. Browser Capability Detection
2. Polyfill Application
3. Format Compatibility Fixes
4. Media Capability Alternatives
5. Browser-Specific Workarounds
6. Usage in Noodl
7. Key Features and Benefits


# 05_CROSS-DEVICE-COMPATIBILITY/ 06_MONITORING/
| 2P | Performance monioring and optimization

## | 2P | [128] 05.06.1_PERFORMANCE-METRICS
1. Performance Monitoring Initialization
2. Core Metrics Monitoring
3. Supabase Request Monitoring
4. Supabase Performance Wrapper
5. Example Usage
6. Performance Report Generation
7. Noodl Integration
8. Key Features and Benefits


# A00_APPENDICES/
| 15P | EDL Platform related appendices

## | 1P | [A00] GLOSSARY
Overview / A / B / C / D / E / F / G / J / M / N / P / R / S / T / U / V / Implementation Terminology / Role-Specific Terms / Status Enumerations / Technical Terms

## | 3P | [A01] SCHEMA-REFERENCE
1. Introduction
2. Schema Organization
   2.1 Public Schema
   2.2 Debate Schema
3. Detailed Table Definitions
   3.1 Public Schema Tables
   3.2 Debate Schema Tables
4. Cross-Schema Relationships
   4.1 Key Cross-Schema Foreign Keys
   4.2 Authentication Integration
5. Enum Types
6. Row-Level Security (RLS) Policies
   6.1 Public Schema RLS Examples
   6.2 Debate Schema RLS Examples
7. Indexes and Performance Considerations
   7.1 Existing Indexes
   7.2 Performance Guidance
8. Supabase-Specific Considerations
   8.1 Storage Integration
   8.2 Real-time Capabilities
   8.3 Edge Functions
9. Schema Visualization

## | 4P | [A02] QUERY-EXAMPLES
1. Introduction
2. Basic Record Retrieval
   2.1 Fetching Teams
   2.2 Retrieving User Profile
3. Including Related Objects
   3.1 Teams with Founder and Division
   3.2 Team Membership Query
4. Cross-Schema Queries
   4.1 User Participation Query
   4.2 Judge Evaluation Query
5. Data Mutation Operations
   5.1 Creating a New Debate
   5.2 Adding Teams and Participants
   5.3 Handling Invitations
6. Complex Query Patterns
   6.1 Get Debate Details with Related Data
   6.2 Cross-Schema User Activity Query
7. Real-time Subscriptions
   7.1 Debate State Changes Subscription
   7.2 Speech Update Subscription
8. Authentication Queries
   8.1 Sign Up
   8.2 Sign In
   8.3 Session Check
9. Storage Operations
   9.1 Video Upload
   9.2 Listing Files
10. Transaction Patterns
   10.1 Creating a Team with Members
   10.2 Creating a Debate with Teams and Participants
11. Role-Based Queries
   11.1 Checking User Roles
   11.2 Fetching Judge Scorecard
12. Optimized Query Patterns
   12.1 Parallel Requests
   12.2 Pagination Implementation
   12.3 Selective Field Selection
13. Error Handling Patterns
   13.1 Comprehensive Error Handling
   13.2 Transaction Error Handling
14. Conclusion

## | 2P | [A03] SCHEMA-DIAGRAMS
1. Overview
2. Entity Relationship Diagrams
   2.1 Public Schema Overview
   2.2 Debate Schema Overview
   2.3 Cross-Schema Relationships
3. Table Relationship Maps
   3.1 Format System Relationships
   3.2 Judging System Relationships
   3.3 Participants and Speeches Relationships
4. Schema Generation Tools
   4.1 Regenerating Diagrams
   4.2 Schema Visualization in Supabase
5. Core Tables Reference
   5.1 User Management Tables
   5.2 Debate Format Tables
   5.3 Evaluation System Tables
6. Advanced Schema Features
   6.1 Custom Types and Enums
   6.2 Indexes and Constraints
7. Schema Evolution Guidelines
8. Supabase Schema Tools

## | 5P | [A04] LAUNCH-PLAN
1. Objectives
2. MVP Schedule
3. Next Steps Recommendation
4. Implementation Approach
   4.1 Component-First Supabase Implementation
   4.2 Connecting Supabase Auth to Noodl
5. Database Schema Versioning
   5.1 Supabase Schema Management
   5.2 Database Schema Versioning Strategy
6. Technical Implementation Requirements
   6.1 Database Structure
   6.2 Row-Level Security Implementation
   6.3 Key Implementation Strategies
7. Implementation Resources
   7.1 Database Schema Creation Scripts
   7.2 Noodl Component Templates
   7.3 n8n Workflow Templates



"H" LEGEND: 

H1(#) - Doc Title
H2(##) - 1., 2., 3., ... etc.
H3(###) - 1.1, 1.2, 1.3, ... etc. 

