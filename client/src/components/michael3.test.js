import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom'; // Import Link
import EditLessonModal from './LessonPage/editLessonModal';
import SharingModal from './LessonPage/shareLessonModal';
import ExplorePage from './Explore';

// LESSON EDITING MODAL TESTS
describe('EditLessonModal Component', () => {
    it('renders modal with lesson details', () => {
        const lesson = {
            lesson_id: 1,
            title: 'Test Lesson',
            description: 'This is a test lesson',
            isPublic: true,
            lessonSections: [{ title: 'Section 1', body: 'Section body' }],
            lessonPracticeQuestions: [{ question: 'Question 1', option_a: 'Option A', option_b: 'Option B', option_c: 'Option C', option_d: 'Option D', answer: 'a' }]
        };

        render(
            <Router>
                <EditLessonModal open={true} onClose={() => {}} lesson={lesson} isLessonLoaded={true} onLessonSubmit={() => {}} />
            </Router>
        );

        expect(screen.getByText(/Edit Lesson/i)).toBeInTheDocument();

        expect(screen.getByText(/Lesson Details/i)).toBeInTheDocument();
        expect(screen.getByDisplayValue(lesson.title)).toBeInTheDocument();
        expect(screen.getByDisplayValue(lesson.description)).toBeInTheDocument();

        expect(screen.getByText(/Lesson Sections/i)).toBeInTheDocument();
        expect(screen.getByDisplayValue(lesson.lessonSections[0].title)).toBeInTheDocument();
        expect(screen.getByDisplayValue(lesson.lessonSections[0].body)).toBeInTheDocument();

        expect(screen.getByText(/Practice Questions/i)).toBeInTheDocument();
        expect(screen.getByDisplayValue(lesson.lessonPracticeQuestions[0].question)).toBeInTheDocument();
        expect(screen.getByDisplayValue(lesson.lessonPracticeQuestions[0].option_a)).toBeInTheDocument();
        expect(screen.getByDisplayValue(lesson.lessonPracticeQuestions[0].option_b)).toBeInTheDocument();
        expect(screen.getByDisplayValue(lesson.lessonPracticeQuestions[0].option_c)).toBeInTheDocument();
        expect(screen.getByDisplayValue(lesson.lessonPracticeQuestions[0].option_d)).toBeInTheDocument();
        expect(screen.getByDisplayValue(lesson.lessonPracticeQuestions[0].answer)).toBeInTheDocument();
    });

    it('updates lesson title when changed', async () => {
        const lesson = {
            lesson_id: 1,
            title: 'Test Lesson',
            description: 'This is a test lesson',
            isPublic: true,
            lessonSections: [{ title: 'Section 1', body: 'Section body' }],
            lessonPracticeQuestions: [{ question: 'Question 1', option_a: 'Option A', option_b: 'Option B', option_c: 'Option C', option_d: 'Option D', answer: 'a' }]
        };

        render(
            <Router>
                <EditLessonModal open={true} onClose={() => {}} lesson={lesson} isLessonLoaded={true} onLessonSubmit={() => {}} />
            </Router>
        );

        const newTitle = 'Updated Title';
        const titleInput = screen.getByLabelText('Title');
        fireEvent.change(titleInput, { target: { value: newTitle } });

        expect(titleInput.value).toBe(newTitle);
    });

    it('updates lesson description when changed', async () => {
        const lesson = {
            lesson_id: 1,
            title: 'Test Lesson',
            description: 'This is a test lesson',
            isPublic: true,
            lessonSections: [{ title: 'Section 1', body: 'Section body' }],
            lessonPracticeQuestions: [{ question: 'Question 1', option_a: 'Option A', option_b: 'Option B', option_c: 'Option C', option_d: 'Option D', answer: 'a' }]
        };

        render(
            <Router>
                <EditLessonModal open={true} onClose={() => {}} lesson={lesson} isLessonLoaded={true} onLessonSubmit={() => {}} />
            </Router>
        );

        const newDescription = 'Updated Description';
        const descriptionInput = screen.getByLabelText('Description');
        fireEvent.change(descriptionInput, { target: { value: newDescription } });

        expect(descriptionInput.value).toBe(newDescription);
    });
});

// LESSON SHARING MODAL TESTS
describe('SharingModal Component', () => {
    it('renders modal with input field and button', () => {
        const onClose = jest.fn();
        const lessonId = 1;
        const user = { id: 1 };

        render(
            <Router>
                <SharingModal open={true} onClose={onClose} lessonId={lessonId} user={user} />
            </Router>
        );

        expect(screen.getByText(/Share Lesson/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Recipient's Email/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Share/i })).toBeInTheDocument();
    });

    it('allows the user to enter an email address to share to', () => {
        const onClose = jest.fn();
        const lessonId = 1;
        const user = { id: 1 };

        render(
            <Router>
                <SharingModal open={true} onClose={onClose} lessonId={lessonId} user={user} />
            </Router>
        );

        const recipientEmail = 'test@test.test';
        const emailInput = screen.getByLabelText(/Recipient's Email/i);
        fireEvent.change(emailInput, { target: { value: recipientEmail } });

        expect(screen.getByDisplayValue(recipientEmail)).toBeInTheDocument();
    });
});

describe('ExplorePage Component', () => {
    it('renders "most loved" and "trending" sections', async () => {
        render(<ExplorePage />);
        expect(screen.getByText(/M O S T L O V E D/i)).toBeInTheDocument();
        expect(screen.getByText(/T R E N D I N G/i)).toBeInTheDocument();
    });
});