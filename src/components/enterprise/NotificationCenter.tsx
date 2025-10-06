'use client';

import React, { useState, useEffect } from 'react';
import { Bell, X, Check, CheckCheck, Clock, AlertTriangle, Info, TrendingUp } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Button from '../ui/Button';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read_at: string | null;
  created_at: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  action_url?: string;
  data?: any;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId
            ? { ...notif, read_at: new Date().toISOString() }
            : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications
        .filter(n => !n.read_at)
        .map(n => n.id);

      if (unreadIds.length === 0) return;

      const { error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .in('id', unreadIds);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(notif =>
          unreadIds.includes(notif.id)
            ? { ...notif, read_at: new Date().toISOString() }
            : notif
        )
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task_due':
      case 'project_deadline':
        return <Clock className="w-5 h-5 text-orange-500" />;
      case 'invoice_overdue':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'ai_insight':
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-red-500';
      case 'high':
        return 'border-l-orange-500';
      case 'medium':
        return 'border-l-yellow-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.read_at;
      case 'read':
        return !!notification.read_at;
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.read_at).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center pt-16">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Notifications
              </h2>
              {unreadCount > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  <CheckCheck className="w-4 h-4 mr-1" />
                  Mark all read
                </Button>
              )}
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex mt-3 space-x-1">
            {[
              { key: 'all', label: 'All' },
              { key: 'unread', label: 'Unread' },
              { key: 'read', label: 'Read' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  filter === key
                    ? 'bg-accent text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {filter === 'unread'
                  ? 'You\'re all caught up!'
                  : 'Notifications will appear here when you have updates.'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-l-4 ${getPriorityColor(notification.priority)} ${
                    !notification.read_at ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {notification.title}
                        </p>
                        <div className="flex items-center space-x-2 ml-2">
                          {!notification.read_at && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                          >
                            <Check className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                      {notification.action_url && (
                        <a
                          href={notification.action_url}
                          className="inline-flex items-center mt-2 px-3 py-1 text-xs bg-accent text-white rounded hover:bg-accent/90 transition-colors"
                        >
                          View Details
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;
