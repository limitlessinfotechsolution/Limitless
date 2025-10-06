import React, { useState } from 'react';
import {
  Bell,
  Search,
  Moon,
  Sun,
  Menu
} from 'lucide-react';
import EnterpriseNavigation from './EnterpriseNavigation';
import AIChatWidget from './AIChatWidget';
import GlobalSearch from './GlobalSearch';
import NotificationCenter from './NotificationCenter';
import UserProfileDropdown from './UserProfileDropdown';
import Button from '../ui/Button';

interface EnterpriseLayoutProps {
  children: React.ReactNode;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onLogout?: () => void;
  onThemeToggle?: () => void;
  theme?: 'light' | 'dark';
  className?: string;
}

const EnterpriseLayout: React.FC<EnterpriseLayoutProps> = ({
  children,
  user,
  onLogout,
  onThemeToggle,
  theme = 'light',
  className = ''
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(true);

  const handleToggleAIChat = () => {
    setIsChatMinimized(!isChatMinimized);
  };

  const handleNotificationsToggle = () => {
    setNotificationsOpen(!notificationsOpen);
  };

  const handleUserDropdownToggle = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  return (
    <div className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${className}`}>
      {/* Sidebar */}
      <EnterpriseNavigation
        user={user}
        onLogout={onLogout}
        onToggleAIChat={handleToggleAIChat}
        className="hidden md:block"
      />

      {/* Mobile sidebar */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <EnterpriseNavigation
            user={user}
            onLogout={onLogout}
            onToggleAIChat={handleToggleAIChat}
            className="absolute z-50"
          />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden mr-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
                  Enterprise
                </span>
              </div>
            </div>

            <div className="flex-1 max-w-lg mx-4 hidden sm:block">
              <button
                onClick={() => setSearchOpen(true)}
                className="relative w-full text-left"
                aria-label="Open global search"
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search projects, tasks, clients..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer focus:outline-none hover:border-gray-400 dark:hover:border-gray-500"
                    readOnly
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <kbd className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded">
                      ⌘K
                    </kbd>
                  </div>
                </div>
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNotificationsToggle}
                className="relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onThemeToggle}
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </Button>

              <UserProfileDropdown
                user={user!}
                theme={theme}
                onThemeToggle={onThemeToggle ?? (() => {})}
                onLogout={onLogout ?? (() => {})}
                isOpen={userDropdownOpen}
                onToggle={handleUserDropdownToggle}
              />
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2023 Enterprise. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-2 md:mt-0">
              <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                Contact
              </a>
            </div>
          </div>
        </footer>
      </div>

      {/* Mobile search bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3">
        <button
          onClick={() => setSearchOpen(true)}
          className="relative w-full text-left"
        >
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer focus:outline-none"
            readOnly
          />
        </button>
      </div>

      {/* Global Search Modal */}
      <GlobalSearch
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      {/* Notification Center */}
      <NotificationCenter
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />

      {/* AI Chat Widget */}
      <AIChatWidget
        isMinimized={isChatMinimized}
        onToggleMinimize={handleToggleAIChat}
      />
    </div>
  );
};

export default EnterpriseLayout;
