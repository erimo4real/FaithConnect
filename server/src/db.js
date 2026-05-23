import { createClient } from '@supabase/supabase-js';
import logger from './config/logger.js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let client;

try {
  client = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });
  logger.info('Supabase REST client initialized');
} catch (err) {
  logger.error({ err }, 'Failed to initialize Supabase client');
  process.exit(1);
}

export async function query(text, params = []) {
  const start = Date.now();
  const { data, error } = await client.rpc('execute_sql', {
    query_text: text,
    query_params: params,
  });

  const duration = Date.now() - start;
  if (process.env.NODE_ENV !== 'production') {
    logger.debug({ query: text.slice(0, 60), duration }, 'Query');
  }

  if (error) throw error;

  if (data && data.error) {
    const err = new Error(data.error);
    err.code = data.code;
    throw err;
  }

  if (data && data.rows) {
    return { rows: data.rows, rowCount: data.rows.length };
  }
  if (data && data.row_count !== undefined) {
    return { rows: [], rowCount: data.row_count };
  }
  return { rows: [], rowCount: 0 };
}

export async function getClient() {
  throw new Error('Transactions not supported via Supabase REST API');
}

export default { query, getClient };
