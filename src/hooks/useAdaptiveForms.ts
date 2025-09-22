import { useEffect, useState } from 'react';

interface FormAnalytics {
  submissionCount: number;
  commonFields: Record<string, number>;
  preferredSubjects: Record<string, number>;
  averageCompletionTime: number;
  lastSubmission: Date | null;
}

interface AdaptiveFormPreferences {
  suggestedSubjects: string[];
  fieldOrder: string[];
  prefillData: Record<string, string>;
  completionHints: Record<string, string>;
}

export const useAdaptiveForms = () => {
  const [analytics, setAnalytics] = useState<FormAnalytics>({
    submissionCount: 0,
    commonFields: {},
    preferredSubjects: {},
    averageCompletionTime: 0,
    lastSubmission: null
  });
  
  const [preferences, setPreferences] = useState<AdaptiveFormPreferences>({
    suggestedSubjects: ['Consultation', 'Support', 'Feedback', 'Other'],
    fieldOrder: ['name', 'email', 'subject', 'message'],
    prefillData: {},
    completionHints: {}
  });

  // Load analytics from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAnalytics = localStorage.getItem('formAnalytics');
      if (savedAnalytics) {
        try {
          const parsed = JSON.parse(savedAnalytics);
          setAnalytics({
            ...parsed,
            lastSubmission: parsed.lastSubmission ? new Date(parsed.lastSubmission) : null
          });
        } catch {
          // If parsing fails, use default analytics
        }
      }
    }
  }, []);

  // Save analytics to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('formAnalytics', JSON.stringify(analytics));
    }
  }, [analytics]);

  // Update analytics when a form is submitted
  const trackFormSubmission = (formData: Record<string, string>, submissionTime: number) => {
    setAnalytics(prev => {
      const newSubmissionCount = prev.submissionCount + 1;
      
      // Update common fields
      const newCommonFields = { ...prev.commonFields };
      Object.keys(formData).forEach(field => {
        newCommonFields[field] = (newCommonFields[field] || 0) + 1;
      });
      
      // Update preferred subjects
      const newPreferredSubjects = { ...prev.preferredSubjects };
      if (formData.subject) {
        newPreferredSubjects[formData.subject] = (newPreferredSubjects[formData.subject] || 0) + 1;
      }
      
      // Calculate new average completion time
      const newAverageCompletionTime = prev.lastSubmission 
        ? (prev.averageCompletionTime * prev.submissionCount + submissionTime) / newSubmissionCount
        : submissionTime;
      
      const updatedAnalytics = {
        submissionCount: newSubmissionCount,
        commonFields: newCommonFields,
        preferredSubjects: newPreferredSubjects,
        averageCompletionTime: newAverageCompletionTime,
        lastSubmission: new Date()
      };
      
      // Update preferences based on analytics
      updatePreferences(updatedAnalytics);
      
      return updatedAnalytics;
    });
  };

  // Update preferences based on analytics
  const updatePreferences = (analytics: FormAnalytics) => {
    // Suggest popular subjects
    const suggestedSubjects = Object.entries(analytics.preferredSubjects)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 4)
      .map(([subject]) => subject);
      
    // If we don't have enough data, use defaults
    if (suggestedSubjects.length < 4) {
      suggestedSubjects.push(...['Consultation', 'Support', 'Feedback', 'Other'].filter(
        subject => !suggestedSubjects.includes(subject)
      ));
    }
    
    // Determine field order based on completion frequency
    const fieldOrder = Object.entries(analytics.commonFields)
      .sort(([,a], [,b]) => b - a)
      .map(([field]) => field);
      
    // If we don't have enough data, use default order
    if (fieldOrder.length === 0) {
      fieldOrder.push('name', 'email', 'subject', 'message');
    }
    
    // Generate completion hints based on common patterns
    const completionHints: Record<string, string> = {};
    if (analytics.submissionCount > 5) {
      completionHints.message = "Based on previous submissions, including specific details about your project helps us provide better assistance.";
    }
    
    setPreferences({
      suggestedSubjects: suggestedSubjects.slice(0, 4),
      fieldOrder,
      prefillData: {}, // We'll handle prefilling separately
      completionHints
    });
  };

  // Get adaptive subject options
  const getAdaptiveSubjectOptions = () => {
    return preferences.suggestedSubjects.map(subject => ({
      value: subject,
      label: subject,
      isPopular: analytics.preferredSubjects[subject] > (analytics.submissionCount * 0.2)
    }));
  };

  // Get field order for adaptive layout
  const getFieldOrder = () => {
    return preferences.fieldOrder;
  };

  // Get completion hints for fields
  const getCompletionHints = () => {
    return preferences.completionHints;
  };

  return {
    analytics,
    preferences,
    trackFormSubmission,
    getAdaptiveSubjectOptions,
    getFieldOrder,
    getCompletionHints
  };
};