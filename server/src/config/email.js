import nodemailer from 'nodemailer';
import logger from './logger.js';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 465,
  secure: (parseInt(process.env.SMTP_PORT) || 465) === 465,
  requireTLS: (parseInt(process.env.SMTP_PORT) || 465) !== 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendResetEmail(to, resetUrl) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    logger.info({ to, resetUrl }, 'SMTP not configured — would send reset email');
    return;
  }
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'noreply@bethelchurch.com',
    to,
    subject: 'Reset your Bethel Church admin password',
    html: `<p>You requested a password reset.</p><p><a href="${resetUrl}">Click here to reset your password</a></p><p>This link expires in 1 hour.</p><p>If you did not request this, ignore this email.</p>`,
  });
}

export async function sendDonationReceipt(donation) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    logger.info({ email: donation.email, reference: donation.reference }, 'SMTP not configured — would send receipt');
    return;
  }
  const amount = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(donation.amount);
  const date = new Date(donation.created_at).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' });
  const cancelNote = donation.type !== 'one-time'
    ? `<p style="color:#666;font-size:14px;">To cancel your recurring donation, reply to this email or contact us.</p>`
    : '';

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'Bethel Church <noreply@bethelchurch.com>',
    to: donation.email,
    subject: `Donation Receipt — Bethel Church`,
    html: `
      <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;">
        <div style="background:#1e3a8a;color:white;padding:24px;text-align:center;border-radius:8px 8px 0 0;">
          <h1 style="margin:0;font-size:24px;">Bethel Church</h1>
        </div>
        <div style="padding:32px;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 8px 8px;">
          <p>Dear ${donation.name},</p>
          <p>Thank you for your generous donation!</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0;">
            <tr><td style="padding:8px 0;color:#666;">Amount:</td><td style="padding:8px 0;font-weight:bold;text-align:right;">${amount}</td></tr>
            <tr><td style="padding:8px 0;color:#666;">Reference:</td><td style="padding:8px 0;text-align:right;font-family:monospace;">${donation.reference}</td></tr>
            <tr><td style="padding:8px 0;color:#666;">Type:</td><td style="padding:8px 0;text-align:right;text-transform:capitalize;">${donation.type}</td></tr>
            <tr><td style="padding:8px 0;color:#666;">Cause:</td><td style="padding:8px 0;text-align:right;text-transform:capitalize;">${donation.cause}</td></tr>
            <tr><td style="padding:8px 0;color:#666;">Date:</td><td style="padding:8px 0;text-align:right;">${date}</td></tr>
          </table>
          ${cancelNote}
          <p style="color:#666;font-size:14px;margin-top:24px;">Bethel Church<br>bethelchurchng.com</p>
        </div>
      </div>
    `,
  });
  logger.info({ reference: donation.reference }, 'Receipt email sent');
}
