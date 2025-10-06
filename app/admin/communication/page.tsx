'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { MessageCircle, Users, Bell, Calendar, FileText, TrendingUp } from 'lucide-react';

const CommunicationPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Internal Communications</h1>
          <p className="text-muted-foreground">Monitor and manage internal communication channels and collaboration tools.</p>
        </div>
      </div>

      {/* Communication Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Channels</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Communication channels</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Messages</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">847</div>
            <p className="text-xs text-muted-foreground">Messages exchanged</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meetings This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Scheduled meetings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">Average response time</p>
          </CardContent>
        </Card>
      </div>

      {/* Communication Channels */}
      <Card>
        <CardHeader>
          <CardTitle>Communication Channels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">#general</h4>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Active</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">Company-wide announcements and updates</p>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>142 members</span>
                <span>23 messages today</span>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">#development</h4>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Active</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">Technical discussions and code reviews</p>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>67 members</span>
                <span>89 messages today</span>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">#design</h4>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Active</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">Design team collaboration and feedback</p>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>28 members</span>
                <span>34 messages today</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meeting Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Recent Meetings & Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 border rounded-lg">
              <Calendar className="h-5 w-5 text-blue-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Weekly Standup - Development Team</p>
                <p className="text-sm text-muted-foreground">Sprint progress review and blocker discussion</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-xs text-muted-foreground">Duration: 45 min</span>
                  <span className="text-xs text-muted-foreground">Attendees: 12</span>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Completed</span>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">2h ago</span>
            </div>

            <div className="flex items-start space-x-3 p-3 border rounded-lg">
              <FileText className="h-5 w-5 text-green-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Client Presentation - Project Alpha</p>
                <p className="text-sm text-muted-foreground">Final deliverables presentation and feedback session</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-xs text-muted-foreground">Duration: 90 min</span>
                  <span className="text-xs text-muted-foreground">Attendees: 8</span>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Completed</span>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">1d ago</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Global Announcements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Global Announcements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Bell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Company-wide Communication Hub</h3>
            <p className="text-muted-foreground mb-4">
              Centralized announcement system and cross-department communication tools coming soon.
            </p>
            <p className="text-sm text-muted-foreground">
              Features will include: global announcements, department updates, emergency notifications, and communication analytics.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunicationPage;
