import React from 'react';

// Enhanced Typography Components
interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
  color?: string;
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  transform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
}

// Heading Components
interface HeadingProps extends TypographyProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  gradient?: boolean;
}

const Heading: React.FC<HeadingProps> = ({ 
  level = 1, 
  children, 
  className = '', 
  align = 'left',
  color = '',
  weight = 'bold',
  transform = 'none',
  gradient = false,
  ...props 
}) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify'
  };

  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold'
  };

  const transformClasses = {
    none: '',
    uppercase: 'uppercase',
    lowercase: 'lowercase',
    capitalize: 'capitalize'
  };

  const baseClasses = 'leading-tight';
  const alignClass = alignClasses[align];
  const weightClass = weightClasses[weight];
  const transformClass = transformClasses[transform];
  const colorClass = color || (gradient ? '' : 'text-gray-900 dark:text-white');

  const gradientClass = gradient ? 'bg-gradient-to-r from-accent to-accent-orange bg-clip-text text-transparent' : '';

  const combinedClasses = [
    baseClasses,
    alignClass,
    weightClass,
    transformClass,
    colorClass,
    gradientClass,
    className
  ].filter(Boolean).join(' ');

  // Render appropriate heading tag
  switch (level) {
    case 1:
      return <h1 className={combinedClasses} {...props}>{children}</h1>;
    case 2:
      return <h2 className={combinedClasses} {...props}>{children}</h2>;
    case 3:
      return <h3 className={combinedClasses} {...props}>{children}</h3>;
    case 4:
      return <h4 className={combinedClasses} {...props}>{children}</h4>;
    case 5:
      return <h5 className={combinedClasses} {...props}>{children}</h5>;
    case 6:
      return <h6 className={combinedClasses} {...props}>{children}</h6>;
    default:
      return <h1 className={combinedClasses} {...props}>{children}</h1>;
  }
};

// Paragraph Component
interface ParagraphProps extends TypographyProps {
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  lead?: boolean;
}

const Paragraph: React.FC<ParagraphProps> = ({ 
  children, 
  className = '', 
  align = 'left',
  color = '',
  weight = 'normal',
  transform = 'none',
  size = 'base',
  lead = false,
  ...props 
}) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify'
  };

  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold'
  };

  const transformClasses = {
    none: '',
    uppercase: 'uppercase',
    lowercase: 'lowercase',
    capitalize: 'capitalize'
  };

  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl'
  };

  const leadClass = lead ? 'leading-relaxed' : 'leading-normal';

  const baseClasses = '';
  const alignClass = alignClasses[align];
  const weightClass = weightClasses[weight];
  const transformClass = transformClasses[transform];
  const sizeClass = sizeClasses[size];
  const colorClass = color || 'text-gray-700 dark:text-gray-300';

  const combinedClasses = [
    baseClasses,
    alignClass,
    weightClass,
    transformClass,
    sizeClass,
    leadClass,
    colorClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <p className={combinedClasses} {...props}>
      {children}
    </p>
  );
};

// Text Component for inline text
interface TextProps extends TypographyProps {
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
}

const Text: React.FC<TextProps> = ({ 
  children, 
  className = '', 
  align = 'left',
  color = '',
  weight = 'normal',
  transform = 'none',
  size = 'base',
  italic = false,
  underline = false,
  strikethrough = false,
  ...props 
}) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify'
  };

  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold'
  };

  const transformClasses = {
    none: '',
    uppercase: 'uppercase',
    lowercase: 'lowercase',
    capitalize: 'capitalize'
  };

  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const italicClass = italic ? 'italic' : '';
  const underlineClass = underline ? 'underline' : '';
  const strikethroughClass = strikethrough ? 'line-through' : '';

  const baseClasses = '';
  const alignClass = alignClasses[align];
  const weightClass = weightClasses[weight];
  const transformClass = transformClasses[transform];
  const sizeClass = sizeClasses[size];
  const colorClass = color || 'text-gray-700 dark:text-gray-300';

  const combinedClasses = [
    baseClasses,
    alignClass,
    weightClass,
    transformClass,
    sizeClass,
    italicClass,
    underlineClass,
    strikethroughClass,
    colorClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={combinedClasses} {...props}>
      {children}
    </span>
  );
};

// List Components
interface ListProps {
  children: React.ReactNode;
  className?: string;
  type?: 'ul' | 'ol';
  spacing?: 'tight' | 'normal' | 'loose';
}

const List: React.FC<ListProps> = ({ 
  children, 
  className = '', 
  type = 'ul',
  spacing = 'normal',
  ...props 
}) => {
  const spacingClasses = {
    tight: 'space-y-1',
    normal: 'space-y-2',
    loose: 'space-y-3'
  };

  const baseClasses = 'text-gray-700 dark:text-gray-300';
  const spacingClass = spacingClasses[spacing];

  const combinedClasses = [
    baseClasses,
    spacingClass,
    className
  ].filter(Boolean).join(' ');

  // Render appropriate list tag
  if (type === 'ol') {
    return <ol className={combinedClasses} {...props}>{children}</ol>;
  }
  return <ul className={combinedClasses} {...props}>{children}</ul>;
};

interface ListItemProps {
  children: React.ReactNode;
  className?: string;
}

const ListItem: React.FC<ListItemProps> = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'flex items-start';
  const combinedClasses = [baseClasses, className].filter(Boolean).join(' ');

  return (
    <li className={combinedClasses} {...props}>
      <span className="mr-2 text-accent">•</span>
      <span>{children}</span>
    </li>
  );
};

export { Heading, Paragraph, Text, List, ListItem };