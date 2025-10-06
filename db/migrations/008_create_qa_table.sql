-- Create QA checklists and results table for enterprise QA/QC management
CREATE TABLE IF NOT EXISTS qa_checklists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  project_id UUID REFERENCES projects(id),
  project_phase VARCHAR(50), -- planning, design, development, qa, launch
  checklist_type VARCHAR(50) DEFAULT 'standard', -- standard, custom, automated
  items JSONB NOT NULL, -- Array of checklist items with id, description, required, category
  is_template BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id)
);

-- Create QA results table for tracking QA execution
CREATE TABLE IF NOT EXISTS qa_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  checklist_id UUID REFERENCES qa_checklists(id),
  project_id UUID REFERENCES projects(id),
  assigned_to UUID REFERENCES profiles(id),
  status VARCHAR(50) DEFAULT 'pending', -- pending, in_progress, completed, failed
  results JSONB, -- Array of results for each checklist item
  overall_score DECIMAL(5,2), -- Overall QA score (0-100)
  notes TEXT,
  screenshots JSONB, -- Array of screenshot URLs/paths
  bugs_found JSONB, -- Array of bugs identified during QA
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX idx_qa_checklists_project_id ON qa_checklists(project_id);
CREATE INDEX idx_qa_checklists_project_phase ON qa_checklists(project_phase);
CREATE INDEX idx_qa_checklists_created_at ON qa_checklists(created_at);

CREATE INDEX idx_qa_results_checklist_id ON qa_results(checklist_id);
CREATE INDEX idx_qa_results_project_id ON qa_results(project_id);
CREATE INDEX idx_qa_results_assigned_to ON qa_results(assigned_to);
CREATE INDEX idx_qa_results_status ON qa_results(status);
CREATE INDEX idx_qa_results_created_at ON qa_results(created_at);

-- Enable RLS
ALTER TABLE qa_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE qa_results ENABLE ROW LEVEL SECURITY;

-- Create policies for enterprise users
CREATE POLICY "Enterprise users can view qa_checklists" ON qa_checklists
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );

CREATE POLICY "Enterprise users can insert qa_checklists" ON qa_checklists
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );

CREATE POLICY "Enterprise users can update qa_checklists" ON qa_checklists
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );

CREATE POLICY "Enterprise users can view qa_results" ON qa_results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );

CREATE POLICY "Enterprise users can insert qa_results" ON qa_results
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );

CREATE POLICY "Enterprise users can update qa_results" ON qa_results
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );
