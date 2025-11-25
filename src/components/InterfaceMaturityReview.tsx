'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, XCircle, AlertTriangle, Info, 
  Palette, Layout, Type, MousePointer, 
  Zap, Shield, BarChart3, Settings,
  Eye, ThumbsUp
} from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface Review {
  id: string;
  component: string;
  category: 'UI Design' | 'UI/UX' | 'Content' | 'Interaction' | 'Performance' | 'Security' | 'Analytics' | 'Settings';
  status: 'review' | 'mature' | 'needs-work';
  issues: string[];
  improvements: string[];
}

const InterfaceMaturityReview: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      component: 'Navigation',
      category: 'UI Design',
      status: 'mature',
      issues: [],
      improvements: [
        'Implemented responsive design',
        'Added keyboard navigation support',
        'Optimized for accessibility'
      ]
    }
  ]);

  const getCategoryIcon = (category: Review['category']) => {
    switch (category) {
      case 'UI Design':
        return <Palette className="w-5 h-5" />;
      case 'UI/UX':
        return <Layout className="w-5 h-5" />;
      case 'Content':
        return <Type className="w-5 h-5" />;
      case 'Interaction':
        return <MousePointer className="w-5 h-5" />;
      case 'Performance':
        return <Zap className="w-5 h-5" />;
      case 'Security':
        return <Shield className="w-5 h-5" />;
      case 'Analytics':
        return <BarChart3 className="w-5 h-5" />;
      case 'Settings':
        return <Settings className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getStatusIcon = (status: Review['status']) => {
    switch (status) {
      case 'mature':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'needs-work':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'review':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold mb-6">Interface Maturity Review</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(review.category)}
                  <span className="font-medium">{review.component}</span>
                </div>
                {getStatusIcon(review.status)}
              </div>
              
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {review.category}
              </div>
              
              {review.issues.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Issues</h4>
                  <ul className="text-sm space-y-1">
                    {review.issues.map((issue, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {review.improvements.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Improvements</h4>
                  <ul className="text-sm space-y-1">
                    {review.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default InterfaceMaturityReview;
