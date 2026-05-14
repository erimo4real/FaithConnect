import { Router } from 'express';
import { supabaseAdmin } from '../supabase.js';

const router = Router();

// POST /api/contact — public
router.post('/', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  const { data, error } = await supabaseAdmin
    .from('contact_messages')
    .insert({ name, email, phone, subject, message })
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ success: true, id: data.id });
});

export default router;
