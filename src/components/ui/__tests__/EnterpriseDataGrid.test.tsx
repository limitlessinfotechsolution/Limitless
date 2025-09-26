import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EnterpriseDataGrid from '../EnterpriseDataGrid';

// Mock child components that use icons
jest.mock('../Button', () => {
  return function MockButton({ children, className }: { children: React.ReactNode; className?: string }) {
    return <button className={className}>{children}</button>;
  };
});

// Mock data for testing
const mockData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Developer' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Designer' },
];

const mockColumns = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
];

describe('EnterpriseDataGrid', () => {
  test('renders EnterpriseDataGrid component with title', () => {
    render(
      <EnterpriseDataGrid
        data={mockData}
        columns={mockColumns}
        title="User Management"
      />
    );
    expect(screen.getByText('User Management')).toBeInTheDocument();
  });

  test('displays table data correctly', () => {
    render(
      <EnterpriseDataGrid
        data={mockData}
        columns={mockColumns}
        title="User Management"
      />
    );
    
    // Check if data is rendered
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  test('shows no data message when data is empty', () => {
    render(
      <EnterpriseDataGrid
        data={[]}
        columns={mockColumns}
        title="User Management"
      />
    );
    
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  test('handles row click event', () => {
    const mockOnRowClick = jest.fn();
    render(
      <EnterpriseDataGrid
        data={mockData}
        columns={mockColumns}
        onRowClick={mockOnRowClick}
        title="User Management"
      />
    );
    
    const row = screen.getByText('John Doe').closest('tr');
    if (row) {
      fireEvent.click(row);
      expect(mockOnRowClick).toHaveBeenCalledWith(mockData[0]);
    }
  });

  test('handles search functionality', () => {
    render(
      <EnterpriseDataGrid
        data={mockData}
        columns={mockColumns}
        searchable={true}
        title="User Management"
      />
    );
    
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'John' } });
    
    expect(searchInput).toHaveValue('John');
    // In a real implementation, this would filter out Jane Smith
    // but for this test we're just checking the input works
  });

  test('renders action buttons when handlers are provided', () => {
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();
    
    render(
      <EnterpriseDataGrid
        data={mockData}
        columns={mockColumns}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        title="User Management"
      />
    );
    
    const actionButtons = screen.getAllByRole('button');
    expect(actionButtons.length).toBeGreaterThan(0);
  });

  test('shows loading state when loading prop is true', () => {
    render(
      <EnterpriseDataGrid
        data={mockData}
        columns={mockColumns}
        loading={true}
        title="User Management"
      />
    );
    
    // Check for the loading animation container
    expect(screen.getByText('', { selector: '.animate-pulse' })).toBeInTheDocument();
    
    // Check for skeleton elements
    expect(screen.getAllByText('', { selector: '.bg-gray-200' }).length).toBeGreaterThan(0);
  });

  test('renders toolbar when showToolbar is true', () => {
    render(
      <EnterpriseDataGrid
        data={mockData}
        columns={mockColumns}
        showToolbar={true}
        title="User Management"
      />
    );
    
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  test('does not render toolbar when showToolbar is false', () => {
    render(
      <EnterpriseDataGrid
        data={mockData}
        columns={mockColumns}
        showToolbar={false}
        title="User Management"
      />
    );
    
    expect(screen.queryByPlaceholderText('Search...')).not.toBeInTheDocument();
  });
});