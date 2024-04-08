import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CourseLessons from './CourseLessons';
import CourseDiscussion from './CourseDiscussion';
import CourseClasslist from './CourseClasslist'; 
import { useParams } from 'react-router-dom';

// Mocking react-router-dom's useNavigate
jest.mock('react-router-dom', () => ({
  useParams: jest.fn().mockReturnValue({ course_id: '1' }),
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


describe('CourseLessons', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders proper text, textfield and buttons in CourseLessons component', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        courses: [
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
    act( () => {
      render(<CourseLessons />);
    });

    //text
    expect(screen.getByText('Add/Remove Course Lessons (Course Owner/Admins Only)')).toBeInTheDocument();
    
    //textfields
    expect(screen.getByLabelText('Lesson ID')).toBeInTheDocument();

    //buttons
    expect(screen.getByText('Add')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('renders statement if no lessons or fetched', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        courses: [],
      }),
    });
    act( () => {
      render(<CourseLessons />);

      
    });

    //should give message
    await expect(screen.getByText('No lessons found within classroom.')).toBeInTheDocument();

  });

  it('renders lesson pulled from fetched', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        courses: [
          {
            id: 1,
            title: 'Test Lesson',
            name: 'Test Creator',
            citation: 'Test Citation',
            description: 'Test Description',
            date_added: 'Test Timestamp'
          },
        ],
      }),
    });
    act( () => {
      render(<CourseLessons />);
    });
    //lesson text on screen
    await screen.findByText('Test Lesson');
    await screen.findByText('Test Creator');
    await screen.findByText('Test Citation');
    await screen.findByText('Test Description');
    await screen.findByText('Test Timestamp');

  })

  it('link should exist redirects user if clicking on lesson pulled from fetched', async () => {

    //mock returned lesson
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        courses: [
          {
            id: 1,
            title: 'Test Lesson',
            name: 'Test Creator',
            citation: 'Test Citation',
            description: 'Test Description',
            date_added: 'Test Timestamp'
          },
        ],
      }),
    });

    act(() => {
      render(<CourseLessons />);
      
    });

    //wait for something from lesson to load
    const lessonText = await screen.findByText('Test Lesson');

    //link to lesson should exist 
    expect(lessonText.closest('a')).toHaveAttribute('href', '/lesson/1');

  })
});

