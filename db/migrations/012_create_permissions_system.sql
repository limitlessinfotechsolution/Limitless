-- Create permissions system for granular access control

-- Permissions table
CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    description TEXT,
    resource TEXT NOT NULL, -- e.g., 'users', 'projects', 'leads'
    action TEXT NOT NULL, -- e.g., 'create', 'read', 'update', 'delete', 'manage'
    scope TEXT DEFAULT 'global', -- 'global', 'own', 'department', 'team'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    UNIQUE(resource, action, scope)
);

-- Role permissions junction table
CREATE TABLE IF NOT EXISTS public.role_permissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    role user_role NOT NULL,
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    granted_by UUID REFERENCES public.profiles(id),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    UNIQUE(role, permission_id)
);

-- User permissions overrides (for custom permissions beyond roles)
CREATE TABLE IF NOT EXISTS public.user_permissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    is_granted BOOLEAN NOT NULL,
    granted_by UUID REFERENCES public.profiles(id),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    reason TEXT,

    UNIQUE(user_id, permission_id)
);

-- Insert default permissions
INSERT INTO public.permissions (name, display_name, description, resource, action, scope) VALUES
-- User management
('users.create', 'Create Users', 'Can create new user accounts', 'users', 'create', 'global'),
('users.read', 'View Users', 'Can view user profiles and lists', 'users', 'read', 'global'),
('users.read.own', 'View Own Profile', 'Can view own user profile', 'users', 'read', 'own'),
('users.update', 'Edit Users', 'Can edit user profiles and settings', 'users', 'update', 'global'),
('users.update.own', 'Edit Own Profile', 'Can edit own user profile', 'users', 'update', 'own'),
('users.delete', 'Delete Users', 'Can delete user accounts', 'users', 'delete', 'global'),
('users.manage_roles', 'Manage User Roles', 'Can assign and change user roles', 'users', 'manage_roles', 'global'),

-- Content management
('content.create', 'Create Content', 'Can create pages, posts, and content', 'content', 'create', 'global'),
('content.read', 'View Content', 'Can view all content', 'content', 'read', 'global'),
('content.update', 'Edit Content', 'Can edit all content', 'content', 'update', 'global'),
('content.update.own', 'Edit Own Content', 'Can edit own created content', 'content', 'update', 'own'),
('content.delete', 'Delete Content', 'Can delete content', 'content', 'delete', 'global'),
('content.publish', 'Publish Content', 'Can publish and unpublish content', 'content', 'publish', 'global'),

-- Projects
('projects.create', 'Create Projects', 'Can create new projects', 'projects', 'create', 'global'),
('projects.read', 'View Projects', 'Can view all projects', 'projects', 'read', 'global'),
('projects.read.own', 'View Own Projects', 'Can view own assigned projects', 'projects', 'read', 'own'),
('projects.update', 'Edit Projects', 'Can edit all projects', 'projects', 'update', 'global'),
('projects.update.own', 'Edit Own Projects', 'Can edit own assigned projects', 'projects', 'update', 'own'),
('projects.delete', 'Delete Projects', 'Can delete projects', 'projects', 'delete', 'global'),

-- Leads
('leads.create', 'Create Leads', 'Can create new leads', 'leads', 'create', 'global'),
('leads.read', 'View Leads', 'Can view all leads', 'leads', 'read', 'global'),
('leads.read.own', 'View Own Leads', 'Can view own assigned leads', 'leads', 'read', 'own'),
('leads.update', 'Edit Leads', 'Can edit all leads', 'leads', 'update', 'global'),
('leads.update.own', 'Edit Own Leads', 'Can edit own assigned leads', 'leads', 'update', 'own'),
('leads.delete', 'Delete Leads', 'Can delete leads', 'leads', 'delete', 'global'),
('leads.assign', 'Assign Leads', 'Can assign leads to team members', 'leads', 'assign', 'global'),

-- Analytics
('analytics.read', 'View Analytics', 'Can view analytics and reports', 'analytics', 'read', 'global'),
('analytics.read.own', 'View Own Analytics', 'Can view own performance analytics', 'analytics', 'read', 'own'),
('analytics.export', 'Export Analytics', 'Can export analytics data', 'analytics', 'export', 'global'),

-- System administration
('system.settings', 'System Settings', 'Can modify system settings and configuration', 'system', 'settings', 'global'),
('system.backup', 'System Backup', 'Can create and manage system backups', 'system', 'backup', 'global'),
('system.logs', 'View System Logs', 'Can view system logs and audit trails', 'system', 'logs', 'global'),
('system.maintenance', 'System Maintenance', 'Can perform system maintenance tasks', 'system', 'maintenance', 'global'),

-- AI and automation
('ai.manage', 'Manage AI', 'Can configure and manage AI systems', 'ai', 'manage', 'global'),
('ai.train', 'Train AI Models', 'Can train and fine-tune AI models', 'ai', 'train', 'global'),
('automation.create', 'Create Automations', 'Can create workflow automations', 'automation', 'create', 'global'),
('automation.manage', 'Manage Automations', 'Can manage and modify automations', 'automation', 'manage', 'global'),

-- Communication
('communication.send', 'Send Communications', 'Can send emails and messages', 'communication', 'send', 'global'),
('communication.manage', 'Manage Communications', 'Can manage communication templates and settings', 'communication', 'manage', 'global');

-- Assign default permissions to roles
INSERT INTO public.role_permissions (role, permission_id) VALUES
-- Super Admin gets all permissions
('super_admin', (SELECT id FROM public.permissions WHERE name = 'users.create')),
('super_admin', (SELECT id FROM public.permissions WHERE name = 'users.read')),
('super_admin', (SELECT id FROM public.permissions WHERE name = 'users.update')),
('super_admin', (SELECT id FROM public.permissions WHERE name = 'users.delete')),
('super_admin', (SELECT id FROM public.permissions WHERE name = 'users.manage_roles')),
('super_admin', (SELECT id FROM public.permissions WHERE name = 'content.create')),
('super_admin', (SELECT id FROM public.permissions WHERE name = 'content.read')),
('super_admin', (SELECT id FROM public.permissions WHERE name = 'content.update')),
('super_admin', (SELECT id FROM public.permissions WHERE name = 'content.delete')),
('super_admin', (SELECT id FROM public.permissions WHERE name = 'content.publish')),
('super_admin', (SELECT id FROM public.permissions WHERE name = 'projects.create')),
('super_admin', (SELECT id FROM public.permissions WHERE name = 'projects.read')),
('super_admin', (SELECT id FROM public.permissions WHERE name = 'projects.update')),
('super_admin', (SELECT id FROM public.permissions WHERE name = 'projects.delete')),
('super_admin', (SELECT id FROM public.permissions WHERE name = 'leads.create')),
('super_admin', (SELECT id FROM public.permissions WHERE name = 'leads.read')),
('super_admin', (SELECT id FROM public.permissions WHERE name = 'leads.update')),
('super_admin', (SELECT id FROM public.permissions WHERE name = 'leads.delete')),
('super_admin', (SELECT id FROM public.permissions WHERE name = 'leads.assign')),
('super_admin', (SELECT id FROM public.permissions WHERE name = 'analytics.read')),
('super_admin', (SELECT id FROM public.permissions WHERE name = 'analytics.export')),
('super_admin', (SELECT id FROM public.permissions WHERE name = 'system.settings')),
('super_admin', (SELECT id FROM public.permissions WHERE name = 'system.backup')),
('super_admin', (SELECT id FROM public.permissions WHERE name = 'system.logs')),
('super_admin', (SELECT id FROM public.permissions WHERE name = 'system.maintenance')),
('super_admin', (SELECT id FROM public.permissions WHERE name = 'ai.manage')),
('super_admin', (SELECT id FROM public.permissions WHERE name = 'ai.train')),
('super_admin', (SELECT id FROM public.permissions WHERE name = 'automation.create')),
('super_admin', (SELECT id FROM public.permissions WHERE name = 'automation.manage')),
('super_admin', (SELECT id FROM public.permissions WHERE name = 'communication.send')),
('super_admin', (SELECT id FROM public.permissions WHERE name = 'communication.manage')),

-- Admin gets most permissions except system-level ones
('admin', (SELECT id FROM public.permissions WHERE name = 'users.create')),
('admin', (SELECT id FROM public.permissions WHERE name = 'users.read')),
('admin', (SELECT id FROM public.permissions WHERE name = 'users.update')),
('admin', (SELECT id FROM public.permissions WHERE name = 'users.manage_roles')),
('admin', (SELECT id FROM public.permissions WHERE name = 'content.create')),
('admin', (SELECT id FROM public.permissions WHERE name = 'content.read')),
('admin', (SELECT id FROM public.permissions WHERE name = 'content.update')),
('admin', (SELECT id FROM public.permissions WHERE name = 'content.publish')),
('admin', (SELECT id FROM public.permissions WHERE name = 'projects.create')),
('admin', (SELECT id FROM public.permissions WHERE name = 'projects.read')),
('admin', (SELECT id FROM public.permissions WHERE name = 'projects.update')),
('admin', (SELECT id FROM public.permissions WHERE name = 'leads.create')),
('admin', (SELECT id FROM public.permissions WHERE name = 'leads.read')),
('admin', (SELECT id FROM public.permissions WHERE name = 'leads.update')),
('admin', (SELECT id FROM public.permissions WHERE name = 'leads.assign')),
('admin', (SELECT id FROM public.permissions WHERE name = 'analytics.read')),
('admin', (SELECT id FROM public.permissions WHERE name = 'automation.create')),
('admin', (SELECT id FROM public.permissions WHERE name = 'communication.send')),

-- User gets basic permissions
('user', (SELECT id FROM public.permissions WHERE name = 'users.read.own')),
('user', (SELECT id FROM public.permissions WHERE name = 'users.update.own')),
('user', (SELECT id FROM public.permissions WHERE name = 'content.read')),
('user', (SELECT id FROM public.permissions WHERE name = 'projects.read.own')),
('user', (SELECT id FROM public.permissions WHERE name = 'projects.update.own')),
('user', (SELECT id FROM public.permissions WHERE name = 'leads.read.own')),
('user', (SELECT id FROM public.permissions WHERE name = 'leads.update.own')),
('user', (SELECT id FROM public.permissions WHERE name = 'analytics.read.own')),

-- Enterprise gets enhanced user permissions
('enterprise', (SELECT id FROM public.permissions WHERE name = 'users.read.own')),
('enterprise', (SELECT id FROM public.permissions WHERE name = 'users.update.own')),
('enterprise', (SELECT id FROM public.permissions WHERE name = 'content.read')),
('enterprise', (SELECT id FROM public.permissions WHERE name = 'projects.create')),
('enterprise', (SELECT id FROM public.permissions WHERE name = 'projects.read')),
('enterprise', (SELECT id FROM public.permissions WHERE name = 'projects.update')),
('enterprise', (SELECT id FROM public.permissions WHERE name = 'leads.create')),
('enterprise', (SELECT id FROM public.permissions WHERE name = 'leads.read')),
('enterprise', (SELECT id FROM public.permissions WHERE name = 'leads.update')),
('enterprise', (SELECT id FROM public.permissions WHERE name = 'analytics.read'));

-- Add RLS policies
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;

-- Permissions are viewable by admins and super admins
CREATE POLICY "Permissions are viewable by admins" ON public.permissions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Role permissions are viewable by admins and super admins
CREATE POLICY "Role permissions are viewable by admins" ON public.role_permissions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- User permissions are viewable by the user themselves or admins
CREATE POLICY "User permissions are viewable by user or admins" ON public.user_permissions
    FOR SELECT USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Only super admins can modify permissions
CREATE POLICY "Permissions can be modified by super admins" ON public.permissions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'super_admin'
        )
    );

CREATE POLICY "Role permissions can be modified by super admins" ON public.role_permissions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'super_admin'
        )
    );

CREATE POLICY "User permissions can be modified by super admins" ON public.user_permissions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'super_admin'
        )
    );

-- Add indexes for performance
CREATE INDEX idx_permissions_resource_action ON public.permissions(resource, action);
CREATE INDEX idx_role_permissions_role ON public.role_permissions(role);
CREATE INDEX idx_user_permissions_user_id ON public.user_permissions(user_id);
CREATE INDEX idx_user_permissions_expires_at ON public.user_permissions(expires_at);

-- Add table comments
COMMENT ON TABLE public.permissions IS 'Granular permissions for access control';
COMMENT ON TABLE public.role_permissions IS 'Junction table linking roles to permissions';
COMMENT ON TABLE public.user_permissions IS 'User-specific permission overrides';
