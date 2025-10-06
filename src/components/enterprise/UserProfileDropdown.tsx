'use client';

import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, ChevronDown, Moon, Sun, Bell, Shield, HelpCircle } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import Button from '../ui/Button';

interface UserProfileDropdownProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  onLogout: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({
  user,
  theme,
  onThemeToggle,
  onLogout,
  isOpen,
  onToggle
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      onLogout();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const quickActions = [
    {
      icon: <User className="w-4 h-4" />,
      label: 'Profile Settings',
      href: '/enterprise/settings/profile',
      description: 'Update your profile information'
    },
    {
      icon: <Bell className="w-4 h-4" />,
      label: 'Notification Preferences',
      href: '/enterprise/settings/notifications',
      description: 'Manage your notification settings'
    },
    {
      icon: <Shield className="w-4 h-4" />,
      label: 'Security Settings',
      href: '/enterprise/settings/security',
      description: 'Change password and security options'
    },
    {
      icon: <Settings className="w-4 h-4" />,
      label: 'System Preferences',
      href: '/enterprise/settings/preferences',
      description: 'Customize your experience'
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        {user.avatar ? (
          <div className="relative w-8 h-8 rounded-full overflow-hidden">
            <Image
              src={user.avatar}
              alt={user.name}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </div>
        )}
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {user.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {user.email}
          </p>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          {/* User Info Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              {user.avatar ? (
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </p>
                <p className="text-xs text-accent font-medium mt-1">
                  Enterprise User
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="py-2">
            {quickActions.map((action, index) => (
              <a
                key={index}
                href={action.href}
                className="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
              >
                <div className="flex-shrink-0 mr-3 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                  {action.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {action.label}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {action.description}
                  </p>
                </div>
              </a>
            ))}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700">
            {/* Theme Toggle */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={onThemeToggle}
                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                {theme === 'light' ? (
                  <Moon className="w-4 h-4 mr-3" />
                ) : (
                  <Sun className="w-4 h-4 mr-3" />
                )}
                Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
              </button>
            </div>

            {/* Help & Support */}
            <div className="px-4 py-2">
              <a
                href="/enterprise/help"
                className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                <HelpCircle className="w-4 h-4 mr-3" />
                Help & Support
              </a>
            </div>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;
