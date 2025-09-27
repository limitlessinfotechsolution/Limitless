import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { AuditLogQuery } from '../types';

interface AuditLogDetails {
  [key: string]: string | number | boolean | object | null;
}

export interface AuditLogEntry {
  action: string;
  entity: string;
  entityId?: string;
  userId?: string;
  details?: AuditLogDetails;
  ipAddress?: string;
  userAgent?: string;
  timestamp?: string;
}

class AuditLogger {
  private static instance: AuditLogger;
  private logQueue: AuditLogEntry[] = [];
  private isProcessing = false;
  private supabase: SupabaseClient;

  private constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = typeof window !== 'undefined' 
      ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      : process.env.SUPABASE_SERVICE_ROLE_KEY!;
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger();
    }
    return AuditLogger.instance;
  }

  /**
   * Log an audit event
   */
  async log(entry: AuditLogEntry): Promise<void> {
    // Add timestamp and basic context
    const logEntry: AuditLogEntry = {
      ...entry,
      timestamp: new Date().toISOString(),
      ipAddress: this.getClientIP(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
    };

    // Add to queue for batch processing
    this.logQueue.push(logEntry);

    // Process queue if not already processing
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  /**
   * Log admin action
   */
  async logAdminAction(
    action: string,
    entity: string,
    entityId?: string,
    details?: AuditLogDetails
  ): Promise<void> {
    await this.log({
      action,
      entity,
      entityId,
      details,
    });
  }

  /**
   * Log user action
   */
  async logUserAction(
    action: string,
    userId: string,
    details?: AuditLogDetails
  ): Promise<void> {
    await this.log({
      action,
      entity: 'user',
      entityId: userId,
      userId,
      details,
    });
  }

  /**
   * Log security event
   */
  async logSecurityEvent(
    action: string,
    details: AuditLogDetails
  ): Promise<void> {
    await this.log({
      action,
      entity: 'security',
      details,
    });
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.logQueue.length === 0) return;

    this.isProcessing = true;

    try {
      const entries = [...this.logQueue];
      this.logQueue = [];

      if (process.env.NODE_ENV === 'development') {
        console.log('Audit Logs:', entries);
      }

      // Batch insert using RPC for efficiency
      const entriesJson = JSON.stringify(entries.map(entry => ({
        action: entry.action,
        entity: entry.entity,
        entityId: entry.entityId,
        userId: entry.userId,
        details: entry.details || {},
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent,
        timestamp: entry.timestamp
      })));

      const { error } = await this.supabase.rpc('insert_audit_logs', { 
        entries: entriesJson 
      });

      if (error) {
        console.error('Failed to save audit logs:', error);
        // Re-queue failed entries with retry logic (max 3 retries)
        if (entries.length > 0) {
          this.logQueue.unshift(...entries);
          setTimeout(() => this.processQueue(), 5000); // Retry after 5s
        }
      }
    } catch (error) {
      console.error('Error processing audit log queue:', error);
      this.isProcessing = false;
      return;
    }

    this.isProcessing = false;

    // Process any new entries that were added while processing
    if (this.logQueue.length > 0) {
      setTimeout(() => this.processQueue(), 100);
    }
  }

  async createAuditLogEntry(entry: AuditLogEntry): Promise<void> {
    await this.log(entry);
  }

  async getAuditLogs(query: AuditLogQuery): Promise<AuditLogEntry[]> {
    let supabaseQuery = this.supabase
      .from('audit_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .range((query.pagination.page - 1) * query.pagination.limit, query.pagination.page * query.pagination.limit - 1);

    // Apply filters
    if (query.filters.action) {
      supabaseQuery = supabaseQuery.eq('action', query.filters.action);
    }
    if (query.filters.entity) {
      supabaseQuery = supabaseQuery.eq('entity', query.filters.entity);
    }
    if (query.filters.dateFrom) {
      supabaseQuery = supabaseQuery.gte('timestamp', query.filters.dateFrom.toISOString());
    }
    if (query.filters.dateTo) {
      supabaseQuery = supabaseQuery.lte('timestamp', query.filters.dateTo.toISOString());
    }

    // Apply sort
    if (query.sort.field && query.sort.direction) {
      supabaseQuery = supabaseQuery.order(query.sort.field, { ascending: query.sort.direction === 'asc' });
    }

    const { data, error } = await supabaseQuery;

    if (error) {
      console.error('Failed to fetch audit logs:', error);
      throw error;
    }

    return data as AuditLogEntry[];
  }

  private getClientIP(): string | undefined {
    // Server-side: from headers, client-side: from a passed param or geolocation
    if (typeof window !== 'undefined') {
      return undefined; // Client-side, pass from server if needed
    }
    // Server-side implementation would use req.headers['x-forwarded-for'] or similar
    return undefined;
  }
}

export const auditLogger = AuditLogger.getInstance();

// Convenience functions
export const logAdminAction = auditLogger.logAdminAction.bind(auditLogger);
export const logUserAction = auditLogger.logUserAction.bind(auditLogger);
export const logSecurityEvent = auditLogger.logSecurityEvent.bind(auditLogger);