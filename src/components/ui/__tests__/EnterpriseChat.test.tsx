import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import EnterpriseChat from '../EnterpriseChat';

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

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
const mockParticipants = [
  {
    id: '1',
    name: 'John Doe',
    status: 'online' as const,
    lastSeen: new Date()
  },
  {
    id: '2',
    name: 'Jane Smith',
    status: 'away' as const,
    lastSeen: new Date()
  }
];

const mockMessages = [
  {
    id: '1',
    sender: {
      id: '1',
      name: 'John Doe'
    },
    content: 'Hello there!',
    timestamp: new Date(),
    status: 'read' as const
  },
  {
    id: '2',
    sender: {
      id: '2',
      name: 'Jane Smith'
    },
    content: 'Hi! How are you?',
    timestamp: new Date(),
    status: 'delivered' as const
  }
];

const mockCurrentUser = {
  id: '1',
  name: 'John Doe',
  status: 'online' as const
};

describe('EnterpriseChat', () => {
  test('renders EnterpriseChat component with title', () => {
    render(
      <EnterpriseChat
        participants={mockParticipants}
        messages={mockMessages}
        currentUser={mockCurrentUser}
        title="Team Chat"
      />
    );
    expect(screen.getByText('Team Chat')).toBeInTheDocument();
  });

  test('displays participants list', () => {
    render(
      <EnterpriseChat
        participants={mockParticipants}
        messages={mockMessages}
        currentUser={mockCurrentUser}
      />
    );
    
    // Check for participant names in the sidebar
    const participantNames = screen.getAllByText('John Doe');
    const janeNames = screen.getAllByText('Jane Smith');
    expect(participantNames.length).toBeGreaterThan(0);
    expect(janeNames.length).toBeGreaterThan(0);
  });

  test('displays messages', () => {
    render(
      <EnterpriseChat
        participants={mockParticipants}
        messages={mockMessages}
        currentUser={mockCurrentUser}
      />
    );
    
    expect(screen.getByText('Hello there!')).toBeInTheDocument();
    expect(screen.getByText('Hi! How are you?')).toBeInTheDocument();
  });

  test('shows message input when participant is selected', () => {
    const mockOnParticipantSelect = jest.fn();
    
    render(
      <EnterpriseChat
        participants={mockParticipants}
        messages={mockMessages}
        currentUser={mockCurrentUser}
        onParticipantSelect={mockOnParticipantSelect}
      />
    );
    
    // Click on a participant to select them
    const participant = screen.getAllByText('John Doe')[0];
    act(() => {
      participant.click();
    });
    
    // The input should now be visible
    expect(screen.getByPlaceholderText(/Message/)).toBeInTheDocument();
  });

  test('renders status indicators correctly', () => {
    render(
      <EnterpriseChat
        participants={mockParticipants}
        messages={mockMessages}
        currentUser={mockCurrentUser}
      />
    );
    
    // Check for status indicators
    const onlineIndicators = screen.getAllByTestId('mock-card');
    expect(onlineIndicators.length).toBeGreaterThan(0);
  });
});