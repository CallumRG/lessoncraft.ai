describe('Profile Page and functionalities', () => {
    beforeEach(() => {
        cy.visit('/signin');
        cy.get('input[type="email"]').type('test@test.test');
        cy.get('input[type="password"]').type('Testing123');
        cy.get('button[type="submit"]').click();
        cy.visit('/profile');
    });

    it('should have user details', () => {
        cy.contains('h5', 'Details');
      });




    it('sends a password reset email when requested', () => {
      cy.visit('/signin');
      cy.contains('Reset Password').click();
      cy.url().should('include', '/passwordforget');
    });


  });