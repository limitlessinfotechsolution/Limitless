import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HeroContent from '../HeroContent';

describe('HeroContent', () => {
  it('should render all main elements', () => {
    render(<HeroContent />);

    // Check for main heading
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();

    // Check for subheading
    expect(screen.getByText(/Where Innovation Meets Execution/i)).toBeInTheDocument();

    // Check for tagline
    expect(screen.getByText(/Professional\. Scalable\. Data-driven\./i)).toBeInTheDocument();

    // Check for highlights
    expect(screen.getByText(/Enterprise-grade security & compliance/i)).toBeInTheDocument();
    expect(screen.getByText(/Scalable solutions that grow with you/i)).toBeInTheDocument();

    // Check for CTA buttons
    expect(screen.getByRole('link', { name: /Start Your Project/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /View Our Work/i })).toBeInTheDocument();

    // Check for trust indicators
    expect(screen.getByText(/ISO 27001 Certified/i)).toBeInTheDocument();
    expect(screen.getByText(/98% Client Retention/i)).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    render(<HeroContent />);

    // Check for ARIA labels on CTA buttons
    const startProjectButton = screen.getByRole('link', { name: /Start Your Project/i });
    expect(startProjectButton).toHaveAttribute('aria-label', 'Start your project - navigate to contact page');

    // Check for screen reader hidden elements
    const arrowIcon = screen.getByText('→');
    expect(arrowIcon).toHaveAttribute('aria-hidden', 'true');
  });

  it('should have semantic HTML structure', () => {
    render(<HeroContent />);

    // Check for proper heading hierarchy
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toHaveTextContent(/Limitless/i);

    // Check for list structure in highlights (if implemented as list)
    const highlights = screen.getAllByText(/Enterprise-grade|Scalable solutions|Expert team|Royal client/i);
    expect(highlights).toHaveLength(4);
  });

  it('should render trust indicators with proper structure', () => {
    render(<HeroContent />);

    // Check that trust indicators have checkmarks
    const checkmarks = screen.getAllByTestId('checkmark-icon');
    expect(checkmarks).toHaveLength(3); // Assuming 3 trust indicators

    // Check specific trust indicators
    expect(screen.getByText('ISO 27001 Certified')).toBeInTheDocument();
    expect(screen.getByText('98% Client Retention')).toBeInTheDocument();
    expect(screen.getByText('24/7 Support')).toBeInTheDocument();
  });
});
