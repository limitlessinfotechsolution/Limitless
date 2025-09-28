import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChatContext, IntentDetection, EscalationData } from '../types/chat';

// Initialize Supabase client if environment variables are available
const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  : null;

// Initialize Google AI client
const genAI = process.env.GOOGLE_AI_API_KEY
  ? new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY)
  : null;

interface KnowledgeItem {
  content: string;
  category: string;
}

// Enhanced AI Response Generator with Auralis Protocol
export class AuralisAI {
  private knowledgeBase: KnowledgeItem[] = [];
  private context: ChatContext | null = null;
  private messageHistory: string[] = [];
  private intentHistory: IntentDetection[] = [];

  async loadKnowledgeBase() {
    if (this.knowledgeBase.length === 0 && supabase) {
      try {
        const { data, error } = await supabase
          .from('knowledge_base')
          .select('content, category');
        if (!error && data) {
          this.knowledgeBase = data;
        }
      } catch {
        console.warn('Failed to load knowledge base from database');
      }
    }
    return this.knowledgeBase;
  }

  setContext(context: ChatContext) {
    this.context = context;
  }

  addToHistory(message: string, intent?: IntentDetection) {
    this.messageHistory.push(message);
    if (intent) this.intentHistory.push(intent);
  }

  // Auto-fetch user location and context
  private async autoFetchUserContext(): Promise<{ location?: string; timezone?: string; preferences?: string[] }> {
    try {
      // Auto-fetch IP-based location (in a real implementation, this would call a geolocation API)
      const context = {
        location: 'Unknown',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        preferences: ['web_development', 'pricing']
      };

      // In a real implementation, you would fetch from an IP geolocation service
      // For now, we'll simulate auto-detection
      if (typeof window !== 'undefined') {
        // Try to get location from browser APIs
        if (navigator.geolocation) {
          try {
            await new Promise<GeolocationPosition>((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
            });
            // In a real app, you'd reverse geocode the coordinates to get country
            context.location = 'Detected';
          } catch {
            // Location access denied or unavailable
          }
        }
      }

      return context;
    } catch {
      return { location: 'Unknown', timezone: 'UTC', preferences: [] };
    }
  }

  // Auto-fetch relevant knowledge base entries
  private async autoFetchKnowledge(query: string): Promise<string[]> {
    const relevantItems: string[] = [];

    // Auto-fetch from knowledge base based on query
    if (this.knowledgeBase.length > 0) {
      const lowerQuery = query.toLowerCase();
      const matches = this.knowledgeBase.filter(item =>
        lowerQuery.includes(item.category.toLowerCase()) ||
        item.content.toLowerCase().includes(lowerQuery) ||
        item.category.toLowerCase().includes(lowerQuery)
      );

      matches.forEach(item => relevantItems.push(item.content));
    }

    // Auto-fetch from predefined knowledge if database is empty
    if (relevantItems.length === 0) {
      const autoKnowledge: { [key: string]: string[] } = {
        'pricing': [
          'Our pricing is project-based and customized to your specific needs.',
          'We offer flexible payment terms including installments and milestones.',
          'All projects include 30-day post-launch support at no extra cost.'
        ],
        'timeline': [
          'Simple websites: 2-4 weeks',
          'Complex applications: 3-6 months',
          'Enterprise solutions: 6+ months'
        ],
        'technology': [
          'React, Next.js, Node.js, Python, AI/ML',
          'Cloud services: AWS, Azure, GCP',
          'Mobile: React Native, Flutter, Swift, Kotlin'
        ]
      };

      const lowerQuery = query.toLowerCase();
      for (const [category, items] of Object.entries(autoKnowledge)) {
        if (lowerQuery.includes(category)) {
          relevantItems.push(...items);
        }
      }
    }

    return relevantItems.slice(0, 3); // Limit to 3 items
  }

  // Phase 1: Intent Detection & Analysis with Auto-fetch
  detectIntent(message: string): IntentDetection {
    const lowerMessage = message.toLowerCase();

    const intents = [
      { keywords: ['pricing', 'cost', 'fee', 'price', 'budget', 'quote', 'how much', 'payment', 'invoice'], intent: 'pricing', actions: ['Show pricing tiers', 'Schedule consultation', 'Compare plans'] },
      { keywords: ['service', 'offer', 'provide', 'do', 'what do you do', 'capabilities', 'expertise'], intent: 'services', actions: ['View services', 'Get portfolio', 'Contact for custom solution'] },
      { keywords: ['portfolio', 'work', 'project', 'case study', 'examples', 'previous work'], intent: 'portfolio', actions: ['Browse portfolio', 'View case studies', 'See testimonials'] },
      { keywords: ['contact', 'reach', 'email', 'phone', 'call', 'get in touch', 'connect'], intent: 'contact', actions: ['View contact info', 'Fill contact form', 'Schedule meeting'] },
      { keywords: ['about', 'company', 'team', 'who', 'background', 'story', 'history'], intent: 'about', actions: ['Learn about us', 'Meet the team', 'View testimonials'] },
      { keywords: ['faq', 'question', 'help', 'support', 'how to', 'guide'], intent: 'faq', actions: ['Browse FAQ', 'Search knowledge base', 'Contact support'] },
      { keywords: ['demo', 'trial', 'test', 'try', 'show me', 'see'], intent: 'demo', actions: ['Schedule demo', 'Request trial', 'View product tour'] },
      { keywords: ['integration', 'api', 'connect', 'sync', 'third party', 'external'], intent: 'integration', actions: ['View integrations', 'API documentation', 'Setup guide'] },
      { keywords: ['web', 'website', 'site', 'online presence'], intent: 'web_development', actions: ['View web services', 'See examples', 'Get quote'] },
      { keywords: ['mobile', 'app', 'ios', 'android', 'application'], intent: 'mobile_development', actions: ['View mobile apps', 'See app examples', 'Get quote'] },
      { keywords: ['ai', 'artificial intelligence', 'automation', 'chatbot', 'machine learning'], intent: 'ai_solutions', actions: ['Learn about AI services', 'See AI examples', 'Discuss automation'] },
      { keywords: ['hire', 'work with', 'partner', 'collaboration', 'employment'], intent: 'partnership', actions: ['View partnership options', 'Schedule meeting', 'Discuss opportunities'] },
    ];

    for (const intentData of intents) {
      if (intentData.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return {
          intent: intentData.intent,
          confidence: 0.8,
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

  // Phase 2: Contextual Welcome Messages
  generateContextualWelcome(currentPage: string = '/'): { message: string; suggestions: string[] } {
    const page = currentPage.toLowerCase();

    if (page.includes('/pricing')) {
      return {
        message: "Welcome to our Pricing page! I'm Auralis from Limitless Infotech. Our pricing is customized based on your needs. Most users ask about plan differences—would you like a quick comparison or help choosing the right tier?",
        suggestions: ['Compare pricing plans', 'Get a custom quote', 'See pricing FAQ']
      };
    }

    if (page.includes('/services')) {
      return {
        message: "Exploring our Services? Hi, I'm Auralis! We offer web development, mobile apps, custom software, CRM, and AI automation. Which service interests you most?",
        suggestions: ['Web Development details', 'Mobile App services', 'Custom Software solutions']
      };
    }

    if (page.includes('/portfolio')) {
      return {
        message: "Checking out our Portfolio? Welcome! I'm Auralis. We've delivered 120+ projects across education, finance, healthcare, and technology. Want to see projects in a specific industry?",
        suggestions: ['Education projects', 'Finance solutions', 'Healthcare tech']
      };
    }

    if (page.includes('/contact')) {
      return {
        message: "Ready to get in touch? Hi, I'm Auralis! We love hearing from potential clients. Our team typically responds within 2 hours. How can we help transform your business?",
        suggestions: ['Schedule a consultation', 'Request a quote', 'General inquiry']
      };
    }

    if (page.includes('/about')) {
      return {
        message: "Learning about Limitless Infotech? Hello, I'm Auralis! We're where innovation meets execution, serving 28K+ users with 98% client retention. Curious about our team or story?",
        suggestions: ['Meet our team', 'Company story', 'Client testimonials']
      };
    }

    // Default welcome
    return {
      message: "Hello! I'm Auralis, your AI assistant from Limitless Infotech. I see you're on our website—let me help you find what you need. What brings you here today?",
      suggestions: ['Explore services', 'View portfolio', 'Get pricing info']
    };
  }

  // Phase 3: Enhanced Response Generation
  async generateResponse(message: string, intent: IntentDetection): Promise<string> {
    await this.loadKnowledgeBase();

    const lowerMessage = message.toLowerCase();

    // Handle specific intents with enhanced responses
    switch (intent.intent) {
      case 'pricing': {
        // Location-based pricing detection
        const hasLocation = lowerMessage.includes('india') || lowerMessage.includes('indian') ||
                           lowerMessage.includes('us') || lowerMessage.includes('usa') || lowerMessage.includes('america') ||
                           lowerMessage.includes('uk') || lowerMessage.includes('united kingdom') ||
                           lowerMessage.includes('europe') || lowerMessage.includes('eu') ||
                           lowerMessage.includes('canada') || lowerMessage.includes('australia');

        let baseMultiplier = 1;
        let currency = 'USD';
        let locationNote = '';

        if (lowerMessage.includes('india') || lowerMessage.includes('indian')) {
          baseMultiplier = 0.4; // 60% discount for India
          currency = 'USD';
          locationNote = ' (with special rates for Indian clients)';
        } else if (lowerMessage.includes('us') || lowerMessage.includes('usa') || lowerMessage.includes('america')) {
          baseMultiplier = 1;
          currency = 'USD';
          locationNote = ' (USD pricing)';
        } else if (lowerMessage.includes('uk') || lowerMessage.includes('united kingdom')) {
          baseMultiplier = 0.8;
          currency = 'GBP';
          locationNote = ' (GBP pricing)';
        } else if (lowerMessage.includes('europe') || lowerMessage.includes('eu')) {
          baseMultiplier = 0.9;
          currency = 'EUR';
          locationNote = ' (EUR pricing)';
        } else if (lowerMessage.includes('canada')) {
          baseMultiplier = 0.95;
          currency = 'CAD';
          locationNote = ' (CAD pricing)';
        } else if (lowerMessage.includes('australia')) {
          baseMultiplier = 0.9;
          currency = 'AUD';
          locationNote = ' (AUD pricing)';
        }

        const starterPrice = Math.round(2500 * baseMultiplier);
        const professionalPrice = Math.round(7500 * baseMultiplier);
        const enterprisePrice = Math.round(15000 * baseMultiplier);

        if (lowerMessage.includes('starter') || lowerMessage.includes('basic')) {
          return `Our Starter package starts at ${currency} ${starterPrice.toLocaleString()}${locationNote} and includes a basic website with responsive design and SEO setup. It's perfect for small businesses getting started online. Would you like me to schedule a consultation to discuss your specific needs?`;
        }
        if (lowerMessage.includes('professional') || lowerMessage.includes('advanced')) {
          return `The Professional package at ${currency} ${professionalPrice.toLocaleString()}${locationNote} includes advanced website development, comprehensive SEO, analytics setup, and 24/7 support. It's ideal for growing businesses that need robust online presence. I can help you compare this with our other packages.`;
        }
        if (lowerMessage.includes('enterprise') || lowerMessage.includes('custom')) {
          return `Our Enterprise solutions start at ${currency} ${enterprisePrice.toLocaleString()}${locationNote} and are fully customized to your business requirements. This includes custom software development, advanced integrations, and dedicated support. Let's discuss your project scope for a precise quote.`;
        }

        let pricingResponse = `Our pricing is customized based on your project scope and requirements${locationNote}. We offer three main tiers:\n\n`;
        pricingResponse += `• Starter: ${currency} ${starterPrice.toLocaleString()}+\n`;
        pricingResponse += `• Professional: ${currency} ${professionalPrice.toLocaleString()}+\n`;
        pricingResponse += `• Enterprise: ${currency} ${enterprisePrice.toLocaleString()}+\n\n`;
        pricingResponse += `Each package can be tailored to your needs. What type of project are you interested in?`;

        if (hasLocation) {
          pricingResponse += `\n\nNote: Pricing may vary based on local market conditions and project complexity.`;
        }

        return pricingResponse;
      }

      case 'services': {
        if (lowerMessage.includes('web') || lowerMessage.includes('website')) {
          return "We specialize in modern web development using React, Next.js, and other cutting-edge technologies. Our websites are fast, responsive, and SEO-optimized. We can build anything from simple landing pages to complex e-commerce platforms. What kind of website do you need?";
        }
        if (lowerMessage.includes('mobile') || lowerMessage.includes('app')) {
          return "We develop native and cross-platform mobile apps for iOS and Android. Using React Native and Flutter, we create high-performance apps with great user experiences. Our mobile solutions include offline functionality, push notifications, and seamless integrations.";
        }
        if (lowerMessage.includes('ai') || lowerMessage.includes('automation')) {
          return "Our AI and automation solutions help businesses streamline operations and improve efficiency. We implement chatbots, predictive analytics, workflow automation, and intelligent data processing. Auralis, our AI assistant, is a great example of our AI capabilities!";
        }
        return "We offer comprehensive digital solutions including web development, mobile apps, custom software, CRM systems, AI automation, and digital marketing. Each service is tailored to your business goals. Which area interests you most?";
      }

      case 'portfolio': {
        if (lowerMessage.includes('education') || lowerMessage.includes('school')) {
          return "We've developed several education technology solutions, including learning management systems, student portals, and interactive educational platforms. One notable project was a comprehensive e-learning platform for a university with 10,000+ users. Would you like to see more education projects?";
        }
        if (lowerMessage.includes('finance') || lowerMessage.includes('bank')) {
          return "Our finance projects include secure banking applications, fintech platforms, and financial management systems. We prioritize security and compliance in all our financial solutions. We recently completed a digital banking platform that handles millions in transactions daily.";
        }
        if (lowerMessage.includes('healthcare') || lowerMessage.includes('medical')) {
          return "In healthcare, we've built patient management systems, telemedicine platforms, and health monitoring applications. All our healthcare solutions comply with HIPAA and other regulations. One project involved creating a comprehensive hospital management system.";
        }
        return "We've successfully delivered 120+ projects across education, finance, healthcare, e-commerce, and technology sectors. Our portfolio showcases our expertise in modern technologies and our commitment to quality. Would you like to explore projects in a specific industry?";
      }

      case 'contact':
        return "You can reach us through our contact form, email us at info@limitlessinfotech.com, or call us at +1 (555) 123-4567. Our team typically responds within 2 hours during business hours. We offer free initial consultations to discuss your project. How would you like to get in touch?";

      case 'about':
        return "Limitless Infotech is where innovation meets execution. Founded with a vision to transform businesses through technology, we've grown to serve 28K+ users with a 98% client retention rate. Our team combines technical expertise with business acumen to deliver exceptional results. Learn more about our story and values on our About page.";

      case 'faq':
        return "You can find answers to common questions in our FAQ section. We cover topics like our development process, pricing, timelines, support, and technical specifications. If you don't find what you're looking for, feel free to ask me directly!";

      case 'demo':
        return "We offer personalized demos tailored to your business needs. During a demo, we'll showcase relevant technologies, discuss your requirements, and demonstrate how our solutions can benefit your organization. Schedule a demo through our contact form or by calling us directly.";

      case 'integration':
        return "We provide seamless integrations with popular platforms including payment gateways (Stripe, PayPal), CRM systems (Salesforce, HubSpot), marketing tools (Google Analytics, Mailchimp), and enterprise software (SAP, Oracle). Our API-first approach ensures smooth data flow and scalability. What systems do you need to integrate with?";

      case 'web_development':
        if (lowerMessage.includes('ecommerce') || lowerMessage.includes('shop')) {
          return "We build robust e-commerce platforms using Shopify, WooCommerce, or custom solutions with React/Next.js. Our e-commerce sites include secure payment processing, inventory management, and analytics. We can integrate with major payment gateways and shipping providers.";
        }
        if (lowerMessage.includes('cms') || lowerMessage.includes('content')) {
          return "We develop custom CMS solutions and headless CMS implementations using Strapi, Contentful, or custom-built systems. Our CMS platforms are user-friendly, SEO-optimized, and scalable for growing content needs.";
        }
        return "Our web development expertise spans modern frameworks like React, Next.js, Vue.js, and traditional technologies. We create responsive, fast-loading websites with excellent SEO performance. Services include custom web applications, progressive web apps (PWAs), and API development.";

      case 'mobile_development':
        if (lowerMessage.includes('ios')) {
          return "We develop native iOS applications using Swift and SwiftUI, following Apple's design guidelines and best practices. Our iOS apps are optimized for performance and user experience, with seamless integration to iOS services.";
        }
        if (lowerMessage.includes('android')) {
          return "We build native Android applications using Kotlin and Jetpack Compose, ensuring compatibility across devices and Android versions. Our Android apps leverage the latest platform features for optimal performance.";
        }
        return "We create cross-platform mobile applications using React Native and Flutter, allowing deployment to both iOS and Android from a single codebase. Our mobile solutions include offline functionality, push notifications, and native device integrations.";

      case 'ai_solutions':
        if (lowerMessage.includes('chatbot')) {
          return "Our AI chatbots like Auralis use natural language processing to provide intelligent customer support, lead generation, and user engagement. We integrate chatbots with your existing systems for seamless automation.";
        }
        if (lowerMessage.includes('predictive') || lowerMessage.includes('analytics')) {
          return "We implement predictive analytics solutions using machine learning algorithms to help businesses forecast trends, optimize operations, and make data-driven decisions. Our AI models are trained on your specific data for accurate insights.";
        }
        return "Our AI solutions include intelligent automation, predictive analytics, natural language processing, and computer vision. We help businesses automate workflows, gain insights from data, and enhance customer experiences through AI-powered applications.";

      case 'partnership':
        if (lowerMessage.includes('hire') || lowerMessage.includes('work')) {
          return "We're always looking for talented individuals to join our team! We offer competitive salaries, remote work options, and opportunities for growth. Check our careers page for current openings or send us your resume.";
        }
        return "We partner with businesses of all sizes to transform their operations through technology. Our partnership models include project-based engagements, retainer agreements, and strategic alliances. Let's discuss how we can collaborate on your next project.";

      default: {
        // Try Google AI for general queries if available
        if (genAI) {
          try {
            const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

            const systemPrompt = `You are Auralis, an AI assistant for Limitless Infotech, a software development company specializing in web development, mobile apps, AI automation, and digital transformation.

Company Information:
- We offer web development, mobile apps, custom software, CRM systems, AI automation
- Technologies: React, Next.js, Node.js, Python, AI/ML, cloud services (AWS, Azure, GCP)
- Project timelines: Simple websites (2-4 weeks), complex apps (3-6 months), enterprise (6+ months)
- Pricing: Customized based on project scope, with special rates for Indian clients
- Support: Comprehensive post-launch support including bug fixes and updates

Key Services:
- Web Development: React, Next.js, responsive design, SEO optimization, e-commerce
- Mobile Development: iOS, Android, React Native, Flutter
- AI Solutions: Chatbots, predictive analytics, workflow automation
- Custom Software: CRM systems, enterprise applications

Always be helpful, professional, and focus on how we can help transform businesses through technology. If the user asks about something not related to our services, politely redirect to our expertise areas.

User message: "${message}"

Provide a helpful, contextual response based on our services and capabilities.`;

            const result = await model.generateContent(systemPrompt);
            const aiResponse = result.response.text();

            if (aiResponse && aiResponse.trim().length > 0) {
              return aiResponse;
            }
          } catch (error) {
            console.warn('Google AI generation failed, falling back to predefined responses:', error);
          }
        }

        // Enhanced fallback responses based on keywords
        if (lowerMessage.includes('technology') || lowerMessage.includes('tech')) {
          return "We stay at the forefront of technology trends, specializing in React, Next.js, Node.js, Python, AI/ML, cloud services (AWS, Azure, GCP), and modern development practices. What specific technology interests you?";
        }

        if (lowerMessage.includes('timeline') || lowerMessage.includes('time') || lowerMessage.includes('duration')) {
          return "Project timelines vary based on complexity and scope. Simple websites take 2-4 weeks, complex applications 3-6 months, and enterprise solutions 6+ months. We provide detailed timelines during our consultation process.";
        }

        if (lowerMessage.includes('support') || lowerMessage.includes('maintenance')) {
          return "We provide comprehensive post-launch support including bug fixes, updates, performance monitoring, and feature enhancements. Our support packages range from basic maintenance to 24/7 dedicated support.";
        }

        if (lowerMessage.includes('security') || lowerMessage.includes('secure')) {
          return "Security is paramount in our development process. We implement industry-standard security practices including SSL/TLS encryption, secure authentication, data validation, and regular security audits. All our solutions comply with GDPR and other regulations.";
        }

        // Fallback to knowledge base search
        const relevantKnowledge = this.knowledgeBase.filter(item =>
          lowerMessage.includes(item.category.toLowerCase()) ||
          item.content.toLowerCase().includes(lowerMessage)
        );

        if (relevantKnowledge.length > 0) {
          return relevantKnowledge[0].content;
        }

        // Generic helpful response
        return "I'd be happy to help you learn more about Limitless Infotech and our services. We specialize in web development, mobile apps, AI automation, and digital transformation. What specific information are you looking for?";
      }
    }
  }

  // Phase 4: Complexity Detection & Escalation
  detectComplexity(message: string, messageCount: number): EscalationData | null {
    const lowerMessage = message.toLowerCase();

    // High priority triggers
    if (lowerMessage.includes('urgent') || lowerMessage.includes('emergency') || lowerMessage.includes('critical')) {
      return {
        reason: 'Urgent request detected',
        priority: 'high',
        contextSummary: `User reported urgent issue: "${message}". Message count: ${messageCount}`,
        userDetails: {}
      };
    }

    // Medium priority - complex technical issues
    if (lowerMessage.includes('error') || lowerMessage.includes('bug') || lowerMessage.includes('not working')) {
      return {
        reason: 'Technical issue reported',
        priority: 'medium',
        contextSummary: `Technical problem: "${message}". Session messages: ${messageCount}`,
        userDetails: {}
      };
    }

    // Medium priority - repeated questions
    if (messageCount > 5 && this.intentHistory.length > 2) {
      const recentIntents = this.intentHistory.slice(-3);
      const uniqueIntents = new Set(recentIntents.map(i => i.intent));
      if (uniqueIntents.size === 1) {
        return {
          reason: 'Repeated questions on same topic',
          priority: 'medium',
          contextSummary: `User has asked ${messageCount} messages, mostly about ${Array.from(uniqueIntents)[0]}`,
          userDetails: {}
        };
      }
    }

    return null;
  }

  // Phase 5: Proactive Suggestions
  generateProactiveSuggestions(intent: IntentDetection, context: ChatContext): string[] {
    const suggestions: string[] = [];

    switch (intent.intent) {
      case 'pricing':
        suggestions.push('Compare pricing plans', 'Schedule consultation', 'View pricing FAQ');
        break;
      case 'services':
        suggestions.push('View our portfolio', 'Schedule demo', 'Get custom quote');
        break;
      case 'portfolio':
        suggestions.push('View case studies', 'Contact for similar project', 'See testimonials');
        break;
      case 'contact':
        suggestions.push('Fill contact form', 'Call us directly', 'Schedule meeting');
        break;
      case 'about':
        suggestions.push('Meet our team', 'View company story', 'See client testimonials');
        break;
      case 'web_development':
        suggestions.push('View web portfolio', 'Get website quote', 'See tech stack');
        break;
      case 'mobile_development':
        suggestions.push('View mobile apps', 'iOS vs Android guide', 'Get app quote');
        break;
      case 'ai_solutions':
        suggestions.push('See AI examples', 'Discuss automation needs', 'Schedule AI demo');
        break;
      case 'partnership':
        suggestions.push('View partnership options', 'Schedule meeting', 'Explore collaboration');
        break;
      case 'integration':
        suggestions.push('View integration options', 'API documentation', 'Setup guide');
        break;
      case 'demo':
        suggestions.push('Schedule personalized demo', 'View product tour', 'See live examples');
        break;
      case 'faq':
        suggestions.push('Browse FAQ section', 'Contact support', 'Search knowledge base');
        break;
      default:
        suggestions.push('Explore services', 'View portfolio', 'Contact us');
    }

    // Add contextual suggestions based on page
    if (context?.currentPage) {
      const page = context.currentPage.toLowerCase();
      if (page.includes('/services')) {
        suggestions.unshift('Get detailed service info');
      } else if (page.includes('/portfolio')) {
        suggestions.unshift('Explore case studies');
      } else if (page.includes('/contact')) {
        suggestions.unshift('Schedule consultation');
      } else if (page.includes('/about')) {
        suggestions.unshift('Learn our story');
      }
    }

    return suggestions.slice(0, 6); // Limit to 6 suggestions
  }

  // Phase 3.5: Enhanced Response with Suggestions
  async generateResponseWithSuggestions(message: string): Promise<{ response: string; suggestions: string[] }> {
    const intent = this.detectIntent(message);
    const response = await this.generateResponse(message, intent);
    const suggestions = this.generateProactiveSuggestions(intent, this.context || {
      currentPage: '/',
      userAgent: '',
      sessionStartTime: '',
      messageCount: 0,
      lastActivity: ''
    });
    return { response, suggestions };
  }
}
