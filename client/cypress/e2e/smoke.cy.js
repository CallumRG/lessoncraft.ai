describe('landing page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render the landing page normal', () => {

    //check words
    cy.contains('h1', 'Lessoncraft');
    cy.contains('h2', 'Welcome to Lessoncraft');
    cy.contains('p', 'Not Signed');
    cy.contains('h5', 'Home');
    cy.contains('span', 'Explore');
    cy.contains('span', 'Sign In');
    cy.contains('span', 'Register');
    cy.contains('h5', 'More');
    cy.contains('span', 'Dark Mode');

  });

  it('should render the landing page with left bar compacted', () => {

    //click the left bar
    cy.contains('p', 'Not Signed').click();

    //top text still same
    cy.contains('h1', 'Lessoncraft');
    cy.contains('h2', 'Welcome to Lessoncraft');

    //words on left side not visble to user
    cy.contains('h5', 'Home').should('not.exist');
    cy.contains('h5', 'More').should('not.exist');
    cy.contains('span', 'Dark Mode').should('not.be.visible');
  });

  it('should render the landing page normal after double pressing left bar select', () => {
    //double click spot
    cy.contains('p', 'Not Signed').click();
    cy.get('[data-testid="KeyboardDoubleArrowRightIcon"]').click();

    cy.contains('h1', 'Lessoncraft');
    cy.contains('h2', 'Welcome to Lessoncraft');
    cy.contains('p', 'Not Signed');
    cy.contains('h5', 'Home');
    cy.contains('span', 'Explore');
    cy.contains('span', 'Sign In');
    cy.contains('span', 'Register');
    cy.contains('h5', 'More');
    cy.contains('span', 'Dark Mode');
  });

  it('should navigate to /explore after clicking on the Explore icon', () => {

    //click ontext
    cy.contains('span', 'Explore').click();

    //should be on page
    cy.url().should('include', '/explore');
    cy.contains('h3', 'Explore');
  });

  it('should navigate to /singin after clicking on the sing in icon', () => {
    //click on icon
    cy.contains('span', 'Sign In').click();
   
    //should be on page
    cy.url().should('include', '/signin');
    cy.contains('h2', 'Sign In');
  });

  it('should navigate to /signup after clicking on the sing in icon', () => {
    //click on icon
    cy.contains('span', 'Register').click();

    //should be on page
    cy.url().should('include', '/signup');
    cy.contains('h2', 'Register');
  });

  it('should become light mode after clicking on darkMode', () => {
    //click on dark
    cy.contains('span', 'Dark Mode').click();
    
    //should be on page
    cy.url().should('include', '/');
    cy.contains('span', 'Light Mode');
  });

  it('should become dark mode after clicking on darkMode then lightmode', () => {
    //click on dark
    cy.contains('span', 'Dark Mode').click();
    
    //should be on page
    cy.url().should('include', '/');
    cy.contains('span', 'Light Mode');

    //click on dark
    cy.contains('span', 'Light Mode').click();
    
    //should be on page
    cy.url().should('include', '/');
    cy.contains('span', 'Dark Mode');
  });

  it('should show user name at top left after signed in', () => {
    //sign in
    cy.visit('/signin');
    cy.get('input[type="email"]').type('test@test.test');
    cy.get('input[type="password"]').type('Testing123');
    cy.get('button[type="submit"]').click();

    //wait to login
    cy.url().should('include', '/explore');
    cy.contains('h3', 'Explore');
    
    // go back to home
    cy.visit('/');
  
    // Check if the user's name is displayed at the top left
    cy.contains('test@test.test');
  });
  
  

  

});