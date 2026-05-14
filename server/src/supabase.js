import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Create server/.env from .env.example');
  process.exit(1);
}

const realtimeOpts = { transport: ws };

// Public client (used from frontend)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, { realtime: realtimeOpts });

// Admin client (bypasses RLS — used only on server)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey, { realtime: realtimeOpts });
