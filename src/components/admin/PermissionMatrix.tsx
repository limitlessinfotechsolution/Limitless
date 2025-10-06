'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const ButtonWithDisabled: React.FC<ButtonProps & { disabled?: boolean }> = ({ disabled, ...props }) => {
  return (
    <button
      {...props}
      disabled={disabled}
      className={`${props.className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={disabled ? undefined : props.onClick}
    >
      {props.icon && <span className="mr-2">{props.icon}</span>}
      {props.children}
    </button>
  );
};
import { Input } from '@/components/ui/Input';
import { Check, X, Search, Save, RefreshCw } from 'lucide-react';

interface Permission {
  id: string;
  name: string;
  display_name: string;
  description: string;
  resource: string;
  action: string;
  scope: string;
  is_active: boolean;
}

interface RolePermissions {
  [role: string]: Set<string>; // role -> set of permission ids
}

// Mock data for permissions (will be replaced with database calls once migration is run)
const mockPermissions: Permission[] = [
  // Users
  { id: '1', name: 'users.create', display_name: 'Create Users', description: 'Can create new user accounts', resource: 'users', action: 'create', scope: 'global', is_active: true },
  { id: '2', name: 'users.read', display_name: 'View Users', description: 'Can view user profiles and lists', resource: 'users', action: 'read', scope: 'global', is_active: true },
  { id: '3', name: 'users.update', display_name: 'Edit Users', description: 'Can edit user profiles and settings', resource: 'users', action: 'update', scope: 'global', is_active: true },
  { id: '4', name: 'users.delete', display_name: 'Delete Users', description: 'Can delete user accounts', resource: 'users', action: 'delete', scope: 'global', is_active: true },
  // Content
  { id: '5', name: 'content.create', display_name: 'Create Content', description: 'Can create pages, posts, and content', resource: 'content', action: 'create', scope: 'global', is_active: true },
  { id: '6', name: 'content.read', display_name: 'View Content', description: 'Can view all content', resource: 'content', action: 'read', scope: 'global', is_active: true },
  { id: '7', name: 'content.update', display_name: 'Edit Content', description: 'Can edit all content', resource: 'content', action: 'update', scope: 'global', is_active: true },
  { id: '8', name: 'content.publish', display_name: 'Publish Content', description: 'Can publish and unpublish content', resource: 'content', action: 'publish', scope: 'global', is_active: true },
  // Projects
  { id: '9', name: 'projects.create', display_name: 'Create Projects', description: 'Can create new projects', resource: 'projects', action: 'create', scope: 'global', is_active: true },
  { id: '10', name: 'projects.read', display_name: 'View Projects', description: 'Can view all projects', resource: 'projects', action: 'read', scope: 'global', is_active: true },
  { id: '11', name: 'projects.update', display_name: 'Edit Projects', description: 'Can edit all projects', resource: 'projects', action: 'update', scope: 'global', is_active: true },
  // Leads
  { id: '12', name: 'leads.create', display_name: 'Create Leads', description: 'Can create new leads', resource: 'leads', action: 'create', scope: 'global', is_active: true },
  { id: '13', name: 'leads.read', display_name: 'View Leads', description: 'Can view all leads', resource: 'leads', action: 'read', scope: 'global', is_active: true },
  { id: '14', name: 'leads.update', display_name: 'Edit Leads', description: 'Can edit all leads', resource: 'leads', action: 'update', scope: 'global', is_active: true },
  // Analytics
  { id: '15', name: 'analytics.read', display_name: 'View Analytics', description: 'Can view analytics and reports', resource: 'analytics', action: 'read', scope: 'global', is_active: true },
  // System
  { id: '16', name: 'system.settings', display_name: 'System Settings', description: 'Can modify system settings and configuration', resource: 'system', action: 'settings', scope: 'global', is_active: true },
  { id: '17', name: 'system.backup', display_name: 'System Backup', description: 'Can create and manage system backups', resource: 'system', action: 'backup', scope: 'global', is_active: true },
];

const mockRolePermissions: RolePermissions = {
  'user': new Set(['2', '6', '10', '13', '15']), // Basic read permissions
  'admin': new Set(['1', '2', '3', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15']), // Most permissions except system
  'super_admin': new Set(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17']), // All permissions
  'enterprise': new Set(['2', '6', '9', '10', '11', '12', '13', '14', '15']), // Enhanced user permissions
};

const PermissionMatrix: React.FC = () => {
  const [permissions] = useState<Permission[]>(mockPermissions);
  const [rolePermissions, setRolePermissions] = useState<RolePermissions>(mockRolePermissions);
  const [loading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResource, setSelectedResource] = useState<string>('all');

  const roles = ['user', 'admin', 'super_admin', 'enterprise'];
  const resources = ['users', 'content', 'projects', 'leads', 'analytics', 'system', 'ai', 'automation', 'communication'];

  const togglePermission = (role: string, permissionId: string) => {
    const newRolePermissions = { ...rolePermissions };
    if (!newRolePermissions[role]) {
      newRolePermissions[role] = new Set();
    }

    if (newRolePermissions[role].has(permissionId)) {
      newRolePermissions[role].delete(permissionId);
    } else {
      newRolePermissions[role].add(permissionId);
    }

    setRolePermissions(newRolePermissions);
  };

  const savePermissions = async () => {
    setSaving(true);
    try {
      // Mock save - in real implementation, this would save to database
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      // Update local storage for persistence (mock)
      localStorage.setItem('rolePermissions', JSON.stringify(
        Object.fromEntries(
          Object.entries(rolePermissions).map(([role, permSet]) => [role, Array.from(permSet)])
        )
      ));

      alert('Permissions saved successfully! (Mock implementation)');
    } catch (error) {
      console.error('Error saving permissions:', error);
      alert('Error saving permissions. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const filteredPermissions = permissions.filter(perm => {
    const matchesSearch = perm.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         perm.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesResource = selectedResource === 'all' || perm.resource === selectedResource;
    return matchesSearch && matchesResource;
  });

  const groupedPermissions = filteredPermissions.reduce((acc, perm) => {
    if (!acc[perm.resource]) acc[perm.resource] = [];
    acc[perm.resource].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
            Loading permissions...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Permission Matrix Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search permissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <select
                value={selectedResource}
                onChange={(e) => setSelectedResource(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Resources</option>
                {resources.map(resource => (
                  <option key={resource} value={resource}>
                    {resource.charAt(0).toUpperCase() + resource.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <ButtonWithDisabled
              onClick={savePermissions}
              disabled={saving}
              className="flex items-center gap-2"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </ButtonWithDisabled>
          </div>
        </CardContent>
      </Card>

      {/* Permission Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Role Permissions Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">Permission</th>
                  <th className="text-left p-3 font-semibold">Resource</th>
                  <th className="text-left p-3 font-semibold">Action</th>
                  <th className="text-left p-3 font-semibold">Scope</th>
                  {roles.map(role => (
                    <th key={role} className="text-center p-3 font-semibold min-w-[100px]">
                      {role.replace('_', ' ').toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(groupedPermissions).map(([resource, perms]) => (
                  <React.Fragment key={resource}>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <td colSpan={4 + roles.length} className="p-3 font-semibold text-blue-600">
                        {resource.charAt(0).toUpperCase() + resource.slice(1)} Permissions
                      </td>
                    </tr>
                    {perms.map(permission => (
                      <tr key={permission.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="p-3">
                          <div>
                            <div className="font-medium">{permission.display_name}</div>
                            <div className="text-sm text-gray-500">{permission.description}</div>
                          </div>
                        </td>
                        <td className="p-3">{permission.resource}</td>
                        <td className="p-3">{permission.action}</td>
                        <td className="p-3">{permission.scope}</td>
                        {roles.map(role => (
                          <td key={role} className="p-3 text-center">
                            <button
                              onClick={() => togglePermission(role, permission.id)}
                              className={`w-6 h-6 rounded border flex items-center justify-center ${
                                rolePermissions[role]?.has(permission.id)
                                  ? 'bg-green-500 border-green-500 text-white'
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              {rolePermissions[role]?.has(permission.id) ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <X className="w-4 h-4 text-gray-400" />
                              )}
                            </button>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Permission Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {roles.map(role => (
              <div key={role} className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {rolePermissions[role]?.size || 0}
                </div>
                <div className="text-sm text-gray-600">
                  {role.replace('_', ' ').toUpperCase()} Permissions
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PermissionMatrix;
