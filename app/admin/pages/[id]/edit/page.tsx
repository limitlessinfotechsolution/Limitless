'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Card from '../../../../../src/components/ui/Card';
import LoadingSpinner from '../../../../../src/components/ui/LoadingSpinner';
import { Json } from '../../../../../src/types/supabase';

interface Page {
  id: string;
  page_name: string;
  content: Json;
  is_published: boolean;
  version: number;
}

const EditPage: React.FC = () => {
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const fetchPage = useCallback(async () => {
    try {
      const response = await fetch(`/api/pages/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          router.push('/admin/pages');
          return;
        }
        throw new Error('Failed to fetch page');
      }
      const data = await response.json();
      setPage(data.page);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch page');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  const handleSave = async () => {
    if (!page) return;
    setSaving(true);
    try {
      const response = await fetch(`/api/pages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page_name: page.page_name,
          content: page.content,
          is_published: page.is_published,
        }),
      });
      if (!response.ok) throw new Error('Failed to update page');
      router.push('/admin/pages');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update page');
    } finally {
      setSaving(false);
    }
  };

  const handleContentChange = (value: string) => {
    try {
      const parsed = JSON.parse(value);
      setPage(prev => prev ? { ...prev, content: parsed } : null);
    } catch {
      // Invalid JSON, but allow typing
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!page) return <div>Page not found</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit Page: {page.page_name}</h1>
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Page Name</label>
            <input
              type="text"
              value={page.page_name}
              onChange={(e) => setPage({ ...page, page_name: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Published</label>
            <input
              type="checkbox"
              checked={page.is_published}
              onChange={(e) => setPage({ ...page, is_published: e.target.checked })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Content (JSON)</label>
            <textarea
              value={JSON.stringify(page.content, null, 2)}
              onChange={(e) => handleContentChange(e.target.value)}
              className="w-full p-2 border rounded h-64"
            />
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => router.push('/admin/pages')}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EditPage;
