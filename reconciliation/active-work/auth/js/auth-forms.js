/**
 * Auth Forms for EDL Platform
 * Adapted from emdash-auth system
 * Session 36: Auth Integration
 */

class AuthForms {
    constructor() {
        this.currentForm = 'login';
        this.init();
    }

    init() {
        // Check if user is already logged in
        if (window.supabase && window.supabase.isAuthenticated()) {
            this.redirectToDashboard();
            return;
        }

        this.render();
        this.bindEvents();
    }

    validatePassword(password) {
        const errors = [];
        
        if (password.length < 10) {
            errors.push("Password must be at least 10 characters long");
        }
        if (!/[A-Za-z]/.test(password)) {
            errors.push("Password must include at least one English letter");
        }
        if (!/[0-9]/.test(password)) {
            errors.push("Password must include at least one digit");
        }
        const allowedSpecialCharRegex = /[!"#$%&'()*+,\-./:;<=>?@\[₩\]\^_`{\|}~]/;
        if (!allowedSpecialCharRegex.test(password)) {
            errors.push("Password must include at least one allowed special character");
        }
        const allowedCharsRegex = /^[A-Za-z0-9!"#$%&'()*+,\-./:;<=>?@\[₩\]\^_`{\|}~]+$/;
        if (!allowedCharsRegex.test(password)) {
            errors.push("Password contains invalid characters or whitespace is not allowed");
        }
        
        return errors;
    }

    showError(message) {
        const errorDiv = document.getElementById('auth-error');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    }

    hideError() {
        const errorDiv = document.getElementById('auth-error');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }

    showLoading(button) {
        const originalText = button.textContent;
        button.textContent = button.dataset.loadingText || 'Loading...';
        button.disabled = true;
        button.dataset.originalText = originalText;
    }

    hideLoading(button) {
        if (button.dataset.originalText) {
            button.textContent = button.dataset.originalText;
            delete button.dataset.originalText;
        }
        button.disabled = false;
    }

    async handleLogin(e) {
        e.preventDefault();
        this.hideError();

        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;
        const submitBtn = form.querySelector('button[type="submit"]');

        this.showLoading(submitBtn);

        try {
            const result = await window.supabase.signIn(email, password);
            
            if (result.user) {
                // Success - redirect to dashboard
                this.redirectToDashboard();
            }
        } catch (error) {
            this.showError(error.message);
            this.hideLoading(submitBtn);
        }
    }

    async handleSignup(e) {
        e.preventDefault();
        this.hideError();

        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;
        const confirmPassword = form.confirmPassword.value;
        const callSign = form.callSign.value;
        const submitBtn = form.querySelector('button[type="submit"]');

        // Validation
        if (password !== confirmPassword) {
            this.showError("Passwords don't match");
            return;
        }

        const passwordErrors = this.validatePassword(password);
        if (passwordErrors.length > 0) {
            this.showError(passwordErrors[0]);
            return;
        }

        this.showLoading(submitBtn);

        try {
            const result = await window.supabase.signUp(email, password, callSign);
            
            if (result.user) {
                // Create profile if user was created
                if (callSign) {
                    try {
                        await window.supabase.createProfile(result.user.id, callSign);
                    } catch (profileError) {
                        console.warn('Profile creation failed:', profileError);
                        // Continue anyway - profile can be created later
                    }
                }
                
                // Show success message
                this.showSuccess("Account created! Please check your email to verify your account.");
            }
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.hideLoading(submitBtn);
        }
    }

    showSuccess(message) {
        const successDiv = document.getElementById('auth-success');
        if (successDiv) {
            successDiv.textContent = message;
            successDiv.style.display = 'block';
        }
    }

    redirectToDashboard() {
        // Redirect to our dashboard
        window.location.href = './index.html';
    }

    switchForm(formType) {
        this.currentForm = formType;
        this.render();
        this.bindEvents();
    }

    bindEvents() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', this.handleLogin.bind(this));
        }

        // Signup form
        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', this.handleSignup.bind(this));
        }

        // Form switchers
        const switchToSignup = document.getElementById('switch-to-signup');
        if (switchToSignup) {
            switchToSignup.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchForm('signup');
            });
        }

        const switchToLogin = document.getElementById('switch-to-login');
        if (switchToLogin) {
            switchToLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchForm('login');
            });
        }
    }

    render() {
        const container = document.getElementById('auth-container');
        if (!container) return;

        if (this.currentForm === 'login') {
            container.innerHTML = this.getLoginForm();
        } else {
            container.innerHTML = this.getSignupForm();
        }
    }

    getLoginForm() {
        return `
            <div class="auth-form">
                <div class="auth-header">
                    <h1>Welcome Back!</h1>
                    <p>Sign in to your EDL account</p>
                </div>
                
                <div id="auth-error" class="auth-error" style="display: none;"></div>
                <div id="auth-success" class="auth-success" style="display: none;"></div>
                
                <form id="login-form">
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required placeholder="your@email.com">
                    </div>
                    
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" required placeholder="Your password">
                    </div>
                    
                    <button type="submit" class="btn-primary" data-loading-text="Signing In...">
                        Sign In
                    </button>
                </form>
                
                <div class="auth-footer">
                    <p>Don't have an account? <a href="#" id="switch-to-signup">Sign up</a></p>
                </div>
            </div>
        `;
    }

    getSignupForm() {
        return `
            <div class="auth-form">
                <div class="auth-header">
                    <h1>Join EDL Platform</h1>
                    <p>Create your account to start learning</p>
                </div>
                
                <div id="auth-error" class="auth-error" style="display: none;"></div>
                <div id="auth-success" class="auth-success" style="display: none;"></div>
                
                <form id="signup-form">
                    <div class="form-group">
                        <label for="callSign">Call Sign</label>
                        <input type="text" id="callSign" name="callSign" required placeholder="Your unique call sign">
                        <small>This will be your public name on the platform</small>
                    </div>
                    
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required placeholder="your@email.com">
                    </div>
                    
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" required placeholder="Create a strong password">
                        <small>Must be 10+ characters with letters, numbers, and special characters</small>
                    </div>
                    
                    <div class="form-group">
                        <label for="confirmPassword">Confirm Password</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" required placeholder="Confirm your password">
                    </div>
                    
                    <button type="submit" class="btn-primary" data-loading-text="Creating Account...">
                        Create Account
                    </button>
                </form>
                
                <div class="auth-footer">
                    <p>Already have an account? <a href="#" id="switch-to-login">Sign in</a></p>
                </div>
            </div>
        `;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authForms = new AuthForms();
});