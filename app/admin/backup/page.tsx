'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { HardDrive, Download, Clock, CheckCircle, AlertTriangle, RotateCcw, Cloud } from 'lucide-react';

const BackupPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Backup & Recovery</h1>
          <p className="text-muted-foreground">Manage data backups, recovery options, and disaster recovery planning.</p>
        </div>
        <div className="flex space-x-2">
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            <Download className="mr-2 h-4 w-4" />
            Backup Now
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            <RotateCcw className="mr-2 h-4 w-4" />
            Restore
          </button>
        </div>
      </div>

      {/* Backup Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2h ago</div>
            <p className="text-xs text-muted-foreground">Automated daily backup</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Backup Size</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4GB</div>
            <p className="text-xs text-muted-foreground">Compressed size</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retention Period</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">30 days</div>
            <p className="text-xs text-muted-foreground">Daily backups kept</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cloud Storage</CardTitle>
            <Cloud className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">Storage utilization</p>
          </CardContent>
        </Card>
      </div>

      {/* Backup History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Recent Backups
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Automated Daily Backup</p>
                  <p className="text-xs text-muted-foreground">Full system backup including database and files</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">2.4GB</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Weekly Full Backup</p>
                  <p className="text-xs text-muted-foreground">Complete system snapshot with verification</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">3.1GB</p>
                <p className="text-xs text-muted-foreground">3 days ago</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium">Database Only Backup</p>
                  <p className="text-xs text-muted-foreground">Database backup completed with warnings</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">1.8GB</p>
                <p className="text-xs text-muted-foreground">5 days ago</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Monthly Archive</p>
                  <p className="text-xs text-muted-foreground">Complete archive for compliance and long-term storage</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">4.2GB</p>
                <p className="text-xs text-muted-foreground">2 weeks ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backup Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Backup Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">Daily Backups</p>
                  <p className="text-xs text-muted-foreground">Complete system backup every 24 hours</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Active</span>
                  <span className="text-xs text-muted-foreground">02:00 UTC</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">Weekly Backups</p>
                  <p className="text-xs text-muted-foreground">Full system snapshot every Sunday</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Active</span>
                  <span className="text-xs text-muted-foreground">03:00 UTC</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">Monthly Archives</p>
                  <p className="text-xs text-muted-foreground">Long-term archive on the 1st of each month</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Active</span>
                  <span className="text-xs text-muted-foreground">04:00 UTC</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Storage Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Cloud className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">AWS S3 Primary</p>
                    <p className="text-xs text-muted-foreground">us-east-1 region, encrypted storage</p>
                  </div>
                </div>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Active</span>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <HardDrive className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Local Storage</p>
                    <p className="text-xs text-muted-foreground">On-premise backup server</p>
                  </div>
                </div>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Active</span>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Cloud className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm font-medium">Google Cloud Storage</p>
                    <p className="text-xs text-muted-foreground">Secondary offsite backup</p>
                  </div>
                </div>
                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Standby</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Disaster Recovery */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Disaster Recovery
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Advanced Recovery Options</h3>
            <p className="text-muted-foreground mb-4">
              Comprehensive disaster recovery and business continuity planning coming soon.
            </p>
            <p className="text-sm text-muted-foreground">
              Features will include: point-in-time recovery, cross-region replication, automated failover, and recovery testing.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BackupPage;
