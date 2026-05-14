import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

router.post('/', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  try {
    const result = await query(
      `INSERT INTO contact_messages (name, email, phone, subject, message)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [name, email, phone || '', subject, message]
    );
    res.status(201).json({ success: true, id: result.rows[0].id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
