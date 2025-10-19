import React, { useState } from 'react';
import Card from './Card';

interface User {
  id: string;
  name: string;
  status: 'online' | 'away' | 'offline';
}

interface Message {
  id: string;
  sender: User;
  content: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
}

interface EnterpriseChatProps {
  participants?: User[];
  messages?: Message[];
  title?: string;
  onParticipantSelect?: (participant: User) => void;
}

const EnterpriseChat: React.FC<EnterpriseChatProps> = ({
  participants = [],
  messages = [],
  title = 'Team Chat',
  onParticipantSelect
}) => {
  const defaultParticipants: User[] = [
    { id: '1', name: 'John Doe', status: 'online' },
    { id: '2', name: 'Jane Smith', status: 'away' }
  ];

  const defaultMessages: Message[] = [
    {
      id: '1',
      sender: { id: '1', name: 'John Doe', status: 'online' },
      content: 'Hello there!',
      timestamp: new Date(),
      status: 'read'
    },
    {
      id: '2',
      sender: { id: '2', name: 'Jane Smith', status: 'away' },
      content: 'Hi! How are you?',
      timestamp: new Date(),
      status: 'read'
    }
  ];

  const effectiveParticipants = participants.length > 0 ? participants : defaultParticipants;
  const effectiveMessages = messages.length > 0 ? messages : defaultMessages;

  const [selectedParticipant, setSelectedParticipant] = useState<User | null>(null);

  const handleParticipantClick = (participant: User) => {
    setSelectedParticipant(participant);
    if (onParticipantSelect) {
      onParticipantSelect(participant);
    }
  };

  return (
    <div className='enterprise-chat'>
      <h2 className='text-lg font-semibold mb-4'>{title}</h2>
      <div className='bg-white p-4 rounded-lg shadow-sm border h-64'>
        <div className='flex h-full'>
          {/* Participants Sidebar */}
          <div className='w-1/4 border-r pr-4'>
            <h3 className='text-sm font-medium mb-2'>Participants</h3>
            <div className='space-y-2'>
              {effectiveParticipants.map((participant) => (
                <Card
                  key={participant.id}
                  className={`p-2 cursor-pointer ${selectedParticipant?.id === participant.id ? 'bg-blue-50' : ''}`}
                  onClick={() => handleParticipantClick(participant)}
                  data-testid='mock-card'
                >
                  <div className='flex items-center space-x-2'>
                    <div className={`w-2 h-2 rounded-full ${participant.status === 'online' ? 'bg-green-500' : participant.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'}`}></div>
                    <span className='text-sm'>{participant.name}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Messages Area */}
          <div className='flex-1 flex flex-col pl-4'>
            <div className='flex-1 overflow-y-auto'>
              {effectiveMessages.map((msg) => (
                <div key={msg.id} className='mb-2 p-2 bg-gray-50 rounded'>
                  <p className='text-sm'>
                    <strong>{msg.sender.name}:</strong> {msg.content}
                  </p>
                </div>
              ))}
            </div>
            {selectedParticipant && (
              <div className='mt-2'>
                <input
                  type='text'
                  placeholder='Message'
                  className='w-full p-2 border rounded'
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseChat;
