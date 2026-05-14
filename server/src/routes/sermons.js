import { Router } from 'express';
import { supabaseAdmin } from '../supabase.js';

const router = Router();

// GET /api/sermons
router.get('/', async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('sermons')
    .select('*')
    .order('date', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/sermons/:id
router.get('/:id', async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('sermons')
    .select('*')
    .eq('id', req.params.id)
    .single();
  if (error) return res.status(404).json({ error: 'Not found' });
  res.json(data);
});

// POST /api/sermons (admin)
router.post('/', async (req, res) => {
  const { title, speaker, date, thumbnail, audio_url, video_url } = req.body;
  const { data, error } = await supabaseAdmin
    .from('sermons')
    .insert({ title, speaker, date, thumbnail, audio_url, video_url })
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// PUT /api/sermons/:id (admin)
router.put('/:id', async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('sermons')
    .update(req.body)
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// DELETE /api/sermons/:id (admin)
router.delete('/:id', async (req, res) => {
  const { error } = await supabaseAdmin
    .from('sermons')
    .delete()
    .eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).end();
});

export default router;
