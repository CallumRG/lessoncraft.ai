import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchPage from './SearchPage';
import CourseSearch from './CourseSearch';
import ModuleSearch from './ModuleSearch';
import LessonSearch from './LessonSearch'; 
import { useParams } from 'react-router-dom';

// Mocking react-router-dom's useNavigate
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
  useNavigate: jest.fn(),
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

// Mocking Firebase class and its methods
jest.mock('./Firebase/firebase', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    auth: {
      currentUser: {
        uid: 'mocked-current-user-uid',
      },
    },
  })),
}));

// Mocking fetch for API calls
global.fetch = jest.fn();


describe('LessonSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders proper text, textfields and buttons in LessonSearch component', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        lessons: [
          {
            id: 1,
            title: 'Test Lesson',
            name: 'Test Creator',
            citation: 'Test Citation',
            description: 'Test Description',
          },
        ],
      }),
    });

    render(<LessonSearch />);

    //text
    expect(screen.getByText('Go To Lesson (Lesson ID)')).toBeInTheDocument();
    expect(screen.getByText('Lesson Search')).toBeInTheDocument();
    
    //textfields
    expect(screen.getByLabelText('Lesson ID')).toBeInTheDocument();
    expect(screen.getByLabelText('Lesson Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Citation')).toBeInTheDocument();
    expect(screen.getByLabelText('Creator')).toBeInTheDocument();
    
    //go button
    expect(screen.getByText('Go')).toBeInTheDocument();
    

  });

  it('renders statement if no lessons or fetched', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        lessons: [],
      }),
    });

    render(<LessonSearch />);

    //should give message
    await expect(screen.getByText('No lessons found with given criteria.')).toBeInTheDocument();

  });

  it('renders lesson pulled from fetched', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        lessons: [
          {
            id: 1,
            title: 'Test Lesson',
            name: 'Test Creator',
            citation: 'Test Citation',
            description: 'Test Description',
          },
        ],
      }),
    });

    render(<LessonSearch />);

    //lesson text on screen
    await screen.findByText('Test Lesson');
    await screen.findByText('Test Creator');
    await screen.findByText('Test Citation');
    await screen.findByText('Test Description');
    

  })

  it('link should exist redirects user if clicking on lesson pulled from fetched', async () => {

    //mock returned lesson
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        lessons: [
          {
            id: 1,
            title: 'Test Lesson',
            name: 'Test Creator',
            citation: 'Test Citation',
            description: 'Test Description',
          },
        ],
      }),
    });

    render(<LessonSearch />);

    //wait for something from lesson to load
    const lessonText = await screen.findByText('Test Lesson');

    //link to lesson should exist 
    expect(lessonText.closest('a')).toHaveAttribute('href', '/lesson/1');
    

  })



  
});

describe('CourseSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders proper text, textfields and buttons in CourseSearch component', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        courses: [
          {
            id: 1,
            course_name: 'Test Course',
            instructor: 'Test Instructor',
            subjects: 'Test Subjects',
            description: 'Test Description',
          },
        ],
      }),
    });

    render(<CourseSearch />);

    //text
    expect(screen.getByText('Go To Course (Course ID)')).toBeInTheDocument();
    expect(screen.getByText('Course Search')).toBeInTheDocument();
    
    //textfields
    expect(screen.getByLabelText('Course ID')).toBeInTheDocument();
    expect(screen.getByLabelText('Course Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Subject')).toBeInTheDocument();
    expect(screen.getByLabelText('Instructor')).toBeInTheDocument();
    
    //go button
    expect(screen.getByText('Go')).toBeInTheDocument();
    

  });

  it('renders statement if no courses are fetched', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        courses: [],
      }),
    });

    render(<CourseSearch />);

    //should give message
    await expect(screen.getByText('No courses found with given criteria.')).toBeInTheDocument();

  });

  it('renders course pulled from fetched', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        courses: [
          {
            id: 1,
            course_name: 'Test Course',
            instructor: 'Test Instructor',
            subjects: 'Test Subjects',
            description: 'Test Description',
          },
        ],
      }),
    });

    render(<CourseSearch />);

    //lesson text on screen
    await screen.findByText('Test Course');
    await screen.findByText('Test Instructor');
    await screen.findByText('Test Subjects');
    await screen.findByText('Test Description');
    

  })

  it('link should exist redirects user if clicking on course pulled from fetched', async () => {

    //mock returned lesson
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        courses: [
          {
            id: 1,
            course_name: 'Test Course',
            instructor: 'Test Instructor',
            subjects: 'Test Subjects',
            description: 'Test Description',
          },
        ],
      }),
    });

    render(<CourseSearch />);

    //wait for something from lesson to load
    const courseText = await screen.findByText('Test Course');

    //link to lesson should exist 
    expect(courseText.closest('a')).toHaveAttribute('href', '/course/1');
    

  })



  
});