import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

router.post('/', async (req, res) => {
  const { name, email, phone, prayer_type, request, is_confidential, is_urgent } = req.body;
  try {
    const result = await query(
      `INSERT INTO prayer_requests (name, email, phone, prayer_type, request, is_confidential, is_urgent)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [name, email, phone, prayer_type || 'personal', request, is_confidential || false, is_urgent || false]
    );
    res.status(201).json({ success: true, id: result.rows[0].id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
