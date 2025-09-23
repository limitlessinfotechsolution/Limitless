import React from 'react';
import { motion } from 'framer-motion';
import AnimatedCounters from './AnimatedCounters';
import { heroStats } from '../../config/heroConfig';

const HeroVisual: React.FC = React.memo(() => {
  return (
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
        counters={heroStats.map(stat => ({
          value: parseInt(stat.number.replace(/[^0-9]/g, '')),
          label: stat.label,
          suffix: stat.number.includes('+') ? '+' : stat.number.includes('K') ? 'K' : stat.number.includes('%') ? '%' : '',
          duration: 2000
        }))}
        className="grid grid-cols-3 gap-4"
      />
    </motion.div>
  );
});

export default HeroVisual;
