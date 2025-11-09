// Only import and use analytics on the client side
// import { supabase } from './supabaseClient'; // Remove unused import

export interface AnalyticsEvent {
  id?: string;
  event_type: string;
  event_category?: string;
  event_action?: string;
  event_label?: string;
  event_value?: number;
  event_data: Record<string, unknown>;
  user_id?: string;
  session_id?: string;
  page_url?: string;
  page_title?: string;
  referrer?: string;
  user_agent?: string;
  ip_address?: string;
  device_info?: Record<string, unknown>;
  geolocation?: Record<string, unknown>;
  campaign_info?: Record<string, unknown>;
  custom_parameters?: Record<string, unknown>;
  created_at?: string;
}

class Analytics {
  private sessionId: string;
  private events: AnalyticsEvent[] = [];
  private flushInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Only initialize on client side
    if (typeof window !== 'undefined') {
      this.sessionId = this.generateSessionId();
      this.startFlushInterval();
    } else {
      this.sessionId = 'server-session';
    }
  }

  private generateSessionId(): string {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      let sessionId = localStorage.getItem('analytics_session_id');
      if (!sessionId) {
        // Use crypto.randomUUID if available, otherwise fallback to Math.random
        sessionId = typeof crypto !== 'undefined' && crypto.randomUUID 
          ? crypto.randomUUID() 
          : 'session-' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('analytics_session_id', sessionId);
      }
      return sessionId;
    }
    return 'server-session';
  }

  private startFlushInterval() {
    if (typeof window !== 'undefined') {
      this.flushInterval = setInterval(() => {
        this.flush();
      }, 30000); // Flush every 30 seconds
    }
  }

  private async flush() {
    // Only flush on client side
    if (typeof window === 'undefined' || this.events.length === 0) return;

    const eventsToSend = [...this.events];
    this.events = [];

    try {
      // Skip analytics events insertion for now to avoid type issues
      // This is a temporary solution until we can properly generate types
      console.log('Analytics events would be sent:', eventsToSend);
    } catch (error) {
      console.error('Analytics flush error:', error);
      // Re-queue events on failure
      this.events.unshift(...eventsToSend);
    }
  }

  track(eventType: string, eventData: Record<string, unknown> = {}) {
    // Only track on client side
    if (typeof window === 'undefined') return;

    const event: AnalyticsEvent = {
      event_type: eventType,
      event_data: eventData,
      session_id: this.sessionId,
      page_url: typeof window !== 'undefined' ? window.location.href : undefined,
      page_title: typeof document !== 'undefined' ? document.title : undefined,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    };

    this.events.push(event);

    // For immediate events like page views, flush immediately
    if (eventType === 'page_view') {
      this.flush();
    }
  }

  trackPageView(page: string) {
    this.track('page_view', { page });
  }

  trackUserInteraction(action: string, element: string, details?: Record<string, unknown>) {
    this.track('user_interaction', { action, element, ...details });
  }

  trackChatbotInteraction(message: string, response: string, sessionId: string) {
    this.track('chatbot_interaction', { message, response, session_id: sessionId });
  }

  trackFormSubmission(formType: string, success: boolean, details?: Record<string, unknown>) {
    this.track('form_submission', { form_type: formType, success, ...details });
  }

  trackError(error: Error, context?: Record<string, unknown>) {
    this.track('error', {
      message: error.message,
      stack: error.stack,
      ...context,
    });
  }

  destroy() {
    if (typeof window !== 'undefined' && this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
    this.flush(); // Final flush
  }
}

// Singleton instance
let analyticsInstance: Analytics | null = null;

export const getAnalytics = (): Analytics => {
  // Only create instance on client side
  if (typeof window === 'undefined') {
    // Return a mock instance that does nothing on the server
    return new Analytics();
  }
  
  if (!analyticsInstance) {
    analyticsInstance = new Analytics();
  }
  return analyticsInstance;
};

export const trackPageView = (page: string) => {
  if (typeof window !== 'undefined') {
    getAnalytics().trackPageView(page);
  }
};
export const trackUserInteraction = (action: string, element: string, details?: Record<string, unknown>) => {
  if (typeof window !== 'undefined') {
    getAnalytics().trackUserInteraction(action, element, details);
  }
};
export const trackChatbotInteraction = (message: string, response: string, sessionId: string) => {
  if (typeof window !== 'undefined') {
    getAnalytics().trackChatbotInteraction(message, response, sessionId);
  }
};
export const trackFormSubmission = (formType: string, success: boolean, details?: Record<string, unknown>) => {
  if (typeof window !== 'undefined') {
    getAnalytics().trackFormSubmission(formType, success, details);
  }
};
export const trackError = (error: Error, context?: Record<string, unknown>) => {
  if (typeof window !== 'undefined') {
    getAnalytics().trackError(error, context);
  }
};