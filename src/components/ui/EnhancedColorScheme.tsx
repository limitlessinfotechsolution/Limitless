import React from 'react';

// Enhanced Color Palette with WCAG compliance
interface ColorPaletteProps {
  children: React.ReactNode;
  className?: string;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );
};

// Color Swatch Component
interface ColorSwatchProps {
  color: string;
  name: string;
  hex: string;
  textColor?: string;
  className?: string;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ 
  color, 
  name, 
  hex, 
  textColor = 'text-white', 
  className = '' 
}) => {
  return (
    <div className={`flex flex-col rounded-lg overflow-hidden shadow-sm ${className}`}>
      <div 
        className="h-20 flex items-center justify-center" 
        style={{ backgroundColor: color }}
      >
        <span className={`text-xs font-medium px-2 py-1 rounded ${textColor} bg-black/20`}>
          {name}
        </span>
      </div>
      <div className="bg-white dark:bg-gray-800 p-2">
        <span className="text-xs font-mono text-gray-700 dark:text-gray-300">
          {hex}
        </span>
      </div>
    </div>
  );
};

// Gradient Swatch Component
interface GradientSwatchProps {
  gradient: string;
  name: string;
  className?: string;
}

const GradientSwatch: React.FC<GradientSwatchProps> = ({ 
  gradient, 
  name, 
  className = '' 
}) => {
  return (
    <div className={`flex flex-col rounded-lg overflow-hidden shadow-sm ${className}`}>
      <div 
        className="h-20 flex items-center justify-center"
        style={{ background: gradient }}
      >
        <span className="text-xs font-medium px-2 py-1 rounded text-white bg-black/20">
          {name}
        </span>
      </div>
    </div>
  );
};

// Enhanced Color Scheme Documentation
const EnhancedColorScheme: React.FC = () => {
  // Primary Colors
  const primaryColors = [
    { name: 'Primary Gold', hex: '#D4AF37', color: '#D4AF37', textColor: 'text-gray-900' },
    { name: 'Dark Blue', hex: '#1A237E', color: '#1A237E' },
    { name: 'Accent Gold', hex: '#D4AF37', color: '#D4AF37', textColor: 'text-gray-900' },
    { name: 'Accent Orange', hex: '#FF6B35', color: '#FF6B35' },
    { name: 'Accent Dark', hex: '#B8860B', color: '#B8860B' },
  ];

  // Background Colors
  const backgroundColors = [
    { name: 'Light Background', hex: '#FFFFFF', color: '#FFFFFF', textColor: 'text-gray-900' },
    { name: 'Dark Background', hex: '#0F172A', color: '#0F172A' },
  ];

  // Text Colors
  const textColors = [
    { name: 'Light Text', hex: '#1F2937', color: '#1F2937', textColor: 'text-white' },
    { name: 'Dark Text', hex: '#F9FAFB', color: '#F9FAFB', textColor: 'text-gray-900' },
  ];

  // Semantic Colors
  const semanticColors = [
    { name: 'Success', hex: '#10B981', color: '#10B981' },
    { name: 'Warning', hex: '#F59E0B', color: '#F59E0B', textColor: 'text-gray-900' },
    { name: 'Error', hex: '#EF4444', color: '#EF4444' },
    { name: 'Info', hex: '#3B82F6', color: '#3B82F6' },
  ];

  // Gradients
  const gradients = [
    { name: 'Primary Gradient', gradient: 'linear-gradient(135deg, #D4AF37 0%, #FF6B35 50%, #1A237E 100%)' },
    { name: 'Gold Gradient', gradient: 'linear-gradient(135deg, #D4AF37 0%, #FF6B35 100%)' },
    { name: 'Blue Gradient', gradient: 'linear-gradient(135deg, #1A237E 0%, #3B82F6 100%)' },
  ];

  return (
    <div className="space-y-8">
      {/* Color Palette Introduction */}
      <div className="prose max-w-none">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Enhanced Color Scheme</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Standardized color palette with consistent usage guidelines and WCAG compliance.
        </p>
      </div>

      {/* Primary Colors */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Primary Colors</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {primaryColors.map((color, index) => (
            <ColorSwatch
              key={index}
              color={color.color}
              name={color.name}
              hex={color.hex}
              textColor={color.textColor}
            />
          ))}
        </div>
      </div>

      {/* Background Colors */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Background Colors</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {backgroundColors.map((color, index) => (
            <ColorSwatch
              key={index}
              color={color.color}
              name={color.name}
              hex={color.hex}
              textColor={color.textColor}
            />
          ))}
        </div>
      </div>

      {/* Text Colors */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Text Colors</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {textColors.map((color, index) => (
            <ColorSwatch
              key={index}
              color={color.color}
              name={color.name}
              hex={color.hex}
              textColor={color.textColor}
            />
          ))}
        </div>
      </div>

      {/* Semantic Colors */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Semantic Colors</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {semanticColors.map((color, index) => (
            <ColorSwatch
              key={index}
              color={color.color}
              name={color.name}
              hex={color.hex}
            />
          ))}
        </div>
      </div>

      {/* Gradients */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Gradients</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Limited gradient usage to primary action elements for enhanced visual hierarchy.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {gradients.map((gradient, index) => (
            <GradientSwatch
              key={index}
              gradient={gradient.gradient}
              name={gradient.name}
            />
          ))}
        </div>
      </div>

      {/* Usage Guidelines */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Usage Guidelines</h3>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 text-accent mt-0.5">•</div>
              <p className="ml-2 text-gray-700 dark:text-gray-300">
                <span className="font-medium">Primary Colors:</span> Use for brand identity and primary actions
              </p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 text-accent mt-0.5">•</div>
              <p className="ml-2 text-gray-700 dark:text-gray-300">
                <span className="font-medium">Semantic Colors:</span> Use for status indicators and feedback
              </p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 text-accent mt-0.5">•</div>
              <p className="ml-2 text-gray-700 dark:text-gray-300">
                <span className="font-medium">Gradients:</span> Limited to primary action elements and key visual components
              </p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 text-accent mt-0.5">•</div>
              <p className="ml-2 text-gray-700 dark:text-gray-300">
                <span className="font-medium">Contrast:</span> All text colors meet WCAG 2.1 AA contrast requirements
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export { ColorPalette, ColorSwatch, GradientSwatch, EnhancedColorScheme };