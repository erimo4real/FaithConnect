-- Helper function used by the server for database queries via Supabase REST API
CREATE OR REPLACE FUNCTION execute_sql(query_text text, query_params jsonb DEFAULT '[]'::jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
  i integer;
  full_sql text;
BEGIN
  IF query_params IS NOT NULL AND jsonb_typeof(query_params) = 'array' AND jsonb_array_length(query_params) > 0 THEN
    FOR i IN 0..jsonb_array_length(query_params)-1 LOOP
      query_text := replace(query_text, '$' || (i+1), quote_nullable(query_params->>i));
    END LOOP;
  END IF;

  full_sql := 'WITH _r AS (' || query_text || ') SELECT COALESCE(jsonb_agg(row_to_json(_r)), ''[]''::jsonb) FROM _r';

  BEGIN
    EXECUTE full_sql INTO result;
    RETURN jsonb_build_object('rows', COALESCE(result, '[]'::jsonb));
  EXCEPTION WHEN OTHERS THEN
    BEGIN
      EXECUTE query_text;
      GET DIAGNOSTICS result = ROW_COUNT;
      RETURN jsonb_build_object('row_count', result::int);
    EXCEPTION WHEN OTHERS THEN
      RETURN jsonb_build_object('error', SQLERRM, 'code', SQLSTATE);
    END;
  END;
END;
$$;

DROP TABLE IF EXISTS stream_logs CASCADE;
DROP TABLE IF EXISTS streams CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS donations CASCADE;
DROP TABLE IF EXISTS prayer_requests CASCADE;
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS subscribers CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS gallery CASCADE;
DROP TABLE IF EXISTS sermons CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE IF NOT EXISTS sermons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  speaker TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  thumbnail TEXT,
  audio_url TEXT,
  video_url TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT,
  time TEXT,
  location TEXT NOT NULL,
  description TEXT,
  image TEXT,
  spots INTEGER DEFAULT 30,
  days TEXT,
  status TEXT NOT NULL DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  category TEXT NOT NULL,
  image TEXT,
  excerpt TEXT,
  content TEXT,
  status TEXT NOT NULL DEFAULT 'published',
  slug TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  src TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'worship',
  type TEXT NOT NULL DEFAULT 'image',
  thumbnail TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS prayer_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  prayer_type TEXT DEFAULT 'personal',
  request TEXT NOT NULL,
  is_confidential BOOLEAN DEFAULT false,
  is_urgent BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS donations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  amount DECIMAL(10,2) NOT NULL,
  type TEXT DEFAULT 'one-time',
  cause TEXT DEFAULT 'general',
  message TEXT,
  reference TEXT,
  status TEXT DEFAULT 'pending',
  subscription_code TEXT,
  paystack_customer_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  items JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS streams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  youtube_url TEXT,
  scheduled_date DATE,
  scheduled_time TIME,
  end_time TIME,
  recurring TEXT,
  is_live BOOLEAN DEFAULT false,
  manually_stopped BOOLEAN DEFAULT false,
  last_activated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stream_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stream_id UUID REFERENCES streams(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  youtube_url TEXT,
  activated_at TIMESTAMPTZ NOT NULL,
  deactivated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bible_verses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  verse_text TEXT NOT NULL,
  reference TEXT NOT NULL,
  version TEXT DEFAULT 'NIV',
  scheduled_date DATE,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS event_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  reference TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
