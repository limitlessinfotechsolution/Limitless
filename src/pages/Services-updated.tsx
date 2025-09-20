import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import CardEnhanced from '../components/ui/Card-enhanced';
import EnhancedModal from '../components/portfolio/EnhancedModal';
import ServiceRequestForm from '../components/services/ServiceRequestForm-updated';

interface ServiceItem {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  description: string;
  benefits: string[];
  techStack: string[];
  deliverables: string[];
  caseStudy: {
    title: string;
    client: string;
    results: string[];
  };
}

const Services: React.FC = () => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [showModal, setShowModal] = useState(false);

  const services: ServiceItem[] = [
    {
      id: 'web-development',
      name: 'Web Development',
      tagline: 'Scalable websites & web apps built with precision, performance, and security.',
      icon: 'Globe',
      description: 'Custom web solutions built for scalability and performance. We create modern, responsive websites and web applications that drive business growth and deliver exceptional user experiences.',
      benefits: ['Scalable Architecture', 'Performance Optimized', 'Security First', 'Mobile Responsive', 'SEO Ready'],
      techStack: ['React', 'Next.js', 'Node.js', 'Laravel', 'PostgreSQL', 'AWS'],
      deliverables: ['Custom Web Application', 'Admin Dashboard', 'API Documentation', 'Performance Audit', 'Security Implementation'],
      caseStudy: {
        title: 'E-commerce Platform Transformation',
        client: 'TechCorp Inc.',
        results: ['300% increase in conversion rate', '50% reduction in load times', '99.9% uptime achieved']
      }
    },
    {
      id: 'consulting-strategy',
      name: 'Consulting & Strategy',
      tagline: 'Expert guidance to align technology with your business goals.',
      icon: 'Lightbulb',
      description: 'Strategic technology consulting to help you navigate digital transformation. We provide expert guidance on technology adoption, process optimization, and digital strategy development.',
      benefits: ['Strategic Roadmap', 'Technology Assessment', 'Process Optimization', 'Risk Mitigation', 'Competitive Advantage'],
      techStack: ['Digital Strategy', 'Process Analysis', 'Technology Assessment', 'Change Management'],
      deliverables: ['Strategic Roadmap', 'Technology Assessment Report', 'Implementation Plan', 'ROI Analysis'],
      caseStudy: {
        title: 'Digital Transformation Strategy',
        client: 'Global Logistics Corp',
        results: ['35% cost reduction', '60% faster decision making', '200% ROI in first year']
      }
    },
    {
      id: 'ui-ux-design',
      name: 'UI/UX Design',
      tagline: 'User-focused, modern, and intuitive interfaces that enhance engagement.',
      icon: 'Palette',
      description: 'User-centered design that creates intuitive, engaging digital experiences that convert visitors into customers. Our design process focuses on usability, accessibility, and brand consistency.',
      benefits: ['User-Centered Design', 'Accessibility Compliant', 'Brand Consistency', 'Conversion Optimized', 'Mobile-First Approach'],
      techStack: ['Figma', 'Adobe Creative Suite', 'Sketch', 'InVision', 'Principle'],
      deliverables: ['UI/UX Design System', 'Interactive Prototypes', 'User Journey Maps', 'Design Guidelines', 'Usability Testing Report'],
      caseStudy: {
        title: 'Mobile App Redesign',
        client: 'Retail Giant Inc',
        results: ['150% increase in user engagement', '45% reduction in bounce rate', '300% more app downloads']
      }
    },
    {
      id: 'mobile-app-development',
      name: 'Mobile App Development',
      tagline: 'High-performance Android & iOS apps tailored to your audience.',
      icon: 'Smartphone',
      description: 'Native and cross-platform mobile applications that deliver exceptional user experiences. We build apps that engage users, drive retention, and achieve business objectives.',
      benefits: ['Native Performance', 'Cross-Platform', 'Offline Support', 'App Store Optimization', 'Push Notifications'],
      techStack: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'App Store Connect'],
      deliverables: ['Mobile Application', 'Backend API', 'Admin Panel', 'Push Notification Setup', 'App Store Submission'],
      caseStudy: {
        title: 'Fitness App Launch',
        client: 'HealthTech Solutions',
        results: ['50K downloads in first month', '4.8 star rating', '85% user retention rate']
      }
    },
    {
      id: 'custom-software',
      name: 'Custom Software & Systems',
      tagline: 'Bespoke software solutions engineered to solve your unique challenges.',
      icon: 'Code',
      description: 'Tailored software solutions designed to optimize business workflows and solve complex challenges. From enterprise systems to specialized tools, we build software that scales with your business.',
      benefits: ['Custom Workflow Automation', 'Scalable Architecture', 'Integration Ready', 'Cost Effective', 'Future-Proof'],
      techStack: ['Python', 'Node.js', 'React', 'PostgreSQL', 'Docker', 'Kubernetes'],
      deliverables: ['Custom Software Solution', 'API Integration', 'User Training', 'Documentation', 'Support Package'],
      caseStudy: {
        title: 'Inventory Management System',
        client: 'Manufacturing Corp',
        results: ['40% reduction in inventory costs', '60% faster order processing', '95% accuracy improvement']
      }
    },
    {
      id: 'crm-task-management',
      name: 'CRM & Task Management',
      tagline: 'Streamlined customer and workflow management systems that boost productivity.',
      icon: 'Users',
      description: 'Comprehensive CRM and task management solutions to streamline business operations and improve customer relationships. Automate workflows, track performance, and drive team productivity.',
      benefits: ['Lead Management', 'Task Automation', 'Performance Analytics', 'Team Collaboration', 'Customer Insights'],
      techStack: ['Laravel', 'React', 'PostgreSQL', 'Redis', 'WebSockets', 'REST APIs'],
      deliverables: ['CRM System', 'Task Management Dashboard', 'Workflow Automation', 'Reporting Tools', 'Mobile App'],
      caseStudy: {
        title: 'Sales Team Productivity Boost',
        client: 'B2B Services Inc',
        results: ['35% increase in team productivity', '50% faster lead conversion', '25% revenue growth']
      }
    },
    {
      id: 'business-automation',
      name: 'Business Automation & AI',
      tagline: 'AI-powered tools to reduce manual work and accelerate decision-making.',
      icon: 'Zap',
      description: 'AI-powered automation solutions that transform business processes and decision-making. Reduce manual work, improve accuracy, and accelerate growth with intelligent automation.',
      benefits: ['Process Automation', 'AI Integration', 'Data Analytics', 'Predictive Insights', 'Cost Reduction'],
      techStack: ['Python', 'TensorFlow', 'OpenAI API', 'Zapier', 'Make.com', 'Custom AI Models'],
      deliverables: ['Automation Workflows', 'AI Models', 'Analytics Dashboard', 'Training Data', 'Performance Monitoring'],
      caseStudy: {
        title: 'Customer Service Automation',
        client: 'E-commerce Platform',
        results: ['70% reduction in response time', '90% customer satisfaction', '$500K annual savings']
      }
    },
    {
      id: 'cloud-solutions',
      name: 'Cloud Solutions',
      tagline: 'Reliable, secure, and scalable cloud infrastructure for enterprises.',
      icon: 'Cloud',
      description: 'Secure, scalable cloud infrastructure and migration services for reliable business operations. From cloud migration to infrastructure optimization, we ensure your business stays agile and secure.',
      benefits: ['High Availability', 'Auto Scaling', 'Security Compliance', 'Cost Optimization', 'Disaster Recovery'],
      techStack: ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform'],
      deliverables: ['Cloud Migration', 'Infrastructure Setup', 'Monitoring & Alerts', 'Security Implementation', 'Cost Optimization'],
      caseStudy: {
        title: 'Cloud Migration Success',
        client: 'Financial Services Corp',
        results: ['99.9% uptime achieved', '40% cost reduction', '50% faster deployment']
      }
    },
    {
      id: 'ai-machine-learning',
      name: 'AI & Machine Learning',
      tagline: 'Next-gen AI models that learn, adapt, and optimize your business processes.',
      icon: 'Bot',
      description: 'Advanced AI and machine learning solutions for data-driven business intelligence. Build predictive models, automate decisions, and unlock insights from your data.',
      benefits: ['Predictive Analytics', 'Natural Language Processing', 'Computer Vision', 'Recommendation Systems', 'Automated Insights'],
      techStack: ['Python', 'TensorFlow', 'PyTorch', 'OpenAI', 'Hugging Face', 'Custom ML Models'],
      deliverables: ['AI Models', 'Data Pipeline', 'ML Training', 'Model Deployment', 'Performance Monitoring'],
      caseStudy: {
        title: 'Recommendation Engine',
        client: 'E-commerce Giant',
        results: ['25% increase in sales', '35% higher customer satisfaction', '60% more personalized recommendations']
      }
    }
  ];

  const addOnServices = [
    {
      id: 'logo-brand-identity',
      name: 'Logo & Brand Identity Design',
      tagline: 'Crafting unique, timeless logos and visual identities that define your brand.',
      icon: 'PenTool'
    },
    {
      id: 'email-hosting',
      name: 'Email Hosting & Business Communication',
      tagline: 'Secure, professional-grade email hosting for seamless communication.',
      icon: 'Mail'
    },
    {
      id: 'custom-crm',
      name: 'Custom CRM Solutions',
      tagline: 'CRM systems customized to your sales cycle and client engagement process.',
      icon: 'Database'
    },
    {
      id: 'business-management',
      name: 'Business Management Tools',
      tagline: 'Integrated solutions for HR, accounting, operations, and collaboration.',
      icon: 'Settings'
    },
    {
      id: 'erp',
      name: 'Enterprise Resource Planning (ERP)',
      tagline: 'End-to-end enterprise management platforms that unify business operations.',
      icon: 'Building'
    },
    {
      id: 'custom-solution',
      name: 'Looking for Something Else?',
      tagline: 'We tailor solutions beyond the listed services — share your vision and we\'ll make it real.',
      icon: 'MessageCircle'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CTO',
      company: 'TechCorp Inc.',
      content: 'The team delivered exceptional results that exceeded our expectations. Their expertise in modern web technologies transformed our entire platform.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'CEO',
      company: 'Global Logistics Corp',
      content: 'IFM\'s strategic consulting helped us achieve 35% cost reduction while improving operational efficiency. Their AI automation solutions are game-changing.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Product Manager',
      company: 'Retail Giant Inc',
      content: 'The mobile app they developed increased our user engagement by 150%. The attention to detail and user experience is outstanding.',
      rating: 5
    }
  ];

  const techLogos = [
    { name: 'React', icon: 'React' },
    { name: 'Laravel', icon: 'Code' },
    { name: 'AWS', icon: 'Cloud' },
    { name: 'Node.js', icon: 'Server' },
    { name: 'Python', icon: 'Code2' },
    { name: 'PostgreSQL', icon: 'Database' }
  ];

  const handleServiceClick = (service: ServiceItem) => {
    setSelectedService(service);
    setShowModal(true);
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
      <header className="section-padding relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container-custom relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl lg:text-6xl font-bold mb-6"
          >
            Our Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed mb-8"
          >
            Limitless Infotech delivers next-generation digital solutions — from AI-driven automation to enterprise-grade web development — empowering businesses to innovate, scale, and lead.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <button
              onClick={scrollToForm}
              className="bg-white text-indigo-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Get a Tailored Proposal →
            </button>
          </motion.div>
        </div>

        {/* Tech Partner Logos */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:flex space-x-8 opacity-60">
          {techLogos.map((tech, index) => {
            const Icon = Icons[tech.icon as keyof typeof Icons] || Icons.Code;
            return (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="text-center"
              >
                <Icon className="w-8 h-8 mx-auto mb-2" />
                <div className="text-xs">{tech.name}</div>
              </motion.div>
            );
          })}
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-gray-50 dark:bg-gray-900 py-4">
        <div className="container-custom">
          <nav className="text-sm text-gray-600 dark:text-gray-400">
            <span>Home</span> <span className="mx-2">/</span> <span className="text-indigo-600">Our Services</span>
          </nav>
        </div>
      </div>

      {/* Main Services Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl lg:text-4xl font-bold text-center mb-4"
          >
            Comprehensive Service Solutions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto"
          >
            "From concept to execution, we design solutions that empower businesses to grow smarter, scale faster, and perform better in the digital age."
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = Icons[service.icon as keyof typeof Icons] || Icons.Code;
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
                    className="cursor-pointer group h-full p-8"
                    onClick={() => handleServiceClick(service)}
                  >
                    <div className="flex flex-col items-center text-center space-y-6">
                      <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/40 transition-colors">
                        <Icon className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-3">{service.name}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{service.tagline}</p>
                        <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                          Learn More
                        </button>
                      </div>
                    </div>
                  </CardEnhanced>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Flexible Engagement Models */}
      <section className="section-padding bg-gray-50 dark:bg-gray-900/50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Flexible Engagement Models</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Project-Based',
                description: 'Fixed-scope projects with clear deliverables and timelines.',
                icon: 'Target'
              },
              {
                title: 'Dedicated Team',
                description: 'Full-time dedicated developers working exclusively on your projects.',
                icon: 'Users'
              },
              {
                title: 'Monthly Retainer',
                description: 'Ongoing support and development with predictable monthly costs.',
                icon: 'Calendar'
              }
            ].map((model, index) => {
              const Icon = Icons[model.icon as keyof typeof Icons] || Icons.Code;
              return (
                <motion.div
                  key={model.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl w-fit mx-auto mb-4">
                    <Icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="font-bold mb-2">{model.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{model.description}</p>
                </motion.div>
              );
            })}
          </div>
          <div className="text-center mt-8">
            <button
              onClick={scrollToForm}
              className="bg-indigo-600 text-white px-8 py-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Contact us for a tailored proposal
            </button>
          </div>
        </div>
      </section>

      {/* Quote Form Section */}
      <section id="quote-form" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
              <p className="text-gray-600 dark:text-gray-300">Let's discuss your vision and create a customized solution for your business needs.</p>
            </motion.div>
            <ServiceRequestForm />
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-gray-50 dark:bg-gray-900/50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Limitless Infotech?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {[
              { icon: 'Lightbulb', title: 'Innovation at Scale', desc: 'Leverage AI, cloud, and emerging tech for enterprise challenges.' },
              { icon: 'Shield', title: 'Security First', desc: 'Military-grade encryption & compliance (GDPR, SOC 2, HIPAA).' },
              { icon: 'Headphones', title: 'Dedicated Support', desc: '24/7 account managers with SLA-backed response times.' },
              { icon: 'Wrench', title: 'Custom Built', desc: 'No \'one-size-fits-all\'—solutions tailored to your workflows.' },
              { icon: 'Trophy', title: 'Proven Results', desc: '95% client retention & average 40% efficiency gains.' }
            ].map((item, index) => {
              const Icon = Icons[item.icon as keyof typeof Icons] || Icons.Code;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl w-fit mx-auto mb-4">
                    <Icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Trusted by Industry Leaders</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <CardEnhanced variant='outlined' className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Icons.Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">"{testimonial.content}"</p>
                  <div>
                    <div className="font-bold">{testimonial.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}, {testimonial.company}</div>
                  </div>
                </CardEnhanced>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-On Services */}
      <section className="section-padding bg-gray-50 dark:bg-gray-900/50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-4">Complementary Services</h2>
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
                    onClick={service.id === 'custom-solution' ? scrollToForm : undefined}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/40 transition-colors">
                        <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
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

      {/* Service Detail Modal */}
      {selectedService && (
        <EnhancedModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={selectedService.name}
        >
          <div className="space-y-6">
            <p className="text-gray-700 dark:text-gray-300">{selectedService.description}</p>

            <div>
              <h4 className="font-bold mb-3 text-indigo-600">Key Benefits</h4>
              <ul className="space-y-2">
                {selectedService.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Icons.Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-3 text-indigo-600">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {selectedService.techStack.map((tech, idx) => (
                  <span key={idx} className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-3 text-indigo-600">What You'll Get</h4>
              <ul className="space-y-2">
                {selectedService.deliverables.map((deliverable, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Icons.Package className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">{deliverable}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
              <h4 className="font-bold mb-2 text-indigo-600">Case Study</h4>
              <h5 className="font-medium mb-1">{selectedService.caseStudy.title}</h5>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Client: {selectedService.caseStudy.client}</p>
              <ul className="space-y-1">
                {selectedService.caseStudy.results.map((result, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Icons.TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">{result}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setShowModal(false);
                  scrollToForm();
                }}
                className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Get a Proposal
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-3 border border-indigo-600 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </EnhancedModal>
      )}

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors z-50"
      >
        <Icons.ArrowUp className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Services;
