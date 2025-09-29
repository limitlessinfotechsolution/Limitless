-- Create super admin user and profile
-- This migration creates the admin user in auth.users and the corresponding profile

-- Create the admin user in auth.users (requires service role permissions)
-- Using a fixed UUID for consistency
INSERT INTO auth.users (
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    user_metadata
) VALUES (
    '00000000-0000-0000-0000-000000000001'::uuid,
    'authenticated',
    'authenticated',
    'admin@limitlessinfotech.com',
    -- Password: Try@Admin123 (hashed with Supabase's method)
    -- Note: This is a bcrypt hash. In production, use proper password hashing

-- Insert additional admin profiles (uncomment and modify as needed for future admins)
-- Example: Regular Admin
-- INSERT INTO public.profiles (
--     id,
--     email,
--     full_name,
--     role,
--     is_active,
--     is_verified,
--     created_at,
--     updated_at
-- ) VALUES (
--     (SELECT id FROM auth.users WHERE email = 'admin2@limitlessinfotech.com'),
--     'admin2@limitlessinfotech.com',
--     'Admin User',
--     'admin',
--     true,
--     true,
--     NOW(),
--     NOW()
-- ) ON CONFLICT (id) DO UPDATE SET
--     role = 'admin',
--     full_name = 'Admin User',
--     is_active = true,
--     is_verified = true,
--     updated_at = NOW();

-- Example: Moderator
-- INSERT INTO public.profiles (
--     id,
--     email,
--     full_name,
--     role,
--     is_active,
--     is_verified,
--     created_at,
--     updated_at
-- ) VALUES (
--     (SELECT id FROM auth.users WHERE email = 'moderator@limitlessinfotech.com'),
--     'moderator@limitlessinfotech.com',
--     'Moderator User',
--     'moderator',
--     true,
--     true,
--     NOW(),
--     NOW()
-- ) ON CONFLICT (id) DO UPDATE SET
--     role = 'moderator',
--     full_name = 'Moderator User',
--     is_active = true,
--     is_verified = true,
--     updated_at = NOW();

-- Verify the admin profiles were created
-- This query will show all admin profiles
-- SELECT id, email, full_name, role FROM public.profiles WHERE role IN ('moderator', 'admin', 'super_admin') ORDER BY role;
