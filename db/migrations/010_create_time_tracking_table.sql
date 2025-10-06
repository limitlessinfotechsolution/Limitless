-- Create time tracking table for enterprise time management
CREATE TABLE IF NOT EXISTS time_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES tasks(id),
  project_id UUID REFERENCES projects(id),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER, -- Calculated duration in minutes
  billable BOOLEAN DEFAULT true,
  billable_rate DECIMAL(8,2), -- Hourly rate for billing
  category VARCHAR(50), -- development, design, qa, meeting, etc.
  tags TEXT[], -- Array of tags for categorization
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project milestones table
CREATE TABLE IF NOT EXISTS project_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATE,
  completed_date DATE,
  status VARCHAR(50) DEFAULT 'pending', -- pending, in_progress, completed, delayed
  progress_percentage INTEGER DEFAULT 0,
  assigned_to UUID REFERENCES profiles(id),
  budget_allocated DECIMAL(10,2),
  budget_used DECIMAL(10,2) DEFAULT 0,
  deliverables JSONB, -- Array of deliverables
  dependencies JSONB, -- Array of milestone IDs this depends on
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id)
);

-- Create notifications table for enterprise alerts
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  type VARCHAR(50) NOT NULL, -- task_due, project_deadline, invoice_overdue, etc.
  title VARCHAR(255) NOT NULL,
  message TEXT,
  data JSONB, -- Additional data for the notification
  read_at TIMESTAMP WITH TIME ZONE,
  action_url VARCHAR(500), -- URL to navigate to when clicked
  priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, urgent
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create calendar events table
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_type VARCHAR(50) NOT NULL, -- meeting, deadline, milestone, reminder, etc.
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  all_day BOOLEAN DEFAULT false,
  location VARCHAR(255),
  attendees JSONB, -- Array of attendee objects with id, name, email, status
  organizer_id UUID REFERENCES profiles(id),
  related_project_id UUID REFERENCES projects(id),
  related_task_id UUID REFERENCES tasks(id),
  related_client_id UUID REFERENCES clients(id),
  recurrence JSONB, -- Recurrence rules if applicable
  reminders JSONB, -- Array of reminder settings
  status VARCHAR(50) DEFAULT 'confirmed', -- confirmed, tentative, cancelled
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id)
);

-- Create indexes for better query performance
CREATE INDEX idx_time_entries_task_id ON time_entries(task_id);
CREATE INDEX idx_time_entries_project_id ON time_entries(project_id);
CREATE INDEX idx_time_entries_user_id ON time_entries(user_id);
CREATE INDEX idx_time_entries_start_time ON time_entries(start_time);
CREATE INDEX idx_time_entries_category ON time_entries(category);

CREATE INDEX idx_project_milestones_project_id ON project_milestones(project_id);
CREATE INDEX idx_project_milestones_status ON project_milestones(status);
CREATE INDEX idx_project_milestones_due_date ON project_milestones(due_date);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_read_at ON notifications(read_at);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

CREATE INDEX idx_calendar_events_start_time ON calendar_events(start_time);
CREATE INDEX idx_calendar_events_end_time ON calendar_events(end_time);
CREATE INDEX idx_calendar_events_event_type ON calendar_events(event_type);
CREATE INDEX idx_calendar_events_organizer_id ON calendar_events(organizer_id);
CREATE INDEX idx_calendar_events_related_project_id ON calendar_events(related_project_id);

-- Enable RLS
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- Create policies for enterprise users
CREATE POLICY "Enterprise users can view time_entries" ON time_entries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );

CREATE POLICY "Enterprise users can insert time_entries" ON time_entries
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );

CREATE POLICY "Enterprise users can update time_entries" ON time_entries
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );

CREATE POLICY "Enterprise users can view project_milestones" ON project_milestones
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );

CREATE POLICY "Enterprise users can insert project_milestones" ON project_milestones
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );

CREATE POLICY "Enterprise users can update project_milestones" ON project_milestones
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );

CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Enterprise users can insert notifications" ON notifications
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Enterprise users can view calendar_events" ON calendar_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );

CREATE POLICY "Enterprise users can insert calendar_events" ON calendar_events
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );

CREATE POLICY "Enterprise users can update calendar_events" ON calendar_events
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('enterprise', 'super_admin')
    )
  );
