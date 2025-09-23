// UI Constants Configuration
export const UI_CONFIG = {
  // Colors
  colors: {
    primary: '#D4AF37', // Gold
    secondary: '#1A237E', // Dark Blue
    accent: '#D4AF37',
    accentOrange: '#FF6B35',
    accentDark: '#B8860B',
    background: {
      light: '#FFFFFF',
      dark: '#0F172A',
    },
    text: {
      light: '#1F2937',
      dark: '#F9FAFB',
    },
  },

  // Animations
  animations: {
    duration: {
      fast: 200,
      normal: 300,
      slow: 500,
    },
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Breakpoints (Tailwind defaults)
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Spacing
  spacing: {
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    section: 'py-16 sm:py-20 lg:py-24',
  },

  // Typography
  typography: {
    fontFamily: {
      primary: 'Inter, system-ui, sans-serif',
      secondary: 'Poppins, system-ui, sans-serif',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
      '7xl': '4.5rem',
    },
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },

  // Z-index layers
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },
} as const;
