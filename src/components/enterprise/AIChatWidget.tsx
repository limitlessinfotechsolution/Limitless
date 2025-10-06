'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, Minimize2, History, Zap, Lightbulb, Clock, Mic, MicOff } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { usePathname } from 'next/navigation';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface AIChatWidgetProps {
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

const AIChatWidget: React.FC<AIChatWidgetProps> = ({
  isMinimized = false,
  onToggleMinimize
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm Auralis, your AI assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClientComponentClient();
  const pathname = usePathname();

  // Context-aware suggestions based on current page
  const getContextualSuggestions = () => {
    const suggestions = [];

    if (pathname?.includes('/dashboard')) {
      suggestions.push(
        'Show me today\'s key metrics',
        'What are the top anomalies?',
        'Generate performance report',
        'Predict next week\'s revenue'
      );
    } else if (pathname?.includes('/projects')) {
      suggestions.push(
        'Show overdue projects',
        'Create new project milestone',
        'Update project status',
        'Find team member availability'
      );
    } else if (pathname?.includes('/clients')) {
      suggestions.push(
        'Show active client projects',
        'Schedule client meeting',
        'Generate client report',
        'Check communication sentiment'
      );
    } else if (pathname?.includes('/team')) {
      suggestions.push(
        'Show team performance',
        'Schedule team meeting',
        'Check attendance',
        'Generate productivity report'
      );
    } else if (pathname?.includes('/billing')) {
      suggestions.push(
        'Show outstanding invoices',
        'Generate quotation',
        'Check payment status',
        'Forecast monthly revenue'
      );
    } else if (pathname?.includes('/qa')) {
      suggestions.push(
        'Show pending QA tasks',
        'Generate quality report',
        'Check code quality metrics',
        'Schedule QA review'
      );
    } else if (pathname?.includes('/leads')) {
      suggestions.push(
        'Show high-priority leads',
        'Generate lead report',
        'Check conversion rates',
        'Schedule follow-up calls'
      );
    }

    return suggestions;
  };

  const quickActions = [
    { icon: <Lightbulb className="w-4 h-4" />, label: 'Insights', command: 'Show me key insights' },
    { icon: <Clock className="w-4 h-4" />, label: 'Schedule', command: 'Schedule a meeting' },
    { icon: <Zap className="w-4 h-4" />, label: 'Automate', command: 'Help me automate this task' },
    { icon: <History className="w-4 h-4" />, label: 'History', command: 'Show recent activities' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          text: 'Please log in to use the AI assistant.',
          isUser: false,
          timestamp: new Date()
        }]);
        return;
      }

      const response = await fetch('/api/enterprise/ai/command', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ command: inputValue })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: data.response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Chat error:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 3).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <button
          onClick={onToggleMinimize}
          className="bg-accent hover:bg-accent/90 text-white p-3 rounded-full shadow-lg transition-colors"
        >
          <Bot className="w-6 h-6" />
        </button>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed bottom-4 right-4 z-50 w-96 h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center mr-3">
                <Bot className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Auralis AI</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Enterprise Assistant</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={onToggleMinimize}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isUser
                      ? 'bg-accent text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2 overflow-x-auto">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => setInputValue(action.command)}
                  className="flex items-center space-x-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors whitespace-nowrap"
                  disabled={isLoading}
                >
                  {action.icon}
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Contextual Suggestions */}
          {getContextualSuggestions().length > 0 && (
            <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 mb-2">
                <Lightbulb className="w-4 h-4 text-accent" />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Suggested for this page:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {getContextualSuggestions().slice(0, 3).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setInputValue(suggestion)}
                    className="px-3 py-1 bg-accent/10 hover:bg-accent/20 text-accent text-xs rounded-full border border-accent/20 hover:border-accent/40 transition-colors"
                    disabled={isLoading}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent dark:bg-gray-700 dark:text-white"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="p-2 bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIChatWidget;
