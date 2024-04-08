import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchPage from './SearchPage';
import CourseSearch from './CourseSearch';
import LessonSearch from './LessonSearch'; 
import { useParams } from 'react-router-dom';

// Mocking react-router-dom's useNavigate
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
  useNavigate: jest.fn(),
  Link: ({ children }) => children, // Mocking Link component
}));


// Mocking fetch for API calls
global.fetch = jest.fn();

//mock the components rendered within search component
jest.mock('./CourseSearch');
jest.mock('./LessonSearch');



describe('SearchPage', () => {

  it('renders proper text and buttons in SearchPage component', () => {
    render(<SearchPage />);
    expect(screen.getByText('Search')).toBeInTheDocument();

    const lessonSearchButton = screen.getByText('Lesson Search');
    expect(lessonSearchButton).toBeInTheDocument();

    const courseSearchButton = screen.getByText('Course Search');
    expect(courseSearchButton).toBeInTheDocument();
  });

  it('it renders  the Lesson Search section by default', () => {
    render(<SearchPage />);
    expect(LessonSearch).toHaveBeenCalled();
  });


  it('switches active selection to be Course Search on button click', () => {
    render(<SearchPage />);
    const courseSearchButton = screen.getByText('Course Search');
    expect(courseSearchButton).toBeInTheDocument();
    act(() => {
      courseSearchButton.click();
    });
    expect(CourseSearch).toHaveBeenCalled();
  });
});
