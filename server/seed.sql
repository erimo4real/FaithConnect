-- Run this SQL in your Supabase SQL Editor (https://supabase.com -> SQL Editor)
-- It creates all the tables for the Bethel Church app

-- 1. Sermons
CREATE TABLE sermons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  speaker TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  thumbnail TEXT,
  audio_url TEXT,
  video_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Events
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  image TEXT,
  spots INTEGER DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Blog Posts
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  category TEXT NOT NULL,
  image TEXT,
  excerpt TEXT,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Gallery
CREATE TABLE gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  src TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'worship',
  type TEXT NOT NULL DEFAULT 'image',
  thumbnail TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Prayer Requests
CREATE TABLE prayer_requests (
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

-- 6. Donations
CREATE TABLE donations (
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Shop Orders
CREATE TABLE orders (
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

-- 8. Live Streams
CREATE TABLE streams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  youtube_url TEXT,
  scheduled_at TIMESTAMPTZ,
  is_live BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Contact Messages
CREATE TABLE contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Newsletter Subscribers
CREATE TABLE subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
