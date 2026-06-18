import { Router } from 'express';
import { query } from '../db.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { paginate } from '../paginate.js';
import { auditLog } from '../middleware/audit.js';
import logger from '../config/logger.js';
import { validate } from '../middleware/validate.js';
import { streamSchema } from '../schemas/index.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const result = await query("SELECT * FROM streams WHERE is_live = true ORDER BY created_at DESC LIMIT 1");
    res.json(result.rows[0] || null);
  } catch (err) {
    logger.error({ err }, 'Failed to get stream');
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/upcoming', async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM streams
       WHERE is_live = false
       AND (
         (recurring IS NULL AND (scheduled_date > (NOW() AT TIME ZONE 'Africa/Lagos')::date OR (scheduled_date = (NOW() AT TIME ZONE 'Africa/Lagos')::date AND scheduled_time > (NOW() AT TIME ZONE 'Africa/Lagos')::time)))
         OR (recurring = 'weekly')
       )
       ORDER BY scheduled_date, scheduled_time ASC
       LIMIT 10`
    );
    res.json(result.rows);
  } catch (err) {
    logger.error({ err }, 'Failed to list upcoming streams');
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/archive', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM stream_logs ORDER BY deactivated_at DESC LIMIT 50'
    );
    res.json(result.rows);
  } catch (err) {
    logger.error({ err }, 'Failed to list stream archive');
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/resolve-tiktok', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'Missing url param' });
    if (!url.includes('tiktok.com')) return res.json({ videoUrl: null });
    const resp = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(5000) });
    const finalUrl = resp.url || url;
    const match = finalUrl.match(/tiktok\.com\/@[\w.-]+\/video\/(\d+)/);
    if (match) return res.json({ videoUrl: finalUrl, id: match[1] });
    res.json({ videoUrl: finalUrl, id: null });
  } catch (err) {
    logger.error({ err }, 'Failed to resolve TikTok URL');
    res.json({ videoUrl: null });
  }
});

router.get('/thumbnail', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'Missing url param' });
    if (!url.includes('facebook.com')) {
      return res.json({ thumbnail: null });
    }
    const fbRes = await fetch(`https://www.facebook.com/plugins/video/oembed.json/?url=${encodeURIComponent(url)}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(5000),
    });
    const data = await fbRes.json();
    res.json({ thumbnail: data.thumbnail_url || null, title: data.title || null });
  } catch (err) {
    logger.error({ err }, 'Failed to fetch Facebook thumbnail');
    res.json({ thumbnail: null });
  }
});

router.get('/all', authenticate, requireAdmin, async (req, res) => {
  try {
    const { limit, offset, hasPagination } = paginate(req);
    if (hasPagination) {
      const count = await query('SELECT COUNT(*) FROM streams');
      const total = parseInt(count.rows[0].count);
      const result = await query('SELECT * FROM streams ORDER BY scheduled_date DESC, scheduled_time DESC LIMIT $1 OFFSET $2', [limit, offset]);
      return res.json({ data: result.rows, total, page: Math.max(parseInt(req.query.page) || 1, 1), limit });
    }
    const result = await query('SELECT * FROM streams ORDER BY scheduled_date DESC, scheduled_time DESC');
    res.json(result.rows);
  } catch (err) {
    logger.error({ err }, 'Failed to list streams');
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticate, requireAdmin, validate(streamSchema), auditLog('create', 'stream'), async (req, res) => {
  const { title, youtube_url, scheduled_date, scheduled_time, end_time, recurring, is_live } = req.body;
  try {
    const result = await query(
      `INSERT INTO streams (title, youtube_url, scheduled_date, scheduled_time, end_time, recurring, is_live, manually_stopped)
       VALUES ($1, $2, $3, $4, $5, $6, $7, false) RETURNING *`,
      [title, youtube_url, scheduled_date, scheduled_time, end_time, recurring || null, is_live || false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    logger.error({ err }, 'Failed to create stream');
    res.status(400).json({ error: 'Failed to create stream' });
  }
});

router.put('/:id', authenticate, requireAdmin, validate(streamSchema), auditLog('update', 'stream'), async (req, res) => {
  const { title, youtube_url, scheduled_date, scheduled_time, end_time, recurring, is_live } = req.body;
  try {
    const manuallyStopped = is_live === false;
    const result = await query(
      `UPDATE streams SET title=$1, youtube_url=$2, scheduled_date=$3, scheduled_time=$4, end_time=$5, recurring=$6, is_live=$7, manually_stopped=$8
       WHERE id=$9 RETURNING *`,
      [title, youtube_url, scheduled_date, scheduled_time, end_time, recurring || null, is_live, manuallyStopped, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    logger.error({ err }, 'Failed to update stream');
    res.status(400).json({ error: 'Failed to update stream' });
  }
});

router.delete('/:id', authenticate, requireAdmin, auditLog('delete', 'stream'), async (req, res) => {
  try {
    const result = await query('DELETE FROM streams WHERE id=$1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
  } catch (err) {
    logger.error({ err }, 'Failed to delete stream');
    res.status(400).json({ error: 'Failed to delete stream' });
  }
});

export default router;
