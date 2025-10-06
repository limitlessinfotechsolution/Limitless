-- Create billing/invoices table for enterprise financial management
CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  client_id UUID REFERENCES clients(id),
  project_id UUID REFERENCES projects(id),
  amount DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) DEFAULT 'draft', -- draft, sent, paid, overdue, cancelled
  issue_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  paid_date DATE,
  payment_terms VARCHAR(255),
  notes TEXT,
  line_items JSONB, -- Array of line items with description, quantity, rate, amount
  milestones JSONB, -- Array of milestone IDs this invoice is linked to
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id)
);

-- Create quotations table for quotes before invoices
CREATE TABLE IF NOT EXISTS quotations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_number VARCHAR(50) UNIQUE NOT NULL,
  client_id UUID REFERENCES clients(id),
  project_id UUID REFERENCES projects(id),
  amount DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) DEFAULT 'draft', -- draft, sent, accepted, rejected, expired
  valid_until DATE,
  issue_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  line_items JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id)
);

-- Create index for better query performance
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_project_id ON invoices(project_id);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
CREATE INDEX idx_invoices_created_at ON invoices(created_at);

CREATE INDEX idx_quotations_status ON quotations(status);
CREATE INDEX idx_quotations_client_id ON quotations(client_id);
CREATE INDEX idx_quotations_project_id ON quotations(project_id);
CREATE INDEX idx_quotations_created_at ON quotations(created_at);

-- Enable RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;

-- Create policies for enterprise users
CREATE POLICY "Enterprise users can view invoices" ON invoices
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );

CREATE POLICY "Enterprise users can insert invoices" ON invoices
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );

CREATE POLICY "Enterprise users can update invoices" ON invoices
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );

CREATE POLICY "Enterprise users can view quotations" ON quotations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );

CREATE POLICY "Enterprise users can insert quotations" ON quotations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );

CREATE POLICY "Enterprise users can update quotations" ON quotations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );
