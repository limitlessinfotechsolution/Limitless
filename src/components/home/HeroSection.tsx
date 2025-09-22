import React from 'react';
import { CheckCircle } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import AnimatedCounters from './AnimatedCounters';
import ParallaxSection from './ParallaxSection';
import InteractiveParticleBackground from '../ui/InteractiveParticleBackground';
import EnhancedCTA from '../ui/EnhancedCTA';

const HeroSection: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -150]);

  const stats = [
    { number: '120+', label: 'Projects Delivered', description: 'Global businesses transformed' },
    { number: '28K', label: 'Active Users', description: 'Trusted platforms powering operations' },
    { number: '98%', label: 'Client Retention', description: 'Long-term partners, not one-time clients' },
  ];

  const highlights = [
    'Enterprise-grade security & compliance',
    'Scalable solutions that grow with you',
    'Expert team with 15+ years experience',
    'Royal client experience guarantee'
  ];

  return (
    <ParallaxSection className="relative min-h-screen flex items-center bg-gradient-to-br from-gray-50 via-white to-accent/5 dark:from-gray-900 dark:via-gray-800 dark:to-accent/10 overflow-hidden">
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

      {/* Floating Elements with Parallax */}
      <motion.div
        className="absolute top-20 left-10 w-24 h-24 bg-gradient-to-br from-accent to-accent-dark rounded-full opacity-20 blur-xl"
        style={{ y: y1 }}
      ></motion.div>
      <motion.div
        className="absolute top-40 right-20 w-20 h-20 bg-gradient-to-br from-accent-orange to-accent rounded-full opacity-30 blur-xl animate-pulse"
        style={{ y: y2 }}
      ></motion.div>
      <motion.div
        className="absolute bottom-40 left-20 w-16 h-16 bg-gradient-to-br from-accent-dark to-accent rounded-full opacity-25 blur-xl"
        style={{ y: y3 }}
      ></motion.div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Premium Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-accent/20 to-accent-orange/20 text-accent rounded-full text-sm font-bold mb-6 backdrop-blur-sm border border-accent/30"
            >
              <div className="w-2 h-2 bg-accent rounded-full mr-3 animate-pulse"></div>
              <span>Trusted by 120+ Global Enterprises</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-7xl font-black text-gray-900 dark:text-white mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-accent to-accent-orange bg-clip-text text-transparent">Limitless</span>
              <br />
              <span className="text-gray-900 dark:text-white">Infotech Solution</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-accent to-accent-orange bg-clip-text text-transparent mb-6"
            >
              Where Innovation Meets Execution
            </motion.p>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-gray-700 dark:text-gray-300 mb-10 max-w-2xl"
            >
              Professional. Scalable. Data-driven. Transform your business with our cutting-edge technology solutions.
            </motion.p>

            {/* Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10"
            >
              {highlights.map((highlight, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                  <div className="mt-1 w-5 h-5 bg-gradient-to-br from-accent to-accent-orange rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{highlight}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-6 mb-12"
            >
              <EnhancedCTA
                href="/contact"
                variant="gradient"
                size="lg"
                className="px-8 py-4 text-lg font-bold"
              >
                Start Your Project
                <span className="ml-2">→</span>
              </EnhancedCTA>
              <EnhancedCTA
                href="/portfolio"
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg font-bold"
              >
                View Our Work
              </EnhancedCTA>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-8 opacity-80"
            >
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span>ISO 27001 Certified</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span>98% Client Retention</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span>24/7 Support</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Visual/Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Main Visual Card */}
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 mb-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-accent to-accent-dark rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                    <span className="text-accent font-bold text-xl">L</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Architects of Transformation
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  At Limitless, we don't just build software—we redefine digital identities. 
                  From concept to code, every solution is crafted with precision, creativity, 
                  and a focus on future growth.
                </p>
              </div>
            </div>

            {/* Animated Counters */}
            <AnimatedCounters
              counters={stats.map(stat => ({
                value: parseInt(stat.number.replace(/[^0-9]/g, '')),
                label: stat.label,
                suffix: stat.number.includes('+') ? '+' : stat.number.includes('K') ? 'K' : stat.number.includes('%') ? '%' : '',
                duration: 2000
              }))}
              className="grid grid-cols-3 gap-4"
            />
          </motion.div>
        </div>
      </div>
    </ParallaxSection>
  );
};

export default HeroSection;
