import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, TrendingUp, AlertTriangle, X } from 'lucide-react';

interface LeadOpportunityNotificationProps {
  opportunity: {
    type: 'lead_generation' | 'sales_pitch' | 'support';
    confidence: number;
    message: string;
  };
  onDismiss: () => void;
  onAccept: () => void;
}

const LeadOpportunityNotification: React.FC<LeadOpportunityNotificationProps> = ({ 
  opportunity, 
  onDismiss, 
  onAccept 
}) => {
  const getOpportunityInfo = () => {
    switch (opportunity.type) {
      case 'lead_generation':
        return {
          title: 'Lead Generation Opportunity',
          description: 'This conversation shows strong potential for a new lead',
          icon: <UserPlus className="w-5 h-5" />,
          color: 'bg-green-500',
          action: 'Generate Lead'
        };
      case 'sales_pitch':
        return {
          title: 'Sales Pitch Opportunity',
          description: 'User is interested in our services and solutions',
          icon: <TrendingUp className="w-5 h-5" />,
          color: 'bg-blue-500',
          action: 'Show Services'
        };
      case 'support':
        return {
          title: 'Support Request',
          description: 'User may need technical assistance or support',
          icon: <AlertTriangle className="w-5 h-5" />,
          color: 'bg-orange-500',
          action: 'Escalate to Support'
        };
      default:
        return {
          title: 'Opportunity Detected',
          description: 'Potential business opportunity identified',
          icon: <UserPlus className="w-5 h-5" />,
          color: 'bg-purple-500',
          action: 'Take Action'
        };
    }
  };

  const info = getOpportunityInfo();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed bottom-24 right-6 z-50 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div className={`p-4 ${info.color} text-white flex items-center justify-between`}>
        <div className="flex items-center space-x-2">
          {info.icon}
          <h3 className="font-bold text-sm">{info.title}</h3>
        </div>
        <button 
          onClick={onDismiss}
          className="p-1 rounded-full hover:bg-white/20 transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="p-4">
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
          {info.description}
        </p>
        
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Message:</p>
          <p className="text-sm text-gray-800 dark:text-gray-200 truncate">
            "{opportunity.message}"
          </p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={onAccept}
            className="flex-1 bg-gradient-to-r from-accent to-accent-orange text-white py-2 px-4 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            {info.action}
          </button>
          <button
            onClick={onDismiss}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            Later
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default LeadOpportunityNotification;