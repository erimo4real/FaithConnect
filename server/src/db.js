import pg from 'pg';
import logger from './config/logger.js';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  family: 4,
  ...(process.env.DATABASE_SSL === 'true' ? { ssl: { rejectUnauthorized: true } } : {}),
});

pool.on('error', (err) => {
  logger.error({ err }, 'Database pool error');
});

// Simple query helper — same API for local & Supabase
export async function query(text, params) {
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;
  if (process.env.NODE_ENV !== 'production') {
    logger.debug({ query: text.slice(0, 60), duration }, 'Query');
  }
  return result;
}

// Get a client from the pool (for transactions)
export async function getClient() {
  return pool.connect();
}

export default { query, getClient };
