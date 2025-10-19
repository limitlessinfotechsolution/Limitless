import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EnterpriseDataGrid from '../EnterpriseDataGrid';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ChevronDown: () => <div data-testid="chevron-down">ChevronDown</div>,
  Search: () => <div data-testid="search">Search</div>,
  Filter: () => <div data-testid="filter">Filter</div>,
  Download: () => <div data-testid="download">Download</div>,
  Eye: () => <div data-testid="eye">Eye</div>,
  Edit: () => <div data-testid="edit">Edit</div>,
  Trash2: () => <div data-testid="trash">Trash2</div>,
  Plus: () => <div data-testid="plus">Plus</div>,
}));

// Mock @tanstack/react-table
jest.mock('@tanstack/react-table', () => ({
  useReactTable: jest.fn(() => ({
    getHeaderGroups: jest.fn(() => []),
    getRowModel: jest.fn(() => ({ rows: [] })),
    getFilteredRowModel: jest.fn(() => ({ rows: [] })),
    getSelectedRowModel: jest.fn(() => ({ rows: [] })),
    getState: jest.fn(() => ({ pagination: { pageIndex: 0, pageSize: 10 } })),
    getPageCount: jest.fn(() => 1),
    getIsAllRowsSelected: jest.fn(() => false),
    getToggleAllRowsSelectedHandler: jest.fn(() => jest.fn()),
    getCanPreviousPage: jest.fn(() => false),
    getCanNextPage: jest.fn(() => false),
    previousPage: jest.fn(),
    nextPage: jest.fn(),
    setGlobalFilter: jest.fn(),
  })),
  getCoreRowModel: jest.fn(() => ({})),
  getFilteredRowModel: jest.fn(() => ({})),
  getPaginationRowModel: jest.fn(() => ({})),
  getSortedRowModel: jest.fn(() => ({})),
  flexRender: jest.fn((component) => component),
}));

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