import { useState, useEffect } from 'react';

interface PerformanceMetrics {
  fcp: number | null;
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  ttfb: number | null;
  domContentLoaded: number | null;
  loadComplete: number | null;
}

// Utility function to get current performance metrics
export const getCurrentPerformanceMetrics = (): PerformanceMetrics => {
  if (typeof window === 'undefined') {
    return {
      fcp: null,
      lcp: null,
      fid: null,
      cls: null,
      ttfb: null,
      domContentLoaded: null,
      loadComplete: null
    };
  }

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const paintEntries = performance.getEntriesByType('paint');
  const lcpEntries = performance.getEntriesByType('largest-contentful-paint');

  return {
    fcp: paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || null,
    lcp: lcpEntries.length > 0 ? lcpEntries[lcpEntries.length - 1].startTime : null,
    fid: null, // Would need to be tracked separately
    cls: null, // Would need to be tracked separately
    ttfb: navigation ? navigation.responseStart - navigation.requestStart : null,
    domContentLoaded: navigation ? navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart : null,
    loadComplete: navigation ? navigation.loadEventEnd - navigation.loadEventStart : null
  };
};

// Hook for using performance metrics in components
export const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>(getCurrentPerformanceMetrics());

  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(getCurrentPerformanceMetrics());
    };

    // Update metrics on page load
    if (typeof window !== 'undefined') {
      window.addEventListener('load', updateMetrics);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('load', updateMetrics);
      }
    };
  }, []);

  return metrics;
};