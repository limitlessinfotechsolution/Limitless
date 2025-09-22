-- =============================================================================
-- COMPLETE SUPABASE SCHEMA FOR LIMITLESS INFOTECH
-- Generated: September 2025
-- Description: Complete production-ready database schema with all tables, relationships, policies, and functions
-- =============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgvector";

-- =============================================================================
-- CUSTOM ENUMS
-- =============================================================================

-- User roles enum
CREATE TYPE user_role AS ENUM ('user', 'moderator', 'admin', 'super_admin');

-- Lead status enum
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost', 'archived');

-- Project status enum
CREATE TYPE project_status AS ENUM ('planning', 'in_progress', 'review', 'completed', 'on_hold', 'cancelled');

-- Task priority enum
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- Email status enum
CREATE TYPE email_status AS ENUM ('draft', 'scheduled', 'sending', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'complained', 'unsubscribed');

-- Chat sender enum
CREATE TYPE chat_sender AS ENUM ('user', 'bot', 'system', 'admin');

-- Feedback rating enum
CREATE TYPE feedback_rating AS ENUM ('positive', 'negative', 'neutral');

-- =============================================================================
-- CORE TABLES
-- =============================================================================

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role user_role DEFAULT 'user'::user_role,
    avatar_url TEXT,
    phone TEXT,
    bio TEXT,
    company TEXT,
    job_title TEXT,
    location TEXT,
    timezone TEXT DEFAULT 'UTC',
    preferred_language TEXT DEFAULT 'en',
    email_notifications BOOLEAN DEFAULT true,
    marketing_emails BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP WITH TIME ZONE,
    login_count INTEGER DEFAULT 0,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_by UUID REFERENCES public.profiles(id),
    updated_by UUID REFERENCES public.profiles(id),

    -- Constraints
    CONSTRAINT profiles_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT profiles_phone_format CHECK (phone IS NULL OR phone ~* '^\+?[0-9\s\-\(\)]{10,20}$')
);

-- Services table
CREATE TABLE IF NOT EXISTS public.services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT,
    benefits TEXT NOT NULL,
    features JSONB NOT NULL DEFAULT '[]',
    technologies JSONB NOT NULL DEFAULT '[]',
    pricing JSONB,
    pricing_model TEXT CHECK (pricing_model IN ('fixed', 'hourly', 'project_based', 'subscription')),
    starting_price DECIMAL(10,2),
    currency TEXT DEFAULT 'USD',
    delivery_time TEXT,
    icon TEXT NOT NULL,
    image_url TEXT,
    link TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_by UUID REFERENCES public.profiles(id),
    updated_by UUID REFERENCES public.profiles(id),

    -- Constraints
    CONSTRAINT services_slug_format CHECK (slug ~* '^[a-z0-9\-]+$'),
    CONSTRAINT services_display_order_positive CHECK (display_order >= 0)
);

-- Team members table
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL,
    bio TEXT NOT NULL,
    short_bio TEXT,
    image TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    twitter_url TEXT,
    website_url TEXT,
    skills JSONB DEFAULT '[]',
    experience_years INTEGER,
    certifications JSONB DEFAULT '[]',
    languages JSONB DEFAULT '[]',
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    hire_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_by UUID REFERENCES public.profiles(id),
    updated_by UUID REFERENCES public.profiles(id),

    -- Constraints
    CONSTRAINT team_members_slug_format CHECK (slug ~* '^[a-z0-9\-]+$'),
    CONSTRAINT team_members_email_format CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT team_members_display_order_positive CHECK (display_order >= 0),
    CONSTRAINT team_members_experience_positive CHECK (experience_years IS NULL OR experience_years >= 0)
);

-- Projects table (portfolio)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT,
    challenge TEXT NOT NULL,
    solution TEXT NOT NULL,
    results JSONB NOT NULL DEFAULT '{}',
    tech_stack JSONB NOT NULL DEFAULT '[]',
    industry TEXT NOT NULL,
    service_type TEXT NOT NULL,
    project_size TEXT NOT NULL CHECK (project_size IN ('small', 'medium', 'large', 'enterprise')),
    duration TEXT,
    budget_range TEXT,
    client_name TEXT,
    client_logo TEXT,
    client_industry TEXT,
    client_size TEXT,
    website_url TEXT,
    github_url TEXT,
    case_study_url TEXT,
    image TEXT NOT NULL,
    gallery JSONB DEFAULT '[]',
    testimonial_id UUID,
    status project_status DEFAULT 'completed'::project_status,
    is_published BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    featured_order INTEGER DEFAULT 0,
    version INTEGER DEFAULT 1,
    display_order INTEGER DEFAULT 0,
    start_date DATE,
    completion_date DATE,
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_by UUID REFERENCES public.profiles(id),
    updated_by UUID REFERENCES public.profiles(id),

    -- Constraints
    CONSTRAINT projects_slug_format CHECK (slug ~* '^[a-z0-9\-]+$'),
    CONSTRAINT projects_display_order_positive CHECK (display_order >= 0),
    CONSTRAINT projects_featured_order_positive CHECK (featured_order >= 0),
    CONSTRAINT projects_version_positive CHECK (version > 0),
    CONSTRAINT projects_date_order CHECK (start_date IS NULL OR completion_date IS NULL OR start_date <= completion_date)
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    content TEXT NOT NULL,
    short_content TEXT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    image TEXT,
    logo TEXT,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    industry TEXT,
    project_type TEXT,
    is_featured BOOLEAN DEFAULT false,
    approved BOOLEAN DEFAULT false,
    approved_by UUID REFERENCES public.profiles(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    display_order INTEGER DEFAULT 0,
    source TEXT DEFAULT 'website' CHECK (source IN ('website', 'linkedin', 'google', 'clutch', 'manual')),
    review_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_by UUID REFERENCES public.profiles(id),
    updated_by UUID REFERENCES public.profiles(id),

    -- Constraints
    CONSTRAINT testimonials_display_order_positive CHECK (display_order >= 0)
);

-- Pages table (for CMS)
CREATE TABLE IF NOT EXISTS public.pages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    page_name TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content JSONB,
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT[],
    featured_image TEXT,
    template TEXT DEFAULT 'default',
    parent_page_id UUID REFERENCES public.pages(id) ON DELETE SET NULL,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    published_by UUID REFERENCES public.profiles(id),
    version INTEGER DEFAULT 1,
    revision_history JSONB DEFAULT '[]',
    seo_score INTEGER DEFAULT 0 CHECK (seo_score >= 0 AND seo_score <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_by UUID REFERENCES public.profiles(id),
    updated_by UUID REFERENCES public.profiles(id),

    -- Constraints
    CONSTRAINT pages_slug_format CHECK (slug ~* '^[a-z0-9\-\/]+$'),
    CONSTRAINT pages_version_positive CHECK (version > 0)
);

-- FAQs table
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT,
    tags TEXT[] DEFAULT '{}',
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    helpful_votes INTEGER DEFAULT 0,
    total_votes INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    last_viewed_at TIMESTAMP WITH TIME ZONE,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT