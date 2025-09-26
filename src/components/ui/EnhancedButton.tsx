import React from 'react';

interface EnhancedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost' | 'destructive' | 'success' | 'warning' | 'accent' | 'gradient';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right' | 'only';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  animation?: 'none' | 'pulse' | 'bounce' | 'float';
  disabled?: boolean;
}

const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    className = '', 
    children, 
    isLoading = false,
    fullWidth = false,
    icon,
    iconPosition = 'left',
    rounded = 'md',
    shadow = 'sm',
    animation = 'none',
    disabled = false,
    ...props 
  }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';
    
    // Enhanced variant classes with better consistency and accessibility
    const variantClasses = {
      primary: 'bg-accent hover:bg-accent-dark text-white focus:ring-accent focus:ring-offset-white dark:focus:ring-offset-gray-900 border border-transparent',
      secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500 focus:ring-offset-white dark:focus:ring-offset-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white border border-gray-200 dark:border-gray-600',
      tertiary: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500 focus:ring-offset-white dark:focus:ring-offset-gray-900 dark:hover:bg-gray-800 dark:text-gray-300 border border-transparent',
      outline: 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-blue-500 focus:ring-offset-white dark:focus:ring-offset-gray-900',
      ghost: 'bg-transparent text-accent hover:bg-accent/10 focus:ring-accent focus:ring-offset-white dark:focus:ring-offset-gray-900 border border-transparent',
      destructive: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 focus:ring-offset-white dark:focus:ring-offset-gray-900 border border-transparent',
      success: 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500 focus:ring-offset-white dark:focus:ring-offset-gray-900 border border-transparent',
      warning: 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500 focus:ring-offset-white dark:focus:ring-offset-gray-900 border border-transparent',
      accent: 'bg-accent-orange hover:bg-orange-600 text-white focus:ring-accent-orange focus:ring-offset-white dark:focus:ring-offset-gray-900 border border-transparent',
      gradient: 'bg-gradient-to-r from-accent to-accent-orange text-white hover:from-accent-dark hover:to-orange-600 focus:ring-accent focus:ring-offset-white dark:focus:ring-offset-gray-900 border border-transparent',
    };

    // Enhanced size classes with better consistency
    const sizeClasses = {
      xs: 'px-2 py-1 text-xs',
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
      xl: 'px-8 py-4 text-xl',
    };

    // Rounded classes
    const roundedClasses = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    };

    // Shadow classes
    const shadowClasses = {
      none: '',
      sm: 'shadow-sm hover:shadow',
      md: 'shadow-md hover:shadow-lg',
      lg: 'shadow-lg hover:shadow-xl',
      xl: 'shadow-xl hover:shadow-2xl',
    };

    // Animation classes
    const animationClasses = {
      none: '',
      pulse: 'animate-pulse-slow',
      bounce: 'hover:animate-bounce',
      float: 'hover:animate-float',
    };

    // Width class
    const widthClass = fullWidth ? 'w-full' : '';
    
    // Disabled class
    const disabledClass = disabled || isLoading ? 'opacity-50 cursor-not-allowed' : '';

    const combinedClasses = [
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      roundedClasses[rounded],
      shadowClasses[shadow],
      animationClasses[animation],
      widthClass,
      disabledClass,
      className
    ].filter(Boolean).join(' ');

    const renderContent = () => {
      if (isLoading) {
        return (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </>
        );
      }
      
      if (icon && iconPosition === 'only') {
        return icon;
      }
      
      if (icon) {
        return (
          <>
            {iconPosition === 'left' && <span className="mr-2">{icon}</span>}
            {children}
            {iconPosition === 'right' && <span className="ml-2">{icon}</span>}
          </>
        );
      }
      
      return children;
    };

    return (
      <button
        ref={ref}
        className={combinedClasses}
        disabled={disabled || isLoading}
        {...props}
      >
        {renderContent()}
      </button>
    );
  }
);

EnhancedButton.displayName = 'EnhancedButton';

export default EnhancedButton;