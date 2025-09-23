import { ChatMessage } from '../types';

export const INITIAL_MESSAGE: ChatMessage = {
  id: 'initial-0',
  sender: 'bot',
  content: "Hello! I'm Auralis, your AI-powered assistant from Limitless Infotech Solution Pvt. Ltd. Where innovation meets execution, I'm here to help you discover our cutting-edge technology solutions, explore our successful portfolio, and answer any questions about transforming your business. How can I assist you today?",
  timestamp: new Date().toISOString(),
  suggestions: ['Tell me about your services', 'Show me your portfolio', 'How much do you charge?'],
};

export const RESPONSIVE_BREAKPOINTS = {
  mobile: 640,
  tablet: 1024,
};

export const SPEECH_RECOGNITION_CONFIG = {
  continuous: false,
  interimResults: false,
  lang: 'en-US',
};
