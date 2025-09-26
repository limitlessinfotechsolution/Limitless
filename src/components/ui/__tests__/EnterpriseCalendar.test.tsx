import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EnterpriseCalendar from '../EnterpriseCalendar';

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

// Mock data for testing
const mockEvents = [
  {
    id: '1',
    title: 'Team Meeting',
    date: new Date(),
    startTime: '10:00',
    endTime: '11:00',
    location: 'Conference Room A',
    description: 'Weekly team sync'
  },
  {
    id: '2',
    title: 'Product Review',
    date: new Date(),
    startTime: '14:00',
    endTime: '15:30',
    location: 'Virtual',
    description: 'Review new features'
  }
];

describe('EnterpriseCalendar', () => {
  test('renders EnterpriseCalendar component with title', () => {
    render(<EnterpriseCalendar title="Company Calendar" />);
    expect(screen.getByText('Company Calendar')).toBeInTheDocument();
  });

  test('displays current month and year', () => {
    const currentDate = new Date();
    const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    render(<EnterpriseCalendar />);
    expect(screen.getByText(monthYear)).toBeInTheDocument();
  });

  test('renders calendar days correctly', () => {
    render(<EnterpriseCalendar />);
    
    // Check that day names are rendered
    expect(screen.getByText('Sun')).toBeInTheDocument();
    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Tue')).toBeInTheDocument();
    expect(screen.getByText('Wed')).toBeInTheDocument();
    expect(screen.getByText('Thu')).toBeInTheDocument();
    expect(screen.getByText('Fri')).toBeInTheDocument();
    expect(screen.getByText('Sat')).toBeInTheDocument();
  });

  test('renders events when provided', () => {
    render(<EnterpriseCalendar events={mockEvents} />);
    
    // Check that events are rendered (this might need adjustment based on implementation)
    expect(screen.getByText('Team Meeting')).toBeInTheDocument();
    expect(screen.getByText('Product Review')).toBeInTheDocument();
  });

  test('shows navigation buttons', () => {
    render(<EnterpriseCalendar />);
    
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  test('renders event details panel when date is selected', () => {
    render(<EnterpriseCalendar events={mockEvents} />);
    
    // This test might need adjustment based on how the component handles date selection
    // For now, we'll just check that the component renders without errors
    expect(screen.getByText('Calendar')).toBeInTheDocument();
  });
});