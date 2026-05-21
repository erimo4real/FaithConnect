import { Router } from 'express';
import { query } from '../db.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { paginate } from '../paginate.js';
import { auditLog } from '../middleware/audit.js';
import { deleteCloudinaryImage, isCloudinaryUrl } from '../utils/cloudinary.js';
import logger from '../config/logger.js';
import { validate } from '../middleware/validate.js';
import { gallerySchema } from '../schemas/index.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { limit, offset, hasPagination } = paginate(req);
    if (hasPagination) {
      const count = await query('SELECT COUNT(*) FROM gallery');
      const total = parseInt(count.rows[0].count);
      const result = await query('SELECT * FROM gallery ORDER BY created_at DESC LIMIT $1 OFFSET $2', [limit, offset]);
      return res.json({ data: result.rows, total, page: Math.max(parseInt(req.query.page) || 1, 1), limit });
    }
    const result = await query('SELECT * FROM gallery ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    logger.error({ err }, 'Failed to list gallery');
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticate, requireAdmin, validate(gallerySchema), auditLog('create', 'gallery'), async (req, res) => {
  const { title, description, src, category, type, thumbnail } = req.body;
  try {
    const result = await query(
      `INSERT INTO gallery (title, description, src, category, type, thumbnail)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, description, src, category || 'worship', type || 'image', thumbnail]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    logger.error({ err }, 'Failed to create gallery item');
    res.status(400).json({ error: 'Failed to create gallery item' });
  }
});

router.put('/:id', authenticate, requireAdmin, validate(gallerySchema), auditLog('update', 'gallery'), async (req, res) => {
  const { title, description, src, category, type, thumbnail } = req.body;
  try {
    const old = await query('SELECT src, thumbnail FROM gallery WHERE id=$1', [req.params.id]);
    const oldRow = old.rows[0];
    if (oldRow) {
      if (src !== undefined && isCloudinaryUrl(oldRow.src) && oldRow.src !== src) {
        await deleteCloudinaryImage(oldRow.src);
      }
      if (thumbnail !== undefined && isCloudinaryUrl(oldRow.thumbnail) && oldRow.thumbnail !== thumbnail) {
        await deleteCloudinaryImage(oldRow.thumbnail);
      }
    }
    const result = await query(
      `UPDATE gallery SET title=$1, description=$2, src=$3, category=$4, type=$5, thumbnail=$6
       WHERE id=$7 RETURNING *`,
      [title, description, src, category, type, thumbnail, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    logger.error({ err }, 'Failed to update gallery item');
    res.status(400).json({ error: 'Failed to update gallery item' });
  }
});

router.delete('/:id', authenticate, requireAdmin, auditLog('delete', 'gallery'), async (req, res) => {
  try {
    const result = await query('DELETE FROM gallery WHERE id=$1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
  } catch (err) {
    logger.error({ err }, 'Failed to delete gallery item');
    res.status(400).json({ error: 'Failed to delete gallery item' });
  }
});

export default router;
