---
created: '2025-08-23'
domain: reconciliation
priority: P1
purpose: Document 02.01_noodl-component-library
session: '25050'
status: current
title: 02.01_NOODL-COMPONENT-LIBRARY
topics:
- auth
- documentation
type: guide
---

EDL 02_IMPLEMENTATION-PATTERNS/

# 02.01_NOODL-COMPONENT-LIBRARY
EDL Noodl Component Library Reference (v2)

## 0. 02.01 Table of Contents

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

## 1. Overview

This document provides a comprehensive reference for the EDL Noodl component library, covering UI components, data integration patterns, and authentication flows built on Supabase as the foundation of the platform. The components are designed to ensure consistency across the platform while leveraging Supabase's capabilities for real-time updates, authentication, and storage.

## 2. Component Organization

The EDL component library is organized into the following categories:

1. **Core UI Components**: Reusable visual elements following EDL design guidelines
2. **Layout Components**: Structural components for consistent page organization
3. **Authentication Components**: User registration, login, and session management
4. **Data Components**: Components that interact with Supabase for data operations
5. **Navigation Components**: Menu systems and page navigation
6. **Debate-Specific Components**: Specialized components for debate functionality

## 3. Core UI Components

### 3.1 Button Component

The standard button component with multiple variants:

```javascript
// In the Button component's Function node
const variant = Inputs.variant || 'primary'; // primary, secondary, outline, text
const size = Inputs.size || 'medium'; // small, medium, large
const isDisabled = Inputs.isDisabled || false;

// Map variant to style classes
const variantClasses = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  outline: 'bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50',
  text: 'bg-transparent text-blue-600 hover:text-blue-700'
};

// Map size to style classes
const sizeClasses = {
  small: 'py-1 px-3 text-sm',
  medium: 'py-2 px-4',
  large: 'py-3 px-6 text-lg'
};

// Combine classes
const classes = `
  ${variantClasses[variant] || variantClasses.primary}
  ${sizeClasses[size] || sizeClasses.medium}
  rounded font-medium focus:outline-none focus:ring-2 focus:ring-blue-500
  transition-colors duration-200
  ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
`;

Outputs.classes = classes;
Outputs.isDisabled = isDisabled;
```

### 3.2 Input Component

A standard input component with validation and error handling:

```javascript
// In the Input component's Function node
const type = Inputs.type || 'text'; // text, email, password, number
const value = Inputs.value || '';
const placeholder = Inputs.placeholder || '';
const label = Inputs.label || '';
const required = Inputs.required || false;
const errorMessage = Inputs.errorMessage || '';
const hasError = !!errorMessage;

// Generate a unique ID for the input
const inputId = `input-${Math.random().toString(36).substring(2, 11)}`;

// Validate input based on type
function validateInput(value, type) {
  if (required && (!value || value.trim() === '')) {
    return 'This field is required';
  }
  
  if (type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
  }
  
  return '';
}

// Only validate on blur or if there's already an error
const validationMessage = Inputs.shouldValidate ? validateInput(value, type) : errorMessage;

Outputs.inputId = inputId;
Outputs.type = type;
Outputs.value = value;
Outputs.placeholder = placeholder;
Outputs.label = label;
Outputs.required = required;
Outputs.hasError = hasError || !!validationMessage;
Outputs.errorMessage = validationMessage || errorMessage;
```

### 3.3 Card Component

A versatile card component for content display:

```javascript
// In the Card component's Function node
const variant = Inputs.variant || 'default'; // default, elevated, outline
const padding = Inputs.padding || 'medium'; // none, small, medium, large
const width = Inputs.width || 'auto'; // auto, full, specific pixels

// Map variant to style classes
const variantClasses = {
  default: 'bg-white',
  elevated: 'bg-white shadow-md',
  outline: 'bg-white border border-gray-200'
};

// Map padding to style classes
const paddingClasses = {
  none: 'p-0',
  small: 'p-2',
  medium: 'p-4',
  large: 'p-6'
};

// Handle width
let widthClass = '';
if (width === 'full') {
  widthClass = 'w-full';
} else if (width !== 'auto' && !isNaN(parseInt(width))) {
  widthClass = `w-[${parseInt(width)}px]`;
}

// Combine classes
const classes = `
  ${variantClasses[variant] || variantClasses.default}
  ${paddingClasses[padding] || paddingClasses.medium}
  ${widthClass}
  rounded-lg
`;

Outputs.classes = classes;
```

## 4. Integration with Supabase Backend

### 4.1 Supabase Client Setup

A global component to initialize the Supabase client:

```javascript
// In the Supabase Setup component's Function node
const supabaseUrl = Inputs.supabaseUrl;
const supabaseAnonKey = Inputs.supabaseAnonKey;

// Verify inputs
if (!supabaseUrl || !supabaseAnonKey) {
  Outputs.error = "Missing Supabase URL or anonymous key";
  Outputs.Failure();
  return;
}

try {
  // Initialize Supabase client
  const supabase = window.createClient(supabaseUrl, supabaseAnonKey);
  
  // Store client in Noodl variables for global access
  Noodl.Variables.supabase = supabase;
  
  // Set up auth state change listener
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      Noodl.Variables.Set('currentUser', {
        auth: session.user,
        session: session
      });
      Noodl.Events.emit('userSignedIn', session.user);
    } else if (event === 'SIGNED_OUT') {
      Noodl.Variables.Delete('currentUser');
      Noodl.Events.emit('userSignedOut');
    } else if (event === 'TOKEN_REFRESHED') {
      Noodl.Variables.Set('currentUser', {
        auth: session.user,
        session: session
      });
    }
  });
  
  // Check current session
  supabase.auth.getSession().then(({ data, error }) => {
    if (!error && data.session) {
      Noodl.Variables.Set('currentUser', {
        auth: data.session.user,
        session: data.session
      });
    }
  });
  
  Outputs.Success();
} catch (error) {
  console.error("Supabase initialization error:", error);
  Outputs.error = error.message;
  Outputs.Failure();
}
```

### 4.2 Data Query Component

A reusable component for Supabase queries with schema awareness:

```javascript
// In the Supabase Query component's Function node
const supabase = Noodl.Variables.supabase;
const table = Inputs.table; // Include schema prefix for debate tables (e.g., 'debate.debates')
const select = Inputs.select || '*';
const filter = Inputs.filter || {};
const order = Inputs.order;
const limit = Inputs.limit;
const offset = Inputs.offset;
const useSingle = Inputs.useSingle || false;

async function executeQuery() {
  if (!supabase) {
    Outputs.error = "Supabase client not initialized";
    Outputs.Failure();
    return;
  }
  
  if (!table) {
    Outputs.error = "Table name required";
    Outputs.Failure();
    return;
  }
  
  try {
    // Start building query
    let query = supabase.from(table).select(select);
    
    // Apply filters
    if (filter && typeof filter === 'object') {
      Object.entries(filter).forEach(([key, value]) => {
        if (key && value !== undefined) {
          query = query.eq(key, value);
        }
      });
    }
    
    // Apply order if provided
    if (order) {
      const [column, direction] = Array.isArray(order) ? order : [order, 'asc'];
      query = query.order(column, { ascending: direction !== 'desc' });
    }
    
    // Apply pagination if provided
    if (limit) {
      query = query.limit(limit);
    }
    
    if (offset) {
      query = query.offset(offset);
    }
    
    // Execute query
    const { data, error, count } = useSingle
      ? await query.single()
      : await query;
    
    if (error) throw error;
    
    Outputs.data = data;
    Outputs.count = count || (data ? (Array.isArray(data) ? data.length : 1) : 0);
    Outputs.Success();
  } catch (error) {
    console.error("Query error:", error);
    Outputs.error = error.message;
    Outputs.Failure();
  }
}

// Execute query when inputs change
executeQuery();
```

### 4.3 Data Mutation Component

A reusable component for Supabase data mutations:

```javascript
// In the Supabase Mutation component's Function node
const supabase = Noodl.Variables.supabase;
const table = Inputs.table; // Include schema prefix for debate tables
const operation = Inputs.operation || 'insert'; // insert, update, upsert, delete
const data = Inputs.data || {};
const filter = Inputs.filter || {};
const returnData = Inputs.returnData !== false;

async function executeMutation() {
  if (!supabase) {
    Outputs.error = "Supabase client not initialized";
    Outputs.Failure();
    return;
  }
  
  if (!table) {
    Outputs.error = "Table name required";
    Outputs.Failure();
    return;
  }
  
  try {
    let result;
    
    // Perform operation based on type
    switch (operation) {
      case 'insert':
        result = returnData
          ? await supabase.from(table).insert(data).select()
          : await supabase.from(table).insert(data);
        break;
        
      case 'update':
        let updateQuery = supabase.from(table).update(data);
        
        // Apply filters
        if (filter && typeof filter === 'object') {
          Object.entries(filter).forEach(([key, value]) => {
            if (key && value !== undefined) {
              updateQuery = updateQuery.eq(key, value);
            }
          });
        }
        
        result = returnData
          ? await updateQuery.select()
          : await updateQuery;
        break;
        
      case 'upsert':
        result = returnData
          ? await supabase.from(table).upsert(data).select()
          : await supabase.from(table).upsert(data);
        break;
        
      case 'delete':
        let deleteQuery = supabase.from(table).delete();
        
        // Apply filters
        if (filter && typeof filter === 'object') {
          Object.entries(filter).forEach(([key, value]) => {
            if (key && value !== undefined) {
              deleteQuery = deleteQuery.eq(key, value);
            }
          });
        }
        
        result = returnData
          ? await deleteQuery.select()
          : await deleteQuery;
        break;
        
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
    
    if (result.error) throw result.error;
    
    Outputs.data = result.data;
    Outputs.Success();
  } catch (error) {
    console.error("Mutation error:", error);
    Outputs.error = error.message;
    Outputs.Failure();
  }
}

// Execute mutation when explicitly triggered
if (Inputs.execute) {
  executeMutation();
}

// Expose function for external calls
Outputs.executeMutation = executeMutation;
```

### 4.4 Real-time Subscription Component

A component for Supabase real-time updates:

```javascript
// In the Supabase Subscription component's Function node
const supabase = Noodl.Variables.supabase;
const table = Inputs.table; // Include schema prefix for debate tables
const event = Inputs.event || '*'; // *, INSERT, UPDATE, DELETE
const filter = Inputs.filter;
let channel = null;

function setupSubscription() {
  if (!supabase) {
    Outputs.error = "Supabase client not initialized";
    Outputs.Failure();
    return;
  }
  
  if (!table) {
    Outputs.error = "Table name required";
    Outputs.Failure();
    return;
  }
  
  try {
    // Clean up existing subscription if any
    if (channel) {
      supabase.removeChannel(channel);
    }
    
    // Create unique channel name
    const channelName = `${table}-${Math.random().toString(36).substring(2, 11)}`;
    
    // Set up subscription options
    const options = {
      event: event,
      schema: table.includes('.') ? table.split('.')[0] : 'public',
      table: table.includes('.') ? table.split('.')[1] : table
    };
    
    // Add filter if provided
    if (filter) {
      options.filter = filter;
    }
    
    // Create and subscribe to channel
    channel = supabase
      .channel(channelName)
      .on('postgres_changes', options, (payload) => {
        // Handle real-time update
        Outputs.payload = payload;
        
        // Emit event based on the type
        if (payload.eventType === 'INSERT') {
          Outputs.onInsert(payload.new);
        } else if (payload.eventType === 'UPDATE') {
          Outputs.onUpdate(payload.new);
        } else if (payload.eventType === 'DELETE') {
          Outputs.onDelete(payload.old);
        }
      })
      .subscribe();
    
    Outputs.Success();
  } catch (error) {
    console.error("Subscription error:", error);
    Outputs.error = error.message;
    Outputs.Failure();
  }
}

// Set up subscription on component mount
setupSubscription();

// Clean up function for when component unmounts
function cleanup() {
  if (channel) {
    supabase.removeChannel(channel);
    channel = null;
  }
}

Outputs.cleanup = cleanup;
```

## 5. Authentication Components

### 5.1 Sign Up Component

A component for user registration with Supabase Auth:

```javascript
// In the Sign Up component's Function node
const supabase = Noodl.Variables.supabase;
const email = Inputs.email;
const password = Inputs.password;
const userData = Inputs.userData || {};
const redirectTo = Inputs.redirectTo;

async function signUp() {
  if (!supabase) {
    Outputs.error = "Supabase client not initialized";
    Outputs.Failure();
    return;
  }
  
  if (!email || !password) {
    Outputs.error = "Email and password are required";
    Outputs.Failure();
    return;
  }
  
  try {
    // Create options object
    const options = {
      data: userData
    };
    
    // Add redirect URL if provided
    if (redirectTo) {
      options.redirectTo = redirectTo;
    }
    
    // Execute sign up
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options
    });
    
    if (error) throw error;
    
    // Handle success
    if (data.user && data.session) {
      // User is already confirmed and signed in
      Outputs.user = data.user;
      Outputs.session = data.session;
      Outputs.Success();
    } else {
      // Email confirmation required
      Outputs.user = data.user;
      Outputs.confirmationRequired = true;
      Outputs.Success();
    }
  } catch (error) {
    console.error("Sign up error:", error);
    Outputs.error = error.message;
    Outputs.Failure();
  }
}

// Execute sign up when triggered
if (Inputs.submit) {
  signUp();
}

// Expose function for external calls
Outputs.signUp = signUp;
```

### 5.2 Sign In Component

A component for user authentication with Supabase Auth:

```javascript
// In the Sign In component's Function node
const supabase = Noodl.Variables.supabase;
const email = Inputs.email;
const password = Inputs.password;

async function signIn() {
  if (!supabase) {
    Outputs.error = "Supabase client not initialized";
    Outputs.Failure();
    return;
  }
  
  if (!email || !password) {
    Outputs.error = "Email and password are required";
    Outputs.Failure();
    return;
  }
  
  try {
    // Execute sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    // Handle success
    Outputs.user = data.user;
    Outputs.session = data.session;
    
    // Store user data in Noodl variables
    Noodl.Variables.Set('currentUser', {
      auth: data.user,
      session: data.session
    });
    
    // Fetch and store user profile information
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profile')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (!profileError && profile) {
        Noodl.Variables.Set('currentUser', {
          auth: data.user,
          session: data.session,
          profile: profile
        });
        Outputs.profile = profile;
      }
    } catch (profileError) {
      console.warn("Profile fetch warning:", profileError);
    }
    
    Outputs.Success();
  } catch (error) {
    console.error("Sign in error:", error);
    Outputs.error = error.message;
    Outputs.Failure();
  }
}

// Execute sign in when triggered
if (Inputs.submit) {
  signIn();
}

// Expose function for external calls
Outputs.signIn = signIn;
```

### 5.3 User Session Component

A component to manage and verify user sessions:

```javascript
// In the User Session component's Function node
const supabase = Noodl.Variables.supabase;

async function checkSession() {
  if (!supabase) {
    Outputs.error = "Supabase client not initialized";
    Outputs.Failure();
    return;
  }
  
  try {
    // Get current session
    const { data, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    
    if (data.session) {
      // Session exists
      Outputs.isSignedIn = true;
      Outputs.user = data.session.user;
      Outputs.session = data.session;
      
      // Fetch user profile
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profile')
          .select('*')
          .eq('id', data.session.user.id)
          .single();
        
        if (!profileError && profile) {
          Outputs.profile = profile;
          
          // Store in Noodl variables
          Noodl.Variables.Set('currentUser', {
            auth: data.session.user,
            session: data.session,
            profile: profile
          });
        }
      } catch (profileError) {
        console.warn("Profile fetch warning:", profileError);
      }
      
      Outputs.Success();
    } else {
      // No session
      Outputs.isSignedIn = false;
      Outputs.Failure();
    }
  } catch (error) {
    console.error("Session check error:", error);
    Outputs.error = error.message;
    Outputs.isSignedIn = false;
    Outputs.Failure();
  }
}

// Check session on component mount
checkSession();

// Expose function for external calls
Outputs.checkSession = checkSession;

// Sign out function
async function signOut() {
  if (!supabase) {
    Outputs.error = "Supabase client not initialized";
    Outputs.Failure();
    return;
  }
  
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;
    
    // Clear user data from Noodl variables
    Noodl.Variables.Delete('currentUser');
    
    Outputs.isSignedIn = false;
    Outputs.Success();
  } catch (error) {
    console.error("Sign out error:", error);
    Outputs.error = error.message;
    Outputs.Failure();
  }
}

// Expose sign out function
Outputs.signOut = signOut;
```

### 5.4 Role-Based Access Control Component

A component to manage user roles and access control:

```javascript
// In the RBAC component's Function node
const supabase = Noodl.Variables.supabase;
const userId = Inputs.userId || Noodl.Objects.currentUser?.auth?.id;
const requiredRoles = Inputs.requiredRoles || []; // Array of roles like ['STUDENT', 'JUDGE']

async function checkUserRoles() {
  if (!supabase) {
    Outputs.error = "Supabase client not initialized";
    Outputs.Failure();
    return;
  }
  
  if (!userId) {
    Outputs.error = "User ID is required";
    Outputs.hasAccess = false;
    Outputs.Failure();
    return;
  }
  
  try {
    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profile')
      .select('id')
      .eq('id', userId)
      .single();
    
    if (profileError) throw profileError;
    
    // Check for role-specific records
    const roleChecks = [];
    
    // Check if user is a student
    if (requiredRoles.includes('STUDENT')) {
      const { data: student } = await supabase
        .from('student')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
      
      roleChecks.push({
        role: 'STUDENT',
        hasRole: !!student
      });
    }
    
    // Check if user is a judge/enabler
    if (requiredRoles.includes('JUDGE') || requiredRoles.includes('ENABLER')) {
      const { data: judge } = await supabase
        .from('judge')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
      
      roleChecks.push({
        role: 'JUDGE',
        hasRole: !!judge
      });
    }
    
    // Check if user is a guardian
    if (requiredRoles.includes('GUARDIAN')) {
      const { data: guardian } = await supabase
        .from('guardian')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
      
      roleChecks.push({
        role: 'GUARDIAN',
        hasRole: !!guardian
      });
    }
    
    // Check if user is an admin
    if (requiredRoles.includes('ADMIN')) {
      const { data: admin } = await supabase
        .from('admin')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
      
      roleChecks.push({
        role: 'ADMIN',
        hasRole: !!admin
      });
    }
    
    // Determine if user has access
    const userRoles = roleChecks.filter(rc => rc.hasRole).map(rc => rc.role);
    const hasRequiredRole = requiredRoles.length === 0 || 
      requiredRoles.some(role => userRoles.includes(role));
    
    Outputs.hasAccess = hasRequiredRole;
    Outputs.userRoles = userRoles;
    
    if (hasRequiredRole) {
      Outputs.Success();
    } else {
      Outputs.Failure();
    }
  } catch (error) {
    console.error("Role check error:", error);
    Outputs.error = error.message;
    Outputs.hasAccess = false;
    Outputs.Failure();
  }
}

// Check roles on component mount
checkUserRoles();

// Expose function for external calls
Outputs.checkUserRoles = checkUserRoles;
```

## 6. Data Components

### 6.1 Cross-Schema Query Component

A component for executing queries across Supabase schemas:

```javascript
// In the Cross-Schema Query component's Function node
const supabase = Noodl.Variables.supabase;
const queryConfig = Inputs.queryConfig; // Complex query configuration

async function executeCrossSchemaQuery() {
  if (!supabase) {
    Outputs.error = "Supabase client not initialized";
    Outputs.Failure();
    return;
  }
  
  if (!queryConfig || !queryConfig.table) {
    Outputs.error = "Query configuration with table is required";
    Outputs.Failure();
    return;
  }
  
  try {
    // Ensure proper schema prefixing
    const table = queryConfig.table;
    
    // Build the query
    let query = supabase.from(table).select(queryConfig.select || '*');
    
    // Apply filters
    if (queryConfig.filters && Array.isArray(queryConfig.filters)) {
      queryConfig.filters.forEach(filter => {
        if (filter.op === 'eq') {
          query = query.eq(filter.column, filter.value);
        } else if (filter.op === 'neq') {
          query = query.neq(filter.column, filter.value);
        } else if (filter.op === 'gt') {
          query = query.gt(filter.column, filter.value);
        } else if (filter.op === 'lt') {
          query = query.lt(filter.column, filter.value);
        } else if (filter.op === 'gte') {
          query = query.gte(filter.column, filter.value);
        } else if (filter.op === 'lte') {
          query = query.lte(filter.column, filter.value);
        } else if (filter.op === 'in') {
          query = query.in(filter.column, filter.value);
        } else if (filter.op === 'contains') {
          query = query.contains(filter.column, filter.value);
        } else if (filter.op === 'ilike') {
          query = query.ilike(filter.column, filter.value);
        }
      });
    }
    
    // Apply ordering
    if (queryConfig.order) {
      query = query.order(queryConfig.order.column, { 
        ascending: queryConfig.order.ascending !== false
      });
    }
    
    // Apply pagination
    if (queryConfig.limit) {
      query = query.limit(queryConfig.limit);
    }
    
    if (queryConfig.offset) {
      query = query.offset(queryConfig.offset);
    }
    
    // Execute query
    const { data, error, count } = queryConfig.single 
      ? await query.single()
      : await query;
    
    if (error) throw error;
    
    Outputs.data = data;
    Outputs.count = count || (data ? (Array.isArray(data) ? data.length : 1) : 0);
    Outputs.Success();
  } catch (error) {
    console.error("Cross-schema query error:", error);
    Outputs.error = error.message;
    Outputs.Failure();
  }
}

// Execute query when triggered
if (Inputs.execute) {
  executeCrossSchemaQuery();
}

// Expose function for external calls
Outputs.executeCrossSchemaQuery = executeCrossSchemaQuery;
```

### 6.2 Storage Component

A component for Supabase Storage operations:

```javascript
// In the Storage component's Function node
const supabase = Noodl.Variables.supabase;
const bucket = Inputs.bucket || 'public';
const operation = Inputs.operation || 'upload'; // upload, download, list, delete
const path = Inputs.path;
const file = Inputs.file;
const contentType = Inputs.contentType;

async function executeStorageOperation() {
  if (!supabase) {
    Outputs.error = "Supabase client not initialized";
    Outputs.Failure();
    return;
  }
  
  try {
    let result;
    
    switch (operation) {
      case 'upload':
        if (!file) {
          throw new Error('File is required for upload');
        }
        
        if (!path) {
          throw new Error('Path is required for upload');
        }
        
        // Upload file
        const options = {};
        if (contentType) {
          options.contentType = contentType;
        }
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(path, file, options);
        
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(path);
        
        result = {
          ...uploadData,
          publicUrl: urlData.publicUrl
        };
        break;
        
      case 'download':
        if (!path) {
          throw new Error('Path is required for download');
        }
        
        // Download file
        const { data: downloadData, error: downloadError } = await supabase.storage
          .from(bucket)
          .download(path);
        
        if (downloadError) throw downloadError;
        
        result = downloadData;
        break;
        
      case 'list':
        // List files
        const prefix = path || '';
        const { data: listData, error: listError } = await supabase.storage
          .from(bucket)
          .list(prefix);
        
        if (listError) throw listError;
        
        result = listData;
        break;
        
      case 'delete':
        if (!path) {
          throw new Error('Path is required for delete');
        }
        
        // Delete file
        const { data: deleteData, error: deleteError } = await supabase.storage
          .from(bucket)
          .remove([path]);
        
        if (deleteError) throw deleteError;
        
        result = deleteData;
        break;
        
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
    
    Outputs.result = result;
    Outputs.Success();
  } catch (error) {
    console.error("Storage operation error:", error);
    Outputs.error = error.message;
    Outputs.Failure();
  }
}

// Execute operation when triggered
if (Inputs.execute) {
  executeStorageOperation();
}

// Expose function for external calls
Outputs.executeStorageOperation = executeStorageOperation;
```

### 6.3 Debate Data Component

A specialized component for Debate-specific data operations:

```javascript
// In the Debate Data component's Function node
const supabase = Noodl.Variables.supabase;
const debateId = Inputs.debateId;

async function fetchDebateData() {
  if (!supabase) {
    Outputs.error = "Supabase client not initialized";
    Outputs.Failure();
    return;
  }
  
  if (!debateId) {
    Outputs.error = "Debate ID is required";
    Outputs.Failure();
    return;
  }
  
  try {
    // Fetch debate details with proper schema prefixing
    const { data: debate, error: debateError } = await supabase
      .from('debate.debates')
      .select(`
        id,
        mode,
        status,
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
          )
        )
      `)
      .eq('id', debateId)
      .single();
    
    if (debateError) throw debateError;
    
    // Fetch teams with participants
    const { data: teams, error: teamsError } = await supabase
      .from('debate.debate_teams')
      .select(`
        id,
        side:side_id (
          id,
          title
        ),
        participants:debate_participants (
          id,
          user_id,
          speaker_position,
          student:user_id (
            user_id,
            profile:user_id (
              id,
              name,
              image_path
            )
          )
        )
      `)
      .eq('debate_id', debateId);
    
    if (teamsError) throw teamsError;
    
    // Fetch speeches and videos
    const { data: speeches, error: speechesError } = await supabase
      .from('debate.speeches')
      .select(`
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
            default_time
          )
        ),
        participant:participant_id (
          id,
          speaker_position
        ),
        video:video_id (
          id,
          url,
          storage_path
        )
      `)
      .eq('debate_id', debateId);
    
    if (speechesError) throw speechesError;
    
    // Return combined data
    Outputs.debate = debate;
    Outputs.teams = teams;
    Outputs.speeches = speeches;
    Outputs.Success();
  } catch (error) {
    console.error("Debate data fetch error:", error);
    Outputs.error = error.message;
    Outputs.Failure();
  }
}

// Execute query when triggered
if (Inputs.execute) {
  fetchDebateData();
}

// Expose function for external calls
Outputs.fetchDebateData = fetchDebateData;
```

### 6.4 User Profile Component

A component for managing user profile data:

```javascript
// In the User Profile component's Function node
const supabase = Noodl.Variables.supabase;
const userId = Inputs.userId || Noodl.Objects.currentUser?.auth?.id;

async function fetchUserProfile() {
  if (!supabase) {
    Outputs.error = "Supabase client not initialized";
    Outputs.Failure();
    return;
  }
  
  if (!userId) {
    Outputs.error = "User ID is required";
    Outputs.Failure();
    return;
  }
  
  try {
    // Fetch profile data
    const { data: profile, error: profileError } = await supabase
      .from('profile')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (profileError) throw profileError;
    
    // Check for role data
    const roleChecks = [];
    
    // Check if user is a student
    const { data: student } = await supabase
      .from('student')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    // Check if user is a judge
    const { data: judge } = await supabase
      .from('judge')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    // Check if user is a guardian
    const { data: guardian } = await supabase
      .from('guardian')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    // Combine data
    const userData = {
      profile: profile,
      student: student || null,
      judge: judge || null,
      guardian: guardian || null,
      roles: []
    };
    
    // Determine roles
    if (student) userData.roles.push('STUDENT');
    if (judge) userData.roles.push('JUDGE');
    if (guardian) userData.roles.push('GUARDIAN');
    
    Outputs.userData = userData;
    Outputs.profile = profile;
    Outputs.roles = userData.roles;
    Outputs.Success();
  } catch (error) {
    console.error("Profile fetch error:", error);
    Outputs.error = error.message;
    Outputs.Failure();
  }
}

async function updateUserProfile(profileData) {
  if (!supabase) {
    Outputs.error = "Supabase client not initialized";
    Outputs.Failure();
    return;
  }
  
  if (!userId) {
    Outputs.error = "User ID is required";
    Outputs.Failure();
    return;
  }
  
  try {
    // Update profile data
    const { data, error } = await supabase
      .from('profile')
      .update(profileData)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    
    Outputs.updatedProfile = data;
    Outputs.Success();
  } catch (error) {
    console.error("Profile update error:", error);
    Outputs.error = error.message;
    Outputs.Failure();
  }
}

// Execute fetch on component mount
fetchUserProfile();

// Expose functions for external calls
Outputs.fetchUserProfile = fetchUserProfile;
Outputs.updateUserProfile = updateUserProfile;
```

## 7. Layout Components

### 7.1 Responsive Container Component

```javascript
// In the Responsive Container component's Function node
const breakpoint = Inputs.breakpoint || 'md'; // sm, md, lg, xl
const padding = Inputs.padding || 'default'; // none, small, default, large

// Map breakpoints to max-width values
const breakpoints = {
  sm: 'max-w-screen-sm', // 640px
  md: 'max-w-screen-md', // 768px
  lg: 'max-w-screen-lg', // 1024px
  xl: 'max-w-screen-xl', // 1280px
  full: 'max-w-full'
};

// Map padding options to padding classes
const paddings = {
  none: 'p-0',
  small: 'px-2 py-1',
  default: 'px-4 py-2',
  large: 'px-6 py-4'
};

// Combine classes
const classes = `
  mx-auto w-full
  ${breakpoints[breakpoint] || breakpoints.md}
  ${paddings[padding] || paddings.default}
`;

Outputs.classes = classes;
```

### 7.2 Grid Layout Component

```javascript
// In the Grid Layout component's Function node
const columns = Inputs.columns || 'auto'; // Number or 'auto'
const gap = Inputs.gap || 'default'; // small, default, large
const rowGap = Inputs.rowGap; // Override for row gap
const columnGap = Inputs.columnGap; // Override for column gap

// Handle columns configuration
let columnsClass = '';
if (columns === 'auto') {
  columnsClass = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
} else if (!isNaN(parseInt(columns))) {
  // Map number of columns to appropriate Tailwind class
  const colsMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    12: 'grid-cols-12'
  };
  columnsClass = colsMap[parseInt(columns)] || 'grid-cols-1';
}

// Map gap options to gap classes
const gaps = {
  small: 'gap-2',
  default: 'gap-4',
  large: 'gap-6'
};

// Apply specific row/column gaps if provided
let gapClass = gaps[gap] || gaps.default;
if (rowGap || columnGap) {
  const rowGapClass = rowGap ? `row-gap-${rowGap}` : '';
  const colGapClass = columnGap ? `col-gap-${columnGap}` : '';
  gapClass = `${rowGapClass} ${colGapClass}`.trim();
}

// Combine classes
const classes = `
  grid
  ${columnsClass}
  ${gapClass}
`;

Outputs.classes = classes;
```

## 8. Navigation Components

### 8.1 Navigation Bar Component

```javascript
// In the Navigation Bar component's Function node
const variant = Inputs.variant || 'default'; // default, transparent, colored
const position = Inputs.position || 'top'; // top, fixed
const navigationItems = Inputs.navigationItems || [];
const activeItem = Inputs.activeItem || '';
const userProfile = Inputs.userProfile || Noodl.Objects.currentUser?.profile;

// Map variant to style classes
const variantClasses = {
  default: 'bg-white shadow',
  transparent: 'bg-transparent',
  colored: 'bg-blue-600 text-white'
};

// Map position to style classes
const positionClasses = {
  top: 'relative',
  fixed: 'fixed top-0 left-0 right-0 z-40'
};

// Combine classes
const classes = `
  ${variantClasses[variant] || variantClasses.default}
  ${positionClasses[position] || positionClasses.top}
  w-full
`;

// Process navigation items
const processedItems = navigationItems.map(item => ({
  ...item,
  isActive: item.id === activeItem
}));

Outputs.classes = classes;
Outputs.items = processedItems;
Outputs.hasUserProfile = !!userProfile;
Outputs.userProfile = userProfile || {};
```

### 8.2 Tab Navigation Component

```javascript
// In the Tab Navigation component's Function node
const tabs = Inputs.tabs || [];
const activeTab = Inputs.activeTab || '';
const variant = Inputs.variant || 'default'; // default, underline, pills

// Map variant to style classes
const variantClasses = {
  default: '',
  underline: 'border-b border-gray-200',
  pills: 'bg-gray-100 p-1 rounded-lg'
};

// Process tabs for rendering
const processedTabs = tabs.map(tab => ({
  ...tab,
  isActive: tab.id === activeTab,
  className: getTabClassName(tab.id === activeTab, variant)
}));

// Get appropriate class name for a tab based on variant and active state
function getTabClassName(isActive, variant) {
  if (variant === 'pills') {
    return isActive
      ? 'bg-white shadow px-4 py-2 rounded-md font-medium'
      : 'px-4 py-2 rounded-md hover:bg-gray-200 font-medium';
  } else if (variant === 'underline') {
    return isActive
      ? 'px-4 py-2 border-b-2 border-blue-600 font-medium text-blue-600'
      : 'px-4 py-2 border-b-2 border-transparent hover:border-gray-300 font-medium';
  } else {
    return isActive
      ? 'px-4 py-2 font-medium text-blue-600'
      : 'px-4 py-2 font-medium text-gray-600 hover:text-gray-900';
  }
}

Outputs.tabs = processedTabs;
Outputs.containerClass = variantClasses[variant] || '';
```

## 9. Debate-Specific Components

### 9.1 Debate Format Selector Component

```javascript
// In the Debate Format Selector component's Function node
const supabase = Noodl.Variables.supabase;

async function fetchDebateFormats() {
  if (!supabase) {
    Outputs.error = "Supabase client not initialized";
    Outputs.Failure();
    return;
  }
  
  try {
    // Fetch formats from debate schema
    const { data, error } = await supabase
      .from('debate.debate_formats')
      .select('id, name, description')
      .order('name');
    
    if (error) throw error;
    
    Outputs.formats = data;
    Outputs.Success();
  } catch (error) {
    console.error("Format fetch error:", error);
    Outputs.error = error.message;
    Outputs.Failure();
  }
}

// Format structure fetcher
async function fetchFormatStructure(formatId) {
  if (!supabase) {
    Outputs.error = "Supabase client not initialized";
    Outputs.Failure();
    return;
  }
  
  if (!formatId) {
    Outputs.error = "Format ID is required";
    Outputs.Failure();
    return;
  }
  
  try {
    // Fetch format details with rounds
    const { data: format, error: formatError } = await supabase
      .from('debate.debate_formats')
      .select(`
        id,
        name,
        description,
        format_rounds (
          id,
          sequence,
          side_id,
          speaker_positions,
          round_template:round_template_id (
            id,
            name,
            code,
            default_time
          ),
          side:side_id (
            id,
            title
          )
        )
      `)
      .eq('id', formatId)
      .single();
    
    if (formatError) throw formatError;
    
    // Sort rounds by sequence
    format.format_rounds.sort((a, b) => a.sequence - b.sequence);
    
    Outputs.format = format;
    Outputs.rounds = format.format_rounds;
    Outputs.Success();
  } catch (error) {
    console.error("Format structure fetch error:", error);
    Outputs.error = error.message;
    Outputs.Failure();
  }
}

// Execute fetch on component mount
fetchDebateFormats();

// Expose functions for external calls
Outputs.fetchDebateFormats = fetchDebateFormats;
Outputs.fetchFormatStructure = fetchFormatStructure;
```

### 9.2 Motion Selector Component

```javascript
// In the Motion Selector component's Function node
const supabase = Noodl.Variables.supabase;
const genreId = Inputs.genreId;
const searchTerm = Inputs.searchTerm || '';
const limit = Inputs.limit || 10;

async function fetchMotions() {
  if (!supabase) {
    Outputs.error = "Supabase client not initialized";
    Outputs.Failure();
    return;
  }
  
  try {
    // Build query with proper schema prefix
    let query = supabase
      .from('debate.motions')
      .select(`
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
      `)
      .order('topic');
    
    // Apply genre filter if provided
    if (genreId) {
      query = query.eq('genre_id', genreId);
    }
    
    // Apply search filter if provided
    if (searchTerm) {
      query = query.ilike('topic', `%${searchTerm}%`);
    }
    
    // Apply limit
    if (limit) {
      query = query.limit(limit);
    }
    
    // Execute query
    const { data, error } = await query;
    
    if (error) throw error;
    
    Outputs.motions = data;
    Outputs.Success();
  } catch (error) {
    console.error("Motions fetch error:", error);
    Outputs.error = error.message;
    Outputs.Failure();
  }
}

async function fetchGenres() {
  if (!supabase) {
    Outputs.error = "Supabase client not initialized";
    Outputs.Failure();
    return;
  }
  
  try {
    // Fetch genres from debate schema
    const { data, error } = await supabase
      .from('debate.genres')
      .select('id, title')
      .order('title');
    
    if (error) throw error;
    
    Outputs.genres = data;
    Outputs.Success();
  } catch (error) {
    console.error("Genres fetch error:", error);
    Outputs.error = error.message;
    Outputs.Failure();
  }
}

// Execute fetch on component mount
fetchMotions();
fetchGenres();

// Expose functions for external calls
Outputs.fetchMotions = fetchMotions;
Outputs.fetchGenres = fetchGenres;

// Search function
function searchMotions(term) {
  // Update search term and refetch
  Inputs.searchTerm = term;
  fetchMotions();
}

Outputs.searchMotions = searchMotions;
```

### 9.3 Debate Timer Component

```javascript
// In the Debate Timer component's Function node
const initialSeconds = Inputs.initialSeconds || 0;
const defaultTime = Inputs.defaultTime || 300; // 5 minutes
const warningThreshold = Inputs.warningThreshold || 60; // 1 minute warning
const isRunning = Inputs.isRunning || false;

let timer = null;
let startTime = null;
let elapsedAtStart = initialSeconds;
let currentSeconds = initialSeconds;

// Start timer
function startTimer() {
  if (timer) {
    clearInterval(timer);
  }
  
  startTime = Date.now();
  elapsedAtStart = currentSeconds;
  
  timer = setInterval(() => {
    // Calculate elapsed time
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    currentSeconds = elapsedAtStart + elapsed;
    
    // Update UI
    updateTimerDisplay(currentSeconds);
    
    // Check for time thresholds
    if (currentSeconds >= defaultTime) {
      Outputs.onTimeUp();
      pauseTimer();
    } else if (currentSeconds >= defaultTime - warningThreshold && 
               currentSeconds < defaultTime - warningThreshold + 1) {
      // Trigger warning event at threshold
      Outputs.onWarning(warningThreshold);
    }
  }, 500);
  
  Outputs.isRunning = true;
}

// Pause timer
function pauseTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  
  Outputs.isRunning = false;
}

// Reset timer
function resetTimer() {
  pauseTimer();
  currentSeconds = 0;
  updateTimerDisplay(0);
}

// Update timer display
function updateTimerDisplay(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  Outputs.timeDisplay = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  Outputs.seconds = seconds;
  Outputs.progress = Math.min(100, (seconds / defaultTime) * 100);
  
  // Set status class based on time remaining
  let statusClass = 'text-gray-800';
  
  if (seconds >= defaultTime) {
    statusClass = 'text-red-600';
  } else if (seconds >= defaultTime - warningThreshold) {
    statusClass = 'text-amber-600';
  } else if (seconds >= defaultTime / 2) {
    statusClass = 'text-green-600';
  }
  
  Outputs.statusClass = statusClass;
}

// Initialize display
updateTimerDisplay(currentSeconds);

// Check if should start automatically
if (isRunning) {
  startTimer();
}

// Clean up function
function cleanup() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

// Expose functions
Outputs.startTimer = startTimer;
Outputs.pauseTimer = pauseTimer;
Outputs.resetTimer = resetTimer;
Outputs.cleanup = cleanup;
```

## 10. Using the Component Library

### 10.1 Component Import Pattern

To use components from the library in your Noodl project:

1. Copy the component from the library into your project
2. Configure the component's inputs as needed
3. Connect the component's outputs to your application logic

### 10.2 Authentication Flow Example

Here's how to implement a complete authentication flow:

1. Add the Supabase Setup component to your app's root
2. Create a login page with the Sign In component
3. Create a registration page with the Sign Up component
4. Use the User Session component to check authentication status
5. Implement the RBAC component for role-based access control

### 10.3 Data Management Example

Here's how to implement a data management flow:

1. Use the Supabase Query component to fetch data
2. Connect the query results to your UI components
3. Use the Supabase Mutation component to create/update data
4. Implement the Supabase Subscription component for real-time updates
5. Use the Cross-Schema Query component for complex data operations

### 10.4 Component Composition Guidelines

For optimal performance and maintainability:

1. Use smaller, specialized components rather than large monolithic ones
2. Compose complex UI from simpler components
3. Keep data logic separate from presentation components
4. Create reusable component patterns for common operations
5. Document component interfaces clearly

## 11. Performance Best Practices

### 11.1 Data Fetching Optimization

1. Use select() with specific fields to reduce data transfer
2. Implement pagination for large result sets
3. Cache frequently accessed data in Noodl variables
4. Use single queries with joins instead of multiple sequential queries
5. Implement debouncing for search inputs

### 11.2 Real-time Subscription Guidelines

1. Subscribe only to essential data changes
2. Use specific filters in subscription configurations
3. Clean up subscriptions when components unmount
4. Implement channel presence for user status tracking
5. Handle connection recovery gracefully

## 12. Troubleshooting

### 12.1 Common Issues

1. **Supabase connection errors**: Check URL and API key configuration
2. **Authentication failures**: Verify credentials and check browser console for errors
3. **Missing data**: Ensure proper schema prefixing for table references
4. **Performance problems**: Review query patterns and consider caching
5. **Real-time updates not working**: Verify subscription setup and channel configuration

### 12.2 Error Handling Pattern

```javascript
// Error handling pattern for Supabase operations
try {
  // Supabase operation
  const { data, error } = await supabase.from('table').select('*');
  
  // Check for Supabase error
  if (error) {
    if (error.code === 'PGRST116') {
      // Resource not found
      console.error("Resource not found:", error);
      Outputs.error = "The requested resource was not found";
    } else if (error.code === 'PGRST104') {
      // Invalid token
      console.error("Authentication error:", error);
      Outputs.error = "Please sign in again";
      
      // Redirect to login
      Noodl.Navigation.navigate('/login');
    } else {
      // Generic error
      console.error("Database error:", error);
      Outputs.error = error.message;
    }
    
    Outputs.Failure();
    return;
  }
  
  // Process data
  Outputs.data = data;
  Outputs.Success();
} catch (error) {
  // Unexpected error
  console.error("Unexpected error:", error);
  Outputs.error = "An unexpected error occurred. Please try again.";
  Outputs.Failure();
}
```

## 13. Conclusion

This component library provides a comprehensive set of building blocks for developing the EDL platform with Noodl and Supabase. By leveraging these standardized components, development teams can ensure consistency, maintainability, and adherence to the Supabase-first architecture principles.

For additional support, refer to the other EDL documentation such as the Database Architecture, Cross-Schema Integration Guide, and Row-Level Security Implementation guides.

