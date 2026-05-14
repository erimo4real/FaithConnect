import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { supabase } from './src/supabase.js';

import sermonsRouter from './src/routes/sermons.js';
import eventsRouter from './src/routes/events.js';
import blogRouter from './src/routes/blog.js';
import galleryRouter from './src/routes/gallery.js';
import prayerRouter from './src/routes/prayer.js';
import contactRouter from './src/routes/contact.js';
import streamsRouter from './src/routes/streams.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Security
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, try again later' },
});
app.use('/api/', limiter);

// Routes
app.use('/api/sermons', sermonsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/blog', blogRouter);
app.use('/api/gallery', galleryRouter);
app.use('/api/prayer', prayerRouter);
app.use('/api/contact', contactRouter);
app.use('/api/streams', streamsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Bethel Church API running on port ${PORT}`);
});
