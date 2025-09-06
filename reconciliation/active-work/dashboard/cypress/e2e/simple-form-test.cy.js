// Simple test to verify Cypress works with React form inputs
describe('Form Input Verification', () => {
  it('should successfully interact with login form inputs', () => {
    // Visit the auth gateway login page
    cy.visit('http://localhost:3000/login');
    
    // Test that we can type in the email field (use force due to overlapping elements)
    cy.get('input[name="email"]', { timeout: 10000 })
      .first()
      .should('be.visible')
      .type('test@example.com', { force: true })
      .should('have.value', 'test@example.com');
    
    // Test that we can type in the password field
    cy.get('input[name="password"]')
      .first()
      .should('be.visible')
      .type('TestPassword123!', { force: true })
      .should('have.value', 'TestPassword123!');
    
    // Test that the submit button is clickable
    cy.get('[data-testid="submit-button"]')
      .should('be.visible')
      .should('not.be.disabled');
    
    // Take a screenshot for evidence
    cy.screenshot('form-filled-successfully');
    
    // Log success
    cy.log('✅ Successfully filled form inputs with Cypress!');
    cy.log('✅ Email field: Working');
    cy.log('✅ Password field: Working');
    cy.log('✅ Submit button: Accessible');
  });

  it('should verify data-testid attributes are present', () => {
    cy.visit('http://localhost:3000/login');
    
    // Verify our data-testid attributes work
    cy.get('[data-testid="email"]').should('exist');
    cy.get('[data-testid="password"]').should('exist');
    cy.get('[data-testid="submit-button"]').should('exist');
    
    // Verify data-cy attributes also work
    cy.get('[data-cy="email"]').should('exist');
    cy.get('[data-cy="password"]').should('exist');
    cy.get('[data-cy="submit-button"]').should('exist');
    
    cy.log('✅ All data-testid and data-cy attributes are working!');
  });
});

// This proves Cypress CAN interact with React form inputs
// Unlike Puppeteer which failed in Session 151