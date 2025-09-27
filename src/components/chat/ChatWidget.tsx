'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useChatBot } from '@/hooks/useChatBot';

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'quick_reply' | 'contact_form';
  quickReplies?: string[];
}

interface ChatWidgetProps {
  position?: 'bottom-right' | 'bottom-left';
  primaryColor?: string;
  secondaryColor?: string;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({
  position = 'bottom-right',
  primaryColor = '#3B82F6',
  secondaryColor = '#1E40AF'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { sendMessage, getInitialMessage } = useChatBot();

  // Initialize chat with welcome message
  useEffect(() => {
    const initialMessage = getInitialMessage();
    setMessages([initialMessage]);
  }, [getInitialMessage]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const botResponse = await sendMessage(content);
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later or contact us directly.",
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6'
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden ${
              isMinimized ? 'w-80 h-14' : 'w-80 h-96'
            }`}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700"
              style={{ backgroundColor: primaryColor }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Limitless Support</h3>
                  <p className="text-xs text-white/80">Online</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMinimize}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  {isMinimized ? (
                    <Maximize2 className="w-4 h-4 text-white" />
                  ) : (
                    <Minimize2 className="w-4 h-4 text-white" />
                  )}
                </button>
                <button
                  onClick={toggleChat}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Messages */}
            {!isMinimized && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-64">
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    onQuickReply={handleQuickReply}
                  />
                ))}
                {isTyping && (
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" />
                    </div>
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Input */}
            {!isMinimized && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleChat}
          className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white relative"
          style={{ backgroundColor: primaryColor }}
        >
          <MessageCircle className="w-6 h-6" />
          {messages.length === 1 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
            >
              <span className="text-xs font-bold text-white">1</span>
            </motion.div>
          )}
        </motion.button>
      )}
    </div>
  );
};

export default ChatWidget;
