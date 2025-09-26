import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, XCircle, AlertTriangle, Info, 
  Palette, Layout, Type, MousePointer, 
  Zap, Shield, BarChart3, Settings,
  Eye, ThumbsUp,
  Monitor, Smartphone, Tablet,
  Palette as DesignIcon, UserCheck
} from 'lucide-react';
import Card from '../ui/Card';

interface Review {
  id: string;
  component: string;
  category: string;
  status: 'review' | 'mature' | 'needs-work';
  issues: string[];
  improvements: string[];
}

const FinalInterfaceReview: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      component: 'Navigation',
      category: 'UI Design',
      status: 'mature',
      issues: [],
      improvements: [
        'Implemented glass morphism effect with enhanced backdrop blur',
        'Added smart hide/unhide functionality on scroll',
        'Enhanced mobile responsiveness with curved corners',
        'Improved dropdown menus with smooth animations',
        'Added professional color scheme and typography'
      ]
    },
    {
      id: '2',
      component: 'Hero Section',
      category: 'UI Design',
      status: 'mature',
      issues: [],
      improvements: [
        'Added advanced particle animations with enhanced visual effects',
        'Improved visual hierarchy with better typography',
        'Enhanced CTA buttons with gradient effects',
        'Added premium background elements',
        'Implemented smooth entrance animations'
      ]
    },
    {
      id: '3',
      component: 'Chatbot',
      category: 'UI/UX',
      status: 'mature',
      issues: [],
      improvements: [
        'Professionalized widget design with gradient effects',
        'Enhanced message UI with improved readability',
        'Added advanced settings panel with mode selection',
        'Implemented responsive design for all screen sizes',
        'Added professional animations and transitions'
      ]
    },
    {
      id: '4',
      component: 'Admin Panel',
      category: 'UI/UX',
      status: 'mature',
      issues: [],
      improvements: [
        'Added top and bottom navigation for better UX',
        'Enhanced dashboard analytics with professional charts',
        'Professionalized all admin components with consistent design',
        'Improved data visualization with better color schemes',
        'Added comprehensive filtering and search capabilities'
      ]
    },
    {
      id: '5',
      component: 'Testimonials',
      category: 'Content',
      status: 'mature',
      issues: [],
      improvements: [
        'Enhanced carousel design with smooth transitions',
        'Added rich media support for better engagement',
        'Improved filtering capabilities by category/tags',
        'Added professional rating system with star visualization',
        'Implemented responsive grid layout'
      ]
    },
    {
      id: '6',
      component: 'FAQ Section',
      category: 'Interaction',
      status: 'mature',
      issues: [],
      improvements: [
        'Added drag-and-drop reordering for better organization',
        'Enhanced category organization with collapsible sections',
        'Improved search functionality with instant filtering',
        'Added professional accordion animations',
        'Implemented keyboard navigation support'
      ]
    },
    {
      id: '7',
      component: 'Dashboard Stats',
      category: 'Analytics',
      status: 'mature',
      issues: [],
      improvements: [
        'Enhanced color contrast for better accessibility in dark mode',
        'Standardized spacing and padding across all stat cards',
        'Added subtle hover effects for better interactivity',
        'Improved visual hierarchy with better typography'
      ]
    },
    {
      id: '8',
      component: 'Form Elements',
      category: 'UI Design',
      status: 'mature',
      issues: [],
      improvements: [
        'Standardized form element styling across the application with new FormComponents',
        'Added clear focus states for all interactive elements for better accessibility',
        'Implemented consistent validation feedback with appropriate colors and messaging',
        'Enhanced all form components with proper error handling and accessibility features'
      ]
    },
    {
      id: '9',
      component: 'Buttons',
      category: 'UI Design',
      status: 'mature',
      issues: [],
      improvements: [
        'Created a consistent button sizing system with 5 size options',
        'Added proper disabled states with reduced opacity and appropriate styling',
        'Implemented secondary, tertiary, and multiple button variants for better UI hierarchy',
        'Enhanced buttons with loading states, icons, and customizable styling options'
      ]
    },
    {
      id: '10',
      component: 'Typography',
      category: 'Content',
      status: 'mature',
      issues: [],
      improvements: [
        'Standardized font weights and sizes across the application',
        'Implemented consistent line heights for better readability',
        'Established clear typographic hierarchy with proper heading levels',
        'Created reusable typography components for consistent text styling'
      ]
    },
    {
      id: '11',
      component: 'Color Scheme',
      category: 'UI Design',
      status: 'mature',
      issues: [],
      improvements: [
        'Limited gradient usage to primary action elements for better visual hierarchy',
        'Standardized color palette with consistent usage guidelines',
        'Ensured all text meets WCAG contrast requirements for accessibility',
        'Created a comprehensive color system with proper semantic color usage'
      ]
    },
    {
      id: '12',
      component: 'Mobile Responsiveness',
      category: 'UI/UX',
      status: 'mature',
      issues: [],
      improvements: [
        'Ensured all components are properly contained within viewport on all devices',
        'Increased touch target sizes for better mobile usability',
        'Improved navigation menu spacing and readability on small screens',
        'Implemented responsive design system with enhanced grid and flex components'
      ]
    }
  ]);

  const [newReview, setNewReview] = useState({
    component: '',
    category: 'UI Design',
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

  const deviceConfig = {
    desktop: { icon: Monitor, label: 'Desktop' },
    tablet: { icon: Tablet, label: 'Tablet' },
    mobile: { icon: Smartphone, label: 'Mobile' }
  };

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
      status: 'review',
      issues: '',
      improvements: ''
    });
  };

  const updateReviewStatus = (id: string, status: 'review' | 'mature' | 'needs-work') => {
    setReviews(reviews.map(review => 
      review.id === id ? { ...review, status } : review
    ));
  };

  const getDeviceRecommendations = () => {
    const needsWorkCount = reviews.filter(r => r.status === 'needs-work').length;
    const reviewCount = reviews.filter(r => r.status === 'review').length;
    
    if (needsWorkCount > 3) {
      return {
        desktop: 'High priority fixes needed for desktop experience',
        tablet: 'Address critical issues before tablet optimization',
        mobile: 'Postpone mobile enhancements until desktop is stable'
      };
    } else if (reviewCount > 2) {
      return {
        desktop: 'Continue refinement of desktop components',
        tablet: 'Begin tablet-specific optimizations',
        mobile: 'Implement responsive adjustments for mobile'
      };
    } else {
      return {
        desktop: 'Desktop experience is nearly complete',
        tablet: 'Focus on tablet-specific touch interactions',
        mobile: 'Optimize for mobile with enhanced touch targets'
      };
    }
  };

  const deviceRecommendations = getDeviceRecommendations();

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Final Interface Maturity Review</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Comprehensive assessment to eliminate any remaining childish appearance and ensure professional design
        </p>
      </motion.div>

      {/* Device-Specific Recommendations */}
      <Card className="p-4 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Monitor className="w-5 h-5 mr-2 text-accent" />
          Device-Specific Optimization Priorities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(deviceConfig).map(([device, config]) => {
            const IconComponent = config.icon;
            return (
              <div key={device} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-2">
                  <IconComponent className="w-5 h-5 text-accent mr-2" />
                  <h3 className="font-medium text-gray-900 dark:text-white">{config.label}</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {deviceRecommendations[device as keyof typeof deviceRecommendations]}
                </p>
              </div>
            );
          })}
        </div>
      </Card>

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
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${statusConfig[review.status as keyof typeof statusConfig].bg} ${statusConfig[review.status as keyof typeof statusConfig].color}`}>
                        <StatusIcon className="w-3 h-3 inline mr-1" />
                        {statusConfig[review.status as keyof typeof statusConfig].label}
                      </span>
                    </h3>
                    <div className="flex items-center mt-1">
                      <CategoryIcon className={`w-4 h-4 ${categoryConfig[review.category as keyof typeof categoryConfig].color} mr-1`} />
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
          Interface Maturity Final Assessment
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
                Focus on components marked as "Needs Work" to eliminate childish appearance
              </li>
              <li className="flex items-start">
                <Eye className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                Periodically review "Under Review" components for further improvements
              </li>
              <li className="flex items-start">
                <BarChart3 className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                Monitor user feedback to identify additional professionalization opportunities
              </li>
              <li className="flex items-start">
                <DesignIcon className="w-4 h-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                Ensure consistent design language across all components and devices
              </li>
              <li className="flex items-start">
                <UserCheck className="w-4 h-4 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" />
                Test with real users to validate professional appearance and usability
              </li>
            </ul>
          </div>
          <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Next Steps</h3>
            <ol className="space-y-1 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside">
              <li>Address all "Needs Work" components with priority</li>
              <li>Implement device-specific optimizations based on recommendations</li>
              <li>Conduct user testing sessions to validate improvements</li>
              <li>Document design system guidelines for future consistency</li>
              <li>Establish regular review cycles for ongoing professionalization</li>
            </ol>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FinalInterfaceReview;