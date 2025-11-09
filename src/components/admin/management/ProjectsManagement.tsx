'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Download, CheckSquare, Square, Eye, Edit, Plus, CheckCircle, XCircle } from 'lucide-react';
import Card from '../ui/Card';
import { ExportModal } from './ExportModal';
import { downloadExport } from '@/lib/exportUtils';

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  owner_id: string | null;
  assigned_to: string | null;
  due_date: string | null;
  client_name: string | null;
  created_at: string;
  updated_at: string;
}

const ProjectsManagement: React.FC = () => {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'in_progress' | 'completed' | 'rejected'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'urgent'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      // Fallback to mock data if API fails
      const mockProjects: Project[] = [
        {
          id: '1',
          title: 'E-commerce Website Redesign',
          description: 'Complete redesign of the company e-commerce platform',
          status: 'in_progress',
          priority: 'high',
          owner_id: null,
          assigned_to: null,
          due_date: '2024-12-31',
          client_name: 'TechCorp Inc.',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z',
        },
        {
          id: '2',
          title: 'Mobile App Development',
          description: 'Native iOS and Android app for inventory management',
          status: 'pending',
          priority: 'medium',
          owner_id: null,
          assigned_to: null,
          due_date: '2024-11-30',
          client_name: 'LogisticsPro',
          created_at: '2024-01-10T10:00:00Z',
          updated_at: '2024-01-10T10:00:00Z',
        },
        {
          id: '3',
          title: 'AI Chatbot Implementation',
          description: 'Integrate AI-powered chatbot for customer support',
          status: 'completed',
          priority: 'high',
          owner_id: null,
          assigned_to: null,
          due_date: '2024-10-15',
          client_name: 'SupportPlus',
          created_at: '2024-01-01T10:00:00Z',
          updated_at: '2024-01-01T10:00:00Z',
        },
      ];
      setProjects(mockProjects);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (project.client_name && project.client_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleSelectAll = () => {
    if (selectedProjects.size === filteredProjects.length) {
      setSelectedProjects(new Set());
    } else {
      setSelectedProjects(new Set(filteredProjects.map(p => p.id)));
    }
  };

  const handleSelectProject = (projectId: string) => {
    const newSelected = new Set(selectedProjects);
    if (newSelected.has(projectId)) {
      newSelected.delete(projectId);
    } else {
      newSelected.add(projectId);
    }
    setSelectedProjects(newSelected);
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedProjects.size} selected projects?`)) return;

    try {
      const response = await fetch('/api/projects/bulk', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedProjects) }),
      });
      if (!response.ok) throw new Error('Failed to delete projects');

      setProjects(projects.filter(p => !selectedProjects.has(p.id)));
      setSelectedProjects(new Set());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete projects');
    }
  };

  const handleBulkStatusUpdate = async (status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'rejected') => {
    try {
      const response = await fetch('/api/projects/bulk', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: Array.from(selectedProjects),
          action: 'status',
          value: status
        }),
      });
      if (!response.ok) throw new Error('Failed to update projects');

      setProjects(projects.map(p =>
        selectedProjects.has(p.id) ? { ...p, status } : p
      ));
      setSelectedProjects(new Set());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update projects');
    }
  };

  const handleStatusChange = async (projectId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error('Failed to update project status');

      setProjects(projects.map(project =>
        project.id === projectId
          ? { ...project, status: newStatus, updated_at: new Date().toISOString() }
          : project
      ));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update project status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'urgent': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-red-500">{error}</div>
      </Card>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Projects Management</h1>
        <button
          onClick={() => router.push('/admin/projects/new')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Project
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
                placeholder="Search projects..."
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
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>

          {showFilters && (
            <div className="flex flex-col md:flex-row gap-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value as any)}
                  className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
                >
                  <option value="all">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedProjects.size > 0 && (
        <Card className="p-4 bg-blue-50 dark:bg-blue-900/20">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800 dark:text-blue-200">
              {selectedProjects.size} project{selectedProjects.size > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkStatusUpdate('approved')}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
              >
                Approve
              </button>
              <button
                onClick={() => handleBulkStatusUpdate('in_progress')}
                className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
              >
                Start
              </button>
              <button
                onClick={() => handleBulkStatusUpdate('completed')}
                className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600"
              >
                Complete
              </button>
              <button
                onClick={() => handleBulkStatusUpdate('rejected')}
                className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
              >
                Reject
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

      {/* Projects List */}
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <button
            onClick={handleSelectAll}
            className="text-gray-600 dark:text-gray-300"
            aria-label="Select all projects"
          >
            {selectedProjects.size === filteredProjects.length && filteredProjects.length > 0 ? (
              <CheckSquare className="w-5 h-5" />
            ) : (
              <Square className="w-5 h-5" />
            )}
          </button>
          <span className="flex-1 font-medium">Project</span>
          <span className="w-24 text-center">Status</span>
          <span className="w-20 text-center">Priority</span>
          <span className="w-32 text-center">Due Date</span>
          <span className="w-24">Actions</span>
        </div>

        {/* Projects */}
        {filteredProjects.map((project) => (
          <Card key={project.id} className="p-4">
            <div className="flex items-start gap-4">
              <button
                onClick={() => handleSelectProject(project.id)}
                className="text-gray-600 dark:text-gray-300 mt-1"
                aria-label={`Select project ${project.title}`}
              >
                {selectedProjects.has(project.id) ? (
                  <CheckSquare className="w-5 h-5" />
                ) : (
                  <Square className="w-5 h-5" />
                )}
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">{project.title}</h3>
                  {project.client_name && (
                    <span className="text-gray-500">for</span>
                  )}
                  <span className="font-medium text-blue-600">{project.client_name || ''}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2">
                  {project.description}
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="w-24 text-center">
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
                  {project.status.replace('_', ' ')}
                </span>
              </div>
              <div className="w-20 text-center">
                <span className={`text-xs font-medium ${getPriorityColor(project.priority)}`}>
                  {project.priority}
                </span>
              </div>
              <div className="w-32 text-center text-sm">
                {project.due_date ? new Date(project.due_date).toLocaleDateString() : 'No due date'}
              </div>
              <div className="w-24 flex gap-2">
                <button
                  onClick={() => router.push(`/admin/projects/${project.id}`)}
                  className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                  aria-label="View project"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => router.push(`/admin/projects/${project.id}/edit`)}
                  className="p-1 text-green-600 hover:bg-green-100 rounded"
                  aria-label="Edit project"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Action buttons for status changes */}
            <div className="mt-4 flex items-center space-x-2">
              {project.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleStatusChange(project.id, 'approved')}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleStatusChange(project.id, 'rejected')}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                </>
              )}
              {project.status === 'approved' && (
                <button
                  onClick={() => handleStatusChange(project.id, 'in_progress')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                >
                  Start Project
                </button>
              )}
              {project.status === 'in_progress' && (
                <button
                  onClick={() => handleStatusChange(project.id, 'completed')}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm"
                >
                  Mark Complete
                </button>
              )}
            </div>
          </Card>
        ))}

        {filteredProjects.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No projects found matching your criteria.</p>
          </Card>
        )}
      </div>

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        data={filteredProjects}
        filename="projects-export"
        onExport={(format) => {
          downloadExport(filteredProjects, format, `projects-export-${new Date().toISOString().split('T')[0]}`);
        }}
      />
    </div>
  );
};

export default ProjectsManagement;