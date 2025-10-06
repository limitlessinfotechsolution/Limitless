'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Zap, Workflow, Bot, Settings, Play, Pause, Plus, Users } from 'lucide-react';

const AutomationPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Automation & Workflows</h1>
          <p className="text-muted-foreground">Streamline operations with automated workflows and intelligent triggers.</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          New Workflow
        </button>
      </div>

      {/* Automation Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
            <Workflow className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+3</span> this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Executions Today</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> vs yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.7%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+0.3%</span> improvement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127h</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Workflow className="mr-2 h-5 w-5" />
              Pre-built Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">New Client Onboarding</p>
                    <p className="text-xs text-muted-foreground">Automated welcome emails, account setup, and team notifications</p>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-800">
                  <Play className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Zap className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Invoice Processing</p>
                    <p className="text-xs text-muted-foreground">Generate invoices, send reminders, and update financial records</p>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-800">
                  <Play className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Bot className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Lead Qualification</p>
                    <p className="text-xs text-muted-foreground">Score leads, assign to sales team, and schedule follow-ups</p>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-800">
                  <Play className="h-4 w-4" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="mr-2 h-5 w-5" />
              Recent Executions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Client Welcome Email</p>
                    <p className="text-xs text-muted-foreground">Sent to john.doe@company.com</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">2m ago</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Invoice Generated</p>
                    <p className="text-xs text-muted-foreground">Project Alpha - $15,000</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">15m ago</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Lead Scoring Update</p>
                    <p className="text-xs text-muted-foreground">Processing 47 new leads</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">1h ago</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Email Notification Failed</p>
                    <p className="text-xs text-muted-foreground">SMTP server timeout</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">2h ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* n8n Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bot className="mr-2 h-5 w-5" />
            n8n Workflow Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Bot className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Advanced Workflow Automation</h3>
            <p className="text-muted-foreground mb-4">
              Connect with n8n for powerful no-code workflow automation and third-party integrations.
            </p>
            <div className="flex justify-center space-x-4">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <Settings className="mr-2 h-4 w-4" />
                Configure n8n
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Import Workflows
              </button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Features will include: visual workflow builder, API integrations, conditional logic, error handling, and scheduled executions.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Triggers */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Triggers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">New Lead Created</h4>
                <div className="flex items-center space-x-1">
                  <button className="text-green-600 hover:text-green-800">
                    <Play className="h-4 w-4" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Pause className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Automatically score and assign leads to sales team</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Project Completed</h4>
                <div className="flex items-center space-x-1">
                  <button className="text-green-600 hover:text-green-800">
                    <Play className="h-4 w-4" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Pause className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Generate invoice and send completion notification</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Payment Received</h4>
                <div className="flex items-center space-x-1">
                  <button className="text-green-600 hover:text-green-800">
                    <Play className="h-4 w-4" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Pause className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Update financial records and send receipt</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutomationPage;
