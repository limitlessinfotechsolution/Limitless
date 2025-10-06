'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Monitor, MapPin, Clock, User, AlertTriangle, Trash2 } from 'lucide-react';

interface Session {
  id: string;
  user_id: string;
  device_fingerprint: string | null;
  ip_address: string | null;
  user_agent: string | null;
  geo_location: any;
  created_at: string;
  expires_at: string;
  last_activity: string;
  is_active: boolean;
  profiles: {
    email: string;
    role: string;
  };
}

const SessionsManagement: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [terminatingSessionId, setTerminatingSessionId] = useState<string | null>(null);

  const fetchSessions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/sessions');
      if (!response.ok) {
        throw new Error('Failed to fetch sessions');
      }
      const data = await response.json();
      setSessions(data.sessions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const terminateSession = async (sessionId: string) => {
    setTerminatingSessionId(sessionId);
    try {
      const response = await fetch('/api/admin/session-terminate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) {
        throw new Error('Failed to terminate session');
      }

      // Refresh sessions list
      await fetchSessions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to terminate session');
    } finally {
      setTerminatingSessionId(null);
    }
  };



  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Active Sessions</h2>
          <p className="text-gray-600 dark:text-gray-400">Monitor and manage admin sessions</p>
        </div>
        <button
          onClick={fetchSessions}
          disabled={loading}
          className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
            <span className="text-red-800 dark:text-red-200">{error}</span>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {sessions.map((session) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                    <Monitor className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {session.profiles.email}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {session.profiles.role}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {session.ip_address || 'Unknown IP'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Created {getTimeAgo(session.created_at)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Active {getTimeAgo(session.last_activity)}
                    </span>
                  </div>
                </div>

                {session.user_agent && (
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                      {session.user_agent}
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={() => terminateSession(session.id)}
                disabled={terminatingSessionId === session.id}
                className="ml-4 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                title="Terminate Session"
              >
                {terminatingSessionId === session.id ? (
                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {sessions.length === 0 && !loading && (
        <div className="text-center py-12">
          <Monitor className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Active Sessions</h3>
          <p className="text-gray-600 dark:text-gray-400">No admin sessions are currently active.</p>
        </div>
      )}
    </div>
  );
};

export default SessionsManagement;
