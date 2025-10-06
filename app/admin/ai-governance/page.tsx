'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Brain, BarChart3, Shield, Users, MessageSquare, TrendingUp, AlertTriangle, Settings } from 'lucide-react';

const AIGovernancePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Governance</h1>
          <p className="text-muted-foreground">Monitor and control AI usage across your organization with comprehensive governance tools.</p>
        </div>
      </div>

      {/* AI Usage Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45,231</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+18%</span> this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Context Usage</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4GB</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">67%</span> of limit
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Quality</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2.1%</span> accuracy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12</span> new users
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Department-wise Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Department Usage Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Development</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-sm font-medium">12,456</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Marketing</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <span className="text-sm font-medium">8,932</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Sales</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <span className="text-sm font-medium">6,123</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Operations</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                  <span className="text-sm font-medium">4,567</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Permission Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">Development Team</p>
                  <p className="text-xs text-muted-foreground">Full AI access for coding assistance</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Enabled</span>
                  <Settings className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">Marketing Team</p>
                  <p className="text-xs text-muted-foreground">Content generation and analysis</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Enabled</span>
                  <Settings className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">Sales Team</p>
                  <p className="text-xs text-muted-foreground">Lead qualification and email drafting</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Limited</span>
                  <Settings className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Request Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="mr-2 h-5 w-5" />
            Recent AI Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Brain className="h-5 w-5 text-blue-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Code Review Request</p>
                <p className="text-sm text-muted-foreground">Development team requested code review for authentication module</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-xs text-muted-foreground">john.doe@company.com</span>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Approved</span>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">5m ago</span>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <MessageSquare className="h-5 w-5 text-green-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Content Generation</p>
                <p className="text-sm text-muted-foreground">Marketing team generated blog post outline for SEO campaign</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-xs text-muted-foreground">sarah.marketing@company.com</span>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Approved</span>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">12m ago</span>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Policy Violation</p>
                <p className="text-sm text-red-700 dark:text-red-300">Attempted to use AI for sensitive financial data analysis</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-xs text-muted-foreground">finance.user@company.com</span>
                  <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Blocked</span>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">1h ago</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Governance Settings */}
      <Card>
        <CardHeader>
          <CardTitle>AI Governance Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Advanced AI Governance</h3>
            <p className="text-muted-foreground mb-4">
              Comprehensive AI governance and compliance management system coming soon.
            </p>
            <p className="text-sm text-muted-foreground">
              Features will include: usage policies, content filtering, audit trails, compliance reporting, and department-wise permissions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIGovernancePage;
