describe('create page', () => {
  beforeEach(() => {
    cy.visit('/create');
    
  });

  it('should render the create page normal', () => {

    //check words
    cy.contains('h2', 'L E S S O N C R A F T');
    cy.contains('New Lesson');
    cy.contains('New Course');

  });

  it('should navigate to new lesson when clicked', () => {
    cy.contains('New Lesson').click()
    cy.url().should('include', '/newlesson');
    
  });

  it('should navigate to new course when clicked', () => {
    cy.contains('New Course').click()
    cy.url().should('include', '/newcourse');
    
  });

  it('should become dark mode after clicking on darkMode then lightmode', () => {
    //click on dark
    cy.contains('span', 'Dark Mode').click();
    
    //should be on page
    cy.url().should('include', '/create');
    cy.contains('span', 'Light Mode');

    //click on dark
    cy.contains('span', 'Light Mode').click();
    
    //should be on page
    cy.url().should('include', '/create');
    cy.contains('span', 'Dark Mode');
  });

});

describe('create course page', () => {
  beforeEach(() => {
    cy.visit('/newcourse');
    
  });

  it('should render the create new course page normal', () => {

    //check words
    cy.contains('h4', 'Create New Course');
    cy.contains('label', 'Course Name');
    cy.contains('label', 'Description');
    cy.contains('label', 'Subjects (Comma-separated)');
    cy.contains('label', 'Maximum Users');
    cy.contains('label', 'Public Course');
    cy.contains('Submit');
  });


  it('should become dark mode after clicking on darkMode then lightmode', () => {
    //click on dark
    cy.contains('span', 'Dark Mode').click();
    
    //should be on page
    cy.url().should('include', '/newcourse');
    cy.contains('span', 'Light Mode');

    //click on dark
    cy.contains('span', 'Light Mode').click();
    
    //should be on page
    cy.url().should('include', '/newcourse');
    cy.contains('span', 'Dark Mode');
  });

});

describe('create lesson page', () => {
  beforeEach(() => {
    cy.visit('/newlesson');
    
  });

  it('should render the create new lesson page normal', () => {

    //check words
    cy.contains('h2', 'New Lesson:');
    cy.contains('label', 'Lesson Title');
    cy.contains('label', 'Topic 1');
    cy.contains('label', 'Context Citation');
    cy.contains('Public');
    cy.contains('Private');
    cy.contains('Browse');
    cy.get('[data-testid="AddIcon"]').should('exist');

    cy.contains('Generate Lesson');
  });

  it('should render the new topic textfield when new lesson page normal', () => {

    //check wordsRemoveIcon
    cy.get('[data-testid="AddIcon"]').click();
    cy.contains('label', 'Topic 2');
    cy.get('[data-testid="RemoveIcon"]').should('exist');
  });


  it('should become dark mode after clicking on darkMode then lightmode', () => {
    //click on dark
    cy.contains('span', 'Dark Mode').click();
    
    //should be on page
    cy.url().should('include', '/newlesson');
    cy.contains('span', 'Light Mode');

    //click on dark
    cy.contains('span', 'Light Mode').click();
    
    //should be on page
    cy.url().should('include', '/newlesson');
    cy.contains('span', 'Dark Mode');
  });

});