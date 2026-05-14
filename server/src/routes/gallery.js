import { Router } from 'express';
import { supabaseAdmin } from '../supabase.js';

const router = Router();

router.get('/', async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default router;
