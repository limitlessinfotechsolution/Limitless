'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, X, FileText, Users, FolderKanban, Calendar, DollarSign, CheckSquare } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface SearchResult {
  id: string;
  type: 'project' | 'task' | 'client' | 'document' | 'invoice' | 'meeting';
  title: string;
  subtitle?: string;
  url: string;
  icon: React.ReactNode;
  category: string;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  placeholder?: string;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({
  isOpen,
  onClose,
  placeholder = "Search projects, tasks, clients, documents..."
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const search = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const searchResults: SearchResult[] = [];

        // Search projects
        const { data: projects } = await supabase
          .from('projects')
          .select('id, name, description, status')
          .ilike('name', `%${query}%`)
          .limit(5);

        if (projects) {
          projects.forEach(project => {
            searchResults.push({
              id: project.id,
              type: 'project',
              title: project.name,
              subtitle: project.description,
              url: `/enterprise/projects/${project.id}`,
              icon: <FolderKanban className="w-4 h-4" />,
              category: 'Projects'
            });
          });
        }

        // Search tasks
        const { data: tasks } = await supabase
          .from('tasks')
          .select('id, title, description, status')
          .ilike('title', `%${query}%`)
          .limit(5);

        if (tasks) {
          tasks.forEach(task => {
            searchResults.push({
              id: task.id,
              type: 'task',
              title: task.title,
              subtitle: task.description,
              url: `/enterprise/tasks/${task.id}`,
              icon: <CheckSquare className="w-4 h-4" />,
              category: 'Tasks'
            });
          });
        }

        // Search clients
        const { data: clients } = await supabase
          .from('clients')
          .select('id, name, email, company')
          .or(`name.ilike.%${query}%,email.ilike.%${query}%,company.ilike.%${query}%`)
          .limit(5);

        if (clients) {
          clients.forEach(client => {
            searchResults.push({
              id: client.id,
              type: 'client',
              title: client.name,
              subtitle: client.company || client.email,
              url: `/enterprise/clients/${client.id}`,
              icon: <Users className="w-4 h-4" />,
              category: 'Clients'
            });
          });
        }

        // Search documents
        const { data: documents } = await supabase
          .from('documents')
          .select('id, title, document_type, project_id')
          .ilike('title', `%${query}%`)
          .limit(5);

        if (documents) {
          documents.forEach(doc => {
            searchResults.push({
              id: doc.id,
              type: 'document',
              title: doc.title,
              subtitle: doc.document_type,
              url: `/enterprise/documents/${doc.id}`,
              icon: <FileText className="w-4 h-4" />,
              category: 'Documents'
            });
          });
        }

        // Search invoices
        const { data: invoices } = await supabase
          .from('invoices')
          .select('id, invoice_number, client_id, total_amount')
          .ilike('invoice_number', `%${query}%`)
          .limit(5);

        if (invoices) {
          invoices.forEach(invoice => {
            searchResults.push({
              id: invoice.id,
              type: 'invoice',
              title: `Invoice ${invoice.invoice_number}`,
              subtitle: `$${invoice.total_amount}`,
              url: `/enterprise/billing/invoices/${invoice.id}`,
              icon: <DollarSign className="w-4 h-4" />,
              category: 'Billing'
            });
          });
        }

        setResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(search, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, supabase]);

  const handleResultClick = (result: SearchResult) => {
    // Add to recent searches
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('enterprise_recent_searches', JSON.stringify(updated));

    // Navigate to result
    window.location.href = result.url;
    onClose();
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
  };

  // Load recent searches on mount
  useEffect(() => {
    const saved = localStorage.getItem('enterprise_recent_searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center pt-16">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
        {/* Search Input */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="w-full pl-10 pr-10 py-3 text-lg border-0 focus:outline-none focus:ring-0 bg-transparent text-gray-900 dark:text-white placeholder-gray-500"
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      {result.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {result.title}
                      </p>
                      {result.subtitle && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {result.subtitle}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0 ml-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                        {result.category}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : query ? (
            <div className="p-8 text-center">
              <Search className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No results found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Try adjusting your search terms or check your spelling.
              </p>
            </div>
          ) : recentSearches.length > 0 ? (
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Recent Searches</h3>
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => setQuery(search)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                  >
                    <Search className="inline w-4 h-4 mr-2" />
                    {search}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <Search className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Start typing to search</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Search across projects, tasks, clients, documents, and more.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <span>↑↓ to navigate</span>
              <span>↵ to select</span>
              <span>esc to close</span>
            </div>
            <button
              onClick={onClose}
              className="hover:text-gray-700 dark:hover:text-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;
