import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EnterpriseAnalytics from '../EnterpriseAnalytics';

// Mock child components that use icons
jest.mock('../Card', () => {
  return function MockCard({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={className} data-testid="mock-card">{children}</div>;
  };
});

jest.mock('../Button', () => {
  return function MockButton({ children, className }: { children: React.ReactNode; className?: string }) {
    return <button className={className} data-testid="mock-button">{children}</button>;
  };
});

describe('EnterpriseAnalytics', () => {
  test('renders EnterpriseAnalytics component', () => {
    render(<EnterpriseAnalytics />);
    expect(screen.getByText('Analytics Overview')).toBeInTheDocument();
  });

  test('displays analytics cards', () => {
    render(<EnterpriseAnalytics />);
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('New Customers')).toBeInTheDocument();
    expect(screen.getByText('Conversion Rate')).toBeInTheDocument();
    expect(screen.getByText('Avg. Session')).toBeInTheDocument();
  });

  test('renders performance trends section', () => {
    render(<EnterpriseAnalytics />);
    expect(screen.getByText('Performance Trends')).toBeInTheDocument();
  });

  test('renders traffic sources section', () => {
    render(<EnterpriseAnalytics />);
    expect(screen.getByText('Traffic Sources')).toBeInTheDocument();
  });

  test('renders top performing pages section', () => {
    render(<EnterpriseAnalytics />);
    expect(screen.getByText('Top Performing Pages')).toBeInTheDocument();
  });
});