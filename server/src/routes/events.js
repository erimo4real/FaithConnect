import { Router } from 'express';
import { query } from '../db.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { paginate } from '../paginate.js';
import { auditLog } from '../middleware/audit.js';
import { deleteCloudinaryImage, isCloudinaryUrl } from '../utils/cloudinary.js';
import logger from '../config/logger.js';
import { validate } from '../middleware/validate.js';
import { eventSchema } from '../schemas/index.js';

const router = Router();

router.get('/splash', async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM events
       WHERE display_mode = 'splash'
         AND status = 'published'
         AND splash_from IS NOT NULL
         AND splash_to IS NOT NULL
         AND (CURRENT_DATE BETWEEN splash_from::date AND splash_to::date)
       ORDER BY splash_from ASC`
    );
    res.json(result.rows);
  } catch (err) {
    logger.error({ err }, 'Failed to list splash events');
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { limit, offset, hasPagination } = paginate(req);
    if (hasPagination) {
      const count = await query('SELECT COUNT(*) FROM events');
      const total = parseInt(count.rows[0].count);
      const result = await query('SELECT * FROM events ORDER BY date ASC LIMIT $1 OFFSET $2', [limit, offset]);
      return res.json({ data: result.rows, total, page: Math.max(parseInt(req.query.page) || 1, 1), limit });
    }
    const result = await query('SELECT * FROM events ORDER BY date ASC');
    res.json(result.rows);
  } catch (err) {
    logger.error({ err }, 'Failed to list events');
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM events WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    logger.error({ err }, 'Failed to get event');
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticate, requireAdmin, validate(eventSchema), auditLog('create', 'event'), async (req, res) => {
  const { title, date, time, days, location, description, image, spots, status, display_mode, splash_from, splash_to, splash_duration, total_days } = req.body;
  try {
    const result = await query(
      `INSERT INTO events (title, date, time, days, location, description, image, spots, status, display_mode, splash_from, splash_to, splash_duration, total_days)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
      [title, date, time, days, location, description, image, spots, status || 'published', display_mode || 'list', splash_from || null, splash_to || null, splash_duration || 10, total_days || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    logger.error({ err }, 'Failed to create event');
    res.status(400).json({ error: 'Failed to create event' });
  }
});

router.put('/:id', authenticate, requireAdmin, validate(eventSchema), auditLog('update', 'event'), async (req, res) => {
  const { title, date, time, days, location, description, image, spots, status, display_mode, splash_from, splash_to, splash_duration, total_days } = req.body;
  try {
    if (image !== undefined) {
      const old = await query('SELECT image FROM events WHERE id=$1', [req.params.id]);
      const oldUrl = old.rows[0]?.image;
      if (isCloudinaryUrl(oldUrl) && oldUrl !== image) {
        await deleteCloudinaryImage(oldUrl);
      }
    }
    const result = await query(
      `UPDATE events SET title=$1, date=$2, time=$3, days=$4, location=$5, description=$6, image=$7, spots=$8, status=$9, display_mode=$10, splash_from=$11, splash_to=$12, splash_duration=$13, total_days=$14
       WHERE id=$15 RETURNING *`,
      [title, date, time, days, location, description, image, spots, status, display_mode || 'list', splash_from || null, splash_to || null, splash_duration || 10, total_days || null, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    logger.error({ err }, 'Failed to update event');
    res.status(400).json({ error: 'Failed to update event' });
  }
});

router.delete('/:id', authenticate, requireAdmin, auditLog('delete', 'event'), async (req, res) => {
  try {
    const result = await query('DELETE FROM events WHERE id=$1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
  } catch (err) {
    logger.error({ err }, 'Failed to delete event');
    res.status(400).json({ error: 'Failed to delete event' });
  }
});

export default router;
