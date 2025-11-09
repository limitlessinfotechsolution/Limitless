'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  CheckSquare, 
  Square, 
  Eye, 
  Edit,
  Star,
  Calendar,
  Tag
} from 'lucide-react';
import Card from '@/components/ui/Card';
import { ExportModal } from '@/components/admin/utils/ExportModal';
import { downloadExport } from '@/lib/utils/exportUtils';

interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  client: string;
  date: string;
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  image?: string;
  technologies: string[];
  created_at: string;
  updated_at: string;
}

const PortfolioManagement: React.FC = () => {
  const router = useRouter();
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/portfolio');
      if (!response.ok) throw new Error('Failed to fetch portfolio projects');
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch portfolio projects');
      // Fallback to mock data if API fails
      const mockProjects: PortfolioProject[] = [
        {
          id: '1',
          title: 'E-commerce Platform Redesign',
          description: 'Complete redesign of a major e-commerce platform with focus on UX and performance.',
          category: 'Web Design',
          tags: ['E-commerce', 'UI/UX', 'React'],
          client: 'TechCorp Inc.',
          date: '2024-06-15',
          featured: true,
          status: 'published',
          technologies: ['React', 'Node.js', 'MongoDB'],
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z',
        },
        {
          id: '2',
          title: 'Mobile Banking App',
          description: 'Secure mobile banking application with biometric authentication.',
          category: 'Mobile App',
          tags: ['Finance', 'Mobile', 'Security'],
          client: 'Global Bank',
          date: '2024-05-20',
          featured: false,
          status: 'published',
          technologies: ['React Native', 'Firebase', 'Express'],
          created_at: '2024-01-10T10:00:00Z',
          updated_at: '2024-01-10T10:00:00Z',
        },
        {
          id: '3',
          title: 'Corporate Branding',
          description: 'Complete corporate branding package for a startup.',
          category: 'Branding',
          tags: ['Branding', 'Logo', 'Identity'],
          client: 'StartupXYZ',
          date: '2024-04-10',
          featured: false,
          status: 'draft',
          technologies: ['Illustrator', 'Photoshop'],
          created_at: '2024-01-05T10:00:00Z',
          updated_at: '2024-01-05T10:00:00Z',
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
                         project.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const uniqueCategories = Array.from(new Set(projects.map(p => p.category)));

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
      const response = await fetch('/api/portfolio/bulk', {
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

  const handleBulkStatusUpdate = async (status: 'draft' | 'published' | 'archived') => {
    try {
      const response = await fetch('/api/portfolio/bulk', {
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

  const handleBulkFeature = async (featured: boolean) => {
    try {
      const response = await fetch('/api/portfolio/bulk', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: Array.from(selectedProjects),
          action: 'feature',
          value: featured
        }),
      });
      if (!response.ok) throw new Error('Failed to update projects');

      setProjects(projects.map(p =>
        selectedProjects.has(p.id) ? { ...p, featured } : p
      ));
      setSelectedProjects(new Set());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update projects');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'published': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
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
        <h1 className="text-3xl font-bold">Portfolio Management</h1>
        <button
          onClick={() => router.push('/admin/portfolio/new')}
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
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
                >
                  <option value="all">All Categories</option>
                  {uniqueCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
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
                onClick={() => handleBulkStatusUpdate('published')}
                className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
              >
                Publish
              </button>
              <button
                onClick={() => handleBulkStatusUpdate('draft')}
                className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
              >
                Draft
              </button>
              <button
                onClick={() => handleBulkStatusUpdate('archived')}
                className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
              >
                Archive
              </button>
              <button
                onClick={() => handleBulkFeature(true)}
                className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600"
              >
                Feature
              </button>
              <button
                onClick={() => handleBulkFeature(false)}
                className="px-3 py-1 bg-gray-400 text-white text-sm rounded hover:bg-gray-500"
              >
                Unfeature
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
          <span className="w-24 text-center">Category</span>
          <span className="w-20 text-center">Status</span>
          <span className="w-20 text-center">Featured</span>
          <span className="w-32 text-center">Date</span>
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
                  {project.client && (
                    <span className="text-gray-500">for</span>
                  )}
                  <span className="font-medium text-blue-600">{project.client}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Tag className="w-3 h-3" />
                    <span>{project.category}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(project.date).toLocaleDateString()}</span>
                  </div>
                  {project.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="w-24 text-center">
                <span className="text-sm">{project.category}</span>
              </div>
              <div className="w-20 text-center">
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
              <div className="w-20 text-center">
                {project.featured ? (
                  <Star className="w-5 h-5 text-yellow-500 fill-current mx-auto" />
                ) : (
                  <Star className="w-5 h-5 text-gray-400 mx-auto" />
                )}
              </div>
              <div className="w-32 text-center text-sm">
                {new Date(project.date).toLocaleDateString()}
              </div>
              <div className="w-24 flex gap-2">
                <button
                  onClick={() => router.push(`/admin/portfolio/${project.id}`)}
                  className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                  aria-label="View project"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => router.push(`/admin/portfolio/${project.id}/edit`)}
                  className="p-1 text-green-600 hover:bg-green-100 rounded"
                  aria-label="Edit project"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}

        {filteredProjects.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No portfolio projects found matching your criteria.</p>
          </Card>
        )}
      </div>

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        data={filteredProjects}
        filename="portfolio-projects-export"
        onExport={(format) => {
          downloadExport(filteredProjects, format, `portfolio-projects-export-${new Date().toISOString().split('T')[0]}`);
        }}
      />
    </div>
  );
};

export default PortfolioManagement;