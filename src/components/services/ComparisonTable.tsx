'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface ServicePlan {
  id: string;
  name: string;
  price: string;
  features: {
    name: string;
    included: boolean;
    description?: string;
  }[];
  popular?: boolean;
}

interface ComparisonTableProps {
  serviceId: string;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ serviceId }) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // Generate comparison data based on serviceId
  const getComparisonData = (serviceId: string): ServicePlan[] => {
    const baseFeatures = [
      { name: 'Custom Development', included: true, description: 'Tailored to your specific needs' },
      { name: 'Responsive Design', included: true, description: 'Mobile-first approach' },
      { name: 'Performance Optimization', included: true, description: 'Fast loading and smooth UX' },
      { name: 'Security Implementation', included: true, description: 'Enterprise-grade security' },
      { name: 'API Integration', included: false, description: 'Third-party service integration' },
      { name: 'Advanced Analytics', included: false, description: 'Detailed usage tracking' },
      { name: '24/7 Support', included: false, description: 'Round-the-clock technical support' },
      { name: 'Training & Documentation', included: false, description: 'User training and guides' }
    ];

    return [
      {
        id: 'basic',
        name: 'Basic',
        price: '$2,500',
        features: baseFeatures.map(f => ({ ...f, included: f.name === 'Custom Development' || f.name === 'Responsive Design' }))
      },
      {
        id: 'professional',
        name: 'Professional',
        price: '$5,000',
        features: baseFeatures.map(f => ({ ...f, included: f.name !== '24/7 Support' && f.name !== 'Training & Documentation' })),
        popular: true
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: '$10,000+',
        features: baseFeatures.map(f => ({ ...f, included: true }))
      }
    ];
  };

  const services = getComparisonData(serviceId);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-700">
            <th className="p-4 text-left font-semibold">Features</th>
            {services.map((service) => (
              <th key={service.id} className="p-4 text-center">
                <div className="space-y-2">
                  <div className="font-bold text-lg">{service.name}</div>
                  <div className="text-2xl font-bold text-accent">{service.price}</div>
                  {service.popular && (
                    <span className="inline-block bg-accent text-white px-2 py-1 rounded-full text-xs font-semibold">
                      Most Popular
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {services[0]?.features.map((feature, index) => (
            <tr key={index} className="border-t border-gray-200 dark:border-gray-600">
              <td className="p-4 font-medium">
                <div>
                  <div>{feature.name}</div>
                  {feature.description && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {feature.description}
                    </div>
                  )}
                </div>
              </td>
              {services.map((service) => {
                const serviceFeature = service.features[index];
                return (
                  <td key={service.id} className="p-4 text-center">
                    {serviceFeature?.included ? (
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-red-500 mx-auto" />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="p-4"></td>
            {services.map((service) => (
              <td key={service.id} className="p-4 text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedPlan(service.id)}
                  className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                    service.popular
                      ? 'bg-accent text-white hover:bg-accent-dark'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {selectedPlan === service.id ? 'Selected' : 'Select Plan'}
                </motion.button>
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ComparisonTable;
