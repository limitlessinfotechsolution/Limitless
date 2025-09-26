import React, { useState } from 'react';
import { Bell, Search, User, Settings, Menu, Moon, Sun, Grid, MessageSquare, BarChart3 } from 'lucide-react';
import Button from '../ui/Button';

interface AdminTopNavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeView: string;
}

const AdminTopNavbar: React.FC<AdminTopNavbarProps> = ({ 
  sidebarOpen, 
  setSidebarOpen,
  activeView
}) => {
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real app, you would update the theme here
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would perform the search here
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className="bg-white/90 dark:bg-gray-800/90 border-b border-gray-200/50 dark:border-gray-700/50 backdrop-blur-md">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center">
            <button
              type="button"
              className="text-gray-500 focus:outline-none lg:hidden hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center ml-4 lg:ml-0">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                {activeView.replace('-', ' ')}
              </h1>
            </div>
          </div>

          {/* Center section - Search */}
          <div className="hidden md:flex flex-1 justify-center px-2 lg:ml-6 lg:justify-center">
            <form onSubmit={handleSearch} className="max-w-lg w-full lg:max-w-xs">
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="search"
                  name="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent sm:text-sm text-gray-900 dark:text-white shadow-sm hover:shadow-md transition-shadow duration-200"
                  placeholder="Search..."
                  type="search"
                />
              </div>
            </form>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-3">
            {/* Quick Actions */}
            <div className="hidden lg:flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Grid className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <BarChart3 className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <MessageSquare className="h-5 w-5" />
              </Button>
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <span className="sr-only">View notifications</span>
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-red-500"></span>
            </Button>

            {/* Dark Mode Toggle */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={toggleDarkMode}
            >
              <span className="sr-only">Toggle dark mode</span>
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="hidden md:block text-right">
                <div className="text-sm font-medium text-gray-900 dark:text-white">Admin User</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Administrator</div>
              </div>
              <div className="relative">
                <Button variant="ghost" className="flex text-sm rounded-full p-0 focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-accent to-accent-orange flex items-center justify-center shadow-sm">
                    <User className="h-5 w-5 text-white" />
                  </div>
                </Button>
              </div>
              <Button variant="ghost" size="sm" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <span className="sr-only">Settings</span>
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopNavbar;