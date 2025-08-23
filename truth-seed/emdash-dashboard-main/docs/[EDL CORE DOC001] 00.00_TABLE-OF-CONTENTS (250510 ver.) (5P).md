---
session: "25051"
type: "documentation"
status: "current"
created: "2025-08-23"
title: "00.00_TABLE-OF-CONTENTS"
purpose: "Document 00.00_table-of-contents"
topics: ['documentation']
priority: "P1"
domain: "core"
---

EDL 00_PROJECT-OVERVIEW/

# 00.00_TABLE-OF-CONTENTS

EDL-Documentation/
│
├── 00_PROJECT-OVERVIEW/ | High-level documentation that defines the project's foundation & architecture principles
│   │
│   ├── [001] `00.00_TABLE-OF-CONTENTS.md` | The EDL documentation map
│   ├── [002] `00.00.1_TABLE-OF-CONTENTS-EXTENSION.md` | The EDL documentation map (with sub-sections)
│   │
│   ├── [003] `00.01_EXECUTIVE-SUMMARY.md` | Comprehensive overview of EDL platform, key features, & implementation approach
│   ├── [004] `00.02_CONSTITUTIONAL-FRAMEWORK.md` | Core principles & rules governing all development decisions and architecture choices
│   ├── [005] `00.03_ARCHITECTURE-PRINCIPLE.md` | Foundational technical decisions & Supabase-first design philosophy
│   ├── [006] `00.04_USER-TYPES-AND-ROLES.md` | Description of user roles, permissions, & access patterns across the platform
│   └── [007] `00.05_SYSTEM-INTEGRATION-UPDATE.md` | Latest integrations & system component relationships
│
├── 01_DATABASE-ARCHITECTURE/ | Comprehensive documentation of EDL's Supabase database implementation
│   │
│   ├── [008] `01.01_SCHEMA-DOCUMENTATION.md` | Complete reference of all tables, relationships, & implementation patterns
│   ├── [009] `01.02_DATABASE-FOUNDATION.md` | Core database architecture using Supabase PostgreSQL as the foundation
│   ├── [010] `01.03-CROSS-SCHEMA-INTEGRATION.md` | Patterns for working with both `public` & `debate` schemas effectively
│   ├── [011] `01.04_ROW-LEVEL-SECURITY.md` | Implementation guide for Supabase RLS policies across all platform tables
│   └── [012] `01.05_TEXT-BASED-SCHEMA-VISUALS.md` | Text representations of database relationships for documentation purposes
│
├── 02_IMPLEMENTATION-PATTERNS/ | Core implementation approaches that apply across the entire platform regardless of specific feature
│   │
│   ├── [013] `02.01_NOODL-COMPONENT-LIBRARY.md` | Reusable UI components & best practices for consistent Noodl development
│   ├── [014] `02.02_NOODL-N8N-INTEGRATION.md` | Architecture for Noodl & n8n interaction within the Supabase ecosystem
│   ├── [015] `02.03_AUTH-AND-USER-FLOW.md` | User authentication patterns using Supabase Auth across application touchpoints
│   └── [016] `02.04_REAL-TIME-FEATURES.md` | Implementation patterns for Supabase real-time subscriptions & live updates
│
├── 03_CORE-FEATURES/ | Detailed implementation guides for the platform's key functionality areas
│   │
│   ├── [017] `03.01_DEBATE-FORMAT-SYSTEM.md` | Architecture for different debate format configurations & rules engine
│   ├── [018] `03.02_SYNC-VS-ASYC-DEBATES.md` | Implementation differences between real-time & turn-based debate modes
│   │
│   ├── 03.03_DEBATE-CHAMBER/ | The central debate experience where speeches, timers, & scoring occur
│   │   │
│   │   ├── 03.03.1_ARCHITECTURE/ | Foundation for the debate chamber implementation
│   │   │   ├── [019] `03.03.1.1_CHAMBER-OVERVIEW.md` | High-level structure & relationships between chamber components
│   │   │   ├── [020] `03.03.1.2_SUPABASE-INTEGRATION.md` | Database interaction patterns specific to chamber experience
│   │   │   └── [021] `03.03.1.3_COMPONENT-ARCHITECTURE.md` | Component hierarchy & responsibility separation in the chamber UI
│   │   │
│   │   ├── 03.03.2_STATE-MANAGEMENT/ | Approaches for managing debate state across participants
│   │   │   ├── [022] `03.03.2.1_SUPABASE-DRIVEN-STATE.md` | Supabase as the source of truth for debate state management
│   │   │   ├── [023] `03.03.2.2_PRESENCE-USER-STATE.md` | Real-time user presence tracking & status management
│   │   │   └── [024] `03.03.2.3_STATE-CHANGE-HANDLERS.md` | Patterns for responding to state changes from Supabase events
│   │   │
│   │   ├── 03.03.3_MEDIA-COMPONENTS/ | Video & audio management for debate speeches
│   │   │   ├── [025] `03.03.3.1_STORAGE-INTEGRATION.md` | Using Supabase Storage for speech recording & playback
│   │   │   ├── [026] `03.03.3.2_VIDEO-RECORDING.md` | Implementation of cross-device video recording capabilities
│   │   │   └── [027] `03.03.3.3_VIDEO-PLAYBACK.md` | Implementation of video playback with annotation capabilities
│   │   │
│   │   ├── 03.03.4_DATA-PATTERNS/ | Efficient data access patterns for the debate chamber
│   │   │   ├── [028] `03.03.4.1_SUPABASE-QUERY-PATTERNS.md` | Optimized query structures for debate chamber operations
│   │   │   ├── [029] `03.03.4.2_REALTIME-SUBSCRIPTIONS.md` | Implementation of Supabase real-time channels for live updates
│   │   │   └── [030] `03.03.4.3_OPTIMIZED-DATA-ACCESS.md` | Performance strategies for efficient data retrieval & caching
│   │   │
│   │   ├── 03.03.5_CONTROLLERS/ | Logic controllers for managing debate flow
│   │   │   ├── [031] `03.03.5.1_SYNCHRONOUS-CONTROLLER.md` | Implementation of real-time debate flow management
│   │   │   └── [032] `03.03.5.2_ASYNCHRONOUS-CONTROLLER.md` | Implementation of turn-based debate flow management
│   │   │
│   │   ├── 03.03.6_SYSTEMS-INTEGRATION/ | Integration with other EDL subsystems
│   │   │   ├── [033] `03.03.6.1_EVALUATION-INTEGRATION.md` | Connection between debate chamber & judging systems
│   │   │   ├── [034] `03.03.6.2_BALLOT-INTEGRATION.md` | Integration with the ballot scoring & feedback system
│   │   │   └── [035] `03.03.6.3_ANALYTICS-INTEGRATION.md` | Performance metrics & analytics capture during debates
│   │   │
│   │   └── 03.03.7_FORMAT-SPECIFIC/ | Implementation variations based on debate format
│   │       │
│   │       ├── 03.03.7.1_FORMAT-ARCHITECTURE/ | Core architecture for format-specific implementations
│   │       │   ├── [036] `03.03.7.1.1_FORMAT-FACTORY.md` | Factory pattern for creating format-specific components
│   │       │   └── [037] `03.03.7.1.2_FORMAT-REGISTRY.md` | System for registering & retrieving debate format implementations
│   │       │
│   │       ├── 03.03.7.2_RESPONSIVE-DESIGN/ | Format-specific responsive design approaches
│   │       │   ├── [038] `03.03.7.2.1_LAYOUT-STRATEGY.md` | Layout strategies for different formats across device sizes
│   │       │   └── [039] `03.03.7.2.2_FORMAT-RESPONSIVE-COMPONENTS.md` | Responsive component strategies for each debate format
│   │       │
│   │       ├── 03.03.7.3_FORMAT-DATA-MANAGEMENT/ | Format-specific data handling approaches
│   │       │   ├── [040] `03.03.7.3.1_FORMAT-DATA-FETCHING.md` | Data retrieval patterns specific to each format's needs
│   │       │   ├── [041] `03.03.7.3.2_FORMAT-VIDEO-STORAGE.md` | Video handling & storage patterns per format
│   │       │   └── [042] `03.03.7.3.3_FORMAT-STATE-MANAGEMENT.md` | State management approaches tailored to each format
│   │       │
│   │       └── 03.03.7.4_FORMAT-IMPLEMENTATIONS/ | Specific implementations for each debate format
│   │           ├── [043] `03.03.7.4.1_EMD-FORMAT.md` | Implementation details for the EMD debate format
│   │           ├── [044] `03.03.7.4.2_WSDC-FORMAT.md` | Implementation details for the WSDC debate format
│   │           └── [045] `03.03.7.4.3_OTHER-FORMATS.md` | Implementation details for additional debate formats
│   │
│   │
│   ├── 03.04_BALLOT-SYSTEM/ | Judging, scoring, & feedback management system
│   │   │
│   │   ├── 03.04.1_OVERVIEW/ | High-level ballot system architecture
│   │   │   ├── [046] `03.04.1.1_IMPLEMENTATION-PLAN.md` | Phased approach for ballot system implementation
│   │   │   ├── [047] `03.04.1.2_USER-FLOWS.md` | Key user journeys through the ballot system
│   │   │   └── [048] `03.04.1.3_TECHNICAL-CONSIDERATIONS.md` | Performance, security, & scalability considerations
│   │   │
│   │   ├── 03.04.2_DATABASE/ | Ballot system database implementation
│   │   │   ├── [049] `03.04.2.1_SCHEMA-DESIGN.md` | Tables & relationships for ballot system in Supabase
│   │   │   ├── [050] `03.04.2.2_SECURITY-POLICIES.md` | RLS policies specific to the ballot system
│   │   │   ├── [051] `03.04.2.3_PERFORMANCE-TUNING.md` | Query optimization for ballot operations
│   │   │   └── [052] `03.04.2.4_REALTIME-FEATURES.md` | Real-time functionality for collaborative ballot usage
│   │   │
│   │   ├── 03.04.3_COMPONENTS/ | UI components for the ballot system
│   │   │   │
│   │   │   ├── 03.04.3.1_SCORECARD-EDITOR/ | Components for scoring debates across criteria
│   │   │   │   ├── [053] `03.04.3.1.1_STRUCTURE.md` | Overall component structure for the scorecard editor
│   │   │   │   ├── [054] `03.04.3.1.2_IMPLEMENTATION.md` | Implementation details for the scorecard editor
│   │   │   │   ├── [055] `03.04.3.1.3_CRITERIA-TABS.md` | Implementation of tabbed criteria scoring interface
│   │   │   │   └── [056] `03.04.3.1.4_SCORE-SLIDER.md` | Interactive score selection component implementation
│   │   │   │
│   │   │   ├── 03.04.3.2_FEEDBACK/ | Components for providing written and timestamped feedback
│   │   │   │   ├── [057] `03.04.3.2.1_STRUCTURE.md` | Overall component structure for feedback system
│   │   │   │   └── [058] `03.04.3.2.2_IMPLEMENTATION.md` | Implementation details for feedback components
│   │   │   │
│   │   │   ├── 03.04.3.3_BALLOT-REVIEW/ | Components for reviewing and submitting completed ballots
│   │   │   │   ├── [059] `03.04.3.3.1_STRUCTURE.md` | Overall component structure for ballot review
│   │   │   │   ├── [060] `03.04.3.3.2_IMPLEMENTATION.md` | Implementation details for ballot review components
│   │   │   │   ├── [061] `03.04.3.3.3_CHECKLIST.md` | Validation component for ensuring complete ballots
│   │   │   │   └── [062] `03.04.3.3.4_SUMMARY.md` | Summary component showing overall ballot evaluation
│   │   │   │
│   │   │   └── 03.04.3.4_PERFORMANCE-DASHBOARD/ | Components for displaying evaluation results to participants
│   │   │       ├── [063] `03.04.3.4.1_STRUCTURE.md` | Overall component structure for performance dashboard
│   │   │       ├── [064] `03.04.3.4.2_IMPLEMENTATION.md` | Implementation details for dashboard components
│   │   │       ├── [065] `03.04.3.4.3_SUMMARY.md` | High-level performance summary component
│   │   │       ├── [066] `03.04.3.4.4_HISTORY.md` | Historical performance tracking component
│   │   │       ├── [067] `03.04.3.4.5_FEEDBACK.md` | Feedback display and organization component
│   │   │       └── [068] `03.04.3.4.6_CHARTS.md` | Data visualization components for performance metrics
│   │   │
│   │   ├── 03.04.4_WORKFLOWS/ | n8n workflows for ballot system operations
│   │   │   │
│   │   │   ├── 03.04.4.1_BALLOT-GENERATION/ | Workflow for creating new ballots for debates
│   │   │   │   ├── [069] `03.04.4.1.1_CONFIGURATION.md` | Configuration details for the ballot generation workflow
│   │   │   │   ├── [070] `03.04.4.1.2_NODE-DETAILS.md` | Detailed node configuration for generation workflow
│   │   │   │   └── [071] `03.04.4.1.3_TESTING.md` | Testing procedures for the ballot generation workflow
│   │   │   │
│   │   │   ├── 03.04.4.2_BALLOT-PROCESSING/ | Workflow for handling completed ballot submissions
│   │   │   │   ├── [072] `03.04.4.2.1_CONFIGURATION.md` | Configuration details for the ballot processing workflow
│   │   │   │   ├── [073] `03.04.4.2.2_NODE-DETAILS.md` | Detailed node configuration for processing workflow
│   │   │   │   └── [074] `03.04.4.2.3_TESTING.md` | Testing procedures for the ballot processing workflow
│   │   │   │
│   │   │   └── 03.04.4.3_ANALYTICS-GENERATION/ | Workflow for creating performance analytics from ballots
│   │   │       ├── [075] `03.04.4.3.1_CONFIGURATION.md` | Configuration details for the analytics workflow
│   │   │       ├── [076] `03.04.4.3.2_KEY-FUNCTIONS.md` | Critical functions within the analytics workflow
│   │   │       └── [077] `03.04.4.3.3_WEBHOOK-REFERENCE.md` | API endpoints for triggering analytics generation
│   │   │
│   │   ├── 03.04.5_INTEGRATION/ | Integration with other EDL systems
│   │   │   ├── [078] `03.04.5.1_CHAMBER-INTEGRATION.md` | Integration between ballot system and debate chamber
│   │   │   ├── [079] `03.04.5.2_NOTIFICATION-INTEGRATION.md` | Notification system integration for ballot events
│   │   │   └── [080] `03.04.5.3_DASHBOARD-INTEGRATION.md` | User dashboard integration for ballot data
│   │   │
│   │   └── 03.04.6_BEST-PRACTICES/ | Guidelines for ballot system implementation
│   │       ├── [081] `03.04.6.1_COMPONENT-ORGANIZATION.md` | Organizing ballot components for maintainability
│   │       ├── [082] `03.04.6.2_SUPABASE-INTEGRATION.md` | Best practices for Supabase usage in ballot system
│   │       └── [083] `03.04.6.3_PERFORMANCE-CONSIDERATIONS.md` | Optimizing ballot system performance
│   │
│   ├── [084] `03.05_CONTENT-MANAGEMENT.md` | Implementation of debate motion and content management
│   │
│   └── [085] `03.06_JUDGING-SYSTEM.md` | Implementation of judge assignment and management
│
│
├── 04_DEVELOPER-GUIDES/ | Practical guides for developers working on the EDL platform
│   │
│   ├── [086] `04.01_GETTING-STARTED.md` | Initial setup and onboarding for developers
│   ├── [087] `04.02_SUPABASE-DEVELOPMENT-PRACTICES.md` | Best practices for working with Supabase in the EDL context
│   ├── [088] `04.03_TESTING-AND-QA.md` | Testing procedures and quality assurance practices
│   ├── [089] `04.04_COMMON-QUERY-PATTERNS.md` | Frequently used Supabase query patterns with examples
│   │
│   └── 04.05_UI-UX-GUIDELINES/ | Design system and implementation standards
│       │
│       ├── 04.05.1_DESIGN-FOUNDATION/ | Core design principles and standards
│       │   ├── [090] `04.05.1.1_BRAND-IDENTITY.md` | EDL brand guidelines and visual language
│       │   ├── [091] `04.05.1.2_COMPONENT-STANDARDS.md` | Standards for component development and styling
│       │   └── [092] `04.05.1.3_ACCESSIBILITY-STANDARDS.md` | Accessibility requirements and implementation guidelines
│       │
│       ├── 04.05.2_IMPLEMENTATION-PATTERNS/ | Patterns for implementing UI designs
│       │   ├── [093] `04.05.2.1_NOODL-IMPLEMENTATION.md` | Implementing designs in Noodl components
│       │   ├── [094] `04.05.2.2_NEXTJS-IMPLEMENTATION.md` | Implementing designs in NextJS components
│       │   └── [095] `04.05.2.3_CROSS-PLATFORM-CONSISTENCY.md` | Maintaining design consistency across platforms
│       │
│       ├── 04.05.3_INTERACTION-PATTERNS/ | Standard user interaction models
│       │   ├── [096] `04.05.3.1_AUTHENTICATION-PATTERNS.md` | Login, registration, and account management patterns
│       │   ├── [097] `04.05.3.2_DATA-SUBMISSION-PATTERNS.md` | Forms and data input interaction patterns
│       │   ├── [098] `04.05.3.3_DATA-RETRIEVAL-PATTERNS.md` | Data display and filtering interaction patterns
│       │   └── [099] `04.05.3.4_NAVIGATION-PATTERNS.md` | Navigation and wayfinding interaction patterns
│       │
│       ├── 04.05.4_STATE-MANAGEMENT/ | Managing UI state across components
│       │   ├── [100] `04.05.4.1_REAL-TIME-STATE.md` | Handling real-time updates in the UI
│       │   ├── [101] `04.05.4.2_USER-PRESENCE-SYSTEM.md` | Implementing user presence indicators
│       │   └── [102] `04.05.4.3_STATE-SYNCHRONIZATION.md` | Synchronizing state between components and Supabase
│       │
│       ├── 04.05.5_ERROR-HANDLING/ | Error handling and validation approaches
│       │   ├── [103] `04.05.5.1_SUPABASE-ERROR-HANDLING.md` | Handling and presenting Supabase-specific errors
│       │   └── [104] `04.05.5.2_FORM-VALIDATION.md` | Input validation and error presentation
│       │
│       ├── 04.05.6_PERFORMANCE/ | UI performance optimization strategies
│       │   ├── [105] `04.05.6.1_IMAGE-OPTIMIZATION.md` | Strategies for efficient image handling
│       │   ├── [106] `04.05.6.2_DATA-LOADING-OPTIMIZATION.md` | Optimizing data loading for UI components
│       │   └── [107] `04.05.6.3_BUNDLE-OPTIMIZATION.md` | Minimizing bundle size for faster loading
│       │
│       └── 04.05.7_FORMAT-SPECIFIC-COMPONENTS/ | UI components tailored to specific debate formats
│           │  
│           ├── 04.05.7.1_EMD-FORMAT/ | Components for EMD debate format
│           │   ├── [108] `04.05.7.1.1_EMD-CHAMBER-COMPONENTS.md` | Debate chamber components EMD format
│           │   ├── [109] `04.05.7.1.2_EMD-JUDGING-COMPONENTS.md` | Judging components EMD format
│           │   └── [110] `04.05.7.1.3_EMD-ANALYTICS-COMPONENTS.md` | Analytics components EMD format
│           │
│           ├── 04.05.7.2_WSDC-FORMAT/ | Components for WSDC debate format
│           │   ├── [111] `04.05.7.2.1_WSDC-CHAMBER-COMPONENTS.md` | Debate chamber components WSDC format
│           │   ├── [112] `04.05.7.2.2_WSDC-JUDGING-COMPONENTS.md` | Judging components WSDC format
│           │   └── [113] `04.05.7.2.3_WSDC-ANALYTICS-COMPONENTS.md` | Analytics components WSDC format
│           │
│           └── 04.05.7.3_OTHER-FORMATS/ | Components for additional debate formats
│               ├── [114] `04.05.7.3.1_BP-FORMAT-COMPONENTS.md` | Components BP debate format
│               └── [115] `04.05.7.3.2_CUSTOM-FORMAT-COMPONENTS.md` | Framework implementing custom formats
│
│
├── 05_CROSS-DEVICE-COMPATIBILITY/ | Strategies for consistent performance across devices
│   │
│   ├── 05.01_PRINCIPLES/ | Core principles for cross-device optimization
│   │   └── [116] `05.01.1_SUPABASE-OPTIMIZATION-PRINCIPLES.md` | Leveraging Supabase features for optimal performance
│   │
│   ├── 05.02_DATA-STRATEGIES/ | Data handling strategies for different devices
│   │   ├── [117] `05.02.1_PROGRESSIVE-LOADING.md` | Implementing progressive data loading approaches
│   │   ├── [118] `05.02.2_DEVICE-OPTIMIZATION.md` | Device-specific data optimization techniques
│   │   └── [119] `05.02.3_PAGINATION-STRATEGY.md` | Efficient pagination for large data sets
│   │
│   ├── 05.03_CACHING/ | Caching strategies for improved performance
│   │   ├── [120] `05.03.1_SUPABASE-CACHING.md` | Leveraging Supabase caching capabilities
│   │   ├── [121] `05.03.2_COMPONENT-CACHING.md` | Caching strategies at the component level
│   │   └── [122] `05.03.3_OFFLINE-SUPPORT.md` | Implementation of offline functionality
│   │
│   ├── 05.04_MEDIA-OPTIMIZATION/ | Optimizing media for different devices
│   │   ├── [123] `05.04.1_ADAPTIVE-VIDEO.md` | Adaptive video delivery based on device capabilities
│   │   ├── [124] `05.04.2_RECORDING-OPTIMIZATION.md` | Optimized video recording across devices
│   │   └── [125] `05.04.3_PLAYBACK-OPTIMIZATION.md` | Efficient video playback with device considerations
│   │
│   ├── 05.05_DEVICE-SPECIFIC/ | Device-specific implementations
│   │   ├── [126] `05.05.1_MOBILE-OPTIMIZATION.md` | Optimizations specific to mobile devices
│   │   └── [127] `05.05.2_CROSS-BROWSER.md` | Ensuring compatibility across browsers
│   │
│   └── 05.06_MONITORING/ | Performance monitoring and optimization
│       └── [128] `05.06.1_PERFORMANCE-METRICS.md` | Measuring and tracking performance metrics
│
└── APPENDICES/ | Reference materials and supplementary documentation
    │
    ├── [A00] `GLOSSARY.md` | Terminology and definitions used throughout the platform
    ├── [A01] `SCHEMA-REFERENCE.md` | Comprehensive database schema reference
    ├── [A02] `QUERY-EXAMPLES.md` | Common query patterns with examples
    ├── [A03] `SCHEMA-DIAGRAMS.md` | Visual representations of database relationships
    └── [A04] `LAUNCH-PLAN.md` | Implementation timeline and deployment strategy





