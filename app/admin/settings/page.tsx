'use client';

import React, { useState, useEffect } from 'react';
<<<<<<< Updated upstream
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
=======
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { useToast } from '@/hooks/ui/useToast';
import { Label } from '../../../src/components/ui/Label';
import { Switch } from '../../../src/components/ui/Switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../src/components/ui/Tabs';

interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  language: string;
  timezone: string;
}

const SettingsPage: React.FC = () => {
  const { success, error: errorToast } = useToast();
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'light',
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUserPreferences();
  }, []);

  const fetchUserPreferences = async () => {
    try {
      // In a real implementation, you would fetch from the database
      // const { data, error } = await supabase
      //   .from('user_preferences')
      //   .select('*')
      //   .single();
      
      // For now, we'll use mock data
      setLoading(false);
    } catch (error) {
      console.error('Error loading preferences:', error);
      errorToast('Error', 'Failed to load preferences');
>>>>>>> Stashed changes
      setLoading(false);
    }
  };

<<<<<<< Updated upstream
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
=======
  const savePreferences = async () => {
    try {
      setSaving(true);
      
      // In a real implementation, you would save to the database
      // const { error } = await supabase
      //   .from('user_preferences')
      //   .upsert({
      //     ...preferences,
      //     updated_at: new Date().toISOString(),
      //   });
      
      // For now, we'll just simulate saving
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      success('Success', 'Preferences saved successfully');
    } catch (error) {
      console.error('Error saving preferences:', error);
      errorToast('Error', 'Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationChange = (type: keyof UserPreferences['notifications'], value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: value,
      },
    }));
  };

  if (loading) {
    return <div className="p-8">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and settings.</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select 
                  value={preferences.theme} 
                  onValueChange={(value) => setPreferences(prev => ({ ...prev, theme: value as 'light' | 'dark' }))}
                >
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select 
                  value={preferences.language} 
                  onValueChange={(value) => setPreferences(prev => ({ ...prev, language: value }))}
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select 
                  value={preferences.timezone} 
                  onValueChange={(value) => setPreferences(prev => ({ ...prev, timezone: value }))}
                >
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time</SelectItem>
                    <SelectItem value="America/Chicago">Central Time</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    <SelectItem value="Europe/London">London</SelectItem>
                    <SelectItem value="Europe/Paris">Paris</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                    <SelectItem value="Asia/Dubai">Dubai</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  checked={preferences.notifications.email}
                  onCheckedChange={(checked: boolean) => handleNotificationChange('email', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive push notifications on your devices</p>
                </div>
                <Switch
                  checked={preferences.notifications.push}
                  onCheckedChange={(checked: boolean) => handleNotificationChange('push', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive text messages for important updates</p>
                </div>
                <Switch
                  checked={preferences.notifications.sms}
                  onCheckedChange={(checked: boolean) => handleNotificationChange('sms', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>

              <Button>Update Password</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={savePreferences} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
>>>>>>> Stashed changes
    </div>
  );
};

<<<<<<< Updated upstream
export default SettingsPage;
=======
export default SettingsPage;
>>>>>>> Stashed changes
