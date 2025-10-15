'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../src/components/ui/Card';
import { Settings, Palette, Key, Mail, CreditCard, Zap, Globe, Shield, RefreshCw, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface SettingsData {
  branding: {
    logo: string;
    primaryColor: string;
    secondaryColor: string;
    favicon: string;
  };
  integrations: {
    stripe: { connected: boolean; mode: string };
    sendgrid: { connected: boolean; verified: boolean };
    googleAnalytics: { connected: boolean; trackingId?: string };
    googleWorkspace: { connected: boolean };
    slack: { connected: boolean };
    zoom: { connected: boolean };
  };
  email: {
    smtp: { host: string; port: string; secure: boolean; configured: boolean };
    templates: { count: number; active: boolean };
    dkim: { configured: boolean };
  };
  features: {
    aiFeatures: boolean;
    analytics: boolean;
    betaFeatures: boolean;
  };
  system: {
    environment: string;
    timezone: string;
    locale: string;
  };
}

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/settings');
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      const data: SettingsData = await response.json();
      setSettings(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSetting = async (category: string, setting: string, value: any) => {
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category, setting, value }),
      });

      if (!response.ok) {
        throw new Error('Failed to update setting');
      }

      // Refresh settings after update
      await fetchSettings();
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update setting');
    }
  };

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getStatusText = (status: boolean, connectedText: string = 'Connected', notConnectedText: string = 'Not Connected') => {
    return status ? connectedText : notConnectedText;
  };

  const getStatusColor = (status: boolean) => {
    return status ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground">Configure system-wide settings, integrations, and customization options.</p>
        </div>
        <div className="flex items-center space-x-2">
          {lastUpdated && (
            <span className="text-sm text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={fetchSettings}
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
              <span className="text-red-700">Error loading settings: {error}</span>
            </div>
          </CardContent>
        </Card>
      )}

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
                <span>Primary Color</span>
                <span className="text-green-600">✓ {settings?.branding.primaryColor || '#007bff'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Favicon</span>
                <span className="text-green-600">✓ Configured</span>
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
                <span className={`flex items-center ${getStatusColor(settings?.integrations.stripe.connected || false)}`}>
                  {getStatusIcon(settings?.integrations.stripe.connected || false)}
                  <span className="ml-1">{getStatusText(settings?.integrations.stripe.connected || false, settings?.integrations.stripe.mode === 'live' ? 'Live Mode' : 'Test Mode')}</span>
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>SendGrid</span>
                <span className={`flex items-center ${getStatusColor(settings?.integrations.sendgrid.connected || false)}`}>
                  {getStatusIcon(settings?.integrations.sendgrid.connected || false)}
                  <span className="ml-1">{getStatusText(settings?.integrations.sendgrid.connected || false)}</span>
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Google Analytics</span>
                <span className={`flex items-center ${getStatusColor(settings?.integrations.googleAnalytics.connected || false)}`}>
                  {getStatusIcon(settings?.integrations.googleAnalytics.connected || false)}
                  <span className="ml-1">{getStatusText(settings?.integrations.googleAnalytics.connected || false)}</span>
                </span>
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
                <span className={`flex items-center ${getStatusColor(settings?.email.smtp.configured || false)}`}>
                  {getStatusIcon(settings?.email.smtp.configured || false)}
                  <span className="ml-1">{getStatusText(settings?.email.smtp.configured || false, 'Configured', 'Not Configured')}</span>
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Email Templates</span>
                <span className="text-green-600">✓ {settings?.email.templates.count || 0} Active</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>DKIM/SPF</span>
                <span className={`flex items-center ${getStatusColor(settings?.email.dkim.configured || false)}`}>
                  {getStatusIcon(settings?.email.dkim.configured || false)}
                  <span className="ml-1">{getStatusText(settings?.email.dkim.configured || false, 'Configured', 'Needs Setup')}</span>
                </span>
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
                <span className={`flex items-center ${getStatusColor(settings?.integrations.stripe.connected || false)}`}>
                  {getStatusIcon(settings?.integrations.stripe.connected || false)}
                  <span className="ml-1">{getStatusText(settings?.integrations.stripe.connected || false, settings?.integrations.stripe.mode === 'live' ? 'Live Mode' : 'Test Mode', 'Not Connected')}</span>
                </span>
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
                <span className={`flex items-center ${getStatusColor(settings?.integrations.googleWorkspace.connected || false)}`}>
                  {getStatusIcon(settings?.integrations.googleWorkspace.connected || false)}
                  <span className="ml-1">{getStatusText(settings?.integrations.googleWorkspace.connected || false)}</span>
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Slack</span>
                <span className={`flex items-center ${getStatusColor(settings?.integrations.slack.connected || false)}`}>
                  {getStatusIcon(settings?.integrations.slack.connected || false)}
                  <span className="ml-1">{getStatusText(settings?.integrations.slack.connected || false)}</span>
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Zoom</span>
                <span className={`flex items-center ${getStatusColor(settings?.integrations.zoom.connected || false)}`}>
                  {getStatusIcon(settings?.integrations.zoom.connected || false)}
                  <span className="ml-1">{getStatusText(settings?.integrations.zoom.connected || false)}</span>
                </span>
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
                <button
                  onClick={() => updateSetting('features', 'aiFeatures', !settings?.features.aiFeatures)}
                  className={`flex items-center ${getStatusColor(settings?.features.aiFeatures || false)} hover:opacity-75`}
                >
                  {getStatusIcon(settings?.features.aiFeatures || false)}
                  <span className="ml-1">{getStatusText(settings?.features.aiFeatures || false, 'Enabled', 'Disabled')}</span>
                </button>
              </div>
              <div className="flex justify-between text-sm">
                <span>Analytics</span>
                <button
                  onClick={() => updateSetting('features', 'analytics', !settings?.features.analytics)}
                  className={`flex items-center ${getStatusColor(settings?.features.analytics || false)} hover:opacity-75`}
                >
                  {getStatusIcon(settings?.features.analytics || false)}
                  <span className="ml-1">{getStatusText(settings?.features.analytics || false, 'Enabled', 'Disabled')}</span>
                </button>
              </div>
              <div className="flex justify-between text-sm">
                <span>Beta Features</span>
                <button
                  onClick={() => updateSetting('features', 'betaFeatures', !settings?.features.betaFeatures)}
                  className={`flex items-center ${getStatusColor(settings?.features.betaFeatures || false)} hover:opacity-75`}
                >
                  {getStatusIcon(settings?.features.betaFeatures || false)}
                  <span className="ml-1">{getStatusText(settings?.features.betaFeatures || false, 'Enabled', 'Disabled')}</span>
                </button>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2">Environment</h4>
              <p className="text-sm text-muted-foreground">{settings?.system.environment || 'development'}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Timezone</h4>
              <p className="text-sm text-muted-foreground">{settings?.system.timezone || 'UTC'}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Locale</h4>
              <p className="text-sm text-muted-foreground">{settings?.system.locale || 'en-US'}</p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t">
            <div className="text-center">
              <Settings className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Advanced Configuration</h3>
              <p className="text-muted-foreground mb-4">
                Additional system configuration options available for Super Admin users.
              </p>
              <p className="text-sm text-muted-foreground">
                Features include: environment variables, database settings, caching configuration, security policies, and performance tuning.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
