import { Router } from 'express';
import { query } from '../db.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { auditLog } from '../middleware/audit.js';
import logger from '../config/logger.js';
import { validate } from '../middleware/validate.js';
import { bibleVerseSchema } from '../schemas/index.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM bible_verses ORDER BY scheduled_date DESC NULLS LAST, created_at DESC');
    res.json(result.rows);
  } catch (err) {
    logger.error({ err }, 'Failed to list bible verses');
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/published', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM bible_verses WHERE is_published = true ORDER BY scheduled_date DESC NULLS LAST, created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    logger.error({ err }, 'Failed to list published bible verses');
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/today', async (req, res) => {
  try {
    const lagosDate = "(NOW() AT TIME ZONE 'Africa/Lagos')::date";
    const result = await query(
      `SELECT * FROM bible_verses WHERE is_published = true AND scheduled_date <= ${lagosDate} ORDER BY scheduled_date DESC LIMIT 1`
    );
    if (result.rows.length === 0) return res.json(null);
    res.json(result.rows[0]);
  } catch (err) {
    logger.error({ err }, 'Failed to get verse of the day');
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM bible_verses WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    logger.error({ err }, 'Failed to get bible verse');
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticate, requireAdmin, validate(bibleVerseSchema), auditLog('create', 'bible_verse'), async (req, res) => {
  const { verse_text, reference, version, scheduled_date, is_published } = req.body;
  try {
    const result = await query(
      `INSERT INTO bible_verses (verse_text, reference, version, scheduled_date, is_published)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [verse_text, reference, version || 'NIV', scheduled_date || null, is_published || false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    logger.error({ err }, 'Failed to create bible verse');
    res.status(400).json({ error: 'Failed to create bible verse' });
  }
});

router.put('/:id', authenticate, requireAdmin, validate(bibleVerseSchema), auditLog('update', 'bible_verse'), async (req, res) => {
  const { verse_text, reference, version, scheduled_date, is_published } = req.body;
  try {
    const result = await query(
      `UPDATE bible_verses SET verse_text=$1, reference=$2, version=$3, scheduled_date=$4, is_published=$5
       WHERE id=$6 RETURNING *`,
      [verse_text, reference, version, scheduled_date || null, is_published, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    logger.error({ err }, 'Failed to update bible verse');
    res.status(400).json({ error: 'Failed to update bible verse' });
  }
});

router.delete('/:id', authenticate, requireAdmin, auditLog('delete', 'bible_verse'), async (req, res) => {
  try {
    const result = await query('DELETE FROM bible_verses WHERE id=$1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
  } catch (err) {
    logger.error({ err }, 'Failed to delete bible verse');
    res.status(400).json({ error: 'Failed to delete bible verse' });
  }
});

export default router;
