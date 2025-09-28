'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Bookmark, ThumbsUp, MessageCircle, Twitter, Facebook, Linkedin, Link2 } from 'lucide-react';
import SEOHead from '../../../src/components/SEOHead';
import { generateArticleSchema, generateBreadcrumbSchema } from '../../../src/lib/seoSchemas';

// Mock blog data - in production, this would come from a CMS or API
const blogPosts = [
  {
    id: '1',
    title: 'The Future of AI in Enterprise Software Development',
    excerpt: 'Explore how artificial intelligence is revolutionizing enterprise software development, from automated code generation to intelligent project management.',
    content: `
      <h2>The AI Revolution in Software Development</h2>
      <p>Artificial Intelligence is fundamentally transforming how we approach software development. From automated code generation to intelligent project management, AI tools are becoming indispensable in the modern development workflow.</p>

      <h3>Automated Code Generation</h3>
      <p>Modern AI-powered tools can now generate production-ready code from natural language descriptions. This capability is revolutionizing the way developers work, allowing them to focus on high-level architecture and problem-solving rather than repetitive coding tasks.</p>

      <blockquote>
        "AI doesn't replace developers—it empowers them to work at higher levels of abstraction and creativity."
      </blockquote>

      <h3>Intelligent Project Management</h3>
      <p>AI algorithms can analyze project data to predict timelines, identify risks, and optimize resource allocation. Machine learning models trained on historical project data can provide accurate estimates and help teams make data-driven decisions.</p>

      <h3>Code Quality and Security</h3>
      <p>AI-powered static analysis tools can detect potential security vulnerabilities and code quality issues before they reach production. These tools learn from vast amounts of code and can identify patterns that human reviewers might miss.</p>

      <h2>Challenges and Considerations</h2>
      <p>While the benefits are clear, organizations must carefully consider the implementation of AI tools. Training, integration with existing workflows, and maintaining code quality standards are all critical factors for success.</p>

      <h2>The Road Ahead</h2>
      <p>As AI technology continues to evolve, we can expect even more sophisticated tools that will further enhance developer productivity and software quality. The key to success lies in thoughtful adoption and integration of these powerful technologies.</p>
    `,
    author: 'Dr. Sarah Chen',
    authorRole: 'Chief Technology Officer',
    authorImage: '/images/team/sarah-chen.jpg',
    authorBio: 'Dr. Chen has over 15 years of experience in AI and software engineering, leading innovation initiatives at Fortune 500 companies.',
    publishedAt: '2024-01-15',
    readTime: '8 min read',
    category: 'AI & Automation',
    tags: ['AI', 'Enterprise', 'Software Development', 'Innovation'],
    featured: true,
    image: '/images/blog/ai-enterprise.jpg',
    relatedPosts: ['2', '3', '4']
  },
  {
    id: '2',
    title: 'Building Scalable CRM Systems: Best Practices',
    excerpt: 'Learn the essential principles and technologies for building CRM systems that scale with your business growth.',
    content: `
      <h2>Scalability Fundamentals</h2>
      <p>Building a CRM system that can grow with your business requires careful planning and architectural decisions from the outset. Scalability isn't just about handling more users—it's about maintaining performance, reliability, and cost-effectiveness as your business expands.</p>

      <h3>Database Design Principles</h3>
      <p>The foundation of any scalable CRM is a well-designed database. Consider these key principles:</p>
      <ul>
        <li><strong>Normalization vs. Denormalization:</strong> Balance data integrity with query performance</li>
        <li><strong>Indexing Strategy:</strong> Optimize for common query patterns</li>
        <li><strong>Data Partitioning:</strong> Distribute data across multiple storage units</li>
        <li><strong>Caching Layers:</strong> Implement multiple levels of caching</li>
      </ul>

      <h3>Microservices Architecture</h3>
      <p>Breaking down your CRM into smaller, independent services allows for better scalability and maintainability. Each service can be scaled independently based on demand.</p>

      <h3>Performance Optimization</h3>
      <p>Implement various optimization techniques:</p>
      <ul>
        <li>Database query optimization</li>
        <li>API response caching</li>
        <li>CDN integration for static assets</li>
        <li>Background job processing for heavy operations</li>
      </ul>
    `,
    author: 'Michael Rodriguez',
    authorRole: 'Senior Solutions Architect',
    authorImage: '/images/team/michael-rodriguez.jpg',
    authorBio: 'Michael specializes in enterprise architecture and has designed CRM systems for companies ranging from startups to Fortune 500 enterprises.',
    publishedAt: '2024-01-10',
    readTime: '6 min read',
    category: 'CRM Solutions',
    tags: ['CRM', 'Scalability', 'Best Practices', 'Architecture'],
    featured: false,
    image: '/images/blog/crm-scalable.jpg',
    relatedPosts: ['1', '5', '6']
  },
  {
    id: '3',
    title: 'Mobile App Development Trends for 2024',
    excerpt: 'Stay ahead of the curve with the latest trends shaping mobile app development in 2024.',
    content: `
      <h2>The Mobile Landscape in 2024</h2>
      <p>The mobile app development landscape continues to evolve rapidly. With new technologies, changing user expectations, and emerging platforms, developers must stay informed about the latest trends to remain competitive.</p>

      <h3>Cross-Platform Development</h3>
      <p>Frameworks like React Native and Flutter continue to dominate cross-platform development, offering near-native performance with a single codebase. The focus has shifted from "write once, run anywhere" to "write once, run everywhere optimally."</p>

      <h3>AI and Machine Learning Integration</h3>
      <p>Mobile apps are increasingly incorporating AI features:</p>
      <ul>
        <li>Personalized user experiences</li>
        <li>Intelligent chatbots and virtual assistants</li>
        <li>Predictive analytics</li>
        <li>Automated content generation</li>
      </ul>

      <h3>5G and Edge Computing</h3>
      <p>The rollout of 5G networks and edge computing capabilities are enabling new types of mobile applications that require low latency and high bandwidth.</p>

      <h3>Privacy and Security</h3>
      <p>With increasing privacy regulations and user awareness, mobile apps must prioritize security and data protection. Features like on-device processing and secure enclaves are becoming standard.</p>
    `,
    author: 'Emma Thompson',
    authorRole: 'Lead Mobile Developer',
    authorImage: '/images/team/emma-thompson.jpg',
    authorBio: 'Emma has been developing mobile applications for over 8 years and has led teams in creating award-winning apps for iOS and Android.',
    publishedAt: '2024-01-05',
    readTime: '5 min read',
    category: 'Mobile Development',
    tags: ['Mobile', 'Trends', '2024', 'iOS', 'Android'],
    featured: false,
    image: '/images/blog/mobile-trends.jpg',
    relatedPosts: ['1', '4', '5']
  }
];

const BlogPost: React.FC = () => {
  const params = useParams();
  const postId = params.id as string;
  const [post, setPost] = useState<typeof blogPosts[0] | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<typeof blogPosts>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    const foundPost = blogPosts.find(p => p.id === postId);
    if (foundPost) {
      setPost(foundPost);
      // Load related posts
      const related = foundPost.relatedPosts
        .map((id: string) => blogPosts.find(p => p.id === id))
        .filter((post): post is typeof blogPosts[0] => post !== undefined);
      setRelatedPosts(related);
    }
  }, [postId]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
      </div>
    );
  }

  const structuredData = [
    generateArticleSchema({
      headline: post.title,
      description: post.excerpt,
      image: post.image,
      datePublished: post.publishedAt,
      author: post.author,
      url: `/blog/${post.id}`
    }),
    generateBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Blog & Insights', url: '/blog' },
      { name: post.title, url: `/blog/${post.id}` }
    ])
  ];

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/blog/${post.id}` : '';

  const handleShare = (platform: string) => {
    const text = `Check out this article: ${post.title}`;
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(shareUrl);
      // You could show a toast notification here
    } else {
      window.open(urls[platform as keyof typeof urls], '_blank');
    }
  };

  return (
    <>
      <SEOHead
        title={`${post.title} | Limitless Infotech Blog`}
        description={post.excerpt}
        canonical={`/blog/${post.id}`}
        ogImage={post.image}
        structuredData={structuredData}
        articleData={{
          headline: post.title,
          description: post.excerpt,
          author: post.author,
          datePublished: post.publishedAt,
          dateModified: post.publishedAt,
          url: `/blog/${post.id}`,
          image: post.image
        }}
      />

      <article className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-accent via-accent-dark to-accent-orange text-white py-20">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <Link
                href="/blog"
                className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>

              <div className="flex items-center justify-center space-x-4 mb-6">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                  {post.category}
                </span>
                <div className="flex items-center text-sm text-white/80">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="flex items-center text-sm text-white/80">
                  <Clock className="w-4 h-4 mr-1" />
                  {post.readTime}
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                {post.title}
              </h1>

              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-center space-x-6">
                <Image
                  src={post.authorImage}
                  alt={post.author}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full object-cover border-4 border-white/20"
                />
                <div className="text-left">
                  <div className="font-bold text-lg">{post.author}</div>
                  <div className="text-white/80">{post.authorRole}</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-16">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
              >
                {/* Article Header */}
                <div className="p-8 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setIsBookmarked(!isBookmarked)}
                        className={`p-2 rounded-full transition-colors duration-200 ${
                          isBookmarked
                            ? 'bg-accent text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        <Bookmark className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} />
                      </button>
                      <button
                        onClick={() => {
                          setLikes(likes + (hasLiked ? -1 : 1));
                          setHasLiked(!hasLiked);
                        }}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors duration-200 ${
                          hasLiked
                            ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4" fill={hasLiked ? 'currentColor' : 'none'} />
                        <span className="text-sm font-medium">{likes}</span>
                      </button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Share:</span>
                      <button
                        onClick={() => handleShare('twitter')}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors duration-200"
                      >
                        <Twitter className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleShare('facebook')}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors duration-200"
                      >
                        <Facebook className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleShare('linkedin')}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-700 transition-colors duration-200"
                      >
                        <Linkedin className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleShare('copy')}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                      >
                        <Link2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Article Body */}
                <div
                  className="prose prose-lg dark:prose-invert max-w-none p-8"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Author Bio */}
                <div className="p-8 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-start space-x-4">
                    <Image
                      src={post.authorImage}
                      alt={post.author}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        About {post.author}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {post.authorBio}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>{post.authorRole}</span>
                        <span>•</span>
                        <span>15+ years experience</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Related Articles */}
              {relatedPosts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="mt-12"
                >
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Related Articles</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {relatedPosts.map((relatedPost: typeof blogPosts[0]) => (
                      <Link
                        key={relatedPost.id}
                        href={`/blog/${relatedPost.id}`}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
                      >
                        <div className="relative overflow-hidden">
                          <Image
                            src={relatedPost.image}
                            alt={relatedPost.title}
                            width={400}
                            height={160}
                            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 left-3">
                            <span className="px-2 py-1 bg-accent text-white text-xs font-medium rounded-full">
                              {relatedPost.category}
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-accent transition-colors duration-200">
                            {relatedPost.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                            {relatedPost.excerpt}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Comments Section Placeholder */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <MessageCircle className="w-6 h-6 text-accent" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Comments</h3>
                </div>
                <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                  <p>Comments feature coming soon! We'd love to hear your thoughts on this article.</p>
                  <button className="mt-4 px-6 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg transition-colors duration-200">
                    Be the first to comment
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </article>
    </>
  );
};

export default BlogPost;
