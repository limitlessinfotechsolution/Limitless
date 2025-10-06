-- Create clients table for enterprise client management
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  company VARCHAR(255),
  industry VARCHAR(100),
  website VARCHAR(255),
  address TEXT,
  contact_person VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active', -- active, inactive, prospect
  access_level VARCHAR(20) DEFAULT 'standard', -- standard, premium, enterprise
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id)
);

-- Create index for better query performance
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_industry ON clients(industry);
CREATE INDEX idx_clients_created_at ON clients(created_at);

-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Create policies for enterprise users
CREATE POLICY "Enterprise users can view clients" ON clients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );

CREATE POLICY "Enterprise users can insert clients" ON clients
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );

CREATE POLICY "Enterprise users can update clients" ON clients
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );
