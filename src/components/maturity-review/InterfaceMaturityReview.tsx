import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, XCircle, AlertTriangle, Info, 
  Palette, Layout, Type, MousePointer, 
  Zap, Shield, BarChart3, Settings,
  Eye, ThumbsUp
} from 'lucide-react';
import { Card } from '../ui/Card';

const InterfaceMaturityReview: React.FC = () => {
  interface Review {
    id: string;
    component: string;
    category: 'UI Design' | 'UI/UX' | 'Content' | 'Interaction' | 'Performance' | 'Security' | 'Analytics' | 'Settings';
    status: 'review' | 'mature' | 'needs-work';
    issues: string[];
    improvements: string[];
  }

  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      component: 'Navigation',
      category: 'UI Design',
      status: 'mature',
      issues: [],
      improvements: [
        'Implemented glass morphism effect',
        'Added smart hide/unhide functionality',
        'Enhanced mobile responsiveness'
      ]
    },
    {
      id: '2',
      component: 'Hero Section',
      category: 'UI Design',
      status: 'mature',
      issues: [],
      improvements: [
        'Added advanced particle animations',
        'Enhanced visual hierarchy',
        'Improved CTA buttons'
      ]
    },
    {
      id: '3',
      component: 'Chatbot',
      category: 'UI/UX',
      status: 'mature',
      issues: [],
      improvements: [
        'Professionalized widget design',
        'Enhanced message UI',
        'Added advanced settings'
      ]
    },
    {
      id: '4',
      component: 'Admin Panel',
      category: 'UI/UX',
      status: 'mature',
      issues: [],
      improvements: [
        'Added top and bottom navigation',
        'Enhanced dashboard analytics',
        'Professionalized all components'
      ]
    },
    {
      id: '5',
      component: 'Testimonials',
      category: 'Content',
      status: 'mature',
      issues: [],
      improvements: [
        'Enhanced carousel design',
        'Added rich media support',
        'Improved filtering capabilities'
      ]
    },
    {
      id: '6',
      component: 'FAQ Section',
      category: 'Interaction',
      status: 'mature',
      issues: [],
      improvements: [
        'Added drag-and-drop reordering',
        'Enhanced category organization',
        'Improved search functionality'
      ]
    }
  ]);

  const [newReview, setNewReview] = useState({
    component: '',
    category: 'UI Design' as 'UI Design' | 'UI/UX' | 'Content' | 'Interaction' | 'Performance' | 'Security' | 'Analytics' | 'Settings',
    status: 'review' as 'review' | 'mature' | 'needs-work',
    issues: '',
    improvements: ''
  });

  const statusConfig = {
    review: { icon: Eye, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30', label: 'Under Review' },
    mature: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30', label: 'Mature' },
    'needs-work': { icon: XCircle, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30', label: 'Needs Work' }
  } as const;

  const categoryConfig = {
    'UI Design': { icon: Palette, color: 'text-blue-500' },
    'UI/UX': { icon: Layout, color: 'text-purple-500' },
    'Content': { icon: Type, color: 'text-green-500' },
    'Interaction': { icon: MousePointer, color: 'text-orange-500' },
    'Performance': { icon: Zap, color: 'text-yellow-500' },
    'Security': { icon: Shield, color: 'text-red-500' },
    'Analytics': { icon: BarChart3, color: 'text-indigo-500' },
    'Settings': { icon: Settings, color: 'text-gray-500' }
  } as const;

  const handleAddReview = () => {
    if (newReview.component.trim() === '') return;
    
    const review: Review = {
      id: (reviews.length + 1).toString(),
      component: newReview.component,
      category: newReview.category,
      status: newReview.status,
      issues: newReview.issues.split('\n').filter(issue => issue.trim() !== ''),
      improvements: newReview.improvements.split('\n').filter(imp => imp.trim() !== '')
    };
    
    setReviews([...reviews, review]);
    setNewReview({
      component: '',
      category: 'UI Design',
      status: 'review' as 'review' | 'mature' | 'needs-work',
      issues: '',
      improvements: ''
    });
  };

  const updateReviewStatus = (id: string, status: 'review' | 'mature' | 'needs-work') => {
    setReviews(reviews.map(review => 
      review.id === id ? { ...review, status } : review
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Interface Maturity Review</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Comprehensive review to eliminate childish appearance and ensure professional design
        </p>
      </motion.div>

      {/* Add New Review */}
      <Card className="p-4 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Info className="w-5 h-5 mr-2 text-accent" />
          Add New Component Review
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Component Name
            </label>
            <input
              type="text"
              value={newReview.component}
              onChange={(e) => setNewReview({...newReview, component: e.target.value})}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-accent focus:border-accent"
              placeholder="e.g., Contact Form"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              value={newReview.category}
              onChange={(e) => setNewReview({...newReview, category: e.target.value as 'UI Design' | 'UI/UX' | 'Content' | 'Interaction' | 'Performance' | 'Security' | 'Analytics' | 'Settings'})}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-accent focus:border-accent"
            >
              {Object.keys(categoryConfig).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              value={newReview.status}
              onChange={(e) => setNewReview({...newReview, status: e.target.value as 'review' | 'mature' | 'needs-work'})}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-accent focus:border-accent"
            >
              <option value="review">Under Review</option>
              <option value="mature">Mature</option>
              <option value="needs-work">Needs Work</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Issues (one per line)
            </label>
            <textarea
              value={newReview.issues}
              onChange={(e) => setNewReview({...newReview, issues: e.target.value})}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-accent focus:border-accent"
              rows={3}
              placeholder="List any issues with this component..."
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Improvements (one per line)
            </label>
            <textarea
              value={newReview.improvements}
              onChange={(e) => setNewReview({...newReview, improvements: e.target.value})}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-accent focus:border-accent"
              rows={3}
              placeholder="List improvements made or needed..."
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={handleAddReview}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors"
          >
            Add Review
          </button>
        </div>
      </Card>

      {/* Reviews Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Eye className="w-5 h-5 text-yellow-500 mr-2" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Under Review</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {reviews.filter(r => r.status === 'review').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Mature</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {reviews.filter(r => r.status === 'mature').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <XCircle className="w-5 h-5 text-red-500 mr-2" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Needs Work</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {reviews.filter(r => r.status === 'needs-work').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Reviews */}
      <Card className="p-4 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Component Reviews</h2>
        <div className="space-y-4">
          {reviews.map((review, index) => {
            const StatusIcon = statusConfig[review.status as keyof typeof statusConfig].icon;
            const CategoryIcon = categoryConfig[review.category as keyof typeof categoryConfig].icon;
            
            return (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                      {review.component}
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${statusConfig[review.status].bg} ${statusConfig[review.status].color}`}>
                        <StatusIcon className="w-3 h-3 inline mr-1" />
                        {statusConfig[review.status].label}
                      </span>
                    </h3>
                    <div className="flex items-center mt-1">
                      <CategoryIcon className={`w-4 h-4 ${categoryConfig[review.category].color} mr-1`} />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{review.category}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateReviewStatus(review.id, 'review')}
                      className={`p-1.5 rounded-full ${review.status === 'review' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-500' : 'text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                      title="Mark as Under Review"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => updateReviewStatus(review.id, 'mature')}
                      className={`p-1.5 rounded-full ${review.status === 'mature' ? 'bg-green-100 dark:bg-green-900/30 text-green-500' : 'text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                      title="Mark as Mature"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => updateReviewStatus(review.id, 'needs-work')}
                      className={`p-1.5 rounded-full ${review.status === 'needs-work' ? 'bg-red-100 dark:bg-red-900/30 text-red-500' : 'text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                      title="Mark as Needs Work"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {review.issues.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                      <AlertTriangle className="w-4 h-4 text-orange-500 mr-1" />
                      Issues Identified
                    </h4>
                    <ul className="mt-1 space-y-1">
                      {review.issues.map((issue, idx) => (
                        <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                          <XCircle className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {review.improvements.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                      Improvements
                    </h4>
                    <ul className="mt-1 space-y-1">
                      {review.improvements.map((improvement, idx) => (
                        <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Final Assessment */}
      <Card className="p-4 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
          <ThumbsUp className="w-5 h-5 mr-2 text-accent" />
          Interface Maturity Assessment
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <span className="font-medium text-gray-900 dark:text-white">Overall Maturity Status</span>
            <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm">
              {Math.round((reviews.filter(r => r.status === 'mature').length / reviews.length) * 100)}% Mature
            </span>
          </div>
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Recommendations</h3>
            <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                Continue refining components marked as "Needs Work"
              </li>
              <li className="flex items-start">
                <Eye className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                Periodically review "Under Review" components
              </li>
              <li className="flex items-start">
                <BarChart3 className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                Monitor user feedback for further improvements
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InterfaceMaturityReview;
