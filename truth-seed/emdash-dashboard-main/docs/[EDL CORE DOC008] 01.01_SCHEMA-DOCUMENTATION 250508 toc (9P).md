EDL 01_DATABASE-ARCHITECTURE/

# 01.01_SCHEMA-DOCUMENTATION

## 0. 01.01 Table of Contents

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

## 1. Introduction

### 1.1 Purpose of this document
This document serves as a comprehensive reference for the EDL (Emdash Debate League) database schema architecture. It outlines table structures, relationships, and implementation patterns to support the platform's core functionality around debate management, judging, and feedback using Supabase as the foundation.

### 1.2 Schema organization overview
The EDL database is organized into two primary schemas:
- **Public schema**: Contains user management, authentication, team organization, and general platform structures
- **Debate schema**: Contains formats, rounds, motions, evaluation systems, and debate content

### 1.3 How to use this reference
- **Developers**: Use this document to understand table relationships when implementing new features or modifying existing ones
- **System architects**: Reference this when planning schema extensions or optimizations
- **n8n workflow designers**: Consult this to ensure correct data paths in workflow automations

## 2. Schema Architecture

### 2.1 Public Schema (user data, teams, etc.)
The public schema contains user-related tables, authentication, and organizational structures:

- **profile**: Central user information linked to Supabase Auth
- **student/guardian/judge**: Role-specific user data
- **team/team_member**: Team management structures
- **friendship/presence**: Social and online status tracking

### 2.2 Debate Schema (formats, rounds, judging)
The debate schema contains all debate-specific tables:

- **Format System**: debate_formats, round_templates, format_rounds, sides
- **Content Management**: genres, motions, motion_categories
- **Debate Execution**: debates, debate_teams, debate_participants
- **Content Capture**: speeches, videos
- **Evaluation System**: criteria, judge_scores, judge_comments

### 2.3 Cross-Schema Relationships
Several debate schema tables reference entities in the public schema:

- **debate_participants.user_id** → public.student.user_id
- **genres.proposer_id** → public.profile.id
- **judge_comments.judge_id** → public.judge.user_id
- **judge_scores.judge_id** → public.judge.user_id
- **motions.proposer_id** → public.profile.id
- **videos.uploaded_by** → public.profile.id

### 2.4 Authentication Schema Integration
The authentication system leverages Supabase Auth and integrates with the platform through:

- **auth.users**: Managed by Supabase Auth for authentication
- **public.profile**: Extended user information linked to auth.users
- **Role tables**: student, guardian, judge tables for role-specific data
- **Row-Level Security (RLS)**: Policies that enforce access controls based on user identity

Supabase Auth provides JWT-based authentication, with user roles determining access rights. The profile table extends the auth.users data with application-specific information, and RLS policies ensure users can only access data they're authorized to view.

## 3. Debate Format System

### 3.1 Core Components

#### Formats (debate_formats)
The foundation of the format system, defining different debate styles (EMD, WSDC, etc.):

```
id: uuid (PK)
name: text (UNIQUE)
description: text
```

#### Round Templates (round_templates)
Reusable templates for different speech types:

```
id: uuid (PK)
code: text (UNIQUE)
name: text
description: text
default_time: integer
```

#### Format Rounds (format_rounds)
Links formats to round templates in a specific sequence:

```
id: uuid (PK)
debate_format_id: uuid (FK → debate_formats.id)
round_template_id: uuid (FK → round_templates.id)
sequence: integer
side_id: uuid (FK → sides.id)
speaker_positions: ARRAY
number_of_speakers: smallint
```

The format_rounds table has a unique constraint on (debate_format_id, sequence) ensuring proper ordering.

#### Sides (sides)
Represents debate positions (e.g., Affirmative, Negative):

```
id: uuid (PK)
title: text (UNIQUE)
```

### 3.2 Implementation Guidelines

#### Creating a new debate format
1. Insert a record into `debate_formats`
2. For each round in the format:
   - Reference the appropriate `round_template`
   - Assign the correct `side_id`
   - Set the `sequence` number
   - Define required `speaker_positions`
   - Specify `number_of_speakers`

#### Configuring round sequences
- The `sequence` field in `format_rounds` determines the order of speeches
- Each format has a unique set of rounds with non-repeating sequence numbers
- The unique constraint `format_rounds_format_sequence_unique` ensures integrity

#### Managing format-specific rules
- Different formats (EMD, WSDC, etc.) have different round structures
- Round templates can be reused across formats (e.g., "constructive speech")
- Speaker positions array maps to specific roles in debates

### 3.3 Code Examples

#### Querying available formats

```javascript
// In a Noodl JavaScript Function node
const supabase = Noodl.Variables.supabase;

try {
  const { data, error } = await supabase
    .from('debate_formats')
    .select('id, name, description');
  
  if (error) throw error;
  
  Outputs.formats = data;
  Outputs.Success();
} catch (error) {
  console.error("Format fetch error:", error);
  Outputs.error = error.message;
  Outputs.Failure();
}
```

#### Format detail retrieval with rounds

```javascript
// In a Noodl JavaScript Function node
const supabase = Noodl.Variables.supabase;
const formatId = Inputs.formatId;

try {
  // Get format details
  const { data: format, error: formatError } = await supabase
    .from('debate_formats')
    .select('id, name, description')
    .eq('id', formatId)
    .single();
  
  if (formatError) throw formatError;
  
  // Get rounds for this format with templates and sides
  const { data: rounds, error: roundsError } = await supabase
    .from('format_rounds')
    .select(`
      id, 
      sequence, 
      number_of_speakers,
      speaker_positions,
      round_template:round_template_id (
        id, 
        code, 
        name, 
        description, 
        default_time
      ),
      side:side_id (
        id,
        title
      )
    `)
    .eq('debate_format_id', formatId)
    .order('sequence');
  
  if (roundsError) throw roundsError;
  
  // Combine format with rounds
  Outputs.formatDetails = {
    ...format,
    rounds
  };
  
  Outputs.Success();
} catch (error) {
  console.error("Format details error:", error);
  Outputs.error = error.message;
  Outputs.Failure();
}
```

#### Round sequence management

```javascript
// In a Noodl JavaScript Function node
// Function to reorder rounds in a debate format
const supabase = Noodl.Variables.supabase;
const formatId = Inputs.formatId;
const roundSequences = Inputs.roundSequences; // Array of {id, newSequence}

try {
  // We need to update each round's sequence
  const updates = roundSequences.map(item => 
    supabase
      .from('format_rounds')
      .update({ sequence: item.newSequence })
      .eq('id', item.id)
      .eq('debate_format_id', formatId)
  );
  
  // Execute all updates
  const results = await Promise.all(updates);
  
  // Check for errors
  const errors = results.filter(result => result.error);
  if (errors.length > 0) {
    throw new Error(`${errors.length} updates failed: ${errors[0].error.message}`);
  }
  
  Outputs.Success();
} catch (error) {
  console.error("Sequence update error:", error);
  Outputs.error = error.message;
  Outputs.Failure();
}
```

## 4. Debate Management

### 4.1 Core Components

#### Debates (debates)
The central entity representing a debate instance:

```
id: uuid (PK)
debate_format_id: uuid (FK → debate_formats.id)
motion_id: uuid (FK → motions.id)
scheduled_at: timestamp with time zone
created_at: timestamp with time zone
mode: ENUM ('SYNC', 'ASYNC')
```

#### Debate Teams (debate_teams)
Links debates to teams on specific sides:

```
id: uuid (PK)
debate_id: uuid (FK → debates.id)
side_id: uuid (FK → sides.id)
```

#### Debate Participants (debate_participants)
Individual participants within a debate team:

```
id: uuid (PK)
debate_team_id: uuid (FK → debate_teams.id)
user_id: uuid (FK → public.student.user_id)
invite_status: ENUM ('PENDING', 'ACCEPTED', 'DECLINED')
speaker_position: smallint
```

### 4.2 Implementation Guidelines

#### Creating synchronous vs. asynchronous debates
1. Create a debate record with the appropriate `mode` (SYNC or ASYNC)
2. For synchronous debates:
   - Set scheduled_at to the planned time
   - Configure live debate parameters
3. For asynchronous debates:
   - Set scheduled_at to null or a start window
   - Configure turn timeframes through related settings

#### Managing team assignments
1. Create debate_team records for each side of the debate
2. Link teams to the appropriate sides based on format requirements
3. Ensure all required sides for the format have teams assigned

#### Participant invitations and confirmations
1. Create debate_participant records with invite_status = 'PENDING'
2. Assign speaker_position based on format requirements
3. Update invite_status when participants confirm participation

### 4.3 Code Examples

#### Creating a new debate

```javascript
// In a Noodl JavaScript Function node
const supabase = Noodl.Variables.supabase;

try {
  // Create the debate
  const { data: debate, error: debateError } = await supabase
    .from('debates')
    .insert({
      debate_format_id: Inputs.formatId,
      motion_id: Inputs.motionId,
      scheduled_at: Inputs.isSync ? Inputs.scheduledTime : null,
      mode: Inputs.isSync ? 'SYNC' : 'ASYNC',
      created_at: new Date()
    })
    .select()
    .single();
  
  if (debateError) throw debateError;
  
  Outputs.debateId = debate.id;
  Outputs.Success();
} catch (error) {
  console.error("Debate creation error:", error);
  Outputs.error = error.message;
  Outputs.Failure();
}
```

#### Adding teams and participants

```javascript
// In a Noodl JavaScript Function node
const supabase = Noodl.Variables.supabase;
const debateId = Inputs.debateId;
const teamData = Inputs.teamData; // {sideId, teamId, participants: [{userId, position}]}

try {
  // Create the debate team
  const { data: debateTeam, error: teamError } = await supabase
    .from('debate_teams')
    .insert({
      debate_id: debateId,
      side_id: teamData.sideId
    })
    .select()
    .single();
  
  if (teamError) throw teamError;
  
  // Create debate participants
  const participants = teamData.participants.map(p => ({
    debate_team_id: debateTeam.id,
    user_id: p.userId,
    speaker_position: p.position,
    invite_status: 'PENDING'
  }));
  
  const { error: participantError } = await supabase
    .from('debate_participants')
    .insert(participants);
  
  if (participantError) throw participantError;
  
  Outputs.Success();
} catch (error) {
  console.error("Team assignment error:", error);
  Outputs.error = error.message;
  Outputs.Failure();
}
```

#### Handling invitations

```javascript
// In a Noodl JavaScript Function node
const supabase = Noodl.Variables.supabase;
const participantId = Inputs.participantId;
const newStatus = Inputs.status; // 'ACCEPTED' or 'DECLINED'

try {
  // Update the participant status
  const { error } = await supabase
    .from('debate_participants')
    .update({ invite_status: newStatus })
    .eq('id', participantId);
  
  if (error) throw error;
  
  // If this is the last pending participant, we might want to
  // update the debate status or trigger notifications
  if (newStatus === 'ACCEPTED') {
    // Trigger notification to other participants
    triggerTeamNotification(participantId);
  }
  
  Outputs.Success();
} catch (error) {
  console.error("Invitation update error:", error);
  Outputs.error = error.message;
  Outputs.Failure();
}

// Helper function to notify team members
async function triggerTeamNotification(participantId) {
  try {
    // Get the team ID for this participant
    const { data, error } = await supabase
      .from('debate_participants')
      .select('debate_team_id')
      .eq('id', participantId)
      .single();
      
    if (error) throw error;
    
    // Here you would trigger n8n workflow for notifications
    console.log("Should notify team:", data.debate_team_id);
    
    // In practice, you would call your n8n webhook
  } catch (e) {
    console.error("Notification error:", e);
  }
}
```

## 5. Speech and Content Management

### 5.1 Core Components

#### Speeches (speeches)
Records of individual speeches within a debate:

```
id: uuid (PK)
debate_id: uuid (FK → debates.id)
format_round_id: uuid (FK → format_rounds.id)
participant_id: uuid (FK → debate_participants.id)
content: text
delivered_at: timestamp with time zone
duration_seconds: integer
```

#### Videos (videos)
Video recordings of speeches:

```
id: uuid (PK)
debate_id: uuid (FK → debates.id)
storage_path: text
url: text
uploaded_by: uuid (FK → public.profile.id)
uploaded_at: timestamp with time zone
```

### 5.2 Implementation Guidelines

#### Managing speech content
1. Create speech records for each participant's contribution
2. Link to the appropriate format_round to indicate speech type
3. Store text content if available (e.g., transcript)
4. Track timing with delivered_at and duration_seconds

#### Video storage and retrieval
1. Store videos in Supabase Storage
2. Record storage_path and public url
3. Link videos to debates for organized access
4. Track upload metadata (who, when)

#### Synchronous vs. asynchronous speech handling
- **Synchronous**: All speeches occur within a scheduled timeframe
- **Asynchronous**: Speeches are recorded sequentially over time
- Link to debate.mode to determine appropriate UI and time constraints

### 5.3 Code Examples

#### Recording speeches

```javascript
// In a Noodl JavaScript Function node
const supabase = Noodl.Variables.supabase;

try {
  // Create the speech record
  const { data: speech, error: speechError } = await supabase
    .from('speeches')
    .insert({
      debate_id: Inputs.debateId,
      format_round_id: Inputs.roundId,
      participant_id: Inputs.participantId,
      content: Inputs.transcript || null,
      delivered_at: new Date(),
      duration_seconds: Inputs.durationSeconds || null
    })
    .select()
    .single();
  
  if (speechError) throw speechError;
  
  Outputs.speechId = speech.id;
  Outputs.Success();
} catch (error) {
  console.error("Speech recording error:", error);
  Outputs.error = error.message;
  Outputs.Failure();
}
```

#### Uploading videos

```javascript
// In a Noodl JavaScript Function node
const supabase = Noodl.Variables.supabase;
const userId = Noodl.Objects.currentUser?.auth?.id;

if (!userId) {
  Outputs.error = "User not authenticated";
  Outputs.Failure();
  return;
}

try {
  // Generate file path
  const fileName = `debate_${Inputs.debateId}_${Date.now()}.mp4`;
  const filePath = `debates/${fileName}`;
  
  // Upload to Supabase Storage
  const { data: storageData, error: storageError } = await supabase.storage
    .from('videos')
    .upload(filePath, Inputs.videoFile);
  
  if (storageError) throw storageError;
  
  // Get public URL
  const { data: urlData } = supabase.storage
    .from('videos')
    .getPublicUrl(filePath);
  
  // Create video record
  const { data: video, error: videoError } = await supabase
    .from('videos')
    .insert({
      debate_id: Inputs.debateId,
      storage_path: filePath,
      url: urlData.publicUrl,
      uploaded_by: userId,
      uploaded_at: new Date()
    })
    .select()
    .single();
  
  if (videoError) throw videoError;
  
  Outputs.videoId = video.id;
  Outputs.videoUrl = video.url;
  Outputs.Success();
} catch (error) {
  console.error("Video upload error:", error);
  Outputs.error = error.message;
  Outputs.Failure();
}
```

#### Retrieving speech content

```javascript
// In a Noodl JavaScript Function node
const supabase = Noodl.Variables.supabase;
const debateId = Inputs.debateId;

try {
  // Get all speeches for this debate with participant info
  const { data, error } = await supabase
    .from('speeches')
    .select(`
      id,
      content,
      delivered_at,
      duration_seconds,
      format_round:format_round_id (
        id,
        round_template:round_template_id (
          code,
          name
        )
      ),
      participant:participant_id (
        id,
        user_id,
        speaker_position,
        team:debate_team_id (
          side:side_id (
            title
          )
        )
      )
    `)
    .eq('debate_id', debateId)
    .order('delivered_at');
  
  if (error) throw error;
  
  // Get corresponding videos
  const { data: videos, error: videosError } = await supabase
    .from('videos')
    .select('id, url, uploaded_at')
    .eq('debate_id', debateId);
  
  if (videosError) throw videosError;
  
  Outputs.speeches = data;
  Outputs.videos = videos;
  Outputs.Success();
} catch (error) {
  console.error("Speech content error:", error);
  Outputs.error = error.message;
  Outputs.Failure();
}
```

## 6. Judging and Evaluation System

### 6.1 Core Components

#### Criteria (criteria)
Evaluation criteria organized by groups:

```
id: uuid (PK)
group: ENUM ('RESPECT', 'ANALYSIS', 'STYLE')
name: text
criteria: text
label: text
```

#### Judge Comments (judge_comments)
Timestamped feedback on specific criteria:

```
id: uuid (PK)
video_id: uuid (FK → videos.id)
judge_id: uuid (FK → public.judge.user_id)
criteria_id: uuid (FK → criteria.id)
at_seconds: integer
comment: text
created_at: timestamp with time zone
```

#### Judge Scores (judge_scores)
Numerical scores for criteria:

```
id: uuid (PK)
debate_id: uuid (FK → debates.id)
judge_id: uuid (FK → public.judge.user_id)
criteria_id: uuid (FK → criteria.id)
score: numeric
created_at: timestamp with time zone
```

### 6.2 Implementation Guidelines

#### Implementing the three criteria groups
- **RESPECT**: Criteria R01-R06 - Respectful engagement, etiquette, fairness
- **ANALYSIS**: Criteria A07-A10 - Logical reasoning, evidence use, argument quality
- **STYLE**: Criteria S11-S14 - Delivery, rhetoric, persuasiveness, clarity

#### Managing score submissions
1. Create judge_scores records for each criteria being evaluated
2. Set default score to 1.5 as specified in requirements
3. Update scores as judges refine their evaluations
4. Calculate category subtotals and debate totals

#### Video timestamp-linked feedback
1. Create judge_comments linked to specific videos
2. Use at_seconds to mark the point in the video being referenced
3. Link to criteria to organize feedback by category
4. Track creation time for progressive evaluation

### 6.3 Code Examples

#### Submitting scores

```javascript
// In a Noodl JavaScript Function node
const supabase = Noodl.Variables.supabase;
const userId = Noodl.Objects.currentUser?.auth?.id;

if (!userId) {
  Outputs.error = "User not authenticated";
  Outputs.Failure();
  return;
}

try {
  // Get judge ID for current user
  const { data: judgeData, error: judgeError } = await supabase
    .from('judge')
    .select('user_id')
    .eq('user_id', userId)
    .single();
  
  if (judgeError) throw judgeError;
  
  // Prepare score records
  const scoreRecords = Inputs.scores.map(score => ({
    debate_id: Inputs.debateId,
    judge_id: judgeData.user_id,
    criteria_id: score.criteriaId,
    score: score.value,
    created_at: new Date()
  }));
  
  // Insert or update scores
  const { error: scoreError } = await supabase
    .from('judge_scores')
    .upsert(scoreRecords, {
      onConflict: 'debate_id,judge_id,criteria_id',
      ignoreDuplicates: false
    });
  
  if (scoreError) throw scoreError;
  
  Outputs.Success();
} catch (error) {
  console.error("Score submission error:", error);
  Outputs.error = error.message;
  Outputs.Failure();
}
```

#### Adding timestamped comments

```javascript
// In a Noodl JavaScript Function node
const supabase = Noodl.Variables.supabase;
const userId = Noodl.Objects.currentUser?.auth?.id;

if (!userId) {
  Outputs.error = "User not authenticated";
  Outputs.Failure();
  return;
}

try {
  // Get judge ID for current user
  const { data: judgeData, error: judgeError } = await supabase
    .from('judge')
    .select('user_id')
    .eq('user_id', userId)
    .single();
  
  if (judgeError) throw judgeError;
  
  // Create the comment
  const { data: comment, error: commentError } = await supabase
    .from('judge_comments')
    .insert({
      video_id: Inputs.videoId,
      judge_id: judgeData.user_id,
      criteria_id: Inputs.criteriaId,
      at_seconds: Inputs.timePosition,
      comment: Inputs.commentText,
      created_at: new Date()
    })
    .select()
    .single();
  
  if (commentError) throw commentError;
  
  Outputs.commentId = comment.id;
  Outputs.Success();
} catch (error) {
  console.error("Comment creation error:", error);
  Outputs.error = error.message;
  Outputs.Failure();
}
```

#### Retrieving judging results

```javascript
// In a Noodl JavaScript Function node
const supabase = Noodl.Variables.supabase;
const debateId = Inputs.debateId;

try {
  // Get all scores grouped by criteria
  const { data: scores, error: scoresError } = await supabase
    .from('judge_scores')
    .select(`
      id,
      score,
      created_at,
      judge_id,
      criteria:criteria_id (
        id,
        name,
        group,
        label
      )
    `)
    .eq('debate_id', debateId);
  
  if (scoresError) throw scoresError;
  
  // Get all comments with timestamps
  const { data: comments, error: commentsError } = await supabase
    .from('judge_comments')
    .select(`
      id,
      comment,
      at_seconds,
      created_at,
      judge_id,
      criteria:criteria_id (
        id,
        name,
        group
      ),
      video:video_id (
        id,
        url
      )
    `)
    .eq('video.debate_id', debateId);
  
  if (commentsError) throw commentsError;
  
  // Calculate totals by category
  const totals = calculateScoreTotals(scores);
  
  Outputs.scores = scores;
  Outputs.comments = comments;
  Outputs.totals = totals;
  Outputs.Success();
} catch (error) {
  console.error("Results retrieval error:", error);
  Outputs.error = error.message;
  Outputs.Failure();
}

// Helper function to calculate totals
function calculateScoreTotals(scores) {
  const totals = {
    RESPECT: 0,
    ANALYSIS: 0,
    STYLE: 0,
    total: 0
  };
  
  scores.forEach(item => {
    const group = item.criteria.group;
    const score = parseFloat(item.score) || 0;
    
    if (group in totals) {
      totals[group] += score;
    }
    
    totals.total += score;
  });
  
  return totals;
}
```

## 7. Content Management

### 7.1 Core Components

#### Genres (genres)
Broad categories for debate topics:

```
id: uuid (PK)
title: text
description: text
proposer_id: uuid (FK → public.profile.id)
created_at: timestamp with time zone
updated_at: timestamp with time zone
```

#### Motion Categories (motion_categories)
More specific categorization of motions:

```
id: uuid (PK)
name: text
created_at: timestamp with time zone
updated_at: timestamp with time zone
```

#### Motions (motions)
Debate topics with categorization:

```
id: uuid (PK)
topic: text
genre_id: uuid (FK → genres.id)
category_id: uuid (FK → motion_categories.id)
proposer_id: uuid (FK → public.profile.id)
details: text
created_at: timestamp with time zone
updated_at: timestamp with time zone
```

### 7.2 Implementation Guidelines

#### Managing debate topics
1. Create genres as broad topic areas
2. Define motion categories for finer classification
3. Create motion records with links to appropriate genre and category
4. Track authorship through proposer_id

#### Genre and category organization
- Genres represent broad subject areas (e.g., Politics, Ethics, Economics)
- Categories represent motion types (e.g., Policy, Value, Fact)
- Use this two-level classification for better organization and filtering

### 7.3 Code Examples

#### Creating and retrieving motions

```javascript
// In a Noodl JavaScript Function node
const supabase = Noodl.Variables.supabase;
const userId = Noodl.Objects.currentUser?.auth?.id;

if (!userId) {
  Outputs.error = "User not authenticated";
  Outputs.Failure();
  return;
}

try {
  // Create the motion
  const { data: motion, error: motionError } = await supabase
    .from('motions')
    .insert({
      topic: Inputs.topic,
      genre_id: Inputs.genreId,
      category_id: Inputs.categoryId,
      proposer_id: userId,
      details: Inputs.details || null,
      created_at: new Date(),
      updated_at: new Date()
    })
    .select()
    .single();
  
  if (motionError) throw motionError;
  
  Outputs.motionId = motion.id;
  Outputs.Success();
} catch (error) {
  console.error("Motion creation error:", error);
  Outputs.error = error.message;
  Outputs.Failure();
}
```

#### Topic filtering

```javascript
// In a Noodl JavaScript Function node
const supabase = Noodl.Variables.supabase;

try {
  // Start with base query
  let query = supabase
    .from('motions')
    .select(`
      id,
      topic,
      details,
      created_at,
      genre:genre_id (
        id,
        title
      ),
      category:category_id (
        id,
        name
      )
    `);
  
  // Apply filters if provided
  if (Inputs.genreId) {
    query = query.eq('genre_id', Inputs.genreId);
  }
  
  if (Inputs.categoryId) {
    query = query.eq('category_id', Inputs.categoryId);
  }
  
  if (Inputs.searchTerm) {
    query = query.ilike('topic', `%${Inputs.searchTerm}%`);
  }
  
  // Add pagination
  if (Inputs.limit) {
    query = query.limit(Inputs.limit);
  }
  
  if (Inputs.offset) {
    query = query.offset(Inputs.offset);
  }
  
  // Execute query
  const { data, error, count } = await query;
  
  if (error) throw error;
  
  Outputs.motions = data;
  Outputs.Success();
} catch (error) {
  console.error("Motion filtering error:", error);
  Outputs.error = error.message;
  Outputs.Failure();
}
```

#### Genre-based organization

```javascript
// In a Noodl JavaScript Function node
const supabase = Noodl.Variables.supabase;

try {
  // Get all genres with counts
  const { data: genres, error: genresError } = await supabase
    .from('genres')
    .select(`
      id,
      title,
      description,
      motions:motions (
        id
      )
    `);
  
  if (genresError) throw genresError;
  
  // Process to add counts
  const genresWithCounts = genres.map(genre => ({
    id: genre.id,
    title: genre.title,
    description: genre.description,
    motionCount: genre.motions ? genre.motions.length : 0
  }));
  
  Outputs.genres = genresWithCounts;
  Outputs.Success();
} catch (error) {
  console.error("Genre organization error:", error);
  Outputs.error = error.message;
  Outputs.Failure();
}
```

## 8. Cross-Schema Operations

### 8.1 User Integration

#### Linking debate participants to students
- debate_participants.user_id references public.student.user_id
- This links students from the public schema to their debate roles

#### Judge authorization and access
- judge_comments.judge_id and judge_scores.judge_id reference public.judge.user_id
- This links judges from the public schema to their evaluations

#### Content ownership and attribution
- genres.proposer_id, motions.proposer_id reference public.profile.id
- videos.uploaded_by references public.profile.id
- These track authorship and ownership across schemas

### 8.2 Implementation Guidelines

#### Proper cross-schema joins
- Use `supabase.from('tablename').select()` with nested selects for related tables
- Specify schema in the table name when necessary (e.g., `'public.profile'`)
- When joining tables, use explicit schema references in your joins

#### Performance considerations
- Cross-schema joins can be more expensive than single-schema operations
- Cache frequently accessed cross-schema data when appropriate
- Use indexed columns for cross-schema relationships (already set up in your schema)

#### Data consistency requirements
- Ensure referential integrity across schemas
- Use transactions when updating related records in different schemas
- Handle deletion carefully where cross-schema references exist

### 8.3 Code Examples

#### Cross-schema queries in Noodl

```javascript
// In a Noodl JavaScript Function node
// Get debate participants with student profile info
const supabase = Noodl.Variables.supabase;
const debateId = Inputs.debateId;

try {
  // First get the debate teams
  const { data: teams, error: teamsError } = await supabase
    .from('debate_teams')
    .select('id, side_id')
    .eq('debate_id', debateId);
  
  if (teamsError) throw teamsError;
  
  // Get all team IDs
  const teamIds = teams.map(team => team.id);
  
  // Get participants with profile info
  const { data: participants, error: participantsError } = await supabase
    .from('debate_participants')
    .select(`
      id,
      speaker_position,
      invite_status,
      debate_team_id,
      student:user_id (
        user_id,
        profile:user_id (
          id,
          email,
          name,
          image_path
        )
      )
    `)
    .in('debate_team_id', teamIds);
  
  if (participantsError) throw participantsError;
  
  Outputs.participants = participants;
  Outputs.Success();
} catch (error) {
  console.error("Cross-schema query error:", error);
  Outputs.error = error.message;
  Outputs.Failure();
}
```

#### Cross-schema operations in n8n

```javascript
// Example n8n workflow node for debate registration with cross-schema operations
// This would be implemented in n8n's JavaScript module

// Get student profile from authentication
const userId = $input.item.auth.id;

// First, get the student record
const studentResult = await $supabase
  .from('student')
  .select('id, division')
  .eq('user_id', userId)
  .single();

if (studentResult.error) {
  throw new Error(`Student record error: ${studentResult.error.message}`);
}

const studentId = studentResult.data.id;
const division = studentResult.data.division;

// Check if debate exists and is compatible with student division
const debateResult = await $supabase
  .from('debates')
  .select(`
    id, 
    debate_format_id,
    debate_format:debate_format_id (
      name,
      id
    )
  `)
  .eq('id', $input.item.debateId)
  .single();

if (debateResult.error) {
  throw new Error(`Debate record error: ${debateResult.error.message}`);
}

// Create the registration
// This involves both debate schema and potentially notifying users
// in the public schema
const registrationResult = await $supabase
  .from('debate_participants')
  .insert({
    debate_team_id: $input.item.teamId,
    user_id: userId,
    speaker_position: $input.item.position,
    invite_status: 'PENDING'
  })
  .select()
  .single();

if (registrationResult.error) {
  throw new Error(`Registration error: ${registrationResult.error.message}`);
}

// Return the result
return {
  participantId: registrationResult.data.id,
  status: 'success'
};
```

#### Error handling for cross-schema operations

```javascript
// In a Noodl JavaScript Function node
const supabase = Noodl.Variables.supabase;

try {
  // Begin with error handling for the first query
  const { data: judgeData, error: judgeError } = await supabase
    .from('judge')
    .select('user_id')
    .eq('user_id', Inputs.userId)
    .single();
  
  // Handle potential missing judge record
  if (judgeError) {
    if (judgeError.code === 'PGRST116') {
      // Record not found - check if user exists
      const { data: userExists, error: userError } = await supabase
        .from('profile')
        .select('id')
        .eq('id', Inputs.userId)
        .single();
      
      if (userError) {
        // User doesn't exist either
        throw new Error("User not found");
      } else {
        // User exists but isn't a judge
        throw new Error("User is not authorized as a judge");
      }
    } else {
      // Other database error
      throw judgeError;
    }
  }
  
  // Continue with debate query
  const { data: debateData, error: debateError } = await supabase
    .from('debates')
    .select('id')
    .eq('id', Inputs.debateId)
    .single();
  
  // Handle missing debate
  if (debateError) {
    throw new Error("Debate not found");
  }
  
  // If we get here, both records exist and we can proceed
  Outputs.Success();
} catch (error) {
  console.error("Cross-schema validation error:", error);
  Outputs.error = error.message;
  Outputs.Failure();
}
```

## 9. Performance Considerations

### 9.1 Indexing Strategy

#### Existing indexes and their purpose
The current schema includes these key indexes:

- Primary key indexes on all tables (e.g., `criteria_pkey`, `debates_pkey`)
- Unique constraint indexes (e.g., `sides_title_key`, `round_templates_code_key`)
- Foreign key indexes (automatically created on all FK relationships)
- Custom composite index on format_rounds (format_rounds_format_sequence_unique)

#### When to use which index
- **Primary key indexes**: Automatically used when querying by ID
- **Foreign key indexes**: Used when filtering or joining related tables
- **Composite indexes**: Used when filtering on multiple columns simultaneously
- **Unique constraint indexes**: Used when enforcing uniqueness (e.g., format names)

#### Potential performance bottlenecks
- Queries on non-indexed fields in large tables
- Complex joins across multiple tables, especially cross-schema
- Fetching large result sets without pagination
- Frequent small writes rather than batched operations

### 9.2 Query Optimization

#### Best practices for Noodl queries
1. Select only the fields you need
2. Use nested selects to reduce round trips
3. Apply filters before joins to reduce processed rows
4. Implement pagination for large result sets
5. Cache static or slow-changing data in Noodl variables

#### Best practices for n8n workflows
1. Minimize database operations per workflow
2. Use batch operations when processing multiple records
3. Implement error handling and retry logic
4. Use separate workflows for read-heavy vs. write-heavy operations
5. Leverage Supabase real-time features for reactive updates

#### Handling large result sets
1. Always implement pagination (limit/offset or cursor-based)
2. Process data in batches on the server-side when possible
3. Use streaming approaches for very large datasets
4. Consider using materialized views for complex analytics queries
5. Implement client-side caching for frequently accessed data

## 10. Development Workflows

### 10.1 Schema Change Management

#### Process for introducing schema changes
1. Document the current schema state (using Supabase's schema export functionality)
2. Create a schema change proposal with rationale
3. Identify affected tables, relationships, and code
4. Test changes in a development environment
5. Create migration scripts for production

#### Testing impact on existing components
1. Create test cases for all affected components
2. Test both "happy path" and error cases
3. Verify cross-schema relationships still function
4. Ensure UI components adapt to schema changes
5. Test performance impact of changes

#### Migration planning
1. Backup existing data before migration
2. Plan for downtime or zero-downtime strategy
3. Create rollback procedures in case of issues
4. Develop data transformation scripts if needed
5. Test migrations with production-like data volumes

### 10.2 Supabase-Specific Development Practices

#### Leveraging Supabase features
1. Use RLS (Row-Level Security) for access control
2. Implement Supabase Storage for file management
3. Leverage Supabase Auth for authentication
4. Use Supabase real-time subscriptions for live updates
5. Employ PostgreSQL features available in Supabase

#### Client-side optimizations
1. Use the Supabase client efficiently
2. Implement connection pooling
3. Handle JWT token refreshes properly
4. Utilize Supabase's built-in caching mechanisms
5. Structure components to minimize database calls

#### Server-side optimizations
1. Use Supabase Edge Functions for custom business logic
2. Implement webhooks for event-driven architecture
3. Create database functions for complex operations
4. Use Supabase Realtime channels efficiently
5. Leverage PostgreSQL materialized views

## 11. Appendices

### 11.1 Complete Schema Reference

#### Detailed table definitions, relationships, and constraints

The debate schema consists of the following tables, with their primary keys, foreign keys, and constraints:

**Formats System**
- **debate_formats**: Defines debate formats (EMD, WSDC, etc.)
  - PK: id
  - Unique: name

- **round_templates**: Templates for speech types
  - PK: id
  - Unique: code

- **format_rounds**: Links formats to round templates in sequence
  - PK: id
  - FK: debate_format_id → debate_formats.id
  - FK: round_template_id → round_templates.id
  - FK: side_id → sides.id
  - Unique Constraint: (debate_format_id, sequence)

- **sides**: Debate positions (e.g., Affirmative, Negative)
  - PK: id
  - Unique: title

**Content System**
- **genres**: Broad topic categories
  - PK: id
  - FK: proposer_id → public.profile.id

- **motion_categories**: Types of motions
  - PK: id

- **motions**: Debate topics
  - PK: id
  - FK: genre_id → genres.id
  - FK: category_id → motion_categories.id
  - FK: proposer_id → public.profile.id

**Debate Execution System**
- **debates**: Debate instances
  - PK: id
  - FK: debate_format_id → debate_formats.id
  - FK: motion_id → motions.id

- **debate_teams**: Teams in debates
  - PK: id
  - FK: debate_id → debates.id
  - FK: side_id → sides.id

- **debate_participants**: Individual participants
  - PK: id
  - FK: debate_team_id → debate_teams.id
  - FK: user_id → public.student.user_id

**Content Capture System**
- **speeches**: Individual speeches
  - PK: id
  - FK: debate_id → debates.id
  - FK: format_round_id → format_rounds.id
  - FK: participant_id → debate_participants.id

- **videos**: Video recordings
  - PK: id
  - FK: debate_id → debates.id
  - FK: uploaded_by → public.profile.id

**Evaluation System**
- **criteria**: Scoring criteria
  - PK: id
  - Enum: group (RESPECT, ANALYSIS, STYLE)

- **judge_comments**: Timestamped feedback
  - PK: id
  - FK: video_id → videos.id
  - FK: judge_id → public.judge.user_id
  - FK: criteria_id → criteria.id

- **judge_scores**: Numerical scores
  - PK: id
  - FK: debate_id → debates.id
  - FK: judge_id → public.judge.user_id
  - FK: criteria_id → criteria.id

### 11.2 Common Query Templates

#### Standard operations

**Create a new debate with teams**

```javascript
// Step 1: Create the debate
const { data: debate } = await supabase
  .from('debates')
  .insert({
    debate_format_id: formatId,
    motion_id: motionId,
    mode: debateMode // 'SYNC' or 'ASYNC'
  })
  .select()
  .single();

// Step 2: Create debate teams (one for each side)
const teamsToCreate = [
  { debate_id: debate.id, side_id: affirmativeSideId },
  { debate_id: debate.id, side_id: negativeSideId }
];

const { data: teams } = await supabase
  .from('debate_teams')
  .insert(teamsToCreate)
  .select();

// Step 3: Create participants (for each team)
const participantsToCreate = [
  // Team 1 participants
  { debate_team_id: teams[0].id, user_id: user1Id, speaker_position: 1 },
  { debate_team_id: teams[0].id, user_id: user2Id, speaker_position: 2 },
  // Team 2 participants
  { debate_team_id: teams[1].id, user_id: user3Id, speaker_position: 1 },
  { debate_team_id: teams[1].id, user_id: user4Id, speaker_position: 2 }
];

await supabase
  .from('debate_participants')
  .insert(participantsToCreate);
```

**Submit and retrieve judge evaluations**

```javascript
// Step 1: Submit scores
const scoresToSubmit = criteriaIds.map(criteriaId => ({
  debate_id: debateId,
  judge_id: judgeId,
  criteria_id: criteriaId,
  score: defaultScore // typically 1.5
}));

await supabase
  .from('judge_scores')
  .insert(scoresToSubmit);

// Step 2: Retrieve all scores by criteria group
const { data: scores } = await supabase
  .from('judge_scores')
  .select(`
    id,
    score,
    criteria:criteria_id (
      id,
      name,
      group,
      label
    )
  `)
  .eq('debate_id', debateId)
  .eq('judge_id', judgeId);

// Step 3: Calculate totals by group
const totals = {
  RESPECT: 0,
  ANALYSIS: 0,
  STYLE: 0,
  total: 0
};

scores.forEach(score => {
  const group = score.criteria.group;
  if (group in totals) {
    totals[group] += Number(score.score);
  }
  totals.total += Number(score.score);
});
```

#### Join patterns

**Get debate details with all related information**

```javascript
// Complex join to get complete debate information
const { data: debateDetails } = await supabase
  .from('debates')
  .select(`
    id,
    mode,
    scheduled_at,
    format:debate_format_id (
      id,
      name,
      description
    ),
    motion:motion_id (
      id,
      topic,
      details,
      genre:genre_id (
        id,
        title
      ),
      category:category_id (
        id,
        name
      )
    ),
    teams:debate_teams (
      id,
      side:side_id (
        id,
        title
      ),
      participants:debate_participants (
        id,
        speaker_position,
        invite_status,
        student:user_id (
          user_id,
          profile:user_id (
            id,
            name,
            image_path
          )
        )
      )
    ),
    speeches (
      id,
      content,
      delivered_at,
      duration_seconds,
      format_round:format_round_id (
        id,
        sequence,
        round_template:round_template_id (
          id,
          name,
          code,
          default_time
        )
      ),
      participant:participant_id (
        id
      )
    ),
    videos (
      id,
      url,
      uploaded_at
    ),
    judge_scores (
      id,
      score,
      judge_id,
      criteria:criteria_id (
        id,
        name,
        group
      )
    )
  `)
  .eq('id', debateId)
  .single();
```

**Cross-schema user activity query**

```javascript
// Get a student's debate history with performance metrics
const { data: studentActivity } = await supabase
  .from('student')
  .select(`
    id,
    user_id,
    profile:user_id (
      id,
      name,
      email
    ),
    debates:debate_participants (
      id,
      speaker_position,
      team:debate_team_id (
        id,
        side:side_id (
          title
        ),
        debate:debate_id (
          id,
          scheduled_at,
          mode,
          format:debate_format_id (
            name
          ),
          motion:motion_id (
            topic
          ),
          speeches (
            id,
            duration_seconds
          )
        )
      )
    )
  `)
  .eq('user_id', userId);

// Add judge scores (requires further processing due to schema limitations)
const debateIds = getDebateIdsFromStudentActivity(studentActivity);

const { data: scores } = await supabase
  .from('judge_scores')
  .select(`
    debate_id,
    criteria:criteria_id (
      group
    ),
    score
  `)
  .in('debate_id', debateIds);

// Now you can process and combine the data
```

#### Full examples

**Complete ballot generation and scoring flow**

```javascript
// This example demonstrates the full ballot generation process
// as described in user story 4.1

// Step 1: Identify the debate format
const { data: debate } = await supabase
  .from('debates')
  .select(`
    id,
    debate_format_id,
    teams:debate_teams (
      id,
      side_id
    )
  `)
  .eq('id', debateId)
  .single();

// Step 2: Get criteria for the format (in practice, you might have format-specific criteria)
const { data: allCriteria } = await supabase
  .from('criteria')
  .select('*')
  .order('group');

// Step 3: Get all participants by speech role
const { data: participants } = await supabase
  .from('debate_participants')
  .select(`
    id,
    speaker_position,
    debate_team_id
  `)
  .in('debate_team_id', debate.teams.map(t => t.id));

// Step 4: Generate ballot structure
// This would follow the pattern A1FE, A2BE, A3QB, B1FE, B2BE, B3QB
// by mapping teams and positions to these roles

const roles = ['FE', 'BE', 'QB']; // First Essay, Backup Essay, Rebuttal
const ballotStructure = [];

// Group participants by team
const teamParticipants = {};
debate.teams.forEach(team => {
  teamParticipants[team.id] = [];
});

participants.forEach(p => {
  if (teamParticipants[p.debate_team_id]) {
    teamParticipants[p.debate_team_id].push(p);
  }
});

// Create the ballot structure
let teamIndex = 0;
Object.entries(teamParticipants).forEach(([teamId, teamMembers]) => {
  // Sort by position
  teamMembers.sort((a, b) => a.speaker_position - b.speaker_position);
  
  // Assign roles (A1FE, A2BE, etc.)
  teamMembers.forEach((participant, i) => {
    if (i < roles.length) {
      const teamCode = teamIndex === 0 ? 'A' : 'B';
      const positionCode = (i + 1).toString();
      const roleCode = roles[i];
      
      ballotStructure.push({
        code: `${teamCode}${positionCode}${roleCode}`,
        participantId: participant.id,
        teamId,
        position: participant.speaker_position
      });
    }
  });
  
  teamIndex++;
});

// Step 5: Create initial ballots with default scores (1.5)
// For each judge and each criteria, create score records

const judgeIds = [judge1Id, judge2Id]; // In practice, get from judge assignments

// For each judge, create all criteria scores
for (const judgeId of judgeIds) {
  const scores = [];
  
  allCriteria.forEach(criterion => {
    scores.push({
      debate_id: debateId,
      judge_id: judgeId,
      criteria_id: criterion.id,
      score: 1.5, // Default score as specified in requirements
      created_at: new Date()
    });
  });
  
  // Insert all scores for this judge
  await supabase
    .from('judge_scores')
    .insert(scores);
}

// Return the ballot structure for UI rendering
return {
  debate,
  ballotStructure,
  criteria: allCriteria
};
```

## 12. Schema Diagrams

### 12.1 Entity Relationship Diagrams

#### Public Schema Overview
![Public Schema ER Diagram](./diagrams/public_schema_er.svg)

The public schema contains user-related entities including:
- **User Management**: profile, student, guardian, judge
- **Team Organization**: team, team_member
- **Communication**: friendship, presence, messages

Key relationships in this schema center around the `profile` table, which serves as the foundation for user identity across the system.

#### Debate Schema Overview
![Debate Schema ER Diagram](./diagrams/debate_schema_er.svg)

The debate schema contains all debate-specific entities including:
- **Format System**: debate_formats, round_templates, format_rounds, sides
- **Content Management**: genres, motions, motion_categories
- **Evaluation System**: criteria, judge_scores, judge_comments

#### Cross-Schema Relationships
![Cross-Schema Relationships](./diagrams/cross_schema_relationships.svg)

This diagram highlights the critical connections between schemas:
- Profile → Judge → Judging activities
- Profile → Student → Debate participation
- Profile → Content creation and ownership

### 12.2 Table Relationship Maps

#### Format System Relationships
```mermaid
graph TD
    debate_formats[debate_formats] --> format_rounds[format_rounds]
    round_templates[round_templates] --> format_rounds
    sides[sides] --> format_rounds
    format_rounds --> debates[debates]
    debates --> debate_teams[debate_teams]
    sides --> debate_teams
```

#### Judging System Relationships
```mermaid
graph TD
    criteria[criteria] --> judge_scores[judge_scores]
    criteria --> judge_comments[judge_comments]
    debates[debates] --> judge_scores
    videos[videos] --> judge_comments
    public.judge[public.judge] --> judge_scores
    public.judge --> judge_comments
```

### 12.3 Schema Generation Commands
To regenerate these diagrams when the schema changes, use the following commands:

```bash
# Export schema from Supabase
npx supabase-to-dbml --db-url="postgresql://postgres:postgres@localhost:5432/postgres" > schema.dbml

# Generate diagrams from dbml
npx dbdocs build schema.dbml --project edl-schema

# Or use Supabase's built-in schema visualization tools
```

## 13. Supabase-Specific Features

### 13.1 Row-Level Security (RLS)

Supabase utilizes PostgreSQL's Row-Level Security to enforce access control directly at the database level:

```sql
-- Example RLS policy for debate access
CREATE POLICY "Participants can view debates"
ON debate.debates
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM debate.debate_participants dp
    JOIN debate.debate_teams dt ON dp.debate_team_id = dt.id
    WHERE dt.debate_id = id AND dp.user_id = auth.uid()
  )
);

-- Example RLS policy for team management
CREATE POLICY "Team leaders can update teams"
ON public.team
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.team_member
    WHERE team_id = id AND student_id IN (
      SELECT id FROM public.student WHERE user_id = auth.uid()
    ) AND is_leader = true
  )
);
```

### 13.2 Real-time Subscriptions

Supabase's real-time capabilities enable live updates for collaborative features:

```javascript
// Set up real-time subscription for debate updates
const debateChannel = supabase
  .channel('debate-' + debateId)
  .on('postgres_changes', { 
    event: 'UPDATE', 
    schema: 'debate', 
    table: 'debates',
    filter: `id=eq.${debateId}`
  }, (payload) => {
    // Handle debate state changes
    updateDebateState(payload.new);
  })
  .subscribe();

// Clean up when component unmounts
return () => {
  supabase.removeChannel(debateChannel);
};
```

### 13.3 Storage Integration

Supabase Storage provides seamless file management:

```javascript
// Upload video to Supabase Storage
const { data: storageData, error: storageError } = await supabase.storage
  .from('videos')
  .upload(filePath, videoFile);

if (storageError) throw storageError;

// Get public URL for the uploaded file
const { data: urlData } = supabase.storage
  .from('videos')
  .getPublicUrl(filePath);

// Use the public URL in your application
const videoUrl = urlData.publicUrl;
```

### 13.4 Edge Functions

Supabase Edge Functions enable serverless functionality:

```javascript
// Call an Edge Function for complex operations
const { data, error } = await supabase.functions.invoke('analyze-debate', {
  body: {
    debateId: debate.id,
    metrics: ['speaking_time', 'argument_count', 'response_quality']
  }
});

if (error) {
  console.error('Edge Function error:', error);
} else {
  // Process debate analytics
  displayAnalytics(data.analysis);
}
```

## 14. Conclusion

The EDL database schema provides a robust foundation for implementing the Emdash Debate League platform. By leveraging Supabase's capabilities, including PostgreSQL's advanced features, Row-Level Security, real-time subscriptions, and storage integration, the platform can deliver a secure, performant, and collaborative experience for debate participants, judges, and administrators.

Key architectural decisions include:
1. **Multi-schema approach**: Separating user data (public schema) from debate-specific data (debate schema)
2. **Comprehensive format system**: Supporting multiple debate formats with configurable rounds and rules
3. **Rich evaluation framework**: Enabling detailed judging with criteria groups and timestamped feedback
4. **Cross-schema relationships**: Maintaining proper connections between users and debate activities

This documentation serves as a reference for ongoing development, helping ensure consistency in database operations and adherence to best practices throughout the EDL platform.
