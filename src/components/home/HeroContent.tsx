import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import EnhancedCTA from '../ui/EnhancedCTA';
import { heroHighlights, trustIndicators } from '../../config/heroConfig';

const HeroContent: React.FC = React.memo(() => {
  return (
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
        {heroHighlights.map((highlight, index) => (
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
        {trustIndicators.map((indicator, index) => (
          <div key={index} className="flex items-center text-gray-600 dark:text-gray-400">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            <span>{indicator.text}</span>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
});

export default HeroContent;
