'use client';

import React, { useState, useEffect } from 'react';
import { Plus, X, Tag, Folder } from 'lucide-react';
import { Card } from '../ui/Card';

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

const TestimonialCategoriesTags: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [newTag, setNewTag] = useState({ name: '', color: '#3b82f6' });
  
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddTag, setShowAddTag] = useState(false);

  useEffect(() => {
    fetchCategoriesAndTags();
  }, []);

  const fetchCategoriesAndTags = async () => {
    try {
      setLoading(true);
      
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
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/testimonials/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory),
      });
      
      if (!response.ok) throw new Error('Failed to add category');
      
      const category = await response.json();
      setCategories([...categories, category]);
      setNewCategory({ name: '', description: '' });
      setShowAddCategory(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to add category');
    }
  };

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/testimonials/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTag),
      });
      
      if (!response.ok) throw new Error('Failed to add tag');
      
      const tag = await response.json();
      setTags([...tags, tag]);
      setNewTag({ name: '', color: '#3b82f6' });
      setShowAddTag(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to add tag');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      const response = await fetch(`/api/testimonials/categories/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete category');
      
      setCategories(categories.filter(category => category.id !== id));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
    }
  };

  const handleDeleteTag = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tag?')) return;
    
    try {
      const response = await fetch(`/api/testimonials/tags/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete tag');
      
      setTags(tags.filter(tag => tag.id !== id));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete tag');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-red-500">Error: {error}</div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Categories Section */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center">
            <Folder className="w-5 h-5 mr-2" />
            Categories
          </h2>
          <button
            onClick={() => setShowAddCategory(true)}
            className="flex items-center px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Category
          </button>
        </div>
        
        {showAddCategory && (
          <form onSubmit={handleAddCategory} className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  className="w-full p-2 border rounded dark:bg-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <input
                  type="text"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                  className="w-full p-2 border rounded dark:bg-gray-800"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Category
              </button>
              <button
                type="button"
                onClick={() => setShowAddCategory(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(category => (
            <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <h3 className="font-medium">{category.name}</h3>
                {category.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">{category.description}</p>
                )}
              </div>
              <button
                onClick={() => handleDeleteCategory(category.id)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Tags Section */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center">
            <Tag className="w-5 h-5 mr-2" />
            Tags
          </h2>
          <button
            onClick={() => setShowAddTag(true)}
            className="flex items-center px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Tag
          </button>
        </div>
        
        {showAddTag && (
          <form onSubmit={handleAddTag} className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  type="text"
                  value={newTag.name}
                  onChange={(e) => setNewTag({...newTag, name: e.target.value})}
                  className="w-full p-2 border rounded dark:bg-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={newTag.color}
                    onChange={(e) => setNewTag({...newTag, color: e.target.value})}
                    className="w-10 h-10 border rounded cursor-pointer"
                  />
                  <span className="text-sm">{newTag.color}</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                Add Tag
              </button>
              <button
                type="button"
                onClick={() => setShowAddTag(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <div 
              key={tag.id} 
              className="flex items-center justify-between px-3 py-1 rounded-full text-white"
              style={{ backgroundColor: tag.color }}
            >
              <span>{tag.name}</span>
              <button
                onClick={() => handleDeleteTag(tag.id)}
                className="ml-2 hover:text-gray-200"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default TestimonialCategoriesTags;