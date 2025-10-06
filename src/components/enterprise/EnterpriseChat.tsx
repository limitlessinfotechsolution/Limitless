import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical, 
  Search,
  Phone,
  Video,
  User,
  Check,
  CheckCheck
} from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Image from 'next/image';

interface ChatMessage {
  id: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  attachments?: {
    type: 'image' | 'document' | 'link';
    url: string;
    name?: string;
  }[];
}

interface ChatParticipant {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'away' | 'offline';
  lastSeen?: Date;
}

interface ChatAttachment {
  type: 'image' | 'document' | 'link';
  url: string;
  name?: string;
}

interface EnterpriseChatProps {
  participants: ChatParticipant[];
  messages: ChatMessage[];
  currentUser: ChatParticipant;
  onSendMessage?: (message: string, attachments?: ChatAttachment[]) => void;
  onParticipantSelect?: (participant: ChatParticipant) => void;
  className?: string;
  title?: string;
}

const EnterpriseChat: React.FC<EnterpriseChatProps> = ({
  participants,
  messages,
  currentUser,
  onSendMessage,
  onParticipantSelect,
  className = '',
  title = 'Team Chat'
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState<ChatParticipant | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'away':
        return 'Away';
      default:
        return 'Offline';
    }
  };

  const getMessageStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Check className="w-4 h-4 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-4 h-4 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current && messagesEndRef.current.scrollIntoView) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() && onSendMessage) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`flex h-[600px] ${className}`}>
      {/* Participants Sidebar */}
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <Card className="p-4 rounded-none rounded-tl-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
            <Button variant="ghost" size="sm" icon={<MoreVertical className="w-4 h-4" />}>
              &nbsp;
            </Button>
          </div>
          
          <div className="mt-3 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-accent focus:border-accent"
            />
          </div>
        </Card>
        
        <div className="flex-1 overflow-y-auto">
          {participants.map(participant => (
            <div
              key={participant.id}
              className={`p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                selectedParticipant?.id === participant.id ? 'bg-gray-100 dark:bg-gray-800' : ''
              }`}
              onClick={() => {
                setSelectedParticipant(participant);
                if (onParticipantSelect) {
                  onParticipantSelect(participant);
                }
              }}
            >
              <div className="flex items-center">
                {participant.avatar ? (
                  <div className="relative w-10 h-10 rounded-full">
                    <Image 
                      src={participant.avatar} 
                      alt={participant.name} 
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </div>
                )}
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 dark:text-white">{participant.name}</h3>
                    <span className={`w-2 h-2 rounded-full ${getStatusColor(participant.status)}`}></span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {getStatusText(participant.status)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        {selectedParticipant && (
          <Card className="p-4 rounded-none rounded-tr-lg border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {selectedParticipant.avatar ? (
                  <div className="relative w-10 h-10 rounded-full">
                    <Image 
                      src={selectedParticipant.avatar} 
                      alt={selectedParticipant.name} 
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </div>
                )}
                <div className="ml-3">
                  <h3 className="font-medium text-gray-900 dark:text-white">{selectedParticipant.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {getStatusText(selectedParticipant.status)}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" icon={<Phone className="w-4 h-4" />}>
                  &nbsp;
                </Button>
                <Button variant="ghost" size="sm" icon={<Video className="w-4 h-4" />}>
                  &nbsp;
                </Button>
                <Button variant="ghost" size="sm" icon={<MoreVertical className="w-4 h-4" />}>
                  &nbsp;
                </Button>
              </div>
            </div>
          </Card>
        )}
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex mb-4 ${
                  message.sender.id === currentUser.id ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.sender.id !== currentUser.id && (
                  <div className="mr-2">
                    {message.sender.avatar ? (
                      <div className="relative w-8 h-8 rounded-full">
                        <Image 
                          src={message.sender.avatar} 
                          alt={message.sender.name} 
                          fill
                          className="object-cover rounded-full"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      </div>
                    )}
                  </div>
                )}
                
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender.id === currentUser.id
                      ? 'bg-accent text-white rounded-br-none'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {message.sender.id !== currentUser.id && (
                    <p className="text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">
                      {message.sender.name}
                    </p>
                  )}
                  <p>{message.content}</p>
                  <div className={`flex items-center justify-end mt-1 ${
                    message.sender.id === currentUser.id ? 'text-accent-100' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    <span className="text-xs">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {message.sender.id === currentUser.id && (
                      <span className="ml-1">
                        {getMessageStatusIcon(message.status)}
                      </span>
                    )}
                  </div>
                </div>
                
                {message.sender.id === currentUser.id && (
                  <div className="ml-2">
                    {currentUser.avatar ? (
                      <div className="relative w-8 h-8 rounded-full">
                        <Image 
                          src={currentUser.avatar} 
                          alt={currentUser.name} 
                          fill
                          className="object-cover rounded-full"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
        
        {/* Message Input */}
        {selectedParticipant && (
          <Card className="p-4 rounded-none rounded-br-lg border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-end">
              <div className="flex-1 relative">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Message ${selectedParticipant.name}...`}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-accent focus:border-accent resize-none"
                  rows={1}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 bottom-2"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <Smile className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="ml-2 flex space-x-2">
                <Button variant="ghost" size="sm" icon={<Paperclip className="w-4 h-4" />}>
                  &nbsp;
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Send className="w-4 h-4" />}
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  &nbsp;
                </Button>
              </div>
            </div>
            
            {/* Emoji Picker */}
            <AnimatePresence>
              {showEmojiPicker && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="grid grid-cols-8 gap-1">
                    {['😀', '😂', '😍', '😎', '👍', '👏', '🎉', '❤️'].map((emoji, index) => (
                      <button
                        key={index}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-lg"
                        onClick={() => {
                          setNewMessage(prev => prev + emoji);
                          setShowEmojiPicker(false);
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EnterpriseChat;
export type { ChatMessage, ChatParticipant, ChatAttachment };
