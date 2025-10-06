-- Create projects table for enterprise project management
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'planning',
  priority VARCHAR(20) DEFAULT 'medium',
  client_id UUID REFERENCES clients(id),
  project_manager_id UUID REFERENCES profiles(id),
  start_date DATE,
  end_date DATE,
  budget DECIMAL(10,2),
  actual_cost DECIMAL(10,2) DEFAULT 0,
  progress_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id)
);

-- Create index for better query performance
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_project_manager_id ON projects(project_manager_id);
CREATE INDEX idx_projects_created_at ON projects(created_at);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policies for enterprise users
CREATE POLICY "Enterprise users can view projects" ON projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );

CREATE POLICY "Enterprise users can insert projects" ON projects
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );

CREATE POLICY "Enterprise users can update projects" ON projects
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );
