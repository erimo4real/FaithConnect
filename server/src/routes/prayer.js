import { Router } from 'express';
import { query } from '../db.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { paginate } from '../paginate.js';
import { auditLog } from '../middleware/audit.js';
import logger from '../config/logger.js';
import { validate } from '../middleware/validate.js';
import { z } from 'zod';

const prayerSchema = z.object({
  name: z.string().min(1, 'Name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().nullable().optional(),
  prayer_type: z.string().optional(),
  request: z.string().min(1, 'Prayer request required'),
  is_confidential: z.boolean().optional(),
  is_urgent: z.boolean().optional(),
});

const router = Router();

router.post('/', validate(prayerSchema), async (req, res) => {
  const { name, email, phone, prayer_type, request, is_confidential, is_urgent } = req.body;
  try {
    const result = await query(
      `INSERT INTO prayer_requests (name, email, phone, prayer_type, request, is_confidential, is_urgent)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [name, email, phone, prayer_type || 'personal', request, is_confidential || false, is_urgent || false]
    );
    res.status(201).json({ success: true, id: result.rows[0].id });
  } catch (err) {
    logger.error({ err }, 'Failed to submit prayer request');
    res.status(400).json({ error: 'Failed to submit prayer request' });
  }
});

router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { limit, offset, hasPagination } = paginate(req);
    if (hasPagination) {
      const count = await query('SELECT COUNT(*) FROM prayer_requests');
      const total = parseInt(count.rows[0].count);
      const result = await query('SELECT * FROM prayer_requests ORDER BY created_at DESC LIMIT $1 OFFSET $2', [limit, offset]);
      return res.json({ data: result.rows, total, page: Math.max(parseInt(req.query.page) || 1, 1), limit });
    }
    const result = await query('SELECT * FROM prayer_requests ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    logger.error({ err }, 'Failed to list prayer requests');
    res.status(500).json({ error: 'Failed to list prayer requests' });
  }
});

router.get('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const result = await query('SELECT * FROM prayer_requests WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    logger.error({ err }, 'Failed to get prayer request');
    res.status(500).json({ error: 'Failed to get prayer request' });
  }
});

router.put('/:id', authenticate, requireAdmin, auditLog('update', 'prayer'), async (req, res) => {
  const { status } = req.body;
  try {
    const result = await query(
      'UPDATE prayer_requests SET status=$1 WHERE id=$2 RETURNING *',
      [status, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    logger.error({ err }, 'Failed to update prayer request');
    res.status(400).json({ error: 'Failed to update prayer request' });
  }
});

router.delete('/:id', authenticate, requireAdmin, auditLog('delete', 'prayer'), async (req, res) => {
  try {
    const result = await query('DELETE FROM prayer_requests WHERE id=$1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
  } catch (err) {
    logger.error({ err }, 'Failed to delete prayer request');
    res.status(400).json({ error: 'Failed to delete prayer request' });
  }
});

export default router;
