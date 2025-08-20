/**
 * Supabase Client for EDL Platform
 * Adapted from emdash-auth system
 * Session 36: Auth Integration
 */

class SupabaseClient {
    constructor() {
        this.url = "https://bbrheacetxlnqbibjwsz.supabase.co";
        this.anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE";
        this.authToken = null;
        this.user = null;
        
        // Load from localStorage if available
        this.loadSession();
    }

    loadSession() {
        try {
            const session = localStorage.getItem('sb-auth-token');
            if (session) {
                const parsed = JSON.parse(session);
                this.authToken = parsed.access_token;
                this.user = parsed.user;
            }
        } catch (e) {
            console.warn('Could not load session:', e);
        }
    }

    saveSession(session) {
        try {
            if (session) {
                localStorage.setItem('sb-auth-token', JSON.stringify(session));
                this.authToken = session.access_token;
                this.user = session.user;
            } else {
                localStorage.removeItem('sb-auth-token');
                this.authToken = null;
                this.user = null;
            }
        } catch (e) {
            console.error('Could not save session:', e);
        }
    }

    async signUp(email, password, callSign = null) {
        const response = await fetch(`${this.url}/auth/v1/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': this.anonKey,
                'Authorization': `Bearer ${this.anonKey}`
            },
            body: JSON.stringify({
                email,
                password,
                data: callSign ? { call_sign: callSign } : {}
            })
        });

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message);
        }

        if (data.session) {
            this.saveSession(data.session);
        }

        return data;
    }

    async signIn(email, password) {
        const response = await fetch(`${this.url}/auth/v1/token?grant_type=password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': this.anonKey,
                'Authorization': `Bearer ${this.anonKey}`
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message);
        }

        if (data.session || data.access_token) {
            const session = data.session || {
                access_token: data.access_token,
                user: data.user
            };
            this.saveSession(session);
        }

        return data;
    }

    async signOut() {
        if (this.authToken) {
            try {
                await fetch(`${this.url}/auth/v1/logout`, {
                    method: 'POST',
                    headers: {
                        'apikey': this.anonKey,
                        'Authorization': `Bearer ${this.authToken}`
                    }
                });
            } catch (e) {
                console.warn('Error during logout:', e);
            }
        }
        
        this.saveSession(null);
    }

    async getCurrentUser() {
        if (!this.authToken) {
            return null;
        }

        try {
            const response = await fetch(`${this.url}/auth/v1/user`, {
                headers: {
                    'apikey': this.anonKey,
                    'Authorization': `Bearer ${this.authToken}`
                }
            });

            if (response.ok) {
                const user = await response.json();
                this.user = user;
                return user;
            }
        } catch (e) {
            console.warn('Error getting current user:', e);
        }

        return null;
    }

    async createProfile(userId, callSign, role = 'student', gradeLevel = null) {
        if (!this.authToken) {
            throw new Error('Not authenticated');
        }

        const response = await fetch(`${this.url}/rest/v1/profiles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': this.anonKey,
                'Authorization': `Bearer ${this.authToken}`,
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                user_id: userId,
                call_sign: callSign,
                role: role,
                grade_level: gradeLevel
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to create profile');
        }

        return data;
    }

    isAuthenticated() {
        return !!this.authToken && !!this.user;
    }

    getUser() {
        return this.user;
    }
}

// Create global instance
window.supabase = new SupabaseClient();