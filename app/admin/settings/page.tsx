'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../src/components/ui/Card';
import { Settings, Palette, Key, Mail, CreditCard, Zap, Globe, Shield } from 'lucide-react';

const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground">Configure system-wide settings, integrations, and customization options.</p>
        </div>
      </div>

      {/* Settings Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Palette className="mr-2 h-5 w-5 text-blue-500" />
              Branding
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Customize logos, themes, and visual identity across the platform.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Logo</span>
                <span className="text-green-600">✓ Configured</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Color Scheme</span>
                <span className="text-green-600">✓ Configured</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Favicon</span>
                <span className="text-yellow-600">⚠ Pending</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Key className="mr-2 h-5 w-5 text-green-500" />
              API Keys
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Manage third-party API integrations and authentication keys.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Stripe</span>
                <span className="text-green-600">✓ Connected</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>SendGrid</span>
                <span className="text-green-600">✓ Connected</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Google Analytics</span>
                <span className="text-red-600">✗ Not Connected</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Mail className="mr-2 h-5 w-5 text-purple-500" />
              Email & SMTP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Configure email delivery, SMTP settings, and notification templates.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>SMTP Server</span>
                <span className="text-green-600">✓ Configured</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Email Templates</span>
                <span className="text-green-600">✓ 12 Active</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>DKIM/SPF</span>
                <span className="text-yellow-600">⚠ Needs Setup</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <CreditCard className="mr-2 h-5 w-5 text-yellow-500" />
              Payment Gateway
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Set up payment processing, subscription plans, and billing rules.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Stripe Integration</span>
                <span className="text-green-600">✓ Live Mode</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Subscription Plans</span>
                <span className="text-green-600">✓ 3 Active</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax Settings</span>
                <span className="text-yellow-600">⚠ Incomplete</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Globe className="mr-2 h-5 w-5 text-indigo-500" />
              Integrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Connect with external services and third-party applications.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Google Workspace</span>
                <span className="text-red-600">✗ Not Connected</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Slack</span>
                <span className="text-red-600">✗ Not Connected</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Zoom</span>
                <span className="text-red-600">✗ Not Connected</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Zap className="mr-2 h-5 w-5 text-orange-500" />
              Feature Toggles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Enable or disable system features and experimental functionality.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>AI Features</span>
                <span className="text-green-600">✓ Enabled</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Analytics</span>
                <span className="text-green-600">✓ Enabled</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Beta Features</span>
                <span className="text-yellow-600">⚠ Limited</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            System Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Settings className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Advanced Configuration Panel</h3>
            <p className="text-muted-foreground mb-4">
              Comprehensive system configuration and customization options coming soon.
            </p>
            <p className="text-sm text-muted-foreground">
              Features will include: environment variables, database settings, caching configuration, security policies, and performance tuning.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
