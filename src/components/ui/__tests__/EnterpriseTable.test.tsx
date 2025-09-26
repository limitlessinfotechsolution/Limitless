import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EnterpriseTable from '../EnterpriseTable';

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
const mockData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Developer' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Designer' },
];

const mockColumns = [
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

describe('EnterpriseTable', () => {
  test('renders EnterpriseTable component with title', () => {
    render(
      <EnterpriseTable
        data={mockData}
        columns={mockColumns}
        title="User Management"
      />
    );
    expect(screen.getByText('User Management')).toBeInTheDocument();
  });

  test('displays table data correctly', () => {
    render(
      <EnterpriseTable
        data={mockData}
        columns={mockColumns}
      />
    );
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  test('shows loading state when loading prop is true', () => {
    render(
      <EnterpriseTable
        data={mockData}
        columns={mockColumns}
        loading={true}
      />
    );
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('shows no data message when data is empty', () => {
    render(
      <EnterpriseTable
        data={[]}
        columns={mockColumns}
      />
    );
    
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  test('renders action buttons when action handlers are provided', () => {
    const mockEdit = jest.fn();
    const mockDelete = jest.fn();
    
    render(
      <EnterpriseTable
        data={mockData}
        columns={mockColumns}
        onEdit={mockEdit}
        onDelete={mockDelete}
      />
    );
    
    const editButtons = screen.getAllByTestId('mock-button');
    expect(editButtons.length).toBeGreaterThan(0);
  });
});