import React, { useState } from 'react';
import {
  Dashboard,
  EnterpriseForm,
  EnterpriseNotification,
  Team,
  Pricing,
  KPI,
  EnterpriseLayout,
  Analytics,
  EnterpriseTable,
  Calendar,
  Chat,
  EnterpriseDataGrid,
  EnterpriseReporting,
  EnterpriseUserProfile,
  // Types
  CalendarEvent,
  ChatMessage,
  ChatParticipant,
  UserProfile
} from './enterprise';
import { TrendingUp, Users, DollarSign, ShoppingCart } from 'lucide-react';

const EnterpriseSuiteDemo: React.FC = () => {
  // Notification state
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

  // Team data
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

  // KPI data
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

  // Form fields
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

  // Table data
  const tableData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor', status: 'Inactive' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User', status: 'Active' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Manager', status: 'Active' }
  ];

  const tableColumns = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'role', header: 'Role' },
    { accessorKey: 'status', header: 'Status' }
  ];

  // Reporting data
  const reports = [
    {
      id: '1',
      title: 'Sales Report',
      description: 'Monthly sales performance',
      type: 'bar' as const,
      data: [
        { month: 'Jan', sales: 4000 },
        { month: 'Feb', sales: 3000 },
        { month: 'Mar', sales: 2000 },
        { month: 'Apr', sales: 2780 },
        { month: 'May', sales: 1890 },
        { month: 'Jun', sales: 2390 }
      ],
      xAxisKey: 'month',
      yAxisKey: 'sales'
    },
    {
      id: '2',
      title: 'User Growth',
      description: 'User registration trends',
      type: 'line' as const,
      data: [
        { month: 'Jan', users: 100 },
        { month: 'Feb', users: 200 },
        { month: 'Mar', users: 300 },
        { month: 'Apr', users: 250 },
        { month: 'May', users: 400 },
        { month: 'Jun', users: 500 }
      ],
      xAxisKey: 'month',
      yAxisKey: 'users'
    },
    {
      id: '3',
      title: 'Market Share',
      description: 'Product market distribution',
      type: 'pie' as const,
      data: [
        { product: 'Product A', share: 400 },
        { product: 'Product B', share: 300 },
        { product: 'Product C', share: 300 },
        { product: 'Product D', share: 200 }
      ],
      xAxisKey: 'product',
      yAxisKey: 'share'
    }
  ];

  // User profile data
  const userProfile: UserProfile = {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    jobTitle: 'Senior Software Engineer',
    department: 'Engineering',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff',
    joinDate: '2022-01-15',
    lastActive: '2023-06-20',
    bio: 'Passionate developer with 10+ years of experience in building scalable web applications.',
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Python']
  };

  // Chat data
  const chatParticipants: ChatParticipant[] = [
    { id: '1', name: 'Alex Johnson', status: 'online', avatar: '' },
    { id: '2', name: 'Maria Garcia', status: 'away', avatar: '' },
    { id: '3', name: 'James Wilson', status: 'offline', avatar: '' }
  ];

  const chatMessages: ChatMessage[] = [
    { 
      id: '1', 
      sender: { id: '1', name: 'Alex Johnson' }, 
      content: 'Hello everyone!', 
      timestamp: new Date(Date.now() - 3600000),
      status: 'read'
    },
    { 
      id: '2', 
      sender: { id: '2', name: 'Maria Garcia' }, 
      content: 'Hi Alex! How are you doing?', 
      timestamp: new Date(Date.now() - 1800000),
      status: 'read'
    },
    { 
      id: '3', 
      sender: { id: '1', name: 'Alex Johnson' }, 
      content: 'I\'m doing great, thanks for asking!', 
      timestamp: new Date(Date.now() - 1200000),
      status: 'read'
    }
  ];

  const currentUser: ChatParticipant = { 
    id: '1', 
    name: 'Alex Johnson', 
    status: 'online', 
    avatar: '' 
  };

  // Calendar events
  const calendarEvents: CalendarEvent[] = [
    { id: '1', title: 'Team Meeting', date: new Date(), description: 'Weekly team sync' },
    { id: '2', title: 'Product Launch', date: new Date(Date.now() + 86400000), description: 'New product release' }
  ];

  // Handlers
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

  const handleSaveProfile = (updatedUser: UserProfile) => {
    console.log('Updated user profile:', updatedUser);
    alert('Profile updated successfully!');
  };

  const handleSendMessage = (message: string) => {
    console.log('Sending message:', message);
  };

  const handleParticipantSelect = (participant: ChatParticipant) => {
    console.log('Selected participant:', participant);
  };

  const handleEventClick = (event: CalendarEvent) => {
    console.log('Clicked event:', event);
  };

  const handleEventAdd = (date: Date) => {
    console.log('Adding new event for date:', date);
  };

  const handleDateChange = (date: Date) => {
    console.log('Date changed:', date);
  };

  const handleRowEdit = (row: typeof tableData[0]) => {
    console.log('Editing row:', row);
  };

  const handleRowDelete = (row: typeof tableData[0]) => {
    console.log('Deleting row:', row);
  };

  const handleRowView = (row: typeof tableData[0]) => {
    console.log('Viewing row:', row);
  };

  const handleAddNew = () => {
    console.log('Adding new item');
  };

  const handleRefresh = () => {
    console.log('Refreshing data');
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
            Enterprise Suite Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive showcase of all enterprise components
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

        {/* User Profile Section */}
        <EnterpriseUserProfile
          user={userProfile}
          editable={true}
          onSave={handleSaveProfile}
        />

        {/* Form and Notification Section */}
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

        {/* Data Grid Section */}
        <EnterpriseDataGrid
          data={tableData}
          columns={tableColumns}
          title="User Management"
          description="Manage user accounts and permissions"
          onEdit={handleRowEdit}
          onDelete={handleRowDelete}
          onView={handleRowView}
          onAddNew={handleAddNew}
          onRefresh={handleRefresh}
        />

        {/* Reporting Section */}
        <EnterpriseReporting
          reports={reports}
          title="Business Intelligence"
          description="Comprehensive reporting and analytics"
        />

        {/* Table Section */}
        <EnterpriseTable
          data={tableData}
          columns={tableColumns}
          title="User Directory"
          description="Company employee directory"
          onEdit={handleRowEdit}
          onDelete={handleRowDelete}
          onView={handleRowView}
        />

        {/* Calendar and Chat Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Calendar
            events={calendarEvents}
            onEventClick={handleEventClick}
            onEventAdd={handleEventAdd}
            onDateChange={handleDateChange}
            title="Company Calendar"
          />

          <Chat
            participants={chatParticipants}
            messages={chatMessages}
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
            onParticipantSelect={handleParticipantSelect}
            title="Team Chat"
          />
        </div>

        {/* Pricing Section */}
        <Pricing onPlanSelect={handlePlanSelect} />
      </div>
    </EnterpriseLayout>
  );
};

export default EnterpriseSuiteDemo;