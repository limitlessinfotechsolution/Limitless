import React, { useState } from 'react';
import Dashboard from './Dashboard';
import EnterpriseForm from './EnterpriseForm';
import EnterpriseNotification from './EnterpriseNotification';
import Team from './Team';
import Pricing from './Pricing';
import KPI from './KPI';
import Analytics from './Analytics';
import EnterpriseLayout from './EnterpriseLayout';
import { TrendingUp, Users, DollarSign, ShoppingCart } from 'lucide-react';

const EnterpriseDemo: React.FC = () => {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'New message',
      message: 'You have a new message from John Doe',
      type: 'info' as const,
      timestamp: new Date(),
      read: false
    },
    {
      id: '2',
      title: 'Payment received',
      message: 'You received a payment of $250.00',
      type: 'success' as const,
      timestamp: new Date(Date.now() - 3600000),
      read: false
    },
    {
      id: '3',
      title: 'Server alert',
      message: 'High CPU usage detected on server #3',
      type: 'warning' as const,
      timestamp: new Date(Date.now() - 86400000),
      read: true
    }
  ]);

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
    },
    {
      id: '3',
      name: 'James Wilson',
      role: 'UX Designer',
      email: 'james@company.com',
      phone: '+1 (555) 345-6789',
      location: 'Austin, TX',
      status: 'away' as const,
      performance: 95,
      projects: 3,
      joinDate: 'Nov 5, 2020'
    },
    {
      id: '4',
      name: 'Sarah Chen',
      role: 'Data Analyst',
      email: 'sarah@company.com',
      phone: '+1 (555) 456-7890',
      location: 'Seattle, WA',
      status: 'offline' as const,
      performance: 87,
      projects: 6,
      joinDate: 'Jul 18, 2022'
    }
  ];

  const kpis = [
    {
      id: '1',
      title: 'Total Revenue',
      value: '$45,231.89',
      change: 12.5,
      changeType: 'positive' as const,
      icon: <DollarSign className="w-6 h-6" />,
      description: 'Last 30 days',
      target: '$50,000',
      progress: 90
    },
    {
      id: '2',
      title: 'Subscriptions',
      value: '+12,234',
      change: 18.2,
      changeType: 'positive' as const,
      icon: <Users className="w-6 h-6" />,
      description: 'Active users',
      target: '15,000',
      progress: 82
    },
    {
      id: '3',
      title: 'Sales',
      value: '+1,234',
      change: -1.2,
      changeType: 'negative' as const,
      icon: <ShoppingCart className="w-6 h-6" />,
      description: 'This month',
      target: '1,500',
      progress: 82
    },
    {
      id: '4',
      title: 'Performance',
      value: '92.5%',
      change: 2.1,
      changeType: 'positive' as const,
      icon: <TrendingUp className="w-6 h-6" />,
      description: 'System uptime',
      target: '99.9%',
      progress: 93
    }
  ];

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
      placeholder: 'Enter your email',
      validation: (value: string) => {
        if (!/\S+@\S+\.\S+/.test(value)) {
          return 'Please enter a valid email address';
        }
        return null;
      }
    },
    {
      id: 'company',
      label: 'Company',
      type: 'text',
      required: true,
      placeholder: 'Enter your company name'
    },
    {
      id: 'phone',
      label: 'Phone Number',
      type: 'tel',
      placeholder: 'Enter your phone number'
    },
    {
      id: 'role',
      label: 'Role',
      type: 'select',
      options: [
        { value: 'manager', label: 'Manager' },
        { value: 'developer', label: 'Developer' },
        { value: 'designer', label: 'Designer' },
        { value: 'analyst', label: 'Analyst' },
        { value: 'other', label: 'Other' }
      ],
      placeholder: 'Select your role'
    },
    {
      id: 'message',
      label: 'Message',
      type: 'textarea',
      placeholder: 'Enter your message'
    }
  ];

  const handleFormSubmit = (data: Record<string, string>) => {
    console.log('Form submitted:', data);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        alert('Form submitted successfully!');
        resolve();
      }, 1000);
    });
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const handleClear = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handlePlanSelect = (plan: string) => {
    alert(`Selected plan: ${plan}`);
  };

  return (
    <EnterpriseLayout 
      user={{
        name: 'Admin User',
        email: 'admin@company.com'
      }}
      onLogout={() => alert('Logout clicked')}
    >
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Enterprise Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Professional components for enterprise applications
          </p>
        </div>

        {/* KPI Section */}
        <KPI
          kpis={kpis}
          title="Key Performance Indicators"
          description="Track your most important business metrics"
        />

        {/* Dashboard Section */}
        <Dashboard />

        {/* Team Section */}
        <Team
          team={teamMembers}
          onMemberClick={(member) => alert(`Clicked on ${member.name}`)}
        />

        {/* Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <EnterpriseForm
            title="Contact Us"
            description="Get in touch with our team"
            fields={formFields}
            onSubmit={handleFormSubmit}
            submitLabel="Send Message"
            cancelLabel="Clear Form"
          />
          
          <EnterpriseNotification
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onClear={handleClear}
            onClearAll={handleClearAll}
          />
        </div>

        {/* Analytics Section */}
        <Analytics />
        
        {/* Pricing Section */}
        <Pricing onPlanSelect={handlePlanSelect} />
      </div>
    </EnterpriseLayout>
  );
};

export default EnterpriseDemo;