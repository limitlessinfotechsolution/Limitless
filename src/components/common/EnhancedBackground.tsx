'use client';

import React from 'react';
import { motion } from 'framer-motion';
import InteractiveParticleBackground from '../ui/InteractiveParticleBackground';

interface EnhancedBackgroundProps {
  children: React.ReactNode;
  className?: string;
  showParticles?: boolean;
  particleCount?: number;
  showGeometricShapes?: boolean;
}

const EnhancedBackground: React.FC<EnhancedBackgroundProps> = ({
  children,
  className = '',
  showParticles = true,
  particleCount = 50,
  showGeometricShapes = true
}) => {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-accent/5 dark:from-gray-900 dark:via-gray-800 dark:to-accent/10 ${className}`}>
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #D4AF37 0%, transparent 50%), 
                            radial-gradient(circle at 75% 75%, #1A237E 0%, transparent 50%)`
          }}
        ></div>
      </div>
      
      {/* Interactive Particle Background */}
      {showParticles && (
        <InteractiveParticleBackground
          particleCount={particleCount}
          className="absolute inset-0"
        />
      )}
      
      {/* Animated Geometric Shapes */}
      {showGeometricShapes && (
        <>
          <motion.div
            className="absolute top-10 right-10 w-24 h-24 bg-accent/10 rounded-full blur-xl animate-pulse"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.15, 0.1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          ></motion.div>
          <motion.div
            className="absolute bottom-10 left-10 w-32 h-32 bg-accent-orange/10 rounded-full blur-xl animate-pulse"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.1, 0.15, 0.1]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1
            }}
          ></motion.div>
        </>
      )}
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default EnhancedBackground;