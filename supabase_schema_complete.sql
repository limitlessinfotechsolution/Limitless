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

-- Business projects table (separate from portfolio projects)
CREATE TABLE IF NOT EXISTS public.business_projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'in_progress', 'completed')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    budget DECIMAL(10,2),
    client_name TEXT,
    client_email TEXT,
    project_type TEXT,
    tags TEXT[],
    attachments JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Project activity logs
CREATE TABLE IF NOT EXISTS public.project_activities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.business_projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL, -- 'created', 'updated', 'approved', 'rejected', 'assigned', etc.
    old_status TEXT,
    new_status TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Services indexes
CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);
CREATE INDEX IF NOT EXISTS idx_services_featured ON public.services(is_featured);

-- Team members indexes
CREATE INDEX IF NOT EXISTS idx_team_members_slug ON public.team_members(slug);

-- Projects indexes
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_published ON public.projects(is_published);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(is_featured);

-- Testimonials indexes
CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON public.testimonials(approved);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON public.testimonials(is_featured);

-- Pages indexes
CREATE INDEX IF NOT EXISTS idx_pages_slug ON public.pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_published ON public.pages(is_published);

-- Leads indexes
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(lead_status);
CREATE INDEX IF NOT EXISTS idx_leads_score ON public.leads(lead_score);
CREATE INDEX IF NOT EXISTS idx_leads_created ON public.leads(created_at);

-- Knowledge base indexes
CREATE INDEX IF NOT EXISTS idx_knowledge_base_embedding ON public.knowledge_base USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_category ON public.knowledge_base(category);

-- Chat sessions indexes
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON public.chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_active ON public.chat_sessions(is_active);

-- Chat messages indexes
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON public.chat_messages(session_id);

-- Chat feedback indexes
CREATE INDEX IF NOT EXISTS idx_chat_feedback_session_id ON public.chat_feedback(session_id);

-- Analytics events indexes
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON public.analytics_events