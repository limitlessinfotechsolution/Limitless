import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EnterpriseUserProfile from '../EnterpriseUserProfile';

describe('EnterpriseUserProfile', () => {
  test('renders component with user data', () => {
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Developer'
    };

    render(<EnterpriseUserProfile user={mockUser} />);
    expect(screen.getByText('Enterprise User Profile')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Developer')).toBeInTheDocument();
  });

  test('renders component without user data', () => {
    render(<EnterpriseUserProfile />);
    expect(screen.getByText('No user data available')).toBeInTheDocument();
  });
});
