describe('Session 153: Dashboard Inspection', () => {
  it('should login and inspect the dashboard', () => {
    // Visit login page
    cy.visit('http://localhost:3000/login');
    
    // Fill in credentials - Cypress handles input properly!
    // Use first() to get the first email input since there might be multiple
    cy.get('[data-testid="email"]').first().type('brian.bumsik.kim+08test@gmail.com');
    cy.get('[data-testid="password"]').first().type('16180339*emD');
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Wait for redirect to dashboard
    cy.url().should('include', 'localhost:3001', { timeout: 10000 });
    
    // Now inspect the dashboard
    cy.log('Successfully logged in!');
    
    // Check for addiction bar elements
    cy.get('body').then($body => {
      // Check addiction elements
      const addictionElements = [
        { selector: '#v5-emcoin-balance', name: 'EmCoin Balance' },
        { selector: '#v5-streak-count', name: 'Streak Count' },
        { selector: '#v5-today-count', name: 'Today Count' },
        { selector: '#v5-rank-position', name: 'Rank Position' }
      ];
      
      addictionElements.forEach(elem => {
        if ($body.find(elem.selector).length > 0) {
          cy.get(elem.selector).then($el => {
            cy.log(`✅ ${elem.name}: ${$el.text()}`);
          });
        } else {
          cy.log(`❌ ${elem.name}: NOT FOUND`);
        }
      });
    });
    
    // Check navigation links
    cy.get('a[href^="/"]').each($link => {
      const href = $link.attr('href');
      const text = $link.text().trim();
      if (text && href !== '/') {
        cy.log(`Navigation: ${href} - ${text}`);
      }
    });
    
    // Take screenshot of dashboard
    cy.screenshot('session-153-dashboard-cypress', { capture: 'fullPage' });
    
    // Try navigating to Friends
    cy.get('a[href="/friends"]').should('exist').click({ force: true });
    cy.wait(2000);
    
    cy.url().then(url => {
      if (url.includes('/friends')) {
        cy.log('✅ Successfully navigated to Friends');
        cy.screenshot('session-153-friends-cypress', { capture: 'fullPage' });
        
        // Check Friends page content
        cy.get('body').invoke('text').then(text => {
          cy.log('Friends page content preview:', text.substring(0, 200));
        });
      } else {
        cy.log('❌ Could not navigate to Friends');
      }
    });
    
    // Navigate to other pages
    const pages = ['/activities', '/groups', '/progress'];
    
    pages.forEach(page => {
      cy.get('body').then($body => {
        if ($body.find(`a[href="${page}"]`).length > 0) {
          cy.get(`a[href="${page}"]`).click({ force: true });
          cy.wait(2000);
          
          cy.url().then(url => {
            if (url.includes(page)) {
              cy.log(`✅ Navigated to ${page}`);
              cy.screenshot(`session-153-${page.substring(1)}-cypress`, { capture: 'fullPage' });
            } else {
              cy.log(`❌ Could not navigate to ${page}`);
            }
          });
        }
      });
    });
    
    // Final analysis
    cy.window().then(win => {
      if (win.v5) {
        cy.log('✅ V5 Integration found');
        cy.log('V5 modules:', JSON.stringify({
          hasAddiction: typeof win.v5.addiction !== 'undefined',
          hasProgress: typeof win.v5.progress !== 'undefined',
          hasEmcoin: typeof win.v5.emcoin !== 'undefined'
        }));
      } else {
        cy.log('❌ V5 Integration NOT found');
      }
    });
  });
});