import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom'; // Needed for <Link> usage
import LandingPage from './Landing'; // Adjust the import path as needed

describe('LandingPage Component', () => {
  it('renders the main headline', () => {
    render(
      <Router>
        <LandingPage />
      </Router>
    );

    // Check if the main headline is rendered
    const headline = screen.getByText('Generate lessons with AI!');
    expect(headline).toBeInTheDocument();
  });

  it('renders the introduction text', () => {
    render(
      <Router>
        <LandingPage />
      </Router>
    );

    // Check if the introduction text is rendered
    const introductionText = screen.getByText(/Introducing Lessoncraft, a cutting-edge platform designed to revolutionize the way you create and distribute learning materials./i);
    expect(introductionText).toBeInTheDocument();
  });

  it('navigates to the explore page when the Explore button is clicked', () => {
    render(
      <Router>
        <LandingPage />
      </Router>
    );

    // Check if the Explore button is rendered
    const exploreButton = screen.getByText('Explore');
    expect(exploreButton).toBeInTheDocument();
    expect(exploreButton.closest('a')).toHaveAttribute('href', '/explore');
  });
});
