-- Add 2FA (Two-Factor Authentication) fields to profiles table

-- Add 2FA related columns to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS two_factor_method TEXT DEFAULT 'totp'; -- 'totp', 'email', 'sms'
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS totp_secret TEXT; -- Encrypted TOTP secret
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS totp_backup_codes TEXT[]; -- Array of backup codes
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email_verification_token TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email_verification_expires TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS two_factor_setup_required BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_password_change TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW());
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS password_reset_token TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS password_reset_expires TIMESTAMP WITH TIME ZONE;

-- Add constraints
ALTER TABLE public.profiles ADD CONSTRAINT valid_two_factor_method
    CHECK (two_factor_method IN ('totp', 'email', 'sms'));

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_profiles_two_factor_enabled ON public.profiles(two_factor_enabled);
CREATE INDEX IF NOT EXISTS idx_profiles_email_verified ON public.profiles(email_verified);
CREATE INDEX IF NOT EXISTS idx_profiles_email_verification_token ON public.profiles(email_verification_token);
CREATE INDEX IF NOT EXISTS idx_profiles_password_reset_token ON public.profiles(password_reset_token);

-- Create backup codes table for better security (optional enhancement)
CREATE TABLE IF NOT EXISTS public.two_factor_backup_codes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    code_hash TEXT NOT NULL,
    used BOOLEAN DEFAULT false,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (TIMEZONE('utc'::text, NOW()) + INTERVAL '1 year'),

    UNIQUE(user_id, code_hash)
);

-- Add RLS policies for backup codes
ALTER TABLE public.two_factor_backup_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own backup codes" ON public.two_factor_backup_codes
    FOR ALL USING (user_id = auth.uid());

-- Function to generate backup codes
CREATE OR REPLACE FUNCTION generate_backup_codes(p_user_id UUID, p_count INTEGER DEFAULT 10)
RETURNS TEXT[] AS $$
DECLARE
    codes TEXT[] := ARRAY[]::TEXT[];
    code TEXT;
    i INTEGER := 0;
BEGIN
    -- Clear existing unused codes for the user
    DELETE FROM public.two_factor_backup_codes
    WHERE user_id = p_user_id AND used = false;

    -- Generate new codes
    WHILE i < p_count LOOP
        -- Generate 8-character alphanumeric code
        code := upper(substring(md5(random()::text) from 1 for 8));
        codes := array_append(codes, code);

        -- Store hashed version in database
        INSERT INTO public.two_factor_backup_codes (user_id, code_hash, expires_at)
        VALUES (p_user_id, crypt(code, gen_salt('bf')), TIMEZONE('utc'::text, NOW()) + INTERVAL '1 year');

        i := i + 1;
    END LOOP;

    RETURN codes;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify backup code
CREATE OR REPLACE FUNCTION verify_backup_code(p_user_id UUID, p_code TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    code_exists BOOLEAN := false;
BEGIN
    -- Check if code exists and is unused
    SELECT EXISTS(
        SELECT 1 FROM public.two_factor_backup_codes
        WHERE user_id = p_user_id
        AND code_hash = crypt(p_code, code_hash)
        AND used = false
        AND expires_at > TIMEZONE('utc'::text, NOW())
    ) INTO code_exists;

    IF code_exists THEN
        -- Mark code as used
        UPDATE public.two_factor_backup_codes
        SET used = true, used_at = TIMEZONE('utc'::text, NOW())
        WHERE user_id = p_user_id
        AND code_hash = crypt(p_code, code_hash);
    END IF;

    RETURN code_exists;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comments
COMMENT ON COLUMN public.profiles.two_factor_enabled IS 'Whether 2FA is enabled for this user';
COMMENT ON COLUMN public.profiles.two_factor_method IS '2FA method: totp, email, or sms';
COMMENT ON COLUMN public.profiles.totp_secret IS 'Encrypted TOTP secret for authenticator apps';
COMMENT ON COLUMN public.profiles.totp_backup_codes IS 'Array of backup codes for account recovery';
COMMENT ON COLUMN public.profiles.two_factor_setup_required IS 'Whether user must set up 2FA on next login';
