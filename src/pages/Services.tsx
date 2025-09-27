import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

// Add missing icons
const { Shield, HeadphonesIcon, Wifi, Clock, Link, DollarSign, BarChart, Brain, ArrowUpDown, Layers, Eye } = Icons;
import CardEnhanced from '../components/ui/Card-enhanced';
import InteractiveParticleBackground from '../components/ui/InteractiveParticleBackground';
import TestimonialsCarousel from '../components/home/TestimonialsCarousel';
import ClientLogos from '../components/home/ClientLogos';

interface ServiceItem {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  description?: string;
  benefits?: string[];
  deliverables?: string[];
  caseStudy?: string;
  whatsIncluded?: string[];
  featuredProducts?: { name: string; description: string; link: string }[];
  referenceMaterials?: { type: string; title: string; link: string }[];
}

interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  services: ServiceItem[];
}

// Helper functions for dynamic content
const getWhyChooseUsPoints = (categoryId: string) => {
  const pointsMap: { [key: string]: { title: string; description: string; icon: React.ReactNode }[] } = {
    web: [
      { title: 'Enterprise-Grade Security', description: 'Bank-level security with SSL, encryption, and compliance standards', icon: <Icons.Shield className="w-6 h-6" /> },
      { title: 'Scalable Architecture', description: 'Built to grow with your business from day one', icon: <Icons.TrendingUp className="w-6 h-6" /> },
      { title: 'Modern Tech Stack', description: 'Latest frameworks and technologies for optimal performance', icon: <Icons.Code className="w-6 h-6" /> },
      { title: '24/7 Support', description: 'Round-the-clock technical support and maintenance', icon: <Icons.HeadphonesIcon className="w-6 h-6" /> }
    ],
    mobile: [
      { title: 'Cross-Platform Expertise', description: 'Native iOS, Android, and cross-platform solutions', icon: <Icons.Smartphone className="w-6 h-6" /> },
      { title: 'App Store Optimization', description: 'Maximize visibility and downloads in app stores', icon: <Icons.Star className="w-6 h-6" /> },
      { title: 'Offline-First Design', description: 'Apps that work seamlessly with or without internet', icon: <Icons.Wifi className="w-6 h-6" /> },
      { title: 'Performance Focused', description: 'Lightning-fast apps with smooth user experiences', icon: <Icons.Zap className="w-6 h-6" /> }
    ],
    business: [
      { title: 'Industry Expertise', description: 'Deep understanding of business processes and workflows', icon: <Icons.Building className="w-6 h-6" /> },
      { title: 'Rapid Implementation', description: 'Quick deployment with minimal business disruption', icon: <Icons.Clock className="w-6 h-6" /> },
      { title: 'Integration Ready', description: 'Seamless connection with existing business systems', icon: <Icons.Link className="w-6 h-6" /> },
      { title: 'ROI Focused', description: 'Solutions designed to deliver measurable business value', icon: <Icons.DollarSign className="w-6 h-6" /> }
    ],
    ai: [
      { title: 'Cutting-Edge AI', description: 'Latest machine learning and AI technologies', icon: <Icons.Bot className="w-6 h-6" /> },
      { title: 'Data-Driven Insights', description: 'Transform raw data into actionable business intelligence', icon: <Icons.BarChart className="w-6 h-6" /> },
      { title: 'Custom AI Models', description: 'Tailored AI solutions for your specific business needs', icon: <Icons.Brain className="w-6 h-6" /> },
      { title: 'Ethical AI', description: 'Responsible AI development with transparency and fairness', icon: <Icons.CheckCircle className="w-6 h-6" /> }
    ],
    cloud: [
      { title: '99.9% Uptime SLA', description: 'Guaranteed high availability for critical business operations', icon: <Icons.Cloud className="w-6 h-6" /> },
      { title: 'Auto-Scaling', description: 'Automatically adjust resources based on demand', icon: <Icons.ArrowUpDown className="w-6 h-6" /> },
      { title: 'Multi-Cloud Strategy', description: 'Avoid vendor lock-in with flexible cloud architecture', icon: <Icons.Layers className="w-6 h-6" /> },
      { title: '24/7 Monitoring', description: 'Proactive monitoring and instant issue resolution', icon: <Icons.Eye className="w-6 h-6" /> }
    ]
  };
  return pointsMap[categoryId] || pointsMap.web;
};

const getProcessSteps = (categoryId: string) => {
  const processMap: { [key: string]: { title: string; description: string }[] } = {
    web: [
      { title: 'Discovery & Planning', description: 'Requirements gathering, technical analysis, and project roadmap creation' },
      { title: 'Design & Architecture', description: 'UI/UX design, system architecture, and technology stack selection' },
      { title: 'Development', description: 'Agile development with regular reviews and quality assurance' },
      { title: 'Testing & QA', description: 'Comprehensive testing, security audits, and performance optimization' },
      { title: 'Deployment & Support', description: 'Production deployment, training, and ongoing maintenance' }
    ],
    mobile: [
      { title: 'Market Research', description: 'User research, competitor analysis, and feature prioritization' },
      { title: 'UI/UX Design', description: 'Mobile-first design, prototyping, and user testing' },
      { title: 'Development', description: 'Native or cross-platform development with regular iterations' },
      { title: 'Testing', description: 'Device testing, performance optimization, and app store preparation' },
      { title: 'Launch & Growth', description: 'App store submission, marketing, and user acquisition' }
    ],
    business: [
      { title: 'Business Analysis', description: 'Process mapping, requirements gathering, and solution design' },
      { title: 'System Design', description: 'Architecture planning, integration design, and data modeling' },
      { title: 'Implementation', description: 'Development, testing, and user acceptance testing' },
      { title: 'Training & Change Management', description: 'User training, documentation, and organizational change support' },
      { title: 'Go-Live & Optimization', description: 'Production deployment, monitoring, and continuous improvement' }
    ],
    ai: [
      { title: 'Data Assessment', description: 'Data quality analysis, availability assessment, and requirements gathering' },
      { title: 'Model Design', description: 'AI/ML model selection, architecture design, and feasibility analysis' },
      { title: 'Development & Training', description: 'Model development, training, validation, and optimization' },
      { title: 'Integration & Testing', description: 'System integration, performance testing, and validation' },
      { title: 'Deployment & Monitoring', description: 'Production deployment, monitoring, and model maintenance' }
    ],
    cloud: [
      { title: 'Assessment & Planning', description: 'Current infrastructure analysis and migration strategy development' },
      { title: 'Architecture Design', description: 'Cloud architecture design, security planning, and cost optimization' },
      { title: 'Migration Execution', description: 'Data migration, application deployment, and testing' },
      { title: 'Optimization', description: 'Performance tuning, cost optimization, and monitoring setup' },
      { title: 'Management & Support', description: 'Ongoing management, updates, and technical support' }
    ]
  };
  return processMap[categoryId] || processMap.web;
};

const Services: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('web');
  const [expandedService, setExpandedService] = useState<string | null>(null);

  const serviceCategories: ServiceCategory[] = [
    {
      id: 'web',
      name: 'Web Solutions',
      icon: 'Globe',
      description: 'Enterprise-Grade Digital Experiences Built to Thrive Globally.',
      services: [
        {
          id: 'custom-software-dev',
          name: 'Custom Software Development',
          tagline: 'Tailored software solutions designed to optimize business workflows.',
          icon: 'Code',
          description: 'Empowering your business with bespoke software that adapts to your unique operational needs and drives efficiency.',
          whatsIncluded: [
            'Scalable architectures built for growth',
            'Seamless API integration capabilities',
            'Cloud-ready deployment solutions',
            'Custom UI/UX design and implementation',
            'Comprehensive testing and quality assurance',
            'Ongoing maintenance and support'
          ],
          featuredProducts: [
            { name: 'WorkTrack', description: 'Project & Task Management System', link: '/products/worktrack' },
            { name: 'HRIMS', description: 'HR & Employee Management System', link: '/products/hrims' }
          ],
          referenceMaterials: [
            { type: 'case-study', title: 'E-commerce Platform Success', link: '/case-studies/ecommerce-platform' },
            { type: 'demo', title: 'Custom Software Demo', link: '/demos/custom-software' },
            { type: 'brochure', title: 'Enterprise Solutions PDF', link: '/downloads/enterprise-solutions.pdf' }
          ],
          benefits: ['Process Automation', 'Cost Reduction', 'Scalability', 'Competitive Advantage'],
          deliverables: ['Custom Software', 'API Documentation', 'User Training', 'Support Package'],
          caseStudy: 'Reduced operational costs by 35% with automated workflow solutions.'
        },
        {
          id: 'web-app-development',
          name: 'Web Application Development',
          tagline: 'Modern web apps that deliver exceptional user experiences.',
          icon: 'Globe',
          description: 'Building powerful web applications that engage users and drive business results across all devices.',
          whatsIncluded: [
            'Responsive web application development',
            'Progressive Web App (PWA) capabilities',
            'Real-time data synchronization',
            'Advanced security implementations',
            'Performance optimization',
            'Cross-browser compatibility'
          ],
          featuredProducts: [
            { name: 'Limitless Web ERP', description: 'Enterprise Resource Planning', link: '/products/web-erp' }
          ],
          referenceMaterials: [
            { type: 'case-study', title: 'SaaS Platform Growth', link: '/case-studies/saas-platform' },
            { type: 'demo', title: 'Web App Interactive Demo', link: '/demos/web-app' }
          ],
          benefits: ['Enhanced User Experience', 'Increased Engagement', 'Mobile Accessibility', 'SEO Benefits'],
          deliverables: ['Web Application', 'Admin Dashboard', 'User Documentation', 'Training Sessions'],
          caseStudy: 'Achieved 200% user engagement increase with modern web application redesign.'
        },
        {
          id: 'ui-ux-design-services',
          name: 'UI/UX Design Services',
          tagline: 'Creating interfaces that delight users and drive conversions.',
          icon: 'Palette',
          description: 'User-centered design that creates intuitive, engaging digital experiences that convert visitors into customers.',
          whatsIncluded: [
            'Comprehensive user research and analysis',
            'Wireframing and prototyping',
            'Interactive design mockups',
            'Usability testing and validation',
            'Design system creation',
            'Accessibility compliance (WCAG 2.1)'
          ],
          featuredProducts: [
            { name: 'Design Studio Pro', description: 'Advanced Design Tools', link: '/products/design-studio' }
          ],
          referenceMaterials: [
            { type: 'case-study', title: 'Mobile App UX Transformation', link: '/case-studies/mobile-ux' },
            { type: 'blog', title: 'UI/UX Best Practices Guide', link: '/blog/ui-ux-best-practices' }
          ],
          benefits: ['Improved Conversion Rates', 'Enhanced User Satisfaction', 'Reduced Bounce Rates', 'Brand Consistency'],
          deliverables: ['Design System', 'UI Mockups', 'Interactive Prototype', 'Design Guidelines'],
          caseStudy: 'Increased conversion rates by 150% with user-centered design approach.'
        }
      ]
    },
    {
      id: 'mobile',
      name: 'Mobile Ecosystems',
      icon: 'Smartphone',
      description: 'Native and cross-platform mobile applications that deliver exceptional user experiences.',
      services: [
        {
          id: 'mobile-app-development',
          name: 'Mobile App Development',
          tagline: 'Seamless mobile experiences for iOS & Android.',
          icon: 'Smartphone',
          description: 'Native and cross-platform mobile applications that deliver exceptional user experiences.',
          benefits: ['Cross-Platform', 'Native Performance', 'Offline Support', 'App Store Optimization'],
          deliverables: ['Mobile App', 'Backend API', 'Push Notifications', 'Analytics Integration'],
          caseStudy: 'Launched app that reached 50K downloads in first month.'
        },
        {
          id: 'cross-platform-development',
          name: 'Cross-Platform Development',
          tagline: 'One codebase, multiple platforms.',
          icon: 'Tablet',
          description: 'Efficient cross-platform development using React Native and Flutter.',
          benefits: ['Cost Effective', 'Faster Development', 'Unified Experience', 'Easy Maintenance'],
          deliverables: ['Cross-Platform App', 'Code Reusability', 'Platform Optimization', 'Update Management'],
          caseStudy: 'Reduced development time by 60% with cross-platform approach.'
        },
        {
          id: 'mobile-ui-enhancements',
          name: 'Mobile UI/UX Enhancements',
          tagline: 'Elevate your mobile user experience.',
          icon: 'Sparkles',
          description: 'Specialized mobile interface design and user experience improvements.',
          benefits: ['Mobile-First Design', 'Touch Optimization', 'Gesture Support', 'Performance Focus'],
          deliverables: ['Mobile UI Redesign', 'UX Improvements', 'Performance Optimization', 'User Testing'],
          caseStudy: 'Increased mobile user retention by 45% with enhanced UX.'
        }
      ]
    },
    {
      id: 'business',
      name: 'Business Operations',
      icon: 'Building',
      description: 'Streamlined systems to manage operations across departments.',
      services: [
        {
          id: 'crm-task-management',
          name: 'CRM & Task Management',
          tagline: 'Smarter workflows. Stronger client relationships.',
          icon: 'Users',
          description: 'Comprehensive CRM and task management solutions to streamline business operations.',
          benefits: ['Lead Management', 'Task Automation', 'Reporting Dashboard', 'Team Collaboration'],
          deliverables: ['CRM System', 'Workflow Automation', 'Custom Dashboards', 'Training & Support'],
          caseStudy: 'Improved team productivity by 35% with automated task management.'
        },
        {
          id: 'business-management-tools',
          name: 'Business Management Tools',
          tagline: 'Streamline operations with smart tools.',
          icon: 'Settings',
          description: 'Custom business management tools to optimize workflows and productivity.',
          benefits: ['Process Automation', 'Data Analytics', 'Custom Dashboards', 'Integration Ready'],
          deliverables: ['Management Software', 'Workflow Tools', 'Analytics Platform', 'Training Program'],
          caseStudy: 'Streamlined operations for 200+ employees with custom management tools.'
        },
        {
          id: 'erp-systems',
          name: 'Enterprise Resource Planning (ERP)',
          tagline: 'Unifying business operations under one roof.',
          icon: 'Building',
          description: 'Comprehensive ERP solutions to integrate and manage all business processes.',
          benefits: ['Unified System', 'Real-time Data', 'Scalable Architecture', 'Industry Compliance'],
          deliverables: ['ERP Implementation', 'Data Migration', 'Staff Training', 'Ongoing Support'],
          caseStudy: 'Integrated 15 departments under single ERP system, improving efficiency by 40%.'
        }
      ]
    },
    {
      id: 'ai',
      name: 'AI & Automation',
      icon: 'Bot',
      description: 'AI-powered automation solutions that transform business processes.',
      services: [
        {
          id: 'business-automation-ai',
          name: 'Business Automation & AI',
          tagline: 'Automating today, innovating tomorrow.',
          icon: 'Zap',
          description: 'AI-powered automation solutions that transform business processes and decision-making.',
          benefits: ['Process Automation', 'AI Integration', 'Data Analytics', 'Predictive Insights'],
          deliverables: ['Automation Workflows', 'AI Models', 'Analytics Dashboard', 'Performance Monitoring'],
          caseStudy: 'Reduced operational costs by 30% with AI-driven automation.'
        },
        {
          id: 'ai-machine-learning',
          name: 'AI & Machine Learning',
          tagline: 'AI models that learn, adapt, and optimize.',
          icon: 'Bot',
          description: 'Advanced AI and machine learning solutions for data-driven business intelligence.',
          benefits: ['Predictive Analytics', 'Natural Language Processing', 'Computer Vision', 'Recommendation Systems'],
          deliverables: ['AI Models', 'Data Pipeline', 'ML Training', 'Model Deployment'],
          caseStudy: 'Increased sales by 25% with AI-powered recommendation engine.'
        },
        {
          id: 'predictive-analytics',
          name: 'Predictive Analytics & Data Solutions',
          tagline: 'Turn data into actionable insights.',
          icon: 'TrendingUp',
          description: 'Advanced analytics and data solutions for informed business decision-making.',
          benefits: ['Data Visualization', 'Predictive Modeling', 'Real-time Analytics', 'Custom Reports'],
          deliverables: ['Analytics Platform', 'Data Dashboards', 'Predictive Models', 'Training & Support'],
          caseStudy: 'Improved decision-making accuracy by 50% with predictive analytics.'
        }
      ]
    },
    {
      id: 'cloud',
      name: 'Cloud Infrastructure',
      icon: 'Cloud',
      description: 'Secure, scalable cloud infrastructure and migration services.',
      services: [
        {
          id: 'cloud-solutions',
          name: 'Cloud Solutions',
          tagline: 'Secure, scalable, and always connected.',
          icon: 'Cloud',
          description: 'Cloud infrastructure and migration services for reliable, scalable business operations.',
          benefits: ['High Availability', 'Auto Scaling', 'Security Compliance', 'Cost Optimization'],
          deliverables: ['Cloud Migration', 'Infrastructure Setup', 'Monitoring & Alerts', 'Disaster Recovery'],
          caseStudy: 'Achieved 99.9% uptime with cloud infrastructure migration.'
        },
        {
          id: 'devops-infrastructure',
          name: 'DevOps & Infrastructure Setup',
          tagline: 'Streamlined development and deployment.',
          icon: 'Server',
          description: 'Complete DevOps solutions and infrastructure setup for modern development workflows.',
          benefits: ['CI/CD Pipelines', 'Infrastructure as Code', 'Monitoring & Logging', 'Security Automation'],
          deliverables: ['DevOps Setup', 'Infrastructure Automation', 'Monitoring Systems', 'Security Implementation'],
          caseStudy: 'Reduced deployment time from days to hours with DevOps implementation.'
        },
        {
          id: 'email-hosting',
          name: 'Email Hosting & Business Communication',
          tagline: 'Professional-grade communication, simplified.',
          icon: 'Mail',
          description: 'Enterprise-grade email hosting and business communication solutions.',
          benefits: ['99.9% Uptime', 'Advanced Security', 'Large Storage', 'Mobile Access'],
          deliverables: ['Email Setup', 'Domain Configuration', 'Security Implementation', 'Migration Support'],
          caseStudy: 'Improved email deliverability and security for 500+ users.'
        }
      ]
    }
  ];

  // Get icon component safely
  const renderIcon = (iconName: string) => {
    // Create a map of icon names to components for type safety
    const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
      Code: Icons.Code,
      Globe: Icons.Globe,
      Palette: Icons.Palette,
      Smartphone: Icons.Smartphone,
      Tablet: Icons.Tablet,
      Sparkles: Icons.Sparkles,
      Users: Icons.Users,
      Settings: Icons.Settings,
      Building: Icons.Building,
      Bot: Icons.Bot,
      Zap: Icons.Zap,
      TrendingUp: Icons.TrendingUp,
      Cloud: Icons.Cloud,
      Server: Icons.Server,
      Mail: Icons.Mail,
      Database: Icons.Database,
      PenTool: Icons.PenTool,
      MessageCircle: Icons.MessageCircle,
      HelpCircle: Icons.HelpCircle,
      CheckCircle: Icons.CheckCircle,
      Star: Icons.Star,
      Award: Icons.Award,
      ChevronUp: Icons.ChevronUp,
      ChevronDown: Icons.ChevronDown
    };
    
    const IconComponent = iconMap[iconName];
    if (IconComponent) {
      return <IconComponent className="w-8 h-8" />;
    }
    return <Icons.HelpCircle className="w-8 h-8" />;
  };

  const currentCategory = serviceCategories.find(cat => cat.id === activeCategory) || serviceCategories[0];

  return (
    <div className="pt-20">
      {/* Enhanced Header */}
      <header className="section-padding relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-accent/5 dark:from-gray-900 dark:via-gray-800 dark:to-accent/10">
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ 
            backgroundImage: `radial-gradient(circle at 25% 25%, #D4AF37 0%, transparent 50%), 
                            radial-gradient(circle at 75% 75%, #1A237E 0%, transparent 50%)` 
          }}></div>
        </div>
        
        {/* Interactive Particle Background */}
        <InteractiveParticleBackground
          particleCount={50}
          className="absolute inset-0"
        />
        
        <div className="container-custom relative z-10 text-center">
          <motion.h1 
            className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-accent to-accent-orange bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Our Services
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Comprehensive digital solutions tailored to elevate your business. From concept to deployment, we deliver excellence.
          </motion.p>
        </div>
      </header>

      {/* Category Navigation */}
      <section className="section-padding bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {serviceCategories.map((category) => {
              // Create a map of icon names to components for type safety
              const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
                Code: Icons.Code,
                Globe: Icons.Globe,
                Palette: Icons.Palette,
                Smartphone: Icons.Smartphone,
                Tablet: Icons.Tablet,
                Sparkles: Icons.Sparkles,
                Users: Icons.Users,
                Settings: Icons.Settings,
                Building: Icons.Building,
                Bot: Icons.Bot,
                Zap: Icons.Zap,
                TrendingUp: Icons.TrendingUp,
                Cloud: Icons.Cloud,
                Server: Icons.Server,
                Mail: Icons.Mail
              };
              
              const IconComponent = iconMap[category.icon];
              return (
                <motion.button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'bg-gradient-to-r from-accent to-accent-orange text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {IconComponent && <IconComponent className="w-5 h-5" />}
                  {category.name}
                </motion.button>
              );
            })}
          </div>

          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              {currentCategory.name}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {currentCategory.description}
            </p>
          </motion.div>

          {/* Services Grid - Enhanced with better alignment and card design */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentCategory.services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="h-full"
              >
                <CardEnhanced
                  variant="elevated"
                  hover="lift"
                  className="h-full p-6 border border-gray-200/50 dark:border-gray-700/50 flex flex-col group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-gradient-to-br from-accent/20 to-accent-orange/20 p-3 rounded-lg transition-all duration-300 group-hover:from-accent/30 group-hover:to-accent-orange/30">
                      {renderIcon(service.icon)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {service.name}
                      </h3>
                      <p className="text-accent text-sm font-medium">
                        {service.tagline}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6 flex-grow">
                    {service.description}
                  </p>
                  
                  <div className="mt-auto">
                    <button
                      onClick={() => setExpandedService(expandedService === service.id ? null : service.id)}
                      className="w-full bg-gradient-to-r from-accent to-accent-orange text-white py-2 rounded-lg font-semibold hover:from-accent/90 hover:to-accent-orange/90 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      {expandedService === service.id ? 'Show Less' : 'Learn More'}
                      {expandedService === service.id ? (
                        <Icons.ChevronUp className="w-4 h-4" />
                      ) : (
                        <Icons.ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  
                  {expandedService === service.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
                    >
                      {service.whatsIncluded && (
                        <div className="mb-6">
                          <h4 className="font-bold text-gray-900 dark:text-white mb-3">What's Included</h4>
                          <ul className="space-y-2">
                            {service.whatsIncluded.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <Icons.CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-600 dark:text-gray-300">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {service.benefits && (
                        <div className="mb-6">
                          <h4 className="font-bold text-gray-900 dark:text-white mb-3">Key Benefits</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {service.benefits.map((benefit, idx) => (
                              <div key={idx} className="flex items-center gap-2 bg-accent/5 dark:bg-accent/10 px-3 py-2 rounded-lg transition-colors duration-300 hover:bg-accent/10 dark:hover:bg-accent/20">
                                <Icons.Star className="w-4 h-4 text-accent" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{benefit}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {service.caseStudy && (
                        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800/50">
                          <div className="flex items-start gap-3">
                            <Icons.Award className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                            <div>
                              <h5 className="font-bold text-gray-900 dark:text-white">Success Story</h5>
                              <p className="text-gray-700 dark:text-gray-300 text-sm">{service.caseStudy}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex gap-3">
                        <button className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white py-2 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          View Details
                        </button>
                        <button className="flex-1 bg-gradient-to-r from-accent to-accent-orange text-white py-2 rounded-lg font-semibold hover:from-accent/90 hover:to-accent-orange/90 transition-all duration-300">
                          Get Started
                        </button>
                      </div>
                    </motion.div>
                  )}
                </CardEnhanced>
              </motion.div>
            ))}
          </div>

          {/* Why Choose Us Section */}
          <div className="mt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Why Choose Limitless Infotech?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                What sets us apart in delivering exceptional {currentCategory.name.toLowerCase()} solutions
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {getWhyChooseUsPoints(activeCategory).map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <CardEnhanced variant="elevated" className="text-center p-6 h-full">
                    <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-orange rounded-lg flex items-center justify-center mx-auto mb-4">
                      {point.icon}
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">{point.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{point.description}</p>
                  </CardEnhanced>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Process Section */}
          <div className="mt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Our Proven Process
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                A systematic approach that ensures quality, efficiency, and successful outcomes
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {getProcessSteps(activeCategory).map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent-orange rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                      {index + 1}
                    </div>
                    {index < getProcessSteps(activeCategory).length - 1 && (
                      <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-accent to-accent-orange transform -translate-x-8"></div>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="mt-20">
            <TestimonialsCarousel />
          </div>

          {/* Client Logos Section */}
          <div className="mt-20">
            <ClientLogos />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
