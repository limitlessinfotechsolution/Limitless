'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AdvancedCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'gradient' | 'glass' | 'neumorphism';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hoverEffect?: 'lift' | 'glow' | 'scale' | 'none';
  onClick?: () => void;
  alignContent?: 'start' | 'center' | 'end';
  animationDelay?: number;
  isInView?: boolean;
}

const AdvancedCard = React.forwardRef<HTMLDivElement, AdvancedCardProps>(
  ({ 
    children, 
    className = '', 
    variant = 'default', 
    size = 'md', 
    hoverEffect = 'none',
    alignContent = 'start',
    animationDelay = 0,
    isInView = true,
    ...props 
  }, ref) => {
    const baseClasses = 'rounded-2xl transition-all duration-300 overflow-hidden';

    const variantClasses = {
      default: 'bg-white dark:bg-secondary-900 shadow-lg hover:shadow-xl border border-secondary-100 dark:border-secondary-800',
      elevated: 'bg-white dark:bg-secondary-900 shadow-2xl hover:shadow-3xl border border-secondary-200 dark:border-secondary-700',
      outlined: 'bg-transparent border-2 border-secondary-200 dark:border-secondary-700 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10',
      gradient: 'bg-gradient-to-br from-primary-50 to-primary-100/50 dark:from-primary-900/20 dark:to-primary-800/10 border border-primary-200/50 dark:border-primary-700/30 shadow-lg hover:shadow-xl',
      glass: 'bg-white/80 dark:bg-secondary-900/80 backdrop-blur-md border border-white/20 dark:border-secondary-700/50 shadow-glass hover:shadow-glass-hover',
      neumorphism: 'bg-secondary-50 dark:bg-secondary-900 shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] dark:shadow-[5px_5px_10px_#0f172a,-5px_-5px_10px_#1e293b] hover:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] dark:hover:shadow-[inset_5px_5px_10px_#0f172a,inset_-5px_-5px_10px_#1e293b]'
    };

    const sizeClasses = {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10',
    };

    const hoverClasses = {
      lift: 'transform hover:-translate-y-2',
      glow: 'hover:shadow-accent/25 hover:shadow-2xl',
      scale: 'hover:scale-[1.02]',
      none: '',
    };
    
    const alignmentClasses = {
      start: 'text-left flex flex-col',
      center: 'text-center flex flex-col items-center',
      end: 'text-right flex flex-col items-end',
    };

    const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${hoverClasses[hoverEffect]} ${alignmentClasses[alignContent]} ${className}`.trim();

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: animationDelay }}
        className={combinedClasses}
        whileHover={hoverEffect !== 'none' ? { y: hoverEffect === 'lift' ? -8 : 0 } : {}}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

AdvancedCard.displayName = 'AdvancedCard';

export default AdvancedCard;