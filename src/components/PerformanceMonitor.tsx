'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface PerformanceMetrics {
  FCP: number | null;
  LCP: number | null;
  FID: number | null;
  CLS: number | null;
  TTFB: number | null;
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    FCP: null,
    LCP: null,
    FID: null,
    CLS: null,
    TTFB: null,
  });
  const pathname = usePathname();

  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') return;

    let observer: PerformanceObserver | null = null;
    let clsValue = 0;

    // First Contentful Paint
    const measureFCP = () => {
      const paintEntries = performance.getEntriesByType('paint');
      const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      if (fcp) {
        setMetrics(prev => ({ ...prev, FCP: fcp.startTime }));
      }
    };

    // Largest Contentful Paint
    const measureLCP = () => {
      observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        setMetrics(prev => ({ ...prev, LCP: lastEntry.startTime }));
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    };

    // First Input Delay
    const measureFID = () => {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const fidEntry = entry as PerformanceEventTiming;
          setMetrics(prev => ({ ...prev, FID: fidEntry.processingStart - fidEntry.startTime }));
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    };

    // Cumulative Layout Shift
    const measureCLS = () => {
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const clsEntry = entry as unknown as { hadRecentInput: boolean; value: number };
          if (!clsEntry.hadRecentInput) {
            clsValue += clsEntry.value;
          }
        });
        setMetrics(prev => ({ ...prev, CLS: clsValue }));
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    };

    // Time to First Byte
    const measureTTFB = () => {
      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navigationEntries.length > 0) {
        const ttfb = navigationEntries[0].responseStart - navigationEntries[0].requestStart;
        setMetrics(prev => ({ ...prev, TTFB: ttfb }));
      }
    };

    // Initialize measurements
    measureFCP();
    measureLCP();
    measureFID();
    measureCLS();
    measureTTFB();

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [pathname]);

  // Send metrics after page load
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;

    const sendMetrics = () => {
      const analyticsData = {
        page: pathname,
        timestamp: Date.now(),
        metrics,
        userAgent: navigator.userAgent,
        url: window.location.href,
      };

      // Send to your analytics endpoint
      if (typeof window !== 'undefined') {
        fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(analyticsData),
        }).catch(console.error);
      }
    };

    if (document.readyState === 'complete') {
      setTimeout(sendMetrics, 0);
    } else {
      window.addEventListener('load', () => setTimeout(sendMetrics, 0));
    }
  }, [pathname, metrics]);

  // Development mode: show metrics in console
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Performance Metrics:', metrics);
    }
  }, [metrics]);

  // Don't render anything in production
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  // Development mode: show metrics overlay
  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs font-mono z-50 max-w-xs">
      <div className="font-bold mb-2">Performance Metrics</div>
      <div>FCP: {metrics.FCP ? `${metrics.FCP.toFixed(0)}ms` : '...'}</div>
      <div>LCP: {metrics.LCP ? `${metrics.LCP.toFixed(0)}ms` : '...'}</div>
      <div>FID: {metrics.FID ? `${metrics.FID.toFixed(0)}ms` : '...'}</div>
      <div>CLS: {metrics.CLS ? metrics.CLS.toFixed(4) : '...'}</div>
      <div>TTFB: {metrics.TTFB ? `${metrics.TTFB.toFixed(0)}ms` : '...'}</div>
    </div>
  );
};

export default PerformanceMonitor;
