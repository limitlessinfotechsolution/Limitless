#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js'
import { Database } from '../src/types/supabase'

// Database connection
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  db: { schema: 'public' }
})

async function seedDatabase() {
  console.log('🌱 Starting database seeding...')

  try {
    // Seed pages
    console.log('📄 Seeding pages...')
    const pages = [
      {
        page_name: 'Home',
        slug: 'home',
        content: JSON.stringify({
          title: 'Welcome to Limitless Infotech',
          subtitle: 'Transforming Ideas into Digital Reality',
          hero_content: 'We specialize in web development, mobile applications, AI automation, and custom software solutions.'
        }),
        is_published: true,
        meta_title: 'Limitless Infotech - Web Development & Software Solutions',
        meta_description: 'Professional web development, mobile apps, AI automation, and custom software solutions. Transform your business with cutting-edge technology.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        page_name: 'About',
        slug: 'about',
        content: JSON.stringify({
          title: 'About Limitless Infotech',
          mission: 'To empower businesses with innovative technology solutions that drive growth and efficiency.',
          vision: 'To be the leading technology partner for businesses seeking digital transformation.',
          values: ['Innovation', 'Quality', 'Integrity', 'Customer Satisfaction']
        }),
        is_published: true,
        meta_title: 'About Us - Limitless Infotech',
        meta_description: 'Learn about our mission, vision, and values at Limitless Infotech. Your trusted partner in digital transformation.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        page_name: 'Services',
        slug: 'services',
        content: JSON.stringify({
          title: 'Our Services',
          services: [
            {
              name: 'Web Development',
              description: 'Custom websites and web applications built with modern technologies.',
              features: ['Responsive Design', 'SEO Optimization', 'Performance Focused']
            },
            {
              name: 'Mobile Applications',
              description: 'Native and cross-platform mobile apps for iOS and Android.',
              features: ['Native Performance', 'Cross-Platform', 'App Store Ready']
            },
            {
              name: 'AI Automation',
              description: 'Intelligent automation solutions using machine learning and AI.',
              features: ['Process Automation', 'Data Analysis', 'Predictive Insights']
            }
          ]
        }),
        is_published: true,
        meta_title: 'Services - Web Development, Mobile Apps, AI Solutions',
        meta_description: 'Explore our comprehensive technology services including web development, mobile applications, and AI automation solutions.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]

    const { data: pagesData, error: pagesError } = await supabase
      .from('pages')
      .upsert(pages, { onConflict: 'slug' })
      .select()

    if (pagesError) {
      console.error('❌ Error seeding pages:', pagesError)
    } else {
      console.log(`✅ Seeded ${pagesData?.length || 0} pages`)
    }

    // Seed services
    console.log('🔧 Seeding services...')
    const services = [
      {
        name: 'Web Development',
        description: 'Custom websites and web applications built with modern technologies like React, Next.js, and Node.js.',
        icon: 'Globe',
        features: ['Responsive Design', 'SEO Optimization', 'Performance Focused', 'Modern Frameworks'],
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        name: 'Mobile Applications',
        description: 'Native and cross-platform mobile applications for iOS and Android platforms.',
        icon: 'Smartphone',
        features: ['Native Performance', 'Cross-Platform', 'App Store Ready', 'Offline Support'],
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        name: 'AI Automation',
        description: 'Intelligent automation solutions using machine learning and artificial intelligence.',
        icon: 'Brain',
        features: ['Process Automation', 'Data Analysis', 'Predictive Insights', 'Machine Learning'],
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        name: 'Custom Software',
        description: 'Tailored software solutions designed to meet your specific business requirements.',
        icon: 'Code',
        features: ['Custom Development', 'API Integration', 'Database Design', 'Cloud Solutions'],
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]

    const { data: servicesData, error: servicesError } = await supabase
      .from('services')
      .upsert(services, { onConflict: 'name' })
      .select()

    if (servicesError) {
      console.error('❌ Error seeding services:', servicesError)
    } else {
      console.log(`✅ Seeded ${servicesData?.length || 0} services`)
    }

    // Seed testimonials
    console.log('💬 Seeding testimonials...')
    const testimonials = [
      {
        name: 'Sarah Johnson',
        position: 'CEO',
        company: 'TechStart Inc.',
        content: 'Limitless Infotech transformed our online presence completely. Their web development expertise and attention to detail exceeded our expectations.',
        rating: 5,
        is_featured: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        name: 'Michael Chen',
        position: 'CTO',
        company: 'InnovateLab',
        content: 'The mobile app they developed for us has been a game-changer. Excellent performance, great user experience, and outstanding support.',
        rating: 5,
        is_featured: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        name: 'Emily Rodriguez',
        position: 'Operations Manager',
        company: 'GrowthCorp',
        content: 'Their AI automation solutions helped us streamline our processes and increase efficiency by 40%. Highly recommend their services.',
        rating: 5,
        is_featured: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]

    const { data: testimonialsData, error: testimonialsError } = await supabase
      .from('testimonials')
      .upsert(testimonials, { onConflict: 'name,company' })
      .select()

    if (testimonialsError) {
      console.error('❌ Error seeding testimonials:', testimonialsError)
    } else {
      console.log(`✅ Seeded ${testimonialsData?.length || 0} testimonials`)
    }

    // Seed knowledge base for chatbot
    console.log('🧠 Seeding knowledge base...')
    const knowledgeBase = [
      {
        title: 'Web Development Services',
        content: 'We offer comprehensive web development services including responsive websites, e-commerce platforms, web applications, and API development using modern technologies like React, Next.js, Node.js, and cloud platforms.',
        category: 'services',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        title: 'Mobile App Development',
        content: 'Our mobile development expertise covers native iOS and Android apps, cross-platform solutions using React Native and Flutter, and progressive web apps with offline capabilities.',
        category: 'services',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        title: 'AI and Automation',
        content: 'We implement AI-powered solutions including machine learning models, process automation, intelligent chatbots, data analysis, and predictive analytics to help businesses optimize operations.',
        category: 'services',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        title: 'Company Information',
        content: 'Limitless Infotech is a technology company specializing in web development, mobile applications, AI automation, and custom software solutions. We help businesses transform their operations with cutting-edge technology.',
        category: 'company',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]

    const { data: kbData, error: kbError } = await supabase
      .from('knowledge_base')
      .upsert(knowledgeBase, { onConflict: 'title' })
      .select()

    if (kbError) {
      console.error('❌ Error seeding knowledge base:', kbError)
    } else {
      console.log(`✅ Seeded ${kbData?.length || 0} knowledge base entries`)
    }

    // Seed projects
    console.log('📁 Seeding projects...')
    const projects = [
      {
        title: 'E-Commerce Platform for Retail Chain',
        description: 'A comprehensive e-commerce solution with inventory management, payment processing, and customer analytics for a growing retail business.',
        industry: 'Retail',
        service_type: 'Web Development',
        project_size: 'Large',
        image: '/images/project-ecommerce.jpg',
        challenge: 'The client needed a scalable e-commerce platform that could handle high traffic, integrate with their existing inventory system, and provide real-time analytics.',
        solution: 'We built a custom e-commerce platform using Next.js, Stripe for payments, and Supabase for database management. The solution includes real-time inventory tracking, automated order processing, and comprehensive analytics dashboard.',
        tech_stack: ['Next.js', 'TypeScript', 'Stripe', 'Supabase', 'Tailwind CSS', 'Framer Motion'],
        results: ['300% increase in online sales', '50% reduction in order processing time', 'Real-time inventory accuracy', 'Mobile-responsive design'],
        client_review: 'The new platform has transformed our business. Sales have increased significantly and our customers love the smooth shopping experience.',
        architecture_diagram: '/images/architecture-ecommerce.svg',
        screenshots: ['/images/ecommerce-home.jpg', '/images/ecommerce-product.jpg', '/images/ecommerce-cart.jpg'],
        timeline: '4 months',
        team_size: '6 developers',
        budget: 'Contact for details',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        title: 'Healthcare Management System',
        description: 'A secure patient management system with appointment scheduling, medical records, and telemedicine capabilities for a medical practice.',
        industry: 'Healthcare',
        service_type: 'Custom Software',
        project_size: 'Medium',
        image: '/images/project-healthcare.jpg',
        challenge: 'The medical practice needed a HIPAA-compliant system to manage patient records, appointments, and telemedicine consultations securely.',
        solution: 'Developed a comprehensive healthcare management system with encrypted data storage, role-based access control, and integrated telemedicine features using React, Node.js, and PostgreSQL.',
        tech_stack: ['React', 'Node.js', 'PostgreSQL', 'Socket.io', 'JWT', 'AWS'],
        results: ['100% HIPAA compliance', '60% reduction in administrative time', 'Improved patient satisfaction', 'Secure telemedicine integration'],
        client_review: 'This system has revolutionized how we manage patient care. The telemedicine feature has been especially valuable during the pandemic.',
        architecture_diagram: '/images/architecture-healthcare.svg',
        screenshots: ['/images/healthcare-dashboard.jpg', '/images/healthcare-appointments.jpg', '/images/healthcare-records.jpg'],
        timeline: '6 months',
        team_size: '8 developers',
        budget: 'Contact for details',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        title: 'AI-Powered Logistics Optimization',
        description: 'An intelligent logistics platform using machine learning to optimize delivery routes and predict demand for a transportation company.',
        industry: 'Logistics',
        service_type: 'AI Integration',
        project_size: 'Large',
        image: '/images/project-logistics.jpg',
        challenge: 'The logistics company faced inefficiencies in route planning and struggled with demand forecasting, leading to increased costs and delayed deliveries.',
        solution: 'Implemented an AI-powered platform using Python, TensorFlow, and React. The system uses machine learning algorithms to optimize routes in real-time and predict demand patterns.',
        tech_stack: ['Python', 'TensorFlow', 'React', 'FastAPI', 'PostgreSQL', 'Docker'],
        results: ['25% reduction in fuel costs', '40% improvement in delivery times', 'AI-driven demand forecasting', 'Real-time route optimization'],
        client_review: 'The AI system has transformed our operations. We\'re now more efficient and can better serve our customers with accurate delivery times.',
        architecture_diagram: '/images/architecture-logistics.svg',
        screenshots: ['/images/logistics-dashboard.jpg', '/images/logistics-routes.jpg', '/images/logistics-analytics.jpg'],
        timeline: '8 months',
        team_size: '10 developers',
        budget: 'Contact for details',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]

    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .upsert(projects, { onConflict: 'title' })
      .select()

    if (projectsError) {
      console.error('❌ Error seeding projects:', projectsError)
    } else {
      console.log(`✅ Seeded ${projectsData?.length || 0} projects`)
    }

    // Seed FAQ
    console.log('❓ Seeding FAQ...')
    const faqs = [
      {
        question: 'What technologies do you specialize in?',
        answer: 'We specialize in modern web technologies including React, Next.js, Node.js, TypeScript, and cloud platforms like AWS, Vercel, and Supabase. For mobile development, we work with React Native, Flutter, and native iOS/Android development.',
        category: 'technology',
        is_published: true,
        sort_order: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        question: 'How long does a typical project take?',
        answer: 'Project timelines vary depending on complexity and scope. A simple website might take 2-4 weeks, while a complex web application or mobile app could take 3-6 months. We provide detailed timelines during our initial consultation.',
        category: 'process',
        is_published: true,
        sort_order: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        question: 'Do you provide ongoing support and maintenance?',
        answer: 'Yes, we offer comprehensive maintenance and support packages. This includes bug fixes, security updates, performance optimization, and feature enhancements to ensure your application continues to perform optimally.',
        category: 'support',
        is_published: true,
        sort_order: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        question: 'What is your development process?',
        answer: 'Our development process follows agile methodologies: 1) Discovery & Planning, 2) Design & Prototyping, 3) Development & Testing, 4) Deployment & Launch, 5) Maintenance & Support. We maintain transparent communication throughout the project.',
        category: 'process',
        is_published: true,
        sort_order: 4,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]

    const { data: faqData, error: faqError } = await supabase
      .from('faqs')
      .upsert(faqs, { onConflict: 'question' })
      .select()

    if (faqError) {
      console.error('❌ Error seeding FAQ:', faqError)
    } else {
      console.log(`✅ Seeded ${faqData?.length || 0} FAQ entries`)
    }

    console.log('🎉 Database seeding completed successfully!')

  } catch (error) {
    console.error('❌ Error during database seeding:', error)
    process.exit(1)
  }
}

// Run the seeding script
seedDatabase()
  .then(() => {
    console.log('✅ Seeding script completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Seeding script failed:', error)
    process.exit(1)
  })
