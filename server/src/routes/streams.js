import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM streams ORDER BY scheduled_at DESC LIMIT 1'
    );
    res.json(result.rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
