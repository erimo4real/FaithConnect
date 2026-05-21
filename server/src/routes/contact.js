import { Router } from 'express';
import { query } from '../db.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { paginate } from '../paginate.js';
import { auditLog } from '../middleware/audit.js';
import logger from '../config/logger.js';
import { validate } from '../middleware/validate.js';
import { contactMessageSchema } from '../schemas/index.js';

const router = Router();

router.post('/', validate(contactMessageSchema), async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  try {
    const result = await query(
      `INSERT INTO contact_messages (name, email, phone, subject, message)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [name, email, phone || '', subject, message]
    );
    res.status(201).json({ success: true, id: result.rows[0].id });
  } catch (err) {
    logger.error({ err }, 'Failed to submit contact message');
    res.status(400).json({ error: 'Failed to submit contact message' });
  }
});

router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { limit, offset, hasPagination } = paginate(req);
    if (hasPagination) {
      const count = await query('SELECT COUNT(*) FROM contact_messages');
      const total = parseInt(count.rows[0].count);
      const result = await query('SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT $1 OFFSET $2', [limit, offset]);
      return res.json({ data: result.rows, total, page: Math.max(parseInt(req.query.page) || 1, 1), limit });
    }
    const result = await query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    logger.error({ err }, 'Failed to list contact messages');
    res.status(500).json({ error: 'Failed to list contact messages' });
  }
});

router.get('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const result = await query('SELECT * FROM contact_messages WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    logger.error({ err }, 'Failed to get contact message');
    res.status(500).json({ error: 'Failed to get contact message' });
  }
});

router.put('/:id', authenticate, requireAdmin, auditLog('update', 'contact'), async (req, res) => {
  const { status } = req.body;
  try {
    const result = await query(
      'UPDATE contact_messages SET status=$1 WHERE id=$2 RETURNING *',
      [status || 'read', req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    logger.error({ err }, 'Failed to update contact message');
    res.status(400).json({ error: 'Failed to update contact message' });
  }
});

router.delete('/:id', authenticate, requireAdmin, auditLog('delete', 'contact'), async (req, res) => {
  try {
    const result = await query('DELETE FROM contact_messages WHERE id=$1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
  } catch (err) {
    logger.error({ err }, 'Failed to delete contact message');
    res.status(400).json({ error: 'Failed to delete contact message' });
  }
});

export default router;
