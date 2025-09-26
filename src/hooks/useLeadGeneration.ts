import { useState } from 'react';

interface LeadData {
  message: string;
  sessionId: string;
  userDetails?: Record<string, unknown>;
}

export const useLeadGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateLead = async (leadData: LeadData) => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/leads/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate lead');
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateLead,
    isGenerating,
    error,
  };
};