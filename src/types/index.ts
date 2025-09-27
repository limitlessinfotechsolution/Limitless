export interface AuditLogDetails {
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

export interface AuditLogQuery {
  filters: {
    action?: string;
    entity?: string;
    dateFrom?: Date;
    dateTo?: Date;
  };
  pagination: {
    page: number;
    limit: number;
  };
  sort: {
    field: string;
    direction: 'asc' | 'desc';
  };
}

export enum ExportFormat {
  CSV = 'csv',
  PDF = 'pdf',
  JSON = 'json',
}

// Extend existing interfaces if needed
export interface ExtendedLeadData {
  id: string;
  business_basics: Record<string, unknown>;
  project_details: Record<string, unknown>;
  timeline_budget: Record<string, unknown>;
  source_page: string;
  lead_score: number;
  created_at: string;
  updated_at: string;
  selected?: boolean; // For bulk actions
}

export interface ExtendedTestimonialData {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  image?: string;
  approved: boolean;
  page_id?: string;
  created_at: string;
  updated_at: string;
  selected?: boolean; // For bulk actions
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  image?: string;
  approved: boolean;
  page_id?: string;
  created_at: string;
  updated_at: string;
}

export interface SecurityMetric {
  threatLevel: 'low' | 'medium' | 'high';
  loginAttempts: number;
  suspiciousIPs: string[];
  timestamp: Date;
}
