import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM sermons ORDER BY date DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM sermons WHERE id = $1', [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { title, speaker, date, thumbnail, audio_url, video_url } = req.body;
  try {
    const result = await query(
      `INSERT INTO sermons (title, speaker, date, thumbnail, audio_url, video_url)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, speaker, date, thumbnail, audio_url, video_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { title, speaker, date, thumbnail, audio_url, video_url } = req.body;
  try {
    const result = await query(
      `UPDATE sermons SET title=$1, speaker=$2, date=$3, thumbnail=$4, audio_url=$5, video_url=$6
       WHERE id=$7 RETURNING *`,
      [title, speaker, date, thumbnail, audio_url, video_url, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await query('DELETE FROM sermons WHERE id=$1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
