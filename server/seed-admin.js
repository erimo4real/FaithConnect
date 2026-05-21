import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { query } from './src/db.js';

const name = process.argv[2] || process.env.ADMIN_NAME || 'Admin';
const email = process.argv[3] || process.env.ADMIN_EMAIL || 'admin@church.com';
const password = process.argv[4] || process.env.ADMIN_PASSWORD || 'password123';

async function main() {
  console.log('── Create Admin User ──\n');

  const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    console.log(`User "${email}" already exists — skipping.`);
    process.exit(0);
  }

  const hash = await bcrypt.hash(password, 12);
  await query(
    `INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, 'admin')`,
    [name, email, hash]
  );

  console.log(`✓ Admin user created:`);
  console.log(`  Name:  ${name}`);
  console.log(`  Email: ${email}`);
  console.log(`  Role:  admin`);
  console.log(`\nLogin at http://localhost:5173/admin/login`);
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
