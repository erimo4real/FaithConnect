import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from './src/config/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.on('unhandledRejection', (reason) => {
  logger.error({ err: reason }, 'Unhandled promise rejection');
});

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
import versesRouter from './src/routes/verses.js';
import { exportCSV } from './src/export.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Security
app.use(helmet());
const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/+$/, '');
app.use(cors({
  origin: [clientUrl, 'https://bethel-church-wonder-city.netlify.app', 'https://bethelchurchng.com', 'https://www.bethelchurchng.com', 'http://localhost:5173'],
  credentials: true,
}));

// Paystack webhook — raw body needed for HMAC verification (must be before express.json)
app.post('/api/donations/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['x-paystack-signature'];
  if (!signature) return res.status(401).json({ error: 'Missing signature' });

  const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
    .update(req.body).digest('hex');
  if (hash !== signature) return res.status(401).json({ error: 'Invalid signature' });

  try {
    const event = JSON.parse(req.body.toString());
    const { data } = event;

    // Log every webhook event for debugging
    await query(
      `INSERT INTO event_logs (event_type, reference, payload) VALUES ($1, $2, $3)`,
      [event.event, data?.reference || data?.subscription_code || 'unknown', JSON.stringify(event)]
    ).catch(() => {});

    if (event.event === 'charge.success') {
      // Idempotency check — skip if already completed
      const existing = await query("SELECT status, subscription_code FROM donations WHERE reference=$1", [data.reference]);
      if (existing.rows.length > 0 && existing.rows[0].status === 'completed') {
        logger.info({ reference: data.reference }, 'charge.success already processed, skipping');
        return res.status(200).end();
      }

      // Save subscription_code if present (may arrive before subscription.create)
      if (data.subscription_code || data.customer?.customer_code) {
        await query(
          "UPDATE donations SET status='completed', subscription_code=COALESCE($1, subscription_code), paystack_customer_code=COALESCE($2, paystack_customer_code) WHERE reference=$3",
          [data.subscription_code, data.customer?.customer_code, data.reference]
        );
      } else {
        await query("UPDATE donations SET status='completed' WHERE reference=$1", [data.reference]);
      }
      logger.info({ reference: data.reference, amount: data.amount, subscription: data.subscription_code || 'none' }, 'Donation completed via webhook');

      const { rows } = await query("SELECT * FROM donations WHERE reference=$1", [data.reference]);
      const donation = rows[0];
      if (donation?.email && process.env.SMTP_USER) {
        try {
          const { sendDonationReceipt } = await import('./src/config/email.js');
          await sendDonationReceipt(donation);
        } catch (emailErr) {
          logger.error({ err: emailErr }, 'Failed to send receipt email');
        }
      }
    }

    if (event.event === 'subscription.create') {
      await query(
        "UPDATE donations SET subscription_code=$1, paystack_customer_code=$2 WHERE reference=$3",
        [data.subscription_code, data.customer?.customer_code, data.reference]
      );
      logger.info({ subscription: data.subscription_code }, 'Subscription created');
    }

    // Track recurring billing events
    if (event.event === 'invoice.create' || event.event === 'invoice.update') {
      logger.info({ invoice: data.reference, subscription: data.subscription?.subscription_code }, `Invoice ${event.event}`);
    }

    // Handle payment failure
    if (event.event === 'invoice.payment_failed') {
      const subCode = data.subscription?.subscription_code;
      if (subCode) {
        await query("UPDATE donations SET status='failed' WHERE subscription_code=$1", [subCode]);
        logger.info({ subscription: subCode }, 'Subscription payment failed');
      }
    }

    // Handle subscription disabled (cancelled from Paystack side)
    if (event.event === 'subscription.disable') {
      const subCode = data.subscription_code || data.code;
      if (subCode) {
        await query("UPDATE donations SET status='cancelled' WHERE subscription_code=$1", [subCode]);
        logger.info({ subscription: subCode }, 'Subscription disabled via webhook');
      }
    }

    res.status(200).end();
  } catch (err) {
    logger.error({ err }, 'Webhook processing error');
    // Return 500 so Paystack retries
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

app.use(express.json());
app.use(cookieParser());

// Rate limiting — applied before auth routes to protect login/register too
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { error: 'Too many requests, try again later' },
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many login attempts, try again later' },
});
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { error: 'Too many uploads, try again later' },
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);
app.use('/api/auth/reset-password', authLimiter);
app.use('/api/uploads', uploadLimiter);
app.use('/api/', limiter);

// Auth routes
app.use('/api/auth', authRouter);

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
app.use('/api/verses', versesRouter);

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
    const lagosDate = "(NOW() AT TIME ZONE 'Africa/Lagos')::date";
    const lagosTime = "(NOW() AT TIME ZONE 'Africa/Lagos')::time";

    const { rows: activated } = await query(
      `UPDATE streams SET is_live = true, manually_stopped = false, last_activated_at = NOW()
       WHERE is_live = false
       AND manually_stopped = false
       AND (last_activated_at IS NULL OR last_activated_at::date < ${lagosDate})
       AND (
         (recurring = 'weekly' AND EXTRACT(DOW FROM scheduled_date) = EXTRACT(DOW FROM ${lagosDate}) AND scheduled_time <= ${lagosTime} AND (
           end_time IS NULL
           OR (end_time > scheduled_time AND end_time > ${lagosTime})
           OR (end_time <= scheduled_time AND ${lagosTime} <= '23:59'::time)
         ))
         OR ((recurring IS NULL OR recurring = '') AND scheduled_date = ${lagosDate} AND scheduled_time <= ${lagosTime} AND (
           end_time IS NULL
           OR (end_time > scheduled_time AND end_time > ${lagosTime})
           OR (end_time <= scheduled_time AND ${lagosTime} <= '23:59'::time)
         ))
       )
       RETURNING title`
    );
    if (activated.length) {
      logger.info({ streams: activated.map(r => r.title) }, 'Auto-activated streams');
    }

    const { rows: deactivated } = await query(
      `UPDATE streams SET is_live = false
       WHERE is_live = true
       AND end_time IS NOT NULL
       AND (
         (recurring = 'weekly' AND (
           (end_time > scheduled_time AND end_time <= ${lagosTime})
           OR (end_time <= scheduled_time AND end_time <= ${lagosTime} AND ${lagosTime} < scheduled_time AND scheduled_time - ${lagosTime} > INTERVAL '12 hours')
         ))
         OR ((recurring IS NULL OR recurring = '') AND (
           (end_time > scheduled_time AND scheduled_date < ${lagosDate})
           OR (scheduled_date = ${lagosDate} AND end_time > scheduled_time AND end_time <= ${lagosTime})
           OR (scheduled_date = ${lagosDate} - INTERVAL '1 day' AND end_time <= scheduled_time AND end_time <= ${lagosTime} AND ${lagosTime} < scheduled_time AND scheduled_time - ${lagosTime} > INTERVAL '12 hours')
         ))
       )
       RETURNING id, title, youtube_url, last_activated_at`
    );

    if (deactivated.length) {
      logger.info({ streams: deactivated.map(r => r.title) }, 'Auto-deactivated streams');
      for (const s of deactivated) {
        await query(
          `DELETE FROM stream_logs WHERE stream_id = $1 AND deactivated_at::date = (NOW() AT TIME ZONE 'Africa/Lagos')::date`
        , [s.id]);
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

// Auto-publish bible verses by scheduled date + auto-schedule on Tue/Thu (Option C)
setInterval(async () => {
  try {
    const lagosDate = "(NOW() AT TIME ZONE 'Africa/Lagos')::date";
    const lagosDow = "EXTRACT(DOW FROM (NOW() AT TIME ZONE 'Africa/Lagos'))";

    // Publish verses whose scheduled date has arrived
    const { rows: published } = await query(
      `UPDATE bible_verses SET is_published = true
       WHERE is_published = false AND scheduled_date <= ${lagosDate}
       RETURNING reference`
    );
    if (published.length) {
      logger.info({ verses: published.map(r => r.reference) }, 'Auto-published bible verses by scheduled date');
    }

    // On Tuesdays (2) and Thursdays (4), auto-assign the next unscheduled verse
    const { rows: autoScheduled } = await query(
      `UPDATE bible_verses SET scheduled_date = ${lagosDate}, is_published = true
       WHERE id = (
         SELECT id FROM bible_verses
         WHERE is_published = false AND scheduled_date IS NULL
         ORDER BY created_at ASC
         LIMIT 1
       )
       AND ${lagosDow} IN (2, 4)
       AND NOT EXISTS (
         SELECT 1 FROM bible_verses
         WHERE is_published = true AND scheduled_date = ${lagosDate}
       )
       RETURNING reference`
    );
    if (autoScheduled.length) {
      logger.info({ verses: autoScheduled.map(r => r.reference) }, 'Auto-scheduled bible verses for today');
    }
  } catch (err) {
    logger.error({ err }, 'Verse auto-publish error');
  }
}, 60000);

// Auto-init tables on local PostgreSQL
(async () => {
  const dbUrl = process.env.DATABASE_URL || '';
  if (!dbUrl.includes('localhost') && !dbUrl.includes('127.0.0.1')) return;
  try {
    const { readFileSync } = await import('fs');
    const { join, dirname } = await import('path');
    const { fileURLToPath } = await import('url');
    const __d = dirname(fileURLToPath(import.meta.url));
    const sql = readFileSync(join(__d, 'init.sql'), 'utf8');
    const stmts = sql.split(';').map(s => s.trim()).filter(s => s && !s.startsWith('--') && !s.startsWith('DROP'));
    for (const stmt of stmts) {
      try { await query(stmt + ';'); } catch (e) { /* table may already exist */ }
    }
    logger.info('Local tables initialized from init.sql');
  } catch (err) {
    logger.warn({ err }, 'Local init skipped');
  }
})();

// Auto-seed admin user on first startup
(async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL?.trim();
    const adminPassword = process.env.ADMIN_PASSWORD?.trim();
    if (adminEmail && adminPassword) {
      const existing = await query('SELECT id FROM users WHERE email = $1', [adminEmail]);
      if (existing.rows.length === 0) {
        const bcrypt = (await import('bcryptjs')).default;
        const hash = await bcrypt.hash(adminPassword, 12);
        await query(
          `INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, 'admin')`,
          ['Admin', adminEmail, hash]
        );
        logger.info({ email: adminEmail }, 'Admin user auto-created from env vars');
      }
    }
  } catch (err) {
    logger.warn({ err }, 'Admin auto-seed skipped (tables may not exist yet)');
  }
})();

app.listen(PORT, () => {
  logger.info({ port: PORT }, 'Bethel Church API started');
});
