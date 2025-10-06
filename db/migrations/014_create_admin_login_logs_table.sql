-- Create admin login logs table for security monitoring

CREATE TABLE IF NOT EXISTS public.admin_login_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    attempt_time TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    success BOOLEAN NOT NULL,
    failure_reason TEXT, -- 'invalid_credentials', 'account_locked', '2fa_required', etc.
    ip_address INET,
    user_agent TEXT,
    geo_location JSONB,
    device_fingerprint TEXT,
    session_id UUID REFERENCES public.admin_sessions(id) ON DELETE SET NULL,
    two_factor_method TEXT, -- 'totp', 'email', 'sms', null
    two_factor_success BOOLEAN,

    -- Failed login tracking
    consecutive_failures INTEGER DEFAULT 0,
    account_locked_until TIMESTAMP WITH TIME ZONE,
    lock_reason TEXT
);

-- Add indexes for performance and queries
CREATE INDEX idx_admin_login_logs_email ON public.admin_login_logs(email);
CREATE INDEX idx_admin_login_logs_user_id ON public.admin_login_logs(user_id);
CREATE INDEX idx_admin_login_logs_attempt_time ON public.admin_login_logs(attempt_time);
CREATE INDEX idx_admin_login_logs_success ON public.admin_login_logs(success);
CREATE INDEX idx_admin_login_logs_ip_address ON public.admin_login_logs(ip_address);
CREATE INDEX idx_admin_login_logs_consecutive_failures ON public.admin_login_logs(consecutive_failures);

-- Add RLS policies
ALTER TABLE public.admin_login_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view login logs
CREATE POLICY "Admins can view login logs" ON public.admin_login_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- System can insert logs (via API routes)
CREATE POLICY "System can insert login logs" ON public.admin_login_logs
    FOR INSERT WITH CHECK (true);

-- Add table comment
COMMENT ON TABLE public.admin_login_logs IS 'Security audit log for admin login attempts and 2FA';
