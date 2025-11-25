import React, { useEffect } from 'react';
import { ChatMessage } from '../../types';


interface LeadOpportunityDetectorProps {
  messages: ChatMessage[];
  onLeadOpportunity: (opportunity: LeadOpportunity) => void;
}

interface LeadOpportunity {
  type: 'lead_generation' | 'sales_pitch' | 'support';
  confidence: number;
  message: string;
  userDetails: Record<string, unknown>;
}

const LeadOpportunityDetector: React.FC<LeadOpportunityDetectorProps> = ({ 
  messages, 
  onLeadOpportunity 
}) => {
  // Detect lead opportunities in chat messages
  useEffect(() => {
    if (messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];
    if (lastMessage.sender !== 'user') return;

    const message = lastMessage.content.toLowerCase();
    
    // Lead generation keywords
    const leadKeywords = [
      'project', 'quote', 'proposal', 'collaboration', 'work together',
      'get started', 'begin project', 'launch', 'develop', 'build',
      'budget', 'timeline', 'schedule', 'consultation', 'meeting'
    ];
    
    // Sales pitch keywords
    const salesKeywords = [
      'services', 'offerings', 'solutions', 'capabilities', 'expertise',
      'portfolio', 'case studies', 'examples', 'show me', 'demonstrate'
    ];
    
    // Support keywords
    const supportKeywords = [
      'issue', 'problem', 'bug', 'error', 'not working', 'help',
      'support', 'assistance', 'trouble', 'difficulty'
    ];
    
    // Count keyword matches
    const leadMatches = leadKeywords.filter(keyword => message.includes(keyword)).length;
    const salesMatches = salesKeywords.filter(keyword => message.includes(keyword)).length;
    const supportMatches = supportKeywords.filter(keyword => message.includes(keyword)).length;
    
    // Determine the most likely opportunity type
    const opportunities = [
      { type: 'lead_generation', matches: leadMatches },
      { type: 'sales_pitch', matches: salesMatches },
      { type: 'support', matches: supportMatches }
    ];
    
    const bestOpportunity = opportunities.reduce((prev, current) => 
      current.matches > prev.matches ? current : prev
    );
    
    // If we have a strong match, trigger lead opportunity
    if (bestOpportunity.matches >= 2) {
      const opportunity: LeadOpportunity = {
        type: bestOpportunity.type as 'lead_generation' | 'sales_pitch' | 'support',
        confidence: Math.min(bestOpportunity.matches * 0.3, 1.0),
        message: lastMessage.content,
        userDetails: {
          messageCount: messages.filter(m => m.sender === 'user').length,
          lastActive: new Date().toISOString()
        }
      };
      
      // Add a small delay to avoid triggering too quickly
      setTimeout(() => {
        onLeadOpportunity(opportunity);
      }, 1000);
    }
  }, [messages, onLeadOpportunity]);

  return null;
};

export default LeadOpportunityDetector;