import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Menu, Home, Settings, Briefcase, MessageSquare, Info, Phone, 
  User, Shield, TrendingUp, Search, Filter, Plus, Edit, Eye, Trash2,
  Star, CheckCircle, Download, BarChart3
} from 'lucide-react';
import CardEnhanced from '../ui/CardEnhanced';
import Card from '../ui/Card';

const MobileRefinementTest: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Test data for various components
  const testData = {
    navigation: [
      { name: 'Home', icon: Home },
      { name: 'Services', icon: Settings },
      { name: 'Portfolio', icon: Briefcase },
      { name: 'About', icon: Info },
      { name: 'Contact', icon: Phone }
    ],
    stats: [
      { label: 'Total Users', value: '1,248', icon: User, color: 'bg-blue-500' },
      { label: 'Revenue', value: '$24,560', icon: TrendingUp, color: 'bg-green-500' },
      { label: 'Tasks', value: '86%', icon: CheckCircle, color: 'bg-purple-500' }
    ],
    testimonials: [
      { id: '1', name: 'John Doe', company: 'Tech Corp', rating: 5, content: 'Excellent service!' },
      { id: '2', name: 'Jane Smith', company: 'Design Studio', rating: 4, content: 'Very professional team.' }
    ],
    users: [
      { id: '1', name: 'Alex Johnson', email: 'alex@example.com', role: 'Admin', status: 'Active' },
      { id: '2', name: 'Maria Garcia', email: 'maria@example.com', role: 'Editor', status: 'Inactive' }
    ]
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mobile Refinement Test</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Screen Width: {windowWidth}px - {isMobile ? 'Mobile View' : 'Desktop View'}
        </p>
      </motion.div>

      {/* Navigation Test */}
      <CardEnhanced className="p-4 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
          <Menu className="w-5 h-5 mr-2 text-accent" />
          Navigation Component
        </h2>
        <div className="flex flex-wrap gap-2">
          {testData.navigation.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.button
                key={item.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg min-w-[70px]"
              >
                <IconComponent className="w-5 h-5 text-gray-700 dark:text-gray-300 mb-1" />
                <span className="text-xs text-gray-700 dark:text-gray-300">{item.name}</span>
              </motion.button>
            );
          })}
        </div>
      </CardEnhanced>

      {/* Stats Cards Test */}
      <CardEnhanced className="p-4 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-accent" />
          Stats Cards
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {testData.stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${stat.color} text-white mr-3`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                    <p className="font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardEnhanced>

      {/* Testimonials Test */}
      <Card className="p-4 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
          <MessageSquare className="w-5 h-5 mr-2 text-accent" />
          Testimonials
        </h2>
        <div className="space-y-4">
          {testData.testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.company}</p>
                </div>
                <div className="flex">
                  {renderStars(testimonial.rating)}
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm">"{testimonial.content}"</p>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Users Table Test */}
      <Card className="p-4 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
          <User className="w-5 h-5 mr-2 text-accent" />
          Users Management
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {testData.users.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="dark:hover:bg-gray-700"
                >
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-900 dark:text-white">{user.role}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.status === 'Active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-1">
                      <button className="p-1.5 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-full">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Action Buttons Test */}
      <Card className="p-4 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
          <Plus className="w-5 h-5 mr-2 text-accent" />
          Action Buttons
        </h2>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors text-sm">
            <Plus className="w-4 h-4 mr-1" />
            Add New
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
            <Filter className="w-4 h-4 mr-1" />
            Filter
          </button>
          <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm">
            <Download className="w-4 h-4 mr-1" />
            Export
          </button>
        </div>
      </Card>

      {/* Form Elements Test */}
      <Card className="p-4 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
          <Settings className="w-5 h-5 mr-2 text-accent" />
          Form Elements
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-accent focus:border-accent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select
            </label>
            <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-accent focus:border-accent">
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="test-checkbox"
              className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
            />
            <label htmlFor="test-checkbox" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Test Checkbox
            </label>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MobileRefinementTest;