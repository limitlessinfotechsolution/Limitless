import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EnterpriseSuiteDemo from '../EnterpriseSuiteDemo';

// Mock child components to avoid complexity in tests
jest.mock('../EnterpriseLayout', () => {
  return function MockEnterpriseLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="enterprise-layout">{children}</div>;
  };
});

jest.mock('../EnterpriseKPI', () => {
  return function MockEnterpriseKPI() {
    return <div data-testid="enterprise-kpi">KPI Component</div>;
  };
});

jest.mock('../EnterpriseDashboard', () => {
  return function MockEnterpriseDashboard() {
    return <div data-testid="enterprise-dashboard">Dashboard Component</div>;
  };
});

jest.mock('../EnterpriseTeam', () => {
  return function MockEnterpriseTeam() {
    return <div data-testid="enterprise-team">Team Component</div>;
  };
});

jest.mock('../EnterpriseCalendar', () => {
  return function MockEnterpriseCalendar() {
    return <div data-testid="enterprise-calendar">Calendar Component</div>;
  };
});

jest.mock('../EnterpriseChat', () => {
  return function MockEnterpriseChat() {
    return <div data-testid="enterprise-chat">Chat Component</div>;
  };
});

jest.mock('../EnterpriseDataGrid', () => {
  return function MockEnterpriseDataGrid() {
    return <div data-testid="enterprise-datagrid">DataGrid Component</div>;
  };
});

jest.mock('../EnterpriseReporting', () => {
  return function MockEnterpriseReporting() {
    return <div data-testid="enterprise-reporting">Reporting Component</div>;
  };
});

jest.mock('../EnterpriseUserProfile', () => {
  return function MockEnterpriseUserProfile() {
    return <div data-testid="enterprise-userprofile">UserProfile Component</div>;
  };
});

describe('EnterpriseSuiteDemo', () => {
  test('renders the enterprise suite demo with all components', () => {
    render(<EnterpriseSuiteDemo />);
    
    // Check that the layout is rendered
    expect(screen.getByTestId('enterprise-layout')).toBeInTheDocument();
    
    // Check that all mocked components are rendered
    expect(screen.getByTestId('enterprise-kpi')).toBeInTheDocument();
    expect(screen.getByTestId('enterprise-dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('enterprise-team')).toBeInTheDocument();
    expect(screen.getByTestId('enterprise-calendar')).toBeInTheDocument();
    expect(screen.getByTestId('enterprise-chat')).toBeInTheDocument();
    expect(screen.getByTestId('enterprise-datagrid')).toBeInTheDocument();
    expect(screen.getByTestId('enterprise-reporting')).toBeInTheDocument();
    expect(screen.getByTestId('enterprise-userprofile')).toBeInTheDocument();
  });
});