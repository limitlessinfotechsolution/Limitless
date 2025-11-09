'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Shield, AlertTriangle, Lock, Key, Activity, User, Globe, Server } from 'lucide-react';

interface SecurityMetric {
  id: string;
  name: string;
  value: string | number;
  change?: number;
  status: 'good' | 'warning' | 'critical';
  icon: React.ReactNode;
}

interface SecurityEvent {
  id: string;
  type: string;
  description: string;
  ip: string;
  timestamp: string;
  user?: string;
  severity: 'low' | 'medium' | 'high';
}

interface LoginAttempt {
  id: string;
  user: string;
  ip: string;
  status: 'success' | 'failed';
  timestamp: string;
  location: string;
}

const SecurityDashboard: React.FC = () => {
  const metrics: SecurityMetric[] = [
    {
      id: 'active-threats',
      name: 'Active Threats',
      value: 0,
      status: 'good',
      icon: <Shield className="w-4 h-4" />,
    },
    {
      id: 'failed-logins',
      name: 'Failed Login Attempts',
      value: 12,
      change: -5,
      status: 'warning',
      icon: <AlertTriangle className="w-4 h-4" />,
    },
    {
      id: 'active-sessions',
      name: 'Active Sessions',
      value: 42,
      status: 'good',
      icon: <Activity className="w-4 h-4" />,
    },
    {
      id: 'vulnerabilities',
      name: 'Vulnerabilities',
      value: 0,
      status: 'good',
      icon: <Lock className="w-4 h-4" />,
    },
  ];

  const events: SecurityEvent[] = [
    {
      id: '1',
      type: 'Failed Login',
      description: 'Multiple failed login attempts detected',
      ip: '192.168.1.100',
      timestamp: '2023-05-15T14:30:00Z',
      user: 'admin@example.com',
      severity: 'high',
    },
    {
      id: '2',
      type: 'Suspicious Activity',
      description: 'Unusual data access pattern',
      ip: '203.0.113.45',
      timestamp: '2023-05-15T13:45:00Z',
      user: 'user@example.com',
      severity: 'medium',
    },
    {
      id: '3',
      type: 'Successful Login',
      description: 'User logged in from new device',
      ip: '198.51.100.22',
      timestamp: '2023-05-15T12:15:00Z',
      user: 'manager@example.com',
      severity: 'low',
    },
  ];

  const loginAttempts: LoginAttempt[] = [
    {
      id: '1',
      user: 'admin@example.com',
      ip: '192.168.1.100',
      status: 'failed',
      timestamp: '2023-05-15T14:30:00Z',
      location: 'New York, US',
    },
    {
      id: '2',
      user: 'user@example.com',
      ip: '203.0.113.45',
      status: 'success',
      timestamp: '2023-05-15T14:25:00Z',
      location: 'London, UK',
    },
    {
      id: '3',
      user: 'manager@example.com',
      ip: '198.51.100.22',
      status: 'success',
      timestamp: '2023-05-15T14:20:00Z',
      location: 'Tokyo, JP',
    },
  ];

  // Mock data for login attempts chart
  const loginAttemptsData = [
    { hour: '00:00', attempts: 2 },
    { hour: '04:00', attempts: 5 },
    { hour: '08:00', attempts: 8 },
    { hour: '12:00', attempts: 12 },
    { hour: '16:00', attempts: 15 },
    { hour: '20:00', attempts: 7 },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600 dark:text-green-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'critical':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Security Dashboard</h1>
        <p className="text-muted-foreground">Monitor and manage your system security.</p>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
              <div className={`p-2 rounded-full ${getStatusColor(metric.status)}`}>
                {metric.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              {metric.change !== undefined && (
                <p className="text-xs text-muted-foreground">
                  {metric.change > 0 ? '+' : ''}{metric.change}% from last month
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Login Attempts Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Login Attempts (Last 24 Hours)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={loginAttemptsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="attempts" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Security Events */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Security Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="flex items-start space-x-4 p-3 rounded-lg border">
                  <div className={`p-2 rounded-full ${getSeverityColor(event.severity)}`}>
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{event.type}</p>
                      <Badge className={getSeverityColor(event.severity)}>
                        {event.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                    <div className="flex items-center text-xs text-muted-foreground mt-2">
                      <User className="w-3 h-3 mr-1" />
                      {event.user}
                      <Globe className="w-3 h-3 ml-2 mr-1" />
                      {event.ip}
                      <span className="ml-2">
                        {new Date(event.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Login Attempts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Login Attempts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">User</th>
                  <th className="text-left py-3 px-4">IP Address</th>
                  <th className="text-left py-3 px-4">Location</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Time</th>
                </tr>
              </thead>
              <tbody>
                {loginAttempts.map((attempt) => (
                  <tr key={attempt.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">{attempt.user}</td>
                    <td className="py-3 px-4 font-mono">{attempt.ip}</td>
                    <td className="py-3 px-4">{attempt.location}</td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant={attempt.status === 'success' ? 'default' : 'destructive'}
                      >
                        {attempt.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {new Date(attempt.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Security Actions */}
      <div className="flex flex-wrap gap-4">
        <Button variant="outline">
          <Lock className="w-4 h-4 mr-2" />
          Run Security Scan
        </Button>
        <Button variant="outline">
          <Key className="w-4 h-4 mr-2" />
          Rotate API Keys
        </Button>
        <Button variant="outline">
          <Server className="w-4 h-4 mr-2" />
          Review Permissions
        </Button>
      </div>
    </div>
  );
};

export default SecurityDashboard;