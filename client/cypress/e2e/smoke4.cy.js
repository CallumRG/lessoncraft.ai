describe('Search page', () => {
  beforeEach(() => {
    cy.visit('/search');
    
  });

  it('should render the search page normal', () => {

    //check words
    cy.contains('h2', 'L E S S O N C R A F T');
    cy.contains('h3', 'Search');
    cy.contains('Lesson Search');
    cy.contains('Course Search');

    //should be lesson search
    cy.contains('Go To Lesson (Lesson ID)')

  });

  it('should render the course search page normally', () => {

    //check words
    cy.contains('Go To Lesson (Lesson ID)');
    cy.contains('label', 'Lesson ID');
    cy.contains('Go');

    cy.contains('Lesson Search');

    cy.contains('label', 'Lesson Name');
    cy.contains('label', 'Description');
    cy.contains('label', 'Citation');
    cy.contains('label', 'Creator');

  });

  it('should switch to the course search page when clicked', () => {

    //check words
    cy.contains('h2', 'L E S S O N C R A F T');
    cy.contains('h3', 'Search');
    cy.contains('Lesson Search');
    cy.contains('Course Search');

    cy.contains('Course Search').click()

    cy.contains('Go To Course (Course ID)')

  });

  it('should switch to the lesson search page when clicked', () => {

    //check words
    cy.contains('h2', 'L E S S O N C R A F T');
    cy.contains('h3', 'Search');
    cy.contains('Lesson Search');
    cy.contains('Course Search');

    cy.contains('Course Search').click()
    cy.contains('Go To Course (Course ID)')

    cy.contains('Lesson Search').click()
    cy.contains('Go To Lesson (Lesson ID)')

  });

  it('should redirect to the lesson id when inputted and submitted with proper id', () => {
    cy.get('input[name="lessonid"]').type('1');
    cy.get('button').contains('Go').click()
    cy.url().should('include', '/lesson/1');
  });

  it('should redirect to the course id when inputted and submitted with proper id', () => {
    cy.contains('Course Search').click()
    cy.contains('Go To Course (Course ID)')

    cy.get('input[name="courseID"]').type('1');
    cy.get('button').contains('Go').click()
    cy.url().should('include', '/course/1');
  });

  it('should throw error message when inputted and submitted with improper lesson id', () => {
    cy.get('input[name="lessonid"]').type('0');
    cy.get('button').contains('Go').click()
    cy.contains('Lesson ID must be positive integer.')
    cy.url().should('include', '/search');
  });

  it('should throw error message when inputted and submitted with improper course id', () => {
    cy.contains('Course Search').click()
    cy.contains('Go To Course (Course ID)')

    cy.get('input[name="courseID"]').type('0');
    cy.get('button').contains('Go').click()
    cy.contains('Course ID must be positive integer.')
    cy.url().should('include', '/search');

  });

  it('should throw error message when inputted and submitted with empty lesson id', () => {
    cy.get('input[name="lessonid"]')
    cy.get('button').contains('Go').click()
    cy.contains('Lesson ID must be positive integer.')
    cy.url().should('include', '/search');
  });

  it('should throw error message when inputted and submitted with empty course id', () => {
    cy.contains('Course Search').click()
    cy.contains('Go To Course (Course ID)')

    cy.get('input[name="courseID"]')
    cy.get('button').contains('Go').click()
    cy.contains('Course ID must be positive integer.')
    cy.url().should('include', '/search');

  });







});