'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Download, CheckSquare, Square, Trash2, Eye, EyeOff, UserCheck, X } from 'lucide-react';
import Card from '@/components/ui/Card';
import { ExportModal } from '@/components/admin/utils/ExportModal';
import { downloadExport, exportToCSV } from '@/lib/utils/exportUtils';
import { ExportFormat } from '@/types';

interface Lead {
  id: string;
  business_basics: {
    companyName?: string;
    contactName?: string;
    email?: string;
    phone?: string;
  };
  project_details: {
    projectType?: string;
    description?: string;
    requirements?: string[];
  };
  timeline_budget: {
    timeline?: string;
    budget?: string;
  };
  source_page?: string;
  created_at: string;
  updated_at: string;
  lead_score?: number;
  status?: 'new' | 'contacted' | 'qualified' | 'lost' | 'converted';
}

const LeadsManagement: React.FC = () => {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'contacted' | 'qualified' | 'lost' | 'converted'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/leads');
      if (!response.ok) throw new Error('Failed to fetch leads');
      const data = await response.json();
      setLeads(data.leads || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      (lead.business_basics.companyName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.business_basics.contactName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.business_basics.email?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleSelectAll = () => {
    if (selectedLeads.size === filteredLeads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(filteredLeads.map(l => l.id)));
    }
  };

  const handleSelectLead = (leadId: string) => {
    const newSelected = new Set(selectedLeads);
    if (newSelected.has(leadId)) {
      newSelected.delete(leadId);
    } else {
      newSelected.add(leadId);
    }
    setSelectedLeads(newSelected);
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedLeads.size} selected leads?`)) return;

    try {
      const response = await fetch('/api/leads/bulk', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedLeads) }),
      });
      if (!response.ok) throw new Error('Failed to delete leads');

      setLeads(leads.filter(l => !selectedLeads.has(l.id)));
      setSelectedLeads(new Set());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete leads');
    }
  };

  const handleBulkStatusUpdate = async (status: 'new' | 'contacted' | 'qualified' | 'lost' | 'converted') => {
    try {
      const response = await fetch('/api/leads/bulk', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: Array.from(selectedLeads),
          action: 'status',
          value: status
        }),
      });
      if (!response.ok) throw new Error('Failed to update leads');

      setLeads(leads.map(l =>
        selectedLeads.has(l.id) ? { ...l, status } : l
      ));
      setSelectedLeads(new Set());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update leads');
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Company', 'Contact Name', 'Email', 'Phone', 'Project Type', 'Timeline', 'Budget', 'Status', 'Created'],
      ...filteredLeads.map(l => [
        l.business_basics.companyName || '',
        l.business_basics.contactName || '',
        l.business_basics.email || '',
        l.business_basics.phone || '',
        l.project_details.projectType || '',
        l.timeline_budget.timeline || '',
        l.timeline_budget.budget || '',
        l.status || 'new',
        new Date(l.created_at).toLocaleDateString(),
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads-export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
        <h1 className="text-3xl font-bold">Leads Management</h1>
        <button
          onClick={() => router.push('/admin/leads/new')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Lead
        </button>
      </div>

      {/* Search and Filters */ }
      <Card className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search leads..."
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
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
                >
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="lost">Lost</option>
                  <option value="converted">Converted</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Bulk Actions */ }
      {selectedLeads.size > 0 && (
        <Card className="p-4 bg-blue-50 dark:bg-blue-900/20">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800 dark:text-blue-200">
              {selectedLeads.size} lead{selectedLeads.size > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkStatusUpdate('contacted')}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
              >
                Mark Contacted
              </button>
              <button
                onClick={() => handleBulkStatusUpdate('qualified')}
                className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
              >
                Mark Qualified
              </button>
              <button
                onClick={() => handleBulkStatusUpdate('lost')}
                className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
              >
                Mark Lost
              </button>
              <button
                onClick={() => handleBulkStatusUpdate('converted')}
                className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600"
              >
                Mark Converted
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

      {/* Leads List */ }
      <div className="space-y-4">
        {/* Header */ }
        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <button
            onClick={handleSelectAll}
            className="text-gray-600 dark:text-gray-300"
            aria-label="Select all leads"
          >
            {selectedLeads.size === filteredLeads.length && filteredLeads.length > 0 ? (
              <CheckSquare className="w-5 h-5" />
            ) : (
              <Square className="w-5 h-5" />
            )}
          </button>
          <span className="flex-1 font-medium">Company & Contact</span>
          <span className="w-32">Project Type</span>
          <span className="w-24 text-center">Status</span>
          <span className="w-32 text-center">Created</span>
          <span className="w-24">Actions</span>
        </div>

        {/* Leads */ }
        {filteredLeads.map((lead) => (
          <Card key={lead.id} className="p-4">
            <div className="flex items-start gap-4">
              <button
                onClick={() => handleSelectLead(lead.id)}
                className="text-gray-600 dark:text-gray-300 mt-1"
                aria-label={`Select lead from ${lead.business_basics.companyName || 'Unknown Company'}`}
              >
                {selectedLeads.has(lead.id) ? (
                  <CheckSquare className="w-5 h-5" />
                ) : (
                  <Square className="w-5 h-5" />
                )}
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">{lead.business_basics.companyName || 'Unknown Company'}</h3>
                  <span className="text-gray-500">-</span>
                  <span className="font-medium text-blue-600">{lead.business_basics.contactName || 'Unknown Contact'}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{lead.business_basics.email || 'No email'}</span>
                  <span>{lead.business_basics.phone || 'No phone'}</span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span>Timeline: {lead.timeline_budget.timeline || 'Not specified'}</span>
                  <span>Budget: {lead.timeline_budget.budget || 'Not specified'}</span>
                </div>
              </div>
              <div className="w-32">
                <span className="text-sm">{lead.project_details.projectType || 'Not specified'}</span>
              </div>
              <div className="w-24 text-center">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  lead.status === 'new' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                  lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  lead.status === 'qualified' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  lead.status === 'lost' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                  lead.status === 'converted' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}>
                  {lead.status || 'new'}
                </span>
              </div>
              <div className="w-32 text-center text-sm">
                {new Date(lead.created_at).toLocaleDateString()}
              </div>
              <div className="w-24 flex gap-2">
                <button
                  onClick={() => router.push(`/admin/leads/${lead.id}`)}
                  className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                  aria-label="View lead"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => router.push(`/admin/leads/${lead.id}/edit`)}
                  className="p-1 text-green-600 hover:bg-green-100 rounded"
                  aria-label="Edit lead"
                >
                  <UserCheck className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this lead?')) {
                      handleBulkDelete();
                    }
                  }}
                  className="p-1 text-red-600 hover:bg-red-100 rounded"
                  aria-label="Delete lead"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}

        {filteredLeads.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No leads found matching your criteria.</p>
          </Card>
        )}
      </div>

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        data={filteredLeads}
        filename="leads-export"
        onExport={(format) => {
          downloadExport(filteredLeads, format, `leads-export-${new Date().toISOString().split('T')[0]}`);
        }}
      />
    </div>
  );
};

export default LeadsManagement;