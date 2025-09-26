import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EnterpriseDashboard from '../EnterpriseDashboard';
import EnterpriseForm from '../EnterpriseForm';
import EnterpriseTeam from '../EnterpriseTeam';
import EnterprisePricing from '../EnterprisePricing';
import EnterpriseKPI from '../EnterpriseKPI';

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

describe('Enterprise Components', () => {
  test('renders EnterpriseDashboard component', () => {
    render(<EnterpriseDashboard />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  test('renders EnterpriseForm component', () => {
    const mockFields = [
      {
        id: 'name',
        label: 'Name',
        type: 'text',
        required: true
      }
    ];
    
    render(
      <EnterpriseForm
        title="Test Form"
        fields={mockFields}
        onSubmit={jest.fn()}
      />
    );
    
    expect(screen.getByText('Test Form')).toBeInTheDocument();
  });

  test('renders EnterpriseTeam component', () => {
    const mockTeam = [
      {
        id: '1',
        name: 'John Doe',
        role: 'Developer',
        email: 'john@example.com',
        status: 'active' as const,
        joinDate: '2023-01-01'
      }
    ];
    
    render(<EnterpriseTeam team={mockTeam} />);
    expect(screen.getByText('Team Members')).toBeInTheDocument();
  });

  test('renders EnterprisePricing component', () => {
    render(<EnterprisePricing />);
    expect(screen.getByText('Simple, transparent pricing')).toBeInTheDocument();
  });

  test('renders EnterpriseKPI component', () => {
    const mockKPIs = [
      {
        id: '1',
        title: 'Test KPI',
        value: '100',
        change: 10,
        changeType: 'positive' as const,
        icon: <div>Icon</div>
      }
    ];
    
    render(<EnterpriseKPI kpis={mockKPIs} />);
    expect(screen.getByText('Key Performance Indicators')).toBeInTheDocument();
  });
});