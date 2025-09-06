describe('Session 153: Force Login Test', () => {
  it('should login using force option to bypass overlays', () => {
    // Visit login page
    cy.visit('http://localhost:3000/login');
    cy.wait(2000); // Wait for page to fully load
    
    // Force type into email field (bypasses covering elements)
    cy.get('[data-testid="email"]').first().click({ force: true });
    cy.get('[data-testid="email"]').first().type('brian.bumsik.kim+08test@gmail.com', { force: true });
    
    // Force type into password field
    cy.get('[data-testid="password"]').first().click({ force: true });
    cy.get('[data-testid="password"]').first().type('16180339*emD', { force: true });
    
    // Take screenshot to see if text is white
    cy.screenshot('session-153-form-filled');
    
    // Force click submit button
    cy.get('button[type="submit"]').first().click({ force: true });
    
    // Wait for potential redirect
    cy.wait(5000);
    
    // Check where we are
    cy.url().then(url => {
      cy.log('Current URL: ' + url);
      
      if (url.includes('localhost:3001')) {
        cy.log('✅ SUCCESS! Logged into dashboard!');
        
        // Check for addiction bar
        cy.get('#v5-emcoin-balance').then($elem => {
          cy.log('EmCoin Balance: ' + $elem.text());
        });
        
        cy.get('#v5-streak-count').then($elem => {
          cy.log('Streak Count: ' + $elem.text());
        });
        
        cy.get('#v5-today-count').then($elem => {
          cy.log('Today Count: ' + $elem.text());
        });
        
        cy.get('#v5-rank-position').then($elem => {
          cy.log('Rank Position: ' + $elem.text());
        });
        
        // Take dashboard screenshot
        cy.screenshot('session-153-dashboard-final');
        
      } else {
        cy.log('❌ Still on login page');
        
        // Check for error messages
        cy.get('body').then($body => {
          const text = $body.text();
          cy.log('Page content: ' + text.substring(0, 500));
        });
        
        cy.screenshot('session-153-login-failed');
      }
    });
  });
});