import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  X,
  Star,
  Users,
  Shield,
  TrendingUp,
  ArrowRight,
  BadgeCheck
} from 'lucide-react';
import Button from '../ui/Button';
import { Card } from';

interface PricingFeature {
  name: string;
  basic: boolean | string;
  pro: boolean | string;
  enterprise: boolean | string;
}

interface PricingPlan {
  id: string;
  name: string;
  price: {
    monthly: number;
    annually: number;
  };
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
  icon: React.ReactNode;
}

interface PricingProps {
  className?: string;
  onPlanSelect?: (plan: string) => void;
}

const Pricing: React.FC<PricingProps> = ({
  className = '',
  onPlanSelect
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');

  const plans: PricingPlan[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: {
        monthly: 29,
        annually: 290
      },
      description: 'Perfect for individuals and small teams getting started.',
      features: [
        'Up to 5 users',
        '10GB storage',
        'Basic analytics',
        'Email support',
        'Core features'
      ],
      cta: 'Get Started',
      icon: <Users className="w-6 h-6" />
    },
    {
      id: 'pro',
      name: 'Professional',
      price: {
        monthly: 79,
        annually: 790
      },
      description: 'Ideal for growing teams and businesses.',
      features: [
        'Up to 20 users',
        '100GB storage',
        'Advanced analytics',
        'Priority email support',
        'All Basic features',
        'API access',
        'Custom integrations'
      ],
      cta: 'Try Free for 14 Days',
      popular: true,
      icon: <TrendingUp className="w-6 h-6" />
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: {
        monthly: 199,
        annually: 1990
      },
      description: 'For large organizations with advanced needs.',
      features: [
        'Unlimited users',
        '1TB storage',
        'Advanced analytics & reporting',
        '24/7 dedicated support',
        'All Professional features',
        'Custom API access',
        'Single sign-on (SSO)',
        'Advanced security features',
        'Custom branding',
        'Dedicated account manager'
      ],
      cta: 'Contact Sales',
      icon: <Shield className="w-6 h-6" />
    }
  ];

  const features: PricingFeature[] = [
    { name: 'Users', basic: 'Up to 5', pro: 'Up to 20', enterprise: 'Unlimited' },
    { name: 'Storage', basic: '10GB', pro: '100GB', enterprise: '1TB' },
    { name: 'Analytics', basic: true, pro: 'Advanced', enterprise: 'Advanced + Reporting' },
    { name: 'Support', basic: 'Email', pro: 'Priority Email', enterprise: '24/7 Dedicated' },
    { name: 'API Access', basic: false, pro: true, enterprise: 'Custom' },
    { name: 'SSO', basic: false, pro: false, enterprise: true },
    { name: 'Custom Branding', basic: false, pro: false, enterprise: true },
    { name: 'Account Manager', basic: false, pro: false, enterprise: true }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className={className}>
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Simple, transparent pricing
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Choose the perfect plan for your team. All plans include a 14-day free trial.
        </p>

        {/* Billing Toggle */}
        <div className="mt-8 flex items-center justify-center">
          <span className={`mr-3 font-medium ${billingCycle === 'monthly' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annually' : 'monthly')}
            className="relative rounded-full w-14 h-7 bg-gray-300 dark:bg-gray-600 transition-colors"
          >
            <span className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
              billingCycle === 'monthly' ? 'left-1' : 'left-8'
            }`}></span>
          </button>
          <span className={`ml-3 font-medium ${billingCycle === 'annually' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
            Annually
            <span className="ml-2 px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
              Save 20%
            </span>
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="relative"
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-accent text-white text-xs font-bold px-4 py-1 rounded-full flex items-center">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  MOST POPULAR
                </span>
              </div>
            )}

            <Card
              className={`h-full p-6 relative overflow-hidden ${
                plan.popular
                  ? 'border-2 border-accent shadow-enterprise-lg'
                  : 'border border-gray-200 dark:border-gray-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent rounded-full -mr-16 -mt-16 opacity-10"></div>
              )}

              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 text-accent mb-4">
                  {plan.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">{plan.description}</p>

                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {formatPrice(billingCycle === 'monthly' ? plan.price.monthly : plan.price.annually)}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>

                {billingCycle === 'annually' && (
                  <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Billed annually at {formatPrice(plan.price.annually)}
                  </div>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.popular ? 'primary' : 'outline'}
                className="w-full"
                onClick={() => onPlanSelect && onPlanSelect(plan.id)}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Detailed Comparison */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Detailed Feature Comparison
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Feature</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">Basic</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">Professional</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                    {feature.name}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {feature.basic === true ? (
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    ) : feature.basic === false ? (
                      <X className="w-5 h-5 text-gray-400 mx-auto" />
                    ) : (
                      <span className="text-gray-700 dark:text-gray-300">{feature.basic}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {feature.pro === true ? (
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    ) : feature.pro === false ? (
                      <X className="w-5 h-5 text-gray-400 mx-auto" />
                    ) : (
                      <span className="text-gray-700 dark:text-gray-300">{feature.pro}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {feature.enterprise === true ? (
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    ) : feature.enterprise === false ? (
                      <X className="w-5 h-5 text-gray-400 mx-auto" />
                    ) : (
                      <span className="text-gray-700 dark:text-gray-300">{feature.enterprise}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* CTA Section */}
      <div className="mt-16 text-center">
        <Card className="p-8 bg-gradient-to-r from-accent to-blue-600 text-white">
          <h3 className="text-2xl font-bold mb-2">Need a custom solution?</h3>
          <p className="mb-6 max-w-2xl mx-auto opacity-90">
            Our enterprise plans can be tailored to meet your specific requirements.
            Contact our sales team to discuss your needs.
          </p>
          <Button variant="primary">
            Contact Sales Team
            <BadgeCheck className="w-5 h-5 ml-2" />
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Pricing;

