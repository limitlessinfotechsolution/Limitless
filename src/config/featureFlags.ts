// Feature Flags Configuration
export const FEATURE_FLAGS = {
  // Analytics
  analytics: {
    enabled: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true',
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
    mixpanelToken: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN,
  },

  // Chatbot
  chatbot: {
    enabled: process.env.NEXT_PUBLIC_CHATBOT_ENABLED !== 'false',
    auralisAI: process.env.NEXT_PUBLIC_AURALIS_AI_ENABLED === 'true',
    googleAI: process.env.NEXT_PUBLIC_GOOGLE_AI_ENABLED === 'true',
  },

  // Admin features
  admin: {
    enabled: process.env.NEXT_PUBLIC_ADMIN_ENABLED === 'true',
    dashboard: process.env.NEXT_PUBLIC_ADMIN_DASHBOARD_ENABLED === 'true',
    testimonials: process.env.NEXT_PUBLIC_ADMIN_TESTIMONIALS_ENABLED === 'true',
    pages: process.env.NEXT_PUBLIC_ADMIN_PAGES_ENABLED === 'true',
  },

  // Email features
  email: {
    enabled: process.env.NEXT_PUBLIC_EMAIL_ENABLED === 'true',
    resend: process.env.NEXT_PUBLIC_RESEND_ENABLED === 'true',
    smtp: process.env.NEXT_PUBLIC_SMTP_ENABLED === 'true',
  },

  // PWA features
  pwa: {
    enabled: process.env.NEXT_PUBLIC_PWA_ENABLED !== 'false',
    offlineMode: process.env.NEXT_PUBLIC_OFFLINE_MODE_ENABLED === 'true',
  },

  // Development features
  development: {
    debugMode: process.env.NODE_ENV === 'development',
    mockData: process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true',
    errorReporting: process.env.NEXT_PUBLIC_ERROR_REPORTING_ENABLED === 'true',
  },

  // Performance features
  performance: {
    lazyLoading: process.env.NEXT_PUBLIC_LAZY_LOADING_ENABLED !== 'false',
    codeSplitting: process.env.NEXT_PUBLIC_CODE_SPLITTING_ENABLED !== 'false',
    imageOptimization: process.env.NEXT_PUBLIC_IMAGE_OPTIMIZATION_ENABLED !== 'false',
  },

  // Security features
  security: {
    csrfProtection: process.env.NEXT_PUBLIC_CSRF_PROTECTION_ENABLED === 'true',
    rateLimiting: process.env.NEXT_PUBLIC_RATE_LIMITING_ENABLED !== 'false',
    inputValidation: process.env.NEXT_PUBLIC_INPUT_VALIDATION_ENABLED !== 'false',
  },
} as const;

// Helper function to check if a feature is enabled
export const isFeatureEnabled = (featurePath: string): boolean => {
  const keys = featurePath.split('.');
  let value: unknown = FEATURE_FLAGS;

  for (const key of keys) {
    if (value && typeof value === 'object' && value !== null && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return false;
    }
  }

  return Boolean(value);
};
