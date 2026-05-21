import { Router } from 'express';
import { query } from '../db.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { paginate } from '../paginate.js';
import { auditLog } from '../middleware/audit.js';
import { deleteCloudinaryImage, isCloudinaryUrl } from '../utils/cloudinary.js';
import logger from '../config/logger.js';
import { validate } from '../middleware/validate.js';
import { sermonSchema } from '../schemas/index.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { limit, offset, hasPagination } = paginate(req);
    if (hasPagination) {
      const count = await query('SELECT COUNT(*) FROM sermons');
      const total = parseInt(count.rows[0].count);
      const result = await query('SELECT * FROM sermons ORDER BY date DESC LIMIT $1 OFFSET $2', [limit, offset]);
      return res.json({ data: result.rows, total, page: Math.max(parseInt(req.query.page) || 1, 1), limit });
    }
    const result = await query('SELECT * FROM sermons ORDER BY date DESC');
    res.json(result.rows);
  } catch (err) {
    logger.error({ err }, 'Failed to list sermons');
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM sermons WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    logger.error({ err }, 'Failed to get sermon');
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticate, requireAdmin, validate(sermonSchema), auditLog('create', 'sermon'), async (req, res) => {
  const { title, speaker, date, thumbnail, audio_url, video_url, description, status } = req.body;
  try {
    const result = await query(
      `INSERT INTO sermons (title, speaker, date, thumbnail, audio_url, video_url, description, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [title, speaker, date, thumbnail, audio_url, video_url, description, status || 'published']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    logger.error({ err }, 'Failed to create sermon');
    res.status(400).json({ error: 'Failed to create sermon' });
  }
});

router.put('/:id', authenticate, requireAdmin, validate(sermonSchema), auditLog('update', 'sermon'), async (req, res) => {
  const { title, speaker, date, thumbnail, audio_url, video_url, description, status } = req.body;
  try {
    if (thumbnail !== undefined) {
      const old = await query('SELECT thumbnail FROM sermons WHERE id=$1', [req.params.id]);
      const oldUrl = old.rows[0]?.thumbnail;
      if (isCloudinaryUrl(oldUrl) && oldUrl !== thumbnail) {
        await deleteCloudinaryImage(oldUrl);
      }
    }
    const result = await query(
      `UPDATE sermons SET title=$1, speaker=$2, date=$3, thumbnail=$4, audio_url=$5, video_url=$6, description=$7, status=$8
       WHERE id=$9 RETURNING *`,
      [title, speaker, date, thumbnail, audio_url, video_url, description, status, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    logger.error({ err }, 'Failed to update sermon');
    res.status(400).json({ error: 'Failed to update sermon' });
  }
});

router.delete('/:id', authenticate, requireAdmin, auditLog('delete', 'sermon'), async (req, res) => {
  try {
    const result = await query('DELETE FROM sermons WHERE id=$1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
  } catch (err) {
    logger.error({ err }, 'Failed to delete sermon');
    res.status(400).json({ error: 'Failed to delete sermon' });
  }
});

export default router;
