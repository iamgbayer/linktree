/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      login(username?: string, password?: string): void;
    }
  }
}

Cypress.Commands.add('login', (username?: string, password?: string) => {
  const u = username || 'iamgbayer';
  const p = password || 'g123g';

  cy.session([u, p], () => {
    cy.visit('/');
    cy.get('[data-cy="login-username-input"]').type(u);
    cy.get('[data-cy="login-password-input"]').type(p);
    cy.get('[data-cy="login-submit-button"]').click();
    cy.url().should('include', '/admin'); 
    cy.get('[data-cy="add-new-link-button"]').should('be.visible');
    cy.window().its('localStorage.isAuthenticated').should('eq', 'true');
  }, {
    cacheAcrossSpecs: true
  });
});

export {};
