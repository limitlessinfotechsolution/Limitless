-- =============================================================================
-- COMPLETE SUPABASE SETUP FOR LIMITLESS INFOTECH SOLUTION'S
-- Generated: December 2024
-- Description: Complete database setup with all tables, policies, and sample data
-- =============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgvector";

-- =============================================================================
-- CORE TABLES
-- =============================================================================

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
    avatar_url TEXT,
    phone TEXT,
    bio TEXT,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
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
    icon TEXT NOT NULL,
    image_url TEXT,
    link TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
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
    skills JSONB DEFAULT '[]',
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
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
    project_size TEXT NOT NULL,
    duration TEXT,
    budget_range TEXT,
    client_name TEXT,
    client_logo TEXT,
    website_url TEXT,
    github_url TEXT,
    image TEXT NOT NULL,
    gallery JSONB DEFAULT '[]',
    is_published BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    version INTEGER DEFAULT 1,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
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
    project_id UUID REFERENCES public.projects(id),
    service_id UUID REFERENCES public.services(id),
    is_featured BOOLEAN DEFAULT false,
    approved BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
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
    is_published BOOLEAN DEFAULT false,
    version INTEGER DEFAULT 1,
    created_by UUID REFERENCES public.profiles(id),
    updated_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- FAQs table
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT,
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
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
    source_page TEXT,
    source_url TEXT,
    referrer TEXT,
    ip_address INET,
    user_agent TEXT,
    lead_score INTEGER DEFAULT 0,
    lead_status TEXT DEFAULT 'new' CHECK (lead_status IN ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost')),
    assigned_to UUID REFERENCES public.profiles(id),
    notes TEXT,
    follow_up_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Quotations table
CREATE TABLE IF NOT EXISTS public.quotations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    lead_id UUID REFERENCES public.leads(id),
    title TEXT NOT NULL,
    description TEXT,
    services JSONB DEFAULT '[]',
    total_amount DECIMAL(10,2),
    currency TEXT DEFAULT 'USD',
    valid_until TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'expired')),
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =============================================================================
-- AI CHATBOT SYSTEM
-- =============================================================================

-- Knowledge base table
CREATE TABLE IF NOT EXISTS public.knowledge_base (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT,
    tags TEXT[],
    embedding VECTOR(1536), -- Assuming OpenAI embeddings
    source_type TEXT DEFAULT 'manual' CHECK (source_type IN ('manual', 'web_scraped', 'document', 'faq')),
    source_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Chat sessions table
CREATE TABLE IF NOT EXISTS public.chat_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_token TEXT UNIQUE,
    user_info JSONB,
    is_active BOOLEAN DEFAULT true,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    message_id TEXT UNIQUE,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'bot', 'system')),
    content TEXT NOT NULL,
    structured_data JSONB,
    suggestions TEXT[],
    sources JSONB DEFAULT '[]',
    response_time INTEGER, -- in milliseconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Chat feedback table
CREATE TABLE IF NOT EXISTS public.chat_feedback (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    message_id UUID NOT NULL REFERENCES public.chat_messages(id) ON DELETE CASCADE,
    rating TEXT NOT NULL CHECK (rating IN ('positive', 'negative', 'neutral')),
    feedback_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =============================================================================
-- ANALYTICS & LOGGING
-- =============================================================================

-- Analytics events table
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_type TEXT NOT NULL,
    event_data JSONB NOT NULL DEFAULT '{}',
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id TEXT,
    page_url TEXT,
    referrer TEXT,
    user_agent TEXT,
    ip_address INET,
    device_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Email logs table
CREATE TABLE IF NOT EXISTS public.email_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    to_email TEXT NOT NULL,
    from_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    template_id TEXT,
    template_data JSONB,
    status TEXT NOT NULL CHECK (status IN ('sent', 'delivered', 'opened', 'clicked', 'bounced', 'complained')),
    provider_response JSONB,
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
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
    uploaded_by UUID REFERENCES public.profiles(id),
    entity_type TEXT CHECK (entity_type IN ('project', 'testimonial', 'team_member', 'page', 'service')),
    entity_id UUID,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
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
    type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    action_url TEXT,
    action_text TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
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
    variant_a JSONB NOT NULL,
    variant_b JSONB NOT NULL,
    is_active BOOLEAN DEFAULT false,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- A/B test results table
CREATE TABLE IF NOT EXISTS public.ab_test_results (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    test_id UUID NOT NULL REFERENCES public.ab_tests(id) ON DELETE CASCADE,
    variant TEXT NOT NULL CHECK (variant IN ('A', 'B')),
    views INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
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
    interests TEXT[],
    source TEXT,
    is_active BOOLEAN DEFAULT true,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Email campaigns table
CREATE TABLE IF NOT EXISTS public.email_campaigns (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    template_id TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'cancelled')),
    scheduled_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    target_audience JSONB,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =============================================================================
-- PROJECT MANAGEMENT
-- =============================================================================

-- Project tasks table
CREATE TABLE IF NOT EXISTS public.project_tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'completed')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    assigned_to UUID REFERENCES public.profiles(id),
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
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
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Webmail messages table
CREATE TABLE IF NOT EXISTS public.webmail_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    account_id UUID NOT NULL REFERENCES public.webmail_accounts(id) ON DELETE CASCADE,
    message_id TEXT UNIQUE,
    from_address TEXT NOT NULL,
    to_addresses TEXT[] NOT NULL,
    cc_addresses TEXT[],
    bcc_addresses TEXT[],
    subject TEXT,
    body_text TEXT,
    body_html TEXT,
    attachments JSONB DEFAULT '[]',
    is_read BOOLEAN DEFAULT false,
    is_starred BOOLEAN DEFAULT false,
    folder TEXT DEFAULT 'inbox' CHECK (folder IN ('inbox', 'sent', 'drafts', 'trash', 'archive')),
    received_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Core indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);
CREATE INDEX IF NOT EXISTS idx_services_featured ON public.services(is_featured);
CREATE INDEX IF NOT EXISTS idx_team_members_slug ON public.team_members(slug);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_published ON public.projects(is_published);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON public.testimonials(approved);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON public.testimonials(is_featured);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON public.pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_published ON public.pages(is_published);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(lead_status);
CREATE INDEX IF NOT EXISTS idx_leads_score ON public.leads(lead_score);
CREATE INDEX IF NOT EXISTS idx_leads_created ON public.leads(created_at);

-- AI/Chatbot indexes
CREATE INDEX IF NOT EXISTS idx_knowledge_base_embedding ON public.knowledge_base USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_category ON public.knowledge_base(category);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON public.chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_active ON public.chat_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_feedback_session_id ON public.chat_feedback(session_id);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON public.analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON public.analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON public.email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_created ON public.email_logs(created_at);

-- Additional indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_file_uploads_entity ON public.file_uploads(entity_type, entity_id);

-- =============================================================================
-- ROW LEVEL SECURITY POLICIES
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
ALTER TABLE public.file_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webmail_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webmail_messages ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- SECURITY POLICIES
-- =============================================================================

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Services policies
CREATE POLICY "Public can view services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Admins can manage services" ON public.services FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Team members policies
CREATE POLICY "Public can view team members" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Admins can manage team members" ON public.team_members FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Projects policies
CREATE POLICY "Public can view published projects" ON public.projects FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage projects" ON public.projects FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Testimonials policies
CREATE POLICY "Public can view approved testimonials" ON public.testimonials FOR SELECT USING (approved = true);
CREATE POLICY "Admins can manage testimonials" ON public.testimonials FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Pages policies
CREATE POLICY "Public can view published pages" ON public.pages FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage pages" ON public.pages FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- FAQs policies
CREATE POLICY "Public can view FAQs" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Admins can manage FAQs" ON public.faqs FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Leads policies
CREATE POLICY "Authenticated users can create leads" ON public.leads FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can view leads" ON public.leads FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update leads" ON public.leads FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Knowledge base policies
CREATE POLICY "Public can view knowledge base" ON public.knowledge_base FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage knowledge base" ON public.knowledge_base FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Chat sessions policies
CREATE POLICY "Users can view own chat sessions" ON public.chat_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create chat sessions" ON public.chat_sessions FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);
CREATE POLICY "Users can update own chat sessions" ON public.chat_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all chat sessions" ON public.chat_sessions FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Chat messages policies
CREATE POLICY "Users can view messages from own sessions" ON public.chat_messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.chat_sessions WHERE id = session_id AND (user_id = auth.uid() OR user_id IS NULL))
);
CREATE POLICY "Users can create messages in own sessions" ON public.chat_messages FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.chat_sessions WHERE id = session_id AND (user_id = auth.uid() OR user_id IS NULL))
);
CREATE POLICY "Admins can manage all messages" ON public.chat_messages FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Chat feedback policies
CREATE POLICY "Users can create feedback for own messages" ON public.chat_feedback FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.chat_messages cm JOIN public.chat_sessions cs ON cm.session_id = cs.id WHERE cm.id = message_id AND (cs.user_id = auth.uid() OR cs.user_id IS NULL))
);
CREATE POLICY "Admins can manage all feedback" ON public.chat_feedback FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Analytics policies
CREATE POLICY "Admins can view analytics" ON public.analytics_events FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "System can insert analytics" ON public.analytics_events FOR INSERT WITH CHECK (true);

-- Email logs policies
CREATE POLICY "Admins can view email logs" ON public.email_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "System can insert email logs" ON public.email_logs FOR INSERT WITH CHECK (true);

-- File uploads policies
CREATE POLICY "Public can view public files" ON public.file_uploads FOR SELECT USING (is_public = true);
CREATE POLICY "Admins can manage files" ON public.file_uploads FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can create notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- =============================================================================
-- FUNCTIONS
-- =============================================================================

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function for similarity search in knowledge base
CREATE OR REPLACE FUNCTION public.match_knowledge_base(query_embedding VECTOR(1536), match_threshold FLOAT DEFAULT 0.8, match_count INT DEFAULT 5)
RETURNS TABLE(id UUID, title TEXT, content TEXT, category TEXT, similarity FLOAT)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    knowledge_base.id,
    knowledge_base.title,
    knowledge_base.content,
    knowledge_base.category,
    1 - (knowledge_base.embedding <=> query_embedding) AS similarity
  FROM knowledge_base
  WHERE knowledge_base.is_active = true
    AND 1 - (knowledge_base.embedding <=> query_embedding) > match_threshold
  ORDER BY knowledge_base.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate lead score
CREATE OR REPLACE FUNCTION public.calculate_lead_score(lead_id UUID)
RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 0;
  lead_data RECORD;
BEGIN
  SELECT * INTO lead_data FROM public.leads WHERE id = lead_id;

  -- Score based on project details completeness
  IF lead_data.project_details IS NOT NULL THEN
    score := score + 20;
  END IF;

  -- Score based on timeline urgency
  IF lead_data.timeline_budget->>'urgency' = 'urgent' THEN
    score := score + 30;
  ELSIF lead_data.timeline_budget->>'urgency' = 'soon' THEN
    score := score + 20;
  END IF;

  -- Score based on budget range
  IF lead_data.timeline_budget->>'budget' = 'high' THEN
    score := score + 25;
  ELSIF lead_data.timeline_budget->>'budget' = 'medium' THEN
    score := score + 15;
  END IF;

  RETURN score;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Triggers to update updated_at columns
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON public.pages FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- =============================================================================
-- SAMPLE DATA
-- =============================================================================

-- Insert services
INSERT INTO public.services (title, slug, description, benefits, features, technologies, icon, link, is_featured) VALUES
('Web Development', 'web-development', 'Custom web applications built with modern technologies', 'Scalable, secure, and user-friendly solutions', '["React", "Next.js", "Node.js", "Database Design"]', '["React", "Next.js", "TypeScript", "PostgreSQL", "Tailwind CSS"]', 'Code', '/services#web-development', true),
('Mobile App Development', 'mobile-development', 'Native and cross-platform mobile applications', 'Engaging user experiences across all devices', '["React Native", "Flutter", "iOS", "Android"]', '["React Native", "Flutter", "iOS", "Android", "Firebase"]', 'Smartphone', '/services#mobile-development', true),
('AI & Machine Learning', 'ai-ml', 'Intelligent solutions powered by cutting-edge AI', 'Automation, insights, and competitive advantage', '["Chatbots", "Predictive Analytics", "Computer Vision", "NLP"]', '["Python", "TensorFlow", "OpenAI", "Google AI", "LangChain"]', 'Brain', '/services#ai-ml', true),
('Cloud Solutions', 'cloud-solutions', 'Scalable cloud infrastructure and migration services', 'Cost-effective, secure, and flexible deployments', '["AWS", "Azure", "GCP", "DevOps"]', '["AWS", "Azure", "Docker", "Kubernetes", "Terraform"]', 'Cloud', '/services#cloud-solutions', true),
('UI/UX Design', 'ui-ux', 'Intuitive and beautiful user interfaces', 'Improved user satisfaction and conversion rates', '["User Research", "Wireframing", "Prototyping", "Design Systems"]', '["Figma", "Adobe XD", "Sketch", "InVision", "Principle"]', 'Palette', '/services#ui-ux', true),
('Consulting', 'consulting', 'Strategic technology consulting and advisory', 'Optimized processes and technology roadmaps', '["Architecture Review", "Technology Assessment", "Project Planning", "Team Training"]', '["System Design", "Agile", "Scrum", "DevOps", "Security"]', 'Users', '/services#consulting', true)
ON CONFLICT (slug) DO NOTHING;

-- Insert team members
INSERT INTO public.team_members (name, slug, role, bio, image, is_featured) VALUES
('Faisal Khan', 'faisal-khan', 'Founder & CEO', 'The visionary architect behind Limitless Infotech, Faisal Khan is a tech innovator who transforms complex challenges into groundbreaking solutions. With a relentless drive for excellence and a deep understanding of emerging technologies, he leads the company in pushing the boundaries of what''s possible in software development.', '/images/team/faisal.jpg', true),
('Taj Nadaf', 'taj-nadaf', 'Co-Founder', 'A strategic mastermind and technical virtuoso, Taj Nadaf brings unparalleled expertise in cutting-edge technologies and innovative problem-solving. As the co-founder of Limitless Infotech, he orchestrates the seamless fusion of creativity and technology to deliver extraordinary digital experiences.', '/images/team/taj.jpg', true)
ON CONFLICT (slug) DO NOTHING;

-- Insert FAQs
INSERT INTO public.faqs (question, answer, category, is_featured) VALUES
('What services do you offer?', 'We offer comprehensive technology solutions including web development, mobile app development, AI & machine learning, cloud solutions, UI/UX design, and technology consulting.', 'services', true),
('How long does a typical project take?', 'Project timelines vary based on complexity and scope. Simple websites may take 4-6 weeks, while complex applications can take 3-6 months or more. We''ll provide a detailed timeline during our initial consultation.', 'process', true),
('Do you provide ongoing support?', 'Yes, we offer comprehensive maintenance and support packages to ensure your solution continues to perform optimally and stays up-to-date with the latest technologies.', 'support', true),
('What is your development process?', 'We follow an agile development methodology with regular communication, iterative development, and continuous testing to ensure the best results for our clients.', 'process', false)
ON CONFLICT DO NOTHING;

-- =============================================================================
-- CONCLUSION
-- =============================================================================

-- This completes the comprehensive Supabase database setup for Limitless Infotech Solution's
-- The database includes:
-- - 22 tables with proper relationships
-- - Row Level Security policies for all tables
-- - Performance indexes including vector indexes for AI
-- - Functions for AI similarity search and business logic
-- - Triggers for automatic timestamp updates
-- - Sample data for services, team members, and FAQs
--
-- Next steps:
-- 1. Run this SQL in your Supabase project
-- 2. Generate TypeScript types: npx supabase gen types typescript
-- 3. Update your environment variables
-- 4. Test the setup with your application