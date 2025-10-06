'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@supabase/supabase-js';
import EnterpriseLayoutEnhanced from '@/components/enterprise/EnterpriseLayoutEnhanced';
import EnterpriseDataGrid from '@/components/enterprise/EnterpriseDataGrid';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import Card, { CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Plus, Search, Edit, Trash2, Calendar, Users, DollarSign, Eye } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  start_date: string;
  end_date: string;
  budget: number;
  client_id: string;
  manager_id: string;
  progress: number;
  created_at: string;
  updated_at: string;
  client?: { name: string };
  manager?: { name: string };
}

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planning',
    priority: 'medium',
    start_date: '',
    end_date: '',
    budget: 0,
    client_id: '',
    manager_id: '',
    progress: 0
  });

  const queryClient = useQueryClient();

  // Fetch projects with related data
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          client:clients(name),
          manager:team_members(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Project[];
    }
  });

  // Fetch clients for dropdown
  const { data: clients } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name')
        .eq('status', 'active');

      if (error) throw error;
      return data;
    }
  });

  // Fetch team members for dropdown
  const { data: teamMembers } = useQuery({
    queryKey: ['team_members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('id, name')
        .eq('status', 'active');

      if (error) throw error;
      return data;
    }
  });

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: async (projectData: typeof formData) => {
      const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsCreateDialogOpen(false);
      resetForm();
      alert('Project created successfully');
    },
    onError: (error) => {
      alert('Failed to create project: ' + error.message);
    }
  });

  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, ...projectData }: typeof formData & { id: string }) => {
      const { data, error } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setEditingProject(null);
      resetForm();
      alert('Project updated successfully');
    },
    onError: (error) => {
      alert('Failed to update project: ' + error.message);
    }
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      alert('Project deleted successfully');
    },
    onError: (error) => {
      alert('Failed to delete project: ' + error.message);
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      status: 'planning',
      priority: 'medium',
      start_date: '',
      end_date: '',
      budget: 0,
      client_id: '',
      manager_id: '',
      progress: 0
    });
  };

  const handleCreate = () => {
    createProjectMutation.mutate(formData);
  };

  const handleUpdate = () => {
    if (editingProject) {
      updateProjectMutation.mutate({ ...formData, id: editingProject.id });
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      status: project.status,
      priority: project.priority,
      start_date: project.start_date,
      end_date: project.end_date,
      budget: project.budget,
      client_id: project.client_id,
      manager_id: project.manager_id,
      progress: project.progress
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      deleteProjectMutation.mutate(id);
    }
  };

  // Filter projects based on search and filters
  const filteredProjects = projects?.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  }) || [];

  // Calculate summary stats
  const stats = {
    total: projects?.length || 0,
    active: projects?.filter(p => p.status === 'active').length || 0,
    completed: projects?.filter(p => p.status === 'completed').length || 0,
    totalBudget: projects?.reduce((sum, p) => sum + (p.budget || 0), 0) || 0
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    { key: 'name', header: 'Project Name', sortable: true },
    { key: 'client', header: 'Client', render: (project: Project) => project.client?.name || 'N/A' },
    { key: 'manager', header: 'Manager', render: (project: Project) => project.manager?.name || 'N/A' },
    { key: 'status', header: 'Status', render: (project: Project) => (
      <Badge className={getStatusColor(project.status)}>
        {project.status.replace('_', ' ').toUpperCase()}
      </Badge>
    )},
    { key: 'priority', header: 'Priority', render: (project: Project) => (
      <Badge className={getPriorityColor(project.priority)}>
        {project.priority.toUpperCase()}
      </Badge>
    )},
    { key: 'progress', header: 'Progress', render: (project: Project) => (
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full"
          style={{ width: `${project.progress}%` }}
        ></div>
      </div>
    )},
    { key: 'budget', header: 'Budget', render: (project: Project) =>
      `$${project.budget?.toLocaleString() || 0}`
    },
    { key: 'actions', header: 'Actions', render: (project: Project) => (
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => handleEdit(project)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleDelete(project.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    )}
  ];

  return (
    <EnterpriseLayoutEnhanced>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Projects Management</h1>
            <p className="text-gray-600">Manage and track all your projects</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              <ProjectForm
                formData={formData}
                setFormData={setFormData}
                clients={clients}
                teamMembers={teamMembers}
                onSubmit={handleCreate}
                isLoading={createProjectMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalBudget.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="on_hold">On Hold</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Projects Table */}
        <Card>
          <CardHeader>
            <CardTitle>Projects ({filteredProjects.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading projects...</div>
            ) : (
              <EnterpriseDataGrid
                data={filteredProjects}
                columns={columns}
                searchable={false}
                pagination
                pageSize={10}
              />
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        {editingProject && (
          <Dialog open={!!editingProject} onOpenChange={() => setEditingProject(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Project</DialogTitle>
              </DialogHeader>
              <ProjectForm
                formData={formData}
                setFormData={setFormData}
                clients={clients}
                teamMembers={teamMembers}
                onSubmit={handleUpdate}
                isLoading={updateProjectMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </EnterpriseLayoutEnhanced>
  );
}

interface ProjectFormProps {
  formData: any;
  setFormData: (data: any) => void;
  clients?: any[];
  teamMembers?: any[];
  onSubmit: () => void;
  isLoading: boolean;
}

function ProjectForm({ formData, setFormData, clients, teamMembers, onSubmit, isLoading }: ProjectFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Project Name</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter project name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="on_hold">On Hold</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          className="w-full p-2 border rounded-md"
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter project description"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Priority</label>
          <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Budget</label>
          <Input
            type="number"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })}
            placeholder="0"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <Input
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <Input
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Client</label>
          <Select value={formData.client_id} onValueChange={(value) => setFormData({ ...formData, client_id: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              {clients?.map(client => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Project Manager</label>
          <Select value={formData.manager_id} onValueChange={(value) => setFormData({ ...formData, manager_id: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select manager" />
            </SelectTrigger>
            <SelectContent>
              {teamMembers?.map(member => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Progress (%)</label>
        <Input
          type="number"
          min="0"
          max="100"
          value={formData.progress}
          onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
          placeholder="0"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => {}}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Project'}
        </Button>
      </div>
    </div>
  );
}
