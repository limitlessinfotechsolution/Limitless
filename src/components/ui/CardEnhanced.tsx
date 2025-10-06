import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'gradient' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hover?: 'lift' | 'glow' | 'scale' | 'none';
  onClick?: () => void;
  alignContent?: 'start' | 'center' | 'end';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = '', variant = 'default', size = 'md', hover = 'none', alignContent = 'start', ...props }, ref) => {
    const baseClasses = 'rounded-2xl transition-all duration-300 overflow-hidden';

    const variantClasses = {
      default: 'bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl border border-gray-100 dark:border-gray-700',
      elevated: 'bg-white dark:bg-gray-800 shadow-2xl hover:shadow-3xl border border-gray-200 dark:border-gray-600 transform hover:-translate-y-1',
      outlined: 'bg-transparent border-2 border-gray-200 dark:border-gray-600 hover:border-accent hover:bg-accent/5',
      gradient: 'bg-gradient-to-br from-accent/10 to-accent/5 dark:from-accent/20 dark:to-accent/10 border border-accent/20 shadow-lg hover:shadow-xl',
      glass: 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-white/20 dark:border-gray-700/50 shadow-lg hover:shadow-xl',
    };

    const sizeClasses = {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10',
    };

    const hoverClasses = {
      lift: 'hover:transform hover:-translate-y-2 hover:shadow-2xl',
      glow: 'hover:shadow-accent/25 hover:shadow-2xl',
      scale: 'hover:scale-105',
      none: '',
    };

    const alignmentClasses = {
      start: 'text-left',
      center: 'text-center',
      end: 'text-right',
    };

    const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${hoverClasses[hover]} ${alignmentClasses[alignContent]} ${className}`.trim();

    return (
      <div
        ref={ref}
        className={combinedClasses}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
