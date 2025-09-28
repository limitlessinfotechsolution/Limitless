'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, Search, Filter, ArrowRight } from 'lucide-react';
import SEOHead from '../../src/components/SEOHead';
import { generateWebPageSchema, generateArticleSchema, generateBreadcrumbSchema } from '../../src/lib/seoSchemas';

// Mock blog data - in production, this would come from a CMS or API
const blogPosts = [
  {
    id: '1',
    title: 'The Future of AI in Enterprise Software Development',
    excerpt: 'Explore how artificial intelligence is revolutionizing enterprise software development, from automated code generation to intelligent project management.',
    content: 'Full article content here...',
    author: 'Dr. Sarah Chen',
    authorRole: 'Chief Technology Officer',
    authorImage: '/images/team/sarah-chen.jpg',
    publishedAt: '2024-01-15',
    readTime: '8 min read',
    category: 'AI & Automation',
    tags: ['AI', 'Enterprise', 'Software Development', 'Innovation'],
    featured: true,
    image: '/images/blog/ai-enterprise.jpg'
  },
  {
    id: '2',
    title: 'Building Scalable CRM Systems: Best Practices',
    excerpt: 'Learn the essential principles and technologies for building CRM systems that scale with your business growth.',
    content: 'Full article content here...',
    author: 'Michael Rodriguez',
    authorRole: 'Senior Solutions Architect',
    authorImage: '/images/team/michael-rodriguez.jpg',
    publishedAt: '2024-01-10',
    readTime: '6 min read',
    category: 'CRM Solutions',
    tags: ['CRM', 'Scalability', 'Best Practices', 'Architecture'],
    featured: false,
    image: '/images/blog/crm-scalable.jpg'
  },
  {
    id: '3',
    title: 'Mobile App Development Trends for 2024',
    excerpt: 'Stay ahead of the curve with the latest trends shaping mobile app development in 2024.',
    content: 'Full article content here...',
    author: 'Emma Thompson',
    authorRole: 'Lead Mobile Developer',
    authorImage: '/images/team/emma-thompson.jpg',
    publishedAt: '2024-01-05',
    readTime: '5 min read',
    category: 'Mobile Development',
    tags: ['Mobile', 'Trends', '2024', 'iOS', 'Android'],
    featured: false,
    image: '/images/blog/mobile-trends.jpg'
  },
  {
    id: '4',
    title: 'Cybersecurity in Custom Software Development',
    excerpt: 'Essential security practices every custom software development project should implement.',
    content: 'Full article content here...',
    author: 'David Kim',
    authorRole: 'Security Specialist',
    authorImage: '/images/team/david-kim.jpg',
    publishedAt: '2023-12-28',
    readTime: '7 min read',
    category: 'Security & Compliance',
    tags: ['Security', 'Cybersecurity', 'Compliance', 'Best Practices'],
    featured: false,
    image: '/images/blog/cybersecurity.jpg'
  },
  {
    id: '5',
    title: 'Database Design Patterns for High-Performance Applications',
    excerpt: 'Master the art of database design with proven patterns that ensure optimal performance and scalability.',
    content: 'Full article content here...',
    author: 'Lisa Wang',
    authorRole: 'Database Architect',
    authorImage: '/images/team/lisa-wang.jpg',
    publishedAt: '2023-12-20',
    readTime: '9 min read',
    category: 'Backend & Databases',
    tags: ['Database', 'Performance', 'Design Patterns', 'Scalability'],
    featured: false,
    image: '/images/blog/database-design.jpg'
  },
  {
    id: '6',
    title: 'The ROI of Custom Software Development',
    excerpt: 'Understanding the real return on investment when choosing custom software over off-the-shelf solutions.',
    content: 'Full article content here...',
    author: 'Robert Johnson',
    authorRole: 'Business Development Director',
    authorImage: '/images/team/robert-johnson.jpg',
    publishedAt: '2023-12-15',
    readTime: '6 min read',
    category: 'Business Strategy',
    tags: ['ROI', 'Business', 'Custom Software', 'Investment'],
    featured: false,
    image: '/images/blog/roi-custom-software.jpg'
  }
];

const categories = ['All', 'AI & Automation', 'CRM Solutions', 'Mobile Development', 'Security & Compliance', 'Backend & Databases', 'Business Strategy'];

const Blog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');

  const filteredAndSortedPosts = useMemo(() => {
    const filtered = blogPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        case 'oldest':
          return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
        case 'popular':
          // In a real app, this would be based on view count or engagement
          return b.featured ? 1 : -1;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, sortBy]);

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = filteredAndSortedPosts.filter(post => !post.featured);

  const structuredData = [
    generateWebPageSchema({
      name: 'Blog & Insights - Limitless Infotech',
      description: 'Stay updated with the latest trends, insights, and best practices in software development, AI, CRM, and digital transformation.',
      url: '/blog',
      datePublished: '2024-01-01',
      dateModified: new Date().toISOString().split('T')[0]
    }),
    generateBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Blog & Insights', url: '/blog' }
    ]),
    ...blogPosts.slice(0, 3).map(post => generateArticleSchema({
      headline: post.title,
      description: post.excerpt,
      image: post.image,
      datePublished: post.publishedAt,
      author: post.author,
      url: `/blog/${post.id}`
    }))
  ];

  return (
    <>
      <SEOHead
        title="Blog & Insights - Latest Trends in Software Development | Limitless Infotech"
        description="Stay updated with the latest trends, insights, and best practices in AI, CRM, mobile development, and enterprise software solutions."
        canonical="/blog"
        ogImage="/images/blog/blog-og.jpg"
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-accent via-accent-dark to-accent-orange text-white py-20">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-4xl md:text-6xl font-black mb-6">
                Insights & Perspectives
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90">
                Stay ahead of the curve with expert insights on technology trends,
                best practices, and industry innovations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 w-full sm:w-80"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Article */}
        {featuredPost && (
          <section className="py-16 bg-white dark:bg-gray-800">
            <div className="container-custom">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8"
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Featured Article</h2>
                <div className="w-20 h-1 bg-accent rounded-full"></div>
              </motion.div>

              <motion.article
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-gradient-to-r from-accent/5 to-accent-orange/5 rounded-2xl p-8 border border-accent/10"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="px-3 py-1 bg-accent text-white text-sm font-medium rounded-full">
                        {featuredPost.category}
                      </span>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(featuredPost.publishedAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-1" />
                        {featuredPost.readTime}
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                      {featuredPost.title}
                    </h3>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={featuredPost.authorImage}
                          alt={featuredPost.author}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {featuredPost.author}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {featuredPost.authorRole}
                          </div>
                        </div>
                      </div>
                      <Link
                        href={`/blog/${featuredPost.id}`}
                        className="inline-flex items-center px-6 py-3 bg-accent hover:bg-accent-dark text-white font-medium rounded-lg transition-colors duration-200"
                      >
                        Read Article
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </div>
                  </div>
                  <div className="relative">
                    <img
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      className="w-full h-64 lg:h-80 object-cover rounded-xl shadow-lg"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-accent text-sm font-medium rounded-full">
                        Featured
                      </span>
                    </div>
                  </div>
                </div>
              </motion.article>
            </div>
          </section>
        )}

        {/* Filters and Articles */}
        <section className="py-16">
          <div className="container-custom">
            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12"
            >
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                      selectedCategory === category
                        ? 'bg-accent text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'popular')}
                  className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </motion.div>

            {/* Articles Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {regularPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-accent text-white text-xs font-medium rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {post.readTime}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img
                          src={post.authorImage}
                          alt={post.author}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {post.author}
                        </span>
                      </div>

                      <Link
                        href={`/blog/${post.id}`}
                        className="text-accent hover:text-accent-dark font-medium text-sm flex items-center"
                      >
                        Read More
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>

            {regularPosts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No articles found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your search or filter criteria.
                </p>
              </motion.div>
            )}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-16 bg-accent text-white">
          <div className="container-custom text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-4">
                Stay Updated
              </h2>
              <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                Get the latest insights and industry trends delivered to your inbox.
              </p>
              <div className="max-w-md mx-auto flex gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <button className="px-6 py-3 bg-white text-accent font-medium rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  Subscribe
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Blog;
