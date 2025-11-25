import React from 'react';

interface CardEnhancedProps {
  children: React.ReactNode;
  className?: string;
}

const CardEnhanced: React.FC<CardEnhancedProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-white/70 backdrop-blur rounded-lg shadow-glass p-4 ${className}`}
    >
      {children}
    </div>
  );
};

export default CardEnhanced;
