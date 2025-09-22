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
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON public.analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON public.analytics_events(created_at);

-- Email logs indexes
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON public.email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_created ON public.email_logs(created_at);

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
ALTER TABLE public.business_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_activities ENABLE ROW LEVEL SECURITY;

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
CREATE POLICY "Public can view published FAQs" ON public.faqs FOR SELECT USING (is_published = true);
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

-- Quotations policies
CREATE POLICY "Admins can manage quotations" ON public.quotations FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Knowledge base policies
CREATE POLICY "Public can view active knowledge base" ON public.knowledge_base FOR SELECT USING (is_active = true);
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

-- Analytics events policies
CREATE POLICY "Admins can view analytics" ON public.analytics_events FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "System can insert analytics" ON public.analytics_events FOR INSERT WITH CHECK (true);

-- Email logs policies
CREATE POLICY "Admins can view email logs" ON public.email_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "System can insert email logs" ON public.email_logs FOR INSERT WITH CHECK (true);

-- API logs policies
CREATE POLICY "Admins can view API logs" ON public.api_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "System can insert API logs" ON public.api_logs FOR INSERT WITH CHECK (true);

-- Error logs policies
CREATE POLICY "Admins can view error logs" ON public.error_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "System can insert error logs" ON public.error_logs FOR INSERT WITH CHECK (true);

-- Performance logs policies
CREATE POLICY "Admins can view performance logs" ON public.performance_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "System can insert performance logs" ON public.performance_logs FOR INSERT WITH CHECK (true);

-- File uploads policies
CREATE POLICY "Public can view public files" ON public.file_uploads FOR SELECT USING (is_public = true);
CREATE POLICY "Users can view own files" ON public.file_uploads FOR SELECT USING (auth.uid() = uploaded_by);
CREATE POLICY "Admins can manage files" ON public.file_uploads FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can create notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- User preferences policies
CREATE POLICY "Users can view own preferences" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON public.user_preferences FOR ALL USING (auth.uid() = user_id);

-- A/B tests policies
CREATE POLICY "Public can view active A/B tests" ON public.ab_tests FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage A/B tests" ON public.ab_tests FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- A/B test results policies
CREATE POLICY "Public can view A/B test results" ON public.ab_test_results FOR SELECT USING (true);
CREATE POLICY "Admins can manage A/B test results" ON public.ab_test_results FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Subscribers policies
CREATE POLICY "Users can view own subscription" ON public.subscribers FOR SELECT USING (auth.uid() = (
    SELECT user_id FROM public.profiles WHERE email = public.subscribers.email LIMIT 1
));
CREATE POLICY "Admins can manage subscribers" ON public.subscribers FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Email campaigns policies
CREATE POLICY "Admins can manage email campaigns" ON public.email_campaigns FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Email campaign recipients policies
CREATE POLICY "Admins can manage email campaign recipients" ON public.email_campaign_recipients FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Business projects policies
CREATE POLICY "Users can view own business projects" ON public.business_projects FOR SELECT USING (owner_id = auth.uid() OR created_by = auth.uid() OR assigned_to = auth.uid());
CREATE POLICY "Admins can manage business projects" ON public.business_projects FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Project activities policies
CREATE POLICY "Users can view activities for own projects" ON public.project_activities FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.business_projects WHERE id = project_id AND (owner_id = auth.uid() OR created_by = auth.uid() OR assigned_to = auth.uid()))
);
CREATE POLICY "Admins can manage project activities" ON public.project_activities FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

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
CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON public.faqs FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_quotations_updated_at BEFORE UPDATE ON public.quotations FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_knowledge_base_updated_at BEFORE UPDATE ON public.knowledge_base FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON public.chat_sessions FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_business_projects_updated_at BEFORE UPDATE ON public.business_projects FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- =============================================================================
-- FINAL NOTES
-- =============================================================================

-- This schema provides:
-- 1. Complete database structure for Limitless Infotech
-- 2. Row Level Security policies for all tables
-- 3. Performance indexes including vector indexes for AI
-- 4. Functions for AI similarity search and business logic
-- 5. Triggers for automatic timestamp updates
--
-- To use this schema:
-- 1. Run this SQL in your Supabase project
-- 2. Generate TypeScript types: npx supabase gen types typescript
-- 3. Update your environment variables
-- 4. Test the setup with your application