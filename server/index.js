import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from './src/config/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import authRouter from './src/routes/auth.js';
import sermonsRouter from './src/routes/sermons.js';
import eventsRouter from './src/routes/events.js';
import blogRouter from './src/routes/blog.js';
import galleryRouter from './src/routes/gallery.js';
import prayerRouter from './src/routes/prayer.js';
import contactRouter from './src/routes/contact.js';
import streamsRouter from './src/routes/streams.js';
import donationsRouter from './src/routes/donations.js';
import ordersRouter from './src/routes/orders.js';
import subscribersRouter from './src/routes/subscribers.js';
import uploadRouter from './src/routes/upload.js';
import usersRouter from './src/routes/users.js';
import { exportCSV } from './src/export.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Security
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Auth routes — before rate limiter so login/register never get blocked
app.use('/api/auth', authRouter);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { error: 'Too many requests, try again later' },
});
app.use('/api/', limiter);

// Content routes
app.use('/api/sermons', sermonsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/blog', blogRouter);
app.use('/api/gallery', galleryRouter);
app.use('/api/prayer', prayerRouter);
app.use('/api/contact', contactRouter);
app.use('/api/streams', streamsRouter);
app.use('/api/donations', donationsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/subscribers', subscribersRouter);
app.use('/api/users', usersRouter);

// Uploads
app.use('/api/uploads', uploadRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// CSV Export
app.use('/api/export', exportCSV);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler — logs real error, returns clean message
app.use((err, req, res, next) => {
  logger.error({ err, path: req.path, method: req.method }, 'Unhandled error');
  res.status(err.status || 500).json({ error: 'Internal server error' });
});

// Auto-activate/deactivate streams based on schedule
import { query } from './src/db.js';

setInterval(async () => {
  try {
    const { rows: activated } = await query(
      `UPDATE streams SET is_live = true, manually_stopped = false, last_activated_at = NOW()
       WHERE is_live = false
       AND manually_stopped = false
       AND (
         (recurring = 'weekly' AND EXTRACT(DOW FROM scheduled_date) = EXTRACT(DOW FROM CURRENT_DATE) AND scheduled_time <= CURRENT_TIME AND (end_time IS NULL OR end_time > CURRENT_TIME))
         OR (recurring IS NULL AND scheduled_date = CURRENT_DATE AND scheduled_time <= CURRENT_TIME AND (end_time IS NULL OR end_time > CURRENT_TIME))
       )
       RETURNING title`
    );
    if (activated.length) {
      logger.info({ streams: activated.map(r => r.title) }, 'Auto-activated streams');
    }

    const { rows: deactivated } = await query(
      `UPDATE streams SET is_live = false
       WHERE is_live = true
       AND (
         (recurring = 'weekly' AND end_time IS NOT NULL AND end_time <= CURRENT_TIME)
         OR (recurring IS NULL AND (scheduled_date < CURRENT_DATE OR (scheduled_date = CURRENT_DATE AND end_time IS NOT NULL AND end_time <= CURRENT_TIME)))
       )
       RETURNING id, title, youtube_url, last_activated_at`
    );

    if (deactivated.length) {
      logger.info({ streams: deactivated.map(r => r.title) }, 'Auto-deactivated streams');
      for (const s of deactivated) {
        await query(
          `INSERT INTO stream_logs (stream_id, title, youtube_url, activated_at, deactivated_at)
           VALUES ($1, $2, $3, COALESCE($4, NOW()), NOW())`,
          [s.id, s.title, s.youtube_url, s.last_activated_at]
        );
      }
    }
  } catch (err) {
    logger.error({ err }, 'Stream auto-activation error');
  }
}, 30000);

app.listen(PORT, () => {
  logger.info({ port: PORT }, 'Bethel Church API started');
});
