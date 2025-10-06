-- =============================================================================
-- DATABASE RESET AND RECREATION SCRIPT
-- =============================================================================
-- This script resets the entire Supabase database by dropping all existing
-- tables and types in the public schema, then recreates the comprehensive
-- schema from scratch.
-- =============================================================================

-- STEP 1: Drop all existing tables and types in public schema
DO $$ DECLARE
    r RECORD;
BEGIN
    -- Drop all tables in public schema (in reverse dependency order if needed, but CASCADE handles it)
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;

    -- Drop all enums in public schema
    FOR r IN (SELECT typname FROM pg_type WHERE typtype = 'e' AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) LOOP
        EXECUTE 'DROP TYPE IF EXISTS public.' || quote_ident(r.typname) || ' CASCADE';
    END LOOP;
END $$;

-- =============================================================================
-- STEP 2: Recreate the comprehensive schema
-- =============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgvector";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pg_buffercache";

-- =============================================================================
-- CUSTOM TYPES AND ENUMS
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_by UUID REFERENCES public.profiles(id),
    updated_by UUID REFERENCES public.profiles(id),

    -- Constraints
    CONSTRAINT faqs_display_order_positive CHECK (display_order >= 0),
    CONSTRAINT faqs_votes_positive CHECK (helpful_votes >= 0 AND total_votes >= 0),
    CONSTRAINT faqs_view_count_positive CHECK (view_count >= 0)
);

-- =============================================================================
-- BUSINESS & LEAD MANAGEMENT
-- =============================================================================

-- Leads table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    business_basics JSONB,
    project_details JSONB,
    timeline_budget JSONB,
    contact_info JSONB,
    additional_requirements TEXT,
    source_page TEXT,
    source_url TEXT,
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_term TEXT,
    utm_content TEXT,
    ip_address INET,
    user_agent TEXT,
    geolocation JSONB,
    lead_score INTEGER DEFAULT 0,
    lead_status lead_status DEFAULT 'new'::lead_status,
    priority task_priority DEFAULT 'medium'::task_priority,
    assigned_to UUID REFERENCES public.profiles(id),
    assigned_at TIMESTAMP WITH TIME ZONE,
    assigned_by UUID REFERENCES public.profiles(id),
    notes TEXT,
    internal_notes TEXT,
    follow_up_date TIMESTAMP WITH TIME ZONE,
    last_contact_date TIMESTAMP WITH TIME ZONE,
    next_follow_up_date TIMESTAMP WITH TIME ZONE,
    estimated_value DECIMAL(12,2),
    currency TEXT DEFAULT 'USD',
    conversion_probability INTEGER DEFAULT 0 CHECK (conversion_probability >= 0 AND conversion_probability <= 100),
    tags TEXT[] DEFAULT '{}',
    custom_fields JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_by UUID REFERENCES public.profiles(id),
    updated_by UUID REFERENCES public.profiles(id),

    -- Constraints
    CONSTRAINT leads_lead_score_range CHECK (lead_score >= 0 AND lead_score <= 100),
    CONSTRAINT leads_estimated_value_positive CHECK (estimated_value IS NULL OR estimated_value >= 0)
);

-- Quotations table
CREATE TABLE IF NOT EXISTS public.quotations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
    quotation_number TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    services JSONB DEFAULT '[]',
    total_amount DECIMAL(12,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    tax_rate DECIMAL(5,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    final_amount DECIMAL(12,2) NOT NULL,
    valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
    payment_terms TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired')),
    sent_at TIMESTAMP WITH TIME ZONE,
    viewed_at TIMESTAMP WITH TIME ZONE,
    accepted_at TIMESTAMP WITH TIME ZONE,
    rejected_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    notes TEXT,
    revision_number INTEGER DEFAULT 1,
    parent_quotation_id UUID REFERENCES public.quotations(id),
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    -- Constraints
    CONSTRAINT quotations_total_amount_positive CHECK (total_amount >= 0),
    CONSTRAINT quotations_final_amount_positive CHECK (final_amount >= 0),
    CONSTRAINT quotations_tax_rate_range CHECK (tax_rate >= 0 AND tax_rate <= 100),
    CONSTRAINT quotations_revision_number_positive CHECK (revision_number > 0),
    CONSTRAINT quotations_valid_dates CHECK (valid_until > created_at)
);

-- =============================================================================
-- AI CHATBOT SYSTEM
-- =============================================================================

-- Knowledge base table
CREATE TABLE IF NOT EXISTS public.knowledge_base (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    category TEXT,
    sub_category TEXT,
    tags TEXT[] DEFAULT '{}',
    embedding VECTOR(1536), -- Assuming OpenAI embeddings
    source_type TEXT DEFAULT 'manual' CHECK (source_type IN ('manual', 'web_scraped', 'document', 'faq', 'api', 'generated')),
    source_url TEXT,
    source_document_id TEXT,
    content_hash TEXT,
    word_count INTEGER,
    reading_time_minutes INTEGER,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    priority INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    helpful_votes INTEGER DEFAULT 0,
    total_votes INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    -- Constraints
    CONSTRAINT knowledge_base_word_count_positive CHECK (word_count IS NULL OR word_count > 0),
    CONSTRAINT knowledge_base_reading_time_positive CHECK (reading_time_minutes IS NULL OR reading_time_minutes > 0),
    CONSTRAINT knowledge_base_view_count_positive CHECK (view_count >= 0),
    CONSTRAINT knowledge_base_votes_positive CHECK (helpful_votes >= 0 AND total_votes >= 0)
);

-- Chat sessions table
CREATE TABLE IF NOT EXISTS public.chat_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_token TEXT UNIQUE,
    user_info JSONB,
    conversation_summary TEXT,
    topic TEXT,
    sentiment TEXT,
    is_active BOOLEAN DEFAULT true,
    message_count INTEGER DEFAULT 0,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    total_duration_seconds INTEGER DEFAULT 0,
    user_satisfaction_rating INTEGER CHECK (user_satisfaction_rating IS NULL OR (user_satisfaction_rating >= 1 AND user_satisfaction_rating <= 5)),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    -- Constraints
    CONSTRAINT chat_sessions_message_count_positive CHECK (message_count >= 0),
    CONSTRAINT chat_sessions_duration_positive CHECK (total_duration_seconds >= 0)
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    message_id TEXT UNIQUE,
    sender chat_sender NOT NULL,
    content TEXT NOT NULL,
    structured_data JSONB,
    suggestions TEXT[],
    sources JSONB DEFAULT '[]',
    response_time_ms INTEGER,
    token_count INTEGER,
    model_used TEXT,
    confidence_score DECIMAL(3,2),
    is_helpful BOOLEAN,
    feedback_provided BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    -- Constraints
    CONSTRAINT chat_messages_response_time_positive CHECK (response_time_ms IS NULL OR response_time_ms >= 0),
    CONSTRAINT chat_messages_token_count_positive CHECK (token_count IS NULL OR token_count >= 0),
    CONSTRAINT chat_messages_confidence_range CHECK (confidence_score IS NULL OR (confidence_score >= 0 AND confidence_score <= 1))
);

-- Chat feedback table
CREATE TABLE IF NOT EXISTS public.chat_feedback (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    message_id UUID NOT NULL REFERENCES public.chat_messages(id) ON DELETE CASCADE,
    rating feedback_rating NOT NULL,
    feedback_text TEXT,
    categories TEXT[] DEFAULT '{}',
    is_resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =============================================================================
-- ANALYTICS & LOGGING
-- =============================================================================

-- Analytics events table
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_type TEXT NOT NULL,
    event_category TEXT,
    event_action TEXT,
    event_label TEXT,
    event_value INTEGER,
    event_data JSONB NOT NULL DEFAULT '{}',
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id TEXT,
    page_url TEXT,
    page_title TEXT,
    referrer TEXT,
    user_agent TEXT,
    ip_address INET,
    device_info JSONB,
    geolocation JSONB,
    campaign_info JSONB,
    custom_parameters JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    -- Constraints
    CONSTRAINT analytics_events_event_value_positive CHECK (event_value IS NULL OR event_value >= 0)
);

-- Email logs table
CREATE TABLE IF NOT EXISTS public.email_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    to_email TEXT NOT NULL,
    from_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    template_id TEXT,
    template_data JSONB,
    personalization_data JSONB,
    status email_status NOT NULL,
    provider_message_id TEXT,
    provider_response JSONB,
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    bounced_at TIMESTAMP WITH TIME ZONE,
    complained_at TIMESTAMP WITH TIME ZONE,
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    bounce_reason TEXT,
    bounce_type TEXT,
    click_url TEXT,
    user_agent TEXT,
    ip_address INET,
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    -- Constraints
    CONSTRAINT email_logs_retry_count_positive CHECK (retry_count >= 0)
);

-- API logs table
CREATE TABLE IF NOT EXISTS public.api_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    method TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    status_code INTEGER NOT NULL,
    request_headers JSONB,
    request_body JSONB,
    response_body JSONB,
    response_time_ms INTEGER,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    error_message TEXT,
    stack_trace TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    -- Constraints
    CONSTRAINT api_logs_status_code_range CHECK (status_code >= 100 AND status_code <= 599),
    CONSTRAINT api_logs_response_time_positive CHECK (response_time_ms IS NULL OR response_time_ms >= 0)
);

-- Error logs table
CREATE TABLE IF NOT EXISTS public.error_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    error_type TEXT NOT NULL,
    error_message TEXT NOT NULL,
    error_code TEXT,
    stack_trace TEXT,
    context_data JSONB,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id TEXT,
    page_url TEXT,
    user_agent TEXT,
    ip_address INET,
    severity TEXT DEFAULT 'error' CHECK (severity IN ('debug', 'info', 'warning', 'error', 'critical')),
    is_resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Performance logs table
CREATE TABLE IF NOT EXISTS public.performance_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    metric_type TEXT NOT NULL,
    metric_name TEXT NOT NULL,
    metric_value DECIMAL(10,4),
    metric_unit TEXT,
    context_data JSONB,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id TEXT,
    page_url TEXT,
    user_agent TEXT,
    device_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    -- Constraints
    CONSTRAINT performance_logs_metric_value_positive CHECK (metric_value IS NULL OR metric_value >= 0)
);

-- File uploads table
CREATE TABLE IF NOT EXISTS public.file_uploads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    file_name TEXT NOT NULL,
    original_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    checksum TEXT,
    storage_provider TEXT DEFAULT 'supabase',
    bucket_name TEXT,
    is_public BOOLEAN DEFAULT true,
    is_temporary BOOLEAN DEFAULT false,
    expires_at TIMESTAMP WITH TIME ZONE,
    uploaded_by UUID REFERENCES public.profiles(id),
    entity_type TEXT CHECK (entity_type IN ('project', 'testimonial', 'team_member', 'page', 'service', 'quotation', 'document')),
    entity_id UUID,
    alt_text TEXT,
    caption TEXT,
    metadata JSONB DEFAULT '{}',
    download_count INTEGER DEFAULT 0,
    last_downloaded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    -- Constraints
    CONSTRAINT file_uploads_file_size_positive CHECK (file_size > 0),
    CONSTRAINT file_uploads_download_count_positive CHECK (download_count >= 0)
);

-- =============================================================================
-- NOTIFICATIONS & COMMUNICATION
-- =============================================================================

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error', 'system')),
    category TEXT,
    priority task_priority DEFAULT 'medium'::task_priority,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    action_url TEXT,
    action_text TEXT,
    action_type TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- User preferences table
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    preference_key TEXT NOT NULL,
    preference_value JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    UNIQUE(user_id, preference_key)
);

-- =============================================================================
-- A/B TESTING & MARKETING
-- =============================================================================

-- A/B tests table
CREATE TABLE IF NOT EXISTS public.ab_tests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    page_url TEXT NOT NULL,
    element_selector TEXT NOT NULL,
    test_type TEXT DEFAULT 'content' CHECK (test_type IN ('content', 'design', 'functionality', 'pricing')),
    variant_a JSONB NOT NULL,
    variant_b JSONB NOT NULL,
    variant_a_weight INTEGER DEFAULT 50,
    variant_b_weight INTEGER DEFAULT 50,
    is_active BOOLEAN DEFAULT false,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    target_audience JSONB,
    success_metric TEXT,
    minimum_sample_size INTEGER DEFAULT 1000,
    confidence_level DECIMAL(3,2) DEFAULT 0.95,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    -- Constraints
    CONSTRAINT ab_tests_weights_positive CHECK (variant_a_weight > 0 AND variant_b_weight > 0),
    CONSTRAINT ab_tests_weights_sum CHECK (variant_a_weight + variant_b_weight = 100),
    CONSTRAINT ab_tests_date_order CHECK (start_date IS NULL OR end_date IS NULL OR start_date < end_date),
    CONSTRAINT ab_tests_confidence_range CHECK (confidence_level >= 0 AND confidence_level <= 1),
    CONSTRAINT ab_tests_sample_size_positive CHECK (minimum_sample_size > 0)
);

-- A/B test results table
CREATE TABLE IF NOT EXISTS public.ab_test_results (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    test_id UUID NOT NULL REFERENCES public.ab_tests(id) ON DELETE CASCADE,
    variant TEXT NOT NULL CHECK (variant IN ('A', 'B')),
    views INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    bounce_rate DECIMAL(5,2),
    avg_session_duration INTEGER,
    revenue DECIMAL(10,2) DEFAULT 0,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    -- Constraints
    CONSTRAINT ab_test_results_views_positive CHECK (views >= 0),
    CONSTRAINT ab_test_results_clicks_positive CHECK (clicks >= 0),
    CONSTRAINT ab_test_results_conversions_positive CHECK (conversions >= 0),
    CONSTRAINT ab_test_results_bounce_rate_range CHECK (bounce_rate IS NULL OR (bounce_rate >= 0 AND bounce_rate <= 100)),
    CONSTRAINT ab_test_results_session_duration_positive CHECK (avg_session_duration IS NULL OR avg_session_duration >= 0),
    CONSTRAINT ab_test_results_revenue_positive CHECK (revenue >= 0)
);

-- =============================================================================
-- EMAIL MARKETING
-- =============================================================================

-- Subscribers table
CREATE TABLE IF NOT EXISTS public.subscribers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    first_name TEXT,
    last_name TEXT,
    full_name TEXT GENERATED ALWAYS AS (
        CASE
            WHEN first_name IS NOT NULL AND last_name IS NOT NULL THEN first_name || ' ' || last_name
            WHEN first_name IS NOT NULL THEN first_name
            WHEN last_name IS NOT NULL THEN last_name
            ELSE NULL
        END
    ) STORED,
    phone TEXT,
    company TEXT,
    job_title TEXT,
    interests TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    source TEXT,
    source_details JSONB,
    subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'unsubscribed', 'bounced', 'complained')),
    email_verified BOOLEAN DEFAULT false,
    verification_token TEXT,
    verification_sent_at TIMESTAMP WITH TIME ZONE,
    verified_at TIMESTAMP WITH TIME ZONE,
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    unsubscribe_reason TEXT,
    bounced_at TIMESTAMP WITH TIME ZONE,
    bounce_reason TEXT,
    complained_at TIMESTAMP WITH TIME ZONE,
    last_activity_at TIMESTAMP WITH TIME ZONE,
    engagement_score INTEGER DEFAULT 0,
    custom_fields JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    -- Constraints
    CONSTRAINT subscribers_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT subscribers_phone_format CHECK (phone IS NULL OR phone ~* '^\+?[0-9\s\-\(\)]{10,20}$'),
    CONSTRAINT subscribers_engagement_score_range CHECK (engagement_score >= 0 AND engagement_score <= 100)
);

-- Email campaigns table
CREATE TABLE IF NOT EXISTS public.email_campaigns (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    preview_text TEXT,
    content TEXT NOT NULL,
    content_html TEXT,
    template_id TEXT,
    campaign_type TEXT DEFAULT 'newsletter' CHECK (campaign_type IN ('newsletter', 'promotional', 'transactional', 'welcome', 'reengagement')),
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'cancelled', 'failed')),
    scheduled_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    target_audience JSONB,
    segment_filters JSONB,
    total_recipients INTEGER DEFAULT 0,
    sent_count INTEGER DEFAULT 0,
    delivered_count INTEGER DEFAULT 0,
    opened_count INTEGER DEFAULT 0,
    clicked_count INTEGER DEFAULT 0,
    bounced_count INTEGER DEFAULT 0,
    complained_count INTEGER DEFAULT 0,
    unsubscribed_count INTEGER DEFAULT 0,
    revenue DECIMAL(10,2) DEFAULT 0,
    performance_metrics JSONB DEFAULT '{}',
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    -- Constraints
    CONSTRAINT email_campaigns_counts_positive CHECK (
        sent_count >= 0 AND delivered_count >= 0 AND opened_count >= 0 AND
        clicked_count >= 0 AND bounced_count >= 0 AND complained_count >= 0 AND
        unsubscribed_count >= 0
    ),
    CONSTRAINT email_campaigns_revenue_positive CHECK (revenue >= 0)
);

-- Email campaign recipients table
CREATE TABLE IF NOT EXISTS public.email_campaign_recipients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    campaign_id UUID NOT NULL REFERENCES public.email_campaigns(id) ON DELETE CASCADE,
    subscriber_id UUID NOT NULL REFERENCES public.subscribers(id) ON DELETE CASCADE,
    status email_status DEFAULT 'sent'::email_status,
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    bounced_at TIMESTAMP WITH TIME ZONE,
    complained_at TIMESTAMP WITH TIME ZONE,
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    UNIQUE(campaign_id, subscriber_id)
);

-- =============================================================================
-- PROJECT MANAGEMENT
-- =============================================================================

-- Project tasks table
CREATE TABLE IF NOT EXISTS public.project_tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'completed', 'cancelled')),
    priority task_priority DEFAULT 'medium'::task_priority,
    assigned_to UUID REFERENCES public.profiles(id),
    assigned_at TIMESTAMP WITH TIME ZONE,
    assigned_by UUID REFERENCES public.profiles(id),
    due_date TIMESTAMP WITH TIME ZONE,
    estimated_hours DECIMAL(6,2),
    actual_hours DECIMAL(6,2),
    completed_at TIMESTAMP WITH TIME ZONE,
    completed_by UUID REFERENCES public.profiles(id),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    dependencies UUID[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    attachments JSONB DEFAULT '[]',
    comments JSONB DEFAULT '[]',
    time_entries JSONB DEFAULT '[]',
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    -- Constraints
    CONSTRAINT project_tasks_estimated_hours_positive CHECK (estimated_hours IS NULL OR estimated_hours > 0),
    CONSTRAINT project_tasks_actual_hours_positive CHECK (actual_hours IS NULL OR actual_hours >= 0),
    CONSTRAINT project_tasks_date_order CHECK (completed_at IS NULL OR created_at <= completed_at)
);

-- Time entries table
CREATE TABLE IF NOT EXISTS public.time_entries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    task_id UUID REFERENCES public.project_tasks(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    description TEXT,
    hours DECIMAL(4,2) NOT NULL,
    date_worked DATE NOT NULL,
    billable BOOLEAN DEFAULT true,
    billable_rate DECIMAL(8,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    -- Constraints
    CONSTRAINT time_entries_hours_positive CHECK (hours > 0 AND hours <= 24),
    CONSTRAINT time_entries_billable_rate_positive CHECK (billable_rate IS NULL OR billable_rate >= 0)
);

-- =============================================================================
-- WEBMAIL SYSTEM
-- =============================================================================

-- Webmail accounts table
CREATE TABLE IF NOT EXISTS public.webmail_accounts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    email_address TEXT NOT NULL UNIQUE,
    display_name TEXT,
    signature TEXT,
    signature_html TEXT,
    auto_reply_enabled BOOLEAN DEFAULT false,
    auto_reply_message TEXT,
    auto_reply_subject TEXT,
    vacation_mode BOOLEAN DEFAULT false,
    vacation_start_date DATE,
    vacation_end_date DATE,
    vacation_message TEXT,
    forwarding_enabled BOOLEAN DEFAULT false,
    forwarding_address TEXT,
    spam_filter_level TEXT DEFAULT 'medium' CHECK (spam_filter_level IN ('low', 'medium', 'high', 'strict')),
    is_active BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    sync_status TEXT DEFAULT 'idle' CHECK (sync_status IN ('idle', 'syncing', 'error')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    -- Constraints
    CONSTRAINT webmail_accounts_email_format CHECK (email_address ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT webmail_accounts_forwarding_format CHECK (forwarding_address IS NULL OR forwarding_address ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT webmail_accounts_vacation_dates CHECK (
        (vacation_start_date IS NULL AND vacation_end_date IS NULL) OR
        (vacation_start_date IS NOT NULL AND vacation_end_date IS NOT NULL AND vacation_start_date <= vacation_end_date)
    )
);

-- Webmail messages table
CREATE TABLE IF NOT EXISTS public.webmail_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    account_id UUID NOT NULL REFERENCES public.webmail_accounts(id) ON DELETE CASCADE,
    message_id TEXT UNIQUE,
    thread_id TEXT,
    from_address TEXT NOT NULL,
    from_name TEXT,
    to_addresses TEXT[] NOT NULL,
    cc_addresses TEXT[] DEFAULT '{}',
    bcc_addresses TEXT[] DEFAULT '{}',
    reply_to_address TEXT,
    subject TEXT,
    body_text TEXT,
    body_html TEXT,
    attachments JSONB DEFAULT '[]',
    is_read BOOLEAN DEFAULT false,
    is_starred BOOLEAN DEFAULT false,
    is_important BOOLEAN DEFAULT false,
    folder TEXT DEFAULT 'inbox' CHECK (folder IN ('inbox', 'sent', 'drafts', 'trash', 'archive', 'spam', 'junk')),
    labels TEXT[] DEFAULT '{}',
    received_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    sent_at TIMESTAMP WITH TIME ZONE,
    size_bytes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    -- Constraints
    CONSTRAINT webmail_messages_size_positive CHECK (size_bytes IS NULL OR size_bytes >= 0)
);

-- =============================================================================
-- ADMIN SYSTEM TABLES (from existing migrations)
-- =============================================================================

-- Permissions table
CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    resource TEXT NOT NULL,
    action TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    UNIQUE(resource, action)
);

-- Roles table
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    is_system_role BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Role permissions junction table
CREATE TABLE IF NOT EXISTS public.role_permissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    UNIQUE(role_id, permission_id)
);

-- User roles junction table
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES public.profiles(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    UNIQUE(user_id, role_id)
);

-- Admin sessions table
CREATE TABLE IF NOT EXISTS public.admin_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    session_token TEXT NOT NULL UNIQUE,
    ip_address INET,
    user_agent TEXT,
    device_info JSONB,
    location_info JSONB,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    terminated_at TIMESTAMP WITH TIME ZONE,
    terminated_by UUID REFERENCES public.profiles(id),
    termination_reason TEXT
);

-- Admin login logs table
CREATE TABLE IF NOT EXISTS public.admin_login_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    email TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    device_info JSONB,
    location_info JSONB,
    login_attempt BOOLEAN DEFAULT true,
    success BOOLEAN DEFAULT false,
    failure_reason TEXT,
    two_factor_used BOOLEAN DEFAULT false,
    two_factor_method TEXT,
    session_id UUID REFERENCES public.admin_sessions(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id TEXT,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    session_id UUID REFERENCES public.admin_sessions(id) ON DELETE SET NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =============================================================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_campaign_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webmail_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webmail_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_login_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- BASIC RLS POLICIES (to be customized based on requirements)
-- =============================================================================

-- Profiles: Users can read/update their own profile, admins can read all
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            JOIN public.roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.name IN ('admin', 'super_admin')
        )
    );

-- Services: Public read, admins can manage
CREATE POLICY "Public can view services" ON public.services
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage services" ON public.services
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            JOIN public.roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.name IN ('admin', 'super_admin')
        )
    );

-- Projects: Public read for published, admins can manage
CREATE POLICY "Public can view published projects" ON public.projects
    FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage projects" ON public.projects
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            JOIN public.roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.name IN ('admin', 'super_admin')
        )
    );

-- Leads: Only admins can access
CREATE POLICY "Admins can manage leads" ON public.leads
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            JOIN public.roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.name IN ('admin', 'super_admin')
        )
    );

-- Notifications: Users can read their own
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

-- Audit logs: Only admins
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            JOIN public.roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.name IN ('admin', 'super_admin')
        )
    );

-- =============================================================================
-- ENABLE REALTIME SUBSCRIPTIONS
-- =============================================================================

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.audit_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
ALTER PUBLICATION supabase_realtime ADD TABLE public.project_tasks;

-- =============================================================================
-- CREATE DEFAULT ROLES AND PERMISSIONS
-- =============================================================================

-- Insert default roles
INSERT INTO public.roles (name, description, is_system_role) VALUES
('user', 'Regular user', true),
('moderator', 'Content moderator', true),
('admin', 'Administrator', true),
('super_admin', 'Super Administrator', true)
ON CONFLICT (name) DO NOTHING;

-- Insert default permissions
INSERT INTO public.permissions (name, description, resource, action) VALUES
('view_users', 'View user profiles', 'users', 'read'),
('manage_users', 'Create, update, delete users', 'users', 'write'),
('view_leads', 'View leads', 'leads', 'read'),
('manage_leads', 'Create, update, delete leads', 'leads', 'write'),
('view_projects', 'View projects', 'projects', 'read'),
('manage_projects', 'Create, update, delete projects', 'projects', 'write'),
('view_content', 'View content (services, testimonials, etc.)', 'content', 'read'),
('manage_content', 'Create, update, delete content', 'content', 'write'),
('view_analytics', 'View analytics and reports', 'analytics', 'read'),
('manage_system', 'Manage system settings and configurations', 'system', 'write'),
('view_audit_logs', 'View audit logs', 'audit', 'read')
ON CONFLICT (resource, action) DO NOTHING;

-- Assign permissions to roles
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE 
    (r.name = 'admin' AND p.name IN ('view_users', 'manage_users', 'view_leads', 'manage_leads', 'view_projects', 'manage_projects', 'view_content', 'manage_content', 'view_analytics', 'view_audit_logs')) OR
    (r.name = 'super_admin' AND p.name IN ('view_users', 'manage_users', 'view_leads', 'manage_leads', 'view_projects', 'manage_projects', 'view_content', 'manage_content', 'view_analytics', 'manage_system', 'view_audit_logs'))
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- =============================================================================
-- CREATE TRIGGERS FOR UPDATED_AT
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS wcibajrcacawtcyzpdgb
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
wcibajrcacawtcyzpdgb language 'plpgsql';

-- Add triggers to tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON public.pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON public.faqs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quotations_updated_at BEFORE UPDATE ON public.quotations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_knowledge_base_updated_at BEFORE UPDATE ON public.knowledge_base FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON public.chat_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ab_tests_updated_at BEFORE UPDATE ON public.ab_tests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscribers_updated_at BEFORE UPDATE ON public.subscribers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_campaigns_updated_at BEFORE UPDATE ON public.email_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_tasks_updated_at BEFORE UPDATE ON public.project_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_webmail_accounts_updated_at BEFORE UPDATE ON public.webmail_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_permissions_updated_at BEFORE UPDATE ON public.permissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON public.roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_sessions_updated_at BEFORE UPDATE ON public.admin_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =============================================================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Projects indexes
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(is_featured, featured_order);
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON public.projects(created_by);

-- Leads indexes
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(lead_status);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON public.leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at);

-- Chat indexes
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON public.chat_sessions(user_id);

-- Admin indexes
CREATE INDEX IF NOT EXISTS idx_admin_sessions_user_id ON public.admin_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_active ON public.admin_sessions(is_active, expires_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON public.audit_logs(timestamp);

-- Notifications index
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id, is_read);

-- =============================================================================
-- COMPLETION MESSAGE
-- =============================================================================

-- The database has been successfully reset and recreated with the comprehensive schema.
-- All tables, relationships, constraints, RLS policies, and realtime subscriptions are now in place.
