-- Create analytics summary table
CREATE TABLE IF NOT EXISTS analytics_summary (
  id SERIAL PRIMARY KEY,
  site_visits INTEGER DEFAULT 0,
  clients_count INTEGER DEFAULT 0,
  leads_count INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create error logs table
CREATE TABLE IF NOT EXISTS error_logs (
  id SERIAL PRIMARY KEY,
  error_message TEXT,
  error_stack TEXT,
  context TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat feedback table
CREATE TABLE IF NOT EXISTS chat_feedback (
  id SERIAL PRIMARY KEY,
  message_id TEXT,
  feedback TEXT CHECK (feedback IN ('positive', 'negative')),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_id TEXT
);

-- Create enhanced knowledge base table
CREATE TABLE IF NOT EXISTS knowledge_base_enhanced (
  id SERIAL PRIMARY KEY,
  category TEXT,
  title TEXT,
  content TEXT,
  keywords TEXT[],
  usage_count INTEGER DEFAULT 0,
  last_used TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  effectiveness_score DECIMAL(3,2) DEFAULT 0.5
);

-- Add feedback column to chat_messages table if it doesn't exist
ALTER TABLE chat_messages 
ADD COLUMN IF NOT EXISTS feedback TEXT CHECK (feedback IN ('positive', 'negative'));

-- Insert initial analytics data
INSERT INTO analytics_summary (id, site_visits, clients_count, leads_count) 
VALUES (1, 0, 0, 0) 
ON CONFLICT (id) DO NOTHING;