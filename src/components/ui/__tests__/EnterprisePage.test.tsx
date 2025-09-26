import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EnterpriseDemoPage from '../../../../app/enterprise/page';

// Mock the EnterpriseSuiteDemo component to avoid complexity in this test
jest.mock('../../../components/ui/EnterpriseSuiteDemo', () => {
  return function MockEnterpriseSuiteDemo() {
    return <div data-testid="enterprise-suite-demo">Enterprise Suite Demo</div>;
  };
});

describe('Enterprise Demo Page', () => {
  test('renders the enterprise demo page', () => {
    render(<EnterpriseDemoPage />);
    
    // Check that the page renders
    expect(screen.getByTestId('enterprise-suite-demo')).toBeInTheDocument();
  });
});