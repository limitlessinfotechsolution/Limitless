'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Code,
  Database,
  Shield,
  Zap,
  Smartphone,
  Globe,
  ChevronRight,
  Download,
  ExternalLink,
  Search
} from 'lucide-react';
import CardEnhanced from '../../src/components/ui/Card-enhanced';

interface DocSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  articles: DocArticle[];
}

interface DocArticle {
  id: string;
  title: string;
  description: string;
  type: 'guide' | 'api' | 'tutorial' | 'reference';
  readTime: string;
  tags: string[];
}

const DocumentationPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const docSections: DocSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Learn the basics and get up and running quickly',
      icon: <BookOpen className="w-6 h-6" />,
      articles: [
        {
          id: 'quick-start',
          title: 'Quick Start Guide',
          description: 'Get your first project running in under 5 minutes',
          type: 'guide',
          readTime: '5 min',
          tags: ['beginner', 'setup']
        },
        {
          id: 'account-setup',
          title: 'Account Setup & Configuration',
          description: 'Configure your account settings and preferences',
          type: 'guide',
          readTime: '8 min',
          tags: ['setup', 'configuration']
        },
        {
          id: 'first-project',
          title: 'Creating Your First Project',
          description: 'Step-by-step guide to building your first application',
          type: 'tutorial',
          readTime: '15 min',
          tags: ['tutorial', 'project']
        }
      ]
    },
    {
      id: 'web-development',
      title: 'Web Development',
      description: 'Build modern web applications with our comprehensive tools',
      icon: <Globe className="w-6 h-6" />,
      articles: [
        {
          id: 'react-guide',
          title: 'React Development Guide',
          description: 'Best practices for building React applications',
          type: 'guide',
          readTime: '12 min',
          tags: ['react', 'frontend']
        },
        {
          id: 'api-integration',
          title: 'API Integration & Authentication',
          description: 'Connect your apps with third-party services securely',
          type: 'guide',
          readTime: '18 min',
          tags: ['api', 'authentication']
        },
        {
          id: 'performance',
          title: 'Performance Optimization',
          description: 'Optimize your web apps for speed and efficiency',
          type: 'guide',
          readTime: '20 min',
          tags: ['performance', 'optimization']
        }
      ]
    },
    {
      id: 'mobile-development',
      title: 'Mobile Development',
      description: 'Create native and cross-platform mobile applications',
      icon: <Smartphone className="w-6 h-6" />,
      articles: [
        {
          id: 'react-native',
          title: 'React Native Development',
          description: 'Build cross-platform mobile apps with React Native',
          type: 'guide',
          readTime: '25 min',
          tags: ['react-native', 'mobile']
        },
        {
          id: 'app-store',
          title: 'App Store Deployment',
          description: 'Publish your apps to iOS and Android app stores',
          type: 'guide',
          readTime: '15 min',
          tags: ['deployment', 'app-store']
        }
      ]
    },
    {
      id: 'backend-systems',
      title: 'Backend & Databases',
      description: 'Powerful backend solutions and database management',
      icon: <Database className="w-6 h-6" />,
      articles: [
        {
          id: 'database-design',
          title: 'Database Design & Architecture',
          description: 'Design scalable and efficient database schemas',
          type: 'guide',
          readTime: '22 min',
          tags: ['database', 'architecture']
        },
        {
          id: 'api-development',
          title: 'REST API Development',
          description: 'Build robust REST APIs with proper documentation',
          type: 'tutorial',
          readTime: '30 min',
          tags: ['api', 'rest']
        },
        {
          id: 'security',
          title: 'Security Best Practices',
          description: 'Implement security measures to protect your applications',
          type: 'guide',
          readTime: '25 min',
          tags: ['security', 'best-practices']
        }
      ]
    },
    {
      id: 'ai-automation',
      title: 'AI & Automation',
      description: 'Leverage AI capabilities and automate business processes',
      icon: <Zap className="w-6 h-6" />,
      articles: [
        {
          id: 'ai-integration',
          title: 'AI Integration Guide',
          description: 'Integrate AI capabilities into your applications',
          type: 'guide',
          readTime: '20 min',
          tags: ['ai', 'integration']
        },
        {
          id: 'automation',
          title: 'Business Process Automation',
          description: 'Automate repetitive tasks and workflows',
          type: 'tutorial',
          readTime: '18 min',
          tags: ['automation', 'workflow']
        }
      ]
    },
    {
      id: 'security-compliance',
      title: 'Security & Compliance',
      description: 'Ensure your applications meet security standards',
      icon: <Shield className="w-6 h-6" />,
      articles: [
        {
          id: 'gdpr-compliance',
          title: 'GDPR Compliance Guide',
          description: 'Ensure your applications comply with GDPR regulations',
          type: 'reference',
          readTime: '15 min',
          tags: ['gdpr', 'compliance']
        },
        {
          id: 'data-protection',
          title: 'Data Protection & Encryption',
          description: 'Implement data protection measures and encryption',
          type: 'guide',
          readTime: '20 min',
          tags: ['security', 'encryption']
        }
      ]
    }
  ];

  const allArticles = docSections.flatMap(section =>
    section.articles.map(article => ({ ...article, sectionId: section.id, sectionTitle: section.title }))
  );

  const filteredArticles = allArticles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'guide': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'tutorial': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'api': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'reference': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-accent to-accent-orange text-white">
        <div className="container-custom py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Documentation Center
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Comprehensive guides, tutorials, and API references to help you build amazing applications
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-accent mb-2">{docSections.length}</div>
            <div className="text-gray-600 dark:text-gray-400">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent mb-2">{allArticles.length}</div>
            <div className="text-gray-600 dark:text-gray-400">Articles</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent mb-2">
              {Math.round(allArticles.reduce((acc, article) => acc + parseInt(article.readTime), 0) / allArticles.length)} min
            </div>
            <div className="text-gray-600 dark:text-gray-400">Avg. Read Time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent mb-2">24/7</div>
            <div className="text-gray-600 dark:text-gray-400">Support</div>
          </div>
        </motion.div>

        {/* Documentation Sections */}
        {searchTerm ? (
          /* Search Results */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6">
              Search Results ({filteredArticles.length})
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <CardEnhanced variant="elevated" className="h-full p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(article.type)}`}>
                        {article.type}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{article.readTime}</span>
                    </div>
                    <h3 className="font-bold text-lg mb-2">{article.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{article.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{article.sectionTitle}</span>
                      <button className="flex items-center text-accent hover:text-accent-orange font-medium">
                        Read More <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </CardEnhanced>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          /* Category Sections */
          <div className="space-y-16">
            {docSections.map((section, sectionIndex) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-accent/10 rounded-lg text-accent">
                    {section.icon}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">{section.title}</h2>
                    <p className="text-gray-600 dark:text-gray-300">{section.description}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section.articles.map((article, articleIndex) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: articleIndex * 0.1 }}
                    >
                      <CardEnhanced variant="outlined" className="h-full p-6 hover:shadow-lg transition-shadow group cursor-pointer">
                        <div className="flex items-start justify-between mb-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(article.type)}`}>
                            {article.type}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">{article.readTime}</span>
                        </div>
                        <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">{article.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {article.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-accent group-hover:text-accent-orange transition-colors font-medium">
                            Read Article <ChevronRight className="w-4 h-4" />
                          </div>
                          <div className="flex gap-2">
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                              <Download className="w-4 h-4" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </CardEnhanced>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 bg-gradient-to-r from-accent to-accent-orange rounded-2xl p-8 text-white text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Need Additional Help?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Our expert support team is here to help you succeed. Get personalized assistance for your specific needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-accent px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Contact Support
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-accent transition-colors">
              Schedule Consultation
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DocumentationPage;
