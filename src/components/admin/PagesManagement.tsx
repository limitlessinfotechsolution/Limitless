'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Search,
  FileText,
  GripVertical
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Page {
  id: string;
  page_name: string;
  content: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  display_order: number;
}

const SortablePageRow: React.FC<{
  page: Page;
  onTogglePublish: (id: string, status: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ page, onTogglePublish, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: page.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr ref={setNodeRef} style={style} className="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-3">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <FileText className="w-5 h-5 text-gray-400" />
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {page.page_name}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              ID: {page.id}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          page.is_published
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
        }`}>
          {page.is_published ? 'Published' : 'Draft'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {new Date(page.updated_at).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={() => onTogglePublish(page.id, page.is_published)}
            className={`p-1 rounded ${
              page.is_published
                ? 'text-green-600 hover:text-green-800'
                : 'text-yellow-600 hover:text-yellow-800'
            }`}
            title={page.is_published ? 'Unpublish' : 'Publish'}
          >
            {page.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onEdit(page.id)}
            className="p-1 text-blue-600 hover:text-blue-800"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(page.id)}
            className="p-1 text-red-600 hover:text-red-800"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

const PagesManagement: React.FC = () => {
  const router = useRouter();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');


  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/pages');
      if (response.ok) {
        const data = await response.json();
        setPages(data.pages || []);
      }
    } catch (error) {
      console.error('Failed to fetch pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPages = pages.filter(page => {
    const matchesSearch = page.page_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' ||
      (filterStatus === 'published' && page.is_published) ||
      (filterStatus === 'draft' && !page.is_published);
    return matchesSearch && matchesFilter;
  });

  const handleTogglePublish = async (pageId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/pages/${pageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_published: !currentStatus }),
      });

      if (response.ok) {
        setPages(pages.map(page =>
          page.id === pageId ? { ...page, is_published: !currentStatus } : page
        ));
      }
    } catch (error) {
      console.error('Failed to toggle publish status:', error);
    }
  };

  const handleDelete = async (pageId: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;

    try {
      const response = await fetch(`/api/pages/${pageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPages(pages.filter(page => page.id !== pageId));
      }
    } catch (error) {
      console.error('Failed to delete page:', error);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = filteredPages.findIndex((page) => page.id === active.id);
      const newIndex = filteredPages.findIndex((page) => page.id === over.id);

      const reorderedPages = arrayMove(filteredPages, oldIndex, newIndex);

      // Update display_order for all affected pages
      const updatedPages = reorderedPages.map((page, index) => ({
        ...page,
        display_order: index
      }));

      // Update local state immediately for better UX
      setPages(prevPages =>
        prevPages.map(prevPage => {
          const updatedPage = updatedPages.find(p => p.id === prevPage.id);
          return updatedPage || prevPage;
        })
      );

      // Send update to server
      try {
        const pageOrders = updatedPages.map((page, index) => ({
          id: page.id,
          display_order: index
        }));

        await fetch('/api/pages/order', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pageOrders }),
        });
      } catch (error) {
        console.error('Failed to update page order:', error);
        // Revert on error
        fetchPages();
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pages Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your website pages and content. Drag and drop to reorder.</p>
        </div>

      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search pages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as 'all' | 'published' | 'draft')}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="all">All Pages</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Pages List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={filteredPages.map(page => page.id)} strategy={verticalListSortingStrategy}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Page
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {filteredPages.map((page) => (
                    <SortablePageRow
                      key={page.id}
                      page={page}
                      onTogglePublish={handleTogglePublish}
                      onEdit={(id) => router.push(`/admin/pages/${id}/edit`)}
                      onDelete={handleDelete}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </SortableContext>
        </DndContext>

        {filteredPages.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No pages found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by creating your first page.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PagesManagement;
