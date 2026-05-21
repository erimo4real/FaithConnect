import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { paginate } from '../paginate.js';
import { deleteCloudinaryImage, isCloudinaryUrl } from '../utils/cloudinary.js';
import logger from '../config/logger.js';

const router = Router();

router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { limit, offset, hasPagination } = paginate(req);
    if (hasPagination) {
      const count = await query('SELECT COUNT(*) FROM users');
      const total = parseInt(count.rows[0].count);
      const result = await query('SELECT id, name, email, role, avatar_url, created_at FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2', [limit, offset]);
      return res.json({ data: result.rows, total, page: Math.max(parseInt(req.query.page) || 1, 1), limit });
    }
    const result = await query('SELECT id, name, email, role, avatar_url, created_at FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    logger.error({ err }, 'Failed to list users');
    res.status(500).json({ error: 'Failed to list users' });
  }
});

router.put('/profile', authenticate, async (req, res) => {
  const { name, email, avatar_url } = req.body;
  try {
    if (avatar_url !== undefined) {
      const old = await query('SELECT avatar_url FROM users WHERE id=$1', [req.user.id]);
      const oldUrl = old.rows[0]?.avatar_url;
      if (isCloudinaryUrl(oldUrl) && oldUrl !== avatar_url) {
        await deleteCloudinaryImage(oldUrl);
      }
      const result = await query(
        'UPDATE users SET avatar_url=$1 WHERE id=$2 RETURNING id, name, email, role, avatar_url, created_at',
        [avatar_url, req.user.id]
      );
      return res.json(result.rows[0]);
    }
    const result = await query(
      'UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING id, name, email, role, avatar_url, created_at',
      [name, email, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    logger.error({ err }, 'Failed to update user');
    res.status(400).json({ error: 'Failed to update user' });
  }
});

router.put('/password', authenticate, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password are required' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  }
  try {
    const result = await query('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    const match = await bcrypt.compare(currentPassword, result.rows[0].password_hash);
    if (!match) return res.status(401).json({ error: 'Current password is incorrect' });
    const hash = await bcrypt.hash(newPassword, 12);
    await query('UPDATE users SET password_hash=$1 WHERE id=$2', [hash, req.user.id]);
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, 'Failed to reset password');
    res.status(400).json({ error: 'Failed to reset password' });
  }
});

router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  const { name, email, role, avatar_url } = req.body;
  try {
    if (avatar_url !== undefined) {
      const old = await query('SELECT avatar_url FROM users WHERE id=$1', [req.params.id]);
      const oldUrl = old.rows[0]?.avatar_url;
      if (isCloudinaryUrl(oldUrl) && oldUrl !== avatar_url) {
        await deleteCloudinaryImage(oldUrl);
      }
      const result = await query(
        'UPDATE users SET name=$1, email=$2, role=$3, avatar_url=$4 WHERE id=$5 RETURNING id, name, email, role, avatar_url, created_at',
        [name, email, role || 'admin', avatar_url, req.params.id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
      return res.json(result.rows[0]);
    }
    const result = await query(
      'UPDATE users SET name=$1, email=$2, role=$3 WHERE id=$4 RETURNING id, name, email, role, avatar_url, created_at',
      [name, email, role || 'admin', req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    logger.error({ err }, 'Failed to change password');
    res.status(400).json({ error: 'Failed to change password' });
  }
});

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const result = await query('DELETE FROM users WHERE id=$1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
  } catch (err) {
    logger.error({ err }, 'Failed to update profile');
    res.status(400).json({ error: 'Failed to update profile' });
  }
});

export default router;
