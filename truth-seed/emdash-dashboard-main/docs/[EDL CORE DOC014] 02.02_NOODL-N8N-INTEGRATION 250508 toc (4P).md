---
session: "25050"
type: "documentation"
status: "current"
created: "2025-08-23"
title: "02.02_NOODL-N8N-INTEGRATION"
purpose: "Document 02.02_noodl-n8n-integration"
topics: ['database', 'documentation']
priority: "P1"
domain: "core"
---

EDL 02_IMPLEMENTATION-PATTERNS/

# 02.02_NOODL-N8N-INTEGRATION
EDL Implementation Patterns for Noodl & n8n

## Overview

This document provides implementation patterns for the EDL platform using Noodl and n8n with Supabase as the foundation. These patterns ensure consistent, efficient, and secure interactions with the Supabase database across the platform.

## Noodl Supabase Integration

### Setting Up Supabase Client

The Supabase client must be set up in Noodl's head code section to enable database operations throughout the application:

```javascript
// In Noodl head code section
<script type="module">
  import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.22.0';
  window.createClient = createClient;
</script>
```

Then create a Supabase Setup Client component that initializes the client:

```javascript
// In Supabase Setup Client component
const url = Inputs.supabaseUrl;
const key = Inputs.supabaseAnonKey;

try {
  const supabase = window.createClient(url, key);
  Noodl.Variables.supabase = supabase;
  Outputs.Success();
} catch (error) {
  console.error("Supabase client initialization error:", error);
  Outputs.Failure();
}
```

### Noodl Query Patterns

For basic queries with schema prefix:

```javascript
// Function Node for Supabase Query
const supabase = Noodl.Variables.supabase;

try {
  // Use schema prefix for tables in debate schema
  const { data, error } = await supabase
    .from('debate.debates')
    .select(`
      id,
      scheduled_at,
      format:debate_format_id (
        name
      )
    `)
    .eq('id', Inputs.debateId);
  
  if (error) throw error;
  
  Outputs.data = data;
  Outputs.Success();
} catch (error) {
  console.error("Query error:", error);
  Outputs.error = error.message;
  Outputs.Failure();
}
```

### Cross-Schema Access Pattern

For queries that span multiple schemas (public and debate):

```javascript
// Function Node for cross-schema query
const supabase = Noodl.Variables.supabase;

try {
  const { data, error } = await supabase
    .from('debate.debate_participants')
    .select(`
      id,
      student:user_id (
        user_id,
        profile:user_id (
          name,
          email
        )
      )
    `)
    .eq('id', Inputs.participantId);
  
  if (error) throw error;
  
  Outputs.studentInfo = data[0]?.student?.profile;
  Outputs.Success();
} catch (error) {
  console.error("Cross-schema query error:", error);
  Outputs.error = error.message;
  Outputs.Failure();
}
```

### Real-time Subscriptions

Leverage Supabase's real-time capabilities for live updates:

```javascript
// Function Node for real-time subscriptions
const supabase = Noodl.Variables.supabase;

// Setup subscription
const setupSubscription = () => {
  // Channel for debate updates
  const debateChannel = supabase
    .channel('public:debates')
    .on(
      'postgres_changes',
      {
        event: '*', // Listen for all events (or specify 'INSERT', 'UPDATE', etc.)
        schema: 'debate',
        table: 'debates',
        filter: `id=eq.${Inputs.debateId}`
      },
      (payload) => {
        // Process real-time update
        console.log('Change received:', payload);
        Outputs.debateChanged(payload);
      }
    )
    .subscribe();
  
  // Return cleanup function
  return () => {
    supabase.removeChannel(debateChannel);
  };
};

// Start subscription
const cleanup = setupSubscription();

// Expose cleanup function for component unmount
Outputs.cleanup = cleanup;
```

## n8n Integration Patterns

### n8n Webhook Node Setup

Create an n8n workflow with a Webhook node that:
1. Accepts POST requests
2. Has a clear endpoint path (e.g., `/api/v1/debates/create`)
3. Returns JSON responses
4. Connects to Supabase operations

### Noodl to n8n Connection

```javascript
// Function Node to call n8n webhook
const n8nUrl = Inputs.n8nUrl;
const webhookId = Inputs.webhookId;
const inputData = Noodl.Objects[Inputs.inputObject] || {};

try {
  const response = await fetch(`${n8nUrl}/webhook/${webhookId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Add authentication headers if needed
      'X-API-Key': Noodl.Variables.n8nApiKey || ''
    },
    body: JSON.stringify(inputData)
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  
  const data = await response.json();
  
  Outputs.responseData = data;
  
  if (data.success) {
    Outputs.Success();
  } else {
    Outputs.error = data.error || 'Unknown error';
    Outputs.Failure();
  }
} catch (error) {
  console.error("n8n call error:", error);
  Outputs.error = error.message;
  Outputs.Failure();
}
```

### n8n Supabase Integration

In n8n, create a Supabase node that:
1. Uses the service role key for administrative access
2. Has its credentials securely stored in n8n
3. Can perform cross-schema operations

Example workflow steps:
1. Webhook Trigger: Receive request from Noodl
2. Function: Validate input data
3. Supabase: Perform database operations
4. Function: Process results
5. Respond to Webhook: Return results to Noodl

### Security Patterns

1. **Supabase Authentication**: 
   - Always verify JWT tokens for authentication in n8n workflows
   - Use RLS policies in Supabase for access control
   
2. **Service Role Usage**:
   - Only use service role for operations that require administrative access
   - Keep service role key secure in n8n Credentials
   
3. **Error Handling**:
   - Use Supabase-specific error patterns
   - Provide meaningful error responses

```javascript
// Example of handling Supabase-specific errors in n8n
// In a Function node within n8n
function handleSupabaseError(error) {
  // Supabase error patterns
  if (error.code === 'PGRST109') {
    // Permission denied error (RLS)
    return {
      success: false,
      error: 'You do not have permission to perform this action',
      code: 'PERMISSION_DENIED'
    };
  } else if (error.code === 'PGRST116') {
    // Resource not found
    return {
      success: false,
      error: 'The requested resource was not found',
      code: 'NOT_FOUND'
    };
  } else if (error.code === '23505') {
    // Unique constraint violation
    return {
      success: false,
      error: 'This record already exists',
      code: 'DUPLICATE'
    };
  } else {
    // Generic error
    return {
      success: false,
      error: 'An unexpected error occurred',
      code: 'INTERNAL_ERROR',
      details: error.message
    };
  }
}
```

## Advanced Noodl-n8n Integration Patterns

### Robust Webhook Handling in Noodl

```javascript
// In a JavaScript Function node for resilient webhook communication
const callN8nWebhook = async (webhookId, inputData, options = {}) => {
  // Default configuration
  const config = {
    baseUrl: options.baseUrl || Noodl.Variables.n8nBaseUrl || 'https://n8n.edl-platform.com',
    maxRetries: options.maxRetries || 3,
    retryDelay: options.retryDelay || 1000, // ms
    timeout: options.timeout || 15000, // ms
    criticalOperation: options.criticalOperation || false,
    offlineQueue: options.offlineQueue || false
  };
  
  // Create request object
  const requestObject = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Noodl-Client-Id': Noodl.Variables.clientId || 'noodl-client'
    },
    body: JSON.stringify(inputData)
  };
  
  // Add timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.timeout);
  requestObject.signal = controller.signal;
  
  // Initialize retry counter
  let retries = 0;
  let lastError = null;
  
  // Create queue for offline operations if requested
  if (config.offlineQueue && !window.n8nOfflineQueue) {
    window.n8nOfflineQueue = [];
    setupOfflineSync();
  }
  
  // Execute request with retry logic
  while (retries <= config.maxRetries) {
    try {
      const response = await fetch(`${config.baseUrl}/webhook/${webhookId}`, requestObject);
      
      // Clear timeout
      clearTimeout(timeoutId);
      
      // Check for non-OK responses
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error ${response.status}: ${errorText}`);
      }
      
      // Parse response
      const data = await response.json();
      
      // Return successful response
      Outputs.responseData = data;
      Outputs.Success();
      return data;
    } catch (error) {
      lastError = error;
      
      // Handle specific error types
      if (error.name === 'AbortError') {
        console.warn(`n8n webhook request timed out after ${config.timeout}ms`);
        // Don't retry on timeout for non-critical operations
        if (!config.criticalOperation) break;
      } else if (error.message.includes('Failed to fetch') || !navigator.onLine) {
        console.warn('Network error, device might be offline');
        
        // Queue operation if offline queueing is enabled
        if (config.offlineQueue) {
          window.n8nOfflineQueue.push({
            webhookId,
            inputData,
            options: config,
            timestamp: Date.now()
          });
          
          console.log(`Operation queued for offline processing. Queue size: ${window.n8nOfflineQueue.length}`);
          Outputs.queuedOffline = true;
          Outputs.Failure();
          return null;
        }
      }
      
      // Increment retry counter
      retries++;
      
      if (retries <= config.maxRetries) {
        // Wait before retry with exponential backoff
        const delay = config.retryDelay * Math.pow(2, retries - 1);
        console.log(`Retrying n8n webhook call in ${delay}ms (attempt ${retries} of ${config.maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  // If we got here, all retries failed
  console.error(`n8n webhook call failed after ${config.maxRetries} retries:`, lastError);
  Outputs.error = lastError.message;
  Outputs.Failure();
  return null;
};

// Setup offline queue synchronization
function setupOfflineSync() {
  // Process queue when back online
  window.addEventListener('online', async () => {
    console.log(`Device is back online. Processing ${window.n8nOfflineQueue.length} queued operations`);
    
    // Process queue in order
    while (window.n8nOfflineQueue.length > 0) {
      const operation = window.n8nOfflineQueue.shift();
      
      try {
        // Retry the operation with modified options
        const modifiedOptions = {
          ...operation.options,
          maxRetries: 1, // Only try once when processing queue
          offlineQueue: false // Avoid re-queueing
        };
        
        await callN8nWebhook(operation.webhookId, operation.inputData, modifiedOptions);
        console.log(`Queued operation processed successfully`);
      } catch (error) {
        console.error(`Failed to process queued operation:`, error);
        // Push back to queue for later processing
        window.n8nOfflineQueue.push(operation);
        break; // Stop processing for now
      }
    }
    
    // Update queue status
    Noodl.Events.emit('offlineQueueUpdated', {
      queueSize: window.n8nOfflineQueue.length,
      isProcessing: false
    });
  });
  
  // Optional: Sync queue status to UI
  setInterval(() => {
    Noodl.Events.emit('offlineQueueUpdated', {
      queueSize: window.n8nOfflineQueue.length,
      isProcessing: navigator.onLine && window.n8nOfflineQueue.length > 0
    });
  }, 5000);
}

// Expose the function
Outputs.callN8nWebhook = callN8nWebhook;
```

### State Synchronization with Supabase

```javascript
// In a JavaScript Function node for state synchronization
const syncStateWithSupabase = async () => {
  const supabase = Noodl.Variables.supabase;
  
  const syncConfig = {
    // Entity types that need synchronization
    entityTypes: ['debate', 'team', 'participant', 'user'],
    
    // Track sync state
    lastSyncTimestamp: Noodl.Variables.Get('lastSyncTimestamp') || 0
  };
  
  try {
    // Set up Supabase real-time subscriptions for each entity type
    const channels = [];
    
    for (const entityType of syncConfig.entityTypes) {
      let schema = 'public';
      let table = entityType;
      
      // Handle schema-specific tables
      if (entityType.includes('debate_')) {
        schema = 'debate';
        table = entityType;
      } else if (['debates', 'speeches', 'videos', 'judge_scores', 'judge_comments'].includes(entityType)) {
        schema = 'debate';
        table = entityType;
      }
      
      const channel = supabase
        .channel(`sync-${entityType}`)
        .on(
          'postgres_changes',
          {
            event: '*', // Listen for all events
            schema: schema,
            table: table
          },
          (payload) => {
            // Process real-time update
            handleEntityUpdate(entityType, payload);
          }
        )
        .subscribe();
      
      channels.push(channel);
    }
    
    // Set up cleanup function
    const cleanup = () => {
      for (const channel of channels) {
        supabase.removeChannel(channel);
      }
    };
    
    // Update last sync timestamp
    Noodl.Variables.Set('lastSyncTimestamp', Date.now());
    
    Outputs.syncSetupComplete = true;
    Outputs.cleanup = cleanup;
    Outputs.Success();
  } catch (error) {
    console.error("State synchronization error:", error);
    Outputs.error = error.message;
    Outputs.Failure();
  }
};

// Handle entity updates from Supabase
function handleEntityUpdate(entityType, payload) {
  const updateType = payload.eventType; // INSERT, UPDATE, DELETE
  const entity = payload.new || payload.old;
  
  // Update local state based on update type
  switch (updateType) {
    case 'INSERT':
    case 'UPDATE':
      // Update or add entity in local state
      updateLocalEntity(entityType, entity);
      break;
    case 'DELETE':
      // Remove entity from local state
      removeLocalEntity(entityType, entity.id);
      break;
  }
  
  // Emit event for UI updates
  Noodl.Events.emit(`${entityType}Updated`, {
    type: updateType,
    entity: entity
  });
}

// Update local entity
function updateLocalEntity(entityType, entity) {
  // Update in local object store
  Noodl.Objects.Set(`${entityType}/${entity.id}`, entity);
  
  // Update in list if it exists
  const listName = `${entityType}List`;
  const list = Noodl.Objects.Get(listName) || [];
  
  const index = list.findIndex(item => item.id === entity.id);
  
  if (index >= 0) {
    // Update existing entity
    list[index] = { ...list[index], ...entity };
    Noodl.Objects.Set(listName, [...list]); // Create new array to trigger updates
  } else {
    // Add new entity
    Noodl.Objects.Set(listName, [...list, entity]);
  }
}

// Remove local entity
function removeLocalEntity(entityType, entityId) {
  // Remove from local object store
  Noodl.Objects.Delete(`${entityType}/${entityId}`);
  
  // Remove from list if it exists
  const listName = `${entityType}List`;
  const list = Noodl.Objects.Get(listName) || [];
  
  const filteredList = list.filter(item => item.id !== entityId);
  
  if (list.length !== filteredList.length) {
    Noodl.Objects.Set(listName, filteredList);
  }
}

// Expose sync function
Outputs.syncStateWithSupabase = syncStateWithSupabase;
```

### Critical Operation Patterns

```javascript
// In a JavaScript Function node for critical operations
const performCriticalOperation = async (operationType, data, options = {}) => {
  const supabase = Noodl.Variables.supabase;
  
  // Default configuration
  const config = {
    transactionId: `${operationType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    webhookId: options.webhookId || `${operationType}-webhook`,
    requiresConfirmation: options.requiresConfirmation !== false,
    timeout: options.timeout || 20000,
    idempotencyKey: options.idempotencyKey || config.transactionId
  };
  
  try {
    // Start transaction tracking
    Noodl.Variables.Set(`transaction_${config.transactionId}`, {
      status: 'pending',
      startTime: Date.now(),
      operationType,
      data
    });
    
    // Show confirmation if required
    if (config.requiresConfirmation) {
      const confirmed = await showConfirmationDialog(operationType, data);
      if (!confirmed) {
        throw new Error('Operation cancelled by user');
      }
    }
    
    // Notify UI of operation start
    Outputs.operationStarted = true;
    Outputs.operationType = operationType;
    
    // Depending on operation type, perform appropriate operation
    let result;
    
    if (options.useSupabaseDirectly) {
      // Use Supabase directly for operations that don't need n8n
      result = await performSupabaseOperation(operationType, data, supabase);
    } else {
      // Call n8n webhook with idempotency key
      const response = await fetch(`${Noodl.Variables.n8nBaseUrl}/webhook/${config.webhookId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Idempotency-Key': config.idempotencyKey,
          'X-Transaction-ID': config.transactionId
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Operation failed: ${errorText}`);
      }
      
      result = await response.json();
    }
    
    // Update transaction status
    Noodl.Variables.Set(`transaction_${config.transactionId}`, {
      status: 'completed',
      completionTime: Date.now(),
      operationType,
      data,
      result
    });
    
    // Notify UI of success
    Outputs.operationCompleted = true;
    Outputs.result = result;
    Outputs.Success();
    
    return result;
  } catch (error) {
    console.error(`Critical operation ${operationType} failed:`, error);
    
    // Update transaction status
    Noodl.Variables.Set(`transaction_${config.transactionId}`, {
      status: 'failed',
      failureTime: Date.now(),
      operationType,
      data,
      error: error.message
    });
    
    // Notify UI of failure
    Outputs.operationFailed = true;
    Outputs.error = error.message;
    Outputs.Failure();
    
    // Attempt recovery if possible
    if (options.enableRecovery) {
      scheduleRecoveryAttempt(config.transactionId, operationType, data);
    }
    
    return null;
  }
};

// Helper for performing Supabase operations directly
async function performSupabaseOperation(operationType, data, supabase) {
  switch (operationType) {
    case 'createDebate':
      const { data: debate, error: debateError } = await supabase
        .from('debate.debates')
        .insert(data)
        .select()
        .single();
      
      if (debateError) throw debateError;
      return debate;
      
    case 'updateProfile':
      const { data: profile, error: profileError } = await supabase
        .from('public.profile')
        .update(data.profile)
        .eq('id', data.profileId)
        .select()
        .single();
      
      if (profileError) throw profileError;
      return profile;
      
    // Additional operation types...
      
    default:
      throw new Error(`Unsupported operation type: ${operationType}`);
  }
}

// Helper for confirmation dialogs
function showConfirmationDialog(operationType, data) {
  return new Promise(resolve => {
    // Create confirmation UI state
    Noodl.Objects.Set('confirmationDialog', {
      visible: true,
      title: `Confirm ${operationType}`,
      message: getConfirmationMessage(operationType, data),
      data,
      onConfirm: () => {
        Noodl.Objects.Set('confirmationDialog', { visible: false });
        resolve(true);
      },
      onCancel: () => {
        Noodl.Objects.Set('confirmationDialog', { visible: false });
        resolve(false);
      }
    });
  });
}

// Get appropriate confirmation message
function getConfirmationMessage(operationType, data) {
  // Customize based on operation type
  switch (operationType) {
    case 'deleteDebate':
      return `Are you sure you want to delete this debate? This action cannot be undone.`;
    case 'endDebate':
      return `Are you sure you want to end this debate? All participants will be notified.`;
    case 'removeParticipant':
      return `Are you sure you want to remove ${data.participantName} from this debate?`;
    default:
      return `Are you sure you want to perform this ${operationType} operation?`;
  }
}

// Expose the function
Outputs.performCriticalOperation = performCriticalOperation;
```

## Supabase Authentication Integration

### Noodl Authentication Components

```javascript
// In a JavaScript Function node for user sign-up
const supabase = Noodl.Variables.supabase;

const signUp = async () => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: Inputs.email,
      password: Inputs.password,
      options: {
        data: {
          display_name: Inputs.displayName,
          role: Inputs.userRole
        }
      }
    });
    
    if (error) throw error;
    
    // User created successfully
    if (data.user && data.session) {
      // User is automatically signed in
      Outputs.userData = data.user;
      Outputs.sessionData = data.session;
      Outputs.Success();
    } else {
      // Email confirmation required
      Outputs.confirmationRequired = true;
      Outputs.userData = data.user;
      Outputs.Success();
    }
  } catch (error) {
    console.error("Sign-up error:", error);
    Outputs.error = error.message;
    Outputs.Failure();
  }
};

// Call sign-up function
signUp();
```

```javascript
// In a JavaScript Function node for user sign-in
const supabase = Noodl.Variables.supabase;

const signIn = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: Inputs.email,
      password: Inputs.password
    });
    
    if (error) throw error;
    
    // Store authentication state
    Noodl.Variables.Set('currentUser', {
      auth: data.user,
      session: data.session
    });
    
    // Fetch user profile data
    const { data: profile, error: profileError } = await supabase
      .from('public.profile')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    if (profileError && profileError.code !== 'PGRST116') throw profileError;
    
    // Add profile to current user data
    if (profile) {
      Noodl.Variables.Set('currentUser', {
        auth: data.user,
        session: data.session,
        profile: profile
      });
    }
    
    // Emit authentication event
    Noodl.Events.emit('userSignedIn', {
      userId: data.user.id
    });
    
    Outputs.userData = data.user;
    Outputs.Success();
  } catch (error) {
    console.error("Sign-in error:", error);
    Outputs.error = error.message;
    Outputs.Failure();
  }
};

// Call sign-in function
signIn();
```

### Authentication Session Management

```javascript
// In a JavaScript Function node for session management
const supabase = Noodl.Variables.supabase;

const checkSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    
    if (data.session) {
      // Valid session exists
      const user = data.session.user;
      
      // Store authentication state
      Noodl.Variables.Set('currentUser', {
        auth: user,
        session: data.session
      });
      
      // Fetch user profile data
      const { data: profile, error: profileError } = await supabase
        .from('public.profile')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError && profileError.code !== 'PGRST116') throw profileError;
      
      // Add profile to current user data
      if (profile) {
        Noodl.Variables.Set('currentUser', {
          auth: user,
          session: data.session,
          profile: profile
        });
      }
      
      Outputs.isSignedIn = true;
      Outputs.userData = user;
      Outputs.Success();
    } else {
      // No valid session
      Outputs.isSignedIn = false;
      Outputs.Failure();
    }
  } catch (error) {
    console.error("Session check error:", error);
    Outputs.error = error.message;
    Outputs.isSignedIn = false;
    Outputs.Failure();
  }
};

// Call session check
checkSession();
```

## Best Practices and Guidelines

1. **Always Use Supabase Client**: Access database exclusively through the Supabase client.

2. **Schema Prefixing**: Always use the correct schema prefix (e.g., 'debate.debates') for tables.

3. **Error Handling**:
   - Handle Supabase-specific errors appropriately
   - Provide meaningful error messages to users
   - Log errors for debugging

4. **Authentication**:
   - Use Supabase Auth for all authentication flows
   - Verify session token for protected operations
   - Apply proper RLS policies in database

5. **Real-time Data**:
   - Use Supabase's real-time subscriptions for live updates
   - Implement proper channel management and cleanup

6. **Security**:
   - Never expose service role keys in client code
   - Use the service role only in n8n workflows
   - Implement proper input validation

7. **Performance**:
   - Select only needed fields to reduce payload size
   - Use appropriate indexes for frequent queries
   - Implement caching for frequently accessed data

By following these patterns, the EDL platform will maintain a consistent, secure, and efficient integration with Supabase throughout its Noodl and n8n components.