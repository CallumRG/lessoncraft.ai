describe('Profile Page and functionalities', () => {
    beforeEach(() => {
        cy.visit('/signin');
        cy.get('input[type="email"]').type('test@test.test');
        cy.get('input[type="password"]').type('Testing123');
        cy.get('button[type="submit"]').click();
        cy.visit('/setting');
    });

    it('should have user details', () => {
        cy.contains('h2', 'Account Setting');
      });




    it('sends a password reset email when requested', () => {
      cy.visit('/signin');
      cy.contains('Reset Password').click();
      cy.url().should('include', '/passwordforget');
    });


  });