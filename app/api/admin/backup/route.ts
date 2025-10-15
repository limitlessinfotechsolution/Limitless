import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

// Initialize Supabase admin client with service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Load environment variables for JWT secret
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'your_jwt_secret';

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const clientIP = request.headers.get('x-client-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (clientIP) {
    return clientIP;
  }
  return 'unknown';
}

export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('admin_auth_token')?.value;
    const clientIP = getClientIP(request);

    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify and decode the JWT token
    let decoded;
    try {
      decoded = jwt.verify(authToken, JWT_SECRET) as { userId: string; role: string };
    } catch {
      return NextResponse.json({ error: 'Invalid session token' }, { status: 401 });
    }

    const userId = decoded.userId;
    const userRole = decoded.role;

    // Check if user has permission to view backup info (admin or super_admin)
    if (userRole !== 'admin' && userRole !== 'super_admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Mock backup data - in production, this would come from a backup management system
    const backupData = {
      status: {
        lastBackup: '2 hours ago',
        backupSize: '2.4GB',
        retentionPeriod: '30 days',
        cloudStorage: '94%',
      },
      history: [
        {
          id: 'backup_001',
          type: 'Automated Daily Backup',
          description: 'Full system backup including database and files',
          status: 'completed',
          size: '2.4GB',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'backup_002',
          type: 'Weekly Full Backup',
          description: 'Complete system snapshot with verification',
          status: 'completed',
          size: '3.1GB',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'backup_003',
          type: 'Database Only Backup',
          description: 'Database backup completed with warnings',
          status: 'warning',
          size: '1.8GB',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'backup_004',
          type: 'Monthly Archive',
          description: 'Complete archive for compliance and long-term storage',
          status: 'completed',
          size: '4.2GB',
          timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
      schedules: [
        {
          id: 'schedule_daily',
          name: 'Daily Backups',
          description: 'Complete system backup every 24 hours',
          frequency: 'daily',
          time: '02:00 UTC',
          active: true,
        },
        {
          id: 'schedule_weekly',
          name: 'Weekly Backups',
          description: 'Full system snapshot every Sunday',
          frequency: 'weekly',
          time: '03:00 UTC',
          active: true,
        },
        {
          id: 'schedule_monthly',
          name: 'Monthly Archives',
          description: 'Long-term archive on the 1st of each month',
          frequency: 'monthly',
          time: '04:00 UTC',
          active: true,
        },
      ],
      storage: [
        {
          id: 'storage_aws',
          name: 'AWS S3 Primary',
          type: 'cloud',
          provider: 'aws',
          region: 'us-east-1',
          encrypted: true,
          status: 'active',
        },
        {
          id: 'storage_local',
          name: 'Local Storage',
          type: 'local',
          location: 'On-premise backup server',
          encrypted: true,
          status: 'active',
        },
        {
          id: 'storage_gcp',
          name: 'Google Cloud Storage',
          type: 'cloud',
          provider: 'gcp',
          region: 'us-central1',
          encrypted: true,
          status: 'standby',
        },
      ],
    };

    // Log the backup access
    await supabaseAdmin.from('audit_logs').insert({
      user_id: userId,
      action: 'view',
      resource_type: 'backup',
      resource_id: 'system',
      details: { accessed: 'backup_management' },
      ip_address: clientIP,
      user_agent: request.headers.get('user-agent'),
      severity: 'info',
      success: true,
    });

    return NextResponse.json(backupData);
  } catch (error) {
    console.error('Backup fetch error:', error);
    return NextResponse.json({
      error: 'Failed to fetch backup data',
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authToken = request.cookies.get('admin_auth_token')?.value;
    const clientIP = getClientIP(request);

    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify and decode the JWT token
    let decoded;
    try {
      decoded = jwt.verify(authToken, JWT_SECRET) as { userId: string; role: string };
    } catch {
      return NextResponse.json({ error: 'Invalid session token' }, { status: 401 });
    }

    const userId = decoded.userId;
    const userRole = decoded.role;

    // Check if user has permission to manage backups (super_admin only)
    if (userRole !== 'super_admin') {
      return NextResponse.json({ error: 'Insufficient permissions - Super Admin required' }, { status: 403 });
    }

    const body = await request.json();
    const { action, backupId, scheduleId, storageId } = body;

    // Validate input
    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 });
    }

    let result = {};

    switch (action) {
      case 'backup_now':
        // In production, this would trigger an immediate backup
        console.log('Starting immediate backup...');
        result = {
          success: true,
          message: 'Backup initiated successfully',
          backupId: `backup_${Date.now()}`,
          estimatedTime: '15-30 minutes',
        };
        break;

      case 'restore':
        if (!backupId) {
          return NextResponse.json({ error: 'Backup ID is required for restore' }, { status: 400 });
        }
        // In production, this would initiate a restore process
        console.log(`Starting restore from backup: ${backupId}`);
        result = {
          success: true,
          message: 'Restore initiated successfully',
          restoreId: `restore_${Date.now()}`,
          estimatedTime: '20-45 minutes',
        };
        break;

      case 'toggle_schedule':
        if (!scheduleId) {
          return NextResponse.json({ error: 'Schedule ID is required' }, { status: 400 });
        }
        // In production, this would update the schedule status
        console.log(`Toggling schedule: ${scheduleId}`);
        result = {
          success: true,
          message: 'Schedule updated successfully',
        };
        break;

      case 'test_storage':
        if (!storageId) {
          return NextResponse.json({ error: 'Storage ID is required' }, { status: 400 });
        }
        // In production, this would test the storage connection
        console.log(`Testing storage connection: ${storageId}`);
        result = {
          success: true,
          message: 'Storage connection test completed successfully',
          status: 'healthy',
        };
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Log the backup action
    await supabaseAdmin.from('audit_logs').insert({
      user_id: userId,
      action: action,
      resource_type: 'backup',
      resource_id: backupId || scheduleId || storageId || 'system',
      details: { action, result },
      ip_address: clientIP,
      user_agent: request.headers.get('user-agent'),
      severity: 'warning',
      success: true,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Backup action error:', error);
    return NextResponse.json({
      error: 'Failed to perform backup action',
    }, { status: 500 });
  }
}
