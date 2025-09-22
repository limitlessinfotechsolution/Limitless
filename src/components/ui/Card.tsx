import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = '' }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 ${className}`}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;