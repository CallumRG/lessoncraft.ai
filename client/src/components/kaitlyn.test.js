import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom'; // Import Link
import Topbar from './Topbar';
import { EXPLORE, LANDING } from '../constants/routes';
import ExplorePage from './Explore';

// Mocking Firebase
jest.mock("./Firebase/firebase", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    doPasswordUpdate: jest.fn().mockResolvedValue('Password updated successfully'),
  })),
}));


describe('Explore Page', () => {
  it('renders website and checks for Explore text', () => {
    render(
      <Router>
        <ExplorePage />
      </Router>
    );

    expect(screen.getByText('Explore')).toBeInTheDocument();
  });
});

