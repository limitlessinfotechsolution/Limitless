import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Project } from '../../types';

interface EnhancedFiltersProps {
  projects: Project[];
  filters: { industry: string; serviceType: string; projectSize: string };
  onFiltersChange: (filters: { industry: string; serviceType: string; projectSize: string }) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const EnhancedFilters: React.FC<EnhancedFiltersProps> = ({
  projects,
  filters,
  onFiltersChange,
  searchQuery,
  onSearchChange
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Extract unique values for filters
  const industries = useMemo(() => [...new Set(projects.map(p => p.industry))], [projects]);
  const serviceTypes = useMemo(() => [...new Set(projects.map(p => p.serviceType))], [projects]);
  const projectSizes = useMemo(() => [...new Set(projects.map(p => p.projectSize))], [projects]);

  // AI-powered search suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const suggestions = new Set<string>();

    projects.forEach(project => {
      // Title matches
      if (project.title.toLowerCase().includes(query)) {
        suggestions.add(project.title);
      }
      // Industry matches
      if (project.industry.toLowerCase().includes(query)) {
        suggestions.add(`Projects in ${project.industry}`);
      }
      // Service type matches
      if (project.serviceType.toLowerCase().includes(query)) {
        suggestions.add(`${project.serviceType} solutions`);
      }
      // Description keywords
      const keywords = project.description.toLowerCase().split(' ');
      keywords.forEach(keyword => {
        if (keyword.includes(query) && keyword.length > 3) {
          suggestions.add(keyword.charAt(0).toUpperCase() + keyword.slice(1));
        }
      });
    });

    return Array.from(suggestions).slice(0, 5);
  }, [searchQuery, projects]);

  const handleFilterClick = (filterType: keyof typeof filters, value: string) => {
    onFiltersChange({
      ...filters,
      [filterType]: filters[filterType] === value ? 'All' : value
    });
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSearchChange(suggestion);
    setShowSuggestions(false);
  };

  const FilterButton: React.FC<{
    label: string;
    isActive: boolean;
    onClick: () => void;
    icon?: React.ComponentType<any>;
  }> = ({ label, isActive, onClick, icon: Icon }) => (
    <motion.button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
        isActive
          ? 'bg-accent text-white shadow-lg scale-105'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-accent/10 hover:text-accent hover:scale-105'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {label}
    </motion.button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700"
    >
      {/* Search Bar */}
      <div className="mb-6 relative">
        <div className="relative">
          <Icons.Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search projects, industries, or technologies..."
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-accent focus:ring-4 focus:ring-accent/20 dark:bg-gray-700 dark:text-white transition-all duration-300"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <Icons.X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* AI Search Suggestions */}
        <AnimatePresence>
          {showSuggestions && searchSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto"
            >
              <div className="p-2">
                <div className="text-xs text-gray-500 dark:text-gray-400 px-3 py-2 font-medium">
                  💡 Smart Suggestions
                </div>
                {searchSuggestions.map((suggestion, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-3"
                    whileHover={{ x: 4 }}
                  >
                    <Icons.Lightbulb className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                    <span className="text-sm">{suggestion}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Filter Pills */}
      <div className="space-y-4">
        {/* Industries */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Icons.Building className="w-5 h-5 text-accent" />
            <span className="font-semibold text-gray-900 dark:text-white">Industries</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterButton
              label="All Industries"
              isActive={filters.industry === 'All'}
              onClick={() => handleFilterClick('industry', 'All')}
              icon={Icons.Grid3X3}
            />
            {industries.map((industry, index) => (
              <FilterButton
                key={index}
                label={industry}
                isActive={filters.industry === industry}
                onClick={() => handleFilterClick('industry', industry)}
              />
            ))}
          </div>
        </div>

        {/* Services */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Icons.Settings className="w-5 h-5 text-accent" />
            <span className="font-semibold text-gray-900 dark:text-white">Services</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterButton
              label="All Services"
              isActive={filters.serviceType === 'All'}
              onClick={() => handleFilterClick('serviceType', 'All')}
              icon={Icons.Layers}
            />
            {serviceTypes.map((service, index) => (
              <FilterButton
                key={index}
                label={service}
                isActive={filters.serviceType === service}
                onClick={() => handleFilterClick('serviceType', service)}
              />
            ))}
          </div>
        </div>

        {/* Project Size */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Icons.BarChart3 className="w-5 h-5 text-accent" />
            <span className="font-semibold text-gray-900 dark:text-white">Project Size</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterButton
              label="All Sizes"
              isActive={filters.projectSize === 'All'}
              onClick={() => handleFilterClick('projectSize', 'All')}
              icon={Icons.Expand}
            />
            {projectSizes.map((size, index) => (
              <FilterButton
                key={index}
                label={size}
                isActive={filters.projectSize === size}
                onClick={() => handleFilterClick('projectSize', size)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      {(filters.industry !== 'All' || filters.serviceType !== 'All' || filters.projectSize !== 'All' || searchQuery) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600"
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {filters.industry !== 'All' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent/20 text-accent rounded-full text-sm">
                  <Icons.Building className="w-3 h-3" />
                  {filters.industry}
                  <button
                    onClick={() => handleFilterClick('industry', 'All')}
                    className="ml-1 hover:bg-accent/30 rounded-full p-0.5"
                  >
                    <Icons.X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.serviceType !== 'All' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent/20 text-accent rounded-full text-sm">
                  <Icons.Settings className="w-3 h-3" />
                  {filters.serviceType}
                  <button
                    onClick={() => handleFilterClick('serviceType', 'All')}
                    className="ml-1 hover:bg-accent/30 rounded-full p-0.5"
                  >
                    <Icons.X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.projectSize !== 'All' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent/20 text-accent rounded-full text-sm">
                  <Icons.BarChart3 className="w-3 h-3" />
                  {filters.projectSize}
                  <button
                    onClick={() => handleFilterClick('projectSize', 'All')}
                    className="ml-1 hover:bg-accent/30 rounded-full p-0.5"
                  >
                    <Icons.X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent/20 text-accent rounded-full text-sm">
                  <Icons.Search className="w-3 h-3" />
                  "{searchQuery}"
                  <button
                    onClick={() => onSearchChange('')}
                    className="ml-1 hover:bg-accent/30 rounded-full p-0.5"
                  >
                    <Icons.X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
            <button
              onClick={() => {
                onFiltersChange({ industry: 'All', serviceType: 'All', projectSize: 'All' });
                onSearchChange('');
              }}
              className="text-sm text-gray-500 hover:text-accent transition-colors"
            >
              Clear all
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EnhancedFilters;