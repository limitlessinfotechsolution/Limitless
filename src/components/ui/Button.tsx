import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', icon, className = '', onClick }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800';
  const sizeClasses = size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2 text-sm';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600',
    ghost: 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses} ${className}`} onClick={onClick}>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
