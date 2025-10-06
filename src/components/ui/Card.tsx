'use client';

import React from 'react';

const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => {
  return (
    <div className={`border-b border-gray-200 dark:border-gray-700 pb-2 mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, className = '', ...props }) => {
  return (
    <h3 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 ${className}`} {...props}>
      {children}
    </h3>
  );
};

const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => {
  return (
    <div className={`text-gray-700 dark:text-gray-300 ${className}`} {...props}>
      {children}
    </div>
  );
};

export { Card, CardHeader, CardTitle, CardContent };
