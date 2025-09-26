import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, Minus } from 'lucide-react';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'minimal' | 'card';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  description?: string;
  badge?: string;
  badgeVariant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

const AccordionItem: React.FC<AccordionItemProps> = ({ 
  title, 
  children, 
  isOpen, 
  onClick,
  icon,
  variant = 'default',
  size = 'md',
  disabled = false,
  description,
  badge,
  badgeVariant = 'primary'
}) => {
  const sizeClasses = {
    sm: 'py-2 text-sm',
    md: 'py-3 text-base',
    lg: 'py-4 text-lg',
  };

  const variantClasses = {
    default: 'border-b border-gray-200 dark:border-gray-700',
    filled: 'bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700',
    minimal: '',
    card: 'bg-white dark:bg-gray-800 rounded-lg shadow mb-2 border border-gray-200 dark:border-gray-700',
  };

  const badgeVariantClasses = {
    primary: 'bg-accent text-white',
    secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
    error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
  };

  return (
    <div className={variantClasses[variant]}>
      <button
        className={`flex items-center justify-between w-full text-left font-medium text-gray-900 dark:text-white hover:text-accent dark:hover:text-accent transition-colors ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={disabled ? undefined : onClick}
        aria-expanded={isOpen}
        disabled={disabled}
      >
        <div className="flex items-center">
          {icon && <span className="mr-3">{icon}</span>}
          <div>
            <div className="flex items-center">
              <span>{title}</span>
              {badge && (
                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${badgeVariantClasses[badgeVariant]}`}>
                  {badge}
                </span>
              )}
            </div>
            {description && (
              <p className="text-sm font-normal text-gray-500 dark:text-gray-400 mt-1">
                {description}
              </p>
            )}
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {variant === 'minimal' ? (
            isOpen ? <Minus className="w-4 h-4 text-gray-500" /> : <Plus className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          )}
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className={`pb-4 text-gray-600 dark:text-gray-300 ${variant === 'card' ? 'px-4' : ''}`}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface AccordionProps {
  children: React.ReactNode;
  allowMultiple?: boolean;
  defaultOpenIndex?: number | number[];
  variant?: 'default' | 'filled' | 'minimal' | 'card';
  size?: 'sm' | 'md' | 'lg';
  collapsible?: boolean;
  className?: string;
}

const Accordion: React.FC<AccordionProps> & { Item: typeof AccordionItem } = ({ 
  children, 
  allowMultiple = false,
  defaultOpenIndex = -1,
  variant = 'default',
  size = 'md',
  collapsible = true,
  className = ''
}) => {
  // Handle both single and multiple default open indices
  const getDefaultOpenIndexes = () => {
    if (Array.isArray(defaultOpenIndex)) {
      return defaultOpenIndex;
    }
    return defaultOpenIndex >= 0 ? [defaultOpenIndex] : [];
  };

  const [openIndexes, setOpenIndexes] = useState<number[]>(getDefaultOpenIndexes());

  const handleItemClick = (index: number) => {
    if (allowMultiple) {
      if (openIndexes.includes(index)) {
        // If collapsible is false, prevent closing the last open item
        if (!collapsible && openIndexes.length <= 1) {
          return;
        }
        setOpenIndexes(openIndexes.filter(i => i !== index));
      } else {
        setOpenIndexes([...openIndexes, index]);
      }
    } else {
      // If collapsible is false, prevent closing the open item
      if (!collapsible && openIndexes.includes(index)) {
        return;
      }
      setOpenIndexes(openIndexes.includes(index) ? [] : [index]);
    }
  };

  const childrenWithProps = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child) && child.type === AccordionItem) {
      const childProps = child.props as AccordionItemProps;
      return React.cloneElement(child, {
        isOpen: openIndexes.includes(index),
        onClick: () => handleItemClick(index),
        variant: childProps.variant || variant,
        size: childProps.size || size,
      } as Partial<AccordionItemProps>);
    }
    return child;
  });

  const containerClasses = variant === 'card' 
    ? className 
    : `${variant === 'filled' ? 'bg-gray-50 dark:bg-gray-800/50' : ''} rounded-xl border border-gray-200 dark:border-gray-700 ${className}`;

  return (
    <div className={containerClasses}>
      {childrenWithProps}
    </div>
  );
};

Accordion.Item = AccordionItem;

export default Accordion;