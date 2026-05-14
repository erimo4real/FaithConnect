import { Router } from 'express';
import { supabaseAdmin } from '../supabase.js';

const router = Router();

router.get('/', async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('streams')
    .select('*')
    .order('scheduled_at', { ascending: false })
    .limit(1)
    .single();
  if (error && error.code !== 'PGRST116') return res.status(500).json({ error: error.message });
  res.json(data || null);
});

export default router;
