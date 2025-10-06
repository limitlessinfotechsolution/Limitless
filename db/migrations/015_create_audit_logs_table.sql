-- Create comprehensive audit logs table for system activity tracking

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    session_id UUID REFERENCES public.admin_sessions(id) ON DELETE SET NULL,
    action TEXT NOT NULL, -- 'login', 'logout', 'create', 'update', 'delete', 'view', etc.
    resource_type TEXT NOT NULL, -- 'user', 'project', 'lead', 'content', 'system', etc.
    resource_id TEXT, -- ID of the affected resource
    details JSONB, -- Additional context about the action
    ip_address INET,
    user_agent TEXT,
    geo_location JSONB,
    severity TEXT DEFAULT 'info', -- 'low', 'medium', 'high', 'critical'
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    old_values JSONB, -- For update/delete operations
    new_values JSONB, -- For create/update operations
    metadata JSONB -- Additional system metadata
);

-- Add indexes for performance
CREATE INDEX idx_audit_logs_timestamp ON public.audit_logs(timestamp);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_session_id ON public.audit_logs(session_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_resource_type ON public.audit_logs(resource_type);
CREATE INDEX idx_audit_logs_resource_id ON public.audit_logs(resource_id);
CREATE INDEX idx_audit_logs_severity ON public.audit_logs(severity);
CREATE INDEX idx_audit_logs_success ON public.audit_logs(success);

-- Composite indexes for common queries
CREATE INDEX idx_audit_logs_user_action ON public.audit_logs(user_id, action);
CREATE INDEX idx_audit_logs_resource_action ON public.audit_logs(resource_type, action);
CREATE INDEX idx_audit_logs_time_range ON public.audit_logs(timestamp, severity);

-- Add RLS policies
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- System can insert audit logs (via API routes and triggers)
CREATE POLICY "System can insert audit logs" ON public.audit_logs
    FOR INSERT WITH CHECK (true);

-- Add table comment
COMMENT ON TABLE public.audit_logs IS 'Comprehensive audit trail for all admin and system activities';

-- Create a function to automatically log admin actions
CREATE OR REPLACE FUNCTION log_admin_action(
    p_user_id UUID,
    p_session_id UUID,
    p_action TEXT,
    p_resource_type TEXT,
    p_resource_id TEXT DEFAULT NULL,
    p_details JSONB DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_geo_location JSONB DEFAULT NULL,
    p_severity TEXT DEFAULT 'info',
    p_success BOOLEAN DEFAULT true,
    p_error_message TEXT DEFAULT NULL,
    p_old_values JSONB DEFAULT NULL,
    p_new_values JSONB DEFAULT NULL,
    p_metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO public.audit_logs (
        user_id, session_id, action, resource_type, resource_id, details,
        ip_address, user_agent, geo_location, severity, success, error_message,
        old_values, new_values, metadata
    ) VALUES (
        p_user_id, p_session_id, p_action, p_resource_type, p_resource_id, p_details,
        p_ip_address, p_user_agent, p_geo_location, p_severity, p_success, p_error_message,
        p_old_values, p_new_values, p_metadata
    )
    RETURNING id INTO log_id;

    RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
