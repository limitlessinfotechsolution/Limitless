import React from 'react';
import {
  EnterpriseDashboard,
  EnterpriseTeam,
  EnterpriseKPI,
  EnterpriseForm,
  EnterprisePricing
} from './enterprise';

const EnterpriseExample: React.FC = () => {
  // Sample KPI data
  const kpis = [
    {
      id: 'revenue',
      title: 'Total Revenue',
      value: '$45,231.89',
      change: 12.5,
      changeType: 'positive' as const,
      icon: <div className="w-6 h-6 bg-blue-500 rounded"></div>,
      description: 'Last 30 days',
      target: '$50,000',
      progress: 90
    },
    {
      id: 'subscribers',
      title: 'Subscriptions',
      value: '+12,234',
      change: 18.2,
      changeType: 'positive' as const,
      icon: <div className="w-6 h-6 bg-green-500 rounded"></div>,
      description: 'Active users',
      target: '15,000',
      progress: 82
    },
    {
      id: 'sales',
      title: 'Sales',
      value: '+1,234',
      change: -1.2,
      changeType: 'negative' as const,
      icon: <div className="w-6 h-6 bg-yellow-500 rounded"></div>,
      description: 'This month',
      target: '1,500',
      progress: 82
    },
    {
      id: 'performance',
      title: 'Performance',
      value: '92.5%',
      change: 2.1,
      changeType: 'positive' as const,
      icon: <div className="w-6 h-6 bg-purple-500 rounded"></div>,
      description: 'System uptime',
      target: '99.9%',
      progress: 93
    }
  ];

  // Sample team data
  const teamMembers = [
    {
      id: '1',
      name: 'Alex Johnson',
      role: 'Product Manager',
      email: 'alex@company.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      status: 'active' as const,
      performance: 92,
      projects: 5,
      joinDate: 'Jan 15, 2022'
    },
    {
      id: '2',
      name: 'Maria Garcia',
      role: 'Frontend Developer',
      email: 'maria@company.com',
      phone: '+1 (555) 234-5678',
      location: 'New York, NY',
      status: 'active' as const,
      performance: 88,
      projects: 8,
      joinDate: 'Mar 22, 2021'
    }
  ];

  // Sample form fields
  const formFields = [
    {
      id: 'name',
      label: 'Full Name',
      type: 'text',
      required: true,
      placeholder: 'Enter your full name'
    },
    {
      id: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      placeholder: 'Enter your email'
    }
  ];

  const handleFormSubmit = (data: Record<string, string>) => {
    console.log('Form submitted:', data);
    return Promise.resolve();
  };

  const handlePlanSelect = (plan: string) => {
    console.log('Selected plan:', plan);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Enterprise Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Professional components for enterprise applications
        </p>
      </div>

      <EnterpriseKPI kpis={kpis} />

      <EnterpriseDashboard />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <EnterpriseTeam team={teamMembers} />
        <EnterpriseForm
          title="Contact Us"
          description="Get in touch with our team"
          fields={formFields}
          onSubmit={handleFormSubmit}
        />
      </div>

      <EnterprisePricing onPlanSelect={handlePlanSelect} />
    </div>
  );
};

export default EnterpriseExample;