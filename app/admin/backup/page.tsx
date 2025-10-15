'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { HardDrive, Download, Clock, CheckCircle, AlertTriangle, RotateCcw, Cloud, RefreshCw, Play, Pause, TestTube } from 'lucide-react';

interface BackupData {
  status: {
    lastBackup: string;
    backupSize: string;
    retentionPeriod: string;
    cloudStorage: string;
  };
  history: Array<{
    id: string;
    type: string;
    description: string;
    status: 'completed' | 'warning' | 'error';
    size: string;
    timestamp: string;
  }>;
  schedules: Array<{
    id: string;
    name: string;
    description: string;
    frequency: string;
    time: string;
    active: boolean;
  }>;
  storage: Array<{
    id: string;
    name: string;
    type: 'cloud' | 'local';
    provider?: string;
    region?: string;
    location?: string;
    encrypted: boolean;
    status: 'active' | 'standby' | 'error';
  }>;
}

const BackupPage: React.FC = () => {
  const [backupData, setBackupData] = useState<BackupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [backupInProgress, setBackupInProgress] = useState(false);
  const [restoreInProgress, setRestoreInProgress] = useState(false);

  const fetchBackupData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/backup');
      if (!response.ok) {
        throw new Error('Failed to fetch backup data');
      }
      const data: BackupData = await response.json();
      setBackupData(data);
      setLastUpdated(new Date());
      setError(null);
    } catch {
      setError('Failed to fetch backup data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackupData();
  }, []);

  const handleBackupNow = async () => {
    try {
      setBackupInProgress(true);
      const response = await fetch('/api/admin/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'backup_now' }),
      });

      if (!response.ok) {
        throw new Error('Failed to start backup');
      }

      const result = await response.json();
      alert(`Backup initiated successfully! Estimated time: ${result.estimatedTime}`);
      await fetchBackupData(); // Refresh data
    } catch {
      alert('Failed to start backup');
    } finally {
      setBackupInProgress(false);
    }
  };

  const handleRestore = async () => {
    const backupId = prompt('Enter backup ID to restore from:');
    if (!backupId) return;

    try {
      setRestoreInProgress(true);
      const response = await fetch('/api/admin/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'restore', backupId }),
      });

      if (!response.ok) {
        throw new Error('Failed to start restore');
      }

      const result = await response.json();
      alert(`Restore initiated successfully! Estimated time: ${result.estimatedTime}`);
      await fetchBackupData(); // Refresh data
    } catch {
      alert('Failed to start restore');
    } finally {
      setRestoreInProgress(false);
    }
  };

  const toggleSchedule = async (scheduleId: string) => {
    try {
      const response = await fetch('/api/admin/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'toggle_schedule', scheduleId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update schedule');
      }

      await fetchBackupData(); // Refresh data
    } catch {
      alert('Failed to update schedule');
    }
  };

  const testStorage = async (storageId: string) => {
    try {
      const response = await fetch('/api/admin/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'test_storage', storageId }),
      });

      if (!response.ok) {
        throw new Error('Failed to test storage');
      }

      const result = await response.json();
      alert(`Storage test completed: ${result.status}`);
    } catch {
      alert('Failed to test storage');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'standby':
        return <Pause className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string, active?: boolean) => {
    if (typeof active === 'boolean') {
      return active ? (
        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Active</span>
      ) : (
        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">Inactive</span>
      );
    }

    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Active</span>;
      case 'standby':
        return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Standby</span>;
      case 'error':
        return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Error</span>;
      default:
        return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">Unknown</span>;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      return 'Less than an hour ago';
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return `${Math.floor(diffDays / 7)} weeks ago`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Backup & Recovery</h1>
          <p className="text-muted-foreground">Manage data backups, recovery options, and disaster recovery planning.</p>
        </div>
        <div className="flex items-center space-x-2">
          {lastUpdated && (
            <span className="text-sm text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={fetchBackupData}
            disabled={loading}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleBackupNow}
            disabled={backupInProgress}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            <Download className={`mr-2 h-4 w-4 ${backupInProgress ? 'animate-spin' : ''}`} />
            {backupInProgress ? 'Backing up...' : 'Backup Now'}
          </button>
          <button
            onClick={handleRestore}
            disabled={restoreInProgress}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <RotateCcw className={`mr-2 h-4 w-4 ${restoreInProgress ? 'animate-spin' : ''}`} />
            {restoreInProgress ? 'Restoring...' : 'Restore'}
          </button>
        </div>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700">Error loading backup data: {error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Backup Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{backupData?.status.lastBackup || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">Automated daily backup</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Backup Size</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{backupData?.status.backupSize || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">Compressed size</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retention Period</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{backupData?.status.retentionPeriod || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">Daily backups kept</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cloud Storage</CardTitle>
            <Cloud className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{backupData?.status.cloudStorage || 'N/A'}</div>
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
            {backupData?.history.map((backup) => (
              <div key={backup.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(backup.status)}
                  <div>
                    <p className="text-sm font-medium">{backup.type}</p>
                    <p className="text-xs text-muted-foreground">{backup.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{backup.size}</p>
                  <p className="text-xs text-muted-foreground">{formatTimestamp(backup.timestamp)}</p>
                </div>
              </div>
            ))}
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
              {backupData?.schedules.map((schedule) => (
                <div key={schedule.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{schedule.name}</p>
                    <p className="text-xs text-muted-foreground">{schedule.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge('', schedule.active)}
                    <span className="text-xs text-muted-foreground">{schedule.time}</span>
                    <button
                      onClick={() => toggleSchedule(schedule.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      {schedule.active ? (
                        <Pause className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Play className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Storage Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {backupData?.storage.map((storage) => (
                <div key={storage.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Cloud className={`h-5 w-5 ${
                      storage.provider === 'aws' ? 'text-blue-500' :
                      storage.provider === 'gcp' ? 'text-purple-500' :
                      'text-green-500'
                    }`} />
                    <div>
                      <p className="text-sm font-medium">{storage.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {storage.region ? `${storage.region} region` : storage.location}, {storage.encrypted ? 'encrypted' : 'unencrypted'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(storage.status)}
                    <button
                      onClick={() => testStorage(storage.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Test connection"
                    >
                      <TestTube className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              ))}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Recovery Options</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Point-in-Time Recovery</p>
                    <p className="text-xs text-muted-foreground">Restore to specific timestamp</p>
                  </div>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Available</span>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Cross-Region Replication</p>
                    <p className="text-xs text-muted-foreground">Automatic failover to secondary region</p>
                  </div>
                  <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Planned</span>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Automated Failover</p>
                    <p className="text-xs text-muted-foreground">Zero-downtime recovery</p>
                  </div>
                  <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Planned</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Recovery Testing</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Last Recovery Test</p>
                    <p className="text-xs text-muted-foreground">Monthly automated test</p>
                  </div>
                  <span className="text-xs text-muted-foreground">2 weeks ago</span>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Test Environment</p>
                    <p className="text-xs text-muted-foreground">Isolated recovery testing</p>
                  </div>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Ready</span>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Recovery Time Objective</p>
                    <p className="text-xs text-muted-foreground">Target: 4 hours</p>
                  </div>
                  <span className="text-xs text-muted-foreground">Current: 2.5h</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BackupPage;
