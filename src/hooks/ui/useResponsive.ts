import { useState, useEffect } from 'react';

// Responsive design hook for device detection and adaptive behavior
export const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop' | 'large-desktop'>('desktop');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('landscape');
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Check if device supports touch
    const checkTouchDevice = () => {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    };

    // Update device type based on screen width
    const updateDeviceType = (width: number) => {
      if (width < 768) {
        return 'mobile';
      } else if (width < 1024) {
        return 'tablet';
      } else if (width < 1440) {
        return 'desktop';
      } else {
        return 'large-desktop';
      }
    };

    // Update orientation
    const updateOrientation = (width: number, height: number) => {
      return width > height ? 'landscape' : 'portrait';
    };

    // Handler for window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setWindowSize({
        width,
        height,
      });
      
      setDevice(updateDeviceType(width));
      setOrientation(updateOrientation(width, height));
      setIsTouchDevice(checkTouchDevice());
    };

    // Set initial values
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Breakpoint utilities
  const isMobile = device === 'mobile';
  const isTablet = device === 'tablet';
  const isDesktop = device === 'desktop';
  const isLargeDesktop = device === 'large-desktop';
  
  // Size utilities
  const isSmallScreen = windowSize.width < 640;
  const isMediumScreen = windowSize.width >= 768 && windowSize.width < 1024;
  const isLargeScreen = windowSize.width >= 1024 && windowSize.width < 1440;
  const isExtraLargeScreen = windowSize.width >= 1440;

  // Touch utilities
  const isHoverSupported = !isTouchDevice;
  
  // Grid column utilities based on device
  const getGridCols = (base: number, mobile?: number, tablet?: number, desktop?: number) => {
    if (isMobile && mobile) return mobile;
    if (isTablet && tablet) return tablet;
    if (isDesktop && desktop) return desktop;
    return base;
  };

  // Spacing utilities based on device
  const getResponsiveSpacing = (base: string, mobile?: string, tablet?: string, desktop?: string) => {
    if (isMobile && mobile) return mobile;
    if (isTablet && tablet) return tablet;
    if (isDesktop && desktop) return desktop;
    return base;
  };

  // Text size utilities based on device
  const getResponsiveTextSize = (base: string, mobile?: string, tablet?: string, desktop?: string) => {
    if (isMobile && mobile) return mobile;
    if (isTablet && tablet) return tablet;
    if (isDesktop && desktop) return desktop;
    return base;
  };

  return {
    // Window dimensions
    width: windowSize.width,
    height: windowSize.height,
    
    // Device information
    device,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    
    // Screen size information
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
    isExtraLargeScreen,
    
    // Orientation
    orientation,
    
    // Touch support
    isTouchDevice,
    isHoverSupported,
    
    // Utilities
    getGridCols,
    getResponsiveSpacing,
    getResponsiveTextSize,
  };
};

// Hook for adaptive grid layouts
export const useAdaptiveGrid = (baseCols: number, options?: {
  mobile?: number;
  tablet?: number;
  desktop?: number;
}) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  
  const cols = options 
    ? (isMobile ? (options.mobile || baseCols) : 
       isTablet ? (options.tablet || baseCols) : 
       isDesktop ? (options.desktop || baseCols) : baseCols)
    : baseCols;
  
  return { cols };
};

// Hook for adaptive spacing
export const useAdaptiveSpacing = (baseSpacing: string, options?: {
  mobile?: string;
  tablet?: string;
  desktop?: string;
}) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  
  const spacing = options 
    ? (isMobile ? (options.mobile || baseSpacing) : 
       isTablet ? (options.tablet || baseSpacing) : 
       isDesktop ? (options.desktop || baseSpacing) : baseSpacing)
    : baseSpacing;
  
  return { spacing };
};

// Hook for adaptive text sizing
export const useAdaptiveText = (baseSize: string, options?: {
  mobile?: string;
  tablet?: string;
  desktop?: string;
}) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  
  const size = options 
    ? (isMobile ? (options.mobile || baseSize) : 
       isTablet ? (options.tablet || baseSize) : 
       isDesktop ? (options.desktop || baseSize) : baseSize)
    : baseSize;
  
  return { size };
};

// Hook for touch-friendly interactions
export const useTouchFriendly = () => {
  const { isTouchDevice } = useResponsive();
  
  // Minimum touch target size (44px recommended)
  const touchTargetClasses = isTouchDevice 
    ? 'min-h-[44px] min-w-[44px] flex items-center justify-center' 
    : '';
  
  // Touch-friendly padding
  const touchPaddingClasses = isTouchDevice 
    ? 'p-3' 
    : 'p-2';
  
  // Touch-friendly hover effects
  const touchHoverClasses = isTouchDevice 
    ? 'active:scale-95 transition-transform duration-150' 
    : 'hover:scale-105 transition-transform duration-300';
  
  return {
    touchTargetClasses,
    touchPaddingClasses,
    touchHoverClasses,
    isTouchOptimized: isTouchDevice
  };
};