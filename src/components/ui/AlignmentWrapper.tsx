import React from 'react';

interface AlignmentWrapperProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  verticalAlign?: 'top' | 'middle' | 'bottom';
  fullWidth?: boolean;
  fullHeight?: boolean;
}

const AlignmentWrapper: React.FC<AlignmentWrapperProps> = ({
  children,
  className = '',
  align = 'left',
  verticalAlign = 'top',
  fullWidth = false,
  fullHeight = false,
}) => {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const verticalAlignmentClasses = {
    top: 'items-start',
    middle: 'items-center',
    bottom: 'items-end',
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const heightClass = fullHeight ? 'h-full' : '';

  const combinedClasses = `${alignmentClasses[align]} ${verticalAlignmentClasses[verticalAlign]} ${widthClass} ${heightClass} ${className}`.trim();

  return (
    <div className={combinedClasses}>
      {children}
    </div>
  );
};

export default AlignmentWrapper;