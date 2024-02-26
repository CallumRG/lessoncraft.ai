import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CourseAdmin from './CourseAdmin';
import { useParams } from 'react-router-dom';

// Mocking react-router-dom's useNavigate
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
  useNavigate: jest.fn(),
  Link: ({ children }) => children, // Mocking Link component
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

describe('CourseAdmin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('component render no admins for course', async () => {
    // Mocking the return value of useParams
    useParams.mockReturnValue({ course_id: 'mocked-course-id' });

    // Mocking the fetch call for fetching administrators
    fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'No admins' }),
    });

    render(<CourseAdmin />);

    expect(screen.getByText('Return to Course')).toBeInTheDocument();
    expect(screen.getByText('Edit Administrators - Course ID: mocked-course-id')).toBeInTheDocument();
    expect(screen.getByText('Add Administrator')).toBeInTheDocument();
    await screen.findByText('No admins in course (mocked-course-id).');
  });

  it('component renders with admins in the course', async () => {
    
    useParams.mockReturnValue({ course_id: 'mocked-course-id' });
  
    //mock fetch call for admins
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        courseAdmins: [
          {
            admin_id: 'admin-id',
            first_name: 'admin',
            last_name: 'example',
            email: 'admin@example.com',
          },

        ],
      }),
    });
  
    render(<CourseAdmin />);
  
    // check for admin rendered and delete button
    expect(screen.getByText('Return to Course')).toBeInTheDocument();
    expect(screen.getByText('Edit Administrators - Course ID: mocked-course-id')).toBeInTheDocument();
    expect(screen.getByText('Add Administrator')).toBeInTheDocument();
    await screen.findByText('admin@example.com'); 
    await screen.findByText('Delete'); 
  });

/*   it('handle deleting existant admin', async () => {
    
    useParams.mockReturnValue({ course_id: 'mocked-course-id' });
    
    //mock fetch call for admins
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        courseAdmins: [
          {
            admin_id: 'admin-id',
            first_name: 'admin',
            last_name: 'example',
            email: 'admin@example.com',
          },

        ],
      }),
    });
  
    render(<CourseAdmin />);
  
    // check for admin rendered and delete button
    expect(screen.getByText('Return to Course')).toBeInTheDocument();
    expect(screen.getByText('Edit Administrators - Course ID: mocked-course-id')).toBeInTheDocument();
    expect(screen.getByText('Add Administrator')).toBeInTheDocument();
    await screen.findByText('admin@example.com'); 
    await screen.findByText('Delete'); 

    fireEvent.click(screen.getByText('Delete'));

    await screen.findByText('No admins in course (mocked-course-id).');




    

  }); */

  it('handles adding non existant administrator', async () => {
    // Mocking the return value of useParams
    useParams.mockReturnValue({ course_id: 'mocked-course-id' });

    // Mocking the fetch call for fetching administrators
    fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

    render(<CourseAdmin />);

    // Mock the fetch call for adding an administrator
    fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'User not found' }),
      });

    // ui add admin
    fireEvent.change(screen.getByPlaceholderText('Enter User Email'), {
      target: { value: 'new-admin@example.com' },
    });
    fireEvent.click(screen.getByText('Add Administrator'));
    
    //should be still no admins
    await screen.findByText('No admins in course (mocked-course-id).');
  });

  
});
