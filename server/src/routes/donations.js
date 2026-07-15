import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { query } from '../db.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { paginate } from '../paginate.js';
import { auditLog } from '../middleware/audit.js';
import { validate } from '../middleware/validate.js';
import { donationSchema } from '../schemas/index.js';
import { paystackPost, paystackGet, paystackFindOrCreatePlan, generateReference } from '../config/paystack.js';
import logger from '../config/logger.js';

const router = Router();

// Dedicated limiter for donation initialize — 10 attempts per 15 minutes per IP
const initLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many donation attempts, try again later' },
});

// Paystack recurring intervals
const INTERVAL_MAP = { weekly: 'weekly', tithe: 'monthly', monthly: 'monthly', yearly: 'yearly' };

router.post('/initialize', initLimiter, validate(donationSchema), async (req, res) => {
  const { name, email, phone, amount, type, cause, message } = req.body;
  const reference = generateReference();
  const amountKobo = Math.round(amount * 100);

  try {
    await query(
      `INSERT INTO donations (name, email, phone, amount, type, cause, message, reference, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')`,
      [name, email, phone, String(amount), type || 'one-time', cause || 'general', message, reference]
    );

    const callbackUrl = (process.env.PAYSTACK_CALLBACK_URL || process.env.CLIENT_URL || 'http://localhost:5173') + '/donation/success';

    const body = {
      email,
      amount: amountKobo,
      reference,
      callback_url: callbackUrl,
      metadata: { donation_ref: reference, name, cause: cause || 'general', type: type || 'one-time' },
    };

    if (type && type !== 'one-time') {
      const interval = INTERVAL_MAP[type];
      if (interval) {
        const planCode = await paystackFindOrCreatePlan(
          `Bethel - ${cause || 'General'} (${type})`,
          amountKobo,
          interval,
          `${cause || 'General'} donation - ${type}`
        );
        body.plan = planCode;
      }
    }

    const result = await paystackPost('/transaction/initialize', body);
    res.json({ authorization_url: result.data.authorization_url, reference: result.data.reference });
  } catch (err) {
    await query("UPDATE donations SET status='failed' WHERE reference=$1", [reference]).catch(() => {});
    logger.error({ err }, 'Failed to initialize Paystack payment');
    res.status(400).json({ error: err.message || 'Failed to initialize payment' });
  }
});

// Verify a donation transaction with Paystack
router.get('/verify/:reference', authenticate, requireAdmin, async (req, res) => {
  try {
    const result = await paystackGet(`/transaction/verify/${req.params.reference}`);
    res.json(result.data);
  } catch (err) {
    logger.error({ err, ref: req.params.reference }, 'Failed to verify transaction');
    res.status(400).json({ error: err.message || 'Failed to verify transaction' });
  }
});

// Public verify endpoint for success page
router.get('/verify-public/:reference', async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM donations WHERE reference=$1', [req.params.reference]);
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    const donation = rows[0];

    // Verify with Paystack
    const psResult = await paystackGet(`/transaction/verify/${req.params.reference}`);
    const psData = psResult.data;

    res.json({
      status: donation.status,
      paystack_status: psData.status,
      amount: donation.amount,
      type: donation.type,
      cause: donation.cause,
      reference: donation.reference,
      created_at: donation.created_at,
    });
  } catch (err) {
    // Fallback: return DB status if Paystack verify fails
    try {
      const { rows } = await query('SELECT status, amount, type, cause, reference, created_at FROM donations WHERE reference=$1', [req.params.reference]);
      if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
      return res.json({ ...rows[0], paystack_status: 'unavailable' });
    } catch (dbErr) {
      logger.error({ err: dbErr }, 'Fallback DB query failed');
      return res.status(400).json({ error: 'Verification unavailable' });
    }
  }
});

router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { limit, offset, hasPagination } = paginate(req);
    const search = req.query.search || '';
    const statusFilter = req.query.status || '';

    const conditions = [];
    const params = [];
    let idx = 1;

    if (search) {
      conditions.push(`(name ILIKE $${idx} OR email ILIKE $${idx} OR reference ILIKE $${idx} OR cause ILIKE $${idx})`);
      params.push(`%${search}%`);
      idx++;
    }
    if (statusFilter) {
      conditions.push(`status = $${idx}`);
      params.push(statusFilter);
      idx++;
    }

    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    if (hasPagination) {
      const countResult = await query(`SELECT COUNT(*) FROM donations ${where}`, params);
      const total = parseInt(countResult.rows[0].count);
      const result = await query(
        `SELECT * FROM donations ${where} ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`,
        [...params, limit, offset]
      );
      return res.json({ data: result.rows, total, page: Math.max(parseInt(req.query.page) || 1, 1), limit });
    }

    const result = await query(`SELECT * FROM donations ${where} ORDER BY created_at DESC`, params);
    res.json(result.rows);
  } catch (err) {
    logger.error({ err }, 'Failed to list donations');
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const result = await query('SELECT * FROM donations WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    logger.error({ err }, 'Failed to get donation');
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', authenticate, requireAdmin, auditLog('update', 'donation'), async (req, res) => {
  const { status } = req.body;
  const allowed = ['pending', 'completed', 'failed', 'cancelled', 'refunded'];
  if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  try {
    const result = await query(
      'UPDATE donations SET status=$1 WHERE id=$2 RETURNING *',
      [status, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    logger.error({ err }, 'Failed to update donation');
    res.status(400).json({ error: 'Failed to update donation' });
  }
});

router.post('/:id/cancel-subscription', authenticate, requireAdmin, auditLog('cancel_subscription', 'donation'), async (req, res) => {
  try {
    const result = await query('SELECT * FROM donations WHERE id=$1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    const donation = result.rows[0];
    if (!donation.subscription_code) return res.status(400).json({ error: 'No subscription to cancel' });

    await paystackPost(`/subscription/disable`, {
      code: donation.subscription_code,
      token: process.env.PAYSTACK_SECRET_KEY,
    });
    await query("UPDATE donations SET status='cancelled' WHERE id=$1", [donation.id]);
    logger.info({ subscription: donation.subscription_code }, 'Subscription cancelled');
    res.json({ message: 'Subscription cancelled' });
  } catch (err) {
    logger.error({ err }, 'Failed to cancel subscription');
    res.status(400).json({ error: err.message || 'Failed to cancel subscription' });
  }
});

router.delete('/:id', authenticate, requireAdmin, auditLog('delete', 'donation'), async (req, res) => {
  try {
    const result = await query('DELETE FROM donations WHERE id=$1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
  } catch (err) {
    logger.error({ err }, 'Failed to delete donation');
    res.status(400).json({ error: 'Failed to delete donation' });
  }
});

// Refund a donation via Paystack
router.post('/:id/refund', authenticate, requireAdmin, auditLog('refund', 'donation'), async (req, res) => {
  try {
    const result = await query('SELECT * FROM donations WHERE id=$1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    const donation = result.rows[0];
    if (donation.status !== 'completed') return res.status(400).json({ error: 'Only completed donations can be refunded' });
    if (!donation.reference) return res.status(400).json({ error: 'No payment reference found' });

    const refundResult = await paystackPost('/refund', {
      transaction: donation.reference,
      amount: Math.round(Number(donation.amount) * 100),
    });
    await query("UPDATE donations SET status='refunded' WHERE id=$1", [donation.id]);
    logger.info({ reference: donation.reference }, 'Donation refunded');
    res.json({ message: 'Refund processed', data: refundResult.data });
  } catch (err) {
    logger.error({ err }, 'Failed to refund donation');
    res.status(400).json({ error: err.message || 'Failed to refund donation' });
  }
});

// Re-send donation receipt email
router.post('/:id/resend-receipt', authenticate, requireAdmin, auditLog('resend_receipt', 'donation'), async (req, res) => {
  try {
    const result = await query('SELECT * FROM donations WHERE id=$1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    const donation = result.rows[0];
    if (!donation.email) return res.status(400).json({ error: 'No email on record' });

    const { sendDonationReceipt } = await import('../config/email.js');
    await sendDonationReceipt(donation);
    logger.info({ reference: donation.reference }, 'Receipt re-sent');
    res.json({ message: 'Receipt sent' });
  } catch (err) {
    logger.error({ err }, 'Failed to re-send receipt');
    res.status(400).json({ error: err.message || 'Failed to send receipt' });
  }
});

export default router;
