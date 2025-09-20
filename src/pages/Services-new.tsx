import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import CardEnhanced from '../components/ui/Card-enhanced';
import EnhancedModal from '../components/portfolio/EnhancedModal';

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

const Services: React.FC = () => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState('web');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    organizationName: '',
    contactName: '',
    email: '',
    industry: '',
    serviceInterest: '',
    projectScale: '',
    projectVision: '',
    preferredContact: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const serviceCategories = [
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

  const addOnServices = [
    {
      id: 'logo-brand-identity',
      name: 'Logo & Brand Identity Design',
      tagline: 'Craft iconic brand identities that reflect your global vision.',
      icon: 'PenTool',
      link: '/services/logo-design'
    },
    {
      id: 'email-hosting',
      name: 'Email Hosting & Business Communication',
      tagline: 'Enterprise-grade email security, simplified.',
      icon: 'Mail',
      link: '/services/email-hosting'
    },
    {
      id: 'custom-crm',
      name: 'Custom CRM Solutions',
      tagline: 'Tailored customer relationship management.',
      icon: 'Database',
      link: '/services/custom-crm'
    },
    {
      id: 'business-management',
      name: 'Business Management Tools',
      tagline: 'Track KPIs & empower decisions with intuitive tools.',
      icon: 'Settings',
      link: '/services/business-tools'
    },
    {
      id: 'erp',
      name: 'Enterprise Resource Planning (ERP)',
      tagline: 'Unifying business operations under one roof.',
      icon: 'Building',
      link: '/services/erp'
    },
    {
      id: 'custom-solution',
      name: 'Looking for Something Else?',
      tagline: 'Enterprise needs are unique. Let\'s tailor a solution just for you.',
      icon: 'MessageCircle',
      link: '#quote-form'
    }
  ];

  const testimonials = [
    {
      id: '1',
      name: 'CTO, Global Logistics Corp',
      content: 'IFM transformed our supply chain with AI automation—we cut errors by 55% in 6 months.',
      avatar: '/images/avatar-1.jpg'
    },
    {
      id: '2',
      name: 'CIO, Retail Giant Inc',
      content: 'Their cloud migration saved us $2M/year—we couldn\'t ask for a better enterprise partner.',
      avatar: '/images/avatar-2.jpg'
    }
  ];

  const handleServiceClick = (service: ServiceItem) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.organizationName.trim()) {
      errors.organizationName = 'Organization name is required';
    } else if (formData.organizationName.length < 2) {
      errors.organizationName = 'Organization name must be at least 2 characters';
    }

    if (!formData.contactName.trim()) {
      errors.contactName = 'Your full name is required';
    } else if (formData.contactName.length < 2) {
      errors.contactName = 'Full name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Work email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email must be valid (e.g., john@company.com)';
    }

    if (!formData.industry) {
      errors.industry = 'Industry selection is required';
    }

    if (!formData.serviceInterest) {
      errors.serviceInterest = 'Primary service need is required';
    }

    if (!formData.projectScale) {
      errors.projectScale = 'Project scale is required';
    }

    if (!formData.projectVision.trim()) {
      errors.projectVision = 'Project vision is required';
    } else if (formData.projectVision.length < 75) {
      errors.projectVision = 'Project vision needs at least 75 characters';
    }

    if (!formData.preferredContact) {
      errors.preferredContact = 'Preferred contact method is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch('/api/submit-service-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormSubmitted(true);
        // Reset form after 3 seconds
        setTimeout(() => {
          setFormSubmitted(false);
          setFormData({
            organizationName: '',
            contactName: '',
            email: '',
            industry: '',
            serviceInterest: '',
            projectScale: '',
            projectVision: '',
            preferredContact: ''
          });
        }, 3000);
      } else {
        setFormErrors({ submit: 'Failed to submit form. Please try again.' });
      }
    } catch (error) {
      setFormErrors({ submit: 'Network error. Please check your connection and try again.' });
    }
  };

  const toggleServiceExpansion = (serviceId: string) => {
    setExpandedService(expandedService === serviceId ? null : serviceId);
  };

  const scrollToForm = () => {
    document.getElementById('quote-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <header className="section-padding relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #1A237E 0%, #303F9F 100%)'
      }}>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/20 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container-custom text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl lg:text-6xl font-bold mb-6 text-white"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Our Services — Elevate Your Enterprise with Cutting-Edge Innovation
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed mb-8"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            From digital transformation to AI-driven ecosystems, we deliver tailored solutions that scale with your business, enhance efficiency, and position you as an industry leader.
          </motion.p>

          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="inline-block bg-white text-[#1A237E] px-6 py-3 rounded-lg font-bold text-lg mb-8 shadow-lg"
            style={{
              backgroundColor: '#D4AF37',
              color: 'white',
              border: '2px solid #D4AF37',
              boxShadow: '0 4px 8px rgba(212, 175, 55, 0.3)'
            }}
          >
            Trusted by 50+ Global Enterprises
          </motion.div>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            onClick={scrollToForm}
            className="bg-[#D4AF37] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#F5A623] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Explore Our Solutions →
          </motion.button>
        </div>

        {/* Tech Partner Logos */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:flex space-x-8 opacity-60">
          {/* Placeholder logos - would be replaced with actual SVG logos */}
          <div className="w-8 h-8 bg-white/20 rounded"></div>
          <div className="w-8 h-8 bg-white/20 rounded"></div>
          <div className="w-8 h-8 bg-white/20 rounded"></div>
          <div className="w-8 h-8 bg-white/20 rounded"></div>
          <div className="w-8 h-8 bg-white/20 rounded"></div>
        </div>
      </header>

      {/* Main Services Grid (Core Services) */}
      <section id="main-services-grid" className="section-padding">
        <div className="container-custom">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl lg:text-4xl font-bold text-center mb-12"
          >
            Comprehensive Service Solutions
          </motion.h2>

          {/* View Toggle and Category Tabs */}
          <div className="flex flex-col items-center gap-6 mb-12">
            {/* View Toggle */}
            <div className="flex items-center gap-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  viewMode === 'grid'
                    ? 'bg-[#D4AF37] text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]'
                }`}
              >
                <Icons.Grid3X3 className="w-4 h-4" />
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  viewMode === 'list'
                    ? 'bg-[#D4AF37] text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]'
                }`}
              >
                <Icons.List className="w-4 h-4" />
                List
              </button>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-2">
              {serviceCategories.map((category) => {
                const CategoryIcon = Icons[category.icon as keyof typeof Icons] || Icons.Code;
                const isActive = activeCategory === category.id;

                return (
                  <motion.button
                    key={category.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center gap-3 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-[#D4AF37] text-white shadow-lg scale-105'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]'
                    }`}
                  >
                    <CategoryIcon className="w-5 h-5" />
                    {category.name}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Services Display */}
          <motion.div
            key={`${activeCategory}-${viewMode}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}
          >
            {serviceCategories
              .find(cat => cat.id === activeCategory)
              ?.services.map((service, index) => {
                const Icon = Icons[service.icon as keyof typeof Icons] || Icons.Code;
                const isExpanded = expandedService === service.id;

                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <CardEnhanced
                      variant='elevated'
                      hover='lift'
                      className={`cursor-pointer group ${viewMode === 'grid' ? 'h-full p-8' : 'p-6'}`}
                      onClick={() => viewMode === 'list' ? toggleServiceExpansion(service.id) : handleServiceClick(service)}
                    >
                      {viewMode === 'grid' ? (
                        <div className="flex flex-col items-center text-center space-y-6">
                          <div className="p-4 bg-[#D4AF37]/10 rounded-2xl group-hover:bg-[#D4AF37]/20 transition-colors">
                            <Icon className="w-12 h-12 text-[#D4AF37]" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold mb-3">{service.name}</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">{service.tagline}</p>
                            <button className="px-6 py-3 bg-[#D4AF37] text-white rounded-lg hover:bg-[#D4AF37]/90 transition-colors font-medium">
                              Learn More
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="p-3 bg-[#D4AF37]/10 rounded-2xl group-hover:bg-[#D4AF37]/20 transition-colors flex-shrink-0">
                                <Icon className="w-8 h-8 text-[#D4AF37]" />
                              </div>
                              <div>
                                <h3 className="text-xl font-bold mb-1">{service.name}</h3>
                                <p className="text-gray-600 dark:text-gray-300">{service.tagline}</p>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleServiceExpansion(service.id);
                              }}
                              className="p-2 hover:bg-[#D4AF37]/10 rounded-lg transition-colors"
                            >
                              <Icons.ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                          </div>

                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="space-y-6 pt-4 border-t border-gray-200 dark:border-gray-700"
                            >
                              <p className="text-gray-700 dark:text-gray-300">{service.description}</p>

                              {service.whatsIncluded && (
                                <div>
                                  <h4 className="font-bold mb-3 text-[#D4AF37]">What's Included</h4>
                                  <ul className="space-y-2">
                                    {service.whatsIncluded.map((item, idx) => (
                                      <li key={idx} className="flex items-start gap-2">
                                        <Icons.Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-gray-600 dark:text-gray-300">{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {service.featuredProducts && service.featuredProducts.length > 0 && (
                                <div>
                                  <h4 className="font-bold mb-3 text-[#D4AF37]">Featured Products</h4>
                                  <div className="space-y-2">
                                    {service.featuredProducts.map((product, idx) => (
                                      <a
                                        key={idx}
                                        href={product.link}
                                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-[#D4AF37]/5 transition-colors"
                                      >
                                        <Icons.Package className="w-4 h-4 text-[#D4AF37]" />
                                        <div>
                                          <div className="font-medium text-sm">{product.name}</div>
                                          <div className="text-xs text-gray-500 dark:text-gray-400">{product.description}</div>
                                        </div>
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {service.referenceMaterials && service.referenceMaterials.length > 0 && (
                                <div>
                                  <h4 className="font-bold mb-3 text-[#D4AF37]">Reference Materials</h4>
                                  <div className="space-y-2">
                                    {service.referenceMaterials.map((material, idx) => (
                                      <a
                                        key={idx}
                                        href={material.link}
                                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-[#D4AF37]/5 transition-colors"
                                      >
                                        {material.type === 'case-study' && <Icons.FileText className="w-4 h-4 text-[#D4AF37]" />}
                                        {material.type === 'demo' && <Icons.Play className="w-4 h-4 text-[#D4AF37]" />}
                                        {material.type === 'blog' && <Icons.BookOpen className="w-4 h-4 text-[#D4AF37]" />}
                                        {material.type === 'brochure' && <Icons.Download className="w-4 h-4 text-[#D4AF37]" />}
                                        <div>
                                          <div className="font-medium text-sm">{material.title}</div>
                                          <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{material.type.replace('-', ' ')}</div>
                                        </div>
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div className="flex gap-3 pt-4">
                                <button
                                  onClick={() => handleServiceClick(service)}
                                  className="px-6 py-3 bg-[#D4AF37] text-white rounded-lg hover:bg-[#D4AF37]/90 transition-colors font-medium"
                                >
                                  Learn More
                                </button>
                                <button className="px-6 py-3 border border-[#D4AF37] text-[#D4AF37] rounded-lg hover:bg-[#D4AF37] hover:text-white transition-colors font-medium">
                                  Get Quote
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      )}
                    </CardEnhanced>
                  </motion.div>
                );
              })}
          </motion.div>
        </div>
      </section>

      {/* Add-On Services Section */}
      <section className="section-padding bg-gray-bg dark:bg-gray-900/50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-4">Complementary Services: Enhance Your Enterprise Ecosystem</h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            Strengthen your foundation with premium add-ons that align with your unique goals.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addOnServices.map((service, index) => {
              const Icon = Icons[service.icon as keyof typeof Icons] || Icons.Code;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <CardEnhanced
                    variant='outlined'
                    hover='glow'
                    className="p-6 cursor-pointer group"
                    onClick={() => service.id === 'custom-solution' ? scrollToForm() : window.open(service.link, '_blank')}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-[#D4AF37]/10 rounded-lg group-hover:bg-[#D4AF37]/20 transition-colors">
                        <Icon className="w-6 h-6 text-[#D4AF37]" />
                      </div>
                      <div>
                        <h4 className="font-bold mb-1">{service.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{service.tagline}</p>
                      </div>
                    </div>
                  </CardEnhanced>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose IFM for Your Enterprise?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {[
              { icon: 'Lightbulb', title: 'Innovation at Scale', desc: 'Leverage AI, cloud, and emerging tech for enterprise challenges.' },
              { icon: 'Shield', title: 'Security First', desc: 'Military-grade encryption & compliance (GDPR, SOC 2, HIPAA).' },
              { icon: 'Headphones', title: 'Dedicated Support', desc: '24/7 account managers with SLA-backed response times.' },
              { icon: 'Wrench', title: 'Custom Built', desc: 'No \'one-size-fits-all\'—solutions tailored to your workflows.' },
              { icon: 'Trophy', title: 'Proven Results', desc: '95% client retention & average 40% efficiency gains.' }
            ].map((item, index) => {
              const Icon = (Icons as any)[item.icon] || Icons.Code;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="p-4 bg-[#D4AF37]/10 rounded-2xl w-fit mx-auto mb-4">
                    <Icon className="w-8 h-8 text-[#D4AF37]" />
                  </div>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="section-padding bg-gray-50 dark:bg-gray-800/50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Trusted by
