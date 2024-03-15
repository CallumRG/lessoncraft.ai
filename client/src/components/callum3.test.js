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

//mock the components rendered within search component

describe('LessonSearch', () => {

  it('renders proper text, textfields and buttons in SearchPage component', () => {
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

  })
});