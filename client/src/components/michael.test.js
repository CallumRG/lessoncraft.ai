import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom'; // Import Link
import Topbar from './Topbar';
import SignInPage from './SignIn';
import SignupPage from './SignUp';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';
import axios from 'axios';

// Mock axios
jest.mock('axios');
axios.request.mockResolvedValue({
    data: 'mockResponseData',
});

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

// Mock firebase methods
jest.mock('./Firebase/firebase', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
        doSignInWithEmailAndPassword: jest.fn().mockResolvedValue('mockSignInResult'),
        doCreateUserWithEmailAndPassword: jest.fn().mockResolvedValue({
            user: {
                uid: 'mockUserId',
                email: 'test@test.com'
            },
        }),
    })),
}));

// Mock toast module
jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
    },
}));


// TOPBAR TESTS
describe('Topbar component', () => {
    it('renders website name', () => {
        render(
            <Router>
                <Topbar />
            </Router>
        );
        const websiteName = screen.getByText(/Lessoncraft/i);
        expect(websiteName).toBeInTheDocument();
    });

    it('renders "Create" button when user is logged in', () => {
        const user = { first_name: 'test', last_name: 'mctest', email: 'test@test.test', firebase_uid: '123'};
        render(
            <Router>
                <Topbar user={user} />
            </Router>
        );
        const createButton = screen.getByText(/Create/i);
        expect(createButton).toBeInTheDocument();
    });

    it('renders "Sign in" and "Register" buttons when user is not logged in', () => {
        render(
            <Router>
                <Topbar />
            </Router>
        );
        const signInButton = screen.getByText(/Sign in/i);
        const registerButton = screen.getByText(/Register/i);
        expect(signInButton).toBeInTheDocument();
        expect(registerButton).toBeInTheDocument();
    });
});

// SIGNIN TESTS
describe('SignInPage Component', () => {
    it('renders sign-in form', () => {
        render(
            <Router>
                <SignInPage />
            </Router>
        );
    
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
        expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
    });

    it('correctly submits the signin form', async () => {
        render(
            <Router>
                <SignInPage />
            </Router>
        );
    
        // Fill in the form
        userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
        userEvent.type(screen.getByLabelText(/password/i), 'password');
    
        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

        // Wait for the sign-in process to complete
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/explore');
            expect(toast.success).toHaveBeenCalledWith('Sign in successful!');
        });
    });
});

// SIGNUP TESTS
describe('SignupPage Component', () => {
    it('renders sign-up form', () => {
        render(
            <Router>
                <SignupPage />
            </Router>
        );
    
        expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    });
  
    it('correctly submits the signup form', async () => {
        render(
            <Router>
                <SignupPage />
            </Router>
        );
    
        // Fill in the form
        fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
        fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'johndoe@test.com' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } });
    
        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));
    
        // Wait for the sign-up process to complete
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/explore');
            expect(toast.success).toHaveBeenCalledWith('Registration successful!');
        });
    });
});
