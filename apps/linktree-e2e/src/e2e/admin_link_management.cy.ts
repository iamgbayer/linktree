describe('Admin Link Management and Public Profile Verification', () => {
  const FIXED_USERNAME = 'iamgbayer';
  let linkIdSuffix: string;

  beforeEach(() => {
    linkIdSuffix = Date.now().toString();
    cy.login();
    cy.visit('/admin'); 
    cy.contains('Loading data...').should('not.exist');

    cy.get('[data-cy="add-new-link-button"]').should('be.visible');
  });

  const uniqueTitle = (baseTitle: string) => `${baseTitle} ${linkIdSuffix}`;
  const uniqueUrl = (baseUrl: string) => `${baseUrl}?id=${linkIdSuffix}`;

  it('should allow creating a new link and verify it on the public profile', () => {
    const newLinkTitle = uniqueTitle('Test Link E2E');
    const newLinkUrl = uniqueUrl('https://test-e2e.com');

    cy.get('[data-cy="add-new-link-button"]').click();
    cy.get('[data-cy="link-dialog"]').should('be.visible');

    cy.get('[data-cy="link-title-input"]').type(newLinkTitle);
    cy.get('[data-cy="link-url-input"]').type(newLinkUrl);
    cy.get('[data-cy="save-link-button"]').click();

    // Wait for dialog to close and link to appear in the table
    cy.get('[data-cy="link-dialog"]').should('not.exist');
    cy.get('[data-cy="links-table"]').contains('td', newLinkTitle).should('be.visible');
    cy.get('[data-cy="links-table"]').contains('td', newLinkUrl.replace('https://', '')).should('be.visible');

    // Verify on public profile
    cy.visit(`/${FIXED_USERNAME}`);
    cy.get(`[data-cy^="public-link-"]`).contains(newLinkTitle)
      .should('be.visible')
      .and('have.attr', 'href', newLinkUrl);
  });

  it('should allow editing an existing link and verify changes on the public profile', () => {
    const initialLinkTitle = uniqueTitle('Editable Link');
    const initialLinkUrl = uniqueUrl('https://editable.com');
    const updatedLinkTitle = uniqueTitle('Updated Link E2E');
    const updatedLinkUrl = uniqueUrl('https://updated-e2e.com');

    // 1. Create a link to edit first
    cy.get('[data-cy="add-new-link-button"]').click();
    cy.get('[data-cy="link-title-input"]').type(initialLinkTitle);
    cy.get('[data-cy="link-url-input"]').type(initialLinkUrl);
    cy.get('[data-cy="save-link-button"]').click();
    cy.get('[data-cy="link-dialog"]').should('not.exist');
    
    cy.get('[data-cy="links-table"]').contains('td', initialLinkTitle).parents('[data-cy^="link-row-"]').then(($row) => {
      const rowId = $row.data('cy').split('-').pop();
      cy.get(`[data-cy="edit-link-button-${rowId}"]`).click();
    });

    cy.get('[data-cy="link-dialog"]').should('be.visible');
    cy.get('[data-cy="link-title-input"]').clear().type(updatedLinkTitle);
    cy.get('[data-cy="link-url-input"]').clear().type(updatedLinkUrl);
    cy.get('[data-cy="save-link-button"]').click();

    cy.get('[data-cy="link-dialog"]').should('not.exist');
    cy.get('[data-cy="links-table"]').contains('td', updatedLinkTitle).should('be.visible');
    cy.get('[data-cy="links-table"]').contains('td', updatedLinkUrl.replace('https://', '')).should('be.visible');
    cy.get('[data-cy="links-table"]').contains('td', initialLinkTitle).should('not.exist');

    // Verify on public profile
    cy.visit(`/${FIXED_USERNAME}`);
    cy.get(`[data-cy^="public-link-"]`).contains(updatedLinkTitle)
      .should('be.visible')
      .and('have.attr', 'href', updatedLinkUrl);
    cy.get('[data-cy="public-links-container"]').contains(initialLinkTitle).should('not.exist');
  });

  it('should allow deleting an existing link and verify its removal from the public profile', () => {
    const linkToDeleteTitle = uniqueTitle('Deletable Link');
    const linkToDeleteUrl = uniqueUrl('https://deletable.com');

    // 1. Create a link to delete
    cy.get('[data-cy="add-new-link-button"]').click();
    cy.get('[data-cy="link-title-input"]').type(linkToDeleteTitle);
    cy.get('[data-cy="link-url-input"]').type(linkToDeleteUrl);
    cy.get('[data-cy="save-link-button"]').click();
    cy.get('[data-cy="link-dialog"]').should('not.exist');

    // Find and delete
    cy.get('[data-cy="links-table"]').contains('td', linkToDeleteTitle).parents('[data-cy^="link-row-"]').then(($row) => {
        const rowId = $row.data('cy').split('-').pop();
        cy.get(`[data-cy="delete-link-button-${rowId}"]`).click();
    });

    // Handle confirmation dialog if you have one. For window.confirm:
    cy.on('window:confirm', () => true);

    cy.get('[data-cy="links-table"]').contains('td', linkToDeleteTitle).should('not.exist');

    // Verify on public profile
    cy.visit(`/${FIXED_USERNAME}`);
    cy.get('[data-cy="public-links-container"]').contains(linkToDeleteTitle).should('not.exist');
  });

  it('should handle link visibility on the public profile', () => {
    const linkTitle = uniqueTitle('Visibility Test Link');
    const linkUrl = uniqueUrl('https://visibility-test.com');

    // 1. Create a new link (should be visible by default)
    cy.get('[data-cy="add-new-link-button"]').click();
    cy.get('[data-cy="link-dialog"]').should('be.visible');
    cy.get('[data-cy="link-title-input"]').type(linkTitle);
    cy.get('[data-cy="link-url-input"]').type(linkUrl);
    cy.get('[data-cy="link-visible-switch"]').should('have.attr', 'data-state', 'checked');
    cy.get('[data-cy="save-link-button"]').click();
    cy.get('[data-cy="link-dialog"]').should('not.exist');
    cy.get('[data-cy="links-table"]').contains('td', linkTitle).should('be.visible');

    // 2. Verify it's visible on the public profile
    cy.visit(`/${FIXED_USERNAME}`);
    cy.get(`[data-cy^="public-link-"]`).contains(linkTitle)
      .should('be.visible')
      .and('have.attr', 'href', linkUrl);

    // 3. Edit the link to make it invisible
    cy.visit('/admin');
    cy.get('[data-cy="links-table"]').contains('td', linkTitle).parents('[data-cy^="link-row-"]').then(($row) => {
      const rowId = $row.data('cy').split('-').pop();
      cy.get(`[data-cy="edit-link-button-${rowId}"]`).click();
    });
    cy.get('[data-cy="link-dialog"]').should('be.visible');
    cy.get('[data-cy="link-visible-switch"]').click();
    cy.get('[data-cy="link-visible-switch"]').should('have.attr', 'data-state', 'unchecked');
    cy.get('[data-cy="save-link-button"]').click();
    cy.get('[data-cy="link-dialog"]').should('not.exist');

    // 4. Verify it's NOT visible on the public profile
    cy.visit(`/${FIXED_USERNAME}`);
    cy.get('[data-cy="public-links-container"]').contains(linkTitle).should('not.exist');

    // 5. Edit the link to make it visible again
    cy.visit('/admin');
    cy.get('[data-cy="links-table"]').contains('td', linkTitle).parents('[data-cy^="link-row-"]').then(($row) => {
      const rowId = $row.data('cy').split('-').pop();
      cy.get(`[data-cy="edit-link-button-${rowId}"]`).click();
    });
    cy.get('[data-cy="link-dialog"]').should('be.visible');
    cy.get('[data-cy="link-visible-switch"]').click();
    cy.get('[data-cy="link-visible-switch"]').should('have.attr', 'data-state', 'checked');
    cy.get('[data-cy="save-link-button"]').click();
    cy.get('[data-cy="link-dialog"]').should('not.exist');

    // 6. Verify it's visible again on the public profile
    cy.visit(`/${FIXED_USERNAME}`);
    cy.get(`[data-cy^="public-link-"]`).contains(linkTitle)
      .should('be.visible')
      .and('have.attr', 'href', linkUrl);
  });
});
