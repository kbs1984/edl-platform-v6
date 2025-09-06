/**
 * Test Data Cleanup Utilities
 * Session 133 - Batch cleanup of test data after test runs
 * 
 * Removes test users, teams, and related data from Supabase
 */

const { createClient } = require('@supabase/supabase-js');

class TestCleanup {
    constructor() {
        // Using known public credentials
        this.supabaseUrl = process.env.SUPABASE_URL || 'https://bbrheacetxlnqbibjwsz.supabase.co';
        this.supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE';
        
        this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
        this.dryRun = process.env.DRY_RUN === 'true';
        
        console.log(`Test cleanup initialized (dry run: ${this.dryRun})`);
    }

    /**
     * Clean up test users and all related data
     * @param {string} emailPattern - Pattern to match test emails (default: emails with +test_)
     * @returns {Promise<Object>} Cleanup results
     */
    async cleanupTestUsers(emailPattern = '+test_') {
        console.log(`Starting cleanup of test users matching: ${emailPattern}`);
        
        const results = {
            users: { found: 0, deleted: 0, errors: [] },
            friendships: { deleted: 0 },
            teamMemberships: { deleted: 0 },
            activities: { deleted: 0 },
            profiles: { deleted: 0 }
        };
        
        try {
            // First, get all test users
            const { data: testUsers, error: fetchError } = await this.supabase
                .from('profile')
                .select('id, email')
                .like('email', `%${emailPattern}%`);
            
            if (fetchError) {
                console.error('Error fetching test users:', fetchError);
                results.users.errors.push(fetchError.message);
                return results;
            }
            
            results.users.found = testUsers ? testUsers.length : 0;
            console.log(`Found ${results.users.found} test users to clean up`);
            
            if (results.users.found === 0) {
                console.log('No test users found to clean up');
                return results;
            }
            
            // Extract user IDs for cascade deletion
            const userIds = testUsers.map(u => u.id);
            const userEmails = testUsers.map(u => u.email);
            
            // Clean in reverse dependency order to avoid foreign key violations
            
            // 1. Delete activities
            if (!this.dryRun) {
                const { error: activityError, count } = await this.supabase
                    .from('activity')
                    .delete()
                    .in('user_id', userIds);
                
                if (activityError) {
                    console.error('Error deleting activities:', activityError);
                    results.users.errors.push(`Activities: ${activityError.message}`);
                } else {
                    results.activities.deleted = count || 0;
                    console.log(`Deleted ${results.activities.deleted} activities`);
                }
            }
            
            // 2. Delete friendships
            if (!this.dryRun) {
                const { error: friendshipError, count } = await this.supabase
                    .from('friendship')
                    .delete()
                    .or(`user_id.in.(${userIds.join(',')}),friend_id.in.(${userIds.join(',')})`);
                
                if (friendshipError) {
                    console.error('Error deleting friendships:', friendshipError);
                    results.users.errors.push(`Friendships: ${friendshipError.message}`);
                } else {
                    results.friendships.deleted = count || 0;
                    console.log(`Deleted ${results.friendships.deleted} friendships`);
                }
            }
            
            // 3. Delete team memberships
            if (!this.dryRun) {
                const { error: membershipError, count } = await this.supabase
                    .from('team_members')
                    .delete()
                    .in('user_id', userIds);
                
                if (membershipError) {
                    console.error('Error deleting team memberships:', membershipError);
                    results.users.errors.push(`Memberships: ${membershipError.message}`);
                } else {
                    results.teamMemberships.deleted = count || 0;
                    console.log(`Deleted ${results.teamMemberships.deleted} team memberships`);
                }
            }
            
            // 4. Delete profiles
            if (!this.dryRun) {
                const { error: profileError, count } = await this.supabase
                    .from('profile')
                    .delete()
                    .in('email', userEmails);
                
                if (profileError) {
                    console.error('Error deleting profiles:', profileError);
                    results.users.errors.push(`Profiles: ${profileError.message}`);
                } else {
                    results.profiles.deleted = count || 0;
                    console.log(`Deleted ${results.profiles.deleted} profiles`);
                }
            }
            
            // Note: auth.users table requires service role key to delete
            // For now, we'll only clean up the profile table
            results.users.deleted = results.profiles.deleted;
            
            if (this.dryRun) {
                console.log('DRY RUN - No data was actually deleted');
            }
            
        } catch (error) {
            console.error('Unexpected error during cleanup:', error);
            results.users.errors.push(`Unexpected: ${error.message}`);
        }
        
        return results;
    }

    /**
     * Clean up test teams
     * @param {string} namePattern - Pattern to match test team names (default: teams starting with 'Test Team')
     * @returns {Promise<Object>} Cleanup results
     */
    async cleanupTestTeams(namePattern = 'Test Team%') {
        console.log(`Starting cleanup of test teams matching: ${namePattern}`);
        
        const results = {
            teams: { found: 0, deleted: 0, errors: [] },
            memberships: { deleted: 0 }
        };
        
        try {
            // Get test teams
            const { data: testTeams, error: fetchError } = await this.supabase
                .from('teams')
                .select('id, name')
                .like('name', namePattern);
            
            if (fetchError) {
                console.error('Error fetching test teams:', fetchError);
                results.teams.errors.push(fetchError.message);
                return results;
            }
            
            results.teams.found = testTeams ? testTeams.length : 0;
            console.log(`Found ${results.teams.found} test teams to clean up`);
            
            if (results.teams.found === 0) {
                console.log('No test teams found to clean up');
                return results;
            }
            
            const teamIds = testTeams.map(t => t.id);
            
            // Delete team memberships first
            if (!this.dryRun) {
                const { error: membershipError, count } = await this.supabase
                    .from('team_members')
                    .delete()
                    .in('team_id', teamIds);
                
                if (membershipError) {
                    console.error('Error deleting team memberships:', membershipError);
                    results.teams.errors.push(`Memberships: ${membershipError.message}`);
                } else {
                    results.memberships.deleted = count || 0;
                    console.log(`Deleted ${results.memberships.deleted} team memberships`);
                }
            }
            
            // Delete teams
            if (!this.dryRun) {
                const { error: teamError, count } = await this.supabase
                    .from('teams')
                    .delete()
                    .in('id', teamIds);
                
                if (teamError) {
                    console.error('Error deleting teams:', teamError);
                    results.teams.errors.push(`Teams: ${teamError.message}`);
                } else {
                    results.teams.deleted = count || 0;
                    console.log(`Deleted ${results.teams.deleted} teams`);
                }
            }
            
            if (this.dryRun) {
                console.log('DRY RUN - No data was actually deleted');
            }
            
        } catch (error) {
            console.error('Unexpected error during team cleanup:', error);
            results.teams.errors.push(`Unexpected: ${error.message}`);
        }
        
        return results;
    }

    /**
     * Clean up all test data (users and teams)
     * @returns {Promise<Object>} Combined cleanup results
     */
    async cleanupAll() {
        console.log('Starting complete test data cleanup');
        
        const results = {
            users: await this.cleanupTestUsers(),
            teams: await this.cleanupTestTeams(),
            timestamp: new Date().toISOString()
        };
        
        // Summary
        console.log('\n=== Cleanup Summary ===');
        console.log(`Users deleted: ${results.users.users.deleted}/${results.users.users.found}`);
        console.log(`Profiles deleted: ${results.users.profiles.deleted}`);
        console.log(`Friendships deleted: ${results.users.friendships.deleted}`);
        console.log(`Activities deleted: ${results.users.activities.deleted}`);
        console.log(`Teams deleted: ${results.teams.teams.deleted}/${results.teams.teams.found}`);
        console.log(`Team memberships deleted: ${results.users.teamMemberships.deleted + results.teams.memberships.deleted}`);
        
        if (results.users.users.errors.length > 0 || results.teams.teams.errors.length > 0) {
            console.log('\n⚠️ Errors encountered:');
            [...results.users.users.errors, ...results.teams.teams.errors].forEach(err => {
                console.log(`  - ${err}`);
            });
        }
        
        return results;
    }

    /**
     * Get statistics about test data without deleting
     * @returns {Promise<Object>} Statistics about test data
     */
    async getTestDataStats() {
        console.log('Gathering test data statistics...');
        
        const stats = {
            users: 0,
            teams: 0,
            friendships: 0,
            teamMemberships: 0,
            activities: 0
        };
        
        try {
            // Count test users
            const { count: userCount } = await this.supabase
                .from('profile')
                .select('*', { count: 'exact', head: true })
                .like('email', '%+test_%');
            stats.users = userCount || 0;
            
            // Count test teams
            const { count: teamCount } = await this.supabase
                .from('teams')
                .select('*', { count: 'exact', head: true })
                .like('name', 'Test Team%');
            stats.teams = teamCount || 0;
            
            // Get test user IDs for related counts
            const { data: testUsers } = await this.supabase
                .from('profile')
                .select('id')
                .like('email', '%+test_%');
            
            if (testUsers && testUsers.length > 0) {
                const userIds = testUsers.map(u => u.id);
                
                // Count friendships
                const { count: friendshipCount } = await this.supabase
                    .from('friendship')
                    .select('*', { count: 'exact', head: true })
                    .or(`user_id.in.(${userIds.join(',')}),friend_id.in.(${userIds.join(',')})`);
                stats.friendships = friendshipCount || 0;
                
                // Count team memberships
                const { count: membershipCount } = await this.supabase
                    .from('team_members')
                    .select('*', { count: 'exact', head: true })
                    .in('user_id', userIds);
                stats.teamMemberships = membershipCount || 0;
                
                // Count activities
                const { count: activityCount } = await this.supabase
                    .from('activity')
                    .select('*', { count: 'exact', head: true })
                    .in('user_id', userIds);
                stats.activities = activityCount || 0;
            }
            
        } catch (error) {
            console.error('Error gathering statistics:', error);
        }
        
        console.log('Test Data Statistics:', stats);
        return stats;
    }

    /**
     * Set dry run mode
     * @param {boolean} enabled - Whether to enable dry run mode
     */
    setDryRun(enabled) {
        this.dryRun = enabled;
        console.log(`Dry run mode ${enabled ? 'enabled' : 'disabled'}`);
    }
}

module.exports = TestCleanup;