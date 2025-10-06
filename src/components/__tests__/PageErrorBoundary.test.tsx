import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PageErrorBoundary from '../PageErrorBoundary';

// Mock console methods
const mockConsole = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};

const originalConsole = { ...console };
beforeAll(() => {
  Object.assign(console, mockConsole);
});

afterAll(() => {
  Object.assign(console, originalConsole);
});

describe('PageErrorBoundary', () => {
  const TestChild = () => <div>Test Content</div>;

  const ErrorChild = () => {
    throw new Error('Test error');
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children when no error occurs', () => {
    render(
      <PageErrorBoundary pageName="Test Page">
        <TestChild />
      </PageErrorBoundary>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders error UI when an error occurs', () => {
    render(
      <PageErrorBoundary pageName="Test Page">
        <ErrorChild />
      </PageErrorBoundary>
    );

    expect(screen.getByText('Page Error')).toBeInTheDocument();
    expect(screen.getByText(/Something went wrong while loading Test Page/)).toBeInTheDocument();
  });

  it('displays default page name when not provided', () => {
    render(
      <PageErrorBoundary>
        <ErrorChild />
      </PageErrorBoundary>
    );

    expect(screen.getByText(/Something went wrong while loading this page/)).toBeInTheDocument();
  });

  it('logs error to console when error occurs', () => {
    render(
      <PageErrorBoundary pageName="Test Page">
        <ErrorChild />
      </PageErrorBoundary>
    );

    expect(mockConsole.error).toHaveBeenCalledWith(
      'Page Error Boundary (Test Page):',
      expect.any(Error),
      expect.any(Object)
    );
  });

  it('shows retry button', () => {
    render(
      <PageErrorBoundary pageName="Test Page">
        <ErrorChild />
      </PageErrorBoundary>
    );

    const retryButton = screen.getByText('Try Again');
    expect(retryButton).toBeInTheDocument();
  });

  it('shows go back button', () => {
    render(
      <PageErrorBoundary pageName="Test Page">
        <ErrorChild />
      </PageErrorBoundary>
    );

    const backButton = screen.getByText('Go Back');
    expect(backButton).toBeInTheDocument();
  });

  it('shows go home button', () => {
    render(
      <PageErrorBoundary pageName="Test Page">
        <ErrorChild />
      </PageErrorBoundary>
    );

    const homeButton = screen.getByText('Home');
    expect(homeButton).toBeInTheDocument();
  });



  it('does not show error details in production mode', () => {
    const originalEnv = process.env.NODE_ENV;
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'production',
      writable: true,
    });

    render(
      <PageErrorBoundary pageName="Test Page">
        <ErrorChild />
      </PageErrorBoundary>
    );

    expect(screen.queryByText('Error Details (Development)')).not.toBeInTheDocument();

    Object.defineProperty(process.env, 'NODE_ENV', {
      value: originalEnv,
      writable: true,
    });
  });

  it('renders custom fallback when provided', () => {
    const customFallback = <div>Custom Error Fallback</div>;

    render(
      <PageErrorBoundary pageName="Test Page" fallback={customFallback}>
        <ErrorChild />
      </PageErrorBoundary>
    );

    expect(screen.getByText('Custom Error Fallback')).toBeInTheDocument();
    expect(screen.queryByText('Page Error')).not.toBeInTheDocument();
  });
});
