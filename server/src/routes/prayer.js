import { Router } from 'express';
import { supabaseAdmin } from '../supabase.js';

const router = Router();

// POST /api/prayer — public
router.post('/', async (req, res) => {
  const { name, email, phone, prayer_type, request, is_confidential, is_urgent } = req.body;
  const { data, error } = await supabaseAdmin
    .from('prayer_requests')
    .insert({ name, email, phone, prayer_type, request, is_confidential, is_urgent })
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ success: true, id: data.id });
});

export default router;
