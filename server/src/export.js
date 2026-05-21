import { Router } from 'express';
import { query } from './db.js';
import { authenticate, requireAdmin } from './middleware/auth.js';

const ALLOWED = {
  subscribers: { table: 'subscribers', cols: ['email', 'created_at'] },
  donations: { table: 'donations', cols: ['name', 'email', 'amount', 'type', 'cause', 'status', 'created_at'] },
  orders: { table: 'orders', cols: ['customer_name', 'email', 'total', 'status', 'created_at'] },
  contact_messages: { table: 'contact_messages', cols: ['name', 'email', 'subject', 'status', 'created_at'] },
  prayer_requests: { table: 'prayer_requests', cols: ['name', 'email', 'prayer_type', 'status', 'created_at'] },
};

export const exportCSV = Router();

exportCSV.get('/:resource', authenticate, requireAdmin, async (req, res) => {
  const config = ALLOWED[req.params.resource];
  if (!config) return res.status(404).json({ error: 'Unknown export resource' });

  try {
    const result = await query(`SELECT ${config.cols.join(', ')} FROM ${config.table} ORDER BY created_at DESC`);
    const headers = config.cols.join(',');
    const rows = result.rows.map(row =>
      config.cols.map(c => {
        const val = row[c];
        if (val === null || val === undefined) return '';
        const s = String(val);
        return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
      }).join(',')
    ).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${req.params.resource}-${Date.now()}.csv"`);
    res.send(`${headers}\n${rows}`);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
