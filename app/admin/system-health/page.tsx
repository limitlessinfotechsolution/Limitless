'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Server, Database, Wifi, AlertTriangle, CheckCircle, Clock, Zap, Users, RefreshCw } from 'lucide-react';

interface HealthData {
  status: string;
  timestamp: string;
  database: {
    status: string;
    error?: string;
  };
  sessions: {
    active: number;
    error?: string;
  };
  security: {
    recent_logins: number;
    failed_logins: number;
    error?: string;
  };
  system: {
    uptime_seconds: number;
    memory_usage_mb: {
      rss: number;
      heap_used: number;
      heap_total: number;
    };
    node_version: string;
    environment: string;
  };
}

const SystemHealthPage: React.FC = () => {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchHealthData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/health');
      if (!response.ok) {
        throw new Error('Failed to fetch health data');
      }
      const data: HealthData = await response.json();
      setHealthData(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchHealthData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'degraded': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'degraded': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Health</h1>
          <p className="text-muted-foreground">Real-time monitoring of system performance and health metrics.</p>
        </div>
        <div className="flex items-center space-x-2">
          {lastUpdated && (
            <span className="text-sm text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={fetchHealthData}
            disabled={loading}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700">Error loading health data: {error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            {healthData ? getStatusIcon(healthData.status) : <Clock className="h-4 w-4 text-gray-500" />}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${healthData ? getStatusColor(healthData.status) : 'text-gray-600'}`}>
              {loading ? 'Loading...' : healthData ? healthData.status.toUpperCase() : 'Unknown'}
            </div>
            <p className="text-xs text-muted-foreground">
              {healthData ? `Updated ${new Date(healthData.timestamp).toLocaleTimeString()}` : 'Fetching data...'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${healthData?.database.status === 'healthy' ? 'text-green-600' : 'text-red-600'}`}>
              {loading ? 'Loading...' : healthData?.database.status || 'Unknown'}
            </div>
            <p className="text-xs text-muted-foreground">
              {healthData?.database.error ? `Error: ${healthData.database.error}` : 'Connection healthy'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : healthData?.sessions.active || 0}</div>
            <p className="text-xs text-muted-foreground">Current admin sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {loading ? '...' : healthData?.security.failed_logins || 0}
            </div>
            <p className="text-xs text-muted-foreground">Failed logins (last hour)</p>
          </CardContent>
        </Card>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Server className="mr-2 h-5 w-5" />
              Server Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">System Uptime</span>
                <span className="text-sm font-medium">
                  {loading ? 'Loading...' : healthData ? formatUptime(healthData.system.uptime_seconds) : 'Unknown'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Memory Usage (RSS)</span>
                <span className="text-sm font-medium">
                  {loading ? 'Loading...' : healthData ? `${healthData.system.memory_usage_mb.rss} MB` : 'Unknown'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Heap Used</span>
                <span className="text-sm font-medium">
                  {loading ? 'Loading...' : healthData ? `${healthData.system.memory_usage_mb.heap_used} MB` : 'Unknown'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Heap Total</span>
                <span className="text-sm font-medium">
                  {loading ? 'Loading...' : healthData ? `${healthData.system.memory_usage_mb.heap_total} MB` : 'Unknown'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Node Version</span>
                <span className="text-sm font-medium">
                  {loading ? 'Loading...' : healthData ? healthData.system.node_version : 'Unknown'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Environment</span>
                <span className="text-sm font-medium">
                  {loading ? 'Loading...' : healthData ? healthData.system.environment : 'Unknown'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wifi className="mr-2 h-5 w-5" />
              Security & Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Recent Logins (1h)</span>
                <span className="text-sm font-medium text-green-600">
                  {loading ? 'Loading...' : healthData?.security.recent_logins || 0}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Failed Logins (1h)</span>
                <span className="text-sm font-medium text-red-600">
                  {loading ? 'Loading...' : healthData?.security.failed_logins || 0}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Active Admin Sessions</span>
                <span className="text-sm font-medium">
                  {loading ? 'Loading...' : healthData?.sessions.active || 0}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Database Status</span>
                <span className={`text-sm font-medium ${healthData?.database.status === 'healthy' ? 'text-green-600' : 'text-red-600'}`}>
                  {loading ? 'Loading...' : healthData?.database.status || 'Unknown'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Overall Status</span>
                <span className={`text-sm font-medium ${healthData ? getStatusColor(healthData.status) : 'text-gray-600'}`}>
                  {loading ? 'Loading...' : healthData ? healthData.status.toUpperCase() : 'Unknown'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Recent Alerts & Issues
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">Failed Background Job</p>
                <p className="text-sm text-red-600 dark:text-red-300">Email notification service failed to process 2 messages</p>
                <p className="text-xs text-red-500 mt-1">2 minutes ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">High Memory Usage</p>
                <p className="text-sm text-yellow-600 dark:text-yellow-300">Memory usage exceeded 80% threshold</p>
                <p className="text-xs text-yellow-500 mt-1">15 minutes ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">System Recovery</p>
                <p className="text-sm text-green-600 dark:text-green-300">Database connection restored after temporary outage</p>
                <p className="text-xs text-green-500 mt-1">1 hour ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terminal Access */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="mr-2 h-5 w-5" />
            Server Terminal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Zap className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Integrated Terminal Access</h3>
            <p className="text-muted-foreground mb-4">
              Direct server command execution and monitoring capabilities coming soon.
            </p>
            <p className="text-sm text-muted-foreground">
              Features will include: command execution, log streaming, process monitoring, and system diagnostics.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemHealthPage;
