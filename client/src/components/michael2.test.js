import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom'; // Import Link
import NewLesson from './NewLesson';
import LessonPage from './LessonPage';
import MiddleBar from './LessonPage/middleBar';
import ThirdBar from './LessonPage/thirdBar';
import axios from 'axios';

// Mock axios
jest.mock('axios');

// Mock openai
jest.mock('openai', () => ({
    __esModule: true,
    default: jest.fn(() => ({
      complete: jest.fn().mockResolvedValue({ data: 'Mocked response' }),
    })),
  }));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

// Mock toast module
jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
    },
}));


// NEW LESSON FORM TESTS
describe('NewLesson Component', () => {
    it('renders field labels', () => {
        render(
            <Router>
                <NewLesson />
            </Router>
        );

        expect(screen.getByLabelText(/Lesson Title/i)).toBeInTheDocument();
        expect(screen.getAllByLabelText(/^Topic/i)).toHaveLength(1);
        expect(screen.getByLabelText(/Context Citation/i)).toBeInTheDocument();
    });

    it('renders the generate lesson button', async () => {
        render(
            <Router>
                <NewLesson />
            </Router>
        );

        expect(screen.getByText(/Generate Lesson/i)).toBeInTheDocument();
    });

    it('displays an error message if the lesson title is empty', async () => {
        render(
            <Router>
                <NewLesson />
            </Router>
        );

        fireEvent.click(screen.getByRole('button', { name: /Generate Lesson/i }));

        // Wait for error message to appear
        await waitFor(() => {
            expect(screen.getByText(/Please include a lesson title/i)).toBeInTheDocument();
        });
    });
});

// LESSON PAGE TESTS
describe('LessonPage Component', () => {
    it('renders LessonPage component', async () => {
        // Mock data for the lesson
        const mockLessonData = {
            id: 1,
            title: 'Test Lesson',
            created_at: '2024-03-06 19:45:46',
            description: 'This is a test',
            is_public: true,
            citation: 'Test Citation',
            view_count: 1
        };
    
        // Mock Axios response
        axios.request.mockResolvedValue({ data: { lesson: [mockLessonData] } });
    
        // Render the component
        render(<LessonPage user={{id: 1}} />);
    
        // Wait for the component to fetch and display data
        await waitFor(() => {
            expect(screen.getAllByText(mockLessonData.title)[0]).toBeInTheDocument();
            expect(screen.getByText(mockLessonData.description)).toBeInTheDocument();
            expect(screen.getByText(/Key Concepts:/i)).toBeInTheDocument();
            expect(screen.getByText(/Practice Questions/i)).toBeInTheDocument();
        });
    });

    it('renders MiddleBar component on a lesson', () => {
        // Mock props
        const mockProps = {
            author: {
                first_name: 'John',
                last_name: 'Doe'
            },
            date: '2024-03-13',
            citation: 'Test Citation'
        };

        // Render the component with mock props
        render(<MiddleBar {...mockProps} />);

        // Assertions for rendered data
        expect(screen.getByText(`Author: ${mockProps.author.first_name} ${mockProps.author.last_name}`)).toBeInTheDocument();
        expect(screen.getByText(`Published March 12, 2024`)).toBeInTheDocument();
        expect(screen.getByText(`Reference: ${mockProps.citation}`)).toBeInTheDocument();
    });

    it('renders ThirdBar component with props', async () => {
        // Mock props
        const mockProps = {
            user: { id: 1 },
            lessonId: 123,
            isPublic: true,
            views: 10
        };

        axios.post.mockResolvedValue({ data: { like_count: 5 } });
        
        // Render the component with mock props
        render(<ThirdBar {...mockProps} />);

        // Assertions for rendered data
        expect(screen.getByText('Public')).toBeInTheDocument();
        expect(screen.getByText(mockProps.views.toString())).toBeInTheDocument();
        expect(screen.getByText(`Lesson Code: ${mockProps.lessonId}`)).toBeInTheDocument();
    });
});