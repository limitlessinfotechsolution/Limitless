-- Create admin sessions table for secure session management

CREATE TABLE IF NOT EXISTS public.admin_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    session_token_hash TEXT NOT NULL UNIQUE,
    refresh_token_hash TEXT,
    device_fingerprint TEXT,
    ip_address INET,
    user_agent TEXT,
    geo_location JSONB, -- Store country, city, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    terminated_at TIMESTAMP WITH TIME ZONE,
    terminated_by UUID REFERENCES public.profiles(id),
    termination_reason TEXT,

    UNIQUE(user_id, session_token_hash)
);

-- Add indexes for performance
CREATE INDEX idx_admin_sessions_user_id ON public.admin_sessions(user_id);
CREATE INDEX idx_admin_sessions_token_hash ON public.admin_sessions(session_token_hash);
CREATE INDEX idx_admin_sessions_expires_at ON public.admin_sessions(expires_at);
CREATE INDEX idx_admin_sessions_last_activity ON public.admin_sessions(last_activity);
CREATE INDEX idx_admin_sessions_is_active ON public.admin_sessions(is_active);

-- Add RLS policies
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own sessions
CREATE POLICY "Users can view their own sessions" ON public.admin_sessions
    FOR SELECT USING (user_id = auth.uid());

-- Admins can view all sessions
CREATE POLICY "Admins can view all sessions" ON public.admin_sessions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Only the system can insert/update sessions (via API routes)
CREATE POLICY "System can manage sessions" ON public.admin_sessions
    FOR ALL USING (false); -- Will be handled by service role

-- Add table comment
COMMENT ON TABLE public.admin_sessions IS 'Secure session management for admin users';
