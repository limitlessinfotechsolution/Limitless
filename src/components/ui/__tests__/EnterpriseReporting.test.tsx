import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EnterpriseReporting from '../EnterpriseReporting';

// Mock ResizeObserver for Recharts
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock data for testing
const mockReports = [
  {
    id: '1',
    title: 'Sales Report',
    description: 'Monthly sales performance',
    type: 'bar' as const,
    data: [
      { month: 'Jan', sales: 4000 },
      { month: 'Feb', sales: 3000 },
      { month: 'Mar', sales: 2000 },
    ],
    xAxisKey: 'month',
    yAxisKey: 'sales',
    color: '#3b82f6',
  },
  {
    id: '2',
    title: 'User Growth',
    description: 'User registration trends',
    type: 'line' as const,
    data: [
      { month: 'Jan', users: 100 },
      { month: 'Feb', users: 200 },
      { month: 'Mar', users: 300 },
    ],
    xAxisKey: 'month',
    yAxisKey: 'users',
    color: '#10b981',
  },
  {
    id: '3',
    title: 'Market Share',
    description: 'Product market distribution',
    type: 'pie' as const,
    data: [
      { product: 'Product A', share: 400 },
      { product: 'Product B', share: 300 },
      { product: 'Product C', share: 300 },
    ],
    xAxisKey: 'product',
    yAxisKey: 'share',
    color: '#f59e0b',
  },
];

describe('EnterpriseReporting', () => {
  test('renders EnterpriseReporting component with title', () => {
    render(
      <EnterpriseReporting
        reports={mockReports}
        title="Business Analytics"
      />
    );
    expect(screen.getByText('Business Analytics')).toBeInTheDocument();
  });

  test('displays report navigation tabs', () => {
    render(
      <EnterpriseReporting
        reports={mockReports}
        title="Business Analytics"
      />
    );
    
    // Use more specific selectors to avoid duplicate elements
    expect(screen.getByText('Sales Report', { selector: 'button' })).toBeInTheDocument();
    expect(screen.getByText('User Growth', { selector: 'button' })).toBeInTheDocument();
    expect(screen.getByText('Market Share', { selector: 'button' })).toBeInTheDocument();
  });

  test('switches between reports when tabs are clicked', () => {
    render(
      <EnterpriseReporting
        reports={mockReports}
        title="Business Analytics"
      />
    );
    
    // Initially shows the first report
    expect(screen.getByText('Monthly sales performance')).toBeInTheDocument();
    
    // Click on the second report tab
    const userGrowthTab = screen.getByText('User Growth', { selector: 'button' });
    fireEvent.click(userGrowthTab);
    
    expect(screen.getByText('User registration trends')).toBeInTheDocument();
  });

  test('shows no reports message when reports array is empty', () => {
    render(
      <EnterpriseReporting
        reports={[]}
        title="Business Analytics"
      />
    );
    
    expect(screen.getByText('No reports')).toBeInTheDocument();
  });

  test('handles date filter changes', () => {
    const mockOnFilterChange = jest.fn();
    render(
      <EnterpriseReporting
        reports={mockReports}
        title="Business Analytics"
        onFilterChange={mockOnFilterChange}
      />
    );
    
    const startDateInput = screen.getByTestId('start-date-input');
    const endDateInput = screen.getByTestId('end-date-input');
    
    fireEvent.change(startDateInput, { target: { value: '2023-01-01' } });
    fireEvent.change(endDateInput, { target: { value: '2023-12-31' } });
    
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      dateRange: {
        start: '2023-01-01',
        end: '2023-12-31',
      },
    });
  });

  test('calls export function when export button is clicked', () => {
    const mockOnExport = jest.fn();
    render(
      <EnterpriseReporting
        reports={mockReports}
        title="Business Analytics"
        onExport={mockOnExport}
      />
    );
    
    const exportButton = screen.getByText('Export');
    fireEvent.click(exportButton);
    
    expect(mockOnExport).toHaveBeenCalled();
  });
});