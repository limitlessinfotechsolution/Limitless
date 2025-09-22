'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Minimize2, Maximize2 } from 'lucide-react';
import { useContactBehaviorTracking } from '../../hooks/useContactBehaviorTracking';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatPreferences {
  preferredTopics: string[];
  interactionCount: number;
  lastInteraction: Date;
  responsePreferences: {
    formal: boolean;
    detailed: boolean;
  };
}

interface LiveChatWidgetProps {
  className?: string;
}

const LiveChatWidget: React.FC<LiveChatWidgetProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [preferences, setPreferences] = useState<ChatPreferences>({
    preferredTopics: [],
    interactionCount: 0,
    lastInteraction: new Date(),
    responsePreferences: {
      formal: true,
      detailed: true
    }
  });
  const { trackChatInteraction } = useContactBehaviorTracking();

  // Load user preferences from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPreferences = localStorage.getItem('chatPreferences');
      if (savedPreferences) {
        try {
          const parsed = JSON.parse(savedPreferences);
          setPreferences({
            ...parsed,
            lastInteraction: new Date(parsed.lastInteraction)
          });
        } catch {
          // If parsing fails, use default preferences
        }
      }
      
      // Generate or retrieve session ID
      const existingSessionId = sessionStorage.getItem('chatSessionId') || `session-${Date.now()}`;
      setSessionId(existingSessionId);
      sessionStorage.setItem('chatSessionId', existingSessionId);
    }
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chatPreferences', JSON.stringify(preferences));
    }
  }, [preferences]);

  const quickReplies = [
    'Get a quote',
    'Service information',
    'Project timeline',
    'Contact details'
  ];

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    trackChatInteraction();

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Update preferences based on user message
      const updatedPreferences = { ...preferences };
      updatedPreferences.interactionCount += 1;
      updatedPreferences.lastInteraction = new Date();
      
      // Simple topic detection
      const lowerText = text.toLowerCase();
      if (lowerText.includes('pricing') || lowerText.includes('cost') || lowerText.includes('budget')) {
        if (!updatedPreferences.preferredTopics.includes('pricing')) {
          updatedPreferences.preferredTopics.push('pricing');
        }
      }
      if (lowerText.includes('service') || lowerText.includes('offer')) {
        if (!updatedPreferences.preferredTopics.includes('services')) {
          updatedPreferences.preferredTopics.push('services');
        }
      }
      if (lowerText.includes('project') || lowerText.includes('timeline')) {
        if (!updatedPreferences.preferredTopics.includes('projects')) {
          updatedPreferences.preferredTopics.push('projects');
        }
      }
      
      setPreferences(updatedPreferences);

      // Send message to AI API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          sessionId: sessionId,
          preferences: updatedPreferences
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const botResponse = await response.text();
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch {
      // Fallback response if API fails
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Thanks for your message! Our team will get back to you shortly. In the meantime, feel free to browse our services or portfolio for more information.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Removed unused function - now using AI API for responses

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              height: isMinimized ? '60px' : '500px'
            }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-600 w-80 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-accent text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold">Live Support</h3>
                  <p className="text-xs opacity-90">Typically replies instantly</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-white/20 rounded"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 p-4 space-y-4 max-h-64 overflow-y-auto">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-2xl ${
                          message.sender === 'user'
                            ? 'bg-accent text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </motion.div>
                  ))}

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-2xl">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Quick Replies */}
                {messages.length === 1 && (
                  <div className="px-4 pb-2">
                    <div className="flex flex-wrap gap-2">
                      {quickReplies.map((reply) => (
                        <button
                          key={reply}
                          onClick={() => handleQuickReply(reply)}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full hover:bg-accent hover:text-white transition-colors"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                      placeholder="Type your message..."
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      onClick={() => handleSendMessage(inputValue)}
                      disabled={!inputValue.trim()}
                      className="p-2 bg-accent text-white rounded-lg hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-accent text-white rounded-full shadow-lg flex items-center justify-center hover:bg-accent-dark transition-colors"
        >
          <MessageCircle className="w-6 h-6" />
        </motion.button>
      )}
    </div>
  );
};

export default LiveChatWidget;