-- Add audit_logs table for tracking admin and user actions
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id UUID,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    -- Constraints
    CONSTRAINT audit_logs_action_length CHECK (LENGTH(action) > 0),
    CONSTRAINT audit_logs_entity_length CHECK (LENGTH(entity) > 0)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs (action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON public.audit_logs (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs (entity);
CREATE INDEX IF NOT EXISTS idx_audit_logs_ip_address ON public.audit_logs (ip_address);

-- Row Level Security (RLS) - only admins can read/write
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can view audit logs" ON public.audit_logs
    FOR SELECT USING (auth.role() = 'authenticated' AND EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    ));

CREATE POLICY "Admin can insert audit logs" ON public.audit_logs
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'moderator')
    ));

-- Function for batch insert (optional RPC for efficiency)
CREATE OR REPLACE FUNCTION public.insert_audit_logs(entries JSONB)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.audit_logs (action, entity, entity_id, user_id, details, ip_address, user_agent, timestamp)
    SELECT 
        (entry->>'action')::TEXT,
        (entry->>'entity')::TEXT,
        (entry->>'entity_id')::UUID,
        (entry->>'user_id')::UUID,
        COALESCE(entry->'details', '{}')::JSONB,
        (entry->>'ip_address')::INET,
        entry->>'user_agent',
        (entry->>'timestamp')::TIMESTAMPTZ
    FROM jsonb_array_elements(entries) AS entry;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;