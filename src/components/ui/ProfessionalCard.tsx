'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { UI_CONFIG } from '../../config/uiConfig';

interface ProfessionalCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'glass' | 'innovative' | 'premium';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  hover?: 'lift' | 'glow' | 'scale' | 'professional' | 'subtle';
  alignContent?: 'start' | 'center' | 'end';
  onClick?: () => void;
  interactive?: boolean;
  borderGlow?: boolean;
  animated?: boolean;
}

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({
  children,
  className = '',
  variant = 'default',
  size = 'md',
  hover = 'professional',
  alignContent = 'start',
  onClick,
  interactive = false,
  borderGlow = false,
  animated = true,
}) => {
  const baseClasses = 'rounded-3xl transition-all duration-500 overflow-hidden relative';

  const variantClasses = {
    default: `bg-white dark:bg-gray-800 ${UI_CONFIG.colors.professional.shadow} border ${UI_CONFIG.colors.professional.border}`,
    elevated: `bg-white dark:bg-gray-800 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 transform hover:-translate-y-2`,
    glass: `bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 ${UI_CONFIG.colors.professional.shadow}`,
    innovative: `bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200/50 dark:border-indigo-700/50 ${UI_CONFIG.colors.innovative.glow}`,
    premium: `bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200/50 dark:border-gray-700/50 shadow-xl`,
  };

  const sizeClasses = {
    xs: 'p-2',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
    '2xl': 'p-12',
  };

  const hoverClasses = {
    lift: 'hover:transform hover:-translate-y-2 hover:shadow-2xl',
    glow: `hover:${UI_CONFIG.colors.innovative.glow}`,
    scale: 'hover:scale-105',
    professional: `hover:shadow-2xl hover:border-indigo-300/50 transition-all duration-300`,
    subtle: `hover:shadow-lg hover:border-gray-300/50 transition-all duration-300`,
  };

  const alignmentClasses = {
    start: 'text-left flex flex-col justify-start',
    center: 'text-center flex flex-col items-center justify-center',
    end: 'text-right flex flex-col items-end justify-end',
  };

  const applyProfessionalStyling = () => {
    return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${hoverClasses[hover]} ${alignmentClasses[alignContent]} ${interactive ? 'cursor-pointer' : ''} ${className}`.trim();
  };

  const combinedClasses = applyProfessionalStyling();

  return (
    <motion.div
      className={combinedClasses}
      onClick={onClick}
      whileHover={interactive ? { scale: 1.02 } : undefined}
      whileTap={interactive ? { scale: 0.98 } : undefined}
      initial={animated ? { opacity: 0, y: 20 } : undefined}
      animate={animated ? { opacity: 1, y: 0 } : undefined}
      transition={{
        duration: UI_CONFIG.animations.duration.innovative / 1000,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {/* Professional glow effect for innovative variant */}
      {variant === 'innovative' && (
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-3xl blur-xl -z-10" />
      )}

      {/* Premium border glow effect */}
      {borderGlow && (
        <div className="absolute inset-0 rounded-3xl pointer-events-none border-2 border-transparent bg-gradient-to-r from-indigo-400/30 to-purple-400/30 bg-clip-border -z-10" />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Subtle animation overlay for premium variant */}
      {(variant === 'premium' || variant === 'glass') && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 5,
            ease: 'easeInOut',
          }}
        />
      )}
    </motion.div>
  );
};

export default ProfessionalCard;