import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorBoundary from '../ErrorBoundary';

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

describe('ErrorBoundary', () => {
  const TestChild = () => <div>Test Content</div>;

  const ErrorChild = () => {
    throw new Error('Test error');
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <TestChild />
      </ErrorBoundary>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders error UI when an error occurs', () => {
    render(
      <ErrorBoundary>
        <ErrorChild />
      </ErrorBoundary>
    );

    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/We encountered an unexpected error/)).toBeInTheDocument();
  });

  it('logs error to console when error occurs', () => {
    render(
      <ErrorBoundary>
        <ErrorChild />
      </ErrorBoundary>
    );

    expect(mockConsole.error).toHaveBeenCalledWith(
      'ErrorBoundary caught an error:',
      expect.any(Error),
      expect.any(Object)
    );
  });

  it('calls custom error handler when provided', () => {
    const mockOnError = jest.fn();

    render(
      <ErrorBoundary onError={mockOnError}>
        <ErrorChild />
      </ErrorBoundary>
    );

    expect(mockOnError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.any(Object)
    );
  });

  it('renders custom fallback when provided', () => {
    const customFallback = <div>Custom Error Fallback</div>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <ErrorChild />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom Error Fallback')).toBeInTheDocument();
    expect(screen.queryByText('Oops! Something went wrong')).not.toBeInTheDocument();
  });

  it('shows retry button', () => {
    render(
      <ErrorBoundary>
        <ErrorChild />
      </ErrorBoundary>
    );

    const retryButton = screen.getByText('Try Again');
    expect(retryButton).toBeInTheDocument();
  });

  it('shows go home button', () => {
    render(
      <ErrorBoundary>
        <ErrorChild />
      </ErrorBoundary>
    );

    const homeButton = screen.getByText('Go Home');
    expect(homeButton).toBeInTheDocument();
  });

  it('does not show error details in production mode', () => {
    // Mock process.env.NODE_ENV for this test
    const originalEnv = process.env.NODE_ENV;
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'production',
      writable: true,
    });

    render(
      <ErrorBoundary>
        <ErrorChild />
      </ErrorBoundary>
    );

    expect(screen.queryByText('Error Details (Development Only)')).not.toBeInTheDocument();

    // Restore original value
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: originalEnv,
      writable: true,
    });
  });

  it('categorizes network errors correctly', () => {
    const NetworkErrorChild = () => {
      throw new Error('Network request failed');
    };

    render(
      <ErrorBoundary>
        <NetworkErrorChild />
      </ErrorBoundary>
    );

    expect(screen.getByText('Check your internet connection')).toBeInTheDocument();
  });

  it('categorizes auth errors correctly', () => {
    const AuthErrorChild = () => {
      throw new Error('Unauthorized access');
    };

    render(
      <ErrorBoundary>
        <AuthErrorChild />
      </ErrorBoundary>
    );

    expect(screen.getByText('Try logging in again')).toBeInTheDocument();
  });
});
