/**
 * Supabase Data Validator
 * Session 133 - Using Supabase client library for data validation
 * 
 * Validates data changes in Supabase after test operations
 */

const { createClient } = require('@supabase/supabase-js');

class SupabaseValidator {
    constructor() {
        // Using known public credentials from environment or defaults
        this.supabaseUrl = process.env.SUPABASE_URL || 'https://bbrheacetxlnqbibjwsz.supabase.co';
        this.supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE';
        
        this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
        console.log('Supabase validator initialized');
    }

    /**
     * Validate that a user was created in auth.users
     * @param {string} email - Email of the user to validate
     * @returns {Promise<Object>} User data if found, null otherwise
     */
    async validateUserCreated(email) {
        try {
            console.log(`Validating user creation for: ${email}`);
            
            // Note: auth.users table might not be directly accessible via anon key
            // Try profile table first as it mirrors auth.users
            const { data, error } = await this.supabase
                .from('profile')
                .select('*')
                .eq('email', email)
                .single();
            
            if (error) {
                // Expected for RLS-protected tables
                if (error.code === 'PGRST116' || error.message.includes('Row not found')) {
                    console.log(`User profile not found for ${email}`);
                    return null;
                }
                console.warn(`Error validating user: ${error.message}`);
                return null;
            }
            
            console.log(`User validated: ${email}`, data);
            return data;
        } catch (err) {
            console.error(`Failed to validate user ${email}:`, err);
            return null;
        }
    }

    /**
     * Validate friendship relationship exists
     * @param {string} userId1 - First user ID
     * @param {string} userId2 - Second user ID
     * @returns {Promise<Object>} Friendship data if found
     */
    async validateFriendship(userId1, userId2) {
        try {
            console.log(`Validating friendship between ${userId1} and ${userId2}`);
            
            const { data, error } = await this.supabase
                .from('friendship')
                .select('*')
                .or(`and(user_id.eq.${userId1},friend_id.eq.${userId2}),and(user_id.eq.${userId2},friend_id.eq.${userId1})`);
            
            if (error) {
                console.warn(`Error validating friendship: ${error.message}`);
                return null;
            }
            
            if (data && data.length > 0) {
                console.log(`Friendship validated between users`);
                return data[0];
            }
            
            console.log(`No friendship found between users`);
            return null;
        } catch (err) {
            console.error(`Failed to validate friendship:`, err);
            return null;
        }
    }

    /**
     * Validate team membership
     * @param {string} userId - User ID
     * @param {string} teamId - Team ID
     * @returns {Promise<Object>} Membership data if found
     */
    async validateTeamMembership(userId, teamId) {
        try {
            console.log(`Validating team membership for user ${userId} in team ${teamId}`);
            
            const { data, error } = await this.supabase
                .from('team_members')
                .select('*')
                .eq('user_id', userId)
                .eq('team_id', teamId)
                .single();
            
            if (error) {
                if (error.code === 'PGRST116') {
                    console.log(`No membership found for user ${userId} in team ${teamId}`);
                    return null;
                }
                console.warn(`Error validating team membership: ${error.message}`);
                return null;
            }
            
            console.log(`Team membership validated for user ${userId}`);
            return data;
        } catch (err) {
            console.error(`Failed to validate team membership:`, err);
            return null;
        }
    }

    /**
     * Validate team exists
     * @param {string} teamName - Name of the team
     * @returns {Promise<Object>} Team data if found
     */
    async validateTeamExists(teamName) {
        try {
            console.log(`Validating team exists: ${teamName}`);
            
            const { data, error } = await this.supabase
                .from('teams')
                .select('*')
                .eq('name', teamName)
                .single();
            
            if (error) {
                if (error.code === 'PGRST116') {
                    console.log(`Team not found: ${teamName}`);
                    return null;
                }
                console.warn(`Error validating team: ${error.message}`);
                return null;
            }
            
            console.log(`Team validated: ${teamName}`, data);
            return data;
        } catch (err) {
            console.error(`Failed to validate team:`, err);
            return null;
        }
    }

    /**
     * Get user by email
     * @param {string} email - User email
     * @returns {Promise<Object>} User data
     */
    async getUserByEmail(email) {
        try {
            const { data, error } = await this.supabase
                .from('profile')
                .select('*')
                .eq('email', email)
                .single();
            
            if (error) {
                console.warn(`User not found: ${email}`);
                return null;
            }
            
            return data;
        } catch (err) {
            console.error(`Failed to get user by email:`, err);
            return null;
        }
    }

    /**
     * Count test users created
     * @param {string} emailPattern - Pattern to match test emails (e.g., '%+test_%')
     * @returns {Promise<number>} Count of test users
     */
    async countTestUsers(emailPattern = '+test_') {
        try {
            const { data, error, count } = await this.supabase
                .from('profile')
                .select('*', { count: 'exact', head: true })
                .like('email', `%${emailPattern}%`);
            
            if (error) {
                console.warn(`Error counting test users: ${error.message}`);
                return 0;
            }
            
            console.log(`Found ${count} test users with pattern: ${emailPattern}`);
            return count || 0;
        } catch (err) {
            console.error(`Failed to count test users:`, err);
            return 0;
        }
    }

    /**
     * Get all test users
     * @param {string} emailPattern - Pattern to match test emails
     * @returns {Promise<Array>} Array of test users
     */
    async getTestUsers(emailPattern = '+test_') {
        try {
            const { data, error } = await this.supabase
                .from('profile')
                .select('*')
                .like('email', `%${emailPattern}%`);
            
            if (error) {
                console.warn(`Error getting test users: ${error.message}`);
                return [];
            }
            
            console.log(`Found ${data.length} test users`);
            return data || [];
        } catch (err) {
            console.error(`Failed to get test users:`, err);
            return [];
        }
    }

    /**
     * Validate activity was created
     * @param {string} userId - User who created the activity
     * @param {string} activityType - Type of activity
     * @returns {Promise<Object>} Activity data if found
     */
    async validateActivityCreated(userId, activityType) {
        try {
            const { data, error } = await this.supabase
                .from('activity')
                .select('*')
                .eq('user_id', userId)
                .eq('type', activityType)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();
            
            if (error) {
                console.warn(`Activity not found for user ${userId}`);
                return null;
            }
            
            console.log(`Activity validated for user ${userId}: ${activityType}`);
            return data;
        } catch (err) {
            console.error(`Failed to validate activity:`, err);
            return null;
        }
    }

    /**
     * Wait for data to appear (with retries)
     * Useful for eventual consistency scenarios
     * @param {Function} validationFn - Function to check if data exists
     * @param {number} maxRetries - Maximum retry attempts
     * @param {number} delay - Delay between retries in ms
     */
    async waitForData(validationFn, maxRetries = 5, delay = 1000) {
        for (let i = 0; i < maxRetries; i++) {
            const result = await validationFn();
            if (result) {
                return result;
            }
            
            if (i < maxRetries - 1) {
                console.log(`Data not found, retrying in ${delay}ms... (${i + 1}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
        
        console.warn(`Data not found after ${maxRetries} attempts`);
        return null;
    }

    /**
     * Validate multiple conditions
     * @param {Array<Function>} validators - Array of validation functions
     * @returns {Promise<Object>} Results of all validations
     */
    async validateMultiple(validators) {
        const results = {};
        
        for (const [name, validator] of Object.entries(validators)) {
            try {
                results[name] = await validator();
            } catch (error) {
                console.error(`Validation failed for ${name}:`, error);
                results[name] = { error: error.message };
            }
        }
        
        return results;
    }
}

module.exports = SupabaseValidator;