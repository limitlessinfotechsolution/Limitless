import React, { useState } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  UserCheck,
  DollarSign,
  Calendar,
  CheckSquare,
  Bot,
  Shield,
  TrendingUp,
  FileText,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Bell,
  Search,
  Zap
} from 'lucide-react';
import Button from '../ui/Button';
import Image from 'next/image';
import AIChatWidget from './AIChatWidget';

interface NavItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  href: string;
  children?: NavItem[];
  badge?: string;
}

interface EnterpriseNavigationProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onLogout?: () => void;
  onToggleAIChat?: () => void;
  className?: string;
}

const EnterpriseNavigation: React.FC<EnterpriseNavigationProps> = ({
  user,
  onLogout,
  onToggleAIChat,
  className = ''
}) => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    // 1. Dashboard & Analytics
    {
      id: 'dashboard',
      title: 'Dashboard & Analytics',
      icon: <LayoutDashboard className="w-5 h-5" />,
      href: '/enterprise/dashboard',
      badge: 'AI',
    },

    // 2. Project Management
    {
      id: 'projects',
      title: 'Project Management',
      icon: <FolderKanban className="w-5 h-5" />,
      href: '/enterprise/projects',
      children: [
        {
          id: 'project-list',
          title: 'All Projects',
          icon: <FolderKanban className="w-4 h-4" />,
          href: '/enterprise/projects',
        },
        {
          id: 'project-gantt',
          title: 'Gantt View',
          icon: <BarChart3 className="w-4 h-4" />,
          href: '/enterprise/projects/gantt',
        },
        {
          id: 'project-kanban',
          title: 'Kanban Board',
          icon: <CheckSquare className="w-4 h-4" />,
          href: '/enterprise/projects/kanban',
        },
      ],
    },

    // 3. Client Management
    {
      id: 'clients',
      title: 'Client Management',
      icon: <Users className="w-5 h-5" />,
      href: '/enterprise/clients',
      children: [
        {
          id: 'client-list',
          title: 'Client Directory',
          icon: <Users className="w-4 h-4" />,
          href: '/enterprise/clients',
        },
        {
          id: 'client-profiles',
          title: 'Client Profiles',
          icon: <UserCheck className="w-4 h-4" />,
          href: '/enterprise/clients/profiles',
        },
        {
          id: 'client-communication',
          title: 'Communication Log',
          icon: <FileText className="w-4 h-4" />,
          href: '/enterprise/clients/communication',
        },
      ],
    },

    // 4. Team & Employee Management
    {
      id: 'team',
      title: 'Team Management',
      icon: <UserCheck className="w-5 h-5" />,
      href: '/enterprise/team',
      children: [
        {
          id: 'team-directory',
          title: 'Team Directory',
          icon: <Users className="w-4 h-4" />,
          href: '/enterprise/team',
        },
        {
          id: 'team-onboarding',
          title: 'Employee Onboarding',
          icon: <UserCheck className="w-4 h-4" />,
          href: '/enterprise/team/onboarding',
        },
        {
          id: 'team-performance',
          title: 'Performance Reports',
          icon: <BarChart3 className="w-4 h-4" />,
          href: '/enterprise/team/performance',
        },
      ],
    },

    // 5. Billing & Financials
    {
      id: 'billing',
      title: 'Billing & Financials',
      icon: <DollarSign className="w-5 h-5" />,
      href: '/enterprise/billing',
      children: [
        {
          id: 'billing-quotations',
          title: 'Quotations',
          icon: <FileText className="w-4 h-4" />,
          href: '/enterprise/billing/quotations',
        },
        {
          id: 'billing-invoices',
          title: 'Invoices',
          icon: <DollarSign className="w-4 h-4" />,
          href: '/enterprise/billing/invoices',
        },
        {
          id: 'billing-analytics',
          title: 'Financial Analytics',
          icon: <TrendingUp className="w-4 h-4" />,
          href: '/enterprise/billing/analytics',
        },
      ],
    },

    // 6. Calendar, Tasks, and Meetings
    {
      id: 'calendar',
      title: 'Calendar & Tasks',
      icon: <Calendar className="w-5 h-5" />,
      href: '/enterprise/calendar',
      children: [
        {
          id: 'calendar-view',
          title: 'Calendar View',
          icon: <Calendar className="w-4 h-4" />,
          href: '/enterprise/calendar',
        },
        {
          id: 'tasks-board',
          title: 'Task Boards',
          icon: <CheckSquare className="w-4 h-4" />,
          href: '/enterprise/tasks',
        },
        {
          id: 'meetings',
          title: 'Meetings',
          icon: <Users className="w-4 h-4" />,
          href: '/enterprise/meetings',
        },
      ],
    },

    // 7. AI Assistant Integration (Auralis)
    {
      id: 'ai-assistant',
      title: 'AI Assistant',
      icon: <Bot className="w-5 h-5" />,
      href: '/enterprise/ai',
      badge: 'Auralis',
      children: [
        {
          id: 'ai-chat',
          title: 'AI Chat',
          icon: <Bot className="w-4 h-4" />,
          href: '/enterprise/ai/chat',
        },
        {
          id: 'ai-commands',
          title: 'Command Center',
          icon: <Zap className="w-4 h-4" />,
          href: '/enterprise/ai/commands',
        },
        {
          id: 'ai-insights',
          title: 'AI Insights',
          icon: <TrendingUp className="w-4 h-4" />,
          href: '/enterprise/ai/insights',
        },
      ],
    },

    // 8. QA/QC & Updates
    {
      id: 'qa',
      title: 'QA & Quality Control',
      icon: <Shield className="w-5 h-5" />,
      href: '/enterprise/qa',
      children: [
        {
          id: 'qa-dashboard',
          title: 'QA Dashboard',
          icon: <Shield className="w-4 h-4" />,
          href: '/enterprise/qa',
        },
        {
          id: 'qa-checklists',
          title: 'Quality Checklists',
          icon: <CheckSquare className="w-4 h-4" />,
          href: '/enterprise/qa/checklists',
        },
        {
          id: 'qa-reports',
          title: 'QA Reports',
          icon: <FileText className="w-4 h-4" />,
          href: '/enterprise/qa/reports',
        },
      ],
    },

    // 9. Leads & Sales
    {
      id: 'leads',
      title: 'Leads & Sales',
      icon: <TrendingUp className="w-5 h-5" />,
      href: '/enterprise/leads',
      children: [
        {
          id: 'leads-crm',
          title: 'CRM Dashboard',
          icon: <TrendingUp className="w-4 h-4" />,
          href: '/enterprise/leads',
        },
        {
          id: 'leads-pipeline',
          title: 'Sales Pipeline',
          icon: <BarChart3 className="w-4 h-4" />,
          href: '/enterprise/leads/pipeline',
        },
        {
          id: 'leads-conversion',
          title: 'Conversion Tracking',
          icon: <TrendingUp className="w-4 h-4" />,
          href: '/enterprise/leads/conversion',
        },
      ],
    },

    // Settings & Configuration
    {
      id: 'settings',
      title: 'Settings & Admin',
      icon: <Settings className="w-5 h-5" />,
      href: '/enterprise/settings',
    },
  ];

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const NavItemComponent: React.FC<{ item: NavItem; depth?: number }> = ({ item, depth = 0 }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item.id];
    
    return (
      <div>
        <a
          href={item.href}
          className={`flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors ${
            depth === 0 
              ? 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800' 
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 pl-8'
          }`}
          onClick={(e) => {
            if (hasChildren) {
              e.preventDefault();
              toggleExpand(item.id);
            }
          }}
        >
          <div className="flex items-center">
            <span className={`${depth > 0 ? 'ml-2' : ''}`}>
              {item.icon}
            </span>
            <span className="ml-3">{item.title}</span>
            {item.badge && (
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-accent text-white">
                {item.badge}
              </span>
            )}
          </div>
          
          {hasChildren && (
            <span>
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </span>
          )}
        </a>
        
        {hasChildren && isExpanded && (
          <div className="mt-1">
            {item.children?.map(child => (
              <NavItemComponent key={child.id} item={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden p-4 border-b border-gray-200 dark:border-gray-700">
        <Button
          variant="ghost"
          size="sm"
          icon={mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          &nbsp;
        </Button>
      </div>

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } ${className}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white">Enterprise</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            {navItems.map(item => (
              <NavItemComponent key={item.id} item={item} />
            ))}
          </nav>

          {/* User profile and footer */}
          <div className="border-t border-gray-200 dark:border-gray-800 p-4">
            {user && (
              <div className="flex items-center px-2 py-3">
                {user.avatar ? (
                  <div className="relative w-10 h-10 rounded-full">
                    <Image 
                      src={user.avatar} 
                      alt={user.name} 
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
              </div>
            )}
            
            <div className="mt-4 space-y-1">
              <button
                onClick={onToggleAIChat}
                className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Bot className="w-5 h-5" />
                <span className="ml-3">AI Assistant</span>
                <span className="ml-auto px-2 py-0.5 text-xs rounded-full bg-accent text-white">
                  Auralis
                </span>
              </button>

              <a
                href="/help"
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <HelpCircle className="w-5 h-5" />
                <span className="ml-3">Help Center</span>
              </a>

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="ml-3">Sign out</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default EnterpriseNavigation;