import { ChatMessage } from '../components/chat/ChatWidget';

export const useChatBot = () => {

  const getInitialMessage = (): ChatMessage => {
    return {
      id: 'initial',
      content: 'Hello! How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
      type: 'text',
      quickReplies: ['Tell me about your services', 'Contact support', 'FAQ']
    };
  };

  const sendMessage = async (content: string): Promise<ChatMessage> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock response based on content
    let responseContent = 'Thank you for your message. How else can I assist you?';
    let quickReplies: string[] | undefined;

    if (content.toLowerCase().includes('services')) {
      responseContent = 'We offer web development, mobile apps, AI solutions, and more. What specific service are you interested in?';
      quickReplies = ['Web Development', 'Mobile Apps', 'AI Solutions'];
    } else if (content.toLowerCase().includes('contact')) {
      responseContent = 'You can reach us at contact@limitlessinfotech.com or fill out our contact form.';
    } else if (content.toLowerCase().includes('faq')) {
      responseContent = 'Check out our FAQ section for common questions.';
    }

    return {
      id: Date.now().toString(),
      content: responseContent,
      sender: 'bot',
      timestamp: new Date(),
      type: 'text',
      quickReplies
    };
  };

  return {
    sendMessage,
    getInitialMessage
  };
};
