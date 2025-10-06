-- Create documents table for enterprise document management
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size BIGINT,
  mime_type VARCHAR(100),
  document_type VARCHAR(50), -- contract, proposal, report, design, code, etc.
  category VARCHAR(50), -- project_docs, client_docs, templates, etc.
  project_id UUID REFERENCES projects(id),
  client_id UUID REFERENCES clients(id),
  task_id UUID REFERENCES tasks(id),
  version INTEGER DEFAULT 1,
  parent_document_id UUID REFERENCES documents(id), -- For version control
  tags TEXT[], -- Array of tags for categorization
  access_level VARCHAR(20) DEFAULT 'private', -- private, team, client, public
  expires_at TIMESTAMP WITH TIME ZONE,
  uploaded_by UUID REFERENCES profiles(id) NOT NULL,
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create document versions table for version control
CREATE TABLE IF NOT EXISTS document_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size BIGINT,
  changes_description TEXT,
  created_by UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create teams table for enterprise team management
CREATE TABLE IF NOT EXISTS teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  team_lead_id UUID REFERENCES profiles(id),
  department VARCHAR(100),
  skills JSONB, -- Array of skills/competencies
  capacity INTEGER, -- Maximum number of active projects
  current_projects INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active', -- active, inactive, disbanded
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id)
);

-- Create team_members junction table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role_in_team VARCHAR(100), -- developer, designer, qa, manager, etc.
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  left_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(team_id, user_id, is_active)
);

-- Create project_team_assignments table
CREATE TABLE IF NOT EXISTS project_team_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) NOT NULL,
  team_id UUID REFERENCES teams(id) NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unassigned_at TIMESTAMP WITH TIME ZONE,
  role_in_project VARCHAR(100), -- development_team, design_team, qa_team, etc.
  is_active BOOLEAN DEFAULT true,
  UNIQUE(project_id, team_id, is_active)
);

-- Create skills and competencies table
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  category VARCHAR(100), -- technical, soft_skills, domain_expertise, etc.
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_skills junction table
CREATE TABLE IF NOT EXISTS user_skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  proficiency_level INTEGER CHECK (proficiency_level >= 1 AND proficiency_level <= 5), -- 1-5 scale
  years_experience DECIMAL(4,1),
  certified BOOLEAN DEFAULT false,
  certification_details JSONB,
  acquired_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, skill_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_documents_project_id ON documents(project_id);
CREATE INDEX idx_documents_client_id ON documents(client_id);
CREATE INDEX idx_documents_task_id ON documents(task_id);
CREATE INDEX idx_documents_document_type ON documents(document_type);
CREATE INDEX idx_documents_category ON documents(category);
CREATE INDEX idx_documents_uploaded_by ON documents(uploaded_by);
CREATE INDEX idx_documents_created_at ON documents(created_at);

CREATE INDEX idx_document_versions_document_id ON document_versions(document_id);
CREATE INDEX idx_document_versions_version_number ON document_versions(version_number);

CREATE INDEX idx_teams_team_lead_id ON teams(team_lead_id);
CREATE INDEX idx_teams_department ON teams(department);
CREATE INDEX idx_teams_status ON teams(status);

CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);
CREATE INDEX idx_team_members_is_active ON team_members(is_active);

CREATE INDEX idx_project_team_assignments_project_id ON project_team_assignments(project_id);
CREATE INDEX idx_project_team_assignments_team_id ON project_team_assignments(team_id);
CREATE INDEX idx_project_team_assignments_is_active ON project_team_assignments(is_active);

CREATE INDEX idx_skills_category ON skills(category);

CREATE INDEX idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX idx_user_skills_skill_id ON user_skills(skill_id);
CREATE INDEX idx_user_skills_proficiency_level ON user_skills(proficiency_level);

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_team_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;

-- Create policies for enterprise users
CREATE POLICY "Enterprise users can view documents" ON documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );

CREATE POLICY "Enterprise users can insert documents" ON documents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );

CREATE POLICY "Enterprise users can update documents" ON documents
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );

CREATE POLICY "Enterprise users can view document_versions" ON document_versions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );

CREATE POLICY "Enterprise users can insert document_versions" ON document_versions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );

CREATE POLICY "Enterprise users can view teams" ON teams
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );

CREATE POLICY "Enterprise users can insert teams" ON teams
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );

CREATE POLICY "Enterprise users can update teams" ON teams
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );

CREATE POLICY "Enterprise users can view team_members" ON team_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );

CREATE POLICY "Enterprise users can insert team_members" ON team_members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );

CREATE POLICY "Enterprise users can update team_members" ON team_members
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );

CREATE POLICY "Enterprise users can view project_team_assignments" ON project_team_assignments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );

CREATE POLICY "Enterprise users can insert project_team_assignments" ON project_team_assignments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );

CREATE POLICY "Enterprise users can update project_team_assignments" ON project_team_assignments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );

CREATE POLICY "Enterprise users can view skills" ON skills
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );

CREATE POLICY "Enterprise users can insert skills" ON skills
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );

CREATE POLICY "Enterprise users can update skills" ON skills
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );

CREATE POLICY "Enterprise users can view user_skills" ON user_skills
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );

CREATE POLICY "Enterprise users can insert user_skills" ON user_skills
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );

CREATE POLICY "Enterprise users can update user_skills" ON user_skills
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );
