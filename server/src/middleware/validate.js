import logger from '../config/logger.js';

export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      logger.warn({ path: req.path, errors: result.error.issues }, 'Validation failed');
      return res.status(400).json({ error: result.error.issues[0]?.message || 'Invalid input' });
    }
    req.body = result.data;
    next();
  };
}
