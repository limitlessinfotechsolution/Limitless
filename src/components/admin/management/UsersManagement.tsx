'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '../../ui/Card';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { Search, Download, CheckSquare, Square, Trash2, Edit, User, Mail, Filter, Users as UsersIcon } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';

interface User {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'user' | 'admin' | 'super_admin'>('all');

  const [showFilters, setShowFilters] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'user' | 'admin' | 'super_admin'>('user');
  const [bulkRoleUserId, setBulkRoleUserId] = useState<string | null>(null);
  const router = useRouter();

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('users-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, (_payload) => {
        fetchUsers(); // Refresh on change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');

      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role, created_at, updated_at')
        .eq('role', 'user') // Fetch users, admins handled separately if needed
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleSelectAll = () => {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsers.map(u => u.id)));
    }
  };

  const handleSelectUser = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedUsers.size} selected users?`)) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || session.user.role !== 'super_admin') {
        setError('Insufficient permissions');
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .delete()
        .in('id', Array.from(selectedUsers));

      if (error) throw error;

      setUsers(users.filter(u => !selectedUsers.has(u.id)));
      setSelectedUsers(new Set());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete users');
    }
  };



  const handleBulkAssignRole = async () => {
    if (!bulkRoleUserId) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || session.user.role !== 'super_admin') {
        setError('Insufficient permissions');
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ role: selectedRole })
        .in('id', Array.from(selectedUsers));

      if (error) throw error;

      setUsers(users.map(u =>
        selectedUsers.has(u.id) ? { ...u, role: selectedRole } : u
      ));
      setSelectedUsers(new Set());
      setShowRoleModal(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to assign role');
    }
  };

  const handleEdit = (userId: string) => {
    router.push(`/admin/users/${userId}/edit`);
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || session.user.role !== 'super_admin') {
        setError('Insufficient permissions');
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      setUsers(users.filter(u => u.id !== userId));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Name', 'Email', 'Role', 'Created'],
      ...filteredUsers.map(u => [
        u.full_name || '',
        u.email || '',
        u.role,
        new Date(u.created_at).toLocaleDateString(),
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users-export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Users Management</h1>
        <button
          onClick={() => router.push('/admin/users/new')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New User
        </button>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>

          {showFilters && (
            <div className="flex flex-col md:flex-row gap-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value as 'all' | 'user' | 'admin' | 'super_admin')}
                  className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
                >
                  <option value="all">All Roles</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedUsers.size > 0 && (
        <Card className="p-4 bg-blue-50 dark:bg-blue-900/20">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800 dark:text-blue-200">
              {selectedUsers.size} user{selectedUsers.size > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setBulkRoleUserId('bulk');
                  setShowRoleModal(true);
                }}
                className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600"
              >
                Assign Role
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Users List */}
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <button
            onClick={handleSelectAll}
            className="text-gray-600 dark:text-gray-300"
            aria-label="Select all users"
          >
            {selectedUsers.size === filteredUsers.length && filteredUsers.length > 0 ? (
              <CheckSquare className="w-5 h-5" />
            ) : (
              <Square className="w-5 h-5" />
            )}
          </button>
          <span className="flex-1 font-medium">Name & Email</span>
          <span className="w-24 text-center">Role</span>
          <span className="w-32 text-center">Created</span>
          <span className="w-24">Actions</span>
        </div>

        {/* Users */}
        {filteredUsers.map((user) => (
          <Card key={user.id} className="p-4">
            <div className="flex items-start gap-4">
              <button
                onClick={() => handleSelectUser(user.id)}
                className="text-gray-600 dark:text-gray-300 mt-1"
                aria-label={`Select user ${user.full_name || 'Unknown'}`}
              >
                {selectedUsers.has(user.id) ? (
                  <CheckSquare className="w-5 h-5" />
                ) : (
                  <Square className="w-5 h-5" />
                )}
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <h3 className="font-semibold">{user.full_name || 'Unknown'}</h3>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{user.email}</span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span>Created: {new Date(user.created_at).toLocaleDateString()}</span>
                  <span>Updated: {new Date(user.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="w-24 text-center">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  user.role === 'super_admin' ? 'bg-purple-100 text-purple-800' :
                  user.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {user.role.replace('_', ' ')}
                </span>
              </div>

              <div className="w-32 text-center text-sm">
                {new Date(user.created_at).toLocaleDateString()}
              </div>
              <div className="w-24 flex gap-2">
                <button
                  onClick={() => handleEdit(user.id)}
                  className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                  aria-label="Edit user"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="p-1 text-red-600 hover:bg-red-100 rounded"
                  aria-label="Delete user"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}

        {filteredUsers.length === 0 && (
          <Card className="p-8 text-center">
            <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No users found matching your criteria.</p>
          </Card>
        )}
      </div>

      {/* Role Assignment Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Assign Role</h3>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as 'user' | 'admin' | 'super_admin')}
              className="w-full px-3 py-2 border rounded-lg mb-4"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRoleModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkAssignRole}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Assign
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
