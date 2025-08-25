---
created: '2025-08-23'
domain: core
priority: P1
purpose: Document system architecture components
session: legacy
status: current
title: System Architecture Components
topics:
- auth
- database
- documentation
type: guide
---

# System Architecture Components

This document outlines the major components of the EDL (EMD Debate League) platform.

## 1. Identified Components

### 1.1 Core Platform & Backend

*   **Supabase:** Core backend-as-a-service platform.
    *   **Supabase PostgreSQL:** Primary database (with `public` and `debate` schemas).
    *   **Supabase Auth:** Works in conjunction with the external SSO (`auth.emdash.one`). Manages user sessions within the dashboard (and other subdomains) by leveraging an authentication cookie set at the `.emdash.one` root domain. It is also used for API authorization and Row Level Security (RLS) in the database.
    *   **Supabase Realtime:** Powers real-time features.
    *   **Supabase Edge Functions:** For serverless logic (if used).
    *   *Note: Supabase Storage will NOT be used for high-volume video data.*
*   **n8n Workflows:** Automates various backend processes and integrations.

### 1.2 Frontend Applications

*   **Next.js/Tailwind Application (`dashboard.edl.emdash.one`):**
    *   Player/Student-facing interface.
    *   Admin Dashboard.
    *   Guardian Dashboard (for viewing student progress and managing links).
    *   Integrates with `auth.emdash.one` for SSO and Supabase Auth for session management.
*   **Noodl Application:** Low-code platform for specific user interfaces (e.g., potentially for Enablers like some categories of Judges or Coaches, or other specialized internal tools). Also integrates with the SSO via the root domain cookie.

### 1.3 Key Services & Features

*   **Matchmaking Service:**
    *   Responsible for pairing teams for debates based on defined rules.
    *   Considers:
        *   Team Rank/Rating.
        *   League Affiliation (Villager: 4-5, Lower: 6-7, Upper: 8-9, Senior: 10-12, Open: Adults).
        *   Debate Format requested (e.g., 1v1, 2v2, 3v3 per format rules).
        *   Challenge Mode status (allowing matching against upper divisions if enabled by all teammates).
    *   **Matchmaking Flows:**
        *   **Impromptu Sync:** Quick matchmaking, analogous to games like Overwatch/League of Legends. Players can queue solo or with a full team (depending on format). Matches opponents randomly (within rank/league constraints). Motion (topic) is assigned randomly. Debate begins 40 minutes after match found (prep time).
        *   **Prepared Sync:** Team A proposes motion(s) and available time slots. Team B (matched by rank/league) finds the proposal, selects a motion, selects a time slot, and confirms. Debate starts at the agreed time.
        *   **Async (EDL_ASYNC):** Similar to Prepared Sync, but proposals use time *ranges*. A response time limit (e.g., 12 hours) applies for each video submission.
        *   **Random Teammate Matching:** (Potential Feature) Option to find teammates randomly for certain debate types.
    *   *(Implementation likely involves Supabase database queries, triggers, and potentially Edge Functions for complex logic and scheduling.)*
*   **Ranking & Leveling System:**
    *   **Ranking:** Based on win/loss record. Wins increase rank points, losses decrease them. Specific point calculation TBD.
    *   **Leveling:** Based on Experience Points (EXP).
        *   EXP awarded after debates (potentially based on judge scores, win/loss status, participation).
        *   Level calculated from total EXP using `getLevelFromExp(exp)` function in `src/lib/utils.ts`, which depends on `requiredExpForLevel(level)`. Exact EXP award amounts TBD.
*   **Guild System:**
    *   Social hubs for players.
    *   Structure: Max 40 members per guild (tentative).
    *   Features:
        *   Guild Chat.
        *   Guild Ranking (based on aggregate member ranking points).
        *   (Further guild-specific activities/features TBD).
*   **Chat System:**
    *   Provides various communication channels.
    *   Scopes:
        *   Direct Messages (Player-to-Player).
        *   Team Chat (within a debate team).
        *   Guild Chat (within a guild).
    *   *(Implementation likely uses Supabase Realtime for message delivery and PostgreSQL for message history.)*
*   **Asynchronous Debate Video Handling:**
    *   Supports EDL_ASYNC (2v2 async) format involving video recordings.
    *   Manages the upload, storage, retrieval of debate videos.
    *   Video files stored in **External Object Storage** (see Section 1.5).
    *   Metadata stored in **Supabase PostgreSQL**.
*   **Platform Economy (emCoin):**
    *   In-platform currency used for certain actions.
    *   Usage: Required to enter debates.
    *   Refund Policy: If a participant fails to show up for a debate, their emCoin entry fee is refunded (except for the no-show participant).
*   **Notification System:**
    *   Handles sending notifications to users regarding platform events (e.g., new debate match, results available, pending requests, messages, reminders, chat mentions).
    *   Channels: In-app (via Supabase Realtime), Email (via external provider - see 1.6/TBD).
*   **Search Functionality:** (Medium Priority)
    *   Enables searching for debates, users, guilds, help content, etc.
    *   *(Technology to be determined, e.g., Supabase Full-Text Search, Algolia, Typesense)*

### 1.4 Authentication Service

*   **`auth.emdash.one` (External SSO Service):**
    *   Primary user identity verification portal.
    *   Sets authentication cookie at the `.emdash.one` root domain, enabling SSO across subdomains.
    *   This service is already implemented.

### 1.5 External Storage

*   **External Object Storage:** (e.g., AWS S3, Google Cloud Storage, Backblaze B2)
    *   For storing high-volume data like debate videos.

### 1.6 External Integrations (Other)

*   **Toss Payments:** Handles payment processing.

### 1.7 Potential Future Components / Lower Priority

*   **Content Management System (CMS):** (Low Priority)
    *   For managing static content, articles, FAQs.
*   **Analytics & Reporting Module:** (User tracking part is Low Priority)
    *   For system usage, engagement tracking.

## 2. Component Relationships and Interactions

This section outlines how the various system components interact. More detailed diagrams and specific API endpoints will be added as design progresses.

### 2.1 User Login Flow (SSO)

This flow describes how a user logs into the `dashboard.edl.emdash.one` application using the external SSO service (`auth.emdash.one`).

1.  **Initial Access Attempt:** User navigates to `dashboard.edl.emdash.one` (Next.js/Tailwind Application).
2.  **Authentication Check:** The Next.js application checks for a valid authentication cookie scoped to the `.emdash.one` root domain.
3.  **Redirect to SSO (if unauthenticated):** If a valid cookie is not present or has expired, the user is redirected to `auth.emdash.one` (External SSO Service).
4.  **User Authentication at SSO:** The user provides their credentials (or authenticates via other configured methods) on `auth.emdash.one`.
5.  **Cookie Issuance:** Upon successful authentication, `auth.emdash.one` issues an authentication cookie and sets it on the `.emdash.one` root domain. This cookie contains the necessary information to identify the user session.
6.  **Redirect back to Dashboard:** The user is redirected back to the original request URL, `dashboard.edl.emdash.one`.
7.  **Session Validation with Supabase Auth:** The Next.js application on `dashboard.edl.emdash.one` receives the request (now with the `.emdash.one` cookie). It interacts with **Supabase Auth** to validate this cookie and establish a user session within the dashboard's context.
8.  **Access Granted:** Supabase Auth confirms the user's identity. The Next.js application grants access to the dashboard.
    *   Subsequent requests from the dashboard to backend services (e.g., Supabase PostgreSQL for data) will be authorized based on this authenticated session, with data access governed by Row Level Security (RLS) policies managed by Supabase Auth.

### 2.2 Student Initiating a Debate Flow

This flow outlines the process for a student to create/join a team, select a debate format, and enter the matchmaking queue.

1.  **User Authenticated:** The student is already logged in (as per Flow 2.1).
2.  **Navigate to Team/Debate Section:** Student accesses the relevant section in the **Next.js/Tailwind Application** (`dashboard.edl.emdash.one`).
3.  **Team Formation/Management:**
    *   The student can create a new team. Joining an existing team will require an invitation from a current team member.
    *   The **Next.js Application** interacts with **Supabase PostgreSQL** to store/retrieve team details (team name, members).
    *   Team members are users whose profiles (including grade for league assignment) are stored in **Supabase PostgreSQL**.
4.  **Select Debate Format:**
    *   The team selects a debate format (e.g., Lincoln-Douglas, Public-Forum, EDL_ASYNC). The available formats and their rules (team size 1-3) are retrieved from **Supabase PostgreSQL**.
    *   The choice is recorded in **Supabase PostgreSQL** against the team's current debate intention.
5.  **Set Challenge Mode (Optional):**
    *   Each team member can individually enable/disable "Challenge Mode" via the **Next.js Application**.
    *   This status is stored in **Supabase PostgreSQL** associated with each user's team participation.
6.  **Enter Matchmaking Queue:**
    *   Once the team is ready (correct number of members for the format, all members confirmed), they can choose to enter the matchmaking queue via the **Next.js Application**.
    *   This action updates the team's status in **Supabase PostgreSQL** to "queued for match."
7.  **Matchmaking Process (Backend Logic - e.g., Supabase Edge Function or n8n Workflow):**
    *   A backend process continuously (or periodically) queries **Supabase PostgreSQL** for teams in the "queued for match" state.
    *   The matchmaking algorithm considers:
        *   **Debate Format:** Only matches teams that selected the same format.
        *   **League Affiliation:** Primarily matches teams within the same league (Villager, Lower, Upper, Senior, Open - derived from student grades stored in user profiles).
        *   **Team Rank:** Attempts to match teams with similar ranks (ranking data stored in **Supabase PostgreSQL**).
        *   **Challenge Mode:** If all members of a team have Challenge Mode enabled, the algorithm may also consider matching them against teams from one league division higher.
    *   This logic might involve complex queries and state management within **Supabase PostgreSQL** or the backend service.
8.  **Match Found & Notification:**
    *   When a suitable opponent team is found, the backend logic updates the status of both teams in **Supabase PostgreSQL** (e.g., "match found," debate ID created).
    *   The **Notification System** (via Supabase Realtime, email, or SMS) informs the team members that a match has been found and provides details to join the debate.
    *   The **Next.js Application** updates the UI for the students to reflect the match.
9.  **Debate Commences:**
    *   For synchronous debates, users are directed to the debate interface within the **Next.js Application**.
    *   For asynchronous debates (e.g., EDL_ASYNC), the flow would involve turns for uploading video arguments using the **Next.js Application**, with videos stored in **External Object Storage**, and links/metadata managed in **Supabase PostgreSQL**.

### 2.3 Admin Managing Users Flow

This flow describes how an administrator performs user management tasks, focusing on intervention for exceptions, moderation, or critical data corrections.

1.  **Admin Authentication:**
    *   Admin user logs into the **Next.js Application** (`dashboard.edl.emdash.one`) via `auth.emdash.one` (as per Flow 2.1).
    *   **Supabase Auth** (leveraging the SSO cookie and its own role/permission system) verifies the user has administrative privileges.
2.  **Access Admin Dashboard:**
    *   Admin navigates to the dedicated "Admin Dashboard" section within the **Next.js Application**.
3.  **User Search & Viewing:**
    *   Admin can search/filter the user list (students, guardians) stored in **Supabase PostgreSQL**.
    *   Admin can view detailed user profiles (most information read-only to prevent accidental changes).
4.  **Perform User Management Actions (via Admin Dashboard):**
    *   **Modify User Status:**
        *   *Example: Suspend/Unsuspend an account.*
        *   Admin selects a user.
        *   Admin chooses an action (e.g., "Suspend Account") and provides a reason (logged for audit).
        *   The **Next.js Application** sends a request to a secure backend endpoint (e.g., **Supabase Edge Function** or dedicated API managed by **n8n Workflow**).
        *   The backend logic updates the user's status in **Supabase PostgreSQL**.
        *   The **Notification System** might inform the user (if appropriate for the action).
    *   **Correct Critical User Data:**
        *   *Example: Correcting a student's grade.*
        *   Admin selects a user and the specific field (e.g., "Grade").
        *   Admin enters the corrected value and a reason for the change (logged for audit).
        *   The **Next.js Application** sends this to the secure backend endpoint.
        *   The backend logic validates and updates the user's profile in **Supabase PostgreSQL**. This might trigger recalculations for league placement.
    *   **Review User Activity/Reports (if applicable):**
        *   Admin views user-reported flags or activity logs relevant to a user (data from **Supabase PostgreSQL**).
        *   Based on the review, the admin might initiate one of the actions above or dismiss the report.
    *   **Role Management (for other admins/moderators):**
        *   Super-admin might assign/revoke admin or specific moderator roles to other users.
        *   This action would update role assignments in **Supabase PostgreSQL** or the auth system.
5.  **Audit Logging:**
    *   All significant administrative actions (e.g., status changes, data corrections) are logged in **Supabase PostgreSQL** (or a dedicated audit log table) with details of the admin performing the action, the user affected, the changes made, and timestamps.

### 2.4 Guardian Viewing Student Progress Flow (Next.js)

This flow describes how a guardian, using the Next.js application, views the progress of their linked student(s) and manages link requests.

1.  **Guardian Authentication:**
    *   Guardian user logs into the **Next.js Application** (`dashboard.edl.emdash.one`) via `auth.emdash.one` (as per Flow 2.1).
    *   **Supabase Auth** verifies the user and confirms their 'GUARDIAN' role by checking the `guardian` table (linked to their `profile.id` via `user_id`).
2.  **Access Guardian Dashboard:**
    *   Guardian is directed to their dedicated dashboard within the **Next.js Application**.
3.  **View Linked Students:**
    *   The dashboard queries **Supabase PostgreSQL** (respecting RLS) to fetch a list of students where `student.guardian_id` matches the logged-in guardian's `profile.id`.
    *   The **Next.js Application** displays the list of linked students (e.g., name, grade).
4.  **Select a Student to View Details:**
    *   Guardian selects a specific student from their list.
5.  **Display Student Progress Information:**
    *   The **Next.js Application** makes targeted queries to **Supabase PostgreSQL** to retrieve detailed progress information for the selected student. Key information includes:
        *   **Basic Profile:** Student's name, grade, school (from `profile` and `student` tables).
        *   **Debate Activity:** Upcoming debates, recent debate history (matches, opponents, dates, formats played) (from `debates`, `debate_teams`, `debate_participants`).
        *   **Performance Metrics:** Win/loss records, current ranking/EXP/level, league progression (from `student` table, and potentially aggregated from debate results).
        *   **Team Information:** Current team(s) and teammates (from `team`, `team_member`).
        *   **Payment History:** Transactions linked to the guardian for this student (from `payment_history`).
    *   This information is presented in a clear, organized manner in the Next.js UI.
6.  **Manage Guardian-Student Link Requests:**
    *   **Viewing Incoming Requests (Student to Guardian):**
        *   The Guardian Dashboard queries `guardian_request` where `receiver` is the guardian's `profile.id`, `status` is 'PENDING'.
        *   It fetches the `sender`'s profile (confirming they are a `student`) and displays the request.
        *   Guardian can **Accept** (updates `guardian_request.status` to 'ACCEPTED', sets `student.guardian_id` for the sender) or **Reject** (updates `guardian_request.status` to 'REJECTED').
    *   **Viewing Outgoing Requests (Guardian to Student - Pending Student Action):**
        *   The Guardian Dashboard queries `guardian_request` where `sender` is the guardian's `profile.id`, `status` is 'PENDING'.
        *   It fetches the `receiver`'s profile (confirming they are a `student`) and displays the pending request.
    *   **Initiating a New Request (Guardian to Student):**
        *   Guardian can search for a student (e.g., by username).
        *   Upon selection, a new row is inserted into `guardian_request` with `sender` = guardian's `profile.id`, `receiver` = student's `profile.id`, `status` = 'PENDING'.
        *   The student would see this incoming request on their dashboard.
    *   All linking actions are processed via secure backend calls (e.g., **Supabase Edge Functions**) to update **Supabase PostgreSQL**.

_(Further user flows and component interactions will be detailed here.)_

## 3. Technology Stack per Component

This section details the specific technologies, frameworks, and versions for each identified component.

### 3.1 Core Platform & Backend

**3.1.1 Supabase**
*   **Supabase PostgreSQL:**
    *   Database System: PostgreSQL (Managed by Supabase, typically a recent stable version, e.g., PostgreSQL 15.x or as specified by Supabase).
    *   Schema Definition: SQL DDL (as per `docs/schema.sql`).
    *   Key Extensions Used: `uuid-ossp` (for `gen_random_uuid()`), `pgjwt`.
*   **Supabase Auth:**
    *   Authentication Core: JWTs.
    *   Integration: Leverages external OpenID Connect (OIDC) provider (`auth.emdash.one`) through a custom authentication flow.
    *   Session Management: Handled within the Next.js application using `@supabase/ssr`.
    *   Authorization: Row Level Security (RLS) policies in PostgreSQL.
    *   Client Libraries: `@supabase/supabase-js`, `@supabase/ssr`.
*   **Supabase Realtime:**
    *   Protocol: WebSockets.
    *   Client Libraries: `@supabase/supabase-js`.
    *   Potential Use Cases: Real-time updates for debate status, notifications, chat features.
*   **Supabase Edge Functions:**
    *   Runtime: Deno.
    *   Language: TypeScript.
    *   Deployment: Via Supabase CLI.
    *   Potential Use Cases: Secure backend-only logic, complex mutations, data validation, communication with external services not suitable for client-side handling.

**3.1.2 n8n Workflows**
*   *(Placeholder - Not actively developed or detailed in this project phase by the current team. Technology typically Node.js based.)*

### 3.2 Frontend Applications

**3.2.1 Next.js/Tailwind Application (`dashboard.edl.emdash.one`)**
*   Framework: Next.js (Version: "latest" as per `package.json`)
*   Language: TypeScript
*   Styling: Tailwind CSS
    *   Utilities: `clsx`, `class-variance-authority`
*   UI Components:
    *   Library: Shadcn/UI
    *   Primitives: Radix UI (`@radix-ui/*`) (used by Shadcn/UI)
    *   Icons: Lucide React (`lucide-react`) (used by Shadcn/UI)
*   State Management: React Context API, built-in Next.js/React capabilities.
*   Data Fetching & Caching:
    *   Next.js built-in data fetching (App Router features like Server Components, Route Handlers).
    *   Supabase Client (`@supabase/ssr`, `@supabase/supabase-js`) for interaction with Supabase backend.
*   Forms: TBD/Custom (No specific large form library identified in `package.json` snippet).
*   Linting/Formatting: Prettier (as per `package.json`)
*   Analytics & Monitoring: Vercel Analytics (`@vercel/analytics`), Vercel Speed Insights (`@vercel/speed-insights`).
*   Deployment: Vercel.
*   Package Manager: npm or yarn (based on `package.json`).
*   Key Dependencies (from `package.json`):
    *   `@supabase/ssr: "latest"`
    *   `@supabase/supabase-js: "latest"`
    *   `next: "latest"`
    *   `react: "19.0.0"`
    *   `tailwindcss` (via `@tailwindcss/postcss`)

**3.2.2 Noodl Application**
*   *(Placeholder - Not actively developed or detailed in this project phase by the current team. Low-code platform.)*

## 4. Communication Patterns

This section documents how the system components communicate.

### 4.1 Next.js Application <-> Supabase Backend

*   **Purpose:** Data persistence, retrieval, real-time updates, authentication state management, secure backend logic execution.
*   **Database (PostgreSQL):**
    *   **Method:** Direct database interaction via Supabase client libraries (`@supabase/supabase-js`, `@supabase/ssr`).
    *   **Protocol:** HTTPS (for client library API calls which translate to secure database connections managed by Supabase).
    *   **Usage:** Primarily from Next.js Server Components, Route Handlers, and potentially Supabase Edge Functions for data fetching and mutations. Client Components use the library for subscriptions or client-side mutations where appropriate. RLS ensures data security.
*   **Authentication (Auth):**
    *   **Method:** Supabase client libraries (`@supabase/ssr` for server-side session management, `@supabase/supabase-js` for client-side auth state).
    *   **Protocol:** HTTPS.
    *   **Usage:** Handling sign-in/sign-out, managing sessions based on cookies (set by external SSO, interpreted by Supabase), retrieving user profiles, checking auth state.
*   **Realtime:**
    *   **Method:** Supabase client libraries (`@supabase/supabase-js`).
    *   **Protocol:** WebSockets (secure connection managed by Supabase).
    *   **Usage:** Subscribing to database changes (e.g., new notifications, debate status updates) for real-time UI updates in Client Components.
*   **Edge Functions:**
    *   **Method:** Invoked via Supabase client libraries (`@supabase/supabase-js`).
    *   **Protocol:** HTTPS.
    *   **Usage:** Executing serverless functions for tasks requiring backend logic that shouldn't reside in the client or database (e.g., complex validation, third-party API calls, processing requiring elevated privileges not granted by RLS alone).

### 4.2 Next.js Application <-> External SSO (`auth.emdash.one`)

*   **Purpose:** Initial user authentication and identity verification.
*   **Method:** Standard OpenID Connect (OIDC) / OAuth 2.0 redirect flow.
*   **Protocol:** HTTPS.
*   **Usage:**
    1.  Unauthenticated user attempts to access a protected route in the Next.js app.
    2.  Next.js app (potentially via Supabase Auth helper or custom logic) redirects the user's browser to `auth.emdash.one`.
    3.  User authenticates with the SSO provider.
    4.  SSO provider redirects the user's browser back to a callback URL in the Next.js app with an authorization code or tokens.
    5.  Next.js backend exchanges the code/validates tokens (potentially involving Supabase Auth) to establish a Supabase session, leveraging the SSO's authentication cookie set at the root `.emdash.one` domain.

### 4.3 Next.js Application <-> User Browser

*   **Purpose:** Serving the application UI, handling user interactions.
*   **Method:** Standard web interactions.
*   **Protocols:**
    *   HTTPS: For serving Next.js pages (HTML, CSS, JS), API routes/Route Handlers, and client-server communication.
    *   WebSockets: For real-time features mediated by Supabase Realtime (see 4.1).

### 4.4 Other Communication Patterns

*   **Noodl Application <-> Supabase:**
    *   **Purpose:** Fetching data needed for specialized UIs (e.g., Judge interface), potentially saving judgement data.
    *   **Method:** Likely via Supabase client libraries (JS) embedded within Noodl, or potentially via Supabase REST API.
    *   **Protocol:** HTTPS.
*   **Noodl Application <-> n8n Workflows:**
    *   **Purpose:** Triggering backend workflows from Noodl UI actions (e.g., submitting a judgement that requires complex processing or AI analysis).
    *   **Method:** Noodl calling a webhook endpoint exposed by an n8n workflow.
    *   **Protocol:** HTTPS.
*   **n8n Workflows <-> Supabase:**
    *   **Purpose:** Reading data for workflows (e.g., debate details for AI judging), writing results back (e.g., AI judge scores, automated task outcomes).
    *   **Method:** Direct database connections (if n8n has credentials) or interaction via Supabase REST API / Edge Functions.
    *   **Protocol:** HTTPS (for API/Functions), Secure DB connection.
*   **n8n Workflows <-> External Services:**
    *   **Purpose:** Integrating with third-party services (e.g., sending emails, calling external AI models for judging, interacting with payment gateways if needed).
    *   **Method:** Using n8n's built-in nodes for specific services or generic HTTP request nodes.
    *   **Protocol:** Varies by service (typically HTTPS).
