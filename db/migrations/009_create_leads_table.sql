-- Create leads table for enterprise sales CRM
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  company VARCHAR(255),
  position VARCHAR(255),
  source VARCHAR(100), -- website, referral, social_media, advertisement, etc.
  status VARCHAR(50) DEFAULT 'new', -- new, contacted, qualified, proposal, negotiation, won, lost
  priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high
  estimated_value DECIMAL(10,2),
  probability INTEGER DEFAULT 0, -- 0-100 percentage chance of conversion
  expected_close_date DATE,
  notes TEXT,
  tags TEXT[], -- Array of tags for categorization
  assigned_to UUID REFERENCES profiles(id),
  last_contact_date DATE,
  next_followup_date DATE,
  conversion_date DATE,
  converted_to_client_id UUID REFERENCES clients(id),
  ai_score DECIMAL(5,2), -- AI-generated lead scoring (0-100)
  ai_insights JSONB, -- AI-generated insights about the lead
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id)
);

-- Create lead activities table for tracking interactions
CREATE TABLE IF NOT EXISTS lead_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL, -- email, call, meeting, note, etc.
  description TEXT,
  outcome VARCHAR(255),
  scheduled_date TIMESTAMP WITH TIME ZONE,
  completed_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

-- Create index for better query performance
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_priority ON leads(priority);
CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX idx_leads_ai_score ON leads(ai_score);
CREATE INDEX idx_leads_created_at ON leads(created_at);

CREATE INDEX idx_lead_activities_lead_id ON lead_activities(lead_id);
CREATE INDEX idx_lead_activities_activity_type ON lead_activities(activity_type);
CREATE INDEX idx_lead_activities_created_at ON lead_activities(created_at);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;

-- Create policies for enterprise users
CREATE POLICY "Enterprise users can view leads" ON leads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );

CREATE POLICY "Enterprise users can insert leads" ON leads
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );

CREATE POLICY "Enterprise users can update leads" ON leads
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );

CREATE POLICY "Enterprise users can view lead_activities" ON lead_activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );

CREATE POLICY "Enterprise users can insert lead_activities" ON lead_activities
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );

CREATE POLICY "Enterprise users can update lead_activities" ON lead_activities
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );
