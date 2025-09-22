import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ChatMessage {
  id: string;
  session_id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: string;
  suggestions?: string[];
}

interface KnowledgeItem {
  id: number;
  category: string;
  title: string;
  content: string;
  keywords: string[];
}

interface IntentDetection {
  intent: string;
  confidence: number;
  entities: string[];
  suggestedActions: string[];
}

export class AuralisBrain {
  private knowledgeBase: KnowledgeItem[] = [];
  private messageHistory: string[] = [];
  private intentHistory: IntentDetection[] = [];

  constructor() {
    this.loadKnowledgeBase();
  }

  async loadKnowledgeBase() {
    try {
      const { data, error } = await supabase
        .from('knowledge_base')
        .select('*')
        .order('category');

      if (!error && data) {
        this.knowledgeBase = data as KnowledgeItem[];
      } else {
        console.warn('Failed to load knowledge base from database, using default knowledge');
        this.knowledgeBase = this.getDefaultKnowledge();
      }
    } catch (error) {
      console.warn('Error loading knowledge base, using default knowledge:', error);
      this.knowledgeBase = this.getDefaultKnowledge();
    }
  }

  getDefaultKnowledge(): KnowledgeItem[] {
    return [
      {
        id: 1,
        category: 'company',
        title: 'About Limitless Infotech',
        content: 'Limitless Infotech Solution Pvt. Ltd. is a cutting-edge technology company specializing in innovative software development, web applications, mobile apps, and digital transformation. Founded by Faisal Khan, we bridge the gap between technology and business needs, delivering solutions that drive growth and efficiency.',
        keywords: ['about', 'company', 'limitless', 'faisal khan', 'founded']
      },
      {
        id: 2,
        category: 'services',
        title: 'Our Services',
        content: 'We offer comprehensive technology services including: Custom Software Development, Web Application Development, Mobile App Development (iOS & Android), E-commerce Solutions, Cloud Services & Migration, API Development & Integration, Database Design & Management, UI/UX Design, Quality Assurance & Testing, DevOps & CI/CD, Digital Marketing Solutions, and IT Consulting.',
        keywords: ['services', 'software', 'web', 'mobile', 'cloud', 'api', 'design', 'testing']
      },
      {
        id: 3,
        category: 'pricing',
        title: 'Pricing Information',
        content: 'We offer flexible pricing models including fixed-price, time & materials, and dedicated team options. Our pricing is customized based on project scope and requirements. Contact us for a free consultation to discuss your project requirements and get a customized quote.',
        keywords: ['pricing', 'cost', 'quote', 'consultation', 'price', 'budget']
      },
      {
        id: 4,
        category: 'portfolio',
        title: 'Our Portfolio',
        content: 'Our portfolio includes successful projects in healthcare, finance, e-commerce, education, and logistics. We have delivered solutions for startups to enterprise clients, focusing on innovation and measurable results. We\'ve delivered 120+ projects globally, partnering with startups and enterprises alike.',
        keywords: ['portfolio', 'projects', 'work', 'case studies', 'examples']
      },
      {
        id: 5,
        category: 'contact',
        title: 'Contact Information',
        content: 'Get in touch with us through our contact form, email at Info@limitlessinfotech.com, or phone at +91 7710909492. We\'re located in Mumbai, Maharashtra, India. Our team typically responds within 2 hours during business hours.',
        keywords: ['contact', 'email', 'phone', 'address', 'location', 'reach']
      },
      {
        id: 6,
        category: 'technology',
        title: 'Technology Stack',
        content: 'We work with modern technologies including JavaScript/TypeScript, Python, Java, PHP, React, Angular, Vue.js, Node.js, Express, Django, Spring Boot, MongoDB, PostgreSQL, MySQL, AWS, Azure, Docker, Kubernetes, and more.',
        keywords: ['technology', 'stack', 'javascript', 'python', 'react', 'node', 'database']
      },
      {
        id: 7,
        category: 'auralis',
        title: 'Auralis - Our AI Assistant',
        content: 'Auralis is our AI-powered assistant, representing innovation, intelligence, and seamless user interaction. Auralis serves as the intelligent interface for website & enterprise solutions, powered by advanced AI technology. With continuous self-learning and self-improvement capabilities, Auralis provides personalized assistance.',
        keywords: ['auralis', 'ai', 'assistant', 'chatbot', 'intelligence']
      }
    ];
  }

  detectIntent(message: string): IntentDetection {
    const lowerMessage = message.toLowerCase();

    const intents = [
      { 
        keywords: ['pricing', 'cost', 'fee', 'price', 'budget', 'quote', 'how much', 'payment'], 
        intent: 'pricing', 
        actions: ['Get pricing information', 'Schedule consultation', 'View pricing tiers'] 
      },
      { 
        keywords: ['service', 'offer', 'provide', 'do you do', 'capabilities'], 
        intent: 'services', 
        actions: ['View services', 'Get portfolio', 'Contact for custom solution'] 
      },
      { 
        keywords: ['portfolio', 'work', 'project', 'case study', 'examples'], 
        intent: 'portfolio', 
        actions: ['Browse portfolio', 'View case studies', 'See testimonials'] 
      },
      { 
        keywords: ['contact', 'reach', 'email', 'phone', 'call', 'get in touch'], 
        intent: 'contact', 
        actions: ['View contact info', 'Fill contact form', 'Schedule meeting'] 
      },
      { 
        keywords: ['about', 'company', 'team', 'who', 'background', 'story'], 
        intent: 'about', 
        actions: ['Learn about us', 'Meet the team', 'View testimonials'] 
      },
      { 
        keywords: ['technology', 'tech stack', 'programming', 'framework'], 
        intent: 'technology', 
        actions: ['View tech stack', 'See expertise', 'Learn about tools'] 
      },
      { 
        keywords: ['auralis', 'ai', 'assistant', 'chatbot'], 
        intent: 'auralis', 
        actions: ['Learn about Auralis', 'See capabilities', 'How it works'] 
      }
    ];

    for (const intentData of intents) {
      if (intentData.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return {
          intent: intentData.intent,
          confidence: 0.9,
          entities: intentData.keywords.filter(k => lowerMessage.includes(k)),
          suggestedActions: intentData.actions
        };
      }
    }

    return {
      intent: 'general',
      confidence: 0.5,
      entities: [],
      suggestedActions: ['Explore services', 'View portfolio', 'Contact us']
    };
  }

  findRelevantKnowledge(message: string, intent: IntentDetection): KnowledgeItem[] {
    const relevantItems: KnowledgeItem[] = [];
    const lowerMessage = message.toLowerCase();

    // First, try to find knowledge based on intent category
    const intentBased = this.knowledgeBase.filter(item => item.category === intent.intent);
    relevantItems.push(...intentBased);

    // Then, search for keyword matches
    this.knowledgeBase.forEach(item => {
      if (item.keywords.some(keyword => lowerMessage.includes(keyword))) {
        // Only add if not already included
        if (!relevantItems.some(existing => existing.id === item.id)) {
          relevantItems.push(item);
        }
      }
    });

    // If no relevant items found, return a few general ones
    if (relevantItems.length === 0) {
      relevantItems.push(...this.knowledgeBase.slice(0, 3));
    }

    return relevantItems.slice(0, 3); // Limit to 3 items
  }

  generateResponse(message: string): { response: string; suggestions: string[] } {
    // Detect intent
    const intent = this.detectIntent(message);
    
    // Find relevant knowledge
    const relevantKnowledge = this.findRelevantKnowledge(message, intent);
    
    // Generate response based on intent and knowledge
    let response = '';
    let suggestions: string[] = [];

    switch (intent.intent) {
      case 'pricing':
        response = "We offer flexible pricing models including fixed-price, time & materials, and dedicated team options. Our pricing is customized based on project scope and requirements. For example, a basic website starts at $2,500+, while enterprise solutions start at $15,000+. Contact us for a free consultation to discuss your specific needs and get a customized quote.";
        suggestions = ['Schedule Consultation', 'View Pricing Tiers', 'See Portfolio Examples'];
        break;
        
      case 'services':
        response = "We offer comprehensive technology services including: Custom Software Development, Web Application Development, Mobile App Development (iOS & Android), E-commerce Solutions, Cloud Services & Migration, API Development & Integration, Database Design & Management, UI/UX Design, Quality Assurance & Testing, DevOps & CI/CD, Digital Marketing Solutions, and IT Consulting. Which service interests you most?";
        suggestions = ['Web Development', 'Mobile Apps', 'Cloud Solutions'];
        break;
        
      case 'portfolio':
        response = "Our portfolio includes 120+ successful projects in healthcare, finance, e-commerce, education, and logistics. We've delivered solutions for startups to enterprise clients, focusing on innovation and measurable results. Some highlights include a healthcare management system serving 500K+ users and an e-commerce platform processing $10M+ in annual transactions.";
        suggestions = ['View Case Studies', 'See Client Testimonials', 'Explore Technologies'];
        break;
        
      case 'contact':
        response = "You can reach us through our contact form, email us at Info@limitlessinfotech.com, or call us at +91 7710909492. Our team typically responds within 2 hours during business hours. We're located in Mumbai, Maharashtra, India, and serve clients globally. How would you prefer to get in touch?";
        suggestions = ['Fill Contact Form', 'Schedule Meeting', 'Send Email'];
        break;
        
      case 'about':
        response = "Limitless Infotech Solution Pvt. Ltd. is a cutting-edge technology company founded by Faisal Khan in 2018. We specialize in innovative software development, web applications, mobile apps, and digital transformation. With a team of 50+ experts, we've delivered 120+ projects globally, partnering with startups and enterprises alike. Our mission is to empower businesses with limitless possibilities through technology.";
        suggestions = ['Meet Our Team', 'Company Story', 'Awards & Certifications'];
        break;
        
      case 'technology':
        response = "We work with modern technologies including JavaScript/TypeScript, Python, Java, PHP, React, Angular, Vue.js, Node.js, Express, Django, Spring Boot, MongoDB, PostgreSQL, MySQL, AWS, Azure, Docker, Kubernetes, and more. Our tech stack is carefully selected to ensure we deliver scalable, secure, and high-performance solutions tailored to your business needs.";
        suggestions = ['View Full Tech Stack', 'See Project Examples', 'Learn About Our Process'];
        break;
        
      case 'auralis':
        response = "Auralis is our AI-powered assistant, representing innovation, intelligence, and seamless user interaction. Auralis serves as the intelligent interface for website & enterprise solutions, powered by advanced AI technology. With continuous self-learning and self-improvement capabilities, Auralis provides personalized assistance and maintains the 'Limitless Brain' knowledge base for comprehensive support. I'm Auralis, and I'm here to help you!";
        suggestions = ['See Auralis Capabilities', 'Try Auralis Features', 'Learn About AI Solutions'];
        break;
        
      default:
        // Use relevant knowledge to generate a response
        if (relevantKnowledge.length > 0) {
          response = relevantKnowledge.map(item => item.content).join(' ');
        } else {
          response = "Hello! I'm Auralis, your AI assistant from Limitless Infotech. I'm here to help you learn about our services, portfolio, and how we can help transform your business with cutting-edge technology solutions. What would you like to know?";
        }
        suggestions = ['Explore Services', 'View Portfolio', 'Contact Us'];
    }

    // Add context from relevant knowledge if not already covered
    if (relevantKnowledge.length > 0 && !response.includes(relevantKnowledge[0].content.substring(0, 50))) {
      response += " " + relevantKnowledge[0].content;
    }

    return { response, suggestions };
  }

  async saveChatMessage(sessionId: string, sender: 'user' | 'bot', content: string, suggestions?: string[]) {
    try {
      const { error } = await supabase.from('chat_messages').insert({
        session_id: sessionId,
        sender,
        content,
        suggestions
      });

      if (error) {
        console.error('Failed to save chat message:', error);
      }
    } catch (error) {
      console.error('Error saving chat message:', error);
    }
  }

  async createSession(): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({})
        .select('id')
        .single();

      if (error) {
        console.error('Failed to create chat session:', error);
        // Generate a fallback session ID
        return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      }

      return data.id;
    } catch (error) {
      console.error('Error creating chat session:', error);
      // Generate a fallback session ID
      return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
  }

  async getChatHistory(sessionId: string): Promise<ChatMessage[]> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('timestamp', { ascending: true });

      if (error) {
        console.error('Failed to fetch chat history:', error);
        return [];
      }

      return data as ChatMessage[];
    } catch (error) {
      console.error('Error fetching chat history:', error);
      return [];
    }
  }
}
