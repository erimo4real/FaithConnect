import logger from './logger.js';

const SECRET = process.env.PAYSTACK_SECRET_KEY;
const BASE = 'https://api.paystack.co';

export async function paystackPost(endpoint, body) {
  const url = `${BASE}${endpoint}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SECRET}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!data.status) {
    logger.error({ endpoint, message: data.message }, 'Paystack POST failed');
    throw new Error(data.message || 'Paystack request failed');
  }
  return data;
}

export async function paystackGet(endpoint) {
  const url = `${BASE}${endpoint}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${SECRET}` },
  });
  const data = await res.json();
  if (!data.status) {
    logger.error({ endpoint, message: data.message }, 'Paystack GET failed');
    throw new Error(data.message || 'Paystack request failed');
  }
  return data;
}

export async function paystackFindOrCreatePlan(name, amountKobo, interval, description) {
  // Search existing plans by name
  let page = 1;
  while (true) {
    const result = await paystackGet(`/plan?perPage=50&page=${page}`);
    const plans = result.data || [];
    const match = plans.find(p => p.name === name && p.amount === amountKobo && p.interval === interval);
    if (match) return match.plan_code;
    if (plans.length < 50) break;
    page++;
  }
  // Create new plan
  const created = await paystackPost('/plan', { name, amount: amountKobo, interval, description });
  return created.data.plan_code;
}

export function generateReference() {
  return `DON-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}
