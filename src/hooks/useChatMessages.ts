import React, { useState, useCallback, useRef } from 'react';
import { ChatMessage } from '../types';
import { INITIAL_MESSAGE } from '../config/chatConfig';
import { useToast } from './useToast';

interface UseChatMessagesReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  sessionId: string;
  sendMessage: (text: string) => Promise<void>;
  newChat: () => void;
  exportConversation: () => void;
}

export const useChatMessages = (): UseChatMessagesReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(() =>
    typeof window !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : ''
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { error } = useToast();

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat/auralis-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId }),
      });

      // Extract session ID from response headers if available
      const newSessionId = response.headers.get('X-Session-ID');
      if (newSessionId) {
        setSessionId(newSessionId);
      }

      // Extract suggestions from response headers
      const suggestionsHeader = response.headers.get('X-Suggestions');
      const suggestions = suggestionsHeader ? JSON.parse(suggestionsHeader) : [];

      if (!response.ok) throw new Error('Failed to send message');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let botResponse = '';

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        content: '',
        timestamp: new Date().toISOString(),
        suggestions: suggestions,
      };

      setMessages(prev => [...prev, botMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        botResponse += chunk;

        setMessages(prev => prev.map(msg =>
          msg.id === botMessage.id ? { ...msg, content: botResponse } : msg
        ));
      }
    } catch (err) {
      console.error('Error sending message:', err);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
      error('Error', 'Error sending message. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, sessionId, error]);

  const newChat = useCallback(() => {
    setMessages([INITIAL_MESSAGE]);
    setSessionId(typeof window !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : '');
  }, []);

  const exportConversation = useCallback(() => {
    const conversationText = messages
      .map(msg => `${msg.sender.toUpperCase()}: ${msg.content}`)
      .join('\n\n');

    const blob = new Blob([conversationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `limitless-chat-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [messages]);

  // Scroll to bottom when messages change
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return {
    messages,
    isLoading,
    sessionId,
    sendMessage,
    newChat,
    exportConversation,
  };
};
