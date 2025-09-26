import React from 'react';
import { motion } from 'framer-motion';

interface ProfessionalLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'bars';
  color?: 'primary' | 'accent' | 'white';
  message?: string;
}

const ProfessionalLoader: React.FC<ProfessionalLoaderProps> = ({
  size = 'md',
  variant = 'spinner',
  color = 'primary',
  message,
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const colorClasses = {
    primary: 'text-gray-900 dark:text-white',
    accent: 'text-accent',
    white: 'text-white',
  };

  const getSizeClass = () => sizeClasses[size];
  const getColorClass = () => colorClasses[color];

  const renderSpinner = () => (
    <motion.div
      className={`${getSizeClass()} ${getColorClass()} rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`}
      style={{
        animation: 'spin 1s linear infinite',
      }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );

  const renderDots = () => (
    <div className="flex space-x-2">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`rounded-full ${getSizeClass()} ${getColorClass()}`}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: index * 0.2,
          }}
        />
      ))}
    </div>
  );

  const renderBars = () => (
    <div className="flex space-x-1">
      {[0, 1, 2, 3].map((index) => (
        <motion.div
          key={index}
          className={`w-2 ${size === 'sm' ? 'h-6' : size === 'md' ? 'h-10' : 'h-12'} ${getColorClass()} rounded-full`}
          animate={{
            scaleY: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.1,
          }}
        />
      ))}
    </div>
  );

  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return renderDots();
      case 'bars':
        return renderBars();
      case 'spinner':
      default:
        return renderSpinner();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {renderLoader()}
      {message && (
        <motion.p
          className={`mt-4 text-center ${size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg'} ${getColorClass()}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
};

export default ProfessionalLoader;