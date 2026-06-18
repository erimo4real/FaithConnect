import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db.js';
import { sendResetEmail } from '../config/email.js';
import { validate } from '../middleware/validate.js';
import { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema } from '../schemas/index.js';
import logger from '../config/logger.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 12;

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 24 * 60 * 60 * 1000,
};

function setTokenCookie(res, token) {
  res.cookie('token', token, COOKIE_OPTIONS);
}

function clearTokenCookie(res) {
  res.clearCookie('token', { path: '/' });
}

router.post('/register', validate(registerSchema), async (req, res) => {
  const { name, password } = req.body;
  const email = req.body.email?.trim();
  try {
    const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const result = await query(
       `INSERT INTO users (name, email, password_hash, role)
        VALUES ($1, $2, $3, 'viewer') RETURNING id, name, email, role, avatar_url, created_at`,
      [name, email, hash]
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    setTokenCookie(res, token);
    res.status(201).json({ token, user });
  } catch (err) {
    logger.error({ err }, 'Registration failed');
    res.status(400).json({ error: 'Registration failed' });
  }
});

router.post('/login', validate(loginSchema), async (req, res) => {
  const { password } = req.body;
  const email = req.body.email?.trim();
  try {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    setTokenCookie(res, token);
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar_url: user.avatar_url, created_at: user.created_at },
    });
  } catch (err) {
    logger.error({ err }, 'Login failed');
    res.status(400).json({ error: 'Login failed' });
  }
});

router.post('/logout', (req, res) => {
  clearTokenCookie(res);
  res.json({ success: true });
});

router.post('/forgot-password', validate(forgotPasswordSchema), async (req, res) => {
  const { email } = req.body;
  try {
    const result = await query('SELECT id, email FROM users WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
      const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/admin/reset-password?token=${token}`;
      await sendResetEmail(user.email, resetUrl);
    }
    res.json({ success: true, message: 'If the email exists, a reset link has been sent.' });
  } catch (err) {
    logger.error({ err }, 'Forgot-password request failed');
    res.status(400).json({ error: 'Failed to process request' });
  }
});

router.post('/reset-password', validate(resetPasswordSchema), async (req, res) => {
  const { token, password } = req.body;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    await query('UPDATE users SET password_hash=$1 WHERE id=$2', [hash, decoded.id]);
    res.json({ success: true, message: 'Password updated. You can now login.' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid or expired token' });
  }
});

router.get('/me', async (req, res) => {
  try {
    let token = null;
    const header = req.headers.authorization;
    if (header && header.startsWith('Bearer ')) token = header.split(' ')[1];
    if (!token && req.cookies?.token) token = req.cookies.token;
    if (!token) return res.json(null);

    const decoded = jwt.verify(token, JWT_SECRET);
    const result = await query('SELECT id, name, email, role, avatar_url, created_at FROM users WHERE id = $1', [decoded.id]);
    res.json(result.rows[0] || null);
  } catch {
    res.json(null);
  }
});

export default router;
