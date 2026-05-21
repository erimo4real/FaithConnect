import { Router } from 'express';
import { query } from '../db.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { paginate } from '../paginate.js';
import { auditLog } from '../middleware/audit.js';
import logger from '../config/logger.js';

const router = Router();

router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { limit, offset, hasPagination } = paginate(req);
    if (hasPagination) {
      const count = await query('SELECT COUNT(*) FROM donations');
      const total = parseInt(count.rows[0].count);
      const result = await query('SELECT * FROM donations ORDER BY created_at DESC LIMIT $1 OFFSET $2', [limit, offset]);
      return res.json({ data: result.rows, total, page: Math.max(parseInt(req.query.page) || 1, 1), limit });
    }
    const result = await query('SELECT * FROM donations ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    logger.error({ err }, 'Failed to list donations');
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const result = await query('SELECT * FROM donations WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    logger.error({ err }, 'Failed to get donation');
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', authenticate, requireAdmin, auditLog('update', 'donation'), async (req, res) => {
  const { status, reference } = req.body;
  try {
    const result = await query(
      'UPDATE donations SET status=$1, reference=$2 WHERE id=$3 RETURNING *',
      [status, reference, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    logger.error({ err }, 'Failed to update donation');
    res.status(400).json({ error: 'Failed to update donation' });
  }
});

router.delete('/:id', authenticate, requireAdmin, auditLog('delete', 'donation'), async (req, res) => {
  try {
    const result = await query('DELETE FROM donations WHERE id=$1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
  } catch (err) {
    logger.error({ err }, 'Failed to delete donation');
    res.status(400).json({ error: 'Failed to delete donation' });
  }
});

export default router;
