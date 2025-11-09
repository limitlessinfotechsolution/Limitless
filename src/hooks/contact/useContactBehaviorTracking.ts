import { useEffect, useRef } from 'react';
import { getAnalytics } from '../../lib/analytics/analytics';

interface ContactBehaviorData {
  timeOnPage: number;
  scrollDepth: number;
  formInteractions: number;
  chatInteractions: number;
  faqExpansions: number;
  socialClicks: number;
}

export const useContactBehaviorTracking = () => {
  // Only initialize refs on client side
  const analytics = typeof window !== 'undefined' ? getAnalytics() : null;
  const startTime = useRef<number>(typeof window !== 'undefined' ? Date.now() : 0);
  const maxScrollDepth = useRef<number>(0);
  const formInteractions = useRef<number>(0);
  const chatInteractions = useRef<number>(0);
  const faqExpansions = useRef<number>(0);
  const socialClicks = useRef<number>(0);
  const tracked = useRef<boolean>(false);

  // Track scroll depth
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      if (scrollPercent > maxScrollDepth.current) {
        maxScrollDepth.current = scrollPercent;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track page unload to send final data
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    const handleBeforeUnload = () => {
      if (!tracked.current && analytics) {
        tracked.current = true;
        const behaviorData: ContactBehaviorData = {
          timeOnPage: Math.round((Date.now() - startTime.current) / 1000),
          scrollDepth: maxScrollDepth.current,
          formInteractions: formInteractions.current,
          chatInteractions: chatInteractions.current,
          faqExpansions: faqExpansions.current,
          socialClicks: socialClicks.current
        };

        analytics.track('contact_page_behavior', {
          timeOnPage: behaviorData.timeOnPage,
          scrollDepth: behaviorData.scrollDepth,
          formInteractions: behaviorData.formInteractions,
          chatInteractions: behaviorData.chatInteractions,
          faqExpansions: behaviorData.faqExpansions,
          socialClicks: behaviorData.socialClicks
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [analytics]);

  // Return tracking functions
  return {
    trackFormInteraction: () => {
      if (typeof window === 'undefined' || !analytics) return;
      formInteractions.current += 1;
      analytics.trackUserInteraction('form_interaction', 'contact_form');
    },
    
    trackChatInteraction: () => {
      if (typeof window === 'undefined' || !analytics) return;
      chatInteractions.current += 1;
      analytics.trackUserInteraction('chat_interaction', 'live_chat');
    },
    
    trackFAQExpansion: () => {
      if (typeof window === 'undefined' || !analytics) return;
      faqExpansions.current += 1;
      analytics.trackUserInteraction('faq_expansion', 'faq_section');
    },
    
    trackSocialClick: (platform: string) => {
      if (typeof window === 'undefined' || !analytics) return;
      socialClicks.current += 1;
      analytics.trackUserInteraction('social_click', 'social_media', { platform });
    },
    
    trackTabSwitch: (tab: string) => {
      if (typeof window === 'undefined' || !analytics) return;
      analytics.trackUserInteraction('tab_switch', 'contact_tabs', { tab });
    }
  };
};