import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import ProfilePage from './ProfilePage';
import { BrowserRouter as Router } from 'react-router-dom';
import Firebase from "./Firebase/firebase";
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import axios from 'axios';


global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;


jest.mock('./Firebase/firebase');

// Mock Firebase class
const mockUpdatePassword = jest.fn();
Firebase.mockImplementation(() => {
  return {
    auth: {
      currentUser: {
        updatePassword: mockUpdatePassword,
      },
    },
  };
});

describe('ProfilePage Component', () => {
  it('updates the password successfully when new passwords match', async () => {
    render(
      <Router>
        <ProfilePage />
      </Router>
    );
    
    // Simulate user typing into the new password and confirm password fields
    userEvent.type(screen.getByLabelText(/New Password/i), 'newPassword123');
    userEvent.type(screen.getByLabelText(/Confirm New Password/i), 'newPassword123');
    userEvent.click(screen.getByRole('button', { name: /Update Password/i }));
    
    // Wait for the mock function to be called
    await waitFor(() => {
      expect(mockUpdatePassword).toHaveBeenCalledWith('newPassword123');
    });
  });
});

// __tests__/PasswordForget.test.js
describe('PasswordForget Component', () => {
  it('sends a password reset email when the form is submitted', async () => {
    const mockSendPasswordResetEmail = jest.fn();
    Firebase.mockImplementation(() => {
      return {
        auth: {
          sendPasswordResetEmail: mockSendPasswordResetEmail,
        },
      };
    });

    render(
      <Router>
        <PasswordForget />
      </Router>
    );
    
    userEvent.type(screen.getByLabelText(/Email/i), 'test@example.com');
    userEvent.click(screen.getByRole('button', { name: /Reset Password/i }));
    
    await waitFor(() => {
      expect(mockSendPasswordResetEmail).toHaveBeenCalledWith('test@example.com');
    });
  });
});

// __tests__/LandingPage.test.js
describe('LandingPage Component', () => {
  it('navigates to the explore page when the explore button is clicked', async () => {
    const mockNavigate = jest.fn();
    render(
      <Router>
        <LandingPage />
      </Router>
    );
    
    userEvent.click(screen.getByRole('button', { name: /Explore/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/explore');
  });
});

//two extra
describe('ProfilePage Component', () => {
  it('shows an error message when the new passwords do not match', async () => {
    render(
      <Router>
        <ProfilePage />
      </Router>
    );

    userEvent.type(screen.getByLabelText(/New Password/i), 'newPassword123');
    userEvent.type(screen.getByLabelText(/Confirm New Password/i), 'differentPassword123');
    userEvent.click(screen.getByRole('button', { name: /Update Password/i }));

    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    });
  });

  it('shows a loading indicator while the password update is in progress', async () => {
    // Mock the loading state to be true
    render(
      <Router>
        <ProfilePage />
      </Router>
    );

    fireEvent.click(screen.getByRole('button', { name: /Update Password/i }));
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });
});

