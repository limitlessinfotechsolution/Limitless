import React from 'react';

// Enhanced Responsive Container
interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  fluid?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({ 
  children, 
  className = '', 
  fluid = false,
  padding = 'md'
}) => {
  const paddingClasses = {
    none: '',
    sm: 'px-4',
    md: 'px-4 sm:px-6',
    lg: 'px-4 sm:px-6 lg:px-8'
  };

  const containerClasses = fluid 
    ? `${paddingClasses[padding]} ${className}`
    : `max-w-7xl mx-auto ${paddingClasses[padding]} ${className}`;

  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
};

// Enhanced Grid System
interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({ 
  children, 
  className = '', 
  cols = { xs: 1, sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 'md'
}) => {
  const gapClasses = {
    none: '',
    sm: 'gap-4',
    md: 'gap-4 sm:gap-6',
    lg: 'gap-4 sm:gap-6 md:gap-8',
    xl: 'gap-4 sm:gap-6 md:gap-8 lg:gap-10'
  };

  // Generate responsive grid classes
  const gridClasses = [
    'grid',
    cols.xs ? `grid-cols-${cols.xs}` : 'grid-cols-1',
    cols.sm ? `sm:grid-cols-${cols.sm}` : '',
    cols.md ? `md:grid-cols-${cols.md}` : '',
    cols.lg ? `lg:grid-cols-${cols.lg}` : '',
    cols.xl ? `xl:grid-cols-${cols.xl}` : '',
    gapClasses[gap],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
};

// Enhanced Flex Container
interface ResponsiveFlexProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const ResponsiveFlex: React.FC<ResponsiveFlexProps> = ({ 
  children, 
  className = '', 
  direction = 'row',
  wrap = 'nowrap',
  justify = 'start',
  align = 'stretch',
  gap = 'md'
}) => {
  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'col-reverse': 'flex-col-reverse'
  };

  const wrapClasses = {
    wrap: 'flex-wrap',
    nowrap: 'flex-nowrap',
    'wrap-reverse': 'flex-wrap-reverse'
  };

  const justifyClasses = {
    start: 'justify-start',
    end: 'justify-end',
    center: 'justify-center',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  };

  const alignClasses = {
    start: 'items-start',
    end: 'items-end',
    center: 'items-center',
    baseline: 'items-baseline',
    stretch: 'items-stretch'
  };

  const gapClasses = {
    none: '',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  };

  const flexClasses = [
    'flex',
    directionClasses[direction],
    wrapClasses[wrap],
    justifyClasses[justify],
    alignClasses[align],
    gapClasses[gap],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={flexClasses}>
      {children}
    </div>
  );
};

// Enhanced Spacing Component
interface ResponsiveSpacingProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  direction?: 'vertical' | 'horizontal' | 'both';
  className?: string;
}

const ResponsiveSpacing: React.FC<ResponsiveSpacingProps> = ({ 
  size = 'md',
  direction = 'vertical',
  className = ''
}) => {
  const spacingClasses = {
    xs: {
      vertical: 'py-2',
      horizontal: 'px-2',
      both: 'p-2'
    },
    sm: {
      vertical: 'py-4',
      horizontal: 'px-4',
      both: 'p-4'
    },
    md: {
      vertical: 'py-6',
      horizontal: 'px-6',
      both: 'p-6'
    },
    lg: {
      vertical: 'py-8',
      horizontal: 'px-8',
      both: 'p-8'
    },
    xl: {
      vertical: 'py-12',
      horizontal: 'px-12',
      both: 'p-12'
    },
    '2xl': {
      vertical: 'py-16',
      horizontal: 'px-16',
      both: 'p-16'
    },
    '3xl': {
      vertical: 'py-20',
      horizontal: 'px-20',
      both: 'p-20'
    }
  };

  const classes = [
    spacingClasses[size][direction],
    className
  ].filter(Boolean).join(' ');

  return <div className={classes} />;
};

// Enhanced Card Component with Responsive Design
interface ResponsiveCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: 'none' | 'lift' | 'glow';
}

const ResponsiveCard: React.FC<ResponsiveCardProps> = ({ 
  children, 
  className = '', 
  variant = 'elevated',
  padding = 'md',
  rounded = 'lg',
  shadow = 'md',
  hover = 'none'
}) => {
  const variantClasses = {
    elevated: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    outlined: 'bg-transparent border border-gray-300 dark:border-gray-600',
    filled: 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
  };

  const paddingClasses = {
    none: '',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8'
  };

  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full'
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };

  const hoverClasses = {
    none: '',
    lift: 'hover:shadow-lg hover:-translate-y-1 transition-all duration-300',
    glow: 'hover:shadow-lg hover:shadow-accent/20 transition-all duration-300'
  };

  const cardClasses = [
    variantClasses[variant],
    paddingClasses[padding],
    roundedClasses[rounded],
    shadowClasses[shadow],
    hoverClasses[hover],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses}>
      {children}
    </div>
  );
};

// Enhanced Responsive Design Documentation
const EnhancedResponsive: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="prose max-w-none">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Enhanced Responsive Design</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Mobile-first responsive design with enhanced touch targets and improved spacing.
        </p>
      </div>

      {/* Touch Target Guidelines */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Touch Target Guidelines</h3>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 text-accent mt-0.5">•</div>
              <p className="ml-2 text-gray-700 dark:text-gray-300">
                <span className="font-medium">Minimum Size:</span> All interactive elements should be at least 44px in height
              </p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 text-accent mt-0.5">•</div>
              <p className="ml-2 text-gray-700 dark:text-gray-300">
                <span className="font-medium">Spacing:</span> Minimum 8px spacing between touch targets
              </p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 text-accent mt-0.5">•</div>
              <p className="ml-2 text-gray-700 dark:text-gray-300">
                <span className="font-medium">Navigation:</span> Mobile navigation should use larger touch targets with clear visual feedback
              </p>
            </li>
          </ul>
        </div>
      </div>

      {/* Breakpoint Information */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Responsive Breakpoints</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h4 className="font-medium text-gray-900 dark:text-white">Extra Small</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">0px - 639px</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Mobile</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h4 className="font-medium text-gray-900 dark:text-white">Small</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">640px - 767px</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Mobile</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h4 className="font-medium text-gray-900 dark:text-white">Medium</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">768px - 1023px</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Tablet</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h4 className="font-medium text-gray-900 dark:text-white">Large</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">1024px - 1279px</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Desktop</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h4 className="font-medium text-gray-900 dark:text-white">Extra Large</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">1280px+</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Desktop</p>
          </div>
        </div>
      </div>

      {/* Component Examples */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Responsive Component Examples</h3>
        
        {/* Responsive Grid Example */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Responsive Grid</h4>
          <ResponsiveGrid cols={{ xs: 1, sm: 2, md: 3, lg: 4 }} gap="md">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <ResponsiveCard key={item} padding="sm">
                <p className="text-center text-gray-700 dark:text-gray-300">Item {item}</p>
              </ResponsiveCard>
            ))}
          </ResponsiveGrid>
        </div>

        {/* Responsive Flex Example */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Responsive Flex</h4>
          <ResponsiveFlex 
            direction="col" 
            md-direction="row" 
            gap="md" 
            wrap="wrap"
          >
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex-1 min-w-[200px]">
                <ResponsiveCard padding="sm">
                  <p className="text-center text-gray-700 dark:text-gray-300">Flex Item {item}</p>
                </ResponsiveCard>
              </div>
            ))}
          </ResponsiveFlex>
        </div>
      </div>
    </div>
  );
};

export { 
  ResponsiveContainer, 
  ResponsiveGrid, 
  ResponsiveFlex, 
  ResponsiveSpacing, 
  ResponsiveCard,
  EnhancedResponsive
};