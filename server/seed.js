import 'dotenv/config';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { supabaseAdmin } from './src/supabase.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(join(__dirname, 'seed.sql'), 'utf8');

const sqlStatements = sql
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

console.log(`Running ${sqlStatements.length} SQL statements...`);

for (const statement of sqlStatements) {
  const { error } = await supabaseAdmin.rpc('exec_sql', { sql: statement + ';' });
  if (error) {
    console.log('Statement:', statement.slice(0, 80));
    console.log('Error:', error.message);

    // Fallback: try direct query
    const { error: e2 } = await supabaseAdmin.from('_dummy').select('*').limit(0);
    if (e2 && e2.message?.includes('relation')) {
      console.log('Tables may already exist — skipping seed.');
      break;
    }
  }
}

console.log('Seed complete. Check your Supabase SQL Editor to verify.');
