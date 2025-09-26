import { useEffect } from 'react';

export const useAnalytics = () => {
  // Track page views
  const trackPageView = (page: string) => {
    if (typeof window !== 'undefined') {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType: 'page_view',
          eventData: { page },
        }),
      }).catch((error) => {
        console.error('Failed to track page view:', error);
      });
    }
  };

  // Track site visits
  const trackSiteVisit = () => {
    if (typeof window !== 'undefined' && !sessionStorage.getItem('site_visited')) {
      sessionStorage.setItem('site_visited', 'true');
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType: 'site_visit',
        }),
      }).catch((error) => {
        console.error('Failed to track site visit:', error);
      });
    }
  };

  // Track chat feedback
  const trackChatFeedback = (messageId: string, feedback: 'positive' | 'negative', sessionId: string) => {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventType: 'chat_feedback',
        eventData: { messageId, feedback, sessionId },
      }),
    }).catch((error) => {
      console.error('Failed to track chat feedback:', error);
    });
  };

  // Track lead generation
  const trackLeadGeneration = () => {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventType: 'lead_generation',
      }),
    }).catch((error) => {
      console.error('Failed to track lead generation:', error);
    });
  };

  // Track client interaction
  const trackClientInteraction = () => {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventType: 'client_interaction',
      }),
    }).catch((error) => {
      console.error('Failed to track client interaction:', error);
    });
  };

  // Auto-track site visit on mount
  useEffect(() => {
    trackSiteVisit();
  }, []);

  return {
    trackPageView,
    trackChatFeedback,
    trackLeadGeneration,
    trackClientInteraction,
  };
};