import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface AnalyticsEvent {
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

interface AnalyticsSummary {
  id: number;
  site_visits: number;
  clients_count: number;
  leads_count: number;
  last_updated: string;
}

export class EnhancedAnalytics {
  private sessionId: string;
  private events: AnalyticsEvent[] = [];
  private flushInterval: NodeJS.Timeout | null = null;
  private summary: AnalyticsSummary = {
    id: 1,
    site_visits: 0,
    clients_count: 0,
    leads_count: 0,
    last_updated: new Date().toISOString()
  };

  constructor() {
    // Only initialize on client side
    if (typeof window !== 'undefined') {
      this.sessionId = this.generateSessionId();
      this.startFlushInterval();
      this.loadAnalyticsSummary();
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

  private async loadAnalyticsSummary() {
    try {
      const { data, error } = await supabase
        .from('analytics_summary')
        .select('*')
        .single();

      if (!error && data) {
        this.summary = {
          id: data.id,
          site_visits: data.site_visits || 0,
          clients_count: data.clients_count || 0,
          leads_count: data.leads_count || 0,
          last_updated: data.last_updated || new Date().toISOString()
        };
      }
    } catch (error) {
      console.warn('Error loading analytics summary:', error);
    }
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
      // Insert events into database
      const { error } = await supabase
        .from('analytics_events')
        .insert(eventsToSend);

      if (error) {
        console.error('Analytics flush error:', error);
        // Re-queue events on failure
        this.events.unshift(...eventsToSend);
      }
    } catch (error) {
      console.error('Analytics flush error:', error);
      // Re-queue events on failure
      this.events.unshift(...eventsToSend);
    }
  }

  async track(eventType: string, eventData: Record<string, unknown> = {}) {
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

  async trackPageView(page: string) {
    await this.track('page_view', { page });
  }

  async trackUserInteraction(action: string, element: string, details?: Record<string, unknown>) {
    await this.track('user_interaction', { action, element, ...details });
  }

  async trackChatbotInteraction(message: string, response: string, sessionId: string) {
    await this.track('chatbot_interaction', { message, response, session_id: sessionId });
  }

  async trackFormSubmission(formType: string, success: boolean, details?: Record<string, unknown>) {
    await this.track('form_submission', { form_type: formType, success, ...details });
  }

  async trackError(error: Error, context?: Record<string, unknown>) {
    await this.track('error', {
      message: error.message,
      stack: error.stack,
      ...context,
    });
  }

  // Enhanced tracking methods for business metrics
  async trackSiteVisit() {
    this.summary.site_visits += 1;
    await this.updateAnalyticsSummary();
    await this.track('site_visit');
  }

  async trackClientInteraction() {
    this.summary.clients_count += 1;
    await this.updateAnalyticsSummary();
    await this.track('client_interaction');
  }

  async trackLeadGeneration() {
    this.summary.leads_count += 1;
    await this.updateAnalyticsSummary();
    await this.track('lead_generation');
  }

  async trackConversion(value: number, conversionType: string) {
    await this.track('conversion', { value, conversion_type: conversionType });
  }

  async trackUserEngagement(timeSpent: number, pagesViewed: number) {
    await this.track('user_engagement', { time_spent: timeSpent, pages_viewed: pagesViewed });
  }

  private async updateAnalyticsSummary() {
    try {
      this.summary.last_updated = new Date().toISOString();
      
      const { error } = await supabase
        .from('analytics_summary')
        .upsert(this.summary);

      if (error) {
        console.error('Error updating analytics summary:', error);
      }
    } catch (error) {
      console.error('Error updating analytics summary:', error);
    }
  }

  // Get current analytics data
  getAnalyticsData() {
    return { ...this.summary };
  }

  // Get analytics summary from database
  async getAnalyticsSummary(): Promise<AnalyticsSummary> {
    try {
      const { data, error } = await supabase
        .from('analytics_summary')
        .select('*')
        .single();

      if (!error && data) {
        return {
          id: data.id,
          site_visits: data.site_visits || 0,
          clients_count: data.clients_count || 0,
          leads_count: data.leads_count || 0,
          last_updated: data.last_updated || new Date().toISOString()
        };
      }
    } catch (error) {
      console.warn('Error fetching analytics summary:', error);
    }
    
    return this.summary;
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
let analyticsInstance: EnhancedAnalytics | null = null;

export const getEnhancedAnalytics = (): EnhancedAnalytics => {
  // Only create instance on client side
  if (typeof window === 'undefined') {
    // Return a mock instance that does nothing on the server
    return new EnhancedAnalytics();
  }
  
  if (!analyticsInstance) {
    analyticsInstance = new EnhancedAnalytics();
  }
  return analyticsInstance;
};

export const trackPageView = (page: string) => {
  if (typeof window !== 'undefined') {
    getEnhancedAnalytics().trackPageView(page);
  }
};

export const trackUserInteraction = (action: string, element: string, details?: Record<string, unknown>) => {
  if (typeof window !== 'undefined') {
    getEnhancedAnalytics().trackUserInteraction(action, element, details);
  }
};

export const trackChatbotInteraction = (message: string, response: string, sessionId: string) => {
  if (typeof window !== 'undefined') {
    getEnhancedAnalytics().trackChatbotInteraction(message, response, sessionId);
  }
};

export const trackFormSubmission = (formType: string, success: boolean, details?: Record<string, unknown>) => {
  if (typeof window !== 'undefined') {
    getEnhancedAnalytics().trackFormSubmission(formType, success, details);
  }
};

export const trackError = (error: Error, context?: Record<string, unknown>) => {
  if (typeof window !== 'undefined') {
    getEnhancedAnalytics().trackError(error, context);
  }
};

// Enhanced tracking functions
export const trackSiteVisit = () => {
  if (typeof window !== 'undefined') {
    getEnhancedAnalytics().trackSiteVisit();
  }
};

export const trackClientInteraction = () => {
  if (typeof window !== 'undefined') {
    getEnhancedAnalytics().trackClientInteraction();
  }
};

export const trackLeadGeneration = () => {
  if (typeof window !== 'undefined') {
    getEnhancedAnalytics().trackLeadGeneration();
  }
};

export const trackConversion = (value: number, conversionType: string) => {
  if (typeof window !== 'undefined') {
    getEnhancedAnalytics().trackConversion(value, conversionType);
  }
};

export const trackUserEngagement = (timeSpent: number, pagesViewed: number) => {
  if (typeof window !== 'undefined') {
    getEnhancedAnalytics().trackUserEngagement(timeSpent, pagesViewed);
  }
};