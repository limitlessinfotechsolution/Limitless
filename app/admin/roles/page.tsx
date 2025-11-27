'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Shield, Users, Key, Settings, Plus, Edit, Trash2 } from 'lucide-react';
import PermissionMatrix from '@/components/admin/PermissionMatrix';

interface Role {
  id: string;
  name: string;
  display_name: string;
  description: string;
  user_count: number;
  is_system: boolean;
  created_at: string;
}

const RolesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'matrix'>('overview');

  // Mock data - will be replaced with API calls
  const roles: Role[] = [
    { id: '1', name: 'user', display_name: 'User', description: 'Basic user permissions', user_count: 85, is_system: true, created_at: '2024-01-01' },
    { id: '2', name: 'admin', display_name: 'Administrator', description: 'Full administrative access', user_count: 12, is_system: true, created_at: '2024-01-01' },
    { id: '3', name: 'super_admin', display_name: 'Super Administrator', description: 'Complete system access', user_count: 3, is_system: true, created_at: '2024-01-01' },
    { id: '4', name: 'enterprise', display_name: 'Enterprise User', description: 'Enhanced permissions for enterprise features', user_count: 27, is_system: true, created_at: '2024-01-01' },
  ];

  const totalPermissions = 17; // From PermissionMatrix mock data

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Roles & Permissions</h1>
          <p className="text-muted-foreground">Manage user roles and granular permissions across the system.</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Role
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Role Overview
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'matrix'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Permission Matrix
          </button>
        </nav>
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{roles.length}</div>
                <p className="text-xs text-muted-foreground">Active role definitions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Users with Roles</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{roles.reduce((sum, role) => sum + role.user_count, 0)}</div>
                <p className="text-xs text-muted-foreground">Assigned users</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Permissions</CardTitle>
                <Key className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalPermissions}</div>
                <p className="text-xs text-muted-foreground">Total permissions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Custom Roles</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{roles.filter(r => !r.is_system).length}</div>
                <p className="text-xs text-muted-foreground">User-defined roles</p>
              </CardContent>
            </Card>
          </div>

          {/* Roles Table */}
          <Card>
            <CardHeader>
              <CardTitle>Role Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold">Role Name</th>
                      <th className="text-left p-3 font-semibold">Description</th>
                      <th className="text-center p-3 font-semibold">Users</th>
                      <th className="text-center p-3 font-semibold">Type</th>
                      <th className="text-center p-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roles.map(role => (
                      <tr key={role.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div className="font-medium">{role.display_name}</div>
                          <div className="text-sm text-gray-500">{role.name}</div>
                        </td>
                        <td className="p-3">{role.description}</td>
                        <td className="p-3 text-center">{role.user_count}</td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            role.is_system
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {role.is_system ? 'System' : 'Custom'}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex justify-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-800">
                              <Edit className="w-4 h-4" />
                            </button>
                            {!role.is_system && (
                              <button className="text-red-600 hover:text-red-800">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === 'matrix' && (
        <PermissionMatrix />
      )}
    </div>
  );
};

export default RolesPage;
