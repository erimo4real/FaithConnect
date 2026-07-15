CREATE TABLE IF NOT EXISTS event_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  reference TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
