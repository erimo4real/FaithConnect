import { Router } from 'express';
import { query } from '../db.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { paginate } from '../paginate.js';
import { auditLog } from '../middleware/audit.js';
import { deleteCloudinaryImage, isCloudinaryUrl } from '../utils/cloudinary.js';
import logger from '../config/logger.js';
import { validate } from '../middleware/validate.js';
import { blogSchema } from '../schemas/index.js';

const router = Router();

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'post';
}

router.get('/', async (req, res) => {
  try {
    const { limit, offset, hasPagination } = paginate(req);
    if (hasPagination) {
      const count = await query('SELECT COUNT(*) FROM blog_posts');
      const total = parseInt(count.rows[0].count);
      const result = await query('SELECT * FROM blog_posts ORDER BY date DESC LIMIT $1 OFFSET $2', [limit, offset]);
      return res.json({ data: result.rows, total, page: Math.max(parseInt(req.query.page) || 1, 1), limit });
    }
    const result = await query('SELECT * FROM blog_posts ORDER BY date DESC');
    res.json(result.rows);
  } catch (err) {
    logger.error({ err }, 'Failed to list blog posts');
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM blog_posts WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    logger.error({ err }, 'Failed to get blog post');
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticate, requireAdmin, validate(blogSchema), auditLog('create', 'blog'), async (req, res) => {
  const { title, author, date, category, image, excerpt, content, slug, meta_description, status } = req.body;
  try {
    const postSlug = slug || slugify(title);
    const result = await query(
      `INSERT INTO blog_posts (title, author, date, category, image, excerpt, content, slug, meta_description, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [title, author, date || new Date(), category, image, excerpt, content, postSlug, meta_description, status || 'published']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    logger.error({ err }, 'Failed to create blog post');
    res.status(400).json({ error: 'Failed to create blog post' });
  }
});

router.put('/:id', authenticate, requireAdmin, validate(blogSchema), auditLog('update', 'blog'), async (req, res) => {
  const { title, author, date, category, image, excerpt, content, slug, meta_description, status } = req.body;
  try {
    if (image !== undefined) {
      const old = await query('SELECT image FROM blog_posts WHERE id=$1', [req.params.id]);
      const oldUrl = old.rows[0]?.image;
      if (isCloudinaryUrl(oldUrl) && oldUrl !== image) {
        await deleteCloudinaryImage(oldUrl);
      }
    }
    const postSlug = slug || slugify(title);
    const result = await query(
      `UPDATE blog_posts SET title=$1, author=$2, date=$3, category=$4, image=$5, excerpt=$6, content=$7, slug=$8, meta_description=$9, status=$10
       WHERE id=$11 RETURNING *`,
      [title, author, date, category, image, excerpt, content, postSlug, meta_description, status, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    logger.error({ err }, 'Failed to update blog post');
    res.status(400).json({ error: 'Failed to update blog post' });
  }
});

router.delete('/:id', authenticate, requireAdmin, auditLog('delete', 'blog'), async (req, res) => {
  try {
    const result = await query('DELETE FROM blog_posts WHERE id=$1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
  } catch (err) {
    logger.error({ err }, 'Failed to delete blog post');
    res.status(400).json({ error: 'Failed to delete blog post' });
  }
});

export default router;
