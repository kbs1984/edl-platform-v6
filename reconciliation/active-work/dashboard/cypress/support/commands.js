// ***********************************************
// Custom commands for EDL Platform testing
// ***********************************************

// Login command for reuse across tests
Cypress.Commands.add('login', (email = 'brian.bumsik.kim+08test@gmail.com', password = 'TestPassword123!') => {
  cy.visit('/sign-in');
  cy.get('input[type="email"]', { timeout: 10000 }).type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url({ timeout: 10000 }).should('include', '/dashboard');
});

// Wait for React to hydrate
Cypress.Commands.add('waitForReact', () => {
  cy.window().its('React').should('not.be.undefined');
});

// Get element by data-testid (following best practices)
Cypress.Commands.add('getByTestId', (testId) => {
  return cy.get(`[data-testid="${testId}"]`);
});

// Get element by data-cy (Cypress-specific)
Cypress.Commands.add('getByCy', (cyId) => {
  return cy.get(`[data-cy="${cyId}"]`);
});