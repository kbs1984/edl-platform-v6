describe('Authentication Flow', () => {
  beforeEach(() => {
    // Clear cookies and local storage before each test
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  describe('Login Page', () => {
    it('should display the login form correctly', () => {
      cy.visit('http://localhost:3000/login');
      
      // Check for form elements
      cy.get('input[name="email"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
      cy.get('[data-testid="submit-button"]').should('be.visible');
      
      // Check for branding
      cy.contains('Welcome Back!').should('be.visible');
    });

    it('should be able to type in email and password fields', () => {
      cy.visit('http://localhost:3000/login');
      
      const testEmail = 'test@example.com';
      const testPassword = 'TestPassword123!';
      
      // Type in email field
      cy.get('input[name="email"]').type(testEmail);
      cy.get('input[name="email"]').should('have.value', testEmail);
      
      // Type in password field
      cy.get('input[name="password"]').type(testPassword);
      cy.get('input[name="password"]').should('have.value', testPassword);
    });

    it('should show validation errors for empty fields', () => {
      cy.visit('http://localhost:3000/login');
      
      // Try to submit without filling fields
      cy.get('[data-testid="submit-button"]').click();
      
      // Check HTML5 validation (browser native)
      cy.get('input[name="email"]:invalid').should('exist');
      cy.get('input[name="password"]:invalid').should('exist');
    });

    it('should attempt login with valid credentials', () => {
      cy.visit('http://localhost:3000/login');
      
      // Use the test account credentials
      const testEmail = 'brian.bumsik.kim+08test@gmail.com';
      const testPassword = 'TestPassword123!'; // You'll need the actual password
      
      // Fill in the form
      cy.get('input[name="email"]').type(testEmail);
      cy.get('input[name="password"]').type(testPassword);
      
      // Submit the form
      cy.get('[data-testid="submit-button"]').click();
      
      // Wait for navigation (adjust URL based on actual redirect)
      // If login is successful, it should redirect to dashboard
      cy.url({ timeout: 10000 }).should('include', '/dashboard');
    });

    it('should show error message for invalid credentials', () => {
      cy.visit('http://localhost:3000/login');
      
      // Use invalid credentials
      cy.get('input[name="email"]').type('invalid@example.com');
      cy.get('input[name="password"]').type('WrongPassword123!');
      
      // Submit the form
      cy.get('[data-testid="submit-button"]').click();
      
      // Should stay on login page and show error
      cy.url({ timeout: 5000 }).should('include', '/login');
      // Check for error message (adjust selector based on actual implementation)
      cy.contains(/invalid|incorrect|failed/i, { timeout: 5000 }).should('be.visible');
    });
  });

  describe('Sign Up Page', () => {
    it('should display the signup form correctly', () => {
      cy.visit('http://localhost:3000/sign-up');
      
      // Check for form elements
      cy.get('input[name="email"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
      cy.get('input[name="confirm"]').should('be.visible');
      cy.get('[data-testid="submit-button"]').should('be.visible');
      
      // Check for branding
      cy.contains('Create an account').should('be.visible');
    });

    it('should validate password requirements', () => {
      cy.visit('http://localhost:3000/sign-up');
      
      // Type a weak password
      cy.get('input[name="password"]').type('weak');
      
      // Check for password requirement indicators (based on PasswordInput component)
      cy.contains('At least 10 characters').should('be.visible');
      cy.contains('At least one special character').should('be.visible');
      cy.contains('At least one letter').should('be.visible');
      cy.contains('At least one number').should('be.visible');
    });

    it('should be able to fill all signup fields', () => {
      cy.visit('http://localhost:3000/sign-up');
      
      const testEmail = 'newuser@example.com';
      const testPassword = 'StrongPass123!@#';
      
      // Fill in all fields
      cy.get('input[name="email"]').type(testEmail);
      cy.get('input[name="email"]').should('have.value', testEmail);
      
      cy.get('input[name="password"]').type(testPassword);
      cy.get('input[name="password"]').should('have.value', testPassword);
      
      cy.get('input[name="confirm"]').type(testPassword);
      cy.get('input[name="confirm"]').should('have.value', testPassword);
    });
  });

  describe('Navigation between auth pages', () => {
    it('should navigate from login to signup', () => {
      cy.visit('http://localhost:3000/login');
      
      // Click on sign up link
      cy.contains('Sign up').click();
      
      // Should navigate to signup page
      cy.url().should('include', '/sign-up');
      cy.contains('Create an account').should('be.visible');
    });

    it('should navigate to forgot password', () => {
      cy.visit('http://localhost:3000/login');
      
      // Click on forgot password link
      cy.contains('Forgot Password?').click();
      
      // Should navigate to forgot password page
      cy.url().should('include', '/forgot-password');
    });
  });
});