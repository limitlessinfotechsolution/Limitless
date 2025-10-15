import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';
import { Project } from '../types';
import { Card } from '../components/ui/Card';
import CardEnhanced from '../components/ui/CardEnhanced';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import LazyImage from '../components/ui/LazyImage';
import InteractiveParticleBackground from '../components/ui/InteractiveParticleBackground';
import PageErrorBoundary from '../components/PageErrorBoundary';

// Lazy load components below the fold for better performance
const ProjectTimeline = React.lazy(() => import('../components/portfolio/ProjectTimeline'));
const EnhancedFilters = React.lazy(() => import('../components/portfolio/EnhancedFilters'));
const TestimonialsCarousel = React.lazy(() => import('../components/home/TestimonialsCarousel'));
const ClientLogos = React.lazy(() => import('../components/home/ClientLogos'));

// Helper function for dynamic "Why Choose Us" content based on industry filter
const getWhyChooseUsContent = (industry: string) => {
  const contentMap: Record<string, Array<{ icon: string, title: string, description: string }>> = {
    'All': [
      { icon: 'Award', title: 'Proven Expertise', description: '10+ years of delivering innovative solutions across industries' },
      { icon: 'Users', title: 'Dedicated Team', description: 'Experienced professionals committed to your success' },
      { icon: 'Zap', title: 'Agile Methodology', description: 'Flexible approach ensuring timely delivery and quality' },
      { icon: 'Shield', title: 'Quality Assurance', description: 'Rigorous testing and validation for reliable solutions' }
    ],
    'FinTech': [
      { icon: 'Lock', title: 'Security First', description: 'Bank-grade security with compliance certifications' },
      { icon: 'TrendingUp', title: 'Scalable Solutions', description: 'Built to handle millions of transactions seamlessly' },
      { icon: 'CreditCard', title: 'Payment Expertise', description: 'Deep knowledge of payment systems and regulations' },
      { icon: 'BarChart3', title: 'Financial Analytics', description: 'Advanced reporting and insights for better decisions' }
    ],
    'Healthcare': [
      { icon: 'Heart', title: 'Patient-Centric', description: 'Solutions designed with patient care and privacy in mind' },
      { icon: 'FileText', title: 'Compliance Ready', description: 'HIPAA and healthcare regulation compliant systems' },
      { icon: 'Stethoscope', title: 'Medical Expertise', description: 'Understanding of healthcare workflows and requirements' },
      { icon: 'Clock', title: 'Rapid Deployment', description: 'Quick implementation without disrupting patient care' }
    ],
    'Education': [
      { icon: 'GraduationCap', title: 'Learning Focused', description: 'Technology that enhances educational outcomes' },
      { icon: 'Users', title: 'User-Friendly', description: 'Intuitive interfaces for students, teachers, and administrators' },
      { icon: 'BookOpen', title: 'Curriculum Integration', description: 'Seamless integration with existing educational systems' },
      { icon: 'TrendingUp', title: 'Scalable Platform', description: 'Grows with your institution\'s needs' }
    ],
    'E-commerce': [
      { icon: 'ShoppingCart', title: 'Conversion Optimized', description: 'Maximize sales with proven e-commerce best practices' },
      { icon: 'Globe', title: 'Global Reach', description: 'Multi-currency and multi-language support' },
      { icon: 'Package', title: 'Inventory Management', description: 'Real-time inventory tracking and automation' },
      { icon: 'Headphones', title: 'Customer Support', description: 'Integrated support systems for better service' }
    ]
  };

  return contentMap[industry] || contentMap['All'];
};

const PortfolioFixed: React.FC = () => {
  return (
    <PageErrorBoundary pageName="Portfolio">
      <PortfolioContent />
    </PageErrorBoundary>
  );
};

const PortfolioContent: React.FC = () => {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({ industry: 'All', serviceType: 'All', projectSize: 'All' });
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // Animated counters
  const [counters, setCounters] = useState({
    projects: 0,
    users: 0,
    countries: 0
  });

  useEffect(() => {
    const fetchProjects = async () => {
      if (!supabase) {
        setError('Supabase client not initialized');
        setLoading(false);
        return;
      }
      const { data, error } = await supabase.from('projects').select('*').order('id');

      if (error) {
        setError(error.message);
        console.error('Error fetching projects:', error);
      } else if (data) {
        // Map database fields to Project interface
        const mappedProjects: Project[] = data.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          industry: item.industry,
          serviceType: item.service_type,
          projectSize: item.project_size,
          image: item.image,
          challenge: item.challenge,
          solution: item.solution,
          techStack: Array.isArray(item.tech_stack) ? item.tech_stack.filter((tech): tech is string => typeof tech === 'string') : [],
          results: Array.isArray(item.results) ? item.results.filter((result): result is string => typeof result === 'string') : [],
          clientReview: item.client_review ? {
            content: typeof item.client_review === 'string' ? item.client_review : '',
            author: '',
            rating: 5
          } : undefined
        }));
        setProjects(mappedProjects);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  // Enhanced filtering with search
  const filteredProjects = useMemo(() => {
    let filtered = projects;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.industry.toLowerCase().includes(query) ||
        project.serviceType.toLowerCase().includes(query) ||
        project.techStack.some(tech => tech.toLowerCase().includes(query))
      );
    }

    // Apply category filters
    if (filters.industry !== 'All') {
      filtered = filtered.filter(p => p.industry === filters.industry);
    }
    if (filters.serviceType !== 'All') {
      filtered = filtered.filter(p => p.serviceType === filters.serviceType);
    }
    if (filters.projectSize !== 'All') {
      filtered = filtered.filter(p => p.projectSize === filters.projectSize);
    }

    return filtered;
  }, [projects, filters, searchQuery]);

  // Animate counters on mount
  useEffect(() => {
    const targetCounters = { projects: 120, users: 5000000, countries: 18 };
    const duration = 2000;
    const steps = 60;
    const increment = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setCounters({
        projects: Math.floor(targetCounters.projects * progress),
        users: Math.floor(targetCounters.users * progress),
        countries: Math.floor(targetCounters.countries * progress)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounters(targetCounters);
      }
    }, increment);

    return () => clearInterval(timer);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`pt-20 transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-24 right-6 z-50 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <Icons.Sun className="w-5 h-5 text-yellow-500" />
        ) : (
          <Icons.Moon className="w-5 h-5 text-gray-700" />
        )}
      </button>

      {/* Enhanced Header with Premium Design */}
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
        
        {/* Animated Geometric Shapes */}
        <div className="absolute top-10 right-10 w-24 h-24 bg-accent/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-accent-orange/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-4xl mx-auto"
        >
          <motion.h1 
            className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-accent to-accent-orange bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Our Portfolio
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Explore our successful projects and see how we've transformed businesses across various industries with cutting-edge technology solutions.
          </motion.p>
          
          {/* Enhanced CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8"
          >
            <button className="bg-accent hover:bg-accent/90 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent/25">
              View Case Studies
            </button>
            <button className="border-2 border-accent text-accent hover:bg-accent hover:text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
              Schedule a Demo
            </button>
          </motion.div>
        </motion.div>
      </header>

      <div className="container-custom section-padding bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="p-8">
                <div className="flex items-center space-x-4 mb-4">
                  <SkeletonLoader width="3rem" height="3rem" rounded />
                  <SkeletonLoader width="60%" height="1.5rem" />
                </div>
                <SkeletonLoader width="100%" height="1rem" className="mb-2" />
                <SkeletonLoader width="90%" height="1rem" className="mb-2" />
                <SkeletonLoader width="80%" height="1rem" className="mb-6" />
                <SkeletonLoader width="40%" height="1rem" />
              </Card>
            ))}
          </div>
        ) : error ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-6 rounded-xl max-w-md mx-auto">
              <p className="font-medium">Error loading projects</p>
              <p className="mt-2 text-sm">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Enhanced Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Suspense fallback={<div className="min-h-[200px] flex items-center justify-center">Loading filters...</div>}>
                <EnhancedFilters
                  projects={projects}
                  filters={filters}
                  onFiltersChange={setFilters}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />
              </Suspense>
            </motion.div>

            {/* Why Choose Us Section - Dynamic based on industry filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-16"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-accent to-accent-orange bg-clip-text text-transparent">
                  Why Choose Us {filters.industry !== 'All' ? `for ${filters.industry}` : ''}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  {filters.industry !== 'All'
                    ? `Specialized expertise and proven results in ${filters.industry.toLowerCase()} solutions`
                    : 'Industry-leading expertise with proven results across all sectors'
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {getWhyChooseUsContent(filters.industry).map((item, index) => {
                  const IconComponent = Icons[item.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
                  return (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                    >
                      <CardEnhanced
                        variant='elevated'
                        hover='lift'
                        className="h-full p-6 text-center bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm group"
                      >
                        <IconComponent className="w-12 h-12 text-accent mx-auto mb-4 group-hover:text-accent-orange transition-colors" />
                        <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {item.description}
                        </p>
                      </CardEnhanced>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Animated Stats - Enhanced card design */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            >
              {[
                { label: 'Projects Delivered', value: counters.projects, icon: Icons.CheckCircle },
                { label: 'Active Users', value: `${(counters.users / 1000000).toFixed(1)}M+`, icon: Icons.Users },
                { label: 'Countries Served', value: counters.countries, icon: Icons.Globe }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                >
                  <CardEnhanced
                    variant='elevated'
                    hover='lift'
                    className="bg-white/50 dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg text-center border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm group"
                  >
                    <stat.icon className="w-8 h-8 text-accent mx-auto mb-3 group-hover:text-accent-orange transition-colors" />
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
                  </CardEnhanced>
                </motion.div>
              ))}
            </motion.div>

            {/* Testimonials Carousel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-16"
            >
              <Suspense fallback={<div className="min-h-[200px] flex items-center justify-center">Loading testimonials...</div>}>
                <TestimonialsCarousel />
              </Suspense>
            </motion.div>

            {/* Client Logos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-20"
            >
              <Suspense fallback={<div className="min-h-[100px] flex items-center justify-center">Loading client logos...</div>}>
                <ClientLogos />
              </Suspense>
            </motion.div>

            {/* Enhanced Project Grid - Improved card design and alignment */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${filters.industry}-${filters.serviceType}-${filters.projectSize}-${searchQuery}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
              >
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.1,
                      layout: { duration: 0.3 }
                    }}
                    whileHover={{ y: -5 }}
                    onClick={() => router.push(`/portfolio/${project.id}`)}
                    className="group cursor-pointer"
                  >
                    <CardEnhanced
                      variant='elevated'
                      hover='lift'
                      className="h-full overflow-hidden transform transition-all duration-300 hover:shadow-2xl border border-gray-200/50 dark:border-gray-700/50 group"
                    >
                      <div className="relative overflow-hidden">
                        <LazyImage
                          src={project.image}
                          alt={project.title}
                          width={400}
                          height={192}
                          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute top-4 right-4">
                            <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                              {project.industry}
                            </span>
                          </div>
                        </div>

                        {/* Impact Stats Overlay */}
                        <div className="absolute bottom-4 left-4 right-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="text-center">
                                <div className="font-bold text-accent">+40%</div>
                                <div className="text-gray-600">User Retention</div>
                              </div>
                              <div className="text-center">
                                <div className="font-bold text-accent">1M+</div>
                                <div className="text-gray-600">Active Users</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-bold group-hover:text-accent transition-colors">
                            {project.title}
                          </h3>
                          <div className="flex gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              project.industry === 'FinTech' ? 'bg-gradient-to-r from-blue-100/50 to-blue-200/50 text-blue-800 dark:from-blue-900/30 dark:to-blue-800/30 dark:text-blue-200' :
                              project.industry === 'Healthcare' ? 'bg-gradient-to-r from-green-100/50 to-green-200/50 text-green-800 dark:from-green-900/30 dark:to-green-800/30 dark:text-green-200' :
                              project.industry === 'Education' ? 'bg-gradient-to-r from-purple-100/50 to-purple-200/50 text-purple-800 dark:from-purple-900/30 dark:to-purple-800/30 dark:text-purple-200' :
                              'bg-gradient-to-r from-gray-100/50 to-gray-200/50 text-gray-800 dark:from-gray-700/30 dark:to-gray-600/30 dark:text-gray-300'
                            }`}>
                              {project.industry}
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                          {project.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {project.techStack.slice(0, 3).map((tech, techIndex) => (
                              <span
                                key={techIndex}
                                className="bg-gradient-to-r from-gray-100/50 to-gray-200/50 dark:from-gray-700/30 dark:to-gray-600/30 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs transition-all duration-300 group-hover:from-gray-200/50 group-hover:to-gray-300/50 dark:group-hover:from-gray-600/30 dark:group-hover:to-gray-500/30"
                              >
                                {tech}
                              </span>
                            ))}
                            {project.techStack.length > 3 && (
                              <span className="text-gray-500 text-xs">+{project.techStack.length - 3} more</span>
                            )}
                          </div>

                          <span
                            className="font-medium text-accent hover:text-accent-orange transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            View Case Study
                            <Icons.ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </CardEnhanced>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* No Results */}
            {filteredProjects.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <Icons.Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No projects found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={() => {
                    setFilters({ industry: 'All', serviceType: 'All', projectSize: 'All' });
                    setSearchQuery('');
                  }}
                  className="bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-full font-medium transition-colors"
                >
                  Clear Filters
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Enhanced Timeline Section */}
      <div className="mt-20 py-16 bg-gradient-to-br from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-800/50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-accent to-accent-orange bg-clip-text text-transparent">
              Our Development Process
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              From concept to deployment, we follow a proven methodology to deliver exceptional results
            </p>
          </motion.div>

          <ProjectTimeline items={[
            {
              id: '1',
              title: 'Discovery & Planning',
              description: 'Understanding client requirements and planning the project scope',
              date: 'Week 1-2',
              status: 'completed',
              challenges: 'Complex requirements & tight deadlines',
              solutions: 'Agile methodology, clear communication'
            },
            {
              id: '2',
              title: 'Design & Prototyping',
              description: 'Creating wireframes, mockups, and interactive prototypes',
              date: 'Week 3-4',
              status: 'completed',
              challenges: 'UX optimization & user feedback',
              solutions: 'Iterative testing + design sprints'
            },
            {
              id: '3',
              title: 'Development',
              description: 'Building the solution with modern technologies',
              date: 'Week 5-8',
              status: 'in-progress',
              challenges: 'Tech complexity & integration',
              solutions: 'Modular architecture, CI/CD pipelines'
            },
            {
              id: '4',
              title: 'Testing & Deployment',
              description: 'Quality assurance and production deployment',
              date: 'Week 9-10',
              status: 'upcoming',
              challenges: 'Cross-browser compatibility',
              solutions: 'Automated testing & QA suite'
            }
          ]} />
        </div>
      </div>


    </div>
  );
};

export default PortfolioFixed;
