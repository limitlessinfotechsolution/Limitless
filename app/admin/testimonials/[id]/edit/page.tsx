'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Card from '../../../../../src/components/ui/Card';
import LoadingSpinner from '../../../../../src/components/ui/LoadingSpinner';

interface Testimonial {
  id: string;
  client_name: string;
  company: string;
  content: string;
  rating: number;
  is_published: boolean;
  is_featured: boolean;
  approved: boolean;
  verified: boolean;
  categories?: { id: string; name: string }[];
  tags?: { id: string; name: string; color: string }[];
}

interface Category {
  id: string;
  name: string;
  description: string;
}

interface Tag {
  id: string;
  name: string;
  color: string;
}

const EditTestimonialPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };
  
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchTestimonial();
      fetchCategoriesAndTags();
    }
  }, [id]);

  const fetchTestimonial = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/testimonials/${id}`);
      if (!response.ok) throw new Error('Failed to fetch testimonial');
      
      const data: Testimonial = await response.json();
      setTestimonial(data);
      
      // Set initial selected categories and tags
      if (data.categories) {
        setSelectedCategories(data.categories.map(cat => cat.id));
      }
      if (data.tags) {
        setSelectedTags(data.tags.map(tag => tag.id));
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch testimonial');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoriesAndTags = async () => {
    try {
      // Fetch categories
      const categoriesResponse = await fetch('/api/testimonials/categories');
      if (!categoriesResponse.ok) throw new Error('Failed to fetch categories');
      const categoriesData = await categoriesResponse.json();
      setCategories(categoriesData);
      
      // Fetch tags
      const tagsResponse = await fetch('/api/testimonials/tags');
      if (!tagsResponse.ok) throw new Error('Failed to fetch tags');
      const tagsData = await tagsResponse.json();
      setTags(tagsData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories and tags');
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Update testimonial basic info
      const updateResponse = await fetch(`/api/testimonials/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: testimonial?.client_name,
          company: testimonial?.company,
          content: testimonial?.content,
          rating: testimonial?.rating,
          is_published: testimonial?.is_published,
          is_featured: testimonial?.is_featured,
          approved: testimonial?.approved,
        }),
      });
      
      if (!updateResponse.ok) throw new Error('Failed to update testimonial');
      
      // Update categories
      const categoryResponse = await fetch(`/api/testimonials/${id}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryIds: selectedCategories }),
      });
      
      if (!categoryResponse.ok) throw new Error('Failed to update categories');
      
      // Update tags
      const tagResponse = await fetch(`/api/testimonials/${id}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tagIds: selectedTags }),
      });
      
      if (!tagResponse.ok) throw new Error('Failed to update tags');
      
      router.push('/admin/testimonials');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save testimonial');
    } finally {
      setSaving(false);
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId) 
        : [...prev, categoryId]
    );
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId) 
        : [...prev, tagId]
    );
  };

  if (loading) return <LoadingSpinner />;
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <div className="text-red-500">Error: {error}</div>
        </Card>
      </div>
    );
  }

  if (!testimonial) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <div className="text-center">Testimonial not found</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Edit Testimonial</h1>
        <button
          onClick={() => router.push('/admin/testimonials')}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Back to List
        </button>
      </div>
      
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Client Name</label>
            <input
              type="text"
              value={testimonial.client_name}
              onChange={(e) => setTestimonial({...testimonial, client_name: e.target.value})}
              className="w-full p-2 border rounded dark:bg-gray-800"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Company</label>
            <input
              type="text"
              value={testimonial.company}
              onChange={(e) => setTestimonial({...testimonial, company: e.target.value})}
              className="w-full p-2 border rounded dark:bg-gray-800"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Rating</label>
            <select
              value={testimonial.rating}
              onChange={(e) => setTestimonial({...testimonial, rating: parseInt(e.target.value)})}
              className="w-full p-2 border rounded dark:bg-gray-800"
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={testimonial.is_published}
                onChange={(e) => setTestimonial({...testimonial, is_published: e.target.checked})}
                className="mr-2"
              />
              Published
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={testimonial.is_featured}
                onChange={(e) => setTestimonial({...testimonial, is_featured: e.target.checked})}
                className="mr-2"
              />
              Featured
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={testimonial.approved}
                onChange={(e) => setTestimonial({...testimonial, approved: e.target.checked})}
                className="mr-2"
              />
              Approved
            </label>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Content</label>
          <textarea
            value={testimonial.content}
            onChange={(e) => setTestimonial({...testimonial, content: e.target.value})}
            rows={4}
            className="w-full p-2 border rounded dark:bg-gray-800"
          />
        </div>
        
        {/* Categories */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Categories</label>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <label key={category.id} className="flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleCategoryToggle(category.id)}
                  className="mr-2"
                />
                {category.name}
              </label>
            ))}
          </div>
        </div>
        
        {/* Tags */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Tags</label>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <label 
                key={tag.id} 
                className="flex items-center px-3 py-1 rounded-full cursor-pointer text-white"
                style={{ backgroundColor: tag.color }}
              >
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag.id)}
                  onChange={() => handleTagToggle(tag.id)}
                  className="mr-2"
                />
                {tag.name}
              </label>
            ))}
          </div>
        </div>
        
        {error && (
          <div className="text-red-500 mb-4">{error}</div>
        )}
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => router.push('/admin/testimonials')}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default EditTestimonialPage;