import React from 'react';

// Adaptive Container for fully responsive layouts
interface AdaptiveContainerProps {
  children: React.ReactNode;
  className?: string;
  fluid?: boolean;
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full' | 'none';
  responsivePadding?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    '2xl'?: string;
  };
}

const AdaptiveContainer: React.FC<AdaptiveContainerProps> = ({ 
  children, 
  className = '', 
  fluid = false,
  padding = 'md',
  maxWidth = '7xl',
  responsivePadding
}) => {
  // Base padding classes
  const basePaddingClasses = {
    none: '',
    xs: 'px-2 sm:px-3',
    sm: 'px-4 sm:px-5',
    md: 'px-4 sm:px-6 lg:px-8',
    lg: 'px-4 sm:px-6 lg:px-12 xl:px-16',
    xl: 'px-4 sm:px-6 lg:px-16 xl:px-20 2xl:px-24'
  };

  // Max width classes
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
    none: ''
  };

  // Custom responsive padding if provided
  const customPaddingClasses = responsivePadding 
    ? Object.entries(responsivePadding)
        .map(([breakpoint, value]) => `${breakpoint}:${value}`)
        .join(' ')
    : '';

  const containerClasses = fluid 
    ? `${basePaddingClasses[padding]} ${customPaddingClasses} ${className}`
    : `${maxWidthClasses[maxWidth]} mx-auto ${basePaddingClasses[padding]} ${customPaddingClasses} ${className}`;

  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
};

// Adaptive Grid for responsive layouts
interface AdaptiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: number | { 
    xs?: number; 
    sm?: number; 
    md?: number; 
    lg?: number; 
    xl?: number; 
    '2xl'?: number; 
  };
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  responsiveGap?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    '2xl'?: string;
  };
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
}

const AdaptiveGrid: React.FC<AdaptiveGridProps> = ({ 
  children, 
  className = '', 
  cols = 1,
  gap = 'md',
  responsiveGap,
  align = 'stretch',
  justify = 'start'
}) => {
  // Gap classes
  const gapClasses = {
    none: '',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
    '2xl': 'gap-10',
    '3xl': 'gap-12'
  };

  // Alignment classes
  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  };

  // Justify classes
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  };

  // Custom responsive gap if provided
  const customGapClasses = responsiveGap 
    ? Object.entries(responsiveGap)
        .map(([breakpoint, value]) => `${breakpoint}:${value}`)
        .join(' ')
    : '';

  // Handle responsive columns
  let gridColsClasses = '';
  if (typeof cols === 'number') {
    gridColsClasses = `grid-cols-${cols}`;
  } else {
    const colsObj = cols as { 
      xs?: number; 
      sm?: number; 
      md?: number; 
      lg?: number; 
      xl?: number; 
      '2xl'?: number; 
    };
    
    gridColsClasses = [
      colsObj.xs ? `grid-cols-${colsObj.xs}` : 'grid-cols-1',
      colsObj.sm ? `sm:grid-cols-${colsObj.sm}` : '',
      colsObj.md ? `md:grid-cols-${colsObj.md}` : '',
      colsObj.lg ? `lg:grid-cols-${colsObj.lg}` : '',
      colsObj.xl ? `xl:grid-cols-${colsObj.xl}` : '',
      colsObj['2xl'] ? `2xl:grid-cols-${colsObj['2xl']}` : ''
    ].filter(Boolean).join(' ');
  }

  const gridClasses = [
    'grid',
    gridColsClasses,
    gapClasses[gap],
    customGapClasses,
    alignClasses[align],
    justifyClasses[justify],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
};

// Adaptive Flex for responsive flexbox layouts
interface AdaptiveFlexProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  responsiveDirection?: {
    xs?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
    sm?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
    md?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
    lg?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
    xl?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
    '2xl'?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  };
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  responsiveGap?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    '2xl'?: string;
  };
}

const AdaptiveFlex: React.FC<AdaptiveFlexProps> = ({ 
  children, 
  className = '', 
  direction = 'row',
  responsiveDirection,
  wrap = 'nowrap',
  justify = 'start',
  align = 'stretch',
  gap = 'md',
  responsiveGap
}) => {
  // Direction classes
  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'col-reverse': 'flex-col-reverse'
  };

  // Wrap classes
  const wrapClasses = {
    wrap: 'flex-wrap',
    nowrap: 'flex-nowrap',
    'wrap-reverse': 'flex-wrap-reverse'
  };

  // Justify classes
  const justifyClasses = {
    start: 'justify-start',
    end: 'justify-end',
    center: 'justify-center',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  };

  // Align classes
  const alignClasses = {
    start: 'items-start',
    end: 'items-end',
    center: 'items-center',
    baseline: 'items-baseline',
    stretch: 'items-stretch'
  };

  // Gap classes
  const gapClasses = {
    none: '',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
    '2xl': 'gap-10',
    '3xl': 'gap-12'
  };

  // Base direction class
  const baseDirectionClass = directionClasses[direction];

  // Responsive direction classes
  const responsiveDirectionClasses = responsiveDirection 
    ? Object.entries(responsiveDirection)
        .map(([breakpoint, dir]) => `${breakpoint}:${directionClasses[dir]}`)
        .join(' ')
    : '';

  // Custom responsive gap if provided
  const customGapClasses = responsiveGap 
    ? Object.entries(responsiveGap)
        .map(([breakpoint, value]) => `${breakpoint}:${value}`)
        .join(' ')
    : '';

  const flexClasses = [
    'flex',
    baseDirectionClass,
    responsiveDirectionClasses,
    wrapClasses[wrap],
    justifyClasses[justify],
    alignClasses[align],
    gapClasses[gap],
    customGapClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={flexClasses}>
      {children}
    </div>
  );
};

// Adaptive Spacing for responsive spacing
interface AdaptiveSpacingProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  margin?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  responsivePadding?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    '2xl'?: string;
  };
  responsiveMargin?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    '2xl'?: string;
  };
}

const AdaptiveSpacing: React.FC<AdaptiveSpacingProps> = ({ 
  children,
  className = '',
  padding = 'none',
  margin = 'none',
  responsivePadding,
  responsiveMargin
}) => {
  // Padding classes
  const paddingClasses = {
    none: '',
    xs: 'p-1',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
    '2xl': 'p-10',
    '3xl': 'p-12'
  };

  // Margin classes
  const marginClasses = {
    none: '',
    xs: 'm-1',
    sm: 'm-2',
    md: 'm-4',
    lg: 'm-6',
    xl: 'm-8',
    '2xl': 'm-10',
    '3xl': 'm-12'
  };

  // Custom responsive padding if provided
  const customPaddingClasses = responsivePadding 
    ? Object.entries(responsivePadding)
        .map(([breakpoint, value]) => `${breakpoint}:${value}`)
        .join(' ')
    : '';

  // Custom responsive margin if provided
  const customMarginClasses = responsiveMargin 
    ? Object.entries(responsiveMargin)
        .map(([breakpoint, value]) => `${breakpoint}:${value}`)
        .join(' ')
    : '';

  const spacingClasses = [
    paddingClasses[padding],
    marginClasses[margin],
    customPaddingClasses,
    customMarginClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={spacingClasses}>
      {children}
    </div>
  );
};

// Adaptive Text for responsive typography
interface AdaptiveTextProps {
  children: React.ReactNode;
  className?: string;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
  responsiveSize?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    '2xl'?: string;
  };
  weight?: 'thin' | 'extralight' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  align?: 'left' | 'center' | 'right' | 'justify';
  color?: 'primary' | 'secondary' | 'accent' | 'muted' | 'white' | 'black' | 'inherit';
}

const AdaptiveText: React.FC<AdaptiveTextProps> = ({ 
  children,
  className = '',
  size = 'base',
  responsiveSize,
  weight = 'normal',
  align = 'left',
  color = 'inherit'
}) => {
  // Size classes
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
    '6xl': 'text-6xl',
    '7xl': 'text-7xl',
    '8xl': 'text-8xl',
    '9xl': 'text-9xl'
  };

  // Weight classes
  const weightClasses = {
    thin: 'font-thin',
    extralight: 'font-extralight',
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold',
    black: 'font-black'
  };

  // Alignment classes
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify'
  };

  // Color classes
  const colorClasses = {
    primary: 'text-gray-900 dark:text-gray-100',
    secondary: 'text-gray-600 dark:text-gray-400',
    accent: 'text-accent',
    muted: 'text-gray-500 dark:text-gray-500',
    white: 'text-white',
    black: 'text-black',
    inherit: 'text-inherit'
  };

  // Custom responsive size if provided
  const customSizeClasses = responsiveSize 
    ? Object.entries(responsiveSize)
        .map(([breakpoint, value]) => `${breakpoint}:${value}`)
        .join(' ')
    : '';

  const textClasses = [
    sizeClasses[size],
    weightClasses[weight],
    alignClasses[align],
    colorClasses[color],
    customSizeClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <p className={textClasses}>
      {children}
    </p>
  );
};

export { 
  AdaptiveContainer, 
  AdaptiveGrid, 
  AdaptiveFlex, 
  AdaptiveSpacing, 
  AdaptiveText
};