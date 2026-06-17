import pkg from 'pg';
import { createClient } from '@supabase/supabase-js';
import logger from './config/logger.js';

const { Pool } = pkg;

const databaseUrl = process.env.DATABASE_URL || '';
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let query;
let getClient;

if (databaseUrl.includes('localhost') || databaseUrl.includes('127.0.0.1')) {
  const pool = new Pool({ connectionString: databaseUrl });
  logger.info('Local PostgreSQL pool initialized');

  query = async (text, params = []) => {
    const start = Date.now();
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'production') {
      logger.debug({ query: text.slice(0, 60), duration }, 'Query');
    }
    return { rows: result.rows, rowCount: result.rowCount ?? result.rows.length };
  };

  getClient = () => pool.connect();
} else {
  const client = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });
  logger.info('Supabase REST client initialized');

  query = async (text, params = []) => {
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
  };

  getClient = async () => { throw new Error('Transactions not supported via Supabase REST API'); };
}

export { query, getClient };
export default { query, getClient };
