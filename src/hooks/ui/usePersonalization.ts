import { useEffect, useState } from 'react';

interface UserPreferences {
  interests: string[];
  preferredContactMethod: 'email' | 'phone' | 'chat' | 'form';
  visitCount: number;
  lastVisit: Date | null;
  preferredServices: string[];
  engagementScore: number;
}

interface PersonalizedContent {
  headline: string;
  subheading: string;
  ctaText: string;
  recommendedServices: string[];
  contactMethod: 'email' | 'phone' | 'chat' | 'form';
}

export const usePersonalization = () => {
  // Check if we're running in a browser environment
  const isBrowser = typeof window !== 'undefined';
  
  const [preferences, setPreferences] = useState<UserPreferences>({
    interests: [],
    preferredContactMethod: 'form',
    visitCount: 0,
    lastVisit: null,
    preferredServices: [],
    engagementScore: 0
  });
  
  const [personalizedContent, setPersonalizedContent] = useState<PersonalizedContent>({
    headline: "Let's Connect",
    subheading: "Whether you have a question or are ready to start a project, we're here to help.",
    ctaText: "Get Started",
    recommendedServices: [],
    contactMethod: 'form'
  });

  // Load preferences from localStorage
  useEffect(() => {
    if (isBrowser) {
      const savedPreferences = localStorage.getItem('userPreferences');
      if (savedPreferences) {
        try {
          const parsed = JSON.parse(savedPreferences);
          setPreferences({
            ...parsed,
            lastVisit: parsed.lastVisit ? new Date(parsed.lastVisit) : null
          });
        } catch {
          // If parsing fails, use default preferences
        }
      } else {
        // First visit - initialize preferences
        const newPreferences: UserPreferences = {
          interests: [],
          preferredContactMethod: 'form',
          visitCount: 1,
          lastVisit: new Date(),
          preferredServices: [],
          engagementScore: 0
        };
        setPreferences(newPreferences);
        localStorage.setItem('userPreferences', JSON.stringify(newPreferences));
      }
    }
  }, [isBrowser]);

  // Save preferences to localStorage
  useEffect(() => {
    if (isBrowser && preferences.lastVisit) {
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
    }
  }, [preferences, isBrowser]);

  // Update preferences based on user interactions
  const updatePreferences = (updates: Partial<UserPreferences>) => {
    if (!isBrowser) return; // Don't run on server
    
    setPreferences(prev => {
      const updated = { ...prev, ...updates, lastVisit: new Date() };
      
      // Increment visit count if this is a new visit (more than 1 hour since last)
      if (!prev.lastVisit || (updated.lastVisit.getTime() - prev.lastVisit.getTime()) > 3600000) {
        updated.visitCount = prev.visitCount + 1;
      }
      
      return updated;
    });
  };

  // Generate personalized content based on preferences
  useEffect(() => {
    if (!isBrowser) return; // Don't run on server
    
    const content: PersonalizedContent = {
      headline: "Let's Connect",
      subheading: "Whether you have a question or are ready to start a project, we're here to help.",
      ctaText: "Get Started",
      recommendedServices: [],
      contactMethod: preferences.preferredContactMethod
    };

    // Personalize headline based on visit count
    if (preferences.visitCount > 1) {
      content.headline = `Welcome Back!`;
    }
    
    if (preferences.visitCount > 3) {
      content.headline = `Great to See You Again!`;
    }

    // Personalize subheading based on interests
    if (preferences.interests.length > 0) {
      const interestList = preferences.interests.join(', ');
      content.subheading = `We see you're interested in ${interestList}. Let's discuss how we can help with your ${interestList} projects.`;
    }

    // Personalize CTA based on engagement
    if (preferences.engagementScore > 5) {
      content.ctaText = "Let's Talk";
    } else if (preferences.engagementScore > 10) {
      content.ctaText = "Schedule a Call";
    }

    // Recommend services based on interests
    if (preferences.interests.includes('web')) {
      content.recommendedServices.push('Web Development');
    }
    if (preferences.interests.includes('mobile')) {
      content.recommendedServices.push('Mobile Apps');
    }
    if (preferences.interests.includes('ai') || preferences.interests.includes('automation')) {
      content.recommendedServices.push('AI & Automation');
    }
    if (preferences.interests.includes('cloud')) {
      content.recommendedServices.push('Cloud Solutions');
    }

    // If no specific recommendations, show popular services
    if (content.recommendedServices.length === 0) {
      content.recommendedServices = ['Web Development', 'Mobile Apps', 'AI & Automation'];
    }

    setPersonalizedContent(content);
  }, [preferences, isBrowser]);

  // Track user interest
  const trackInterest = (interest: string) => {
    if (!isBrowser) return; // Don't run on server
    
    updatePreferences({
      interests: [...new Set([...preferences.interests, interest])],
      engagementScore: preferences.engagementScore + 1
    });
  };

  // Track contact method preference
  const trackContactMethod = (method: 'email' | 'phone' | 'chat' | 'form') => {
    if (!isBrowser) return; // Don't run on server
    
    updatePreferences({
      preferredContactMethod: method,
      engagementScore: preferences.engagementScore + 2
    });
  };

  // Track service interest
  const trackServiceInterest = (service: string) => {
    if (!isBrowser) return; // Don't run on server
    
    updatePreferences({
      preferredServices: [...new Set([...preferences.preferredServices, service])],
      engagementScore: preferences.engagementScore + 1
    });
  };

  // Return null if not in browser environment
  if (!isBrowser) {
    return null;
  }

  return {
    preferences,
    personalizedContent,
    trackInterest,
    trackContactMethod,
    trackServiceInterest,
    updatePreferences
  };
};