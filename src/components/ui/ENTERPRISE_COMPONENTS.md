# Enterprise Components Documentation

A comprehensive suite of professional, enterprise-grade React components designed for modern business applications.

## Components Overview

### 1. EnterpriseDashboard
A comprehensive dashboard component with metrics, charts, and activity tracking.

**Features:**
- Key performance indicators with trend indicators
- Responsive grid layout
- Activity feed with user actions
- Performance charts (placeholder)
- Team performance visualization
- Upcoming events tracking

### 2. EnterpriseNavigation
A professional sidebar navigation component with collapsible menus and user profile.

**Features:**
- Collapsible nested navigation items
- Mobile-responsive design
- User profile section with avatar
- Badge indicators for new items
- Keyboard navigation support
- Dark mode compatible

### 3. EnterpriseForm
A feature-rich form component with validation and submission handling.

**Features:**
- Dynamic field generation
- Built-in validation system
- Real-time error feedback
- Loading states
- Success messaging
- Support for various input types (text, email, select, textarea)
- Responsive layout

### 4. EnterpriseNotification
A notification center component for managing alerts and messages.

**Features:**
- Multiple notification types (info, success, warning, error)
- Read/unread status tracking
- Action buttons for notifications
- Mark as read/clear functionality
- Timestamps
- Collapsible notification list

### 5. EnterpriseTeam
A team management component for displaying and managing team members.

**Features:**
- Team member cards with avatars
- Status indicators (active, away, offline)
- Performance tracking
- Search and filter capabilities
- Contact information display
- Join date tracking

### 6. EnterprisePricing
A pricing comparison component with detailed feature breakdown.

**Features:**
- Multiple pricing tiers (Basic, Professional, Enterprise)
- Monthly/annual billing toggle
- Feature comparison table
- Popular plan highlighting
- Call-to-action buttons
- Custom plan request option

### 7. EnterpriseKPI
A key performance indicator tracking component.

**Features:**
- Metric cards with trend indicators
- Progress bars
- Target tracking
- Customizable icons
- Responsive grid layout
- Performance summary section

### 8. EnterpriseAnalytics
A comprehensive analytics dashboard component with charts and metrics.

**Features:**
- Multiple analytics cards with trend indicators
- Interactive charts with animations
- Time range filtering
- Traffic source breakdown
- Top performing pages tracking
- Export functionality
- Responsive design

### 9. EnterpriseTable
A feature-rich data table component with sorting, filtering, and pagination.

**Features:**
- Column sorting and filtering
- Pagination controls
- Row selection and actions
- Search functionality
- Export options
- Customizable columns
- Loading states
- Responsive design

### 10. EnterpriseCalendar
A professional calendar component for scheduling and event management.

**Features:**
- Monthly view with event indicators
- Event details panel
- Date navigation controls
- Event creation and management
- Status indicators
- Responsive design

### 11. EnterpriseChat
A real-time chat component for team communication.

**Features:**
- Real-time messaging
- Participant list with status indicators
- Message status tracking (sent, delivered, read)
- Emoji picker
- File attachments
- Responsive design

### 12. EnterpriseLayout
A complete application layout component with header, sidebar, and footer.

**Features:**
- Responsive design for all screen sizes
- Dark mode support
- Mobile-friendly navigation
- User profile dropdown
- Notification center integration
- Search functionality
- Professional footer with legal links

### 13. EnterpriseDataGrid
An advanced data grid component with enhanced features for enterprise data management.

**Features:**
- Advanced sorting, filtering, and pagination
- Row selection capabilities
- Export to CSV functionality
- Customizable column visibility
- Action buttons for each row
- Loading states
- Responsive design
- Keyboard navigation support

### 14. EnterpriseReporting
A comprehensive reporting and analytics component for business intelligence.

**Features:**
- Multiple chart types (bar, line, pie)
- Interactive data visualizations
- Date range filtering
- Export functionality
- Report navigation tabs
- Responsive design
- Customizable colors

### 15. EnterpriseUserProfile
A user profile management component for viewing and editing user information.

**Features:**
- Profile picture with upload capability
- Personal and work information display
- Editable fields with validation
- Skill management (add/remove)
- Bio section
- Responsive design
- Dark mode support

### 16. EnterpriseSuiteDemo
A comprehensive demo component showcasing all enterprise components working together in a complete application.

**Features:**
- Integrated dashboard with KPIs and analytics
- Team management interface
- Calendar and scheduling
- Real-time chat functionality
- Data grid for user management
- Reporting and visualization
- User profile management
- Complete application layout
- Responsive design for all screen sizes
- Dark mode support

## Installation

All components are ready to use. Simply import them into your project:

```typescript
import {
  EnterpriseDashboard,
  EnterpriseNavigation,
  EnterpriseForm,
  EnterpriseNotification,
  EnterpriseTeam,
  EnterprisePricing,
  EnterpriseKPI,
  EnterpriseAnalytics,
  EnterpriseTable,
  EnterpriseCalendar,
  EnterpriseChat,
  EnterpriseLayout,
  EnterpriseDataGrid,
  EnterpriseReporting,
  EnterpriseUserProfile,
  EnterpriseSuiteDemo
} from './components/ui/enterprise';
```

## Usage Examples

### Basic Dashboard Implementation
```tsx
import { EnterpriseDashboard } from './components/ui/enterprise';

const DashboardPage = () => {
  return (
    <EnterpriseDashboard />
  );
};
```

### Analytics Dashboard Implementation
```tsx
import { EnterpriseAnalytics } from './components/ui/enterprise';

const AnalyticsPage = () => {
  return (
    <EnterpriseAnalytics />
  );
};
```

### Form with Validation
```tsx
import { EnterpriseForm } from './components/ui/enterprise';

const ContactForm = () => {
  const fields = [
    {
      id: 'name',
      label: 'Full Name',
      type: 'text',
      required: true
    },
    {
      id: 'email',
      label: 'Email Address',
      type: 'email',
      required: true
    }
  ];

  const handleSubmit = (data) => {
    console.log('Form data:', data);
  };

  return (
    <EnterpriseForm
      title="Contact Us"
      fields={fields}
      onSubmit={handleSubmit}
    />
  );
};
```

### Data Grid with Actions
```tsx
import { EnterpriseDataGrid } from './components/ui/enterprise';

const UserManagement = () => {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' }
  ];

  const columns = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'role', header: 'Role' }
  ];

  const handleEdit = (user) => {
    console.log('Edit user:', user);
  };

  const handleDelete = (user) => {
    console.log('Delete user:', user);
  };

  return (
    <EnterpriseDataGrid
      data={users}
      columns={columns}
      title="User Management"
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
};
```

### User Profile Management
```tsx
import { EnterpriseUserProfile } from './components/ui/enterprise';

const ProfilePage = () => {
  const user = {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    jobTitle: 'Senior Developer',
    department: 'Engineering',
    joinDate: '2022-01-15',
    lastActive: '2023-06-20',
    skills: ['JavaScript', 'React', 'Node.js']
  };

  const handleSave = (updatedUser) => {
    console.log('Updated user:', updatedUser);
  };

  return (
    <EnterpriseUserProfile
      user={user}
      editable={true}
      onSave={handleSave}
    />
  );
};
```

### Complete Enterprise Suite Demo
```tsx
import { EnterpriseSuiteDemo } from './components/ui/enterprise';

const EnterpriseDemoPage = () => {
  return (
    <EnterpriseSuiteDemo />
  );
};
```

## Styling

All components are built with Tailwind CSS and follow the enterprise design system defined in `tailwind.config.js`. The components support both light and dark modes.

## Dependencies

- React 18+
- Tailwind CSS
- Framer Motion (for animations)
- Lucide React (for icons)
- @tanstack/react-table (for data grids)
- Recharts (for data visualizations)

## Customization

Each component accepts a `className` prop for additional styling. You can also customize the color scheme by modifying the enterprise color palette in `tailwind.config.js`.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Accessibility

All components follow WCAG 2.1 guidelines and include:
- Proper ARIA attributes
- Keyboard navigation support
- Screen reader compatibility
- Sufficient color contrast
- Focus management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License