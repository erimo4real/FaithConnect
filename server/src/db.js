import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
});

pool.on('error', (err) => {
  console.error('Database pool error:', err.message);
});

// Simple query helper — same API for local & Supabase
export async function query(text, params) {
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;
  if (process.env.NODE_ENV !== 'production') {
    console.log('Query:', text.slice(0, 60), '| Duration:', duration, 'ms');
  }
  return result;
}

// Get a client from the pool (for transactions)
export async function getClient() {
  return pool.connect();
}

export default { query, getClient };
