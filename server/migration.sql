-- Run this in Supabase SQL Editor or pgAdmin if your DB was created
-- with the old schema (before status columns, avatar_url, etc. were added).

-- Sermons
ALTER TABLE sermons ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE sermons ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'published';

-- Events
ALTER TABLE events ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'published';
ALTER TABLE events ADD COLUMN IF NOT EXISTS days TEXT;
ALTER TABLE events ALTER COLUMN date DROP NOT NULL;
ALTER TABLE events ALTER COLUMN time DROP NOT NULL;

-- Blog Posts
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'published';
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS meta_description TEXT;

-- Contact Messages
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'unread';

-- Users
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Streams — date/time + end time + recurring
ALTER TABLE streams ADD COLUMN IF NOT EXISTS scheduled_date DATE;
ALTER TABLE streams ADD COLUMN IF NOT EXISTS scheduled_time TIME;
ALTER TABLE streams ADD COLUMN IF NOT EXISTS end_time TIME;
ALTER TABLE streams ADD COLUMN IF NOT EXISTS recurring TEXT;
ALTER TABLE streams ADD COLUMN IF NOT EXISTS manually_stopped BOOLEAN DEFAULT false;
ALTER TABLE streams DROP COLUMN IF EXISTS speaker;
ALTER TABLE streams ADD COLUMN IF NOT EXISTS last_activated_at TIMESTAMPTZ;
ALTER TABLE streams DROP COLUMN IF EXISTS scheduled_at;

CREATE TABLE IF NOT EXISTS stream_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stream_id UUID REFERENCES streams(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  youtube_url TEXT,
  activated_at TIMESTAMPTZ NOT NULL,
  deactivated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Remove duplicate stream_log entries (same stream, same day) keeping latest
DELETE FROM stream_logs a
USING stream_logs b
WHERE a.id < b.id
  AND a.stream_id = b.stream_id
  AND a.deactivated_at::date = b.deactivated_at::date;

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  user_name TEXT,
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  resource_id TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
