import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Send, RefreshCw, X, Mic, MicOff, Download, Sparkles, Minimize2 } from 'lucide-react';
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import SuggestedPrompts from './SuggestedPrompts';
import { useChatMessages } from '../../hooks/useChatMessages';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { RESPONSIVE_BREAKPOINTS } from '../../config/chatConfig';

interface ChatWindowProps {
  onClose: () => void;
  onMinimize?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = React.memo(({ onClose, onMinimize }) => {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use custom hooks
  const { messages, isLoading, sendMessage, newChat, exportConversation } = useChatMessages();
  const { isListening, startListening, stopListening, isSupported } = useSpeechRecognition((transcript: string) => {
    setInputValue(transcript);
    setTimeout(() => sendMessage(transcript), 100);
  });

  // Responsive sizing based on screen size
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Memoized responsive classes
  const responsiveClasses = useMemo(() => {
    if (windowSize.width < RESPONSIVE_BREAKPOINTS.mobile) {
      // Mobile
      return "fixed bottom-20 left-4 right-4 w-auto max-w-none h-[50vh] max-h-[400px]";
    } else if (windowSize.width < RESPONSIVE_BREAKPOINTS.tablet) {
      // Tablet
      return "fixed bottom-24 right-6 w-[calc(100vw-48px)] max-w-sm h-[55vh] max-h-[450px]";
    } else {
      // Desktop
      return "fixed bottom-24 right-6 w-[calc(100vw-48px)] max-w-md h-[60vh] max-h-[500px]";
    }
  }, [windowSize.width]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  const handleSend = useCallback(() => {
    sendMessage(inputValue);
    setInputValue('');
  }, [inputValue, sendMessage]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 40 }}
      className={`${responsiveClasses} bg-gradient-to-br from-white via-gray-50 to-accent/5 dark:from-gray-900 dark:via-gray-800 dark:to-accent/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-accent/20 dark:border-accent/10 font-sans`}
      style={{ zIndex: 9999 }}
    >
      <header className="flex items-center justify-between p-4 border-b border-accent/10 dark:border-accent/20 flex-shrink-0 bg-gradient-to-r from-accent/5 to-transparent">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="p-2 bg-accent/10 rounded-full ring-2 ring-accent/20">
              <Sparkles className="w-6 h-6 text-accent" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full animate-pulse"></span>
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">Auralis</h3>
            <p className="text-xs text-accent font-medium">Where Innovation Meets Execution – Powered by Auralis</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button onClick={newChat} className="p-2 rounded-full hover:bg-accent/10 dark:hover:bg-accent/20 transition-colors" aria-label="New Chat">
            <RefreshCw size={16} className="text-accent" />
          </button>
          <button onClick={exportConversation} className="p-2 rounded-full hover:bg-accent/10 dark:hover:bg-accent/20 transition-colors" aria-label="Export Conversation">
            <Download size={16} className="text-accent" />
          </button>
          {onMinimize && (
            <button onClick={onMinimize} className="p-2 rounded-full hover:bg-accent/10 dark:hover:bg-accent/20 transition-colors" aria-label="Minimize Chat">
              <Minimize2 size={16} className="text-accent" />
            </button>
          )}
          <button onClick={onClose} className="p-2 rounded-full hover:bg-accent/10 dark:hover:bg-accent/20 transition-colors" aria-label="Close Chat">
            <X size={18} className="text-accent" />
          </button>
        </div>
      </header>

      <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-accent/30 dark:scrollbar-thumb-accent/20 scrollbar-track-transparent">
        <div className="space-y-4">
          {messages.map(msg => <Message key={msg.id} message={msg} onFeedback={() => {}} />)}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <footer className="p-3 border-t border-accent/10 dark:border-accent/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex-shrink-0">
        {messages[messages.length - 1]?.sender === 'bot' && messages[messages.length - 1].suggestions && !isLoading && (
          <SuggestedPrompts
            prompts={messages[messages.length - 1].suggestions!}
            onPromptClick={(prompt) => { sendMessage(prompt); }}
          />
        )}
        <div className="relative flex items-end space-x-2 mt-2">
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about Limitless..."
            className="flex-1 w-full pl-4 pr-24 py-3 bg-white dark:bg-gray-800 border border-accent/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none max-h-32 scrollbar-thin transition-all duration-200"
          />
          <div className="absolute right-2 bottom-2 flex items-center space-x-1">
            <button type="button" onClick={isListening ? stopListening : startListening} className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500/20 text-red-500' : 'text-accent hover:bg-accent/10'}`} disabled={!isSupported} aria-label="Voice input">
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <button type="submit" onClick={handleSend} className="p-2 bg-accent text-white rounded-full hover:bg-accent-dark transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl" disabled={!inputValue.trim() || isLoading} aria-label="Send message">
              <Send size={20} />
            </button>
          </div>
        </div>
        <p className="text-xs text-center text-accent/60 mt-2 font-medium">Powered by Limitless Brain</p>
      </footer>
    </motion.div>
  );
});

export default ChatWindow;



